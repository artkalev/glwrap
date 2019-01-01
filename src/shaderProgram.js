export class ShaderProgram{
    constructor( vertexSource, fragmentSource, uniforms ){
        this.vertexSource = vertexSource;
        this.fragmentSource = fragmentSource;
        this.vertexShader = null;
        this.fragmentShader = null;
        this.program = null;
        this.textureUnit = 0;
        /** @description uniforms for this shader program*/
        this.uniforms = uniforms || {};
        /** @description cache for uniforms locations to avoid looking them up by webgl every time */
        this.uniformLocations = {};
        /** @description cache for attribute locations to avoid looking them up by webgl every time */
        this.attributeLocations = {};

        this.enableDepth = true;
        this.depthFunc = 'LEQUAL';
        this.enableCulling = true;
        this.cullFace = 'BACK';

        this.isCompiled = false;
    }
    compile(gl){
        this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.vertexShader, this.vertexSource);
        gl.compileShader(this.vertexShader);
        gl.shaderSource(this.fragmentShader, this.fragmentSource);
        gl.compileShader(this.fragmentShader);
        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);
        gl.linkProgram(this.program);
        this.isCompiled = true;
    }
    getAttributeLocation(gl, name){
        if(this.attributeLocations[name] === undefined){
            this.attributeLocations[name] = gl.getAttribLocation(this.program, name);
        }
        return this.attributeLocations[name];
    }
    getUniformLocation(gl, name){
        if(this.uniformLocations[name] === undefined){
            this.uniformLocations[name] = gl.getUniformLocation(this.program, name);
        }
        return this.uniformLocations[name];
    }
    setUniform(gl, name, type, value){
        let loc = this.getUniformLocation(gl,name);
        if(loc === null){ return; }
        switch(type){
            case 'm4': gl.uniformMatrix4fv(loc, false, value); break;
            case 'm3': gl.uniformMatrix3fv(loc, false, value); break;
            case 'm2': gl.uniformMatrix2fv(loc, false, value); break;
            case '1f': gl.uniform1f(loc, value); break;
            case '2fv': gl.uniform2fv(loc, value); break;
            case '3fv': gl.uniform3fv(loc, value); break;
            case '4fv': gl.uniform4fv(loc, value); break;
            case 't2d':
                value.setActive(gl, this.textureUnit);
                gl.uniform1i(loc, this.textureUnit);
                this.textureUnit++;
                break;
        }
    }
    use(gl){
        this.textureUnit = 0;
        if(!this.isCompiled){ this.compile(gl); }
        gl.useProgram(this.program);
        for(let name in this.uniforms){
            this.setUniform(gl, name, this.uniforms[name].type, this.uniforms[name].value);
        }
        if(this.enableDepth){ 
            gl.enable(gl.DEPTH_TEST); 
            gl.depthFunc(gl[this.depthFunc]); 
        }else{
            gl.disable(gl.DEPTH_TEST);
        }
        if(this.enableCulling){
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl[this.cullFace]);
        }else{
            gl.disable(gl.CULL_FACE);
        }
    }
}