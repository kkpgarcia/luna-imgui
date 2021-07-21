#version 300 es

layout(location = 0) in vec4 a_position;
layout(location = 1) in vec3 a_normal;
// in vec2 a_texcoord;
uniform mat4 u_Matrix;
uniform mat4 u_WorldInverseTranspose;
// uniform mat4 u_WorldViewProjection;

// out vec2 v_texcoord;
out vec3 v_normal;

void main() 
{
    gl_Position = u_Matrix * a_position;
    v_normal = mat3(u_WorldInverseTranspose) * a_normal;
    // v_texcoord = a_texcoord;    
}
#vertex

#version 300 es

precision highp float;

// in vec2 v_texcoord;
in vec3 v_normal;

uniform vec4 u_Color;
uniform vec3 u_ReverseLightDirection;
// uniform sampler2D u_Texture;

out vec4 color;

void main() 
{
    // color = u_Color;
    // color = texture(u_Texture, v_texcoord);

    vec3 normal = normalize(v_normal);
    float light = dot(normal, u_ReverseLightDirection);

    color = u_Color;
    color.rgb *= light;
}
#fragment