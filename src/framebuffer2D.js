import { DataTexture2D } from "./dataTexture2D.js";

export class Framebuffer2D{
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
     * @description updates buffers. internal method, this should not be called manually!
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