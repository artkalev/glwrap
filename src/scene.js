/**
 * Holds an array of transforms to make updating and drawing a large number of transforms more convenient.
 */
export class Scene{
    constructor(){
        this.transforms = [];
        this.activeCamera = null;
    }
    /**
     * Add Transform to scene objects list. If added transform is camera it is set as the active camera of the scene.
     * @param {Transform} obj 
     */
    addTransform( obj ){
        this.transforms.push(obj);
        if(obj.isCamera){
            this.activeCamera = obj;
        }
    }
    /**
     * Calls {@link Transform#update} on each transform.
     */
    update(){
        for(let i = 0 ; i < this.transforms.length; i++){
            this.transforms[i].update();
        }
    }
    /**
     * Sets up the camera and. Calls {@link Transform#draw} on each transform.
     * @param {WebGLRenderingContext} gl 
     * @param {Camera} camera If camera is undefined, {@link Scene#activeCamera} is used instead.
     */
    draw(gl, camera ){
        let cam = null;
        if(camera !== undefined){
            cam = camera;
        }else if(this.activeCamera != null){
            cam = this.activeCamera;
        }else{
            throw "No camera available to render with!";
        }
        cam.setActive(gl);
        for(let i = 0 ; i < this.transforms.length; i++){
            this.transforms[i].draw(gl, cam);
        }
    }
}