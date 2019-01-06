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
     * Returns true if all components are zero.
     */
    isZero(){
        return this[0] == 0 && this[1] == 0 && this[2] == 0;
    }
}