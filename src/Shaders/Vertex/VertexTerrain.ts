/**
 * VertexTerrain
 */
class VertexTerrain extends  Shader {
    /**
     *
     */
    constructor() {
        super();
        this.name = 'VertexTerrain';
        this.type = GL.VERTEX_SHADER;
        this.source = `
                        attribute vec4 color_VertexTerrain;
                        attribute vec3 position_VertexTerrain;
                        
                        uniform mat4 mvMatrix_VertexTerrain;
                        uniform mat4 pMatrix_VertexTerrain;
                        uniform vec3 offset_VertexTerrain;
                        
                        varying vec4 vColor;
                        void main(void) {
                            vec3 tempPosition = position_VertexTerrain;
                            gl_Position = pMatrix_VertexTerrain * mvMatrix_VertexTerrain * vec4(tempPosition-offset_VertexTerrain, 1.0);
                            vColor=color_VertexTerrain;
                        }
                        `
    }
    
    init(program: ShaderProgram){     
        //console.log("initialising Shader " + this.name);
        program.params["pMatrix"] = new ShaderUniform("pMatrix_VertexTerrain", program, "Matrix4fv");
        program.params["mvMatrix"] = new ShaderUniform("mvMatrix_VertexTerrain", program, "Matrix4fv");
        
        //Utiliser pour déplacer tout les sommets de manière à ne pas devoir réenvoyer toute les données
        program.params["offset"] = new ShaderUniform("offset_VertexTerrain", program, "Vector3fv");

        program.params["position"] = new ShaderAttribute("position_VertexTerrain", program);
        program.params["color"]  = new ShaderAttribute("color_VertexTerrain", program);
        
        /*
        program.params["pMatrix"] = new ShaderParam("uniform", "Matrix4fv", "global", "getProjectionMatrix", program.program, "pMatrix", false, 1);
        program.params["mvMatrix"] = new ShaderParam("uniform", "Matrix4fv", "hierarchical", "getMVMatrix", program.program, "mvMatrix", false, 1);
        
        //Utiliser pour déplacer tout les sommets de manière à ne pas devoir réenvoyer toute les données
        program.params["offset"] = new ShaderParam("uniform", "Vector3fv", "local", null, program.program, "offset", false, 1);

        program.params["position"] = new ShaderParam("attribute", "VertexPointer", null, null, program.program, "position", true, 3)
        program.params["color"]  = new ShaderParam("attribute", "VertexPointer", null, null, program.program, "color", true, 4)
        */

    }
    startRender(program: ShaderProgram, camera: Camera){   
        //console.log("starting  Shader " + this.name); 
        //TODO: on va aller chercher les informations d'affichage de la camera pour connaitre la perspective
        var perspectiveMatrix = [];
        mat4.perspective(perspectiveMatrix, 45, CANVAS.width/ CANVAS.height, 0.1, 1000.0);
        
        program.params["pMatrix"].set(perspectiveMatrix);
        
        //TODO: on irais chercher les informations de la transformation....    
        var mvMatrix = mat4.create();   
        mat4.multiply(mvMatrix, mvMatrix, camera.getRotation());
        mat4.translate(mvMatrix, mvMatrix, camera.getLocation());
        program.params["mvMatrix"].set(mvMatrix);
    }
    renderElement(program: ShaderProgram, render: Render){
        //on doit push et pop la mvMatrix pour cet element
        var elementLocationMatrix = mat4.create();
        mat4.translate(elementLocationMatrix, elementLocationMatrix, render.getLocation());
        program.params["mvMatrix"].push(elementLocationMatrix);
        
        program.params["offset"].set([0,Math.random()*5.0,0]);
        //TODO: utiliser un peu mieux la OOP
        
        //---POSITION--// 
        program.params["position"].bind(render.mesh.getPositionBuffer());
        
        //--COLOR--//
        program.params["color"].bind(render.material.getColorBuffer());
        
        //--INDEX--//
        program.draw(render.mesh.getIndexBuffer(), render.mesh.drawingType);
        
        
        program.params["mvMatrix"].pop();               
        
    }
    
}