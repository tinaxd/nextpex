import * as $protobuf from "protobufjs";
/** Namespace nextpex. */
export namespace nextpex {

    /** Properties of a Time. */
    interface ITime {

        /** Time hour */
        hour?: (number|null);

        /** Time minute */
        minute?: (number|null);

        /** Time second */
        second?: (number|null);

        /** Time date */
        date?: (number|null);

        /** Time month */
        month?: (number|null);

        /** Time year */
        year?: (number|null);
    }

    /** Represents a Time. */
    class Time implements ITime {

        /**
         * Constructs a new Time.
         * @param [properties] Properties to set
         */
        constructor(properties?: nextpex.ITime);

        /** Time hour. */
        public hour: number;

        /** Time minute. */
        public minute: number;

        /** Time second. */
        public second: number;

        /** Time date. */
        public date: number;

        /** Time month. */
        public month: number;

        /** Time year. */
        public year: number;

        /**
         * Creates a new Time instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Time instance
         */
        public static create(properties?: nextpex.ITime): nextpex.Time;

        /**
         * Encodes the specified Time message. Does not implicitly {@link nextpex.Time.verify|verify} messages.
         * @param message Time message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: nextpex.ITime, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Time message, length delimited. Does not implicitly {@link nextpex.Time.verify|verify} messages.
         * @param message Time message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: nextpex.ITime, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Time message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Time
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): nextpex.Time;

        /**
         * Decodes a Time message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Time
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): nextpex.Time;

        /**
         * Verifies a Time message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Time message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Time
         */
        public static fromObject(object: { [k: string]: any }): nextpex.Time;

        /**
         * Creates a plain object from a Time message. Also converts values to other types if specified.
         * @param message Time
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: nextpex.Time, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Time to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Time
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LevelResponse. */
    interface ILevelResponse {

        /** LevelResponse level */
        level?: (number|null);

        /** LevelResponse time */
        time?: (nextpex.ITime|null);

        /** LevelResponse username */
        username?: (string|null);
    }

    /** Represents a LevelResponse. */
    class LevelResponse implements ILevelResponse {

        /**
         * Constructs a new LevelResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: nextpex.ILevelResponse);

        /** LevelResponse level. */
        public level: number;

        /** LevelResponse time. */
        public time?: (nextpex.ITime|null);

        /** LevelResponse username. */
        public username: string;

        /**
         * Creates a new LevelResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LevelResponse instance
         */
        public static create(properties?: nextpex.ILevelResponse): nextpex.LevelResponse;

        /**
         * Encodes the specified LevelResponse message. Does not implicitly {@link nextpex.LevelResponse.verify|verify} messages.
         * @param message LevelResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: nextpex.ILevelResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LevelResponse message, length delimited. Does not implicitly {@link nextpex.LevelResponse.verify|verify} messages.
         * @param message LevelResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: nextpex.ILevelResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LevelResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LevelResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): nextpex.LevelResponse;

        /**
         * Decodes a LevelResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LevelResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): nextpex.LevelResponse;

        /**
         * Verifies a LevelResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LevelResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LevelResponse
         */
        public static fromObject(object: { [k: string]: any }): nextpex.LevelResponse;

        /**
         * Creates a plain object from a LevelResponse message. Also converts values to other types if specified.
         * @param message LevelResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: nextpex.LevelResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LevelResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LevelResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AllLevelResponse. */
    interface IAllLevelResponse {

        /** AllLevelResponse levels */
        levels?: (nextpex.ILevelResponse[]|null);
    }

    /** Represents an AllLevelResponse. */
    class AllLevelResponse implements IAllLevelResponse {

        /**
         * Constructs a new AllLevelResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: nextpex.IAllLevelResponse);

        /** AllLevelResponse levels. */
        public levels: nextpex.ILevelResponse[];

        /**
         * Creates a new AllLevelResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AllLevelResponse instance
         */
        public static create(properties?: nextpex.IAllLevelResponse): nextpex.AllLevelResponse;

        /**
         * Encodes the specified AllLevelResponse message. Does not implicitly {@link nextpex.AllLevelResponse.verify|verify} messages.
         * @param message AllLevelResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: nextpex.IAllLevelResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AllLevelResponse message, length delimited. Does not implicitly {@link nextpex.AllLevelResponse.verify|verify} messages.
         * @param message AllLevelResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: nextpex.IAllLevelResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AllLevelResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AllLevelResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): nextpex.AllLevelResponse;

        /**
         * Decodes an AllLevelResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AllLevelResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): nextpex.AllLevelResponse;

        /**
         * Verifies an AllLevelResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AllLevelResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AllLevelResponse
         */
        public static fromObject(object: { [k: string]: any }): nextpex.AllLevelResponse;

