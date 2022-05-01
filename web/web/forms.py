from django import forms
from django.contrib.auth.models import User
from . import models


class RegisterForm(forms.ModelForm):
    password_confirm = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['username', 'password', 'password_confirm']

        widgets = {
            'password': forms.PasswordInput
        }

    def clean(self):
        cleaned_data = super().clean()
        p1 = cleaned_data.get("password")
        p2 = cleaned_data.get("password_confirm")
        if p1 != p2:
            raise forms.ValidationError(
                "password and password_confirm do not match", code='invalid')


class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)


class LinkForm(forms.Form):
    class PlayerField(forms.ModelChoiceField):
        def label_from_instance(self, obj):
            return obj.display_name

    player = PlayerField(
        queryset=models.Player.objects.all(), to_field_name='display_name')

    def clean(self):
        cleaned_data = super().clean()
        if cleaned_data.get("player") is None:
            raise forms.ValidationError("player is not set", code='invalid')


class CheckForm(forms.ModelForm):
    class Meta:
        model = models.ApexabilityCheck
        fields = ['entry_type', 'time']

        widgets = {
            'time': forms.DateTimeInput(attrs={"type": "datetime-local"})
        }
