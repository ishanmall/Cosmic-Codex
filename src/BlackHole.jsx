import React, { useEffect, useMemo, useRef, useState } from 'react';

// ==========================================================
// STYLES & THEMES
// ==========================================================
const CSS_STYLES = `
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { width: 100vw; height: 100vh; overflow: hidden; background-color: #000; font-family: 'Courier New', Courier, monospace; color: white; }
input[type=range], button { cursor: pointer; }

:root {
  --primary: #ff8c00; --primary-soft: rgba(255, 140, 0, 0.35); --ink: #fff0db; --ink-muted: #cc7000;
  --panel: rgba(10, 5, 0, 0.85); --line: rgba(255, 255, 255, 0.15); --focus: #ffb347;
}

.astro-root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #000; color: var(--ink); transition: color 0.5s ease; }
.astro-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; touch-action: none; cursor: grab; }
.astro-canvas:active { cursor: grabbing; }

/* --- PC PANEL (Untouched) --- */
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

/* --- MOBILE SPECIFIC CSS --- */
.astro-panel-mobile {
  position: absolute; bottom: 0; left: 0; width: 100%; max-height: 85vh;
  background: var(--panel); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  border-top: 1px solid var(--primary-soft); border-radius: 20px 20px 0 0;
  padding: 24px 20px; font-size: 12.5px; overflow-y: auto;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 20;
}
.astro-panel-mobile.closed { transform: translateY(100%); }
.astro-panel-mobile.open { transform: translateY(0); box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.7); }

.mobile-open-btn {
  position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
  padding: 12px 24px; background: rgba(10, 5, 0, 0.6); border: 1px solid var(--primary);
  color: var(--primary); border-radius: 30px; font-weight: bold; font-size: 12px;
  -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); z-index: 10;
  box-shadow: 0 4px 16px rgba(0,0,0,0.5); letter-spacing: 0.05em;
}
.mobile-close-btn {
  position: absolute; top: 20px; right: 20px; background: transparent; border: none;
  color: var(--primary); font-size: 20px; font-weight: bold; padding: 4px;
}

.astro-title { margin: 0 0 2px; font-size: 16px; font-weight: 700; letter-spacing: 0.02em; }
.astro-sub { margin: 0 0 16px; font-size: 11.5px; color: var(--ink-muted); }
.astro-row { margin-bottom: 12px; }
.astro-row-label { display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold; color: var(--ink); }
.astro-value { color: var(--primary); font-variant-numeric: tabular-nums; transition: color 0.5s ease; }
.astro-info-box { margin-top: 16px; padding: 10px 12px; background: var(--primary-soft); border-left: 3px solid var(--primary); color: var(--ink); font-size: 11px; line-height: 1.4; border-radius: 0 4px 4px 0; }
.astro-toggle { position: absolute; top: 14px; right: 14px; padding: 8px 14px; font: inherit; font-size: 12px; font-weight: bold; color: var(--ink); background: var(--panel); border: 1px solid var(--line); border-radius: 4px; cursor: pointer; transition: all 0.2s ease; -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }
.astro-toggle:hover { border-color: var(--primary); color: var(--primary); }

input[type='range'] { width: 100%; -webkit-appearance: none; appearance: none; height: 16px; background: transparent; }
input[type='range']::-webkit-slider-runnable-track { height: 3px; background: var(--line); border-radius: 2px; transition: background 0.5s ease; }
input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; margin-top: -5.5px; border-radius: 50%; background: var(--primary); border: 0; box-shadow: 0 0 10px var(--primary); transition: transform 0.1s ease, background 0.5s ease, box-shadow 0.5s ease; }
input[type='range']::-webkit-slider-thumb:hover { transform: scale(1.2); }

/* Responsive adjustments for mobile HUD */
@media (max-width: 768px) {
  .astro-hud { font-size: 9px !important; top: 50px !important; }
}
`;

// ==========================================================
// PHYSICS ENGINE (Kerr Black Hole Math)
// ==========================================================
export const CONSTANTS = {
  G: 6.67430e-11, c: 299792458, h: 6.62607015e-34, hbar: 1.054571817e-34,
  k_B: 1.380649e-23, M_sun: 1.98847e30, sigma_SB: 5.670374419e-8
};

