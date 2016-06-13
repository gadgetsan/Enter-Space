/**
 * VertexPicking
 */
class VertexPicking extends VertexBasic {
    constructor() {
        
        super();
        this.name = 'VertexPicking';
        this.type = GL.VERTEX_SHADER;
        this.source = `
                        attribute vec3 position_VertexPicking;
                        
                        uniform mat4 mvMatrix_VertexPicking;
                        uniform mat4 pMatrix_VertexPicking;
                        uniform vec4 color_VertexPicking;
                        
                        varying vec4 vColor;
                        void main(void) {
                            gl_Position = pMatrix_VertexPicking * mvMatrix_VertexPicking * vec4(position_VertexPicking, 1.0);
                            vColor=color_VertexPicking;
                        }
                        `
    }
    
    
   init(program: ShaderProgram){     
        //console.log("initialising Shader " + this.name);
        program.params["pMatrix"] = new ShaderUniform("pMatrix_VertexPicking", program, "Matrix4fv");
        program.params["mvMatrix"] = new ShaderUniform("mvMatrix_VertexPicking", program, "Matrix4fv");
        program.params["color"] = new ShaderUniform("color_VertexPicking", program, "Vector4fv");
        
        program.params["position"] = new ShaderAttribute("position_VertexPicking", program);

    }
    startRender(program: ShaderProgram, camera: Camera){   
        //console.log("starting  Shader " + this.name); 
        //TODO: on va aller chercher les informations d'affichage de la camera pour connaitre la perspective
        var perspectiveMatrix = [];
        mat4.perspective(perspectiveMatrix, 0.000001, CANVAS.width/ CANVAS.height, 0.1, 1000.0);
        
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
        //console.log(`Rendering With VertexPicking`)
        mat4.translate(elementLocationMatrix, elementLocationMatrix, render.getLocation());
        program.params["mvMatrix"].push(elementLocationMatrix);
        
        //--COLOR--//
        if(render.gameObject.components["selectable"] != null){            
        //on va chercher la couleur à utiliser pour le rendu pour pouvoir faire le picking
            var selectable = <Selectable>(render.gameObject.components["selectable"]);
            program.params["color"].set([selectable.renderingColor[0], selectable.renderingColor[1], selectable.renderingColor[2], 1.0]);
        }else{            
            program.params["color"].set([0, 0, 0, 1.0]);
        }
        
        //TODO: utiliser un peu mieux la OOP
        
        //---POSITION--// 
        program.params["position"].bind(render.mesh.getPositionBuffer());
        
        
        //--INDEX--//
        program.draw(render.mesh.getIndexBuffer(), render.mesh.drawingType);
        
        
        program.params["mvMatrix"].pop();               
        
    }
}