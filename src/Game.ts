// import { EventArgs, NotificationCenter } from "@luna-engine/events";

import { 
    // VertexArray, 
    // IndexBuffer,
    // Renderer, 
    // VertexBuffer, 
    // VertexBufferLayout, 
    // Shader,
    Mat4x4, 
    Vector3, 
    Services, 
    EventArgs, 
    SystemScheduler,
    Screen,
    // RenderingContext
} from "luna-engine";
import InputManager from "./engine-dev/InputManager";
import Transform from "./engine-dev/Component/Transform";
import CameraEntity from "./engine-dev/CameraEntity";
import { ViewportGrid } from "./engine-dev/ViewportGrid";

// import IndexBuffer from "./engine-dev/Rendering/IndexBuffer";
import Shader from "./engine-dev/Rendering/Shader";
import Renderer from "./engine-dev/Rendering/Renderer";
// import VertexBuffer from "./engine-dev/Rendering/VertexBuffer";
// import VertexArray from "./engine-dev/Rendering/VertexArray";
// import VertexBufferLayout from "./engine-dev/Rendering/VertexBufferLayout";
import Material from "./engine-dev/Rendering/Material";
import Mesh from "./engine-dev/Rendering/Mesh";

export interface IRenderable
{
    transform: Transform,
    // vao: VertexArray,
    // ibo: IndexBuffer,
    material: Material,
    mesh: Mesh
    // shader: Shader
}

export default class Game
{
    private _color: number[] = [0.2, 1, 0.2, 1];
    
    private _numObjects = 6;
    private _radius = 15;

    //Grid
    private _cameraEntity: CameraEntity;

    private _renderables: IRenderable[];

    private _worldPosition: Vector3 = new Vector3();
    private _worldRotation: Vector3 = new Vector3();

    constructor(canvas: HTMLCanvasElement)
    {
        Services.RenderingContext.Init(canvas);
    }

    public async Start(): Promise<void>
    {
        const gl = Services.RenderingContext.gl;
        
        //Move to rendering context
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.enable(gl.CULL_FACE);

        this._renderables = [];

        const grid = new ViewportGrid();
        this._renderables.push(grid.Renderable);

        //Cube
        const mesh = new Mesh({
            vertices: this.Cube(),
            normals: this.CalculateNormals(this.Cube()),
            indices: this.CubeIndices(),
            colors: null
        })
     
        const shader = new Shader("transform.shader");
        const material = new Material(shader);

        for (let i = 0; i < this._numObjects; ++i)
        {
            const angle = i * Math.PI * 2 / this._numObjects;
            const x = Math.cos(angle) * this._radius;
            const z = Math.sin(angle) * this._radius;

            const transform = new Transform();
            transform.Translate(new Vector3(x, 0, z))            
            
            this._renderables.push({
                transform: transform,
                material: material,
                mesh: mesh
            });
        }

        this._cameraEntity = new CameraEntity();
        this._cameraEntity.transform.Rotate(new Vector3(-20, 0, 0))
        this._cameraEntity.transform.Translate(new Vector3(0, 30, 40))

        Services.NotificationCenter.AddObserver((args: EventArgs<number>) => this.Update(args.data), SystemScheduler.UPDATE_NOTIFICATION)
    }

    private Update(deltaTime: number): void
    {
        this.InputUpdate(deltaTime);
        this.UpdateColor(deltaTime);
        this.Draw();
    }

    private Draw(): void
    {
        Screen.ResizeCheck();
        Renderer.SetClearColor([0.15, 0.15, 0.15, 1]);
        Renderer.Clear();

        const viewProjectionMatrix = this._cameraEntity.viewProjectionMatrix;
        const worldMatrix = Mat4x4.Translation(this._worldPosition).Multiply_i(Mat4x4.Rotation(this._worldRotation));
        
        for(let r = 0; r < this._renderables.length; r++)
        {
            const currTransform = this._renderables[r].transform;
            const currMaterial = this._renderables[r].material;
            const currVAO = this._renderables[r].mesh.vertexArrayObject;  

            Renderer.Begin(viewProjectionMatrix,
                            worldMatrix,
                            currTransform.matrix,
                            currMaterial);                    
            Renderer.Draw(currVAO);
            Renderer.End(currMaterial);
            
        }
    }

    private UpdateColor(deltaTime: number): void
    {
        this._color[0] = this._color[0] > 1 ? 0 : this._color[0] += 1 * deltaTime;
        this._color[1] = this._color[1] > 1 ? 0 : this._color[1] += 3 * deltaTime;
        this._color[2] = this._color[2] > 1 ? 0 : this._color[2] += 2 * deltaTime;

        for(let r = 0; r < this._renderables.length; r++)
        {
            if (r === 0)
            {
                continue;
            }

            const currTransform = this._renderables[r].transform;
            const currMaterial = this._renderables[r].material;

            currTransform.Rotate(
                new Vector3(
                    currTransform.rotation.x + 1, 
                    currTransform.rotation.y + 1, 
                    currTransform.rotation.z + 1
                ));
                    
            currMaterial.SetUniform("u_Color", this._color);
            
            let reverseLightDirection = new Vector3(0.2, 0.7, 1);
            currMaterial.SetUniform("u_ReverseLightDirection", reverseLightDirection.Normalize().ToArray());
        }
    }


    private InputUpdate(deltaTime: number): void
    {
        const speed = 150 * deltaTime;
        if(InputManager.instance.onKeyDown("ArrowUp"))
        {
            this._worldRotation.x += speed;
        }
        
        if(InputManager.instance.onKeyDown("ArrowDown"))
        {
            this._worldRotation.x -= speed;
        }

        if(InputManager.instance.onKeyDown("ArrowLeft"))
        {
            this._worldRotation.y -= speed;
        }
        if(InputManager.instance.onKeyDown("ArrowRight"))
        {
            this._worldRotation.y += speed;
        }

        if(InputManager.instance.onKeyDown("w"))
        {
            this._worldPosition.z += speed;
        }
        if(InputManager.instance.onKeyDown("a"))
        {
            this._worldPosition.x += speed;
        }
        if(InputManager.instance.onKeyDown("s"))
        {
            this._worldPosition.z -= speed;
        }
        if(InputManager.instance.onKeyDown("d"))
        {
            this._worldPosition.x -= speed;
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

    // public PreprocessBuffers(position: number[], normals: number[]): number[]
    // {
    //     let retValue = [];
    //     const maxLength = position.length + normals.length;

    //     for (let i = 0; i < maxLength; i += 6)
    //     {
    //         const currentIndex = i / 2;

    //         retValue[i + 0] = position[currentIndex + 0];
    //         retValue[i + 1] = position[currentIndex + 1];
    //         retValue[i + 2] = position[currentIndex + 2];
            
    //         retValue[i + 3] = normals[currentIndex + 0];
    //         retValue[i + 4] = normals[currentIndex + 1];
    //         retValue[i + 5] = normals[currentIndex + 2];
    //     }

    //     return retValue;
    // }

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