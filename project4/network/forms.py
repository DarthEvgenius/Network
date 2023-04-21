from django.forms import ModelForm, Textarea
from .models import Post

class PostForm(ModelForm):
    class Meta:
        model = Post
        fields = ["content"]
        widgets = {
            "content": Textarea(attrs={"cols":60, "rows": 3}),
		}
        labels = {
            "content": "Write something here:"
		}