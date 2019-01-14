import {Vec3} from './vec3.js';
import {Quat} from './quat.js';
import {Mat4} from './mat4.js';
import { Mesh } from './mesh.js';
import { ShaderProgram } from './shaderProgram.js';

/**
 * This is main class to represent an object with given mesh 
 * that can be placed into a "world".
 */
export class Transform{
    /**
     * @param {Mesh} mesh mesh to be assigned to this transform.
     * @param {ShaderProgram} program shader program to be used while drawing the mesh.
     */
    constructor( mesh, program ){
        /** 
         * @description a random number assigned at creation.
         * @name Transform#id
         * @type {Number}
         * @readonly
         */
        this.id = Math.floor(Math.random()*1000000000);
        /** 
         * @description Translation in localSpace. set {@link Transform#matrixNeedsUpdate} true after modifying manually!
         * @name Transform#localPos
         * @type {Vec3}
         */
        this.localPos = new Vec3();
        /** 
         * @description Rotation in localSpace. set {@link Transform#matrixNeedsUpdate} true after modifying manually!
         * @name Transform#localRot
         * @type {Quat}
         */
        this.localRot = new Quat();
        /** 
         * @description Scale in localSpace. set {@link Transform#matrixNeedsUpdate} true after modifying manually!
         * @name Transform#localScale
         * @type {Vec3}
         */
        this.localScale = new Vec3(1,1,1);
        /** 
         * @description transformation from localSpace to world space. This is used as model matrix in glsl.
         * Calculated from {@link Transform#localPos},{@link Transform#localRot},{@link Transform#localScale}
         * and {@link Transform#parent} matrix.
         * if {@link Transform#matrixNeedsUpdate} is true, it will be recalculated at next {@link Transform#update} call.
         * @name Transform#localToWorld
         * @type {Mat4}
         */
        this.localToWorld = new Mat4();
        /**
         * @description transformation from world space to local space. This is just {@link Transform#localToWorld} inverted.
         * @name Transform#worldToLocal
         * @type {Mat4}
         */
        this.worldToLocal = new Mat4();
        /**
         * @description shader program which is used when drawing {@link Transform#mesh}
         * @name Transform#program
         * @type {ShaderProgram}
         */
        this.program = program;
        /**
         * @description optional uniforms for this transform. they will override the uniforms in {@link Transform#program}
         * @type {Object<String,Uniform>}
         */
        this.uniforms = {};
        /**
         * @description mesh linked to this transformation.
         * @name Transform#mesh
         * @type {Mesh}
         */
        this.mesh = mesh;
        /**
         * @description parent transformation of this. It will affect the {@link Transform#localToWorld} matrix.
         * use {@link Transform#setparent} instead of changing this directly.
         * @name Transform#parent
         * @type {Transform}
         * @readonly
         */
        this.parent = null;
        /**
         * @description children Transforms of this. Use {@link Transform#addChild} instead of changing this directly.
         * @name Transform#children
         * @type {Transform[]}
         * @readonly
         */
        this.children = [];
        /** 
         * @description if true, {@link Transform#localToWorld} is recalculated at next {@link Transform#update} call.
         * This avoids recalculation of matrices after every additional transformation.
         * @name Transform#matrixNeedsUpdate
         * @type {Boolean}
         */
        this.matrixNeedsUpdate = true;
        /**
         * @description controls wether this object is rendered or not.
         * @name Transform#visible
         * @type {Boolean}
         */
        this.visible = true;
        this.onupdate = function(){};
    }

    /**
     * @description sets the parent for this transformation object. This affects the localToWorld and worldToLocal matrices.
     * @param {Transform} parent new parent.
     */
    setParent(parent){
        this.parent = parent;
        this.parent.children.push(this);
        this.matrixNeedsUpdate = true;
    }
    /**
     * @description pushes the transform to this.children. Does nothing when given transform is already a child.
     * @param {Transform} child new child.
     */
    addChild(child){
        if(this.children.indexOf(child) != -1){return;}
        if(child.parent != null){
            child.parent.children.splice(child.parent.children.indexOf(child),1);
        }
        children.push(child);
        child.parent = this;
        child.matrixNeedsUpdate = true;
    }
    /**
     * @description this should be called from your mainloop implementation before rendering a frame.
     */
    update(){
        this.onupdate();
        if(this.matrixNeedsUpdate){this.updateMatrix();}
    }

    /**
     * @description updates localToWorld and worldToLocal matrices. 
     * it Is called from {@link Transform#update} if {@link Transform#matrixNeedsUpdate} is true.
     * Also recursively updates the bounds of this and the parent chain.
     */
    updateMatrix(){
        /* matrix recalculations */
        this.localToWorld.trs( this.localPos, this.localRot, this.localScale );
        if(this.parent != null){
            this.localToWorld.multiply( this.parent.localToWorld );
        }
        this.worldToLocal.copy( this.localToWorld );
        this.worldToLocal.invert();
        for(let i = 0; i < this.children.length; i++){
            this.children[i].matrixNeedsUpdate = true;
        }
        this.matrixNeedsUpdate = false;
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
    draw(gl, viewProjectionMatrix){
        if(!this.visible){return;}
        if(this.program == null){return;}
        if(this.mesh == null){return;}
        this.onBeforeDraw();
        this.program.use(gl);
        this.program.setUniform(gl, 'viewProjectionMatrix', 'm4', viewProjectionMatrix.data);
        this.program.setUniform(gl, 'modelMatrix', 'm4', this.localToWorld.data);
        for(let name in this.uniforms){
            this.program.setUniform(gl,name,this.uniforms[name].type, this.uniforms[name].value);
        }
        this.mesh.draw(gl, this.program);
    }
}