from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.Player)
admin.site.register(models.InGameName)
admin.site.register(models.LevelUpdate)
admin.site.register(models.RankUpdate)
admin.site.register(models.ApexabilityCheck)
admin.site.register(models.UserLink)
admin.site.register(models.PendingUserLink)
admin.site.register(models.Game)
