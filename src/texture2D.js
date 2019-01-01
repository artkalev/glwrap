export class Texture2D{
    constructor( url ){
        this.url = url;
        this.image = new Image();
        this.internalFormat = 'RGBA';
        this.sourceFormat = 'RGBA';
        this.pixelType = 'UNSIGNED_BYTE';
        this.texture = null;
        this.isInitialized = false;
        this.needsUpdate = false;
        this.wrapS = 'REPEAT';
        this.wrapT = 'REPEAT';
        this.useMipmaps = false;
        this.magFilter = 'LINEAR';
        this.minFilter = 'LINEAR';

        this.image.texture2D = this;
        this.image.onload = function(){
            this.texture2D.needsUpdate = true;
        }
        this.image.src = this.url;
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
            gl[this.sourceFormat], 
            gl[this.pixelType], 
            this.image
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