import { Mat4x4 } from "luna-engine";
// import Entity from "../Component/Entity";

export default class SceneNode
{
    private _localMatrix: Mat4x4;
    private _worldMatrix: Mat4x4;
    private _parent: SceneNode;
    private _children: SceneNode[];
    // private _entity: Entity;

    public get children(): SceneNode[]
    {
        return this._children;
    }

    public get worldMatrix(): Mat4x4
    {
        return this._worldMatrix;
    }

    public get localMatrix(): Mat4x4
    {
        return this._localMatrix;  
    }                     
                                                                                                       
    constructor (/*entity: Entity*/)
    {
        // this._localMatrix = Mat4x4.IDENTITY;                                                                                                                                                                                 Y;
        // this._worldMatrix = Mat4x4.IDENTITY;
        // this._entity = entity;
        this._localMatrix = Mat4x4.IDENTITY;
        this._worldMatrix = Mat4x4.IDENTITY;
    }

    public SetParent(node: SceneNode): void
    {
        if (this._parent)
        {
            const childIdx = this._parent.children.indexOf(this);

            if (childIdx < 0)
            {
                this._parent.children.splice(childIdx, 1);
            }
        }

        if (node)
        {
            node.AddChild(this);
        }

        this._parent = node;
    }

    public AddChild(node: SceneNode): void
    {
        this._children.push(node);
    }

    public UpdateWorldMatrix(matrix: Mat4x4): void
    {
        if (matrix)
        {
            matrix = matrix.Multiply_i(this._localMatrix).Multiply_i(this._worldMatrix);
        }
        else
        {
            this._localMatrix = Mat4x4.Copy(this._worldMatrix);
        }

        const worldMatrix = this._worldMatrix;
        this.children.forEach(function(child) {
            child.UpdateWorldMatrix(worldMatrix);
        });
    }
}