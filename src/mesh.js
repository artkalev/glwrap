import {MeshAttribute} from './meshAttribute.js';

/**
 * Flexible geometry class to draw things with webgl.
 * Different meshes can even share {@link MeshAttribute} objects<br>
 * provided that the vertexCount matches.
 * @example
 * // creating a 2D triangle mesh with position and uv attributes.
 * let position = new MeshAttribute(
 *      "position", // name
 *      new Float32Array([-1.0,-1.0, 0.0,1.0, 1.0,-1.0]), // data
 *      2, // size per vertex (2D vector in this case)
 *      'FLOAT', // data type
 *      false // is data normalized in glsl
 * );
 * let uv = new MeshAttribute(
 *      "uv",
 *      new Uint8Array([0,0, 128,255, 255,0]),
 *      2,
 *      'UNSIGNED_BYTE',
 *      true
 * );
 * let mesh = new Mesh([position, uv]);
 * mesh.draw(gl, program); // program must have uniforms set before drawing!
 */
export class Mesh{
    /**
     * 
     * @param {MeshAttribute[]} attributes attributes for this mesh. must contain an attribute named: 'position'.
     */
    constructor( attributes ){
        /**
         * Mesh Attributes
         * @type {MeshAttribute[]}
         */
        this.attributes = attributes;
        /**
         * Vertex count for this mesh. This is calculated from an attribute named "position"<br>which MUST be present in the attributes array.
         * @type {Number}
         * @readonly
         */
        this.vertexCount = 0;
        /** 
         * Drawing mode of the mesh
         * @type {String}
         * @default 'TRIANGLES'
         * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#Rendering_primitives
         */
        this.drawMode = 'TRIANGLES';
    }
    /**
     * Returns a mesh attribute by name
     * @param {String} name
     * @returns {MeshAttribute} attribute
     */
    getAttribute(name){
        for(let i = 0; i < this.attributes.length; i++){
            if(this.attributes[i].name == name){return this.attributes[i];}
        }
    }
    /**
     * Binds all attributes and draws the mesh.
     * @param {WebGLRenderingContext} gl 
     * @param {ShaderProgram} program 
     */
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