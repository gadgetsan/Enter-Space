/**
 * VertexLightning
 */
class VertexLightning extends  Shader {
    /**
     *
     */
    constructor() {
        super();
        this.name = 'VertexLightning';
        this.type = GL.VERTEX_SHADER;
        this.source = `
                        attribute vec4 color_VertexLightning;
                        attribute vec3 position_VertexLightning;
                        attribute vec3 normal_VertexLightning;
                        
                        uniform mat4 mvMatrix_VertexLightning;
                        uniform mat4 pMatrix_VertexLightning;
                        uniform vec3 offset_VertexLightning;
                        
                         //NEW=====   
                        uniform mat3 nMatrix_VertexLightning;
                        uniform vec3 ambientColor_VertexLightning;

                        uniform vec3 lightingDirection_VertexLightning;
                        uniform vec3 directionalColor_VertexLightning;
                        //=========
                        
                        varying vec4 vColor;
                        varying vec3 vLightWeighting;
                        void main(void) {
                            vec3 transformedNormal = nMatrix_VertexLightning * normal_VertexLightning;
                            float directionalLightWeighting = max(dot(transformedNormal, lightingDirection_VertexLightning), 0.0);                            
                            vLightWeighting = ambientColor_VertexLightning + directionalColor_VertexLightning * directionalLightWeighting;
                            gl_Position = pMatrix_VertexLightning * mvMatrix_VertexLightning * vec4(position_VertexLightning-offset_VertexLightning, 1.0);
                            vColor=color_VertexLightning;
                        }
                        `
    }
    
    init(program: ShaderProgram){     
        //console.log("initialising Shader " + this.name);
        program.params["pMatrix"] = new ShaderUniform("pMatrix_VertexLightning", program, "Matrix4fv");
        program.params["mvMatrix"] = new ShaderUniform("mvMatrix_VertexLightning", program, "Matrix4fv");
        program.params["nMatrix"] = new ShaderUniform("nMatrix_VertexLightning", program, "Matrix3fv");
        
        //Utiliser pour déplacer tout les sommets de manière à ne pas devoir réenvoyer toute les données
        program.params["offset"] = new ShaderUniform("offset_VertexLightning", program, "Vector3fv");
        
        program.params["ambientColor"] = new ShaderUniform("ambientColor_VertexLightning", program, "Vector3fv");
        program.params["lightningDirection"] = new ShaderUniform("lightingDirection_VertexLightning", program, "Vector3fv");
        program.params["directionalColor"] = new ShaderUniform("directionalColor_VertexLightning", program, "Vector3fv");

        program.params["position"] = new ShaderAttribute("position_VertexLightning", program);
        program.params["color"]  = new ShaderAttribute("color_VertexLightning", program);
        program.params["normal"]  = new ShaderAttribute("normal_VertexLightning", program);

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
        
        
        var nMatrix = mat3.create();   
        //mat3.multiply(nMatrix, nMatrix, camera.getRotation());
        program.params["nMatrix"].set(nMatrix);
    }
    renderElement(program: ShaderProgram, render: Render){
        //on doit push et pop la mvMatrix pour cet element
        var elementLocationMatrix = mat4.create();
        //console.log(`Rendering at location ${render.getLocation()}`)
        mat4.translate(elementLocationMatrix, elementLocationMatrix, render.getLocation());
        mat4.scale(elementLocationMatrix, elementLocationMatrix, [render.getSize(), render.getSize(), render.getSize()]);
        program.params["mvMatrix"].push(elementLocationMatrix);
        
        program.params["offset"].set([0,0,0]);
        
        program.params["ambientColor"].set([0.5,0.5,0.5]);
        program.params["lightningDirection"].set([0,-1,-1]);
        program.params["directionalColor"].set([0,1,1]);
        //TODO: utiliser un peu mieux la OOP
        
        //---POSITION--// 
        program.params["normal"].bind(render.mesh.getNormalBuffer());
        program.params["position"].bind(render.mesh.getPositionBuffer());
        
        //--COLOR--//
        program.params["color"].bind(render.material.getColorBuffer());
        //console.dir(render.mesh.getIndexBuffer().data);
        //--INDEX--//
        program.draw(render.mesh.getIndexBuffer(), render.mesh.drawingType);
        
        
        program.params["mvMatrix"].pop();               
        
    }
    
}