        /**
         * Creates a plain object from an AllLevelResponse message. Also converts values to other types if specified.
         * @param message AllLevelResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: nextpex.AllLevelResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AllLevelResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AllLevelResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a RankResponse. */
    interface IRankResponse {

        /** RankResponse rank */
        rank?: (number|null);

        /** RankResponse time */
        time?: (nextpex.ITime|null);

        /** RankResponse username */
        username?: (string|null);
    }

    /** Represents a RankResponse. */
    class RankResponse implements IRankResponse {

        /**
         * Constructs a new RankResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: nextpex.IRankResponse);

        /** RankResponse rank. */
        public rank: number;

        /** RankResponse time. */
        public time?: (nextpex.ITime|null);

        /** RankResponse username. */
        public username: string;

        /**
         * Creates a new RankResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RankResponse instance
         */
        public static create(properties?: nextpex.IRankResponse): nextpex.RankResponse;

        /**
         * Encodes the specified RankResponse message. Does not implicitly {@link nextpex.RankResponse.verify|verify} messages.
         * @param message RankResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: nextpex.IRankResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RankResponse message, length delimited. Does not implicitly {@link nextpex.RankResponse.verify|verify} messages.
         * @param message RankResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: nextpex.IRankResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RankResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RankResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): nextpex.RankResponse;

        /**
         * Decodes a RankResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RankResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): nextpex.RankResponse;

        /**
         * Verifies a RankResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RankResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RankResponse
         */
        public static fromObject(object: { [k: string]: any }): nextpex.RankResponse;

        /**
         * Creates a plain object from a RankResponse message. Also converts values to other types if specified.
         * @param message RankResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: nextpex.RankResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RankResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for RankResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AllRankResponse. */
    interface IAllRankResponse {

        /** AllRankResponse ranks */
        ranks?: (nextpex.IRankResponse[]|null);
    }

    /** Represents an AllRankResponse. */
    class AllRankResponse implements IAllRankResponse {

        /**
         * Constructs a new AllRankResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: nextpex.IAllRankResponse);

        /** AllRankResponse ranks. */
        public ranks: nextpex.IRankResponse[];

        /**
         * Creates a new AllRankResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AllRankResponse instance
         */
        public static create(properties?: nextpex.IAllRankResponse): nextpex.AllRankResponse;

        /**
         * Encodes the specified AllRankResponse message. Does not implicitly {@link nextpex.AllRankResponse.verify|verify} messages.
         * @param message AllRankResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: nextpex.IAllRankResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AllRankResponse message, length delimited. Does not implicitly {@link nextpex.AllRankResponse.verify|verify} messages.
         * @param message AllRankResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: nextpex.IAllRankResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AllRankResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AllRankResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): nextpex.AllRankResponse;

        /**
         * Decodes an AllRankResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AllRankResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): nextpex.AllRankResponse;

        /**
         * Verifies an AllRankResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AllRankResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AllRankResponse
         */
        public static fromObject(object: { [k: string]: any }): nextpex.AllRankResponse;

        /**
         * Creates a plain object from an AllRankResponse message. Also converts values to other types if specified.
         * @param message AllRankResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: nextpex.AllRankResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AllRankResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AllRankResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a NowPlayingResponse. */
    interface INowPlayingResponse {

        /** NowPlayingResponse username */
        username?: (string|null);

        /** NowPlayingResponse game */
        game?: (string|null);

        /** NowPlayingResponse startedAt */
        startedAt?: (nextpex.ITime|null);
    }

    /** Represents a NowPlayingResponse. */
    class NowPlayingResponse implements INowPlayingResponse {

        /**
         * Constructs a new NowPlayingResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: nextpex.INowPlayingResponse);

        /** NowPlayingResponse username. */
        public username: string;

        /** NowPlayingResponse game. */
        public game: string;

        /** NowPlayingResponse startedAt. */
        public startedAt?: (nextpex.ITime|null);

        /**
         * Creates a new NowPlayingResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NowPlayingResponse instance
         */
        public static create(properties?: nextpex.INowPlayingResponse): nextpex.NowPlayingResponse;

