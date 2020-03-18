import {shaderManager, canvasManager} from './Setup';
import {Point, Cube, Sphere, Torus, Texture, ImgTexture} from './Elements';
import {matIV, qtnIV} from './minMatrixb';

exports.smgl = function (gl) {
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