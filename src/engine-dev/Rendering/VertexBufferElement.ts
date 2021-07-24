// import Services from "../Core/Service/Services";
import { Services } from "luna-engine";

export default class VertexBufferElement
{
    public type: number;
    public count: number;
    public normalized: boolean;

    public static GetSizeOfType(type: number): number
    {
        const gl = Services.RenderingContext.gl;

        switch(type)
        {
            case gl.FLOAT:
                return 4;
            case gl.UNSIGNED_INT:
                return 4;
            case gl.UNSIGNED_BYTE:
                return 1;
            default:
                return 0;
        }
    }
}