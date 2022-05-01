from django.urls import path
from . import views

app_name = 'web'

urlpatterns = [
    path('rank', views.rank, name='rank'),
    path('level', views.level, name='level'),
    path('check', views.apexability, name='apexability'),
    path('account', views.account, name='account'),
    path('account/register', views.register_account, name='register-account'),
    path('account/login', views.login_account, name='login-account'),
    path('account/logout', views.logout_account, name='logout-account'),
    path('account/link', views.link_account, name='link-account'),
    path('account/link-approve', views.link_approve, name='link-approve'),
    path('check/register', views.manual_check, name='manual-check'),
]
