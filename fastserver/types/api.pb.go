// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.1
// 	protoc        v3.21.5
// source: api.proto

package types

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type Time struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Hour   int32 `protobuf:"varint,1,opt,name=hour,proto3" json:"hour,omitempty"`
	Minute int32 `protobuf:"varint,2,opt,name=minute,proto3" json:"minute,omitempty"`
	Second int32 `protobuf:"varint,3,opt,name=second,proto3" json:"second,omitempty"`
	Date   int32 `protobuf:"varint,4,opt,name=date,proto3" json:"date,omitempty"`
	Month  int32 `protobuf:"varint,5,opt,name=month,proto3" json:"month,omitempty"`
	Year   int32 `protobuf:"varint,6,opt,name=year,proto3" json:"year,omitempty"`
}

func (x *Time) Reset() {
	*x = Time{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Time) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Time) ProtoMessage() {}

func (x *Time) ProtoReflect() protoreflect.Message {
	mi := &file_api_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Time.ProtoReflect.Descriptor instead.
func (*Time) Descriptor() ([]byte, []int) {
	return file_api_proto_rawDescGZIP(), []int{0}
}

func (x *Time) GetHour() int32 {
	if x != nil {
		return x.Hour
	}
	return 0
}

func (x *Time) GetMinute() int32 {
	if x != nil {
		return x.Minute
	}
	return 0
}

func (x *Time) GetSecond() int32 {
	if x != nil {
		return x.Second
	}
	return 0
}

func (x *Time) GetDate() int32 {
	if x != nil {
		return x.Date
	}
	return 0
}

func (x *Time) GetMonth() int32 {
	if x != nil {
		return x.Month
	}
	return 0
}

func (x *Time) GetYear() int32 {
	if x != nil {
		return x.Year
	}
	return 0
}

type LevelResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Level    int32  `protobuf:"varint,1,opt,name=level,proto3" json:"level,omitempty"`
	Time     *Time  `protobuf:"bytes,2,opt,name=time,proto3" json:"time,omitempty"`
	Username string `protobuf:"bytes,3,opt,name=username,proto3" json:"username,omitempty"`
}

func (x *LevelResponse) Reset() {
	*x = LevelResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *LevelResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*LevelResponse) ProtoMessage() {}

func (x *LevelResponse) ProtoReflect() protoreflect.Message {
	mi := &file_api_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use LevelResponse.ProtoReflect.Descriptor instead.
func (*LevelResponse) Descriptor() ([]byte, []int) {
	return file_api_proto_rawDescGZIP(), []int{1}
}

func (x *LevelResponse) GetLevel() int32 {
	if x != nil {
		return x.Level
	}
	return 0
}

func (x *LevelResponse) GetTime() *Time {
	if x != nil {
		return x.Time
	}
	return nil
}

func (x *LevelResponse) GetUsername() string {
	if x != nil {
		return x.Username
	}
	return ""
}

type AllLevelResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Levels []*LevelResponse `protobuf:"bytes,1,rep,name=levels,proto3" json:"levels,omitempty"`
}

func (x *AllLevelResponse) Reset() {
	*x = AllLevelResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *AllLevelResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*AllLevelResponse) ProtoMessage() {}

func (x *AllLevelResponse) ProtoReflect() protoreflect.Message {
	mi := &file_api_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use AllLevelResponse.ProtoReflect.Descriptor instead.
func (*AllLevelResponse) Descriptor() ([]byte, []int) {
	return file_api_proto_rawDescGZIP(), []int{2}
}

func (x *AllLevelResponse) GetLevels() []*LevelResponse {
	if x != nil {
		return x.Levels
	}
	return nil
}

type RankResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Rank     int32  `protobuf:"varint,1,opt,name=rank,proto3" json:"rank,omitempty"`
	Time     *Time  `protobuf:"bytes,2,opt,name=time,proto3" json:"time,omitempty"`
	Username string `protobuf:"bytes,3,opt,name=username,proto3" json:"username,omitempty"`
}

