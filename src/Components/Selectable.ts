/**
 * Selectable
 * 
 * Une composante permettant à un objet d'être sélectionné
 */
class Selectable extends Component{
    renderingColor: Array<number>;
    constructor(gameObject: GameObject) {
        super(gameObject);   
    }
    
    hover(){
        if(this.gameObject.components["render"] != null){
            (<Render>this.gameObject.components["render"]).changeColor(1, 1, 0);
        }
        //console.log("Hovering");
    }
    
    unHover(){
        if(this.gameObject.components["render"] != null){
            (<Render>this.gameObject.components["render"]).changeColor(0, 0, 0);
        }
        //console.log("Stopped Hovering");
    }
}