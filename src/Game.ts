// import { EventArgs, NotificationCenter } from "@luna-engine/events";
import 
{ 
    Renderer,
    RenderingContext, 
    Shader, 
    VertexArray, 
    VertexBuffer, 
    IndexBuffer, 
    VertexBufferLayout,
    Texture
} from "@luna-engine/renderer";
import { SystemScheduler } from "@luna-engine/core";
import { NotificationCenter, EventArgs } from "@luna-engine/events";
import Mat3x3 from "./engine-dev/Mat3x3";
import { Vector2 } from "@luna-engine/math";

export default class Game
{
    private _renderer: Renderer;
    private _vertexArray: VertexArray;
    private _shader: Shader;
    private _indexBuffer: IndexBuffer;
    private _translationMatrix: Mat3x3;
    private _rotationMatrix: Mat3x3;
    private _scaleMatrix: Mat3x3;
    private _matrix: Mat3x3;
    private _currentRotation = 0;

    constructor(canvas: HTMLCanvasElement)
    {
        RenderingContext.instance.Init(canvas);
    }

    public async Start(): Promise<void>
    {
        const gl = RenderingContext.instance.gl;

        const vertices = [
            //x   y    u    v
            -0.5, -1, 0.0, 0.0,    // 0 
             0.5, -1, 1.0, 0.0,   // 1
             0.5,  1, 1.0, 1.0,    // 2
            -0.5,  1, 0.0, 1.0      // 3
        ];

        const indices = [
            0, 1, 2, 
            0, 2, 3
        ];

        this._vertexArray = new VertexArray();
        const vertexBuffer = new VertexBuffer(vertices);
        
        const layout = new VertexBufferLayout();
        layout.Push(2, gl.FLOAT); // Position
        layout.Push(2, gl.FLOAT); // Texture Coords
        this._vertexArray.AddBuffer(vertexBuffer, layout);

        this._indexBuffer = new IndexBuffer(indices, 6);
        
        this._shader = new Shader("transform.shader");
        this._shader.Bind();

        this._matrix = Mat3x3.IDENTITY;
        //Transformation
        // this._mat = new Mat3x3(0,0,0,0,0,0,0,0,0); 
        // this._translationMatrix = this._mat.Translate(new Vector2(0, 0));
        // this._rotationMatrix = this._mat.Rotate(90);
        // this._scaleMatrix = this._mat.Scale(new Vector2(1, 1));
        // this._matrix = this._mat.Multiply(this._translationMatrix, this._rotationMatrix);
        // this._matrix = this._mat.Multiply(this._matrix, this._scaleMatrix);

        // this._shader.SetUniformMatrix3fv("u_Matrix", false, this._matrix.AsArray());
        
        const texture = new Texture("luna-logo.png");
        texture.Bind(0);
        this._shader.SetUniform1i("u_Texture", 0);
        
        this._renderer = new Renderer();

        NotificationCenter.instance.AddObserver((args: EventArgs<number>) => this.Update(args), SystemScheduler.UPDATE_NOTIFICATION);
    }

    private Update(args: EventArgs<number>): void
    {
        // let rotation = ;
        // this._mat = new Mat3x3(0,0,0,0,0,0,0,0,0); 
        // this._translationMatrix = this._mat.Translate(new Vector2(0, 0));
        // this._currentRotation = this._currentRotation + 10;
        // this._rotationMatrix = this._mat.Rotate(this._currentRotation);
        // this._scaleMatrix = this._mat.Scale(new Vector2(1, 1));
        // this._matrix = this._mat.Multiply(this._translationMatrix, this._rotationMatrix);
        // this._matrix = this._mat.Multiply(this._matrix, this._scaleMatrix);
        this.UpdateRotation();

        this._renderer.Clear(); 

        this._vertexArray.Bind();
        this._indexBuffer.Bind();
        this._shader.Bind();

        this._translationMatrix = Mat3x3.IDENTITY.Translate(new Vector2(0, -1));
        this._rotationMatrix = Mat3x3.IDENTITY.Rotate(0);
        this._scaleMatrix = Mat3x3.IDENTITY.Scale(new Vector2(1, 1));
        

        this._matrix.Multiply_i(this._translationMatrix).Multiply_i(this._rotationMatrix).Multiply_i(this._scaleMatrix);
        this._shader.SetUniformMatrix3fv("u_Matrix", false, this._matrix.AsArray());
        
        this._renderer.Draw(this._vertexArray, this._indexBuffer, this._shader);
    }

    private UpdateRotation(): void
    {
        this._rotationMatrix = Mat3x3.IDENTITY.Rotate(this._currentRotation + 10);
    }
}