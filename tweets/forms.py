from django.forms import ModelForm, ValidationError
from .models import Tweet


class TweetForm(ModelForm):
    class Meta:
        model = Tweet
        fields = ['content']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['content']\
            .widget.attrs['placeholder'] = 'Escreva seu tweet'
        self.fields['content'].label = ''

    def clean_content(self):
        content = self.cleaned_data.get('content')
        if len(content) > 240:
            raise ValidationError('Esse tweet é muito longo!')
        elif len(content) == 0:
            raise ValidationError('Esse tweet é muito curto!')
        return content
