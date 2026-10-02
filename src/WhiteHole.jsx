import React, { useEffect, useMemo, useRef, useState } from 'react';

// ==========================================================
// STYLES & THEMES
// ==========================================================
const CSS_STYLES = `
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { width: 100vw; height: 100vh; overflow: hidden; background-color: #000; font-family: 'Courier New', Courier, monospace; color: white; }
input[type=range], button { cursor: pointer; }

:root {
  --primary: #e5e7eb; --primary-soft: rgba(229, 231, 235, 0.25); --ink: #ffffff; --ink-muted: #9ca3af;
  --panel: rgba(2, 4, 6, 0.85); --line: rgba(255, 255, 255, 0.15); --focus: #ffffff;
}

.theme-whitehole { --primary: #e5e7eb; --primary-soft: rgba(229, 231, 235, 0.25); --ink: #ffffff; --ink-muted: #9ca3af; --panel: rgba(2, 4, 6, 0.85); }

.astro-root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #000; color: var(--ink); transition: color 0.5s ease; }
.astro-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; touch-action: none; cursor: grab; }
.astro-canvas:active { cursor: grabbing; }

.astro-panel {
  position: absolute; right: 12px; bottom: 12px; width: min(420px, calc(100% - 24px)); max-height: calc(100% - 70px);
  overflow-y: auto; padding: 16px 20px; font-size: 12.5px; line-height: 1.5; background: var(--panel);
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); border: 1px solid var(--line);
  border-radius: 8px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); transition: background-color 0.5s ease, border-color 0.5s ease;
  scrollbar-width: thin; scrollbar-color: var(--primary-soft) transparent;
}
.astro-panel::-webkit-scrollbar { width: 6px; }
.astro-panel::-webkit-scrollbar-track { background: transparent; }
.astro-panel::-webkit-scrollbar-thumb { background-color: var(--primary-soft); border-radius: 4px; }

.astro-title { margin: 0 0 2px; font-size: 16px; font-weight: 700; letter-spacing: 0.02em; }
.astro-sub { margin: 0 0 16px; font-size: 11.5px; color: var(--ink-muted); }
.astro-row { margin-bottom: 12px; }
.astro-row-label { display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold; color: var(--ink); }
.astro-value { color: var(--primary); font-variant-numeric: tabular-nums; transition: color 0.5s ease; }
.astro-info-box { margin-top: 16px; padding: 10px 12px; background: var(--primary-soft); border-left: 3px solid var(--primary); color: var(--ink); font-size: 11px; line-height: 1.4; border-radius: 0 4px 4px 0; }
.astro-toggle { position: absolute; top: 14px; right: 14px; padding: 8px 14px; font: inherit; font-size: 12px; font-weight: bold; color: var(--ink); background: var(--panel); border: 1px solid var(--line); border-radius: 4px; cursor: pointer; transition: all 0.2s ease; -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }
.astro-toggle:hover { border-color: var(--primary); color: var(--primary); }

input[type='range'] { width: 100%; -webkit-appearance: none; appearance: none; height: 16px; background: transparent; }
input[type='range']::-webkit-slider-runnable-track { height: 3px; background: var(--line); border-radius: 2px; }
input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; margin-top: -5.5px; border-radius: 50%; background: var(--primary); border: 0; box-shadow: 0 0 10px var(--primary); transition: transform 0.1s ease; }
input[type='range']::-webkit-slider-thumb:hover { transform: scale(1.2); }
`;

// ==========================================================
// PHYSICS ENGINE (Kerr Math applied to Time-Reversal)
// ==========================================================
export const CONSTANTS = {
  G: 6.67430e-11,
  c: 299792458,
  h: 6.62607015e-34,
  hbar: 1.054571817e-34,
  k_B: 1.380649e-23,
  M_sun: 1.98847e30,
  sigma_SB: 5.670374419e-8
};

export class CorePhysics {
  static getRestEnergy(mass) { return mass * CONSTANTS.c**2; }
  static getGeoMass(massKg) { return (CONSTANTS.G * massKg) / (CONSTANTS.c**2); }
  static getGeoAngularMomentum(J) { return (CONSTANTS.G * J) / (CONSTANTS.c**3); }
}

