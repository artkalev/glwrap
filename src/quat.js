import {Vec3} from './vec3.js';

let tmpvec = new Vec3();
let xvec = new Vec3(1,0,0);
let yvec = new Vec3(0,1,0);

/**
 * Quaternion rotation
 */
export class Quat{
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