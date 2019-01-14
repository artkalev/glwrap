/**
 * 3D vector class
 */
export class Vec3{
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