/**
 * VertexBasic
 */
class VertexBasic extends  Shader {
    /**
     *
     */
    constructor() {
        super();
        this.name = 'VertexBasic';
        this.type = GL.VERTEX_SHADER;
        this.source = `
                        attribute vec4 color_VertexBasic;
                        attribute vec3 position_VertexBasic;
                        
                        uniform mat4 mvMatrix_VertexBasic;
                        uniform mat4 pMatrix_VertexBasic;
                        uniform vec3 offset_VertexBasic;
                        
                        varying vec4 vColor;
                        void main(void) {
                            gl_Position = pMatrix_VertexBasic * mvMatrix_VertexBasic * vec4(position_VertexBasic-offset_VertexBasic, 1.0);
                            vColor=color_VertexBasic;
                        }
                        `
    }
    
    init(program: ShaderProgram){     
        //console.log("initialising Shader " + this.name);
        program.params["pMatrix"] = new ShaderUniform("pMatrix_VertexBasic", program, "Matrix4fv");
        program.params["mvMatrix"] = new ShaderUniform("mvMatrix_VertexBasic", program, "Matrix4fv");
        
        //Utiliser pour déplacer tout les sommets de manière à ne pas devoir réenvoyer toute les données
        program.params["offset"] = new ShaderUniform("offset_VertexBasic", program, "Vector3fv");

        program.params["position"] = new ShaderAttribute("position_VertexBasic", program);
        program.params["color"]  = new ShaderAttribute("color_VertexBasic", program);
        
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
        //console.log(`Rendering at location ${render.getLocation()}`)
        mat4.translate(elementLocationMatrix, elementLocationMatrix, render.getLocation());
        program.params["mvMatrix"].push(elementLocationMatrix);
        
        program.params["offset"].set([0,0,0]);
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