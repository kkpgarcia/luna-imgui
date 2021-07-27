// import { EventArgs, NotificationCenter } from "@luna-engine/events";

import { 
    Mat4x4, 
    Vector3, 
    Services, 
    EventArgs, 
    SystemScheduler,
    Screen,
} from "luna-engine";
import InputManager from "./engine-dev/InputManager";
import Transform from "./engine-dev/Component/Transform";
import CameraEntity from "./engine-dev/CameraEntity";
import { ViewportGrid } from "./engine-dev/ViewportGrid";

import Renderer from "./engine-dev/Rendering/Renderer";
import Material from "./engine-dev/Rendering/Material";
import Mesh from "./engine-dev/Rendering/Mesh";
import ImguiBox from "./engine-dev/ImguiBox";
import RotatingCube from "./engine-dev/RotatingCube";

export interface IRenderable
{
    transform: Transform,
    material: Material,
    mesh: Mesh
}

export default class Game
{
    private _renderables: IRenderable[];
    
    private _numObjects = 6;
    private _radius = 15;

    //Grid
    private _cameraEntity: CameraEntity;

    private _worldPosition: Vector3 = new Vector3();
    private _worldRotation: Vector3 = new Vector3();

    constructor(canvas: HTMLCanvasElement)
    {
        Services.RenderingContext.Init(canvas);
    }

    public async Start(): Promise<void>
    {
        const gl = Services.RenderingContext.gl;
        // gl.enable(gl.DEPTH_BUFFER_BIT);
        
        //Move to rendering context
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        this._renderables = [];

        //Grid
        const grid = new ViewportGrid();
        this._renderables.push(grid.Renderable);
        
        //Cubes
        for (let i = 0; i < this._numObjects; ++i)
        {
            const angle = i * Math.PI * 2 / this._numObjects;
            const x = Math.cos(angle) * this._radius;
            const z = Math.sin(angle) * this._radius;

            const cube = new RotatingCube();
            cube.transform.Translate(new Vector3(x, 0, z));  
            
            this._renderables.push(cube.renderable);
        }

        //Imgui
        const imgui = new ImguiBox();
        this._renderables.push(imgui.renderable);  

        this._cameraEntity = new CameraEntity();
        this._cameraEntity.transform.Rotate(new Vector3(-20, 0, 0))
        this._cameraEntity.transform.Translate(new Vector3(0, 30, 40))

        Services.NotificationCenter.AddObserver((args: EventArgs<number>) => this.Update(args.data), SystemScheduler.UPDATE_NOTIFICATION)
    }

    private Update(deltaTime: number): void
    {
        this.InputUpdate(deltaTime);
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