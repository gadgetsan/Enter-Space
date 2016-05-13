/**
 * Ressource
 */
class Ressource extends GameObject {
    constructor(eventManager: EventManager) {
        super(eventManager);
        
        //TODO: sélectionner la bonne couleur pour le type de ressource
        
        //on créé nos composants pour le rendu
        this.components["transform"] = new Transform(this, vec3.create(), mat4.create(), 1.0);
        //this.components["render"] = new Render(this, new CubeMesh(), new UniformMaterial([Math.random(), Math.random(), Math.random(), 1.0], 8));
        this.components["render"] = new Render(this, new CubeMesh(), new UniformMaterial([0.0, 0.0, 0.0, 1.0], 8));
        
    }
    
    update(dt: number){       
    }
}