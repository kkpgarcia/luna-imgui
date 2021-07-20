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
// import InputManager from "./engine-dev/InputManager";
import AppCache, { CacheType } from "@luna-engine/utility/dist/AppCache";
import Transform from "./engine-dev/Component/Transform";
// import Screen from "./engine-dev/Screen";

export default class Game
{
    // private _cameraPosition: Vector3 = new Vector3(0, 5, 60);
    // private _rotation: Vector3 = new Vector3(0, 0, 0);
    // private _scale: Vector3 = new Vector3(1, 1, 1);
    
    private matrix: Mat4x4;
    private _color: number[] = [0.2, 1, 0.2, 1];
    private _shader: Shader;
    private _vertexArray: VertexArray;
    private _indexBuffer: IndexBuffer;
    private _renderer: Renderer;

    private _numObjects = 10;
    private _radius = 15;
    private _cameraAngle = 0;
    private _transforms = [];
    private _cameraTransform: Transform;

    constructor(canvas: HTMLCanvasElement)
    {
        RenderingContext.instance.Init(canvas);
    }

    public async Start(): Promise<void>
    {
        const gl = RenderingContext.instance.gl;
        gl.enable(gl.CULL_FACE);

        const vertices = this.Cube();
        const normals = this.CalculateNormals(vertices);
        const indices = this.CubeIndices();

        const modelData = this.PreprocessBuffers(vertices, normals);

        this._vertexArray = new VertexArray();
        
        const vertexBuffer = new VertexBuffer(modelData);
        const layout = new VertexBufferLayout();
        layout.Push(3, gl.FLOAT);
        layout.Push(3, gl.FLOAT);
        this._vertexArray.AddBuffer(vertexBuffer, layout);

        // const normalsBuffer = new VertexBuffer(normals);
        // const nLayout = new VertexBufferLayout();
        // nLayout.Push(3, gl.FLOAT);
        // layout.Push(3, gl.FLOAT);
        // this._vertexArray.AddBuffer(normalsBuffer, layout);
        
        // nLayout.Push(3, gl.FLOAT);

        // const nlayout = new VertexBufferLayout();
        // layout.Push(3, gl.FLOAT);
        // this._vertexArray.AddBuffer(normalsBuffer, layout);
     
        this._indexBuffer = new IndexBuffer(indices, indices.length);
     
        const shaderSource = AppCache.instance.GetShader("transform.shader");
        this._shader = new Shader(shaderSource);
        AppCache.instance.DisposeKey(CacheType.SHADER, "transform.shader");
     
        this._renderer = new Renderer();

        this._cameraTransform = new Transform();
        // this._cameraTransform.position.z = 10;
        for (let i = 0; i < this._numObjects; i++)
        {
            this._transforms.push(new Transform());
        }
     
        NotificationCenter.instance.AddObserver((args: EventArgs<number>) => this.Update(args.data), SystemScheduler.UPDATE_NOTIFICATION)
    }

    private Update(deltaTime: number): void
    {
        // this.InputUpdate(deltaTime);
        // this.UpdateColor(deltaTime);
        // this.UpdateRotation();
        this.Draw();
    }