export class Relativity {
  static getLorentzFactor(v) { return 1 / Math.sqrt(1 - (v**2 / CONSTANTS.c**2)); }
  static getTimeDilation(v, M, r) { return Math.sqrt(1 - 2*CONSTANTS.G*M/(r*CONSTANTS.c**2) - v**2/CONSTANTS.c**2); }
}

export class RotatingBlackHole {
  static getAStar(J, mass) { return (CONSTANTS.c * J) / (CONSTANTS.G * mass**2); }
  static getSigma(r, a, theta) { return r**2 + a**2 * Math.pow(Math.cos(theta), 2); }
  static getDelta(r, M_geo, a) { return r**2 - 2 * M_geo * r + a**2; }
  
  static getOuterHorizon(M_geo, a) { return M_geo + Math.sqrt(Math.max(0, M_geo**2 - a**2)); }
  static getInnerHorizon(M_geo, a) { return M_geo - Math.sqrt(Math.max(0, M_geo**2 - a**2)); }
  static getOuterErgosphere(M_geo, a, theta) { return M_geo + Math.sqrt(Math.max(0, M_geo**2 - a**2 * Math.pow(Math.cos(theta), 2))); }
  
  static getISCO(M_geo, a_star, prograde = true) {
    const sign = prograde ? 1 : -1;
    const Z1 = 1 + Math.cbrt(1 - a_star**2) * (Math.cbrt(1 + a_star) + Math.cbrt(1 - a_star));
    const Z2 = Math.sqrt(3 * a_star**2 + Z1**2);
    return M_geo * (3 + Z2 - sign * Math.sqrt((3 - Z1) * (3 + Z1 + 2 * Z2)));
  }

  static getPhotonOrbit(M_geo, a_star, prograde = true) {
    const sign = prograde ? -1 : 1;
    return 2 * M_geo * (1 + Math.cos((2/3) * Math.acos(sign * a_star)));
  }

  static getKerrSurfaceGravity(M_geo, a) {
    const r_plus = this.getOuterHorizon(M_geo, a);
    const r_minus = this.getInnerHorizon(M_geo, a);
    return ((r_plus - r_minus) / (2 * (r_plus**2 + a**2))) * CONSTANTS.c**2; 
  }
}

// ==========================================================
// SHADERS (Time-Reversed White Hole)
// ==========================================================
const VERTEX_SRC = `#version 300 es
in vec2 p; out vec2 vUv;
void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAGMENT_SRC = `#version 300 es
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform float uSpin;
uniform float uCamDist;
uniform float uFov;
uniform float uInc;
uniform float uAzi;
uniform float uDiskIn;
uniform float uDiskOut;

uniform float uEmission;
uniform float uOutflow;
uniform float uJet;

out vec4 fragColor;

const int MAX_STEPS = 300; 

float Sigma(float r, float a2, float mu) { return r*r + a2*mu*mu; }

vec4 getDerivs(vec4 Y, float C1, float K, float a2) {
    float dr = 2.0*Y.x*Y.x*Y.x + Y.x*C1 + K;
    float dmu = Y.y * C1 - 2.0 * a2 * Y.y * Y.y * Y.y;
    return vec4(Y.z, Y.w, dr, dmu);
}

float dPhi(float r, float mu, float a, float L, float C2, float a2) {
    float sin2 = max(1.0 - mu*mu, 1e-5);
    float Del = max(r*r - 2.0*r + a2, 1e-4);
    return -(a*(r*r + C2)/Del - a + L/sin2); 
}

float getKinematicRedshift(float r, float a, float L) {
    float safeR = max(r, 1.5); 
    float Om = 1.0 / (pow(safeR, 1.5) + a); 
    float Sig = max(safeR*safeR, 1e-5); 
    float gtt = -(1.0 - 2.0*safeR/Sig);
    float gtp = -2.0*a*safeR/Sig;
    float gpp = (safeR*safeR + a*a + 2.0*a*a*safeR/Sig);
    float ut = inversesqrt(max(-(gtt + 2.0*gtp*Om + gpp*Om*Om), 1e-5));
    float g = 1.0 / (ut * (1.0 - Om * L));
    return max(g, 0.0);
}

