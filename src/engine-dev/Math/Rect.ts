import { Vector2 } from "luna-engine";

export default class Rect
{
    private _position: Vector2;
    private _dimension: Vector2;

    public get x(): number
    {
        return this._position.x;
    }

    public get y(): number
    {
        return this._position.y;
    }

    public get width(): number
    {
        return this._dimension.x;
    }

    public get height(): number
    {
        return this._dimension.y;
    }

    constructor(x: number, y: number, width: number, height: number)
    {
        this._position.x = x;
        this._position.y = y;
        this._dimension.x = width;
        this._dimension.y = height;
    }

    public SetPosition(pos: Vector2): void
    {
        this._position = pos;
    }

    public SetSize(size: Vector2): void
    {
        this._dimension = size;
    }
}