import Transform from "./Transform";

export default class Entity
{
    protected _transform: Transform;

    public get transform(): Transform
    {
        return this._transform;
    }

    constructor()
    {
        this._transform = new Transform();
    }
}