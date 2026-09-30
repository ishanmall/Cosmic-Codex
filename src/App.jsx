import React, { useEffect, useMemo, useRef, useState } from 'react';
import './index.css';

/* ------------------------------------------------------------------ */
/* Shaders - Pass 1: Kerr RK4 Geodesics & Radiative Transfer          */
/* ------------------------------------------------------------------ */

const VERTEX_SRC = `#version 300 es
in vec2 p;
out vec2 vUv;
void main(){ 
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0); 
}
`;

const RAYTRACE_FRAG = `#version 300 es
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform float uA;          
uniform float uTheta0;     
uniform float uPhi0;       
uniform float uR0;         
uniform float uScale;      
uniform float uRplus;      
uniform float uIsco;       
uniform float uPhoton;

uniform float uMode;       
uniform float uDisk;       
uniform float uDoppler;    
uniform float uThermal;    
uniform float uTurbulence; 
uniform float uSpeed;      
uniform float uAnimate;
uniform float uRoll;
uniform int   uDiagnostic;

uniform sampler2D uFlux;
uniform float uTpeak;

out vec4 fragColor;

const int   MAXSTEPS = 1200;
const float PI = 3.14159265359;

/* ==========================================================
   1. HAMILTONIAN KERR METRIC FORMULAS (μ = cos θ)
   ========================================================== */

float Sigma(float r, float a, float mu) {
    return r*r + a*a*mu*mu;
}

float Delta(float r, float a) {
    return r*r - 2.0*r + a*a;
}

float dR_pot(float r, float a, float L, float Q){
  return 4.0*r*r*r + 2.0*r*(a*a - L*L - Q) + 2.0*((L - a)*(L - a) + Q);
}

float dMu_pot(float mu, float a, float L, float Q){
  return mu * (a*a - L*L - Q - 2.0*a*a*mu*mu);
}

float dPhi_dLambda(float r, float mu, float a, float L) {
    float sin2 = max(1.0 - mu*mu, 1e-4);
    float Del = max(Delta(r, a), 1e-4); 
    float Pm = r*r + a*a - a*L;
    return -(a*Pm/Del - a + L/sin2);
}

float dT_dLambda(float r, float mu, float a, float L) {
    float Del = max(Delta(r, a), 1e-4);
    float Sig = Sigma(r, a, mu);
    return 1.0 + (2.0*r*(r*r+a*a) - 2.0*a*r*L) / (Sig * Del);
}

vec4 get_deriv(vec4 state, float a, float L, float Q) {
    float accel_r = 0.5 * dR_pot(state.x, a, L, Q);
    float accel_mu = dMu_pot(state.y, a, L, Q); 
    return vec4(state.z, state.w, accel_r, accel_mu);
}

/* ==========================================================
   NOISE & FLUID DYNAMICS (Only for Physical Mode/Sky)
   ========================================================== */
float hash13(vec3 p3){ p3 = fract(p3*.1031); p3 += dot(p3, p3.zyx+31.32); return fract((p3.x+p3.y)*p3.z); }

float vnoise3(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(
        mix(mix(hash13(i+vec3(0,0,0)), hash13(i+vec3(1,0,0)), f.x),
            mix(hash13(i+vec3(0,1,0)), hash13(i+vec3(1,1,0)), f.x), f.y),
        mix(mix(hash13(i+vec3(0,0,1)), hash13(i+vec3(1,0,1)), f.x),
            mix(hash13(i+vec3(0,1,1)), hash13(i+vec3(1,1,1)), f.x), f.y),
    f.z);
}

float fbm3(vec3 p){
  float s = 0.0, a = 0.5;
  for(int i=0;i<4;i++){ s += a*vnoise3(p); p = p*2.03 + 7.1; a *= 0.5; }
  return s;
}

vec3 blackbody(float T){
  float t = T/100.0;
  float r = t <= 66.0 ? 1.0 : clamp(1.292936*pow(max(t-60.0,1.0), -0.1332047592), 0.0, 1.0);
  float g = t <= 66.0 ? clamp(0.390081579*log(max(t,1.0)) - 0.631841444, 0.0, 1.0)
                      : clamp(1.129890861*pow(max(t-60.0,1.0), -0.0755148492), 0.0, 1.0);
  float b = t >= 66.0 ? 1.0 : (t <= 19.0 ? 0.0 : clamp(0.543206789*log(max(t-10.0,1.0)) - 1.196254089, 0.0, 1.0));
  return vec3(r,g,b);
}

vec3 lensedSky(float mu, float ph, float mode){
  float sin_th = sqrt(max(1.0 - mu*mu, 0.0));
  vec3 d = vec3(sin_th*cos(ph), mu, sin_th*sin(ph));
  
  float mw = exp(-pow(abs(d.y)*3.5, 2.0)) * vnoise3(d * 8.0);
  vec3 c = vec3(0.04, 0.06, 0.12) * mw * (mode > 0.5 ? 0.12 : 0.6);
  
  for(int k=0;k<2;k++){
    float S = 70.0 + float(k)*35.0;
    vec3 p = d*S, id = floor(p), f = fract(p) - 0.5;
    float h = hash13(id + float(k)*17.0);
    if(h > 0.988){ 
      vec3 off = vec3(hash13(id+1.7), hash13(id+3.1), hash13(id+5.3)) - 0.5;
      float b = smoothstep(0.18, 0.02, length(f - off*0.6));
      vec3 starCol = mix(vec3(1.0, 0.75, 0.55), vec3(0.65, 0.85, 1.0), hash13(id+9.9));
      c += starCol * b * (mode > 0.5 ? 0.2 : 0.5);
    }
  }
  return c;
}

vec3 inferno(float t) {
    return mix(vec3(0,0,0), mix(vec3(0.8,0.1,0.2), mix(vec3(0.9,0.5,0.1), vec3(1,1,0.8), t), t), t);
}

void main(){
  vec3 totalAccumulatedLight = vec3(0.0);
  // 2x2 SSAA is always on for images to keep them smooth (unless in diagnostic map)
  int samples = (uDiagnostic > 0) ? 1 : 2;
  float fSamples = float(samples * samples);
  
  for(int dx=0; dx<2; dx++){
    if(dx >= samples) break;
    for(int dy=0; dy<2; dy++){
      if(dy >= samples) break;
      
      vec2 offset = vec2(float(dx), float(dy)) / float(samples) - 0.5;
      vec2 pp = (gl_FragCoord.xy + offset - 0.5*uRes)/uRes.y * 2.0 * uScale;
      
      if (uRoll > 0.5) pp = -pp;
      float alpha_ray = pp.x;
      if (abs(alpha_ray) < 1e-3) alpha_ray = 1e-3; 
      float beta_ray  = pp.y;
      float a = uA;
      
      float s0 = sin(uTheta0);
      float c0 = cos(uTheta0);

      float L = -alpha_ray * s0;
      float Q = beta_ray*beta_ray + c0*c0*(alpha_ray*alpha_ray - a*a);

      float K_val = (L - a)*(L - a) + Q;
      float invR = 1.0 / uR0;
      float invR2 = invR * invR;
      float R_div_r4 = 1.0 + (a*a - L*L - Q)*invR2 + (2.0*K_val)*invR2*invR - (a*a*Q)*invR2*invR2;
      float vr_init = -(uR0 * uR0) * sqrt(max(R_div_r4, 0.0));
      
      float mu0 = c0;
      float v_mu_init = beta_ray * s0; 
      vec4 Y = vec4(uR0, mu0, vr_init, v_mu_init);
      float ph = uPhi0;
      float t_coord = 0.0;

      vec3  acc = vec3(0.0);
      float T = 1.0;
      bool escaped = false;
      bool captured = false;
      int  diskCrossings = 0;
      
      float rOut = (uMode > 0.5) ? 28.0 : 40.0;

      for(int i=0; i<MAXSTEPS; i++){
        float d_lambda = clamp(0.035 * Y.x, 0.012, 1.6) / Sigma(Y.x, a, Y.y);
        d_lambda *= mix(0.35, 1.0, smoothstep(0.02, 0.3, abs(Y.y)));
        
        vec4 k1 = get_deriv(Y, a, L, Q);
        vec4 k2 = get_deriv(Y + 0.5 * d_lambda * k1, a, L, Q);
        vec4 k3 = get_deriv(Y + 0.5 * d_lambda * k2, a, L, Q);
        vec4 k4 = get_deriv(Y + d_lambda * k3, a, L, Q);
        
        vec4 Y_next = Y + (d_lambda / 6.0) * (k1 + 2.0*k2 + 2.0*k3 + k4);
        
        if (Y_next.y > 1.0)  { Y_next.y = 1.0;  Y_next.w *= -1.0; }
        if (Y_next.y < -1.0) { Y_next.y = -1.0; Y_next.w *= -1.0; }

        float rm = 0.5 * (Y.x + Y_next.x);
        float mum = 0.5 * (Y.y + Y_next.y);
        
        float dph = dPhi_dLambda(rm, mum, a, L) * d_lambda;
        dph = clamp(dph, -2.0, 2.0); // Safe bound preventing NaN spikes
        
        float dt = dT_dLambda(rm, mum, a, L) * d_lambda;
        t_coord += dt;

        /* ==========================================================
           RADIATIVE TRANSFER & HIGHER ORDER IMAGES (Optical Depth)
           ========================================================== */
        if(uDisk > 0.5 && T > 0.001){
          bool crossedDisk = (Y.y) * (Y_next.y) <= 0.0; 

          if(crossedDisk){
            diskCrossings++;
            float diff = Y_next.y - Y.y;
            float f = (abs(diff) > 1e-6) ? (0.0 - Y.y) / diff : 0.5;
            float rc = mix(Y.x, Y_next.x, f);
            float innerEdge = max(uRplus + 0.01, uIsco);

            if(rc >= innerEdge && rc < rOut){
              
              float SigD = Sigma(rc, a, 0.0);
              float gtt = -(1.0 - 2.0*rc/SigD);
              float gtp = -2.0*a*rc/SigD;
              float gpp = (rc*rc + a*a + 2.0*a*a*rc/SigD);
              
              float Omega = 1.0 / (pow(rc, 1.5) + a);
              float ut = inversesqrt(max(-(gtt + 2.0*gtp*Omega + gpp*Omega*Omega), 1e-5));
              float g_factor = max(1.0 / (ut * (1.0 - Omega * L)), 0.001);
              
              float phi_pattern = (ph + f*dph) - Omega * uTime * uSpeed;
              vec3 q3 = vec3(rc * 2.0, cos(phi_pattern)*12.0, sin(phi_pattern)*12.0);
              
              vec3 emission = vec3(0.0);
              float dtau = 0.0;

              float u_nt  = sqrt(clamp((rc - uIsco) / (rOut - uIsco), 0.0, 1.0));
              float Fn = texture(uFlux, vec2(u_nt, 0.5)).r;
              float T_rest = uTpeak * pow(max(Fn, 0.0), 0.25);
              float T_obs = T_rest * g_factor;

              if (uDiagnostic == 1) { 
                  emission = inferno(clamp(g_factor*0.6, 0.0, 1.0));
                  dtau = 100.0;
              } else if (uDiagnostic == 2) { 
                  emission = inferno(clamp(t_coord * 0.01, 0.0, 1.0));
                  dtau = 100.0;
              } else if (uDiagnostic == 3) { 
                  emission = inferno(clamp(T_obs / uTpeak, 0.0, 1.0));
                  dtau = 100.0;
              } else if (uMode > 0.5) { // CINEMATIC KERR 
                 
                 // Compressed Doppler to prevent white blobs
                 float gVisual = clamp(g_factor, 0.65, 1.45);
                 float beam = (uDoppler > 0.5) ? exp(2.4 * log(gVisual)) : 1.0;
                 
                 vec3 dopplerColor = mix(vec3(1.0, 0.55, 0.30), vec3(1.0, 0.98, 0.92), smoothstep(0.65, 1.35, gVisual));

                 // Smooth analytical spiral filaments (No fbm3 dots)
                 float shear = phi_pattern + 0.22 * log(max(rc / innerEdge, 1.0));
                 float filament = 0.5 + 0.5 * sin(shear * 9.0 + 1.15 * sin(shear * 2.0 + rc * 0.08));
                 float broad = 0.5 + 0.5 * sin(rc * 0.32 + sin(shear * 1.7));
                 
                 float density = 0.94;
                 if (uTurbulence > 0.5) {
                     float turbWeight = (diskCrossings == 1) ? 1.0 : (diskCrossings == 2 ? 0.35 : 0.0);
                     density = mix(0.90, 1.02, filament * 0.65 + broad * 0.35);
                     density = mix(1.0, density, turbWeight); 
                 }

                 vec3 coreC = vec3(1.0, 0.98, 0.94); 
                 vec3 midC  = vec3(1.0, 0.62, 0.20); 
                 vec3 edgeC = vec3(0.55, 0.10, 0.02); 
                 
                 float rNorm = clamp((rc - innerEdge) / (rOut - innerEdge), 0.0, 1.0);
                 vec3 baseColor = mix(coreC, midC, smoothstep(0.0, 0.28, rNorm));
                 baseColor = mix(baseColor, edgeC, smoothstep(0.28, 0.85, rNorm));
                 if (uDoppler > 0.5) baseColor *= mix(vec3(1.0), dopplerColor, 0.28); // Subtle color shift

                 float falloff = pow(innerEdge / rc, 1.75);
                 float intensity = falloff * 24.0;
                 
                 float fadeG = smoothstep(innerEdge, innerEdge + 0.25, rc) * (1.0 - smoothstep(rOut - 5.0, rOut, rc));

                 emission = baseColor * intensity * density * beam * fadeG;
                 dtau = clamp(density * fadeG * 0.65, 0.0, 0.65); // Rebalanced Optical depth
              } else { // PHYSICAL KERR
                 float turb = (uTurbulence > 0.5) ? 0.97 + 0.06 * fbm3(q3 * 0.7) : 1.0;
                 T_rest *= pow(turb, 0.25);
                 T_obs = T_rest * ((uDoppler > 0.5) ? g_factor : 1.0);
                 vec3 bb = (uThermal > 0.5) ? blackbody(max(T_obs, 1000.0)) : vec3(1.0, 0.9, 0.85);
                 
                 // Pure g^4 intensity preservation for physical mode
                 float I = pow(((uDoppler > 0.5) ? g_factor : 1.0), 4.0) * Fn * turb * 10.0;
                 float fade = smoothstep(innerEdge, innerEdge + 0.05, rc) * (1.0 - smoothstep(rOut - 3.0, rOut, rc));
                 
                 emission = bb * I;
                 dtau = fade * 2.0; // Smoother physical radiative transfer
              }

              float trans = exp(-dtau);
              acc += T * emission * (1.0 - trans);
              T *= trans;
            }
          }
        }

        Y = Y_next; 
        ph += dph;
        
        if(Y.x < uRplus + 0.001){ captured = true; break; }
        if(Y.x > uR0*1.01 && Y.z > 0.0){ escaped = true; break; } 
      }

      if (!escaped) captured = true;

      if(escaped && uDiagnostic == 0) {
          acc += T * lensedSky(Y.y, ph, uMode);
      }
      
      if (isnan(acc.x) || isinf(acc.x)) acc = vec3(0.0);
      totalAccumulatedLight += acc;
    }
  }
  
  fragColor = vec4(totalAccumulatedLight / fSamples, 1.0);
}
`;

