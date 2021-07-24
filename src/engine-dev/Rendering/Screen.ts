// import Services from "../Core/Service/Services";
// import Config from "../Utility/Config";
import { Services, Config } from "luna-engine";

export default class Screen
{
    private static _canvas: HTMLCanvasElement;

    public static get Width(): number
    {
        return this._canvas.width;
    }

    public static get Height(): number
    {
        return this._canvas.height;
    }

    public static get Aspect(): number
    {
        return this._canvas.clientWidth / this._canvas.clientHeight;
    }

    constructor(canvas: HTMLCanvasElement, config: Config)
    {
        Screen._canvas = canvas;
        const devicePixelRatio = window.devicePixelRatio || 1;
        this.SetSize( Math.round(config.screenConfig.width * devicePixelRatio),  Math.round(config.screenConfig.height* devicePixelRatio));
    }

    public SetSize(width: number, height: number): void
    {
        Screen._canvas.width = width;
        Screen._canvas.height = height;
    }

    public static ResizeCheck(): void
    {
        const gl = Services.RenderingContext.gl;
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        const width = Math.round(gl.canvas.width * devicePixelRatio);
        const height = Math.round(gl.canvas.height * devicePixelRatio);

        if (gl.canvas.width != width ||
            gl.canvas.height != height) {
           gl.canvas.width = width;
           gl.canvas.height = height;
        }

        gl.viewport(0, 0, width, height);
    }
}