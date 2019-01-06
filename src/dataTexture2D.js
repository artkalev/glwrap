import { BaseTexture2D } from "./baseTexture2D.js";

/**
 * Draw TypedArray as 2D texture. also used in {@link Framebuffer2D}.
 * @extends BaseTexture2D
 */
export class DataTexture2D extends BaseTexture2D{
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