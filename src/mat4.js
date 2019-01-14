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
export class Mat4{
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