import { Mat4x4, Screen } from "luna-engine";

enum ProjectionType
{
    NONE,
    ORTHOGRAPHIC,
    PERSPECTIVE
}

export default class Camera
{
    private _projection: ProjectionType;
    private _fieldOfView: number = 30;
    private _nearClipping: number = 1;
    private _farClipping: number = 500;

    public get projection(): Mat4x4
    {   const projection = Mat4x4.IDENTITY;
        switch(this._projection)
        {
            case ProjectionType.ORTHOGRAPHIC:
                return Mat4x4.Orthographic(0, Screen.Width, Screen.Height, 0, this._nearClipping, this._farClipping);
            case ProjectionType.PERSPECTIVE:
                return Mat4x4.Perspective(this._fieldOfView, Screen.Aspect, this._nearClipping, this._farClipping);
        }

        return Mat4x4.Inverse(projection);
    }

    public set fieldOfView(value: number)
    {
        this._fieldOfView = value;
    }

    public set nearClipping(value: number)
    {
        this._nearClipping = value;
    }

    public set farClipping(value: number)
    {
        this._farClipping = value;
    }

    constructor()
    {
        this.SetProjection(ProjectionType.PERSPECTIVE);
    }

    public SetProjection(type: ProjectionType): void
    {
        this._projection = type;
    }
}