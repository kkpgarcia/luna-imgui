export default class RenderingContext
{
    private _gl: WebGL2RenderingContext;
    public get gl(): WebGL2RenderingContext
    {
        return this._gl;
    }

    private _isInitalized = false;
    public get isInitalizd(): boolean
    {
        return this._isInitalized;
    }

    public Init(canvas: HTMLCanvasElement): void
    {
        this._gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
        this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, true);
        this._gl.enable(this._gl.BLEND);
        this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);
        this._gl.enable(this._gl.DEPTH_TEST);
        this._isInitalized = true;
    }
}