/* ------------------------------------------------------------------ */
/* Shaders - Pass 2: Post-Processing (HDR Bloom + Optic Lens)         */
/* ------------------------------------------------------------------ */
const POST_FRAG = `#version 300 es
precision highp float;

in vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform float uMode;
uniform float uBloom;
uniform float uBloomK;
uniform float uExposure;
out vec4 fragColor;

vec3 halo(vec2 uv) {
    vec2 texel = 1.0 / uRes;
    vec3 sum = vec3(0.0);
    float wsum = 0.0;
    
    for (int i = 1; i <= 6; i++) {
        float lod = float(i);
        float radius = exp2(lod) * 1.35;
        float w = 1.0 / (1.0 + 0.6 * lod);
        
        vec3 levelSum = textureLod(uTex, uv, lod).rgb * 2.0;
        for (int j = 0; j < 8; j++) {
            float a = float(j) * 0.785398 + float(i) * 2.39996;
            vec2 off = vec2(cos(a), sin(a)) * texel * radius;
            vec3 s = textureLod(uTex, uv + off, lod).rgb;
            float lum = dot(s, vec3(0.2126, 0.7152, 0.0722));
            levelSum += s * smoothstep(0.4, 1.6, lum);
        }
        levelSum /= 10.0;
        
        sum += levelSum * w;
        wsum += w;
    }
    return sum / wsum;
}

vec3 tightGlow(vec2 uv) {
    vec2 texel = 1.0 / uRes;
    vec3 b = vec3(0.0);
    for (float x = -2.0; x <= 2.0; x++)
    for (float y = -2.0; y <= 2.0; y++) {
        vec3 s = textureLod(uTex, uv + vec2(x, y) * 2.5 * texel, 0.0).rgb;
        float lum = dot(s, vec3(0.2126, 0.7152, 0.0722));
        b += s * smoothstep(1.0, 3.5, lum) * exp(-(x*x + y*y) * 0.35);
    }
    return b / 10.0;
}

void main(){
    vec3 col = textureLod(uTex, vUv, 0.0).rgb;

    if (uMode > 0.5 && uBloom > 0.5) {
        vec3 wide  = halo(vUv)      * vec3(1.0, 0.82, 0.72) * 0.55; 
        vec3 tight = tightGlow(vUv) * vec3(1.0, 0.90, 0.80) * 0.22;
        
        col += (wide + tight) * uBloomK;

        vec2 d = (vUv - 0.5) * vec2(1.0, 0.75);
        col += vec3(0.02, 0.015, 0.015) * (1.0 - smoothstep(0.0, 0.85, length(d) * 1.6));

        col *= uExposure; 
        col = (col * (2.51 * col + 0.03)) / (col * (2.43 * col + 0.59) + 0.14);
        col = clamp(col, 0.0, 1.0);

        vec2 v = vUv - 0.5;
        col *= 1.0 - dot(v, v) * 0.65; 
        col += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.008; 
    } else {
        col *= uExposure;
        col = 1.0 - exp(-col * 1.2);
    }
    col = pow(col, vec3(1.0 / 2.2));
    fragColor = vec4(col, 1.0);
}
`;

