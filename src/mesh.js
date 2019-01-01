import { ShaderProgram } from "./shaderProgram.js";
import { Bounds } from "./bounds.js";
import * as vec3 from './gl-matrix/vec3.js';

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
     * @description initializes buffer. Internal method. Should not be called manually!
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
}

export class Mesh{
    /**
     * 
     * @param {MeshAttribute[]} attributes attributes for this mesh. must contain an attribute named: 'position'.
     */
    constructor( attributes ){
        this.attributes = attributes;
        this.vertexCount = 0;
        this.bounds = new Bounds();
        this.calculateBounds();
        this.drawMode = 'TRIANGLES';
    }
    getAttribute(name){
        for(let i = 0; i < this.attributes.length; i++){
            if(this.attributes[i].name == name){return this.attributes[i];}
        }
    }
    calculateBounds(){
        let positions = this.getAttribute('position');
        if(!positions){return;}
        let min = vec3.create();
        let max = vec3.create();
        for(let i = 0; i < positions.data.length; i+=3){
            vec3.min(min, min, [positions.data[i],positions.data[i+1],positions.data[i+2]]);
            vec3.max(max, max, [positions.data[i],positions.data[i+1],positions.data[i+2]]);
        }
        this.bounds.setMinMax( min, max );
    }
    draw(gl, program){
        for(let i = 0; i < this.attributes.length; i++){
            let a = this.attributes[i];
            if(!a.isInitialized){ a.init(gl); }
            if(a.needsUpdate){ a.update(gl); }
            if(a.name == 'position'){this.vertexCount = a.data.length / a.size;}
            a.bind(gl, program);
        }
        if(this.vertexCount == 0){ return; }

        gl.drawArrays(gl[this.drawMode], 0, this.vertexCount);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}