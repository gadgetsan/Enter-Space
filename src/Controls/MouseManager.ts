/**
 * MouseManager
 * 
 * Permet de gèrer le déplacement de la souris
 */
class MouseManager implements HoveringObjectSubscriber{
    pickingRenderer: PickingRenderer;
    subscriberId: number;
    locked: boolean;
    hoveringObject: GameObject;
    constructor(public eventManager: EventManager) {
        this.locked = false;
        this.pickingRenderer = new PickingRenderer(eventManager);
        //on notifie que l'on veut capturer la souris    
        document.addEventListener("pointerlockchange", this.pointerLockChanged.bind(this), false);
        document.addEventListener("mozpointerlockchange", this.pointerLockChanged.bind(this), false);
        document.addEventListener("webkitpointerlockchange", this.pointerLockChanged.bind(this), false);   
        document.addEventListener("mousemove", this.onMouseMove.bind(this), false);  
        document.addEventListener("click", this.onMouseClick.bind(this), false);  
        this.requestMouseCapture();
        this.hoveringObject = null;
    }
    
    hovering(object: GameObject){
        this.hoveringObject = object;
    }
    
    //Ces fonctions seront appelées avec un callback alors on les bind au present 'this'
    onMouseMove(event: MouseEvent){
        if(this.locked){            
            this.eventManager.publish(new MouseMovedEvent(event)); 
        }
    }
    onMouseClick(event: MouseEvent){
        if(this.locked){          
            this.eventManager.publish(new MouseClickedEvent(event));  
            //on va rendre le picking buffer pour savoir qu'est-ce qu'on a cliqué
        }
    }
    
    pointerLockChanged(event: any){
        if (document.pointerLockElement === CANVAS ||
            document.mozPointerLockElement === CANVAS ||
            document.webkitPointerLockElement === CANVAS) {
            this.locked = true;
            //console.log("locked pointer");
        } else {
            this.locked = false;
        }
    }
        
    requestMouseCapture(){     
        CANVAS.onclick = function(e) {
            var havePointerLock = 'pointerLockElement' in document ||
            'mozPointerLockElement' in document ||
            'webkitPointerLockElement' in document;
            if(!havePointerLock){
                alert("this browser does not support pointer lock...");
            }else{           
                CANVAS.requestPointerLock();
            }
        }
    }
}