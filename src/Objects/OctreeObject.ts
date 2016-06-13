/**
 * OctreeObject
 * 
 * Une tentative d'implementer un Octree...
 */
class OctreeObject extends GameObject implements UpdateRequestSubscriber{
    subscriberId: number;
    value: number;
    constructor(eventManager: EventManager) {
        super(eventManager);
        this.value = 0;
        
        //on s'abonne aux évènements qui nous importe
        this.eventManager.subscribe(this, "UpdateRequestEvent");
        
        //on créé nos composants pour le rendu
        this.components["transform"] = new Transform(this, vec3.create(), mat4.create(), 1.0);
        this.children = Array();                
    }
    
    initValues( values: Array<number>){
        //console.log("children: " + this.components["transform"].location + ", Size: " + this.components["transform"].size);
        if(values.length < 8){
            this.value = values[0];
            /*
            //seulement si c'est une feuille, on lui donne un render
            if(values[0] == 1){
                var cubeMesh = new CubeMesh();
                //var render = new Render(this, cubeMesh, new UniformMaterial([Math.random(), Math.random(), Math.random()], cubeMesh.getVertexCount()));  
                var render = new Render(this, cubeMesh, new UniformMaterial([1.0, 1.0, 1.0], cubeMesh.getVertexCount()));  
                this.components["render"] = render;
            }    
            */
            return;
        }
        var octreeSize = values.length / 8;
        //console.log(octreeSize);
        //console.log("Parent: " + this.components["transform"].location + ", Size: " + this.components["transform"].size)
        for(var i=0; i<8; i++){
            var childValues = values.slice(i*octreeSize, i*octreeSize+octreeSize);
            //console.log(`v: ${values} cv: ${childValues} s: ${i*octreeSize} oc: ${octreeSize} oc: ${values.length}`);
            this.addChildren(i, childValues);
        }
        this.createMesh();
    }
    
    createMesh(){
        //l'Enfant possède cette methode mais vide alors il ne sera jamais affiché
         var octreeMesh = new OctreeMesh(this);
        //var render = new Render(this, cubeMesh, new UniformMaterial([Math.random(), Math.random(), Math.random()], cubeMesh.getVertexCount()));  
        var render = new Render(this, octreeMesh, new UniformMaterial([1.0, 1.0, 1.0], octreeMesh.getVertexCount()));  
        this.components["render"] = render;
        
        //lightningShader
        var shaderProgram = new ShaderProgram(new VertexLightning(), new FragmentLightning());
        this.eventManager.publish(new RegisterShaderEvent(shaderProgram));
        render.shaderProgram = shaderProgram;
    }
    
    addChildren(index: number, values: Array<number>){
        var octree = new OctreeChildren(this.eventManager);
        var childSize = this.getSize()/2.0;
        octree.changeSize(childSize);
        var loc = this.getLocation();
        switch(index){
            case 0:
                octree.moveTo([loc[0] - (childSize/2), loc[1] - (childSize/2), loc[2] - (childSize/2)]);
                break;
            case 1:
                octree.moveTo([loc[0] - (childSize/2), loc[1] - (childSize/2), loc[2] + (childSize/2)]);
                break;
            case 2:
                octree.moveTo([loc[0] - (childSize/2), loc[1] + (childSize/2), loc[2] - (childSize/2)]);
                break;
            case 3:
                octree.moveTo([loc[0] - (childSize/2), loc[1] + (childSize/2), loc[2] + (childSize/2)]);
                break;
            case 4:
                octree.moveTo([loc[0] + (childSize/2), loc[1] - (childSize/2), loc[2] - (childSize/2)]);
                break;
            case 5:
                octree.moveTo([loc[0] + (childSize/2), loc[1] - (childSize/2), loc[2] + (childSize/2)]);
                break;
            case 6:
                octree.moveTo([loc[0] + (childSize/2), loc[1] + (childSize/2), loc[2] - (childSize/2)]);
                break;
            case 7:
                octree.moveTo([loc[0] + (childSize/2), loc[1] + (childSize/2), loc[2] + (childSize/2)]);
                break;
        }
        octree.initValues(values);
        this.children.push(octree);
    }
    
    update(dt: number){       
    }
}