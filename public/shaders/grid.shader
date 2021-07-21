#version 300 es

layout(location = 0) in vec4 a_position;

uniform mat4 u_Matrix;

void main()
{
    gl_Position = u_Matrix * a_position;
}
#vertex

#version 300 es

precision mediump float;

uniform vec4 u_Color;

out vec4 o_Color;

void main()
{
    o_Color = u_Color;
}
#fragment