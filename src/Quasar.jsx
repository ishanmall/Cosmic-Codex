import React, { useEffect, useMemo, useRef, useState } from 'react';

// ==========================================================
// STYLES & THEMES
// ==========================================================
const CSS_STYLES = `
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { width: 100vw; height: 100vh; overflow: hidden; background-color: #000; font-family: 'Courier New', Courier, monospace; color: white; }
input[type=range], button { cursor: pointer; }

:root {
  --primary: #ffbf00; --primary-soft: rgba(255, 191, 0, 0.35); --ink: #fff7e6; --ink-muted: #cc9900;
  --panel: rgba(12, 10, 6, 0.85); --line: rgba(255, 255, 255, 0.15); --focus: #ffe699;
}

.theme-quasar { --primary: #ffbf00; --primary-soft: rgba(255, 191, 0, 0.35); --ink: #fff7e6; --ink-muted: #cc9900; --panel: rgba(12, 10, 6, 0.85); }

.astro-root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #000; color: var(--ink); transition: color 0.5s ease; }
.astro-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; touch-action: none; cursor: grab; }
.astro-canvas:active { cursor: grabbing; }

.astro-panel {
  position: absolute; right: 12px; bottom: 12px; width: min(320px, calc(100% - 24px)); max-height: calc(100% - 70px);
  overflow-y: auto; padding: 16px 20px; font-size: 12px; line-height: 1.5; background: var(--panel);
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); border: 1px solid var(--line);
  border-radius: 8px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); transition: background-color 0.5s ease, border-color 0.5s ease;
  scrollbar-width: thin; scrollbar-color: var(--primary-soft) transparent;
}
.astro-panel::-webkit-scrollbar { width: 6px; }
.astro-panel::-webkit-scrollbar-track { background: transparent; }
.astro-panel::-webkit-scrollbar-thumb { background-color: var(--primary-soft); border-radius: 4px; }

.astro-title { margin: 0 0 2px; font-size: 15px; font-weight: 700; letter-spacing: 0.02em; }
.astro-sub { margin: 0 0 16px; font-size: 11px; color: var(--ink-muted); }
.astro-row { margin-bottom: 12px; }
.astro-row-label { display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold; color: var(--ink); }
.astro-value { color: var(--primary); font-variant-numeric: tabular-nums; transition: color 0.5s ease; }
.astro-info-box { margin-top: 16px; padding: 10px 12px; background: var(--primary-soft); border-left: 3px solid var(--primary); color: var(--ink); font-size: 11px; line-height: 1.4; border-radius: 0 4px 4px 0; }
.astro-toggle { position: absolute; top: 14px; right: 14px; padding: 6px 12px; font: inherit; font-size: 11px; font-weight: bold; color: var(--ink); background: var(--panel); border: 1px solid var(--line); border-radius: 4px; cursor: pointer; transition: all 0.2s ease; -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }

input[type='range'] { width: 100%; -webkit-appearance: none; appearance: none; height: 16px; background: transparent; }
input[type='range']::-webkit-slider-runnable-track { height: 3px; background: var(--line); border-radius: 2px; }
input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; margin-top: -5.5px; border-radius: 50%; background: var(--primary); border: 0; box-shadow: 0 0 10px var(--primary); transition: transform 0.1s ease; }
input[type='range']::-webkit-slider-thumb:hover { transform: scale(1.2); }
`;

// ==========================================================
// PHYSICS ENGINE (Kerr Math & Quasar AGN Physics)
// ==========================================================
export const CONSTANTS = {
  G: 6.67430e-11,
  c: 299792458,
  h: 6.62607015e-34,
  k_B: 1.380649e-23,
  m_p: 1.6726219e-27,
  M_sun: 1.98847e30,
  sigma_T: 6.65245873e-29,
  yr_to_s: 3.154e7
};

export class KerrPhysics {
  static getGeoMass(massKg) { return (CONSTANTS.G * massKg) / (CONSTANTS.c**2); }
  static getSchwarzschildRadius(M_geo) { return 2 * M_geo; }
  static getOuterHorizon(M_geo, a_star) { return M_geo * (1 + Math.sqrt(Math.max(0, 1 - a_star**2))); }
  
