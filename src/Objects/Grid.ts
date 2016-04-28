/**
 * Grid
 * Une Grille est en fait un objet en 3 dimensions qui peux avoir plusieurs
 * Degrés de détails dépendament de la distance de la camera
 */
class Grid extends GameObject {
    
    blockSize: number;
    mass: number;
    data: Array<Array<Array<number>>>;
    gridStartLocation: Array<number>;
    centerOfMass: Array<number>;
    
    constructor(public length:number, public size:number, location: Array<number>, public totalLength: number) {
        super();
        
        //on n'As pas le choix si on veux afficher les enfants
        this.renderable = new Renderable();
        this.location = location;
        var sphereSize = 50;
        
        this.blockSize = size/length;
        
        this.mass = 1000000000000000;
        
        this.data= [];
        
        var heightMap = [];
        
        var polarStepLength = (Math.PI*2)/this.totalLength;
        var scale = 0.25;
        
        //Notre Heightmap sera en coordonées polaires
        for(var i=0; i<this.totalLength; i++){
            var currentPhi = polarStepLength*i;
            heightMap.push([]);
            for(var j=0; j<this.totalLength; j++){
                var currentTheta = polarStepLength*j;
                var x = Math.sin(currentTheta)*Math.cos(currentPhi);
                var y = Math.sin(currentTheta)*Math.sin(currentPhi);
                var z = Math.cos(currentTheta);
                var height = OctavePerlin(x*scale, y*scale, z*scale);
                heightMap[i].push(sphereSize+height);
            }
        }
        
        for(var i=0; i< totalLength; i++){
            this.data.push([]);
            var x=(i-(this.totalLength/2));
            for(var j=0;j< totalLength; j++){
                this.data[i].push([]);
                y=(j-this.totalLength/2);
                for(var k=0; k<this.totalLength; k++){
                    var z = (k-(this.totalLength/2));
                    var rho = Math.sqrt((x*x)+(y*y)+(z*z));
                    var phi = Math.atan(y/x)+Math.PI;
                    var theta = Math.acos(z/rho)+Math.PI;
                    var heightMapI = Math.ceil(phi/polarStepLength);
                    var heightMapJ = Math.ceil(theta/polarStepLength);
                    if(!heightMap[heightMapI] || rho < heightMap[heightMapI][heightMapJ]){
                        this.data[i][j].push(1);
                    }else{
                        this.data[i][j].push(0);
                    }
                }
            }
        }
        
        //IMPORTANT: CES NOMBRES DOIVENT ÊTRE ENTIERS
        var cellSize = this.size/4;
        var cellLength = this.length/4;
        
        console.dir(this.data);
        console.dir(heightMap);
        this.gridStartLocation = [this.location[0]-(this.totalLength/2),
                                    this.location[1]-(this.totalLength/2),
                                    this.location[2]-(this.totalLength/2)];
                                    
        //Les cellules doivent aussi savoir ou est l'utilisateur dès le départ pour pouvoir le suivre
        //TODO: il est possible, si l'utilisateur n'est pas direct sur un point que l'emplacement ne soit pas exacte
        var userLocation = [(this.totalLength/2)-(location[0]/this.blockSize),
                            (this.totalLength/2)-(location[1]/this.blockSize),
                            (this.totalLength/2)-(location[2]/this.blockSize)];
                            
        for(var i=-2; i<2;i++){
            for(var j=-2; j<2;j++){
                for(var k=-2; k<2;k++){                    
                    if(i == 1 || i == -2 || j == 1 || j == -2 || k == 1 || k == -2){
                        this.children.push(new Cell(cellSize*2, cellLength, this.data, [i, j, k], this.gridStartLocation, userLocation));
                        this.children.push(new Cell(cellSize*4, cellLength, this.data, [i, j, k], this.gridStartLocation, userLocation));
                    }
                    this.children.push(new Cell(cellSize, cellLength, this.data, [i, j, k], this.gridStartLocation, userLocation));
                }
            }
        }
        this.centerOfMass = [0, 0, 0];
    }
    
    cameraMoved(move:Array<number>, camera: Camera){
        this.children.forEach(child=>{
           child.cameraMoved(move, camera);
        });
    }
    
    update(dt){
        super.update(dt);
        //pour chaque enfant ayant une masse, on applique la gravité
        this.children.forEach(child=>{
            //position relative de l'enfant
            var relativePosition = [];
            
            //collision
            if(child.canCollide){
                //on calcule la collision pour chaque point 'collidable'
                if(child.renderable){
                    for(var i=0; i< child.renderable.position.length/3;i++){
                        //on va calculer sa position relative à la grille
                        var pointPosition = [child.renderable.position[i],
                                         child.renderable.position[i+1],
                                         child.renderable.position[i+2]];
                        vec3.add(pointPosition, pointPosition, child.location);
                        vec3.sub(relativePosition, pointPosition, this.gridStartLocation);
                        var gridLocation = [Math.round(relativePosition[0]/this.blockSize),
                                            Math.round(relativePosition[1]/this.blockSize),
                                            Math.round(relativePosition[2]/this.blockSize)];
                        if(this.data[gridLocation[0]] && this.data[gridLocation[0]][gridLocation[1]] && this.data[gridLocation[0]][gridLocation[1]][gridLocation[2]] != 0){
                            console.log("collision detected!!");
                            child.isColliding = true;
                            break;
                        }else{
                            child.isColliding = false;
                        }
                    }
                }else{
                    vec3.sub(relativePosition, child.location, this.gridStartLocation);
                    gridLocation = [Math.round(relativePosition[0]/this.blockSize),
                                    Math.round(relativePosition[1]/this.blockSize),
                                    Math.round(relativePosition[2]/this.blockSize)];
                                    
                    if(this.data[gridLocation[0]][gridLocation[1]][gridLocation[2]] != 0){
                        console.log("Collision Detected!!");
                        child.isColliding = true;
                    }else{
                        child.isColliding = false;
                    }
                }
                var delta = [];
                vec3.sub(delta, child.location, this.location);
                //Gravité
                if(child.mass != 0){
                    var distance = vec3.len(delta);
                    vec3.normalize(delta, delta);
                    var accLen = (GRAV * this.mass) / (distance * distance) * (dt/1000);
                    var acc = [];
                    vec3.scale(acc, delta, -accLen);
                    if(!child.isColliding){
                        vec3.add(child.velocity, child.velocity, acc);
                    }else if(child instanceof Player){
                        child.velocity = vec3.create();
                    }else{
                        //si on a une collision, on normalise le cerveur de la position de la collision
                        var normalizedColl = vec3.create();
                        vec3.normalize(normalizedColl, relativePosition);
                        console.dir(child);
                        console.log("Old Speed: " + child.velocity);
                        //On trouve la portion du mouvement qui sera conservé lors de la collision(perp au vecteur de collision)
                        var a1 = vec3.dot(child.velocity, normalizedColl);
                        vec3.scaleAndAdd(child.velocity, child.velocity, normalizedColl, 2*a1);
                        console.log(`Multiplier: ${2*a1}`);
                        console.log(`New Speed: ${child.velocity}`);
                        
                    }
                }
                child.updateDownDirection(delta);
            }
        })
        
        
    }
}