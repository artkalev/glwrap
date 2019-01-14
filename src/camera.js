import { Transform } from './transform.js';
import { Mat4 } from './mat4.js';
import { Framebuffer2D } from './frambuffer2D.js';

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
        this._width = 100;
        this._height = 100;
        this._fov = 90;
        this._near = 0.1;
        this._far = 1000.0;
        this._left = -100;
        this._right = 100;
        this._top = -100;
        this._bottom = 100;
        this._perspective = true;
        this.projectionMatrix = new Mat4;
        /**
         * If true, the projection matrix is updated the next time this camera is set active.<br>
         * This is set true if any of the projection realted parameters have been changed.
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
    
    updateProjectionMatrix(){
        if(this.perspective){
            
        }else{

        }
        this.projectionNeedsUpdate = false;
    }

    setActive(gl){
        if(this._target == null){
            this.width = gl.canvas.width;
            this.height = gl.canvas.height;
        }else{
            this.width = this.target.width;
            this.height = this.target.height;
        }
        if(this.projectionNeedsUpdate){
            this.updateProjectionMatrix();
        }
        gl.viewport(0,0,this.width, this.height);
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    }
}