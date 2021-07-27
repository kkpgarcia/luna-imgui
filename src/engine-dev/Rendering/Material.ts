// import { Mat4x4, Services } from "luna-engine";
import { Services } from "luna-engine";
import Shader from "./Shader";
// import * as TextureUtils from "./TextureUtils";//from "./TextureUtils";

// export class MaterialProperties
// {
// }

export enum RenderFlag
{
    DEPTH_BUFFER,
    CULL_FACE
}

export default class Material
{
    private _shader: Shader;
    private _properties: Map<string, number | number[]>;
    
    //TODO: Temporary
    private _orthographic: boolean;
    public get orthographic(): boolean
    {
        return this._orthographic;
    }

    public _flags: number[];

    constructor(shader: Shader)
    {
        // const gl = Services.RenderingContext.gl;
        this._shader = shader;
        this._properties = new Map<string, number | number[]>();
        this._flags = [];
    }

    public Bind(): void
    {
        this._shader.Bind();

        this.ApplyFlags(true);

        for (let i = 0; i < this._properties.size; i++)
        {
            const propertyName = Array.from(this._properties.keys())[i];
            
            if (!this._shader.HasUniform(propertyName)) continue;

            const propertyData = this._properties.get(propertyName);
            const uniformType = this._shader.GetUniformType(propertyName);

            switch(uniformType)
            {
                case "mat4":
                    this._shader.SetUniformMatrix4fv(propertyName, false, propertyData as number[])
                    break;
                case "mat3":
                    this._shader.SetUniformMatrix3fv(propertyName, false, propertyData as number[])
                    break;
                case "mat2":
                    this._shader.SetUniformMatrix2fv(propertyName, false, propertyData as number[])
                    break;
                case "vec4":
                    this._shader.SetUniform4f(propertyName, propertyData as number[]);
                    break;
                case "vec3":
                    this._shader.SetUniform3f(propertyName, propertyData as number[]);
                    break;
                case "vec2":
                    this._shader.SetUniform2f(propertyName, propertyData as number[]);
                    break;
                case "float":
                    this._shader.SetUniform1f(propertyName, propertyData as number);
                    break;
                case "int":
                    this._shader.SetUniform1i(propertyName, propertyData as number);
                    break;
                // case "sampler2D":
                //     break;
            }
        }
    }

    public Unbind(): void
    {
        this.ApplyFlags(false);
        this._shader.Unbind();
    }

    public SetOrtographic(value: boolean): void
    {
        this._orthographic = value;
    }

    public SetFlag(flag: number): void
    {
        this._flags.push(this.GetFlag(flag));
    }

    public SetUniform(name: string, data: number | number[]): void
    {
        this._properties.set(name, data);
    }

    public GetFlag(flag: RenderFlag): number
    {
        const gl = Services.RenderingContext.gl;

        switch(flag)
        {
            case RenderFlag.DEPTH_BUFFER: return gl.DEPTH_BUFFER_BIT;
            case RenderFlag.CULL_FACE: return gl.CULL_FACE;
        }
    }

    private ApplyFlags(apply: boolean): void
    {
        const gl = Services.RenderingContext.gl;

        this._flags.forEach(element => {
            if (apply)
            {
                gl.enable(element);
            }
            else
            {
                gl.disable(element);
            }
        });
    }
}