from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

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

        return render(request, "network/index.html", {
            "posts": posts,
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
