import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ==========================================================
// 1. COMPLETE STRUCTURED PHYSICS DATA
// ==========================================================
const THEORY_DATA = [
  { id: "classical", title: "1. Classical Mechanics & Gravitation", sections: [
    { title: "Newtonian Dynamics", items: [
      {type:"formula",name:"Newton's First Law",tex:"\\mathbf F_{\\mathrm{net}}=\\mathbf 0 \\Rightarrow \\mathbf v=\\mathrm{constant}",tag:"Dynamics",formula:"\\mathbf F_{\\mathrm{net}}=\\mathbf 0 \\Rightarrow \\mathbf v=\\mathrm{constant}",details:"States that an object will remain at rest or in uniform motion in a straight line unless acted upon by an external net force. It defines inertial reference frames."},
      {type:"formula",name:"Newton's Second Law",tex:"\\mathbf F_{\\mathrm{net}}=m\\mathbf a",tag:"Dynamics",formula:"\\mathbf F_{\\mathrm{net}}=m\\mathbf a",details:"Relates the net external force acting on a body to its mass and the resulting acceleration, establishing that force causes a change in velocity."},
      {type:"formula",name:"Newton's Second Law - Momentum Form",tex:"\\mathbf F_{\\mathrm{net}}=\\frac{d\\mathbf p}{dt}",tag:"Dynamics",formula:"\\mathbf F_{\\mathrm{net}}=\\frac{d\\mathbf p}{dt}",details:"The most generalized form of the second law, defining force as the time rate of change of momentum. This form remains valid even for systems where mass is changing."},
      {type:"formula",name:"Newton's Second Law - Component Form",tex:"\\sum F_x=ma_x\\quad,\\quad\\sum F_y=ma_y\\quad,\\quad\\sum F_z=ma_z",tag:"Dynamics",formula:"\\sum F_x=ma_x\\quad,\\quad\\sum F_y=ma_y\\quad,\\quad\\sum F_z=ma_z",details:"Breaks down the vector form of the second law into three independent Cartesian spatial dimensions for practical algebraic problem-solving."},
      {type:"formula",name:"Newton's Third Law",tex:"\\mathbf F_{AB}=-\\mathbf F_{BA}",tag:"Dynamics",formula:"\\mathbf F_{AB}=-\\mathbf F_{BA}",details:"For every action, there is an equal and opposite reaction. Forces always occur in interacting pairs between two distinct bodies."},
      {type:"formula",name:"Net External Force",tex:"\\mathbf F_{\\mathrm{net}}=\\sum_i\\mathbf F_i",tag:"Forces",formula:"\\mathbf F_{\\mathrm{net}}=\\sum_i\\mathbf F_i",details:"The vector sum of all individual forces acting upon an object. Only external forces influence the motion of the system's center of mass."},
      {type:"formula",name:"Weight",tex:"\\mathbf W=m\\mathbf g",tag:"Forces",formula:"\\mathbf W=m\\mathbf g",details:"The force exerted on a body by a gravitational field. It is a vector pointing toward the center of the gravitating body."},
      {type:"formula",name:"Weight Magnitude",tex:"W=mg",tag:"Forces",formula:"W=mg",details:"The scalar magnitude of the gravitational force, where 'g' is the local acceleration due to gravity (approx 9.81 m/s² on Earth)."},
      {type:"formula",name:"Hooke's Law",tex:"\\mathbf F_s=-k\\mathbf x",tag:"Forces",formula:"\\mathbf F_s=-k\\mathbf x",details:"Describes the linear restoring force of an ideal spring, which is directly proportional to the displacement from its equilibrium position."},
      {type:"formula",name:"Static Friction",tex:"f_s\\leq\\mu_sN",tag:"Friction",formula:"f_s\\leq\\mu_sN",details:"The variable force that prevents two surfaces from sliding past each other, capping out at a maximum threshold dependent on the normal force."},
      {type:"formula",name:"Maximum Static Friction",tex:"f_{s,\\mathrm{max}}=\\mu_sN",tag:"Friction",formula:"f_{s,\\mathrm{max}}=\\mu_sN",details:"The exact breakaway point where static friction is overcome and relative sliding begins between two surfaces."},
      {type:"formula",name:"Kinetic Friction",tex:"f_k=\\mu_kN",tag:"Friction",formula:"f_k=\\mu_kN",details:"The constant opposing force experienced between two surfaces that are actively sliding relative to each other."},
      {type:"formula",name:"Normal Force on Horizontal Surface",tex:"N=mg",tag:"Forces",formula:"N=mg",details:"The contact force exerted by a horizontal surface counteracting gravity to prevent a resting object from accelerating downward."},
      {type:"formula",name:"Normal Force on Inclined Plane",tex:"N=mg\\cos\\theta",tag:"Forces",formula:"N=mg\\cos\\theta",details:"The perpendicular contact force on an incline, which is reduced as the angle of inclination increases compared to a flat surface."},
      {type:"formula",name:"Inclined Plane Weight Components",tex:"W_{\\parallel}=mg\\sin\\theta\\quad,\\quad W_{\\perp}=mg\\cos\\theta",tag:"Forces",formula:"W_{\\parallel}=mg\\sin\\theta\\quad,\\quad W_{\\perp}=mg\\cos\\theta",details:"Decomposes the vertical gravity vector into a component driving the object down the ramp and a component pressing into the ramp."},
      {type:"formula",name:"Linear Momentum",tex:"\\mathbf p=m\\mathbf v",tag:"Momentum",formula:"\\mathbf p=m\\mathbf v",details:"A vector quantity measuring the 'quantity of motion' of a body, directly proportional to both its mass and its velocity."},
      {type:"formula",name:"Impulse",tex:"\\mathbf J=\\int_{t_1}^{t_2}\\mathbf F\\,dt",tag:"Momentum",formula:"\\mathbf J=\\int_{t_1}^{t_2}\\mathbf F\\,dt",details:"The integral of a force applied over a specific time interval. It represents the total physical impact delivered to an object."},
      {type:"formula",name:"Impulse-Momentum Theorem",tex:"\\mathbf J=\\Delta\\mathbf p",tag:"Momentum",formula:"\\mathbf J=\\Delta\\mathbf p",details:"Connects forces applied over time directly to the resulting change in the object's momentum."},
      {type:"formula",name:"Average Force",tex:"\\mathbf F_{\\mathrm{avg}}=\\frac{\\Delta\\mathbf p}{\\Delta t}",tag:"Momentum",formula:"\\mathbf F_{\\mathrm{avg}}=\\frac{\\Delta\\mathbf p}{\\Delta t}",details:"A simplified metric representing the constant force that would produce the same momentum change over the same time interval as a varying force."},
      {type:"formula",name:"Conservation of Linear Momentum",tex:"\\mathbf P_{\\mathrm{initial}}=\\mathbf P_{\\mathrm{final}}",tag:"Conservation",formula:"\\mathbf P_{\\mathrm{initial}}=\\mathbf P_{\\mathrm{final}}",details:"States that in a closed, isolated system with no net external forces, the total momentum before any event is strictly equal to the total momentum after."},
      {type:"formula",name:"Total Linear Momentum",tex:"\\mathbf P=\\sum_i m_i\\mathbf v_i",tag:"Momentum",formula:"\\mathbf P=\\sum_i m_i\\mathbf v_i",details:"The macroscopic momentum of a multi-particle system is the vector sum of all the individual microscopic momenta."},
      {type:"formula",name:"Center of Mass Position",tex:"\\mathbf r_{\\mathrm{CM}}=\\frac{1}{M}\\sum_i m_i\\mathbf r_i",tag:"Center of Mass",formula:"\\mathbf r_{\\mathrm{CM}}=\\frac{1}{M}\\sum_i m_i\\mathbf r_i",details:"The mass-weighted average position of all particles in a system, marking the point where the entire mass can be mathematically treated as concentrated."},
      {type:"formula",name:"Center of Mass Velocity",tex:"\\mathbf v_{\\mathrm{CM}}=\\frac{1}{M}\\sum_i m_i\\mathbf v_i",tag:"Center of Mass",formula:"\\mathbf v_{\\mathrm{CM}}=\\frac{1}{M}\\sum_i m_i\\mathbf v_i",details:"The velocity vector representing the bulk motion of the system as a whole, ignoring internal relative motions."},
      {type:"formula",name:"Center of Mass Acceleration",tex:"\\mathbf a_{\\mathrm{CM}}=\\frac{1}{M}\\sum_i m_i\\mathbf a_i",tag:"Center of Mass",formula:"\\mathbf a_{\\mathrm{CM}}=\\frac{1}{M}\\sum_i m_i\\mathbf a_i",details:"The bulk acceleration of the system, which is strictly governed by the sum of external forces."},
      {type:"formula",name:"External Force and Center of Mass",tex:"\\mathbf F_{\\mathrm{ext}}=M\\mathbf a_{\\mathrm{CM}}",tag:"Center of Mass",formula:"\\mathbf F_{\\mathrm{ext}}=M\\mathbf a_{\\mathrm{CM}}",details:"Newton's second law translated for complex systems: internal forces cancel out, leaving only external forces to dictate the center of mass's trajectory."},
      {type:"formula",name:"Work",tex:"W=\\int_A^B\\mathbf F\\cdot d\\mathbf r",tag:"Energy",formula:"W=\\int_A^B\\mathbf F\\cdot d\\mathbf r",details:"The strict mathematical definition of mechanical work as the path integral of the force vector dotted with the infinitesimal displacement vector."},
      {type:"formula",name:"Work by Constant Force",tex:"W=Fd\\cos\\theta",tag:"Energy",formula:"W=Fd\\cos\\theta",details:"A simplified calculation for work when the force is constant and acting at a fixed angle to a straight-line displacement."},
      {type:"formula",name:"Kinetic Energy",tex:"K=\\frac12mv^2",tag:"Energy",formula:"K=\\frac12mv^2",details:"The energy an object possesses due to its motion, scaling linearly with mass and quadratically with velocity."},
      {type:"formula",name:"Kinetic Energy in Terms of Momentum",tex:"K=\\frac{p^2}{2m}",tag:"Energy",formula:"K=\\frac{p^2}{2m}",details:"An alternative formulation linking energy and momentum, deeply useful in collision mechanics and quantum physics."},
      {type:"formula",name:"Work-Energy Theorem",tex:"W_{\\mathrm{net}}=\\Delta K=K_f-K_i",tag:"Energy",formula:"W_{\\mathrm{net}}=\\Delta K=K_f-K_i",details:"The net work done by all forces on an object directly equals the change in its kinetic energy."},
      {type:"formula",name:"Power",tex:"P=\\frac{dW}{dt}",tag:"Energy",formula:"P=\\frac{dW}{dt}",details:"The time derivative of work, representing the instantaneous rate at which energy is transferred or transformed."},
      {type:"formula",name:"Instantaneous Mechanical Power",tex:"P=\\mathbf F\\cdot\\mathbf v",tag:"Energy",formula:"P=\\mathbf F\\cdot\\mathbf v",details:"Calculates the power delivered by a specific force acting on an object moving at a specific velocity via the dot product."},
      {type:"formula",name:"Gravitational Potential Energy Near Earth's Surface",tex:"U_g=mgh",tag:"Potential Energy",formula:"U_g=mgh",details:"An approximation of gravitational potential energy used when changes in height are tiny compared to the radius of the Earth."},
      {type:"formula",name:"Spring Potential Energy",tex:"U_s=\\frac12kx^2",tag:"Potential Energy",formula:"U_s=\\frac12kx^2",details:"The elastic potential energy stored in a deformed spring, defined by integrating Hooke's Law."},
      {type:"formula",name:"Mechanical Energy",tex:"E_{\\mathrm{mech}}=K+U",tag:"Energy",formula:"E_{\\mathrm{mech}}=K+U",details:"The sum of an object's macroscopic kinetic and potential energies. It is conserved if only conservative forces do work."},
      {type:"formula",name:"Conservation of Mechanical Energy",tex:"K_i+U_i=K_f+U_f",tag:"Conservation",formula:"K_i+U_i=K_f+U_f",details:"In an isolated system devoid of friction or drag, energy simply transforms back and forth between kinetic and potential forms."},
      {type:"formula",name:"Work by Gravity",tex:"W_g=-\\Delta U_g",tag:"Energy",formula:"W_g=-\\Delta U_g",details:"Work done by a conservative force like gravity is entirely path-independent and equals the negative change in potential energy."},
      {type:"formula",name:"Work by Spring",tex:"W_s=-\\Delta U_s",tag:"Energy",formula:"W_s=-\\Delta U_s",details:"Work done by an elastic restoring force, also equal to the negative change in the system's elastic potential energy."},
      {type:"formula",name:"Torque Vector",tex:"\\boldsymbol\\tau=\\mathbf r\\times\\mathbf F",tag:"Rotation",formula:"\\boldsymbol\\tau=\\mathbf r\\times\\mathbf F",details:"The cross product of the position vector and the force vector. It represents the rotational analog of force, causing angular acceleration."},
      {type:"formula",name:"Torque Magnitude",tex:"\\tau=rF\\sin\\theta",tag:"Rotation",formula:"\\tau=rF\\sin\\theta",details:"Calculates the magnitude of torque based on the angle between the lever arm and the applied force. Maximized at 90 degrees."},
      {type:"formula",name:"Lever-Arm Torque",tex:"\\tau=r_{\\perp}F",tag:"Rotation",formula:"\\tau=r_{\\perp}F",details:"A geometric shortcut for finding torque by measuring the perpendicular distance from the pivot to the line of action of the force."},
      {type:"formula",name:"Net Torque",tex:"\\boldsymbol\\tau_{\\mathrm{net}}=\\sum_i\\boldsymbol\\tau_i",tag:"Rotation",formula:"\\boldsymbol\\tau_{\\mathrm{net}}=\\sum_i\\boldsymbol\\tau_i",details:"The vector sum of all rotational forces. A non-zero net torque dictates that the object's angular velocity is changing."},
      {type:"formula",name:"Angular Momentum",tex:"\\mathbf L=\\mathbf r\\times\\mathbf p",tag:"Angular Momentum",formula:"\\mathbf L=\\mathbf r\\times\\mathbf p",details:"The rotational counterpart to linear momentum. It depends not just on motion, but on the distance of that motion from a reference axis."},
      {type:"formula",name:"Torque-Angular Momentum Relation",tex:"\\boldsymbol\\tau_{\\mathrm{net}}=\\frac{d\\mathbf L}{dt}",tag:"Angular Momentum",formula:"\\boldsymbol\\tau_{\\mathrm{net}}=\\frac{d\\mathbf L}{dt}",details:"The rotational equivalent of Newton's Second Law, linking applied net torque directly to the time rate of change of angular momentum."},
      {type:"formula",name:"Conservation of Angular Momentum",tex:"\\frac{d\\mathbf L}{dt}=0\\Rightarrow\\mathbf L=\\mathrm{constant}",tag:"Conservation",formula:"\\frac{d\\mathbf L}{dt}=0\\Rightarrow\\mathbf L=\\mathrm{constant}",details:"If no external torques act on a system, its total angular spin and orientation are rigidly preserved over time."},
      {type:"formula",name:"Angular Momentum of Rigid Body",tex:"L=I\\omega",tag:"Angular Momentum",formula:"L=I\\omega",details:"For a solid spinning object, angular momentum is the product of its resistance to rotation (moment of inertia) and its angular velocity."},
      {type:"formula",name:"Rotational Kinetic Energy",tex:"K_{\\mathrm{rot}}=\\frac12I\\omega^2",tag:"Energy",formula:"K_{\\mathrm{rot}}=\\frac12I\\omega^2",details:"The energy locked within the spinning motion of an object, directly analogous to linear kinetic energy."},
      {type:"formula",name:"Rotational Newton's Second Law",tex:"\\tau_{\\mathrm{net}}=I\\alpha",tag:"Rotation",formula:"\\tau_{\\mathrm{net}}=I\\alpha",details:"The fundamental equation of rotational dynamics: torque causes an angular acceleration inversely proportional to the moment of inertia."},
      {type:"formula",name:"Moment of Inertia - Discrete System",tex:"I=\\sum_i m_ir_i^2",tag:"Rotation",formula:"I=\\sum_i m_ir_i^2",details:"Calculates the rotational inertia of a scattered group of particles by summing their mass times the square of their distance from the axis."},
      {type:"formula",name:"Moment of Inertia - Continuous Body",tex:"I=\\int r^2\\,dm",tag:"Rotation",formula:"I=\\int r^2\\,dm",details:"The integral form used to find the rotational inertia of continuous solid shapes like cylinders, spheres, and rods."},
      {type:"formula",name:"Parallel-Axis Theorem",tex:"I=I_{\\mathrm{CM}}+Md^2",tag:"Rotation",formula:"I=I_{\\mathrm{CM}}+Md^2",details:"A crucial theorem for shifting the rotation axis away from the center of mass, increasing the total moment of inertia by mass times the shift squared."},
      {type:"formula",name:"Rotational Work",tex:"W=\\int_{\\theta_1}^{\\theta_2}\\tau\\,d\\theta",tag:"Rotation",formula:"W=\\int_{\\theta_1}^{\\theta_2}\\tau\\,d\\theta",details:"Calculates the work done by a torque as it rotates a body through a given angular displacement."},
      {type:"formula",name:"Rotational Power",tex:"P=\\tau\\omega",tag:"Rotation",formula:"P=\\tau\\omega",details:"The rate at which a torque performs work on a spinning object, analogous to force times velocity in linear systems."},
      {type:"formula",name:"Angular Displacement",tex:"\\Delta\\theta=\\frac{\\Delta s}{r}",tag:"Rotational Kinematics",formula:"\\Delta\\theta=\\frac{\\Delta s}{r}",details:"Translates linear arc length traveled along a circular path into an angular measurement in radians."},
      {type:"formula",name:"Angular Velocity",tex:"\\omega=\\frac{d\\theta}{dt}",tag:"Rotational Kinematics",formula:"\\omega=\\frac{d\\theta}{dt}",details:"The time derivative of angular displacement, measuring how fast an object is rotating or revolving."},
      {type:"formula",name:"Angular Acceleration",tex:"\\alpha=\\frac{d\\omega}{dt}=\\frac{d^2\\theta}{dt^2}",tag:"Rotational Kinematics",formula:"\\alpha=\\frac{d\\omega}{dt}=\\frac{d^2\\theta}{dt^2}",details:"The rate at which the rotation speed is speeding up or slowing down over time."},
      {type:"formula",name:"Tangential Velocity",tex:"v=r\\omega",tag:"Circular Motion",formula:"v=r\\omega",details:"Connects the linear speed of a point on a spinning object to its angular speed and radial distance from the axis."},
      {type:"formula",name:"Tangential Acceleration",tex:"a_t=r\\alpha",tag:"Circular Motion",formula:"a_t=r\\alpha",details:"The linear acceleration component that runs tangent to the circular path, directly driven by angular acceleration."},
      {type:"formula",name:"Centripetal Acceleration",tex:"a_c=\\frac{v^2}{r}=r\\omega^2",tag:"Circular Motion",formula:"a_c=\\frac{v^2}{r}=r\\omega^2",details:"The inward acceleration required to keep a body turning in a circular path, preventing it from flying off in a straight line."},
      {type:"formula",name:"Centripetal Force",tex:"F_c=\\frac{mv^2}{r}=mr\\omega^2",tag:"Circular Motion",formula:"F_c=\\frac{mv^2}{r}=mr\\omega^2",details:"The net radial force pulling an object toward the center of its circular orbit. It is a requirement for orbit, not a new fundamental force."},
      {type:"formula",name:"Total Acceleration in Circular Motion",tex:"a=\\sqrt{a_t^2+a_c^2}",tag:"Circular Motion",formula:"a=\\sqrt{a_t^2+a_c^2}",details:"Combines the tangential acceleration (speeding up/slowing down) and the radial acceleration (turning) via the Pythagorean theorem."},
      {type:"formula",name:"Constant Angular Velocity",tex:"\\theta=\\theta_0+\\omega t",tag:"Rotational Kinematics",formula:"\\theta=\\theta_0+\\omega t",details:"The basic kinematic equation predicting angular position over time when the spin rate is perfectly steady."},
      {type:"formula",name:"Angular Velocity with Constant Angular Acceleration",tex:"\\omega=\\omega_0+\\alpha t",tag:"Rotational Kinematics",formula:"\\omega=\\omega_0+\\alpha t",details:"Predicts the future rotational speed of an object undergoing a steady, constant angular acceleration."},
      {type:"formula",name:"Angular Displacement with Constant Angular Acceleration",tex:"\\theta=\\theta_0+\\omega_0t+\\frac12\\alpha t^2",tag:"Rotational Kinematics",formula:"\\theta=\\theta_0+\\omega_0t+\\frac12\\alpha t^2",details:"Calculates total angular displacement taking into account both initial spin speed and a constant angular acceleration rate."},
      {type:"formula",name:"Angular Velocity-Displacement Relation",tex:"\\omega^2=\\omega_0^2+2\\alpha(\\theta-\\theta_0)",tag:"Rotational Kinematics",formula:"\\omega^2=\\omega_0^2+2\\alpha(\\theta-\\theta_0)",details:"A time-independent rotational kinematic equation useful for finding final speeds based strictly on total angle rotated."},
      {type:"formula",name:"Rolling Without Slipping",tex:"v_{\\mathrm{CM}}=R\\omega",tag:"Rolling",formula:"v_{\\mathrm{CM}}=R\\omega",details:"The crucial condition tying the translational speed of a wheel's center directly to its spin rate perfectly along the ground."},
      {type:"formula",name:"Rolling Acceleration",tex:"a_{\\mathrm{CM}}=R\\alpha",tag:"Rolling",formula:"a_{\\mathrm{CM}}=R\\alpha",details:"The acceleration constraint for pure rolling: linear acceleration equals the radius times the angular acceleration."},
      {type:"formula",name:"Rolling Displacement",tex:"s=R\\theta",tag:"Rolling",formula:"s=R\\theta",details:"Relates the linear distance traveled by a rolling object to the total angle the perimeter has swept through."},
      {type:"formula",name:"Total Kinetic Energy of Rolling Body",tex:"K=\\frac12Mv_{\\mathrm{CM}}^2+\\frac12I_{\\mathrm{CM}}\\omega^2",tag:"Rolling",formula:"K=\\frac12Mv_{\\mathrm{CM}}^2+\\frac12I_{\\mathrm{CM}}\\omega^2",details:"A rolling object stores kinetic energy in two distinct reservoirs: moving forward as a bulk mass, and spinning around its center."},
      {type:"formula",name:"Rolling Down Incline",tex:"a_{\\mathrm{CM}}=\\frac{g\\sin\\theta}{1+I_{\\mathrm{CM}}/(MR^2)}",tag:"Rolling",formula:"a_{\\mathrm{CM}}=\\frac{g\\sin\\theta}{1+I_{\\mathrm{CM}}/(MR^2)}",details:"Shows that shape dictates acceleration down a ramp. Hollow objects (higher I) roll slower than solid objects (lower I) because they drain more energy into rotation."},
      {type:"formula",name:"Universal Law of Gravitation",tex:"F=G\\frac{m_1m_2}{r^2}",tag:"Gravitation",formula:"F=G\\frac{m_1m_2}{r^2}",details:"Newton's inverse-square law describing the mutually attractive gravitational force between any two masses in the universe."},
      {type:"formula",name:"Gravitational Field",tex:"g=\\frac{GM}{r^2}",tag:"Gravitation",formula:"g=\\frac{GM}{r^2}",details:"Defines the local acceleration vector created by a massive body at a specific distance away in space."},
      {type:"formula",name:"Gravitational Potential Energy",tex:"U=-\\frac{GMm}{r}",tag:"Gravitation",formula:"U=-\\frac{GMm}{r}",details:"The true, non-approximated binding energy between two masses. It is universally defined as negative, reaching zero only at infinite separation."},
      {type:"formula",name:"Gravitational Potential",tex:"\\Phi=-\\frac{GM}{r}",tag:"Gravitation",formula:"\\Phi=-\\frac{GM}{r}",details:"The potential energy per unit mass at a point in a gravitational field, useful for field mapping independent of the test object."},
      {type:"formula",name:"Circular Orbital Speed",tex:"v=\\sqrt{\\frac{GM}{r}}",tag:"Orbital Dynamics",formula:"v=\\sqrt{\\frac{GM}{r}}",details:"The specific transverse velocity required to maintain a perfectly circular orbit around a massive body at radius r."},
      {type:"formula",name:"Circular Orbital Angular Speed",tex:"\\omega=\\sqrt{\\frac{GM}{r^3}}",tag:"Orbital Dynamics",formula:"\\omega=\\sqrt{\\frac{GM}{r^3}}",details:"The angular frequency of an orbiting body. It drops off rapidly as the distance from the central mass increases."},
      {type:"formula",name:"Orbital Period",tex:"T=2\\pi\\sqrt{\\frac{r^3}{GM}}",tag:"Orbital Dynamics",formula:"T=2\\pi\\sqrt{\\frac{r^3}{GM}}",details:"Derivation of Kepler's Third Law for circular orbits, detailing exactly how long it takes a satellite to complete one full revolution."},
      {type:"formula",name:"Escape Velocity",tex:"v_{\\mathrm{esc}}=\\sqrt{\\frac{2GM}{r}}",tag:"Orbital Dynamics",formula:"v_{\\mathrm{esc}}=\\sqrt{\\frac{2GM}{r}}",details:"The minimum ballistic velocity required at the surface of a body to coast infinitely far away, overcoming its gravity well entirely."},
      {type:"formula",name:"Gravitational Orbital Energy",tex:"E=-\\frac{GMm}{2r}",tag:"Orbital Dynamics",formula:"E=-\\frac{GMm}{2r}",details:"The total mechanical energy (kinetic + potential) of a bound circular orbit. Because it is bound, the total energy is precisely half the potential energy."},
      {type:"formula",name:"Kepler's Third Law",tex:"T^2=\\frac{4\\pi^2}{GM}a^3",tag:"Orbital Dynamics",formula:"T^2=\\frac{4\\pi^2}{GM}a^3",details:"Relates the square of the orbital period to the cube of the semi-major axis, demonstrating that distant planets move much slower in their longer orbits."},
      {type:"formula",name:"Elastic Collision Momentum Conservation",tex:"m_1\\mathbf v_1+m_2\\mathbf v_2=m_1\\mathbf v_1'+m_2\\mathbf v_2'",tag:"Collisions",formula:"m_1\\mathbf v_1+m_2\\mathbf v_2=m_1\\mathbf v_1'+m_2\\mathbf v_2'",details:"The standard conservation of linear momentum equation applied to the distinct states before and after a two-body collision."},
      {type:"formula",name:"Elastic Collision Energy Conservation",tex:"\\frac12m_1v_1^2+\\frac12m_2v_2^2=\\frac12m_1v_1'^2+\\frac12m_2v_2'^2",tag:"Collisions",formula:"\\frac12m_1v_1^2+\\frac12m_2v_2^2=\\frac12m_1v_1'^2+\\frac12m_2v_2'^2",details:"Defines a perfectly elastic collision, wherein total macroscopic kinetic energy is completely conserved with zero energy lost to heat or deformation."},
      {type:"formula",name:"Coefficient of Restitution",tex:"e=\\frac{|v_2'-v_1'|}{|v_1-v_2|}",tag:"Collisions",formula:"e=\\frac{|v_2'-v_1'|}{|v_1-v_2|}",details:"A dimensionless parameter between 0 and 1 detailing the 'bounciness' of a collision, measuring the ratio of separation velocity to closing velocity."},
      {type:"formula",name:"Perfectly Inelastic Collision",tex:"m_1v_1+m_2v_2=(m_1+m_2)v'",tag:"Collisions",formula:"m_1v_1+m_2v_2=(m_1+m_2)v'",details:"Models a collision where the two interacting bodies crush and stick together, sharing a unified final velocity while maximizing kinetic energy loss."},
      {type:"formula",name:"Reduced Mass",tex:"\\mu=\\frac{m_1m_2}{m_1+m_2}",tag:"Two-Body Dynamics",formula:"\\mu=\\frac{m_1m_2}{m_1+m_2}",details:"An effective mass term that mathematically simplifies complex two-body orbital or oscillatory problems into a much simpler single-body problem."},
      {type:"formula",name:"Two-Body Relative Motion",tex:"\\mu\\ddot{\\mathbf r}=\\mathbf F",tag:"Two-Body Dynamics",formula:"\\mu\\ddot{\\mathbf r}=\\mathbf F",details:"The reduced mass formulation of Newton's second law applied to the relative separation vector between two mutually interacting bodies."},
      {type:"formula",name:"Simple Harmonic Motion Restoring Force",tex:"F=-kx",tag:"Oscillations",formula:"F=-kx",details:"The foundational requirement for simple harmonic motion: a restoring force that scales perfectly linearly with the displacement from equilibrium."},
      {type:"formula",name:"Simple Harmonic Motion Equation",tex:"\\ddot{x}+\\omega^2x=0",tag:"Oscillations",formula:"\\ddot{x}+\\omega^2x=0",details:"The canonical second-order linear differential equation governing all undamped simple harmonic oscillators across physics."},
      {type:"formula",name:"Simple Harmonic Motion Angular Frequency",tex:"\\omega=\\sqrt{\\frac{k}{m}}",tag:"Oscillations",formula:"\\omega=\\sqrt{\\frac{k}{m}}",details:"Determines the intrinsic natural frequency of a mass-spring system, showing it depends solely on system stiffness and mass, not on how hard you pull it."},
      {type:"formula",name:"Simple Harmonic Motion Period",tex:"T=2\\pi\\sqrt{\\frac{m}{k}}",tag:"Oscillations",formula:"T=2\\pi\\sqrt{\\frac{m}{k}}",details:"Calculates the strict time required for one full oscillation cycle. Higher mass slows it down, higher stiffness speeds it up."},
      {type:"formula",name:"Simple Harmonic Motion Position",tex:"x(t)=A\\cos(\\omega t+\\phi)",tag:"Oscillations",formula:"x(t)=A\\cos(\\omega t+\\phi)",details:"The general cosine solution for an oscillator's position, completely parameterizing the motion by amplitude, frequency, and phase shift."},
      {type:"formula",name:"Simple Harmonic Motion Velocity",tex:"v(t)=-A\\omega\\sin(\\omega t+\\phi)",tag:"Oscillations",formula:"v(t)=-A\\omega\\sin(\\omega t+\\phi)",details:"The time derivative of position, showing that velocity is entirely 90-degrees out of phase with the object's displacement."},
      {type:"formula",name:"Simple Harmonic Motion Acceleration",tex:"a(t)=-\\omega^2x(t)",tag:"Oscillations",formula:"a(t)=-\\omega^2x(t)",details:"The second derivative of position, highlighting that acceleration always directly opposes the displacement in a harmonic oscillator."},
      {type:"formula",name:"Simple Pendulum Period",tex:"T=2\\pi\\sqrt{\\frac{L}{g}}",tag:"Oscillations",formula:"T=2\\pi\\sqrt{\\frac{L}{g}}",details:"The small-angle approximation for a pendulum's period, revealing the astonishing fact that period is completely independent of the pendulum bob's mass."},
      {type:"formula",name:"Damped Oscillator Equation",tex:"m\\ddot{x}+b\\dot{x}+kx=0",tag:"Oscillations",formula:"m\\ddot{x}+b\\dot{x}+kx=0",details:"Extends the idealized harmonic oscillator to the real world by adding a linear friction/drag term proportional to the velocity."},
      {type:"formula",name:"Damping Coefficient Ratio",tex:"\\zeta=\\frac{b}{2\\sqrt{mk}}",tag:"Oscillations",formula:"\\zeta=\\frac{b}{2\\sqrt{mk}}",details:"A dimensionless parameter identifying if a system is underdamped (oscillates), critically damped (returns fast without oscillating), or overdamped (returns slowly)."},
      {type:"formula",name:"Generalized Newtonian Equation",tex:"\\mathbf F(\\mathbf r,\\mathbf v,t)=m\\frac{d^2\\mathbf r}{dt^2}",tag:"Dynamics",formula:"\\mathbf F(\\mathbf r,\\mathbf v,t)=m\\frac{d^2\\mathbf r}{dt^2}",details:"The universal differential form of Newton's second law where force is a complex function of position, velocity, and time."},
      {type:"formula",name:"Lagrangian Definition",tex:"\\mathcal L=T-U",tag:"Analytical Mechanics",formula:"\\mathcal L=T-U",details:"The foundational quantity of analytical mechanics, defined simply as the difference between the system's kinetic energy and its potential energy."},
      {type:"formula",name:"Euler-Lagrange Equation",tex:"\\frac{d}{dt}\\left(\\frac{\\partial\\mathcal L}{\\partial\\dot q_i}\\right)-\\frac{\\partial\\mathcal L}{\\partial q_i}=0",tag:"Analytical Mechanics",formula:"\\frac{d}{dt}\\left(\\frac{\\partial\\mathcal L}{\\partial\\dot q_i}\\right)-\\frac{\\partial\\mathcal L}{\\partial q_i}=0",details:"The magnificent calculus of variations result that generates the true path of motion by minimizing the action, replacing F=ma with pure scalar energy relations."}
    ]},
    { title: "Gravitation & Orbits", items: [
      {type:"formula",name:"Gravitational Potential Energy",tex:"U=-\\frac{GMm}{r}",tag:"Energy",formula:"U=-\\frac{GMm}{r}",details:"The absolute potential energy between two cosmic bodies, standardized to approach zero at infinite separation."},
      {type:"formula",name:"Total Orbital Energy",tex:"E=\\frac12mv^2-\\frac{GMm}{r}",tag:"Energy",formula:"E=\\frac12mv^2-\\frac{GMm}{r}",details:"Sums the specific kinetic and potential energies. A negative result means the orbit is gravitationally bound; positive means it's an escaping trajectory."},
      {type:"formula",name:"Vis-Viva Equation",tex:"v^2=GM\\left(\\frac2r-\\frac1a\\right)",tag:"Kinematics",formula:"v^2=GM\\left(\\frac2r-\\frac1a\\right)",details:"A brilliant conservation of energy shortcut linking the orbital speed of a body directly to its current radius and the orbit's semi-major axis."},
      {type:"formula",name:"Kepler's Third Law",tex:"T^2=\\frac{4\\pi^2}{GM}a^3",tag:"Kinematics",formula:"T^2=\\frac{4\\pi^2}{GM}a^3",details:"The exact Newtonian derivation proving Kepler's observation that the square of a planet's year is proportional to the cube of its distance from the star."},
      {type:"formula",name:"Reduced Mass",tex:"\\mu=\\frac{m_1m_2}{m_1+m_2}",tag:"Two-body reduction",formula:"\\mu=\\frac{m_1m_2}{m_1+m_2}",details:"Allows astronomers to model a complex binary star system mathematically as if it were a single particle orbiting a fixed central point."}
    ]},
    { title: "Advanced Mechanics", items: [
      {type:"formula",name:"Lagrangian",tex:"L=T-U",tag:"Analytical Mechanics",formula:"L=T-U",details:"The functional basis for Lagrangian mechanics, encoding the full dynamical state of a system purely through its scalar energies."},
      {type:"formula",name:"Euler-Lagrange Equation",tex:"\\frac{d}{dt} \\frac{\\partial L}{\\partial\\dot q_i} - \\frac{\\partial L}{\\partial q_i}=0",tag:"Equation of Motion",formula:"\\frac{d}{dt} \\frac{\\partial L}{\\partial\\dot q_i} - \\frac{\\partial L}{\\partial q_i}=0",details:"Yields the differential equations of motion perfectly regardless of the coordinate system chosen (Cartesian, polar, spherical, etc.)."},
      {type:"formula",name:"Hamiltonian",tex:"H=\\sum_i p_i\\dot q_i-L",tag:"Analytical Mechanics",formula:"H=\\sum_i p_i\\dot q_i-L",details:"A Legendre transformation of the Lagrangian that shifts the framework into phase space, typically representing the total energy of the system."},
      {type:"formula",name:"Hamilton's Equations",tex:"\\dot q_i=\\frac{\\partial H}{\\partial p_i} \\quad,\\quad \\dot p_i=-\\frac{\\partial H}{\\partial q_i}",tag:"Equations of Motion",formula:"\\dot q_i=\\frac{\\partial H}{\\partial p_i} \\quad,\\quad \\dot p_i=-\\frac{\\partial H}{\\partial q_i}",details:"A symmetric set of first-order differential equations that dictate the flow of the system through position-momentum phase space."}
    ]}
  ]},
  { id: "fluids_mhd", title: "2. Fluid Dynamics & Magnetohydrodynamics", sections: [
    { title: "Fluid Equations", items: [
      {type:"formula",name:"Material Derivative",tex:"\\frac{D}{Dt} = \\frac{\\partial}{\\partial t} +\\mathbf v\\cdot\\nabla",tag:"Operator",formula:"\\frac{D}{Dt} = \\frac{\\partial}{\\partial t} +\\mathbf v\\cdot\\nabla",details:"The total time derivative tracking a specific fluid parcel as it moves through a flow field, combining local time changes with spatial convective changes."},
      {type:"formula",name:"Continuity Equation",tex:"\\frac{\\partial\\rho}{\\partial t} +\\nabla\\cdot(\\rho\\mathbf v)=0",tag:"Conservation",formula:"\\frac{\\partial\\rho}{\\partial t} +\\nabla\\cdot(\\rho\\mathbf v)=0",details:"The fluid dynamics statement of mass conservation. It mandates that any change in local density must be offset by an exact divergence of the fluid flow."},
      {type:"formula",name:"Euler Equation",tex:"\\rho \\left( \\frac{\\partial\\mathbf v}{\\partial t} + \\mathbf v\\cdot\\nabla\\mathbf v \\right) = -\\nabla P+\\rho\\mathbf g",tag:"Momentum",formula:"\\rho \\left( \\frac{\\partial\\mathbf v}{\\partial t} + \\mathbf v\\cdot\\nabla\\mathbf v \\right) = -\\nabla P+\\rho\\mathbf g",details:"The momentum conservation equation for an idealized, perfectly inviscid (zero viscosity) fluid driven by pressure gradients and gravity."},
      {type:"formula",name:"Navier-Stokes Equation",tex:"\\rho\\frac{D\\mathbf v}{Dt} = -\\nabla P+\\mu\\nabla^2\\mathbf v+\\rho\\mathbf g",tag:"Momentum",formula:"\\rho\\frac{D\\mathbf v}{Dt} = -\\nabla P+\\mu\\nabla^2\\mathbf v+\\rho\\mathbf g",details:"The famously complex nonlinear differential equation governing viscous fluid motion, accounting for internal friction through the Laplacian velocity term."},
      {type:"formula",name:"Vorticity",tex:"\\boldsymbol\\omega=\\nabla\\times\\mathbf v",tag:"Kinematics",formula:"\\boldsymbol\\omega=\\nabla\\times\\mathbf v",details:"The curl of the velocity field, mathematically measuring the microscopic, localized rotation or 'spin' of fluid parcels within the flow."},
      {type:"formula",name:"Bernoulli's Principle",tex:"\\frac12v^2+\\frac{P}{\\rho}+\\Phi=\\text{constant}",tag:"Energy",formula:"\\frac12v^2+\\frac{P}{\\rho}+\\Phi=\\text{constant}",details:"Demonstrates energy conservation along a streamline in steady, inviscid flow, proving that fluid pressure must decrease as fluid velocity increases."},
      {type:"formula",name:"Reynolds Number",tex:"Re=\\frac{\\rho vL}{\\mu}",tag:"Dimensionless",formula:"Re=\\frac{\\rho vL}{\\mu}",details:"The critical dimensionless ratio of inertial forces to viscous forces. Low Re means smooth laminar flow; high Re predicts chaotic turbulence."},
      {type:"formula",name:"Mach Number",tex:"M=\\frac vc_s",tag:"Dimensionless",formula:"M=\\frac vc_s",details:"The dimensionless ratio of flow velocity to the local speed of sound, defining whether a fluid regime is incompressible, subsonic, or supersonic."}
    ]},
    { title: "Magnetohydrodynamics (MHD)", items: [
      {type:"formula",name:"Induction Equation",tex:"\\frac{\\partial\\mathbf B}{\\partial t} = \\nabla\\times(\\mathbf v\\times\\mathbf B) -\\nabla\\times(\\eta\\nabla\\times\\mathbf B)",tag:"MHD",formula:"\\frac{\\partial\\mathbf B}{\\partial t} = \\nabla\\times(\\mathbf v\\times\\mathbf B) -\\nabla\\times(\\eta\\nabla\\times\\mathbf B)",details:"Describes how magnetic fields are convected and diffused within conductive plasmas, foundational for understanding solar dynamos and astrophysics."},
      {type:"formula",name:"Lorentz Force Density",tex:"\\mathbf f=\\mathbf J\\times\\mathbf B",tag:"Dynamics",formula:"\\mathbf f=\\mathbf J\\times\\mathbf B",details:"The macroscopic volumetric force exerted onto the plasma fluid bulk by its own internally generated electrical currents interacting with magnetic fields."},
      {type:"formula",name:"Magnetic Pressure",tex:"P_B=\\frac{B^2}{2\\mu_0}",tag:"Thermodynamics",formula:"P_B=\\frac{B^2}{2\\mu_0}",details:"The effective isotropic pressure exerted by a magnetic field. Plasmas often find equilibrium by balancing thermal gas pressure against this magnetic pressure."}
    ]}
  ]},
  { id: "electromagnetism", title: "3. Electromagnetism", sections: [
    { title: "Potentials & Fields", items: [
      {type:"formula",name:"Vector & Scalar Potentials",tex:"\\mathbf B=\\nabla\\times\\mathbf A \\quad,\\quad \\mathbf E=-\\nabla\\phi-\\frac{\\partial\\mathbf A}{\\partial t}",tag:"Definitions",formula:"\\mathbf B=\\nabla\\times\\mathbf A \\quad,\\quad \\mathbf E=-\\nabla\\phi-\\frac{\\partial\\mathbf A}{\\partial t}",details:"Expresses the physical E and B fields strictly through derivatives of the more fundamental vector (A) and scalar (phi) potentials."},
      {type:"formula",name:"Poynting Vector",tex:"\\mathbf S=\\frac1{\\mu_0}\\mathbf E\\times\\mathbf B",tag:"Energy Transport",formula:"\\mathbf S=\\frac1{\\mu_0}\\mathbf E\\times\\mathbf B",details:"The cross product of the electric and magnetic fields, representing the directional energy flux (power per unit area) carried by an electromagnetic wave."},
      {type:"formula",name:"EM Energy Density",tex:"u= \\frac12 \\left( \\epsilon_0E^2+\\frac{B^2}{\\mu_0} \\right)",tag:"Energy",formula:"u= \\frac12 \\left( \\epsilon_0E^2+\\frac{B^2}{\\mu_0} \\right)",details:"The total volumetric energy stored within empty space by the sheer presence of static or dynamic electric and magnetic fields."}
    ]},
    { title: "Covariant Formulation", items: [
      {type:"formula",name:"Electromagnetic Field Tensor",tex:"F_{\\mu\\nu} = \\partial_\\mu A_\\nu-\\partial_\\nu A_\\mu",tag:"Tensor",formula:"F_{\\mu\\nu} = \\partial_\\mu A_\\nu-\\partial_\\nu A_\\mu",details:"The antisymmetric 4x4 matrix encompassing both E and B fields, unifying them into a single relativistic geometric object."},
      {type:"formula",name:"Covariant Maxwell Equations",tex:"\\nabla_\\mu F^{\\mu\\nu}=\\mu_0J^\\nu",tag:"Field Equation",formula:"\\nabla_\\mu F^{\\mu\\nu}=\\mu_0J^\\nu",details:"The ultimate, infinitely elegant reduction of Maxwell's four equations into a single tensor equation that holds true in any curved relativistic spacetime."},
      {type:"formula",name:"EM Stress-Energy Tensor",tex:"T_{\\mu\\nu}^{EM} = \\frac1{\\mu_0} \\left( F_{\\mu\\alpha}F_\\nu{}^\\alpha -\\frac14g_{\\mu\\nu}F_{\\alpha\\beta}F^{\\alpha\\beta} \\right)",tag:"Energy-Momentum",formula:"T_{\\mu\\nu}^{EM} = \\frac1{\\mu_0} \\left( F_{\\mu\\alpha}F_\\nu{}^\\alpha -\\frac14g_{\\mu\\nu}F_{\\alpha\\beta}F^{\\alpha\\beta} \\right)",details:"Computes exactly how electromagnetic fields contain mass-energy and momentum, which in turn literally warp the fabric of spacetime in General Relativity."}
    ]}
  ]},
  { id: "radiation", title: "4. Radiation & Radiative Transfer", sections: [
    { title: "Thermal Radiation", items: [
      {type:"formula",name:"Planck Function",tex:"B_\\nu(T)= \\frac{2h\\nu^3}{c^2} \\frac1{e^{h\\nu/k_BT}-1}",tag:"Spectrum",formula:"B_\\nu(T)= \\frac{2h\\nu^3}{c^2} \\frac1{e^{h\\nu/k_BT}-1}",details:"The foundational equation of quantum mechanics. It describes the exact spectral radiance of an ideal blackbody emitting photons in thermal equilibrium."},
      {type:"formula",name:"Stefan-Boltzmann Law",tex:"F=\\sigma T^4",tag:"Flux",formula:"F=\\sigma T^4",details:"By integrating the Planck function, this proves that the total energy radiated by a blackbody scales violently with the fourth power of its absolute temperature."},
      {type:"formula",name:"Wien's Displacement Law",tex:"\\lambda_{\\max}T=b",tag:"Spectrum Peak",formula:"\\lambda_{\\max}T=b",details:"Shows that as an object heats up, the peak wavelength of its emitted light shifts inversely into the blue/ultraviolet. This is how we know star temperatures by their color."},
      {type:"formula",name:"Radiation Energy Density",tex:"u=aT^4",tag:"Thermodynamics",formula:"u=aT^4",details:"Calculates the raw energy density of a photon gas filling a volume. Dominant in the extremely early universe."},
      {type:"formula",name:"Radiation Pressure",tex:"P=\\frac13aT^4",tag:"Thermodynamics",formula:"P=\\frac13aT^4",details:"Photons exert a physical pressure. This specific pressure is what physically holds up the core of massive stars against gravitational collapse."}
    ]},
    { title: "Radiative Transfer", items: [
      {type:"formula",name:"Radiative Transfer Equation",tex:"\\frac{dI_\\nu}{ds} = -\\alpha_\\nu I_\\nu+j_\\nu",tag:"Transport",formula:"\\frac{dI_\\nu}{ds} = -\\alpha_\\nu I_\\nu+j_\\nu",details:"The master equation detailing how light intensity changes as it travels through a medium, losing energy to absorption while gaining energy from local emission."},
      {type:"formula",name:"Optical Depth",tex:"\\tau_\\nu=\\int\\alpha_\\nu ds",tag:"Property",formula:"\\tau_\\nu=\\int\\alpha_\\nu ds",details:"A dimensionless measure of a medium's opaqueness. An optical depth over 1 means photons are highly likely to scatter before escaping."},
      {type:"formula",name:"Source Function",tex:"S_\\nu=\\frac{j_\\nu}{\\alpha_\\nu}",tag:"Definition",formula:"S_\\nu=\\frac{j_\\nu}{\\alpha_\\nu}",details:"The ratio of the emission coefficient to the absorption coefficient, dictating the local thermodynamic 'goal' the light field is trying to reach."},
      {type:"formula",name:"Formal Solution",tex:"I_\\nu(s) = I_\\nu(0)e^{-\\tau_\\nu} + \\int_0^s j_\\nu(s') e^{-[\\tau_\\nu(s)-\\tau_\\nu(s')]} ds'",tag:"Solution",formula:"I_\\nu(s) = I_\\nu(0)e^{-\\tau_\\nu} + \\int_0^s j_\\nu(s') e^{-[\\tau_\\nu(s)-\\tau_\\nu(s')]} ds'",details:"The integral solution utilized heavily in ray-tracing and astrophysical rendering to calculate exactly what an observer sees looking through a glowing, absorbing cloud."}
    ]}
  ]},
  { id: "thermo", title: "5. Thermodynamics & Statistical Mechanics", sections: [
    { title: "Laws & Potentials", items: [
      {type:"formula",name:"First Law of Thermodynamics",tex:"dU=TdS-PdV+\\mu dN",tag:"Conservation",formula:"dU=TdS-PdV+\\mu dN",details:"The fundamental thermodynamic relation encapsulating energy conservation, linking internal energy changes to heat flow, mechanical work, and chemical mass transfer."},
      {type:"formula",name:"Second Law of Thermodynamics",tex:"dS\\geq\\frac{\\delta Q}{T}",tag:"Entropy",formula:"dS\\geq\\frac{\\delta Q}{T}",details:"The arrow of time. It dictates that the total entropy of an isolated system can never decrease, defining the strict irreversibility of natural processes."},
      {type:"formula",name:"Helmholtz Free Energy",tex:"F=U-TS",tag:"Potential",formula:"F=U-TS",details:"A thermodynamic potential mapping the 'useful' work obtainable from a closed system operating at a perfectly constant temperature and volume."},
      {type:"formula",name:"Gibbs Free Energy",tex:"G=U+PV-TS",tag:"Potential",formula:"G=U+PV-TS",details:"The most vital potential for chemistry and biology, determining the spontaneity of processes under constant pressure and temperature conditions."},
      {type:"formula",name:"Enthalpy",tex:"H=U+PV",tag:"Potential",formula:"H=U+PV",details:"A measure of total heat content in a system, accounting for both the internal energy and the boundary work required to displace its environment."},
      {type:"formula",name:"Chemical Potential",tex:"\\mu= \\left( \\frac{\\partial U}{\\partial N} \\right)_{S,V}",tag:"Property",formula:"\\mu= \\left( \\frac{\\partial U}{\\partial N} \\right)_{S,V}",details:"The thermodynamic driving force governing phase transitions and chemical reactions, measuring how much energy shifts when one particle is added."}
    ]},
    { title: "Statistical Distributions", items: [
      {type:"formula",name:"Fermi-Dirac Distribution",tex:"f(E)= \\frac1{e^{(E-\\mu)/k_BT}+1}",tag:"Quantum Stats",formula:"f(E)= \\frac1{e^{(E-\\mu)/k_BT}+1}",details:"The statistical probability function dictating the energy states of Fermions (electrons, protons). It strictly enforces the Pauli exclusion principle (max 1 particle per state)."},
      {type:"formula",name:"Bose-Einstein Distribution",tex:"f(E)= \\frac1{e^{(E-\\mu)/k_BT}-1}",tag:"Quantum Stats",formula:"f(E)= \\frac1{e^{(E-\\mu)/k_BT}-1}",details:"The statistical function for Bosons (photons, gluons). Without exclusion limits, these particles tend to 'clump' into the same low energy states, leading to condensates."},
      {type:"formula",name:"Fermi Momentum",tex:"p_F=\\hbar(3\\pi^2n)^{1/3}",tag:"Degeneracy",formula:"p_F=\\hbar(3\\pi^2n)^{1/3}",details:"The absolute highest momentum state occupied by an electron gas at absolute zero. This extreme quantum crowding is what prevents white dwarfs from collapsing."},
      {type:"formula",name:"Relativistic Energy Relation",tex:"E=\\sqrt{p^2c^2+m^2c^4}",tag:"Kinematics",formula:"E=\\sqrt{p^2c^2+m^2c^4}",details:"The complete Pythagorean energy triangle of special relativity, seamlessly blending the rest-mass energy concept with dynamic momentum."}
    ]}
  ]},
  { id: "qm", title: "6. Quantum Mechanics & Quantum Statistics", sections: [
    { title: "Core Formalism", items: [
      {type:"formula",name:"Commutation Relation",tex:"[\\hat x,\\hat p]=i\\hbar",tag:"Operators",formula:"[\\hat x,\\hat p]=i\\hbar",details:"The mathematical heart of quantum mechanics. It proves that measuring position changes momentum, and vice versa, directly yielding the Heisenberg Uncertainty Principle."},
      {type:"formula",name:"Time-Independent Schrödinger Eq",tex:"\\hat H\\psi=E\\psi",tag:"Wave Equation",formula:"\\hat H\\psi=E\\psi",details:"An eigenvalue equation where acting the Hamiltonian (energy) operator on a quantum wavefunction yields the exact distinct, quantized energy levels of the system."},
      {type:"formula",name:"Expectation Value",tex:"\\langle A\\rangle = \\int\\psi^*\\hat A\\psi\\,d^3x",tag:"Measurement",formula:"\\langle A\\rangle = \\int\\psi^*\\hat A\\psi\\,d^3x",details:"Calculates the statistical average outcome of an observable property (like position) over many identical quantum measurements."},
      {type:"formula",name:"Heisenberg Equation of Motion",tex:"\\frac{d\\hat A}{dt} = \\frac{i}{\\hbar}[\\hat H,\\hat A] + \\frac{\\partial\\hat A}{\\partial t}",tag:"Evolution",formula:"\\frac{d\\hat A}{dt} = \\frac{i}{\\hbar}[\\hat H,\\hat A] + \\frac{\\partial\\hat A}{\\partial t}",details:"The Heisenberg picture of QM, where quantum states remain static but the observable mathematical operators themselves evolve forward through time."}
    ]},
    { title: "Fermion Physics", items: [
      {type:"text",content:"Pauli Exclusion Principle dictates that fermionic wavefunctions must be fully antisymmetric under particle exchange."},
      {type:"formula",name:"Fermi Energy",tex:"E_F= \\sqrt{p_F^2c^2+m^2c^4}",tag:"Energy Threshold",formula:"E_F= \\sqrt{p_F^2c^2+m^2c^4}",details:"The kinetic energy of the highest occupied quantum state in a fermionic system at absolute zero, a critical concept in stellar collapse thermodynamics."}
    ]}
  ]},
  { id: "sr", title: "7. Special Relativity", sections: [
    { title: "Four-Vectors & Kinematics", items: [
      {type:"formula",name:"Four-Velocity",tex:"u^\\mu=\\frac{dx^\\mu}{d\\tau}",tag:"Kinematics",formula:"u^\\mu=\\frac{dx^\\mu}{d\\tau}",details:"The relativistic analog of velocity, measured strictly against proper time (the ticking clock attached directly to the moving object). Its magnitude is always exactly 'c'."},
      {type:"formula",name:"Four-Momentum",tex:"p^\\mu=mu^\\mu",tag:"Dynamics",formula:"p^\\mu=mu^\\mu",details:"Fuses classical 3D momentum and total relativistic energy into a single cohesive, unified spacetime vector that is strictly conserved in collisions."},
      {type:"formula",name:"Four-Acceleration",tex:"a^\\mu=\\frac{du^\\mu}{d\\tau}",tag:"Dynamics",formula:"a^\\mu=\\frac{du^\\mu}{d\\tau}",details:"The derivative of 4-velocity. Fascinatingly, because 4-velocity has a fixed magnitude, 4-acceleration is always perfectly orthogonal to it in spacetime."},
      {type:"formula",name:"Four-Current",tex:"J^\\mu=(c\\rho,\\mathbf J)",tag:"Electrodynamics",formula:"J^\\mu=(c\\rho,\\mathbf J)",details:"Combines static charge density and moving electrical current density into a singular relativistic tensor component."},
      {type:"formula",name:"Relativistic Doppler Effect",tex:"\\nu_\\mathrm{obs} = \\nu_\\mathrm{emit} \\sqrt{\\frac{1-\\beta}{1+\\beta}}",tag:"Observable",formula:"\\nu_\\mathrm{obs} = \\nu_\\mathrm{emit} \\sqrt{\\frac{1-\\beta}{1+\\beta}}",details:"Calculates exactly how much light shifts into the red or blue spectrum depending on the extreme velocity of the object emitting it."}
    ]},
    { title: "Energy & Invariants", items: [
      {type:"formula",name:"Relativistic Kinetic Energy",tex:"K=(\\gamma-1)mc^2",tag:"Energy",formula:"K=(\\gamma-1)mc^2",details:"The true form of kinetic energy that approaches infinity as velocity approaches 'c', heavily deviating from the classical 1/2mv^2 at high speeds."},
      {type:"formula",name:"Energy-Momentum Invariant",tex:"E^2-p^2c^2=m^2c^4",tag:"Invariant",formula:"E^2-p^2c^2=m^2c^4",details:"The ultimate invariant of special relativity. No matter how fast an observer is moving, taking the total energy squared minus momentum squared always spits out the object's rest mass."}
    ]}
  ]},
  { id: "gr", title: "8. General Relativity", sections: [
    { title: "Curvature & Field Equations", items: [
      {type:"formula",name:"Riemann Curvature Tensor",tex:"R^\\rho_{\\ \\sigma\\mu\\nu} = \\partial_\\mu\\Gamma^\\rho_{\\nu\\sigma} -\\partial_\\nu\\Gamma^\\rho_{\\mu\\sigma} +\\Gamma^\\rho_{\\mu\\lambda}\\Gamma^\\lambda_{\\nu\\sigma} -\\Gamma^\\rho_{\\nu\\lambda}\\Gamma^\\lambda_{\\mu\\sigma}",tag:"Geometry",formula:"R^\\rho_{\\ \\sigma\\mu\\nu} = \\partial_\\mu\\Gamma^\\rho_{\\nu\\sigma} -\\partial_\\nu\\Gamma^\\rho_{\\mu\\sigma} +\\Gamma^\\rho_{\\mu\\lambda}\\Gamma^\\lambda_{\\nu\\sigma} -\\Gamma^\\rho_{\\nu\\lambda}\\Gamma^\\lambda_{\\mu\\sigma}",details:"The massive computational 4D tensor that mathematically encodes every single facet of how a given region of spacetime curves, twists, and warps."},
      {type:"formula",name:"Ricci Tensor & Scalar",tex:"R_{\\mu\\nu} = R^\\rho_{\\ \\mu\\rho\\nu} \\quad,\\quad R=g^{\\mu\\nu}R_{\\mu\\nu}",tag:"Geometry Traces",formula:"R_{\\mu\\nu} = R^\\rho_{\\ \\mu\\rho\\nu} \\quad,\\quad R=g^{\\mu\\nu}R_{\\mu\\nu}",details:"Contracted, reduced versions of the Riemann tensor that isolate how the volume of a localized sphere changes uniquely due to the curvature of spacetime."},
      {type:"formula",name:"Einstein Tensor",tex:"G_{\\mu\\nu} = R_{\\mu\\nu} -\\frac12Rg_{\\mu\\nu}",tag:"Geometry",formula:"G_{\\mu\\nu} = R_{\\mu\\nu} -\\frac12Rg_{\\mu\\nu}",details:"A strictly divergence-free geometry matrix built from the Ricci tensor. Because its divergence is zero, it perfectly balances with the conserved energy of the universe."},
      {type:"formula",name:"Einstein Field Equation",tex:"G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}",tag:"Field Equation",formula:"G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}",details:"The magnum opus equation of GR: The left side defines the curvature of space, and the right side defines the mass/energy causing it. 'Matter tells space how to curve; space tells matter how to move.'"},
      {type:"formula",name:"Einstein-Hilbert Action",tex:"S_{EH} = \\frac{c^3}{16\\pi G} \\int(R-2\\Lambda)\\sqrt{-g}\\,d^4x",tag:"Action",formula:"S_{EH} = \\frac{c^3}{16\\pi G} \\int(R-2\\Lambda)\\sqrt{-g}\\,d^4x",details:"The ultimate Lagrangian density for the entire universe. Minimizing this action integral rigorously derives the Einstein Field Equations from first principles."},
      {type:"formula",name:"Energy-Momentum Conservation",tex:"\\nabla_\\mu T^{\\mu\\nu}=0",tag:"Conservation",formula:"\\nabla_\\mu T^{\\mu\\nu}=0",details:"The covariant statement that local mass and energy are perfectly conserved, gracefully shifting the classical derivative to account for curved space."},
      {type:"formula",name:"Geodesic Equation",tex:"\\frac{d^2x^\\mu}{d\\lambda^2} + \\Gamma^\\mu_{\\alpha\\beta} \\frac{dx^\\alpha}{d\\lambda} \\frac{dx^\\beta}{d\\lambda} = 0",tag:"Motion",formula:"\\frac{d^2x^\\mu}{d\\lambda^2} + \\Gamma^\\mu_{\\alpha\\beta} \\frac{dx^\\alpha}{d\\lambda} \\frac{dx^\\beta}{d\\lambda} = 0",details:"The equation defining a 'straight line' in curved spacetime. It dictates exactly how planets, stars, and light fall freely under the sole influence of gravity."}
    ]}
  ]},
  { id: "stellar", title: "9. Stellar Structure & Nuclear Physics", sections: [
    { title: "Equations of Stellar Structure", items: [
      {type:"formula",name:"Mass Conservation",tex:"\\frac{dm}{dr}=4\\pi r^2\\rho",tag:"Structure",formula:"\\frac{dm}{dr}=4\\pi r^2\\rho",details:"An integration proving that the mass enclosed at any radius within a star is simply the sum of all the spherical density shells beneath it."},
      {type:"formula",name:"Hydrostatic Equilibrium",tex:"\\frac{dP}{dr} = -\\frac{Gm\\rho}{r^2}",tag:"Structure",formula:"\\frac{dP}{dr} = -\\frac{Gm\\rho}{r^2}",details:"The delicate balance that keeps a star alive: the outward pressure gradient generated by fusion perfectly counters the immense inward crush of gravity."},
      {type:"formula",name:"Energy Generation",tex:"\\frac{dL}{dr} = 4\\pi r^2\\rho\\epsilon",tag:"Structure",formula:"\\frac{dL}{dr} = 4\\pi r^2\\rho\\epsilon",details:"Calculates how a star's luminosity grows as you move outward from the core, driven entirely by the local nuclear energy generation rate of the plasma."},
      {type:"formula",name:"Radiative Energy Transport",tex:"\\frac{dT}{dr} = -\\frac{3\\kappa\\rho L}{16\\pi acT^3r^2}",tag:"Transport",formula:"\\frac{dT}{dr} = -\\frac{3\\kappa\\rho L}{16\\pi acT^3r^2}",details:"Describes how heat physically diffuses outward through the star's opaque radiative zones, forcing photons into a brutal, million-year random walk to the surface."}
    ]},
    { title: "Nuclear & Opacity", items: [
      {type:"formula",name:"Nuclear Reaction Rate",tex:"r_{12} = n_1n_2\\langle\\sigma v\\rangle",tag:"Nuclear Physics",formula:"r_{12} = n_1n_2\\langle\\sigma v\\rangle",details:"Calculates the frequency of stellar fusion reactions based on particle density and the velocity-averaged quantum tunneling cross-sections."},
      {type:"formula",name:"Energy Release (Q-value)",tex:"Q=\\Delta mc^2",tag:"Energy",formula:"Q=\\Delta mc^2",details:"The total energy liberated by a single fusion reaction, derived entirely from the tiny fraction of mass lost when light nuclei fuse into heavier ones."},
      {type:"text",content:"Total energy generation $\\epsilon$ includes nuclear energy $\\epsilon_{nuc}$ minus neutrino losses $\\epsilon_\\nu$. Opacity $\\kappa$ aggregates electron scattering, free-free, bound-free, and bound-bound transitions."}
    ]}
  ]},
  { id: "dwarfs", title: "10. White Dwarfs & Brown Dwarfs", sections: [
    { title: "White Dwarfs", items: [
      {type:"formula",name:"Electron Number Density",tex:"n_e=\\frac{\\rho}{\\mu_em_u}",tag:"State Variable",formula:"n_e=\\frac{\\rho}{\\mu_em_u}",details:"The sheer packing density of electrons inside a dead star's core, setting the stage for quantum degeneracy pressure to take over."},
      {type:"formula",name:"Non-Relativistic Degeneracy",tex:"P\\propto\\rho^{5/3} \\implies R\\propto M^{-1/3}",tag:"EOS",formula:"P\\propto\\rho^{5/3} \\implies R\\propto M^{-1/3}",details:"A bizarre quantum paradox: because pressure scales non-linearly, if you add mass to a normal white dwarf, it actually shrinks in size."},
      {type:"formula",name:"Ultra-Relativistic Degeneracy",tex:"P\\propto\\rho^{4/3}",tag:"EOS",formula:"P\\propto\\rho^{4/3}",details:"As the dwarf gets heavier, electrons are pushed to near-light speeds, softening the pressure equation and leaving the star dangerously vulnerable to collapse."},
      {type:"formula",name:"Chandrasekhar Mass Limit",tex:"M_{Ch} \\approx \\frac{5.83}{\\mu_e^2}M_\\odot",tag:"Stability Limit",formula:"M_{Ch} \\approx \\frac{5.83}{\\mu_e^2}M_\\odot",details:"The absolute maximum mass (approx 1.4 Solar Masses) a white dwarf can possess before electron degeneracy fails, resulting in a Type Ia Supernova."}
    ]},
    { title: "Brown Dwarfs", items: [
      {type:"text",content:"Supported by ideal gas pressure, electron degeneracy, and partial degeneracy. Ruled by Kelvin-Helmholtz cooling."},
      {type:"formula",name:"Surface Luminosity",tex:"L=4\\pi R^2\\sigma T_\\mathrm{eff}^4",tag:"Emission",formula:"L=4\\pi R^2\\sigma T_\\mathrm{eff}^4",details:"Models the faint, fading glow of a brown dwarf over billions of years as it slowly bleeds away its primordial gravitational contraction heat."}
    ]}
  ]},
  { id: "neutron_stars", title: "11. Neutron Stars", sections: [
    { title: "Relativistic Structure", items: [
      {type:"formula",name:"Mass Equation",tex:"\\frac{dm}{dr}=4\\pi r^2\\epsilon/c^2",tag:"Structure",formula:"\\frac{dm}{dr}=4\\pi r^2\\epsilon/c^2",details:"The general relativistic update to stellar mass. Because energy and pressure themselves gravitate, we must integrate total energy density, not just rest mass."},
      {type:"formula",name:"TOV Equation",tex:"\\frac{dP}{dr} = -\\frac{G \\left(\\rho+\\frac{P}{c^2}\\right) \\left(m+\\frac{4\\pi r^3P}{c^2}\\right)}{r^2 \\left(1-\\frac{2Gm}{rc^2}\\right)}",tag:"Structure",formula:"\\frac{dP}{dr} = -\\frac{G \\left(\\rho+\\frac{P}{c^2}\\right) \\left(m+\\frac{4\\pi r^3P}{c^2}\\right)}{r^2 \\left(1-\\frac{2Gm}{rc^2}\\right)}",details:"The Tolman-Oppenheimer-Volkoff equation. The extreme relativistic version of hydrostatic equilibrium governing the crushingly dense interior of a neutron star."},
      {type:"formula",name:"Equation of State Closure",tex:"P=P(\\epsilon)",tag:"Closure",formula:"P=P(\\epsilon)",details:"The holy grail of nuclear astrophysics: the unproven mathematical relationship dictating exactly how neutron-degenerate matter behaves at nuclear densities."},
      {type:"formula",name:"Boundary Conditions",tex:"m(0)=0 \\quad,\\quad P(0)=P_c \\quad,\\quad P(R)=0",tag:"Integration Limits",formula:"m(0)=0 \\quad,\\quad P(0)=P_c \\quad,\\quad P(R)=0",details:"The required mathematical starting and ending points for simulating a stellar model inside a computer."}
    ]},
    { title: "Observables & Deformation", items: [
      {type:"formula",name:"Compactness",tex:"C=\\frac{GM}{Rc^2}",tag:"Parameter",formula:"C=\\frac{GM}{Rc^2}",details:"A dimensionless parameter measuring how dangerously close a star is to becoming a black hole. For a black hole, C = 0.5."},
      {type:"formula",name:"Surface Redshift",tex:"1+z= \\left(1-\\frac{2GM}{Rc^2}\\right)^{-1/2}",tag:"Observable",formula:"1+z= \\left(1-\\frac{2GM}{Rc^2}\\right)^{-1/2}",details:"Predicts exactly how much light emitted from the crust of a neutron star gets stretched into the red spectrum merely by fighting its way out of the gravity well."},
      {type:"formula",name:"Binding Energy",tex:"E_B=(M_b-M_g)c^2",tag:"Energy",formula:"E_B=(M_b-M_g)c^2",details:"The massive amount of energy (often blown out as a supernova) released during core collapse, measured as the difference between original particle mass and final warped gravitational mass."},
      {type:"formula",name:"Tidal Deformability",tex:"\\Lambda= \\frac23k_2C^{-5}",tag:"Property",formula:"\\Lambda= \\frac23k_2C^{-5}",details:"Measures how easily a neutron star's shape squishes in the gravitational grip of a binary partner. Crucial for interpreting LIGO gravitational wave signals."},
      {type:"formula",name:"Moment of Inertia & Rot Energy",tex:"J=I\\Omega \\quad,\\quad E_\\mathrm{rot} = \\frac12I\\Omega^2",tag:"Kinematics",formula:"J=I\\Omega \\quad,\\quad E_\\mathrm{rot} = \\frac12I\\Omega^2",details:"Standard rotational mechanics applied to neutron stars. Because they are so small and dense, their rotational kinetic energies can rival stellar explosions."}
    ]}
  ]},
  { id: "pulsars", title: "12. Pulsars & Magnetars", sections: [
    { title: "Pulsar Rotation & Emission", items: [
      {type:"formula",name:"Period & Rotational Energy Loss",tex:"P=\\frac{2\\pi}{\\Omega} \\quad,\\quad \\dot E_\\mathrm{rot} = -I\\Omega\\dot\\Omega",tag:"Kinematics",formula:"P=\\frac{2\\pi}{\\Omega} \\quad,\\quad \\dot E_\\mathrm{rot} = -I\\Omega\\dot\\Omega",details:"Connects the observable 'pulsing' period directly to the immense rate at which the star is bleeding rotational energy out into the surrounding nebula."},
      {type:"formula",name:"Magnetic Dipole Field",tex:"B_r=\\frac{2\\mu\\cos\\theta}{r^3} \\quad,\\quad B_\\theta= \\frac{\\mu\\sin\\theta}{r^3}",tag:"Magnetosphere",formula:"B_r=\\frac{2\\mu\\cos\\theta}{r^3} \\quad,\\quad B_\\theta= \\frac{\\mu\\sin\\theta}{r^3}",details:"Maps the invisible, looping magnetic field lines ripping through space around the neutron star, which ultimately guide charged particles to create the lighthouse beam."},
      {type:"formula",name:"Dipole Spin-Down Radiation",tex:"\\dot E = -\\frac{2\\mu^2\\Omega^4\\sin^2\\alpha}{3c^3}",tag:"Energy Loss",formula:"\\dot E = -\\frac{2\\mu^2\\Omega^4\\sin^2\\alpha}{3c^3}",details:"The Larmor formula predicting how an offset, spinning magnetic dipole acts as a colossal generator, violently radiating electromagnetic waves into the vacuum."},
      {type:"formula",name:"Braking Index",tex:"n= \\frac{\\Omega\\ddot\\Omega}{\\dot\\Omega^2}",tag:"Evolution",formula:"n= \\frac{\\Omega\\ddot\\Omega}{\\dot\\Omega^2}",details:"An observational diagnostic tool that uses precise timing of a pulsar's spin-down rate over decades to infer exactly what physical mechanism is braking it."},
      {type:"formula",name:"Light Cylinder",tex:"R_{LC}=\\frac c\\Omega",tag:"Boundary",formula:"R_{LC}=\\frac c\\Omega",details:"The deadly perimeter around a spinning pulsar where magnetic field lines would have to whip around faster than the speed of light to remain rigid. They break here, launching winds."},
      {type:"formula",name:"Goldreich-Julian Density",tex:"\\rho_{GJ} \\approx -\\frac{\\mathbf\\Omega\\cdot\\mathbf B}{2\\pi c}",tag:"Plasma",formula:"\\rho_{GJ} \\approx -\\frac{\\mathbf\\Omega\\cdot\\mathbf B}{2\\pi c}",details:"Proves the vacuum around a pulsar is completely unstable. The electric forces rip particles off the crust to form a dense, co-rotating plasma magnetosphere."}
    ]},
    { title: "Magnetars", items: [
      {type:"formula",name:"Magnetic Energy Density",tex:"u_B=\\frac{B^2}{8\\pi}",tag:"Energy",formula:"u_B=\\frac{B^2}{8\\pi}",details:"The raw stress placed on the neutron star crust by its trillion-gauss field. When the crust snaps under this tension, it triggers a massive starquake and gamma-ray burst."},
      {type:"formula",name:"Ohmic Decay Timescale",tex:"t_\\mathrm{Ohm}\\sim\\frac{L^2}{\\eta}",tag:"Timescale",formula:"t_\\mathrm{Ohm}\\sim\\frac{L^2}{\\eta}",details:"Estimates how millions of years it takes for electrical resistance in the neutron star crust to slowly dissipate the intense magnetic fields."},
      {type:"formula",name:"Hall Drift Timescale",tex:"t_\\mathrm{Hall} \\sim \\frac{4\\pi en_eL^2}{cB}",tag:"Timescale",formula:"t_\\mathrm{Hall} \\sim \\frac{4\\pi en_eL^2}{cB}",details:"The rapid, non-dissipative timescale where electron flow twists and tangles the magnetic field lines inside the crust, accelerating magnetar outbursts."}
    ]}
  ]},
  { id: "bh_physics", title: "13. Black Hole Physics", sections: [
    { title: "Non-Rotating Black Holes", items: [
      {type:"text",content:"Schwarzschild (mass $M$) and Reissner-Nordström (mass $M$, charge $Q$)."},
      {type:"formula",name:"Schwarzschild Metric",tex:"ds^2= -\\left(1-\\frac{2GM}{rc^2}\\right)c^2dt^2 + \\left(1-\\frac{2GM}{rc^2}\\right)^{-1}dr^2 +r^2d\\Omega^2",tag:"Spacetime",formula:"ds^2= -\\left(1-\\frac{2GM}{rc^2}\\right)c^2dt^2 + \\left(1-\\frac{2GM}{rc^2}\\right)^{-1}dr^2 +r^2d\\Omega^2",details:"The first exact solution to Einstein's equations. It describes the perfectly spherical, non-spinning void of spacetime surrounding a stationary black hole."},
      {type:"formula",name:"Reissner-Nordström Horizons",tex:"r_\\pm = \\frac{GM}{c^2} \\pm \\sqrt{ \\left(\\frac{GM}{c^2}\\right)^2 - \\frac{GQ^2}{4\\pi\\epsilon_0c^4} }",tag:"Horizons",formula:"r_\\pm = \\frac{GM}{c^2} \\pm \\sqrt{ \\left(\\frac{GM}{c^2}\\right)^2 - \\frac{GQ^2}{4\\pi\\epsilon_0c^4} }",details:"Describes a black hole carrying an electric charge. The math splits the event horizon into an outer 'point of no return' and a bizarre inner Cauchy horizon."}
    ]},
    { title: "Rotating (Kerr) Black Holes", items: [
      {type:"text",content:"Kerr (mass $M$, spin $J$). Parameters: $a=J/Mc$, $a_*=cJ/GM^2$, $\\Sigma=r^2+a^2\\cos^2\\theta$, $\\Delta=r^2-2r_gr+a^2$."},
      {type:"formula",name:"Kerr Metric",tex:"ds^2= -\\left(1-\\frac{2r_gr}{\\Sigma}\\right)c^2dt^2 -\\frac{4r_gar\\sin^2\\theta}{\\Sigma}c\\,dt\\,d\\phi +\\frac{\\Sigma}{\\Delta}dr^2 +\\Sigma d\\theta^2 + \\left( r^2+a^2+ \\frac{2r_ga^2r\\sin^2\\theta}{\\Sigma} \\right) \\sin^2\\theta\\,d\\phi^2",tag:"Spacetime",formula:"ds^2= -\\left(1-\\frac{2r_gr}{\\Sigma}\\right)c^2dt^2 -\\frac{4r_gar\\sin^2\\theta}{\\Sigma}c\\,dt\\,d\\phi +\\frac{\\Sigma}{\\Delta}dr^2 +\\Sigma d\\theta^2 + \\left( r^2+a^2+ \\frac{2r_ga^2r\\sin^2\\theta}{\\Sigma} \\right) \\sin^2\\theta\\,d\\phi^2",details:"The terrifyingly complex, asymmetrical spacetime geometry defining every real, spinning black hole in the universe. It features frame-dragging, pulling space itself along for the ride."},
      {type:"formula",name:"Event Horizons",tex:"r_\\pm= r_g \\pm \\sqrt{r_g^2-a^2}",tag:"Horizons",formula:"r_\\pm= r_g \\pm \\sqrt{r_g^2-a^2}",details:"Calculates the inner and outer horizons for a spinning black hole. If it spins too fast, the math breaks, creating a theoretically forbidden 'naked singularity'."},
      {type:"formula",name:"Ergosphere",tex:"r_\\mathrm{ergo} = r_g+\\sqrt{r_g^2-a^2\\cos^2\\theta}",tag:"Boundary",formula:"r_\\mathrm{ergo} = r_g+\\sqrt{r_g^2-a^2\\cos^2\\theta}",details:"The pumpkin-shaped region outside the horizon where space is dragged faster than light. You can enter and exit this zone, allowing advanced civilizations to theoretically harvest energy from the spin."}
    ]},
    { title: "Geodesics & Rendering", items: [
      {type:"formula",name:"First-Order Kerr Geodesics",tex:"\\Sigma^2 \\left(\\frac{dr}{d\\lambda}\\right)^2 = \\mathcal R(r) \\quad,\\quad \\Sigma^2 \\left(\\frac{d\\theta}{d\\lambda}\\right)^2 = \\Theta(\\theta)",tag:"Motion",formula:"\\Sigma^2 \\left(\\frac{dr}{d\\lambda}\\right)^2 = \\mathcal R(r) \\quad,\\quad \\Sigma^2 \\left(\\frac{d\\theta}{d\\lambda}\\right)^2 = \\Theta(\\theta)",details:"The miraculously solvable equations of motion discovered by Brandon Carter, allowing modern computers to accurately trace the warped path of light around a spinning black hole."},
      {type:"formula",name:"Photon Orbits (Spherical)",tex:"\\mathcal R=0 \\quad,\\quad \\frac{d\\mathcal R}{dr}=0",tag:"Constraints",formula:"\\mathcal R=0 \\quad,\\quad \\frac{d\\mathcal R}{dr}=0",details:"The razor-thin unstable sphere where gravity perfectly traps light in a continuous circular orbit. Light that deviates slightly will either spiral in to death or escape to our telescopes."},
      {type:"formula",name:"Black Hole Shadow Coordinates",tex:"\\alpha=-\\frac{\\xi}{\\sin\\theta_o} \\quad,\\quad \\beta= \\pm \\sqrt{ \\eta+a^2\\cos^2\\theta_o-\\xi^2\\cot^2\\theta_o }",tag:"Image Plane",formula:"\\alpha=-\\frac{\\xi}{\\sin\\theta_o} \\quad,\\quad \\beta= \\pm \\sqrt{ \\eta+a^2\\cos^2\\theta_o-\\xi^2\\cot^2\\theta_o }",details:"Maps the mathematically distorted edge of the black hole's silhouette exactly as it would hit the 'pixels' of a distant observer's camera or telescope."},
      {type:"formula",name:"Relativistic Redshift",tex:"g= \\frac{-k_\\mu u^\\mu_\\mathrm{obs}}{-k_\\mu u^\\mu_\\mathrm{emit}}",tag:"Observable",formula:"g= \\frac{-k_\\mu u^\\mu_\\mathrm{obs}}{-k_\\mu u^\\mu_\\mathrm{emit}}",details:"The universal redshift formula used by ray-tracing engines, factoring in both the extreme gravity of the hole and the fierce relativistic Doppler shift of the glowing accretion disk."}
    ]}
  ]},
  { id: "bh_thermo", title: "14. Black Hole Thermodynamics", sections: [
    { title: "Properties & Laws", items: [
      {type:"formula",name:"Horizon Area (Kerr)",tex:"A=4\\pi(r_+^2+a^2)",tag:"Geometry",formula:"A=4\\pi(r_+^2+a^2)",details:"The physical surface area of the event horizon, which Stephen Hawking proved can never decrease over time during classical physical processes."},
      {type:"formula",name:"Surface Gravity",tex:"\\kappa= \\frac{c^2(r_+-r_-)}{2(r_+^2+a^2)}",tag:"Geometry",formula:"\\kappa= \\frac{c^2(r_+-r_-)}{2(r_+^2+a^2)}",details:"The acceleration a distant observer calculates for an object hovering exactly at the horizon. This directly dictates the temperature of Hawking radiation."},
      {type:"text",content:"STATUS: Hawking Radiation is a semiclassical theoretical prediction; not directly experimentally detected."},
      {type:"formula",name:"Bekenstein-Hawking Entropy",tex:"S_{BH} = \\frac{k_Bc^3A}{4G\\hbar}",tag:"Thermodynamics",formula:"S_{BH} = \\frac{k_Bc^3A}{4G\\hbar}",details:"A groundbreaking formula suggesting that a black hole's information content is entirely stored on its 2D surface boundary, launching the holographic principle of the universe."},
      {type:"formula",name:"Horizon Angular Velocity",tex:"\\Omega_H= \\frac{ac}{r_+^2+a^2}",tag:"Kinematics",formula:"\\Omega_H= \\frac{ac}{r_+^2+a^2}",details:"The rate at which the absolute fabric of spacetime itself is spinning exactly at the event horizon boundary. To stand still here requires faster-than-light travel."},
      {type:"formula",name:"First Law of BH Mechanics",tex:"d(Mc^2) = T_HdS+\\Omega_HdJ+\\Phi_HdQ",tag:"Conservation",formula:"d(Mc^2) = T_HdS+\\Omega_HdJ+\\Phi_HdQ",details:"The stunning realization that the geometric equations governing black holes perfectly map onto the classical laws of thermodynamics, linking gravity, quantum mechanics, and heat."}
    ]}
  ]},
  { id: "accretion", title: "15. Accretion Disks & Relativistic Astrophysics", sections: [
    { title: "Disk Physics", items: [
      {type:"formula",name:"Mass Accretion Rate",tex:"\\dot M = 4\\pi r^2\\rho v_r",tag:"Flow",formula:"\\dot M = 4\\pi r^2\\rho v_r",details:"Calculates the total mass per second actively dumping into the black hole, linking gas density and the inward spiral velocity."},
      {type:"formula",name:"Eddington Ratio",tex:"\\lambda_{Edd} = \\frac{L}{L_{Edd}}",tag:"Parameter",formula:"\\lambda_{Edd} = \\frac{L}{L_{Edd}}",details:"A ratio defining how violently a black hole is feeding. If it nears 1.0, the sheer outward pressure of radiation will literally blow the incoming gas away."},
      {type:"formula",name:"Innermost Stable Circular Orbit (Kerr)",tex:"r_\\mathrm{ISCO} = r_g \\left[ 3+Z_2 - s\\sqrt{(3-Z_1)(3+Z_1+2Z_2)} \\right]",tag:"Boundary",formula:"r_\\mathrm{ISCO} = r_g \\left[ 3+Z_2 - s\\sqrt{(3-Z_1)(3+Z_1+2Z_2)} \\right]",details:"The absolute inner edge of the accretion disk. Gas crossing this invisible line loses all orbital stability and plunges silently into the void."}
    ]},
    { title: "Relativistic Ray Tracing Pipeline", items: [
      {type:"text",content:"Simulation logic: metric $\\rightarrow$ geodesic $\\rightarrow$ redshift $g$ $\\rightarrow$ intensity $I_\\nu$ $\\rightarrow$ pixel."},
      {type:"formula",name:"Invariant Intensity (Liouville)",tex:"I_{\\nu,\\mathrm{obs}} = g^3I_{\\nu,\\mathrm{emit}}",tag:"Rendering",formula:"I_{\\nu,\\mathrm{obs}} = g^3I_{\\nu,\\mathrm{emit}}",details:"A core rendering equation enforcing the fact that photons conserve their phase-space density. It perfectly translates disk emission into the warped brightness we see on Earth."}
    ]}
  ]},
  { id: "quasars_jets", title: "16. Quasars, Relativistic Jets & High-Energy", sections: [
    { title: "Jet Kinematics & Mechanics", items: [
      {type:"formula",name:"Doppler Factor",tex:"\\delta= \\frac1{\\Gamma(1-\\beta\\cos\\theta)}",tag:"Kinematics",formula:"\\delta= \\frac1{\\Gamma(1-\\beta\\cos\\theta)}",details:"Quantifies 'relativistic beaming'—when a jet points near Earth at lightspeed, its light is dramatically compressed, making it appear artificially bright and blue-shifted."},
      {type:"formula",name:"Apparent Superluminal Velocity",tex:"\\beta_\\mathrm{app} = \\frac{\\beta\\sin\\theta}{1-\\beta\\cos\\theta}",tag:"Kinematics",formula:"\\beta_\\mathrm{app} = \\frac{\\beta\\sin\\theta}{1-\\beta\\cos\\theta}",details:"An optical illusion where blobs of plasma in a jet appear to move sideways faster than the speed of light because they are almost 'racing' their own emitted light toward us."},
      {type:"text",content:"Blandford-Znajek represents a theoretical GRMHD model for jet launching, relying on magnetic fields threading the Kerr horizon to extract rotational energy."}
    ]},
    { title: "Non-Thermal Emission", items: [
      {type:"formula",name:"Synchrotron Characteristic Frequency",tex:"\\nu_c = \\frac{3}{2}\\gamma^2 \\frac{eB\\sin\\alpha}{2\\pi m_e}",tag:"Radiation",formula:"\\nu_c = \\frac{3}{2}\\gamma^2 \\frac{eB\\sin\\alpha}{2\\pi m_e}",details:"The peak emission frequency of an ultra-fast electron caught in a magnetic field. This is responsible for the bright radio and x-ray emissions seen in quasar jets."},
      {type:"formula",name:"Synchrotron Power",tex:"P_\\mathrm{syn} = \\frac{4}{3} \\sigma_Tc \\gamma^2 \\beta^2 U_B",tag:"Radiation",formula:"P_\\mathrm{syn} = \\frac{4}{3} \\sigma_Tc \\gamma^2 \\beta^2 U_B",details:"The rate at which spiraling electrons bleed away their energy as photons. The more powerful the magnetic field and velocity, the faster they burn out."},
      {type:"formula",name:"Inverse Compton Power",tex:"P_\\mathrm{IC} = \\frac43\\sigma_Tc\\gamma^2\\beta^2U_\\mathrm{rad}",tag:"Radiation",formula:"P_\\mathrm{IC} = \\frac43\\sigma_Tc\\gamma^2\\beta^2U_\\mathrm{rad}",details:"Calculates what happens when a fast electron crashes into a low-energy photon, boosting the photon's energy dramatically into the x-ray or gamma-ray spectrum."},
      {type:"formula",name:"Pair Production Threshold",tex:"E_1E_2(1-\\cos\\theta) \\ge 2(m_ec^2)^2",tag:"QED",formula:"E_1E_2(1-\\cos\\theta) \\ge 2(m_ec^2)^2",details:"The absolute energy limit required for two colliding gamma-ray photons to instantly transform into matter, spontaneously generating an electron and a positron."},
      {type:"formula",name:"Optical Depth (Pair Prod)",tex:"\\tau_{\\gamma\\gamma} = \\int n_\\gamma\\sigma_{\\gamma\\gamma}\\,ds",tag:"Transport",formula:"\\tau_{\\gamma\\gamma} = \\int n_\\gamma\\sigma_{\\gamma\\gamma}\\,ds",details:"Evaluates if a high-energy environment is so choked with light that gamma rays cannot escape without colliding into each other and turning into matter."}
    ]}
  ]},
  { id: "gw", title: "17. Gravitational Waves", sections: [
    { title: "Linearized Gravity & Wave Equations", items: [
      {type:"formula",name:"Linearized Metric",tex:"g_{\\mu\\nu} = \\eta_{\\mu\\nu} + h_{\\mu\\nu}",tag:"Fundamentals",formula:"g_{\\mu\\nu} = \\eta_{\\mu\\nu} + h_{\\mu\\nu}",details:"A simplification of General Relativity assuming space is mostly flat (Minkowski) with only a tiny, oscillating gravitational ripple passing through."},
      {type:"formula",name:"Trace-Reversed Perturbation",tex:"\\bar{h}_{\\mu\\nu} = h_{\\mu\\nu} - \\frac{1}{2}\\eta_{\\mu\\nu}h",tag:"Gauge Theory",formula:"\\bar{h}_{\\mu\\nu} = h_{\\mu\\nu} - \\frac{1}{2}\\eta_{\\mu\\nu}h",details:"A mathematical trick (shifting the gauge) that forces Einstein's incredibly complex equations to simplify down into a standard, recognizable wave equation."},
      {type:"formula",name:"Linearized Einstein Field Equation",tex:"\\square \\bar{h}_{\\mu\\nu} = -\\frac{16\\pi G}{c^4} T_{\\mu\\nu}",tag:"Dynamics",formula:"\\square \\bar{h}_{\\mu\\nu} = -\\frac{16\\pi G}{c^4} T_{\\mu\\nu}",details:"Proves exactly how moving massive objects (like binary black holes) act as the physical source 'ringing' the fabric of spacetime."},
      {type:"formula",name:"Vacuum Wave Equation",tex:"\\square \\bar{h}_{\\mu\\nu} = \\left( -\\frac{1}{c^2}\\frac{\\partial^2}{\\partial t^2} + \\nabla^2 \\right) \\bar{h}_{\\mu\\nu} = 0",tag:"Propagation",formula:"\\square \\bar{h}_{\\mu\\nu} = \\left( -\\frac{1}{c^2}\\frac{\\partial^2}{\\partial t^2} + \\nabla^2 \\right) \\bar{h}_{\\mu\\nu} = 0",details:"The final proof that once a gravitational wave is generated, it propagates entirely freely through the empty vacuum of space exactly at the speed of light."},
      {type:"formula",name:"Plane Wave Solution",tex:"h_{\\mu\\nu} = A_{\\mu\\nu} \\exp(ik_\\alpha x^\\alpha)",tag:"Solutions",formula:"h_{\\mu\\nu} = A_{\\mu\\nu} \\exp(ik_\\alpha x^\\alpha)",details:"The idealized mathematical representation of a gravitational wave ripple by the time it reaches Earth from billions of lightyears away."}
    ]},
    { title: "Waveforms & Binaries", items: [
      {type:"formula",name:"Quadrupole Waveform",tex:"h_{ij}^{TT} \\sim \\frac{2G}{c^4D} \\ddot Q_{ij}^{TT}",tag:"Generation",formula:"h_{ij}^{TT} \\sim \\frac{2G}{c^4D} \\ddot Q_{ij}^{TT}",details:"Shows that gravity waves cannot be generated by simple expanding/contracting spheres; the mass must be sloshing asymmetrically (a quadrupole) to radiate."},
      {type:"formula",name:"Chirp Mass",tex:"\\mathcal M = \\frac{(m_1m_2)^{3/5}}{(m_1+m_2)^{1/5}}",tag:"Parameter",formula:"\\mathcal M = \\frac{(m_1m_2)^{3/5}}{(m_1+m_2)^{1/5}}",details:"The incredibly specific combination of two orbiting masses that dictates the exact shape, timing, and frequency evolution of a gravitational wave 'chirp' signal."},
      {type:"formula",name:"Frequency Evolution",tex:"\\dot f= \\frac{96}{5}\\pi^{8/3} \\left( \\frac{G\\mathcal M}{c^3} \\right)^{5/3} f^{11/3}",tag:"Dynamics",formula:"\\dot f= \\frac{96}{5}\\pi^{8/3} \\left( \\frac{G\\mathcal M}{c^3} \\right)^{5/3} f^{11/3}",details:"Dictates exactly how fast the pitch of the gravitational wave 'chirp' increases as the two black holes violently spiral inward toward their collision."},
      {type:"formula",name:"Time to Coalescence",tex:"\\tau = \\frac{5}{256} \\left( \\frac{G \\mathcal{M}}{c^3} \\right)^{-5/3} (\\pi f)^{-8/3}",tag:"Dynamics",formula:"\\tau = \\frac{5}{256} \\left( \\frac{G \\mathcal{M}}{c^3} \\right)^{-5/3} (\\pi f)^{-8/3}",details:"Provides a countdown timer. Given a detected frequency, this calculates the exact number of seconds remaining until the two stars merge."},
      {type:"formula",name:"Orbital Energy",tex:"E=-\\frac{Gm_1m_2}{2a}",tag:"Dynamics",formula:"E=-\\frac{Gm_1m_2}{2a}",details:"The Newtonian baseline for the total energy trapped in the orbital dance, which will be relentlessly siphoned off by the emitted gravitational waves."},
      {type:"formula",name:"Inspiral Evolution",tex:"\\frac{da}{dt} = -\\frac{64}{5} \\frac{G^3\\mu M^2}{c^5a^3}",tag:"Dynamics",formula:"\\frac{da}{dt} = -\\frac{64}{5} \\frac{G^3\\mu M^2}{c^5a^3}",details:"Calculates the horrifying rate at which the physical distance between two orbiting black holes shrinks as gravity waves bleed away their momentum."}
    ]},
    { title: "Energy, Power & Radiation", items: [
      {type:"formula",name:"Quadrupole Luminosity (Power)",tex:"P = \\frac{G}{5c^5} \\langle \\dddot{Q}_{ij} \\dddot{Q}^{ij} \\rangle",tag:"Radiation",formula:"P = \\frac{G}{5c^5} \\langle \\dddot{Q}_{ij} \\dddot{Q}^{ij} \\rangle",details:"The absolute power output of a gravitational wave event. In the final fraction of a second, merging black holes can outshine the entire observable universe."},
      {type:"formula",name:"Isaacson Stress-Energy Tensor",tex:"t_{\\mu\\nu}^{GW} = \\frac{c^4}{32\\pi G} \\langle \\partial_\\mu h_{ij}^{TT} \\partial_\\nu h^{ij}_{TT} \\rangle",tag:"Energy",formula:"t_{\\mu\\nu}^{GW} = \\frac{c^4}{32\\pi G} \\langle \\partial_\\mu h_{ij}^{TT} \\partial_\\nu h^{ij}_{TT} \\rangle",details:"The mathematical mechanism establishing that gravitational waves themselves carry physical momentum and energy through the universe."},
      {type:"formula",name:"Energy Flux",tex:"\\mathcal{F} = \\frac{c^3}{16\\pi G} \\langle \\dot{h}_+^2 + \\dot{h}_\\times^2 \\rangle",tag:"Measurement",formula:"\\mathcal{F} = \\frac{c^3}{16\\pi G} \\langle \\dot{h}_+^2 + \\dot{h}_\\times^2 \\rangle",details:"The amount of gravitational wave energy washing across a square meter of Earth's surface per second, dependent purely on the wave's strain and frequency."}
    ]},
    { title: "Detection & Polarization", items: [
      {type:"formula",name:"GW Strain",tex:"h(t) = \\frac{\\Delta L(t)}{L}",tag:"Detection",formula:"h(t) = \\frac{\\Delta L(t)}{L}",details:"The literal definition of what LIGO measures: the fractional stretching and squeezing of their 4-kilometer laser arms by a fraction of a proton's width."},
      {type:"formula",name:"Detector Response",tex:"h(t) = F_{+}(\\theta,\\phi,\\psi) h_{+}(t) + F_{\\times}(\\theta,\\phi,\\psi) h_{\\times}(t)",tag:"Data Analysis",formula:"h(t) = F_{+}(\\theta,\\phi,\\psi) h_{+}(t) + F_{\\times}(\\theta,\\phi,\\psi) h_{\\times}(t)",details:"Because gravitational waves are polarized and detectors are fixed to the Earth, this formula maps how 'loud' a wave will appear based on the direction it came from."},
      {type:"formula",name:"Polarization States",tex:"h_{ij}^{TT} = h_+ e_{ij}^+ + h_\\times e_{ij}^\\times",tag:"Properties",formula:"h_{ij}^{TT} = h_+ e_{ij}^+ + h_\\times e_{ij}^\\times",details:"Proves gravity waves come in two distinct flavors: the 'plus' cross polarization (up-down, left-right) and the 'cross' x polarization (diagonal stretching)."},
      {type:"formula",name:"Stochastic Background",tex:"\\Omega_{GW}(f) = \\frac{1}{\\rho_c} \\frac{d\\rho_{GW}}{d\\ln f}",tag:"Cosmology",formula:"\\Omega_{GW}(f) = \\frac{1}{\\rho_c} \\frac{d\\rho_{GW}}{d\\ln f}",details:"The search for the 'hum' of the universe. Models the lingering, random background noise generated by every black hole collision since the dawn of time."}
    ]}
  ]},
  { id: "cosmology", title: "18. Cosmology", sections: [
    { title: "Fundamentals & Kinematics", items: [
      {type:"formula",name:"FLRW Metric",tex:"ds^2 = -c^2dt^2 + a^2(t)\\left[\\frac{dr^2}{1-kr^2} + r^2(d\\theta^2 + \\sin^2\\theta d\\phi^2)\\right]",tag:"Geometry",formula:"ds^2 = -c^2dt^2 + a^2(t)\\left[\\frac{dr^2}{1-kr^2} + r^2(d\\theta^2 + \\sin^2\\theta d\\phi^2)\\right]",details:"The master geometry of the entire universe, assuming on the largest scales that space is uniformly smooth and expanding over time."},
      {type:"formula",name:"Hubble Parameter",tex:"H(t) = \\frac{\\dot{a}(t)}{a(t)}",tag:"Kinematics",formula:"H(t) = \\frac{\\dot{a}(t)}{a(t)}",details:"Defines the exact instantaneous rate of cosmic expansion, scaling simply as the velocity of the expansion divided by the current size of the universe."},
      {type:"formula",name:"Cosmological Redshift",tex:"1+z = \\frac{a(t_0)}{a(t_e)}",tag:"Observation",formula:"1+z = \\frac{a(t_0)}{a(t_e)}",details:"As light travels billions of years to reach us, the physical stretching of the universe stretches the wavelength of the light itself, shifting it to the red."},
      {type:"formula",name:"Hubble's Law",tex:"v = H_0 d",tag:"Observation",formula:"v = H_0 d",details:"The foundational observational discovery by Edwin Hubble that galaxies recede from us at a speed directly proportional to their distance."}
    ]},
    { title: "Expansion Dynamics", items: [
      {type:"formula",name:"First Friedmann Equation",tex:"H^2 = \\frac{8\\pi G}{3}\\rho - \\frac{kc^2}{a^2} + \\frac{\\Lambda c^2}{3}",tag:"Dynamics",formula:"H^2 = \\frac{8\\pi G}{3}\\rho - \\frac{kc^2}{a^2} + \\frac{\\Lambda c^2}{3}",details:"The central engine of cosmology. It dictates the speed of the universe's expansion as an ongoing war between matter density, spatial curvature, and dark energy."},
      {type:"formula",name:"Second Friedmann (Acceleration)",tex:"\\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3}\\left(\\rho + \\frac{3p}{c^2}\\right) + \\frac{\\Lambda c^2}{3}",tag:"Dynamics",formula:"\\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3}\\left(\\rho + \\frac{3p}{c^2}\\right) + \\frac{\\Lambda c^2}{3}",details:"Proves that normal matter and radiation pressure always pull the universe inward, slowing expansion, while the dark energy constant exclusively drives acceleration."},
      {type:"formula",name:"Fluid (Continuity) Equation",tex:"\\dot{\\rho} + 3H\\left(\\rho + \\frac{p}{c^2}\\right) = 0",tag:"Thermodynamics",formula:"\\dot{\\rho} + 3H\\left(\\rho + \\frac{p}{c^2}\\right) = 0",details:"The cosmic law of conservation of energy, dictating exactly how the density of matter and radiation thin out as the universe swells in volume."},
      {type:"formula",name:"Equation of State",tex:"p = w\\rho c^2",tag:"State",formula:"p = w\\rho c^2",details:"A simple linear relation classifying the fundamental 'stuff' of the universe: dust (w=0), light (w=1/3), or dark energy (w=-1)."},
      {type:"formula",name:"Density Scaling",tex:"\\rho\\propto a^{-3(1+w)}",tag:"Evolution",formula:"\\rho\\propto a^{-3(1+w)}",details:"Derives exactly how different cosmic ingredients dilute. Matter dilutes with volume, radiation dilutes worse (due to redshift), and dark energy doesn't dilute at all."},
      {type:"formula",name:"Critical Density",tex:"\\rho_c = \\frac{3H^2}{8\\pi G}",tag:"Parameters",formula:"\\rho_c = \\frac{3H^2}{8\\pi G}",details:"The exact knife-edge density required to perfectly balance the universe's expansion, resulting in a completely flat (zero curvature) geometry."},
      {type:"formula",name:"Density Parameter",tex:"\\Omega = \\frac{\\rho}{\\rho_c}",tag:"Parameters",formula:"\\Omega = \\frac{\\rho}{\\rho_c}",details:"A normalized, dimensionless score identifying what fraction of the universe is composed of matter, radiation, or dark energy relative to the critical threshold."},
      {type:"formula",name:"General Friedmann Equation",tex:"H^2= H_0^2 [ \\Omega_r(1+z)^4+ \\Omega_m(1+z)^3+ \\Omega_k(1+z)^2+ \\Omega_\\Lambda ]",tag:"Dynamics",formula:"H^2= H_0^2 [ \\Omega_r(1+z)^4+ \\Omega_m(1+z)^3+ \\Omega_k(1+z)^2+ \\Omega_\\Lambda ]",details:"The standard cosmological model (Lambda-CDM) equation, perfectly allowing astrophysicists to rewind or fast-forward the timeline of the universe."}
    ]},
    { title: "Cosmological Distances", items: [
      {type:"formula",name:"Comoving Distance",tex:"D_C= c\\int_0^z\\frac{dz'}{H(z')}",tag:"Distance",formula:"D_C= c\\int_0^z\\frac{dz'}{H(z')}",details:"A coordinate distance metric that factors out the expansion of the universe. Objects resting with the cosmic flow maintain a constant comoving distance."},
      {type:"formula",name:"Lookback Time",tex:"t_L= \\int_0^z \\frac{dz'}{(1+z')H(z')}",tag:"Time",formula:"t_L= \\int_0^z \\frac{dz'}{(1+z')H(z')}",details:"Calculates exactly how many billions of years into the past we are looking when we observe a galaxy sitting at a specific redshift point."},
      {type:"formula",name:"Luminosity Distance",tex:"D_L=(1+z)D_M",tag:"Distance",formula:"D_L=(1+z)D_M",details:"The distance parameter used when measuring standard candles (like supernovas), accounting for the severe dimming caused by cosmic redshift."},
      {type:"formula",name:"Angular-Diameter Distance",tex:"D_A=\\frac{D_M}{1+z}",tag:"Distance",formula:"D_A=\\frac{D_M}{1+z}",details:"Explains a strange cosmic optical illusion: past a certain point, distant galaxies actually appear larger on the sky rather than smaller because space itself was smaller when the light left."}
    ]},
    { title: "Thermodynamics & CMB", items: [
      {type:"formula",name:"CMB Temperature Scaling",tex:"T(z) = T_0(1+z)",tag:"Thermodynamics",formula:"T(z) = T_0(1+z)",details:"Shows that the early universe was blisteringly hot. The current 2.7 Kelvin cosmic microwave background scales upward directly proportionally to redshift."},
      {type:"formula",name:"Radiation Energy Density",tex:"\\rho_r c^2 = \\alpha T^4",tag:"Thermodynamics",formula:"\\rho_r c^2 = \\alpha T^4",details:"Relates the temperature of the cosmic background radiation directly to its energy density, proving the very early universe was utterly dominated by light."}
    ]}
  ]},
  { id: "numerical", title: "19. Mathematical & Numerical Methods", sections: [
    { title: "Differential Equations & Solvers", items: [
      {type:"formula",name:"First-Order ODE",tex:"\\frac{dy}{dx}=f(x,y)",tag:"Math",formula:"\\frac{dy}{dx}=f(x,y)",details:"The basic structural form of a first-order ordinary differential equation, describing the instantaneous slope of a dynamic variable."},
      {type:"formula",name:"Euler Method",tex:"y_{n+1} = y_n + h f(x_n, y_n)",tag:"Algorithm",formula:"y_{n+1} = y_n + h f(x_n, y_n)",details:"The simplest, crudest numerical method for stepping forward in time on a computer simulation, highly prone to accumulating errors on large steps."},
      {type:"formula",name:"Runge-Kutta 4 (RK4) Step",tex:"y_{n+1} = y_n+\\frac h6(k_1+2k_2+2k_3+k_4)",tag:"Algorithm",formula:"y_{n+1} = y_n+\\frac h6(k_1+2k_2+2k_3+k_4)",details:"The industry-standard workhorse algorithm for simulation. It tests four distinct slopes per time-step to achieve high precision and rock-solid stability."},
      {type:"formula",name:"Central Difference (2nd Derivative)",tex:"f''(x) \\approx \\frac{f(x+h) - 2f(x) + f(x-h)}{h^2}",tag:"Algorithm",formula:"f''(x) \\approx \\frac{f(x+h) - 2f(x) + f(x-h)}{h^2}",details:"A finite difference formula enabling computers to approximate complex second derivatives purely through basic arithmetic on discrete grid points."}
    ]},
    { title: "Simulation Core", items: [
      {type:"formula",name:"Ray Integration System",tex:"\\frac{dx^\\mu}{d\\lambda}=k^\\mu \\quad,\\quad \\frac{dk^\\mu}{d\\lambda} = -\\Gamma^\\mu_{\\alpha\\beta} k^\\alpha k^\\beta",tag:"Algorithm",formula:"\\frac{dx^\\mu}{d\\lambda}=k^\\mu \\quad,\\quad \\frac{dk^\\mu}{d\\lambda} = -\\Gamma^\\mu_{\\alpha\\beta} k^\\alpha k^\\beta",details:"The coupled differential system solved millions of times per frame in a black hole raytracer to map how light bends through the Christoffel symbols of curved space."},
      {type:"formula",name:"Courant-Friedrichs-Lewy (CFL) Condition",tex:"C = \\frac{u \\Delta t}{\\Delta x} \\le 1",tag:"Stability",formula:"C = \\frac{u \\Delta t}{\\Delta x} \\le 1",details:"A strict, unbreakable mandate in fluid and wave simulations: the simulated time-step cannot allow information to travel further than one grid cell, or the math blows up."},
      {type:"text",content:"Simulation Verification: Every engine step must verify conservation tolerances for $\\Delta E$, $\\Delta L$, and the null condition $k_\\mu k^\\mu = 0$ for photons."}
    ]},
    { title: "Analysis & Statistics", items: [
      {type:"formula",name:"Newton-Raphson Method",tex:"x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}",tag:"Algorithm",formula:"x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}",details:"An immensely powerful iterative algorithm utilizing tangents to rapidly zero in on the exact roots of heavily complex, non-linear algebraic equations."},
      {type:"formula",name:"Chi-Square Statistic",tex:"\\chi^2 = \\sum_{i} \\frac{(O_i - E_i)^2}{\\sigma_i^2}",tag:"Statistics",formula:"\\chi^2 = \\sum_{i} \\frac{(O_i - E_i)^2}{\\sigma_i^2}",details:"The primary statistical tool in cosmology for assessing the goodness-of-fit, determining how well standard models map onto real, noisy telescope data."}
    ]}
  ]},
  { id: "validation", title: "20. Physical Constants, Units & Validation", sections: [
    { title: "Natural & Planck Units", items: [
      {type:"formula",name:"Planck Length",tex:"l_P = \\sqrt{\\frac{\\hbar G}{c^3}}",tag:"Constant",formula:"l_P = \\sqrt{\\frac{\\hbar G}{c^3}}",details:"The absolute minimum limit of measurable physical length (approx 10^-35 meters). Probing smaller distances would require enough energy to create a black hole."},
      {type:"formula",name:"Planck Time",tex:"t_P = \\sqrt{\\frac{\\hbar G}{c^5}}",tag:"Constant",formula:"t_P = \\sqrt{\\frac{\\hbar G}{c^5}}",details:"The time required for light to traverse exactly one Planck length. Defines the absolute earliest slice of time (10^-44 sec) in the Big Bang our physics can describe."},
      {type:"formula",name:"Planck Mass",tex:"m_P = \\sqrt{\\frac{\\hbar c}{G}}",tag:"Constant",formula:"m_P = \\sqrt{\\frac{\\hbar c}{G}}",details:"A curiously macroscopic quantum-gravity scale mass roughly equivalent to a speck of dust or a flea's egg, derived purely from universal constants."}
    ]},
    { title: "Geometrized Units", items: [
      {type:"formula",name:"Geometrized Mass",tex:"M_{geom} = \\frac{GM}{c^2}",tag:"Conversion",formula:"M_{geom} = \\frac{GM}{c^2}",details:"Removes standard kilograms by scaling mass into units of geometric length (meters). Mass essentially becomes a measure of its gravitational radius."},
      {type:"formula",name:"Geometrized Time",tex:"t_{geom} = c t",tag:"Conversion",formula:"t_{geom} = c t",details:"Multiplies standard seconds by the speed of light to track time entirely in spatial meters, making the spacetime metric beautifully uniform."},
      {type:"text",content:"Geometrized units ($G=c=1$) are utilized for internal GR calculations, but must explicitly transform back to SI/cgs for observable outputs."}
    ]},
    { title: "Framework Standards", items: [
      {type:"text",content:"Base Constants: $G, c, \\hbar, k_B, e, m_e, m_p, M_\\odot, R_\\odot$"},
      {type:"formula",name:"Dimensional Analysis Requirement",tex:"[\\mathrm{LHS}] = [\\mathrm{RHS}]",tag:"Validation",formula:"[\\mathrm{LHS}] = [\\mathrm{RHS}]",details:"A non-negotiable verification rule in the simulator demanding that the fundamental base units on both sides of any dynamic equation exactly match."},
      {type:"text",content:"Every formula in this database carries physical validity markers: EXACT, DERIVED, EXPERIMENTALLY VERIFIED, APPROXIMATION, SEMICLASSICAL, EMPIRICAL, MODEL-DEPENDENT, or MATHEMATICAL ONLY."}
    ]}
  ]},
  { id: "basic_physics", title: "21. Mechanics & Fundamentals", sections: [
    { title: "Units, Dimensions & Errors", items: [
      {type:"formula",name:"Percentage error",tex:"\\text{Percentage error} = \\frac{\\Delta Q}{Q} \\times 100",tag:"Error Analysis",formula:"\\text{Percentage error} = \\frac{\\Delta Q}{Q} \\times 100",details:"Standardizes measurement uncertainty by expressing the absolute error as a relative percentage of the total measured value."},
      {type:"formula",name:"Error Propagation (Power)",tex:"\\frac{\\Delta Z}{Z} = a\\frac{\\Delta A}{A} + b\\frac{\\Delta B}{B}",tag:"Error Analysis",formula:"\\frac{\\Delta Z}{Z} = a\\frac{\\Delta A}{A} + b\\frac{\\Delta B}{B}",details:"Estimates the combined maximal fractional error when two or more distinct uncertain variables are exponentially multiplied or divided."},
      {type:"formula",name:"Dimensional formula general",tex:"[Q] = M^a L^b T^c",tag:"Dimensions",formula:"[Q] = M^a L^b T^c",details:"Deconstructs any derived physical quantity into its base elemental components: Mass (M), Length (L), and Time (T)."},
      {type:"formula",name:"Dimensions: Force",tex:"[F] = M L T^{-2}",tag:"Dimensions",formula:"[F] = M L T^{-2}",details:"The foundational dimensional breakdown of Newtons (force), derived from mass multiplied by acceleration."},
      {type:"formula",name:"Dimensions: Energy",tex:"[E] = M L^2 T^{-2}",tag:"Dimensions",formula:"[E] = M L^2 T^{-2}",details:"The dimensional breakdown of Joules (energy and work), equivalent to a force applied over a specific distance."},
      {type:"formula",name:"Dimensions: Gravitational Constant",tex:"[G] = M^{-1} L^3 T^{-2}",tag:"Dimensions",formula:"[G] = M^{-1} L^3 T^{-2}",details:"Reveals the unique intrinsic units required by the constant 'G' to correctly output a standard force from the law of universal gravitation."}
    ]},
    { title: "Kinematics (1D, 2D & Circular)", items: [
      {type:"formula",name:"Average velocity",tex:"v_{\\text{avg}} = \\frac{\\Delta x}{\\Delta t}",tag:"Motion",formula:"v_{\\text{avg}} = \\frac{\\Delta x}{\\Delta t}",details:"A macroscopic motion parameter tracking only the total net displacement divided by the total duration, utterly ignoring any speed changes in between."},
      {type:"formula",name:"Instantaneous acceleration",tex:"a = \\frac{dv}{dt} = \\frac{d^2x}{dt^2}",tag:"Motion",formula:"a = \\frac{dv}{dt} = \\frac{d^2x}{dt^2}",details:"The true calculus-based definition of acceleration, measuring the exact, localized rate at which an object's velocity vector is warping."},
      {type:"formula",name:"First equation of motion",tex:"v = u + at",tag:"Motion",formula:"v = u + at",details:"Predicts the final velocity of an object after a specific time, strictly assuming the acceleration acting on it remains perfectly constant."},
      {type:"formula",name:"Second equation of motion",tex:"s = ut + \\frac{1}{2}at^2",tag:"Motion",formula:"s = ut + \\frac{1}{2}at^2",details:"Calculates the precise distance covered by an object starting with initial velocity 'u' and undergoing a steady, constant acceleration."},
      {type:"formula",name:"Third equation of motion",tex:"v^2 = u^2 + 2as",tag:"Motion",formula:"v^2 = u^2 + 2as",details:"A time-independent kinematic relation bridging distance directly to speed changes under a constant rate of acceleration."},
      {type:"formula",name:"Projectile trajectory",tex:"y = x \\tan\\theta - \\frac{gx^2}{2u^2 \\cos^2\\theta}",tag:"2D Motion",formula:"y = x \\tan\\theta - \\frac{gx^2}{2u^2 \\cos^2\\theta}",details:"Proves mathematically that unpowered objects tossed under the influence of uniform gravity trace out a perfectly parabolic geometric path."},
      {type:"formula",name:"Time of flight",tex:"T = \\frac{2u \\sin\\theta}{g}",tag:"2D Motion",formula:"T = \\frac{2u \\sin\\theta}{g}",details:"The total airborne duration of a projectile launched and landing on flat ground, dependent entirely on gravity and the vertical component of the launch velocity."},
      {type:"formula",name:"Maximum height",tex:"H = \\frac{u^2 \\sin^2\\theta}{2g}",tag:"2D Motion",formula:"H = \\frac{u^2 \\sin^2\\theta}{2g}",details:"Determines the exact apex altitude of a parabolic flight path, occurring at the precise moment the vertical velocity drops to zero."},
      {type:"formula",name:"Horizontal range",tex:"R = \\frac{u^2 \\sin 2\\theta}{g}",tag:"2D Motion",formula:"R = \\frac{u^2 \\sin 2\\theta}{g}",details:"Calculates how far a projectile flies horizontally before impact. Predicts that an exact 45-degree angle will always yield the maximum possible distance."},
      {type:"formula",name:"Centripetal Acceleration",tex:"a_c = \\frac{v^2}{r} = \\omega^2 r",tag:"Circular Motion",formula:"a_c = \\frac{v^2}{r} = \\omega^2 r",details:"Even at constant speed, an object traveling in a circle is continuously accelerating inward toward the pivot point just to change its direction."},
      {type:"formula",name:"Angular Velocity",tex:"\\omega = \\frac{d\\theta}{dt} = \\frac{v}{r}",tag:"Circular Motion",formula:"\\omega = \\frac{d\\theta}{dt} = \\frac{v}{r}",details:"Translates linear tangential speed traversing an arc length into the spinning rate of angle measurement over time."}
    ]},
    { title: "Dynamics, Work & Energy", items: [
      {type:"formula",name:"Newton's Second Law",tex:"\\vec{F}_{net} = \\frac{d\\vec{p}}{dt} = m\\vec{a}",tag:"Dynamics",formula:"\\vec{F}_{net} = \\frac{d\\vec{p}}{dt} = m\\vec{a}",details:"The classic bedrock of classical physics: unbalanced forces compel massive objects to alter their state of motion by accelerating."},
      {type:"formula",name:"Kinetic Friction",tex:"f_k = \\mu_k N",tag:"Dynamics",formula:"f_k = \\mu_k N",details:"The resistive sliding force that bleeds kinetic energy into thermal heat, maintaining a constant magnitude regardless of the sliding speed."},
      {type:"formula",name:"Work Done",tex:"W = \\int \\vec{F} \\cdot d\\vec{r} = F d \\cos\\theta",tag:"Energy",formula:"W = \\int \\vec{F} \\cdot d\\vec{r} = F d \\cos\\theta",details:"Mechanical work only occurs when a force successfully displaces an object, and specifically only factors in the force component aligned with the motion."},
      {type:"formula",name:"Kinetic Energy",tex:"K = \\frac{1}{2}mv^2 = \\frac{p^2}{2m}",tag:"Energy",formula:"K = \\frac{1}{2}mv^2 = \\frac{p^2}{2m}",details:"The energy reservoir associated entirely with mass moving through space. It squares with velocity, making high-speed impacts exponentially more destructive."},
      {type:"formula",name:"Work-Energy Theorem",tex:"W_{net} = \\Delta K",tag:"Energy",formula:"W_{net} = \\Delta K",details:"Serves as an infallible accounting system: the absolute sum total of all work done on an object equals exactly the gain or loss in its kinetic energy."},
      {type:"formula",name:"Power",tex:"P = \\frac{dW}{dt} = \\vec{F} \\cdot \\vec{v}",tag:"Energy",formula:"P = \\frac{dW}{dt} = \\vec{F} \\cdot \\vec{v}",details:"Evaluates the speed of energy transfer. A machine doing the same work in half the time is mechanically outputting twice the power."}
    ]},
    { title: "Rotational Mechanics & Gravitation", items: [
      {type:"formula",name:"Torque",tex:"\\vec{\\tau} = \\vec{r} \\times \\vec{F} = I\\vec{\\alpha}",tag:"Rotation",formula:"\\vec{\\tau} = \\vec{r} \\times \\vec{F} = I\\vec{\\alpha}",details:"The twisting variant of force, causing angular acceleration based on both the strength of the push and its lever-arm distance from the pivot."},
      {type:"formula",name:"Angular Momentum",tex:"\\vec{L} = \\vec{r} \\times \\vec{p} = I\\vec{\\omega}",tag:"Rotation",formula:"\\vec{L} = \\vec{r} \\times \\vec{p} = I\\vec{\\omega}",details:"The rotational inertia's resistance to changing its spin. It must be strictly conserved in any closed system, explaining why contracting figure skaters spin faster."},
      {type:"formula",name:"Rotational Kinetic Energy",tex:"K_{rot} = \\frac{1}{2}I\\omega^2",tag:"Rotation",formula:"K_{rot} = \\frac{1}{2}I\\omega^2",details:"Provides the mechanical energy locked exclusively in the spinning motion of the mass, calculated analogously to its straight-line counterpart."},
      {type:"formula",name:"Newton's Law of Gravitation",tex:"F_g = \\frac{G m_1 m_2}{r^2}",tag:"Gravitation",formula:"F_g = \\frac{G m_1 m_2}{r^2}",details:"Newton's groundbreaking insight that the invisible force tethering the moon to the Earth is universally identical to the force dropping an apple from a tree."},
      {type:"formula",name:"Acceleration Due to Gravity",tex:"g = \\frac{GM}{R^2}",tag:"Gravitation",formula:"g = \\frac{GM}{R^2}",details:"Simplifies gravitational interactions by treating a massive body as generating a uniform acceleration field at its spherical surface."},
      {type:"formula",name:"Escape Velocity",tex:"v_e = \\sqrt{\\frac{2GM}{R}}",tag:"Gravitation",formula:"v_e = \\sqrt{\\frac{2GM}{R}}",details:"The threshold speed required to fling an unpowered object into an infinite trajectory, mathematically calculated by setting its total mechanical energy to zero."},
      {type:"formula",name:"Orbital Velocity",tex:"v_o = \\sqrt{\\frac{GM}{r}}",tag:"Gravitation",formula:"v_o = \\sqrt{\\frac{GM}{r}}",details:"The precise sideways velocity needed to ensure the centrifugal-like force of a curving path perfectly cancels the inward pull of a planet's gravity."},
      {type:"formula",name:"Kepler's Third Law",tex:"T^2 = \\frac{4\\pi^2}{GM} a^3",tag:"Gravitation",formula:"T^2 = \\frac{4\\pi^2}{GM} a^3",details:"Connects orbital time directly to distance. An object four times further out naturally takes exactly eight times longer to complete a lap."}
    ]},
    { title: "Properties of Matter & Fluids", items: [
      {type:"formula",name:"Young's modulus",tex:"Y = \\frac{FL}{A\\Delta L}",tag:"Elasticity",formula:"Y = \\frac{FL}{A\\Delta L}",details:"A material stiffness constant measuring how difficult it is to stretch or compress a solid wire or rod along its linear axis."},
      {type:"formula",name:"Bulk modulus",tex:"K = -\\frac{\\Delta P}{\\Delta V / V}",tag:"Elasticity",formula:"K = -\\frac{\\Delta P}{\\Delta V / V}",details:"A material constant indicating a substance's resistance to uniform, omnidirectional crushing pressure. Crucial for understanding fluid compressibility and sound waves."},
      {type:"formula",name:"Shear modulus",tex:"G = \\frac{\\text{shear stress}}{\\text{shear strain}}",tag:"Elasticity",formula:"G = \\frac{\\text{shear stress}}{\\text{shear strain}}",details:"Dictates how a solid deforms and twists when sliding lateral forces are applied to parallel faces, relevant to earthquakes and structural engineering."},
      {type:"formula",name:"Hydrostatic pressure",tex:"P = P_0 + \\rho gh",tag:"Fluid Statics",formula:"P = P_0 + \\rho gh",details:"Calculates the total absolute pressure crushed against an object submerged in an incompressible fluid column, scaling linearly with fluid depth."},
      {type:"formula",name:"Buoyant force",tex:"F_B = \\rho_f V_{sub} g",tag:"Fluid Statics",formula:"F_B = \\rho_f V_{sub} g",details:"Archimedes' principle mathematically formalized: an upward force identically equal to the absolute weight of the fluid that was displaced."},
      {type:"formula",name:"Equation of Continuity",tex:"A_1 v_1 = A_2 v_2",tag:"Fluid Dynamics",formula:"A_1 v_1 = A_2 v_2",details:"Mass conservation in pipes. If a pipe narrows, an incompressible fluid is violently forced to accelerate to prevent mass from piling up."},
      {type:"formula",name:"Bernoulli's Equation",tex:"P + \\frac{1}{2}\\rho v^2 + \\rho gh = \\text{constant}",tag:"Fluid Dynamics",formula:"P + \\frac{1}{2}\\rho v^2 + \\rho gh = \\text{constant}",details:"The work-energy theorem formulated for flowing fluids, famously proving that faster moving airstreams generate regions of distinct lower pressure."},
      {type:"formula",name:"Stokes' law",tex:"F_v = 6\\pi\\eta rv",tag:"Fluid Dynamics",formula:"F_v = 6\\pi\\eta rv",details:"Models the precise frictional drag force acting on tiny spherical objects drifting very slowly through thick, viscous fluids like oil or water."},
      {type:"formula",name:"Terminal velocity",tex:"v_t = \\frac{2r^2(\\rho_s - \\rho_f)g}{9\\eta}",tag:"Fluid Dynamics",formula:"v_t = \\frac{2r^2(\\rho_s - \\rho_f)g}{9\\eta}",details:"The maximum possible freefall speed an object achieves once the upward resistance of viscous fluid drag perfectly cancels out the downward pull of gravity."},
      {type:"formula",name:"Capillary Rise",tex:"h = \\frac{2T \\cos\\theta}{\\rho g r}",tag:"Surface Tension",formula:"h = \\frac{2T \\cos\\theta}{\\rho g r}",details:"Explains how the surface tension of a liquid clinging to glass allows it to defy gravity and climb up the interior of a highly narrow microscopic tube."}
    ]}
  ]},
  { id: "electromagnetism_optics", title: "22. Electromagnetism & Optics Extension", sections: [
    { title: "Electrostatics & Capacitors", items: [
      {type:"formula",name:"Coulomb's law",tex:"F = \\frac{1}{4\\pi\\epsilon_0}\\frac{q_1q_2}{r^2}",tag:"Electrostatics",formula:"F = \\frac{1}{4\\pi\\epsilon_0}\\frac{q_1q_2}{r^2}",details:"The fundamental inverse-square law detailing the attraction or repulsion between two stationary, point-like electric charges."},
      {type:"formula",name:"Electric Field",tex:"\\vec{E} = \\frac{\\vec{F}}{q_0}",tag:"Electrostatics",formula:"\\vec{E} = \\frac{\\vec{F}}{q_0}",details:"Maps the invisible vectors of electric influence in space by defining the force that would be exerted on an infinitesimally small positive test charge."},
      {type:"formula",name:"Gauss's Law",tex:"\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{\\text{enc}}}{\\epsilon_0}",tag:"Electrostatics",formula:"\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{\\text{enc}}}{\\epsilon_0}",details:"A masterful geometric theorem proving that the total electric flux radiating outward through a completely closed 3D surface strictly equals the enclosed charge."},
      {type:"formula",name:"Electric Potential",tex:"V = \\frac{1}{4\\pi\\epsilon_0}\\frac{q}{r}",tag:"Electrostatics",formula:"V = \\frac{1}{4\\pi\\epsilon_0}\\frac{q}{r}",details:"The electrical equivalent to gravitational potential energy; represents the scalar voltage level created at distance r by a singular point charge."},
      {type:"formula",name:"Electric dipole moment",tex:"\\vec{p} = q\\vec{d}",tag:"Electrostatics",formula:"\\vec{p} = q\\vec{d}",details:"A vector quantity measuring the strength and orientation of a pair of equal and opposite charges separated by a tiny molecular distance."},
      {type:"formula",name:"Capacitance definition",tex:"C = \\frac{Q}{V}",tag:"Capacitors",formula:"C = \\frac{Q}{V}",details:"The fundamental metric defining a device's ability to store electrical charge per unit of applied voltage difference."},
      {type:"formula",name:"Parallel plate capacitance",tex:"C = \\frac{\\epsilon_0 A}{d}",tag:"Capacitors",formula:"C = \\frac{\\epsilon_0 A}{d}",details:"Proves that increasing plate surface area boosts charge storage, while widening the gap between them strictly diminishes storage capability."},
      {type:"formula",name:"Energy in a Capacitor",tex:"U = \\frac{1}{2}CV^2 = \\frac{Q^2}{2C}",tag:"Capacitors",formula:"U = \\frac{1}{2}CV^2 = \\frac{Q^2}{2C}",details:"Calculates the total electrical potential energy physically trapped in the built-up electric field between a capacitor's charged plates."}
    ]},
    { title: "Current Electricity", items: [
      {type:"formula",name:"Current & Drift Velocity",tex:"I = n e A v_d",tag:"Current",formula:"I = n e A v_d",details:"Connects the macroscopic current reading on an ammeter to the microscopic, surprisingly slow physical drift velocity of individual electrons in a wire."},
      {type:"formula",name:"Ohm's law",tex:"V = IR",tag:"Current",formula:"V = IR",details:"The empirical law stating that voltage pushing through a standard conductor scales perfectly linearly with the resulting electrical current and internal resistance."},
      {type:"formula",name:"Resistance & Resistivity",tex:"R = \\rho \\frac{L}{A}, \\quad \\sigma = \\frac{1}{\\rho}",tag:"Current",formula:"R = \\rho \\frac{L}{A}, \\quad \\sigma = \\frac{1}{\\rho}",details:"Shows that resistance is heavily geometric: long wires choke current, wide wires let it flow easily, modified by the innate material resistivity."},
      {type:"formula",name:"Electrical Power",tex:"P = VI = I^2R = \\frac{V^2}{R}",tag:"Current",formula:"P = VI = I^2R = \\frac{V^2}{R}",details:"Calculates the exact wattage of energy being transferred, consumed, or dissipated into heat by an electrical component per second."},
      {type:"formula",name:"Kirchhoff's Current Law (KCL)",tex:"\\sum I_{\\text{in}} = \\sum I_{\\text{out}}",tag:"Circuits",formula:"\\sum I_{\\text{in}} = \\sum I_{\\text{out}}",details:"The node rule derived from charge conservation: current cannot build up or disappear at a junction. Everything flowing in must flow out."},
      {type:"formula",name:"Kirchhoff's Voltage Law (KVL)",tex:"\\sum \\Delta V = 0",tag:"Circuits",formula:"\\sum \\Delta V = 0",details:"The loop rule derived from energy conservation: tracing any closed loop in a circuit must result in a net zero change in electrical potential."},
      {type:"formula",name:"Wheatstone bridge",tex:"\\frac{P}{Q} = \\frac{R}{S}",tag:"Circuits",formula:"\\frac{P}{Q} = \\frac{R}{S}",details:"The balanced-state ratio for a specialized 4-resistor circuit utilized to calculate an unknown resistance with incredibly high precision."}
    ]},
    { title: "Magnetism, Induction & AC", items: [
      {type:"formula",name:"Lorentz force",tex:"\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B})",tag:"Magnetism",formula:"\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B})",details:"The grand unification force law dictating exactly how a single charged particle gets pushed by electric fields and deflected perpendicularly by magnetic fields."},
      {type:"formula",name:"Magnetic Force on Wire",tex:"\\vec{F} = I\\vec{L} \\times \\vec{B}",tag:"Magnetism",formula:"\\vec{F} = I\\vec{L} \\times \\vec{B}",details:"Translates the microscopic Lorentz force onto a macroscopic current-carrying wire. It forms the physical basis for how electric motors generate turning forces."},
      {type:"formula",name:"Biot-Savart law",tex:"d\\vec{B} = \\frac{\\mu_0}{4\\pi}\\frac{I d\\vec{l} \\times \\hat{r}}{r^2}",tag:"Magnetism",formula:"d\\vec{B} = \\frac{\\mu_0}{4\\pi}\\frac{I d\\vec{l} \\times \\hat{r}}{r^2}",details:"Calculates the exact magnetic field vector produced at any point in space by a small, localized segment of flowing electrical current."},
      {type:"formula",name:"Ampere's law",tex:"\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_{\\text{enc}}",tag:"Magnetism",formula:"\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_{\\text{enc}}",details:"A brilliant symmetry shortcut: the line integral of a magnetic field circulating around a closed loop is strictly proportional to the total current punching through it."},
      {type:"formula",name:"Cyclotron radius and frequency",tex:"r = \\frac{mv}{qB}, \\quad f = \\frac{qB}{2\\pi m}",tag:"Magnetism",formula:"r = \\frac{mv}{qB}, \\quad f = \\frac{qB}{2\\pi m}",details:"Predicts the circular path of an ion shot into a magnetic field. Surprisingly, the orbit frequency is entirely independent of the particle's velocity or radius."},
      {type:"formula",name:"Faraday's Law of Induction",tex:"\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}",tag:"Induction",formula:"\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}",details:"The foundational law behind power plants: merely changing the amount of magnetic flux passing through a wire coil magically conjures an electrical voltage."},
      {type:"formula",name:"Motional EMF",tex:"\\mathcal{E} = Blv",tag:"Induction",formula:"\\mathcal{E} = Blv",details:"Computes the voltage generated across the ends of a straight metal bar as it physically slices through magnetic field lines."},
      {type:"formula",name:"AC RMS Values",tex:"V_{\\text{rms}} = \\frac{V_0}{\\sqrt{2}}, \\quad I_{\\text{rms}} = \\frac{I_0}{\\sqrt{2}}",tag:"AC Circuits",formula:"V_{\\text{rms}} = \\frac{V_0}{\\sqrt{2}}, \\quad I_{\\text{rms}} = \\frac{I_0}{\\sqrt{2}}",details:"A mathematical averaging technique allowing engineers to treat violently oscillating AC currents as simple DC equivalents when calculating steady power output."},
      {type:"formula",name:"Impedance (Series RLC)",tex:"Z = \\sqrt{R^2 + (X_L - X_C)^2}",tag:"AC Circuits",formula:"Z = \\sqrt{R^2 + (X_L - X_C)^2}",details:"The AC equivalent of resistance. It combines standard resistance with frequency-dependent reactances from capacitors and inductors using vector addition."},
      {type:"formula",name:"Resonance Frequency",tex:"f_r = \\frac{1}{2\\pi\\sqrt{LC}}",tag:"AC Circuits",formula:"f_r = \\frac{1}{2\\pi\\sqrt{LC}}",details:"The singular frequency where an AC circuit's capacitor and inductor perfectly cancel each other out, allowing maximum possible current to surge. Used to tune radios."},
      {type:"formula",name:"Transformer Equation",tex:"\\frac{V_s}{V_p} = \\frac{N_s}{N_p} = \\frac{I_p}{I_s}",tag:"AC Circuits",formula:"\\frac{V_s}{V_p} = \\frac{N_s}{N_p} = \\frac{I_p}{I_s}",details:"Explains how winding ratios allow AC voltages to be stepped up to extreme levels for long-distance grid transmission, with a proportional drop in current."}
    ]},
    { title: "Optics & Waves", items: [
      {type:"formula",name:"Wave Equation",tex:"v = f\\lambda",tag:"Waves",formula:"v = f\\lambda",details:"The universal relation for all waves in nature: propagation speed is simply the spatial length of a wave multiplied by how frequently it oscillates."},
      {type:"formula",name:"Snell's law",tex:"\\frac{\\sin\\theta_1}{\\sin\\theta_2} = \\frac{v_1}{v_2} = \\frac{n_2}{n_1}",tag:"Ray Optics",formula:"\\frac{\\sin\\theta_1}{\\sin\\theta_2} = \\frac{v_1}{v_2} = \\frac{n_2}{n_1}",details:"Governs refraction, proving that light physically bends at an interface because it travels slower in dense mediums like glass or water than in air."},
      {type:"formula",name:"Lens equation",tex:"\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}",tag:"Ray Optics",formula:"\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}",details:"The central optical formula connecting focal length to the distances of the object and the generated image for a standard thin lens."},
      {type:"formula",name:"Lens maker's formula",tex:"\\frac{1}{f} = (n - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)",tag:"Ray Optics",formula:"\\frac{1}{f} = (n - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)",details:"The engineering equation used to physically grind optical glass, establishing focal length strictly from the index of refraction and the radii of curvature."},
      {type:"formula",name:"Mirror equation",tex:"\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}",tag:"Ray Optics",formula:"\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}",details:"The geometric optics formula predicting where curved spherical mirrors will project an image, adhering to standard Cartesian sign conventions."},
      {type:"formula",name:"Magnification (Lens & Mirror)",tex:"m = \\frac{h_i}{h_o} = \\frac{v}{u} \\text{ (Lens)} = -\\frac{v}{u} \\text{ (Mirror)}",tag:"Ray Optics",formula:"m = \\frac{h_i}{h_o} = \\frac{v}{u} \\text{ (Lens)} = -\\frac{v}{u} \\text{ (Mirror)}",details:"Quantifies image enlargement or reduction. A negative magnification mathematically denotes an image that has been flipped upside down."},
      {type:"formula",name:"YDSE fringe width",tex:"\\beta = \\frac{\\lambda D}{d}",tag:"Wave Optics",formula:"\\beta = \\frac{\\lambda D}{d}",details:"Predicts the spacing of the alternating light-and-dark interference bands in Young's Double Slit experiment, a seminal proof of light's wave nature."},
      {type:"formula",name:"Single Slit Diffraction (Minima)",tex:"a \\sin\\theta = n\\lambda",tag:"Wave Optics",formula:"a \\sin\\theta = n\\lambda",details:"Models how a wavefront bends and spreads after squeezing through a tight opening, creating a pattern of dark spots at specific destructive interference angles."},
      {type:"formula",name:"Brewster's angle",tex:"\\theta_B = \\arctan\\left(\\frac{n_2}{n_1}\\right)",tag:"Wave Optics",formula:"\\theta_B = \\arctan\\left(\\frac{n_2}{n_1}\\right)",details:"The exact angle of incidence where reflected light bouncing off a non-metallic surface becomes 100% cleanly polarized parallel to the surface."},
      {type:"formula",name:"Malus's Law",tex:"I = I_0 \\cos^2\\theta",tag:"Wave Optics",formula:"I = I_0 \\cos^2\\theta",details:"Determines the exact intensity of light that successfully passes through a polarizing filter based on the orientation angle between the filter and the wave's polarization."},
      {type:"formula",name:"Doppler effect (Sound)",tex:"f' = f \\left(\\frac{v \\pm v_o}{v \\mp v_s}\\right)",tag:"Waves",formula:"f' = f \\left(\\frac{v \\pm v_o}{v \\mp v_s}\\right)",details:"Calculates the apparent pitch shift (like a passing siren) caused when a sound source and observer are moving relative to the stationary air medium."}
    ]}
  ]},
  { id: "thermo_modern", title: "23. Thermodynamics & Modern Physics Extension", sections: [
    { title: "Thermodynamics", items: [
      {type:"formula",name:"Ideal Gas Law",tex:"PV = nRT",tag:"General",formula:"PV = nRT",details:"The universal equation of state for hypothetical ideal gases, bridging macroscopic pressure, volume, and temperature to molar quantity."},
      {type:"formula",name:"Efficiency",tex:"\\eta = \\frac{W}{Q_H}",tag:"General",formula:"\\eta = \\frac{W}{Q_H}",details:"A straightforward ratio calculating the effectiveness of a heat engine by dividing the useful work output by the total heat energy pumped in."},
      {type:"formula",name:"Carnot efficiency",tex:"\\eta = 1 - \\frac{T_C}{T_H}",tag:"General",formula:"\\eta = 1 - \\frac{T_C}{T_H}",details:"The theoretical maximum possible efficiency for any engine operating between two temperatures, strictly limited by the second law of thermodynamics."},
      {type:"formula",name:"RMS speed",tex:"v_{\\text{rms}} = \\sqrt{\\frac{3k_BT}{m}} = \\sqrt{\\frac{3RT}{M}}",tag:"General",formula:"v_{\\text{rms}} = \\sqrt{\\frac{3k_BT}{m}} = \\sqrt{\\frac{3RT}{M}}",details:"Provides the root-mean-square velocity of particles in a gas, demonstrating that temperature is quite literally the microscopic kinetic motion of atoms."},
      {type:"formula",name:"Maxwell-Boltzmann distribution",tex:"f(v) = 4\\pi\\left(\\frac{m}{2\\pi k_BT}\\right)^{3/2}v^2 e^{-mv^2/2k_BT}",tag:"General",formula:"f(v) = 4\\pi\\left(\\frac{m}{2\\pi k_BT}\\right)^{3/2}v^2 e^{-mv^2/2k_BT}",details:"A probability curve plotting exactly what fraction of gas particles are moving at any specific speed at a given temperature."}
    ]},
    { title: "Modern Physics", items: [
      {type:"formula",name:"Einstein photoelectric equation",tex:"K_{\\max} = h\\nu - \\phi = eV_s",tag:"General",formula:"K_{\\max} = h\\nu - \\phi = eV_s",details:"Einstein's Nobel-winning formula proving light is composed of particle-like photons, knocking electrons off metal with kinetic energy reliant solely on frequency."},
      {type:"formula",name:"Bohr angular momentum quantisation",tex:"mvr = \\frac{nh}{2\\pi}",tag:"General",formula:"mvr = \\frac{nh}{2\\pi}",details:"Bohr's radical postulate that electrons can only orbit an atomic nucleus at specific, quantized radii where their angular momentum is a multiple of h-bar."},
      {type:"formula",name:"Hydrogen energy level",tex:"E_n = -\\frac{13.6}{n^2} \\text{ eV}",tag:"General",formula:"E_n = -\\frac{13.6}{n^2} \\text{ eV}",details:"Calculates the strictly separated, quantized binding energy states available to the single electron orbiting a standard hydrogen atom."},
      {type:"formula",name:"Mass defect",tex:"\\Delta m = Zm_p + (A - Z)m_n - m_{\\text{nucleus}}",tag:"General",formula:"\\Delta m = Zm_p + (A - Z)m_n - m_{\\text{nucleus}}",details:"Measures the tiny fraction of mass that mysteriously 'disappears' when protons and neutrons bind together, having been converted into nuclear binding energy."},
      {type:"formula",name:"Radioactive decay law",tex:"N = N_0 e^{-\\lambda t}",tag:"General",formula:"N = N_0 e^{-\\lambda t}",details:"The statistical exponential decay curve mapping how a population of unstable radioactive isotopes dwindles completely predictably over time."},
      {type:"formula",name:"Half-life and mean life",tex:"T_{1/2} = \\frac{\\ln 2}{\\lambda}, \\quad \\tau = \\frac{1}{\\lambda}",tag:"General",formula:"T_{1/2} = \\frac{\\ln 2}{\\lambda}, \\quad \\tau = \\frac{1}{\\lambda}",details:"Relates the decay constant to easily understandable time metrics: the half-life (time for half the sample to decay) and the average lifetime of an atom."}
    ]}
  ]},
  { id: "mathematics", title: "24. Mathematics & Statistics", sections: [
    { title: "Algebra & Trigonometry", items: [
      {type:"formula",name:"Quadratic formula",tex:"x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",tag:"General",formula:"x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",details:"The legendary formula providing the two exact roots to any second-order polynomial equation. The discriminant under the square root determines real vs complex roots."},
      {type:"formula",name:"Euler identity",tex:"e^{i\\theta} = \\cos\\theta + i\\sin\\theta",tag:"General",formula:"e^{i\\theta} = \\cos\\theta + i\\sin\\theta",details:"Often called the most beautiful equation in math, brilliantly linking exponential growth in the complex plane directly to circular trigonometric waves."},
      {type:"formula",name:"De Moivre's theorem",tex:"(\\cos\\theta + i\\sin\\theta)^n = \\cos n\\theta + i\\sin n\\theta",tag:"General",formula:"(\\cos\\theta + i\\sin\\theta)^n = \\cos n\\theta + i\\sin n\\theta",details:"A profound theorem for complex numbers proving that raising a trigonometric complex coordinate to a power simply multiplies its angle."},
      {type:"formula",name:"Fundamental identities",tex:"\\sin^2x + \\cos^2x = 1, \\quad 1 + \\tan^2x = \\sec^2x, \\quad 1 + \\cot^2x = \\csc^2x",tag:"General",formula:"\\sin^2x + \\cos^2x = 1, \\quad 1 + \\tan^2x = \\sec^2x, \\quad 1 + \\cot^2x = \\csc^2x",details:"The Pythagorean identities of trigonometry, forming the basis for simplifying almost all sine and cosine expressions."},
      {type:"formula",name:"Sine sum/diff",tex:"\\sin(A \\pm B) = \\sin A \\cos B \\pm \\cos A \\sin B",tag:"General",formula:"\\sin(A \\pm B) = \\sin A \\cos B \\pm \\cos A \\sin B",details:"The trigonometric expansion utilized heavily in wave mechanics to break down complex overlapping frequencies."},
      {type:"formula",name:"Cosine sum/diff",tex:"\\cos(A \\pm B) = \\cos A \\cos B \\mp \\sin A \\sin B",tag:"General",formula:"\\cos(A \\pm B) = \\cos A \\cos B \\mp \\sin A \\sin B",details:"The corresponding cosine expansion, notorious for its sign flip in the middle of the equation."}
    ]},
    { title: "Calculus", items: [
      {type:"formula",name:"Derivative definition",tex:"f'(x) = \\lim_{h\\to 0}\\frac{f(x + h) - f(x)}{h}",tag:"General",formula:"f'(x) = \\lim_{h\\to 0}\\frac{f(x + h) - f(x)}{h}",details:"The foundational limit definition of differential calculus, evaluating the exact instantaneous slope or rate of change of a curve at a single point."},
      {type:"formula",name:"Product rule",tex:"(uv)' = u'v + uv'",tag:"General",formula:"(uv)' = u'v + uv'",details:"The standard calculus protocol for taking the derivative of a function composed of two multiplied variable expressions."},
      {type:"formula",name:"Quotient rule",tex:"\\left(\\frac{u}{v}\\right)' = \\frac{vu' - uv'}{v^2}",tag:"General",formula:"\\left(\\frac{u}{v}\\right)' = \\frac{vu' - uv'}{v^2}",details:"The differentiation rule for dealing with fractions of variables, notorious for requiring strict attention to the subtraction order in the numerator."},
      {type:"formula",name:"Chain rule",tex:"\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}",tag:"General",formula:"\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}",details:"A critical rule for unpacking the derivative of nested, composite functions by peeling them apart layer by layer."},
      {type:"formula",name:"Integration by parts",tex:"\\int u dv = uv - \\int v du",tag:"General",formula:"\\int u dv = uv - \\int v du",details:"The integral counterpart to the product rule, allowing mathematicians to solve extremely difficult integrals by swapping the integration focus to an easier term."},
      {type:"formula",name:"Fundamental theorem of calculus",tex:"\\int_a^b f(x) dx = F(b) - F(a)",tag:"General",formula:"\\int_a^b f(x) dx = F(b) - F(a)",details:"The magical bridge connecting the two halves of calculus, proving that calculating the area under a curve is the exact reverse operation of finding a slope."}
    ]},
    { title: "Vector Calculus & Differential Equations", items: [
      {type:"formula",name:"Gradient",tex:"\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z}\\right)",tag:"General",formula:"\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z}\\right)",details:"Transforms a scalar landscape (like temperature) into a 3D vector field pointing straight up the steepest local slope."},
      {type:"formula",name:"Divergence",tex:"\\nabla \\cdot \\vec{F} = \\frac{\\partial F_x}{\\partial x} + \\frac{\\partial F_y}{\\partial y} + \\frac{\\partial F_z}{\\partial z}",tag:"General",formula:"\\nabla \\cdot \\vec{F} = \\frac{\\partial F_x}{\\partial x} + \\frac{\\partial F_y}{\\partial y} + \\frac{\\partial F_z}{\\partial z}",details:"Calculates whether a specific point in a vector field acts as a radiating source pushing flow outward or a draining sink pulling flow inward."},
      {type:"formula",name:"Laplacian",tex:"\\nabla^2 f = \\frac{\\partial^2 f}{\\partial x^2} + \\frac{\\partial^2 f}{\\partial y^2} + \\frac{\\partial^2 f}{\\partial z^2}",tag:"General",formula:"\\nabla^2 f = \\frac{\\partial^2 f}{\\partial x^2} + \\frac{\\partial^2 f}{\\partial y^2} + \\frac{\\partial^2 f}{\\partial z^2}",details:"The divergence of the gradient. It forms the backbone of almost all physics wave equations, diffusion models, and Schrödinger's equation."},
      {type:"formula",name:"First-order linear ODE",tex:"\\frac{dy}{dx} + Py = Q, \\quad IF = e^{\\int P dx}, \\quad y(IF) = \\int Q(IF)dx + C",tag:"General",formula:"\\frac{dy}{dx} + Py = Q, \\quad IF = e^{\\int P dx}, \\quad y(IF) = \\int Q(IF)dx + C",details:"The standard integrating factor technique capable of cleanly solving any linear, first-order differential equation algebraically."},
      {type:"formula",name:"Laplace transform",tex:"\\mathcal{L}\\{f(t)\\} = F(s) = \\int_0^\\infty e^{-st}f(t) dt",tag:"General",formula:"\\mathcal{L}\\{f(t)\\} = F(s) = \\int_0^\\infty e^{-st}f(t) dt",details:"An integral transform heavily used in control engineering to turn complex calculus differential equations into much simpler algebraic problems in the s-domain."}
    ]},
    { title: "Statistics & Probability", items: [
      {type:"formula",name:"Mean",tex:"\\bar{x} = \\frac{\\sum x_i}{n}",tag:"General",formula:"\\bar{x} = \\frac{\\sum x_i}{n}",details:"Calculates the arithmetic average of a dataset, representing the central mathematical balancing point of the sample numbers."},
      {type:"formula",name:"Variance and standard deviation",tex:"\\sigma^2 = \\frac{1}{N}\\sum(x_i - \\bar{x})^2, \\quad \\sigma = \\sqrt{\\sigma^2}",tag:"General",formula:"\\sigma^2 = \\frac{1}{N}\\sum(x_i - \\bar{x})^2, \\quad \\sigma = \\sqrt{\\sigma^2}",details:"Evaluates statistical dispersion by measuring exactly how widely the individual data points are spread out or clumped around the central mean."},
      {type:"formula",name:"Conditional probability",tex:"P(A|B) = \\frac{P(A \\cap B)}{P(B)}",tag:"General",formula:"P(A|B) = \\frac{P(A \\cap B)}{P(B)}",details:"The fundamental equation assessing the likelihood of an event A occurring, strictly given the prior knowledge that event B has definitively happened."},
      {type:"formula",name:"Binomial probability",tex:"P(X = k) = {}^nC_k p^k (1 - p)^{n-k}",tag:"General",formula:"P(X = k) = {}^nC_k p^k (1 - p)^{n-k}",details:"Calculates the exact probability of achieving exactly 'k' discrete successes in 'n' independent, yes-or-no trials, like coin flips."},
      {type:"formula",name:"Normal distribution",tex:"f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}",tag:"General",formula:"f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}",details:"The ubiquitous classic bell curve probability density function, perfectly parameterizing random natural variations using only the mean and standard deviation."}
    ]}
  ]},
  { id: "chemistry", title: "25. Chemistry Fundamentals", sections: [
    { title: "Physical Chemistry", items: [
      {type:"formula",name:"Mole Concept",tex:"n = \\frac{m}{M} = \\frac{N}{N_A} = \\frac{V}{22.4L}",tag:"General",formula:"n = \\frac{m}{M} = \\frac{N}{N_A} = \\frac{V}{22.4L}",details:"The foundational chemistry conversion linking macroscopic grams and liters directly to the microscopic number of individual atoms via Avogadro's number."},
      {type:"formula",name:"Concentration in Molarity",tex:"M = \\frac{n_{\\text{solute}}}{V_{\\text{solution}} \\text{ (in L)}}",tag:"General",formula:"M = \\frac{n_{\\text{solute}}}{V_{\\text{solution}} \\text{ (in L)}}",details:"The standard laboratory measurement of liquid concentration, counting the exact moles of active solute dissolved per liter of the total liquid mixture."},
      {type:"formula",name:"Raoult's Law",tex:"P_A = P_A^\\circ \\chi_A",tag:"General",formula:"P_A = P_A^\\circ \\chi_A",details:"Predicts that the vapor pressure of an ideal chemical solution is simply the pure vapor pressure scaled down proportionally by its actual molar fraction in the mix."},
      {type:"formula",name:"Gibbs-Helmholtz Equation",tex:"\\left[ \\frac{\\partial (\\Delta G/T)}{\\partial T} \\right]_P = -\\frac{\\Delta H}{T^2}",tag:"General",formula:"\\left[ \\frac{\\partial (\\Delta G/T)}{\\partial T} \\right]_P = -\\frac{\\Delta H}{T^2}",details:"A crucial thermodynamic link allowing chemists to calculate exactly how the spontaneity of a chemical reaction will shift as temperatures change."},
      {type:"formula",name:"Nernst Equation",tex:"E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{RT}{nF} \\ln Q",tag:"General",formula:"E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{RT}{nF} \\ln Q",details:"Predicts the actual real-world voltage output of a battery cell under non-standard conditions, adjusting for temperature and changing chemical concentrations."},
      {type:"formula",name:"First-Order Reaction (Integrated Rate)",tex:"\\ln[A]_t = \\ln[A]_0 - kt \\implies k = \\frac{2.303}{t} \\log\\frac{[A]_0}{[A]_t}",tag:"General",formula:"\\ln[A]_t = \\ln[A]_0 - kt \\implies k = \\frac{2.303}{t} \\log\\frac{[A]_0}{[A]_t}",details:"The logarithmic kinetic decay equation that determines exactly how fast a chemical reactant gets consumed over time in a simple unimolecular reaction."},
      {type:"formula",name:"Arrhenius equation (ln)",tex:"\\ln k=\\ln A-\\frac{E_a}{RT}",tag:"General",formula:"\\ln k=\\ln A-\\frac{E_a}{RT}",details:"Demonstrates that reaction rates are exponentially sensitive to heat. Even small temperature increases dramatically boost the chance of overcoming activation energy limits."}
    ]},
    { title: "Inorganic & Equilibrium", items: [
      {type:"formula",name:"pH and pOH",tex:"\\text{pH} = -\\log[H^+], \\quad \\text{pOH} = -\\log[OH^-]",tag:"General",formula:"\\text{pH} = -\\log[H^+], \\quad \\text{pOH} = -\\log[OH^-]",details:"Converts highly awkward, microscopic ion concentration decimals into the simple, manageable 0-14 logarithmic scales of acidity and basicity."},
      {type:"formula",name:"Henderson-Hasselbalch Equation",tex:"\\text{pH} = \\text{pK}_a + \\log\\frac{[\\text{Salt}]}{[\\text{Acid}]}",tag:"General",formula:"\\text{pH} = \\text{pK}_a + \\log\\frac{[\\text{Salt}]}{[\\text{Acid}]}",details:"The go-to formula for biochemists to engineer and calculate the exact pH of stabilizing chemical buffer solutions."},
      {type:"formula",name:"Effective Atomic Number (EAN)",tex:"\\text{EAN} = Z - \\text{Oxidation State} + 2 \\times (\\text{Coordination Number})",tag:"General",formula:"\\text{EAN} = Z - \\text{Oxidation State} + 2 \\times (\\text{Coordination Number})",details:"A heuristic rule guiding transition metal chemistry. Complexes are highly stable when their total electron count matches that of a noble gas."},
      {type:"formula",name:"Crystal Field Stabilization Energy (CFSE)",tex:"\\text{CFSE} = (-0.4 n_{t_{2g}} + 0.6 n_{e_g})\\Delta_o + P",tag:"General",formula:"\\text{CFSE} = (-0.4 n_{t_{2g}} + 0.6 n_{e_g})\\Delta_o + P",details:"Quantifies the thermodynamic stability gained when d-orbital electrons in a transition metal drop into split, lower-energy orbital configurations."}
    ]}
  ]},
  { id: "biology", title: "26. Biology & Population Dynamics", sections: [
    { title: "Genetics & Molecular", items: [
      {type:"formula",name:"Michaelis-Menten kinetics",tex:"v=\\frac{V_{\\max}[S]}{K_m+[S]}",tag:"General",formula:"v=\\frac{V_{\\max}[S]}{K_m+[S]}",details:"The foundational biochemistry curve showing that an enzyme's processing speed hits a hard maximum ceiling once all its active binding sites are saturated."},
      {type:"formula",name:"DNA molecular mass",tex:"M_{\\rm DNA}\\approx660N_{\\rm bp}\\ \\text{g/mol}",tag:"General",formula:"M_{\\rm DNA}\\approx660N_{\\rm bp}\\ \\text{g/mol}",details:"A standard laboratory rule of thumb utilized to estimate the raw macroscopic weight of a DNA strand based purely on counting its base pairs."},
      {type:"formula",name:"Chargaff's rules 1",tex:"A=T",tag:"General",formula:"A=T",details:"The vital clue to the double helix: proved that adenine and thymine ratios are universally matched across all DNA, indicating they chemically pair up."},
      {type:"formula",name:"Hardy-Weinberg allele frequencies",tex:"p+q=1",tag:"General",formula:"p+q=1",details:"The baseline population genetics rule stating that for a basic two-allele biological trait, the combined percentage of the dominant and recessive alleles must equal 100%."},
      {type:"formula",name:"Hardy-Weinberg genotype frequencies",tex:"p^2+2pq+q^2=1",tag:"General",formula:"p^2+2pq+q^2=1",details:"Predicts the exact statistical distribution of genetic traits across a population assuming no evolutionary pressures like mutation or selection are occurring."},
      {type:"formula",name:"Recombination frequency",tex:"RF=\\frac{\\text{recombinant offspring}}{\\text{total offspring}}\\times100",tag:"General",formula:"RF=\\frac{\\text{recombinant offspring}}{\\text{total offspring}}\\times100",details:"Calculates genetic linkage. A lower percentage indicates that two distinct genes sit very closely together on the same physical chromosome."}
    ]},
    { title: "Ecology & Epidemiology", items: [
      {type:"formula",name:"Exponential growth equation",tex:"N_t=N_0e^{rt}",tag:"General",formula:"N_t=N_0e^{rt}",details:"Models the terrifyingly rapid, unchecked explosion of biological populations (like bacteria) given limitless food and zero predators."},
      {type:"formula",name:"Logistic population growth rate",tex:"\\frac{dN}{dt}=rN\\left(1-\\frac NK\\right)",tag:"General",formula:"\\frac{dN}{dt}=rN\\left(1-\\frac NK\\right)",details:"The realistic model of population growth. The rate starts exponential, but aggressively drops to zero as the population hits the environment's hard carrying capacity limit (K)."},
      {type:"formula",name:"SIR model (Susceptible)",tex:"\\frac{dS}{dt}=-\\beta\\frac{SI}{N}",tag:"General",formula:"\\frac{dS}{dt}=-\\beta\\frac{SI}{N}",details:"The epidemiological equation detailing the exact speed at which healthy, susceptible people succumb to a virus based on transmission rates and infected contact."},
      {type:"formula",name:"Basic reproduction number",tex:"R_0=\\beta cD",tag:"General",formula:"R_0=\\beta cD",details:"The infamous R-naught. If it is greater than 1, a virus outbreak will inherently expand; if less than 1, the disease mathematically fizzles out."},
      {type:"formula",name:"Lotka-Volterra competition 1",tex:"\\frac{dN_1}{dt}=r_1N_1\\left(1-\\frac{N_1+\\alpha N_2}{K_1}\\right)",tag:"General",formula:"\\frac{dN_1}{dt}=r_1N_1\\left(1-\\frac{N_1+\\alpha N_2}{K_1}\\right)",details:"Simulates the bitter ecological warfare between two species fighting for the same resources, accounting for both environmental limits and competitor suppression."},
      {type:"formula",name:"Predator-prey equation 1",tex:"\\frac{dN}{dt}=rN-aNP",tag:"General",formula:"\\frac{dN}{dt}=rN-aNP",details:"Models the oscillating population cycles seen in nature: prey multiply naturally but are actively depleted in proportion to the number of roaming predators."}
    ]}
  ]},
  { id: "condensed_matter", title: "27. Solid State & Condensed Matter", sections: [
    { title: "Crystallography & Band Theory", items: [
      {type:"formula",name:"Bragg's Law",tex:"n\\lambda = 2d\\sin\\theta",tag:"Scattering",formula:"n\\lambda = 2d\\sin\\theta",details:"The foundation of X-ray crystallography. It dictates exactly how light waves bounce off atomic crystal lattice planes to produce distinct constructive interference patterns."},
      {type:"formula",name:"Hall Coefficient",tex:"R_H = -\\frac{1}{ne}",tag:"Electromagnetism",formula:"R_H = -\\frac{1}{ne}",details:"A measurement used heavily in semiconductors to map out exactly whether electrical conduction is being handled by negative electrons or positive 'holes'."},
      {type:"formula",name:"Bloch's Theorem",tex:"\\psi_{\\mathbf{k}}(\\mathbf{r}) = e^{i\\mathbf{k}\\cdot\\mathbf{r}} u_{\\mathbf{k}}(\\mathbf{r})",tag:"Quantum",formula:"\\psi_{\\mathbf{k}}(\\mathbf{r}) = e^{i\\mathbf{k}\\cdot\\mathbf{r}} u_{\\mathbf{k}}(\\mathbf{r})",details:"Proves mathematically that quantum electrons can flow completely freely and endlessly through a perfectly arranged, repeating infinite crystal lattice."}
    ]}
  ]},
  { id: "particle_physics", title: "28. Particle Physics & Quantum Field Theory", sections: [
    { title: "Quantum Field Equations", items: [
      {type:"formula",name:"Dirac Equation",tex:"(i\\hbar\\gamma^\\mu\\partial_\\mu - mc)\\psi = 0",tag:"QFT",formula:"(i\\hbar\\gamma^\\mu\\partial_\\mu - mc)\\psi = 0",details:"The stunning equation unifying quantum mechanics and special relativity for electrons. It miraculously predicted antimatter years before it was physically discovered."},
      {type:"formula",name:"Klein-Gordon Equation",tex:"(\\Box + \\mu^2)\\phi = 0",tag:"QFT",formula:"(\\Box + \\mu^2)\\phi = 0",details:"The basic relativistic wave equation representing massive, spin-zero boson particles, like the elusive Higgs boson."},
      {type:"formula",name:"Heisenberg Uncertainty Principle",tex:"\\Delta x \\Delta p \\ge \\frac{\\hbar}{2}",tag:"Quantum",formula:"\\Delta x \\Delta p \\ge \\frac{\\hbar}{2}",details:"The hard limit placed by nature on reality: it is fundamentally, mathematically impossible to know a particle's exact location and exact momentum simultaneously."},
      {type:"formula",name:"De Broglie Wavelength",tex:"\\lambda = \\frac{h}{p}",tag:"Quantum",formula:"\\lambda = \\frac{h}{p}",details:"A staggering insight that blurred the line between matter and light, proving that solid, moving matter like an electron inherently behaves with physical, calculable wave properties."}
    ]}
  ]},
  { id: "advanced_math", title: "29. Advanced Mathematics & Transforms", sections: [
    { title: "Transforms & Series", items: [
      {type:"formula",name:"Fourier Transform",tex:"F(k) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi i k x} dx",tag:"Math",formula:"F(k) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi i k x} dx",details:"The magical mathematical tool underlying all modern signal processing. It deconstructs any complex, messy signal wave into a clean map of its constituent pure frequencies."},
      {type:"formula",name:"Inverse Fourier Transform",tex:"f(x) = \\int_{-\\infty}^{\\infty} F(k) e^{2\\pi i k x} dk",tag:"Math",formula:"f(x) = \\int_{-\\infty}^{\\infty} F(k) e^{2\\pi i k x} dk",details:"The perfectly symmetrical reverse operation, flawlessly rebuilding the complex physical wave from its mapped frequency ingredients."},
      {type:"formula",name:"Taylor Series Expansion",tex:"f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x-a)^n",tag:"Math",formula:"f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x-a)^n",details:"Allows mathematicians to take any smooth, horribly complicated function and elegantly rewrite it as a simple, infinite polynomial using derivatives."}
    ]}
  ]},
  { id: "mathematics_extended", title: "30. Mathematics — Extended Reference", sections: [
    { title: "Algebra & Number Theory", items: [
      {type:"formula",name:"Arithmetic-Geometric Mean Inequality",tex:"\\frac{a+b}{2}\\ge\\sqrt{ab}",tag:"Inequality",formula:"\\frac{a+b}{2}\\ge\\sqrt{ab}",details:"A fundamental theorem proving that the standard arithmetic average of non-negative numbers will eternally be greater than or equal to their geometric equivalent."},
      {type:"formula",name:"Cauchy-Schwarz Inequality",tex:"|\\langle x,y\\rangle|^2\\le\\langle x,x\\rangle\\langle y,y\\rangle",tag:"Inequality",formula:"|\\langle x,y\\rangle|^2\\le\\langle x,x\\rangle\\langle y,y\\rangle",details:"A foundational pillar of linear algebra and quantum mechanics, dictating hard absolute bounds on inner products between vectors."},
      {type:"formula",name:"Quadratic Formula",tex:"x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}",tag:"Algebra",formula:"x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}",details:"The legendary formula providing the two exact roots to any second-order polynomial equation. The discriminant under the square root determines real vs complex roots."},
      {type:"formula",name:"Binomial Theorem",tex:"(x+y)^n=\\sum_{k=0}^n\\binom nk x^{n-k}y^k",tag:"Algebra",formula:"(x+y)^n=\\sum_{k=0}^n\\binom nk x^{n-k}y^k",details:"Provides a fast, algebraic shortcut for perfectly expanding expressions raised to any integer power without having to manually multiply it all out."},
      {type:"formula",name:"Geometric Series",tex:"\\sum_{n=0}^{\\infty}r^n=\\frac1{1-r},\\ |r|<1",tag:"Series",formula:"\\sum_{n=0}^{\\infty}r^n=\\frac1{1-r},\\ |r|<1",details:"A remarkable mathematical proof showing that adding up an infinite string of numbers can resolve down to one clean, finite, specific value."},
      {type:"formula",name:"Arithmetic Series",tex:"\\sum_{k=1}^n k=\\frac{n(n+1)}2",tag:"Series",formula:"\\sum_{k=1}^n k=\\frac{n(n+1)}2",details:"The famous formula, allegedly derived by a young Gauss, to instantly calculate the total sum of all consecutive integers up to N."},
      {type:"formula",name:"Euler Totient Product",tex:"\\varphi(n)=n\\prod_{p\\mid n}(1-1/p)",tag:"Number Theory",formula:"\\varphi(n)=n\\prod_{p\\mid n}(1-1/p)",details:"A heavy-hitting formula in modern digital cryptography. It counts how many integers up to N are perfectly coprime to N."},
      {type:"formula",name:"Euler Identity",tex:"e^{i\\pi}+1=0",tag:"Complex Analysis",formula:"e^{i\\pi}+1=0",details:"Often called the most beautiful equation in math, miraculously connecting the five most fundamental constants of mathematics (0, 1, pi, e, i) into a single expression."}
    ]},
    { title: "Calculus & Analysis", items: [
      {type:"formula",name:"Derivative Definition",tex:"f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}h",tag:"Calculus",formula:"f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}h",details:"The foundational limit definition of differential calculus, evaluating the exact instantaneous slope or rate of change of a curve at a single point."},
      {type:"formula",name:"Fundamental Theorem of Calculus",tex:"\\int_a^b f^{\\prime}(x)dx=f(b)-f(a)",tag:"Calculus",formula:"\\int_a^b f^{\\prime}(x)dx=f(b)-f(a)",details:"The magical bridge connecting the two halves of calculus, proving that calculating the area under a curve is the exact reverse operation of finding a slope."},
      {type:"formula",name:"Taylor Series",tex:"f(x)=\\sum_{n=0}^{\\infty}\\frac{f^{(n)}(a)}{n!}(x-a)^n",tag:"Analysis",formula:"f(x)=\\sum_{n=0}^{\\infty}\\frac{f^{(n)}(a)}{n!}(x-a)^n",details:"Allows mathematicians to take any smooth, horribly complicated function and elegantly rewrite it as a simple, infinite polynomial using derivatives."},
      {type:"formula",name:"Multivariable Chain Rule",tex:"\\frac{d f}{dt}=\\sum_i\\frac{\\partial f}{\\partial x_i}\\frac{dx_i}{dt}",tag:"Calculus",formula:"\\frac{d f}{dt}=\\sum_i\\frac{\\partial f}{\\partial x_i}\\frac{dx_i}{dt}",details:"Extends standard differentiation protocols to handle complex interconnected variables across three dimensions or higher."},
      {type:"formula",name:"Gradient",tex:"\\nabla f=(\\partial_x f,\\partial_y f,\\partial_z f)",tag:"Vector Calculus",formula:"\\nabla f=(\\partial_x f,\\partial_y f,\\partial_z f)",details:"Transforms a scalar landscape (like temperature) into a 3D vector field pointing straight up the steepest local slope."},
      {type:"formula",name:"Divergence",tex:"\\nabla\\cdot F=\\sum_i\\partial_iF_i",tag:"Vector Calculus",formula:"\\nabla\\cdot F=\\sum_i\\partial_iF_i",details:"Calculates whether a specific point in a vector field acts as a radiating source pushing flow outward or a draining sink pulling flow inward."},
      {type:"formula",name:"Laplacian",tex:"\\nabla^2f=\\nabla\\cdot\\nabla f",tag:"Vector Calculus",formula:"\\nabla^2f=\\nabla\\cdot\\nabla f",details:"The divergence of the gradient. It forms the backbone of almost all physics wave equations, diffusion models, and Schrödinger's equation."},
      {type:"formula",name:"Green Theorem",tex:"\\oint_C(Pdx+Qdy)=\\iint_D(\\partial_xQ-\\partial_yP)dA",tag:"Vector Calculus",formula:"\\oint_C(Pdx+Qdy)=\\iint_D(\\partial_xQ-\\partial_yP)dA",details:"Proves mathematically that calculating the macroscopic swirl around the physical boundary of a region exactly matches summing up the microscopic curl entirely across its interior."},
      {type:"formula",name:"Divergence Theorem",tex:"\\iiint_V\\nabla\\cdot F\\,dV=\\iint_{\\partial V}F\\cdot dA",tag:"Vector Calculus",formula:"\\iiint_V\\nabla\\cdot F\\,dV=\\iint_{\\partial V}F\\cdot dA",details:"Connects internal properties to boundaries by demonstrating that the total outward flux punching through a 3D surface equals the volume integral of internal sources."},
      {type:"formula",name:"Stokes Theorem",tex:"\\oint_{\\partial S}F\\cdot dr=\\iint_S(\\nabla\\times F)\\cdot dS",tag:"Vector Calculus",formula:"\\oint_{\\partial S}F\\cdot dr=\\iint_S(\\nabla\\times F)\\cdot dS",details:"The towering 3D extension of Green's theorem, equating the total twist along a curved rim entirely to the magnetic-like curl flux piercing through its open surface."}
    ]},
    { title: "ODE PDE Transforms", items: [
      {type:"formula",name:"First Order Linear ODE",tex:"y\\prime+P(x)y=Q(x)",tag:"ODE",formula:"y\\prime+P(x)y=Q(x)",details:"The basic structural form of a first-order ordinary differential equation, describing the instantaneous slope of a dynamic variable."},
      {type:"formula",name:"Heat Equation",tex:"\\partial_tu=\\alpha\\nabla^2u",tag:"PDE",formula:"\\partial_tu=\\alpha\\nabla^2u",details:"The foundational diffusion equation dictating exactly how temperature slowly smooths itself out across a material as time ticks forward."},
      {type:"formula",name:"Wave Equation",tex:"\\partial_t^2u=c^2\\nabla^2u",tag:"PDE",formula:"\\partial_t^2u=c^2\\nabla^2u",details:"The quintessential hyperbolic equation mapping how oscillating ripples and vibrations transmit themselves outward at a constant velocity."},
      {type:"formula",name:"Poisson Equation",tex:"\\nabla^2\\phi=f",tag:"PDE",formula:"\\nabla^2\\phi=f",details:"Describes exactly how scalar potentials (like gravitational or electrical fields) adapt and curve in direct response to the massive or charged sources creating them."},
      {type:"formula",name:"Laplace Equation",tex:"\\nabla^2\\phi=0",tag:"PDE",formula:"\\nabla^2\\phi=0",details:"The empty-space variant of Poisson's equation. Solutions dictate the perfectly smooth, source-free flow fields found in steady electromagnetism and fluid dynamics."},
      {type:"formula",name:"Fourier Transform",tex:"\\hat f(k)=\\int_{-\\infty}^{\\infty}f(x)e^{-ikx}dx",tag:"Transforms",formula:"\\hat f(k)=\\int_{-\\infty}^{\\infty}f(x)e^{-ikx}dx",details:"The magical mathematical tool underlying all modern signal processing. It deconstructs any complex, messy signal wave into a clean map of its constituent pure frequencies."},
      {type:"formula",name:"Inverse Fourier Transform",tex:"f(x)=\\frac1{2\\pi}\\int_{-\\infty}^{\\infty}\\hat f(k)e^{ikx}dk",tag:"Transforms",formula:"f(x)=\\frac1{2\\pi}\\int_{-\\infty}^{\\infty}\\hat f(k)e^{ikx}dk",details:"The perfectly symmetrical reverse operation, flawlessly rebuilding the complex physical wave from its mapped frequency ingredients."},
      {type:"formula",name:"Laplace Transform",tex:"F(s)=\\int_0^\\infty f(t)e^{-st}dt",tag:"Transforms",formula:"F(s)=\\int_0^\\infty f(t)e^{-st}dt",details:"An integral transform heavily used in control engineering to turn complex calculus differential equations into much simpler algebraic problems in the s-domain."}
    ]},
    { title: "Probability Statistics", items: [
      {type:"formula",name:"Bayes Theorem",tex:"P(A|B)=\\frac{P(B|A)P(A)}{P(B)}",tag:"Probability",formula:"P(A|B)=\\frac{P(B|A)P(A)}{P(B)}",details:"The mathematical basis of modern machine learning and logic. It calculates how strongly we must update our prior beliefs upon seeing new, surprising evidence."},
      {type:"formula",name:"Expectation",tex:"E[X]=\\sum_xxP(X=x)",tag:"Probability",formula:"E[X]=\\sum_xxP(X=x)",details:"Yields the long-run statistical average of a probabilistic event, heavily used by casinos and insurance companies to guarantee long-term outcomes."},
      {type:"formula",name:"Variance",tex:"Var(X)=E[(X-E[X])^2]",tag:"Statistics",formula:"Var(X)=E[(X-E[X])^2]",details:"Evaluates statistical dispersion by measuring exactly how widely the individual data points are mathematically spread out from the central mean."},
      {type:"formula",name:"Normal Distribution",tex:"f(x)=\\frac1{\\sigma\\sqrt{2\\pi}}e^{-(x-\\mu)^2/(2\\sigma^2)}",tag:"Statistics",formula:"f(x)=\\frac1{\\sigma\\sqrt{2\\pi}}e^{-(x-\\mu)^2/(2\\sigma^2)}",details:"The ubiquitous classic bell curve probability density function, perfectly parameterizing random natural variations using only the mean and standard deviation."},
      {type:"formula",name:"Central Limit Theorem",tex:"\\frac{\\bar X_n-\\mu}{\\sigma/\\sqrt n}\\xrightarrow{d}N(0,1)",tag:"Probability",formula:"\\frac{\\bar X_n-\\mu}{\\sigma/\\sqrt n}\\xrightarrow{d}N(0,1)",details:"The miracle of statistics proving that if you take enough random samples of absolutely anything, the resulting averages will inevitably form a perfect bell curve."}
    ]},
    { title: "Differential Geometry & Tensors", items: [
      {type:"formula",name:"Metric",tex:"ds^2=g_{\\mu\\nu}dx^\\mu dx^\\nu",tag:"Geometry",formula:"ds^2=g_{\\mu\\nu}dx^\\mu dx^\\nu",details:"The absolute foundation of relativity. It is a mathematical ruler that dictates exactly how the abstract coordinates of a space translate into real, physical distances."},
      {type:"formula",name:"Covariant Derivative",tex:"\\nabla_\\mu V^\\nu=\\partial_\\mu V^\\nu+\\Gamma^\\nu_{\\mu\\lambda}V^\\lambda",tag:"Tensor Calculus",formula:"\\nabla_\\mu V^\\nu=\\partial_\\mu V^\\nu+\\Gamma^\\nu_{\\mu\\lambda}V^\\lambda",details:"An upgraded version of standard calculus allowing researchers to compute proper rates of change that respect the bending and twisting of curved geometric spaces."},
      {type:"formula",name:"Lie Bracket",tex:"[X,Y]^i=X^j\\partial_jY^i-Y^j\\partial_jX^i",tag:"Differential Geometry",formula:"[X,Y]^i=X^j\\partial_jY^i-Y^j\\partial_jX^i",details:"A tensor operation demonstrating how tracking along one geometric path and then another may yield a fundamentally different result than swapping the order."},
      {type:"formula",name:"Geodesic Equation",tex:"\\frac{d^2x^\\mu}{d\\lambda^2}+\\Gamma^\\mu_{\\alpha\\beta}\\frac{dx^\\alpha}{d\\lambda}\\frac{dx^\\beta}{d\\lambda}=0",tag:"Differential Geometry",formula:"\\frac{d^2x^\\mu}{d\\lambda^2}+\\Gamma^\\mu_{\\alpha\\beta}\\frac{dx^\\alpha}{d\\lambda}\\frac{dx^\\beta}{d\\lambda}=0",details:"The equation defining a 'straight line' in curved spacetime. It dictates exactly how planets, stars, and light fall freely under the sole influence of gravity."}
    ]}
  ]},
  { id: "chemistry_extended", title: "31. Chemistry — Extended Reference", sections: [
    { title: "Physical Chemistry", items: [
      {type:"formula",name:"Ideal Gas Law",tex:"PV=nRT",tag:"Thermodynamics",formula:"PV=nRT",details:"The universal equation of state for hypothetical ideal gases, bridging macroscopic pressure, volume, and temperature to molar quantity."},
      {type:"formula",name:"Dalton Law",tex:"P=\\sum_iP_i",tag:"Gases",formula:"P=\\sum_iP_i",details:"Demonstrates that in a mixed balloon of non-reacting gases, the total pressure is simply the additive sum of the independent partial pressures exerted by each gas."},
      {type:"formula",name:"Gibbs Free Energy",tex:"\\Delta G=\\Delta H-T\\Delta S",tag:"Thermodynamics",formula:"\\Delta G=\\Delta H-T\\Delta S",details:"The most vital potential for chemistry and biology, determining the spontaneity of processes under constant pressure and temperature conditions."},
      {type:"formula",name:"Chemical Potential",tex:"\\mu_i=(\\partial G/\\partial n_i)_{T,P,n_{j\\ne i}}",tag:"Thermodynamics",formula:"\\mu_i=(\\partial G/\\partial n_i)_{T,P,n_{j\\ne i}}",details:"The thermodynamic driving force governing phase transitions and chemical reactions, measuring how much energy shifts when one particle is added."},
      {type:"formula",name:"Van’t Hoff Equation",tex:"\\frac{d\\ln K}{dT}=\\frac{\\Delta H^\\circ}{RT^2}",tag:"Equilibrium",formula:"\\frac{d\\ln K}{dT}=\\frac{\\Delta H^\\circ}{RT^2}",details:"Predicts how chemical equilibrium brutally shifts in response to temperature. Endothermic reactions get boosted by heat, while exothermic ones get suppressed."},
      {type:"formula",name:"Arrhenius Equation",tex:"k=Ae^{-E_a/(RT)}",tag:"Kinetics",formula:"k=Ae^{-E_a/(RT)}",details:"Demonstrates that reaction rates are exponentially sensitive to heat. Even small temperature increases dramatically boost the chance of overcoming activation energy limits."},
      {type:"formula",name:"Nernst Equation",tex:"E=E^\\circ-\\frac{RT}{nF}\\ln Q",tag:"Electrochemistry",formula:"E=E^\\circ-\\frac{RT}{nF}\\ln Q",details:"Predicts the actual real-world voltage output of a battery cell under non-standard conditions, adjusting for temperature and changing chemical concentrations."},
      {type:"formula",name:"Beer-Lambert Law",tex:"A=\\varepsilon lc",tag:"Spectroscopy",formula:"A=\\varepsilon lc",details:"The underlying principle of spectrometers. By shining light through a sample and measuring the absorbance, chemists can calculate exact particle concentration."},
      {type:"formula",name:"Raoult Law",tex:"P_i=x_iP_i^\\circ",tag:"Solutions",formula:"P_i=x_iP_i^\\circ",details:"Predicts that the vapor pressure of an ideal chemical solution is simply the pure vapor pressure scaled down proportionally by its actual molar fraction in the mix."},
      {type:"formula",name:"Henry Law",tex:"c=k_HP",tag:"Solutions",formula:"c=k_HP",details:"Why sodas fizz: the solubility of a gas trapped dissolving in a liquid scales linearly with the physical pressure compressing it from above."}
    ]},
    { title: "Equilibrium Acids Bases", items: [
      {type:"formula",name:"Equilibrium Constant",tex:"K=\\prod_i a_i^{\\nu_i}",tag:"Equilibrium",formula:"K=\\prod_i a_i^{\\nu_i}",details:"The mathematical ratio characterizing a chemical reaction completely halted at its stable balancing point, derived from product and reactant activities."},
      {type:"formula",name:"pH",tex:"pH=-\\log_{10}a_{H^+}",tag:"Acid Base",formula:"pH=-\\log_{10}a_{H^+}",details:"Converts highly awkward, microscopic ion concentration decimals into the simple, manageable 0-14 logarithmic scales of acidity and basicity."},
      {type:"formula",name:"Henderson-Hasselbalch",tex:"pH=pK_a+\\log_{10}([A^-]/[HA])",tag:"Acid Base",formula:"pH=pK_a+\\log_{10}([A^-]/[HA])",details:"The go-to formula for biochemists to engineer and calculate the exact pH of stabilizing chemical buffer solutions."},
      {type:"formula",name:"Water Ion Product",tex:"K_w=a_{H^+}a_{OH^-}",tag:"Acid Base",formula:"K_w=a_{H^+}a_{OH^-}",details:"The universal constant dictating that the product of acidic and basic ion concentrations in standard liquid water will rigidly equal 10^-14."}
    ]},
    { title: "Electrochemistry", items: [
      {type:"formula",name:"Faraday Electrolysis",tex:"m=\\frac{Q M}{zF}",tag:"Electrochemistry",formula:"m=\\frac{Q M}{zF}",details:"Allows chemists to calculate the precise mass of solid metal that will electroplate onto a cathode based purely on the total electrical charge pumped through the solution."},
      {type:"formula",name:"Conductivity",tex:"\\kappa=1/\\rho",tag:"Electrochemistry",formula:"\\kappa=1/\\rho",details:"A fundamental material property measuring the absolute ease at which an electrolyte solution allows electric charges to swim through it."},
      {type:"formula",name:"Molar Conductivity",tex:"\\Lambda_m=\\kappa/c",tag:"Electrochemistry",formula:"\\Lambda_m=\\kappa/c",details:"Normalizes raw conductivity against concentration, revealing the true ion mobility and strength of an acid or base solution independent of its dilution."}
    ]},
    { title: "Organic & Biochemistry", items: [
      {type:"formula",name:"Degree of Unsaturation",tex:"DBE=C-\\frac H2+\\frac N2+1",tag:"Organic Chemistry",formula:"DBE=C-\\frac H2+\\frac N2+1",details:"A structural cheat code: plugging in the chemical formula instantly tells chemists how many rings or pi-bonds must exist in an unknown organic molecule."},
      {type:"formula",name:"Michaelis-Menten",tex:"v=\\frac{V_{max}[S]}{K_M+[S]}",tag:"Enzymology",formula:"v=\\frac{V_{max}[S]}{K_M+[S]}",details:"The foundational biochemistry curve showing that an enzyme's processing speed hits a hard maximum ceiling once all its active binding sites are saturated."},
      {type:"formula",name:"Eyring Equation",tex:"k=\\frac{k_BT}{h}e^{-\\Delta G^\\ddagger/(RT)}",tag:"Kinetics",formula:"k=\\frac{k_BT}{h}e^{-\\Delta G^\\ddagger/(RT)}",details:"A thermodynamics-based upgrade to Arrhenius linking the rate of a chemical reaction directly to the entropy and enthalpy properties of its unstable transition state."}
    ]}
  ]},
  { id: "biology_quantitative", title: "32. Biology — Quantitative Reference", sections: [
    { title: "Cell & Membrane Physics", items: [
      {type:"formula",name:"Fick First Law",tex:"J=-D\\nabla c",tag:"Transport",formula:"J=-D\\nabla c",details:"The universal law of diffusion proving that particles will naturally flow downhill along their concentration gradient in a desperate attempt to homogenize."},
      {type:"formula",name:"Fick Second Law",tex:"\\partial_tc=D\\nabla^2c",tag:"Transport",formula:"\\partial_tc=D\\nabla^2c",details:"A dynamic partial differential equation simulating exactly how the density of diffusing particles spreads, flows, and evolves across space over time."},
      {type:"formula",name:"Nernst Membrane Potential",tex:"E_{ion}=\\frac{RT}{zF}\\ln\\frac{[ion]_{out}}{[ion]_{in}}",tag:"Membrane Physiology",formula:"E_{ion}=\\frac{RT}{zF}\\ln\\frac{[ion]_{out}}{[ion]_{in}}",details:"The electrical equilibrium point. It calculates the exact microscopic voltage an ion gradient generates to counteract the force of chemical diffusion."},
      {type:"formula",name:"Nernst-Planck Flux",tex:"J=-D\\nabla c-\\frac{zFD}{RT}c\\nabla\\phi+c v",tag:"Transport",formula:"J=-D\\nabla c-\\frac{zFD}{RT}c\\nabla\\phi+c v",details:"The master equation for cellular ion channels. It tracks total particle movement by summing up gradient diffusion, electrical voltage pushing, and bulk fluid flow."}
    ]},
    { title: "Population & Ecology", items: [
      {type:"formula",name:"Exponential Growth",tex:"\\frac{dN}{dt}=rN",tag:"Population",formula:"\\frac{dN}{dt}=rN",details:"The differential model mapping the sheer velocity of an unrestricted population explosion, where the growth rate scales simply against the current massive population."},
      {type:"formula",name:"Exponential Solution",tex:"N(t)=N_0e^{rt}",tag:"Population",formula:"N(t)=N_0e^{rt}",details:"Models the terrifyingly rapid, unchecked explosion of biological populations (like bacteria) given limitless food and zero predators."},
      {type:"formula",name:"Logistic Growth",tex:"\\frac{dN}{dt}=rN(1-N/K)",tag:"Population",formula:"\\frac{dN}{dt}=rN(1-N/K)",details:"The realistic model of population growth. The rate starts exponential, but aggressively drops to zero as the population hits the environment's hard carrying capacity limit (K)."},
      {type:"formula",name:"Lotka-Volterra Prey",tex:"\\frac{dx}{dt}=\\alpha x-\\beta xy",tag:"Ecology",formula:"\\frac{dx}{dt}=\\alpha x-\\beta xy",details:"Models natural prey population dynamics. They multiply exponentially via the alpha term but suffer deadly depletion proportional to encounters with predators."},
      {type:"formula",name:"Lotka-Volterra Predator",tex:"\\frac{dy}{dt}=\\delta xy-\\gamma y",tag:"Ecology",formula:"\\frac{dy}{dt}=\\delta xy-\\gamma y",details:"Models the predator side. Their numbers dwindle naturally due to death but spike upward proportionally to their successful hunting interactions with prey."}
    ]},
    { title: "Epidemiology", items: [
      {type:"formula",name:"SIR Susceptible",tex:"dS/dt=-\\beta SI/N",tag:"Epidemiology",formula:"dS/dt=-\\beta SI/N",details:"The epidemiological equation detailing the exact speed at which healthy, susceptible people succumb to a virus based on transmission rates and infected contact."},
      {type:"formula",name:"SIR Infected",tex:"dI/dt=\\beta SI/N-\\gamma I",tag:"Epidemiology",formula:"dI/dt=\\beta SI/N-\\gamma I",details:"Tracks the terrifying peak curve of an active pandemic, calculating the total active infections as a delicate war between new sickness and steady recoveries."},
      {type:"formula",name:"SIR Recovered",tex:"dR/dt=\\gamma I",tag:"Epidemiology",formula:"dR/dt=\\gamma I",details:"Maps the rising immunity of a population, showing the constant rate at which infected people resolve their illness and become removed from the viral chain."},
      {type:"formula",name:"Basic Reproduction Number",tex:"R_0=\\beta/\\gamma",tag:"Epidemiology",formula:"R_0=\\beta/\\gamma",details:"The infamous R-naught. If it is greater than 1, a virus outbreak will inherently expand; if less than 1, the disease mathematically fizzles out."}
    ]},
    { title: "Genetics", items: [
      {type:"formula",name:"Hardy-Weinberg",tex:"p^2+2pq+q^2=1",tag:"Population Genetics",formula:"p^2+2pq+q^2=1",details:"Predicts the exact statistical distribution of genetic traits across a population assuming no evolutionary pressures like mutation or selection are occurring."},
      {type:"formula",name:"Allele Sum",tex:"p+q=1",tag:"Population Genetics",formula:"p+q=1",details:"The baseline population genetics rule stating that for a basic two-allele biological trait, the combined percentage of the dominant and recessive alleles must equal 100%."}
    ]},
    { title: "Biochemistry", items: [
      {type:"formula",name:"Reaction Free Energy",tex:"\\Delta G=\\Delta G^\\circ+RT\\ln Q",tag:"Biochemistry",formula:"\\Delta G=\\Delta G^\\circ+RT\\ln Q",details:"Reveals if a cell's biochemical reaction will trigger spontaneously in the body by tweaking standard energies with current metabolic concentrations."},
      {type:"formula",name:"Equilibrium Free Energy",tex:"\\Delta G^\\circ=-RT\\ln K",tag:"Biochemistry",formula:"\\Delta G^\\circ=-RT\\ln K",details:"Demonstrates that the chemical equilibrium constant is utterly enslaved to the core thermodynamic stability of the specific molecules interacting."}
    ]}
  ]},
  { id: "constants_reference", title: "33. Constants & Reference", sections: [
    { title: "SI Constants", items: [
      {type:"formula",name:"Speed of Light",tex:"c=299792458\\,\\mathrm{m/s}",tag:"Constant",formula:"c=299792458\\,\\mathrm{m/s}",details:"The ultimate, absolute speed limit of causality in the universe. It is exact by definition and dictates the geometry of 4D spacetime."},
      {type:"formula",name:"Planck Constant",tex:"h=6.62607015\\times10^{-34}\\,\\mathrm{J\\,s}",tag:"Constant",formula:"h=6.62607015\\times10^{-34}\\,\\mathrm{J\\,s}",details:"The fundamental grain size of the quantum universe. It dictates exactly how discrete, chunky packets of energy relate to their wave frequency."},
      {type:"formula",name:"Elementary Charge",tex:"e=1.602176634\\times10^{-19}\\,\\mathrm C",tag:"Constant",formula:"e=1.602176634\\times10^{-19}\\,\\mathrm C",details:"The base, indivisible unit of electrical charge carried by a single proton or electron, establishing the scale for all chemistry and electromagnetism."},
      {type:"formula",name:"Boltzmann Constant",tex:"k_B=1.380649\\times10^{-23}\\,\\mathrm{J/K}",tag:"Constant",formula:"k_B=1.380649\\times10^{-23}\\,\\mathrm{J/K}",details:"The proportionality constant creating a physical bridge between macroscopic thermometer temperatures and the microscopic, chaotic kinetic energy of atoms."},
      {type:"formula",name:"Avogadro Constant",tex:"N_A=6.02214076\\times10^{23}\\,\\mathrm{mol^{-1}}",tag:"Constant",formula:"N_A=6.02214076\\times10^{23}\\,\\mathrm{mol^{-1}}",details:"The massive scaling factor that translates invisible, individual atomic reactions directly into practical, weighable macroscopic quantities in a laboratory beaker."},
      {type:"formula",name:"Gravitational Constant",tex:"G\\approx6.67430\\times10^{-11}\\,\\mathrm{m^3kg^{-1}s^{-2}}",tag:"Constant",formula:"G\\approx6.67430\\times10^{-11}\\,\\mathrm{m^3kg^{-1}s^{-2}}",details:"The weakest and arguably most mysterious of all fundamental constants, dictating exactly how much gravitational attraction massive bodies exert on spacetime."}
    ]}
  ]}
];

// ==========================================================
// 2. HELPER HOOKS & UI COMPONENTS
// ==========================================================
const useWindowSize = () => {
  const [size, setSize] = useState({ width: 1024, isMobile: false });
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, isMobile: window.innerWidth < 768 });
    handleResize();
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
                <div style={{ fontSize: '10px', color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>FORMULA DETAILS</div>
                <div style={{ fontSize: '14px', color: '#e5e7eb', lineHeight: '1.5' }}>{selectedFormula.details || 'No details provided.'}</div>
              </div>
            </div>
          </>
        )}
        {!selectedFormula && !isMobile && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
            Click an equation in the main panel to view its physical properties and details.
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