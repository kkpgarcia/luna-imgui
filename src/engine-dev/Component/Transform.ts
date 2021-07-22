import { Mat4x4, Vector3 } from "luna-engine";

export default class Transform
{
    private _position: Vector3;
    private _rotation: Vector3;
    private _scale: Vector3;

    // private _lookAtTarget: Mat4x4;

    public get position(): Vector3
    {
        return this._position;
    }

    public get rotation(): Vector3
    {
        return this._rotation;
    }

    public get scale(): Vector3
    {
        return this._scale;
    }

    public get matrix(): Mat4x4
    {
        return Mat4x4.IDENTITY
                .Multiply_i(Mat4x4.Translation(this._position))
                // .Multiply_i(this._lookAtTarget)
                .Multiply_i(Mat4x4.Rotation(this._rotation))
                .Multiply_i(Mat4x4.Scaling(this._scale));
    }

    constructor()
    {
        this._position = new Vector3();
        this._rotation = new Vector3();
        this._scale = new Vector3(1, 1, 1);
        // this._lookAtTarget = Mat4x4.IDENTITY;
    }

    public Translate(position: Vector3): void
    {
        this._position = position;
    }

    public Rotate(rotation: Vector3): void
    {
        this._rotation = rotation;
    }

    public Scale(scale: Vector3): void
    {
        this._scale = scale;
    }

    // public LookAt(origin: Vector3, target: Vector3, up: Vector3 = Vector3.UP): void
    // {
    //     if (target.Equals(Vector3.ZERO) && origin.Equals(Vector3.ZERO))
    //     {
    //         this._lookAtTarget = Mat4x4.IDENTITY;
    //         return;
    //     }

    //     const z = origin.Subtract(target).Normalize();
    //     const x = Vector3.Cross(up, z).Normalize();
    //     const y = Vector3.Cross(z, x).Normalize();

    //     this._lookAtTarget = new Mat4x4(
    //         x[0], x[1], x[2], 0,
    //         y[0], y[1], y[2], 0,
    //         z[0], z[1], z[2], 0,
    //         origin[0], origin[1], origin[2], 1
    //     );
    // }
    // public LookAt(origin: Vector3, target: Vector3, up = Vector3.UP): void
    // {
    //     this.matrix = Mat4x4.LookAt(origin, target, up);
    // }
}