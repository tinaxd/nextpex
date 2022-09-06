// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'api_types.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LevelResponse _$LevelResponseFromJson(Map<String, dynamic> json) =>
    LevelResponse(
      level: json['level'] as int,
      unixtime: json['time'] as int,
    );

Map<String, dynamic> _$LevelResponseToJson(LevelResponse instance) =>
    <String, dynamic>{
      'level': instance.level,
      'time': instance.unixtime,
    };

AllLevelsResponse _$AllLevelsResponseFromJson(Map<String, dynamic> json) =>
    AllLevelsResponse(
      levels: (json['levels'] as Map<String, dynamic>).map(
        (k, e) => MapEntry(
            k,
            (e as List<dynamic>)
                .map((e) => LevelResponse.fromJson(e as Map<String, dynamic>))
                .toList()),
      ),
    );

Map<String, dynamic> _$AllLevelsResponseToJson(AllLevelsResponse instance) =>
    <String, dynamic>{
      'levels': instance.levels,
    };

RankResponse _$RankResponseFromJson(Map<String, dynamic> json) => RankResponse(
      rank: json['rank'] as int,
      rankName: json['rank_name'] as String,
      unixtime: json['time'] as int,
    );

Map<String, dynamic> _$RankResponseToJson(RankResponse instance) =>
    <String, dynamic>{
      'rank': instance.rank,
      'rank_name': instance.rankName,
      'time': instance.unixtime,
    };

AllRanksResponse _$AllRanksResponseFromJson(Map<String, dynamic> json) =>
    AllRanksResponse(
      ranks: (json['ranks'] as Map<String, dynamic>).map(
        (k, e) => MapEntry(
            k,
            (e as List<dynamic>)
                .map((e) => RankResponse.fromJson(e as Map<String, dynamic>))
                .toList()),
      ),
    );

Map<String, dynamic> _$AllRanksResponseToJson(AllRanksResponse instance) =>
    <String, dynamic>{
      'ranks': instance.ranks,
    };

PlayingNowEntry _$PlayingNowEntryFromJson(Map<String, dynamic> json) =>
    PlayingNowEntry(
      username: json['username'] as String,
      gamename: json['gamename'] as String,
      startedAtUnix: json['started_at'] as int,
    );

Map<String, dynamic> _$PlayingNowEntryToJson(PlayingNowEntry instance) =>
    <String, dynamic>{
      'username': instance.username,
      'gamename': instance.gamename,
      'started_at': instance.startedAtUnix,
    };

PlayingNowResponse _$PlayingNowResponseFromJson(Map<String, dynamic> json) =>
    PlayingNowResponse(
      playingNow: (json['playingNow'] as List<dynamic>)
          .map((e) => PlayingNowEntry.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$PlayingNowResponseToJson(PlayingNowResponse instance) =>
    <String, dynamic>{
      'playingNow': instance.playingNow,
    };

PlayingTimeEntry _$PlayingTimeEntryFromJson(Map<String, dynamic> json) =>
    PlayingTimeEntry(
      username: json['username'] as String,
      gamename: json['gamename'] as String,
      startedAtUnix: json['started_at'] as int,
      endedAtUnix: json['ended_at'] as int,
    );

Map<String, dynamic> _$PlayingTimeEntryToJson(PlayingTimeEntry instance) =>
    <String, dynamic>{
      'username': instance.username,
      'gamename': instance.gamename,
      'started_at': instance.startedAtUnix,
      'ended_at': instance.endedAtUnix,
    };

PlayingTimeResponse _$PlayingTimeResponseFromJson(Map<String, dynamic> json) =>
    PlayingTimeResponse(
      playingTime: (json['playingTime'] as List<dynamic>)
          .map((e) => PlayingTimeEntry.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$PlayingTimeResponseToJson(
        PlayingTimeResponse instance) =>
    <String, dynamic>{
      'playingTime': instance.playingTime,
    };