        /**
         * Encodes the specified NowPlayingResponse message. Does not implicitly {@link nextpex.NowPlayingResponse.verify|verify} messages.
         * @param message NowPlayingResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: nextpex.INowPlayingResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NowPlayingResponse message, length delimited. Does not implicitly {@link nextpex.NowPlayingResponse.verify|verify} messages.
         * @param message NowPlayingResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: nextpex.INowPlayingResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NowPlayingResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NowPlayingResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): nextpex.NowPlayingResponse;

        /**
         * Decodes a NowPlayingResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NowPlayingResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): nextpex.NowPlayingResponse;

        /**
         * Verifies a NowPlayingResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NowPlayingResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NowPlayingResponse
         */
        public static fromObject(object: { [k: string]: any }): nextpex.NowPlayingResponse;

        /**
         * Creates a plain object from a NowPlayingResponse message. Also converts values to other types if specified.
         * @param message NowPlayingResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: nextpex.NowPlayingResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NowPlayingResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for NowPlayingResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AllNowPlayingResponse. */
    interface IAllNowPlayingResponse {

        /** AllNowPlayingResponse nowPlayings */
        nowPlayings?: (nextpex.INowPlayingResponse[]|null);
    }

    /** Represents an AllNowPlayingResponse. */
    class AllNowPlayingResponse implements IAllNowPlayingResponse {

        /**
         * Constructs a new AllNowPlayingResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: nextpex.IAllNowPlayingResponse);

        /** AllNowPlayingResponse nowPlayings. */
        public nowPlayings: nextpex.INowPlayingResponse[];

        /**
         * Creates a new AllNowPlayingResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AllNowPlayingResponse instance
         */
        public static create(properties?: nextpex.IAllNowPlayingResponse): nextpex.AllNowPlayingResponse;

        /**
         * Encodes the specified AllNowPlayingResponse message. Does not implicitly {@link nextpex.AllNowPlayingResponse.verify|verify} messages.
         * @param message AllNowPlayingResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: nextpex.IAllNowPlayingResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AllNowPlayingResponse message, length delimited. Does not implicitly {@link nextpex.AllNowPlayingResponse.verify|verify} messages.
         * @param message AllNowPlayingResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: nextpex.IAllNowPlayingResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AllNowPlayingResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AllNowPlayingResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): nextpex.AllNowPlayingResponse;

        /**
         * Decodes an AllNowPlayingResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AllNowPlayingResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): nextpex.AllNowPlayingResponse;

        /**
         * Verifies an AllNowPlayingResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AllNowPlayingResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AllNowPlayingResponse
         */
        public static fromObject(object: { [k: string]: any }): nextpex.AllNowPlayingResponse;

        /**
         * Creates a plain object from an AllNowPlayingResponse message. Also converts values to other types if specified.
         * @param message AllNowPlayingResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: nextpex.AllNowPlayingResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AllNowPlayingResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AllNowPlayingResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GameSession. */
    interface IGameSession {

        /** GameSession username */
        username?: (string|null);

        /** GameSession game */
        game?: (string|null);

        /** GameSession startedAt */
        startedAt?: (nextpex.ITime|null);

        /** GameSession endedAt */
        endedAt?: (nextpex.ITime|null);
    }

    /** Represents a GameSession. */
    class GameSession implements IGameSession {

        /**
         * Constructs a new GameSession.
         * @param [properties] Properties to set
         */
        constructor(properties?: nextpex.IGameSession);

        /** GameSession username. */
        public username: string;

        /** GameSession game. */
        public game: string;

        /** GameSession startedAt. */
        public startedAt?: (nextpex.ITime|null);

        /** GameSession endedAt. */
        public endedAt?: (nextpex.ITime|null);

        /**
         * Creates a new GameSession instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameSession instance
         */
        public static create(properties?: nextpex.IGameSession): nextpex.GameSession;

        /**
         * Encodes the specified GameSession message. Does not implicitly {@link nextpex.GameSession.verify|verify} messages.
         * @param message GameSession message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: nextpex.IGameSession, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameSession message, length delimited. Does not implicitly {@link nextpex.GameSession.verify|verify} messages.
         * @param message GameSession message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: nextpex.IGameSession, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameSession message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameSession
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): nextpex.GameSession;

        /**
         * Decodes a GameSession message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameSession
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): nextpex.GameSession;

        /**
         * Verifies a GameSession message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GameSession message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameSession
         */
        public static fromObject(object: { [k: string]: any }): nextpex.GameSession;

