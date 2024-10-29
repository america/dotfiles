/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 509:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isCallable = __webpack_require__(9985);
var tryToString = __webpack_require__(3691);

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ 3550:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isPossiblePrototype = __webpack_require__(598);

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (isPossiblePrototype(argument)) return argument;
  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ 5027:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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


// eslint-disable-next-line es/no-typed-arrays -- safe
module.exports = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';


/***/ }),

/***/ 4872:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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


var uncurryThis = __webpack_require__(8844);

module.exports = uncurryThis([].slice);


/***/ }),

/***/ 382:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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

/***/ 6648:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(8844);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ 926:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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


var fails = __webpack_require__(3689);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ 5773:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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

/***/ 7697:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var fails = __webpack_require__(3689);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});


/***/ }),

/***/ 6420:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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


var userAgent = __webpack_require__(71);

var firefox = userAgent.match(/firefox\/(\d+)/i);

module.exports = !!firefox && +firefox[1];


/***/ }),

/***/ 7298:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var UA = __webpack_require__(71);

module.exports = /MSIE|Trident/.test(UA);


/***/ }),

/***/ 806:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var global = __webpack_require__(9037);
var classof = __webpack_require__(6648);

module.exports = classof(global.process) === 'process';


/***/ }),

/***/ 71:
/***/ ((module) => {


module.exports = typeof navigator != 'undefined' && String(navigator.userAgent) || '';


/***/ }),

/***/ 3615:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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


var userAgent = __webpack_require__(71);

var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);

module.exports = !!webkit && +webkit[1];


/***/ }),

/***/ 2739:
/***/ ((module) => {


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


var NATIVE_BIND = __webpack_require__(7215);

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


/***/ }),

/***/ 7215:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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


var NATIVE_BIND = __webpack_require__(7215);

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ 1236:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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


var global = __webpack_require__(9037);
var isCallable = __webpack_require__(9985);

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ 2643:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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


module.exports = {};


/***/ }),

/***/ 8506:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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

/***/ 2297:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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

/***/ 5266:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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


// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ 8999:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isCallable = __webpack_require__(9985);

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ 598:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isObject = __webpack_require__(8999);

module.exports = function (argument) {
  return isObject(argument) || argument === null;
};


/***/ }),

/***/ 3931:
/***/ ((module) => {


module.exports = false;


/***/ }),

/***/ 734:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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

/***/ 6310:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toLength = __webpack_require__(3126);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ 8702:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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

/***/ 2560:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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


// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 1868:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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


var uncurryThis = __webpack_require__(8844);

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ 4948:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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

/***/ 9556:
/***/ ((__unused_webpack_module, exports) => {


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

/***/ 4684:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isNullOrUndefined = __webpack_require__(981);

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ 2713:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var shared = __webpack_require__(3430);
var uid = __webpack_require__(4630);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ 4091:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var global = __webpack_require__(9037);
var defineGlobalProperty = __webpack_require__(5014);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ }),

/***/ 3430:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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

/***/ 146:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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


// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(4413);
var requireObjectCoercible = __webpack_require__(4684);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ 8700:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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


var wellKnownSymbol = __webpack_require__(4201);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ 4327:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var classof = __webpack_require__(926);

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ }),

/***/ 3691:
/***/ ((module) => {


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


/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(146);

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ 5648:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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


var global = __webpack_require__(9037);
var isCallable = __webpack_require__(9985);

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ 4201:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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

/***/ 8324:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


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

/***/ 6544:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// UNUSED EXPORTS: getPrinterInfoRTC, getServerInfoRTC, submitPrintJobRTC

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.json.stringify.js
var es_json_stringify = __webpack_require__(8324);
;// CONCATENATED MODULE: ./node_modules/pc-mobility-cloud/client/ts/session.ts

async function createSession(baseUrl, req) {
  const init = prepareRequestInit(req.clientToken, req.clientId);
  init.method = "POST";
  const response = await fetch(`${sessionPath(baseUrl)}`, init);
  if (response.status !== 200) {
    throw `error creating client session [${response.status}]`;
  }
  return await response.json();
}
async function createOffer(baseUrl, req) {
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
async function notifyClientCandidates(baseUrl, req) {
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
async function getAnswer(baseUrl, req) {
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
async function getServerCandidates(baseUrl, req) {
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
async function deleteSession(baseUrl, req) {
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

;// CONCATENATED MODULE: ./src/scripts/globals.ts
const _EXTENSION_ID = (/* unused pure expression or super */ null && ("ndakideadaglgpbblmppfonobpdgggin"));

const _APP_ID = (/* unused pure expression or super */ null && ("alhngdkjgnedakdlnamimgfihgkmenbh"));

const _SELF_ID = (/* unused pure expression or super */ null && ("ndakideadaglgpbblmppfonobpdgggin"));

const _VERSION = (/* unused pure expression or super */ null && ("1.4.3"));

(function () {
  if (false) {}
})();
function isExtension() {
  return "ndakideadaglgpbblmppfonobpdgggin" === "ndakideadaglgpbblmppfonobpdgggin";
}
function isApp() {
  return "ndakideadaglgpbblmppfonobpdgggin" === "alhngdkjgnedakdlnamimgfihgkmenbh";
}
function GetClientVersionID() {
  if (isApp()) {
    return 'ChromeApp-' + "1.4.3";
  } else {
    return 'ChromeAppExt-' + "1.4.3";
  }
}
;// CONCATENATED MODULE: ./src/scripts/time/format.ts
function format_iso8601DateTimeZone(d) {
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
    console.log.apply(console, [format_iso8601DateTimeZone(new Date()), ...args]);
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
    console.error.apply(console, [format_iso8601DateTimeZone(new Date()), ...args]);
  }
  if (isRemoteLogging()) {
    remoteLog({
      method: 'POST',
      body: JSON.stringify(['ERROR', ...args])
    });
  }
}
function log_warn(...args) {
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

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.description.js
var es_symbol_description = __webpack_require__(6544);
;// CONCATENATED MODULE: ./src/scripts/peer/blob.ts

const DEFAULT_CHUNK_SIZE = 16384;
const MIN_CHUNK_SIZE = 1;
function chunkBlob(blob, chunkSize) {
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
async function blobToArrayBuffer(blob) {
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
;// CONCATENATED MODULE: ./src/scripts/peer/message.ts
class Message {
  constructor(ev) {
    this.ev = ev;
  }
  stringData() {
    return this.ev.data;
  }
  data() {
    return this.ev.data;
  }
}
;// CONCATENATED MODULE: ./src/scripts/peer/datachannel.ts




class DataChannel {
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
    log_log(`[${this.label}] sendBlob: size=${b.size} bytes, numChunks=${numChunks}`);
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
          log_log(`Transferred ${chunkIdx + 1} out of ${numChunks} chunks. [`, 'label=', this.label, ']');
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
    log_log(`[${this.label}] ` + 'Starting data channel transfer. [', 'size=', b.size, 'chunkSize=', chunkSize, 'chunks=', numChunks, 'bufferHigh=', thresholdHigh, ']');
    const start = Date.now();
    await fillToCapacity();
    await deferred.promise;
    this.dataChannel.onbufferedamountlow = undefined;
    log_log('Data channel transfer complete. [', 'label=', this.label, 'duration=', `${Date.now() - start}ms`, ']');
  }
  sendString(s) {
    log_log(`[${this.label}] sendString: size=${s.length} bytes`);
    if (this.isClosed()) {
      log_error(`Cannot send message on closed channel '${this.label}`);
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

function decodeSessionDescription(offer) {
  return JSON.parse(atob(offer));
}
function encodeSessionDescription(sd) {
  return btoa(JSON.stringify(sd));
}
;// CONCATENATED MODULE: ./src/scripts/peer/peer.ts



const peer_MIN_CHUNK_SIZE = 16 * 1024;
const MAX_CHUNK_SIZE = 256 * 1024;
class Peer {
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
      log_log(`[${this.getServerId()}]`, `Using SCTP specified chunk size value: ${this.connection.sctp.maxMessageSize} bytes`);
      return Math.min(this.connection.sctp.maxMessageSize - 1, MAX_CHUNK_SIZE);
    }
    log_log(`[${this.getServerId()}] Using fall-back chunk size value: ${peer_MIN_CHUNK_SIZE} bytes`);
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
    log_log(`[${this.serverId}] checking peer connection state:`, this.connection.iceConnectionState);
    return this.connection.connectionState === 'connected';
  }
  close() {
    log_log(`[${this.serverId}] closing peer connection...`);
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
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.set.js
var es_typed_array_set = __webpack_require__(9976);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.sort.js
var es_typed_array_sort = __webpack_require__(3356);
;// CONCATENATED MODULE: ./src/scripts/cloudprint/client.ts







class MobRTCClient {
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
    log_log(`[${this.serverId}] Fetching server info...`);
    const dc = this.getServerInfoChannel();
    dc.sendString(' ');
    return this.readJsonResponseFromChannel(dc, this.shortTimeout);
  }
  async sendPrintJobDetails(printToken, printerUrl, params, fileSize) {
    log_log(`[${this.serverId}]`, `Submitting print job details: printerUrl=${printerUrl}, fileSize=${fileSize} bytes.`);
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
      log_error(`[${this.serverId}] error parsing print job details response.`, e);
      throw e;
    }
    if (MobRTCClient.isError(data)) {
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
    log_log(`[${this.serverId}] Exchanging share token for print token.`);
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
        log_error(`[${this.serverId}] error parsing auth-token response.`, e);
        return reject(e);
      }
      if (MobRTCClient.isError(printToken)) {
        return reject(`failed to exchange shareToken for printToken: ${printToken}`);
      }
      return resolve(printToken);
    });
  }
  readChunkedResponse(dc, chunkTimeout = this.timeout) {
    log_log(`[${dc.label}] readChunkedResponse,  chunkTimeout=${chunkTimeout}ms`);
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
          log_log(`[${dc.label}]`, `Finished receiving ${(result.length / 1024).toFixed(2)}KiB,`, `chunks received: [${chunkIdx}]`, `took: ${(performance.now() - startTime).toFixed(2)} ms`);
          return resolve(result);
        }
        const chunk = msg.data();
        buf.push(new Uint8Array(chunk));
        if (logEveryNChunks === 0 && chunk.byteLength > 0) {
          logEveryNChunks = Math.floor(1024 * 1024 / chunk.byteLength);
        } else if (logEveryNChunks > 0 && chunkIdx > 0 && chunkIdx % logEveryNChunks === 0) {
          log_log(`[${dc.label}]: `, `Received ${chunkIdx} chunks,`, `${(chunk.byteLength * chunkIdx / 1024).toFixed(2)}KiB .`);
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
        log_error(`[${this.serverId}] error reading printer info response.`, e);
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
        if (MobRTCClient.isError(data)) {
          log_error(`[${tag}]: Server responded with error: ${data}`);
          return reject(`Server responded with error on: ${dc.label}`);
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          log_error(`[${tag}]: error parsing JSON response: `, e, buf);
          return reject(e);
        }
      } catch (e) {
        log_error(`[${tag}]: error reading response: `, e, buf);
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






const SERVER_INFO_LABEL = 'SERVERINFO';
const JOB_CHANNEL_LABEL = 'JOB';
const JOB_DETAILS_LABEL = 'JOBDETAILS';
const PRINTER_CHANNEL_LABEL = 'PRINTER';
const TOKEN_CHANNEL_LABEL = 'TOKEN';
const CAPABILITIES_CHANNEL_LABEL = 'CAPABILITIES';
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
    log_log(`[MOB RTC Builder.${this.serverId}] Client '${this.clientId}' creating session via ${this.baseUrl} ...`);
    const {
      id,
      iceConfig
    } = await createSession(this.baseUrl, {
      clientToken,
      clientId: this.clientId
    });
    let sessionDeleted = false;
    log_log(`[MOB RTC Builder.${this.serverId}] ICE servers`, iceConfig.servers);
    const sessionParams = {
      clientToken,
      sessionId: id,
      clientId: this.clientId
    };
    log_log(`[MOB RTC Builder.${this.serverId}] starting peer connection: ` + `serverId=${this.serverId}, sessionId=${id}, clientId=${this.clientId}`);
    const peer = new Peer(this.serverId, iceConfig);
    peer.onConnectionStateChange((ctx, _) => {
      if (sessionDeleted) {
        return;
      }
      switch (ctx.getConnectionState()) {
        case 'closed':
        case 'failed':
          log_log(`[MOB RTC Builder.${this.serverId}] RTC connection closed, deleting session.`, 'sessionId', id);
          sessionDeleted = true;
          deleteSession(this.baseUrl, {
            ...sessionParams
          }).then(() => {
            log_log(`[MOB RTC Builder.${this.serverId}] Cloud session deleted.`, 'sessionId', id);
          });
          break;
        default:
          log_log(`[MOB RTC Builder.${this.serverId}] RTC connection state changed: ${ctx.getConnectionState()}`);
      }
    });
    peer.onICECandidate(async (ctx, ev) => {
      if (ev.candidate == null) {
        log_log(`[MOB RTC Builder.${this.serverId}] candidates exhausted`, id);
        return;
      }
      if (!receivedAnswer) {
        clientCandidates.push(JSON.stringify(ev.candidate));
        return;
      }
      try {
        log_log(`[MOB RTC Builder.${this.serverId}] found candidate, sending to remote peer`, 'candidate', ev.candidate, 'sessionId', id);
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
    log_log(`[MOB RTC Builder.${this.serverId}] registering ice candidate send handler`);
    const offer = new Promise(res => {
      peer.onNegotiationNeeded(async (ctx, _) => {
        const offer = await ctx.createOffer();
        res(offer);
      });
    });
    const dataChannels = this.setDataChannelHandlers(peer);
    log_log(`[MOB RTC Builder.${this.serverId}] sending offer to remote peer`);
    await createOffer(this.baseUrl, {
      ...sessionParams,
      iceOffer: await offer
    });
    log_log(`[MOB RTC Builder.${this.serverId}] awaiting answer`);
    const answer = await pollGetAnswer(this.baseUrl, {
      ...sessionParams
    }, {
      interval: 500,
      timeout: 15000
    });
    if (answer == 'timeout') {
      throw new Error('could not retrieve remote answer');
    }
    log_log(`[MOB RTC Builder.${this.serverId}] registering remote answer locally`);
    await peer.registerAnswer(answer.iceAnswer);
    receivedAnswer = true;
    if (clientCandidates.length > 0) {
      log_log(`[MOB RTC Builder.${this.serverId}] sending buffered candidate to peer`);
      await notifyClientCandidates(this.baseUrl, {
        ...sessionParams,
        iceCandidates: clientCandidates
      });
    }
    this.pollForCandidates(peer, sessionParams);
    try {
      await peerConnectionLive;
    } catch (e) {
      log_log(`[MOB RTC Builder.${this.serverId}] Peer connection failed...`);
      throw e;
    }
    const sel = peer.getSelectedCandidatePair();
    log_log(`Selected peer candidates, local: ${JSON.stringify(sel.local)}, remote: ${JSON.stringify(sel.remote)}`);
    log_log(`[MOB RTC Builder.${this.serverId}] Peer connection is live. `, `Time to establish: ${(Date.now() - start) / 1000}s.`);
    try {
      await Promise.race([dataChannels, new Promise(res => setTimeout(res, this.timeout))]);
    } catch (e) {
      throw e;
    }
    log_log(`[MOB RTC Builder.${this.serverId}] Creating Mobility Cloud client: 
			version=${GetClientVersionID()},
			sessionId=${sessionParams.sessionId}
			clientId=${sessionParams.clientId}
			timeout=${this.timeout}ms, 
			maxChunkSize=${iceConfig.maxChunkSize}`);
    return new MobRTCClient(sessionParams.sessionId, peer, this.timeout, iceConfig.maxChunkSize, GetClientVersionID());
  }
  pollForCandidates(peer, sessionParams, timeoutMs = 20000) {
    log_log(`[MOB RTC Builder.${this.serverId}]`, `session '${sessionParams.sessionId}' starting polling for server candidates...`);
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
          log_log(`[MOB RTC Builder.${this.serverId}] session '${sessionParams.sessionId}' got candidate`, c);
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
      log_log(`[MOB RTC Builder.${this.serverId}]`, `session '${sessionParams.sessionId}' stopped waiting for more server candidates`);
    });
  }
  setDataChannelHandler(peer, label) {
    const channel = peer.createDataChannel(label);
    channel.onClose((ctx, _) => {
      log_log(`[MOB RTC Client] [${ctx.label}] datachannel closed`);
    });
    channel.onError((ctx, ev) => {
      if (ev.error.message == 'Transport channel closed') {} else {
        log_log(`[MOB RTC Client] [${ctx.label}] datachannel error`, ev.error.errorDetail);
      }
    });
    return new Promise(resolve => {
      channel.onOpen((ctx, _) => {
        log_log(`[MOB RTC Client] [${ctx.label}] datachannel open and ready`);
        resolve();
      });
    });
  }
  setDataChannelHandlers(peer) {
    return Promise.all([this.setDataChannelHandler(peer, SERVER_INFO_LABEL), this.setDataChannelHandler(peer, CAPABILITIES_CHANNEL_LABEL), this.setDataChannelHandler(peer, TOKEN_CHANNEL_LABEL), this.setDataChannelHandler(peer, PRINTER_CHANNEL_LABEL), this.setDataChannelHandler(peer, JOB_CHANNEL_LABEL), this.setDataChannelHandler(peer, JOB_DETAILS_LABEL)]);
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
function capabilities_parseMobilityPrintCapabilities(capabilities) {
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
  log(`Local storage cleanup settings: reclaimStorageLimitKb=${reclaimStorageLimitKb} KiB, ` + `printedOlderThanDays=${printedOlderThanDays} days`);
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
  log(` updatePrintToken: Saving print token for: ${printTokenCacheID}`);
  getPrintTokenCache().set(printTokenCacheID, printToken);
  saveMapToStorage(storageKeyPrintTokenCache, printTokenCache).then(() => log(` updatePrintToken: Updated print token for: ${printTokenCacheID}`));
}
function updateServerInfo(serverId, serverInfo) {
  const idToServerInfoCache = getServerIdToServerInfoCache();
  idToServerInfoCache.set(serverId, serverInfo);
  saveMapToStorage(storageKeyServerIdToInfoCache, idToServerInfoCache).then(() => log(`Updated info for server '${serverId}: ${JSON.stringify(serverInfo)}...`));
}
function populateCache(reclaimStorageLimitKb, printedOlderThanDays) {
  Promise.all([loadMapFromStorage(storageKeyPrinterTimeUsedMap, printerTimeUsedMap), loadMapFromStorage(storageKeyPrinterCapabilitiesMap, printerCapabilitiesCache), loadMapFromStorage(storageKeyPrinterServerMap, printerNameToServerIdCache), loadMapFromStorage(storageKeyPrintTokenCache, printTokenCache), loadMapFromStorage(storageKeyServerIdToInfoCache, serverIdToInfoCache)]).then(() => {
    chrome.storage.local.getBytesInUse(bytesInUse => {
      log(`[OffNetworkCache:populateCache] total cached storage: ${(bytesInUse / 1024).toFixed(2)}KiB`);
      if (bytesInUse / 1024 >= reclaimStorageLimitKb) {
        warn(`Exceeded storage limit threshold of ${reclaimStorageLimitKb}KiB, 
					cleanup capabilities for printers not used in ${printedOlderThanDays} days...`);
        cleanupStorage(printedOlderThanDays).then(() => log(`Completed cleanup of printers used > ${printedOlderThanDays} days`));
      }
      cacheLoaded = true;
      log('[OffNetworkCache:populateCache] completed.');
    });
  });
}
async function loadMapFromStorage(key, toMap) {
  try {
    const map = await loadMap(key);
    if (map) {
      copyToMap(map, toMap);
      log(`Loaded '${key}' with ${map.size} items from local storage...`);
    } else {
      log(`Unable to load '${key} from local storage - it does not exist`);
    }
  } catch (reason) {
    return error(`Unable to load '${key}' from local storage: ${reason}`);
  }
}
async function saveMapToStorage(key, map) {
  try {
    await saveMap(key, map);
    return log(`Saved '${key}' with ${map.size} items to local storage...`);
  } catch (reason) {
    error(`Failed to save data to local storage: ${reason}`);
    if (reason && reason.toLowerCase().includes('quota')) {
      cleanupStorage(printedOlderThanDays).then(() => log(`Completed cleanup of printers used > ${printedOlderThanDays} days`));
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
  log(`[OffNetworkCache:cleanupStorage] Storage cleanup requested, printing threshold=${printedOlderThanDays}days`);
  chrome.storage.local.getBytesInUse(usedBytes => {
    log(`[OffNetworkCache:cleanupStorage] Storage cleanup, ${(usedBytes / 1024).toFixed(2)}KiB used`);
    log(`[OffNetworkCache:cleanupStorage] ${printerCapabilitiesCache.size} printer capabilities cached`);
  });
  for (const printerId of printerCapabilitiesCache.keys()) {
    const printerName = printerNameFromUrl(printerId);
    const unusedPrinter = printerName == undefined || (await getServerIdForPrinter(printerId)) === undefined;
    const printedDays = daysAgo(printerTimeUsedMap.get(printerId));
    let discard = false;
    if (unusedPrinter) {
      log(`[OffNetworkCache:cleanupStorage] Discarding unused printer capability: ${printerName}`);
      discard = true;
    } else if (printedDays === undefined || printedDays > printedOlderThanDays) {
      log(`[OffNetworkCache:cleanupStorage] Discarding printer capability older than ${printedOlderThanDays} days: 
			${printerName}, last printed: ${printedDays ? printedDays.toFixed(0) + ' days ago' : 'never'}`);
      discard = true;
    }
    if (discard) {
      printerTimeUsedMap.delete(printerId);
      printerCapabilitiesCache.delete(printerId);
    }
  }
  log(`[OffNetworkCache:cleanupStorage] ${printerCapabilitiesCache.size} printer capabilities after clean-up`);
  Promise.all([saveMapToStorage(storageKeyPrinterTimeUsedMap, printerTimeUsedMap), saveMapToStorage(storageKeyPrinterCapabilitiesMap, printerCapabilitiesCache)]).then(() => {
    chrome.storage.local.getBytesInUse(bytesInUse => {
      log(`[OffNetworkCache:cleanupStorage] Cleanup complete, ${(bytesInUse / 1024).toFixed(2)}KiB used`);
    });
  });
}
async function updatePrinterCache(serverId, printers) {
  for (const printer of printers) {
    printerCapabilitiesCache.set(printer.id, printer.capabilities);
    printerNameToServerIdCache.set(printer.name, serverId);
  }
  await Promise.all([saveMapToStorage(storageKeyPrinterTimeUsedMap, printerTimeUsedMap), saveMapToStorage(storageKeyPrinterCapabilitiesMap, printerCapabilitiesCache), saveMapToStorage(storageKeyPrinterServerMap, printerNameToServerIdCache)]).catch(e => {
    error(`Failed to save data caches to storage: ${e.name} - ${e.message}`);
  });
}
function getPrinterCapabilities(printerId) {
  const cap = printerCapabilitiesCache.get(printerId);
  if (!cap) {
    log(`Cached printer capability for '${printerId}' missing from cache!`);
    return null;
  }
  log(`Found cached printer capabilities for: ${printerId} => ${JSON.stringify(cap)}`);
  return parseMobilityPrintCapabilities(cap);
}
function updateLastPrintedTime(printerUrl) {
  printerTimeUsedMap.set(printerUrl, Date.now());
  saveMapToStorage(storageKeyPrinterTimeUsedMap, printerTimeUsedMap).then(() => {
    log(`Saved last printed date for: ${printerUrl}`);
  });
}
async function getServerIdForPrinter(printerUrl) {
  const printerName = printerNameFromUrl(printerUrl);
  if (!printerName) {
    return undefined;
  }
  const ready = await waitForCondition(() => {
    log('[OffNetworkCache:getServerIdForPrinter] Waiting for cache to be loaded and ready...');
    return cacheLoaded;
  });
  if (!ready) {
    error('[OffNetworkCache:getServerIdForPrinter] Giving up waited for cache to be ready...');
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
    error(`Cannot find printer name - invalid URL: ${printerUrl}`, e);
    return undefined;
  }
}
;// CONCATENATED MODULE: ./src/scripts/offnetwork/offscreen.ts





const CLOUD_PRINT_ERR = 'Cloud Print error';
navigator.serviceWorker.onmessage = e => {
  switch (e.data.MsgType) {
    case 'get-printers-from-server':
      {
        getPrintersFromServer(e.data.ServerID, e.data.ClientID, e.data.TestEnv, e.data.ShareToken, e.data.PrintToken).then(function (printers) {
          log_log(`[OFFSCREEN] Returning ${printers.length} cloud printers to service worker.`, printers);
          messageServiceWorker(e, true, printers);
        }).catch(function (rejectReason) {
          log_log(`[OFFSCREEN] getPrintersFromServer() reject response to service worker (reason: ${rejectReason})`);
          messageServiceWorker(e, false, rejectReason);
        });
        break;
      }
    case 'get-printer-info-rtc':
      {
        getPrinterInfoRTC(e.data.PrinterID, e.data.ServerID, e.data.ClientID, e.data.TestEnv, e.data.ShareToken, e.data.PrintToken).then(function (capabilities) {
          log_log(`[OFFSCREEN] Returning printer '${e.data.PrinterID} capabilities to service worker.`, capabilities);
          messageServiceWorker(e, true, capabilities);
        }).catch(function (rejectReason) {
          log_log(`[OFFSCREEN] getPrinterInfoRTC() reject response to service worker (reason: ${rejectReason})`);
          messageServiceWorker(e, false, rejectReason);
        });
        break;
      }
    case 'submit-print-job-rtc':
      {
        submitPrintJobRTC(e.data.FileData, e.data.PrinterURL, e.data.Params, e.data.ServerID, e.data.ClientID, e.data.TestEnv, e.data.ShareToken, e.data.PrintToken).then(function (jobDetails) {
          log_log(`[OFFSCREEN] Returning ${e.data.PrinterURL} job details to service worker.`);
          messageServiceWorker(e, true, jobDetails);
        }).catch(function (rejectReason) {
          log_log(`[OFFSCREEN] submitPrintJobRTC() reject response to service worker (reason: ${rejectReason})`);
          messageServiceWorker(e, false, rejectReason);
        });
        break;
      }
    case 'get-exch-print-token':
      {
        getOrExchangePrintToken(e.data.ServerID, e.data.ClientID, e.data.TestEnv, e.data.ShareToken, e.data.PrintToken).then(function (printToken) {
          log_log(`[OFFSCREEN] Returning ${e.data.ServerID} print token to service worker.`);
          messageServiceWorker(e, true, printToken);
        }).catch(function (rejectReason) {
          log_log(`[OFFSCREEN] getOrExchangePrintToken() reject response to service worker (reason: ${rejectReason})`);
          messageServiceWorker(e, false, rejectReason);
        });
        break;
      }
    case 'get-server-info-rtc':
      {
        getServerInfoRTC(e.data.ServerID, e.data.ClientID, e.data.TestEnv, e.data.ShareToken, e.data.PrintToken).then(function (serverInfo) {
          log_log(`[OFFSCREEN] Returning ${e.data.ServerID} server info to service worker.`, serverInfo);
          messageServiceWorker(e, true, serverInfo);
        }).catch(function (rejectReason) {
          log_log(`[OFFSCREEN] getServerInfoRTC() reject response to service worker (reason: ${rejectReason})`);
          messageServiceWorker(e, false, rejectReason);
        });
        break;
      }
    default:
      log_log(`[OFFSCREEN] received unexpected message from service worker: ${JSON.stringify(e.data)}`);
  }
};
function messageServiceWorker(e, responseSuccess, responseData) {
  e.ports[0].postMessage({
    RespState: responseSuccess,
    RespData: responseData
  });
}
async function getMobRTCClient(serverId, clientId, testEnv, shareToken, printToken) {
  log_log(`[OFFSCREEN] Getting Mobility Cloud client for server '${serverId}' ...`);
  const client = getServerIdToClientCache().get(serverId);
  if (client && client.isReady()) {
    log_log(`[OFFSCREEN] Using cached Cloud Print client: ${client.getID()} for server: ${serverId}`);
    return client;
  } else if (client) {
    log_log(`[OFFSCREEN] Ignoring stale Cloud Print client: ${client.getID()} for server: ${serverId}`);
  }
  return createMobRTCClient(serverId, clientId, testEnv, shareToken, printToken);
}
async function createMobRTCClient(serverId, clientId, testEnv, shareToken, printToken) {
  const clientBuilder = new MobRTCClientBuilder(serverId).setClientId(clientId);
  log_log(`[OFFSCREEN] createMobRTCClient(): clientBuilder initialized: 
		serverId=${serverId}, clientId=${clientId}, clientVersionId=${GetClientVersionID()}`);
  if (testEnv) {
    clientBuilder.setBaseUrl(CLIENT_API_BASE_URL_TEST);
  }
  if (printToken) {
    clientBuilder.setPrintToken(printToken);
  } else {
    clientBuilder.setShareToken(shareToken);
  }
  let client;
  try {
    client = await clientBuilder.build();
  } catch (e) {
    log_log(`[OFFSCREEN] ERROR: Could not create Mobility Cloud Print client: ${serverId} (error: ` + e + ')');
    throw new Error(`${CLOUD_PRINT_ERR}: Could not connect: ${e}`);
  }
  log_log('[OFFSCREEN] createMobRTCClient(): clientBuilder completed.', client);
  getServerIdToClientCache().set(serverId, client);
  try {
    const serverInfo = await client.getServerInfo();
    log_log('[OFFSCREEN] createMobRTCClient(): serverInfo obtained', serverInfo);
    offscreen_sendToServiceWorker('cache-server-info', {
      ServerID: serverId,
      ServerInfo: serverInfo
    });
  } catch (e) {
    log_log('[OFFSCREEN] Error: could not obtain server info for cache update: ' + e);
  }
  return client;
}
async function getServerInfoRTC(serverId, clientId, testEnv, shareToken, printToken) {
  let client;
  try {
    client = await getMobRTCClient(serverId, clientId, testEnv, shareToken, printToken);
  } catch (e) {
    log_log('[OFFSCREEN:getServerInfoRTC] Cloud Print connection can not be established: ' + e);
    throw new Error('can not get server info from cloud connection');
  }
  const serverInfo = await client.getServerInfo();
  log_log('[OFFSCREEN:getServerInfoRTC] Received server info: ' + serverInfo);
  return serverInfo;
}
async function getOrExchangePrintToken(serverId, clientId, testEnv, shareToken, printToken) {
  let client;
  try {
    client = await getMobRTCClient(serverId, clientId, testEnv, shareToken, printToken);
  } catch (e) {
    log_log('[OFFSCREEN:getServerInfoRTC] ERROR creating Mobility RTC Client: ' + e);
  }
  return await client.getPrintToken(shareToken);
}
async function submitPrintJobRTC(file, printerUrl, params, serverId, clientId, testEnv, shareToken, printToken) {
  let client;
  try {
    client = await getMobRTCClient(serverId, clientId, testEnv, shareToken, printToken);
  } catch (e) {
    log_log('[OFFSCREEN:submitPrintJobRTC] Cloud Print connection can not be established: ' + e);
    throw e;
  }
  if (printToken) {
    log_log(`[OFFSCREEN:submitPrintJobRTC] got cached print token for: ${serverId}`);
  } else {
    printToken = await exchangePrintToken(serverId, printToken, client, shareToken);
  }
  let jobDetails;
  try {
    jobDetails = await client.sendPrintJobDetails(printToken, printerUrl, params, file.size);
  } catch (e) {
    log_log('[OFFSCREEN:submitPrintJobRTC] ERROR: sendPrintJobDetails failed: ' + e);
    offscreen_sendToServiceWorker('delete-print-token-cache', {
      ServerID: serverId,
      ShareToken: shareToken
    });
    throw new Error(`${CLOUD_PRINT_ERR}: ${e}`);
  }
  try {
    await client.sendPrintJob(file);
  } catch (e) {
    log_log('[OFFSCREEN:submitPrintJobRTC] ERROR: sendPrintJob failed: ' + e);
    throw new Error(`${CLOUD_PRINT_ERR}: ${e}`);
  }
  log_log('[OFFSCREEN:submitPrintJobRTC] completed job submission.');
  return jobDetails;
}
async function getPrinterInfoRTC(printerId, serverId, clientId, testEnv, shareToken, printToken) {
  log_log('[OFFSCREEN] Requesting printer capabilities via RTC (ServerID: ' + serverId + ' PrinterID: ' + printerId);
  let client;
  try {
    client = await getMobRTCClient(serverId, clientId, testEnv, shareToken, printToken);
  } catch (e) {
    log_log('[OFFSCREEN] ERROR creating Mobility RTC Client: ' + e);
    throw new Error('can not get capabilities from cloud connection');
  }
  const capabilities = await client.getCapabilities(printerId);
  log_log('[OFFSCREEN] Received printer capabilities: ' + JSON.stringify(capabilities));
  return capabilities;
}
async function exchangePrintToken(serverId, printToken, client, shareToken) {
  printToken = await client.getPrintToken(shareToken);
  offscreen_sendToServiceWorker('update-print-token-cache', {
    ServerID: serverId,
    ShareToken: shareToken,
    PrintToken: printToken
  });
  return printToken;
}
async function getPrintersFromServer(serverId, clientId, testEnv, shareToken, printToken) {
  let client;
  try {
    log_log(`[OFFSCREEN:getPrintersFromServer] serverId=${serverId}`);
    client = await getMobRTCClient(serverId, clientId, testEnv, shareToken, printToken);
  } catch (e) {
    log_log('[OFFSCREEN:getPrintersFromServer] ERROR creating Mobility CLoud Client: ' + e);
    return [];
  }
  if (printToken) {
    log_log(`[OFFSCREEN:getPrintersFromServer] got cached print token for: ${serverId}`);
  } else {
    printToken = await exchangePrintToken(serverId, printToken, client, shareToken);
  }
  let printers;
  try {
    printers = await client.getPrinters(printToken);
  } catch (e) {
    log_log('[OFFSCREEN] Error getting printers from server: ' + e);
    offscreen_sendToServiceWorker('delete-print-token-cache', {
      ServerID: serverId,
      ShareToken: shareToken
    });
    return [];
  }
  offscreen_sendToServiceWorker('update-printer-cache', {
    ServerID: serverId,
    PrinterList: printers
  });
  return printers;
}
function offscreen_sendToServiceWorker(type, data) {
  chrome.runtime.sendMessage({
    type,
    target: 'background',
    data
  });
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxLQUFLO0VBQ3BCQyxjQUFjLEVBQUUsS0FBSztFQUNyQkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxLQUFLO0VBQ3BCQyxjQUFjLEVBQUUsS0FBSztFQUNyQkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFNBQVM7RUFDZm9ELGFBQWEsRUFBRSxLQUFLO0VBQ3BCQyxjQUFjLEVBQUUsS0FBSztFQUNyQkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxPQUFPO0VBQ3RCQyxjQUFjLEVBQUUsT0FBTztFQUN2QkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxNQUFNO0VBQ3JCQyxjQUFjLEVBQUUsT0FBTztFQUN2QkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxNQUFNO0VBQ3JCQyxjQUFjLEVBQUUsTUFBTTtFQUN0QkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxNQUFNO0VBQ3JCQyxjQUFjLEVBQUUsTUFBTTtFQUN0QkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxNQUFNO0VBQ3JCQyxjQUFjLEVBQUUsTUFBTTtFQUN0QkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxNQUFNO0VBQ3JCQyxjQUFjLEVBQUUsTUFBTTtFQUN0QkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxNQUFNO0VBQ3JCQyxjQUFjLEVBQUUsTUFBTTtFQUN0QkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxLQUFLO0VBQ3BCQyxjQUFjLEVBQUUsTUFBTTtFQUN0QkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxLQUFLO0VBQ3BCQyxjQUFjLEVBQUUsS0FBSztFQUNyQkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxLQUFLO0VBQ3BCQyxjQUFjLEVBQUUsS0FBSztFQUNyQkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFNBQVM7RUFDZm9ELGFBQWEsRUFBRSxLQUFLO0VBQ3BCQyxjQUFjLEVBQUUsS0FBSztFQUNyQkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxPQUFPO0VBQ3RCQyxjQUFjLEVBQUUsT0FBTztFQUN2QkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxNQUFNO0VBQ3JCQyxjQUFjLEVBQUUsT0FBTztFQUN2QkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxNQUFNO0VBQ3JCQyxjQUFjLEVBQUUsTUFBTTtFQUN0QkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxNQUFNO0VBQ3JCQyxjQUFjLEVBQUUsTUFBTTtFQUN0QkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxNQUFNO0VBQ3JCQyxjQUFjLEVBQUUsTUFBTTtFQUN0QkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxNQUFNO0VBQ3JCQyxjQUFjLEVBQUUsTUFBTTtFQUN0QkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxNQUFNO0VBQ3JCQyxjQUFjLEVBQUUsTUFBTTtFQUN0QkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxLQUFLO0VBQ3BCQyxjQUFjLEVBQUUsTUFBTTtFQUN0QkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxLQUFLO0VBQ3BCQyxjQUFjLEVBQUUsS0FBSztFQUNyQkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFFBQVE7RUFDZG9ELGFBQWEsRUFBRSxLQUFLO0VBQ3BCQyxjQUFjLEVBQUUsS0FBSztFQUNyQkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFNBQVM7RUFDZm9ELGFBQWEsRUFBRSxLQUFLO0VBQ3BCQyxjQUFjLEVBQUUsS0FBSztFQUNyQkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFdBQVc7RUFDakJvRCxhQUFhLEVBQUUsTUFBTTtFQUNyQkMsY0FBYyxFQUFFLE1BQU07RUFDdEJMLFVBQVUsRUFBRSxLQUFLO0VBQ2pCTSxtQkFBbUIsRUFBRTtBQUN6QixDQUFDLEVBQ0Q7RUFDSXRELElBQUksRUFBRSxVQUFVO0VBQ2hCb0QsYUFBYSxFQUFFLE1BQU07RUFDckJDLGNBQWMsRUFBRSxNQUFNO0VBQ3RCTCxVQUFVLEVBQUUsS0FBSztFQUNqQk0sbUJBQW1CLEVBQUU7QUFDekIsQ0FBQyxFQUNEO0VBQ0l0RCxJQUFJLEVBQUUsUUFBUTtFQUNkb0QsYUFBYSxFQUFFLE1BQU07RUFDckJDLGNBQWMsRUFBRSxNQUFNO0VBQ3RCTCxVQUFVLEVBQUUsS0FBSztFQUNqQk0sbUJBQW1CLEVBQUU7QUFDekIsQ0FBQyxFQUNEO0VBQ0l0RCxJQUFJLEVBQUUsY0FBYztFQUNwQm9ELGFBQWEsRUFBRSxNQUFNO0VBQ3JCQyxjQUFjLEVBQUUsTUFBTTtFQUN0QkwsVUFBVSxFQUFFLEtBQUs7RUFDakJNLG1CQUFtQixFQUFFO0FBQ3pCLENBQUMsRUFDRDtFQUNJdEQsSUFBSSxFQUFFLFlBQVk7RUFDbEJvRCxhQUFhLEVBQUUsTUFBTTtFQUNyQkMsY0FBYyxFQUFFLE1BQU07RUFDdEJMLFVBQVUsRUFBRSxLQUFLO0VBQ2pCTSxtQkFBbUIsRUFBRTtBQUN6QixDQUFDLEVBQ0Q7RUFDSXRELElBQUksRUFBRSxXQUFXO0VBQ2pCb0QsYUFBYSxFQUFFLE1BQU07RUFDckJDLGNBQWMsRUFBRSxNQUFNO0VBQ3RCTCxVQUFVLEVBQUUsS0FBSztFQUNqQk0sbUJBQW1CLEVBQUU7QUFDekIsQ0FBQyxDQUNKO0FBQ00sU0FBU0UseUJBQXlCQSxDQUFDQyxZQUFZLEdBQUdWLG1CQUFtQixFQUFFVyxhQUFhLEdBQUdULG9CQUFvQixFQUFFVSxVQUFVLEdBQUdSLGlCQUFpQixFQUFFO0VBQ2hKLE9BQU87SUFDSDVGLE9BQU8sRUFBRSxLQUFLO0lBQ2RxRyxPQUFPLEVBQUU7TUFDTEMsc0JBQXNCLEVBQUUsQ0FBQztRQUFFQyxZQUFZLEVBQUU7TUFBa0IsQ0FBQyxDQUFDO01BQzdEQyxLQUFLLEVBQUU7UUFDSEMsTUFBTSxFQUFFUDtNQUNaLENBQUM7TUFDRFEsTUFBTSxFQUFFO1FBQ0pELE1BQU0sRUFBRU47TUFDWixDQUFDO01BQ0RRLGdCQUFnQixFQUFFO1FBQ2RGLE1BQU0sRUFBRSxDQUNKO1VBQUVoUSxJQUFJLEVBQUUsVUFBVTtVQUFFZ1AsVUFBVSxFQUFFO1FBQUssQ0FBQyxFQUN0QztVQUFFaFAsSUFBSSxFQUFFLFdBQVc7VUFBRWdQLFVBQVUsRUFBRTtRQUFNLENBQUMsRUFDeEM7VUFBRWhQLElBQUksRUFBRSxNQUFNO1VBQUVnUCxVQUFVLEVBQUU7UUFBTSxDQUFDO01BRTNDLENBQUM7TUFDRG1CLE1BQU0sRUFBRTtRQUFFQyxPQUFPLEVBQUUsQ0FBQztRQUFFNU4sR0FBRyxFQUFFO01BQUksQ0FBQztNQUNoQzZOLFVBQVUsRUFBRTtRQUFFTCxNQUFNLEVBQUVMO01BQVc7SUFDckM7RUFDSixDQUFDO0FBQ0w7QUFDTyxTQUFTVywyQ0FBOEJBLENBQUNDLFlBQVksRUFBRTtFQUN6RCxNQUFNWixVQUFVLEdBQUdZLFlBQVksQ0FBQ1osVUFBVSxDQUFDYSxHQUFHLENBQUVDLENBQUMsS0FBTTtJQUNuRHpFLElBQUksRUFBRSxRQUFRO0lBQ2RvRCxhQUFhLEVBQUVxQixDQUFDLENBQUNDLFlBQVk7SUFDN0JyQixjQUFjLEVBQUVvQixDQUFDLENBQUNFLGFBQWE7SUFDL0IzQixVQUFVLEVBQUV5QixDQUFDLENBQUNHLFNBQVM7SUFDdkJ0QixtQkFBbUIsRUFBRW1CLENBQUMsQ0FBQ0ksaUJBQWlCLElBQUlKLENBQUMsQ0FBQ3pFO0VBQ2xELENBQUMsQ0FBQyxDQUFDO0VBQ0gsSUFBSTJELFVBQVUsQ0FBQ3hRLE1BQU0sR0FBRyxDQUFDLElBQ3JCd1EsVUFBVSxDQUFDbUIsS0FBSyxDQUFDLFVBQVVMLENBQUMsRUFBRTtJQUMxQixPQUFPLENBQUNBLENBQUMsQ0FBQ3pCLFVBQVU7RUFDeEIsQ0FBQyxDQUFDLEVBQUU7SUFDSlcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDWCxVQUFVLEdBQUcsSUFBSTtFQUNuQztFQUNBLE1BQU1TLFlBQVksR0FBR2MsWUFBWSxDQUFDUixLQUFLLENBQUNTLEdBQUcsQ0FBQyxVQUFVelMsQ0FBQyxFQUFFO0lBQ3JELE9BQU87TUFBRWlDLElBQUksRUFBRWpDO0lBQUUsQ0FBQztFQUN0QixDQUFDLENBQUM7RUFDRixJQUFJMFIsWUFBWSxDQUFDdFEsTUFBTSxHQUFHLENBQUMsRUFBRTtJQUN6QnNRLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJO0VBQ3hDO0VBQ0EsTUFBTUMsYUFBYSxHQUFHYSxZQUFZLENBQUNOLE1BQU0sQ0FBQ08sR0FBRyxDQUFDLFVBQVV6UyxDQUFDLEVBQUU7SUFDdkQsT0FBTztNQUFFaUMsSUFBSSxFQUFFakM7SUFBRSxDQUFDO0VBQ3RCLENBQUMsQ0FBQztFQUNGLElBQUkyUixhQUFhLENBQUN2USxNQUFNLEdBQUcsQ0FBQyxFQUFFO0lBQzFCdVEsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUk7RUFDekM7RUFDQSxPQUFPRix5QkFBeUIsQ0FBQ0MsWUFBWSxFQUFFQyxhQUFhLEVBQUVDLFVBQVUsQ0FBQztBQUM3RTs7O0FDM1YwQztBQUMrQjtBQUNOO0FBQ3hCO0FBQ3BDLE1BQU13Qix3QkFBd0IsR0FBRyxJQUFJNUwsR0FBRyxDQUFDLENBQUM7QUFDakQsTUFBTTZMLHFCQUFxQixHQUFHLElBQUk3TCxHQUFHLENBQUMsQ0FBQztBQUN2QyxNQUFNOEwsNkJBQTZCLEdBQUcscUJBQXFCO0FBQzNELE1BQU1DLG1CQUFtQixHQUFHLElBQUkvTCxHQUFHLENBQUMsQ0FBQztBQUNyQyxNQUFNZ00sNEJBQTRCLEdBQUcsb0JBQW9CO0FBQ3pELE1BQU1DLGdDQUFnQyxHQUFHLHdCQUF3QjtBQUNqRSxNQUFNQywwQkFBMEIsR0FBRyxrQkFBa0I7QUFDckQsTUFBTUMseUJBQXlCLEdBQUcsaUJBQWlCO0FBQ25ELE1BQU1DLGtCQUFrQixHQUFHLElBQUlwTSxHQUFHLENBQUMsQ0FBQztBQUNwQyxNQUFNcU0sMEJBQTBCLEdBQUcsSUFBSXJNLEdBQUcsQ0FBQyxDQUFDO0FBQzVDLE1BQU1zTSxlQUFlLEdBQUcsSUFBSXRNLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLE1BQU11TSwrQkFBK0IsR0FBRyx1QkFBdUI7QUFDL0QsTUFBTUMsOEJBQThCLEdBQUcsc0JBQXNCO0FBQzdELElBQUlDLHFCQUFxQjtBQUN6QixJQUFJQyxvQkFBb0I7QUFDeEIsSUFBSUMsV0FBVyxHQUFHLEtBQUs7QUFDaEIsZUFBZUMsU0FBU0EsQ0FBQSxFQUFHO0VBQzlCLE1BQU0sQ0FBQ0MsWUFBWSxFQUFFQyxVQUFVLENBQUMsR0FBRyxNQUFNclIsT0FBTyxDQUFDNE4sR0FBRyxDQUFDLENBQ2pEbUMsbUJBQW1CLENBQUNlLCtCQUErQixDQUFDLENBQUN0RSxJQUFJLENBQUM4RSxDQUFDLElBQUlBLENBQUMsR0FBRyxDQUFDQSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQzdFdkIsbUJBQW1CLENBQUNnQiw4QkFBOEIsQ0FBQyxDQUFDdkUsSUFBSSxDQUFDOEUsQ0FBQyxJQUFJQSxDQUFDLEdBQUcsQ0FBQ0EsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUM3RSxDQUFDO0VBQ0ZOLHFCQUFxQixHQUFHSSxZQUFZO0VBQ3BDSCxvQkFBb0IsR0FBR0ksVUFBVTtFQUNqQ3pULEdBQUcsQ0FBRSx5REFBd0RvVCxxQkFBc0IsUUFBTyxHQUNyRix3QkFBdUJDLG9CQUFxQixPQUFNLENBQUM7RUFDeERNLGFBQWEsQ0FBQ1AscUJBQXFCLEVBQUVDLG9CQUFvQixDQUFDO0FBQzlEO0FBQ08sU0FBU08sd0JBQXdCQSxDQUFBLEVBQUc7RUFDdkMsT0FBT3BCLHFCQUFxQjtBQUNoQztBQUNPLFNBQVNxQiw0QkFBNEJBLENBQUEsRUFBRztFQUMzQyxPQUFPbkIsbUJBQW1CO0FBQzlCO0FBQ08sU0FBU29CLDZCQUE2QkEsQ0FBQSxFQUFHO0VBQzVDLE9BQU9kLDBCQUEwQjtBQUNyQztBQUNPLFNBQVNlLGtCQUFrQkEsQ0FBQSxFQUFHO0VBQ2pDLE9BQU9kLGVBQWU7QUFDMUI7QUFDTyxTQUFTZSxnQkFBZ0JBLENBQUNDLGlCQUFpQixFQUFFL0ksVUFBVSxFQUFFO0VBQzVELElBQUksQ0FBQ0EsVUFBVSxFQUFFO0lBQ2JqSyxJQUFJLENBQUMsK0NBQStDLENBQUM7RUFDekQ7RUFDQWpCLEdBQUcsQ0FBRSw4Q0FBNkNpVSxpQkFBa0IsRUFBQyxDQUFDO0VBQ3RFRixrQkFBa0IsQ0FBQyxDQUFDLENBQUN6TSxHQUFHLENBQUMyTSxpQkFBaUIsRUFBRS9JLFVBQVUsQ0FBQztFQUN2RGdKLGdCQUFnQixDQUFDcEIseUJBQXlCLEVBQUVHLGVBQWUsQ0FBQyxDQUN2RHJFLElBQUksQ0FBQyxNQUFNNU8sR0FBRyxDQUFFLCtDQUE4Q2lVLGlCQUFrQixFQUFDLENBQUMsQ0FBQztBQUM1RjtBQUNPLFNBQVNFLGdCQUFnQkEsQ0FBQy9RLFFBQVEsRUFBRWdSLFVBQVUsRUFBRTtFQUNuRCxNQUFNQyxtQkFBbUIsR0FBR1IsNEJBQTRCLENBQUMsQ0FBQztFQUMxRFEsbUJBQW1CLENBQUMvTSxHQUFHLENBQUNsRSxRQUFRLEVBQUVnUixVQUFVLENBQUM7RUFDN0NGLGdCQUFnQixDQUFDekIsNkJBQTZCLEVBQUU0QixtQkFBbUIsQ0FBQyxDQUMvRHpGLElBQUksQ0FBQyxNQUFNNU8sR0FBRyxDQUFFLDRCQUEyQm9ELFFBQVMsS0FBSXhHLElBQUksQ0FBQ0MsU0FBUyxDQUFDdVgsVUFBVSxDQUFFLEtBQUksQ0FBQyxDQUFDO0FBQ2xHO0FBQ0EsU0FBU1QsYUFBYUEsQ0FBQ1AscUJBQXFCLEVBQUVDLG9CQUFvQixFQUFFO0VBQ2hFalIsT0FBTyxDQUFDNE4sR0FBRyxDQUFDLENBQ1JzRSxrQkFBa0IsQ0FBQzNCLDRCQUE0QixFQUFFSSxrQkFBa0IsQ0FBQyxFQUNwRXVCLGtCQUFrQixDQUFDMUIsZ0NBQWdDLEVBQUVMLHdCQUF3QixDQUFDLEVBQzlFK0Isa0JBQWtCLENBQUN6QiwwQkFBMEIsRUFBRUcsMEJBQTBCLENBQUMsRUFDMUVzQixrQkFBa0IsQ0FBQ3hCLHlCQUF5QixFQUFFRyxlQUFlLENBQUMsRUFDOURxQixrQkFBa0IsQ0FBQzdCLDZCQUE2QixFQUFFQyxtQkFBbUIsQ0FBQyxDQUN6RSxDQUFDLENBQUM5RCxJQUFJLENBQUMsTUFBTTtJQUNWbFAsTUFBTSxDQUFDQyxPQUFPLENBQUNDLEtBQUssQ0FBQzJVLGFBQWEsQ0FBQ0MsVUFBVSxJQUFJO01BQzdDeFUsR0FBRyxDQUFFLHlEQUF3RCxDQUFDd1UsVUFBVSxHQUFHLElBQUksRUFBRTdILE9BQU8sQ0FBQyxDQUFDLENBQUUsS0FBSSxDQUFDO01BQ2pHLElBQUk2SCxVQUFVLEdBQUcsSUFBSSxJQUFJcEIscUJBQXFCLEVBQUU7UUFDNUNuUyxJQUFJLENBQUUsdUNBQXNDbVMscUJBQXNCO0FBQ2xGLHFEQUFxREMsb0JBQXFCLFVBQVMsQ0FBQztRQUNwRW9CLGNBQWMsQ0FBQ3BCLG9CQUFvQixDQUFDLENBQy9CekUsSUFBSSxDQUFDLE1BQU01TyxHQUFHLENBQUUsd0NBQXVDcVQsb0JBQXFCLE9BQU0sQ0FBQyxDQUFDO01BQzdGO01BQ0FDLFdBQVcsR0FBRyxJQUFJO01BQ2xCdFQsR0FBRyxDQUFDLDRDQUE0QyxDQUFDO0lBQ3JELENBQUMsQ0FBQztFQUNOLENBQUMsQ0FBQztBQUNOO0FBQ0EsZUFBZXNVLGtCQUFrQkEsQ0FBQ0ksR0FBRyxFQUFFQyxLQUFLLEVBQUU7RUFDMUMsSUFBSTtJQUNBLE1BQU0vQyxHQUFHLEdBQUcsTUFBTVEsT0FBTyxDQUFDc0MsR0FBRyxDQUFDO0lBQzlCLElBQUk5QyxHQUFHLEVBQUU7TUFDTGdELFNBQVMsQ0FBQ2hELEdBQUcsRUFBRStDLEtBQUssQ0FBQztNQUNyQjNVLEdBQUcsQ0FBRSxXQUFVMFUsR0FBSSxVQUFTOUMsR0FBRyxDQUFDM1AsSUFBSyw4QkFBNkIsQ0FBQztJQUN2RSxDQUFDLE1BQ0k7TUFDRGpDLEdBQUcsQ0FBRSxtQkFBa0IwVSxHQUFJLHlDQUF3QyxDQUFDO0lBQ3hFO0VBQ0osQ0FBQyxDQUNELE9BQU9HLE1BQU0sRUFBRTtJQUNYLE9BQU8xVyxLQUFLLENBQUUsbUJBQWtCdVcsR0FBSSx5QkFBd0JHLE1BQU8sRUFBQyxDQUFDO0VBQ3pFO0FBQ0o7QUFDQSxlQUFlWCxnQkFBZ0JBLENBQUNRLEdBQUcsRUFBRTlDLEdBQUcsRUFBRTtFQUN0QyxJQUFJO0lBQ0EsTUFBTVMsT0FBTyxDQUFDcUMsR0FBRyxFQUFFOUMsR0FBRyxDQUFDO0lBQ3ZCLE9BQU81UixHQUFHLENBQUUsVUFBUzBVLEdBQUksVUFBUzlDLEdBQUcsQ0FBQzNQLElBQUssNEJBQTJCLENBQUM7RUFDM0UsQ0FBQyxDQUNELE9BQU80UyxNQUFNLEVBQUU7SUFDWDFXLEtBQUssQ0FBRSx5Q0FBd0MwVyxNQUFPLEVBQUMsQ0FBQztJQUN4RCxJQUFJQSxNQUFNLElBQUlBLE1BQU0sQ0FBQ0MsV0FBVyxDQUFDLENBQUMsQ0FBQ0MsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO01BQ2xETixjQUFjLENBQUNwQixvQkFBb0IsQ0FBQyxDQUMvQnpFLElBQUksQ0FBQyxNQUFNNU8sR0FBRyxDQUFFLHdDQUF1Q3FULG9CQUFxQixPQUFNLENBQUMsQ0FBQztJQUM3RjtFQUNKO0FBQ0o7QUFDQSxTQUFTdUIsU0FBU0EsQ0FBQ0ksR0FBRyxFQUFFQyxHQUFHLEVBQUU7RUFDekJBLEdBQUcsQ0FBQ0MsS0FBSyxDQUFDLENBQUM7RUFDWEYsR0FBRyxDQUFDL0gsT0FBTyxDQUFDLENBQUN4SSxLQUFLLEVBQUVpUSxHQUFHLEtBQUtPLEdBQUcsQ0FBQzNOLEdBQUcsQ0FBQ29OLEdBQUcsRUFBRWpRLEtBQUssQ0FBQyxDQUFDO0FBQ3BEO0FBQ0EsU0FBUzBRLE9BQU9BLENBQUNDLGVBQWUsRUFBRTtFQUM5QixNQUFNQyxZQUFZLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTtFQUN4QyxJQUFJRCxlQUFlLEtBQUs1VixTQUFTLEVBQUU7SUFDL0IsT0FBT0EsU0FBUztFQUNwQjtFQUNBLE9BQU8sQ0FBQ3dCLElBQUksQ0FBQ2dFLEdBQUcsQ0FBQyxDQUFDLEdBQUdvUSxlQUFlLElBQUlDLFlBQVk7QUFDeEQ7QUFDQSxlQUFlWixjQUFjQSxDQUFDcEIsb0JBQW9CLEVBQUU7RUFDaERyVCxHQUFHLENBQUUsa0ZBQWlGcVQsb0JBQXFCLE1BQUssQ0FBQztFQUNqSDNULE1BQU0sQ0FBQ0MsT0FBTyxDQUFDQyxLQUFLLENBQUMyVSxhQUFhLENBQUNlLFNBQVMsSUFBSTtJQUM1Q3RWLEdBQUcsQ0FBRSxxREFBb0QsQ0FBQ3NWLFNBQVMsR0FBRyxJQUFJLEVBQUUzSSxPQUFPLENBQUMsQ0FBQyxDQUFFLFVBQVMsQ0FBQztJQUNqRzNNLEdBQUcsQ0FBRSxvQ0FBbUN1Uyx3QkFBd0IsQ0FBQ3RRLElBQUssOEJBQTZCLENBQUM7RUFDeEcsQ0FBQyxDQUFDO0VBQ0YsS0FBSyxNQUFNc0wsU0FBUyxJQUFJZ0Ysd0JBQXdCLENBQUNnRCxJQUFJLENBQUMsQ0FBQyxFQUFFO0lBQ3JELE1BQU1DLFdBQVcsR0FBR0Msa0JBQWtCLENBQUNsSSxTQUFTLENBQUM7SUFDakQsTUFBTW1JLGFBQWEsR0FBR0YsV0FBVyxJQUFJaFcsU0FBUyxJQUFJLE9BQU1tVyxxQkFBcUIsQ0FBQ3BJLFNBQVMsQ0FBQyxNQUFLL04sU0FBUztJQUN0RyxNQUFNb1csV0FBVyxHQUFHVCxPQUFPLENBQUNwQyxrQkFBa0IsQ0FBQ2xULEdBQUcsQ0FBQzBOLFNBQVMsQ0FBQyxDQUFDO0lBQzlELElBQUlzSSxPQUFPLEdBQUcsS0FBSztJQUNuQixJQUFJSCxhQUFhLEVBQUU7TUFDZjFWLEdBQUcsQ0FBRSwwRUFBeUV3VixXQUFZLEVBQUMsQ0FBQztNQUM1RkssT0FBTyxHQUFHLElBQUk7SUFDbEIsQ0FBQyxNQUNJLElBQUlELFdBQVcsS0FBS3BXLFNBQVMsSUFBSW9XLFdBQVcsR0FBR3ZDLG9CQUFvQixFQUFFO01BQ3RFclQsR0FBRyxDQUFFLDZFQUE0RXFULG9CQUFxQjtBQUNsSCxLQUFLbUMsV0FBWSxtQkFBa0JJLFdBQVcsR0FBR0EsV0FBVyxDQUFDakosT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsR0FBRyxPQUFRLEVBQUMsQ0FBQztNQUN0RmtKLE9BQU8sR0FBRyxJQUFJO0lBQ2xCO0lBQ0EsSUFBSUEsT0FBTyxFQUFFO01BQ1Q5QyxrQkFBa0IsQ0FBQytDLE1BQU0sQ0FBQ3ZJLFNBQVMsQ0FBQztNQUNwQ2dGLHdCQUF3QixDQUFDdUQsTUFBTSxDQUFDdkksU0FBUyxDQUFDO0lBQzlDO0VBQ0o7RUFDQXZOLEdBQUcsQ0FBRSxvQ0FBbUN1Uyx3QkFBd0IsQ0FBQ3RRLElBQUssc0NBQXFDLENBQUM7RUFDNUdHLE9BQU8sQ0FBQzROLEdBQUcsQ0FBQyxDQUNSa0UsZ0JBQWdCLENBQUN2Qiw0QkFBNEIsRUFBRUksa0JBQWtCLENBQUMsRUFDbEVtQixnQkFBZ0IsQ0FBQ3RCLGdDQUFnQyxFQUFFTCx3QkFBd0IsQ0FBQyxDQUMvRSxDQUFDLENBQUMzRCxJQUFJLENBQUMsTUFBTTtJQUNWbFAsTUFBTSxDQUFDQyxPQUFPLENBQUNDLEtBQUssQ0FBQzJVLGFBQWEsQ0FBQ0MsVUFBVSxJQUFJO01BQzdDeFUsR0FBRyxDQUFFLHNEQUFxRCxDQUFDd1UsVUFBVSxHQUFHLElBQUksRUFBRTdILE9BQU8sQ0FBQyxDQUFDLENBQUUsVUFBUyxDQUFDO0lBQ3ZHLENBQUMsQ0FBQztFQUNOLENBQUMsQ0FBQztBQUNOO0FBQ08sZUFBZW9KLGtCQUFrQkEsQ0FBQzNTLFFBQVEsRUFBRTRKLFFBQVEsRUFBRTtFQUN6RCxLQUFLLE1BQU1nRSxPQUFPLElBQUloRSxRQUFRLEVBQUU7SUFDNUJ1Rix3QkFBd0IsQ0FBQ2pMLEdBQUcsQ0FBQzBKLE9BQU8sQ0FBQ3hRLEVBQUUsRUFBRXdRLE9BQU8sQ0FBQ1csWUFBWSxDQUFDO0lBQzlEcUIsMEJBQTBCLENBQUMxTCxHQUFHLENBQUMwSixPQUFPLENBQUM1RCxJQUFJLEVBQUVoSyxRQUFRLENBQUM7RUFDMUQ7RUFDQSxNQUFNaEIsT0FBTyxDQUFDNE4sR0FBRyxDQUFDLENBQ2RrRSxnQkFBZ0IsQ0FBQ3ZCLDRCQUE0QixFQUFFSSxrQkFBa0IsQ0FBQyxFQUNsRW1CLGdCQUFnQixDQUFDdEIsZ0NBQWdDLEVBQUVMLHdCQUF3QixDQUFDLEVBQzVFMkIsZ0JBQWdCLENBQUNyQiwwQkFBMEIsRUFBRUcsMEJBQTBCLENBQUMsQ0FDM0UsQ0FBQyxDQUFDdlMsS0FBSyxDQUFDQyxDQUFDLElBQUk7SUFDVnZDLEtBQUssQ0FBRSwwQ0FBeUN1QyxDQUFDLENBQUMwTSxJQUFLLE1BQUsxTSxDQUFDLENBQUNvUCxPQUFRLEVBQUMsQ0FBQztFQUM1RSxDQUFDLENBQUM7QUFDTjtBQUNPLFNBQVNrRyxzQkFBc0JBLENBQUN6SSxTQUFTLEVBQUU7RUFDOUMsTUFBTTBJLEdBQUcsR0FBRzFELHdCQUF3QixDQUFDMVMsR0FBRyxDQUFDME4sU0FBUyxDQUFDO0VBQ25ELElBQUksQ0FBQzBJLEdBQUcsRUFBRTtJQUNOalcsR0FBRyxDQUFFLGtDQUFpQ3VOLFNBQVUsdUJBQXNCLENBQUM7SUFDdkUsT0FBTyxJQUFJO0VBQ2Y7RUFDQXZOLEdBQUcsQ0FBRSwwQ0FBeUN1TixTQUFVLE9BQU0zUSxJQUFJLENBQUNDLFNBQVMsQ0FBQ29aLEdBQUcsQ0FBRSxFQUFDLENBQUM7RUFDcEYsT0FBT3ZFLDhCQUE4QixDQUFDdUUsR0FBRyxDQUFDO0FBQzlDO0FBQ08sU0FBU0MscUJBQXFCQSxDQUFDL0ssVUFBVSxFQUFFO0VBQzlDNEgsa0JBQWtCLENBQUN6TCxHQUFHLENBQUM2RCxVQUFVLEVBQUVuSyxJQUFJLENBQUNnRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQzlDa1AsZ0JBQWdCLENBQUN2Qiw0QkFBNEIsRUFBRUksa0JBQWtCLENBQUMsQ0FDN0RuRSxJQUFJLENBQUMsTUFBTTtJQUNaNU8sR0FBRyxDQUFFLGdDQUErQm1MLFVBQVcsRUFBQyxDQUFDO0VBQ3JELENBQUMsQ0FBQztBQUNOO0FBQ08sZUFBZXdLLHFCQUFxQkEsQ0FBQ3hLLFVBQVUsRUFBRTtFQUNwRCxNQUFNcUssV0FBVyxHQUFHQyxrQkFBa0IsQ0FBQ3RLLFVBQVUsQ0FBQztFQUNsRCxJQUFJLENBQUNxSyxXQUFXLEVBQUU7SUFDZCxPQUFPaFcsU0FBUztFQUNwQjtFQUNBLE1BQU0yVyxLQUFLLEdBQUcsTUFBTTdELGdCQUFnQixDQUFDLE1BQU07SUFDdkN0UyxHQUFHLENBQUMscUZBQXFGLENBQUM7SUFDMUYsT0FBT3NULFdBQVc7RUFDdEIsQ0FBQyxDQUFDO0VBQ0YsSUFBSSxDQUFDNkMsS0FBSyxFQUFFO0lBQ1JoWSxLQUFLLENBQUMsbUZBQW1GLENBQUM7SUFDMUYsT0FBT3FCLFNBQVM7RUFDcEI7RUFDQSxLQUFLLE1BQU0sQ0FBQzRXLGlCQUFpQixFQUFFaFQsUUFBUSxDQUFDLElBQUk0UCwwQkFBMEIsRUFBRTtJQUNwRSxJQUFJb0QsaUJBQWlCLENBQUNyVyxVQUFVLENBQUN5VixXQUFXLENBQUMsRUFBRTtNQUMzQyxPQUFPcFMsUUFBUTtJQUNuQjtFQUNKO0VBQ0EsT0FBTzVELFNBQVM7QUFDcEI7QUFDQSxTQUFTaVcsa0JBQWtCQSxDQUFDdEssVUFBVSxFQUFFO0VBQ3BDLElBQUk7SUFDQSxNQUFNa0wsT0FBTyxHQUFHLElBQUlDLEdBQUcsQ0FBQ25MLFVBQVUsQ0FBQyxDQUFDb0wsUUFBUTtJQUM1QyxNQUFNQyxTQUFTLEdBQUdILE9BQU8sQ0FBQ0ksV0FBVyxDQUFDLEdBQUcsQ0FBQztJQUMxQyxPQUFPQyxrQkFBa0IsQ0FBQ0wsT0FBTyxDQUFDTSxTQUFTLENBQUNILFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQztFQUMvRCxDQUFDLENBQ0QsT0FBTzlWLENBQUMsRUFBRTtJQUNOdkMsS0FBSyxDQUFFLDJDQUEwQ2dOLFVBQVcsRUFBQyxFQUFFekssQ0FBQyxDQUFDO0lBQ2pFLE9BQU9sQixTQUFTO0VBQ3BCO0FBQ0o7OztBQ3BOOEU7QUFDOUI7QUFDbkI7QUFDZ0M7QUFDN0QsTUFBTW9YLGVBQWUsR0FBRyxtQkFBbUI7QUFDM0NDLFNBQVMsQ0FBQ0MsYUFBYSxDQUFDcFIsU0FBUyxHQUFHaEYsQ0FBQyxJQUFJO0VBQ3JDLFFBQVFBLENBQUMsQ0FBQ1csSUFBSSxDQUFDMFYsT0FBTztJQUNsQixLQUFLLDBCQUEwQjtNQUFFO1FBQzdCQyxxQkFBcUIsQ0FBQ3RXLENBQUMsQ0FBQ1csSUFBSSxDQUFDNFYsUUFBUSxFQUFFdlcsQ0FBQyxDQUFDVyxJQUFJLENBQUM2VixRQUFRLEVBQUV4VyxDQUFDLENBQUNXLElBQUksQ0FBQzhWLE9BQU8sRUFBRXpXLENBQUMsQ0FBQ1csSUFBSSxDQUFDK1YsVUFBVSxFQUFFMVcsQ0FBQyxDQUFDVyxJQUFJLENBQUNnVyxVQUFVLENBQUMsQ0FBQ3pJLElBQUksQ0FBQyxVQUFVNUIsUUFBUSxFQUFFO1VBQ25JaE4sT0FBRyxDQUFFLHlCQUF3QmdOLFFBQVEsQ0FBQ3pNLE1BQU8sb0NBQW1DLEVBQUV5TSxRQUFRLENBQUM7VUFDM0ZzSyxvQkFBb0IsQ0FBQzVXLENBQUMsRUFBRSxJQUFJLEVBQUVzTSxRQUFRLENBQUM7UUFDM0MsQ0FBQyxDQUFDLENBQUN2TSxLQUFLLENBQUMsVUFBVThXLFlBQVksRUFBRTtVQUM3QnZYLE9BQUcsQ0FBRSxrRkFBaUZ1WCxZQUFhLEdBQUUsQ0FBQztVQUN0R0Qsb0JBQW9CLENBQUM1VyxDQUFDLEVBQUUsS0FBSyxFQUFFNlcsWUFBWSxDQUFDO1FBQ2hELENBQUMsQ0FBQztRQUNGO01BQ0o7SUFDQSxLQUFLLHNCQUFzQjtNQUFFO1FBQ3pCQyxpQkFBaUIsQ0FBQzlXLENBQUMsQ0FBQ1csSUFBSSxDQUFDb1csU0FBUyxFQUFFL1csQ0FBQyxDQUFDVyxJQUFJLENBQUM0VixRQUFRLEVBQUV2VyxDQUFDLENBQUNXLElBQUksQ0FBQzZWLFFBQVEsRUFBRXhXLENBQUMsQ0FBQ1csSUFBSSxDQUFDOFYsT0FBTyxFQUFFelcsQ0FBQyxDQUFDVyxJQUFJLENBQUMrVixVQUFVLEVBQUUxVyxDQUFDLENBQUNXLElBQUksQ0FBQ2dXLFVBQVUsQ0FBQyxDQUFDekksSUFBSSxDQUFDLFVBQVUrQyxZQUFZLEVBQUU7VUFDckozUixPQUFHLENBQUUsa0NBQWlDVSxDQUFDLENBQUNXLElBQUksQ0FBQ29XLFNBQVUsa0NBQWlDLEVBQUU5RixZQUFZLENBQUM7VUFDdkcyRixvQkFBb0IsQ0FBQzVXLENBQUMsRUFBRSxJQUFJLEVBQUVpUixZQUFZLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUNsUixLQUFLLENBQUMsVUFBVThXLFlBQVksRUFBRTtVQUM3QnZYLE9BQUcsQ0FBRSw4RUFBNkV1WCxZQUFhLEdBQUUsQ0FBQztVQUNsR0Qsb0JBQW9CLENBQUM1VyxDQUFDLEVBQUUsS0FBSyxFQUFFNlcsWUFBWSxDQUFDO1FBQ2hELENBQUMsQ0FBQztRQUNGO01BQ0o7SUFDQSxLQUFLLHNCQUFzQjtNQUFFO1FBQ3pCRyxpQkFBaUIsQ0FBQ2hYLENBQUMsQ0FBQ1csSUFBSSxDQUFDc1csUUFBUSxFQUFFalgsQ0FBQyxDQUFDVyxJQUFJLENBQUN1VyxVQUFVLEVBQUVsWCxDQUFDLENBQUNXLElBQUksQ0FBQ3dXLE1BQU0sRUFBRW5YLENBQUMsQ0FBQ1csSUFBSSxDQUFDNFYsUUFBUSxFQUFFdlcsQ0FBQyxDQUFDVyxJQUFJLENBQUM2VixRQUFRLEVBQUV4VyxDQUFDLENBQUNXLElBQUksQ0FBQzhWLE9BQU8sRUFBRXpXLENBQUMsQ0FBQ1csSUFBSSxDQUFDK1YsVUFBVSxFQUFFMVcsQ0FBQyxDQUFDVyxJQUFJLENBQUNnVyxVQUFVLENBQUMsQ0FBQ3pJLElBQUksQ0FBQyxVQUFVa0osVUFBVSxFQUFFO1VBQ3BMOVgsT0FBRyxDQUFFLHlCQUF3QlUsQ0FBQyxDQUFDVyxJQUFJLENBQUN1VyxVQUFXLGlDQUFnQyxDQUFDO1VBQ2hGTixvQkFBb0IsQ0FBQzVXLENBQUMsRUFBRSxJQUFJLEVBQUVvWCxVQUFVLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUNyWCxLQUFLLENBQUMsVUFBVThXLFlBQVksRUFBRTtVQUM3QnZYLE9BQUcsQ0FBRSw4RUFBNkV1WCxZQUFhLEdBQUUsQ0FBQztVQUNsR0Qsb0JBQW9CLENBQUM1VyxDQUFDLEVBQUUsS0FBSyxFQUFFNlcsWUFBWSxDQUFDO1FBQ2hELENBQUMsQ0FBQztRQUNGO01BQ0o7SUFDQSxLQUFLLHNCQUFzQjtNQUFFO1FBQ3pCUSx1QkFBdUIsQ0FBQ3JYLENBQUMsQ0FBQ1csSUFBSSxDQUFDNFYsUUFBUSxFQUFFdlcsQ0FBQyxDQUFDVyxJQUFJLENBQUM2VixRQUFRLEVBQUV4VyxDQUFDLENBQUNXLElBQUksQ0FBQzhWLE9BQU8sRUFBRXpXLENBQUMsQ0FBQ1csSUFBSSxDQUFDK1YsVUFBVSxFQUFFMVcsQ0FBQyxDQUFDVyxJQUFJLENBQUNnVyxVQUFVLENBQUMsQ0FBQ3pJLElBQUksQ0FBQyxVQUFVMUQsVUFBVSxFQUFFO1VBQ3ZJbEwsT0FBRyxDQUFFLHlCQUF3QlUsQ0FBQyxDQUFDVyxJQUFJLENBQUM0VixRQUFTLGlDQUFnQyxDQUFDO1VBQzlFSyxvQkFBb0IsQ0FBQzVXLENBQUMsRUFBRSxJQUFJLEVBQUV3SyxVQUFVLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUN6SyxLQUFLLENBQUMsVUFBVThXLFlBQVksRUFBRTtVQUM3QnZYLE9BQUcsQ0FBRSxvRkFBbUZ1WCxZQUFhLEdBQUUsQ0FBQztVQUN4R0Qsb0JBQW9CLENBQUM1VyxDQUFDLEVBQUUsS0FBSyxFQUFFNlcsWUFBWSxDQUFDO1FBQ2hELENBQUMsQ0FBQztRQUNGO01BQ0o7SUFDQSxLQUFLLHFCQUFxQjtNQUFFO1FBQ3hCUyxnQkFBZ0IsQ0FBQ3RYLENBQUMsQ0FBQ1csSUFBSSxDQUFDNFYsUUFBUSxFQUFFdlcsQ0FBQyxDQUFDVyxJQUFJLENBQUM2VixRQUFRLEVBQUV4VyxDQUFDLENBQUNXLElBQUksQ0FBQzhWLE9BQU8sRUFBRXpXLENBQUMsQ0FBQ1csSUFBSSxDQUFDK1YsVUFBVSxFQUFFMVcsQ0FBQyxDQUFDVyxJQUFJLENBQUNnVyxVQUFVLENBQUMsQ0FBQ3pJLElBQUksQ0FBQyxVQUFVd0YsVUFBVSxFQUFFO1VBQ2hJcFUsT0FBRyxDQUFFLHlCQUF3QlUsQ0FBQyxDQUFDVyxJQUFJLENBQUM0VixRQUFTLGlDQUFnQyxFQUFFN0MsVUFBVSxDQUFDO1VBQzFGa0Qsb0JBQW9CLENBQUM1VyxDQUFDLEVBQUUsSUFBSSxFQUFFMFQsVUFBVSxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDM1QsS0FBSyxDQUFDLFVBQVU4VyxZQUFZLEVBQUU7VUFDN0J2WCxPQUFHLENBQUUsNkVBQTRFdVgsWUFBYSxHQUFFLENBQUM7VUFDakdELG9CQUFvQixDQUFDNVcsQ0FBQyxFQUFFLEtBQUssRUFBRTZXLFlBQVksQ0FBQztRQUNoRCxDQUFDLENBQUM7UUFDRjtNQUNKO0lBQ0E7TUFDSXZYLE9BQUcsQ0FBRSxnRUFBK0RwRCxJQUFJLENBQUNDLFNBQVMsQ0FBQzZELENBQUMsQ0FBQ1csSUFBSSxDQUFFLEVBQUMsQ0FBQztFQUNyRztBQUNKLENBQUM7QUFDRCxTQUFTaVcsb0JBQW9CQSxDQUFDNVcsQ0FBQyxFQUFFdVgsZUFBZSxFQUFFQyxZQUFZLEVBQUU7RUFDNUR4WCxDQUFDLENBQUN5WCxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUNDLFdBQVcsQ0FBQztJQUFFQyxTQUFTLEVBQUVKLGVBQWU7SUFBRUssUUFBUSxFQUFFSjtFQUFhLENBQUMsQ0FBQztBQUNsRjtBQUNBLGVBQWVLLGVBQWVBLENBQUNuVixRQUFRLEVBQUVqSCxRQUFRLEVBQUVxYyxPQUFPLEVBQUV2TSxVQUFVLEVBQUVmLFVBQVUsRUFBRTtFQUNoRmxMLE9BQUcsQ0FBRSx5REFBd0RvRCxRQUFTLE9BQU0sQ0FBQztFQUM3RSxNQUFNcVYsTUFBTSxHQUFHN0Usd0JBQXdCLENBQUMsQ0FBQyxDQUFDL1QsR0FBRyxDQUFDdUQsUUFBUSxDQUFDO0VBQ3ZELElBQUlxVixNQUFNLElBQUlBLE1BQU0sQ0FBQzFNLE9BQU8sQ0FBQyxDQUFDLEVBQUU7SUFDNUIvTCxPQUFHLENBQUUsZ0RBQStDeVksTUFBTSxDQUFDNU4sS0FBSyxDQUFDLENBQUUsZ0JBQWV6SCxRQUFTLEVBQUMsQ0FBQztJQUM3RixPQUFPcVYsTUFBTTtFQUNqQixDQUFDLE1BQ0ksSUFBSUEsTUFBTSxFQUFFO0lBQ2J6WSxPQUFHLENBQUUsa0RBQWlEeVksTUFBTSxDQUFDNU4sS0FBSyxDQUFDLENBQUUsZ0JBQWV6SCxRQUFTLEVBQUMsQ0FBQztFQUNuRztFQUNBLE9BQU9zVixrQkFBa0IsQ0FBQ3RWLFFBQVEsRUFBRWpILFFBQVEsRUFBRXFjLE9BQU8sRUFBRXZNLFVBQVUsRUFBRWYsVUFBVSxDQUFDO0FBQ2xGO0FBQ0EsZUFBZXdOLGtCQUFrQkEsQ0FBQ3RWLFFBQVEsRUFBRWpILFFBQVEsRUFBRXFjLE9BQU8sRUFBRXZNLFVBQVUsRUFBRWYsVUFBVSxFQUFFO0VBQ25GLE1BQU15TixhQUFhLEdBQUcsSUFBSXpLLG1CQUFtQixDQUFDOUssUUFBUSxDQUFDLENBQUMrSyxXQUFXLENBQUNoUyxRQUFRLENBQUM7RUFDN0U2RCxPQUFHLENBQUU7QUFDVCxhQUFhb0QsUUFBUyxjQUFhakgsUUFBUyxxQkFBb0JtQyxrQkFBa0IsQ0FBQyxDQUFFLEVBQUMsQ0FBQztFQUNuRixJQUFJa2EsT0FBTyxFQUFFO0lBQ1RHLGFBQWEsQ0FBQ3JLLFVBQVUsQ0FBQ0wsd0JBQXdCLENBQUM7RUFDdEQ7RUFDQSxJQUFJL0MsVUFBVSxFQUFFO0lBQ1p5TixhQUFhLENBQUN0SyxhQUFhLENBQUNuRCxVQUFVLENBQUM7RUFDM0MsQ0FBQyxNQUNJO0lBQ0R5TixhQUFhLENBQUN2SyxhQUFhLENBQUNuQyxVQUFVLENBQUM7RUFDM0M7RUFDQSxJQUFJd00sTUFBTTtFQUNWLElBQUk7SUFDQUEsTUFBTSxHQUFHLE1BQU1FLGFBQWEsQ0FBQ3BLLEtBQUssQ0FBQyxDQUFDO0VBQ3hDLENBQUMsQ0FDRCxPQUFPN04sQ0FBQyxFQUFFO0lBQ05WLE9BQUcsQ0FBRSxvRUFBbUVvRCxRQUFTLFdBQVUsR0FBRzFDLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDdEcsTUFBTSxJQUFJaUwsS0FBSyxDQUFFLEdBQUVpTCxlQUFnQix3QkFBdUJsVyxDQUFFLEVBQUMsQ0FBQztFQUNsRTtFQUNBVixPQUFHLENBQUMsNERBQTRELEVBQUV5WSxNQUFNLENBQUM7RUFDekU3RSx3QkFBd0IsQ0FBQyxDQUFDLENBQUN0TSxHQUFHLENBQUNsRSxRQUFRLEVBQUVxVixNQUFNLENBQUM7RUFDaEQsSUFBSTtJQUNBLE1BQU1yRSxVQUFVLEdBQUcsTUFBTXFFLE1BQU0sQ0FBQzNOLGFBQWEsQ0FBQyxDQUFDO0lBQy9DOUssT0FBRyxDQUFDLHVEQUF1RCxFQUFFb1UsVUFBVSxDQUFDO0lBQ3hFdFQsNkJBQW1CLENBQUMsbUJBQW1CLEVBQUU7TUFBRW1XLFFBQVEsRUFBRTdULFFBQVE7TUFBRXdWLFVBQVUsRUFBRXhFO0lBQVcsQ0FBQyxDQUFDO0VBQzVGLENBQUMsQ0FDRCxPQUFPMVQsQ0FBQyxFQUFFO0lBQ05WLE9BQUcsQ0FBQyxvRUFBb0UsR0FBR1UsQ0FBQyxDQUFDO0VBQ2pGO0VBQ0EsT0FBTytYLE1BQU07QUFDakI7QUFDTyxlQUFlVCxnQkFBZ0JBLENBQUM1VSxRQUFRLEVBQUVqSCxRQUFRLEVBQUVxYyxPQUFPLEVBQUV2TSxVQUFVLEVBQUVmLFVBQVUsRUFBRTtFQUN4RixJQUFJdU4sTUFBTTtFQUNWLElBQUk7SUFDQUEsTUFBTSxHQUFHLE1BQU1GLGVBQWUsQ0FBQ25WLFFBQVEsRUFBRWpILFFBQVEsRUFBRXFjLE9BQU8sRUFBRXZNLFVBQVUsRUFBRWYsVUFBVSxDQUFDO0VBQ3ZGLENBQUMsQ0FDRCxPQUFPeEssQ0FBQyxFQUFFO0lBQ05WLE9BQUcsQ0FBQyw4RUFBOEUsR0FBR1UsQ0FBQyxDQUFDO0lBQ3ZGLE1BQU0sSUFBSWlMLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQztFQUNwRTtFQUNBLE1BQU15SSxVQUFVLEdBQUcsTUFBTXFFLE1BQU0sQ0FBQzNOLGFBQWEsQ0FBQyxDQUFDO0VBQy9DOUssT0FBRyxDQUFDLHFEQUFxRCxHQUFHb1UsVUFBVSxDQUFDO0VBQ3ZFLE9BQU9BLFVBQVU7QUFDckI7QUFDQSxlQUFlMkQsdUJBQXVCQSxDQUFDM1UsUUFBUSxFQUFFakgsUUFBUSxFQUFFcWMsT0FBTyxFQUFFdk0sVUFBVSxFQUFFZixVQUFVLEVBQUU7RUFDeEYsSUFBSXVOLE1BQU07RUFDVixJQUFJO0lBQ0FBLE1BQU0sR0FBRyxNQUFNRixlQUFlLENBQUNuVixRQUFRLEVBQUVqSCxRQUFRLEVBQUVxYyxPQUFPLEVBQUV2TSxVQUFVLEVBQUVmLFVBQVUsQ0FBQztFQUN2RixDQUFDLENBQ0QsT0FBT3hLLENBQUMsRUFBRTtJQUNOVixPQUFHLENBQUMsbUVBQW1FLEdBQUdVLENBQUMsQ0FBQztFQUNoRjtFQUNBLE9BQU8sTUFBTStYLE1BQU0sQ0FBQ3pNLGFBQWEsQ0FBQ0MsVUFBVSxDQUFDO0FBQ2pEO0FBQ08sZUFBZXlMLGlCQUFpQkEsQ0FBQzdMLElBQUksRUFBRVYsVUFBVSxFQUFFQyxNQUFNLEVBQUVoSSxRQUFRLEVBQUVqSCxRQUFRLEVBQUVxYyxPQUFPLEVBQUV2TSxVQUFVLEVBQUVmLFVBQVUsRUFBRTtFQUNuSCxJQUFJdU4sTUFBTTtFQUNWLElBQUk7SUFDQUEsTUFBTSxHQUFHLE1BQU1GLGVBQWUsQ0FBQ25WLFFBQVEsRUFBRWpILFFBQVEsRUFBRXFjLE9BQU8sRUFBRXZNLFVBQVUsRUFBRWYsVUFBVSxDQUFDO0VBQ3ZGLENBQUMsQ0FDRCxPQUFPeEssQ0FBQyxFQUFFO0lBQ05WLE9BQUcsQ0FBQywrRUFBK0UsR0FBR1UsQ0FBQyxDQUFDO0lBQ3hGLE1BQU1BLENBQUM7RUFDWDtFQUNBLElBQUl3SyxVQUFVLEVBQUU7SUFDWmxMLE9BQUcsQ0FBRSw2REFBNERvRCxRQUFTLEVBQUMsQ0FBQztFQUNoRixDQUFDLE1BQ0k7SUFDRDhILFVBQVUsR0FBRyxNQUFNMk4sa0JBQWtCLENBQUN6VixRQUFRLEVBQUU4SCxVQUFVLEVBQUV1TixNQUFNLEVBQUV4TSxVQUFVLENBQUM7RUFDbkY7RUFDQSxJQUFJNkwsVUFBVTtFQUNkLElBQUk7SUFDQUEsVUFBVSxHQUFHLE1BQU1XLE1BQU0sQ0FBQ3hOLG1CQUFtQixDQUFDQyxVQUFVLEVBQUVDLFVBQVUsRUFBRUMsTUFBTSxFQUFFUyxJQUFJLENBQUM1SixJQUFJLENBQUM7RUFDNUYsQ0FBQyxDQUNELE9BQU92QixDQUFDLEVBQUU7SUFDTlYsT0FBRyxDQUFDLG1FQUFtRSxHQUFHVSxDQUFDLENBQUM7SUFDNUVJLDZCQUFtQixDQUFDLDBCQUEwQixFQUFFO01BQUVtVyxRQUFRLEVBQUU3VCxRQUFRO01BQUVnVSxVQUFVLEVBQUVuTDtJQUFXLENBQUMsQ0FBQztJQUMvRixNQUFNLElBQUlOLEtBQUssQ0FBRSxHQUFFaUwsZUFBZ0IsS0FBSWxXLENBQUUsRUFBQyxDQUFDO0VBQy9DO0VBQ0EsSUFBSTtJQUNBLE1BQU0rWCxNQUFNLENBQUM3TSxZQUFZLENBQUNDLElBQUksQ0FBQztFQUNuQyxDQUFDLENBQ0QsT0FBT25MLENBQUMsRUFBRTtJQUNOVixPQUFHLENBQUMsNERBQTRELEdBQUdVLENBQUMsQ0FBQztJQUNyRSxNQUFNLElBQUlpTCxLQUFLLENBQUUsR0FBRWlMLGVBQWdCLEtBQUlsVyxDQUFFLEVBQUMsQ0FBQztFQUMvQztFQUNBVixPQUFHLENBQUMseURBQXlELENBQUM7RUFDOUQsT0FBTzhYLFVBQVU7QUFDckI7QUFDTyxlQUFlTixpQkFBaUJBLENBQUNqSyxTQUFTLEVBQUVuSyxRQUFRLEVBQUVqSCxRQUFRLEVBQUVxYyxPQUFPLEVBQUV2TSxVQUFVLEVBQUVmLFVBQVUsRUFBRTtFQUNwR2xMLE9BQUcsQ0FBQyxpRUFBaUUsR0FBR29ELFFBQVEsR0FBRyxjQUFjLEdBQUdtSyxTQUFTLENBQUM7RUFDOUcsSUFBSWtMLE1BQU07RUFDVixJQUFJO0lBQ0FBLE1BQU0sR0FBRyxNQUFNRixlQUFlLENBQUNuVixRQUFRLEVBQUVqSCxRQUFRLEVBQUVxYyxPQUFPLEVBQUV2TSxVQUFVLEVBQUVmLFVBQVUsQ0FBQztFQUN2RixDQUFDLENBQ0QsT0FBT3hLLENBQUMsRUFBRTtJQUNOVixPQUFHLENBQUMsa0RBQWtELEdBQUdVLENBQUMsQ0FBQztJQUMzRCxNQUFNLElBQUlpTCxLQUFLLENBQUMsZ0RBQWdELENBQUM7RUFDckU7RUFDQSxNQUFNZ0csWUFBWSxHQUFHLE1BQU04RyxNQUFNLENBQUNuTCxlQUFlLENBQUNDLFNBQVMsQ0FBQztFQUM1RHZOLE9BQUcsQ0FBQyw2Q0FBNkMsR0FBR3BELElBQUksQ0FBQ0MsU0FBUyxDQUFDOFUsWUFBWSxDQUFDLENBQUM7RUFDakYsT0FBT0EsWUFBWTtBQUN2QjtBQUNBLGVBQWVrSCxrQkFBa0JBLENBQUN6VixRQUFRLEVBQUU4SCxVQUFVLEVBQUV1TixNQUFNLEVBQUV4TSxVQUFVLEVBQUU7RUFDeEVmLFVBQVUsR0FBRyxNQUFNdU4sTUFBTSxDQUFDek0sYUFBYSxDQUFDQyxVQUFVLENBQUM7RUFDbkRuTCw2QkFBbUIsQ0FBQywwQkFBMEIsRUFBRTtJQUFFbVcsUUFBUSxFQUFFN1QsUUFBUTtJQUFFZ1UsVUFBVSxFQUFFbkwsVUFBVTtJQUFFb0wsVUFBVSxFQUFFbk07RUFBVyxDQUFDLENBQUM7RUFDdkgsT0FBT0EsVUFBVTtBQUNyQjtBQUNBLGVBQWU4TCxxQkFBcUJBLENBQUM1VCxRQUFRLEVBQUVqSCxRQUFRLEVBQUVxYyxPQUFPLEVBQUV2TSxVQUFVLEVBQUVmLFVBQVUsRUFBRTtFQUN0RixJQUFJdU4sTUFBTTtFQUNWLElBQUk7SUFDQXpZLE9BQUcsQ0FBRSw4Q0FBNkNvRCxRQUFTLEVBQUMsQ0FBQztJQUM3RHFWLE1BQU0sR0FBRyxNQUFNRixlQUFlLENBQUNuVixRQUFRLEVBQUVqSCxRQUFRLEVBQUVxYyxPQUFPLEVBQUV2TSxVQUFVLEVBQUVmLFVBQVUsQ0FBQztFQUN2RixDQUFDLENBQ0QsT0FBT3hLLENBQUMsRUFBRTtJQUNOVixPQUFHLENBQUMsMEVBQTBFLEdBQUdVLENBQUMsQ0FBQztJQUNuRixPQUFPLEVBQUU7RUFDYjtFQUNBLElBQUl3SyxVQUFVLEVBQUU7SUFDWmxMLE9BQUcsQ0FBRSxpRUFBZ0VvRCxRQUFTLEVBQUMsQ0FBQztFQUNwRixDQUFDLE1BQ0k7SUFDRDhILFVBQVUsR0FBRyxNQUFNMk4sa0JBQWtCLENBQUN6VixRQUFRLEVBQUU4SCxVQUFVLEVBQUV1TixNQUFNLEVBQUV4TSxVQUFVLENBQUM7RUFDbkY7RUFDQSxJQUFJZSxRQUFRO0VBQ1osSUFBSTtJQUNBQSxRQUFRLEdBQUcsTUFBTXlMLE1BQU0sQ0FBQzNMLFdBQVcsQ0FBQzVCLFVBQVUsQ0FBQztFQUNuRCxDQUFDLENBQ0QsT0FBT3hLLENBQUMsRUFBRTtJQUNOVixPQUFHLENBQUMsa0RBQWtELEdBQUdVLENBQUMsQ0FBQztJQUMzREksNkJBQW1CLENBQUMsMEJBQTBCLEVBQUU7TUFBRW1XLFFBQVEsRUFBRTdULFFBQVE7TUFBRWdVLFVBQVUsRUFBRW5MO0lBQVcsQ0FBQyxDQUFDO0lBQy9GLE9BQU8sRUFBRTtFQUNiO0VBQ0FuTCw2QkFBbUIsQ0FBQyxzQkFBc0IsRUFBRTtJQUFFbVcsUUFBUSxFQUFFN1QsUUFBUTtJQUFFMFYsV0FBVyxFQUFFOUw7RUFBUyxDQUFDLENBQUM7RUFDMUYsT0FBT0EsUUFBUTtBQUNuQjtBQUNBLFNBQVNsTSw2QkFBbUJBLENBQUNNLElBQUksRUFBRUMsSUFBSSxFQUFFO0VBQ3JDM0IsTUFBTSxDQUFDd0IsT0FBTyxDQUFDSSxXQUFXLENBQUM7SUFDdkJGLElBQUk7SUFDSkcsTUFBTSxFQUFFLFlBQVk7SUFDcEJGO0VBQ0osQ0FBQyxDQUFDO0FBQ04sQyIsInNvdXJjZXMiOlsid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hLWNhbGxhYmxlLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hLXBvc3NpYmxlLXByb3RvdHlwZS5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYW4tb2JqZWN0LmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1idWZmZXItYmFzaWMtZGV0ZWN0aW9uLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1idWZmZXItdmlldy1jb3JlLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1pbmNsdWRlcy5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWlzLXN0cmljdC5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktcmVkdWNlLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1zbGljZS5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktc29ydC5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY2xhc3NvZi1yYXcuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NsYXNzb2YuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NvcHktY29uc3RydWN0b3ItcHJvcGVydGllcy5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY29ycmVjdC1wcm90b3R5cGUtZ2V0dGVyLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NyZWF0ZS1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kZWZpbmUtYnVpbHQtaW4tYWNjZXNzb3IuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RlZmluZS1idWlsdC1pbi5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZGVmaW5lLWdsb2JhbC1wcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZGVzY3JpcHRvcnMuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50LmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbmdpbmUtZmYtdmVyc2lvbi5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZW5naW5lLWlzLWllLW9yLWVkZ2UuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2VuZ2luZS1pcy1ub2RlLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbmdpbmUtdXNlci1hZ2VudC5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZW5naW5lLXY4LXZlcnNpb24uanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2VuZ2luZS13ZWJraXQtdmVyc2lvbi5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZW51bS1idWcta2V5cy5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZXhwb3J0LmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mYWlscy5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZnVuY3Rpb24tYXBwbHkuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQtbmF0aXZlLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi1jYWxsLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi1uYW1lLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMtYWNjZXNzb3IuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcy1jbGF1c2UuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcy5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2V0LWJ1aWx0LWluLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9nZXQtanNvbi1yZXBsYWNlci1mdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2V0LW1ldGhvZC5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2xvYmFsLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5LmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oaWRkZW4ta2V5cy5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2luZGV4ZWQtb2JqZWN0LmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZS5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaW50ZXJuYWwtc3RhdGUuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWFycmF5LmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1jYWxsYWJsZS5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtZm9yY2VkLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1udWxsLW9yLXVuZGVmaW5lZC5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtb2JqZWN0LmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1wb3NzaWJsZS1wcm90b3R5cGUuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLXB1cmUuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLXN5bWJvbC5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbGVuZ3RoLW9mLWFycmF5LWxpa2UuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL21ha2UtYnVpbHQtaW4uanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL21hdGgtdHJ1bmMuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LW5hbWVzLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LXByb3RvdHlwZS1vZi5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWlzLXByb3RvdHlwZS1vZi5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1wcm9wZXJ0eS1pcy1lbnVtZXJhYmxlLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3Qtc2V0LXByb3RvdHlwZS1vZi5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb3JkaW5hcnktdG8tcHJpbWl0aXZlLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vd24ta2V5cy5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQta2V5LmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQtc3RvcmUuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NoYXJlZC5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc3ltYm9sLWNvbnN0cnVjdG9yLWRldGVjdGlvbi5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tYWJzb2x1dGUtaW5kZXguanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0LmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1pbnRlZ2VyLW9yLWluZmluaXR5LmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1sZW5ndGguanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLW9iamVjdC5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tb2Zmc2V0LmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1wb3NpdGl2ZS1pbnRlZ2VyLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1wcmltaXRpdmUuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLXByb3BlcnR5LWtleS5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tc3RyaW5nLXRhZy1zdXBwb3J0LmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1zdHJpbmcuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RyeS10by1zdHJpbmcuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3VpZC5qcyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdXNlLXN5bWJvbC1hcy11aWQuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3Y4LXByb3RvdHlwZS1kZWZpbmUtYnVnLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy93ZWFrLW1hcC1iYXNpYy1kZXRlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuYXJyYXkucmVkdWNlLmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuanNvbi5zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5zeW1ib2wuZGVzY3JpcHRpb24uanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy50eXBlZC1hcnJheS5zZXQuanMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy50eXBlZC1hcnJheS5zb3J0LmpzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9ub2RlX21vZHVsZXMvcGMtbW9iaWxpdHktY2xvdWQvY2xpZW50L3RzL3Nlc3Npb24udHMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vbm9kZV9tb2R1bGVzL3BjLW1vYmlsaXR5LWNsb3VkL2NsaWVudC90cy9pbmRleC50cyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9zcmMvc2NyaXB0cy9nbG9iYWxzLnRzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL3NyYy9zY3JpcHRzL3RpbWUvZm9ybWF0LnRzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL3NyYy9zY3JpcHRzL2xvZy9sb2cudHMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vc3JjL3NjcmlwdHMvbG9nL2luZGV4LnRzIiwid2VicGFjazovL3BhcGVyY3V0LW1vYmlsaXR5LWNocm9tZS8uL3NyYy9zY3JpcHRzL3BlZXIvYmxvYi50cyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9zcmMvc2NyaXB0cy9wZWVyL21lc3NhZ2UudHMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vc3JjL3NjcmlwdHMvcGVlci9kYXRhY2hhbm5lbC50cyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9zcmMvc2NyaXB0cy9wZWVyL3NpZ25hbC50cyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9zcmMvc2NyaXB0cy9wZWVyL3BlZXIudHMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vc3JjL3NjcmlwdHMvcGVlci9pbmRleC50cyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9zcmMvc2NyaXB0cy9jbG91ZHByaW50L2NsaWVudC50cyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9zcmMvc2NyaXB0cy9jbG91ZHByaW50L2NsaWVudGJ1aWxkZXIudHMiLCJ3ZWJwYWNrOi8vcGFwZXJjdXQtbW9iaWxpdHktY2hyb21lLy4vc3JjL3NjcmlwdHMvY2xvdWRwcmludC9pbmRleC50cyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9zcmMvc2NyaXB0cy9wcmludGVyL2NhcGFiaWxpdGllcy50cyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9zcmMvc2NyaXB0cy9vZmZuZXR3b3JrL29mZm5ldHdvcmtjYWNoZS50cyIsIndlYnBhY2s6Ly9wYXBlcmN1dC1tb2JpbGl0eS1jaHJvbWUvLi9zcmMvc2NyaXB0cy9vZmZuZXR3b3JrL29mZnNjcmVlbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIHRyeVRvU3RyaW5nID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RyeS10by1zdHJpbmcnKTtcblxudmFyICRUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG5cbi8vIGBBc3NlcnQ6IElzQ2FsbGFibGUoYXJndW1lbnQpIGlzIHRydWVgXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICBpZiAoaXNDYWxsYWJsZShhcmd1bWVudCkpIHJldHVybiBhcmd1bWVudDtcbiAgdGhyb3cgbmV3ICRUeXBlRXJyb3IodHJ5VG9TdHJpbmcoYXJndW1lbnQpICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBpc1Bvc3NpYmxlUHJvdG90eXBlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXBvc3NpYmxlLXByb3RvdHlwZScpO1xuXG52YXIgJFN0cmluZyA9IFN0cmluZztcbnZhciAkVHlwZUVycm9yID0gVHlwZUVycm9yO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICBpZiAoaXNQb3NzaWJsZVByb3RvdHlwZShhcmd1bWVudCkpIHJldHVybiBhcmd1bWVudDtcbiAgdGhyb3cgbmV3ICRUeXBlRXJyb3IoXCJDYW4ndCBzZXQgXCIgKyAkU3RyaW5nKGFyZ3VtZW50KSArICcgYXMgYSBwcm90b3R5cGUnKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbnZhciAkU3RyaW5nID0gU3RyaW5nO1xudmFyICRUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG5cbi8vIGBBc3NlcnQ6IFR5cGUoYXJndW1lbnQpIGlzIE9iamVjdGBcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIGlmIChpc09iamVjdChhcmd1bWVudCkpIHJldHVybiBhcmd1bWVudDtcbiAgdGhyb3cgbmV3ICRUeXBlRXJyb3IoJFN0cmluZyhhcmd1bWVudCkgKyAnIGlzIG5vdCBhbiBvYmplY3QnKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tdHlwZWQtYXJyYXlzIC0tIHNhZmVcbm1vZHVsZS5leHBvcnRzID0gdHlwZW9mIEFycmF5QnVmZmVyICE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiBEYXRhVmlldyAhPSAndW5kZWZpbmVkJztcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBOQVRJVkVfQVJSQVlfQlVGRkVSID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWJ1ZmZlci1iYXNpYy1kZXRlY3Rpb24nKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG52YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YnKTtcbnZhciB0cnlUb1N0cmluZyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90cnktdG8tc3RyaW5nJyk7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xudmFyIGRlZmluZUJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVmaW5lLWJ1aWx0LWluJyk7XG52YXIgZGVmaW5lQnVpbHRJbkFjY2Vzc29yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RlZmluZS1idWlsdC1pbi1hY2Nlc3NvcicpO1xudmFyIGlzUHJvdG90eXBlT2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWlzLXByb3RvdHlwZS1vZicpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtcHJvdG90eXBlLW9mJyk7XG52YXIgc2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LXNldC1wcm90b3R5cGUtb2YnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdWlkJyk7XG52YXIgSW50ZXJuYWxTdGF0ZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnRlcm5hbC1zdGF0ZScpO1xuXG52YXIgZW5mb3JjZUludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLmVuZm9yY2U7XG52YXIgZ2V0SW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuZ2V0O1xudmFyIEludDhBcnJheSA9IGdsb2JhbC5JbnQ4QXJyYXk7XG52YXIgSW50OEFycmF5UHJvdG90eXBlID0gSW50OEFycmF5ICYmIEludDhBcnJheS5wcm90b3R5cGU7XG52YXIgVWludDhDbGFtcGVkQXJyYXkgPSBnbG9iYWwuVWludDhDbGFtcGVkQXJyYXk7XG52YXIgVWludDhDbGFtcGVkQXJyYXlQcm90b3R5cGUgPSBVaW50OENsYW1wZWRBcnJheSAmJiBVaW50OENsYW1wZWRBcnJheS5wcm90b3R5cGU7XG52YXIgVHlwZWRBcnJheSA9IEludDhBcnJheSAmJiBnZXRQcm90b3R5cGVPZihJbnQ4QXJyYXkpO1xudmFyIFR5cGVkQXJyYXlQcm90b3R5cGUgPSBJbnQ4QXJyYXlQcm90b3R5cGUgJiYgZ2V0UHJvdG90eXBlT2YoSW50OEFycmF5UHJvdG90eXBlKTtcbnZhciBPYmplY3RQcm90b3R5cGUgPSBPYmplY3QucHJvdG90eXBlO1xudmFyIFR5cGVFcnJvciA9IGdsb2JhbC5UeXBlRXJyb3I7XG5cbnZhciBUT19TVFJJTkdfVEFHID0gd2VsbEtub3duU3ltYm9sKCd0b1N0cmluZ1RhZycpO1xudmFyIFRZUEVEX0FSUkFZX1RBRyA9IHVpZCgnVFlQRURfQVJSQVlfVEFHJyk7XG52YXIgVFlQRURfQVJSQVlfQ09OU1RSVUNUT1IgPSAnVHlwZWRBcnJheUNvbnN0cnVjdG9yJztcbi8vIEZpeGluZyBuYXRpdmUgdHlwZWQgYXJyYXlzIGluIE9wZXJhIFByZXN0byBjcmFzaGVzIHRoZSBicm93c2VyLCBzZWUgIzU5NVxudmFyIE5BVElWRV9BUlJBWV9CVUZGRVJfVklFV1MgPSBOQVRJVkVfQVJSQVlfQlVGRkVSICYmICEhc2V0UHJvdG90eXBlT2YgJiYgY2xhc3NvZihnbG9iYWwub3BlcmEpICE9PSAnT3BlcmEnO1xudmFyIFRZUEVEX0FSUkFZX1RBR19SRVFVSVJFRCA9IGZhbHNlO1xudmFyIE5BTUUsIENvbnN0cnVjdG9yLCBQcm90b3R5cGU7XG5cbnZhciBUeXBlZEFycmF5Q29uc3RydWN0b3JzTGlzdCA9IHtcbiAgSW50OEFycmF5OiAxLFxuICBVaW50OEFycmF5OiAxLFxuICBVaW50OENsYW1wZWRBcnJheTogMSxcbiAgSW50MTZBcnJheTogMixcbiAgVWludDE2QXJyYXk6IDIsXG4gIEludDMyQXJyYXk6IDQsXG4gIFVpbnQzMkFycmF5OiA0LFxuICBGbG9hdDMyQXJyYXk6IDQsXG4gIEZsb2F0NjRBcnJheTogOFxufTtcblxudmFyIEJpZ0ludEFycmF5Q29uc3RydWN0b3JzTGlzdCA9IHtcbiAgQmlnSW50NjRBcnJheTogOCxcbiAgQmlnVWludDY0QXJyYXk6IDhcbn07XG5cbnZhciBpc1ZpZXcgPSBmdW5jdGlvbiBpc1ZpZXcoaXQpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiBmYWxzZTtcbiAgdmFyIGtsYXNzID0gY2xhc3NvZihpdCk7XG4gIHJldHVybiBrbGFzcyA9PT0gJ0RhdGFWaWV3J1xuICAgIHx8IGhhc093bihUeXBlZEFycmF5Q29uc3RydWN0b3JzTGlzdCwga2xhc3MpXG4gICAgfHwgaGFzT3duKEJpZ0ludEFycmF5Q29uc3RydWN0b3JzTGlzdCwga2xhc3MpO1xufTtcblxudmFyIGdldFR5cGVkQXJyYXlDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgcHJvdG8gPSBnZXRQcm90b3R5cGVPZihpdCk7XG4gIGlmICghaXNPYmplY3QocHJvdG8pKSByZXR1cm47XG4gIHZhciBzdGF0ZSA9IGdldEludGVybmFsU3RhdGUocHJvdG8pO1xuICByZXR1cm4gKHN0YXRlICYmIGhhc093bihzdGF0ZSwgVFlQRURfQVJSQVlfQ09OU1RSVUNUT1IpKSA/IHN0YXRlW1RZUEVEX0FSUkFZX0NPTlNUUlVDVE9SXSA6IGdldFR5cGVkQXJyYXlDb25zdHJ1Y3Rvcihwcm90byk7XG59O1xuXG52YXIgaXNUeXBlZEFycmF5ID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gZmFsc2U7XG4gIHZhciBrbGFzcyA9IGNsYXNzb2YoaXQpO1xuICByZXR1cm4gaGFzT3duKFR5cGVkQXJyYXlDb25zdHJ1Y3RvcnNMaXN0LCBrbGFzcylcbiAgICB8fCBoYXNPd24oQmlnSW50QXJyYXlDb25zdHJ1Y3RvcnNMaXN0LCBrbGFzcyk7XG59O1xuXG52YXIgYVR5cGVkQXJyYXkgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGlzVHlwZWRBcnJheShpdCkpIHJldHVybiBpdDtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGFyZ2V0IGlzIG5vdCBhIHR5cGVkIGFycmF5Jyk7XG59O1xuXG52YXIgYVR5cGVkQXJyYXlDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uIChDKSB7XG4gIGlmIChpc0NhbGxhYmxlKEMpICYmICghc2V0UHJvdG90eXBlT2YgfHwgaXNQcm90b3R5cGVPZihUeXBlZEFycmF5LCBDKSkpIHJldHVybiBDO1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKHRyeVRvU3RyaW5nKEMpICsgJyBpcyBub3QgYSB0eXBlZCBhcnJheSBjb25zdHJ1Y3RvcicpO1xufTtcblxudmFyIGV4cG9ydFR5cGVkQXJyYXlNZXRob2QgPSBmdW5jdGlvbiAoS0VZLCBwcm9wZXJ0eSwgZm9yY2VkLCBvcHRpb25zKSB7XG4gIGlmICghREVTQ1JJUFRPUlMpIHJldHVybjtcbiAgaWYgKGZvcmNlZCkgZm9yICh2YXIgQVJSQVkgaW4gVHlwZWRBcnJheUNvbnN0cnVjdG9yc0xpc3QpIHtcbiAgICB2YXIgVHlwZWRBcnJheUNvbnN0cnVjdG9yID0gZ2xvYmFsW0FSUkFZXTtcbiAgICBpZiAoVHlwZWRBcnJheUNvbnN0cnVjdG9yICYmIGhhc093bihUeXBlZEFycmF5Q29uc3RydWN0b3IucHJvdG90eXBlLCBLRVkpKSB0cnkge1xuICAgICAgZGVsZXRlIFR5cGVkQXJyYXlDb25zdHJ1Y3Rvci5wcm90b3R5cGVbS0VZXTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gb2xkIFdlYktpdCBidWcgLSBzb21lIG1ldGhvZHMgYXJlIG5vbi1jb25maWd1cmFibGVcbiAgICAgIHRyeSB7XG4gICAgICAgIFR5cGVkQXJyYXlDb25zdHJ1Y3Rvci5wcm90b3R5cGVbS0VZXSA9IHByb3BlcnR5O1xuICAgICAgfSBjYXRjaCAoZXJyb3IyKSB7IC8qIGVtcHR5ICovIH1cbiAgICB9XG4gIH1cbiAgaWYgKCFUeXBlZEFycmF5UHJvdG90eXBlW0tFWV0gfHwgZm9yY2VkKSB7XG4gICAgZGVmaW5lQnVpbHRJbihUeXBlZEFycmF5UHJvdG90eXBlLCBLRVksIGZvcmNlZCA/IHByb3BlcnR5XG4gICAgICA6IE5BVElWRV9BUlJBWV9CVUZGRVJfVklFV1MgJiYgSW50OEFycmF5UHJvdG90eXBlW0tFWV0gfHwgcHJvcGVydHksIG9wdGlvbnMpO1xuICB9XG59O1xuXG52YXIgZXhwb3J0VHlwZWRBcnJheVN0YXRpY01ldGhvZCA9IGZ1bmN0aW9uIChLRVksIHByb3BlcnR5LCBmb3JjZWQpIHtcbiAgdmFyIEFSUkFZLCBUeXBlZEFycmF5Q29uc3RydWN0b3I7XG4gIGlmICghREVTQ1JJUFRPUlMpIHJldHVybjtcbiAgaWYgKHNldFByb3RvdHlwZU9mKSB7XG4gICAgaWYgKGZvcmNlZCkgZm9yIChBUlJBWSBpbiBUeXBlZEFycmF5Q29uc3RydWN0b3JzTGlzdCkge1xuICAgICAgVHlwZWRBcnJheUNvbnN0cnVjdG9yID0gZ2xvYmFsW0FSUkFZXTtcbiAgICAgIGlmIChUeXBlZEFycmF5Q29uc3RydWN0b3IgJiYgaGFzT3duKFR5cGVkQXJyYXlDb25zdHJ1Y3RvciwgS0VZKSkgdHJ5IHtcbiAgICAgICAgZGVsZXRlIFR5cGVkQXJyYXlDb25zdHJ1Y3RvcltLRVldO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxuICAgIH1cbiAgICBpZiAoIVR5cGVkQXJyYXlbS0VZXSB8fCBmb3JjZWQpIHtcbiAgICAgIC8vIFY4IH4gQ2hyb21lIDQ5LTUwIGAlVHlwZWRBcnJheSVgIG1ldGhvZHMgYXJlIG5vbi13cml0YWJsZSBub24tY29uZmlndXJhYmxlXG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gZGVmaW5lQnVpbHRJbihUeXBlZEFycmF5LCBLRVksIGZvcmNlZCA/IHByb3BlcnR5IDogTkFUSVZFX0FSUkFZX0JVRkZFUl9WSUVXUyAmJiBUeXBlZEFycmF5W0tFWV0gfHwgcHJvcGVydHkpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxuICAgIH0gZWxzZSByZXR1cm47XG4gIH1cbiAgZm9yIChBUlJBWSBpbiBUeXBlZEFycmF5Q29uc3RydWN0b3JzTGlzdCkge1xuICAgIFR5cGVkQXJyYXlDb25zdHJ1Y3RvciA9IGdsb2JhbFtBUlJBWV07XG4gICAgaWYgKFR5cGVkQXJyYXlDb25zdHJ1Y3RvciAmJiAoIVR5cGVkQXJyYXlDb25zdHJ1Y3RvcltLRVldIHx8IGZvcmNlZCkpIHtcbiAgICAgIGRlZmluZUJ1aWx0SW4oVHlwZWRBcnJheUNvbnN0cnVjdG9yLCBLRVksIHByb3BlcnR5KTtcbiAgICB9XG4gIH1cbn07XG5cbmZvciAoTkFNRSBpbiBUeXBlZEFycmF5Q29uc3RydWN0b3JzTGlzdCkge1xuICBDb25zdHJ1Y3RvciA9IGdsb2JhbFtOQU1FXTtcbiAgUHJvdG90eXBlID0gQ29uc3RydWN0b3IgJiYgQ29uc3RydWN0b3IucHJvdG90eXBlO1xuICBpZiAoUHJvdG90eXBlKSBlbmZvcmNlSW50ZXJuYWxTdGF0ZShQcm90b3R5cGUpW1RZUEVEX0FSUkFZX0NPTlNUUlVDVE9SXSA9IENvbnN0cnVjdG9yO1xuICBlbHNlIE5BVElWRV9BUlJBWV9CVUZGRVJfVklFV1MgPSBmYWxzZTtcbn1cblxuZm9yIChOQU1FIGluIEJpZ0ludEFycmF5Q29uc3RydWN0b3JzTGlzdCkge1xuICBDb25zdHJ1Y3RvciA9IGdsb2JhbFtOQU1FXTtcbiAgUHJvdG90eXBlID0gQ29uc3RydWN0b3IgJiYgQ29uc3RydWN0b3IucHJvdG90eXBlO1xuICBpZiAoUHJvdG90eXBlKSBlbmZvcmNlSW50ZXJuYWxTdGF0ZShQcm90b3R5cGUpW1RZUEVEX0FSUkFZX0NPTlNUUlVDVE9SXSA9IENvbnN0cnVjdG9yO1xufVxuXG4vLyBXZWJLaXQgYnVnIC0gdHlwZWQgYXJyYXlzIGNvbnN0cnVjdG9ycyBwcm90b3R5cGUgaXMgT2JqZWN0LnByb3RvdHlwZVxuaWYgKCFOQVRJVkVfQVJSQVlfQlVGRkVSX1ZJRVdTIHx8ICFpc0NhbGxhYmxlKFR5cGVkQXJyYXkpIHx8IFR5cGVkQXJyYXkgPT09IEZ1bmN0aW9uLnByb3RvdHlwZSkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93IC0tIHNhZmVcbiAgVHlwZWRBcnJheSA9IGZ1bmN0aW9uIFR5cGVkQXJyYXkoKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW5jb3JyZWN0IGludm9jYXRpb24nKTtcbiAgfTtcbiAgaWYgKE5BVElWRV9BUlJBWV9CVUZGRVJfVklFV1MpIGZvciAoTkFNRSBpbiBUeXBlZEFycmF5Q29uc3RydWN0b3JzTGlzdCkge1xuICAgIGlmIChnbG9iYWxbTkFNRV0pIHNldFByb3RvdHlwZU9mKGdsb2JhbFtOQU1FXSwgVHlwZWRBcnJheSk7XG4gIH1cbn1cblxuaWYgKCFOQVRJVkVfQVJSQVlfQlVGRkVSX1ZJRVdTIHx8ICFUeXBlZEFycmF5UHJvdG90eXBlIHx8IFR5cGVkQXJyYXlQcm90b3R5cGUgPT09IE9iamVjdFByb3RvdHlwZSkge1xuICBUeXBlZEFycmF5UHJvdG90eXBlID0gVHlwZWRBcnJheS5wcm90b3R5cGU7XG4gIGlmIChOQVRJVkVfQVJSQVlfQlVGRkVSX1ZJRVdTKSBmb3IgKE5BTUUgaW4gVHlwZWRBcnJheUNvbnN0cnVjdG9yc0xpc3QpIHtcbiAgICBpZiAoZ2xvYmFsW05BTUVdKSBzZXRQcm90b3R5cGVPZihnbG9iYWxbTkFNRV0ucHJvdG90eXBlLCBUeXBlZEFycmF5UHJvdG90eXBlKTtcbiAgfVxufVxuXG4vLyBXZWJLaXQgYnVnIC0gb25lIG1vcmUgb2JqZWN0IGluIFVpbnQ4Q2xhbXBlZEFycmF5IHByb3RvdHlwZSBjaGFpblxuaWYgKE5BVElWRV9BUlJBWV9CVUZGRVJfVklFV1MgJiYgZ2V0UHJvdG90eXBlT2YoVWludDhDbGFtcGVkQXJyYXlQcm90b3R5cGUpICE9PSBUeXBlZEFycmF5UHJvdG90eXBlKSB7XG4gIHNldFByb3RvdHlwZU9mKFVpbnQ4Q2xhbXBlZEFycmF5UHJvdG90eXBlLCBUeXBlZEFycmF5UHJvdG90eXBlKTtcbn1cblxuaWYgKERFU0NSSVBUT1JTICYmICFoYXNPd24oVHlwZWRBcnJheVByb3RvdHlwZSwgVE9fU1RSSU5HX1RBRykpIHtcbiAgVFlQRURfQVJSQVlfVEFHX1JFUVVJUkVEID0gdHJ1ZTtcbiAgZGVmaW5lQnVpbHRJbkFjY2Vzc29yKFR5cGVkQXJyYXlQcm90b3R5cGUsIFRPX1NUUklOR19UQUcsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaXNPYmplY3QodGhpcykgPyB0aGlzW1RZUEVEX0FSUkFZX1RBR10gOiB1bmRlZmluZWQ7XG4gICAgfVxuICB9KTtcbiAgZm9yIChOQU1FIGluIFR5cGVkQXJyYXlDb25zdHJ1Y3RvcnNMaXN0KSBpZiAoZ2xvYmFsW05BTUVdKSB7XG4gICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KGdsb2JhbFtOQU1FXSwgVFlQRURfQVJSQVlfVEFHLCBOQU1FKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTkFUSVZFX0FSUkFZX0JVRkZFUl9WSUVXUzogTkFUSVZFX0FSUkFZX0JVRkZFUl9WSUVXUyxcbiAgVFlQRURfQVJSQVlfVEFHOiBUWVBFRF9BUlJBWV9UQUdfUkVRVUlSRUQgJiYgVFlQRURfQVJSQVlfVEFHLFxuICBhVHlwZWRBcnJheTogYVR5cGVkQXJyYXksXG4gIGFUeXBlZEFycmF5Q29uc3RydWN0b3I6IGFUeXBlZEFycmF5Q29uc3RydWN0b3IsXG4gIGV4cG9ydFR5cGVkQXJyYXlNZXRob2Q6IGV4cG9ydFR5cGVkQXJyYXlNZXRob2QsXG4gIGV4cG9ydFR5cGVkQXJyYXlTdGF0aWNNZXRob2Q6IGV4cG9ydFR5cGVkQXJyYXlTdGF0aWNNZXRob2QsXG4gIGdldFR5cGVkQXJyYXlDb25zdHJ1Y3RvcjogZ2V0VHlwZWRBcnJheUNvbnN0cnVjdG9yLFxuICBpc1ZpZXc6IGlzVmlldyxcbiAgaXNUeXBlZEFycmF5OiBpc1R5cGVkQXJyYXksXG4gIFR5cGVkQXJyYXk6IFR5cGVkQXJyYXksXG4gIFR5cGVkQXJyYXlQcm90b3R5cGU6IFR5cGVkQXJyYXlQcm90b3R5cGVcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWFic29sdXRlLWluZGV4Jyk7XG52YXIgbGVuZ3RoT2ZBcnJheUxpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbGVuZ3RoLW9mLWFycmF5LWxpa2UnKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS57IGluZGV4T2YsIGluY2x1ZGVzIH1gIG1ldGhvZHMgaW1wbGVtZW50YXRpb25cbnZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JbmRleGVkT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gbGVuZ3RoT2ZBcnJheUxpa2UoTyk7XG4gICAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGZyb21JbmRleCwgbGVuZ3RoKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmUgLS0gTmFOIGNoZWNrXG4gICAgaWYgKElTX0lOQ0xVREVTICYmIGVsICE9PSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlIC0tIE5hTiBjaGVja1xuICAgICAgaWYgKHZhbHVlICE9PSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgICAgaWYgKChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSAmJiBPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBgQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuaW5jbHVkZXNcbiAgaW5jbHVkZXM6IGNyZWF0ZU1ldGhvZCh0cnVlKSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5pbmRleE9mYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuaW5kZXhvZlxuICBpbmRleE9mOiBjcmVhdGVNZXRob2QoZmFsc2UpXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE1FVEhPRF9OQU1FLCBhcmd1bWVudCkge1xuICB2YXIgbWV0aG9kID0gW11bTUVUSE9EX05BTUVdO1xuICByZXR1cm4gISFtZXRob2QgJiYgZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2VsZXNzLWNhbGwgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbiAgICBtZXRob2QuY2FsbChudWxsLCBhcmd1bWVudCB8fCBmdW5jdGlvbiAoKSB7IHJldHVybiAxOyB9LCAxKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWNhbGxhYmxlJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tb2JqZWN0Jyk7XG52YXIgSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbmRleGVkLW9iamVjdCcpO1xudmFyIGxlbmd0aE9mQXJyYXlMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2xlbmd0aC1vZi1hcnJheS1saWtlJyk7XG5cbnZhciAkVHlwZUVycm9yID0gVHlwZUVycm9yO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLnsgcmVkdWNlLCByZWR1Y2VSaWdodCB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKElTX1JJR0hUKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhhdCwgY2FsbGJhY2tmbiwgYXJndW1lbnRzTGVuZ3RoLCBtZW1vKSB7XG4gICAgdmFyIE8gPSB0b09iamVjdCh0aGF0KTtcbiAgICB2YXIgc2VsZiA9IEluZGV4ZWRPYmplY3QoTyk7XG4gICAgdmFyIGxlbmd0aCA9IGxlbmd0aE9mQXJyYXlMaWtlKE8pO1xuICAgIGFDYWxsYWJsZShjYWxsYmFja2ZuKTtcbiAgICB2YXIgaW5kZXggPSBJU19SSUdIVCA/IGxlbmd0aCAtIDEgOiAwO1xuICAgIHZhciBpID0gSVNfUklHSFQgPyAtMSA6IDE7XG4gICAgaWYgKGFyZ3VtZW50c0xlbmd0aCA8IDIpIHdoaWxlICh0cnVlKSB7XG4gICAgICBpZiAoaW5kZXggaW4gc2VsZikge1xuICAgICAgICBtZW1vID0gc2VsZltpbmRleF07XG4gICAgICAgIGluZGV4ICs9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaW5kZXggKz0gaTtcbiAgICAgIGlmIChJU19SSUdIVCA/IGluZGV4IDwgMCA6IGxlbmd0aCA8PSBpbmRleCkge1xuICAgICAgICB0aHJvdyBuZXcgJFR5cGVFcnJvcignUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKDtJU19SSUdIVCA/IGluZGV4ID49IDAgOiBsZW5ndGggPiBpbmRleDsgaW5kZXggKz0gaSkgaWYgKGluZGV4IGluIHNlbGYpIHtcbiAgICAgIG1lbW8gPSBjYWxsYmFja2ZuKG1lbW8sIHNlbGZbaW5kZXhdLCBpbmRleCwgTyk7XG4gICAgfVxuICAgIHJldHVybiBtZW1vO1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIGBBcnJheS5wcm90b3R5cGUucmVkdWNlYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUucmVkdWNlXG4gIGxlZnQ6IGNyZWF0ZU1ldGhvZChmYWxzZSksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUucmVkdWNlUmlnaHRgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5yZWR1Y2VyaWdodFxuICByaWdodDogY3JlYXRlTWV0aG9kKHRydWUpXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVuY3VycnlUaGlzKFtdLnNsaWNlKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhcnJheVNsaWNlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LXNsaWNlJyk7XG5cbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5cbnZhciBzb3J0ID0gZnVuY3Rpb24gKGFycmF5LCBjb21wYXJlZm4pIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICBpZiAobGVuZ3RoIDwgOCkge1xuICAgIC8vIGluc2VydGlvbiBzb3J0XG4gICAgdmFyIGkgPSAxO1xuICAgIHZhciBlbGVtZW50LCBqO1xuXG4gICAgd2hpbGUgKGkgPCBsZW5ndGgpIHtcbiAgICAgIGogPSBpO1xuICAgICAgZWxlbWVudCA9IGFycmF5W2ldO1xuICAgICAgd2hpbGUgKGogJiYgY29tcGFyZWZuKGFycmF5W2ogLSAxXSwgZWxlbWVudCkgPiAwKSB7XG4gICAgICAgIGFycmF5W2pdID0gYXJyYXlbLS1qXTtcbiAgICAgIH1cbiAgICAgIGlmIChqICE9PSBpKyspIGFycmF5W2pdID0gZWxlbWVudDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gbWVyZ2Ugc29ydFxuICAgIHZhciBtaWRkbGUgPSBmbG9vcihsZW5ndGggLyAyKTtcbiAgICB2YXIgbGVmdCA9IHNvcnQoYXJyYXlTbGljZShhcnJheSwgMCwgbWlkZGxlKSwgY29tcGFyZWZuKTtcbiAgICB2YXIgcmlnaHQgPSBzb3J0KGFycmF5U2xpY2UoYXJyYXksIG1pZGRsZSksIGNvbXBhcmVmbik7XG4gICAgdmFyIGxsZW5ndGggPSBsZWZ0Lmxlbmd0aDtcbiAgICB2YXIgcmxlbmd0aCA9IHJpZ2h0Lmxlbmd0aDtcbiAgICB2YXIgbGluZGV4ID0gMDtcbiAgICB2YXIgcmluZGV4ID0gMDtcblxuICAgIHdoaWxlIChsaW5kZXggPCBsbGVuZ3RoIHx8IHJpbmRleCA8IHJsZW5ndGgpIHtcbiAgICAgIGFycmF5W2xpbmRleCArIHJpbmRleF0gPSAobGluZGV4IDwgbGxlbmd0aCAmJiByaW5kZXggPCBybGVuZ3RoKVxuICAgICAgICA/IGNvbXBhcmVmbihsZWZ0W2xpbmRleF0sIHJpZ2h0W3JpbmRleF0pIDw9IDAgPyBsZWZ0W2xpbmRleCsrXSA6IHJpZ2h0W3JpbmRleCsrXVxuICAgICAgICA6IGxpbmRleCA8IGxsZW5ndGggPyBsZWZ0W2xpbmRleCsrXSA6IHJpZ2h0W3JpbmRleCsrXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXJyYXk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNvcnQ7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG5cbnZhciB0b1N0cmluZyA9IHVuY3VycnlUaGlzKHt9LnRvU3RyaW5nKTtcbnZhciBzdHJpbmdTbGljZSA9IHVuY3VycnlUaGlzKCcnLnNsaWNlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHN0cmluZ1NsaWNlKHRvU3RyaW5nKGl0KSwgOCwgLTEpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBUT19TVFJJTkdfVEFHX1NVUFBPUlQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tc3RyaW5nLXRhZy1zdXBwb3J0Jyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIGNsYXNzb2ZSYXcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY2xhc3NvZi1yYXcnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcblxudmFyIFRPX1NUUklOR19UQUcgPSB3ZWxsS25vd25TeW1ib2woJ3RvU3RyaW5nVGFnJyk7XG52YXIgJE9iamVjdCA9IE9iamVjdDtcblxuLy8gRVMzIHdyb25nIGhlcmVcbnZhciBDT1JSRUNUX0FSR1VNRU5UUyA9IGNsYXNzb2ZSYXcoZnVuY3Rpb24gKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG4vLyBnZXR0aW5nIHRhZyBmcm9tIEVTNisgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgXG5tb2R1bGUuZXhwb3J0cyA9IFRPX1NUUklOR19UQUdfU1VQUE9SVCA/IGNsYXNzb2ZSYXcgOiBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8sIHRhZywgcmVzdWx0O1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAodGFnID0gdHJ5R2V0KE8gPSAkT2JqZWN0KGl0KSwgVE9fU1RSSU5HX1RBRykpID09ICdzdHJpbmcnID8gdGFnXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBDT1JSRUNUX0FSR1VNRU5UUyA/IGNsYXNzb2ZSYXcoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAocmVzdWx0ID0gY2xhc3NvZlJhdyhPKSkgPT09ICdPYmplY3QnICYmIGlzQ2FsbGFibGUoTy5jYWxsZWUpID8gJ0FyZ3VtZW50cycgOiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgb3duS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vd24ta2V5cycpO1xudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvck1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yJyk7XG52YXIgZGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSwgZXhjZXB0aW9ucykge1xuICB2YXIga2V5cyA9IG93bktleXMoc291cmNlKTtcbiAgdmFyIGRlZmluZVByb3BlcnR5ID0gZGVmaW5lUHJvcGVydHlNb2R1bGUuZjtcbiAgdmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvck1vZHVsZS5mO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICBpZiAoIWhhc093bih0YXJnZXQsIGtleSkgJiYgIShleGNlcHRpb25zICYmIGhhc093bihleGNlcHRpb25zLCBrZXkpKSkge1xuICAgICAgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICAgIH1cbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEYoKSB7IC8qIGVtcHR5ICovIH1cbiAgRi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBudWxsO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldHByb3RvdHlwZW9mIC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nXG4gIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YobmV3IEYoKSkgIT09IEYucHJvdG90eXBlO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBkZWZpbmVQcm9wZXJ0eU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5Jyk7XG52YXIgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1wcm9wZXJ0eS1kZXNjcmlwdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gREVTQ1JJUFRPUlMgPyBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHJldHVybiBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mKG9iamVjdCwga2V5LCBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYml0bWFwLCB2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGU6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBtYWtlQnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9tYWtlLWJ1aWx0LWluJyk7XG52YXIgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpIHtcbiAgaWYgKGRlc2NyaXB0b3IuZ2V0KSBtYWtlQnVpbHRJbihkZXNjcmlwdG9yLmdldCwgbmFtZSwgeyBnZXR0ZXI6IHRydWUgfSk7XG4gIGlmIChkZXNjcmlwdG9yLnNldCkgbWFrZUJ1aWx0SW4oZGVzY3JpcHRvci5zZXQsIG5hbWUsIHsgc2V0dGVyOiB0cnVlIH0pO1xuICByZXR1cm4gZGVmaW5lUHJvcGVydHkuZih0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgZGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xudmFyIG1ha2VCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL21ha2UtYnVpbHQtaW4nKTtcbnZhciBkZWZpbmVHbG9iYWxQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZWZpbmUtZ2xvYmFsLXByb3BlcnR5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG4gIHZhciBzaW1wbGUgPSBvcHRpb25zLmVudW1lcmFibGU7XG4gIHZhciBuYW1lID0gb3B0aW9ucy5uYW1lICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm5hbWUgOiBrZXk7XG4gIGlmIChpc0NhbGxhYmxlKHZhbHVlKSkgbWFrZUJ1aWx0SW4odmFsdWUsIG5hbWUsIG9wdGlvbnMpO1xuICBpZiAob3B0aW9ucy5nbG9iYWwpIHtcbiAgICBpZiAoc2ltcGxlKSBPW2tleV0gPSB2YWx1ZTtcbiAgICBlbHNlIGRlZmluZUdsb2JhbFByb3BlcnR5KGtleSwgdmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIW9wdGlvbnMudW5zYWZlKSBkZWxldGUgT1trZXldO1xuICAgICAgZWxzZSBpZiAoT1trZXldKSBzaW1wbGUgPSB0cnVlO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgICBpZiAoc2ltcGxlKSBPW2tleV0gPSB2YWx1ZTtcbiAgICBlbHNlIGRlZmluZVByb3BlcnR5TW9kdWxlLmYoTywga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogIW9wdGlvbnMubm9uQ29uZmlndXJhYmxlLFxuICAgICAgd3JpdGFibGU6ICFvcHRpb25zLm5vbldyaXRhYmxlXG4gICAgfSk7XG4gIH0gcmV0dXJuIE87XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1kZWZpbmVwcm9wZXJ0eSAtLSBzYWZlXG52YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgdHJ5IHtcbiAgICBkZWZpbmVQcm9wZXJ0eShnbG9iYWwsIGtleSwgeyB2YWx1ZTogdmFsdWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZ2xvYmFsW2tleV0gPSB2YWx1ZTtcbiAgfSByZXR1cm4gdmFsdWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbi8vIERldGVjdCBJRTgncyBpbmNvbXBsZXRlIGRlZmluZVByb3BlcnR5IGltcGxlbWVudGF0aW9uXG5tb2R1bGUuZXhwb3J0cyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydHkgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgMSwgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSlbMV0gIT09IDc7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbnZhciBkb2N1bWVudCA9IGdsb2JhbC5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIEVYSVNUUyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIEVYSVNUUyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHVzZXJBZ2VudCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbmdpbmUtdXNlci1hZ2VudCcpO1xuXG52YXIgZmlyZWZveCA9IHVzZXJBZ2VudC5tYXRjaCgvZmlyZWZveFxcLyhcXGQrKS9pKTtcblxubW9kdWxlLmV4cG9ydHMgPSAhIWZpcmVmb3ggJiYgK2ZpcmVmb3hbMV07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgVUEgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXVzZXItYWdlbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAvTVNJRXxUcmlkZW50Ly50ZXN0KFVBKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mLXJhdycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzb2YoZ2xvYmFsLnByb2Nlc3MpID09PSAncHJvY2Vzcyc7XG4iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiBuYXZpZ2F0b3IgIT0gJ3VuZGVmaW5lZCcgJiYgU3RyaW5nKG5hdmlnYXRvci51c2VyQWdlbnQpIHx8ICcnO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciB1c2VyQWdlbnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXVzZXItYWdlbnQnKTtcblxudmFyIHByb2Nlc3MgPSBnbG9iYWwucHJvY2VzcztcbnZhciBEZW5vID0gZ2xvYmFsLkRlbm87XG52YXIgdmVyc2lvbnMgPSBwcm9jZXNzICYmIHByb2Nlc3MudmVyc2lvbnMgfHwgRGVubyAmJiBEZW5vLnZlcnNpb247XG52YXIgdjggPSB2ZXJzaW9ucyAmJiB2ZXJzaW9ucy52ODtcbnZhciBtYXRjaCwgdmVyc2lvbjtcblxuaWYgKHY4KSB7XG4gIG1hdGNoID0gdjguc3BsaXQoJy4nKTtcbiAgLy8gaW4gb2xkIENocm9tZSwgdmVyc2lvbnMgb2YgVjggaXNuJ3QgVjggPSBDaHJvbWUgLyAxMFxuICAvLyBidXQgdGhlaXIgY29ycmVjdCB2ZXJzaW9ucyBhcmUgbm90IGludGVyZXN0aW5nIGZvciB1c1xuICB2ZXJzaW9uID0gbWF0Y2hbMF0gPiAwICYmIG1hdGNoWzBdIDwgNCA/IDEgOiArKG1hdGNoWzBdICsgbWF0Y2hbMV0pO1xufVxuXG4vLyBCcm93c2VyRlMgTm9kZUpTIGBwcm9jZXNzYCBwb2x5ZmlsbCBpbmNvcnJlY3RseSBzZXQgYC52OGAgdG8gYDAuMGBcbi8vIHNvIGNoZWNrIGB1c2VyQWdlbnRgIGV2ZW4gaWYgYC52OGAgZXhpc3RzLCBidXQgMFxuaWYgKCF2ZXJzaW9uICYmIHVzZXJBZ2VudCkge1xuICBtYXRjaCA9IHVzZXJBZ2VudC5tYXRjaCgvRWRnZVxcLyhcXGQrKS8pO1xuICBpZiAoIW1hdGNoIHx8IG1hdGNoWzFdID49IDc0KSB7XG4gICAgbWF0Y2ggPSB1c2VyQWdlbnQubWF0Y2goL0Nocm9tZVxcLyhcXGQrKS8pO1xuICAgIGlmIChtYXRjaCkgdmVyc2lvbiA9ICttYXRjaFsxXTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHZlcnNpb247XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdXNlckFnZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS11c2VyLWFnZW50Jyk7XG5cbnZhciB3ZWJraXQgPSB1c2VyQWdlbnQubWF0Y2goL0FwcGxlV2ViS2l0XFwvKFxcZCspXFwuLyk7XG5cbm1vZHVsZS5leHBvcnRzID0gISF3ZWJraXQgJiYgK3dlYmtpdFsxXTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIElFOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSBbXG4gICdjb25zdHJ1Y3RvcicsXG4gICdoYXNPd25Qcm9wZXJ0eScsXG4gICdpc1Byb3RvdHlwZU9mJyxcbiAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJyxcbiAgJ3RvTG9jYWxlU3RyaW5nJyxcbiAgJ3RvU3RyaW5nJyxcbiAgJ3ZhbHVlT2YnXG5dO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicpLmY7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xudmFyIGRlZmluZUJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVmaW5lLWJ1aWx0LWluJyk7XG52YXIgZGVmaW5lR2xvYmFsUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVmaW5lLWdsb2JhbC1wcm9wZXJ0eScpO1xudmFyIGNvcHlDb25zdHJ1Y3RvclByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY29weS1jb25zdHJ1Y3Rvci1wcm9wZXJ0aWVzJyk7XG52YXIgaXNGb3JjZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtZm9yY2VkJyk7XG5cbi8qXG4gIG9wdGlvbnMudGFyZ2V0ICAgICAgICAgLSBuYW1lIG9mIHRoZSB0YXJnZXQgb2JqZWN0XG4gIG9wdGlvbnMuZ2xvYmFsICAgICAgICAgLSB0YXJnZXQgaXMgdGhlIGdsb2JhbCBvYmplY3RcbiAgb3B0aW9ucy5zdGF0ICAgICAgICAgICAtIGV4cG9ydCBhcyBzdGF0aWMgbWV0aG9kcyBvZiB0YXJnZXRcbiAgb3B0aW9ucy5wcm90byAgICAgICAgICAtIGV4cG9ydCBhcyBwcm90b3R5cGUgbWV0aG9kcyBvZiB0YXJnZXRcbiAgb3B0aW9ucy5yZWFsICAgICAgICAgICAtIHJlYWwgcHJvdG90eXBlIG1ldGhvZCBmb3IgdGhlIGBwdXJlYCB2ZXJzaW9uXG4gIG9wdGlvbnMuZm9yY2VkICAgICAgICAgLSBleHBvcnQgZXZlbiBpZiB0aGUgbmF0aXZlIGZlYXR1cmUgaXMgYXZhaWxhYmxlXG4gIG9wdGlvbnMuYmluZCAgICAgICAgICAgLSBiaW5kIG1ldGhvZHMgdG8gdGhlIHRhcmdldCwgcmVxdWlyZWQgZm9yIHRoZSBgcHVyZWAgdmVyc2lvblxuICBvcHRpb25zLndyYXAgICAgICAgICAgIC0gd3JhcCBjb25zdHJ1Y3RvcnMgdG8gcHJldmVudGluZyBnbG9iYWwgcG9sbHV0aW9uLCByZXF1aXJlZCBmb3IgdGhlIGBwdXJlYCB2ZXJzaW9uXG4gIG9wdGlvbnMudW5zYWZlICAgICAgICAgLSB1c2UgdGhlIHNpbXBsZSBhc3NpZ25tZW50IG9mIHByb3BlcnR5IGluc3RlYWQgb2YgZGVsZXRlICsgZGVmaW5lUHJvcGVydHlcbiAgb3B0aW9ucy5zaGFtICAgICAgICAgICAtIGFkZCBhIGZsYWcgdG8gbm90IGNvbXBsZXRlbHkgZnVsbCBwb2x5ZmlsbHNcbiAgb3B0aW9ucy5lbnVtZXJhYmxlICAgICAtIGV4cG9ydCBhcyBlbnVtZXJhYmxlIHByb3BlcnR5XG4gIG9wdGlvbnMuZG9udENhbGxHZXRTZXQgLSBwcmV2ZW50IGNhbGxpbmcgYSBnZXR0ZXIgb24gdGFyZ2V0XG4gIG9wdGlvbnMubmFtZSAgICAgICAgICAgLSB0aGUgLm5hbWUgb2YgdGhlIGZ1bmN0aW9uIGlmIGl0IGRvZXMgbm90IG1hdGNoIHRoZSBrZXlcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRpb25zLCBzb3VyY2UpIHtcbiAgdmFyIFRBUkdFVCA9IG9wdGlvbnMudGFyZ2V0O1xuICB2YXIgR0xPQkFMID0gb3B0aW9ucy5nbG9iYWw7XG4gIHZhciBTVEFUSUMgPSBvcHRpb25zLnN0YXQ7XG4gIHZhciBGT1JDRUQsIHRhcmdldCwga2V5LCB0YXJnZXRQcm9wZXJ0eSwgc291cmNlUHJvcGVydHksIGRlc2NyaXB0b3I7XG4gIGlmIChHTE9CQUwpIHtcbiAgICB0YXJnZXQgPSBnbG9iYWw7XG4gIH0gZWxzZSBpZiAoU1RBVElDKSB7XG4gICAgdGFyZ2V0ID0gZ2xvYmFsW1RBUkdFVF0gfHwgZGVmaW5lR2xvYmFsUHJvcGVydHkoVEFSR0VULCB7fSk7XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0ID0gZ2xvYmFsW1RBUkdFVF0gJiYgZ2xvYmFsW1RBUkdFVF0ucHJvdG90eXBlO1xuICB9XG4gIGlmICh0YXJnZXQpIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgIHNvdXJjZVByb3BlcnR5ID0gc291cmNlW2tleV07XG4gICAgaWYgKG9wdGlvbnMuZG9udENhbGxHZXRTZXQpIHtcbiAgICAgIGRlc2NyaXB0b3IgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuICAgICAgdGFyZ2V0UHJvcGVydHkgPSBkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IudmFsdWU7XG4gICAgfSBlbHNlIHRhcmdldFByb3BlcnR5ID0gdGFyZ2V0W2tleV07XG4gICAgRk9SQ0VEID0gaXNGb3JjZWQoR0xPQkFMID8ga2V5IDogVEFSR0VUICsgKFNUQVRJQyA/ICcuJyA6ICcjJykgKyBrZXksIG9wdGlvbnMuZm9yY2VkKTtcbiAgICAvLyBjb250YWluZWQgaW4gdGFyZ2V0XG4gICAgaWYgKCFGT1JDRUQgJiYgdGFyZ2V0UHJvcGVydHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHR5cGVvZiBzb3VyY2VQcm9wZXJ0eSA9PSB0eXBlb2YgdGFyZ2V0UHJvcGVydHkpIGNvbnRpbnVlO1xuICAgICAgY29weUNvbnN0cnVjdG9yUHJvcGVydGllcyhzb3VyY2VQcm9wZXJ0eSwgdGFyZ2V0UHJvcGVydHkpO1xuICAgIH1cbiAgICAvLyBhZGQgYSBmbGFnIHRvIG5vdCBjb21wbGV0ZWx5IGZ1bGwgcG9seWZpbGxzXG4gICAgaWYgKG9wdGlvbnMuc2hhbSB8fCAodGFyZ2V0UHJvcGVydHkgJiYgdGFyZ2V0UHJvcGVydHkuc2hhbSkpIHtcbiAgICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShzb3VyY2VQcm9wZXJ0eSwgJ3NoYW0nLCB0cnVlKTtcbiAgICB9XG4gICAgZGVmaW5lQnVpbHRJbih0YXJnZXQsIGtleSwgc291cmNlUHJvcGVydHksIG9wdGlvbnMpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBOQVRJVkVfQklORCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1iaW5kLW5hdGl2ZScpO1xuXG52YXIgRnVuY3Rpb25Qcm90b3R5cGUgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG52YXIgYXBwbHkgPSBGdW5jdGlvblByb3RvdHlwZS5hcHBseTtcbnZhciBjYWxsID0gRnVuY3Rpb25Qcm90b3R5cGUuY2FsbDtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLXJlZmxlY3QgLS0gc2FmZVxubW9kdWxlLmV4cG9ydHMgPSB0eXBlb2YgUmVmbGVjdCA9PSAnb2JqZWN0JyAmJiBSZWZsZWN0LmFwcGx5IHx8IChOQVRJVkVfQklORCA/IGNhbGwuYmluZChhcHBseSkgOiBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBjYWxsLmFwcGx5KGFwcGx5LCBhcmd1bWVudHMpO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tZnVuY3Rpb24tcHJvdG90eXBlLWJpbmQgLS0gc2FmZVxuICB2YXIgdGVzdCA9IChmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH0pLmJpbmQoKTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGlucyAtLSBzYWZlXG4gIHJldHVybiB0eXBlb2YgdGVzdCAhPSAnZnVuY3Rpb24nIHx8IHRlc3QuaGFzT3duUHJvcGVydHkoJ3Byb3RvdHlwZScpO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTkFUSVZFX0JJTkQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tYmluZC1uYXRpdmUnKTtcblxudmFyIGNhbGwgPSBGdW5jdGlvbi5wcm90b3R5cGUuY2FsbDtcblxubW9kdWxlLmV4cG9ydHMgPSBOQVRJVkVfQklORCA/IGNhbGwuYmluZChjYWxsKSA6IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGNhbGwuYXBwbHkoY2FsbCwgYXJndW1lbnRzKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xuXG52YXIgRnVuY3Rpb25Qcm90b3R5cGUgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5ZGVzY3JpcHRvciAtLSBzYWZlXG52YXIgZ2V0RGVzY3JpcHRvciA9IERFU0NSSVBUT1JTICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbnZhciBFWElTVFMgPSBoYXNPd24oRnVuY3Rpb25Qcm90b3R5cGUsICduYW1lJyk7XG4vLyBhZGRpdGlvbmFsIHByb3RlY3Rpb24gZnJvbSBtaW5pZmllZCAvIG1hbmdsZWQgLyBkcm9wcGVkIGZ1bmN0aW9uIG5hbWVzXG52YXIgUFJPUEVSID0gRVhJU1RTICYmIChmdW5jdGlvbiBzb21ldGhpbmcoKSB7IC8qIGVtcHR5ICovIH0pLm5hbWUgPT09ICdzb21ldGhpbmcnO1xudmFyIENPTkZJR1VSQUJMRSA9IEVYSVNUUyAmJiAoIURFU0NSSVBUT1JTIHx8IChERVNDUklQVE9SUyAmJiBnZXREZXNjcmlwdG9yKEZ1bmN0aW9uUHJvdG90eXBlLCAnbmFtZScpLmNvbmZpZ3VyYWJsZSkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgRVhJU1RTOiBFWElTVFMsXG4gIFBST1BFUjogUFJPUEVSLFxuICBDT05GSUdVUkFCTEU6IENPTkZJR1VSQUJMRVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcbnZhciBhQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1jYWxsYWJsZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgbWV0aG9kKSB7XG4gIHRyeSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3IgLS0gc2FmZVxuICAgIHJldHVybiB1bmN1cnJ5VGhpcyhhQ2FsbGFibGUoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIGtleSlbbWV0aG9kXSkpO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNsYXNzb2ZSYXcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY2xhc3NvZi1yYXcnKTtcbnZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4pIHtcbiAgLy8gTmFzaG9ybiBidWc6XG4gIC8vICAgaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzExMjhcbiAgLy8gICBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMTEzMFxuICBpZiAoY2xhc3NvZlJhdyhmbikgPT09ICdGdW5jdGlvbicpIHJldHVybiB1bmN1cnJ5VGhpcyhmbik7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIE5BVElWRV9CSU5EID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQtbmF0aXZlJyk7XG5cbnZhciBGdW5jdGlvblByb3RvdHlwZSA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbnZhciBjYWxsID0gRnVuY3Rpb25Qcm90b3R5cGUuY2FsbDtcbnZhciB1bmN1cnJ5VGhpc1dpdGhCaW5kID0gTkFUSVZFX0JJTkQgJiYgRnVuY3Rpb25Qcm90b3R5cGUuYmluZC5iaW5kKGNhbGwsIGNhbGwpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5BVElWRV9CSU5EID8gdW5jdXJyeVRoaXNXaXRoQmluZCA6IGZ1bmN0aW9uIChmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjYWxsLmFwcGx5KGZuLCBhcmd1bWVudHMpO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xuXG52YXIgYUZ1bmN0aW9uID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHJldHVybiBpc0NhbGxhYmxlKGFyZ3VtZW50KSA/IGFyZ3VtZW50IDogdW5kZWZpbmVkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZXNwYWNlLCBtZXRob2QpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPCAyID8gYUZ1bmN0aW9uKGdsb2JhbFtuYW1lc3BhY2VdKSA6IGdsb2JhbFtuYW1lc3BhY2VdICYmIGdsb2JhbFtuYW1lc3BhY2VdW21ldGhvZF07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtYXJyYXknKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mLXJhdycpO1xudmFyIHRvU3RyaW5nID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXN0cmluZycpO1xuXG52YXIgcHVzaCA9IHVuY3VycnlUaGlzKFtdLnB1c2gpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZXBsYWNlcikge1xuICBpZiAoaXNDYWxsYWJsZShyZXBsYWNlcikpIHJldHVybiByZXBsYWNlcjtcbiAgaWYgKCFpc0FycmF5KHJlcGxhY2VyKSkgcmV0dXJuO1xuICB2YXIgcmF3TGVuZ3RoID0gcmVwbGFjZXIubGVuZ3RoO1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHJhd0xlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGVsZW1lbnQgPSByZXBsYWNlcltpXTtcbiAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT0gJ3N0cmluZycpIHB1c2goa2V5cywgZWxlbWVudCk7XG4gICAgZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQgPT0gJ251bWJlcicgfHwgY2xhc3NvZihlbGVtZW50KSA9PT0gJ051bWJlcicgfHwgY2xhc3NvZihlbGVtZW50KSA9PT0gJ1N0cmluZycpIHB1c2goa2V5cywgdG9TdHJpbmcoZWxlbWVudCkpO1xuICB9XG4gIHZhciBrZXlzTGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciByb290ID0gdHJ1ZTtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgaWYgKHJvb3QpIHtcbiAgICAgIHJvb3QgPSBmYWxzZTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKGlzQXJyYXkodGhpcykpIHJldHVybiB2YWx1ZTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGtleXNMZW5ndGg7IGorKykgaWYgKGtleXNbal0gPT09IGtleSkgcmV0dXJuIHZhbHVlO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1jYWxsYWJsZScpO1xudmFyIGlzTnVsbE9yVW5kZWZpbmVkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW51bGwtb3ItdW5kZWZpbmVkJyk7XG5cbi8vIGBHZXRNZXRob2RgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1nZXRtZXRob2Rcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFYsIFApIHtcbiAgdmFyIGZ1bmMgPSBWW1BdO1xuICByZXR1cm4gaXNOdWxsT3JVbmRlZmluZWQoZnVuYykgPyB1bmRlZmluZWQgOiBhQ2FsbGFibGUoZnVuYyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNoZWNrID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAmJiBpdC5NYXRoID09PSBNYXRoICYmIGl0O1xufTtcblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbm1vZHVsZS5leHBvcnRzID1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLWdsb2JhbC10aGlzIC0tIHNhZmVcbiAgY2hlY2sodHlwZW9mIGdsb2JhbFRoaXMgPT0gJ29iamVjdCcgJiYgZ2xvYmFsVGhpcykgfHxcbiAgY2hlY2sodHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiB3aW5kb3cpIHx8XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLWdsb2JhbHMgLS0gc2FmZVxuICBjaGVjayh0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmKSB8fFxuICBjaGVjayh0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCkgfHxcbiAgY2hlY2sodHlwZW9mIHRoaXMgPT0gJ29iamVjdCcgJiYgdGhpcykgfHxcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jIC0tIGZhbGxiYWNrXG4gIChmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KSgpIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tb2JqZWN0Jyk7XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IHVuY3VycnlUaGlzKHt9Lmhhc093blByb3BlcnR5KTtcblxuLy8gYEhhc093blByb3BlcnR5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtaGFzb3ducHJvcGVydHlcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtaGFzb3duIC0tIHNhZmVcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0Lmhhc093biB8fCBmdW5jdGlvbiBoYXNPd24oaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkodG9PYmplY3QoaXQpLCBrZXkpO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0ge307XG4iLCIndXNlIHN0cmljdCc7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGNyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZG9jdW1lbnQtY3JlYXRlLWVsZW1lbnQnKTtcblxuLy8gVGhhbmtzIHRvIElFOCBmb3IgaXRzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFERVNDUklQVE9SUyAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWRlZmluZXByb3BlcnR5IC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nXG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoY3JlYXRlRWxlbWVudCgnZGl2JyksICdhJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfVxuICB9KS5hICE9PSA3O1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YtcmF3Jyk7XG5cbnZhciAkT2JqZWN0ID0gT2JqZWN0O1xudmFyIHNwbGl0ID0gdW5jdXJyeVRoaXMoJycuc3BsaXQpO1xuXG4vLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xubW9kdWxlLmV4cG9ydHMgPSBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIHRocm93cyBhbiBlcnJvciBpbiByaGlubywgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3JoaW5vL2lzc3Vlcy8zNDZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGlucyAtLSBzYWZlXG4gIHJldHVybiAhJE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApO1xufSkgPyBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGNsYXNzb2YoaXQpID09PSAnU3RyaW5nJyA/IHNwbGl0KGl0LCAnJykgOiAkT2JqZWN0KGl0KTtcbn0gOiAkT2JqZWN0O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBzdG9yZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQtc3RvcmUnKTtcblxudmFyIGZ1bmN0aW9uVG9TdHJpbmcgPSB1bmN1cnJ5VGhpcyhGdW5jdGlvbi50b1N0cmluZyk7XG5cbi8vIHRoaXMgaGVscGVyIGJyb2tlbiBpbiBgY29yZS1qc0AzLjQuMS0zLjQuNGAsIHNvIHdlIGNhbid0IHVzZSBgc2hhcmVkYCBoZWxwZXJcbmlmICghaXNDYWxsYWJsZShzdG9yZS5pbnNwZWN0U291cmNlKSkge1xuICBzdG9yZS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uVG9TdHJpbmcoaXQpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlLmluc3BlY3RTb3VyY2U7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTkFUSVZFX1dFQUtfTUFQID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlYWstbWFwLWJhc2ljLWRldGVjdGlvbicpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG52YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcbnZhciBzaGFyZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLXN0b3JlJyk7XG52YXIgc2hhcmVkS2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1rZXknKTtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hpZGRlbi1rZXlzJyk7XG5cbnZhciBPQkpFQ1RfQUxSRUFEWV9JTklUSUFMSVpFRCA9ICdPYmplY3QgYWxyZWFkeSBpbml0aWFsaXplZCc7XG52YXIgVHlwZUVycm9yID0gZ2xvYmFsLlR5cGVFcnJvcjtcbnZhciBXZWFrTWFwID0gZ2xvYmFsLldlYWtNYXA7XG52YXIgc2V0LCBnZXQsIGhhcztcblxudmFyIGVuZm9yY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGhhcyhpdCkgPyBnZXQoaXQpIDogc2V0KGl0LCB7fSk7XG59O1xuXG52YXIgZ2V0dGVyRm9yID0gZnVuY3Rpb24gKFRZUEUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdCkge1xuICAgIHZhciBzdGF0ZTtcbiAgICBpZiAoIWlzT2JqZWN0KGl0KSB8fCAoc3RhdGUgPSBnZXQoaXQpKS50eXBlICE9PSBUWVBFKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbmNvbXBhdGlibGUgcmVjZWl2ZXIsICcgKyBUWVBFICsgJyByZXF1aXJlZCcpO1xuICAgIH0gcmV0dXJuIHN0YXRlO1xuICB9O1xufTtcblxuaWYgKE5BVElWRV9XRUFLX01BUCB8fCBzaGFyZWQuc3RhdGUpIHtcbiAgdmFyIHN0b3JlID0gc2hhcmVkLnN0YXRlIHx8IChzaGFyZWQuc3RhdGUgPSBuZXcgV2Vha01hcCgpKTtcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tc2VsZi1hc3NpZ24gLS0gcHJvdG90eXBlIG1ldGhvZHMgcHJvdGVjdGlvbiAqL1xuICBzdG9yZS5nZXQgPSBzdG9yZS5nZXQ7XG4gIHN0b3JlLmhhcyA9IHN0b3JlLmhhcztcbiAgc3RvcmUuc2V0ID0gc3RvcmUuc2V0O1xuICAvKiBlc2xpbnQtZW5hYmxlIG5vLXNlbGYtYXNzaWduIC0tIHByb3RvdHlwZSBtZXRob2RzIHByb3RlY3Rpb24gKi9cbiAgc2V0ID0gZnVuY3Rpb24gKGl0LCBtZXRhZGF0YSkge1xuICAgIGlmIChzdG9yZS5oYXMoaXQpKSB0aHJvdyBuZXcgVHlwZUVycm9yKE9CSkVDVF9BTFJFQURZX0lOSVRJQUxJWkVEKTtcbiAgICBtZXRhZGF0YS5mYWNhZGUgPSBpdDtcbiAgICBzdG9yZS5zZXQoaXQsIG1ldGFkYXRhKTtcbiAgICByZXR1cm4gbWV0YWRhdGE7XG4gIH07XG4gIGdldCA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiBzdG9yZS5nZXQoaXQpIHx8IHt9O1xuICB9O1xuICBoYXMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gc3RvcmUuaGFzKGl0KTtcbiAgfTtcbn0gZWxzZSB7XG4gIHZhciBTVEFURSA9IHNoYXJlZEtleSgnc3RhdGUnKTtcbiAgaGlkZGVuS2V5c1tTVEFURV0gPSB0cnVlO1xuICBzZXQgPSBmdW5jdGlvbiAoaXQsIG1ldGFkYXRhKSB7XG4gICAgaWYgKGhhc093bihpdCwgU1RBVEUpKSB0aHJvdyBuZXcgVHlwZUVycm9yKE9CSkVDVF9BTFJFQURZX0lOSVRJQUxJWkVEKTtcbiAgICBtZXRhZGF0YS5mYWNhZGUgPSBpdDtcbiAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoaXQsIFNUQVRFLCBtZXRhZGF0YSk7XG4gICAgcmV0dXJuIG1ldGFkYXRhO1xuICB9O1xuICBnZXQgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gaGFzT3duKGl0LCBTVEFURSkgPyBpdFtTVEFURV0gOiB7fTtcbiAgfTtcbiAgaGFzID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIGhhc093bihpdCwgU1RBVEUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBzZXQsXG4gIGdldDogZ2V0LFxuICBoYXM6IGhhcyxcbiAgZW5mb3JjZTogZW5mb3JjZSxcbiAgZ2V0dGVyRm9yOiBnZXR0ZXJGb3Jcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mLXJhdycpO1xuXG4vLyBgSXNBcnJheWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWlzYXJyYXlcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1hcnJheS1pc2FycmF5IC0tIHNhZmVcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZ3VtZW50KSB7XG4gIHJldHVybiBjbGFzc29mKGFyZ3VtZW50KSA9PT0gJ0FycmF5Jztcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLUlzSFRNTEREQS1pbnRlcm5hbC1zbG90XG52YXIgZG9jdW1lbnRBbGwgPSB0eXBlb2YgZG9jdW1lbnQgPT0gJ29iamVjdCcgJiYgZG9jdW1lbnQuYWxsO1xuXG4vLyBgSXNDYWxsYWJsZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWlzY2FsbGFibGVcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSB1bmljb3JuL25vLXR5cGVvZi11bmRlZmluZWQgLS0gcmVxdWlyZWQgZm9yIHRlc3Rpbmdcbm1vZHVsZS5leHBvcnRzID0gdHlwZW9mIGRvY3VtZW50QWxsID09ICd1bmRlZmluZWQnICYmIGRvY3VtZW50QWxsICE9PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmd1bWVudCA9PSAnZnVuY3Rpb24nIHx8IGFyZ3VtZW50ID09PSBkb2N1bWVudEFsbDtcbn0gOiBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmd1bWVudCA9PSAnZnVuY3Rpb24nO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcblxudmFyIHJlcGxhY2VtZW50ID0gLyN8XFwucHJvdG90eXBlXFwuLztcblxudmFyIGlzRm9yY2VkID0gZnVuY3Rpb24gKGZlYXR1cmUsIGRldGVjdGlvbikge1xuICB2YXIgdmFsdWUgPSBkYXRhW25vcm1hbGl6ZShmZWF0dXJlKV07XG4gIHJldHVybiB2YWx1ZSA9PT0gUE9MWUZJTEwgPyB0cnVlXG4gICAgOiB2YWx1ZSA9PT0gTkFUSVZFID8gZmFsc2VcbiAgICA6IGlzQ2FsbGFibGUoZGV0ZWN0aW9uKSA/IGZhaWxzKGRldGVjdGlvbilcbiAgICA6ICEhZGV0ZWN0aW9uO1xufTtcblxudmFyIG5vcm1hbGl6ZSA9IGlzRm9yY2VkLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgcmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UocmVwbGFjZW1lbnQsICcuJykudG9Mb3dlckNhc2UoKTtcbn07XG5cbnZhciBkYXRhID0gaXNGb3JjZWQuZGF0YSA9IHt9O1xudmFyIE5BVElWRSA9IGlzRm9yY2VkLk5BVElWRSA9ICdOJztcbnZhciBQT0xZRklMTCA9IGlzRm9yY2VkLlBPTFlGSUxMID0gJ1AnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRm9yY2VkO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gd2UgY2FuJ3QgdXNlIGp1c3QgYGl0ID09IG51bGxgIHNpbmNlIG9mIGBkb2N1bWVudC5hbGxgIHNwZWNpYWwgY2FzZVxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1Jc0hUTUxEREEtaW50ZXJuYWwtc2xvdC1hZWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA9PT0gbnVsbCB8fCBpdCA9PT0gdW5kZWZpbmVkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IGlzQ2FsbGFibGUoaXQpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGFyZ3VtZW50KSB8fCBhcmd1bWVudCA9PT0gbnVsbDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZhbHNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdldEJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LWJ1aWx0LWluJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIGlzUHJvdG90eXBlT2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWlzLXByb3RvdHlwZS1vZicpO1xudmFyIFVTRV9TWU1CT0xfQVNfVUlEID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3VzZS1zeW1ib2wtYXMtdWlkJyk7XG5cbnZhciAkT2JqZWN0ID0gT2JqZWN0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVTRV9TWU1CT0xfQVNfVUlEID8gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCc7XG59IDogZnVuY3Rpb24gKGl0KSB7XG4gIHZhciAkU3ltYm9sID0gZ2V0QnVpbHRJbignU3ltYm9sJyk7XG4gIHJldHVybiBpc0NhbGxhYmxlKCRTeW1ib2wpICYmIGlzUHJvdG90eXBlT2YoJFN5bWJvbC5wcm90b3R5cGUsICRPYmplY3QoaXQpKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tbGVuZ3RoJyk7XG5cbi8vIGBMZW5ndGhPZkFycmF5TGlrZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWxlbmd0aG9mYXJyYXlsaWtlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHRvTGVuZ3RoKG9iai5sZW5ndGgpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgQ09ORklHVVJBQkxFX0ZVTkNUSU9OX05BTUUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tbmFtZScpLkNPTkZJR1VSQUJMRTtcbnZhciBpbnNwZWN0U291cmNlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luc3BlY3Qtc291cmNlJyk7XG52YXIgSW50ZXJuYWxTdGF0ZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnRlcm5hbC1zdGF0ZScpO1xuXG52YXIgZW5mb3JjZUludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLmVuZm9yY2U7XG52YXIgZ2V0SW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuZ2V0O1xudmFyICRTdHJpbmcgPSBTdHJpbmc7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWRlZmluZXByb3BlcnR5IC0tIHNhZmVcbnZhciBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbnZhciBzdHJpbmdTbGljZSA9IHVuY3VycnlUaGlzKCcnLnNsaWNlKTtcbnZhciByZXBsYWNlID0gdW5jdXJyeVRoaXMoJycucmVwbGFjZSk7XG52YXIgam9pbiA9IHVuY3VycnlUaGlzKFtdLmpvaW4pO1xuXG52YXIgQ09ORklHVVJBQkxFX0xFTkdUSCA9IERFU0NSSVBUT1JTICYmICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBkZWZpbmVQcm9wZXJ0eShmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH0sICdsZW5ndGgnLCB7IHZhbHVlOiA4IH0pLmxlbmd0aCAhPT0gODtcbn0pO1xuXG52YXIgVEVNUExBVEUgPSBTdHJpbmcoU3RyaW5nKS5zcGxpdCgnU3RyaW5nJyk7XG5cbnZhciBtYWtlQnVpbHRJbiA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbHVlLCBuYW1lLCBvcHRpb25zKSB7XG4gIGlmIChzdHJpbmdTbGljZSgkU3RyaW5nKG5hbWUpLCAwLCA3KSA9PT0gJ1N5bWJvbCgnKSB7XG4gICAgbmFtZSA9ICdbJyArIHJlcGxhY2UoJFN0cmluZyhuYW1lKSwgL15TeW1ib2xcXCgoW14pXSopXFwpLiokLywgJyQxJykgKyAnXSc7XG4gIH1cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5nZXR0ZXIpIG5hbWUgPSAnZ2V0ICcgKyBuYW1lO1xuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnNldHRlcikgbmFtZSA9ICdzZXQgJyArIG5hbWU7XG4gIGlmICghaGFzT3duKHZhbHVlLCAnbmFtZScpIHx8IChDT05GSUdVUkFCTEVfRlVOQ1RJT05fTkFNRSAmJiB2YWx1ZS5uYW1lICE9PSBuYW1lKSkge1xuICAgIGlmIChERVNDUklQVE9SUykgZGVmaW5lUHJvcGVydHkodmFsdWUsICduYW1lJywgeyB2YWx1ZTogbmFtZSwgY29uZmlndXJhYmxlOiB0cnVlIH0pO1xuICAgIGVsc2UgdmFsdWUubmFtZSA9IG5hbWU7XG4gIH1cbiAgaWYgKENPTkZJR1VSQUJMRV9MRU5HVEggJiYgb3B0aW9ucyAmJiBoYXNPd24ob3B0aW9ucywgJ2FyaXR5JykgJiYgdmFsdWUubGVuZ3RoICE9PSBvcHRpb25zLmFyaXR5KSB7XG4gICAgZGVmaW5lUHJvcGVydHkodmFsdWUsICdsZW5ndGgnLCB7IHZhbHVlOiBvcHRpb25zLmFyaXR5IH0pO1xuICB9XG4gIHRyeSB7XG4gICAgaWYgKG9wdGlvbnMgJiYgaGFzT3duKG9wdGlvbnMsICdjb25zdHJ1Y3RvcicpICYmIG9wdGlvbnMuY29uc3RydWN0b3IpIHtcbiAgICAgIGlmIChERVNDUklQVE9SUykgZGVmaW5lUHJvcGVydHkodmFsdWUsICdwcm90b3R5cGUnLCB7IHdyaXRhYmxlOiBmYWxzZSB9KTtcbiAgICAvLyBpbiBWOCB+IENocm9tZSA1MywgcHJvdG90eXBlcyBvZiBzb21lIG1ldGhvZHMsIGxpa2UgYEFycmF5LnByb3RvdHlwZS52YWx1ZXNgLCBhcmUgbm9uLXdyaXRhYmxlXG4gICAgfSBlbHNlIGlmICh2YWx1ZS5wcm90b3R5cGUpIHZhbHVlLnByb3RvdHlwZSA9IHVuZGVmaW5lZDtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxuICB2YXIgc3RhdGUgPSBlbmZvcmNlSW50ZXJuYWxTdGF0ZSh2YWx1ZSk7XG4gIGlmICghaGFzT3duKHN0YXRlLCAnc291cmNlJykpIHtcbiAgICBzdGF0ZS5zb3VyY2UgPSBqb2luKFRFTVBMQVRFLCB0eXBlb2YgbmFtZSA9PSAnc3RyaW5nJyA/IG5hbWUgOiAnJyk7XG4gIH0gcmV0dXJuIHZhbHVlO1xufTtcblxuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXh0ZW5kLW5hdGl2ZSAtLSByZXF1aXJlZFxuRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nID0gbWFrZUJ1aWx0SW4oZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiBpc0NhbGxhYmxlKHRoaXMpICYmIGdldEludGVybmFsU3RhdGUodGhpcykuc291cmNlIHx8IGluc3BlY3RTb3VyY2UodGhpcyk7XG59LCAndG9TdHJpbmcnKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcblxuLy8gYE1hdGgudHJ1bmNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1tYXRoLnRydW5jXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tbWF0aC10cnVuYyAtLSBzYWZlXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGgudHJ1bmMgfHwgZnVuY3Rpb24gdHJ1bmMoeCkge1xuICB2YXIgbiA9ICt4O1xuICByZXR1cm4gKG4gPiAwID8gZmxvb3IgOiBjZWlsKShuKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pZTgtZG9tLWRlZmluZScpO1xudmFyIFY4X1BST1RPVFlQRV9ERUZJTkVfQlVHID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3Y4LXByb3RvdHlwZS1kZWZpbmUtYnVnJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgdG9Qcm9wZXJ0eUtleSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1wcm9wZXJ0eS1rZXknKTtcblxudmFyICRUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWRlZmluZXByb3BlcnR5IC0tIHNhZmVcbnZhciAkZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5ZGVzY3JpcHRvciAtLSBzYWZlXG52YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG52YXIgRU5VTUVSQUJMRSA9ICdlbnVtZXJhYmxlJztcbnZhciBDT05GSUdVUkFCTEUgPSAnY29uZmlndXJhYmxlJztcbnZhciBXUklUQUJMRSA9ICd3cml0YWJsZSc7XG5cbi8vIGBPYmplY3QuZGVmaW5lUHJvcGVydHlgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuZGVmaW5lcHJvcGVydHlcbmV4cG9ydHMuZiA9IERFU0NSSVBUT1JTID8gVjhfUFJPVE9UWVBFX0RFRklORV9CVUcgPyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9Qcm9wZXJ0eUtleShQKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmICh0eXBlb2YgTyA9PT0gJ2Z1bmN0aW9uJyAmJiBQID09PSAncHJvdG90eXBlJyAmJiAndmFsdWUnIGluIEF0dHJpYnV0ZXMgJiYgV1JJVEFCTEUgaW4gQXR0cmlidXRlcyAmJiAhQXR0cmlidXRlc1tXUklUQUJMRV0pIHtcbiAgICB2YXIgY3VycmVudCA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCk7XG4gICAgaWYgKGN1cnJlbnQgJiYgY3VycmVudFtXUklUQUJMRV0pIHtcbiAgICAgIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICAgICAgQXR0cmlidXRlcyA9IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBDT05GSUdVUkFCTEUgaW4gQXR0cmlidXRlcyA/IEF0dHJpYnV0ZXNbQ09ORklHVVJBQkxFXSA6IGN1cnJlbnRbQ09ORklHVVJBQkxFXSxcbiAgICAgICAgZW51bWVyYWJsZTogRU5VTUVSQUJMRSBpbiBBdHRyaWJ1dGVzID8gQXR0cmlidXRlc1tFTlVNRVJBQkxFXSA6IGN1cnJlbnRbRU5VTUVSQUJMRV0sXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZVxuICAgICAgfTtcbiAgICB9XG4gIH0gcmV0dXJuICRkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKTtcbn0gOiAkZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9Qcm9wZXJ0eUtleShQKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gJGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93IG5ldyAkVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCcpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1jYWxsJyk7XG52YXIgcHJvcGVydHlJc0VudW1lcmFibGVNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LXByb3BlcnR5LWlzLWVudW1lcmFibGUnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbnZhciB0b0luZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QnKTtcbnZhciB0b1Byb3BlcnR5S2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXByb3BlcnR5LWtleScpO1xudmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUnKTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3IgLS0gc2FmZVxudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG4vLyBgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3JcbmV4cG9ydHMuZiA9IERFU0NSSVBUT1JTID8gJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKSB7XG4gIE8gPSB0b0luZGV4ZWRPYmplY3QoTyk7XG4gIFAgPSB0b1Byb3BlcnR5S2V5KFApO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKGhhc093bihPLCBQKSkgcmV0dXJuIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcighY2FsbChwcm9wZXJ0eUlzRW51bWVyYWJsZU1vZHVsZS5mLCBPLCBQKSwgT1tQXSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGludGVybmFsT2JqZWN0S2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VudW0tYnVnLWtleXMnKTtcblxudmFyIGhpZGRlbktleXMgPSBlbnVtQnVnS2V5cy5jb25jYXQoJ2xlbmd0aCcsICdwcm90b3R5cGUnKTtcblxuLy8gYE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmdldG93bnByb3BlcnR5bmFtZXNcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0b3ducHJvcGVydHluYW1lcyAtLSBzYWZlXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKE8pIHtcbiAgcmV0dXJuIGludGVybmFsT2JqZWN0S2V5cyhPLCBoaWRkZW5LZXlzKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5c3ltYm9scyAtLSBzYWZlXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLW9iamVjdCcpO1xudmFyIHNoYXJlZEtleSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQta2V5Jyk7XG52YXIgQ09SUkVDVF9QUk9UT1RZUEVfR0VUVEVSID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NvcnJlY3QtcHJvdG90eXBlLWdldHRlcicpO1xuXG52YXIgSUVfUFJPVE8gPSBzaGFyZWRLZXkoJ0lFX1BST1RPJyk7XG52YXIgJE9iamVjdCA9IE9iamVjdDtcbnZhciBPYmplY3RQcm90b3R5cGUgPSAkT2JqZWN0LnByb3RvdHlwZTtcblxuLy8gYE9iamVjdC5nZXRQcm90b3R5cGVPZmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRwcm90b3R5cGVvZlxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRwcm90b3R5cGVvZiAtLSBzYWZlXG5tb2R1bGUuZXhwb3J0cyA9IENPUlJFQ1RfUFJPVE9UWVBFX0dFVFRFUiA/ICRPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiAoTykge1xuICB2YXIgb2JqZWN0ID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXNPd24ob2JqZWN0LCBJRV9QUk9UTykpIHJldHVybiBvYmplY3RbSUVfUFJPVE9dO1xuICB2YXIgY29uc3RydWN0b3IgPSBvYmplY3QuY29uc3RydWN0b3I7XG4gIGlmIChpc0NhbGxhYmxlKGNvbnN0cnVjdG9yKSAmJiBvYmplY3QgaW5zdGFuY2VvZiBjb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBjb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mICRPYmplY3QgPyBPYmplY3RQcm90b3R5cGUgOiBudWxsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB1bmN1cnJ5VGhpcyh7fS5pc1Byb3RvdHlwZU9mKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIHRvSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbmRleGVkLW9iamVjdCcpO1xudmFyIGluZGV4T2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktaW5jbHVkZXMnKS5pbmRleE9mO1xudmFyIGhpZGRlbktleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGlkZGVuLWtleXMnKTtcblxudmFyIHB1c2ggPSB1bmN1cnJ5VGhpcyhbXS5wdXNoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lcykge1xuICB2YXIgTyA9IHRvSW5kZXhlZE9iamVjdChvYmplY3QpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gTykgIWhhc093bihoaWRkZW5LZXlzLCBrZXkpICYmIGhhc093bihPLCBrZXkpICYmIHB1c2gocmVzdWx0LCBrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSBpZiAoaGFzT3duKE8sIGtleSA9IG5hbWVzW2krK10pKSB7XG4gICAgfmluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHB1c2gocmVzdWx0LCBrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3IgLS0gc2FmZVxudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbi8vIE5hc2hvcm4gfiBKREs4IGJ1Z1xudmFyIE5BU0hPUk5fQlVHID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICYmICEkcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh7IDE6IDIgfSwgMSk7XG5cbi8vIGBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlYCBtZXRob2QgaW1wbGVtZW50YXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eWlzZW51bWVyYWJsZVxuZXhwb3J0cy5mID0gTkFTSE9STl9CVUcgPyBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShWKSB7XG4gIHZhciBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMsIFYpO1xuICByZXR1cm4gISFkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IuZW51bWVyYWJsZTtcbn0gOiAkcHJvcGVydHlJc0VudW1lcmFibGU7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAtLSBzYWZlICovXG52YXIgdW5jdXJyeVRoaXNBY2Nlc3NvciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMtYWNjZXNzb3InKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBhUG9zc2libGVQcm90b3R5cGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1wb3NzaWJsZS1wcm90b3R5cGUnKTtcblxuLy8gYE9iamVjdC5zZXRQcm90b3R5cGVPZmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5zZXRwcm90b3R5cGVvZlxuLy8gV29ya3Mgd2l0aCBfX3Byb3RvX18gb25seS4gT2xkIHY4IGNhbid0IHdvcmsgd2l0aCBudWxsIHByb3RvIG9iamVjdHMuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LXNldHByb3RvdHlwZW9mIC0tIHNhZmVcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICgnX19wcm90b19fJyBpbiB7fSA/IGZ1bmN0aW9uICgpIHtcbiAgdmFyIENPUlJFQ1RfU0VUVEVSID0gZmFsc2U7XG4gIHZhciB0ZXN0ID0ge307XG4gIHZhciBzZXR0ZXI7XG4gIHRyeSB7XG4gICAgc2V0dGVyID0gdW5jdXJyeVRoaXNBY2Nlc3NvcihPYmplY3QucHJvdG90eXBlLCAnX19wcm90b19fJywgJ3NldCcpO1xuICAgIHNldHRlcih0ZXN0LCBbXSk7XG4gICAgQ09SUkVDVF9TRVRURVIgPSB0ZXN0IGluc3RhbmNlb2YgQXJyYXk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKSB7XG4gICAgYW5PYmplY3QoTyk7XG4gICAgYVBvc3NpYmxlUHJvdG90eXBlKHByb3RvKTtcbiAgICBpZiAoQ09SUkVDVF9TRVRURVIpIHNldHRlcihPLCBwcm90byk7XG4gICAgZWxzZSBPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgIHJldHVybiBPO1xuICB9O1xufSgpIDogdW5kZWZpbmVkKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjYWxsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWNhbGwnKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbnZhciAkVHlwZUVycm9yID0gVHlwZUVycm9yO1xuXG4vLyBgT3JkaW5hcnlUb1ByaW1pdGl2ZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9yZGluYXJ5dG9wcmltaXRpdmVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGlucHV0LCBwcmVmKSB7XG4gIHZhciBmbiwgdmFsO1xuICBpZiAocHJlZiA9PT0gJ3N0cmluZycgJiYgaXNDYWxsYWJsZShmbiA9IGlucHV0LnRvU3RyaW5nKSAmJiAhaXNPYmplY3QodmFsID0gY2FsbChmbiwgaW5wdXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKGlzQ2FsbGFibGUoZm4gPSBpbnB1dC52YWx1ZU9mKSAmJiAhaXNPYmplY3QodmFsID0gY2FsbChmbiwgaW5wdXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKHByZWYgIT09ICdzdHJpbmcnICYmIGlzQ2FsbGFibGUoZm4gPSBpbnB1dC50b1N0cmluZykgJiYgIWlzT2JqZWN0KHZhbCA9IGNhbGwoZm4sIGlucHV0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IG5ldyAkVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xudmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xudmFyIGdldE93blByb3BlcnR5TmFtZXNNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktbmFtZXMnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHNNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktc3ltYm9scycpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xuXG52YXIgY29uY2F0ID0gdW5jdXJyeVRoaXMoW10uY29uY2F0KTtcblxuLy8gYWxsIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBub24tZW51bWVyYWJsZSBhbmQgc3ltYm9sc1xubW9kdWxlLmV4cG9ydHMgPSBnZXRCdWlsdEluKCdSZWZsZWN0JywgJ293bktleXMnKSB8fCBmdW5jdGlvbiBvd25LZXlzKGl0KSB7XG4gIHZhciBrZXlzID0gZ2V0T3duUHJvcGVydHlOYW1lc01vZHVsZS5mKGFuT2JqZWN0KGl0KSk7XG4gIHZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHNNb2R1bGUuZjtcbiAgcmV0dXJuIGdldE93blByb3BlcnR5U3ltYm9scyA/IGNvbmNhdChrZXlzLCBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoaXQpKSA6IGtleXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGlzTnVsbE9yVW5kZWZpbmVkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW51bGwtb3ItdW5kZWZpbmVkJyk7XG5cbnZhciAkVHlwZUVycm9yID0gVHlwZUVycm9yO1xuXG4vLyBgUmVxdWlyZU9iamVjdENvZXJjaWJsZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXJlcXVpcmVvYmplY3Rjb2VyY2libGVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpc051bGxPclVuZGVmaW5lZChpdCkpIHRocm93IG5ldyAkVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgc2hhcmVkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZCcpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91aWQnKTtcblxudmFyIGtleXMgPSBzaGFyZWQoJ2tleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBrZXlzW2tleV0gfHwgKGtleXNba2V5XSA9IHVpZChrZXkpKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGRlZmluZUdsb2JhbFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RlZmluZS1nbG9iYWwtcHJvcGVydHknKTtcblxudmFyIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nO1xudmFyIHN0b3JlID0gZ2xvYmFsW1NIQVJFRF0gfHwgZGVmaW5lR2xvYmFsUHJvcGVydHkoU0hBUkVELCB7fSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmU7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgSVNfUFVSRSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1wdXJlJyk7XG52YXIgc3RvcmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLXN0b3JlJyk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiAnMy4zNS4xJyxcbiAgbW9kZTogSVNfUFVSRSA/ICdwdXJlJyA6ICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDE0LTIwMjQgRGVuaXMgUHVzaGthcmV2ICh6bG9pcm9jay5ydSknLFxuICBsaWNlbnNlOiAnaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvYmxvYi92My4zNS4xL0xJQ0VOU0UnLFxuICBzb3VyY2U6ICdodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcydcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgZXMvbm8tc3ltYm9sIC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nICovXG52YXIgVjhfVkVSU0lPTiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbmdpbmUtdjgtdmVyc2lvbicpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xuXG52YXIgJFN0cmluZyA9IGdsb2JhbC5TdHJpbmc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0b3ducHJvcGVydHlzeW1ib2xzIC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nXG5tb2R1bGUuZXhwb3J0cyA9ICEhT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICB2YXIgc3ltYm9sID0gU3ltYm9sKCdzeW1ib2wgZGV0ZWN0aW9uJyk7XG4gIC8vIENocm9tZSAzOCBTeW1ib2wgaGFzIGluY29ycmVjdCB0b1N0cmluZyBjb252ZXJzaW9uXG4gIC8vIGBnZXQtb3duLXByb3BlcnR5LXN5bWJvbHNgIHBvbHlmaWxsIHN5bWJvbHMgY29udmVydGVkIHRvIG9iamVjdCBhcmUgbm90IFN5bWJvbCBpbnN0YW5jZXNcbiAgLy8gbmI6IERvIG5vdCBjYWxsIGBTdHJpbmdgIGRpcmVjdGx5IHRvIGF2b2lkIHRoaXMgYmVpbmcgb3B0aW1pemVkIG91dCB0byBgc3ltYm9sKycnYCB3aGljaCB3aWxsLFxuICAvLyBvZiBjb3Vyc2UsIGZhaWwuXG4gIHJldHVybiAhJFN0cmluZyhzeW1ib2wpIHx8ICEoT2JqZWN0KHN5bWJvbCkgaW5zdGFuY2VvZiBTeW1ib2wpIHx8XG4gICAgLy8gQ2hyb21lIDM4LTQwIHN5bWJvbHMgYXJlIG5vdCBpbmhlcml0ZWQgZnJvbSBET00gY29sbGVjdGlvbnMgcHJvdG90eXBlcyB0byBpbnN0YW5jZXNcbiAgICAhU3ltYm9sLnNoYW0gJiYgVjhfVkVSU0lPTiAmJiBWOF9WRVJTSU9OIDwgNDE7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciB0b0ludGVnZXJPckluZmluaXR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWludGVnZXItb3ItaW5maW5pdHknKTtcblxudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xuXG4vLyBIZWxwZXIgZm9yIGEgcG9wdWxhciByZXBlYXRpbmcgY2FzZSBvZiB0aGUgc3BlYzpcbi8vIExldCBpbnRlZ2VyIGJlID8gVG9JbnRlZ2VyKGluZGV4KS5cbi8vIElmIGludGVnZXIgPCAwLCBsZXQgcmVzdWx0IGJlIG1heCgobGVuZ3RoICsgaW50ZWdlciksIDApOyBlbHNlIGxldCByZXN1bHQgYmUgbWluKGludGVnZXIsIGxlbmd0aCkuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbmRleCwgbGVuZ3RoKSB7XG4gIHZhciBpbnRlZ2VyID0gdG9JbnRlZ2VyT3JJbmZpbml0eShpbmRleCk7XG4gIHJldHVybiBpbnRlZ2VyIDwgMCA/IG1heChpbnRlZ2VyICsgbGVuZ3RoLCAwKSA6IG1pbihpbnRlZ2VyLCBsZW5ndGgpO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbmRleGVkLW9iamVjdCcpO1xudmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJbmRleGVkT2JqZWN0KHJlcXVpcmVPYmplY3RDb2VyY2libGUoaXQpKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdHJ1bmMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbWF0aC10cnVuYycpO1xuXG4vLyBgVG9JbnRlZ2VyT3JJbmZpbml0eWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvaW50ZWdlcm9yaW5maW5pdHlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHZhciBudW1iZXIgPSArYXJndW1lbnQ7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmUgLS0gTmFOIGNoZWNrXG4gIHJldHVybiBudW1iZXIgIT09IG51bWJlciB8fCBudW1iZXIgPT09IDAgPyAwIDogdHJ1bmMobnVtYmVyKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdG9JbnRlZ2VyT3JJbmZpbml0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbnRlZ2VyLW9yLWluZmluaXR5Jyk7XG5cbnZhciBtaW4gPSBNYXRoLm1pbjtcblxuLy8gYFRvTGVuZ3RoYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9sZW5ndGhcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHZhciBsZW4gPSB0b0ludGVnZXJPckluZmluaXR5KGFyZ3VtZW50KTtcbiAgcmV0dXJuIGxlbiA+IDAgPyBtaW4obGVuLCAweDFGRkZGRkZGRkZGRkZGKSA6IDA7IC8vIDIgKiogNTMgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcblxudmFyICRPYmplY3QgPSBPYmplY3Q7XG5cbi8vIGBUb09iamVjdGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvb2JqZWN0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gJE9iamVjdChyZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHRvUG9zaXRpdmVJbnRlZ2VyID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXBvc2l0aXZlLWludGVnZXInKTtcblxudmFyICRSYW5nZUVycm9yID0gUmFuZ2VFcnJvcjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIEJZVEVTKSB7XG4gIHZhciBvZmZzZXQgPSB0b1Bvc2l0aXZlSW50ZWdlcihpdCk7XG4gIGlmIChvZmZzZXQgJSBCWVRFUykgdGhyb3cgbmV3ICRSYW5nZUVycm9yKCdXcm9uZyBvZmZzZXQnKTtcbiAgcmV0dXJuIG9mZnNldDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdG9JbnRlZ2VyT3JJbmZpbml0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbnRlZ2VyLW9yLWluZmluaXR5Jyk7XG5cbnZhciAkUmFuZ2VFcnJvciA9IFJhbmdlRXJyb3I7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciByZXN1bHQgPSB0b0ludGVnZXJPckluZmluaXR5KGl0KTtcbiAgaWYgKHJlc3VsdCA8IDApIHRocm93IG5ldyAkUmFuZ2VFcnJvcihcIlRoZSBhcmd1bWVudCBjYW4ndCBiZSBsZXNzIHRoYW4gMFwiKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1jYWxsJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG52YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtc3ltYm9sJyk7XG52YXIgZ2V0TWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1tZXRob2QnKTtcbnZhciBvcmRpbmFyeVRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29yZGluYXJ5LXRvLXByaW1pdGl2ZScpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xuXG52YXIgJFR5cGVFcnJvciA9IFR5cGVFcnJvcjtcbnZhciBUT19QUklNSVRJVkUgPSB3ZWxsS25vd25TeW1ib2woJ3RvUHJpbWl0aXZlJyk7XG5cbi8vIGBUb1ByaW1pdGl2ZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvcHJpbWl0aXZlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbnB1dCwgcHJlZikge1xuICBpZiAoIWlzT2JqZWN0KGlucHV0KSB8fCBpc1N5bWJvbChpbnB1dCkpIHJldHVybiBpbnB1dDtcbiAgdmFyIGV4b3RpY1RvUHJpbSA9IGdldE1ldGhvZChpbnB1dCwgVE9fUFJJTUlUSVZFKTtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKGV4b3RpY1RvUHJpbSkge1xuICAgIGlmIChwcmVmID09PSB1bmRlZmluZWQpIHByZWYgPSAnZGVmYXVsdCc7XG4gICAgcmVzdWx0ID0gY2FsbChleG90aWNUb1ByaW0sIGlucHV0LCBwcmVmKTtcbiAgICBpZiAoIWlzT2JqZWN0KHJlc3VsdCkgfHwgaXNTeW1ib2wocmVzdWx0KSkgcmV0dXJuIHJlc3VsdDtcbiAgICB0aHJvdyBuZXcgJFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbiAgfVxuICBpZiAocHJlZiA9PT0gdW5kZWZpbmVkKSBwcmVmID0gJ251bWJlcic7XG4gIHJldHVybiBvcmRpbmFyeVRvUHJpbWl0aXZlKGlucHV0LCBwcmVmKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tcHJpbWl0aXZlJyk7XG52YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtc3ltYm9sJyk7XG5cbi8vIGBUb1Byb3BlcnR5S2V5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9wcm9wZXJ0eWtleVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgdmFyIGtleSA9IHRvUHJpbWl0aXZlKGFyZ3VtZW50LCAnc3RyaW5nJyk7XG4gIHJldHVybiBpc1N5bWJvbChrZXkpID8ga2V5IDoga2V5ICsgJyc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xuXG52YXIgVE9fU1RSSU5HX1RBRyA9IHdlbGxLbm93blN5bWJvbCgndG9TdHJpbmdUYWcnKTtcbnZhciB0ZXN0ID0ge307XG5cbnRlc3RbVE9fU1RSSU5HX1RBR10gPSAneic7XG5cbm1vZHVsZS5leHBvcnRzID0gU3RyaW5nKHRlc3QpID09PSAnW29iamVjdCB6XSc7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mJyk7XG5cbnZhciAkU3RyaW5nID0gU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICBpZiAoY2xhc3NvZihhcmd1bWVudCkgPT09ICdTeW1ib2wnKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCBhIFN5bWJvbCB2YWx1ZSB0byBhIHN0cmluZycpO1xuICByZXR1cm4gJFN0cmluZyhhcmd1bWVudCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRTdHJpbmcgPSBTdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICRTdHJpbmcoYXJndW1lbnQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiAnT2JqZWN0JztcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcblxudmFyIGlkID0gMDtcbnZhciBwb3N0Zml4ID0gTWF0aC5yYW5kb20oKTtcbnZhciB0b1N0cmluZyA9IHVuY3VycnlUaGlzKDEuMC50b1N0cmluZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnICsgKGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXkpICsgJylfJyArIHRvU3RyaW5nKCsraWQgKyBwb3N0Zml4LCAzNik7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgZXMvbm8tc3ltYm9sIC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nICovXG52YXIgTkFUSVZFX1NZTUJPTCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zeW1ib2wtY29uc3RydWN0b3ItZGV0ZWN0aW9uJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gTkFUSVZFX1NZTUJPTFxuICAmJiAhU3ltYm9sLnNoYW1cbiAgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PSAnc3ltYm9sJztcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbi8vIFY4IH4gQ2hyb21lIDM2LVxuLy8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzMzNFxubW9kdWxlLmV4cG9ydHMgPSBERVNDUklQVE9SUyAmJiBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydHkgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH0sICdwcm90b3R5cGUnLCB7XG4gICAgdmFsdWU6IDQyLFxuICAgIHdyaXRhYmxlOiBmYWxzZVxuICB9KS5wcm90b3R5cGUgIT09IDQyO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcblxudmFyIFdlYWtNYXAgPSBnbG9iYWwuV2Vha01hcDtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0NhbGxhYmxlKFdlYWtNYXApICYmIC9uYXRpdmUgY29kZS8udGVzdChTdHJpbmcoV2Vha01hcCkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBzaGFyZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkJyk7XG52YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdWlkJyk7XG52YXIgTkFUSVZFX1NZTUJPTCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zeW1ib2wtY29uc3RydWN0b3ItZGV0ZWN0aW9uJyk7XG52YXIgVVNFX1NZTUJPTF9BU19VSUQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdXNlLXN5bWJvbC1hcy11aWQnKTtcblxudmFyIFN5bWJvbCA9IGdsb2JhbC5TeW1ib2w7XG52YXIgV2VsbEtub3duU3ltYm9sc1N0b3JlID0gc2hhcmVkKCd3a3MnKTtcbnZhciBjcmVhdGVXZWxsS25vd25TeW1ib2wgPSBVU0VfU1lNQk9MX0FTX1VJRCA/IFN5bWJvbFsnZm9yJ10gfHwgU3ltYm9sIDogU3ltYm9sICYmIFN5bWJvbC53aXRob3V0U2V0dGVyIHx8IHVpZDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICBpZiAoIWhhc093bihXZWxsS25vd25TeW1ib2xzU3RvcmUsIG5hbWUpKSB7XG4gICAgV2VsbEtub3duU3ltYm9sc1N0b3JlW25hbWVdID0gTkFUSVZFX1NZTUJPTCAmJiBoYXNPd24oU3ltYm9sLCBuYW1lKVxuICAgICAgPyBTeW1ib2xbbmFtZV1cbiAgICAgIDogY3JlYXRlV2VsbEtub3duU3ltYm9sKCdTeW1ib2wuJyArIG5hbWUpO1xuICB9IHJldHVybiBXZWxsS25vd25TeW1ib2xzU3RvcmVbbmFtZV07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgJHJlZHVjZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1yZWR1Y2UnKS5sZWZ0O1xudmFyIGFycmF5TWV0aG9kSXNTdHJpY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWlzLXN0cmljdCcpO1xudmFyIENIUk9NRV9WRVJTSU9OID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS12OC12ZXJzaW9uJyk7XG52YXIgSVNfTk9ERSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbmdpbmUtaXMtbm9kZScpO1xuXG4vLyBDaHJvbWUgODAtODIgaGFzIGEgY3JpdGljYWwgYnVnXG4vLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0xMDQ5OTgyXG52YXIgQ0hST01FX0JVRyA9ICFJU19OT0RFICYmIENIUk9NRV9WRVJTSU9OID4gNzkgJiYgQ0hST01FX1ZFUlNJT04gPCA4MztcbnZhciBGT1JDRUQgPSBDSFJPTUVfQlVHIHx8ICFhcnJheU1ldGhvZElzU3RyaWN0KCdyZWR1Y2UnKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5yZWR1Y2VgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUucmVkdWNlXG4kKHsgdGFyZ2V0OiAnQXJyYXknLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiBGT1JDRUQgfSwge1xuICByZWR1Y2U6IGZ1bmN0aW9uIHJlZHVjZShjYWxsYmFja2ZuIC8qICwgaW5pdGlhbFZhbHVlICovKSB7XG4gICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgcmV0dXJuICRyZWR1Y2UodGhpcywgY2FsbGJhY2tmbiwgbGVuZ3RoLCBsZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xudmFyIGFwcGx5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWFwcGx5Jyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1jYWxsJyk7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtc3ltYm9sJyk7XG52YXIgYXJyYXlTbGljZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1zbGljZScpO1xudmFyIGdldFJlcGxhY2VyRnVuY3Rpb24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LWpzb24tcmVwbGFjZXItZnVuY3Rpb24nKTtcbnZhciBOQVRJVkVfU1lNQk9MID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3N5bWJvbC1jb25zdHJ1Y3Rvci1kZXRlY3Rpb24nKTtcblxudmFyICRTdHJpbmcgPSBTdHJpbmc7XG52YXIgJHN0cmluZ2lmeSA9IGdldEJ1aWx0SW4oJ0pTT04nLCAnc3RyaW5naWZ5Jyk7XG52YXIgZXhlYyA9IHVuY3VycnlUaGlzKC8uLy5leGVjKTtcbnZhciBjaGFyQXQgPSB1bmN1cnJ5VGhpcygnJy5jaGFyQXQpO1xudmFyIGNoYXJDb2RlQXQgPSB1bmN1cnJ5VGhpcygnJy5jaGFyQ29kZUF0KTtcbnZhciByZXBsYWNlID0gdW5jdXJyeVRoaXMoJycucmVwbGFjZSk7XG52YXIgbnVtYmVyVG9TdHJpbmcgPSB1bmN1cnJ5VGhpcygxLjAudG9TdHJpbmcpO1xuXG52YXIgdGVzdGVyID0gL1tcXHVEODAwLVxcdURGRkZdL2c7XG52YXIgbG93ID0gL15bXFx1RDgwMC1cXHVEQkZGXSQvO1xudmFyIGhpID0gL15bXFx1REMwMC1cXHVERkZGXSQvO1xuXG52YXIgV1JPTkdfU1lNQk9MU19DT05WRVJTSU9OID0gIU5BVElWRV9TWU1CT0wgfHwgZmFpbHMoZnVuY3Rpb24gKCkge1xuICB2YXIgc3ltYm9sID0gZ2V0QnVpbHRJbignU3ltYm9sJykoJ3N0cmluZ2lmeSBkZXRlY3Rpb24nKTtcbiAgLy8gTVMgRWRnZSBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMge31cbiAgcmV0dXJuICRzdHJpbmdpZnkoW3N5bWJvbF0pICE9PSAnW251bGxdJ1xuICAgIC8vIFdlYktpdCBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMgbnVsbFxuICAgIHx8ICRzdHJpbmdpZnkoeyBhOiBzeW1ib2wgfSkgIT09ICd7fSdcbiAgICAvLyBWOCB0aHJvd3Mgb24gYm94ZWQgc3ltYm9sc1xuICAgIHx8ICRzdHJpbmdpZnkoT2JqZWN0KHN5bWJvbCkpICE9PSAne30nO1xufSk7XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXdlbGwtZm9ybWVkLXN0cmluZ2lmeVxudmFyIElMTF9GT1JNRURfVU5JQ09ERSA9IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICRzdHJpbmdpZnkoJ1xcdURGMDZcXHVEODM0JykgIT09ICdcIlxcXFx1ZGYwNlxcXFx1ZDgzNFwiJ1xuICAgIHx8ICRzdHJpbmdpZnkoJ1xcdURFQUQnKSAhPT0gJ1wiXFxcXHVkZWFkXCInO1xufSk7XG5cbnZhciBzdHJpbmdpZnlXaXRoU3ltYm9sc0ZpeCA9IGZ1bmN0aW9uIChpdCwgcmVwbGFjZXIpIHtcbiAgdmFyIGFyZ3MgPSBhcnJheVNsaWNlKGFyZ3VtZW50cyk7XG4gIHZhciAkcmVwbGFjZXIgPSBnZXRSZXBsYWNlckZ1bmN0aW9uKHJlcGxhY2VyKTtcbiAgaWYgKCFpc0NhbGxhYmxlKCRyZXBsYWNlcikgJiYgKGl0ID09PSB1bmRlZmluZWQgfHwgaXNTeW1ib2woaXQpKSkgcmV0dXJuOyAvLyBJRTggcmV0dXJucyBzdHJpbmcgb24gdW5kZWZpbmVkXG4gIGFyZ3NbMV0gPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIC8vIHNvbWUgb2xkIGltcGxlbWVudGF0aW9ucyAobGlrZSBXZWJLaXQpIGNvdWxkIHBhc3MgbnVtYmVycyBhcyBrZXlzXG4gICAgaWYgKGlzQ2FsbGFibGUoJHJlcGxhY2VyKSkgdmFsdWUgPSBjYWxsKCRyZXBsYWNlciwgdGhpcywgJFN0cmluZyhrZXkpLCB2YWx1ZSk7XG4gICAgaWYgKCFpc1N5bWJvbCh2YWx1ZSkpIHJldHVybiB2YWx1ZTtcbiAgfTtcbiAgcmV0dXJuIGFwcGx5KCRzdHJpbmdpZnksIG51bGwsIGFyZ3MpO1xufTtcblxudmFyIGZpeElsbEZvcm1lZCA9IGZ1bmN0aW9uIChtYXRjaCwgb2Zmc2V0LCBzdHJpbmcpIHtcbiAgdmFyIHByZXYgPSBjaGFyQXQoc3RyaW5nLCBvZmZzZXQgLSAxKTtcbiAgdmFyIG5leHQgPSBjaGFyQXQoc3RyaW5nLCBvZmZzZXQgKyAxKTtcbiAgaWYgKChleGVjKGxvdywgbWF0Y2gpICYmICFleGVjKGhpLCBuZXh0KSkgfHwgKGV4ZWMoaGksIG1hdGNoKSAmJiAhZXhlYyhsb3csIHByZXYpKSkge1xuICAgIHJldHVybiAnXFxcXHUnICsgbnVtYmVyVG9TdHJpbmcoY2hhckNvZGVBdChtYXRjaCwgMCksIDE2KTtcbiAgfSByZXR1cm4gbWF0Y2g7XG59O1xuXG5pZiAoJHN0cmluZ2lmeSkge1xuICAvLyBgSlNPTi5zdHJpbmdpZnlgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWpzb24uc3RyaW5naWZ5XG4gICQoeyB0YXJnZXQ6ICdKU09OJywgc3RhdDogdHJ1ZSwgYXJpdHk6IDMsIGZvcmNlZDogV1JPTkdfU1lNQk9MU19DT05WRVJTSU9OIHx8IElMTF9GT1JNRURfVU5JQ09ERSB9LCB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzIC0tIHJlcXVpcmVkIGZvciBgLmxlbmd0aGBcbiAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCwgcmVwbGFjZXIsIHNwYWNlKSB7XG4gICAgICB2YXIgYXJncyA9IGFycmF5U2xpY2UoYXJndW1lbnRzKTtcbiAgICAgIHZhciByZXN1bHQgPSBhcHBseShXUk9OR19TWU1CT0xTX0NPTlZFUlNJT04gPyBzdHJpbmdpZnlXaXRoU3ltYm9sc0ZpeCA6ICRzdHJpbmdpZnksIG51bGwsIGFyZ3MpO1xuICAgICAgcmV0dXJuIElMTF9GT1JNRURfVU5JQ09ERSAmJiB0eXBlb2YgcmVzdWx0ID09ICdzdHJpbmcnID8gcmVwbGFjZShyZXN1bHQsIHRlc3RlciwgZml4SWxsRm9ybWVkKSA6IHJlc3VsdDtcbiAgICB9XG4gIH0pO1xufVxuIiwiLy8gYFN5bWJvbC5wcm90b3R5cGUuZGVzY3JpcHRpb25gIGdldHRlclxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1zeW1ib2wucHJvdG90eXBlLmRlc2NyaXB0aW9uXG4ndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBpc1Byb3RvdHlwZU9mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1pcy1wcm90b3R5cGUtb2YnKTtcbnZhciB0b1N0cmluZyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1zdHJpbmcnKTtcbnZhciBkZWZpbmVCdWlsdEluQWNjZXNzb3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVmaW5lLWJ1aWx0LWluLWFjY2Vzc29yJyk7XG52YXIgY29weUNvbnN0cnVjdG9yUHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jb3B5LWNvbnN0cnVjdG9yLXByb3BlcnRpZXMnKTtcblxudmFyIE5hdGl2ZVN5bWJvbCA9IGdsb2JhbC5TeW1ib2w7XG52YXIgU3ltYm9sUHJvdG90eXBlID0gTmF0aXZlU3ltYm9sICYmIE5hdGl2ZVN5bWJvbC5wcm90b3R5cGU7XG5cbmlmIChERVNDUklQVE9SUyAmJiBpc0NhbGxhYmxlKE5hdGl2ZVN5bWJvbCkgJiYgKCEoJ2Rlc2NyaXB0aW9uJyBpbiBTeW1ib2xQcm90b3R5cGUpIHx8XG4gIC8vIFNhZmFyaSAxMiBidWdcbiAgTmF0aXZlU3ltYm9sKCkuZGVzY3JpcHRpb24gIT09IHVuZGVmaW5lZFxuKSkge1xuICB2YXIgRW1wdHlTdHJpbmdEZXNjcmlwdGlvblN0b3JlID0ge307XG4gIC8vIHdyYXAgU3ltYm9sIGNvbnN0cnVjdG9yIGZvciBjb3JyZWN0IHdvcmsgd2l0aCB1bmRlZmluZWQgZGVzY3JpcHRpb25cbiAgdmFyIFN5bWJvbFdyYXBwZXIgPSBmdW5jdGlvbiBTeW1ib2woKSB7XG4gICAgdmFyIGRlc2NyaXB0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA8IDEgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiB0b1N0cmluZyhhcmd1bWVudHNbMF0pO1xuICAgIHZhciByZXN1bHQgPSBpc1Byb3RvdHlwZU9mKFN5bWJvbFByb3RvdHlwZSwgdGhpcylcbiAgICAgID8gbmV3IE5hdGl2ZVN5bWJvbChkZXNjcmlwdGlvbilcbiAgICAgIC8vIGluIEVkZ2UgMTMsIFN0cmluZyhTeW1ib2wodW5kZWZpbmVkKSkgPT09ICdTeW1ib2wodW5kZWZpbmVkKSdcbiAgICAgIDogZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCA/IE5hdGl2ZVN5bWJvbCgpIDogTmF0aXZlU3ltYm9sKGRlc2NyaXB0aW9uKTtcbiAgICBpZiAoZGVzY3JpcHRpb24gPT09ICcnKSBFbXB0eVN0cmluZ0Rlc2NyaXB0aW9uU3RvcmVbcmVzdWx0XSA9IHRydWU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICBjb3B5Q29uc3RydWN0b3JQcm9wZXJ0aWVzKFN5bWJvbFdyYXBwZXIsIE5hdGl2ZVN5bWJvbCk7XG4gIFN5bWJvbFdyYXBwZXIucHJvdG90eXBlID0gU3ltYm9sUHJvdG90eXBlO1xuICBTeW1ib2xQcm90b3R5cGUuY29uc3RydWN0b3IgPSBTeW1ib2xXcmFwcGVyO1xuXG4gIHZhciBOQVRJVkVfU1lNQk9MID0gU3RyaW5nKE5hdGl2ZVN5bWJvbCgnZGVzY3JpcHRpb24gZGV0ZWN0aW9uJykpID09PSAnU3ltYm9sKGRlc2NyaXB0aW9uIGRldGVjdGlvbiknO1xuICB2YXIgdGhpc1N5bWJvbFZhbHVlID0gdW5jdXJyeVRoaXMoU3ltYm9sUHJvdG90eXBlLnZhbHVlT2YpO1xuICB2YXIgc3ltYm9sRGVzY3JpcHRpdmVTdHJpbmcgPSB1bmN1cnJ5VGhpcyhTeW1ib2xQcm90b3R5cGUudG9TdHJpbmcpO1xuICB2YXIgcmVnZXhwID0gL15TeW1ib2xcXCgoLiopXFwpW14pXSskLztcbiAgdmFyIHJlcGxhY2UgPSB1bmN1cnJ5VGhpcygnJy5yZXBsYWNlKTtcbiAgdmFyIHN0cmluZ1NsaWNlID0gdW5jdXJyeVRoaXMoJycuc2xpY2UpO1xuXG4gIGRlZmluZUJ1aWx0SW5BY2Nlc3NvcihTeW1ib2xQcm90b3R5cGUsICdkZXNjcmlwdGlvbicsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiBkZXNjcmlwdGlvbigpIHtcbiAgICAgIHZhciBzeW1ib2wgPSB0aGlzU3ltYm9sVmFsdWUodGhpcyk7XG4gICAgICBpZiAoaGFzT3duKEVtcHR5U3RyaW5nRGVzY3JpcHRpb25TdG9yZSwgc3ltYm9sKSkgcmV0dXJuICcnO1xuICAgICAgdmFyIHN0cmluZyA9IHN5bWJvbERlc2NyaXB0aXZlU3RyaW5nKHN5bWJvbCk7XG4gICAgICB2YXIgZGVzYyA9IE5BVElWRV9TWU1CT0wgPyBzdHJpbmdTbGljZShzdHJpbmcsIDcsIC0xKSA6IHJlcGxhY2Uoc3RyaW5nLCByZWdleHAsICckMScpO1xuICAgICAgcmV0dXJuIGRlc2MgPT09ICcnID8gdW5kZWZpbmVkIDogZGVzYztcbiAgICB9XG4gIH0pO1xuXG4gICQoeyBnbG9iYWw6IHRydWUsIGNvbnN0cnVjdG9yOiB0cnVlLCBmb3JjZWQ6IHRydWUgfSwge1xuICAgIFN5bWJvbDogU3ltYm9sV3JhcHBlclxuICB9KTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1jYWxsJyk7XG52YXIgQXJyYXlCdWZmZXJWaWV3Q29yZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1idWZmZXItdmlldy1jb3JlJyk7XG52YXIgbGVuZ3RoT2ZBcnJheUxpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbGVuZ3RoLW9mLWFycmF5LWxpa2UnKTtcbnZhciB0b09mZnNldCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vZmZzZXQnKTtcbnZhciB0b0luZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tb2JqZWN0Jyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcblxudmFyIFJhbmdlRXJyb3IgPSBnbG9iYWwuUmFuZ2VFcnJvcjtcbnZhciBJbnQ4QXJyYXkgPSBnbG9iYWwuSW50OEFycmF5O1xudmFyIEludDhBcnJheVByb3RvdHlwZSA9IEludDhBcnJheSAmJiBJbnQ4QXJyYXkucHJvdG90eXBlO1xudmFyICRzZXQgPSBJbnQ4QXJyYXlQcm90b3R5cGUgJiYgSW50OEFycmF5UHJvdG90eXBlLnNldDtcbnZhciBhVHlwZWRBcnJheSA9IEFycmF5QnVmZmVyVmlld0NvcmUuYVR5cGVkQXJyYXk7XG52YXIgZXhwb3J0VHlwZWRBcnJheU1ldGhvZCA9IEFycmF5QnVmZmVyVmlld0NvcmUuZXhwb3J0VHlwZWRBcnJheU1ldGhvZDtcblxudmFyIFdPUktTX1dJVEhfT0JKRUNUU19BTkRfR0VORVJJQ19PTl9UWVBFRF9BUlJBWVMgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tdHlwZWQtYXJyYXlzIC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nXG4gIHZhciBhcnJheSA9IG5ldyBVaW50OENsYW1wZWRBcnJheSgyKTtcbiAgY2FsbCgkc2V0LCBhcnJheSwgeyBsZW5ndGg6IDEsIDA6IDMgfSwgMSk7XG4gIHJldHVybiBhcnJheVsxXSAhPT0gMztcbn0pO1xuXG4vLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0xMTI5NCBhbmQgb3RoZXJcbnZhciBUT19PQkpFQ1RfQlVHID0gV09SS1NfV0lUSF9PQkpFQ1RTX0FORF9HRU5FUklDX09OX1RZUEVEX0FSUkFZUyAmJiBBcnJheUJ1ZmZlclZpZXdDb3JlLk5BVElWRV9BUlJBWV9CVUZGRVJfVklFV1MgJiYgZmFpbHMoZnVuY3Rpb24gKCkge1xuICB2YXIgYXJyYXkgPSBuZXcgSW50OEFycmF5KDIpO1xuICBhcnJheS5zZXQoMSk7XG4gIGFycmF5LnNldCgnMicsIDEpO1xuICByZXR1cm4gYXJyYXlbMF0gIT09IDAgfHwgYXJyYXlbMV0gIT09IDI7XG59KTtcblxuLy8gYCVUeXBlZEFycmF5JS5wcm90b3R5cGUuc2V0YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJXR5cGVkYXJyYXklLnByb3RvdHlwZS5zZXRcbmV4cG9ydFR5cGVkQXJyYXlNZXRob2QoJ3NldCcsIGZ1bmN0aW9uIHNldChhcnJheUxpa2UgLyogLCBvZmZzZXQgKi8pIHtcbiAgYVR5cGVkQXJyYXkodGhpcyk7XG4gIHZhciBvZmZzZXQgPSB0b09mZnNldChhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgMSk7XG4gIHZhciBzcmMgPSB0b0luZGV4ZWRPYmplY3QoYXJyYXlMaWtlKTtcbiAgaWYgKFdPUktTX1dJVEhfT0JKRUNUU19BTkRfR0VORVJJQ19PTl9UWVBFRF9BUlJBWVMpIHJldHVybiBjYWxsKCRzZXQsIHRoaXMsIHNyYywgb2Zmc2V0KTtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuICB2YXIgbGVuID0gbGVuZ3RoT2ZBcnJheUxpa2Uoc3JjKTtcbiAgdmFyIGluZGV4ID0gMDtcbiAgaWYgKGxlbiArIG9mZnNldCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1dyb25nIGxlbmd0aCcpO1xuICB3aGlsZSAoaW5kZXggPCBsZW4pIHRoaXNbb2Zmc2V0ICsgaW5kZXhdID0gc3JjW2luZGV4KytdO1xufSwgIVdPUktTX1dJVEhfT0JKRUNUU19BTkRfR0VORVJJQ19PTl9UWVBFRF9BUlJBWVMgfHwgVE9fT0JKRUNUX0JVRyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcy1jbGF1c2UnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGFDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWNhbGxhYmxlJyk7XG52YXIgaW50ZXJuYWxTb3J0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LXNvcnQnKTtcbnZhciBBcnJheUJ1ZmZlclZpZXdDb3JlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWJ1ZmZlci12aWV3LWNvcmUnKTtcbnZhciBGRiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbmdpbmUtZmYtdmVyc2lvbicpO1xudmFyIElFX09SX0VER0UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLWlzLWllLW9yLWVkZ2UnKTtcbnZhciBWOCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbmdpbmUtdjgtdmVyc2lvbicpO1xudmFyIFdFQktJVCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbmdpbmUtd2Via2l0LXZlcnNpb24nKTtcblxudmFyIGFUeXBlZEFycmF5ID0gQXJyYXlCdWZmZXJWaWV3Q29yZS5hVHlwZWRBcnJheTtcbnZhciBleHBvcnRUeXBlZEFycmF5TWV0aG9kID0gQXJyYXlCdWZmZXJWaWV3Q29yZS5leHBvcnRUeXBlZEFycmF5TWV0aG9kO1xudmFyIFVpbnQxNkFycmF5ID0gZ2xvYmFsLlVpbnQxNkFycmF5O1xudmFyIG5hdGl2ZVNvcnQgPSBVaW50MTZBcnJheSAmJiB1bmN1cnJ5VGhpcyhVaW50MTZBcnJheS5wcm90b3R5cGUuc29ydCk7XG5cbi8vIFdlYktpdFxudmFyIEFDQ0VQVF9JTkNPUlJFQ1RfQVJHVU1FTlRTID0gISFuYXRpdmVTb3J0ICYmICEoZmFpbHMoZnVuY3Rpb24gKCkge1xuICBuYXRpdmVTb3J0KG5ldyBVaW50MTZBcnJheSgyKSwgbnVsbCk7XG59KSAmJiBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIG5hdGl2ZVNvcnQobmV3IFVpbnQxNkFycmF5KDIpLCB7fSk7XG59KSk7XG5cbnZhciBTVEFCTEVfU09SVCA9ICEhbmF0aXZlU29ydCAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyBmZWF0dXJlIGRldGVjdGlvbiBjYW4gYmUgdG9vIHNsb3csIHNvIGNoZWNrIGVuZ2luZXMgdmVyc2lvbnNcbiAgaWYgKFY4KSByZXR1cm4gVjggPCA3NDtcbiAgaWYgKEZGKSByZXR1cm4gRkYgPCA2NztcbiAgaWYgKElFX09SX0VER0UpIHJldHVybiB0cnVlO1xuICBpZiAoV0VCS0lUKSByZXR1cm4gV0VCS0lUIDwgNjAyO1xuXG4gIHZhciBhcnJheSA9IG5ldyBVaW50MTZBcnJheSg1MTYpO1xuICB2YXIgZXhwZWN0ZWQgPSBBcnJheSg1MTYpO1xuICB2YXIgaW5kZXgsIG1vZDtcblxuICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCA1MTY7IGluZGV4KyspIHtcbiAgICBtb2QgPSBpbmRleCAlIDQ7XG4gICAgYXJyYXlbaW5kZXhdID0gNTE1IC0gaW5kZXg7XG4gICAgZXhwZWN0ZWRbaW5kZXhdID0gaW5kZXggLSAyICogbW9kICsgMztcbiAgfVxuXG4gIG5hdGl2ZVNvcnQoYXJyYXksIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIChhIC8gNCB8IDApIC0gKGIgLyA0IHwgMCk7XG4gIH0pO1xuXG4gIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IDUxNjsgaW5kZXgrKykge1xuICAgIGlmIChhcnJheVtpbmRleF0gIT09IGV4cGVjdGVkW2luZGV4XSkgcmV0dXJuIHRydWU7XG4gIH1cbn0pO1xuXG52YXIgZ2V0U29ydENvbXBhcmUgPSBmdW5jdGlvbiAoY29tcGFyZWZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoeCwgeSkge1xuICAgIGlmIChjb21wYXJlZm4gIT09IHVuZGVmaW5lZCkgcmV0dXJuICtjb21wYXJlZm4oeCwgeSkgfHwgMDtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlIC0tIE5hTiBjaGVja1xuICAgIGlmICh5ICE9PSB5KSByZXR1cm4gLTE7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZSAtLSBOYU4gY2hlY2tcbiAgICBpZiAoeCAhPT0geCkgcmV0dXJuIDE7XG4gICAgaWYgKHggPT09IDAgJiYgeSA9PT0gMCkgcmV0dXJuIDEgLyB4ID4gMCAmJiAxIC8geSA8IDAgPyAxIDogLTE7XG4gICAgcmV0dXJuIHggPiB5O1xuICB9O1xufTtcblxuLy8gYCVUeXBlZEFycmF5JS5wcm90b3R5cGUuc29ydGAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSV0eXBlZGFycmF5JS5wcm90b3R5cGUuc29ydFxuZXhwb3J0VHlwZWRBcnJheU1ldGhvZCgnc29ydCcsIGZ1bmN0aW9uIHNvcnQoY29tcGFyZWZuKSB7XG4gIGlmIChjb21wYXJlZm4gIT09IHVuZGVmaW5lZCkgYUNhbGxhYmxlKGNvbXBhcmVmbik7XG4gIGlmIChTVEFCTEVfU09SVCkgcmV0dXJuIG5hdGl2ZVNvcnQodGhpcywgY29tcGFyZWZuKTtcblxuICByZXR1cm4gaW50ZXJuYWxTb3J0KGFUeXBlZEFycmF5KHRoaXMpLCBnZXRTb3J0Q29tcGFyZShjb21wYXJlZm4pKTtcbn0sICFTVEFCTEVfU09SVCB8fCBBQ0NFUFRfSU5DT1JSRUNUX0FSR1VNRU5UUyk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJleHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlU2Vzc2lvbihiYXNlVXJsLCByZXEpIHtcbiAgICBjb25zdCBpbml0ID0gcHJlcGFyZVJlcXVlc3RJbml0KHJlcS5jbGllbnRUb2tlbiwgcmVxLmNsaWVudElkKTtcbiAgICBpbml0Lm1ldGhvZCA9IFwiUE9TVFwiO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7c2Vzc2lvblBhdGgoYmFzZVVybCl9YCwgaW5pdCk7XG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgIHRocm93IGBlcnJvciBjcmVhdGluZyBjbGllbnQgc2Vzc2lvbiBbJHtyZXNwb25zZS5zdGF0dXN9XWA7XG4gICAgfVxuICAgIHJldHVybiBhd2FpdCByZXNwb25zZS5qc29uKCk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlT2ZmZXIoYmFzZVVybCwgcmVxKSB7XG4gICAgY29uc3QgaW5pdCA9IHByZXBhcmVSZXF1ZXN0SW5pdChyZXEuY2xpZW50VG9rZW4sIHJlcS5jbGllbnRJZCk7XG4gICAgaW5pdC5tZXRob2QgPSBcIlBVVFwiO1xuICAgIGluaXQuYm9keSA9IEpTT04uc3RyaW5naWZ5KHsgaWNlT2ZmZXI6IHJlcS5pY2VPZmZlciB9KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke3Nlc3Npb25QYXRoKGJhc2VVcmwpfS8ke3JlcS5zZXNzaW9uSWR9L29mZmVyYCwgaW5pdCk7XG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA0MDApIHtcbiAgICAgICAgdGhyb3cgYGVycm9yIHNlbmRpbmcgb2ZmZXI6IGV4cGlyZWQgc2Vzc2lvbmA7XG4gICAgfVxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgIT0gMjAwKSB7XG4gICAgICAgIHRocm93IGBlcnJvciBzZW5kaW5nIG9mZmVyOiBbJHtyZXNwb25zZS5zdGF0dXN9XWA7XG4gICAgfVxuICAgIHJldHVybiBhd2FpdCByZXNwb25zZS5qc29uKCk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbm90aWZ5Q2xpZW50Q2FuZGlkYXRlcyhiYXNlVXJsLCByZXEpIHtcbiAgICBjb25zdCBpbml0ID0gcHJlcGFyZVJlcXVlc3RJbml0KHJlcS5jbGllbnRUb2tlbiwgcmVxLmNsaWVudElkKTtcbiAgICBpbml0Lm1ldGhvZCA9IFwiUE9TVFwiO1xuICAgIGluaXQuYm9keSA9IEpTT04uc3RyaW5naWZ5KHsgaWNlQ2FuZGlkYXRlczogcmVxLmljZUNhbmRpZGF0ZXMgfSk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtzZXNzaW9uUGF0aChiYXNlVXJsKX0vJHtyZXEuc2Vzc2lvbklkfS9jYW5kaWRhdGVgLCBpbml0KTtcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDQwMCkge1xuICAgICAgICB0aHJvdyBgZXJyb3Igbm90aWZ5aW5nIG5ldyBjYW5kaWRhdGVzOiBleHBpcmVkIHNlc3Npb25gO1xuICAgIH1cbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9IDIwMCkge1xuICAgICAgICB0aHJvdyBgZXJyb3Igbm90aWZ5aW5nIG5ldyBjYW5kaWRhdGVzOiBbJHtyZXNwb25zZS5zdGF0dXN9XWA7XG4gICAgfVxuICAgIHJldHVybiBhd2FpdCByZXNwb25zZS5qc29uKCk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QW5zd2VyKGJhc2VVcmwsIHJlcSkge1xuICAgIGNvbnN0IGluaXQgPSBwcmVwYXJlUmVxdWVzdEluaXQocmVxLmNsaWVudFRva2VuLCByZXEuY2xpZW50SWQpO1xuICAgIGluaXQubWV0aG9kID0gXCJHRVRcIjtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke3Nlc3Npb25QYXRoKGJhc2VVcmwpfS8ke3JlcS5zZXNzaW9uSWR9L2Fuc3dlcmAsIGluaXQpO1xuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNDA0KSB7XG4gICAgICAgIHJldHVybiBcInBlbmRpbmdcIjtcbiAgICB9XG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA0MDApIHtcbiAgICAgICAgdGhyb3cgXCJlcnJvciByZXRyaWV2aW5nIGFuc3dlcjogZXhwaXJlZCBzZXNzaW9uXCI7XG4gICAgfVxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgIT0gMjAwKSB7XG4gICAgICAgIHRocm93IGBlcnJvciByZXRyaWV2aW5nIGFuc3dlcjogWyR7cmVzcG9uc2Uuc3RhdHVzfV1gO1xuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNlcnZlckNhbmRpZGF0ZXMoYmFzZVVybCwgcmVxKSB7XG4gICAgY29uc3QgZGF0ZSA9IHJlcS5zaW5jZTtcbiAgICBjb25zdCBpbml0ID0gcHJlcGFyZVJlcXVlc3RJbml0KHJlcS5jbGllbnRUb2tlbiwgcmVxLmNsaWVudElkKTtcbiAgICBpbml0Lm1ldGhvZCA9IFwiR0VUXCI7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtzZXNzaW9uUGF0aChiYXNlVXJsKX0vJHtyZXEuc2Vzc2lvbklkfS9zZXJ2ZXJjYW5kaWRhdGVzP3NpbmNlPSR7cmVxLnNpbmNlfWAsIGluaXQpO1xuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNDAwKSB7XG4gICAgICAgIHRocm93IGBlcnJvciByZWNlaXZpbmcgbmV3IGNhbmRpZGF0ZXM6IGV4cGlyZWQgc2Vzc2lvbmA7XG4gICAgfVxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgIT0gMjAwKSB7XG4gICAgICAgIHRocm93IGBlcnJvciByZWNlaXZpbmcgbmV3IGNhbmRpZGF0ZXM6IFske3Jlc3BvbnNlLnN0YXR1c31dYDtcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVTZXNzaW9uKGJhc2VVcmwsIHJlcSkge1xuICAgIGNvbnN0IGluaXQgPSBwcmVwYXJlUmVxdWVzdEluaXQocmVxLmNsaWVudFRva2VuLCByZXEuY2xpZW50SWQpO1xuICAgIGluaXQubWV0aG9kID0gXCJERUxFVEVcIjtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke3Nlc3Npb25QYXRoKGJhc2VVcmwpfS8ke3JlcS5zZXNzaW9uSWR9YCwgaW5pdCk7XG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyAhPSAyMDApIHtcbiAgICAgICAgdGhyb3cgYGVycm9yIGRlbGV0aW5nIHNlc3Npb246IFske3Jlc3BvbnNlLnN0YXR1c31dYDtcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbn1cbmZ1bmN0aW9uIHByZXBhcmVSZXF1ZXN0SW5pdChjbGllbnRUb2tlbiwgY2xpZW50SWQpIHtcbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkF1dGhvcml6YXRpb25cIiwgYEJlYXJlciAke2NsaWVudFRva2VufWApO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiWC1QYXBlckN1dC1DbGllbnQtSWRcIiwgY2xpZW50SWQpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiVXNlci1BZ2VudFwiLCBcIlBhcGVyQ3V0TW9iaWxpdHlQcmludENsb3VkQ2xpZW50RVMvMS4wLjBcIik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICB9O1xufVxuZnVuY3Rpb24gc2Vzc2lvblBhdGgoYmFzZVVybCkge1xuICAgIHJldHVybiBgJHtiYXNlVXJsfS9jbGllbnQvdjEvc2Vzc2lvbmA7XG59XG4iLCJleHBvcnQgKiBmcm9tICcuL3Nlc3Npb24nO1xuIiwiY29uc3QgX0VYVEVOU0lPTl9JRCA9IEVYVEVOU0lPTl9JRDtcbmV4cG9ydCB7IF9FWFRFTlNJT05fSUQgYXMgRVhURU5TSU9OX0lEIH07XG5jb25zdCBfQVBQX0lEID0gQVBQX0lEO1xuZXhwb3J0IHsgX0FQUF9JRCBhcyBBUFBfSUQgfTtcbmNvbnN0IF9TRUxGX0lEID0gU0VMRl9JRDtcbmV4cG9ydCB7IF9TRUxGX0lEIGFzIFNFTEZfSUQgfTtcbmNvbnN0IF9WRVJTSU9OID0gVkVSU0lPTjtcbmV4cG9ydCB7IF9WRVJTSU9OIGFzIFZFUlNJT04gfTtcbihmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFFWFRFTlNJT05fSUQgfHwgIUFQUF9JRCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFeHRlbnNpb24vQXBwIElEIGlzIG5vdCBkZWZpbmVkIGluIHRoaXMgYnVpbGQgb2YgdGhlIGFwcC9leHRlbnNpb24nKTtcbiAgICB9XG59KSgpO1xuZXhwb3J0IGZ1bmN0aW9uIGlzRXh0ZW5zaW9uKCkge1xuICAgIHJldHVybiBTRUxGX0lEID09PSBFWFRFTlNJT05fSUQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNBcHAoKSB7XG4gICAgcmV0dXJuIFNFTEZfSUQgPT09IEFQUF9JRDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBHZXRDbGllbnRWZXJzaW9uSUQoKSB7XG4gICAgaWYgKGlzQXBwKCkpIHtcbiAgICAgICAgcmV0dXJuICdDaHJvbWVBcHAtJyArIFZFUlNJT047XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gJ0Nocm9tZUFwcEV4dC0nICsgVkVSU0lPTjtcbiAgICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gaXNvODYwMURhdGVUaW1lWm9uZShkKSB7XG4gICAgY29uc3Qgb2Zmc2V0ID0gLWQuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgICBjb25zdCBzaWduID0gb2Zmc2V0ID49IDAgPyAnKycgOiAnLSc7XG4gICAgcmV0dXJuIGQuZ2V0RnVsbFllYXIoKSArXG4gICAgICAgICctJyArIHBhZChkLmdldE1vbnRoKCkgKyAxKSArXG4gICAgICAgICctJyArIHBhZChkLmdldERhdGUoKSkgK1xuICAgICAgICAnVCcgKyBwYWQoZC5nZXRIb3VycygpKSArXG4gICAgICAgICc6JyArIHBhZChkLmdldE1pbnV0ZXMoKSkgK1xuICAgICAgICAnOicgKyBwYWQoZC5nZXRTZWNvbmRzKCkpICtcbiAgICAgICAgc2lnbiArIHBhZChvZmZzZXQgLyA2MCkgK1xuICAgICAgICAnOicgKyBwYWQob2Zmc2V0ICUgNjApO1xufVxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgICBjb25zdCBhYnMgPSBNYXRoLmZsb29yKE1hdGguYWJzKG4pKTtcbiAgICByZXR1cm4gKGFicyA8IDEwID8gJzAnIDogJycpICsgYWJzO1xufVxuIiwiaW1wb3J0IHsgaXNvODYwMURhdGVUaW1lWm9uZSB9IGZyb20gJy4uL3RpbWUnO1xubGV0IHJlbW90ZUxvZ2dpbmcgPSB1bmRlZmluZWQ7XG5pZiAoc2VsZi5jaHJvbWUgJiYgY2hyb21lLnN0b3JhZ2UgJiYgY2hyb21lLnN0b3JhZ2UubG9jYWwgIT09IHVuZGVmaW5lZCkge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgncmVtb3RlTG9nZ2luZ1VSTCcsIChkKSA9PiB7XG4gICAgICAgIGlmIChkICYmIGQucmVtb3RlTG9nZ2luZ1VSTCAmJiBkLnJlbW90ZUxvZ2dpbmdVUkwuc3RhcnRzV2l0aCgnaHR0cCcpKSB7XG4gICAgICAgICAgICBsb2coYFJlbW90ZSBsb2dnaW5nIGluaXRpYWxpc2VkOiAke0pTT04uc3RyaW5naWZ5KGQpfWApO1xuICAgICAgICAgICAgcmVtb3RlTG9nZ2luZyA9IGQ7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHJlbW90ZUxvZyhyZXF1ZXN0KSB7XG4gICAgaWYgKCFyZW1vdGVMb2dnaW5nIHx8ICFyZW1vdGVMb2dnaW5nLnJlbW90ZUxvZ2dpbmdVUkwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9LCBmdW5jdGlvbiAodGFicykge1xuICAgICAgICBpZiAodGFicy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXF1ZXN0LmJvZHkgPSBgdGFiOiR7dGFic1swXS5pZH0gLSAke3JlcXVlc3QuYm9keX1gO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVxdWVzdC5ib2R5ID0gYD8/PyAtICR7cmVxdWVzdC5ib2R5fWA7XG4gICAgICAgIH1cbiAgICAgICAgZmV0Y2goYCR7cmVtb3RlTG9nZ2luZy5yZW1vdGVMb2dnaW5nVVJMfWAsIHJlcXVlc3QpLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignZmFpbGVkIHRvIHJlbW90ZSBsb2cnLCBlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBpc1JlbW90ZUxvZ2dpbmcoKSB7XG4gICAgcmV0dXJuIHJlbW90ZUxvZ2dpbmcgIT09IHVuZGVmaW5lZDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBsb2coLi4uYXJncykge1xuICAgIGlmIChvZmZzY3JlZW5Db250ZXh0KCkpIHtcbiAgICAgICAgc2VuZFRvU2VydmljZVdvcmtlcignbG9nJywgYXJncyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBbaXNvODYwMURhdGVUaW1lWm9uZShuZXcgRGF0ZSgpKSwgLi4uYXJnc10pO1xuICAgIH1cbiAgICBpZiAoaXNSZW1vdGVMb2dnaW5nKCkpIHtcbiAgICAgICAgcmVtb3RlTG9nKHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoWydJTkZPJywgLi4uYXJnc10pLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZXJyb3IoLi4uYXJncykge1xuICAgIGlmIChvZmZzY3JlZW5Db250ZXh0KCkpIHtcbiAgICAgICAgc2VuZFRvU2VydmljZVdvcmtlcignZXJyb3InLCBhcmdzKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IuYXBwbHkoY29uc29sZSwgW2lzbzg2MDFEYXRlVGltZVpvbmUobmV3IERhdGUoKSksIC4uLmFyZ3NdKTtcbiAgICB9XG4gICAgaWYgKGlzUmVtb3RlTG9nZ2luZygpKSB7XG4gICAgICAgIHJlbW90ZUxvZyh7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KFsnRVJST1InLCAuLi5hcmdzXSksXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiB3YXJuKC4uLmFyZ3MpIHtcbiAgICBpZiAob2Zmc2NyZWVuQ29udGV4dCgpKSB7XG4gICAgICAgIHNlbmRUb1NlcnZpY2VXb3JrZXIoJ3dhcm4nLCBhcmdzKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2Fybi5hcHBseShjb25zb2xlLCBbaXNvODYwMURhdGVUaW1lWm9uZShuZXcgRGF0ZSgpKSwgLi4uYXJnc10pO1xuICAgIH1cbiAgICBpZiAoaXNSZW1vdGVMb2dnaW5nKCkpIHtcbiAgICAgICAgcmVtb3RlTG9nKHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoWydXQVJOJywgLi4uYXJnc10pLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5mdW5jdGlvbiBvZmZzY3JlZW5Db250ZXh0KCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLmdldE1hbmlmZXN0KCk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBzZW5kVG9TZXJ2aWNlV29ya2VyKHR5cGUsIGRhdGEpIHtcbiAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICAgIHR5cGUsXG4gICAgICAgIHRhcmdldDogJ2JhY2tncm91bmQnLFxuICAgICAgICBkYXRhLFxuICAgIH0pO1xufVxuIiwiZXhwb3J0ICogZnJvbSAnLi9sb2cnO1xuIiwiY29uc3QgREVGQVVMVF9DSFVOS19TSVpFID0gMTYzODQ7XG5jb25zdCBNSU5fQ0hVTktfU0laRSA9IDE7XG5leHBvcnQgZnVuY3Rpb24gY2h1bmtCbG9iKGJsb2IsIGNodW5rU2l6ZSkge1xuICAgIGlmIChjaHVua1NpemUgPCBNSU5fQ0hVTktfU0laRSkge1xuICAgICAgICBjaHVua1NpemUgPSBERUZBVUxUX0NIVU5LX1NJWkU7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICAgICAgICAgIGxldCBvZmZzZXQgPSAwO1xuICAgICAgICAgICAgbGV0IGVuZCA9IE1hdGgubWluKG9mZnNldCArIGNodW5rU2l6ZSwgYmxvYi5zaXplKTtcbiAgICAgICAgICAgIHdoaWxlIChvZmZzZXQgPCBibG9iLnNpemUpIHtcbiAgICAgICAgICAgICAgICB5aWVsZCBibG9iLnNsaWNlKG9mZnNldCwgZW5kKTtcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSBlbmQ7XG4gICAgICAgICAgICAgICAgZW5kID0gTWF0aC5taW4ob2Zmc2V0ICsgY2h1bmtTaXplLCBibG9iLnNpemUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9LFxuICAgIH07XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYmxvYlRvQXJyYXlCdWZmZXIoYmxvYikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgIHJlYWRlci5vbmxvYWRlbmQgPSAoKSA9PiByZXNvbHZlKHJlYWRlci5yZXN1bHQpO1xuICAgICAgICByZWFkZXIub25lcnJvciA9ICgpID0+IHJlamVjdChyZWFkZXIuZXJyb3IpO1xuICAgICAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYik7XG4gICAgfSk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYmxvYlRvU3RyaW5nKGJsb2IpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByZWFkZXIub25sb2FkZW5kID0gKCkgPT4gcmVzb2x2ZShyZWFkZXIucmVzdWx0KTtcbiAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSAoKSA9PiByZWplY3QocmVhZGVyLmVycm9yKTtcbiAgICAgICAgcmVhZGVyLnJlYWRBc0JpbmFyeVN0cmluZyhibG9iKTtcbiAgICB9KTtcbn1cbiIsImV4cG9ydCBjbGFzcyBNZXNzYWdlIHtcbiAgICBjb25zdHJ1Y3Rvcihldikge1xuICAgICAgICB0aGlzLmV2ID0gZXY7XG4gICAgfVxuICAgIHN0cmluZ0RhdGEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2LmRhdGE7XG4gICAgfVxuICAgIGRhdGEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2LmRhdGE7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgbG9nLCBlcnJvciB9IGZyb20gJy4uL2xvZyc7XG5pbXBvcnQgeyBibG9iVG9BcnJheUJ1ZmZlciwgY2h1bmtCbG9iIH0gZnJvbSAnLi9ibG9iJztcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuL21lc3NhZ2UnO1xuZXhwb3J0IGNsYXNzIERhdGFDaGFubmVsIHtcbiAgICBjb25zdHJ1Y3RvcihzZXJ2ZXJJZCwgZGF0YUNoYW5uZWwsIGdldENodW5rU2l6ZSkge1xuICAgICAgICB0aGlzLmRhdGFDaGFubmVsID0gZGF0YUNoYW5uZWw7XG4gICAgICAgIHRoaXMuZ2V0Q2h1bmtTaXplID0gZ2V0Q2h1bmtTaXplO1xuICAgICAgICB0aGlzLmxhYmVsID0gYCR7c2VydmVySWR9LiR7ZGF0YUNoYW5uZWwubGFiZWx9YDtcbiAgICB9XG4gICAgYXN5bmMgc2VuZEJsb2IoYikge1xuICAgICAgICBjb25zdCBjaHVua1NpemUgPSB0aGlzLmdldENodW5rU2l6ZSgpO1xuICAgICAgICBjb25zdCB0aHJlc2hvbGRMb3cgPSBjaHVua1NpemU7XG4gICAgICAgIGNvbnN0IHRocmVzaG9sZEhpZ2ggPSBNYXRoLm1heChjaHVua1NpemUgKiA4LCAxMDI0ICogMTAyNCk7XG4gICAgICAgIGNvbnN0IGNodW5rZWQgPSBjaHVua0Jsb2IoYiwgY2h1bmtTaXplKVtTeW1ib2wuaXRlcmF0b3JdKCk7XG4gICAgICAgIGNvbnN0IG51bUNodW5rcyA9IE1hdGguY2VpbChiLnNpemUgLyBjaHVua1NpemUpO1xuICAgICAgICBjb25zdCBsb2dFdmVyeU5DaHVua3MgPSBNYXRoLmZsb29yKCgxMDI0ICogMTAyNCkgLyBjaHVua1NpemUpO1xuICAgICAgICBsb2coYFske3RoaXMubGFiZWx9XSBzZW5kQmxvYjogc2l6ZT0ke2Iuc2l6ZX0gYnl0ZXMsIG51bUNodW5rcz0ke251bUNodW5rc31gKTtcbiAgICAgICAgdGhpcy5kYXRhQ2hhbm5lbC5idWZmZXJlZEFtb3VudExvd1RocmVzaG9sZCA9IHRocmVzaG9sZExvdztcbiAgICAgICAgY29uc3QgZGVmZXJyZWQgPSB7XG4gICAgICAgICAgICByZXNvbHZlZDogZmFsc2UsXG4gICAgICAgIH07XG4gICAgICAgIGRlZmVycmVkLnByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgY2h1bmtJZHggPSAwO1xuICAgICAgICBsZXQgZmlsbEluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgZmlsbFRvQ2FwYWNpdHkgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBmaWxsSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRhdGFDaGFubmVsLmJ1ZmZlcmVkQW1vdW50ID49IHRocmVzaG9sZEhpZ2gpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsbEluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB7IHZhbHVlLCBkb25lIH0gPSBjaHVua2VkLm5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNodW5rSWR4ID4gMCAmJiBjaHVua0lkeCAlIGxvZ0V2ZXJ5TkNodW5rcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsb2coYFRyYW5zZmVycmVkICR7Y2h1bmtJZHggKyAxfSBvdXQgb2YgJHtudW1DaHVua3N9IGNodW5rcy4gW2AsICdsYWJlbD0nLCB0aGlzLmxhYmVsLCAnXScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBidWYgPSBhd2FpdCBibG9iVG9BcnJheUJ1ZmZlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhQ2hhbm5lbC5zZW5kKGJ1Zik7XG4gICAgICAgICAgICAgICAgY2h1bmtJZHgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kYXRhQ2hhbm5lbC5vbmJ1ZmZlcmVkYW1vdW50bG93ID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGRlZmVycmVkLnJlc29sdmVkIHx8IGZpbGxJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXdhaXQgZmlsbFRvQ2FwYWNpdHkoKTtcbiAgICAgICAgfTtcbiAgICAgICAgbG9nKGBbJHt0aGlzLmxhYmVsfV0gYCArICdTdGFydGluZyBkYXRhIGNoYW5uZWwgdHJhbnNmZXIuIFsnLCAnc2l6ZT0nLCBiLnNpemUsICdjaHVua1NpemU9JywgY2h1bmtTaXplLCAnY2h1bmtzPScsIG51bUNodW5rcywgJ2J1ZmZlckhpZ2g9JywgdGhyZXNob2xkSGlnaCwgJ10nKTtcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBEYXRlLm5vdygpO1xuICAgICAgICBhd2FpdCBmaWxsVG9DYXBhY2l0eSgpO1xuICAgICAgICBhd2FpdCBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB0aGlzLmRhdGFDaGFubmVsLm9uYnVmZmVyZWRhbW91bnRsb3cgPSB1bmRlZmluZWQ7XG4gICAgICAgIGxvZygnRGF0YSBjaGFubmVsIHRyYW5zZmVyIGNvbXBsZXRlLiBbJywgJ2xhYmVsPScsIHRoaXMubGFiZWwsICdkdXJhdGlvbj0nLCBgJHtEYXRlLm5vdygpIC0gc3RhcnR9bXNgLCAnXScpO1xuICAgIH1cbiAgICBzZW5kU3RyaW5nKHMpIHtcbiAgICAgICAgbG9nKGBbJHt0aGlzLmxhYmVsfV0gc2VuZFN0cmluZzogc2l6ZT0ke3MubGVuZ3RofSBieXRlc2ApO1xuICAgICAgICBpZiAodGhpcy5pc0Nsb3NlZCgpKSB7XG4gICAgICAgICAgICBlcnJvcihgQ2Fubm90IHNlbmQgbWVzc2FnZSBvbiBjbG9zZWQgY2hhbm5lbCAnJHt0aGlzLmxhYmVsfWApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGF0YUNoYW5uZWwuc2VuZChzKTtcbiAgICB9XG4gICAgaXNDbG9zZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFDaGFubmVsLnJlYWR5U3RhdGUgPT09ICdjbG9zZWQnO1xuICAgIH1cbiAgICBjbG9zZSgpIHtcbiAgICAgICAgdGhpcy5kYXRhQ2hhbm5lbC5jbG9zZSgpO1xuICAgIH1cbiAgICBvbk9wZW4oZikge1xuICAgICAgICB0aGlzLmRhdGFDaGFubmVsLm9ub3BlbiA9IChldikgPT4ge1xuICAgICAgICAgICAgZih0aGlzLCBldik7XG4gICAgICAgIH07XG4gICAgfVxuICAgIG9uTWVzc2FnZShmKSB7XG4gICAgICAgIHRoaXMuZGF0YUNoYW5uZWwub25tZXNzYWdlID0gKGV2KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtc2cgPSBuZXcgTWVzc2FnZShldik7XG4gICAgICAgICAgICBmKHRoaXMsIG1zZyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGNsZWFyT25NZXNzYWdlKCkge1xuICAgICAgICB0aGlzLmRhdGFDaGFubmVsLm9ubWVzc2FnZSA9IG51bGw7XG4gICAgfVxuICAgIG9uQ2xvc2UoZikge1xuICAgICAgICB0aGlzLmRhdGFDaGFubmVsLm9uY2xvc2UgPSAoZXYpID0+IHtcbiAgICAgICAgICAgIGYodGhpcywgZXYpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBvbkVycm9yKGYpIHtcbiAgICAgICAgdGhpcy5kYXRhQ2hhbm5lbC5vbmVycm9yID0gKGV2KSA9PiB7XG4gICAgICAgICAgICBmKHRoaXMsIGV2KTtcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZGVjb2RlU2Vzc2lvbkRlc2NyaXB0aW9uKG9mZmVyKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYXRvYihvZmZlcikpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZVNlc3Npb25EZXNjcmlwdGlvbihzZCkge1xuICAgIHJldHVybiBidG9hKEpTT04uc3RyaW5naWZ5KHNkKSk7XG59XG4iLCJpbXBvcnQgeyBsb2cgfSBmcm9tICcuLi9sb2cnO1xuaW1wb3J0IHsgRGF0YUNoYW5uZWwgfSBmcm9tICcuL2RhdGFjaGFubmVsJztcbmltcG9ydCB7IGRlY29kZVNlc3Npb25EZXNjcmlwdGlvbiwgZW5jb2RlU2Vzc2lvbkRlc2NyaXB0aW9uIH0gZnJvbSAnLi9zaWduYWwnO1xuY29uc3QgTUlOX0NIVU5LX1NJWkUgPSAxNiAqIDEwMjQ7XG5jb25zdCBNQVhfQ0hVTktfU0laRSA9IDI1NiAqIDEwMjQ7XG5leHBvcnQgY2xhc3MgUGVlciB7XG4gICAgY29uc3RydWN0b3Ioc2VydmVySWQsIGljZUNvbmZpZykge1xuICAgICAgICB0aGlzLmRhdGFDaGFubmVscyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uU3RhdGVDaGFuZ2VDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdGhpcy5zZXJ2ZXJJZCA9IHNlcnZlcklkO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oY3JlYXRlUlRDQ29uZmlnKGljZUNvbmZpZykpO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24ub25jb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSAoZXYpID0+IHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmNvbm5lY3Rpb25TdGF0ZUNoYW5nZUNhbGxiYWNrcykge1xuICAgICAgICAgICAgICAgIGYodGhpcywgZXYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBnZXRTZXJ2ZXJJZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VydmVySWQ7XG4gICAgfVxuICAgIGNyZWF0ZURhdGFDaGFubmVsKGxhYmVsKSB7XG4gICAgICAgIGNvbnN0IGRjID0gdGhpcy5jb25uZWN0aW9uLmNyZWF0ZURhdGFDaGFubmVsKGxhYmVsKTtcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IG5ldyBEYXRhQ2hhbm5lbCh0aGlzLnNlcnZlcklkLCBkYywgdGhpcy5nZXRDaHVua1NpemUuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuZGF0YUNoYW5uZWxzLnNldChsYWJlbCwgY2hhbm5lbCk7XG4gICAgICAgIHJldHVybiBjaGFubmVsO1xuICAgIH1cbiAgICBnZXRDaHVua1NpemUoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb24uc2N0cCkge1xuICAgICAgICAgICAgbG9nKGBbJHt0aGlzLmdldFNlcnZlcklkKCl9XWAsIGBVc2luZyBTQ1RQIHNwZWNpZmllZCBjaHVuayBzaXplIHZhbHVlOiAke3RoaXMuY29ubmVjdGlvbi5zY3RwLm1heE1lc3NhZ2VTaXplfSBieXRlc2ApO1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgubWluKHRoaXMuY29ubmVjdGlvbi5zY3RwLm1heE1lc3NhZ2VTaXplIC0gMSwgTUFYX0NIVU5LX1NJWkUpO1xuICAgICAgICB9XG4gICAgICAgIGxvZyhgWyR7dGhpcy5nZXRTZXJ2ZXJJZCgpfV0gVXNpbmcgZmFsbC1iYWNrIGNodW5rIHNpemUgdmFsdWU6ICR7TUlOX0NIVU5LX1NJWkV9IGJ5dGVzYCk7XG4gICAgICAgIHJldHVybiBNSU5fQ0hVTktfU0laRTtcbiAgICB9XG4gICAgb25EYXRhQ2hhbm5lbChmKSB7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5vbmRhdGFjaGFubmVsID0gKGV2KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkYyA9IG5ldyBEYXRhQ2hhbm5lbCh0aGlzLnNlcnZlcklkLCBldi5jaGFubmVsLCB0aGlzLmdldENodW5rU2l6ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YUNoYW5uZWxzLnNldChkYy5sYWJlbCwgZGMpO1xuICAgICAgICAgICAgZih0aGlzLCBkYyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIG9uTmVnb3RpYXRpb25OZWVkZWQoZikge1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24ub25uZWdvdGlhdGlvbm5lZWRlZCA9IChldikgPT4ge1xuICAgICAgICAgICAgZih0aGlzLCBldik7XG4gICAgICAgIH07XG4gICAgfVxuICAgIG9uSUNFQ2FuZGlkYXRlKGYpIHtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLm9uaWNlY2FuZGlkYXRlID0gKGV2KSA9PiB7XG4gICAgICAgICAgICBmKHRoaXMsIGV2KTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaXNQZWVyQ29ubmVjdGVkKCkge1xuICAgICAgICBsb2coYFske3RoaXMuc2VydmVySWR9XSBjaGVja2luZyBwZWVyIGNvbm5lY3Rpb24gc3RhdGU6YCwgdGhpcy5jb25uZWN0aW9uLmljZUNvbm5lY3Rpb25TdGF0ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uY29ubmVjdGlvblN0YXRlID09PSAnY29ubmVjdGVkJztcbiAgICB9XG4gICAgY2xvc2UoKSB7XG4gICAgICAgIGxvZyhgWyR7dGhpcy5zZXJ2ZXJJZH1dIGNsb3NpbmcgcGVlciBjb25uZWN0aW9uLi4uYCk7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5jbG9zZSgpO1xuICAgIH1cbiAgICBhc3luYyBjcmVhdGVBbnN3ZXIob2ZmZXIpIHtcbiAgICAgICAgY29uc3Qgb2ZmZXJTZXNzaW9uRGVzY3JpcHRpb24gPSBkZWNvZGVTZXNzaW9uRGVzY3JpcHRpb24ob2ZmZXIpO1xuICAgICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uc2V0UmVtb3RlRGVzY3JpcHRpb24ob2ZmZXJTZXNzaW9uRGVzY3JpcHRpb24pO1xuICAgICAgICBjb25zdCBhbnN3ZXIgPSBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uY3JlYXRlQW5zd2VyKCk7XG4gICAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5zZXRMb2NhbERlc2NyaXB0aW9uKGFuc3dlcik7XG4gICAgICAgIHJldHVybiBlbmNvZGVTZXNzaW9uRGVzY3JpcHRpb24oYW5zd2VyKTtcbiAgICB9XG4gICAgb25Db25uZWN0aW9uU3RhdGVDaGFuZ2UoZikge1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25TdGF0ZUNoYW5nZUNhbGxiYWNrcy5wdXNoKGYpO1xuICAgIH1cbiAgICBhc3luYyBvbklDRUNvbm5lY3Rpb25TdGF0ZUNoYW5nZShmKSB7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5vbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSA9IChldikgPT4ge1xuICAgICAgICAgICAgZih0aGlzLCBldik7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGdldENvbm5lY3Rpb25TdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5jb25uZWN0aW9uU3RhdGU7XG4gICAgfVxuICAgIGdldElDRUNvbm5lY3Rpb25TdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5pY2VDb25uZWN0aW9uU3RhdGU7XG4gICAgfVxuICAgIGFzeW5jIGNyZWF0ZU9mZmVyKCkge1xuICAgICAgICBjb25zdCBvZmZlciA9IGF3YWl0IHRoaXMuY29ubmVjdGlvbi5jcmVhdGVPZmZlcigpO1xuICAgICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uc2V0TG9jYWxEZXNjcmlwdGlvbihvZmZlcik7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuY29ubmVjdGlvbi5sb2NhbERlc2NyaXB0aW9uO1xuICAgICAgICByZXR1cm4gZW5jb2RlU2Vzc2lvbkRlc2NyaXB0aW9uKHJlc3VsdCk7XG4gICAgfVxuICAgIGFzeW5jIHJlZ2lzdGVyQW5zd2VyKGFuc3dlcikge1xuICAgICAgICBjb25zdCBhbnN3ZXJTZXNzaW9uRGVzY3JpcHRpb24gPSBkZWNvZGVTZXNzaW9uRGVzY3JpcHRpb24oYW5zd2VyKTtcbiAgICAgICAgYXdhaXQgdGhpcy5jb25uZWN0aW9uLnNldFJlbW90ZURlc2NyaXB0aW9uKGFuc3dlclNlc3Npb25EZXNjcmlwdGlvbik7XG4gICAgfVxuICAgIGFkZEljZUNhbmRpZGF0ZShjYW5kaWRhdGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5hZGRJY2VDYW5kaWRhdGUoY2FuZGlkYXRlKTtcbiAgICB9XG4gICAgZ2V0RGF0YUNoYW5uZWwobGFiZWwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YUNoYW5uZWxzLmdldChsYWJlbCk7XG4gICAgfVxuICAgIGdldFNlbGVjdGVkQ2FuZGlkYXRlUGFpcigpIHtcbiAgICAgICAgY29uc3QgaWNlVHJhbnNwb3J0ID0gdGhpcy5nZXRJQ0VUcmFuc3BvcnQoKTtcbiAgICAgICAgaWYgKCFpY2VUcmFuc3BvcnQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpY2VUcmFuc3BvcnQuZ2V0U2VsZWN0ZWRDYW5kaWRhdGVQYWlyKCk7XG4gICAgfVxuICAgIGdldElDRVRyYW5zcG9ydCgpIHtcbiAgICAgICAgY29uc3Qgc2N0cCA9IHRoaXMuY29ubmVjdGlvbi5zY3RwO1xuICAgICAgICBpZiAoIXNjdHApIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzY3RwLnRyYW5zcG9ydC5pY2VUcmFuc3BvcnQ7XG4gICAgfVxuICAgIHdhaXRGb3JMaXZlQ29ubmVjdGlvbih3YWl0Rm9yKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHJlaihgdGltZW91dCB3YWl0aW5nIGZvciBwZWVyIGNvbm5lY3Rpb24gJHt0aGlzLnNlcnZlcklkfSwgc3RhdGU6YCArIHRoaXMuZ2V0Q29ubmVjdGlvblN0YXRlKCkpLCB3YWl0Rm9yKTtcbiAgICAgICAgICAgIHRoaXMub25Db25uZWN0aW9uU3RhdGVDaGFuZ2UoKGN0eCwgXykgPT4ge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoY3R4LmdldENvbm5lY3Rpb25TdGF0ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Nsb3NlZCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnY29ubmVjdGVkJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Nvbm5lY3RpbmcnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Rpc2Nvbm5lY3RlZCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZmFpbGVkJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlaignZmFpbGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbmV3JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5mdW5jdGlvbiBjcmVhdGVSVENDb25maWcoaWNlQ29uZmlnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaWNlU2VydmVyczogaWNlQ29uZmlnLnNlcnZlcnMsXG4gICAgICAgIGljZVRyYW5zcG9ydFBvbGljeTogJ2FsbCcsXG4gICAgfTtcbn1cbiIsImV4cG9ydCAqIGZyb20gJy4vYmxvYic7XG5leHBvcnQgKiBmcm9tICcuL2RhdGFjaGFubmVsJztcbmV4cG9ydCAqIGZyb20gJy4vbWVzc2FnZSc7XG5leHBvcnQgKiBmcm9tICcuL3BlZXInO1xuZXhwb3J0ICogZnJvbSAnLi9zaWduYWwnO1xuIiwiaW1wb3J0IHsgZXJyb3IsIGxvZyB9IGZyb20gJy4uL2xvZyc7XG5pbXBvcnQgeyBDQVBBQklMSVRJRVNfQ0hBTk5FTF9MQUJFTCwgSk9CX0NIQU5ORUxfTEFCRUwsIEpPQl9ERVRBSUxTX0xBQkVMLCBQUklOVEVSX0NIQU5ORUxfTEFCRUwsIFNFUlZFUl9JTkZPX0xBQkVMLCBUT0tFTl9DSEFOTkVMX0xBQkVMLCB9IGZyb20gJy4vY2xpZW50YnVpbGRlcic7XG5leHBvcnQgY2xhc3MgTW9iUlRDQ2xpZW50IHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgcGVlciwgdGltZW91dCwgY2h1bmtTaXplLCB2ZXJzaW9uKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5wZWVyID0gcGVlcjtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gdGltZW91dDtcbiAgICAgICAgdGhpcy5jaHVua1NpemUgPSBjaHVua1NpemU7XG4gICAgICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb247XG4gICAgICAgIHRoaXMuc2hvcnRUaW1lb3V0ID0gdGltZW91dCAvIDQ7XG4gICAgICAgIHRoaXMuc2VydmVySWQgPSBwZWVyLmdldFNlcnZlcklkKCk7XG4gICAgfVxuICAgIGdldElEKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pZDtcbiAgICB9XG4gICAgYXN5bmMgZ2V0U2VydmVySW5mbygpIHtcbiAgICAgICAgbG9nKGBbJHsodGhpcy5zZXJ2ZXJJZCl9XSBGZXRjaGluZyBzZXJ2ZXIgaW5mby4uLmApO1xuICAgICAgICBjb25zdCBkYyA9IHRoaXMuZ2V0U2VydmVySW5mb0NoYW5uZWwoKTtcbiAgICAgICAgZGMuc2VuZFN0cmluZygnICcpO1xuICAgICAgICByZXR1cm4gdGhpcy5yZWFkSnNvblJlc3BvbnNlRnJvbUNoYW5uZWwoZGMsIHRoaXMuc2hvcnRUaW1lb3V0KTtcbiAgICB9XG4gICAgYXN5bmMgc2VuZFByaW50Sm9iRGV0YWlscyhwcmludFRva2VuLCBwcmludGVyVXJsLCBwYXJhbXMsIGZpbGVTaXplKSB7XG4gICAgICAgIGxvZyhgWyR7KHRoaXMuc2VydmVySWQpfV1gLCBgU3VibWl0dGluZyBwcmludCBqb2IgZGV0YWlsczogcHJpbnRlclVybD0ke3ByaW50ZXJVcmx9LCBmaWxlU2l6ZT0ke2ZpbGVTaXplfSBieXRlcy5gKTtcbiAgICAgICAgY29uc3QgbXNnID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgY2xpZW50VmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgICAgICAgICAgcHJpbnRUb2tlbixcbiAgICAgICAgICAgIHByaW50ZXJVcmwsXG4gICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICBmaWxlU2l6ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGRjID0gdGhpcy5nZXRKb2JEZXRhaWxzQ2hhbm5lbCgpO1xuICAgICAgICBkYy5zZW5kU3RyaW5nKG1zZyk7XG4gICAgICAgIGxldCBidWY7XG4gICAgICAgIGxldCBkYXRhO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYnVmID0gYXdhaXQgdGhpcy5yZWFkQ2h1bmtlZFJlc3BvbnNlKGRjKTtcbiAgICAgICAgICAgIGRhdGEgPSBieXRlQXJyYXlUb1N0cmluZyhidWYpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBlcnJvcihgWyR7KHRoaXMuc2VydmVySWQpfV0gZXJyb3IgcGFyc2luZyBwcmludCBqb2IgZGV0YWlscyByZXNwb25zZS5gLCBlKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKE1vYlJUQ0NsaWVudC5pc0Vycm9yKGRhdGEpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIGFzeW5jIHNlbmRQcmludEpvYihmaWxlKSB7XG4gICAgICAgIGlmIChmaWxlLnNpemUgPT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIGZpbGUgc2l6ZTogWyR7ZmlsZS5zaXplfV1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5nZXRKb2JDaGFubmVsKCkuc2VuZEJsb2IoZmlsZSk7XG4gICAgfVxuICAgIGlzUmVhZHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBlZXIgJiYgdGhpcy5wZWVyLmlzUGVlckNvbm5lY3RlZCgpO1xuICAgIH1cbiAgICBjbG9zZSgpIHtcbiAgICAgICAgdGhpcy5wZWVyLmNsb3NlKCk7XG4gICAgfVxuICAgIGFzeW5jIGdldFByaW50VG9rZW4oc2hhcmVUb2tlbikge1xuICAgICAgICBsb2coYFskeyh0aGlzLnNlcnZlcklkKX1dIEV4Y2hhbmdpbmcgc2hhcmUgdG9rZW4gZm9yIHByaW50IHRva2VuLmApO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGMgPSB0aGlzLmdldFRva2VuQ2hhbm5lbCgpO1xuICAgICAgICAgICAgZGMuc2VuZFN0cmluZyhzaGFyZVRva2VuKTtcbiAgICAgICAgICAgIGxldCBidWY7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGJ1ZiA9IGF3YWl0IHRoaXMucmVhZENodW5rZWRSZXNwb25zZShkYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgcHJpbnRUb2tlbjtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcHJpbnRUb2tlbiA9IGJ5dGVBcnJheVRvU3RyaW5nKGJ1Zik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGVycm9yKGBbJHsodGhpcy5zZXJ2ZXJJZCl9XSBlcnJvciBwYXJzaW5nIGF1dGgtdG9rZW4gcmVzcG9uc2UuYCwgZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChNb2JSVENDbGllbnQuaXNFcnJvcihwcmludFRva2VuKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoYGZhaWxlZCB0byBleGNoYW5nZSBzaGFyZVRva2VuIGZvciBwcmludFRva2VuOiAke3ByaW50VG9rZW59YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShwcmludFRva2VuKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlYWRDaHVua2VkUmVzcG9uc2UoZGMsIGNodW5rVGltZW91dCA9IHRoaXMudGltZW91dCkge1xuICAgICAgICBsb2coYFske2RjLmxhYmVsfV0gcmVhZENodW5rZWRSZXNwb25zZSwgIGNodW5rVGltZW91dD0ke2NodW5rVGltZW91dH1tc2ApO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IGNodW5rSWR4ID0gMDtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICAgICAgY29uc3QgYnVmID0gW107XG4gICAgICAgICAgICBsZXQgb25UaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZGMuY2xlYXJPbk1lc3NhZ2UoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KGAke2NodW5rVGltZW91dH1tcyB0aW1lb3V0IHJlYWNoZWQgd2FpdGluZyBmb3IgdGhlIGZpcnN0IHJlc3BvbnNlLmApO1xuICAgICAgICAgICAgfSwgY2h1bmtUaW1lb3V0KTtcbiAgICAgICAgICAgIGxldCBsb2dFdmVyeU5DaHVua3MgPSAwO1xuICAgICAgICAgICAgZGMub25NZXNzYWdlKChjdHgsIG1zZykgPT4ge1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChvblRpbWVvdXQpO1xuICAgICAgICAgICAgICAgIG9uVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjdHguY2xlYXJPbk1lc3NhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChgJHt0aGlzLnRpbWVvdXR9bXMgdGltZW91dCByZWFjaGVkIHdhaXRpbmcgZm9yIGRhdGEgY2h1bms6IFske2NodW5rSWR4fV1gKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnRpbWVvdXQpO1xuICAgICAgICAgICAgICAgIGNodW5rSWR4Kys7XG4gICAgICAgICAgICAgICAgaWYgKG1zZy5zdHJpbmdEYXRhKCkgPT09ICdGSU5JU0gnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChvblRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICBjdHguY2xlYXJPbk1lc3NhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ1Zi5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUobmV3IFVpbnQ4QXJyYXkoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYnVmLnJlZHVjZSgocHJldiwgbmV4dCkgPT4gY29uY2F0Qnl0ZUFycmF5cyhwcmV2LCBuZXh0KSk7XG4gICAgICAgICAgICAgICAgICAgIGxvZyhgWyR7ZGMubGFiZWx9XWAsIGBGaW5pc2hlZCByZWNlaXZpbmcgJHsocmVzdWx0Lmxlbmd0aCAvIDEwMjQpLnRvRml4ZWQoMil9S2lCLGAsIGBjaHVua3MgcmVjZWl2ZWQ6IFske2NodW5rSWR4fV1gLCBgdG9vazogJHsocGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydFRpbWUpLnRvRml4ZWQoMil9IG1zYCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGNodW5rID0gbXNnLmRhdGEoKTtcbiAgICAgICAgICAgICAgICBidWYucHVzaChuZXcgVWludDhBcnJheShjaHVuaykpO1xuICAgICAgICAgICAgICAgIGlmIChsb2dFdmVyeU5DaHVua3MgPT09IDAgJiYgY2h1bmsuYnl0ZUxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nRXZlcnlOQ2h1bmtzID0gTWF0aC5mbG9vcigoMTAyNCAqIDEwMjQpIC8gY2h1bmsuYnl0ZUxlbmd0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxvZ0V2ZXJ5TkNodW5rcyA+IDAgJiYgY2h1bmtJZHggPiAwICYmIGNodW5rSWR4ICUgbG9nRXZlcnlOQ2h1bmtzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZyhgWyR7ZGMubGFiZWx9XTogYCwgYFJlY2VpdmVkICR7Y2h1bmtJZHh9IGNodW5rcyxgLCBgJHsoY2h1bmsuYnl0ZUxlbmd0aCAqIGNodW5rSWR4IC8gMTAyNCkudG9GaXhlZCgyKX1LaUIgLmApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYXN5bmMgZ2V0UHJpbnRlcnMocHJpbnRUb2tlbikge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGMgPSB0aGlzLmdldFByaW50ZXJDaGFubmVsKCk7XG4gICAgICAgICAgICBkYy5zZW5kU3RyaW5nKHByaW50VG9rZW4pO1xuICAgICAgICAgICAgbGV0IHByaW50ZXJzO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBwcmludGVycyA9IGF3YWl0IHRoaXMucmVhZEpzb25SZXNwb25zZUZyb21DaGFubmVsKGRjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IoYFskeyh0aGlzLnNlcnZlcklkKX1dIGVycm9yIHJlYWRpbmcgcHJpbnRlciBpbmZvIHJlc3BvbnNlLmAsIGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmludGVycy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgICAgIHAuaWQgPSBgaHR0cDovL2xvY2FsaG9zdDo5MTYzL3ByaW50ZXJzLyR7ZW5jb2RlVVJJQ29tcG9uZW50KHAubmFtZSl9YDtcbiAgICAgICAgICAgICAgICBwLm5hbWUgPSBgJHtwLm5hbWV9IC0gWyR7cC5kZXNjcmlwdGlvbn1dYDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUocHJpbnRlcnMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYXN5bmMgZ2V0Q2FwYWJpbGl0aWVzKHByaW50ZXJJZCkge1xuICAgICAgICBjb25zdCBkYyA9IHRoaXMuZ2V0Q2FwYWJpbGl0aWVzQ2hhbm5lbCgpO1xuICAgICAgICBkYy5zZW5kU3RyaW5nKHByaW50ZXJJZCk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlYWRKc29uUmVzcG9uc2VGcm9tQ2hhbm5lbChkYyk7XG4gICAgfVxuICAgIGFzeW5jIHJlYWRKc29uUmVzcG9uc2VGcm9tQ2hhbm5lbChkYywgdGltZW91dCA9IHRoaXMudGltZW91dCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFnID0gYCR7dGhpcy5zZXJ2ZXJJZH0uJHtkYy5sYWJlbH1gO1xuICAgICAgICAgICAgbGV0IGJ1ZjtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYnVmID0gYXdhaXQgdGhpcy5yZWFkQ2h1bmtlZFJlc3BvbnNlKGRjLCB0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYnl0ZUFycmF5VG9TdHJpbmcoYnVmKTtcbiAgICAgICAgICAgICAgICBpZiAoTW9iUlRDQ2xpZW50LmlzRXJyb3IoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IoYFske3RhZ31dOiBTZXJ2ZXIgcmVzcG9uZGVkIHdpdGggZXJyb3I6ICR7ZGF0YX1gKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChgU2VydmVyIHJlc3BvbmRlZCB3aXRoIGVycm9yIG9uOiAke2RjLmxhYmVsfWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UoZGF0YSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcihgWyR7dGFnfV06IGVycm9yIHBhcnNpbmcgSlNPTiByZXNwb25zZTogYCwgZSwgYnVmKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGVycm9yKGBbJHt0YWd9XTogZXJyb3IgcmVhZGluZyByZXNwb25zZTogYCwgZSwgYnVmKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0U2VydmVySW5mb0NoYW5uZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBlZXIuZ2V0RGF0YUNoYW5uZWwoU0VSVkVSX0lORk9fTEFCRUwpO1xuICAgIH1cbiAgICBnZXRQcmludGVyQ2hhbm5lbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGVlci5nZXREYXRhQ2hhbm5lbChQUklOVEVSX0NIQU5ORUxfTEFCRUwpO1xuICAgIH1cbiAgICBnZXRKb2JDaGFubmVsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wZWVyLmdldERhdGFDaGFubmVsKEpPQl9DSEFOTkVMX0xBQkVMKTtcbiAgICB9XG4gICAgZ2V0VG9rZW5DaGFubmVsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wZWVyLmdldERhdGFDaGFubmVsKFRPS0VOX0NIQU5ORUxfTEFCRUwpO1xuICAgIH1cbiAgICBnZXRDYXBhYmlsaXRpZXNDaGFubmVsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wZWVyLmdldERhdGFDaGFubmVsKENBUEFCSUxJVElFU19DSEFOTkVMX0xBQkVMKTtcbiAgICB9XG4gICAgZ2V0Sm9iRGV0YWlsc0NoYW5uZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBlZXIuZ2V0RGF0YUNoYW5uZWwoSk9CX0RFVEFJTFNfTEFCRUwpO1xuICAgIH1cbiAgICBzdGF0aWMgaXNFcnJvcihkYXRhKSB7XG4gICAgICAgIHJldHVybiBkYXRhLnN0YXJ0c1dpdGgoJ0VSUk9SOicpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBieXRlQXJyYXlUb1N0cmluZyhidWYpIHtcbiAgICBjb25zdCB1dGY4ZGVjb2RlID0gbmV3IFRleHREZWNvZGVyKCk7XG4gICAgcmV0dXJuIHV0ZjhkZWNvZGUuZGVjb2RlKGJ1Zik7XG59XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0Qnl0ZUFycmF5cyhoZWFkLCB0YWlsKSB7XG4gICAgY29uc3QgY29uY2F0UmVzdWx0ID0gbmV3IFVpbnQ4QXJyYXkoaGVhZC5sZW5ndGggKyB0YWlsLmxlbmd0aCk7XG4gICAgY29uY2F0UmVzdWx0LnNldChoZWFkKTtcbiAgICBjb25jYXRSZXN1bHQuc2V0KHRhaWwsIGhlYWQubGVuZ3RoKTtcbiAgICByZXR1cm4gY29uY2F0UmVzdWx0O1xufVxuIiwiaW1wb3J0IHsgY3JlYXRlT2ZmZXIsIGNyZWF0ZVNlc3Npb24sIGRlbGV0ZVNlc3Npb24sIGdldEFuc3dlciwgZ2V0U2VydmVyQ2FuZGlkYXRlcywgbm90aWZ5Q2xpZW50Q2FuZGlkYXRlcywgfSBmcm9tICdwYy1tb2JpbGl0eS1jbG91ZCc7XG5pbXBvcnQgeyBHZXRDbGllbnRWZXJzaW9uSUQgfSBmcm9tICcuLi9nbG9iYWxzJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4uL2xvZyc7XG5pbXBvcnQgeyBQZWVyIH0gZnJvbSAnLi4vcGVlcic7XG5pbXBvcnQgeyBNb2JSVENDbGllbnQgfSBmcm9tICcuL2NsaWVudCc7XG5leHBvcnQgY29uc3QgU0VSVkVSX0lORk9fTEFCRUwgPSAnU0VSVkVSSU5GTyc7XG5leHBvcnQgY29uc3QgSk9CX0NIQU5ORUxfTEFCRUwgPSAnSk9CJztcbmV4cG9ydCBjb25zdCBKT0JfREVUQUlMU19MQUJFTCA9ICdKT0JERVRBSUxTJztcbmV4cG9ydCBjb25zdCBQUklOVEVSX0NIQU5ORUxfTEFCRUwgPSAnUFJJTlRFUic7XG5leHBvcnQgY29uc3QgVE9LRU5fQ0hBTk5FTF9MQUJFTCA9ICdUT0tFTic7XG5leHBvcnQgY29uc3QgQ0FQQUJJTElUSUVTX0NIQU5ORUxfTEFCRUwgPSAnQ0FQQUJJTElUSUVTJztcbmV4cG9ydCBjb25zdCBDTElFTlRfQVBJX0JBU0VfVVJMX1BST0QgPSAnaHR0cHM6Ly9tcC5jbG91ZC5wYXBlcmN1dC5jb20nO1xuZXhwb3J0IGNvbnN0IENMSUVOVF9BUElfQkFTRV9VUkxfVEVTVCA9ICdodHRwczovL21wLmNsb3VkLnBhcGVyY3V0LnNvZnR3YXJlJztcbmV4cG9ydCBjbGFzcyBNb2JSVENDbGllbnRCdWlsZGVyIHtcbiAgICBjb25zdHJ1Y3RvcihzZXJ2ZXJJZCkge1xuICAgICAgICB0aGlzLmNsaWVudElkID0gJyc7XG4gICAgICAgIHRoaXMudGltZW91dCA9IDIwMDAwO1xuICAgICAgICB0aGlzLnNoYXJlVG9rZW4gPSAnJztcbiAgICAgICAgdGhpcy5wcmludFRva2VuID0gJyc7XG4gICAgICAgIHRoaXMuYmFzZVVybCA9IENMSUVOVF9BUElfQkFTRV9VUkxfUFJPRDtcbiAgICAgICAgdGhpcy5zZXJ2ZXJJZCA9IHNlcnZlcklkO1xuICAgIH1cbiAgICBzZXRDbGllbnRJZChjbGllbnRJZCkge1xuICAgICAgICB0aGlzLmNsaWVudElkID0gY2xpZW50SWQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzZXRUaW1lb3V0KHRpbWVvdXQpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gdGltZW91dDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHNldFNoYXJlVG9rZW4oc2hhcmVUb2tlbikge1xuICAgICAgICB0aGlzLnNoYXJlVG9rZW4gPSBzaGFyZVRva2VuO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2V0UHJpbnRUb2tlbihwcmludFRva2VuKSB7XG4gICAgICAgIHRoaXMucHJpbnRUb2tlbiA9IHByaW50VG9rZW47XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzZXRCYXNlVXJsKGJhc2VVcmwpIHtcbiAgICAgICAgdGhpcy5iYXNlVXJsID0gYmFzZVVybDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGFzeW5jIGJ1aWxkKCkge1xuICAgICAgICBsZXQgcmVjZWl2ZWRBbnN3ZXIgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgY2xpZW50Q2FuZGlkYXRlcyA9IFtdO1xuICAgICAgICBjb25zdCBjbGllbnRUb2tlbiA9IHRoaXMucHJpbnRUb2tlbiB8fCB0aGlzLnNoYXJlVG9rZW47XG4gICAgICAgIGxvZyhgW01PQiBSVEMgQnVpbGRlci4ke3RoaXMuc2VydmVySWR9XSBDbGllbnQgJyR7dGhpcy5jbGllbnRJZH0nIGNyZWF0aW5nIHNlc3Npb24gdmlhICR7dGhpcy5iYXNlVXJsfSAuLi5gKTtcbiAgICAgICAgY29uc3QgeyBpZCwgaWNlQ29uZmlnIH0gPSBhd2FpdCBjcmVhdGVTZXNzaW9uKHRoaXMuYmFzZVVybCwge1xuICAgICAgICAgICAgY2xpZW50VG9rZW4sXG4gICAgICAgICAgICBjbGllbnRJZDogdGhpcy5jbGllbnRJZCxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBzZXNzaW9uRGVsZXRlZCA9IGZhbHNlO1xuICAgICAgICBsb2coYFtNT0IgUlRDIEJ1aWxkZXIuJHt0aGlzLnNlcnZlcklkfV0gSUNFIHNlcnZlcnNgLCBpY2VDb25maWcuc2VydmVycyk7XG4gICAgICAgIGNvbnN0IHNlc3Npb25QYXJhbXMgPSB7XG4gICAgICAgICAgICBjbGllbnRUb2tlbixcbiAgICAgICAgICAgIHNlc3Npb25JZDogaWQsXG4gICAgICAgICAgICBjbGllbnRJZDogdGhpcy5jbGllbnRJZCxcbiAgICAgICAgfTtcbiAgICAgICAgbG9nKGBbTU9CIFJUQyBCdWlsZGVyLiR7dGhpcy5zZXJ2ZXJJZH1dIHN0YXJ0aW5nIHBlZXIgY29ubmVjdGlvbjogYCArXG4gICAgICAgICAgICBgc2VydmVySWQ9JHt0aGlzLnNlcnZlcklkfSwgc2Vzc2lvbklkPSR7aWR9LCBjbGllbnRJZD0ke3RoaXMuY2xpZW50SWR9YCk7XG4gICAgICAgIGNvbnN0IHBlZXIgPSBuZXcgUGVlcih0aGlzLnNlcnZlcklkLCBpY2VDb25maWcpO1xuICAgICAgICBwZWVyLm9uQ29ubmVjdGlvblN0YXRlQ2hhbmdlKChjdHgsIF8pID0+IHtcbiAgICAgICAgICAgIGlmIChzZXNzaW9uRGVsZXRlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAoY3R4LmdldENvbm5lY3Rpb25TdGF0ZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY2xvc2VkJzpcbiAgICAgICAgICAgICAgICBjYXNlICdmYWlsZWQnOlxuICAgICAgICAgICAgICAgICAgICBsb2coYFtNT0IgUlRDIEJ1aWxkZXIuJHt0aGlzLnNlcnZlcklkfV0gUlRDIGNvbm5lY3Rpb24gY2xvc2VkLCBkZWxldGluZyBzZXNzaW9uLmAsICdzZXNzaW9uSWQnLCBpZCk7XG4gICAgICAgICAgICAgICAgICAgIHNlc3Npb25EZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlU2Vzc2lvbih0aGlzLmJhc2VVcmwsIHsgLi4uc2Vzc2lvblBhcmFtcyB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZyhgW01PQiBSVEMgQnVpbGRlci4ke3RoaXMuc2VydmVySWR9XSBDbG91ZCBzZXNzaW9uIGRlbGV0ZWQuYCwgJ3Nlc3Npb25JZCcsIGlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGxvZyhgW01PQiBSVEMgQnVpbGRlci4ke3RoaXMuc2VydmVySWR9XSBSVEMgY29ubmVjdGlvbiBzdGF0ZSBjaGFuZ2VkOiAke2N0eC5nZXRDb25uZWN0aW9uU3RhdGUoKX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHBlZXIub25JQ0VDYW5kaWRhdGUoYXN5bmMgKGN0eCwgZXYpID0+IHtcbiAgICAgICAgICAgIGlmIChldi5jYW5kaWRhdGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxvZyhgW01PQiBSVEMgQnVpbGRlci4ke3RoaXMuc2VydmVySWR9XSBjYW5kaWRhdGVzIGV4aGF1c3RlZGAsIGlkKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXJlY2VpdmVkQW5zd2VyKSB7XG4gICAgICAgICAgICAgICAgY2xpZW50Q2FuZGlkYXRlcy5wdXNoKEpTT04uc3RyaW5naWZ5KGV2LmNhbmRpZGF0ZSkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbG9nKGBbTU9CIFJUQyBCdWlsZGVyLiR7dGhpcy5zZXJ2ZXJJZH1dIGZvdW5kIGNhbmRpZGF0ZSwgc2VuZGluZyB0byByZW1vdGUgcGVlcmAsICdjYW5kaWRhdGUnLCBldi5jYW5kaWRhdGUsICdzZXNzaW9uSWQnLCBpZCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgbm90aWZ5Q2xpZW50Q2FuZGlkYXRlcyh0aGlzLmJhc2VVcmwsIHtcbiAgICAgICAgICAgICAgICAgICAgLi4uc2Vzc2lvblBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgaWNlQ2FuZGlkYXRlczogW0pTT04uc3RyaW5naWZ5KGV2LmNhbmRpZGF0ZSldLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjdHguY2xvc2UoKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBkZWxldGVTZXNzaW9uKHRoaXMuYmFzZVVybCwgeyAuLi5zZXNzaW9uUGFyYW1zIH0pO1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBzdGFydCA9IERhdGUubm93KCk7XG4gICAgICAgIGNvbnN0IHBlZXJDb25uZWN0aW9uTGl2ZSA9IHBlZXIud2FpdEZvckxpdmVDb25uZWN0aW9uKHRoaXMudGltZW91dCk7XG4gICAgICAgIGxvZyhgW01PQiBSVEMgQnVpbGRlci4ke3RoaXMuc2VydmVySWR9XSByZWdpc3RlcmluZyBpY2UgY2FuZGlkYXRlIHNlbmQgaGFuZGxlcmApO1xuICAgICAgICBjb25zdCBvZmZlciA9IG5ldyBQcm9taXNlKChyZXMpID0+IHtcbiAgICAgICAgICAgIHBlZXIub25OZWdvdGlhdGlvbk5lZWRlZChhc3luYyAoY3R4LCBfKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2ZmZXIgPSBhd2FpdCBjdHguY3JlYXRlT2ZmZXIoKTtcbiAgICAgICAgICAgICAgICByZXMob2ZmZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBkYXRhQ2hhbm5lbHMgPSB0aGlzLnNldERhdGFDaGFubmVsSGFuZGxlcnMocGVlcik7XG4gICAgICAgIGxvZyhgW01PQiBSVEMgQnVpbGRlci4ke3RoaXMuc2VydmVySWR9XSBzZW5kaW5nIG9mZmVyIHRvIHJlbW90ZSBwZWVyYCk7XG4gICAgICAgIGF3YWl0IGNyZWF0ZU9mZmVyKHRoaXMuYmFzZVVybCwgeyAuLi5zZXNzaW9uUGFyYW1zLCBpY2VPZmZlcjogYXdhaXQgb2ZmZXIgfSk7XG4gICAgICAgIGxvZyhgW01PQiBSVEMgQnVpbGRlci4ke3RoaXMuc2VydmVySWR9XSBhd2FpdGluZyBhbnN3ZXJgKTtcbiAgICAgICAgY29uc3QgYW5zd2VyID0gYXdhaXQgcG9sbEdldEFuc3dlcih0aGlzLmJhc2VVcmwsIHsgLi4uc2Vzc2lvblBhcmFtcyB9LCB7IGludGVydmFsOiA1MDAsIHRpbWVvdXQ6IDE1MDAwIH0pO1xuICAgICAgICBpZiAoYW5zd2VyID09ICd0aW1lb3V0Jykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmV0cmlldmUgcmVtb3RlIGFuc3dlcicpO1xuICAgICAgICB9XG4gICAgICAgIGxvZyhgW01PQiBSVEMgQnVpbGRlci4ke3RoaXMuc2VydmVySWR9XSByZWdpc3RlcmluZyByZW1vdGUgYW5zd2VyIGxvY2FsbHlgKTtcbiAgICAgICAgYXdhaXQgcGVlci5yZWdpc3RlckFuc3dlcihhbnN3ZXIuaWNlQW5zd2VyKTtcbiAgICAgICAgcmVjZWl2ZWRBbnN3ZXIgPSB0cnVlO1xuICAgICAgICBpZiAoY2xpZW50Q2FuZGlkYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsb2coYFtNT0IgUlRDIEJ1aWxkZXIuJHt0aGlzLnNlcnZlcklkfV0gc2VuZGluZyBidWZmZXJlZCBjYW5kaWRhdGUgdG8gcGVlcmApO1xuICAgICAgICAgICAgYXdhaXQgbm90aWZ5Q2xpZW50Q2FuZGlkYXRlcyh0aGlzLmJhc2VVcmwsIHtcbiAgICAgICAgICAgICAgICAuLi5zZXNzaW9uUGFyYW1zLFxuICAgICAgICAgICAgICAgIGljZUNhbmRpZGF0ZXM6IGNsaWVudENhbmRpZGF0ZXMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvbGxGb3JDYW5kaWRhdGVzKHBlZXIsIHNlc3Npb25QYXJhbXMpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgcGVlckNvbm5lY3Rpb25MaXZlO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBsb2coYFtNT0IgUlRDIEJ1aWxkZXIuJHt0aGlzLnNlcnZlcklkfV0gUGVlciBjb25uZWN0aW9uIGZhaWxlZC4uLmApO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWwgPSBwZWVyLmdldFNlbGVjdGVkQ2FuZGlkYXRlUGFpcigpO1xuICAgICAgICBsb2coYFNlbGVjdGVkIHBlZXIgY2FuZGlkYXRlcywgbG9jYWw6ICR7SlNPTi5zdHJpbmdpZnkoc2VsLmxvY2FsKX0sIHJlbW90ZTogJHtKU09OLnN0cmluZ2lmeShzZWwucmVtb3RlKX1gKTtcbiAgICAgICAgbG9nKGBbTU9CIFJUQyBCdWlsZGVyLiR7dGhpcy5zZXJ2ZXJJZH1dIFBlZXIgY29ubmVjdGlvbiBpcyBsaXZlLiBgLCBgVGltZSB0byBlc3RhYmxpc2g6ICR7KERhdGUubm93KCkgLSBzdGFydCkgLyAxMDAwfXMuYCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLnJhY2UoW1xuICAgICAgICAgICAgICAgIGRhdGFDaGFubmVscyxcbiAgICAgICAgICAgICAgICBuZXcgUHJvbWlzZShyZXMgPT4gc2V0VGltZW91dChyZXMsIHRoaXMudGltZW91dCkpLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgICAgbG9nKGBbTU9CIFJUQyBCdWlsZGVyLiR7dGhpcy5zZXJ2ZXJJZH1dIENyZWF0aW5nIE1vYmlsaXR5IENsb3VkIGNsaWVudDogXG5cdFx0XHR2ZXJzaW9uPSR7R2V0Q2xpZW50VmVyc2lvbklEKCl9LFxuXHRcdFx0c2Vzc2lvbklkPSR7c2Vzc2lvblBhcmFtcy5zZXNzaW9uSWR9XG5cdFx0XHRjbGllbnRJZD0ke3Nlc3Npb25QYXJhbXMuY2xpZW50SWR9XG5cdFx0XHR0aW1lb3V0PSR7dGhpcy50aW1lb3V0fW1zLCBcblx0XHRcdG1heENodW5rU2l6ZT0ke2ljZUNvbmZpZy5tYXhDaHVua1NpemV9YCk7XG4gICAgICAgIHJldHVybiBuZXcgTW9iUlRDQ2xpZW50KHNlc3Npb25QYXJhbXMuc2Vzc2lvbklkLCBwZWVyLCB0aGlzLnRpbWVvdXQsIGljZUNvbmZpZy5tYXhDaHVua1NpemUsIEdldENsaWVudFZlcnNpb25JRCgpKTtcbiAgICB9XG4gICAgcG9sbEZvckNhbmRpZGF0ZXMocGVlciwgc2Vzc2lvblBhcmFtcywgdGltZW91dE1zID0gMjAwMDApIHtcbiAgICAgICAgbG9nKGBbTU9CIFJUQyBCdWlsZGVyLiR7dGhpcy5zZXJ2ZXJJZH1dYCwgYHNlc3Npb24gJyR7c2Vzc2lvblBhcmFtcy5zZXNzaW9uSWR9JyBzdGFydGluZyBwb2xsaW5nIGZvciBzZXJ2ZXIgY2FuZGlkYXRlcy4uLmApO1xuICAgICAgICBuZXcgUHJvbWlzZShhc3luYyAocmVzKSA9PiB7XG4gICAgICAgICAgICBsZXQgdGltZSA9IDA7XG4gICAgICAgICAgICBsZXQgc2hvdWxkQnJlYWsgPSBmYWxzZTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNob3VsZEJyZWFrID0gdHJ1ZTtcbiAgICAgICAgICAgIH0sIHRpbWVvdXRNcyk7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgaWNlQ2FuZGlkYXRlcywgdXBkYXRlZCB9ID0gYXdhaXQgZ2V0U2VydmVyQ2FuZGlkYXRlcyh0aGlzLmJhc2VVcmwsIHtcbiAgICAgICAgICAgICAgICAgICAgLi4uc2Vzc2lvblBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgc2luY2U6IHRpbWUsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGltZSA9IHVwZGF0ZWQ7XG4gICAgICAgICAgICAgICAgaWNlQ2FuZGlkYXRlcy5mb3JFYWNoKChjKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZyhgW01PQiBSVEMgQnVpbGRlci4ke3RoaXMuc2VydmVySWR9XSBzZXNzaW9uICcke3Nlc3Npb25QYXJhbXMuc2Vzc2lvbklkfScgZ290IGNhbmRpZGF0ZWAsIGMpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYW5kaWRhdGUgPSBKU09OLnBhcnNlKGMpO1xuICAgICAgICAgICAgICAgICAgICBwZWVyLmFkZEljZUNhbmRpZGF0ZShjYW5kaWRhdGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGF3YWl0IGRlbGF5KDUwMCk7XG4gICAgICAgICAgICAgICAgaWYgKHNob3VsZEJyZWFrKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcygpO1xuICAgICAgICB9KS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgbG9nKGBbTU9CIFJUQyBCdWlsZGVyLiR7dGhpcy5zZXJ2ZXJJZH1dYCwgYHNlc3Npb24gJyR7c2Vzc2lvblBhcmFtcy5zZXNzaW9uSWR9JyBzdG9wcGVkIHdhaXRpbmcgZm9yIG1vcmUgc2VydmVyIGNhbmRpZGF0ZXNgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNldERhdGFDaGFubmVsSGFuZGxlcihwZWVyLCBsYWJlbCkge1xuICAgICAgICBjb25zdCBjaGFubmVsID0gcGVlci5jcmVhdGVEYXRhQ2hhbm5lbChsYWJlbCk7XG4gICAgICAgIGNoYW5uZWwub25DbG9zZSgoY3R4LCBfKSA9PiB7XG4gICAgICAgICAgICBsb2coYFtNT0IgUlRDIENsaWVudF0gWyR7Y3R4LmxhYmVsfV0gZGF0YWNoYW5uZWwgY2xvc2VkYCk7XG4gICAgICAgIH0pO1xuICAgICAgICBjaGFubmVsLm9uRXJyb3IoKGN0eCwgZXYpID0+IHtcbiAgICAgICAgICAgIGlmIChldi5lcnJvci5tZXNzYWdlID09ICdUcmFuc3BvcnQgY2hhbm5lbCBjbG9zZWQnKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2coYFtNT0IgUlRDIENsaWVudF0gWyR7Y3R4LmxhYmVsfV0gZGF0YWNoYW5uZWwgZXJyb3JgLCBldi5lcnJvci5lcnJvckRldGFpbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBjaGFubmVsLm9uT3BlbigoY3R4LCBfKSA9PiB7XG4gICAgICAgICAgICAgICAgbG9nKGBbTU9CIFJUQyBDbGllbnRdIFske2N0eC5sYWJlbH1dIGRhdGFjaGFubmVsIG9wZW4gYW5kIHJlYWR5YCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzZXREYXRhQ2hhbm5lbEhhbmRsZXJzKHBlZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YUNoYW5uZWxIYW5kbGVyKHBlZXIsIFNFUlZFUl9JTkZPX0xBQkVMKSxcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YUNoYW5uZWxIYW5kbGVyKHBlZXIsIENBUEFCSUxJVElFU19DSEFOTkVMX0xBQkVMKSxcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YUNoYW5uZWxIYW5kbGVyKHBlZXIsIFRPS0VOX0NIQU5ORUxfTEFCRUwpLFxuICAgICAgICAgICAgdGhpcy5zZXREYXRhQ2hhbm5lbEhhbmRsZXIocGVlciwgUFJJTlRFUl9DSEFOTkVMX0xBQkVMKSxcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YUNoYW5uZWxIYW5kbGVyKHBlZXIsIEpPQl9DSEFOTkVMX0xBQkVMKSxcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YUNoYW5uZWxIYW5kbGVyKHBlZXIsIEpPQl9ERVRBSUxTX0xBQkVMKSxcbiAgICAgICAgXSk7XG4gICAgfVxufVxuYXN5bmMgZnVuY3Rpb24gZGVsYXkobXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcykgPT4gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgbXNnOiAna2VlcCBhY3RpdmUnIH0pO1xuICAgICAgICByZXMoKTtcbiAgICB9LCBtcykpO1xufVxuYXN5bmMgZnVuY3Rpb24gcG9sbEdldEFuc3dlcihiYXNlVXJsLCByZXEsIHBvbGxPcHRpb25zKSB7XG4gICAgbGV0IHNob3VsZEJyZWFrID0gZmFsc2U7XG4gICAgY29uc3QgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzaG91bGRCcmVhayA9IHRydWU7XG4gICAgfSwgcG9sbE9wdGlvbnMudGltZW91dCk7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgaWYgKHNob3VsZEJyZWFrKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGdldEFuc3dlcihiYXNlVXJsLCByZXEpO1xuICAgICAgICBpZiAocmVzcG9uc2UgIT09ICdwZW5kaW5nJykge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IGRlbGF5KHBvbGxPcHRpb25zLmludGVydmFsKTtcbiAgICB9XG4gICAgcmV0dXJuICd0aW1lb3V0Jztcbn1cbiIsImV4cG9ydCAqIGZyb20gJy4vY2xpZW50YnVpbGRlcic7XG5leHBvcnQgKiBmcm9tICcuL2NsaWVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpbmsnO1xuIiwiY29uc3QgZGVmYXVsdENvbG9yT3B0aW9ucyA9IFtcbiAgICB7XG4gICAgICAgIHR5cGU6ICdTVEFOREFSRF9DT0xPUicsXG4gICAgICAgIGlzX2RlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdTVEFOREFSRF9NT05PQ0hST01FJyxcbiAgICB9LFxuXTtcbmNvbnN0IGRlZmF1bHREdXBsZXhPcHRpb25zID0gW1xuICAgIHtcbiAgICAgICAgdHlwZTogJ05PX0RVUExFWCcsXG4gICAgICAgIGlzX2RlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdMT05HX0VER0UnLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnU0hPUlRfRURHRScsXG4gICAgfSxcbl07XG5jb25zdCBkZWZhdWx0UGFwZXJTaXplID0gJ0E0JztcbmNvbnN0IGRlZmF1bHRNZWRpYVNpemVzID0gW1xuICAgIHtcbiAgICAgICAgbmFtZTogJ0lTT19BMCcsXG4gICAgICAgIHdpZHRoX21pY3JvbnM6IDg0MTAwMCxcbiAgICAgICAgaGVpZ2h0X21pY3JvbnM6IDExODkwMDAsXG4gICAgICAgIGlzX2RlZmF1bHQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZGlzcGxheV9uYW1lOiAnQTAnLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSVNPX0ExJyxcbiAgICAgICAgd2lkdGhfbWljcm9uczogNTk0MDAwLFxuICAgICAgICBoZWlnaHRfbWljcm9uczogODQxMDAwLFxuICAgICAgICBpc19kZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgY3VzdG9tX2Rpc3BsYXlfbmFtZTogJ0ExJyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0lTT19BMicsXG4gICAgICAgIHdpZHRoX21pY3JvbnM6IDQyMDAwMCxcbiAgICAgICAgaGVpZ2h0X21pY3JvbnM6IDU5NDAwMCxcbiAgICAgICAgaXNfZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9kaXNwbGF5X25hbWU6ICdBMicsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdJU09fQTMnLFxuICAgICAgICB3aWR0aF9taWNyb25zOiAyOTcwMDAsXG4gICAgICAgIGhlaWdodF9taWNyb25zOiA0MjAwMDAsXG4gICAgICAgIGlzX2RlZmF1bHQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZGlzcGxheV9uYW1lOiAnQTMnLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSVNPX0E0JyxcbiAgICAgICAgd2lkdGhfbWljcm9uczogMjEwMDAwLFxuICAgICAgICBoZWlnaHRfbWljcm9uczogMjk3MDAwLFxuICAgICAgICBpc19kZWZhdWx0OiAnQTQnID09PSBkZWZhdWx0UGFwZXJTaXplLnRvVXBwZXJDYXNlKCksXG4gICAgICAgIGN1c3RvbV9kaXNwbGF5X25hbWU6ICdBNCcsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdJU09fQTUnLFxuICAgICAgICB3aWR0aF9taWNyb25zOiAxNDgwMDAsXG4gICAgICAgIGhlaWdodF9taWNyb25zOiAyMTAwMDAsXG4gICAgICAgIGlzX2RlZmF1bHQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZGlzcGxheV9uYW1lOiAnQTUnLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSVNPX0E2JyxcbiAgICAgICAgd2lkdGhfbWljcm9uczogMTA1MDAwLFxuICAgICAgICBoZWlnaHRfbWljcm9uczogMTQ4MDAwLFxuICAgICAgICBpc19kZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgY3VzdG9tX2Rpc3BsYXlfbmFtZTogJ0E2JyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0lTT19BNycsXG4gICAgICAgIHdpZHRoX21pY3JvbnM6IDc0MDAwLFxuICAgICAgICBoZWlnaHRfbWljcm9uczogMTA1MDAwLFxuICAgICAgICBpc19kZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgY3VzdG9tX2Rpc3BsYXlfbmFtZTogJ0E3JyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0lTT19BOCcsXG4gICAgICAgIHdpZHRoX21pY3JvbnM6IDUyMDAwLFxuICAgICAgICBoZWlnaHRfbWljcm9uczogNzQwMDAsXG4gICAgICAgIGlzX2RlZmF1bHQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZGlzcGxheV9uYW1lOiAnQTgnLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSVNPX0E5JyxcbiAgICAgICAgd2lkdGhfbWljcm9uczogMzcwMDAsXG4gICAgICAgIGhlaWdodF9taWNyb25zOiA1MjAwMCxcbiAgICAgICAgaXNfZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9kaXNwbGF5X25hbWU6ICdBOScsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdJU09fQTEwJyxcbiAgICAgICAgd2lkdGhfbWljcm9uczogMjYwMDAsXG4gICAgICAgIGhlaWdodF9taWNyb25zOiAzNzAwMCxcbiAgICAgICAgaXNfZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9kaXNwbGF5X25hbWU6ICdBMTAnLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSklTX0IwJyxcbiAgICAgICAgd2lkdGhfbWljcm9uczogMTAzMDAwMCxcbiAgICAgICAgaGVpZ2h0X21pY3JvbnM6IDE0NTYwMDAsXG4gICAgICAgIGlzX2RlZmF1bHQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZGlzcGxheV9uYW1lOiAnSklTIEIwJyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0pJU19CMScsXG4gICAgICAgIHdpZHRoX21pY3JvbnM6IDcyODAwMCxcbiAgICAgICAgaGVpZ2h0X21pY3JvbnM6IDEwMzAwMDAsXG4gICAgICAgIGlzX2RlZmF1bHQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZGlzcGxheV9uYW1lOiAnSklTIEIxJyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0pJU19CMicsXG4gICAgICAgIHdpZHRoX21pY3JvbnM6IDUxNTAwMCxcbiAgICAgICAgaGVpZ2h0X21pY3JvbnM6IDcyODAwMCxcbiAgICAgICAgaXNfZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9kaXNwbGF5X25hbWU6ICdKSVMgQjInLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSklTX0IzJyxcbiAgICAgICAgd2lkdGhfbWljcm9uczogMzY0MDAwLFxuICAgICAgICBoZWlnaHRfbWljcm9uczogNTE1MDAwLFxuICAgICAgICBpc19kZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgY3VzdG9tX2Rpc3BsYXlfbmFtZTogJ0pJUyBCMycsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdKSVNfQjQnLFxuICAgICAgICB3aWR0aF9taWNyb25zOiAyNTcwMDAsXG4gICAgICAgIGhlaWdodF9taWNyb25zOiAzNjQwMDAsXG4gICAgICAgIGlzX2RlZmF1bHQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZGlzcGxheV9uYW1lOiAnSklTIEI0JyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0pJU19CNScsXG4gICAgICAgIHdpZHRoX21pY3JvbnM6IDE4MjAwMCxcbiAgICAgICAgaGVpZ2h0X21pY3JvbnM6IDI1NzAwMCxcbiAgICAgICAgaXNfZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9kaXNwbGF5X25hbWU6ICdKSVMgQjUnLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSklTX0I2JyxcbiAgICAgICAgd2lkdGhfbWljcm9uczogMTI4MDAwLFxuICAgICAgICBoZWlnaHRfbWljcm9uczogMTgyMDAwLFxuICAgICAgICBpc19kZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgY3VzdG9tX2Rpc3BsYXlfbmFtZTogJ0pJUyBCNicsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdKSVNfQjcnLFxuICAgICAgICB3aWR0aF9taWNyb25zOiA5MTAwMCxcbiAgICAgICAgaGVpZ2h0X21pY3JvbnM6IDEyODAwMCxcbiAgICAgICAgaXNfZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9kaXNwbGF5X25hbWU6ICdKSVMgQjcnLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSklTX0I4JyxcbiAgICAgICAgd2lkdGhfbWljcm9uczogNjQwMDAsXG4gICAgICAgIGhlaWdodF9taWNyb25zOiA5MTAwMCxcbiAgICAgICAgaXNfZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9kaXNwbGF5X25hbWU6ICdKSVMgQjgnLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSklTX0I5JyxcbiAgICAgICAgd2lkdGhfbWljcm9uczogNDUwMDAsXG4gICAgICAgIGhlaWdodF9taWNyb25zOiA2NDAwMCxcbiAgICAgICAgaXNfZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9kaXNwbGF5X25hbWU6ICdKSVMgQjknLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSklTX0IxMCcsXG4gICAgICAgIHdpZHRoX21pY3JvbnM6IDMyMDAwLFxuICAgICAgICBoZWlnaHRfbWljcm9uczogNDUwMDAsXG4gICAgICAgIGlzX2RlZmF1bHQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZGlzcGxheV9uYW1lOiAnSklTIEIxMCcsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdJU09fQjAnLFxuICAgICAgICB3aWR0aF9taWNyb25zOiAxMDAwMDAwLFxuICAgICAgICBoZWlnaHRfbWljcm9uczogMTQxNDAwMCxcbiAgICAgICAgaXNfZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9kaXNwbGF5X25hbWU6ICdJU08gQjAnLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSVNPX0IxJyxcbiAgICAgICAgd2lkdGhfbWljcm9uczogNzA3MDAwLFxuICAgICAgICBoZWlnaHRfbWljcm9uczogMTAwMDAwMCxcbiAgICAgICAgaXNfZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9kaXNwbGF5X25hbWU6ICdJU08gQjEnLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSVNPX0IyJyxcbiAgICAgICAgd2lkdGhfbWljcm9uczogNTAwMDAwLFxuICAgICAgICBoZWlnaHRfbWljcm9uczogNzA3MDAwLFxuICAgICAgICBpc19kZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgY3VzdG9tX2Rpc3BsYXlfbmFtZTogJ0lTTyBCMicsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdJU09fQjMnLFxuICAgICAgICB3aWR0aF9taWNyb25zOiAzNTMwMDAsXG4gICAgICAgIGhlaWdodF9taWNyb25zOiA1MDAwMDAsXG4gICAgICAgIGlzX2RlZmF1bHQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZGlzcGxheV9uYW1lOiAnSVNPIEIzJyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0lTT19CNCcsXG4gICAgICAgIHdpZHRoX21pY3JvbnM6IDI1MDAwMCxcbiAgICAgICAgaGVpZ2h0X21pY3JvbnM6IDM1MzAwMCxcbiAgICAgICAgaXNfZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9kaXNwbGF5X25hbWU6ICdJU08gQjQnLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSVNPX0I1JyxcbiAgICAgICAgd2lkdGhfbWljcm9uczogMTc2MDAwLFxuICAgICAgICBoZWlnaHRfbWljcm9uczogMjUwMDAwLFxuICAgICAgICBpc19kZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgY3VzdG9tX2Rpc3BsYXlfbmFtZTogJ0lTTyBCNScsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdJU09fQjYnLFxuICAgICAgICB3aWR0aF9taWNyb25zOiAxMjUwMDAsXG4gICAgICAgIGhlaWdodF9taWNyb25zOiAxNzYwMDAsXG4gICAgICAgIGlzX2RlZmF1bHQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZGlzcGxheV9uYW1lOiAnSVNPIEI2JyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0lTT19CNycsXG4gICAgICAgIHdpZHRoX21pY3JvbnM6IDg4MDAwLFxuICAgICAgICBoZWlnaHRfbWljcm9uczogMTI1MDAwLFxuICAgICAgICBpc19kZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgY3VzdG9tX2Rpc3BsYXlfbmFtZTogJ0lTTyBCNycsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdJU09fQjgnLFxuICAgICAgICB3aWR0aF9taWNyb25zOiA2MjAwMCxcbiAgICAgICAgaGVpZ2h0X21pY3JvbnM6IDg4MDAwLFxuICAgICAgICBpc19kZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgY3VzdG9tX2Rpc3BsYXlfbmFtZTogJ0lTTyBCOCcsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdJU09fQjknLFxuICAgICAgICB3aWR0aF9taWNyb25zOiA0NDAwMCxcbiAgICAgICAgaGVpZ2h0X21pY3JvbnM6IDYyMDAwLFxuICAgICAgICBpc19kZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgY3VzdG9tX2Rpc3BsYXlfbmFtZTogJ0lTTyBCOScsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdJU09fQjEwJyxcbiAgICAgICAgd2lkdGhfbWljcm9uczogMzEwMDAsXG4gICAgICAgIGhlaWdodF9taWNyb25zOiA0NDAwMCxcbiAgICAgICAgaXNfZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9kaXNwbGF5X25hbWU6ICdJU08gQjEwJyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ05BX0xFVFRFUicsXG4gICAgICAgIHdpZHRoX21pY3JvbnM6IDIxNTkwMCxcbiAgICAgICAgaGVpZ2h0X21pY3JvbnM6IDI3OTQwMCxcbiAgICAgICAgaXNfZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9kaXNwbGF5X25hbWU6ICdMZXR0ZXInLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnTkFfTEVHQUwnLFxuICAgICAgICB3aWR0aF9taWNyb25zOiAyMTU5MDAsXG4gICAgICAgIGhlaWdodF9taWNyb25zOiAzNTU2MDAsXG4gICAgICAgIGlzX2RlZmF1bHQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZGlzcGxheV9uYW1lOiAnTGVnYWwnLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnTkFfNVg3JyxcbiAgICAgICAgd2lkdGhfbWljcm9uczogMTI3MDAwLFxuICAgICAgICBoZWlnaHRfbWljcm9uczogMTc3ODAwLFxuICAgICAgICBpc19kZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgY3VzdG9tX2Rpc3BsYXlfbmFtZTogJzVYNycsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdOQV9FWEVDVVRJVkUnLFxuICAgICAgICB3aWR0aF9taWNyb25zOiAxODQxNTAsXG4gICAgICAgIGhlaWdodF9taWNyb25zOiAyNjY3MDAsXG4gICAgICAgIGlzX2RlZmF1bHQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZGlzcGxheV9uYW1lOiAnRXhlY3V0aXZlJyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ05BX0lOVk9JQ0UnLFxuICAgICAgICB3aWR0aF9taWNyb25zOiAxMzk3MDAsXG4gICAgICAgIGhlaWdodF9taWNyb25zOiAyMTU5MDAsXG4gICAgICAgIGlzX2RlZmF1bHQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZGlzcGxheV9uYW1lOiAnSW52b2ljZScsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdOQV9MRURHRVInLFxuICAgICAgICB3aWR0aF9taWNyb25zOiAyNzk0MDAsXG4gICAgICAgIGhlaWdodF9taWNyb25zOiA0MzE4MDAsXG4gICAgICAgIGlzX2RlZmF1bHQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZGlzcGxheV9uYW1lOiAnTGVkZ2VyJyxcbiAgICB9LFxuXTtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQcmludGVyQ2FwYWJpbGl0aWVzKGNvbG9yT3B0aW9ucyA9IGRlZmF1bHRDb2xvck9wdGlvbnMsIGR1cGxleE9wdGlvbnMgPSBkZWZhdWx0RHVwbGV4T3B0aW9ucywgbWVkaWFTaXplcyA9IGRlZmF1bHRNZWRpYVNpemVzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmVyc2lvbjogJzEuMCcsXG4gICAgICAgIHByaW50ZXI6IHtcbiAgICAgICAgICAgIHN1cHBvcnRlZF9jb250ZW50X3R5cGU6IFt7IGNvbnRlbnRfdHlwZTogJ2FwcGxpY2F0aW9uL3BkZicgfV0sXG4gICAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgICAgIG9wdGlvbjogY29sb3JPcHRpb25zLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGR1cGxleDoge1xuICAgICAgICAgICAgICAgIG9wdGlvbjogZHVwbGV4T3B0aW9ucyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYWdlX29yaWVudGF0aW9uOiB7XG4gICAgICAgICAgICAgICAgb3B0aW9uOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgdHlwZTogJ1BPUlRSQUlUJywgaXNfZGVmYXVsdDogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgICAgICB7IHR5cGU6ICdMQU5EU0NBUEUnLCBpc19kZWZhdWx0OiBmYWxzZSB9LFxuICAgICAgICAgICAgICAgICAgICB7IHR5cGU6ICdBVVRPJywgaXNfZGVmYXVsdDogZmFsc2UgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvcGllczogeyBkZWZhdWx0OiAxLCBtYXg6IDEwMCB9LFxuICAgICAgICAgICAgbWVkaWFfc2l6ZTogeyBvcHRpb246IG1lZGlhU2l6ZXMgfSxcbiAgICAgICAgfSxcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTW9iaWxpdHlQcmludENhcGFiaWxpdGllcyhjYXBhYmlsaXRpZXMpIHtcbiAgICBjb25zdCBtZWRpYVNpemVzID0gY2FwYWJpbGl0aWVzLm1lZGlhU2l6ZXMubWFwKChtKSA9PiAoe1xuICAgICAgICBuYW1lOiAnQ1VTVE9NJyxcbiAgICAgICAgd2lkdGhfbWljcm9uczogbS53aWR0aE1pY3JvbnMsXG4gICAgICAgIGhlaWdodF9taWNyb25zOiBtLmhlaWdodE1pY3JvbnMsXG4gICAgICAgIGlzX2RlZmF1bHQ6IG0uaXNEZWZhdWx0LFxuICAgICAgICBjdXN0b21fZGlzcGxheV9uYW1lOiBtLmN1c3RvbURpc3BsYXlOYW1lIHx8IG0ubmFtZSxcbiAgICB9KSk7XG4gICAgaWYgKG1lZGlhU2l6ZXMubGVuZ3RoID4gMCAmJlxuICAgICAgICBtZWRpYVNpemVzLmV2ZXJ5KGZ1bmN0aW9uIChtKSB7XG4gICAgICAgICAgICByZXR1cm4gIW0uaXNfZGVmYXVsdDtcbiAgICAgICAgfSkpIHtcbiAgICAgICAgbWVkaWFTaXplc1swXS5pc19kZWZhdWx0ID0gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3QgY29sb3JPcHRpb25zID0gY2FwYWJpbGl0aWVzLmNvbG9yLm1hcChmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4geyB0eXBlOiBuIH07XG4gICAgfSk7XG4gICAgaWYgKGNvbG9yT3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbG9yT3B0aW9uc1swXVsnaXNfZGVmYXVsdCddID0gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3QgZHVwbGV4T3B0aW9ucyA9IGNhcGFiaWxpdGllcy5kdXBsZXgubWFwKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiB7IHR5cGU6IG4gfTtcbiAgICB9KTtcbiAgICBpZiAoZHVwbGV4T3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGR1cGxleE9wdGlvbnNbMF1bJ2lzX2RlZmF1bHQnXSA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVQcmludGVyQ2FwYWJpbGl0aWVzKGNvbG9yT3B0aW9ucywgZHVwbGV4T3B0aW9ucywgbWVkaWFTaXplcyk7XG59XG4iLCJpbXBvcnQgeyBlcnJvciwgbG9nLCB3YXJuIH0gZnJvbSAnLi4vbG9nJztcbmltcG9ydCB7IHBhcnNlTW9iaWxpdHlQcmludENhcGFiaWxpdGllcyB9IGZyb20gJy4uL3ByaW50ZXIvY2FwYWJpbGl0aWVzJztcbmltcG9ydCB7IGdldExvY2FsU3RvcmFnZURhdGEsIGxvYWRNYXAsIHNhdmVNYXAgfSBmcm9tICcuLi9zdG9yYWdlJztcbmltcG9ydCB7IHdhaXRGb3JDb25kaXRpb24gfSBmcm9tICcuLi93YWl0JztcbmV4cG9ydCBjb25zdCBwcmludGVyQ2FwYWJpbGl0aWVzQ2FjaGUgPSBuZXcgTWFwKCk7XG5jb25zdCBzZXJ2ZXJJZFRvQ2xpZW50Q2FjaGUgPSBuZXcgTWFwKCk7XG5jb25zdCBzdG9yYWdlS2V5U2VydmVySWRUb0luZm9DYWNoZSA9ICdzZXJ2ZXJJZFRvSW5mb0NhY2hlJztcbmNvbnN0IHNlcnZlcklkVG9JbmZvQ2FjaGUgPSBuZXcgTWFwKCk7XG5jb25zdCBzdG9yYWdlS2V5UHJpbnRlclRpbWVVc2VkTWFwID0gJ3ByaW50ZXJUaW1lVXNlZE1hcCc7XG5jb25zdCBzdG9yYWdlS2V5UHJpbnRlckNhcGFiaWxpdGllc01hcCA9ICdwcmludGVyQ2FwYWJpbGl0aWVzTWFwJztcbmNvbnN0IHN0b3JhZ2VLZXlQcmludGVyU2VydmVyTWFwID0gJ3ByaW50ZXJTZXJ2ZXJNYXAnO1xuY29uc3Qgc3RvcmFnZUtleVByaW50VG9rZW5DYWNoZSA9ICdwcmludFRva2VuQ2FjaGUnO1xuY29uc3QgcHJpbnRlclRpbWVVc2VkTWFwID0gbmV3IE1hcCgpO1xuY29uc3QgcHJpbnRlck5hbWVUb1NlcnZlcklkQ2FjaGUgPSBuZXcgTWFwKCk7XG5jb25zdCBwcmludFRva2VuQ2FjaGUgPSBuZXcgTWFwKCk7XG5jb25zdCBzdG9yYWdlS2V5UmVjbGFpbVN0b3JhZ2VMaW1pdEtiID0gJ3JlY2xhaW1TdG9yYWdlTGltaXRLYic7XG5jb25zdCBzdG9yYWdlS2V5UHJpbnRlZE9sZGVyVGhhbkRheXMgPSAncHJpbnRlZE9sZGVyVGhhbkRheXMnO1xubGV0IHJlY2xhaW1TdG9yYWdlTGltaXRLYjtcbmxldCBwcmludGVkT2xkZXJUaGFuRGF5cztcbmxldCBjYWNoZUxvYWRlZCA9IGZhbHNlO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRDYWNoZSgpIHtcbiAgICBjb25zdCBbc3RvcmFnZUxpbWl0LCBwcmludGVkQWdlXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgZ2V0TG9jYWxTdG9yYWdlRGF0YShzdG9yYWdlS2V5UmVjbGFpbVN0b3JhZ2VMaW1pdEtiKS50aGVuKHYgPT4gdiA/ICt2IDogNDA5NiksXG4gICAgICAgIGdldExvY2FsU3RvcmFnZURhdGEoc3RvcmFnZUtleVByaW50ZWRPbGRlclRoYW5EYXlzKS50aGVuKHYgPT4gdiA/ICt2IDogMzApLFxuICAgIF0pO1xuICAgIHJlY2xhaW1TdG9yYWdlTGltaXRLYiA9IHN0b3JhZ2VMaW1pdDtcbiAgICBwcmludGVkT2xkZXJUaGFuRGF5cyA9IHByaW50ZWRBZ2U7XG4gICAgbG9nKGBMb2NhbCBzdG9yYWdlIGNsZWFudXAgc2V0dGluZ3M6IHJlY2xhaW1TdG9yYWdlTGltaXRLYj0ke3JlY2xhaW1TdG9yYWdlTGltaXRLYn0gS2lCLCBgICtcbiAgICAgICAgYHByaW50ZWRPbGRlclRoYW5EYXlzPSR7cHJpbnRlZE9sZGVyVGhhbkRheXN9IGRheXNgKTtcbiAgICBwb3B1bGF0ZUNhY2hlKHJlY2xhaW1TdG9yYWdlTGltaXRLYiwgcHJpbnRlZE9sZGVyVGhhbkRheXMpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlcnZlcklkVG9DbGllbnRDYWNoZSgpIHtcbiAgICByZXR1cm4gc2VydmVySWRUb0NsaWVudENhY2hlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlcnZlcklkVG9TZXJ2ZXJJbmZvQ2FjaGUoKSB7XG4gICAgcmV0dXJuIHNlcnZlcklkVG9JbmZvQ2FjaGU7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJpbnRlck5hbWVUb1NlcnZlcklkQ2FjaGUoKSB7XG4gICAgcmV0dXJuIHByaW50ZXJOYW1lVG9TZXJ2ZXJJZENhY2hlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFByaW50VG9rZW5DYWNoZSgpIHtcbiAgICByZXR1cm4gcHJpbnRUb2tlbkNhY2hlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVByaW50VG9rZW4ocHJpbnRUb2tlbkNhY2hlSUQsIHByaW50VG9rZW4pIHtcbiAgICBpZiAoIXByaW50VG9rZW4pIHtcbiAgICAgICAgd2FybigndXBkYXRlUHJpbnRUb2tlbjogUHJpbnQgdG9rZW4gaXMgbm90IHByb3ZpZGVkJyk7XG4gICAgfVxuICAgIGxvZyhgIHVwZGF0ZVByaW50VG9rZW46IFNhdmluZyBwcmludCB0b2tlbiBmb3I6ICR7cHJpbnRUb2tlbkNhY2hlSUR9YCk7XG4gICAgZ2V0UHJpbnRUb2tlbkNhY2hlKCkuc2V0KHByaW50VG9rZW5DYWNoZUlELCBwcmludFRva2VuKTtcbiAgICBzYXZlTWFwVG9TdG9yYWdlKHN0b3JhZ2VLZXlQcmludFRva2VuQ2FjaGUsIHByaW50VG9rZW5DYWNoZSlcbiAgICAgICAgLnRoZW4oKCkgPT4gbG9nKGAgdXBkYXRlUHJpbnRUb2tlbjogVXBkYXRlZCBwcmludCB0b2tlbiBmb3I6ICR7cHJpbnRUb2tlbkNhY2hlSUR9YCkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVNlcnZlckluZm8oc2VydmVySWQsIHNlcnZlckluZm8pIHtcbiAgICBjb25zdCBpZFRvU2VydmVySW5mb0NhY2hlID0gZ2V0U2VydmVySWRUb1NlcnZlckluZm9DYWNoZSgpO1xuICAgIGlkVG9TZXJ2ZXJJbmZvQ2FjaGUuc2V0KHNlcnZlcklkLCBzZXJ2ZXJJbmZvKTtcbiAgICBzYXZlTWFwVG9TdG9yYWdlKHN0b3JhZ2VLZXlTZXJ2ZXJJZFRvSW5mb0NhY2hlLCBpZFRvU2VydmVySW5mb0NhY2hlKVxuICAgICAgICAudGhlbigoKSA9PiBsb2coYFVwZGF0ZWQgaW5mbyBmb3Igc2VydmVyICcke3NlcnZlcklkfTogJHtKU09OLnN0cmluZ2lmeShzZXJ2ZXJJbmZvKX0uLi5gKSk7XG59XG5mdW5jdGlvbiBwb3B1bGF0ZUNhY2hlKHJlY2xhaW1TdG9yYWdlTGltaXRLYiwgcHJpbnRlZE9sZGVyVGhhbkRheXMpIHtcbiAgICBQcm9taXNlLmFsbChbXG4gICAgICAgIGxvYWRNYXBGcm9tU3RvcmFnZShzdG9yYWdlS2V5UHJpbnRlclRpbWVVc2VkTWFwLCBwcmludGVyVGltZVVzZWRNYXApLFxuICAgICAgICBsb2FkTWFwRnJvbVN0b3JhZ2Uoc3RvcmFnZUtleVByaW50ZXJDYXBhYmlsaXRpZXNNYXAsIHByaW50ZXJDYXBhYmlsaXRpZXNDYWNoZSksXG4gICAgICAgIGxvYWRNYXBGcm9tU3RvcmFnZShzdG9yYWdlS2V5UHJpbnRlclNlcnZlck1hcCwgcHJpbnRlck5hbWVUb1NlcnZlcklkQ2FjaGUpLFxuICAgICAgICBsb2FkTWFwRnJvbVN0b3JhZ2Uoc3RvcmFnZUtleVByaW50VG9rZW5DYWNoZSwgcHJpbnRUb2tlbkNhY2hlKSxcbiAgICAgICAgbG9hZE1hcEZyb21TdG9yYWdlKHN0b3JhZ2VLZXlTZXJ2ZXJJZFRvSW5mb0NhY2hlLCBzZXJ2ZXJJZFRvSW5mb0NhY2hlKSxcbiAgICBdKS50aGVuKCgpID0+IHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0Qnl0ZXNJblVzZShieXRlc0luVXNlID0+IHtcbiAgICAgICAgICAgIGxvZyhgW09mZk5ldHdvcmtDYWNoZTpwb3B1bGF0ZUNhY2hlXSB0b3RhbCBjYWNoZWQgc3RvcmFnZTogJHsoYnl0ZXNJblVzZSAvIDEwMjQpLnRvRml4ZWQoMil9S2lCYCk7XG4gICAgICAgICAgICBpZiAoYnl0ZXNJblVzZSAvIDEwMjQgPj0gcmVjbGFpbVN0b3JhZ2VMaW1pdEtiKSB7XG4gICAgICAgICAgICAgICAgd2FybihgRXhjZWVkZWQgc3RvcmFnZSBsaW1pdCB0aHJlc2hvbGQgb2YgJHtyZWNsYWltU3RvcmFnZUxpbWl0S2J9S2lCLCBcblx0XHRcdFx0XHRjbGVhbnVwIGNhcGFiaWxpdGllcyBmb3IgcHJpbnRlcnMgbm90IHVzZWQgaW4gJHtwcmludGVkT2xkZXJUaGFuRGF5c30gZGF5cy4uLmApO1xuICAgICAgICAgICAgICAgIGNsZWFudXBTdG9yYWdlKHByaW50ZWRPbGRlclRoYW5EYXlzKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiBsb2coYENvbXBsZXRlZCBjbGVhbnVwIG9mIHByaW50ZXJzIHVzZWQgPiAke3ByaW50ZWRPbGRlclRoYW5EYXlzfSBkYXlzYCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FjaGVMb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgbG9nKCdbT2ZmTmV0d29ya0NhY2hlOnBvcHVsYXRlQ2FjaGVdIGNvbXBsZXRlZC4nKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5hc3luYyBmdW5jdGlvbiBsb2FkTWFwRnJvbVN0b3JhZ2Uoa2V5LCB0b01hcCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG1hcCA9IGF3YWl0IGxvYWRNYXAoa2V5KTtcbiAgICAgICAgaWYgKG1hcCkge1xuICAgICAgICAgICAgY29weVRvTWFwKG1hcCwgdG9NYXApO1xuICAgICAgICAgICAgbG9nKGBMb2FkZWQgJyR7a2V5fScgd2l0aCAke21hcC5zaXplfSBpdGVtcyBmcm9tIGxvY2FsIHN0b3JhZ2UuLi5gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxvZyhgVW5hYmxlIHRvIGxvYWQgJyR7a2V5fSBmcm9tIGxvY2FsIHN0b3JhZ2UgLSBpdCBkb2VzIG5vdCBleGlzdGApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChyZWFzb24pIHtcbiAgICAgICAgcmV0dXJuIGVycm9yKGBVbmFibGUgdG8gbG9hZCAnJHtrZXl9JyBmcm9tIGxvY2FsIHN0b3JhZ2U6ICR7cmVhc29ufWApO1xuICAgIH1cbn1cbmFzeW5jIGZ1bmN0aW9uIHNhdmVNYXBUb1N0b3JhZ2Uoa2V5LCBtYXApIHtcbiAgICB0cnkge1xuICAgICAgICBhd2FpdCBzYXZlTWFwKGtleSwgbWFwKTtcbiAgICAgICAgcmV0dXJuIGxvZyhgU2F2ZWQgJyR7a2V5fScgd2l0aCAke21hcC5zaXplfSBpdGVtcyB0byBsb2NhbCBzdG9yYWdlLi4uYCk7XG4gICAgfVxuICAgIGNhdGNoIChyZWFzb24pIHtcbiAgICAgICAgZXJyb3IoYEZhaWxlZCB0byBzYXZlIGRhdGEgdG8gbG9jYWwgc3RvcmFnZTogJHtyZWFzb259YCk7XG4gICAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ3F1b3RhJykpIHtcbiAgICAgICAgICAgIGNsZWFudXBTdG9yYWdlKHByaW50ZWRPbGRlclRoYW5EYXlzKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IGxvZyhgQ29tcGxldGVkIGNsZWFudXAgb2YgcHJpbnRlcnMgdXNlZCA+ICR7cHJpbnRlZE9sZGVyVGhhbkRheXN9IGRheXNgKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBjb3B5VG9NYXAoc3JjLCBkc3QpIHtcbiAgICBkc3QuY2xlYXIoKTtcbiAgICBzcmMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4gZHN0LnNldChrZXksIHZhbHVlKSk7XG59XG5mdW5jdGlvbiBkYXlzQWdvKHRpbWVzdGFtcE1pbGxpcykge1xuICAgIGNvbnN0IG1pbGxpc1BlckRheSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gICAgaWYgKHRpbWVzdGFtcE1pbGxpcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiAoRGF0ZS5ub3coKSAtIHRpbWVzdGFtcE1pbGxpcykgLyBtaWxsaXNQZXJEYXk7XG59XG5hc3luYyBmdW5jdGlvbiBjbGVhbnVwU3RvcmFnZShwcmludGVkT2xkZXJUaGFuRGF5cykge1xuICAgIGxvZyhgW09mZk5ldHdvcmtDYWNoZTpjbGVhbnVwU3RvcmFnZV0gU3RvcmFnZSBjbGVhbnVwIHJlcXVlc3RlZCwgcHJpbnRpbmcgdGhyZXNob2xkPSR7cHJpbnRlZE9sZGVyVGhhbkRheXN9ZGF5c2ApO1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldEJ5dGVzSW5Vc2UodXNlZEJ5dGVzID0+IHtcbiAgICAgICAgbG9nKGBbT2ZmTmV0d29ya0NhY2hlOmNsZWFudXBTdG9yYWdlXSBTdG9yYWdlIGNsZWFudXAsICR7KHVzZWRCeXRlcyAvIDEwMjQpLnRvRml4ZWQoMil9S2lCIHVzZWRgKTtcbiAgICAgICAgbG9nKGBbT2ZmTmV0d29ya0NhY2hlOmNsZWFudXBTdG9yYWdlXSAke3ByaW50ZXJDYXBhYmlsaXRpZXNDYWNoZS5zaXplfSBwcmludGVyIGNhcGFiaWxpdGllcyBjYWNoZWRgKTtcbiAgICB9KTtcbiAgICBmb3IgKGNvbnN0IHByaW50ZXJJZCBvZiBwcmludGVyQ2FwYWJpbGl0aWVzQ2FjaGUua2V5cygpKSB7XG4gICAgICAgIGNvbnN0IHByaW50ZXJOYW1lID0gcHJpbnRlck5hbWVGcm9tVXJsKHByaW50ZXJJZCk7XG4gICAgICAgIGNvbnN0IHVudXNlZFByaW50ZXIgPSBwcmludGVyTmFtZSA9PSB1bmRlZmluZWQgfHwgYXdhaXQgZ2V0U2VydmVySWRGb3JQcmludGVyKHByaW50ZXJJZCkgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgcHJpbnRlZERheXMgPSBkYXlzQWdvKHByaW50ZXJUaW1lVXNlZE1hcC5nZXQocHJpbnRlcklkKSk7XG4gICAgICAgIGxldCBkaXNjYXJkID0gZmFsc2U7XG4gICAgICAgIGlmICh1bnVzZWRQcmludGVyKSB7XG4gICAgICAgICAgICBsb2coYFtPZmZOZXR3b3JrQ2FjaGU6Y2xlYW51cFN0b3JhZ2VdIERpc2NhcmRpbmcgdW51c2VkIHByaW50ZXIgY2FwYWJpbGl0eTogJHtwcmludGVyTmFtZX1gKTtcbiAgICAgICAgICAgIGRpc2NhcmQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHByaW50ZWREYXlzID09PSB1bmRlZmluZWQgfHwgcHJpbnRlZERheXMgPiBwcmludGVkT2xkZXJUaGFuRGF5cykge1xuICAgICAgICAgICAgbG9nKGBbT2ZmTmV0d29ya0NhY2hlOmNsZWFudXBTdG9yYWdlXSBEaXNjYXJkaW5nIHByaW50ZXIgY2FwYWJpbGl0eSBvbGRlciB0aGFuICR7cHJpbnRlZE9sZGVyVGhhbkRheXN9IGRheXM6IFxuXHRcdFx0JHtwcmludGVyTmFtZX0sIGxhc3QgcHJpbnRlZDogJHtwcmludGVkRGF5cyA/IHByaW50ZWREYXlzLnRvRml4ZWQoMCkgKyAnIGRheXMgYWdvJyA6ICduZXZlcid9YCk7XG4gICAgICAgICAgICBkaXNjYXJkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlzY2FyZCkge1xuICAgICAgICAgICAgcHJpbnRlclRpbWVVc2VkTWFwLmRlbGV0ZShwcmludGVySWQpO1xuICAgICAgICAgICAgcHJpbnRlckNhcGFiaWxpdGllc0NhY2hlLmRlbGV0ZShwcmludGVySWQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxvZyhgW09mZk5ldHdvcmtDYWNoZTpjbGVhbnVwU3RvcmFnZV0gJHtwcmludGVyQ2FwYWJpbGl0aWVzQ2FjaGUuc2l6ZX0gcHJpbnRlciBjYXBhYmlsaXRpZXMgYWZ0ZXIgY2xlYW4tdXBgKTtcbiAgICBQcm9taXNlLmFsbChbXG4gICAgICAgIHNhdmVNYXBUb1N0b3JhZ2Uoc3RvcmFnZUtleVByaW50ZXJUaW1lVXNlZE1hcCwgcHJpbnRlclRpbWVVc2VkTWFwKSxcbiAgICAgICAgc2F2ZU1hcFRvU3RvcmFnZShzdG9yYWdlS2V5UHJpbnRlckNhcGFiaWxpdGllc01hcCwgcHJpbnRlckNhcGFiaWxpdGllc0NhY2hlKSxcbiAgICBdKS50aGVuKCgpID0+IHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0Qnl0ZXNJblVzZShieXRlc0luVXNlID0+IHtcbiAgICAgICAgICAgIGxvZyhgW09mZk5ldHdvcmtDYWNoZTpjbGVhbnVwU3RvcmFnZV0gQ2xlYW51cCBjb21wbGV0ZSwgJHsoYnl0ZXNJblVzZSAvIDEwMjQpLnRvRml4ZWQoMil9S2lCIHVzZWRgKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlUHJpbnRlckNhY2hlKHNlcnZlcklkLCBwcmludGVycykge1xuICAgIGZvciAoY29uc3QgcHJpbnRlciBvZiBwcmludGVycykge1xuICAgICAgICBwcmludGVyQ2FwYWJpbGl0aWVzQ2FjaGUuc2V0KHByaW50ZXIuaWQsIHByaW50ZXIuY2FwYWJpbGl0aWVzKTtcbiAgICAgICAgcHJpbnRlck5hbWVUb1NlcnZlcklkQ2FjaGUuc2V0KHByaW50ZXIubmFtZSwgc2VydmVySWQpO1xuICAgIH1cbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIHNhdmVNYXBUb1N0b3JhZ2Uoc3RvcmFnZUtleVByaW50ZXJUaW1lVXNlZE1hcCwgcHJpbnRlclRpbWVVc2VkTWFwKSxcbiAgICAgICAgc2F2ZU1hcFRvU3RvcmFnZShzdG9yYWdlS2V5UHJpbnRlckNhcGFiaWxpdGllc01hcCwgcHJpbnRlckNhcGFiaWxpdGllc0NhY2hlKSxcbiAgICAgICAgc2F2ZU1hcFRvU3RvcmFnZShzdG9yYWdlS2V5UHJpbnRlclNlcnZlck1hcCwgcHJpbnRlck5hbWVUb1NlcnZlcklkQ2FjaGUpLFxuICAgIF0pLmNhdGNoKGUgPT4ge1xuICAgICAgICBlcnJvcihgRmFpbGVkIHRvIHNhdmUgZGF0YSBjYWNoZXMgdG8gc3RvcmFnZTogJHtlLm5hbWV9IC0gJHtlLm1lc3NhZ2V9YCk7XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJpbnRlckNhcGFiaWxpdGllcyhwcmludGVySWQpIHtcbiAgICBjb25zdCBjYXAgPSBwcmludGVyQ2FwYWJpbGl0aWVzQ2FjaGUuZ2V0KHByaW50ZXJJZCk7XG4gICAgaWYgKCFjYXApIHtcbiAgICAgICAgbG9nKGBDYWNoZWQgcHJpbnRlciBjYXBhYmlsaXR5IGZvciAnJHtwcmludGVySWR9JyBtaXNzaW5nIGZyb20gY2FjaGUhYCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBsb2coYEZvdW5kIGNhY2hlZCBwcmludGVyIGNhcGFiaWxpdGllcyBmb3I6ICR7cHJpbnRlcklkfSA9PiAke0pTT04uc3RyaW5naWZ5KGNhcCl9YCk7XG4gICAgcmV0dXJuIHBhcnNlTW9iaWxpdHlQcmludENhcGFiaWxpdGllcyhjYXApO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUxhc3RQcmludGVkVGltZShwcmludGVyVXJsKSB7XG4gICAgcHJpbnRlclRpbWVVc2VkTWFwLnNldChwcmludGVyVXJsLCBEYXRlLm5vdygpKTtcbiAgICBzYXZlTWFwVG9TdG9yYWdlKHN0b3JhZ2VLZXlQcmludGVyVGltZVVzZWRNYXAsIHByaW50ZXJUaW1lVXNlZE1hcClcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBsb2coYFNhdmVkIGxhc3QgcHJpbnRlZCBkYXRlIGZvcjogJHtwcmludGVyVXJsfWApO1xuICAgIH0pO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNlcnZlcklkRm9yUHJpbnRlcihwcmludGVyVXJsKSB7XG4gICAgY29uc3QgcHJpbnRlck5hbWUgPSBwcmludGVyTmFtZUZyb21VcmwocHJpbnRlclVybCk7XG4gICAgaWYgKCFwcmludGVyTmFtZSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjb25zdCByZWFkeSA9IGF3YWl0IHdhaXRGb3JDb25kaXRpb24oKCkgPT4ge1xuICAgICAgICBsb2coJ1tPZmZOZXR3b3JrQ2FjaGU6Z2V0U2VydmVySWRGb3JQcmludGVyXSBXYWl0aW5nIGZvciBjYWNoZSB0byBiZSBsb2FkZWQgYW5kIHJlYWR5Li4uJyk7XG4gICAgICAgIHJldHVybiBjYWNoZUxvYWRlZDtcbiAgICB9KTtcbiAgICBpZiAoIXJlYWR5KSB7XG4gICAgICAgIGVycm9yKCdbT2ZmTmV0d29ya0NhY2hlOmdldFNlcnZlcklkRm9yUHJpbnRlcl0gR2l2aW5nIHVwIHdhaXRlZCBmb3IgY2FjaGUgdG8gYmUgcmVhZHkuLi4nKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZm9yIChjb25zdCBbY2FjaGVkUHJpbnRlck5hbWUsIHNlcnZlcklkXSBvZiBwcmludGVyTmFtZVRvU2VydmVySWRDYWNoZSkge1xuICAgICAgICBpZiAoY2FjaGVkUHJpbnRlck5hbWUuc3RhcnRzV2l0aChwcmludGVyTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZXJJZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuZnVuY3Rpb24gcHJpbnRlck5hbWVGcm9tVXJsKHByaW50ZXJVcmwpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB1cmxQYXRoID0gbmV3IFVSTChwcmludGVyVXJsKS5wYXRobmFtZTtcbiAgICAgICAgY29uc3QgbGFzdFNsYXNoID0gdXJsUGF0aC5sYXN0SW5kZXhPZignLycpO1xuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHVybFBhdGguc3Vic3RyaW5nKGxhc3RTbGFzaCArIDEpKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3IoYENhbm5vdCBmaW5kIHByaW50ZXIgbmFtZSAtIGludmFsaWQgVVJMOiAke3ByaW50ZXJVcmx9YCwgZSk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ0xJRU5UX0FQSV9CQVNFX1VSTF9URVNULCBNb2JSVENDbGllbnRCdWlsZGVyIH0gZnJvbSAnLi4vY2xvdWRwcmludCc7XG5pbXBvcnQgeyBHZXRDbGllbnRWZXJzaW9uSUQgfSBmcm9tICcuLi9nbG9iYWxzJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4uL2xvZyc7XG5pbXBvcnQgeyBnZXRTZXJ2ZXJJZFRvQ2xpZW50Q2FjaGUgfSBmcm9tICcuL29mZm5ldHdvcmtjYWNoZSc7XG5jb25zdCBDTE9VRF9QUklOVF9FUlIgPSAnQ2xvdWQgUHJpbnQgZXJyb3InO1xubmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIub25tZXNzYWdlID0gZSA9PiB7XG4gICAgc3dpdGNoIChlLmRhdGEuTXNnVHlwZSkge1xuICAgICAgICBjYXNlICdnZXQtcHJpbnRlcnMtZnJvbS1zZXJ2ZXInOiB7XG4gICAgICAgICAgICBnZXRQcmludGVyc0Zyb21TZXJ2ZXIoZS5kYXRhLlNlcnZlcklELCBlLmRhdGEuQ2xpZW50SUQsIGUuZGF0YS5UZXN0RW52LCBlLmRhdGEuU2hhcmVUb2tlbiwgZS5kYXRhLlByaW50VG9rZW4pLnRoZW4oZnVuY3Rpb24gKHByaW50ZXJzKSB7XG4gICAgICAgICAgICAgICAgbG9nKGBbT0ZGU0NSRUVOXSBSZXR1cm5pbmcgJHtwcmludGVycy5sZW5ndGh9IGNsb3VkIHByaW50ZXJzIHRvIHNlcnZpY2Ugd29ya2VyLmAsIHByaW50ZXJzKTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlU2VydmljZVdvcmtlcihlLCB0cnVlLCBwcmludGVycyk7XG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAocmVqZWN0UmVhc29uKSB7XG4gICAgICAgICAgICAgICAgbG9nKGBbT0ZGU0NSRUVOXSBnZXRQcmludGVyc0Zyb21TZXJ2ZXIoKSByZWplY3QgcmVzcG9uc2UgdG8gc2VydmljZSB3b3JrZXIgKHJlYXNvbjogJHtyZWplY3RSZWFzb259KWApO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VTZXJ2aWNlV29ya2VyKGUsIGZhbHNlLCByZWplY3RSZWFzb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdnZXQtcHJpbnRlci1pbmZvLXJ0Yyc6IHtcbiAgICAgICAgICAgIGdldFByaW50ZXJJbmZvUlRDKGUuZGF0YS5QcmludGVySUQsIGUuZGF0YS5TZXJ2ZXJJRCwgZS5kYXRhLkNsaWVudElELCBlLmRhdGEuVGVzdEVudiwgZS5kYXRhLlNoYXJlVG9rZW4sIGUuZGF0YS5QcmludFRva2VuKS50aGVuKGZ1bmN0aW9uIChjYXBhYmlsaXRpZXMpIHtcbiAgICAgICAgICAgICAgICBsb2coYFtPRkZTQ1JFRU5dIFJldHVybmluZyBwcmludGVyICcke2UuZGF0YS5QcmludGVySUR9IGNhcGFiaWxpdGllcyB0byBzZXJ2aWNlIHdvcmtlci5gLCBjYXBhYmlsaXRpZXMpO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VTZXJ2aWNlV29ya2VyKGUsIHRydWUsIGNhcGFiaWxpdGllcyk7XG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAocmVqZWN0UmVhc29uKSB7XG4gICAgICAgICAgICAgICAgbG9nKGBbT0ZGU0NSRUVOXSBnZXRQcmludGVySW5mb1JUQygpIHJlamVjdCByZXNwb25zZSB0byBzZXJ2aWNlIHdvcmtlciAocmVhc29uOiAke3JlamVjdFJlYXNvbn0pYCk7XG4gICAgICAgICAgICAgICAgbWVzc2FnZVNlcnZpY2VXb3JrZXIoZSwgZmFsc2UsIHJlamVjdFJlYXNvbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ3N1Ym1pdC1wcmludC1qb2ItcnRjJzoge1xuICAgICAgICAgICAgc3VibWl0UHJpbnRKb2JSVEMoZS5kYXRhLkZpbGVEYXRhLCBlLmRhdGEuUHJpbnRlclVSTCwgZS5kYXRhLlBhcmFtcywgZS5kYXRhLlNlcnZlcklELCBlLmRhdGEuQ2xpZW50SUQsIGUuZGF0YS5UZXN0RW52LCBlLmRhdGEuU2hhcmVUb2tlbiwgZS5kYXRhLlByaW50VG9rZW4pLnRoZW4oZnVuY3Rpb24gKGpvYkRldGFpbHMpIHtcbiAgICAgICAgICAgICAgICBsb2coYFtPRkZTQ1JFRU5dIFJldHVybmluZyAke2UuZGF0YS5QcmludGVyVVJMfSBqb2IgZGV0YWlscyB0byBzZXJ2aWNlIHdvcmtlci5gKTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlU2VydmljZVdvcmtlcihlLCB0cnVlLCBqb2JEZXRhaWxzKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChyZWplY3RSZWFzb24pIHtcbiAgICAgICAgICAgICAgICBsb2coYFtPRkZTQ1JFRU5dIHN1Ym1pdFByaW50Sm9iUlRDKCkgcmVqZWN0IHJlc3BvbnNlIHRvIHNlcnZpY2Ugd29ya2VyIChyZWFzb246ICR7cmVqZWN0UmVhc29ufSlgKTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlU2VydmljZVdvcmtlcihlLCBmYWxzZSwgcmVqZWN0UmVhc29uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnZ2V0LWV4Y2gtcHJpbnQtdG9rZW4nOiB7XG4gICAgICAgICAgICBnZXRPckV4Y2hhbmdlUHJpbnRUb2tlbihlLmRhdGEuU2VydmVySUQsIGUuZGF0YS5DbGllbnRJRCwgZS5kYXRhLlRlc3RFbnYsIGUuZGF0YS5TaGFyZVRva2VuLCBlLmRhdGEuUHJpbnRUb2tlbikudGhlbihmdW5jdGlvbiAocHJpbnRUb2tlbikge1xuICAgICAgICAgICAgICAgIGxvZyhgW09GRlNDUkVFTl0gUmV0dXJuaW5nICR7ZS5kYXRhLlNlcnZlcklEfSBwcmludCB0b2tlbiB0byBzZXJ2aWNlIHdvcmtlci5gKTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlU2VydmljZVdvcmtlcihlLCB0cnVlLCBwcmludFRva2VuKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChyZWplY3RSZWFzb24pIHtcbiAgICAgICAgICAgICAgICBsb2coYFtPRkZTQ1JFRU5dIGdldE9yRXhjaGFuZ2VQcmludFRva2VuKCkgcmVqZWN0IHJlc3BvbnNlIHRvIHNlcnZpY2Ugd29ya2VyIChyZWFzb246ICR7cmVqZWN0UmVhc29ufSlgKTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlU2VydmljZVdvcmtlcihlLCBmYWxzZSwgcmVqZWN0UmVhc29uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnZ2V0LXNlcnZlci1pbmZvLXJ0Yyc6IHtcbiAgICAgICAgICAgIGdldFNlcnZlckluZm9SVEMoZS5kYXRhLlNlcnZlcklELCBlLmRhdGEuQ2xpZW50SUQsIGUuZGF0YS5UZXN0RW52LCBlLmRhdGEuU2hhcmVUb2tlbiwgZS5kYXRhLlByaW50VG9rZW4pLnRoZW4oZnVuY3Rpb24gKHNlcnZlckluZm8pIHtcbiAgICAgICAgICAgICAgICBsb2coYFtPRkZTQ1JFRU5dIFJldHVybmluZyAke2UuZGF0YS5TZXJ2ZXJJRH0gc2VydmVyIGluZm8gdG8gc2VydmljZSB3b3JrZXIuYCwgc2VydmVySW5mbyk7XG4gICAgICAgICAgICAgICAgbWVzc2FnZVNlcnZpY2VXb3JrZXIoZSwgdHJ1ZSwgc2VydmVySW5mbyk7XG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAocmVqZWN0UmVhc29uKSB7XG4gICAgICAgICAgICAgICAgbG9nKGBbT0ZGU0NSRUVOXSBnZXRTZXJ2ZXJJbmZvUlRDKCkgcmVqZWN0IHJlc3BvbnNlIHRvIHNlcnZpY2Ugd29ya2VyIChyZWFzb246ICR7cmVqZWN0UmVhc29ufSlgKTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlU2VydmljZVdvcmtlcihlLCBmYWxzZSwgcmVqZWN0UmVhc29uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGxvZyhgW09GRlNDUkVFTl0gcmVjZWl2ZWQgdW5leHBlY3RlZCBtZXNzYWdlIGZyb20gc2VydmljZSB3b3JrZXI6ICR7SlNPTi5zdHJpbmdpZnkoZS5kYXRhKX1gKTtcbiAgICB9XG59O1xuZnVuY3Rpb24gbWVzc2FnZVNlcnZpY2VXb3JrZXIoZSwgcmVzcG9uc2VTdWNjZXNzLCByZXNwb25zZURhdGEpIHtcbiAgICBlLnBvcnRzWzBdLnBvc3RNZXNzYWdlKHsgUmVzcFN0YXRlOiByZXNwb25zZVN1Y2Nlc3MsIFJlc3BEYXRhOiByZXNwb25zZURhdGEgfSk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRNb2JSVENDbGllbnQoc2VydmVySWQsIGNsaWVudElkLCB0ZXN0RW52LCBzaGFyZVRva2VuLCBwcmludFRva2VuKSB7XG4gICAgbG9nKGBbT0ZGU0NSRUVOXSBHZXR0aW5nIE1vYmlsaXR5IENsb3VkIGNsaWVudCBmb3Igc2VydmVyICcke3NlcnZlcklkfScgLi4uYCk7XG4gICAgY29uc3QgY2xpZW50ID0gZ2V0U2VydmVySWRUb0NsaWVudENhY2hlKCkuZ2V0KHNlcnZlcklkKTtcbiAgICBpZiAoY2xpZW50ICYmIGNsaWVudC5pc1JlYWR5KCkpIHtcbiAgICAgICAgbG9nKGBbT0ZGU0NSRUVOXSBVc2luZyBjYWNoZWQgQ2xvdWQgUHJpbnQgY2xpZW50OiAke2NsaWVudC5nZXRJRCgpfSBmb3Igc2VydmVyOiAke3NlcnZlcklkfWApO1xuICAgICAgICByZXR1cm4gY2xpZW50O1xuICAgIH1cbiAgICBlbHNlIGlmIChjbGllbnQpIHtcbiAgICAgICAgbG9nKGBbT0ZGU0NSRUVOXSBJZ25vcmluZyBzdGFsZSBDbG91ZCBQcmludCBjbGllbnQ6ICR7Y2xpZW50LmdldElEKCl9IGZvciBzZXJ2ZXI6ICR7c2VydmVySWR9YCk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVNb2JSVENDbGllbnQoc2VydmVySWQsIGNsaWVudElkLCB0ZXN0RW52LCBzaGFyZVRva2VuLCBwcmludFRva2VuKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU1vYlJUQ0NsaWVudChzZXJ2ZXJJZCwgY2xpZW50SWQsIHRlc3RFbnYsIHNoYXJlVG9rZW4sIHByaW50VG9rZW4pIHtcbiAgICBjb25zdCBjbGllbnRCdWlsZGVyID0gbmV3IE1vYlJUQ0NsaWVudEJ1aWxkZXIoc2VydmVySWQpLnNldENsaWVudElkKGNsaWVudElkKTtcbiAgICBsb2coYFtPRkZTQ1JFRU5dIGNyZWF0ZU1vYlJUQ0NsaWVudCgpOiBjbGllbnRCdWlsZGVyIGluaXRpYWxpemVkOiBcblx0XHRzZXJ2ZXJJZD0ke3NlcnZlcklkfSwgY2xpZW50SWQ9JHtjbGllbnRJZH0sIGNsaWVudFZlcnNpb25JZD0ke0dldENsaWVudFZlcnNpb25JRCgpfWApO1xuICAgIGlmICh0ZXN0RW52KSB7XG4gICAgICAgIGNsaWVudEJ1aWxkZXIuc2V0QmFzZVVybChDTElFTlRfQVBJX0JBU0VfVVJMX1RFU1QpO1xuICAgIH1cbiAgICBpZiAocHJpbnRUb2tlbikge1xuICAgICAgICBjbGllbnRCdWlsZGVyLnNldFByaW50VG9rZW4ocHJpbnRUb2tlbik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjbGllbnRCdWlsZGVyLnNldFNoYXJlVG9rZW4oc2hhcmVUb2tlbik7XG4gICAgfVxuICAgIGxldCBjbGllbnQ7XG4gICAgdHJ5IHtcbiAgICAgICAgY2xpZW50ID0gYXdhaXQgY2xpZW50QnVpbGRlci5idWlsZCgpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBsb2coYFtPRkZTQ1JFRU5dIEVSUk9SOiBDb3VsZCBub3QgY3JlYXRlIE1vYmlsaXR5IENsb3VkIFByaW50IGNsaWVudDogJHtzZXJ2ZXJJZH0gKGVycm9yOiBgICsgZSArICcpJyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtDTE9VRF9QUklOVF9FUlJ9OiBDb3VsZCBub3QgY29ubmVjdDogJHtlfWApO1xuICAgIH1cbiAgICBsb2coJ1tPRkZTQ1JFRU5dIGNyZWF0ZU1vYlJUQ0NsaWVudCgpOiBjbGllbnRCdWlsZGVyIGNvbXBsZXRlZC4nLCBjbGllbnQpO1xuICAgIGdldFNlcnZlcklkVG9DbGllbnRDYWNoZSgpLnNldChzZXJ2ZXJJZCwgY2xpZW50KTtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBzZXJ2ZXJJbmZvID0gYXdhaXQgY2xpZW50LmdldFNlcnZlckluZm8oKTtcbiAgICAgICAgbG9nKCdbT0ZGU0NSRUVOXSBjcmVhdGVNb2JSVENDbGllbnQoKTogc2VydmVySW5mbyBvYnRhaW5lZCcsIHNlcnZlckluZm8pO1xuICAgICAgICBzZW5kVG9TZXJ2aWNlV29ya2VyKCdjYWNoZS1zZXJ2ZXItaW5mbycsIHsgU2VydmVySUQ6IHNlcnZlcklkLCBTZXJ2ZXJJbmZvOiBzZXJ2ZXJJbmZvIH0pO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBsb2coJ1tPRkZTQ1JFRU5dIEVycm9yOiBjb3VsZCBub3Qgb2J0YWluIHNlcnZlciBpbmZvIGZvciBjYWNoZSB1cGRhdGU6ICcgKyBlKTtcbiAgICB9XG4gICAgcmV0dXJuIGNsaWVudDtcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTZXJ2ZXJJbmZvUlRDKHNlcnZlcklkLCBjbGllbnRJZCwgdGVzdEVudiwgc2hhcmVUb2tlbiwgcHJpbnRUb2tlbikge1xuICAgIGxldCBjbGllbnQ7XG4gICAgdHJ5IHtcbiAgICAgICAgY2xpZW50ID0gYXdhaXQgZ2V0TW9iUlRDQ2xpZW50KHNlcnZlcklkLCBjbGllbnRJZCwgdGVzdEVudiwgc2hhcmVUb2tlbiwgcHJpbnRUb2tlbik7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGxvZygnW09GRlNDUkVFTjpnZXRTZXJ2ZXJJbmZvUlRDXSBDbG91ZCBQcmludCBjb25uZWN0aW9uIGNhbiBub3QgYmUgZXN0YWJsaXNoZWQ6ICcgKyBlKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW4gbm90IGdldCBzZXJ2ZXIgaW5mbyBmcm9tIGNsb3VkIGNvbm5lY3Rpb24nKTtcbiAgICB9XG4gICAgY29uc3Qgc2VydmVySW5mbyA9IGF3YWl0IGNsaWVudC5nZXRTZXJ2ZXJJbmZvKCk7XG4gICAgbG9nKCdbT0ZGU0NSRUVOOmdldFNlcnZlckluZm9SVENdIFJlY2VpdmVkIHNlcnZlciBpbmZvOiAnICsgc2VydmVySW5mbyk7XG4gICAgcmV0dXJuIHNlcnZlckluZm87XG59XG5hc3luYyBmdW5jdGlvbiBnZXRPckV4Y2hhbmdlUHJpbnRUb2tlbihzZXJ2ZXJJZCwgY2xpZW50SWQsIHRlc3RFbnYsIHNoYXJlVG9rZW4sIHByaW50VG9rZW4pIHtcbiAgICBsZXQgY2xpZW50O1xuICAgIHRyeSB7XG4gICAgICAgIGNsaWVudCA9IGF3YWl0IGdldE1vYlJUQ0NsaWVudChzZXJ2ZXJJZCwgY2xpZW50SWQsIHRlc3RFbnYsIHNoYXJlVG9rZW4sIHByaW50VG9rZW4pO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBsb2coJ1tPRkZTQ1JFRU46Z2V0U2VydmVySW5mb1JUQ10gRVJST1IgY3JlYXRpbmcgTW9iaWxpdHkgUlRDIENsaWVudDogJyArIGUpO1xuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgY2xpZW50LmdldFByaW50VG9rZW4oc2hhcmVUb2tlbik7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3VibWl0UHJpbnRKb2JSVEMoZmlsZSwgcHJpbnRlclVybCwgcGFyYW1zLCBzZXJ2ZXJJZCwgY2xpZW50SWQsIHRlc3RFbnYsIHNoYXJlVG9rZW4sIHByaW50VG9rZW4pIHtcbiAgICBsZXQgY2xpZW50O1xuICAgIHRyeSB7XG4gICAgICAgIGNsaWVudCA9IGF3YWl0IGdldE1vYlJUQ0NsaWVudChzZXJ2ZXJJZCwgY2xpZW50SWQsIHRlc3RFbnYsIHNoYXJlVG9rZW4sIHByaW50VG9rZW4pO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBsb2coJ1tPRkZTQ1JFRU46c3VibWl0UHJpbnRKb2JSVENdIENsb3VkIFByaW50IGNvbm5lY3Rpb24gY2FuIG5vdCBiZSBlc3RhYmxpc2hlZDogJyArIGUpO1xuICAgICAgICB0aHJvdyBlO1xuICAgIH1cbiAgICBpZiAocHJpbnRUb2tlbikge1xuICAgICAgICBsb2coYFtPRkZTQ1JFRU46c3VibWl0UHJpbnRKb2JSVENdIGdvdCBjYWNoZWQgcHJpbnQgdG9rZW4gZm9yOiAke3NlcnZlcklkfWApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcHJpbnRUb2tlbiA9IGF3YWl0IGV4Y2hhbmdlUHJpbnRUb2tlbihzZXJ2ZXJJZCwgcHJpbnRUb2tlbiwgY2xpZW50LCBzaGFyZVRva2VuKTtcbiAgICB9XG4gICAgbGV0IGpvYkRldGFpbHM7XG4gICAgdHJ5IHtcbiAgICAgICAgam9iRGV0YWlscyA9IGF3YWl0IGNsaWVudC5zZW5kUHJpbnRKb2JEZXRhaWxzKHByaW50VG9rZW4sIHByaW50ZXJVcmwsIHBhcmFtcywgZmlsZS5zaXplKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nKCdbT0ZGU0NSRUVOOnN1Ym1pdFByaW50Sm9iUlRDXSBFUlJPUjogc2VuZFByaW50Sm9iRGV0YWlscyBmYWlsZWQ6ICcgKyBlKTtcbiAgICAgICAgc2VuZFRvU2VydmljZVdvcmtlcignZGVsZXRlLXByaW50LXRva2VuLWNhY2hlJywgeyBTZXJ2ZXJJRDogc2VydmVySWQsIFNoYXJlVG9rZW46IHNoYXJlVG9rZW4gfSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtDTE9VRF9QUklOVF9FUlJ9OiAke2V9YCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNsaWVudC5zZW5kUHJpbnRKb2IoZmlsZSk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGxvZygnW09GRlNDUkVFTjpzdWJtaXRQcmludEpvYlJUQ10gRVJST1I6IHNlbmRQcmludEpvYiBmYWlsZWQ6ICcgKyBlKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke0NMT1VEX1BSSU5UX0VSUn06ICR7ZX1gKTtcbiAgICB9XG4gICAgbG9nKCdbT0ZGU0NSRUVOOnN1Ym1pdFByaW50Sm9iUlRDXSBjb21wbGV0ZWQgam9iIHN1Ym1pc3Npb24uJyk7XG4gICAgcmV0dXJuIGpvYkRldGFpbHM7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UHJpbnRlckluZm9SVEMocHJpbnRlcklkLCBzZXJ2ZXJJZCwgY2xpZW50SWQsIHRlc3RFbnYsIHNoYXJlVG9rZW4sIHByaW50VG9rZW4pIHtcbiAgICBsb2coJ1tPRkZTQ1JFRU5dIFJlcXVlc3RpbmcgcHJpbnRlciBjYXBhYmlsaXRpZXMgdmlhIFJUQyAoU2VydmVySUQ6ICcgKyBzZXJ2ZXJJZCArICcgUHJpbnRlcklEOiAnICsgcHJpbnRlcklkKTtcbiAgICBsZXQgY2xpZW50O1xuICAgIHRyeSB7XG4gICAgICAgIGNsaWVudCA9IGF3YWl0IGdldE1vYlJUQ0NsaWVudChzZXJ2ZXJJZCwgY2xpZW50SWQsIHRlc3RFbnYsIHNoYXJlVG9rZW4sIHByaW50VG9rZW4pO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBsb2coJ1tPRkZTQ1JFRU5dIEVSUk9SIGNyZWF0aW5nIE1vYmlsaXR5IFJUQyBDbGllbnQ6ICcgKyBlKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW4gbm90IGdldCBjYXBhYmlsaXRpZXMgZnJvbSBjbG91ZCBjb25uZWN0aW9uJyk7XG4gICAgfVxuICAgIGNvbnN0IGNhcGFiaWxpdGllcyA9IGF3YWl0IGNsaWVudC5nZXRDYXBhYmlsaXRpZXMocHJpbnRlcklkKTtcbiAgICBsb2coJ1tPRkZTQ1JFRU5dIFJlY2VpdmVkIHByaW50ZXIgY2FwYWJpbGl0aWVzOiAnICsgSlNPTi5zdHJpbmdpZnkoY2FwYWJpbGl0aWVzKSk7XG4gICAgcmV0dXJuIGNhcGFiaWxpdGllcztcbn1cbmFzeW5jIGZ1bmN0aW9uIGV4Y2hhbmdlUHJpbnRUb2tlbihzZXJ2ZXJJZCwgcHJpbnRUb2tlbiwgY2xpZW50LCBzaGFyZVRva2VuKSB7XG4gICAgcHJpbnRUb2tlbiA9IGF3YWl0IGNsaWVudC5nZXRQcmludFRva2VuKHNoYXJlVG9rZW4pO1xuICAgIHNlbmRUb1NlcnZpY2VXb3JrZXIoJ3VwZGF0ZS1wcmludC10b2tlbi1jYWNoZScsIHsgU2VydmVySUQ6IHNlcnZlcklkLCBTaGFyZVRva2VuOiBzaGFyZVRva2VuLCBQcmludFRva2VuOiBwcmludFRva2VuIH0pO1xuICAgIHJldHVybiBwcmludFRva2VuO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0UHJpbnRlcnNGcm9tU2VydmVyKHNlcnZlcklkLCBjbGllbnRJZCwgdGVzdEVudiwgc2hhcmVUb2tlbiwgcHJpbnRUb2tlbikge1xuICAgIGxldCBjbGllbnQ7XG4gICAgdHJ5IHtcbiAgICAgICAgbG9nKGBbT0ZGU0NSRUVOOmdldFByaW50ZXJzRnJvbVNlcnZlcl0gc2VydmVySWQ9JHtzZXJ2ZXJJZH1gKTtcbiAgICAgICAgY2xpZW50ID0gYXdhaXQgZ2V0TW9iUlRDQ2xpZW50KHNlcnZlcklkLCBjbGllbnRJZCwgdGVzdEVudiwgc2hhcmVUb2tlbiwgcHJpbnRUb2tlbik7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGxvZygnW09GRlNDUkVFTjpnZXRQcmludGVyc0Zyb21TZXJ2ZXJdIEVSUk9SIGNyZWF0aW5nIE1vYmlsaXR5IENMb3VkIENsaWVudDogJyArIGUpO1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmIChwcmludFRva2VuKSB7XG4gICAgICAgIGxvZyhgW09GRlNDUkVFTjpnZXRQcmludGVyc0Zyb21TZXJ2ZXJdIGdvdCBjYWNoZWQgcHJpbnQgdG9rZW4gZm9yOiAke3NlcnZlcklkfWApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcHJpbnRUb2tlbiA9IGF3YWl0IGV4Y2hhbmdlUHJpbnRUb2tlbihzZXJ2ZXJJZCwgcHJpbnRUb2tlbiwgY2xpZW50LCBzaGFyZVRva2VuKTtcbiAgICB9XG4gICAgbGV0IHByaW50ZXJzO1xuICAgIHRyeSB7XG4gICAgICAgIHByaW50ZXJzID0gYXdhaXQgY2xpZW50LmdldFByaW50ZXJzKHByaW50VG9rZW4pO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBsb2coJ1tPRkZTQ1JFRU5dIEVycm9yIGdldHRpbmcgcHJpbnRlcnMgZnJvbSBzZXJ2ZXI6ICcgKyBlKTtcbiAgICAgICAgc2VuZFRvU2VydmljZVdvcmtlcignZGVsZXRlLXByaW50LXRva2VuLWNhY2hlJywgeyBTZXJ2ZXJJRDogc2VydmVySWQsIFNoYXJlVG9rZW46IHNoYXJlVG9rZW4gfSk7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgc2VuZFRvU2VydmljZVdvcmtlcigndXBkYXRlLXByaW50ZXItY2FjaGUnLCB7IFNlcnZlcklEOiBzZXJ2ZXJJZCwgUHJpbnRlckxpc3Q6IHByaW50ZXJzIH0pO1xuICAgIHJldHVybiBwcmludGVycztcbn1cbmZ1bmN0aW9uIHNlbmRUb1NlcnZpY2VXb3JrZXIodHlwZSwgZGF0YSkge1xuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgdHlwZSxcbiAgICAgICAgdGFyZ2V0OiAnYmFja2dyb3VuZCcsXG4gICAgICAgIGRhdGEsXG4gICAgfSk7XG59XG4iXSwibmFtZXMiOlsiY3JlYXRlU2Vzc2lvbiIsImJhc2VVcmwiLCJyZXEiLCJpbml0IiwicHJlcGFyZVJlcXVlc3RJbml0IiwiY2xpZW50VG9rZW4iLCJjbGllbnRJZCIsIm1ldGhvZCIsInJlc3BvbnNlIiwiZmV0Y2giLCJzZXNzaW9uUGF0aCIsInN0YXR1cyIsImpzb24iLCJjcmVhdGVPZmZlciIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5IiwiaWNlT2ZmZXIiLCJzZXNzaW9uSWQiLCJub3RpZnlDbGllbnRDYW5kaWRhdGVzIiwiaWNlQ2FuZGlkYXRlcyIsImdldEFuc3dlciIsImdldFNlcnZlckNhbmRpZGF0ZXMiLCJkYXRlIiwic2luY2UiLCJkZWxldGVTZXNzaW9uIiwiaGVhZGVycyIsIkhlYWRlcnMiLCJhcHBlbmQiLCJfRVhURU5TSU9OX0lEIiwiRVhURU5TSU9OX0lEIiwiX0FQUF9JRCIsIkFQUF9JRCIsIl9TRUxGX0lEIiwiU0VMRl9JRCIsIl9WRVJTSU9OIiwiVkVSU0lPTiIsImNvbnNvbGUiLCJlcnJvciIsImlzRXh0ZW5zaW9uIiwiaXNBcHAiLCJHZXRDbGllbnRWZXJzaW9uSUQiLCJpc284NjAxRGF0ZVRpbWVab25lIiwiZCIsIm9mZnNldCIsImdldFRpbWV6b25lT2Zmc2V0Iiwic2lnbiIsImdldEZ1bGxZZWFyIiwicGFkIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiZ2V0SG91cnMiLCJnZXRNaW51dGVzIiwiZ2V0U2Vjb25kcyIsIm4iLCJhYnMiLCJNYXRoIiwiZmxvb3IiLCJyZW1vdGVMb2dnaW5nIiwidW5kZWZpbmVkIiwic2VsZiIsImNocm9tZSIsInN0b3JhZ2UiLCJsb2NhbCIsImdldCIsInJlbW90ZUxvZ2dpbmdVUkwiLCJzdGFydHNXaXRoIiwibG9nIiwicmVtb3RlTG9nIiwicmVxdWVzdCIsInRhYnMiLCJxdWVyeSIsImFjdGl2ZSIsImN1cnJlbnRXaW5kb3ciLCJsZW5ndGgiLCJpZCIsImNhdGNoIiwiZSIsImlzUmVtb3RlTG9nZ2luZyIsImFyZ3MiLCJvZmZzY3JlZW5Db250ZXh0Iiwic2VuZFRvU2VydmljZVdvcmtlciIsImFwcGx5IiwiRGF0ZSIsIndhcm4iLCJydW50aW1lIiwiZ2V0TWFuaWZlc3QiLCJ0eXBlIiwiZGF0YSIsInNlbmRNZXNzYWdlIiwidGFyZ2V0IiwiREVGQVVMVF9DSFVOS19TSVpFIiwiTUlOX0NIVU5LX1NJWkUiLCJjaHVua0Jsb2IiLCJibG9iIiwiY2h1bmtTaXplIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJlbmQiLCJtaW4iLCJzaXplIiwic2xpY2UiLCJibG9iVG9BcnJheUJ1ZmZlciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZGVuZCIsInJlc3VsdCIsIm9uZXJyb3IiLCJyZWFkQXNBcnJheUJ1ZmZlciIsImJsb2JUb1N0cmluZyIsInJlYWRBc0JpbmFyeVN0cmluZyIsIk1lc3NhZ2UiLCJjb25zdHJ1Y3RvciIsImV2Iiwic3RyaW5nRGF0YSIsIkRhdGFDaGFubmVsIiwic2VydmVySWQiLCJkYXRhQ2hhbm5lbCIsImdldENodW5rU2l6ZSIsImxhYmVsIiwic2VuZEJsb2IiLCJiIiwidGhyZXNob2xkTG93IiwidGhyZXNob2xkSGlnaCIsIm1heCIsImNodW5rZWQiLCJudW1DaHVua3MiLCJjZWlsIiwibG9nRXZlcnlOQ2h1bmtzIiwiYnVmZmVyZWRBbW91bnRMb3dUaHJlc2hvbGQiLCJkZWZlcnJlZCIsInJlc29sdmVkIiwicHJvbWlzZSIsImNodW5rSWR4IiwiZmlsbEluUHJvZ3Jlc3MiLCJmaWxsVG9DYXBhY2l0eSIsImJ1ZmZlcmVkQW1vdW50IiwidmFsdWUiLCJkb25lIiwibmV4dCIsImJ1ZiIsInNlbmQiLCJvbmJ1ZmZlcmVkYW1vdW50bG93Iiwic3RhcnQiLCJub3ciLCJzZW5kU3RyaW5nIiwicyIsImlzQ2xvc2VkIiwicmVhZHlTdGF0ZSIsImNsb3NlIiwib25PcGVuIiwiZiIsIm9ub3BlbiIsIm9uTWVzc2FnZSIsIm9ubWVzc2FnZSIsIm1zZyIsImNsZWFyT25NZXNzYWdlIiwib25DbG9zZSIsIm9uY2xvc2UiLCJvbkVycm9yIiwiZGVjb2RlU2Vzc2lvbkRlc2NyaXB0aW9uIiwib2ZmZXIiLCJwYXJzZSIsImF0b2IiLCJlbmNvZGVTZXNzaW9uRGVzY3JpcHRpb24iLCJzZCIsImJ0b2EiLCJNQVhfQ0hVTktfU0laRSIsIlBlZXIiLCJpY2VDb25maWciLCJkYXRhQ2hhbm5lbHMiLCJNYXAiLCJjb25uZWN0aW9uU3RhdGVDaGFuZ2VDYWxsYmFja3MiLCJjb25uZWN0aW9uIiwiUlRDUGVlckNvbm5lY3Rpb24iLCJjcmVhdGVSVENDb25maWciLCJvbmNvbm5lY3Rpb25zdGF0ZWNoYW5nZSIsImdldFNlcnZlcklkIiwiY3JlYXRlRGF0YUNoYW5uZWwiLCJkYyIsImNoYW5uZWwiLCJiaW5kIiwic2V0Iiwic2N0cCIsIm1heE1lc3NhZ2VTaXplIiwib25EYXRhQ2hhbm5lbCIsIm9uZGF0YWNoYW5uZWwiLCJvbk5lZ290aWF0aW9uTmVlZGVkIiwib25uZWdvdGlhdGlvbm5lZWRlZCIsIm9uSUNFQ2FuZGlkYXRlIiwib25pY2VjYW5kaWRhdGUiLCJpc1BlZXJDb25uZWN0ZWQiLCJpY2VDb25uZWN0aW9uU3RhdGUiLCJjb25uZWN0aW9uU3RhdGUiLCJjcmVhdGVBbnN3ZXIiLCJvZmZlclNlc3Npb25EZXNjcmlwdGlvbiIsInNldFJlbW90ZURlc2NyaXB0aW9uIiwiYW5zd2VyIiwic2V0TG9jYWxEZXNjcmlwdGlvbiIsIm9uQ29ubmVjdGlvblN0YXRlQ2hhbmdlIiwicHVzaCIsIm9uSUNFQ29ubmVjdGlvblN0YXRlQ2hhbmdlIiwib25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UiLCJnZXRDb25uZWN0aW9uU3RhdGUiLCJnZXRJQ0VDb25uZWN0aW9uU3RhdGUiLCJsb2NhbERlc2NyaXB0aW9uIiwicmVnaXN0ZXJBbnN3ZXIiLCJhbnN3ZXJTZXNzaW9uRGVzY3JpcHRpb24iLCJhZGRJY2VDYW5kaWRhdGUiLCJjYW5kaWRhdGUiLCJnZXREYXRhQ2hhbm5lbCIsImdldFNlbGVjdGVkQ2FuZGlkYXRlUGFpciIsImljZVRyYW5zcG9ydCIsImdldElDRVRyYW5zcG9ydCIsInRyYW5zcG9ydCIsIndhaXRGb3JMaXZlQ29ubmVjdGlvbiIsIndhaXRGb3IiLCJyZXMiLCJyZWoiLCJ0aW1lb3V0Iiwic2V0VGltZW91dCIsImN0eCIsIl8iLCJjbGVhclRpbWVvdXQiLCJpY2VTZXJ2ZXJzIiwic2VydmVycyIsImljZVRyYW5zcG9ydFBvbGljeSIsIkNBUEFCSUxJVElFU19DSEFOTkVMX0xBQkVMIiwiSk9CX0NIQU5ORUxfTEFCRUwiLCJKT0JfREVUQUlMU19MQUJFTCIsIlBSSU5URVJfQ0hBTk5FTF9MQUJFTCIsIlNFUlZFUl9JTkZPX0xBQkVMIiwiVE9LRU5fQ0hBTk5FTF9MQUJFTCIsIk1vYlJUQ0NsaWVudCIsInBlZXIiLCJ2ZXJzaW9uIiwic2hvcnRUaW1lb3V0IiwiZ2V0SUQiLCJnZXRTZXJ2ZXJJbmZvIiwiZ2V0U2VydmVySW5mb0NoYW5uZWwiLCJyZWFkSnNvblJlc3BvbnNlRnJvbUNoYW5uZWwiLCJzZW5kUHJpbnRKb2JEZXRhaWxzIiwicHJpbnRUb2tlbiIsInByaW50ZXJVcmwiLCJwYXJhbXMiLCJmaWxlU2l6ZSIsImNsaWVudFZlcnNpb24iLCJnZXRKb2JEZXRhaWxzQ2hhbm5lbCIsInJlYWRDaHVua2VkUmVzcG9uc2UiLCJieXRlQXJyYXlUb1N0cmluZyIsImlzRXJyb3IiLCJFcnJvciIsInNlbmRQcmludEpvYiIsImZpbGUiLCJnZXRKb2JDaGFubmVsIiwiaXNSZWFkeSIsImdldFByaW50VG9rZW4iLCJzaGFyZVRva2VuIiwiZ2V0VG9rZW5DaGFubmVsIiwiY2h1bmtUaW1lb3V0Iiwic3RhcnRUaW1lIiwicGVyZm9ybWFuY2UiLCJvblRpbWVvdXQiLCJVaW50OEFycmF5IiwicmVkdWNlIiwicHJldiIsImNvbmNhdEJ5dGVBcnJheXMiLCJ0b0ZpeGVkIiwiY2h1bmsiLCJieXRlTGVuZ3RoIiwiZ2V0UHJpbnRlcnMiLCJnZXRQcmludGVyQ2hhbm5lbCIsInByaW50ZXJzIiwiZm9yRWFjaCIsInAiLCJlbmNvZGVVUklDb21wb25lbnQiLCJuYW1lIiwiZGVzY3JpcHRpb24iLCJnZXRDYXBhYmlsaXRpZXMiLCJwcmludGVySWQiLCJnZXRDYXBhYmlsaXRpZXNDaGFubmVsIiwidGFnIiwidXRmOGRlY29kZSIsIlRleHREZWNvZGVyIiwiZGVjb2RlIiwiaGVhZCIsInRhaWwiLCJjb25jYXRSZXN1bHQiLCJDTElFTlRfQVBJX0JBU0VfVVJMX1BST0QiLCJDTElFTlRfQVBJX0JBU0VfVVJMX1RFU1QiLCJNb2JSVENDbGllbnRCdWlsZGVyIiwic2V0Q2xpZW50SWQiLCJzZXRTaGFyZVRva2VuIiwic2V0UHJpbnRUb2tlbiIsInNldEJhc2VVcmwiLCJidWlsZCIsInJlY2VpdmVkQW5zd2VyIiwiY2xpZW50Q2FuZGlkYXRlcyIsInNlc3Npb25EZWxldGVkIiwic2Vzc2lvblBhcmFtcyIsInRoZW4iLCJwZWVyQ29ubmVjdGlvbkxpdmUiLCJzZXREYXRhQ2hhbm5lbEhhbmRsZXJzIiwicG9sbEdldEFuc3dlciIsImludGVydmFsIiwiaWNlQW5zd2VyIiwicG9sbEZvckNhbmRpZGF0ZXMiLCJzZWwiLCJyZW1vdGUiLCJyYWNlIiwibWF4Q2h1bmtTaXplIiwidGltZW91dE1zIiwidGltZSIsInNob3VsZEJyZWFrIiwidXBkYXRlZCIsImMiLCJkZWxheSIsInNldERhdGFDaGFubmVsSGFuZGxlciIsIm1lc3NhZ2UiLCJlcnJvckRldGFpbCIsImFsbCIsIm1zIiwicG9sbE9wdGlvbnMiLCJkZWZhdWx0Q29sb3JPcHRpb25zIiwiaXNfZGVmYXVsdCIsImRlZmF1bHREdXBsZXhPcHRpb25zIiwiZGVmYXVsdFBhcGVyU2l6ZSIsImRlZmF1bHRNZWRpYVNpemVzIiwid2lkdGhfbWljcm9ucyIsImhlaWdodF9taWNyb25zIiwiY3VzdG9tX2Rpc3BsYXlfbmFtZSIsInRvVXBwZXJDYXNlIiwiY3JlYXRlUHJpbnRlckNhcGFiaWxpdGllcyIsImNvbG9yT3B0aW9ucyIsImR1cGxleE9wdGlvbnMiLCJtZWRpYVNpemVzIiwicHJpbnRlciIsInN1cHBvcnRlZF9jb250ZW50X3R5cGUiLCJjb250ZW50X3R5cGUiLCJjb2xvciIsIm9wdGlvbiIsImR1cGxleCIsInBhZ2Vfb3JpZW50YXRpb24iLCJjb3BpZXMiLCJkZWZhdWx0IiwibWVkaWFfc2l6ZSIsInBhcnNlTW9iaWxpdHlQcmludENhcGFiaWxpdGllcyIsImNhcGFiaWxpdGllcyIsIm1hcCIsIm0iLCJ3aWR0aE1pY3JvbnMiLCJoZWlnaHRNaWNyb25zIiwiaXNEZWZhdWx0IiwiY3VzdG9tRGlzcGxheU5hbWUiLCJldmVyeSIsImdldExvY2FsU3RvcmFnZURhdGEiLCJsb2FkTWFwIiwic2F2ZU1hcCIsIndhaXRGb3JDb25kaXRpb24iLCJwcmludGVyQ2FwYWJpbGl0aWVzQ2FjaGUiLCJzZXJ2ZXJJZFRvQ2xpZW50Q2FjaGUiLCJzdG9yYWdlS2V5U2VydmVySWRUb0luZm9DYWNoZSIsInNlcnZlcklkVG9JbmZvQ2FjaGUiLCJzdG9yYWdlS2V5UHJpbnRlclRpbWVVc2VkTWFwIiwic3RvcmFnZUtleVByaW50ZXJDYXBhYmlsaXRpZXNNYXAiLCJzdG9yYWdlS2V5UHJpbnRlclNlcnZlck1hcCIsInN0b3JhZ2VLZXlQcmludFRva2VuQ2FjaGUiLCJwcmludGVyVGltZVVzZWRNYXAiLCJwcmludGVyTmFtZVRvU2VydmVySWRDYWNoZSIsInByaW50VG9rZW5DYWNoZSIsInN0b3JhZ2VLZXlSZWNsYWltU3RvcmFnZUxpbWl0S2IiLCJzdG9yYWdlS2V5UHJpbnRlZE9sZGVyVGhhbkRheXMiLCJyZWNsYWltU3RvcmFnZUxpbWl0S2IiLCJwcmludGVkT2xkZXJUaGFuRGF5cyIsImNhY2hlTG9hZGVkIiwiaW5pdENhY2hlIiwic3RvcmFnZUxpbWl0IiwicHJpbnRlZEFnZSIsInYiLCJwb3B1bGF0ZUNhY2hlIiwiZ2V0U2VydmVySWRUb0NsaWVudENhY2hlIiwiZ2V0U2VydmVySWRUb1NlcnZlckluZm9DYWNoZSIsImdldFByaW50ZXJOYW1lVG9TZXJ2ZXJJZENhY2hlIiwiZ2V0UHJpbnRUb2tlbkNhY2hlIiwidXBkYXRlUHJpbnRUb2tlbiIsInByaW50VG9rZW5DYWNoZUlEIiwic2F2ZU1hcFRvU3RvcmFnZSIsInVwZGF0ZVNlcnZlckluZm8iLCJzZXJ2ZXJJbmZvIiwiaWRUb1NlcnZlckluZm9DYWNoZSIsImxvYWRNYXBGcm9tU3RvcmFnZSIsImdldEJ5dGVzSW5Vc2UiLCJieXRlc0luVXNlIiwiY2xlYW51cFN0b3JhZ2UiLCJrZXkiLCJ0b01hcCIsImNvcHlUb01hcCIsInJlYXNvbiIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJzcmMiLCJkc3QiLCJjbGVhciIsImRheXNBZ28iLCJ0aW1lc3RhbXBNaWxsaXMiLCJtaWxsaXNQZXJEYXkiLCJ1c2VkQnl0ZXMiLCJrZXlzIiwicHJpbnRlck5hbWUiLCJwcmludGVyTmFtZUZyb21VcmwiLCJ1bnVzZWRQcmludGVyIiwiZ2V0U2VydmVySWRGb3JQcmludGVyIiwicHJpbnRlZERheXMiLCJkaXNjYXJkIiwiZGVsZXRlIiwidXBkYXRlUHJpbnRlckNhY2hlIiwiZ2V0UHJpbnRlckNhcGFiaWxpdGllcyIsImNhcCIsInVwZGF0ZUxhc3RQcmludGVkVGltZSIsInJlYWR5IiwiY2FjaGVkUHJpbnRlck5hbWUiLCJ1cmxQYXRoIiwiVVJMIiwicGF0aG5hbWUiLCJsYXN0U2xhc2giLCJsYXN0SW5kZXhPZiIsImRlY29kZVVSSUNvbXBvbmVudCIsInN1YnN0cmluZyIsIkNMT1VEX1BSSU5UX0VSUiIsIm5hdmlnYXRvciIsInNlcnZpY2VXb3JrZXIiLCJNc2dUeXBlIiwiZ2V0UHJpbnRlcnNGcm9tU2VydmVyIiwiU2VydmVySUQiLCJDbGllbnRJRCIsIlRlc3RFbnYiLCJTaGFyZVRva2VuIiwiUHJpbnRUb2tlbiIsIm1lc3NhZ2VTZXJ2aWNlV29ya2VyIiwicmVqZWN0UmVhc29uIiwiZ2V0UHJpbnRlckluZm9SVEMiLCJQcmludGVySUQiLCJzdWJtaXRQcmludEpvYlJUQyIsIkZpbGVEYXRhIiwiUHJpbnRlclVSTCIsIlBhcmFtcyIsImpvYkRldGFpbHMiLCJnZXRPckV4Y2hhbmdlUHJpbnRUb2tlbiIsImdldFNlcnZlckluZm9SVEMiLCJyZXNwb25zZVN1Y2Nlc3MiLCJyZXNwb25zZURhdGEiLCJwb3J0cyIsInBvc3RNZXNzYWdlIiwiUmVzcFN0YXRlIiwiUmVzcERhdGEiLCJnZXRNb2JSVENDbGllbnQiLCJ0ZXN0RW52IiwiY2xpZW50IiwiY3JlYXRlTW9iUlRDQ2xpZW50IiwiY2xpZW50QnVpbGRlciIsIlNlcnZlckluZm8iLCJleGNoYW5nZVByaW50VG9rZW4iLCJQcmludGVyTGlzdCJdLCJzb3VyY2VSb290IjoiIn0=