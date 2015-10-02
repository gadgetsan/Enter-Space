class FragmentBasic extends Shader
    name: 'FragmentBasic'
    type: GL.FRAGMENT_SHADER
    source: """
        precision mediump float;

        varying vec4 vColor;

        void main(void) {
            gl_FragColor = vec4(vColor);
        }
        """
