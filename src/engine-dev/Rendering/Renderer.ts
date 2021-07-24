// import Services from "../Core/Service/Services";
import { Mat4x4, Services } from "luna-engine";
import Material from "./Material";
// import Shader from "./Shader";
import VertexArray from "./VertexArray";

//TODO: decide if it's a centralized renderer or
//      or derivable 
export default class Renderer
{
    constructor()
    {

    }

    /**
     * Gather data for the scene aka uniforms
     */
    public static Begin(viewProjectionMatrix: Mat4x4, worldMatrix: Mat4x4, transformMatrix: Mat4x4, material: Material): void
    {
        //TODO: Temp
        // shader.Bind();
        material.Bind();

        const worldInverseMatrix = Mat4x4.Inverse(worldMatrix);
        const worldInverseTransposeMatrix = Mat4x4.Transpose(worldInverseMatrix);
        const modelMatrix = Mat4x4.Multiply(worldMatrix, transformMatrix);
        const mvpMatrix = Mat4x4.Multiply(viewProjectionMatrix, modelMatrix);

        material.SetUniform("u_Matrix", mvpMatrix.ToArray());
        material.SetUniform("u_WorldInverseTranspose", worldInverseTransposeMatrix.ToArray());
    }

    /**
     * Function that checks what kind of object that needs to be rendered
     */
    public static Draw(vertexArray: VertexArray): void
    {
        const gl = Services.RenderingContext.gl;
        vertexArray.Bind();
        gl.drawElements(gl.TRIANGLES, vertexArray.indexBuffer.count, gl.UNSIGNED_SHORT, 0);
    }

    public static End(material: Material): void
    {
        //TODO: Temp
        material.Unbind();
    }

    public static SetClearColor(color: number[]): void
    {
        const gl = Services.RenderingContext.gl;
        gl.clearColor(color[0], color[1], color[2], color[3]);
    }

    public static Clear(): void
    {
        const gl = Services.RenderingContext.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}