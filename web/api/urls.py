from django.urls import path
from . import views

urlpatterns = [
    path('register/level', views.LevelUpdateView.as_view(), name='register-level'),
    path('register/rank', views.RankUpdateView.as_view(), name='register-rank'),
    path('register/apexability', views.ApexabilityCheckView.as_view(),
         name='register-apexability'),
    path('compat/level/register', views.CompatLevelUpdateView.as_view(),
         name='register-level-compat'),
    path('compat/rank/register', views.CompatRankUpdateView.as_view(),
         name='register-rank-compat'),
    path('view/level', views.level, name='view-level'),
    path('view/rank', views.rank, name='view-rank'),
    path('view/check', views.check, name='view-check'),
]
