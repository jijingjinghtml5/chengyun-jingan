const msgInitPlay           = 0;
const msgStartPlay          = 1;
const msgStopPlay           = 2;

const msgVideoFail          = 0;
const msgVideoStart         = 1;
const msgVideoStop          = 2;
const msgVideoInfo          = 3;

self.Module = {
    onRuntimeInitialized: function () {
        console.log("onWasmLoaded");
        self.vidstream.wasmInit();
    }
};

self.importScripts("libffmpeg.js");

function VideoStream() {
    this._initStatus = false;
    this.operationsBeforeInit = [];
}

self.vidstream = new VideoStream;

self.onmessage = function (evt) {
    var req = evt.data;
    
    self.vidstream.processMsg(req);
};

VideoStream.prototype.processMsg = function (req) {
    console.log("processMsg", req)
    switch (req.msg) {
        case msgInitPlay:
        {
            //Init
            this.Init(req.canvas);         
            break;
        }
        case msgStartPlay:
        {
            //Start
            this.Start(req.callid);
            break;
        }
        case msgStopPlay:
        {
            //Stop
            this.Stop();
            break;
        }
        default:
            break;
    }
};

VideoStream.prototype.Init = function (canvas) {
    this.webgl = new WebGLPlayer(canvas);
}

VideoStream.prototype.wasmInit = function () {
    Module._initDecoder();   
    this.cacheBuffer = Module._malloc(65535);
    this.yuvBuffer = Module._malloc(3*1920*1280);   //1080P
    this._initStatus = true;
    if (this.operationsBeforeInit.length > 0) {
        this.operationsBeforeInit.forEach(ope => {
            this[ope.operation](...(ope.params || []))
        })
        this.operationsBeforeInit = [];
    }
}

VideoStream.prototype.Uninit = function () {

    Module._uninitDecoder();
    Module._free(this.cacheBuffer);
    this.cacheBuffer = NULL;
    Module._free(this.cacheBuffer);
    this.cacheBuffer = NULL;
    this._initStatus = false;
}

VideoStream.prototype.Start = function (CallID) {
    if (!this._initStatus) {
        this.operationsBeforeInit.push({
            operation: "Start",
            params: [CallID]
        })
        return false;
    }
    this.CallID = CallID;
    
    this.fps = 0;
    this.codec = "H264";
    this.bitrate = 0;
    
    this.websocket = new WebSocket("ws://127.0.0.1:3702");
    this.websocket.binaryType = 'arraybuffer';
    this.websocket.VideoStream = this;
    this.websocket.HasOpen = false;
    this.websocket.onopen = function(evt) {
        var websocket = evt.currentTarget;
        websocket.HasOpen = true;
        console.log("VideoStream.WebsocketOnOpen");
        
        var msg = new Object;
        msg.Msg = "VideoDisplayStartReq";
        msg.CallID = websocket.VideoStream.CallID;
        
        websocket.send(JSON.stringify(msg))
    };
    
    this.websocket.onclose = function(evt) {
        var websocket = evt.currentTarget;
        console.log("VideoStream.WebsocketOnClose");
        if (websocket.HasOpen) {
            //连接断开
            var msgData = {
                msg: msgVideoStop,
            };
            self.postMessage(msgData);   
            evt.currentTarget.VideoStream.Stop();
        }
        else {
            //连接失败
            var msgData = {
                msg: msgVideoFail,
            };
            self.postMessage(msgData);           
        }
    };
    
    this.websocket.onmessage = function(evt) {
        if (typeof(evt.data) == "string") {
            var parm = JSON.parse(evt.data);
            if (parm.Msg == "VideoDisplayStartRsp") {
                evt.currentTarget.VideoStream.OnVideoStart(parm);
            }
        }
        else if (typeof(evt.data) == "object" && evt.data instanceof ArrayBuffer) {
            evt.currentTarget.VideoStream.OnVideoFrame(evt);   
        }
    };
    
    this.websocket.onerror = function(evt) {
        console.log("VideoStream.WebsocketOnError");
    };
}

