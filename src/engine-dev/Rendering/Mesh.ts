import VertexArray from "./VertexArray";
import VertexBuffer from "./VertexBuffer";
import IndexBuffer from "./IndexBuffer";
import VertexBufferLayout from "./VertexBufferLayout";
import { Services } from "luna-engine";

export interface MeshData
{
    vertices: number[],
    normals: number[],
    colors: number[],
    indices: number[]
}

export default class Mesh
{
    private _vertexArrayObject: VertexArray;
    //TODO: find much better way to bind this
    public get vertexArrayObject(): VertexArray
    {
        return this._vertexArrayObject;
    } 
    
    constructor(data: MeshData)
    {
        const gl = Services.RenderingContext.gl;
        this._vertexArrayObject = new VertexArray();

        //TODO: Add colors to preprocess buffers
        const combinedBuffers = this.PreprocessBuffers(data.vertices, data.normals);
        const vertexBuffer = new VertexBuffer(combinedBuffers);
        const layout = new VertexBufferLayout();

        //TODO: Automatically check for data layout
        if (data.vertices) layout.Push(3, gl.FLOAT);
        if (data.normals) layout.Push(3, gl.FLOAT);
        if (data.colors) layout.Push(4, gl.FLOAT);
        
        this._vertexArrayObject.AddBuffer(vertexBuffer, layout);

        const indexBuffer = new IndexBuffer(data.indices, data.indices.length);
        this._vertexArrayObject.SetIndexBuffer(indexBuffer);
    }

    private PreprocessBuffers(position: number[], normals: number[]): number[]
    {
        if (!normals) return position;
        
        let retValue = [];
        const maxLength = position.length + normals.length;


        for (let i = 0; i < maxLength; i += 6)
        {
            const currentIndex = i / 2;

            retValue[i + 0] = position[currentIndex + 0];
            retValue[i + 1] = position[currentIndex + 1];
            retValue[i + 2] = position[currentIndex + 2];
            
            retValue[i + 3] = normals[currentIndex + 0];
            retValue[i + 4] = normals[currentIndex + 1];
            retValue[i + 5] = normals[currentIndex + 2];
        }

        return retValue;
    }
}