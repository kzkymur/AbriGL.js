import {shaderManager, canvasManager} from './Setup';
import * as Elements from './Elements';
import {matIV, qtnIV} from './minMatrixb';

const CanvasManager = new canvasManager(gl);
const ShaderManager = new shaderManager(gl);
const m = new matIV();
const q = new qtnIV();
const Point = new Elements.Point(gl);
const Cube = new Elements.Cube(gl);
const Sphere = new Elements.Sphere(gl);
const Torus = new Elements.Torus(gl);
const Texture = new Elements.Texture(gl);
const ImgTexture = new Elements.ImgTexture(gl);

export {CanvasManager, ShaderManager, m, q, Point, Cube, Sphere, Torus, Texture, ImgTexture};