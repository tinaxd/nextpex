import 'package:json_annotation/json_annotation.dart';

part 'api_types.g.dart';

@JsonSerializable()
class LevelResponse {
  final int level;
  @JsonKey(name: 'time')
  final int unixtime;

  DateTime get time => DateTime.fromMillisecondsSinceEpoch(unixtime * 1000);

  LevelResponse({required this.level, required this.unixtime});

  factory LevelResponse.fromJson(Map<String, dynamic> json) =>
      _$LevelResponseFromJson(json);

  Map<String, dynamic> toJson() => _$LevelResponseToJson(this);
}

@JsonSerializable()
class AllLevelsResponse {
  final Map<String, List<LevelResponse>> levels;

  AllLevelsResponse({required this.levels});

  factory AllLevelsResponse.fromJson(Map<String, dynamic> json) =>
      _$AllLevelsResponseFromJson(json);

  Map<String, dynamic> toJson() => _$AllLevelsResponseToJson(this);
}

@JsonSerializable()
class RankResponse {
  final int rank;
  @JsonKey(name: "rank_name")
  final String rankName;
  @JsonKey(name: 'time')
  final int unixtime;

  DateTime get time => DateTime.fromMillisecondsSinceEpoch(unixtime * 1000);

  RankResponse(
      {required this.rank, required this.rankName, required this.unixtime});

  factory RankResponse.fromJson(Map<String, dynamic> json) =>
      _$RankResponseFromJson(json);

  Map<String, dynamic> toJson() => _$RankResponseToJson(this);
}

@JsonSerializable()
class AllRanksResponse {
  final Map<String, List<RankResponse>> ranks;

  AllRanksResponse({required this.ranks});

  factory AllRanksResponse.fromJson(Map<String, dynamic> json) =>
      _$AllRanksResponseFromJson(json);

  Map<String, dynamic> toJson() => _$AllRanksResponseToJson(this);
}

@JsonSerializable()
class PlayingNowEntry {
  final String username;
  final String gamename;
  @JsonKey(name: "started_at")
  final int startedAtUnix;

  DateTime get startedAt =>
      DateTime.fromMillisecondsSinceEpoch(startedAtUnix * 1000);

  PlayingNowEntry(
      {required this.username,
      required this.gamename,
      required this.startedAtUnix});

  factory PlayingNowEntry.fromJson(Map<String, dynamic> json) =>
      _$PlayingNowEntryFromJson(json);

  Map<String, dynamic> toJson() => _$PlayingNowEntryToJson(this);
}

@JsonSerializable()
class PlayingNowResponse {
  final List<PlayingNowEntry> playingNow;

  PlayingNowResponse({required this.playingNow});

  factory PlayingNowResponse.fromJson(Map<String, dynamic> json) =>
      _$PlayingNowResponseFromJson(json);

  Map<String, dynamic> toJson() => _$PlayingNowResponseToJson(this);
}

@JsonSerializable()
class PlayingTimeEntry {
  final String username;
  final String gamename;
  @JsonKey(name: "started_at")
  final int startedAtUnix;
  @JsonKey(name: "ended_at")
  final int endedAtUnix;

  DateTime get startedAt =>
      DateTime.fromMillisecondsSinceEpoch(startedAtUnix * 1000);

  DateTime get endedAt =>
      DateTime.fromMillisecondsSinceEpoch(endedAtUnix * 1000);

  PlayingTimeEntry(
      {required this.username,
      required this.gamename,
      required this.startedAtUnix,
      required this.endedAtUnix});

  factory PlayingTimeEntry.fromJson(Map<String, dynamic> json) =>
      _$PlayingTimeEntryFromJson(json);

  Map<String, dynamic> toJson() => _$PlayingTimeEntryToJson(this);
}

@JsonSerializable()
class PlayingTimeResponse {
  final List<PlayingTimeEntry> playingTime;

  PlayingTimeResponse({required this.playingTime});

  factory PlayingTimeResponse.fromJson(Map<String, dynamic> json) =>
      _$PlayingTimeResponseFromJson(json);

  Map<String, dynamic> toJson() => _$PlayingTimeResponseToJson(this);
}
