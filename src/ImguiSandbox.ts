import { Services, /*Mat4x4,*/ SystemScheduler, Screen, Mat3x3, Vector2, Mat4x4 } from "luna-engine";

import VertexArray from "./engine-dev/Rendering/VertexArray";
import IndexBuffer from "./engine-dev/Rendering/IndexBuffer";
import VertexBuffer from "./engine-dev/Rendering/VertexBuffer";
import VertexBufferLayout from "./engine-dev/Rendering/VertexBufferLayout";
import Material from "./engine-dev/Rendering/Material";
import Shader from "./engine-dev/Rendering/Shader";
import Renderer from "./engine-dev/Rendering/Renderer";
import Transform from "./engine-dev/Component/Transform";

interface RenderObject
{
    vao: VertexArray,
    mat: Material,
    transform: Transform,
    shader: Shader,
    // texture: WebGLTexture
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
        const gl = Services.RenderingContext.gl;
        const radius = 50;
        const vertices = this.CreateRoundedRectangle(800, 800, radius);
        const indices = this.CreateIndices(radius);

        const vertexArray = new VertexArray();
        const vertexBuffer = new VertexBuffer(vertices);
        const layout = new VertexBufferLayout();
        layout.Push(2, gl.FLOAT);
        layout.Push(4, gl.FLOAT);
        // layout.Push(2, gl.FLOAT);
        vertexArray.AddBuffer(vertexBuffer, layout);

        const indexBuffer = new IndexBuffer(indices, indices.length);
        vertexArray.SetIndexBuffer(indexBuffer);
        
        const shader = new Shader("imgui.shader");
        const material = new Material(shader);

        // material.SetUniform("u_Color", [0, 0, 0, 0.8]);

        const transform = new Transform();
        // transform.Scale(new Vector3(1, 1, 1));

        this._renderables.push({
            vao: vertexArray,
            mat: material,
            transform: transform,
            shader: shader
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
        let projection = Mat4x4.Orthographic(0, Screen.Width, Screen.Height, 0, 0, 400);
        // let view = Mat4x4.Translation(new Vector3(, 0, 0));
        // let viewProjection = Mat4x4.Multiply(projection, view);


        this._renderables.forEach(element => {
            // Renderer.Begin(Mat4x4.Orthographic(0, Screen.Width, Screen.Height, 0, 400, -400), Mat4x4.IDENTITY, element.transform.matrix, element.mat);

            let matrix = Mat3x3.Translation(new Vector2(Screen.Width/2, Screen.Height/2));
                matrix = Mat3x3.Multiply(matrix, Mat3x3.Rotation(0));
                matrix = Mat3x3.Multiply(matrix, Mat3x3.Scaling(new Vector2(1000, -1000)));
                matrix = Mat3x3.Multiply(matrix, Mat3x3.Scaling(new Vector2(1, 1)));

            element.shader.Bind();
            
            element.shader.SetUniformMatrix4fv("u_Projection", false, projection.ToArray());
            element.shader.SetUniformMatrix3fv("u_Matrix", false, matrix.ToArray());

            Renderer.Draw(element.vao);
            Renderer.End(element.mat)
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


    public CreateRoundedRectangle(width: number, height: number, radius: number): number[]
    {
        width = (width - radius) / Screen.Width;
        height = (height - radius) / Screen.Height;

        const xOffset = radius / Screen.Width;
        const yOffset = radius / Screen.Height;

        let retValue = [
            //Main Box
            -width, -height, 0, 0, 0, 0.5, 
             width, -height, 0, 0, 0, 0.5, 
             width,  height, 0, 0, 0, .5,  
            -width,  height, 0, 0, 0, .5,  
            //Upper
            -width, -height + yOffset, 0, 0, 0, 0.5, 
             width, -height + yOffset, 0, 0, 0, 0.5, 
             width,  height + yOffset, 0, 0, 0, .5,  
            -width,  height + yOffset, 0, 0, 0, .5,  
            //lower
            -width, -height - yOffset, 0, 0, 0, 0.5, 
             width, -height - yOffset, 0, 0, 0, 0.5, 
             width,  height - yOffset, 0, 0, 0, .5,  
            -width,  height - yOffset, 0, 0, 0, .5,  
            //Right
            -width + xOffset, -height, 0, 0, 0, 0.5, 
             width + xOffset, -height, 0, 0, 0, 0.5, 
             width + xOffset,  height, 0, 0, 0, .5,  
            -width + xOffset,  height, 0, 0, 0, .5,  
            //Left
            -width - xOffset, -height, 0, 0, 0, 0.5, 
             width - xOffset, -height, 0, 0, 0, 0.5, 
             width - xOffset,  height, 0, 0, 0, .5,  
            -width - xOffset,  height, 0, 0, 0, .5,  
        ]

        const numPoints = Math.floor(radius / 10);

        const quadrants = [
            [width, height, 0, 0, 0, 0.5],
            [-width, height, 0, 0, 0, 0.5],
            [-width, -height, 0, 0, 0, 0.5],
            [width, -height, 0, 0, 0, 0.5]
        ]

        let toConcat = [];

        
        for (let i = 0; i < quadrants.length; ++i)
        {
            const currQuadrant = quadrants[i];
            
            toConcat = toConcat.concat(currQuadrant);
            
            for (let j = 0; j < numPoints + 1; ++j)
            {
                const angle = j * (Math.PI / 2) / numPoints + this.DegreeToRad(i * 90);
                const x = (Math.cos(angle) * radius/ Screen.Width);
                const y = (Math.sin(angle) * radius/ Screen.Height);
                
                toConcat = toConcat.concat([
                    x + currQuadrant[0],
                    y + currQuadrant[1],
                    currQuadrant[2],
                    currQuadrant[3],
                    currQuadrant[4],
                    currQuadrant[5]
                ]);
            }
        }
        
        retValue = retValue.concat(toConcat);

        return retValue;
    }

    public CreateIndices(radius: number): number[]
    {
        const retValue = [
            //Center
            0,  1,  2, 
            0,  2,  3,   

            //Upper
            4, 5, 6,
            4, 6, 7,

            //Lower
            8, 9, 10,
            8, 10, 11,

            //Right
            12, 13, 14,
            12, 14, 15,

            //Left
            16, 17, 18,
            16, 18, 19,
        ];
        const numPoints = Math.floor(radius / 10);

        for (let j = 0; j < 4; j++)
        {
            const currIdx = retValue[retValue.length - 1] + 1;
            for (let i = 0; i < numPoints + 1; i++)
            {
                retValue.push(currIdx);
                retValue.push(currIdx + i);
                retValue.push(currIdx + (i + 1));
            }
        }

        return retValue;
    }

    public DegreeToRad(angle: number): number
    {
        return angle * Math.PI / 180;
    }
}