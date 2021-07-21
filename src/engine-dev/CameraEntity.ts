import { Mat4x4 } from "@luna-engine/math";
import Camera from "./Component/Camera";
import Transform from "./Component/Transform";
import Entity from "./Component/Entity";

export default class CameraEntity extends Entity
{
    private _camera: Camera;

    public get camera(): Camera
    {
        return this._camera;
    }

    public get transform(): Transform
    {
        return this._transform;
    }

    public get viewProjectionMatrix(): Mat4x4
    {
        return Mat4x4.Multiply(this._camera.projection, Mat4x4.Inverse(this._transform.matrix));
    }

    constructor()
    {
        super();
        this._transform = new Transform();
        this._camera = new Camera();
    }
}