float hash(vec3 p3) { p3 = fract(p3*.1031); p3+=dot(p3, p3.zyx+31.32); return fract((p3.x+p3.y)*p3.z); }

// Warm Neutral / White-Hot Palette
vec3 getWhiteHoleDiskColor(float temp) {
    vec3 c0 = vec3(0.015, 0.015, 0.020); // Deep background blend
    vec3 c1 = vec3(0.400, 0.380, 0.360); // Warm neutral dark
    vec3 c2 = vec3(0.700, 0.680, 0.650); // Warm bright neutral
    vec3 c3 = vec3(0.920, 0.900, 0.880); // Soft white-hot
    vec3 c4 = vec3(1.000, 0.970, 0.920); // Peak white with warm tint
    vec3 c5 = vec3(1.000, 1.000, 1.000); // Pure white core
    
    float t = clamp(temp, 0.0, 1.0) * 5.0;
    int i = int(floor(t));
    float f = smoothstep(0.0, 1.0, fract(t));
    
    if (i == 0) return mix(c0, c1, f);
    if (i == 1) return mix(c1, c2, f);
    if (i == 2) return mix(c2, c3, f);
    if (i == 3) return mix(c3, c4, f);
    return mix(c4, c5, f);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*uRes)/min(uRes.x, uRes.y);
    
    vec3 totalCol = vec3(0.0);
    float a = uSpin, a2 = a*a;
    float s0 = sin(uInc), c0 = cos(uInc);
    float alpha = uv.x * uFov, beta = uv.y * uFov;
    
    float xi = -alpha * s0;
    float eta = beta * beta + c0 * c0 * (alpha * alpha - a2);
    
    float L = xi, Q = eta;
    float K = (L - a)*(L - a) + Q;
    float C1 = a2 - L*L - Q, C2 = a2 - a*L;
    
    float invR = 1.0/uCamDist, invR2 = invR * invR;
    float R_div_r4 = 1.0 + C1*invR2 + (2.0*K)*invR2*invR - (a2*Q)*invR2*invR2;
    float vr_init = -(uCamDist*uCamDist) * sqrt(max(R_div_r4, 0.0));
    
    vec4 Y = vec4(uCamDist, c0, vr_init, beta * s0);
    float ph = uAzi; 
    float T_trans = 1.0;
    bool hitSurface = false;
    float rHorizon = 1.0 + sqrt(max(0.0, 1.0 - a2));

    for(int i=0; i<MAX_STEPS; i++) {
        float d_lam = clamp(0.03 * Y.x, 0.001, 1.0) / max(Sigma(Y.x, a2, Y.y), 0.01);

        vec4 k1 = getDerivs(Y, C1, K, a2);
        vec4 k2 = getDerivs(Y + 0.5*d_lam*k1, C1, K, a2);
        vec4 k3 = getDerivs(Y + 0.5*d_lam*k2, C1, K, a2);
        vec4 k4 = getDerivs(Y + d_lam*k3, C1, K, a2);
        vec4 Y_next = Y + (d_lam/6.0)*(k1 + 2.0*k2 + 2.0*k3 + k4);
        
        float r_current = Y.x;
        
        // Volumetric Soft Halo: Continuous illumination wrapping the structure
        if (r_current >= uDiskIn && r_current < uDiskOut * 1.5) {
            float h = abs(Y.y * r_current); 
            float haloFade = exp(-h * 1.8) * exp(-(r_current - uDiskIn) * 0.15);
            if (haloFade > 0.01) {
                vec3 haloColor = vec3(0.85, 0.82, 0.80); // Warm soft glow
                float dtau_halo = haloFade * 0.015 * d_lam * uEmission;
                totalCol += T_trans * haloColor * dtau_halo * 2.0;
                T_trans *= exp(-dtau_halo);
            }
        }

        // Volumetric Narrow Jets (Outward flow along poles)
        float jet_rho = r_current * sqrt(max(0.0, 1.0 - Y.y*Y.y));
        float jet_z = r_current * abs(Y.y);
        if (uJet > 0.0 && jet_rho < 3.0 && jet_z > rHorizon) {
            float jetDens = exp(-jet_rho * 2.5) * pow(max(rHorizon / jet_z, 0.01), 1.8) * uJet;
            
            float jet_flow = fract(jet_z * 0.2 - uTime * uOutflow);
            jetDens *= (0.7 + 0.3 * sin(jet_flow * 6.2831));
            
            float dtau_jet = jetDens * d_lam * 0.3;
            vec3 jetCol = vec3(0.9, 0.92, 0.95); // White-hot jet with slight cool tint
            totalCol += T_trans * jetCol * dtau_jet * uEmission * 1.5;
            T_trans *= exp(-dtau_jet);
        }

        // Fluid outward flowing disk/ring for White Hole
        if (uDiskOut > 0.0 && (Y.y * Y_next.y <= 0.0)) {
            float t_cross = abs(Y.y) / (abs(Y.y) + abs(Y_next.y) + 1e-8);
            float r_cross = mix(Y.x, Y_next.x, t_cross);
            
            if (r_cross >= uDiskIn && r_cross < uDiskOut) {
                float safeR = max(r_cross, rHorizon + 0.01);
                
                float g = getKinematicRedshift(safeR, a, L);
                
                // Keep the whole disk illuminated - minimum lighting floor
                float doppler = pow(max(g, 0.0), 3.0);
                float lighting = mix(0.65, 1.0, clamp(doppler, 0.0, 1.0));
                
                float ph_cross = ph + dPhi(r_cross, 0.0, a, L, C2, a2) * d_lam * t_cross;
                
                float rad_flow = -uTime * uOutflow; 
                float phi_pattern = ph_cross - uTime * (uOutflow * 0.5) / (pow(r_cross, 1.5) + a); 
                
                float cloud = 0.7 + 0.3 * sin(r_cross * 2.0 + rad_flow + sin(phi_pattern * 2.0));
                
                float r_ratio = clamp((r_cross - uDiskIn) / (uDiskOut - uDiskIn), 0.0, 1.0);
                
                float innerFade = smoothstep(0.0, 0.08, r_ratio);
                float outerFade = smoothstep(1.0, 0.4, r_ratio);
                
                float effectiveTemp = (1.0 - pow(r_ratio, 0.6)) * uEmission; 
                effectiveTemp += (g - 1.0) * 0.2; // Blueshift heating
                
                float ringBoost = smoothstep(uDiskIn + 0.5, uDiskIn, r_cross) * 1.5; 
                effectiveTemp = clamp(effectiveTemp + ringBoost, 0.0, 1.0);
                
                vec3 bbCol = getWhiteHoleDiskColor(effectiveTemp);
                
                // Add secondary scattered light for volumetric depth
                vec3 scattered = bbCol * 0.12;
                vec3 finalDiskCol = (bbCol * lighting + scattered) * 3.0 * uEmission;
                
                float localDens = exp(-r_ratio * 3.5) * cloud * innerFade * outerFade;
                float pathLength = abs(d_lam / (Y_next.y - Y.y + 1e-8));
                pathLength = min(pathLength, 20.0);
                
                float dtau = localDens * pathLength * 0.8;
                float emissionFactor = 1.0 - exp(-dtau);
                
                totalCol += T_trans * finalDiskCol * emissionFactor;
                T_trans *= exp(-dtau); 
            }
        }

        Y = Y_next;
        ph += dPhi(Y.x, Y.y, a, L, C2, a2) * d_lam;

        // Dark central causal region (NO pure white ball)
        if (Y.x <= rHorizon * 1.005) { hitSurface = true; break; }
        if (isnan(Y.x) || isnan(Y.y) || Y.x > uCamDist * 1.2 || T_trans < 0.01) break; 
    }

    if(hitSurface) {
        // True solid black core
        totalCol += T_trans * vec3(0.0); 
        T_trans = 0.0;
    } else if (T_trans > 0.01) {
        // Very dark space background
        vec3 spaceColor = vec3(0.003, 0.006, 0.010);
        totalCol += T_trans * spaceColor;
        
        float sin_th = sqrt(max(1.0 - Y.y*Y.y, 0.0));
        vec3 d = vec3(sin_th*cos(ph), Y.y, sin_th*sin(ph));
        vec3 p3 = d * 300.0;
        float starHash = hash(floor(p3));
        
        if (starHash > 0.995) {
            float dist = length(fract(p3) - 0.5);
            if (dist < 0.35) {
                float intensity = (starHash - 0.995) * 400.0 * smoothstep(0.35, 0.0, dist);
                totalCol += T_trans * vec3(0.95, 0.95, 0.95) * intensity;
            }
        }
    }
    
    // Smooth Cinematic ACES Tone Mapping
    totalCol = (totalCol * (2.51 * totalCol + 0.03)) / (totalCol * (2.43 * totalCol + 0.59) + 0.14);
    fragColor = vec4(pow(clamp(totalCol, 0.0, 1.0), vec3(1.0/2.2)), 1.0);
}
`;

// ==========================================================
// REACT COMPONENT
// ==========================================================
export default function WhiteHole() {
  const canvasRef = useRef(null);
  const [glData, setGlData] = useState(null);
  const [hudVisible, setHudVisible] = useState(true);
  const [sysError, setSysError] = useState(null);
  
  const [massMulti, setMassMulti] = useState(10.90); 
  const [spin, setSpin] = useState(0.99);
  const [emissionEnergy, setEmissionEnergy] = useState(1.2);
  const [outflowVelocity, setOutflowVelocity] = useState(2.0);
  const [diskRadius, setDiskRadius] = useState(15.0);
  const [jetStrength, setJetStrength] = useState(0.8);
  
  const aziRef = useRef(0.0);
  const incRef = useRef(1.25); 
  const distRef = useRef(50.0); 
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);

  const handlePointerDown = (e) => {
    draggingRef.current = true;
    lastXRef.current = e.clientX || (e.touches && e.touches[0].clientX);
    lastYRef.current = e.clientY || (e.touches && e.touches[0].clientY);
  };
  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX);
    const currentY = e.clientY || (e.touches && e.touches[0].clientY);
    aziRef.current -= (currentX - lastXRef.current) * 0.01;
    incRef.current = Math.max(0.1, Math.min(Math.PI - 0.1, incRef.current - (currentY - lastYRef.current) * 0.01));
    lastXRef.current = currentX;
    lastYRef.current = currentY;
  };
  const handlePointerUp = () => { draggingRef.current = false; };
  const handleWheel = (e) => { distRef.current = Math.max(5.0, Math.min(200.0, distRef.current + e.deltaY * 0.1)); };
  const resetCamera = () => { aziRef.current = 0.0; incRef.current = 1.25; distRef.current = 50.0; };

  const engineStateRef = useRef({ spin, emissionEnergy, outflowVelocity, diskRadius, jetStrength, physics: null });

  const physics = useMemo(() => {
    try {
      const massKg = massMulti * CONSTANTS.M_sun;
      const geoMass = CorePhysics.getGeoMass(massKg);
      
      const aGeo = spin * geoMass;
      const rPlus = RotatingBlackHole.getOuterHorizon(geoMass, aGeo);
      const rMinus = RotatingBlackHole.getInnerHorizon(geoMass, aGeo);
      
      const rISCO = RotatingBlackHole.getISCO(geoMass, spin, true);
      const rPhoton = RotatingBlackHole.getPhotonOrbit(geoMass, spin, true);
      const ergosphere = RotatingBlackHole.getOuterErgosphere(geoMass, aGeo, Math.PI/2);
      
      const renderDiskIn = Math.max((rPlus / geoMass) + 0.02, (rISCO / geoMass) * 0.9);
      const fov = 42.0; 
      
      const massScaleFactor = Math.pow(massMulti / 10.90, 0.6); 
      const camDistScaled = Math.max(3.0, distRef.current / massScaleFactor); 
      
      return {
        massKg, geoMass, fov, camDistScaled,
        renderDiskIn,
        horizon: rPlus / geoMass,
        innerHorizon: rMinus / geoMass,
        ergosphere: ergosphere / geoMass,
        isco: rISCO / geoMass,
        photonOrbit: rPhoton / geoMass
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [massMulti, spin]);

  useEffect(() => { 
    engineStateRef.current = { spin, emissionEnergy, outflowVelocity, diskRadius, jetStrength, physics }; 
  }, [spin, emissionEnergy, outflowVelocity, diskRadius, jetStrength, physics]);

  useEffect(() => {
    try {
      const gl = canvasRef.current.getContext('webgl2', { antialias: false });
      if (!gl) { setSysError("WebGL 2 is not supported by your browser."); return; }
      
      const compile = (t, src) => {
        const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
        return s;
      };
      
      const p = gl.createProgram();
      gl.attachShader(p, compile(gl.VERTEX_SHADER, VERTEX_SRC));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, FRAGMENT_SRC));
      gl.linkProgram(p);
      
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
      
      const locs = [
        'uRes','uTime','uSpin','uCamDist','uFov','uInc','uAzi','uDiskIn','uDiskOut',
        'uEmission', 'uOutflow', 'uJet'
      ].reduce((acc, name) => ({ ...acc, [name]: gl.getUniformLocation(p, name) }), {});
        
      setGlData({ gl, p, locs });
    } catch (e) { setSysError(`Shader Compilation Failed: ${e.message}`); }
  }, []);

  useEffect(() => {
    if (!glData || sysError) return;
    const { gl, p, locs } = glData;
    let raf, start = performance.now();
    
    const render = (now) => {
      try {
        const state = engineStateRef.current;
        if (!state.physics) return;
        const phys = state.physics;
        
        const w = gl.canvas.width = gl.canvas.clientWidth;
        const h = gl.canvas.height = gl.canvas.clientHeight;
        gl.viewport(0, 0, w, h); gl.useProgram(p);
        
        const pos = gl.getAttribLocation(p, 'p');
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
        
        gl.uniform2f(locs.uRes, w, h);
        gl.uniform1f(locs.uTime, (now - start) / 1000);
        gl.uniform1f(locs.uSpin, state.spin);
        gl.uniform1f(locs.uFov, phys.fov);
        gl.uniform1f(locs.uInc, incRef.current);
        gl.uniform1f(locs.uAzi, aziRef.current);
        gl.uniform1f(locs.uCamDist, phys.camDistScaled); 
        gl.uniform1f(locs.uDiskIn, phys.renderDiskIn);
        gl.uniform1f(locs.uDiskOut, state.diskRadius);
        gl.uniform1f(locs.uEmission, state.emissionEnergy);
        gl.uniform1f(locs.uOutflow, state.outflowVelocity);
        gl.uniform1f(locs.uJet, state.jetStrength);
        
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        raf = requestAnimationFrame(render);
      } catch (e) { setSysError(`Render Loop Crash: ${e.message}`); }
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [glData, sysError]); 

  if (sysError) {
    return (
      <div style={{ padding: '24px', backgroundColor: '#000', color: '#ff4444', fontFamily: 'monospace', height: '100vh', width: '100vw' }}>
        <h2>ENGINE CRASH DETECTED</h2>
        <pre style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{sysError}</pre>
      </div>
    );
  }

  const renderHUDText = () => {
    try {
      const v2 = (v) => (v !== undefined && isFinite(v)) ? v.toFixed(3) : "∞";

      let text = `WHITE HOLE PHYSICS ENGINE\n─────────────────────────\n\n`;
      text += `OBJECT        WHITE HOLE\n`;
      text += `STATUS        THEORETICAL MODEL\n`;
      text += `GEOMETRY      TIME-REVERSED\n`;
      text += `OBSERVATION   UNOBSERVED\n\n`;

      text += `MASS          ${massMulti.toFixed(2)} M_sun\n`;
      text += `SPIN          a* ${v2(spin)}\n\n`;
      
      text += `HORIZON (R+)  ${v2(physics.horizon)} M\n`;
      text += `HORIZON (R-)  ${v2(physics.innerHorizon)} M\n`;
      text += `ERGOSPHERE    ${v2(physics.ergosphere)} M\n`;
      text += `ISCO          ${v2(physics.isco)} M\n`;
      text += `PHOTON ORBIT  ${v2(physics.photonOrbit)} M\n\n`;

      text += `OUTFLOW VEL   ${outflowVelocity.toFixed(2)} c\n`;
      text += `RED SHIFT     VIEW-DEPENDENT\n`;

      return text;
    } catch (e) { return `HUD UI Error:\n${e.message}`; }
  };

  return (
    <div className="astro-root theme-whitehole">
      <style>{CSS_STYLES}</style>
      <canvas 
        ref={canvasRef} className="astro-canvas"
        onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp} onTouchStart={handlePointerDown} onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp} onWheel={handleWheel} onDoubleClick={resetCamera}
        style={{ cursor: draggingRef.current ? 'grabbing' : 'grab' }}
      />
      
      {hudVisible && (
        <div style={{ position: 'absolute', top: 16, left: 16, textShadow: '0 1px 2px #000', fontSize: '11px', pointerEvents: 'none', lineHeight: 1.5, zIndex: 10, whiteSpace: 'pre', fontFamily: 'monospace', color: 'var(--primary)' }}>
          {physics ? renderHUDText() : "Loading Physics Engine..."}
        </div>
      )}
      
      <button className="astro-toggle" onClick={() => setHudVisible(!hudVisible)} style={{ zIndex: 10 }}>TOGGLE HUD</button>
      
      <div className="astro-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 className="astro-title">White Hole Simulator</h3>
            <p className="astro-sub" style={{ margin: 0 }}>Drag: Rotate | Scroll: Zoom | DblClick: Reset</p>
          </div>
          <button onClick={resetCamera} style={{ fontSize: '10px', padding: '4px 8px', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', cursor: 'pointer' }}>RESET VIEW</button>
        </div>

        <div className="astro-row">
          <div className="astro-row-label"><span>Mass (M_sun)</span><span className="astro-value">{massMulti.toFixed(2)}</span></div>
          <input type="range" min="1.0" max="100.0" step="0.01" value={massMulti} onChange={e => setMassMulti(parseFloat(e.target.value))} />
        </div>
        
        <div className="astro-row">
          <div className="astro-row-label"><span>Spin (a*)</span><span className="astro-value">{spin.toFixed(3)}</span></div>
          <input type="range" min="0" max="0.999" step="0.001" value={spin} onChange={e => setSpin(parseFloat(e.target.value))} />
        </div>

        <div className="astro-row">
          <div className="astro-row-label"><span>Emission Energy</span><span className="astro-value">{emissionEnergy.toFixed(2)}</span></div>
          <input type="range" min="0.1" max="3.0" step="0.01" value={emissionEnergy} onChange={e => setEmissionEnergy(parseFloat(e.target.value))} />
        </div>

        <div className="astro-row">
          <div className="astro-row-label"><span>Outflow Velocity</span><span className="astro-value">{outflowVelocity.toFixed(2)}</span></div>
          <input type="range" min="0.0" max="5.0" step="0.01" value={outflowVelocity} onChange={e => setOutflowVelocity(parseFloat(e.target.value))} />
        </div>

        <div className="astro-row">
          <div className="astro-row-label"><span>Disk / Ring Radius</span><span className="astro-value">{diskRadius.toFixed(1)}</span></div>
          <input type="range" min="5.0" max="30.0" step="0.1" value={diskRadius} onChange={e => setDiskRadius(parseFloat(e.target.value))} />
        </div>

  

        <div className="astro-info-box">
          A purely theoretical, time-reversed mathematical solution to the Kerr metric. Features a solid black central causal region emitting light and matter outward continuously in a smooth cinematic warm white-hot gradient, wrapped in a full relativistic halo.
        </div>
      </div>
    </div>
  );
}