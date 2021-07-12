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

export default class Game
{
    constructor(canvas: HTMLCanvasElement)
    {
        RenderingContext.instance.Init(canvas);
    }

    public async Start(): Promise<void>
    {
        const gl = RenderingContext.instance.gl;

        const vertices = [
            //x   y    u    v
            -0.5, 0.5, 0.0, 0.0,    // 0 
            -0.5, -0.5, 1.0, 0.0,   // 1
            0.5, -0.5, 1.0, 1.0,    // 2
            0.5, 0.5, 0.0, 1.0      // 3
        ];

        const indices = [
            0, 1, 2, 
            0, 2, 3
        ];

        const vertexBuffer = new VertexBuffer(vertices);
        const vertexArray = new VertexArray();
        const layout = new VertexBufferLayout();
        
        layout.Push(2, gl.FLOAT); // Position
        layout.Push(2, gl.FLOAT); // Texture Coords

        vertexArray.AddBuffer(vertexBuffer, layout);
        
        const indexBuffer = new IndexBuffer(indices, 6);
        const shader = new Shader("basic.shader");
        const renderer = new Renderer();

        const texture = new Texture("images.jpg");
        texture.Bind(0);
        shader.SetUniform1i("u_Texture", 0);

        //Draw
        renderer.Clear(); 
        
        shader.Bind();
        // shader.SetUniform4f("u_Color", [1, 0, 0, 1]);
        
        renderer.Draw(vertexArray, indexBuffer, shader);
    }
}