import { ShaderProgram } from "./shaderProgram.js";
/**
 * Mesh Attribute
 */
export class MeshAttribute{
    /**
     * 
     * @param {String} name attribute name
     * @param {ArrayBufferView} data typed array of data for the attribute
     * @param {Number} size size of data in array. 2 for vec2, 3 for vec3, etc...
     * @param {String} type datatype matching the typed array datatype. 'FLOAT', 'UNSIGNED_BYTE', etc
     * @param {Boolean} normalized wether the data is normalised to 0-1 range for glsl.
     * @param {String} usage usage hint for gl. 'STATIC_DRAW' or 'DYNAMIC_DRAW'.
     */
    constructor(name, data, size, type, normalized, usage){
        this.name = name;
        this.data = data;
        this.size = size || 3;
        this.type = type || 'FLOAT';
        this.usage = usage || 'STATIC_DRAW';
        this.normalized = normalized || false;
        this.buffer = null;
        this.needsUpdate = true;
        this.isInitialized = false;
    }
    /**
     * @description initializes buffer. Internal method. Should not be called manually!
     * @param {WebGLRenderingContext} gl gl context. 
     */
    init(gl){
        this.buffer = gl.createBuffer();
        this.isInitialized = true;
    }
    /**
     * @description updates buffer data. Internal method. Should not be called manually!
     * @param {WebGLRenderingContext} gl gl context. 
     */
    update(gl){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.data, gl[this.usage]);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.needsUpdate = false;
    }
    /**
     * @description sets up vertex attribute pointer and binds the buffer.
     * this is used before drawing.
     * @param {WebGLRenderingContext} gl gl context.
     * @param {ShaderProgram} program shaderProgram instance.
     */
    bind(gl, program){
        var loc = program.getAttributeLocation(gl, this.name);
        if(loc == -1){return;}
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(loc, this.size, gl[this.type], this.normalized, 0, 0);
        gl.enableVertexAttribArray(loc);
    }
    /**
     * Sets new data buffer. and sets this.needsUpdate true.
     * @param {ArrayBufferView} newData 
     */
    setData(newData){
        this.data = newData;
        this.needsUpdate = true;
    }
}