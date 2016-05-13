/**
 * Transform
 * 
 * Composant représentant les dimension (dans l'espace) de l'objet
 */
class Transform extends Component{
    constructor(gameObject: GameObject, public location:GLM.IArray, public rotation: GLM.IArray, public size: number) {
        super(gameObject);
    }
    
    
}