import 'package:json_annotation/json_annotation.dart';
import 'package:json_serializable/builder.dart';

part 'api_types.g.dart';

@JsonSerializable()
class LevelResponse {
  final int level;
  final int time;

  LevelResponse({required this.level, required this.time});

  factory LevelResponse.fromJson(Map<String, dynamic> json) =>
      _$LevelResponseFromJson(json);

  Map<String, dynamic> toJson() => _$LevelResponseToJson(this);
}

@JsonSerializable()
class AllLevelsResponse {
  final Map<String, LevelResponse> levels;

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
  final int time;

  RankResponse(
      {required this.rank, required this.rankName, required this.time});

  factory RankResponse.fromJson(Map<String, dynamic> json) =>
      _$RankResponseFromJson(json);

  Map<String, dynamic> toJson() => _$RankResponseToJson(this);
}

@JsonSerializable()
class AllRanksResponse {
  final Map<String, RankResponse> ranks;

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
  final int startedAt;

  PlayingNowEntry(
      {required this.username,
      required this.gamename,
      required this.startedAt});

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
  final int startedAt;
  @JsonKey(name: "ended_at")
  final int endedAt;

  PlayingTimeEntry(
      {required this.username,
      required this.gamename,
      required this.startedAt,
      required this.endedAt});

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