VideoStream.prototype.Stop = function () {
    if (!this._initStatus) {
        this.operationsBeforeInit.push({
            operation: "Stop",
            params: []
        })
        return false;
    }

    this.websocket && this.websocket.close();  
     
    Module._closeDecoder();
    
    if (this.FpsTimer) {
        clearInterval(this.FpsTimer);
        this.FpsTimer = null;
    }
    
    this.webgl.clear();
}

VideoStream.prototype.OnVideoStart = function(parm) {
    if (parm.Codec == 0)
    {
        this.codec = "H264";
    }
    else
    {
        this.codec = "H265";
    }

    this.fps = 0;
    this.bitrate = 0;
    this.width = 0;
    this.height = 0;
    
    Module._openDecoder(parm.Codec);
    
    var msgData = {
        msg: msgVideoStart,
    };
    self.postMessage(msgData);
    
    if (this.FpsTimer) {
        clearInterval(this.FpsTimer);
    }
    
    this.FpsTimer = setInterval(this.FpsInterval, 1000);
}

VideoStream.prototype.OnVideoFrame = function(evt)
{
    var VideoData = new Uint8Array(evt.data);
    Module.HEAPU8.set(VideoData, this.cacheBuffer);
    var ret = Module._decodeOnePacket(this.cacheBuffer, VideoData.length, this.yuvBuffer)
    if (ret > 0) {
        var size = Module.HEAPU8.subarray(this.yuvBuffer, this.yuvBuffer + 2);
        this.width = size[0]*16;
        this.height = size[1]*16;
        this.fps++;
        this.bitrate += VideoData.length * 8 / 1000;
        var data = Module.HEAPU8.subarray(this.yuvBuffer + 2, this.yuvBuffer + this.width * this.height * 3 / 2 + 2);

        this.webgl.renderFrame(data, this.width, this.height, ret);
    }
}

VideoStream.prototype.FpsInterval = function()
{
    var msgData = {
        msg: msgVideoInfo,
        codec: self.vidstream.codec,
        fps: self.vidstream.fps,
        bitrate: self.vidstream.bitrate,
        width: self.vidstream.width,
        height: self.vidstream.height,
    };
    self.postMessage(msgData);  
    
    self.vidstream.fps = 0;
    self.vidstream.bitrate = 0;
}


function Texture(gl) {
    this.gl = gl;
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

Texture.prototype.bind = function(n, program, name) {
    var gl = this.gl;
    gl.activeTexture([gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2, gl.TEXTURE3][n]);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(gl.getUniformLocation(program, name), n);
};

Texture.prototype.fill = function(width, height, data) {
    var gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width, height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data);
};

function WebGLPlayer(canvas) {
    this.canvas = canvas;

    this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    this.initGL();

    this.fps = 0;
    this.codec = "H264";
    this.bitrate = 0;
    this.vWidth = 0;
    this.vHeight = 0;
}