        /**
         * Creates a plain object from a GameSession message. Also converts values to other types if specified.
         * @param message GameSession
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: nextpex.GameSession, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameSession to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GameSession
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LatestGameSessionResponse. */
    interface ILatestGameSessionResponse {

        /** LatestGameSessionResponse gameSessions */
        gameSessions?: (nextpex.IGameSession[]|null);
    }

    /** Represents a LatestGameSessionResponse. */
    class LatestGameSessionResponse implements ILatestGameSessionResponse {

        /**
         * Constructs a new LatestGameSessionResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: nextpex.ILatestGameSessionResponse);

        /** LatestGameSessionResponse gameSessions. */
        public gameSessions: nextpex.IGameSession[];

        /**
         * Creates a new LatestGameSessionResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LatestGameSessionResponse instance
         */
        public static create(properties?: nextpex.ILatestGameSessionResponse): nextpex.LatestGameSessionResponse;

        /**
         * Encodes the specified LatestGameSessionResponse message. Does not implicitly {@link nextpex.LatestGameSessionResponse.verify|verify} messages.
         * @param message LatestGameSessionResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: nextpex.ILatestGameSessionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LatestGameSessionResponse message, length delimited. Does not implicitly {@link nextpex.LatestGameSessionResponse.verify|verify} messages.
         * @param message LatestGameSessionResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: nextpex.ILatestGameSessionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LatestGameSessionResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LatestGameSessionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): nextpex.LatestGameSessionResponse;

        /**
         * Decodes a LatestGameSessionResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LatestGameSessionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): nextpex.LatestGameSessionResponse;

        /**
         * Verifies a LatestGameSessionResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LatestGameSessionResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LatestGameSessionResponse
         */
        public static fromObject(object: { [k: string]: any }): nextpex.LatestGameSessionResponse;

        /**
         * Creates a plain object from a LatestGameSessionResponse message. Also converts values to other types if specified.
         * @param message LatestGameSessionResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: nextpex.LatestGameSessionResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LatestGameSessionResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LatestGameSessionResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MonthlyPlayedTimeEntry. */
    interface IMonthlyPlayedTimeEntry {

        /** MonthlyPlayedTimeEntry month */
        month?: (number|null);

        /** MonthlyPlayedTimeEntry year */
        year?: (number|null);

        /** MonthlyPlayedTimeEntry playedTime */
        playedTime?: (number|null);
    }

    /** Represents a MonthlyPlayedTimeEntry. */
    class MonthlyPlayedTimeEntry implements IMonthlyPlayedTimeEntry {

        /**
         * Constructs a new MonthlyPlayedTimeEntry.
         * @param [properties] Properties to set
         */
        constructor(properties?: nextpex.IMonthlyPlayedTimeEntry);

        /** MonthlyPlayedTimeEntry month. */
        public month: number;

        /** MonthlyPlayedTimeEntry year. */
        public year: number;

        /** MonthlyPlayedTimeEntry playedTime. */
        public playedTime: number;

        /**
         * Creates a new MonthlyPlayedTimeEntry instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MonthlyPlayedTimeEntry instance
         */
        public static create(properties?: nextpex.IMonthlyPlayedTimeEntry): nextpex.MonthlyPlayedTimeEntry;

        /**
         * Encodes the specified MonthlyPlayedTimeEntry message. Does not implicitly {@link nextpex.MonthlyPlayedTimeEntry.verify|verify} messages.
         * @param message MonthlyPlayedTimeEntry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: nextpex.IMonthlyPlayedTimeEntry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MonthlyPlayedTimeEntry message, length delimited. Does not implicitly {@link nextpex.MonthlyPlayedTimeEntry.verify|verify} messages.
         * @param message MonthlyPlayedTimeEntry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: nextpex.IMonthlyPlayedTimeEntry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MonthlyPlayedTimeEntry message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MonthlyPlayedTimeEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): nextpex.MonthlyPlayedTimeEntry;

        /**
         * Decodes a MonthlyPlayedTimeEntry message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MonthlyPlayedTimeEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): nextpex.MonthlyPlayedTimeEntry;

        /**
         * Verifies a MonthlyPlayedTimeEntry message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MonthlyPlayedTimeEntry message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MonthlyPlayedTimeEntry
         */
        public static fromObject(object: { [k: string]: any }): nextpex.MonthlyPlayedTimeEntry;

