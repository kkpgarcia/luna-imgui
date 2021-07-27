import { Screen, Vector3 } from "luna-engine";

import Shader from "./Rendering/Shader";
// import Renderer from "./Rendering/Renderer";
import Transform from "./Component/Transform";
// import Mesh from "./engine-dev/Rendering/Mesh";
import Primitives, { PrimitiveType } from "./Component/Primitives";
import Material from "./Rendering/Material";
import { IRenderable } from "src/Game";

export default class ImguiBox
{
    public renderable: IRenderable;

    constructor()
    {
        const radius = 50;
        const mesh = Primitives.Create(PrimitiveType.ROUNDED_PLANE, [800, 800, radius]);

        const shader = new Shader("imgui.shader");
        const material = new Material(shader);
        material.SetOrtographic(true);
        
        const transform = new Transform();

        transform.Translate(new Vector3(Screen.Width/2, Screen.Height/2));
        transform.Scale(new Vector3(1000, -1000, 0));

        this.renderable = {
            transform: transform,
            material: material,
            mesh: mesh
        };
    }
}