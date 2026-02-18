#version 300 es
precision highp float;

in vec2 v_texCoord;
out vec4 fragColor;

uniform sampler2D u_backgroundTexture;
uniform vec2 u_resolution;
uniform vec2 u_panelSize;
uniform vec2 u_panelOffset;
uniform float u_blurRadius;
uniform float u_refractionStrength;
uniform float u_specularIntensity;
uniform float u_chromaticAberration;
uniform float u_tintOpacity;
uniform vec4 u_tintColor;
uniform vec2 u_lightPosition;
uniform float u_time;

// Simple hash for noise
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// 9-tap Gaussian blur
vec4 blur(sampler2D tex, vec2 uv, vec2 texelSize, float radius) {
  vec4 color = vec4(0.0);
  float total = 0.0;

  for (float x = -2.0; x <= 2.0; x += 1.0) {
    for (float y = -2.0; y <= 2.0; y += 1.0) {
      vec2 offset = vec2(x, y) * texelSize * radius;
      float weight = exp(-(x * x + y * y) / 4.5);
      color += texture(tex, uv + offset) * weight;
      total += weight;
    }
  }

  return color / total;
}

// Specular highlight based on panel edge proximity and light position
float specular(vec2 uv, vec2 lightPos) {
  // Edge proximity (stronger near edges)
  vec2 edgeDist = min(uv, 1.0 - uv);
  float edgeFactor = smoothstep(0.0, 0.15, min(edgeDist.x, edgeDist.y));
  float rimLight = 1.0 - edgeFactor;

  // Directional light
  vec2 toLight = normalize(lightPos - uv);
  float nDotL = max(dot(toLight, vec2(0.0, 1.0)), 0.0);

  // Combine
  return rimLight * 0.6 + nDotL * 0.4;
}

void main() {
  vec2 uv = v_texCoord;
  vec2 texelSize = 1.0 / u_resolution;

  // Map panel UV to background UV
  vec2 bgUV = (uv * u_panelSize + u_panelOffset) / u_resolution;

  // Displacement/refraction distortion
  float distortion = u_refractionStrength * 0.01;
  vec2 refractOffset = vec2(
    sin(uv.y * 12.0 + u_time * 0.5) * distortion,
    cos(uv.x * 12.0 + u_time * 0.5) * distortion
  );

  vec2 distortedUV = bgUV + refractOffset;

  // Chromatic aberration
  float chromatic = u_chromaticAberration * 0.002;
  vec4 blurred;
  if (chromatic > 0.0001) {
    float r = blur(u_backgroundTexture, distortedUV + vec2(chromatic, 0.0), texelSize, u_blurRadius).r;
    float g = blur(u_backgroundTexture, distortedUV, texelSize, u_blurRadius).g;
    float b = blur(u_backgroundTexture, distortedUV - vec2(chromatic, 0.0), texelSize, u_blurRadius).b;
    float a = blur(u_backgroundTexture, distortedUV, texelSize, u_blurRadius).a;
    blurred = vec4(r, g, b, a);
  } else {
    blurred = blur(u_backgroundTexture, distortedUV, texelSize, u_blurRadius);
  }

  // Apply tint
  vec4 tinted = mix(blurred, u_tintColor, u_tintOpacity);

  // Specular highlights
  float spec = specular(uv, u_lightPosition) * u_specularIntensity;
  tinted.rgb += vec3(spec);

  // Subtle noise to prevent banding
  float noise = hash(uv * u_resolution + u_time) * 0.01;
  tinted.rgb += noise;

  fragColor = vec4(tinted.rgb, 1.0);
}