  static getISCO(M_geo, a_star, prograde = true) {
    const sign = prograde ? 1 : -1;
    const Z1 = 1 + Math.cbrt(1 - a_star**2) * (Math.cbrt(1 + a_star) + Math.cbrt(1 - a_star));
    const Z2 = Math.sqrt(3 * a_star**2 + Z1**2);
    return M_geo * (3 + Z2 - sign * Math.sqrt((3 - Z1) * (3 + Z1 + 2 * Z2)));
  }

  static getRadiativeEfficiency(a_star) {
    const isco_norm = this.getISCO(1.0, a_star, true);
    return 1 - Math.sqrt(1 - 2.0 / (3.0 * isco_norm));
  }
}

export class QuasarPhysics {
  static getEddingtonLuminosity(massKg) { 
    return (4 * Math.PI * CONSTANTS.G * massKg * CONSTANTS.m_p * CONSTANTS.c) / CONSTANTS.sigma_T; 
  }
  
  static getAccretionRate(L_bol, efficiency) { 
    return L_bol / (efficiency * CONSTANTS.c**2); 
  }
  
  static getBroadLineRegionRadius(L_bol) {
    const L_erg = L_bol * 1e7;
    const R_lightdays = 32.9 * Math.pow(L_erg / 1e44, 0.5);
    return R_lightdays * 2.59e13; 
  }

  static getJetVelocity(lorentzFactor) { 
    return CONSTANTS.c * Math.sqrt(1 - 1/(lorentzFactor**2)); 
  }
}

// ==========================================================
// SHADERS (Kerr Geodesic Quasar with Native Coordinate Jet)
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
uniform float uJetLorentz;
uniform float uJetPowerNorm;
uniform float uEddRatio;

out vec4 fragColor;

const int MAX_STEPS = 280; 

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

float noise(vec3 p) {
    vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x), mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x), mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
}

float fbm(vec3 p) {
    float s = 0.0, a = 0.5;
    for(int i=0; i<4; i++) { s += a * noise(p); p = p * 2.03 + 7.1; a *= 0.5; }
    return s;
}

