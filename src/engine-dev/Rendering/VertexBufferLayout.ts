import VertexBufferElement from "./VertexBufferElement";

export default class VertexBufferLayout
{
    private _elements: Array<VertexBufferElement>;
    public get elements(): Array<VertexBufferElement>
    {
        return this._elements;
    }

    private _stride = 0;
    public get stride(): number
    {
        return this._stride;
    }

    constructor()
    {
        this._elements = new Array<VertexBufferElement>();
    }
    
    public Push(count: number, type: number): void
    {
        const normalized = false;

        this._elements.push({type, count, normalized});
        this._stride += VertexBufferElement.GetSizeOfType(type) * count;
    }
}