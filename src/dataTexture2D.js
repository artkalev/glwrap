export class DataTexture2D{
    constructor( data, width, height, internalFormat, sourceFormat, pixelType ){
        this.data = data;
        this.width = width;
        this.height = height;
        this.internalFormat = internalFormat||'RGBA';
        this.sourceFormat = sourceFormat||'RGBA';
        this.pixelType = pixelType||'UNSIGNED_BYTE';
        this.texture = null;
        this.isInitialized = false;
        this.needsUpdate = false;
        this.wrapS = 'REPEAT';
        this.wrapT = 'REPEAT';
        this.useMipmaps = false;
        this.magFilter = 'NEAREST';
        this.minFilter = 'NEAREST';
    }

    init(gl){
        this.texture = gl.createTexture();
        this.isInitialized = true;
    }

    update(gl){
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
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
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[this.magFilter]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[this.minFilter]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[this.wrapS]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[this.wrapT]);
        this.needsUpdate = false;
    }

    setActive(gl, textureUnit){
        if(!this.isInitialized){this.init(gl);}
        if(this.needsUpdate){this.update(gl);}
        gl.activeTexture(gl.TEXTURE0+textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
}