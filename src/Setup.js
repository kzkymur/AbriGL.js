import wgld from './wgld';

class shaderManager {
    constructor (gl, vs, fs) {
        // programの作成、使用するattributeとuniformのリスト作成
        this.gl = gl;
        this.w = new wgld(gl);
        const v_shader = this.w.create_shader(vs);
        const f_shader = this.w.create_shader(fs);

        this.prg = this.w.create_program(v_shader, f_shader);
        this.cap = [];
        this.attList = [];
        this.attLocation = [];
        this.attStride = [];
        this.uniLocation = {}
        this.uniformFunction = {};
        this.currentInstance = null;

        //--------------------attribute, uniform--------------------//
        const uniformMatrix4fv = (variable, argument) => {
            this.gl.uniformMatrix4fv(variable, false, argument);
        }
        const uniform1i = (variable, argument) => {
            this.gl.uniform1i(variable, argument);
        }
        const uniform1f = (variable, argument) => {
            this.gl.uniform1f(variable, argument);
        }
        const uniform2fv = (variable, argument) => {
            this.gl.uniform2fv(variable, argument);
        }
        const uniform3fv = (variable, argument) => {
            this.gl.uniform3fv(variable, argument);
        }
        const uniform4fv = (variable, argument) => {
            this.gl.uniform4fv(variable, argument);
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
                this.uniLocation[key] = this.gl.getUniformLocation(this.prg, key);
                this.uniformFunction[key] = uniformFunction[funcKey];
            }
        }
        for (let key of this.attList) {
            this.attLocation.push(this.gl.getAttribLocation(this.prg, key));
            this.attStride.push(attribute[key]);
        }
    }
    clear (backColor) {
        this.gl.clearColor(backColor[0], backColor[1], backColor[2], backColor[3]);
        this.gl.clearDepth(1.0);
        this.gl.clearStencil(0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
    }
    setCapability (cap) {
        this.cap.push(cap);
    }
    setAttribute (instance, callback) {
        this.w.set_attribute(instance.VBOList, this.attLocation, this.attStride);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, instance.Index);

        this.currentInstance = instance;
        callback();
        
        this.currentInstance = null;
    }
    setUniform (key, argument) {
        this.uniformFunction[key](this.uniLocation[key], argument);
    }
    drawElement (constant) {
        for (let unit in this.currentInstance.texture) {
            this.gl.activeTexture(this.gl.TEXTURE0 + Number(unit));
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.currentInstance.texture[unit]);
        }

        for (let cap of this.currentInstance.cap) {
            this.gl.enable(cap);
        }

        for (let cap of this.currentInstance.unCap) {
            this.gl.disable(cap);
        }

        let stencil = this.currentInstance.stencilSetting;
        this.gl.stencilFunc(stencil[0], stencil[1], stencil[2]);
        this.gl.stencilOp(stencil[3], stencil[4], stencil[5]);

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
        this.gl.drawElements(constant, this.currentInstance.indexLength, this.gl.UNSIGNED_SHORT, 0);

        for (let cap of this.currentInstance.cap) {
            this.gl.disable(cap);
        }
        for (let cap of this.currentInstance.unCap) {
            this.gl.enable(cap);
        }
    }
    // drawMergedElements (MergeInstance, constant) {
    //     for (let childMergeInstance of MergeInstance.mergeInstance) {
    //         arguments.callee(childMergeInstance, constant);
    //     }
    //     this.gl.activeTexture(this.gl.TEXTURE0 + MergeInstance.textureUnit);
    //     this.gl.bindTexture(this.gl.TEXTURE_2D, MergeInstance.texture);

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

class canvasManager {
    constructor (gl) {
        this.gl = gl;
        this.w = new wgld(gl);
    }
    switchShader (shaderManager, callback) {
        this.gl.useProgram(shaderManager.prg);
        for (let cap of shaderManager.cap) {
            this.gl.enable(cap);
        }
    
        callback();
    
        for (let cap of shaderManager.cap) {
            this.gl.disable(cap);
        }
    }
    setFrameBuffer (frameBufferF, callback) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBufferF);
        callback();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }
    createFrameBuffer (width, height) {
        return this.w.create_framebuffer(width, height);
    }
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

export {shaderManager, canvasManager};