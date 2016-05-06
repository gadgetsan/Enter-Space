/**
 * KeyboardManager
 * 
 * Permet de gèrer l'appui de touche
 */
class KeyboardManager {
    
    keyPressedArray: Array<boolean>;
    
    constructor(public eventManager: EventManager) {
        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
        document.addEventListener('keyup', this.onKeyUp.bind(this), false);
        this.keyPressedArray = [];
    }
    
    //Ces fonctions seront appelées avec un callback alors on les bind au present 'this'
    onKeyDown(event: KeyboardEvent){
        this.keyPressedArray[event.keyCode] = true;
    }
    
    onKeyUp(event: KeyboardEvent){         
        this.keyPressedArray[event.keyCode] = false;         
    }
    
    sendEvents(dt: number){        
        //pour chaque touche appuyée on lance un event
        this.keyPressedArray.forEach((value, key)=>{
            if(value){              
                this.eventManager.publish(new KeyPressedEvent(key, dt))
            }            
        })
    }
}