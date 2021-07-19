// import { EventArgs, NotificationCenter } from "@luna-engine/events";
import 
{ 
    Renderer,
    RenderingContext, 
    Shader, 
    VertexArray, 
    VertexBuffer, 
    IndexBuffer, 
    VertexBufferLayout,
    // Texture
} from "@luna-engine/renderer";
import { SystemScheduler } from "@luna-engine/core";
import { NotificationCenter, EventArgs } from "@luna-engine/events";
// import Mat3x3 from "./engine-dev/Mat3x3";
import { Vector3, Mat4x4 } from "@luna-engine/math";
// import Mat4x4 from "./engine-dev/Mat4x4";
import InputManager from "./engine-dev/InputManager";
import AppCache, { CacheType } from "@luna-engine/utility/dist/AppCache";
// import Screen from "./engine-dev/Screen";

export default class Game
{
    private _position: Vector3 = new Vector3(0, 0, -10);
    private _rotation: Vector3 = new Vector3(0, 0, 0);
    private _scale: Vector3 = new Vector3(1, 1, 1);
    
    private matrix: Mat4x4;
    private _color: number[] = [0, 0, 0, 1];
    private _shader: Shader;
    private _vertexArray: VertexArray;
    private _indexBuffer: IndexBuffer;
    private _renderer: Renderer;

    private _numObjects = 10;
    private _radius = 15;
    private _cameraAngle = 0;

    constructor(canvas: HTMLCanvasElement)
    {
        RenderingContext.instance.Init(canvas);
    }

    public async Start(): Promise<void>
    {
        const gl = RenderingContext.instance.gl;

        const vertices = this.Cube();
        const indices = this.CubeIndices();
     
        this._vertexArray = new VertexArray();
     
        const vertexBuffer = new VertexBuffer(vertices);
        const layout = new VertexBufferLayout();
        layout.Push(3, gl.FLOAT);
        this._vertexArray.AddBuffer(vertexBuffer, layout);
     
        this._indexBuffer = new IndexBuffer(indices, indices.length);
     
        const shaderSource = AppCache.instance.GetShader("transform.shader");
        this._shader = new Shader(shaderSource);
        AppCache.instance.DisposeKey(CacheType.SHADER, "transform.shader");
     
        this._renderer = new Renderer();
     
        NotificationCenter.instance.AddObserver((args: EventArgs<number>) => this.Update(args.data), SystemScheduler.UPDATE_NOTIFICATION)
    }

    private Update(deltaTime: number): void
    {
        this.InputUpdate(deltaTime);
        this.UpdateColor(deltaTime);
        this.UpdateRotation(deltaTime);
        this.Draw();
    }

    private Draw(): void
    {
        this._renderer.Clear();

        this._shader.Bind();
        
        const aspect = 1;//window.screen.width/window.screen.height;
        const zFar = 500;
        const projectionMatrix = Mat4x4.Perspective(30, aspect, 1, zFar);
        let cameraMatrix = Mat4x4.Rotation(new Vector3(10, this._cameraAngle, 0));
        cameraMatrix = cameraMatrix.Multiply_i(Mat4x4.Translation(new Vector3(0, 5, 60)));
        const viewMatrix = Mat4x4.Inverse(cameraMatrix);
        const viewProjectionMatrix = Mat4x4.Multiply(projectionMatrix, viewMatrix);


        //Quick creation of objects
        for (let i = 0; i < this._numObjects; ++i)
        {
            const angle = i * Math.PI * 2 / this._numObjects;
            const x = Math.cos(angle) * this._radius;
            const z = Math.sin(angle) * this._radius;

            this._position = new Vector3(x, 0, z);

            this.matrix = //Mat4x4.IDENTITY
                // this.Projection(800, 800, 400)
                // this.Orthographic(0, 800, 800, 0, -400, 400)
                // this.Perspective(60, aspect, 1, zFar)
                viewProjectionMatrix
                .Multiply_i(Mat4x4.Translation(this._position))
                .Multiply_i(Mat4x4.Rotation(this._rotation))
                .Multiply_i(Mat4x4.Scaling(this._scale));
            
            this._shader.SetUniform4f("u_Color", this._color);
            this._shader.SetUniformMatrix4fv("u_Matrix", false, this.matrix.ToArray());
            
            this._renderer.Draw(this._vertexArray, this._indexBuffer, this._shader);
        }
    }

    private UpdateColor(deltaTime: number): void
    {
        this._color[0] = this._color[0] > 1 ? 0 : this._color[0] += 1 * deltaTime;
        this._color[1] = this._color[1] > 1 ? 0 : this._color[1] += 3 * deltaTime;
        this._color[2] = this._color[2] > 1 ? 0 : this._color[2] += 2 * deltaTime;
    }

    private UpdateRotation(deltaTime: number): void
    {
        this._rotation.x += 20 * deltaTime;
        this._rotation.y += 20 * deltaTime;
        this._rotation.z += 20 * deltaTime;
        this._cameraAngle += 100 * deltaTime;
    }


    private InputUpdate(deltaTime: number): void
    {
        const speed = 500 * deltaTime;
        if(InputManager.instance.onKeyDown("ArrowUp"))
        {
            this._position.y += speed;
        }
        
        if(InputManager.instance.onKeyDown("ArrowDown"))
        {
            this._position.y -= speed;
        }
        if(InputManager.instance.onKeyDown("ArrowLeft"))
        {
            this._position.x -= speed;
        }
        if(InputManager.instance.onKeyDown("ArrowRight"))
        {
            this._position.x += speed;
        }

    }

    public Cube(): number[]
    {
        return [
            // Front face
            -1.0 , -1.0,  1.0,
            1.0 , -1.0,  1.0,
            1.0 ,  1.0,  1.0,
            -1.0 ,  1.0,  1.0,

            // Back face
            -1.0 , -1.0, -1.0,
            -1.0 ,  1.0, -1.0,
            1.0 ,  1.0, -1.0,
            1.0 , -1.0, -1.0,

            // Top face
            -1.0 ,  1.0, -1.0,
            -1.0 ,  1.0,  1.0,
            1.0 ,  1.0,  1.0,
            1.0 ,  1.0, -1.0,

            // Bottom face
            -1.0 , -1.0, -1.0,
            1.0 , -1.0, -1.0,
            1.0 , -1.0,  1.0,
            -1.0 , -1.0,  1.0,

            // Right face
            1.0 , -1.0, -1.0,
            1.0 ,  1.0, -1.0,
            1.0 ,  1.0,  1.0,
            1.0 , -1.0,  1.0,

            // Left face
            -1.0 , -1.0, -1.0,
            -1.0 , -1.0,  1.0,
            -1.0 ,  1.0,  1.0,
            -1.0 ,  1.0, -1.0,

        ]
    }
    
    public CubeIndices(): number[]
    {
        return [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
          ];
    }

    // public LookAt(cameraPos: Vector3, target: Vector3, up: Vector3): Mat4x4
    // {
    //     const z = cameraPos.Subtract(target);
    // }
}