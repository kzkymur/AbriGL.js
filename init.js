import {shaderManager, canvasManager} from './src/Setup';
import {Point, Cube, Sphere, Torus, Texture, ImgTexture} from './src/Elements';
import {matIV, qtnIV} from './src/minMatrixb';

function smgl (gl) {
    return {
        CM: new canvasManager(gl),
        SM: new shaderManager(gl),
        m: new matIV(),
        q: new qtnIV(),
        Point: new Point(gl),
        Cube: new Cube(gl),
        Sphere: new Sphere(gl),
        Torus: new Torus(gl),
        Texture: new Texture(gl),
        ImgTexture: new ImgTexture(gl),
    }
}