func (x *RankResponse) Reset() {
	*x = RankResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *RankResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*RankResponse) ProtoMessage() {}

func (x *RankResponse) ProtoReflect() protoreflect.Message {
	mi := &file_api_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use RankResponse.ProtoReflect.Descriptor instead.
func (*RankResponse) Descriptor() ([]byte, []int) {
	return file_api_proto_rawDescGZIP(), []int{3}
}

func (x *RankResponse) GetRank() int32 {
	if x != nil {
		return x.Rank
	}
	return 0
}

func (x *RankResponse) GetTime() *Time {
	if x != nil {
		return x.Time
	}
	return nil
}

func (x *RankResponse) GetUsername() string {
	if x != nil {
		return x.Username
	}
	return ""
}

type AllRankResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Ranks []*RankResponse `protobuf:"bytes,1,rep,name=ranks,proto3" json:"ranks,omitempty"`
}

func (x *AllRankResponse) Reset() {
	*x = AllRankResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *AllRankResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*AllRankResponse) ProtoMessage() {}

func (x *AllRankResponse) ProtoReflect() protoreflect.Message {
	mi := &file_api_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use AllRankResponse.ProtoReflect.Descriptor instead.
func (*AllRankResponse) Descriptor() ([]byte, []int) {
	return file_api_proto_rawDescGZIP(), []int{4}
}

func (x *AllRankResponse) GetRanks() []*RankResponse {
	if x != nil {
		return x.Ranks
	}
	return nil
}

type NowPlayingResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Username  string `protobuf:"bytes,1,opt,name=username,proto3" json:"username,omitempty"`
	Game      string `protobuf:"bytes,2,opt,name=game,proto3" json:"game,omitempty"`
	StartedAt *Time  `protobuf:"bytes,3,opt,name=started_at,json=startedAt,proto3" json:"started_at,omitempty"`
}

func (x *NowPlayingResponse) Reset() {
	*x = NowPlayingResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *NowPlayingResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*NowPlayingResponse) ProtoMessage() {}

func (x *NowPlayingResponse) ProtoReflect() protoreflect.Message {
	mi := &file_api_proto_msgTypes[5]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use NowPlayingResponse.ProtoReflect.Descriptor instead.
func (*NowPlayingResponse) Descriptor() ([]byte, []int) {
	return file_api_proto_rawDescGZIP(), []int{5}
}

func (x *NowPlayingResponse) GetUsername() string {
	if x != nil {
		return x.Username
	}
	return ""
}

func (x *NowPlayingResponse) GetGame() string {
	if x != nil {
		return x.Game
	}
	return ""
}

func (x *NowPlayingResponse) GetStartedAt() *Time {
	if x != nil {
		return x.StartedAt
	}
	return nil
}

type AllNowPlayingResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	NowPlayings []*NowPlayingResponse `protobuf:"bytes,1,rep,name=now_playings,json=nowPlayings,proto3" json:"now_playings,omitempty"`
}

func (x *AllNowPlayingResponse) Reset() {
	*x = AllNowPlayingResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_proto_msgTypes[6]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *AllNowPlayingResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*AllNowPlayingResponse) ProtoMessage() {}

func (x *AllNowPlayingResponse) ProtoReflect() protoreflect.Message {
	mi := &file_api_proto_msgTypes[6]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use AllNowPlayingResponse.ProtoReflect.Descriptor instead.
func (*AllNowPlayingResponse) Descriptor() ([]byte, []int) {
	return file_api_proto_rawDescGZIP(), []int{6}
}

func (x *AllNowPlayingResponse) GetNowPlayings() []*NowPlayingResponse {
	if x != nil {
		return x.NowPlayings
	}
	return nil
}

type GameSession struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Username  string `protobuf:"bytes,1,opt,name=username,proto3" json:"username,omitempty"`
	Game      string `protobuf:"bytes,2,opt,name=game,proto3" json:"game,omitempty"`
	StartedAt *Time  `protobuf:"bytes,3,opt,name=started_at,json=startedAt,proto3" json:"started_at,omitempty"`
	EndedAt   *Time  `protobuf:"bytes,4,opt,name=ended_at,json=endedAt,proto3" json:"ended_at,omitempty"`
}

