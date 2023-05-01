from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from operator import attrgetter
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from .models import User, Post, Follow

from .forms import PostForm


def index(request):

    # if this is a POST request we need to process the form data
    if request.method == "POST":
        form = PostForm(request.POST)

        if form.is_valid():
            new_post = form.save(commit=False)
            new_post.author = request.user
            new_post.save()

            return HttpResponseRedirect(reverse("index"))

    # if a GET we'll create a blank form
    else:
        post_form = PostForm()

        # Get all posts in reverse order
        posts = Post.objects.all().order_by("-date")

        paginator = Paginator(posts, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        return render(request, "network/index.html", {
            "posts": posts,
            "page_obj": page_obj,
            "form": post_form
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def profile(request, user_id):

    profile = User.objects.get(pk=user_id)
    followers = Follow.objects.filter(target=profile).count()
    follows =  Follow.objects.filter(follower=profile).count()
    posts = Post.objects.filter(author=profile).order_by("-date")

    return render(request, "network/profile.html", {
        "profile": profile,
        "followers": followers,
        "follows": follows,
        "posts": posts,
    })


@login_required
def follow(request, target_id):
    """If the user is subscribed on target profile - it will unsubscribe. And vise versa."""

    target = User.objects.get(pk=target_id)
    follower = request.user

    try:
        is_subscribed = Follow.objects.get(target=target, follower=follower)
        is_subscribed.delete()
        return HttpResponse("just unsubscribed")
    except:
        f = Follow(target=target, follower=follower)
        f.save()
        return HttpResponse("just subscribed")


@login_required
def is_subscribed(request, target_id):
    """Check if user follows target profile"""

    target = User.objects.get(pk=target_id)
    follower = request.user

    try:
        Follow.objects.get(target=target, follower=follower)
        return HttpResponse("subscribed")
    except:
        return HttpResponse("unsubscribed")


@login_required
def following_posts(request):
    """Shows all followed posts"""

    # Get needed Follow instances
    follow = Follow.objects.filter(follower=request.user)

    # Get all following User instances
    followers = []
    for target in follow:
        u = User.objects.get(followed_by=target)
        followers.append(u)
    
    # Get all following Post instances
    posts = []
    for user in followers:
        # Get set of posts of current author
        user_posts = Post.objects.filter(author=user)
        # Append each post to main set
        for post in user_posts:
            posts.append(post)

    # Sort posts in reverse order by date
    posts = sorted(posts, key=attrgetter("date"), reverse=True)

    return render(request, "network/following.html", {
        "posts": posts
    })


@csrf_exempt
@login_required
def edit_post(request, post_id):
    """Author of the post can edit it"""

    if request.method != "POST":
        return HttpResponse({"error": "POST request required."}, status=400)
    
    # if request.method == "PUT":
    #     return HttpResponse({"error": "POST request required."}, status=400)
    
    if request.method == "POST":
        try:
            post = Post.objects.get(pk=post_id)
        except:
            return HttpResponse("Post doesn't exist.")

        if request.user == post.author:
            # Get data from request
            data = request.body
            # Decode data to text
            data = data.decode("utf-8")
            post.content = data
            post.save()
            return HttpResponse(data)


@login_required
def like_post(request, post_id):
    """Like/unlike post"""

    user = request.user

    try:
        post = Post.objects.get(pk=post_id)
    except:
        return JsonResponse({"error": "Post does not exist."}, status=400)

    # Check if user has already liked post
    if user in post.likes.all():
        # Remove user's like
        user.liked_posts.remove(post)
        count = post.likes.all().count()
        print("User out")
        return JsonResponse({
            "liked": False,
            "likes_count": count
            })
    else:
        # Set user's like
        user.liked_posts.add(post)
        count = post.likes.all().count()
        print("user in")
        return JsonResponse({
            "liked": True,
            "likes_count": count
            })

