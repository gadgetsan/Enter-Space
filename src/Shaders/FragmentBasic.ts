/**
 * FragmentBasic
 */
class FragmentBasic extends Shader {
    constructor() {
        super();
        this.name = 'FragmentBasic';
        this.type = GL.FRAGMENT_SHADER;
        this.source = `
                        precision mediump float;
                        
                        varying vec4 vColor;
                        
                        void main(void) {
                            gl_FragColor = vec4(vColor);\
                        }
                        `
    }
}