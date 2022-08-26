/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const nextpex = $root.nextpex = (() => {

    /**
     * Namespace nextpex.
     * @exports nextpex
     * @namespace
     */
    const nextpex = {};

    nextpex.Time = (function() {

        /**
         * Properties of a Time.
         * @memberof nextpex
         * @interface ITime
         * @property {number|null} [hour] Time hour
         * @property {number|null} [minute] Time minute
         * @property {number|null} [second] Time second
         * @property {number|null} [date] Time date
         * @property {number|null} [month] Time month
         * @property {number|null} [year] Time year
         */

        /**
         * Constructs a new Time.
         * @memberof nextpex
         * @classdesc Represents a Time.
         * @implements ITime
         * @constructor
         * @param {nextpex.ITime=} [properties] Properties to set
         */
        function Time(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Time hour.
         * @member {number} hour
         * @memberof nextpex.Time
         * @instance
         */
        Time.prototype.hour = 0;

        /**
         * Time minute.
         * @member {number} minute
         * @memberof nextpex.Time
         * @instance
         */
        Time.prototype.minute = 0;

        /**
         * Time second.
         * @member {number} second
         * @memberof nextpex.Time
         * @instance
         */
        Time.prototype.second = 0;

        /**
         * Time date.
         * @member {number} date
         * @memberof nextpex.Time
         * @instance
         */
        Time.prototype.date = 0;

        /**
         * Time month.
         * @member {number} month
         * @memberof nextpex.Time
         * @instance
         */
        Time.prototype.month = 0;

        /**
         * Time year.
         * @member {number} year
         * @memberof nextpex.Time
         * @instance
         */
        Time.prototype.year = 0;

        /**
         * Creates a new Time instance using the specified properties.
         * @function create
         * @memberof nextpex.Time
         * @static
         * @param {nextpex.ITime=} [properties] Properties to set
         * @returns {nextpex.Time} Time instance
         */
        Time.create = function create(properties) {
            return new Time(properties);
        };

        /**
         * Encodes the specified Time message. Does not implicitly {@link nextpex.Time.verify|verify} messages.
         * @function encode
         * @memberof nextpex.Time
         * @static
         * @param {nextpex.ITime} message Time message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Time.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.hour != null && Object.hasOwnProperty.call(message, "hour"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.hour);
            if (message.minute != null && Object.hasOwnProperty.call(message, "minute"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.minute);
            if (message.second != null && Object.hasOwnProperty.call(message, "second"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.second);
            if (message.date != null && Object.hasOwnProperty.call(message, "date"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.date);
            if (message.month != null && Object.hasOwnProperty.call(message, "month"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.month);
            if (message.year != null && Object.hasOwnProperty.call(message, "year"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.year);
            return writer;
        };

        /**
         * Encodes the specified Time message, length delimited. Does not implicitly {@link nextpex.Time.verify|verify} messages.
         * @function encodeDelimited
         * @memberof nextpex.Time
         * @static
         * @param {nextpex.ITime} message Time message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Time.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Time message from the specified reader or buffer.
         * @function decode
         * @memberof nextpex.Time
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {nextpex.Time} Time
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Time.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.nextpex.Time();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.hour = reader.int32();
                        break;
                    }
                case 2: {
                        message.minute = reader.int32();
                        break;
                    }
                case 3: {
                        message.second = reader.int32();
                        break;
                    }
                case 4: {
                        message.date = reader.int32();
                        break;
                    }
                case 5: {
                        message.month = reader.int32();
                        break;
                    }
                case 6: {
                        message.year = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Time message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof nextpex.Time
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {nextpex.Time} Time
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Time.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Time message.
         * @function verify
         * @memberof nextpex.Time
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Time.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.hour != null && message.hasOwnProperty("hour"))
                if (!$util.isInteger(message.hour))
                    return "hour: integer expected";
            if (message.minute != null && message.hasOwnProperty("minute"))
                if (!$util.isInteger(message.minute))
                    return "minute: integer expected";
            if (message.second != null && message.hasOwnProperty("second"))
                if (!$util.isInteger(message.second))
                    return "second: integer expected";
            if (message.date != null && message.hasOwnProperty("date"))
                if (!$util.isInteger(message.date))
                    return "date: integer expected";
            if (message.month != null && message.hasOwnProperty("month"))
                if (!$util.isInteger(message.month))
                    return "month: integer expected";
            if (message.year != null && message.hasOwnProperty("year"))
                if (!$util.isInteger(message.year))
                    return "year: integer expected";
            return null;
        };

        /**
         * Creates a Time message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof nextpex.Time
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {nextpex.Time} Time
         */
        Time.fromObject = function fromObject(object) {
            if (object instanceof $root.nextpex.Time)
                return object;
            let message = new $root.nextpex.Time();
            if (object.hour != null)
                message.hour = object.hour | 0;
            if (object.minute != null)
                message.minute = object.minute | 0;
            if (object.second != null)
                message.second = object.second | 0;
            if (object.date != null)
                message.date = object.date | 0;
            if (object.month != null)
                message.month = object.month | 0;
            if (object.year != null)
                message.year = object.year | 0;
            return message;
        };

        /**
         * Creates a plain object from a Time message. Also converts values to other types if specified.
         * @function toObject
         * @memberof nextpex.Time
         * @static
         * @param {nextpex.Time} message Time
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Time.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.hour = 0;
                object.minute = 0;
                object.second = 0;
                object.date = 0;
                object.month = 0;
                object.year = 0;
            }
            if (message.hour != null && message.hasOwnProperty("hour"))
                object.hour = message.hour;
            if (message.minute != null && message.hasOwnProperty("minute"))
                object.minute = message.minute;
            if (message.second != null && message.hasOwnProperty("second"))
                object.second = message.second;
            if (message.date != null && message.hasOwnProperty("date"))
                object.date = message.date;
            if (message.month != null && message.hasOwnProperty("month"))
                object.month = message.month;
            if (message.year != null && message.hasOwnProperty("year"))
                object.year = message.year;
            return object;
        };

        /**
         * Converts this Time to JSON.
         * @function toJSON
         * @memberof nextpex.Time
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Time.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Time
         * @function getTypeUrl
         * @memberof nextpex.Time
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Time.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/nextpex.Time";
        };

        return Time;
    })();

    nextpex.LevelResponse = (function() {

        /**
         * Properties of a LevelResponse.
         * @memberof nextpex
         * @interface ILevelResponse
         * @property {number|null} [level] LevelResponse level
         * @property {nextpex.ITime|null} [time] LevelResponse time
         * @property {string|null} [username] LevelResponse username
         */

        /**
         * Constructs a new LevelResponse.
         * @memberof nextpex
         * @classdesc Represents a LevelResponse.
         * @implements ILevelResponse
         * @constructor
         * @param {nextpex.ILevelResponse=} [properties] Properties to set
         */
        function LevelResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LevelResponse level.
         * @member {number} level
         * @memberof nextpex.LevelResponse
         * @instance
         */
        LevelResponse.prototype.level = 0;

        /**
         * LevelResponse time.
         * @member {nextpex.ITime|null|undefined} time
         * @memberof nextpex.LevelResponse
         * @instance
         */
        LevelResponse.prototype.time = null;

        /**
         * LevelResponse username.
         * @member {string} username
         * @memberof nextpex.LevelResponse
         * @instance
         */
        LevelResponse.prototype.username = "";

        /**
         * Creates a new LevelResponse instance using the specified properties.
         * @function create
         * @memberof nextpex.LevelResponse
         * @static
         * @param {nextpex.ILevelResponse=} [properties] Properties to set
         * @returns {nextpex.LevelResponse} LevelResponse instance
         */
        LevelResponse.create = function create(properties) {
            return new LevelResponse(properties);
        };

        /**
         * Encodes the specified LevelResponse message. Does not implicitly {@link nextpex.LevelResponse.verify|verify} messages.
         * @function encode
         * @memberof nextpex.LevelResponse
         * @static
         * @param {nextpex.ILevelResponse} message LevelResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LevelResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.level != null && Object.hasOwnProperty.call(message, "level"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.level);
            if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                $root.nextpex.Time.encode(message.time, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.username != null && Object.hasOwnProperty.call(message, "username"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.username);
            return writer;
        };

        /**
         * Encodes the specified LevelResponse message, length delimited. Does not implicitly {@link nextpex.LevelResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof nextpex.LevelResponse
         * @static
         * @param {nextpex.ILevelResponse} message LevelResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LevelResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LevelResponse message from the specified reader or buffer.
         * @function decode
         * @memberof nextpex.LevelResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {nextpex.LevelResponse} LevelResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LevelResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.nextpex.LevelResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.level = reader.int32();
                        break;
                    }
                case 2: {
                        message.time = $root.nextpex.Time.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.username = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LevelResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof nextpex.LevelResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {nextpex.LevelResponse} LevelResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LevelResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LevelResponse message.
         * @function verify
         * @memberof nextpex.LevelResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LevelResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.level != null && message.hasOwnProperty("level"))
                if (!$util.isInteger(message.level))
                    return "level: integer expected";
            if (message.time != null && message.hasOwnProperty("time")) {
                let error = $root.nextpex.Time.verify(message.time);
                if (error)
                    return "time." + error;
            }
            if (message.username != null && message.hasOwnProperty("username"))
                if (!$util.isString(message.username))
                    return "username: string expected";
            return null;
        };

        /**
         * Creates a LevelResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof nextpex.LevelResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {nextpex.LevelResponse} LevelResponse
         */
        LevelResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.nextpex.LevelResponse)
                return object;
            let message = new $root.nextpex.LevelResponse();
            if (object.level != null)
                message.level = object.level | 0;
            if (object.time != null) {
                if (typeof object.time !== "object")
                    throw TypeError(".nextpex.LevelResponse.time: object expected");
                message.time = $root.nextpex.Time.fromObject(object.time);
            }
            if (object.username != null)
                message.username = String(object.username);
            return message;
        };

        /**
         * Creates a plain object from a LevelResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof nextpex.LevelResponse
         * @static
         * @param {nextpex.LevelResponse} message LevelResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LevelResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.level = 0;
                object.time = null;
                object.username = "";
            }
            if (message.level != null && message.hasOwnProperty("level"))
                object.level = message.level;
            if (message.time != null && message.hasOwnProperty("time"))
                object.time = $root.nextpex.Time.toObject(message.time, options);
            if (message.username != null && message.hasOwnProperty("username"))
                object.username = message.username;
            return object;
        };

        /**
         * Converts this LevelResponse to JSON.
         * @function toJSON
         * @memberof nextpex.LevelResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LevelResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for LevelResponse
         * @function getTypeUrl
         * @memberof nextpex.LevelResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LevelResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/nextpex.LevelResponse";
        };

        return LevelResponse;
    })();

    nextpex.AllLevelResponse = (function() {

        /**
         * Properties of an AllLevelResponse.
         * @memberof nextpex
         * @interface IAllLevelResponse
         * @property {Array.<nextpex.ILevelResponse>|null} [levels] AllLevelResponse levels
         */

        /**
         * Constructs a new AllLevelResponse.
         * @memberof nextpex
         * @classdesc Represents an AllLevelResponse.
         * @implements IAllLevelResponse
         * @constructor
         * @param {nextpex.IAllLevelResponse=} [properties] Properties to set
         */
        function AllLevelResponse(properties) {
            this.levels = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AllLevelResponse levels.
         * @member {Array.<nextpex.ILevelResponse>} levels
         * @memberof nextpex.AllLevelResponse
         * @instance
         */
        AllLevelResponse.prototype.levels = $util.emptyArray;

        /**
         * Creates a new AllLevelResponse instance using the specified properties.
         * @function create
         * @memberof nextpex.AllLevelResponse
         * @static
         * @param {nextpex.IAllLevelResponse=} [properties] Properties to set
         * @returns {nextpex.AllLevelResponse} AllLevelResponse instance
         */
        AllLevelResponse.create = function create(properties) {
            return new AllLevelResponse(properties);
        };

        /**
         * Encodes the specified AllLevelResponse message. Does not implicitly {@link nextpex.AllLevelResponse.verify|verify} messages.
         * @function encode
         * @memberof nextpex.AllLevelResponse
         * @static
         * @param {nextpex.IAllLevelResponse} message AllLevelResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AllLevelResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.levels != null && message.levels.length)
                for (let i = 0; i < message.levels.length; ++i)
                    $root.nextpex.LevelResponse.encode(message.levels[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified AllLevelResponse message, length delimited. Does not implicitly {@link nextpex.AllLevelResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof nextpex.AllLevelResponse
         * @static
         * @param {nextpex.IAllLevelResponse} message AllLevelResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AllLevelResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AllLevelResponse message from the specified reader or buffer.
         * @function decode
         * @memberof nextpex.AllLevelResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {nextpex.AllLevelResponse} AllLevelResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AllLevelResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.nextpex.AllLevelResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.levels && message.levels.length))
                            message.levels = [];
                        message.levels.push($root.nextpex.LevelResponse.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AllLevelResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof nextpex.AllLevelResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {nextpex.AllLevelResponse} AllLevelResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AllLevelResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AllLevelResponse message.
         * @function verify
         * @memberof nextpex.AllLevelResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AllLevelResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.levels != null && message.hasOwnProperty("levels")) {
                if (!Array.isArray(message.levels))
                    return "levels: array expected";
                for (let i = 0; i < message.levels.length; ++i) {
                    let error = $root.nextpex.LevelResponse.verify(message.levels[i]);
                    if (error)
                        return "levels." + error;
                }
            }
            return null;
        };

        /**
         * Creates an AllLevelResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof nextpex.AllLevelResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {nextpex.AllLevelResponse} AllLevelResponse
         */
        AllLevelResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.nextpex.AllLevelResponse)
                return object;
            let message = new $root.nextpex.AllLevelResponse();
            if (object.levels) {
                if (!Array.isArray(object.levels))
                    throw TypeError(".nextpex.AllLevelResponse.levels: array expected");
                message.levels = [];
                for (let i = 0; i < object.levels.length; ++i) {
                    if (typeof object.levels[i] !== "object")
                        throw TypeError(".nextpex.AllLevelResponse.levels: object expected");
                    message.levels[i] = $root.nextpex.LevelResponse.fromObject(object.levels[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an AllLevelResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof nextpex.AllLevelResponse
         * @static
         * @param {nextpex.AllLevelResponse} message AllLevelResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AllLevelResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.levels = [];
            if (message.levels && message.levels.length) {
                object.levels = [];
                for (let j = 0; j < message.levels.length; ++j)
                    object.levels[j] = $root.nextpex.LevelResponse.toObject(message.levels[j], options);
            }
            return object;
        };

        /**
         * Converts this AllLevelResponse to JSON.
         * @function toJSON
         * @memberof nextpex.AllLevelResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AllLevelResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for AllLevelResponse
         * @function getTypeUrl
         * @memberof nextpex.AllLevelResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        AllLevelResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/nextpex.AllLevelResponse";
        };

        return AllLevelResponse;
    })();

    nextpex.RankResponse = (function() {

        /**
         * Properties of a RankResponse.
         * @memberof nextpex
         * @interface IRankResponse
         * @property {number|null} [rank] RankResponse rank
         * @property {nextpex.ITime|null} [time] RankResponse time
         * @property {string|null} [username] RankResponse username
         */

        /**
         * Constructs a new RankResponse.
         * @memberof nextpex
         * @classdesc Represents a RankResponse.
         * @implements IRankResponse
         * @constructor
         * @param {nextpex.IRankResponse=} [properties] Properties to set
         */
        function RankResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RankResponse rank.
         * @member {number} rank
         * @memberof nextpex.RankResponse
         * @instance
         */
        RankResponse.prototype.rank = 0;

        /**
         * RankResponse time.
         * @member {nextpex.ITime|null|undefined} time
         * @memberof nextpex.RankResponse
         * @instance
         */
        RankResponse.prototype.time = null;

        /**
         * RankResponse username.
         * @member {string} username
         * @memberof nextpex.RankResponse
         * @instance
         */
        RankResponse.prototype.username = "";

        /**
         * Creates a new RankResponse instance using the specified properties.
         * @function create
         * @memberof nextpex.RankResponse
         * @static
         * @param {nextpex.IRankResponse=} [properties] Properties to set
         * @returns {nextpex.RankResponse} RankResponse instance
         */
        RankResponse.create = function create(properties) {
            return new RankResponse(properties);
        };

        /**
         * Encodes the specified RankResponse message. Does not implicitly {@link nextpex.RankResponse.verify|verify} messages.
         * @function encode
         * @memberof nextpex.RankResponse
         * @static
         * @param {nextpex.IRankResponse} message RankResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RankResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.rank != null && Object.hasOwnProperty.call(message, "rank"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.rank);
            if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                $root.nextpex.Time.encode(message.time, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.username != null && Object.hasOwnProperty.call(message, "username"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.username);
            return writer;
        };

        /**
         * Encodes the specified RankResponse message, length delimited. Does not implicitly {@link nextpex.RankResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof nextpex.RankResponse
         * @static
         * @param {nextpex.IRankResponse} message RankResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RankResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RankResponse message from the specified reader or buffer.
         * @function decode
         * @memberof nextpex.RankResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {nextpex.RankResponse} RankResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RankResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.nextpex.RankResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.rank = reader.int32();
                        break;
                    }
                case 2: {
                        message.time = $root.nextpex.Time.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.username = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RankResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof nextpex.RankResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {nextpex.RankResponse} RankResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RankResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RankResponse message.
         * @function verify
         * @memberof nextpex.RankResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RankResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.rank != null && message.hasOwnProperty("rank"))
                if (!$util.isInteger(message.rank))
                    return "rank: integer expected";
            if (message.time != null && message.hasOwnProperty("time")) {
                let error = $root.nextpex.Time.verify(message.time);
                if (error)
                    return "time." + error;
            }
            if (message.username != null && message.hasOwnProperty("username"))
                if (!$util.isString(message.username))
                    return "username: string expected";
            return null;
        };

        /**
         * Creates a RankResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof nextpex.RankResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {nextpex.RankResponse} RankResponse
         */
        RankResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.nextpex.RankResponse)
                return object;
            let message = new $root.nextpex.RankResponse();
            if (object.rank != null)
                message.rank = object.rank | 0;
            if (object.time != null) {
                if (typeof object.time !== "object")
                    throw TypeError(".nextpex.RankResponse.time: object expected");
                message.time = $root.nextpex.Time.fromObject(object.time);
            }
            if (object.username != null)
                message.username = String(object.username);
            return message;
        };

        /**
         * Creates a plain object from a RankResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof nextpex.RankResponse
         * @static
         * @param {nextpex.RankResponse} message RankResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RankResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.rank = 0;
                object.time = null;
                object.username = "";
            }
            if (message.rank != null && message.hasOwnProperty("rank"))
                object.rank = message.rank;
            if (message.time != null && message.hasOwnProperty("time"))
                object.time = $root.nextpex.Time.toObject(message.time, options);
            if (message.username != null && message.hasOwnProperty("username"))
                object.username = message.username;
            return object;
        };

        /**
         * Converts this RankResponse to JSON.
         * @function toJSON
         * @memberof nextpex.RankResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RankResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for RankResponse
         * @function getTypeUrl
         * @memberof nextpex.RankResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        RankResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/nextpex.RankResponse";
        };

        return RankResponse;
    })();

    nextpex.AllRankResponse = (function() {

        /**
         * Properties of an AllRankResponse.
         * @memberof nextpex
         * @interface IAllRankResponse
         * @property {Array.<nextpex.IRankResponse>|null} [ranks] AllRankResponse ranks
         */

        /**
         * Constructs a new AllRankResponse.
         * @memberof nextpex
         * @classdesc Represents an AllRankResponse.
         * @implements IAllRankResponse
         * @constructor
         * @param {nextpex.IAllRankResponse=} [properties] Properties to set
         */
        function AllRankResponse(properties) {
            this.ranks = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AllRankResponse ranks.
         * @member {Array.<nextpex.IRankResponse>} ranks
         * @memberof nextpex.AllRankResponse
         * @instance
         */
        AllRankResponse.prototype.ranks = $util.emptyArray;

        /**
         * Creates a new AllRankResponse instance using the specified properties.
         * @function create
         * @memberof nextpex.AllRankResponse
         * @static
         * @param {nextpex.IAllRankResponse=} [properties] Properties to set
         * @returns {nextpex.AllRankResponse} AllRankResponse instance
         */
        AllRankResponse.create = function create(properties) {
            return new AllRankResponse(properties);
        };

        /**
         * Encodes the specified AllRankResponse message. Does not implicitly {@link nextpex.AllRankResponse.verify|verify} messages.
         * @function encode
         * @memberof nextpex.AllRankResponse
         * @static
         * @param {nextpex.IAllRankResponse} message AllRankResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AllRankResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ranks != null && message.ranks.length)
                for (let i = 0; i < message.ranks.length; ++i)
                    $root.nextpex.RankResponse.encode(message.ranks[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified AllRankResponse message, length delimited. Does not implicitly {@link nextpex.AllRankResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof nextpex.AllRankResponse
         * @static
         * @param {nextpex.IAllRankResponse} message AllRankResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AllRankResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AllRankResponse message from the specified reader or buffer.
         * @function decode
         * @memberof nextpex.AllRankResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {nextpex.AllRankResponse} AllRankResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AllRankResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.nextpex.AllRankResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.ranks && message.ranks.length))
                            message.ranks = [];
                        message.ranks.push($root.nextpex.RankResponse.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AllRankResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof nextpex.AllRankResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {nextpex.AllRankResponse} AllRankResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AllRankResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AllRankResponse message.
         * @function verify
         * @memberof nextpex.AllRankResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AllRankResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ranks != null && message.hasOwnProperty("ranks")) {
                if (!Array.isArray(message.ranks))
                    return "ranks: array expected";
                for (let i = 0; i < message.ranks.length; ++i) {
                    let error = $root.nextpex.RankResponse.verify(message.ranks[i]);
                    if (error)
                        return "ranks." + error;
                }
            }
            return null;
        };

        /**
         * Creates an AllRankResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof nextpex.AllRankResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {nextpex.AllRankResponse} AllRankResponse
         */
        AllRankResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.nextpex.AllRankResponse)
                return object;
            let message = new $root.nextpex.AllRankResponse();
            if (object.ranks) {
                if (!Array.isArray(object.ranks))
                    throw TypeError(".nextpex.AllRankResponse.ranks: array expected");
                message.ranks = [];
                for (let i = 0; i < object.ranks.length; ++i) {
                    if (typeof object.ranks[i] !== "object")
                        throw TypeError(".nextpex.AllRankResponse.ranks: object expected");
                    message.ranks[i] = $root.nextpex.RankResponse.fromObject(object.ranks[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an AllRankResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof nextpex.AllRankResponse
         * @static
         * @param {nextpex.AllRankResponse} message AllRankResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AllRankResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.ranks = [];
            if (message.ranks && message.ranks.length) {
                object.ranks = [];
                for (let j = 0; j < message.ranks.length; ++j)
                    object.ranks[j] = $root.nextpex.RankResponse.toObject(message.ranks[j], options);
            }
            return object;
        };

        /**
         * Converts this AllRankResponse to JSON.
         * @function toJSON
         * @memberof nextpex.AllRankResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AllRankResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for AllRankResponse
         * @function getTypeUrl
         * @memberof nextpex.AllRankResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        AllRankResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/nextpex.AllRankResponse";
        };

        return AllRankResponse;
    })();

    nextpex.NowPlayingResponse = (function() {

        /**
         * Properties of a NowPlayingResponse.
         * @memberof nextpex
         * @interface INowPlayingResponse
         * @property {string|null} [username] NowPlayingResponse username
         * @property {string|null} [game] NowPlayingResponse game
         * @property {nextpex.ITime|null} [startedAt] NowPlayingResponse startedAt
         */

        /**
         * Constructs a new NowPlayingResponse.
         * @memberof nextpex
         * @classdesc Represents a NowPlayingResponse.
         * @implements INowPlayingResponse
         * @constructor
         * @param {nextpex.INowPlayingResponse=} [properties] Properties to set
         */
        function NowPlayingResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * NowPlayingResponse username.
         * @member {string} username
         * @memberof nextpex.NowPlayingResponse
         * @instance
         */
        NowPlayingResponse.prototype.username = "";

        /**
         * NowPlayingResponse game.
         * @member {string} game
         * @memberof nextpex.NowPlayingResponse
         * @instance
         */
        NowPlayingResponse.prototype.game = "";

        /**
         * NowPlayingResponse startedAt.
         * @member {nextpex.ITime|null|undefined} startedAt
         * @memberof nextpex.NowPlayingResponse
         * @instance
         */
        NowPlayingResponse.prototype.startedAt = null;

        /**
         * Creates a new NowPlayingResponse instance using the specified properties.
         * @function create
         * @memberof nextpex.NowPlayingResponse
         * @static
         * @param {nextpex.INowPlayingResponse=} [properties] Properties to set
         * @returns {nextpex.NowPlayingResponse} NowPlayingResponse instance
         */
        NowPlayingResponse.create = function create(properties) {
            return new NowPlayingResponse(properties);
        };

        /**
         * Encodes the specified NowPlayingResponse message. Does not implicitly {@link nextpex.NowPlayingResponse.verify|verify} messages.
         * @function encode
         * @memberof nextpex.NowPlayingResponse
         * @static
         * @param {nextpex.INowPlayingResponse} message NowPlayingResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NowPlayingResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.username != null && Object.hasOwnProperty.call(message, "username"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.username);
            if (message.game != null && Object.hasOwnProperty.call(message, "game"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.game);
            if (message.startedAt != null && Object.hasOwnProperty.call(message, "startedAt"))
                $root.nextpex.Time.encode(message.startedAt, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified NowPlayingResponse message, length delimited. Does not implicitly {@link nextpex.NowPlayingResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof nextpex.NowPlayingResponse
         * @static
         * @param {nextpex.INowPlayingResponse} message NowPlayingResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NowPlayingResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a NowPlayingResponse message from the specified reader or buffer.
         * @function decode
         * @memberof nextpex.NowPlayingResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {nextpex.NowPlayingResponse} NowPlayingResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NowPlayingResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.nextpex.NowPlayingResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.username = reader.string();
                        break;
                    }
                case 2: {
                        message.game = reader.string();
                        break;
                    }
                case 3: {
                        message.startedAt = $root.nextpex.Time.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a NowPlayingResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof nextpex.NowPlayingResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {nextpex.NowPlayingResponse} NowPlayingResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NowPlayingResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a NowPlayingResponse message.
         * @function verify
         * @memberof nextpex.NowPlayingResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NowPlayingResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.username != null && message.hasOwnProperty("username"))
                if (!$util.isString(message.username))
                    return "username: string expected";
            if (message.game != null && message.hasOwnProperty("game"))
                if (!$util.isString(message.game))
                    return "game: string expected";
            if (message.startedAt != null && message.hasOwnProperty("startedAt")) {
                let error = $root.nextpex.Time.verify(message.startedAt);
                if (error)
                    return "startedAt." + error;
            }
            return null;
        };

        /**
         * Creates a NowPlayingResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof nextpex.NowPlayingResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {nextpex.NowPlayingResponse} NowPlayingResponse
         */
        NowPlayingResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.nextpex.NowPlayingResponse)
                return object;
            let message = new $root.nextpex.NowPlayingResponse();
            if (object.username != null)
                message.username = String(object.username);
            if (object.game != null)
                message.game = String(object.game);
            if (object.startedAt != null) {
                if (typeof object.startedAt !== "object")
                    throw TypeError(".nextpex.NowPlayingResponse.startedAt: object expected");
                message.startedAt = $root.nextpex.Time.fromObject(object.startedAt);
            }
            return message;
        };

        /**
         * Creates a plain object from a NowPlayingResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof nextpex.NowPlayingResponse
         * @static
         * @param {nextpex.NowPlayingResponse} message NowPlayingResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NowPlayingResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.username = "";
                object.game = "";
                object.startedAt = null;
            }
            if (message.username != null && message.hasOwnProperty("username"))
                object.username = message.username;
            if (message.game != null && message.hasOwnProperty("game"))
                object.game = message.game;
            if (message.startedAt != null && message.hasOwnProperty("startedAt"))
                object.startedAt = $root.nextpex.Time.toObject(message.startedAt, options);
            return object;
        };

        /**
         * Converts this NowPlayingResponse to JSON.
         * @function toJSON
         * @memberof nextpex.NowPlayingResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NowPlayingResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for NowPlayingResponse
         * @function getTypeUrl
         * @memberof nextpex.NowPlayingResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        NowPlayingResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/nextpex.NowPlayingResponse";
        };

        return NowPlayingResponse;
    })();

    nextpex.AllNowPlayingResponse = (function() {

        /**
         * Properties of an AllNowPlayingResponse.
         * @memberof nextpex
         * @interface IAllNowPlayingResponse
         * @property {Array.<nextpex.INowPlayingResponse>|null} [nowPlayings] AllNowPlayingResponse nowPlayings
         */

        /**
         * Constructs a new AllNowPlayingResponse.
         * @memberof nextpex
         * @classdesc Represents an AllNowPlayingResponse.
         * @implements IAllNowPlayingResponse
         * @constructor
         * @param {nextpex.IAllNowPlayingResponse=} [properties] Properties to set
         */
        function AllNowPlayingResponse(properties) {
            this.nowPlayings = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AllNowPlayingResponse nowPlayings.
         * @member {Array.<nextpex.INowPlayingResponse>} nowPlayings
         * @memberof nextpex.AllNowPlayingResponse
         * @instance
         */
        AllNowPlayingResponse.prototype.nowPlayings = $util.emptyArray;

        /**
         * Creates a new AllNowPlayingResponse instance using the specified properties.
         * @function create
         * @memberof nextpex.AllNowPlayingResponse
         * @static
         * @param {nextpex.IAllNowPlayingResponse=} [properties] Properties to set
         * @returns {nextpex.AllNowPlayingResponse} AllNowPlayingResponse instance
         */
        AllNowPlayingResponse.create = function create(properties) {
            return new AllNowPlayingResponse(properties);
        };

        /**
         * Encodes the specified AllNowPlayingResponse message. Does not implicitly {@link nextpex.AllNowPlayingResponse.verify|verify} messages.
         * @function encode
         * @memberof nextpex.AllNowPlayingResponse
         * @static
         * @param {nextpex.IAllNowPlayingResponse} message AllNowPlayingResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AllNowPlayingResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nowPlayings != null && message.nowPlayings.length)
                for (let i = 0; i < message.nowPlayings.length; ++i)
                    $root.nextpex.NowPlayingResponse.encode(message.nowPlayings[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified AllNowPlayingResponse message, length delimited. Does not implicitly {@link nextpex.AllNowPlayingResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof nextpex.AllNowPlayingResponse
         * @static
         * @param {nextpex.IAllNowPlayingResponse} message AllNowPlayingResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AllNowPlayingResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AllNowPlayingResponse message from the specified reader or buffer.
         * @function decode
         * @memberof nextpex.AllNowPlayingResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {nextpex.AllNowPlayingResponse} AllNowPlayingResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AllNowPlayingResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.nextpex.AllNowPlayingResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.nowPlayings && message.nowPlayings.length))
                            message.nowPlayings = [];
                        message.nowPlayings.push($root.nextpex.NowPlayingResponse.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AllNowPlayingResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof nextpex.AllNowPlayingResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {nextpex.AllNowPlayingResponse} AllNowPlayingResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AllNowPlayingResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AllNowPlayingResponse message.
         * @function verify
         * @memberof nextpex.AllNowPlayingResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AllNowPlayingResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nowPlayings != null && message.hasOwnProperty("nowPlayings")) {
                if (!Array.isArray(message.nowPlayings))
                    return "nowPlayings: array expected";
                for (let i = 0; i < message.nowPlayings.length; ++i) {
                    let error = $root.nextpex.NowPlayingResponse.verify(message.nowPlayings[i]);
                    if (error)
                        return "nowPlayings." + error;
                }
            }
            return null;
        };

        /**
         * Creates an AllNowPlayingResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof nextpex.AllNowPlayingResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {nextpex.AllNowPlayingResponse} AllNowPlayingResponse
         */
        AllNowPlayingResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.nextpex.AllNowPlayingResponse)
                return object;
            let message = new $root.nextpex.AllNowPlayingResponse();
            if (object.nowPlayings) {
                if (!Array.isArray(object.nowPlayings))
                    throw TypeError(".nextpex.AllNowPlayingResponse.nowPlayings: array expected");
                message.nowPlayings = [];
                for (let i = 0; i < object.nowPlayings.length; ++i) {
                    if (typeof object.nowPlayings[i] !== "object")
                        throw TypeError(".nextpex.AllNowPlayingResponse.nowPlayings: object expected");
                    message.nowPlayings[i] = $root.nextpex.NowPlayingResponse.fromObject(object.nowPlayings[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an AllNowPlayingResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof nextpex.AllNowPlayingResponse
         * @static
         * @param {nextpex.AllNowPlayingResponse} message AllNowPlayingResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AllNowPlayingResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.nowPlayings = [];
            if (message.nowPlayings && message.nowPlayings.length) {
                object.nowPlayings = [];
                for (let j = 0; j < message.nowPlayings.length; ++j)
                    object.nowPlayings[j] = $root.nextpex.NowPlayingResponse.toObject(message.nowPlayings[j], options);
            }
            return object;
        };

        /**
         * Converts this AllNowPlayingResponse to JSON.
         * @function toJSON
         * @memberof nextpex.AllNowPlayingResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AllNowPlayingResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for AllNowPlayingResponse
         * @function getTypeUrl
         * @memberof nextpex.AllNowPlayingResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        AllNowPlayingResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/nextpex.AllNowPlayingResponse";
        };

        return AllNowPlayingResponse;
    })();

    nextpex.GameSession = (function() {

        /**
         * Properties of a GameSession.
         * @memberof nextpex
         * @interface IGameSession
         * @property {string|null} [username] GameSession username
         * @property {string|null} [game] GameSession game
         * @property {nextpex.ITime|null} [startedAt] GameSession startedAt
         * @property {nextpex.ITime|null} [endedAt] GameSession endedAt
         */

        /**
         * Constructs a new GameSession.
         * @memberof nextpex
         * @classdesc Represents a GameSession.
         * @implements IGameSession
         * @constructor
         * @param {nextpex.IGameSession=} [properties] Properties to set
         */
        function GameSession(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GameSession username.
         * @member {string} username
         * @memberof nextpex.GameSession
         * @instance
         */
        GameSession.prototype.username = "";

        /**
         * GameSession game.
         * @member {string} game
         * @memberof nextpex.GameSession
         * @instance
         */
        GameSession.prototype.game = "";

        /**
         * GameSession startedAt.
         * @member {nextpex.ITime|null|undefined} startedAt
         * @memberof nextpex.GameSession
         * @instance
         */
        GameSession.prototype.startedAt = null;

        /**
         * GameSession endedAt.
         * @member {nextpex.ITime|null|undefined} endedAt
         * @memberof nextpex.GameSession
         * @instance
         */
        GameSession.prototype.endedAt = null;

        /**
         * Creates a new GameSession instance using the specified properties.
         * @function create
         * @memberof nextpex.GameSession
         * @static
         * @param {nextpex.IGameSession=} [properties] Properties to set
         * @returns {nextpex.GameSession} GameSession instance
         */
        GameSession.create = function create(properties) {
            return new GameSession(properties);
        };

        /**
         * Encodes the specified GameSession message. Does not implicitly {@link nextpex.GameSession.verify|verify} messages.
         * @function encode
         * @memberof nextpex.GameSession
         * @static
         * @param {nextpex.IGameSession} message GameSession message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameSession.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.username != null && Object.hasOwnProperty.call(message, "username"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.username);
            if (message.game != null && Object.hasOwnProperty.call(message, "game"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.game);
            if (message.startedAt != null && Object.hasOwnProperty.call(message, "startedAt"))
                $root.nextpex.Time.encode(message.startedAt, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.endedAt != null && Object.hasOwnProperty.call(message, "endedAt"))
                $root.nextpex.Time.encode(message.endedAt, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GameSession message, length delimited. Does not implicitly {@link nextpex.GameSession.verify|verify} messages.
         * @function encodeDelimited
         * @memberof nextpex.GameSession
         * @static
         * @param {nextpex.IGameSession} message GameSession message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameSession.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameSession message from the specified reader or buffer.
         * @function decode
         * @memberof nextpex.GameSession
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {nextpex.GameSession} GameSession
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameSession.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.nextpex.GameSession();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.username = reader.string();
                        break;
                    }
                case 2: {
                        message.game = reader.string();
                        break;
                    }
                case 3: {
                        message.startedAt = $root.nextpex.Time.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.endedAt = $root.nextpex.Time.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GameSession message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof nextpex.GameSession
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {nextpex.GameSession} GameSession
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameSession.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameSession message.
         * @function verify
         * @memberof nextpex.GameSession
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameSession.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.username != null && message.hasOwnProperty("username"))
                if (!$util.isString(message.username))
                    return "username: string expected";
            if (message.game != null && message.hasOwnProperty("game"))
                if (!$util.isString(message.game))
                    return "game: string expected";
            if (message.startedAt != null && message.hasOwnProperty("startedAt")) {
                let error = $root.nextpex.Time.verify(message.startedAt);
                if (error)
                    return "startedAt." + error;
            }
            if (message.endedAt != null && message.hasOwnProperty("endedAt")) {
                let error = $root.nextpex.Time.verify(message.endedAt);
                if (error)
                    return "endedAt." + error;
            }
            return null;
        };

        /**
         * Creates a GameSession message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof nextpex.GameSession
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {nextpex.GameSession} GameSession
         */
        GameSession.fromObject = function fromObject(object) {
            if (object instanceof $root.nextpex.GameSession)
                return object;
            let message = new $root.nextpex.GameSession();
            if (object.username != null)
                message.username = String(object.username);
            if (object.game != null)
                message.game = String(object.game);
            if (object.startedAt != null) {
                if (typeof object.startedAt !== "object")
                    throw TypeError(".nextpex.GameSession.startedAt: object expected");
                message.startedAt = $root.nextpex.Time.fromObject(object.startedAt);
            }
            if (object.endedAt != null) {
                if (typeof object.endedAt !== "object")
                    throw TypeError(".nextpex.GameSession.endedAt: object expected");
                message.endedAt = $root.nextpex.Time.fromObject(object.endedAt);
            }
            return message;
        };

        /**
         * Creates a plain object from a GameSession message. Also converts values to other types if specified.
         * @function toObject
         * @memberof nextpex.GameSession
         * @static
         * @param {nextpex.GameSession} message GameSession
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameSession.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.username = "";
                object.game = "";
                object.startedAt = null;
                object.endedAt = null;
            }
            if (message.username != null && message.hasOwnProperty("username"))
                object.username = message.username;
            if (message.game != null && message.hasOwnProperty("game"))
                object.game = message.game;
            if (message.startedAt != null && message.hasOwnProperty("startedAt"))
                object.startedAt = $root.nextpex.Time.toObject(message.startedAt, options);
            if (message.endedAt != null && message.hasOwnProperty("endedAt"))
                object.endedAt = $root.nextpex.Time.toObject(message.endedAt, options);
            return object;
        };

        /**
         * Converts this GameSession to JSON.
         * @function toJSON
         * @memberof nextpex.GameSession
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameSession.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GameSession
         * @function getTypeUrl
         * @memberof nextpex.GameSession
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GameSession.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/nextpex.GameSession";
        };

        return GameSession;
    })();

    nextpex.LatestGameSessionResponse = (function() {

        /**
         * Properties of a LatestGameSessionResponse.
         * @memberof nextpex
         * @interface ILatestGameSessionResponse
         * @property {Array.<nextpex.IGameSession>|null} [gameSessions] LatestGameSessionResponse gameSessions
         */

        /**
         * Constructs a new LatestGameSessionResponse.
         * @memberof nextpex
         * @classdesc Represents a LatestGameSessionResponse.
         * @implements ILatestGameSessionResponse
         * @constructor
         * @param {nextpex.ILatestGameSessionResponse=} [properties] Properties to set
         */
        function LatestGameSessionResponse(properties) {
            this.gameSessions = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LatestGameSessionResponse gameSessions.
         * @member {Array.<nextpex.IGameSession>} gameSessions
         * @memberof nextpex.LatestGameSessionResponse
         * @instance
         */
        LatestGameSessionResponse.prototype.gameSessions = $util.emptyArray;

        /**
         * Creates a new LatestGameSessionResponse instance using the specified properties.
         * @function create
         * @memberof nextpex.LatestGameSessionResponse
         * @static
         * @param {nextpex.ILatestGameSessionResponse=} [properties] Properties to set
         * @returns {nextpex.LatestGameSessionResponse} LatestGameSessionResponse instance
         */
        LatestGameSessionResponse.create = function create(properties) {
            return new LatestGameSessionResponse(properties);
        };

        /**
         * Encodes the specified LatestGameSessionResponse message. Does not implicitly {@link nextpex.LatestGameSessionResponse.verify|verify} messages.
         * @function encode
         * @memberof nextpex.LatestGameSessionResponse
         * @static
         * @param {nextpex.ILatestGameSessionResponse} message LatestGameSessionResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LatestGameSessionResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.gameSessions != null && message.gameSessions.length)
                for (let i = 0; i < message.gameSessions.length; ++i)
                    $root.nextpex.GameSession.encode(message.gameSessions[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified LatestGameSessionResponse message, length delimited. Does not implicitly {@link nextpex.LatestGameSessionResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof nextpex.LatestGameSessionResponse
         * @static
         * @param {nextpex.ILatestGameSessionResponse} message LatestGameSessionResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LatestGameSessionResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LatestGameSessionResponse message from the specified reader or buffer.
         * @function decode
         * @memberof nextpex.LatestGameSessionResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {nextpex.LatestGameSessionResponse} LatestGameSessionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LatestGameSessionResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.nextpex.LatestGameSessionResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.gameSessions && message.gameSessions.length))
                            message.gameSessions = [];
                        message.gameSessions.push($root.nextpex.GameSession.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LatestGameSessionResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof nextpex.LatestGameSessionResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {nextpex.LatestGameSessionResponse} LatestGameSessionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LatestGameSessionResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LatestGameSessionResponse message.
         * @function verify
         * @memberof nextpex.LatestGameSessionResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LatestGameSessionResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.gameSessions != null && message.hasOwnProperty("gameSessions")) {
                if (!Array.isArray(message.gameSessions))
                    return "gameSessions: array expected";
                for (let i = 0; i < message.gameSessions.length; ++i) {
                    let error = $root.nextpex.GameSession.verify(message.gameSessions[i]);
                    if (error)
                        return "gameSessions." + error;
                }
            }
            return null;
        };

        /**
         * Creates a LatestGameSessionResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof nextpex.LatestGameSessionResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {nextpex.LatestGameSessionResponse} LatestGameSessionResponse
         */
        LatestGameSessionResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.nextpex.LatestGameSessionResponse)
                return object;
            let message = new $root.nextpex.LatestGameSessionResponse();
            if (object.gameSessions) {
                if (!Array.isArray(object.gameSessions))
                    throw TypeError(".nextpex.LatestGameSessionResponse.gameSessions: array expected");
                message.gameSessions = [];
                for (let i = 0; i < object.gameSessions.length; ++i) {
                    if (typeof object.gameSessions[i] !== "object")
                        throw TypeError(".nextpex.LatestGameSessionResponse.gameSessions: object expected");
                    message.gameSessions[i] = $root.nextpex.GameSession.fromObject(object.gameSessions[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a LatestGameSessionResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof nextpex.LatestGameSessionResponse
         * @static
         * @param {nextpex.LatestGameSessionResponse} message LatestGameSessionResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LatestGameSessionResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.gameSessions = [];
            if (message.gameSessions && message.gameSessions.length) {
                object.gameSessions = [];
                for (let j = 0; j < message.gameSessions.length; ++j)
                    object.gameSessions[j] = $root.nextpex.GameSession.toObject(message.gameSessions[j], options);
            }
            return object;
        };

        /**
         * Converts this LatestGameSessionResponse to JSON.
         * @function toJSON
         * @memberof nextpex.LatestGameSessionResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LatestGameSessionResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for LatestGameSessionResponse
         * @function getTypeUrl
         * @memberof nextpex.LatestGameSessionResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LatestGameSessionResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/nextpex.LatestGameSessionResponse";
        };

        return LatestGameSessionResponse;
    })();

    nextpex.MonthlyPlayedTimeEntry = (function() {

        /**
         * Properties of a MonthlyPlayedTimeEntry.
         * @memberof nextpex
         * @interface IMonthlyPlayedTimeEntry
         * @property {number|null} [month] MonthlyPlayedTimeEntry month
         * @property {number|null} [year] MonthlyPlayedTimeEntry year
         * @property {number|null} [playedTime] MonthlyPlayedTimeEntry playedTime
         */

        /**
         * Constructs a new MonthlyPlayedTimeEntry.
         * @memberof nextpex
         * @classdesc Represents a MonthlyPlayedTimeEntry.
         * @implements IMonthlyPlayedTimeEntry
         * @constructor
         * @param {nextpex.IMonthlyPlayedTimeEntry=} [properties] Properties to set
         */
        function MonthlyPlayedTimeEntry(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MonthlyPlayedTimeEntry month.
         * @member {number} month
         * @memberof nextpex.MonthlyPlayedTimeEntry
         * @instance
         */
        MonthlyPlayedTimeEntry.prototype.month = 0;

        /**
         * MonthlyPlayedTimeEntry year.
         * @member {number} year
         * @memberof nextpex.MonthlyPlayedTimeEntry
         * @instance
         */
        MonthlyPlayedTimeEntry.prototype.year = 0;

        /**
         * MonthlyPlayedTimeEntry playedTime.
         * @member {number} playedTime
         * @memberof nextpex.MonthlyPlayedTimeEntry
         * @instance
         */
        MonthlyPlayedTimeEntry.prototype.playedTime = 0;

        /**
         * Creates a new MonthlyPlayedTimeEntry instance using the specified properties.
         * @function create
         * @memberof nextpex.MonthlyPlayedTimeEntry
         * @static
         * @param {nextpex.IMonthlyPlayedTimeEntry=} [properties] Properties to set
         * @returns {nextpex.MonthlyPlayedTimeEntry} MonthlyPlayedTimeEntry instance
         */
        MonthlyPlayedTimeEntry.create = function create(properties) {
            return new MonthlyPlayedTimeEntry(properties);
        };

        /**
         * Encodes the specified MonthlyPlayedTimeEntry message. Does not implicitly {@link nextpex.MonthlyPlayedTimeEntry.verify|verify} messages.
         * @function encode
         * @memberof nextpex.MonthlyPlayedTimeEntry
         * @static
         * @param {nextpex.IMonthlyPlayedTimeEntry} message MonthlyPlayedTimeEntry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MonthlyPlayedTimeEntry.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.month != null && Object.hasOwnProperty.call(message, "month"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.month);
            if (message.year != null && Object.hasOwnProperty.call(message, "year"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.year);
            if (message.playedTime != null && Object.hasOwnProperty.call(message, "playedTime"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.playedTime);
            return writer;
        };

        /**
         * Encodes the specified MonthlyPlayedTimeEntry message, length delimited. Does not implicitly {@link nextpex.MonthlyPlayedTimeEntry.verify|verify} messages.
         * @function encodeDelimited
         * @memberof nextpex.MonthlyPlayedTimeEntry
         * @static
         * @param {nextpex.IMonthlyPlayedTimeEntry} message MonthlyPlayedTimeEntry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MonthlyPlayedTimeEntry.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MonthlyPlayedTimeEntry message from the specified reader or buffer.
         * @function decode
         * @memberof nextpex.MonthlyPlayedTimeEntry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {nextpex.MonthlyPlayedTimeEntry} MonthlyPlayedTimeEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MonthlyPlayedTimeEntry.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.nextpex.MonthlyPlayedTimeEntry();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.month = reader.int32();
                        break;
                    }
                case 2: {
                        message.year = reader.int32();
                        break;
                    }
                case 3: {
                        message.playedTime = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MonthlyPlayedTimeEntry message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof nextpex.MonthlyPlayedTimeEntry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {nextpex.MonthlyPlayedTimeEntry} MonthlyPlayedTimeEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MonthlyPlayedTimeEntry.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MonthlyPlayedTimeEntry message.
         * @function verify
         * @memberof nextpex.MonthlyPlayedTimeEntry
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MonthlyPlayedTimeEntry.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.month != null && message.hasOwnProperty("month"))
                if (!$util.isInteger(message.month))
                    return "month: integer expected";
            if (message.year != null && message.hasOwnProperty("year"))
                if (!$util.isInteger(message.year))
                    return "year: integer expected";
            if (message.playedTime != null && message.hasOwnProperty("playedTime"))
                if (!$util.isInteger(message.playedTime))
                    return "playedTime: integer expected";
            return null;
        };

        /**
         * Creates a MonthlyPlayedTimeEntry message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof nextpex.MonthlyPlayedTimeEntry
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {nextpex.MonthlyPlayedTimeEntry} MonthlyPlayedTimeEntry
         */
        MonthlyPlayedTimeEntry.fromObject = function fromObject(object) {
            if (object instanceof $root.nextpex.MonthlyPlayedTimeEntry)
                return object;
            let message = new $root.nextpex.MonthlyPlayedTimeEntry();
            if (object.month != null)
                message.month = object.month | 0;
            if (object.year != null)
                message.year = object.year | 0;
            if (object.playedTime != null)
                message.playedTime = object.playedTime | 0;
            return message;
        };

        /**
         * Creates a plain object from a MonthlyPlayedTimeEntry message. Also converts values to other types if specified.
         * @function toObject
         * @memberof nextpex.MonthlyPlayedTimeEntry
         * @static
         * @param {nextpex.MonthlyPlayedTimeEntry} message MonthlyPlayedTimeEntry
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MonthlyPlayedTimeEntry.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.month = 0;
                object.year = 0;
                object.playedTime = 0;
            }
            if (message.month != null && message.hasOwnProperty("month"))
                object.month = message.month;
            if (message.year != null && message.hasOwnProperty("year"))
                object.year = message.year;
            if (message.playedTime != null && message.hasOwnProperty("playedTime"))
                object.playedTime = message.playedTime;
            return object;
        };

        /**
         * Converts this MonthlyPlayedTimeEntry to JSON.
         * @function toJSON
         * @memberof nextpex.MonthlyPlayedTimeEntry
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MonthlyPlayedTimeEntry.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MonthlyPlayedTimeEntry
         * @function getTypeUrl
         * @memberof nextpex.MonthlyPlayedTimeEntry
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MonthlyPlayedTimeEntry.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/nextpex.MonthlyPlayedTimeEntry";
        };

        return MonthlyPlayedTimeEntry;
    })();

    nextpex.MonthlyPlayedTime = (function() {

        /**
         * Properties of a MonthlyPlayedTime.
         * @memberof nextpex
         * @interface IMonthlyPlayedTime
         * @property {string|null} [username] MonthlyPlayedTime username
         * @property {string|null} [game] MonthlyPlayedTime game
         * @property {Array.<nextpex.IMonthlyPlayedTimeEntry>|null} [entries] MonthlyPlayedTime entries
         */

        /**
         * Constructs a new MonthlyPlayedTime.
         * @memberof nextpex
         * @classdesc Represents a MonthlyPlayedTime.
         * @implements IMonthlyPlayedTime
         * @constructor
         * @param {nextpex.IMonthlyPlayedTime=} [properties] Properties to set
         */
        function MonthlyPlayedTime(properties) {
            this.entries = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MonthlyPlayedTime username.
         * @member {string} username
         * @memberof nextpex.MonthlyPlayedTime
         * @instance
         */
        MonthlyPlayedTime.prototype.username = "";

        /**
         * MonthlyPlayedTime game.
         * @member {string} game
         * @memberof nextpex.MonthlyPlayedTime
         * @instance
         */
        MonthlyPlayedTime.prototype.game = "";

        /**
         * MonthlyPlayedTime entries.
         * @member {Array.<nextpex.IMonthlyPlayedTimeEntry>} entries
         * @memberof nextpex.MonthlyPlayedTime
         * @instance
         */
        MonthlyPlayedTime.prototype.entries = $util.emptyArray;

        /**
         * Creates a new MonthlyPlayedTime instance using the specified properties.
         * @function create
         * @memberof nextpex.MonthlyPlayedTime
         * @static
         * @param {nextpex.IMonthlyPlayedTime=} [properties] Properties to set
         * @returns {nextpex.MonthlyPlayedTime} MonthlyPlayedTime instance
         */
        MonthlyPlayedTime.create = function create(properties) {
            return new MonthlyPlayedTime(properties);
        };

        /**
         * Encodes the specified MonthlyPlayedTime message. Does not implicitly {@link nextpex.MonthlyPlayedTime.verify|verify} messages.
         * @function encode
         * @memberof nextpex.MonthlyPlayedTime
         * @static
         * @param {nextpex.IMonthlyPlayedTime} message MonthlyPlayedTime message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MonthlyPlayedTime.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.username != null && Object.hasOwnProperty.call(message, "username"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.username);
            if (message.game != null && Object.hasOwnProperty.call(message, "game"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.game);
            if (message.entries != null && message.entries.length)
                for (let i = 0; i < message.entries.length; ++i)
                    $root.nextpex.MonthlyPlayedTimeEntry.encode(message.entries[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified MonthlyPlayedTime message, length delimited. Does not implicitly {@link nextpex.MonthlyPlayedTime.verify|verify} messages.
         * @function encodeDelimited
         * @memberof nextpex.MonthlyPlayedTime
         * @static
         * @param {nextpex.IMonthlyPlayedTime} message MonthlyPlayedTime message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MonthlyPlayedTime.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MonthlyPlayedTime message from the specified reader or buffer.
         * @function decode
         * @memberof nextpex.MonthlyPlayedTime
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {nextpex.MonthlyPlayedTime} MonthlyPlayedTime
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MonthlyPlayedTime.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.nextpex.MonthlyPlayedTime();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.username = reader.string();
                        break;
                    }
                case 2: {
                        message.game = reader.string();
                        break;
                    }
                case 3: {
                        if (!(message.entries && message.entries.length))
                            message.entries = [];
                        message.entries.push($root.nextpex.MonthlyPlayedTimeEntry.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MonthlyPlayedTime message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof nextpex.MonthlyPlayedTime
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {nextpex.MonthlyPlayedTime} MonthlyPlayedTime
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MonthlyPlayedTime.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MonthlyPlayedTime message.
         * @function verify
         * @memberof nextpex.MonthlyPlayedTime
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MonthlyPlayedTime.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.username != null && message.hasOwnProperty("username"))
                if (!$util.isString(message.username))
                    return "username: string expected";
            if (message.game != null && message.hasOwnProperty("game"))
                if (!$util.isString(message.game))
                    return "game: string expected";
            if (message.entries != null && message.hasOwnProperty("entries")) {
                if (!Array.isArray(message.entries))
                    return "entries: array expected";
                for (let i = 0; i < message.entries.length; ++i) {
                    let error = $root.nextpex.MonthlyPlayedTimeEntry.verify(message.entries[i]);
                    if (error)
                        return "entries." + error;
                }
            }
            return null;
        };

        /**
         * Creates a MonthlyPlayedTime message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof nextpex.MonthlyPlayedTime
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {nextpex.MonthlyPlayedTime} MonthlyPlayedTime
         */
        MonthlyPlayedTime.fromObject = function fromObject(object) {
            if (object instanceof $root.nextpex.MonthlyPlayedTime)
                return object;
            let message = new $root.nextpex.MonthlyPlayedTime();
            if (object.username != null)
                message.username = String(object.username);
            if (object.game != null)
                message.game = String(object.game);
            if (object.entries) {
                if (!Array.isArray(object.entries))
                    throw TypeError(".nextpex.MonthlyPlayedTime.entries: array expected");
                message.entries = [];
                for (let i = 0; i < object.entries.length; ++i) {
                    if (typeof object.entries[i] !== "object")
                        throw TypeError(".nextpex.MonthlyPlayedTime.entries: object expected");
                    message.entries[i] = $root.nextpex.MonthlyPlayedTimeEntry.fromObject(object.entries[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a MonthlyPlayedTime message. Also converts values to other types if specified.
         * @function toObject
         * @memberof nextpex.MonthlyPlayedTime
         * @static
         * @param {nextpex.MonthlyPlayedTime} message MonthlyPlayedTime
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MonthlyPlayedTime.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.entries = [];
            if (options.defaults) {
                object.username = "";
                object.game = "";
            }
            if (message.username != null && message.hasOwnProperty("username"))
                object.username = message.username;
            if (message.game != null && message.hasOwnProperty("game"))
                object.game = message.game;
            if (message.entries && message.entries.length) {
                object.entries = [];
                for (let j = 0; j < message.entries.length; ++j)
                    object.entries[j] = $root.nextpex.MonthlyPlayedTimeEntry.toObject(message.entries[j], options);
            }
            return object;
        };

        /**
         * Converts this MonthlyPlayedTime to JSON.
         * @function toJSON
         * @memberof nextpex.MonthlyPlayedTime
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MonthlyPlayedTime.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MonthlyPlayedTime
         * @function getTypeUrl
         * @memberof nextpex.MonthlyPlayedTime
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MonthlyPlayedTime.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/nextpex.MonthlyPlayedTime";
        };

        return MonthlyPlayedTime;
    })();

    nextpex.MonthlyCheckResponse = (function() {

        /**
         * Properties of a MonthlyCheckResponse.
         * @memberof nextpex
         * @interface IMonthlyCheckResponse
         * @property {Array.<nextpex.IMonthlyPlayedTime>|null} [data] MonthlyCheckResponse data
         */

        /**
         * Constructs a new MonthlyCheckResponse.
         * @memberof nextpex
         * @classdesc Represents a MonthlyCheckResponse.
         * @implements IMonthlyCheckResponse
         * @constructor
         * @param {nextpex.IMonthlyCheckResponse=} [properties] Properties to set
         */
        function MonthlyCheckResponse(properties) {
            this.data = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MonthlyCheckResponse data.
         * @member {Array.<nextpex.IMonthlyPlayedTime>} data
         * @memberof nextpex.MonthlyCheckResponse
         * @instance
         */
        MonthlyCheckResponse.prototype.data = $util.emptyArray;

        /**
         * Creates a new MonthlyCheckResponse instance using the specified properties.
         * @function create
         * @memberof nextpex.MonthlyCheckResponse
         * @static
         * @param {nextpex.IMonthlyCheckResponse=} [properties] Properties to set
         * @returns {nextpex.MonthlyCheckResponse} MonthlyCheckResponse instance
         */
        MonthlyCheckResponse.create = function create(properties) {
            return new MonthlyCheckResponse(properties);
        };

        /**
         * Encodes the specified MonthlyCheckResponse message. Does not implicitly {@link nextpex.MonthlyCheckResponse.verify|verify} messages.
         * @function encode
         * @memberof nextpex.MonthlyCheckResponse
         * @static
         * @param {nextpex.IMonthlyCheckResponse} message MonthlyCheckResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MonthlyCheckResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.data != null && message.data.length)
                for (let i = 0; i < message.data.length; ++i)
                    $root.nextpex.MonthlyPlayedTime.encode(message.data[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified MonthlyCheckResponse message, length delimited. Does not implicitly {@link nextpex.MonthlyCheckResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof nextpex.MonthlyCheckResponse
         * @static
         * @param {nextpex.IMonthlyCheckResponse} message MonthlyCheckResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MonthlyCheckResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MonthlyCheckResponse message from the specified reader or buffer.
         * @function decode
         * @memberof nextpex.MonthlyCheckResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {nextpex.MonthlyCheckResponse} MonthlyCheckResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MonthlyCheckResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.nextpex.MonthlyCheckResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.data && message.data.length))
                            message.data = [];
                        message.data.push($root.nextpex.MonthlyPlayedTime.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MonthlyCheckResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof nextpex.MonthlyCheckResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {nextpex.MonthlyCheckResponse} MonthlyCheckResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MonthlyCheckResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MonthlyCheckResponse message.
         * @function verify
         * @memberof nextpex.MonthlyCheckResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MonthlyCheckResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                if (!Array.isArray(message.data))
                    return "data: array expected";
                for (let i = 0; i < message.data.length; ++i) {
                    let error = $root.nextpex.MonthlyPlayedTime.verify(message.data[i]);
                    if (error)
                        return "data." + error;
                }
            }
            return null;
        };

        /**
         * Creates a MonthlyCheckResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof nextpex.MonthlyCheckResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {nextpex.MonthlyCheckResponse} MonthlyCheckResponse
         */
        MonthlyCheckResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.nextpex.MonthlyCheckResponse)
                return object;
            let message = new $root.nextpex.MonthlyCheckResponse();
            if (object.data) {
                if (!Array.isArray(object.data))
                    throw TypeError(".nextpex.MonthlyCheckResponse.data: array expected");
                message.data = [];
                for (let i = 0; i < object.data.length; ++i) {
                    if (typeof object.data[i] !== "object")
                        throw TypeError(".nextpex.MonthlyCheckResponse.data: object expected");
                    message.data[i] = $root.nextpex.MonthlyPlayedTime.fromObject(object.data[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a MonthlyCheckResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof nextpex.MonthlyCheckResponse
         * @static
         * @param {nextpex.MonthlyCheckResponse} message MonthlyCheckResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MonthlyCheckResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.data = [];
            if (message.data && message.data.length) {
                object.data = [];
                for (let j = 0; j < message.data.length; ++j)
                    object.data[j] = $root.nextpex.MonthlyPlayedTime.toObject(message.data[j], options);
            }
            return object;
        };

        /**
         * Converts this MonthlyCheckResponse to JSON.
         * @function toJSON
         * @memberof nextpex.MonthlyCheckResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MonthlyCheckResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MonthlyCheckResponse
         * @function getTypeUrl
         * @memberof nextpex.MonthlyCheckResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MonthlyCheckResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/nextpex.MonthlyCheckResponse";
        };

        return MonthlyCheckResponse;
    })();

    return nextpex;
})();

export { $root as default };
