from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

# Post
class Post(models.Model):
    # We can use related name from User model: Username.posts.all()
    # Or we can user built-in "_set" manager: Username_set.all()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.CharField(max_length=150)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author} on {self.date.strftime('%d %b %y, %H:%M:%S')}"



# Follower
# Liked posts for user