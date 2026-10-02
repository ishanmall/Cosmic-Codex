import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ==========================================================
// 1. COMPLETE STRUCTURED PHYSICS DATA
// Contains all Chapters and every specified formula, including
// the advanced GR machinery, Kerr ray tracing, and cosmology.
// ==========================================================
const THEORY_DATA = [
  {
    id: 'classical',
    title: 'Classical Mechanics & Fluids',
    sections: [
      {
        title: 'Newtonian Gravity & Orbital Dynamics',
        items: [
          { type: 'text', content: 'Newtonian gravity, potential, and gravitational acceleration:' },
          { type: 'formula', name: 'Newtonian Force', tex: 'F=\\frac{GMm}{r^2}', tag: 'Fundamental Force', appliesTo: 'Weak field, low velocity', assumptions: 'Point masses or spherical symmetry' },
          { type: 'formula', name: 'Gravitational Potential', tex: '\\Phi=-\\frac{GM}{r}', tag: 'Potential field', appliesTo: 'Weak field gravity', assumptions: 'Infinity as zero reference' },
          { type: 'formula', name: 'Gravitational Acceleration', tex: '\\mathbf g=-\\nabla\\Phi', tag: 'Vector field', appliesTo: 'Classical gravity', assumptions: 'Conservative field' },
          { type: 'text', content: 'Orbital kinematics and velocity:' },
          { type: 'formula', name: 'Circular Orbital Velocity', tex: 'v_\\mathrm{orb}=\\sqrt{\\frac{GM}{r}}', tag: 'Kinematics', appliesTo: 'Circular orbits', assumptions: 'Keplerian mechanics' },
          { type: 'formula', name: 'Angular Velocity', tex: '\\Omega=\\frac{v}{r} \\quad,\\quad \\omega=2\\pi f \\quad,\\quad v_\\mathrm{rot}=\\Omega R', tag: 'Kinematics', appliesTo: 'Rotating bodies', assumptions: 'Rigid body or circular path' },
          { type: 'formula', name: 'Escape Velocity', tex: 'v_\\mathrm{esc} = \\sqrt{\\frac{2GM}{R}}', tag: 'Kinematics', appliesTo: 'Ballistic trajectories', assumptions: 'Newtonian approximation' },
          { type: 'text', content: 'Virial theorem for self-gravitating systems:' },
          { type: 'formula', name: 'Virial Theorem', tex: '2K+U=0 \\quad,\\quad 2T+W+3\\int P\\,dV=0', tag: 'Equilibrium Condition', appliesTo: 'Stars, clusters, galaxies', assumptions: 'System in virial equilibrium' },
        ]
      },
      {
        title: 'Fluid Dynamics & Conservation',
        items: [
          { type: 'formula', name: 'Continuity Equation', tex: '\\frac{\\partial\\rho}{\\partial t} +\\nabla\\cdot(\\rho\\mathbf v)=0', tag: 'Conservation Law', appliesTo: 'Fluids, Plasmas', assumptions: 'No mass creation/destruction' },
          { type: 'formula', name: 'Euler Equation', tex: '\\rho \\left( \\frac{\\partial\\mathbf v}{\\partial t} + \\mathbf v\\cdot\\nabla\\mathbf v \\right) = -\\nabla P+\\rho\\mathbf g', tag: 'Momentum Conservation', appliesTo: 'Inviscid fluids', assumptions: 'Zero viscosity' },
          { type: 'formula', name: 'Navier-Stokes Equation', tex: '\\rho \\left( \\frac{\\partial\\mathbf v}{\\partial t} + \\mathbf v\\cdot\\nabla\\mathbf v \\right) = -\\nabla P +\\mu\\nabla^2\\mathbf v +\\rho\\mathbf g', tag: 'Momentum Conservation', appliesTo: 'Viscous fluids', assumptions: 'Newtonian fluid' },
          { type: 'formula', name: 'Energy Conservation', tex: '\\frac{\\partial E}{\\partial t} + \\nabla\\cdot[(E+P)\\mathbf v] = \\text{sources}-\\text{sinks}', tag: 'Conservation Law', appliesTo: 'Thermodynamic fluid flows', assumptions: 'Includes internal energy and work' },
          { type: 'formula', name: 'Sound Speed & Mach Number', tex: 'c_s^2= \\left(\\frac{\\partial P}{\\partial\\rho}\\right)_s \\quad,\\quad \\mathcal M=\\frac{v}{c_s}', tag: 'Acoustics', appliesTo: 'Compressible flows', assumptions: 'Adiabatic compression' }
        ]
      }
    ]
  },
  {
    id: 'electromagnetism',
    title: 'Electromagnetism & Radiation',
    sections: [
      {
        title: 'Maxwell\'s Equations & Covariant EM',
        items: [
          { type: 'formula', name: 'Gauss\'s Laws', tex: '\\nabla\\cdot\\mathbf E = \\frac{\\rho_e}{\\epsilon_0} \\quad,\\quad \\nabla\\cdot\\mathbf B=0', tag: 'Field Equation', appliesTo: 'Electric/Magnetic fields', assumptions: 'No magnetic monopoles' },
          { type: 'formula', name: 'Faraday & Ampère-Maxwell', tex: '\\nabla\\times\\mathbf E = -\\frac{\\partial\\mathbf B}{\\partial t} \\quad,\\quad \\nabla\\times\\mathbf B = \\mu_0\\mathbf J + \\mu_0\\epsilon_0 \\frac{\\partial\\mathbf E}{\\partial t}', tag: 'Field Equation', appliesTo: 'Electrodynamics', assumptions: 'Classical vacuum' },
          { type: 'formula', name: 'Lorentz Force', tex: '\\mathbf F=q(\\mathbf E+\\mathbf v\\times\\mathbf B)', tag: 'Force', appliesTo: 'Charged particles', assumptions: 'Classical electrodynamics' },
          { type: 'text', content: 'Covariant formulation for relativistic integration:' },
          { type: 'formula', name: 'Covariant EM Equations', tex: '\\nabla_\\mu F^{\\mu\\nu} = \\mu_0J^\\nu \\quad,\\quad \\nabla_{[\\lambda}F_{\\mu\\nu]}=0', tag: 'Tensor Equation', appliesTo: 'Relativistic electrodynamics', assumptions: 'Curved or flat spacetime' },
          { type: 'formula', name: 'Electromagnetic Field Tensor', tex: 'F_{\\mu\\nu} = \\partial_\\mu A_\\nu-\\partial_\\nu A_\\mu', tag: 'Definition', appliesTo: 'Gauge theory', assumptions: 'Defined from 4-potential' },
          { type: 'formula', name: 'EM Stress-Energy Tensor', tex: 'T_{\\mu\\nu}^{EM} = \\frac{1}{\\mu_0} \\left( F_{\\mu\\alpha}F_\\nu{}^\\alpha -\\frac14g_{\\mu\\nu}F_{\\alpha\\beta}F^{\\alpha\\beta} \\right)', tag: 'Energy-Momentum', appliesTo: 'Coupling EM to GR', assumptions: 'Classical EM field' },
          { type: 'formula', name: 'EM Waves in Vacuum', tex: '\\nabla^2\\mathbf E - \\frac1{c^2} \\frac{\\partial^2\\mathbf E}{\\partial t^2} =0 \\quad,\\quad c=\\frac1{\\sqrt{\\mu_0\\epsilon_0}}', tag: 'Wave Equation', appliesTo: 'Light/Radiation', assumptions: 'Source-free vacuum' }
        ]
      },
      {
        title: 'Magnetohydrodynamics (MHD)',
        items: [
          { type: 'formula', name: 'Induction Equation', tex: '\\frac{\\partial\\mathbf B}{\\partial t} = \\nabla\\times(\\mathbf v\\times\\mathbf B) -\\nabla\\times(\\eta\\nabla\\times\\mathbf B)', tag: 'Plasma Physics', appliesTo: 'Conducting fluids, stars', assumptions: 'Ohmic dissipation included' },
          { type: 'formula', name: 'Magnetic Lorentz Force', tex: '\\mathbf f_L = \\mathbf J\\times\\mathbf B \\quad,\\quad \\mathbf J= \\frac{1}{\\mu_0}\\nabla\\times\\mathbf B', tag: 'Force density', appliesTo: 'Plasma bulk forces', assumptions: 'SI units' }
        ]
      },
      {
        title: 'Radiative Transfer',
        items: [
          { type: 'text', content: 'The fundamental equations governing radiation propagating through matter.' },
          { type: 'formula', name: 'Radiative Transfer Equation', tex: '\\frac{dI_\\nu}{ds} = -\\alpha_\\nu I_\\nu+j_\\nu \\quad \\text{or} \\quad \\frac{dI_\\nu}{d\\tau_\\nu} = -I_\\nu+S_\\nu', tag: 'Transport Equation', appliesTo: 'Stellar atmospheres, accretion', assumptions: 'Source function S_v = j_v/a_v' },
          { type: 'formula', name: 'Optical Depth', tex: '\\tau_\\nu = \\int \\alpha_\\nu\\,ds', tag: 'Property', appliesTo: 'Medium opacity', assumptions: 'Integrated absorption' },
          { type: 'formula', name: 'Pure Absorption', tex: 'I_\\nu(s) = I_{\\nu,0}e^{-\\tau_\\nu}', tag: 'Solution', appliesTo: 'Non-emitting medium', assumptions: 'Zero emission' },
          { type: 'formula', name: 'Formal Solution (Transfer)', tex: 'I_\\nu(s) = I_\\nu(0)e^{-\\tau_\\nu} + \\int_0^s j_\\nu(s\') e^{-[\\tau_\\nu(s)-\\tau_\\nu(s\')]} ds\'', tag: 'Solution', appliesTo: 'Optical depth tracking', assumptions: 'General medium' }
        ]
      },
      {
        title: 'Thermal Radiation',
        items: [
          { type: 'formula', name: 'Stefan-Boltzmann Law', tex: 'F=\\sigma T^4 \\quad,\\quad L=4\\pi R^2\\sigma T^4', tag: 'Thermal Emission', appliesTo: 'Blackbodies, Stars', assumptions: 'Perfect thermal emitter' },
          { type: 'formula', name: 'Wien\'s Displacement Law', tex: '\\lambda_\\mathrm{max} = \\frac{b}{T}', tag: 'Thermal Emission', appliesTo: 'Blackbody peaks', assumptions: 'b ≈ 2.898×10⁻³ m·K' },
          { type: 'formula', name: 'Radiation Pressure & Density', tex: 'P_\\mathrm{rad} = \\frac{aT^4}{3} \\quad,\\quad u=aT^4 \\quad,\\quad a=\\frac{4\\sigma}{c}', tag: 'Thermodynamics', appliesTo: 'Photon gas, stellar cores', assumptions: 'Isotropic radiation field' }
        ]
      }
    ]
  },
  {
    id: 'thermo',
    title: 'Thermodynamics & Stat Mech',
    sections: [
      {
        title: 'Core Thermodynamics',
        items: [
          { type: 'formula', name: 'Laws of Thermodynamics', tex: 'dU=\\delta Q-\\delta W \\quad,\\quad dS=\\frac{\\delta Q_\\mathrm{rev}}{T} \\quad,\\quad \\Delta S_\\mathrm{total}\\geq0', tag: 'Fundamental Laws', appliesTo: 'All macroscopic systems', assumptions: 'Classical isolated system' },
          { type: 'formula', name: 'Boltzmann Entropy', tex: 'S=k_B\\ln\\Omega', tag: 'Statistical Definition', appliesTo: 'Microstates', assumptions: 'Equiprobable microstates' }
        ]
      },
      {
        title: 'Complete Equation of State',
        items: [
          { type: 'formula', name: 'Total Stellar EOS', tex: 'P=P_\\mathrm{gas}+P_\\mathrm{rad}+P_\\mathrm{deg}+\\cdots', tag: 'EOS', appliesTo: 'Stellar interiors', assumptions: 'Local thermodynamic equilibrium' },
          { type: 'formula', name: 'Ideal Gas', tex: 'P_\\mathrm{gas} = \\frac{\\rho k_BT}{\\mu m_u}', tag: 'EOS', appliesTo: 'Main sequence stars', assumptions: 'Non-interacting particles' },
          { type: 'formula', name: 'Non-Relativistic Degeneracy', tex: 'P_\\mathrm{NR} = \\frac{\\hbar^2}{5m_e} (3\\pi^2)^{2/3} n_e^{5/3} \\implies P\\propto\\rho^{5/3}', tag: 'EOS', appliesTo: 'Low-mass White Dwarfs', assumptions: 'Complete electron degeneracy' },
          { type: 'formula', name: 'Ultra-Relativistic Degeneracy', tex: 'P_\\mathrm{rel} = \\frac{\\hbar c}{4} (3\\pi^2)^{1/3} n_e^{4/3} \\implies P\\propto\\rho^{4/3}', tag: 'EOS', appliesTo: 'Chandrasekhar limit approach', assumptions: 'Electrons moving near c' },
          { type: 'formula', name: 'Fermi Momentum', tex: 'p_F = \\hbar(3\\pi^2n_e)^{1/3}', tag: 'Fermi Properties', appliesTo: 'Degenerate matter', assumptions: 'Zero temperature limit' },
          { type: 'formula', name: 'Relativistic Fermi Energy', tex: 'E_F = \\sqrt{p_F^2c^2+m_e^2c^4}', tag: 'Fermi Properties', appliesTo: 'Dense objects', assumptions: 'Relativistic kinematics' }
        ]
      },
      {
        title: 'Statistical Mechanics',
        items: [
          { type: 'formula', name: 'Boltzmann Distribution & Partition', tex: 'P_i\\propto e^{-E_i/(k_BT)} \\quad,\\quad Z=\\sum_i e^{-E_i/(k_BT)}', tag: 'Probability Distribution', appliesTo: 'Classical thermal systems', assumptions: 'Canonical ensemble' },
          { type: 'formula', name: 'Quantum Distributions', tex: 'f(E)_\\mathrm{FD}= \\frac1{e^{(E-\\mu)/(k_BT)}+1} \\quad,\\quad f(E)_\\mathrm{BE}= \\frac1{e^{(E-\\mu)/(k_BT)}-1}', tag: 'Quantum Statistics', appliesTo: 'Fermions & Bosons', assumptions: 'Indistinguishable particles' }
        ]
      }
    ]
  },
  {
    id: 'sr',
    title: 'Special Relativity',
    sections: [
      {
        title: 'Spacetime Geometry',
        items: [
          { type: 'formula', name: 'Minkowski Metric', tex: 'ds^2=-c^2dt^2+dx^2+dy^2+dz^2 = \\eta_{\\mu\\nu}dx^\\mu dx^\\nu', tag: 'Line Element', appliesTo: 'Flat spacetime', assumptions: 'No gravity' },
          { type: 'formula', name: 'Minkowski Tensor', tex: '\\eta_{\\mu\\nu}= \\mathrm{diag}(-1, 1, 1, 1)', tag: 'Metric Tensor', appliesTo: 'SR convention (-+++)', assumptions: 'Cartesian coordinates' },
          { type: 'formula', name: 'Lorentz Factor & Proper Time', tex: '\\gamma=\\frac{1}{\\sqrt{1-v^2/c^2}} \\quad,\\quad d\\tau^2=-\\frac{ds^2}{c^2} \\implies \\Delta t=\\gamma\\Delta\\tau', tag: 'Kinematics', appliesTo: 'Moving observers', assumptions: 'Constant inertial velocity' },
          { type: 'formula', name: 'Lorentz Transformation', tex: 'x\'=\\gamma(x-vt) \\quad,\\quad t\'=\\gamma \\left(t-\\frac{vx}{c^2}\\right)', tag: 'Coordinate Transform', appliesTo: 'Boost in x-direction', assumptions: 'Standard configuration' },
          { type: 'formula', name: 'Velocity Addition', tex: 'u\'_x= \\frac{u_x-v} {1-\\frac{u_xv}{c^2}} \\quad,\\quad u\'_y= \\frac{u_y} {\\gamma(1-u_xv/c^2)}', tag: 'Kinematics', appliesTo: 'Compound velocities', assumptions: 'Prevents v > c' }
        ]
      },
      {
        title: 'Relativistic Energy & Momentum',
        items: [
          { type: 'formula', name: 'Relativistic Momentum & Energy', tex: '\\mathbf p=\\gamma m\\mathbf v \\quad,\\quad E=\\gamma mc^2 \\quad,\\quad E_0=mc^2', tag: 'Dynamics', appliesTo: 'Massive particles', assumptions: 'Invariant mass m' },
          { type: 'formula', name: 'Energy-Momentum Relation', tex: 'E^2=p^2c^2+m^2c^4', tag: 'Dispersion Relation', appliesTo: 'All particles', assumptions: 'None' },
          { type: 'formula', name: 'Four-Vectors', tex: 'x^\\mu=(ct,x,y,z) \\quad,\\quad p^\\mu= \\left(\\frac Ec,\\mathbf{p}\\right) \\quad,\\quad u^\\mu=\\frac{dx^\\mu}{d\\tau}', tag: 'Tensor Math', appliesTo: 'Covariant mechanics', assumptions: 'p_\\mu p^\\mu = -m^2c^2' }
        ]
      }
    ]
  },
  {
    id: 'gr',
    title: 'General Relativity Foundations',
    sections: [
      {
        title: 'Differential Geometry',
        items: [
          { type: 'formula', name: 'Covariant Derivative', tex: '\\nabla_\\mu V^\\nu = \\partial_\\mu V^\\nu+ \\Gamma^\\nu_{\\mu\\lambda}V^\\lambda', tag: 'Geometry', appliesTo: 'Vectors in curved space', assumptions: 'Preserves tensor rank' },
          { type: 'formula', name: 'Tensor Covariant Derivative', tex: '\\nabla_\\lambda T^{\\mu\\nu} = \\partial_\\lambda T^{\\mu\\nu} + \\Gamma^\\mu_{\\lambda\\alpha}T^{\\alpha\\nu} + \\Gamma^\\nu_{\\lambda\\alpha}T^{\\mu\\alpha}', tag: 'Geometry', appliesTo: 'Tensors', assumptions: 'Leibniz rule applies' },
          { type: 'formula', name: 'Metric Compatibility', tex: '\\nabla_\\lambda g_{\\mu\\nu}=0', tag: 'Geometry', appliesTo: 'Spacetime connection', assumptions: 'Metric-compatible connection' },
          { type: 'formula', name: 'Christoffel Symbols', tex: '\\Gamma^\\rho_{\\mu\\nu} = \\frac12g^{\\rho\\sigma} \\left( \\partial_\\mu g_{\\sigma\\nu} +\\partial_\\nu g_{\\sigma\\mu} -\\partial_\\sigma g_{\\mu\\nu} \\right)', tag: 'Connection', appliesTo: 'Metric connection', assumptions: 'Torsion-free' }
        ]
      },
      {
        title: 'Curvature Tensors & Field Equations',
        items: [
          { type: 'formula', name: 'Riemann Tensor', tex: 'R^\\rho_{\\ \\sigma\\mu\\nu} = \\partial_\\mu\\Gamma^\\rho_{\\nu\\sigma} -\\partial_\\nu\\Gamma^\\rho_{\\mu\\sigma} +\\Gamma^\\rho_{\\mu\\lambda}\\Gamma^\\lambda_{\\nu\\sigma} -\\Gamma^\\rho_{\\nu\\lambda}\\Gamma^\\lambda_{\\mu\\sigma}', tag: 'Curvature', appliesTo: 'Spacetime curvature', assumptions: 'Levi-Civita connection' },
          { type: 'formula', name: 'Ricci Tensor & Scalar', tex: 'R_{\\mu\\nu} = R^\\rho_{\\ \\mu\\rho\\nu} \\quad,\\quad R=g^{\\mu\\nu}R_{\\mu\\nu}', tag: 'Curvature Traces', appliesTo: 'Volume change', assumptions: 'Contracted Riemann' },
          { type: 'formula', name: 'Einstein Tensor & Bianchi Identity', tex: 'G_{\\mu\\nu} = R_{\\mu\\nu} -\\frac12Rg_{\\mu\\nu} \\quad,\\quad \\nabla_\\mu G^{\\mu\\nu}=0', tag: 'Geometric tensor', appliesTo: 'Spacetime curvature', assumptions: 'Leads to stress-energy conservation' },
          { type: 'formula', name: 'Einstein-Hilbert Action', tex: 'S = \\frac{c^3}{16\\pi G} \\int (R-2\\Lambda)\\sqrt{-g}\\,d^4x + S_\\mathrm{matter}', tag: 'Action Principle', appliesTo: 'Derivation of GR', assumptions: 'Variation \\delta S = 0 yields field equations' },
          { type: 'formula', name: 'Einstein Field Equation', tex: 'G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}', tag: 'Field Equation', appliesTo: 'Curved Spacetime', assumptions: 'Connects matter to geometry' },
          { type: 'formula', name: 'Perfect Fluid Stress-Energy', tex: 'T^{\\mu\\nu} = \\left( \\rho+\\frac{P}{c^2} \\right)u^\\mu u^\\nu + Pg^{\\mu\\nu} \\quad \\implies \\quad \\nabla_\\mu T^{\\mu\\nu}=0', tag: 'Matter tensor', appliesTo: 'Cosmology, Stellar interiors', assumptions: 'Isotropic fluid' }
        ]
      },
      {
        title: 'Geodesics',
        items: [
          { type: 'formula', name: 'Geodesic Equation (Particles)', tex: '\\frac{d^2x^\\mu}{d\\tau^2} + \\Gamma^\\mu_{\\alpha\\beta} \\frac{dx^\\alpha}{d\\tau} \\frac{dx^\\beta}{d\\tau} = 0', tag: 'Motion', appliesTo: 'Massive bodies', assumptions: 'Free-fall' },
          { type: 'formula', name: 'Geodesic Equation (Photons)', tex: 'k^\\mu\\nabla_\\mu k^\\nu=0 \\quad \\text{with} \\quad k^\\mu k_\\mu=0', tag: 'Motion', appliesTo: 'Light rays', assumptions: 'Null trajectories' }
        ]
      },
      {
        title: 'Weak Field & Newtonian Limits',
        items: [
          { type: 'formula', name: 'Weak Field Metric Limit', tex: 'g_{00} \\approx -\\left(1+\\frac{2\\Phi}{c^2}\\right) \\quad \\text{where} \\quad \\Phi=-\\frac{GM}{r}', tag: 'Approximation', appliesTo: 'Solar system', assumptions: 'Linearized gravity' },
          { type: 'formula', name: 'Newtonian Limit of Einstein Eq', tex: 'G_{00} \\rightarrow \\frac{2}{c^2}\\nabla^2\\Phi \\implies \\nabla^2\\Phi=4\\pi G\\rho', tag: 'Proof Connection', appliesTo: 'Recovery of Classical Physics', assumptions: 'Slow motion, weak field' },
          { type: 'formula', name: 'Relativistic Compactness', tex: 'C=\\frac{GM}{Rc^2}', tag: 'Metric property', appliesTo: 'Compact objects', assumptions: 'Dimensionless depth' },
          { type: 'formula', name: 'Gravitational Time Dilation', tex: 'd\\tau = dt \\sqrt{1-\\frac{2GM}{rc^2}}', tag: 'Observable', appliesTo: 'Stationary observer', assumptions: 'Schwarzschild exterior' },
          { type: 'formula', name: 'Fundamental Relativistic Redshift', tex: 'g= \\frac{\\nu_\\mathrm{obs}}{\\nu_\\mathrm{emit}} = \\frac{-k_\\mu u^\\mu_\\mathrm{obs}}{-k_\\mu u^\\mu_\\mathrm{emit}}', tag: 'Observable', appliesTo: 'Ray-tracing renderers', assumptions: 'General Spacetime formulation' },
          { type: 'formula', name: 'Weak-Field Lensing Deflection', tex: '\\alpha= \\frac{4GM}{bc^2} \\quad,\\quad \\theta_E= \\sqrt{ \\frac{4GM}{c^2} \\frac{D_{LS}}{D_LD_S} }', tag: 'Observable', appliesTo: 'Einstein rings', assumptions: 'Small deflection angle' }
        ]
      },
      {
        title: 'Gravitational Waves',
        items: [
          { type: 'formula', name: 'Linearized Metric & Wave Equation', tex: 'g_{\\mu\\nu} = \\eta_{\\mu\\nu}+h_{\\mu\\nu} \\quad,\\quad \\Box h_{ij}^{TT}=0', tag: 'Wave Equation', appliesTo: 'Transverse-Traceless gauge', assumptions: 'Vacuum, far from source' },
          { type: 'formula', name: 'Quadrupole Waveform', tex: 'h_{ij}^{TT} = \\frac{2G}{c^4D} \\ddot Q_{ij}^{TT}', tag: 'Generation', appliesTo: 'Binary systems', assumptions: 'Quadrupole approximation' },
          { type: 'formula', name: 'GW Frequency', tex: 'f_\\mathrm{GW}=2f_\\mathrm{orb}', tag: 'Kinematics', appliesTo: 'Binaries', assumptions: 'Circular orbit dominant harmonic' },
          { type: 'formula', name: 'Chirp Mass', tex: '\\mathcal M = \\frac{(m_1m_2)^{3/5}}{(m_1+m_2)^{1/5}}', tag: 'Mass Parameter', appliesTo: 'GW Inspiral phase', assumptions: 'Primary observable' },
          { type: 'formula', name: 'Chirp Rate (Frequency Evolution)', tex: '\\dot f = \\frac{96}{5} \\pi^{8/3} \\left( \\frac{G\\mathcal M}{c^3} \\right)^{5/3} f^{11/3}', tag: 'Inspiral Dynamics', appliesTo: 'LIGO/LISA sources', assumptions: 'Energy loss drives inspiral' }
        ]
      }
    ]
  },
  {
    id: 'blackholes',
    title: 'Black Hole Physics',
    sections: [
      {
        title: 'The Black Hole Metric Family',
        items: [
          { type: 'text', content: 'Classical solutions: Schwarzschild ($M$), Kerr ($M+J$), Reissner-Nordström ($M+Q$), Kerr-Newman ($M+J+Q$).' },
          { type: 'formula', name: 'Schwarzschild Metric', tex: 'ds^2= -\\left(1-\\frac{2GM}{rc^2}\\right)c^2dt^2 + \\left(1-\\frac{2GM}{rc^2}\\right)^{-1}dr^2 +r^2d\\Omega^2', tag: 'Spacetime Metric', appliesTo: 'Static, neutral black holes', assumptions: 'Spherical symmetry, vacuum' },
          { type: 'formula', name: 'Reissner-Nordström Horizons', tex: 'r_\\pm = \\frac{GM}{c^2} \\pm \\sqrt{ \\left(\\frac{GM}{c^2}\\right)^2 - \\frac{GQ^2}{4\\pi\\epsilon_0c^4} }', tag: 'Horizon Radius', appliesTo: 'Charged, non-rotating holes', assumptions: 'Spherical symmetry' },
          { type: 'formula', name: 'Kerr Metric', tex: 'ds^2= -\\left(1-\\frac{2r_gr}{\\Sigma}\\right)c^2dt^2 -\\frac{4r_gar\\sin^2\\theta}{\\Sigma}c\\,dt\\,d\\phi +\\frac{\\Sigma}{\\Delta}dr^2 +\\Sigma d\\theta^2 + \\left( r^2+a^2+ \\frac{2r_ga^2r\\sin^2\\theta}{\\Sigma} \\right) \\sin^2\\theta\\,d\\phi^2', tag: 'Spacetime Metric', appliesTo: 'Rotating black holes', assumptions: 'Axisymmetric, vacuum' }
        ]
      },
      {
        title: 'Kerr Horizons & Ergospheres',
        items: [
          { type: 'text', content: 'For Kerr: $r_g=GM/c^2$, $a=J/Mc$, $a_*=cJ/GM^2$, $\\Sigma=r^2+a^2\\cos^2\\theta$, $\\Delta=r^2-2r_gr+a^2$' },
          { type: 'formula', name: 'Kerr Extremality Limit', tex: '|a_*|\\le 1', tag: 'Physical Limit', appliesTo: 'Cosmic censorship', assumptions: 'Prevents naked singularities' },
          { type: 'formula', name: 'Kerr Event Horizons', tex: 'r_\\pm= \\frac{GM}{c^2} \\pm \\sqrt{ \\left(\\frac{GM}{c^2}\\right)^2-a^2 } \\quad,\\quad r_+=r_g+\\sqrt{r_g^2-a^2}', tag: 'Horizon Radius', appliesTo: 'Outer and Inner boundaries', assumptions: 'a < GM/c^2' },
          { type: 'formula', name: 'Horizon Identities', tex: 'r_+r_-=a^2 \\quad,\\quad r_++r_-=2r_g', tag: 'Mathematical Property', appliesTo: 'Metric simplifications', assumptions: 'Kerr Geometry' },
          { type: 'formula', name: 'Ergosphere (Static Limit)', tex: 'r_\\mathrm{ergo} = r_g+\\sqrt{r_g^2-a^2\\cos^2\\theta}', tag: 'Boundary', appliesTo: 'Region where frame-dragging > c', assumptions: 'Penrose process possible' },
          { type: 'formula', name: 'Frame Dragging (Lense-Thirring vs Exact)', tex: '\\Omega_\\mathrm{LT} \\approx \\frac{2GJ}{c^2r^3} \\quad,\\quad \\omega=-\\frac{g_{t\\phi}}{g_{\\phi\\phi}}', tag: 'Frame Dragging', appliesTo: 'Space dragging rate', assumptions: 'ZAMO observer' }
        ]
      },
      {
        title: 'Kerr Ray Tracing & Photon Dynamics',
        items: [
          { type: 'text', content: 'For accurate Kerr rendering, trajectories depend on Constants of Motion ($E, L_z, Q$).' },
          { type: 'formula', name: 'Kerr Radial & Polar Potentials', tex: '\\mathcal R(r) = \\left[E(r^2+a^2)-aL_z\\right]^2 - \\Delta \\left[ Q+(L_z-aE)^2 \\right] \\quad,\\quad \\Theta(\\theta) = Q - \\cos^2\\theta \\left[ a^2E^2- \\frac{L_z^2}{\\sin^2\\theta} \\right]', tag: 'Geodesic Potentials', appliesTo: 'Trajectory boundary conditions', assumptions: 'Kerr spacetime' },
          { type: 'formula', name: 'Kerr Trajectory Equations', tex: '\\Sigma^2 \\left(\\frac{dr}{d\\lambda}\\right)^2 = \\mathcal R(r) \\quad,\\quad \\Sigma^2 \\left(\\frac{d\\theta}{d\\lambda}\\right)^2 = \\Theta(\\theta)', tag: 'First-Order ODEs', appliesTo: 'Ray tracing engines', assumptions: 'Affine parameter \\lambda' },
          { type: 'formula', name: 'Kerr Circular Photon Orbits', tex: '\\mathcal R(r)=0 \\quad,\\quad \\frac{d\\mathcal R}{dr}=0', tag: 'Unstable Orbits', appliesTo: 'Defines the photon shell', assumptions: 'Spin-dependent radii' },
          { type: 'formula', name: 'Kerr Celestial Coordinates (Shadow)', tex: '\\alpha = -\\frac{\\xi}{\\sin\\theta_o} \\quad,\\quad \\beta = \\pm \\sqrt{\\eta +a^2\\cos^2\\theta_o -\\xi^2\\cot^2\\theta_o}', tag: 'Image Plane Coords', appliesTo: 'Shadow contour rendering', assumptions: '\\xi=L_z/E, \\eta=Q/E^2' }
        ]
      }
    ]
  },
  {
    id: 'bhthermo',
    title: 'Black Hole Thermodynamics',
    sections: [
      {
        title: 'Temperature, Entropy & Mechanics',
        items: [
          { type: 'formula', name: 'Kerr Horizon Area', tex: 'A=4\\pi(r_+^2+a^2) \\quad \\text{or} \\quad A=8\\pi r_g \\left( r_g+\\sqrt{r_g^2-a^2} \\right)', tag: 'Geometric Property', appliesTo: 'Outer horizon', assumptions: 'Stationary black hole' },
          { type: 'formula', name: 'Surface Gravity', tex: '\\kappa = \\frac{c^2(r_+-r_-)}{2(r_+^2+a^2)}', tag: 'Geometric Property', appliesTo: 'Acceleration at horizon', assumptions: 'Kerr geometry' },
          { type: 'formula', name: 'Hawking Temperature', tex: 'T_H= \\frac{\\hbar\\kappa}{2\\pi k_Bc}', tag: 'Quantum Emission', appliesTo: 'Black hole evaporation', assumptions: 'QFT in curved spacetime' },
          { type: 'formula', name: 'Bekenstein-Hawking Entropy', tex: 'S_\\mathrm{BH} = \\frac{k_Bc^3A}{4G\\hbar} = \\frac{k_BA}{4l_P^2}', tag: 'Thermodynamics', appliesTo: 'Information paradox limits', assumptions: 'Holographic principle' },
          { type: 'formula', name: 'Angular Velocity of Horizon', tex: '\\Omega_H = \\frac{ac}{r_+^2+a^2}', tag: 'Kinematics', appliesTo: 'Black hole rotation', assumptions: 'Rigid rotation of horizon' },
          { type: 'formula', name: 'First Law of BH Mechanics', tex: 'd(Mc^2) = T_HdS + \\Omega_HdJ + \\Phi_HdQ', tag: 'Energy Conservation', appliesTo: 'Perturbed black holes', assumptions: 'Thermodynamic equivalence' },
          { type: 'formula', name: 'Second Law (Area Theorem)', tex: '\\Delta A\\ge0', tag: 'Thermodynamics', appliesTo: 'Classical BH mergers', assumptions: 'Null energy condition holds' }
        ]
      }
    ]
  },
  {
    id: 'stellar',
    title: 'Stellar Astrophysics & Remnants',
    sections: [
      {
        title: 'Complete Stellar Structure',
        items: [
          { type: 'text', content: 'The Four Equations of Stellar Structure:' },
          { type: 'formula', name: 'Mass Conservation', tex: '\\frac{dm}{dr}=4\\pi r^2\\rho', tag: 'Structure Equation', appliesTo: 'Stellar interiors', assumptions: 'Spherical symmetry' },
          { type: 'formula', name: 'Hydrostatic Equilibrium', tex: '\\frac{dP}{dr} = -\\frac{Gm\\rho}{r^2}', tag: 'Structure Equation', appliesTo: 'Stellar interiors', assumptions: 'Newtonian gravity, no acceleration' },
          { type: 'formula', name: 'Energy Generation', tex: '\\frac{dL}{dr} = 4\\pi r^2\\rho\\epsilon', tag: 'Structure Equation', appliesTo: 'Nuclear cores', assumptions: 'Local energy production' },
          { type: 'formula', name: 'Radiative Transport', tex: '\\frac{dT}{dr} = -\\frac{3\\kappa\\rho L}{16\\pi acT^3r^2}', tag: 'Structure Equation', appliesTo: 'Radiative zones', assumptions: 'Diffusion approximation' },
          { type: 'formula', name: 'Nuclear Energy Rate', tex: 'r_{12} = n_1n_2 \\langle\\sigma v\\rangle \\quad,\\quad \\epsilon_\\mathrm{nuc} = \\frac{Q\\,r_{12}}{\\rho}', tag: 'Nuclear Physics', appliesTo: 'Fusion cores', assumptions: 'Q = \\Delta mc^2' }
        ]
      },
      {
        title: 'Polytropes & Lane-Emden',
        items: [
          { type: 'text', content: 'For polytropic stars ($P=K\\rho^{1+1/n}$):' },
          { type: 'formula', name: 'Lane-Emden Equation', tex: '\\frac1{\\xi^2} \\frac{d}{d\\xi} \\left( \\xi^2\\frac{d\\theta}{d\\xi} \\right) + \\theta^n=0', tag: 'Structure Equation', appliesTo: 'Simplified stellar models', assumptions: 'Hydrostatic polytrope' },
          { type: 'formula', name: 'Scaling Relations', tex: '\\rho=\\rho_c\\theta^n \\quad,\\quad r=\\alpha\\xi \\quad,\\quad \\alpha^2 = \\frac{(n+1)K}{4\\pi G} \\rho_c^{1/n-1}', tag: 'Model Mapping', appliesTo: 'Physical dimensions', assumptions: 'Polytropic index n' },
          { type: 'formula', name: 'Total Mass', tex: 'M = 4\\pi\\alpha^3\\rho_c \\left(-\\xi^2\\frac{d\\theta}{d\\xi}\\right)_{\\xi_1}', tag: 'Integration Result', appliesTo: 'Stellar mass', assumptions: 'Evaluated at surface \\xi_1' }
        ]
      },
      {
        title: 'Neutron Stars',
        items: [
          { type: 'text', content: 'Relativistic TOV System:' },
          { type: 'formula', name: 'TOV Equation', tex: '\\frac{dP}{dr} = -\\frac{G \\left(\\rho+\\frac{P}{c^2}\\right) \\left(m+\\frac{4\\pi r^3P}{c^2}\\right)}{r^2 \\left(1-\\frac{2Gm}{rc^2}\\right)}', tag: 'Relativistic Structure', appliesTo: 'Neutron star interiors', assumptions: 'General Relativity, Spherical' },
          { type: 'formula', name: 'EOS Closure & Conditions', tex: 'P=P(\\epsilon) \\quad,\\quad m(0)=0 \\quad,\\quad P(0)=P_c \\quad,\\quad P(R)=0', tag: 'Boundary Conditions', appliesTo: 'TOV integration', assumptions: 'Central pressure P_c defines mass' },
          { type: 'formula', name: 'Binding Energy & Tidal Deformability', tex: 'E_\\mathrm{bind} \\approx (M_b-M_g)c^2 \\quad,\\quad \\Lambda= \\frac{2}{3}k_2 \\left(\\frac{Rc^2}{GM}\\right)^5', tag: 'Properties', appliesTo: 'NS mergers, Gravitational waves', assumptions: 'Nuclear EOS dependent' },
          { type: 'text', content: 'For realistic rotating models, the Hartle-Thorne slow-rotation formalism ($J, Q_\\mathrm{quad}, \\omega(r)$) must replace simple Newtonian limits.' },
          { type: 'formula', name: 'Newtonian Mass-Shedding Estimate', tex: '\\Omega_K\\approx \\sqrt{\\frac{GM}{R^3}}', tag: 'Kinematics', appliesTo: 'Millisecond pulsars', assumptions: 'Non-relativistic breakup limit' }
        ]
      },
      {
        title: 'Pulsars & Magnetars',
        items: [
          { type: 'formula', name: 'Magnetic Dipole Field & Vector Potential', tex: 'B_r= \\frac{2\\mu\\cos\\theta}{r^3} \\quad,\\quad B_\\theta= \\frac{\\mu\\sin\\theta}{r^3} \\quad,\\quad A_\\phi= \\frac{\\mu\\sin\\theta}{r^2}', tag: 'Magnetic Field', appliesTo: 'Pulsar magnetosphere', assumptions: 'Ideal dipole' },
          { type: 'formula', name: 'Polar Cap Radius', tex: 'r_\\mathrm{pc} \\approx R \\sqrt{\\frac{R}{R_\\mathrm{LC}}}', tag: 'Magnetosphere', appliesTo: 'Open field line region', assumptions: 'Dipole geometry' },
          { type: 'formula', name: 'Pulsar Spin-Down & Braking Index', tex: '\\dot E = -\\frac{2\\mu^2\\Omega^4\\sin^2\\alpha}{3c^3} \\quad,\\quad \\dot\\Omega\\propto-\\Omega^n \\quad,\\quad n= \\frac{\\Omega\\ddot\\Omega}{\\dot\\Omega^2}', tag: 'Energy Loss', appliesTo: 'Radio pulsars', assumptions: 'Vacuum dipole radiation' },
          { type: 'formula', name: 'Integrated Braking Law', tex: '\\Omega(t)^{1-n} = \\Omega_0^{1-n} + (n-1)Kt', tag: 'Evolution', appliesTo: 'Pulsar spin history', assumptions: 'Constant braking index n != 1' },
          { type: 'formula', name: 'Light Cylinder & GJ Density', tex: 'R_\\mathrm{LC}= \\frac{c}{\\Omega} \\quad,\\quad \\rho_\\mathrm{GJ} \\approx -\\frac{\\mathbf\\Omega\\cdot\\mathbf B}{2\\pi c}', tag: 'Magnetosphere', appliesTo: 'Co-rotating plasma limits', assumptions: 'Force-free electrodynamics' },
          { type: 'formula', name: 'Magnetar Timescales', tex: 't_\\mathrm{Ohm} \\sim \\frac{L^2}{\\eta} \\quad,\\quad t_\\mathrm{Hall} \\sim \\frac{4\\pi en_eL^2}{cB}', tag: 'Magnetic Evolution', appliesTo: 'Magnetar crusts', assumptions: 'Conductivity vs Hall drift' },
          { type: 'formula', name: 'Magnetic Stress Tensor', tex: 'T_{ij}^{(B)} = \\frac{1}{4\\pi} \\left( B_iB_j -\\frac12B^2\\delta_{ij} \\right)', tag: 'Stress-Energy', appliesTo: 'Magnetar structure', assumptions: 'Gaussian-cgs units' }
        ]
      }
    ]
  },
  {
    id: 'highenergy',
    title: 'High-Energy (Accretion & Jets)',
    sections: [
      {
        title: 'Accretion & Disks',
        items: [
          { type: 'formula', name: 'Eddington Luminosity', tex: 'L_\\mathrm{Edd} = \\frac{4\\pi GMm_pc}{\\sigma_T} \\approx 1.26\\times10^{38} \\left(\\frac{M}{M_\\odot}\\right) \\mathrm{erg\\,s^{-1}}', tag: 'Radiation Limit', appliesTo: 'Spherical accretion', assumptions: 'Thomson scattering dominates' },
          { type: 'formula', name: 'Kerr ISCO', tex: 'r_\\mathrm{ISCO} = r_g \\left[ 3+Z_2 - s\\sqrt{(3-Z_1)(3+Z_1+2Z_2)} \\right]', tag: 'Inner Disk Boundary', appliesTo: 'Rotating BH disks', assumptions: 's=+1 (prograde) or -1 (retrograde)' },
          { type: 'formula', name: 'Kerr Disk Orbital Velocity', tex: '\\Omega_\\pm = \\frac{c^3}{GM} \\frac{1}{r_*^{3/2}\\pm a_*}', tag: 'Kinematics', appliesTo: 'Relativistic disk fluid', assumptions: 'Circular Keplerian orbits' },
          { type: 'formula', name: 'Invariant Intensity (Ray Tracing)', tex: 'I_{\\nu,\\mathrm{obs}} = g^3 I_{\\nu,\\mathrm{emit}} \\quad \\text{where} \\quad g= \\frac{\\nu_\\mathrm{obs}}{\\nu_\\mathrm{emit}}', tag: 'Observable', appliesTo: 'Relativistic rendering', assumptions: 'I_\\nu/\\nu^3 = constant' }
        ]
      },
      {
        title: 'Quasars, Jets & Cooling',
        items: [
          { type: 'formula', name: 'Blandford-Znajek Jet Power', tex: 'P_\\mathrm{BZ} \\propto \\Phi_B^2\\Omega_H^2/c', tag: 'Jet Launching', appliesTo: 'Quasar / AGN jets', assumptions: 'Magnetic field threads Kerr horizon' },
          { type: 'formula', name: 'Relativistic Beaming', tex: '\\delta= \\frac{1}{\\Gamma(1-\\beta\\cos\\theta)} \\quad,\\quad \\beta_\\mathrm{app} = \\frac{\\beta\\sin\\theta}{1-\\beta\\cos\\theta}', tag: 'Kinematics', appliesTo: 'Jet apparent superluminal motion', assumptions: '\\Gamma = (1-\\beta^2)^{-1/2}' },
          { type: 'formula', name: 'Synchrotron Frequency & Power', tex: '\\nu_c = \\frac{3}{2}\\gamma^2 \\frac{eB\\sin\\alpha}{2\\pi m_e} \\quad,\\quad P_\\mathrm{syn} = \\frac{4}{3} \\sigma_Tc \\gamma^2 \\beta^2 U_B', tag: 'Non-thermal Emission', appliesTo: 'Jet radio/X-ray emission', assumptions: 'U_B = B^2/8pi' },
          { type: 'formula', name: 'Synchrotron Cooling Time', tex: 't_\\mathrm{syn} = \\frac{\\gamma m_ec^2}{P_\\mathrm{syn}}', tag: 'Plasma Physics', appliesTo: 'Electron energy loss', assumptions: 'Continuous injection needed' },
          { type: 'formula', name: 'Inverse Compton Power', tex: 'P_\\mathrm{IC} = \\frac43\\sigma_Tc\\gamma^2\\beta^2U_\\mathrm{rad} \\quad \\implies \\quad P_\\mathrm{loss} = P_\\mathrm{syn}+P_\\mathrm{IC}', tag: 'Scattering', appliesTo: 'X-ray/Gamma-ray emission', assumptions: 'Thomson regime' },
          { type: 'formula', name: 'Pair Production Threshold', tex: 'E_1E_2(1-\\cos\\theta) \\ge 2(m_ec^2)^2', tag: 'Quantum Electrodynamics', appliesTo: 'Gamma-ray opacity in jets', assumptions: '\\gamma + \\gamma \\rightarrow e^- + e^+' }
        ]
      }
    ]
  },
  {
    id: 'cosmology',
    title: 'Cosmology',
    sections: [
      {
        title: 'FLRW Spacetime & Universe Expansion',
        items: [
          { type: 'formula', name: 'FLRW Metric', tex: 'ds^2 = -c^2dt^2 + a(t)^2 \\left[ \\frac{dr^2}{1-kr^2} +r^2d\\Omega^2 \\right]', tag: 'Spacetime Metric', appliesTo: 'Expanding Universe', assumptions: 'Homogeneous, isotropic' },
          { type: 'formula', name: 'Friedmann Equation', tex: 'H^2= \\frac{8\\pi G}{3}\\rho -\\frac{kc^2}{a^2} +\\frac{\\Lambda c^2}{3} \\quad \\left( H=\\frac{\\dot a}{a} \\right)', tag: 'Expansion Dynamics', appliesTo: 'FLRW Universe', assumptions: 'Derived from Einstein equations' },
          { type: 'formula', name: 'Acceleration Equation', tex: '\\frac{\\ddot a}{a} = -\\frac{4\\pi G}{3} \\left( \\rho+\\frac{3P}{c^2} \\right) + \\frac{\\Lambda c^2}{3}', tag: 'Expansion Dynamics', appliesTo: 'Dark Energy / Matter balance', assumptions: 'FLRW Spacetime' },
          { type: 'formula', name: 'Continuity Equation', tex: '\\dot\\rho + 3H \\left( \\rho+\\frac{P}{c^2} \\right) =0', tag: 'Conservation Law', appliesTo: 'Cosmic fluids', assumptions: 'Adiabatic expansion' },
          { type: 'formula', name: 'Cosmic Equation of State Scaling', tex: 'P=w\\rho c^2 \\quad \\implies \\quad \\rho\\propto a^{-3(1+w)}', tag: 'Fluid Evolution', appliesTo: 'Matter (w=0), Rad (w=1/3), \\Lambda (w=-1)', assumptions: 'Constant w' }
        ]
      },
      {
        title: 'Cosmological Parameters & Distances',
        items: [
          { type: 'formula', name: 'Critical Density & Density Parameters', tex: '\\rho_c= \\frac{3H^2}{8\\pi G} \\quad,\\quad \\Omega_i= \\frac{\\rho_i}{\\rho_c}', tag: 'Cosmological Parameters', appliesTo: 'Determining universe geometry', assumptions: 'Flat universe if \\Omega_tot = 1' },
          { type: 'formula', name: 'Cosmological Closure Relation', tex: '\\Omega_\\mathrm{tot} = \\Omega_m+\\Omega_r+\\Omega_\\Lambda+\\Omega_k = 1', tag: 'Cosmological Parameters', appliesTo: 'Global geometry', assumptions: 'Defined at current epoch' },
          { type: 'formula', name: 'Hubble Parameter Evolution', tex: 'H(z) = H_0 \\sqrt{ \\Omega_r(1+z)^4+ \\Omega_m(1+z)^3+ \\Omega_k(1+z)^2+ \\Omega_\\Lambda }', tag: 'Expansion History', appliesTo: 'Standard LCDM model', assumptions: 'Constant dark energy EOS' },
          { type: 'formula', name: 'Lookback Time', tex: 't_L(z) = \\int_0^z \\frac{dz\'}{(1+z\')H(z\')}', tag: 'Cosmic Time', appliesTo: 'Age of observed objects', assumptions: 'Depends on H_0 and Omegas' },
          { type: 'formula', name: 'Comoving Distance', tex: 'D_C= c\\int_0^z\\frac{dz\'}{H(z\')}', tag: 'Distance Measure', appliesTo: 'Large scale structure', assumptions: 'Expands with universe' },
          { type: 'formula', name: 'Cosmological Redshift', tex: '1+z= \\frac{a_0}{a_\\mathrm{emit}} \\implies a_\\mathrm{emit}=\\frac{1}{1+z}', tag: 'Observable', appliesTo: 'Distant galaxies', assumptions: 'a_0 = 1 (current scale factor)' }
        ]
      }
    ]
  },
  {
    id: 'qm_field',
    title: 'Quantum Mechanics & QFT',
    sections: [
      {
        title: 'Core Quantum Mechanics',
        items: [
          { type: 'formula', name: 'Schrödinger Equation', tex: 'i\\hbar \\frac{\\partial\\psi}{\\partial t} = \\hat H\\psi \\quad,\\quad \\hat H\\psi=E\\psi', tag: 'Wave Equation', appliesTo: 'Non-relativistic quantum systems', assumptions: 'Unitary evolution' },
          { type: 'formula', name: 'Heisenberg Uncertainty Principle', tex: '\\Delta x\\,\\Delta p\\geq\\frac{\\hbar}{2} \\quad,\\quad \\Delta E\\,\\Delta t \\gtrsim\\frac{\\hbar}{2}', tag: 'Fundamental Limit', appliesTo: 'Conjugate variables', assumptions: 'Non-commuting operators' },
          { type: 'formula', name: 'Planck Relations & Scales', tex: 'E=h\\nu \\quad,\\quad p=\\frac{h}{\\lambda} \\quad,\\quad l_P= \\sqrt{\\frac{\\hbar G}{c^3}}', tag: 'Quantum Thresholds', appliesTo: 'Photons, Quantum Gravity limits', assumptions: 'h-bar = h/2pi' },
          { type: 'formula', name: 'Planck Mass & Time', tex: 't_P= \\sqrt{\\frac{\\hbar G}{c^5}} \\quad,\\quad m_P= \\sqrt{\\frac{\\hbar c}{G}} \\quad,\\quad E_P=m_Pc^2', tag: 'Quantum Thresholds', appliesTo: 'Big bang, Singularities', assumptions: 'G, c, hbar = 1' }
        ]
      },
      {
        title: 'Relativistic Quantum & QFT',
        items: [
          { type: 'formula', name: 'Dirac Equation', tex: '(i\\hbar c\\gamma^\\mu\\partial_\\mu-mc^2)\\psi=0', tag: 'Wave Equation', appliesTo: 'Spin-1/2 Fermions (electrons)', assumptions: 'Relativistic covariance' },
          { type: 'formula', name: 'Klein-Gordon Equation', tex: '\\left( \\Box+\\frac{m^2c^2}{\\hbar^2} \\right)\\phi=0', tag: 'Wave Equation', appliesTo: 'Spin-0 Bosons (Higgs)', assumptions: 'Relativistic scalar field' },
          { type: 'formula', name: 'QFT Action & Euler-Lagrange', tex: 'S=\\int\\mathcal L\\,d^4x \\implies \\frac{\\partial\\mathcal L}{\\partial\\phi} - \\partial_\\mu \\left( \\frac{\\partial\\mathcal L}{\\partial(\\partial_\\mu\\phi)} \\right) =0', tag: 'Stationary Action', appliesTo: 'All quantum fields', assumptions: 'Local field theory' }
        ]
      }
    ]
  },
  {
    id: 'engine_boundaries',
    title: 'Simulation Boundaries',
    sections: [
      {
        title: 'Engine Epistemology',
        items: [
          { type: 'text', content: 'NOTE: This engine exclusively implements verified classical, relativistic, and standard-model quantum physics. It explicitly EXCLUDES speculative/hypothetical formulas such as:' },
          { type: 'text', content: '- Loop Quantum Gravity discrete area/volume operators\n- String Theory multidimensional metric tensors\n- Hypothetical White Hole metrics (beyond conformal extensions)\n- Torsion-based modifications to General Relativity' }
        ]
      }
    ]
  }
];