/* ------------------------------------------------------------------ */
/* Kerr helpers (M = 1)                                               */
/* ------------------------------------------------------------------ */
const rPlusOf = (a) => 1 + Math.sqrt(Math.max(0, 1 - a * a));
function iscoOf(a) {
  const z1 = 1 + Math.cbrt(1 - a * a) * (Math.cbrt(1 + a) + Math.cbrt(1 - a));
  const z2 = Math.sqrt(3 * a * a + z1 * z1);
  return 3 + z2 - Math.sqrt((3 - z1) * (3 + z1 + 2 * z2));
}
const photonOrbitOf = (a) => 2 * (1 + Math.cos((2 / 3) * Math.acos(-a)));

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const DISK_RMAX = 40;
function buildFluxLUT(a, N = 512) {
  const risco = iscoOf(a);
  const E  = (r) => { const s = Math.sqrt(r); return (r*s - 2*s + a) / (Math.pow(r, 0.75) * Math.sqrt(r*s - 3*s + 2*a)); };
  const Lz = (r) => { const s = Math.sqrt(r); return (r*r - 2*a*s + a*a) / (Math.pow(r, 0.75) * Math.sqrt(r*s - 3*s + 2*a)); };
  const Om = (r) => 1 / (Math.pow(r, 1.5) + a);
  const h = 1e-4;
  const F = new Float32Array(N);
  let I = 0, prevR = 0, prevV = 0, maxF = 0;
  for (let i = 0; i < N; i++) {
    const uu = i / (N - 1);
    const r = risco + (DISK_RMAX - risco) * uu * uu;
    const dL = (Lz(r + h) - Lz(r - h)) / (2 * h);
    const v = (E(r) - Om(r) * Lz(r)) * dL;
    if (i > 0) I += 0.5 * (prevV + v) * (r - prevR);
    prevR = r; prevV = v;
    const dO = (Om(r + h) - Om(r - h)) / (2 * h);
    const f = Math.max(0, (-dO / Math.pow(E(r) - Om(r) * Lz(r), 2)) * I / r);
    F[i] = f; if (f > maxF) maxF = f;
  }
  const data = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) data[i * 4] = F[i] / (maxF || 1);
  return data;
}

