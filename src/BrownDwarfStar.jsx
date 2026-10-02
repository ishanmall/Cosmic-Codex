import React, { useEffect, useMemo, useRef, useState } from 'react';

// ==========================================================
// STYLES & THEMES
// ==========================================================
const CSS_STYLES = `
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { width: 100vw; height: 100vh; overflow: hidden; background-color: #000; font-family: 'Courier New', Courier, monospace; color: white; }
input[type=range], button { cursor: pointer; }

:root {
  --primary: #ff5500; --primary-soft: rgba(255, 85, 0, 0.35); --ink: #ffddcc; --ink-muted: #b35930;
  --panel: rgba(12, 4, 0, 0.85); --line: rgba(255, 255, 255, 0.15); --focus: #ff884d;
}

.theme-browndwarf { --primary: #ff5500; --primary-soft: rgba(255, 85, 0, 0.35); --ink: #ffddcc; --ink-muted: #b35930; --panel: rgba(12, 4, 0, 0.85); }

.astro-root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #000; color: var(--ink); transition: color 0.5s ease; }
.astro-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; touch-action: none; cursor: grab; }
.astro-canvas:active { cursor: grabbing; }

.astro-panel {
  position: absolute; right: 12px; bottom: 12px; width: min(440px, calc(100% - 24px)); max-height: calc(100% - 70px);
  overflow-y: auto; padding: 16px 20px; font-size: 12.5px; line-height: 1.5; background: var(--panel);
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); border: 1px solid var(--line);
  border-radius: 8px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); transition: background-color 0.5s ease, border-color 0.5s ease;
  scrollbar-width: thin; scrollbar-color: var(--primary-soft) transparent;
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
`;

// ==========================================================
// PHYSICS ENGINE (Substellar Structure & Brown Dwarf Math)
// ==========================================================
export const CONSTANTS = {
  G: 6.67430e-11,
  c: 299792458,
  h: 6.62607015e-34,
  hbar: 1.054571817e-34,
  k_B: 1.380649e-23,
  m_e: 9.1093837e-31,
  m_p: 1.6726219e-27,
  M_sun: 1.98847e30,
  M_jup: 1.89813e27,
  R_sun: 6.957e8,
  R_jup: 7.1492e7,
  AU: 1.495978707e11,
  sigma_SB: 5.670374419e-8
};

export class CorePhysics {
  static getGeoMass(massKg) { return (CONSTANTS.G * massKg) / (CONSTANTS.c**2); }
  static getSurfaceGravity(M, R) { return (CONSTANTS.G * M) / (R**2); }
  static getLogG(g_si) { return Math.log10(g_si * 100); } // convert m/s^2 to cm/s^2
  
  static getEscapeVelocity(M, R) { return Math.sqrt((2 * CONSTANTS.G * M) / R); }
  static getBreakupVelocity(M, R) { return Math.sqrt((CONSTANTS.G * M) / R**3); }
  
  static getMeanDensity(M, R) { return (3 * M) / (4 * Math.PI * R**3); }
  static getGravitationalBindingEnergy(M, R) { return -(3 * CONSTANTS.G * M**2) / (5 * R); }
}

export class SubstellarPhysics {
  static getClassification(massMj) {
    if (massMj < 13) return "Planetary-mass regime (M < ~13 M_J)";
    if (massMj >= 13 && massMj < 75) return "Brown-dwarf regime (~13 M_J to ~75-80 M_J)";
    return "Hydrogen-burning regime (M > ~75-80 M_J)";
  }

  static getDeuteriumBurningState(massMj, ageMyr) {
    if (massMj < 13) return "OFF";
    if (massMj >= 13 && ageMyr < 50) return "ACTIVE"; // Roughly active early in life
    if (massMj >= 13 && ageMyr >= 50) return "EXHAUSTED";
    return "UNKNOWN";
  }

  static getApproxRadius(massMj, ageMyr) {
    // Realistic mass-radius relation for brown dwarfs:
    // They are supported by electron degeneracy pressure, so their physical radius 
    // actually SHRINKS slightly as mass increases!
    const massFactor = Math.pow(massMj, -0.12) * 1.35; // Tuned so 13 Mj is ~1 Rj, and 80 Mj shrinks to ~0.8 Rj
    const ageFactor = Math.pow(Math.max(1, ageMyr) / 1000, -0.05); // shrinks as it ages/cools
    return massFactor * ageFactor * CONSTANTS.R_jup;
  }

  static getKelvinHelmholtzTimescale(M, R, L) {
    return (CONSTANTS.G * M**2) / (R * L); // Gives time in seconds
  }

  static getFermiEnergy(n_e) {
    return (CONSTANTS.hbar**2 / (2 * CONSTANTS.m_e)) * Math.pow(3 * Math.PI**2 * n_e, 2/3);
  }
  
