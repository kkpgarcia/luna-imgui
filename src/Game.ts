// import { EventArgs, NotificationCenter } from "@luna-engine/events";

import { 
    VertexArray, 
    IndexBuffer,
    Mat4x4, 
    Renderer, 
    Vector3, 
    Services, 
    VertexBuffer, 
    VertexBufferLayout, 
    EventArgs, 
    SystemScheduler ,
    Screen,
    Shader
} from "luna-engine";
import InputManager from "./engine-dev/InputManager";
import Transform from "./engine-dev/Component/Transform";
import CameraEntity from "./engine-dev/CameraEntity";
import { ViewportGrid } from "./engine-dev/ViewportGrid";

export interface IRenderable
{
    vao: VertexArray,
    ibo: IndexBuffer,
    shader: Shader
}

export default class Game
{
    private matrix: Mat4x4;
    private _color: number[] = [0.2, 1, 0.2, 1];
    
    private _numObjects = 10;
    private _radius = 15;
    private _transforms = [];
    
    //Cube
    private _renderer: Renderer;

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

        //Cube
        const vertices = this.Cube();
        const normals = this.CalculateNormals(vertices);
        const indices = this.CubeIndices();

        const modelData = this.PreprocessBuffers(vertices, normals);

        const vertexArray = new VertexArray();
        
        const vertexBuffer = new VertexBuffer(modelData);
        const layout = new VertexBufferLayout();
        layout.Push(3, gl.FLOAT);
        layout.Push(3, gl.FLOAT);
        vertexArray.AddBuffer(vertexBuffer, layout);
     
        const indexBuffer = new IndexBuffer(indices, indices.length);
     
        const shader = new Shader("transform.shader");
     
        this._renderables.push({
            vao: vertexArray,
            ibo: indexBuffer,
            shader: shader
        });

        //Grid
        const grid = new ViewportGrid();
        
        this._renderables.push(grid.Renderable);

        this._renderer = new Renderer();

        this._cameraEntity = new CameraEntity();
        this._cameraEntity.transform.Rotate(new Vector3(-20, 0, 0))
        this._cameraEntity.transform.Translate(new Vector3(0, 30, 40))

        for (let i = 0; i < this._numObjects; i++)
        {
            this._transforms.push(new Transform());
        }
     
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
        this._renderer.Clear();

        const worldMatrix = Mat4x4.Translation(this._worldPosition).Multiply_i(Mat4x4.Rotation(this._worldRotation));
        const worldViewProjectionMatrix = Mat4x4.Multiply(this._cameraEntity.viewProjectionMatrix, worldMatrix);
        const worldInverseMatrix = Mat4x4.Inverse(worldMatrix);
        const worldInverseTransposeMatrix = Mat4x4.Transpose(worldInverseMatrix);

        for(let r = 0; r < this._renderables.length; r++)
        {
            const currShader = this._renderables[r].shader;
            const currVAO = this._renderables[r].vao;
            const currIBO = this._renderables[r].ibo;

            currShader.Bind();

            //Quick creation of objects
            if (r == 0)
            {
                for (let i = 0; i < this._numObjects; ++i)
                {
                    const angle = i * Math.PI * 2 / this._numObjects;
                    const x = Math.cos(angle) * this._radius;
                    const z = Math.sin(angle) * this._radius;

                    const transform = this._transforms[i];
                    transform.Translate(new Vector3(x, 0, z))

                    transform.Rotate(
                        new Vector3(
                            transform.rotation.x + 1, 
                            transform.rotation.y + 1, 
                            transform.rotation.z + 1
                    ));

                    // this.matrix = Mat4x4.Multiply(worldViewProjectionMatrix, transform.matrix);//worldViewProjectionMatrix.Multiply_i(transform.matrix)
                    this.matrix = Mat4x4.Multiply(worldViewProjectionMatrix, transform.matrix);//worldViewProjectionMatrix.Multiply_i(transform.matrix)
                    
                    currShader.SetUniform4fv("u_Color", this._color);
                    currShader.SetUniformMatrix4fv("u_Matrix", false, this.matrix.ToArray());
                    currShader.SetUniformMatrix4fv("u_WorldInverseTranspose", false, worldInverseTransposeMatrix.ToArray());
                    let reverseLightDirection = new Vector3(0.2, 0.7, 1);
                    currShader.SetUniform3fv("u_ReverseLightDirection",reverseLightDirection.Normalize().ToArray());
                    
                    this._renderer.Draw(currVAO, currIBO, currShader);
                }
            }
            else
            {
                const gridMatrix = Mat4x4.Multiply(worldViewProjectionMatrix, Mat4x4.IDENTITY);
                currShader.SetUniform4fv("u_Color", [0.5, 0.5, 0.5, 1]);
                currShader.SetUniformMatrix4fv("u_Matrix", false, gridMatrix.ToArray());
                this._renderer.Draw(currVAO, currIBO, currShader);
            }
            
        }

        
    }

    private UpdateColor(deltaTime: number): void
    {
        this._color[0] = this._color[0] > 1 ? 0 : this._color[0] += 1 * deltaTime;
        this._color[1] = this._color[1] > 1 ? 0 : this._color[1] += 3 * deltaTime;
        this._color[2] = this._color[2] > 1 ? 0 : this._color[2] += 2 * deltaTime;
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