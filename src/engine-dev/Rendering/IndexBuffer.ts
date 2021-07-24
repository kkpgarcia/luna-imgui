// import Services from "../Core/Service/Services";
import { Services } from "luna-engine";

export default class IndexBuffer
{
    private _buffer: WebGLBuffer;
    private _count: number;

    public get count(): number
    {
        return this._count;
    }

    constructor(data: number[], count: number)
    {
        const gl = Services.RenderingContext.gl;
        this._buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
        this._count = count;
    }

    public Bind(): void
    {
        const gl = Services.RenderingContext.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer);
    }

    public Unbind(): void
    {
        const gl = Services.RenderingContext.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}