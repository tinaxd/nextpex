from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from web import models as wm
from datetime import datetime


class LevelUpdateSerializer(serializers.Serializer):
    in_game_name = serializers.CharField()
    old_level = serializers.IntegerField(required=False)
    new_level = serializers.IntegerField()
    time = serializers.DateTimeField()

    def validate_in_game_name(self, value):
        if not wm.InGameName.objects.filter(in_game_name=value).exists():
            raise ValidationError("no players with that in_game_name exist")
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
            raise ValidationError("no players with that in_game_name exist")
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

    def validate_in_game_name(self, value):
        if not wm.InGameName.objects.filter(in_game_name=value).exists():
            raise ValidationError("no players with that in_game_name exist")
        return value

    def create(self, validated_data):
        player = wm.InGameName.objects.filter(
            in_game_name=validated_data['in_game_name']).first().player
        wm.ApexabilityCheck.objects.create(
            player=player, entry_type=validated_data['type'], time=validated_data['time'])
        return validated_data


class CompatLevelUpdateSerializer(serializers.Serializer):
    player_name = serializers.CharField()
    old_rank = serializers.IntegerField(required=False)
    new_rank = serializers.IntegerField()
    timestamp = serializers.IntegerField()

    def validate_player_name(self, value):
        if not wm.InGameName.objects.filter(in_game_name=value).exists():
            raise ValidationError("no players with that in_game_name exist")
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
            raise ValidationError("no players with that in_game_name exist")
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

    class Meta:
        model = wm.ApexabilityCheck
        fields = ['player', 'entry_type', 'time']
