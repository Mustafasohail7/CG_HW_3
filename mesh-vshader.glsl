#version 300 es

in vec3 vPosition; // vertices in js is connected to vPosition here
in vec3 vColors; // colors in js is connected to vColors here
uniform float scale[3];
uniform float translate[3];
uniform float rotate[3];
//out vec3 aColor; // this will be used to pass colors to the fragment shader
    
void main()
{
    vec3 cost = cos(vec3(rotate[0],rotate[1],rotate[2]));
    vec3 sint = sin(vec3(rotate[0],rotate[1],rotate[2]));

    mat4 rotateX = mat4(1.0f, 0.0f, 0.0f, 0.0f,
                        0.0f, cost[0], sint[0], 0.0f,
                        0.0f, -sint[0], cost[0], 0.0f,
                        0.0f, 0.0f, 0.0f, 1.0f);

    mat4 rotateY = mat4(cost[1], 0.0f, -sint[1], 0.0f,
                        0.0f, 1.0f, 0.0f, 0.0f,
                        sint[1], 0.0f, cost[1], 0.0f,
                        0.0f, 0.0f, 0.0f, 1.0f);
    
    mat4 rotateZ = mat4(cost[2], sint[2], 0.0f, 0.0f,
                        -sint[2], cost[2], 0.0f, 0.0f,
                        0.0f, 0.0f, 1.0f, 0.0f,
                        0.0f, 0.0f, 0.0f, 1.0f);
    // translating the vertices
    vec3 translatedCoord = vec3(vPosition.x-translate[0],vPosition.y-translate[1],vPosition.z-translate[2]);
    // scaling the vertices
    vec3 scaledCoord = vec3(translatedCoord.x*scale[0],translatedCoord.y*scale[1],translatedCoord.z*scale[2]);
    // applying rotation transformation to the vertices
    gl_Position = rotateZ * rotateY * rotateX * vec4(scaledCoord, 1.0f); // assigning position as it is, i.e. without changing any value
    //aColor = vColors; // passing colors to fragment shaders
    gl_PointSize = 10.0; // Point size on screen. Optional.
}