// ==========================================================
// 2. REUSABLE UI COMPONENTS
// ==========================================================

const KatexRenderer = ({ tex, block = false }) => {
  const containerRef = useRef();

  useEffect(() => {
    if (window.katex && containerRef.current) {
      window.katex.render(tex, containerRef.current, {
        displayMode: block,
        throwOnError: false,
        strict: false
      });
    }
  }, [tex, block]);

  return <span ref={containerRef} className={block ? 'katex-block-container' : 'katex-inline-container'} />;
};

const FormulaCard = ({ formula, isSelected, onClick }) => {
  return (
    <div 
      onClick={() => onClick(formula)}
      style={{
        background: isSelected ? 'rgba(34, 211, 238, 0.05)' : 'rgba(255, 255, 255, 0.02)',
        border: `1px solid ${isSelected ? 'rgba(34, 211, 238, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
        borderRadius: '6px',
        padding: '16px 20px',
        margin: '12px 0',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80px',
        boxShadow: isSelected ? '0 0 15px rgba(34, 211, 238, 0.1)' : 'none'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
      }}
    >
      <div style={{ width: '100%', fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', textAlign: 'left' }}>
        {formula.name}
      </div>
      <div style={{ padding: '8px 0', fontSize: '1.1rem', maxWidth: '100%', overflowX: 'auto' }}>
        <KatexRenderer tex={formula.tex} block={true} />
      </div>
    </div>
  );
};

// ==========================================================
// 3. MAIN APPLICATION VIEWS
// ==========================================================

const SimulatorView = () => {
  return (
    <div style={{ flex: 1, position: 'relative', background: '#000' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#22d3ee" />
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial color="#111" roughness={0.1} metalness={0.8} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 4.5, 64]} />
          <meshBasicMaterial color="#ff7b00" side={THREE.DoubleSide} transparent opacity={0.4} />
        </mesh>
        <OrbitControls autoRotate autoRotateSpeed={0.5} enablePan={false} />
      </Canvas>
      <div style={{ position: 'absolute', bottom: 20, left: 20, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
        ENGINE: ACTIVE | RENDERING: KERR METRIC
      </div>
    </div>
  );
};

const TheoryView = ({ activeChapterId, onSelectChapter }) => {
  const [selectedFormula, setSelectedFormula] = useState(null);

  useEffect(() => {
    const chapter = THEORY_DATA.find(c => c.id === activeChapterId);
    if (chapter) {
      let firstFormula = null;
      for (const section of chapter.sections) {
        firstFormula = section.items.find(i => i.type === 'formula');
        if (firstFormula) break;
      }
      setSelectedFormula(firstFormula || null);
    }
  }, [activeChapterId]);

  const activeChapter = THEORY_DATA.find(c => c.id === activeChapterId) || THEORY_DATA[0];

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      
      {/* LEFT: THEORY NAVIGATION SIDEBAR */}
      <div style={{ width: '240px', background: '#0a0d14', borderRight: '1px solid #1f2937', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 16px', fontSize: '11px', color: '#6b7280', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          Theory Chapters
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 8px' }}>
          {THEORY_DATA.map(chapter => (
            <div 
              key={chapter.id}
              onClick={() => onSelectChapter(chapter.id)}
              style={{
                padding: '10px 16px',
                margin: '4px 0',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                color: activeChapterId === chapter.id ? '#22d3ee' : '#e5e7eb',
                background: activeChapterId === chapter.id ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                borderLeft: activeChapterId === chapter.id ? '3px solid #22d3ee' : '3px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              {chapter.title}
            </div>
          ))}
        </div>
      </div>

      {/* MIDDLE: MAIN THEORY CONTENT */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 60px', background: '#05070b' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', color: '#fff', margin: '0 0 8px 0', fontWeight: '400' }}>{activeChapter.title}</h1>
          <hr style={{ border: 'none', borderBottom: '1px solid #1f2937', margin: '0 0 40px 0' }} />

          {activeChapter.sections.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: '50px' }}>
              <h2 style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '20px', fontWeight: '500' }}>
                {sIdx + 1}. {section.title}
              </h2>
              
              {section.items.map((item, iIdx) => {
                if (item.type === 'text') {
                  const parts = item.content.split(/(\$.*?\$)/g);
                  return (
                    <p key={iIdx} style={{ color: '#d1d5db', lineHeight: '1.6', fontSize: '15px', marginBottom: '12px' }}>
                      {parts.map((part, pIdx) => 
                        part.startsWith('$') && part.endsWith('$') 
                          ? <KatexRenderer key={pIdx} tex={part.slice(1, -1)} block={false} />
                          : <span key={pIdx}>{part}</span>
                      )}
                    </p>
                  );
                }
                
                if (item.type === 'formula') {
                  return (
                    <FormulaCard 
                      key={iIdx} 
                      formula={item} 
                      isSelected={selectedFormula?.name === item.name}
                      onClick={setSelectedFormula}
                    />
                  );
                }
                return null;
              })}
            </div>
          ))}
          <div style={{ height: '100px' }} /> 
        </div>
      </div>

      {/* RIGHT: SELECTED FORMULA INSPECTOR */}
      <div style={{ width: '320px', background: '#0a0d14', borderLeft: '1px solid #1f2937', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 'bold', letterSpacing: '1px' }}>SELECTED EQUATION</span>
        </div>
        
        {selectedFormula ? (
          <div style={{ padding: '24px 20px', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '18px', fontWeight: '500' }}>{selectedFormula.name}</h3>
            
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '8px', border: '1px solid #1f2937', marginBottom: '30px', overflowX: 'auto' }}>
              <KatexRenderer tex={selectedFormula.tex} block={true} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '10px', color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>TYPE</div>
              <div style={{ fontSize: '14px', color: '#e5e7eb' }}>{selectedFormula.tag}</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '10px', color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>APPLIES TO</div>
              <div style={{ fontSize: '14px', color: '#e5e7eb' }}>{selectedFormula.appliesTo}</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '10px', color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>ASSUMPTIONS</div>
              <div style={{ fontSize: '14px', color: '#e5e7eb', lineHeight: '1.5' }}>{selectedFormula.assumptions}</div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
            Click an equation in the main panel to view its physical properties and assumptions.
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================================
// 4. MAIN APP SHELL
// ==========================================================
export default function AstrophysicsEngine() {
  const [appMode, setAppMode] = useState('THEORY');
  const [activeChapterId, setActiveChapterId] = useState('gr');
  const [katexLoaded, setKatexLoaded] = useState(false);

  useEffect(() => {
    if (document.getElementById('katex-stylesheet')) {
      setKatexLoaded(true);
      return;
    }
    
    const link = document.createElement('link');
    link.id = 'katex-stylesheet';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
    script.crossOrigin = 'anonymous';
    script.onload = () => setKatexLoaded(true);
    document.head.appendChild(script);

    const style = document.createElement('style');
    style.innerHTML = `
      * { box-sizing: border-box; }
      body, html { margin: 0; padding: 0; width: 100vw; height: 100vh; background: #05070b; color: #e5e7eb; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; overflow: hidden; }
      .katex-block-container { display: flex; justify-content: center; width: 100%; overflow-x: auto; overflow-y: hidden; }
      .katex-inline-container { display: inline-block; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #374151; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: #4b5563; }
    `;
    document.head.appendChild(style);
  }, []);

  if (!katexLoaded) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05070b', color: '#22d3ee', fontFamily: 'monospace' }}>INITIALIZING KERNEL...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#05070b' }}>
      
      {/* TOP APPLICATION HEADER */}
      <div style={{ height: '56px', background: '#0a0d14', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 10px #22d3ee' }}></div>
            <span style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold', color: '#fff', letterSpacing: '1px' }}>ASTROPHYSICS ENGINE</span>
          </div>
          
          <div style={{ display: 'flex', background: '#111827', borderRadius: '6px', padding: '4px', border: '1px solid #1f2937' }}>
            <button 
              onClick={() => setAppMode('SIMULATOR')}
              style={{
                background: appMode === 'SIMULATOR' ? '#374151' : 'transparent',
                color: appMode === 'SIMULATOR' ? '#fff' : '#9ca3af',
                border: 'none', padding: '6px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              SIMULATOR
            </button>
            <button 
              onClick={() => setAppMode('THEORY')}
              style={{
                background: appMode === 'THEORY' ? '#374151' : 'transparent',
                color: appMode === 'THEORY' ? '#fff' : '#9ca3af',
                border: 'none', padding: '6px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              THEORY
            </button>
          </div>
        </div>

        {appMode === 'SIMULATOR' && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {['BLACK HOLE', 'NEUTRON STAR', 'WHITE DWARF', 'QUASAR'].map(obj => (
              <button key={obj} style={{ background: 'transparent', border: '1px solid #374151', color: '#d1d5db', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>
                {obj}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MAIN VIEWPORT */}
      {appMode === 'SIMULATOR' ? (
        <SimulatorView />
      ) : (
        <TheoryView 
          activeChapterId={activeChapterId} 
          onSelectChapter={setActiveChapterId} 
        />
      )}
      
    </div>
  );
}