  static getDegeneracyParameter(E_F, T) {
    return E_F / (CONSTANTS.k_B * T);
  }

  static getDegeneracyState(eta) {
    if (eta < 0.5) return "Non-degenerate";
    if (eta >= 0.5 && eta < 10) return "Partially degenerate";
    return "Strongly degenerate";
  }
}

export class AtmosphericPhysics {
  static getStefanBoltzmannLuminosity(R, T_eff) { return 4 * Math.PI * R**2 * CONSTANTS.sigma_SB * T_eff**4; }
  static getWiensPeak(T_eff) { return 2.897771955e-3 / T_eff; } // meters
  static getScaleHeight(T, mu, g) { return (CONSTANTS.k_B * T) / (mu * CONSTANTS.m_p * g); }
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
uniform float uRadGeo;
uniform float uCamDist;
uniform float uFov;
uniform float uInc;
uniform float uAzi;
uniform float uTempNorm;

out vec4 fragColor;

float hash(vec3 p3) { p3 = fract(p3*.1031); p3+=dot(p3, p3.zyx+31.32); return fract((p3.x+p3.y)*p3.z); }
float noise(vec3 p) {
    vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x), mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x), mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
}

float fbm(vec3 p) {
    float s = 0.0, a = 0.5;
    for(int i=0; i<5; i++) { s += a * noise(p); p = p * 2.03 + 7.1; a *= 0.5; }
    return s;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*uRes)/min(uRes.x, uRes.y);
    
    // Camera Setup
    vec3 ro = vec3(uCamDist * sin(uInc) * cos(uAzi), uCamDist * cos(uInc), uCamDist * sin(uInc) * sin(uAzi));
    vec3 forward = normalize(-ro);
    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
    vec3 up = cross(forward, right);
    vec3 rd = normalize(forward + uv.x * uFov * right + uv.y * uFov * up);

    // Ray-Sphere Intersection
    float b = dot(ro, rd);
    float c = dot(ro, ro) - uRadGeo * uRadGeo;
    float h = b*b - c;

    vec3 totalCol = vec3(0.0);

    if (h > 0.0) {
        float t = -b - sqrt(h);
        if (t > 0.0) {
            vec3 p = ro + t * rd;
            vec3 n = normalize(p);
            
            // Rotation Matrix 
            float spinMult = 3.0; 
            float s = sin(-uTime * uSpin * spinMult);
            float c_rot = cos(-uTime * uSpin * spinMult);
            vec3 spunNormal = vec3(n.x * c_rot - n.z * s, n.y, n.x * s + n.z * c_rot);
            
            // Latitudinal banding matching the reference
            float lat = spunNormal.y;
            float warp = fbm(spunNormal * 5.0 + vec3(uTime * 0.1, 0.0, 0.0));
            
            // Create the horizontal stripe pattern
            float bandPattern = sin(lat * 28.0 + warp * 2.5);
            
            // Mask for the intense glowing stripes
            float turbulence = fbm(spunNormal * 18.0 - vec3(uTime * 0.4));
            float glowMask = smoothstep(0.7, 0.95, bandPattern) * smoothstep(0.3, 0.8, turbulence);
            
            // Base Brown Dwarf Colors (Dark red/brown base)
            vec3 darkBrown = vec3(0.20, 0.04, 0.02);
            vec3 midRedBrown = vec3(0.40, 0.12, 0.04);
            
            // Glow Colors (Intense orange/yellow interior heat leaking out)
            vec3 glowOrange = vec3(1.8, 0.5, 0.05) * uTempNorm;
            vec3 glowYellow = vec3(2.5, 1.2, 0.2) * uTempNorm;

            // Mix base surface based on macro-turbulence
            float baseNoise = fbm(spunNormal * 8.0);
            vec3 surfCol = mix(darkBrown, midRedBrown, baseNoise);
            
            // Overlay the glowing bands
            surfCol = mix(surfCol, glowOrange, smoothstep(0.0, 0.4, glowMask));
            surfCol = mix(surfCol, glowYellow, smoothstep(0.4, 1.0, glowMask));
            
            // Add prominent storm spots
            float spotP = fbm(spunNormal * 12.0 + vec3(10.0));
            float spotMask = smoothstep(0.85, 0.95, spotP);
            surfCol = mix(surfCol, darkBrown * 0.5, spotMask * 0.8);

            // Limb Darkening
            float limb = max(0.0, dot(-rd, n));
            surfCol *= pow(limb, 0.6); // Strong limb darkening for a deep atmosphere
            
            // Oblateness from spin
            float oblateness = 1.0 - (n.y * n.y * clamp(uSpin, 0.0, 0.3));
            surfCol *= oblateness;

            totalCol = surfCol * 1.5; 
        }
    } else {
        // Deep Space Background
        vec3 spaceColor = vec3(0.005, 0.010, 0.015);
        float starHash = hash(floor(rd * 300.0));
        if (starHash > 0.995) spaceColor += vec3(0.9, 0.95, 1.0) * (starHash - 0.995) * 80.0;
        totalCol += spaceColor;
    }

    // ACES Tone Mapping
    totalCol = (totalCol * (2.51 * totalCol + 0.03)) / (totalCol * (2.43 * totalCol + 0.59) + 0.14);
    fragColor = vec4(pow(clamp(totalCol, 0.0, 1.0), vec3(1.0/2.2)), 1.0);
}
`;

// ==========================================================
// REACT COMPONENT
// ==========================================================
export default function BrownDwarfStar() {
  const canvasRef = useRef(null);
  const [glData, setGlData] = useState(null);
  const [hudVisible, setHudVisible] = useState(true);
  const [sysError, setSysError] = useState(null);
  
  // Specific Brown Dwarf States
  const [massMj, setMassMj] = useState(40.0); 
  const [ageMyr, setAgeMyr] = useState(1000.0); 
  const [starTemp, setStarTemp] = useState(1500); // T_eff
  const [rotPeriodHrs, setRotPeriodHrs] = useState(10.0); // Rotation period in hours
  
  // Camera Refs
  const aziRef = useRef(0.0);
  const incRef = useRef(1.25); 
  const distRef = useRef(16.0); 
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
  const handleWheel = (e) => { distRef.current = Math.max(5.0, Math.min(100.0, distRef.current + e.deltaY * 0.05)); };
  const resetCamera = () => { aziRef.current = 0.0; incRef.current = 1.25; distRef.current = 16.0; };

  const engineStateRef = useRef({ rotPeriodHrs, starTemp, physics: null });

  // Evaluate all structural formulas
  const physics = useMemo(() => {
    try {
      const massKg = massMj * CONSTANTS.M_jup;
      const radiusM = SubstellarPhysics.getApproxRadius(massMj, ageMyr); 
      
      // Dynamic rendering radius based on physical radius to fix the static ball size issue
      const renderRadGeo = 5.0 * (radiusM / CONSTANTS.R_jup); 
      const fov = 1.0; 
      
      // Secondary Physical Quantities
      const g_si = CorePhysics.getSurfaceGravity(massKg, radiusM);
      const log_g = CorePhysics.getLogG(g_si);
      const escapeVel = CorePhysics.getEscapeVelocity(massKg, radiusM);
      
      // Densities & Degeneracy
      const meanDensity = CorePhysics.getMeanDensity(massKg, radiusM);
      const n_e = meanDensity / (2.0 * CONSTANTS.m_p); // Roughly 1 electron per 2 nucleons
      const fermiEnergy = SubstellarPhysics.getFermiEnergy(n_e);
      const degeneracyEta = SubstellarPhysics.getDegeneracyParameter(fermiEnergy, starTemp);
      const degenState = SubstellarPhysics.getDegeneracyState(degeneracyEta);
      
      // Rotation and Kinematics
      const omega = (2 * Math.PI) / (rotPeriodHrs * 3600);
      const eqVelocity = omega * radiusM;
      const breakupOmega = CorePhysics.getBreakupVelocity(massKg, radiusM);
      const breakupRatio = omega / breakupOmega;
      
      // Thermodynamics & Radiation
      const L_watts = AtmosphericPhysics.getStefanBoltzmannLuminosity(radiusM, starTemp);
      const lambdaMax = AtmosphericPhysics.getWiensPeak(starTemp) * 1e6; // micrometers
      const KH_timescale_yr = SubstellarPhysics.getKelvinHelmholtzTimescale(massKg, radiusM, L_watts) / CONSTANTS.yr_to_s;
      
      // Classification
      const classification = SubstellarPhysics.getClassification(massMj);
      const dBurning = SubstellarPhysics.getDeuteriumBurningState(massMj, ageMyr);

      // Temperature normalization for shader glow intensity
      const tempNorm = Math.max(0.5, Math.min(starTemp / 1500.0, 2.5));

      return {
        massKg, radiusM, tempNorm, fov, renderRadGeo,
        g_si, log_g, escapeVel, meanDensity, 
        fermiEnergy, degeneracyEta, degenState,
        omega, eqVelocity, breakupRatio,
        L_watts, lambdaMax, KH_timescale_yr,
        classification, dBurning
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [massMj, ageMyr, starTemp, rotPeriodHrs]);

  useEffect(() => { engineStateRef.current = { spin: rotPeriodHrs, starTemp, physics }; }, [rotPeriodHrs, starTemp, physics]);

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
      
      const locs = ['uRes','uTime','uSpin','uRadGeo','uCamDist','uFov','uInc','uAzi','uTempNorm']
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
        
        // Map real rotation period to visual spin (inverse relation: shorter period = faster spin)
        const visualSpin = Math.max(0.01, 1.0 / state.spin);
        gl.uniform1f(locs.uSpin, visualSpin);
        
        gl.uniform1f(locs.uFov, phys.fov);
        gl.uniform1f(locs.uInc, incRef.current);
        gl.uniform1f(locs.uAzi, aziRef.current);
        gl.uniform1f(locs.uRadGeo, phys.renderRadGeo);
        gl.uniform1f(locs.uCamDist, distRef.current); 
        gl.uniform1f(locs.uTempNorm, phys.tempNorm); 
        
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
      const v2 = (v) => (v !== undefined && isFinite(v)) ? v.toFixed(2) : "∞";
      const vExp = (v) => (v !== undefined && isFinite(v) && v > 0) ? v.toExponential(2) : "0";

      let text = `BROWN DWARF PHYSICS ENGINE\n──────────────────────────\n\n`;
      text += `CLASS.            ${physics.classification}\n`;
      text += `DEUTERIUM BURN    ${physics.dBurning}\n\n`;
      
      text += `MASS              ${massMj.toFixed(1)} M_Jup\n`;
      text += `RADIUS            ${v2(physics.radiusM / CONSTANTS.R_jup)} R_Jup\n`;
      text += `TEMPERATURE       ${starTemp} K\n`;
      text += `LUMINOSITY        ${vExp(physics.L_watts)} W\n`;
      text += `PEAK EMISSION (λ) ${v2(physics.lambdaMax)} µm\n\n`;
      
      text += `SURFACE GRAVITY   ${vExp(physics.g_si)} m/s^2\n`;
      text += `LOG G (cgs)       ${v2(physics.log_g)}\n`;
      text += `MEAN DENSITY      ${vExp(physics.meanDensity)} kg/m/3\n`;
      text += `DEGENERACY STATE  ${physics.degenState} (η=${v2(physics.degeneracyEta)})\n\n`;
      
      text += `ROTATION PERIOD   ${v2(rotPeriodHrs)} hr\n`;
      text += `EQUAT. VELOCITY   ${(physics.eqVelocity / 1000).toFixed(1)} km/s\n`;
      text += `BREAKUP LIMIT     ${(physics.breakupRatio * 100).toFixed(1)}%\n`;
      text += `K-H TIMESCALE     ${vExp(physics.KH_timescale_yr)} yr\n`;

      return text;
    } catch (e) { return `HUD UI Error:\n${e.message}`; }
  };

  return (
    <div className="astro-root theme-browndwarf">
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
            <h3 className="astro-title">Brown Dwarf Simulator</h3>
            <p className="astro-sub" style={{ margin: 0 }}>Drag: Rotate | Scroll: Zoom | DblClick: Reset</p>
          </div>
          <button onClick={resetCamera} style={{ fontSize: '10px', padding: '4px 8px', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', cursor: 'pointer' }}>RESET VIEW</button>
        </div>

        <div className="astro-row">
          <div className="astro-row-label"><span>Mass (M_Jup)</span><span className="astro-value">{massMj.toFixed(1)}</span></div>
          <input type="range" min="5.0" max="80.0" step="0.5" value={massMj} onChange={e => setMassMj(parseFloat(e.target.value))} />
        </div>

        <div className="astro-row">
          <div className="astro-row-label"><span>Age (Myr)</span><span className="astro-value">{ageMyr.toFixed(0)}</span></div>
          <input type="range" min="10" max="10000" step="10" value={ageMyr} onChange={e => setAgeMyr(parseFloat(e.target.value))} />
        </div>
        
        <div className="astro-row">
          <div className="astro-row-label"><span>Effective Temp (K)</span><span className="astro-value">{starTemp} K</span></div>
          <input type="range" min="200" max="3000" step="50" value={starTemp} onChange={e => setStarTemp(parseInt(e.target.value))} />
        </div>

        <div className="astro-row">
          <div className="astro-row-label"><span>Rotation Period (Hours)</span><span className="astro-value">{rotPeriodHrs.toFixed(1)}</span></div>
          <input type="range" min="1.0" max="24.0" step="0.1" value={rotPeriodHrs} onChange={e => setRotPeriodHrs(parseFloat(e.target.value))} />
        </div>

        <div className="astro-info-box">
          A substellar object bridging the gap between gas giants and stars. Features structural calculations tracking degeneracy states (η = E_F / kT), deuterium burning exhaustion boundaries, cooling timescales, and rotational breakup limits. Notice how radius actually slightly shrinks as mass increases due to electron degeneracy pressure.
        </div>
      </div>
    </div>
  );
}