// import { Mat4x4, Services } from "luna-engine";
import Shader from "./Shader";
// import * as TextureUtils from "./TextureUtils";//from "./TextureUtils";

// export class MaterialProperties
// {
// }

export default class Material
{
    private _shader: Shader;
    private _properties: Map<string, number | number[]>;

    constructor(shader: Shader)
    {
        // const gl = Services.RenderingContext.gl;
        this._shader = shader;
        this._properties = new Map<string, number | number[]>();

        //Initialized Uniforms
        // this.SetUniform("u_worldViewProjection", Mat4x4.IDENTITY.ToArray());
        // this.SetUniform("u_lightWorldPos", new Vector3(100, 200, 300).ToArray());
        // this.SetUniform("u_world", Mat4x4.IDENTITY.ToArray());
        // this.SetUniform("u_worldViewProjection", Mat4x4.IDENTITY.ToArray());
        // this.SetUniform("u_lightWorldPos", [100, 200, 300]);
        // this.SetUniform("u_world", Mat4x4.IDENTITY.ToArray());
        // this.SetUniform("u_viewInverse", Mat4x4.IDENTITY.ToArray());
        // this.SetUniform("u_worldInverseTranspose", Mat4x4.IDENTITY.ToArray());
        // this.SetUniform("u_lightColor", [1, 1, 1, 1]);
        // this.SetUniform("u_ambient", [0.1, 0.1, 0.1, 1]);
        // this.SetUniform("u_diffuse", TextureUtils.textureUtils.makeCheckerTexture(gl, { color1: "#FFF", color2: "#CCC", }));
        // this.SetUniform("u_specular", [1, 1, 1, 1]);
        // this.SetUniform("u_shininess", 60);
        // this.SetUniform("u_specularFactor", 1);
    }

    public Bind(): void
    {
        this._shader.Bind();

        for (let i = 0; i < this._properties.size; i++)
        {
            const propertyName = Array.from(this._properties.keys())[i];
            
            if (!this._shader.HasUniform(propertyName))
            {
                // console.log("Hello");
                continue;
            }

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
        this._shader.Unbind();
    }

    public SetFlag(): void
    {

    }

    public SetUniform(name: string, data: number | number[]): void
    {
        this._properties.set(name, data);
    }
}