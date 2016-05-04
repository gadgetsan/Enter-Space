/**
 * Cube
 */
class Cube extends GameObject implements UpdateRequestSubscriber{
    subscriberId: number;
    constructor(eventManager: EventManager) {
        super(eventManager);
        //on s'abonne aux évènements qui nous importe
        this.eventManager.subscribe(this, "UpdateRequestEvent");
        
        //on créé nos composants pour le rendu
        this.components["transform"] = new Transform(this, vec3.create(), mat4.create(), 1.0);
        this.components["render"] = new Render(this, new CubeMesh(), new UniformMaterial([Math.random(), Math.random(), Math.random(), 1.0], 8));
        //this.components["render"] = new Render(this, new CubeMesh(), new UniformMaterial([1.0, 1.0, 1.0, 1.0], 8));
        
    }
    
    update(dt: number){       
        var transformComponent = <Transform>(this.components["transform"]);
        mat4.rotate(transformComponent.rotation, transformComponent.rotation, 0.005, [1,0,0]);
    }
}