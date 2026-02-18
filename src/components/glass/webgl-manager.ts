/**
 * Shared WebGL 2.0 canvas manager for glass effects.
 * Manages a single WebGL context to avoid context exhaustion.
 */

const VERT_SOURCE = `#version 300 es
in vec2 a_position;
in vec2 a_texCoord;
out vec2 v_texCoord;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}`;

const FRAG_SOURCE = `#version 300 es
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

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec4 blur9(sampler2D tex, vec2 uv, vec2 texelSize, float radius) {
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

float specular(vec2 uv, vec2 lightPos) {
  vec2 edgeDist = min(uv, 1.0 - uv);
  float edgeFactor = smoothstep(0.0, 0.15, min(edgeDist.x, edgeDist.y));
  float rimLight = 1.0 - edgeFactor;
  vec2 toLight = normalize(lightPos - uv);
  float nDotL = max(dot(toLight, vec2(0.0, 1.0)), 0.0);
  return rimLight * 0.6 + nDotL * 0.4;
}

void main() {
  vec2 uv = v_texCoord;
  vec2 texelSize = 1.0 / u_resolution;
  vec2 bgUV = (uv * u_panelSize + u_panelOffset) / u_resolution;

  float distortion = u_refractionStrength * 0.01;
  vec2 refractOffset = vec2(
    sin(uv.y * 12.0 + u_time * 0.5) * distortion,
    cos(uv.x * 12.0 + u_time * 0.5) * distortion
  );
  vec2 distortedUV = bgUV + refractOffset;

  float chromatic = u_chromaticAberration * 0.002;
  vec4 blurred;
  if (chromatic > 0.0001) {
    float r = blur9(u_backgroundTexture, distortedUV + vec2(chromatic, 0.0), texelSize, u_blurRadius).r;
    float g = blur9(u_backgroundTexture, distortedUV, texelSize, u_blurRadius).g;
    float b = blur9(u_backgroundTexture, distortedUV - vec2(chromatic, 0.0), texelSize, u_blurRadius).b;
    float a = blur9(u_backgroundTexture, distortedUV, texelSize, u_blurRadius).a;
    blurred = vec4(r, g, b, a);
  } else {
    blurred = blur9(u_backgroundTexture, distortedUV, texelSize, u_blurRadius);
  }

  vec4 tinted = mix(blurred, u_tintColor, u_tintOpacity);
  float spec = specular(uv, u_lightPosition) * u_specularIntensity;
  tinted.rgb += vec3(spec);

  float noise = hash(uv * u_resolution + u_time) * 0.01;
  tinted.rgb += noise;

  fragColor = vec4(tinted.rgb, 1.0);
}`;

export interface GlassUniforms {
  panelSize: [number, number];
  panelOffset: [number, number];
  blurRadius: number;
  refractionStrength: number;
  specularIntensity: number;
  chromaticAberration: number;
  tintOpacity: number;
  tintColor: [number, number, number, number];
  lightPosition: [number, number];
}

export class WebGLGlassManager {
  private gl: WebGL2RenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private backgroundTexture: WebGLTexture | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private uniformLocations: Map<string, WebGLUniformLocation> = new Map();
  private _ready = false;
  private startTime = performance.now();

  get ready() {
    return this._ready;
  }

  init(canvas: HTMLCanvasElement): boolean {
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });

    if (!gl) {
      console.warn("WebGL 2.0 not available, falling back to CSS glass");
      return false;
    }

    this.gl = gl;

    // Compile shaders
    const vertShader = this.compileShader(gl.VERTEX_SHADER, VERT_SOURCE);
    const fragShader = this.compileShader(gl.FRAGMENT_SHADER, FRAG_SOURCE);

    if (!vertShader || !fragShader) return false;

    // Link program
    const program = gl.createProgram()!;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link failed:", gl.getProgramInfoLog(program));
      return false;
    }

    this.program = program;
    gl.useProgram(program);

    // Cache uniform locations
    const uniforms = [
      "u_backgroundTexture",
      "u_resolution",
      "u_panelSize",
      "u_panelOffset",
      "u_blurRadius",
      "u_refractionStrength",
      "u_specularIntensity",
      "u_chromaticAberration",
      "u_tintOpacity",
      "u_tintColor",
      "u_lightPosition",
      "u_time",
    ];
    for (const name of uniforms) {
      const loc = gl.getUniformLocation(program, name);
      if (loc) this.uniformLocations.set(name, loc);
    }

    // Full-screen quad
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    const texCoords = new Float32Array([
      0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1,
    ]);

    this.vao = gl.createVertexArray()!;
    gl.bindVertexArray(this.vao);

    const posBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const texBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    const texLoc = gl.getAttribLocation(program, "a_texCoord");
    gl.enableVertexAttribArray(texLoc);
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

    // Create background texture
    this.backgroundTexture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.backgroundTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    this._ready = true;
    return true;
  }

  updateBackgroundTexture(imageSource: TexImageSource) {
    if (!this.gl || !this.backgroundTexture) return;
    const gl = this.gl;

    gl.bindTexture(gl.TEXTURE_2D, this.backgroundTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      imageSource
    );
  }

  render(
    targetCanvas: HTMLCanvasElement,
    uniforms: GlassUniforms
  ) {
    if (!this.gl || !this.program || !this.vao) return;
    const gl = this.gl;

    // Resize to match target
    const w = targetCanvas.width;
    const h = targetCanvas.height;
    gl.canvas.width = w;
    gl.canvas.height = h;
    gl.viewport(0, 0, w, h);

    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);

    // Set uniforms
    const time = (performance.now() - this.startTime) / 1000;
    this.setUniform2f("u_resolution", w, h);
    this.setUniform2f("u_panelSize", ...uniforms.panelSize);
    this.setUniform2f("u_panelOffset", ...uniforms.panelOffset);
    this.setUniform1f("u_blurRadius", uniforms.blurRadius);
    this.setUniform1f("u_refractionStrength", uniforms.refractionStrength);
    this.setUniform1f("u_specularIntensity", uniforms.specularIntensity);
    this.setUniform1f("u_chromaticAberration", uniforms.chromaticAberration);
    this.setUniform1f("u_tintOpacity", uniforms.tintOpacity);
    this.setUniform4f("u_tintColor", ...uniforms.tintColor);
    this.setUniform2f("u_lightPosition", ...uniforms.lightPosition);
    this.setUniform1f("u_time", time);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.backgroundTexture);
    this.setUniform1i("u_backgroundTexture", 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Copy to target canvas
    const ctx = targetCanvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(gl.canvas as HTMLCanvasElement, 0, 0);
    }
  }

  destroy() {
    if (this.gl) {
      const ext = this.gl.getExtension("WEBGL_lose_context");
      if (ext) ext.loseContext();
    }
    this.gl = null;
    this.program = null;
    this._ready = false;
  }

  private compileShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;
    const gl = this.gl;
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  private setUniform1f(name: string, v: number) {
    const loc = this.uniformLocations.get(name);
    if (loc) this.gl!.uniform1f(loc, v);
  }

  private setUniform1i(name: string, v: number) {
    const loc = this.uniformLocations.get(name);
    if (loc) this.gl!.uniform1i(loc, v);
  }

  private setUniform2f(name: string, x: number, y: number) {
    const loc = this.uniformLocations.get(name);
    if (loc) this.gl!.uniform2f(loc, x, y);
  }

  private setUniform4f(name: string, x: number, y: number, z: number, w: number) {
    const loc = this.uniformLocations.get(name);
    if (loc) this.gl!.uniform4f(loc, x, y, z, w);
  }
}
