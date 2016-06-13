/**
 * FragmentLightning
 */
class FragmentLightning extends Shader {
    constructor() {
        super();
        this.name = 'FragmentLightning';
        this.type = GL.FRAGMENT_SHADER;
        this.source = `
                        precision mediump float;
                        
                        varying vec4 vColor;
                        varying vec3 vLightWeighting;
                        
                        void main(void) {
                            vec3 temp = vLightWeighting;
                            gl_FragColor = vec4(vColor.x * temp.x, vColor.y * temp.y, vColor.z * temp.z, vColor.w);\
                        }
                        `
    }
}