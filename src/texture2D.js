import { BaseTexture2D } from "./baseTexture2D.js";

/**
 * This class is intended to only display loaded images.
 * For displaying data buffers use {@link DataTexture2D}.
 * @extends BaseTexture2D
 */
export class Texture2D extends BaseTexture2D{
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
        }
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