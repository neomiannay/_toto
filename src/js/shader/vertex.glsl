uniform float time;
uniform vec2 pixels;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vScreenSpace;

float PI = 3.141592653689793238;


void main() {
    // Varyings
    vUv = uv;
    vPosition = position;
    vNormal = normalize(mat3(modelMatrix) * normal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);

    // Screen space
    vScreenSpace = gl_Position.xy / gl_Position.w; // w is to normalize the position
}