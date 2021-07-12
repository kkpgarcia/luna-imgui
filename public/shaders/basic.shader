#version 300 es
in vec4 a_position;
    
void main() 
{
    gl_Position = a_position;    
}
#vertex

#version 300 es
precision highp float;

uniform vec4 u_Color;

out vec4 color;

void main() 
{
    color = u_Color;   
}
#fragment