/**
 * Renderer
 */
class Renderer implements RegisterCameraSubscriber, RegisterShaderSubscriber{
    pMatrix: GLM.IArray;
    baseMVMatrix: GLM.IArray;
    subscriberId: number;
    currentCamera: Camera;
    shaders: Array<ShaderProgram>;
    mainShader: ShaderProgram;
    
    constructor(public eventManager: EventManager) {
        this.pMatrix = mat4.create();
        this.eventManager.subscribe(this, "RegisterCameraEvent");
        this.eventManager.subscribe(this, "RegisterShaderEvent");
        //Pi/2 = 1.5707963267
        mat4.perspective(this.pMatrix, 0.785, CANVAS.width / CANVAS.height, 0.1, 1000);
        this.shaders = [];
    }
    
    setShader(shaderProgram: ShaderProgram){
        //1. mettre à jour les buffers si ils doivent l'être (avec bindbuffer & bufferData)
        //2. on affiche l'objet (avec un buffer ou un array)
        this.mainShader = shaderProgram;
        this.mainShader.use();
    }
    
    registerShader(shader: ShaderProgram){
        this.shaders.push(shader);
    }
    
    startRender(){
        //on va initialiser tout les shaders
        this.shaders.forEach(shader=>{            
            shader.use();
            shader.startRender(this.getCamera());
        })                    
        this.mainShader.use();
        this.mainShader.startRender(this.getCamera());
    }
    drawMesh(render: Render){
        //on va demander au program de shader d'aller chercher les données qu'il as besoin
        this.mainShader.use();
        this.mainShader.renderElement(render);
    }
    
    drawMeshWithShader(render: Render, shader: ShaderProgram){
        //console.log(`Drawing With Shader ${shader.vertexShader.name} AND ${shader.fragmentShader.name}`)
        shader.use();
        shader.renderElement(render);
    }
    
    registerCamera(camera: Camera){
        this.currentCamera = camera;
    }
    getCamera(){
        return this.currentCamera;
    }
    
    /*
    setCamera(camera: Camera){
        this.camera = camera;
    }
    
    updateBuffers(objects: Array<GameObject>, parent: GameObject){
        if(objects != null){
            objects.forEach(object =>{
            var renderable = object.renderable;
            if(!renderable){
                return;
            }
            if(renderable.needsUpdate){
                if(this.shaderProgram.attributes != null){             
                    this.shaderProgram.attributes.forEach(attribute =>{
                        renderable.buffers[attribute.name] = attribute.createBuffer(renderable[attribute.name]);
                        renderable.counts[attribute.name] = renderable[attribute.name].length / attribute.size;
                    })
                }
                if (renderable.usesIndices && renderable.buffers != null){
                    var indiceBufferLocation = GL.createBuffer();
                    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indiceBufferLocation);
                    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(renderable.indices), GL.STATIC_DRAW);
                    renderable.buffers["indices"] = indiceBufferLocation;
                }
                renderable.needsUpdate = false;
            }
            //on va aussi appeler la fonction récursivement
            if(object.children != null && object.children.length > 0){
                this.updateBuffers(object.children, object);
            }
            
        });
        }        
    }
    
    render(objects: Array<GameObject>, parent: GameObject){
        if(objects != null){
            objects.forEach(object =>{
                var renderable = object.renderable;
                if(!renderable){
                    return;
                }
                else if(this.shaderProgram.uniforms != null){
                    this.shaderProgram.uniforms.forEach(uniform =>{
                        var value = renderable[uniform.name];
                        if(uniform.frequency == "hierarchical"){                   
                                value = this[uniform.freqFunc](parent?parent.renderable:null, renderable, uniform.name);
                        }else if(uniform.frequency == "global"){
                            value = this[uniform.freqFunc]();
                        }
                        
                        //console.log(`Pushing UNIFORM value to GPU: ${uniform.name}: ${value} \n`)
                        uniform.pushToGPU(value);
                    });
                    
                    this.shaderProgram.attributes.forEach(attribute =>{
                        attribute.fetchBuffer(renderable.buffers[attribute.name]);
                        //console.log(`Pushing ATTRIBUTE value to GPU: ${attribute.name}: ${attribute[attribute.name]} \n`)
                        attribute.pushToGPU(attribute[attribute.name]); 
                    });
                
                    if(renderable.usesIndices){
                        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, renderable.buffers["indices"]);
                        GL.drawElements(renderable.drawType, renderable.indices.length, GL.UNSIGNED_SHORT, 0);
                    }else{
                        //attribute.name?!?!?
                        //GL.drawArrays(renderable.drawType, 0, renderable.counts[]);
                    }
                    if(object.children != null && object.children.length > 0){
                        this.render(object.children, object);
                    }
                }
                
            });
        }
        
        GL.flush();
    }
    
    
    getProjectionMatrix() : GLM.IArray {
        return this.pMatrix; 
    }
    
    getMVMatrix(parent, child, varName){
        //C'Est possible que la valeur du parent ai été calculé avec la valeur
        //d'un autre parent alors on va voir son temp
        
        var parentValue = this.camera.mvMatrix;
        if(parent){
            parentValue = parent[varName];
            if(parent.temp && parent.temps[varName]){
                parentValue = parent.temp[varName];
            }
        }
        var childValue = child[varName];
        var resultValue = mat4.create();
        mat4.multiply(resultValue, parentValue, childValue);
        child.temp = [];
        child.temp[varName] = resultValue;
        return resultValue;
    } 
    
    */
}