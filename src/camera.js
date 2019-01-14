import { Transform } from './transform.js';
import { Mat4 } from './mat4.js';
import { Framebuffer2D } from './framebuffer2D.js';

/**
 * Object containing both view and projection matrix. This makes moving the view around more intuituve.
 * @extends {Transform}
 */
export class Camera extends Transform{
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