export class CorePhysics {
  static getGeoMass(massKg) { return (CONSTANTS.G * massKg) / (CONSTANTS.c**2); }
}

export class RotatingBlackHole {
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

  static getHorizonAngularVelocity(M_geo, a) {
    const r_plus = this.getOuterHorizon(M_geo, a);
    return (a * CONSTANTS.c) / (r_plus**2 + a**2); 
  }
  
  static getKerrSurfaceGravity(M_geo, a) {
    const r_plus = this.getOuterHorizon(M_geo, a);
    const r_minus = this.getInnerHorizon(M_geo, a);
    return ((r_plus - r_minus) / (2 * (r_plus**2 + a**2))) * CONSTANTS.c**2; 
  }

  static getKerrHawkingTemperature(kappa_SI) {
    return (CONSTANTS.hbar * kappa_SI) / (2 * Math.PI * CONSTANTS.k_B * CONSTANTS.c);
  }

  static getFrameDragging(r, theta, M, a) { 
    const aFunc = (r**2 + a**2)**2 - a**2 * (r**2 - 2*r + a**2) * Math.pow(Math.sin(theta), 2);
    return (2 * M * r * a) / aFunc; 
  }
  static getBlackHoleEntropy(A) { return (CONSTANTS.k_B * CONSTANTS.c**3 * A) / (4 * CONSTANTS.G * CONSTANTS.hbar); }
}

// ==========================================================
// SHADERS
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

out vec4 fragColor;

const int MAX_STEPS = 350; 

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

float hash(vec3 p3) { 
    p3 = fract(p3*.1031); 
    p3 += dot(p3, p3.zyx+31.32); 
    return fract((p3.x+p3.y)*p3.z); 
}

