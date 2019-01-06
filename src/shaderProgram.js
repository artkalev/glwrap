/**
 * @typedef {Object} Uniform
 * @description an object that contains type and value of an uniform.<br>
 * @property {String} type uniform type
 * @property {*} value value of this uniform that must match the type.
 */

/** 
 * Compiles vertex shader, fragment shader and the gl program.<br>
 * Applies blending modes, depth sort modes and face culling modes.<br>
 * stores a set of its own uniforms as well.
 */
export class ShaderProgram{
    /** 
     * @param {String} vertexSource vertex shader glsl string
     * @param {String} fragmentSource vertex shader glsl string
     * @param {Object<String, Uniform>} uniforms (optional) uniforms for this program.
     */
    constructor( vertexSource, fragmentSource, uniforms ){
        /** 
         * @description glsl source code for vertex shader 
         * @type {String}
         */
        this.vertexSource = vertexSource;
        
        /** 
         * @description glsl source code for fragment shader 
         * @type {String}
         */
        this.fragmentSource = fragmentSource;
        
        /**
         * gl shader object
         * @type {WebGLShader}
         */
        this.vertexShader = null;
        
        /**
         * gl shader object
         * @type {WebGLShader}
         */
        this.fragmentShader = null;
        
        /**
         * gl program object
         * @type {WebGLProgram}
         */
        this.program = null;
        
        /**
         * Used internally to keep track of texture units while assigning texture uniforms.
         * @type {Number}
         * @readonly
         */
        this.textureUnit = 0;
        
        /** 
         * @description uniforms for this shader program
         * @type {Object<String,Uniform>}
         */
        this.uniforms = uniforms || {};
        
        /** 
         * @description cache for uniforms locations to avoid looking them up by webgl every time 
         * @type {Object<String,number>}
         * @readonly
         */
        this.uniformLocations = {};
        
        /** 
         * @description cache for attribute locations to avoid looking them up by webgl every time 
         * @type {Object<string,number>}
         * @readonly
         */
        this.attributeLocations = {};
        
        /**
         * Enable or disable gl.BLEND feature
         * @type {Boolean}
         * @default false
         */
        this.enableBlending = false;
        
        /**
         * gl blending source factor
         * @type {String}
         * @default 'ONE'
         */
        this.blendSRC = 'ONE';
        
        /**
         * gl blending destination factor
         * @type {String}
         * @default 'ONE'
         */
        this.blendDST = 'ONE';
        
        /**
         * Enable or disable gl.DEPTH_SORT feature
         * @type {Boolean}
         * @default true
         */
        this.enableDepth = true;
        
        /**
         * Depth sorting function
         * @type {String}
         * @default 'LEQUAL'
         */
        this.depthFunc = 'LEQUAL';
        
        /**
         * Enable or disable gl.CULL_FACE
         * @type {Boolean}
         * @default true
         */
        this.enableCulling = true;
        
        /**
         * Face culling mode
         * @type {String}
         * @default 'BACK'
         */
        this.cullFace = 'BACK';

        /**
         * used internally to check if shaders have been compiled yet
         * @type {Boolean}
         * @readonly
         */
        this.isCompiled = false;
    }
    /**
     * Creates webgl shader and program objects.<br>
     * Assigns shader sources to them.<br>
     * Compiles shaders, attaches them to program and links the program.<br>
     * <br>
     * This is called from {@link ShaderProgram#use} if {@link ShaderProgram#isCompiled} is false.
     * @param {WebGLRenderingContext} gl 
     */
    compile(gl){
        this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.vertexShader, this.vertexSource);
        gl.compileShader(this.vertexShader);
        let message = gl.getShaderInfoLog(this.vertexShader);
        if (message.length > 0) {
            throw " vertex shader could not be compiled! "+message+" "+this.vertexSource;
        }
        gl.shaderSource(this.fragmentShader, this.fragmentSource);
        gl.compileShader(this.fragmentShader);
        message = gl.getShaderInfoLog(this.fragmentShader);
        if (message.length > 0) {
            throw " fragment shader could not be compiled! "+message+" "+this.fragmentSource;
        }
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
    /**
     * Sets this program to be active.<br>
     * and sets blending mode, depth sort mode and face culling mode.
     * Also compiles the shaders if they are not compiled already.
     * @param {WebGLRenderingContext} gl 
     */
    use(gl){
        this.textureUnit = 0;
        if(!this.isCompiled){ this.compile(gl); }
        gl.useProgram(this.program);
        for(let name in this.uniforms){
            this.setUniform(gl, name, this.uniforms[name].type, this.uniforms[name].value);
        }
        if(this.enableBlending){
            gl.enable(gl.BLEND);
            gl.blendFunc( this.blendSRC, this.blendDST );
        }else{
            gl.disable(gl.BLEND);
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