        /**
         * Creates a plain object from a MonthlyPlayedTimeEntry message. Also converts values to other types if specified.
         * @param message MonthlyPlayedTimeEntry
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: nextpex.MonthlyPlayedTimeEntry, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MonthlyPlayedTimeEntry to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MonthlyPlayedTimeEntry
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MonthlyPlayedTime. */
    interface IMonthlyPlayedTime {

        /** MonthlyPlayedTime username */
        username?: (string|null);

        /** MonthlyPlayedTime game */
        game?: (string|null);

        /** MonthlyPlayedTime entries */
        entries?: (nextpex.IMonthlyPlayedTimeEntry[]|null);
    }

    /** Represents a MonthlyPlayedTime. */
    class MonthlyPlayedTime implements IMonthlyPlayedTime {

        /**
         * Constructs a new MonthlyPlayedTime.
         * @param [properties] Properties to set
         */
        constructor(properties?: nextpex.IMonthlyPlayedTime);

        /** MonthlyPlayedTime username. */
        public username: string;

        /** MonthlyPlayedTime game. */
        public game: string;

        /** MonthlyPlayedTime entries. */
        public entries: nextpex.IMonthlyPlayedTimeEntry[];

        /**
         * Creates a new MonthlyPlayedTime instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MonthlyPlayedTime instance
         */
        public static create(properties?: nextpex.IMonthlyPlayedTime): nextpex.MonthlyPlayedTime;

        /**
         * Encodes the specified MonthlyPlayedTime message. Does not implicitly {@link nextpex.MonthlyPlayedTime.verify|verify} messages.
         * @param message MonthlyPlayedTime message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: nextpex.IMonthlyPlayedTime, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MonthlyPlayedTime message, length delimited. Does not implicitly {@link nextpex.MonthlyPlayedTime.verify|verify} messages.
         * @param message MonthlyPlayedTime message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: nextpex.IMonthlyPlayedTime, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MonthlyPlayedTime message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MonthlyPlayedTime
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): nextpex.MonthlyPlayedTime;

        /**
         * Decodes a MonthlyPlayedTime message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MonthlyPlayedTime
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): nextpex.MonthlyPlayedTime;

        /**
         * Verifies a MonthlyPlayedTime message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MonthlyPlayedTime message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MonthlyPlayedTime
         */
        public static fromObject(object: { [k: string]: any }): nextpex.MonthlyPlayedTime;

        /**
         * Creates a plain object from a MonthlyPlayedTime message. Also converts values to other types if specified.
         * @param message MonthlyPlayedTime
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: nextpex.MonthlyPlayedTime, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MonthlyPlayedTime to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MonthlyPlayedTime
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MonthlyCheckResponse. */
    interface IMonthlyCheckResponse {

        /** MonthlyCheckResponse data */
        data?: (nextpex.IMonthlyPlayedTime[]|null);
    }

    /** Represents a MonthlyCheckResponse. */
    class MonthlyCheckResponse implements IMonthlyCheckResponse {

        /**
         * Constructs a new MonthlyCheckResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: nextpex.IMonthlyCheckResponse);

        /** MonthlyCheckResponse data. */
        public data: nextpex.IMonthlyPlayedTime[];

        /**
         * Creates a new MonthlyCheckResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MonthlyCheckResponse instance
         */
        public static create(properties?: nextpex.IMonthlyCheckResponse): nextpex.MonthlyCheckResponse;

        /**
         * Encodes the specified MonthlyCheckResponse message. Does not implicitly {@link nextpex.MonthlyCheckResponse.verify|verify} messages.
         * @param message MonthlyCheckResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: nextpex.IMonthlyCheckResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MonthlyCheckResponse message, length delimited. Does not implicitly {@link nextpex.MonthlyCheckResponse.verify|verify} messages.
         * @param message MonthlyCheckResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: nextpex.IMonthlyCheckResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MonthlyCheckResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MonthlyCheckResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): nextpex.MonthlyCheckResponse;

        /**
         * Decodes a MonthlyCheckResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MonthlyCheckResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): nextpex.MonthlyCheckResponse;

        /**
         * Verifies a MonthlyCheckResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MonthlyCheckResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MonthlyCheckResponse
         */
        public static fromObject(object: { [k: string]: any }): nextpex.MonthlyCheckResponse;

        /**
         * Creates a plain object from a MonthlyCheckResponse message. Also converts values to other types if specified.
         * @param message MonthlyCheckResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: nextpex.MonthlyCheckResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MonthlyCheckResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MonthlyCheckResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
