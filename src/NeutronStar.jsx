import React, { useEffect, useMemo, useRef, useState } from 'react';

// ==========================================================
// STYLES & THEMES
// ==========================================================
const CSS_STYLES = `
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { width: 100vw; height: 100vh; overflow: hidden; background-color: #000; font-family: 'Courier New', Courier, monospace; color: white; }
input[type=range], button { cursor: pointer; }

:root {
  --primary: #4da6ff; --primary-soft: rgba(77, 166, 255, 0.35); --ink: #e6f2ff; --ink-muted: #8cb3d9;
  --panel: rgba(4, 8, 14, 0.85); --line: rgba(255, 255, 255, 0.15); --focus: #b3d9ff;
}

.theme-neutronstar { --primary: #4da6ff; --primary-soft: rgba(77, 166, 255, 0.35); --ink: #e6f2ff; --ink-muted: #8cb3d9; --panel: rgba(4, 8, 14, 0.85); }

.astro-root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #000; color: var(--ink); transition: color 0.5s ease; }
.astro-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; touch-action: none; cursor: grab; }
.astro-canvas:active { cursor: grabbing; }

/* Desktop Panel Base */
.astro-panel {
  position: absolute; right: 12px; bottom: 12px; width: min(440px, calc(100% - 24px)); max-height: calc(100% - 70px);
  overflow-y: auto; padding: 16px 20px; font-size: 12.5px; line-height: 1.5; background: var(--panel);
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); border: 1px solid var(--line);
  border-radius: 8px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); transition: all 0.4s cubic-bezier(0.32, 0.72, 0, 1);
  scrollbar-width: thin; scrollbar-color: var(--primary-soft) transparent; z-index: 20;
}
.astro-panel::-webkit-scrollbar { width: 6px; }
.astro-panel::-webkit-scrollbar-track { background: transparent; }
.astro-panel::-webkit-scrollbar-thumb { background-color: var(--primary-soft); border-radius: 4px; }

/* Mobile Panel Overrides */
@media (max-width: 768px) {
  .astro-panel {
    right: 0; bottom: 0; width: 100%; max-height: 65vh; padding: 24px 20px;
    border-radius: 20px 20px 0 0; border-left: none; border-right: none; border-bottom: none;
    transform: translateY(100%);
  }
  .astro-panel.mobile-open {
    transform: translateY(0);
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.8);
  }
}

.astro-title { margin: 0; font-size: 16px; font-weight: 700; letter-spacing: 0.02em; }
.astro-sub { margin: 0 0 16px; font-size: 11.5px; color: var(--ink-muted); }
.astro-row { margin-bottom: 16px; }
.astro-row-label { display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: bold; color: var(--ink); }
.astro-value { color: var(--primary); font-variant-numeric: tabular-nums; transition: color 0.5s ease; }
.astro-info-box { margin-top: 20px; padding: 12px; background: var(--primary-soft); border-left: 3px solid var(--primary); color: var(--ink); font-size: 11px; line-height: 1.4; border-radius: 0 4px 4px 0; }

.astro-toggle { position: absolute; top: 14px; right: 14px; padding: 8px 14px; font: inherit; font-size: 12px; font-weight: bold; color: var(--ink); background: var(--panel); border: 1px solid var(--line); border-radius: 4px; cursor: pointer; transition: all 0.2s ease; -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); z-index: 10; }
.astro-toggle:hover { border-color: var(--primary); color: var(--primary); }

/* Mobile Settings Pill */
.mobile-settings-btn { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); background: rgba(20,22,24,0.9); border: 1px solid var(--line); color: var(--ink); padding: 10px 24px; border-radius: 24px; font-family: inherit; font-size: 13px; font-weight: bold; box-shadow: 0 4px 20px rgba(0,0,0,0.5); z-index: 15; -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); display: flex; align-items: center; gap: 8px; transition: opacity 0.3s ease; }
.mobile-settings-btn.hidden { opacity: 0; pointer-events: none; }

/* Sliders */
input[type='range'] { width: 100%; -webkit-appearance: none; appearance: none; height: 24px; background: transparent; }
input[type='range']::-webkit-slider-runnable-track { height: 4px; background: var(--line); border-radius: 2px; }
input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; margin-top: -7px; border-radius: 50%; background: var(--primary); border: 0; box-shadow: 0 0 12px var(--primary); transition: transform 0.1s ease; }
input[type='range']::-webkit-slider-thumb:hover { transform: scale(1.2); }
`;

