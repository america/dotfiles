/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 8826:
/***/ (function(module) {

/*! MIT License. Copyright 2015-2018 Richard Moore <me@ricmoo.com>. See LICENSE.txt. */
(function(root) {
    "use strict";

    function checkInt(value) {
        return (parseInt(value) === value);
    }

    function checkInts(arrayish) {
        if (!checkInt(arrayish.length)) { return false; }

        for (var i = 0; i < arrayish.length; i++) {
            if (!checkInt(arrayish[i]) || arrayish[i] < 0 || arrayish[i] > 255) {
                return false;
            }
        }

        return true;
    }

    function coerceArray(arg, copy) {

        // ArrayBuffer view
        if (arg.buffer && arg.name === 'Uint8Array') {

            if (copy) {
                if (arg.slice) {
                    arg = arg.slice();
                } else {
                    arg = Array.prototype.slice.call(arg);
                }
            }

            return arg;
        }

        // It's an array; check it is a valid representation of a byte
        if (Array.isArray(arg)) {
            if (!checkInts(arg)) {
                throw new Error('Array contains invalid value: ' + arg);
            }

            return new Uint8Array(arg);
        }

        // Something else, but behaves like an array (maybe a Buffer? Arguments?)
        if (checkInt(arg.length) && checkInts(arg)) {
            return new Uint8Array(arg);
        }

        throw new Error('unsupported array-like object');
    }

    function createArray(length) {
        return new Uint8Array(length);
    }

    function copyArray(sourceArray, targetArray, targetStart, sourceStart, sourceEnd) {
        if (sourceStart != null || sourceEnd != null) {
            if (sourceArray.slice) {
                sourceArray = sourceArray.slice(sourceStart, sourceEnd);
            } else {
                sourceArray = Array.prototype.slice.call(sourceArray, sourceStart, sourceEnd);
            }
        }
        targetArray.set(sourceArray, targetStart);
    }



    var convertUtf8 = (function() {
        function toBytes(text) {
            var result = [], i = 0;
            text = encodeURI(text);
            while (i < text.length) {
                var c = text.charCodeAt(i++);

                // if it is a % sign, encode the following 2 bytes as a hex value
                if (c === 37) {
                    result.push(parseInt(text.substr(i, 2), 16))
                    i += 2;

                // otherwise, just the actual byte
                } else {
                    result.push(c)
                }
            }

            return coerceArray(result);
        }

        function fromBytes(bytes) {
            var result = [], i = 0;

            while (i < bytes.length) {
                var c = bytes[i];

                if (c < 128) {
                    result.push(String.fromCharCode(c));
                    i++;
                } else if (c > 191 && c < 224) {
                    result.push(String.fromCharCode(((c & 0x1f) << 6) | (bytes[i + 1] & 0x3f)));
                    i += 2;
                } else {
                    result.push(String.fromCharCode(((c & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f)));
                    i += 3;
                }
            }

            return result.join('');
        }

        return {
            toBytes: toBytes,
            fromBytes: fromBytes,
        }
    })();

    var convertHex = (function() {
        function toBytes(text) {
            var result = [];
            for (var i = 0; i < text.length; i += 2) {
                result.push(parseInt(text.substr(i, 2), 16));
            }

            return result;
        }

        // http://ixti.net/development/javascript/2011/11/11/base64-encodedecode-of-utf8-in-browser-with-js.html
        var Hex = '0123456789abcdef';

        function fromBytes(bytes) {
                var result = [];
                for (var i = 0; i < bytes.length; i++) {
                    var v = bytes[i];
                    result.push(Hex[(v & 0xf0) >> 4] + Hex[v & 0x0f]);
                }
                return result.join('');
        }

        return {
            toBytes: toBytes,
            fromBytes: fromBytes,
        }
    })();


    // Number of rounds by keysize
    var numberOfRounds = {16: 10, 24: 12, 32: 14}

    // Round constant words
    var rcon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91];

    // S-box and Inverse S-box (S is for Substitution)
    var S = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16];
    var Si =[0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e, 0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84, 0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73, 0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4, 0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61, 0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d];

    // Transformations for encryption
    var T1 = [0xc66363a5, 0xf87c7c84, 0xee777799, 0xf67b7b8d, 0xfff2f20d, 0xd66b6bbd, 0xde6f6fb1, 0x91c5c554, 0x60303050, 0x02010103, 0xce6767a9, 0x562b2b7d, 0xe7fefe19, 0xb5d7d762, 0x4dababe6, 0xec76769a, 0x8fcaca45, 0x1f82829d, 0x89c9c940, 0xfa7d7d87, 0xeffafa15, 0xb25959eb, 0x8e4747c9, 0xfbf0f00b, 0x41adadec, 0xb3d4d467, 0x5fa2a2fd, 0x45afafea, 0x239c9cbf, 0x53a4a4f7, 0xe4727296, 0x9bc0c05b, 0x75b7b7c2, 0xe1fdfd1c, 0x3d9393ae, 0x4c26266a, 0x6c36365a, 0x7e3f3f41, 0xf5f7f702, 0x83cccc4f, 0x6834345c, 0x51a5a5f4, 0xd1e5e534, 0xf9f1f108, 0xe2717193, 0xabd8d873, 0x62313153, 0x2a15153f, 0x0804040c, 0x95c7c752, 0x46232365, 0x9dc3c35e, 0x30181828, 0x379696a1, 0x0a05050f, 0x2f9a9ab5, 0x0e070709, 0x24121236, 0x1b80809b, 0xdfe2e23d, 0xcdebeb26, 0x4e272769, 0x7fb2b2cd, 0xea75759f, 0x1209091b, 0x1d83839e, 0x582c2c74, 0x341a1a2e, 0x361b1b2d, 0xdc6e6eb2, 0xb45a5aee, 0x5ba0a0fb, 0xa45252f6, 0x763b3b4d, 0xb7d6d661, 0x7db3b3ce, 0x5229297b, 0xdde3e33e, 0x5e2f2f71, 0x13848497, 0xa65353f5, 0xb9d1d168, 0x00000000, 0xc1eded2c, 0x40202060, 0xe3fcfc1f, 0x79b1b1c8, 0xb65b5bed, 0xd46a6abe, 0x8dcbcb46, 0x67bebed9, 0x7239394b, 0x944a4ade, 0x984c4cd4, 0xb05858e8, 0x85cfcf4a, 0xbbd0d06b, 0xc5efef2a, 0x4faaaae5, 0xedfbfb16, 0x864343c5, 0x9a4d4dd7, 0x66333355, 0x11858594, 0x8a4545cf, 0xe9f9f910, 0x04020206, 0xfe7f7f81, 0xa05050f0, 0x783c3c44, 0x259f9fba, 0x4ba8a8e3, 0xa25151f3, 0x5da3a3fe, 0x804040c0, 0x058f8f8a, 0x3f9292ad, 0x219d9dbc, 0x70383848, 0xf1f5f504, 0x63bcbcdf, 0x77b6b6c1, 0xafdada75, 0x42212163, 0x20101030, 0xe5ffff1a, 0xfdf3f30e, 0xbfd2d26d, 0x81cdcd4c, 0x180c0c14, 0x26131335, 0xc3ecec2f, 0xbe5f5fe1, 0x359797a2, 0x884444cc, 0x2e171739, 0x93c4c457, 0x55a7a7f2, 0xfc7e7e82, 0x7a3d3d47, 0xc86464ac, 0xba5d5de7, 0x3219192b, 0xe6737395, 0xc06060a0, 0x19818198, 0x9e4f4fd1, 0xa3dcdc7f, 0x44222266, 0x542a2a7e, 0x3b9090ab, 0x0b888883, 0x8c4646ca, 0xc7eeee29, 0x6bb8b8d3, 0x2814143c, 0xa7dede79, 0xbc5e5ee2, 0x160b0b1d, 0xaddbdb76, 0xdbe0e03b, 0x64323256, 0x743a3a4e, 0x140a0a1e, 0x924949db, 0x0c06060a, 0x4824246c, 0xb85c5ce4, 0x9fc2c25d, 0xbdd3d36e, 0x43acacef, 0xc46262a6, 0x399191a8, 0x319595a4, 0xd3e4e437, 0xf279798b, 0xd5e7e732, 0x8bc8c843, 0x6e373759, 0xda6d6db7, 0x018d8d8c, 0xb1d5d564, 0x9c4e4ed2, 0x49a9a9e0, 0xd86c6cb4, 0xac5656fa, 0xf3f4f407, 0xcfeaea25, 0xca6565af, 0xf47a7a8e, 0x47aeaee9, 0x10080818, 0x6fbabad5, 0xf0787888, 0x4a25256f, 0x5c2e2e72, 0x381c1c24, 0x57a6a6f1, 0x73b4b4c7, 0x97c6c651, 0xcbe8e823, 0xa1dddd7c, 0xe874749c, 0x3e1f1f21, 0x964b4bdd, 0x61bdbddc, 0x0d8b8b86, 0x0f8a8a85, 0xe0707090, 0x7c3e3e42, 0x71b5b5c4, 0xcc6666aa, 0x904848d8, 0x06030305, 0xf7f6f601, 0x1c0e0e12, 0xc26161a3, 0x6a35355f, 0xae5757f9, 0x69b9b9d0, 0x17868691, 0x99c1c158, 0x3a1d1d27, 0x279e9eb9, 0xd9e1e138, 0xebf8f813, 0x2b9898b3, 0x22111133, 0xd26969bb, 0xa9d9d970, 0x078e8e89, 0x339494a7, 0x2d9b9bb6, 0x3c1e1e22, 0x15878792, 0xc9e9e920, 0x87cece49, 0xaa5555ff, 0x50282878, 0xa5dfdf7a, 0x038c8c8f, 0x59a1a1f8, 0x09898980, 0x1a0d0d17, 0x65bfbfda, 0xd7e6e631, 0x844242c6, 0xd06868b8, 0x824141c3, 0x299999b0, 0x5a2d2d77, 0x1e0f0f11, 0x7bb0b0cb, 0xa85454fc, 0x6dbbbbd6, 0x2c16163a];
    var T2 = [0xa5c66363, 0x84f87c7c, 0x99ee7777, 0x8df67b7b, 0x0dfff2f2, 0xbdd66b6b, 0xb1de6f6f, 0x5491c5c5, 0x50603030, 0x03020101, 0xa9ce6767, 0x7d562b2b, 0x19e7fefe, 0x62b5d7d7, 0xe64dabab, 0x9aec7676, 0x458fcaca, 0x9d1f8282, 0x4089c9c9, 0x87fa7d7d, 0x15effafa, 0xebb25959, 0xc98e4747, 0x0bfbf0f0, 0xec41adad, 0x67b3d4d4, 0xfd5fa2a2, 0xea45afaf, 0xbf239c9c, 0xf753a4a4, 0x96e47272, 0x5b9bc0c0, 0xc275b7b7, 0x1ce1fdfd, 0xae3d9393, 0x6a4c2626, 0x5a6c3636, 0x417e3f3f, 0x02f5f7f7, 0x4f83cccc, 0x5c683434, 0xf451a5a5, 0x34d1e5e5, 0x08f9f1f1, 0x93e27171, 0x73abd8d8, 0x53623131, 0x3f2a1515, 0x0c080404, 0x5295c7c7, 0x65462323, 0x5e9dc3c3, 0x28301818, 0xa1379696, 0x0f0a0505, 0xb52f9a9a, 0x090e0707, 0x36241212, 0x9b1b8080, 0x3ddfe2e2, 0x26cdebeb, 0x694e2727, 0xcd7fb2b2, 0x9fea7575, 0x1b120909, 0x9e1d8383, 0x74582c2c, 0x2e341a1a, 0x2d361b1b, 0xb2dc6e6e, 0xeeb45a5a, 0xfb5ba0a0, 0xf6a45252, 0x4d763b3b, 0x61b7d6d6, 0xce7db3b3, 0x7b522929, 0x3edde3e3, 0x715e2f2f, 0x97138484, 0xf5a65353, 0x68b9d1d1, 0x00000000, 0x2cc1eded, 0x60402020, 0x1fe3fcfc, 0xc879b1b1, 0xedb65b5b, 0xbed46a6a, 0x468dcbcb, 0xd967bebe, 0x4b723939, 0xde944a4a, 0xd4984c4c, 0xe8b05858, 0x4a85cfcf, 0x6bbbd0d0, 0x2ac5efef, 0xe54faaaa, 0x16edfbfb, 0xc5864343, 0xd79a4d4d, 0x55663333, 0x94118585, 0xcf8a4545, 0x10e9f9f9, 0x06040202, 0x81fe7f7f, 0xf0a05050, 0x44783c3c, 0xba259f9f, 0xe34ba8a8, 0xf3a25151, 0xfe5da3a3, 0xc0804040, 0x8a058f8f, 0xad3f9292, 0xbc219d9d, 0x48703838, 0x04f1f5f5, 0xdf63bcbc, 0xc177b6b6, 0x75afdada, 0x63422121, 0x30201010, 0x1ae5ffff, 0x0efdf3f3, 0x6dbfd2d2, 0x4c81cdcd, 0x14180c0c, 0x35261313, 0x2fc3ecec, 0xe1be5f5f, 0xa2359797, 0xcc884444, 0x392e1717, 0x5793c4c4, 0xf255a7a7, 0x82fc7e7e, 0x477a3d3d, 0xacc86464, 0xe7ba5d5d, 0x2b321919, 0x95e67373, 0xa0c06060, 0x98198181, 0xd19e4f4f, 0x7fa3dcdc, 0x66442222, 0x7e542a2a, 0xab3b9090, 0x830b8888, 0xca8c4646, 0x29c7eeee, 0xd36bb8b8, 0x3c281414, 0x79a7dede, 0xe2bc5e5e, 0x1d160b0b, 0x76addbdb, 0x3bdbe0e0, 0x56643232, 0x4e743a3a, 0x1e140a0a, 0xdb924949, 0x0a0c0606, 0x6c482424, 0xe4b85c5c, 0x5d9fc2c2, 0x6ebdd3d3, 0xef43acac, 0xa6c46262, 0xa8399191, 0xa4319595, 0x37d3e4e4, 0x8bf27979, 0x32d5e7e7, 0x438bc8c8, 0x596e3737, 0xb7da6d6d, 0x8c018d8d, 0x64b1d5d5, 0xd29c4e4e, 0xe049a9a9, 0xb4d86c6c, 0xfaac5656, 0x07f3f4f4, 0x25cfeaea, 0xafca6565, 0x8ef47a7a, 0xe947aeae, 0x18100808, 0xd56fbaba, 0x88f07878, 0x6f4a2525, 0x725c2e2e, 0x24381c1c, 0xf157a6a6, 0xc773b4b4, 0x5197c6c6, 0x23cbe8e8, 0x7ca1dddd, 0x9ce87474, 0x213e1f1f, 0xdd964b4b, 0xdc61bdbd, 0x860d8b8b, 0x850f8a8a, 0x90e07070, 0x427c3e3e, 0xc471b5b5, 0xaacc6666, 0xd8904848, 0x05060303, 0x01f7f6f6, 0x121c0e0e, 0xa3c26161, 0x5f6a3535, 0xf9ae5757, 0xd069b9b9, 0x91178686, 0x5899c1c1, 0x273a1d1d, 0xb9279e9e, 0x38d9e1e1, 0x13ebf8f8, 0xb32b9898, 0x33221111, 0xbbd26969, 0x70a9d9d9, 0x89078e8e, 0xa7339494, 0xb62d9b9b, 0x223c1e1e, 0x92158787, 0x20c9e9e9, 0x4987cece, 0xffaa5555, 0x78502828, 0x7aa5dfdf, 0x8f038c8c, 0xf859a1a1, 0x80098989, 0x171a0d0d, 0xda65bfbf, 0x31d7e6e6, 0xc6844242, 0xb8d06868, 0xc3824141, 0xb0299999, 0x775a2d2d, 0x111e0f0f, 0xcb7bb0b0, 0xfca85454, 0xd66dbbbb, 0x3a2c1616];
    var T3 = [0x63a5c663, 0x7c84f87c, 0x7799ee77, 0x7b8df67b, 0xf20dfff2, 0x6bbdd66b, 0x6fb1de6f, 0xc55491c5, 0x30506030, 0x01030201, 0x67a9ce67, 0x2b7d562b, 0xfe19e7fe, 0xd762b5d7, 0xabe64dab, 0x769aec76, 0xca458fca, 0x829d1f82, 0xc94089c9, 0x7d87fa7d, 0xfa15effa, 0x59ebb259, 0x47c98e47, 0xf00bfbf0, 0xadec41ad, 0xd467b3d4, 0xa2fd5fa2, 0xafea45af, 0x9cbf239c, 0xa4f753a4, 0x7296e472, 0xc05b9bc0, 0xb7c275b7, 0xfd1ce1fd, 0x93ae3d93, 0x266a4c26, 0x365a6c36, 0x3f417e3f, 0xf702f5f7, 0xcc4f83cc, 0x345c6834, 0xa5f451a5, 0xe534d1e5, 0xf108f9f1, 0x7193e271, 0xd873abd8, 0x31536231, 0x153f2a15, 0x040c0804, 0xc75295c7, 0x23654623, 0xc35e9dc3, 0x18283018, 0x96a13796, 0x050f0a05, 0x9ab52f9a, 0x07090e07, 0x12362412, 0x809b1b80, 0xe23ddfe2, 0xeb26cdeb, 0x27694e27, 0xb2cd7fb2, 0x759fea75, 0x091b1209, 0x839e1d83, 0x2c74582c, 0x1a2e341a, 0x1b2d361b, 0x6eb2dc6e, 0x5aeeb45a, 0xa0fb5ba0, 0x52f6a452, 0x3b4d763b, 0xd661b7d6, 0xb3ce7db3, 0x297b5229, 0xe33edde3, 0x2f715e2f, 0x84971384, 0x53f5a653, 0xd168b9d1, 0x00000000, 0xed2cc1ed, 0x20604020, 0xfc1fe3fc, 0xb1c879b1, 0x5bedb65b, 0x6abed46a, 0xcb468dcb, 0xbed967be, 0x394b7239, 0x4ade944a, 0x4cd4984c, 0x58e8b058, 0xcf4a85cf, 0xd06bbbd0, 0xef2ac5ef, 0xaae54faa, 0xfb16edfb, 0x43c58643, 0x4dd79a4d, 0x33556633, 0x85941185, 0x45cf8a45, 0xf910e9f9, 0x02060402, 0x7f81fe7f, 0x50f0a050, 0x3c44783c, 0x9fba259f, 0xa8e34ba8, 0x51f3a251, 0xa3fe5da3, 0x40c08040, 0x8f8a058f, 0x92ad3f92, 0x9dbc219d, 0x38487038, 0xf504f1f5, 0xbcdf63bc, 0xb6c177b6, 0xda75afda, 0x21634221, 0x10302010, 0xff1ae5ff, 0xf30efdf3, 0xd26dbfd2, 0xcd4c81cd, 0x0c14180c, 0x13352613, 0xec2fc3ec, 0x5fe1be5f, 0x97a23597, 0x44cc8844, 0x17392e17, 0xc45793c4, 0xa7f255a7, 0x7e82fc7e, 0x3d477a3d, 0x64acc864, 0x5de7ba5d, 0x192b3219, 0x7395e673, 0x60a0c060, 0x81981981, 0x4fd19e4f, 0xdc7fa3dc, 0x22664422, 0x2a7e542a, 0x90ab3b90, 0x88830b88, 0x46ca8c46, 0xee29c7ee, 0xb8d36bb8, 0x143c2814, 0xde79a7de, 0x5ee2bc5e, 0x0b1d160b, 0xdb76addb, 0xe03bdbe0, 0x32566432, 0x3a4e743a, 0x0a1e140a, 0x49db9249, 0x060a0c06, 0x246c4824, 0x5ce4b85c, 0xc25d9fc2, 0xd36ebdd3, 0xacef43ac, 0x62a6c462, 0x91a83991, 0x95a43195, 0xe437d3e4, 0x798bf279, 0xe732d5e7, 0xc8438bc8, 0x37596e37, 0x6db7da6d, 0x8d8c018d, 0xd564b1d5, 0x4ed29c4e, 0xa9e049a9, 0x6cb4d86c, 0x56faac56, 0xf407f3f4, 0xea25cfea, 0x65afca65, 0x7a8ef47a, 0xaee947ae, 0x08181008, 0xbad56fba, 0x7888f078, 0x256f4a25, 0x2e725c2e, 0x1c24381c, 0xa6f157a6, 0xb4c773b4, 0xc65197c6, 0xe823cbe8, 0xdd7ca1dd, 0x749ce874, 0x1f213e1f, 0x4bdd964b, 0xbddc61bd, 0x8b860d8b, 0x8a850f8a, 0x7090e070, 0x3e427c3e, 0xb5c471b5, 0x66aacc66, 0x48d89048, 0x03050603, 0xf601f7f6, 0x0e121c0e, 0x61a3c261, 0x355f6a35, 0x57f9ae57, 0xb9d069b9, 0x86911786, 0xc15899c1, 0x1d273a1d, 0x9eb9279e, 0xe138d9e1, 0xf813ebf8, 0x98b32b98, 0x11332211, 0x69bbd269, 0xd970a9d9, 0x8e89078e, 0x94a73394, 0x9bb62d9b, 0x1e223c1e, 0x87921587, 0xe920c9e9, 0xce4987ce, 0x55ffaa55, 0x28785028, 0xdf7aa5df, 0x8c8f038c, 0xa1f859a1, 0x89800989, 0x0d171a0d, 0xbfda65bf, 0xe631d7e6, 0x42c68442, 0x68b8d068, 0x41c38241, 0x99b02999, 0x2d775a2d, 0x0f111e0f, 0xb0cb7bb0, 0x54fca854, 0xbbd66dbb, 0x163a2c16];
    var T4 = [0x6363a5c6, 0x7c7c84f8, 0x777799ee, 0x7b7b8df6, 0xf2f20dff, 0x6b6bbdd6, 0x6f6fb1de, 0xc5c55491, 0x30305060, 0x01010302, 0x6767a9ce, 0x2b2b7d56, 0xfefe19e7, 0xd7d762b5, 0xababe64d, 0x76769aec, 0xcaca458f, 0x82829d1f, 0xc9c94089, 0x7d7d87fa, 0xfafa15ef, 0x5959ebb2, 0x4747c98e, 0xf0f00bfb, 0xadadec41, 0xd4d467b3, 0xa2a2fd5f, 0xafafea45, 0x9c9cbf23, 0xa4a4f753, 0x727296e4, 0xc0c05b9b, 0xb7b7c275, 0xfdfd1ce1, 0x9393ae3d, 0x26266a4c, 0x36365a6c, 0x3f3f417e, 0xf7f702f5, 0xcccc4f83, 0x34345c68, 0xa5a5f451, 0xe5e534d1, 0xf1f108f9, 0x717193e2, 0xd8d873ab, 0x31315362, 0x15153f2a, 0x04040c08, 0xc7c75295, 0x23236546, 0xc3c35e9d, 0x18182830, 0x9696a137, 0x05050f0a, 0x9a9ab52f, 0x0707090e, 0x12123624, 0x80809b1b, 0xe2e23ddf, 0xebeb26cd, 0x2727694e, 0xb2b2cd7f, 0x75759fea, 0x09091b12, 0x83839e1d, 0x2c2c7458, 0x1a1a2e34, 0x1b1b2d36, 0x6e6eb2dc, 0x5a5aeeb4, 0xa0a0fb5b, 0x5252f6a4, 0x3b3b4d76, 0xd6d661b7, 0xb3b3ce7d, 0x29297b52, 0xe3e33edd, 0x2f2f715e, 0x84849713, 0x5353f5a6, 0xd1d168b9, 0x00000000, 0xeded2cc1, 0x20206040, 0xfcfc1fe3, 0xb1b1c879, 0x5b5bedb6, 0x6a6abed4, 0xcbcb468d, 0xbebed967, 0x39394b72, 0x4a4ade94, 0x4c4cd498, 0x5858e8b0, 0xcfcf4a85, 0xd0d06bbb, 0xefef2ac5, 0xaaaae54f, 0xfbfb16ed, 0x4343c586, 0x4d4dd79a, 0x33335566, 0x85859411, 0x4545cf8a, 0xf9f910e9, 0x02020604, 0x7f7f81fe, 0x5050f0a0, 0x3c3c4478, 0x9f9fba25, 0xa8a8e34b, 0x5151f3a2, 0xa3a3fe5d, 0x4040c080, 0x8f8f8a05, 0x9292ad3f, 0x9d9dbc21, 0x38384870, 0xf5f504f1, 0xbcbcdf63, 0xb6b6c177, 0xdada75af, 0x21216342, 0x10103020, 0xffff1ae5, 0xf3f30efd, 0xd2d26dbf, 0xcdcd4c81, 0x0c0c1418, 0x13133526, 0xecec2fc3, 0x5f5fe1be, 0x9797a235, 0x4444cc88, 0x1717392e, 0xc4c45793, 0xa7a7f255, 0x7e7e82fc, 0x3d3d477a, 0x6464acc8, 0x5d5de7ba, 0x19192b32, 0x737395e6, 0x6060a0c0, 0x81819819, 0x4f4fd19e, 0xdcdc7fa3, 0x22226644, 0x2a2a7e54, 0x9090ab3b, 0x8888830b, 0x4646ca8c, 0xeeee29c7, 0xb8b8d36b, 0x14143c28, 0xdede79a7, 0x5e5ee2bc, 0x0b0b1d16, 0xdbdb76ad, 0xe0e03bdb, 0x32325664, 0x3a3a4e74, 0x0a0a1e14, 0x4949db92, 0x06060a0c, 0x24246c48, 0x5c5ce4b8, 0xc2c25d9f, 0xd3d36ebd, 0xacacef43, 0x6262a6c4, 0x9191a839, 0x9595a431, 0xe4e437d3, 0x79798bf2, 0xe7e732d5, 0xc8c8438b, 0x3737596e, 0x6d6db7da, 0x8d8d8c01, 0xd5d564b1, 0x4e4ed29c, 0xa9a9e049, 0x6c6cb4d8, 0x5656faac, 0xf4f407f3, 0xeaea25cf, 0x6565afca, 0x7a7a8ef4, 0xaeaee947, 0x08081810, 0xbabad56f, 0x787888f0, 0x25256f4a, 0x2e2e725c, 0x1c1c2438, 0xa6a6f157, 0xb4b4c773, 0xc6c65197, 0xe8e823cb, 0xdddd7ca1, 0x74749ce8, 0x1f1f213e, 0x4b4bdd96, 0xbdbddc61, 0x8b8b860d, 0x8a8a850f, 0x707090e0, 0x3e3e427c, 0xb5b5c471, 0x6666aacc, 0x4848d890, 0x03030506, 0xf6f601f7, 0x0e0e121c, 0x6161a3c2, 0x35355f6a, 0x5757f9ae, 0xb9b9d069, 0x86869117, 0xc1c15899, 0x1d1d273a, 0x9e9eb927, 0xe1e138d9, 0xf8f813eb, 0x9898b32b, 0x11113322, 0x6969bbd2, 0xd9d970a9, 0x8e8e8907, 0x9494a733, 0x9b9bb62d, 0x1e1e223c, 0x87879215, 0xe9e920c9, 0xcece4987, 0x5555ffaa, 0x28287850, 0xdfdf7aa5, 0x8c8c8f03, 0xa1a1f859, 0x89898009, 0x0d0d171a, 0xbfbfda65, 0xe6e631d7, 0x4242c684, 0x6868b8d0, 0x4141c382, 0x9999b029, 0x2d2d775a, 0x0f0f111e, 0xb0b0cb7b, 0x5454fca8, 0xbbbbd66d, 0x16163a2c];

    // Transformations for decryption
    var T5 = [0x51f4a750, 0x7e416553, 0x1a17a4c3, 0x3a275e96, 0x3bab6bcb, 0x1f9d45f1, 0xacfa58ab, 0x4be30393, 0x2030fa55, 0xad766df6, 0x88cc7691, 0xf5024c25, 0x4fe5d7fc, 0xc52acbd7, 0x26354480, 0xb562a38f, 0xdeb15a49, 0x25ba1b67, 0x45ea0e98, 0x5dfec0e1, 0xc32f7502, 0x814cf012, 0x8d4697a3, 0x6bd3f9c6, 0x038f5fe7, 0x15929c95, 0xbf6d7aeb, 0x955259da, 0xd4be832d, 0x587421d3, 0x49e06929, 0x8ec9c844, 0x75c2896a, 0xf48e7978, 0x99583e6b, 0x27b971dd, 0xbee14fb6, 0xf088ad17, 0xc920ac66, 0x7dce3ab4, 0x63df4a18, 0xe51a3182, 0x97513360, 0x62537f45, 0xb16477e0, 0xbb6bae84, 0xfe81a01c, 0xf9082b94, 0x70486858, 0x8f45fd19, 0x94de6c87, 0x527bf8b7, 0xab73d323, 0x724b02e2, 0xe31f8f57, 0x6655ab2a, 0xb2eb2807, 0x2fb5c203, 0x86c57b9a, 0xd33708a5, 0x302887f2, 0x23bfa5b2, 0x02036aba, 0xed16825c, 0x8acf1c2b, 0xa779b492, 0xf307f2f0, 0x4e69e2a1, 0x65daf4cd, 0x0605bed5, 0xd134621f, 0xc4a6fe8a, 0x342e539d, 0xa2f355a0, 0x058ae132, 0xa4f6eb75, 0x0b83ec39, 0x4060efaa, 0x5e719f06, 0xbd6e1051, 0x3e218af9, 0x96dd063d, 0xdd3e05ae, 0x4de6bd46, 0x91548db5, 0x71c45d05, 0x0406d46f, 0x605015ff, 0x1998fb24, 0xd6bde997, 0x894043cc, 0x67d99e77, 0xb0e842bd, 0x07898b88, 0xe7195b38, 0x79c8eedb, 0xa17c0a47, 0x7c420fe9, 0xf8841ec9, 0x00000000, 0x09808683, 0x322bed48, 0x1e1170ac, 0x6c5a724e, 0xfd0efffb, 0x0f853856, 0x3daed51e, 0x362d3927, 0x0a0fd964, 0x685ca621, 0x9b5b54d1, 0x24362e3a, 0x0c0a67b1, 0x9357e70f, 0xb4ee96d2, 0x1b9b919e, 0x80c0c54f, 0x61dc20a2, 0x5a774b69, 0x1c121a16, 0xe293ba0a, 0xc0a02ae5, 0x3c22e043, 0x121b171d, 0x0e090d0b, 0xf28bc7ad, 0x2db6a8b9, 0x141ea9c8, 0x57f11985, 0xaf75074c, 0xee99ddbb, 0xa37f60fd, 0xf701269f, 0x5c72f5bc, 0x44663bc5, 0x5bfb7e34, 0x8b432976, 0xcb23c6dc, 0xb6edfc68, 0xb8e4f163, 0xd731dcca, 0x42638510, 0x13972240, 0x84c61120, 0x854a247d, 0xd2bb3df8, 0xaef93211, 0xc729a16d, 0x1d9e2f4b, 0xdcb230f3, 0x0d8652ec, 0x77c1e3d0, 0x2bb3166c, 0xa970b999, 0x119448fa, 0x47e96422, 0xa8fc8cc4, 0xa0f03f1a, 0x567d2cd8, 0x223390ef, 0x87494ec7, 0xd938d1c1, 0x8ccaa2fe, 0x98d40b36, 0xa6f581cf, 0xa57ade28, 0xdab78e26, 0x3fadbfa4, 0x2c3a9de4, 0x5078920d, 0x6a5fcc9b, 0x547e4662, 0xf68d13c2, 0x90d8b8e8, 0x2e39f75e, 0x82c3aff5, 0x9f5d80be, 0x69d0937c, 0x6fd52da9, 0xcf2512b3, 0xc8ac993b, 0x10187da7, 0xe89c636e, 0xdb3bbb7b, 0xcd267809, 0x6e5918f4, 0xec9ab701, 0x834f9aa8, 0xe6956e65, 0xaaffe67e, 0x21bccf08, 0xef15e8e6, 0xbae79bd9, 0x4a6f36ce, 0xea9f09d4, 0x29b07cd6, 0x31a4b2af, 0x2a3f2331, 0xc6a59430, 0x35a266c0, 0x744ebc37, 0xfc82caa6, 0xe090d0b0, 0x33a7d815, 0xf104984a, 0x41ecdaf7, 0x7fcd500e, 0x1791f62f, 0x764dd68d, 0x43efb04d, 0xccaa4d54, 0xe49604df, 0x9ed1b5e3, 0x4c6a881b, 0xc12c1fb8, 0x4665517f, 0x9d5eea04, 0x018c355d, 0xfa877473, 0xfb0b412e, 0xb3671d5a, 0x92dbd252, 0xe9105633, 0x6dd64713, 0x9ad7618c, 0x37a10c7a, 0x59f8148e, 0xeb133c89, 0xcea927ee, 0xb761c935, 0xe11ce5ed, 0x7a47b13c, 0x9cd2df59, 0x55f2733f, 0x1814ce79, 0x73c737bf, 0x53f7cdea, 0x5ffdaa5b, 0xdf3d6f14, 0x7844db86, 0xcaaff381, 0xb968c43e, 0x3824342c, 0xc2a3405f, 0x161dc372, 0xbce2250c, 0x283c498b, 0xff0d9541, 0x39a80171, 0x080cb3de, 0xd8b4e49c, 0x6456c190, 0x7bcb8461, 0xd532b670, 0x486c5c74, 0xd0b85742];
    var T6 = [0x5051f4a7, 0x537e4165, 0xc31a17a4, 0x963a275e, 0xcb3bab6b, 0xf11f9d45, 0xabacfa58, 0x934be303, 0x552030fa, 0xf6ad766d, 0x9188cc76, 0x25f5024c, 0xfc4fe5d7, 0xd7c52acb, 0x80263544, 0x8fb562a3, 0x49deb15a, 0x6725ba1b, 0x9845ea0e, 0xe15dfec0, 0x02c32f75, 0x12814cf0, 0xa38d4697, 0xc66bd3f9, 0xe7038f5f, 0x9515929c, 0xebbf6d7a, 0xda955259, 0x2dd4be83, 0xd3587421, 0x2949e069, 0x448ec9c8, 0x6a75c289, 0x78f48e79, 0x6b99583e, 0xdd27b971, 0xb6bee14f, 0x17f088ad, 0x66c920ac, 0xb47dce3a, 0x1863df4a, 0x82e51a31, 0x60975133, 0x4562537f, 0xe0b16477, 0x84bb6bae, 0x1cfe81a0, 0x94f9082b, 0x58704868, 0x198f45fd, 0x8794de6c, 0xb7527bf8, 0x23ab73d3, 0xe2724b02, 0x57e31f8f, 0x2a6655ab, 0x07b2eb28, 0x032fb5c2, 0x9a86c57b, 0xa5d33708, 0xf2302887, 0xb223bfa5, 0xba02036a, 0x5ced1682, 0x2b8acf1c, 0x92a779b4, 0xf0f307f2, 0xa14e69e2, 0xcd65daf4, 0xd50605be, 0x1fd13462, 0x8ac4a6fe, 0x9d342e53, 0xa0a2f355, 0x32058ae1, 0x75a4f6eb, 0x390b83ec, 0xaa4060ef, 0x065e719f, 0x51bd6e10, 0xf93e218a, 0x3d96dd06, 0xaedd3e05, 0x464de6bd, 0xb591548d, 0x0571c45d, 0x6f0406d4, 0xff605015, 0x241998fb, 0x97d6bde9, 0xcc894043, 0x7767d99e, 0xbdb0e842, 0x8807898b, 0x38e7195b, 0xdb79c8ee, 0x47a17c0a, 0xe97c420f, 0xc9f8841e, 0x00000000, 0x83098086, 0x48322bed, 0xac1e1170, 0x4e6c5a72, 0xfbfd0eff, 0x560f8538, 0x1e3daed5, 0x27362d39, 0x640a0fd9, 0x21685ca6, 0xd19b5b54, 0x3a24362e, 0xb10c0a67, 0x0f9357e7, 0xd2b4ee96, 0x9e1b9b91, 0x4f80c0c5, 0xa261dc20, 0x695a774b, 0x161c121a, 0x0ae293ba, 0xe5c0a02a, 0x433c22e0, 0x1d121b17, 0x0b0e090d, 0xadf28bc7, 0xb92db6a8, 0xc8141ea9, 0x8557f119, 0x4caf7507, 0xbbee99dd, 0xfda37f60, 0x9ff70126, 0xbc5c72f5, 0xc544663b, 0x345bfb7e, 0x768b4329, 0xdccb23c6, 0x68b6edfc, 0x63b8e4f1, 0xcad731dc, 0x10426385, 0x40139722, 0x2084c611, 0x7d854a24, 0xf8d2bb3d, 0x11aef932, 0x6dc729a1, 0x4b1d9e2f, 0xf3dcb230, 0xec0d8652, 0xd077c1e3, 0x6c2bb316, 0x99a970b9, 0xfa119448, 0x2247e964, 0xc4a8fc8c, 0x1aa0f03f, 0xd8567d2c, 0xef223390, 0xc787494e, 0xc1d938d1, 0xfe8ccaa2, 0x3698d40b, 0xcfa6f581, 0x28a57ade, 0x26dab78e, 0xa43fadbf, 0xe42c3a9d, 0x0d507892, 0x9b6a5fcc, 0x62547e46, 0xc2f68d13, 0xe890d8b8, 0x5e2e39f7, 0xf582c3af, 0xbe9f5d80, 0x7c69d093, 0xa96fd52d, 0xb3cf2512, 0x3bc8ac99, 0xa710187d, 0x6ee89c63, 0x7bdb3bbb, 0x09cd2678, 0xf46e5918, 0x01ec9ab7, 0xa8834f9a, 0x65e6956e, 0x7eaaffe6, 0x0821bccf, 0xe6ef15e8, 0xd9bae79b, 0xce4a6f36, 0xd4ea9f09, 0xd629b07c, 0xaf31a4b2, 0x312a3f23, 0x30c6a594, 0xc035a266, 0x37744ebc, 0xa6fc82ca, 0xb0e090d0, 0x1533a7d8, 0x4af10498, 0xf741ecda, 0x0e7fcd50, 0x2f1791f6, 0x8d764dd6, 0x4d43efb0, 0x54ccaa4d, 0xdfe49604, 0xe39ed1b5, 0x1b4c6a88, 0xb8c12c1f, 0x7f466551, 0x049d5eea, 0x5d018c35, 0x73fa8774, 0x2efb0b41, 0x5ab3671d, 0x5292dbd2, 0x33e91056, 0x136dd647, 0x8c9ad761, 0x7a37a10c, 0x8e59f814, 0x89eb133c, 0xeecea927, 0x35b761c9, 0xede11ce5, 0x3c7a47b1, 0x599cd2df, 0x3f55f273, 0x791814ce, 0xbf73c737, 0xea53f7cd, 0x5b5ffdaa, 0x14df3d6f, 0x867844db, 0x81caaff3, 0x3eb968c4, 0x2c382434, 0x5fc2a340, 0x72161dc3, 0x0cbce225, 0x8b283c49, 0x41ff0d95, 0x7139a801, 0xde080cb3, 0x9cd8b4e4, 0x906456c1, 0x617bcb84, 0x70d532b6, 0x74486c5c, 0x42d0b857];
    var T7 = [0xa75051f4, 0x65537e41, 0xa4c31a17, 0x5e963a27, 0x6bcb3bab, 0x45f11f9d, 0x58abacfa, 0x03934be3, 0xfa552030, 0x6df6ad76, 0x769188cc, 0x4c25f502, 0xd7fc4fe5, 0xcbd7c52a, 0x44802635, 0xa38fb562, 0x5a49deb1, 0x1b6725ba, 0x0e9845ea, 0xc0e15dfe, 0x7502c32f, 0xf012814c, 0x97a38d46, 0xf9c66bd3, 0x5fe7038f, 0x9c951592, 0x7aebbf6d, 0x59da9552, 0x832dd4be, 0x21d35874, 0x692949e0, 0xc8448ec9, 0x896a75c2, 0x7978f48e, 0x3e6b9958, 0x71dd27b9, 0x4fb6bee1, 0xad17f088, 0xac66c920, 0x3ab47dce, 0x4a1863df, 0x3182e51a, 0x33609751, 0x7f456253, 0x77e0b164, 0xae84bb6b, 0xa01cfe81, 0x2b94f908, 0x68587048, 0xfd198f45, 0x6c8794de, 0xf8b7527b, 0xd323ab73, 0x02e2724b, 0x8f57e31f, 0xab2a6655, 0x2807b2eb, 0xc2032fb5, 0x7b9a86c5, 0x08a5d337, 0x87f23028, 0xa5b223bf, 0x6aba0203, 0x825ced16, 0x1c2b8acf, 0xb492a779, 0xf2f0f307, 0xe2a14e69, 0xf4cd65da, 0xbed50605, 0x621fd134, 0xfe8ac4a6, 0x539d342e, 0x55a0a2f3, 0xe132058a, 0xeb75a4f6, 0xec390b83, 0xefaa4060, 0x9f065e71, 0x1051bd6e, 0x8af93e21, 0x063d96dd, 0x05aedd3e, 0xbd464de6, 0x8db59154, 0x5d0571c4, 0xd46f0406, 0x15ff6050, 0xfb241998, 0xe997d6bd, 0x43cc8940, 0x9e7767d9, 0x42bdb0e8, 0x8b880789, 0x5b38e719, 0xeedb79c8, 0x0a47a17c, 0x0fe97c42, 0x1ec9f884, 0x00000000, 0x86830980, 0xed48322b, 0x70ac1e11, 0x724e6c5a, 0xfffbfd0e, 0x38560f85, 0xd51e3dae, 0x3927362d, 0xd9640a0f, 0xa621685c, 0x54d19b5b, 0x2e3a2436, 0x67b10c0a, 0xe70f9357, 0x96d2b4ee, 0x919e1b9b, 0xc54f80c0, 0x20a261dc, 0x4b695a77, 0x1a161c12, 0xba0ae293, 0x2ae5c0a0, 0xe0433c22, 0x171d121b, 0x0d0b0e09, 0xc7adf28b, 0xa8b92db6, 0xa9c8141e, 0x198557f1, 0x074caf75, 0xddbbee99, 0x60fda37f, 0x269ff701, 0xf5bc5c72, 0x3bc54466, 0x7e345bfb, 0x29768b43, 0xc6dccb23, 0xfc68b6ed, 0xf163b8e4, 0xdccad731, 0x85104263, 0x22401397, 0x112084c6, 0x247d854a, 0x3df8d2bb, 0x3211aef9, 0xa16dc729, 0x2f4b1d9e, 0x30f3dcb2, 0x52ec0d86, 0xe3d077c1, 0x166c2bb3, 0xb999a970, 0x48fa1194, 0x642247e9, 0x8cc4a8fc, 0x3f1aa0f0, 0x2cd8567d, 0x90ef2233, 0x4ec78749, 0xd1c1d938, 0xa2fe8cca, 0x0b3698d4, 0x81cfa6f5, 0xde28a57a, 0x8e26dab7, 0xbfa43fad, 0x9de42c3a, 0x920d5078, 0xcc9b6a5f, 0x4662547e, 0x13c2f68d, 0xb8e890d8, 0xf75e2e39, 0xaff582c3, 0x80be9f5d, 0x937c69d0, 0x2da96fd5, 0x12b3cf25, 0x993bc8ac, 0x7da71018, 0x636ee89c, 0xbb7bdb3b, 0x7809cd26, 0x18f46e59, 0xb701ec9a, 0x9aa8834f, 0x6e65e695, 0xe67eaaff, 0xcf0821bc, 0xe8e6ef15, 0x9bd9bae7, 0x36ce4a6f, 0x09d4ea9f, 0x7cd629b0, 0xb2af31a4, 0x23312a3f, 0x9430c6a5, 0x66c035a2, 0xbc37744e, 0xcaa6fc82, 0xd0b0e090, 0xd81533a7, 0x984af104, 0xdaf741ec, 0x500e7fcd, 0xf62f1791, 0xd68d764d, 0xb04d43ef, 0x4d54ccaa, 0x04dfe496, 0xb5e39ed1, 0x881b4c6a, 0x1fb8c12c, 0x517f4665, 0xea049d5e, 0x355d018c, 0x7473fa87, 0x412efb0b, 0x1d5ab367, 0xd25292db, 0x5633e910, 0x47136dd6, 0x618c9ad7, 0x0c7a37a1, 0x148e59f8, 0x3c89eb13, 0x27eecea9, 0xc935b761, 0xe5ede11c, 0xb13c7a47, 0xdf599cd2, 0x733f55f2, 0xce791814, 0x37bf73c7, 0xcdea53f7, 0xaa5b5ffd, 0x6f14df3d, 0xdb867844, 0xf381caaf, 0xc43eb968, 0x342c3824, 0x405fc2a3, 0xc372161d, 0x250cbce2, 0x498b283c, 0x9541ff0d, 0x017139a8, 0xb3de080c, 0xe49cd8b4, 0xc1906456, 0x84617bcb, 0xb670d532, 0x5c74486c, 0x5742d0b8];
    var T8 = [0xf4a75051, 0x4165537e, 0x17a4c31a, 0x275e963a, 0xab6bcb3b, 0x9d45f11f, 0xfa58abac, 0xe303934b, 0x30fa5520, 0x766df6ad, 0xcc769188, 0x024c25f5, 0xe5d7fc4f, 0x2acbd7c5, 0x35448026, 0x62a38fb5, 0xb15a49de, 0xba1b6725, 0xea0e9845, 0xfec0e15d, 0x2f7502c3, 0x4cf01281, 0x4697a38d, 0xd3f9c66b, 0x8f5fe703, 0x929c9515, 0x6d7aebbf, 0x5259da95, 0xbe832dd4, 0x7421d358, 0xe0692949, 0xc9c8448e, 0xc2896a75, 0x8e7978f4, 0x583e6b99, 0xb971dd27, 0xe14fb6be, 0x88ad17f0, 0x20ac66c9, 0xce3ab47d, 0xdf4a1863, 0x1a3182e5, 0x51336097, 0x537f4562, 0x6477e0b1, 0x6bae84bb, 0x81a01cfe, 0x082b94f9, 0x48685870, 0x45fd198f, 0xde6c8794, 0x7bf8b752, 0x73d323ab, 0x4b02e272, 0x1f8f57e3, 0x55ab2a66, 0xeb2807b2, 0xb5c2032f, 0xc57b9a86, 0x3708a5d3, 0x2887f230, 0xbfa5b223, 0x036aba02, 0x16825ced, 0xcf1c2b8a, 0x79b492a7, 0x07f2f0f3, 0x69e2a14e, 0xdaf4cd65, 0x05bed506, 0x34621fd1, 0xa6fe8ac4, 0x2e539d34, 0xf355a0a2, 0x8ae13205, 0xf6eb75a4, 0x83ec390b, 0x60efaa40, 0x719f065e, 0x6e1051bd, 0x218af93e, 0xdd063d96, 0x3e05aedd, 0xe6bd464d, 0x548db591, 0xc45d0571, 0x06d46f04, 0x5015ff60, 0x98fb2419, 0xbde997d6, 0x4043cc89, 0xd99e7767, 0xe842bdb0, 0x898b8807, 0x195b38e7, 0xc8eedb79, 0x7c0a47a1, 0x420fe97c, 0x841ec9f8, 0x00000000, 0x80868309, 0x2bed4832, 0x1170ac1e, 0x5a724e6c, 0x0efffbfd, 0x8538560f, 0xaed51e3d, 0x2d392736, 0x0fd9640a, 0x5ca62168, 0x5b54d19b, 0x362e3a24, 0x0a67b10c, 0x57e70f93, 0xee96d2b4, 0x9b919e1b, 0xc0c54f80, 0xdc20a261, 0x774b695a, 0x121a161c, 0x93ba0ae2, 0xa02ae5c0, 0x22e0433c, 0x1b171d12, 0x090d0b0e, 0x8bc7adf2, 0xb6a8b92d, 0x1ea9c814, 0xf1198557, 0x75074caf, 0x99ddbbee, 0x7f60fda3, 0x01269ff7, 0x72f5bc5c, 0x663bc544, 0xfb7e345b, 0x4329768b, 0x23c6dccb, 0xedfc68b6, 0xe4f163b8, 0x31dccad7, 0x63851042, 0x97224013, 0xc6112084, 0x4a247d85, 0xbb3df8d2, 0xf93211ae, 0x29a16dc7, 0x9e2f4b1d, 0xb230f3dc, 0x8652ec0d, 0xc1e3d077, 0xb3166c2b, 0x70b999a9, 0x9448fa11, 0xe9642247, 0xfc8cc4a8, 0xf03f1aa0, 0x7d2cd856, 0x3390ef22, 0x494ec787, 0x38d1c1d9, 0xcaa2fe8c, 0xd40b3698, 0xf581cfa6, 0x7ade28a5, 0xb78e26da, 0xadbfa43f, 0x3a9de42c, 0x78920d50, 0x5fcc9b6a, 0x7e466254, 0x8d13c2f6, 0xd8b8e890, 0x39f75e2e, 0xc3aff582, 0x5d80be9f, 0xd0937c69, 0xd52da96f, 0x2512b3cf, 0xac993bc8, 0x187da710, 0x9c636ee8, 0x3bbb7bdb, 0x267809cd, 0x5918f46e, 0x9ab701ec, 0x4f9aa883, 0x956e65e6, 0xffe67eaa, 0xbccf0821, 0x15e8e6ef, 0xe79bd9ba, 0x6f36ce4a, 0x9f09d4ea, 0xb07cd629, 0xa4b2af31, 0x3f23312a, 0xa59430c6, 0xa266c035, 0x4ebc3774, 0x82caa6fc, 0x90d0b0e0, 0xa7d81533, 0x04984af1, 0xecdaf741, 0xcd500e7f, 0x91f62f17, 0x4dd68d76, 0xefb04d43, 0xaa4d54cc, 0x9604dfe4, 0xd1b5e39e, 0x6a881b4c, 0x2c1fb8c1, 0x65517f46, 0x5eea049d, 0x8c355d01, 0x877473fa, 0x0b412efb, 0x671d5ab3, 0xdbd25292, 0x105633e9, 0xd647136d, 0xd7618c9a, 0xa10c7a37, 0xf8148e59, 0x133c89eb, 0xa927eece, 0x61c935b7, 0x1ce5ede1, 0x47b13c7a, 0xd2df599c, 0xf2733f55, 0x14ce7918, 0xc737bf73, 0xf7cdea53, 0xfdaa5b5f, 0x3d6f14df, 0x44db8678, 0xaff381ca, 0x68c43eb9, 0x24342c38, 0xa3405fc2, 0x1dc37216, 0xe2250cbc, 0x3c498b28, 0x0d9541ff, 0xa8017139, 0x0cb3de08, 0xb4e49cd8, 0x56c19064, 0xcb84617b, 0x32b670d5, 0x6c5c7448, 0xb85742d0];

    // Transformations for decryption key expansion
    var U1 = [0x00000000, 0x0e090d0b, 0x1c121a16, 0x121b171d, 0x3824342c, 0x362d3927, 0x24362e3a, 0x2a3f2331, 0x70486858, 0x7e416553, 0x6c5a724e, 0x62537f45, 0x486c5c74, 0x4665517f, 0x547e4662, 0x5a774b69, 0xe090d0b0, 0xee99ddbb, 0xfc82caa6, 0xf28bc7ad, 0xd8b4e49c, 0xd6bde997, 0xc4a6fe8a, 0xcaaff381, 0x90d8b8e8, 0x9ed1b5e3, 0x8ccaa2fe, 0x82c3aff5, 0xa8fc8cc4, 0xa6f581cf, 0xb4ee96d2, 0xbae79bd9, 0xdb3bbb7b, 0xd532b670, 0xc729a16d, 0xc920ac66, 0xe31f8f57, 0xed16825c, 0xff0d9541, 0xf104984a, 0xab73d323, 0xa57ade28, 0xb761c935, 0xb968c43e, 0x9357e70f, 0x9d5eea04, 0x8f45fd19, 0x814cf012, 0x3bab6bcb, 0x35a266c0, 0x27b971dd, 0x29b07cd6, 0x038f5fe7, 0x0d8652ec, 0x1f9d45f1, 0x119448fa, 0x4be30393, 0x45ea0e98, 0x57f11985, 0x59f8148e, 0x73c737bf, 0x7dce3ab4, 0x6fd52da9, 0x61dc20a2, 0xad766df6, 0xa37f60fd, 0xb16477e0, 0xbf6d7aeb, 0x955259da, 0x9b5b54d1, 0x894043cc, 0x87494ec7, 0xdd3e05ae, 0xd33708a5, 0xc12c1fb8, 0xcf2512b3, 0xe51a3182, 0xeb133c89, 0xf9082b94, 0xf701269f, 0x4de6bd46, 0x43efb04d, 0x51f4a750, 0x5ffdaa5b, 0x75c2896a, 0x7bcb8461, 0x69d0937c, 0x67d99e77, 0x3daed51e, 0x33a7d815, 0x21bccf08, 0x2fb5c203, 0x058ae132, 0x0b83ec39, 0x1998fb24, 0x1791f62f, 0x764dd68d, 0x7844db86, 0x6a5fcc9b, 0x6456c190, 0x4e69e2a1, 0x4060efaa, 0x527bf8b7, 0x5c72f5bc, 0x0605bed5, 0x080cb3de, 0x1a17a4c3, 0x141ea9c8, 0x3e218af9, 0x302887f2, 0x223390ef, 0x2c3a9de4, 0x96dd063d, 0x98d40b36, 0x8acf1c2b, 0x84c61120, 0xaef93211, 0xa0f03f1a, 0xb2eb2807, 0xbce2250c, 0xe6956e65, 0xe89c636e, 0xfa877473, 0xf48e7978, 0xdeb15a49, 0xd0b85742, 0xc2a3405f, 0xccaa4d54, 0x41ecdaf7, 0x4fe5d7fc, 0x5dfec0e1, 0x53f7cdea, 0x79c8eedb, 0x77c1e3d0, 0x65daf4cd, 0x6bd3f9c6, 0x31a4b2af, 0x3fadbfa4, 0x2db6a8b9, 0x23bfa5b2, 0x09808683, 0x07898b88, 0x15929c95, 0x1b9b919e, 0xa17c0a47, 0xaf75074c, 0xbd6e1051, 0xb3671d5a, 0x99583e6b, 0x97513360, 0x854a247d, 0x8b432976, 0xd134621f, 0xdf3d6f14, 0xcd267809, 0xc32f7502, 0xe9105633, 0xe7195b38, 0xf5024c25, 0xfb0b412e, 0x9ad7618c, 0x94de6c87, 0x86c57b9a, 0x88cc7691, 0xa2f355a0, 0xacfa58ab, 0xbee14fb6, 0xb0e842bd, 0xea9f09d4, 0xe49604df, 0xf68d13c2, 0xf8841ec9, 0xd2bb3df8, 0xdcb230f3, 0xcea927ee, 0xc0a02ae5, 0x7a47b13c, 0x744ebc37, 0x6655ab2a, 0x685ca621, 0x42638510, 0x4c6a881b, 0x5e719f06, 0x5078920d, 0x0a0fd964, 0x0406d46f, 0x161dc372, 0x1814ce79, 0x322bed48, 0x3c22e043, 0x2e39f75e, 0x2030fa55, 0xec9ab701, 0xe293ba0a, 0xf088ad17, 0xfe81a01c, 0xd4be832d, 0xdab78e26, 0xc8ac993b, 0xc6a59430, 0x9cd2df59, 0x92dbd252, 0x80c0c54f, 0x8ec9c844, 0xa4f6eb75, 0xaaffe67e, 0xb8e4f163, 0xb6edfc68, 0x0c0a67b1, 0x02036aba, 0x10187da7, 0x1e1170ac, 0x342e539d, 0x3a275e96, 0x283c498b, 0x26354480, 0x7c420fe9, 0x724b02e2, 0x605015ff, 0x6e5918f4, 0x44663bc5, 0x4a6f36ce, 0x587421d3, 0x567d2cd8, 0x37a10c7a, 0x39a80171, 0x2bb3166c, 0x25ba1b67, 0x0f853856, 0x018c355d, 0x13972240, 0x1d9e2f4b, 0x47e96422, 0x49e06929, 0x5bfb7e34, 0x55f2733f, 0x7fcd500e, 0x71c45d05, 0x63df4a18, 0x6dd64713, 0xd731dcca, 0xd938d1c1, 0xcb23c6dc, 0xc52acbd7, 0xef15e8e6, 0xe11ce5ed, 0xf307f2f0, 0xfd0efffb, 0xa779b492, 0xa970b999, 0xbb6bae84, 0xb562a38f, 0x9f5d80be, 0x91548db5, 0x834f9aa8, 0x8d4697a3];
    var U2 = [0x00000000, 0x0b0e090d, 0x161c121a, 0x1d121b17, 0x2c382434, 0x27362d39, 0x3a24362e, 0x312a3f23, 0x58704868, 0x537e4165, 0x4e6c5a72, 0x4562537f, 0x74486c5c, 0x7f466551, 0x62547e46, 0x695a774b, 0xb0e090d0, 0xbbee99dd, 0xa6fc82ca, 0xadf28bc7, 0x9cd8b4e4, 0x97d6bde9, 0x8ac4a6fe, 0x81caaff3, 0xe890d8b8, 0xe39ed1b5, 0xfe8ccaa2, 0xf582c3af, 0xc4a8fc8c, 0xcfa6f581, 0xd2b4ee96, 0xd9bae79b, 0x7bdb3bbb, 0x70d532b6, 0x6dc729a1, 0x66c920ac, 0x57e31f8f, 0x5ced1682, 0x41ff0d95, 0x4af10498, 0x23ab73d3, 0x28a57ade, 0x35b761c9, 0x3eb968c4, 0x0f9357e7, 0x049d5eea, 0x198f45fd, 0x12814cf0, 0xcb3bab6b, 0xc035a266, 0xdd27b971, 0xd629b07c, 0xe7038f5f, 0xec0d8652, 0xf11f9d45, 0xfa119448, 0x934be303, 0x9845ea0e, 0x8557f119, 0x8e59f814, 0xbf73c737, 0xb47dce3a, 0xa96fd52d, 0xa261dc20, 0xf6ad766d, 0xfda37f60, 0xe0b16477, 0xebbf6d7a, 0xda955259, 0xd19b5b54, 0xcc894043, 0xc787494e, 0xaedd3e05, 0xa5d33708, 0xb8c12c1f, 0xb3cf2512, 0x82e51a31, 0x89eb133c, 0x94f9082b, 0x9ff70126, 0x464de6bd, 0x4d43efb0, 0x5051f4a7, 0x5b5ffdaa, 0x6a75c289, 0x617bcb84, 0x7c69d093, 0x7767d99e, 0x1e3daed5, 0x1533a7d8, 0x0821bccf, 0x032fb5c2, 0x32058ae1, 0x390b83ec, 0x241998fb, 0x2f1791f6, 0x8d764dd6, 0x867844db, 0x9b6a5fcc, 0x906456c1, 0xa14e69e2, 0xaa4060ef, 0xb7527bf8, 0xbc5c72f5, 0xd50605be, 0xde080cb3, 0xc31a17a4, 0xc8141ea9, 0xf93e218a, 0xf2302887, 0xef223390, 0xe42c3a9d, 0x3d96dd06, 0x3698d40b, 0x2b8acf1c, 0x2084c611, 0x11aef932, 0x1aa0f03f, 0x07b2eb28, 0x0cbce225, 0x65e6956e, 0x6ee89c63, 0x73fa8774, 0x78f48e79, 0x49deb15a, 0x42d0b857, 0x5fc2a340, 0x54ccaa4d, 0xf741ecda, 0xfc4fe5d7, 0xe15dfec0, 0xea53f7cd, 0xdb79c8ee, 0xd077c1e3, 0xcd65daf4, 0xc66bd3f9, 0xaf31a4b2, 0xa43fadbf, 0xb92db6a8, 0xb223bfa5, 0x83098086, 0x8807898b, 0x9515929c, 0x9e1b9b91, 0x47a17c0a, 0x4caf7507, 0x51bd6e10, 0x5ab3671d, 0x6b99583e, 0x60975133, 0x7d854a24, 0x768b4329, 0x1fd13462, 0x14df3d6f, 0x09cd2678, 0x02c32f75, 0x33e91056, 0x38e7195b, 0x25f5024c, 0x2efb0b41, 0x8c9ad761, 0x8794de6c, 0x9a86c57b, 0x9188cc76, 0xa0a2f355, 0xabacfa58, 0xb6bee14f, 0xbdb0e842, 0xd4ea9f09, 0xdfe49604, 0xc2f68d13, 0xc9f8841e, 0xf8d2bb3d, 0xf3dcb230, 0xeecea927, 0xe5c0a02a, 0x3c7a47b1, 0x37744ebc, 0x2a6655ab, 0x21685ca6, 0x10426385, 0x1b4c6a88, 0x065e719f, 0x0d507892, 0x640a0fd9, 0x6f0406d4, 0x72161dc3, 0x791814ce, 0x48322bed, 0x433c22e0, 0x5e2e39f7, 0x552030fa, 0x01ec9ab7, 0x0ae293ba, 0x17f088ad, 0x1cfe81a0, 0x2dd4be83, 0x26dab78e, 0x3bc8ac99, 0x30c6a594, 0x599cd2df, 0x5292dbd2, 0x4f80c0c5, 0x448ec9c8, 0x75a4f6eb, 0x7eaaffe6, 0x63b8e4f1, 0x68b6edfc, 0xb10c0a67, 0xba02036a, 0xa710187d, 0xac1e1170, 0x9d342e53, 0x963a275e, 0x8b283c49, 0x80263544, 0xe97c420f, 0xe2724b02, 0xff605015, 0xf46e5918, 0xc544663b, 0xce4a6f36, 0xd3587421, 0xd8567d2c, 0x7a37a10c, 0x7139a801, 0x6c2bb316, 0x6725ba1b, 0x560f8538, 0x5d018c35, 0x40139722, 0x4b1d9e2f, 0x2247e964, 0x2949e069, 0x345bfb7e, 0x3f55f273, 0x0e7fcd50, 0x0571c45d, 0x1863df4a, 0x136dd647, 0xcad731dc, 0xc1d938d1, 0xdccb23c6, 0xd7c52acb, 0xe6ef15e8, 0xede11ce5, 0xf0f307f2, 0xfbfd0eff, 0x92a779b4, 0x99a970b9, 0x84bb6bae, 0x8fb562a3, 0xbe9f5d80, 0xb591548d, 0xa8834f9a, 0xa38d4697];
    var U3 = [0x00000000, 0x0d0b0e09, 0x1a161c12, 0x171d121b, 0x342c3824, 0x3927362d, 0x2e3a2436, 0x23312a3f, 0x68587048, 0x65537e41, 0x724e6c5a, 0x7f456253, 0x5c74486c, 0x517f4665, 0x4662547e, 0x4b695a77, 0xd0b0e090, 0xddbbee99, 0xcaa6fc82, 0xc7adf28b, 0xe49cd8b4, 0xe997d6bd, 0xfe8ac4a6, 0xf381caaf, 0xb8e890d8, 0xb5e39ed1, 0xa2fe8cca, 0xaff582c3, 0x8cc4a8fc, 0x81cfa6f5, 0x96d2b4ee, 0x9bd9bae7, 0xbb7bdb3b, 0xb670d532, 0xa16dc729, 0xac66c920, 0x8f57e31f, 0x825ced16, 0x9541ff0d, 0x984af104, 0xd323ab73, 0xde28a57a, 0xc935b761, 0xc43eb968, 0xe70f9357, 0xea049d5e, 0xfd198f45, 0xf012814c, 0x6bcb3bab, 0x66c035a2, 0x71dd27b9, 0x7cd629b0, 0x5fe7038f, 0x52ec0d86, 0x45f11f9d, 0x48fa1194, 0x03934be3, 0x0e9845ea, 0x198557f1, 0x148e59f8, 0x37bf73c7, 0x3ab47dce, 0x2da96fd5, 0x20a261dc, 0x6df6ad76, 0x60fda37f, 0x77e0b164, 0x7aebbf6d, 0x59da9552, 0x54d19b5b, 0x43cc8940, 0x4ec78749, 0x05aedd3e, 0x08a5d337, 0x1fb8c12c, 0x12b3cf25, 0x3182e51a, 0x3c89eb13, 0x2b94f908, 0x269ff701, 0xbd464de6, 0xb04d43ef, 0xa75051f4, 0xaa5b5ffd, 0x896a75c2, 0x84617bcb, 0x937c69d0, 0x9e7767d9, 0xd51e3dae, 0xd81533a7, 0xcf0821bc, 0xc2032fb5, 0xe132058a, 0xec390b83, 0xfb241998, 0xf62f1791, 0xd68d764d, 0xdb867844, 0xcc9b6a5f, 0xc1906456, 0xe2a14e69, 0xefaa4060, 0xf8b7527b, 0xf5bc5c72, 0xbed50605, 0xb3de080c, 0xa4c31a17, 0xa9c8141e, 0x8af93e21, 0x87f23028, 0x90ef2233, 0x9de42c3a, 0x063d96dd, 0x0b3698d4, 0x1c2b8acf, 0x112084c6, 0x3211aef9, 0x3f1aa0f0, 0x2807b2eb, 0x250cbce2, 0x6e65e695, 0x636ee89c, 0x7473fa87, 0x7978f48e, 0x5a49deb1, 0x5742d0b8, 0x405fc2a3, 0x4d54ccaa, 0xdaf741ec, 0xd7fc4fe5, 0xc0e15dfe, 0xcdea53f7, 0xeedb79c8, 0xe3d077c1, 0xf4cd65da, 0xf9c66bd3, 0xb2af31a4, 0xbfa43fad, 0xa8b92db6, 0xa5b223bf, 0x86830980, 0x8b880789, 0x9c951592, 0x919e1b9b, 0x0a47a17c, 0x074caf75, 0x1051bd6e, 0x1d5ab367, 0x3e6b9958, 0x33609751, 0x247d854a, 0x29768b43, 0x621fd134, 0x6f14df3d, 0x7809cd26, 0x7502c32f, 0x5633e910, 0x5b38e719, 0x4c25f502, 0x412efb0b, 0x618c9ad7, 0x6c8794de, 0x7b9a86c5, 0x769188cc, 0x55a0a2f3, 0x58abacfa, 0x4fb6bee1, 0x42bdb0e8, 0x09d4ea9f, 0x04dfe496, 0x13c2f68d, 0x1ec9f884, 0x3df8d2bb, 0x30f3dcb2, 0x27eecea9, 0x2ae5c0a0, 0xb13c7a47, 0xbc37744e, 0xab2a6655, 0xa621685c, 0x85104263, 0x881b4c6a, 0x9f065e71, 0x920d5078, 0xd9640a0f, 0xd46f0406, 0xc372161d, 0xce791814, 0xed48322b, 0xe0433c22, 0xf75e2e39, 0xfa552030, 0xb701ec9a, 0xba0ae293, 0xad17f088, 0xa01cfe81, 0x832dd4be, 0x8e26dab7, 0x993bc8ac, 0x9430c6a5, 0xdf599cd2, 0xd25292db, 0xc54f80c0, 0xc8448ec9, 0xeb75a4f6, 0xe67eaaff, 0xf163b8e4, 0xfc68b6ed, 0x67b10c0a, 0x6aba0203, 0x7da71018, 0x70ac1e11, 0x539d342e, 0x5e963a27, 0x498b283c, 0x44802635, 0x0fe97c42, 0x02e2724b, 0x15ff6050, 0x18f46e59, 0x3bc54466, 0x36ce4a6f, 0x21d35874, 0x2cd8567d, 0x0c7a37a1, 0x017139a8, 0x166c2bb3, 0x1b6725ba, 0x38560f85, 0x355d018c, 0x22401397, 0x2f4b1d9e, 0x642247e9, 0x692949e0, 0x7e345bfb, 0x733f55f2, 0x500e7fcd, 0x5d0571c4, 0x4a1863df, 0x47136dd6, 0xdccad731, 0xd1c1d938, 0xc6dccb23, 0xcbd7c52a, 0xe8e6ef15, 0xe5ede11c, 0xf2f0f307, 0xfffbfd0e, 0xb492a779, 0xb999a970, 0xae84bb6b, 0xa38fb562, 0x80be9f5d, 0x8db59154, 0x9aa8834f, 0x97a38d46];
    var U4 = [0x00000000, 0x090d0b0e, 0x121a161c, 0x1b171d12, 0x24342c38, 0x2d392736, 0x362e3a24, 0x3f23312a, 0x48685870, 0x4165537e, 0x5a724e6c, 0x537f4562, 0x6c5c7448, 0x65517f46, 0x7e466254, 0x774b695a, 0x90d0b0e0, 0x99ddbbee, 0x82caa6fc, 0x8bc7adf2, 0xb4e49cd8, 0xbde997d6, 0xa6fe8ac4, 0xaff381ca, 0xd8b8e890, 0xd1b5e39e, 0xcaa2fe8c, 0xc3aff582, 0xfc8cc4a8, 0xf581cfa6, 0xee96d2b4, 0xe79bd9ba, 0x3bbb7bdb, 0x32b670d5, 0x29a16dc7, 0x20ac66c9, 0x1f8f57e3, 0x16825ced, 0x0d9541ff, 0x04984af1, 0x73d323ab, 0x7ade28a5, 0x61c935b7, 0x68c43eb9, 0x57e70f93, 0x5eea049d, 0x45fd198f, 0x4cf01281, 0xab6bcb3b, 0xa266c035, 0xb971dd27, 0xb07cd629, 0x8f5fe703, 0x8652ec0d, 0x9d45f11f, 0x9448fa11, 0xe303934b, 0xea0e9845, 0xf1198557, 0xf8148e59, 0xc737bf73, 0xce3ab47d, 0xd52da96f, 0xdc20a261, 0x766df6ad, 0x7f60fda3, 0x6477e0b1, 0x6d7aebbf, 0x5259da95, 0x5b54d19b, 0x4043cc89, 0x494ec787, 0x3e05aedd, 0x3708a5d3, 0x2c1fb8c1, 0x2512b3cf, 0x1a3182e5, 0x133c89eb, 0x082b94f9, 0x01269ff7, 0xe6bd464d, 0xefb04d43, 0xf4a75051, 0xfdaa5b5f, 0xc2896a75, 0xcb84617b, 0xd0937c69, 0xd99e7767, 0xaed51e3d, 0xa7d81533, 0xbccf0821, 0xb5c2032f, 0x8ae13205, 0x83ec390b, 0x98fb2419, 0x91f62f17, 0x4dd68d76, 0x44db8678, 0x5fcc9b6a, 0x56c19064, 0x69e2a14e, 0x60efaa40, 0x7bf8b752, 0x72f5bc5c, 0x05bed506, 0x0cb3de08, 0x17a4c31a, 0x1ea9c814, 0x218af93e, 0x2887f230, 0x3390ef22, 0x3a9de42c, 0xdd063d96, 0xd40b3698, 0xcf1c2b8a, 0xc6112084, 0xf93211ae, 0xf03f1aa0, 0xeb2807b2, 0xe2250cbc, 0x956e65e6, 0x9c636ee8, 0x877473fa, 0x8e7978f4, 0xb15a49de, 0xb85742d0, 0xa3405fc2, 0xaa4d54cc, 0xecdaf741, 0xe5d7fc4f, 0xfec0e15d, 0xf7cdea53, 0xc8eedb79, 0xc1e3d077, 0xdaf4cd65, 0xd3f9c66b, 0xa4b2af31, 0xadbfa43f, 0xb6a8b92d, 0xbfa5b223, 0x80868309, 0x898b8807, 0x929c9515, 0x9b919e1b, 0x7c0a47a1, 0x75074caf, 0x6e1051bd, 0x671d5ab3, 0x583e6b99, 0x51336097, 0x4a247d85, 0x4329768b, 0x34621fd1, 0x3d6f14df, 0x267809cd, 0x2f7502c3, 0x105633e9, 0x195b38e7, 0x024c25f5, 0x0b412efb, 0xd7618c9a, 0xde6c8794, 0xc57b9a86, 0xcc769188, 0xf355a0a2, 0xfa58abac, 0xe14fb6be, 0xe842bdb0, 0x9f09d4ea, 0x9604dfe4, 0x8d13c2f6, 0x841ec9f8, 0xbb3df8d2, 0xb230f3dc, 0xa927eece, 0xa02ae5c0, 0x47b13c7a, 0x4ebc3774, 0x55ab2a66, 0x5ca62168, 0x63851042, 0x6a881b4c, 0x719f065e, 0x78920d50, 0x0fd9640a, 0x06d46f04, 0x1dc37216, 0x14ce7918, 0x2bed4832, 0x22e0433c, 0x39f75e2e, 0x30fa5520, 0x9ab701ec, 0x93ba0ae2, 0x88ad17f0, 0x81a01cfe, 0xbe832dd4, 0xb78e26da, 0xac993bc8, 0xa59430c6, 0xd2df599c, 0xdbd25292, 0xc0c54f80, 0xc9c8448e, 0xf6eb75a4, 0xffe67eaa, 0xe4f163b8, 0xedfc68b6, 0x0a67b10c, 0x036aba02, 0x187da710, 0x1170ac1e, 0x2e539d34, 0x275e963a, 0x3c498b28, 0x35448026, 0x420fe97c, 0x4b02e272, 0x5015ff60, 0x5918f46e, 0x663bc544, 0x6f36ce4a, 0x7421d358, 0x7d2cd856, 0xa10c7a37, 0xa8017139, 0xb3166c2b, 0xba1b6725, 0x8538560f, 0x8c355d01, 0x97224013, 0x9e2f4b1d, 0xe9642247, 0xe0692949, 0xfb7e345b, 0xf2733f55, 0xcd500e7f, 0xc45d0571, 0xdf4a1863, 0xd647136d, 0x31dccad7, 0x38d1c1d9, 0x23c6dccb, 0x2acbd7c5, 0x15e8e6ef, 0x1ce5ede1, 0x07f2f0f3, 0x0efffbfd, 0x79b492a7, 0x70b999a9, 0x6bae84bb, 0x62a38fb5, 0x5d80be9f, 0x548db591, 0x4f9aa883, 0x4697a38d];

    function convertToInt32(bytes) {
        var result = [];
        for (var i = 0; i < bytes.length; i += 4) {
            result.push(
                (bytes[i    ] << 24) |
                (bytes[i + 1] << 16) |
                (bytes[i + 2] <<  8) |
                 bytes[i + 3]
            );
        }
        return result;
    }

    var AES = function(key) {
        if (!(this instanceof AES)) {
            throw Error('AES must be instanitated with `new`');
        }

        Object.defineProperty(this, 'key', {
            value: coerceArray(key, true)
        });

        this._prepare();
    }


    AES.prototype._prepare = function() {

        var rounds = numberOfRounds[this.key.length];
        if (rounds == null) {
            throw new Error('invalid key size (must be 16, 24 or 32 bytes)');
        }

        // encryption round keys
        this._Ke = [];

        // decryption round keys
        this._Kd = [];

        for (var i = 0; i <= rounds; i++) {
            this._Ke.push([0, 0, 0, 0]);
            this._Kd.push([0, 0, 0, 0]);
        }

        var roundKeyCount = (rounds + 1) * 4;
        var KC = this.key.length / 4;

        // convert the key into ints
        var tk = convertToInt32(this.key);

        // copy values into round key arrays
        var index;
        for (var i = 0; i < KC; i++) {
            index = i >> 2;
            this._Ke[index][i % 4] = tk[i];
            this._Kd[rounds - index][i % 4] = tk[i];
        }

        // key expansion (fips-197 section 5.2)
        var rconpointer = 0;
        var t = KC, tt;
        while (t < roundKeyCount) {
            tt = tk[KC - 1];
            tk[0] ^= ((S[(tt >> 16) & 0xFF] << 24) ^
                      (S[(tt >>  8) & 0xFF] << 16) ^
                      (S[ tt        & 0xFF] <<  8) ^
                       S[(tt >> 24) & 0xFF]        ^
                      (rcon[rconpointer] << 24));
            rconpointer += 1;

            // key expansion (for non-256 bit)
            if (KC != 8) {
                for (var i = 1; i < KC; i++) {
                    tk[i] ^= tk[i - 1];
                }

            // key expansion for 256-bit keys is "slightly different" (fips-197)
            } else {
                for (var i = 1; i < (KC / 2); i++) {
                    tk[i] ^= tk[i - 1];
                }
                tt = tk[(KC / 2) - 1];

                tk[KC / 2] ^= (S[ tt        & 0xFF]        ^
                              (S[(tt >>  8) & 0xFF] <<  8) ^
                              (S[(tt >> 16) & 0xFF] << 16) ^
                              (S[(tt >> 24) & 0xFF] << 24));

                for (var i = (KC / 2) + 1; i < KC; i++) {
                    tk[i] ^= tk[i - 1];
                }
            }

            // copy values into round key arrays
            var i = 0, r, c;
            while (i < KC && t < roundKeyCount) {
                r = t >> 2;
                c = t % 4;
                this._Ke[r][c] = tk[i];
                this._Kd[rounds - r][c] = tk[i++];
                t++;
            }
        }

        // inverse-cipher-ify the decryption round key (fips-197 section 5.3)
        for (var r = 1; r < rounds; r++) {
            for (var c = 0; c < 4; c++) {
                tt = this._Kd[r][c];
                this._Kd[r][c] = (U1[(tt >> 24) & 0xFF] ^
                                  U2[(tt >> 16) & 0xFF] ^
                                  U3[(tt >>  8) & 0xFF] ^
                                  U4[ tt        & 0xFF]);
            }
        }
    }

    AES.prototype.encrypt = function(plaintext) {
        if (plaintext.length != 16) {
            throw new Error('invalid plaintext size (must be 16 bytes)');
        }

        var rounds = this._Ke.length - 1;
        var a = [0, 0, 0, 0];

        // convert plaintext to (ints ^ key)
        var t = convertToInt32(plaintext);
        for (var i = 0; i < 4; i++) {
            t[i] ^= this._Ke[0][i];
        }

        // apply round transforms
        for (var r = 1; r < rounds; r++) {
            for (var i = 0; i < 4; i++) {
                a[i] = (T1[(t[ i         ] >> 24) & 0xff] ^
                        T2[(t[(i + 1) % 4] >> 16) & 0xff] ^
                        T3[(t[(i + 2) % 4] >>  8) & 0xff] ^
                        T4[ t[(i + 3) % 4]        & 0xff] ^
                        this._Ke[r][i]);
            }
            t = a.slice();
        }

        // the last round is special
        var result = createArray(16), tt;
        for (var i = 0; i < 4; i++) {
            tt = this._Ke[rounds][i];
            result[4 * i    ] = (S[(t[ i         ] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
            result[4 * i + 1] = (S[(t[(i + 1) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
            result[4 * i + 2] = (S[(t[(i + 2) % 4] >>  8) & 0xff] ^ (tt >>  8)) & 0xff;
            result[4 * i + 3] = (S[ t[(i + 3) % 4]        & 0xff] ^  tt       ) & 0xff;
        }

        return result;
    }

    AES.prototype.decrypt = function(ciphertext) {
        if (ciphertext.length != 16) {
            throw new Error('invalid ciphertext size (must be 16 bytes)');
        }

        var rounds = this._Kd.length - 1;
        var a = [0, 0, 0, 0];

        // convert plaintext to (ints ^ key)
        var t = convertToInt32(ciphertext);
        for (var i = 0; i < 4; i++) {
            t[i] ^= this._Kd[0][i];
        }

        // apply round transforms
        for (var r = 1; r < rounds; r++) {
            for (var i = 0; i < 4; i++) {
                a[i] = (T5[(t[ i          ] >> 24) & 0xff] ^
                        T6[(t[(i + 3) % 4] >> 16) & 0xff] ^
                        T7[(t[(i + 2) % 4] >>  8) & 0xff] ^
                        T8[ t[(i + 1) % 4]        & 0xff] ^
                        this._Kd[r][i]);
            }
            t = a.slice();
        }

        // the last round is special
        var result = createArray(16), tt;
        for (var i = 0; i < 4; i++) {
            tt = this._Kd[rounds][i];
            result[4 * i    ] = (Si[(t[ i         ] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
            result[4 * i + 1] = (Si[(t[(i + 3) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
            result[4 * i + 2] = (Si[(t[(i + 2) % 4] >>  8) & 0xff] ^ (tt >>  8)) & 0xff;
            result[4 * i + 3] = (Si[ t[(i + 1) % 4]        & 0xff] ^  tt       ) & 0xff;
        }

        return result;
    }


    /**
     *  Mode Of Operation - Electonic Codebook (ECB)
     */
    var ModeOfOperationECB = function(key) {
        if (!(this instanceof ModeOfOperationECB)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Electronic Code Block";
        this.name = "ecb";

        this._aes = new AES(key);
    }

    ModeOfOperationECB.prototype.encrypt = function(plaintext) {
        plaintext = coerceArray(plaintext);

        if ((plaintext.length % 16) !== 0) {
            throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
        }

        var ciphertext = createArray(plaintext.length);
        var block = createArray(16);

        for (var i = 0; i < plaintext.length; i += 16) {
            copyArray(plaintext, block, 0, i, i + 16);
            block = this._aes.encrypt(block);
            copyArray(block, ciphertext, i);
        }

        return ciphertext;
    }

    ModeOfOperationECB.prototype.decrypt = function(ciphertext) {
        ciphertext = coerceArray(ciphertext);

        if ((ciphertext.length % 16) !== 0) {
            throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
        }

        var plaintext = createArray(ciphertext.length);
        var block = createArray(16);

        for (var i = 0; i < ciphertext.length; i += 16) {
            copyArray(ciphertext, block, 0, i, i + 16);
            block = this._aes.decrypt(block);
            copyArray(block, plaintext, i);
        }

        return plaintext;
    }


    /**
     *  Mode Of Operation - Cipher Block Chaining (CBC)
     */
    var ModeOfOperationCBC = function(key, iv) {
        if (!(this instanceof ModeOfOperationCBC)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Cipher Block Chaining";
        this.name = "cbc";

        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 bytes)');
        }

        this._lastCipherblock = coerceArray(iv, true);

        this._aes = new AES(key);
    }

    ModeOfOperationCBC.prototype.encrypt = function(plaintext) {
        plaintext = coerceArray(plaintext);

        if ((plaintext.length % 16) !== 0) {
            throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
        }

        var ciphertext = createArray(plaintext.length);
        var block = createArray(16);

        for (var i = 0; i < plaintext.length; i += 16) {
            copyArray(plaintext, block, 0, i, i + 16);

            for (var j = 0; j < 16; j++) {
                block[j] ^= this._lastCipherblock[j];
            }

            this._lastCipherblock = this._aes.encrypt(block);
            copyArray(this._lastCipherblock, ciphertext, i);
        }

        return ciphertext;
    }

    ModeOfOperationCBC.prototype.decrypt = function(ciphertext) {
        ciphertext = coerceArray(ciphertext);

        if ((ciphertext.length % 16) !== 0) {
            throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
        }

        var plaintext = createArray(ciphertext.length);
        var block = createArray(16);

        for (var i = 0; i < ciphertext.length; i += 16) {
            copyArray(ciphertext, block, 0, i, i + 16);
            block = this._aes.decrypt(block);

            for (var j = 0; j < 16; j++) {
                plaintext[i + j] = block[j] ^ this._lastCipherblock[j];
            }

            copyArray(ciphertext, this._lastCipherblock, 0, i, i + 16);
        }

        return plaintext;
    }


    /**
     *  Mode Of Operation - Cipher Feedback (CFB)
     */
    var ModeOfOperationCFB = function(key, iv, segmentSize) {
        if (!(this instanceof ModeOfOperationCFB)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Cipher Feedback";
        this.name = "cfb";

        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 size)');
        }

        if (!segmentSize) { segmentSize = 1; }

        this.segmentSize = segmentSize;

        this._shiftRegister = coerceArray(iv, true);

        this._aes = new AES(key);
    }

    ModeOfOperationCFB.prototype.encrypt = function(plaintext) {
        if ((plaintext.length % this.segmentSize) != 0) {
            throw new Error('invalid plaintext size (must be segmentSize bytes)');
        }

        var encrypted = coerceArray(plaintext, true);

        var xorSegment;
        for (var i = 0; i < encrypted.length; i += this.segmentSize) {
            xorSegment = this._aes.encrypt(this._shiftRegister);
            for (var j = 0; j < this.segmentSize; j++) {
                encrypted[i + j] ^= xorSegment[j];
            }

            // Shift the register
            copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
            copyArray(encrypted, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
        }

        return encrypted;
    }

    ModeOfOperationCFB.prototype.decrypt = function(ciphertext) {
        if ((ciphertext.length % this.segmentSize) != 0) {
            throw new Error('invalid ciphertext size (must be segmentSize bytes)');
        }

        var plaintext = coerceArray(ciphertext, true);

        var xorSegment;
        for (var i = 0; i < plaintext.length; i += this.segmentSize) {
            xorSegment = this._aes.encrypt(this._shiftRegister);

            for (var j = 0; j < this.segmentSize; j++) {
                plaintext[i + j] ^= xorSegment[j];
            }

            // Shift the register
            copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
            copyArray(ciphertext, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
        }

        return plaintext;
    }

    /**
     *  Mode Of Operation - Output Feedback (OFB)
     */
    var ModeOfOperationOFB = function(key, iv) {
        if (!(this instanceof ModeOfOperationOFB)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Output Feedback";
        this.name = "ofb";

        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 bytes)');
        }

        this._lastPrecipher = coerceArray(iv, true);
        this._lastPrecipherIndex = 16;

        this._aes = new AES(key);
    }

    ModeOfOperationOFB.prototype.encrypt = function(plaintext) {
        var encrypted = coerceArray(plaintext, true);

        for (var i = 0; i < encrypted.length; i++) {
            if (this._lastPrecipherIndex === 16) {
                this._lastPrecipher = this._aes.encrypt(this._lastPrecipher);
                this._lastPrecipherIndex = 0;
            }
            encrypted[i] ^= this._lastPrecipher[this._lastPrecipherIndex++];
        }

        return encrypted;
    }

    // Decryption is symetric
    ModeOfOperationOFB.prototype.decrypt = ModeOfOperationOFB.prototype.encrypt;


    /**
     *  Counter object for CTR common mode of operation
     */
    var Counter = function(initialValue) {
        if (!(this instanceof Counter)) {
            throw Error('Counter must be instanitated with `new`');
        }

        // We allow 0, but anything false-ish uses the default 1
        if (initialValue !== 0 && !initialValue) { initialValue = 1; }

        if (typeof(initialValue) === 'number') {
            this._counter = createArray(16);
            this.setValue(initialValue);

        } else {
            this.setBytes(initialValue);
        }
    }

    Counter.prototype.setValue = function(value) {
        if (typeof(value) !== 'number' || parseInt(value) != value) {
            throw new Error('invalid counter value (must be an integer)');
        }

        // We cannot safely handle numbers beyond the safe range for integers
        if (value > Number.MAX_SAFE_INTEGER) {
            throw new Error('integer value out of safe range');
        }

        for (var index = 15; index >= 0; --index) {
            this._counter[index] = value % 256;
            value = parseInt(value / 256);
        }
    }

    Counter.prototype.setBytes = function(bytes) {
        bytes = coerceArray(bytes, true);

        if (bytes.length != 16) {
            throw new Error('invalid counter bytes size (must be 16 bytes)');
        }

        this._counter = bytes;
    };

    Counter.prototype.increment = function() {
        for (var i = 15; i >= 0; i--) {
            if (this._counter[i] === 255) {
                this._counter[i] = 0;
            } else {
                this._counter[i]++;
                break;
            }
        }
    }


    /**
     *  Mode Of Operation - Counter (CTR)
     */
    var ModeOfOperationCTR = function(key, counter) {
        if (!(this instanceof ModeOfOperationCTR)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Counter";
        this.name = "ctr";

        if (!(counter instanceof Counter)) {
            counter = new Counter(counter)
        }

        this._counter = counter;

        this._remainingCounter = null;
        this._remainingCounterIndex = 16;

        this._aes = new AES(key);
    }

    ModeOfOperationCTR.prototype.encrypt = function(plaintext) {
        var encrypted = coerceArray(plaintext, true);

        for (var i = 0; i < encrypted.length; i++) {
            if (this._remainingCounterIndex === 16) {
                this._remainingCounter = this._aes.encrypt(this._counter._counter);
                this._remainingCounterIndex = 0;
                this._counter.increment();
            }
            encrypted[i] ^= this._remainingCounter[this._remainingCounterIndex++];
        }

        return encrypted;
    }

    // Decryption is symetric
    ModeOfOperationCTR.prototype.decrypt = ModeOfOperationCTR.prototype.encrypt;


    ///////////////////////
    // Padding

    // See:https://tools.ietf.org/html/rfc2315
    function pkcs7pad(data) {
        data = coerceArray(data, true);
        var padder = 16 - (data.length % 16);
        var result = createArray(data.length + padder);
        copyArray(data, result);
        for (var i = data.length; i < result.length; i++) {
            result[i] = padder;
        }
        return result;
    }

    function pkcs7strip(data) {
        data = coerceArray(data, true);
        if (data.length < 16) { throw new Error('PKCS#7 invalid length'); }

        var padder = data[data.length - 1];
        if (padder > 16) { throw new Error('PKCS#7 padding byte out of range'); }

        var length = data.length - padder;
        for (var i = 0; i < padder; i++) {
            if (data[length + i] !== padder) {
                throw new Error('PKCS#7 invalid padding byte');
            }
        }

        var result = createArray(length);
        copyArray(data, result, 0, 0, length);
        return result;
    }

    ///////////////////////
    // Exporting


    // The block cipher
    var aesjs = {
        AES: AES,
        Counter: Counter,

        ModeOfOperation: {
            ecb: ModeOfOperationECB,
            cbc: ModeOfOperationCBC,
            cfb: ModeOfOperationCFB,
            ofb: ModeOfOperationOFB,
            ctr: ModeOfOperationCTR
        },

        utils: {
            hex: convertHex,
            utf8: convertUtf8
        },

        padding: {
            pkcs7: {
                pad: pkcs7pad,
                strip: pkcs7strip
            }
        },

        _arrayTest: {
            coerceArray: coerceArray,
            createArray: createArray,
            copyArray: copyArray,
        }
    };


    // node.js
    if (true) {
        module.exports = aesjs

    // RequireJS/AMD
    // http://www.requirejs.org/docs/api.html
    // https://github.com/amdjs/amdjs-api/wiki/AMD
    } else {}


})(this);


/***/ }),

/***/ 509:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(9985);
var tryToString = __webpack_require__(3691);

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ 2655:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isConstructor = __webpack_require__(9429);
var tryToString = __webpack_require__(3691);

var $TypeError = TypeError;

// `Assert: IsConstructor(argument) is true`
module.exports = function (argument) {
  if (isConstructor(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a constructor');
};


/***/ }),

/***/ 3550:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isPossiblePrototype = __webpack_require__(598);

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (isPossiblePrototype(argument)) return argument;
  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ 7370:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var wellKnownSymbol = __webpack_require__(4201);
var create = __webpack_require__(5391);
var defineProperty = (__webpack_require__(2560).f);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] === undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ 1514:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var charAt = (__webpack_require__(730).charAt);

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};


/***/ }),

/***/ 5027:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isObject = __webpack_require__(8999);

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw new $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ 7075:
/***/ ((module) => {

"use strict";

// eslint-disable-next-line es/no-typed-arrays -- safe
module.exports = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';


/***/ }),

/***/ 4872:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_ARRAY_BUFFER = __webpack_require__(7075);
var DESCRIPTORS = __webpack_require__(7697);
var global = __webpack_require__(9037);
var isCallable = __webpack_require__(9985);
var isObject = __webpack_require__(8999);
var hasOwn = __webpack_require__(6812);
var classof = __webpack_require__(926);
var tryToString = __webpack_require__(3691);
var createNonEnumerableProperty = __webpack_require__(5773);
var defineBuiltIn = __webpack_require__(1880);
var defineBuiltInAccessor = __webpack_require__(2148);
var isPrototypeOf = __webpack_require__(3622);
var getPrototypeOf = __webpack_require__(1868);
var setPrototypeOf = __webpack_require__(9385);
var wellKnownSymbol = __webpack_require__(4201);
var uid = __webpack_require__(4630);
var InternalStateModule = __webpack_require__(618);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray = global.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array && getPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var TypeError = global.TypeError;

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
var TYPED_ARRAY_CONSTRUCTOR = 'TypedArrayConstructor';
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof(global.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQUIRED = false;
var NAME, Constructor, Prototype;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var BigIntArrayConstructorsList = {
  BigInt64Array: 8,
  BigUint64Array: 8
};

var isView = function isView(it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return klass === 'DataView'
    || hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var getTypedArrayConstructor = function (it) {
  var proto = getPrototypeOf(it);
  if (!isObject(proto)) return;
  var state = getInternalState(proto);
  return (state && hasOwn(state, TYPED_ARRAY_CONSTRUCTOR)) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor(proto);
};

var isTypedArray = function (it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw new TypeError('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (isCallable(C) && (!setPrototypeOf || isPrototypeOf(TypedArray, C))) return C;
  throw new TypeError(tryToString(C) + ' is not a typed array constructor');
};

var exportTypedArrayMethod = function (KEY, property, forced, options) {
  if (!DESCRIPTORS) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && hasOwn(TypedArrayConstructor.prototype, KEY)) try {
      delete TypedArrayConstructor.prototype[KEY];
    } catch (error) {
      // old WebKit bug - some methods are non-configurable
      try {
        TypedArrayConstructor.prototype[KEY] = property;
      } catch (error2) { /* empty */ }
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    defineBuiltIn(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property, options);
  }
};

var exportTypedArrayStaticMethod = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!DESCRIPTORS) return;
  if (setPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global[ARRAY];
      if (TypedArrayConstructor && hasOwn(TypedArrayConstructor, KEY)) try {
        delete TypedArrayConstructor[KEY];
      } catch (error) { /* empty */ }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return defineBuiltIn(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && TypedArray[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      defineBuiltIn(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
  else NATIVE_ARRAY_BUFFER_VIEWS = false;
}

for (NAME in BigIntArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || !isCallable(TypedArray) || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow -- safe
  TypedArray = function TypedArray() {
    throw new TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (DESCRIPTORS && !hasOwn(TypedArrayPrototype, TO_STRING_TAG)) {
  TYPED_ARRAY_TAG_REQUIRED = true;
  defineBuiltInAccessor(TypedArrayPrototype, TO_STRING_TAG, {
    configurable: true,
    get: function () {
      return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
    }
  });
  for (NAME in TypedArrayConstructorsList) if (global[NAME]) {
    createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

module.exports = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  getTypedArrayConstructor: getTypedArrayConstructor,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};


/***/ }),

/***/ 4328:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIndexedObject = __webpack_require__(5290);
var toAbsoluteIndex = __webpack_require__(7578);
var lengthOfArrayLike = __webpack_require__(6310);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ 6834:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(3689);

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};


/***/ }),

/***/ 8820:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aCallable = __webpack_require__(509);
var toObject = __webpack_require__(690);
var IndexedObject = __webpack_require__(4413);
var lengthOfArrayLike = __webpack_require__(6310);

var $TypeError = TypeError;

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    var O = toObject(that);
    var self = IndexedObject(O);
    var length = lengthOfArrayLike(O);
    aCallable(callbackfn);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw new $TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

module.exports = {
  // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};


/***/ }),

/***/ 6004:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);

module.exports = uncurryThis([].slice);


/***/ }),

/***/ 382:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var arraySlice = __webpack_require__(6004);

var floor = Math.floor;

var sort = function (array, comparefn) {
  var length = array.length;

  if (length < 8) {
    // insertion sort
    var i = 1;
    var element, j;

    while (i < length) {
      j = i;
      element = array[i];
      while (j && comparefn(array[j - 1], element) > 0) {
        array[j] = array[--j];
      }
      if (j !== i++) array[j] = element;
    }
  } else {
    // merge sort
    var middle = floor(length / 2);
    var left = sort(arraySlice(array, 0, middle), comparefn);
    var right = sort(arraySlice(array, middle), comparefn);
    var llength = left.length;
    var rlength = right.length;
    var lindex = 0;
    var rindex = 0;

    while (lindex < llength || rindex < rlength) {
      array[lindex + rindex] = (lindex < llength && rindex < rlength)
        ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
        : lindex < llength ? left[lindex++] : right[rindex++];
    }
  }

  return array;
};

module.exports = sort;


/***/ }),

/***/ 6431:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var wellKnownSymbol = __webpack_require__(4201);

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  try {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  } catch (error) { return false; } // workaround of old WebKit + `eval` bug
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),

/***/ 6648:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ 926:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(3043);
var isCallable = __webpack_require__(9985);
var classofRaw = __webpack_require__(6648);
var wellKnownSymbol = __webpack_require__(4201);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ 8758:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var hasOwn = __webpack_require__(6812);
var ownKeys = __webpack_require__(9152);
var getOwnPropertyDescriptorModule = __webpack_require__(2474);
var definePropertyModule = __webpack_require__(2560);

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ 1748:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(3689);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ 7807:
/***/ ((module) => {

"use strict";

// `CreateIterResultObject` abstract operation
// https://tc39.es/ecma262/#sec-createiterresultobject
module.exports = function (value, done) {
  return { value: value, done: done };
};


/***/ }),

/***/ 5773:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(7697);
var definePropertyModule = __webpack_require__(2560);
var createPropertyDescriptor = __webpack_require__(5684);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 5684:
/***/ ((module) => {

"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 2148:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var makeBuiltIn = __webpack_require__(8702);
var defineProperty = __webpack_require__(2560);

module.exports = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
  return defineProperty.f(target, name, descriptor);
};


/***/ }),

/***/ 1880:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(9985);
var definePropertyModule = __webpack_require__(2560);
var makeBuiltIn = __webpack_require__(8702);
var defineGlobalProperty = __webpack_require__(5014);

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ 5014:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ 8494:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var tryToString = __webpack_require__(3691);

var $TypeError = TypeError;

module.exports = function (O, P) {
  if (!delete O[P]) throw new $TypeError('Cannot delete property ' + tryToString(P) + ' of ' + tryToString(O));
};


/***/ }),

/***/ 7697:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(3689);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});


/***/ }),

/***/ 6420:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var isObject = __webpack_require__(8999);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ 7365:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var userAgent = __webpack_require__(71);

var firefox = userAgent.match(/firefox\/(\d+)/i);

module.exports = !!firefox && +firefox[1];


/***/ }),

/***/ 2532:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var IS_DENO = __webpack_require__(8563);
var IS_NODE = __webpack_require__(806);

module.exports = !IS_DENO && !IS_NODE
  && typeof window == 'object'
  && typeof document == 'object';


/***/ }),

/***/ 8563:
/***/ ((module) => {

"use strict";

/* global Deno -- Deno case */
module.exports = typeof Deno == 'object' && Deno && typeof Deno.version == 'object';


/***/ }),

/***/ 7298:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var UA = __webpack_require__(71);

module.exports = /MSIE|Trident/.test(UA);


/***/ }),

/***/ 806:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var classof = __webpack_require__(6648);

module.exports = classof(global.process) === 'process';


/***/ }),

/***/ 71:
/***/ ((module) => {

"use strict";

module.exports = typeof navigator != 'undefined' && String(navigator.userAgent) || '';


/***/ }),

/***/ 3615:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var userAgent = __webpack_require__(71);

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ 7922:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var userAgent = __webpack_require__(71);

var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);

module.exports = !!webkit && +webkit[1];


/***/ }),

/***/ 2739:
/***/ ((module) => {

"use strict";

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ 9989:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var getOwnPropertyDescriptor = (__webpack_require__(2474).f);
var createNonEnumerableProperty = __webpack_require__(5773);
var defineBuiltIn = __webpack_require__(1880);
var defineGlobalProperty = __webpack_require__(5014);
var copyConstructorProperties = __webpack_require__(8758);
var isForced = __webpack_require__(5266);

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = global[TARGET] && global[TARGET].prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ 3689:
/***/ ((module) => {

"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 1735:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_BIND = __webpack_require__(7215);

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


/***/ }),

/***/ 4071:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(6576);
var aCallable = __webpack_require__(509);
var NATIVE_BIND = __webpack_require__(7215);

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ 7215:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(3689);

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ 2615:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_BIND = __webpack_require__(7215);

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ 1236:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(7697);
var hasOwn = __webpack_require__(6812);

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ 2743:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);
var aCallable = __webpack_require__(509);

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ 6576:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classofRaw = __webpack_require__(6648);
var uncurryThis = __webpack_require__(8844);

module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};


/***/ }),

/***/ 8844:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_BIND = __webpack_require__(7215);

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ 6058:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var isCallable = __webpack_require__(9985);

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ 1664:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classof = __webpack_require__(926);
var getMethod = __webpack_require__(4849);
var isNullOrUndefined = __webpack_require__(981);
var Iterators = __webpack_require__(9478);
var wellKnownSymbol = __webpack_require__(4201);

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR)
    || getMethod(it, '@@iterator')
    || Iterators[classof(it)];
};


/***/ }),

/***/ 5185:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(2615);
var aCallable = __webpack_require__(509);
var anObject = __webpack_require__(5027);
var tryToString = __webpack_require__(3691);
var getIteratorMethod = __webpack_require__(1664);

var $TypeError = TypeError;

module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw new $TypeError(tryToString(argument) + ' is not iterable');
};


/***/ }),

/***/ 2643:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);
var isArray = __webpack_require__(2297);
var isCallable = __webpack_require__(9985);
var classof = __webpack_require__(6648);
var toString = __webpack_require__(4327);

var push = uncurryThis([].push);

module.exports = function (replacer) {
  if (isCallable(replacer)) return replacer;
  if (!isArray(replacer)) return;
  var rawLength = replacer.length;
  var keys = [];
  for (var i = 0; i < rawLength; i++) {
    var element = replacer[i];
    if (typeof element == 'string') push(keys, element);
    else if (typeof element == 'number' || classof(element) === 'Number' || classof(element) === 'String') push(keys, toString(element));
  }
  var keysLength = keys.length;
  var root = true;
  return function (key, value) {
    if (root) {
      root = false;
      return value;
    }
    if (isArray(this)) return value;
    for (var j = 0; j < keysLength; j++) if (keys[j] === key) return value;
  };
};


/***/ }),

/***/ 4849:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aCallable = __webpack_require__(509);
var isNullOrUndefined = __webpack_require__(981);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ 9037:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  check(typeof this == 'object' && this) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ 6812:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);
var toObject = __webpack_require__(690);

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ 7248:
/***/ ((module) => {

"use strict";

module.exports = {};


/***/ }),

/***/ 2688:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(6058);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ 8506:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(7697);
var fails = __webpack_require__(3689);
var createElement = __webpack_require__(6420);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});


/***/ }),

/***/ 4413:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);
var fails = __webpack_require__(3689);
var classof = __webpack_require__(6648);

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ 6738:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);
var isCallable = __webpack_require__(9985);
var store = __webpack_require__(4091);

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ 618:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_WEAK_MAP = __webpack_require__(9834);
var global = __webpack_require__(9037);
var isObject = __webpack_require__(8999);
var createNonEnumerableProperty = __webpack_require__(5773);
var hasOwn = __webpack_require__(6812);
var shared = __webpack_require__(4091);
var sharedKey = __webpack_require__(2713);
var hiddenKeys = __webpack_require__(7248);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ 3292:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var wellKnownSymbol = __webpack_require__(4201);
var Iterators = __webpack_require__(9478);

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),

/***/ 2297:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classof = __webpack_require__(6648);

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) === 'Array';
};


/***/ }),

/***/ 9985:
/***/ ((module) => {

"use strict";

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var documentAll = typeof document == 'object' && document.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
module.exports = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ 9429:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);
var fails = __webpack_require__(3689);
var isCallable = __webpack_require__(9985);
var classof = __webpack_require__(926);
var getBuiltIn = __webpack_require__(6058);
var inspectSource = __webpack_require__(6738);

var noop = function () { /* empty */ };
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.test(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, [], argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;


/***/ }),

/***/ 5266:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(3689);
var isCallable = __webpack_require__(9985);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ 981:
/***/ ((module) => {

"use strict";

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ 8999:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(9985);

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ 598:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isObject = __webpack_require__(8999);

module.exports = function (argument) {
  return isObject(argument) || argument === null;
};


/***/ }),

/***/ 3931:
/***/ ((module) => {

"use strict";

module.exports = false;


/***/ }),

/***/ 1245:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isObject = __webpack_require__(8999);
var classof = __webpack_require__(6648);
var wellKnownSymbol = __webpack_require__(4201);

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) === 'RegExp');
};


/***/ }),

/***/ 734:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(6058);
var isCallable = __webpack_require__(9985);
var isPrototypeOf = __webpack_require__(3622);
var USE_SYMBOL_AS_UID = __webpack_require__(9525);

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ 8734:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var bind = __webpack_require__(4071);
var call = __webpack_require__(2615);
var anObject = __webpack_require__(5027);
var tryToString = __webpack_require__(3691);
var isArrayIteratorMethod = __webpack_require__(3292);
var lengthOfArrayLike = __webpack_require__(6310);
var isPrototypeOf = __webpack_require__(3622);
var getIterator = __webpack_require__(5185);
var getIteratorMethod = __webpack_require__(1664);
var iteratorClose = __webpack_require__(2125);

var $TypeError = TypeError;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var ResultPrototype = Result.prototype;

module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_RECORD = !!(options && options.IS_RECORD);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'normal', condition);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_RECORD) {
    iterator = iterable.iterator;
  } else if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw new $TypeError(tryToString(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf(ResultPrototype, result)) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = IS_RECORD ? iterable.next : iterator.next;
  while (!(step = call(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
  } return new Result(false);
};


/***/ }),

/***/ 2125:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(2615);
var anObject = __webpack_require__(5027);
var getMethod = __webpack_require__(4849);

module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};


/***/ }),

/***/ 974:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var IteratorPrototype = (__webpack_require__(2013).IteratorPrototype);
var create = __webpack_require__(5391);
var createPropertyDescriptor = __webpack_require__(5684);
var setToStringTag = __webpack_require__(5997);
var Iterators = __webpack_require__(9478);

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),

/***/ 2013:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(3689);
var isCallable = __webpack_require__(9985);
var isObject = __webpack_require__(8999);
var create = __webpack_require__(5391);
var getPrototypeOf = __webpack_require__(1868);
var defineBuiltIn = __webpack_require__(1880);
var wellKnownSymbol = __webpack_require__(4201);
var IS_PURE = __webpack_require__(3931);

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),

/***/ 9478:
/***/ ((module) => {

"use strict";

module.exports = {};


/***/ }),

/***/ 6310:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toLength = __webpack_require__(3126);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ 8702:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);
var fails = __webpack_require__(3689);
var isCallable = __webpack_require__(9985);
var hasOwn = __webpack_require__(6812);
var DESCRIPTORS = __webpack_require__(7697);
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(1236).CONFIGURABLE);
var inspectSource = __webpack_require__(6738);
var InternalStateModule = __webpack_require__(618);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ 8828:
/***/ ((module) => {

"use strict";

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ 8742:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aCallable = __webpack_require__(509);

var $TypeError = TypeError;

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw new $TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aCallable(resolve);
  this.reject = aCallable(reject);
};

// `NewPromiseCapability` abstract operation
// https://tc39.es/ecma262/#sec-newpromisecapability
module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ 5391:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(5027);
var definePropertiesModule = __webpack_require__(8920);
var enumBugKeys = __webpack_require__(2739);
var hiddenKeys = __webpack_require__(7248);
var html = __webpack_require__(2688);
var documentCreateElement = __webpack_require__(6420);
var sharedKey = __webpack_require__(2713);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ }),

/***/ 8920:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(7697);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(5648);
var definePropertyModule = __webpack_require__(2560);
var anObject = __webpack_require__(5027);
var toIndexedObject = __webpack_require__(5290);
var objectKeys = __webpack_require__(300);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ }),

/***/ 2560:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(7697);
var IE8_DOM_DEFINE = __webpack_require__(8506);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(5648);
var anObject = __webpack_require__(5027);
var toPropertyKey = __webpack_require__(8360);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 2474:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(7697);
var call = __webpack_require__(2615);
var propertyIsEnumerableModule = __webpack_require__(9556);
var createPropertyDescriptor = __webpack_require__(5684);
var toIndexedObject = __webpack_require__(5290);
var toPropertyKey = __webpack_require__(8360);
var hasOwn = __webpack_require__(6812);
var IE8_DOM_DEFINE = __webpack_require__(8506);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ 2741:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var internalObjectKeys = __webpack_require__(4948);
var enumBugKeys = __webpack_require__(2739);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ 7518:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 1868:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var hasOwn = __webpack_require__(6812);
var isCallable = __webpack_require__(9985);
var toObject = __webpack_require__(690);
var sharedKey = __webpack_require__(2713);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(1748);

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};


/***/ }),

/***/ 3622:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ 4948:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);
var hasOwn = __webpack_require__(6812);
var toIndexedObject = __webpack_require__(5290);
var indexOf = (__webpack_require__(4328).indexOf);
var hiddenKeys = __webpack_require__(7248);

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ 300:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var internalObjectKeys = __webpack_require__(4948);
var enumBugKeys = __webpack_require__(2739);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ 9556:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ 9385:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__(2743);
var anObject = __webpack_require__(5027);
var aPossiblePrototype = __webpack_require__(3550);

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ 5899:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(2615);
var isCallable = __webpack_require__(9985);
var isObject = __webpack_require__(8999);

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw new $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 9152:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(6058);
var uncurryThis = __webpack_require__(8844);
var getOwnPropertyNamesModule = __webpack_require__(2741);
var getOwnPropertySymbolsModule = __webpack_require__(7518);
var anObject = __webpack_require__(5027);

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ 9302:
/***/ ((module) => {

"use strict";

module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};


/***/ }),

/***/ 7073:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var NativePromiseConstructor = __webpack_require__(7919);
var isCallable = __webpack_require__(9985);
var isForced = __webpack_require__(5266);
var inspectSource = __webpack_require__(6738);
var wellKnownSymbol = __webpack_require__(4201);
var IS_BROWSER = __webpack_require__(2532);
var IS_DENO = __webpack_require__(8563);
var IS_PURE = __webpack_require__(3931);
var V8_VERSION = __webpack_require__(3615);

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
var SPECIES = wellKnownSymbol('species');
var SUBCLASSING = false;
var NATIVE_PROMISE_REJECTION_EVENT = isCallable(global.PromiseRejectionEvent);

var FORCED_PROMISE_CONSTRUCTOR = isForced('Promise', function () {
  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(NativePromiseConstructor);
  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor);
  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
  // We can't detect it synchronously, so just check versions
  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
  // We need Promise#{ catch, finally } in the pure version for preventing prototype pollution
  if (IS_PURE && !(NativePromisePrototype['catch'] && NativePromisePrototype['finally'])) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (!V8_VERSION || V8_VERSION < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
    // Detect correctness of subclassing with @@species support
    var promise = new NativePromiseConstructor(function (resolve) { resolve(1); });
    var FakePromise = function (exec) {
      exec(function () { /* empty */ }, function () { /* empty */ });
    };
    var constructor = promise.constructor = {};
    constructor[SPECIES] = FakePromise;
    SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
    if (!SUBCLASSING) return true;
  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
  } return !GLOBAL_CORE_JS_PROMISE && (IS_BROWSER || IS_DENO) && !NATIVE_PROMISE_REJECTION_EVENT;
});

module.exports = {
  CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR,
  REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT,
  SUBCLASSING: SUBCLASSING
};


/***/ }),

/***/ 7919:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);

module.exports = global.Promise;


/***/ }),

/***/ 562:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NativePromiseConstructor = __webpack_require__(7919);
var checkCorrectnessOfIteration = __webpack_require__(6431);
var FORCED_PROMISE_CONSTRUCTOR = (__webpack_require__(7073).CONSTRUCTOR);

module.exports = FORCED_PROMISE_CONSTRUCTOR || !checkCorrectnessOfIteration(function (iterable) {
  NativePromiseConstructor.all(iterable).then(undefined, function () { /* empty */ });
});


/***/ }),

/***/ 6100:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(2615);
var anObject = __webpack_require__(5027);
var isCallable = __webpack_require__(9985);
var classof = __webpack_require__(6648);
var regexpExec = __webpack_require__(6308);

var $TypeError = TypeError;

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (isCallable(exec)) {
    var result = call(exec, R, S);
    if (result !== null) anObject(result);
    return result;
  }
  if (classof(R) === 'RegExp') return call(regexpExec, R, S);
  throw new $TypeError('RegExp#exec called on incompatible receiver');
};


/***/ }),

/***/ 6308:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */
var call = __webpack_require__(2615);
var uncurryThis = __webpack_require__(8844);
var toString = __webpack_require__(4327);
var regexpFlags = __webpack_require__(9633);
var stickyHelpers = __webpack_require__(7901);
var shared = __webpack_require__(3430);
var create = __webpack_require__(5391);
var getInternalState = (__webpack_require__(618).get);
var UNSUPPORTED_DOT_ALL = __webpack_require__(2100);
var UNSUPPORTED_NCG = __webpack_require__(6422);

var nativeReplace = shared('native-string-replace', String.prototype.replace);
var nativeExec = RegExp.prototype.exec;
var patchedExec = nativeExec;
var charAt = uncurryThis(''.charAt);
var indexOf = uncurryThis(''.indexOf);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  call(nativeExec, re1, 'a');
  call(nativeExec, re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

if (PATCH) {
  patchedExec = function exec(string) {
    var re = this;
    var state = getInternalState(re);
    var str = toString(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;

    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = call(patchedExec, raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }

    var groups = state.groups;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = call(regexpFlags, re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = replace(flags, 'y', '');
      if (indexOf(flags, 'g') === -1) {
        flags += 'g';
      }

      strCopy = stringSlice(str, re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt(str, re.lastIndex - 1) !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = call(nativeExec, sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = stringSlice(match.input, charsAdded);
        match[0] = stringSlice(match[0], charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn't work for /(.?)?/
      call(nativeReplace, match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    if (match && groups) {
      match.groups = object = create(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ 9633:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var anObject = __webpack_require__(5027);

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.hasIndices) result += 'd';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.unicodeSets) result += 'v';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ 3477:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(2615);
var hasOwn = __webpack_require__(6812);
var isPrototypeOf = __webpack_require__(3622);
var regExpFlags = __webpack_require__(9633);

var RegExpPrototype = RegExp.prototype;

module.exports = function (R) {
  var flags = R.flags;
  return flags === undefined && !('flags' in RegExpPrototype) && !hasOwn(R, 'flags') && isPrototypeOf(RegExpPrototype, R)
    ? call(regExpFlags, R) : flags;
};


/***/ }),

/***/ 7901:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(3689);
var global = __webpack_require__(9037);

// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
var $RegExp = global.RegExp;

var UNSUPPORTED_Y = fails(function () {
  var re = $RegExp('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') !== null;
});

// UC Browser bug
// https://github.com/zloirock/core-js/issues/1008
var MISSED_STICKY = UNSUPPORTED_Y || fails(function () {
  return !$RegExp('a', 'y').sticky;
});

var BROKEN_CARET = UNSUPPORTED_Y || fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = $RegExp('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') !== null;
});

module.exports = {
  BROKEN_CARET: BROKEN_CARET,
  MISSED_STICKY: MISSED_STICKY,
  UNSUPPORTED_Y: UNSUPPORTED_Y
};


/***/ }),

/***/ 2100:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(3689);
var global = __webpack_require__(9037);

// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
var $RegExp = global.RegExp;

module.exports = fails(function () {
  var re = $RegExp('.', 's');
  return !(re.dotAll && re.test('\n') && re.flags === 's');
});


/***/ }),

/***/ 6422:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(3689);
var global = __webpack_require__(9037);

// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
var $RegExp = global.RegExp;

module.exports = fails(function () {
  var re = $RegExp('(?<a>b)', 'g');
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});


/***/ }),

/***/ 4684:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isNullOrUndefined = __webpack_require__(981);

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ 5997:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var defineProperty = (__webpack_require__(2560).f);
var hasOwn = __webpack_require__(6812);
var wellKnownSymbol = __webpack_require__(4201);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (target, TAG, STATIC) {
  if (target && !STATIC) target = target.prototype;
  if (target && !hasOwn(target, TO_STRING_TAG)) {
    defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};


/***/ }),

/***/ 2713:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var shared = __webpack_require__(3430);
var uid = __webpack_require__(4630);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ 4091:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var defineGlobalProperty = __webpack_require__(5014);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ }),

/***/ 3430:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var IS_PURE = __webpack_require__(3931);
var store = __webpack_require__(4091);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.35.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2024 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.35.1/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ 6373:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var anObject = __webpack_require__(5027);
var aConstructor = __webpack_require__(2655);
var isNullOrUndefined = __webpack_require__(981);
var wellKnownSymbol = __webpack_require__(4201);

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || isNullOrUndefined(S = anObject(C)[SPECIES]) ? defaultConstructor : aConstructor(S);
};


/***/ }),

/***/ 730:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);
var toIntegerOrInfinity = __webpack_require__(8700);
var toString = __webpack_require__(4327);
var requireObjectCoercible = __webpack_require__(4684);

var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var stringSlice = uncurryThis(''.slice);

var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),

/***/ 146:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(3615);
var fails = __webpack_require__(3689);
var global = __webpack_require__(9037);

var $String = global.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ 7578:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIntegerOrInfinity = __webpack_require__(8700);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ 5290:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(4413);
var requireObjectCoercible = __webpack_require__(4684);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ 8700:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var trunc = __webpack_require__(8828);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ 3126:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIntegerOrInfinity = __webpack_require__(8700);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ 690:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var requireObjectCoercible = __webpack_require__(4684);

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ 3250:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toPositiveInteger = __webpack_require__(5904);

var $RangeError = RangeError;

module.exports = function (it, BYTES) {
  var offset = toPositiveInteger(it);
  if (offset % BYTES) throw new $RangeError('Wrong offset');
  return offset;
};


/***/ }),

/***/ 5904:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIntegerOrInfinity = __webpack_require__(8700);

var $RangeError = RangeError;

module.exports = function (it) {
  var result = toIntegerOrInfinity(it);
  if (result < 0) throw new $RangeError("The argument can't be less than 0");
  return result;
};


/***/ }),

/***/ 8732:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(2615);
var isObject = __webpack_require__(8999);
var isSymbol = __webpack_require__(734);
var getMethod = __webpack_require__(4849);
var ordinaryToPrimitive = __webpack_require__(5899);
var wellKnownSymbol = __webpack_require__(4201);

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw new $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ 8360:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toPrimitive = __webpack_require__(8732);
var isSymbol = __webpack_require__(734);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ 3043:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var wellKnownSymbol = __webpack_require__(4201);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ 4327:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classof = __webpack_require__(926);

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ }),

/***/ 3691:
/***/ ((module) => {

"use strict";

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ 4630:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ 9525:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(146);

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ 5648:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(7697);
var fails = __webpack_require__(3689);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});


/***/ }),

/***/ 9834:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var isCallable = __webpack_require__(9985);

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ 4201:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var shared = __webpack_require__(3430);
var hasOwn = __webpack_require__(6812);
var uid = __webpack_require__(4630);
var NATIVE_SYMBOL = __webpack_require__(146);
var USE_SYMBOL_AS_UID = __webpack_require__(9525);

var Symbol = global.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ 278:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(9989);
var $reduce = (__webpack_require__(8820).left);
var arrayMethodIsStrict = __webpack_require__(6834);
var CHROME_VERSION = __webpack_require__(3615);
var IS_NODE = __webpack_require__(806);

// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83;
var FORCED = CHROME_BUG || !arrayMethodIsStrict('reduce');

// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
$({ target: 'Array', proto: true, forced: FORCED }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    var length = arguments.length;
    return $reduce(this, callbackfn, length, length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ 5137:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(9989);
var uncurryThis = __webpack_require__(8844);
var aCallable = __webpack_require__(509);
var toObject = __webpack_require__(690);
var lengthOfArrayLike = __webpack_require__(6310);
var deletePropertyOrThrow = __webpack_require__(8494);
var toString = __webpack_require__(4327);
var fails = __webpack_require__(3689);
var internalSort = __webpack_require__(382);
var arrayMethodIsStrict = __webpack_require__(6834);
var FF = __webpack_require__(7365);
var IE_OR_EDGE = __webpack_require__(7298);
var V8 = __webpack_require__(3615);
var WEBKIT = __webpack_require__(7922);

var test = [];
var nativeSort = uncurryThis(test.sort);
var push = uncurryThis(test.push);

// IE8-
var FAILS_ON_UNDEFINED = fails(function () {
  test.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails(function () {
  test.sort(null);
});
// Old WebKit
var STRICT_METHOD = arrayMethodIsStrict('sort');

var STABLE_SORT = !fails(function () {
  // feature detection can be too slow, so check engines versions
  if (V8) return V8 < 70;
  if (FF && FF > 3) return;
  if (IE_OR_EDGE) return true;
  if (WEBKIT) return WEBKIT < 603;

  var result = '';
  var code, chr, value, index;

  // generate an array with more 512 elements (Chakra and old V8 fails only in this case)
  for (code = 65; code < 76; code++) {
    chr = String.fromCharCode(code);

    switch (code) {
      case 66: case 69: case 70: case 72: value = 3; break;
      case 68: case 71: value = 4; break;
      default: value = 2;
    }

    for (index = 0; index < 47; index++) {
      test.push({ k: chr + index, v: value });
    }
  }

  test.sort(function (a, b) { return b.v - a.v; });

  for (index = 0; index < test.length; index++) {
    chr = test[index].k.charAt(0);
    if (result.charAt(result.length - 1) !== chr) result += chr;
  }

  return result !== 'DGBEFHACIJK';
});

var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD || !STABLE_SORT;

var getSortCompare = function (comparefn) {
  return function (x, y) {
    if (y === undefined) return -1;
    if (x === undefined) return 1;
    if (comparefn !== undefined) return +comparefn(x, y) || 0;
    return toString(x) > toString(y) ? 1 : -1;
  };
};

// `Array.prototype.sort` method
// https://tc39.es/ecma262/#sec-array.prototype.sort
$({ target: 'Array', proto: true, forced: FORCED }, {
  sort: function sort(comparefn) {
    if (comparefn !== undefined) aCallable(comparefn);

    var array = toObject(this);

    if (STABLE_SORT) return comparefn === undefined ? nativeSort(array) : nativeSort(array, comparefn);

    var items = [];
    var arrayLength = lengthOfArrayLike(array);
    var itemsLength, index;

    for (index = 0; index < arrayLength; index++) {
      if (index in array) push(items, array[index]);
    }

    internalSort(items, getSortCompare(comparefn));

    itemsLength = lengthOfArrayLike(items);
    index = 0;

    while (index < itemsLength) array[index] = items[index++];
    while (index < arrayLength) deletePropertyOrThrow(array, index++);

    return array;
  }
});


/***/ }),

/***/ 3383:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// this method was added to unscopables after implementation
// in popular engines, so it's moved to a separate module
var addToUnscopables = __webpack_require__(7370);

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('flat');


/***/ }),

/***/ 8324:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(9989);
var getBuiltIn = __webpack_require__(6058);
var apply = __webpack_require__(1735);
var call = __webpack_require__(2615);
var uncurryThis = __webpack_require__(8844);
var fails = __webpack_require__(3689);
var isCallable = __webpack_require__(9985);
var isSymbol = __webpack_require__(734);
var arraySlice = __webpack_require__(6004);
var getReplacerFunction = __webpack_require__(2643);
var NATIVE_SYMBOL = __webpack_require__(146);

var $String = String;
var $stringify = getBuiltIn('JSON', 'stringify');
var exec = uncurryThis(/./.exec);
var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var replace = uncurryThis(''.replace);
var numberToString = uncurryThis(1.0.toString);

var tester = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;

var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL || fails(function () {
  var symbol = getBuiltIn('Symbol')('stringify detection');
  // MS Edge converts symbol values to JSON as {}
  return $stringify([symbol]) !== '[null]'
    // WebKit converts symbol values to JSON as null
    || $stringify({ a: symbol }) !== '{}'
    // V8 throws on boxed symbols
    || $stringify(Object(symbol)) !== '{}';
});

// https://github.com/tc39/proposal-well-formed-stringify
var ILL_FORMED_UNICODE = fails(function () {
  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
    || $stringify('\uDEAD') !== '"\\udead"';
});

var stringifyWithSymbolsFix = function (it, replacer) {
  var args = arraySlice(arguments);
  var $replacer = getReplacerFunction(replacer);
  if (!isCallable($replacer) && (it === undefined || isSymbol(it))) return; // IE8 returns string on undefined
  args[1] = function (key, value) {
    // some old implementations (like WebKit) could pass numbers as keys
    if (isCallable($replacer)) value = call($replacer, this, $String(key), value);
    if (!isSymbol(value)) return value;
  };
  return apply($stringify, null, args);
};

var fixIllFormed = function (match, offset, string) {
  var prev = charAt(string, offset - 1);
  var next = charAt(string, offset + 1);
  if ((exec(low, match) && !exec(hi, next)) || (exec(hi, match) && !exec(low, prev))) {
    return '\\u' + numberToString(charCodeAt(match, 0), 16);
  } return match;
};

if ($stringify) {
  // `JSON.stringify` method
  // https://tc39.es/ecma262/#sec-json.stringify
  $({ target: 'JSON', stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = arraySlice(arguments);
      var result = apply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace(result, tester, fixIllFormed) : result;
    }
  });
}


/***/ }),

/***/ 1195:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(9989);
var call = __webpack_require__(2615);
var aCallable = __webpack_require__(509);
var newPromiseCapabilityModule = __webpack_require__(8742);
var perform = __webpack_require__(9302);
var iterate = __webpack_require__(8734);
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__(562);

// `Promise.allSettled` method
// https://tc39.es/ecma262/#sec-promise.allsettled
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  allSettled: function allSettled(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aCallable(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        call(promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'fulfilled', value: value };
          --remaining || resolve(values);
        }, function (error) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'rejected', reason: error };
          --remaining || resolve(values);
        });
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ 9866:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable es/no-string-prototype-matchall -- safe */
var $ = __webpack_require__(9989);
var call = __webpack_require__(2615);
var uncurryThis = __webpack_require__(6576);
var createIteratorConstructor = __webpack_require__(974);
var createIterResultObject = __webpack_require__(7807);
var requireObjectCoercible = __webpack_require__(4684);
var toLength = __webpack_require__(3126);
var toString = __webpack_require__(4327);
var anObject = __webpack_require__(5027);
var isNullOrUndefined = __webpack_require__(981);
var classof = __webpack_require__(6648);
var isRegExp = __webpack_require__(1245);
var getRegExpFlags = __webpack_require__(3477);
var getMethod = __webpack_require__(4849);
var defineBuiltIn = __webpack_require__(1880);
var fails = __webpack_require__(3689);
var wellKnownSymbol = __webpack_require__(4201);
var speciesConstructor = __webpack_require__(6373);
var advanceStringIndex = __webpack_require__(1514);
var regExpExec = __webpack_require__(6100);
var InternalStateModule = __webpack_require__(618);
var IS_PURE = __webpack_require__(3931);

var MATCH_ALL = wellKnownSymbol('matchAll');
var REGEXP_STRING = 'RegExp String';
var REGEXP_STRING_ITERATOR = REGEXP_STRING + ' Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(REGEXP_STRING_ITERATOR);
var RegExpPrototype = RegExp.prototype;
var $TypeError = TypeError;
var stringIndexOf = uncurryThis(''.indexOf);
var nativeMatchAll = uncurryThis(''.matchAll);

var WORKS_WITH_NON_GLOBAL_REGEX = !!nativeMatchAll && !fails(function () {
  nativeMatchAll('a', /./);
});

var $RegExpStringIterator = createIteratorConstructor(function RegExpStringIterator(regexp, string, $global, fullUnicode) {
  setInternalState(this, {
    type: REGEXP_STRING_ITERATOR,
    regexp: regexp,
    string: string,
    global: $global,
    unicode: fullUnicode,
    done: false
  });
}, REGEXP_STRING, function next() {
  var state = getInternalState(this);
  if (state.done) return createIterResultObject(undefined, true);
  var R = state.regexp;
  var S = state.string;
  var match = regExpExec(R, S);
  if (match === null) {
    state.done = true;
    return createIterResultObject(undefined, true);
  }
  if (state.global) {
    if (toString(match[0]) === '') R.lastIndex = advanceStringIndex(S, toLength(R.lastIndex), state.unicode);
    return createIterResultObject(match, false);
  }
  state.done = true;
  return createIterResultObject(match, false);
});

var $matchAll = function (string) {
  var R = anObject(this);
  var S = toString(string);
  var C = speciesConstructor(R, RegExp);
  var flags = toString(getRegExpFlags(R));
  var matcher, $global, fullUnicode;
  matcher = new C(C === RegExp ? R.source : R, flags);
  $global = !!~stringIndexOf(flags, 'g');
  fullUnicode = !!~stringIndexOf(flags, 'u');
  matcher.lastIndex = toLength(R.lastIndex);
  return new $RegExpStringIterator(matcher, S, $global, fullUnicode);
};

// `String.prototype.matchAll` method
// https://tc39.es/ecma262/#sec-string.prototype.matchall
$({ target: 'String', proto: true, forced: WORKS_WITH_NON_GLOBAL_REGEX }, {
  matchAll: function matchAll(regexp) {
    var O = requireObjectCoercible(this);
    var flags, S, matcher, rx;
    if (!isNullOrUndefined(regexp)) {
      if (isRegExp(regexp)) {
        flags = toString(requireObjectCoercible(getRegExpFlags(regexp)));
        if (!~stringIndexOf(flags, 'g')) throw new $TypeError('`.matchAll` does not allow non-global regexes');
      }
      if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll(O, regexp);
      matcher = getMethod(regexp, MATCH_ALL);
      if (matcher === undefined && IS_PURE && classof(regexp) === 'RegExp') matcher = $matchAll;
      if (matcher) return call(matcher, regexp, O);
    } else if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll(O, regexp);
    S = toString(O);
    rx = new RegExp(regexp, 'g');
    return IS_PURE ? call($matchAll, rx, S) : rx[MATCH_ALL](S);
  }
});

IS_PURE || MATCH_ALL in RegExpPrototype || defineBuiltIn(RegExpPrototype, MATCH_ALL, $matchAll);


/***/ }),

/***/ 6544:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// `Symbol.prototype.description` getter
// https://tc39.es/ecma262/#sec-symbol.prototype.description

var $ = __webpack_require__(9989);
var DESCRIPTORS = __webpack_require__(7697);
var global = __webpack_require__(9037);
var uncurryThis = __webpack_require__(8844);
var hasOwn = __webpack_require__(6812);
var isCallable = __webpack_require__(9985);
var isPrototypeOf = __webpack_require__(3622);
var toString = __webpack_require__(4327);
var defineBuiltInAccessor = __webpack_require__(2148);
var copyConstructorProperties = __webpack_require__(8758);

var NativeSymbol = global.Symbol;
var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

if (DESCRIPTORS && isCallable(NativeSymbol) && (!('description' in SymbolPrototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString(arguments[0]);
    var result = isPrototypeOf(SymbolPrototype, this)
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };

  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  SymbolWrapper.prototype = SymbolPrototype;
  SymbolPrototype.constructor = SymbolWrapper;

  var NATIVE_SYMBOL = String(NativeSymbol('description detection')) === 'Symbol(description detection)';
  var thisSymbolValue = uncurryThis(SymbolPrototype.valueOf);
  var symbolDescriptiveString = uncurryThis(SymbolPrototype.toString);
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  var replace = uncurryThis(''.replace);
  var stringSlice = uncurryThis(''.slice);

  defineBuiltInAccessor(SymbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = thisSymbolValue(this);
      if (hasOwn(EmptyStringDescriptionStore, symbol)) return '';
      var string = symbolDescriptiveString(symbol);
      var desc = NATIVE_SYMBOL ? stringSlice(string, 7, -1) : replace(string, regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $({ global: true, constructor: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}


/***/ }),

/***/ 9976:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var call = __webpack_require__(2615);
var ArrayBufferViewCore = __webpack_require__(4872);
var lengthOfArrayLike = __webpack_require__(6310);
var toOffset = __webpack_require__(3250);
var toIndexedObject = __webpack_require__(690);
var fails = __webpack_require__(3689);

var RangeError = global.RangeError;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var $set = Int8ArrayPrototype && Int8ArrayPrototype.set;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

var WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS = !fails(function () {
  // eslint-disable-next-line es/no-typed-arrays -- required for testing
  var array = new Uint8ClampedArray(2);
  call($set, array, { length: 1, 0: 3 }, 1);
  return array[1] !== 3;
});

// https://bugs.chromium.org/p/v8/issues/detail?id=11294 and other
var TO_OBJECT_BUG = WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS && ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS && fails(function () {
  var array = new Int8Array(2);
  array.set(1);
  array.set('2', 1);
  return array[0] !== 0 || array[1] !== 2;
});

// `%TypedArray%.prototype.set` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
exportTypedArrayMethod('set', function set(arrayLike /* , offset */) {
  aTypedArray(this);
  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
  var src = toIndexedObject(arrayLike);
  if (WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS) return call($set, this, src, offset);
  var length = this.length;
  var len = lengthOfArrayLike(src);
  var index = 0;
  if (len + offset > length) throw new RangeError('Wrong length');
  while (index < len) this[offset + index] = src[index++];
}, !WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS || TO_OBJECT_BUG);


/***/ }),

/***/ 3356:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var uncurryThis = __webpack_require__(6576);
var fails = __webpack_require__(3689);
var aCallable = __webpack_require__(509);
var internalSort = __webpack_require__(382);
var ArrayBufferViewCore = __webpack_require__(4872);
var FF = __webpack_require__(7365);
var IE_OR_EDGE = __webpack_require__(7298);
var V8 = __webpack_require__(3615);
var WEBKIT = __webpack_require__(7922);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var Uint16Array = global.Uint16Array;
var nativeSort = Uint16Array && uncurryThis(Uint16Array.prototype.sort);

// WebKit
var ACCEPT_INCORRECT_ARGUMENTS = !!nativeSort && !(fails(function () {
  nativeSort(new Uint16Array(2), null);
}) && fails(function () {
  nativeSort(new Uint16Array(2), {});
}));

var STABLE_SORT = !!nativeSort && !fails(function () {
  // feature detection can be too slow, so check engines versions
  if (V8) return V8 < 74;
  if (FF) return FF < 67;
  if (IE_OR_EDGE) return true;
  if (WEBKIT) return WEBKIT < 602;

  var array = new Uint16Array(516);
  var expected = Array(516);
  var index, mod;

  for (index = 0; index < 516; index++) {
    mod = index % 4;
    array[index] = 515 - index;
    expected[index] = index - 2 * mod + 3;
  }

  nativeSort(array, function (a, b) {
    return (a / 4 | 0) - (b / 4 | 0);
  });

  for (index = 0; index < 516; index++) {
    if (array[index] !== expected[index]) return true;
  }
});

var getSortCompare = function (comparefn) {
  return function (x, y) {
    if (comparefn !== undefined) return +comparefn(x, y) || 0;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (y !== y) return -1;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (x !== x) return 1;
    if (x === 0 && y === 0) return 1 / x > 0 && 1 / y < 0 ? 1 : -1;
    return x > y;
  };
};

// `%TypedArray%.prototype.sort` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
exportTypedArrayMethod('sort', function sort(comparefn) {
  if (comparefn !== undefined) aCallable(comparefn);
  if (STABLE_SORT) return nativeSort(this, comparefn);

  return internalSort(aTypedArray(this), getSortCompare(comparefn));
}, !STABLE_SORT || ACCEPT_INCORRECT_ARGUMENTS);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  UV: () => (/* binding */ cachePrinterAuthModes),
  V$: () => (/* binding */ onPrintersDiscovered)
});

// UNUSED EXPORTS: authOptions

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.unscopables.flat.js
var es_array_unscopables_flat = __webpack_require__(3383);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.json.stringify.js
var es_json_stringify = __webpack_require__(8324);
;// CONCATENATED MODULE: ./src/scripts/globals.ts
const _EXTENSION_ID = (/* unused pure expression or super */ null && ("ndakideadaglgpbblmppfonobpdgggin"));

const _APP_ID = "alhngdkjgnedakdlnamimgfihgkmenbh";

const _SELF_ID = "ndakideadaglgpbblmppfonobpdgggin";

const _VERSION = (/* unused pure expression or super */ null && ("1.4.2"));

(function () {
  if (false) {}
})();
function isExtension() {
  return "ndakideadaglgpbblmppfonobpdgggin" === "ndakideadaglgpbblmppfonobpdgggin";
}
function isApp() {
  return "ndakideadaglgpbblmppfonobpdgggin" === "alhngdkjgnedakdlnamimgfihgkmenbh";
}
function globals_GetClientVersionID() {
  if (isApp()) {
    return 'ChromeApp-' + "1.4.2";
  } else {
    return 'ChromeAppExt-' + "1.4.2";
  }
}
;// CONCATENATED MODULE: ./src/scripts/http/http.ts
async function getResponseBody(resp) {
  if (resp.ok) {
    return resp.json().then(respBody => respBody);
  }
  throw Error(`request ${resp.url} failed with HTTP ${resp.status} ${resp.statusText}`);
}
;// CONCATENATED MODULE: ./src/scripts/time/format.ts
function iso8601DateTimeZone(d) {
  const offset = -d.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + sign + pad(offset / 60) + ':' + pad(offset % 60);
}
function pad(n) {
  const abs = Math.floor(Math.abs(n));
  return (abs < 10 ? '0' : '') + abs;
}
;// CONCATENATED MODULE: ./src/scripts/log/log.ts


let remoteLogging = undefined;
if (self.chrome && chrome.storage && chrome.storage.local !== undefined) {
  chrome.storage.local.get('remoteLoggingURL', d => {
    if (d && d.remoteLoggingURL && d.remoteLoggingURL.startsWith('http')) {
      log_log(`Remote logging initialised: ${JSON.stringify(d)}`);
      remoteLogging = d;
    }
  });
}
function remoteLog(request) {
  if (!remoteLogging || !remoteLogging.remoteLoggingURL) {
    return;
  }
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    if (tabs.length > 0) {
      request.body = `tab:${tabs[0].id} - ${request.body}`;
    } else {
      request.body = `??? - ${request.body}`;
    }
    fetch(`${remoteLogging.remoteLoggingURL}`, request).catch(e => {
      console.error('failed to remote log', e);
    });
  });
}
function isRemoteLogging() {
  return remoteLogging !== undefined;
}
function log_log(...args) {
  if (offscreenContext()) {
    sendToServiceWorker('log', args);
  } else {
    console.log.apply(console, [iso8601DateTimeZone(new Date()), ...args]);
  }
  if (isRemoteLogging()) {
    remoteLog({
      method: 'POST',
      body: JSON.stringify(['INFO', ...args])
    });
  }
}
function log_error(...args) {
  if (offscreenContext()) {
    sendToServiceWorker('error', args);
  } else {
    console.error.apply(console, [iso8601DateTimeZone(new Date()), ...args]);
  }
  if (isRemoteLogging()) {
    remoteLog({
      method: 'POST',
      body: JSON.stringify(['ERROR', ...args])
    });
  }
}
function warn(...args) {
  if (offscreenContext()) {
    sendToServiceWorker('warn', args);
  } else {
    console.warn.apply(console, [iso8601DateTimeZone(new Date()), ...args]);
  }
  if (isRemoteLogging()) {
    remoteLog({
      method: 'POST',
      body: JSON.stringify(['WARN', ...args])
    });
  }
}
function offscreenContext() {
  try {
    chrome.runtime.getManifest();
  } catch (e) {
    return true;
  }
  return false;
}
function sendToServiceWorker(type, data) {
  chrome.runtime.sendMessage({
    type,
    target: 'background',
    data
  });
}
;// CONCATENATED MODULE: ./src/scripts/log/index.ts

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.set.js
var es_typed_array_set = __webpack_require__(9976);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.sort.js
var es_typed_array_sort = __webpack_require__(3356);
;// CONCATENATED MODULE: ./src/scripts/random/string.ts


const RANDOM_STRING_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function cryptoRandomString(length) {
  let result = '';
  for (const v of crypto.getRandomValues(new Uint32Array(length))) {
    result += RANDOM_STRING_CHARSET[v % RANDOM_STRING_CHARSET.length];
  }
  return result;
}
;// CONCATENATED MODULE: ./src/scripts/random/index.ts

;// CONCATENATED MODULE: ./src/scripts/storage/storage.ts
async function getManagedStorageData(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.managed.get(key, function (data) {
      if (data && data[key]) {
        resolve(data[key]);
      } else if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(undefined);
      }
    });
  });
}
async function getLocalStorageData(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, result => {
      if (result && result[key]) {
        resolve(result[key]);
      } else if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(undefined);
      }
    });
  });
}
async function removeLocalStorageData(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(keys, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}
async function setLocalStorageData(key, data) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({
      [key]: data
    }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(data);
      }
    });
  });
}
async function saveMap(key, map) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({
      [key]: Array.from(map.entries())
    }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(key);
      }
    });
  });
}
async function loadMap(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, d => {
      if (d && d[key]) {
        const map = new Map();
        for (const [k, v] of d[key]) {
          map.set(k, v);
        }
        resolve(map);
      } else if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(undefined);
      }
    });
  });
}
;// CONCATENATED MODULE: ./src/scripts/identity/clientId.ts


const CLIENT_ID_LENGTH = 22;
async function getClientId() {
  const clientId = await getLocalStorageData('clientId');
  if (clientId) {
    return Promise.resolve(clientId);
  } else {
    return setLocalStorageData('clientId', cryptoRandomString(CLIENT_ID_LENGTH));
  }
}
;// CONCATENATED MODULE: ./src/scripts/identity/index.ts

;// CONCATENATED MODULE: ./node_modules/pc-mobility-cloud/client/ts/session.ts

async function session_createSession(baseUrl, req) {
  const init = prepareRequestInit(req.clientToken, req.clientId);
  init.method = "POST";
  const response = await fetch(`${sessionPath(baseUrl)}`, init);
  if (response.status !== 200) {
    throw `error creating client session [${response.status}]`;
  }
  return await response.json();
}
async function session_createOffer(baseUrl, req) {
  const init = prepareRequestInit(req.clientToken, req.clientId);
  init.method = "PUT";
  init.body = JSON.stringify({
    iceOffer: req.iceOffer
  });
  const response = await fetch(`${sessionPath(baseUrl)}/${req.sessionId}/offer`, init);
  if (response.status == 400) {
    throw `error sending offer: expired session`;
  }
  if (response.status != 200) {
    throw `error sending offer: [${response.status}]`;
  }
  return await response.json();
}
async function session_notifyClientCandidates(baseUrl, req) {
  const init = prepareRequestInit(req.clientToken, req.clientId);
  init.method = "POST";
  init.body = JSON.stringify({
    iceCandidates: req.iceCandidates
  });
  const response = await fetch(`${sessionPath(baseUrl)}/${req.sessionId}/candidate`, init);
  if (response.status == 400) {
    throw `error notifying new candidates: expired session`;
  }
  if (response.status != 200) {
    throw `error notifying new candidates: [${response.status}]`;
  }
  return await response.json();
}
async function session_getAnswer(baseUrl, req) {
  const init = prepareRequestInit(req.clientToken, req.clientId);
  init.method = "GET";
  const response = await fetch(`${sessionPath(baseUrl)}/${req.sessionId}/answer`, init);
  if (response.status == 404) {
    return "pending";
  }
  if (response.status == 400) {
    throw "error retrieving answer: expired session";
  }
  if (response.status != 200) {
    throw `error retrieving answer: [${response.status}]`;
  }
  return await response.json();
}
async function session_getServerCandidates(baseUrl, req) {
  const date = req.since;
  const init = prepareRequestInit(req.clientToken, req.clientId);
  init.method = "GET";
  const response = await fetch(`${sessionPath(baseUrl)}/${req.sessionId}/servercandidates?since=${req.since}`, init);
  if (response.status == 400) {
    throw `error receiving new candidates: expired session`;
  }
  if (response.status != 200) {
    throw `error receiving new candidates: [${response.status}]`;
  }
  return await response.json();
}
async function session_deleteSession(baseUrl, req) {
  const init = prepareRequestInit(req.clientToken, req.clientId);
  init.method = "DELETE";
  const response = await fetch(`${sessionPath(baseUrl)}/${req.sessionId}`, init);
  if (response.status != 200) {
    throw `error deleting session: [${response.status}]`;
  }
  return await response.json();
}
function prepareRequestInit(clientToken, clientId) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${clientToken}`);
  headers.append("X-PaperCut-Client-Id", clientId);
  headers.append("User-Agent", "PaperCutMobilityPrintCloudClientES/1.0.0");
  return {
    headers: headers
  };
}
function sessionPath(baseUrl) {
  return `${baseUrl}/client/v1/session`;
}
;// CONCATENATED MODULE: ./node_modules/pc-mobility-cloud/client/ts/index.ts

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.description.js
var es_symbol_description = __webpack_require__(6544);
;// CONCATENATED MODULE: ./src/scripts/peer/blob.ts

const DEFAULT_CHUNK_SIZE = 16384;
const MIN_CHUNK_SIZE = 1;
function blob_chunkBlob(blob, chunkSize) {
  if (chunkSize < MIN_CHUNK_SIZE) {
    chunkSize = DEFAULT_CHUNK_SIZE;
  }
  return {
    *[Symbol.iterator]() {
      let offset = 0;
      let end = Math.min(offset + chunkSize, blob.size);
      while (offset < blob.size) {
        yield blob.slice(offset, end);
        offset = end;
        end = Math.min(offset + chunkSize, blob.size);
      }
      return;
    }
  };
}
async function blob_blobToArrayBuffer(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}
async function blobToString(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsBinaryString(blob);
  });
}
;// CONCATENATED MODULE: ./src/scripts/peer/datachannel.ts




class datachannel_DataChannel {
  constructor(serverId, dataChannel, getChunkSize) {
    this.dataChannel = dataChannel;
    this.getChunkSize = getChunkSize;
    this.label = `${serverId}.${dataChannel.label}`;
  }
  async sendBlob(b) {
    const chunkSize = this.getChunkSize();
    const thresholdLow = chunkSize;
    const thresholdHigh = Math.max(chunkSize * 8, 1024 * 1024);
    const chunked = chunkBlob(b, chunkSize)[Symbol.iterator]();
    const numChunks = Math.ceil(b.size / chunkSize);
    const logEveryNChunks = Math.floor(1024 * 1024 / chunkSize);
    log(`[${this.label}] sendBlob: size=${b.size} bytes, numChunks=${numChunks}`);
    this.dataChannel.bufferedAmountLowThreshold = thresholdLow;
    const deferred = {
      resolved: false
    };
    deferred.promise = new Promise(resolve => {
      deferred.resolve = () => {
        deferred.resolved = true;
        resolve();
      };
    });
    let chunkIdx = 0;
    let fillInProgress = false;
    const fillToCapacity = async () => {
      fillInProgress = true;
      while (true) {
        if (this.dataChannel.bufferedAmount >= thresholdHigh) {
          fillInProgress = false;
          return;
        }
        const {
          value,
          done
        } = chunked.next();
        if (done) {
          deferred.resolve();
          return;
        }
        if (chunkIdx > 0 && chunkIdx % logEveryNChunks === 0) {
          log(`Transferred ${chunkIdx + 1} out of ${numChunks} chunks. [`, 'label=', this.label, ']');
        }
        const buf = await blobToArrayBuffer(value);
        this.dataChannel.send(buf);
        chunkIdx++;
      }
    };
    this.dataChannel.onbufferedamountlow = async () => {
      if (deferred.resolved || fillInProgress) {
        return;
      }
      await fillToCapacity();
    };
    log(`[${this.label}] ` + 'Starting data channel transfer. [', 'size=', b.size, 'chunkSize=', chunkSize, 'chunks=', numChunks, 'bufferHigh=', thresholdHigh, ']');
    const start = Date.now();
    await fillToCapacity();
    await deferred.promise;
    this.dataChannel.onbufferedamountlow = undefined;
    log('Data channel transfer complete. [', 'label=', this.label, 'duration=', `${Date.now() - start}ms`, ']');
  }
  sendString(s) {
    log(`[${this.label}] sendString: size=${s.length} bytes`);
    if (this.isClosed()) {
      error(`Cannot send message on closed channel '${this.label}`);
      return;
    }
    this.dataChannel.send(s);
  }
  isClosed() {
    return this.dataChannel.readyState === 'closed';
  }
  close() {
    this.dataChannel.close();
  }
  onOpen(f) {
    this.dataChannel.onopen = ev => {
      f(this, ev);
    };
  }
  onMessage(f) {
    this.dataChannel.onmessage = ev => {
      const msg = new Message(ev);
      f(this, msg);
    };
  }
  clearOnMessage() {
    this.dataChannel.onmessage = null;
  }
  onClose(f) {
    this.dataChannel.onclose = ev => {
      f(this, ev);
    };
  }
  onError(f) {
    this.dataChannel.onerror = ev => {
      f(this, ev);
    };
  }
}
;// CONCATENATED MODULE: ./src/scripts/peer/signal.ts

function signal_decodeSessionDescription(offer) {
  return JSON.parse(atob(offer));
}
function signal_encodeSessionDescription(sd) {
  return btoa(JSON.stringify(sd));
}
;// CONCATENATED MODULE: ./src/scripts/peer/peer.ts



const peer_MIN_CHUNK_SIZE = (/* unused pure expression or super */ null && (16 * 1024));
const MAX_CHUNK_SIZE = (/* unused pure expression or super */ null && (256 * 1024));
class peer_Peer {
  constructor(serverId, iceConfig) {
    this.dataChannels = new Map();
    this.connectionStateChangeCallbacks = [];
    this.serverId = serverId;
    this.connection = new RTCPeerConnection(createRTCConfig(iceConfig));
    this.connection.onconnectionstatechange = ev => {
      for (const f of this.connectionStateChangeCallbacks) {
        f(this, ev);
      }
    };
  }
  getServerId() {
    return this.serverId;
  }
  createDataChannel(label) {
    const dc = this.connection.createDataChannel(label);
    const channel = new DataChannel(this.serverId, dc, this.getChunkSize.bind(this));
    this.dataChannels.set(label, channel);
    return channel;
  }
  getChunkSize() {
    if (this.connection.sctp) {
      log(`[${this.getServerId()}]`, `Using SCTP specified chunk size value: ${this.connection.sctp.maxMessageSize} bytes`);
      return Math.min(this.connection.sctp.maxMessageSize - 1, MAX_CHUNK_SIZE);
    }
    log(`[${this.getServerId()}] Using fall-back chunk size value: ${peer_MIN_CHUNK_SIZE} bytes`);
    return peer_MIN_CHUNK_SIZE;
  }
  onDataChannel(f) {
    this.connection.ondatachannel = ev => {
      const dc = new DataChannel(this.serverId, ev.channel, this.getChunkSize.bind(this));
      this.dataChannels.set(dc.label, dc);
      f(this, dc);
    };
  }
  onNegotiationNeeded(f) {
    this.connection.onnegotiationneeded = ev => {
      f(this, ev);
    };
  }
  onICECandidate(f) {
    this.connection.onicecandidate = ev => {
      f(this, ev);
    };
  }
  isPeerConnected() {
    log(`[${this.serverId}] checking peer connection state:`, this.connection.iceConnectionState);
    return this.connection.connectionState === 'connected';
  }
  close() {
    log(`[${this.serverId}] closing peer connection...`);
    this.connection.close();
  }
  async createAnswer(offer) {
    const offerSessionDescription = decodeSessionDescription(offer);
    await this.connection.setRemoteDescription(offerSessionDescription);
    const answer = await this.connection.createAnswer();
    await this.connection.setLocalDescription(answer);
    return encodeSessionDescription(answer);
  }
  onConnectionStateChange(f) {
    this.connectionStateChangeCallbacks.push(f);
  }
  async onICEConnectionStateChange(f) {
    this.connection.oniceconnectionstatechange = ev => {
      f(this, ev);
    };
  }
  getConnectionState() {
    return this.connection.connectionState;
  }
  getICEConnectionState() {
    return this.connection.iceConnectionState;
  }
  async createOffer() {
    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);
    const result = this.connection.localDescription;
    return encodeSessionDescription(result);
  }
  async registerAnswer(answer) {
    const answerSessionDescription = decodeSessionDescription(answer);
    await this.connection.setRemoteDescription(answerSessionDescription);
  }
  addIceCandidate(candidate) {
    return this.connection.addIceCandidate(candidate);
  }
  getDataChannel(label) {
    return this.dataChannels.get(label);
  }
  getSelectedCandidatePair() {
    const iceTransport = this.getICETransport();
    if (!iceTransport) {
      return null;
    }
    return iceTransport.getSelectedCandidatePair();
  }
  getICETransport() {
    const sctp = this.connection.sctp;
    if (!sctp) {
      return null;
    }
    return sctp.transport.iceTransport;
  }
  waitForLiveConnection(waitFor) {
    return new Promise((res, rej) => {
      const timeout = setTimeout(() => rej(`timeout waiting for peer connection ${this.serverId}, state:` + this.getConnectionState()), waitFor);
      this.onConnectionStateChange((ctx, _) => {
        switch (ctx.getConnectionState()) {
          case 'closed':
            break;
          case 'connected':
            clearTimeout(timeout);
            res();
            break;
          case 'connecting':
            break;
          case 'disconnected':
            break;
          case 'failed':
            clearTimeout(timeout);
            rej('failed');
            break;
          case 'new':
            break;
        }
      });
    });
  }
}
function createRTCConfig(iceConfig) {
  return {
    iceServers: iceConfig.servers,
    iceTransportPolicy: 'all'
  };
}
;// CONCATENATED MODULE: ./src/scripts/peer/index.ts





// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.reduce.js
var es_array_reduce = __webpack_require__(278);
;// CONCATENATED MODULE: ./src/scripts/cloudprint/client.ts







class client_MobRTCClient {
  constructor(id, peer, timeout, chunkSize, version) {
    this.id = id;
    this.peer = peer;
    this.timeout = timeout;
    this.chunkSize = chunkSize;
    this.version = version;
    this.shortTimeout = timeout / 4;
    this.serverId = peer.getServerId();
  }
  getID() {
    return this.id;
  }
  async getServerInfo() {
    log(`[${this.serverId}] Fetching server info...`);
    const dc = this.getServerInfoChannel();
    dc.sendString(' ');
    return this.readJsonResponseFromChannel(dc, this.shortTimeout);
  }
  async sendPrintJobDetails(printToken, printerUrl, params, fileSize) {
    log(`[${this.serverId}]`, `Submitting print job details: printerUrl=${printerUrl}, fileSize=${fileSize} bytes.`);
    const msg = JSON.stringify({
      clientVersion: this.version,
      printToken,
      printerUrl,
      params,
      fileSize
    });
    const dc = this.getJobDetailsChannel();
    dc.sendString(msg);
    let buf;
    let data;
    try {
      buf = await this.readChunkedResponse(dc);
      data = byteArrayToString(buf);
    } catch (e) {
      error(`[${this.serverId}] error parsing print job details response.`, e);
      throw e;
    }
    if (client_MobRTCClient.isError(data)) {
      throw new Error(data);
    }
    return data;
  }
  async sendPrintJob(file) {
    if (file.size == 0) {
      throw new Error(`invalid file size: [${file.size}]`);
    }
    return this.getJobChannel().sendBlob(file);
  }
  isReady() {
    return this.peer && this.peer.isPeerConnected();
  }
  close() {
    this.peer.close();
  }
  async getPrintToken(shareToken) {
    log(`[${this.serverId}] Exchanging share token for print token.`);
    return new Promise(async (resolve, reject) => {
      const dc = this.getTokenChannel();
      dc.sendString(shareToken);
      let buf;
      try {
        buf = await this.readChunkedResponse(dc);
      } catch (e) {
        return reject(e);
      }
      let printToken;
      try {
        printToken = byteArrayToString(buf);
      } catch (e) {
        error(`[${this.serverId}] error parsing auth-token response.`, e);
        return reject(e);
      }
      if (client_MobRTCClient.isError(printToken)) {
        return reject(`failed to exchange shareToken for printToken: ${printToken}`);
      }
      return resolve(printToken);
    });
  }
  readChunkedResponse(dc, chunkTimeout = this.timeout) {
    log(`[${dc.label}] readChunkedResponse,  chunkTimeout=${chunkTimeout}ms`);
    return new Promise((resolve, reject) => {
      let chunkIdx = 0;
      const startTime = performance.now();
      const buf = [];
      let onTimeout = setTimeout(() => {
        dc.clearOnMessage();
        return reject(`${chunkTimeout}ms timeout reached waiting for the first response.`);
      }, chunkTimeout);
      let logEveryNChunks = 0;
      dc.onMessage((ctx, msg) => {
        clearTimeout(onTimeout);
        onTimeout = setTimeout(() => {
          ctx.clearOnMessage();
          return reject(`${this.timeout}ms timeout reached waiting for data chunk: [${chunkIdx}]`);
        }, this.timeout);
        chunkIdx++;
        if (msg.stringData() === 'FINISH') {
          clearTimeout(onTimeout);
          ctx.clearOnMessage();
          if (buf.length == 0) {
            return resolve(new Uint8Array());
          }
          const result = buf.reduce((prev, next) => concatByteArrays(prev, next));
          log(`[${dc.label}]`, `Finished receiving ${(result.length / 1024).toFixed(2)}KiB,`, `chunks received: [${chunkIdx}]`, `took: ${(performance.now() - startTime).toFixed(2)} ms`);
          return resolve(result);
        }
        const chunk = msg.data();
        buf.push(new Uint8Array(chunk));
        if (logEveryNChunks === 0 && chunk.byteLength > 0) {
          logEveryNChunks = Math.floor(1024 * 1024 / chunk.byteLength);
        } else if (logEveryNChunks > 0 && chunkIdx > 0 && chunkIdx % logEveryNChunks === 0) {
          log(`[${dc.label}]: `, `Received ${chunkIdx} chunks,`, `${(chunk.byteLength * chunkIdx / 1024).toFixed(2)}KiB .`);
        }
      });
    });
  }
  async getPrinters(printToken) {
    return new Promise(async (resolve, reject) => {
      const dc = this.getPrinterChannel();
      dc.sendString(printToken);
      let printers;
      try {
        printers = await this.readJsonResponseFromChannel(dc);
      } catch (e) {
        error(`[${this.serverId}] error reading printer info response.`, e);
        return reject(e);
      }
      printers.forEach(p => {
        p.id = `http://localhost:9163/printers/${encodeURIComponent(p.name)}`;
        p.name = `${p.name} - [${p.description}]`;
      });
      return resolve(printers);
    });
  }
  async getCapabilities(printerId) {
    const dc = this.getCapabilitiesChannel();
    dc.sendString(printerId);
    return this.readJsonResponseFromChannel(dc);
  }
  async readJsonResponseFromChannel(dc, timeout = this.timeout) {
    return new Promise(async (resolve, reject) => {
      const tag = `${this.serverId}.${dc.label}`;
      let buf;
      try {
        buf = await this.readChunkedResponse(dc, timeout);
        const data = byteArrayToString(buf);
        if (client_MobRTCClient.isError(data)) {
          error(`[${tag}]: Server responded with error: ${data}`);
          return reject(`Server responded with error on: ${dc.label}`);
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          error(`[${tag}]: error parsing JSON response: `, e, buf);
          return reject(e);
        }
      } catch (e) {
        error(`[${tag}]: error reading response: `, e, buf);
        return reject(e);
      }
    });
  }
  getServerInfoChannel() {
    return this.peer.getDataChannel(SERVER_INFO_LABEL);
  }
  getPrinterChannel() {
    return this.peer.getDataChannel(PRINTER_CHANNEL_LABEL);
  }
  getJobChannel() {
    return this.peer.getDataChannel(JOB_CHANNEL_LABEL);
  }
  getTokenChannel() {
    return this.peer.getDataChannel(TOKEN_CHANNEL_LABEL);
  }
  getCapabilitiesChannel() {
    return this.peer.getDataChannel(CAPABILITIES_CHANNEL_LABEL);
  }
  getJobDetailsChannel() {
    return this.peer.getDataChannel(JOB_DETAILS_LABEL);
  }
  static isError(data) {
    return data.startsWith('ERROR:');
  }
}
function byteArrayToString(buf) {
  const utf8decode = new TextDecoder();
  return utf8decode.decode(buf);
}
function concatByteArrays(head, tail) {
  const concatResult = new Uint8Array(head.length + tail.length);
  concatResult.set(head);
  concatResult.set(tail, head.length);
  return concatResult;
}
;// CONCATENATED MODULE: ./src/scripts/cloudprint/clientbuilder.ts






const clientbuilder_SERVER_INFO_LABEL = 'SERVERINFO';
const clientbuilder_JOB_CHANNEL_LABEL = 'JOB';
const clientbuilder_JOB_DETAILS_LABEL = 'JOBDETAILS';
const clientbuilder_PRINTER_CHANNEL_LABEL = 'PRINTER';
const clientbuilder_TOKEN_CHANNEL_LABEL = 'TOKEN';
const clientbuilder_CAPABILITIES_CHANNEL_LABEL = 'CAPABILITIES';
const CLIENT_API_BASE_URL_PROD = 'https://mp.cloud.papercut.com';
const CLIENT_API_BASE_URL_TEST = 'https://mp.cloud.papercut.software';
class MobRTCClientBuilder {
  constructor(serverId) {
    this.clientId = '';
    this.timeout = 20000;
    this.shareToken = '';
    this.printToken = '';
    this.baseUrl = CLIENT_API_BASE_URL_PROD;
    this.serverId = serverId;
  }
  setClientId(clientId) {
    this.clientId = clientId;
    return this;
  }
  setTimeout(timeout) {
    this.timeout = timeout;
    return this;
  }
  setShareToken(shareToken) {
    this.shareToken = shareToken;
    return this;
  }
  setPrintToken(printToken) {
    this.printToken = printToken;
    return this;
  }
  setBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
    return this;
  }
  async build() {
    let receivedAnswer = false;
    const clientCandidates = [];
    const clientToken = this.printToken || this.shareToken;
    log(`[MOB RTC Builder.${this.serverId}] Client '${this.clientId}' creating session via ${this.baseUrl} ...`);
    const {
      id,
      iceConfig
    } = await createSession(this.baseUrl, {
      clientToken,
      clientId: this.clientId
    });
    let sessionDeleted = false;
    log(`[MOB RTC Builder.${this.serverId}] ICE servers`, iceConfig.servers);
    const sessionParams = {
      clientToken,
      sessionId: id,
      clientId: this.clientId
    };
    log(`[MOB RTC Builder.${this.serverId}] starting peer connection: ` + `serverId=${this.serverId}, sessionId=${id}, clientId=${this.clientId}`);
    const peer = new Peer(this.serverId, iceConfig);
    peer.onConnectionStateChange((ctx, _) => {
      if (sessionDeleted) {
        return;
      }
      switch (ctx.getConnectionState()) {
        case 'closed':
        case 'failed':
          log(`[MOB RTC Builder.${this.serverId}] RTC connection closed, deleting session.`, 'sessionId', id);
          sessionDeleted = true;
          deleteSession(this.baseUrl, {
            ...sessionParams
          }).then(() => {
            log(`[MOB RTC Builder.${this.serverId}] Cloud session deleted.`, 'sessionId', id);
          });
          break;
        default:
          log(`[MOB RTC Builder.${this.serverId}] RTC connection state changed: ${ctx.getConnectionState()}`);
      }
    });
    peer.onICECandidate(async (ctx, ev) => {
      if (ev.candidate == null) {
        log(`[MOB RTC Builder.${this.serverId}] candidates exhausted`, id);
        return;
      }
      if (!receivedAnswer) {
        clientCandidates.push(JSON.stringify(ev.candidate));
        return;
      }
      try {
        log(`[MOB RTC Builder.${this.serverId}] found candidate, sending to remote peer`, 'candidate', ev.candidate, 'sessionId', id);
        await notifyClientCandidates(this.baseUrl, {
          ...sessionParams,
          iceCandidates: [JSON.stringify(ev.candidate)]
        });
      } catch (e) {
        ctx.close();
        await deleteSession(this.baseUrl, {
          ...sessionParams
        });
        throw e;
      }
    });
    const start = Date.now();
    const peerConnectionLive = peer.waitForLiveConnection(this.timeout);
    log(`[MOB RTC Builder.${this.serverId}] registering ice candidate send handler`);
    const offer = new Promise(res => {
      peer.onNegotiationNeeded(async (ctx, _) => {
        const offer = await ctx.createOffer();
        res(offer);
      });
    });
    const dataChannels = this.setDataChannelHandlers(peer);
    log(`[MOB RTC Builder.${this.serverId}] sending offer to remote peer`);
    await createOffer(this.baseUrl, {
      ...sessionParams,
      iceOffer: await offer
    });
    log(`[MOB RTC Builder.${this.serverId}] awaiting answer`);
    const answer = await pollGetAnswer(this.baseUrl, {
      ...sessionParams
    }, {
      interval: 500,
      timeout: 15000
    });
    if (answer == 'timeout') {
      throw new Error('could not retrieve remote answer');
    }
    log(`[MOB RTC Builder.${this.serverId}] registering remote answer locally`);
    await peer.registerAnswer(answer.iceAnswer);
    receivedAnswer = true;
    if (clientCandidates.length > 0) {
      log(`[MOB RTC Builder.${this.serverId}] sending buffered candidate to peer`);
      await notifyClientCandidates(this.baseUrl, {
        ...sessionParams,
        iceCandidates: clientCandidates
      });
    }
    this.pollForCandidates(peer, sessionParams);
    try {
      await peerConnectionLive;
    } catch (e) {
      log(`[MOB RTC Builder.${this.serverId}] Peer connection failed...`);
      throw e;
    }
    const sel = peer.getSelectedCandidatePair();
    log(`Selected peer candidates, local: ${JSON.stringify(sel.local)}, remote: ${JSON.stringify(sel.remote)}`);
    log(`[MOB RTC Builder.${this.serverId}] Peer connection is live. `, `Time to establish: ${(Date.now() - start) / 1000}s.`);
    try {
      await Promise.race([dataChannels, new Promise(res => setTimeout(res, this.timeout))]);
    } catch (e) {
      throw e;
    }
    log(`[MOB RTC Builder.${this.serverId}] Creating Mobility Cloud client: 
			version=${GetClientVersionID()},
			sessionId=${sessionParams.sessionId}
			clientId=${sessionParams.clientId}
			timeout=${this.timeout}ms, 
			maxChunkSize=${iceConfig.maxChunkSize}`);
    return new MobRTCClient(sessionParams.sessionId, peer, this.timeout, iceConfig.maxChunkSize, GetClientVersionID());
  }
  pollForCandidates(peer, sessionParams, timeoutMs = 20000) {
    log(`[MOB RTC Builder.${this.serverId}]`, `session '${sessionParams.sessionId}' starting polling for server candidates...`);
    new Promise(async res => {
      let time = 0;
      let shouldBreak = false;
      setTimeout(() => {
        shouldBreak = true;
      }, timeoutMs);
      while (true) {
        const {
          iceCandidates,
          updated
        } = await getServerCandidates(this.baseUrl, {
          ...sessionParams,
          since: time
        });
        time = updated;
        iceCandidates.forEach(c => {
          log(`[MOB RTC Builder.${this.serverId}] session '${sessionParams.sessionId}' got candidate`, c);
          const candidate = JSON.parse(c);
          peer.addIceCandidate(candidate);
        });
        await delay(500);
        if (shouldBreak) {
          break;
        }
      }
      res();
    }).then(_ => {
      log(`[MOB RTC Builder.${this.serverId}]`, `session '${sessionParams.sessionId}' stopped waiting for more server candidates`);
    });
  }
  setDataChannelHandler(peer, label) {
    const channel = peer.createDataChannel(label);
    channel.onClose((ctx, _) => {
      log(`[MOB RTC Client] [${ctx.label}] datachannel closed`);
    });
    channel.onError((ctx, ev) => {
      if (ev.error.message == 'Transport channel closed') {} else {
        log(`[MOB RTC Client] [${ctx.label}] datachannel error`, ev.error.errorDetail);
      }
    });
    return new Promise(resolve => {
      channel.onOpen((ctx, _) => {
        log(`[MOB RTC Client] [${ctx.label}] datachannel open and ready`);
        resolve();
      });
    });
  }
  setDataChannelHandlers(peer) {
    return Promise.all([this.setDataChannelHandler(peer, clientbuilder_SERVER_INFO_LABEL), this.setDataChannelHandler(peer, clientbuilder_CAPABILITIES_CHANNEL_LABEL), this.setDataChannelHandler(peer, clientbuilder_TOKEN_CHANNEL_LABEL), this.setDataChannelHandler(peer, clientbuilder_PRINTER_CHANNEL_LABEL), this.setDataChannelHandler(peer, clientbuilder_JOB_CHANNEL_LABEL), this.setDataChannelHandler(peer, clientbuilder_JOB_DETAILS_LABEL)]);
  }
}
async function delay(ms) {
  return new Promise(res => setTimeout(() => {
    chrome.runtime.sendMessage({
      msg: 'keep active'
    });
    res();
  }, ms));
}
async function pollGetAnswer(baseUrl, req, pollOptions) {
  let shouldBreak = false;
  const timeout = setTimeout(() => {
    shouldBreak = true;
  }, pollOptions.timeout);
  while (true) {
    if (shouldBreak) {
      break;
    }
    const response = await getAnswer(baseUrl, req);
    if (response !== 'pending') {
      clearTimeout(timeout);
      return response;
    }
    await delay(pollOptions.interval);
  }
  return 'timeout';
}
;// CONCATENATED MODULE: ./src/scripts/cloudprint/shareToken.ts
const shareTokenSubject = 'tokenCreation';
class jwt {}
class CloudPrintShareToken {
  constructor(orgID, serverID, expiry, expired) {
    this.orgID = orgID;
    this.serverID = serverID;
    this.expiry = expiry;
    this.expired = expired;
    this.tokenString = '';
  }
  toString() {
    return this.tokenString;
  }
  static parse(tokenStr) {
    let tokenObj = new jwt();
    try {
      tokenObj = parseJwt(tokenStr);
    } catch (e) {
      throw new Error('error parsing jwt');
    }
    if (tokenObj.sub !== shareTokenSubject) {
      throw new Error('jwt is not a share token');
    }
    const expiryDate = new Date(tokenObj.exp * 1000);
    const expired = expiryDate < new Date();
    const shareToken = new CloudPrintShareToken(tokenObj.org, tokenObj.srv, expiryDate, expired);
    shareToken.tokenString = tokenStr;
    return shareToken;
  }
}
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}
;// CONCATENATED MODULE: ./src/scripts/cloudprint/link.ts

class CloudPrintLink {
  constructor(orgId, serverId, expiry, shareToken, testEnv) {
    this.orgId = orgId;
    this.serverId = serverId;
    this.expiry = expiry;
    this.shareToken = shareToken;
    this.testEnv = testEnv;
  }
  static parse(link) {
    const url = new URL(link);
    let testEnv = false;
    if (url.host.endsWith('.papercut.com')) {} else if (url.host.endsWith('.papercut.software')) {
      testEnv = true;
    } else {
      throw new Error('unexpected link domain');
    }
    const shareTokenStr = url.searchParams.get('token');
    if (!shareTokenStr) {
      throw new Error('link token param not found');
    }
    const shareToken = CloudPrintShareToken.parse(shareTokenStr);
    return new CloudPrintLink(shareToken.orgID, shareToken.serverID, shareToken.expiry, shareToken.toString(), testEnv);
  }
  expires() {
    return this.expiry instanceof Date && !isNaN(this.expiry.getTime());
  }
}
;// CONCATENATED MODULE: ./src/scripts/cloudprint/index.ts



;// CONCATENATED MODULE: ./src/scripts/printer/capabilities.ts
const defaultColorOptions = [{
  type: 'STANDARD_COLOR',
  is_default: true
}, {
  type: 'STANDARD_MONOCHROME'
}];
const defaultDuplexOptions = [{
  type: 'NO_DUPLEX',
  is_default: true
}, {
  type: 'LONG_EDGE'
}, {
  type: 'SHORT_EDGE'
}];
const defaultPaperSize = 'A4';
const defaultMediaSizes = [{
  name: 'ISO_A0',
  width_microns: 841000,
  height_microns: 1189000,
  is_default: false,
  custom_display_name: 'A0'
}, {
  name: 'ISO_A1',
  width_microns: 594000,
  height_microns: 841000,
  is_default: false,
  custom_display_name: 'A1'
}, {
  name: 'ISO_A2',
  width_microns: 420000,
  height_microns: 594000,
  is_default: false,
  custom_display_name: 'A2'
}, {
  name: 'ISO_A3',
  width_microns: 297000,
  height_microns: 420000,
  is_default: false,
  custom_display_name: 'A3'
}, {
  name: 'ISO_A4',
  width_microns: 210000,
  height_microns: 297000,
  is_default: 'A4' === defaultPaperSize.toUpperCase(),
  custom_display_name: 'A4'
}, {
  name: 'ISO_A5',
  width_microns: 148000,
  height_microns: 210000,
  is_default: false,
  custom_display_name: 'A5'
}, {
  name: 'ISO_A6',
  width_microns: 105000,
  height_microns: 148000,
  is_default: false,
  custom_display_name: 'A6'
}, {
  name: 'ISO_A7',
  width_microns: 74000,
  height_microns: 105000,
  is_default: false,
  custom_display_name: 'A7'
}, {
  name: 'ISO_A8',
  width_microns: 52000,
  height_microns: 74000,
  is_default: false,
  custom_display_name: 'A8'
}, {
  name: 'ISO_A9',
  width_microns: 37000,
  height_microns: 52000,
  is_default: false,
  custom_display_name: 'A9'
}, {
  name: 'ISO_A10',
  width_microns: 26000,
  height_microns: 37000,
  is_default: false,
  custom_display_name: 'A10'
}, {
  name: 'JIS_B0',
  width_microns: 1030000,
  height_microns: 1456000,
  is_default: false,
  custom_display_name: 'JIS B0'
}, {
  name: 'JIS_B1',
  width_microns: 728000,
  height_microns: 1030000,
  is_default: false,
  custom_display_name: 'JIS B1'
}, {
  name: 'JIS_B2',
  width_microns: 515000,
  height_microns: 728000,
  is_default: false,
  custom_display_name: 'JIS B2'
}, {
  name: 'JIS_B3',
  width_microns: 364000,
  height_microns: 515000,
  is_default: false,
  custom_display_name: 'JIS B3'
}, {
  name: 'JIS_B4',
  width_microns: 257000,
  height_microns: 364000,
  is_default: false,
  custom_display_name: 'JIS B4'
}, {
  name: 'JIS_B5',
  width_microns: 182000,
  height_microns: 257000,
  is_default: false,
  custom_display_name: 'JIS B5'
}, {
  name: 'JIS_B6',
  width_microns: 128000,
  height_microns: 182000,
  is_default: false,
  custom_display_name: 'JIS B6'
}, {
  name: 'JIS_B7',
  width_microns: 91000,
  height_microns: 128000,
  is_default: false,
  custom_display_name: 'JIS B7'
}, {
  name: 'JIS_B8',
  width_microns: 64000,
  height_microns: 91000,
  is_default: false,
  custom_display_name: 'JIS B8'
}, {
  name: 'JIS_B9',
  width_microns: 45000,
  height_microns: 64000,
  is_default: false,
  custom_display_name: 'JIS B9'
}, {
  name: 'JIS_B10',
  width_microns: 32000,
  height_microns: 45000,
  is_default: false,
  custom_display_name: 'JIS B10'
}, {
  name: 'ISO_B0',
  width_microns: 1000000,
  height_microns: 1414000,
  is_default: false,
  custom_display_name: 'ISO B0'
}, {
  name: 'ISO_B1',
  width_microns: 707000,
  height_microns: 1000000,
  is_default: false,
  custom_display_name: 'ISO B1'
}, {
  name: 'ISO_B2',
  width_microns: 500000,
  height_microns: 707000,
  is_default: false,
  custom_display_name: 'ISO B2'
}, {
  name: 'ISO_B3',
  width_microns: 353000,
  height_microns: 500000,
  is_default: false,
  custom_display_name: 'ISO B3'
}, {
  name: 'ISO_B4',
  width_microns: 250000,
  height_microns: 353000,
  is_default: false,
  custom_display_name: 'ISO B4'
}, {
  name: 'ISO_B5',
  width_microns: 176000,
  height_microns: 250000,
  is_default: false,
  custom_display_name: 'ISO B5'
}, {
  name: 'ISO_B6',
  width_microns: 125000,
  height_microns: 176000,
  is_default: false,
  custom_display_name: 'ISO B6'
}, {
  name: 'ISO_B7',
  width_microns: 88000,
  height_microns: 125000,
  is_default: false,
  custom_display_name: 'ISO B7'
}, {
  name: 'ISO_B8',
  width_microns: 62000,
  height_microns: 88000,
  is_default: false,
  custom_display_name: 'ISO B8'
}, {
  name: 'ISO_B9',
  width_microns: 44000,
  height_microns: 62000,
  is_default: false,
  custom_display_name: 'ISO B9'
}, {
  name: 'ISO_B10',
  width_microns: 31000,
  height_microns: 44000,
  is_default: false,
  custom_display_name: 'ISO B10'
}, {
  name: 'NA_LETTER',
  width_microns: 215900,
  height_microns: 279400,
  is_default: false,
  custom_display_name: 'Letter'
}, {
  name: 'NA_LEGAL',
  width_microns: 215900,
  height_microns: 355600,
  is_default: false,
  custom_display_name: 'Legal'
}, {
  name: 'NA_5X7',
  width_microns: 127000,
  height_microns: 177800,
  is_default: false,
  custom_display_name: '5X7'
}, {
  name: 'NA_EXECUTIVE',
  width_microns: 184150,
  height_microns: 266700,
  is_default: false,
  custom_display_name: 'Executive'
}, {
  name: 'NA_INVOICE',
  width_microns: 139700,
  height_microns: 215900,
  is_default: false,
  custom_display_name: 'Invoice'
}, {
  name: 'NA_LEDGER',
  width_microns: 279400,
  height_microns: 431800,
  is_default: false,
  custom_display_name: 'Ledger'
}];
function createPrinterCapabilities(colorOptions = defaultColorOptions, duplexOptions = defaultDuplexOptions, mediaSizes = defaultMediaSizes) {
  return {
    version: '1.0',
    printer: {
      supported_content_type: [{
        content_type: 'application/pdf'
      }],
      color: {
        option: colorOptions
      },
      duplex: {
        option: duplexOptions
      },
      page_orientation: {
        option: [{
          type: 'PORTRAIT',
          is_default: true
        }, {
          type: 'LANDSCAPE',
          is_default: false
        }, {
          type: 'AUTO',
          is_default: false
        }]
      },
      copies: {
        default: 1,
        max: 100
      },
      media_size: {
        option: mediaSizes
      }
    }
  };
}
function parseMobilityPrintCapabilities(capabilities) {
  const mediaSizes = capabilities.mediaSizes.map(m => ({
    name: 'CUSTOM',
    width_microns: m.widthMicrons,
    height_microns: m.heightMicrons,
    is_default: m.isDefault,
    custom_display_name: m.customDisplayName || m.name
  }));
  if (mediaSizes.length > 0 && mediaSizes.every(function (m) {
    return !m.is_default;
  })) {
    mediaSizes[0].is_default = true;
  }
  const colorOptions = capabilities.color.map(function (n) {
    return {
      type: n
    };
  });
  if (colorOptions.length > 0) {
    colorOptions[0]['is_default'] = true;
  }
  const duplexOptions = capabilities.duplex.map(function (n) {
    return {
      type: n
    };
  });
  if (duplexOptions.length > 0) {
    duplexOptions[0]['is_default'] = true;
  }
  return createPrinterCapabilities(colorOptions, duplexOptions, mediaSizes);
}
;// CONCATENATED MODULE: ./src/scripts/wait.ts
async function sleep(millis) {
  return new Promise(r => setTimeout(r, millis));
}
async function waitForCondition(condTestFunc, sleepMillis = 1000, sleepMaxMillis = 60000) {
  const started = performance.now();
  while (!condTestFunc()) {
    if (performance.now() - started > sleepMaxMillis) {
      return false;
    }
    await sleep(sleepMillis);
  }
  return true;
}
async function workerWaitUntil(promise) {
  const keepAlive = setInterval(function () {
    console.log('Keep-alive');
    chrome.runtime.getPlatformInfo();
  }, 25 * 1000);
  const startTime = Date.now();
  try {
    console.log('Waiting with keep-alive...');
    return await promise;
  } catch (e) {
    console.log('Wait completed with error:', e);
  } finally {
    console.log(`Finished waiting with keep-alive, elapsed: ${(Date.now() - startTime) / 1000}seconds`);
    clearInterval(keepAlive);
  }
}
;// CONCATENATED MODULE: ./src/scripts/offnetwork/offnetworkcache.ts





const printerCapabilitiesCache = new Map();
const serverIdToClientCache = new Map();
const storageKeyServerIdToInfoCache = 'serverIdToInfoCache';
const serverIdToInfoCache = new Map();
const storageKeyPrinterTimeUsedMap = 'printerTimeUsedMap';
const storageKeyPrinterCapabilitiesMap = 'printerCapabilitiesMap';
const storageKeyPrinterServerMap = 'printerServerMap';
const storageKeyPrintTokenCache = 'printTokenCache';
const printerTimeUsedMap = new Map();
const printerNameToServerIdCache = new Map();
const printTokenCache = new Map();
const storageKeyReclaimStorageLimitKb = 'reclaimStorageLimitKb';
const storageKeyPrintedOlderThanDays = 'printedOlderThanDays';
let reclaimStorageLimitKb;
let printedOlderThanDays;
let cacheLoaded = false;
async function initCache() {
  const [storageLimit, printedAge] = await Promise.all([getLocalStorageData(storageKeyReclaimStorageLimitKb).then(v => v ? +v : 4096), getLocalStorageData(storageKeyPrintedOlderThanDays).then(v => v ? +v : 30)]);
  reclaimStorageLimitKb = storageLimit;
  printedOlderThanDays = printedAge;
  log_log(`Local storage cleanup settings: reclaimStorageLimitKb=${reclaimStorageLimitKb} KiB, ` + `printedOlderThanDays=${printedOlderThanDays} days`);
  populateCache(reclaimStorageLimitKb, printedOlderThanDays);
}
function getServerIdToClientCache() {
  return serverIdToClientCache;
}
function getServerIdToServerInfoCache() {
  return serverIdToInfoCache;
}
function getPrinterNameToServerIdCache() {
  return printerNameToServerIdCache;
}
function getPrintTokenCache() {
  return printTokenCache;
}
function updatePrintToken(printTokenCacheID, printToken) {
  if (!printToken) {
    warn('updatePrintToken: Print token is not provided');
  }
  log_log(` updatePrintToken: Saving print token for: ${printTokenCacheID}`);
  getPrintTokenCache().set(printTokenCacheID, printToken);
  saveMapToStorage(storageKeyPrintTokenCache, printTokenCache).then(() => log_log(` updatePrintToken: Updated print token for: ${printTokenCacheID}`));
}
function updateServerInfo(serverId, serverInfo) {
  const idToServerInfoCache = getServerIdToServerInfoCache();
  idToServerInfoCache.set(serverId, serverInfo);
  saveMapToStorage(storageKeyServerIdToInfoCache, idToServerInfoCache).then(() => log_log(`Updated info for server '${serverId}: ${JSON.stringify(serverInfo)}...`));
}
function populateCache(reclaimStorageLimitKb, printedOlderThanDays) {
  Promise.all([loadMapFromStorage(storageKeyPrinterTimeUsedMap, printerTimeUsedMap), loadMapFromStorage(storageKeyPrinterCapabilitiesMap, printerCapabilitiesCache), loadMapFromStorage(storageKeyPrinterServerMap, printerNameToServerIdCache), loadMapFromStorage(storageKeyPrintTokenCache, printTokenCache), loadMapFromStorage(storageKeyServerIdToInfoCache, serverIdToInfoCache)]).then(() => {
    chrome.storage.local.getBytesInUse(bytesInUse => {
      log_log(`[OffNetworkCache:populateCache] total cached storage: ${(bytesInUse / 1024).toFixed(2)}KiB`);
      if (bytesInUse / 1024 >= reclaimStorageLimitKb) {
        warn(`Exceeded storage limit threshold of ${reclaimStorageLimitKb}KiB, 
					cleanup capabilities for printers not used in ${printedOlderThanDays} days...`);
        cleanupStorage(printedOlderThanDays).then(() => log_log(`Completed cleanup of printers used > ${printedOlderThanDays} days`));
      }
      cacheLoaded = true;
      log_log('[OffNetworkCache:populateCache] completed.');
    });
  });
}
async function loadMapFromStorage(key, toMap) {
  try {
    const map = await loadMap(key);
    if (map) {
      copyToMap(map, toMap);
      log_log(`Loaded '${key}' with ${map.size} items from local storage...`);
    } else {
      log_log(`Unable to load '${key} from local storage - it does not exist`);
    }
  } catch (reason) {
    return log_error(`Unable to load '${key}' from local storage: ${reason}`);
  }
}
async function saveMapToStorage(key, map) {
  try {
    await saveMap(key, map);
    return log_log(`Saved '${key}' with ${map.size} items to local storage...`);
  } catch (reason) {
    log_error(`Failed to save data to local storage: ${reason}`);
    if (reason && reason.toLowerCase().includes('quota')) {
      cleanupStorage(printedOlderThanDays).then(() => log_log(`Completed cleanup of printers used > ${printedOlderThanDays} days`));
    }
  }
}
function copyToMap(src, dst) {
  dst.clear();
  src.forEach((value, key) => dst.set(key, value));
}
function daysAgo(timestampMillis) {
  const millisPerDay = 1000 * 60 * 60 * 24;
  if (timestampMillis === undefined) {
    return undefined;
  }
  return (Date.now() - timestampMillis) / millisPerDay;
}
async function cleanupStorage(printedOlderThanDays) {
  log_log(`[OffNetworkCache:cleanupStorage] Storage cleanup requested, printing threshold=${printedOlderThanDays}days`);
  chrome.storage.local.getBytesInUse(usedBytes => {
    log_log(`[OffNetworkCache:cleanupStorage] Storage cleanup, ${(usedBytes / 1024).toFixed(2)}KiB used`);
    log_log(`[OffNetworkCache:cleanupStorage] ${printerCapabilitiesCache.size} printer capabilities cached`);
  });
  for (const printerId of printerCapabilitiesCache.keys()) {
    const printerName = printerNameFromUrl(printerId);
    const unusedPrinter = printerName == undefined || (await getServerIdForPrinter(printerId)) === undefined;
    const printedDays = daysAgo(printerTimeUsedMap.get(printerId));
    let discard = false;
    if (unusedPrinter) {
      log_log(`[OffNetworkCache:cleanupStorage] Discarding unused printer capability: ${printerName}`);
      discard = true;
    } else if (printedDays === undefined || printedDays > printedOlderThanDays) {
      log_log(`[OffNetworkCache:cleanupStorage] Discarding printer capability older than ${printedOlderThanDays} days: 
			${printerName}, last printed: ${printedDays ? printedDays.toFixed(0) + ' days ago' : 'never'}`);
      discard = true;
    }
    if (discard) {
      printerTimeUsedMap.delete(printerId);
      printerCapabilitiesCache.delete(printerId);
    }
  }
  log_log(`[OffNetworkCache:cleanupStorage] ${printerCapabilitiesCache.size} printer capabilities after clean-up`);
  Promise.all([saveMapToStorage(storageKeyPrinterTimeUsedMap, printerTimeUsedMap), saveMapToStorage(storageKeyPrinterCapabilitiesMap, printerCapabilitiesCache)]).then(() => {
    chrome.storage.local.getBytesInUse(bytesInUse => {
      log_log(`[OffNetworkCache:cleanupStorage] Cleanup complete, ${(bytesInUse / 1024).toFixed(2)}KiB used`);
    });
  });
}
async function updatePrinterCache(serverId, printers) {
  for (const printer of printers) {
    printerCapabilitiesCache.set(printer.id, printer.capabilities);
    printerNameToServerIdCache.set(printer.name, serverId);
  }
  await Promise.all([saveMapToStorage(storageKeyPrinterTimeUsedMap, printerTimeUsedMap), saveMapToStorage(storageKeyPrinterCapabilitiesMap, printerCapabilitiesCache), saveMapToStorage(storageKeyPrinterServerMap, printerNameToServerIdCache)]).catch(e => {
    log_error(`Failed to save data caches to storage: ${e.name} - ${e.message}`);
  });
}
function getPrinterCapabilities(printerId) {
  const cap = printerCapabilitiesCache.get(printerId);
  if (!cap) {
    log_log(`Cached printer capability for '${printerId}' missing from cache!`);
    return null;
  }
  log_log(`Found cached printer capabilities for: ${printerId} => ${JSON.stringify(cap)}`);
  return parseMobilityPrintCapabilities(cap);
}
function updateLastPrintedTime(printerUrl) {
  printerTimeUsedMap.set(printerUrl, Date.now());
  saveMapToStorage(storageKeyPrinterTimeUsedMap, printerTimeUsedMap).then(() => {
    log_log(`Saved last printed date for: ${printerUrl}`);
  });
}
async function getServerIdForPrinter(printerUrl) {
  const printerName = printerNameFromUrl(printerUrl);
  if (!printerName) {
    return undefined;
  }
  const ready = await waitForCondition(() => {
    log_log('[OffNetworkCache:getServerIdForPrinter] Waiting for cache to be loaded and ready...');
    return cacheLoaded;
  });
  if (!ready) {
    log_error('[OffNetworkCache:getServerIdForPrinter] Giving up waited for cache to be ready...');
    return undefined;
  }
  for (const [cachedPrinterName, serverId] of printerNameToServerIdCache) {
    if (cachedPrinterName.startsWith(printerName)) {
      return serverId;
    }
  }
  return undefined;
}
function printerNameFromUrl(printerUrl) {
  try {
    const urlPath = new URL(printerUrl).pathname;
    const lastSlash = urlPath.lastIndexOf('/');
    return decodeURIComponent(urlPath.substring(lastSlash + 1));
  } catch (e) {
    log_error(`Cannot find printer name - invalid URL: ${printerUrl}`, e);
    return undefined;
  }
}
;// CONCATENATED MODULE: ./src/scripts/offnetwork/offnetwork-utils.ts




const LINKS_STORAGE_KEY = 'CloudPrintInviteLinks';
const CLOUD_PRINT_ERR = 'Cloud Print error';
async function initCloudPrint() {
  log_log('[OffNetwork] Initializing Cloud Print');
  await getClientId();
  return initCache();
}
function isCloudPrintError(e) {
  if (typeof e === 'string') {
    return e.includes(CLOUD_PRINT_ERR);
  }
  return e && e.message && e.message.includes(CLOUD_PRINT_ERR);
}
async function saveBYODLink(link) {
  const links = await getAllLinks();
  if (!links.includes(link)) {
    log_log(`no existing link found, saving the received link as a BYOD link: ${link}`);
    const byodLinks = await getBYODLinks();
    byodLinks.push(link);
    chrome.storage.local.set({
      CloudPrintInviteLinks: byodLinks
    });
  } else {
    log_log('found existing link');
  }
}
function getBYODLinks() {
  return new Promise(res => {
    chrome.storage.local.get(LINKS_STORAGE_KEY, data => {
      if (data && data[LINKS_STORAGE_KEY]) {
        log_log(`getting ${data[LINKS_STORAGE_KEY].length} BYOD link(s)...`);
        return res(data[LINKS_STORAGE_KEY]);
      } else {
        log_log('no BYOD links found');
        res([]);
      }
    });
  });
}
function getManagedLinks() {
  return new Promise(res => {
    chrome.storage.managed.get(LINKS_STORAGE_KEY, data => {
      if (data && data[LINKS_STORAGE_KEY]) {
        log_log(`getting ${data[LINKS_STORAGE_KEY].length} managed link(s)...`);
        return res(data[LINKS_STORAGE_KEY]);
      } else {
        log_log('no managed links found');
        return res([]);
      }
    });
  });
}
async function getAllLinks() {
  const storedLinks = await getManagedLinks();
  const byodLinks = await getBYODLinks();
  return storedLinks.concat(byodLinks);
}
async function getOffNetworkLinks() {
  const allLinks = await getAllLinks();
  const links = allLinks.map(s => {
    try {
      return CloudPrintLink.parse(s);
    } catch (e) {
      log_error('Failed to parse Cloud Print link.', 'link', s, e);
    }
  }).filter(res => res != null);
  log_log('Parsed Cloud Print links.', links.map(l => l.orgId + '/' + l.serverId + ' ' + (l.expires() ? `(expiry: ${l.expiry.toISOString()})` : '(no expiry)')));
  return links;
}
function getPrintTokenCacheID(serverId, shareToken) {
  return serverId + ':' + shareToken;
}
async function getShareToken(serverId) {
  return (await getLink(serverId)).shareToken;
}
async function getLink(serverId) {
  const link = (await getOffNetworkLinks()).find(link => link.serverId == serverId);
  if (!link) {
    throw new Error(`no link for server ${serverId}`);
  }
  return link;
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.match-all.js
var es_string_match_all = __webpack_require__(9866);
;// CONCATENATED MODULE: ./src/scripts/offnetwork/offscreen-utils.ts


const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';
let offScreenDocumentCheck = Promise.resolve();
async function getOffScreenDocument() {
  offScreenDocumentCheck = offScreenDocumentCheck.then(async () => {
    if (!(await hasDocument())) {
      log_log('[Offscreen] creating offscreen document...');
      try {
        await chrome.offscreen.createDocument({
          url: OFFSCREEN_DOCUMENT_PATH,
          reasons: [chrome.offscreen.Reason.WEB_RTC],
          justification: 'WebRTC for Mobility Cloud Print'
        });
      } catch (error) {
        if (!error.message.startsWith('Only a single offscreen document')) {
          throw error;
        }
      }
    }
  });
  return offScreenDocumentCheck;
}
async function messageOffScreen(data) {
  await getOffScreenDocument();
  const clientUrl = chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH);
  const messageClient = (await self.clients.matchAll({
    includeUncontrolled: true
  })).find(c => c.url === clientUrl);
  const messageChannel = new MessageChannel();
  messageClient.postMessage(data, [messageChannel.port2]);
  const {
    data: offscreenResponse
  } = await new Promise(cb => messageChannel.port1.onmessage = cb);
  log_log(`[Offscreen.${data.MsgType}] got response`, offscreenResponse);
  return offscreenResponse;
}
async function hasDocument() {
  const clientWindows = await self.clients.matchAll();
  log_log('[Offscreen] checking for offscreen window...', clientWindows);
  for (const clientWindow of clientWindows) {
    if (clientWindow.url.endsWith(OFFSCREEN_DOCUMENT_PATH)) {
      log_log('[Offscreen] found existing offscreen document', clientWindow);
      return true;
    }
  }
  log_log('[Offscreen] could not find existing offscreen document');
  return false;
}
try {
  chrome.runtime.onSuspend.addListener(() => {
    chrome.offscreen.closeDocument().then(() => {
      log_log('[Offscreen] document closed on extension unload');
    }).catch(error => {
      error('Failed to close offscreen document on unload:', error);
    });
  });
} catch (e) {
  console.log(`Error: ${e}`);
}
;// CONCATENATED MODULE: ./src/scripts/offnetwork/offnetwork_extension.ts







try {
  chrome.runtime.onMessage.addListener(handleMessages);
} catch (e) {
  console.log(`Error: ${e}`);
}
async function handleMessages(message) {
  if (message.target !== 'background') {
    return;
  }
  switch (message.type) {
    case 'log':
      {
        log_log(message.data);
        break;
      }
    case 'error':
      {
        log_error(message.data);
        break;
      }
    case 'warn':
      {
        warn(message.data);
        break;
      }
    case 'cache-server-info':
      {
        log_log(`[offscreen.${message.type}] cache server info: ${message.data.ServerID}`);
        updateServerInfo(message.data.ServerID, message.data.ServerInfo);
        break;
      }
    case 'update-print-token-cache':
      {
        log_log(`[offscreen.${message.type}] cache print token for server: ${message.data.ServerID}`);
        updatePrintToken(getPrintTokenCacheID(message.data.ServerID, message.data.ShareToken), message.data.PrintToken);
        break;
      }
    case 'delete-print-token-cache':
      {
        log_log(`[offscreen.${message.type}] remove print token for server: ${message.data.ServerID}`);
        getPrintTokenCache().delete(getPrintTokenCacheID(message.data.ServerID, message.data.ShareToken));
        break;
      }
    case 'update-printer-cache':
      {
        log_log(`[offscreen.${message.type}] update cached printers for server: ${message.data.ServerID}`);
        await updatePrinterCache(message.data.ServerID, message.data.PrinterList);
        break;
      }
    default:
      console.warn(`Unexpected message received for background script: '${JSON.stringify(message)}'.`);
  }
}
async function getPrintersFromAllServers() {
  let links;
  try {
    links = await getOffNetworkLinks();
  } catch (e) {
    log_error('[OffNetwork:getPrintersFromAllServers] failed to get links: ', e);
  }
  if (links.length === 0) {
    log_log('[OffNetwork:getPrintersFromAllServers] No Cloud Print links, skipping Cloud Print discovery.');
    return [];
  }
  log_log('[OffNetwork:getPrintersFromAllServers] links', links);
  const serverIds = new Set(links.map(link => link.serverId));
  const printerNameToServerIdCache = getPrinterNameToServerIdCache();
  for (const [printerName, serverId] of printerNameToServerIdCache.entries()) {
    if (!serverIds.has(serverId)) {
      printerNameToServerIdCache.delete(printerName);
    }
  }
  const printerResults = [...serverIds].map(async serverId => {
    try {
      const printers = await getPrintersFromServer(serverId);
      log_log(`[OffNetwork:getPrintersFromAllServers] got ${printers.length} printers from '${serverId}'`, printers);
      return printers;
    } catch (e) {
      log_error(`[OffNetwork:getPrintersFromAllServers] failed for ${serverId}: `, e);
      return [];
    }
  });
  const result = (await Promise.all(printerResults)).flat(Infinity);
  log_log(`[OffNetwork:getPrintersFromAllServers] completed with ${result.length} Cloud Print printers.`);
  return result;
}
async function getServerInfoRTC(serverId) {
  log_log(`[OffNetwork:getServerInfoRTC] Requesting server info: ${serverId}`);
  const shareToken = await getShareToken(serverId);
  const printTokenCacheID = getPrintTokenCacheID(serverId, shareToken);
  const printToken = getPrintTokenCache().get(printTokenCacheID);
  const clientId = await getClientId();
  const data = {
    ServerID: serverId,
    ClientID: clientId,
    TestEnv: (await getLink(serverId)).testEnv,
    ShareToken: shareToken,
    PrintToken: printToken,
    MsgType: 'get-server-info-rtc'
  };
  const serverInfo = await messageOffScreen(data);
  if (!serverInfo.RespState) {
    log_error('[OffNetwork:getServerInfoRTC] server info fetch error ', serverInfo.RespData);
    throw new Error(serverInfo.RespData);
  }
  return serverInfo.RespData;
}
async function getPrintersFromServer(serverId) {
  log_log(`[OffNetwork:getPrintersFromServer] fetching printers for server '${serverId}'...`);
  const shareToken = await getShareToken(serverId);
  const printTokenCacheID = getPrintTokenCacheID(serverId, shareToken);
  const printToken = getPrintTokenCache().get(printTokenCacheID);
  const clientId = await getClientId();
  const data = {
    ServerID: serverId,
    ClientID: clientId,
    TestEnv: (await getLink(serverId)).testEnv,
    ShareToken: shareToken,
    PrintToken: printToken,
    MsgType: 'get-printers-from-server'
  };
  const printerResult = await messageOffScreen(data);
  if (!printerResult.RespState) {
    log_error('[OffNetwork:getPrintersFromServer] cloud print job submit error (promise reject): ', printerResult.RespData);
    throw new Error(printerResult.RespData);
  }
  await updatePrinterCache(serverId, printerResult.RespData);
  return printerResult.RespData;
}
async function getPrinterInfoRTC(printerId) {
  log_log(`[OffNetwork:getPrinterInfoRTC] Requesting printer info: ${printerId}`);
  const serverId = await getServerIdForPrinter(printerId);
  if (!serverId) {
    throw new Error(`unknown server id for printer: ${printerId}`);
  }
  const shareToken = await getShareToken(serverId);
  const printTokenCacheID = getPrintTokenCacheID(serverId, shareToken);
  const printToken = getPrintTokenCache().get(printTokenCacheID);
  const clientId = await getClientId();
  const data = {
    PrinterID: printerId,
    ServerID: serverId,
    ClientID: clientId,
    TestEnv: (await getLink(serverId)).testEnv,
    ShareToken: shareToken,
    PrintToken: printToken,
    MsgType: 'get-printer-info-rtc'
  };
  const capabilities = await messageOffScreen(data);
  if (!capabilities.RespState) {
    log_error('[OffNetwork:getCapabilitiesOffNetwork] cloud printer capabilities fetch error ', capabilities.RespData);
    throw new Error('Error fetching capabilities via cloud client');
  }
  log_log('[getPrinterInfoRTC] Received printer capabilities.', capabilities.RespData);
  return capabilities.RespData;
}
async function submitPrintJobRTC(file, printerUrl, params) {
  const serverId = await getServerIdForPrinter(printerUrl);
  if (!serverId) {
    throw new Error(`unknown server id for printer ${printerUrl}`);
  }
  log_log('[OffNetwork:submitPrintJobRTC]', 'serverId', serverId, 'params', {
    ...params,
    credentials: '[REDACTED]'
  });
  const shareToken = await getShareToken(serverId);
  const printTokenCacheID = getPrintTokenCacheID(serverId, shareToken);
  const printToken = getPrintTokenCache().get(printTokenCacheID);
  const clientId = await getClientId();
  const data = {
    FileData: file,
    PrinterURL: printerUrl,
    Params: params,
    ServerID: serverId,
    ClientID: clientId,
    TestEnv: (await getLink(serverId)).testEnv,
    ShareToken: shareToken,
    PrintToken: printToken,
    MsgType: 'submit-print-job-rtc'
  };
  const jobDetails = await messageOffScreen(data);
  if (!jobDetails.RespState) {
    log_error('[OffNetwork:submitPrintJobRTC] cloud print job submit error (promise reject): ', jobDetails.RespData);
    throw new Error(jobDetails.RespData);
  }
  log_log('[submitPrintJobRTC] received job submit result (jobDetails) from offscreen doc: ', jobDetails.RespData);
  updateLastPrintedTime(printerUrl);
  return jobDetails.RespData;
}
;// CONCATENATED MODULE: ./src/scripts/printer/printer.ts
function getUrlBaseOfPrinterUrl(printerUrl) {
  return printerUrl.replace(/\/printers\/.*/i, '');
}
function getPrinterName(printerUrl) {
  return printerUrl.slice(printerUrl.lastIndexOf('/printers/') + '/printers/'.length);
}
;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/jsbn/util.js
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
function int2char(n) {
    return BI_RM.charAt(n);
}
//#region BIT_OPERATIONS
// (public) this & a
function op_and(x, y) {
    return x & y;
}
// (public) this | a
function op_or(x, y) {
    return x | y;
}
// (public) this ^ a
function op_xor(x, y) {
    return x ^ y;
}
// (public) this & ~a
function op_andnot(x, y) {
    return x & ~y;
}
// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
    if (x == 0) {
        return -1;
    }
    var r = 0;
    if ((x & 0xffff) == 0) {
        x >>= 16;
        r += 16;
    }
    if ((x & 0xff) == 0) {
        x >>= 8;
        r += 8;
    }
    if ((x & 0xf) == 0) {
        x >>= 4;
        r += 4;
    }
    if ((x & 3) == 0) {
        x >>= 2;
        r += 2;
    }
    if ((x & 1) == 0) {
        ++r;
    }
    return r;
}
// return number of 1 bits in x
function cbit(x) {
    var r = 0;
    while (x != 0) {
        x &= x - 1;
        ++r;
    }
    return r;
}
//#endregion BIT_OPERATIONS

;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/jsbn/base64.js

var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64pad = "=";
function hex2b64(h) {
    var i;
    var c;
    var ret = "";
    for (i = 0; i + 3 <= h.length; i += 3) {
        c = parseInt(h.substring(i, i + 3), 16);
        ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
    }
    if (i + 1 == h.length) {
        c = parseInt(h.substring(i, i + 1), 16);
        ret += b64map.charAt(c << 2);
    }
    else if (i + 2 == h.length) {
        c = parseInt(h.substring(i, i + 2), 16);
        ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
    }
    while ((ret.length & 3) > 0) {
        ret += b64pad;
    }
    return ret;
}
// convert a base64 string to hex
function b64tohex(s) {
    var ret = "";
    var i;
    var k = 0; // b64 state, 0-3
    var slop = 0;
    for (i = 0; i < s.length; ++i) {
        if (s.charAt(i) == b64pad) {
            break;
        }
        var v = b64map.indexOf(s.charAt(i));
        if (v < 0) {
            continue;
        }
        if (k == 0) {
            ret += int2char(v >> 2);
            slop = v & 3;
            k = 1;
        }
        else if (k == 1) {
            ret += int2char((slop << 2) | (v >> 4));
            slop = v & 0xf;
            k = 2;
        }
        else if (k == 2) {
            ret += int2char(slop);
            ret += int2char(v >> 2);
            slop = v & 3;
            k = 3;
        }
        else {
            ret += int2char((slop << 2) | (v >> 4));
            ret += int2char(v & 0xf);
            k = 0;
        }
    }
    if (k == 1) {
        ret += int2char(slop << 2);
    }
    return ret;
}
// convert a base64 string to a byte/number array
function b64toBA(s) {
    // piggyback on b64tohex for now, optimize later
    var h = b64tohex(s);
    var i;
    var a = [];
    for (i = 0; 2 * i < h.length; ++i) {
        a[i] = parseInt(h.substring(2 * i, 2 * i + 2), 16);
    }
    return a;
}

;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/asn1js/hex.js
// Hex JavaScript decoder
// Copyright (c) 2008-2013 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
var decoder;
var Hex = {
    decode: function (a) {
        var i;
        if (decoder === undefined) {
            var hex = "0123456789ABCDEF";
            var ignore = " \f\n\r\t\u00A0\u2028\u2029";
            decoder = {};
            for (i = 0; i < 16; ++i) {
                decoder[hex.charAt(i)] = i;
            }
            hex = hex.toLowerCase();
            for (i = 10; i < 16; ++i) {
                decoder[hex.charAt(i)] = i;
            }
            for (i = 0; i < ignore.length; ++i) {
                decoder[ignore.charAt(i)] = -1;
            }
        }
        var out = [];
        var bits = 0;
        var char_count = 0;
        for (i = 0; i < a.length; ++i) {
            var c = a.charAt(i);
            if (c == "=") {
                break;
            }
            c = decoder[c];
            if (c == -1) {
                continue;
            }
            if (c === undefined) {
                throw new Error("Illegal character at offset " + i);
            }
            bits |= c;
            if (++char_count >= 2) {
                out[out.length] = bits;
                bits = 0;
                char_count = 0;
            }
            else {
                bits <<= 4;
            }
        }
        if (char_count) {
            throw new Error("Hex encoding incomplete: 4 bits missing");
        }
        return out;
    }
};

;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/asn1js/base64.js
// Base64 JavaScript decoder
// Copyright (c) 2008-2013 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
var base64_decoder;
var Base64 = {
    decode: function (a) {
        var i;
        if (base64_decoder === undefined) {
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var ignore = "= \f\n\r\t\u00A0\u2028\u2029";
            base64_decoder = Object.create(null);
            for (i = 0; i < 64; ++i) {
                base64_decoder[b64.charAt(i)] = i;
            }
            base64_decoder['-'] = 62; //+
            base64_decoder['_'] = 63; //-
            for (i = 0; i < ignore.length; ++i) {
                base64_decoder[ignore.charAt(i)] = -1;
            }
        }
        var out = [];
        var bits = 0;
        var char_count = 0;
        for (i = 0; i < a.length; ++i) {
            var c = a.charAt(i);
            if (c == "=") {
                break;
            }
            c = base64_decoder[c];
            if (c == -1) {
                continue;
            }
            if (c === undefined) {
                throw new Error("Illegal character at offset " + i);
            }
            bits |= c;
            if (++char_count >= 4) {
                out[out.length] = (bits >> 16);
                out[out.length] = (bits >> 8) & 0xFF;
                out[out.length] = bits & 0xFF;
                bits = 0;
                char_count = 0;
            }
            else {
                bits <<= 6;
            }
        }
        switch (char_count) {
            case 1:
                throw new Error("Base64 encoding incomplete: at least 2 bits missing");
            case 2:
                out[out.length] = (bits >> 10);
                break;
            case 3:
                out[out.length] = (bits >> 16);
                out[out.length] = (bits >> 8) & 0xFF;
                break;
        }
        return out;
    },
    re: /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/,
    unarmor: function (a) {
        var m = Base64.re.exec(a);
        if (m) {
            if (m[1]) {
                a = m[1];
            }
            else if (m[2]) {
                a = m[2];
            }
            else {
                throw new Error("RegExp out of sync");
            }
        }
        return Base64.decode(a);
    }
};

;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/asn1js/int10.js
// Big integer base-10 printing library
// Copyright (c) 2014 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
var max = 10000000000000; // biggest integer that can still fit 2^53 when multiplied by 256
var Int10 = /** @class */ (function () {
    function Int10(value) {
        this.buf = [+value || 0];
    }
    Int10.prototype.mulAdd = function (m, c) {
        // assert(m <= 256)
        var b = this.buf;
        var l = b.length;
        var i;
        var t;
        for (i = 0; i < l; ++i) {
            t = b[i] * m + c;
            if (t < max) {
                c = 0;
            }
            else {
                c = 0 | (t / max);
                t -= c * max;
            }
            b[i] = t;
        }
        if (c > 0) {
            b[i] = c;
        }
    };
    Int10.prototype.sub = function (c) {
        // assert(m <= 256)
        var b = this.buf;
        var l = b.length;
        var i;
        var t;
        for (i = 0; i < l; ++i) {
            t = b[i] - c;
            if (t < 0) {
                t += max;
                c = 1;
            }
            else {
                c = 0;
            }
            b[i] = t;
        }
        while (b[b.length - 1] === 0) {
            b.pop();
        }
    };
    Int10.prototype.toString = function (base) {
        if ((base || 10) != 10) {
            throw new Error("only base 10 is supported");
        }
        var b = this.buf;
        var s = b[b.length - 1].toString();
        for (var i = b.length - 2; i >= 0; --i) {
            s += (max + b[i]).toString().substring(1);
        }
        return s;
    };
    Int10.prototype.valueOf = function () {
        var b = this.buf;
        var v = 0;
        for (var i = b.length - 1; i >= 0; --i) {
            v = v * max + b[i];
        }
        return v;
    };
    Int10.prototype.simplify = function () {
        var b = this.buf;
        return (b.length == 1) ? b[0] : this;
    };
    return Int10;
}());


;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/asn1js/asn1.js
// ASN.1 JavaScript decoder
// Copyright (c) 2008-2014 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
/*global oids */

var ellipsis = "\u2026";
var reTimeS = /^(\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
var reTimeL = /^(\d\d\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
function stringCut(str, len) {
    if (str.length > len) {
        str = str.substring(0, len) + ellipsis;
    }
    return str;
}
var Stream = /** @class */ (function () {
    function Stream(enc, pos) {
        this.hexDigits = "0123456789ABCDEF";
        if (enc instanceof Stream) {
            this.enc = enc.enc;
            this.pos = enc.pos;
        }
        else {
            // enc should be an array or a binary string
            this.enc = enc;
            this.pos = pos;
        }
    }
    Stream.prototype.get = function (pos) {
        if (pos === undefined) {
            pos = this.pos++;
        }
        if (pos >= this.enc.length) {
            throw new Error("Requesting byte offset ".concat(pos, " on a stream of length ").concat(this.enc.length));
        }
        return ("string" === typeof this.enc) ? this.enc.charCodeAt(pos) : this.enc[pos];
    };
    Stream.prototype.hexByte = function (b) {
        return this.hexDigits.charAt((b >> 4) & 0xF) + this.hexDigits.charAt(b & 0xF);
    };
    Stream.prototype.hexDump = function (start, end, raw) {
        var s = "";
        for (var i = start; i < end; ++i) {
            s += this.hexByte(this.get(i));
            if (raw !== true) {
                switch (i & 0xF) {
                    case 0x7:
                        s += "  ";
                        break;
                    case 0xF:
                        s += "\n";
                        break;
                    default:
                        s += " ";
                }
            }
        }
        return s;
    };
    Stream.prototype.isASCII = function (start, end) {
        for (var i = start; i < end; ++i) {
            var c = this.get(i);
            if (c < 32 || c > 176) {
                return false;
            }
        }
        return true;
    };
    Stream.prototype.parseStringISO = function (start, end) {
        var s = "";
        for (var i = start; i < end; ++i) {
            s += String.fromCharCode(this.get(i));
        }
        return s;
    };
    Stream.prototype.parseStringUTF = function (start, end) {
        var s = "";
        for (var i = start; i < end;) {
            var c = this.get(i++);
            if (c < 128) {
                s += String.fromCharCode(c);
            }
            else if ((c > 191) && (c < 224)) {
                s += String.fromCharCode(((c & 0x1F) << 6) | (this.get(i++) & 0x3F));
            }
            else {
                s += String.fromCharCode(((c & 0x0F) << 12) | ((this.get(i++) & 0x3F) << 6) | (this.get(i++) & 0x3F));
            }
        }
        return s;
    };
    Stream.prototype.parseStringBMP = function (start, end) {
        var str = "";
        var hi;
        var lo;
        for (var i = start; i < end;) {
            hi = this.get(i++);
            lo = this.get(i++);
            str += String.fromCharCode((hi << 8) | lo);
        }
        return str;
    };
    Stream.prototype.parseTime = function (start, end, shortYear) {
        var s = this.parseStringISO(start, end);
        var m = (shortYear ? reTimeS : reTimeL).exec(s);
        if (!m) {
            return "Unrecognized time: " + s;
        }
        if (shortYear) {
            // to avoid querying the timer, use the fixed range [1970, 2069]
            // it will conform with ITU X.400 [-10, +40] sliding window until 2030
            m[1] = +m[1];
            m[1] += (+m[1] < 70) ? 2000 : 1900;
        }
        s = m[1] + "-" + m[2] + "-" + m[3] + " " + m[4];
        if (m[5]) {
            s += ":" + m[5];
            if (m[6]) {
                s += ":" + m[6];
                if (m[7]) {
                    s += "." + m[7];
                }
            }
        }
        if (m[8]) {
            s += " UTC";
            if (m[8] != "Z") {
                s += m[8];
                if (m[9]) {
                    s += ":" + m[9];
                }
            }
        }
        return s;
    };
    Stream.prototype.parseInteger = function (start, end) {
        var v = this.get(start);
        var neg = (v > 127);
        var pad = neg ? 255 : 0;
        var len;
        var s = "";
        // skip unuseful bits (not allowed in DER)
        while (v == pad && ++start < end) {
            v = this.get(start);
        }
        len = end - start;
        if (len === 0) {
            return neg ? -1 : 0;
        }
        // show bit length of huge integers
        if (len > 4) {
            s = v;
            len <<= 3;
            while (((+s ^ pad) & 0x80) == 0) {
                s = +s << 1;
                --len;
            }
            s = "(" + len + " bit)\n";
        }
        // decode the integer
        if (neg) {
            v = v - 256;
        }
        var n = new Int10(v);
        for (var i = start + 1; i < end; ++i) {
            n.mulAdd(256, this.get(i));
        }
        return s + n.toString();
    };
    Stream.prototype.parseBitString = function (start, end, maxLength) {
        var unusedBit = this.get(start);
        var lenBit = ((end - start - 1) << 3) - unusedBit;
        var intro = "(" + lenBit + " bit)\n";
        var s = "";
        for (var i = start + 1; i < end; ++i) {
            var b = this.get(i);
            var skip = (i == end - 1) ? unusedBit : 0;
            for (var j = 7; j >= skip; --j) {
                s += (b >> j) & 1 ? "1" : "0";
            }
            if (s.length > maxLength) {
                return intro + stringCut(s, maxLength);
            }
        }
        return intro + s;
    };
    Stream.prototype.parseOctetString = function (start, end, maxLength) {
        if (this.isASCII(start, end)) {
            return stringCut(this.parseStringISO(start, end), maxLength);
        }
        var len = end - start;
        var s = "(" + len + " byte)\n";
        maxLength /= 2; // we work in bytes
        if (len > maxLength) {
            end = start + maxLength;
        }
        for (var i = start; i < end; ++i) {
            s += this.hexByte(this.get(i));
        }
        if (len > maxLength) {
            s += ellipsis;
        }
        return s;
    };
    Stream.prototype.parseOID = function (start, end, maxLength) {
        var s = "";
        var n = new Int10();
        var bits = 0;
        for (var i = start; i < end; ++i) {
            var v = this.get(i);
            n.mulAdd(128, v & 0x7F);
            bits += 7;
            if (!(v & 0x80)) { // finished
                if (s === "") {
                    n = n.simplify();
                    if (n instanceof Int10) {
                        n.sub(80);
                        s = "2." + n.toString();
                    }
                    else {
                        var m = n < 80 ? n < 40 ? 0 : 1 : 2;
                        s = m + "." + (n - m * 40);
                    }
                }
                else {
                    s += "." + n.toString();
                }
                if (s.length > maxLength) {
                    return stringCut(s, maxLength);
                }
                n = new Int10();
                bits = 0;
            }
        }
        if (bits > 0) {
            s += ".incomplete";
        }
        return s;
    };
    return Stream;
}());

var ASN1 = /** @class */ (function () {
    function ASN1(stream, header, length, tag, sub) {
        if (!(tag instanceof ASN1Tag)) {
            throw new Error("Invalid tag value.");
        }
        this.stream = stream;
        this.header = header;
        this.length = length;
        this.tag = tag;
        this.sub = sub;
    }
    ASN1.prototype.typeName = function () {
        switch (this.tag.tagClass) {
            case 0: // universal
                switch (this.tag.tagNumber) {
                    case 0x00:
                        return "EOC";
                    case 0x01:
                        return "BOOLEAN";
                    case 0x02:
                        return "INTEGER";
                    case 0x03:
                        return "BIT_STRING";
                    case 0x04:
                        return "OCTET_STRING";
                    case 0x05:
                        return "NULL";
                    case 0x06:
                        return "OBJECT_IDENTIFIER";
                    case 0x07:
                        return "ObjectDescriptor";
                    case 0x08:
                        return "EXTERNAL";
                    case 0x09:
                        return "REAL";
                    case 0x0A:
                        return "ENUMERATED";
                    case 0x0B:
                        return "EMBEDDED_PDV";
                    case 0x0C:
                        return "UTF8String";
                    case 0x10:
                        return "SEQUENCE";
                    case 0x11:
                        return "SET";
                    case 0x12:
                        return "NumericString";
                    case 0x13:
                        return "PrintableString"; // ASCII subset
                    case 0x14:
                        return "TeletexString"; // aka T61String
                    case 0x15:
                        return "VideotexString";
                    case 0x16:
                        return "IA5String"; // ASCII
                    case 0x17:
                        return "UTCTime";
                    case 0x18:
                        return "GeneralizedTime";
                    case 0x19:
                        return "GraphicString";
                    case 0x1A:
                        return "VisibleString"; // ASCII subset
                    case 0x1B:
                        return "GeneralString";
                    case 0x1C:
                        return "UniversalString";
                    case 0x1E:
                        return "BMPString";
                }
                return "Universal_" + this.tag.tagNumber.toString();
            case 1:
                return "Application_" + this.tag.tagNumber.toString();
            case 2:
                return "[" + this.tag.tagNumber.toString() + "]"; // Context
            case 3:
                return "Private_" + this.tag.tagNumber.toString();
        }
    };
    ASN1.prototype.content = function (maxLength) {
        if (this.tag === undefined) {
            return null;
        }
        if (maxLength === undefined) {
            maxLength = Infinity;
        }
        var content = this.posContent();
        var len = Math.abs(this.length);
        if (!this.tag.isUniversal()) {
            if (this.sub !== null) {
                return "(" + this.sub.length + " elem)";
            }
            return this.stream.parseOctetString(content, content + len, maxLength);
        }
        switch (this.tag.tagNumber) {
            case 0x01: // BOOLEAN
                return (this.stream.get(content) === 0) ? "false" : "true";
            case 0x02: // INTEGER
                return this.stream.parseInteger(content, content + len);
            case 0x03: // BIT_STRING
                return this.sub ? "(" + this.sub.length + " elem)" :
                    this.stream.parseBitString(content, content + len, maxLength);
            case 0x04: // OCTET_STRING
                return this.sub ? "(" + this.sub.length + " elem)" :
                    this.stream.parseOctetString(content, content + len, maxLength);
            // case 0x05: // NULL
            case 0x06: // OBJECT_IDENTIFIER
                return this.stream.parseOID(content, content + len, maxLength);
            // case 0x07: // ObjectDescriptor
            // case 0x08: // EXTERNAL
            // case 0x09: // REAL
            // case 0x0A: // ENUMERATED
            // case 0x0B: // EMBEDDED_PDV
            case 0x10: // SEQUENCE
            case 0x11: // SET
                if (this.sub !== null) {
                    return "(" + this.sub.length + " elem)";
                }
                else {
                    return "(no elem)";
                }
            case 0x0C: // UTF8String
                return stringCut(this.stream.parseStringUTF(content, content + len), maxLength);
            case 0x12: // NumericString
            case 0x13: // PrintableString
            case 0x14: // TeletexString
            case 0x15: // VideotexString
            case 0x16: // IA5String
            // case 0x19: // GraphicString
            case 0x1A: // VisibleString
                // case 0x1B: // GeneralString
                // case 0x1C: // UniversalString
                return stringCut(this.stream.parseStringISO(content, content + len), maxLength);
            case 0x1E: // BMPString
                return stringCut(this.stream.parseStringBMP(content, content + len), maxLength);
            case 0x17: // UTCTime
            case 0x18: // GeneralizedTime
                return this.stream.parseTime(content, content + len, (this.tag.tagNumber == 0x17));
        }
        return null;
    };
    ASN1.prototype.toString = function () {
        return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + ((this.sub === null) ? "null" : this.sub.length) + "]";
    };
    ASN1.prototype.toPrettyString = function (indent) {
        if (indent === undefined) {
            indent = "";
        }
        var s = indent + this.typeName() + " @" + this.stream.pos;
        if (this.length >= 0) {
            s += "+";
        }
        s += this.length;
        if (this.tag.tagConstructed) {
            s += " (constructed)";
        }
        else if ((this.tag.isUniversal() && ((this.tag.tagNumber == 0x03) || (this.tag.tagNumber == 0x04))) && (this.sub !== null)) {
            s += " (encapsulates)";
        }
        s += "\n";
        if (this.sub !== null) {
            indent += "  ";
            for (var i = 0, max = this.sub.length; i < max; ++i) {
                s += this.sub[i].toPrettyString(indent);
            }
        }
        return s;
    };
    ASN1.prototype.posStart = function () {
        return this.stream.pos;
    };
    ASN1.prototype.posContent = function () {
        return this.stream.pos + this.header;
    };
    ASN1.prototype.posEnd = function () {
        return this.stream.pos + this.header + Math.abs(this.length);
    };
    ASN1.prototype.toHexString = function () {
        return this.stream.hexDump(this.posStart(), this.posEnd(), true);
    };
    ASN1.decodeLength = function (stream) {
        var buf = stream.get();
        var len = buf & 0x7F;
        if (len == buf) {
            return len;
        }
        // no reason to use Int10, as it would be a huge buffer anyways
        if (len > 6) {
            throw new Error("Length over 48 bits not supported at position " + (stream.pos - 1));
        }
        if (len === 0) {
            return null;
        } // undefined
        buf = 0;
        for (var i = 0; i < len; ++i) {
            buf = (buf * 256) + stream.get();
        }
        return buf;
    };
    /**
     * Retrieve the hexadecimal value (as a string) of the current ASN.1 element
     * @returns {string}
     * @public
     */
    ASN1.prototype.getHexStringValue = function () {
        var hexString = this.toHexString();
        var offset = this.header * 2;
        var length = this.length * 2;
        return hexString.substr(offset, length);
    };
    ASN1.decode = function (str) {
        var stream;
        if (!(str instanceof Stream)) {
            stream = new Stream(str, 0);
        }
        else {
            stream = str;
        }
        var streamStart = new Stream(stream);
        var tag = new ASN1Tag(stream);
        var len = ASN1.decodeLength(stream);
        var start = stream.pos;
        var header = start - streamStart.pos;
        var sub = null;
        var getSub = function () {
            var ret = [];
            if (len !== null) {
                // definite length
                var end = start + len;
                while (stream.pos < end) {
                    ret[ret.length] = ASN1.decode(stream);
                }
                if (stream.pos != end) {
                    throw new Error("Content size is not correct for container starting at offset " + start);
                }
            }
            else {
                // undefined length
                try {
                    for (;;) {
                        var s = ASN1.decode(stream);
                        if (s.tag.isEOC()) {
                            break;
                        }
                        ret[ret.length] = s;
                    }
                    len = start - stream.pos; // undefined lengths are represented as negative values
                }
                catch (e) {
                    throw new Error("Exception while decoding undefined length content: " + e);
                }
            }
            return ret;
        };
        if (tag.tagConstructed) {
            // must have valid content
            sub = getSub();
        }
        else if (tag.isUniversal() && ((tag.tagNumber == 0x03) || (tag.tagNumber == 0x04))) {
            // sometimes BitString and OctetString are used to encapsulate ASN.1
            try {
                if (tag.tagNumber == 0x03) {
                    if (stream.get() != 0) {
                        throw new Error("BIT STRINGs with unused bits cannot encapsulate.");
                    }
                }
                sub = getSub();
                for (var i = 0; i < sub.length; ++i) {
                    if (sub[i].tag.isEOC()) {
                        throw new Error("EOC is not supposed to be actual content.");
                    }
                }
            }
            catch (e) {
                // but silently ignore when they don't
                sub = null;
            }
        }
        if (sub === null) {
            if (len === null) {
                throw new Error("We can't skip over an invalid tag with undefined length at offset " + start);
            }
            stream.pos = start + Math.abs(len);
        }
        return new ASN1(streamStart, header, len, tag, sub);
    };
    return ASN1;
}());

var ASN1Tag = /** @class */ (function () {
    function ASN1Tag(stream) {
        var buf = stream.get();
        this.tagClass = buf >> 6;
        this.tagConstructed = ((buf & 0x20) !== 0);
        this.tagNumber = buf & 0x1F;
        if (this.tagNumber == 0x1F) { // long tag
            var n = new Int10();
            do {
                buf = stream.get();
                n.mulAdd(128, buf & 0x7F);
            } while (buf & 0x80);
            this.tagNumber = n.simplify();
        }
    }
    ASN1Tag.prototype.isUniversal = function () {
        return this.tagClass === 0x00;
    };
    ASN1Tag.prototype.isEOC = function () {
        return this.tagClass === 0x00 && this.tagNumber === 0x00;
    };
    return ASN1Tag;
}());


;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/jsbn/jsbn.js
// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.
// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;
// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary & 0xffffff) == 0xefcafe);
//#region
var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
//#endregion
// (public) Constructor
var BigInteger = /** @class */ (function () {
    function BigInteger(a, b, c) {
        if (a != null) {
            if ("number" == typeof a) {
                this.fromNumber(a, b, c);
            }
            else if (b == null && "string" != typeof a) {
                this.fromString(a, 256);
            }
            else {
                this.fromString(a, b);
            }
        }
    }
    //#region PUBLIC
    // BigInteger.prototype.toString = bnToString;
    // (public) return string representation in given radix
    BigInteger.prototype.toString = function (b) {
        if (this.s < 0) {
            return "-" + this.negate().toString(b);
        }
        var k;
        if (b == 16) {
            k = 4;
        }
        else if (b == 8) {
            k = 3;
        }
        else if (b == 2) {
            k = 1;
        }
        else if (b == 32) {
            k = 5;
        }
        else if (b == 4) {
            k = 2;
        }
        else {
            return this.toRadix(b);
        }
        var km = (1 << k) - 1;
        var d;
        var m = false;
        var r = "";
        var i = this.t;
        var p = this.DB - (i * this.DB) % k;
        if (i-- > 0) {
            if (p < this.DB && (d = this[i] >> p) > 0) {
                m = true;
                r = int2char(d);
            }
            while (i >= 0) {
                if (p < k) {
                    d = (this[i] & ((1 << p) - 1)) << (k - p);
                    d |= this[--i] >> (p += this.DB - k);
                }
                else {
                    d = (this[i] >> (p -= k)) & km;
                    if (p <= 0) {
                        p += this.DB;
                        --i;
                    }
                }
                if (d > 0) {
                    m = true;
                }
                if (m) {
                    r += int2char(d);
                }
            }
        }
        return m ? r : "0";
    };
    // BigInteger.prototype.negate = bnNegate;
    // (public) -this
    BigInteger.prototype.negate = function () {
        var r = nbi();
        BigInteger.ZERO.subTo(this, r);
        return r;
    };
    // BigInteger.prototype.abs = bnAbs;
    // (public) |this|
    BigInteger.prototype.abs = function () {
        return (this.s < 0) ? this.negate() : this;
    };
    // BigInteger.prototype.compareTo = bnCompareTo;
    // (public) return + if this > a, - if this < a, 0 if equal
    BigInteger.prototype.compareTo = function (a) {
        var r = this.s - a.s;
        if (r != 0) {
            return r;
        }
        var i = this.t;
        r = i - a.t;
        if (r != 0) {
            return (this.s < 0) ? -r : r;
        }
        while (--i >= 0) {
            if ((r = this[i] - a[i]) != 0) {
                return r;
            }
        }
        return 0;
    };
    // BigInteger.prototype.bitLength = bnBitLength;
    // (public) return the number of bits in "this"
    BigInteger.prototype.bitLength = function () {
        if (this.t <= 0) {
            return 0;
        }
        return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM));
    };
    // BigInteger.prototype.mod = bnMod;
    // (public) this mod a
    BigInteger.prototype.mod = function (a) {
        var r = nbi();
        this.abs().divRemTo(a, null, r);
        if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
            a.subTo(r, r);
        }
        return r;
    };
    // BigInteger.prototype.modPowInt = bnModPowInt;
    // (public) this^e % m, 0 <= e < 2^32
    BigInteger.prototype.modPowInt = function (e, m) {
        var z;
        if (e < 256 || m.isEven()) {
            z = new Classic(m);
        }
        else {
            z = new Montgomery(m);
        }
        return this.exp(e, z);
    };
    // BigInteger.prototype.clone = bnClone;
    // (public)
    BigInteger.prototype.clone = function () {
        var r = nbi();
        this.copyTo(r);
        return r;
    };
    // BigInteger.prototype.intValue = bnIntValue;
    // (public) return value as integer
    BigInteger.prototype.intValue = function () {
        if (this.s < 0) {
            if (this.t == 1) {
                return this[0] - this.DV;
            }
            else if (this.t == 0) {
                return -1;
            }
        }
        else if (this.t == 1) {
            return this[0];
        }
        else if (this.t == 0) {
            return 0;
        }
        // assumes 16 < DB < 32
        return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0];
    };
    // BigInteger.prototype.byteValue = bnByteValue;
    // (public) return value as byte
    BigInteger.prototype.byteValue = function () {
        return (this.t == 0) ? this.s : (this[0] << 24) >> 24;
    };
    // BigInteger.prototype.shortValue = bnShortValue;
    // (public) return value as short (assumes DB>=16)
    BigInteger.prototype.shortValue = function () {
        return (this.t == 0) ? this.s : (this[0] << 16) >> 16;
    };
    // BigInteger.prototype.signum = bnSigNum;
    // (public) 0 if this == 0, 1 if this > 0
    BigInteger.prototype.signum = function () {
        if (this.s < 0) {
            return -1;
        }
        else if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) {
            return 0;
        }
        else {
            return 1;
        }
    };
    // BigInteger.prototype.toByteArray = bnToByteArray;
    // (public) convert to bigendian byte array
    BigInteger.prototype.toByteArray = function () {
        var i = this.t;
        var r = [];
        r[0] = this.s;
        var p = this.DB - (i * this.DB) % 8;
        var d;
        var k = 0;
        if (i-- > 0) {
            if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p) {
                r[k++] = d | (this.s << (this.DB - p));
            }
            while (i >= 0) {
                if (p < 8) {
                    d = (this[i] & ((1 << p) - 1)) << (8 - p);
                    d |= this[--i] >> (p += this.DB - 8);
                }
                else {
                    d = (this[i] >> (p -= 8)) & 0xff;
                    if (p <= 0) {
                        p += this.DB;
                        --i;
                    }
                }
                if ((d & 0x80) != 0) {
                    d |= -256;
                }
                if (k == 0 && (this.s & 0x80) != (d & 0x80)) {
                    ++k;
                }
                if (k > 0 || d != this.s) {
                    r[k++] = d;
                }
            }
        }
        return r;
    };
    // BigInteger.prototype.equals = bnEquals;
    BigInteger.prototype.equals = function (a) {
        return (this.compareTo(a) == 0);
    };
    // BigInteger.prototype.min = bnMin;
    BigInteger.prototype.min = function (a) {
        return (this.compareTo(a) < 0) ? this : a;
    };
    // BigInteger.prototype.max = bnMax;
    BigInteger.prototype.max = function (a) {
        return (this.compareTo(a) > 0) ? this : a;
    };
    // BigInteger.prototype.and = bnAnd;
    BigInteger.prototype.and = function (a) {
        var r = nbi();
        this.bitwiseTo(a, op_and, r);
        return r;
    };
    // BigInteger.prototype.or = bnOr;
    BigInteger.prototype.or = function (a) {
        var r = nbi();
        this.bitwiseTo(a, op_or, r);
        return r;
    };
    // BigInteger.prototype.xor = bnXor;
    BigInteger.prototype.xor = function (a) {
        var r = nbi();
        this.bitwiseTo(a, op_xor, r);
        return r;
    };
    // BigInteger.prototype.andNot = bnAndNot;
    BigInteger.prototype.andNot = function (a) {
        var r = nbi();
        this.bitwiseTo(a, op_andnot, r);
        return r;
    };
    // BigInteger.prototype.not = bnNot;
    // (public) ~this
    BigInteger.prototype.not = function () {
        var r = nbi();
        for (var i = 0; i < this.t; ++i) {
            r[i] = this.DM & ~this[i];
        }
        r.t = this.t;
        r.s = ~this.s;
        return r;
    };
    // BigInteger.prototype.shiftLeft = bnShiftLeft;
    // (public) this << n
    BigInteger.prototype.shiftLeft = function (n) {
        var r = nbi();
        if (n < 0) {
            this.rShiftTo(-n, r);
        }
        else {
            this.lShiftTo(n, r);
        }
        return r;
    };
    // BigInteger.prototype.shiftRight = bnShiftRight;
    // (public) this >> n
    BigInteger.prototype.shiftRight = function (n) {
        var r = nbi();
        if (n < 0) {
            this.lShiftTo(-n, r);
        }
        else {
            this.rShiftTo(n, r);
        }
        return r;
    };
    // BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
    // (public) returns index of lowest 1-bit (or -1 if none)
    BigInteger.prototype.getLowestSetBit = function () {
        for (var i = 0; i < this.t; ++i) {
            if (this[i] != 0) {
                return i * this.DB + lbit(this[i]);
            }
        }
        if (this.s < 0) {
            return this.t * this.DB;
        }
        return -1;
    };
    // BigInteger.prototype.bitCount = bnBitCount;
    // (public) return number of set bits
    BigInteger.prototype.bitCount = function () {
        var r = 0;
        var x = this.s & this.DM;
        for (var i = 0; i < this.t; ++i) {
            r += cbit(this[i] ^ x);
        }
        return r;
    };
    // BigInteger.prototype.testBit = bnTestBit;
    // (public) true iff nth bit is set
    BigInteger.prototype.testBit = function (n) {
        var j = Math.floor(n / this.DB);
        if (j >= this.t) {
            return (this.s != 0);
        }
        return ((this[j] & (1 << (n % this.DB))) != 0);
    };
    // BigInteger.prototype.setBit = bnSetBit;
    // (public) this | (1<<n)
    BigInteger.prototype.setBit = function (n) {
        return this.changeBit(n, op_or);
    };
    // BigInteger.prototype.clearBit = bnClearBit;
    // (public) this & ~(1<<n)
    BigInteger.prototype.clearBit = function (n) {
        return this.changeBit(n, op_andnot);
    };
    // BigInteger.prototype.flipBit = bnFlipBit;
    // (public) this ^ (1<<n)
    BigInteger.prototype.flipBit = function (n) {
        return this.changeBit(n, op_xor);
    };
    // BigInteger.prototype.add = bnAdd;
    // (public) this + a
    BigInteger.prototype.add = function (a) {
        var r = nbi();
        this.addTo(a, r);
        return r;
    };
    // BigInteger.prototype.subtract = bnSubtract;
    // (public) this - a
    BigInteger.prototype.subtract = function (a) {
        var r = nbi();
        this.subTo(a, r);
        return r;
    };
    // BigInteger.prototype.multiply = bnMultiply;
    // (public) this * a
    BigInteger.prototype.multiply = function (a) {
        var r = nbi();
        this.multiplyTo(a, r);
        return r;
    };
    // BigInteger.prototype.divide = bnDivide;
    // (public) this / a
    BigInteger.prototype.divide = function (a) {
        var r = nbi();
        this.divRemTo(a, r, null);
        return r;
    };
    // BigInteger.prototype.remainder = bnRemainder;
    // (public) this % a
    BigInteger.prototype.remainder = function (a) {
        var r = nbi();
        this.divRemTo(a, null, r);
        return r;
    };
    // BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
    // (public) [this/a,this%a]
    BigInteger.prototype.divideAndRemainder = function (a) {
        var q = nbi();
        var r = nbi();
        this.divRemTo(a, q, r);
        return [q, r];
    };
    // BigInteger.prototype.modPow = bnModPow;
    // (public) this^e % m (HAC 14.85)
    BigInteger.prototype.modPow = function (e, m) {
        var i = e.bitLength();
        var k;
        var r = nbv(1);
        var z;
        if (i <= 0) {
            return r;
        }
        else if (i < 18) {
            k = 1;
        }
        else if (i < 48) {
            k = 3;
        }
        else if (i < 144) {
            k = 4;
        }
        else if (i < 768) {
            k = 5;
        }
        else {
            k = 6;
        }
        if (i < 8) {
            z = new Classic(m);
        }
        else if (m.isEven()) {
            z = new Barrett(m);
        }
        else {
            z = new Montgomery(m);
        }
        // precomputation
        var g = [];
        var n = 3;
        var k1 = k - 1;
        var km = (1 << k) - 1;
        g[1] = z.convert(this);
        if (k > 1) {
            var g2 = nbi();
            z.sqrTo(g[1], g2);
            while (n <= km) {
                g[n] = nbi();
                z.mulTo(g2, g[n - 2], g[n]);
                n += 2;
            }
        }
        var j = e.t - 1;
        var w;
        var is1 = true;
        var r2 = nbi();
        var t;
        i = nbits(e[j]) - 1;
        while (j >= 0) {
            if (i >= k1) {
                w = (e[j] >> (i - k1)) & km;
            }
            else {
                w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
                if (j > 0) {
                    w |= e[j - 1] >> (this.DB + i - k1);
                }
            }
            n = k;
            while ((w & 1) == 0) {
                w >>= 1;
                --n;
            }
            if ((i -= n) < 0) {
                i += this.DB;
                --j;
            }
            if (is1) { // ret == 1, don't bother squaring or multiplying it
                g[w].copyTo(r);
                is1 = false;
            }
            else {
                while (n > 1) {
                    z.sqrTo(r, r2);
                    z.sqrTo(r2, r);
                    n -= 2;
                }
                if (n > 0) {
                    z.sqrTo(r, r2);
                }
                else {
                    t = r;
                    r = r2;
                    r2 = t;
                }
                z.mulTo(r2, g[w], r);
            }
            while (j >= 0 && (e[j] & (1 << i)) == 0) {
                z.sqrTo(r, r2);
                t = r;
                r = r2;
                r2 = t;
                if (--i < 0) {
                    i = this.DB - 1;
                    --j;
                }
            }
        }
        return z.revert(r);
    };
    // BigInteger.prototype.modInverse = bnModInverse;
    // (public) 1/this % m (HAC 14.61)
    BigInteger.prototype.modInverse = function (m) {
        var ac = m.isEven();
        if ((this.isEven() && ac) || m.signum() == 0) {
            return BigInteger.ZERO;
        }
        var u = m.clone();
        var v = this.clone();
        var a = nbv(1);
        var b = nbv(0);
        var c = nbv(0);
        var d = nbv(1);
        while (u.signum() != 0) {
            while (u.isEven()) {
                u.rShiftTo(1, u);
                if (ac) {
                    if (!a.isEven() || !b.isEven()) {
                        a.addTo(this, a);
                        b.subTo(m, b);
                    }
                    a.rShiftTo(1, a);
                }
                else if (!b.isEven()) {
                    b.subTo(m, b);
                }
                b.rShiftTo(1, b);
            }
            while (v.isEven()) {
                v.rShiftTo(1, v);
                if (ac) {
                    if (!c.isEven() || !d.isEven()) {
                        c.addTo(this, c);
                        d.subTo(m, d);
                    }
                    c.rShiftTo(1, c);
                }
                else if (!d.isEven()) {
                    d.subTo(m, d);
                }
                d.rShiftTo(1, d);
            }
            if (u.compareTo(v) >= 0) {
                u.subTo(v, u);
                if (ac) {
                    a.subTo(c, a);
                }
                b.subTo(d, b);
            }
            else {
                v.subTo(u, v);
                if (ac) {
                    c.subTo(a, c);
                }
                d.subTo(b, d);
            }
        }
        if (v.compareTo(BigInteger.ONE) != 0) {
            return BigInteger.ZERO;
        }
        if (d.compareTo(m) >= 0) {
            return d.subtract(m);
        }
        if (d.signum() < 0) {
            d.addTo(m, d);
        }
        else {
            return d;
        }
        if (d.signum() < 0) {
            return d.add(m);
        }
        else {
            return d;
        }
    };
    // BigInteger.prototype.pow = bnPow;
    // (public) this^e
    BigInteger.prototype.pow = function (e) {
        return this.exp(e, new NullExp());
    };
    // BigInteger.prototype.gcd = bnGCD;
    // (public) gcd(this,a) (HAC 14.54)
    BigInteger.prototype.gcd = function (a) {
        var x = (this.s < 0) ? this.negate() : this.clone();
        var y = (a.s < 0) ? a.negate() : a.clone();
        if (x.compareTo(y) < 0) {
            var t = x;
            x = y;
            y = t;
        }
        var i = x.getLowestSetBit();
        var g = y.getLowestSetBit();
        if (g < 0) {
            return x;
        }
        if (i < g) {
            g = i;
        }
        if (g > 0) {
            x.rShiftTo(g, x);
            y.rShiftTo(g, y);
        }
        while (x.signum() > 0) {
            if ((i = x.getLowestSetBit()) > 0) {
                x.rShiftTo(i, x);
            }
            if ((i = y.getLowestSetBit()) > 0) {
                y.rShiftTo(i, y);
            }
            if (x.compareTo(y) >= 0) {
                x.subTo(y, x);
                x.rShiftTo(1, x);
            }
            else {
                y.subTo(x, y);
                y.rShiftTo(1, y);
            }
        }
        if (g > 0) {
            y.lShiftTo(g, y);
        }
        return y;
    };
    // BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
    // (public) test primality with certainty >= 1-.5^t
    BigInteger.prototype.isProbablePrime = function (t) {
        var i;
        var x = this.abs();
        if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
            for (i = 0; i < lowprimes.length; ++i) {
                if (x[0] == lowprimes[i]) {
                    return true;
                }
            }
            return false;
        }
        if (x.isEven()) {
            return false;
        }
        i = 1;
        while (i < lowprimes.length) {
            var m = lowprimes[i];
            var j = i + 1;
            while (j < lowprimes.length && m < lplim) {
                m *= lowprimes[j++];
            }
            m = x.modInt(m);
            while (i < j) {
                if (m % lowprimes[i++] == 0) {
                    return false;
                }
            }
        }
        return x.millerRabin(t);
    };
    //#endregion PUBLIC
    //#region PROTECTED
    // BigInteger.prototype.copyTo = bnpCopyTo;
    // (protected) copy this to r
    BigInteger.prototype.copyTo = function (r) {
        for (var i = this.t - 1; i >= 0; --i) {
            r[i] = this[i];
        }
        r.t = this.t;
        r.s = this.s;
    };
    // BigInteger.prototype.fromInt = bnpFromInt;
    // (protected) set from integer value x, -DV <= x < DV
    BigInteger.prototype.fromInt = function (x) {
        this.t = 1;
        this.s = (x < 0) ? -1 : 0;
        if (x > 0) {
            this[0] = x;
        }
        else if (x < -1) {
            this[0] = x + this.DV;
        }
        else {
            this.t = 0;
        }
    };
    // BigInteger.prototype.fromString = bnpFromString;
    // (protected) set from string and radix
    BigInteger.prototype.fromString = function (s, b) {
        var k;
        if (b == 16) {
            k = 4;
        }
        else if (b == 8) {
            k = 3;
        }
        else if (b == 256) {
            k = 8;
            /* byte array */
        }
        else if (b == 2) {
            k = 1;
        }
        else if (b == 32) {
            k = 5;
        }
        else if (b == 4) {
            k = 2;
        }
        else {
            this.fromRadix(s, b);
            return;
        }
        this.t = 0;
        this.s = 0;
        var i = s.length;
        var mi = false;
        var sh = 0;
        while (--i >= 0) {
            var x = (k == 8) ? (+s[i]) & 0xff : intAt(s, i);
            if (x < 0) {
                if (s.charAt(i) == "-") {
                    mi = true;
                }
                continue;
            }
            mi = false;
            if (sh == 0) {
                this[this.t++] = x;
            }
            else if (sh + k > this.DB) {
                this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
                this[this.t++] = (x >> (this.DB - sh));
            }
            else {
                this[this.t - 1] |= x << sh;
            }
            sh += k;
            if (sh >= this.DB) {
                sh -= this.DB;
            }
        }
        if (k == 8 && ((+s[0]) & 0x80) != 0) {
            this.s = -1;
            if (sh > 0) {
                this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
            }
        }
        this.clamp();
        if (mi) {
            BigInteger.ZERO.subTo(this, this);
        }
    };
    // BigInteger.prototype.clamp = bnpClamp;
    // (protected) clamp off excess high words
    BigInteger.prototype.clamp = function () {
        var c = this.s & this.DM;
        while (this.t > 0 && this[this.t - 1] == c) {
            --this.t;
        }
    };
    // BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
    // (protected) r = this << n*DB
    BigInteger.prototype.dlShiftTo = function (n, r) {
        var i;
        for (i = this.t - 1; i >= 0; --i) {
            r[i + n] = this[i];
        }
        for (i = n - 1; i >= 0; --i) {
            r[i] = 0;
        }
        r.t = this.t + n;
        r.s = this.s;
    };
    // BigInteger.prototype.drShiftTo = bnpDRShiftTo;
    // (protected) r = this >> n*DB
    BigInteger.prototype.drShiftTo = function (n, r) {
        for (var i = n; i < this.t; ++i) {
            r[i - n] = this[i];
        }
        r.t = Math.max(this.t - n, 0);
        r.s = this.s;
    };
    // BigInteger.prototype.lShiftTo = bnpLShiftTo;
    // (protected) r = this << n
    BigInteger.prototype.lShiftTo = function (n, r) {
        var bs = n % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << cbs) - 1;
        var ds = Math.floor(n / this.DB);
        var c = (this.s << bs) & this.DM;
        for (var i = this.t - 1; i >= 0; --i) {
            r[i + ds + 1] = (this[i] >> cbs) | c;
            c = (this[i] & bm) << bs;
        }
        for (var i = ds - 1; i >= 0; --i) {
            r[i] = 0;
        }
        r[ds] = c;
        r.t = this.t + ds + 1;
        r.s = this.s;
        r.clamp();
    };
    // BigInteger.prototype.rShiftTo = bnpRShiftTo;
    // (protected) r = this >> n
    BigInteger.prototype.rShiftTo = function (n, r) {
        r.s = this.s;
        var ds = Math.floor(n / this.DB);
        if (ds >= this.t) {
            r.t = 0;
            return;
        }
        var bs = n % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << bs) - 1;
        r[0] = this[ds] >> bs;
        for (var i = ds + 1; i < this.t; ++i) {
            r[i - ds - 1] |= (this[i] & bm) << cbs;
            r[i - ds] = this[i] >> bs;
        }
        if (bs > 0) {
            r[this.t - ds - 1] |= (this.s & bm) << cbs;
        }
        r.t = this.t - ds;
        r.clamp();
    };
    // BigInteger.prototype.subTo = bnpSubTo;
    // (protected) r = this - a
    BigInteger.prototype.subTo = function (a, r) {
        var i = 0;
        var c = 0;
        var m = Math.min(a.t, this.t);
        while (i < m) {
            c += this[i] - a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
        }
        if (a.t < this.t) {
            c -= a.s;
            while (i < this.t) {
                c += this[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c += this.s;
        }
        else {
            c += this.s;
            while (i < a.t) {
                c -= a[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c -= a.s;
        }
        r.s = (c < 0) ? -1 : 0;
        if (c < -1) {
            r[i++] = this.DV + c;
        }
        else if (c > 0) {
            r[i++] = c;
        }
        r.t = i;
        r.clamp();
    };
    // BigInteger.prototype.multiplyTo = bnpMultiplyTo;
    // (protected) r = this * a, r != this,a (HAC 14.12)
    // "this" should be the larger one if appropriate.
    BigInteger.prototype.multiplyTo = function (a, r) {
        var x = this.abs();
        var y = a.abs();
        var i = x.t;
        r.t = i + y.t;
        while (--i >= 0) {
            r[i] = 0;
        }
        for (i = 0; i < y.t; ++i) {
            r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
        }
        r.s = 0;
        r.clamp();
        if (this.s != a.s) {
            BigInteger.ZERO.subTo(r, r);
        }
    };
    // BigInteger.prototype.squareTo = bnpSquareTo;
    // (protected) r = this^2, r != this (HAC 14.16)
    BigInteger.prototype.squareTo = function (r) {
        var x = this.abs();
        var i = r.t = 2 * x.t;
        while (--i >= 0) {
            r[i] = 0;
        }
        for (i = 0; i < x.t - 1; ++i) {
            var c = x.am(i, x[i], r, 2 * i, 0, 1);
            if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
                r[i + x.t] -= x.DV;
                r[i + x.t + 1] = 1;
            }
        }
        if (r.t > 0) {
            r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
        }
        r.s = 0;
        r.clamp();
    };
    // BigInteger.prototype.divRemTo = bnpDivRemTo;
    // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
    // r != q, this != m.  q or r may be null.
    BigInteger.prototype.divRemTo = function (m, q, r) {
        var pm = m.abs();
        if (pm.t <= 0) {
            return;
        }
        var pt = this.abs();
        if (pt.t < pm.t) {
            if (q != null) {
                q.fromInt(0);
            }
            if (r != null) {
                this.copyTo(r);
            }
            return;
        }
        if (r == null) {
            r = nbi();
        }
        var y = nbi();
        var ts = this.s;
        var ms = m.s;
        var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus
        if (nsh > 0) {
            pm.lShiftTo(nsh, y);
            pt.lShiftTo(nsh, r);
        }
        else {
            pm.copyTo(y);
            pt.copyTo(r);
        }
        var ys = y.t;
        var y0 = y[ys - 1];
        if (y0 == 0) {
            return;
        }
        var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2 : 0);
        var d1 = this.FV / yt;
        var d2 = (1 << this.F1) / yt;
        var e = 1 << this.F2;
        var i = r.t;
        var j = i - ys;
        var t = (q == null) ? nbi() : q;
        y.dlShiftTo(j, t);
        if (r.compareTo(t) >= 0) {
            r[r.t++] = 1;
            r.subTo(t, r);
        }
        BigInteger.ONE.dlShiftTo(ys, t);
        t.subTo(y, y); // "negative" y so we can replace sub with am later
        while (y.t < ys) {
            y[y.t++] = 0;
        }
        while (--j >= 0) {
            // Estimate quotient digit
            var qd = (r[--i] == y0) ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
            if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) { // Try it out
                y.dlShiftTo(j, t);
                r.subTo(t, r);
                while (r[i] < --qd) {
                    r.subTo(t, r);
                }
            }
        }
        if (q != null) {
            r.drShiftTo(ys, q);
            if (ts != ms) {
                BigInteger.ZERO.subTo(q, q);
            }
        }
        r.t = ys;
        r.clamp();
        if (nsh > 0) {
            r.rShiftTo(nsh, r);
        } // Denormalize remainder
        if (ts < 0) {
            BigInteger.ZERO.subTo(r, r);
        }
    };
    // BigInteger.prototype.invDigit = bnpInvDigit;
    // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
    // justification:
    //         xy == 1 (mod m)
    //         xy =  1+km
    //   xy(2-xy) = (1+km)(1-km)
    // x[y(2-xy)] = 1-k^2m^2
    // x[y(2-xy)] == 1 (mod m^2)
    // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
    // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
    // JS multiply "overflows" differently from C/C++, so care is needed here.
    BigInteger.prototype.invDigit = function () {
        if (this.t < 1) {
            return 0;
        }
        var x = this[0];
        if ((x & 1) == 0) {
            return 0;
        }
        var y = x & 3; // y == 1/x mod 2^2
        y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
        y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
        y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
        // last step - calculate inverse mod DV directly;
        // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
        y = (y * (2 - x * y % this.DV)) % this.DV; // y == 1/x mod 2^dbits
        // we really want the negative inverse, and -DV < y < DV
        return (y > 0) ? this.DV - y : -y;
    };
    // BigInteger.prototype.isEven = bnpIsEven;
    // (protected) true iff this is even
    BigInteger.prototype.isEven = function () {
        return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
    };
    // BigInteger.prototype.exp = bnpExp;
    // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
    BigInteger.prototype.exp = function (e, z) {
        if (e > 0xffffffff || e < 1) {
            return BigInteger.ONE;
        }
        var r = nbi();
        var r2 = nbi();
        var g = z.convert(this);
        var i = nbits(e) - 1;
        g.copyTo(r);
        while (--i >= 0) {
            z.sqrTo(r, r2);
            if ((e & (1 << i)) > 0) {
                z.mulTo(r2, g, r);
            }
            else {
                var t = r;
                r = r2;
                r2 = t;
            }
        }
        return z.revert(r);
    };
    // BigInteger.prototype.chunkSize = bnpChunkSize;
    // (protected) return x s.t. r^x < DV
    BigInteger.prototype.chunkSize = function (r) {
        return Math.floor(Math.LN2 * this.DB / Math.log(r));
    };
    // BigInteger.prototype.toRadix = bnpToRadix;
    // (protected) convert to radix string
    BigInteger.prototype.toRadix = function (b) {
        if (b == null) {
            b = 10;
        }
        if (this.signum() == 0 || b < 2 || b > 36) {
            return "0";
        }
        var cs = this.chunkSize(b);
        var a = Math.pow(b, cs);
        var d = nbv(a);
        var y = nbi();
        var z = nbi();
        var r = "";
        this.divRemTo(d, y, z);
        while (y.signum() > 0) {
            r = (a + z.intValue()).toString(b).substr(1) + r;
            y.divRemTo(d, y, z);
        }
        return z.intValue().toString(b) + r;
    };
    // BigInteger.prototype.fromRadix = bnpFromRadix;
    // (protected) convert from radix string
    BigInteger.prototype.fromRadix = function (s, b) {
        this.fromInt(0);
        if (b == null) {
            b = 10;
        }
        var cs = this.chunkSize(b);
        var d = Math.pow(b, cs);
        var mi = false;
        var j = 0;
        var w = 0;
        for (var i = 0; i < s.length; ++i) {
            var x = intAt(s, i);
            if (x < 0) {
                if (s.charAt(i) == "-" && this.signum() == 0) {
                    mi = true;
                }
                continue;
            }
            w = b * w + x;
            if (++j >= cs) {
                this.dMultiply(d);
                this.dAddOffset(w, 0);
                j = 0;
                w = 0;
            }
        }
        if (j > 0) {
            this.dMultiply(Math.pow(b, j));
            this.dAddOffset(w, 0);
        }
        if (mi) {
            BigInteger.ZERO.subTo(this, this);
        }
    };
    // BigInteger.prototype.fromNumber = bnpFromNumber;
    // (protected) alternate constructor
    BigInteger.prototype.fromNumber = function (a, b, c) {
        if ("number" == typeof b) {
            // new BigInteger(int,int,RNG)
            if (a < 2) {
                this.fromInt(1);
            }
            else {
                this.fromNumber(a, c);
                if (!this.testBit(a - 1)) {
                    // force MSB set
                    this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
                }
                if (this.isEven()) {
                    this.dAddOffset(1, 0);
                } // force odd
                while (!this.isProbablePrime(b)) {
                    this.dAddOffset(2, 0);
                    if (this.bitLength() > a) {
                        this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
                    }
                }
            }
        }
        else {
            // new BigInteger(int,RNG)
            var x = [];
            var t = a & 7;
            x.length = (a >> 3) + 1;
            b.nextBytes(x);
            if (t > 0) {
                x[0] &= ((1 << t) - 1);
            }
            else {
                x[0] = 0;
            }
            this.fromString(x, 256);
        }
    };
    // BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
    // (protected) r = this op a (bitwise)
    BigInteger.prototype.bitwiseTo = function (a, op, r) {
        var i;
        var f;
        var m = Math.min(a.t, this.t);
        for (i = 0; i < m; ++i) {
            r[i] = op(this[i], a[i]);
        }
        if (a.t < this.t) {
            f = a.s & this.DM;
            for (i = m; i < this.t; ++i) {
                r[i] = op(this[i], f);
            }
            r.t = this.t;
        }
        else {
            f = this.s & this.DM;
            for (i = m; i < a.t; ++i) {
                r[i] = op(f, a[i]);
            }
            r.t = a.t;
        }
        r.s = op(this.s, a.s);
        r.clamp();
    };
    // BigInteger.prototype.changeBit = bnpChangeBit;
    // (protected) this op (1<<n)
    BigInteger.prototype.changeBit = function (n, op) {
        var r = BigInteger.ONE.shiftLeft(n);
        this.bitwiseTo(r, op, r);
        return r;
    };
    // BigInteger.prototype.addTo = bnpAddTo;
    // (protected) r = this + a
    BigInteger.prototype.addTo = function (a, r) {
        var i = 0;
        var c = 0;
        var m = Math.min(a.t, this.t);
        while (i < m) {
            c += this[i] + a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
        }
        if (a.t < this.t) {
            c += a.s;
            while (i < this.t) {
                c += this[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c += this.s;
        }
        else {
            c += this.s;
            while (i < a.t) {
                c += a[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c += a.s;
        }
        r.s = (c < 0) ? -1 : 0;
        if (c > 0) {
            r[i++] = c;
        }
        else if (c < -1) {
            r[i++] = this.DV + c;
        }
        r.t = i;
        r.clamp();
    };
    // BigInteger.prototype.dMultiply = bnpDMultiply;
    // (protected) this *= n, this >= 0, 1 < n < DV
    BigInteger.prototype.dMultiply = function (n) {
        this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
        ++this.t;
        this.clamp();
    };
    // BigInteger.prototype.dAddOffset = bnpDAddOffset;
    // (protected) this += n << w words, this >= 0
    BigInteger.prototype.dAddOffset = function (n, w) {
        if (n == 0) {
            return;
        }
        while (this.t <= w) {
            this[this.t++] = 0;
        }
        this[w] += n;
        while (this[w] >= this.DV) {
            this[w] -= this.DV;
            if (++w >= this.t) {
                this[this.t++] = 0;
            }
            ++this[w];
        }
    };
    // BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
    // (protected) r = lower n words of "this * a", a.t <= n
    // "this" should be the larger one if appropriate.
    BigInteger.prototype.multiplyLowerTo = function (a, n, r) {
        var i = Math.min(this.t + a.t, n);
        r.s = 0; // assumes a,this >= 0
        r.t = i;
        while (i > 0) {
            r[--i] = 0;
        }
        for (var j = r.t - this.t; i < j; ++i) {
            r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
        }
        for (var j = Math.min(a.t, n); i < j; ++i) {
            this.am(0, a[i], r, i, 0, n - i);
        }
        r.clamp();
    };
    // BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
    // (protected) r = "this * a" without lower n words, n > 0
    // "this" should be the larger one if appropriate.
    BigInteger.prototype.multiplyUpperTo = function (a, n, r) {
        --n;
        var i = r.t = this.t + a.t - n;
        r.s = 0; // assumes a,this >= 0
        while (--i >= 0) {
            r[i] = 0;
        }
        for (i = Math.max(n - this.t, 0); i < a.t; ++i) {
            r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
        }
        r.clamp();
        r.drShiftTo(1, r);
    };
    // BigInteger.prototype.modInt = bnpModInt;
    // (protected) this % n, n < 2^26
    BigInteger.prototype.modInt = function (n) {
        if (n <= 0) {
            return 0;
        }
        var d = this.DV % n;
        var r = (this.s < 0) ? n - 1 : 0;
        if (this.t > 0) {
            if (d == 0) {
                r = this[0] % n;
            }
            else {
                for (var i = this.t - 1; i >= 0; --i) {
                    r = (d * r + this[i]) % n;
                }
            }
        }
        return r;
    };
    // BigInteger.prototype.millerRabin = bnpMillerRabin;
    // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
    BigInteger.prototype.millerRabin = function (t) {
        var n1 = this.subtract(BigInteger.ONE);
        var k = n1.getLowestSetBit();
        if (k <= 0) {
            return false;
        }
        var r = n1.shiftRight(k);
        t = (t + 1) >> 1;
        if (t > lowprimes.length) {
            t = lowprimes.length;
        }
        var a = nbi();
        for (var i = 0; i < t; ++i) {
            // Pick bases at random, instead of starting at 2
            a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
            var y = a.modPow(r, this);
            if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
                var j = 1;
                while (j++ < k && y.compareTo(n1) != 0) {
                    y = y.modPowInt(2, this);
                    if (y.compareTo(BigInteger.ONE) == 0) {
                        return false;
                    }
                }
                if (y.compareTo(n1) != 0) {
                    return false;
                }
            }
        }
        return true;
    };
    // BigInteger.prototype.square = bnSquare;
    // (public) this^2
    BigInteger.prototype.square = function () {
        var r = nbi();
        this.squareTo(r);
        return r;
    };
    //#region ASYNC
    // Public API method
    BigInteger.prototype.gcda = function (a, callback) {
        var x = (this.s < 0) ? this.negate() : this.clone();
        var y = (a.s < 0) ? a.negate() : a.clone();
        if (x.compareTo(y) < 0) {
            var t = x;
            x = y;
            y = t;
        }
        var i = x.getLowestSetBit();
        var g = y.getLowestSetBit();
        if (g < 0) {
            callback(x);
            return;
        }
        if (i < g) {
            g = i;
        }
        if (g > 0) {
            x.rShiftTo(g, x);
            y.rShiftTo(g, y);
        }
        // Workhorse of the algorithm, gets called 200 - 800 times per 512 bit keygen.
        var gcda1 = function () {
            if ((i = x.getLowestSetBit()) > 0) {
                x.rShiftTo(i, x);
            }
            if ((i = y.getLowestSetBit()) > 0) {
                y.rShiftTo(i, y);
            }
            if (x.compareTo(y) >= 0) {
                x.subTo(y, x);
                x.rShiftTo(1, x);
            }
            else {
                y.subTo(x, y);
                y.rShiftTo(1, y);
            }
            if (!(x.signum() > 0)) {
                if (g > 0) {
                    y.lShiftTo(g, y);
                }
                setTimeout(function () { callback(y); }, 0); // escape
            }
            else {
                setTimeout(gcda1, 0);
            }
        };
        setTimeout(gcda1, 10);
    };
    // (protected) alternate constructor
    BigInteger.prototype.fromNumberAsync = function (a, b, c, callback) {
        if ("number" == typeof b) {
            if (a < 2) {
                this.fromInt(1);
            }
            else {
                this.fromNumber(a, c);
                if (!this.testBit(a - 1)) {
                    this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
                }
                if (this.isEven()) {
                    this.dAddOffset(1, 0);
                }
                var bnp_1 = this;
                var bnpfn1_1 = function () {
                    bnp_1.dAddOffset(2, 0);
                    if (bnp_1.bitLength() > a) {
                        bnp_1.subTo(BigInteger.ONE.shiftLeft(a - 1), bnp_1);
                    }
                    if (bnp_1.isProbablePrime(b)) {
                        setTimeout(function () { callback(); }, 0); // escape
                    }
                    else {
                        setTimeout(bnpfn1_1, 0);
                    }
                };
                setTimeout(bnpfn1_1, 0);
            }
        }
        else {
            var x = [];
            var t = a & 7;
            x.length = (a >> 3) + 1;
            b.nextBytes(x);
            if (t > 0) {
                x[0] &= ((1 << t) - 1);
            }
            else {
                x[0] = 0;
            }
            this.fromString(x, 256);
        }
    };
    return BigInteger;
}());

//#region REDUCERS
//#region NullExp
var NullExp = /** @class */ (function () {
    function NullExp() {
    }
    // NullExp.prototype.convert = nNop;
    NullExp.prototype.convert = function (x) {
        return x;
    };
    // NullExp.prototype.revert = nNop;
    NullExp.prototype.revert = function (x) {
        return x;
    };
    // NullExp.prototype.mulTo = nMulTo;
    NullExp.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
    };
    // NullExp.prototype.sqrTo = nSqrTo;
    NullExp.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
    };
    return NullExp;
}());
// Modular reduction using "classic" algorithm
var Classic = /** @class */ (function () {
    function Classic(m) {
        this.m = m;
    }
    // Classic.prototype.convert = cConvert;
    Classic.prototype.convert = function (x) {
        if (x.s < 0 || x.compareTo(this.m) >= 0) {
            return x.mod(this.m);
        }
        else {
            return x;
        }
    };
    // Classic.prototype.revert = cRevert;
    Classic.prototype.revert = function (x) {
        return x;
    };
    // Classic.prototype.reduce = cReduce;
    Classic.prototype.reduce = function (x) {
        x.divRemTo(this.m, null, x);
    };
    // Classic.prototype.mulTo = cMulTo;
    Classic.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    };
    // Classic.prototype.sqrTo = cSqrTo;
    Classic.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
        this.reduce(r);
    };
    return Classic;
}());
//#endregion
//#region Montgomery
// Montgomery reduction
var Montgomery = /** @class */ (function () {
    function Montgomery(m) {
        this.m = m;
        this.mp = m.invDigit();
        this.mpl = this.mp & 0x7fff;
        this.mph = this.mp >> 15;
        this.um = (1 << (m.DB - 15)) - 1;
        this.mt2 = 2 * m.t;
    }
    // Montgomery.prototype.convert = montConvert;
    // xR mod m
    Montgomery.prototype.convert = function (x) {
        var r = nbi();
        x.abs().dlShiftTo(this.m.t, r);
        r.divRemTo(this.m, null, r);
        if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
            this.m.subTo(r, r);
        }
        return r;
    };
    // Montgomery.prototype.revert = montRevert;
    // x/R mod m
    Montgomery.prototype.revert = function (x) {
        var r = nbi();
        x.copyTo(r);
        this.reduce(r);
        return r;
    };
    // Montgomery.prototype.reduce = montReduce;
    // x = x/R mod m (HAC 14.32)
    Montgomery.prototype.reduce = function (x) {
        while (x.t <= this.mt2) {
            // pad x so am has enough room later
            x[x.t++] = 0;
        }
        for (var i = 0; i < this.m.t; ++i) {
            // faster way of calculating u0 = x[i]*mp mod DV
            var j = x[i] & 0x7fff;
            var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
            // use am to combine the multiply-shift-add into one call
            j = i + this.m.t;
            x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
            // propagate carry
            while (x[j] >= x.DV) {
                x[j] -= x.DV;
                x[++j]++;
            }
        }
        x.clamp();
        x.drShiftTo(this.m.t, x);
        if (x.compareTo(this.m) >= 0) {
            x.subTo(this.m, x);
        }
    };
    // Montgomery.prototype.mulTo = montMulTo;
    // r = "xy/R mod m"; x,y != r
    Montgomery.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    };
    // Montgomery.prototype.sqrTo = montSqrTo;
    // r = "x^2/R mod m"; x != r
    Montgomery.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
        this.reduce(r);
    };
    return Montgomery;
}());
//#endregion Montgomery
//#region Barrett
// Barrett modular reduction
var Barrett = /** @class */ (function () {
    function Barrett(m) {
        this.m = m;
        // setup Barrett
        this.r2 = nbi();
        this.q3 = nbi();
        BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
        this.mu = this.r2.divide(m);
    }
    // Barrett.prototype.convert = barrettConvert;
    Barrett.prototype.convert = function (x) {
        if (x.s < 0 || x.t > 2 * this.m.t) {
            return x.mod(this.m);
        }
        else if (x.compareTo(this.m) < 0) {
            return x;
        }
        else {
            var r = nbi();
            x.copyTo(r);
            this.reduce(r);
            return r;
        }
    };
    // Barrett.prototype.revert = barrettRevert;
    Barrett.prototype.revert = function (x) {
        return x;
    };
    // Barrett.prototype.reduce = barrettReduce;
    // x = x mod m (HAC 14.42)
    Barrett.prototype.reduce = function (x) {
        x.drShiftTo(this.m.t - 1, this.r2);
        if (x.t > this.m.t + 1) {
            x.t = this.m.t + 1;
            x.clamp();
        }
        this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
        this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
        while (x.compareTo(this.r2) < 0) {
            x.dAddOffset(1, this.m.t + 1);
        }
        x.subTo(this.r2, x);
        while (x.compareTo(this.m) >= 0) {
            x.subTo(this.m, x);
        }
    };
    // Barrett.prototype.mulTo = barrettMulTo;
    // r = x*y mod m; x,y != r
    Barrett.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    };
    // Barrett.prototype.sqrTo = barrettSqrTo;
    // r = x^2 mod m; x != r
    Barrett.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
        this.reduce(r);
    };
    return Barrett;
}());
//#endregion
//#endregion REDUCERS
// return new, unset BigInteger
function nbi() { return new BigInteger(null); }
function parseBigInt(str, r) {
    return new BigInteger(str, r);
}
// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.
var inBrowser = typeof navigator !== "undefined";
if (inBrowser && j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    // am2 avoids a big mult-and-extract completely.
    // Max digit bits should be <= 30 because we do bitwise ops
    // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
    BigInteger.prototype.am = function am2(i, x, w, j, c, n) {
        var xl = x & 0x7fff;
        var xh = x >> 15;
        while (--n >= 0) {
            var l = this[i] & 0x7fff;
            var h = this[i++] >> 15;
            var m = xh * l + h * xl;
            l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
            c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
            w[j++] = l & 0x3fffffff;
        }
        return c;
    };
    dbits = 30;
}
else if (inBrowser && j_lm && (navigator.appName != "Netscape")) {
    // am1: use a single mult and divide to get the high bits,
    // max digit bits should be 26 because
    // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
    BigInteger.prototype.am = function am1(i, x, w, j, c, n) {
        while (--n >= 0) {
            var v = x * this[i++] + w[j] + c;
            c = Math.floor(v / 0x4000000);
            w[j++] = v & 0x3ffffff;
        }
        return c;
    };
    dbits = 26;
}
else { // Mozilla/Netscape seems to prefer am3
    // Alternately, set max digit bits to 28 since some
    // browsers slow down when dealing with 32-bit numbers.
    BigInteger.prototype.am = function am3(i, x, w, j, c, n) {
        var xl = x & 0x3fff;
        var xh = x >> 14;
        while (--n >= 0) {
            var l = this[i] & 0x3fff;
            var h = this[i++] >> 14;
            var m = xh * l + h * xl;
            l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
            c = (l >> 28) + (m >> 14) + xh * h;
            w[j++] = l & 0xfffffff;
        }
        return c;
    };
    dbits = 28;
}
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1 << dbits) - 1);
BigInteger.prototype.DV = (1 << dbits);
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
// Digit conversions
var BI_RC = [];
var rr;
var vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) {
    BI_RC[rr++] = vv;
}
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) {
    BI_RC[rr++] = vv;
}
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) {
    BI_RC[rr++] = vv;
}
function intAt(s, i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c == null) ? -1 : c;
}
// return bigint initialized to value
function nbv(i) {
    var r = nbi();
    r.fromInt(i);
    return r;
}
// returns bit length of the integer x
function nbits(x) {
    var r = 1;
    var t;
    if ((t = x >>> 16) != 0) {
        x = t;
        r += 16;
    }
    if ((t = x >> 8) != 0) {
        x = t;
        r += 8;
    }
    if ((t = x >> 4) != 0) {
        x = t;
        r += 4;
    }
    if ((t = x >> 2) != 0) {
        x = t;
        r += 2;
    }
    if ((t = x >> 1) != 0) {
        x = t;
        r += 1;
    }
    return r;
}
// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/jsbn/prng4.js
// prng4.js - uses Arcfour as a PRNG
var Arcfour = /** @class */ (function () {
    function Arcfour() {
        this.i = 0;
        this.j = 0;
        this.S = [];
    }
    // Arcfour.prototype.init = ARC4init;
    // Initialize arcfour context from key, an array of ints, each from [0..255]
    Arcfour.prototype.init = function (key) {
        var i;
        var j;
        var t;
        for (i = 0; i < 256; ++i) {
            this.S[i] = i;
        }
        j = 0;
        for (i = 0; i < 256; ++i) {
            j = (j + this.S[i] + key[i % key.length]) & 255;
            t = this.S[i];
            this.S[i] = this.S[j];
            this.S[j] = t;
        }
        this.i = 0;
        this.j = 0;
    };
    // Arcfour.prototype.next = ARC4next;
    Arcfour.prototype.next = function () {
        var t;
        this.i = (this.i + 1) & 255;
        this.j = (this.j + this.S[this.i]) & 255;
        t = this.S[this.i];
        this.S[this.i] = this.S[this.j];
        this.S[this.j] = t;
        return this.S[(t + this.S[this.i]) & 255];
    };
    return Arcfour;
}());

// Plug in your RNG constructor here
function prng_newstate() {
    return new Arcfour();
}
// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;

;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/jsbn/rng.js
// Random number generator - requires a PRNG backend, e.g. prng4.js

var rng_state;
var rng_pool = null;
var rng_pptr;
// Initialize the pool with junk if needed.
if (rng_pool == null) {
    rng_pool = [];
    rng_pptr = 0;
    var t = void 0;
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        // Extract entropy (2048 bits) from RNG if available
        var z = new Uint32Array(256);
        window.crypto.getRandomValues(z);
        for (t = 0; t < z.length; ++t) {
            rng_pool[rng_pptr++] = z[t] & 255;
        }
    }
    // Use mouse events for entropy, if we do not have enough entropy by the time
    // we need it, entropy will be generated by Math.random.
    var count = 0;
    var onMouseMoveListener_1 = function (ev) {
        count = count || 0;
        if (count >= 256 || rng_pptr >= rng_psize) {
            if (window.removeEventListener) {
                window.removeEventListener("mousemove", onMouseMoveListener_1, false);
            }
            else if (window.detachEvent) {
                window.detachEvent("onmousemove", onMouseMoveListener_1);
            }
            return;
        }
        try {
            var mouseCoordinates = ev.x + ev.y;
            rng_pool[rng_pptr++] = mouseCoordinates & 255;
            count += 1;
        }
        catch (e) {
            // Sometimes Firefox will deny permission to access event properties for some reason. Ignore.
        }
    };
    if (typeof window !== 'undefined') {
        if (window.addEventListener) {
            window.addEventListener("mousemove", onMouseMoveListener_1, false);
        }
        else if (window.attachEvent) {
            window.attachEvent("onmousemove", onMouseMoveListener_1);
        }
    }
}
function rng_get_byte() {
    if (rng_state == null) {
        rng_state = prng_newstate();
        // At this point, we may not have collected enough entropy.  If not, fall back to Math.random
        while (rng_pptr < rng_psize) {
            var random = Math.floor(65536 * Math.random());
            rng_pool[rng_pptr++] = random & 255;
        }
        rng_state.init(rng_pool);
        for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) {
            rng_pool[rng_pptr] = 0;
        }
        rng_pptr = 0;
    }
    // TODO: allow reseeding after first request
    return rng_state.next();
}
var SecureRandom = /** @class */ (function () {
    function SecureRandom() {
    }
    SecureRandom.prototype.nextBytes = function (ba) {
        for (var i = 0; i < ba.length; ++i) {
            ba[i] = rng_get_byte();
        }
    };
    return SecureRandom;
}());


;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/jsbn/rsa.js
// Depends on jsbn.js and rng.js
// Version 1.1: support utf-8 encoding in pkcs1pad2
// convert a (hex) string to a bignum object


// function linebrk(s,n) {
//   var ret = "";
//   var i = 0;
//   while(i + n < s.length) {
//     ret += s.substring(i,i+n) + "\n";
//     i += n;
//   }
//   return ret + s.substring(i,s.length);
// }
// function byte2Hex(b) {
//   if(b < 0x10)
//     return "0" + b.toString(16);
//   else
//     return b.toString(16);
// }
function pkcs1pad1(s, n) {
    if (n < s.length + 22) {
        console.error("Message too long for RSA");
        return null;
    }
    var len = n - s.length - 6;
    var filler = "";
    for (var f = 0; f < len; f += 2) {
        filler += "ff";
    }
    var m = "0001" + filler + "00" + s;
    return parseBigInt(m, 16);
}
// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s, n) {
    if (n < s.length + 11) { // TODO: fix for utf-8
        console.error("Message too long for RSA");
        return null;
    }
    var ba = [];
    var i = s.length - 1;
    while (i >= 0 && n > 0) {
        var c = s.charCodeAt(i--);
        if (c < 128) { // encode using utf-8
            ba[--n] = c;
        }
        else if ((c > 127) && (c < 2048)) {
            ba[--n] = (c & 63) | 128;
            ba[--n] = (c >> 6) | 192;
        }
        else {
            ba[--n] = (c & 63) | 128;
            ba[--n] = ((c >> 6) & 63) | 128;
            ba[--n] = (c >> 12) | 224;
        }
    }
    ba[--n] = 0;
    var rng = new SecureRandom();
    var x = [];
    while (n > 2) { // random non-zero pad
        x[0] = 0;
        while (x[0] == 0) {
            rng.nextBytes(x);
        }
        ba[--n] = x[0];
    }
    ba[--n] = 2;
    ba[--n] = 0;
    return new BigInteger(ba);
}
// "empty" RSA key constructor
var rsa_RSAKey = /** @class */ (function () {
    function RSAKey() {
        this.n = null;
        this.e = 0;
        this.d = null;
        this.p = null;
        this.q = null;
        this.dmp1 = null;
        this.dmq1 = null;
        this.coeff = null;
    }
    //#region PROTECTED
    // protected
    // RSAKey.prototype.doPublic = RSADoPublic;
    // Perform raw public operation on "x": return x^e (mod n)
    RSAKey.prototype.doPublic = function (x) {
        return x.modPowInt(this.e, this.n);
    };
    // RSAKey.prototype.doPrivate = RSADoPrivate;
    // Perform raw private operation on "x": return x^d (mod n)
    RSAKey.prototype.doPrivate = function (x) {
        if (this.p == null || this.q == null) {
            return x.modPow(this.d, this.n);
        }
        // TODO: re-calculate any missing CRT params
        var xp = x.mod(this.p).modPow(this.dmp1, this.p);
        var xq = x.mod(this.q).modPow(this.dmq1, this.q);
        while (xp.compareTo(xq) < 0) {
            xp = xp.add(this.p);
        }
        return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
    };
    //#endregion PROTECTED
    //#region PUBLIC
    // RSAKey.prototype.setPublic = RSASetPublic;
    // Set the public key fields N and e from hex strings
    RSAKey.prototype.setPublic = function (N, E) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16);
            this.e = parseInt(E, 16);
        }
        else {
            console.error("Invalid RSA public key");
        }
    };
    // RSAKey.prototype.encrypt = RSAEncrypt;
    // Return the PKCS#1 RSA encryption of "text" as an even-length hex string
    RSAKey.prototype.encrypt = function (text) {
        var maxLength = (this.n.bitLength() + 7) >> 3;
        var m = pkcs1pad2(text, maxLength);
        if (m == null) {
            return null;
        }
        var c = this.doPublic(m);
        if (c == null) {
            return null;
        }
        var h = c.toString(16);
        var length = h.length;
        // fix zero before result
        for (var i = 0; i < maxLength * 2 - length; i++) {
            h = "0" + h;
        }
        return h;
    };
    // RSAKey.prototype.setPrivate = RSASetPrivate;
    // Set the private key fields N, e, and d from hex strings
    RSAKey.prototype.setPrivate = function (N, E, D) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16);
            this.e = parseInt(E, 16);
            this.d = parseBigInt(D, 16);
        }
        else {
            console.error("Invalid RSA private key");
        }
    };
    // RSAKey.prototype.setPrivateEx = RSASetPrivateEx;
    // Set the private key fields N, e, d and CRT params from hex strings
    RSAKey.prototype.setPrivateEx = function (N, E, D, P, Q, DP, DQ, C) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16);
            this.e = parseInt(E, 16);
            this.d = parseBigInt(D, 16);
            this.p = parseBigInt(P, 16);
            this.q = parseBigInt(Q, 16);
            this.dmp1 = parseBigInt(DP, 16);
            this.dmq1 = parseBigInt(DQ, 16);
            this.coeff = parseBigInt(C, 16);
        }
        else {
            console.error("Invalid RSA private key");
        }
    };
    // RSAKey.prototype.generate = RSAGenerate;
    // Generate a new random private key B bits long, using public expt E
    RSAKey.prototype.generate = function (B, E) {
        var rng = new SecureRandom();
        var qs = B >> 1;
        this.e = parseInt(E, 16);
        var ee = new BigInteger(E, 16);
        for (;;) {
            for (;;) {
                this.p = new BigInteger(B - qs, 1, rng);
                if (this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) {
                    break;
                }
            }
            for (;;) {
                this.q = new BigInteger(qs, 1, rng);
                if (this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) {
                    break;
                }
            }
            if (this.p.compareTo(this.q) <= 0) {
                var t = this.p;
                this.p = this.q;
                this.q = t;
            }
            var p1 = this.p.subtract(BigInteger.ONE);
            var q1 = this.q.subtract(BigInteger.ONE);
            var phi = p1.multiply(q1);
            if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
                this.n = this.p.multiply(this.q);
                this.d = ee.modInverse(phi);
                this.dmp1 = this.d.mod(p1);
                this.dmq1 = this.d.mod(q1);
                this.coeff = this.q.modInverse(this.p);
                break;
            }
        }
    };
    // RSAKey.prototype.decrypt = RSADecrypt;
    // Return the PKCS#1 RSA decryption of "ctext".
    // "ctext" is an even-length hex string and the output is a plain string.
    RSAKey.prototype.decrypt = function (ctext) {
        var c = parseBigInt(ctext, 16);
        var m = this.doPrivate(c);
        if (m == null) {
            return null;
        }
        return pkcs1unpad2(m, (this.n.bitLength() + 7) >> 3);
    };
    // Generate a new random private key B bits long, using public expt E
    RSAKey.prototype.generateAsync = function (B, E, callback) {
        var rng = new SecureRandom();
        var qs = B >> 1;
        this.e = parseInt(E, 16);
        var ee = new BigInteger(E, 16);
        var rsa = this;
        // These functions have non-descript names because they were originally for(;;) loops.
        // I don't know about cryptography to give them better names than loop1-4.
        var loop1 = function () {
            var loop4 = function () {
                if (rsa.p.compareTo(rsa.q) <= 0) {
                    var t = rsa.p;
                    rsa.p = rsa.q;
                    rsa.q = t;
                }
                var p1 = rsa.p.subtract(BigInteger.ONE);
                var q1 = rsa.q.subtract(BigInteger.ONE);
                var phi = p1.multiply(q1);
                if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
                    rsa.n = rsa.p.multiply(rsa.q);
                    rsa.d = ee.modInverse(phi);
                    rsa.dmp1 = rsa.d.mod(p1);
                    rsa.dmq1 = rsa.d.mod(q1);
                    rsa.coeff = rsa.q.modInverse(rsa.p);
                    setTimeout(function () { callback(); }, 0); // escape
                }
                else {
                    setTimeout(loop1, 0);
                }
            };
            var loop3 = function () {
                rsa.q = nbi();
                rsa.q.fromNumberAsync(qs, 1, rng, function () {
                    rsa.q.subtract(BigInteger.ONE).gcda(ee, function (r) {
                        if (r.compareTo(BigInteger.ONE) == 0 && rsa.q.isProbablePrime(10)) {
                            setTimeout(loop4, 0);
                        }
                        else {
                            setTimeout(loop3, 0);
                        }
                    });
                });
            };
            var loop2 = function () {
                rsa.p = nbi();
                rsa.p.fromNumberAsync(B - qs, 1, rng, function () {
                    rsa.p.subtract(BigInteger.ONE).gcda(ee, function (r) {
                        if (r.compareTo(BigInteger.ONE) == 0 && rsa.p.isProbablePrime(10)) {
                            setTimeout(loop3, 0);
                        }
                        else {
                            setTimeout(loop2, 0);
                        }
                    });
                });
            };
            setTimeout(loop2, 0);
        };
        setTimeout(loop1, 0);
    };
    RSAKey.prototype.sign = function (text, digestMethod, digestName) {
        var header = getDigestHeader(digestName);
        var digest = header + digestMethod(text).toString();
        var m = pkcs1pad1(digest, this.n.bitLength() / 4);
        if (m == null) {
            return null;
        }
        var c = this.doPrivate(m);
        if (c == null) {
            return null;
        }
        var h = c.toString(16);
        if ((h.length & 1) == 0) {
            return h;
        }
        else {
            return "0" + h;
        }
    };
    RSAKey.prototype.verify = function (text, signature, digestMethod) {
        var c = parseBigInt(signature, 16);
        var m = this.doPublic(c);
        if (m == null) {
            return null;
        }
        var unpadded = m.toString(16).replace(/^1f+00/, "");
        var digest = removeDigestHeader(unpadded);
        return digest == digestMethod(text).toString();
    };
    return RSAKey;
}());

// Undo PKCS#1 (type 2, random) padding and, if valid, return the plaintext
function pkcs1unpad2(d, n) {
    var b = d.toByteArray();
    var i = 0;
    while (i < b.length && b[i] == 0) {
        ++i;
    }
    if (b.length - i != n - 1 || b[i] != 2) {
        return null;
    }
    ++i;
    while (b[i] != 0) {
        if (++i >= b.length) {
            return null;
        }
    }
    var ret = "";
    while (++i < b.length) {
        var c = b[i] & 255;
        if (c < 128) { // utf-8 decode
            ret += String.fromCharCode(c);
        }
        else if ((c > 191) && (c < 224)) {
            ret += String.fromCharCode(((c & 31) << 6) | (b[i + 1] & 63));
            ++i;
        }
        else {
            ret += String.fromCharCode(((c & 15) << 12) | ((b[i + 1] & 63) << 6) | (b[i + 2] & 63));
            i += 2;
        }
    }
    return ret;
}
// https://tools.ietf.org/html/rfc3447#page-43
var DIGEST_HEADERS = {
    md2: "3020300c06082a864886f70d020205000410",
    md5: "3020300c06082a864886f70d020505000410",
    sha1: "3021300906052b0e03021a05000414",
    sha224: "302d300d06096086480165030402040500041c",
    sha256: "3031300d060960864801650304020105000420",
    sha384: "3041300d060960864801650304020205000430",
    sha512: "3051300d060960864801650304020305000440",
    ripemd160: "3021300906052b2403020105000414"
};
function getDigestHeader(name) {
    return DIGEST_HEADERS[name] || "";
}
function removeDigestHeader(str) {
    for (var name_1 in DIGEST_HEADERS) {
        if (DIGEST_HEADERS.hasOwnProperty(name_1)) {
            var header = DIGEST_HEADERS[name_1];
            var len = header.length;
            if (str.substr(0, len) == header) {
                return str.substr(len);
            }
        }
    }
    return str;
}
// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
// function RSAEncryptB64(text) {
//  var h = this.encrypt(text);
//  if(h) return hex2b64(h); else return null;
// }
// public
// RSAKey.prototype.encrypt_b64 = RSAEncryptB64;

;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/jsrsasign/yahoo.js
/*!
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.9.0
*/
var YAHOO = {};
YAHOO.lang = {
    /**
     * Utility to set up the prototype, constructor and superclass properties to
     * support an inheritance strategy that can chain constructors and methods.
     * Static members will not be inherited.
     *
     * @method extend
     * @static
     * @param {Function} subc   the object to modify
     * @param {Function} superc the object to inherit
     * @param {Object} overrides  additional properties/methods to add to the
     *                              subclass prototype.  These will override the
     *                              matching items obtained from the superclass
     *                              if present.
     */
    extend: function (subc, superc, overrides) {
        if (!superc || !subc) {
            throw new Error("YAHOO.lang.extend failed, please check that " +
                "all dependencies are included.");
        }
        var F = function () { };
        F.prototype = superc.prototype;
        subc.prototype = new F();
        subc.prototype.constructor = subc;
        subc.superclass = superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor = superc;
        }
        if (overrides) {
            var i;
            for (i in overrides) {
                subc.prototype[i] = overrides[i];
            }
            /*
             * IE will not enumerate native functions in a derived object even if the
             * function was overridden.  This is a workaround for specific functions
             * we care about on the Object prototype.
             * @property _IEEnumFix
             * @param {Function} r  the object to receive the augmentation
             * @param {Function} s  the object that supplies the properties to augment
             * @static
             * @private
             */
            var _IEEnumFix = function () { }, ADD = ["toString", "valueOf"];
            try {
                if (/MSIE/.test(navigator.userAgent)) {
                    _IEEnumFix = function (r, s) {
                        for (i = 0; i < ADD.length; i = i + 1) {
                            var fname = ADD[i], f = s[fname];
                            if (typeof f === 'function' && f != Object.prototype[fname]) {
                                r[fname] = f;
                            }
                        }
                    };
                }
            }
            catch (ex) { }
            ;
            _IEEnumFix(subc.prototype, overrides);
        }
    }
};

;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/jsrsasign/asn1-1.0.js
/* asn1-1.0.13.js (c) 2013-2017 Kenji Urushima | kjur.github.com/jsrsasign/license
 */
/*
 * asn1.js - ASN.1 DER encoder classes
 *
 * Copyright (c) 2013-2017 Kenji Urushima (kenji.urushima@gmail.com)
 *
 * This software is licensed under the terms of the MIT License.
 * https://kjur.github.io/jsrsasign/license
 *
 * The above copyright and license notice shall be
 * included in all copies or substantial portions of the Software.
 */


/**
 * @fileOverview
 * @name asn1-1.0.js
 * @author Kenji Urushima kenji.urushima@gmail.com
 * @version asn1 1.0.13 (2017-Jun-02)
 * @since jsrsasign 2.1
 * @license <a href="https://kjur.github.io/jsrsasign/license/">MIT License</a>
 */
/**
 * kjur's class library name space
 * <p>
 * This name space provides following name spaces:
 * <ul>
 * <li>{@link KJUR.asn1} - ASN.1 primitive hexadecimal encoder</li>
 * <li>{@link KJUR.asn1.x509} - ASN.1 structure for X.509 certificate and CRL</li>
 * <li>{@link KJUR.crypto} - Java Cryptographic Extension(JCE) style MessageDigest/Signature
 * class and utilities</li>
 * </ul>
 * </p>
 * NOTE: Please ignore method summary and document of this namespace. This caused by a bug of jsdoc2.
 * @name KJUR
 * @namespace kjur's class library name space
 */
var KJUR = {};
/**
 * kjur's ASN.1 class library name space
 * <p>
 * This is ITU-T X.690 ASN.1 DER encoder class library and
 * class structure and methods is very similar to
 * org.bouncycastle.asn1 package of
 * well known BouncyCaslte Cryptography Library.
 * <h4>PROVIDING ASN.1 PRIMITIVES</h4>
 * Here are ASN.1 DER primitive classes.
 * <ul>
 * <li>0x01 {@link KJUR.asn1.DERBoolean}</li>
 * <li>0x02 {@link KJUR.asn1.DERInteger}</li>
 * <li>0x03 {@link KJUR.asn1.DERBitString}</li>
 * <li>0x04 {@link KJUR.asn1.DEROctetString}</li>
 * <li>0x05 {@link KJUR.asn1.DERNull}</li>
 * <li>0x06 {@link KJUR.asn1.DERObjectIdentifier}</li>
 * <li>0x0a {@link KJUR.asn1.DEREnumerated}</li>
 * <li>0x0c {@link KJUR.asn1.DERUTF8String}</li>
 * <li>0x12 {@link KJUR.asn1.DERNumericString}</li>
 * <li>0x13 {@link KJUR.asn1.DERPrintableString}</li>
 * <li>0x14 {@link KJUR.asn1.DERTeletexString}</li>
 * <li>0x16 {@link KJUR.asn1.DERIA5String}</li>
 * <li>0x17 {@link KJUR.asn1.DERUTCTime}</li>
 * <li>0x18 {@link KJUR.asn1.DERGeneralizedTime}</li>
 * <li>0x30 {@link KJUR.asn1.DERSequence}</li>
 * <li>0x31 {@link KJUR.asn1.DERSet}</li>
 * </ul>
 * <h4>OTHER ASN.1 CLASSES</h4>
 * <ul>
 * <li>{@link KJUR.asn1.ASN1Object}</li>
 * <li>{@link KJUR.asn1.DERAbstractString}</li>
 * <li>{@link KJUR.asn1.DERAbstractTime}</li>
 * <li>{@link KJUR.asn1.DERAbstractStructured}</li>
 * <li>{@link KJUR.asn1.DERTaggedObject}</li>
 * </ul>
 * <h4>SUB NAME SPACES</h4>
 * <ul>
 * <li>{@link KJUR.asn1.cades} - CAdES long term signature format</li>
 * <li>{@link KJUR.asn1.cms} - Cryptographic Message Syntax</li>
 * <li>{@link KJUR.asn1.csr} - Certificate Signing Request (CSR/PKCS#10)</li>
 * <li>{@link KJUR.asn1.tsp} - RFC 3161 Timestamping Protocol Format</li>
 * <li>{@link KJUR.asn1.x509} - RFC 5280 X.509 certificate and CRL</li>
 * </ul>
 * </p>
 * NOTE: Please ignore method summary and document of this namespace.
 * This caused by a bug of jsdoc2.
 * @name KJUR.asn1
 * @namespace
 */
if (typeof KJUR.asn1 == "undefined" || !KJUR.asn1)
    KJUR.asn1 = {};
/**
 * ASN1 utilities class
 * @name KJUR.asn1.ASN1Util
 * @class ASN1 utilities class
 * @since asn1 1.0.2
 */
KJUR.asn1.ASN1Util = new function () {
    this.integerToByteHex = function (i) {
        var h = i.toString(16);
        if ((h.length % 2) == 1)
            h = '0' + h;
        return h;
    };
    this.bigIntToMinTwosComplementsHex = function (bigIntegerValue) {
        var h = bigIntegerValue.toString(16);
        if (h.substr(0, 1) != '-') {
            if (h.length % 2 == 1) {
                h = '0' + h;
            }
            else {
                if (!h.match(/^[0-7]/)) {
                    h = '00' + h;
                }
            }
        }
        else {
            var hPos = h.substr(1);
            var xorLen = hPos.length;
            if (xorLen % 2 == 1) {
                xorLen += 1;
            }
            else {
                if (!h.match(/^[0-7]/)) {
                    xorLen += 2;
                }
            }
            var hMask = '';
            for (var i = 0; i < xorLen; i++) {
                hMask += 'f';
            }
            var biMask = new BigInteger(hMask, 16);
            var biNeg = biMask.xor(bigIntegerValue).add(BigInteger.ONE);
            h = biNeg.toString(16).replace(/^-/, '');
        }
        return h;
    };
    /**
     * get PEM string from hexadecimal data and header string
     * @name getPEMStringFromHex
     * @memberOf KJUR.asn1.ASN1Util
     * @function
     * @param {String} dataHex hexadecimal string of PEM body
     * @param {String} pemHeader PEM header string (ex. 'RSA PRIVATE KEY')
     * @return {String} PEM formatted string of input data
     * @description
     * This method converts a hexadecimal string to a PEM string with
     * a specified header. Its line break will be CRLF("\r\n").
     * @example
     * var pem  = KJUR.asn1.ASN1Util.getPEMStringFromHex('616161', 'RSA PRIVATE KEY');
     * // value of pem will be:
     * -----BEGIN PRIVATE KEY-----
     * YWFh
     * -----END PRIVATE KEY-----
     */
    this.getPEMStringFromHex = function (dataHex, pemHeader) {
        return hextopem(dataHex, pemHeader);
    };
    /**
     * generate ASN1Object specifed by JSON parameters
     * @name newObject
     * @memberOf KJUR.asn1.ASN1Util
     * @function
     * @param {Array} param JSON parameter to generate ASN1Object
     * @return {KJUR.asn1.ASN1Object} generated object
     * @since asn1 1.0.3
     * @description
     * generate any ASN1Object specified by JSON param
     * including ASN.1 primitive or structured.
     * Generally 'param' can be described as follows:
     * <blockquote>
     * {TYPE-OF-ASNOBJ: ASN1OBJ-PARAMETER}
     * </blockquote>
     * 'TYPE-OF-ASN1OBJ' can be one of following symbols:
     * <ul>
     * <li>'bool' - DERBoolean</li>
     * <li>'int' - DERInteger</li>
     * <li>'bitstr' - DERBitString</li>
     * <li>'octstr' - DEROctetString</li>
     * <li>'null' - DERNull</li>
     * <li>'oid' - DERObjectIdentifier</li>
     * <li>'enum' - DEREnumerated</li>
     * <li>'utf8str' - DERUTF8String</li>
     * <li>'numstr' - DERNumericString</li>
     * <li>'prnstr' - DERPrintableString</li>
     * <li>'telstr' - DERTeletexString</li>
     * <li>'ia5str' - DERIA5String</li>
     * <li>'utctime' - DERUTCTime</li>
     * <li>'gentime' - DERGeneralizedTime</li>
     * <li>'seq' - DERSequence</li>
     * <li>'set' - DERSet</li>
     * <li>'tag' - DERTaggedObject</li>
     * </ul>
     * @example
     * newObject({'prnstr': 'aaa'});
     * newObject({'seq': [{'int': 3}, {'prnstr': 'aaa'}]})
     * // ASN.1 Tagged Object
     * newObject({'tag': {'tag': 'a1',
     *                    'explicit': true,
     *                    'obj': {'seq': [{'int': 3}, {'prnstr': 'aaa'}]}}});
     * // more simple representation of ASN.1 Tagged Object
     * newObject({'tag': ['a1',
     *                    true,
     *                    {'seq': [
     *                      {'int': 3},
     *                      {'prnstr': 'aaa'}]}
     *                   ]});
     */
    this.newObject = function (param) {
        var _KJUR = KJUR, _KJUR_asn1 = _KJUR.asn1, _DERBoolean = _KJUR_asn1.DERBoolean, _DERInteger = _KJUR_asn1.DERInteger, _DERBitString = _KJUR_asn1.DERBitString, _DEROctetString = _KJUR_asn1.DEROctetString, _DERNull = _KJUR_asn1.DERNull, _DERObjectIdentifier = _KJUR_asn1.DERObjectIdentifier, _DEREnumerated = _KJUR_asn1.DEREnumerated, _DERUTF8String = _KJUR_asn1.DERUTF8String, _DERNumericString = _KJUR_asn1.DERNumericString, _DERPrintableString = _KJUR_asn1.DERPrintableString, _DERTeletexString = _KJUR_asn1.DERTeletexString, _DERIA5String = _KJUR_asn1.DERIA5String, _DERUTCTime = _KJUR_asn1.DERUTCTime, _DERGeneralizedTime = _KJUR_asn1.DERGeneralizedTime, _DERSequence = _KJUR_asn1.DERSequence, _DERSet = _KJUR_asn1.DERSet, _DERTaggedObject = _KJUR_asn1.DERTaggedObject, _newObject = _KJUR_asn1.ASN1Util.newObject;
        var keys = Object.keys(param);
        if (keys.length != 1)
            throw "key of param shall be only one.";
        var key = keys[0];
        if (":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":" + key + ":") == -1)
            throw "undefined key: " + key;
        if (key == "bool")
            return new _DERBoolean(param[key]);
        if (key == "int")
            return new _DERInteger(param[key]);
        if (key == "bitstr")
            return new _DERBitString(param[key]);
        if (key == "octstr")
            return new _DEROctetString(param[key]);
        if (key == "null")
            return new _DERNull(param[key]);
        if (key == "oid")
            return new _DERObjectIdentifier(param[key]);
        if (key == "enum")
            return new _DEREnumerated(param[key]);
        if (key == "utf8str")
            return new _DERUTF8String(param[key]);
        if (key == "numstr")
            return new _DERNumericString(param[key]);
        if (key == "prnstr")
            return new _DERPrintableString(param[key]);
        if (key == "telstr")
            return new _DERTeletexString(param[key]);
        if (key == "ia5str")
            return new _DERIA5String(param[key]);
        if (key == "utctime")
            return new _DERUTCTime(param[key]);
        if (key == "gentime")
            return new _DERGeneralizedTime(param[key]);
        if (key == "seq") {
            var paramList = param[key];
            var a = [];
            for (var i = 0; i < paramList.length; i++) {
                var asn1Obj = _newObject(paramList[i]);
                a.push(asn1Obj);
            }
            return new _DERSequence({ 'array': a });
        }
        if (key == "set") {
            var paramList = param[key];
            var a = [];
            for (var i = 0; i < paramList.length; i++) {
                var asn1Obj = _newObject(paramList[i]);
                a.push(asn1Obj);
            }
            return new _DERSet({ 'array': a });
        }
        if (key == "tag") {
            var tagParam = param[key];
            if (Object.prototype.toString.call(tagParam) === '[object Array]' &&
                tagParam.length == 3) {
                var obj = _newObject(tagParam[2]);
                return new _DERTaggedObject({ tag: tagParam[0],
                    explicit: tagParam[1],
                    obj: obj });
            }
            else {
                var newParam = {};
                if (tagParam.explicit !== undefined)
                    newParam.explicit = tagParam.explicit;
                if (tagParam.tag !== undefined)
                    newParam.tag = tagParam.tag;
                if (tagParam.obj === undefined)
                    throw "obj shall be specified for 'tag'.";
                newParam.obj = _newObject(tagParam.obj);
                return new _DERTaggedObject(newParam);
            }
        }
    };
    /**
     * get encoded hexadecimal string of ASN1Object specifed by JSON parameters
     * @name jsonToASN1HEX
     * @memberOf KJUR.asn1.ASN1Util
     * @function
     * @param {Array} param JSON parameter to generate ASN1Object
     * @return hexadecimal string of ASN1Object
     * @since asn1 1.0.4
     * @description
     * As for ASN.1 object representation of JSON object,
     * please see {@link newObject}.
     * @example
     * jsonToASN1HEX({'prnstr': 'aaa'});
     */
    this.jsonToASN1HEX = function (param) {
        var asn1Obj = this.newObject(param);
        return asn1Obj.getEncodedHex();
    };
};
/**
 * get dot noted oid number string from hexadecimal value of OID
 * @name oidHexToInt
 * @memberOf KJUR.asn1.ASN1Util
 * @function
 * @param {String} hex hexadecimal value of object identifier
 * @return {String} dot noted string of object identifier
 * @since jsrsasign 4.8.3 asn1 1.0.7
 * @description
 * This static method converts from hexadecimal string representation of
 * ASN.1 value of object identifier to oid number string.
 * @example
 * KJUR.asn1.ASN1Util.oidHexToInt('550406') &rarr; "2.5.4.6"
 */
KJUR.asn1.ASN1Util.oidHexToInt = function (hex) {
    var s = "";
    var i01 = parseInt(hex.substr(0, 2), 16);
    var i0 = Math.floor(i01 / 40);
    var i1 = i01 % 40;
    var s = i0 + "." + i1;
    var binbuf = "";
    for (var i = 2; i < hex.length; i += 2) {
        var value = parseInt(hex.substr(i, 2), 16);
        var bin = ("00000000" + value.toString(2)).slice(-8);
        binbuf = binbuf + bin.substr(1, 7);
        if (bin.substr(0, 1) == "0") {
            var bi = new BigInteger(binbuf, 2);
            s = s + "." + bi.toString(10);
            binbuf = "";
        }
    }
    ;
    return s;
};
/**
 * get hexadecimal value of object identifier from dot noted oid value
 * @name oidIntToHex
 * @memberOf KJUR.asn1.ASN1Util
 * @function
 * @param {String} oidString dot noted string of object identifier
 * @return {String} hexadecimal value of object identifier
 * @since jsrsasign 4.8.3 asn1 1.0.7
 * @description
 * This static method converts from object identifier value string.
 * to hexadecimal string representation of it.
 * @example
 * KJUR.asn1.ASN1Util.oidIntToHex("2.5.4.6") &rarr; "550406"
 */
KJUR.asn1.ASN1Util.oidIntToHex = function (oidString) {
    var itox = function (i) {
        var h = i.toString(16);
        if (h.length == 1)
            h = '0' + h;
        return h;
    };
    var roidtox = function (roid) {
        var h = '';
        var bi = new BigInteger(roid, 10);
        var b = bi.toString(2);
        var padLen = 7 - b.length % 7;
        if (padLen == 7)
            padLen = 0;
        var bPad = '';
        for (var i = 0; i < padLen; i++)
            bPad += '0';
        b = bPad + b;
        for (var i = 0; i < b.length - 1; i += 7) {
            var b8 = b.substr(i, 7);
            if (i != b.length - 7)
                b8 = '1' + b8;
            h += itox(parseInt(b8, 2));
        }
        return h;
    };
    if (!oidString.match(/^[0-9.]+$/)) {
        throw "malformed oid string: " + oidString;
    }
    var h = '';
    var a = oidString.split('.');
    var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
    h += itox(i0);
    a.splice(0, 2);
    for (var i = 0; i < a.length; i++) {
        h += roidtox(a[i]);
    }
    return h;
};
// ********************************************************************
//  Abstract ASN.1 Classes
// ********************************************************************
// ********************************************************************
/**
 * base class for ASN.1 DER encoder object
 * @name KJUR.asn1.ASN1Object
 * @class base class for ASN.1 DER encoder object
 * @property {Boolean} isModified flag whether internal data was changed
 * @property {String} hTLV hexadecimal string of ASN.1 TLV
 * @property {String} hT hexadecimal string of ASN.1 TLV tag(T)
 * @property {String} hL hexadecimal string of ASN.1 TLV length(L)
 * @property {String} hV hexadecimal string of ASN.1 TLV value(V)
 * @description
 */
KJUR.asn1.ASN1Object = function () {
    var isModified = true;
    var hTLV = null;
    var hT = '00';
    var hL = '00';
    var hV = '';
    /**
     * get hexadecimal ASN.1 TLV length(L) bytes from TLV value(V)
     * @name getLengthHexFromValue
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV length(L)
     */
    this.getLengthHexFromValue = function () {
        if (typeof this.hV == "undefined" || this.hV == null) {
            throw "this.hV is null or undefined.";
        }
        if (this.hV.length % 2 == 1) {
            throw "value hex must be even length: n=" + hV.length + ",v=" + this.hV;
        }
        var n = this.hV.length / 2;
        var hN = n.toString(16);
        if (hN.length % 2 == 1) {
            hN = "0" + hN;
        }
        if (n < 128) {
            return hN;
        }
        else {
            var hNlen = hN.length / 2;
            if (hNlen > 15) {
                throw "ASN.1 length too long to represent by 8x: n = " + n.toString(16);
            }
            var head = 128 + hNlen;
            return head.toString(16) + hN;
        }
    };
    /**
     * get hexadecimal string of ASN.1 TLV bytes
     * @name getEncodedHex
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV
     */
    this.getEncodedHex = function () {
        if (this.hTLV == null || this.isModified) {
            this.hV = this.getFreshValueHex();
            this.hL = this.getLengthHexFromValue();
            this.hTLV = this.hT + this.hL + this.hV;
            this.isModified = false;
            //alert("first time: " + this.hTLV);
        }
        return this.hTLV;
    };
    /**
     * get hexadecimal string of ASN.1 TLV value(V) bytes
     * @name getValueHex
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV value(V) bytes
     */
    this.getValueHex = function () {
        this.getEncodedHex();
        return this.hV;
    };
    this.getFreshValueHex = function () {
        return '';
    };
};
// == BEGIN DERAbstractString ================================================
/**
 * base class for ASN.1 DER string classes
 * @name KJUR.asn1.DERAbstractString
 * @class base class for ASN.1 DER string classes
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @property {String} s internal string of value
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERAbstractString = function (params) {
    KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
    var s = null;
    var hV = null;
    /**
     * get string value of this string object
     * @name getString
     * @memberOf KJUR.asn1.DERAbstractString#
     * @function
     * @return {String} string value of this string object
     */
    this.getString = function () {
        return this.s;
    };
    /**
     * set value by a string
     * @name setString
     * @memberOf KJUR.asn1.DERAbstractString#
     * @function
     * @param {String} newS value by a string to set
     */
    this.setString = function (newS) {
        this.hTLV = null;
        this.isModified = true;
        this.s = newS;
        this.hV = stohex(this.s);
    };
    /**
     * set value by a hexadecimal string
     * @name setStringHex
     * @memberOf KJUR.asn1.DERAbstractString#
     * @function
     * @param {String} newHexString value by a hexadecimal string to set
     */
    this.setStringHex = function (newHexString) {
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = newHexString;
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
    if (typeof params != "undefined") {
        if (typeof params == "string") {
            this.setString(params);
        }
        else if (typeof params['str'] != "undefined") {
            this.setString(params['str']);
        }
        else if (typeof params['hex'] != "undefined") {
            this.setStringHex(params['hex']);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERAbstractString, KJUR.asn1.ASN1Object);
// == END   DERAbstractString ================================================
// == BEGIN DERAbstractTime ==================================================
/**
 * base class for ASN.1 DER Generalized/UTCTime class
 * @name KJUR.asn1.DERAbstractTime
 * @class base class for ASN.1 DER Generalized/UTCTime class
 * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERAbstractTime = function (params) {
    KJUR.asn1.DERAbstractTime.superclass.constructor.call(this);
    var s = null;
    var date = null;
    // --- PRIVATE METHODS --------------------
    this.localDateToUTC = function (d) {
        utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var utcDate = new Date(utc);
        return utcDate;
    };
    /*
     * format date string by Data object
     * @name formatDate
     * @memberOf KJUR.asn1.AbstractTime;
     * @param {Date} dateObject
     * @param {string} type 'utc' or 'gen'
     * @param {boolean} withMillis flag for with millisections or not
     * @description
     * 'withMillis' flag is supported from asn1 1.0.6.
     */
    this.formatDate = function (dateObject, type, withMillis) {
        var pad = this.zeroPadding;
        var d = this.localDateToUTC(dateObject);
        var year = String(d.getFullYear());
        if (type == 'utc')
            year = year.substr(2, 2);
        var month = pad(String(d.getMonth() + 1), 2);
        var day = pad(String(d.getDate()), 2);
        var hour = pad(String(d.getHours()), 2);
        var min = pad(String(d.getMinutes()), 2);
        var sec = pad(String(d.getSeconds()), 2);
        var s = year + month + day + hour + min + sec;
        if (withMillis === true) {
            var millis = d.getMilliseconds();
            if (millis != 0) {
                var sMillis = pad(String(millis), 3);
                sMillis = sMillis.replace(/[0]+$/, "");
                s = s + "." + sMillis;
            }
        }
        return s + "Z";
    };
    this.zeroPadding = function (s, len) {
        if (s.length >= len)
            return s;
        return new Array(len - s.length + 1).join('0') + s;
    };
    // --- PUBLIC METHODS --------------------
    /**
     * get string value of this string object
     * @name getString
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @return {String} string value of this time object
     */
    this.getString = function () {
        return this.s;
    };
    /**
     * set value by a string
     * @name setString
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @param {String} newS value by a string to set such like "130430235959Z"
     */
    this.setString = function (newS) {
        this.hTLV = null;
        this.isModified = true;
        this.s = newS;
        this.hV = stohex(newS);
    };
    /**
     * set value by a Date object
     * @name setByDateValue
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @param {Integer} year year of date (ex. 2013)
     * @param {Integer} month month of date between 1 and 12 (ex. 12)
     * @param {Integer} day day of month
     * @param {Integer} hour hours of date
     * @param {Integer} min minutes of date
     * @param {Integer} sec seconds of date
     */
    this.setByDateValue = function (year, month, day, hour, min, sec) {
        var dateObject = new Date(Date.UTC(year, month - 1, day, hour, min, sec, 0));
        this.setByDate(dateObject);
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
};
YAHOO.lang.extend(KJUR.asn1.DERAbstractTime, KJUR.asn1.ASN1Object);
// == END   DERAbstractTime ==================================================
// == BEGIN DERAbstractStructured ============================================
/**
 * base class for ASN.1 DER structured class
 * @name KJUR.asn1.DERAbstractStructured
 * @class base class for ASN.1 DER structured class
 * @property {Array} asn1Array internal array of ASN1Object
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERAbstractStructured = function (params) {
    KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
    var asn1Array = null;
    /**
     * set value by array of ASN1Object
     * @name setByASN1ObjectArray
     * @memberOf KJUR.asn1.DERAbstractStructured#
     * @function
     * @param {array} asn1ObjectArray array of ASN1Object to set
     */
    this.setByASN1ObjectArray = function (asn1ObjectArray) {
        this.hTLV = null;
        this.isModified = true;
        this.asn1Array = asn1ObjectArray;
    };
    /**
     * append an ASN1Object to internal array
     * @name appendASN1Object
     * @memberOf KJUR.asn1.DERAbstractStructured#
     * @function
     * @param {ASN1Object} asn1Object to add
     */
    this.appendASN1Object = function (asn1Object) {
        this.hTLV = null;
        this.isModified = true;
        this.asn1Array.push(asn1Object);
    };
    this.asn1Array = new Array();
    if (typeof params != "undefined") {
        if (typeof params['array'] != "undefined") {
            this.asn1Array = params['array'];
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERAbstractStructured, KJUR.asn1.ASN1Object);
// ********************************************************************
//  ASN.1 Object Classes
// ********************************************************************
// ********************************************************************
/**
 * class for ASN.1 DER Boolean
 * @name KJUR.asn1.DERBoolean
 * @class class for ASN.1 DER Boolean
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERBoolean = function () {
    KJUR.asn1.DERBoolean.superclass.constructor.call(this);
    this.hT = "01";
    this.hTLV = "0101ff";
};
YAHOO.lang.extend(KJUR.asn1.DERBoolean, KJUR.asn1.ASN1Object);
// ********************************************************************
/**
 * class for ASN.1 DER Integer
 * @name KJUR.asn1.DERInteger
 * @class class for ASN.1 DER Integer
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>int - specify initial ASN.1 value(V) by integer value</li>
 * <li>bigint - specify initial ASN.1 value(V) by BigInteger object</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERInteger = function (params) {
    KJUR.asn1.DERInteger.superclass.constructor.call(this);
    this.hT = "02";
    /**
     * set value by Tom Wu's BigInteger object
     * @name setByBigInteger
     * @memberOf KJUR.asn1.DERInteger#
     * @function
     * @param {BigInteger} bigIntegerValue to set
     */
    this.setByBigInteger = function (bigIntegerValue) {
        this.hTLV = null;
        this.isModified = true;
        this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
    };
    /**
     * set value by integer value
     * @name setByInteger
     * @memberOf KJUR.asn1.DERInteger
     * @function
     * @param {Integer} integer value to set
     */
    this.setByInteger = function (intValue) {
        var bi = new BigInteger(String(intValue), 10);
        this.setByBigInteger(bi);
    };
    /**
     * set value by integer value
     * @name setValueHex
     * @memberOf KJUR.asn1.DERInteger#
     * @function
     * @param {String} hexadecimal string of integer value
     * @description
     * <br/>
     * NOTE: Value shall be represented by minimum octet length of
     * two's complement representation.
     * @example
     * new KJUR.asn1.DERInteger(123);
     * new KJUR.asn1.DERInteger({'int': 123});
     * new KJUR.asn1.DERInteger({'hex': '1fad'});
     */
    this.setValueHex = function (newHexString) {
        this.hV = newHexString;
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
    if (typeof params != "undefined") {
        if (typeof params['bigint'] != "undefined") {
            this.setByBigInteger(params['bigint']);
        }
        else if (typeof params['int'] != "undefined") {
            this.setByInteger(params['int']);
        }
        else if (typeof params == "number") {
            this.setByInteger(params);
        }
        else if (typeof params['hex'] != "undefined") {
            this.setValueHex(params['hex']);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERInteger, KJUR.asn1.ASN1Object);
// ********************************************************************
/**
 * class for ASN.1 DER encoded BitString primitive
 * @name KJUR.asn1.DERBitString
 * @class class for ASN.1 DER encoded BitString primitive
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>bin - specify binary string (ex. '10111')</li>
 * <li>array - specify array of boolean (ex. [true,false,true,true])</li>
 * <li>hex - specify hexadecimal string of ASN.1 value(V) including unused bits</li>
 * <li>obj - specify {@link KJUR.asn1.ASN1Util.newObject}
 * argument for "BitString encapsulates" structure.</li>
 * </ul>
 * NOTE1: 'params' can be omitted.<br/>
 * NOTE2: 'obj' parameter have been supported since
 * asn1 1.0.11, jsrsasign 6.1.1 (2016-Sep-25).<br/>
 * @example
 * // default constructor
 * o = new KJUR.asn1.DERBitString();
 * // initialize with binary string
 * o = new KJUR.asn1.DERBitString({bin: "1011"});
 * // initialize with boolean array
 * o = new KJUR.asn1.DERBitString({array: [true,false,true,true]});
 * // initialize with hexadecimal string (04 is unused bits)
 * o = new KJUR.asn1.DEROctetString({hex: "04bac0"});
 * // initialize with ASN1Util.newObject argument for encapsulated
 * o = new KJUR.asn1.DERBitString({obj: {seq: [{int: 3}, {prnstr: 'aaa'}]}});
 * // above generates a ASN.1 data like this:
 * // BIT STRING, encapsulates {
 * //   SEQUENCE {
 * //     INTEGER 3
 * //     PrintableString 'aaa'
 * //     }
 * //   }
 */
KJUR.asn1.DERBitString = function (params) {
    if (params !== undefined && typeof params.obj !== "undefined") {
        var o = KJUR.asn1.ASN1Util.newObject(params.obj);
        params.hex = "00" + o.getEncodedHex();
    }
    KJUR.asn1.DERBitString.superclass.constructor.call(this);
    this.hT = "03";
    /**
     * set ASN.1 value(V) by a hexadecimal string including unused bits
     * @name setHexValueIncludingUnusedBits
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {String} newHexStringIncludingUnusedBits
     */
    this.setHexValueIncludingUnusedBits = function (newHexStringIncludingUnusedBits) {
        this.hTLV = null;
        this.isModified = true;
        this.hV = newHexStringIncludingUnusedBits;
    };
    /**
     * set ASN.1 value(V) by unused bit and hexadecimal string of value
     * @name setUnusedBitsAndHexValue
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {Integer} unusedBits
     * @param {String} hValue
     */
    this.setUnusedBitsAndHexValue = function (unusedBits, hValue) {
        if (unusedBits < 0 || 7 < unusedBits) {
            throw "unused bits shall be from 0 to 7: u = " + unusedBits;
        }
        var hUnusedBits = "0" + unusedBits;
        this.hTLV = null;
        this.isModified = true;
        this.hV = hUnusedBits + hValue;
    };
    /**
     * set ASN.1 DER BitString by binary string<br/>
     * @name setByBinaryString
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {String} binaryString binary value string (i.e. '10111')
     * @description
     * Its unused bits will be calculated automatically by length of
     * 'binaryValue'. <br/>
     * NOTE: Trailing zeros '0' will be ignored.
     * @example
     * o = new KJUR.asn1.DERBitString();
     * o.setByBooleanArray("01011");
     */
    this.setByBinaryString = function (binaryString) {
        binaryString = binaryString.replace(/0+$/, '');
        var unusedBits = 8 - binaryString.length % 8;
        if (unusedBits == 8)
            unusedBits = 0;
        for (var i = 0; i <= unusedBits; i++) {
            binaryString += '0';
        }
        var h = '';
        for (var i = 0; i < binaryString.length - 1; i += 8) {
            var b = binaryString.substr(i, 8);
            var x = parseInt(b, 2).toString(16);
            if (x.length == 1)
                x = '0' + x;
            h += x;
        }
        this.hTLV = null;
        this.isModified = true;
        this.hV = '0' + unusedBits + h;
    };
    /**
     * set ASN.1 TLV value(V) by an array of boolean<br/>
     * @name setByBooleanArray
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {array} booleanArray array of boolean (ex. [true, false, true])
     * @description
     * NOTE: Trailing falses will be ignored in the ASN.1 DER Object.
     * @example
     * o = new KJUR.asn1.DERBitString();
     * o.setByBooleanArray([false, true, false, true, true]);
     */
    this.setByBooleanArray = function (booleanArray) {
        var s = '';
        for (var i = 0; i < booleanArray.length; i++) {
            if (booleanArray[i] == true) {
                s += '1';
            }
            else {
                s += '0';
            }
        }
        this.setByBinaryString(s);
    };
    /**
     * generate an array of falses with specified length<br/>
     * @name newFalseArray
     * @memberOf KJUR.asn1.DERBitString
     * @function
     * @param {Integer} nLength length of array to generate
     * @return {array} array of boolean falses
     * @description
     * This static method may be useful to initialize boolean array.
     * @example
     * o = new KJUR.asn1.DERBitString();
     * o.newFalseArray(3) &rarr; [false, false, false]
     */
    this.newFalseArray = function (nLength) {
        var a = new Array(nLength);
        for (var i = 0; i < nLength; i++) {
            a[i] = false;
        }
        return a;
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
    if (typeof params != "undefined") {
        if (typeof params == "string" && params.toLowerCase().match(/^[0-9a-f]+$/)) {
            this.setHexValueIncludingUnusedBits(params);
        }
        else if (typeof params['hex'] != "undefined") {
            this.setHexValueIncludingUnusedBits(params['hex']);
        }
        else if (typeof params['bin'] != "undefined") {
            this.setByBinaryString(params['bin']);
        }
        else if (typeof params['array'] != "undefined") {
            this.setByBooleanArray(params['array']);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERBitString, KJUR.asn1.ASN1Object);
// ********************************************************************
/**
 * class for ASN.1 DER OctetString<br/>
 * @name KJUR.asn1.DEROctetString
 * @class class for ASN.1 DER OctetString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * This class provides ASN.1 OctetString simple type.<br/>
 * Supported "params" attributes are:
 * <ul>
 * <li>str - to set a string as a value</li>
 * <li>hex - to set a hexadecimal string as a value</li>
 * <li>obj - to set a encapsulated ASN.1 value by JSON object
 * which is defined in {@link KJUR.asn1.ASN1Util.newObject}</li>
 * </ul>
 * NOTE: A parameter 'obj' have been supported
 * for "OCTET STRING, encapsulates" structure.
 * since asn1 1.0.11, jsrsasign 6.1.1 (2016-Sep-25).
 * @see KJUR.asn1.DERAbstractString - superclass
 * @example
 * // default constructor
 * o = new KJUR.asn1.DEROctetString();
 * // initialize with string
 * o = new KJUR.asn1.DEROctetString({str: "aaa"});
 * // initialize with hexadecimal string
 * o = new KJUR.asn1.DEROctetString({hex: "616161"});
 * // initialize with ASN1Util.newObject argument
 * o = new KJUR.asn1.DEROctetString({obj: {seq: [{int: 3}, {prnstr: 'aaa'}]}});
 * // above generates a ASN.1 data like this:
 * // OCTET STRING, encapsulates {
 * //   SEQUENCE {
 * //     INTEGER 3
 * //     PrintableString 'aaa'
 * //     }
 * //   }
 */
KJUR.asn1.DEROctetString = function (params) {
    if (params !== undefined && typeof params.obj !== "undefined") {
        var o = KJUR.asn1.ASN1Util.newObject(params.obj);
        params.hex = o.getEncodedHex();
    }
    KJUR.asn1.DEROctetString.superclass.constructor.call(this, params);
    this.hT = "04";
};
YAHOO.lang.extend(KJUR.asn1.DEROctetString, KJUR.asn1.DERAbstractString);
// ********************************************************************
/**
 * class for ASN.1 DER Null
 * @name KJUR.asn1.DERNull
 * @class class for ASN.1 DER Null
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERNull = function () {
    KJUR.asn1.DERNull.superclass.constructor.call(this);
    this.hT = "05";
    this.hTLV = "0500";
};
YAHOO.lang.extend(KJUR.asn1.DERNull, KJUR.asn1.ASN1Object);
// ********************************************************************
/**
 * class for ASN.1 DER ObjectIdentifier
 * @name KJUR.asn1.DERObjectIdentifier
 * @class class for ASN.1 DER ObjectIdentifier
 * @param {Array} params associative array of parameters (ex. {'oid': '2.5.4.5'})
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>oid - specify initial ASN.1 value(V) by a oid string (ex. 2.5.4.13)</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERObjectIdentifier = function (params) {
    var itox = function (i) {
        var h = i.toString(16);
        if (h.length == 1)
            h = '0' + h;
        return h;
    };
    var roidtox = function (roid) {
        var h = '';
        var bi = new BigInteger(roid, 10);
        var b = bi.toString(2);
        var padLen = 7 - b.length % 7;
        if (padLen == 7)
            padLen = 0;
        var bPad = '';
        for (var i = 0; i < padLen; i++)
            bPad += '0';
        b = bPad + b;
        for (var i = 0; i < b.length - 1; i += 7) {
            var b8 = b.substr(i, 7);
            if (i != b.length - 7)
                b8 = '1' + b8;
            h += itox(parseInt(b8, 2));
        }
        return h;
    };
    KJUR.asn1.DERObjectIdentifier.superclass.constructor.call(this);
    this.hT = "06";
    /**
     * set value by a hexadecimal string
     * @name setValueHex
     * @memberOf KJUR.asn1.DERObjectIdentifier#
     * @function
     * @param {String} newHexString hexadecimal value of OID bytes
     */
    this.setValueHex = function (newHexString) {
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = newHexString;
    };
    /**
     * set value by a OID string<br/>
     * @name setValueOidString
     * @memberOf KJUR.asn1.DERObjectIdentifier#
     * @function
     * @param {String} oidString OID string (ex. 2.5.4.13)
     * @example
     * o = new KJUR.asn1.DERObjectIdentifier();
     * o.setValueOidString("2.5.4.13");
     */
    this.setValueOidString = function (oidString) {
        if (!oidString.match(/^[0-9.]+$/)) {
            throw "malformed oid string: " + oidString;
        }
        var h = '';
        var a = oidString.split('.');
        var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
        h += itox(i0);
        a.splice(0, 2);
        for (var i = 0; i < a.length; i++) {
            h += roidtox(a[i]);
        }
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = h;
    };
    /**
     * set value by a OID name
     * @name setValueName
     * @memberOf KJUR.asn1.DERObjectIdentifier#
     * @function
     * @param {String} oidName OID name (ex. 'serverAuth')
     * @since 1.0.1
     * @description
     * OID name shall be defined in 'KJUR.asn1.x509.OID.name2oidList'.
     * Otherwise raise error.
     * @example
     * o = new KJUR.asn1.DERObjectIdentifier();
     * o.setValueName("serverAuth");
     */
    this.setValueName = function (oidName) {
        var oid = KJUR.asn1.x509.OID.name2oid(oidName);
        if (oid !== '') {
            this.setValueOidString(oid);
        }
        else {
            throw "DERObjectIdentifier oidName undefined: " + oidName;
        }
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
    if (params !== undefined) {
        if (typeof params === "string") {
            if (params.match(/^[0-2].[0-9.]+$/)) {
                this.setValueOidString(params);
            }
            else {
                this.setValueName(params);
            }
        }
        else if (params.oid !== undefined) {
            this.setValueOidString(params.oid);
        }
        else if (params.hex !== undefined) {
            this.setValueHex(params.hex);
        }
        else if (params.name !== undefined) {
            this.setValueName(params.name);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERObjectIdentifier, KJUR.asn1.ASN1Object);
// ********************************************************************
/**
 * class for ASN.1 DER Enumerated
 * @name KJUR.asn1.DEREnumerated
 * @class class for ASN.1 DER Enumerated
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>int - specify initial ASN.1 value(V) by integer value</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 * @example
 * new KJUR.asn1.DEREnumerated(123);
 * new KJUR.asn1.DEREnumerated({int: 123});
 * new KJUR.asn1.DEREnumerated({hex: '1fad'});
 */
KJUR.asn1.DEREnumerated = function (params) {
    KJUR.asn1.DEREnumerated.superclass.constructor.call(this);
    this.hT = "0a";
    /**
     * set value by Tom Wu's BigInteger object
     * @name setByBigInteger
     * @memberOf KJUR.asn1.DEREnumerated#
     * @function
     * @param {BigInteger} bigIntegerValue to set
     */
    this.setByBigInteger = function (bigIntegerValue) {
        this.hTLV = null;
        this.isModified = true;
        this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
    };
    /**
     * set value by integer value
     * @name setByInteger
     * @memberOf KJUR.asn1.DEREnumerated#
     * @function
     * @param {Integer} integer value to set
     */
    this.setByInteger = function (intValue) {
        var bi = new BigInteger(String(intValue), 10);
        this.setByBigInteger(bi);
    };
    /**
     * set value by integer value
     * @name setValueHex
     * @memberOf KJUR.asn1.DEREnumerated#
     * @function
     * @param {String} hexadecimal string of integer value
     * @description
     * <br/>
     * NOTE: Value shall be represented by minimum octet length of
     * two's complement representation.
     */
    this.setValueHex = function (newHexString) {
        this.hV = newHexString;
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
    if (typeof params != "undefined") {
        if (typeof params['int'] != "undefined") {
            this.setByInteger(params['int']);
        }
        else if (typeof params == "number") {
            this.setByInteger(params);
        }
        else if (typeof params['hex'] != "undefined") {
            this.setValueHex(params['hex']);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DEREnumerated, KJUR.asn1.ASN1Object);
// ********************************************************************
/**
 * class for ASN.1 DER UTF8String
 * @name KJUR.asn1.DERUTF8String
 * @class class for ASN.1 DER UTF8String
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERUTF8String = function (params) {
    KJUR.asn1.DERUTF8String.superclass.constructor.call(this, params);
    this.hT = "0c";
};
YAHOO.lang.extend(KJUR.asn1.DERUTF8String, KJUR.asn1.DERAbstractString);
// ********************************************************************
/**
 * class for ASN.1 DER NumericString
 * @name KJUR.asn1.DERNumericString
 * @class class for ASN.1 DER NumericString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERNumericString = function (params) {
    KJUR.asn1.DERNumericString.superclass.constructor.call(this, params);
    this.hT = "12";
};
YAHOO.lang.extend(KJUR.asn1.DERNumericString, KJUR.asn1.DERAbstractString);
// ********************************************************************
/**
 * class for ASN.1 DER PrintableString
 * @name KJUR.asn1.DERPrintableString
 * @class class for ASN.1 DER PrintableString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERPrintableString = function (params) {
    KJUR.asn1.DERPrintableString.superclass.constructor.call(this, params);
    this.hT = "13";
};
YAHOO.lang.extend(KJUR.asn1.DERPrintableString, KJUR.asn1.DERAbstractString);
// ********************************************************************
/**
 * class for ASN.1 DER TeletexString
 * @name KJUR.asn1.DERTeletexString
 * @class class for ASN.1 DER TeletexString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERTeletexString = function (params) {
    KJUR.asn1.DERTeletexString.superclass.constructor.call(this, params);
    this.hT = "14";
};
YAHOO.lang.extend(KJUR.asn1.DERTeletexString, KJUR.asn1.DERAbstractString);
// ********************************************************************
/**
 * class for ASN.1 DER IA5String
 * @name KJUR.asn1.DERIA5String
 * @class class for ASN.1 DER IA5String
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERIA5String = function (params) {
    KJUR.asn1.DERIA5String.superclass.constructor.call(this, params);
    this.hT = "16";
};
YAHOO.lang.extend(KJUR.asn1.DERIA5String, KJUR.asn1.DERAbstractString);
// ********************************************************************
/**
 * class for ASN.1 DER UTCTime
 * @name KJUR.asn1.DERUTCTime
 * @class class for ASN.1 DER UTCTime
 * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
 * @extends KJUR.asn1.DERAbstractTime
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string (ex.'130430235959Z')</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * <li>date - specify Date object.</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 * <h4>EXAMPLES</h4>
 * @example
 * d1 = new KJUR.asn1.DERUTCTime();
 * d1.setString('130430125959Z');
 *
 * d2 = new KJUR.asn1.DERUTCTime({'str': '130430125959Z'});
 * d3 = new KJUR.asn1.DERUTCTime({'date': new Date(Date.UTC(2015, 0, 31, 0, 0, 0, 0))});
 * d4 = new KJUR.asn1.DERUTCTime('130430125959Z');
 */
KJUR.asn1.DERUTCTime = function (params) {
    KJUR.asn1.DERUTCTime.superclass.constructor.call(this, params);
    this.hT = "17";
    /**
     * set value by a Date object<br/>
     * @name setByDate
     * @memberOf KJUR.asn1.DERUTCTime#
     * @function
     * @param {Date} dateObject Date object to set ASN.1 value(V)
     * @example
     * o = new KJUR.asn1.DERUTCTime();
     * o.setByDate(new Date("2016/12/31"));
     */
    this.setByDate = function (dateObject) {
        this.hTLV = null;
        this.isModified = true;
        this.date = dateObject;
        this.s = this.formatDate(this.date, 'utc');
        this.hV = stohex(this.s);
    };
    this.getFreshValueHex = function () {
        if (typeof this.date == "undefined" && typeof this.s == "undefined") {
            this.date = new Date();
            this.s = this.formatDate(this.date, 'utc');
            this.hV = stohex(this.s);
        }
        return this.hV;
    };
    if (params !== undefined) {
        if (params.str !== undefined) {
            this.setString(params.str);
        }
        else if (typeof params == "string" && params.match(/^[0-9]{12}Z$/)) {
            this.setString(params);
        }
        else if (params.hex !== undefined) {
            this.setStringHex(params.hex);
        }
        else if (params.date !== undefined) {
            this.setByDate(params.date);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERUTCTime, KJUR.asn1.DERAbstractTime);
// ********************************************************************
/**
 * class for ASN.1 DER GeneralizedTime
 * @name KJUR.asn1.DERGeneralizedTime
 * @class class for ASN.1 DER GeneralizedTime
 * @param {Array} params associative array of parameters (ex. {'str': '20130430235959Z'})
 * @property {Boolean} withMillis flag to show milliseconds or not
 * @extends KJUR.asn1.DERAbstractTime
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string (ex.'20130430235959Z')</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * <li>date - specify Date object.</li>
 * <li>millis - specify flag to show milliseconds (from 1.0.6)</li>
 * </ul>
 * NOTE1: 'params' can be omitted.
 * NOTE2: 'withMillis' property is supported from asn1 1.0.6.
 */
KJUR.asn1.DERGeneralizedTime = function (params) {
    KJUR.asn1.DERGeneralizedTime.superclass.constructor.call(this, params);
    this.hT = "18";
    this.withMillis = false;
    /**
     * set value by a Date object
     * @name setByDate
     * @memberOf KJUR.asn1.DERGeneralizedTime#
     * @function
     * @param {Date} dateObject Date object to set ASN.1 value(V)
     * @example
     * When you specify UTC time, use 'Date.UTC' method like this:<br/>
     * o1 = new DERUTCTime();
     * o1.setByDate(date);
     *
     * date = new Date(Date.UTC(2015, 0, 31, 23, 59, 59, 0)); #2015JAN31 23:59:59
     */
    this.setByDate = function (dateObject) {
        this.hTLV = null;
        this.isModified = true;
        this.date = dateObject;
        this.s = this.formatDate(this.date, 'gen', this.withMillis);
        this.hV = stohex(this.s);
    };
    this.getFreshValueHex = function () {
        if (this.date === undefined && this.s === undefined) {
            this.date = new Date();
            this.s = this.formatDate(this.date, 'gen', this.withMillis);
            this.hV = stohex(this.s);
        }
        return this.hV;
    };
    if (params !== undefined) {
        if (params.str !== undefined) {
            this.setString(params.str);
        }
        else if (typeof params == "string" && params.match(/^[0-9]{14}Z$/)) {
            this.setString(params);
        }
        else if (params.hex !== undefined) {
            this.setStringHex(params.hex);
        }
        else if (params.date !== undefined) {
            this.setByDate(params.date);
        }
        if (params.millis === true) {
            this.withMillis = true;
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERGeneralizedTime, KJUR.asn1.DERAbstractTime);
// ********************************************************************
/**
 * class for ASN.1 DER Sequence
 * @name KJUR.asn1.DERSequence
 * @class class for ASN.1 DER Sequence
 * @extends KJUR.asn1.DERAbstractStructured
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>array - specify array of ASN1Object to set elements of content</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERSequence = function (params) {
    KJUR.asn1.DERSequence.superclass.constructor.call(this, params);
    this.hT = "30";
    this.getFreshValueHex = function () {
        var h = '';
        for (var i = 0; i < this.asn1Array.length; i++) {
            var asn1Obj = this.asn1Array[i];
            h += asn1Obj.getEncodedHex();
        }
        this.hV = h;
        return this.hV;
    };
};
YAHOO.lang.extend(KJUR.asn1.DERSequence, KJUR.asn1.DERAbstractStructured);
// ********************************************************************
/**
 * class for ASN.1 DER Set
 * @name KJUR.asn1.DERSet
 * @class class for ASN.1 DER Set
 * @extends KJUR.asn1.DERAbstractStructured
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>array - specify array of ASN1Object to set elements of content</li>
 * <li>sortflag - flag for sort (default: true). ASN.1 BER is not sorted in 'SET OF'.</li>
 * </ul>
 * NOTE1: 'params' can be omitted.<br/>
 * NOTE2: sortflag is supported since 1.0.5.
 */
KJUR.asn1.DERSet = function (params) {
    KJUR.asn1.DERSet.superclass.constructor.call(this, params);
    this.hT = "31";
    this.sortFlag = true; // item shall be sorted only in ASN.1 DER
    this.getFreshValueHex = function () {
        var a = new Array();
        for (var i = 0; i < this.asn1Array.length; i++) {
            var asn1Obj = this.asn1Array[i];
            a.push(asn1Obj.getEncodedHex());
        }
        if (this.sortFlag == true)
            a.sort();
        this.hV = a.join('');
        return this.hV;
    };
    if (typeof params != "undefined") {
        if (typeof params.sortflag != "undefined" &&
            params.sortflag == false)
            this.sortFlag = false;
    }
};
YAHOO.lang.extend(KJUR.asn1.DERSet, KJUR.asn1.DERAbstractStructured);
// ********************************************************************
/**
 * class for ASN.1 DER TaggedObject
 * @name KJUR.asn1.DERTaggedObject
 * @class class for ASN.1 DER TaggedObject
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * Parameter 'tagNoNex' is ASN.1 tag(T) value for this object.
 * For example, if you find '[1]' tag in a ASN.1 dump,
 * 'tagNoHex' will be 'a1'.
 * <br/>
 * As for optional argument 'params' for constructor, you can specify *ANY* of
 * following properties:
 * <ul>
 * <li>explicit - specify true if this is explicit tag otherwise false
 *     (default is 'true').</li>
 * <li>tag - specify tag (default is 'a0' which means [0])</li>
 * <li>obj - specify ASN1Object which is tagged</li>
 * </ul>
 * @example
 * d1 = new KJUR.asn1.DERUTF8String({'str':'a'});
 * d2 = new KJUR.asn1.DERTaggedObject({'obj': d1});
 * hex = d2.getEncodedHex();
 */
KJUR.asn1.DERTaggedObject = function (params) {
    KJUR.asn1.DERTaggedObject.superclass.constructor.call(this);
    this.hT = "a0";
    this.hV = '';
    this.isExplicit = true;
    this.asn1Object = null;
    /**
     * set value by an ASN1Object
     * @name setString
     * @memberOf KJUR.asn1.DERTaggedObject#
     * @function
     * @param {Boolean} isExplicitFlag flag for explicit/implicit tag
     * @param {Integer} tagNoHex hexadecimal string of ASN.1 tag
     * @param {ASN1Object} asn1Object ASN.1 to encapsulate
     */
    this.setASN1Object = function (isExplicitFlag, tagNoHex, asn1Object) {
        this.hT = tagNoHex;
        this.isExplicit = isExplicitFlag;
        this.asn1Object = asn1Object;
        if (this.isExplicit) {
            this.hV = this.asn1Object.getEncodedHex();
            this.hTLV = null;
            this.isModified = true;
        }
        else {
            this.hV = null;
            this.hTLV = asn1Object.getEncodedHex();
            this.hTLV = this.hTLV.replace(/^../, tagNoHex);
            this.isModified = false;
        }
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
    if (typeof params != "undefined") {
        if (typeof params['tag'] != "undefined") {
            this.hT = params['tag'];
        }
        if (typeof params['explicit'] != "undefined") {
            this.isExplicit = params['explicit'];
        }
        if (typeof params['obj'] != "undefined") {
            this.asn1Object = params['obj'];
            this.setASN1Object(this.isExplicit, this.hT, this.asn1Object);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERTaggedObject, KJUR.asn1.ASN1Object);

;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/JSEncryptRSAKey.js
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();







/**
 * Create a new JSEncryptRSAKey that extends Tom Wu's RSA key object.
 * This object is just a decorator for parsing the key parameter
 * @param {string|Object} key - The key in string format, or an object containing
 * the parameters needed to build a RSAKey object.
 * @constructor
 */
var JSEncryptRSAKey = /** @class */ (function (_super) {
    __extends(JSEncryptRSAKey, _super);
    function JSEncryptRSAKey(key) {
        var _this = _super.call(this) || this;
        // Call the super constructor.
        //  RSAKey.call(this);
        // If a key key was provided.
        if (key) {
            // If this is a string...
            if (typeof key === "string") {
                _this.parseKey(key);
            }
            else if (JSEncryptRSAKey.hasPrivateKeyProperty(key) ||
                JSEncryptRSAKey.hasPublicKeyProperty(key)) {
                // Set the values for the key.
                _this.parsePropertiesFrom(key);
            }
        }
        return _this;
    }
    /**
     * Method to parse a pem encoded string containing both a public or private key.
     * The method will translate the pem encoded string in a der encoded string and
     * will parse private key and public key parameters. This method accepts public key
     * in the rsaencryption pkcs #1 format (oid: 1.2.840.113549.1.1.1).
     *
     * @todo Check how many rsa formats use the same format of pkcs #1.
     *
     * The format is defined as:
     * PublicKeyInfo ::= SEQUENCE {
     *   algorithm       AlgorithmIdentifier,
     *   PublicKey       BIT STRING
     * }
     * Where AlgorithmIdentifier is:
     * AlgorithmIdentifier ::= SEQUENCE {
     *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
     *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
     * }
     * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
     * RSAPublicKey ::= SEQUENCE {
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER   -- e
     * }
     * it's possible to examine the structure of the keys obtained from openssl using
     * an asn.1 dumper as the one used here to parse the components: http://lapo.it/asn1js/
     * @argument {string} pem the pem encoded string, can include the BEGIN/END header/footer
     * @private
     */
    JSEncryptRSAKey.prototype.parseKey = function (pem) {
        try {
            var modulus = 0;
            var public_exponent = 0;
            var reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
            var der = reHex.test(pem) ? Hex.decode(pem) : Base64.unarmor(pem);
            var asn1 = ASN1.decode(der);
            // Fixes a bug with OpenSSL 1.0+ private keys
            if (asn1.sub.length === 3) {
                asn1 = asn1.sub[2].sub[0];
            }
            if (asn1.sub.length === 9) {
                // Parse the private key.
                modulus = asn1.sub[1].getHexStringValue(); // bigint
                this.n = parseBigInt(modulus, 16);
                public_exponent = asn1.sub[2].getHexStringValue(); // int
                this.e = parseInt(public_exponent, 16);
                var private_exponent = asn1.sub[3].getHexStringValue(); // bigint
                this.d = parseBigInt(private_exponent, 16);
                var prime1 = asn1.sub[4].getHexStringValue(); // bigint
                this.p = parseBigInt(prime1, 16);
                var prime2 = asn1.sub[5].getHexStringValue(); // bigint
                this.q = parseBigInt(prime2, 16);
                var exponent1 = asn1.sub[6].getHexStringValue(); // bigint
                this.dmp1 = parseBigInt(exponent1, 16);
                var exponent2 = asn1.sub[7].getHexStringValue(); // bigint
                this.dmq1 = parseBigInt(exponent2, 16);
                var coefficient = asn1.sub[8].getHexStringValue(); // bigint
                this.coeff = parseBigInt(coefficient, 16);
            }
            else if (asn1.sub.length === 2) {
                if (asn1.sub[0].sub) {
                    // Parse ASN.1 SubjectPublicKeyInfo type as defined by X.509
                    var bit_string = asn1.sub[1];
                    var sequence = bit_string.sub[0];
                    modulus = sequence.sub[0].getHexStringValue();
                    this.n = parseBigInt(modulus, 16);
                    public_exponent = sequence.sub[1].getHexStringValue();
                    this.e = parseInt(public_exponent, 16);
                }
                else {
                    // Parse ASN.1 RSAPublicKey type as defined by PKCS #1
                    modulus = asn1.sub[0].getHexStringValue();
                    this.n = parseBigInt(modulus, 16);
                    public_exponent = asn1.sub[1].getHexStringValue();
                    this.e = parseInt(public_exponent, 16);
                }
            }
            else {
                return false;
            }
            return true;
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Translate rsa parameters in a hex encoded string representing the rsa key.
     *
     * The translation follow the ASN.1 notation :
     * RSAPrivateKey ::= SEQUENCE {
     *   version           Version,
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER,  -- e
     *   privateExponent   INTEGER,  -- d
     *   prime1            INTEGER,  -- p
     *   prime2            INTEGER,  -- q
     *   exponent1         INTEGER,  -- d mod (p1)
     *   exponent2         INTEGER,  -- d mod (q-1)
     *   coefficient       INTEGER,  -- (inverse of q) mod p
     * }
     * @returns {string}  DER Encoded String representing the rsa private key
     * @private
     */
    JSEncryptRSAKey.prototype.getPrivateBaseKey = function () {
        var options = {
            array: [
                new KJUR.asn1.DERInteger({ int: 0 }),
                new KJUR.asn1.DERInteger({ bigint: this.n }),
                new KJUR.asn1.DERInteger({ int: this.e }),
                new KJUR.asn1.DERInteger({ bigint: this.d }),
                new KJUR.asn1.DERInteger({ bigint: this.p }),
                new KJUR.asn1.DERInteger({ bigint: this.q }),
                new KJUR.asn1.DERInteger({ bigint: this.dmp1 }),
                new KJUR.asn1.DERInteger({ bigint: this.dmq1 }),
                new KJUR.asn1.DERInteger({ bigint: this.coeff }),
            ],
        };
        var seq = new KJUR.asn1.DERSequence(options);
        return seq.getEncodedHex();
    };
    /**
     * base64 (pem) encoded version of the DER encoded representation
     * @returns {string} pem encoded representation without header and footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPrivateBaseKeyB64 = function () {
        return hex2b64(this.getPrivateBaseKey());
    };
    /**
     * Translate rsa parameters in a hex encoded string representing the rsa public key.
     * The representation follow the ASN.1 notation :
     * PublicKeyInfo ::= SEQUENCE {
     *   algorithm       AlgorithmIdentifier,
     *   PublicKey       BIT STRING
     * }
     * Where AlgorithmIdentifier is:
     * AlgorithmIdentifier ::= SEQUENCE {
     *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
     *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
     * }
     * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
     * RSAPublicKey ::= SEQUENCE {
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER   -- e
     * }
     * @returns {string} DER Encoded String representing the rsa public key
     * @private
     */
    JSEncryptRSAKey.prototype.getPublicBaseKey = function () {
        var first_sequence = new KJUR.asn1.DERSequence({
            array: [
                new KJUR.asn1.DERObjectIdentifier({ oid: "1.2.840.113549.1.1.1" }),
                new KJUR.asn1.DERNull(),
            ],
        });
        var second_sequence = new KJUR.asn1.DERSequence({
            array: [
                new KJUR.asn1.DERInteger({ bigint: this.n }),
                new KJUR.asn1.DERInteger({ int: this.e }),
            ],
        });
        var bit_string = new KJUR.asn1.DERBitString({
            hex: "00" + second_sequence.getEncodedHex(),
        });
        var seq = new KJUR.asn1.DERSequence({
            array: [first_sequence, bit_string],
        });
        return seq.getEncodedHex();
    };
    /**
     * base64 (pem) encoded version of the DER encoded representation
     * @returns {string} pem encoded representation without header and footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPublicBaseKeyB64 = function () {
        return hex2b64(this.getPublicBaseKey());
    };
    /**
     * wrap the string in block of width chars. The default value for rsa keys is 64
     * characters.
     * @param {string} str the pem encoded string without header and footer
     * @param {Number} [width=64] - the length the string has to be wrapped at
     * @returns {string}
     * @private
     */
    JSEncryptRSAKey.wordwrap = function (str, width) {
        width = width || 64;
        if (!str) {
            return str;
        }
        var regex = "(.{1," + width + "})( +|$\n?)|(.{1," + width + "})";
        return str.match(RegExp(regex, "g")).join("\n");
    };
    /**
     * Retrieve the pem encoded private key
     * @returns {string} the pem encoded private key with header/footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPrivateKey = function () {
        var key = "-----BEGIN RSA PRIVATE KEY-----\n";
        key += JSEncryptRSAKey.wordwrap(this.getPrivateBaseKeyB64()) + "\n";
        key += "-----END RSA PRIVATE KEY-----";
        return key;
    };
    /**
     * Retrieve the pem encoded public key
     * @returns {string} the pem encoded public key with header/footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPublicKey = function () {
        var key = "-----BEGIN PUBLIC KEY-----\n";
        key += JSEncryptRSAKey.wordwrap(this.getPublicBaseKeyB64()) + "\n";
        key += "-----END PUBLIC KEY-----";
        return key;
    };
    /**
     * Check if the object contains the necessary parameters to populate the rsa modulus
     * and public exponent parameters.
     * @param {Object} [obj={}] - An object that may contain the two public key
     * parameters
     * @returns {boolean} true if the object contains both the modulus and the public exponent
     * properties (n and e)
     * @todo check for types of n and e. N should be a parseable bigInt object, E should
     * be a parseable integer number
     * @private
     */
    JSEncryptRSAKey.hasPublicKeyProperty = function (obj) {
        obj = obj || {};
        return obj.hasOwnProperty("n") && obj.hasOwnProperty("e");
    };
    /**
     * Check if the object contains ALL the parameters of an RSA key.
     * @param {Object} [obj={}] - An object that may contain nine rsa key
     * parameters
     * @returns {boolean} true if the object contains all the parameters needed
     * @todo check for types of the parameters all the parameters but the public exponent
     * should be parseable bigint objects, the public exponent should be a parseable integer number
     * @private
     */
    JSEncryptRSAKey.hasPrivateKeyProperty = function (obj) {
        obj = obj || {};
        return (obj.hasOwnProperty("n") &&
            obj.hasOwnProperty("e") &&
            obj.hasOwnProperty("d") &&
            obj.hasOwnProperty("p") &&
            obj.hasOwnProperty("q") &&
            obj.hasOwnProperty("dmp1") &&
            obj.hasOwnProperty("dmq1") &&
            obj.hasOwnProperty("coeff"));
    };
    /**
     * Parse the properties of obj in the current rsa object. Obj should AT LEAST
     * include the modulus and public exponent (n, e) parameters.
     * @param {Object} obj - the object containing rsa parameters
     * @private
     */
    JSEncryptRSAKey.prototype.parsePropertiesFrom = function (obj) {
        this.n = obj.n;
        this.e = obj.e;
        if (obj.hasOwnProperty("d")) {
            this.d = obj.d;
            this.p = obj.p;
            this.q = obj.q;
            this.dmp1 = obj.dmp1;
            this.dmq1 = obj.dmq1;
            this.coeff = obj.coeff;
        }
    };
    return JSEncryptRSAKey;
}(rsa_RSAKey));


;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/JSEncrypt.js
var _a;


var version = typeof process !== 'undefined'
    ? (_a = process.env) === null || _a === void 0 ? void 0 : _a.npm_package_version
    : undefined;
/**
 *
 * @param {Object} [options = {}] - An object to customize JSEncrypt behaviour
 * possible parameters are:
 * - default_key_size        {number}  default: 1024 the key size in bit
 * - default_public_exponent {string}  default: '010001' the hexadecimal representation of the public exponent
 * - log                     {boolean} default: false whether log warn/error or not
 * @constructor
 */
var JSEncrypt_JSEncrypt = /** @class */ (function () {
    function JSEncrypt(options) {
        if (options === void 0) { options = {}; }
        options = options || {};
        this.default_key_size = options.default_key_size
            ? parseInt(options.default_key_size, 10)
            : 1024;
        this.default_public_exponent = options.default_public_exponent || "010001"; // 65537 default openssl public exponent for rsa key type
        this.log = options.log || false;
        // The private and public key.
        this.key = null;
    }
    /**
     * Method to set the rsa key parameter (one method is enough to set both the public
     * and the private key, since the private key contains the public key paramenters)
     * Log a warning if logs are enabled
     * @param {Object|string} key the pem encoded string or an object (with or without header/footer)
     * @public
     */
    JSEncrypt.prototype.setKey = function (key) {
        if (this.log && this.key) {
            console.warn("A key was already set, overriding existing.");
        }
        this.key = new JSEncryptRSAKey(key);
    };
    /**
     * Proxy method for setKey, for api compatibility
     * @see setKey
     * @public
     */
    JSEncrypt.prototype.setPrivateKey = function (privkey) {
        // Create the key.
        this.setKey(privkey);
    };
    /**
     * Proxy method for setKey, for api compatibility
     * @see setKey
     * @public
     */
    JSEncrypt.prototype.setPublicKey = function (pubkey) {
        // Sets the public key.
        this.setKey(pubkey);
    };
    /**
     * Proxy method for RSAKey object's decrypt, decrypt the string using the private
     * components of the rsa key object. Note that if the object was not set will be created
     * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
     * @param {string} str base64 encoded crypted string to decrypt
     * @return {string} the decrypted string
     * @public
     */
    JSEncrypt.prototype.decrypt = function (str) {
        // Return the decrypted string.
        try {
            return this.getKey().decrypt(b64tohex(str));
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Proxy method for RSAKey object's encrypt, encrypt the string using the public
     * components of the rsa key object. Note that if the object was not set will be created
     * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
     * @param {string} str the string to encrypt
     * @return {string} the encrypted string encoded in base64
     * @public
     */
    JSEncrypt.prototype.encrypt = function (str) {
        // Return the encrypted string.
        try {
            return hex2b64(this.getKey().encrypt(str));
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Proxy method for RSAKey object's sign.
     * @param {string} str the string to sign
     * @param {function} digestMethod hash method
     * @param {string} digestName the name of the hash algorithm
     * @return {string} the signature encoded in base64
     * @public
     */
    JSEncrypt.prototype.sign = function (str, digestMethod, digestName) {
        // return the RSA signature of 'str' in 'hex' format.
        try {
            return hex2b64(this.getKey().sign(str, digestMethod, digestName));
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Proxy method for RSAKey object's verify.
     * @param {string} str the string to verify
     * @param {string} signature the signature encoded in base64 to compare the string to
     * @param {function} digestMethod hash method
     * @return {boolean} whether the data and signature match
     * @public
     */
    JSEncrypt.prototype.verify = function (str, signature, digestMethod) {
        // Return the decrypted 'digest' of the signature.
        try {
            return this.getKey().verify(str, b64tohex(signature), digestMethod);
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Getter for the current JSEncryptRSAKey object. If it doesn't exists a new object
     * will be created and returned
     * @param {callback} [cb] the callback to be called if we want the key to be generated
     * in an async fashion
     * @returns {JSEncryptRSAKey} the JSEncryptRSAKey object
     * @public
     */
    JSEncrypt.prototype.getKey = function (cb) {
        // Only create new if it does not exist.
        if (!this.key) {
            // Get a new private key.
            this.key = new JSEncryptRSAKey();
            if (cb && {}.toString.call(cb) === "[object Function]") {
                this.key.generateAsync(this.default_key_size, this.default_public_exponent, cb);
                return;
            }
            // Generate the key.
            this.key.generate(this.default_key_size, this.default_public_exponent);
        }
        return this.key;
    };
    /**
     * Returns the pem encoded representation of the private key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the private key WITH header and footer
     * @public
     */
    JSEncrypt.prototype.getPrivateKey = function () {
        // Return the private representation of this key.
        return this.getKey().getPrivateKey();
    };
    /**
     * Returns the pem encoded representation of the private key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the private key WITHOUT header and footer
     * @public
     */
    JSEncrypt.prototype.getPrivateKeyB64 = function () {
        // Return the private representation of this key.
        return this.getKey().getPrivateBaseKeyB64();
    };
    /**
     * Returns the pem encoded representation of the public key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the public key WITH header and footer
     * @public
     */
    JSEncrypt.prototype.getPublicKey = function () {
        // Return the private representation of this key.
        return this.getKey().getPublicKey();
    };
    /**
     * Returns the pem encoded representation of the public key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the public key WITHOUT header and footer
     * @public
     */
    JSEncrypt.prototype.getPublicKeyB64 = function () {
        // Return the private representation of this key.
        return this.getKey().getPublicBaseKeyB64();
    };
    JSEncrypt.version = version;
    return JSEncrypt;
}());


;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/index.js


/* harmony default export */ const lib = ((/* unused pure expression or super */ null && (JSEncrypt)));

;// CONCATENATED MODULE: ./src/scripts/rsa.ts




class RSAEncrypt {
  constructor(modulus, exponent) {
    if (isExtension()) {
      this.encryptor = new JSEncrypt_JSEncrypt({
        log: true
      });
      const key = this.encryptor.getKey();
      const n = parseBigInt(modulus, 16);
      const e = parseInt(exponent, 16);
      key.parsePropertiesFrom({
        n,
        e
      });
    } else {
      const key = new RSAKey();
      key.setPublic(modulus, exponent);
      this.key = key;
    }
  }
  encrypt(data) {
    if (isExtension()) {
      try {
        return this.encryptor.getKey().encrypt(data);
      } catch (e) {
        log_error(`Failed to encrypt ${data.length} characters`, e);
        return null;
      }
    } else {
      return this.key.encrypt(data);
    }
  }
}
;// CONCATENATED MODULE: ./src/scripts/auth.ts







const GoogleUserInfoURL = 'https://www.googleapis.com/oauth2/v2/userinfo';
const GSuiteTokenRevokeUrl = 'https://accounts.google.com/o/oauth2/revoke';
async function authenticateWithGSuiteHTTP(serverBaseURL, isInteractive) {
  return Promise.all([getRsaPublicKey(serverBaseURL), getGoogleAuthInfo(isInteractive)]).then(([rsaKey, authInfo]) => {
    return encryptCredentialsWithKey(`${authInfo.email}`, `${authInfo.token}`, rsaKey);
  });
}
async function authenticateWithGSuite(printJob, isInteractive, encryptForMobility = true) {
  log_log(`Authenticating with G-Suite: 
		printJobId=${printJob.printerId}, isInteractive=${isInteractive}, encryptForMobility=${encryptForMobility}`);
  if (encryptForMobility) {
    const serverBaseURL = getUrlBaseOfPrinterUrl(printJob.printerId);
    return authenticateWithGSuiteHTTP(serverBaseURL, isInteractive);
  }
  return getGoogleAuthInfo(isInteractive).then(googleAuth => new Promise(resolve => {
    return resolve({
      provider: 'google',
      userid: googleAuth.email,
      token: googleAuth.token
    });
  }));
}
async function getGoogleAuthInfo(isInteractive) {
  log_log(`Getting auth info from G-Suite: isInteractive=${isInteractive}`);
  const retryWithRefreshedToken = async (e, oldToken) => {
    log_error('failed to get Google user info. refreshing token...', e);
    const details = {
      interactive: isInteractive
    };
    return refreshToken(oldToken, details).then(newToken => getGSuiteUserInfo(newToken));
  };
  return getGSuiteToken(isInteractive).then(token => getGSuiteUserInfo(token).catch(e => retryWithRefreshedToken(e, token)));
}
async function getGSuiteToken(isInteractive) {
  const details = {
    interactive: isInteractive
  };
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken(details, token => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
        return;
      }
      resolve(token);
    });
  });
}
async function refreshToken(expiredToken, details) {
  return new Promise((resolve, reject) => {
    log_log(`Refreshing user token for: '${details.account}'...`);
    chrome.identity.removeCachedAuthToken({
      token: expiredToken
    }, () => {
      chrome.identity.getAuthToken(details, token => {
        if (chrome.runtime.lastError) {
          log_error(`Failed to refresh token: ${chrome.runtime.lastError.message}`);
          reject(chrome.runtime.lastError.message);
          return;
        }
        resolve(token);
      });
    });
  });
}
async function getGSuiteUserInfo(accessToken) {
  log_log('[getGSuiteUserInfo] Fetching user info from G-Suite...');
  try {
    const response = await fetch(`${GoogleUserInfoURL}?access_token=${accessToken}`);
    if (response.status !== 200) {
      throw new Error(`Failed to resolve G-Suite user: ${await response.text()}`);
    }
    const resp = await response.json();
    log_log(`[getGSuiteUserInfo] Resolved user: ${resp.email}`);
    return {
      token: accessToken,
      email: resp.email
    };
  } catch (err) {
    log_error('[getGSuiteUserInfo] Error:', err);
    throw err;
  }
}
async function getRsaPublicKey(urlBase) {
  try {
    const response = await fetch(urlBase + '/public-key', {
      method: 'GET',
      headers: {
        'client-type': clientVersionID()
      }
    }).then(response => getResponseBody(response));
    return parseRsaKey(response);
  } catch (err) {
    log_error('[getRsaPublicKey] Error:', err);
    throw err;
  }
  function parseRsaKey(resp) {
    if (!resp.modulus || !resp.exponent) {
      throw new Error('Invalid encryption key info returned by the server');
    } else {
      const keyLength = resp.modulus.length * 8 / 2;
      log_log(`[getRsaPublicKey] Mobility Print is using ${keyLength}bit RSA key...`);
      return new RSAEncrypt(resp.modulus, resp.exponent);
    }
  }
}
async function isGSuiteEnabledHTTP(urlBase) {
  log_log(`[isGSuiteEnabledHTTP] Checking if GSuite is enabled on server: ${urlBase}...`);
  try {
    const response = await fetch(urlBase + '/auth-options', {
      method: 'GET',
      headers: {
        'client-type': clientVersionID()
      }
    }).then(resp => getResponseBody(resp));
    return response.signInWithGoogle;
  } catch (err) {
    log_error('[isGSuiteEnabledHTTP] Error:', err);
    throw err;
  }
}
async function isGSuiteEnabledRTC(printerId) {
  const serverId = await getServerIdForPrinter(printerId);
  if (!serverId) {
    throw new Error(`unknown server id for printer: ${printerId}`);
  }
  const serverInfo = getServerIdToServerInfoCache().get(serverId);
  if (serverInfo) {
    return serverInfo.signInWithGoogle;
  }
  log_log(`Information for server '${serverId}' is not cached, fetching...`);
  return getServerInfoRTC(serverId).then(info => info.signInWithGoogle).catch(e => {
    log_error('Unable to determine if Google sign-in is enabled.', e);
    throw e;
  });
}
async function isGSuiteEnabled(printJob, cloudPrintJob = false) {
  log_log(`isGSuiteEnabled: printerId=${printJob.printerId} (${cloudPrintJob ? 'Cloud Job' : 'Local Job'})`);
  if (cloudPrintJob) {
    return isGSuiteEnabledRTC(printJob.printerId);
  }
  const urlBase = getUrlBaseOfPrinterUrl(printJob.printerId);
  return isGSuiteEnabledHTTP(urlBase);
}
async function revokeCachedGSuiteAuthToken(msBufferTime = 0) {
  log('Revoking auth token with G-Suite...');
  return new Promise(async (resolve, reject) => {
    try {
      const token = await new Promise(innerResolve => {
        chrome.identity.getAuthToken({
          interactive: false
        }, innerToken => {
          innerResolve(innerToken);
        });
      });
      if (token === null) {
        resolve();
        return;
      }
      const tokenParam = 'token=' + token;
      const response = await fetch(`${GSuiteTokenRevokeUrl}?${tokenParam}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      });
      if (response.status === 200) {
        setTimeout(() => {
          resolve();
        }, msBufferTime);
      } else {
        reject(await response.text());
      }
    } catch (err) {
      error('[revokeCachedGSuiteAuthToken] Error:', err);
      reject('Connection failed');
    }
  });
}
async function encryptCredentialsWithKey(username, password, rsaKey) {
  log_log('Encrypting credentials...');
  const plainCredentials = username + ':' + password;
  const encrypted = rsaKey.encrypt(plainCredentials);
  if (!encrypted) {
    log_error('Credential encryption failed!', 'length', plainCredentials.length);
  }
  return encrypted;
}
function clientVersionID() {
  if (isExtension()) {
    return 'ChromeAppExt-' + chrome.runtime.getManifest().version;
  }
  return 'ChromeApp-' + chrome.runtime.getManifest().version;
}
async function encryptCredentials(mpServerBaseUrl, username, password) {
  log_log(`Encrypting credentials for ${mpServerBaseUrl}...`);
  return getRsaPublicKey(mpServerBaseUrl).then(rsaKey => {
    return encryptCredentialsWithKey(username, password, rsaKey);
  });
}
const inMemoryCreds = {
  rememberMe: false
};
function rememberCredsInMemory(credentials) {
  inMemoryCreds.username = credentials.username;
  inMemoryCreds.password = credentials.password;
  inMemoryCreds.rememberMe = credentials.rememberMe;
}
function clearInMemoryCreds() {
  inMemoryCreds.username = undefined;
  inMemoryCreds.password = undefined;
}
function inMemoryCredsAvailable() {
  return inMemoryCreds.username != null && inMemoryCreds.password != null;
}
;// CONCATENATED MODULE: ./src/scripts/chrome/commands/commands_extension.ts
function onCommand(_callback) {}
;// CONCATENATED MODULE: ./src/scripts/chrome/managed.ts
async function IsManagedInstall() {
  return new Promise(async (res, _) => {
    chrome.management.getSelf(ext => {
      res(ext.installType === chrome.management.ExtensionInstallType.ADMIN);
    });
  });
}
;// CONCATENATED MODULE: ./src/scripts/chrome/runtime.ts
function getChromeOSVersion() {
  const versionString = navigator.userAgent.match(/Chrome\/(\S+)/);
  if (Array.isArray(versionString) && versionString.length === 2) {
    return versionString[1];
  }
  return 'unknown';
}
function getChromeOSVersionMajor() {
  const chromeOSVersion = getChromeOSVersion();
  const mVer = chromeOSVersion.indexOf('.');
  return parseInt(chromeOSVersion.substring(0, mVer != -1 ? mVer : chromeOSVersion.length));
}
function getPlatformInfo() {
  return new Promise(resolve => {
    chrome.runtime.getPlatformInfo(platformInfo => {
      resolve(platformInfo);
    });
  });
}
function getInstanceId() {
  return new Promise(resolve => {
    chrome.instanceID.getID(id => {
      resolve(id);
    });
  });
}
;// CONCATENATED MODULE: ./src/scripts/chrome/message/message_extension.ts

async function sendPageMessage(msg, opts = {}) {
  return new Promise((resolve, reject) => {
    const tabMessage = opts.tabId !== undefined;
    console.info(`sendPageMessage(${tabMessage ? 'tab' : 'ext'}): ` + `${JSON.stringify(msg)}, opts: ${JSON.stringify(opts)}...`);
    const send = tabMessage ? chrome.tabs.sendMessage.bind(this, opts.tabId) : chrome.runtime.sendMessage;
    send(msg, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve();
    });
  });
}
;// CONCATENATED MODULE: ./src/scripts/chrome/chrome.ts


async function sendPageMessageWithRetry(msg, opts = {}) {
  if (msg === undefined) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const iter = (delay = 10, elapsed = 0, attempt = 0) => {
      setTimeout(async () => {
        elapsed += delay;
        attempt += 1;
        log_log('[sendPageMessageWithRetry] Attempting to send page message.', {
          attempt,
          msg,
          delay,
          elapsed
        });
        try {
          resolve(await sendPageMessage(msg, opts));
        } catch (e) {
          if (elapsed < 500) {
            log_log('[sendPageMessageWithRetry] Unhandled page message send error within 500ms, will try again.', e);
            iter(delay * 2, elapsed, attempt);
          } else if (elapsed < 3000 && e && e['message'] == 'Could not establish connection. Receiving end does not exist.') {
            iter(delay * 2, elapsed, attempt);
          } else {
            reject(e);
          }
        }
      }, delay);
    };
    iter();
  });
}
;// CONCATENATED MODULE: ./src/scripts/chrome/index.ts



;// CONCATENATED MODULE: ./src/scripts/popup/popup_extension.ts




const maxWindowDimensions = {
  width: 1024,
  height: 768
};
const minWindowDimensions = {
  width: 100,
  height: 100
};
const defaultFrameSize = {
  width: 30,
  height: 30
};
let frameSize;
let displayBounds;
async function showPopup({
  page,
  width = 494,
  height = 610,
  message
}) {
  log_log('[popup] Displaying popup.', {
    page,
    width,
    height
  });
  await calculateFrameSize();
  const tab = await createTab({
    page,
    windowId: (await createPopupWindow(width, height)).id
  });
  log_log('[popup] sending page Message', {
    message
  });
  await sendPageMessageWithRetry(message, {
    tabId: tab.id
  });
  log_log(`[popup] Popup displayed (tab ${tab.id}).`, {
    page
  });
}
async function calculateFrameSize() {
  if (frameSize === undefined) {
    let saveFrameSize = false;
    frameSize = await getLocalStorageData('framesize');
    if (!frameSize || !frameSize.width || !frameSize.height) {
      log_log('Window frame size not known, calculating...');
      frameSize = await getFrameSize();
      saveFrameSize = true;
    }
    if (frameSize && frameSize.width >= 0 && frameSize.height >= 0) {
      log_log(`Using window frame size: ${JSON.stringify(frameSize)}`);
      Object.freeze(frameSize);
      if (saveFrameSize) {
        await setLocalStorageData('framesize', frameSize);
      }
    } else {
      warn(`Invalid window frame size, will use default: ${JSON.stringify(frameSize)}`);
      frameSize = defaultFrameSize;
    }
  }
}
async function createTab({
  page,
  windowId
}) {
  return new Promise((resolve, reject) => {
    chrome.tabs.create({
      url: chrome.runtime.getURL(page),
      windowId
    }, tab => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      log_log(`[popup] Tab '${page}' (id:${tab.id}, window:${tab.windowId}) created.`);
      resolve(tab);
    });
  });
}
async function getFrameSize() {
  return new Promise(async resolve => {
    try {
      log_log('[popup] Creating page to measure frame size.');
      let timeoutId = undefined;
      const frameSizeCallback = (frame, _s, responseCallback) => {
        var _fs$width, _fs$height;
        if (frame.type !== 'frame-size-response') {
          return;
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        responseCallback();
        chrome.runtime.onMessage.removeListener(frameSizeCallback);
        const fs = {
          width: frame.width,
          height: frame.height
        };
        fs.width = (_fs$width = fs.width) !== null && _fs$width !== void 0 ? _fs$width : defaultFrameSize.width;
        fs.height = (_fs$height = fs.height) !== null && _fs$height !== void 0 ? _fs$height : defaultFrameSize.height;
        log_log('[popup] Frame size measured.', fs);
        resolve(fs);
      };
      timeoutId = setTimeout(() => {
        chrome.runtime.onMessage.removeListener(frameSizeCallback);
        log_log('[popup] Timed out measuring frame size, using default.');
        resolve(defaultFrameSize);
      }, 3000);
      chrome.runtime.onMessage.addListener(frameSizeCallback);
      await createTab({
        page: 'framesize.html',
        windowId: (await createWindow({
          width: minWindowDimensions.width,
          height: minWindowDimensions.height,
          focused: false
        })).id
      });
    } catch (e) {
      log_log('[popup] Failed to measure frame size, using default.', e);
      resolve(defaultFrameSize);
    }
  });
}
async function createPopupWindow(width, height) {
  if (!displayBounds) {
    displayBounds = await getDisplayBounds(true);
    Object.freeze(displayBounds);
  }
  log_log('[popup] Display work area dimensions', JSON.stringify({
    displayWidth: displayBounds.width,
    displayHeight: displayBounds.height,
    maxWindowWidth: maxWindowDimensions.width,
    maxWindowHeight: maxWindowDimensions.height
  }));
  try {
    log_log('[popup] Creating window using screen info:', JSON.stringify({
      availWidth: displayBounds.width,
      availHeight: displayBounds.height,
      frameWidth: frameSize.width,
      frameHeight: frameSize.height
    }));
    return await createWindow({
      width: width + frameSize.width,
      height: height + frameSize.height,
      left: Math.round((displayBounds.width - width) / 2),
      top: Math.round((displayBounds.height - height) / 2)
    });
  } catch (e) {
    log_error('[popup] Window creation failed:', e);
    log_log('[popup] Last chance retry without centering.');
    return await createWindow({
      width: width + frameSize.width,
      height: height + frameSize.height,
      left: 0,
      top: 0
    });
  }
}
async function createWindow({
  width,
  height,
  left,
  top,
  focused = true
}) {
  if (displayBounds === undefined) {
    displayBounds = await getDisplayBounds(true);
    Object.freeze(displayBounds);
  }
  return new Promise((resolve, reject) => {
    log_log(`[popup] Requested window, width:${width}, height:${height}, left:${left}, top:${top}`);
    ({
      left,
      top,
      width,
      height
    } = normalizeWindowBounds({
      left,
      top,
      width,
      height
    }));
    chrome.windows.create({
      type: 'popup',
      focused,
      width,
      height,
      left,
      top
    }, async w => {
      if (chrome.runtime.lastError) {
        return reject(`failed to display popup: ${chrome.runtime.lastError.message}`);
      } else if (!w) {
        return reject('failed to display popup');
      }
      resolve(w);
    });
  });
}
function normalizeWindowBounds(wBounds) {
  const maxWidth = numRange(displayBounds.width, maxWindowDimensions.width, displayBounds.width);
  const maxHeight = numRange(displayBounds.height, maxWindowDimensions.height, displayBounds.height);
  return {
    width: numRange(wBounds.width, minWindowDimensions.width, maxWidth),
    height: numRange(wBounds.height, minWindowDimensions.height, maxHeight),
    left: wBounds.left ? numRange(wBounds.left, 0, Math.round((maxWidth - wBounds.width) / 2)) : undefined,
    top: wBounds.top ? numRange(wBounds.top, 0, Math.round((maxHeight - wBounds.height) / 2)) : undefined
  };
}
function numRange(value, min, max) {
  return Math.max(Math.min(value, max), min);
}
async function getDisplayBounds(isPrimary) {
  return new Promise(resolve => {
    chrome.system.display.getInfo(displays => {
      let display;
      for (const disp of displays) {
        if (disp.isPrimary === isPrimary) {
          display = disp;
        }
      }
      const bounds = display.workArea;
      if (bounds.width <= 0) {
        warn('Invalid display bounds width returned:', bounds.width);
        bounds.width = maxWindowDimensions.width;
      }
      if (bounds.height <= 0) {
        warn('Invalid display bounds height returned:', bounds.height);
        bounds.height = maxWindowDimensions.height;
      }
      resolve(bounds);
    });
  });
}
;// CONCATENATED MODULE: ./src/scripts/control/login.ts



async function displayLoginWindow({
  printJob = undefined,
  urlBase = undefined,
  showRememberMe,
  showUsernameLogin = false,
  showGoogleLogin = false,
  useCloudPrint = false,
  usePrintDeploy = false
}) {
  log_log('[displayLoginWindow]: Displaying sign-in pop-up.', {
    showRememberMe,
    showUsernameLogin,
    showGoogleLogin,
    useCloudPrint,
    usePrintDeploy
  });
  await showPopup({
    page: 'login.html',
    height: 675,
    message: {
      type: 'login-window-init',
      printJob,
      showUsernameLogin,
      showGoogleLogin,
      showRememberMe,
      urlBase,
      useCloudPrint,
      usePrintDeploy
    }
  });
}
async function closeLoginDialog() {
  log_log('[closeLoginDialog] sending message to close login window');
  const closeLoginWindowMessage = {
    type: 'close-login-window',
    msg: 'close window'
  };
  await sendPageMessage(closeLoginWindowMessage);
}
async function sendDisplayErrorMessage(errMsg) {
  log_log('[sendDisplayErrorMessage]: sending error to login window', {
    errMsg
  });
  const displayErrorMessage = {
    type: 'display-error',
    errMsg: errMsg
  };
  await sendPageMessageWithRetry(displayErrorMessage);
}
;// CONCATENATED MODULE: ./src/scripts/control/index.ts

// EXTERNAL MODULE: ./node_modules/aes-js/index.js
var aes_js = __webpack_require__(8826);
;// CONCATENATED MODULE: ./src/scripts/encryption.ts






function isChromeEncryptionEnabled(urlBase, isCloudPrintJob) {
  return new Promise(resolve => {
    if (isCloudPrintJob) {
      log_log('[isChromeEncryptionEnabled] Chrome encryption is off for cloud print jobs');
      resolve(false);
      return false;
    }
    log_log(`[isChromeEncryptionEnabled] Checking if Chrome encryption should be enabled for '${urlBase}'...`);
    fetch(urlBase + '/server-config', {
      method: 'GET',
      headers: {
        'client-type': globals_GetClientVersionID()
      }
    }).then(response => {
      if (response.status != 200) {
        resolve(false);
        log_log(`[isChromeEncryptionEnabled] Failed to fetch server-config. HTTP ${response.status} 
					${response.statusText}`);
        return;
      }
      return response.json();
    }).then(resp => {
      if ('chromeEncryption' in resp) {
        resolve(resp.chromeEncryption);
      } else {
        resolve(false);
      }
    }).catch(error => {
      console.error('[isChromeEncryptionEnabled] Error:', error);
      resolve(false);
    });
  });
}
function randomBytes(length) {
  const array = new Uint8Array(length);
  self.crypto.getRandomValues(array);
  return array;
}
async function encryptDocument(doc, title, printerId) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ev => {
      log_log('[encryptDocument] FileReader.onload ready for encryption of document with type:', doc.type);
      const bytes = new Uint8Array(ev.target.result);
      const paddedBytes = aes_js.padding.pkcs7.pad(bytes);
      const key = randomBytes(32);
      const iv = randomBytes(16);
      const aes = new aes_js.ModeOfOperation.cfb(key, iv, 16);
      const encryptedBytes = aes.encrypt(paddedBytes);
      const blob = new Blob([encryptedBytes], {
        type: doc.type
      });
      const urlBase = printerId.replace(/\/printers\/.*/i, '');
      const keyHex = aes_js.utils.hex.fromBytes(key);
      const ivHex = aes_js.utils.hex.fromBytes(iv);
      getRsaPublicKey(urlBase).then(rsa => {
        log_log(`[encryptDocument] encrypting ${(bytes.length / 1024).toFixed(2)} KiB document... `);
        const keyHexEncrypted = rsa.encrypt(keyHex);
        resolve({
          blob,
          key: keyHexEncrypted,
          iv: ivHex,
          title: rsa.encrypt(title)
        });
      }).catch(e => {
        log_log('[encryptDocument] getRsaPublicKey error', e);
        reject(e);
      });
    };
    reader.readAsArrayBuffer(doc);
  });
}
;// CONCATENATED MODULE: ./src/scripts/flag/flag.ts
var Flag;
(function (Flag) {
  Flag["CloudPrintForceRTC"] = "CloudPrintForceRTC";
  Flag["ForceManagedUserMode"] = "ForceManagedUserMode";
})(Flag || (Flag = {}));
class Flags {
  constructor(storage) {
    this.storage = storage;
  }
  async get(flag) {
    return (await this.storage.get(flag)) === true;
  }
  set(flag, enabled) {
    return this.storage.set(flag, enabled);
  }
}
;// CONCATENATED MODULE: ./src/scripts/flag/index.ts

;// CONCATENATED MODULE: ./src/scripts/flagstorage/flagstorage.ts
class ChromeFlagStorage {
  constructor(storage = chrome.storage.local, flagsKey = 'flags') {
    this.storage = storage;
    this.flagsKey = flagsKey;
  }
  async get(name) {
    const flags = await this.getFlags();
    const val = flags[name];
    if (val === undefined) {
      return undefined;
    }
    return val === true;
  }
  async set(name, enabled) {
    const flags = await this.getFlags();
    flags[name] = enabled;
    return this.setFlags(flags);
  }
  getFlags() {
    return new Promise((res, rej) => {
      this.storage.get(this.flagsKey, d => {
        if (chrome.runtime.lastError) {
          return rej(chrome.runtime.lastError);
        }
        return res(d[this.flagsKey] || {});
      });
    });
  }
  setFlags(flags) {
    return new Promise((res, rej) => {
      this.storage.set({
        [this.flagsKey]: flags
      }, () => {
        if (chrome.runtime.lastError) {
          return rej(chrome.runtime.lastError);
        }
        return res();
      });
    });
  }
}
;// CONCATENATED MODULE: ./src/scripts/listener/externalmessage/externalmessage_extension.ts


function registerExternalMessageListener() {
  log_log('Registering external message listener for extension...');
  chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
    log_log(`[onMessageExternal] message received from ${sender.url}`);
    if (request.link.href !== undefined) {
      saveBYODLinkHandler(request.link.href, sendResponse);
    } else {
      log_log('[onMessageExternal] invalid BYOD link.');
    }
  });
}
function saveBYODLinkHandler(link, sendResponse) {
  log_log(`[onMessageExternal] saving BYOD link: ${link}`);
  saveBYODLink(link).then(function () {
    sendResponse({
      message: 'link set up successfully'
    });
  });
}
;// CONCATENATED MODULE: ./src/scripts/listener/install/install_extension.ts








var ExtensionInstallType = chrome.management.ExtensionInstallType;
var OnInstalledReason = chrome.runtime.OnInstalledReason;
const flags = new Flags(new ChromeFlagStorage());
const requiredSettings = ['printTokenCache', 'CloudPrintInviteLinks'];
async function showWelcome(importSuccessful) {
  if (importSuccessful) {
    await showPopup({
      page: 'index-migrated.html',
      height: 720
    });
  } else {
    await showPopup({
      page: 'index.html',
      height: 645
    });
  }
}
function registerInstallListener() {
  chrome.runtime.onInstalled.addListener(async function (details) {
    chrome.management.getSelf(async ext => {
      const extInfo = `${ext.name} - ${ext.version} ('${ext.type}')`;
      log_log(`[install] ${extInfo}, installType: ${ext.installType}, reason: ${details.reason}`);
      if (ext.installType === 'development') {
        dumpPermissionWarnings();
      }
      await removeLocalStorageData('framesize');
      const importSuccessful = await tryImportAppSettings(ext);
      if (details.reason === OnInstalledReason.INSTALL && ext.installType !== ExtensionInstallType.ADMIN) {
        await showWelcome(importSuccessful);
        log_log('[install] Displayed welcome dialog.');
      } else if (details.reason === OnInstalledReason.UPDATE) {
        log_log(`[install] Updated '${ext.type}' from '${details.previousVersion}' to '${ext.version}'...`);
      }
    });
  });
}
async function tryImportAppSettings(ext) {
  return new Promise(async resolve => {
    let importResult = false;
    const forcedManagedUserMode = await flags.get(Flag.ForceManagedUserMode);
    if (forcedManagedUserMode) {
      warn('[App data request] Running in forced managed mode.');
    }
    if (ext.installType === ExtensionInstallType.ADMIN || forcedManagedUserMode) {
      log_log('[App data request] managed profile - not importing app settings.');
    } else {
      log_log('[App data request] BYOD user detected.');
      const imported = await getLocalStorageData('settingsImportAttempted');
      if (!imported) {
        importResult = await importAppSettings();
      } else {
        log_log('[App data request] data already imported.');
        importResult = true;
      }
    }
    resolve(importResult);
  });
}
async function importAppSettings() {
  log_log('[App data request] looking for settings to import from Chrome app...');
  return new Promise(resolve => {
    chrome.runtime.sendMessage(_APP_ID, {
      requestType: 'IMPORT_KEY_VAL'
    }, async function (response) {
      let importResult;
      if (chrome.runtime.lastError) {
        log_log('[App data request] no app response. No data imported, lastError:', chrome.runtime.lastError.message);
        importResult = false;
      } else if (!response) {
        warn('[App data request] got empty app response. No data imported');
        importResult = false;
      } else {
        log_log('[App data request] local storage value received from app:', JSON.stringify(response));
        importResult = await saveSettingsValues(response);
      }
      await setLocalStorageData('settingsImportAttempted', true);
      log_log('[App data request] requesting app self-uninstall');
      chrome.runtime.sendMessage(_APP_ID, {
        requestType: 'DELETE_SELF'
      }, function (uninstallResponse) {
        if (chrome.runtime.lastError) {
          log_log('[App data request] no app response. lastError:', chrome.runtime.lastError.message);
        } else if (uninstallResponse) {
          log_log('[App data request] App uninstalled successfully. Mobility Print now works as a Chrome extension.');
        } else {
          warn('[App data request] could not confirm app uninstallation, app may need to be manually removed.');
        }
      });
      log_log('[App data request] reinitializing cache to utilize imported settings..');
      await initCache();
      resolve(importResult);
    });
  });
}
async function saveSettingsValues(response) {
  return new Promise(async resolve => {
    let importResult = false;
    const settings = Object.keys(response);
    for (let i = 0; i < settings.length; i++) {
      const setting = settings[i];
      if (response.hasOwnProperty(setting)) {
        if (requiredAppSetting(setting)) {
          const settingValue = response[setting];
          if (settingValue) {
            try {
              await setLocalStorageData(setting, settingValue);
              log_log(`[App data request] ${setting} saved to storage.`);
              importResult = true;
            } catch (e) {
              log_error(`[App data request] failed to save ${setting} data.`, e);
            }
          } else {
            log_log(`[App data request] invalid value for ${setting} (${settingValue}). Skipping import.`);
          }
        }
      }
    }
    resolve(importResult);
  });
}
function requiredAppSetting(appSetting) {
  return requiredSettings.includes(appSetting);
}
function dumpPermissionWarnings() {
  chrome.management.getPermissionWarningsByManifest(JSON.stringify(chrome.runtime.getManifest()), warnings => {
    for (const warning of warnings) warn(`Manifest permission warning: ${warning}`);
  });
}
;// CONCATENATED MODULE: ./src/scripts/migrateapp/byod_popup.ts






const show = true;
const showOnOrAfterApr = new Date(2024, 3, 30);
const showOnOrAfterJul = new Date(2024, 6, 9);
const showOnOrAfterSep = new Date(2024, 8, 3);
const now = new Date(Date.now());
const migratePopupLastShownApr = 'migratePopupLastShownApr';
const migratePopupLastShownJul = 'migratePopupLastShownJul';
const migratePopupLastShownSep = 'migratePopupLastShownSep';
const byod_popup_flags = new Flags(new ChromeFlagStorage());
async function migrateAppPopupApr() {
  if (isApp()) {
    if (show && now >= showOnOrAfterApr && now < showOnOrAfterSep) {
      const forcedManagedUserMode = await byod_popup_flags.get(Flag.ForceManagedUserMode);
      const isManagedInstall = await IsManagedInstall();
      const isManaged = forcedManagedUserMode || isManagedInstall;
      if (!isManaged) {
        const lastShown = await getLocalStorageData(migratePopupLastShownApr);
        if (!lastShown || typeof lastShown === 'number' && lastShown < showOnOrAfterApr.getTime()) {
          createPopup('Apr-BYOD', migratePopupLastShownApr);
        } else {
          log_log(`BYOD/non-managed app - migration popup last displayed: ${lastShown}`);
        }
      }
    }
  }
}
async function migrateAppPopupJul(platformOS) {
  if (isApp() && platformOS !== 'cros') {
    if (show && now >= showOnOrAfterJul && now < showOnOrAfterSep) {
      const lastShown = await getLocalStorageData(migratePopupLastShownJul);
      if (!lastShown || typeof lastShown === 'number' && lastShown < showOnOrAfterJul.getTime()) {
        const forcedManagedUserMode = await byod_popup_flags.get(Flag.ForceManagedUserMode);
        const isManagedInstall = await IsManagedInstall();
        const isManaged = forcedManagedUserMode || isManagedInstall;
        createPopup(isManaged ? 'Jul-Managed' : 'Jul-BYOD', migratePopupLastShownJul);
      }
    }
  }
}
async function migrateAppPopupSep(displayType) {
  if (isApp()) {
    if (show && now >= showOnOrAfterSep) {
      const lastShown = await getLocalStorageData(migratePopupLastShownSep);
      if (displayType === 'atPrint' || !lastShown || typeof lastShown === 'number' && lastShown < showOnOrAfterSep.getTime()) {
        const forcedManagedUserMode = await byod_popup_flags.get(Flag.ForceManagedUserMode);
        const isManagedInstall = await IsManagedInstall();
        const isManaged = forcedManagedUserMode || isManagedInstall;
        createPopup(isManaged ? 'Sep-Managed' : 'Sep-BYOD', migratePopupLastShownSep);
      }
    }
  }
}
function createPopup(popupType, timeStampKey) {
  const screenWidth = screen.availWidth;
  const screenHeight = screen.availHeight;
  const width = 494;
  const height = 187;
  let message = 'upgradeMessageBYOD.html';
  if (popupType === 'Sep-Managed' || popupType === 'Jul-Managed') {
    message = 'upgradeMessageMgd.html';
  }
  try {
    log_log('[messagePopup] Attempting to show BYOD upgrade message');
    chrome.app.window.create(message, {
      frame: 'none',
      resizable: false,
      outerBounds: {
        width: width,
        height: height,
        left: Math.round((screenWidth - width) / 2),
        top: Math.round((screenHeight - height) / 2)
      }
    });
  } catch (e) {
    warn(`[messagePopup] BYOD upgrade message could not be shown, error: ${e}`);
  }
  log_log('[messagePopup] Attempting to save that the message has been shown');
  setLocalStorageData(timeStampKey, now.getTime()).then(res => {
    log_log(`[messagePopup] Saved date (${popupType}): ${res} to local storage`);
  });
}
;// CONCATENATED MODULE: ./src/scripts/network/ip.ts
function isIPv4(value) {
  return !!value.match(/^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/gim);
}
;// CONCATENATED MODULE: ./src/scripts/chrome/network/network_extension.ts



const serviceType = '_banksia._tcp.local';
const minChromeVersion = 114;
const requiredChromeMessage = `Chrome ${minChromeVersion}+ required. Chrome version: ${getChromeOSVersion()}`;
function isSupportedChromeVersion() {
  return getChromeOSVersionMajor() >= minChromeVersion;
}
async function getLocalIPAddresses() {
  return new Promise(async resolve => {
    try {
      if (isSupportedChromeVersion()) {
        chrome.system.network.getNetworkInterfaces(interfaces => {
          const localIPAddresses = interfaces.map(i => i.address).filter(isIPv4);
          log_log('[localIPAddresses] detected: ', localIPAddresses);
          resolve(localIPAddresses);
        });
        return;
      } else {
        log_log('[localIPAddresses] Chrome version not supported.', requiredChromeMessage);
      }
    } catch (e) {
      log_error('[localIPAddresses] chrome.system.network.getNetworkInterfaces failed.', e.message);
    }
    warn('[localIPAddresses] Local IP address unknown falling back to [0.0.0.0].');
    resolve(['0.0.0.0']);
  });
}
function startMDNSListener(onServiceList) {
  try {
    if (isSupportedChromeVersion()) {
      chrome.mdns.onServiceList.addListener(onServiceList, {
        serviceType
      });
      setInterval(() => {
        chrome.mdns.onServiceList.removeListener(onServiceList);
        chrome.mdns.onServiceList.addListener(onServiceList, {
          serviceType
        });
        chrome.mdns.forceDiscovery(() => {
          log_log('[MDNS:mdnsListener] ran re-discovery...');
        });
      }, 6000 * 1000);
      log_log('[MDNS:mdnsListener] registered...');
      return;
    } else {
      log_log('[MDNS:mdnsListener] Chrome version not supported.', requiredChromeMessage);
    }
  } catch (e) {
    log_error('chrome.mdns.onServiceList failed.', e.message);
  }
  warn('mDNS discovery will not work on this client.');
}
;// CONCATENATED MODULE: ./src/scripts/constants.ts
const MOBILITY_PRINT_SERVER_DEFAULT_PORT = 9163;
const MOBILITY_PRINT_SERVER_DEFAULT_PROTOCOL = 'http';
const MOBILITY_PRINT_DNS_DEFAULT_ZONE_NAME = 'pc-printer-discovery';
;// CONCATENATED MODULE: ./src/scripts/network/dns.ts

const dns = [];
const DNS_MAX_SERVERS = 20;
dns.push(MOBILITY_PRINT_SERVER_DEFAULT_PROTOCOL + '://rpc.' + MOBILITY_PRINT_DNS_DEFAULT_ZONE_NAME + ':' + MOBILITY_PRINT_SERVER_DEFAULT_PORT);
for (let i = 0; i < DNS_MAX_SERVERS; i++) {
  dns.push(MOBILITY_PRINT_SERVER_DEFAULT_PROTOCOL + '://rpc.' + MOBILITY_PRINT_DNS_DEFAULT_ZONE_NAME + '-' + (i + 1) + ':' + MOBILITY_PRINT_SERVER_DEFAULT_PORT);
}
dns.push(MOBILITY_PRINT_SERVER_DEFAULT_PROTOCOL + '://localhost:' + MOBILITY_PRINT_SERVER_DEFAULT_PORT);
const dnsUrls = dns;
;// CONCATENATED MODULE: ./src/scripts/network/mdns.ts



let mdnsUrls = [];
let overrideUrl;
const mdnsRecordExpiry = 60 * 60 * 1000;
function registerMDNSListener() {
  chrome.storage.local.get('overrideUrl', d => {
    if (d && d.overrideUrl) {
      overrideUrl = d.overrideUrl;
      log_log('[MDNS:mdnsListener] override URL set', overrideUrl);
    }
  });
  chrome.storage.local.get('mdnsUrls', d => {
    if (d && d.mdnsUrls) {
      mdnsUrls = d.mdnsUrls;
      log_log('[MDNS:mdnsListener] loaded mDNS URLs from storage', mdnsUrls);
    }
  });
  log_log('[MDNS:mdnsListener] starting...');
  startMDNSListener(services => {
    log_log('[MDNS:mdnsListener] all services so far: ', mdnsUrls);
    const now = Date.now();
    mdnsUrls = mdnsUrls.filter(i => now - i.addedOn < mdnsRecordExpiry);
    log_log('[MDNS:mdnsListener] all services after removing old records: ', mdnsUrls);
    log_log('[MDNS:mdnsListener] found services: ', services);
    services.filter(s => s.serviceHostPort && s.ipAddress).map(s => 'http://' + s.ipAddress + s.serviceHostPort.substring(s.serviceHostPort.lastIndexOf(':'))).filter(u => mdnsUrls.findIndex(i => i.url == u) === -1).forEach(u => {
      mdnsUrls.push({
        url: u,
        addedOn: now
      });
      log_log('[MDNS:mdnsListener] found valid non duplicate service: ', u);
    });
    log_log('[MDNS:mdnsListener] storing discovered services after adding new: ', mdnsUrls);
    chrome.storage.local.set({
      mdnsUrls: mdnsUrls
    });
  });
}
function dnsDiscoveredUrls() {
  log_log(`[MDNS:dnsDiscoveredUrls] ${mdnsUrls.length} mDNS server discovered`, mdnsUrls);
  if (overrideUrl) {
    log_log('[MDNS:dnsDiscoveredUrls] using override server URL for discovery', overrideUrl);
    return [overrideUrl];
  }
  return dnsUrls.concat(mdnsUrls.map(i => i.url));
}
;// CONCATENATED MODULE: ./src/scripts/printdeploy/googleauth.ts

class GoogleOpenIDOAuthProvider {
  getAccessToken() {
    return getGoogleAuthInfo(true).then(authInfo => {
      return {
        accessToken: authInfo.token
      };
    });
  }
  getUserInfo(oauthToken) {
    return getGSuiteUserInfo(oauthToken.accessToken).then(userInfo => {
      return {
        email: userInfo.email
      };
    });
  }
}
;// CONCATENATED MODULE: ./src/scripts/printdeploy/oauth.ts

const OAuthProviderIDs = {
  Google: 'google'
};
function toPrintDeployTokenInfo(session) {
  return {
    authMethod: session.providerID,
    token: session.sessionToken
  };
}
const printDeployOauthProviders = new Map();
printDeployOauthProviders.set(OAuthProviderIDs.Google, new GoogleOpenIDOAuthProvider());
;// CONCATENATED MODULE: ./src/scripts/printdeploy/printdeploy.types.ts
const PrintDeployAuthMethods = {
  Username: 'username',
  Google: 'google'
};
;// CONCATENATED MODULE: ./src/scripts/printdeploy/client/encryption.ts


const RSA_STRING_MAXLEN = 245;
class ClientEncryptionService {
  constructor(rsaKey, useAuthHeaderEncryption = false) {
    this.rsaKey = rsaKey;
    this.useAuthHeaderEncryption = useAuthHeaderEncryption;
  }
  encryptRequestBody(body) {
    const jsonBodyStr = JSON.stringify(body);
    if (this.rsaKey) {
      return this.encryptLongString(this.rsaKey, jsonBodyStr);
    }
    return jsonBodyStr;
  }
  encryptAuthHeaderValue(headerValue) {
    if (this.useAuthHeaderEncryption && this.rsaKey) {
      const encryptedHeader = this.encryptLongString(this.rsaKey, headerValue);
      if (encryptedHeader) {
        return encryptedHeader;
      }
    }
    return headerValue;
  }
  encryptLongString(rsaKey, str) {
    if (str.length <= RSA_STRING_MAXLEN) {
      return rsaKey.encrypt(str);
    }
    try {
      const pattern = `.{1,${RSA_STRING_MAXLEN}}`;
      return str.match(new RegExp(pattern, 'g')).map(s => rsaKey.encrypt(s)).reduce((acc, encryptedChunk) => acc + ',' + encryptedChunk);
    } catch (e) {
      console.error('encryption failed', e);
      return undefined;
    }
  }
}
;// CONCATENATED MODULE: ./src/scripts/printdeploy/client/client.ts




const DEFAULT_PRINT_DEPLOY_HTTPS_PORT = 9174;
const DEFAULT_PRINT_DEPLOY_HTTP_PORT = 9173;
class PrintDeployClientBuilder {
  constructor(host) {
    this.useHTTPSEncryption = () => new ClientEncryptionService();
    this.host = host;
  }
  withAccessibleTLSPort(port) {
    this.accessibleTLSPort = port;
    return this;
  }
  withStrictSSL(strictSSL) {
    this.strictSSL = strictSSL;
    return this;
  }
  withOAuthProviders(oauthProviders) {
    this.oauthProviders = oauthProviders;
    return this;
  }
  async build() {
    if (!this.oauthProviders) {
      this.oauthProviders = new Map();
    }
    if (this.hasCustomAccessibleTLSPort() || this.strictSSL) {
      const port = this.accessibleTLSPort || DEFAULT_PRINT_DEPLOY_HTTPS_PORT;
      const serverBaseURL = `https://${this.host}:${port}`;
      const client = new PDClient(serverBaseURL, this.oauthProviders, this.useHTTPSEncryption());
      return Promise.resolve(client);
    }
    const httpsServerBaseURL = `https://${this.host}:${DEFAULT_PRINT_DEPLOY_HTTPS_PORT}`;
    return fetch(httpsServerBaseURL).then(() => {
      const client = new PDClient(httpsServerBaseURL, this.oauthProviders, this.useHTTPSEncryption());
      return Promise.resolve(client);
    }).catch(_ => {
      const httpBaseUrl = `http://${this.host}:${DEFAULT_PRINT_DEPLOY_HTTP_PORT}`;
      return this.useEncryptedHTTP(httpBaseUrl).then(encryptionService => {
        return new PDClient(httpBaseUrl, this.oauthProviders, encryptionService);
      });
    });
  }
  async useEncryptedHTTP(httpBaseUrl) {
    if (httpBaseUrl.startsWith('https://')) {
      return Promise.reject('only use encrypted HTTP if the target host doesn\'t support HTTPS');
    }
    return getRsaPublicKey(httpBaseUrl).then(async rsaKey => {
      const useAuthHeaderEncryption = await this.isAuthHeaderEncryptionSupported(httpBaseUrl);
      return new ClientEncryptionService(rsaKey, useAuthHeaderEncryption);
    });
  }
  async isAuthHeaderEncryptionSupported(httpBaseUrl) {
    return fetch(`${httpBaseUrl}/${PrintDeployPaths.GET_CONFIG}`).then(resp => {
      return resp.status === 200;
    });
  }
  hasCustomAccessibleTLSPort() {
    return this.accessibleTLSPort && this.accessibleTLSPort !== 0 && this.accessibleTLSPort !== DEFAULT_PRINT_DEPLOY_HTTPS_PORT;
  }
}
var PrintDeployPaths;
(function (PrintDeployPaths) {
  PrintDeployPaths["LOGIN"] = "deploy/login";
  PrintDeployPaths["GET_PRINTERS"] = "deploy/printers";
  PrintDeployPaths["GET_CONFIG"] = "deploy/config";
  PrintDeployPaths["CREATE_OAUTH_SESSION"] = "deploy/oauth/session";
})(PrintDeployPaths || (PrintDeployPaths = {}));
const PrintDeployUnauthorizedError = 'Unauthorized';
class PDClient {
  constructor(serverBaseURL, oauthProviders, encryptionService) {
    this.encryptionService = encryptionService;
    this.providers = oauthProviders;
    this.serverBaseURL = serverBaseURL;
  }
  async login(credentials) {
    const username = credentials.username;
    const password = credentials.password;
    if (!username || !password) {
      return Promise.reject('missing required username/password to get PaperCut token');
    }
    const request = {
      headers: this.generateHeaders(),
      method: 'POST',
      body: this.encryptionService.encryptRequestBody({
        username,
        password
      })
    };
    return fetch(`${this.serverBaseURL}/${PrintDeployPaths.LOGIN}`, request).then(r => getResponseBody(r)).then(body => {
      return {
        authMethod: PrintDeployAuthMethods.Username,
        token: body.Token
      };
    });
  }
  async getConfig() {
    const headers = this.generateHeaders();
    return fetch(`${this.serverBaseURL}/${PrintDeployPaths.GET_CONFIG}`, {
      headers
    }).then(r => getResponseBody(r));
  }
  async getPrinters(tokenInfo, clientInfo) {
    const fetchPrinters = clientInfo => {
      const headers = this.generateHeaders(tokenInfo);
      const request = {
        headers: headers,
        method: 'POST',
        body: this.encryptionService.encryptRequestBody(clientInfo)
      };
      return fetch(`${this.serverBaseURL}/${PrintDeployPaths.GET_PRINTERS}`, request);
    };
    return fetchPrinters(clientInfo).then(handleInvalidToken).then(resp => getResponseBody(resp)).then(body => body.printers);
    function handleInvalidToken(resp) {
      if (resp.status === 401) {
        return Promise.reject(PrintDeployUnauthorizedError);
      }
      return Promise.resolve(resp);
    }
  }
  async createOAuthSession(providerID) {
    const oAuthProvider = this.providers.get(providerID);
    if (!oAuthProvider) {
      console.error('no such provider');
      return Promise.reject(`no registered provider for providerID=${providerID}`);
    }
    const oAuthToken = await oAuthProvider.getAccessToken();
    const url = `${this.serverBaseURL}/${PrintDeployPaths.CREATE_OAUTH_SESSION}`;
    const reqBody = {
      providerId: providerID,
      accessToken: oAuthToken.accessToken
    };
    return fetch(url, {
      method: 'POST',
      headers: this.generateHeaders(),
      body: this.encryptionService.encryptRequestBody(reqBody)
    }).then(resp => {
      if (resp.status === 403) {
        return Promise.reject('Unknown user');
      }
      return getResponseBody(resp);
    }).then(async body => {
      const sessionInfo = {
        providerID: providerID,
        username: body.username,
        sessionToken: body.sessionToken,
        oauthToken: oAuthToken,
        email: body.email
      };
      return Promise.resolve(sessionInfo);
    });
  }
  getServerBaseURL() {
    return this.serverBaseURL;
  }
  generateHeaders(tokenInfo) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
    if (tokenInfo) {
      const header = `Bearer ${tokenInfo.token}`;
      headers['Authorization'] = this.encryptionService.encryptAuthHeaderValue(header);
      if (tokenInfo.authMethod !== PrintDeployAuthMethods.Username) {
        headers['PrintDeployAuthenticationType'] = tokenInfo.authMethod;
      }
    }
    return headers;
  }
}
;// CONCATENATED MODULE: ./src/scripts/printdeploy/client/clientinfo.ts



async function getClientInfo() {
  return Promise.all([getClientId(), getPlatformInfo(), getLocalIPAddresses()]).then(([clientId, platformInfo, ipAddresses]) => {
    const chromeOSVersion = getChromeOSVersion();
    const clientInfo = {
      machine: {
        hostname: clientId,
        os: {
          name: 'chrome',
          version: chromeOSVersion,
          arch: platformInfo.arch
        },
        ipAddresses: ipAddresses,
        activeDirectoryDomainName: ''
      }
    };
    return clientInfo;
  });
}
;// CONCATENATED MODULE: ./src/scripts/printdeploy/client/index.ts



;// CONCATENATED MODULE: ./src/scripts/printdeploy/storage.ts

const OAUTH_SESSION_TOKEN_KEY = 'OauthSession';
const PRINT_DEPLOY_AUTH_REPO = 'printDeployAuthRepo';
const PRINT_DEPLOY_CONFIG_KEY = 'printDeployConfig';
const PAPERCUT_AUTH_KEY = 'papercutAuthCookie';
class PrintDeployLocalStorage {
  async getCachedConfig() {
    return getLocalStorageData(PRINT_DEPLOY_CONFIG_KEY);
  }
  getCachedOAuthSessionToken() {
    return this.getCachedAuthToken(OAUTH_SESSION_TOKEN_KEY);
  }
  getCachedPrintDeployToken() {
    return this.getCachedAuthToken(PAPERCUT_AUTH_KEY);
  }
  async getCachedMobilityPrintServerToken(serverBaseUrl) {
    return this.getCachedAuthToken(serverBaseUrl);
  }
  async cacheConfig(config) {
    return setLocalStorageData(PRINT_DEPLOY_CONFIG_KEY, config);
  }
  async cacheMobilityPrintServerToken(serverBaseUrl, token) {
    return this.cacheAuthToken(serverBaseUrl, token);
  }
  async cachePaperCutToken(token) {
    return this.cacheAuthToken(PAPERCUT_AUTH_KEY, token);
  }
  async cacheOAuthSessionToken(sessionToken) {
    return this.cacheAuthToken(OAUTH_SESSION_TOKEN_KEY, sessionToken);
  }
  async removeMobilityPrintServerToken(server) {
    const authRepo = await getLocalStorageData(PRINT_DEPLOY_AUTH_REPO);
    if (!authRepo) {
      return Promise.resolve({});
    }
    delete authRepo[server];
    return setLocalStorageData(PRINT_DEPLOY_AUTH_REPO, authRepo);
  }
  async cacheAuthToken(key, value) {
    let authRepo = await getLocalStorageData(PRINT_DEPLOY_AUTH_REPO);
    if (!authRepo) {
      authRepo = {};
    }
    authRepo[key] = value;
    await setLocalStorageData(PRINT_DEPLOY_AUTH_REPO, authRepo);
    return Promise.resolve(value);
  }
  async getCachedAuthToken(key) {
    return getLocalStorageData(PRINT_DEPLOY_AUTH_REPO).then(authRepo => {
      if (!authRepo) {
        return undefined;
      }
      return authRepo[key];
    });
  }
  invalidateAllCachedTokens() {
    return setLocalStorageData(PRINT_DEPLOY_AUTH_REPO, {});
  }
}
const printDeployStorage = new PrintDeployLocalStorage();
;// CONCATENATED MODULE: ./src/scripts/printdeploy/printdeploy.ts











var ManagedStorageKeys;
(function (ManagedStorageKeys) {
  ManagedStorageKeys["PrintDeployServerHosts"] = "PrintDeployServerHosts";
  ManagedStorageKeys["AccessiblePrintDeployTLSPort"] = "AccessiblePrintDeployTLSPort";
  ManagedStorageKeys["StrictSSLCheckingEnabled"] = "StrictSSLCheckingEnabled";
})(ManagedStorageKeys || (ManagedStorageKeys = {}));
async function getPrintersFromPrintDeploy() {
  const pdHost = await getPreconfiguredPrintDeployServer();
  if (!pdHost) {
    log_log('[getPreconfiguredPrintDeployServer] no Print Deploy servers preconfigured');
    return [[], false];
  }
  try {
    log_log('[getPrintersFromPrintDeploy] found Print Deploy server:', pdHost);
    const printers = await getPrintersFromPrintDeployHost(pdHost);
    return [printers, true];
  } catch (e) {
    log_log('[getPrintersFromPrintDeployHost] failed to get printers:', e);
    return [[], true];
  }
}
async function getPreconfiguredPrintDeployServer() {
  return getManagedStorageData(ManagedStorageKeys.PrintDeployServerHosts).then(hosts => {
    if (!hosts || hosts.length === 0) {
      return null;
    }
    return hosts[0];
  });
}
async function getPrintDeployClient(pdHost) {
  const strictSSLCheckingEnabled = await getManagedStorageData(ManagedStorageKeys.StrictSSLCheckingEnabled);
  const accessibleTLSPort = await getManagedStorageData(ManagedStorageKeys.AccessiblePrintDeployTLSPort);
  const pdClient = await new PrintDeployClientBuilder(pdHost).withAccessibleTLSPort(accessibleTLSPort).withStrictSSL(strictSSLCheckingEnabled).withOAuthProviders(printDeployOauthProviders).build();
  log_log(`[printDeployClientBuilder] built PDClient with serverBaseURL=${pdClient.getServerBaseURL()}`);
  return Promise.resolve(pdClient);
}
async function getPrintersFromPrintDeployHost(pdHost) {
  const pdClient = await getPrintDeployClient(pdHost);
  let clientConfig;
  try {
    clientConfig = await pdClient.getConfig();
  } catch (e) {
    log_log('[pdClient.getConfig] failed to fetch config', e);
    return [];
  }
  log_log('[pdClient.getConfig] received config from server:', clientConfig);
  await printDeployStorage.cacheConfig(clientConfig);
  return getPrintersForClient(pdClient).then(getAndSaveTokensForPrinters).then(mapPrintersForPrintProvider);
}
async function getAndSaveTokensForPrinters(printers) {
  log_log('[getAndSaveTokensForPrinters]', printers);
  const clientConfig = await printDeployStorage.getCachedConfig();
  const mpServers = printers.map(printer => {
    return getSecureURLForMPServer(getUrlBaseOfPrinterUrl(printer.connection.name), clientConfig);
  });
  const uniqueMPServers = Array.from(new Set(mpServers));
  log_log(`[printdeploy.uniqueMPServers] found ${uniqueMPServers.length} unique MP servers from the discovered queues`, uniqueMPServers);
  return Promise.all(uniqueMPServers.map(getMobilityPrintTokenIfMissing)).then(() => printers);
  async function getMobilityPrintTokenIfMissing(mpServerURL) {
    return printDeployStorage.getCachedMobilityPrintServerToken(mpServerURL).then(token => token ? token : fetchTokenFromMobilityPrintServer(mpServerURL, inMemoryCreds)).then(token => {
      return inMemoryCreds.rememberMe ? printDeployStorage.cacheMobilityPrintServerToken(mpServerURL, token) : token;
    }).catch(e => {
      log_log(`[getMobilityPrintToken] failed to get token for MP server ${mpServerURL} via HTTPS. This may happen ` + 'if the MP server isn\'t using a non-zero length CA-signed certificate. We will use encrypted HTTP ' + 'instead. error:', e.message || e);
      return null;
    });
  }
}
function getSecureURLForMPServer(mpServerURL, config) {
  const server = mpServerURL.replace(/http:/gi, 'https:');
  let tlsPort = config === null || config === void 0 ? void 0 : config.AccessibleMobilityPrintTLSPort;
  if (!tlsPort || tlsPort == 0) {
    tlsPort = 9164;
  }
  return server.replace(/:9163/gi, `:${tlsPort}`);
}
async function getPrintersForClient(pdClient) {
  const fetchPrinters = () => {
    log_log('[fetchPrinters] getting print deploy token');
    return getPrintDeployToken(pdClient).then(tokenInfo => {
      return getClientInfo().then(clientInfo => {
        log_log(`[getPrinters] getting printers with the following user details: ${JSON.stringify(clientInfo)}`);
        return pdClient.getPrinters(tokenInfo, clientInfo);
      });
    });
  };
  return fetchPrinters().catch(e => {
    if (e === PrintDeployUnauthorizedError) {
      return printDeployStorage.invalidateAllCachedTokens().then(() => fetchPrinters());
    }
    return Promise.reject(e);
  });
}
async function getPrintDeployToken(pdClient) {
  const usernameToken = await printDeployStorage.getCachedPrintDeployToken();
  if (usernameToken) {
    return {
      authMethod: PrintDeployAuthMethods.Username,
      token: usernameToken
    };
  }
  const oauthSessionCreds = await printDeployStorage.getCachedOAuthSessionToken();
  if (oauthSessionCreds) {
    return toPrintDeployTokenInfo(oauthSessionCreds);
  }
  log_log('[handleMissingPaperCutToken] checking in memory creds');
  if (inMemoryCredsAvailable()) {
    return pdClient.login(inMemoryCreds).catch(() => askUserToAuthenticateForPrintDeploy(pdClient));
  }
  log_log('[handleMissingPaperCutToken] in memory creds unavailable');
  return askUserToAuthenticateForPrintDeploy(pdClient);
}
async function fetchTokenFromMobilityPrintServer(mpServerBaseUrl, credentials) {
  const {
    username,
    password
  } = credentials;
  if (!username || !password) {
    return Promise.reject('missing required username/password to get token from Mobility Print server');
  }
  if (mpServerBaseUrl.startsWith('http:')) {
    return Promise.reject('cannot get token from MP server using non-HTTPS URL');
  }
  const authUrl = `${mpServerBaseUrl}/token?printerName=none`;
  const requestParams = {
    headers: {
      Authorization: `Basic ${btoa(username + ':' + password)}`
    },
    method: 'GET'
  };
  return fetch(authUrl, requestParams).then(resp => getResponseBody(resp)).then(body => body.token);
}
async function askUserToAuthenticateForPrintDeploy(pdClient) {
  return new Promise(async (resolve, _reject) => {
    chrome.runtime.onMessage.addListener(onCredentialsEnteredForPrintDeployHandler(pdClient, resolve));
    chrome.runtime.onMessage.addListener(onOauthSessionCreatedForPrintDeployHandler(resolve));
    await showLoginWindow();
  });
}
function onCredentialsEnteredForPrintDeployHandler(pdClient, resolve) {
  return (message, sender) => {
    if (message.type === 'on-credentials-entered') {
      log_log('[onCredentialsEnteredForPrintDeployHandler] message received', {
        message,
        sender
      });
      const credentialsEntered = message;
      onCredentialsEnteredForPrintDeploy(credentialsEntered.credentials, pdClient).then(tokenInfo => {
        log_log('[onCredentialsEnteredForPrintDeployHandler] succeeded', {
          tokenInfo
        });
        chrome.runtime.onMessage.removeListener(onCredentialsEnteredForPrintDeployHandler(pdClient, resolve));
        resolve(tokenInfo);
        return true;
      }).catch(e => {
        log_log('error', {
          e
        });
        if (e === PrintDeployUnauthorizedError) {
          printDeployStorage.invalidateAllCachedTokens().then(() => {
            log_log('[onCredentialsEnteredForPrintDeployHandler] cleared cached print deploy tokens');
          }).catch(e => {
            log_log('[onCredentialsEnteredForPrintDeployHandler] error clearing print deploy tokens', {
              e
            });
          });
        }
        const errorMessage = resolveErrorToDisplay(e);
        sendDisplayErrorMessage(errorMessage).then(() => {
          log_log('[onCredentialsEnteredForPrintDeployHandler] sendDisplayErrorMessage');
        }).catch(e => {
          log_log('[onCredentialsEnteredForPrintDeployHandler]  sendDisplayErrorMessage error:', {
            e
          });
        });
        return true;
      });
    }
  };
}
async function onCredentialsEnteredForPrintDeploy(credentials, pdClient) {
  rememberCredsInMemory(credentials);
  return pdClient.login(credentials).then(async tokenInfo => {
    if (credentials.rememberMe) {
      await printDeployStorage.cachePaperCutToken(tokenInfo.token);
    }
    closeLoginDialog().then(() => {
      log_log('[onCredentialsEnteredForPrintDeploy] closed login dialog');
    }).catch(e => {
      log_log('[onCredentialsEnteredForPrintDeploy]  error:', {
        e
      });
    });
    return tokenInfo;
  });
}
function onOauthSessionCreatedForPrintDeployHandler(resolve) {
  return (message, sender) => {
    if (message.type === 'oauth-session-created') {
      log_log('[onOauthSessionCreatedForPrintDeployHandler] message received from', {
        message,
        sender
      });
      const oauthSessionCreated = message;
      log_log('[onOauthSessionCreatedForPrintDeployHandler]Received message oauthSessionCreated');
      onOAuthSessionCreatedForPrintDeploy(oauthSessionCreated.rememberMe, oauthSessionCreated.sessionCredentials).then(tokenInfo => {
        log_log('onOauthSessionCreatedForPrintDeployHandler succeeded', {
          tokenInfo
        });
        chrome.runtime.onMessage.removeListener(onOauthSessionCreatedForPrintDeployHandler(resolve));
        resolve(tokenInfo);
        return true;
      }).catch(e => {
        log_log('error', {
          e
        });
        return true;
      });
      return true;
    }
  };
}
async function onOAuthSessionCreatedForPrintDeploy(rememberMe, sessionCredentials) {
  log_log('[onOAuthSessionCreatedForPrintDeploy] onOAuthSessionCreated');
  rememberCredsInMemory({
    ...inMemoryCreds,
    rememberMe
  });
  if (rememberMe) {
    await printDeployStorage.cacheOAuthSessionToken(sessionCredentials);
  }
  closeLoginDialog().then(() => {
    log_log('[onOAuthSessionCreatedForPrintDeploy] closed login dialog');
  }).catch(e => {
    log_log('[onOAuthSessionCreatedForPrintDeploy]  error:', {
      e
    });
  });
  log_log('[onOAuthSessionCreatedForPrintDeploy]  getting token info');
  const printDeployTokenInfo = toPrintDeployTokenInfo(sessionCredentials);
  log_log('[onOAuthSessionCreatedForPrintDeploy] token info', {
    printDeployTokenInfo
  });
  return printDeployTokenInfo;
}
async function showLoginWindow(onCredentialsEntered) {
  log_log('[showLoginWindow] called', {
    onCredentialsEntered
  });
  const config = await printDeployStorage.getCachedConfig();
  const showUsernameLogin = config && config.AuthMethods.includes(PrintDeployAuthMethods.Username);
  const showGoogleLogin = config && config.AuthMethods.includes(PrintDeployAuthMethods.Google);
  await displayLoginWindow({
    showRememberMe: true,
    showUsernameLogin,
    showGoogleLogin,
    usePrintDeploy: true
  });
}
function mapPrintersForPrintProvider(printers) {
  return printers.map(({
    name,
    connection
  }) => {
    const displayName = getNormalisedName(name);
    return {
      id: `${connection.name}/printers/${encodeURI(displayName)}`,
      name: displayName,
      description: name,
      authMode: 'per-server',
      capabilities: undefined
    };
  });
}
function getNormalisedName(mpPrinterName) {
  const regex = /(.*)\[.*\]\(Mobility\)$/gm;
  if (!regex.test(mpPrinterName)) {
    return mpPrinterName;
  }
  return mpPrinterName.substring(0, mpPrinterName.lastIndexOf('[')).trim();
}
function resolveErrorToDisplay(e) {
  if (e.message) {
    if (e.message.includes('HTTP 401')) {
      return 'Invalid username and password';
    } else if (e.message.includes('HTTP 500')) {
      return 'An internal server error occurred';
    } else if (e.message.includes('Failed to fetch')) {
      return 'Connection failed';
    }
  }
  return 'Unknown error.';
}
async function getPDAuthForMobilityServer(mpServer) {
  const cachedToken = await printDeployStorage.getCachedMobilityPrintServerToken(mpServer);
  if (cachedToken) {
    log_log(`[getPrintDeployAuth] found cached token for ${mpServer}`);
    return Promise.resolve({
      token: cachedToken
    });
  }
  return handleMissingToken().catch(_e => {
    log_log(`[getPrintDeployAuth] did not find any cached tokens or credentials for MP server "${mpServer}. asking ` + 'user to authenticate..."');
    return askUserToAuthenticateForMPServer(mpServer);
  });
  async function handleMissingToken() {
    const oauthSession = await printDeployStorage.getCachedOAuthSessionToken();
    if (oauthSession && oauthSession.providerID === OAuthProviderIDs.Google) {
      return authenticateWithGSuiteHTTP(mpServer, false).then(encryptedCreds => {
        log_log(`[getPrintDeployAuth] generated encrypted oauth credentials for ${oauthSession.providerID}`);
        return {
          encryptedCreds,
          authOption: OAuthProviderIDs.Google
        };
      });
    }
    if (inMemoryCredsAvailable()) {
      return encryptCredentials(mpServer, inMemoryCreds.username, inMemoryCreds.password).then(encryptedCreds => {
        log_log('[getPrintDeployAuth] generated encrypted basic credentials');
        return {
          encryptedCreds
        };
      });
    }
    return Promise.reject(PrintDeployUnauthorizedError);
  }
}
function askUserToAuthenticateForMPServer(mpServer) {
  return new Promise(async (resolve, _reject) => {
    chrome.runtime.onMessage.addListener(onCredentialsEnteredForMPServerHandler(mpServer, resolve));
    await showLoginWindow();
  });
}
function onCredentialsEnteredForMPServerHandler(mpServer, resolve) {
  return (message, sender) => {
    if (message.type === 'on-credentials-entered') {
      const credentialsEntered = message;
      log_log('[onCredentialsEnteredForMPServerHandler] message received', {
        message,
        sender
      });
      onCredentialsEnteredForMPServer(credentialsEntered.credentials, mpServer).then(encryptedCredentials => {
        chrome.runtime.onMessage.removeListener(onCredentialsEnteredForMPServerHandler(mpServer, resolve));
        log_log('[onCredentialsEnteredForMPServer] succeeded', {
          encryptedCredentials
        });
        resolve(Promise.resolve(encryptedCredentials));
        closeLoginDialog().then(() => {
          log_log('[onCredentialsEnteredForMPServerHandler] closed login dialog');
        }).catch(e => {
          log_log('[onCredentialsEnteredForMPServerHandler]  error:', {
            e
          });
        });
        return true;
      }).catch(e => {
        const errorMessage = resolveErrorToDisplay(e);
        sendDisplayErrorMessage(errorMessage).then(() => {
          log_log('[onCredentialsEnteredForMPServerHandler] sendDisplayErrorMessage');
        }).catch(e => {
          log_log('[onCredentialsEnteredForMPServerHandler]  sendDisplayErrorMessage error:', {
            e
          });
        });
        return true;
      });
    }
  };
}
function wrapCreds(encryptedCreds) {
  return {
    encryptedCreds: encryptedCreds
  };
}
function onCredentialsEnteredForMPServer(credentials, mpServer) {
  rememberCredsInMemory(credentials);
  return encryptCredentials(mpServer, inMemoryCreds.username, inMemoryCreds.password).then(async encryptedCreds => {
    return wrapCreds(encryptedCreds);
  });
}
;// CONCATENATED MODULE: ./src/scripts/printdeploy/index.ts





// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.sort.js
var es_array_sort = __webpack_require__(5137);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.promise.all-settled.js
var es_promise_all_settled = __webpack_require__(1195);
;// CONCATENATED MODULE: ./src/scripts/knownhost/knownhost.ts

function addProtocolAndPortIfNeeded(value) {
  let processedAddress = value;
  const schemeSplit = value.split('://');
  const hasScheme = /^http[s]?$/.test(schemeSplit[0]) && schemeSplit.length > 1;
  const portSplit = value.split(':');
  const hasPort = portSplit.length > 1 && /^\d{1,5}$/.test(portSplit.pop());
  if (!hasScheme) {
    console.log('[KnownHost:addProtocolAndPortIfNeeded] adding scheme for:', value);
    processedAddress = `${MOBILITY_PRINT_SERVER_DEFAULT_PROTOCOL}://${processedAddress}`;
  }
  if (!hasPort) {
    console.log('[KnownHost:addProtocolAndPortIfNeeded] adding port for:', value);
    processedAddress = `${processedAddress}:${MOBILITY_PRINT_SERVER_DEFAULT_PORT}`;
  }
  return processedAddress;
}
;// CONCATENATED MODULE: ./src/scripts/printerdiscovery.ts














const CHROME_CALLBACK_DEADLINE_MS = 60000;
let cachedPrinters;
let cachedPrintersTime;
const getPrintersCallbacks = [];
function getPrintersRequested(callback) {
  const requestNow = getPrintersCallbacks.length == 0;
  getPrintersCallbacks.push(callback);
  if (requestNow) {
    log_log('[getPrintersRequested] fetching printers...');
    migrateAppPopupSep('atPrint');
    const doCancel = () => {
      log_log(`Cancelling running printer discovery results due to ${CHROME_CALLBACK_DEADLINE_MS}ms timeout...`);
      while (getPrintersCallbacks.length) {
        getPrintersCallbacks.shift()([]);
      }
    };
    const cancelTimeout = setTimeout(() => {
      doCancel();
    }, CHROME_CALLBACK_DEADLINE_MS);
    const start = performance.now();
    getAllPrinters().then(printers => {
      clearTimeout(cancelTimeout);
      const elapsed = (performance.now() - start).toFixed(2);
      const chromePrinterInfo = printers.map(printer => {
        return {
          id: printer.id,
          name: printer.name,
          description: printer.description
        };
      }).sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
      log_log(`[getPrintersRequested] completed in ${elapsed}ms, discovered ${printers.length} printers`);
      while (getPrintersCallbacks.length) {
        getPrintersCallbacks.shift()(chromePrinterInfo);
      }
    }).catch(reason => {
      clearTimeout(cancelTimeout);
      doCancel();
      log_log('[getPrintersRequested] failed:', reason);
    });
  } else {
    log_log(`[getPrintersRequested] ${getPrintersCallbacks.length - 1} call(s) in progress, return same results`);
  }
}
async function runPrinterDiscovery() {
  var _await$getLocalStorag;
  const PRINTER_DISCOVERY_CACHE_TIME_SECS = (_await$getLocalStorag = await getLocalStorageData('cachedPrintersExpirySecs')) !== null && _await$getLocalStorag !== void 0 ? _await$getLocalStorag : 120;
  if (cachedPrinters && cachedPrinters.length > 0 && PRINTER_DISCOVERY_CACHE_TIME_SECS > 0) {
    const runDiscovery = cachedPrintersTime === undefined || new Date().getTime() - cachedPrintersTime.getTime() > PRINTER_DISCOVERY_CACHE_TIME_SECS * 1000;
    log_log(`[runPrinterDiscovery] ${runDiscovery ? 'Cache expired, re-run discovery.' : 'Use cached printers and skip discovery.'}`);
    return runDiscovery;
  }
  return true;
}
async function getAllPrinters() {
  if (await runPrinterDiscovery()) {
    const start = performance.now();
    const printers = await getPrintersFromEnabledModes();
    const elapsed = (performance.now() - start).toFixed(2);
    log_log(`[getAllPrinters] ${printers.length} total unique printer(s) discovered in ${elapsed}ms: `, printers);
    await cachePrinterAuthModes(printers);
    cachedPrintersTime = new Date();
    cachedPrinters = printers;
    return printers;
  }
  log_log(`[getAllPrinters] ${cachedPrinters.length} cached printers at:	${cachedPrintersTime.toLocaleTimeString()}`, cachedPrinters);
  return cachedPrinters;
}
async function getPrintersFromEnabledModes() {
  try {
    const [printDeployPrinters, printDeployEnabled] = await getPrintersFromPrintDeploy();
    if (printDeployEnabled) {
      log_log(`${printDeployPrinters.length} Print Deploy printer(s) discovered:`, printDeployPrinters);
      return printDeployPrinters;
    }
    const cloudPrintersPromise = getPrintersFromAllServers();
    const knownHostPrinters = await getPrintersKnownHost();
    log_log(`${knownHostPrinters.length} Known Host printer(s) discovered:`, knownHostPrinters);
    const dnsPrinters = [];
    if (knownHostPrinters.length === 0) {
      dnsPrinters.push(...(await getPrintersDNS()));
      log_log(`${dnsPrinters.length} mDNS/DNS printer(s) discovered:`, dnsPrinters);
    }
    const cloudPrinters = await cloudPrintersPromise;
    log_log(`${cloudPrinters.length} Cloud Print printer(s) discovered:`, cloudPrinters);
    const allPrinters = new Map();
    for (const printer of cloudPrinters) {
      allPrinters.set(printer.name, printer);
    }
    for (const printer of knownHostPrinters) {
      allPrinters.set(printer.name, printer);
    }
    for (const printer of dnsPrinters) {
      allPrinters.set(printer.name, printer);
    }
    return Array.from(allPrinters.values());
  } catch (e) {
    log_error('error retrieving printers: ', e);
    return [];
  }
}
async function getPrintersKnownHost() {
  log_log('[getPrintersKnownHost]');
  let mpHosts;
  try {
    mpHosts = await getPreconfiguredMobilityPrintServerHosts();
  } catch (e) {
    log_log('[KnownHost] MobilityPrintServerHosts: invalid config', e);
    return [];
  }
  log_log('[KnownHost] MobilityPrintServerHosts:', mpHosts);
  const printers = [];
  const results = await Promise.allSettled(mpHosts.map(mpHost => getPrinters(mpHost, onPrintersDiscovered)));
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === 'rejected') {
      log_log(`[KnownHost] Failed to fetch printers from ${mpHosts[i]}.`);
      continue;
    }
    printers.push(...result.value);
  }
  return printers;
}
async function getPreconfiguredMobilityPrintServerHosts() {
  return new Promise((resolve, reject) => {
    chrome.storage.managed.get('MobilityPrintServerHosts', function (data) {
      if (data && data.MobilityPrintServerHosts) {
        log_log('[KnownHost:getHosts] found provided known hosts', data.MobilityPrintServerHosts.toString());
        const hosts = data.MobilityPrintServerHosts.map(addProtocolAndPortIfNeeded);
        resolve(hosts);
      } else {
        reject('MobilityPrintServerHosts policy is not configured. This may be intended.');
      }
    });
  });
}
async function getPrintersDNS() {
  log_log('[getPrintersDNS]');
  const result = await Promise.all(dnsDiscoveredUrls().map(u => getPrinters(u, onPrintersDiscovered)));
  return result.flat(Infinity);
}
async function getPrinters(url, responseCallback) {
  const requestUrl = `${url}/printers?ignoreCapabilities=true`;
  const ipList = await getLocalIPAddresses();
  const headers = new Headers({
    'client-type': globals_GetClientVersionID(),
    'Local-Ip-Addresses': ipList.join(',')
  });
  const controller = new AbortController();
  const timeoutID = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: headers,
      signal: controller.signal
    });
    if (!response.ok) {
      log_log(`[getPrinters] request to [${requestUrl}] failed`, response.status, response.statusText);
      responseCallback([]);
      return [];
    }
    return processPrintersListResponse(response, responseCallback);
  } catch (error) {
    if (error.name === 'AbortError') {
      log_log(`[getPrinters] request to [${requestUrl}] timed out`);
    } else {
      log_log(`[getPrinters] request to [${requestUrl}] failed`);
    }
    responseCallback([]);
    return [];
  } finally {
    clearTimeout(timeoutID);
  }
}
async function processPrintersListResponse(response, onPrintersResponse) {
  const printers = await response.json();
  log_log(`[processPrintersListResponse] JSON response from [${response.url}]`, printers);
  try {
    log_log('[processPrintersListResponse] got successful response from:', response.url, printers.map(p => p.name));
    const ret = printers.map(p => ({
      id: response.url.replace(/\/printers.*/, '/printers/') + encodeURIComponent(p.name),
      name: p.name + ' - [' + p.description + ']',
      description: p.description,
      authMode: p.authMode
    }));
    onPrintersResponse(ret);
    return ret;
  } catch (e) {
    log_log('[processPrintersListResponse] Invalid JSON response from: [' + response.url + '], error: ', e);
    return [];
  }
}
;// CONCATENATED MODULE: ./src/scripts/printer/authstate.ts


async function getPrinterAuthState(printerId) {
  log_log(`Looking up printer auth state for: ${printerId}`);
  return getLocalStorageData(printerId);
}
async function savePrinterAuthState(printerUrl, token, isRemember, authOption) {
  log_log(`saving remember-me print token for printer: ${printerUrl}, authOption=${authOption}`);
  return setLocalStorageData(printerUrl, {
    token: token,
    isRemember: isRemember,
    lastAuthOption: authOption
  });
}
async function removePrinterAuthState(printerUrl) {
  log_log(`removing remember-me print token for printer: ${printerUrl}`);
  return chrome.storage.local.remove(printerUrl);
}
;// CONCATENATED MODULE: ./src/scripts/main.ts




























const authOptions = {
  perPrinter: 'per-printer',
  perJob: 'per-job',
  perServer: 'per-server',
  guestNone: 'none',
  standaloneNone: 'standalone-none'
};
const main_flags = new Flags(new ChromeFlagStorage());
let authModes = {};
let printJobForm;
function main() {
  Promise.all([getChromeOSVersion(), getPlatformInfo(), IsManagedInstall()]).then(info => {
    const manifest = chrome.runtime.getManifest();
    const name = `${manifest.name} ${isExtension() ? 'extension' : 'app'}`;
    const managed = info[2];
    log_log(`[Startup] ${name} - ${manifest.version} (${_SELF_ID}), Install: ${managed ? 'managed' : 'BYOD'}`);
    log_log(`[Startup] running on Chrome: ${info[0]}, ${info[1].os}_${info[1].arch}`);
  }).then(() => {
    log_log('[Startup] reset auth-modes');
    chrome.storage.local.get('authModes', d => {
      if (d && d.authModes) {
        authModes = d.authModes;
      }
    });
    registerInstallListener();
    registerMDNSListener();
    registerExternalMessageListener();
    (async () => {
      const platformInfo = await getPlatformInfo();
      await initCloudPrint();
      await migrateAppPopupApr();
      await migrateAppPopupJul(platformInfo.os);
      await migrateAppPopupSep("atStart");
    })();
  });
}
main();
chrome.runtime.onMessage.addListener((message, sender, responseCallback) => {
  if (!message.type || message.type === 'log') {
    return;
  }
  const tag = `main.${message.type}`;
  log_log(`[${tag}] message received`, {
    message,
    sender
  });
  if (message.type === 'send-print-job-message') {
    if (!printJobForm) {
      log_log(`[${tag}] Submit ignored, print job form is cleared`);
      return;
    }
    const printerId = printJobForm.printerUrl;
    submitJobWithCredentials(message.credentials, message.remember, message.authOption, message.useCloudPrint).then(() => {
      log_log(`[${tag}] Submit to '${printerId}' succeeded. Calling responseCallback.`);
      responseCallback({
        ok: true
      });
    }).catch(e => {
      log_log(`[${tag}] Submit to '${printerId}' failed. Calling responseCallback: ${e}`);
      responseCallback({
        ok: false,
        message: e.message
      });
    });
    return true;
  } else if (message.type === 'login-window-closed') {
    log_log(`[${tag}] Received login window closed message`);
    onLoginClosed();
    return true;
  } else if (sender.url.endsWith('/login.html')) {
    warn(`[main] Received unknown message from ${sender.url}: ${JSON.stringify(message)}`);
  }
});
function setPrinterAuthModes(printers) {
  printers.forEach(p => {
    if (p.authMode) {
      authModes[p.id] = p.authMode;
    } else {
      authModes[p.id] = authOptions.perPrinter;
    }
  });
  chrome.storage.local.set({
    authModes: authModes
  });
}
async function cachePrinterAuthModes(values) {
  log_log('Caching printer auth modes:', values);
  return new Promise(resolve => {
    let allPrinters = [];
    if (values) {
      allPrinters = values.flat(Infinity);
      setPrinterAuthModes(allPrinters);
      allPrinters.forEach(p => {
        delete p.authMode;
      });
    }
    resolve(allPrinters);
  });
}
async function getPrinterInfo(printerId) {
  if (await main_flags.get(Flag.CloudPrintForceRTC)) {
    log_log(`Skipping local capabilities fetch due to ${Flag.CloudPrintForceRTC} flag enabled.`);
    return getPrinterInfoRTC(printerId);
  } else {
    if (await isCloudPrintJob(printerId)) {
      return getPrinterInfoRTC(printerId);
    } else {
      return getPrinterInfoHTTP(printerId);
    }
  }
}
chrome.printerProvider.onGetCapabilityRequested.addListener(async (printerId, resultCallback) => {
  log_log('Requesting printer capabilities for printer', printerId);
  const capabilities = getPrinterCapabilities(printerId);
  if (capabilities) {
    return resultCallback(capabilities);
  }
  getPrinterInfo(printerId).then(j => {
    log_log('printer capabilities result:', j);
    return j;
  }).then(p => {
    const caps = parseMobilityPrintCapabilities(p.capabilities);
    log_log('returning printer capabilities of: ', printerId, caps);
    return resultCallback(caps);
  }).catch(e => {
    log_error(`failed to retrieve printer capabilities of: ${printerId}. Will use defaults instead: `, e);
    const caps = createPrinterCapabilities();
    log_log('returning printer capabilities of: ', printerId, caps);
    return resultCallback(caps);
  });
});
chrome.runtime.onSuspend.addListener(() => {
  log_log('[main] Suspending.');
});
log_log('[Startup] Registering Chrome printer provider listeners ...');
chrome.printerProvider.onGetPrintersRequested.addListener(getPrintersRequested);
onCommand(command => {
  if (command === 'open-options') {
    showPopup({
      page: 'options.html',
      width: 500,
      height: 300
    }).catch(e => {
      log_error('[onCommand] Failed to display Options window.', JSON.stringify(e));
    });
  }
});
async function getPrinterInfoHTTP(printerId) {
  log_log('Requesting printer capabilities via HTTP.', `printerId: ${printerId}`);
  const res = await fetch(printerId, {
    headers: {
      'client-type': globals_GetClientVersionID()
    }
  });
  if (!res.ok) {
    log_error(`Failed to retrieve printer capabilities for ${printerId} via HTTP.`, res.statusText);
    throw new Error(res.statusText);
  }
  return res.json();
}
async function checkPrinterAccessibility(url) {
  if (await main_flags.get(Flag.CloudPrintForceRTC)) {
    log_log(`Skipping local printer accessibility check due to ${Flag.CloudPrintForceRTC} flag enabled.`);
    return false;
  }
  const headers = new Headers();
  headers.append('client-type', globals_GetClientVersionID());
  try {
    const response = await fetch(url, {
      headers: headers
    });
    const accessible = response.status == 200;
    if (!accessible) {
      log_log(`printer '${url}' local access rejected via response code: ${response.status}`);
    }
    return accessible;
  } catch (e) {
    log_log(`printer '${url}' is not locally accessible: ${e.message}`);
  }
  return false;
}
async function isCloudPrintJob(printerId) {
  const serverId = await getServerIdForPrinter(printerId);
  if (serverId) {
    log_log(`confirmed Cloud Print printer: ${printerId} from server: ${serverId}`);
    const locallyAccessible = await checkPrinterAccessibility(printerId);
    log_log(`printer '${printerId} ${locallyAccessible ? 'is' : 'is not'} locally accessible.`);
    return !locallyAccessible;
  }
  log_log(`printer id '${printerId}' does not match any Cloud Print servers, assuming local network job`);
  return false;
}
function submitPrintJob(printJob, cloudPrintJob) {
  const authMode = authModes[printJob.printerId];
  log_log(`[onPrintRequested] printer=${printJob.printerId}, authMode=${authMode}, cloudPrintJob=${cloudPrintJob}`);
  switch (authMode) {
    case authOptions.standaloneNone:
      return submitWithStandaloneMode(printJob);
    case authOptions.guestNone:
      return submitWithGuestMode(printJob);
    case authOptions.perServer:
      return submitWithPrintDeployAuth(printJob);
    case authOptions.perPrinter:
      return submitWithPerPrinterAuth(printJob, cloudPrintJob);
    case authOptions.perJob:
      return submitWithPerJobAuth(printJob, cloudPrintJob);
    default:
      throw new Error(`Unsupported auth mode: ${authMode}`);
  }
}
var PrintResult;
(function (PrintResult) {
  PrintResult["OK"] = "OK";
  PrintResult["FAILED"] = "FAILED";
})(PrintResult || (PrintResult = {}));
chrome.printerProvider.onPrintRequested.addListener(async (printJob, onPrintResultCallback) => {
  log_log(`[onPrintRequested] job requested for printerId=${printJob.printerId}` + `using authMode="${authModes[printJob.printerId]} and printJob=${JSON.stringify(printJob)}`);
  const start = performance.now();
  const printCompleted = onPrintRequested(printJob, result => {
    const elapsed = (performance.now() - start).toFixed(2);
    log_log(`[onPrintRequested] '${printJob.printerId}' resultCallback called after ${elapsed}ms`, {
      result: result
    });
    printJobForm = null;
    onPrintResultCallback(result);
  });
  await workerWaitUntil(printCompleted);
});
async function onPrintRequested(printJob, resultCallback) {
  return new Promise(async (resolve, reject) => {
    const completionCallback = result => {
      resultCallback(result);
      if (result === PrintResult.FAILED) {
        reject(result);
        return;
      }
      resolve(result);
    };
    try {
      const cloudPrintJob = await isCloudPrintJob(printJob.printerId);
      await updatePrintJobForm(printJob, completionCallback, cloudPrintJob);
      return await submitPrintJob(printJob, cloudPrintJob).then(() => {
        log_log(`[onPrintRequested] submitPrintJob returned for printerId=${printJob.printerId}`);
      }).catch(err => {
        log_error(`[onPrintRequested] submitPrintJob failed for '${printJob.printerId}':`, err ? err : 'unknown error');
        completionCallback(PrintResult.FAILED);
      });
    } catch (e) {
      log_error(`[onPrintRequested] printing to '${printJob.printerId}' failed`, e);
      completionCallback(PrintResult.FAILED);
    }
  });
}
async function submitJobWithTokenWebRTC(token, isRemember) {
  printJobForm.form.delete('credentials');
  printJobForm.form.append('remember', isRemember.toString());
  const params = {};
  params['rememberedToken'] = token;
  printJobForm.form.forEach((v, k) => {
    if (k === 'iv' || k === 'key') {
      return;
    }
    params[k] = v;
  });
  await submitPrintJobRTC(printJobForm.printDoc, printJobForm.printerUrl, params);
}
async function submitWithPerPrinterAuth(printJob, cloudPrintJob) {
  const printerPrefs = await getPrinterAuthState(printJobForm.printerUrl);
  log_log('[onPrintRequested] Retrieved printerPrefs for ' + printJobForm.printerUrl + ': ', printerPrefs);
  if (printerPrefs == null || !printerPrefs.isRemember) {
    log_log('[onPrintRequested] Either no printerPrefs stored for this printer or isRemember is false. ' + 'Prompting user to login... printerPrefs:', printerPrefs);
    return startAuthentication(printJob, false, cloudPrintJob);
  } else if (printerPrefs.token) {
    if (printerPrefs.lastAuthOption === 'google') {
      log_log('[onPrintRequested] Last authentication method used for this printer was GSuite. ' + 'Attempting to log in using G Suite...');
      return startAuthentication(printJob, true, cloudPrintJob);
    }
    log_log('[onPrintRequested] Using cached bearer token for ' + printJobForm.printerUrl);
    (cloudPrintJob ? submitJobWithTokenWebRTC(printerPrefs.token, printerPrefs.isRemember) : submitPrintJobHTTP(printJobForm.printerUrl, printJobForm.form, printerPrefs.token)).then(() => {
      log_log(`[onPrintRequested] Job submitted using ${cloudPrintJob ? 'Cloud Print' : 'local network'}`);
      printJobForm.resultCallback(PrintResult.OK);
    }).catch(() => {
      log_log('[onPrintRequested] Job failed to submit. Restarting authentication...');
      removePrinterAuthState(printJobForm.printerUrl).then(() => startAuthentication(printJob, false, cloudPrintJob));
    });
  } else {
    log_log('[onPrintRequested] Token is empty for ' + printJobForm.printerUrl);
    return startAuthentication(printJob, printerPrefs.isRemember, cloudPrintJob);
  }
}
function submitWithPrintDeployAuth(printJob) {
  const mpServer = getUrlBaseOfPrinterUrl(printJob.printerId);
  const submitJob = printJob => getPDAuthForMobilityServer(mpServer).then(authDetails => {
    const {
      token,
      encryptedCreds,
      authOption
    } = authDetails;
    if (token) {
      return submitPrintJobHTTP(printJobForm.printerUrl, printJobForm.form, token).then(() => {
        log_log('[submitWithPrintDeployAuth]: Job submitted successfully with a cached token');
        printJobForm.resultCallback(PrintResult.OK);
      });
    }
    if (!encryptedCreds) {
      return Promise.reject('no credentials available');
    }
    const authOpt = authOption || authModes[printJob.printerId];
    return submitJobWithCredentialsHTTP(encryptedCreds, inMemoryCreds.rememberMe, authOpt);
  });
  return submitJob(printJob).catch(e => {
    log_log('[submitWithPrintDeployAuth]: Job submission failed. error:', e);
    if (e.status === 401) {
      const urlBase = getUrlBaseOfPrinterUrl(printJob.printerId);
      log_log('[submitWithPrintDeployAuth]: MP server token expired for "%s". Invalidating token to trigger ' + 're-authentication...', urlBase);
      return printDeployStorage.removeMobilityPrintServerToken(urlBase).then(() => submitJob(printJob));
    } else {
      printJobForm.resultCallback(PrintResult.FAILED);
    }
  }).finally(() => {
    clearInMemoryCreds();
  });
}
function submitWithStandaloneMode(printJob) {
  log_log('[onPrintRequested] authMode set to none - standalone mode');
  return submitPrint(printJob.printerId, printJobForm.form, printJobForm.printDoc).then(() => {
    log_log('[onPrintRequested] Job submitted successfully');
    printJobForm.resultCallback(PrintResult.OK);
  }).catch(e => {
    log_error(`error printing: [${e}]`);
    log_log('[onPrintRequested] Job failed to submit in standalone so no retry...');
    printJobForm.resultCallback(PrintResult.FAILED);
  });
}
function submitWithGuestMode(printJob) {
  log_log('[onPrintRequested] authMode set to none - guest mode');
  return submitPrintJobHTTP(printJob.printerId, printJobForm.form).then(() => {
    log_log('[onPrintRequested] Job submitted successfully');
    printJobForm.resultCallback(PrintResult.OK);
  }).catch(() => {
    log_log('[onPrintRequested] Job failed to submit. Restarting authentication...');
    removePrinterAuthState(printJobForm.printerUrl).then(() => startAuthentication(printJob, false));
  });
}
function submitWithPerJobAuth(printJob, cloudPrintJob) {
  log_log('[onPrintRequested] Auth mode is per job for ' + printJobForm.printerUrl + '. Prompting user to log in...');
  return startAuthentication(printJob, false, cloudPrintJob);
}
async function submitPrint(printerUrl, form, file) {
  if (await checkPrinterAccessibility(printerUrl)) {
    log_log('[onPrintRequested] Printer is locally accessible. Submitting job using HTTP.');
    return submitPrintJobHTTP(printerUrl, form);
  } else {
    log_log('[onPrintRequested] Printer is not locally accessible. Submitting job using RTC.');
    const params = {};
    printJobForm.form.forEach((v, k) => {
      if (k === 'iv' || k === 'key') {
        return;
      }
      params[k] = v;
    });
    return submitPrintJobRTC(file, printerUrl, params).then(() => null);
  }
}
function updatePrintJobForm(printJob, resultCallback, isCloudPrintJob) {
  log_log(`[onPrintRequested] convert ticket to form for '${printJob.printerId}', cloud print job: ${isCloudPrintJob}`);
  const f = new FormData();
  const ticket = printJob.ticket;
  f.append('printerName', printJob.printerId);
  f.append('copies', ticket.print.copies ? ticket.print.copies.copies : 1);
  f.append('duplex', ticket.print.duplex ? ticket.print.duplex.type : 'NO_DUPLEX');
  f.append('color', ticket.print.color ? ticket.print.color.type : 'AUTO');
  f.append('mediaWidthMicrons', ticket.print.media_size ? ticket.print.media_size.width_microns : 0);
  f.append('mediaHeightMicrons', ticket.print.media_size ? ticket.print.media_size.height_microns : 0);
  printJobForm = {
    form: f,
    resultCallback: function (result) {
      log_log(`[onPrintRequested] updatePrintJobForm resultCallback called for printer '${printJobForm.printerName}'`, {
        result: result
      });
      resultCallback(result);
    },
    printerUrl: printJob.printerId,
    printerName: getPrinterName(printJob.printerId),
    printDoc: printJob.document
  };
  const urlBase = getUrlBaseOfPrinterUrl(printJob.printerId);
  return isChromeEncryptionEnabled(urlBase, isCloudPrintJob).then(async enabled => {
    log_log('[onPrintRequested] Chrome encryption is: ', enabled ? 'enabled' : 'disabled');
    if (enabled) {
      const result = await encryptDocument(printJob.document, printJob.title, printJob.printerId);
      f.append('printDocument', result.blob);
      f.append('key', result.key);
      f.append('iv', result.iv);
      f.append('documentName', result.title);
      log_log('[onPrintRequested] encrypted document added to printJobForm');
    } else {
      return new Promise(resolve => {
        f.append('printDocument', printJob.document);
        f.append('documentName', printJob.title);
        resolve();
      });
    }
  }).finally(() => log_log(`[onPrintRequested] updatePrintJobForm completed for '${printJobForm.printerName}'`));
}
function startAuthentication(printJob, isRemember = true, cloudPrintJob = false) {
  let gSuiteEnabled = false;
  log_log(`[startAuthentication]: printerId=${printJob.printerId},` + `isRemember=${isRemember}, cloudPrintJob=${cloudPrintJob}`);
  return isGSuiteEnabled(printJob, cloudPrintJob).then(enabled => {
    gSuiteEnabled = enabled;
    if (!gSuiteEnabled) {
      log_log('[startAuthentication]: GSuite is not enabled so showing login window instead with no Google sign in ' + 'option...');
      return Promise.reject('GSuite is not enabled');
    }
    if (!isRemember) {
      log_log('[startAuthentication]: Auth mode is per job or user did not ask to be remembered so showing login window ' + 'instead with a Google sign in option...');
      return Promise.reject('Auth mode is per job. Ignoring cache-based authentication.');
    }
    log_log('[startAuthentication]: GSuite is enabled and isRemember is enabled for this printer. Attempting to ' + 'auto-login...');
    return authenticateWithGSuite(printJob, false, !cloudPrintJob);
  }).then(authInfo => {
    log_log('[startAuthentication]: Google credentials retrieved successfully. Now sending job with the credentials...');
    return submitJobWithCredentials(authInfo, false, 'google', cloudPrintJob).then(() => {
      log_log('[startAuthentication]: Authentication successful. Job submitted successfully.');
    }).catch(e => {
      const errorMessage = e.message ? e.message : 'error response is null';
      if (isCloudPrintError(errorMessage)) {
        log_error('[startAuthentication]: Failed to connect while authenticating credentials: ' + errorMessage);
        throw e;
      }
      log_error('[startAuthentication]: Failed to authenticate credentials: ' + errorMessage);
      openLogin(printJob, isRemember, true, true);
    });
  }).catch(e => {
    if (isCloudPrintError(e)) {
      throw e;
    }
    if (e instanceof Error) {
      log_error('Failed to check if Google sign-in is enabled. Reason: ', e);
    }
    getPrinterAuthState(printJob.printerId).then(printerPrefs => {
      gSuiteEnabled = gSuiteEnabled || printerPrefs && printerPrefs.lastAuthOption === 'google';
      const showRememberMe = authModes[printJob.printerId] === authOptions.perPrinter;
      warn(`[startAuthentication] Asking the user to authenticate again in login window. 
						Remember-me ${showRememberMe ? 'enabled' : 'disabled'}, 
						Google Login ${gSuiteEnabled ? 'enabled' : 'disabled'}`);
      openLogin(printJob, showRememberMe, true, gSuiteEnabled, cloudPrintJob);
    });
  });
}
function onLoginClosed() {
  log_log('onLoginClosed');
  printJobForm.resultCallback(PrintResult.OK);
  printJobForm = null;
}
function openLogin(printJob, showRememberMe = true, showUsernameLogin = false, showGoogleLogin = false, cloudPrintJob = false) {
  const urlBase = getUrlBaseOfPrinterUrl(printJob.printerId);
  displayLoginWindow({
    printJob,
    urlBase,
    showRememberMe,
    showUsernameLogin,
    showGoogleLogin,
    useCloudPrint: cloudPrintJob
  }).then(() => {
    log_log('[openLogin] Done displaying login window.', 'printerId', printJob.printerId);
  }).catch(e => {
    log_error('[openLogin] Failed to display login window.', 'printerId', printJob.printerId, e);
  });
}
async function submitPrintJobHTTP(printerUrl, data, authToken) {
  const url = `${printerUrl}/jobs`;
  log_log(`[submitPrintJobHTTP]: submitting print job to: ${url}, token provided: ${authToken != null}`);
  const headers = new Headers({
    'client-type': globals_GetClientVersionID()
  });
  if (authToken) {
    headers.append('Authorization', `Bearer ${authToken}`);
  }
  return fetch(url, {
    method: 'POST',
    headers: headers,
    body: data
  }).then(response => {
    if (!response.ok) {
      throw {
        status: response.status,
        statusText: response.statusText
      };
    }
    return;
  }).catch(e => {
    log_error(`[submitPrintJobHTTP]: failed to submit job: ${e}`);
    throw e;
  });
}
async function submitJobWithCredentials(credentials, isRemember, authOption, cloudPrint) {
  log_log(`[submitJobWithCredentials] authOption=${authOption}, cloudPrint=${cloudPrint}, isRemember=${isRemember}`);
  if (!printJobForm) {
    log_error('No print job data set, not submitting!');
    throw new Error('No print job data set, not submitting');
  }
  const printerUrl = printJobForm.printerUrl;
  try {
    await (cloudPrint ? submitJobWithCredentialsWebRTC(credentials, isRemember, authOption) : submitJobWithCredentialsHTTP(credentials, isRemember, authOption));
    log_log('[submitJobWithCredentials] print job submitted.', 'printerUrl', printerUrl);
    return null;
  } catch (e) {
    log_error('[submitJobWithCredentials] job failed to submit.', 'printerUrl', printerUrl, e.message);
    throw e;
  }
}
async function submitJobWithCredentialsHTTP(credentials, isRemember, authOption) {
  if (authOption == null) {
    printJobForm.form.delete('authOption');
  } else {
    printJobForm.form.set('authOption', authOption);
  }
  printJobForm.form.append('authOption', authOption);
  printJobForm.form.delete('credentials');
  printJobForm.form.append('remember', isRemember.toString());
  printJobForm.form.append('credentials', credentials);
  const printerUrl = printJobForm.printerUrl;
  log_log('[submitJobWithCredentials] Sending print job to:', printerUrl + '/jobs' + (authOption ? `, authOption=${authOption}` : ''));
  const response = await fetch(`${printerUrl}/jobs`, {
    method: 'POST',
    headers: {
      'client-type': globals_GetClientVersionID()
    },
    body: printJobForm.form
  });
  log_log('[submitJobWithCredentialsHTTP] print job result status: ', response.status, response.statusText);
  const jobResponse = await response.json().catch(_ => null);
  if (response.ok) {
    log_log('[submitJobWithCredentialsHTTP] print job submitted.', 'printerUrl', printerUrl);
    const authMode = authModes[printerUrl];
    if (jobResponse && jobResponse.t && authMode === authOptions.perPrinter) {
      await savePrinterAuthState(printerUrl, jobResponse.t, isRemember, authOption);
    } else if (jobResponse && jobResponse.t && authMode === 'per-server') {
      const mpServerBaseUrl = getUrlBaseOfPrinterUrl(printerUrl);
      if (isRemember) {
        const cacheResult = await printDeployStorage.cacheMobilityPrintServerToken(mpServerBaseUrl, jobResponse.t);
        log_log('[submitJobWithCredentialsHTTP] cacheMobilityPrintServerToken returned:', cacheResult);
      }
    }
    printJobForm.resultCallback(PrintResult.OK);
    printJobForm = null;
    return null;
  } else if (response.status === 401) {
    const message = jobResponse && jobResponse.message ? jobResponse.message : 'Invalid username or password';
    printJobForm.form.delete('credentials');
    chrome.storage.local.remove(printerUrl);
    throw new Error(`Failed to submit job: ${message}`);
  } else if (response.status === 403) {
    const message = jobResponse && jobResponse.message ? jobResponse.message : 'Access Denied';
    printJobForm.form.delete('credentials');
    chrome.storage.local.remove(printerUrl);
    throw new Error(`Failed to submit job: ${message}`);
  } else {
    const message = jobResponse && jobResponse.message ? jobResponse.message : `Failed, HTTP: ${response.status}`;
    log_error(`[submitJobWithCredentialsHTTP] failed: HTTP ${response.status + ' ' + response.statusText}`);
    chrome.storage.local.remove(printerUrl);
    printJobForm.resultCallback(PrintResult.FAILED);
    printJobForm = null;
    throw new Error(`Failed to submit job: ${message}`);
  }
}
async function submitJobWithCredentialsWebRTC(credentials, isRemember, authOption) {
  printJobForm.form.delete('credentials');
  printJobForm.form.append('remember', isRemember.toString());
  printJobForm.form.append('credentials', credentials);
  const params = {};
  printJobForm.form.forEach((v, k) => {
    if (k === 'iv' || k === 'key') {
      return;
    }
    params[k] = v;
  });
  params['credentials'] = credentials;
  try {
    const token = await submitPrintJobRTC(printJobForm.printDoc, printJobForm.printerUrl, params);
    if (token && authModes[printJobForm.printerUrl] === authOptions.perPrinter) {
      if (isRemember) {
        savePrinterAuthState(printJobForm.printerUrl, token, isRemember, authOption).catch(e => log_error('[submitJobWithCredentialsWebRTC] unable to save auth state', e));
      }
    }
  } catch (e) {
    log_log('[submitJobWithCredentialsWebRTC]: failed on submitPrintJobRTC.', e);
    throw Error(`Failed to submit job: ${e.message ? e.message : e}`);
  }
  log_log('[submitJobWithCredentialsWebRTC] print job submitted.', 'printerUrl', printJobForm.printerUrl);
  printJobForm.resultCallback(PrintResult.OK);
  printJobForm = null;
  return null;
}
function onPrintersDiscovered(p) {
  if (!p) {
    log_error('[onPrintersDiscovered] invalid result reported');
    return;
  }
  p.map(p => {
    if (p.authMode) {
      authModes[p.id] = p.authMode;
    } else {
      authModes[p.id] = authOptions.perPrinter;
    }
  });
  log_log('[onPrintersDiscovered] authModes: ', authModes);
  chrome.storage.local.set({
    authModes: authModes
  });
}
})();

/******/ })()
;