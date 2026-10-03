import React, { useEffect, useMemo, useRef, useState } from 'react';

// ==========================================================
// STYLES & THEMES
// ==========================================================
const CSS_STYLES = `
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { width: 100vw; height: 100vh; overflow: hidden; background-color: #000; font-family: 'Courier New', Courier, monospace; color: white; }
input[type=range], button { cursor: pointer; }

:root {
  --primary: #e67e22; --primary-soft: rgba(230, 126, 34, 0.35); --ink: #ecdcc8; --ink-muted: #a08c78;
  --panel: rgba(8, 6, 4, 0.85); --line: rgba(255, 255, 255, 0.15); --focus: #ffd29a;
}

.theme-browndwarf { --primary: #ff3b00; --primary-soft: rgba(255, 59, 0, 0.35); --ink: #ffd6cc; --ink-muted: #80331a; --panel: rgba(10, 4, 0, 0.85); }
.theme-reddwarf { --primary: #ff9b57; --primary-soft: rgba(255, 155, 87, 0.35); --ink: #ffebe0; --ink-muted: #b37340; --panel: rgba(12, 6, 4, 0.85); }
.theme-yellowdwarf { --primary: #ffd966; --primary-soft: rgba(255, 217, 102, 0.35); --ink: #fff2cc; --ink-muted: #bf9000; --panel: rgba(10, 8, 2, 0.85); }
.theme-whitedwarf { --primary: #e3e9ff; --primary-soft: rgba(227, 233, 255, 0.35); --ink: #ffffff; --ink-muted: #a3a8b8; --panel: rgba(8, 9, 12, 0.85); }
.theme-hotdwarf { --primary: #9bb2ff; --primary-soft: rgba(155, 178, 255, 0.35); --ink: #e6ebff; --ink-muted: #6b7ba6; --panel: rgba(4, 6, 12, 0.85); }

.astro-root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #000; color: var(--ink); transition: color 0.5s ease; }
.astro-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; touch-action: none; cursor: grab; }
.astro-canvas:active { cursor: grabbing; }

/* --- PC PANEL (Untouched) --- */
.astro-panel {
  position: absolute; right: 12px; bottom: 12px; width: min(460px, calc(100% - 24px)); max-height: calc(100% - 70px);
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
  padding: 12px 24px; background: rgba(8, 6, 4, 0.6); border: 1px solid var(--primary);
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

input[type='range'] { width: 100%; -webkit-appearance: none; appearance: none; height: 16px; background: transparent; }
input[type='range']::-webkit-slider-runnable-track { height: 3px; background: var(--line); border-radius: 2px; }
input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; margin-top: -5.5px; border-radius: 50%; background: var(--primary); border: 0; box-shadow: 0 0 10px var(--primary); transition: transform 0.1s ease; }
input[type='range']::-webkit-slider-thumb:hover { transform: scale(1.2); }

/* Responsive adjustments for mobile HUD */
@media (max-width: 768px) {
  .astro-hud { font-size: 9px !important; top: 50px !important; }
}
`;

// ==========================================================
// PHYSICS ENGINE: FUNDAMENTAL CONSTANTS (SI)
// ==========================================================
export const CONSTANTS = {
  G: 6.67430e-11,
  c: 299792458,
  h: 6.62607015e-34,
  hbar: 1.054571817e-34,
  k_B: 1.380649e-23,
  m_e: 9.1093837e-31,
  m_p: 1.6726219e-27,
  sigma_SB: 5.670374419e-8,
  M_sun: 1.98847e30,
  R_sun: 6.957e8,
  T_sun: 5772,
  e: 1.602176634e-19,
  eps_0: 8.8541878128e-12
};

// ==========================================================
// PHYSICS ENGINE: WHITE DWARF / STELLAR STRUCTURE
// ==========================================================
export class DwarfPhysics {
  
  // Gravitational Metrics
  static getGeoMass(massKg) { return (CONSTANTS.G * massKg) / (CONSTANTS.c**2); }
  static getSurfaceGravity(M, R) { return (CONSTANTS.G * M) / (R**2); }
  static getLogG(g_si) { return Math.log10(g_si * 100); } // Convert m/s^2 to cm/s^2 for astronomy log(g)
  static getEscapeVelocity(M, R) { return Math.sqrt((2 * CONSTANTS.G * M) / R); }
  static getCompactness(M, R) { return this.getGeoMass(M) / R; }
  
