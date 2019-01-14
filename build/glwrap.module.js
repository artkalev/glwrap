/**
 * 3D vector class
 */
class Vec3{
    /**
     * Creates new 3D Vector from parameters.
     * @param {Number} x
     * @param {Number} y 
     * @param {Number} z 
     */
    constructor( x,y,z ){
        /** 
         * a float array storing the components of the vector.
         * this can be passed to {@link ShaderProgram} as an uniform.
         * @type {Float32Array}
         */
        this.data = new Float32Array( [x||0, y||0, z||0] );
    }
    get x(){ return this.data[0]; }
    get y(){ return this.data[1]; }
    get z(){ return this.data[2]; }
    set x(val){ this.data[0] = val; }
    set y(val){ this.data[1] = val; }
    set z(val){ this.data[2] = val; }

    set(x,y,z){
        this.data[0] = x;
        this.data[1] = y;
        this.data[2] = z;
    }

    /**
     * Squared length of this vector. this is cheaper than {@link Vec3#length}.
     * @returns {number} squared length.
     */
    lengthSqr(){
        return this.data[0]*this.data[0] + this.data[1]*this.data[1] + this.data[2]*this.data[2];
    }
    /**
     * Length of the vector.
     * @returns {number} length
     */
    length(){
        return Math.sqrt(this.lengthSqr);
    }
    /**
     * Normalizes the vector by dividing it by its own length. This ensures that the length is always one.
     */
    normalize(){
        if(this.isZero()){return;}
        let l = this.length();
        this.data[0] /= l;
        this.data[1] /= l;
        this.data[2] /= l;
    }
    /**
     * Dot product between this and other vector.
     * @param {Vec3} other 
     */
    dot(other){
        return this.data[0]*other.data[0] + this.data[1]*other.data[1] + this.data[2]*other.data[2];
    }

    /**
     * Dot product from two vectors.
     * @param {Vec3} a 
     * @param {Vec3} b 
     */
    static dot(a, b){
        return a.data[0]*b.data[0] + a.data[1]*b.data[1] + a.data[2]*b.data[2];
    }

    /**
     * Set this vector to be the cross product with another.
     * @param {Vec3} other 
     */
    cross( other ){
        let ax = this.data[0], ay = this.data[1], az = this.data[2];
        let bx = other.data[0], by = other.data[1], bz = other.data[2];

        this.data[0] = ay * bz - az * by;
        this.data[1] = az * bx - ax * bz;
        this.data[2] = ax * by - ay * bx;
    }

    /**
     * Cross product vector from two vectors.
     * @param {Vec3} a 
     * @param {Vec3} b 
     */
    static cross( a, b ){
        let ax = a.data[0], ay = a.data[1], az = a.data[2];
        let bx = b.data[0], by = b.data[1], bz = b.data[2];

        return new Vec3( 
            ay * bz - az * by,
            az * bx - ax * bz,
            ax * by - ay * bx
        );
    }

    /**
     * Returns true if all components are zero.
     */
    isZero(){
        return this[0] == 0 && this[1] == 0 && this[2] == 0;
    }

    /**
     * Transforms this vector with the given 4x4 matrix.
     * @param {Mat4} mat 
     */
    transformMat4( mat ){
        let x = this.data[0], y = this.data[1], z = this.data[2];
        let w = mat.data[3] * x + mat.data[7] * y + mat.data[11] * z + mat.data[15];
        w = w || 1.0;
        this.data[0] = (mat.data[0] * x + mat.data[4] * y + mat.data[8] * z + mat.data[12]) / w;
        this.data[1] = (mat.data[1] * x + mat.data[5] * y + mat.data[9] * z + mat.data[13]) / w;
        this.data[2] = (mat.data[2] * x + mat.data[6] * y + mat.data[10] * z + mat.data[14]) / w;
    }

    /**
     * 
     * @param {Vec3} other 
     */
    copy(other){
        this.data.set(other.data);
    }
}

let tmpvec = new Vec3();
let xvec = new Vec3(1,0,0);
let yvec = new Vec3(0,1,0);

/**
 * Quaternion rotation
 */
