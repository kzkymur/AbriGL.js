import "https://kzkymur.com/AbriGL/abrigl.js";

const vs = `
attribute vec3 position;
attribute vec4 color;
attribute vec2 textureCoord;
uniform mat4 mMatrix;
uniform mat4 tmpMatrix;
varying vec4 vColor;
varying vec2 vTexCoord;

void main(void){
	gl_Position = tmpMatrix * mMatrix * vec4(position, 1.0);
	vColor = color;
	vTexCoord = textureCoord;
}
`;

const fs = `
precision mediump float;

uniform sampler2D texture;
varying vec4 vColor;
varying vec2 vTexCoord;

void main(void){
	gl_FragColor = vColor * texture2D(texture, vTexCoord);
}
`;

const canvas = document.getElementById('canvas');
canvas.width = 512;
canvas.height = 512;
const gl = canvas.getContext('webgl');

const abrigl = new AbriGL(gl);
const m = abrigl.m;

const shaderM = abrigl.ShaderManager.init(vs, fs);
const canvasM = abrigl.CanvasManager.init();
canvasM.gl.enable(canvasM.gl.DEPTH_TEST);
canvasM.gl.depthFunc(canvasM.gl.LEQUAL);

const sphere = abrigl.Sphere.init(shaderM, 64, [1,1,1,1]);
abrigl.ImgTexture.init('./sample.png').then(res=>{
	sphere.setTexture(0, res.t);
	sphere.setUniform('texture', 0);
});

let mMatrix = m.translate(m.identity(), [0.0, 0.0, 0.0]);
const pMatrix = m.perspective(90, canvas.width / canvas.height, 0.1, 100);
const vMatrix = m.lookAt([0.0, 0.0, 3.0], [0, 0, 0], [0, 1, 0]);
shaderM.setUniform('tmpMatrix', m.multiply(pMatrix, vMatrix));

function render () {
	mMatrix = m.rotate(mMatrix, 1/200, [0, 1, 0]);
	canvasM.setFrameBuffer(null, ()=>{
		canvasM.switchShader(shaderM, (s)=>{
			s.clear([0.0, 0.0, 0.0, 1.0]);
			sphere.setUniform('mMatrix', mMatrix);
			s.setAttribute(sphere, ()=>{
				s.drawElement(s.gl.TRIANGLES);
			});
		})
	})
	requestAnimationFrame(render);
}
requestAnimationFrame(render);
