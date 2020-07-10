# AbriGL

WebGLの記述量を端折る(Abridge)ためのjsライブラリです。

This is a javacsript library to abridge WebGL code.



## Install

```html
<script src="https://kzkymur.com/AbriGL/abrigl.js" charset="UTF-8"></script>
<script type="text/javascript">
  ...
  const abrigl = new AbriGL();
  ...
</script>
```

or

```javascript
import "https://kzkymur.com/AbriGL/abrigl.js"
...
const abrigl = new AbriGL();
...
```



## Example

[example.html](https://kzkymur.com/AbriGL/sample.html)

```javascript
import "https://kzkymur.com/AbriGL/abrigl.js";

...
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
}
setInterval(render, 1000/fps);
```

