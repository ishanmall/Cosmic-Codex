import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ==========================================================
// 1. COMPLETE STRUCTURED PHYSICS DATA
// Contains all 20 Chapters with complete mathematical frameworks
// ==========================================================
const THEORY_DATA = [
  {
    id: 'classical',
    title: '1. Classical Mechanics & Gravitation',
    sections: [
      {
        title: 'Newtonian Dynamics',
        items: [
          { type: 'formula', name: 'Newton\'s Second Law', tex: '\\mathbf F=m\\mathbf a', tag: 'Dynamics', appliesTo: 'Classical mechanics', assumptions: 'Constant mass, non-relativistic' },
          { type: 'formula', name: 'Linear Momentum', tex: '\\mathbf p=m\\mathbf v \\quad,\\quad \\mathbf F=\\frac{d\\mathbf p}{dt}', tag: 'Conservation', appliesTo: 'Particle dynamics', assumptions: 'None' },
          { type: 'formula', name: 'Angular Momentum & Torque', tex: '\\mathbf L=\\mathbf r\\times\\mathbf p \\quad,\\quad \\boldsymbol\\tau=\\frac{d\\mathbf L}{dt}', tag: 'Conservation', appliesTo: 'Rotational dynamics', assumptions: 'Central forces' },
          { type: 'formula', name: 'Rotational Kinetic Energy', tex: 'K_\\mathrm{rot}=\\frac12I\\omega^2', tag: 'Energy', appliesTo: 'Rigid bodies', assumptions: 'Fixed axis of rotation' }
        ]
      },
      {
        title: 'Gravitation & Orbits',
        items: [
          { type: 'formula', name: 'Gravitational Potential Energy', tex: 'U=-\\frac{GMm}{r}', tag: 'Energy', appliesTo: 'Two-body systems', assumptions: 'Spherical symmetry or point masses' },
          { type: 'formula', name: 'Total Orbital Energy', tex: 'E=\\frac12mv^2-\\frac{GMm}{r}', tag: 'Energy', appliesTo: 'Keplerian orbits', assumptions: 'Isolated two-body system' },
          { type: 'formula', name: 'Vis-Viva Equation', tex: 'v^2=GM\\left(\\frac2r-\\frac1a\\right)', tag: 'Kinematics', appliesTo: 'Elliptical orbits', assumptions: 'Keplerian motion' },
          { type: 'formula', name: 'Kepler\'s Third Law', tex: 'T^2=\\frac{4\\pi^2}{GM}a^3', tag: 'Kinematics', appliesTo: 'Orbital periods', assumptions: 'M >> m' },
          { type: 'formula', name: 'Reduced Mass', tex: '\\mu=\\frac{m_1m_2}{m_1+m_2}', tag: 'Two-body reduction', appliesTo: 'Binary systems', assumptions: 'Center of mass frame' }
        ]
      },
      {
        title: 'Advanced Mechanics',
        items: [
          { type: 'formula', name: 'Lagrangian', tex: 'L=T-U', tag: 'Analytical Mechanics', appliesTo: 'System evolution', assumptions: 'Conservative forces' },
          { type: 'formula', name: 'Euler-Lagrange Equation', tex: '\\frac{d}{dt} \\frac{\\partial L}{\\partial\\dot q_i} - \\frac{\\partial L}{\\partial q_i}=0', tag: 'Equation of Motion', appliesTo: 'Generalized coordinates', assumptions: 'Holonomic constraints' },
          { type: 'formula', name: 'Hamiltonian', tex: 'H=\\sum_i p_i\\dot q_i-L', tag: 'Analytical Mechanics', appliesTo: 'Phase space dynamics', assumptions: 'Legendre transformation of L' },
          { type: 'formula', name: 'Hamilton\'s Equations', tex: '\\dot q_i=\\frac{\\partial H}{\\partial p_i} \\quad,\\quad \\dot p_i=-\\frac{\\partial H}{\\partial q_i}', tag: 'Equations of Motion', appliesTo: 'Symplectic geometry', assumptions: 'Classical phase space' }
        ]
      }
    ]
  },
  {
    id: 'fluids_mhd',
    title: '2. Fluid Dynamics & Magnetohydrodynamics',
    sections: [
      {
        title: 'Fluid Equations',
        items: [
          { type: 'formula', name: 'Material Derivative', tex: '\\frac{D}{Dt} = \\frac{\\partial}{\\partial t} +\\mathbf v\\cdot\\nabla', tag: 'Operator', appliesTo: 'Lagrangian frame tracking', assumptions: 'Continuum hypothesis' },
          { type: 'formula', name: 'Continuity Equation', tex: '\\frac{\\partial\\rho}{\\partial t} +\\nabla\\cdot(\\rho\\mathbf v)=0', tag: 'Conservation', appliesTo: 'Mass transport', assumptions: 'No sources or sinks' },
          { type: 'formula', name: 'Euler Equation', tex: '\\rho \\left( \\frac{\\partial\\mathbf v}{\\partial t} + \\mathbf v\\cdot\\nabla\\mathbf v \\right) = -\\nabla P+\\rho\\mathbf g', tag: 'Momentum', appliesTo: 'Inviscid flows', assumptions: 'Zero viscosity' },
          { type: 'formula', name: 'Navier-Stokes Equation', tex: '\\rho\\frac{D\\mathbf v}{Dt} = -\\nabla P+\\mu\\nabla^2\\mathbf v+\\rho\\mathbf g', tag: 'Momentum', appliesTo: 'Viscous flows', assumptions: 'Newtonian fluid' },
          { type: 'formula', name: 'Vorticity', tex: '\\boldsymbol\\omega=\\nabla\\times\\mathbf v', tag: 'Kinematics', appliesTo: 'Rotational flows', assumptions: 'Continuum field' },
          { type: 'formula', name: 'Bernoulli\'s Principle', tex: '\\frac12v^2+\\frac{P}{\\rho}+\\Phi=\\text{constant}', tag: 'Energy', appliesTo: 'Streamlines', assumptions: 'Steady, incompressible, inviscid' },
          { type: 'formula', name: 'Reynolds Number', tex: 'Re=\\frac{\\rho vL}{\\mu}', tag: 'Dimensionless', appliesTo: 'Flow regime indicator', assumptions: 'Navier-Stokes scaling' },
          { type: 'formula', name: 'Mach Number', tex: 'M=\\frac vc_s', tag: 'Dimensionless', appliesTo: 'Compressibility', assumptions: 'Adiabatic sound speed' }
        ]
      },
      {
        title: 'Magnetohydrodynamics (MHD)',
        items: [
          { type: 'formula', name: 'Induction Equation', tex: '\\frac{\\partial\\mathbf B}{\\partial t} = \\nabla\\times(\\mathbf v\\times\\mathbf B) -\\nabla\\times(\\eta\\nabla\\times\\mathbf B)', tag: 'MHD', appliesTo: 'Conducting fluids', assumptions: 'Ohm\'s law applies' },
          { type: 'formula', name: 'Lorentz Force Density', tex: '\\mathbf f=\\mathbf J\\times\\mathbf B', tag: 'Dynamics', appliesTo: 'Plasma back-reaction', assumptions: 'Non-relativistic bulk motion' },
          { type: 'formula', name: 'Magnetic Pressure', tex: 'P_B=\\frac{B^2}{2\\mu_0}', tag: 'Thermodynamics', appliesTo: 'Plasma confinement', assumptions: 'Isotropic effective pressure' }
        ]
      }
    ]
  },
  {
    id: 'electromagnetism',
    title: '3. Electromagnetism',
    sections: [
      {
        title: 'Potentials & Fields',
        items: [
          { type: 'formula', name: 'Vector & Scalar Potentials', tex: '\\mathbf B=\\nabla\\times\\mathbf A \\quad,\\quad \\mathbf E=-\\nabla\\phi-\\frac{\\partial\\mathbf A}{\\partial t}', tag: 'Definitions', appliesTo: 'Gauge theory', assumptions: 'Classical electrodynamics' },
          { type: 'formula', name: 'Poynting Vector', tex: '\\mathbf S=\\frac1{\\mu_0}\\mathbf E\\times\\mathbf B', tag: 'Energy Transport', appliesTo: 'EM Waves', assumptions: 'Vacuum or linear media' },
          { type: 'formula', name: 'EM Energy Density', tex: 'u= \\frac12 \\left( \\epsilon_0E^2+\\frac{B^2}{\\mu_0} \\right)', tag: 'Energy', appliesTo: 'EM Fields', assumptions: 'Classical vacuum' }
        ]
      },
      {
        title: 'Covariant Formulation',
        items: [
          { type: 'formula', name: 'Electromagnetic Field Tensor', tex: 'F_{\\mu\\nu} = \\partial_\\mu A_\\nu-\\partial_\\nu A_\\mu', tag: 'Tensor', appliesTo: 'Relativistic EM', assumptions: '4-potential A_mu' },
          { type: 'formula', name: 'Covariant Maxwell Equations', tex: '\\nabla_\\mu F^{\\mu\\nu}=\\mu_0J^\\nu', tag: 'Field Equation', appliesTo: 'Sources and fields', assumptions: 'Curved or flat spacetime' },
          { type: 'formula', name: 'EM Stress-Energy Tensor', tex: 'T_{\\mu\\nu}^{EM} = \\frac1{\\mu_0} \\left( F_{\\mu\\alpha}F_\\nu{}^\\alpha -\\frac14g_{\\mu\\nu}F_{\\alpha\\beta}F^{\\alpha\\beta} \\right)', tag: 'Energy-Momentum', appliesTo: 'Coupling to GR', assumptions: 'Symmetric, traceless' }
        ]
      }
    ]
  },
  {
    id: 'radiation',
    title: '4. Radiation & Radiative Transfer',
    sections: [
      {
        title: 'Thermal Radiation',
        items: [
          { type: 'formula', name: 'Planck Function', tex: 'B_\\nu(T)= \\frac{2h\\nu^3}{c^2} \\frac1{e^{h\\nu/k_BT}-1}', tag: 'Spectrum', appliesTo: 'Blackbodies', assumptions: 'Thermal equilibrium' },
          { type: 'formula', name: 'Stefan-Boltzmann Law', tex: 'F=\\sigma T^4', tag: 'Flux', appliesTo: 'Total emitted power', assumptions: 'Integrated over all frequencies' },
          { type: 'formula', name: 'Wien\'s Displacement Law', tex: '\\lambda_{\\max}T=b', tag: 'Spectrum Peak', appliesTo: 'Color temperature', assumptions: 'b ≈ 2.898×10⁻³ m·K' },
          { type: 'formula', name: 'Radiation Energy Density', tex: 'u=aT^4', tag: 'Thermodynamics', appliesTo: 'Photon gas', assumptions: 'Isotropic field' },
          { type: 'formula', name: 'Radiation Pressure', tex: 'P=\\frac13aT^4', tag: 'Thermodynamics', appliesTo: 'Stellar interiors', assumptions: 'Isotropic field' }
        ]
      },
      {
        title: 'Radiative Transfer',
        items: [
          { type: 'formula', name: 'Radiative Transfer Equation', tex: '\\frac{dI_\\nu}{ds} = -\\alpha_\\nu I_\\nu+j_\\nu', tag: 'Transport', appliesTo: 'Media propagation', assumptions: 'Macroscopic ray tracing' },
          { type: 'formula', name: 'Optical Depth', tex: '\\tau_\\nu=\\int\\alpha_\\nu ds', tag: 'Property', appliesTo: 'Opacity tracking', assumptions: 'Integrated along line of sight' },
          { type: 'formula', name: 'Source Function', tex: 'S_\\nu=\\frac{j_\\nu}{\\alpha_\\nu}', tag: 'Definition', appliesTo: 'Emission vs absorption', assumptions: 'Local thermodynamic equilibrium' },
          { type: 'formula', name: 'Formal Solution', tex: 'I_\\nu(s) = I_\\nu(0)e^{-\\tau_\\nu} + \\int_0^s j_\\nu(s\') e^{-[\\tau_\\nu(s)-\\tau_\\nu(s\')]} ds\'', tag: 'Solution', appliesTo: 'Renderer implementation', assumptions: 'Non-scattering medium' }
        ]
      }
    ]
  },
  {
    id: 'thermo',
    title: '5. Thermodynamics & Statistical Mechanics',
    sections: [
      {
        title: 'Laws & Potentials',
        items: [
          { type: 'formula', name: 'First Law of Thermodynamics', tex: 'dU=TdS-PdV+\\mu dN', tag: 'Conservation', appliesTo: 'Energy change', assumptions: 'Reversible processes' },
          { type: 'formula', name: 'Second Law of Thermodynamics', tex: 'dS\\geq\\frac{\\delta Q}{T}', tag: 'Entropy', appliesTo: 'Irreversibility', assumptions: 'Isolated or closed systems' },
          { type: 'formula', name: 'Helmholtz Free Energy', tex: 'F=U-TS', tag: 'Potential', appliesTo: 'Constant T, V systems', assumptions: 'Extractable work' },
          { type: 'formula', name: 'Gibbs Free Energy', tex: 'G=U+PV-TS', tag: 'Potential', appliesTo: 'Constant T, P systems', assumptions: 'Phase transitions' },
          { type: 'formula', name: 'Enthalpy', tex: 'H=U+PV', tag: 'Potential', appliesTo: 'Constant P heating', assumptions: 'Includes flow work' },
          { type: 'formula', name: 'Chemical Potential', tex: '\\mu= \\left( \\frac{\\partial U}{\\partial N} \\right)_{S,V}', tag: 'Property', appliesTo: 'Particle exchange', assumptions: 'Equilibrium' }
        ]
      },
      {
        title: 'Statistical Distributions',
        items: [
          { type: 'formula', name: 'Fermi-Dirac Distribution', tex: 'f(E)= \\frac1{e^{(E-\\mu)/k_BT}+1}', tag: 'Quantum Stats', appliesTo: 'Fermions (e-, n, p)', assumptions: 'Pauli exclusion' },
          { type: 'formula', name: 'Bose-Einstein Distribution', tex: 'f(E)= \\frac1{e^{(E-\\mu)/k_BT}-1}', tag: 'Quantum Stats', appliesTo: 'Bosons (photons)', assumptions: 'Indistinguishable, no exclusion' },
          { type: 'formula', name: 'Fermi Momentum', tex: 'p_F=\\hbar(3\\pi^2n)^{1/3}', tag: 'Degeneracy', appliesTo: 'Dense matter', assumptions: 'Zero temperature limit' },
          { type: 'formula', name: 'Relativistic Energy Relation', tex: 'E=\\sqrt{p^2c^2+m^2c^4}', tag: 'Kinematics', appliesTo: 'High-energy particles', assumptions: 'Special relativity applies' }
        ]
      }
    ]
  },
  {
    id: 'qm',
    title: '6. Quantum Mechanics & Quantum Statistics',
    sections: [
      {
        title: 'Core Formalism',
        items: [
          { type: 'formula', name: 'Commutation Relation', tex: '[\\hat x,\\hat p]=i\\hbar', tag: 'Operators', appliesTo: 'Conjugate variables', assumptions: 'Canonical quantization' },
          { type: 'formula', name: 'Time-Independent Schrödinger Eq', tex: '\\hat H\\psi=E\\psi', tag: 'Wave Equation', appliesTo: 'Stationary states', assumptions: 'Non-relativistic' },
          { type: 'formula', name: 'Expectation Value', tex: '\\langle A\\rangle = \\int\\psi^*\\hat A\\psi\\,d^3x', tag: 'Measurement', appliesTo: 'Observables', assumptions: 'Normalized wavefunction' },
          { type: 'formula', name: 'Heisenberg Equation of Motion', tex: '\\frac{d\\hat A}{dt} = \\frac{i}{\\hbar}[\\hat H,\\hat A] + \\frac{\\partial\\hat A}{\\partial t}', tag: 'Evolution', appliesTo: 'Operators in Heisenberg picture', assumptions: 'Unitary evolution' }
        ]
      },
      {
        title: 'Fermion Physics',
        items: [
          { type: 'text', content: 'Pauli Exclusion Principle dictates that fermionic wavefunctions must be fully antisymmetric under particle exchange.' },
          { type: 'formula', name: 'Fermi Energy', tex: 'E_F= \\sqrt{p_F^2c^2+m^2c^4}', tag: 'Energy Threshold', appliesTo: 'Degenerate gas', assumptions: 'Highest occupied state at T=0' }
        ]
      }
    ]
  },
  {
    id: 'sr',
    title: '7. Special Relativity',
    sections: [
      {
        title: 'Four-Vectors & Kinematics',
        items: [
          { type: 'formula', name: 'Four-Velocity', tex: 'u^\\mu=\\frac{dx^\\mu}{d\\tau}', tag: 'Kinematics', appliesTo: 'Spacetime trajectories', assumptions: 'Massive particles' },
          { type: 'formula', name: 'Four-Momentum', tex: 'p^\\mu=mu^\\mu', tag: 'Dynamics', appliesTo: 'Energy-momentum tracking', assumptions: 'Invariant mass m' },
          { type: 'formula', name: 'Four-Acceleration', tex: 'a^\\mu=\\frac{du^\\mu}{d\\tau}', tag: 'Dynamics', appliesTo: 'Proper acceleration', assumptions: 'Orthogonal to 4-velocity' },
          { type: 'formula', name: 'Four-Current', tex: 'J^\\mu=(c\\rho,\\mathbf J)', tag: 'Electrodynamics', appliesTo: 'Charge transport', assumptions: 'Charge conservation' },
          { type: 'formula', name: 'Relativistic Doppler Effect', tex: '\\nu_\\mathrm{obs} = \\nu_\\mathrm{emit} \\sqrt{\\frac{1-\\beta}{1+\\beta}}', tag: 'Observable', appliesTo: 'Collinear motion', assumptions: 'Source moving away' }
        ]
      },
      {
        title: 'Energy & Invariants',
        items: [
          { type: 'formula', name: 'Relativistic Kinetic Energy', tex: 'K=(\\gamma-1)mc^2', tag: 'Energy', appliesTo: 'Particle collisions', assumptions: 'Rest mass subtracted' },
          { type: 'formula', name: 'Energy-Momentum Invariant', tex: 'E^2-p^2c^2=m^2c^4', tag: 'Invariant', appliesTo: 'All inertial frames', assumptions: 'Minkowski metric' }
        ]
      }
    ]
  },
  {
    id: 'gr',
    title: '8. General Relativity',
    sections: [
      {
        title: 'Curvature & Field Equations',
        items: [
          { type: 'formula', name: 'Riemann Curvature Tensor', tex: 'R^\\rho_{\\ \\sigma\\mu\\nu} = \\partial_\\mu\\Gamma^\\rho_{\\nu\\sigma} -\\partial_\\nu\\Gamma^\\rho_{\\mu\\sigma} +\\Gamma^\\rho_{\\mu\\lambda}\\Gamma^\\lambda_{\\nu\\sigma} -\\Gamma^\\rho_{\\nu\\lambda}\\Gamma^\\lambda_{\\mu\\sigma}', tag: 'Geometry', appliesTo: 'Spacetime curvature', assumptions: 'Levi-Civita connection' },
          { type: 'formula', name: 'Ricci Tensor & Scalar', tex: 'R_{\\mu\\nu} = R^\\rho_{\\ \\mu\\rho\\nu} \\quad,\\quad R=g^{\\mu\\nu}R_{\\mu\\nu}', tag: 'Geometry Traces', appliesTo: 'Volume changes', assumptions: 'Contractions of Riemann' },
          { type: 'formula', name: 'Einstein Tensor', tex: 'G_{\\mu\\nu} = R_{\\mu\\nu} -\\frac12Rg_{\\mu\\nu}', tag: 'Geometry', appliesTo: 'Divergence-free curvature', assumptions: 'Bianchi identity compliance' },
          { type: 'formula', name: 'Einstein Field Equation', tex: 'G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}', tag: 'Field Equation', appliesTo: 'Spacetime dynamics', assumptions: 'Coupling geometry to matter' },
          { type: 'formula', name: 'Einstein-Hilbert Action', tex: 'S_{EH} = \\frac{c^3}{16\\pi G} \\int(R-2\\Lambda)\\sqrt{-g}\\,d^4x', tag: 'Action', appliesTo: 'Derivation of GR', assumptions: 'Principle of least action' },
          { type: 'formula', name: 'Energy-Momentum Conservation', tex: '\\nabla_\\mu T^{\\mu\\nu}=0', tag: 'Conservation', appliesTo: 'Matter fields', assumptions: 'Local conservation law' },
          { type: 'formula', name: 'Geodesic Equation', tex: '\\frac{d^2x^\\mu}{d\\lambda^2} + \\Gamma^\\mu_{\\alpha\\beta} \\frac{dx^\\alpha}{d\\lambda} \\frac{dx^\\beta}{d\\lambda} = 0', tag: 'Motion', appliesTo: 'Free-fall', assumptions: 'Affine parametrization' }
        ]
      }
    ]
  },
  {
    id: 'stellar',
    title: '9. Stellar Structure & Nuclear Physics',
    sections: [
      {
        title: 'Equations of Stellar Structure',
        items: [
          { type: 'formula', name: 'Mass Conservation', tex: '\\frac{dm}{dr}=4\\pi r^2\\rho', tag: 'Structure', appliesTo: 'Stellar interiors', assumptions: 'Spherical symmetry, stationary' },
          { type: 'formula', name: 'Hydrostatic Equilibrium', tex: '\\frac{dP}{dr} = -\\frac{Gm\\rho}{r^2}', tag: 'Structure', appliesTo: 'Pressure vs Gravity', assumptions: 'Newtonian limit' },
          { type: 'formula', name: 'Energy Generation', tex: '\\frac{dL}{dr} = 4\\pi r^2\\rho\\epsilon', tag: 'Structure', appliesTo: 'Luminosity gradient', assumptions: 'Local energy production' },
          { type: 'formula', name: 'Radiative Energy Transport', tex: '\\frac{dT}{dr} = -\\frac{3\\kappa\\rho L}{16\\pi acT^3r^2}', tag: 'Transport', appliesTo: 'Radiative zones', assumptions: 'Diffusion approximation' }
        ]
      },
      {
        title: 'Nuclear & Opacity',
        items: [
          { type: 'formula', name: 'Nuclear Reaction Rate', tex: 'r_{12} = n_1n_2\\langle\\sigma v\\rangle', tag: 'Nuclear Physics', appliesTo: 'Fusion processes', assumptions: 'Maxwell-Boltzmann velocities' },
          { type: 'formula', name: 'Energy Release (Q-value)', tex: 'Q=\\Delta mc^2', tag: 'Energy', appliesTo: 'Exothermic reactions', assumptions: 'Mass defect' },
          { type: 'text', content: 'Total energy generation $\\epsilon$ includes nuclear energy $\\epsilon_{nuc}$ minus neutrino losses $\\epsilon_\\nu$. Opacity $\\kappa$ aggregates electron scattering, free-free, bound-free, and bound-bound transitions.' }
        ]
      }
    ]
  },
  {
    id: 'dwarfs',
    title: '10. White Dwarfs & Brown Dwarfs',
    sections: [
      {
        title: 'White Dwarfs',
        items: [
          { type: 'formula', name: 'Electron Number Density', tex: 'n_e=\\frac{\\rho}{\\mu_em_u}', tag: 'State Variable', appliesTo: 'Degenerate cores', assumptions: 'Fully ionized matter' },
          { type: 'formula', name: 'Non-Relativistic Degeneracy', tex: 'P\\propto\\rho^{5/3} \\implies R\\propto M^{-1/3}', tag: 'EOS', appliesTo: 'Low-mass white dwarfs', assumptions: 'Polytrope n=1.5' },
          { type: 'formula', name: 'Ultra-Relativistic Degeneracy', tex: 'P\\propto\\rho^{4/3}', tag: 'EOS', appliesTo: 'High-mass approaching limit', assumptions: 'Polytrope n=3' },
          { type: 'formula', name: 'Chandrasekhar Mass Limit', tex: 'M_{Ch} \\approx \\frac{5.83}{\\mu_e^2}M_\\odot', tag: 'Stability Limit', appliesTo: 'Maximum WD mass', assumptions: 'Zero temperature ideal Fermi gas' }
        ]
      },
      {
        title: 'Brown Dwarfs',
        items: [
          { type: 'text', content: 'Supported by ideal gas pressure, electron degeneracy, and partial degeneracy. Ruled by Kelvin-Helmholtz cooling.' },
          { type: 'formula', name: 'Surface Luminosity', tex: 'L=4\\pi R^2\\sigma T_\\mathrm{eff}^4', tag: 'Emission', appliesTo: 'Cooling curves', assumptions: 'Blackbody radiator approximation' }
        ]
      }
    ]
  },
  {
    id: 'neutron_stars',
    title: '11. Neutron Stars',
    sections: [
      {
        title: 'Relativistic Structure',
        items: [
          { type: 'formula', name: 'Mass Equation', tex: '\\frac{dm}{dr}=4\\pi r^2\\epsilon/c^2', tag: 'Structure', appliesTo: 'Energy density integration', assumptions: 'General relativity' },
          { type: 'formula', name: 'TOV Equation', tex: '\\frac{dP}{dr} = -\\frac{G \\left(\\rho+\\frac{P}{c^2}\\right) \\left(m+\\frac{4\\pi r^3P}{c^2}\\right)}{r^2 \\left(1-\\frac{2Gm}{rc^2}\\right)}', tag: 'Structure', appliesTo: 'Hydrostatic equilibrium', assumptions: 'Spherical symmetry, GR' },
          { type: 'formula', name: 'Equation of State Closure', tex: 'P=P(\\epsilon)', tag: 'Closure', appliesTo: 'Nuclear matter', assumptions: 'Cold, catalyzed matter' },
          { type: 'formula', name: 'Boundary Conditions', tex: 'm(0)=0 \\quad,\\quad P(0)=P_c \\quad,\\quad P(R)=0', tag: 'Integration Limits', appliesTo: 'Numerical modeling', assumptions: 'Surface at zero pressure' }
        ]
      },
      {
        title: 'Observables & Deformation',
        items: [
          { type: 'formula', name: 'Compactness', tex: 'C=\\frac{GM}{Rc^2}', tag: 'Parameter', appliesTo: 'Relativistic strength', assumptions: 'Dimensionless' },
          { type: 'formula', name: 'Surface Redshift', tex: '1+z= \\left(1-\\frac{2GM}{Rc^2}\\right)^{-1/2}', tag: 'Observable', appliesTo: 'Surface emission', assumptions: 'Schwarzschild exterior' },
          { type: 'formula', name: 'Binding Energy', tex: 'E_B=(M_b-M_g)c^2', tag: 'Energy', appliesTo: 'Supernova collapse', assumptions: 'Baryonic vs Gravitational mass' },
          { type: 'formula', name: 'Tidal Deformability', tex: '\\Lambda= \\frac23k_2C^{-5}', tag: 'Property', appliesTo: 'GW inspiring phase', assumptions: 'Linear tidal response' },
          { type: 'formula', name: 'Moment of Inertia & Rot Energy', tex: 'J=I\\Omega \\quad,\\quad E_\\mathrm{rot} = \\frac12I\\Omega^2', tag: 'Kinematics', appliesTo: 'Spinning NS', assumptions: 'Rigid rotation approximation' }
        ]
      }
    ]
  },
  {
    id: 'pulsars',
    title: '12. Pulsars & Magnetars',
    sections: [
      {
        title: 'Pulsar Rotation & Emission',
        items: [
          { type: 'formula', name: 'Period & Rotational Energy Loss', tex: 'P=\\frac{2\\pi}{\\Omega} \\quad,\\quad \\dot E_\\mathrm{rot} = -I\\Omega\\dot\\Omega', tag: 'Kinematics', appliesTo: 'Spin-down luminosity', assumptions: 'Constant Moment of Inertia' },
          { type: 'formula', name: 'Magnetic Dipole Field', tex: 'B_r=\\frac{2\\mu\\cos\\theta}{r^3} \\quad,\\quad B_\\theta= \\frac{\\mu\\sin\\theta}{r^3}', tag: 'Magnetosphere', appliesTo: 'Surface field', assumptions: 'Ideal dipole' },
          { type: 'formula', name: 'Dipole Spin-Down Radiation', tex: '\\dot E = -\\frac{2\\mu^2\\Omega^4\\sin^2\\alpha}{3c^3}', tag: 'Energy Loss', appliesTo: 'Vacuum radiation', assumptions: 'Magnetic axis offset by alpha' },
          { type: 'formula', name: 'Braking Index', tex: 'n= \\frac{\\Omega\\ddot\\Omega}{\\dot\\Omega^2}', tag: 'Evolution', appliesTo: 'Timing observations', assumptions: 'Power-law spin-down' },
          { type: 'formula', name: 'Light Cylinder', tex: 'R_{LC}=\\frac c\\Omega', tag: 'Boundary', appliesTo: 'Magnetosphere limit', assumptions: 'Co-rotation velocity reaches c' },
          { type: 'formula', name: 'Goldreich-Julian Density', tex: '\\rho_{GJ} \\approx -\\frac{\\mathbf\\Omega\\cdot\\mathbf B}{2\\pi c}', tag: 'Plasma', appliesTo: 'Magnetosphere filling', assumptions: 'Force-free E dot B = 0' }
        ]
      },
      {
        title: 'Magnetars',
        items: [
          { type: 'formula', name: 'Magnetic Energy Density', tex: 'u_B=\\frac{B^2}{8\\pi}', tag: 'Energy', appliesTo: 'Crustal stress', assumptions: 'cgs units' },
          { type: 'formula', name: 'Ohmic Decay Timescale', tex: 't_\\mathrm{Ohm}\\sim\\frac{L^2}{\\eta}', tag: 'Timescale', appliesTo: 'Field dissipation', assumptions: 'Resistive crust' },
          { type: 'formula', name: 'Hall Drift Timescale', tex: 't_\\mathrm{Hall} \\sim \\frac{4\\pi en_eL^2}{cB}', tag: 'Timescale', appliesTo: 'Field reconfiguration', assumptions: 'Electron fluid drift' }
        ]
      }
    ]
  },
  {
    id: 'bh_physics',
    title: '13. Black Hole Physics',
    sections: [
      {
        title: 'Non-Rotating Black Holes',
        items: [
          { type: 'text', content: 'Schwarzschild (mass $M$) and Reissner-Nordström (mass $M$, charge $Q$).' },
          { type: 'formula', name: 'Schwarzschild Metric', tex: 'ds^2= -\\left(1-\\frac{2GM}{rc^2}\\right)c^2dt^2 + \\left(1-\\frac{2GM}{rc^2}\\right)^{-1}dr^2 +r^2d\\Omega^2', tag: 'Spacetime', appliesTo: 'Static, neutral BH', assumptions: 'Spherical symmetry, vacuum' },
          { type: 'formula', name: 'Reissner-Nordström Horizons', tex: 'r_\\pm = \\frac{GM}{c^2} \\pm \\sqrt{ \\left(\\frac{GM}{c^2}\\right)^2 - \\frac{GQ^2}{4\\pi\\epsilon_0c^4} }', tag: 'Horizons', appliesTo: 'Charged BH', assumptions: 'Extremal limit avoids naked singularity' }
        ]
      },
      {
        title: 'Rotating (Kerr) Black Holes',
        items: [
          { type: 'text', content: 'Kerr (mass $M$, spin $J$). Parameters: $a=J/Mc$, $a_*=cJ/GM^2$, $\\Sigma=r^2+a^2\\cos^2\\theta$, $\\Delta=r^2-2r_gr+a^2$.' },
          { type: 'formula', name: 'Kerr Metric', tex: 'ds^2= -\\left(1-\\frac{2r_gr}{\\Sigma}\\right)c^2dt^2 -\\frac{4r_gar\\sin^2\\theta}{\\Sigma}c\\,dt\\,d\\phi +\\frac{\\Sigma}{\\Delta}dr^2 +\\Sigma d\\theta^2 + \\left( r^2+a^2+ \\frac{2r_ga^2r\\sin^2\\theta}{\\Sigma} \\right) \\sin^2\\theta\\,d\\phi^2', tag: 'Spacetime', appliesTo: 'Astrophysical BHs', assumptions: 'Axisymmetric, vacuum' },
          { type: 'formula', name: 'Event Horizons', tex: 'r_\\pm= r_g \\pm \\sqrt{r_g^2-a^2}', tag: 'Horizons', appliesTo: 'Inner/Outer boundaries', assumptions: 'Sub-extremal spin' },
          { type: 'formula', name: 'Ergosphere', tex: 'r_\\mathrm{ergo} = r_g+\\sqrt{r_g^2-a^2\\cos^2\\theta}', tag: 'Boundary', appliesTo: 'Static limit surface', assumptions: 'Penrose process region' }
        ]
      },
      {
        title: 'Geodesics & Rendering',
        items: [
          { type: 'formula', name: 'First-Order Kerr Geodesics', tex: '\\Sigma^2 \\left(\\frac{dr}{d\\lambda}\\right)^2 = \\mathcal R(r) \\quad,\\quad \\Sigma^2 \\left(\\frac{d\\theta}{d\\lambda}\\right)^2 = \\Theta(\\theta)', tag: 'Motion', appliesTo: 'Ray tracing', assumptions: 'Separation of variables (Carter)' },
          { type: 'formula', name: 'Photon Orbits (Spherical)', tex: '\\mathcal R=0 \\quad,\\quad \\frac{d\\mathcal R}{dr}=0', tag: 'Constraints', appliesTo: 'Unstable photon shells', assumptions: 'Defines shadow boundary' },
          { type: 'formula', name: 'Black Hole Shadow Coordinates', tex: '\\alpha=-\\frac{\\xi}{\\sin\\theta_o} \\quad,\\quad \\beta= \\pm \\sqrt{ \\eta+a^2\\cos^2\\theta_o-\\xi^2\\cot^2\\theta_o }', tag: 'Image Plane', appliesTo: 'Observer screen', assumptions: 'Impact parameters xi, eta' },
          { type: 'formula', name: 'Relativistic Redshift', tex: 'g= \\frac{-k_\\mu u^\\mu_\\mathrm{obs}}{-k_\\mu u^\\mu_\\mathrm{emit}}', tag: 'Observable', appliesTo: 'Doppler + Gravitational', assumptions: 'General observer framing' }
        ]
      }
    ]
  },
  {
    id: 'bh_thermo',
    title: '14. Black Hole Thermodynamics',
    sections: [
      {
        title: 'Properties & Laws',
        items: [
          { type: 'formula', name: 'Horizon Area (Kerr)', tex: 'A=4\\pi(r_+^2+a^2)', tag: 'Geometry', appliesTo: 'Outer horizon', assumptions: 'Stationary state' },
          { type: 'formula', name: 'Surface Gravity', tex: '\\kappa= \\frac{c^2(r_+-r_-)}{2(r_+^2+a^2)}', tag: 'Geometry', appliesTo: 'Horizon acceleration', assumptions: 'Evaluated at r_+' },
          { type: 'text', content: 'STATUS: Hawking Radiation is a semiclassical theoretical prediction; not directly experimentally detected.' },
          { type: 'formula', name: 'Hawking Temperature', tex: 'T_H= \\frac{\\hbar\\kappa}{2\\pi k_Bc}', tag: 'Quantum Emission', appliesTo: 'Black hole evaporation', assumptions: 'QFT in curved spacetime' },
          { type: 'formula', name: 'Bekenstein-Hawking Entropy', tex: 'S_{BH} = \\frac{k_Bc^3A}{4G\\hbar}', tag: 'Thermodynamics', appliesTo: 'Information paradox', assumptions: 'Holographic principle' },
          { type: 'formula', name: 'Horizon Angular Velocity', tex: '\\Omega_H= \\frac{ac}{r_+^2+a^2}', tag: 'Kinematics', appliesTo: 'Co-rotating frames', assumptions: 'Rigid body-like rotation' },
          { type: 'formula', name: 'First Law of BH Mechanics', tex: 'd(Mc^2) = T_HdS+\\Omega_HdJ+\\Phi_HdQ', tag: 'Conservation', appliesTo: 'Perturbations', assumptions: 'Thermodynamic equivalence' }
        ]
      }
    ]
  },
  {
    id: 'accretion',
    title: '15. Accretion Disks & Relativistic Astrophysics',
    sections: [
      {
        title: 'Disk Physics',
        items: [
          { type: 'formula', name: 'Mass Accretion Rate', tex: '\\dot M = 4\\pi r^2\\rho v_r', tag: 'Flow', appliesTo: 'Spherical/Disk inflow', assumptions: 'Steady state' },
          { type: 'formula', name: 'Eddington Luminosity', tex: 'L_{Edd} = \\frac{4\\pi GMm_pc}{\\sigma_T}', tag: 'Limit', appliesTo: 'Radiation pressure balancing gravity', assumptions: 'Thomson scattering, pure hydrogen' },
          { type: 'formula', name: 'Eddington Ratio', tex: '\\lambda_{Edd} = \\frac{L}{L_{Edd}}', tag: 'Parameter', appliesTo: 'Accretion efficiency', assumptions: 'Observed vs Maximum' },
          { type: 'formula', name: 'Innermost Stable Circular Orbit (Kerr)', tex: 'r_\\mathrm{ISCO} = r_g \\left[ 3+Z_2 - s\\sqrt{(3-Z_1)(3+Z_1+2Z_2)} \\right]', tag: 'Boundary', appliesTo: 'Inner edge of accretion disk', assumptions: 's=1 (prograde) or -1 (retrograde)' }
        ]
      },
      {
        title: 'Relativistic Ray Tracing Pipeline',
        items: [
          { type: 'text', content: 'Simulation logic: metric $\\rightarrow$ geodesic $\\rightarrow$ redshift $g$ $\\rightarrow$ intensity $I_\\nu$ $\\rightarrow$ pixel.' },
          { type: 'formula', name: 'Invariant Intensity (Liouville)', tex: 'I_{\\nu,\\mathrm{obs}} = g^3I_{\\nu,\\mathrm{emit}}', tag: 'Rendering', appliesTo: 'Ray tracing engines', assumptions: 'Photon number conservation' }
        ]
      }
    ]
  },
  {
    id: 'quasars_jets',
    title: '16. Quasars, Relativistic Jets & High-Energy',
    sections: [
      {
        title: 'Jet Kinematics & Mechanics',
        items: [
          { type: 'formula', name: 'Doppler Factor', tex: '\\delta= \\frac1{\\Gamma(1-\\beta\\cos\\theta)}', tag: 'Kinematics', appliesTo: 'Beamed emission', assumptions: 'Lorentz factor Gamma' },
          { type: 'formula', name: 'Apparent Superluminal Velocity', tex: '\\beta_\\mathrm{app} = \\frac{\\beta\\sin\\theta}{1-\\beta\\cos\\theta}', tag: 'Kinematics', appliesTo: 'Jet observations', assumptions: 'Approaching flows' },
          { type: 'text', content: 'Blandford-Znajek represents a theoretical GRMHD model for jet launching, relying on magnetic fields threading the Kerr horizon to extract rotational energy.' }
        ]
      },
      {
        title: 'Non-Thermal Emission',
        items: [
          { type: 'formula', name: 'Synchrotron Characteristic Frequency', tex: '\\nu_c = \\frac{3}{2}\\gamma^2 \\frac{eB\\sin\\alpha}{2\\pi m_e}', tag: 'Radiation', appliesTo: 'Relativistic electrons in B-field', assumptions: 'Ultra-relativistic regime' },
          { type: 'formula', name: 'Synchrotron Power', tex: 'P_\\mathrm{syn} = \\frac{4}{3} \\sigma_Tc \\gamma^2 \\beta^2 U_B', tag: 'Radiation', appliesTo: 'Radiative losses', assumptions: 'Isotropic pitch angles' },
          { type: 'formula', name: 'Inverse Compton Power', tex: 'P_\\mathrm{IC} = \\frac43\\sigma_Tc\\gamma^2\\beta^2U_\\mathrm{rad}', tag: 'Radiation', appliesTo: 'Photon upscattering', assumptions: 'Thomson regime limit' },
          { type: 'formula', name: 'Pair Production Threshold', tex: 'E_1E_2(1-\\cos\\theta) \\ge 2(m_ec^2)^2', tag: 'QED', appliesTo: 'Gamma-ray attenuation', assumptions: 'Photon-photon collision' },
          { type: 'formula', name: 'Optical Depth (Pair Prod)', tex: '\\tau_{\\gamma\\gamma} = \\int n_\\gamma\\sigma_{\\gamma\\gamma}\\,ds', tag: 'Transport', appliesTo: 'Gamma-ray escape', assumptions: 'High-energy environments' }
        ]
      }
    ]
  },
  {
    id: 'gw',
    title: '17. Gravitational Waves',
    sections: [
      {
        title: 'Waveforms & Binaries',
        items: [
          { type: 'formula', name: 'Quadrupole Waveform', tex: 'h_{ij}^{TT} \\sim \\frac{2G}{c^4D} \\ddot Q_{ij}^{TT}', tag: 'Generation', appliesTo: 'Compact binaries', assumptions: 'Transverse-traceless gauge, far field' },
          { type: 'formula', name: 'Chirp Mass', tex: '\\mathcal M = \\frac{(m_1m_2)^{3/5}}{(m_1+m_2)^{1/5}}', tag: 'Parameter', appliesTo: 'Inspiral phase', assumptions: 'Primary frequency driver' },
          { type: 'formula', name: 'Frequency Evolution', tex: '\\dot f= \\frac{96}{5}\\pi^{8/3} \\left( \\frac{G\\mathcal M}{c^3} \\right)^{5/3} f^{11/3}', tag: 'Dynamics', appliesTo: 'Chirp signal', assumptions: 'Energy loss entirely to GWs' },
          { type: 'formula', name: 'Orbital Energy', tex: 'E=-\\frac{Gm_1m_2}{2a}', tag: 'Dynamics', appliesTo: 'Binary systems', assumptions: 'Newtonian approximation for orbits' },
          { type: 'formula', name: 'Inspiral Evolution', tex: '\\frac{da}{dt} = -\\frac{64}{5} \\frac{G^3\\mu M^2}{c^5a^3}', tag: 'Dynamics', appliesTo: 'Orbital decay', assumptions: 'Circular orbits, leading order' }
        ]
      }
    ]
  },
  {
    id: 'cosmology',
    title: '18. Cosmology',
    sections: [
      {
        title: 'Expansion Dynamics',
        items: [
          { type: 'formula', name: 'FLRW Metric', tex: 'ds^2= -c^2dt^2+ a(t)^2 \\left[ \\frac{dr^2}{1-kr^2} +r^2d\\Omega^2 \\right]', tag: 'Spacetime', appliesTo: 'Expanding Universe', assumptions: 'Homogeneous, isotropic' },
          { type: 'formula', name: 'Fluid Continuity Equation', tex: '\\dot\\rho+ 3H \\left( \\rho+\\frac{P}{c^2} \\right)=0', tag: 'Conservation', appliesTo: 'Cosmic fluids', assumptions: 'Adiabatic expansion' },
          { type: 'formula', name: 'Equation of State', tex: 'P=w\\rho c^2', tag: 'EOS', appliesTo: 'Fluid classification', assumptions: 'Constant w per component' },
          { type: 'formula', name: 'Density Scaling', tex: '\\rho\\propto a^{-3(1+w)}', tag: 'Evolution', appliesTo: 'Matter (w=0), Rad (w=1/3), Vacuum (w=-1)', assumptions: 'Derived from continuity' },
          { type: 'formula', name: 'General Friedmann Equation', tex: 'H^2= H_0^2 [ \\Omega_r(1+z)^4+ \\Omega_m(1+z)^3+ \\Omega_k(1+z)^2+ \\Omega_\\Lambda ]', tag: 'Dynamics', appliesTo: 'Expansion history', assumptions: 'Standard LCDM' }
        ]
      },
      {
        title: 'Cosmological Distances',
        items: [
          { type: 'formula', name: 'Comoving Distance', tex: 'D_C= c\\int_0^z\\frac{dz\'}{H(z\')}', tag: 'Distance', appliesTo: 'Coordinate distance', assumptions: 'Expands with universe' },
          { type: 'formula', name: 'Lookback Time', tex: 't_L= \\int_0^z \\frac{dz\'}{(1+z\')H(z\')}', tag: 'Time', appliesTo: 'Age of observation', assumptions: 'Depends on cosmological parameters' },
          { type: 'formula', name: 'Luminosity Distance', tex: 'D_L=(1+z)D_M', tag: 'Distance', appliesTo: 'Standard candles', assumptions: 'Flux dilution' },
          { type: 'formula', name: 'Angular-Diameter Distance', tex: 'D_A=\\frac{D_M}{1+z}', tag: 'Distance', appliesTo: 'Standard rulers', assumptions: 'Apparent angular size' }
        ]
      }
    ]
  },
  {
    id: 'numerical',
    title: '19. Mathematical & Numerical Methods',
    sections: [
      {
        title: 'Simulation Core',
        items: [
          { type: 'formula', name: 'First-Order ODE', tex: '\\frac{dy}{dx}=f(x,y)', tag: 'Math', appliesTo: 'Evolution equations', assumptions: 'Initial value problem' },
          { type: 'formula', name: 'Runge-Kutta 4 (RK4) Step', tex: 'y_{n+1} = y_n+\\frac h6(k_1+2k_2+2k_3+k_4)', tag: 'Algorithm', appliesTo: 'Numerical integration', assumptions: '4th order accuracy' },
          { type: 'formula', name: 'Ray Integration System', tex: '\\frac{dx^\\mu}{d\\lambda}=k^\\mu \\quad,\\quad \\frac{dk^\\mu}{d\\lambda} = -\\Gamma^\\mu_{\\alpha\\beta} k^\\alpha k^\\beta', tag: 'Algorithm', appliesTo: 'Geodesic renderers', assumptions: 'Coupled ODE system' },
          { type: 'text', content: 'Simulation Verification: Every engine step must verify conservation tolerances for $\\Delta E$, $\\Delta L$, and the null condition $k_\\mu k^\\mu = 0$ for photons.' }
        ]
      }
    ]
  },
  {
    id: 'validation',
    title: '20. Physical Constants, Units & Validation',
    sections: [
      {
        title: 'Framework Standards',
        items: [
          { type: 'text', content: 'Base Constants: $G, c, \\hbar, k_B, e, m_e, m_p, M_\\odot, R_\\odot$' },
          { type: 'text', content: 'Geometrized units ($G=c=1$) are utilized for internal GR calculations, but must explicitly transform back to SI/cgs for observable outputs.' },
          { type: 'formula', name: 'Dimensional Analysis Requirement', tex: '[\\mathrm{LHS}] = [\\mathrm{RHS}]', tag: 'Validation', appliesTo: 'All formulated equations', assumptions: 'Engine strict typing' },
          { type: 'text', content: 'Every formula in this database carries physical validity markers: EXACT, DERIVED, EXPERIMENTALLY VERIFIED, APPROXIMATION, SEMICLASSICAL, EMPIRICAL, MODEL-DEPENDENT, or MATHEMATICAL ONLY.' }
        ]
      }
    ]
  }
];

