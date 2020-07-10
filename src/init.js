import {shaderManager, canvasManager} from './Managers.js';
import {Point, Cube, Sphere, Torus, Texture, ImgTexture, hsva} from './Elements.js';
import {matIV, qtnIV} from './minMatrixb.js';

export default class AbriGL {
	constructor(gl){
        this.CanvasManager = new canvasManager(gl);
        this.ShaderManager = new shaderManager(gl);
        this.Point = new Point(gl);
        this.Cube = new Cube(gl);
        this.Sphere = new Sphere(gl);
        this.Torus = new Torus(gl);
        this.Texture = new Texture(gl);
        this.ImgTexture = new ImgTexture(gl);

		const m = new matIV();
		const q = new qtnIV();
		this.m = m;
		this.q = q;
		this.hsva = hsva;
    }
}

