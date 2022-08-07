from rest_framework import serializers
from rest_framework.exceptions import ValidationError, APIException
from web import models as wm
from datetime import datetime


class ObjectNotFoundError(APIException):
    status_code = 404
    default_detail = "Object not found"

    def __init__(self, object_name: str) -> None:
        self.detail = f"Specified {object_name} not found"


class LevelUpdateSerializer(serializers.Serializer):
    in_game_name = serializers.CharField()
    old_level = serializers.IntegerField(required=False)
    new_level = serializers.IntegerField()
    time = serializers.DateTimeField()

    def validate_in_game_name(self, value):
        if not wm.InGameName.objects.filter(in_game_name=value).exists():
            raise ObjectNotFoundError("in_game_name")
        return value

    def create(self, validated_data):
        player = wm.InGameName.objects.filter(
            in_game_name=validated_data['in_game_name']).first().player
        wm.LevelUpdate.objects.create(
            player=player, old_level=validated_data['old_level'], new_level=validated_data['new_level'], time=validated_data['time'])
        return validated_data


class RankUpdateSerializer(serializers.Serializer):
    in_game_name = serializers.CharField()
    old_rank = serializers.IntegerField(required=False)
    new_rank = serializers.IntegerField()
    rank_type = serializers.ChoiceField([('trio', 'Trio'), ('arena', 'Arena')])
    time = serializers.DateTimeField()
    old_rank_name = serializers.CharField()
    new_rank_name = serializers.CharField()

    def validate_in_game_name(self, value):
        if not wm.InGameName.objects.filter(in_game_name=value).exists():
            raise ObjectNotFoundError("in_game_name")
        return value

    def create(self, validated_data):
        player = wm.InGameName.objects.filter(
            in_game_name=validated_data['in_game_name']).first().player
        wm.RankUpdate.objects.create(player=player, old_rank=validated_data['old_rank'], new_rank=validated_data['new_rank'], time=validated_data[
                                     'time'], rank_type=validated_data['rank_type'], old_rank_name=validated_data['old_rank_name'], new_rank_name=validated_data['new_rank_name'])
        return validated_data


class ApexabilityCheckSerializer(serializers.Serializer):
    in_game_name = serializers.CharField()
    type = serializers.ChoiceField([('start', 'Start'), ('stop', 'Stop')])
    time = serializers.DateTimeField()
    game_name = serializers.CharField()

    def validate_in_game_name(self, value):
        if not wm.InGameName.objects.filter(in_game_name=value).exists():
            raise ObjectNotFoundError("in_game_name")
        return value

    def validate_game_name(self, value):
        if not wm.Game.objects.filter(name=value).exists():
            raise ObjectNotFoundError("game_name")
        return value

    def create(self, validated_data):
        player = wm.InGameName.objects.filter(
            in_game_name=validated_data['in_game_name']).first().player
        game = wm.Game.objects.filter(name=validated_data["game_name"]).first()
        wm.ApexabilityCheck.objects.create(
            player=player, entry_type=validated_data['type'], time=validated_data['time'], played_game=game)
        return validated_data


class CompatLevelUpdateSerializer(serializers.Serializer):
    player_name = serializers.CharField()
    old_rank = serializers.IntegerField(required=False)
    new_rank = serializers.IntegerField()
    timestamp = serializers.IntegerField()

    def validate_player_name(self, value):
        if not wm.InGameName.objects.filter(in_game_name=value).exists():
            raise ObjectNotFoundError("player_name")
        return value

    def create(self, validated_data):
        player = wm.InGameName.objects.filter(
            in_game_name=validated_data['player_name']).first().player
        time = datetime.fromtimestamp(validated_data['timestamp'])
        wm.LevelUpdate.objects.create(
            player=player, old_level=validated_data['old_rank'], new_level=validated_data['new_rank'], time=time)
        return validated_data


class CompatRankUpdateSerializer(serializers.Serializer):
    player_name = serializers.CharField()
    old_rank = serializers.IntegerField(required=False)
    new_rank = serializers.IntegerField()
    rank_type = serializers.ChoiceField([('trio', 'Trio'), ('arena', 'Arena')])
    timestamp = serializers.IntegerField()
    old_rank_name = serializers.CharField()
    new_rank_name = serializers.CharField()

    def validate_player_name(self, value):
        if not wm.InGameName.objects.filter(in_game_name=value).exists():
            raise ObjectNotFoundError("player_name")
        return value

    def create(self, validated_data):
        player = wm.InGameName.objects.filter(
            in_game_name=validated_data['player_name']).first().player
        time = datetime.fromtimestamp(validated_data['timestamp'])
        wm.RankUpdate.objects.create(player=player, old_rank=validated_data['old_rank'], new_rank=validated_data['new_rank'], time=time,
                                     rank_type=validated_data['rank_type'], old_rank_name=validated_data['old_rank_name'], new_rank_name=validated_data['new_rank_name'])
        return validated_data


class LevelUpdateSerializer(serializers.ModelSerializer):
    level = serializers.IntegerField(source='new_level')
    player = serializers.CharField(max_length=50, source='player.display_name')

    class Meta:
        model = wm.LevelUpdate
        fields = ['player', 'level', 'time']


class RankUpdateSerializer(serializers.ModelSerializer):
    rank = serializers.IntegerField(source='new_rank')
    rank_name = serializers.CharField(source='new_rank_name')
    player = serializers.CharField(max_length=50, source='player.display_name')

    class Meta:
        model = wm.RankUpdate
        fields = ['player', 'time', 'rank', 'rank_name', 'rank_type']


class CheckSerializer(serializers.ModelSerializer):
    player = serializers.CharField(max_length=50, source='player.display_name')
    game_name = serializers.CharField(
        max_length=64, source='played_game.name', allow_null=True)

    class Meta:
        model = wm.ApexabilityCheck
        fields = ['player', 'entry_type', 'time', 'game_name']
