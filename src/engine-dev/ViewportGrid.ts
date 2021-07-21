import { Vector3 } from "@luna-engine/math";
import { VertexArray, VertexBuffer, VertexBufferLayout, IndexBuffer, Shader, RenderingContext } from "@luna-engine/renderer";
import { AppCache, CacheType } from "@luna-engine/utility";
import { IRenderable } from "src/Game";

export class ViewportGrid
{
    private _renderable: IRenderable;
    public get Renderable(): IRenderable
    {
        return this._renderable;
    }

    constructor()
    {
        const gl = RenderingContext.instance.gl;
        const gridModel = this.Grid(100);
        const gridIndices = this.GridIndices(100);

        const gridVertexArray = new VertexArray();

        const gridBuffer = new VertexBuffer(gridModel);
        const gridLayout = new VertexBufferLayout();
        gridLayout.Push(3, gl.FLOAT);
        gridVertexArray.AddBuffer(gridBuffer, gridLayout);

        const gridIndexBuffer = new IndexBuffer(gridIndices, gridIndices.length);

        const gridSource = AppCache.instance.GetShader("grid.shader");
        const gridShader = new Shader(gridSource);
        AppCache.instance.DisposeKey(CacheType.SHADER, "grid.shader");

        this._renderable = {
            vao: gridVertexArray,
            ibo: gridIndexBuffer,
            shader: gridShader
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