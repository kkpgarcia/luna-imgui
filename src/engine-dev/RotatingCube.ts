import Shader from "./Rendering/Shader";
import Material from "./Rendering/Material";
import Primitives, { PrimitiveType } from "./Component/Primitives";
import { Services, SystemScheduler, EventArgs, Vector3 } from "luna-engine";
import Transform from "./Component/Transform";
import { IRenderable } from "src/Game";

export default class RotatingCube
{
    private _transform: Transform;
    public get transform(): Transform
    {
        return this._transform;
    }

    private _material: Material;

    private _color: number[] = [0.2, 1, 0.2, 1];

    public renderable: IRenderable;

    constructor()
    {
        const mesh = Primitives.Create(PrimitiveType.CUBE, null);
        const shader = new Shader("transform.shader");

        this._material = new Material(shader);
        this._transform = new Transform();

        this.renderable = {
            mesh: mesh,
            material: this._material,
            transform: this._transform
        }

        Services.NotificationCenter.AddObserver((args: EventArgs<number>) => this.Update(args.data), SystemScheduler.UPDATE_NOTIFICATION)
    }

    private Update(deltaTime: number): void
    {
        this.UpdateColor(deltaTime);
        this.UpdateRotation(deltaTime);
    }

    private UpdateColor(deltaTime: number): void
    {
        this._color[0] = this._color[0] > 1 ? 0 : this._color[0] += 1 * deltaTime;
        this._color[1] = this._color[1] > 1 ? 0 : this._color[1] += 3 * deltaTime;
        this._color[2] = this._color[2] > 1 ? 0 : this._color[2] += 2 * deltaTime;

        
        const currMaterial = this._material;

        currMaterial.SetUniform("u_Color", this._color);
        
        let reverseLightDirection = new Vector3(0.2, 0.7, 1);
        currMaterial.SetUniform("u_ReverseLightDirection", reverseLightDirection.Normalize().ToArray());
    }

    private UpdateRotation(deltaTime: number): void
    {
        const currTransform = this._transform;
        currTransform.Rotate(
            new Vector3(
                currTransform.rotation.x + 1, 
                currTransform.rotation.y + 1, 
                currTransform.rotation.z + 1
            ));
    }
}