vec3 getBlackHoleDiskColor(float temp) {
    vec3 c0 = vec3(0.070, 0.043, 0.031);
    vec3 c1 = vec3(0.290, 0.141, 0.082);
    vec3 c2 = vec3(0.722, 0.373, 0.165);
    vec3 c3 = vec3(0.910, 0.608, 0.333);
    vec3 c4 = vec3(1.000, 0.850, 0.500);
    vec3 c5 = vec3(1.000, 0.980, 0.900);
    
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
        float d_lam = clamp(0.02 * Y.x, 0.001, 1.0) / max(Sigma(Y.x, a2, Y.y), 0.01);

        vec4 k1 = getDerivs(Y, C1, K, a2);
        vec4 k2 = getDerivs(Y + 0.5*d_lam*k1, C1, K, a2);
        vec4 k3 = getDerivs(Y + 0.5*d_lam*k2, C1, K, a2);
        vec4 k4 = getDerivs(Y + d_lam*k3, C1, K, a2);
        vec4 Y_next = Y + (d_lam/6.0)*(k1 + 2.0*k2 + 2.0*k3 + k4);
        
        // Volumetric Soft Halo
        float r_current = Y.x;
        if (r_current >= uDiskIn && r_current < uDiskOut) {
            float h = abs(Y.y * r_current); 
            float haloFade = exp(-h * 1.8) * exp(-(r_current - uDiskIn) * 0.2);
            if (haloFade > 0.01) {
                vec3 haloColor = vec3(0.8, 0.4, 0.15) * uEmission;
                float dtau_halo = haloFade * 0.015 * d_lam;
                totalCol += T_trans * haloColor * dtau_halo * 3.0;
                T_trans *= exp(-dtau_halo);
            }
        }

        // Main Disk Crossing
        if (uDiskOut > 0.0 && (Y.y * Y_next.y <= 0.0)) {
            float t_cross = abs(Y.y) / (abs(Y.y) + abs(Y_next.y) + 1e-8);
            float r_cross = mix(Y.x, Y_next.x, t_cross);
            
            if (r_cross >= uDiskIn && r_cross < uDiskOut) {
                float safeR = max(r_cross, rHorizon + 0.01);
                float g = getKinematicRedshift(safeR, a, L);
                float lighting = mix(0.65, 1.0, clamp(pow(max(g, 0.0), 3.0), 0.0, 1.0));
                float ph_cross = ph + dPhi(r_cross, 0.0, a, L, C2, a2) * d_lam * t_cross;
                
                // Outflow applies a radial drift to the cloud texture
                float phi_pattern = ph_cross - uTime * 0.2 / (pow(r_cross, 1.5) + a); 
                float cloud = sin(phi_pattern * 3.0 + r_cross * 2.0 - uTime * uOutflow) * 0.15 
                            + sin(phi_pattern * 8.0 - r_cross * 5.0 - uTime * uOutflow * 1.5) * 0.05 + 0.8;
                
                float r_ratio = clamp((r_cross - uDiskIn) / (uDiskOut - uDiskIn), 0.0, 1.0);
                float innerFade = smoothstep(0.0, 0.05, r_ratio); 
                float outerFade = smoothstep(1.0, 0.5, r_ratio);
                
                float localDens = exp(-r_ratio * 4.0) * cloud * innerFade * outerFade;
                
                float effectiveTemp = (1.0 - pow(r_ratio, 0.4)) * 0.95;
                effectiveTemp += (g - 1.0) * 0.15; // Blueshift heating
                effectiveTemp += exp(-r_ratio * 15.0) * 0.4;
                effectiveTemp = clamp(effectiveTemp, 0.0, 1.0);
                
                vec3 bbCol = getBlackHoleDiskColor(effectiveTemp);
                vec3 scattered = bbCol * 0.12;
                vec3 finalDiskCol = (bbCol * lighting + scattered) * 3.0 * uEmission;
                
                float pathLength = abs(d_lam / (Y_next.y - Y.y + 1e-8));
                pathLength = min(pathLength, 12.0);
                
                float dtau = localDens * pathLength * 0.8;
                float emissionFactor = 1.0 - exp(-dtau);
                
                totalCol += T_trans * finalDiskCol * emissionFactor;
                T_trans *= exp(-dtau); 
            }
        }

        Y = Y_next;
        ph += dPhi(Y.x, Y.y, a, L, C2, a2) * d_lam;

        if (Y.x <= rHorizon * 1.005) { hitSurface = true; break; }
        if (isnan(Y.x) || isnan(Y.y) || Y.x > uCamDist * 1.2 || T_trans < 0.01) break; 
    }

    if(hitSurface) {
        // 100% Solid black core
        totalCol += T_trans * vec3(0.0);
        T_trans = 0.0;
    } else if (T_trans > 0.01) {
        vec3 spaceColor = vec3(0.005, 0.009, 0.013);
        totalCol += T_trans * spaceColor;
        
        float sin_th = sqrt(max(1.0 - Y.y*Y.y, 0.0));
        vec3 d = vec3(sin_th*cos(ph), Y.y, sin_th*sin(ph));
        vec3 p3 = d * 300.0;
        vec3 i = floor(p3);
        float starHash = hash(i);
        
        if (starHash > 0.995) {
            vec3 f = fract(p3);
            float dist = length(f - 0.5);
            if (dist < 0.35) {
                float intensity = (starHash - 0.995) * 600.0 * smoothstep(0.35, 0.0, dist);
                totalCol += T_trans * vec3(0.9, 0.95, 1.0) * intensity;
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
export default function BlackHole() {
  const canvasRef = useRef(null);
  const [glData, setGlData] = useState(null);
  const [hudVisible, setHudVisible] = useState(true);
  const [sysError, setSysError] = useState(null);
  
  // Responsive States
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  const [massMulti, setMassMulti] = useState(50.0); 
  const [spin, setSpin] = useState(0.99);
  
  // New States for Black Hole Disk Control
  const [emissionEnergy, setEmissionEnergy] = useState(1.0);
  const [outflowVelocity, setOutflowVelocity] = useState(0.5);
  const [diskInner, setDiskInner] = useState(2.5);
  const [diskOuter, setDiskOuter] = useState(20.0);
  
  const aziRef = useRef(0.0);
  const incRef = useRef(1.25); 
  const distRef = useRef(65.0); 
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);

  // Responsive Mount Effect
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  const handleWheel = (e) => { distRef.current = Math.max(10.0, Math.min(200.0, distRef.current + e.deltaY * 0.1)); };
  const resetCamera = () => { aziRef.current = 0.0; incRef.current = 1.25; distRef.current = 65.0; };

  const engineStateRef = useRef({ spin, emissionEnergy, outflowVelocity, diskInner, diskOuter, physics: null });

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
      
      // Ensure the inner disk does not render strictly inside the horizon
      const safeDiskInner = Math.max((rPlus / geoMass) + 0.01, diskInner);
      
      const fov = 42.0; 
      const massScaleFactor = Math.pow(massMulti / 50.0, 0.6); 
      const camDistScaled = Math.max(5.0, distRef.current / massScaleFactor); 
      
      const kappa_SI = RotatingBlackHole.getKerrSurfaceGravity(geoMass, aGeo);
      const t_Hawking = RotatingBlackHole.getKerrHawkingTemperature(kappa_SI);
      const omegaH = RotatingBlackHole.getHorizonAngularVelocity(geoMass, aGeo);
      
      const area = 4 * Math.PI * (rPlus**2 + aGeo**2);
      const entropy = RotatingBlackHole.getBlackHoleEntropy(area);
      const frameDragEq = RotatingBlackHole.getFrameDragging(rISCO, Math.PI/2, geoMass, aGeo);

      return {
        massKg, geoMass, fov, camDistScaled,
        safeDiskInner, diskOuter,
        horizon: rPlus / geoMass,
        innerHorizon: rMinus / geoMass,
        ergosphere: ergosphere / geoMass,
        isco: rISCO / geoMass,
        photonOrbit: rPhoton / geoMass,
        kappa_SI, t_Hawking, omegaH, entropy, frameDragEq
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [massMulti, spin, diskInner, diskOuter]);

  useEffect(() => { 
    engineStateRef.current = { spin, emissionEnergy, outflowVelocity, diskInner, diskOuter, physics }; 
  }, [spin, emissionEnergy, outflowVelocity, diskInner, diskOuter, physics]);

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
      
      const locs = ['uRes','uTime','uSpin','uCamDist','uFov','uInc','uAzi','uDiskIn','uDiskOut','uEmission','uOutflow']
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
        gl.uniform1f(locs.uCamDist, phys.camDistScaled); 
        gl.uniform1f(locs.uDiskIn, phys.safeDiskInner);
        gl.uniform1f(locs.uDiskOut, state.diskOuter);
        gl.uniform1f(locs.uEmission, state.emissionEnergy);
        gl.uniform1f(locs.uOutflow, state.outflowVelocity);
        
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

      let text = `CINEMATIC BLACK HOLE RENDERER\n─────────────────────────────\n\n`;
      text += `MASS          ${massMulti.toFixed(2)} M_sun\n`;
      text += `SPIN          a* ${v2(spin)}\n\n`;
      text += `HORIZON (R+)  ${v2(physics.horizon)} M\n`;
      text += `HORIZON (R-)  ${v2(physics.innerHorizon)} M\n`;
      text += `ERGOSPHERE    ${v2(physics.ergosphere)} M\n`;
      text += `ISCO          ${v2(physics.isco)} M\n`;
      text += `PHOTON ORBIT  ${v2(physics.photonOrbit)} M\n\n`;
      
      text += `SURFACE GRAV  ${vExp(physics.kappa_SI)} m/s^2\n`;
      text += `HAWKING TEMP  ${vExp(physics.t_Hawking)} K\n`;
      text += `ENTROPY (S)   ${vExp(physics.entropy)} J/K\n`;
      text += `OMEGA H       ${vExp(physics.omegaH)} s^-1\n`;
      text += `FRAME DRAG    ${vExp(physics.frameDragEq)} rad/s\n`;

      return text;
    } catch (e) { return `HUD UI Error:\n${e.message}`; }
  };

  // Shared Slider Control UI (to avoid duplication between PC/Mobile panels)
  const renderControls = () => (
    <>
      <div className="astro-row">
        <div className="astro-row-label"><span>Mass (M_sun)</span><span className="astro-value">{massMulti.toFixed(2)}</span></div>
        <input type="range" min="1.0" max="100.0" step="0.01" value={massMulti} onChange={e => setMassMulti(parseFloat(e.target.value))} />
      </div>
      
      <div className="astro-row">
        <div className="astro-row-label"><span>Spin (a*)</span><span className="astro-value">{spin.toFixed(3)}</span></div>
        <input type="range" min="0" max="0.999" step="0.001" value={spin} onChange={e => setSpin(parseFloat(e.target.value))} />
      </div>

      <div className="astro-row">
        <div className="astro-row-label"><span>Emission Energy</span><span className="astro-value">{emissionEnergy.toFixed(2)}x</span></div>
        <input type="range" min="0.1" max="5.0" step="0.1" value={emissionEnergy} onChange={e => setEmissionEnergy(parseFloat(e.target.value))} />
      </div>
      
      <div className="astro-row">
        <div className="astro-row-label"><span>Flow Velocity (Drift)</span><span className="astro-value">{outflowVelocity.toFixed(2)}</span></div>
        <input type="range" min="-2.0" max="2.0" step="0.1" value={outflowVelocity} onChange={e => setOutflowVelocity(parseFloat(e.target.value))} />
      </div>
      
      <div className="astro-row">
        <div className="astro-row-label"><span>Disk Inner Radius (M)</span><span className="astro-value">{diskInner.toFixed(2)}</span></div>
        <input type="range" min="1.0" max="15.0" step="0.1" value={diskInner} onChange={e => setDiskInner(parseFloat(e.target.value))} />
      </div>
      
      <div className="astro-row">
        <div className="astro-row-label"><span>Disk Outer Radius (M)</span><span className="astro-value">{diskOuter.toFixed(2)}</span></div>
        <input type="range" min="10.0" max="50.0" step="0.5" value={diskOuter} onChange={e => setDiskOuter(parseFloat(e.target.value))} />
      </div>

      <div className="astro-info-box">
        Features dual-sided Doppler lighting, true clean event horizon silhouettes, a volumetric scattering halo, radial accretion dynamics, and controlled ACES tone mapping.
      </div>
    </>
  );

  return (
    <div className="astro-root theme-blackhole">
      <style>{CSS_STYLES}</style>
      <canvas 
        ref={canvasRef} className="astro-canvas"
        onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp} onTouchStart={handlePointerDown} onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp} onWheel={handleWheel} onDoubleClick={resetCamera}
        style={{ cursor: draggingRef.current ? 'grabbing' : 'grab' }}
      />
      
      {hudVisible && (
        <div className="astro-hud" style={{ position: 'absolute', top: 16, left: 16, textShadow: '0 1px 2px #000', fontSize: '11px', pointerEvents: 'none', lineHeight: 1.5, zIndex: 10, whiteSpace: 'pre', fontFamily: 'monospace', color: 'var(--primary)' }}>
          {physics ? renderHUDText() : "Loading Physics Engine..."}
        </div>
      )}
      
      <button className="astro-toggle" onClick={() => setHudVisible(!hudVisible)} style={{ zIndex: 10 }}>TOGGLE HUD</button>
      
      {/* ========================================================== */}
      {/* UI SWITCH: PC vs MOBILE                                      */}
      {/* ========================================================== */}
      
      {!isMobile ? (
        /* --- EXACT ORIGINAL PC PANEL SECTION --- */
        <div className="astro-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h3 className="astro-title">Cinematic Kerr Renderer</h3>
              <p className="astro-sub" style={{ margin: 0 }}>Drag: Rotate | Scroll: Zoom | DblClick: Reset</p>
            </div>
            <button onClick={resetCamera} style={{ fontSize: '10px', padding: '4px 8px', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', cursor: 'pointer' }}>RESET VIEW</button>
          </div>
          {renderControls()}
        </div>
      ) : (
        /* --- NEW DEDICATED MOBILE SECTION --- */
        <>
          {!mobilePanelOpen && (
            <button className="mobile-open-btn" onClick={() => setMobilePanelOpen(true)}>
              ⚙️ Adjust Kerr Metrics
            </button>
          )}

          <div className={`astro-panel-mobile ${mobilePanelOpen ? 'open' : 'closed'}`}>
            <button className="mobile-close-btn" onClick={() => setMobilePanelOpen(false)}>✕</button>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingRight: '24px' }}>
              <div>
                <h3 className="astro-title">Cinematic Kerr Renderer</h3>
                <p className="astro-sub" style={{ margin: 0 }}>Swipe: Rotate | Pinch: Zoom</p>
              </div>
              <button onClick={resetCamera} style={{ fontSize: '10px', padding: '6px 10px', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '4px' }}>RESET</button>
            </div>
            
            {renderControls()}
          </div>
        </>
      )}
    </div>
  );
}