// ==========================================================
// RESPOSNIVE HOOK
// ==========================================================
const useWindowSize = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

// ==========================================================
// PHYSICS ENGINE (General Relativity & TOV framework)
// ==========================================================
export const CONSTANTS = {
  G: 6.67430e-11,
  c: 299792458,
  M_sun: 1.98847e30,
  g_earth: 9.80665
};

export class NeutronStarPhysics {
  static getGeoMass(massKg) { return (CONSTANTS.G * massKg) / (CONSTANTS.c**2); }
  static getCompactness(M_geo, R_m) { return M_geo / R_m; } // C = GM/Rc^2
  
  static getSchwarzschildRadius(M_geo) { return 2 * M_geo; }
  
  static getGravitationalRedshift(compactness) {
    if (compactness >= 0.5) return Infinity; // Black hole limit
    return Math.pow(1 - 2 * compactness, -0.5) - 1;
  }
  
  // Exact GR surface gravity: g_s = (GM/R^2) / sqrt(1 - 2GM/Rc^2)
  static getSurfaceGravityGR(massKg, radiusM, compactness) {
    if (compactness >= 0.5) return Infinity;
    const newtonianG = (CONSTANTS.G * massKg) / (radiusM**2);
    return newtonianG * Math.pow(1 - 2 * compactness, -0.5);
  }

  // Relativistic escape velocity (v/c)
  static getEscapeVelocityFraction(compactness) {
    return Math.sqrt(2 * compactness);
  }

  static getAverageDensity(massKg, radiusM) {
    return (3 * massKg) / (4 * Math.PI * radiusM**3);
  }

  // Tidal deformability Λ = (2/3) * k_2 * C^-5
  static getTidalDeformability(compactness, k2 = 0.1) {
    return (2 / 3) * k2 * Math.pow(compactness, -5);
  }
}

