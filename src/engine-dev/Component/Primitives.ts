import Mesh, { MeshData } from "../Rendering/Mesh";
import { Screen } from "luna-engine";

export enum PrimitiveType
{
    PLANE,
    ROUNDED_PLANE,
    CUBE,
    LINE
}

export default class Primitives
{
    public static Create(type: PrimitiveType, parameters: number[]): Mesh
    {
        let meshData: MeshData;
        
        switch(type)
        {
            case PrimitiveType.PLANE:
                break;
            case PrimitiveType.ROUNDED_PLANE:
                const vertices = this.CreateRoundedRectangle(parameters[0], parameters[1], parameters[2]);
                meshData = {
                    vertices: vertices,
                    indices: this.CreateIndices(parameters[2]),
                    colors: this.CreateColors(vertices.length),
                    calculateNormals: false
                }
                break;
            case PrimitiveType.CUBE:
                meshData = {
                    vertices: this.Cube(),
                    indices: this.CubeIndices(),
                    colors: null,
                    calculateNormals: true
                }
                break;
            // case PrimitiveType.LINE:
            //     meshData = {

            //     }
        }

        return new Mesh(meshData);
    }

    private static Cube(): number[]
    {
        return [
            // Front face
            -1.0 , -1.0,  1.0,          
            1.0 , -1.0,  1.0,           
            1.0 ,  1.0,  1.0,           
            -1.0 ,  1.0,  1.0,          

            // Back face
            -1.0 , -1.0, -1.0,          
            -1.0 ,  1.0, -1.0,          
            1.0 ,  1.0, -1.0,           
            1.0 , -1.0, -1.0,           

            // Top face
            -1.0 ,  1.0, -1.0,          
            -1.0 ,  1.0,  1.0,          
            1.0 ,  1.0,  1.0,           
            1.0 ,  1.0, -1.0,           

            // Bottom face
            -1.0 , -1.0, -1.0,          
            1.0 , -1.0, -1.0,           
            1.0 , -1.0,  1.0,           
            -1.0 , -1.0,  1.0,          

            // Right face
            1.0 , -1.0, -1.0,           
            1.0 ,  1.0, -1.0,           
            1.0 ,  1.0,  1.0,           
            1.0 , -1.0,  1.0,           

            // Left face
            -1.0 , -1.0, -1.0,          
            -1.0 , -1.0,  1.0,          
            -1.0 ,  1.0,  1.0,            
            -1.0 ,  1.0, -1.0,          

        ]
    }
    
    private static CubeIndices(): number[]
    {
        return [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
          ];
    }

    private static CreateRoundedRectangle(width: number, height: number, radius: number): number[]
    {
        width = (width - radius) / Screen.Width;
        height = (height - radius) / Screen.Height;

        const xOffset = radius / Screen.Width;
        const yOffset = radius / Screen.Height;

        let retValue = [
            //Main Box
            -width, -height, 0, 
             width, -height, 0, 
             width,  height, 0, 
            -width,  height, 0, 
            //Upper
            -width, -height + yOffset, 0,
             width, -height + yOffset, 0,
             width,  height + yOffset, 0,
            -width,  height + yOffset, 0,
            //lower
            -width, -height - yOffset, 0,
             width, -height - yOffset, 0,
             width,  height - yOffset, 0,
            -width,  height - yOffset, 0,
            //Right
            -width + xOffset, -height, 0,
             width + xOffset, -height, 0,
             width + xOffset,  height, 0,
            -width + xOffset,  height, 0,
            //Left
            -width - xOffset, -height, 0,
             width - xOffset, -height, 0,
             width - xOffset,  height, 0,
            -width - xOffset,  height, 0,
        ]

        const numPoints = Math.floor(radius / 10);

        const quadrants = [
            [width, height, 0],
            [-width, height, 0],
            [-width, -height, 0],
            [width, -height, 0]
        ]

        let toConcat = [];

        
        for (let i = 0; i < quadrants.length; ++i)
        {
            const currQuadrant = quadrants[i];
            
            toConcat = toConcat.concat(currQuadrant);
            
            for (let j = 0; j < numPoints + 1; ++j)
            {
                const angle = j * (Math.PI / 2) / numPoints + this.DegreeToRad(i * 90);
                const x = (Math.cos(angle) * radius/ Screen.Width);
                const y = (Math.sin(angle) * radius/ Screen.Height);
                
                toConcat = toConcat.concat([
                    x + currQuadrant[0],
                    y + currQuadrant[1],
                    0
                ]);
            }
        }
        
        retValue = retValue.concat(toConcat);

        return retValue;
    }

    private static CreateIndices(radius: number): number[]
    {
        const retValue = [
            //Center
            0,  1,  2, 
            0,  2,  3,   

            //Upper
            4, 5, 6,
            4, 6, 7,

            //Lower
            8, 9, 10,
            8, 10, 11,

            //Right
            12, 13, 14,
            12, 14, 15,

            //Left
            16, 17, 18,
            16, 18, 19,
        ];
        const numPoints = Math.floor(radius / 10);

        for (let j = 0; j < 4; j++)
        {
            const currIdx = retValue[retValue.length - 1] + 1;
            for (let i = 0; i < numPoints + 1; i++)
            {
                retValue.push(currIdx);
                retValue.push(currIdx + i);
                retValue.push(currIdx + (i + 1));
            }
        }

        return retValue;
    }

    private static CreateColors(length: number): number[]
    {
        let retVal = [];

        for(let i = 0; i < length; i++) 
        {
            retVal.push(0);
            retVal.push(0);
            retVal.push(0);
            retVal.push(0.5);
        }

        return retVal;
    }

    private static DegreeToRad(angle: number): number
    {
        return angle * Math.PI / 180;
    }
}