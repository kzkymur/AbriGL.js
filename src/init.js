import {shaderManager, canvasManager} from './Setup';
import {Point, Cube, Sphere, Torus, Texture, ImgTexture} from './Elements';
import {matIV, qtnIV} from './minMatrixb';

function smgl (gl) {
    return {
        CameraManager: new canvasManager(gl),
        ShaderManager: new shaderManager(gl),
        Point: new Point(gl),
        Cube: new Cube(gl),
        Sphere: new Sphere(gl),
        Torus: new Torus(gl),
        Texture: new Texture(gl),
        ImgTexture: new ImgTexture(gl),
    }
}

const m = new matIV();
const q = new qtnIV();

export {smgl, m, q};