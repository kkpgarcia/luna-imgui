import { Services, /*Mat4x4,*/ SystemScheduler, Screen, Mat4x4, Vector3 } from "luna-engine";

import Shader from "./engine-dev/Rendering/Shader";
import Renderer from "./engine-dev/Rendering/Renderer";
import Transform from "./engine-dev/Component/Transform";
import Mesh from "./engine-dev/Rendering/Mesh";
import Primitives, { PrimitiveType } from "./engine-dev/Component/Primitives";
import Material/*, { RenderFlag }*/ from "./engine-dev/Rendering/Material";

interface RenderObject
{
    transform: Transform,
    // shader: Shader,
    material: Material
    mesh: Mesh
}

export default class ImguiSandbox
{

    private _renderables: RenderObject[] = [];

    constructor(canvas: HTMLCanvasElement)
    {
        Services.RenderingContext.Init(canvas);
    }

    public Start()
    {
        const radius = 50;
        const mesh = Primitives.Create(PrimitiveType.ROUNDED_PLANE, [800, 800, radius]);

        const shader = new Shader("imgui.shader");
        const material = new Material(shader);
        material.SetOrtographic(true);
        // material.SetUniform("u_Color", [0, 0, 0, 0.8]);

        const transform = new Transform();

        transform.Translate(new Vector3(Screen.Width/2, Screen.Height/2));
        transform.Scale(new Vector3(1000, -1000, 0));
        // transform.Scale(new Vector3(1, 1, 1));

        this._renderables.push({
            transform: transform,
            // shader: shader,,
            material: material,
            mesh: mesh
        });

        // this.CreateText();

        Services.NotificationCenter.AddObserver((evt) => this.Update(evt.data), SystemScheduler.UPDATE_NOTIFICATION);
    }

    private Update(deltaTime: number)
    {
        this.Draw();
    }

    private Draw(): void
    {
        // let projection = Mat4x4.Orthographic(0, Screen.Width, Screen.Height, 0, 0, 400);

        this._renderables.forEach(element => {  
            Renderer.Begin(Mat4x4.IDENTITY, Mat4x4.IDENTITY, element.transform.matrix, element.material);
            Renderer.Draw(element.mesh.vertexArrayObject);
            Renderer.End(element.material)
        });
    }

    // private CreateText(): void
    // {
    //     const gl = Services.RenderingContext.gl;
    //     const textCanvas = this.CreateTextCanvas("Hallo", 100, 26);

    //     // const textWidth = textCanvas.width;
    //     // const textHeight = textCanvas.height;
    //     const texture: WebGLTexture = gl.createTexture();

    //     gl.bindTexture(gl.TEXTURE_2D, texture);
    //     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    //     gl.generateMipmap(gl.TEXTURE_2D);
    //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    //     // const transform = new Transform();

    //     const vertices = [
    //         -1, -1,
    //         1, -1,
    //         1, 1,
    //         -1, 1
    //     ];
    //     const indices = [
    //         0,  1,  2, 
    //         0,  2,  3,   
    //     ];

    //     const vertexArray = new VertexArray();
    //     const vertexBuffer = new VertexBuffer(vertices);
    //     const indexBuffer = new IndexBuffer(indices, indices.length);
    //     const layout = new VertexBufferLayout();
    //     layout.Push(2, gl.FLOAT);

    //     vertexArray.AddBuffer(vertexBuffer, layout);
    //     vertexArray.SetIndexBuffer(indexBuffer);
        
    //     // const shader = new Shader("text.shader");
        
    //     // this._renderables.push({
    //     //     vao: vertexArray,
    //     //     mat: null,
    //     //     transform: transform,
    //     //     shader: shader,
    //     //     // texture: texture
    //     // })
    // }

    // private CreateTextCanvas(text: string, width: number, height: number): HTMLCanvasElement
    // {
    //     const textCtx = document.createElement("canvas").getContext("2d");

    //     textCtx.canvas.width  = Screen.Width;
    //     textCtx.canvas.height = Screen.Height;
    //     textCtx.font = "20px monospace";
    //     textCtx.textAlign = "center";
    //     textCtx.textBaseline = "middle";
    //     textCtx.fillStyle = "black";
    //     textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
    //     textCtx.fillText("Hello World!", Screen.Width / 2, Screen.Height / 2);

    //     return textCtx.canvas;
    // }
}