  // Exact Relativistic Gravitational Redshift
  static getRedshift(M, R) {
    const C = this.getCompactness(M, R);
    if (C >= 0.5) return Infinity;
    return Math.pow(1 - 2 * C, -0.5) - 1;
  }
  
  static getRedshiftVelocity(z) { return z * CONSTANTS.c; } // Returns m/s

  // Thermodynamics & Radiative Transfer
  static getLuminosity(R, T_eff) { return 4 * Math.PI * R**2 * CONSTANTS.sigma_SB * T_eff**4; }
  static getSolarLuminosityRatio(R, T_eff) {
    return Math.pow(R / CONSTANTS.R_sun, 2) * Math.pow(T_eff / CONSTANTS.T_sun, 4);
  }
  static getWiensPeak(T_eff) { 
    const b = 2.897771955e-3; 
    return b / T_eff; 
  }
  static getRadiationPressure(T) {
    const a = (4 * CONSTANTS.sigma_SB) / CONSTANTS.c;
    return (a * T**4) / 3;
  }
  
  // Quantum Mechanics & Degeneracy EoS
  static getFermiMomentum(rho, mu_e) {
    const n_e = rho / (mu_e * CONSTANTS.m_p);
    return CONSTANTS.hbar * Math.pow(3 * Math.PI**2 * n_e, 1/3);
  }
  
  static getExactFermiPressure(rho, mu_e) {
    const p_F = this.getFermiMomentum(rho, mu_e);
    const x = p_F / (CONSTANTS.m_e * CONSTANTS.c);
    const x2 = x * x;
    const term1 = x * (2 * x2 - 3) * Math.sqrt(x2 + 1);
    const term2 = 3 * Math.asinh(x);
    const coefficient = (Math.PI * CONSTANTS.m_e**4 * CONSTANTS.c**5) / (3 * CONSTANTS.h**3);
    return coefficient * (term1 + term2);
  }

  static getIonPressure(rho, T, mu_i) {
    return (rho * CONSTANTS.k_B * T) / (mu_i * CONSTANTS.m_p);
  }

  // Crystallization & Coulomb Coupling
  static getCoulombCoupling(rho, T, mu_i, Z) {
    const n_i = rho / (mu_i * CONSTANTS.m_p);
    const a = Math.pow(3 / (4 * Math.PI * n_i), 1/3); // Ion-sphere radius
    return (Z**2 * CONSTANTS.e**2) / (4 * Math.PI * CONSTANTS.eps_0 * a * CONSTANTS.k_B * T);
  }

  // Chandrasekhar Structure
  static getChandrasekharMass(mu_e) { return (5.83 / (mu_e**2)) * CONSTANTS.M_sun; }
  static getApproxRadius(massKg, mu_e) {
    const M_ch = this.getChandrasekharMass(mu_e);
    const R_0 = 7.0e6; 
    const massTerm = Math.pow(massKg / CONSTANTS.M_sun, -1/3);
    const relFactor = Math.sqrt(Math.max(0, 1 - Math.pow(massKg / M_ch, 4/3)));
    return R_0 * Math.pow(mu_e, -5/3) * massTerm * relFactor;
  }
}

// ==========================================================
// COLOR MAPPING
// ==========================================================
const getDwarfColor = (temp) => {
  const stops = [
    { t: 1000, c: [255, 15, 0] },    
    { t: 3000, c: [255, 100, 0] },   
    { t: 5800, c: [255, 230, 190] },  
    { t: 10000, c: [210, 225, 255] }, 
    { t: 30000, c: [60, 110, 255] }   
  ];
  let lower = stops[0], upper = stops[stops.length-1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (temp >= stops[i].t && temp <= stops[i+1].t) {
      lower = stops[i]; upper = stops[i+1]; break;
    }
  }
  if (temp <= stops[0].t) return [stops[0].c[0]/255, stops[0].c[1]/255, stops[0].c[2]/255];
  if (temp >= stops[stops.length-1].t) return [upper.c[0]/255, upper.c[1]/255, upper.c[2]/255];
  const factor = (temp - lower.t) / (upper.t - lower.t);
  return [
    (lower.c[0] + (upper.c[0] - lower.c[0]) * factor) / 255,
    (lower.c[1] + (upper.c[1] - lower.c[1]) * factor) / 255,
    (lower.c[2] + (upper.c[2] - lower.c[2]) * factor) / 255
  ];
};

