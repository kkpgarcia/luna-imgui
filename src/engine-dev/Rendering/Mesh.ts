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
        const combinedBuffers = this.PreprocessBuffers(data.vertices, data.normals, data.colors);
        const vertexBuffer = new VertexBuffer(combinedBuffers);
        const layout = new VertexBufferLayout();

        console.log(combinedBuffers);

        //TODO: Automatically check for data layout
        if (data.vertices) layout.Push(3, gl.FLOAT);
        if (data.normals) layout.Push(3, gl.FLOAT);
        if (data.colors) layout.Push(4, gl.FLOAT);
        
        this._vertexArrayObject.AddBuffer(vertexBuffer, layout);

        const indexBuffer = new IndexBuffer(data.indices, data.indices.length);
        this._vertexArrayObject.SetIndexBuffer(indexBuffer);
    }

    private PreprocessBuffers(position: number[], normals: number[], colors: number[]): number[]
    {
        let retValue = [];

        for (let i = 0, vIdx = 0, nIdx = 0, cIdx = 0; i < position.length; i += 3)
        {
            if (position)
            {
                for (let j = vIdx; j < vIdx + 3; j++) retValue.push(position[j]);
                vIdx += 3;
            }
            
            if (normals)
            {
                for (let j = nIdx; j < nIdx + 3; j++) retValue.push(normals[j]);
                nIdx += 3;
            }
            
            if (colors)
            {   
                for (let j = cIdx; j < cIdx + 4; j++) retValue.push(colors[j]);
                cIdx += 4;
            }
        }

        return retValue;
    }
}