func (x *GameSession) Reset() {
	*x = GameSession{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_proto_msgTypes[7]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GameSession) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GameSession) ProtoMessage() {}

func (x *GameSession) ProtoReflect() protoreflect.Message {
	mi := &file_api_proto_msgTypes[7]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GameSession.ProtoReflect.Descriptor instead.
func (*GameSession) Descriptor() ([]byte, []int) {
	return file_api_proto_rawDescGZIP(), []int{7}
}

func (x *GameSession) GetUsername() string {
	if x != nil {
		return x.Username
	}
	return ""
}

func (x *GameSession) GetGame() string {
	if x != nil {
		return x.Game
	}
	return ""
}

func (x *GameSession) GetStartedAt() *Time {
	if x != nil {
		return x.StartedAt
	}
	return nil
}

func (x *GameSession) GetEndedAt() *Time {
	if x != nil {
		return x.EndedAt
	}
	return nil
}

type LatestGameSessionResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	GameSessions []*GameSession `protobuf:"bytes,1,rep,name=game_sessions,json=gameSessions,proto3" json:"game_sessions,omitempty"`
}

func (x *LatestGameSessionResponse) Reset() {
	*x = LatestGameSessionResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_proto_msgTypes[8]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *LatestGameSessionResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*LatestGameSessionResponse) ProtoMessage() {}

func (x *LatestGameSessionResponse) ProtoReflect() protoreflect.Message {
	mi := &file_api_proto_msgTypes[8]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use LatestGameSessionResponse.ProtoReflect.Descriptor instead.
func (*LatestGameSessionResponse) Descriptor() ([]byte, []int) {
	return file_api_proto_rawDescGZIP(), []int{8}
}

func (x *LatestGameSessionResponse) GetGameSessions() []*GameSession {
	if x != nil {
		return x.GameSessions
	}
	return nil
}

type MonthlyPlayedTimeEntry struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Month      int32 `protobuf:"varint,1,opt,name=month,proto3" json:"month,omitempty"`
	Year       int32 `protobuf:"varint,2,opt,name=year,proto3" json:"year,omitempty"`
	PlayedTime int32 `protobuf:"varint,3,opt,name=played_time,json=playedTime,proto3" json:"played_time,omitempty"` // in seconds
}

func (x *MonthlyPlayedTimeEntry) Reset() {
	*x = MonthlyPlayedTimeEntry{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_proto_msgTypes[9]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *MonthlyPlayedTimeEntry) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*MonthlyPlayedTimeEntry) ProtoMessage() {}

func (x *MonthlyPlayedTimeEntry) ProtoReflect() protoreflect.Message {
	mi := &file_api_proto_msgTypes[9]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use MonthlyPlayedTimeEntry.ProtoReflect.Descriptor instead.
func (*MonthlyPlayedTimeEntry) Descriptor() ([]byte, []int) {
	return file_api_proto_rawDescGZIP(), []int{9}
}

func (x *MonthlyPlayedTimeEntry) GetMonth() int32 {
	if x != nil {
		return x.Month
	}
	return 0
}

func (x *MonthlyPlayedTimeEntry) GetYear() int32 {
	if x != nil {
		return x.Year
	}
	return 0
}

func (x *MonthlyPlayedTimeEntry) GetPlayedTime() int32 {
	if x != nil {
		return x.PlayedTime
	}
	return 0
}

type MonthlyPlayedTime struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Username string                    `protobuf:"bytes,1,opt,name=username,proto3" json:"username,omitempty"`
	Game     string                    `protobuf:"bytes,2,opt,name=game,proto3" json:"game,omitempty"`
	Entries  []*MonthlyPlayedTimeEntry `protobuf:"bytes,3,rep,name=entries,proto3" json:"entries,omitempty"`
}