/* ------------------------------------------------------------------ */
/* WebGL2 Two-Pass HDR Setup                                          */
/* ------------------------------------------------------------------ */
function compile(gl, type, src, name = 'shader') {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`${name}: ${gl.getShaderInfoLog(shader)}`);
  }
  return shader;
}

function createRenderer(gl) {
  gl.getExtension('EXT_color_buffer_float'); 

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SRC, 'Vertex Shader');
  const fsRay = compile(gl, gl.FRAGMENT_SHADER, RAYTRACE_FRAG, 'Kerr Raytrace Shader');
  const fsPost = compile(gl, gl.FRAGMENT_SHADER, POST_FRAG, 'Post Processing Shader');
  
  const progRay = gl.createProgram();
  gl.attachShader(progRay, vs); gl.attachShader(progRay, fsRay); gl.linkProgram(progRay);
  
  const progPost = gl.createProgram();
  gl.attachShader(progPost, vs); gl.attachShader(progPost, fsPost); gl.linkProgram(progPost);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);

  const fbo = gl.createFramebuffer();
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, 2, 2, 0, gl.RGBA, gl.HALF_FLOAT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

  const fluxTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, fluxTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  let lutSpin = -1;

  const rayLocs = {};
  ['uRes','uTime','uA','uTheta0','uPhi0','uR0','uScale','uRplus','uIsco','uPhoton',
   'uMode','uDisk','uDoppler','uThermal','uTurbulence','uSpeed','uDiagnostic',
   'uAnimate','uRoll'].forEach(n => rayLocs[n] = gl.getUniformLocation(progRay, n));
  
  const postLocs = {
    uRes: gl.getUniformLocation(progPost, 'uRes'),
    uTex: gl.getUniformLocation(progPost, 'uTex'),
    uMode: gl.getUniformLocation(progPost, 'uMode'),
    uBloom: gl.getUniformLocation(progPost, 'uBloom'),
    uBloomK: gl.getUniformLocation(progPost, 'uBloomK'),
    uExposure: gl.getUniformLocation(progPost, 'uExposure'),
  };

  return {
    resize(width, height) {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.HALF_FLOAT, null);
    },
    draw(width, height, time, p, c) {
      gl.viewport(0, 0, width, height);

      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.useProgram(progRay);

      if (p.spin !== lutSpin) {
        const lut = buildFluxLUT(p.spin);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, fluxTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, lut.length / 4, 1, 0, gl.RGBA, gl.FLOAT, lut);
        lutSpin = p.spin;
      }
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, fluxTex);
      gl.uniform1i(gl.getUniformLocation(progRay, 'uFlux'), 1);
      gl.uniform1f(gl.getUniformLocation(progRay, 'uTpeak'), 30000);
      gl.activeTexture(gl.TEXTURE0);
      
      const locP1 = gl.getAttribLocation(progRay, 'p');
      gl.enableVertexAttribArray(locP1);
      gl.vertexAttribPointer(locP1, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(rayLocs.uRes, width, height);
      gl.uniform1f(rayLocs.uTime, time);
      gl.uniform1f(rayLocs.uA, p.spin);
      
      const inc = ((p.inclination % 360) + 360) % 360;
      const flip = inc > 180;
      const th = clamp(flip ? 360 - inc : inc, 1.5, 178.5);
      
      gl.uniform1f(rayLocs.uTheta0, (th * Math.PI) / 180);
      gl.uniform1f(rayLocs.uPhi0, ((p.azimuth + (flip ? 180 : 0)) * Math.PI) / 180);
      gl.uniform1f(rayLocs.uRoll, flip ? 1 : 0);
      gl.uniform1f(rayLocs.uR0, 150); 
      
      gl.uniform1f(rayLocs.uScale, p.fov);
      gl.uniform1f(rayLocs.uRplus, rPlusOf(p.spin));
      gl.uniform1f(rayLocs.uIsco, iscoOf(p.spin));
      gl.uniform1f(rayLocs.uPhoton, photonOrbitOf(p.spin));
      gl.uniform1f(rayLocs.uMode, p.mode === 'cinematic' ? 1 : 0);
      gl.uniform1f(rayLocs.uDisk, c.disk ? 1 : 0);
      gl.uniform1f(rayLocs.uDoppler, c.doppler ? 1 : 0);
      gl.uniform1f(rayLocs.uThermal, c.thermal ? 1 : 0);
      gl.uniform1f(rayLocs.uTurbulence, c.turbulence ? 1 : 0);
      gl.uniform1f(rayLocs.uSpeed, p.diskSpeed); 
      gl.uniform1f(rayLocs.uAnimate, p.animate ? 1 : 0);
      
      let diagMode = 0;
      if(p.diagnostic === 'gfactor') diagMode = 1;
      else if(p.diagnostic === 'time') diagMode = 2;
      else if(p.diagnostic === 'temp') diagMode = 3;
      gl.uniform1i(rayLocs.uDiagnostic, diagMode);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.generateMipmap(gl.TEXTURE_2D);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null); 
      gl.useProgram(progPost);
      const locP2 = gl.getAttribLocation(progPost, 'p');
      gl.enableVertexAttribArray(locP2);
      gl.vertexAttribPointer(locP2, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(postLocs.uTex, 0);
      gl.uniform2f(postLocs.uRes, width, height);
      gl.uniform1f(postLocs.uMode, p.mode === 'cinematic' ? 1 : 0);
      gl.uniform1f(postLocs.uBloom, c.bloom ? 1 : 0);
      gl.uniform1f(postLocs.uBloomK, clamp(14 / p.fov, 0.2, 1));
      gl.uniform1f(postLocs.uExposure, p.exposure);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      gl.deleteBuffer(buffer);
      gl.deleteTexture(tex);
      gl.deleteTexture(fluxTex);
      gl.deleteFramebuffer(fbo);
      gl.deleteProgram(progRay);
      gl.deleteProgram(progPost);
    },
  };
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function App() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [activeTab, setActiveTab] = useState('controls');
  const [panelOpen, setPanelOpen] = useState(true);

  const [params, setParams] = useState({
    mode: 'cinematic',
    spin: 0.998,
    inclination: 87, 
    azimuth: 0,
    fov: 13.0,       
    resolution: 0.85, // Updated default resolution 
    diskSpeed: 0.3,
    exposure: 1.1,
    animate: true,
    diagnostic: 'none'
  });

  const [cinematicParams, setCinematicParams] = useState({
    disk: true,
    doppler: false,
    thermal: true,
    turbulence: true,
    bloom: true,
  });
  
  const [massExp, setMassExp] = useState(0); 

  const [error, setError] = useState(null);
  const [fps, setFps] = useState(0);

  const paramsRef = useRef(params);
  const cinParamsRef = useRef(cinematicParams);
  const dirtyRef = useRef(true);
  
  useEffect(() => {
    paramsRef.current = params;
    cinParamsRef.current = cinematicParams;
    dirtyRef.current = true;
  }, [params, cinematicParams]);

  const set = (key) => (value) => setParams((p) => ({ ...p, [key]: value }));
  const setCin = (key) => (value) => setCinematicParams((p) => ({ ...p, [key]: value }));

  const physics = useMemo(() => {
    const a = params.spin;
    const M_sun = Math.pow(10, massExp); 
    const c = 299792458;
    const G = 6.6743e-11; 
    const M_kg = M_sun * 1.988e30;
    const r_g = (G * M_kg) / (c * c);
    
    const rPlus = rPlusOf(a);
    const r_mb = 2 * (1 - a/2 + Math.sqrt(Math.max(0, 1 - a)));
    const isco = iscoOf(a);
    const photon = photonOrbitOf(a);
    
    const T_H_base = 6.169e-8 / M_sun; 
    const root = Math.sqrt(Math.max(0, 1 - a * a));
    const hawkingTemp = T_H_base * (2 * root / (1 + root));
    
    const root_isco = Math.sqrt(isco);
    const E_isco = (isco*isco - 2*isco + a*root_isco) / (isco * Math.sqrt(isco*isco - 3*isco + 2*a*root_isco));
    const L_isco = (isco*isco - 2*a*root_isco + a*a) / (Math.pow(isco, 0.75) * Math.sqrt(Math.pow(isco, 1.5) - 3*root_isco + 2*a));
    const Omega_isco = 1 / (Math.pow(isco, 1.5) + a);
    
    const efficiency = 1 - E_isco;
    const penroseExt = 1 - Math.sqrt((1 + root)/2);
    
    const horizonHz = (a * c) / (2 * r_g * (1 + root));
    
    const fd_isco = (2 * a * isco) / (Math.pow(isco, 4) + a*a*isco*isco + 2*a*a*isco);

    return {
      rPlus, r_mb, isco, photon, M_sun, r_g,
      hawkingTemp, efficiency, penroseExt, horizonHz, E_isco, L_isco, Omega_isco, fd_isco
    };
  }, [params.spin, massExp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    let renderer = null;
    let raf = 0;
    let disposed = false;
    let frames = 0;
    let lastFps = performance.now();
    const t0 = performance.now();

    const resize = () => {
      // Dynamic DPR scaling bounds performance slightly higher on dense screens
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * paramsRef.current.resolution;
      const w = Math.max(2, Math.floor(container.clientWidth * dpr));
      const h = Math.max(2, Math.floor(container.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        if(renderer) renderer.resize(w, h);
      }
      dirtyRef.current = true;
    };

    const setup = () => {
      const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
      if (!gl) {
        setError('WebGL2 is required. Try a newer browser.');
        return;
      }
      try {
        renderer = createRenderer(gl);
        renderer.resize(canvas.width || 2, canvas.height || 2);
        setError(null);
      } catch (e) {
        setError(e.message);
      }
    };

    const frame = () => {
      if (disposed) return;
      const p = paramsRef.current;
      const c = cinParamsRef.current;
      if (renderer && (p.animate || dirtyRef.current)) {
        resize();
        renderer.draw(canvas.width, canvas.height, (performance.now() - t0) / 1000, p, c);
        dirtyRef.current = false;
        frames += 1;
        const now = performance.now();
        if (now - lastFps > 1000) {
          setFps(Math.round((frames * 1000) / (now - lastFps)));
          frames = 0;
          lastFps = now;
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const onLost = (e) => { e.preventDefault(); renderer = null; };
    const onRestored = () => setup();

    let last = null;
    const onDown = (e) => { last = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); };
    const onMove = (e) => {
      if (!last) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      
      setParams((p) => {
        let newInc = p.inclination + dy * 0.25;
        newInc = (newInc % 360 + 360) % 360; 
        return {
          ...p,
          inclination: newInc,
          azimuth: (p.azimuth - dx * 0.4 + 360) % 360,
        };
      });
    };
    const onUp = () => { last = null; };
    const onWheel = (e) => {
      e.preventDefault();
      setParams((p) => ({ ...p, fov: clamp(p.fov * Math.exp(e.deltaY * 0.001), 6, 28) }));
    };

    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    setup();
    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('wheel', onWheel);
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="kerr-root">
      <canvas ref={canvasRef} className="kerr-canvas" aria-label="Ray-traced Kerr black hole" />

      {error && <div className="kerr-error">{error}</div>}

      <div style={{ position: 'absolute', top: 14, left: 14, color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 'bold', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
        KERR RAY TRACE • {fps} FPS {params.diagnostic === 'none' && '• 2×2 SSAA ACTIVE'}
      </div>

      <button className="kerr-toggle" onClick={() => setPanelOpen((o) => !o)} aria-expanded={panelOpen}>
        {panelOpen ? 'Hide Panel' : 'Show Panel'}
      </button>

      {panelOpen && (
        <section className="kerr-panel" style={{ width: 'min(420px, calc(100% - 24px))' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8 }}>
            <button style={{ background: 'none', border: 'none', color: activeTab === 'controls' ? '#fff' : '#888', fontWeight: 'bold', cursor: 'pointer', padding: '4px 8px' }} onClick={() => setActiveTab('controls')}>Controls</button>
            <button style={{ background: 'none', border: 'none', color: activeTab === 'physics' ? '#fff' : '#888', fontWeight: 'bold', cursor: 'pointer', padding: '4px 8px' }} onClick={() => setActiveTab('physics')}>Physics</button>
            <button style={{ background: 'none', border: 'none', color: activeTab === 'documentation' ? '#fff' : '#888', fontWeight: 'bold', cursor: 'pointer', padding: '4px 8px' }} onClick={() => setActiveTab('documentation')}>Docs</button>
          </div>

          {activeTab === 'controls' && (
            <>
              <h1 className="kerr-title" style={{ fontSize: 18, marginBottom: 4 }}>BlackHoleSim</h1>
              <p className="kerr-sub" style={{ marginBottom: 16 }}>
                {params.mode === 'physical' 
                  ? 'Separated Kerr Null Geodesics • Radiative Transfer' 
                  : 'Interstellar-inspired • Kerr Lensing'}
              </p>

              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <label style={{ display: 'flex', gap: 6, cursor: 'pointer', fontWeight: params.mode === 'physical' ? 'bold' : 'normal', color: params.mode === 'physical' ? '#e67e22' : '#a08c78' }}>
                  <input type="radio" name="mode" checked={params.mode === 'physical'} onChange={() => set('mode')('physical')} />
                  Physical Kerr
                </label>
                <label style={{ display: 'flex', gap: 6, cursor: 'pointer', fontWeight: params.mode === 'cinematic' ? 'bold' : 'normal', color: params.mode === 'cinematic' ? '#e67e22' : '#a08c78' }}>
                  <input type="radio" name="mode" checked={params.mode === 'cinematic'} onChange={() => set('mode')('cinematic')} />
                  Cinematic Kerr
                </label>
              </div>

              <Slider label="Spin a/M" value={params.spin} min={0} max={0.998} step={0.001} format={(v) => v.toFixed(3)} onChange={set('spin')} />
              <Slider label="Viewing inclination" value={params.inclination} min={0} max={360} step={0.5} format={(v) => v.toFixed(1) + '°'} onChange={set('inclination')} />
              <Slider label="Field of view (M)" value={params.fov} min={6} max={28} step={0.1} format={(v) => v.toFixed(1)} onChange={set('fov')} />
              <Slider label="Render resolution" value={params.resolution} min={0.25} max={1} step={0.05} format={(v) => Math.round(v * 100) + '%'} onChange={set('resolution')} />
              
              <div style={{ marginTop: 8, marginBottom: 16 }}>
                <Check label="Animation ON" checked={params.animate} onChange={set('animate')} />
              </div>

              {params.mode === 'cinematic' && (
                <div style={{ padding: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 6, marginBottom: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="kerr-checks" style={{ margin: '0 0 12px 0' }}>
                    <Check label="Disk emission" checked={cinematicParams.disk} onChange={setCin('disk')} />
                    <Check label="Relativistic Doppler" checked={cinematicParams.doppler} onChange={setCin('doppler')} />
                    <Check label="Thermal emission" checked={cinematicParams.thermal} onChange={setCin('thermal')} />
                    <Check label="Turbulence" checked={cinematicParams.turbulence} onChange={setCin('turbulence')} />
                    <Check label="Cinematic Bloom" checked={cinematicParams.bloom} onChange={setCin('bloom')} />
                  </div>
                  <Slider label="Exposure" value={params.exposure} min={0.1} max={2} step={0.1} format={(v) => v.toFixed(1) + '×'} onChange={set('exposure')} />
                  <Slider label="Animation rate" value={params.diskSpeed} min={0} max={5} step={0.1} format={(v) => v.toFixed(1) + '×'} onChange={set('diskSpeed')} />
                </div>
              )}
            </>
          )}

          {activeTab === 'physics' && (
            <div style={{ fontSize: 13, color: '#d0c8c0', lineHeight: 1.5 }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                <label style={{ display: 'flex', gap: 6, cursor: 'pointer', color: params.diagnostic === 'none' ? '#fff' : '#888' }}>
                  <input type="radio" name="diagnostic" checked={params.diagnostic === 'none'} onChange={() => set('diagnostic')('none')} /> Image
                </label>
                <label style={{ display: 'flex', gap: 6, cursor: 'pointer', color: params.diagnostic === 'gfactor' ? '#fff' : '#888' }}>
                  <input type="radio" name="diagnostic" checked={params.diagnostic === 'gfactor'} onChange={() => set('diagnostic')('gfactor')} /> g-factor map
                </label>
                <label style={{ display: 'flex', gap: 6, cursor: 'pointer', color: params.diagnostic === 'temp' ? '#fff' : '#888' }}>
                  <input type="radio" name="diagnostic" checked={params.diagnostic === 'temp'} onChange={() => set('diagnostic')('temp')} /> Temp Map
                </label>
                <label style={{ display: 'flex', gap: 6, cursor: 'pointer', color: params.diagnostic === 'time' ? '#fff' : '#888' }}>
                  <input type="radio" name="diagnostic" checked={params.diagnostic === 'time'} onChange={() => set('diagnostic')('time')} /> Travel Time
                </label>
              </div>

              <div style={{ margin: '16px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}></div>

              <Slider label="System Mass (log₁₀ M/M_sun)" value={massExp} min={0} max={10} step={0.1} format={(v) => '10^' + v.toFixed(1)} onChange={setMassExp} />

              <dl className="kerr-stats" style={{ marginTop: 16 }}>
                <dt>Mass (M)</dt><dd>{physics.M_sun >= 1000 ? (physics.M_sun).toExponential(2) : physics.M_sun.toFixed(1)} M☉</dd>
                <dt>Gravitational Radius (r_g)</dt><dd>{physics.r_g >= 1e4 ? physics.r_g.toExponential(2) : physics.r_g.toFixed(0)} m</dd>
                <dt>Event Horizon (r₊)</dt><dd>{physics.rPlus.toFixed(3)} r_g</dd>
                <dt>Ergosphere Equator</dt><dd>2.000 r_g</dd>
                <dt>Prograde ISCO</dt><dd>{physics.isco.toFixed(3)} r_g</dd>
                <dt>Marginally Bound Orbit (r_mb)</dt><dd>{physics.r_mb.toFixed(3)} r_g</dd>
                <dt>Prograde Photon Orbit</dt><dd>{physics.photon.toFixed(3)} r_g</dd>
                <dt>E(r) at ISCO</dt><dd>{physics.E_isco.toFixed(4)}</dd>
                <dt>L(r) at ISCO</dt><dd>{physics.L_isco.toFixed(4)}</dd>
                <dt>Ω(r) at ISCO</dt><dd>{physics.Omega_isco.toFixed(4)}</dd>
                <dt>Frame-Dragging ω at ISCO</dt><dd>{physics.fd_isco.toFixed(4)}</dd>
                <dt>ISCO Radiative Efficiency</dt><dd>{(physics.efficiency * 100).toFixed(1)}%</dd>
                <dt>Hawking Temperature</dt><dd>{physics.hawkingTemp.toExponential(2)} K</dd>
              </dl>
            </div>
          )}

          {activeTab === 'documentation' && (
            <div style={{ fontSize: 13, color: '#c9b8a6', lineHeight: 1.5, maxHeight: '65vh', overflowY: 'auto', paddingRight: '8px' }}>
              <pre style={{ fontFamily: 'monospace', fontSize: 11.5, whiteSpace: 'pre-wrap', margin: 0 }}>{`I. Einstein / Kerr
  G_μν + Λ g_μν = (8πG/c⁴) T_μν     Vacuum: R_μν = 0
  Σ = r² + a²cos²θ
  Δ = r² − 2Mr + a²
  A = (r² + a²)² − a²Δ sin²θ

II. Horizons
  r_± = M ± √(M² − a²)
  Ergosphere: r_ergo = M + √(M² − a²cos²θ)

III. Separated Kerr Null Geodesics (Mino time λ)
  E = −p_t , L_z = p_φ , Q = Carter constant
  (dr/dλ)² = R(r) = (r² + a² − aL)² − Δ[(L − a)² + Q]
  (dμ/dλ)² = Θ(μ) = Q − a²μ² + L²μ²/(1−μ²) (μ=cosθ)
  Screen mapping:
  ξ = −α sin θ_o , η = β² + cos²θ_o (α² − a²)

IV. Kerr orbital mechanics
  Ω = 1 / (r^{3/2} + a)
  E = (r^{3/2} - 2r^{1/2} + a) / (r^{3/4} √(r^{3/2} - 3r^{1/2} + 2a))
  L_z = (r² - 2ar^{1/2} + a²) / (r^{3/4} √(r^{3/2} - 3r^{1/2} + 2a))
  
  ISCO bounds:
  Z_1 = 1 + (1−a²)^{1/3} [ (1+a)^{1/3} + (1−a)^{1/3} ]
  Z_2 = √(3a² + Z_1²)
  r_ISCO = 3 + Z_2 - √((3−Z_1)(3+Z_1+2Z_2))
  r_mb = 2 − a + 2√(1−a)
  r_ph = 2 [ 1 + cos(2/3 cos⁻¹(−a)) ]

V. Relativistic Transfer
  g = ν_obs / ν_em = 1 / [ u^t (1 − ΩL) ]
  Specific Intensity:  I_{ν,obs} = g³ I_{ν,em}
  Bolometric:          I_{bol,obs} = g⁴ I_{bol,em}
  Temperature:         T_obs = g T_em

VI. Frame dragging / Doppler
  ω = −g_{tφ} / g_{φφ}
  Ω_rel = Ω − ω

VII. Accretion Disk (Page-Thorne)
  F(r) = −(Ṁ / 4π√−g) [Ω_{,r} / (E−ΩL)²] ∫ (E−ΩL)L_{,r} dr
  T_eff = (F / σ_SB)^{1/4}

VIII. Radiative Transfer
  dI_ν / ds = −α_ν I_ν + j_ν
  τ_ν = ∫ α_ν ds
  I_out = I_in e^{-τ} + S (1 − e^{-τ})

11. Diagnostic / Error Methods
  Null condition: ε_null = |g_μν k^μ k^ν|
  Higher-order imaging: n = Δφ / 2π
  Caustic magnification: μ = 1 / |det J|
  Polarization transport: k^μ ∇_μ f^ν = 0
`}</pre>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small UI pieces                                                    */
/* ------------------------------------------------------------------ */

function Slider({ label, value, min, max, step, format, onChange }) {
  return (
    <div className="kerr-row">
      <label className="kerr-row-label">
        <span>{label}</span>
        <span className="kerr-value">{format(value)}</span>
      </label>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label className="kerr-check" style={{ minWidth: '45%' }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}