class Quat{
    /**
     * Creates a new identity quaternion.
     */
    constructor(){
        this.data = new Float32Array([0,0,0,1]);
    }
    /**
     * sets this quaternion from axis and angle.
     * @param {Vec3} axis axis of rotation
     * @param {Number} angle angle in radians 
     */
    setAxisAngle(axis, angle){
        angle = angle * 0.5;
        let s = Math.sin(angle);
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
    setEuler( x,y,z ){
        let halfToRad = 0.5 * Math.PI / 180.0;
        x *= halfToRad;
        y *= halfToRad;
        z *= halfToRad;

        let sx = Math.sin(x);
        let cx = Math.cos(x);
        let sy = Math.sin(y);
        let cy = Math.cos(y);
        let sz = Math.sin(z);
        let cz = Math.cos(z);

        this.data[0] = sx * cy * cz - cx * sy * sz;
        this.data[1] = cx * sy * cz + sx * cy * sz;
        this.data[2] = cx * cy * sz - sx * sy * cz;
        this.data[3] = cx * cy * cz + sx * sy * sz;
    }
    /**
     * Multiplies this quaternion with another.
     * @param {Quat} other quaternion.
     */
    multiply(other){
        let ax = this.data[0], ay = this.data[1], az = this.data[2], aw = this.data[3];
        let bx = other.data[0], by = other.data[1], bz = other.data[2], bw = other.data[3];

        this.data[0] = ax * bw + aw * bx + ay * bz - az * by;
        this.data[1] = ay * bw + aw * by + az * bx - ax * bz;
        this.data[2] = az * bw + aw * bz + ax * by - ay * bx;
        this.data[3] = aw * bw - ax * bx - ay * by - az * bz;
    }

    /**
     * Rotate this quaternion on the X axis
     * @param {Number} rad radians to rotate by
     */
    rotateX(rad) {
        rad *= 0.5;
        let ax = this.data[0], ay = this.data[1], az = this.data[2], aw = this.data[3];
        let bx = Math.sin(rad), bw = Math.cos(rad);
        this.data[0] = ax * bw + aw * bx;
        this.data[1] = ay * bw + az * bx;
        this.data[2] = az * bw - ay * bx;
        this.data[3] = aw * bw - ax * bx;
    }
    /**
     * Rotate this quaternion on the Y axis
     * @param {Number} rad radians to rotate by
     */
    rotateY(rad){
        rad *= 0.5;
        let ax = this.data[0], ay = this.data[1], az = this.data[2], aw = this.data[3];
        let by = Math.sin(rad), bw = Math.cos(rad);
        this.data[0] = ax * bw - az * by;
        this.data[1] = ay * bw + aw * by;
        this.data[2] = az * bw + ax * by;
        this.data[3] = aw * bw - ay * by;
    }
    /**
     * Rotate this quaternion on the Z axis
     * @param {Number} rad radians to rotate by
     */
    rotateZ(rad){
        rad *= 0.5;
        let ax = this.data[0], ay = this.data[1], az = this.data[2], aw = this.data[3];
        let bz = Math.sin(rad), bw = Math.cos(rad);
        this.data[0] = ax * bw + ay * bz;
        this.data[1] = ay * bw - ax * bz;
        this.data[2] = az * bw + aw * bz;
        this.data[3] = aw * bw - az * bz;
    }

    rotationTo( v0, v1 ){
        let dot = Vec3.dot(v0, v1);
        if (dot < -0.999999) {
        tmpvec.cross( xvec , v0);
        if (tmpvec.length() < 0.000001)
            tmpvec.cross( yvec, v0 );
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

    length(){
        let l = this.data[0]*this.data[0] + this.data[1]*this.data[1] + this.data[2]*this.data[2] + this.data[3]*this.data[3];
        if(l > 0){
            return Math.sqrt(l);
        }else{
            return 0;
        }
    }

    normalize(){
        let l = this.data[0]*this.data[0] + this.data[1]*this.data[1] + this.data[2]*this.data[2] + this.data[3]*this.data[3];
        if(l > 0){
            l = 1 / Math.sqrt(l);
            this.data[0] *= l;
            this.data[1] *= l;
            this.data[2] *= l;
            this.data[3] *= l;
        }
    }
}

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
class Mat4{
    /**
     * Creates new identity matrix.
     */
    constructor(){
        /**
         * Array containing all 16 matrix values.
         * this can be passed to {@link ShaderProgram} as uniform.
         * @type {Float32Array}
         */
        this.data = new Float32Array([
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        ]);
    }
    /**
     * Sets matrix values to identity
     */
    identity(){
        this.data[ 0] = 1;this.data[ 1] = 0;this.data[ 2] = 0;this.data[ 3] = 0;
        this.data[ 4] = 0;this.data[ 5] = 1;this.data[ 6] = 0;this.data[ 7] = 0;
        this.data[ 8] = 0;this.data[ 9] = 0;this.data[10] = 1;this.data[11] = 0;
        this.data[12] = 0;this.data[13] = 0;this.data[14] = 0;this.data[15] = 1;
    }
    /**
     * Sets matrix values to 0
     */
    zero(){
        this.data[ 0] = 0;this.data[ 1] = 0;this.data[ 2] = 0;this.data[ 3] = 0;
        this.data[ 4] = 0;this.data[ 5] = 0;this.data[ 6] = 0;this.data[ 7] = 0;
        this.data[ 8] = 0;this.data[ 9] = 0;this.data[10] = 0;this.data[11] = 0;
        this.data[12] = 0;this.data[13] = 0;this.data[14] = 0;this.data[15] = 0;
    }
    /**
     * Inverts a matrix transformation.<br>
     * turn a worldToLocal transformation into localToWorld one for example.
     */
    invert(){
        let a00 = this.data[0], a01 = this.data[1], a02 = this.data[2], a03 = this.data[3];
        let a10 = this.data[4], a11 = this.data[5], a12 = this.data[6], a13 = this.data[7];
        let a20 = this.data[8], a21 = this.data[9], a22 = this.data[10], a23 = this.data[11];
        let a30 = this.data[12], a31 = this.data[13], a32 = this.data[14], a33 = this.data[15];
      
        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;
      
        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
      
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
    multiply(other){
        let a00 = other.data[0], a01 = other.data[1], a02 = other.data[2], a03 = other.data[3];
        let a10 = other.data[4], a11 = other.data[5], a12 = other.data[6], a13 = other.data[7];
        let a20 = other.data[8], a21 = other.data[9], a22 = other.data[10], a23 = other.data[11];
        let a30 = other.data[12], a31 = other.data[13], a32 = other.data[14], a33 = other.data[15];

        let b0  = this.data[0], b1 = this.data[1], b2 = this.data[2], b3 = this.data[3];
        this.data[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        this.data[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        this.data[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        this.data[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = this.data[4]; b1 = this.data[5]; b2 = this.data[6]; b3 = this.data[7];
        this.data[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        this.data[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        this.data[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        this.data[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = this.data[8]; b1 = this.data[9]; b2 = this.data[10]; b3 = this.data[11];
        this.data[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        this.data[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        this.data[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        this.data[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = this.data[12]; b1 = this.data[13]; b2 = this.data[14]; b3 = this.data[15];
        this.data[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        this.data[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        this.data[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        this.data[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    }
    /**
     * Set this matrix to transformation matrix from position, rotation and scale.
     * @param {Vec3} pos 
     * @param {Quat} rot 
     * @param {Vec3} scale 
     */
    trs( pos, rot, scale ){
        let x = rot.data[0], y = rot.data[1], z = rot.data[2], w = rot.data[3];
        let x2 = x + x;
        let y2 = y + y;
        let z2 = z + z;

        let xx = x * x2;
        let xy = x * y2;
        let xz = x * z2;
        let yy = y * y2;
        let yz = y * z2;
        let zz = z * z2;
        let wx = w * x2;
        let wy = w * y2;
        let wz = w * z2;
        let sx = scale.data[0];
        let sy = scale.data[1];
        let sz = scale.data[2];

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
    setTranslation(x,y,z){
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
    perspective( fov, aspect, near, far ){
        let f = 1.0 / Math.tan(fov / 2), nf;
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
            this.data[14] = (2 * far * near) * nf;
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
    orthogonal( left, right, bottom, top, near, far ){
        let lr = 1 / (left - right);
        let bt = 1 / (bottom - top);
        let nf = 1 / (near - far);
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
    copy(other){
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
}

/**
 * Base class for all 2D texture related subclasses.
 * Stores texture parameters and a webgl texture object.<br>
 * set {@link BaseTexture2D#needsUpdate} true if any member has changed.<br>
 * the webgl texture will be updated at the next time it is used with {@link BaseTexture2D#setActive}.<br>
 * <br>
 * subclasses : {@link Texture2D}, {@link DataTexture2D}.
 */
class BaseTexture2D{
    constructor(){
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
    init(gl){
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
    update(gl){
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
    setActive(gl, textureUnit){
        if(!this.isInitialized){this.init(gl);}
        if(this.needsUpdate){this.update(gl);}
        gl.activeTexture(gl.TEXTURE0+textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
}

/**
 * Draw TypedArray as 2D texture. also used in {@link Framebuffer2D}.
 * @extends BaseTexture2D
 */
class DataTexture2D extends BaseTexture2D{
    /**
     * 
     * @param {ArrayBufferView} data 
     * @param {Number} width 
     * @param {Number} height 
     * @param {String} internalFormat gl pixel format. default: RGBA
     * @param {String} sourceFormat   gl pixel format. default: RGBA
     * @param {String} pixelType      gl pixel type.   default UNSIGNED_BYTE
     */
    constructor( data, width, height, internalFormat, sourceFormat, pixelType ){
        super();
        this.data = data;
        this.width = width;
        this.height = height;
        this.internalFormat = internalFormat||'RGBA';
        this.sourceFormat = sourceFormat||'RGBA';
        this.pixelType = pixelType||'UNSIGNED_BYTE';
    }

    /**
     * @description Updates webgl texture data and parameters.
     * @param {WebGLRenderingContext} gl 
     */
    update(gl){
        super.update(gl);
        gl.texImage2D(
            gl.TEXTURE_2D, 
            0, 
            gl[this.internalFormat], 
            this.width, this.height, 
            0, 
            gl[this.sourceFormat], 
            gl[this.pixelType], 
            this.data
        );
    }
}

/**
 * This class is intended to only display loaded images.
 * For displaying data buffers use {@link DataTexture2D}.
 * @extends BaseTexture2D
 */
class Texture2D extends BaseTexture2D{
    /**
     * @param {String} url path to image to load.
     */
    constructor( url ){
        super();
        this.url = url;
        this.image = new Image();
        this.internalFormat = 'RGBA';
        this.sourceFormat = 'RGBA';
        this.pixelType = 'UNSIGNED_BYTE';

        this.image.texture2D = this;
        this.image.onload = function(){
            this.texture2D.needsUpdate = true;
        };
        this.image.src = this.url;
    }

    /**
     * @description Updates webgl texture data and parameters.
     * @param {WebGLRenderingContext} gl 
     */
    update(gl){
        super.update(gl);
        gl.texImage2D(
            gl.TEXTURE_2D, 
            0, 
            gl[this.internalFormat], 
            gl[this.sourceFormat], 
            gl[this.pixelType], 
            this.image
        );
    }
}

/**
 * Contains color and depth rendering target buffers for WebGL.
 * Essential for render-to-texture implementations.
 */
class Framebuffer2D{
    /**
     * @param {Number} width width of the framebuffer in pixels
     * @param {Number} height height of the framebuffer in pixels
     * @param {Boolean} useColor wether to create buffer for color data (cannot be changed after creation)
     * @param {Boolean} useDepth wether to create buffer for depth data (cannot be changed after creation)
     */
    constructor( width, height, useColor, useDepth ){
        this.useColor = useColor || true;
        this.useDepth = useDepth || true;
        this.width = width;
        this.height = height;
        if(this.useColor){
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
    init(gl){
        if(this.useColor){
            this.colorTexture.init(gl);
            this.colorTexture.update(gl);
            this.framebuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.colorTexture.texture, 0);
        }
        if(this.useDepth){
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
    update(gl){
        if(this.useColor){
            this.colorTexture.width = this.width;
            this.colorTexture.height = this.height;
            this.colorTexture.update(gl);
        }
        if(this.useDepth){
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
        }
        this.needsUpdate = false;
    }
    /**
     * @description binds this framebuffer and sets up gl viewport. also initializes and/or updates buffers if necessary.
     * @param {WebGLRenderingContext} gl
     */
    setActive(gl){
        if(!this.isInitialized){this.init(gl);}
        if(this.needsUpdate){this.update(gl);}
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.viewport(0,0,this.width, this.height);
    }
}

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
class ShaderProgram{
    /** 
     * @param {String} vertexSource vertex shader glsl string
     * @param {String} fragmentSource vertex shader glsl string
     * @param {Object<String, Uniform>} uniforms (optional) uniforms for this program.
     */
    constructor( vertexSource, fragmentSource, uniforms ){
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
    compile(gl){
        this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.vertexShader, this.vertexSource);
        gl.compileShader(this.vertexShader);
        let message = gl.getShaderInfoLog(this.vertexShader);
        if (message.length > 0) {
            throw " vertex shader could not be compiled! "+message+" "+this.vertexSource;
        }
        gl.shaderSource(this.fragmentShader, this.fragmentSource);
        gl.compileShader(this.fragmentShader);
        message = gl.getShaderInfoLog(this.fragmentShader);
        if (message.length > 0) {
            throw " fragment shader could not be compiled! "+message+" "+this.fragmentSource;
        }
        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);
        gl.linkProgram(this.program);
        this.isCompiled = true;
    }
    getAttributeLocation(gl, name){
        if(this.attributeLocations[name] === undefined){
            this.attributeLocations[name] = gl.getAttribLocation(this.program, name);
        }
        return this.attributeLocations[name];
    }
    getUniformLocation(gl, name){
        if(this.uniformLocations[name] === undefined){
            this.uniformLocations[name] = gl.getUniformLocation(this.program, name);
        }
        return this.uniformLocations[name];
    }
    setUniform(gl, name, type, value){
        let loc = this.getUniformLocation(gl,name);
        if(loc === null){ return; }
        switch(type){
            case 'm4': gl.uniformMatrix4fv(loc, false, value); break;
            case 'm3': gl.uniformMatrix3fv(loc, false, value); break;
            case 'm2': gl.uniformMatrix2fv(loc, false, value); break;
            case '1f': gl.uniform1f(loc, value); break;
            case '2fv': gl.uniform2fv(loc, value); break;
            case '3fv': gl.uniform3fv(loc, value); break;
            case '4fv': gl.uniform4fv(loc, value); break;
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
    use(gl){
        this.textureUnit = 0;
        if(!this.isCompiled){ this.compile(gl); }
        gl.useProgram(this.program);
        for(let name in this.uniforms){
            this.setUniform(gl, name, this.uniforms[name].type, this.uniforms[name].value);
        }
        if(this.enableBlending){
            gl.enable(gl.BLEND);
            gl.blendFunc( this.blendSRC, this.blendDST );
        }else{
            gl.disable(gl.BLEND);
        }
        if(this.enableDepth){ 
            gl.enable(gl.DEPTH_TEST); 
            gl.depthFunc(gl[this.depthFunc]); 
        }else{
            gl.disable(gl.DEPTH_TEST);
        }
        if(this.enableCulling){
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl[this.cullFace]);
        }else{
            gl.disable(gl.CULL_FACE);
        }
    }
}

/**
 * Mesh Attribute
 */
class MeshAttribute{
    /**
     * 
     * @param {String} name attribute name
     * @param {ArrayBufferView} data typed array of data for the attribute
     * @param {Number} size size of data in array. 2 for vec2, 3 for vec3, etc...
     * @param {String} type datatype matching the typed array datatype. 'FLOAT', 'UNSIGNED_BYTE', etc
     * @param {Boolean} normalized wether the data is normalised to 0-1 range for glsl.
     * @param {String} usage usage hint for gl. 'STATIC_DRAW' or 'DYNAMIC_DRAW'.
     */
    constructor(name, data, size, type, normalized, usage){
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
    init(gl){
        this.buffer = gl.createBuffer();
        this.isInitialized = true;
    }
    /**
     * @description updates buffer data. Internal method. Should not be called manually!
     * @param {WebGLRenderingContext} gl gl context. 
     */
    update(gl){
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
    bind(gl, program){
        var loc = program.getAttributeLocation(gl, this.name);
        if(loc == -1){return;}
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(loc, this.size, gl[this.type], this.normalized, 0, 0);
        gl.enableVertexAttribArray(loc);
    }
    /**
     * Sets new data buffer. and sets this.needsUpdate true.
     * @param {ArrayBufferView} newData 
     */
    setData(newData){
        this.data = newData;
        this.needsUpdate = true;
    }
}

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
class Mesh{
    /**
     * 
     * @param {MeshAttribute[]} attributes attributes for this mesh. must contain an attribute named: 'position'.
     */
    constructor( attributes ){
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
    getAttribute(name){
        for(let i = 0; i < this.attributes.length; i++){
            if(this.attributes[i].name == name){return this.attributes[i];}
        }
    }
    /**
     * Binds all attributes and draws the mesh.
     * @param {WebGLRenderingContext} gl 
     * @param {ShaderProgram} program 
     */
    draw(gl, program){
        for(let i = 0; i < this.attributes.length; i++){
            let a = this.attributes[i];
            if(!a.isInitialized){ a.init(gl); }
            if(a.needsUpdate){ a.update(gl); }
            if(a.name == 'position'){this.vertexCount = a.data.length / a.size;}
            a.bind(gl, program);
        }
        if(this.vertexCount == 0){ return; }

        gl.drawArrays(gl[this.drawMode], 0, this.vertexCount);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}

/**
 * This is main class to represent an object with given mesh 
 * that can be placed into a "world".
 */
class Transform{
    /**
     * @param {Mesh} mesh mesh to be assigned to this transform.
     * @param {ShaderProgram} program shader program to be used while drawing the mesh.
     */
    constructor( mesh, program ){
        /** 
         * @description a random number assigned at creation.
         * @name Transform#id
         * @type {Number}
         * @readonly
         */
        this.id = Math.floor(Math.random()*1000000000);
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
        this.localScale = new Vec3(1,1,1);
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
        this.onupdate = function(){};
    }

    /**
     * @description sets the parent for this transformation object. This affects the localToWorld and worldToLocal matrices.
     * @param {Transform} parent new parent.
     */
    setParent(parent){
        this.parent = parent;
        this.parent.children.push(this);
        this.matrixNeedsUpdate = true;
    }
    /**
     * @description pushes the transform to this.children. Does nothing when given transform is already a child.
     * @param {Transform} child new child.
     */
    addChild(child){
        if(this.children.indexOf(child) != -1){return;}
        if(child.parent != null){
            child.parent.children.splice(child.parent.children.indexOf(child),1);
        }
        children.push(child);
        child.parent = this;
        child.matrixNeedsUpdate = true;
    }
    /**
     * @description this should be called from your mainloop implementation before rendering a frame.
     */
    update(){
        this.onupdate();
        if(this.matrixNeedsUpdate){this.updateMatrix();}
    }

    /**
     * @description updates localToWorld and worldToLocal matrices. 
     * it Is called from {@link Transform#update} if {@link Transform#matrixNeedsUpdate} is true.
     * Also recursively updates the bounds of this and the parent chain.
     */
    updateMatrix(){
        /* matrix recalculations */
        this.localToWorld.trs( this.localPos, this.localRot, this.localScale );
        if(this.parent != null){
            this.localToWorld.multiply( this.parent.localToWorld );
        }
        this.worldToLocal.copy( this.localToWorld );
        this.worldToLocal.invert();
        for(let i = 0; i < this.children.length; i++){
            this.children[i].matrixNeedsUpdate = true;
        }
        this.matrixNeedsUpdate = false;
    }

    /**
     * @description an overridable method to be called before drawing.
     * @param {WebglRenderingContext} gl gl context
     */
    onBeforeDraw(gl){
        
    }

    /**
     * @description main method to draw this.mesh. binds the shaderprogram and assigns uniforms to it.
     * @param {WebglRenderingContext} gl gl context
     * @param {Float32Array} viewMatrix viewMatrix to be used by the shaderProgram. if null then identity matrix is used
     * @param {Float32Array} projectionMatrix projection matrix to be used by the shader program. if null identity matrix is used
     */
    draw(gl, viewProjectionMatrix){
        if(!this.visible){return;}
        if(this.program == null){return;}
        if(this.mesh == null){return;}
        this.onBeforeDraw();
        this.program.use(gl);
        this.program.setUniform(gl, 'viewProjectionMatrix', 'm4', viewProjectionMatrix.data);
        this.program.setUniform(gl, 'modelMatrix', 'm4', this.localToWorld.data);
        for(let name in this.uniforms){
            this.program.setUniform(gl,name,this.uniforms[name].type, this.uniforms[name].value);
        }
        this.mesh.draw(gl, this.program);
    }
}

/**
 * Object containing both view and projection matrix. This makes moving the view around more intuituve.
 * @extends {Transform}
 */
class Camera extends Transform{
    constructor(){
        super();
        /**
         * Render target for this camera. if null then gl context canvas is used as target.
         * @type {Framebuffer2D}
         */
        this._target = null;
        /** width is set by target or canvas size automatically @readonly */
        this._width = 100;
        /** height is set by target or canvas size automatically @readonly */
        this._height = 100;
        /**
         * Field of view in degrees
         */
        this._fov = 90;
        this._near = 0.1;
        this._far = 1000.0;
        this._left = -100;
        this._right = 100;
        this._top = -100;
        this._bottom = 100;
        this._perspective = true;
        this.projectionMatrix = new Mat4();
        this.viewProjectionMatrix = new Mat4();
        this.inverseViewProjectionMatrix = new Mat4();
        /**
         * If true, the projection matrix is updated the next time this camera is set active.<br>
         * This is set true if any of the projection realted parameters have been changed.
         * @name Camera#projectionNeedsUpdate
         * @type {Boolean}
         * @default true
         */
        this.projectionNeedsUpdate = true;
    }
    get target(){return this._target;}
    set target(value){ this._target = value;}
    get width(){return this._width;}
    set width(value){
        if(value != this._width){
            this._width = value;
            this.projectionNeedsUpdate = true;
        }
    }
    get height(){return this._height;}
    set height(value){
        if(value != this._height){
            this._height = value;
            this.projectionNeedsUpdate = true;
        }
    }
    get fov(){ return this._fov; }
    set fov(value){ this._fov = value; this.projectionNeedsUpdate = true; }
    get near(){ return this._near; }
    set near(value){ this._near = value; this.projectionNeedsUpdate = true; }
    get left(){ return this._left; }
    set left(value){ this._left = value; this.projectionNeedsUpdate = true; }
    get right(){ return this._right; }
    set right(value){ this._right = value; this.projectionNeedsUpdate = true; }
    get top(){ return this._top; }
    set top(value){ this._top = value; this.projectionNeedsUpdate = true; }
    get bottom(){ return this._bottom; }
    set bottom(value){ this._bottom = value; this.projectionNeedsUpdate = true; }
    get perspective(){ return this._perspective; }
    set perspective(value){ this._perspective = value; this.projectionNeedsUpdate = true; }
    
    /**
     * Updates the viewProjection combined matrix. this is done when camera transformation matrix is updated and if the projection matrix is updated.
     */
    updateViewProjectionMatrix(){
        this.viewProjectionMatrix.copy(this.worldToLocal);
        this.viewProjectionMatrix.multiply(this.projectionMatrix);
        this.inverseViewProjectionMatrix.copy(this.viewProjectionMatrix);
        this.inverseViewProjectionMatrix.invert();
    }

    /**
     * Updates the projection matrix. This is done automatically if {@link Camera#projectionNeedsUpdate} is true when {@link Camera#setActive} is called.
     */
    updateProjectionMatrix(){
        if(this.perspective){
            this.projectionMatrix.perspective( this.fov * 0.0174532925, this.width/this.height, this.near, this.far );
        }else{
            this.projectionMatrix.orthogonal( this.left, this.right, this.bottom, this.top, this.near, this.far);
        }
        this.updateViewProjectionMatrix();
        this.projectionNeedsUpdate = false;
    }

    updateMatrix(){
        super.updateMatrix();
        this.updateViewProjectionMatrix();
    }

    /**
     * Call this before drawing to set up the gl viewport and update projection matrix if needed.
     * @param {WebGLRenderingContext} gl 
     */
    setActive(gl){
        if(this._target == null){
            this.width = gl.canvas.width;
            this.height = gl.canvas.height;
        }else{
            this.width = this.target.width;
            this.height = this.target.height;
            this._target.setActive(gl);
        }
        if(this.projectionNeedsUpdate){
            this.updateProjectionMatrix();
        }
        gl.viewport(0,0,this.width, this.height);
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    }

    /**
     * Transforms the vector from NDC to world space.
     * @param {Vec3} point Screen point in NDC(normalized device coordinates).
     */
    NDCToWorld(point){
        point.transformMat4( this.localToWorld );
    }

    /**
     * Transforms the vector from screen pixel coordinates to world space.
     * @param {Vec3} point Screen point in pixel coordinates.
     */
    screenToWorld(point){
        // point to NDC
        // z is unchanged
        point.data[0] /= this._width;
        point.data[0] = point.data[0] * 2 - 1;
        
        point.data[1] /= this._height;
        point.data[1] = point.data[1] * 2 - 1;
        point.data[1]*= -1;

        // apply aspect ratio
        point.data[0] *= this._width / this._height;

        this.NDCToWorld(point);
    }
}

export { Vec3, Quat, Mat4, BaseTexture2D, DataTexture2D, Texture2D, Framebuffer2D, Transform, Camera, ShaderProgram, Mesh, MeshAttribute };