func (x *MonthlyPlayedTime) Reset() {
	*x = MonthlyPlayedTime{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_proto_msgTypes[10]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *MonthlyPlayedTime) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*MonthlyPlayedTime) ProtoMessage() {}

func (x *MonthlyPlayedTime) ProtoReflect() protoreflect.Message {
	mi := &file_api_proto_msgTypes[10]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use MonthlyPlayedTime.ProtoReflect.Descriptor instead.
func (*MonthlyPlayedTime) Descriptor() ([]byte, []int) {
	return file_api_proto_rawDescGZIP(), []int{10}
}

func (x *MonthlyPlayedTime) GetUsername() string {
	if x != nil {
		return x.Username
	}
	return ""
}

func (x *MonthlyPlayedTime) GetGame() string {
	if x != nil {
		return x.Game
	}
	return ""
}

func (x *MonthlyPlayedTime) GetEntries() []*MonthlyPlayedTimeEntry {
	if x != nil {
		return x.Entries
	}
	return nil
}

type MonthlyCheckResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Data []*MonthlyPlayedTime `protobuf:"bytes,1,rep,name=data,proto3" json:"data,omitempty"`
}

func (x *MonthlyCheckResponse) Reset() {
	*x = MonthlyCheckResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_proto_msgTypes[11]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *MonthlyCheckResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*MonthlyCheckResponse) ProtoMessage() {}

