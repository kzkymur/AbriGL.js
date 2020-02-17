// canvas周りとglのセットアップ
const c = document.getElementById('canvas');
c.width = 2048;
c.height = 2048;
const fps = 60;
let count = 0;

const gl = c.getContext('webgl') || c.getContext('experimental-webgl');

// ライブラリのインスタンス化
const m = new matIV();
const q = new qtnIV();
const w = new wgld();

// カリング、深度テスト
gl.depthFunc(gl.LEQUAL);


//------------------------ 以下自作ライブラリ ------------------------ //
const uniformMatrix4fv = function (variable, argument) {
    gl.uniformMatrix4fv(variable, false, argument);
}
const uniform1i = function (variable, argument) {
    gl.uniform1i(variable, argument);
}
const uniform1f = function (variable, argument) {
    gl.uniform1f(variable, argument);
}
const uniform2fv = function (variable, argument) {
    gl.uniform2fv(variable, argument);
}
const uniform3fv = function (variable, argument) {
    gl.uniform3fv(variable, argument);
}
const uniform4fv = function (variable, argument) {
    gl.uniform4fv(variable, argument);
}
const attribute = {
    'position'     : 3,
    'normal'       : 3,
    'color'        : 4,
    'textureCoord' : 2,
};
const uniformFunction = {
    'mat4'      : uniformMatrix4fv,
    'vec4'      : uniform4fv,
    'vec3'      : uniform3fv,
    'vec2'      : uniform2fv,
    'float'     : uniform1f,
    'int'       : uniform1i,
    'sampler2D' : uniform1i,
    'bool'      : uniform1i,
}

class shaderManager {
    constructor (vs, fs) {
        // programの作成、使用するattributeとuniformのリスト作成
        const v_shader = w.create_shader(vs);
        const f_shader = w.create_shader(fs);
        this.prg = w.create_program(v_shader, f_shader);
        this.cap = [];
        this.attList = [];
        this.attLocation = [];
        this.attStride = [];
        this.uniLocation = {}
        this.uniformFunction = {};
        this.currentInstance = null;

        const shaderData = document.getElementById(vs).innerText.split(';').concat(
            document.getElementById(fs).innerText.split(';')
        )
        let key, funcKey;
        for (let text of shaderData) {
            if (text.indexOf('attribute')+1) {
                this.attList.push(text.split(' ').slice(-1)[0]);
            } else if (text.indexOf('uniform')+1) {
                key = text.split(' ').slice(-1)[0];
                funcKey = text.split(' ').filter((e)=>{return e!=''}).slice(-2)[0];
                this.uniLocation[key] = gl.getUniformLocation(this.prg, key);
                this.uniformFunction[key] = uniformFunction[funcKey];
            }
        }
        for (let key of this.attList) {
            this.attLocation.push(gl.getAttribLocation(this.prg, key));
            this.attStride.push(attribute[key]);
        }
    }
    clear (backColor) {
        gl.clearColor(backColor[0], backColor[1], backColor[2], backColor[3]);
        gl.clearDepth(1.0);
        gl.clearStencil(0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    }
    setCapability (cap) {
        this.cap.push(cap);
    }
    setAttribute (instance, callback) {
        w.set_attribute(instance.VBOList, this.attLocation, this.attStride);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, instance.Index);

        this.currentInstance = instance;
        callback();
        
        this.currentInstance = null;
    }
    setUniform (key, argument) {
        this.uniformFunction[key](this.uniLocation[key], argument);
    }
    drawElement (constant) {
        for (let unit in this.currentInstance.texture) {
            gl.activeTexture(gl.TEXTURE0 + Number(unit));
            gl.bindTexture(gl.TEXTURE_2D, this.currentInstance.texture[unit]);
        }

        for (let cap of this.currentInstance.cap) {
            gl.enable(cap);
        }

        for (let cap of this.currentInstance.unCap) {
            gl.disable(cap);
        }

        let stencil = this.currentInstance.stencilSetting;
        gl.stencilFunc(stencil[0], stencil[1], stencil[2]);
        gl.stencilOp(stencil[3], stencil[4], stencil[5]);

        let argument;
        for (let key in this.currentInstance.uniform) {
            try {
                argument = this.currentInstance.uniform[key];
                this.setUniform(key, argument);
            } catch (e) {
                console.log('uniformKey : '+key, 'argument : '+argument);
                console.error(e.message);
            }
        }
        gl.drawElements(constant, this.currentInstance.indexLength, gl.UNSIGNED_SHORT, 0);

        for (let cap of this.currentInstance.cap) {
            gl.disable(cap);
        }
        for (let cap of this.currentInstance.unCap) {
            gl.enable(cap);
        }
    }
    // drawMergedElements (MergeInstance, constant) {
    //     for (let childMergeInstance of MergeInstance.mergeInstance) {
    //         arguments.callee(childMergeInstance, constant);
    //     }
    //     gl.activeTexture(gl.TEXTURE0 + MergeInstance.textureUnit);
    //     gl.bindTexture(gl.TEXTURE_2D, MergeInstance.texture);

    //     let argument;
    //     for (let key in MergeInstance.uniform) {
    //         argument = MergeInstance.uniform[key];
    //         this.setUniform(key, argument);
    //     }

    //     for (let className in MergeInstance.element) {
    //         this.setAttribute(MergeInstance.element[className][0], () => {
    //             for (let i in MergeInstance.element[className]) {
    //                 this.currentInstance = MergeInstance.element[className][i];
    //                 this.drawElement(constant);
    //             }
    //         })
    //     }
    // }
}

switchShader = function (shaderManager, callback) {
    gl.useProgram(shaderManager.prg);
    for (let cap of shaderManager.cap) {
        gl.enable(cap);
    }

    callback();

    for (let cap of shaderManager.cap) {
        gl.disable(cap);
    }
}

setFrameBuffer = function (frameBufferF, callback) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBufferF);
    callback();
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

orthographicMatrix = function () {  
    let vMatrix = m.lookAt([0.0, 0.0, 0.5], [0.0, 0.0, 0.0], [0, 1, 0]);
	let pMatrix = m.ortho(-1.0, 1.0, 1.0, -1.0, 0.1, 1);
    return m.multiply(pMatrix, vMatrix);
}

sum = function (a, b) {
    let c = [];
    for (let i in a) {
        c.push(a[i]+b[i]);
    }
    return c;
}
diff = function (a, b) {
    let c = [];
    for (let i in a) {
        c.push(a[i]-b[i]);
    }
    return c;
}
prod = function (a, b) {
    let c = [];
    for (let i in a) {
        c.push(a[i]*b[i]);
    }
}
quot = function (a, b) {
    let c = [];
    for (let i in a) {
        c.push(a[i]/b[i]);
    }
}
radian = function (degree) {
    return degree/180*Math.PI;
}