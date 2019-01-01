import * as mat4 from './gl-matrix/mat4.js';
import * as vec3 from './gl-matrix/vec3.js';
import * as quat from './gl-matrix/quat.js';
import { Mesh } from './mesh.js';
import { ShaderProgram } from './shaderProgram.js';
import { Bounds } from './bounds.js';

const identityMatrix = mat4.create();

export class Transform{
    /**
     * @description standard 3D object transformation representation. only rendered if both program and mesh has been assigned.
     * @param {Mesh} mesh mesh to be assigned to this transform.
     * @param {ShaderProgram} program shader program to be used while drawing the mesh.
     */
    constructor( mesh, program ){
        this.id = Math.floor(Math.random()*1000000000);
        this.localPos = vec3.create();
        this.localRot = quat.create();
        this.localScale = vec3.fromValues(1,1,1);
        this.localToWorld = mat4.create();
        this.worldToLocal = mat4.create();
        this.bounds = new Bounds();
        this.program = program;
        /**
         * @description object uniforms overriding shader program uniforms.
         * this enables to set different uniforms per object.
         * for example to fade object in/out.
         */
        this.uniforms = {};
        this.mesh = mesh;
        this.parent = null;
        this.children = [];
        this.matrixUpdate = true;
        this.visible = true;
        this.onupdate = function(){};
    }

    rotateX(deg){
        quat.rotateX(this.localRot, this.localRot, deg);
        this.matrixUpdate = true;
    }
    rotateY(deg){
        quat.rotateY(this.localRot, this.localRot, deg);
        this.matrixUpdate = true;
    }
    rotateZ(deg){
        quat.rotateZ(this.localRot, this.localRot, deg);
        this.matrixUpdate = true;
    }

    /**
     * @description sets the parent for this transformation object. This affects the localToWorld and worldToLocal matrices.
     * @param {Transform} parent 
     */
    setParent(parent){
        this.parent = parent;
        this.parent.children.push(this);
        this.matrixUpdate = true;
    }
    /**
     * @description pushes the transform to this.children. Does nothing when given transform is already a child.
     * @param {Transform} child 
     */
    addChild(child){
        if(this.children.indexOf(child) != -1){return;}
        if(child.parent != null){
            child.parent.children.splice(child.parent.children.indexOf(child),1);
        }
        children.push(child);
        child.parent = this;
        child.matrixUpdate = true;
    }
    /**
     * @description this should be called from your mainloop implementation before rendering a frame.
     */
    update(){
        this.onupdate();
        if(this.matrixUpdate){this.updateMatrix();}
    }

    updateBounds(){
        if(this.mesh != null){
            this.bounds.fromBoundsWithMatrix(this.mesh.bounds, this.localToWorld);
        }
        for(let i = 0; i < this.children.length; i++){
            this.bounds.extendToBounds(this.children[i].bounds);
        }
        if(this.parent != null){
            this.parent.updateBounds();
        }
    }

    /**
     * @description updates localToWorld and worldToLocal matrices. 
     * it Is called automaticalli from update() if this.needsUpdate is true.
     * Also recursively updates the bounds of this and the parent chain.
     */
    updateMatrix(){
        /* matrix recalculations */
        mat4.fromRotationTranslationScale(this.localToWorld, this.localRot, this.localPos, this.localScale);
        if(this.parent != null){
            mat4.multiply(this.localToWorld, this.parent.localToWorld, this.localToWorld);
        }
        mat4.invert(this.worldToLocal, this.localToWorld);
        /* recalculating bounds */
        this.updateBounds();
        for(let i = 0; i < this.children.length; i++){
            this.children[i].matrixUpdate = true;
        }
        this.matrixUpdate = false;
    }

    /**
     * @description an overridable method to be called before drawing.
     * @param {WebglRenderingContext} gl gl context
     */
    onBeforeDraw(gl){
        
    }

    /**
     * @description main method to draw this.mesh. binds the shaderprogram and assigns uniforms to it.
     * @param {WebglRenderingContext} gl gl context
     * @param {Float32Array} viewMatrix viewMatrix to be used by the shaderProgram. if null then identity matrix is used
     * @param {Float32Array} projectionMatrix projection matrix to be used by the shader program. if null identity matrix is used
     */
    draw(gl, viewMatrix, projectionMatrix){
        if(!this.visible){return;}
        if(this.program == null){return;}
        if(this.mesh == null){return;}
        this.onBeforeDraw();
        this.program.use(gl);
        if(!viewMatrix){
            this.program.setUniform(gl, 'u_viewMatrix', 'm4', identityMatrix);
        }else{
            this.program.setUniform(gl, 'u_viewMatrix', 'm4', viewMatrix);
        }
        if(!projectionMatrix){
            this.program.setUniform(gl, 'u_projMatrix', 'm4', identityMatrix);
        }else{
            this.program.setUniform(gl, 'u_projMatrix', 'm4', projectionMatrix);
        }
        this.program.setUniform(gl, 'u_modelMatrix', 'm4', this.localToWorld);
        for(let name in this.uniforms){
            this.program.setUniform(gl,name,this.uniforms[name].type, this.uniforms[name].value);
        }
        this.mesh.draw(gl, this.program);
    }
}