    private Draw(): void
    {
        this._renderer.Clear();

        this._shader.Bind();
        
        const aspect = 1;//window.screen.width/window.screen.height;
        const zFar = 500;
        const projectionMatrix = Mat4x4.Perspective(30, aspect, 1, zFar);

        this._cameraTransform.Rotate(new Vector3(-20, this._cameraAngle, 0));
        this._cameraTransform.Translate(new Vector3(0, 20, 40));

        // let cameraMatrix = Mat4x4.Rotation(new Vector3(0, this._cameraAngle, 0));
        // cameraMatrix = cameraMatrix.Multiply_i(Mat4x4.Translation(this._cameraPosition));

        // const cameraPosition = new Vector3(
        //     this._cameraTransform.matrix.Get(12), 
        //     this._cameraTransform.matrix.Get(13), 
        //     this._cameraTransform.matrix.Get(14)
        //     );
        // const cameraMatrix = this.LookAt(this._cameraTransform.position, this._transforms[0].position);
        
        // const cameraMatrix = Mat4x4.LookAt(cameraPosition, new Vector3(this._radius, 0, 0), Vector3.UP);

        // const viewMatrix = Mat4x4.Inverse(this._cameraTransform.matrix);
        // this._cameraTransform.LookAt(this._cameraTransform.position, new Vector3(this._radius, 0, 0));
        
        const viewMatrix = Mat4x4.Inverse(this._cameraTransform.matrix);
        const viewProjectionMatrix = Mat4x4.Multiply(projectionMatrix, viewMatrix);

        // const worldMatrix = Mat4x4.Rotation(new Vector3(0, 0, 0));
        // const worldViewProjectionMatrix = Mat4x4.Multiply(viewProjectionMatrix, worldMatrix);

        

        //Quick creation of objects
        for (let i = 0; i < this._numObjects; ++i)
        {
            const angle = i * Math.PI * 2 / this._numObjects;
            const x = Math.cos(angle) * this._radius;
            const z = Math.sin(angle) * this._radius;

            const transform = this._transforms[i];
            transform.Translate(new Vector3(x, 0, z))
            // // transform.LookAt(transform.position, new Vector3(1, 1, 0));
            transform.Rotate(
                new Vector3(
                    transform.rotation.x + 1, 
                    transform.rotation.y + 1, 
                    transform.rotation.z + 1)
                    );

            this.matrix = viewProjectionMatrix.Multiply_i(transform.matrix)
            
            // this._shader.SetUniformMatrix4fv("u_WorldViewProjection", false, worldViewProjectionMatrix.ToArray());
            this._shader.SetUniform4fv("u_Color", this._color);
            this._shader.SetUniformMatrix4fv("u_Matrix", false, this.matrix.ToArray());
            let reverseLightDirection = new Vector3(0.2, 0.7, 1);
            this._shader.SetUniform3fv("u_ReverseLightDirection",reverseLightDirection.Normalize().ToArray());
            
            this._renderer.Draw(this._vertexArray, this._indexBuffer, this._shader);
        }
    }

    // private UpdateColor(deltaTime: number): void
    // {
    //     this._color[0] = this._color[0];//this._color[0] > 1 ? 0 : this._color[0] += 1 * deltaTime;
    //     this._color[1] = this._color[1];//this._color[1] > 1 ? 0 : this._color[1] += 3 * deltaTime;
    //     this._color[2] = this._color[2];//this._color[2] > 1 ? 0 : this._color[2] += 2 * deltaTime;
    // }

    // private UpdateRotation(): void
    // {;
    //     this._cameraAngle += 1;
    // }


    // private InputUpdate(deltaTime: number): void
    // {
    //     const speed = 500 * deltaTime;
    //     if(InputManager.instance.onKeyDown("ArrowUp"))
    //     {
    //         this._position.y += speed;
    //     }
        
    //     if(InputManager.instance.onKeyDown("ArrowDown"))
    //     {
    //         this._position.y -= speed;
    //     }
    //     if(InputManager.instance.onKeyDown("ArrowLeft"))
    //     {
    //         this._position.x -= speed;
    //     }
    //     if(InputManager.instance.onKeyDown("ArrowRight"))
    //     {
    //         this._position.x += speed;
    //     }

    // }

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

    public PreprocessBuffers(position: number[], normals: number[]): number[]
    {
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

    // public LookAt(cameraPos: Vector3, target: Vector3, up: Vector3 = Vector3.UP): Mat4x4
    // {
    //     const z = cameraPos.Subtract(target).Normalize();
    //     const x = Vector3.Cross(up, z).Normalize();
    //     const y = Vector3.Cross(z, x).Normalize();

    //     return new Mat4x4(
    //         x[0], x[1], x[2], 0,
    //         y[0], y[1], y[2], 0,
    //         z[0], z[1], z[2], 0,
    //         cameraPos[0], cameraPos[1], cameraPos[2], 1
    //     );
    // }
}