// ==========================================================
// 2. HELPER HOOKS & UI COMPONENTS
// ==========================================================
const useWindowSize = () => {
  const [size, setSize] = useState({ width: 1024, isMobile: false });
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, isMobile: window.innerWidth < 768 });
    handleResize(); // Initialize on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
};

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

const FormulaCard = ({ formula, isSelected, onClick, isMobile }) => {
  return (
    <div 
      onClick={() => onClick(formula)}
      style={{
        background: isSelected ? 'rgba(34, 211, 238, 0.05)' : 'rgba(255, 255, 255, 0.02)',
        border: `1px solid ${isSelected ? 'rgba(34, 211, 238, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
        borderRadius: '6px',
        padding: isMobile ? '12px 16px' : '16px 20px',
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
    >
      <div style={{ width: '100%', fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', textAlign: 'left' }}>
        {formula.name}
      </div>
      <div style={{ padding: '8px 0', fontSize: isMobile ? '1rem' : '1.1rem', maxWidth: '100%', overflowX: 'auto' }}>
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
      <div style={{ position: 'absolute', bottom: 20, left: 20, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', fontSize: '12px' }}>
        ENGINE: ACTIVE | RENDERING: KERR METRIC
      </div>
    </div>
  );
};

const TheoryView = ({ activeChapterId, onSelectChapter, isMobile, showSidebar, setShowSidebar }) => {
  const [selectedFormula, setSelectedFormula] = useState(null);
  
  // Close the formula inspector mobile sheet
  const closeInspector = () => setSelectedFormula(null);

  useEffect(() => {
    const chapter = THEORY_DATA.find(c => c.id === activeChapterId);
    if (chapter) {
      let firstFormula = null;
      for (const section of chapter.sections) {
        firstFormula = section.items.find(i => i.type === 'formula');
        if (firstFormula) break;
      }
      setSelectedFormula(isMobile ? null : (firstFormula || null));
    }
  }, [activeChapterId, isMobile]);

  const activeChapter = THEORY_DATA.find(c => c.id === activeChapterId) || THEORY_DATA[0];

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
      
      {/* LEFT: THEORY NAVIGATION SIDEBAR (Drawer on Mobile) */}
      <div style={{ 
        width: isMobile ? '80%' : '240px',
        maxWidth: '300px',
        background: '#0a0d14', 
        borderRight: '1px solid #1f2937', 
        display: 'flex', 
        flexDirection: 'column',
        position: isMobile ? 'absolute' : 'relative',
        top: 0,
        bottom: 0,
        left: isMobile ? (showSidebar ? 0 : '-100%') : 0,
        zIndex: 50,
        transition: 'left 0.3s ease',
        boxShadow: isMobile && showSidebar ? '5px 0 25px rgba(0,0,0,0.5)' : 'none'
      }}>
        <div style={{ padding: '20px 16px', fontSize: '11px', color: '#6b7280', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Theory Chapters</span>
          {isMobile && (
            <button onClick={() => setShowSidebar(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '16px' }}>✕</button>
          )}
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 8px', paddingBottom: '20px' }}>
          {THEORY_DATA.map(chapter => (
            <div 
              key={chapter.id}
              onClick={() => {
                onSelectChapter(chapter.id);
                if (isMobile) setShowSidebar(false);
              }}
              style={{
                padding: '12px 16px',
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

      {/* MOBILE OVERLAY BACKGROUND FOR SIDEBAR */}
      {isMobile && showSidebar && (
        <div 
          onClick={() => setShowSidebar(false)}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }} 
        />
      )}

      {/* MIDDLE: MAIN THEORY CONTENT */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '20px 16px' : '40px 60px', background: '#05070b' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {isMobile && (
            <button 
              onClick={() => setShowSidebar(true)}
              style={{ marginBottom: '20px', background: '#1f2937', color: '#e5e7eb', border: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              ☰ Chapters Menu
            </button>
          )}

          <h1 style={{ fontSize: isMobile ? '22px' : '28px', color: '#fff', margin: '0 0 8px 0', fontWeight: '400', lineHeight: '1.3' }}>{activeChapter.title}</h1>
          <hr style={{ border: 'none', borderBottom: '1px solid #1f2937', margin: '0 0 30px 0' }} />

          {activeChapter.sections.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: '50px' }}>
              <h2 style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '20px', fontWeight: '500' }}>
                {sIdx + 1}. {section.title}
              </h2>
              
              {section.items.map((item, iIdx) => {
                if (item.type === 'text') {
                  const parts = item.content.split(/(\$.*?\$)/g);
                  return (
                    <p key={iIdx} style={{ color: '#d1d5db', lineHeight: '1.6', fontSize: '15px', marginBottom: '16px' }}>
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
                      isMobile={isMobile}
                    />
                  );
                }
                return null;
              })}
            </div>
          ))}
          <div style={{ height: isMobile ? '120px' : '100px' }} /> 
        </div>
      </div>

      {/* RIGHT/BOTTOM: SELECTED FORMULA INSPECTOR */}
      <div style={{ 
        width: isMobile ? '100%' : '320px', 
        background: '#0a0d14', 
        borderLeft: isMobile ? 'none' : '1px solid #1f2937', 
        borderTop: isMobile ? '1px solid #22d3ee' : 'none',
        display: 'flex', 
        flexDirection: 'column',
        position: isMobile ? 'absolute' : 'relative',
        bottom: 0,
        left: 0,
        right: 0,
        height: isMobile ? (selectedFormula ? '65vh' : '0') : 'auto',
        zIndex: 60,
        transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        boxShadow: isMobile && selectedFormula ? '0 -10px 40px rgba(0,0,0,0.8)' : 'none',
        borderTopLeftRadius: isMobile ? '16px' : '0',
        borderTopRightRadius: isMobile ? '16px' : '0'
      }}>
        {selectedFormula && (
          <>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 'bold', letterSpacing: '1px' }}>SELECTED EQUATION</span>
              {isMobile && (
                <button onClick={closeInspector} style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '20px', lineHeight: 1 }}>×</button>
              )}
            </div>
            
            <div style={{ padding: '24px 20px', overflowY: 'auto', flex: 1 }}>
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
          </>
        )}
        {!selectedFormula && !isMobile && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
            Click an equation in the main panel to view its physical properties and assumptions.
          </div>
        )}
      </div>

      {/* MOBILE OVERLAY BACKGROUND FOR INSPECTOR */}
      {isMobile && selectedFormula && (
        <div 
          onClick={closeInspector}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 55 }} 
        />
      )}
    </div>
  );
};

// ==========================================================
// 4. MAIN APP SHELL
// ==========================================================
export default function AstrophysicsEngine() {
  const [appMode, setAppMode] = useState('THEORY');
  const [activeChapterId, setActiveChapterId] = useState('classical');
  const [katexLoaded, setKatexLoaded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { isMobile } = useWindowSize();

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
      
      /* Webkit Scrollbar overrides */
      ::-webkit-scrollbar { width: 4px; height: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #374151; border-radius: 2px; }
      ::-webkit-scrollbar-thumb:hover { background: #4b5563; }
      
      /* Hide scrollbar completely on mobile for horizontal scrolling menus */
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
  }, []);

  if (!katexLoaded) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05070b', color: '#22d3ee', fontFamily: 'monospace' }}>INITIALIZING KERNEL...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#05070b' }}>
      
      {/* TOP APPLICATION HEADER */}
      <div style={{ 
        height: 'auto', minHeight: '56px', 
        background: '#0a0d14', 
        borderBottom: '1px solid #1f2937', 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center', 
        justifyContent: 'space-between', 
        padding: isMobile ? '12px 16px' : '0 24px', 
        gap: isMobile ? '12px' : '0',
        zIndex: 100 
      }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: isMobile ? '100%' : 'auto', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 10px #22d3ee' }}></div>
            <span style={{ fontFamily: 'monospace', fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold', color: '#fff', letterSpacing: '1px' }}>ASTROPHYSICS ENGINE</span>
          </div>
          
          <div style={{ display: 'flex', background: '#111827', borderRadius: '6px', padding: '4px', border: '1px solid #1f2937' }}>
            <button 
              onClick={() => setAppMode('SIMULATOR')}
              style={{
                background: appMode === 'SIMULATOR' ? '#374151' : 'transparent',
                color: appMode === 'SIMULATOR' ? '#fff' : '#9ca3af',
                border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              SIMULATOR
            </button>
            <button 
              onClick={() => setAppMode('THEORY')}
              style={{
                background: appMode === 'THEORY' ? '#374151' : 'transparent',
                color: appMode === 'THEORY' ? '#fff' : '#9ca3af',
                border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              THEORY
            </button>
          </div>
        </div>

        {appMode === 'SIMULATOR' && (
          <div className="no-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', width: isMobile ? '100%' : 'auto', paddingBottom: isMobile ? '4px' : '0' }}>
            {['BLACK HOLE', 'NEUTRON STAR', 'WHITE DWARF', 'QUASAR'].map(obj => (
              <button key={obj} style={{ whiteSpace: 'nowrap', background: 'transparent', border: '1px solid #374151', color: '#d1d5db', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>
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
          isMobile={isMobile}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />
      )}
      
    </div>
  );
}