func (x *MonthlyCheckResponse) ProtoReflect() protoreflect.Message {
	mi := &file_api_proto_msgTypes[11]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use MonthlyCheckResponse.ProtoReflect.Descriptor instead.
func (*MonthlyCheckResponse) Descriptor() ([]byte, []int) {
	return file_api_proto_rawDescGZIP(), []int{11}
}

func (x *MonthlyCheckResponse) GetData() []*MonthlyPlayedTime {
	if x != nil {
		return x.Data
	}
	return nil
}

var File_api_proto protoreflect.FileDescriptor

var file_api_proto_rawDesc = []byte{
	0x0a, 0x09, 0x61, 0x70, 0x69, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x07, 0x6e, 0x65, 0x78,
	0x74, 0x70, 0x65, 0x78, 0x22, 0x88, 0x01, 0x0a, 0x04, 0x54, 0x69, 0x6d, 0x65, 0x12, 0x12, 0x0a,
	0x04, 0x68, 0x6f, 0x75, 0x72, 0x18, 0x01, 0x20, 0x01, 0x28, 0x05, 0x52, 0x04, 0x68, 0x6f, 0x75,
	0x72, 0x12, 0x16, 0x0a, 0x06, 0x6d, 0x69, 0x6e, 0x75, 0x74, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28,
	0x05, 0x52, 0x06, 0x6d, 0x69, 0x6e, 0x75, 0x74, 0x65, 0x12, 0x16, 0x0a, 0x06, 0x73, 0x65, 0x63,
	0x6f, 0x6e, 0x64, 0x18, 0x03, 0x20, 0x01, 0x28, 0x05, 0x52, 0x06, 0x73, 0x65, 0x63, 0x6f, 0x6e,
	0x64, 0x12, 0x12, 0x0a, 0x04, 0x64, 0x61, 0x74, 0x65, 0x18, 0x04, 0x20, 0x01, 0x28, 0x05, 0x52,
	0x04, 0x64, 0x61, 0x74, 0x65, 0x12, 0x14, 0x0a, 0x05, 0x6d, 0x6f, 0x6e, 0x74, 0x68, 0x18, 0x05,
	0x20, 0x01, 0x28, 0x05, 0x52, 0x05, 0x6d, 0x6f, 0x6e, 0x74, 0x68, 0x12, 0x12, 0x0a, 0x04, 0x79,
	0x65, 0x61, 0x72, 0x18, 0x06, 0x20, 0x01, 0x28, 0x05, 0x52, 0x04, 0x79, 0x65, 0x61, 0x72, 0x22,
	0x64, 0x0a, 0x0d, 0x4c, 0x65, 0x76, 0x65, 0x6c, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65,
	0x12, 0x14, 0x0a, 0x05, 0x6c, 0x65, 0x76, 0x65, 0x6c, 0x18, 0x01, 0x20, 0x01, 0x28, 0x05, 0x52,
	0x05, 0x6c, 0x65, 0x76, 0x65, 0x6c, 0x12, 0x21, 0x0a, 0x04, 0x74, 0x69, 0x6d, 0x65, 0x18, 0x02,
	0x20, 0x01, 0x28, 0x0b, 0x32, 0x0d, 0x2e, 0x6e, 0x65, 0x78, 0x74, 0x70, 0x65, 0x78, 0x2e, 0x54,
	0x69, 0x6d, 0x65, 0x52, 0x04, 0x74, 0x69, 0x6d, 0x65, 0x12, 0x1a, 0x0a, 0x08, 0x75, 0x73, 0x65,
	0x72, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x75, 0x73, 0x65,
	0x72, 0x6e, 0x61, 0x6d, 0x65, 0x22, 0x42, 0x0a, 0x10, 0x41, 0x6c, 0x6c, 0x4c, 0x65, 0x76, 0x65,
	0x6c, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x2e, 0x0a, 0x06, 0x6c, 0x65, 0x76,
	0x65, 0x6c, 0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x16, 0x2e, 0x6e, 0x65, 0x78, 0x74,
	0x70, 0x65, 0x78, 0x2e, 0x4c, 0x65, 0x76, 0x65, 0x6c, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73,
	0x65, 0x52, 0x06, 0x6c, 0x65, 0x76, 0x65, 0x6c, 0x73, 0x22, 0x61, 0x0a, 0x0c, 0x52, 0x61, 0x6e,
	0x6b, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x12, 0x0a, 0x04, 0x72, 0x61, 0x6e,
	0x6b, 0x18, 0x01, 0x20, 0x01, 0x28, 0x05, 0x52, 0x04, 0x72, 0x61, 0x6e, 0x6b, 0x12, 0x21, 0x0a,
	0x04, 0x74, 0x69, 0x6d, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x0d, 0x2e, 0x6e, 0x65,
	0x78, 0x74, 0x70, 0x65, 0x78, 0x2e, 0x54, 0x69, 0x6d, 0x65, 0x52, 0x04, 0x74, 0x69, 0x6d, 0x65,
	0x12, 0x1a, 0x0a, 0x08, 0x75, 0x73, 0x65, 0x72, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x03, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x08, 0x75, 0x73, 0x65, 0x72, 0x6e, 0x61, 0x6d, 0x65, 0x22, 0x3e, 0x0a, 0x0f,
	0x41, 0x6c, 0x6c, 0x52, 0x61, 0x6e, 0x6b, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12,
	0x2b, 0x0a, 0x05, 0x72, 0x61, 0x6e, 0x6b, 0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x15,
	0x2e, 0x6e, 0x65, 0x78, 0x74, 0x70, 0x65, 0x78, 0x2e, 0x52, 0x61, 0x6e, 0x6b, 0x52, 0x65, 0x73,
	0x70, 0x6f, 0x6e, 0x73, 0x65, 0x52, 0x05, 0x72, 0x61, 0x6e, 0x6b, 0x73, 0x22, 0x72, 0x0a, 0x12,
	0x4e, 0x6f, 0x77, 0x50, 0x6c, 0x61, 0x79, 0x69, 0x6e, 0x67, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e,
	0x73, 0x65, 0x12, 0x1a, 0x0a, 0x08, 0x75, 0x73, 0x65, 0x72, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x01,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x75, 0x73, 0x65, 0x72, 0x6e, 0x61, 0x6d, 0x65, 0x12, 0x12,
	0x0a, 0x04, 0x67, 0x61, 0x6d, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x67, 0x61,
	0x6d, 0x65, 0x12, 0x2c, 0x0a, 0x0a, 0x73, 0x74, 0x61, 0x72, 0x74, 0x65, 0x64, 0x5f, 0x61, 0x74,
	0x18, 0x03, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x0d, 0x2e, 0x6e, 0x65, 0x78, 0x74, 0x70, 0x65, 0x78,
	0x2e, 0x54, 0x69, 0x6d, 0x65, 0x52, 0x09, 0x73, 0x74, 0x61, 0x72, 0x74, 0x65, 0x64, 0x41, 0x74,
	0x22, 0x57, 0x0a, 0x15, 0x41, 0x6c, 0x6c, 0x4e, 0x6f, 0x77, 0x50, 0x6c, 0x61, 0x79, 0x69, 0x6e,
	0x67, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x3e, 0x0a, 0x0c, 0x6e, 0x6f, 0x77,
	0x5f, 0x70, 0x6c, 0x61, 0x79, 0x69, 0x6e, 0x67, 0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32,
	0x1b, 0x2e, 0x6e, 0x65, 0x78, 0x74, 0x70, 0x65, 0x78, 0x2e, 0x4e, 0x6f, 0x77, 0x50, 0x6c, 0x61,
	0x79, 0x69, 0x6e, 0x67, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x52, 0x0b, 0x6e, 0x6f,
	0x77, 0x50, 0x6c, 0x61, 0x79, 0x69, 0x6e, 0x67, 0x73, 0x22, 0x95, 0x01, 0x0a, 0x0b, 0x47, 0x61,
	0x6d, 0x65, 0x53, 0x65, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x12, 0x1a, 0x0a, 0x08, 0x75, 0x73, 0x65,
	0x72, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x75, 0x73, 0x65,
	0x72, 0x6e, 0x61, 0x6d, 0x65, 0x12, 0x12, 0x0a, 0x04, 0x67, 0x61, 0x6d, 0x65, 0x18, 0x02, 0x20,
	0x01, 0x28, 0x09, 0x52, 0x04, 0x67, 0x61, 0x6d, 0x65, 0x12, 0x2c, 0x0a, 0x0a, 0x73, 0x74, 0x61,
	0x72, 0x74, 0x65, 0x64, 0x5f, 0x61, 0x74, 0x18, 0x03, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x0d, 0x2e,
	0x6e, 0x65, 0x78, 0x74, 0x70, 0x65, 0x78, 0x2e, 0x54, 0x69, 0x6d, 0x65, 0x52, 0x09, 0x73, 0x74,
	0x61, 0x72, 0x74, 0x65, 0x64, 0x41, 0x74, 0x12, 0x28, 0x0a, 0x08, 0x65, 0x6e, 0x64, 0x65, 0x64,
	0x5f, 0x61, 0x74, 0x18, 0x04, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x0d, 0x2e, 0x6e, 0x65, 0x78, 0x74,
	0x70, 0x65, 0x78, 0x2e, 0x54, 0x69, 0x6d, 0x65, 0x52, 0x07, 0x65, 0x6e, 0x64, 0x65, 0x64, 0x41,
	0x74, 0x22, 0x56, 0x0a, 0x19, 0x4c, 0x61, 0x74, 0x65, 0x73, 0x74, 0x47, 0x61, 0x6d, 0x65, 0x53,
	0x65, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x39,
	0x0a, 0x0d, 0x67, 0x61, 0x6d, 0x65, 0x5f, 0x73, 0x65, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x73, 0x18,
	0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x14, 0x2e, 0x6e, 0x65, 0x78, 0x74, 0x70, 0x65, 0x78, 0x2e,
	0x47, 0x61, 0x6d, 0x65, 0x53, 0x65, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x52, 0x0c, 0x67, 0x61, 0x6d,
	0x65, 0x53, 0x65, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x73, 0x22, 0x63, 0x0a, 0x16, 0x4d, 0x6f, 0x6e,
	0x74, 0x68, 0x6c, 0x79, 0x50, 0x6c, 0x61, 0x79, 0x65, 0x64, 0x54, 0x69, 0x6d, 0x65, 0x45, 0x6e,
	0x74, 0x72, 0x79, 0x12, 0x14, 0x0a, 0x05, 0x6d, 0x6f, 0x6e, 0x74, 0x68, 0x18, 0x01, 0x20, 0x01,
	0x28, 0x05, 0x52, 0x05, 0x6d, 0x6f, 0x6e, 0x74, 0x68, 0x12, 0x12, 0x0a, 0x04, 0x79, 0x65, 0x61,
	0x72, 0x18, 0x02, 0x20, 0x01, 0x28, 0x05, 0x52, 0x04, 0x79, 0x65, 0x61, 0x72, 0x12, 0x1f, 0x0a,
	0x0b, 0x70, 0x6c, 0x61, 0x79, 0x65, 0x64, 0x5f, 0x74, 0x69, 0x6d, 0x65, 0x18, 0x03, 0x20, 0x01,
	0x28, 0x05, 0x52, 0x0a, 0x70, 0x6c, 0x61, 0x79, 0x65, 0x64, 0x54, 0x69, 0x6d, 0x65, 0x22, 0x7e,
	0x0a, 0x11, 0x4d, 0x6f, 0x6e, 0x74, 0x68, 0x6c, 0x79, 0x50, 0x6c, 0x61, 0x79, 0x65, 0x64, 0x54,
	0x69, 0x6d, 0x65, 0x12, 0x1a, 0x0a, 0x08, 0x75, 0x73, 0x65, 0x72, 0x6e, 0x61, 0x6d, 0x65, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x75, 0x73, 0x65, 0x72, 0x6e, 0x61, 0x6d, 0x65, 0x12,
	0x12, 0x0a, 0x04, 0x67, 0x61, 0x6d, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x67,
	0x61, 0x6d, 0x65, 0x12, 0x39, 0x0a, 0x07, 0x65, 0x6e, 0x74, 0x72, 0x69, 0x65, 0x73, 0x18, 0x03,
	0x20, 0x03, 0x28, 0x0b, 0x32, 0x1f, 0x2e, 0x6e, 0x65, 0x78, 0x74, 0x70, 0x65, 0x78, 0x2e, 0x4d,
	0x6f, 0x6e, 0x74, 0x68, 0x6c, 0x79, 0x50, 0x6c, 0x61, 0x79, 0x65, 0x64, 0x54, 0x69, 0x6d, 0x65,
	0x45, 0x6e, 0x74, 0x72, 0x79, 0x52, 0x07, 0x65, 0x6e, 0x74, 0x72, 0x69, 0x65, 0x73, 0x22, 0x46,
	0x0a, 0x14, 0x4d, 0x6f, 0x6e, 0x74, 0x68, 0x6c, 0x79, 0x43, 0x68, 0x65, 0x63, 0x6b, 0x52, 0x65,
	0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x2e, 0x0a, 0x04, 0x64, 0x61, 0x74, 0x61, 0x18, 0x01,
	0x20, 0x03, 0x28, 0x0b, 0x32, 0x1a, 0x2e, 0x6e, 0x65, 0x78, 0x74, 0x70, 0x65, 0x78, 0x2e, 0x4d,
	0x6f, 0x6e, 0x74, 0x68, 0x6c, 0x79, 0x50, 0x6c, 0x61, 0x79, 0x65, 0x64, 0x54, 0x69, 0x6d, 0x65,
	0x52, 0x04, 0x64, 0x61, 0x74, 0x61, 0x42, 0x21, 0x5a, 0x1f, 0x67, 0x69, 0x74, 0x68, 0x75, 0x62,
	0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x74, 0x69, 0x6e, 0x61, 0x78, 0x64, 0x2f, 0x6e, 0x65, 0x78, 0x74,
	0x70, 0x65, 0x78, 0x2f, 0x74, 0x79, 0x70, 0x65, 0x73, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f,
	0x33,
}

var (
	file_api_proto_rawDescOnce sync.Once
	file_api_proto_rawDescData = file_api_proto_rawDesc
)

func file_api_proto_rawDescGZIP() []byte {
	file_api_proto_rawDescOnce.Do(func() {
		file_api_proto_rawDescData = protoimpl.X.CompressGZIP(file_api_proto_rawDescData)
	})
	return file_api_proto_rawDescData
}

var file_api_proto_msgTypes = make([]protoimpl.MessageInfo, 12)
var file_api_proto_goTypes = []interface{}{
	(*Time)(nil),                      // 0: nextpex.Time
	(*LevelResponse)(nil),             // 1: nextpex.LevelResponse
	(*AllLevelResponse)(nil),          // 2: nextpex.AllLevelResponse
	(*RankResponse)(nil),              // 3: nextpex.RankResponse
	(*AllRankResponse)(nil),           // 4: nextpex.AllRankResponse
	(*NowPlayingResponse)(nil),        // 5: nextpex.NowPlayingResponse
	(*AllNowPlayingResponse)(nil),     // 6: nextpex.AllNowPlayingResponse
	(*GameSession)(nil),               // 7: nextpex.GameSession
	(*LatestGameSessionResponse)(nil), // 8: nextpex.LatestGameSessionResponse
	(*MonthlyPlayedTimeEntry)(nil),    // 9: nextpex.MonthlyPlayedTimeEntry
	(*MonthlyPlayedTime)(nil),         // 10: nextpex.MonthlyPlayedTime
	(*MonthlyCheckResponse)(nil),      // 11: nextpex.MonthlyCheckResponse
}
var file_api_proto_depIdxs = []int32{
	0,  // 0: nextpex.LevelResponse.time:type_name -> nextpex.Time
	1,  // 1: nextpex.AllLevelResponse.levels:type_name -> nextpex.LevelResponse
	0,  // 2: nextpex.RankResponse.time:type_name -> nextpex.Time
	3,  // 3: nextpex.AllRankResponse.ranks:type_name -> nextpex.RankResponse
	0,  // 4: nextpex.NowPlayingResponse.started_at:type_name -> nextpex.Time
	5,  // 5: nextpex.AllNowPlayingResponse.now_playings:type_name -> nextpex.NowPlayingResponse
	0,  // 6: nextpex.GameSession.started_at:type_name -> nextpex.Time
	0,  // 7: nextpex.GameSession.ended_at:type_name -> nextpex.Time
	7,  // 8: nextpex.LatestGameSessionResponse.game_sessions:type_name -> nextpex.GameSession
	9,  // 9: nextpex.MonthlyPlayedTime.entries:type_name -> nextpex.MonthlyPlayedTimeEntry
	10, // 10: nextpex.MonthlyCheckResponse.data:type_name -> nextpex.MonthlyPlayedTime
	11, // [11:11] is the sub-list for method output_type
	11, // [11:11] is the sub-list for method input_type
	11, // [11:11] is the sub-list for extension type_name
	11, // [11:11] is the sub-list for extension extendee
	0,  // [0:11] is the sub-list for field type_name
}

func init() { file_api_proto_init() }
func file_api_proto_init() {
	if File_api_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_api_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Time); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_api_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*LevelResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_api_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*AllLevelResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_api_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*RankResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_api_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*AllRankResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_api_proto_msgTypes[5].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*NowPlayingResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_api_proto_msgTypes[6].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*AllNowPlayingResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_api_proto_msgTypes[7].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GameSession); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_api_proto_msgTypes[8].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*LatestGameSessionResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_api_proto_msgTypes[9].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*MonthlyPlayedTimeEntry); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_api_proto_msgTypes[10].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*MonthlyPlayedTime); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_api_proto_msgTypes[11].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*MonthlyCheckResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_api_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   12,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_api_proto_goTypes,
		DependencyIndexes: file_api_proto_depIdxs,
		MessageInfos:      file_api_proto_msgTypes,
	}.Build()
	File_api_proto = out.File
	file_api_proto_rawDesc = nil
	file_api_proto_goTypes = nil
	file_api_proto_depIdxs = nil
}
