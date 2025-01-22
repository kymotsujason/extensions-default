"use strict";
var source = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/base64-js/index.js
  var require_base64_js = __commonJS({
    "node_modules/base64-js/index.js"(exports) {
      "use strict";
      init_buffer();
      exports.byteLength = byteLength;
      exports.toByteArray = toByteArray;
      exports.fromByteArray = fromByteArray;
      var lookup = [];
      var revLookup = [];
      var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
      }
      var i;
      var len;
      revLookup["-".charCodeAt(0)] = 62;
      revLookup["_".charCodeAt(0)] = 63;
      function getLens(b64) {
        var len2 = b64.length;
        if (len2 % 4 > 0) {
          throw new Error("Invalid string. Length must be a multiple of 4");
        }
        var validLen = b64.indexOf("=");
        if (validLen === -1) validLen = len2;
        var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
        return [validLen, placeHoldersLen];
      }
      function byteLength(b64) {
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function _byteLength(b64, validLen, placeHoldersLen) {
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function toByteArray(b64) {
        var tmp;
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
        var curByte = 0;
        var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
        var i2;
        for (i2 = 0; i2 < len2; i2 += 4) {
          tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
          arr[curByte++] = tmp >> 16 & 255;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 2) {
          tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 1) {
          tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        return arr;
      }
      function tripletToBase64(num) {
        return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
      }
      function encodeChunk(uint8, start, end) {
        var tmp;
        var output = [];
        for (var i2 = start; i2 < end; i2 += 3) {
          tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
          output.push(tripletToBase64(tmp));
        }
        return output.join("");
      }
      function fromByteArray(uint8) {
        var tmp;
        var len2 = uint8.length;
        var extraBytes = len2 % 3;
        var parts = [];
        var maxChunkLength = 16383;
        for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
          parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
        }
        if (extraBytes === 1) {
          tmp = uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
          );
        } else if (extraBytes === 2) {
          tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
          );
        }
        return parts.join("");
      }
    }
  });

  // node_modules/ieee754/index.js
  var require_ieee754 = __commonJS({
    "node_modules/ieee754/index.js"(exports) {
      init_buffer();
      exports.read = function(buffer, offset, isLE, mLen, nBytes) {
        var e, m;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i = isLE ? nBytes - 1 : 0;
        var d = isLE ? -1 : 1;
        var s = buffer[offset + i];
        i += d;
        e = s & (1 << -nBits) - 1;
        s >>= -nBits;
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        m = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m ? NaN : (s ? -1 : 1) * Infinity;
        } else {
          m = m + Math.pow(2, mLen);
          e = e - eBias;
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
      };
      exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var i = isLE ? 0 : nBytes - 1;
        var d = isLE ? 1 : -1;
        var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
        value = Math.abs(value);
        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0;
          e = eMax;
        } else {
          e = Math.floor(Math.log(value) / Math.LN2);
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value += rt / c;
          } else {
            value += rt * Math.pow(2, 1 - eBias);
          }
          if (value * c >= 2) {
            e++;
            c /= 2;
          }
          if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
          }
        }
        for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
        }
        e = e << mLen | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
        }
        buffer[offset + i - d] |= s * 128;
      };
    }
  });

  // node_modules/buffer/index.js
  var require_buffer = __commonJS({
    "node_modules/buffer/index.js"(exports) {
      "use strict";
      init_buffer();
      var base64 = require_base64_js();
      var ieee754 = require_ieee754();
      var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
      exports.Buffer = Buffer3;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      var K_MAX_LENGTH = 2147483647;
      exports.kMaxLength = K_MAX_LENGTH;
      Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
      if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
        console.error(
          "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
        );
      }
      function typedArraySupport() {
        try {
          const arr = new Uint8Array(1);
          const proto = { foo: function() {
            return 42;
          } };
          Object.setPrototypeOf(proto, Uint8Array.prototype);
          Object.setPrototypeOf(arr, proto);
          return arr.foo() === 42;
        } catch (e) {
          return false;
        }
      }
      Object.defineProperty(Buffer3.prototype, "parent", {
        enumerable: true,
        get: function() {
          if (!Buffer3.isBuffer(this)) return void 0;
          return this.buffer;
        }
      });
      Object.defineProperty(Buffer3.prototype, "offset", {
        enumerable: true,
        get: function() {
          if (!Buffer3.isBuffer(this)) return void 0;
          return this.byteOffset;
        }
      });
      function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
          throw new RangeError('The value "' + length + '" is invalid for option "size"');
        }
        const buf = new Uint8Array(length);
        Object.setPrototypeOf(buf, Buffer3.prototype);
        return buf;
      }
      function Buffer3(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          if (typeof encodingOrOffset === "string") {
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          }
          return allocUnsafe(arg);
        }
        return from(arg, encodingOrOffset, length);
      }
      Buffer3.poolSize = 8192;
      function from(value, encodingOrOffset, length) {
        if (typeof value === "string") {
          return fromString(value, encodingOrOffset);
        }
        if (ArrayBuffer.isView(value)) {
          return fromArrayView(value);
        }
        if (value == null) {
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
          );
        }
        if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof value === "number") {
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        }
        const valueOf = value.valueOf && value.valueOf();
        if (valueOf != null && valueOf !== value) {
          return Buffer3.from(valueOf, encodingOrOffset, length);
        }
        const b = fromObject(value);
        if (b) return b;
        if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
          return Buffer3.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
        }
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      Buffer3.from = function(value, encodingOrOffset, length) {
        return from(value, encodingOrOffset, length);
      };
      Object.setPrototypeOf(Buffer3.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(Buffer3, Uint8Array);
      function assertSize(size) {
        if (typeof size !== "number") {
          throw new TypeError('"size" argument must be of type number');
        } else if (size < 0) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
      }
      function alloc(size, fill, encoding) {
        assertSize(size);
        if (size <= 0) {
          return createBuffer(size);
        }
        if (fill !== void 0) {
          return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
        }
        return createBuffer(size);
      }
      Buffer3.alloc = function(size, fill, encoding) {
        return alloc(size, fill, encoding);
      };
      function allocUnsafe(size) {
        assertSize(size);
        return createBuffer(size < 0 ? 0 : checked(size) | 0);
      }
      Buffer3.allocUnsafe = function(size) {
        return allocUnsafe(size);
      };
      Buffer3.allocUnsafeSlow = function(size) {
        return allocUnsafe(size);
      };
      function fromString(string, encoding) {
        if (typeof encoding !== "string" || encoding === "") {
          encoding = "utf8";
        }
        if (!Buffer3.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        const length = byteLength(string, encoding) | 0;
        let buf = createBuffer(length);
        const actual = buf.write(string, encoding);
        if (actual !== length) {
          buf = buf.slice(0, actual);
        }
        return buf;
      }
      function fromArrayLike(array) {
        const length = array.length < 0 ? 0 : checked(array.length) | 0;
        const buf = createBuffer(length);
        for (let i = 0; i < length; i += 1) {
          buf[i] = array[i] & 255;
        }
        return buf;
      }
      function fromArrayView(arrayView) {
        if (isInstance(arrayView, Uint8Array)) {
          const copy = new Uint8Array(arrayView);
          return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
        }
        return fromArrayLike(arrayView);
      }
      function fromArrayBuffer(array, byteOffset, length) {
        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('"offset" is outside of buffer bounds');
        }
        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('"length" is outside of buffer bounds');
        }
        let buf;
        if (byteOffset === void 0 && length === void 0) {
          buf = new Uint8Array(array);
        } else if (length === void 0) {
          buf = new Uint8Array(array, byteOffset);
        } else {
          buf = new Uint8Array(array, byteOffset, length);
        }
        Object.setPrototypeOf(buf, Buffer3.prototype);
        return buf;
      }
      function fromObject(obj) {
        if (Buffer3.isBuffer(obj)) {
          const len = checked(obj.length) | 0;
          const buf = createBuffer(len);
          if (buf.length === 0) {
            return buf;
          }
          obj.copy(buf, 0, 0, len);
          return buf;
        }
        if (obj.length !== void 0) {
          if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
            return createBuffer(0);
          }
          return fromArrayLike(obj);
        }
        if (obj.type === "Buffer" && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data);
        }
      }
      function checked(length) {
        if (length >= K_MAX_LENGTH) {
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
        }
        return length | 0;
      }
      function SlowBuffer(length) {
        if (+length != length) {
          length = 0;
        }
        return Buffer3.alloc(+length);
      }
      Buffer3.isBuffer = function isBuffer(b) {
        return b != null && b._isBuffer === true && b !== Buffer3.prototype;
      };
      Buffer3.compare = function compare(a, b) {
        if (isInstance(a, Uint8Array)) a = Buffer3.from(a, a.offset, a.byteLength);
        if (isInstance(b, Uint8Array)) b = Buffer3.from(b, b.offset, b.byteLength);
        if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b)) {
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        }
        if (a === b) return 0;
        let x = a.length;
        let y = b.length;
        for (let i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      Buffer3.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      };
      Buffer3.concat = function concat(list, length) {
        if (!Array.isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        if (list.length === 0) {
          return Buffer3.alloc(0);
        }
        let i;
        if (length === void 0) {
          length = 0;
          for (i = 0; i < list.length; ++i) {
            length += list[i].length;
          }
        }
        const buffer = Buffer3.allocUnsafe(length);
        let pos = 0;
        for (i = 0; i < list.length; ++i) {
          let buf = list[i];
          if (isInstance(buf, Uint8Array)) {
            if (pos + buf.length > buffer.length) {
              if (!Buffer3.isBuffer(buf)) buf = Buffer3.from(buf);
              buf.copy(buffer, pos);
            } else {
              Uint8Array.prototype.set.call(
                buffer,
                buf,
                pos
              );
            }
          } else if (!Buffer3.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          } else {
            buf.copy(buffer, pos);
          }
          pos += buf.length;
        }
        return buffer;
      };
      function byteLength(string, encoding) {
        if (Buffer3.isBuffer(string)) {
          return string.length;
        }
        if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
          return string.byteLength;
        }
        if (typeof string !== "string") {
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
          );
        }
        const len = string.length;
        const mustMatch = arguments.length > 2 && arguments[2] === true;
        if (!mustMatch && len === 0) return 0;
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "ascii":
            case "latin1":
            case "binary":
              return len;
            case "utf8":
            case "utf-8":
              return utf8ToBytes(string).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return len * 2;
            case "hex":
              return len >>> 1;
            case "base64":
              return base64ToBytes(string).length;
            default:
              if (loweredCase) {
                return mustMatch ? -1 : utf8ToBytes(string).length;
              }
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer3.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        let loweredCase = false;
        if (start === void 0 || start < 0) {
          start = 0;
        }
        if (start > this.length) {
          return "";
        }
        if (end === void 0 || end > this.length) {
          end = this.length;
        }
        if (end <= 0) {
          return "";
        }
        end >>>= 0;
        start >>>= 0;
        if (end <= start) {
          return "";
        }
        if (!encoding) encoding = "utf8";
        while (true) {
          switch (encoding) {
            case "hex":
              return hexSlice(this, start, end);
            case "utf8":
            case "utf-8":
              return utf8Slice(this, start, end);
            case "ascii":
              return asciiSlice(this, start, end);
            case "latin1":
            case "binary":
              return latin1Slice(this, start, end);
            case "base64":
              return base64Slice(this, start, end);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return utf16leSlice(this, start, end);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = (encoding + "").toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer3.prototype._isBuffer = true;
      function swap(b, n, m) {
        const i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      Buffer3.prototype.swap16 = function swap16() {
        const len = this.length;
        if (len % 2 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        }
        for (let i = 0; i < len; i += 2) {
          swap(this, i, i + 1);
        }
        return this;
      };
      Buffer3.prototype.swap32 = function swap32() {
        const len = this.length;
        if (len % 4 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        }
        for (let i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };
      Buffer3.prototype.swap64 = function swap64() {
        const len = this.length;
        if (len % 8 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        }
        for (let i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };
      Buffer3.prototype.toString = function toString() {
        const length = this.length;
        if (length === 0) return "";
        if (arguments.length === 0) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
      Buffer3.prototype.equals = function equals(b) {
        if (!Buffer3.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
        if (this === b) return true;
        return Buffer3.compare(this, b) === 0;
      };
      Buffer3.prototype.inspect = function inspect() {
        let str = "";
        const max = exports.INSPECT_MAX_BYTES;
        str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
        if (this.length > max) str += " ... ";
        return "<Buffer " + str + ">";
      };
      if (customInspectSymbol) {
        Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
      }
      Buffer3.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (isInstance(target, Uint8Array)) {
          target = Buffer3.from(target, target.offset, target.byteLength);
        }
        if (!Buffer3.isBuffer(target)) {
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
          );
        }
        if (start === void 0) {
          start = 0;
        }
        if (end === void 0) {
          end = target ? target.length : 0;
        }
        if (thisStart === void 0) {
          thisStart = 0;
        }
        if (thisEnd === void 0) {
          thisEnd = this.length;
        }
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError("out of range index");
        }
        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }
        if (thisStart >= thisEnd) {
          return -1;
        }
        if (start >= end) {
          return 1;
        }
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        let x = thisEnd - thisStart;
        let y = end - start;
        const len = Math.min(x, y);
        const thisCopy = this.slice(thisStart, thisEnd);
        const targetCopy = target.slice(start, end);
        for (let i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (buffer.length === 0) return -1;
        if (typeof byteOffset === "string") {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 2147483647) {
          byteOffset = 2147483647;
        } else if (byteOffset < -2147483648) {
          byteOffset = -2147483648;
        }
        byteOffset = +byteOffset;
        if (numberIsNaN(byteOffset)) {
          byteOffset = dir ? 0 : buffer.length - 1;
        }
        if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
        if (byteOffset >= buffer.length) {
          if (dir) return -1;
          else byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (dir) byteOffset = 0;
          else return -1;
        }
        if (typeof val === "string") {
          val = Buffer3.from(val, encoding);
        }
        if (Buffer3.isBuffer(val)) {
          if (val.length === 0) {
            return -1;
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === "number") {
          val = val & 255;
          if (typeof Uint8Array.prototype.indexOf === "function") {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        let indexSize = 1;
        let arrLength = arr.length;
        let valLength = val.length;
        if (encoding !== void 0) {
          encoding = String(encoding).toLowerCase();
          if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf, i2) {
          if (indexSize === 1) {
            return buf[i2];
          } else {
            return buf.readUInt16BE(i2 * indexSize);
          }
        }
        let i;
        if (dir) {
          let foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1) foundIndex = i;
              if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1) i -= i - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
          for (i = byteOffset; i >= 0; i--) {
            let found = true;
            for (let j = 0; j < valLength; j++) {
              if (read(arr, i + j) !== read(val, j)) {
                found = false;
                break;
              }
            }
            if (found) return i;
          }
        }
        return -1;
      }
      Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      };
      Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        const remaining = buf.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }
        const strLen = string.length;
        if (length > strLen / 2) {
          length = strLen / 2;
        }
        let i;
        for (i = 0; i < length; ++i) {
          const parsed = parseInt(string.substr(i * 2, 2), 16);
          if (numberIsNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }
        return i;
      }
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      Buffer3.prototype.write = function write(string, offset, length, encoding) {
        if (offset === void 0) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (length === void 0 && typeof offset === "string") {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else if (isFinite(offset)) {
          offset = offset >>> 0;
          if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === void 0) encoding = "utf8";
          } else {
            encoding = length;
            length = void 0;
          }
        } else {
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        }
        const remaining = this.length - offset;
        if (length === void 0 || length > remaining) length = remaining;
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError("Attempt to write outside buffer bounds");
        }
        if (!encoding) encoding = "utf8";
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "hex":
              return hexWrite(this, string, offset, length);
            case "utf8":
            case "utf-8":
              return utf8Write(this, string, offset, length);
            case "ascii":
            case "latin1":
            case "binary":
              return asciiWrite(this, string, offset, length);
            case "base64":
              return base64Write(this, string, offset, length);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return ucs2Write(this, string, offset, length);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      };
      Buffer3.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf);
        } else {
          return base64.fromByteArray(buf.slice(start, end));
        }
      }
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        const res = [];
        let i = start;
        while (i < end) {
          const firstByte = buf[i];
          let codePoint = null;
          let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            let secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 128) {
                  codePoint = firstByte;
                }
                break;
              case 2:
                secondByte = buf[i + 1];
                if ((secondByte & 192) === 128) {
                  tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                  if (tempCodePoint > 127) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 3:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                  if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 4:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                fourthByte = buf[i + 3];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                  if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                    codePoint = tempCodePoint;
                  }
                }
            }
          }
          if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        const len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints);
        }
        let res = "";
        let i = 0;
        while (i < len) {
          res += String.fromCharCode.apply(
            String,
            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
          );
        }
        return res;
      }
      function asciiSlice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i] & 127);
        }
        return ret;
      }
      function latin1Slice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i]);
        }
        return ret;
      }
      function hexSlice(buf, start, end) {
        const len = buf.length;
        if (!start || start < 0) start = 0;
        if (!end || end < 0 || end > len) end = len;
        let out = "";
        for (let i = start; i < end; ++i) {
          out += hexSliceLookupTable[buf[i]];
        }
        return out;
      }
      function utf16leSlice(buf, start, end) {
        const bytes = buf.slice(start, end);
        let res = "";
        for (let i = 0; i < bytes.length - 1; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }
        return res;
      }
      Buffer3.prototype.slice = function slice(start, end) {
        const len = this.length;
        start = ~~start;
        end = end === void 0 ? len : ~~end;
        if (start < 0) {
          start += len;
          if (start < 0) start = 0;
        } else if (start > len) {
          start = len;
        }
        if (end < 0) {
          end += len;
          if (end < 0) end = 0;
        } else if (end > len) {
          end = len;
        }
        if (end < start) end = start;
        const newBuf = this.subarray(start, end);
        Object.setPrototypeOf(newBuf, Buffer3.prototype);
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
        if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        return val;
      };
      Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          checkOffset(offset, byteLength2, this.length);
        }
        let val = this[offset + --byteLength2];
        let mul = 1;
        while (byteLength2 > 0 && (mul *= 256)) {
          val += this[offset + --byteLength2] * mul;
        }
        return val;
      };
      Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
      };
      Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer3.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
        const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
        return BigInt(lo) + (BigInt(hi) << BigInt(32));
      });
      Buffer3.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
        return (BigInt(hi) << BigInt(32)) + BigInt(lo);
      });
      Buffer3.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let i = byteLength2;
        let mul = 1;
        let val = this[offset + --i];
        while (i > 0 && (mul *= 256)) {
          val += this[offset + --i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        if (!(this[offset] & 128)) return this[offset];
        return (255 - this[offset] + 1) * -1;
      };
      Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset] | this[offset + 1] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset + 1] | this[offset] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer3.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
        return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
      });
      Buffer3.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = (first << 24) + // Overflow
        this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
      });
      Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer3.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
      }
      Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let mul = 1;
        let i = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
        return offset + 4;
      };
      Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      function wrtBigUInt64LE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        return offset;
      }
      function wrtBigUInt64BE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset + 7] = lo;
        lo = lo >> 8;
        buf[offset + 6] = lo;
        lo = lo >> 8;
        buf[offset + 5] = lo;
        lo = lo >> 8;
        buf[offset + 4] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset + 3] = hi;
        hi = hi >> 8;
        buf[offset + 2] = hi;
        hi = hi >> 8;
        buf[offset + 1] = hi;
        hi = hi >> 8;
        buf[offset] = hi;
        return offset + 8;
      }
      Buffer3.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer3.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer3.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = 0;
        let mul = 1;
        let sub = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        let sub = 0;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
        if (value < 0) value = 255 + value + 1;
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer3.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer3.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer3.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
        return offset + 4;
      };
      Buffer3.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (value < 0) value = 4294967295 + value + 1;
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      Buffer3.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      Buffer3.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
        if (offset < 0) throw new RangeError("Index out of range");
      }
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
        }
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer3.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer3.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
        }
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer3.prototype.copy = function copy(target, targetStart, start, end) {
        if (!Buffer3.isBuffer(target)) throw new TypeError("argument should be a Buffer");
        if (!start) start = 0;
        if (!end && end !== 0) end = this.length;
        if (targetStart >= target.length) targetStart = target.length;
        if (!targetStart) targetStart = 0;
        if (end > 0 && end < start) end = start;
        if (end === start) return 0;
        if (target.length === 0 || this.length === 0) return 0;
        if (targetStart < 0) {
          throw new RangeError("targetStart out of bounds");
        }
        if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
        if (end < 0) throw new RangeError("sourceEnd out of bounds");
        if (end > this.length) end = this.length;
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }
        const len = end - start;
        if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
          this.copyWithin(targetStart, start, end);
        } else {
          Uint8Array.prototype.set.call(
            target,
            this.subarray(start, end),
            targetStart
          );
        }
        return len;
      };
      Buffer3.prototype.fill = function fill(val, start, end, encoding) {
        if (typeof val === "string") {
          if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
          }
          if (encoding !== void 0 && typeof encoding !== "string") {
            throw new TypeError("encoding must be a string");
          }
          if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
            throw new TypeError("Unknown encoding: " + encoding);
          }
          if (val.length === 1) {
            const code = val.charCodeAt(0);
            if (encoding === "utf8" && code < 128 || encoding === "latin1") {
              val = code;
            }
          }
        } else if (typeof val === "number") {
          val = val & 255;
        } else if (typeof val === "boolean") {
          val = Number(val);
        }
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError("Out of range index");
        }
        if (end <= start) {
          return this;
        }
        start = start >>> 0;
        end = end === void 0 ? this.length : end >>> 0;
        if (!val) val = 0;
        let i;
        if (typeof val === "number") {
          for (i = start; i < end; ++i) {
            this[i] = val;
          }
        } else {
          const bytes = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
          const len = bytes.length;
          if (len === 0) {
            throw new TypeError('The value "' + val + '" is invalid for argument "value"');
          }
          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
          }
        }
        return this;
      };
      var errors = {};
      function E(sym, getMessage, Base) {
        errors[sym] = class NodeError extends Base {
          constructor() {
            super();
            Object.defineProperty(this, "message", {
              value: getMessage.apply(this, arguments),
              writable: true,
              configurable: true
            });
            this.name = `${this.name} [${sym}]`;
            this.stack;
            delete this.name;
          }
          get code() {
            return sym;
          }
          set code(value) {
            Object.defineProperty(this, "code", {
              configurable: true,
              enumerable: true,
              value,
              writable: true
            });
          }
          toString() {
            return `${this.name} [${sym}]: ${this.message}`;
          }
        };
      }
      E(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(name) {
          if (name) {
            return `${name} is outside of buffer bounds`;
          }
          return "Attempt to access memory outside buffer bounds";
        },
        RangeError
      );
      E(
        "ERR_INVALID_ARG_TYPE",
        function(name, actual) {
          return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
        },
        TypeError
      );
      E(
        "ERR_OUT_OF_RANGE",
        function(str, range, input) {
          let msg = `The value of "${str}" is out of range.`;
          let received = input;
          if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
            received = addNumericalSeparator(String(input));
          } else if (typeof input === "bigint") {
            received = String(input);
            if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
              received = addNumericalSeparator(received);
            }
            received += "n";
          }
          msg += ` It must be ${range}. Received ${received}`;
          return msg;
        },
        RangeError
      );
      function addNumericalSeparator(val) {
        let res = "";
        let i = val.length;
        const start = val[0] === "-" ? 1 : 0;
        for (; i >= start + 4; i -= 3) {
          res = `_${val.slice(i - 3, i)}${res}`;
        }
        return `${val.slice(0, i)}${res}`;
      }
      function checkBounds(buf, offset, byteLength2) {
        validateNumber(offset, "offset");
        if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
          boundsError(offset, buf.length - (byteLength2 + 1));
        }
      }
      function checkIntBI(value, min, max, buf, offset, byteLength2) {
        if (value > max || value < min) {
          const n = typeof min === "bigint" ? "n" : "";
          let range;
          if (byteLength2 > 3) {
            if (min === 0 || min === BigInt(0)) {
              range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
            } else {
              range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
            }
          } else {
            range = `>= ${min}${n} and <= ${max}${n}`;
          }
          throw new errors.ERR_OUT_OF_RANGE("value", range, value);
        }
        checkBounds(buf, offset, byteLength2);
      }
      function validateNumber(value, name) {
        if (typeof value !== "number") {
          throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
        }
      }
      function boundsError(value, length, type) {
        if (Math.floor(value) !== value) {
          validateNumber(value, type);
          throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
        }
        if (length < 0) {
          throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
        }
        throw new errors.ERR_OUT_OF_RANGE(
          type || "offset",
          `>= ${type ? 1 : 0} and <= ${length}`,
          value
        );
      }
      var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = str.split("=")[0];
        str = str.trim().replace(INVALID_BASE64_RE, "");
        if (str.length < 2) return "";
        while (str.length % 4 !== 0) {
          str = str + "=";
        }
        return str;
      }
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        let codePoint;
        const length = string.length;
        let leadSurrogate = null;
        const bytes = [];
        for (let i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              } else if (i + 1 === length) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
          } else if (leadSurrogate) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
          }
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(
              codePoint >> 6 | 192,
              codePoint & 63 | 128
            );
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(
              codePoint >> 12 | 224,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else if (codePoint < 1114112) {
            if ((units -= 4) < 0) break;
            bytes.push(
              codePoint >> 18 | 240,
              codePoint >> 12 & 63 | 128,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else {
            throw new Error("Invalid code point");
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          byteArray.push(str.charCodeAt(i) & 255);
        }
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        let c, hi, lo;
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        let i;
        for (i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      function isInstance(obj, type) {
        return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
      }
      function numberIsNaN(obj) {
        return obj !== obj;
      }
      var hexSliceLookupTable = function() {
        const alphabet = "0123456789abcdef";
        const table = new Array(256);
        for (let i = 0; i < 16; ++i) {
          const i16 = i * 16;
          for (let j = 0; j < 16; ++j) {
            table[i16 + j] = alphabet[i] + alphabet[j];
          }
        }
        return table;
      }();
      function defineBigIntMethod(fn) {
        return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
      }
      function BufferBigIntNotDefined() {
        throw new Error("BigInt not supported");
      }
    }
  });

  // node_modules/@paperback/toolchain/dist/shims/buffer.js
  var Buffer2;
  var init_buffer = __esm({
    "node_modules/@paperback/toolchain/dist/shims/buffer.js"() {
      Buffer2 = require_buffer().Buffer;
    }
  });

  // node_modules/@paperback/types/lib/impl/SettingsUI/Form.js
  var require_Form = __commonJS({
    "node_modules/@paperback/types/lib/impl/SettingsUI/Form.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Form = void 0;
      var Form3 = class {
        reloadForm() {
          const formId = this["__underlying_formId"];
          if (!formId)
            return;
          Application.formDidChange(formId);
        }
        // If this returns true, the app will display `Submit` and `Cancel` buttons
        // and call the relevant methods when they are pressed
        get requiresExplicitSubmission() {
          return false;
        }
      };
      exports.Form = Form3;
    }
  });

  // node_modules/@paperback/types/lib/impl/SettingsUI/FormItemElement.js
  var require_FormItemElement = __commonJS({
    "node_modules/@paperback/types/lib/impl/SettingsUI/FormItemElement.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.LabelRow = LabelRow2;
      exports.InputRow = InputRow2;
      exports.ToggleRow = ToggleRow2;
      exports.SelectRow = SelectRow2;
      exports.ButtonRow = ButtonRow2;
      exports.NavigationRow = NavigationRow2;
      exports.OAuthButtonRow = OAuthButtonRow2;
      exports.DeferredItem = DeferredItem2;
      function LabelRow2(id, props) {
        return { ...props, id, type: "labelRow", isHidden: props.isHidden ?? false };
      }
      function InputRow2(id, props) {
        return { ...props, id, type: "inputRow", isHidden: props.isHidden ?? false };
      }
      function ToggleRow2(id, props) {
        return { ...props, id, type: "toggleRow", isHidden: props.isHidden ?? false };
      }
      function SelectRow2(id, props) {
        return { ...props, id, type: "selectRow", isHidden: props.isHidden ?? false };
      }
      function ButtonRow2(id, props) {
        return { ...props, id, type: "buttonRow", isHidden: props.isHidden ?? false };
      }
      function NavigationRow2(id, props) {
        return {
          ...props,
          id,
          type: "navigationRow",
          isHidden: props.isHidden ?? false
        };
      }
      function OAuthButtonRow2(id, props) {
        return {
          ...props,
          id,
          type: "oauthButtonRow",
          isHidden: props.isHidden ?? false
        };
      }
      function DeferredItem2(work) {
        return work();
      }
    }
  });

  // node_modules/@paperback/types/lib/impl/SettingsUI/FormSection.js
  var require_FormSection = __commonJS({
    "node_modules/@paperback/types/lib/impl/SettingsUI/FormSection.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Section = Section2;
      function Section2(params, items) {
        let info;
        if (typeof params === "string") {
          info = { id: params };
        } else {
          info = params;
        }
        return {
          ...info,
          items: items.filter((x) => x)
        };
      }
    }
  });

  // node_modules/@paperback/types/lib/impl/SettingsUI/index.js
  var require_SettingsUI = __commonJS({
    "node_modules/@paperback/types/lib/impl/SettingsUI/index.js"(exports) {
      "use strict";
      init_buffer();
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      __exportStar(require_Form(), exports);
      __exportStar(require_FormItemElement(), exports);
      __exportStar(require_FormSection(), exports);
    }
  });

  // node_modules/@paperback/types/lib/impl/interfaces/ChapterProviding.js
  var require_ChapterProviding = __commonJS({
    "node_modules/@paperback/types/lib/impl/interfaces/ChapterProviding.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/impl/interfaces/CloudflareBypassRequestProviding.js
  var require_CloudflareBypassRequestProviding = __commonJS({
    "node_modules/@paperback/types/lib/impl/interfaces/CloudflareBypassRequestProviding.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/impl/interfaces/DiscoverSectionProviding.js
  var require_DiscoverSectionProviding = __commonJS({
    "node_modules/@paperback/types/lib/impl/interfaces/DiscoverSectionProviding.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/impl/interfaces/ManagedCollectionProviding.js
  var require_ManagedCollectionProviding = __commonJS({
    "node_modules/@paperback/types/lib/impl/interfaces/ManagedCollectionProviding.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/impl/interfaces/MangaProgressProviding.js
  var require_MangaProgressProviding = __commonJS({
    "node_modules/@paperback/types/lib/impl/interfaces/MangaProgressProviding.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/impl/interfaces/MangaProviding.js
  var require_MangaProviding = __commonJS({
    "node_modules/@paperback/types/lib/impl/interfaces/MangaProviding.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/impl/interfaces/SearchResultsProviding.js
  var require_SearchResultsProviding = __commonJS({
    "node_modules/@paperback/types/lib/impl/interfaces/SearchResultsProviding.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/impl/interfaces/SettingsFormProviding.js
  var require_SettingsFormProviding = __commonJS({
    "node_modules/@paperback/types/lib/impl/interfaces/SettingsFormProviding.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/impl/interfaces/index.js
  var require_interfaces = __commonJS({
    "node_modules/@paperback/types/lib/impl/interfaces/index.js"(exports) {
      "use strict";
      init_buffer();
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      __exportStar(require_ChapterProviding(), exports);
      __exportStar(require_CloudflareBypassRequestProviding(), exports);
      __exportStar(require_DiscoverSectionProviding(), exports);
      __exportStar(require_ManagedCollectionProviding(), exports);
      __exportStar(require_MangaProgressProviding(), exports);
      __exportStar(require_MangaProviding(), exports);
      __exportStar(require_SearchResultsProviding(), exports);
      __exportStar(require_SettingsFormProviding(), exports);
    }
  });

  // node_modules/@paperback/types/lib/impl/Application.js
  var require_Application = __commonJS({
    "node_modules/@paperback/types/lib/impl/Application.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/impl/PaperbackInterceptor.js
  var require_PaperbackInterceptor = __commonJS({
    "node_modules/@paperback/types/lib/impl/PaperbackInterceptor.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PaperbackInterceptor = void 0;
      var PaperbackInterceptor2 = class {
        id;
        constructor(id) {
          this.id = id;
        }
        registerInterceptor() {
          Application.registerInterceptor(this.id, Application.Selector(this, "interceptRequest"), Application.Selector(this, "interceptResponse"));
        }
        unregisterInterceptor() {
          Application.unregisterInterceptor(this.id);
        }
      };
      exports.PaperbackInterceptor = PaperbackInterceptor2;
    }
  });

  // node_modules/@paperback/types/lib/impl/Selector.js
  var require_Selector = __commonJS({
    "node_modules/@paperback/types/lib/impl/Selector.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/impl/Extension.js
  var require_Extension = __commonJS({
    "node_modules/@paperback/types/lib/impl/Extension.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/impl/Lock.js
  var require_Lock = __commonJS({
    "node_modules/@paperback/types/lib/impl/Lock.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.unlock = exports.lock = void 0;
      var promises = {};
      var resolvers = {};
      var lock = async (uid) => {
        if (promises[uid]) {
          await promises[uid];
          await (0, exports.lock)(uid);
          return;
        }
        promises[uid] = new Promise((resolve) => resolvers[uid] = () => {
          delete promises[uid];
          resolve();
        });
      };
      exports.lock = lock;
      var unlock = (uid) => {
        if (resolvers[uid]) {
          resolvers[uid]();
        }
      };
      exports.unlock = unlock;
    }
  });

  // node_modules/@paperback/types/lib/impl/BasicRateLimiter.js
  var require_BasicRateLimiter = __commonJS({
    "node_modules/@paperback/types/lib/impl/BasicRateLimiter.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.BasicRateLimiter = void 0;
      var Lock_1 = require_Lock();
      var PaperbackInterceptor_1 = require_PaperbackInterceptor();
      var BasicRateLimiter2 = class extends PaperbackInterceptor_1.PaperbackInterceptor {
        options;
        promise;
        currentRequestsMade = 0;
        lastReset = Date.now();
        imageRegex = new RegExp(/\.(png|gif|jpeg|jpg|webp)(\?|$)/gi);
        constructor(id, options) {
          super(id);
          this.options = options;
        }
        async interceptRequest(request) {
          if (this.options.ignoreImages && this.imageRegex.test(request.url)) {
            return request;
          }
          await (0, Lock_1.lock)(this.id);
          await this.incrementRequestCount();
          (0, Lock_1.unlock)(this.id);
          return request;
        }
        async interceptResponse(request, response, data) {
          return data;
        }
        async incrementRequestCount() {
          await this.promise;
          const secondsSinceLastReset = (Date.now() - this.lastReset) / 1e3;
          if (secondsSinceLastReset > this.options.bufferInterval) {
            this.currentRequestsMade = 0;
            this.lastReset = Date.now();
          }
          this.currentRequestsMade += 1;
          if (this.currentRequestsMade >= this.options.numberOfRequests) {
            if (secondsSinceLastReset <= this.options.bufferInterval) {
              const sleepTime = this.options.bufferInterval - secondsSinceLastReset;
              console.log(`[BasicRateLimiter] rate limit hit, sleeping for ${sleepTime}`);
              this.promise = Application.sleep(sleepTime);
              await this.promise;
            }
          }
        }
      };
      exports.BasicRateLimiter = BasicRateLimiter2;
    }
  });

  // node_modules/@paperback/types/lib/impl/CloudflareError.js
  var require_CloudflareError = __commonJS({
    "node_modules/@paperback/types/lib/impl/CloudflareError.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CloudflareError = void 0;
      var CloudflareError = class extends Error {
        resolutionRequest;
        type = "cloudflareError";
        constructor(resolutionRequest, message = "Cloudflare bypass is required") {
          super(message);
          this.resolutionRequest = resolutionRequest;
        }
      };
      exports.CloudflareError = CloudflareError;
    }
  });

  // node_modules/@paperback/types/lib/impl/CookieStorageInterceptor.js
  var require_CookieStorageInterceptor = __commonJS({
    "node_modules/@paperback/types/lib/impl/CookieStorageInterceptor.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CookieStorageInterceptor = void 0;
      var PaperbackInterceptor_1 = require_PaperbackInterceptor();
      var cookieStateKey = "cookie_store_cookies";
      var CookieStorageInterceptor = class extends PaperbackInterceptor_1.PaperbackInterceptor {
        options;
        _cookies = {};
        get cookies() {
          return Object.freeze(Object.values(this._cookies));
        }
        set cookies(newValue) {
          const cookies = {};
          for (const cookie of newValue) {
            if (this.isCookieExpired(cookie)) {
              continue;
            }
            cookies[this.cookieIdentifier(cookie)] = cookie;
          }
          this._cookies = cookies;
          this.saveCookiesToStorage();
        }
        constructor(options) {
          super("cookie_store");
          this.options = options;
          this.loadCookiesFromStorage();
        }
        async interceptRequest(request) {
          request.cookies = {
            // Already set cookies
            ...request.cookies ?? {},
            // Inject all the cookies as { name: value }
            ...this.cookiesForUrl(request.url).reduce((v, c) => {
              v[c.name] = c.value;
              return v;
            }, {})
          };
          return request;
        }
        async interceptResponse(request, response, data) {
          const cookies = this._cookies;
          for (const cookie of response.cookies) {
            const identifier = this.cookieIdentifier(cookie);
            if (this.isCookieExpired(cookie)) {
              delete cookies[identifier];
              continue;
            }
            cookies[identifier] = cookie;
          }
          this._cookies = cookies;
          this.saveCookiesToStorage();
          return data;
        }
        setCookie(cookie) {
          if (this.isCookieExpired(cookie)) {
            return;
          }
          this._cookies[this.cookieIdentifier(cookie)] = cookie;
          this.saveCookiesToStorage();
        }
        deleteCookie(cookie) {
          delete this._cookies[this.cookieIdentifier(cookie)];
        }
        cookiesForUrl(urlString) {
          console.log("[COMPAT] COOKIES FOR URL");
          const urlRegex = /^((?:(https?):\/\/)?((?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9][0-9]|[0-9])\.(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9][0-9]|[0-9])\.)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9][0-9]|[0-9])\.)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9][0-9]|[0-9]))|(?:(?:(?:\w+\.){1,2}[\w]{2,3})))(?::(\d+))?((?:\/[\w]+)*)(?:\/|(\/[\w]+\.[\w]{3,4})|(\?(?:([\w]+=[\w]+)&)*([\w]+=[\w]+))?|\?(?:(wsdl|wadl))))$/gm;
          const urlParsed = urlRegex.exec(urlString);
          if (!urlParsed) {
            return [];
          }
          const hostname = urlParsed[3];
          const pathname = urlParsed[5];
          const matchedCookies = {};
          const splitUrlPath = pathname.split("/");
          const cookies = this.cookies;
          for (const cookie of cookies) {
            if (this.isCookieExpired(cookie)) {
              delete this._cookies[this.cookieIdentifier(cookie)];
              continue;
            }
            const cookieDomain = this.cookieSanitizedDomain(cookie);
            if (cookieDomain != hostname) {
              continue;
            }
            const cookiePath = this.cookieSanitizedPath(cookie);
            const splitCookiePath = cookiePath.split("/");
            let pathMatches = 0;
            if (pathname === cookiePath) {
              pathMatches = Number.MAX_SAFE_INTEGER;
            } else if (splitUrlPath.length === 0 || pathname === "") {
              pathMatches = 1;
            } else if (cookiePath.startsWith(pathname) && splitUrlPath.length >= splitCookiePath.length) {
              for (let i = 0; i < splitUrlPath.length; i++) {
                if (splitCookiePath[i] === splitUrlPath[i]) {
                  pathMatches += 1;
                } else {
                  break;
                }
              }
            }
            if (pathMatches <= 0) {
              continue;
            }
            if ((matchedCookies[cookie.name]?.pathMatches ?? 0) < pathMatches) {
              matchedCookies[cookie.name] = { cookie, pathMatches };
            }
          }
          return Object.values(matchedCookies).map((x) => x.cookie);
        }
        cookieIdentifier(cookie) {
          return `${cookie.name}-${this.cookieSanitizedDomain(cookie)}-${this.cookieSanitizedPath(cookie)}`;
        }
        cookieSanitizedPath(cookie) {
          return cookie.path?.startsWith("/") ? cookie.path : "/" + (cookie.path ?? "");
        }
        cookieSanitizedDomain(cookie) {
          return cookie.domain.startsWith(".") ? cookie.domain.slice(1) : cookie.domain;
        }
        isCookieExpired(cookie) {
          if (cookie.expires && cookie.expires.getTime() <= Date.now()) {
            return true;
          } else {
            return false;
          }
        }
        loadCookiesFromStorage() {
          if (this.options.storage == "memory")
            return;
          const cookieData = Application.getState(cookieStateKey);
          if (!cookieData) {
            this._cookies = {};
            return;
          }
          const cookies = {};
          for (const cookie of cookieData) {
            if (!cookie.expires || this.isCookieExpired(cookie))
              continue;
            cookies[this.cookieIdentifier(cookie)] = cookie;
          }
          this._cookies = cookies;
        }
        saveCookiesToStorage() {
          if (this.options.storage == "memory")
            return;
          Application.setState(this.cookies.filter((x) => x.expires), cookieStateKey);
        }
      };
      exports.CookieStorageInterceptor = CookieStorageInterceptor;
    }
  });

  // node_modules/@paperback/types/lib/impl/index.js
  var require_impl = __commonJS({
    "node_modules/@paperback/types/lib/impl/index.js"(exports) {
      "use strict";
      init_buffer();
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      __exportStar(require_SettingsUI(), exports);
      __exportStar(require_interfaces(), exports);
      __exportStar(require_Application(), exports);
      __exportStar(require_PaperbackInterceptor(), exports);
      __exportStar(require_Selector(), exports);
      __exportStar(require_Extension(), exports);
      __exportStar(require_BasicRateLimiter(), exports);
      __exportStar(require_CloudflareError(), exports);
      __exportStar(require_CookieStorageInterceptor(), exports);
    }
  });

  // node_modules/@paperback/types/lib/Chapter.js
  var require_Chapter = __commonJS({
    "node_modules/@paperback/types/lib/Chapter.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/ChapterDetails.js
  var require_ChapterDetails = __commonJS({
    "node_modules/@paperback/types/lib/ChapterDetails.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/Cookie.js
  var require_Cookie = __commonJS({
    "node_modules/@paperback/types/lib/Cookie.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/DiscoverSectionItem.js
  var require_DiscoverSectionItem = __commonJS({
    "node_modules/@paperback/types/lib/DiscoverSectionItem.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/DiscoverSectionType.js
  var require_DiscoverSectionType = __commonJS({
    "node_modules/@paperback/types/lib/DiscoverSectionType.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DiscoverSectionType = void 0;
      var DiscoverSectionType2;
      (function(DiscoverSectionType3) {
        DiscoverSectionType3[DiscoverSectionType3["featured"] = 0] = "featured";
        DiscoverSectionType3[DiscoverSectionType3["simpleCarousel"] = 1] = "simpleCarousel";
        DiscoverSectionType3[DiscoverSectionType3["prominentCarousel"] = 2] = "prominentCarousel";
        DiscoverSectionType3[DiscoverSectionType3["chapterUpdates"] = 3] = "chapterUpdates";
        DiscoverSectionType3[DiscoverSectionType3["genres"] = 4] = "genres";
      })(DiscoverSectionType2 || (exports.DiscoverSectionType = DiscoverSectionType2 = {}));
    }
  });

  // node_modules/@paperback/types/lib/HomeSection.js
  var require_HomeSection = __commonJS({
    "node_modules/@paperback/types/lib/HomeSection.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/MangaInfo.js
  var require_MangaInfo = __commonJS({
    "node_modules/@paperback/types/lib/MangaInfo.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/MangaProgress.js
  var require_MangaProgress = __commonJS({
    "node_modules/@paperback/types/lib/MangaProgress.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/PagedResults.js
  var require_PagedResults = __commonJS({
    "node_modules/@paperback/types/lib/PagedResults.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.EndOfPageResults = void 0;
      exports.EndOfPageResults = Object.freeze({
        items: [],
        metadata: void 0
      });
    }
  });

  // node_modules/@paperback/types/lib/PBCanvas.js
  var require_PBCanvas = __commonJS({
    "node_modules/@paperback/types/lib/PBCanvas.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/PBImage.js
  var require_PBImage = __commonJS({
    "node_modules/@paperback/types/lib/PBImage.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/Request.js
  var require_Request = __commonJS({
    "node_modules/@paperback/types/lib/Request.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/Response.js
  var require_Response = __commonJS({
    "node_modules/@paperback/types/lib/Response.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/SearchFilter.js
  var require_SearchFilter = __commonJS({
    "node_modules/@paperback/types/lib/SearchFilter.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/SearchQuery.js
  var require_SearchQuery = __commonJS({
    "node_modules/@paperback/types/lib/SearchQuery.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/SearchResultItem.js
  var require_SearchResultItem = __commonJS({
    "node_modules/@paperback/types/lib/SearchResultItem.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/SourceInfo.js
  var require_SourceInfo = __commonJS({
    "node_modules/@paperback/types/lib/SourceInfo.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ContentRating = exports.SourceIntents = void 0;
      var SourceIntents;
      (function(SourceIntents2) {
        SourceIntents2[SourceIntents2["MANGA_CHAPTERS"] = 1] = "MANGA_CHAPTERS";
        SourceIntents2[SourceIntents2["MANGA_TRACKING"] = 2] = "MANGA_TRACKING";
        SourceIntents2[SourceIntents2["MANGA_PROGRESS"] = 2] = "MANGA_PROGRESS";
        SourceIntents2[SourceIntents2["HOMEPAGE_SECTIONS"] = 4] = "HOMEPAGE_SECTIONS";
        SourceIntents2[SourceIntents2["DISCOVER_SECIONS"] = 4] = "DISCOVER_SECIONS";
        SourceIntents2[SourceIntents2["COLLECTION_MANAGEMENT"] = 8] = "COLLECTION_MANAGEMENT";
        SourceIntents2[SourceIntents2["CLOUDFLARE_BYPASS_REQUIRED"] = 16] = "CLOUDFLARE_BYPASS_REQUIRED";
        SourceIntents2[SourceIntents2["SETTINGS_UI"] = 32] = "SETTINGS_UI";
        SourceIntents2[SourceIntents2["MANGA_SEARCH"] = 64] = "MANGA_SEARCH";
      })(SourceIntents || (exports.SourceIntents = SourceIntents = {}));
      var ContentRating2;
      (function(ContentRating3) {
        ContentRating3["EVERYONE"] = "SAFE";
        ContentRating3["MATURE"] = "MATURE";
        ContentRating3["ADULT"] = "ADULT";
      })(ContentRating2 || (exports.ContentRating = ContentRating2 = {}));
    }
  });

  // node_modules/@paperback/types/lib/SourceManga.js
  var require_SourceManga = __commonJS({
    "node_modules/@paperback/types/lib/SourceManga.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/Tag.js
  var require_Tag = __commonJS({
    "node_modules/@paperback/types/lib/Tag.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/TagSection.js
  var require_TagSection = __commonJS({
    "node_modules/@paperback/types/lib/TagSection.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/TrackedMangaChapterReadAction.js
  var require_TrackedMangaChapterReadAction = __commonJS({
    "node_modules/@paperback/types/lib/TrackedMangaChapterReadAction.js"(exports) {
      "use strict";
      init_buffer();
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@paperback/types/lib/index.js
  var require_lib = __commonJS({
    "node_modules/@paperback/types/lib/index.js"(exports) {
      "use strict";
      init_buffer();
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      __exportStar(require_impl(), exports);
      __exportStar(require_Chapter(), exports);
      __exportStar(require_ChapterDetails(), exports);
      __exportStar(require_Cookie(), exports);
      __exportStar(require_DiscoverSectionItem(), exports);
      __exportStar(require_DiscoverSectionType(), exports);
      __exportStar(require_HomeSection(), exports);
      __exportStar(require_lib(), exports);
      __exportStar(require_MangaInfo(), exports);
      __exportStar(require_MangaProgress(), exports);
      __exportStar(require_PagedResults(), exports);
      __exportStar(require_PBCanvas(), exports);
      __exportStar(require_PBImage(), exports);
      __exportStar(require_Request(), exports);
      __exportStar(require_Response(), exports);
      __exportStar(require_SearchFilter(), exports);
      __exportStar(require_SearchQuery(), exports);
      __exportStar(require_SearchResultItem(), exports);
      __exportStar(require_SourceInfo(), exports);
      __exportStar(require_SourceManga(), exports);
      __exportStar(require_Tag(), exports);
      __exportStar(require_TagSection(), exports);
      __exportStar(require_TrackedMangaChapterReadAction(), exports);
    }
  });

  // node_modules/has-symbols/shams.js
  var require_shams = __commonJS({
    "node_modules/has-symbols/shams.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = function hasSymbols() {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
          return false;
        }
        if (typeof Symbol.iterator === "symbol") {
          return true;
        }
        var obj = {};
        var sym = Symbol("test");
        var symObj = Object(sym);
        if (typeof sym === "string") {
          return false;
        }
        if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
          return false;
        }
        if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
          return false;
        }
        var symVal = 42;
        obj[sym] = symVal;
        for (var _ in obj) {
          return false;
        }
        if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
          return false;
        }
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
          return false;
        }
        var syms = Object.getOwnPropertySymbols(obj);
        if (syms.length !== 1 || syms[0] !== sym) {
          return false;
        }
        if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
          return false;
        }
        if (typeof Object.getOwnPropertyDescriptor === "function") {
          var descriptor = (
            /** @type {PropertyDescriptor} */
            Object.getOwnPropertyDescriptor(obj, sym)
          );
          if (descriptor.value !== symVal || descriptor.enumerable !== true) {
            return false;
          }
        }
        return true;
      };
    }
  });

  // node_modules/has-tostringtag/shams.js
  var require_shams2 = __commonJS({
    "node_modules/has-tostringtag/shams.js"(exports, module) {
      "use strict";
      init_buffer();
      var hasSymbols = require_shams();
      module.exports = function hasToStringTagShams() {
        return hasSymbols() && !!Symbol.toStringTag;
      };
    }
  });

  // node_modules/es-object-atoms/index.js
  var require_es_object_atoms = __commonJS({
    "node_modules/es-object-atoms/index.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = Object;
    }
  });

  // node_modules/es-errors/index.js
  var require_es_errors = __commonJS({
    "node_modules/es-errors/index.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = Error;
    }
  });

  // node_modules/es-errors/eval.js
  var require_eval = __commonJS({
    "node_modules/es-errors/eval.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = EvalError;
    }
  });

  // node_modules/es-errors/range.js
  var require_range = __commonJS({
    "node_modules/es-errors/range.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = RangeError;
    }
  });

  // node_modules/es-errors/ref.js
  var require_ref = __commonJS({
    "node_modules/es-errors/ref.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = ReferenceError;
    }
  });

  // node_modules/es-errors/syntax.js
  var require_syntax = __commonJS({
    "node_modules/es-errors/syntax.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = SyntaxError;
    }
  });

  // node_modules/es-errors/type.js
  var require_type = __commonJS({
    "node_modules/es-errors/type.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = TypeError;
    }
  });

  // node_modules/es-errors/uri.js
  var require_uri = __commonJS({
    "node_modules/es-errors/uri.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = URIError;
    }
  });

  // node_modules/math-intrinsics/abs.js
  var require_abs = __commonJS({
    "node_modules/math-intrinsics/abs.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = Math.abs;
    }
  });

  // node_modules/math-intrinsics/floor.js
  var require_floor = __commonJS({
    "node_modules/math-intrinsics/floor.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = Math.floor;
    }
  });

  // node_modules/math-intrinsics/max.js
  var require_max = __commonJS({
    "node_modules/math-intrinsics/max.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = Math.max;
    }
  });

  // node_modules/math-intrinsics/min.js
  var require_min = __commonJS({
    "node_modules/math-intrinsics/min.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = Math.min;
    }
  });

  // node_modules/math-intrinsics/pow.js
  var require_pow = __commonJS({
    "node_modules/math-intrinsics/pow.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = Math.pow;
    }
  });

  // node_modules/math-intrinsics/round.js
  var require_round = __commonJS({
    "node_modules/math-intrinsics/round.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = Math.round;
    }
  });

  // node_modules/math-intrinsics/isNaN.js
  var require_isNaN = __commonJS({
    "node_modules/math-intrinsics/isNaN.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = Number.isNaN || function isNaN2(a) {
        return a !== a;
      };
    }
  });

  // node_modules/math-intrinsics/sign.js
  var require_sign = __commonJS({
    "node_modules/math-intrinsics/sign.js"(exports, module) {
      "use strict";
      init_buffer();
      var $isNaN = require_isNaN();
      module.exports = function sign(number) {
        if ($isNaN(number) || number === 0) {
          return number;
        }
        return number < 0 ? -1 : 1;
      };
    }
  });

  // node_modules/gopd/gOPD.js
  var require_gOPD = __commonJS({
    "node_modules/gopd/gOPD.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = Object.getOwnPropertyDescriptor;
    }
  });

  // node_modules/gopd/index.js
  var require_gopd = __commonJS({
    "node_modules/gopd/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var $gOPD = require_gOPD();
      if ($gOPD) {
        try {
          $gOPD([], "length");
        } catch (e) {
          $gOPD = null;
        }
      }
      module.exports = $gOPD;
    }
  });

  // node_modules/es-define-property/index.js
  var require_es_define_property = __commonJS({
    "node_modules/es-define-property/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var $defineProperty = Object.defineProperty || false;
      if ($defineProperty) {
        try {
          $defineProperty({}, "a", { value: 1 });
        } catch (e) {
          $defineProperty = false;
        }
      }
      module.exports = $defineProperty;
    }
  });

  // node_modules/has-symbols/index.js
  var require_has_symbols = __commonJS({
    "node_modules/has-symbols/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var origSymbol = typeof Symbol !== "undefined" && Symbol;
      var hasSymbolSham = require_shams();
      module.exports = function hasNativeSymbols() {
        if (typeof origSymbol !== "function") {
          return false;
        }
        if (typeof Symbol !== "function") {
          return false;
        }
        if (typeof origSymbol("foo") !== "symbol") {
          return false;
        }
        if (typeof Symbol("bar") !== "symbol") {
          return false;
        }
        return hasSymbolSham();
      };
    }
  });

  // node_modules/get-proto/Reflect.getPrototypeOf.js
  var require_Reflect_getPrototypeOf = __commonJS({
    "node_modules/get-proto/Reflect.getPrototypeOf.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
    }
  });

  // node_modules/get-proto/Object.getPrototypeOf.js
  var require_Object_getPrototypeOf = __commonJS({
    "node_modules/get-proto/Object.getPrototypeOf.js"(exports, module) {
      "use strict";
      init_buffer();
      var $Object = require_es_object_atoms();
      module.exports = $Object.getPrototypeOf || null;
    }
  });

  // node_modules/function-bind/implementation.js
  var require_implementation = __commonJS({
    "node_modules/function-bind/implementation.js"(exports, module) {
      "use strict";
      init_buffer();
      var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
      var toStr = Object.prototype.toString;
      var max = Math.max;
      var funcType = "[object Function]";
      var concatty = function concatty2(a, b) {
        var arr = [];
        for (var i = 0; i < a.length; i += 1) {
          arr[i] = a[i];
        }
        for (var j = 0; j < b.length; j += 1) {
          arr[j + a.length] = b[j];
        }
        return arr;
      };
      var slicy = function slicy2(arrLike, offset) {
        var arr = [];
        for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
          arr[j] = arrLike[i];
        }
        return arr;
      };
      var joiny = function(arr, joiner) {
        var str = "";
        for (var i = 0; i < arr.length; i += 1) {
          str += arr[i];
          if (i + 1 < arr.length) {
            str += joiner;
          }
        }
        return str;
      };
      module.exports = function bind(that) {
        var target = this;
        if (typeof target !== "function" || toStr.apply(target) !== funcType) {
          throw new TypeError(ERROR_MESSAGE + target);
        }
        var args = slicy(arguments, 1);
        var bound;
        var binder = function() {
          if (this instanceof bound) {
            var result = target.apply(
              this,
              concatty(args, arguments)
            );
            if (Object(result) === result) {
              return result;
            }
            return this;
          }
          return target.apply(
            that,
            concatty(args, arguments)
          );
        };
        var boundLength = max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
          boundArgs[i] = "$" + i;
        }
        bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
        if (target.prototype) {
          var Empty = function Empty2() {
          };
          Empty.prototype = target.prototype;
          bound.prototype = new Empty();
          Empty.prototype = null;
        }
        return bound;
      };
    }
  });

  // node_modules/function-bind/index.js
  var require_function_bind = __commonJS({
    "node_modules/function-bind/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var implementation = require_implementation();
      module.exports = Function.prototype.bind || implementation;
    }
  });

  // node_modules/call-bind-apply-helpers/functionCall.js
  var require_functionCall = __commonJS({
    "node_modules/call-bind-apply-helpers/functionCall.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = Function.prototype.call;
    }
  });

  // node_modules/call-bind-apply-helpers/functionApply.js
  var require_functionApply = __commonJS({
    "node_modules/call-bind-apply-helpers/functionApply.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = Function.prototype.apply;
    }
  });

  // node_modules/call-bind-apply-helpers/reflectApply.js
  var require_reflectApply = __commonJS({
    "node_modules/call-bind-apply-helpers/reflectApply.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
    }
  });

  // node_modules/call-bind-apply-helpers/actualApply.js
  var require_actualApply = __commonJS({
    "node_modules/call-bind-apply-helpers/actualApply.js"(exports, module) {
      "use strict";
      init_buffer();
      var bind = require_function_bind();
      var $apply = require_functionApply();
      var $call = require_functionCall();
      var $reflectApply = require_reflectApply();
      module.exports = $reflectApply || bind.call($call, $apply);
    }
  });

  // node_modules/call-bind-apply-helpers/index.js
  var require_call_bind_apply_helpers = __commonJS({
    "node_modules/call-bind-apply-helpers/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var bind = require_function_bind();
      var $TypeError = require_type();
      var $call = require_functionCall();
      var $actualApply = require_actualApply();
      module.exports = function callBindBasic(args) {
        if (args.length < 1 || typeof args[0] !== "function") {
          throw new $TypeError("a function is required");
        }
        return $actualApply(bind, $call, args);
      };
    }
  });

  // node_modules/dunder-proto/get.js
  var require_get = __commonJS({
    "node_modules/dunder-proto/get.js"(exports, module) {
      "use strict";
      init_buffer();
      var callBind = require_call_bind_apply_helpers();
      var gOPD = require_gopd();
      var hasProtoAccessor;
      try {
        hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */
        [].__proto__ === Array.prototype;
      } catch (e) {
        if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
          throw e;
        }
      }
      var desc = !!hasProtoAccessor && gOPD && gOPD(
        Object.prototype,
        /** @type {keyof typeof Object.prototype} */
        "__proto__"
      );
      var $Object = Object;
      var $getPrototypeOf = $Object.getPrototypeOf;
      module.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? (
        /** @type {import('./get')} */
        function getDunder(value) {
          return $getPrototypeOf(value == null ? value : $Object(value));
        }
      ) : false;
    }
  });

  // node_modules/get-proto/index.js
  var require_get_proto = __commonJS({
    "node_modules/get-proto/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var reflectGetProto = require_Reflect_getPrototypeOf();
      var originalGetProto = require_Object_getPrototypeOf();
      var getDunderProto = require_get();
      module.exports = reflectGetProto ? function getProto(O) {
        return reflectGetProto(O);
      } : originalGetProto ? function getProto(O) {
        if (!O || typeof O !== "object" && typeof O !== "function") {
          throw new TypeError("getProto: not an object");
        }
        return originalGetProto(O);
      } : getDunderProto ? function getProto(O) {
        return getDunderProto(O);
      } : null;
    }
  });

  // node_modules/hasown/index.js
  var require_hasown = __commonJS({
    "node_modules/hasown/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var call = Function.prototype.call;
      var $hasOwn = Object.prototype.hasOwnProperty;
      var bind = require_function_bind();
      module.exports = bind.call(call, $hasOwn);
    }
  });

  // node_modules/get-intrinsic/index.js
  var require_get_intrinsic = __commonJS({
    "node_modules/get-intrinsic/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var undefined2;
      var $Object = require_es_object_atoms();
      var $Error = require_es_errors();
      var $EvalError = require_eval();
      var $RangeError = require_range();
      var $ReferenceError = require_ref();
      var $SyntaxError = require_syntax();
      var $TypeError = require_type();
      var $URIError = require_uri();
      var abs = require_abs();
      var floor = require_floor();
      var max = require_max();
      var min = require_min();
      var pow = require_pow();
      var round = require_round();
      var sign = require_sign();
      var $Function = Function;
      var getEvalledConstructor = function(expressionSyntax) {
        try {
          return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
        } catch (e) {
        }
      };
      var $gOPD = require_gopd();
      var $defineProperty = require_es_define_property();
      var throwTypeError = function() {
        throw new $TypeError();
      };
      var ThrowTypeError = $gOPD ? function() {
        try {
          arguments.callee;
          return throwTypeError;
        } catch (calleeThrows) {
          try {
            return $gOPD(arguments, "callee").get;
          } catch (gOPDthrows) {
            return throwTypeError;
          }
        }
      }() : throwTypeError;
      var hasSymbols = require_has_symbols()();
      var getProto = require_get_proto();
      var $ObjectGPO = require_Object_getPrototypeOf();
      var $ReflectGPO = require_Reflect_getPrototypeOf();
      var $apply = require_functionApply();
      var $call = require_functionCall();
      var needsEval = {};
      var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
      var INTRINSICS = {
        __proto__: null,
        "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
        "%Array%": Array,
        "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
        "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
        "%AsyncFromSyncIteratorPrototype%": undefined2,
        "%AsyncFunction%": needsEval,
        "%AsyncGenerator%": needsEval,
        "%AsyncGeneratorFunction%": needsEval,
        "%AsyncIteratorPrototype%": needsEval,
        "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
        "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
        "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
        "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
        "%Boolean%": Boolean,
        "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
        "%Date%": Date,
        "%decodeURI%": decodeURI,
        "%decodeURIComponent%": decodeURIComponent,
        "%encodeURI%": encodeURI,
        "%encodeURIComponent%": encodeURIComponent,
        "%Error%": $Error,
        "%eval%": eval,
        // eslint-disable-line no-eval
        "%EvalError%": $EvalError,
        "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
        "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
        "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
        "%Function%": $Function,
        "%GeneratorFunction%": needsEval,
        "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
        "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
        "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
        "%isFinite%": isFinite,
        "%isNaN%": isNaN,
        "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
        "%JSON%": typeof JSON === "object" ? JSON : undefined2,
        "%Map%": typeof Map === "undefined" ? undefined2 : Map,
        "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
        "%Math%": Math,
        "%Number%": Number,
        "%Object%": $Object,
        "%Object.getOwnPropertyDescriptor%": $gOPD,
        "%parseFloat%": parseFloat,
        "%parseInt%": parseInt,
        "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
        "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
        "%RangeError%": $RangeError,
        "%ReferenceError%": $ReferenceError,
        "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
        "%RegExp%": RegExp,
        "%Set%": typeof Set === "undefined" ? undefined2 : Set,
        "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
        "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
        "%String%": String,
        "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
        "%Symbol%": hasSymbols ? Symbol : undefined2,
        "%SyntaxError%": $SyntaxError,
        "%ThrowTypeError%": ThrowTypeError,
        "%TypedArray%": TypedArray,
        "%TypeError%": $TypeError,
        "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
        "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
        "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
        "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
        "%URIError%": $URIError,
        "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
        "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
        "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet,
        "%Function.prototype.call%": $call,
        "%Function.prototype.apply%": $apply,
        "%Object.defineProperty%": $defineProperty,
        "%Object.getPrototypeOf%": $ObjectGPO,
        "%Math.abs%": abs,
        "%Math.floor%": floor,
        "%Math.max%": max,
        "%Math.min%": min,
        "%Math.pow%": pow,
        "%Math.round%": round,
        "%Math.sign%": sign,
        "%Reflect.getPrototypeOf%": $ReflectGPO
      };
      if (getProto) {
        try {
          null.error;
        } catch (e) {
          errorProto = getProto(getProto(e));
          INTRINSICS["%Error.prototype%"] = errorProto;
        }
      }
      var errorProto;
      var doEval = function doEval2(name) {
        var value;
        if (name === "%AsyncFunction%") {
          value = getEvalledConstructor("async function () {}");
        } else if (name === "%GeneratorFunction%") {
          value = getEvalledConstructor("function* () {}");
        } else if (name === "%AsyncGeneratorFunction%") {
          value = getEvalledConstructor("async function* () {}");
        } else if (name === "%AsyncGenerator%") {
          var fn = doEval2("%AsyncGeneratorFunction%");
          if (fn) {
            value = fn.prototype;
          }
        } else if (name === "%AsyncIteratorPrototype%") {
          var gen = doEval2("%AsyncGenerator%");
          if (gen && getProto) {
            value = getProto(gen.prototype);
          }
        }
        INTRINSICS[name] = value;
        return value;
      };
      var LEGACY_ALIASES = {
        __proto__: null,
        "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
        "%ArrayPrototype%": ["Array", "prototype"],
        "%ArrayProto_entries%": ["Array", "prototype", "entries"],
        "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
        "%ArrayProto_keys%": ["Array", "prototype", "keys"],
        "%ArrayProto_values%": ["Array", "prototype", "values"],
        "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
        "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
        "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
        "%BooleanPrototype%": ["Boolean", "prototype"],
        "%DataViewPrototype%": ["DataView", "prototype"],
        "%DatePrototype%": ["Date", "prototype"],
        "%ErrorPrototype%": ["Error", "prototype"],
        "%EvalErrorPrototype%": ["EvalError", "prototype"],
        "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
        "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
        "%FunctionPrototype%": ["Function", "prototype"],
        "%Generator%": ["GeneratorFunction", "prototype"],
        "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
        "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
        "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
        "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
        "%JSONParse%": ["JSON", "parse"],
        "%JSONStringify%": ["JSON", "stringify"],
        "%MapPrototype%": ["Map", "prototype"],
        "%NumberPrototype%": ["Number", "prototype"],
        "%ObjectPrototype%": ["Object", "prototype"],
        "%ObjProto_toString%": ["Object", "prototype", "toString"],
        "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
        "%PromisePrototype%": ["Promise", "prototype"],
        "%PromiseProto_then%": ["Promise", "prototype", "then"],
        "%Promise_all%": ["Promise", "all"],
        "%Promise_reject%": ["Promise", "reject"],
        "%Promise_resolve%": ["Promise", "resolve"],
        "%RangeErrorPrototype%": ["RangeError", "prototype"],
        "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
        "%RegExpPrototype%": ["RegExp", "prototype"],
        "%SetPrototype%": ["Set", "prototype"],
        "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
        "%StringPrototype%": ["String", "prototype"],
        "%SymbolPrototype%": ["Symbol", "prototype"],
        "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
        "%TypedArrayPrototype%": ["TypedArray", "prototype"],
        "%TypeErrorPrototype%": ["TypeError", "prototype"],
        "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
        "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
        "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
        "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
        "%URIErrorPrototype%": ["URIError", "prototype"],
        "%WeakMapPrototype%": ["WeakMap", "prototype"],
        "%WeakSetPrototype%": ["WeakSet", "prototype"]
      };
      var bind = require_function_bind();
      var hasOwn = require_hasown();
      var $concat = bind.call($call, Array.prototype.concat);
      var $spliceApply = bind.call($apply, Array.prototype.splice);
      var $replace = bind.call($call, String.prototype.replace);
      var $strSlice = bind.call($call, String.prototype.slice);
      var $exec = bind.call($call, RegExp.prototype.exec);
      var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = function stringToPath2(string) {
        var first = $strSlice(string, 0, 1);
        var last = $strSlice(string, -1);
        if (first === "%" && last !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
        } else if (last === "%" && first !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
        }
        var result = [];
        $replace(string, rePropName, function(match, number, quote, subString) {
          result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
        });
        return result;
      };
      var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
        var intrinsicName = name;
        var alias;
        if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
          alias = LEGACY_ALIASES[intrinsicName];
          intrinsicName = "%" + alias[0] + "%";
        }
        if (hasOwn(INTRINSICS, intrinsicName)) {
          var value = INTRINSICS[intrinsicName];
          if (value === needsEval) {
            value = doEval(intrinsicName);
          }
          if (typeof value === "undefined" && !allowMissing) {
            throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
          }
          return {
            alias,
            name: intrinsicName,
            value
          };
        }
        throw new $SyntaxError("intrinsic " + name + " does not exist!");
      };
      module.exports = function GetIntrinsic(name, allowMissing) {
        if (typeof name !== "string" || name.length === 0) {
          throw new $TypeError("intrinsic name must be a non-empty string");
        }
        if (arguments.length > 1 && typeof allowMissing !== "boolean") {
          throw new $TypeError('"allowMissing" argument must be a boolean');
        }
        if ($exec(/^%?[^%]*%?$/, name) === null) {
          throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
        }
        var parts = stringToPath(name);
        var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
        var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
        var intrinsicRealName = intrinsic.name;
        var value = intrinsic.value;
        var skipFurtherCaching = false;
        var alias = intrinsic.alias;
        if (alias) {
          intrinsicBaseName = alias[0];
          $spliceApply(parts, $concat([0, 1], alias));
        }
        for (var i = 1, isOwn = true; i < parts.length; i += 1) {
          var part = parts[i];
          var first = $strSlice(part, 0, 1);
          var last = $strSlice(part, -1);
          if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
            throw new $SyntaxError("property names with quotes must have matching quotes");
          }
          if (part === "constructor" || !isOwn) {
            skipFurtherCaching = true;
          }
          intrinsicBaseName += "." + part;
          intrinsicRealName = "%" + intrinsicBaseName + "%";
          if (hasOwn(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName];
          } else if (value != null) {
            if (!(part in value)) {
              if (!allowMissing) {
                throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
              }
              return void 0;
            }
            if ($gOPD && i + 1 >= parts.length) {
              var desc = $gOPD(value, part);
              isOwn = !!desc;
              if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
                value = desc.get;
              } else {
                value = value[part];
              }
            } else {
              isOwn = hasOwn(value, part);
              value = value[part];
            }
            if (isOwn && !skipFurtherCaching) {
              INTRINSICS[intrinsicRealName] = value;
            }
          }
        }
        return value;
      };
    }
  });

  // node_modules/call-bound/index.js
  var require_call_bound = __commonJS({
    "node_modules/call-bound/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var GetIntrinsic = require_get_intrinsic();
      var callBindBasic = require_call_bind_apply_helpers();
      var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
      module.exports = function callBoundIntrinsic(name, allowMissing) {
        var intrinsic = (
          /** @type {Parameters<typeof callBindBasic>[0][0]} */
          GetIntrinsic(name, !!allowMissing)
        );
        if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
          return callBindBasic([intrinsic]);
        }
        return intrinsic;
      };
    }
  });

  // node_modules/is-arguments/index.js
  var require_is_arguments = __commonJS({
    "node_modules/is-arguments/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var hasToStringTag = require_shams2()();
      var callBound = require_call_bound();
      var $toString = callBound("Object.prototype.toString");
      var isStandardArguments = function isArguments(value) {
        if (hasToStringTag && value && typeof value === "object" && Symbol.toStringTag in value) {
          return false;
        }
        return $toString(value) === "[object Arguments]";
      };
      var isLegacyArguments = function isArguments(value) {
        if (isStandardArguments(value)) {
          return true;
        }
        return value !== null && typeof value === "object" && "length" in value && typeof value.length === "number" && value.length >= 0 && $toString(value) !== "[object Array]" && "callee" in value && $toString(value.callee) === "[object Function]";
      };
      var supportsStandardArguments = function() {
        return isStandardArguments(arguments);
      }();
      isStandardArguments.isLegacyArguments = isLegacyArguments;
      module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
    }
  });

  // node_modules/is-regex/index.js
  var require_is_regex = __commonJS({
    "node_modules/is-regex/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var callBound = require_call_bound();
      var hasToStringTag = require_shams2()();
      var hasOwn = require_hasown();
      var gOPD = require_gopd();
      var fn;
      if (hasToStringTag) {
        $exec = callBound("RegExp.prototype.exec");
        isRegexMarker = {};
        throwRegexMarker = function() {
          throw isRegexMarker;
        };
        badStringifier = {
          toString: throwRegexMarker,
          valueOf: throwRegexMarker
        };
        if (typeof Symbol.toPrimitive === "symbol") {
          badStringifier[Symbol.toPrimitive] = throwRegexMarker;
        }
        fn = function isRegex(value) {
          if (!value || typeof value !== "object") {
            return false;
          }
          var descriptor = (
            /** @type {NonNullable<typeof gOPD>} */
            gOPD(
              /** @type {{ lastIndex?: unknown }} */
              value,
              "lastIndex"
            )
          );
          var hasLastIndexDataProperty = descriptor && hasOwn(descriptor, "value");
          if (!hasLastIndexDataProperty) {
            return false;
          }
          try {
            $exec(
              value,
              /** @type {string} */
              /** @type {unknown} */
              badStringifier
            );
          } catch (e) {
            return e === isRegexMarker;
          }
        };
      } else {
        $toString = callBound("Object.prototype.toString");
        regexClass = "[object RegExp]";
        fn = function isRegex(value) {
          if (!value || typeof value !== "object" && typeof value !== "function") {
            return false;
          }
          return $toString(value) === regexClass;
        };
      }
      var $exec;
      var isRegexMarker;
      var throwRegexMarker;
      var badStringifier;
      var $toString;
      var regexClass;
      module.exports = fn;
    }
  });

  // node_modules/safe-regex-test/index.js
  var require_safe_regex_test = __commonJS({
    "node_modules/safe-regex-test/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var callBound = require_call_bound();
      var isRegex = require_is_regex();
      var $exec = callBound("RegExp.prototype.exec");
      var $TypeError = require_type();
      module.exports = function regexTester(regex) {
        if (!isRegex(regex)) {
          throw new $TypeError("`regex` must be a RegExp");
        }
        return function test(s) {
          return $exec(regex, s) !== null;
        };
      };
    }
  });

  // node_modules/is-generator-function/index.js
  var require_is_generator_function = __commonJS({
    "node_modules/is-generator-function/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var callBound = require_call_bound();
      var safeRegexTest = require_safe_regex_test();
      var isFnRegex = safeRegexTest(/^\s*(?:function)?\*/);
      var hasToStringTag = require_shams2()();
      var getProto = require_get_proto();
      var toStr = callBound("Object.prototype.toString");
      var fnToStr = callBound("Function.prototype.toString");
      var getGeneratorFunc = function() {
        if (!hasToStringTag) {
          return false;
        }
        try {
          return Function("return function*() {}")();
        } catch (e) {
        }
      };
      var GeneratorFunction;
      module.exports = function isGeneratorFunction(fn) {
        if (typeof fn !== "function") {
          return false;
        }
        if (isFnRegex(fnToStr(fn))) {
          return true;
        }
        if (!hasToStringTag) {
          var str = toStr(fn);
          return str === "[object GeneratorFunction]";
        }
        if (!getProto) {
          return false;
        }
        if (typeof GeneratorFunction === "undefined") {
          var generatorFunc = getGeneratorFunc();
          GeneratorFunction = generatorFunc ? (
            /** @type {GeneratorFunctionConstructor} */
            getProto(generatorFunc)
          ) : false;
        }
        return getProto(fn) === GeneratorFunction;
      };
    }
  });

  // node_modules/is-callable/index.js
  var require_is_callable = __commonJS({
    "node_modules/is-callable/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var fnToStr = Function.prototype.toString;
      var reflectApply = typeof Reflect === "object" && Reflect !== null && Reflect.apply;
      var badArrayLike;
      var isCallableMarker;
      if (typeof reflectApply === "function" && typeof Object.defineProperty === "function") {
        try {
          badArrayLike = Object.defineProperty({}, "length", {
            get: function() {
              throw isCallableMarker;
            }
          });
          isCallableMarker = {};
          reflectApply(function() {
            throw 42;
          }, null, badArrayLike);
        } catch (_) {
          if (_ !== isCallableMarker) {
            reflectApply = null;
          }
        }
      } else {
        reflectApply = null;
      }
      var constructorRegex = /^\s*class\b/;
      var isES6ClassFn = function isES6ClassFunction(value) {
        try {
          var fnStr = fnToStr.call(value);
          return constructorRegex.test(fnStr);
        } catch (e) {
          return false;
        }
      };
      var tryFunctionObject = function tryFunctionToStr(value) {
        try {
          if (isES6ClassFn(value)) {
            return false;
          }
          fnToStr.call(value);
          return true;
        } catch (e) {
          return false;
        }
      };
      var toStr = Object.prototype.toString;
      var objectClass = "[object Object]";
      var fnClass = "[object Function]";
      var genClass = "[object GeneratorFunction]";
      var ddaClass = "[object HTMLAllCollection]";
      var ddaClass2 = "[object HTML document.all class]";
      var ddaClass3 = "[object HTMLCollection]";
      var hasToStringTag = typeof Symbol === "function" && !!Symbol.toStringTag;
      var isIE68 = !(0 in [,]);
      var isDDA = function isDocumentDotAll() {
        return false;
      };
      if (typeof document === "object") {
        all = document.all;
        if (toStr.call(all) === toStr.call(document.all)) {
          isDDA = function isDocumentDotAll(value) {
            if ((isIE68 || !value) && (typeof value === "undefined" || typeof value === "object")) {
              try {
                var str = toStr.call(value);
                return (str === ddaClass || str === ddaClass2 || str === ddaClass3 || str === objectClass) && value("") == null;
              } catch (e) {
              }
            }
            return false;
          };
        }
      }
      var all;
      module.exports = reflectApply ? function isCallable(value) {
        if (isDDA(value)) {
          return true;
        }
        if (!value) {
          return false;
        }
        if (typeof value !== "function" && typeof value !== "object") {
          return false;
        }
        try {
          reflectApply(value, null, badArrayLike);
        } catch (e) {
          if (e !== isCallableMarker) {
            return false;
          }
        }
        return !isES6ClassFn(value) && tryFunctionObject(value);
      } : function isCallable(value) {
        if (isDDA(value)) {
          return true;
        }
        if (!value) {
          return false;
        }
        if (typeof value !== "function" && typeof value !== "object") {
          return false;
        }
        if (hasToStringTag) {
          return tryFunctionObject(value);
        }
        if (isES6ClassFn(value)) {
          return false;
        }
        var strClass = toStr.call(value);
        if (strClass !== fnClass && strClass !== genClass && !/^\[object HTML/.test(strClass)) {
          return false;
        }
        return tryFunctionObject(value);
      };
    }
  });

  // node_modules/for-each/index.js
  var require_for_each = __commonJS({
    "node_modules/for-each/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var isCallable = require_is_callable();
      var toStr = Object.prototype.toString;
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var forEachArray = function forEachArray2(array, iterator, receiver) {
        for (var i = 0, len = array.length; i < len; i++) {
          if (hasOwnProperty.call(array, i)) {
            if (receiver == null) {
              iterator(array[i], i, array);
            } else {
              iterator.call(receiver, array[i], i, array);
            }
          }
        }
      };
      var forEachString = function forEachString2(string, iterator, receiver) {
        for (var i = 0, len = string.length; i < len; i++) {
          if (receiver == null) {
            iterator(string.charAt(i), i, string);
          } else {
            iterator.call(receiver, string.charAt(i), i, string);
          }
        }
      };
      var forEachObject = function forEachObject2(object, iterator, receiver) {
        for (var k in object) {
          if (hasOwnProperty.call(object, k)) {
            if (receiver == null) {
              iterator(object[k], k, object);
            } else {
              iterator.call(receiver, object[k], k, object);
            }
          }
        }
      };
      var forEach = function forEach2(list, iterator, thisArg) {
        if (!isCallable(iterator)) {
          throw new TypeError("iterator must be a function");
        }
        var receiver;
        if (arguments.length >= 3) {
          receiver = thisArg;
        }
        if (toStr.call(list) === "[object Array]") {
          forEachArray(list, iterator, receiver);
        } else if (typeof list === "string") {
          forEachString(list, iterator, receiver);
        } else {
          forEachObject(list, iterator, receiver);
        }
      };
      module.exports = forEach;
    }
  });

  // node_modules/possible-typed-array-names/index.js
  var require_possible_typed_array_names = __commonJS({
    "node_modules/possible-typed-array-names/index.js"(exports, module) {
      "use strict";
      init_buffer();
      module.exports = [
        "Float32Array",
        "Float64Array",
        "Int8Array",
        "Int16Array",
        "Int32Array",
        "Uint8Array",
        "Uint8ClampedArray",
        "Uint16Array",
        "Uint32Array",
        "BigInt64Array",
        "BigUint64Array"
      ];
    }
  });

  // node_modules/available-typed-arrays/index.js
  var require_available_typed_arrays = __commonJS({
    "node_modules/available-typed-arrays/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var possibleNames = require_possible_typed_array_names();
      var g = typeof globalThis === "undefined" ? global : globalThis;
      module.exports = function availableTypedArrays() {
        var out = [];
        for (var i = 0; i < possibleNames.length; i++) {
          if (typeof g[possibleNames[i]] === "function") {
            out[out.length] = possibleNames[i];
          }
        }
        return out;
      };
    }
  });

  // node_modules/define-data-property/index.js
  var require_define_data_property = __commonJS({
    "node_modules/define-data-property/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var $defineProperty = require_es_define_property();
      var $SyntaxError = require_syntax();
      var $TypeError = require_type();
      var gopd = require_gopd();
      module.exports = function defineDataProperty(obj, property, value) {
        if (!obj || typeof obj !== "object" && typeof obj !== "function") {
          throw new $TypeError("`obj` must be an object or a function`");
        }
        if (typeof property !== "string" && typeof property !== "symbol") {
          throw new $TypeError("`property` must be a string or a symbol`");
        }
        if (arguments.length > 3 && typeof arguments[3] !== "boolean" && arguments[3] !== null) {
          throw new $TypeError("`nonEnumerable`, if provided, must be a boolean or null");
        }
        if (arguments.length > 4 && typeof arguments[4] !== "boolean" && arguments[4] !== null) {
          throw new $TypeError("`nonWritable`, if provided, must be a boolean or null");
        }
        if (arguments.length > 5 && typeof arguments[5] !== "boolean" && arguments[5] !== null) {
          throw new $TypeError("`nonConfigurable`, if provided, must be a boolean or null");
        }
        if (arguments.length > 6 && typeof arguments[6] !== "boolean") {
          throw new $TypeError("`loose`, if provided, must be a boolean");
        }
        var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
        var nonWritable = arguments.length > 4 ? arguments[4] : null;
        var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
        var loose = arguments.length > 6 ? arguments[6] : false;
        var desc = !!gopd && gopd(obj, property);
        if ($defineProperty) {
          $defineProperty(obj, property, {
            configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
            enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
            value,
            writable: nonWritable === null && desc ? desc.writable : !nonWritable
          });
        } else if (loose || !nonEnumerable && !nonWritable && !nonConfigurable) {
          obj[property] = value;
        } else {
          throw new $SyntaxError("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
        }
      };
    }
  });

  // node_modules/has-property-descriptors/index.js
  var require_has_property_descriptors = __commonJS({
    "node_modules/has-property-descriptors/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var $defineProperty = require_es_define_property();
      var hasPropertyDescriptors = function hasPropertyDescriptors2() {
        return !!$defineProperty;
      };
      hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
        if (!$defineProperty) {
          return null;
        }
        try {
          return $defineProperty([], "length", { value: 1 }).length !== 1;
        } catch (e) {
          return true;
        }
      };
      module.exports = hasPropertyDescriptors;
    }
  });

  // node_modules/set-function-length/index.js
  var require_set_function_length = __commonJS({
    "node_modules/set-function-length/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var GetIntrinsic = require_get_intrinsic();
      var define = require_define_data_property();
      var hasDescriptors = require_has_property_descriptors()();
      var gOPD = require_gopd();
      var $TypeError = require_type();
      var $floor = GetIntrinsic("%Math.floor%");
      module.exports = function setFunctionLength(fn, length) {
        if (typeof fn !== "function") {
          throw new $TypeError("`fn` is not a function");
        }
        if (typeof length !== "number" || length < 0 || length > 4294967295 || $floor(length) !== length) {
          throw new $TypeError("`length` must be a positive 32-bit integer");
        }
        var loose = arguments.length > 2 && !!arguments[2];
        var functionLengthIsConfigurable = true;
        var functionLengthIsWritable = true;
        if ("length" in fn && gOPD) {
          var desc = gOPD(fn, "length");
          if (desc && !desc.configurable) {
            functionLengthIsConfigurable = false;
          }
          if (desc && !desc.writable) {
            functionLengthIsWritable = false;
          }
        }
        if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
          if (hasDescriptors) {
            define(
              /** @type {Parameters<define>[0]} */
              fn,
              "length",
              length,
              true,
              true
            );
          } else {
            define(
              /** @type {Parameters<define>[0]} */
              fn,
              "length",
              length
            );
          }
        }
        return fn;
      };
    }
  });

  // node_modules/call-bind-apply-helpers/applyBind.js
  var require_applyBind = __commonJS({
    "node_modules/call-bind-apply-helpers/applyBind.js"(exports, module) {
      "use strict";
      init_buffer();
      var bind = require_function_bind();
      var $apply = require_functionApply();
      var actualApply = require_actualApply();
      module.exports = function applyBind() {
        return actualApply(bind, $apply, arguments);
      };
    }
  });

  // node_modules/call-bind/index.js
  var require_call_bind = __commonJS({
    "node_modules/call-bind/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var setFunctionLength = require_set_function_length();
      var $defineProperty = require_es_define_property();
      var callBindBasic = require_call_bind_apply_helpers();
      var applyBind = require_applyBind();
      module.exports = function callBind(originalFunction) {
        var func = callBindBasic(arguments);
        var adjustedLength = originalFunction.length - (arguments.length - 1);
        return setFunctionLength(
          func,
          1 + (adjustedLength > 0 ? adjustedLength : 0),
          true
        );
      };
      if ($defineProperty) {
        $defineProperty(module.exports, "apply", { value: applyBind });
      } else {
        module.exports.apply = applyBind;
      }
    }
  });

  // node_modules/which-typed-array/index.js
  var require_which_typed_array = __commonJS({
    "node_modules/which-typed-array/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var forEach = require_for_each();
      var availableTypedArrays = require_available_typed_arrays();
      var callBind = require_call_bind();
      var callBound = require_call_bound();
      var gOPD = require_gopd();
      var $toString = callBound("Object.prototype.toString");
      var hasToStringTag = require_shams2()();
      var g = typeof globalThis === "undefined" ? global : globalThis;
      var typedArrays = availableTypedArrays();
      var $slice = callBound("String.prototype.slice");
      var getPrototypeOf = Object.getPrototypeOf;
      var $indexOf = callBound("Array.prototype.indexOf", true) || function indexOf(array, value) {
        for (var i = 0; i < array.length; i += 1) {
          if (array[i] === value) {
            return i;
          }
        }
        return -1;
      };
      var cache = { __proto__: null };
      if (hasToStringTag && gOPD && getPrototypeOf) {
        forEach(typedArrays, function(typedArray) {
          var arr = new g[typedArray]();
          if (Symbol.toStringTag in arr) {
            var proto = getPrototypeOf(arr);
            var descriptor = gOPD(proto, Symbol.toStringTag);
            if (!descriptor) {
              var superProto = getPrototypeOf(proto);
              descriptor = gOPD(superProto, Symbol.toStringTag);
            }
            cache["$" + typedArray] = callBind(descriptor.get);
          }
        });
      } else {
        forEach(typedArrays, function(typedArray) {
          var arr = new g[typedArray]();
          var fn = arr.slice || arr.set;
          if (fn) {
            cache["$" + typedArray] = callBind(fn);
          }
        });
      }
      var tryTypedArrays = function tryAllTypedArrays(value) {
        var found = false;
        forEach(
          // eslint-disable-next-line no-extra-parens
          /** @type {Record<`\$${TypedArrayName}`, Getter>} */
          /** @type {any} */
          cache,
          /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
          function(getter, typedArray) {
            if (!found) {
              try {
                if ("$" + getter(value) === typedArray) {
                  found = $slice(typedArray, 1);
                }
              } catch (e) {
              }
            }
          }
        );
        return found;
      };
      var trySlices = function tryAllSlices(value) {
        var found = false;
        forEach(
          // eslint-disable-next-line no-extra-parens
          /** @type {Record<`\$${TypedArrayName}`, Getter>} */
          /** @type {any} */
          cache,
          /** @type {(getter: typeof cache, name: `\$${import('.').TypedArrayName}`) => void} */
          function(getter, name) {
            if (!found) {
              try {
                getter(value);
                found = $slice(name, 1);
              } catch (e) {
              }
            }
          }
        );
        return found;
      };
      module.exports = function whichTypedArray(value) {
        if (!value || typeof value !== "object") {
          return false;
        }
        if (!hasToStringTag) {
          var tag = $slice($toString(value), 8, -1);
          if ($indexOf(typedArrays, tag) > -1) {
            return tag;
          }
          if (tag !== "Object") {
            return false;
          }
          return trySlices(value);
        }
        if (!gOPD) {
          return null;
        }
        return tryTypedArrays(value);
      };
    }
  });

  // node_modules/is-typed-array/index.js
  var require_is_typed_array = __commonJS({
    "node_modules/is-typed-array/index.js"(exports, module) {
      "use strict";
      init_buffer();
      var whichTypedArray = require_which_typed_array();
      module.exports = function isTypedArray(value) {
        return !!whichTypedArray(value);
      };
    }
  });

  // node_modules/util/support/types.js
  var require_types = __commonJS({
    "node_modules/util/support/types.js"(exports) {
      "use strict";
      init_buffer();
      var isArgumentsObject = require_is_arguments();
      var isGeneratorFunction = require_is_generator_function();
      var whichTypedArray = require_which_typed_array();
      var isTypedArray = require_is_typed_array();
      function uncurryThis(f) {
        return f.call.bind(f);
      }
      var BigIntSupported = typeof BigInt !== "undefined";
      var SymbolSupported = typeof Symbol !== "undefined";
      var ObjectToString = uncurryThis(Object.prototype.toString);
      var numberValue = uncurryThis(Number.prototype.valueOf);
      var stringValue = uncurryThis(String.prototype.valueOf);
      var booleanValue = uncurryThis(Boolean.prototype.valueOf);
      if (BigIntSupported) {
        bigIntValue = uncurryThis(BigInt.prototype.valueOf);
      }
      var bigIntValue;
      if (SymbolSupported) {
        symbolValue = uncurryThis(Symbol.prototype.valueOf);
      }
      var symbolValue;
      function checkBoxedPrimitive(value, prototypeValueOf) {
        if (typeof value !== "object") {
          return false;
        }
        try {
          prototypeValueOf(value);
          return true;
        } catch (e) {
          return false;
        }
      }
      exports.isArgumentsObject = isArgumentsObject;
      exports.isGeneratorFunction = isGeneratorFunction;
      exports.isTypedArray = isTypedArray;
      function isPromise(input) {
        return typeof Promise !== "undefined" && input instanceof Promise || input !== null && typeof input === "object" && typeof input.then === "function" && typeof input.catch === "function";
      }
      exports.isPromise = isPromise;
      function isArrayBufferView(value) {
        if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
          return ArrayBuffer.isView(value);
        }
        return isTypedArray(value) || isDataView(value);
      }
      exports.isArrayBufferView = isArrayBufferView;
      function isUint8Array(value) {
        return whichTypedArray(value) === "Uint8Array";
      }
      exports.isUint8Array = isUint8Array;
      function isUint8ClampedArray(value) {
        return whichTypedArray(value) === "Uint8ClampedArray";
      }
      exports.isUint8ClampedArray = isUint8ClampedArray;
      function isUint16Array(value) {
        return whichTypedArray(value) === "Uint16Array";
      }
      exports.isUint16Array = isUint16Array;
      function isUint32Array(value) {
        return whichTypedArray(value) === "Uint32Array";
      }
      exports.isUint32Array = isUint32Array;
      function isInt8Array(value) {
        return whichTypedArray(value) === "Int8Array";
      }
      exports.isInt8Array = isInt8Array;
      function isInt16Array(value) {
        return whichTypedArray(value) === "Int16Array";
      }
      exports.isInt16Array = isInt16Array;
      function isInt32Array(value) {
        return whichTypedArray(value) === "Int32Array";
      }
      exports.isInt32Array = isInt32Array;
      function isFloat32Array(value) {
        return whichTypedArray(value) === "Float32Array";
      }
      exports.isFloat32Array = isFloat32Array;
      function isFloat64Array(value) {
        return whichTypedArray(value) === "Float64Array";
      }
      exports.isFloat64Array = isFloat64Array;
      function isBigInt64Array(value) {
        return whichTypedArray(value) === "BigInt64Array";
      }
      exports.isBigInt64Array = isBigInt64Array;
      function isBigUint64Array(value) {
        return whichTypedArray(value) === "BigUint64Array";
      }
      exports.isBigUint64Array = isBigUint64Array;
      function isMapToString(value) {
        return ObjectToString(value) === "[object Map]";
      }
      isMapToString.working = typeof Map !== "undefined" && isMapToString(/* @__PURE__ */ new Map());
      function isMap(value) {
        if (typeof Map === "undefined") {
          return false;
        }
        return isMapToString.working ? isMapToString(value) : value instanceof Map;
      }
      exports.isMap = isMap;
      function isSetToString(value) {
        return ObjectToString(value) === "[object Set]";
      }
      isSetToString.working = typeof Set !== "undefined" && isSetToString(/* @__PURE__ */ new Set());
      function isSet(value) {
        if (typeof Set === "undefined") {
          return false;
        }
        return isSetToString.working ? isSetToString(value) : value instanceof Set;
      }
      exports.isSet = isSet;
      function isWeakMapToString(value) {
        return ObjectToString(value) === "[object WeakMap]";
      }
      isWeakMapToString.working = typeof WeakMap !== "undefined" && isWeakMapToString(/* @__PURE__ */ new WeakMap());
      function isWeakMap(value) {
        if (typeof WeakMap === "undefined") {
          return false;
        }
        return isWeakMapToString.working ? isWeakMapToString(value) : value instanceof WeakMap;
      }
      exports.isWeakMap = isWeakMap;
      function isWeakSetToString(value) {
        return ObjectToString(value) === "[object WeakSet]";
      }
      isWeakSetToString.working = typeof WeakSet !== "undefined" && isWeakSetToString(/* @__PURE__ */ new WeakSet());
      function isWeakSet(value) {
        return isWeakSetToString(value);
      }
      exports.isWeakSet = isWeakSet;
      function isArrayBufferToString(value) {
        return ObjectToString(value) === "[object ArrayBuffer]";
      }
      isArrayBufferToString.working = typeof ArrayBuffer !== "undefined" && isArrayBufferToString(new ArrayBuffer());
      function isArrayBuffer(value) {
        if (typeof ArrayBuffer === "undefined") {
          return false;
        }
        return isArrayBufferToString.working ? isArrayBufferToString(value) : value instanceof ArrayBuffer;
      }
      exports.isArrayBuffer = isArrayBuffer;
      function isDataViewToString(value) {
        return ObjectToString(value) === "[object DataView]";
      }
      isDataViewToString.working = typeof ArrayBuffer !== "undefined" && typeof DataView !== "undefined" && isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1));
      function isDataView(value) {
        if (typeof DataView === "undefined") {
          return false;
        }
        return isDataViewToString.working ? isDataViewToString(value) : value instanceof DataView;
      }
      exports.isDataView = isDataView;
      var SharedArrayBufferCopy = typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : void 0;
      function isSharedArrayBufferToString(value) {
        return ObjectToString(value) === "[object SharedArrayBuffer]";
      }
      function isSharedArrayBuffer(value) {
        if (typeof SharedArrayBufferCopy === "undefined") {
          return false;
        }
        if (typeof isSharedArrayBufferToString.working === "undefined") {
          isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
        }
        return isSharedArrayBufferToString.working ? isSharedArrayBufferToString(value) : value instanceof SharedArrayBufferCopy;
      }
      exports.isSharedArrayBuffer = isSharedArrayBuffer;
      function isAsyncFunction(value) {
        return ObjectToString(value) === "[object AsyncFunction]";
      }
      exports.isAsyncFunction = isAsyncFunction;
      function isMapIterator(value) {
        return ObjectToString(value) === "[object Map Iterator]";
      }
      exports.isMapIterator = isMapIterator;
      function isSetIterator(value) {
        return ObjectToString(value) === "[object Set Iterator]";
      }
      exports.isSetIterator = isSetIterator;
      function isGeneratorObject(value) {
        return ObjectToString(value) === "[object Generator]";
      }
      exports.isGeneratorObject = isGeneratorObject;
      function isWebAssemblyCompiledModule(value) {
        return ObjectToString(value) === "[object WebAssembly.Module]";
      }
      exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;
      function isNumberObject(value) {
        return checkBoxedPrimitive(value, numberValue);
      }
      exports.isNumberObject = isNumberObject;
      function isStringObject(value) {
        return checkBoxedPrimitive(value, stringValue);
      }
      exports.isStringObject = isStringObject;
      function isBooleanObject(value) {
        return checkBoxedPrimitive(value, booleanValue);
      }
      exports.isBooleanObject = isBooleanObject;
      function isBigIntObject(value) {
        return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
      }
      exports.isBigIntObject = isBigIntObject;
      function isSymbolObject(value) {
        return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
      }
      exports.isSymbolObject = isSymbolObject;
      function isBoxedPrimitive(value) {
        return isNumberObject(value) || isStringObject(value) || isBooleanObject(value) || isBigIntObject(value) || isSymbolObject(value);
      }
      exports.isBoxedPrimitive = isBoxedPrimitive;
      function isAnyArrayBuffer(value) {
        return typeof Uint8Array !== "undefined" && (isArrayBuffer(value) || isSharedArrayBuffer(value));
      }
      exports.isAnyArrayBuffer = isAnyArrayBuffer;
      ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function(method) {
        Object.defineProperty(exports, method, {
          enumerable: false,
          value: function() {
            throw new Error(method + " is not supported in userland");
          }
        });
      });
    }
  });

  // node_modules/util/support/isBufferBrowser.js
  var require_isBufferBrowser = __commonJS({
    "node_modules/util/support/isBufferBrowser.js"(exports, module) {
      init_buffer();
      module.exports = function isBuffer(arg) {
        return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function";
      };
    }
  });

  // node_modules/inherits/inherits_browser.js
  var require_inherits_browser = __commonJS({
    "node_modules/inherits/inherits_browser.js"(exports, module) {
      init_buffer();
      if (typeof Object.create === "function") {
        module.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
              constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
              }
            });
          }
        };
      } else {
        module.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            var TempCtor = function() {
            };
            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor();
            ctor.prototype.constructor = ctor;
          }
        };
      }
    }
  });

  // node_modules/util/util.js
  var require_util = __commonJS({
    "node_modules/util/util.js"(exports) {
      init_buffer();
      var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors2(obj) {
        var keys = Object.keys(obj);
        var descriptors = {};
        for (var i = 0; i < keys.length; i++) {
          descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
        }
        return descriptors;
      };
      var formatRegExp = /%[sdj%]/g;
      exports.format = function(f) {
        if (!isString(f)) {
          var objects = [];
          for (var i = 0; i < arguments.length; i++) {
            objects.push(inspect(arguments[i]));
          }
          return objects.join(" ");
        }
        var i = 1;
        var args = arguments;
        var len = args.length;
        var str = String(f).replace(formatRegExp, function(x2) {
          if (x2 === "%%") return "%";
          if (i >= len) return x2;
          switch (x2) {
            case "%s":
              return String(args[i++]);
            case "%d":
              return Number(args[i++]);
            case "%j":
              try {
                return JSON.stringify(args[i++]);
              } catch (_) {
                return "[Circular]";
              }
            default:
              return x2;
          }
        });
        for (var x = args[i]; i < len; x = args[++i]) {
          if (isNull(x) || !isObject(x)) {
            str += " " + x;
          } else {
            str += " " + inspect(x);
          }
        }
        return str;
      };
      exports.deprecate = function(fn, msg) {
        if (typeof process !== "undefined" && process.noDeprecation === true) {
          return fn;
        }
        if (typeof process === "undefined") {
          return function() {
            return exports.deprecate(fn, msg).apply(this, arguments);
          };
        }
        var warned = false;
        function deprecated() {
          if (!warned) {
            if (process.throwDeprecation) {
              throw new Error(msg);
            } else if (process.traceDeprecation) {
              console.trace(msg);
            } else {
              console.error(msg);
            }
            warned = true;
          }
          return fn.apply(this, arguments);
        }
        return deprecated;
      };
      var debugs = {};
      var debugEnvRegex = /^$/;
      if (process.env.NODE_DEBUG) {
        debugEnv = process.env.NODE_DEBUG;
        debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase();
        debugEnvRegex = new RegExp("^" + debugEnv + "$", "i");
      }
      var debugEnv;
      exports.debuglog = function(set) {
        set = set.toUpperCase();
        if (!debugs[set]) {
          if (debugEnvRegex.test(set)) {
            var pid = process.pid;
            debugs[set] = function() {
              var msg = exports.format.apply(exports, arguments);
              console.error("%s %d: %s", set, pid, msg);
            };
          } else {
            debugs[set] = function() {
            };
          }
        }
        return debugs[set];
      };
      function inspect(obj, opts) {
        var ctx = {
          seen: [],
          stylize: stylizeNoColor
        };
        if (arguments.length >= 3) ctx.depth = arguments[2];
        if (arguments.length >= 4) ctx.colors = arguments[3];
        if (isBoolean(opts)) {
          ctx.showHidden = opts;
        } else if (opts) {
          exports._extend(ctx, opts);
        }
        if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
        if (isUndefined(ctx.depth)) ctx.depth = 2;
        if (isUndefined(ctx.colors)) ctx.colors = false;
        if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
        if (ctx.colors) ctx.stylize = stylizeWithColor;
        return formatValue(ctx, obj, ctx.depth);
      }
      exports.inspect = inspect;
      inspect.colors = {
        "bold": [1, 22],
        "italic": [3, 23],
        "underline": [4, 24],
        "inverse": [7, 27],
        "white": [37, 39],
        "grey": [90, 39],
        "black": [30, 39],
        "blue": [34, 39],
        "cyan": [36, 39],
        "green": [32, 39],
        "magenta": [35, 39],
        "red": [31, 39],
        "yellow": [33, 39]
      };
      inspect.styles = {
        "special": "cyan",
        "number": "yellow",
        "boolean": "yellow",
        "undefined": "grey",
        "null": "bold",
        "string": "green",
        "date": "magenta",
        // "name": intentionally not styling
        "regexp": "red"
      };
      function stylizeWithColor(str, styleType) {
        var style = inspect.styles[styleType];
        if (style) {
          return "\x1B[" + inspect.colors[style][0] + "m" + str + "\x1B[" + inspect.colors[style][1] + "m";
        } else {
          return str;
        }
      }
      function stylizeNoColor(str, styleType) {
        return str;
      }
      function arrayToHash(array) {
        var hash = {};
        array.forEach(function(val, idx) {
          hash[val] = true;
        });
        return hash;
      }
      function formatValue(ctx, value, recurseTimes) {
        if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
        value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
          var ret = value.inspect(recurseTimes, ctx);
          if (!isString(ret)) {
            ret = formatValue(ctx, ret, recurseTimes);
          }
          return ret;
        }
        var primitive = formatPrimitive(ctx, value);
        if (primitive) {
          return primitive;
        }
        var keys = Object.keys(value);
        var visibleKeys = arrayToHash(keys);
        if (ctx.showHidden) {
          keys = Object.getOwnPropertyNames(value);
        }
        if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
          return formatError(value);
        }
        if (keys.length === 0) {
          if (isFunction(value)) {
            var name = value.name ? ": " + value.name : "";
            return ctx.stylize("[Function" + name + "]", "special");
          }
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
          }
          if (isDate(value)) {
            return ctx.stylize(Date.prototype.toString.call(value), "date");
          }
          if (isError(value)) {
            return formatError(value);
          }
        }
        var base = "", array = false, braces = ["{", "}"];
        if (isArray(value)) {
          array = true;
          braces = ["[", "]"];
        }
        if (isFunction(value)) {
          var n = value.name ? ": " + value.name : "";
          base = " [Function" + n + "]";
        }
        if (isRegExp(value)) {
          base = " " + RegExp.prototype.toString.call(value);
        }
        if (isDate(value)) {
          base = " " + Date.prototype.toUTCString.call(value);
        }
        if (isError(value)) {
          base = " " + formatError(value);
        }
        if (keys.length === 0 && (!array || value.length == 0)) {
          return braces[0] + base + braces[1];
        }
        if (recurseTimes < 0) {
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
          } else {
            return ctx.stylize("[Object]", "special");
          }
        }
        ctx.seen.push(value);
        var output;
        if (array) {
          output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
        } else {
          output = keys.map(function(key) {
            return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
          });
        }
        ctx.seen.pop();
        return reduceToSingleString(output, base, braces);
      }
      function formatPrimitive(ctx, value) {
        if (isUndefined(value))
          return ctx.stylize("undefined", "undefined");
        if (isString(value)) {
          var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
          return ctx.stylize(simple, "string");
        }
        if (isNumber(value))
          return ctx.stylize("" + value, "number");
        if (isBoolean(value))
          return ctx.stylize("" + value, "boolean");
        if (isNull(value))
          return ctx.stylize("null", "null");
      }
      function formatError(value) {
        return "[" + Error.prototype.toString.call(value) + "]";
      }
      function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
        var output = [];
        for (var i = 0, l = value.length; i < l; ++i) {
          if (hasOwnProperty(value, String(i))) {
            output.push(formatProperty(
              ctx,
              value,
              recurseTimes,
              visibleKeys,
              String(i),
              true
            ));
          } else {
            output.push("");
          }
        }
        keys.forEach(function(key) {
          if (!key.match(/^\d+$/)) {
            output.push(formatProperty(
              ctx,
              value,
              recurseTimes,
              visibleKeys,
              key,
              true
            ));
          }
        });
        return output;
      }
      function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
        var name, str, desc;
        desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
        if (desc.get) {
          if (desc.set) {
            str = ctx.stylize("[Getter/Setter]", "special");
          } else {
            str = ctx.stylize("[Getter]", "special");
          }
        } else {
          if (desc.set) {
            str = ctx.stylize("[Setter]", "special");
          }
        }
        if (!hasOwnProperty(visibleKeys, key)) {
          name = "[" + key + "]";
        }
        if (!str) {
          if (ctx.seen.indexOf(desc.value) < 0) {
            if (isNull(recurseTimes)) {
              str = formatValue(ctx, desc.value, null);
            } else {
              str = formatValue(ctx, desc.value, recurseTimes - 1);
            }
            if (str.indexOf("\n") > -1) {
              if (array) {
                str = str.split("\n").map(function(line) {
                  return "  " + line;
                }).join("\n").slice(2);
              } else {
                str = "\n" + str.split("\n").map(function(line) {
                  return "   " + line;
                }).join("\n");
              }
            }
          } else {
            str = ctx.stylize("[Circular]", "special");
          }
        }
        if (isUndefined(name)) {
          if (array && key.match(/^\d+$/)) {
            return str;
          }
          name = JSON.stringify("" + key);
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.slice(1, -1);
            name = ctx.stylize(name, "name");
          } else {
            name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
            name = ctx.stylize(name, "string");
          }
        }
        return name + ": " + str;
      }
      function reduceToSingleString(output, base, braces) {
        var numLinesEst = 0;
        var length = output.reduce(function(prev, cur) {
          numLinesEst++;
          if (cur.indexOf("\n") >= 0) numLinesEst++;
          return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
        }, 0);
        if (length > 60) {
          return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
        }
        return braces[0] + base + " " + output.join(", ") + " " + braces[1];
      }
      exports.types = require_types();
      function isArray(ar) {
        return Array.isArray(ar);
      }
      exports.isArray = isArray;
      function isBoolean(arg) {
        return typeof arg === "boolean";
      }
      exports.isBoolean = isBoolean;
      function isNull(arg) {
        return arg === null;
      }
      exports.isNull = isNull;
      function isNullOrUndefined(arg) {
        return arg == null;
      }
      exports.isNullOrUndefined = isNullOrUndefined;
      function isNumber(arg) {
        return typeof arg === "number";
      }
      exports.isNumber = isNumber;
      function isString(arg) {
        return typeof arg === "string";
      }
      exports.isString = isString;
      function isSymbol(arg) {
        return typeof arg === "symbol";
      }
      exports.isSymbol = isSymbol;
      function isUndefined(arg) {
        return arg === void 0;
      }
      exports.isUndefined = isUndefined;
      function isRegExp(re) {
        return isObject(re) && objectToString(re) === "[object RegExp]";
      }
      exports.isRegExp = isRegExp;
      exports.types.isRegExp = isRegExp;
      function isObject(arg) {
        return typeof arg === "object" && arg !== null;
      }
      exports.isObject = isObject;
      function isDate(d) {
        return isObject(d) && objectToString(d) === "[object Date]";
      }
      exports.isDate = isDate;
      exports.types.isDate = isDate;
      function isError(e) {
        return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
      }
      exports.isError = isError;
      exports.types.isNativeError = isError;
      function isFunction(arg) {
        return typeof arg === "function";
      }
      exports.isFunction = isFunction;
      function isPrimitive(arg) {
        return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || // ES6 symbol
        typeof arg === "undefined";
      }
      exports.isPrimitive = isPrimitive;
      exports.isBuffer = require_isBufferBrowser();
      function objectToString(o) {
        return Object.prototype.toString.call(o);
      }
      function pad(n) {
        return n < 10 ? "0" + n.toString(10) : n.toString(10);
      }
      var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      function timestamp() {
        var d = /* @__PURE__ */ new Date();
        var time = [
          pad(d.getHours()),
          pad(d.getMinutes()),
          pad(d.getSeconds())
        ].join(":");
        return [d.getDate(), months[d.getMonth()], time].join(" ");
      }
      exports.log = function() {
        console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments));
      };
      exports.inherits = require_inherits_browser();
      exports._extend = function(origin, add) {
        if (!add || !isObject(add)) return origin;
        var keys = Object.keys(add);
        var i = keys.length;
        while (i--) {
          origin[keys[i]] = add[keys[i]];
        }
        return origin;
      };
      function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
      }
      var kCustomPromisifiedSymbol = typeof Symbol !== "undefined" ? Symbol("util.promisify.custom") : void 0;
      exports.promisify = function promisify2(original) {
        if (typeof original !== "function")
          throw new TypeError('The "original" argument must be of type Function');
        if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
          var fn = original[kCustomPromisifiedSymbol];
          if (typeof fn !== "function") {
            throw new TypeError('The "util.promisify.custom" argument must be of type Function');
          }
          Object.defineProperty(fn, kCustomPromisifiedSymbol, {
            value: fn,
            enumerable: false,
            writable: false,
            configurable: true
          });
          return fn;
        }
        function fn() {
          var promiseResolve, promiseReject;
          var promise = new Promise(function(resolve, reject) {
            promiseResolve = resolve;
            promiseReject = reject;
          });
          var args = [];
          for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
          }
          args.push(function(err, value) {
            if (err) {
              promiseReject(err);
            } else {
              promiseResolve(value);
            }
          });
          try {
            original.apply(this, args);
          } catch (err) {
            promiseReject(err);
          }
          return promise;
        }
        Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
        if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
          value: fn,
          enumerable: false,
          writable: false,
          configurable: true
        });
        return Object.defineProperties(
          fn,
          getOwnPropertyDescriptors(original)
        );
      };
      exports.promisify.custom = kCustomPromisifiedSymbol;
      function callbackifyOnRejected(reason, cb) {
        if (!reason) {
          var newReason = new Error("Promise was rejected with a falsy value");
          newReason.reason = reason;
          reason = newReason;
        }
        return cb(reason);
      }
      function callbackify(original) {
        if (typeof original !== "function") {
          throw new TypeError('The "original" argument must be of type Function');
        }
        function callbackified() {
          var args = [];
          for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
          }
          var maybeCb = args.pop();
          if (typeof maybeCb !== "function") {
            throw new TypeError("The last argument must be of type Function");
          }
          var self = this;
          var cb = function() {
            return maybeCb.apply(self, arguments);
          };
          original.apply(this, args).then(
            function(ret) {
              process.nextTick(cb.bind(null, null, ret));
            },
            function(rej) {
              process.nextTick(callbackifyOnRejected.bind(null, rej, cb));
            }
          );
        }
        Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
        Object.defineProperties(
          callbackified,
          getOwnPropertyDescriptors(original)
        );
        return callbackified;
      }
      exports.callbackify = callbackify;
    }
  });

  // src/MangaDex/main.ts
  var main_exports = {};
  __export(main_exports, {
    MangaDex: () => MangaDex,
    MangaDexExtension: () => MangaDexExtension
  });
  init_buffer();
  var import_types3 = __toESM(require_lib());

  // src/MangaDex/utils/url-builder/base.ts
  init_buffer();
  var URLBuilder = class {
    constructor(baseUrl) {
      this.queryParams = {};
      this.pathSegments = [];
      this.baseUrl = baseUrl.replace(/\/+$/, "");
    }
    formatArrayQuery(key, value) {
      return value.length > 0 ? value.map((v) => `${key}[]=${v}`) : [];
    }
    formatObjectQuery(key, value) {
      return Object.entries(value).map(
        ([objKey, objValue]) => objValue !== void 0 ? `${key}[${objKey}]=${objValue}` : void 0
      ).filter((x) => x !== void 0);
    }
    formatQuery(queryParams) {
      return Object.entries(queryParams).flatMap(([key, value]) => {
        if (Array.isArray(value)) {
          return this.formatArrayQuery(key, value);
        }
        if (typeof value === "object") {
          return this.formatObjectQuery(key, value);
        }
        return value === "" ? [] : [`${key}=${value}`];
      }).join("&");
    }
    build() {
      const fullPath = this.pathSegments.length > 0 ? `/${this.pathSegments.join("/")}` : "";
      const queryString = this.formatQuery(this.queryParams);
      if (queryString.length > 0)
        return `${this.baseUrl}${fullPath}?${queryString}`;
      return `${this.baseUrl}${fullPath}`;
    }
    addPath(segment) {
      this.pathSegments.push(segment.replace(/^\/+|\/+$/g, ""));
      return this;
    }
    addQuery(key, value) {
      this.queryParams[key] = value;
      return this;
    }
    reset() {
      this.queryParams = {};
      this.pathSegments = [];
      return this;
    }
  };

  // src/MangaDex/external/tag.json
  var tag_default = [
    {
      result: "ok",
      data: {
        id: "0234a31e-a729-4e28-9d6a-3f87c4966b9e",
        type: "tag",
        attributes: {
          name: { en: "Oneshot" },
          description: [],
          group: "format",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "07251805-a27e-4d59-b488-f0bfbec15168",
        type: "tag",
        attributes: {
          name: { en: "Thriller" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "0a39b5a1-b235-4886-a747-1d05d216532d",
        type: "tag",
        attributes: {
          name: { en: "Award Winning" },
          description: [],
          group: "format",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "0bc90acb-ccc1-44ca-a34a-b9f3a73259d0",
        type: "tag",
        attributes: {
          name: { en: "Reincarnation" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "256c8bd9-4904-4360-bf4f-508a76d67183",
        type: "tag",
        attributes: {
          name: { en: "Sci-Fi" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "292e862b-2d17-4062-90a2-0356caa4ae27",
        type: "tag",
        attributes: {
          name: { en: "Time Travel" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "2bd2e8d0-f146-434a-9b51-fc9ff2c5fe6a",
        type: "tag",
        attributes: {
          name: { en: "Genderswap" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "2d1f5d56-a1e5-4d0d-a961-2193588b08ec",
        type: "tag",
        attributes: {
          name: { en: "Loli" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "31932a7e-5b8e-49a6-9f12-2afa39dc544c",
        type: "tag",
        attributes: {
          name: { en: "Traditional Games" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "320831a8-4026-470b-94f6-8353740e6f04",
        type: "tag",
        attributes: {
          name: { en: "Official Colored" },
          description: [],
          group: "format",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "33771934-028e-4cb3-8744-691e866a923e",
        type: "tag",
        attributes: {
          name: { en: "Historical" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "36fd93ea-e8b8-445e-b836-358f02b3d33d",
        type: "tag",
        attributes: {
          name: { en: "Monsters" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "391b0423-d847-456f-aff0-8b0cfc03066b",
        type: "tag",
        attributes: {
          name: { en: "Action" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "39730448-9a5f-48a2-85b0-a70db87b1233",
        type: "tag",
        attributes: {
          name: { en: "Demons" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "3b60b75c-a2d7-4860-ab56-05f391bb889c",
        type: "tag",
        attributes: {
          name: { en: "Psychological" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "3bb26d85-09d5-4d2e-880c-c34b974339e9",
        type: "tag",
        attributes: {
          name: { en: "Ghosts" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "3de8c75d-8ee3-48ff-98ee-e20a65c86451",
        type: "tag",
        attributes: {
          name: { en: "Animals" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "3e2b8dae-350e-4ab8-a8ce-016e844b9f0d",
        type: "tag",
        attributes: {
          name: { en: "Long Strip" },
          description: [],
          group: "format",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "423e2eae-a7a2-4a8b-ac03-a8351462d71d",
        type: "tag",
        attributes: {
          name: { en: "Romance" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "489dd859-9b61-4c37-af75-5b18e88daafc",
        type: "tag",
        attributes: {
          name: { en: "Ninja" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "4d32cc48-9f00-4cca-9b5a-a839f0764984",
        type: "tag",
        attributes: {
          name: { en: "Comedy" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "50880a9d-5440-4732-9afb-8f457127e836",
        type: "tag",
        attributes: {
          name: { en: "Mecha" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "51d83883-4103-437c-b4b1-731cb73d786c",
        type: "tag",
        attributes: {
          name: { en: "Anthology" },
          description: [],
          group: "format",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "5920b825-4181-4a17-beeb-9918b0ff7a30",
        type: "tag",
        attributes: {
          name: { en: "Boys' Love" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "5bd0e105-4481-44ca-b6e7-7544da56b1a3",
        type: "tag",
        attributes: {
          name: { en: "Incest" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "5ca48985-9a9d-4bd8-be29-80dc0303db72",
        type: "tag",
        attributes: {
          name: { en: "Crime" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "5fff9cde-849c-4d78-aab0-0d52b2ee1d25",
        type: "tag",
        attributes: {
          name: { en: "Survival" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "631ef465-9aba-4afb-b0fc-ea10efe274a8",
        type: "tag",
        attributes: {
          name: { en: "Zombies" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "65761a2a-415e-47f3-bef2-a9dababba7a6",
        type: "tag",
        attributes: {
          name: { en: "Reverse Harem" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "69964a64-2f90-4d33-beeb-f3ed2875eb4c",
        type: "tag",
        attributes: {
          name: { en: "Sports" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "7064a261-a137-4d3a-8848-2d385de3a99c",
        type: "tag",
        attributes: {
          name: { en: "Superhero" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "799c202e-7daa-44eb-9cf7-8a3c0441531e",
        type: "tag",
        attributes: {
          name: { en: "Martial Arts" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "7b2ce280-79ef-4c09-9b58-12b7c23a9b78",
        type: "tag",
        attributes: {
          name: { en: "Fan Colored" },
          description: [],
          group: "format",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "81183756-1453-4c81-aa9e-f6e1b63be016",
        type: "tag",
        attributes: {
          name: { en: "Samurai" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "81c836c9-914a-4eca-981a-560dad663e73",
        type: "tag",
        attributes: {
          name: { en: "Magical Girls" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "85daba54-a71c-4554-8a28-9901a8b0afad",
        type: "tag",
        attributes: {
          name: { en: "Mafia" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "87cc87cd-a395-47af-b27a-93258283bbc6",
        type: "tag",
        attributes: {
          name: { en: "Adventure" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "891cf039-b895-47f0-9229-bef4c96eccd4",
        type: "tag",
        attributes: {
          name: { en: "User Created" },
          description: [],
          group: "format",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "8c86611e-fab7-4986-9dec-d1a2f44acdd5",
        type: "tag",
        attributes: {
          name: { en: "Virtual Reality" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "92d6d951-ca5e-429c-ac78-451071cbf064",
        type: "tag",
        attributes: {
          name: { en: "Office Workers" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "9438db5a-7e2a-4ac0-b39e-e0d95a34b8a8",
        type: "tag",
        attributes: {
          name: { en: "Video Games" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "9467335a-1b83-4497-9231-765337a00b96",
        type: "tag",
        attributes: {
          name: { en: "Post-Apocalyptic" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "97893a4c-12af-4dac-b6be-0dffb353568e",
        type: "tag",
        attributes: {
          name: { en: "Sexual Violence" },
          description: [],
          group: "content",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "9ab53f92-3eed-4e9b-903a-917c86035ee3",
        type: "tag",
        attributes: {
          name: { en: "Crossdressing" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "a1f53773-c69a-4ce5-8cab-fffcd90b1565",
        type: "tag",
        attributes: {
          name: { en: "Magic" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "a3c67850-4684-404e-9b7f-c69850ee5da6",
        type: "tag",
        attributes: {
          name: { en: "Girls' Love" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "aafb99c1-7f60-43fa-b75f-fc9502ce29c7",
        type: "tag",
        attributes: {
          name: { en: "Harem" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "ac72833b-c4e9-4878-b9db-6c8a4a99444a",
        type: "tag",
        attributes: {
          name: { en: "Military" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "acc803a4-c95a-4c22-86fc-eb6b582d82a2",
        type: "tag",
        attributes: {
          name: { en: "Wuxia" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "ace04997-f6bd-436e-b261-779182193d3d",
        type: "tag",
        attributes: {
          name: { en: "Isekai" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "b11fda93-8f1d-4bef-b2ed-8803d3733170",
        type: "tag",
        attributes: {
          name: { en: "4-Koma" },
          description: [],
          group: "format",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "b13b2a48-c720-44a9-9c77-39c9979373fb",
        type: "tag",
        attributes: {
          name: { en: "Doujinshi" },
          description: [],
          group: "format",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "b1e97889-25b4-4258-b28b-cd7f4d28ea9b",
        type: "tag",
        attributes: {
          name: { en: "Philosophical" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "b29d6a3d-1569-4e7a-8caf-7557bc92cd5d",
        type: "tag",
        attributes: {
          name: { en: "Gore" },
          description: [],
          group: "content",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "b9af3a63-f058-46de-a9a0-e0c13906197a",
        type: "tag",
        attributes: {
          name: { en: "Drama" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "c8cbe35b-1b2b-4a3f-9c37-db84c4514856",
        type: "tag",
        attributes: {
          name: { en: "Medical" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "caaa44eb-cd40-4177-b930-79d3ef2afe87",
        type: "tag",
        attributes: {
          name: { en: "School Life" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "cdad7e68-1419-41dd-bdce-27753074a640",
        type: "tag",
        attributes: {
          name: { en: "Horror" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "cdc58593-87dd-415e-bbc0-2ec27bf404cc",
        type: "tag",
        attributes: {
          name: { en: "Fantasy" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "d14322ac-4d6f-4e9b-afd9-629d5f4d8a41",
        type: "tag",
        attributes: {
          name: { en: "Villainess" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "d7d1730f-6eb0-4ba6-9437-602cac38664c",
        type: "tag",
        attributes: {
          name: { en: "Vampires" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "da2d50ca-3018-4cc0-ac7a-6b7d472a29ea",
        type: "tag",
        attributes: {
          name: { en: "Delinquents" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "dd1f77c5-dea9-4e2b-97ae-224af09caf99",
        type: "tag",
        attributes: {
          name: { en: "Monster Girls" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "ddefd648-5140-4e5f-ba18-4eca4071d19b",
        type: "tag",
        attributes: {
          name: { en: "Shota" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "df33b754-73a3-4c54-80e6-1a74a8058539",
        type: "tag",
        attributes: {
          name: { en: "Police" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "e197df38-d0e7-43b5-9b09-2842d0c326dd",
        type: "tag",
        attributes: {
          name: { en: "Web Comic" },
          description: [],
          group: "format",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "e5301a23-ebd9-49dd-a0cb-2add944c7fe9",
        type: "tag",
        attributes: {
          name: { en: "Slice of Life" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "e64f6742-c834-471d-8d72-dd51fc02b835",
        type: "tag",
        attributes: {
          name: { en: "Aliens" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "ea2bc92d-1c26-4930-9b7c-d5c0dc1b6869",
        type: "tag",
        attributes: {
          name: { en: "Cooking" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "eabc5b4c-6aff-42f3-b657-3e90cbd00b75",
        type: "tag",
        attributes: {
          name: { en: "Supernatural" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "ee968100-4191-4968-93d3-f82d72be7e46",
        type: "tag",
        attributes: {
          name: { en: "Mystery" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "f4122d1c-3b44-44d0-9936-ff7502c39ad3",
        type: "tag",
        attributes: {
          name: { en: "Adaptation" },
          description: [],
          group: "format",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "f42fbf9e-188a-447b-9fdc-f19dc1e4d685",
        type: "tag",
        attributes: {
          name: { en: "Music" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "f5ba408b-0e7a-484d-8d49-4e9125ac96de",
        type: "tag",
        attributes: {
          name: { en: "Full Color" },
          description: [],
          group: "format",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "f8f62932-27da-4fe4-8ee1-6779a8c5edba",
        type: "tag",
        attributes: {
          name: { en: "Tragedy" },
          description: [],
          group: "genre",
          version: 1
        }
      },
      relationships: []
    },
    {
      result: "ok",
      data: {
        id: "fad12b5e-68ba-460e-b933-9ae8318f5b65",
        type: "tag",
        attributes: {
          name: { en: "Gyaru" },
          description: [],
          group: "theme",
          version: 1
        }
      },
      relationships: []
    }
  ];

  // src/MangaDex/MangaDexHelper.ts
  init_buffer();
  var MDLanguagesClass = class {
    constructor() {
      this.Languages = [
        {
          // Arabic
          name: "\u0627\u064E\u0644\u0652\u0639\u064E\u0631\u064E\u0628\u0650\u064A\u064E\u0651\u0629\u064F",
          MDCode: "ar",
          flagCode: "\u{1F1E6}\u{1F1EA}"
        },
        {
          // Bulgarian
          name: "\u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438",
          MDCode: "bg",
          flagCode: "\u{1F1E7}\u{1F1EC}"
        },
        {
          // Bengali
          name: "\u09AC\u09BE\u0982\u09B2\u09BE",
          MDCode: "bn",
          flagCode: "\u{1F1E7}\u{1F1E9}"
        },
        {
          // Catalan
          name: "Catal\xE0",
          MDCode: "ca",
          flagCode: "\u{1F1EA}\u{1F1F8}"
        },
        {
          // Czech
          name: "\u010Ce\u0161tina",
          MDCode: "cs",
          flagCode: "\u{1F1E8}\u{1F1FF}"
        },
        {
          // Danish
          name: "Dansk",
          MDCode: "da",
          flagCode: "\u{1F1E9}\u{1F1F0}"
        },
        {
          // German
          name: "Deutsch",
          MDCode: "de",
          flagCode: "\u{1F1E9}\u{1F1EA}"
        },
        {
          // English
          name: "English",
          MDCode: "en",
          flagCode: "\u{1F1EC}\u{1F1E7}",
          default: true
        },
        {
          // Spanish
          name: "Espa\xF1ol",
          MDCode: "es",
          flagCode: "\u{1F1EA}\u{1F1F8}"
        },
        {
          // Spanish (Latin American)
          name: "Espa\xF1ol (Latinoam\xE9rica)",
          MDCode: "es-la",
          flagCode: "\u{1F1EA}\u{1F1F8}"
        },
        {
          // Farsi
          name: "\u0641\u0627\u0631\u0633\u06CC",
          MDCode: "fa",
          flagCode: "\u{1F1EE}\u{1F1F7}"
        },
        {
          // Finnish
          name: "Suomi",
          MDCode: "fi",
          flagCode: "\u{1F1EB}\u{1F1EE}"
        },
        {
          // French
          name: "Fran\xE7ais",
          MDCode: "fr",
          flagCode: "\u{1F1EB}\u{1F1F7}"
        },
        {
          // Hebrew
          name: "\u05E2\u05B4\u05D1\u05B0\u05E8\u05B4\u05D9\u05EA",
          MDCode: "he",
          flagCode: "\u{1F1EE}\u{1F1F1}"
        },
        {
          // Hindi
          name: "\u0939\u093F\u0928\u094D\u0926\u0940",
          MDCode: "hi",
          flagCode: "\u{1F1EE}\u{1F1F3}"
        },
        {
          // Hungarian
          name: "Magyar",
          MDCode: "hu",
          flagCode: "\u{1F1ED}\u{1F1FA}"
        },
        {
          // Indonesian
          name: "Indonesia",
          MDCode: "id",
          flagCode: "\u{1F1EE}\u{1F1E9}"
        },
        {
          // Italian
          name: "Italiano",
          MDCode: "it",
          flagCode: "\u{1F1EE}\u{1F1F9}"
        },
        {
          // Japanese
          name: "\u65E5\u672C\u8A9E",
          MDCode: "ja",
          flagCode: "\u{1F1EF}\u{1F1F5}"
        },
        {
          // Korean
          name: "\uD55C\uAD6D\uC5B4",
          MDCode: "ko",
          flagCode: "\u{1F1F0}\u{1F1F7}"
        },
        {
          // Lithuanian
          name: "Lietuvi\u0173",
          MDCode: "lt",
          flagCode: "\u{1F1F1}\u{1F1F9}"
        },
        {
          // Mongolian
          name: "\u043C\u043E\u043D\u0433\u043E\u043B",
          MDCode: "mn",
          flagCode: "\u{1F1F2}\u{1F1F3}"
        },
        {
          // Malay
          name: "Melayu",
          MDCode: "ms",
          flagCode: "\u{1F1F2}\u{1F1FE}"
        },
        {
          // Burmese
          name: "\u1019\u103C\u1014\u103A\u1019\u102C\u1018\u102C\u101E\u102C",
          MDCode: "my",
          flagCode: "\u{1F1F2}\u{1F1F2}"
        },
        {
          // Dutch
          name: "Nederlands",
          MDCode: "nl",
          flagCode: "\u{1F1F3}\u{1F1F1}"
        },
        {
          // Norwegian
          name: "Norsk",
          MDCode: "no",
          flagCode: "\u{1F1F3}\u{1F1F4}"
        },
        {
          // Polish
          name: "Polski",
          MDCode: "pl",
          flagCode: "\u{1F1F5}\u{1F1F1}"
        },
        {
          // Portuguese
          name: "Portugu\xEAs",
          MDCode: "pt",
          flagCode: "\u{1F1F5}\u{1F1F9}"
        },
        {
          // Portuguese (Brazilian)
          name: "Portugu\xEAs (Brasil)",
          MDCode: "pt-br",
          flagCode: "\u{1F1E7}\u{1F1F7}"
        },
        {
          // Romanian
          name: "Rom\xE2n\u0103",
          MDCode: "ro",
          flagCode: "\u{1F1F7}\u{1F1F4}"
        },
        {
          // Russian
          name: "P\u0443\u0441\u0441\u043A\u0438\u0439",
          MDCode: "ru",
          flagCode: "\u{1F1F7}\u{1F1FA}"
        },
        {
          // Serbian
          name: "C\u0440\u043F\u0441\u043A\u0438",
          MDCode: "sr",
          flagCode: "\u{1F1F7}\u{1F1F8}"
        },
        {
          // Swedish
          name: "Svenska",
          MDCode: "sv",
          flagCode: "\u{1F1F8}\u{1F1EA}"
        },
        {
          // Thai
          name: "\u0E44\u0E17\u0E22",
          MDCode: "th",
          flagCode: "\u{1F1F9}\u{1F1ED}"
        },
        {
          // Tagalog
          name: "Filipino",
          MDCode: "tl",
          flagCode: "\u{1F1F5}\u{1F1ED}"
        },
        {
          // Turkish
          name: "T\xFCrk\xE7e",
          MDCode: "tr",
          flagCode: "\u{1F1F9}\u{1F1F7}"
        },
        {
          // Ukrainian
          name: "Y\u043A\u0440\u0430\u0457\u0301\u043D\u0441\u044C\u043A\u0430",
          MDCode: "uk",
          flagCode: "\u{1F1FA}\u{1F1E6}"
        },
        {
          // Vietnamese
          name: "Ti\u1EBFng Vi\u1EC7t",
          MDCode: "vi",
          flagCode: "\u{1F1FB}\u{1F1F3}"
        },
        {
          // Chinese (Simplified)
          name: "\u4E2D\u6587 (\u7B80\u5316\u5B57)",
          MDCode: "zh",
          flagCode: "\u{1F1E8}\u{1F1F3}"
        },
        {
          // Chinese (Traditional)
          name: "\u4E2D\u6587 (\u7E41\u9AD4\u5B57)",
          MDCode: "zh-hk",
          flagCode: "\u{1F1ED}\u{1F1F0}"
        }
      ];
      this.Languages = this.Languages.sort((a, b) => a.name > b.name ? 1 : -1);
    }
    getMDCodeList() {
      return this.Languages.map((Language) => Language.MDCode);
    }
    getName(MDCode) {
      return this.Languages.filter((Language) => Language.MDCode == MDCode)[0]?.name ?? "Unknown";
    }
    getFlagCode(MDCode) {
      return this.Languages.filter((Language) => Language.MDCode == MDCode)[0]?.flagCode ?? "_unknown";
    }
    getDefault() {
      return this.Languages.filter((Language) => Language.default).map(
        (Language) => Language.MDCode
      );
    }
  };
  var MDLanguages = new MDLanguagesClass();
  var MDContentRatingClass = class {
    constructor() {
      this.Ratings = [
        {
          name: "Safe",
          enum: "safe",
          default: true
        },
        {
          name: "Suggestive",
          enum: "suggestive"
        },
        {
          name: "Erotica",
          enum: "erotica"
        },
        {
          name: "Pornographic",
          enum: "pornographic"
        }
      ];
    }
    getEnumList() {
      return this.Ratings.map((Rating) => Rating.enum);
    }
    getName(ratingEum) {
      return this.Ratings.filter((Rating) => Rating.enum == ratingEum)[0]?.name ?? "";
    }
    getDefault() {
      return this.Ratings.filter((Rating) => Rating.default).map(
        (Rating) => Rating.enum
      );
    }
  };
  var MDRatings = new MDContentRatingClass();
  var MDHomepageSectionsClass = class {
    constructor() {
      this.Sections = [
        {
          name: "Seasonal",
          enum: "seasonal",
          default: true
        },
        {
          name: "Popular",
          enum: "popular",
          default: true
        },
        {
          name: "Latest Updates",
          enum: "latest_updates",
          default: true
        }
      ];
    }
    getEnumList() {
      return this.Sections.map((Sections) => Sections.enum);
    }
    getName(sectionsEnum) {
      return this.Sections.filter((Sections) => Sections.enum == sectionsEnum)[0]?.name ?? "";
    }
    getDefault() {
      return this.Sections.filter((Sections) => Sections.default).map(
        (Sections) => Sections.enum
      );
    }
  };
  var MDHomepageSections = new MDHomepageSectionsClass();
  var MDImageQualityClass = class {
    constructor() {
      this.ImageQualities = [
        {
          name: "Source (Original/Best)",
          enum: "source",
          ending: "",
          default: ["manga"]
        },
        {
          name: "<= 512px",
          enum: "512",
          ending: ".512.jpg"
        },
        {
          name: "<= 256px",
          enum: "256",
          ending: ".256.jpg",
          default: ["homepage", "search"]
        }
      ];
    }
    getEnumList() {
      return this.ImageQualities.map((ImageQuality) => ImageQuality.enum);
    }
    /// Note for anyone coming from a sensible language: in bizzaro JavaScript land, when you try to access a non-existant index
    /// it doesnt throw an error, instead it returns undefined
    getName(imageQualityEnum) {
      return this.ImageQualities.filter(
        (ImageQuality) => ImageQuality.enum == imageQualityEnum
      )[0]?.name ?? "";
    }
    getEnding(imageQualityEnum) {
      return this.ImageQualities.filter(
        (ImageQuality) => ImageQuality.enum == imageQualityEnum
      )[0]?.ending ?? "";
    }
    getDefault(section) {
      return this.ImageQualities.filter(
        (ImageQuality) => ImageQuality.default?.includes(section)
      ).map((ImageQuality) => ImageQuality.enum)[0] ?? "";
    }
  };
  var MDImageQuality = new MDImageQualityClass();

  // src/MangaDex/MangaDexParser.ts
  init_buffer();
  var import_types2 = __toESM(require_lib());

  // src/MangaDex/MangaDexSettings.ts
  init_buffer();
  var import_types = __toESM(require_lib());

  // (disabled):crypto
  init_buffer();

  // src/MangaDex/MangaDexSettings.ts
  var import_util = __toESM(require_util());
  function getLanguages() {
    return Application.getState("languages") ?? MDLanguages.getDefault();
  }
  function getRatings() {
    return Application.getState("ratings") ?? MDRatings.getDefault();
  }
  function getDataSaver() {
    return Application.getState("data_saver") ?? false;
  }
  function getSkipSameChapter() {
    return Application.getState("skip_same_chapter") ?? false;
  }
  function getForcePort443() {
    return Application.getState("force_port_443") ?? false;
  }
  function getProxyServer() {
    return Application.getState("proxy_server") ?? "";
  }
  function getEnableProxyServer() {
    return Application.getState("enable_proxy_server") ?? false;
  }
  function getProxyUser() {
    return Application.getState("proxy_user") ?? "";
  }
  function getProxyPass() {
    return Application.getState("proxy_pass") ?? "";
  }
  function getProxyAccess() {
    return Application.getSecureState("access_token") ?? "";
  }
  function setLanguages(value) {
    Application.setState(value, "languages");
  }
  function setRatings(value) {
    Application.setState(value, "ratings");
  }
  function setDataSaver(value) {
    Application.setState(value, "data_saver");
  }
  function setSkipSameChapter(value) {
    Application.setState(value, "skip_same_chapter");
  }
  function setForcePort443(value) {
    Application.setState(value, "force_port_443");
  }
  function setProxyServer(value) {
    Application.setState(value, "proxy_server");
  }
  function setEnableProxyServer(value) {
    Application.setState(value, "enable_proxy_server");
  }
  function setProxyUser(value) {
    Application.setState(value, "proxy_user");
  }
  function setProxyPass(value) {
    Application.setState(value, "proxy_pass");
  }
  function setProxyAccess(value) {
    Application.setSecureState(value, "proxy_access");
  }
  function getHomepageThumbnail() {
    return Application.getState("homepage_thumbnail") ?? MDImageQuality.getDefault("homepage");
  }
  function getSearchThumbnail() {
    return Application.getState("search_thumbnail") ?? MDImageQuality.getDefault("search");
  }
  function getMangaThumbnail() {
    return Application.getState("manga_thumbnail") ?? MDImageQuality.getDefault("manga");
  }
  function getAccessToken() {
    const accessToken = Application.getSecureState("access_token");
    const refreshToken = Application.getSecureState("refresh_token");
    if (!accessToken) return void 0;
    return {
      accessToken,
      refreshToken,
      tokenBody: parseAccessToken(accessToken)
    };
  }
  function saveAccessToken(accessToken, refreshToken) {
    Application.setSecureState(accessToken, "access_token");
    Application.setSecureState(refreshToken, "refresh_token");
    if (!accessToken) return void 0;
    return {
      accessToken,
      refreshToken,
      tokenBody: parseAccessToken(accessToken)
    };
  }
  function parseAccessToken(accessToken) {
    if (!accessToken) return void 0;
    const tokenBodyBase64 = accessToken.split(".")[1];
    if (!tokenBodyBase64) return void 0;
    const tokenBodyJSON = Buffer2.from(tokenBodyBase64, "base64").toString(
      "ascii"
    );
    return JSON.parse(tokenBodyJSON);
  }
  var MangaDexSettingsForm = class extends import_types.Form {
    getSections() {
      const languages = getLanguages();
      const ratings = getRatings();
      const dataSaver = getDataSaver();
      const skipSameChapter = getSkipSameChapter();
      const forcePort = getForcePort443();
      return [
        (0, import_types.Section)("playground", [
          (0, import_types.NavigationRow)("playground", {
            title: "SourceUI Playground",
            form: new SourceUIPlaygroundForm()
          })
        ]),
        (0, import_types.Section)("proxy", [
          (0, import_types.NavigationRow)("proxy", {
            title: "Proxy Settings",
            form: new class extends import_types.Form {
              getSections() {
                return [
                  (0, import_types.Section)("proxySection", [
                    (0, import_types.InputRow)("proxyinput", {
                      title: "Proxy Server",
                      value: getProxyServer() != "" ? getProxyServer() : "",
                      onValueChange: Application.Selector(
                        this,
                        // @ts-expect-error
                        "changeProxy"
                      )
                    }),
                    (0, import_types.InputRow)("userinput", {
                      title: "Proxy Username",
                      value: getProxyUser() != "" ? getProxyUser() : "",
                      onValueChange: Application.Selector(
                        this,
                        // @ts-expect-error
                        "changeProxyUser"
                      )
                    }),
                    (0, import_types.InputRow)("passinput", {
                      title: "Proxy Password",
                      value: getProxyPass() != "" ? getProxyPass() : "",
                      onValueChange: Application.Selector(
                        this,
                        // @ts-expect-error
                        "changeProxyPass"
                      )
                    }),
                    (0, import_types.ToggleRow)("enableProxy", {
                      title: "Enable Proxy Server",
                      value: getEnableProxyServer(),
                      onValueChange: Application.Selector(
                        this,
                        // @ts-expect-error
                        "changeEnableProxy"
                      )
                    }),
                    (0, import_types.ButtonRow)("testProxy", {
                      title: "Test Proxy",
                      onSelect: Application.Selector(
                        this,
                        // @ts-expect-error
                        "testProxy"
                      )
                    }),
                    (0, import_types.ButtonRow)("login", {
                      title: "Login to Proxy",
                      onSelect: Application.Selector(
                        this,
                        // @ts-expect-error
                        "login"
                      )
                    })
                  ])
                ];
              }
              async changeProxy(value) {
                setProxyServer(value);
              }
              async changeProxyUser(value) {
                setProxyUser(value);
              }
              async changeProxyPass(value) {
                const scryptAsync = (0, import_util.promisify)(void 0);
                const salt = (void 0)(16).toString("hex");
                const buf = await scryptAsync(
                  value,
                  salt,
                  64
                );
                setProxyPass(`${buf.toString("hex")}.${salt}`);
              }
              async changeEnableProxy(value) {
                setEnableProxyServer(value);
              }
              async testProxy() {
                const proxyURL = getProxyServer();
                const [response, _] = await Application.scheduleRequest({
                  method: "GET",
                  url: `${proxyURL}`,
                  headers: {
                    "Content-Type": "application/json",
                    referer: `${proxyURL}/`
                  }
                });
                throw new Error(`${response.status}`);
              }
              async login() {
                const proxyURL = getProxyServer();
                const username = getProxyUser();
                const password = getProxyPass();
                const [response, buffer] = await Application.scheduleRequest({
                  method: "POST",
                  url: `${proxyURL}/api/auth/login`,
                  headers: {
                    "Content-Type": "application/json",
                    referer: `${proxyURL}/`
                  },
                  body: {
                    username,
                    password
                  }
                });
                if (response.status > 200) {
                  const data = Application.arrayBufferToUTF8String(buffer);
                  const json = JSON.parse(data);
                  setProxyAccess(json.data.token);
                  throw new Error(
                    `Done Login: ${json.data.token}`
                  );
                } else {
                  throw new Error(
                    `Login failed with error code: ${response.status}`
                  );
                }
              }
            }()
          })
        ]),
        (0, import_types.Section)("oAuthSection", [
          (0, import_types.DeferredItem)(() => {
            if (getAccessToken()) {
              return (0, import_types.NavigationRow)("sessionInfo", {
                title: "Session Info",
                form: new class extends import_types.Form {
                  getSections() {
                    const accessToken = getAccessToken();
                    if (!accessToken)
                      return [
                        (0, import_types.Section)("introspect", [
                          (0, import_types.LabelRow)("logged_out", {
                            title: "LOGGED OUT"
                          })
                        ])
                      ];
                    return [
                      (0, import_types.Section)(
                        "introspect",
                        Object.keys(
                          accessToken.tokenBody
                        ).map((key) => {
                          return (0, import_types.LabelRow)(key, {
                            title: key,
                            value: `${accessToken.tokenBody[key]}`
                          });
                        })
                      ),
                      (0, import_types.Section)("logout", [
                        (0, import_types.ButtonRow)("logout", {
                          title: "Logout",
                          onSelect: Application.Selector(
                            this,
                            // @ts-expect-error
                            "logout"
                          )
                        })
                      ])
                    ];
                  }
                  async logout() {
                    saveAccessToken(void 0, void 0);
                    this.reloadForm();
                  }
                }()
              });
            } else {
              return (0, import_types.OAuthButtonRow)("oAuthButton", {
                title: "Login with MangaDex",
                authorizeEndpoint: "https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/auth",
                clientId: "paperback",
                redirectUri: "paperback://mangadex-login",
                responseType: {
                  type: "pkce",
                  pkceCodeLength: 64,
                  pkceCodeMethod: "S256",
                  formEncodeGrant: true,
                  tokenEndpoint: "https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token"
                },
                onSuccess: Application.Selector(
                  this,
                  "oauthDidSucceed"
                )
              });
            }
          })
        ]),
        (0, import_types.Section)("contentSettings", [
          (0, import_types.SelectRow)("languages", {
            title: "Languages",
            value: languages,
            minItemCount: 1,
            maxItemCount: 100,
            options: MDLanguages.getMDCodeList().map((x) => {
              return { id: x, title: MDLanguages.getName(x) };
            }),
            onValueChange: Application.Selector(
              this,
              "languageDidChange"
            )
          }),
          (0, import_types.SelectRow)("ratings", {
            title: "Content Rating",
            value: ratings,
            minItemCount: 1,
            maxItemCount: 100,
            options: MDRatings.getEnumList().map((x) => {
              return { id: x, title: MDRatings.getName(x) };
            }),
            onValueChange: Application.Selector(
              this,
              "ratingDidChange"
            )
          }),
          (0, import_types.ToggleRow)("data_saver", {
            title: "Data Saver",
            value: dataSaver,
            onValueChange: Application.Selector(
              this,
              "dataSaverDidChange"
            )
          }),
          (0, import_types.ToggleRow)("skip_same_chapter", {
            title: "Skip Same Chapter",
            value: skipSameChapter,
            onValueChange: Application.Selector(
              this,
              "skipSameChapterDidChange"
            )
          }),
          (0, import_types.ToggleRow)("force_port", {
            title: "Force Port 433",
            value: forcePort,
            onValueChange: Application.Selector(
              this,
              "forcePortDidChange"
            )
          })
        ])
      ];
    }
    async oauthDidSucceed(accessToken, refreshToken) {
      saveAccessToken(accessToken, refreshToken);
      this.reloadForm();
    }
    async languageDidChange(value) {
      setLanguages(value);
    }
    async ratingDidChange(value) {
      setRatings(value);
    }
    async dataSaverDidChange(value) {
      setDataSaver(value);
    }
    async skipSameChapterDidChange(value) {
      setSkipSameChapter(value);
    }
    async forcePortDidChange(value) {
      setForcePort443(value);
    }
  };
  var State = class {
    constructor(form, value) {
      this.form = form;
      this._value = value;
    }
    get value() {
      return this._value;
    }
    get selector() {
      return Application.Selector(this, "updateValue");
    }
    async updateValue(value) {
      this._value = value;
      this.form.reloadForm();
    }
  };
  var SourceUIPlaygroundForm = class extends import_types.Form {
    constructor() {
      super(...arguments);
      this.inputValue = new State(this, "");
      this.rowsVisible = new State(this, false);
      this.items = [];
    }
    getSections() {
      return [
        (0, import_types.Section)("hideStuff", [
          (0, import_types.ToggleRow)("toggle", {
            title: "Toggles can hide rows",
            value: this.rowsVisible.value,
            onValueChange: this.rowsVisible.selector
          })
        ]),
        ...(() => this.rowsVisible.value ? [
          (0, import_types.Section)("hiddenSection", [
            (0, import_types.InputRow)("input", {
              title: "Dynamic Input",
              value: this.inputValue.value,
              onValueChange: this.inputValue.selector
            }),
            (0, import_types.LabelRow)("boundLabel", {
              title: "Bound label to input",
              subtitle: "This label updates with the input",
              value: this.inputValue.value
            })
          ]),
          (0, import_types.Section)("items", [
            ...this.items.map(
              (item) => (0, import_types.LabelRow)(item, {
                title: item
              })
            ),
            (0, import_types.ButtonRow)("addNewItem", {
              title: "Add New Item",
              onSelect: Application.Selector(
                this,
                "addNewItem"
              )
            })
          ])
        ] : [])()
      ];
    }
    async addNewItem() {
      this.items.push("Item " + (this.items.length + 1));
      this.reloadForm();
    }
  };

  // src/MangaDex/RelevanceScore.ts
  init_buffer();

  // node_modules/fastest-levenshtein/esm/mod.js
  init_buffer();
  var peq = new Uint32Array(65536);
  var myers_32 = (a, b) => {
    const n = a.length;
    const m = b.length;
    const lst = 1 << n - 1;
    let pv = -1;
    let mv = 0;
    let sc = n;
    let i = n;
    while (i--) {
      peq[a.charCodeAt(i)] |= 1 << i;
    }
    for (i = 0; i < m; i++) {
      let eq = peq[b.charCodeAt(i)];
      const xv = eq | mv;
      eq |= (eq & pv) + pv ^ pv;
      mv |= ~(eq | pv);
      pv &= eq;
      if (mv & lst) {
        sc++;
      }
      if (pv & lst) {
        sc--;
      }
      mv = mv << 1 | 1;
      pv = pv << 1 | ~(xv | mv);
      mv &= xv;
    }
    i = n;
    while (i--) {
      peq[a.charCodeAt(i)] = 0;
    }
    return sc;
  };
  var myers_x = (b, a) => {
    const n = a.length;
    const m = b.length;
    const mhc = [];
    const phc = [];
    const hsize = Math.ceil(n / 32);
    const vsize = Math.ceil(m / 32);
    for (let i = 0; i < hsize; i++) {
      phc[i] = -1;
      mhc[i] = 0;
    }
    let j = 0;
    for (; j < vsize - 1; j++) {
      let mv2 = 0;
      let pv2 = -1;
      const start2 = j * 32;
      const vlen2 = Math.min(32, m) + start2;
      for (let k = start2; k < vlen2; k++) {
        peq[b.charCodeAt(k)] |= 1 << k;
      }
      for (let i = 0; i < n; i++) {
        const eq = peq[a.charCodeAt(i)];
        const pb = phc[i / 32 | 0] >>> i & 1;
        const mb = mhc[i / 32 | 0] >>> i & 1;
        const xv = eq | mv2;
        const xh = ((eq | mb) & pv2) + pv2 ^ pv2 | eq | mb;
        let ph = mv2 | ~(xh | pv2);
        let mh = pv2 & xh;
        if (ph >>> 31 ^ pb) {
          phc[i / 32 | 0] ^= 1 << i;
        }
        if (mh >>> 31 ^ mb) {
          mhc[i / 32 | 0] ^= 1 << i;
        }
        ph = ph << 1 | pb;
        mh = mh << 1 | mb;
        pv2 = mh | ~(xv | ph);
        mv2 = ph & xv;
      }
      for (let k = start2; k < vlen2; k++) {
        peq[b.charCodeAt(k)] = 0;
      }
    }
    let mv = 0;
    let pv = -1;
    const start = j * 32;
    const vlen = Math.min(32, m - start) + start;
    for (let k = start; k < vlen; k++) {
      peq[b.charCodeAt(k)] |= 1 << k;
    }
    let score = m;
    for (let i = 0; i < n; i++) {
      const eq = peq[a.charCodeAt(i)];
      const pb = phc[i / 32 | 0] >>> i & 1;
      const mb = mhc[i / 32 | 0] >>> i & 1;
      const xv = eq | mv;
      const xh = ((eq | mb) & pv) + pv ^ pv | eq | mb;
      let ph = mv | ~(xh | pv);
      let mh = pv & xh;
      score += ph >>> m - 1 & 1;
      score -= mh >>> m - 1 & 1;
      if (ph >>> 31 ^ pb) {
        phc[i / 32 | 0] ^= 1 << i;
      }
      if (mh >>> 31 ^ mb) {
        mhc[i / 32 | 0] ^= 1 << i;
      }
      ph = ph << 1 | pb;
      mh = mh << 1 | mb;
      pv = mh | ~(xv | ph);
      mv = ph & xv;
    }
    for (let k = start; k < vlen; k++) {
      peq[b.charCodeAt(k)] = 0;
    }
    return score;
  };
  var distance = (a, b) => {
    if (a.length < b.length) {
      const tmp = b;
      b = a;
      a = tmp;
    }
    if (b.length === 0) {
      return a.length;
    }
    if (a.length <= 32) {
      return myers_32(a, b);
    }
    return myers_x(a, b);
  };

  // node_modules/stemmer/index.js
  init_buffer();
  var step2list = {
    ational: "ate",
    tional: "tion",
    enci: "ence",
    anci: "ance",
    izer: "ize",
    bli: "ble",
    alli: "al",
    entli: "ent",
    eli: "e",
    ousli: "ous",
    ization: "ize",
    ation: "ate",
    ator: "ate",
    alism: "al",
    iveness: "ive",
    fulness: "ful",
    ousness: "ous",
    aliti: "al",
    iviti: "ive",
    biliti: "ble",
    logi: "log"
  };
  var step3list = {
    icate: "ic",
    ative: "",
    alize: "al",
    iciti: "ic",
    ical: "ic",
    ful: "",
    ness: ""
  };
  var consonant = "[^aeiou]";
  var vowel = "[aeiouy]";
  var consonants = "(" + consonant + "[^aeiouy]*)";
  var vowels = "(" + vowel + "[aeiou]*)";
  var gt0 = new RegExp("^" + consonants + "?" + vowels + consonants);
  var eq1 = new RegExp(
    "^" + consonants + "?" + vowels + consonants + vowels + "?$"
  );
  var gt1 = new RegExp("^" + consonants + "?(" + vowels + consonants + "){2,}");
  var vowelInStem = new RegExp("^" + consonants + "?" + vowel);
  var consonantLike = new RegExp("^" + consonants + vowel + "[^aeiouwxy]$");
  var sfxLl = /ll$/;
  var sfxE = /^(.+?)e$/;
  var sfxY = /^(.+?)y$/;
  var sfxIon = /^(.+?(s|t))(ion)$/;
  var sfxEdOrIng = /^(.+?)(ed|ing)$/;
  var sfxAtOrBlOrIz = /(at|bl|iz)$/;
  var sfxEED = /^(.+?)eed$/;
  var sfxS = /^.+?[^s]s$/;
  var sfxSsesOrIes = /^.+?(ss|i)es$/;
  var sfxMultiConsonantLike = /([^aeiouylsz])\1$/;
  var step2 = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
  var step3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
  var step4 = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
  function stemmer(value) {
    let result = String(value).toLowerCase();
    if (result.length < 3) {
      return result;
    }
    let firstCharacterWasLowerCaseY = false;
    if (result.codePointAt(0) === 121) {
      firstCharacterWasLowerCaseY = true;
      result = "Y" + result.slice(1);
    }
    if (sfxSsesOrIes.test(result)) {
      result = result.slice(0, -2);
    } else if (sfxS.test(result)) {
      result = result.slice(0, -1);
    }
    let match;
    if (match = sfxEED.exec(result)) {
      if (gt0.test(match[1])) {
        result = result.slice(0, -1);
      }
    } else if ((match = sfxEdOrIng.exec(result)) && vowelInStem.test(match[1])) {
      result = match[1];
      if (sfxAtOrBlOrIz.test(result)) {
        result += "e";
      } else if (sfxMultiConsonantLike.test(result)) {
        result = result.slice(0, -1);
      } else if (consonantLike.test(result)) {
        result += "e";
      }
    }
    if ((match = sfxY.exec(result)) && vowelInStem.test(match[1])) {
      result = match[1] + "i";
    }
    if ((match = step2.exec(result)) && gt0.test(match[1])) {
      result = match[1] + step2list[match[2]];
    }
    if ((match = step3.exec(result)) && gt0.test(match[1])) {
      result = match[1] + step3list[match[2]];
    }
    if (match = step4.exec(result)) {
      if (gt1.test(match[1])) {
        result = match[1];
      }
    } else if ((match = sfxIon.exec(result)) && gt1.test(match[1])) {
      result = match[1];
    }
    if ((match = sfxE.exec(result)) && (gt1.test(match[1]) || eq1.test(match[1]) && !consonantLike.test(match[1]))) {
      result = match[1];
    }
    if (sfxLl.test(result) && gt1.test(result)) {
      result = result.slice(0, -1);
    }
    if (firstCharacterWasLowerCaseY) {
      result = "y" + result.slice(1);
    }
    return result;
  }

  // src/MangaDex/RelevanceScore.ts
  var relevanceScore = (title, queryTitle) => {
    const titleWords = tokenize(title);
    const queryWords = tokenize(queryTitle);
    const titleStripped = titleWords.join("");
    const queryStripped = queryWords.join("");
    if (titleStripped === queryStripped) {
      return 100;
    }
    const titlePhrase = titleWords.join(" ");
    const queryPhrase = queryWords.join(" ");
    const phraseAtStartRegex = new RegExp(`^\\b${queryPhrase}\\b`, "i");
    if (phraseAtStartRegex.test(titlePhrase)) {
      return 100;
    }
    const phraseAnywhereRegex = new RegExp(`\\b${queryPhrase}\\b`, "i");
    if (phraseAnywhereRegex.test(titlePhrase)) {
      return 95;
    }
    const adjacentSequencePosition = getAdjacentSequencePosition(
      titleWords,
      queryWords
    );
    if (adjacentSequencePosition === 0) {
      return 90;
    } else if (adjacentSequencePosition > 0) {
      return 85;
    }
    if (wordsAppearInOrder(titleWords, queryWords)) {
      return 80;
    }
    if (allWordsPresent(titleWords, queryWords)) {
      return 75;
    }
    let totalSimilarity = 0;
    for (const queryWord of queryWords) {
      let maxSimilarity = 0;
      for (const titleWord of titleWords) {
        const similarity = wordSimilarity(queryWord, titleWord);
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
        }
      }
      totalSimilarity += maxSimilarity;
    }
    const averageSimilarity = totalSimilarity / queryWords.length;
    const finalScore = averageSimilarity * 70;
    return Math.max(0, Math.min(70, finalScore));
  };
  var wordSimilarity = (word1, word2) => {
    const stemmedWord1 = stemmer(word1);
    const stemmedWord2 = stemmer(word2);
    if (stemmedWord1 === stemmedWord2) {
      return 1;
    }
    const maxLen = Math.max(stemmedWord1.length, stemmedWord2.length);
    const distance2 = distance(stemmedWord1, stemmedWord2);
    const similarity = (maxLen - distance2) / maxLen;
    if (similarity >= 0.6) {
      return similarity;
    }
    return 0;
  };
  var tokenize = (text) => {
    return text.toLowerCase().replace(/[\u2019']/g, "").replace(/[^\w\s]/g, "").split(/\s+/).filter((word) => word.length > 0);
  };
  var allWordsPresent = (titleWords, queryWords) => {
    for (const queryWord of queryWords) {
      let found = false;
      for (const titleWord of titleWords) {
        if (wordSimilarity(queryWord, titleWord) >= 0.7) {
          found = true;
          break;
        }
      }
      if (!found) {
        return false;
      }
    }
    return true;
  };
  var wordsAppearInOrder = (titleWords, queryWords) => {
    let titleIndex = 0;
    for (let i = 0; i < queryWords.length; i++) {
      const queryWord = queryWords[i];
      while (titleIndex < titleWords.length) {
        if (wordSimilarity(
          queryWord,
          titleWords[titleIndex]
        ) >= 0.7) {
          titleIndex++;
          break;
        }
        titleIndex++;
      }
      if (titleIndex === titleWords.length && i < queryWords.length - 1) {
        return false;
      }
    }
    return true;
  };
  var getAdjacentSequencePosition = (titleWords, queryWords) => {
    for (let i = 0; i <= titleWords.length - queryWords.length; i++) {
      let match = true;
      for (let j = 0; j < queryWords.length; j++) {
        if (wordSimilarity(
          queryWords[j],
          titleWords[i + j]
        ) < 0.7) {
          match = false;
          break;
        }
      }
      if (match) {
        return i;
      }
    }
    return -1;
  };

  // src/MangaDex/MangaDexParser.ts
  var parseMangaList = async (object, COVER_BASE_URL2, thumbnailSelector, query) => {
    const results = [];
    for (const manga of object) {
      const mangaId = manga.id;
      const mangaDetails = manga.attributes;
      const title = Application.decodeHTMLEntities(
        mangaDetails.title.en ?? mangaDetails.altTitles.map((x) => Object.values(x).find((v) => v !== void 0)).find((t) => t !== void 0)
      );
      const coverFileName = manga.relationships.filter((x) => x.type == "cover_art").map((x) => x.attributes?.fileName)[0];
      const image = coverFileName ? `${COVER_BASE_URL2}/${mangaId}/${coverFileName}${MDImageQuality.getEnding(
        thumbnailSelector()
      )}` : "https://mangadex.org/_nuxt/img/cover-placeholder.d12c3c5.jpg";
      const subtitle = parseChapterTitle({
        title: void 0,
        volume: mangaDetails.lastVolume,
        chapter: mangaDetails.lastChapter
      });
      let relevance = 0;
      if (query?.title) {
        relevance = relevanceScore(title, query.title);
      }
      results.push({
        manga: {
          ...manga,
          mangaId,
          title,
          imageUrl: image,
          subtitle
        },
        relevance
      });
    }
    results.sort((a, b) => b.relevance - a.relevance);
    return results.map((r) => r.manga);
  };
  var parseMangaDetails = (mangaId, COVER_BASE_URL2, json) => {
    const mangaDetails = json.data.attributes;
    const secondaryTitles = mangaDetails.altTitles.flatMap((x) => Object.values(x)).map((x) => Application.decodeHTMLEntities(x));
    const primaryTitle = mangaDetails.title["en"] ?? Object.values(mangaDetails.title)[0];
    const desc = Application.decodeHTMLEntities(
      mangaDetails.description.en
    )?.replace(/\[\/?[bus]]/g, "");
    const status = mangaDetails.status;
    const tags = [];
    for (const tag of mangaDetails.tags) {
      const tagName = tag.attributes.name;
      tags.push({
        id: tag.id,
        title: Object.keys(tagName).map((keys) => tagName[keys])[0] ?? "Unknown"
      });
    }
    const author = json.data.relationships.filter((x) => x.type == "author").map((x) => x.attributes.name).join(", ");
    const artist = json.data.relationships.filter((x) => x.type == "artist").map((x) => x.attributes.name).join(", ");
    let image = "";
    const coverFileName = json.data.relationships.filter((x) => x.type == "cover_art").map((x) => x.attributes?.fileName)[0];
    if (coverFileName) {
      image = `${COVER_BASE_URL2}/${mangaId}/${coverFileName}${MDImageQuality.getEnding(
        getMangaThumbnail()
      )}`;
    }
    return {
      mangaId,
      mangaInfo: {
        primaryTitle,
        secondaryTitles,
        thumbnailUrl: image,
        author,
        artist,
        synopsis: desc ?? "No Description",
        status,
        tagGroups: [{ id: "tags", title: "Tags", tags }],
        contentRating: import_types2.ContentRating.EVERYONE
        // TODO: apply proper rating
      }
    };
  };
  var parseChapterTitle = (info) => {
    if (!info) {
      return "Not found";
    }
    return `${info.volume ? `Vol. ${info.volume}` : ""} ${info.chapter ? `Ch. ${info.chapter}` : ""} ${info.title ? info.title : ""}`.trim();
  };

  // src/MangaDex/main.ts
  var MANGADEX_DOMAIN = "https://mangadex.org";
  var MANGADEX_API = "https://api.mangadex.org";
  var COVER_BASE_URL = "https://uploads.mangadex.org/covers";
  var SEASONAL_LIST = "77430796-6625-4684-b673-ffae5140f337";
  var MangaDexInterceptor = class extends import_types3.PaperbackInterceptor {
    constructor() {
      super(...arguments);
      this.imageRegex = new RegExp(
        /\.(png|gif|jpeg|jpg|webp)(\?|$)/gi
      );
    }
    async interceptRequest(request) {
      const proxyURL = getProxyServer();
      const proxyEnabled = getEnableProxyServer();
      const proxyToken = getProxyAccess();
      if (proxyEnabled && proxyURL != "" && request.url.includes("data")) {
        request.headers = {
          ...request.headers,
          referer: `${proxyURL}/`,
          Authorization: "Bearer " + proxyToken
        };
        return request;
      } else {
        request.headers = {
          ...request.headers,
          referer: `${MANGADEX_DOMAIN}/`
        };
      }
      let accessToken = getAccessToken();
      if (this.imageRegex.test(request.url) || request.url.includes("auth/") || request.url.includes("auth.mangadex") || !accessToken) {
        return request;
      }
      if (Number(accessToken.tokenBody.exp) <= Date.now() / 1e3 - 60) {
        try {
          const [_, buffer] = await Application.scheduleRequest({
            url: "https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token",
            method: "post",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: {
              grant_type: "refresh_token",
              refresh_token: accessToken.refreshToken,
              client_id: "thirdparty-oauth-client"
            }
          });
          const data = Application.arrayBufferToUTF8String(buffer);
          const json = JSON.parse(data);
          accessToken = saveAccessToken(
            json.access_token,
            json.refresh_token
          );
          if (!accessToken) {
            return request;
          }
        } catch (e) {
          console.log(e);
          return request;
        }
      }
      request.headers = {
        ...request.headers,
        Authorization: "Bearer " + accessToken.accessToken
      };
      return request;
    }
    async interceptResponse(request, response, data) {
      return data;
    }
  };
  var MangaDexExtension = class {
    constructor() {
      this.globalRateLimiter = new import_types3.BasicRateLimiter("rateLimiter", {
        numberOfRequests: 4,
        bufferInterval: 1,
        ignoreImages: true
      });
      this.mainRequestInterceptor = new MangaDexInterceptor("main");
    }
    async initialise() {
      this.globalRateLimiter.registerInterceptor();
      this.mainRequestInterceptor.registerInterceptor();
      if (Application.isResourceLimited) return;
      Application.registerSearchFilter({
        id: "includeOperator",
        type: "dropdown",
        options: [
          { id: "AND", value: "AND" },
          { id: "OR", value: "OR" }
        ],
        value: "AND",
        title: "Include Operator"
      });
      Application.registerSearchFilter({
        id: "excludeOperator",
        type: "dropdown",
        options: [
          { id: "AND", value: "AND" },
          { id: "OR", value: "OR" }
        ],
        value: "OR",
        title: "Exclude Operator"
      });
      for (const tags of this.getSearchTags()) {
        Application.registerSearchFilter({
          type: "multiselect",
          options: tags.tags.map((x) => ({ id: x.id, value: x.title })),
          id: "tags-" + tags.id,
          allowExclusion: true,
          title: tags.title,
          value: {},
          allowEmptySelection: true,
          maximum: void 0
        });
      }
    }
    async getDiscoverSections() {
      return [
        {
          id: "seasonal",
          title: "Seasonal",
          type: import_types3.DiscoverSectionType.featured
        },
        {
          id: "latest_updates",
          title: "Latest Updates",
          type: import_types3.DiscoverSectionType.chapterUpdates
        },
        {
          id: "popular",
          title: "Popular",
          type: import_types3.DiscoverSectionType.prominentCarousel
        },
        {
          id: "recently_Added",
          title: "Recently Added",
          type: import_types3.DiscoverSectionType.simpleCarousel
        },
        ...this.getTagSections()
      ];
    }
    async getDiscoverSectionItems(section, metadata) {
      switch (section.id) {
        case "seasonal":
          return this.getMangaListDiscoverSectionItems(section);
        case "latest_updates":
          return this.getLatestUpdatesDiscoverSectionItems(
            section,
            metadata
          );
        case "popular":
          return this.getPopularDiscoverSectionItems(section, metadata);
        case "recently_Added":
          return this.getRecentlyAddedDiscoverSectionItems(
            section,
            metadata
          );
        default:
          return this.getTags(section);
      }
    }
    async processSourceMangaForUpdates(updateManager, lastUpdated) {
    }
    getTagSections() {
      const uniqueGroups = /* @__PURE__ */ new Set();
      const sections = [];
      for (const tag of tag_default) {
        const group = tag.data.attributes.group;
        if (!uniqueGroups.has(group)) {
          uniqueGroups.add(group);
          sections.push({
            id: group,
            title: group.charAt(0).toUpperCase() + group.slice(1),
            type: import_types3.DiscoverSectionType.genres
          });
        }
      }
      return sections;
    }
    async getTags(section) {
      const sections = {};
      for (const tag of tag_default) {
        const group = tag.data.attributes.group;
        if (sections[group] == null) {
          sections[group] = {
            id: group,
            title: group.charAt(0).toUpperCase() + group.slice(1),
            tags: []
          };
        }
        const tagObject = {
          id: tag.data.id,
          title: tag.data.attributes.name.en
        };
        sections[group].tags = [
          ...sections[group]?.tags ?? [],
          tagObject
        ];
      }
      return {
        items: sections[section.id]?.tags.map((x) => ({
          type: "genresCarouselItem",
          searchQuery: {
            title: "",
            filters: [
              {
                id: `tags-${section.id}`,
                value: { [x.id]: "included" }
              }
            ]
          },
          name: x.title
        })) ?? [],
        metadata: void 0
      };
    }
    // This will be called for manga that have many new chapters which could not all be fetched in the
    // above method, aka 'high' priority titles
    async getNewChapters(sourceManga, sinceDate) {
      return this.getChapters(sourceManga);
    }
    async getSettingsForm() {
      return new MangaDexSettingsForm();
    }
    getSearchTags() {
      const sections = {};
      for (const tag of tag_default) {
        const group = tag.data.attributes.group;
        if (sections[group] == null) {
          sections[group] = {
            id: group,
            title: group.charAt(0).toUpperCase() + group.slice(1),
            tags: []
          };
        }
        const tagObject = {
          id: tag.data.id,
          title: tag.data.attributes.name.en
        };
        sections[group].tags = [
          ...sections[group]?.tags ?? [],
          tagObject
        ];
      }
      return Object.values(sections);
    }
    // Used for seasonal listing
    async getCustomListRequestURL(listId, ratings) {
      const request = {
        url: `${MANGADEX_API}/list/${listId}`,
        method: "GET"
      };
      const [_, buffer] = await Application.scheduleRequest(request);
      const data = Application.arrayBufferToUTF8String(buffer);
      const json = typeof data === "string" ? JSON.parse(data) : data;
      return new URLBuilder(MANGADEX_API).addPath("manga").addQuery("limit", 100).addQuery("contentRating", ratings).addQuery("includes", ["cover_art"]).addQuery(
        "ids",
        json.data.relationships.filter((x) => x.type == "manga").map((x) => x.id)
      ).build();
    }
    async getMangaDetails(mangaId) {
      this.checkId(mangaId);
      const request = {
        url: new URLBuilder(MANGADEX_API).addPath("manga").addPath(mangaId).addQuery("includes", ["author", "artist", "cover_art"]).build(),
        method: "GET"
      };
      const [_, buffer] = await Application.scheduleRequest(request);
      const data = Application.arrayBufferToUTF8String(buffer);
      const json = typeof data === "string" ? JSON.parse(data) : data;
      return parseMangaDetails(mangaId, COVER_BASE_URL, json);
    }
    async getChapters(sourceManga) {
      const mangaId = sourceManga.mangaId;
      this.checkId(mangaId);
      const languages = getLanguages();
      const skipSameChapter = getSkipSameChapter();
      const ratings = getRatings();
      const collectedChapters = /* @__PURE__ */ new Set();
      const chapters = [];
      let offset = 0;
      let sortingIndex = 0;
      let hasResults = true;
      while (hasResults) {
        const request = {
          url: new URLBuilder(MANGADEX_API).addPath("manga").addPath(mangaId).addPath("feed").addQuery("limit", 500).addQuery("offset", offset).addQuery("includes", ["scanlation_group"]).addQuery("translatedLanguage", languages).addQuery("order", {
            volume: "desc",
            chapter: "desc",
            publishAt: "desc"
          }).addQuery("contentRating", ratings).addQuery("includeFutureUpdates", "0").build(),
          method: "GET"
        };
        const [_, buffer] = await Application.scheduleRequest(request);
        const data = Application.arrayBufferToUTF8String(buffer);
        const json = typeof data === "string" ? JSON.parse(data) : data;
        offset += 500;
        if (json.data === void 0)
          throw new Error(`Failed to parse json results for ${mangaId}`);
        for (const chapter of json.data) {
          const chapterId = chapter.id;
          const chapterDetails = chapter.attributes;
          const name = Application.decodeHTMLEntities(
            chapterDetails.title
          );
          const chapNum = Number(chapterDetails?.chapter);
          const volume = Number(chapterDetails?.volume);
          const langCode = MDLanguages.getFlagCode(
            chapterDetails.translatedLanguage
          );
          const time = new Date(chapterDetails.publishAt);
          const group = chapter.relationships.filter((x) => x.type == "scanlation_group").map((x) => x.attributes.name).join(", ");
          const pages = Number(chapterDetails.pages);
          const identifier = `${volume}-${chapNum}-${chapterDetails.translatedLanguage}`;
          if (collectedChapters.has(identifier) && skipSameChapter)
            continue;
          if (pages > 0) {
            chapters.push({
              chapterId,
              sourceManga,
              title: name,
              chapNum,
              volume,
              langCode,
              version: group,
              publishDate: time,
              sortingIndex
            });
            collectedChapters.add(identifier);
            sortingIndex--;
          }
        }
        if (json.total <= offset) {
          hasResults = false;
        }
      }
      if (chapters.length == 0) {
        throw new Error(
          `Couldn't find any chapters in your selected language for mangaId: ${mangaId}!`
        );
      }
      return chapters.map((chapter) => {
        chapter.sortingIndex = (chapter.sortingIndex ?? 0) + chapters.length;
        return chapter;
      });
    }
    async getChapterDetails(chapter) {
      const chapterId = chapter.chapterId;
      const mangaId = chapter.sourceManga.mangaId;
      this.checkId(chapterId);
      const dataSaver = getDataSaver();
      const forcePort = getForcePort443();
      const proxyURL = getProxyServer();
      const proxyEnabled = getEnableProxyServer();
      let json;
      if (proxyEnabled && proxyURL != "") {
        const request = {
          url: `${proxyURL}/manga?chapterId=${chapterId}`,
          method: "GET"
        };
        const [_, buffer] = await Application.scheduleRequest(request);
        const data = Application.arrayBufferToUTF8String(buffer);
        json = typeof data === "string" ? JSON.parse(data) : data;
      } else {
        const request = {
          url: `${MANGADEX_API}/at-home/server/${chapterId}${forcePort ? "?forcePort443=true" : ""}`,
          method: "GET"
        };
        const [_, buffer] = await Application.scheduleRequest(request);
        const data = Application.arrayBufferToUTF8String(buffer);
        json = typeof data === "string" ? JSON.parse(data) : data;
      }
      const serverUrl = json.baseUrl.replace(/\/$/, "");
      const chapterDetails = json.chapter;
      let pages;
      if (dataSaver) {
        pages = chapterDetails.dataSaver.map(
          (x) => `${serverUrl}/data-saver/${chapterDetails.hash}/${x}`
        );
      } else {
        pages = chapterDetails.data.map(
          (x) => `${serverUrl}/data/${chapterDetails.hash}/${x}`
        );
      }
      return {
        id: chapterId,
        mangaId,
        pages
      };
    }
    async getSearchResults(query, metadata) {
      const ratings = getRatings();
      const languages = getLanguages();
      const offset = metadata?.offset ?? 0;
      let results = [];
      const searchType = query.title?.match(
        /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i
      ) ? "ids[]" : "title";
      const url = new URLBuilder(MANGADEX_API).addPath("manga").addQuery(searchType, query?.title?.replace(/ /g, "+") || "").addQuery("limit", 100).addQuery("hasAvailableChapters", true).addQuery("availableTranslatedLanguage", languages).addQuery("offset", offset).addQuery("contentRating", ratings).addQuery("includes", ["cover_art"]);
      const includedTags = [];
      const excludedTags = [];
      for (const filter of query.filters) {
        if (filter.id.startsWith("tags")) {
          const tags = filter.value ?? {};
          for (const tag of Object.entries(tags)) {
            switch (tag[1]) {
              case "excluded":
                excludedTags.push(tag[0]);
                break;
              case "included":
                includedTags.push(tag[0]);
                break;
            }
          }
        }
        if (filter.id == "includeOperator") {
          url.addQuery("includedTagsMode", filter.value ?? "and");
        }
        if (filter.id == "excludeOperator") {
          url.addQuery("excludedTagsMode", filter.value ?? "or");
        }
      }
      const request = {
        url: url.addQuery("includedTags", includedTags).addQuery("excludedTags", excludedTags).build(),
        method: "GET"
      };
      const [response, buffer] = await Application.scheduleRequest(request);
      const data = Application.arrayBufferToUTF8String(buffer);
      if (response.status != 200) {
        return { items: results };
      }
      const json = typeof data === "string" ? JSON.parse(data) : data;
      if (json.data === void 0) {
        throw new Error("Failed to parse json for the given search");
      }
      results = await parseMangaList(
        json.data,
        COVER_BASE_URL,
        getSearchThumbnail,
        query
      );
      const nextMetadata = results.length < 100 ? void 0 : { offset: offset + 100 };
      return {
        items: results,
        metadata: nextMetadata
      };
    }
    async getMangaListDiscoverSectionItems(section) {
      const ratings = getRatings();
      const [_, buffer] = await Application.scheduleRequest({
        url: await this.getCustomListRequestURL(SEASONAL_LIST, ratings),
        method: "GET"
      });
      const data = Application.arrayBufferToUTF8String(buffer);
      const json = typeof data === "string" ? JSON.parse(data) : data;
      if (json.data === void 0) {
        throw new Error(
          `Failed to parse json results for section ${section.title}`
        );
      }
      const items = await parseMangaList(
        json.data,
        COVER_BASE_URL,
        getHomepageThumbnail
      );
      return {
        items: items.map((x) => ({
          type: "featuredCarouselItem",
          imageUrl: x.imageUrl,
          mangaId: x.mangaId,
          title: x.title,
          supertitle: void 0,
          metadata: void 0
        })),
        metadata: void 0
      };
    }
    async getPopularDiscoverSectionItems(section, metadata) {
      const offset = metadata?.offset ?? 0;
      const collectedIds = metadata?.collectedIds ?? [];
      const ratings = getRatings();
      const languages = getLanguages();
      const [_, buffer] = await Application.scheduleRequest({
        url: new URLBuilder(MANGADEX_API).addPath("manga").addQuery("limit", 100).addQuery("hasAvailableChapters", true).addQuery("availableTranslatedLanguage", languages).addQuery("order", { followedCount: "desc" }).addQuery("offset", offset).addQuery("contentRating", ratings).addQuery("includes", ["cover_art"]).build(),
        method: "GET"
      });
      const data = Application.arrayBufferToUTF8String(buffer);
      const json = typeof data === "string" ? JSON.parse(data) : data;
      if (json.data === void 0) {
        throw new Error(
          `Failed to parse json results for section ${section.title}`
        );
      }
      const items = await parseMangaList(
        json.data,
        COVER_BASE_URL,
        getHomepageThumbnail
      );
      const nextMetadata = items.length < 100 ? void 0 : { offset: offset + 100, collectedIds };
      return {
        items: items.map((x) => ({
          ...x,
          type: "prominentCarouselItem"
        })),
        metadata: nextMetadata
      };
    }
    async getLatestUpdatesDiscoverSectionItems(section, metadata) {
      const offset = metadata?.offset ?? 0;
      const collectedIds = metadata?.collectedIds ?? [];
      const ratings = getRatings();
      const languages = getLanguages();
      const [, buffer] = await Application.scheduleRequest({
        url: new URLBuilder(MANGADEX_API).addPath("manga").addQuery("limit", 100).addQuery("hasAvailableChapters", true).addQuery("availableTranslatedLanguage", languages).addQuery("order", { latestUploadedChapter: "desc" }).addQuery("offset", offset).addQuery("contentRating", ratings).addQuery("includes", ["cover_art"]).build(),
        method: "GET"
      });
      const data = Application.arrayBufferToUTF8String(buffer);
      const json = typeof data === "string" ? JSON.parse(data) : data;
      if (json.data === void 0) {
        throw new Error(
          `Failed to parse json results for section ${section.title}`
        );
      }
      const items = await parseMangaList(
        json.data,
        COVER_BASE_URL,
        getHomepageThumbnail
      );
      const [, chaptersBuffer] = await Application.scheduleRequest({
        url: new URLBuilder(MANGADEX_API).addPath("chapter").addQuery("limit", 100).addQuery(
          "ids",
          json.data.map((x) => x.attributes.latestUploadedChapter)
        ).build(),
        method: "GET"
      });
      const chaptersData = Application.arrayBufferToUTF8String(chaptersBuffer);
      const chapters = typeof data === "string" ? JSON.parse(chaptersData) : chaptersData;
      const chapterIdToChapter = {};
      for (const chapter of chapters.data) {
        chapterIdToChapter[chapter.id] = chapter;
      }
      const nextMetadata = items.length < 100 ? void 0 : { offset: offset + 100, collectedIds };
      return {
        items: items.map((x) => ({
          chapterId: x.attributes.latestUploadedChapter,
          imageUrl: x.imageUrl,
          mangaId: x.mangaId,
          title: x.title,
          subtitle: parseChapterTitle(
            chapterIdToChapter[x.attributes.latestUploadedChapter]?.attributes
          ),
          publishDate: new Date(
            chapterIdToChapter[x.attributes.latestUploadedChapter]?.attributes.readableAt
          ),
          type: "chapterUpdatesCarouselItem"
        })),
        metadata: nextMetadata
      };
    }
    async getRecentlyAddedDiscoverSectionItems(section, metadata) {
      const offset = metadata?.offset ?? 0;
      const collectedIds = metadata?.collectedIds ?? [];
      const ratings = getRatings();
      const languages = getLanguages();
      const [_, buffer] = await Application.scheduleRequest({
        url: new URLBuilder(MANGADEX_API).addPath("manga").addQuery("limit", 100).addQuery("hasAvailableChapters", true).addQuery("availableTranslatedLanguage", languages).addQuery("order", { createdAt: "desc" }).addQuery("offset", offset).addQuery("contentRating", ratings).addQuery("includes", ["cover_art"]).build(),
        method: "GET"
      });
      const data = Application.arrayBufferToUTF8String(buffer);
      const json = typeof data === "string" ? JSON.parse(data) : data;
      if (json.data === void 0) {
        throw new Error(
          `Failed to parse json results for section ${section.title}`
        );
      }
      const items = await parseMangaList(
        json.data,
        COVER_BASE_URL,
        getHomepageThumbnail
      );
      const nextMetadata = items.length < 100 ? void 0 : { offset: offset + 100, collectedIds };
      return {
        items: items.map((x) => ({
          ...x,
          type: "simpleCarouselItem"
        })),
        metadata: nextMetadata
      };
    }
    async prepareLibraryItems() {
      throw new Error("Method not implemented.");
    }
    async getManagedLibraryCollections() {
      return [
        { id: "reading", title: "Reading" },
        { id: "plan_to_read", title: "Planned" },
        { id: "completed", title: "Completed" },
        { id: "dropped", title: "Dropped" }
      ];
    }
    async commitManagedCollectionChanges(changeset) {
      if (!getAccessToken()) {
        throw new Error("You need to be logged in");
      }
      for (const addition of changeset.additions) {
        await Application.scheduleRequest({
          url: new URLBuilder(MANGADEX_API).addPath("manga").addPath(addition.mangaId).addPath("status").build(),
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: {
            status: changeset.collection.id
          }
        });
      }
      for (const deletion of changeset.deletions) {
        await Application.scheduleRequest({
          url: new URLBuilder(MANGADEX_API).addPath("manga").addPath(deletion.mangaId).addPath("status").build(),
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status: null })
        });
      }
    }
    async getSourceMangaInManagedCollection(managedCollection) {
      if (!getAccessToken()) {
        throw new Error("You need to be logged in");
      }
      const [_, buffer] = await Application.scheduleRequest({
        url: new URLBuilder(MANGADEX_API).addPath("manga").addPath("status").build(),
        method: "get"
      });
      const json = JSON.parse(Application.arrayBufferToUTF8String(buffer));
      if (json.result == "error") {
        throw new Error(JSON.stringify(json.errors));
      }
      const statuses = json["statuses"];
      const ids = Object.keys(statuses).filter(
        (x) => statuses[x] == managedCollection.id
      );
      let hasResults = true;
      let offset = 0;
      const limit = 100;
      const items = [];
      while (hasResults) {
        const batch = ids.slice(offset, offset + limit);
        const [_2, buffer2] = await Application.scheduleRequest({
          url: new URLBuilder(MANGADEX_API).addPath("manga").addQuery("ids", batch).addQuery("includes", ["author", "artist", "cover_art"]).addQuery("contentRating", [
            "safe",
            "suggestive",
            "erotica",
            "pornographic"
          ]).addQuery("limit", limit).build(),
          method: "get"
        });
        const json2 = JSON.parse(
          Application.arrayBufferToUTF8String(buffer2)
        );
        if (json2.result == "error") {
          throw new Error(JSON.stringify(json2.errors));
        }
        for (const item of json2.data) {
          items.push(
            parseMangaDetails(item.id, COVER_BASE_URL, { data: item })
          );
        }
        hasResults = batch.length >= limit;
        offset += batch.length;
      }
      return items;
    }
    checkId(id) {
      if (!id.includes("-")) {
        throw new Error(
          "OLD ID: PLEASE REFRESH AND CLEAR ORPHANED CHAPTERS"
        );
      }
    }
  };
  var MangaDex = new MangaDexExtension();
  return __toCommonJS(main_exports);
})();
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/
