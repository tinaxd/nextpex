from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Player(models.Model):
    display_name = models.CharField(
        max_length=50, unique=True, blank=False, null=False)

    def __str__(self):
        return f"Player {self.display_name}"


class InGameName(models.Model):
    player = models.ForeignKey(
        Player, blank=False, null=False, on_delete=models.CASCADE)
    in_game_name = models.CharField(blank=False, null=False, max_length=64)

    def __str__(self):
        return f'InGameName {self.in_game_name} for {self.player}'


class LevelUpdate(models.Model):
    player = models.ForeignKey(
        Player, blank=False, null=False, on_delete=models.CASCADE)
    old_level = models.IntegerField()
    new_level = models.IntegerField(blank=False, null=False)
    time = models.DateTimeField(blank=False, null=False)

    def as_dict(self):
        return {
            'player': self.player.display_name,
            'old_level': self.old_level,
            'new_level': self.new_level,
            'time': self.time
        }

    def __str__(self):
        return f'LevelUpdate of {self.player} from {self.old_level} to {self.new_level}'

    class Meta:
        indexes = [
            models.Index(fields=['-time'], name='lu_time_desc')
        ]


class RankUpdate(models.Model):
    class RankType(models.TextChoices):
        TRIO = 'trio', 'Trio'
        ARENA = 'arena', 'Arena'
    player = models.ForeignKey(
        Player, blank=False, null=False, on_delete=models.CASCADE)
    old_rank = models.IntegerField()
    new_rank = models.IntegerField(blank=False, null=False)
    rank_type = models.CharField(
        choices=RankType.choices, blank=False, null=False, max_length=10)
    time = models.DateTimeField(blank=False, null=False)
    old_rank_name = models.CharField(blank=False, null=False, max_length=20)
    new_rank_name = models.CharField(blank=False, null=False, max_length=20)

    def as_dict(self):
        return {
            'player': self.player.display_name,
            'old_rank': self.old_rank,
            'new_rank': self.new_rank,
            'rank_type': self.rank_type,
            'time': self.time,
            'old_rank_name': self.old_rank_name,
            'new_rank_name': self.new_rank_name
        }

    def __str__(self):
        return f'RankUpdate({self.rank_type}) of {self.player} from {self.old_rank} to {self.new_rank}'

    class Meta:
        indexes = [
            models.Index(fields=['-time'], name='ru_time_desc')
        ]


class Game(models.Model):
    name = models.CharField(max_length=64, blank=False,
                            null=False, unique=True)


class ApexabilityCheck(models.Model):
    class StartStopType(models.TextChoices):
        START = 'start', 'Start'
        STOP = 'stop', 'Stop'
    player = models.ForeignKey(
        Player, blank=False, null=False, on_delete=models.CASCADE)
    entry_type = models.CharField(
        choices=StartStopType.choices, blank=False, null=False, max_length=5)
    time = models.DateTimeField(blank=False, null=False)
    played_game = models.ForeignKey(
        Game, blank=True, null=True, on_delete=models.SET_NULL)

    def as_dict(self):
        return {
            'player': self.player.display_name,
            'entry_type': self.entry_type,
            'time': self.time
        }

    def __str__(self):
        return f'{self.player} {self.played_game} {self.entry_type}s at {self.time}'

    class Meta:
        indexes = [
            models.Index(fields=['-time'], name='check_time_desc')
        ]


class UserLink(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, blank=False, null=False)
    player = models.ForeignKey(
        Player, blank=False, null=False, on_delete=models.CASCADE)


class PendingUserLink(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, blank=False, null=False)
    player = models.ForeignKey(
        Player, blank=False, null=False, on_delete=models.CASCADE)
    requested_time = models.DateTimeField()
