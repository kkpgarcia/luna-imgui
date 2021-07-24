// import Services from "../Core/Service/Services";
import { Services } from "luna-engine";
import IndexBuffer from "./IndexBuffer";
import VertexBuffer from "./VertexBuffer";
import VertexBufferElement from "./VertexBufferElement";
import VertexBufferLayout from "./VertexBufferLayout";

export default class VertexArray
{
    private _vertexArray: WebGLVertexArrayObject;
    private _indexBuffer: IndexBuffer;

    public get indexBuffer(): IndexBuffer
    {
        return this._indexBuffer;
    }

    constructor()
    {
        const gl = Services.RenderingContext.gl;
        this._vertexArray = gl.createVertexArray();
    }

    public AddBuffer(vertexBuffer: VertexBuffer, layout: VertexBufferLayout): void
    {
        const gl = Services.RenderingContext.gl;
        
        this.Bind();
        vertexBuffer.Bind();

        const elements = layout.elements;
        let offset = 0;

        for (let i = 0; i < elements.length; i++)
        {
            const element = elements[i]
            gl.enableVertexAttribArray(i);
            gl.vertexAttribPointer(i, element.count, element.type, element.normalized, layout.stride, offset);

            offset += element.count * VertexBufferElement.GetSizeOfType(element.type);;
        }

    }

    public SetIndexBuffer(indexBuffer: IndexBuffer): void
    {
        this.Bind();
        indexBuffer.Bind();
        this._indexBuffer = indexBuffer;
    }

    public Bind(): void
    {
        const gl = Services.RenderingContext.gl;
        gl.bindVertexArray(this._vertexArray);
    }

    public Unbind(): void
    {
        const gl = Services.RenderingContext.gl;
        gl.bindVertexArray(null);
    }
}