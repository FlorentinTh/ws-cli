class TypeHelper {
  static isString(str) {
    return Object.prototype.toString.call(str) === '[object String]';
  }

  static isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  }

  static isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  static isUndefinedOrNull(obj) {
    return obj === null || obj === undefined;
  }
}

export default TypeHelper;
