
// import { Services, VertexArray, VertexBuffer, VertexBufferLayout, IndexBuffer, Vector3, Shader } from "luna-engine";
import { IRenderable } from "src/Game";

import { Services, Vector3 } from "luna-engine";
import IndexBuffer from "./Rendering/IndexBuffer";
import Shader from "./Rendering/Shader";
import VertexBuffer from "./Rendering/VertexBuffer";
import VertexArray from "./Rendering/VertexArray";
import VertexBufferLayout from "./Rendering/VertexBufferLayout";
import Transform from "./Component/Transform";
import Material from "./Rendering/Material";

export class ViewportGrid
{
    private _renderable: IRenderable;
    public get Renderable(): IRenderable
    {
        return this._renderable;
    }

    constructor()
    {
        const gl = Services.RenderingContext.gl;
        const gridModel = this.Grid(100);
        const gridIndices = this.GridIndices(100);

        const gridVertexArray = new VertexArray();

        const gridBuffer = new VertexBuffer(gridModel);
        const gridLayout = new VertexBufferLayout();
        gridLayout.Push(3, gl.FLOAT);
        gridVertexArray.AddBuffer(gridBuffer, gridLayout);

        const gridIndexBuffer = new IndexBuffer(gridIndices, gridIndices.length);

        gridVertexArray.SetIndexBuffer(gridIndexBuffer);

        const gridShader = new Shader("grid.shader");
        const material = new Material(gridShader);

        material.SetUniform("u_Color", [0.5, 0.5, 0.5, 1]);

        this._renderable = {
            transform: new Transform(),
            vao: gridVertexArray,
            ibo: gridIndexBuffer,
            material: material
        };
    }

    public Grid(size: number): number[]
    {
        let retValue = [];
        
        for (let i = 0; i < size; i++) {
            let increment = i * 5;
            let center = (size * 5) / 4;
            retValue = retValue.concat(this.Line(new Vector3(increment - center, 0, 0), 0.025, 100));
            retValue = retValue.concat(this.Line(new Vector3(0, 0, increment - center), 100, 0.025));
        }


        return retValue;
    }

    private Line(origin: Vector3, width: number, length: number): number[]
    {
        return [
            width + origin.x, 0, length + origin.z,
            width + origin.x, 0, -length + origin.z,
            -width + origin.x, 0, -length + origin.z,
            -width + origin.x, 0, length + origin.z 
        ]
    }

    public GridIndices(size: number): number[]
    {
        let retValue = [];

        for (let i = 0; i < size; i++)
        {
            const currIndex = i * 6;
            retValue[0 + currIndex] = 0 + (i * 4);
            retValue[1 + currIndex] = 1 + (i * 4);
            retValue[2 + currIndex] = 2 + (i * 4);

            retValue[3 + currIndex] = 0 + (i * 4);
            retValue[4 + currIndex] = 2 + (i * 4);
            retValue[5 + currIndex] = 3 + (i * 4);
        }
        
        return retValue;
    }
}