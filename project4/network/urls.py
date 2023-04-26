
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<int:user_id>", views.profile, name="profile"),
    path("profile/follow/<int:target_id>", views.follow, name="follow"),
    path("profile/is_subscribed/<int:target_id>", views.is_subscribed, name="is_subscribed"),
    path("following_posts", views.following_posts, name="following_posts"),
]
