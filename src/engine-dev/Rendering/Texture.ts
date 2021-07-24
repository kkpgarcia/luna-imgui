// import Services from "../Core/Service/Services";
// import { CacheType } from "../Utility/AppCache";
import { Services } from "luna-engine";
import { CacheType } from "luna-engine/dist/Utility/AppCache";

export default class Texture
{
    private _texture: WebGLTexture;
    private _width: number;
    private _height: number;

    //Teture Data
    private _localBuffer: HTMLImageElement;

    public get width(): number
    {
        return this._width;
    }

    public get height(): number
    {
        return this._height;
    }

    //Mobile has 8 Texture Slots
    constructor(path: string)
    {
        this._localBuffer = Services.AppCache.GetTexture(path);
        this._width = this._localBuffer.width;
        this._height = this._localBuffer.height;
        this._localBuffer.style.transform = 'rotate(180 deg)';

        const gl = Services.RenderingContext.gl;

        this._texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, this._width, this._height, 0, gl.RGBA, gl.UNSIGNED_BYTE, this._localBuffer);
        gl.bindTexture(gl.TEXTURE_2D, null);

        if(this._localBuffer)
        {
            Services.AppCache.DisposeKey(CacheType.TEXTURE, path);
        }

    }

    public Bind(slot = 0): void
    {
        const gl = Services.RenderingContext.gl;
        gl.activeTexture(gl.TEXTURE0 + slot);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
    }

    public Unbind(): void
    {
        const gl = Services.RenderingContext.gl;
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    /**
     * It is important to use this function when you want
     * to deallocate this object
     */
    public Destroy(): void
    {
        const gl = Services.RenderingContext.gl;
        gl.deleteTexture(this._texture);
    }
}