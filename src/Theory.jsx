import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

[
  {
    "id": "classical",
    "title": "1. Classical Mechanics & Gravitation",
    "sections": [
      {
        "title": "Newtonian Dynamics",
        "items": [
          {
            "type": "formula",
            "name": "Newton's First Law",
            "tex": "\\mathbf F_{\\mathrm{net}}=\\mathbf 0 \\Rightarrow \\mathbf v=\\mathrm{constant}",
            "tag": "Dynamics",
            "appliesTo": "Inertial reference frames",
            "assumptions": "Classical mechanics"
          },
          {
            "type": "formula",
            "name": "Newton's Second Law",
            "tex": "\\mathbf F_{\\mathrm{net}}=m\\mathbf a",
            "tag": "Dynamics",
            "appliesTo": "Particle dynamics",
            "assumptions": "Constant mass, non-relativistic"
          },
          {
            "type": "formula",
            "name": "Newton's Second Law - Momentum Form",
            "tex": "\\mathbf F_{\\mathrm{net}}=\\frac{d\\mathbf p}{dt}",
            "tag": "Dynamics",
            "appliesTo": "Particle and variable-mass systems",
            "assumptions": "Classical mechanics"
          },
          {
            "type": "formula",
            "name": "Newton's Second Law - Component Form",
            "tex": "\\sum F_x=ma_x\\quad,\\quad\\sum F_y=ma_y\\quad,\\quad\\sum F_z=ma_z",
            "tag": "Dynamics",
            "appliesTo": "Cartesian coordinates",
            "assumptions": "Inertial reference frame"
          },
          {
            "type": "formula",
            "name": "Newton's Third Law",
            "tex": "\\mathbf F_{AB}=-\\mathbf F_{BA}",
            "tag": "Dynamics",
            "appliesTo": "Interacting bodies",
            "assumptions": "Classical mechanics"
          },
          {
            "type": "formula",
            "name": "Net External Force",
            "tex": "\\mathbf F_{\\mathrm{net}}=\\sum_i\\mathbf F_i",
            "tag": "Forces",
            "appliesTo": "Particle dynamics",
            "assumptions": "Vector addition of forces"
          },
          {
            "type": "formula",
            "name": "Weight",
            "tex": "\\mathbf W=m\\mathbf g",
            "tag": "Forces",
            "appliesTo": "Objects in a gravitational field",
            "assumptions": "Uniform local gravitational field for constant g"
          },
          {
            "type": "formula",
            "name": "Weight Magnitude",
            "tex": "W=mg",
            "tag": "Forces",
            "appliesTo": "Near-surface gravitational problems",
            "assumptions": "Uniform gravitational acceleration"
          },
          {
            "type": "formula",
            "name": "Hooke's Law",
            "tex": "\\mathbf F_s=-k\\mathbf x",
            "tag": "Forces",
            "appliesTo": "Ideal springs",
            "assumptions": "Small deformation, linear elastic regime"
          },
          {
            "type": "formula",
            "name": "Static Friction",
            "tex": "f_s\\leq\\mu_sN",
            "tag": "Friction",
            "appliesTo": "Contact surfaces",
            "assumptions": "Coulomb friction model"
          },
          {
            "type": "formula",
            "name": "Maximum Static Friction",
            "tex": "f_{s,\\mathrm{max}}=\\mu_sN",
            "tag": "Friction",
            "appliesTo": "Contact surfaces",
            "assumptions": "Coulomb friction model"
          },
          {
            "type": "formula",
            "name": "Kinetic Friction",
            "tex": "f_k=\\mu_kN",
            "tag": "Friction",
            "appliesTo": "Sliding contact",
            "assumptions": "Coulomb friction model"
          },
          {
            "type": "formula",
            "name": "Normal Force on Horizontal Surface",
            "tex": "N=mg",
            "tag": "Forces",
            "appliesTo": "Object on horizontal surface",
            "assumptions": "No vertical acceleration and no other vertical forces"
          },
          {
            "type": "formula",
            "name": "Normal Force on Inclined Plane",
            "tex": "N=mg\\cos\\theta",
            "tag": "Forces",
            "appliesTo": "Object on inclined plane",
            "assumptions": "No acceleration perpendicular to plane and no additional normal-direction forces"
          },
          {
            "type": "formula",
            "name": "Inclined Plane Weight Components",
            "tex": "W_{\\parallel}=mg\\sin\\theta\\quad,\\quad W_{\\perp}=mg\\cos\\theta",
            "tag": "Forces",
            "appliesTo": "Inclined planes",
            "assumptions": "Incline angle measured from horizontal"
          },
          {
            "type": "formula",
            "name": "Linear Momentum",
            "tex": "\\mathbf p=m\\mathbf v",
            "tag": "Momentum",
            "appliesTo": "Particle dynamics",
            "assumptions": "Non-relativistic mechanics"
          },
          {
            "type": "formula",
            "name": "Impulse",
            "tex": "\\mathbf J=\\int_{t_1}^{t_2}\\mathbf F\\,dt",
            "tag": "Momentum",
            "appliesTo": "Impulsive forces",
            "assumptions": "Classical mechanics"
          },
          {
            "type": "formula",
            "name": "Impulse-Momentum Theorem",
            "tex": "\\mathbf J=\\Delta\\mathbf p",
            "tag": "Momentum",
            "appliesTo": "Particle dynamics",
            "assumptions": "Classical mechanics"
          },
          {
            "type": "formula",
            "name": "Average Force",
            "tex": "\\mathbf F_{\\mathrm{avg}}=\\frac{\\Delta\\mathbf p}{\\Delta t}",
            "tag": "Momentum",
            "appliesTo": "Finite-duration interactions",
            "assumptions": "Classical mechanics"
          },
          {
            "type": "formula",
            "name": "Conservation of Linear Momentum",
            "tex": "\\mathbf P_{\\mathrm{initial}}=\\mathbf P_{\\mathrm{final}}",
            "tag": "Conservation",
            "appliesTo": "Isolated systems",
            "assumptions": "Net external impulse is zero"
          },
          {
            "type": "formula",
            "name": "Total Linear Momentum",
            "tex": "\\mathbf P=\\sum_i m_i\\mathbf v_i",
            "tag": "Momentum",
            "appliesTo": "Particle systems",
            "assumptions": "Non-relativistic mechanics"
          },
          {
            "type": "formula",
            "name": "Center of Mass Position",
            "tex": "\\mathbf r_{\\mathrm{CM}}=\\frac{1}{M}\\sum_i m_i\\mathbf r_i",
            "tag": "Center of Mass",
            "appliesTo": "Particle systems",
            "assumptions": "Non-relativistic mechanics"
          },
          {
            "type": "formula",
            "name": "Center of Mass Velocity",
            "tex": "\\mathbf v_{\\mathrm{CM}}=\\frac{1}{M}\\sum_i m_i\\mathbf v_i",
            "tag": "Center of Mass",
            "appliesTo": "Particle systems",
            "assumptions": "Constant total mass"
          },
          {
            "type": "formula",
            "name": "Center of Mass Acceleration",
            "tex": "\\mathbf a_{\\mathrm{CM}}=\\frac{1}{M}\\sum_i m_i\\mathbf a_i",
            "tag": "Center of Mass",
            "appliesTo": "Particle systems",
            "assumptions": "Constant total mass"
          },
          {
            "type": "formula",
            "name": "External Force and Center of Mass",
            "tex": "\\mathbf F_{\\mathrm{ext}}=M\\mathbf a_{\\mathrm{CM}}",
            "tag": "Center of Mass",
            "appliesTo": "Systems of particles",
            "assumptions": "Classical mechanics"
          },
          {
            "type": "formula",
            "name": "Work",
            "tex": "W=\\int_A^B\\mathbf F\\cdot d\\mathbf r",
            "tag": "Energy",
            "appliesTo": "Particle mechanics",
            "assumptions": "Classical mechanics"
          },
          {
            "type": "formula",
            "name": "Work by Constant Force",
            "tex": "W=Fd\\cos\\theta",
            "tag": "Energy",
            "appliesTo": "Constant-force displacement",
            "assumptions": "Force and displacement have fixed relative angle"
          },
          {
            "type": "formula",
            "name": "Kinetic Energy",
            "tex": "K=\\frac12mv^2",
            "tag": "Energy",
            "appliesTo": "Non-relativistic particles",
            "assumptions": "Classical mechanics"
          },
          {
            "type": "formula",
            "name": "Kinetic Energy in Terms of Momentum",
            "tex": "K=\\frac{p^2}{2m}",
            "tag": "Energy",
            "appliesTo": "Non-relativistic particles",
            "assumptions": "Constant mass, non-relativistic"
          },
          {
            "type": "formula",
            "name": "Work-Energy Theorem",
            "tex": "W_{\\mathrm{net}}=\\Delta K=K_f-K_i",
            "tag": "Energy",
            "appliesTo": "Particle dynamics",
            "assumptions": "Classical mechanics"
          },
          {
            "type": "formula",
            "name": "Power",
            "tex": "P=\\frac{dW}{dt}",
            "tag": "Energy",
            "appliesTo": "Mechanical systems",
            "assumptions": "Classical mechanics"
          },
          {
            "type": "formula",
            "name": "Instantaneous Mechanical Power",
            "tex": "P=\\mathbf F\\cdot\\mathbf v",
            "tag": "Energy",
            "appliesTo": "Particle dynamics",
            "assumptions": "Classical mechanics"
          },
          {
            "type": "formula",
            "name": "Gravitational Potential Energy Near Earth's Surface",
            "tex": "U_g=mgh",
            "tag": "Potential Energy",
            "appliesTo": "Near-surface gravity",
            "assumptions": "Approximately uniform g"
          },
          {
            "type": "formula",
            "name": "Spring Potential Energy",
            "tex": "U_s=\\frac12kx^2",
            "tag": "Potential Energy",
            "appliesTo": "Ideal springs",
            "assumptions": "Linear Hooke's-law regime"
          },
          {
            "type": "formula",
            "name": "Mechanical Energy",
            "tex": "E_{\\mathrm{mech}}=K+U",
            "tag": "Energy",
            "appliesTo": "Conservative mechanical systems",
            "assumptions": "Kinetic plus potential energy"
          },
          {
            "type": "formula",
            "name": "Conservation of Mechanical Energy",
            "tex": "K_i+U_i=K_f+U_f",
            "tag": "Conservation",
            "appliesTo": "Conservative systems",
            "assumptions": "No net non-conservative work"
          },
          {
            "type": "formula",
            "name": "Work by Gravity",
            "tex": "W_g=-\\Delta U_g",
            "tag": "Energy",
            "appliesTo": "Gravitational fields",
            "assumptions": "Conservative gravitational force"
          },
          {
            "type": "formula",
            "name": "Work by Spring",
            "tex": "W_s=-\\Delta U_s",
            "tag": "Energy",
            "appliesTo": "Ideal springs",
            "assumptions": "Conservative spring force"
          },
          {
            "type": "formula",
            "name": "Torque Vector",
            "tex": "\\boldsymbol\\tau=\\mathbf r\\times\\mathbf F",
            "tag": "Rotation",
            "appliesTo": "Rotational dynamics",
            "assumptions": "Torque measured about specified origin"
          },
          {
            "type": "formula",
            "name": "Torque Magnitude",
            "tex": "\\tau=rF\\sin\\theta",
            "tag": "Rotation",
            "appliesTo": "Rotational dynamics",
            "assumptions": "r is measured from rotation axis/origin"
          },
          {
            "type": "formula",
            "name": "Lever-Arm Torque",
            "tex": "\\tau=r_{\\perp}F",
            "tag": "Rotation",
            "appliesTo": "Rotational dynamics",
            "assumptions": "Perpendicular moment arm"
          },
          {
            "type": "formula",
            "name": "Net Torque",
            "tex": "\\boldsymbol\\tau_{\\mathrm{net}}=\\sum_i\\boldsymbol\\tau_i",
            "tag": "Rotation",
            "appliesTo": "Rigid bodies and particle systems",
            "assumptions": "Specified reference point"
          },
          {
            "type": "formula",
            "name": "Angular Momentum",
            "tex": "\\mathbf L=\\mathbf r\\times\\mathbf p",
            "tag": "Angular Momentum",
            "appliesTo": "Particle dynamics",
            "assumptions": "Angular momentum about specified origin"
          },
          {
            "type": "formula",
            "name": "Torque-Angular Momentum Relation",
            "tex": "\\boldsymbol\\tau_{\\mathrm{net}}=\\frac{d\\mathbf L}{dt}",
            "tag": "Angular Momentum",
            "appliesTo": "Particle and system dynamics",
            "assumptions": "Torque and angular momentum about the same suitable inertial origin"
          },
          {
            "type": "formula",
            "name": "Conservation of Angular Momentum",
            "tex": "\\frac{d\\mathbf L}{dt}=0\\Rightarrow\\mathbf L=\\mathrm{constant}",
            "tag": "Conservation",
            "appliesTo": "Rotational systems",
            "assumptions": "Net external torque is zero"
          },
          {
            "type": "formula",
            "name": "Angular Momentum of Rigid Body",
            "tex": "L=I\\omega",
            "tag": "Angular Momentum",
            "appliesTo": "Rigid body rotation about a fixed principal axis",
            "assumptions": "Rotation about a fixed axis"
          },
          {
            "type": "formula",
            "name": "Rotational Kinetic Energy",
            "tex": "K_{\\mathrm{rot}}=\\frac12I\\omega^2",
            "tag": "Energy",
            "appliesTo": "Rigid bodies",
            "assumptions": "Rotation about a fixed axis"
          },
          {
            "type": "formula",
            "name": "Rotational Newton's Second Law",
            "tex": "\\tau_{\\mathrm{net}}=I\\alpha",
            "tag": "Rotation",
            "appliesTo": "Rigid-body rotation about fixed axis",
            "assumptions": "Fixed axis and constant moment of inertia"
          },
          {
            "type": "formula",
            "name": "Moment of Inertia - Discrete System",
            "tex": "I=\\sum_i m_ir_i^2",
            "tag": "Rotation",
            "appliesTo": "Particle systems",
            "assumptions": "Rotation about specified axis"
          },
          {
            "type": "formula",
            "name": "Moment of Inertia - Continuous Body",
            "tex": "I=\\int r^2\\,dm",
            "tag": "Rotation",
            "appliesTo": "Continuous rigid bodies",
            "assumptions": "Rotation about specified axis"
          },
          {
            "type": "formula",
            "name": "Parallel-Axis Theorem",
            "tex": "I=I_{\\mathrm{CM}}+Md^2",
            "tag": "Rotation",
            "appliesTo": "Rigid bodies",
            "assumptions": "Parallel axes, one through center of mass"
          },
          {
            "type": "formula",
            "name": "Rotational Work",
            "tex": "W=\\int_{\\theta_1}^{\\theta_2}\\tau\\,d\\theta",
            "tag": "Rotation",
            "appliesTo": "Rotational systems",
            "assumptions": "Torque about the rotation axis"
          },
          {
            "type": "formula",
            "name": "Rotational Power",
            "tex": "P=\\tau\\omega",
            "tag": "Rotation",
            "appliesTo": "Rigid-body rotation",
            "assumptions": "Torque component along rotation axis"
          },
          {
            "type": "formula",
            "name": "Angular Displacement",
            "tex": "\\Delta\\theta=\\frac{\\Delta s}{r}",
            "tag": "Rotational Kinematics",
            "appliesTo": "Circular motion",
            "assumptions": "Angle measured in radians"
          },
          {
            "type": "formula",
            "name": "Angular Velocity",
            "tex": "\\omega=\\frac{d\\theta}{dt}",
            "tag": "Rotational Kinematics",
            "appliesTo": "Rotational motion",
            "assumptions": "Angle in radians"
          },
          {
            "type": "formula",
            "name": "Angular Acceleration",
            "tex": "\\alpha=\\frac{d\\omega}{dt}=\\frac{d^2\\theta}{dt^2}",
            "tag": "Rotational Kinematics",
            "appliesTo": "Rotational motion",
            "assumptions": "Angle in radians"
          },
          {
            "type": "formula",
            "name": "Tangential Velocity",
            "tex": "v=r\\omega",
            "tag": "Circular Motion",
            "appliesTo": "Circular and rotational motion",
            "assumptions": "Point at radius r"
          },
          {
            "type": "formula",
            "name": "Tangential Acceleration",
            "tex": "a_t=r\\alpha",
            "tag": "Circular Motion",
            "appliesTo": "Rotational motion",
            "assumptions": "Point at fixed radius"
          },
          {
            "type": "formula",
            "name": "Centripetal Acceleration",
            "tex": "a_c=\\frac{v^2}{r}=r\\omega^2",
            "tag": "Circular Motion",
            "appliesTo": "Circular motion",
            "assumptions": "Radius r is constant"
          },
          {
            "type": "formula",
            "name": "Centripetal Force",
            "tex": "F_c=\\frac{mv^2}{r}=mr\\omega^2",
            "tag": "Circular Motion",
            "appliesTo": "Circular motion",
            "assumptions": "Net radial force provides centripetal acceleration"
          },
          {
            "type": "formula",
            "name": "Total Acceleration in Circular Motion",
            "tex": "a=\\sqrt{a_t^2+a_c^2}",
            "tag": "Circular Motion",
            "appliesTo": "Non-uniform circular motion",
            "assumptions": "Tangential and radial components are perpendicular"
          },
          {
            "type": "formula",
            "name": "Constant Angular Velocity",
            "tex": "\\theta=\\theta_0+\\omega t",
            "tag": "Rotational Kinematics",
            "appliesTo": "Uniform rotational motion",
            "assumptions": "\\alpha=0"
          },
          {
            "type": "formula",
            "name": "Angular Velocity with Constant Angular Acceleration",
            "tex": "\\omega=\\omega_0+\\alpha t",
            "tag": "Rotational Kinematics",
            "appliesTo": "Constant angular acceleration",
            "assumptions": "\\alpha=\\mathrm{constant}"
          },
          {
            "type": "formula",
            "name": "Angular Displacement with Constant Angular Acceleration",
            "tex": "\\theta=\\theta_0+\\omega_0t+\\frac12\\alpha t^2",
            "tag": "Rotational Kinematics",
            "appliesTo": "Constant angular acceleration",
            "assumptions": "\\alpha=\\mathrm{constant}"
          },
          {
            "type": "formula",
            "name": "Angular Velocity-Displacement Relation",
            "tex": "\\omega^2=\\omega_0^2+2\\alpha(\\theta-\\theta_0)",
            "tag": "Rotational Kinematics",
            "appliesTo": "Constant angular acceleration",
            "assumptions": "\\alpha=\\mathrm{constant}"
          },
          {
            "type": "formula",
            "name": "Rolling Without Slipping",
            "tex": "v_{\\mathrm{CM}}=R\\omega",
            "tag": "Rolling",
            "appliesTo": "Rolling rigid bodies",
            "assumptions": "Pure rolling without slipping"
          },
          {
            "type": "formula",
            "name": "Rolling Acceleration",
            "tex": "a_{\\mathrm{CM}}=R\\alpha",
            "tag": "Rolling",
            "appliesTo": "Rolling rigid bodies",
            "assumptions": "Pure rolling without slipping"
          },
          {
            "type": "formula",
            "name": "Rolling Displacement",
            "tex": "s=R\\theta",
            "tag": "Rolling",
            "appliesTo": "Rolling rigid bodies",
            "assumptions": "Pure rolling without slipping, angle in radians"
          },
          {
            "type": "formula",
            "name": "Total Kinetic Energy of Rolling Body",
            "tex": "K=\\frac12Mv_{\\mathrm{CM}}^2+\\frac12I_{\\mathrm{CM}}\\omega^2",
            "tag": "Rolling",
            "appliesTo": "Rolling rigid bodies",
            "assumptions": "Rigid body"
          },
          {
            "type": "formula",
            "name": "Rolling Down Incline",
            "tex": "a_{\\mathrm{CM}}=\\frac{g\\sin\\theta}{1+I_{\\mathrm{CM}}/(MR^2)}",
            "tag": "Rolling",
            "appliesTo": "Rigid body rolling down an incline",
            "assumptions": "Pure rolling without slipping"
          },
          {
            "type": "formula",
            "name": "Universal Law of Gravitation",
            "tex": "F=G\\frac{m_1m_2}{r^2}",
            "tag": "Gravitation",
            "appliesTo": "Two point masses or spherically symmetric bodies",
            "assumptions": "Newtonian gravity"
          },
          {
            "type": "formula",
            "name": "Gravitational Field",
            "tex": "g=\\frac{GM}{r^2}",
            "tag": "Gravitation",
            "appliesTo": "Outside spherical mass",
            "assumptions": "Newtonian gravity"
          },
          {
            "type": "formula",
            "name": "Gravitational Potential Energy",
            "tex": "U=-\\frac{GMm}{r}",
            "tag": "Gravitation",
            "appliesTo": "Two-body gravitational systems",
            "assumptions": "Newtonian gravity, zero potential at infinity"
          },
          {
            "type": "formula",
            "name": "Gravitational Potential",
            "tex": "\\Phi=-\\frac{GM}{r}",
            "tag": "Gravitation",
            "appliesTo": "Point mass or spherical mass",
            "assumptions": "Newtonian gravity, zero potential at infinity"
          },
          {
            "type": "formula",
            "name": "Circular Orbital Speed",
            "tex": "v=\\sqrt{\\frac{GM}{r}}",
            "tag": "Orbital Dynamics",
            "appliesTo": "Circular orbits",
            "assumptions": "Test mass, negligible atmosphere, Newtonian gravity"
          },
          {
            "type": "formula",
            "name": "Circular Orbital Angular Speed",
            "tex": "\\omega=\\sqrt{\\frac{GM}{r^3}}",
            "tag": "Orbital Dynamics",
            "appliesTo": "Circular orbits",
            "assumptions": "Newtonian two-body approximation"
          },
          {
            "type": "formula",
            "name": "Orbital Period",
            "tex": "T=2\\pi\\sqrt{\\frac{r^3}{GM}}",
            "tag": "Orbital Dynamics",
            "appliesTo": "Circular orbits",
            "assumptions": "Newtonian gravity, negligible secondary mass"
          },
          {
            "type": "formula",
            "name": "Escape Velocity",
            "tex": "v_{\\mathrm{esc}}=\\sqrt{\\frac{2GM}{r}}",
            "tag": "Orbital Dynamics",
            "appliesTo": "Escape from spherical gravitating body",
            "assumptions": "Newtonian gravity, no atmosphere or drag"
          },
          {
            "type": "formula",
            "name": "Gravitational Orbital Energy",
            "tex": "E=-\\frac{GMm}{2r}",
            "tag": "Orbital Dynamics",
            "appliesTo": "Circular orbits",
            "assumptions": "Newtonian gravity"
          },
          {
            "type": "formula",
            "name": "Kepler's Third Law",
            "tex": "T^2=\\frac{4\\pi^2}{GM}a^3",
            "tag": "Orbital Dynamics",
            "appliesTo": "Bound Keplerian orbits",
            "assumptions": "Newtonian two-body problem"
          },
          {
            "type": "formula",
            "name": "Elastic Collision Momentum Conservation",
            "tex": "m_1\\mathbf v_1+m_2\\mathbf v_2=m_1\\mathbf v_1'+m_2\\mathbf v_2'",
            "tag": "Collisions",
            "appliesTo": "Isolated collisions",
            "assumptions": "Negligible external impulse"
          },
          {
            "type": "formula",
            "name": "Elastic Collision Energy Conservation",
            "tex": "\\frac12m_1v_1^2+\\frac12m_2v_2^2=\\frac12m_1v_1'^2+\\frac12m_2v_2'^2",
            "tag": "Collisions",
            "appliesTo": "Perfectly elastic collisions",
            "assumptions": "Non-relativistic, isolated system"
          },
          {
            "type": "formula",
            "name": "Coefficient of Restitution",
            "tex": "e=\\frac{|v_2'-v_1'|}{|v_1-v_2|}",
            "tag": "Collisions",
            "appliesTo": "One-dimensional collisions",
            "assumptions": "Defined along collision normal"
          },
          {
            "type": "formula",
            "name": "Perfectly Inelastic Collision",
            "tex": "m_1v_1+m_2v_2=(m_1+m_2)v'",
            "tag": "Collisions",
            "appliesTo": "Perfectly inelastic collisions",
            "assumptions": "Objects stick together, isolated system"
          },
          {
            "type": "formula",
            "name": "Reduced Mass",
            "tex": "\\mu=\\frac{m_1m_2}{m_1+m_2}",
            "tag": "Two-Body Dynamics",
            "appliesTo": "Two-body problems",
            "assumptions": "Classical mechanics"
          },
          {
            "type": "formula",
            "name": "Two-Body Relative Motion",
            "tex": "\\mu\\ddot{\\mathbf r}=\\mathbf F",
            "tag": "Two-Body Dynamics",
            "appliesTo": "Two-body central-force problems",
            "assumptions": "Newtonian mechanics"
          },
          {
            "type": "formula",
            "name": "Simple Harmonic Motion Restoring Force",
            "tex": "F=-kx",
            "tag": "Oscillations",
            "appliesTo": "Mass-spring systems",
            "assumptions": "Small oscillations and Hooke's law"
          },
          {
            "type": "formula",
            "name": "Simple Harmonic Motion Equation",
            "tex": "\\ddot{x}+\\omega^2x=0",
            "tag": "Oscillations",
            "appliesTo": "Simple harmonic oscillators",
            "assumptions": "Linear restoring force"
          },
          {
            "type": "formula",
            "name": "Simple Harmonic Motion Angular Frequency",
            "tex": "\\omega=\\sqrt{\\frac{k}{m}}",
            "tag": "Oscillations",
            "appliesTo": "Mass-spring oscillator",
            "assumptions": "Ideal spring and small oscillations"
          },
          {
            "type": "formula",
            "name": "Simple Harmonic Motion Period",
            "tex": "T=2\\pi\\sqrt{\\frac{m}{k}}",
            "tag": "Oscillations",
            "appliesTo": "Mass-spring oscillator",
            "assumptions": "Ideal spring"
          },
          {
            "type": "formula",
            "name": "Simple Harmonic Motion Position",
            "tex": "x(t)=A\\cos(\\omega t+\\phi)",
            "tag": "Oscillations",
            "appliesTo": "Simple harmonic motion",
            "assumptions": "Undamped oscillator"
          },
          {
            "type": "formula",
            "name": "Simple Harmonic Motion Velocity",
            "tex": "v(t)=-A\\omega\\sin(\\omega t+\\phi)",
            "tag": "Oscillations",
            "appliesTo": "Simple harmonic motion",
            "assumptions": "Undamped oscillator"
          },
          {
            "type": "formula",
            "name": "Simple Harmonic Motion Acceleration",
            "tex": "a(t)=-\\omega^2x(t)",
            "tag": "Oscillations",
            "appliesTo": "Simple harmonic motion",
            "assumptions": "Undamped oscillator"
          },
          {
            "type": "formula",
            "name": "Simple Pendulum Period",
            "tex": "T=2\\pi\\sqrt{\\frac{L}{g}}",
            "tag": "Oscillations",
            "appliesTo": "Simple pendulum",
            "assumptions": "Small-angle approximation, point mass, massless string"
          },
          {
            "type": "formula",
            "name": "Damped Oscillator Equation",
            "tex": "m\\ddot{x}+b\\dot{x}+kx=0",
            "tag": "Oscillations",
            "appliesTo": "Damped harmonic oscillator",
            "assumptions": "Linear viscous damping"
          },
          {
            "type": "formula",
            "name": "Damping Coefficient Ratio",
            "tex": "\\zeta=\\frac{b}{2\\sqrt{mk}}",
            "tag": "Oscillations",
            "appliesTo": "Damped harmonic oscillator",
            "assumptions": "Linear viscous damping"
          },
          {
            "type": "formula",
            "name": "Generalized Newtonian Equation",
            "tex": "\\mathbf F(\\mathbf r,\\mathbf v,t)=m\\frac{d^2\\mathbf r}{dt^2}",
            "tag": "Dynamics",
            "appliesTo": "Classical particle mechanics",
            "assumptions": "Constant mass, inertial reference frame"
          },
          {
            "type": "formula",
            "name": "Lagrangian Definition",
            "tex": "\\mathcal L=T-U",
            "tag": "Analytical Mechanics",
            "appliesTo": "Conservative classical systems",
            "assumptions": "Suitable generalized coordinates"
          },
          {
            "type": "formula",
            "name": "Euler-Lagrange Equation",
            "tex": "\\frac{d}{dt}\\left(\\frac{\\partial\\mathcal L}{\\partial\\dot q_i}\\right)-\\frac{\\partial\\mathcal L}{\\partial q_i}=0",
            "tag": "Analytical Mechanics",
            "appliesTo": "Classical mechanical systems",
            "assumptions": "Holonomic constraints and suitable Lagrangian"
          }
        ]
      },
      {
        "title": "Gravitation & Orbits",
        "items": [
          {
            "type": "formula",
            "name": "Gravitational Potential Energy",
            "tex": "U=-\\frac{GMm}{r}",
            "tag": "Energy",
            "appliesTo": "Two-body systems",
            "assumptions": "Spherical symmetry or point masses"
          },
          {
            "type": "formula",
            "name": "Total Orbital Energy",
            "tex": "E=\\frac12mv^2-\\frac{GMm}{r}",
            "tag": "Energy",
            "appliesTo": "Keplerian orbits",
            "assumptions": "Isolated two-body system"
          },
          {
            "type": "formula",
            "name": "Vis-Viva Equation",
            "tex": "v^2=GM\\left(\\frac2r-\\frac1a\\right)",
            "tag": "Kinematics",
            "appliesTo": "Elliptical orbits",
            "assumptions": "Keplerian motion"
          },
          {
            "type": "formula",
            "name": "Kepler's Third Law",
            "tex": "T^2=\\frac{4\\pi^2}{GM}a^3",
            "tag": "Kinematics",
            "appliesTo": "Orbital periods",
            "assumptions": "M >> m"
          },
          {
            "type": "formula",
            "name": "Reduced Mass",
            "tex": "\\mu=\\frac{m_1m_2}{m_1+m_2}",
            "tag": "Two-body reduction",
            "appliesTo": "Binary systems",
            "assumptions": "Center of mass frame"
          }
        ]
      },
      {
        "title": "Advanced Mechanics",
        "items": [
          {
            "type": "formula",
            "name": "Lagrangian",
            "tex": "L=T-U",
            "tag": "Analytical Mechanics",
            "appliesTo": "System evolution",
            "assumptions": "Conservative forces"
          },
          {
            "type": "formula",
            "name": "Euler-Lagrange Equation",
            "tex": "\\frac{d}{dt} \\frac{\\partial L}{\\partial\\dot q_i} - \\frac{\\partial L}{\\partial q_i}=0",
            "tag": "Equation of Motion",
            "appliesTo": "Generalized coordinates",
            "assumptions": "Holonomic constraints"
          },
          {
            "type": "formula",
            "name": "Hamiltonian",
            "tex": "H=\\sum_i p_i\\dot q_i-L",
            "tag": "Analytical Mechanics",
            "appliesTo": "Phase space dynamics",
            "assumptions": "Legendre transformation of L"
          },
          {
            "type": "formula",
            "name": "Hamilton's Equations",
            "tex": "\\dot q_i=\\frac{\\partial H}{\\partial p_i} \\quad,\\quad \\dot p_i=-\\frac{\\partial H}{\\partial q_i}",
            "tag": "Equations of Motion",
            "appliesTo": "Symplectic geometry",
            "assumptions": "Classical phase space"
          }
        ]
      }
    ]
  },
  {
    "id": "fluids_mhd",
    "title": "2. Fluid Dynamics & Magnetohydrodynamics",
    "sections": [
      {
        "title": "Fluid Equations",
        "items": [
          {
            "type": "formula",
            "name": "Material Derivative",
            "tex": "\\frac{D}{Dt} = \\frac{\\partial}{\\partial t} +\\mathbf v\\cdot\\nabla",
            "tag": "Operator",
            "appliesTo": "Lagrangian frame tracking",
            "assumptions": "Continuum hypothesis"
          },
          {
            "type": "formula",
            "name": "Continuity Equation",
            "tex": "\\frac{\\partial\\rho}{\\partial t} +\\nabla\\cdot(\\rho\\mathbf v)=0",
            "tag": "Conservation",
            "appliesTo": "Mass transport",
            "assumptions": "No sources or sinks"
          },
          {
            "type": "formula",
            "name": "Euler Equation",
            "tex": "\\rho \\left( \\frac{\\partial\\mathbf v}{\\partial t} + \\mathbf v\\cdot\\nabla\\mathbf v \\right) = -\\nabla P+\\rho\\mathbf g",
            "tag": "Momentum",
            "appliesTo": "Inviscid flows",
            "assumptions": "Zero viscosity"
          },
          {
            "type": "formula",
            "name": "Navier-Stokes Equation",
            "tex": "\\rho\\frac{D\\mathbf v}{Dt} = -\\nabla P+\\mu\\nabla^2\\mathbf v+\\rho\\mathbf g",
            "tag": "Momentum",
            "appliesTo": "Viscous flows",
            "assumptions": "Newtonian fluid"
          },
          {
            "type": "formula",
            "name": "Vorticity",
            "tex": "\\boldsymbol\\omega=\\nabla\\times\\mathbf v",
            "tag": "Kinematics",
            "appliesTo": "Rotational flows",
            "assumptions": "Continuum field"
          },
          {
            "type": "formula",
            "name": "Bernoulli's Principle",
            "tex": "\\frac12v^2+\\frac{P}{\\rho}+\\Phi=\\text{constant}",
            "tag": "Energy",
            "appliesTo": "Streamlines",
            "assumptions": "Steady, incompressible, inviscid"
          },
          {
            "type": "formula",
            "name": "Reynolds Number",
            "tex": "Re=\\frac{\\rho vL}{\\mu}",
            "tag": "Dimensionless",
            "appliesTo": "Flow regime indicator",
            "assumptions": "Navier-Stokes scaling"
          },
          {
            "type": "formula",
            "name": "Mach Number",
            "tex": "M=\\frac vc_s",
            "tag": "Dimensionless",
            "appliesTo": "Compressibility",
            "assumptions": "Adiabatic sound speed"
          }
        ]
      },
      {
        "title": "Magnetohydrodynamics (MHD)",
        "items": [
          {
            "type": "formula",
            "name": "Induction Equation",
            "tex": "\\frac{\\partial\\mathbf B}{\\partial t} = \\nabla\\times(\\mathbf v\\times\\mathbf B) -\\nabla\\times(\\eta\\nabla\\times\\mathbf B)",
            "tag": "MHD",
            "appliesTo": "Conducting fluids",
            "assumptions": "Ohm's law applies"
          },
          {
            "type": "formula",
            "name": "Lorentz Force Density",
            "tex": "\\mathbf f=\\mathbf J\\times\\mathbf B",
            "tag": "Dynamics",
            "appliesTo": "Plasma back-reaction",
            "assumptions": "Non-relativistic bulk motion"
          },
          {
            "type": "formula",
            "name": "Magnetic Pressure",
            "tex": "P_B=\\frac{B^2}{2\\mu_0}",
            "tag": "Thermodynamics",
            "appliesTo": "Plasma confinement",
            "assumptions": "Isotropic effective pressure"
          }
        ]
      }
    ]
  },
  {
    "id": "electromagnetism",
    "title": "3. Electromagnetism",
    "sections": [
      {
        "title": "Potentials & Fields",
        "items": [
          {
            "type": "formula",
            "name": "Vector & Scalar Potentials",
            "tex": "\\mathbf B=\\nabla\\times\\mathbf A \\quad,\\quad \\mathbf E=-\\nabla\\phi-\\frac{\\partial\\mathbf A}{\\partial t}",
            "tag": "Definitions",
            "appliesTo": "Gauge theory",
            "assumptions": "Classical electrodynamics"
          },
          {
            "type": "formula",
            "name": "Poynting Vector",
            "tex": "\\mathbf S=\\frac1{\\mu_0}\\mathbf E\\times\\mathbf B",
            "tag": "Energy Transport",
            "appliesTo": "EM Waves",
            "assumptions": "Vacuum or linear media"
          },
          {
            "type": "formula",
            "name": "EM Energy Density",
            "tex": "u= \\frac12 \\left( \\epsilon_0E^2+\\frac{B^2}{\\mu_0} \\right)",
            "tag": "Energy",
            "appliesTo": "EM Fields",
            "assumptions": "Classical vacuum"
          }
        ]
      },
      {
        "title": "Covariant Formulation",
        "items": [
          {
            "type": "formula",
            "name": "Electromagnetic Field Tensor",
            "tex": "F_{\\mu\\nu} = \\partial_\\mu A_\\nu-\\partial_\\nu A_\\mu",
            "tag": "Tensor",
            "appliesTo": "Relativistic EM",
            "assumptions": "4-potential A_mu"
          },
          {
            "type": "formula",
            "name": "Covariant Maxwell Equations",
            "tex": "\\nabla_\\mu F^{\\mu\\nu}=\\mu_0J^\\nu",
            "tag": "Field Equation",
            "appliesTo": "Sources and fields",
            "assumptions": "Curved or flat spacetime"
          },
          {
            "type": "formula",
            "name": "EM Stress-Energy Tensor",
            "tex": "T_{\\mu\\nu}^{EM} = \\frac1{\\mu_0} \\left( F_{\\mu\\alpha}F_\\nu{}^\\alpha -\\frac14g_{\\mu\\nu}F_{\\alpha\\beta}F^{\\alpha\\beta} \\right)",
            "tag": "Energy-Momentum",
            "appliesTo": "Coupling to GR",
            "assumptions": "Symmetric, traceless"
          }
        ]
      }
    ]
  },
  {
    "id": "radiation",
    "title": "4. Radiation & Radiative Transfer",
    "sections": [
      {
        "title": "Thermal Radiation",
        "items": [
          {
            "type": "formula",
            "name": "Planck Function",
            "tex": "B_\\nu(T)= \\frac{2h\\nu^3}{c^2} \\frac1{e^{h\\nu/k_BT}-1}",
            "tag": "Spectrum",
            "appliesTo": "Blackbodies",
            "assumptions": "Thermal equilibrium"
          },
          {
            "type": "formula",
            "name": "Stefan-Boltzmann Law",
            "tex": "F=\\sigma T^4",
            "tag": "Flux",
            "appliesTo": "Total emitted power",
            "assumptions": "Integrated over all frequencies"
          },
          {
            "type": "formula",
            "name": "Wien's Displacement Law",
            "tex": "\\lambda_{\\max}T=b",
            "tag": "Spectrum Peak",
            "appliesTo": "Color temperature",
            "assumptions": "b ≈ 2.898×10⁻³ m·K"
          },
          {
            "type": "formula",
            "name": "Radiation Energy Density",
            "tex": "u=aT^4",
            "tag": "Thermodynamics",
            "appliesTo": "Photon gas",
            "assumptions": "Isotropic field"
          },
          {
            "type": "formula",
            "name": "Radiation Pressure",
            "tex": "P=\\frac13aT^4",
            "tag": "Thermodynamics",
            "appliesTo": "Stellar interiors",
            "assumptions": "Isotropic field"
          }
        ]
      },
      {
        "title": "Radiative Transfer",
        "items": [
          {
            "type": "formula",
            "name": "Radiative Transfer Equation",
            "tex": "\\frac{dI_\\nu}{ds} = -\\alpha_\\nu I_\\nu+j_\\nu",
            "tag": "Transport",
            "appliesTo": "Media propagation",
            "assumptions": "Macroscopic ray tracing"
          },
          {
            "type": "formula",
            "name": "Optical Depth",
            "tex": "\\tau_\\nu=\\int\\alpha_\\nu ds",
            "tag": "Property",
            "appliesTo": "Opacity tracking",
            "assumptions": "Integrated along line of sight"
          },
          {
            "type": "formula",
            "name": "Source Function",
            "tex": "S_\\nu=\\frac{j_\\nu}{\\alpha_\\nu}",
            "tag": "Definition",
            "appliesTo": "Emission vs absorption",
            "assumptions": "Local thermodynamic equilibrium"
          },
          {
            "type": "formula",
            "name": "Formal Solution",
            "tex": "I_\\nu(s) = I_\\nu(0)e^{-\\tau_\\nu} + \\int_0^s j_\\nu(s') e^{-[\\tau_\\nu(s)-\\tau_\\nu(s')]} ds'",
            "tag": "Solution",
            "appliesTo": "Renderer implementation",
            "assumptions": "Non-scattering medium"
          }
        ]
      }
    ]
  },
  {
    "id": "thermo",
    "title": "5. Thermodynamics & Statistical Mechanics",
    "sections": [
      {
        "title": "Laws & Potentials",
        "items": [
          {
            "type": "formula",
            "name": "First Law of Thermodynamics",
            "tex": "dU=TdS-PdV+\\mu dN",
            "tag": "Conservation",
            "appliesTo": "Energy change",
            "assumptions": "Reversible processes"
          },
          {
            "type": "formula",
            "name": "Second Law of Thermodynamics",
            "tex": "dS\\geq\\frac{\\delta Q}{T}",
            "tag": "Entropy",
            "appliesTo": "Irreversibility",
            "assumptions": "Isolated or closed systems"
          },
          {
            "type": "formula",
            "name": "Helmholtz Free Energy",
            "tex": "F=U-TS",
            "tag": "Potential",
            "appliesTo": "Constant T, V systems",
            "assumptions": "Extractable work"
          },
          {
            "type": "formula",
            "name": "Gibbs Free Energy",
            "tex": "G=U+PV-TS",
            "tag": "Potential",
            "appliesTo": "Constant T, P systems",
            "assumptions": "Phase transitions"
          },
          {
            "type": "formula",
            "name": "Enthalpy",
            "tex": "H=U+PV",
            "tag": "Potential",
            "appliesTo": "Constant P heating",
            "assumptions": "Includes flow work"
          },
          {
            "type": "formula",
            "name": "Chemical Potential",
            "tex": "\\mu= \\left( \\frac{\\partial U}{\\partial N} \\right)_{S,V}",
            "tag": "Property",
            "appliesTo": "Particle exchange",
            "assumptions": "Equilibrium"
          }
        ]
      },
      {
        "title": "Statistical Distributions",
        "items": [
          {
            "type": "formula",
            "name": "Fermi-Dirac Distribution",
            "tex": "f(E)= \\frac1{e^{(E-\\mu)/k_BT}+1}",
            "tag": "Quantum Stats",
            "appliesTo": "Fermions (e-, n, p)",
            "assumptions": "Pauli exclusion"
          },
          {
            "type": "formula",
            "name": "Bose-Einstein Distribution",
            "tex": "f(E)= \\frac1{e^{(E-\\mu)/k_BT}-1}",
            "tag": "Quantum Stats",
            "appliesTo": "Bosons (photons)",
            "assumptions": "Indistinguishable, no exclusion"
          },
          {
            "type": "formula",
            "name": "Fermi Momentum",
            "tex": "p_F=\\hbar(3\\pi^2n)^{1/3}",
            "tag": "Degeneracy",
            "appliesTo": "Dense matter",
            "assumptions": "Zero temperature limit"
          },
          {
            "type": "formula",
            "name": "Relativistic Energy Relation",
            "tex": "E=\\sqrt{p^2c^2+m^2c^4}",
            "tag": "Kinematics",
            "appliesTo": "High-energy particles",
            "assumptions": "Special relativity applies"
          }
        ]
      }
    ]
  },
  {
    "id": "qm",
    "title": "6. Quantum Mechanics & Quantum Statistics",
    "sections": [
      {
        "title": "Core Formalism",
        "items": [
          {
            "type": "formula",
            "name": "Commutation Relation",
            "tex": "[\\hat x,\\hat p]=i\\hbar",
            "tag": "Operators",
            "appliesTo": "Conjugate variables",
            "assumptions": "Canonical quantization"
          },
          {
            "type": "formula",
            "name": "Time-Independent Schrödinger Eq",
            "tex": "\\hat H\\psi=E\\psi",
            "tag": "Wave Equation",
            "appliesTo": "Stationary states",
            "assumptions": "Non-relativistic"
          },
          {
            "type": "formula",
            "name": "Expectation Value",
            "tex": "\\langle A\\rangle = \\int\\psi^*\\hat A\\psi\\,d^3x",
            "tag": "Measurement",
            "appliesTo": "Observables",
            "assumptions": "Normalized wavefunction"
          },
          {
            "type": "formula",
            "name": "Heisenberg Equation of Motion",
            "tex": "\\frac{d\\hat A}{dt} = \\frac{i}{\\hbar}[\\hat H,\\hat A] + \\frac{\\partial\\hat A}{\\partial t}",
            "tag": "Evolution",
            "appliesTo": "Operators in Heisenberg picture",
            "assumptions": "Unitary evolution"
          }
        ]
      },
      {
        "title": "Fermion Physics",
        "items": [
          {
            "type": "text",
            "content": "Pauli Exclusion Principle dictates that fermionic wavefunctions must be fully antisymmetric under particle exchange."
          },
          {
            "type": "formula",
            "name": "Fermi Energy",
            "tex": "E_F= \\sqrt{p_F^2c^2+m^2c^4}",
            "tag": "Energy Threshold",
            "appliesTo": "Degenerate gas",
            "assumptions": "Highest occupied state at T=0"
          }
        ]
      }
    ]
  },
  {
    "id": "sr",
    "title": "7. Special Relativity",
    "sections": [
      {
        "title": "Four-Vectors & Kinematics",
        "items": [
          {
            "type": "formula",
            "name": "Four-Velocity",
            "tex": "u^\\mu=\\frac{dx^\\mu}{d\\tau}",
            "tag": "Kinematics",
            "appliesTo": "Spacetime trajectories",
            "assumptions": "Massive particles"
          },
          {
            "type": "formula",
            "name": "Four-Momentum",
            "tex": "p^\\mu=mu^\\mu",
            "tag": "Dynamics",
            "appliesTo": "Energy-momentum tracking",
            "assumptions": "Invariant mass m"
          },
          {
            "type": "formula",
            "name": "Four-Acceleration",
            "tex": "a^\\mu=\\frac{du^\\mu}{d\\tau}",
            "tag": "Dynamics",
            "appliesTo": "Proper acceleration",
            "assumptions": "Orthogonal to 4-velocity"
          },
          {
            "type": "formula",
            "name": "Four-Current",
            "tex": "J^\\mu=(c\\rho,\\mathbf J)",
            "tag": "Electrodynamics",
            "appliesTo": "Charge transport",
            "assumptions": "Charge conservation"
          },
          {
            "type": "formula",
            "name": "Relativistic Doppler Effect",
            "tex": "\\nu_\\mathrm{obs} = \\nu_\\mathrm{emit} \\sqrt{\\frac{1-\\beta}{1+\\beta}}",
            "tag": "Observable",
            "appliesTo": "Collinear motion",
            "assumptions": "Source moving away"
          }
        ]
      },
      {
        "title": "Energy & Invariants",
        "items": [
          {
            "type": "formula",
            "name": "Relativistic Kinetic Energy",
            "tex": "K=(\\gamma-1)mc^2",
            "tag": "Energy",
            "appliesTo": "Particle collisions",
            "assumptions": "Rest mass subtracted"
          },
          {
            "type": "formula",
            "name": "Energy-Momentum Invariant",
            "tex": "E^2-p^2c^2=m^2c^4",
            "tag": "Invariant",
            "appliesTo": "All inertial frames",
            "assumptions": "Minkowski metric"
          }
        ]
      }
    ]
  },
  {
    "id": "gr",
    "title": "8. General Relativity",
    "sections": [
      {
        "title": "Curvature & Field Equations",
        "items": [
          {
            "type": "formula",
            "name": "Riemann Curvature Tensor",
            "tex": "R^\\rho_{\\ \\sigma\\mu\\nu} = \\partial_\\mu\\Gamma^\\rho_{\\nu\\sigma} -\\partial_\\nu\\Gamma^\\rho_{\\mu\\sigma} +\\Gamma^\\rho_{\\mu\\lambda}\\Gamma^\\lambda_{\\nu\\sigma} -\\Gamma^\\rho_{\\nu\\lambda}\\Gamma^\\lambda_{\\mu\\sigma}",
            "tag": "Geometry",
            "appliesTo": "Spacetime curvature",
            "assumptions": "Levi-Civita connection"
          },
          {
            "type": "formula",
            "name": "Ricci Tensor & Scalar",
            "tex": "R_{\\mu\\nu} = R^\\rho_{\\ \\mu\\rho\\nu} \\quad,\\quad R=g^{\\mu\\nu}R_{\\mu\\nu}",
            "tag": "Geometry Traces",
            "appliesTo": "Volume changes",
            "assumptions": "Contractions of Riemann"
          },
          {
            "type": "formula",
            "name": "Einstein Tensor",
            "tex": "G_{\\mu\\nu} = R_{\\mu\\nu} -\\frac12Rg_{\\mu\\nu}",
            "tag": "Geometry",
            "appliesTo": "Divergence-free curvature",
            "assumptions": "Bianchi identity compliance"
          },
          {
            "type": "formula",
            "name": "Einstein Field Equation",
            "tex": "G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}",
            "tag": "Field Equation",
            "appliesTo": "Spacetime dynamics",
            "assumptions": "Coupling geometry to matter"
          },
          {
            "type": "formula",
            "name": "Einstein-Hilbert Action",
            "tex": "S_{EH} = \\frac{c^3}{16\\pi G} \\int(R-2\\Lambda)\\sqrt{-g}\\,d^4x",
            "tag": "Action",
            "appliesTo": "Derivation of GR",
            "assumptions": "Principle of least action"
          },
          {
            "type": "formula",
            "name": "Energy-Momentum Conservation",
            "tex": "\\nabla_\\mu T^{\\mu\\nu}=0",
            "tag": "Conservation",
            "appliesTo": "Matter fields",
            "assumptions": "Local conservation law"
          },
          {
            "type": "formula",
            "name": "Geodesic Equation",
            "tex": "\\frac{d^2x^\\mu}{d\\lambda^2} + \\Gamma^\\mu_{\\alpha\\beta} \\frac{dx^\\alpha}{d\\lambda} \\frac{dx^\\beta}{d\\lambda} = 0",
            "tag": "Motion",
            "appliesTo": "Free-fall",
            "assumptions": "Affine parametrization"
          }
        ]
      }
    ]
  },
  {
    "id": "stellar",
    "title": "9. Stellar Structure & Nuclear Physics",
    "sections": [
      {
        "title": "Equations of Stellar Structure",
        "items": [
          {
            "type": "formula",
            "name": "Mass Conservation",
            "tex": "\\frac{dm}{dr}=4\\pi r^2\\rho",
            "tag": "Structure",
            "appliesTo": "Stellar interiors",
            "assumptions": "Spherical symmetry, stationary"
          },
          {
            "type": "formula",
            "name": "Hydrostatic Equilibrium",
            "tex": "\\frac{dP}{dr} = -\\frac{Gm\\rho}{r^2}",
            "tag": "Structure",
            "appliesTo": "Pressure vs Gravity",
            "assumptions": "Newtonian limit"
          },
          {
            "type": "formula",
            "name": "Energy Generation",
            "tex": "\\frac{dL}{dr} = 4\\pi r^2\\rho\\epsilon",
            "tag": "Structure",
            "appliesTo": "Luminosity gradient",
            "assumptions": "Local energy production"
          },
          {
            "type": "formula",
            "name": "Radiative Energy Transport",
            "tex": "\\frac{dT}{dr} = -\\frac{3\\kappa\\rho L}{16\\pi acT^3r^2}",
            "tag": "Transport",
            "appliesTo": "Radiative zones",
            "assumptions": "Diffusion approximation"
          }
        ]
      },
      {
        "title": "Nuclear & Opacity",
        "items": [
          {
            "type": "formula",
            "name": "Nuclear Reaction Rate",
            "tex": "r_{12} = n_1n_2\\langle\\sigma v\\rangle",
            "tag": "Nuclear Physics",
            "appliesTo": "Fusion processes",
            "assumptions": "Maxwell-Boltzmann velocities"
          },
          {
            "type": "formula",
            "name": "Energy Release (Q-value)",
            "tex": "Q=\\Delta mc^2",
            "tag": "Energy",
            "appliesTo": "Exothermic reactions",
            "assumptions": "Mass defect"
          },
          {
            "type": "text",
            "content": "Total energy generation $\\epsilon$ includes nuclear energy $\\epsilon_{nuc}$ minus neutrino losses $\\epsilon_\\nu$. Opacity $\\kappa$ aggregates electron scattering, free-free, bound-free, and bound-bound transitions."
          }
        ]
      }
    ]
  },
  {
    "id": "dwarfs",
    "title": "10. White Dwarfs & Brown Dwarfs",
    "sections": [
      {
        "title": "White Dwarfs",
        "items": [
          {
            "type": "formula",
            "name": "Electron Number Density",
            "tex": "n_e=\\frac{\\rho}{\\mu_em_u}",
            "tag": "State Variable",
            "appliesTo": "Degenerate cores",
            "assumptions": "Fully ionized matter"
          },
          {
            "type": "formula",
            "name": "Non-Relativistic Degeneracy",
            "tex": "P\\propto\\rho^{5/3} \\implies R\\propto M^{-1/3}",
            "tag": "EOS",
            "appliesTo": "Low-mass white dwarfs",
            "assumptions": "Polytrope n=1.5"
          },
          {
            "type": "formula",
            "name": "Ultra-Relativistic Degeneracy",
            "tex": "P\\propto\\rho^{4/3}",
            "tag": "EOS",
            "appliesTo": "High-mass approaching limit",
            "assumptions": "Polytrope n=3"
          },
          {
            "type": "formula",
            "name": "Chandrasekhar Mass Limit",
            "tex": "M_{Ch} \\approx \\frac{5.83}{\\mu_e^2}M_\\odot",
            "tag": "Stability Limit",
            "appliesTo": "Maximum WD mass",
            "assumptions": "Zero temperature ideal Fermi gas"
          }
        ]
      },
      {
        "title": "Brown Dwarfs",
        "items": [
          {
            "type": "text",
            "content": "Supported by ideal gas pressure, electron degeneracy, and partial degeneracy. Ruled by Kelvin-Helmholtz cooling."
          },
          {
            "type": "formula",
            "name": "Surface Luminosity",
            "tex": "L=4\\pi R^2\\sigma T_\\mathrm{eff}^4",
            "tag": "Emission",
            "appliesTo": "Cooling curves",
            "assumptions": "Blackbody radiator approximation"
          }
        ]
      }
    ]
  },
  {
    "id": "neutron_stars",
    "title": "11. Neutron Stars",
    "sections": [
      {
        "title": "Relativistic Structure",
        "items": [
          {
            "type": "formula",
            "name": "Mass Equation",
            "tex": "\\frac{dm}{dr}=4\\pi r^2\\epsilon/c^2",
            "tag": "Structure",
            "appliesTo": "Energy density integration",
            "assumptions": "General relativity"
          },
          {
            "type": "formula",
            "name": "TOV Equation",
            "tex": "\\frac{dP}{dr} = -\\frac{G \\left(\\rho+\\frac{P}{c^2}\\right) \\left(m+\\frac{4\\pi r^3P}{c^2}\\right)}{r^2 \\left(1-\\frac{2Gm}{rc^2}\\right)}",
            "tag": "Structure",
            "appliesTo": "Hydrostatic equilibrium",
            "assumptions": "Spherical symmetry, GR"
          },
          {
            "type": "formula",
            "name": "Equation of State Closure",
            "tex": "P=P(\\epsilon)",
            "tag": "Closure",
            "appliesTo": "Nuclear matter",
            "assumptions": "Cold, catalyzed matter"
          },
          {
            "type": "formula",
            "name": "Boundary Conditions",
            "tex": "m(0)=0 \\quad,\\quad P(0)=P_c \\quad,\\quad P(R)=0",
            "tag": "Integration Limits",
            "appliesTo": "Numerical modeling",
            "assumptions": "Surface at zero pressure"
          }
        ]
      },
      {
        "title": "Observables & Deformation",
        "items": [
          {
            "type": "formula",
            "name": "Compactness",
            "tex": "C=\\frac{GM}{Rc^2}",
            "tag": "Parameter",
            "appliesTo": "Relativistic strength",
            "assumptions": "Dimensionless"
          },
          {
            "type": "formula",
            "name": "Surface Redshift",
            "tex": "1+z= \\left(1-\\frac{2GM}{Rc^2}\\right)^{-1/2}",
            "tag": "Observable",
            "appliesTo": "Surface emission",
            "assumptions": "Schwarzschild exterior"
          },
          {
            "type": "formula",
            "name": "Binding Energy",
            "tex": "E_B=(M_b-M_g)c^2",
            "tag": "Energy",
            "appliesTo": "Supernova collapse",
            "assumptions": "Baryonic vs Gravitational mass"
          },
          {
            "type": "formula",
            "name": "Tidal Deformability",
            "tex": "\\Lambda= \\frac23k_2C^{-5}",
            "tag": "Property",
            "appliesTo": "GW inspiring phase",
            "assumptions": "Linear tidal response"
          },
          {
            "type": "formula",
            "name": "Moment of Inertia & Rot Energy",
            "tex": "J=I\\Omega \\quad,\\quad E_\\mathrm{rot} = \\frac12I\\Omega^2",
            "tag": "Kinematics",
            "appliesTo": "Spinning NS",
            "assumptions": "Rigid rotation approximation"
          }
        ]
      }
    ]
  },
  {
    "id": "pulsars",
    "title": "12. Pulsars & Magnetars",
    "sections": [
      {
        "title": "Pulsar Rotation & Emission",
        "items": [
          {
            "type": "formula",
            "name": "Period & Rotational Energy Loss",
            "tex": "P=\\frac{2\\pi}{\\Omega} \\quad,\\quad \\dot E_\\mathrm{rot} = -I\\Omega\\dot\\Omega",
            "tag": "Kinematics",
            "appliesTo": "Spin-down luminosity",
            "assumptions": "Constant Moment of Inertia"
          },
          {
            "type": "formula",
            "name": "Magnetic Dipole Field",
            "tex": "B_r=\\frac{2\\mu\\cos\\theta}{r^3} \\quad,\\quad B_\\theta= \\frac{\\mu\\sin\\theta}{r^3}",
            "tag": "Magnetosphere",
            "appliesTo": "Surface field",
            "assumptions": "Ideal dipole"
          },
          {
            "type": "formula",
            "name": "Dipole Spin-Down Radiation",
            "tex": "\\dot E = -\\frac{2\\mu^2\\Omega^4\\sin^2\\alpha}{3c^3}",
            "tag": "Energy Loss",
            "appliesTo": "Vacuum radiation",
            "assumptions": "Magnetic axis offset by alpha"
          },
          {
            "type": "formula",
            "name": "Braking Index",
            "tex": "n= \\frac{\\Omega\\ddot\\Omega}{\\dot\\Omega^2}",
            "tag": "Evolution",
            "appliesTo": "Timing observations",
            "assumptions": "Power-law spin-down"
          },
          {
            "type": "formula",
            "name": "Light Cylinder",
            "tex": "R_{LC}=\\frac c\\Omega",
            "tag": "Boundary",
            "appliesTo": "Magnetosphere limit",
            "assumptions": "Co-rotation velocity reaches c"
          },
          {
            "type": "formula",
            "name": "Goldreich-Julian Density",
            "tex": "\\rho_{GJ} \\approx -\\frac{\\mathbf\\Omega\\cdot\\mathbf B}{2\\pi c}",
            "tag": "Plasma",
            "appliesTo": "Magnetosphere filling",
            "assumptions": "Force-free E dot B = 0"
          }
        ]
      },
      {
        "title": "Magnetars",
        "items": [
          {
            "type": "formula",
            "name": "Magnetic Energy Density",
            "tex": "u_B=\\frac{B^2}{8\\pi}",
            "tag": "Energy",
            "appliesTo": "Crustal stress",
            "assumptions": "cgs units"
          },
          {
            "type": "formula",
            "name": "Ohmic Decay Timescale",
            "tex": "t_\\mathrm{Ohm}\\sim\\frac{L^2}{\\eta}",
            "tag": "Timescale",
            "appliesTo": "Field dissipation",
            "assumptions": "Resistive crust"
          },
          {
            "type": "formula",
            "name": "Hall Drift Timescale",
            "tex": "t_\\mathrm{Hall} \\sim \\frac{4\\pi en_eL^2}{cB}",
            "tag": "Timescale",
            "appliesTo": "Field reconfiguration",
            "assumptions": "Electron fluid drift"
          }
        ]
      }
    ]
  },
  {
    "id": "bh_physics",
    "title": "13. Black Hole Physics",
    "sections": [
      {
        "title": "Non-Rotating Black Holes",
        "items": [
          {
            "type": "text",
            "content": "Schwarzschild (mass $M$) and Reissner-Nordström (mass $M$, charge $Q$)."
          },
          {
            "type": "formula",
            "name": "Schwarzschild Metric",
            "tex": "ds^2= -\\left(1-\\frac{2GM}{rc^2}\\right)c^2dt^2 + \\left(1-\\frac{2GM}{rc^2}\\right)^{-1}dr^2 +r^2d\\Omega^2",
            "tag": "Spacetime",
            "appliesTo": "Static, neutral BH",
            "assumptions": "Spherical symmetry, vacuum"
          },
          {
            "type": "formula",
            "name": "Reissner-Nordström Horizons",
            "tex": "r_\\pm = \\frac{GM}{c^2} \\pm \\sqrt{ \\left(\\frac{GM}{c^2}\\right)^2 - \\frac{GQ^2}{4\\pi\\epsilon_0c^4} }",
            "tag": "Horizons",
            "appliesTo": "Charged BH",
            "assumptions": "Extremal limit avoids naked singularity"
          }
        ]
      },
      {
        "title": "Rotating (Kerr) Black Holes",
        "items": [
          {
            "type": "text",
            "content": "Kerr (mass $M$, spin $J$). Parameters: $a=J/Mc$, $a_*=cJ/GM^2$, $\\Sigma=r^2+a^2\\cos^2\\theta$, $\\Delta=r^2-2r_gr+a^2$."
          },
          {
            "type": "formula",
            "name": "Kerr Metric",
            "tex": "ds^2= -\\left(1-\\frac{2r_gr}{\\Sigma}\\right)c^2dt^2 -\\frac{4r_gar\\sin^2\\theta}{\\Sigma}c\\,dt\\,d\\phi +\\frac{\\Sigma}{\\Delta}dr^2 +\\Sigma d\\theta^2 + \\left( r^2+a^2+ \\frac{2r_ga^2r\\sin^2\\theta}{\\Sigma} \\right) \\sin^2\\theta\\,d\\phi^2",
            "tag": "Spacetime",
            "appliesTo": "Astrophysical BHs",
            "assumptions": "Axisymmetric, vacuum"
          },
          {
            "type": "formula",
            "name": "Event Horizons",
            "tex": "r_\\pm= r_g \\pm \\sqrt{r_g^2-a^2}",
            "tag": "Horizons",
            "appliesTo": "Inner/Outer boundaries",
            "assumptions": "Sub-extremal spin"
          },
          {
            "type": "formula",
            "name": "Ergosphere",
            "tex": "r_\\mathrm{ergo} = r_g+\\sqrt{r_g^2-a^2\\cos^2\\theta}",
            "tag": "Boundary",
            "appliesTo": "Static limit surface",
            "assumptions": "Penrose process region"
          }
        ]
      },
      {
        "title": "Geodesics & Rendering",
        "items": [
          {
            "type": "formula",
            "name": "First-Order Kerr Geodesics",
            "tex": "\\Sigma^2 \\left(\\frac{dr}{d\\lambda}\\right)^2 = \\mathcal R(r) \\quad,\\quad \\Sigma^2 \\left(\\frac{d\\theta}{d\\lambda}\\right)^2 = \\Theta(\\theta)",
            "tag": "Motion",
            "appliesTo": "Ray tracing",
            "assumptions": "Separation of variables (Carter)"
          },
          {
            "type": "formula",
            "name": "Photon Orbits (Spherical)",
            "tex": "\\mathcal R=0 \\quad,\\quad \\frac{d\\mathcal R}{dr}=0",
            "tag": "Constraints",
            "appliesTo": "Unstable photon shells",
            "assumptions": "Defines shadow boundary"
          },
          {
            "type": "formula",
            "name": "Black Hole Shadow Coordinates",
            "tex": "\\alpha=-\\frac{\\xi}{\\sin\\theta_o} \\quad,\\quad \\beta= \\pm \\sqrt{ \\eta+a^2\\cos^2\\theta_o-\\xi^2\\cot^2\\theta_o }",
            "tag": "Image Plane",
            "appliesTo": "Observer screen",
            "assumptions": "Impact parameters xi, eta"
          },
          {
            "type": "formula",
            "name": "Relativistic Redshift",
            "tex": "g= \\frac{-k_\\mu u^\\mu_\\mathrm{obs}}{-k_\\mu u^\\mu_\\mathrm{emit}}",
            "tag": "Observable",
            "appliesTo": "Doppler + Gravitational",
            "assumptions": "General observer framing"
          }
        ]
      }
    ]
  },
  {
    "id": "bh_thermo",
    "title": "14. Black Hole Thermodynamics",
    "sections": [
      {
        "title": "Properties & Laws",
        "items": [
          {
            "type": "formula",
            "name": "Horizon Area (Kerr)",
            "tex": "A=4\\pi(r_+^2+a^2)",
            "tag": "Geometry",
            "appliesTo": "Outer horizon",
            "assumptions": "Stationary state"
          },
          {
            "type": "formula",
            "name": "Surface Gravity",
            "tex": "\\kappa= \\frac{c^2(r_+-r_-)}{2(r_+^2+a^2)}",
            "tag": "Geometry",
            "appliesTo": "Horizon acceleration",
            "assumptions": "Evaluated at r_+"
          },
          {
            "type": "text",
            "content": "STATUS: Hawking Radiation is a semiclassical theoretical prediction; not directly experimentally detected."
          },
          {
            "type": "formula",
            "name": "Bekenstein-Hawking Entropy",
            "tex": "S_{BH} = \\frac{k_Bc^3A}{4G\\hbar}",
            "tag": "Thermodynamics",
            "appliesTo": "Information paradox",
            "assumptions": "Holographic principle"
          },
          {
            "type": "formula",
            "name": "Horizon Angular Velocity",
            "tex": "\\Omega_H= \\frac{ac}{r_+^2+a^2}",
            "tag": "Kinematics",
            "appliesTo": "Co-rotating frames",
            "assumptions": "Rigid body-like rotation"
          },
          {
            "type": "formula",
            "name": "First Law of BH Mechanics",
            "tex": "d(Mc^2) = T_HdS+\\Omega_HdJ+\\Phi_HdQ",
            "tag": "Conservation",
            "appliesTo": "Perturbations",
            "assumptions": "Thermodynamic equivalence"
          }
        ]
      }
    ]
  },
  {
    "id": "accretion",
    "title": "15. Accretion Disks & Relativistic Astrophysics",
    "sections": [
      {
        "title": "Disk Physics",
        "items": [
          {
            "type": "formula",
            "name": "Mass Accretion Rate",
            "tex": "\\dot M = 4\\pi r^2\\rho v_r",
            "tag": "Flow",
            "appliesTo": "Spherical/Disk inflow",
            "assumptions": "Steady state"
          },
          {
            "type": "formula",
            "name": "Eddington Ratio",
            "tex": "\\lambda_{Edd} = \\frac{L}{L_{Edd}}",
            "tag": "Parameter",
            "appliesTo": "Accretion efficiency",
            "assumptions": "Observed vs Maximum"
          },
          {
            "type": "formula",
            "name": "Innermost Stable Circular Orbit (Kerr)",
            "tex": "r_\\mathrm{ISCO} = r_g \\left[ 3+Z_2 - s\\sqrt{(3-Z_1)(3+Z_1+2Z_2)} \\right]",
            "tag": "Boundary",
            "appliesTo": "Inner edge of accretion disk",
            "assumptions": "s=1 (prograde) or -1 (retrograde)"
          }
        ]
      },
      {
        "title": "Relativistic Ray Tracing Pipeline",
        "items": [
          {
            "type": "text",
            "content": "Simulation logic: metric $\\rightarrow$ geodesic $\\rightarrow$ redshift $g$ $\\rightarrow$ intensity $I_\\nu$ $\\rightarrow$ pixel."
          },
          {
            "type": "formula",
            "name": "Invariant Intensity (Liouville)",
            "tex": "I_{\\nu,\\mathrm{obs}} = g^3I_{\\nu,\\mathrm{emit}}",
            "tag": "Rendering",
            "appliesTo": "Ray tracing engines",
            "assumptions": "Photon number conservation"
          }
        ]
      }
    ]
  },
  {
    "id": "quasars_jets",
    "title": "16. Quasars, Relativistic Jets & High-Energy",
    "sections": [
      {
        "title": "Jet Kinematics & Mechanics",
        "items": [
          {
            "type": "formula",
            "name": "Doppler Factor",
            "tex": "\\delta= \\frac1{\\Gamma(1-\\beta\\cos\\theta)}",
            "tag": "Kinematics",
            "appliesTo": "Beamed emission",
            "assumptions": "Lorentz factor Gamma"
          },
          {
            "type": "formula",
            "name": "Apparent Superluminal Velocity",
            "tex": "\\beta_\\mathrm{app} = \\frac{\\beta\\sin\\theta}{1-\\beta\\cos\\theta}",
            "tag": "Kinematics",
            "appliesTo": "Jet observations",
            "assumptions": "Approaching flows"
          },
          {
            "type": "text",
            "content": "Blandford-Znajek represents a theoretical GRMHD model for jet launching, relying on magnetic fields threading the Kerr horizon to extract rotational energy."
          }
        ]
      },
      {
        "title": "Non-Thermal Emission",
        "items": [
          {
            "type": "formula",
            "name": "Synchrotron Characteristic Frequency",
            "tex": "\\nu_c = \\frac{3}{2}\\gamma^2 \\frac{eB\\sin\\alpha}{2\\pi m_e}",
            "tag": "Radiation",
            "appliesTo": "Relativistic electrons in B-field",
            "assumptions": "Ultra-relativistic regime"
          },
          {
            "type": "formula",
            "name": "Synchrotron Power",
            "tex": "P_\\mathrm{syn} = \\frac{4}{3} \\sigma_Tc \\gamma^2 \\beta^2 U_B",
            "tag": "Radiation",
            "appliesTo": "Radiative losses",
            "assumptions": "Isotropic pitch angles"
          },
          {
            "type": "formula",
            "name": "Inverse Compton Power",
            "tex": "P_\\mathrm{IC} = \\frac43\\sigma_Tc\\gamma^2\\beta^2U_\\mathrm{rad}",
            "tag": "Radiation",
            "appliesTo": "Photon upscattering",
            "assumptions": "Thomson regime limit"
          },
          {
            "type": "formula",
            "name": "Pair Production Threshold",
            "tex": "E_1E_2(1-\\cos\\theta) \\ge 2(m_ec^2)^2",
            "tag": "QED",
            "appliesTo": "Gamma-ray attenuation",
            "assumptions": "Photon-photon collision"
          },
          {
            "type": "formula",
            "name": "Optical Depth (Pair Prod)",
            "tex": "\\tau_{\\gamma\\gamma} = \\int n_\\gamma\\sigma_{\\gamma\\gamma}\\,ds",
            "tag": "Transport",
            "appliesTo": "Gamma-ray escape",
            "assumptions": "High-energy environments"
          }
        ]
      }
    ]
  },
  {
    "id": "gw",
    "title": "17. Gravitational Waves",
    "sections": [
      {
        "title": "Linearized Gravity & Wave Equations",
        "items": [
          {
            "type": "formula",
            "name": "Linearized Metric",
            "tex": "g_{\\mu\\nu} = \\eta_{\\mu\\nu} + h_{\\mu\\nu}",
            "tag": "Fundamentals",
            "appliesTo": "Weak field limit",
            "assumptions": "|h_{\\mu\\nu}| \\ll 1"
          },
          {
            "type": "formula",
            "name": "Trace-Reversed Perturbation",
            "tex": "\\bar{h}_{\\mu\\nu} = h_{\\mu\\nu} - \\frac{1}{2}\\eta_{\\mu\\nu}h",
            "tag": "Gauge Theory",
            "appliesTo": "Wave equation simplification",
            "assumptions": "Lorentz gauge / Harmonic gauge"
          },
          {
            "type": "formula",
            "name": "Linearized Einstein Field Equation",
            "tex": "\\square \\bar{h}_{\\mu\\nu} = -\\frac{16\\pi G}{c^4} T_{\\mu\\nu}",
            "tag": "Dynamics",
            "appliesTo": "GW Generation",
            "assumptions": "Weak field, harmonic gauge"
          },
          {
            "type": "formula",
            "name": "Vacuum Wave Equation",
            "tex": "\\square \\bar{h}_{\\mu\\nu} = \\left( -\\frac{1}{c^2}\\frac{\\partial^2}{\\partial t^2} + \\nabla^2 \\right) \\bar{h}_{\\mu\\nu} = 0",
            "tag": "Propagation",
            "appliesTo": "GWs in vacuum",
            "assumptions": "Source-free region (T_μν = 0)"
          },
          {
            "type": "formula",
            "name": "Plane Wave Solution",
            "tex": "h_{\\mu\\nu} = A_{\\mu\\nu} \\exp(ik_\\alpha x^\\alpha)",
            "tag": "Solutions",
            "appliesTo": "Far field propagation",
            "assumptions": "Vacuum, constant amplitude"
          }
        ]
      },
      {
        "title": "Waveforms & Binaries",
        "items": [
          {
            "type": "formula",
            "name": "Quadrupole Waveform",
            "tex": "h_{ij}^{TT} \\sim \\frac{2G}{c^4D} \\ddot Q_{ij}^{TT}",
            "tag": "Generation",
            "appliesTo": "Compact binaries",
            "assumptions": "Transverse-traceless gauge, far field"
          },
          {
            "type": "formula",
            "name": "Chirp Mass",
            "tex": "\\mathcal M = \\frac{(m_1m_2)^{3/5}}{(m_1+m_2)^{1/5}}",
            "tag": "Parameter",
            "appliesTo": "Inspiral phase",
            "assumptions": "Primary frequency driver"
          },
          {
            "type": "formula",
            "name": "Frequency Evolution",
            "tex": "\\dot f= \\frac{96}{5}\\pi^{8/3} \\left( \\frac{G\\mathcal M}{c^3} \\right)^{5/3} f^{11/3}",
            "tag": "Dynamics",
            "appliesTo": "Chirp signal",
            "assumptions": "Energy loss entirely to GWs"
          },
          {
            "type": "formula",
            "name": "Time to Coalescence",
            "tex": "\\tau = \\frac{5}{256} \\left( \\frac{G \\mathcal{M}}{c^3} \\right)^{-5/3} (\\pi f)^{-8/3}",
            "tag": "Dynamics",
            "appliesTo": "Inspiral phase",
            "assumptions": "Circular orbit, leading order PN"
          },
          {
            "type": "formula",
            "name": "Orbital Energy",
            "tex": "E=-\\frac{Gm_1m_2}{2a}",
            "tag": "Dynamics",
            "appliesTo": "Binary systems",
            "assumptions": "Newtonian approximation for orbits"
          },
          {
            "type": "formula",
            "name": "Inspiral Evolution",
            "tex": "\\frac{da}{dt} = -\\frac{64}{5} \\frac{G^3\\mu M^2}{c^5a^3}",
            "tag": "Dynamics",
            "appliesTo": "Orbital decay",
            "assumptions": "Circular orbits, leading order"
          }
        ]
      },
      {
        "title": "Energy, Power & Radiation",
        "items": [
          {
            "type": "formula",
            "name": "Quadrupole Luminosity (Power)",
            "tex": "P = \\frac{G}{5c^5} \\langle \\dddot{Q}_{ij} \\dddot{Q}^{ij} \\rangle",
            "tag": "Radiation",
            "appliesTo": "Radiated power",
            "assumptions": "Slow motion, weak field, averaged over wavelengths"
          },
          {
            "type": "formula",
            "name": "Isaacson Stress-Energy Tensor",
            "tex": "t_{\\mu\\nu}^{GW} = \\frac{c^4}{32\\pi G} \\langle \\partial_\\mu h_{ij}^{TT} \\partial_\\nu h^{ij}_{TT} \\rangle",
            "tag": "Energy",
            "appliesTo": "GW Energy density",
            "assumptions": "Short-wavelength approximation (Macroscopic average)"
          },
          {
            "type": "formula",
            "name": "Energy Flux",
            "tex": "\\mathcal{F} = \\frac{c^3}{16\\pi G} \\langle \\dot{h}_+^2 + \\dot{h}_\\times^2 \\rangle",
            "tag": "Measurement",
            "appliesTo": "Wave flux crossing a surface",
            "assumptions": "TT gauge, far field"
          }
        ]
      },
      {
        "title": "Detection & Polarization",
        "items": [
          {
            "type": "formula",
            "name": "GW Strain",
            "tex": "h(t) = \\frac{\\Delta L(t)}{L}",
            "tag": "Detection",
            "appliesTo": "Interferometers (LIGO/Virgo)",
            "assumptions": "L is much smaller than GW wavelength"
          },
          {
            "type": "formula",
            "name": "Detector Response",
            "tex": "h(t) = F_{+}(\\theta,\\phi,\\psi) h_{+}(t) + F_{\\times}(\\theta,\\phi,\\psi) h_{\\times}(t)",
            "tag": "Data Analysis",
            "appliesTo": "Interferometer signal",
            "assumptions": "F_+ and F_x are antenna pattern functions"
          },
          {
            "type": "formula",
            "name": "Polarization States",
            "tex": "h_{ij}^{TT} = h_+ e_{ij}^+ + h_\\times e_{ij}^\\times",
            "tag": "Properties",
            "appliesTo": "Transverse wave nature",
            "assumptions": "TT gauge, + and x basis tensors"
          },
          {
            "type": "formula",
            "name": "Stochastic Background",
            "tex": "\\Omega_{GW}(f) = \\frac{1}{\\rho_c} \\frac{d\\rho_{GW}}{d\\ln f}",
            "tag": "Cosmology",
            "appliesTo": "Primordial/Astrophysical background",
            "assumptions": "Isotropic, stationary, Gaussian"
          }
        ]
      }
    ]
  },
  {
    "id": "cosmology",
    "title": "18. Cosmology",
    "sections": [
      {
        "title": "Fundamentals & Kinematics",
        "items": [
          {
            "type": "formula",
            "name": "FLRW Metric",
            "tex": "ds^2 = -c^2dt^2 + a^2(t)\\left[\\frac{dr^2}{1-kr^2} + r^2(d\\theta^2 + \\sin^2\\theta d\\phi^2)\\right]",
            "tag": "Geometry",
            "appliesTo": "Homogeneous/Isotropic universe",
            "assumptions": "Cosmological principle"
          },
          {
            "type": "formula",
            "name": "Hubble Parameter",
            "tex": "H(t) = \\frac{\\dot{a}(t)}{a(t)}",
            "tag": "Kinematics",
            "appliesTo": "Expansion rate",
            "assumptions": "Time-dependent scale factor"
          },
          {
            "type": "formula",
            "name": "Cosmological Redshift",
            "tex": "1+z = \\frac{a(t_0)}{a(t_e)}",
            "tag": "Observation",
            "appliesTo": "Photon stretching",
            "assumptions": "Emitted at t_e, observed at t_0"
          },
          {
            "type": "formula",
            "name": "Hubble's Law",
            "tex": "v = H_0 d",
            "tag": "Observation",
            "appliesTo": "Low-redshift galaxies",
            "assumptions": "Proper distance, z << 1"
          }
        ]
      },
      {
        "title": "Expansion Dynamics",
        "items": [
          {
            "type": "formula",
            "name": "First Friedmann Equation",
            "tex": "H^2 = \\frac{8\\pi G}{3}\\rho - \\frac{kc^2}{a^2} + \\frac{\\Lambda c^2}{3}",
            "tag": "Dynamics",
            "appliesTo": "Universe expansion",
            "assumptions": "Derived from 00-component of Einstein Field Equations"
          },
          {
            "type": "formula",
            "name": "Second Friedmann (Acceleration)",
            "tex": "\\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3}\\left(\\rho + \\frac{3p}{c^2}\\right) + \\frac{\\Lambda c^2}{3}",
            "tag": "Dynamics",
            "appliesTo": "Acceleration of expansion",
            "assumptions": "Derived from spatial components of EFE"
          },
          {
            "type": "formula",
            "name": "Fluid (Continuity) Equation",
            "tex": "\\dot{\\rho} + 3H\\left(\\rho + \\frac{p}{c^2}\\right) = 0",
            "tag": "Thermodynamics",
            "appliesTo": "Energy conservation",
            "assumptions": "Adiabatic expansion"
          },
          {
            "type": "formula",
            "name": "Equation of State",
            "tex": "p = w\\rho c^2",
            "tag": "State",
            "appliesTo": "Cosmological fluids",
            "assumptions": "w is constant for a given fluid"
          },
          {
            "type": "formula",
            "name": "Density Scaling",
            "tex": "\\rho\\propto a^{-3(1+w)}",
            "tag": "Evolution",
            "appliesTo": "Matter (w=0), Rad (w=1/3), Vacuum (w=-1)",
            "assumptions": "Derived from continuity"
          },
          {
            "type": "formula",
            "name": "Critical Density",
            "tex": "\\rho_c = \\frac{3H^2}{8\\pi G}",
            "tag": "Parameters",
            "appliesTo": "Flat universe (k=0)",
            "assumptions": "Density required to halt expansion without Lambda"
          },
          {
            "type": "formula",
            "name": "Density Parameter",
            "tex": "\\Omega = \\frac{\\rho}{\\rho_c}",
            "tag": "Parameters",
            "appliesTo": "Cosmic components",
            "assumptions": "Dimensionless ratio"
          },
          {
            "type": "formula",
            "name": "General Friedmann Equation",
            "tex": "H^2= H_0^2 [ \\Omega_r(1+z)^4+ \\Omega_m(1+z)^3+ \\Omega_k(1+z)^2+ \\Omega_\\Lambda ]",
            "tag": "Dynamics",
            "appliesTo": "Expansion history",
            "assumptions": "Standard LCDM"
          }
        ]
      },
      {
        "title": "Cosmological Distances",
        "items": [
          {
            "type": "formula",
            "name": "Comoving Distance",
            "tex": "D_C= c\\int_0^z\\frac{dz'}{H(z')}",
            "tag": "Distance",
            "appliesTo": "Coordinate distance",
            "assumptions": "Expands with universe"
          },
          {
            "type": "formula",
            "name": "Lookback Time",
            "tex": "t_L= \\int_0^z \\frac{dz'}{(1+z')H(z')}",
            "tag": "Time",
            "appliesTo": "Age of observation",
            "assumptions": "Depends on cosmological parameters"
          },
          {
            "type": "formula",
            "name": "Luminosity Distance",
            "tex": "D_L=(1+z)D_M",
            "tag": "Distance",
            "appliesTo": "Standard candles",
            "assumptions": "Flux dilution (D_M is transverse comoving distance)"
          },
          {
            "type": "formula",
            "name": "Angular-Diameter Distance",
            "tex": "D_A=\\frac{D_M}{1+z}",
            "tag": "Distance",
            "appliesTo": "Standard rulers",
            "assumptions": "Apparent angular size"
          }
        ]
      },
      {
        "title": "Thermodynamics & CMB",
        "items": [
          {
            "type": "formula",
            "name": "CMB Temperature Scaling",
            "tex": "T(z) = T_0(1+z)",
            "tag": "Thermodynamics",
            "appliesTo": "Cosmic Microwave Background",
            "assumptions": "Adiabatic expansion, thermal equilibrium"
          },
          {
            "type": "formula",
            "name": "Radiation Energy Density",
            "tex": "\\rho_r c^2 = \\alpha T^4",
            "tag": "Thermodynamics",
            "appliesTo": "Radiation epoch",
            "assumptions": "Stefan-Boltzmann law analog"
          }
        ]
      }
    ]
  },
  {
    "id": "numerical",
    "title": "19. Mathematical & Numerical Methods",
    "sections": [
      {
        "title": "Differential Equations & Solvers",
        "items": [
          {
            "type": "formula",
            "name": "First-Order ODE",
            "tex": "\\frac{dy}{dx}=f(x,y)",
            "tag": "Math",
            "appliesTo": "Evolution equations",
            "assumptions": "Initial value problem"
          },
          {
            "type": "formula",
            "name": "Euler Method",
            "tex": "y_{n+1} = y_n + h f(x_n, y_n)",
            "tag": "Algorithm",
            "appliesTo": "Numerical integration",
            "assumptions": "1st order accuracy, small step size h"
          },
          {
            "type": "formula",
            "name": "Runge-Kutta 4 (RK4) Step",
            "tex": "y_{n+1} = y_n+\\frac h6(k_1+2k_2+2k_3+k_4)",
            "tag": "Algorithm",
            "appliesTo": "Numerical integration",
            "assumptions": "4th order accuracy"
          },
          {
            "type": "formula",
            "name": "Central Difference (2nd Derivative)",
            "tex": "f''(x) \\approx \\frac{f(x+h) - 2f(x) + f(x-h)}{h^2}",
            "tag": "Algorithm",
            "appliesTo": "Finite difference methods",
            "assumptions": "Discretized grid"
          }
        ]
      },
      {
        "title": "Simulation Core",
        "items": [
          {
            "type": "formula",
            "name": "Ray Integration System",
            "tex": "\\frac{dx^\\mu}{d\\lambda}=k^\\mu \\quad,\\quad \\frac{dk^\\mu}{d\\lambda} = -\\Gamma^\\mu_{\\alpha\\beta} k^\\alpha k^\\beta",
            "tag": "Algorithm",
            "appliesTo": "Geodesic renderers",
            "assumptions": "Coupled ODE system"
          },
          {
            "type": "formula",
            "name": "Courant-Friedrichs-Lewy (CFL) Condition",
            "tex": "C = \\frac{u \\Delta t}{\\Delta x} \\le 1",
            "tag": "Stability",
            "appliesTo": "PDE simulations",
            "assumptions": "Numerical domain of dependence must contain physical one"
          },
          {
            "type": "text",
            "content": "Simulation Verification: Every engine step must verify conservation tolerances for $\\Delta E$, $\\Delta L$, and the null condition $k_\\mu k^\\mu = 0$ for photons."
          }
        ]
      },
      {
        "title": "Analysis & Statistics",
        "items": [
          {
            "type": "formula",
            "name": "Newton-Raphson Method",
            "tex": "x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}",
            "tag": "Algorithm",
            "appliesTo": "Root finding",
            "assumptions": "f(x) is differentiable, initial guess is close"
          },
          {
            "type": "formula",
            "name": "Chi-Square Statistic",
            "tex": "\\chi^2 = \\sum_{i} \\frac{(O_i - E_i)^2}{\\sigma_i^2}",
            "tag": "Statistics",
            "appliesTo": "Model fitting (e.g., cosmological parameters)",
            "assumptions": "Gaussian errors"
          }
        ]
      }
    ]
  },
  {
    "id": "validation",
    "title": "20. Physical Constants, Units & Validation",
    "sections": [
      {
        "title": "Natural & Planck Units",
        "items": [
          {
            "type": "formula",
            "name": "Planck Length",
            "tex": "l_P = \\sqrt{\\frac{\\hbar G}{c^3}}",
            "tag": "Constant",
            "appliesTo": "Quantum gravity scale",
            "assumptions": "~ 1.616 x 10^-35 m"
          },
          {
            "type": "formula",
            "name": "Planck Time",
            "tex": "t_P = \\sqrt{\\frac{\\hbar G}{c^5}}",
            "tag": "Constant",
            "appliesTo": "Earliest cosmological epoch",
            "assumptions": "~ 5.39 x 10^-44 s"
          },
          {
            "type": "formula",
            "name": "Planck Mass",
            "tex": "m_P = \\sqrt{\\frac{\\hbar c}{G}}",
            "tag": "Constant",
            "appliesTo": "Fundamental mass scale",
            "assumptions": "~ 2.176 x 10^-8 kg"
          }
        ]
      },
      {
        "title": "Geometrized Units",
        "items": [
          {
            "type": "formula",
            "name": "Geometrized Mass",
            "tex": "M_{geom} = \\frac{GM}{c^2}",
            "tag": "Conversion",
            "appliesTo": "GR Calculations",
            "assumptions": "Converts kg to meters"
          },
          {
            "type": "formula",
            "name": "Geometrized Time",
            "tex": "t_{geom} = c t",
            "tag": "Conversion",
            "appliesTo": "GR Calculations",
            "assumptions": "Converts seconds to meters"
          },
          {
            "type": "text",
            "content": "Geometrized units ($G=c=1$) are utilized for internal GR calculations, but must explicitly transform back to SI/cgs for observable outputs."
          }
        ]
      },
      {
        "title": "Framework Standards",
        "items": [
          {
            "type": "text",
            "content": "Base Constants: $G, c, \\hbar, k_B, e, m_e, m_p, M_\\odot, R_\\odot$"
          },
          {
            "type": "formula",
            "name": "Dimensional Analysis Requirement",
            "tex": "[\\mathrm{LHS}] = [\\mathrm{RHS}]",
            "tag": "Validation",
            "appliesTo": "All formulated equations",
            "assumptions": "Engine strict typing"
          },
          {
            "type": "text",
            "content": "Every formula in this database carries physical validity markers: EXACT, DERIVED, EXPERIMENTALLY VERIFIED, APPROXIMATION, SEMICLASSICAL, EMPIRICAL, MODEL-DEPENDENT, or MATHEMATICAL ONLY."
          }
        ]
      }
    ]
  },
  {
    "id": "basic_physics",
    "title": "21. Mechanics & Fundamentals",
    "sections": [
      {
        "title": "Units, Dimensions & Errors",
        "items": [
          {
            "type": "formula",
            "name": "Percentage error",
            "tex": "\\text{Percentage error} = \\frac{\\Delta Q}{Q} \\times 100",
            "tag": "Error Analysis",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Error Propagation (Power)",
            "tex": "\\frac{\\Delta Z}{Z} = a\\frac{\\Delta A}{A} + b\\frac{\\Delta B}{B}",
            "tag": "Error Analysis",
            "appliesTo": "For Z = A^a B^b",
            "assumptions": "Independent random errors"
          },
          {
            "type": "formula",
            "name": "Dimensional formula general",
            "tex": "[Q] = M^a L^b T^c",
            "tag": "Dimensions",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Dimensions: Force",
            "tex": "[F] = M L T^{-2}",
            "tag": "Dimensions",
            "appliesTo": "Mechanics",
            "assumptions": "Newtonian mechanics"
          },
          {
            "type": "formula",
            "name": "Dimensions: Energy",
            "tex": "[E] = M L^2 T^{-2}",
            "tag": "Dimensions",
            "appliesTo": "Thermodynamics & Mechanics",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Dimensions: Gravitational Constant",
            "tex": "[G] = M^{-1} L^3 T^{-2}",
            "tag": "Dimensions",
            "appliesTo": "Gravitation",
            "assumptions": "Derived from Newton's Law"
          }
        ]
      },
      {
        "title": "Kinematics (1D, 2D & Circular)",
        "items": [
          {
            "type": "formula",
            "name": "Average velocity",
            "tex": "v_{\\text{avg}} = \\frac{\\Delta x}{\\Delta t}",
            "tag": "Motion",
            "appliesTo": "1D Kinematics",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Instantaneous acceleration",
            "tex": "a = \\frac{dv}{dt} = \\frac{d^2x}{dt^2}",
            "tag": "Motion",
            "appliesTo": "1D Kinematics",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "First equation of motion",
            "tex": "v = u + at",
            "tag": "Motion",
            "appliesTo": "Constant acceleration",
            "assumptions": "Linear motion"
          },
          {
            "type": "formula",
            "name": "Second equation of motion",
            "tex": "s = ut + \\frac{1}{2}at^2",
            "tag": "Motion",
            "appliesTo": "Constant acceleration",
            "assumptions": "Linear motion"
          },
          {
            "type": "formula",
            "name": "Third equation of motion",
            "tex": "v^2 = u^2 + 2as",
            "tag": "Motion",
            "appliesTo": "Constant acceleration",
            "assumptions": "Linear motion"
          },
          {
            "type": "formula",
            "name": "Projectile trajectory",
            "tex": "y = x \\tan\\theta - \\frac{gx^2}{2u^2 \\cos^2\\theta}",
            "tag": "2D Motion",
            "appliesTo": "Projectile motion",
            "assumptions": "No air resistance"
          },
          {
            "type": "formula",
            "name": "Time of flight",
            "tex": "T = \\frac{2u \\sin\\theta}{g}",
            "tag": "2D Motion",
            "appliesTo": "Projectile motion",
            "assumptions": "Launch and land at same height"
          },
          {
            "type": "formula",
            "name": "Maximum height",
            "tex": "H = \\frac{u^2 \\sin^2\\theta}{2g}",
            "tag": "2D Motion",
            "appliesTo": "Projectile motion",
            "assumptions": "Launch and land at same height"
          },
          {
            "type": "formula",
            "name": "Horizontal range",
            "tex": "R = \\frac{u^2 \\sin 2\\theta}{g}",
            "tag": "2D Motion",
            "appliesTo": "Projectile motion",
            "assumptions": "Launch and land at same height"
          },
          {
            "type": "formula",
            "name": "Centripetal Acceleration",
            "tex": "a_c = \\frac{v^2}{r} = \\omega^2 r",
            "tag": "Circular Motion",
            "appliesTo": "Uniform circular motion",
            "assumptions": "Constant speed"
          },
          {
            "type": "formula",
            "name": "Angular Velocity",
            "tex": "\\omega = \\frac{d\\theta}{dt} = \\frac{v}{r}",
            "tag": "Circular Motion",
            "appliesTo": "Rotational kinematics",
            "assumptions": "Rigid body or particle"
          }
        ]
      },
      {
        "title": "Dynamics, Work & Energy",
        "items": [
          {
            "type": "formula",
            "name": "Newton's Second Law",
            "tex": "\\vec{F}_{net} = \\frac{d\\vec{p}}{dt} = m\\vec{a}",
            "tag": "Dynamics",
            "appliesTo": "Translational motion",
            "assumptions": "Constant mass"
          },
          {
            "type": "formula",
            "name": "Kinetic Friction",
            "tex": "f_k = \\mu_k N",
            "tag": "Dynamics",
            "appliesTo": "Surfaces in contact",
            "assumptions": "Relative motion exists"
          },
          {
            "type": "formula",
            "name": "Work Done",
            "tex": "W = \\int \\vec{F} \\cdot d\\vec{r} = F d \\cos\\theta",
            "tag": "Energy",
            "appliesTo": "Forces acting over distance",
            "assumptions": "Constant force for basic form"
          },
          {
            "type": "formula",
            "name": "Kinetic Energy",
            "tex": "K = \\frac{1}{2}mv^2 = \\frac{p^2}{2m}",
            "tag": "Energy",
            "appliesTo": "Moving bodies",
            "assumptions": "Non-relativistic"
          },
          {
            "type": "formula",
            "name": "Work-Energy Theorem",
            "tex": "W_{net} = \\Delta K",
            "tag": "Energy",
            "appliesTo": "All systems",
            "assumptions": "Valid for conservative and non-conservative forces"
          },
          {
            "type": "formula",
            "name": "Power",
            "tex": "P = \\frac{dW}{dt} = \\vec{F} \\cdot \\vec{v}",
            "tag": "Energy",
            "appliesTo": "Rate of energy transfer",
            "assumptions": "Instantaneous power"
          }
        ]
      },
      {
        "title": "Rotational Mechanics & Gravitation",
        "items": [
          {
            "type": "formula",
            "name": "Torque",
            "tex": "\\vec{\\tau} = \\vec{r} \\times \\vec{F} = I\\vec{\\alpha}",
            "tag": "Rotation",
            "appliesTo": "Rigid bodies",
            "assumptions": "Rotation about a fixed axis"
          },
          {
            "type": "formula",
            "name": "Angular Momentum",
            "tex": "\\vec{L} = \\vec{r} \\times \\vec{p} = I\\vec{\\omega}",
            "tag": "Rotation",
            "appliesTo": "Particles and rigid bodies",
            "assumptions": "Symmetric rigid body"
          },
          {
            "type": "formula",
            "name": "Rotational Kinetic Energy",
            "tex": "K_{rot} = \\frac{1}{2}I\\omega^2",
            "tag": "Rotation",
            "appliesTo": "Rotating bodies",
            "assumptions": "Fixed axis"
          },
          {
            "type": "formula",
            "name": "Newton's Law of Gravitation",
            "tex": "F_g = \\frac{G m_1 m_2}{r^2}",
            "tag": "Gravitation",
            "appliesTo": "Point masses / spherical bodies",
            "assumptions": "Classical gravity"
          },
          {
            "type": "formula",
            "name": "Acceleration Due to Gravity",
            "tex": "g = \\frac{GM}{R^2}",
            "tag": "Gravitation",
            "appliesTo": "Surface of a planet",
            "assumptions": "Spherical mass distribution"
          },
          {
            "type": "formula",
            "name": "Escape Velocity",
            "tex": "v_e = \\sqrt{\\frac{2GM}{R}}",
            "tag": "Gravitation",
            "appliesTo": "Planetary bodies",
            "assumptions": "Projectile unpowered after launch"
          },
          {
            "type": "formula",
            "name": "Orbital Velocity",
            "tex": "v_o = \\sqrt{\\frac{GM}{r}}",
            "tag": "Gravitation",
            "appliesTo": "Satellites",
            "assumptions": "Circular orbit"
          },
          {
            "type": "formula",
            "name": "Kepler's Third Law",
            "tex": "T^2 = \\frac{4\\pi^2}{GM} a^3",
            "tag": "Gravitation",
            "appliesTo": "Planetary orbits",
            "assumptions": "Elliptical or circular orbits"
          }
        ]
      },
      {
        "title": "Properties of Matter & Fluids",
        "items": [
          {
            "type": "formula",
            "name": "Young's modulus",
            "tex": "Y = \\frac{FL}{A\\Delta L}",
            "tag": "Elasticity",
            "appliesTo": "Solids",
            "assumptions": "Linear elastic limit (Hooke's Law)"
          },
          {
            "type": "formula",
            "name": "Bulk modulus",
            "tex": "K = -\\frac{\\Delta P}{\\Delta V / V}",
            "tag": "Elasticity",
            "appliesTo": "Fluids and solids",
            "assumptions": "Uniform pressure change"
          },
          {
            "type": "formula",
            "name": "Shear modulus",
            "tex": "G = \\frac{\\text{shear stress}}{\\text{shear strain}}",
            "tag": "Elasticity",
            "appliesTo": "Solids",
            "assumptions": "Small deformations"
          },
          {
            "type": "formula",
            "name": "Hydrostatic pressure",
            "tex": "P = P_0 + \\rho gh",
            "tag": "Fluid Statics",
            "appliesTo": "Incompressible fluids",
            "assumptions": "Constant density"
          },
          {
            "type": "formula",
            "name": "Buoyant force",
            "tex": "F_B = \\rho_f V_{sub} g",
            "tag": "Fluid Statics",
            "appliesTo": "Submerged objects",
            "assumptions": "Archimedes' principle"
          },
          {
            "type": "formula",
            "name": "Equation of Continuity",
            "tex": "A_1 v_1 = A_2 v_2",
            "tag": "Fluid Dynamics",
            "appliesTo": "Pipe flow",
            "assumptions": "Incompressible, steady flow"
          },
          {
            "type": "formula",
            "name": "Bernoulli's Equation",
            "tex": "P + \\frac{1}{2}\\rho v^2 + \\rho gh = \\text{constant}",
            "tag": "Fluid Dynamics",
            "appliesTo": "Streamlines",
            "assumptions": "Inviscid, incompressible, steady flow"
          },
          {
            "type": "formula",
            "name": "Stokes' law",
            "tex": "F_v = 6\\pi\\eta rv",
            "tag": "Fluid Dynamics",
            "appliesTo": "Spherical objects in fluid",
            "assumptions": "Laminar flow, low Reynolds number"
          },
          {
            "type": "formula",
            "name": "Terminal velocity",
            "tex": "v_t = \\frac{2r^2(\\rho_s - \\rho_f)g}{9\\eta}",
            "tag": "Fluid Dynamics",
            "appliesTo": "Falling spheres",
            "assumptions": "Reaches equilibrium"
          },
          {
            "type": "formula",
            "name": "Capillary Rise",
            "tex": "h = \\frac{2T \\cos\\theta}{\\rho g r}",
            "tag": "Surface Tension",
            "appliesTo": "Capillary tubes",
            "assumptions": "Narrow tube"
          }
        ]
      }
    ]
  },
  {
    "id": "electromagnetism_optics",
    "title": "22. Electromagnetism & Optics Extension",
    "sections": [
      {
        "title": "Electrostatics & Capacitors",
        "items": [
          {
            "type": "formula",
            "name": "Coulomb's law",
            "tex": "F = \\frac{1}{4\\pi\\epsilon_0}\\frac{q_1q_2}{r^2}",
            "tag": "Electrostatics",
            "appliesTo": "Point charges",
            "assumptions": "Charges at rest in vacuum"
          },
          {
            "type": "formula",
            "name": "Electric Field",
            "tex": "\\vec{E} = \\frac{\\vec{F}}{q_0}",
            "tag": "Electrostatics",
            "appliesTo": "Electric fields",
            "assumptions": "Test charge q0 is negligibly small"
          },
          {
            "type": "formula",
            "name": "Gauss's Law",
            "tex": "\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{\\text{enc}}}{\\epsilon_0}",
            "tag": "Electrostatics",
            "appliesTo": "Closed surfaces",
            "assumptions": "Useful for symmetric charge distributions"
          },
          {
            "type": "formula",
            "name": "Electric Potential",
            "tex": "V = \\frac{1}{4\\pi\\epsilon_0}\\frac{q}{r}",
            "tag": "Electrostatics",
            "appliesTo": "Point charges",
            "assumptions": "V=0 at infinity"
          },
          {
            "type": "formula",
            "name": "Electric dipole moment",
            "tex": "\\vec{p} = q\\vec{d}",
            "tag": "Electrostatics",
            "appliesTo": "Dipoles",
            "assumptions": "Vector points from -q to +q"
          },
          {
            "type": "formula",
            "name": "Capacitance definition",
            "tex": "C = \\frac{Q}{V}",
            "tag": "Capacitors",
            "appliesTo": "All capacitors",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Parallel plate capacitance",
            "tex": "C = \\frac{\\epsilon_0 A}{d}",
            "tag": "Capacitors",
            "appliesTo": "Parallel plates",
            "assumptions": "Vacuum/Air between plates, d << sqrt(A)"
          },
          {
            "type": "formula",
            "name": "Energy in a Capacitor",
            "tex": "U = \\frac{1}{2}CV^2 = \\frac{Q^2}{2C}",
            "tag": "Capacitors",
            "appliesTo": "Energy storage",
            "assumptions": "Ideal capacitor"
          }
        ]
      },
      {
        "title": "Current Electricity",
        "items": [
          {
            "type": "formula",
            "name": "Current & Drift Velocity",
            "tex": "I = n e A v_d",
            "tag": "Current",
            "appliesTo": "Conductors",
            "assumptions": "Free electron model"
          },
          {
            "type": "formula",
            "name": "Ohm's law",
            "tex": "V = IR",
            "tag": "Current",
            "appliesTo": "Ohmic conductors",
            "assumptions": "Constant temperature"
          },
          {
            "type": "formula",
            "name": "Resistance & Resistivity",
            "tex": "R = \\rho \\frac{L}{A}, \\quad \\sigma = \\frac{1}{\\rho}",
            "tag": "Current",
            "appliesTo": "Uniform wires",
            "assumptions": "Isotropic material"
          },
          {
            "type": "formula",
            "name": "Electrical Power",
            "tex": "P = VI = I^2R = \\frac{V^2}{R}",
            "tag": "Current",
            "appliesTo": "Circuits",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Kirchhoff's Current Law (KCL)",
            "tex": "\\sum I_{\\text{in}} = \\sum I_{\\text{out}}",
            "tag": "Circuits",
            "appliesTo": "Circuit nodes",
            "assumptions": "Conservation of charge"
          },
          {
            "type": "formula",
            "name": "Kirchhoff's Voltage Law (KVL)",
            "tex": "\\sum \\Delta V = 0",
            "tag": "Circuits",
            "appliesTo": "Closed loops",
            "assumptions": "Conservation of energy"
          },
          {
            "type": "formula",
            "name": "Wheatstone bridge",
            "tex": "\\frac{P}{Q} = \\frac{R}{S}",
            "tag": "Circuits",
            "appliesTo": "Balanced bridge",
            "assumptions": "No current through galvanometer"
          }
        ]
      },
      {
        "title": "Magnetism, Induction & AC",
        "items": [
          {
            "type": "formula",
            "name": "Lorentz force",
            "tex": "\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B})",
            "tag": "Magnetism",
            "appliesTo": "Moving charges",
            "assumptions": "Point charge"
          },
          {
            "type": "formula",
            "name": "Magnetic Force on Wire",
            "tex": "\\vec{F} = I\\vec{L} \\times \\vec{B}",
            "tag": "Magnetism",
            "appliesTo": "Current-carrying conductors",
            "assumptions": "Uniform magnetic field"
          },
          {
            "type": "formula",
            "name": "Biot-Savart law",
            "tex": "d\\vec{B} = \\frac{\\mu_0}{4\\pi}\\frac{I d\\vec{l} \\times \\hat{r}}{r^2}",
            "tag": "Magnetism",
            "appliesTo": "Magnetic field generation",
            "assumptions": "Steady current"
          },
          {
            "type": "formula",
            "name": "Ampere's law",
            "tex": "\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_{\\text{enc}}",
            "tag": "Magnetism",
            "appliesTo": "Amperian loops",
            "assumptions": "High symmetry setups"
          },
          {
            "type": "formula",
            "name": "Cyclotron radius and frequency",
            "tex": "r = \\frac{mv}{qB}, \\quad f = \\frac{qB}{2\\pi m}",
            "tag": "Magnetism",
            "appliesTo": "Charged particles in uniform B",
            "assumptions": "Velocity perpendicular to B"
          },
          {
            "type": "formula",
            "name": "Faraday's Law of Induction",
            "tex": "\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}",
            "tag": "Induction",
            "appliesTo": "Loops and coils",
            "assumptions": "Lenz's Law gives the negative sign"
          },
          {
            "type": "formula",
            "name": "Motional EMF",
            "tex": "\\mathcal{E} = Blv",
            "tag": "Induction",
            "appliesTo": "Moving conductors",
            "assumptions": "B, l, v are mutually perpendicular"
          },
          {
            "type": "formula",
            "name": "AC RMS Values",
            "tex": "V_{\\text{rms}} = \\frac{V_0}{\\sqrt{2}}, \\quad I_{\\text{rms}} = \\frac{I_0}{\\sqrt{2}}",
            "tag": "AC Circuits",
            "appliesTo": "Sinusoidal AC",
            "assumptions": "V0 and I0 are peak values"
          },
          {
            "type": "formula",
            "name": "Impedance (Series RLC)",
            "tex": "Z = \\sqrt{R^2 + (X_L - X_C)^2}",
            "tag": "AC Circuits",
            "appliesTo": "AC components",
            "assumptions": "X_L = wL, X_C = 1/(wC)"
          },
          {
            "type": "formula",
            "name": "Resonance Frequency",
            "tex": "f_r = \\frac{1}{2\\pi\\sqrt{LC}}",
            "tag": "AC Circuits",
            "appliesTo": "LC/RLC Circuits",
            "assumptions": "X_L = X_C"
          },
          {
            "type": "formula",
            "name": "Transformer Equation",
            "tex": "\\frac{V_s}{V_p} = \\frac{N_s}{N_p} = \\frac{I_p}{I_s}",
            "tag": "AC Circuits",
            "appliesTo": "Ideal transformers",
            "assumptions": "100% efficiency"
          }
        ]
      },
      {
        "title": "Optics & Waves",
        "items": [
          {
            "type": "formula",
            "name": "Wave Equation",
            "tex": "v = f\\lambda",
            "tag": "Waves",
            "appliesTo": "All waves",
            "assumptions": "Constant medium"
          },
          {
            "type": "formula",
            "name": "Snell's law",
            "tex": "\\frac{\\sin\\theta_1}{\\sin\\theta_2} = \\frac{v_1}{v_2} = \\frac{n_2}{n_1}",
            "tag": "Ray Optics",
            "appliesTo": "Refraction",
            "assumptions": "Isotropic media"
          },
          {
            "type": "formula",
            "name": "Lens equation",
            "tex": "\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}",
            "tag": "Ray Optics",
            "appliesTo": "Thin lenses",
            "assumptions": "Paraxial rays"
          },
          {
            "type": "formula",
            "name": "Lens maker's formula",
            "tex": "\\frac{1}{f} = (n - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)",
            "tag": "Ray Optics",
            "appliesTo": "Lens manufacturing",
            "assumptions": "Thin lens in air"
          },
          {
            "type": "formula",
            "name": "Mirror equation",
            "tex": "\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}",
            "tag": "Ray Optics",
            "appliesTo": "Spherical mirrors",
            "assumptions": "Paraxial rays"
          },
          {
            "type": "formula",
            "name": "Magnification (Lens & Mirror)",
            "tex": "m = \\frac{h_i}{h_o} = \\frac{v}{u} \\text{ (Lens)} = -\\frac{v}{u} \\text{ (Mirror)}",
            "tag": "Ray Optics",
            "appliesTo": "Imaging",
            "assumptions": "Standard sign convention"
          },
          {
            "type": "formula",
            "name": "YDSE fringe width",
            "tex": "\\beta = \\frac{\\lambda D}{d}",
            "tag": "Wave Optics",
            "appliesTo": "Young's Double Slit",
            "assumptions": "D >> d"
          },
          {
            "type": "formula",
            "name": "Single Slit Diffraction (Minima)",
            "tex": "a \\sin\\theta = n\\lambda",
            "tag": "Wave Optics",
            "appliesTo": "Fraunhofer diffraction",
            "assumptions": "n is a non-zero integer"
          },
          {
            "type": "formula",
            "name": "Brewster's angle",
            "tex": "\\theta_B = \\arctan\\left(\\frac{n_2}{n_1}\\right)",
            "tag": "Wave Optics",
            "appliesTo": "Polarization by reflection",
            "assumptions": "Reflected light is 100% polarized"
          },
          {
            "type": "formula",
            "name": "Malus's Law",
            "tex": "I = I_0 \\cos^2\\theta",
            "tag": "Wave Optics",
            "appliesTo": "Polarizers",
            "assumptions": "Ideal polarizers"
          },
          {
            "type": "formula",
            "name": "Doppler effect (Sound)",
            "tex": "f' = f \\left(\\frac{v \\pm v_o}{v \\mp v_s}\\right)",
            "tag": "Waves",
            "appliesTo": "Moving source/observer",
            "assumptions": "Velocities relative to medium"
          }
        ]
      }
    ]
  },
  {
    "id": "thermo_modern",
    "title": "23. Thermodynamics & Modern Physics Extension",
    "sections": [
      {
        "title": "Thermodynamics",
        "items": [
          {
            "type": "formula",
            "name": "Ideal Gas Law",
            "tex": "PV = nRT",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Ideal gas approximation"
          },
          {
            "type": "formula",
            "name": "Efficiency",
            "tex": "\\eta = \\frac{W}{Q_H}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Carnot efficiency",
            "tex": "\\eta = 1 - \\frac{T_C}{T_H}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "RMS speed",
            "tex": "v_{\\text{rms}} = \\sqrt{\\frac{3k_BT}{m}} = \\sqrt{\\frac{3RT}{M}}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Maxwell-Boltzmann distribution",
            "tex": "f(v) = 4\\pi\\left(\\frac{m}{2\\pi k_BT}\\right)^{3/2}v^2 e^{-mv^2/2k_BT}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          }
        ]
      },
      {
        "title": "Modern Physics",
        "items": [
          {
            "type": "formula",
            "name": "Einstein photoelectric equation",
            "tex": "K_{\\max} = h\\nu - \\phi = eV_s",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Bohr angular momentum quantisation",
            "tex": "mvr = \\frac{nh}{2\\pi}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Hydrogen energy level",
            "tex": "E_n = -\\frac{13.6}{n^2} \\text{ eV}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Mass defect",
            "tex": "\\Delta m = Zm_p + (A - Z)m_n - m_{\\text{nucleus}}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Radioactive decay law",
            "tex": "N = N_0 e^{-\\lambda t}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Half-life and mean life",
            "tex": "T_{1/2} = \\frac{\\ln 2}{\\lambda}, \\quad \\tau = \\frac{1}{\\lambda}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          }
        ]
      }
    ]
  },
  {
    "id": "mathematics",
    "title": "24. Mathematics & Statistics",
    "sections": [
      {
        "title": "Algebra & Trigonometry",
        "items": [
          {
            "type": "formula",
            "name": "Quadratic formula",
            "tex": "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Euler identity",
            "tex": "e^{i\\theta} = \\cos\\theta + i\\sin\\theta",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "De Moivre's theorem",
            "tex": "(\\cos\\theta + i\\sin\\theta)^n = \\cos n\\theta + i\\sin n\\theta",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Fundamental identities",
            "tex": "\\sin^2x + \\cos^2x = 1, \\quad 1 + \\tan^2x = \\sec^2x, \\quad 1 + \\cot^2x = \\csc^2x",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Sine sum/diff",
            "tex": "\\sin(A \\pm B) = \\sin A \\cos B \\pm \\cos A \\sin B",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Cosine sum/diff",
            "tex": "\\cos(A \\pm B) = \\cos A \\cos B \\mp \\sin A \\sin B",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          }
        ]
      },
      {
        "title": "Calculus",
        "items": [
          {
            "type": "formula",
            "name": "Derivative definition",
            "tex": "f'(x) = \\lim_{h\\to 0}\\frac{f(x + h) - f(x)}{h}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Product rule",
            "tex": "(uv)' = u'v + uv'",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Quotient rule",
            "tex": "\\left(\\frac{u}{v}\\right)' = \\frac{vu' - uv'}{v^2}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Chain rule",
            "tex": "\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Integration by parts",
            "tex": "\\int u dv = uv - \\int v du",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Fundamental theorem of calculus",
            "tex": "\\int_a^b f(x) dx = F(b) - F(a)",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          }
        ]
      },
      {
        "title": "Vector Calculus & Differential Equations",
        "items": [
          {
            "type": "formula",
            "name": "Gradient",
            "tex": "\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z}\\right)",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Divergence",
            "tex": "\\nabla \\cdot \\vec{F} = \\frac{\\partial F_x}{\\partial x} + \\frac{\\partial F_y}{\\partial y} + \\frac{\\partial F_z}{\\partial z}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Laplacian",
            "tex": "\\nabla^2 f = \\frac{\\partial^2 f}{\\partial x^2} + \\frac{\\partial^2 f}{\\partial y^2} + \\frac{\\partial^2 f}{\\partial z^2}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "First-order linear ODE",
            "tex": "\\frac{dy}{dx} + Py = Q, \\quad IF = e^{\\int P dx}, \\quad y(IF) = \\int Q(IF)dx + C",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Laplace transform",
            "tex": "\\mathcal{L}\\{f(t)\\} = F(s) = \\int_0^\\infty e^{-st}f(t) dt",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          }
        ]
      },
      {
        "title": "Statistics & Probability",
        "items": [
          {
            "type": "formula",
            "name": "Mean",
            "tex": "\\bar{x} = \\frac{\\sum x_i}{n}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Variance and standard deviation",
            "tex": "\\sigma^2 = \\frac{1}{N}\\sum(x_i - \\bar{x})^2, \\quad \\sigma = \\sqrt{\\sigma^2}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Conditional probability",
            "tex": "P(A|B) = \\frac{P(A \\cap B)}{P(B)}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Binomial probability",
            "tex": "P(X = k) = {}^nC_k p^k (1 - p)^{n-k}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Normal distribution",
            "tex": "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          }
        ]
      }
    ]
  },
  {
    "id": "chemistry",
    "title": "25. Chemistry Fundamentals",
    "sections": [
      {
        "title": "Physical Chemistry",
        "items": [
          {
            "type": "formula",
            "name": "Mole Concept",
            "tex": "n = \\frac{m}{M} = \\frac{N}{N_A} = \\frac{V}{22.4L}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Concentration in Molarity",
            "tex": "M = \\frac{n_{\\text{solute}}}{V_{\\text{solution}} \\text{ (in L)}}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Raoult's Law",
            "tex": "P_A = P_A^\\circ \\chi_A",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Gibbs-Helmholtz Equation",
            "tex": "\\left[ \\frac{\\partial (\\Delta G/T)}{\\partial T} \\right]_P = -\\frac{\\Delta H}{T^2}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Nernst Equation",
            "tex": "E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{RT}{nF} \\ln Q",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "First-Order Reaction (Integrated Rate)",
            "tex": "\\ln[A]_t = \\ln[A]_0 - kt \\implies k = \\frac{2.303}{t} \\log\\frac{[A]_0}{[A]_t}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Arrhenius equation (ln)",
            "tex": "\\ln k=\\ln A-\\frac{E_a}{RT}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          }
        ]
      },
      {
        "title": "Inorganic & Equilibrium",
        "items": [
          {
            "type": "formula",
            "name": "pH and pOH",
            "tex": "\\text{pH} = -\\log[H^+], \\quad \\text{pOH} = -\\log[OH^-]",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Henderson-Hasselbalch Equation",
            "tex": "\\text{pH} = \\text{pK}_a + \\log\\frac{[\\text{Salt}]}{[\\text{Acid}]}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Effective Atomic Number (EAN)",
            "tex": "\\text{EAN} = Z - \\text{Oxidation State} + 2 \\times (\\text{Coordination Number})",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Crystal Field Stabilization Energy (CFSE)",
            "tex": "\\text{CFSE} = (-0.4 n_{t_{2g}} + 0.6 n_{e_g})\\Delta_o + P",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          }
        ]
      }
    ]
  },
  {
    "id": "biology",
    "title": "26. Biology & Population Dynamics",
    "sections": [
      {
        "title": "Genetics & Molecular",
        "items": [
          {
            "type": "formula",
            "name": "Michaelis-Menten kinetics",
            "tex": "v=\\frac{V_{\\max}[S]}{K_m+[S]}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "DNA molecular mass",
            "tex": "M_{\\rm DNA}\\approx660N_{\\rm bp}\\ \\text{g/mol}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Chargaff's rules 1",
            "tex": "A=T",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Hardy-Weinberg allele frequencies",
            "tex": "p+q=1",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Hardy-Weinberg genotype frequencies",
            "tex": "p^2+2pq+q^2=1",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Recombination frequency",
            "tex": "RF=\\frac{\\text{recombinant offspring}}{\\text{total offspring}}\\times100",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          }
        ]
      },
      {
        "title": "Ecology & Epidemiology",
        "items": [
          {
            "type": "formula",
            "name": "Exponential growth equation",
            "tex": "N_t=N_0e^{rt}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Logistic population growth rate",
            "tex": "\\frac{dN}{dt}=rN\\left(1-\\frac NK\\right)",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "SIR model (Susceptible)",
            "tex": "\\frac{dS}{dt}=-\\beta\\frac{SI}{N}",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Basic reproduction number",
            "tex": "R_0=\\beta cD",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Lotka-Volterra competition 1",
            "tex": "\\frac{dN_1}{dt}=r_1N_1\\left(1-\\frac{N_1+\\alpha N_2}{K_1}\\right)",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          },
          {
            "type": "formula",
            "name": "Predator-prey equation 1",
            "tex": "\\frac{dN}{dt}=rN-aNP",
            "tag": "General",
            "appliesTo": "General applications",
            "assumptions": "Standard conditions"
          }
        ]
      }
    ]
  },
  {
    "id": "condensed_matter",
    "title": "27. Solid State & Condensed Matter",
    "sections": [
      {
        "title": "Crystallography & Band Theory",
        "items": [
          {
            "type": "formula",
            "name": "Bragg's Law",
            "tex": "n\\lambda = 2d\\sin\\theta",
            "tag": "Scattering",
            "appliesTo": "Crystal lattices",
            "assumptions": "Elastic scattering"
          },
          {
            "type": "formula",
            "name": "Hall Coefficient",
            "tex": "R_H = -\\frac{1}{ne}",
            "tag": "Electromagnetism",
            "appliesTo": "Semiconductors and Metals",
            "assumptions": "Single charge carrier type"
          },
          {
            "type": "formula",
            "name": "Bloch's Theorem",
            "tex": "\\psi_{\\mathbf{k}}(\\mathbf{r}) = e^{i\\mathbf{k}\\cdot\\mathbf{r}} u_{\\mathbf{k}}(\\mathbf{r})",
            "tag": "Quantum",
            "appliesTo": "Periodic potentials",
            "assumptions": "Infinite periodic lattice"
          }
        ]
      }
    ]
  },
  {
    "id": "particle_physics",
    "title": "28. Particle Physics & Quantum Field Theory",
    "sections": [
      {
        "title": "Quantum Field Equations",
        "items": [
          {
            "type": "formula",
            "name": "Dirac Equation",
            "tex": "(i\\hbar\\gamma^\\mu\\partial_\\mu - mc)\\psi = 0",
            "tag": "QFT",
            "appliesTo": "Fermions",
            "assumptions": "Spin-1/2 relativistic particles"
          },
          {
            "type": "formula",
            "name": "Klein-Gordon Equation",
            "tex": "(\\Box + \\mu^2)\\phi = 0",
            "tag": "QFT",
            "appliesTo": "Bosons",
            "assumptions": "Spin-0 relativistic particles"
          },
          {
            "type": "formula",
            "name": "Heisenberg Uncertainty Principle",
            "tex": "\\Delta x \\Delta p \\ge \\frac{\\hbar}{2}",
            "tag": "Quantum",
            "appliesTo": "Conjugate variables",
            "assumptions": "Standard quantum limits"
          },
          {
            "type": "formula",
            "name": "De Broglie Wavelength",
            "tex": "\\lambda = \\frac{h}{p}",
            "tag": "Quantum",
            "appliesTo": "Matter waves",
            "assumptions": "Wave-particle duality"
          }
        ]
      }
    ]
  },
  {
    "id": "advanced_math",
    "title": "29. Advanced Mathematics & Transforms",
    "sections": [
      {
        "title": "Transforms & Series",
        "items": [
          {
            "type": "formula",
            "name": "Fourier Transform",
            "tex": "F(k) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi i k x} dx",
            "tag": "Math",
            "appliesTo": "Signal Processing",
            "assumptions": "Integrable functions"
          },
          {
            "type": "formula",
            "name": "Inverse Fourier Transform",
            "tex": "f(x) = \\int_{-\\infty}^{\\infty} F(k) e^{2\\pi i k x} dk",
            "tag": "Math",
            "appliesTo": "Signal Processing",
            "assumptions": "Integrable functions"
          },
          {
            "type": "formula",
            "name": "Taylor Series Expansion",
            "tex": "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x-a)^n",
            "tag": "Math",
            "appliesTo": "Function Approximation",
            "assumptions": "Infinitely differentiable function"
          }
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