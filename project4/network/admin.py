from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Post

class PostAdmin(admin.ModelAdmin):
    list_display = ("author", "content", "date")

# Register your models here.
admin.site.register(User, UserAdmin)
# admin.site.register(Post)
admin.site.register(Post, PostAdmin)