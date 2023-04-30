from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Post, Follow

class PostAdmin(admin.ModelAdmin):
    list_display = ("pk", "author", "content", "date")
    filter_horizontal = ("likes",)

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Follow)