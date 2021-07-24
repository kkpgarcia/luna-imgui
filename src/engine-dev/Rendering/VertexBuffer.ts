// import Services from "../Core/Service/Services";
import { Services } from "luna-engine";

export default class VertexBuffer
{
    private _buffer: WebGLBuffer;

    constructor(data: number[])
    {
        const gl = Services.RenderingContext.gl;
        this._buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    }

    public Bind(): void
    {
        const gl = Services.RenderingContext.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
    }

    public Unbind(): void
    {
        const gl = Services.RenderingContext.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}