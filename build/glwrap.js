var glwrap = (function (exports) {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  /**
   * 3D vector class
   */
  var Vec3 =
  /*#__PURE__*/
  function () {
    /**
     * Creates new 3D Vector from parameters.
     * @param {Number} x
     * @param {Number} y 
     * @param {Number} z 
     */
    function Vec3(x, y, z) {
      _classCallCheck(this, Vec3);

      /** 
       * a float array storing the components of the vector.
       * this can be passed to {@link ShaderProgram} as an uniform.
       * @type {Float32Array}
       */
      this.data = new Float32Array([x || 0, y || 0, z || 0]);
    }

    _createClass(Vec3, [{
      key: "set",
      value: function set(x, y, z) {
        this.data[0] = x;
        this.data[1] = y;
        this.data[2] = z;
      }
      /**
       * Squared length of this vector. this is cheaper than {@link Vec3#length}.
       * @returns {number} squared length.
       */

    }, {
      key: "lengthSqr",
      value: function lengthSqr() {
        return this.data[0] * this.data[0] + this.data[1] * this.data[1] + this.data[2] * this.data[2];
      }
      /**
       * Length of the vector.
       * @returns {number} length
       */

    }, {
      key: "length",
      value: function length() {
        return Math.sqrt(this.lengthSqr);
      }
      /**
       * Normalizes the vector by dividing it by its own length. This ensures that the length is always one.
       */

    }, {
      key: "normalize",
      value: function normalize() {
        if (this.isZero()) {
          return;
        }

        var l = this.length();
        this.data[0] /= l;
        this.data[1] /= l;
        this.data[2] /= l;
      }
      /**
       * Dot product between this and other vector.
       * @param {Vec3} other 
       */

    }, {
      key: "dot",
      value: function dot(other) {
        return this.data[0] * other.data[0] + this.data[1] * other.data[1] + this.data[2] * other.data[2];
      }
      /**
       * Dot product from two vectors.
       * @param {Vec3} a 
       * @param {Vec3} b 
       */

    }, {
      key: "cross",

      /**
       * Set this vector to be the cross product with another.
       * @param {Vec3} other 
       */
      value: function cross(other) {
        var ax = this.data[0],
            ay = this.data[1],
            az = this.data[2];
        var bx = other.data[0],
            by = other.data[1],
            bz = other.data[2];
        this.data[0] = ay * bz - az * by;
        this.data[1] = az * bx - ax * bz;
        this.data[2] = ax * by - ay * bx;
      }
      /**
       * Cross product vector from two vectors.
       * @param {Vec3} a 
       * @param {Vec3} b 
       */

    }, {
      key: "isZero",

      /**
       * Returns true if all components are zero.
       */
      value: function isZero() {
        return this[0] == 0 && this[1] == 0 && this[2] == 0;
      }
      /**
       * Transforms this vector with the given 4x4 matrix.
       * @param {Mat4} mat 
       */

    }, {
      key: "transformMat4",
      value: function transformMat4(mat) {
        var x = this.data[0],
            y = this.data[1],
            z = this.data[2];
        var w = mat.data[3] * x + mat.data[7] * y + mat.data[11] * z + mat.data[15];
        w = w || 1.0;
        this.data[0] = (mat.data[0] * x + mat.data[4] * y + mat.data[8] * z + mat.data[12]) / w;
        this.data[1] = (mat.data[1] * x + mat.data[5] * y + mat.data[9] * z + mat.data[13]) / w;
        this.data[2] = (mat.data[2] * x + mat.data[6] * y + mat.data[10] * z + mat.data[14]) / w;
      }
      /**
       * 
       * @param {Vec3} other 
       */

    }, {
      key: "copy",
      value: function copy(other) {
        this.data.set(other.data);
      }
    }, {
      key: "x",
      get: function get() {
        return this.data[0];
      },
      set: function set(val) {
        this.data[0] = val;
      }
    }, {
      key: "y",
      get: function get() {
        return this.data[1];
      },
      set: function set(val) {
        this.data[1] = val;
      }
    }, {
      key: "z",
      get: function get() {
        return this.data[2];
      },
      set: function set(val) {
        this.data[2] = val;
      }
    }], [{
      key: "dot",
      value: function dot(a, b) {
        return a.data[0] * b.data[0] + a.data[1] * b.data[1] + a.data[2] * b.data[2];
      }
    }, {
      key: "cross",
      value: function cross(a, b) {
        var ax = a.data[0],
            ay = a.data[1],
            az = a.data[2];
        var bx = b.data[0],
            by = b.data[1],
            bz = b.data[2];
        return new Vec3(ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx);
      }
    }]);

    return Vec3;
  }();

  var tmpvec = new Vec3();
  var xvec = new Vec3(1, 0, 0);
  var yvec = new Vec3(0, 1, 0);
  /**
   * Quaternion rotation
   */

  var Quat =
  /*#__PURE__*/
  function () {
    /**
     * Creates a new identity quaternion.
     */
    function Quat() {
      _classCallCheck(this, Quat);

      this.data = new Float32Array([0, 0, 0, 1]);
    }
    /**
     * sets this quaternion from axis and angle.
     * @param {Vec3} axis axis of rotation
     * @param {Number} angle angle in radians 
     */


    _createClass(Quat, [{
      key: "setAxisAngle",
      value: function setAxisAngle(axis, angle) {
        angle = angle * 0.5;
        var s = Math.sin(angle);
        this.data[0] = s * axis.data[0];
        this.data[1] = s * axis.data[1];
        this.data[2] = s * axis.data[2];
        this.data[3] = Math.cos(angle);
      }
      /**
       * Calculates this quaternion from euler angles.
       * @param {Number} x 
       * @param {Number} y 
       * @param {Number} z 
       */

    }, {
      key: "setEuler",
      value: function setEuler(x, y, z) {
        var halfToRad = 0.5 * Math.PI / 180.0;
        x *= halfToRad;
        y *= halfToRad;
        z *= halfToRad;
        var sx = Math.sin(x);
        var cx = Math.cos(x);
        var sy = Math.sin(y);
        var cy = Math.cos(y);
        var sz = Math.sin(z);
        var cz = Math.cos(z);
        this.data[0] = sx * cy * cz - cx * sy * sz;
        this.data[1] = cx * sy * cz + sx * cy * sz;
        this.data[2] = cx * cy * sz - sx * sy * cz;
        this.data[3] = cx * cy * cz + sx * sy * sz;
      }
      /**
       * Multiplies this quaternion with another.
       * @param {Quat} other quaternion.
       */

    }, {
      key: "multiply",
      value: function multiply(other) {
        var ax = this.data[0],
            ay = this.data[1],
            az = this.data[2],
            aw = this.data[3];
        var bx = other.data[0],
            by = other.data[1],
            bz = other.data[2],
            bw = other.data[3];
        this.data[0] = ax * bw + aw * bx + ay * bz - az * by;
        this.data[1] = ay * bw + aw * by + az * bx - ax * bz;
        this.data[2] = az * bw + aw * bz + ax * by - ay * bx;
        this.data[3] = aw * bw - ax * bx - ay * by - az * bz;
      }
      /**
       * Rotate this quaternion on the X axis
       * @param {Number} rad radians to rotate by
       */

    }, {
      key: "rotateX",
      value: function rotateX(rad) {
        rad *= 0.5;
        var ax = this.data[0],
            ay = this.data[1],
            az = this.data[2],
            aw = this.data[3];
        var bx = Math.sin(rad),
            bw = Math.cos(rad);
        this.data[0] = ax * bw + aw * bx;
        this.data[1] = ay * bw + az * bx;
        this.data[2] = az * bw - ay * bx;
        this.data[3] = aw * bw - ax * bx;
      }
      /**
       * Rotate this quaternion on the Y axis
       * @param {Number} rad radians to rotate by
       */

    }, {
      key: "rotateY",
      value: function rotateY(rad) {
        rad *= 0.5;
        var ax = this.data[0],
            ay = this.data[1],
            az = this.data[2],
            aw = this.data[3];
        var by = Math.sin(rad),
            bw = Math.cos(rad);
        this.data[0] = ax * bw - az * by;
        this.data[1] = ay * bw + aw * by;
        this.data[2] = az * bw + ax * by;
        this.data[3] = aw * bw - ay * by;
      }
      /**
       * Rotate this quaternion on the Z axis
       * @param {Number} rad radians to rotate by
       */

    }, {
      key: "rotateZ",
      value: function rotateZ(rad) {
        rad *= 0.5;
        var ax = this.data[0],
            ay = this.data[1],
            az = this.data[2],
            aw = this.data[3];
        var bz = Math.sin(rad),
            bw = Math.cos(rad);
        this.data[0] = ax * bw + ay * bz;
        this.data[1] = ay * bw - ax * bz;
        this.data[2] = az * bw + aw * bz;
        this.data[3] = aw * bw - az * bz;
      }
    }, {
      key: "rotationTo",
      value: function rotationTo(v0, v1) {
        var dot = Vec3.dot(v0, v1);

        if (dot < -0.999999) {
          tmpvec.cross(xvec, v0);
          if (tmpvec.length() < 0.000001) tmpvec.cross(yvec, v0);
          tmpvec.normalize();
          this.setAxisAngle(tmpvec, Math.PI);
        } else if (dot > 0.999999) {
          this.data[0] = 0;
          this.data[1] = 0;
          this.data[2] = 0;
          this.data[3] = 1;
        } else {
          v0.cross(v1);
          this.data[0] = v0.data[0];
          this.data[1] = v0.data[1];
          this.data[2] = v0.data[2];
          this.data[3] = 1 + dot;
          this.normalize();
        }
      }
    }, {
      key: "length",
      value: function length() {
        var l = this.data[0] * this.data[0] + this.data[1] * this.data[1] + this.data[2] * this.data[2] + this.data[3] * this.data[3];

        if (l > 0) {
          return Math.sqrt(l);
        } else {
          return 0;
        }
      }
    }, {
      key: "normalize",
      value: function normalize() {
        var l = this.data[0] * this.data[0] + this.data[1] * this.data[1] + this.data[2] * this.data[2] + this.data[3] * this.data[3];

        if (l > 0) {
          l = 1 / Math.sqrt(l);
          this.data[0] *= l;
          this.data[1] *= l;
          this.data[2] *= l;
          this.data[3] *= l;
        }
      }
    }]);

    return Quat;
  }();

  /**
   * 4 x 4 Matrix
   * @example
   * // creates a transformation matrix with translation (3,5,4)
   * let modelMatrix = new Mat4();
   * modelMatrix.trs(
   *      new Vec3(3,5,4),
   *      new Quat(),
   *      new Vec3(1,1,1)
   * );
   */
  var Mat4 =
  /*#__PURE__*/
  function () {
    /**
     * Creates new identity matrix.
     */
    function Mat4() {
      _classCallCheck(this, Mat4);

      /**
       * Array containing all 16 matrix values.
       * this can be passed to {@link ShaderProgram} as uniform.
       * @type {Float32Array}
       */
      this.data = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
    /**
     * Sets matrix values to identity
     */


    _createClass(Mat4, [{
      key: "identity",
      value: function identity() {
        this.data[0] = 1;
        this.data[1] = 0;
        this.data[2] = 0;
        this.data[3] = 0;
        this.data[4] = 0;
        this.data[5] = 1;
        this.data[6] = 0;
        this.data[7] = 0;
        this.data[8] = 0;
        this.data[9] = 0;
        this.data[10] = 1;
        this.data[11] = 0;
        this.data[12] = 0;
        this.data[13] = 0;
        this.data[14] = 0;
        this.data[15] = 1;
      }
      /**
       * Sets matrix values to 0
       */

    }, {
      key: "zero",
      value: function zero() {
        this.data[0] = 0;
        this.data[1] = 0;
        this.data[2] = 0;
        this.data[3] = 0;
        this.data[4] = 0;
        this.data[5] = 0;
        this.data[6] = 0;
        this.data[7] = 0;
        this.data[8] = 0;
        this.data[9] = 0;
        this.data[10] = 0;
        this.data[11] = 0;
        this.data[12] = 0;
        this.data[13] = 0;
        this.data[14] = 0;
        this.data[15] = 0;
      }
      /**
       * Inverts a matrix transformation.<br>
       * turn a worldToLocal transformation into localToWorld one for example.
       */

    }, {
      key: "invert",
      value: function invert() {
        var a00 = this.data[0],
            a01 = this.data[1],
            a02 = this.data[2],
            a03 = this.data[3];
        var a10 = this.data[4],
            a11 = this.data[5],
            a12 = this.data[6],
            a13 = this.data[7];
        var a20 = this.data[8],
            a21 = this.data[9],
            a22 = this.data[10],
            a23 = this.data[11];
        var a30 = this.data[12],
            a31 = this.data[13],
            a32 = this.data[14],
            a33 = this.data[15];
        var b00 = a00 * a11 - a01 * a10;
        var b01 = a00 * a12 - a02 * a10;
        var b02 = a00 * a13 - a03 * a10;
        var b03 = a01 * a12 - a02 * a11;
        var b04 = a01 * a13 - a03 * a11;
        var b05 = a02 * a13 - a03 * a12;
        var b06 = a20 * a31 - a21 * a30;
        var b07 = a20 * a32 - a22 * a30;
        var b08 = a20 * a33 - a23 * a30;
        var b09 = a21 * a32 - a22 * a31;
        var b10 = a21 * a33 - a23 * a31;
        var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

        var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
          return;
        }

        det = 1.0 / det;
        this.data[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        this.data[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        this.data[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        this.data[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        this.data[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        this.data[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        this.data[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        this.data[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        this.data[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        this.data[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        this.data[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        this.data[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        this.data[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        this.data[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        this.data[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        this.data[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
      }
      /**
       * Multiply this matrix with another.
       * @param {Mat4} other 
       */

    }, {
      key: "multiply",
      value: function multiply(other) {
        var a00 = other.data[0],
            a01 = other.data[1],
            a02 = other.data[2],
            a03 = other.data[3];
        var a10 = other.data[4],
            a11 = other.data[5],
            a12 = other.data[6],
            a13 = other.data[7];
        var a20 = other.data[8],
            a21 = other.data[9],
            a22 = other.data[10],
            a23 = other.data[11];
        var a30 = other.data[12],
            a31 = other.data[13],
            a32 = other.data[14],
            a33 = other.data[15];
        var b0 = this.data[0],
            b1 = this.data[1],
            b2 = this.data[2],
            b3 = this.data[3];
        this.data[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.data[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.data[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.data[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = this.data[4];
        b1 = this.data[5];
        b2 = this.data[6];
        b3 = this.data[7];
        this.data[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.data[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.data[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.data[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = this.data[8];
        b1 = this.data[9];
        b2 = this.data[10];
        b3 = this.data[11];
        this.data[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.data[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.data[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.data[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = this.data[12];
        b1 = this.data[13];
        b2 = this.data[14];
        b3 = this.data[15];
        this.data[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.data[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.data[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.data[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      }
      /**
       * Set this matrix to transformation matrix from position, rotation and scale.
       * @param {Vec3} pos 
       * @param {Quat} rot 
       * @param {Vec3} scale 
       */

    }, {
      key: "trs",
      value: function trs(pos, rot, scale) {
        var x = rot.data[0],
            y = rot.data[1],
            z = rot.data[2],
            w = rot.data[3];
        var x2 = x + x;
        var y2 = y + y;
        var z2 = z + z;
        var xx = x * x2;
        var xy = x * y2;
        var xz = x * z2;
        var yy = y * y2;
        var yz = y * z2;
        var zz = z * z2;
        var wx = w * x2;
        var wy = w * y2;
        var wz = w * z2;
        var sx = scale.data[0];
        var sy = scale.data[1];
        var sz = scale.data[2];
        this.data[0] = (1 - (yy + zz)) * sx;
        this.data[1] = (xy + wz) * sx;
        this.data[2] = (xz - wy) * sx;
        this.data[3] = 0;
        this.data[4] = (xy - wz) * sy;
        this.data[5] = (1 - (xx + zz)) * sy;
        this.data[6] = (yz + wx) * sy;
        this.data[7] = 0;
        this.data[8] = (xz + wy) * sz;
        this.data[9] = (yz - wx) * sz;
        this.data[10] = (1 - (xx + yy)) * sz;
        this.data[11] = 0;
        this.data[12] = pos.data[0];
        this.data[13] = pos.data[1];
        this.data[14] = pos.data[2];
        this.data[15] = 1;
      }
    }, {
      key: "setTranslation",
      value: function setTranslation(x, y, z) {
        this.identity();
        this.data[12] = x;
        this.data[13] = y;
        this.data[14] = z;
      }
      /**
       * Sets this matrix to represent perspective projection.
       * @param {Number} fov field of view
       * @param {Number} aspect aspect ratio (resolution width/height)
       * @param {Number} near near clipping plane
       * @param {Number} far far clipping plane
       */

    }, {
      key: "perspective",
      value: function perspective(fov, aspect, near, far) {
        var f = 1.0 / Math.tan(fov / 2),
            nf;
        this.data[0] = f / aspect;
        this.data[1] = 0;
        this.data[2] = 0;
        this.data[3] = 0;
        this.data[4] = 0;
        this.data[5] = f;
        this.data[6] = 0;
        this.data[7] = 0;
        this.data[8] = 0;
        this.data[9] = 0;
        this.data[11] = -1;
        this.data[12] = 0;
        this.data[13] = 0;
        this.data[15] = 0;

        if (far != null && far !== Infinity) {
          nf = 1 / (near - far);
          this.data[10] = (far + near) * nf;
          this.data[14] = 2 * far * near * nf;
        } else {
          this.data[10] = -1;
          this.data[14] = -2 * near;
        }
      }
      /**
       * Sets this matrix to represent orthogonal(parallel) projection.
       * @param {Number} left left boundary of the frustum box 
       * @param {Number} right right boundary of the frustum box
       * @param {Number} bottom bottom boundary of the frustum box
       * @param {Number} top top boundary of the frustum box
       * @param {Number} near near boundary of the frustum box
       * @param {Number} far far boundary of the frustum box
       */

    }, {
      key: "orthogonal",
      value: function orthogonal(left, right, bottom, top, near, far) {
        var lr = 1 / (left - right);
        var bt = 1 / (bottom - top);
        var nf = 1 / (near - far);
        this.data[0] = -2 * lr;
        this.data[1] = 0;
        this.data[2] = 0;
        this.data[3] = 0;
        this.data[4] = 0;
        this.data[5] = -2 * bt;
        this.data[6] = 0;
        this.data[7] = 0;
        this.data[8] = 0;
        this.data[9] = 0;
        this.data[10] = 2 * nf;
        this.data[11] = 0;
        this.data[12] = (left + right) * lr;
        this.data[13] = (top + bottom) * bt;
        this.data[14] = (far + near) * nf;
        this.data[15] = 1;
      }
      /**
       * Copy data values from other matrix
       * @param {Mat4} other 
       */

    }, {
      key: "copy",
      value: function copy(other) {
        this.data[0] = other.data[0];
        this.data[1] = other.data[1];
        this.data[2] = other.data[2];
        this.data[3] = other.data[3];
        this.data[4] = other.data[4];
        this.data[5] = other.data[5];
        this.data[6] = other.data[6];
        this.data[7] = other.data[7];
        this.data[8] = other.data[8];
        this.data[9] = other.data[9];
        this.data[10] = other.data[10];
        this.data[11] = other.data[11];
        this.data[12] = other.data[12];
        this.data[13] = other.data[13];
        this.data[14] = other.data[14];
        this.data[15] = other.data[15];
      }
    }]);

    return Mat4;
  }();

  /**
   * Base class for all 2D texture related subclasses.
   * Stores texture parameters and a webgl texture object.<br>
   * set {@link BaseTexture2D#needsUpdate} true if any member has changed.<br>
   * the webgl texture will be updated at the next time it is used with {@link BaseTexture2D#setActive}.<br>
   * <br>
   * subclasses : {@link Texture2D}, {@link DataTexture2D}.
   */
  var BaseTexture2D =
  /*#__PURE__*/
  function () {
    function BaseTexture2D() {
      _classCallCheck(this, BaseTexture2D);

      /**
       * internal pixel format for webgl.
       * @type {String}
       * @default 'RGBA'
       * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#Pixel_formats
       */
      this.internalFormat = 'RGBA';
      /**
       * source pixel format for webgl. (same as {@link BaseTexture2D#internalFormat} for WebGL1). 
       * @type {String}
       * @default 'RGBA'
       * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#Pixel_formats
       */

      this.sourceFormat = 'RGBA';
      /**
       * pixel data type.
       * @type {String}
       * @default 'UNSIGNED_BYTE'
       * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#Pixel_types
       */

      this.pixelType = 'UNSIGNED_BYTE';
      /** 
       * webgl texture object. This will be created by {@link BaseTexture2D#init}.
       * @type {WebGLTexture}
       */

      this.texture = null;
      this.isInitialized = false;
      /**
       * if true webgl texture object is updated the next time {@link BaseTexture2D#setActive} is called.
       * @type {Boolean}
       */

      this.needsUpdate = false;
      /**
       * GL Wrapping on S coordinate.
       * @type {String}
       * @default 'REPEAT'
       */

      this.wrapS = 'REPEAT';
      /**
       * GL Wrapping on T coordinate.
       * @type {String}
       * @default 'REPEAT'
       */

      this.wrapT = 'REPEAT';
      /**
       * wether to create mipmaps on next update.
       * mipmapping only works on power of 2 sized textures!
       * @type {Boolean}
       * @default false
       */

      this.useMipmaps = false;
      /**
       * GL magnification filtering. Affects how a texel is rendered if it is bigger than screen pixel.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#Textures
       * @default 'NEAREST'
       */

      this.magFilter = 'NEAREST';
      /**
       * GL minification filtering. Affects how a texel is rendered if it is smaller than screen pixel.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#Textures
       * @default 'NEAREST'
       */

      this.minFilter = 'NEAREST';
    }
    /**
     * Creates the WebGLTexture instance. There is no need to call this manually in most cases. It is called from {@link BaseTexture2D#setActive} if needed.
     * @param {WebGLRenderingContext} gl 
     */


    _createClass(BaseTexture2D, [{
      key: "init",
      value: function init(gl) {
        this.texture = gl.createTexture();
        this.isInitialized = true;
      }
      /**
       * @description updates texture data and parameters.<br>
       * Actual update of texture data must be implemented in a subclass!.<br>
       * {@link BaseTexture2D} only implements assigning texture parameter values.
       * @param {WebGLRenderingContext} gl
       * @abstract
       */

    }, {
      key: "update",
      value: function update(gl) {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[this.magFilter]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[this.minFilter]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[this.wrapS]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[this.wrapT]);
        this.needsUpdate = false;
      }
      /**
       * Initializes and updates this texture if necessary and then binds it to given texture unit.
       * This is used internally when {@link ShaderProgram} sets a texture uniform.
       * @param {WebGLRenderingContext} gl
       * @param {Number} textureUnit
       */

    }, {
      key: "setActive",
      value: function setActive(gl, textureUnit) {
        if (!this.isInitialized) {
          this.init(gl);
        }

        if (this.needsUpdate) {
          this.update(gl);
        }

        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
      }
    }]);

    return BaseTexture2D;
  }();

  /**
   * Draw TypedArray as 2D texture. also used in {@link Framebuffer2D}.
   * @extends BaseTexture2D
   */

  var DataTexture2D =
  /*#__PURE__*/
  function (_BaseTexture2D) {
    _inherits(DataTexture2D, _BaseTexture2D);

    /**
     * 
     * @param {ArrayBufferView} data 
     * @param {Number} width 
     * @param {Number} height 
     * @param {String} internalFormat gl pixel format. default: RGBA
     * @param {String} sourceFormat   gl pixel format. default: RGBA
     * @param {String} pixelType      gl pixel type.   default UNSIGNED_BYTE
     */
    function DataTexture2D(data, width, height, internalFormat, sourceFormat, pixelType) {
      var _this;

      _classCallCheck(this, DataTexture2D);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(DataTexture2D).call(this));
      _this.data = data;
      _this.width = width;
      _this.height = height;
      _this.internalFormat = internalFormat || 'RGBA';
      _this.sourceFormat = sourceFormat || 'RGBA';
      _this.pixelType = pixelType || 'UNSIGNED_BYTE';
      return _this;
    }
    /**
     * @description Updates webgl texture data and parameters.
     * @param {WebGLRenderingContext} gl 
     */


    _createClass(DataTexture2D, [{
      key: "update",
      value: function update(gl) {
        _get(_getPrototypeOf(DataTexture2D.prototype), "update", this).call(this, gl);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl[this.internalFormat], this.width, this.height, 0, gl[this.sourceFormat], gl[this.pixelType], this.data);
      }
    }]);

    return DataTexture2D;
  }(BaseTexture2D);

  /**
   * This class is intended to only display loaded images.
   * For displaying data buffers use {@link DataTexture2D}.
   * @extends BaseTexture2D
   */

  var Texture2D =
  /*#__PURE__*/
  function (_BaseTexture2D) {
    _inherits(Texture2D, _BaseTexture2D);

    /**
     * @param {String} url path to image to load.
     */
    function Texture2D(url) {
      var _this;

      _classCallCheck(this, Texture2D);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Texture2D).call(this));
      _this.url = url;
      _this.image = new Image();
      _this.internalFormat = 'RGBA';
      _this.sourceFormat = 'RGBA';
      _this.pixelType = 'UNSIGNED_BYTE';
      _this.image.texture2D = _assertThisInitialized(_assertThisInitialized(_this));

      _this.image.onload = function () {
        this.texture2D.needsUpdate = true;
      };

      _this.image.src = _this.url;
      return _this;
    }
    /**
     * @description Updates webgl texture data and parameters.
     * @param {WebGLRenderingContext} gl 
     */


    _createClass(Texture2D, [{
      key: "update",
      value: function update(gl) {
        _get(_getPrototypeOf(Texture2D.prototype), "update", this).call(this, gl);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl[this.internalFormat], gl[this.sourceFormat], gl[this.pixelType], this.image);
      }
    }]);

    return Texture2D;
  }(BaseTexture2D);

  /**
   * Contains color and depth rendering target buffers for WebGL.
   * Essential for render-to-texture implementations.
   */

  var Framebuffer2D =
  /*#__PURE__*/
  function () {
    /**
     * @param {Number} width width of the framebuffer in pixels
     * @param {Number} height height of the framebuffer in pixels
     * @param {Boolean} useColor wether to create buffer for color data (cannot be changed after creation)
     * @param {Boolean} useDepth wether to create buffer for depth data (cannot be changed after creation)
     */
    function Framebuffer2D(width, height, useColor, useDepth) {
      _classCallCheck(this, Framebuffer2D);

      this.useColor = useColor || true;
      this.useDepth = useDepth || true;
      this.width = width;
      this.height = height;

      if (this.useColor) {
        this.colorTexture = new DataTexture2D(null, this.width, this.height);
        this.colorTexture.wrapS = 'CLAMP_TO_EDGE';
        this.colorTexture.wrapT = 'CLAMP_TO_EDGE';
        this.colorTexture.magFilter = 'NEAREST';
      }

      this.depthBuffer = null;
      this.framebuffer = null;
      this.isInitialized = false;
      this.needsUpdate = true;
    }
    /**
     * @description initializes buffers. internal method, this should not be called manually!
     * @param {WebGLRenderingContext} gl gl context 
     */


    _createClass(Framebuffer2D, [{
      key: "init",
      value: function init(gl) {
        if (this.useColor) {
          this.colorTexture.init(gl);
          this.colorTexture.update(gl);
          this.framebuffer = gl.createFramebuffer();
          gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.colorTexture.texture, 0);
        }

        if (this.useDepth) {
          this.depthBuffer = gl.createRenderbuffer();
          gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
          gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
          gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthBuffer);
        }

        this.isInitialized = true;
      }
      /**
       * @description updates buffers. Automatically called by this.setActive() if needsUpdate == true
       * @param {WebGLRenderingContext} gl gl context
       */

    }, {
      key: "update",
      value: function update(gl) {
        if (this.useColor) {
          this.colorTexture.width = this.width;
          this.colorTexture.height = this.height;
          this.colorTexture.update(gl);
        }

        if (this.useDepth) {
          gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
          gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
        }

        this.needsUpdate = false;
      }
      /**
       * @description binds this framebuffer and sets up gl viewport. also initializes and/or updates buffers if necessary.
       * @param {WebGLRenderingContext} gl
       */

    }, {
      key: "setActive",
      value: function setActive(gl) {
        if (!this.isInitialized) {
          this.init(gl);
        }

        if (this.needsUpdate) {
          this.update(gl);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.viewport(0, 0, this.width, this.height);
      }
    }]);

    return Framebuffer2D;
  }();

  /**
   * Holds an array of transforms to make updating and drawing a large number of transforms more convenient.
   */
  var Scene =
  /*#__PURE__*/
  function () {
    function Scene() {
      _classCallCheck(this, Scene);

      this.transforms = [];
      this.activeCamera = null;
    }
    /**
     * Add Transform to scene objects list. If added transform is camera it is set as the active camera of the scene.
     * @param {Transform} obj 
     */


    _createClass(Scene, [{
      key: "addTransform",
      value: function addTransform(obj) {
        this.transforms.push(obj);

        if (obj.isCamera) {
          this.activeCamera = obj;
        }
      }
      /**
       * Calls {@link Transform#update} on each transform.
       */

    }, {
      key: "update",
      value: function update() {
        for (var i = 0; i < this.transforms.length; i++) {
          this.transforms[i].update();
        }
      }
      /**
       * Sets up the camera and. Calls {@link Transform#draw} on each transform.
       * @param {WebGLRenderingContext} gl 
       * @param {Camera} camera If camera is undefined, {@link Scene#activeCamera} is used instead.
       */

    }, {
      key: "draw",
      value: function draw(gl, camera) {
        var cam = null;

        if (camera !== undefined) {
          cam = camera;
        } else if (this.activeCamera != null) {
          cam = this.activeCamera;
        } else {
          throw "No camera available to render with!";
        }

        cam.setActive(gl);

        for (var i = 0; i < this.transforms.length; i++) {
          this.transforms[i].draw(gl, cam.viewProjectionMatrix);
        }
      }
    }]);

    return Scene;
  }();

  /**
   * @typedef {Object} Uniform
   * @description an object that contains type and value of an uniform.<br>
   * @property {String} type uniform type
   * @property {*} value value of this uniform that must match the type.
   */

  /** 
   * Compiles vertex shader, fragment shader and the gl program.<br>
   * Applies blending modes, depth sort modes and face culling modes.<br>
   * stores a set of its own uniforms as well.
   */
  var ShaderProgram =
  /*#__PURE__*/
  function () {
    /** 
     * @param {String} vertexSource vertex shader glsl string
     * @param {String} fragmentSource vertex shader glsl string
     * @param {Object<String, Uniform>} uniforms (optional) uniforms for this program.
     */
    function ShaderProgram(vertexSource, fragmentSource, uniforms) {
      _classCallCheck(this, ShaderProgram);

      /** 
       * @description glsl source code for vertex shader 
       * @type {String}
       */
      this.vertexSource = vertexSource;
      /** 
       * @description glsl source code for fragment shader 
       * @type {String}
       */

      this.fragmentSource = fragmentSource;
      /**
       * gl shader object
       * @type {WebGLShader}
       */

      this.vertexShader = null;
      /**
       * gl shader object
       * @type {WebGLShader}
       */

      this.fragmentShader = null;
      /**
       * gl program object
       * @type {WebGLProgram}
       */

      this.program = null;
      /**
       * Used internally to keep track of texture units while assigning texture uniforms.
       * @type {Number}
       * @readonly
       */

      this.textureUnit = 0;
      /** 
       * @description uniforms for this shader program
       * @type {Object<String,Uniform>}
       */

      this.uniforms = uniforms || {};
      /** 
       * @description cache for uniforms locations to avoid looking them up by webgl every time 
       * @type {Object<String,number>}
       * @readonly
       */

      this.uniformLocations = {};
      /** 
       * @description cache for attribute locations to avoid looking them up by webgl every time 
       * @type {Object<string,number>}
       * @readonly
       */

      this.attributeLocations = {};
      /**
       * Enable or disable gl.BLEND feature
       * @type {Boolean}
       * @default false
       */

      this.enableBlending = false;
      /**
       * gl blending source factor
       * @type {String}
       * @default 'ONE'
       */

      this.blendSRC = 'ONE';
      /**
       * gl blending destination factor
       * @type {String}
       * @default 'ONE'
       */

      this.blendDST = 'ONE';
      /**
       * Enable or disable gl.DEPTH_SORT feature
       * @type {Boolean}
       * @default true
       */

      this.enableDepth = true;
      /**
       * Depth sorting function
       * @type {String}
       * @default 'LEQUAL'
       */

      this.depthFunc = 'LEQUAL';
      /**
       * Enable or disable gl.CULL_FACE
       * @type {Boolean}
       * @default true
       */

      this.enableCulling = true;
      /**
       * Face culling mode
       * @type {String}
       * @default 'BACK'
       */

      this.cullFace = 'BACK';
      /**
       * used internally to check if shaders have been compiled yet
       * @type {Boolean}
       * @readonly
       */

      this.isCompiled = false;
    }
    /**
     * Creates webgl shader and program objects.<br>
     * Assigns shader sources to them.<br>
     * Compiles shaders, attaches them to program and links the program.<br>
     * <br>
     * This is called from {@link ShaderProgram#use} if {@link ShaderProgram#isCompiled} is false.
     * @param {WebGLRenderingContext} gl 
     */


    _createClass(ShaderProgram, [{
      key: "compile",
      value: function compile(gl) {
        this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.vertexShader, this.vertexSource);
        gl.compileShader(this.vertexShader);
        var message = gl.getShaderInfoLog(this.vertexShader);

        if (message.length > 0) {
          throw " vertex shader could not be compiled! " + message + " " + this.vertexSource;
        }

        gl.shaderSource(this.fragmentShader, this.fragmentSource);
        gl.compileShader(this.fragmentShader);
        message = gl.getShaderInfoLog(this.fragmentShader);

        if (message.length > 0) {
          throw " fragment shader could not be compiled! " + message + " " + this.fragmentSource;
        }

        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);
        gl.linkProgram(this.program);
        this.isCompiled = true;
      }
    }, {
      key: "getAttributeLocation",
      value: function getAttributeLocation(gl, name) {
        if (this.attributeLocations[name] === undefined) {
          this.attributeLocations[name] = gl.getAttribLocation(this.program, name);
        }

        return this.attributeLocations[name];
      }
    }, {
      key: "getUniformLocation",
      value: function getUniformLocation(gl, name) {
        if (this.uniformLocations[name] === undefined) {
          this.uniformLocations[name] = gl.getUniformLocation(this.program, name);
        }

        return this.uniformLocations[name];
      }
    }, {
      key: "setUniform",
      value: function setUniform(gl, name, type, value) {
        var loc = this.getUniformLocation(gl, name);

        if (loc === null) {
          return;
        }

        switch (type) {
          case 'm4':
            gl.uniformMatrix4fv(loc, false, value);
            break;

          case 'm3':
            gl.uniformMatrix3fv(loc, false, value);
            break;

          case 'm2':
            gl.uniformMatrix2fv(loc, false, value);
            break;

          case '1f':
            gl.uniform1f(loc, value);
            break;

          case '2fv':
            gl.uniform2fv(loc, value);
            break;

          case '3fv':
            gl.uniform3fv(loc, value);
            break;

          case '4fv':
            gl.uniform4fv(loc, value);
            break;

          case 't2d':
            value.setActive(gl, this.textureUnit);
            gl.uniform1i(loc, this.textureUnit);
            this.textureUnit++;
            break;
        }
      }
      /**
       * Sets this program to be active.<br>
       * and sets blending mode, depth sort mode and face culling mode.
       * Also compiles the shaders if they are not compiled already.
       * @param {WebGLRenderingContext} gl 
       */

    }, {
      key: "use",
      value: function use(gl) {
        this.textureUnit = 0;

        if (!this.isCompiled) {
          this.compile(gl);
        }

        gl.useProgram(this.program);

        for (var name in this.uniforms) {
          this.setUniform(gl, name, this.uniforms[name].type, this.uniforms[name].value);
        }

        if (this.enableBlending) {
          gl.enable(gl.BLEND);
          gl.blendFunc(this.blendSRC, this.blendDST);
        } else {
          gl.disable(gl.BLEND);
        }

        if (this.enableDepth) {
          gl.enable(gl.DEPTH_TEST);
          gl.depthFunc(gl[this.depthFunc]);
        } else {
          gl.disable(gl.DEPTH_TEST);
        }

        if (this.enableCulling) {
          gl.enable(gl.CULL_FACE);
          gl.cullFace(gl[this.cullFace]);
        } else {
          gl.disable(gl.CULL_FACE);
        }
      }
    }]);

    return ShaderProgram;
  }();

  /**
   * Mesh Attribute
   */

  var MeshAttribute =
  /*#__PURE__*/
  function () {
    /**
     * 
     * @param {String} name attribute name
     * @param {ArrayBufferView} data typed array of data for the attribute
     * @param {Number} size size of data in array. 2 for vec2, 3 for vec3, etc...
     * @param {String} type datatype matching the typed array datatype. 'FLOAT', 'UNSIGNED_BYTE', etc
     * @param {Boolean} normalized wether the data is normalised to 0-1 range for glsl.
     * @param {String} usage usage hint for gl. 'STATIC_DRAW' or 'DYNAMIC_DRAW'.
     */
    function MeshAttribute(name, data, size, type, normalized, usage) {
      _classCallCheck(this, MeshAttribute);

      this.name = name;
      this.data = data;
      this.size = size || 3;
      this.type = type || 'FLOAT';
      this.usage = usage || 'STATIC_DRAW';
      this.normalized = normalized || false;
      this.buffer = null;
      this.needsUpdate = true;
      this.isInitialized = false;
    }
    /**
     * @description initializes buffer. Internal method. Should not be called manually!
     * @param {WebGLRenderingContext} gl gl context. 
     */


    _createClass(MeshAttribute, [{
      key: "init",
      value: function init(gl) {
        this.buffer = gl.createBuffer();
        this.isInitialized = true;
      }
      /**
       * @description updates buffer data. Internal method. Should not be called manually!
       * @param {WebGLRenderingContext} gl gl context. 
       */

    }, {
      key: "update",
      value: function update(gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.data, gl[this.usage]);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.needsUpdate = false;
      }
      /**
       * @description sets up vertex attribute pointer and binds the buffer.
       * this is used before drawing.
       * @param {WebGLRenderingContext} gl gl context.
       * @param {ShaderProgram} program shaderProgram instance.
       */

    }, {
      key: "bind",
      value: function bind(gl, program) {
        var loc = program.getAttributeLocation(gl, this.name);

        if (loc == -1) {
          return;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(loc, this.size, gl[this.type], this.normalized, 0, 0);
        gl.enableVertexAttribArray(loc);
      }
      /**
       * Sets new data buffer. and sets this.needsUpdate true.
       * @param {ArrayBufferView} newData 
       */

    }, {
      key: "setData",
      value: function setData(newData) {
        this.data = newData;
        this.needsUpdate = true;
      }
    }]);

    return MeshAttribute;
  }();

  /**
   * Flexible geometry class to draw things with webgl.
   * Different meshes can even share {@link MeshAttribute} objects<br>
   * provided that the vertexCount matches.
   * @example
   * // creating a 2D triangle mesh with position and uv attributes.
   * let position = new MeshAttribute(
   *      "position", // name
   *      new Float32Array([-1.0,-1.0, 0.0,1.0, 1.0,-1.0]), // data
   *      2, // size per vertex (2D vector in this case)
   *      'FLOAT', // data type
   *      false // is data normalized in glsl
   * );
   * let uv = new MeshAttribute(
   *      "uv",
   *      new Uint8Array([0,0, 128,255, 255,0]),
   *      2,
   *      'UNSIGNED_BYTE',
   *      true
   * );
   * let mesh = new Mesh([position, uv]);
   * mesh.draw(gl, program); // program must have uniforms set before drawing!
   */

  var Mesh =
  /*#__PURE__*/
  function () {
    /**
     * 
     * @param {MeshAttribute[]} attributes attributes for this mesh. must contain an attribute named: 'position'.
     */
    function Mesh(attributes) {
      _classCallCheck(this, Mesh);

      /**
       * Mesh Attributes
       * @type {MeshAttribute[]}
       */
      this.attributes = attributes;
      /**
       * Vertex count for this mesh. This is calculated from an attribute named "position"<br>which MUST be present in the attributes array.
       * @type {Number}
       * @readonly
       */

      this.vertexCount = 0;
      /** 
       * Drawing mode of the mesh
       * @type {String}
       * @default 'TRIANGLES'
       * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#Rendering_primitives
       */

      this.drawMode = 'TRIANGLES';
    }
    /**
     * Returns a mesh attribute by name
     * @param {String} name
     * @returns {MeshAttribute} attribute
     */


    _createClass(Mesh, [{
      key: "getAttribute",
      value: function getAttribute(name) {
        for (var i = 0; i < this.attributes.length; i++) {
          if (this.attributes[i].name == name) {
            return this.attributes[i];
          }
        }
      }
      /**
       * Binds all attributes and draws the mesh.
       * @param {WebGLRenderingContext} gl 
       * @param {ShaderProgram} program 
       */

    }, {
      key: "draw",
      value: function draw(gl, program) {
        for (var i = 0; i < this.attributes.length; i++) {
          var a = this.attributes[i];

          if (!a.isInitialized) {
            a.init(gl);
          }

          if (a.needsUpdate) {
            a.update(gl);
          }

          if (a.name == 'position') {
            this.vertexCount = a.data.length / a.size;
          }

          a.bind(gl, program);
        }

        if (this.vertexCount == 0) {
          return;
        }

        gl.drawArrays(gl[this.drawMode], 0, this.vertexCount);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
      }
    }]);

    return Mesh;
  }();

  /**
   * This is main class to represent an object with given mesh 
   * that can be placed into a "world".
   */

  var Transform =
  /*#__PURE__*/
  function () {
    /**
     * @param {Mesh} mesh mesh to be assigned to this transform.
     * @param {ShaderProgram} program shader program to be used while drawing the mesh.
     */
    function Transform(mesh, program) {
      _classCallCheck(this, Transform);

      /** 
       * @description a random number assigned at creation.
       * @name Transform#id
       * @type {Number}
       * @readonly
       */
      this.id = Math.floor(Math.random() * 1000000000);
      /** 
       * @description Translation in localSpace. set {@link Transform#matrixNeedsUpdate} true after modifying manually!
       * @name Transform#localPos
       * @type {Vec3}
       */

      this.localPos = new Vec3();
      /** 
       * @description Rotation in localSpace. set {@link Transform#matrixNeedsUpdate} true after modifying manually!
       * @name Transform#localRot
       * @type {Quat}
       */

      this.localRot = new Quat();
      /** 
       * @description Scale in localSpace. set {@link Transform#matrixNeedsUpdate} true after modifying manually!
       * @name Transform#localScale
       * @type {Vec3}
       */

      this.localScale = new Vec3(1, 1, 1);
      /** 
       * @description transformation from localSpace to world space. This is used as model matrix in glsl.
       * Calculated from {@link Transform#localPos},{@link Transform#localRot},{@link Transform#localScale}
       * and {@link Transform#parent} matrix.
       * if {@link Transform#matrixNeedsUpdate} is true, it will be recalculated at next {@link Transform#update} call.
       * @name Transform#localToWorld
       * @type {Mat4}
       */

      this.localToWorld = new Mat4();
      /**
       * @description transformation from world space to local space. This is just {@link Transform#localToWorld} inverted.
       * @name Transform#worldToLocal
       * @type {Mat4}
       */

      this.worldToLocal = new Mat4();
      /**
       * @description shader program which is used when drawing {@link Transform#mesh}
       * @name Transform#program
       * @type {ShaderProgram}
       */

      this.program = program;
      /**
       * @description optional uniforms for this transform. they will override the uniforms in {@link Transform#program}
       * @type {Object<String,Uniform>}
       */

      this.uniforms = {};
      /**
       * @description mesh linked to this transformation.
       * @name Transform#mesh
       * @type {Mesh}
       */

      this.mesh = mesh;
      /**
       * @description parent transformation of this. It will affect the {@link Transform#localToWorld} matrix.
       * use {@link Transform#setparent} instead of changing this directly.
       * @name Transform#parent
       * @type {Transform}
       * @readonly
       */

      this.parent = null;
      /**
       * @description children Transforms of this. Use {@link Transform#addChild} instead of changing this directly.
       * @name Transform#children
       * @type {Transform[]}
       * @readonly
       */

      this.children = [];
      /** 
       * @description if true, {@link Transform#localToWorld} is recalculated at next {@link Transform#update} call.
       * This avoids recalculation of matrices after every additional transformation.
       * @name Transform#matrixNeedsUpdate
       * @type {Boolean}
       */

      this.matrixNeedsUpdate = true;
      /**
       * @description controls wether this object is rendered or not.
       * @name Transform#visible
       * @type {Boolean}
       */

      this.visible = true;

      this.onupdate = function () {};
    }
    /**
     * @description sets the parent for this transformation object. This affects the localToWorld and worldToLocal matrices.
     * @param {Transform} parent new parent.
     */


    _createClass(Transform, [{
      key: "setParent",
      value: function setParent(parent) {
        this.parent = parent;
        this.parent.children.push(this);
        this.matrixNeedsUpdate = true;
      }
      /**
       * @description pushes the transform to this.children. Does nothing when given transform is already a child.
       * @param {Transform} child new child.
       */

    }, {
      key: "addChild",
      value: function addChild(child) {
        if (this.children.indexOf(child) != -1) {
          return;
        }

        if (child.parent != null) {
          child.parent.children.splice(child.parent.children.indexOf(child), 1);
        }

        children.push(child);
        child.parent = this;
        child.matrixNeedsUpdate = true;
      }
      /**
       * @description this should be called from your mainloop implementation before rendering a frame.
       */

    }, {
      key: "update",
      value: function update() {
        this.onupdate();

        if (this.matrixNeedsUpdate) {
          this.updateMatrix();
        }
      }
      /**
       * @description updates localToWorld and worldToLocal matrices. 
       * it Is called from {@link Transform#update} if {@link Transform#matrixNeedsUpdate} is true.
       * Also recursively updates the bounds of this and the parent chain.
       */

    }, {
      key: "updateMatrix",
      value: function updateMatrix() {
        /* matrix recalculations */
        this.localToWorld.trs(this.localPos, this.localRot, this.localScale);

        if (this.parent != null) {
          this.localToWorld.multiply(this.parent.localToWorld);
        }

        this.worldToLocal.copy(this.localToWorld);
        this.worldToLocal.invert();

        for (var i = 0; i < this.children.length; i++) {
          this.children[i].matrixNeedsUpdate = true;
        }

        this.matrixNeedsUpdate = false;
      }
      /**
       * @description an overridable method to be called before drawing.
       * @param {WebglRenderingContext} gl gl context
       */

    }, {
      key: "onBeforeDraw",
      value: function onBeforeDraw(gl) {}
      /**
       * @description main method to draw this.mesh. binds the shaderprogram and assigns uniforms to it.
       * @param {WebglRenderingContext} gl gl context
       * @param {Float32Array} viewMatrix viewMatrix to be used by the shaderProgram. if null then identity matrix is used
       * @param {Float32Array} projectionMatrix projection matrix to be used by the shader program. if null identity matrix is used
       */

    }, {
      key: "draw",
      value: function draw(gl, viewProjectionMatrix) {
        if (!this.visible) {
          return;
        }

        if (this.program == null) {
          return;
        }

        if (this.mesh == null) {
          return;
        }

        this.onBeforeDraw();
        this.program.use(gl);
        this.program.setUniform(gl, 'viewProjectionMatrix', 'm4', viewProjectionMatrix.data);
        this.program.setUniform(gl, 'modelMatrix', 'm4', this.localToWorld.data);

        for (var name in this.uniforms) {
          this.program.setUniform(gl, name, this.uniforms[name].type, this.uniforms[name].value);
        }

        this.mesh.draw(gl, this.program);
      }
    }]);

    return Transform;
  }();

  /**
   * Object containing both view and projection matrix. This makes moving the view around more intuituve.
   * @extends {Transform}
   */

  var Camera =
  /*#__PURE__*/
  function (_Transform) {
    _inherits(Camera, _Transform);

    function Camera() {
      var _this;

      _classCallCheck(this, Camera);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Camera).call(this));
      _this.isCamera = true;
      /**
       * Render target for this camera. if null then gl context canvas is used as target.
       * @type {Framebuffer2D}
       */

      _this._target = null;
      /** width is set by target or canvas size automatically @readonly */

      _this._width = 100;
      /** height is set by target or canvas size automatically @readonly */

      _this._height = 100;
      _this.clearColor = [0, 0, 0, 1];
      /**
       * Field of view in degrees
       */

      _this._fov = 90;
      _this._near = 0.1;
      _this._far = 1000.0;
      _this._left = -100;
      _this._right = 100;
      _this._top = -100;
      _this._bottom = 100;
      _this._perspective = true;
      _this.projectionMatrix = new Mat4();
      _this.viewProjectionMatrix = new Mat4();
      _this.inverseViewProjectionMatrix = new Mat4();
      /**
       * If true, the projection matrix is updated the next time this camera is set active.<br>
       * This is set true if any of the projection realted parameters have been changed.
       * @name Camera#projectionNeedsUpdate
       * @type {Boolean}
       * @default true
       */

      _this.projectionNeedsUpdate = true;
      return _this;
    }

    _createClass(Camera, [{
      key: "updateViewProjectionMatrix",

      /**
       * Updates the viewProjection combined matrix. this is done when camera transformation matrix is updated and if the projection matrix is updated.
       */
      value: function updateViewProjectionMatrix() {
        this.viewProjectionMatrix.copy(this.worldToLocal);
        this.viewProjectionMatrix.multiply(this.projectionMatrix);
        this.inverseViewProjectionMatrix.copy(this.viewProjectionMatrix);
        this.inverseViewProjectionMatrix.invert();
      }
      /**
       * Updates the projection matrix. This is done automatically if {@link Camera#projectionNeedsUpdate} is true when {@link Camera#setActive} is called.
       */

    }, {
      key: "updateProjectionMatrix",
      value: function updateProjectionMatrix() {
        if (this.perspective) {
          this.projectionMatrix.perspective(this.fov * 0.0174532925, this.width / this.height, this.near, this.far);
        } else {
          this.projectionMatrix.orthogonal(this.left, this.right, this.bottom, this.top, this.near, this.far);
        }

        this.updateViewProjectionMatrix();
        this.projectionNeedsUpdate = false;
      }
    }, {
      key: "updateMatrix",
      value: function updateMatrix() {
        _get(_getPrototypeOf(Camera.prototype), "updateMatrix", this).call(this);

        this.updateViewProjectionMatrix();
      }
      /**
       * Call this before drawing to set up the gl viewport and update projection matrix if needed.
       * @param {WebGLRenderingContext} gl 
       */

    }, {
      key: "setActive",
      value: function setActive(gl) {
        if (this._target == null) {
          this.width = gl.canvas.width;
          this.height = gl.canvas.height;
        } else {
          this.width = this.target.width;
          this.height = this.target.height;

          this._target.setActive(gl);
        }

        if (this.projectionNeedsUpdate) {
          this.updateProjectionMatrix();
        }

        gl.clearColor.apply(gl, _toConsumableArray(this.clearColor));
        gl.viewport(0, 0, this.width, this.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      }
      /**
       * Transforms the vector from NDC to world space.
       * @param {Vec3} point Screen point in NDC(normalized device coordinates).
       */

    }, {
      key: "NDCToWorld",
      value: function NDCToWorld(point) {
        point.transformMat4(this.localToWorld);
      }
      /**
       * Transforms the vector from screen pixel coordinates to world space.
       * @param {Vec3} point Screen point in pixel coordinates.
       */

    }, {
      key: "screenToWorld",
      value: function screenToWorld(point) {
        // point to NDC
        // z is unchanged
        point.data[0] /= this._width;
        point.data[0] = point.data[0] * 2 - 1;
        point.data[1] /= this._height;
        point.data[1] = point.data[1] * 2 - 1;
        point.data[1] *= -1; // apply aspect ratio

        point.data[0] *= this._width / this._height;
        this.NDCToWorld(point);
      }
    }, {
      key: "target",
      get: function get$$1() {
        return this._target;
      },
      set: function set(value) {
        this._target = value;
      }
    }, {
      key: "width",
      get: function get$$1() {
        return this._width;
      },
      set: function set(value) {
        if (value != this._width) {
          this._width = value;
          this.projectionNeedsUpdate = true;
        }
      }
    }, {
      key: "height",
      get: function get$$1() {
        return this._height;
      },
      set: function set(value) {
        if (value != this._height) {
          this._height = value;
          this.projectionNeedsUpdate = true;
        }
      }
    }, {
      key: "fov",
      get: function get$$1() {
        return this._fov;
      },
      set: function set(value) {
        this._fov = value;
        this.projectionNeedsUpdate = true;
      }
    }, {
      key: "near",
      get: function get$$1() {
        return this._near;
      },
      set: function set(value) {
        this._near = value;
        this.projectionNeedsUpdate = true;
      }
    }, {
      key: "left",
      get: function get$$1() {
        return this._left;
      },
      set: function set(value) {
        this._left = value;
        this.projectionNeedsUpdate = true;
      }
    }, {
      key: "right",
      get: function get$$1() {
        return this._right;
      },
      set: function set(value) {
        this._right = value;
        this.projectionNeedsUpdate = true;
      }
    }, {
      key: "top",
      get: function get$$1() {
        return this._top;
      },
      set: function set(value) {
        this._top = value;
        this.projectionNeedsUpdate = true;
      }
    }, {
      key: "bottom",
      get: function get$$1() {
        return this._bottom;
      },
      set: function set(value) {
        this._bottom = value;
        this.projectionNeedsUpdate = true;
      }
    }, {
      key: "perspective",
      get: function get$$1() {
        return this._perspective;
      },
      set: function set(value) {
        this._perspective = value;
        this.projectionNeedsUpdate = true;
      }
    }]);

    return Camera;
  }(Transform);

  exports.Vec3 = Vec3;
  exports.Quat = Quat;
  exports.Mat4 = Mat4;
  exports.BaseTexture2D = BaseTexture2D;
  exports.DataTexture2D = DataTexture2D;
  exports.Texture2D = Texture2D;
  exports.Framebuffer2D = Framebuffer2D;
  exports.Scene = Scene;
  exports.Transform = Transform;
  exports.Camera = Camera;
  exports.ShaderProgram = ShaderProgram;
  exports.Mesh = Mesh;
  exports.MeshAttribute = MeshAttribute;

  return exports;

}({}));
