// import Services from "../Core/Service/Services";
// import { CacheType } from "../Utility/AppCache";
// import Debug from "../Core/Debug/Debug";
import { Services, Debug } from "luna-engine";
import { CacheType } from "luna-engine/dist/Utility/AppCache";

export default class Shader
{ 
    private _shader: WebGLProgram;
    private _uniformLocationCache: Map<string, WebGLUniformLocation>;
    private _availableUniforms: Map<string, string>;

    constructor(source: string)
    {
        this._uniformLocationCache = new Map<string, WebGLUniformLocation>();
        this._availableUniforms = new Map<string, string>();

        const cached = Services.AppCache.GetShader(source);
        const parsed = this.ParseShader(cached);

        this._shader = this.CreateProgram(parsed[0], parsed[1]);

        Services.AppCache.DisposeKey(CacheType.SHADER, source);
    }

    private CreateProgram(vertexSource: string, fragmentSource: string): WebGLProgram
    {
        const gl = Services.RenderingContext.gl;
        const program = gl.createProgram();

        const vertShader = this.CreateShader(vertexSource, gl.VERTEX_SHADER);
        const fragShader = this.CreateShader(fragmentSource, gl.FRAGMENT_SHADER);

        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);

        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);

        return program;
    }

    private CreateShader(source: string, shaderType: number): WebGLShader
    {
        const gl = Services.RenderingContext.gl;
        const shader = gl.createShader(shaderType);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        

        return shader;
    }

    public Bind(): void
    {
        const gl = Services.RenderingContext.gl;
        gl.useProgram(this._shader);
    }

    public Unbind(): void
    {
        const gl = Services.RenderingContext.gl;
        gl.useProgram(null);
    }

    public SetUniform1i(name: string, data: number): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform1i(this.GetUniformLocation(name), data);
    }

    public SetUniform2i(name: string, data: number[]): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform2i(this.GetUniformLocation(name), data[0], data[1]);
    }

    public SetUniform3i(name: string, data: number[]): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform3i(this.GetUniformLocation(name), data[0], data[1], data[2]);
    }

    public SetUniform4i(name: string, data: number[]): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform4i(this.GetUniformLocation(name), data[0], data[1], data[2], data[3]);
    }

    public SetUniform1f(name: string, data: number): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform1f(this.GetUniformLocation(name), data)
    }
    public SetUniform2f(name: string, data: number[]): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform2f(this.GetUniformLocation(name), data[0], data[1])
    }
    public SetUniform3f(name: string, data: number[]): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform3f(this.GetUniformLocation(name), data[0], data[1], data[2])
    }
    public SetUniform4f(name: string, data: number[]): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform4f(this.GetUniformLocation(name), data[0], data[1], data[2], data[3])
    }

    public SetUniform1iv(name: string, data: Int32List): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform1iv(this.GetUniformLocation(name), data);
    }

    public SetUniform2iv(name: string, data: Int32List): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform2iv(this.GetUniformLocation(name), data);
    }

    public SetUniform3iv(name: string, data: Int32List): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform3iv(this.GetUniformLocation(name), data);
    }

    public SetUniform4iv(name: string, data: Int32List): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform4iv(this.GetUniformLocation(name), data);
    }

    public SetUniform1fv(name: string, data: Float32List): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform1fv(this.GetUniformLocation(name), data)
    }

    public SetUniform2fv(name: string, data: Float32List): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform2fv(this.GetUniformLocation(name), data);
    }

    public SetUniform3fv(name: string, data: Float32List): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform3fv(this.GetUniformLocation(name), data)
    }

    public SetUniform4fv(name: string, data: Float32List): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform4fv(this.GetUniformLocation(name), data);
    }
    
    public SetUniform1ui(name: string, data: number): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform1ui(this.GetUniformLocation(name), data)
    }

    public SetUniform2ui(name: string, data: number[]): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform2ui(this.GetUniformLocation(name), data[0], data[1]);
    }

    public SetUniform3ui(name: string, data: number[]): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform3ui(this.GetUniformLocation(name), data[0], data[1], data[2])
    }

    public SetUniform4ui(name: string, data: number[]): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform4ui(this.GetUniformLocation(name), data[0], data[1], data[2], data[3]);
    }

    public SetUniform1uiv(name: string, data: number): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform1ui(this.GetUniformLocation(name), data)
    }

    public SetUniform2uiv(name: string, data: Uint32List): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform2uiv(this.GetUniformLocation(name), data);
    }

    public SetUniform3uiv(name: string, data: Uint32List): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform3uiv(this.GetUniformLocation(name), data)
    }

    public SetUniform4uiv(name: string, data: Uint32List): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniform4uiv(this.GetUniformLocation(name), data);
    }

    public SetUniformMatrix2fv(name: string, transpose: boolean, data: number[]): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniformMatrix2fv(this.GetUniformLocation(name), transpose, data);
    }

    public SetUniformMatrix3fv(name: string, transpose: boolean, data: number[]): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniformMatrix3fv(this.GetUniformLocation(name), transpose, data);
    }

    public SetUniformMatrix4fv(name: string, transpose: boolean, data: number[]): void
    {
        const gl = Services.RenderingContext.gl;
        gl.uniformMatrix4fv(this.GetUniformLocation(name), transpose, data);
    }

    public GetUniformLocation(name: string): WebGLUniformLocation
    {
        const gl = Services.RenderingContext.gl;

        if (this._uniformLocationCache.has(name))
        {
            return this._uniformLocationCache.get(name);
        }

        const location = gl.getUniformLocation(this._shader, name);
        
        if (!location)
        {
            Debug.Error("Uniform " + name + " doesn't exists");
        }
        
        this._uniformLocationCache.set(name, location);

        return location;
    }

    public HasUniform(name: string): boolean
    {
        return this._availableUniforms.has(name);
    }

    public GetUniformType(name: string): string
    {
        return this._availableUniforms.get(name);
    }

    private ParseShader(src: string): string[]
    {
       const lines = src.match(/[^\r\n]+/g);
       const shaders: string[] = ['', ''];
       let shaderIdx = 0;

       for (let i = 0; i < lines.length; i++)
       {
            const line = lines[i];

            //Quick retrieval of uniforms
            if (line.includes("uniform"))
            {
                const uniformLine = line.split(' ');
                this._availableUniforms.set(uniformLine[2].replace(';', ''), uniformLine[1]);
            }
            
            if (line === "#vertex" || line === "#fragment")
            {
                shaderIdx++;
            }
            else
            {
                shaders[shaderIdx] += line + '\n';
            }
       }

       return shaders;
    }
}