vec3 getQuasarDiskColor(float temp) {
    vec3 c0 = vec3(0.090, 0.063, 0.055); // #17100E Outer
    vec3 c1 = vec3(0.196, 0.090, 0.075); // #321713 
    vec3 c2 = vec3(0.353, 0.145, 0.094); // #5A2518 Middle
    vec3 c3 = vec3(0.620, 0.247, 0.125); // #9E3F20
    vec3 c4 = vec3(0.847, 0.400, 0.141); // #D86624 
    vec3 c5 = vec3(1.000, 0.604, 0.196); // #FF9A32 Inner
    vec3 c6 = vec3(1.000, 0.827, 0.416); // #FFD36A 
    vec3 c7 = vec3(1.000, 0.957, 0.816); // #FFF4D0 
    vec3 c8 = vec3(1.000, 1.000, 1.000); // #FFFFFF 
    
    float t = clamp(temp, 0.0, 1.0) * 8.0;
    int i = int(floor(t));
    float f = smoothstep(0.0, 1.0, fract(t));
    
    if (i == 0) return mix(c0, c1, f);
    if (i == 1) return mix(c1, c2, f);
    if (i == 2) return mix(c2, c3, f);
    if (i == 3) return mix(c3, c4, f);
    if (i == 4) return mix(c4, c5, f);
    if (i == 5) return mix(c5, c6, f);
    if (i == 6) return mix(c6, c7, f);
    if (i == 7) return mix(c7, c8, f);
    return c8;
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
        float d_lam = clamp(0.04 * Y.x, 0.002, 1.2) / max(Sigma(Y.x, a2, Y.y), 0.01);

        vec4 k1 = getDerivs(Y, C1, K, a2);
        vec4 k2 = getDerivs(Y + 0.5*d_lam*k1, C1, K, a2);
        vec4 k3 = getDerivs(Y + 0.5*d_lam*k2, C1, K, a2);
        vec4 k4 = getDerivs(Y + d_lam*k3, C1, K, a2);
        vec4 Y_next = Y + (d_lam/6.0)*(k1 + 2.0*k2 + 2.0*k3 + k4);
        
        if (T_trans > 0.01 && uJetPowerNorm > 0.0 && Y.x > rHorizon * 1.02) {
            float r_current = Y.x;
            float mu = Y.y;
            
            float z = r_current * abs(mu);
            float rho = r_current * sqrt(max(0.0, 1.0 - mu*mu));
            
            if (z > rHorizon * 1.05) {
                float gamma = uJetLorentz;
                float beta_jet = sqrt(1.0 - 1.0/(gamma*gamma));
                
                float opening = 0.35 / gamma; 
                float jetRadius = rHorizon * 0.2 + opening * z;
                
                float radialFalloff = exp(-(rho*rho) / max(jetRadius*jetRadius, 0.001));
                float longitudinalFalloff = 1.0 / (1.0 + z * 0.12); 
                
                float flow = uTime * gamma * 0.15;
                float turbulence = 0.65 + 0.35 * fbm(vec3(rho * 4.0, z * 0.5 - flow, ph * 2.0));
                
                float jetCore = radialFalloff * longitudinalFalloff * turbulence * uJetPowerNorm;
                
                if (jetCore > 0.001) {
                    float cosThetaObs = mu * sign(beta + 1e-6); 
                    float dopplerJet = 1.0 / (gamma * (1.0 - beta_jet * cosThetaObs));
                    
                    float jetBoost = max(0.12, pow(clamp(dopplerJet, 0.15, 10.0), 3.0));
                    
                    vec3 coreColor = vec3(1.0, 1.0, 1.0);
                    vec3 innerGlow = vec3(0.55, 0.79, 1.0); // #8EC9FF
                    vec3 haloColor = vec3(0.02, 0.15, 0.35); 
                    
                    vec3 jCol = mix(haloColor, innerGlow, smoothstep(0.02, 0.3, radialFalloff));
                    jCol = mix(jCol, coreColor, smoothstep(0.6, 1.0, radialFalloff));
                    
                    float dtauJet = jetCore * abs(d_lam) * 0.7;
                    float emission = 1.0 - exp(-dtauJet);
                    
                    totalCol += T_trans * (jCol * jetBoost * 2.0) * emission;
                    T_trans *= exp(-dtauJet * 0.1); 
                }
            }
        }

        if (uDiskOut > 0.0 && (Y.y * Y_next.y <= 0.0)) {
            float t_cross = abs(Y.y) / (abs(Y.y) + abs(Y_next.y) + 1e-8);
            float r_cross = mix(Y.x, Y_next.x, t_cross);
            
            if (r_cross >= uDiskIn && r_cross < (uDiskOut + 6.0)) {
                float safeR = max(r_cross, rHorizon + 0.01);
                float g = getKinematicRedshift(safeR, a, L);
                
                float doppler = clamp(g, 0.45, 2.2);
                float dopplerBoost = pow(doppler, 2.5);
                float baseIllumination = 0.4 + 0.6 * dopplerBoost;
                
                float ph_cross = ph + dPhi(r_cross, 0.0, a, L, C2, a2) * d_lam * t_cross;
                float phi_pattern = ph_cross + uTime * 3.0 / (pow(r_cross, 1.5) + a); 
                
                float cloud = fbm(vec3(r_cross * 2.5, phi_pattern * 2.0, 10.0));
                cloud = smoothstep(0.1, 0.9, cloud); 
                
                float r_ratio = uDiskIn / r_cross;
                float flux = (1.0 / pow(max(r_cross, 0.1), 2.2)) * max(0.0, 1.0 - sqrt(r_ratio));
                
                float baseTemp = pow(flux, 0.25) * 6.0 * (0.3 + uEddRatio * 0.7); 
                float effectiveTemp = baseTemp * baseIllumination * (0.7 + 0.3 * cloud);
                
                float ringBoost = smoothstep(rHorizon + 1.5, rHorizon, r_cross) * 2.0 * uEddRatio; 
                effectiveTemp = clamp(effectiveTemp + ringBoost, 0.0, 1.0);
                
                vec3 bbCol = getQuasarDiskColor(effectiveTemp);
                
                float fade = smoothstep(uDiskOut + 6.0, uDiskOut - 2.0, r_cross);
                float localDens = (0.6 + 0.4 * cloud) * fade * (0.3 + uEddRatio * 0.7);
                
                float pathLength = abs(d_lam / (Y_next.y - Y.y + 1e-8));
                pathLength = min(pathLength, 25.0); 
                float dtau = localDens * 2.5 * pathLength * 0.15;
                
                float emissionFactor = 1.0 - exp(-dtau);
                float emissionBoost = 2.0; 
                
                totalCol += T_trans * bbCol * emissionFactor * emissionBoost;
                T_trans *= exp(-dtau); 
            }
        }

        Y = Y_next;
        ph += dPhi(Y.x, Y.y, a, L, C2, a2) * d_lam;

        if (Y.x <= rHorizon * 1.002) { hitSurface = true; break; }
        if (isnan(Y.x) || isnan(Y.y) || Y.x > uCamDist * 1.5 || T_trans < 0.02) break; 
    }

    if(hitSurface) {
        totalCol += T_trans * vec3(0.0);
        T_trans = 0.0;
    } else if (T_trans > 0.01) {
        vec3 spaceColor = vec3(0.001, 0.003, 0.005);
        totalCol += T_trans * spaceColor;
        
        float sin_th = sqrt(max(1.0 - Y.y*Y.y, 0.0));
        vec3 d = vec3(sin_th*cos(ph), Y.y, sin_th*sin(ph));
        float starHash = hash(floor(d * 400.0));
        if (starHash > 0.998) totalCol += T_trans * vec3(0.8, 0.85, 0.9) * (starHash - 0.998) * 80.0;
    }
    
    totalCol = (totalCol * (2.51 * totalCol + 0.03)) / (totalCol * (2.43 * totalCol + 0.59) + 0.14);
    fragColor = vec4(pow(clamp(totalCol, 0.0, 1.0), vec3(1.0/2.2)), 1.0);
}
`;

// ==========================================================
// REACT COMPONENT
// ==========================================================
export default function Quasar() {
  const canvasRef = useRef(null);
  const [glData, setGlData] = useState(null);
  const [hudVisible, setHudVisible] = useState(true);
  const [sysError, setSysError] = useState(null);
  
  const [logMass, setLogMass] = useState(8.5); 
  const [spin, setSpin] = useState(0.99);
  const [eddRatio, setEddRatio] = useState(0.8); 
  const [lorentzFactor, setLorentzFactor] = useState(15.0);
  
  const aziRef = useRef(0.0);
  const incRef = useRef(1.25); 
  const distRef = useRef(28.0); 
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
  const handleWheel = (e) => { distRef.current = Math.max(6.0, Math.min(100.0, distRef.current + e.deltaY * 0.1)); };
  const resetCamera = () => { aziRef.current = 0.0; incRef.current = 1.25; distRef.current = 28.0; };

  const engineStateRef = useRef({ spin, lorentzFactor, eddRatio, physics: null });

  const physics = useMemo(() => {
    try {
      const massMulti = Math.pow(10, logMass);
      const massKg = massMulti * CONSTANTS.M_sun;
      const geoMass = KerrPhysics.getGeoMass(massKg);
      
      const rPlus = KerrPhysics.getOuterHorizon(geoMass, spin);
      const rISCO = KerrPhysics.getISCO(geoMass, spin, true);
      const eff = KerrPhysics.getRadiativeEfficiency(spin);
      
      const renderDiskIn = rISCO / geoMass;  
      const renderDiskOut = 16.0; 
      const fov = 48.0; 
      
      const rSchwarzschild = KerrPhysics.getSchwarzschildRadius(geoMass);

      const L_edd = QuasarPhysics.getEddingtonLuminosity(massKg);
      const L_bol = eddRatio * L_edd;
      
      const mDot_kg_s = QuasarPhysics.getAccretionRate(L_bol, eff);
      const mDot_sun_yr = mDot_kg_s / CONSTANTS.M_sun * CONSTANTS.yr_to_s;
      
      const rBLR_m = QuasarPhysics.getBroadLineRegionRadius(L_bol);
      const jetVelocity = QuasarPhysics.getJetVelocity(lorentzFactor);
      const jetPowerNorm = spin > 0.01 ? Math.min(2.5, spin * Math.sqrt(eddRatio) * 1.8) : 0.0;

      return {
        massKg, massMulti, geoMass, fov,
        renderDiskIn, renderDiskOut, jetPowerNorm,
        horizon: rPlus / geoMass,
        isco: renderDiskIn,
        rSchwarzschild,
        L_edd, L_bol, eddRatio, eff, mDot_sun_yr,
        rBLR_m, jetVelocity
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [logMass, spin, eddRatio, lorentzFactor]);

  useEffect(() => { engineStateRef.current = { spin, lorentzFactor, eddRatio, physics }; }, [spin, lorentzFactor, eddRatio, physics]);

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
      
      const locs = ['uRes','uTime','uSpin','uCamDist','uFov','uInc','uAzi','uDiskIn','uDiskOut','uJetLorentz','uJetPowerNorm','uEddRatio']
        .reduce((acc, name) => ({ ...acc, [name]: gl.getUniformLocation(p, name) }), {});
        
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
        gl.uniform1f(locs.uCamDist, distRef.current); 
        gl.uniform1f(locs.uDiskIn, phys.renderDiskIn);
        gl.uniform1f(locs.uDiskOut, phys.renderDiskOut);
        gl.uniform1f(locs.uJetLorentz, state.lorentzFactor);
        gl.uniform1f(locs.uJetPowerNorm, phys.jetPowerNorm);
        gl.uniform1f(locs.uEddRatio, state.eddRatio);
        
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
      const vExp = (v) => (v !== undefined && isFinite(v) && v > 0) ? v.toExponential(2) : "0";

      let text = `QUASAR KERR PHYSICS ENGINE\n──────────────────────────\n`;
      text += `SMBH MASS         10^${logMass.toFixed(2)} M_sun\n`;
      text += `SPIN PARAM (a*)   ${v2(spin)}\n`;
      text += `R_SCHWARZSCHILD   ${vExp(physics.rSchwarzschild)} m\n\n`;
      
      text += `BOL. LUMINOSITY   ${vExp(physics.L_bol)} W\n`;
      text += `EDDINGTON LIMIT   ${vExp(physics.L_edd)} W\n`;
      text += `EDDINGTON RATIO   ${v2(physics.eddRatio)}\n`;
      text += `RAD. EFFICIENCY   ${(physics.eff * 100).toFixed(1)}%\n\n`;
      
      text += `ACCRETION RATE    ${physics.mDot_sun_yr.toFixed(2)} M_sun/yr\n`;
      text += `BROAD LINE (BLR)  ${vExp(physics.rBLR_m)} m\n\n`;
      
      text += `JET LORENTZ FACT. ${v2(lorentzFactor)}\n`;
      text += `JET VELOCITY      ${(physics.jetVelocity / CONSTANTS.c).toFixed(4)} c\n\n`;

      text += `HORIZON (R+)      ${v2(physics.horizon)} M\n`;
      text += `ISCO              ${v2(physics.isco)} M\n`;

      return text;
    } catch (e) { return `HUD UI Error:\n${e.message}`; }
  };

  return (
    <div className="astro-root theme-quasar">
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
            <h3 className="astro-title">Quasar Simulator</h3>
            <p className="astro-sub" style={{ margin: 0 }}>Drag: Rotate | Scroll: Zoom</p>
          </div>
          <button onClick={resetCamera} style={{ fontSize: '10px', padding: '4px 8px', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', cursor: 'pointer' }}>RESET</button>
        </div>

        <div className="astro-row">
          <div className="astro-row-label"><span>SMBH Mass (Log10 M_sun)</span><span className="astro-value">10^{logMass.toFixed(2)}</span></div>
          <input type="range" min="6.0" max="10.5" step="0.05" value={logMass} onChange={e => setLogMass(parseFloat(e.target.value))} />
        </div>
        
        <div className="astro-row">
          <div className="astro-row-label"><span>Spin (a*)</span><span className="astro-value">{spin.toFixed(3)}</span></div>
          <input type="range" min="0" max="0.999" step="0.001" value={spin} onChange={e => setSpin(parseFloat(e.target.value))} />
        </div>

        <div className="astro-row">
          <div className="astro-row-label"><span>Eddington Ratio (λ)</span><span className="astro-value">{eddRatio.toFixed(2)}</span></div>
          <input type="range" min="0.01" max="1.5" step="0.01" value={eddRatio} onChange={e => setEddRatio(parseFloat(e.target.value))} />
        </div>

        <div className="astro-row">
          <div className="astro-row-label"><span>Jet Lorentz Factor (Γ)</span><span className="astro-value">{lorentzFactor.toFixed(1)}</span></div>
          <input type="range" min="2.0" max="50.0" step="1.0" value={lorentzFactor} onChange={e => setLorentzFactor(parseFloat(e.target.value))} />
        </div>

        <div className="astro-info-box">
          <strong>Cinematic Quasar Engine:</strong> The Lorentz factor geometrically dictates the relativistic jet's opening angle and Doppler beaming. The Eddington ratio controls accretion luminosity and thermal volumetric density mapping precisely to the requested hex palette.
        </div>
      </div>
    </div>
  );
}