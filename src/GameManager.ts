class GameManager
{
    shaderProgram: ShaderProgram;
    player: Player;
    renderer: Renderer;
    control: Control;
    keyboard: Keyboard;
    
    gameObjects: Array<GameObject>;
    
    grid: Grid;
    
    constructor() {
        this.shaderProgram = new ShaderProgram(new VertexBasic(), new FragmentBasic());
        this.shaderProgram.use();
        
        this.player = new Player();
        this.renderer = new Renderer(this.shaderProgram, this.player.camera);
        this.control = new Control(this.player);
        this.keyboard = new Keyboard(this.control);
        
        
        //Setup Initial pour la grille
        this.gameObjects = [];
        var cube = new Cube();
        //cube.location = vec3.clone([0,0,0]);
        this.gameObjects.push(cube);
        
        /*
        this.grid = new Grid(40, 40, [0, -50, 0], 200);
        this.grid.Add(new Cube());
        this.grid.Add(this.player);
        this.gameObjects.push(this.grid);
        */
    }
    
    update(dt:number) {
        
        this.control.update(dt);
        if(this.gameObjects != null){            
            this.gameObjects.forEach(gameObject => {
                gameObject.update(dt);
            });
        }
        
        this.renderer.updateBuffers(this.gameObjects, null);
        this.renderer.render(this.gameObjects, null);
        
    }
}