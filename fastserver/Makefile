types/api.pb.go: protobuf/api.proto
	protoc -I=protobuf --go_out=. --go_opt=module=github.com/tinaxd/nextpex protobuf/api.proto

.PHONY: all
all: types/api.pb.go
