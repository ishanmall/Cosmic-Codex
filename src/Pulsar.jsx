import React, { useEffect, useMemo, useRef, useState } from 'react';

// ==========================================================
// ASTROPHYSICAL DATA
// ==========================================================
const OBSERVED_PULSARS = [
  { id: "crab", name: "Crab Pulsar (B0531+21)", mass: 1.4, radius: 10.0, pMs: 33.5, pDotExp: 12.4 },
  { id: "vela", name: "Vela Pulsar (B0833-45)", mass: 1.4, radius: 12.0, pMs: 89.3, pDotExp: 12.9 },
  { id: "j1748", name: "PSR J1748-2446ad (Fastest)", mass: 1.8, radius: 11.5, pMs: 1.39, pDotExp: 19.5 },
  { id: "custom", name: "Custom Configuration", mass: 1.5, radius: 12.0, pMs: 50.0, pDotExp: 15.0 }
];

// ==========================================================
// STYLES & THEMES
// ==========================================================
const CSS_STYLES = `
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { width: 100vw; height: 100vh; overflow: hidden; background-color: #000; font-family: 'Courier New', Courier, monospace; color: white; }
input[type=range], select, button { cursor: pointer; }

:root {
  --primary: #00ffff; --primary-soft: rgba(0, 255, 255, 0.35); --ink: #e6ffff; --ink-muted: #66cccc;
  --panel: rgba(2, 10, 14, 0.85); --line: rgba(255, 255, 255, 0.15); --focus: #ccffff;
}

.theme-pulsar { --primary: #00ffff; --primary-soft: rgba(0, 255, 255, 0.35); --ink: #e6ffff; --ink-muted: #66cccc; --panel: rgba(2, 10, 14, 0.85); }

.astro-root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #000; color: var(--ink); transition: color 0.5s ease; }
.astro-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; touch-action: none; cursor: grab; }
.astro-canvas:active { cursor: grabbing; }

/* --- PC PANEL (Untouched) --- */
.astro-panel {
  position: absolute; right: 12px; bottom: 12px; width: min(440px, calc(100% - 24px)); max-height: calc(100% - 70px);
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
  padding: 12px 24px; background: rgba(2, 10, 14, 0.6); border: 1px solid var(--primary);
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

select {
  width: 100%; padding: 6px; background: rgba(0,0,0,0.5); color: var(--ink);
  border: 1px solid var(--line); border-radius: 4px; margin-bottom: 16px;
  font-family: inherit; font-size: 12px;
}
select option { background: #000; }

/* Responsive adjustments for mobile HUD */
@media (max-width: 768px) {
  .astro-hud { font-size: 9px !important; top: 50px !important; }
}
`;

// ==========================================================
// PHYSICS ENGINE (Pulsar Math & General Relativity)
// ==========================================================
export const CONSTANTS = {
  G: 6.67430e-11,
  c: 299792458,
  M_sun: 1.98847e30,
  yr_to_s: 3.15576e7,
  I_ns: 1e38 // Standard representative moment of inertia in kg m^2
};

export class PulsarPhysics {
  // --- Relativity & Structure ---
  static getGeoMass(massKg) { return (CONSTANTS.G * massKg) / (CONSTANTS.c**2); }
  static getCompactness(M_geo, R_m) { return M_geo / R_m; }
  static getGravitationalRedshift(C) { return C >= 0.5 ? Infinity : Math.pow(1 - 2 * C, -0.5) - 1; }
  static getSurfaceGravityGR(massKg, radiusM, C) {
    if (C >= 0.5) return Infinity;
    return ((CONSTANTS.G * massKg) / (radiusM**2)) * Math.pow(1 - 2 * C, -0.5);
  }

  // --- Pulsar Timing & Kinematics ---
  static getFrequency(P) { return 1 / P; }
  static getAngularVelocity(P) { return (2 * Math.PI) / P; }
  static getEquatorialVelocity(R, P) { return (2 * Math.PI * R) / P; }
  