const getDwarfTheme = (temp) => {
  if (temp < 2000) return 'theme-browndwarf';
  if (temp < 4500) return 'theme-reddwarf';
  if (temp < 7500) return 'theme-yellowdwarf';
  if (temp < 20000) return 'theme-whitedwarf';
  return 'theme-hotdwarf';
};

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
uniform float uRadGeo;
uniform float uCamDist;
uniform float uFov;
uniform float uInc;
uniform float uAzi;
uniform vec3  uColor;

out vec4 fragColor;

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

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*uRes)/min(uRes.x, uRes.y);
    
    vec3 ro = vec3(uCamDist * sin(uInc) * cos(uAzi), uCamDist * cos(uInc), uCamDist * sin(uInc) * sin(uAzi));
    vec3 forward = normalize(-ro);
    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
    vec3 up = cross(forward, right);
    vec3 rd = normalize(forward + uv.x * uFov * right + uv.y * uFov * up);

    float b = dot(ro, rd);
    float c = dot(ro, ro) - uRadGeo * uRadGeo;
    float h = b*b - c;

    vec3 totalCol = vec3(0.0);

    if (h > 0.0) {
        float t = -b - sqrt(h);
        if (t > 0.0) {
            vec3 p = ro + t * rd;
            vec3 n = normalize(p);
            
            float spinMult = 2.5; 
            float s = sin(-uTime * uSpin * spinMult);
            float c_rot = cos(-uTime * uSpin * spinMult);
            vec3 spunNormal = vec3(n.x * c_rot - n.z * s, n.y, n.x * s + n.z * c_rot);
            
            float noiseVal = fbm(spunNormal * 12.0 + vec3(0.0, 0.0, uTime * 0.4));
            vec3 surfCol = uColor * (0.7 + 0.4 * noiseVal);
            
            float limb = max(0.0, dot(-rd, n));
            surfCol *= pow(limb, 0.4);
            
            float oblateness = 1.0 - (n.y * n.y * clamp(uSpin, 0.0, 0.3));
            surfCol *= oblateness;

            totalCol = surfCol * 1.5; 
        }
    } else {
        vec3 spaceColor = vec3(0.005, 0.010, 0.015);
        float starHash = hash(floor(rd * 300.0));
        if (starHash > 0.995) spaceColor += vec3(0.9, 0.95, 1.0) * (starHash - 0.995) * 80.0;
        totalCol += spaceColor;
    }

    totalCol = (totalCol * (2.51 * totalCol + 0.03)) / (totalCol * (2.43 * totalCol + 0.59) + 0.14);
    fragColor = vec4(pow(clamp(totalCol, 0.0, 1.0), vec3(1.0/2.2)), 1.0);
}
`;

// ==========================================================
// REACT COMPONENT
// ==========================================================
export default function DwarfStar() {
  const canvasRef = useRef(null);
  const [glData, setGlData] = useState(null);
  const [hudVisible, setHudVisible] = useState(true);
  const [sysError, setSysError] = useState(null);
  
  // Responsive States
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  const [massMulti, setMassMulti] = useState(1.0); 
  const [starTemp, setStarTemp] = useState(15000);
  const [spin, setSpin] = useState(0.05); 
  const [composition, setComposition] = useState('CO'); // Carbon-Oxygen by default
  
  const aziRef = useRef(0.0);
  const incRef = useRef(1.25); 
  const distRef = useRef(15.0); 
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
  const handleWheel = (e) => { distRef.current = Math.max(5.0, Math.min(100.0, distRef.current + e.deltaY * 0.05)); };
  const resetCamera = () => { aziRef.current = 0.0; incRef.current = 1.25; distRef.current = 15.0; };

  const engineStateRef = useRef({ spin, physics: null });

  const physics = useMemo(() => {
    try {
      // 1. Establish Composition (Carbon/Oxygen core)
      const mu_e = 2.0; 
      const mu_i = composition === 'CO' ? 14.0 : 4.0; // Mean ion weight (approx C/O mix vs He)
      const Z = composition === 'CO' ? 7.0 : 2.0; // Mean atomic number

      // 2. Fundamental Structure
      const massKg = massMulti * CONSTANTS.M_sun;
      const radiusM = DwarfPhysics.getApproxRadius(massKg, mu_e); 
      const volume = (4/3) * Math.PI * radiusM**3;
      const avgRho = massKg / volume;
      
      // 3. Gravity & Relativity
      const g_si = DwarfPhysics.getSurfaceGravity(massKg, radiusM);
      const log_g = DwarfPhysics.getLogG(g_si);
      const escapeVel = DwarfPhysics.getEscapeVelocity(massKg, radiusM);
      const redshiftZ = DwarfPhysics.getRedshift(massKg, radiusM);
      const redshiftV = DwarfPhysics.getRedshiftVelocity(redshiftZ);
      
      // 4. Equation of State (Pressures)
      const P_e = DwarfPhysics.getExactFermiPressure(avgRho, mu_e);
      const P_i = DwarfPhysics.getIonPressure(avgRho, starTemp, mu_i);
      const P_rad = DwarfPhysics.getRadiationPressure(starTemp);
      const P_total = P_e + P_i + P_rad;

      // 5. Crystallization limit
      const coulombGamma = DwarfPhysics.getCoulombCoupling(avgRho, starTemp, mu_i, Z);
      const isCrystallized = coulombGamma >= 175;

      // 6. Luminosity & Spectrum
      const L_watts = DwarfPhysics.getLuminosity(radiusM, starTemp);
      const L_ratio = DwarfPhysics.getSolarLuminosityRatio(radiusM, starTemp);
      const lambdaMax = DwarfPhysics.getWiensPeak(starTemp) * 1e9; // nanometers
      
      // 7. Visual parameters
      const color = getDwarfColor(starTemp);
      // Dynamic rendering radius based on physical radius to fix the static ball size issue
      // Note the inverse mass-radius relation: heavier white dwarfs are smaller!
      const renderRadGeo = 7.0 * (radiusM / 5.0e6); 

      return {
        massKg, radiusM, avgRho,
        g_si, log_g, escapeVel, redshiftZ, redshiftV,
        P_e, P_i, P_rad, P_total,
        coulombGamma, isCrystallized,
        L_watts, L_ratio, lambdaMax,
        color, renderRadGeo
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [massMulti, spin, starTemp, composition]);

  useEffect(() => { engineStateRef.current = { spin, physics }; }, [spin, physics]);

  // WebGL Setup
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
      
      const locs = ['uRes','uTime','uSpin','uRadGeo','uCamDist','uFov','uInc','uAzi','uColor']
        .reduce((acc, name) => ({ ...acc, [name]: gl.getUniformLocation(p, name) }), {});
        
      setGlData({ gl, p, locs });
    } catch (e) { setSysError(`Shader Compilation Failed: ${e.message}`); }
  }, []);

  // WebGL Render Loop
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
        gl.uniform1f(locs.uFov, 1.0);
        gl.uniform1f(locs.uInc, incRef.current);
        gl.uniform1f(locs.uAzi, aziRef.current);
        gl.uniform1f(locs.uRadGeo, phys.renderRadGeo);
        gl.uniform1f(locs.uCamDist, distRef.current); 
        gl.uniform3fv(locs.uColor, new Float32Array(phys.color)); 
        
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

  const currentTheme = getDwarfTheme(starTemp);

  const renderHUDText = () => {
    try {
      const v2 = (v) => (v !== undefined && isFinite(v)) ? v.toFixed(3) : "∞";
      const vExp = (v) => (v !== undefined && isFinite(v) && v > 0) ? v.toExponential(2) : "0";

      let text = `WHITE DWARF PHYSICS ENGINE\n──────────────────────────\n\n`;
      text += `MASS              ${massMulti.toFixed(2)} M_sun\n`;
      text += `RADIUS            ${vExp(physics.radiusM)} m (${v2(physics.radiusM / CONSTANTS.R_sun)} R_sun)\n`;
      text += `AVG DENSITY       ${vExp(physics.avgRho)} kg/m^3\n`;
      text += `TEMPERATURE       ${starTemp} K\n\n`;
      
      text += `LUMINOSITY        ${vExp(physics.L_watts)} W (${vExp(physics.L_ratio)} L_sun)\n`;
      text += `PEAK WAVELENGTH   ${physics.lambdaMax.toFixed(1)} nm\n\n`;
      
      text += `SURFACE GRAVITY   ${vExp(physics.g_si)} m/s^2\n`;
      text += `LOG G (cgs)       ${physics.log_g.toFixed(2)}\n`;
      text += `RED SHIFT (z)     ${v2(physics.redshiftZ)} (${(physics.redshiftV / 1000).toFixed(1)} km/s)\n`;
      text += `ESCAPE VELOCITY   ${(physics.escapeVel / 1000).toFixed(1)} km/s\n\n`;
      
      text += `EXACT FERMI PRES. ${vExp(physics.P_e)} Pa\n`;
      text += `ION PRESSURE      ${vExp(physics.P_i)} Pa\n`;
      text += `RAD. PRESSURE     ${vExp(physics.P_rad)} Pa\n\n`;
      
      text += `COULOMB COUPLING  Γ = ${physics.coulombGamma.toFixed(1)}\n`;
      text += `CORE STATE        ${physics.isCrystallized ? 'CRYSTALLIZED LATTICE' : 'DEGENERATE PLASMA'}\n`;

      return text;
    } catch (e) { return `HUD UI Error:\n${e.message}`; }
  };

  // Shared Slider Control UI (to avoid duplication between PC/Mobile panels)
  const renderControls = () => (
    <>
      <div className="astro-row">
        <div className="astro-row-label"><span>Mass (M_sun)</span><span className="astro-value">{massMulti.toFixed(2)}</span></div>
        <input type="range" min="0.1" max="1.44" step="0.01" value={massMulti} onChange={e => setMassMulti(parseFloat(e.target.value))} />
      </div>
      
      <div className="astro-row">
        <div className="astro-row-label"><span>Effective Temperature (K)</span><span className="astro-value">{starTemp} K</span></div>
        <input type="range" min="1000" max="30000" step="100" value={starTemp} onChange={e => setStarTemp(parseInt(e.target.value))} />
      </div>

      <div className="astro-row">
        <div className="astro-row-label"><span>Core Composition</span><span className="astro-value">{composition}</span></div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button onClick={() => setComposition('He')} style={{ flex: 1, padding: '4px', background: composition==='He' ? 'var(--primary)' : 'transparent', color: composition==='He' ? '#000' : 'var(--ink)', border: '1px solid var(--primary)', borderRadius: '4px' }}>Helium</button>
          <button onClick={() => setComposition('CO')} style={{ flex: 1, padding: '4px', background: composition==='CO' ? 'var(--primary)' : 'transparent', color: composition==='CO' ? '#000' : 'var(--ink)', border: '1px solid var(--primary)', borderRadius: '4px' }}>Carbon-Oxygen</button>
        </div>
      </div>

      <div className="astro-info-box">
        <strong>Physics Models:</strong> Computes the exact ultra-relativistic electron degeneracy Fermi pressure equation of state. Because of electron degeneracy pressure, notice the <strong>inverse mass-radius relation</strong>: as you increase the mass, the star visually and physically shrinks until it nears the Chandrasekhar limit (1.44 $M_\odot$).
      </div>
    </>
  );

  return (
    <div className={`astro-root ${currentTheme}`}>
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
              <h3 className="astro-title">White Dwarf Simulator</h3>
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
              ⚙️ Adjust White Dwarf Physics
            </button>
          )}

          <div className={`astro-panel-mobile ${mobilePanelOpen ? 'open' : 'closed'}`}>
            <button className="mobile-close-btn" onClick={() => setMobilePanelOpen(false)}>✕</button>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingRight: '24px' }}>
              <div>
                <h3 className="astro-title">White Dwarf Simulator</h3>
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