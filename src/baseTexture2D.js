

/**
 * Base class for all 2D texture related subclasses.
 * Stores texture parameters and a webgl texture object.<br>
 * set {@link BaseTexture2D#needsUpdate} true if any member has changed.<br>
 * the webgl texture will be updated at the next time it is used with {@link BaseTexture2D#setActive}.<br>
 * <br>
 * subclasses : {@link Texture2D}, {@link DataTexture2D}.
 */
export class BaseTexture2D{
    constructor(){
        /**
         * internal pixel format for webgl.
         * @type {String}
         * @default 'RGBA'
         * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#Pixel_formats
         */
        this.internalFormat = 'RGBA';
        /**
         * source pixel format for webgl. (same as {@link BaseTexture2D#internalFormat} for WebGL1). 
         * @type {String}
         * @default 'RGBA'
         * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#Pixel_formats
         */
        this.sourceFormat = 'RGBA';
        /**
         * pixel data type.
         * @type {String}
         * @default 'UNSIGNED_BYTE'
         * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#Pixel_types
         */
        this.pixelType = 'UNSIGNED_BYTE';
        /** 
         * webgl texture object. This will be created by {@link BaseTexture2D#init}.
         * @type {WebGLTexture}
         */
        this.texture = null;
        this.isInitialized = false;
        /**
         * if true webgl texture object is updated the next time {@link BaseTexture2D#setActive} is called.
         * @type {Boolean}
         */
        this.needsUpdate = false;
        /**
         * GL Wrapping on S coordinate.
         * @type {String}
         * @default 'REPEAT'
         */
        this.wrapS = 'REPEAT';
        /**
         * GL Wrapping on T coordinate.
         * @type {String}
         * @default 'REPEAT'
         */
        this.wrapT = 'REPEAT';
        /**
         * wether to create mipmaps on next update.
         * mipmapping only works on power of 2 sized textures!
         * @type {Boolean}
         * @default false
         */
        this.useMipmaps = false;
        /**
         * GL magnification filtering. Affects how a texel is rendered if it is bigger than screen pixel.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#Textures
         * @default 'NEAREST'
         */
        this.magFilter = 'NEAREST';
        /**
         * GL minification filtering. Affects how a texel is rendered if it is smaller than screen pixel.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#Textures
         * @default 'NEAREST'
         */
        this.minFilter = 'NEAREST';
    }
    /**
     * Creates the WebGLTexture instance. There is no need to call this manually in most cases. It is called from {@link BaseTexture2D#setActive} if needed.
     * @param {WebGLRenderingContext} gl 
     */
    init(gl){
        this.texture = gl.createTexture();
        this.isInitialized = true;
    }
    /**
     * @description updates texture data and parameters.<br>
     * Actual update of texture data must be implemented in a subclass!.<br>
     * {@link BaseTexture2D} only implements assigning texture parameter values.
     * @param {WebGLRenderingContext} gl
     * @abstract
     */
    update(gl){
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[this.magFilter]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[this.minFilter]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[this.wrapS]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[this.wrapT]);
        this.needsUpdate = false;
    }
    /**
     * Initializes and updates this texture if necessary and then binds it to given texture unit.
     * This is used internally when {@link ShaderProgram} sets a texture uniform.
     * @param {WebGLRenderingContext} gl
     * @param {Number} textureUnit
     */
    setActive(gl, textureUnit){
        if(!this.isInitialized){this.init(gl);}
        if(this.needsUpdate){this.update(gl);}
        gl.activeTexture(gl.TEXTURE0+textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
}