  // --- Pulsar Energetics ---
  static getRotationalEnergy(I, Omega) { return 0.5 * I * Omega**2; }
  static getSpinDownLuminosity(I, P, Pdot) { 
    return (4 * Math.PI**2 * I * Pdot) / Math.pow(P, 3); 
  }
  
  // --- Magnetic Field & Age ---
  static getCharacteristicAge(P, Pdot) { return P / (2 * Pdot); } // Returns seconds
  static getInferredSurfaceB(P, Pdot) { 
    return 3.2e19 * Math.sqrt(P * Pdot); 
  }
  
  // --- Magnetosphere ---
  static getLightCylinderRadius(P) { return (CONSTANTS.c * P) / (2 * Math.PI); }
  static getBAtLightCylinder(B_s, R, R_LC) {
    if (R_LC <= R) return B_s;
    return B_s * Math.pow(R / R_LC, 3);
  }
}

// ==========================================================
// SHADERS (Volumetric Sweeping Beams)
// ==========================================================
const VERTEX_SRC = `#version 300 es
in vec2 p; out vec2 vUv;
void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAGMENT_SRC = `#version 300 es
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform float uSpinRate;
uniform float uRadGeo;
uniform float uCamDist;
uniform float uFov;
uniform float uInc;
uniform float uAzi;
uniform float uBeamAngle;
uniform float uCompactness;
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
    bool hit = false;
    float t_sphere = 9999.0;

    // Visual Spin Mapping
    float s = sin(-uTime * uSpinRate);
    float c_rot = cos(-uTime * uSpinRate);

    if (h > 0.0) {
        float t = -b - sqrt(h);
        if (t > 0.0) {
            hit = true;
            t_sphere = t;
            vec3 p = ro + t * rd;
            vec3 n = normalize(p);
            
            vec3 spunNormal = vec3(n.x * c_rot - n.z * s, n.y, n.x * s + n.z * c_rot);
            
            // Crust surface mapping
            float noiseVal = fbm(spunNormal * 25.0 + vec3(0.0, uTime * 2.0, 0.0));
            vec3 surfCol = uColor * (0.5 + 0.6 * noiseVal);
            
            // Extremely hot magnetic poles emitting radiation
            float poleBright = pow(abs(n.y), 6.0); 
            surfCol += vec3(2.0, 3.5, 4.0) * poleBright;
            
            float limb = max(0.0, dot(-rd, n));
            float lensingEffect = pow(1.0 - limb, 3.0 + uCompactness * 8.0);
            
            surfCol *= pow(limb, 0.3);
            
            // Extreme spin oblateness
            float oblateness = 1.0 - (n.y * n.y * clamp(uSpinRate * 0.005, 0.0, 0.3));
            surfCol *= oblateness;

            totalCol = surfCol * 2.0; 
            
            // Atmospheric glow/scattering
            totalCol += vec3(0.0, 0.8, 1.0) * lensingEffect * 1.5;
        }
    } 
    
    // Sweeping Lighthouse Beams (Offset by beam angle alpha)
    float tilt = radians(uBeamAngle);
    vec3 magAxis = normalize(vec3(sin(tilt)*cos(uTime*uSpinRate), cos(tilt), sin(tilt)*sin(uTime*uSpinRate)));
    
    float beamGlow = 0.0;
    float t_march = max(0.0, dot(-ro, rd) - 30.0); 
    
    // Raymarch the sweeping conical beam
    for(int j=0; j<60; j++) {
        if (t_march >= t_sphere) break;
        vec3 p_step = ro + rd * t_march;
        float r_dist = length(p_step);
        
        if (r_dist > uRadGeo) {
            float d_axis = length(cross(p_step, magAxis)); 
            
            // Tapered sweeping conical beam emitting from poles
            float glow = exp(-d_axis * 15.0) * exp(-r_dist * 0.04); 
            beamGlow += glow * 1.5;
        }
        t_march += 1.0;
    }
    
    beamGlow *= (0.8 + 0.2 * fbm(vec3(uTime * 50.0, 0.0, 0.0))); // High-frequency beam turbulence
    
    vec3 jetColor = vec3(0.1, 1.5, 3.5); 
    totalCol += jetColor * beamGlow * clamp(uSpinRate * 0.05, 1.0, 4.0);

    // Dynamic Starfield background
    if (!hit && totalCol.x < 0.1) {
        vec3 spaceColor = vec3(0.002, 0.005, 0.010);
        float starHash = hash(floor(rd * 400.0));
        if (starHash > 0.996) spaceColor += vec3(0.7, 0.9, 1.0) * (starHash - 0.996) * 120.0;
        totalCol += spaceColor;
    }

    totalCol = (totalCol * (2.51 * totalCol + 0.03)) / (totalCol * (2.43 * totalCol + 0.59) + 0.14);
    fragColor = vec4(pow(clamp(totalCol, 0.0, 1.0), vec3(1.0/2.2)), 1.0);
}
`;

// ==========================================================
// REACT COMPONENT
// ==========================================================
export default function Pulsar() {
  const canvasRef = useRef(null);
  const [glData, setGlData] = useState(null);
  const [hudVisible, setHudVisible] = useState(true);
  const [sysError, setSysError] = useState(null);
  
  // Responsive States
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  // States
  const [activeProfile, setActiveProfile] = useState(OBSERVED_PULSARS[0].id);
  const [massMulti, setMassMulti] = useState(OBSERVED_PULSARS[0].mass); 
  const [radiusKm, setRadiusKm] = useState(OBSERVED_PULSARS[0].radius); 
  const [spinPeriodMs, setSpinPeriodMs] = useState(OBSERVED_PULSARS[0].pMs); 
  const [pDotExp, setPDotExp] = useState(OBSERVED_PULSARS[0].pDotExp); 
  const [beamAngle, setBeamAngle] = useState(45.0); 
  
  // Camera Refs
  const aziRef = useRef(0.0);
  const incRef = useRef(1.25); 
  const distRef = useRef(25.0); 
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
  const handleWheel = (e) => { distRef.current = Math.max(5.0, Math.min(80.0, distRef.current + e.deltaY * 0.05)); };
  const resetCamera = () => { aziRef.current = 0.0; incRef.current = 1.25; distRef.current = 25.0; };

  // Profile Selection Handler
  const handleProfileChange = (e) => {
    const profileId = e.target.value;
    setActiveProfile(profileId);
    const profile = OBSERVED_PULSARS.find(s => s.id === profileId);
    if (profile) {
      setMassMulti(profile.mass);
      setRadiusKm(profile.radius);
      setSpinPeriodMs(profile.pMs);
      setPDotExp(profile.pDotExp);
    }
  };

  const handleCustomChange = (setter) => (e) => {
    setter(parseFloat(e.target.value));
    setActiveProfile('custom');
  };

  const engineStateRef = useRef({ spinPeriodMs, beamAngle, physics: null });

  // Physics Evaluation
  const physics = useMemo(() => {
    try {
      const massKg = massMulti * CONSTANTS.M_sun;
      const radiusM = radiusKm * 1000;
      const geoMass = PulsarPhysics.getGeoMass(massKg);
      
      const P_sec = spinPeriodMs / 1000;
      const P_dot = Math.pow(10, -pDotExp);

      // Relativity
      const compactness = PulsarPhysics.getCompactness(geoMass, radiusM);
      const redshiftZ = PulsarPhysics.getGravitationalRedshift(compactness);
      const surfaceGravityGR = PulsarPhysics.getSurfaceGravityGR(massKg, radiusM, compactness);
      
      // Kinematics & Timing
      const freq = PulsarPhysics.getFrequency(P_sec);
      const Omega = PulsarPhysics.getAngularVelocity(P_sec);
      const v_eq = PulsarPhysics.getEquatorialVelocity(radiusM, P_sec);
      const v_eq_c = v_eq / CONSTANTS.c;
      
      // Energetics
      const I = CONSTANTS.I_ns;
      const E_rot = PulsarPhysics.getRotationalEnergy(I, Omega);
      const E_dot = PulsarPhysics.getSpinDownLuminosity(I, P_sec, P_dot);
      
      // Magnetosphere & Age
      const charAgeSec = PulsarPhysics.getCharacteristicAge(P_sec, P_dot);
      const charAgeYr = charAgeSec / CONSTANTS.yr_to_s;
      const B_surface_G = PulsarPhysics.getInferredSurfaceB(P_sec, P_dot);
      
      const R_LC = PulsarPhysics.getLightCylinderRadius(P_sec);
      const B_LC_G = PulsarPhysics.getBAtLightCylinder(B_surface_G, radiusM, R_LC);

      // Rendering scalars
      const color = [0.1, 0.8, 1.0]; 
      const renderRadGeo = radiusM / geoMass; 

      return {
        massKg, geoMass, radiusM, radiusKm, color, renderRadGeo,
        compactness, redshiftZ, surfaceGravityGR, 
        freq, Omega, v_eq, v_eq_c,
        I, E_rot, E_dot,
        P_dot, charAgeYr, B_surface_G, R_LC, B_LC_G
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [massMulti, radiusKm, spinPeriodMs, pDotExp]);

  useEffect(() => { engineStateRef.current = { spinPeriodMs, beamAngle, physics }; }, [spinPeriodMs, beamAngle, physics]);

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
      
      const locs = ['uRes','uTime','uSpinRate','uRadGeo','uCamDist','uFov','uInc','uAzi','uBeamAngle','uCompactness','uColor']
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
        
        // Map physical frequency to a capped visual spin rate
        const visualSpin = Math.min(phys.freq * 2.0, 100.0);
        gl.uniform1f(locs.uSpinRate, visualSpin);
        
        gl.uniform1f(locs.uFov, 1.0);
        gl.uniform1f(locs.uInc, incRef.current);
        gl.uniform1f(locs.uAzi, aziRef.current);
        gl.uniform1f(locs.uRadGeo, phys.renderRadGeo);
        gl.uniform1f(locs.uCamDist, distRef.current); 
        gl.uniform1f(locs.uBeamAngle, state.beamAngle);
        gl.uniform1f(locs.uCompactness, phys.compactness);
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

  const renderHUDText = () => {
    try {
      const v2 = (v) => (v !== undefined && isFinite(v)) ? v.toFixed(3) : "∞";
      const vExp = (v) => (v !== undefined && isFinite(v) && v > 0) ? v.toExponential(2) : "0";
      const currentProfile = OBSERVED_PULSARS.find(s => s.id === activeProfile) || OBSERVED_PULSARS[0];

      let text = `PULSAR PHYSICS ENGINE\n─────────────────────\n`;
      text += `MODEL:            ${currentProfile.name}\n\n`;
      
      text += `MASS              ${massMulti.toFixed(3)} M_sun\n`;
      text += `RADIUS            ${physics.radiusKm.toFixed(2)} km\n`;
      text += `COMPACTNESS (C)   ${v2(physics.compactness)}\n\n`;
      
      text += `SPIN PERIOD (P)   ${spinPeriodMs.toFixed(3)} ms\n`;
      text += `FREQUENCY (ν)     ${physics.freq.toFixed(2)} Hz\n`;
      text += `OMEGA             ${vExp(physics.Omega)} rad/s\n`;
      text += `PERIOD DERIV (Ṗ)  10^-${pDotExp.toFixed(2)} s/s\n\n`;
      
      text += `INFERRED SURF B   ${vExp(physics.B_surface_G)} G\n`;
      text += `LIGHT CYLINDER R. ${(physics.R_LC / 1000).toFixed(1)} km\n`;
      text += `B AT LIGHT CYL.   ${vExp(physics.B_LC_G)} G\n`;
      text += `CHAR. AGE (τ)     ${vExp(physics.charAgeYr)} yr\n\n`;
      
      text += `EQUAT. VELOCITY   ${vExp(physics.v_eq)} m/s (${v2(physics.v_eq_c)} c)\n`;
      text += `ROTATIONAL ENERGY ${vExp(physics.E_rot)} J\n`;
      text += `SPIN-DOWN LUMIN.  ${vExp(physics.E_dot)} W\n`;

      return text;
    } catch (e) { return `HUD UI Error:\n${e.message}`; }
  };

  // Shared Slider Control UI (to avoid duplication between PC/Mobile panels)
  const renderControls = () => (
    <>
      <select value={activeProfile} onChange={handleProfileChange}>
        {OBSERVED_PULSARS.map(star => (
          <option key={star.id} value={star.id}>{star.name}</option>
        ))}
      </select>

      <div className="astro-row">
        <div className="astro-row-label"><span>Mass (M_sun)</span><span className="astro-value">{massMulti.toFixed(2)}</span></div>
        <input type="range" min="1.0" max="2.5" step="0.01" value={massMulti} onChange={handleCustomChange(setMassMulti)} />
      </div>
      
      <div className="astro-row">
        <div className="astro-row-label"><span>Radius (km)</span><span className="astro-value">{radiusKm.toFixed(2)}</span></div>
        <input type="range" min="8.0" max="16.0" step="0.1" value={radiusKm} onChange={handleCustomChange(setRadiusKm)} />
      </div>

      <div className="astro-row">
        <div className="astro-row-label"><span>Spin Period (ms)</span><span className="astro-value">{spinPeriodMs.toFixed(2)}</span></div>
        <input type="range" min="1.0" max="1000.0" step="0.1" value={spinPeriodMs} onChange={handleCustomChange(setSpinPeriodMs)} />
      </div>

      <div className="astro-row">
        <div className="astro-row-label"><span>Period Deriv (-log10 P_dot)</span><span className="astro-value">10^-{pDotExp.toFixed(1)}</span></div>
        <input type="range" min="10.0" max="22.0" step="0.1" value={pDotExp} onChange={handleCustomChange(setPDotExp)} />
      </div>

      <div className="astro-row">
        <div className="astro-row-label"><span>Magnetic Inclination (α)</span><span className="astro-value">{beamAngle.toFixed(1)}°</span></div>
        <input type="range" min="0.0" max="90.0" step="1.0" value={beamAngle} onChange={handleCustomChange(setBeamAngle)} />
      </div>

      <div className="astro-info-box">
        <strong>Pulsar Physics Framework:</strong> Models a rapid rotating neutron star losing energy via dipole braking. Calculates Spin-Down Luminosity (E_dot = 4π²I P_dot / P³), Characteristic Age (τ_c = P / 2P_dot), and inferred dipole field (B_s = 3.2×10¹⁹ √(P P_dot)). Includes accurate light-cylinder scaling (R_LC = c/Ω) mapping observational timing parameters from the NASA/ATNF catalog directly into the physical model.
      </div>
    </>
  );

  return (
    <div className="astro-root theme-pulsar">
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
              <h3 className="astro-title">Pulsar Simulator</h3>
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
              ⚙️ Adjust Pulsar Physics
            </button>
          )}

          <div className={`astro-panel-mobile ${mobilePanelOpen ? 'open' : 'closed'}`}>
            <button className="mobile-close-btn" onClick={() => setMobilePanelOpen(false)}>✕</button>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingRight: '24px' }}>
              <div>
                <h3 className="astro-title">Pulsar Simulator</h3>
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