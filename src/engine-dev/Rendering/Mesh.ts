import VertexArray from "./VertexArray";
import VertexBuffer from "./VertexBuffer";
import IndexBuffer from "./IndexBuffer";
import VertexBufferLayout from "./VertexBufferLayout";
import { Services, Vector3 } from "luna-engine";

export interface MeshData
{
    vertices: number[],
    colors: number[],
    indices: number[],
    calculateNormals: boolean
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
        const combinedBuffers = this.PreprocessBuffers(data.vertices, data.colors, data.calculateNormals);
        const vertexBuffer = new VertexBuffer(combinedBuffers);
        const layout = new VertexBufferLayout();

        //TODO: Automatically check for data layout
        if (data.vertices) layout.Push(3, gl.FLOAT);
        if (data.calculateNormals) layout.Push(3, gl.FLOAT);
        if (data.colors) layout.Push(4, gl.FLOAT);
        
        this._vertexArrayObject.AddBuffer(vertexBuffer, layout);

        const indexBuffer = new IndexBuffer(data.indices, data.indices.length);
        this._vertexArrayObject.SetIndexBuffer(indexBuffer);
    }

    public CalculateNormals(model: number[]): number[]
    {
        let retValue = [];

        for(let i = 0; i < model.length; i += 3)
        {
            let normalizedValue = new Vector3(model[i + 0], model[i + 1], model[i + 2]).Normalize().ToArray();
            retValue = retValue.concat(normalizedValue);
        }

        return retValue;
    }

    private PreprocessBuffers(verices: number[], colors: number[], calculateNormals = false): number[]
    {
        let retValue = [];
        let normals = calculateNormals ? this.CalculateNormals(verices) : [];

        for (let i = 0, vIdx = 0, nIdx = 0, cIdx = 0; i < verices.length; i += 3)
        {
            if (verices)
            {
                for (let j = vIdx; j < vIdx + 3; j++) retValue.push(verices[j]);
                vIdx += 3;
            }
            
            if (normals.length > 0)
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