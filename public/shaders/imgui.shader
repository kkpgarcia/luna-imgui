#version 300 es

in vec4 a_Position;
in vec4 a_Color;

uniform mat4 u_Projection;
uniform mat4 u_Matrix;

out vec4 v_Color;

void main()
{
    gl_Position = u_Projection * u_Matrix * a_Position;//vec4((u_Matrix * vec3(a_Position, 1)).xy, 0, 1);
    v_Color = a_Color;
}
#vertex

#version 300 es

precision highp float;
in vec4 v_Color;


out vec4 out_Color;

void main() 
{
    out_Color = v_Color;
}
#fragment