import { Config } from "@luna-engine/utility"

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

    constructor(canvas: HTMLCanvasElement, config: Config)
    {
        Screen._canvas = canvas;
        this.SetSize(config.screenConfig.width, config.screenConfig.height);

        this.SetupEventListeners();
    }

    private SetupEventListeners(): void
    {
        window.addEventListener('resize', () => this.OnResize(), false);
    }

    public SetSize(width: number, height: number): void
    {
        Screen._canvas.width = width;
        Screen._canvas.height = height;
    }

    public OnResize(): void
    {
        let height = 0;
        let width = 0;

        if(this.GetWindowRatio() < this.GetRatio())
        {
            height = Screen._canvas.clientHeight;
            width = height / this.GetRatio();
        }
        else
        {
            width = Screen._canvas.clientWidth;
            height = width * this.GetRatio();
        }

        this.SetSize(width, height);
    }

    public GetRatio(): number
    {
        return Screen.Height / Screen.Width;
    }

    public GetWindowRatio(): number
    {
        return window.innerHeight / window.innerWidth;
    }
}