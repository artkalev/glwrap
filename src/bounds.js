import * as vec3 from './gl-matrix/vec3.js';
import * as mat4 from './gl-matrix/mat4.js';
/**
 * @description bounds with box and sphere descriptions.
 * useful for performing frustum culling for example.
 */
export class Bounds{
    constructor(min, max){
        this.min = min || vec3.fromValues(-1,-1,-1);
        this.max = max || vec3.fromValues( 1, 1, 1);
        this.center = vec3.create();;
        this.radius = 1;
        this.calculateSphere();
    }
    calculateSphere(){
        vec3.lerp(this.center, this.min, this.max, 0.5);
        this.radius = vec3.length(this.max);
    }
    setMinMax( min, max ){
        vec3.copy(this.min, min);
        vec3.copy(this.max, max);
        this.calculateSphere();
    }
    extendToBounds(bounds){
        vec3.min(this.min,this.min,bounds.min);
        vec3.max(this.max,this.max,bounds.max);
        this.calculateSphere();
    }
    calculateFromBounds(bounds){
        vec3.set(this.min, 0,0,0);
        vec3.set(this.max, 0,0,0);
        for(let i = 0 ; i < bounds.length; i++){
            vec3.min(this.min, this.min, bounds[i].min);
            vec3.max(this.max, this.max, bounds[i].max);
        }
        this.calculateSphere();
    }
    fromBoundsWithMatrix( bounds, matrix ){
        let corners = [
            bounds.min,
            [bounds.min[0],bounds.max[1],bounds.min[2]],
            [bounds.min[0],bounds.min[1],bounds.max[2]],
            [bounds.min[0],bounds.max[1],bounds.max[2]],
            bounds.max,
            [bounds.max[0],bounds.max[1],bounds.min[2]],
            [bounds.max[0],bounds.min[1],bounds.max[2]],
            [bounds.max[0],bounds.max[1],bounds.max[2]]
        ];
        for(let i = 0; i < corners.length; i++){
            let corner = corners[i];
            vec3.transformMat4(corner, corner, matrix);
            vec3.min(this.min, this.min, corner);
            vec3.max(this.max, this.max, corner);
        }
    }
}