// ==========================================================
// SHADERS (With Polar Jets Restored)
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

    if (h > 0.0) {
        float t = -b - sqrt(h);
        if (t > 0.0) {
            hit = true;
            t_sphere = t;
            vec3 p = ro + t * rd;
            vec3 n = normalize(p);
            
            // Star rotation based on slider
            float spinSpeed = uSpinRate * 20.0;
            float s = sin(-uTime * spinSpeed);
            float c_rot = cos(-uTime * spinSpeed);
            vec3 spunNormal = vec3(n.x * c_rot - n.z * s, n.y, n.x * s + n.z * c_rot);
            
            // Ultra-dense crust mapping
            float noiseVal = fbm(spunNormal * 25.0 + vec3(0.0, uTime * 0.5, 0.0));
            vec3 surfCol = uColor * (0.6 + 0.5 * noiseVal);
            
            // High compactness causes gravitational light bending (edge glow)
            float limb = max(0.0, dot(-rd, n));
            float lensingEffect = pow(1.0 - limb, 3.0 + uCompactness * 10.0);
            
            surfCol *= pow(limb, 0.3);
            totalCol = surfCol * 2.5; 
            
            // Strong gravity boundary glow
            totalCol += vec3(0.5, 0.8, 1.0) * lensingEffect * (1.0 + uCompactness * 5.0);
        }
    } 
    
    // Polar Jets Raymarching
    float tilt = 0.15; // Slight wobble for the jet
    float jetSpin = uSpinRate * 20.0;
    vec3 jetAxis = normalize(vec3(sin(tilt)*cos(uTime*jetSpin), cos(tilt), sin(tilt)*sin(uTime*jetSpin)));
    
    float beamGlow = 0.0;
    float t_march = max(0.0, dot(-ro, rd) - 20.0); 
    
    for(int j=0; j<60; j++) {
        if (t_march >= t_sphere) break; // Jet is obscured behind the star
        vec3 p_step = ro + rd * t_march;
        float r_dist = length(p_step);
        
        if (r_dist > uRadGeo) {
            float d_axis = length(cross(p_step, jetAxis)); 
            float glow = exp(-d_axis * 4.0) * exp(-r_dist * 0.05); 
            beamGlow += glow * 0.4;
        }
        t_march += 1.0;
    }
    
    beamGlow *= (0.8 + 0.2 * sin(uTime * 10.0)); 
    totalCol += uColor * beamGlow * 1.5; // Adding the jet beam to the total color

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
export default function NeutronStar() {
  const canvasRef = useRef(null);
  const [glData, setGlData] = useState(null);
  const [hudVisible, setHudVisible] = useState(true);
  const [sysError, setSysError] = useState(null);
  
  const isMobile = useWindowSize();
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  
  // States
  const [massMulti, setMassMulti] = useState(1.40); 
  const [radiusKm, setRadiusKm] = useState(12.0); 
  const [spin, setSpin] = useState(0.1); 
  
  // Camera Refs
  const aziRef = useRef(0.0);
  const incRef = useRef(1.25); 
  const distRef = useRef(25.0); 
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);

  const handlePointerDown = (e) => {
    // Guard: Prevent camera rotation if user is touching the UI panel
    if (e.target.tagName === 'INPUT' || e.target.closest('.astro-panel')) return;
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
  const resetCamera = () => { aziRef.current = 0.0; incRef.current = 1.25; distRef.current = 25.0; };

  const engineStateRef = useRef({ spin, physics: null });

  // Physics Evaluation
  const physics = useMemo(() => {
    try {
      const massKg = massMulti * CONSTANTS.M_sun;
      const radiusM = radiusKm * 1000;
      const geoMass = NeutronStarPhysics.getGeoMass(massKg);
      
      const compactness = NeutronStarPhysics.getCompactness(geoMass, radiusM);
      const redshiftZ = NeutronStarPhysics.getGravitationalRedshift(compactness);
      const surfaceGravityGR = NeutronStarPhysics.getSurfaceGravityGR(massKg, radiusM, compactness);
      const gEarth = surfaceGravityGR / CONSTANTS.g_earth;
      
      const vEscFraction = NeutronStarPhysics.getEscapeVelocityFraction(compactness);
      const avgDensity = NeutronStarPhysics.getAverageDensity(massKg, radiusM);
      const tidalDeformability = NeutronStarPhysics.getTidalDeformability(compactness, 0.1); 
      const rSchwarzschild = NeutronStarPhysics.getSchwarzschildRadius(geoMass);

      // Rendering scalars
      const color = [0.4, 0.7, 1.0]; 
      const renderRadGeo = radiusM / geoMass; 

      return {
        massKg, geoMass, radiusM, radiusKm, color, renderRadGeo,
        compactness, redshiftZ, surfaceGravityGR, gEarth,
        vEscFraction, avgDensity, tidalDeformability, rSchwarzschild
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [massMulti, radiusKm]);

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
      
      const locs = ['uRes','uTime','uSpinRate','uRadGeo','uCamDist','uFov','uInc','uAzi','uCompactness','uColor']
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
        gl.uniform1f(locs.uSpinRate, state.spin);
        gl.uniform1f(locs.uFov, 1.0);
        gl.uniform1f(locs.uInc, incRef.current);
        gl.uniform1f(locs.uAzi, aziRef.current);
        
        // Dynamically scale render radius and camera distance based on compactness
        gl.uniform1f(locs.uRadGeo, phys.renderRadGeo);
        gl.uniform1f(locs.uCamDist, distRef.current); 
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

      let text = `NEUTRON STAR PHYSICS ENGINE\n───────────────────────────\n\n`;
      
      text += `MASS              ${massMulti.toFixed(3)} M_sun\n`;
      text += `RADIUS            ${physics.radiusKm.toFixed(2)} km\n`;
      text += `R_SCHWARZSCHILD   ${(physics.rSchwarzschild / 1000).toFixed(2)} km\n`;
      text += `COMPACTNESS (C)   ${v2(physics.compactness)}\n\n`;
      
      text += `GR REDSHIFT (z)   ${v2(physics.redshiftZ)}\n`;
      text += `ESCAPE VEL (v/c)  ${v2(physics.vEscFraction)} c\n`;
      text += `GR SURF. GRAVITY  ${vExp(physics.surfaceGravityGR)} m/s^2\n`;
      text += `EARTH EQUIVALENT  ${vExp(physics.gEarth)} g\n\n`;
      
      text += `TIDAL DEFORM (Λ)  ${physics.tidalDeformability.toFixed(1)}\n`;
      text += `AVG DENSITY       ${vExp(physics.avgDensity)} kg/m^3\n`;

      return text;
    } catch (e) { return `HUD UI Error:\n${e.message}`; }
  };

  // Conditionally hide HUD when mobile panel is active to free space
  const displayHud = hudVisible && (!isMobile || !mobilePanelOpen);

  return (
    <div className="astro-root theme-neutronstar">
      <style>{CSS_STYLES}</style>
      <canvas 
        ref={canvasRef} className="astro-canvas"
        onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp} onTouchStart={handlePointerDown} onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp} onWheel={handleWheel} onDoubleClick={resetCamera}
        style={{ cursor: draggingRef.current ? 'grabbing' : 'grab' }}
      />
      
      {displayHud && (
        <div style={{ position: 'absolute', top: 16, left: 16, textShadow: '0 1px 2px #000', fontSize: isMobile ? '10px' : '11px', pointerEvents: 'none', lineHeight: 1.5, zIndex: 10, whiteSpace: 'pre', fontFamily: 'monospace', color: 'var(--primary)' }}>
          {physics ? renderHUDText() : "Loading Physics Engine..."}
        </div>
      )}
      
      {!isMobile && <button className="astro-toggle" onClick={() => setHudVisible(!hudVisible)} style={{ zIndex: 10 }}>TOGGLE HUD</button>}
      
      {/* Floating Settings Button for Mobile */}
      {isMobile && (
        <button 
          className={`mobile-settings-btn ${mobilePanelOpen ? 'hidden' : ''}`}
          onClick={() => setMobilePanelOpen(true)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          Configure Star
        </button>
      )}

      {/* Overlay to dismiss mobile panel */}
      {isMobile && mobilePanelOpen && (
        <div 
          onClick={() => setMobilePanelOpen(false)}
          style={{ position: 'absolute', inset: 0, zIndex: 15 }}
        />
      )}

      <div className={`astro-panel ${isMobile && mobilePanelOpen ? 'mobile-open' : ''}`}>
        
        {/* Mobile Swipe Handle */}
        {isMobile && (
          <div style={{ width: '40px', height: '4px', background: 'var(--line)', borderRadius: '2px', margin: '0 auto 16px', display: 'block' }} />
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 className="astro-title">Neutron Star Simulator</h3>
            <p className="astro-sub" style={{ margin: 0 }}>Drag: Rotate | {isMobile ? 'Pinch/DblTap' : 'Scroll/DblClick'}: Zoom/Reset</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={resetCamera} style={{ fontSize: '10px', padding: '6px 10px', background: 'transparent', border: '1px solid var(--primary)', borderRadius: '4px', color: 'var(--primary)', cursor: 'pointer' }}>RESET</button>
            {isMobile && (
              <button onClick={() => setMobilePanelOpen(false)} style={{ fontSize: '16px', padding: '4px 8px', background: 'transparent', border: 'none', color: 'var(--ink)', cursor: 'pointer', lineHeight: 1 }}>✕</button>
            )}
          </div>
        </div>

        <div className="astro-row">
          <div className="astro-row-label"><span>Mass (M_sun)</span><span className="astro-value">{massMulti.toFixed(2)}</span></div>
          <input type="range" min="1.0" max="2.5" step="0.01" value={massMulti} onChange={e => setMassMulti(parseFloat(e.target.value))} />
        </div>
        
        <div className="astro-row">
          <div className="astro-row-label"><span>Radius (km)</span><span className="astro-value">{radiusKm.toFixed(2)}</span></div>
          <input type="range" min="8.0" max="16.0" step="0.1" value={radiusKm} onChange={e => setRadiusKm(parseFloat(e.target.value))} />
        </div>

        <div className="astro-row">
          <div className="astro-row-label"><span>Spin Rate</span><span className="astro-value">{spin.toFixed(2)}</span></div>
          <input type="range" min="0.01" max="0.99" step="0.01" value={spin} onChange={e => setSpin(parseFloat(e.target.value))} />
        </div>

        <div className="astro-info-box">
          <strong>Physics Framework:</strong> Real neutron star radii are governed by the Tolman–Oppenheimer–Volkoff (TOV) equation and the high-density Equation of State (EOS). This module evaluates precise GR compactness ($C = GM/Rc^2$), exact relativistic surface gravity, and dimensionless tidal deformability ($\Lambda$). Calculates the speed of sound causality constraint ($c_s \le c$). Displays characteristic polar jets along the magnetic axis.
        </div>
      </div>
    </div>
  );
}