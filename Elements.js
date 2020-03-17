class Element {
    constructor (gl) {
        this.gl = gl;
        this.Index;
        this.indexLength;
        this.VBOList = [];
        this.cap = [];
        this.unCap = [];
        this.uniform = {};
        this.texture = {
            0 : null,
        }
        this.stencilSetting = [this.gl.ALWAYS, 1, ~0, this.gl.KEEP, this.gl.KEEP, this.gl.KEEP];
        this.colorIndex;
        this.colorLength;
    }
    setCapability (cap) {
        this.cap.push(cap);
    }
    unSetCapability (cap) {
        this.unCap.push(cap);
    }
    setTexture (unit, texture) {
        this.texture[unit] = texture;
    }
    setUniform (key, value) {
        this.uniform[key] = value;
    }
    setStencil (func, ref, mask, fail, zfail, zpass) {
        this.stencilSetting = [func, ref, mask, fail, zfail, zpass];
    }
    setColor(color) {
        let newColor = [];
        for (let i=0; i<this.colorLength; i++) {
            newColor.push(color[0], color[1], color[2], color[3]);
        }
        this.VBOList[this.colorIndex] = w.create_vbo(newColor);
    }
}
// class Merge {
//     constructor (gl, ) {
//         this.element = {};
//         this.mergeInstance = [];
//         this.uniform = {};
//         this.texture = null;
//         this.textureUnit = 0;
//     }
//     setElement (element) {
//         if(element.constructor.name=='Merge') {
//             this.mergeInstance.push(element);
//             return;
//         } else if (this.element[element.constructor.name] == undefined) {
//             this.element[element.constructor.name] = [];
//         }
//         this.element[element.constructor.name].push(Object.create(element));
//     }
//     setTexture (unit, texture) {
//         this.texture = texture;
//         this.textureUnit = unit;
//     }
//     setUniform (key, value) {
//         this.uniform[key] = value;
//     }
//     // setPersonalMMatrix (element, mMatrix) {
//     //     // jsは全て参照渡しなのでこれでおけ
//     //     let mvpMatrix = this.element[element.constructor.name].uniform['mvpMatrix'];
//     //     m.multiply(mvpMatrix, mMatrix, mvpMatrix);
//     // }
// }

class Point extends Element {
    constructor(gl, shader, color) {
        super(gl);
        const dataDictionary = {
            'position'     : w.create_vbo([.0, .0, .0]),
            'normal'       : w.create_vbo([1., 1., 1.]),
            'color'        : w.create_vbo(color),
            'textureCoord' : w.create_vbo([0, 0]),
        }
        let i = 0;
        for (let key of shader.attList) {
            this.VBOList.push(dataDictionary[key]);
            if (key == 'color') {
                this.colorIndex = i;
            }
            i++;
        }
        this.colorLength = 1;
        this.indexLength = 1;
        this.Index = w.create_ibo([0]);
    }
}
class Cube extends Element {
    constructor (gl, shader, color) {
        super(gl);
        const data = cube(1, color);
        const dataDictionary = {
            'position'     : w.create_vbo(data.p),
            'normal'       : w.create_vbo(data.n),
            'color'        : w.create_vbo(data.c),
            'textureCoord' : w.create_vbo(data.t),
        }
        let i = 0;
        for (let key of shader.attList) {
            this.VBOList.push(dataDictionary[key]);
            if (key == 'color') {
                this.colorIndex = i;
            }
            i++;
        }
        this.colorLength = data.p.length/3;
        this.indexLength = data.i.length;
        this.Index = w.create_ibo(data.i);
    }
}
class Sphere extends Element {
    constructor (gl, shader, nVertex, color) {
        super(gl);
        const data = sphere(nVertex, nVertex, 1, color);
        const dataDictionary = {
            'position'     : w.create_vbo(data.p),
            'normal'       : w.create_vbo(data.n),
            'color'        : w.create_vbo(data.c),
            'textureCoord' : w.create_vbo(data.t),
        }
        let i = 0;
        for (let key of shader.attList) {
            this.VBOList.push(dataDictionary[key]);
            if (key == 'color') {
                this.colorIndex = i;
            }
            i++;
        }
        this.colorLength = data.p.length/3;
        this.indexLength = data.i.length;
        this.Index = w.create_ibo(data.i);
    }
}
class Torus extends Element {
    constructor (gl, shader, nVertex, irad, orad, color) {
        super(gl);
        const data = torus(nVertex, nVertex, irad, orad, color);
        const dataDictionary = {
            'position'     : w.create_vbo(data.p),
            'normal'       : w.create_vbo(data.n),
            'color'        : w.create_vbo(data.c),
            'textureCoord' : w.create_vbo(data.t),
        }
        let i = 0;
        for (let key of shader.attList) {
            this.VBOList.push(dataDictionary[key]);
            if (key == 'color') {
                this.colorIndex = i;
            }
            i++;
        }
        this.indexLength = data.i.length;
        this.Index = w.create_ibo(data.i);
    }
}
class Texture extends Element {
    constructor (gl, shader) {
        super(gl);
        const position = [
            -1.0,  1.0,  0.0,
            1.0,  1.0,  0.0,
            -1.0, -1.0,  0.0,
            1.0, -1.0,  0.0
        ];
        const color = [
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0
        ];
        const index = [
            0, 2, 1,
            3, 1, 2
        ];
        const dataDictionary = {
            'position'     : w.create_vbo(position),
            'color'        : w.create_vbo(color),
        }
        let i = 0;
        for (let key of shader.attList) {
            this.VBOList.push(dataDictionary[key]);
            if (key == 'color') {
                this.colorIndex = i;
            }
            i++;
        }
        this.indexLength = index.length;
        this.Index = w.create_ibo(index);
    }
}

class ImgTexture {
    constructor (gl, sourcePath) {
        this.gl = gl;
        this.t = null;
        this.changeImg(sourcePath);
    }
    changeImg (sourcePath) {
        let img = new Image();
        img.onload = () => {
            let tex = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);

            this.t = tex;
        };
        img.src = sourcePath;
    }
}