WebGLPlayer.prototype.initGL = function() {
    if (!this.gl) {
        console.log("[ER] WebGL not supported.");
        return;
    }

    //一个 WebGLProgram 对象由两个编译过后的 WebGLShader 组成 - 顶点着色器和片段着色器（均由 GLSL 语言所写）。这些组合成一个可用的 WebGL 着色器程序。
    var gl = this.gl;
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    var program = gl.createProgram();
    gl.program = program;

    //顶点着色器
    var vertexShaderSource = [
        "attribute highp vec4 aVertexPosition;",
        "uniform vec2 uRotationVector;",
        "attribute vec2 aTextureCoord;",
        "varying highp vec2 vTextureCoord;",
        "void main(void) {",
        "vec2 rotatedPosition = vec2(aVertexPosition.x * uRotationVector.y +aVertexPosition.y * uRotationVector.x,aVertexPosition.y * uRotationVector.y -aVertexPosition.x * uRotationVector.x);",
        " gl_Position = vec4(rotatedPosition, 0.0, 1.0);",
        " vTextureCoord = aTextureCoord;",
        "}"
    ].join("\n");
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    //片元着色器
    var fragmentShaderSource = [
        "precision highp float;",
        "varying lowp vec2 vTextureCoord;",
        "uniform sampler2D YTexture;",
        "uniform sampler2D UTexture;",
        "uniform sampler2D VTexture;",
        "uniform sampler2D TxtTexture;",
        "const mat4 YUV2RGB = mat4",
        "(",
        " 1.1643828125, 0, 1.59602734375, -.87078515625,",
        " 1.1643828125, -.39176171875, -.81296875, .52959375,",
        " 1.1643828125, 2.017234375, 0, -1.081390625,",
        " 0, 0, 0, 1",
        ");",
        "void main(void) {",
        " gl_FragColor = vec4( texture2D(YTexture, vTextureCoord).x, texture2D(UTexture, vTextureCoord).x, texture2D(VTexture, vTextureCoord).x, 1) * YUV2RGB;",
        "}"
    ].join("\n");
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    gl.useProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("[ER] Shader link failed.");
    }

    //顶点位置
    var vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    var verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(
            [1.0, 1.0, 0.0, -1.0,
                1.0, 0.0, 1.0, -1.0,
                0.0, -1.0, -1.0, 0.0
            ]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    //纹理坐标
    var textureCoordAttribute = gl.getAttribLocation(program, "aTextureCoord");
    gl.enableVertexAttribArray(textureCoordAttribute);
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(
            [1.0, 0.0, 0.0, 0.0,
                1.0, 1.0, 0.0, 1.0
            ]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.y = new Texture(gl);
    gl.u = new Texture(gl);
    gl.v = new Texture(gl);
    gl.txt = new Texture(gl);

    gl.y.bind(0, program, "YTexture");
    gl.u.bind(1, program, "UTexture");
    gl.v.bind(2, program, "VTexture");
    gl.v.bind(3, program, "TxtTexture");

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}


WebGLPlayer.prototype.renderFrame = function(videoFrame, width, height, angle) {
    if (!this.gl) {
        console.log("[ER] Render frame failed due to WebGL not supported.");
        return;
    }

    var gl = this.gl;

    //计算画布位置及大小
    var x = 0;
    var y = 0;
    var h = gl.canvas.height;
    var w = gl.canvas.width;

    if (angle == 1 || angle == 3) {
        if (gl.canvas.height * width / height > gl.canvas.width) {
            //视频宽高比>窗口宽高比  占满宽
            w = gl.canvas.width;
            h = height * gl.canvas.width / width;
            x = 0;
            y = Math.abs(gl.canvas.height - h) / 2;
        } else {
            //视频宽高比<=窗口宽高比 占满高
            w = width * gl.canvas.height / height;
            h = gl.canvas.height;
            x = Math.abs(gl.canvas.width - w) / 2;
            y = 0;
        }
    } else if (angle == 2 || angle == 4) {
        if (gl.canvas.width * width / height > gl.canvas.height) {
            w = gl.canvas.height * height / width;
            h = gl.canvas.height;
            x = Math.abs(gl.canvas.width - w) / 2;
            y = 0;
        } else {
            w = gl.canvas.width;
            h = gl.canvas.width * width / height;
            x = 0;
            y = Math.abs(gl.canvas.height - h) / 2;
        }
    }

   
    //清空画布
    gl.viewport(x, y, w, h);
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);


    //填充yuv
    gl.y.fill(width, height, videoFrame.subarray(0, width * height));
    gl.u.fill(width >> 1, height >> 1, videoFrame.subarray(width * height, width * height + width * height / 4));
    gl.v.fill(width >> 1, height >> 1, videoFrame.subarray(width * height + width * height / 4, width * height * 3 / 2));

    //旋转角度
    let radians = (angle - 1) * 90.0 * Math.PI / 180.0;
    let currentRotation = [0, 1];
    currentRotation[0] = Math.sin(radians);
    currentRotation[1] = Math.cos(radians);
    uRotationVector = gl.getUniformLocation(gl.program, "uRotationVector");
    gl.uniform2fv(uRotationVector, currentRotation);

    //绘制
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

};

WebGLPlayer.prototype.clear = function() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
};

