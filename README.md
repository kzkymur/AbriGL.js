# AbriGL

WebGLの記述量を端折る(Abridge)ためのjsライブラリです。

オーバーヘッドを少なくしつつ、主に attribute と uniform に関する記述量を削減します。

This is a javacsript library to abridge WebGL code.

Reducing amount of code mainly about attribute and uniform with low overhead.



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

// 引数に WebglContext をとる
const abrigl = new AbriGL(gl);
// wgld.org の minMatrixb.js をサポート
const m = abrigl.m;
// const q = abrigl.q;

// init で shaderManager, canvasManager インスタンスを取得
const shaderM = abrigl.ShaderManager.init(vs, fs); // 引数は各シェーダーのテキスト
const canvasM = abrigl.CanvasManager.init();
// こんな感じで canvasM から webglContext を直接いじれる
// enableとかはこうしていじる
canvasM.gl.enable(canvasM.gl.DEPTH_TEST);
canvasM.gl.depthFunc(canvasM.gl.LEQUAL);

// Sphere, Cube, Torus, Point, Texture, といった各オブジェクトをサポート
const sphere = abrigl.Sphere.init(shaderM, 64, [1,1,1,1]); // 第一引数はshaderM

// テクスチャはこんな感じで貼る
abrigl.ImgTexture.init('./sample.png').then(res=>{
	sphere.setTexture(0, res.t); // 第一引数はunit
  // setUniform は オブジェクト, shaderM の両方に可能
	sphere.setUniform('texture', 0);
});

let mMatrix = m.translate(m.identity(), [0.0, 0.0, 0.0]);
const pMatrix = m.perspective(90, canvas.width / canvas.height, 0.1, 100);
const vMatrix = m.lookAt([0.0, 0.0, 3.0], [0, 0, 0], [0, 1, 0]);
// setUniform は オブジェクト, shaderM の両方に可能
shaderM.setUniform('tmpMatrix', m.multiply(pMatrix, vMatrix));

function render () {
	mMatrix = m.rotate(mMatrix, 1/200, [0, 1, 0]);
  // frameBuffer に書く場合は、fb = canvasM.createFrameBuffer(int width, int height) を作成し
  // 第一引数に fb.f を入れる。frameBuffer を使う場合は Object.setTexture(unit, fb.t);
	canvasM.setFrameBuffer(null, ()=>{
		canvasM.switchShader(shaderM, (s)=>{
			s.clear([0.0, 0.0, 0.0, 1.0]);
			sphere.setUniform('mMatrix', mMatrix);
      // setAttribute(object, callback)の callback 内で shaderM.drawElement を行う。
      // attrubute として
      // attribute vec3 position;
      // attribute vec3 normal;
      // attribute vec4 color;
      // attribute vec2 textureCoord;
      // をサポート
			s.setAttribute(sphere, ()=>{
				s.drawElement(s.gl.TRIANGLES);
			});
		})
	})
	requestAnimationFrame(render);
}
requestAnimationFrame(render);
```

<img src="/Users/yamaurakazuki/Work/AbriGL/sample/sample_result.jpg" alt="alt" style="zoom:50%;" />



## Credit

https://wgld.org

