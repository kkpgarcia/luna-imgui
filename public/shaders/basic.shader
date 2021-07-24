#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

out vec2 v_texcoord;

void main() 
{
    gl_Position = a_position;
    v_texcoord = a_texcoord;    
}
#vertex

#version 300 es

precision highp float;

in vec2 v_texcoord;

uniform vec4 u_Color;
uniform sampler2D u_Texture;

out vec4 color;

void main() 
{
    color = texture(u_Texture, v_texcoord);   
}
#fragment