import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ==========================================================
// 1. STRUCTURED PHYSICS DATA (PHY_DATA)
// ==========================================================
const PHY_DATA = [
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
      {type:"formula",name:"Work-Energy Theorem",tex:"W_{\\net}=\\Delta K=K_f-K_i",tag:"Energy",formula:"W_{\\mathrm{net}}=\\Delta K=K_f-K_i",details:"The net work done by all forces on an object directly equals the change in its kinetic energy."},
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
    { title: "Advanced Classical Mechanics", items: [
      {type:"formula",name:"Hamilton-Jacobi Equation",tex:"H\\left(q,\\frac{\\partial S}{\\partial q},t\\right) + \\frac{\\partial S}{\\partial t} = 0",tag:"Analytical Mechanics",formula:"H(q, \\partial S/\\partial q, t) + \\partial S/\\partial t = 0",details:"A formulation of classical mechanics where the equations of motion are expressed as a partial differential equation for Hamilton's principal function S."},
      {type:"formula",name:"Poisson Bracket",tex:"\\{f,g\\} = \\sum_{i} \\left( \\frac{\\partial f}{\\partial q_i} \\frac{\\partial g}{\\partial p_i} - \\frac{\\partial f}{\\partial p_i} \\frac{\\partial g}{\\partial q_i} \\right)",tag:"Analytical Mechanics",formula:"\\{f,g\\} = \\sum ( \\partial_q f \\partial_p g - \\partial_p f \\partial_q g )",details:"A deeply fundamental algebraic operation in Hamiltonian mechanics playing a central role in the time evolution of observables, heavily mirroring the quantum commutator."},
      {type:"formula",name:"Liouville's Theorem",tex:"\\frac{d\\rho}{dt} = 0",tag:"Statistical Mechanics",formula:"d\\rho/dt = 0",details:"Proves that the density of system points in phase space is strictly conserved along the trajectories of the system; phase space behaves like an incompressible fluid."}
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
      {type:"formula",name:"Magnetic Pressure",tex:"P_B=\\frac{B^2}{2\\mu_0}",tag:"Thermodynamics",formula:"P_B=\\frac{B^2}{2\\mu_0}",details:"The effective isotropic pressure exerted by a magnetic field. Plasmas often find equilibrium by balancing thermal gas pressure against this magnetic pressure."},
      {type:"formula",name:"Vlasov Equation",tex:"\\frac{\\partial f}{\\partial t} + \\mathbf{v}\\cdot\\nabla f + \\frac{q}{m}(\\mathbf{E}+\\mathbf{v}\\times\\mathbf{B})\\cdot\\frac{\\partial f}{\\partial \\mathbf{v}} = 0",tag:"Plasma Physics",formula:"\\frac{\\partial f}{\\partial t} + \\mathbf{v}\\cdot\\nabla f + ... = 0",details:"The collisionless Boltzmann equation detailing plasma evolution purely through self-consistent macroscopic electromagnetic fields."}
    ]}
  ]},
  { id: "electromagnetism", title: "3. Electromagnetism", sections: [
    { title: "Potentials & Fields", items: [
      {type:"formula",name:"Vector & Scalar Potentials",tex:"\\mathbf B=\\nabla\\times\\mathbf A \\quad,\\quad \\mathbf E=-\\nabla\\phi-\\frac{\\partial\\mathbf A}{\\partial t}",tag:"Definitions",formula:"\\mathbf B=\\nabla\\times\\mathbf A \\quad,\\quad \\mathbf E=-\\nabla\\phi-\\frac{\\partial\\mathbf A}{\\partial t}",details:"Expresses the physical E and B fields strictly through derivatives of the more fundamental vector (A) and scalar (phi) potentials."},
      {type:"formula",name:"Liénard-Wiechert Potentials",tex:"\\phi(\\mathbf{r}, t) = \\frac{1}{4\\pi\\epsilon_0} \\left( \\frac{q}{(1 - \\mathbf{n}\\cdot\\boldsymbol{\\beta})|\\mathbf{r} - \\mathbf{r}_s|} \\right)_{t_r}",tag:"Electrodynamics",formula:"\\phi(\\mathbf{r}, t) = ...",details:"The exact relativistic scalar and vector potentials generated by a moving point charge, evaluated strictly at the retarded time."},
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
      {type:"formula",name:"Heisenberg Equation of Motion",tex:"\\frac{d\\hat A}{dt} = \\frac{i}{\\hbar}[\\hat H,\\hat A] + \\frac{\\partial\\hat A}{\\partial t}",tag:"Evolution",formula:"\\frac{d\\hat A}{dt} = \\frac{i}{\\hbar}[\\hat H,\\hat A] + \\frac{\\partial\\hat A}{\\partial t}",details:"The Heisenberg picture of QM, where quantum states remain static but the observable mathematical operators themselves evolve forward through time."},
      {type:"formula",name:"Bell Inequalities (CHSH)",tex:"|E(a,b) - E(a,b') + E(a',b) + E(a',b')| \\le 2",tag:"Entanglement",formula:"|E(a,b) - ...| \\le 2",details:"The mathematical bound on classical local hidden variable theories, consistently violated by quantum entanglement."}
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
      {type:"formula",name:"Radiative Energy Transport",tex:"\\frac{dT}{dr} = -\\frac{3\\kappa\\rho L}{16\\pi acT^3r^2}",tag:"Transport",formula:"\\frac{dT}{dr} = -\\frac{3\\kappa\\rho L}{16\\pi acT^3r^2}",details:"Describes how heat physically diffuses outward through the star's opaque radiative zones, forcing photons into a brutal, million-year random walk to the surface."},
      {type:"formula",name:"Lane-Emden Equation",tex:"\\frac{1}{\\xi^2} \\frac{d}{d\\xi}\\left(\\xi^2 \\frac{d\\theta}{d\\xi}\\right) + \\theta^n = 0",tag:"Polytropes",formula:"...",details:"The dimensionless form of Poisson's equation for the gravitational potential of a self-gravitating, spherically symmetric polytropic fluid."}
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
      {type:"formula",name:"Hawking Temperature",tex:"T_H = \\frac{\\hbar c^3}{8\\pi G M k_B}",tag:"Thermodynamics",formula:"T_H = \\hbar c^3 / 8\\pi G M k_B",details:"The temperature of the blackbody radiation emitted by a black hole due to quantum effects near the event horizon."},
      {type:"text",content:"STATUS: Hawking Radiation is a semiclassical theoretical prediction; not directly experimentally detected."},
      {type:"formula",name:"Bekenstein-Hawking Entropy",tex:"S_{BH} = \\frac{k_Bc^3A}{4G\\hbar}",tag:"Thermodynamics",formula:"S_{BH} = \\frac{k_Bc^3A}{4G\\hbar}",details:"A groundbreaking formula suggesting that a black hole's information content is entirely stored on its 2D surface boundary, launching the holographic principle of the universe."},
      {type:"formula",name:"Horizon Angular Velocity",tex:"\\Omega_H= \\frac{ac}{r_+^2+a^2}",tag:"Kinematics",formula:"\\Omega_H= \\frac{ac}{r_+^2+a^2}",details:"The rate at which the absolute fabric of spacetime itself is spinning exactly at the event horizon boundary. To stand still here requires faster-than-light travel."},
      {type:"formula",name:"First Law of BH Mechanics",tex:"d(Mc^2) = T_HdS+\\Omega_HdJ+\\Phi_HdQ",tag:"Conservation",formula:"d(Mc^2) = T_HdS+\\Omega_HdJ+\\Phi_HdQ",details:"The stunning realization that the geometric equations governing black holes perfectly map onto the classical laws of thermodynamics, linking gravity, quantum mechanics, and heat."}
    ]}
  ]},
  { id: "accretion", title: "15. Accretion Disks & Relativistic Astrophysics", sections: [
    { title: "Disk Physics", items: [
      {type:"formula",name:"Mass Accretion Rate",tex:"\\dot M = 4\\pi r^2\\rho v_r",tag:"Flow",formula:"\\dot M = 4\\pi r^2\\rho v_r",details:"Calculates the total mass per second actively dumping into the black hole, linking gas density and the inward spiral velocity."},
      {type:"formula",name:"Bondi Accretion",tex:"\\dot M \\approx \\frac{\\pi G^2 M^2 \\rho_\\infty}{c_s^3}",tag:"Flow",formula:"\\dot M = ...",details:"Spherical accretion rate for a massive object moving through or stationary within a homogeneous gas cloud."},
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
      {type:"formula",name:"Synchrotron Power",tex:"P_\\mathrm{syn} = \\frac{4}{3} \\sigma_Tc \\gamma^2 \\beta^2 U_B",tag:"Radiation",formula:"P_\\mathrm{syn} = \\frac{4}{3} \\sigma_Tc \\gamma^2 \\beta^2 U_B",details:"The rate at which spiraling electrons bleed away their energy as photons. The more powerful magnetic field and velocity, the faster they burn out."},
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
      {type:"formula",name:"Inspiral Evolution",tex:"\\frac{da}{dt} = -\\frac{64}{5} \\frac{G^3\\mu M^2}{c^5a^3}",tag:"Dynamics",formula:"\\frac{da}{dt} = -\\frac{64}{5} \\frac{G^3\\mu M^2}{c^5a^3}",details:"Calculates the horrifying rate at which the physical distance between two orbiting black holes shrinks as gravity waves bleed away their momentum."},
      {type:"formula",name:"Matched Filtering SNR",tex:"\\rho^2 = 4 \\int_0^\\infty \\frac{|\\tilde{h}(f)|^2}{S_n(f)} df",tag:"Detection",formula:"\\rho^2 = 4 \\int |h(f)|^2 / S_n(f) df",details:"Calculates the Signal-to-Noise Ratio (SNR) by correlating the incoming noisy data with a theoretically generated template wave, weighted inversely by the detector's noise PSD."}
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
      {type:"formula",name:"Slow-Roll Inflation Parameter",tex:"\\epsilon = \\frac{M_{Pl}^2}{2} \\left(\\frac{V'}{V}\\right)^2",tag:"Cosmology",formula:"\\epsilon = M_{Pl}^2/2 (V'/V)^2",details:"Quantifies the flatness of the inflationary potential. Must be << 1 for exponential cosmic inflation to occur in the very early universe."},
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
  { id: "validation", title: "19. Physical Constants, Units & Validation", sections: [
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
  { id: "basic_physics", title: "20. Mechanics & Fundamentals", sections: [
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
  { id: "electromagnetism_optics", title: "21. Electromagnetism & Optics Extension", sections: [
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
  { id: "thermo_modern", title: "22. Thermodynamics & Modern Physics Extension", sections: [
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
  { id: "condensed_matter", title: "23. Solid State & Condensed Matter", sections: [
    { title: "Crystallography & Band Theory", items: [
      {type:"formula",name:"Bragg's Law",tex:"n\\lambda = 2d\\sin\\theta",tag:"Scattering",formula:"n\\lambda = 2d\\sin\\theta",details:"The foundation of X-ray crystallography. It dictates exactly how light waves bounce off atomic crystal lattice planes to produce distinct constructive interference patterns."},
      {type:"formula",name:"Hall Coefficient",tex:"R_H = -\\frac{1}{ne}",tag:"Electromagnetism",formula:"R_H = -\\frac{1}{ne}",details:"A measurement used heavily in semiconductors to map out exactly whether electrical conduction is being handled by negative electrons or positive 'holes'."},
      {type:"formula",name:"Bloch's Theorem",tex:"\\psi_{\\mathbf{k}}(\\mathbf{r}) = e^{i\\mathbf{k}\\cdot\\mathbf{r}} u_{\\mathbf{k}}(\\mathbf{r})",tag:"Quantum",formula:"\\psi_{\\mathbf{k}}(\\mathbf{r}) = e^{i\\mathbf{k}\\cdot\\mathbf{r}} u_{\\mathbf{k}}(\\mathbf{r})",details:"Proves mathematically that quantum electrons can flow completely freely and endlessly through a perfectly arranged, repeating infinite crystal lattice."},
      {type:"formula",name:"London Equation",tex:"\\mathbf{j} = -\\frac{n_s e^2}{m} \\mathbf{A}",tag:"Superconductivity",formula:"\\mathbf{j} = - (n_s e^2 / m) \\mathbf{A}",details:"Relates the superconducting current directly to the electromagnetic vector potential, explaining the Meissner effect (magnetic field expulsion)."},
      {type:"formula",name:"BCS Gap Equation",tex:"\\Delta_\\mathbf{k} = -\\sum_{\\mathbf{k}'} V_{\\mathbf{k}\\mathbf{k}'} \\frac{\\Delta_{\\mathbf{k}'}}{2E_{\\mathbf{k}'}} \\tanh\\left(\\frac{E_{\\mathbf{k}'}}{2k_BT}\\right)",tag:"Superconductivity",formula:"...",details:"The self-consistency equation defining the superconducting energy gap arising from Cooper pair condensation."}
    ]}
  ]},
  { id: "particle_physics", title: "24. Particle Physics & Quantum Field Theory", sections: [
    { title: "Quantum Field Equations", items: [
      {type:"formula",name:"Dirac Equation",tex:"(i\\hbar\\gamma^\\mu\\partial_\\mu - mc)\\psi = 0",tag:"QFT",formula:"(i\\hbar\\gamma^\\mu\\partial_\\mu - mc)\\psi = 0",details:"The stunning equation unifying quantum mechanics and special relativity for electrons. It miraculously predicted antimatter years before it was physically discovered."},
      {type:"formula",name:"Klein-Gordon Equation",tex:"(\\Box + \\mu^2)\\phi = 0",tag:"QFT",formula:"(\\Box + \\mu^2)\\phi = 0",details:"The basic relativistic wave equation representing massive, spin-zero boson particles, like the elusive Higgs boson."},
      {type:"formula",name:"Heisenberg Uncertainty Principle",tex:"\\Delta x \\Delta p \\ge \\frac{\\hbar}{2}",tag:"Quantum",formula:"\\Delta x \\Delta p \\ge \\frac{\\hbar}{2}",details:"The hard limit placed by nature on reality: it is fundamentally, mathematically impossible to know a particle's exact location and exact momentum simultaneously."},
      {type:"formula",name:"De Broglie Wavelength",tex:"\\lambda = \\frac{h}{p}",tag:"Quantum",formula:"\\lambda = \\frac{h}{p}",details:"A staggering insight that blurred the line between matter and light, proving that solid, moving matter like an electron inherently behaves with physical, calculable wave properties."}
    ]}
  ]},
  { id: "adv_qm_qft", title: "25. Advanced Quantum Mechanics & QFT", sections: [
    { title: "Advanced QM", items: [
      {type:"formula",name:"Time-Dependent Schrödinger Equation",tex:"i\\hbar\\frac{\\partial\\Psi}{\\partial t}=\\hat H\\Psi",tag:"Quantum Mechanics",formula:"i\\hbar\\frac{\\partial\\Psi}{\\partial t}=\\hat H\\Psi",details:"The ultimate dynamic engine of non-relativistic quantum mechanics, determining exactly how any quantum wavefunction twists and evolves forward in time."},
      {type:"formula",name:"Probability Current",tex:"\\mathbf j=\\frac{\\hbar}{2mi}(\\Psi^*\\nabla\\Psi-\\Psi\\nabla\\Psi^*)",tag:"Quantum Mechanics",formula:"\\mathbf j=\\frac{\\hbar}{2mi}(\\Psi^*\\nabla\\Psi-\\Psi\\nabla\\Psi^*)",details:"A vector field mapping exactly how the statistical 'fluid' of quantum probability flows from one region of space to another."},
      {type:"formula",name:"Ehrenfest Theorem",tex:"\\frac{d}{dt}\\langle\\mathbf p\\rangle=-\\langle\\nabla V(\\mathbf r)\\rangle",tag:"Quantum Mechanics",formula:"\\frac{d}{dt}\\langle\\mathbf p\\rangle=-\\langle\\nabla V(\\mathbf r)\\rangle",details:"A beautiful bridge proving that on average, quantum expectation values perfectly obey classical Newtonian physics (F=ma)."},
      {type:"formula",name:"Harmonic Oscillator Ladder Operators",tex:"\\hat a=\\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x+\\frac{i}{m\\omega}\\hat p\\right)",tag:"Quantum Mechanics",formula:"\\hat a=\\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x+\\frac{i}{m\\omega}\\hat p\\right)",details:"The 'annihilation' operator. Incredibly elegant algebraic technique to step down down between quantized energy levels of an oscillator."},
      {type:"formula",name:"Pauli Spin Matrices",tex:"\\sigma_x=\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix},\\ \\sigma_y=\\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix},\\ \\sigma_z=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}",tag:"Quantum Mechanics",formula:"\\sigma_x=\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix},\\ \\sigma_y=\\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix},\\ \\sigma_z=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}",details:"The mathematical generators for Spin-1/2 particles, encoding the deeply weird algebra of quantum angular momentum for electrons."},
      {type:"formula",name:"WKB Approximation",tex:"\\int_{x_1}^{x_2}\\sqrt{2m(E-V(x))}\\,dx=\\left(n+\\frac12\\right)\\pi\\hbar",tag:"Quantum Mechanics",formula:"\\int_{x_1}^{x_2}\\sqrt{2m(E-V(x))}\\,dx=\\left(n+\\frac12\\right)\\pi\\hbar",details:"A semiclassical integration method estimating bound state energies when a quantum particle is trapped in a slow-varying macroscopic potential well."}
    ]},
    { title: "Quantum Field Theory", items: [
      {type:"formula",name:"Gamma Matrices (Clifford Algebra)",tex:"\\{\\gamma^\\mu,\\gamma^\\nu\\}=2\\eta^{\\mu\\nu}I_4",tag:"QFT",formula:"\\{\\gamma^\\mu,\\gamma^\\nu\\}=2\\eta^{\\mu\\nu}I_4",details:"The fundamental anticommutation matrix algebra required to make the Dirac equation Lorentz-invariant and relativistically sound."},
      {type:"formula",name:"Noether Current (Scalar Field)",tex:"j^\\mu=i(\\phi^*\\partial^\\mu\\phi-\\phi\\partial^\\mu\\phi^*)",tag:"QFT",formula:"j^\\mu=i(\\phi^*\\partial^\\mu\\phi-\\phi\\partial^\\mu\\phi^*)",details:"Derived from phase symmetry, this defines the exactly conserved total particle current flowing through the quantum field."},
      {type:"formula",name:"Yang-Mills Field Tensor",tex:"F_{\\mu\\nu}^a=\\partial_\\mu A_\\nu^a-\\partial_\\nu A_\\mu^a+gf^{abc}A_\\mu^bA_\\nu^c",tag:"QFT",formula:"F_{\\mu\\nu}^a=\\partial_\\mu A_\\nu^a-\\partial_\\nu A_\\mu^a+gf^{abc}A_\\mu^bA_\\nu^c",details:"The non-abelian generalization of Maxwell's electromagnetism. The extra nonlinear term explains why gluons interact with other gluons in the strong force."},
      {type:"formula",name:"Feynman Propagator (Scalar)",tex:"D_F(x-y)=\\int\\frac{d^4p}{(2\\pi)^4}\\frac{i}{p^2-m^2+i\\epsilon}e^{-ip\\cdot(x-y)}",tag:"QFT",formula:"D_F(x-y)=\\int\\frac{d^4p}{(2\\pi)^4}\\frac{i}{p^2-m^2+i\\epsilon}e^{-ip\\cdot(x-y)}",details:"The mathematical probability amplitude for a virtual particle to spontaneously pop into existence at point X and instantly travel to point Y."},
      {type:"formula",name:"Standard Model Lagrangian (Gauge)",tex:"\\mathcal{L}_{gauge} = -\\frac{1}{4}B_{\\mu\\nu}B^{\\mu\\nu} - \\frac{1}{4}W_{\\mu\\nu}^a W^{a\\mu\\nu} - \\frac{1}{4}G_{\\mu\\nu}^a G^{a\\mu\\nu}",tag:"Standard Model",formula:"\\mathcal{L}_{gauge} = ...",details:"The kinetic energy terms for the fundamental force carriers (photons/W/Z, and gluons) under the SU(3)xSU(2)xU(1) symmetry."}
    ]}
  ]},
  { id: "plasma_nuclear", title: "26. Plasma & Nuclear Physics", sections: [
    { title: "Plasma Physics", items: [
      {type:"formula",name:"Debye Length",tex:"\\lambda_D=\\sqrt{\\frac{\\epsilon_0k_BT_e}{n_ee^2}}",tag:"Plasma Physics",formula:"\\lambda_D=\\sqrt{\\frac{\\epsilon_0k_BT_e}{n_ee^2}}",details:"The critical distance scale over which an ionized plasma can naturally screen out and hide internal electric fields from individual charges."},
      {type:"formula",name:"Plasma Frequency",tex:"\\omega_{pe}=\\sqrt{\\frac{n_ee^2}{m_e\\epsilon_0}}",tag:"Plasma Physics",formula:"\\omega_{pe}=\\sqrt{\\frac{n_ee^2}{m_e\\epsilon_0}}",details:"The incredibly fast natural oscillation frequency of the electron sea inside a plasma, dictating whether radio waves can pass through or get bounced back."},
      {type:"formula",name:"Larmor Radius",tex:"r_L=\\frac{mv_{\\perp}}{|q|B}",tag:"Plasma Physics",formula:"r_L=\\frac{mv_{\\perp}}{|q|B}",details:"Calculates the microscopic radius of the corkscrew gyration pattern traced out by a charged particle caught spinning along a magnetic field line."},
      {type:"formula",name:"E x B Drift Velocity",tex:"\\mathbf v_E=\\frac{\\mathbf E\\times\\mathbf B}{B^2}",tag:"Plasma Physics",formula:"\\mathbf v_E=\\frac{\\mathbf E\\times\\mathbf B}{B^2}",details:"Shows that in crossed electric and magnetic fields, all plasma particles (regardless of mass or charge) drift uniformly sideways perpendicular to both fields."},
      {type:"formula",name:"Alfvén Velocity",tex:"v_A=\\frac{B}{\\sqrt{\\mu_0\\rho}}",tag:"Plasma Physics",formula:"v_A=\\frac{B}{\\sqrt{\\mu_0\\rho}}",details:"The speed at which magnetic tension 'plucks' the plasma fluid, sending magnetohydrodynamic waves rippling along the magnetic field lines like guitar strings."}
    ]},
    { title: "Nuclear & Particle Physics", items: [
      {type:"formula",name:"Semi-Empirical Mass Formula",tex:"E_B=a_vA-a_sA^{2/3}-a_c\\frac{Z(Z-1)}{A^{1/3}}-a_a\\frac{(N-Z)^2}{A}\\pm\\delta",tag:"Nuclear Physics",formula:"E_B=a_vA-a_sA^{2/3}-a_c\\frac{Z(Z-1)}{A^{1/3}}-a_a\\frac{(N-Z)^2}{A}\\pm\\delta",details:"The Liquid-Drop model. An incredibly accurate predictive formula for the binding energy of any atomic nucleus based on volume, surface, and coulomb forces."},
      {type:"formula",name:"Nuclear Magic Numbers",tex:"N, Z \\in \\{2, 8, 20, 28, 50, 82, 126\\}",tag:"Nuclear Shell Model",formula:"N, Z = 2, 8, 20...",details:"Specific numbers of nucleons that result in completely filled nuclear shells, generating remarkably high binding energies and exceptional stability."},
      {type:"formula",name:"Radioactive Decay Activity",tex:"A=\\left|\\frac{dN}{dt}\\right|=\\lambda N",tag:"Nuclear Physics",formula:"A=\\left|\\frac{dN}{dt}\\right|=\\lambda N",details:"Calculates the strict macroscopic radiation activity (measured in Becquerels) emitted by a lump of unstable mass based on its decay constant."},
      {type:"formula",name:"Mandelstam Variables (s)",tex:"s=(p_1+p_2)^2=(p_3+p_4)^2",tag:"Particle Physics",formula:"s=(p_1+p_2)^2=(p_3+p_4)^2",details:"A relativistic kinematic invariant representing the absolute total center-of-mass collision energy squared during a high-energy particle accelerator smash."},
      {type:"formula",name:"Neutrino Oscillation Prob (2-Flavor)",tex:"P(\\nu_\\alpha\\to\\nu_\\beta)=\\sin^2(2\\theta)\\sin^2\\left(\\frac{\\Delta m^2L}{4E}\\right)",tag:"Particle Physics",formula:"P(\\nu_\\alpha\\to\\nu_\\beta)=\\sin^2(2\\theta)\\sin^2\\left(\\frac{\\Delta m^2L}{4E}\\right)",details:"The mind-bending quantum formula proving neutrinos have mass, mapping how they spontaneously shapeshift between flavors while traveling across space."}
    ]}
  ]},
  { id: "constants_reference", title: "27. Constants & Reference", sections: [
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
// 2. MATHEMATICS DATA (MATH_DATA)
// ==========================================================
const MATH_DATA = [
  { id: "numerical", title: "1. Numerical & Applied Mathematics", sections: [
    { title: "Differential Equations & Solvers", items: [
      {type:"formula",name:"First-Order ODE",tex:"\\frac{dy}{dx}=f(x,y)",tag:"Math",formula:"\\frac{dy}{dx}=f(x,y)",details:"The basic structural form of a first-order ordinary differential equation, describing the instantaneous slope of a dynamic variable."},
      {type:"formula",name:"Euler Method",tex:"y_{n+1} = y_n + h f(x_n, y_n)",tag:"Algorithm",formula:"y_{n+1} = y_n + h f(x_n, y_n)",details:"The simplest, crudest numerical method for stepping forward in time on a computer simulation, highly prone to accumulating errors on large steps."},
      {type:"formula",name:"Runge-Kutta 4 (RK4) Step",tex:"y_{n+1} = y_n+\\frac h6(k_1+2k_2+2k_3+k_4)",tag:"Algorithm",formula:"y_{n+1} = y_n+\\frac h6(k_1+2k_2+2k_3+k_4)",details:"The industry-standard workhorse algorithm for simulation. It tests four distinct slopes per time-step to achieve high precision and rock-solid stability."},
      {type:"formula",name:"Central Difference (2nd Derivative)",tex:"f''(x) \\approx \\frac{f(x+h) - 2f(x) + f(x-h)}{h^2}",tag:"Algorithm",formula:"f''(x) \\approx \\frac{f(x+h) - 2f(x) + f(x-h)}{h^2}",details:"A finite difference formula enabling computers to approximate complex second derivatives purely through basic arithmetic on discrete grid points."}
    ]},
    { title: "Simulation Core & Matrices", items: [
      {type:"formula",name:"Ray Integration System",tex:"\\frac{dx^\\mu}{d\\lambda}=k^\\mu \\quad,\\quad \\frac{dk^\\mu}{d\\lambda} = -\\Gamma^\\mu_{\\alpha\\beta} k^\\alpha k^\\beta",tag:"Algorithm",formula:"\\frac{dx^\\mu}{d\\lambda}=k^\\mu \\quad,\\quad \\frac{dk^\\mu}{d\\lambda} = -\\Gamma^\\mu_{\\alpha\\beta} k^\\alpha k^\\beta",details:"The coupled differential system solved millions of times per frame in a black hole raytracer to map how light bends through the Christoffel symbols of curved space."},
      {type:"formula",name:"Courant-Friedrichs-Lewy (CFL) Condition",tex:"C = \\frac{u \\Delta t}{\\Delta x} \\le 1",tag:"Stability",formula:"C = \\frac{u \\Delta t}{\\Delta x} \\le 1",details:"A strict, unbreakable mandate in fluid and wave simulations: the simulated time-step cannot allow information to travel further than one grid cell, or the math blows up."},
      {type:"formula",name:"LU Decomposition",tex:"A = LU",tag:"Linear Algebra",formula:"A = LU",details:"Factors a square matrix into a lower triangular matrix and an upper triangular matrix, vastly speeding up the computational solving of linear equations."},
      {type:"text",content:"Simulation Verification: Every engine step must verify conservation tolerances for $\\Delta E$, $\\Delta L$, and the null condition $k_\\mu k^\\mu = 0$ for photons."}
    ]},
    { title: "Analysis & Statistics", items: [
      {type:"formula",name:"Newton-Raphson Method",tex:"x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}",tag:"Algorithm",formula:"x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}",details:"An immensely powerful iterative algorithm utilizing tangents to rapidly zero in on the exact roots of heavily complex, non-linear algebraic equations."},
      {type:"formula",name:"Chi-Square Statistic",tex:"\\chi^2 = \\sum_{i} \\frac{(O_i - E_i)^2}{\\sigma_i^2}",tag:"Statistics",formula:"\\chi^2 = \\sum_{i} \\frac{(O_i - E_i)^2}{\\sigma_i^2}",details:"The primary statistical tool in cosmology for assessing the goodness-of-fit, determining how well standard models map onto real, noisy telescope data."}
    ]}
  ]},
  { id: "mathematics", title: "2. General Mathematics & Statistics", sections: [
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
  { id: "advanced_math", title: "3. Advanced Mathematics & Transforms", sections: [
    { title: "Transforms & Series", items: [
      {type:"formula",name:"Fourier Transform",tex:"F(k) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi i k x} dx",tag:"Math",formula:"F(k) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi i k x} dx",details:"The magical mathematical tool underlying all modern signal processing. It deconstructs any complex, messy signal wave into a clean map of its constituent pure frequencies."},
      {type:"formula",name:"Inverse Fourier Transform",tex:"f(x) = \\int_{-\\infty}^{\\infty} F(k) e^{2\\pi i k x} dk",tag:"Math",formula:"f(x) = \\int_{-\\infty}^{\\infty} F(k) e^{2\\pi i k x} dk",details:"The perfectly symmetrical reverse operation, flawlessly rebuilding the complex physical wave from its mapped frequency ingredients."},
      {type:"formula",name:"Taylor Series Expansion",tex:"f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x-a)^n",tag:"Math",formula:"f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x-a)^n",details:"Allows mathematicians to take any smooth, horribly complicated function and elegantly rewrite it as a simple, infinite polynomial using derivatives."}
    ]},
    { title: "Complex Analysis & Topology", items: [
      {type:"formula",name:"Cauchy-Riemann Equations",tex:"\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y} \\quad,\\quad \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}",tag:"Complex Analysis",formula:"\\partial u / \\partial x = \\partial v / \\partial y ...",details:"The strict set of partial differential equations that a complex function must satisfy to be holomorphic (differentiable)."},
      {type:"formula",name:"Euler Characteristic",tex:"\\chi = V - E + F",tag:"Topology",formula:"\\chi = V - E + F",details:"A fundamental topological invariant for surfaces. For any convex polyhedron, this purely topological sum of vertices, edges, and faces always equals 2."}
    ]}
  ]},
  { id: "mathematics_extended", title: "4. Mathematics — Extended Reference", sections: [
    { title: "Algebra & Number Theory", items: [
      {type:"formula",name:"Arithmetic-Geometric Mean Inequality",tex:"\\frac{a+b}{2}\\ge\\sqrt{ab}",tag:"Inequality",formula:"\\frac{a+b}{2}\\ge\\sqrt{ab}",details:"A fundamental theorem proving that the standard arithmetic average of non-negative numbers will eternally be greater than or equal to their geometric equivalent."},
      {type:"formula",name:"Cauchy-Schwarz Inequality",tex:"|\\langle x,y\\rangle|^2\\le\\langle x,x\\rangle\\langle y,y\\rangle",tag:"Inequality",formula:"|\\langle x,y\\rangle|^2\\le\\langle x,x\\rangle\\langle y,y\\rangle",details:"A foundational pillar of linear algebra and quantum mechanics, dictating hard absolute bounds on inner products between vectors."},
      {type:"formula",name:"Binomial Theorem",tex:"(x+y)^n=\\sum_{k=0}^n\\binom nk x^{n-k}y^k",tag:"Algebra",formula:"(x+y)^n=\\sum_{k=0}^n\\binom nk x^{n-k}y^k",details:"Provides a fast, algebraic shortcut for perfectly expanding expressions raised to any integer power without having to manually multiply it all out."},
      {type:"formula",name:"Geometric Series",tex:"\\sum_{n=0}^{\\infty}r^n=\\frac1{1-r},\\ |r|<1",tag:"Series",formula:"\\sum_{n=0}^{\\infty}r^n=\\frac1{1-r},\\ |r|<1",details:"A remarkable mathematical proof showing that adding up an infinite string of numbers can resolve down to one clean, finite, specific value."},
      {type:"formula",name:"Arithmetic Series",tex:"\\sum_{k=1}^n k=\\frac{n(n+1)}2",tag:"Series",formula:"\\sum_{k=1}^n k=\\frac{n(n+1)}2",details:"The famous formula, allegedly derived by a young Gauss, to instantly calculate the total sum of all consecutive integers up to N."},
      {type:"formula",name:"Euler Totient Product",tex:"\\varphi(n)=n\\prod_{p\\mid n}(1-1/p)",tag:"Number Theory",formula:"\\varphi(n)=n\\prod_{p\\mid n}(1-1/p)",details:"A heavy-hitting formula in modern digital cryptography. It counts how many integers up to N are perfectly coprime to N."},
      {type:"formula",name:"Euler Identity",tex:"e^{i\\pi}+1=0",tag:"Complex Analysis",formula:"e^{i\\pi}+1=0",details:"Often called the most beautiful equation in math, miraculously connecting the five most fundamental constants of mathematics (0, 1, pi, e, i) into a single expression."}
    ]},
    { title: "Calculus & Analysis", items: [
      {type:"formula",name:"Multivariable Chain Rule",tex:"\\frac{d f}{dt}=\\sum_i\\frac{\\partial f}{\\partial x_i}\\frac{dx_i}{dt}",tag:"Calculus",formula:"\\frac{d f}{dt}=\\sum_i\\frac{\\partial f}{\\partial x_i}\\frac{dx_i}{dt}",details:"Extends standard differentiation protocols to handle complex interconnected variables across three dimensions or higher."},
      {type:"formula",name:"Green Theorem",tex:"\\oint_C(Pdx+Qdy)=\\iint_D(\\partial_xQ-\\partial_yP)dA",tag:"Vector Calculus",formula:"\\oint_C(Pdx+Qdy)=\\iint_D(\\partial_xQ-\\partial_yP)dA",details:"Proves mathematically that calculating the macroscopic swirl around the physical boundary of a region exactly matches summing up the microscopic curl entirely across its interior."},
      {type:"formula",name:"Divergence Theorem",tex:"\\iiint_V\\nabla\\cdot F\\,dV=\\iint_{\\partial V}F\\cdot dA",tag:"Vector Calculus",formula:"\\iiint_V\\nabla\\cdot F\\,dV=\\iint_{\\partial V}F\\cdot dA",details:"Connects internal properties to boundaries by demonstrating that the total outward flux punching through a 3D surface equals the volume integral of internal sources."},
      {type:"formula",name:"Stokes Theorem",tex:"\\oint_{\\partial S}F\\cdot dr=\\iint_S(\\nabla\\times F)\\cdot dS",tag:"Vector Calculus",formula:"\\oint_{\\partial S}F\\cdot dr=\\iint_S(\\nabla\\times F)\\cdot dS",details:"The towering 3D extension of Green's theorem, equating the total twist along a curved rim entirely to the magnetic-like curl flux piercing through its open surface."}
    ]},
    { title: "ODE PDE Transforms", items: [
      {type:"formula",name:"Heat Equation",tex:"\\partial_tu=\\alpha\\nabla^2u",tag:"PDE",formula:"\\partial_tu=\\alpha\\nabla^2u",details:"The foundational diffusion equation dictating exactly how temperature slowly smooths itself out across a material as time ticks forward."},
      {type:"formula",name:"Wave Equation",tex:"\\partial_t^2u=c^2\\nabla^2u",tag:"PDE",formula:"\\partial_t^2u=c^2\\nabla^2u",details:"The quintessential hyperbolic equation mapping how oscillating ripples and vibrations transmit themselves outward at a constant velocity."},
      {type:"formula",name:"Poisson Equation",tex:"\\nabla^2\\phi=f",tag:"PDE",formula:"\\nabla^2\\phi=f",details:"Describes exactly how scalar potentials (like gravitational or electrical fields) adapt and curve in direct response to the massive or charged sources creating them."},
      {type:"formula",name:"Laplace Equation",tex:"\\nabla^2\\phi=0",tag:"PDE",formula:"\\nabla^2\\phi=0",details:"The empty-space variant of Poisson's equation. Solutions dictate the perfectly smooth, source-free flow fields found in steady electromagnetism and fluid dynamics."}
    ]},
    { title: "Probability Statistics", items: [
      {type:"formula",name:"Bayes Theorem",tex:"P(A|B)=\\frac{P(B|A)P(A)}{P(B)}",tag:"Probability",formula:"P(A|B)=\\frac{P(B|A)P(A)}{P(B)}",details:"The mathematical basis of modern machine learning and logic. It calculates how strongly we must update our prior beliefs upon seeing new, surprising evidence."},
      {type:"formula",name:"Expectation",tex:"E[X]=\\sum_xxP(X=x)",tag:"Probability",formula:"E[X]=\\sum_xxP(X=x)",details:"Yields the long-run statistical average of a probabilistic event, heavily used by casinos and insurance companies to guarantee long-term outcomes."},
      {type:"formula",name:"Variance",tex:"Var(X)=E[(X-E[X])^2]",tag:"Statistics",formula:"Var(X)=E[(X-E[X])^2]",details:"Evaluates statistical dispersion by measuring exactly how widely the individual data points are mathematically spread out from the central mean."},
      {type:"formula",name:"Central Limit Theorem",tex:"\\frac{\\bar X_n-\\mu}{\\sigma/\\sqrt n}\\xrightarrow{d}N(0,1)",tag:"Probability",formula:"\\frac{\\bar X_n-\\mu}{\\sigma/\\sqrt n}\\xrightarrow{d}N(0,1)",details:"The miracle of statistics proving that if you take enough random samples of absolutely anything, the resulting averages will inevitably form a perfect bell curve."}
    ]},
    { title: "Differential Geometry & Tensors", items: [
      {type:"formula",name:"Metric",tex:"ds^2=g_{\\mu\\nu}dx^\\mu dx^\\nu",tag:"Geometry",formula:"ds^2=g_{\\mu\\nu}dx^\\mu dx^\\nu",details:"The absolute foundation of relativity. It is a mathematical ruler that dictates exactly how the abstract coordinates of a space translate into real, physical distances."},
      {type:"formula",name:"Covariant Derivative",tex:"\\nabla_\\mu V^\\nu=\\partial_\\mu V^\\nu+\\Gamma^\\nu_{\\mu\\lambda}V^\\lambda",tag:"Tensor Calculus",formula:"\\nabla_\\mu V^\\nu=\\partial_\\mu V^\\nu+\\Gamma^\\nu_{\\mu\\lambda}V^\\lambda",details:"An upgraded version of standard calculus allowing researchers to compute proper rates of change that respect the bending and twisting of curved geometric spaces."},
      {type:"formula",name:"Lie Bracket",tex:"[X,Y]^i=X^j\\partial_jY^i-Y^j\\partial_jX^i",tag:"Differential Geometry",formula:"[X,Y]^i=X^j\\partial_jY^i-Y^j\\partial_jX^i",details:"A tensor operation demonstrating how tracking along one geometric path and then another may yield a fundamentally different result than swapping the order."},
      {type:"formula",name:"Christoffel Symbols (First Kind)",tex:"\\Gamma_{cab} = \\frac{1}{2} \\left( \\frac{\\partial g_{ca}}{\\partial x^b} + \\frac{\\partial g_{cb}}{\\partial x^a} - \\frac{\\partial g_{ab}}{\\partial x^c} \\right)",tag:"Differential Geometry",formula:"...",details:"The metric connection coefficients determining how coordinate bases rotate and scale as one moves through a curved manifold."}
    ]}
  ]},
  { id: "math_core", title: "5. Complete Mathematics Core", sections: [
    { title: "Logarithms", items: [
      {type:"formula",name:"Log Product Rule",tex:"\\log_b(xy)=\\log_b(x)+\\log_b(y)",tag:"Logarithm",formula:"\\log_b(xy)=\\log_b(x)+\\log_b(y)",details:"Converts the multiplication of two terms inside a logarithm into a simple addition of two separate logarithms."},
      {type:"formula",name:"Log Quotient Rule",tex:"\\log_b(x/y)=\\log_b(x)-\\log_b(y)",tag:"Logarithm",formula:"\\log_b(x/y)=\\log_b(x)-\\log_b(y)",details:"Converts the division of two terms inside a logarithm into the subtraction of one logarithm from another."},
      {type:"formula",name:"Log Power Rule",tex:"\\log_b(x^k)=k\\log_b(x)",tag:"Logarithm",formula:"\\log_b(x^k)=k\\log_b(x)",details:"Allows an exponent inside a logarithm to be pulled out entirely and converted into a standard multiplication coefficient."},
      {type:"formula",name:"Log Base Change",tex:"\\log_b(x)=\\frac{\\log_c(x)}{\\log_c(b)}",tag:"Logarithm",formula:"\\log_b(x)=\\frac{\\log_c(x)}{\\log_c(b)}",details:"A critical computational trick for evaluating a logarithm in any arbitrary base by rewriting it using natural (ln) or common (log10) bases."},
      {type:"formula",name:"Antilog (Exponential Inverse)",tex:"x=b^{\\log_b(x)}",tag:"Logarithm",formula:"x=b^{\\log_b(x)}",details:"The direct inverse operation of the logarithm, cleanly neutralizing the log function to extract the inner variable."}
    ]},
    { title: "Trigonometry", items: [
      {type:"formula",name:"Reciprocal Identities",tex:"\\csc\\theta=\\frac1{\\sin\\theta},\\ \\sec\\theta=\\frac1{\\cos\\theta},\\ \\cot\\theta=\\frac1{\\tan\\theta}",tag:"Trigonometry",formula:"\\csc\\theta=\\frac1{\\sin\\theta},\\ \\sec\\theta=\\frac1{\\cos\\theta},\\ \\cot\\theta=\\frac1{\\tan\\theta}",details:"The basic inverse geometric ratios mapping the secondary trigonometric functions back to their primary counterparts."},
      {type:"formula",name:"Double Angle (Sine)",tex:"\\sin(2\\theta)=2\\sin\\theta\\cos\\theta",tag:"Trigonometry",formula:"\\sin(2\\theta)=2\\sin\\theta\\cos\\theta",details:"Expands a doubled-angle sine function into a product, widely used in wave interference and projectile range calculations."},
      {type:"formula",name:"Double Angle (Cosine)",tex:"\\cos(2\\theta)=\\cos^2\\theta-\\sin^2\\theta",tag:"Trigonometry",formula:"\\cos(2\\theta)=\\cos^2\\theta-\\sin^2\\theta",details:"Expands a doubled-angle cosine, heavily applied in integration to linearize squared trigonometric terms."},
      {type:"formula",name:"Half Angle (Sine)",tex:"\\sin(\\theta/2)=\\pm\\sqrt{\\frac{1-\\cos\\theta}2}",tag:"Trigonometry",formula:"\\sin(\\theta/2)=\\pm\\sqrt{\\frac{1-\\cos\\theta}2}",details:"Evaluates half-angles, mathematically derived directly from rearranging the cosine double-angle formula."},
      {type:"formula",name:"Half Angle (Cosine)",tex:"\\cos(\\theta/2)=\\pm\\sqrt{\\frac{1+\\cos\\theta}2}",tag:"Trigonometry",formula:"\\cos(\\theta/2)=\\pm\\sqrt{\\frac{1+\\cos\\theta}2}",details:"The counterpart half-angle formula for cosine, tracking positive or negative based on the specific geometric quadrant."},
      {type:"formula",name:"Sum to Product (Sine)",tex:"\\sin A+\\sin B=2\\sin\\left(\\frac{A+B}2\\right)\\cos\\left(\\frac{A-B}2\\right)",tag:"Trigonometry",formula:"\\sin A+\\sin B=2\\sin\\left(\\frac{A+B}2\\right)\\cos\\left(\\frac{A-B}2\\right)",details:"The mechanical basis for calculating acoustic 'beats' and wave superposition by turning additive frequencies into an enveloped product."},
      {type:"formula",name:"Law of Sines",tex:"\\frac{a}{\\sin A}=\\frac{b}{\\sin B}=\\frac{c}{\\sin C}",tag:"Trigonometry",formula:"\\frac{a}{\\sin A}=\\frac{b}{\\sin B}=\\frac{c}{\\sin C}",details:"A universal relation valid for literally any triangle, instantly solving missing sides or angles when opposing pairs are known."},
      {type:"formula",name:"Law of Cosines",tex:"c^2=a^2+b^2-2ab\\cos C",tag:"Trigonometry",formula:"c^2=a^2+b^2-2ab\\cos C",details:"The generalized Pythagorean theorem for non-right triangles, factoring in the angle opposing the unknown side length."}
    ]},
    { title: "Differentiation Rules", items: [
      {type:"formula",name:"Power Rule",tex:"\\frac{d}{dx}(x^n)=nx^{n-1}",tag:"Calculus",formula:"\\frac{d}{dx}(x^n)=nx^{n-1}",details:"The most common derivative rule in all of calculus, lowering the algebraic polynomial power exactly by one."},
      {type:"formula",name:"Trig Derivative (Sine)",tex:"\\frac{d}{dx}(\\sin x)=\\cos x",tag:"Calculus",formula:"\\frac{d}{dx}(\\sin x)=\\cos x",details:"Shows that the slope of a sine wave naturally traces out a perfectly matched, phase-shifted cosine wave."},
      {type:"formula",name:"Trig Derivative (Cosine)",tex:"\\frac{d}{dx}(\\cos x)=-\\sin x",tag:"Calculus",formula:"\\frac{d}{dx}(\\cos x)=-\\sin x",details:"The derivative of cosine, carrying a critical negative sign that fundamentally drives harmonic oscillation math."},
      {type:"formula",name:"Trig Derivative (Tangent)",tex:"\\frac{d}{dx}(\\tan x)=\\sec^2 x",tag:"Calculus",formula:"\\frac{d}{dx}(\\tan x)=\\sec^2 x",details:"The surprisingly steep squared derivative of the tangent curve."},
      {type:"formula",name:"Exponential Derivative",tex:"\\frac{d}{dx}(e^x)=e^x",tag:"Calculus",formula:"\\frac{d}{dx}(e^x)=e^x",details:"The unique, defining property of 'e': the natural exponential function's instantaneous slope is always exactly equal to its current value."},
      {type:"formula",name:"Logarithmic Derivative",tex:"\\frac{d}{dx}(\\ln x)=\\frac1x",tag:"Calculus",formula:"\\frac{d}{dx}(\\ln x)=\\frac1x",details:"The derivative of the natural logarithm, linking exponential growth decay models down to an inversely proportional fraction."},
      {type:"formula",name:"Inverse Sine Derivative",tex:"\\frac{d}{dx}(\\arcsin x)=\\frac1{\\sqrt{1-x^2}}",tag:"Calculus",formula:"\\frac{d}{dx}(\\arcsin x)=\\frac1{\\sqrt{1-x^2}}",details:"The specialized algebraic derivative for the inverse sine function, highly useful for specific geometric integrals."}
    ]},
    { title: "Integration Rules", items: [
      {type:"formula",name:"Integral Power Rule",tex:"\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+C\\quad(n\\neq-1)",tag:"Calculus",formula:"\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+C\\quad(n\\neq-1)",details:"The fundamental reverse-power rule, generating the accumulated area under a polynomial curve by bumping the exponent up by one."},
      {type:"formula",name:"Integral of 1/x",tex:"\\int\\frac1x\\,dx=\\ln|x|+C",tag:"Calculus",formula:"\\int\\frac1x\\,dx=\\ln|x|+C",details:"The special case failure of the power rule, correctly mapping a hyperbolic 1/x curve into a natural logarithmic area function."},
      {type:"formula",name:"Integral of Exponential",tex:"\\int e^x\\,dx=e^x+C",tag:"Calculus",formula:"\\int e^x\\,dx=e^x+C",details:"Because its derivative is itself, the integral of the natural exponential beautifully remains completely unchanged."},
      {type:"formula",name:"Integral of Sine",tex:"\\int\\sin x\\,dx=-\\cos x+C",tag:"Calculus",formula:"\\int\\sin x\\,dx=-\\cos x+C",details:"The antiderivative of the sine wave. Notice the required negative sign to balance the standard cosine derivative."},
      {type:"formula",name:"Integral of Cosine",tex:"\\int\\cos x\\,dx=\\sin x+C",tag:"Calculus",formula:"\\int\\cos x\\,dx=\\sin x+C",details:"The perfectly clean antiderivative of a cosine wave tracing back to a sine wave."},
      {type:"formula",name:"Integration by Substitution (U-Sub)",tex:"\\int f(g(x))g'(x)\\,dx=\\int f(u)\\,du",tag:"Calculus",formula:"\\int f(g(x))g'(x)\\,dx=\\int f(u)\\,du",details:"The integral equivalent of the chain rule, allowing complex nested functions to be solved by redefining inner terms as 'u'."}
    ]},
    { title: "Descriptive Statistics", items: [
      {type:"formula",name:"Median (Continuous Series)",tex:"M=L+\\left(\\frac{N/2-CF}{f}\\right)\\times h",tag:"Statistics",formula:"M=L+\\left(\\frac{N/2-CF}{f}\\right)\\times h",details:"Finds the exact 50th percentile middle value inside a grouped frequency distribution, completely immune to extreme numerical outliers."},
      {type:"formula",name:"Mode (Continuous Series)",tex:"Z=L+\\left(\\frac{f_1-f_0}{2f_1-f_0-f_2}\\right)\\times h",tag:"Statistics",formula:"Z=L+\\left(\\frac{f_1-f_0}{2f_1-f_0-f_2}\\right)\\times h",details:"Calculates the highest-density absolute peak of a grouped frequency dataset, mathematically finding the most common occurrence."}
    ]}
  ]},
  { id: "expansion_arithmetic_algebra", title: "6. Arithmetic, Algebra & Indices", sections: [
    { title: "Number Systems & Basic Arithmetic", items: [
      {type:"formula",name:"Number Sets",tex:"\\mathbb N,\\mathbb Z,\\mathbb Q,\\mathbb R,\\mathbb C",tag:"Arithmetic",formula:"\\mathbb N,\\mathbb Z,\\mathbb Q,\\mathbb R,\\mathbb C",details:"Standard mathematical sets: Naturals, Integers, Rationals, Reals, and Complex Numbers."},
      {type:"formula",name:"Fractions",tex:"\\frac ab+\\frac cd=\\frac{ad+bc}{bd}",tag:"Arithmetic",formula:"\\frac ab+\\frac cd=\\frac{ad+bc}{bd}",details:"General rule for adding fractions by finding a common denominator."},
      {type:"formula",name:"Percentage Change",tex:"\\%\\text{ change}=\\frac{\\text{new-old}}{\\text{old}}\\times100",tag:"Arithmetic",formula:"\\%\\text{ change}=\\frac{\\text{new-old}}{\\text{old}}\\times100",details:"Calculates the relative difference scaled to a percentage."},
      {type:"formula",name:"Absolute Value",tex:"|x|=\\begin{cases}x,&x\\ge0\\\\-x,&x<0\\end{cases}",tag:"Arithmetic",formula:"|x|=\\begin{cases}x,&x\\ge0\\\\-x,&x<0\\end{cases}",details:"The piecewise definition of absolute magnitude."},
      {type:"formula",name:"GCD / LCM",tex:"\\gcd(a,b)\\operatorname{lcm}(a,b)=|ab|",tag:"Arithmetic",formula:"\\gcd(a,b)\\operatorname{lcm}(a,b)=|ab|",details:"The fundamental relation connecting the greatest common divisor and least common multiple."}
    ]},
    { title: "Algebraic Identities & Equations", items: [
      {type:"formula",name:"Binomial Squares",tex:"(a\\pm b)^2=a^2\\pm 2ab+b^2",tag:"Algebra",formula:"(a\\pm b)^2=a^2\\pm 2ab+b^2",details:"Expansion of perfect squares."},
      {type:"formula",name:"Difference of Squares",tex:"a^2-b^2=(a-b)(a+b)",tag:"Algebra",formula:"a^2-b^2=(a-b)(a+b)",details:"Factorization of the difference of two squares."},
      {type:"formula",name:"Binomial Cubes",tex:"(a+b)^3=a^3+3a^2b+3ab^2+b^3",tag:"Algebra",formula:"(a+b)^3=a^3+3a^2b+3ab^2+b^3",details:"Expansion of a cubic binomial."},
      {type:"formula",name:"Sum/Difference of Cubes",tex:"a^3\\pm b^3=(a\\pm b)(a^2\\mp ab+b^2)",tag:"Algebra",formula:"a^3\\pm b^3=(a\\pm b)(a^2\\mp ab+b^2)",details:"Factorization of cubic sums and differences."},
      {type:"formula",name:"Quadratic Discriminant",tex:"D=b^2-4ac",tag:"Algebra",formula:"D=b^2-4ac",details:"Evaluates the nature (real/complex, distinct/repeated) of quadratic roots."},
      {type:"formula",name:"Vieta's Formulas",tex:"x_1+x_2=-\\frac ba, \\quad x_1x_2=\\frac ca",tag:"Algebra",formula:"x_1+x_2=-\\frac ba, \\quad x_1x_2=\\frac ca",details:"Relations between the roots of a quadratic and its coefficients."}
    ]},
    { title: "Indices & Combinatorics", items: [
      {type:"formula",name:"Index Laws",tex:"a^ma^n=a^{m+n}, \\quad \\frac{a^m}{a^n}=a^{m-n}, \\quad (a^m)^n=a^{mn}",tag:"Algebra",formula:"a^ma^n=a^{m+n}, \\quad \\frac{a^m}{a^n}=a^{m-n}, \\quad (a^m)^n=a^{mn}",details:"Rules for multiplying, dividing, and exponentiating terms with common bases."},
      {type:"formula",name:"Negative & Fractional Powers",tex:"a^{-n}=\\frac1{a^n}, \\quad a^{1/n}=\\sqrt[n]{a}",tag:"Algebra",formula:"a^{-n}=\\frac1{a^n}, \\quad a^{1/n}=\\sqrt[n]{a}",details:"Conversions for inverse exponents and roots."},
      {type:"formula",name:"Permutations",tex:"{}^nP_r=\\frac{n!}{(n-r)!}",tag:"Combinatorics",formula:"{}^nP_r=\\frac{n!}{(n-r)!}",details:"Arrangements of r items chosen from n."},
      {type:"formula",name:"Combinations",tex:"{}^nC_r=\\frac{n!}{r!(n-r)!}",tag:"Combinatorics",formula:"{}^nC_r=\\frac{n!}{r!(n-r)!}",details:"Selections of r items chosen from n, order irrelevant."},
      {type:"formula",name:"Generalized Binomial Theorem",tex:"(1+x)^\\alpha=\\sum_{k=0}^{\\infty}{\\alpha\\choose k}x^k",tag:"Algebra",formula:"(1+x)^\\alpha=\\sum_{k=0}^{\\infty}{\\alpha\\choose k}x^k",details:"Infinite series expansion for non-integer powers."}
    ]},
    { title: "Sequences & Series Extensions", items: [
      {type:"formula",name:"Arithmetic Progression",tex:"a_n=a+(n-1)d, \\quad S_n=\\frac n2[2a+(n-1)d]",tag:"Series",formula:"a_n=a+(n-1)d, \\quad S_n=\\frac n2[2a+(n-1)d]",details:"Formulas for the nth term and total sum of an arithmetic sequence."},
      {type:"formula",name:"Geometric Progression",tex:"a_n=ar^{n-1}, \\quad S_n=a\\frac{1-r^n}{1-r}",tag:"Series",formula:"a_n=ar^{n-1}, \\quad S_n=a\\frac{1-r^n}{1-r}",details:"Formulas for the nth term and finite sum of a geometric sequence."},
      {type:"formula",name:"Sum of First n Integers",tex:"\\sum_{k=1}^nk=\\frac{n(n+1)}2",tag:"Series",formula:"\\sum_{k=1}^nk=\\frac{n(n+1)}2",details:"Closed-form sum of standard linear counting numbers."},
      {type:"formula",name:"Sum of Squares",tex:"\\sum_{k=1}^nk^2=\\frac{n(n+1)(2n+1)}6",tag:"Series",formula:"\\sum_{k=1}^nk^2=\\frac{n(n+1)(2n+1)}6",details:"Closed-form sum of integer squares."},
      {type:"formula",name:"Sum of Cubes",tex:"\\sum_{k=1}^nk^3=\\left[\\frac{n(n+1)}2\\right]^2",tag:"Series",formula:"\\sum_{k=1}^nk^3=\\left[\\frac{n(n+1)}2\\right]^2",details:"Closed-form sum of integer cubes."}
    ]}
  ]},
  { id: "expansion_geometry_trig", title: "7. Geometry, Sets & Trig Extensions", sections: [
    { title: "Complex Numbers & Set Theory", items: [
      {type:"formula",name:"Complex Modulus",tex:"|z|=\\sqrt{a^2+b^2}",tag:"Complex Numbers",formula:"|z|=\\sqrt{a^2+b^2}",details:"Magnitude of a complex number."},
      {type:"formula",name:"Complex Logarithm",tex:"\\log z=\\ln|z|+i(\\arg z+2\\pi k)",tag:"Complex Numbers",formula:"\\log z=\\ln|z|+i(\\arg z+2\\pi k)",details:"The multi-valued natural logarithm in the complex plane."},
      {type:"formula",name:"Roots of Unity",tex:"z_k=r^{1/n}e^{i(\\theta+2\\pi k)/n}",tag:"Complex Numbers",formula:"z_k=r^{1/n}e^{i(\\theta+2\\pi k)/n}",details:"Finds the distinct nth roots."},
      {type:"formula",name:"De Morgan's Laws",tex:"(A\\cup B)^c=A^c\\cap B^c, \\quad (A\\cap B)^c=A^c\\cup B^c",tag:"Set Theory",formula:"(A\\cup B)^c=A^c\\cap B^c, \\quad (A\\cap B)^c=A^c\\cup B^c",details:"The relationship between union, intersection, and set complements."},
      {type:"formula",name:"Inclusion-Exclusion Principle",tex:"|A\\cup B|=|A|+|B|-|A\\cap B|",tag:"Set Theory",formula:"|A\\cup B|=|A|+|B|-|A\\cap B|",details:"Calculates the cardinality of set unions."}
    ]},
    { title: "Advanced Trigonometry", items: [
      {type:"formula",name:"Triple Angle (Sine & Cosine)",tex:"\\sin3x=3\\sin x-4\\sin^3x, \\quad \\cos3x=4\\cos^3x-3\\cos x",tag:"Trigonometry",formula:"\\sin3x=3\\sin x-4\\sin^3x, \\quad \\cos3x=4\\cos^3x-3\\cos x",details:"Expresses triple angles entirely in terms of single angle trigonometric functions."},
      {type:"formula",name:"Inverse Trig Addition (Sine/Cos)",tex:"\\sin^{-1}x+\\cos^{-1}x=\\frac\\pi2",tag:"Trigonometry",formula:"\\sin^{-1}x+\\cos^{-1}x=\\frac\\pi2",details:"Complementary relationship for inverse sine and cosine."},
      {type:"formula",name:"Inverse Trig Addition (Tan/Cot)",tex:"\\tan^{-1}x+\\cot^{-1}x=\\frac\\pi2",tag:"Trigonometry",formula:"\\tan^{-1}x+\\cot^{-1}x=\\frac\\pi2",details:"Complementary relationship for inverse tangent and cotangent."}
    ]},
    { title: "2D & 3D Geometry", items: [
      {type:"formula",name:"Distance Formula (2D/3D)",tex:"d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}",tag:"Geometry",formula:"d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}",details:"Calculates Euclidean distance across two or three dimensions."},
      {type:"formula",name:"Line Equation (Point-Slope)",tex:"y-y_1=m(x-x_1)",tag:"Geometry",formula:"y-y_1=m(x-x_1)",details:"Equation of a line given one point and the slope."},
      {type:"formula",name:"Distance Point to Line",tex:"d=\\frac{|Ax_0+By_0+C|}{\\sqrt{A^2+B^2}}",tag:"Geometry",formula:"d=\\frac{|Ax_0+By_0+C|}{\\sqrt{A^2+B^2}}",details:"Calculates the shortest orthogonal distance from a point to a line."},
      {type:"formula",name:"Circle Equation",tex:"(x-h)^2+(y-k)^2=r^2",tag:"Geometry",formula:"(x-h)^2+(y-k)^2=r^2",details:"Standard Cartesian equation for a circle centered at (h,k)."},
      {type:"formula",name:"Ellipse Equation",tex:"\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1",tag:"Geometry",formula:"\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1",details:"Standard Cartesian equation for an ellipse."},
      {type:"formula",name:"Hyperbola Equation",tex:"\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1",tag:"Geometry",formula:"\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1",details:"Standard Cartesian equation for a hyperbola."},
      {type:"formula",name:"3D Plane Equation",tex:"ax+by+cz=d",tag:"Geometry",formula:"ax+by+cz=d",details:"Standard equation for a plane in three-dimensional space."},
      {type:"formula",name:"Direction Cosines",tex:"l^2+m^2+n^2=1",tag:"Geometry",formula:"l^2+m^2+n^2=1",details:"Identity for the directional cosines of a 3D vector."}
    ]}
  ]},
  { id: "expansion_linear_algebra_calculus", title: "8. Linear Algebra & Advanced Calculus", sections: [
    { title: "Linear Algebra & Matrices", items: [
      {type:"formula",name:"Matrix Multiplication",tex:"(AB)_{ij}=\\sum_kA_{ik}B_{kj}",tag:"Linear Algebra",formula:"(AB)_{ij}=\\sum_kA_{ik}B_{kj}",details:"Definition of the product of two matrices."},
      {type:"formula",name:"Determinant 2x2",tex:"\\det A=ad-bc",tag:"Linear Algebra",formula:"\\det A=ad-bc",details:"Calculates the determinant of a 2x2 matrix."},
      {type:"formula",name:"Matrix Inverse",tex:"A^{-1}=\\frac{\\operatorname{adj}A}{\\det A}",tag:"Linear Algebra",formula:"A^{-1}=\\frac{\\operatorname{adj}A}{\\det A}",details:"General formula for the inverse of an invertible matrix using the adjugate."},
      {type:"formula",name:"Eigenvalue Equation",tex:"A\\mathbf v=\\lambda\\mathbf v, \\quad \\det(A-\\lambda I)=0",tag:"Linear Algebra",formula:"A\\mathbf v=\\lambda\\mathbf v, \\det(A-\\lambda I)=0",details:"Defines eigenvectors/eigenvalues and the characteristic equation."},
      {type:"formula",name:"Gram-Schmidt Orthogonalization",tex:"u_k=v_k-\\sum_{j<k}\\operatorname{proj}_{u_j}v_k",tag:"Linear Algebra",formula:"u_k=v_k-\\sum_{j<k}\\operatorname{proj}_{u_j}v_k",details:"Algorithm to construct an orthogonal basis from an arbitrary basis."},
      {type:"formula",name:"Vector Projection",tex:"\\operatorname{proj}_u v=\\frac{\\langle v,u\\rangle}{\\langle u,u\\rangle}u",tag:"Linear Algebra",formula:"\\operatorname{proj}_u v=\\frac{\\langle v,u\\rangle}{\\langle u,u\\rangle}u",details:"Projects vector v onto vector u."},
      {type:"formula",name:"Rank-Nullity Theorem",tex:"\\dim V=\\operatorname{rank}(T)+\\operatorname{nullity}(T)",tag:"Linear Algebra",formula:"\\dim V=\\operatorname{rank}(T)+\\operatorname{nullity}(T)",details:"A fundamental theorem relating the dimensions of the kernel and image of a linear map."},
      {type:"text",content:"Advanced Linear Algebra Topics: basis, dimension, span, linear independence, subspaces, quotient spaces, linear transformations, kernel, image, row reduction, LU/QR/Cholesky/SVD decompositions, diagonalization, Jordan form, matrix exponential."}
    ]},
    { title: "Calculus Extensions", items: [
      {type:"formula",name:"Total Derivative",tex:"df=\\sum_i\\frac{\\partial f}{\\partial x_i}dx_i",tag:"Calculus",formula:"df=\\sum_i\\frac{\\partial f}{\\partial x_i}dx_i",details:"Represents the complete differential change in a multivariable function."},
      {type:"formula",name:"Jacobian Matrix",tex:"J=\\det\\left[\\frac{\\partial y_i}{\\partial x_j}\\right]",tag:"Calculus",formula:"J=\\det\\left[\\frac{\\partial y_i}{\\partial x_j}\\right]",details:"The determinant of the matrix of all first-order partial derivatives, critical for multivariable integration substitutions."},
      {type:"formula",name:"Hessian Matrix",tex:"H_{ij}=\\frac{\\partial^2f}{\\partial x_i\\partial x_j}",tag:"Calculus",formula:"H_{ij}=\\frac{\\partial^2f}{\\partial x_i\\partial x_j}",details:"The square matrix of second-order partial derivatives, used in multivariable optimization."},
      {type:"formula",name:"Multivariable Taylor Series",tex:"f(\\mathbf x)\\approx f(\\mathbf x_0)+\\nabla f\\cdot\\Delta\\mathbf x+\\frac12\\Delta\\mathbf x^TH\\Delta\\mathbf x",tag:"Calculus",formula:"f(\\mathbf x)\\approx f(\\mathbf x_0)+\\nabla f\\cdot\\Delta\\mathbf x+\\frac12\\Delta\\mathbf x^TH\\Delta\\mathbf x",details:"Approximates a multivariable function near a point using gradients and the Hessian."},
      {type:"formula",name:"Mean Value Theorem",tex:"f'(c)=\\frac{f(b)-f(a)}{b-a}",tag:"Calculus",formula:"f'(c)=\\frac{f(b)-f(a)}{b-a}",details:"Guarantees a point where the instantaneous rate of change matches the average rate of change."}
    ]},
    { title: "ODE & PDE Extensions", items: [
      {type:"formula",name:"Separable ODE",tex:"\\frac{dy}{dx}=f(x)g(y)",tag:"Differential Equations",formula:"\\frac{dy}{dx}=f(x)g(y)",details:"First-order equations that can be solved by grouping variables on opposite sides of the equality."},
      {type:"formula",name:"Bernoulli ODE",tex:"y'+Py=Qy^n",tag:"Differential Equations",formula:"y'+Py=Qy^n",details:"A nonlinear differential equation reducible to a linear one by substitution."},
      {type:"formula",name:"Exact ODE",tex:"Mdx+Ndy=0 \\quad \\left(\\frac{\\partial M}{\\partial y}=\\frac{\\partial N}{\\partial x}\\right)",tag:"Differential Equations",formula:"Mdx+Ndy=0 \\quad \\left(\\frac{\\partial M}{\\partial y}=\\frac{\\partial N}{\\partial x}\\right)",details:"Condition for a differential equation to be exactly integrable as a total derivative."},
      {type:"formula",name:"Characteristic Equation (2nd Order)",tex:"ar^2+br+c=0",tag:"Differential Equations",formula:"ar^2+br+c=0",details:"Algebraic equation determining the basis solutions for linear homogeneous ODEs with constant coefficients."}
    ]}
  ]},
  { id: "expansion_abstract_applied", title: "9. Abstract Algebra, Analysis & Applied Math", sections: [
    { title: "Abstract Algebra & Number Theory", items: [
      {type:"formula",name:"Group Axioms",tex:"(ab)c=a(bc), \\quad ae=ea=a, \\quad aa^{-1}=a^{-1}a=e",tag:"Abstract Algebra",formula:"(ab)c=a(bc), ae=ea=a, aa^{-1}=a^{-1}a=e",details:"The fundamental requirements (associativity, identity, inverse) defining a mathematical group."},
      {type:"formula",name:"Euler's Theorem",tex:"a^{\\phi(n)}\\equiv1\\pmod n",tag:"Number Theory",formula:"a^{\\phi(n)}\\equiv1\\pmod n",details:"Generalization of Fermat's Little Theorem using the totient function."},
      {type:"formula",name:"Fermat's Little Theorem",tex:"a^{p-1}\\equiv1\\pmod p",tag:"Number Theory",formula:"a^{p-1}\\equiv1\\pmod p",details:"A foundational theorem in modular arithmetic for prime moduli."},
      {type:"formula",name:"Riemann Zeta Function",tex:"\\zeta(s)=\\sum_{n=1}^{\\infty}\\frac1{n^s}",tag:"Number Theory",formula:"\\zeta(s)=\\sum_{n=1}^{\\infty}\\frac1{n^s}",details:"The central function in analytic number theory, intrinsically tied to the distribution of primes."},
      {type:"text",content:"Advanced Topics: rings, ideals, fields, Galois theory, Diophantine equations, congruences, modules, categories, functors, natural transformations."}
    ]},
    { title: "Complex Analysis & Transforms", items: [
      {type:"formula",name:"Cauchy Integral Theorem",tex:"\\oint_Cf(z)\\,dz=0",tag:"Complex Analysis",formula:"\\oint_Cf(z)\\,dz=0",details:"Proves the contour integral of a holomorphic function over a closed loop is zero."},
      {type:"formula",name:"Cauchy Integral Formula",tex:"f(a)=\\frac1{2\\pi i}\\oint_C\\frac{f(z)}{z-a}dz",tag:"Complex Analysis",formula:"f(a)=\\frac1{2\\pi i}\\oint_C\\frac{f(z)}{z-a}dz",details:"Expresses the value of a holomorphic function strictly based on values on the boundary."},
      {type:"formula",name:"Residue Theorem",tex:"\\oint_Cf(z)dz=2\\pi i\\sum\\operatorname{Res}(f,z_k)",tag:"Complex Analysis",formula:"\\oint_Cf(z)dz=2\\pi i\\sum\\operatorname{Res}(f,z_k)",details:"A powerful tool to evaluate complex contour integrals by summing the enclosed singularities."},
      {type:"formula",name:"Z-Transform",tex:"X(z)=\\sum_{n=-\\infty}^{\\infty}x[n]z^{-n}",tag:"Transforms",formula:"X(z)=\\sum_{n=-\\infty}^{\\infty}x[n]z^{-n}",details:"The discrete-time equivalent of the Laplace transform, vital for digital signal processing."}
    ]},
    { title: "Statistics, ML & Optimization", items: [
      {type:"formula",name:"Covariance",tex:"Cov(X,Y)=E[(X-E[X])(Y-E[Y])]",tag:"Statistics",formula:"Cov(X,Y)=E[(X-E[X])(Y-E[Y])]",details:"Measures the joint variability of two random variables."},
      {type:"formula",name:"Correlation",tex:"\\rho=\\frac{Cov(X,Y)}{\\sigma_X\\sigma_Y}",tag:"Statistics",formula:"\\rho=\\frac{Cov(X,Y)}{\\sigma_X\\sigma_Y}",details:"Normalized covariance bounded between -1 and 1."},
      {type:"formula",name:"Poisson Distribution",tex:"P(X=k)=\\frac{\\lambda^ke^{-\\lambda}}{k!}",tag:"Probability",formula:"P(X=k)=\\frac{\\lambda^ke^{-\\lambda}}{k!}",details:"Models the probability of a given number of events occurring in a fixed interval."},
      {type:"formula",name:"Likelihood Function",tex:"L(\\theta|x)=\\prod_i f(x_i|\\theta)",tag:"Statistics",formula:"L(\\theta|x)=\\prod_i f(x_i|\\theta)",details:"The joint probability of the observed data, viewed as a function of the parameters."},
      {type:"formula",name:"Linear Regression (OLS)",tex:"\\hat\\beta=(X^TX)^{-1}X^Ty",tag:"Machine Learning",formula:"\\hat\\beta=(X^TX)^{-1}X^Ty",details:"The closed-form ordinary least squares solution for linear regression."},
      {type:"formula",name:"Logistic Function",tex:"P(y=1|x)=\\frac1{1+e^{-x^T\\beta}}",tag:"Machine Learning",formula:"P(y=1|x)=\\frac1{1+e^{-x^T\\beta}}",details:"Maps regression outputs to a (0,1) probability for binary classification."},
      {type:"formula",name:"Gradient Descent",tex:"\\theta_{t+1}=\\theta_t-\\eta\\nabla J(\\theta_t)",tag:"Optimization",formula:"\\theta_{t+1}=\\theta_t-\\eta\\nabla J(\\theta_t)",details:"Iterative first-order optimization algorithm for finding a local minimum."},
      {type:"formula",name:"Cross Entropy Loss",tex:"L=-\\sum_i y_i\\log\\hat y_i",tag:"Machine Learning",formula:"L=-\\sum_i y_i\\log\\hat y_i",details:"Standard loss function measuring the difference between two probability distributions."}
    ]},
    { title: "Applied Math: Dynamics, Finance & Info Theory", items: [
      {type:"formula",name:"Shannon Entropy",tex:"H(X)=-\\sum_xp(x)\\log p(x)",tag:"Information Theory",formula:"H(X)=-\\sum_xp(x)\\log p(x)",details:"Measures the expected uncertainty or information content of a random variable."},
      {type:"formula",name:"KL Divergence",tex:"D_{KL}(P||Q)=\\sum_xP(x)\\log\\frac{P(x)}{Q(x)}",tag:"Information Theory",formula:"D_{KL}(P||Q)=\\sum_xP(x)\\log\\frac{P(x)}{Q(x)}",details:"Measures how one probability distribution diverges from a second, expected probability distribution."},
      {type:"formula",name:"Black-Scholes PDE",tex:"\\frac{\\partial V}{\\partial t}+\\frac12\\sigma^2S^2\\frac{\\partial^2V}{\\partial S^2}+rS\\frac{\\partial V}{\\partial S}-rV=0",tag:"Mathematical Finance",formula:"\\frac{\\partial V}{\\partial t}+\\frac12\\sigma^2S^2\\frac{\\partial^2V}{\\partial S^2}+rS\\frac{\\partial V}{\\partial S}-rV=0",details:"The governing partial differential equation for options pricing in quantitative finance."},
      {type:"formula",name:"Geometric Brownian Motion",tex:"dS=\\mu Sdt+\\sigma SdW",tag:"Stochastic Processes",formula:"dS=\\mu Sdt+\\sigma SdW",details:"Stochastic differential equation modeling asset prices under continuous time."},
      {type:"formula",name:"Logistic Map (Chaos)",tex:"x_{n+1}=rx_n(1-x_n)",tag:"Dynamical Systems",formula:"x_{n+1}=rx_n(1-x_n)",details:"A classic polynomial mapping exhibiting complex chaotic behavior from simple nonlinear equations."},
      {type:"formula",name:"Lyapunov Exponent",tex:"\\lambda=\\lim_{t\\to\\infty}\\frac1t\\ln\\frac{|\\delta x(t)|}{|\\delta x(0)|}",tag:"Dynamical Systems",formula:"\\lambda=\\lim_{t\\to\\infty}\\frac1t\\ln\\frac{|\\delta x(t)|}{|\\delta x(0)|}",details:"Quantifies the average rate of separation of infinitesimally close trajectories, characterizing chaos."}
    ]}
  ]}
];
// ==========================================================
// 3. CHEMISTRY DATA (CHEM_DATA)
// ==========================================================
const CHEM_DATA = [
  { 
    id: "chemistry", 
    title: "1. Chemistry Fundamentals", 
    sections: [
      { 
        title: "Physical Chemistry", 
        items: [
          {
            type:"formula",name:"Mole Concept",tex:"n = \\frac{m}{M} = \\frac{N}{N_A} = \\frac{V}{22.4L}",tag:"General",formula:"n = \\frac{m}{M} = \\frac{N}{N_A} = \\frac{V}{22.4L}",details:"The foundational chemistry conversion linking macroscopic grams and liters directly to the microscopic number of individual atoms via Avogadro's number."
          },
          {
            type:"formula",name:"Extended Mole Calculations",tex:"N=nN_A, \\quad M=\\frac{m}{n}, \\quad n=\\frac{V}{V_m}",tag:"Basic Math",formula:"N=nN_A, \\quad M=\\frac{m}{n}, \\quad n=\\frac{V}{V_m}",details:"Conversions for particle counts, molar masses, and generic molar volumes at standard conditions."
          },
          {
            type:"formula",name:"Percentage Composition",tex:"\\%\\text{element} = \\frac{\\text{mass of element}}{\\text{molar mass}} \\times 100",tag:"Basic Math",formula:"\\%\\text{element} = \\frac{\\text{mass of element}}{\\text{molar mass}} \\times 100",details:"Determines the mass fraction of a single element within a mole of a specific compound."
          },
          {
            type:"formula",name:"Empirical & Molecular Formula",tex:"n = \\frac{\\text{molecular mass}}{\\text{empirical formula mass}}, \\quad \\text{Molecular} = (\\text{Empirical})_n",tag:"Basic Math",formula:"n = \\frac{\\text{molecular mass}}{\\text{empirical formula mass}}, \\quad \\text{Molecular} = (\\text{Empirical})_n",details:"The relationship connecting the simplest integer ratio of elements to the actual chemical structure."
          },
          {
            type:"formula",name:"Concentration in Molarity",tex:"M = \\frac{n_{\\text{solute}}}{V_{\\text{solution}} \\text{ (in L)}}",tag:"General",formula:"M = \\frac{n_{\\text{solute}}}{V_{\\text{solution}} \\text{ (in L)}}",details:"The standard laboratory measurement of liquid concentration, counting the exact moles of active solute dissolved per liter of the total liquid mixture."
          },
          {
            type:"formula",name:"Molality",tex:"m=\\frac{n_{\\text{solute}}}{m_{\\text{solvent}}(\\mathrm{kg})}",tag:"Concentration",formula:"m=\\frac{n_{\\text{solute}}}{m_{\\text{solvent}}(\\mathrm{kg})}",details:"Temperature-independent concentration metric based on the mass of the solvent."
          },
          {
            type:"formula",name:"Mole Fraction",tex:"x_i=\\frac{n_i}{\\sum_jn_j}",tag:"Concentration",formula:"x_i=\\frac{n_i}{\\sum_jn_j}",details:"The ratio of moles of a specific component to the total moles in a mixture."
          },
          {
            type:"formula",name:"Mass, Volume %, and Parts Per",tex:"\\%w/w=\\frac{m_{\\text{sol}}}{m_{\\text{tot}}}\\times 100, \\quad ppm=\\frac{m_{\\text{sol}}}{m_{\\text{tot}}}\\times 10^6",tag:"Concentration",formula:"\\%w/w=\\frac{m_{\\text{sol}}}{m_{\\text{tot}}}\\times 100, \\quad ppm=\\frac{m_{\\text{sol}}}{m_{\\text{tot}}}\\times 10^6",details:"Standard fractions for expressing macroscopic and trace concentrations (percentage, ppm, ppb)."
          },
          {
            type:"formula",name:"Dilution Equation",tex:"C_1V_1=C_2V_2",tag:"Concentration",formula:"C_1V_1=C_2V_2",details:"Conservation of moles during the dilution of a solution."
          },
          {
            type:"formula",name:"Raoult's Law",tex:"P_A = P_A^\\circ \\chi_A",tag:"General",formula:"P_A = P_A^\\circ \\chi_A",details:"Predicts that the vapor pressure of an ideal chemical solution is simply the pure vapor pressure scaled down proportionally by its actual molar fraction in the mix."
          },
          {
            type:"formula",name:"Gibbs-Helmholtz Equation",tex:"\\left[ \\frac{\\partial (\\Delta G/T)}{\\partial T} \\right]_P = -\\frac{\\Delta H}{T^2}",tag:"General",formula:"\\left[ \\frac{\\partial (\\Delta G/T)}{\\partial T} \\right]_P = -\\frac{\\Delta H}{T^2}",details:"A crucial thermodynamic link allowing chemists to calculate exactly how the spontaneity of a chemical reaction will shift as temperatures change."
          },
          {
            type:"formula",name:"Nernst Equation",tex:"E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{RT}{nF} \\ln Q",tag:"General",formula:"E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{RT}{nF} \\ln Q",details:"Predicts the actual real-world voltage output of a battery cell under non-standard conditions, adjusting for temperature and changing chemical concentrations."
          },
          {
            type:"formula",name:"First-Order Reaction (Integrated Rate)",tex:"\\ln[A]_t = \\ln[A]_0 - kt \\implies k = \\frac{2.303}{t} \\log\\frac{[A]_0}{[A]_t}",tag:"General",formula:"\\ln[A]_t = \\ln[A]_0 - kt \\implies k = \\frac{2.303}{t} \\log\\frac{[A]_0}{[A]_t}",details:"The logarithmic kinetic decay equation that determines exactly how fast a chemical reactant gets consumed over time in a simple unimolecular reaction."
          },
          {
            type:"formula",name:"Arrhenius equation (ln)",tex:"\\ln k=\\ln A-\\frac{E_a}{RT}",tag:"General",formula:"\\ln k=\\ln A-\\frac{E_a}{RT}",details:"Demonstrates that reaction rates are exponentially sensitive to heat. Even small temperature increases dramatically boost the chance of overcoming activation energy limits."
          },
          {
            type:"formula",name:"Photon Energy & Wavelength",tex:"E=h\\nu, \\quad E=\\frac{hc}{\\lambda}",tag:"Atomic Structure",formula:"E=h\\nu, \\quad E=\\frac{hc}{\\lambda}",details:"Relates the energy of a photon directly to its frequency and inversely to its wavelength."
          },
          {
            type:"formula",name:"de Broglie Wavelength & Heisenberg",tex:"\\lambda=\\frac{h}{p} = \\frac{h}{mv}, \\quad \\Delta x\\Delta p\\ge\\frac{\\hbar}{2}",tag:"Atomic Structure",formula:"\\lambda=\\frac{h}{p} = \\frac{h}{mv}, \\quad \\Delta x\\Delta p\\ge\\frac{\\hbar}{2}",details:"Fundamental quantum properties describing the wave nature of matter and the limits of simultaneous measurement."
          },
          {
            type:"formula",name:"Bohr Model Equations",tex:"E_n= -\\frac{13.6Z^2}{n^2}\\ \\text{eV}, \\quad r_n= \\frac{a_0n^2}{Z}",tag:"Atomic Structure",formula:"E_n= -\\frac{13.6Z^2}{n^2}\\ \\text{eV}, \\quad r_n= \\frac{a_0n^2}{Z}",details:"Determines the discrete orbital energies and radii for single-electron, hydrogen-like atoms."
          },
          {
            type:"formula",name:"Rydberg Equation",tex:"\\frac{1}{\\lambda} = R_HZ^2 \\left( \\frac{1}{n_1^2}-\\frac{1}{n_2^2} \\right)",tag:"Atomic Structure",formula:"\\frac{1}{\\lambda} = R_HZ^2 \\left( \\frac{1}{n_1^2}-\\frac{1}{n_2^2} \\right)",details:"Calculates the exact wavelengths of light emitted or absorbed during electron transitions in hydrogen-like atoms."
          }
        ]
      },
      { 
        title: "Inorganic & Equilibrium", 
        items: [
          {
            type:"formula",name:"pH and pOH",tex:"\\text{pH} = -\\log[H^+], \\quad \\text{pOH} = -\\log[OH^-]",tag:"General",formula:"\\text{pH} = -\\log[H^+], \\quad \\text{pOH} = -\\log[OH^-]",details:"Converts highly awkward, microscopic ion concentration decimals into the simple, manageable 0-14 logarithmic scales of acidity and basicity."
          },
          {
            type:"formula",name:"Henderson-Hasselbalch Equation",tex:"\\text{pH} = \\text{pK}_a + \\log\\frac{[\\text{Salt}]}{[\\text{Acid}]}",tag:"General",formula:"\\text{pH} = \\text{pK}_a + \\log\\frac{[\\text{Salt}]}{[\\text{Acid}]}",details:"The go-to formula for biochemists to engineer and calculate the exact pH of stabilizing chemical buffer solutions."
          },
          {
            type:"formula",name:"General Buffer & Capacity",tex:"\\text{pH} = \\text{pK}_a + \\log\\frac{a_{A^-}}{a_{HA}}, \\quad \\beta = \\frac{d n_{\\text{strong base}}}{d(\\text{pH})}",tag:"Buffers",formula:"\\text{pH} = \\text{pK}_a + \\log\\frac{a_{A^-}}{a_{HA}}, \\quad \\beta = \\frac{d n_{\\text{strong base}}}{d(\\text{pH})}",details:"Activity-based buffer equation and the buffer capacity measuring resistance to pH changes."
          },
          {
            type:"formula",name:"Solubility Product",tex:"K_{sp} = \\prod_i a_i^{\\nu_i}, \\quad Q_{sp} > K_{sp} \\implies \\text{Precipitation}",tag:"Solubility",formula:"K_{sp} = \\prod_i a_i^{\\nu_i}, \\quad Q_{sp} > K_{sp} \\implies \\text{Precipitation}",details:"Determines the maximum amount of a solid that can dissolve before crashing out of solution as a precipitate."
          },
          {
            type:"formula",name:"Effective Atomic Number (EAN)",tex:"\\text{EAN} = Z - \\text{Oxidation State} + 2 \\times (\\text{Coordination Number})",tag:"General",formula:"\\text{EAN} = Z - \\text{Oxidation State} + 2 \\times (\\text{Coordination Number})",details:"A heuristic rule guiding transition metal chemistry. Complexes are highly stable when their total electron count matches that of a noble gas."
          },
          {
            type:"formula",name:"18-Electron Rule",tex:"N_{\\text{valence}} + N_{\\text{ligand}} = 18",tag:"Organometallic",formula:"N_v + N_L = 18",details:"A rule of thumb for predicting the thermodynamic stability of transition metal complexes, perfectly filling their d, s, and p orbitals."
          },
          {
            type:"formula",name:"Crystal Field Stabilization Energy (CFSE)",tex:"\\text{CFSE} = (-0.4 n_{t_{2g}} + 0.6 n_{e_g})\\Delta_o + P",tag:"General",formula:"\\text{CFSE} = (-0.4 n_{t_{2g}} + 0.6 n_{e_g})\\Delta_o + P",details:"Quantifies the thermodynamic stability gained when d-orbital electrons in a transition metal drop into split, lower-energy orbital configurations."
          }
        ]
      }
    ]
  },
  { 
    id: "chemistry_extended", 
    title: "2. Chemistry — Extended Reference", 
    sections: [
      { 
        title: "Physical Chemistry", 
        items: [
          {
            type:"formula",name:"First Law of Thermodynamics",tex:"dU = \\delta Q - \\delta W, \\quad \\delta W = P_{\\text{ext}}dV",tag:"Thermodynamics",formula:"dU = \\delta Q - \\delta W, \\quad \\delta W = P_{\\text{ext}}dV",details:"Conservation of energy where internal energy changes via heat transfer and physical PV work."
          },
          {
            type:"formula",name:"Enthalpy & Heat Capacity",tex:"H = U + PV, \\quad C_V = \\left(\\frac{\\partial U}{\\partial T}\\right)_V, \\quad C_P = \\left(\\frac{\\partial H}{\\partial T}\\right)_P",tag:"Thermodynamics",formula:"H = U + PV, \\quad C_V = \\left(\\frac{\\partial U}{\\partial T}\\right)_V, \\quad C_P = \\left(\\frac{\\partial H}{\\partial T}\\right)_P",details:"Definitions linking heat exchange at constant volume or pressure to internal energy and enthalpy."
          },
          {
            type:"formula",name:"Ideal Gas Thermodynamics",tex:"\\Delta U=nC_V\\Delta T, \\quad \\Delta H=nC_P\\Delta T, \\quad C_P-C_V=R",tag:"Thermodynamics",formula:"\\Delta U=nC_V\\Delta T, \\quad \\Delta H=nC_P\\Delta T, \\quad C_P-C_V=R",details:"Energy state equations and the Mayer relation exclusively for ideal gases."
          },
          {
            type:"formula",name:"Entropy & Clausius Inequality",tex:"dS=\\frac{\\delta Q_{\\text{rev}}}{T}, \\quad \\oint\\frac{\\delta Q}{T}\\le 0",tag:"Thermodynamics",formula:"dS=\\frac{\\delta Q_{\\text{rev}}}{T}, \\quad \\oint\\frac{\\delta Q}{T}\\le 0",details:"The second law of thermodynamics establishing entropy state functions and predicting irreversible processes."
          },
          {
            type:"formula",name:"Ideal Gas Entropy Change",tex:"\\Delta S = nC_P\\ln\\frac{T_2}{T_1} - nR\\ln\\frac{P_2}{P_1}",tag:"Thermodynamics",formula:"\\Delta S = nC_P\\ln\\frac{T_2}{T_1} - nR\\ln\\frac{P_2}{P_1}",details:"Calculates the total entropy shift of an ideal gas across temperature and pressure transformations."
          },
          {
            type:"formula",name:"Thermodynamic Potentials",tex:"A=U-TS, \\quad G=H-TS, \\quad \\mu_i=\\left(\\frac{\\partial G}{\\partial n_i}\\right)_{T,P,n_j}",tag:"Thermodynamics",formula:"A=U-TS, \\quad G=H-TS, \\quad \\mu_i=\\left(\\frac{\\partial G}{\\partial n_i}\\right)_{T,P,n_j}",details:"Helmholtz and Gibbs free energies, along with the fundamental definition of chemical potential."
          },
          {
            type:"formula",name:"Fundamental Equations & Gibbs-Duhem",tex:"dU=TdS-PdV+\\sum\\mu_i dn_i, \\quad SdT-VdP+\\sum n_i d\\mu_i=0",tag:"Thermodynamics",formula:"dU=TdS-PdV+\\sum_i\\mu_i dn_i, \\quad SdT-VdP+\\sum_i n_i d\\mu_i=0",details:"The master equations linking all major thermodynamic state variables and defining system phase equilibria constraints."
          },
          {
            type:"formula",name:"Ideal Gas Laws",tex:"PV=nRT, \\quad \\frac{P_1V_1}{T_1}=\\frac{P_2V_2}{T_2}",tag:"Gases",formula:"PV=nRT, \\quad \\frac{P_1V_1}{T_1}=\\frac{P_2V_2}{T_2}",details:"The equations of state linking pressure, volume, and temperature for idealized non-interacting gas particles."
          },
          {
            type:"formula",name:"Dalton Law",tex:"P=\\sum_iP_i, \\quad P_i=x_iP",tag:"Gases",formula:"P=\\sum_iP_i, \\quad P_i=x_iP",details:"Demonstrates that in a mixed balloon of non-reacting gases, the total pressure is simply the additive sum of the independent partial pressures exerted by each gas."
          },
          {
            type:"formula",name:"Real Gases (van der Waals)",tex:"\\left(P+\\frac{an^2}{V^2}\\right)(V-nb)=nRT",tag:"Real Gases",formula:"\\left(P+\\frac{an^2}{V^2}\\right)(V-nb)=nRT",details:"Corrects the ideal gas law by accounting for particle volume constraints and intermolecular attractive forces."
          },
          {
            type:"formula",name:"Critical Constants (vdW)",tex:"V_c=3nb, \\quad P_c=\\frac{a}{27b^2}, \\quad T_c=\\frac{8a}{27Rb}",tag:"Real Gases",formula:"V_c=3nb, \\quad P_c=\\frac{a}{27b^2}, \\quad T_c=\\frac{8a}{27Rb}",details:"The critical point parameters where liquid and gas phases become indistinguishable for a van der Waals gas."
          },
          {
            type:"formula",name:"Virial Equation & Compressibility",tex:"Z=\\frac{PV}{nRT} = 1+\\frac{B}{V_m}+\\frac{C}{V_m^2}+\\dots",tag:"Real Gases",formula:"Z=\\frac{PV}{nRT} = 1+\\frac{B}{V_m}+\\frac{C}{V_m^2}+\\cdots",details:"A power-series expansion mapping deviations from ideal gas behavior using compressibility."
          },
          {
            type:"formula",name:"Colligative Properties",tex:"\\Delta T_b=iK_bm, \\quad \\Delta T_f=iK_fm, \\quad \\Pi=iCRT",tag:"Solutions",formula:"\\Delta T_b=iK_bm, \\quad \\Delta T_f=iK_fm, \\quad \\Pi=iCRT",details:"Quantifies boiling point elevation, freezing point depression, and osmotic pressure governed by solute particle count."
          },
          {
            type:"formula",name:"Henry Law",tex:"c=k_HP",tag:"Solutions",formula:"c=k_HP",details:"Why sodas fizz: the solubility of a gas trapped dissolving in a liquid scales linearly with the physical pressure compressing it from above."
          },
          {
            type:"formula",name:"Clapeyron & Phase Rule",tex:"\\frac{dP}{dT}=\\frac{\\Delta H_{\\text{trans}}}{T\\Delta V_{\\text{trans}}}, \\quad F=C-P+2",tag:"Phase Eq",formula:"\\frac{dP}{dT}=\\frac{\\Delta H_{\\text{trans}}}{T\\Delta V_{\\text{trans}}}, \\quad F=C-P+2",details:"Governs precise phase transition boundaries and calculates the degrees of freedom via the Gibbs phase rule."
          },
          {
            type:"formula",name:"Reaction Rates & Orders",tex:"r=k[A]^m[B]^n, \\quad n=m_1+m_2+\\dots",tag:"Kinetics",formula:"r=k[A]^m[B]^n, \\quad n=m_1+m_2+\\cdots",details:"The universal rate law showing how reactant concentrations scale the speed of a reaction according to its specific order."
          },
          {
            type:"formula",name:"Zero and Second Order Kinetics",tex:"[A]_t=[A]_0-kt, \\quad \\frac{1}{[A]_t}=\\frac{1}{[A]_0}+kt",tag:"Kinetics",formula:"[A]_t=[A]_0-kt, \\quad \\frac{1}{[A]_t}=\\frac{1}{[A]_0}+kt",details:"Integrated rate laws determining reactant depletion profiles for constant-rate (zero) and bimolecular (second) reactions."
          },
          {
            type:"formula",name:"Arrhenius Two-Temperature Form",tex:"\\ln\\frac{k_2}{k_1} = -\\frac{E_a}{R} \\left( \\frac{1}{T_2}-\\frac{1}{T_1} \\right)",tag:"Kinetics",formula:"\\ln\\frac{k_2}{k_1} = -\\frac{E_a}{R} \\left( \\frac{1}{T_2}-\\frac{1}{T_1} \\right)",details:"Allows direct computation of activation energy by comparing reaction speeds at two different thermal states."
          },
          {
            type:"formula",name:"Michaelis-Menten & Turnover",tex:"v=\\frac{V_{\\max}[S]}{K_M+[S]}, \\quad k_{\\text{cat}}=\\frac{V_{\\max}}{[E]_T}",tag:"Catalysis",formula:"v=\\frac{V_{\\max}[S]}{K_M+[S]}, \\quad k_{\\text{cat}}=\\frac{V_{\\max}}{[E]_T}",details:"The foundational equations modeling enzyme kinetics, saturation, and the catalytic turnover number per active site."
          }
        ]
      },
      { 
        title: "Equilibrium Acids Bases", 
        items: [
          {
            type:"formula",name:"Equilibrium Constant",tex:"K=\\prod_i a_i^{\\nu_i}",tag:"Equilibrium",formula:"K=\\prod_i a_i^{\\nu_i}",details:"The mathematical ratio characterizing a chemical reaction completely halted at its stable balancing point, derived from product and reactant activities."
          },
          {
            type:"formula",name:"Gibbs Relation to Equilibrium",tex:"\\Delta_rG=\\Delta_rG^\\circ+RT\\ln Q, \\quad \\Delta_rG^\\circ=-RT\\ln K",tag:"Equilibrium",formula:"\\Delta_rG=\\Delta_rG^\\circ+RT\\ln Q, \\quad \\Delta_rG^\\circ=-RT\\ln K",details:"Connects thermodynamic driving forces directly to the reaction quotient and standard equilibrium constants."
          },
          {
            type:"formula",name:"Van’t Hoff Equation",tex:"\\frac{d\\ln K}{dT}=\\frac{\\Delta H^\\circ}{RT^2}",tag:"Equilibrium",formula:"\\frac{d\\ln K}{dT}=\\frac{\\Delta H^\\circ}{RT^2}",details:"Predicts how chemical equilibrium brutally shifts in response to temperature. Endothermic reactions get boosted by heat, while exothermic ones get suppressed."
          },
          {
            type:"formula",name:"Van't Hoff (Integrated)",tex:"\\ln\\frac{K_2}{K_1} = -\\frac{\\Delta_rH^\\circ}{R}\\left(\\frac{1}{T_2}-\\frac{1}{T_1}\\right)",tag:"Equilibrium",formula:"\\ln\\frac{K_2}{K_1} = -\\frac{\\Delta_rH^\\circ}{R}\\left(\\frac{1}{T_2}-\\frac{1}{T_1}\\right)",details:"Calculates the new equilibrium constant at a different temperature assuming a constant enthalpy of reaction."
          },
          {
            type:"formula",name:"Water Ion Product",tex:"K_w=a_{H^+}a_{OH^-}",tag:"Acid Base",formula:"K_w=a_{H^+}a_{OH^-}",details:"The universal constant dictating that the product of acidic and basic ion concentrations in standard liquid water will rigidly equal 10^-14."
          },
          {
            type:"formula",name:"Weak Acid & Base Constants",tex:"K_a=\\frac{[H^+][A^-]}{[HA]}, \\quad K_b=\\frac{[BH^+][OH^-]}{[B]}, \\quad K_aK_b=K_w",tag:"Acid Base",formula:"K_a=\\frac{[H^+][A^-]}{[HA]}, \\quad K_b=\\frac{[BH^+][OH^-]}{[B]}, \\quad K_aK_b=K_w",details:"Formulas governing partial dissociation of weak electrolytes and the rigid coupling between conjugate acid-base pairs."
          }
        ]
      },
      { 
        title: "Electrochemistry", 
        items: [
          {
            type:"formula",name:"Cell Potential & Gibbs",tex:"E_{\\text{cell}}=E_{\\text{cathode}}-E_{\\text{anode}}, \\quad \\Delta G=-nFE",tag:"Electrochemistry",formula:"E_{\\text{cell}}=E_{\\text{cathode}}-E_{\\text{anode}}, \\quad \\Delta G=-nFE",details:"Relates the physical voltage generated by an electrochemical cell to its inherent thermodynamic spontaneity."
          },
          {
            type:"formula",name:"Nernst Equation (298 K)",tex:"E = E^\\circ - \\frac{0.05916}{n}\\log Q",tag:"Electrochemistry",formula:"E = E^\\circ - \\frac{0.05916}{n}\\log Q",details:"Simplified form of the Nernst equation for room temperature applications using base-10 logarithms."
          },
          {
            type:"formula",name:"Faraday Electrolysis",tex:"m=\\frac{Q M}{zF}, \\quad Q=It, \\quad n_e=\\frac{Q}{F}",tag:"Electrochemistry",formula:"m=\\frac{Q M}{zF}, \\quad Q=It, \\quad n_e=\\frac{Q}{F}",details:"Allows chemists to calculate the precise mass of solid metal that will electroplate onto a cathode based purely on the total electrical charge pumped through the solution."
          },
          {
            type:"formula",name:"Conductivity",tex:"\\kappa=1/\\rho, \\quad R=\\rho\\frac{l}{A}",tag:"Electrochemistry",formula:"\\kappa=1/\\rho, \\quad R=\\rho\\frac{l}{A}",details:"A fundamental material property measuring the absolute ease at which an electrolyte solution allows electric charges to swim through it."
          },
          {
            type:"formula",name:"Molar Conductivity & Kohlrausch",tex:"\\Lambda_m=\\kappa/c, \\quad \\Lambda_m^\\circ = \\sum_i\\nu_i\\lambda_i^\\circ",tag:"Electrochemistry",formula:"\\Lambda_m=\\kappa/c, \\quad \\Lambda_m^\\circ = \\sum_i\\nu_i\\lambda_i^\\circ",details:"Normalizes raw conductivity against concentration and applies the law of independent migration of ions at infinite dilution."
          },
          {
            type:"formula",name:"Ionic Strength",tex:"I = \\frac{1}{2} \\sum_i c_i z_i^2",tag:"Solutions",formula:"I = \\frac{1}{2} \\sum_i c_i z_i^2",details:"Quantifies the total electrical intensity of a solution, driving non-ideal behavior in ionic interactions."
          }
        ]
      },
      { 
        title: "Organic & Biochemistry", 
        items: [
          {
            type:"formula",name:"Degree of Unsaturation",tex:"DBE=C-\\frac H2+\\frac N2+1-\\frac X2",tag:"Organic Chemistry",formula:"DBE=C-\\frac H2+\\frac N2+1-\\frac X2",details:"A structural cheat code: plugging in the chemical formula instantly tells chemists how many rings or pi-bonds must exist in an unknown organic molecule."
          },
          {
            type:"formula",name:"Hammett Equation",tex:"\\log\\frac{K_X}{K_H} = \\sigma\\rho",tag:"Physical Organic",formula:"\\log\\frac{K_X}{K_H} = \\sigma\\rho",details:"Linear free-energy relationship quantifying electronic substituent effects on reaction mechanisms and rates."
          },
          {
            type:"formula",name:"Kinetic Isotope Effect (KIE)",tex:"KIE = \\frac{k_H}{k_D}",tag:"Physical Organic",formula:"KIE = \\frac{k_H}{k_D}",details:"The ratio of reaction rates between isotopic variants, utilized to probe the exact mechanisms of bond breaking."
          },
          {
            type:"formula",name:"Polymer DP & Polydispersity",tex:"DP=\\frac{M_n}{M_0}, \\quad Ð=\\frac{M_w}{M_n}, \\quad DP_n=\\frac{1}{1-p}",tag:"Polymers",formula:"DP=\\frac{M_n}{M_0}, \\quad Ð=\\frac{M_w}{M_n}, \\quad DP_n=\\frac{1}{1-p}",details:"Key molecular weight averages and the Carothers equation governing step-growth polymerization efficiency."
          },
          {
            type:"formula",name:"Eyring Equation (Enthalpy & Entropy)",tex:"k=\\frac{k_BT}{h}e^{\\Delta S^\\ddagger/R}e^{-\\Delta H^\\ddagger/(RT)}",tag:"Kinetics",formula:"k=\\frac{k_BT}{h}e^{\\Delta S^\\ddagger/R}e^{-\\Delta H^\\ddagger/(RT)}",details:"A thermodynamics-based upgrade to Arrhenius linking the rate of a chemical reaction directly to the entropy and enthalpy properties of its unstable transition state."
          }
        ]
      },
      { 
        title: "Inorganic & Nuclear Chemistry", 
        items: [
          {
            type:"formula",name:"Formation Constants",tex:"\\beta_n = \\frac{[ML_n]}{[M][L]^n}, \\quad \\beta_n=K_1K_2\\dots K_n",tag:"Coordination",formula:"\\beta_n = \\frac{[ML_n]}{[M][L]^n}, \\quad \\beta_n=K_1K_2\\cdots K_n",details:"Overall and cumulative stability constants measuring the thermodynamic preference for forming complex coordination ions."
          },
          {
            type:"formula",name:"Radioactive Decay & Half-life",tex:"N=N_0e^{-\\lambda t}, \\quad A=\\lambda N, \\quad t_{1/2}=\\frac{\\ln 2}{\\lambda}, \\quad \\tau=\\frac{1}{\\lambda}",tag:"Nuclear",formula:"N=N_0e^{-\\lambda t}, \\quad A=\\lambda N, \\quad t_{1/2}=\\frac{\\ln 2}{\\lambda}, \\quad \\tau=\\frac{1}{\\lambda}",details:"The fundamental kinetics of nuclear decay, modeling remaining unstable nuclei, activity, and average lifetime."
          },
          {
            type:"formula",name:"Nuclear Binding & Mass Formula",tex:"B = \\Delta m\\,c^2, \\quad R=R_0A^{1/3}",tag:"Nuclear",formula:"B = \\Delta m\\,c^2, \\quad R=R_0A^{1/3}",details:"Mass defect energy relation and the semi-empirical approximation of nuclear geometric radii."
          },
          {
            type:"formula",name:"Semi-Empirical Mass Formula",tex:"B = a_vA - a_sA^{2/3} - a_c\\frac{Z(Z-1)}{A^{1/3}} - a_a\\frac{(A-2Z)^2}{A} + \\delta",tag:"Nuclear",formula:"B = a_vA - a_sA^{2/3} - a_c\\frac{Z(Z-1)}{A^{1/3}} - a_a\\frac{(A-2Z)^2}{A} + \\delta",details:"The liquid drop model equation calculating total nuclear binding energy based on volume, surface, and Coulombic repulsions."
          }
        ]
      }
    ]
  },
  { 
    id: "adv_chem", 
    title: "3. Advanced Chemistry", 
    sections: [
      { 
        title: "Advanced Physical & Quantum Chemistry", 
        items: [
          {
            type:"formula",name:"Maxwell Relations",tex:"\\left(\\frac{\\partial S}{\\partial V}\\right)_T = \\left(\\frac{\\partial P}{\\partial T}\\right)_V, \\dots",tag:"Thermodynamics",formula:"\\left(\\frac{\\partial S}{\\partial V}\\right)_T = \\left(\\frac{\\partial P}{\\partial T}\\right)_V, \\quad \\left(\\frac{\\partial S}{\\partial P}\\right)_T = -\\left(\\frac{\\partial V}{\\partial T}\\right)_P",details:"Symmetry equations mapping abstract entropy changes to easily measurable physical derivatives."
          },
          {
            type:"formula",name:"Clausius-Clapeyron Equation",tex:"\\ln\\left(\\frac{P_2}{P_1}\\right)=-\\frac{\\Delta H_{\\text{vap}}}{R}\\left(\\frac{1}{T_2}-\\frac{1}{T_1}\\right)",tag:"Physical Chem",formula:"\\ln\\left(\\frac{P_2}{P_1}\\right)=-\\frac{\\Delta H_{\\text{vap}}}{R}\\left(\\frac{1}{T_2}-\\frac{1}{T_1}\\right)",details:"Predicts exactly how the boiling point of a liquid will shift when exposed to changes in external atmospheric pressure."
          },
          {
            type:"formula",name:"Debye-Hückel Limiting & Extended",tex:"\\log\\gamma_\\pm=-A|z_+z_-|\\sqrt{I}, \\quad \\log_{10}\\gamma_i = -\\frac{Az_i^2\\sqrt{I}}{1+Ba_i\\sqrt{I}}",tag:"Physical Chem",formula:"\\log\\gamma_\\pm=-A|z_+z_-|\\sqrt{I}, \\quad \\log_{10}\\gamma_i = -\\frac{Az_i^2\\sqrt{I}}{1+Ba_i\\sqrt{I}}",details:"Corrects equilibrium calculations in ionic solutions by accounting for the electrostatic shielding clouds that form around dissolved ions."
          },
          {
            type:"formula",name:"Schrödinger Equation (Time-Dep & Indep)",tex:"\\hat H\\Psi=E\\Psi, \\quad i\\hbar\\frac{\\partial\\Psi}{\\partial t} = \\hat H\\Psi, \\quad \\hat H=\\hat T+\\hat V",tag:"Quantum Chem",formula:"\\hat H\\Psi=E\\Psi, \\quad i\\hbar\\frac{\\partial\\Psi}{\\partial t} = \\hat H\\Psi, \\quad \\hat H=\\hat T+\\hat V",details:"The master equations of quantum mechanics establishing energy eigenvalue solutions and the time evolution of the wavefunction."
          },
          {
            type:"formula",name:"Quantum Model Energies (PIB, HO, H-atom)",tex:"E_n=\\frac{n^2h^2}{8mL^2}, \\quad E_n=\\hbar\\omega(n+1/2), \\quad E_n=-\\frac{\\mu Z^2e^4}{2(4\\pi\\epsilon_0)^2\\hbar^2n^2}",tag:"Quantum Chem",formula:"E_n=\\frac{n^2h^2}{8mL^2}, \\quad E_n=\\hbar\\omega(n+\\frac{1}{2}), \\quad E_n=-\\frac{\\mu Z^2e^4}{2(4\\pi\\epsilon_0)^2\\hbar^2n^2}",details:"Exact eigenvalue solutions for the particle in a box, harmonic oscillator, and the full hydrogenic atom."
          },
          {
            type:"formula",name:"Angular Momentum & Spin",tex:"L^2=l(l+1)\\hbar^2, \\quad L_z=m_l\\hbar, \\quad S^2=s(s+1)\\hbar^2",tag:"Quantum Chem",formula:"L^2=l(l+1)\\hbar^2, \\quad L_z=m_l\\hbar, \\quad S^2=s(s+1)\\hbar^2",details:"Quantization rules for orbital angular momentum and intrinsic electron spin."
          },
          {
            type:"formula",name:"Variational Principle & Perturbation",tex:"E_0\\le \\frac{\\langle\\psi|\\hat H|\\psi\\rangle}{\\langle\\psi|\\psi\\rangle}, \\quad E_n^{(1)} = \\langle n|H'|n\\rangle",tag:"Quantum Chem",formula:"E_0\\le \\frac{\\langle\\psi|\\hat H|\\psi\\rangle}{\\langle\\psi|\\psi\\rangle}, \\quad E_n^{(1)} = \\langle n|H'|n\\rangle",details:"Approximation methods allowing the calculation of multi-electron energies by minimizing expectation values or adding small perturbing fields."
          },
          {
            type:"formula",name:"Born-Oppenheimer Approximation",tex:"\\Psi_{total}\\approx\\psi_{\\text{elec}}\\times\\chi_{\\text{nuc}}",tag:"Quantum Chem",formula:"\\Psi_{total}(\\mathbf r,\\mathbf R)\\approx\\psi_{electronic}(\\mathbf r;\\mathbf R)\\times\\chi_{nuclear}(\\mathbf R)",details:"The core assumption of quantum chemistry: because nuclei are so massive and slow, we can calculate electron orbitals treating the nuclei as perfectly frozen in space."
          },
          {
            type:"formula",name:"Hartree-Fock & Roothaan",tex:"\\hat{F} \\phi_i = \\epsilon_i \\phi_i, \\quad FC=SC\\epsilon",tag:"Quantum Chem",formula:"\\hat{F} \\phi_i = \\epsilon_i \\phi_i, \\quad FC=SC\\epsilon",details:"The fundamental eigenvalue equation of molecular orbital theory utilizing a self-consistent mean-field approach."
          },
          {
            type:"formula",name:"Molecular Orbital LCAO & Hückel",tex:"\\psi=c_A\\phi_A+c_B\\phi_B, \\quad \\det|H_{ij}-ES_{ij}|=0",tag:"Quantum Chem",formula:"\\psi=c_A\\phi_A+c_B\\phi_B, \\quad \\det|H_{ij}-ES_{ij}|=0",details:"Constructs molecular orbitals via a linear combination of atomic orbitals, solving for energies through the secular determinant."
          },
          {
            type:"formula",name:"SN1 and SN2 Reaction Rates",tex:"\\text{Rate}_{SN1}=k[\\text{Sub}], \\quad \\text{Rate}_{SN2}=k[\\text{Sub}][\\text{Nuc}]",tag:"Organic Chem",formula:"\\text{Rate}_{SN1}=k[\\text{Substrate}], \\quad \\text{Rate}_{SN2}=k[\\text{Substrate}][\\text{Nucleophile}]",details:"Mechanistic rate laws proving whether a substitution bottlenecks on carbocation formation or bimolecular collision."
          }
        ]
      },
      { 
        title: "Spectroscopy & Surface Chemistry", 
        items: [
          {
            type:"formula",name:"Beer-Lambert Law",tex:"A=\\varepsilon lc, \\quad T=\\frac{I}{I_0}, \\quad A=-\\log T",tag:"Spectroscopy",formula:"A=\\varepsilon lc, \\quad T=\\frac{I}{I_0}, \\quad A=-\\log T",details:"The underlying principle of spectrometers linking light absorbance linearly to particle concentration and path length."
          },
          {
            type:"formula",name:"Raman, Rotational, & Vibrational",tex:"\\Delta E=h(\\nu_0-\\nu_R), \\quad E_J=BJ(J+1), \\quad \\nu=\\frac{1}{2\\pi}\\sqrt{\\frac{k}{\\mu}}",tag:"Spectroscopy",formula:"\\Delta E=h(\\nu_0-\\nu_{\\text{Raman}}), \\quad E_J=BJ(J+1), \\quad \\nu=\\frac{1}{2\\pi}\\sqrt{\\frac{k}{\\mu}}",details:"Energy formulas for inelastic scattering, rigid rotor moments of inertia, and harmonic bond stretching."
          },
          {
            type:"formula",name:"NMR & EPR",tex:"\\omega_0=\\gamma B_0, \\quad \\delta=\\frac{\\nu_s-\\nu_{\\text{ref}}}{\\nu_{\\text{ref}}}\\times 10^6, \\quad \\Delta E=g\\mu_BB",tag:"Spectroscopy",formula:"\\omega_0=\\gamma B_0, \\quad \\delta=\\frac{\\nu_{\\text{sample}}-\\nu_{\\text{ref}}}{\\nu_{\\text{ref}}}\\times 10^6, \\quad \\Delta E=g\\mu_BB",details:"Calculates resonant Larmor frequencies, chemical shifts in NMR, and Zeeman splitting in EPR."
          },
          {
            type:"formula",name:"X-Ray Diffraction (Bragg & Scherrer)",tex:"n\\lambda=2d\\sin\\theta, \\quad D=\\frac{K\\lambda}{\\beta\\cos\\theta}",tag:"Crystallography",formula:"n\\lambda=2d\\sin\\theta, \\quad D=\\frac{K\\lambda}{\\beta\\cos\\theta}",details:"Derives crystal lattice spacing from diffraction angles and estimates crystallite size from peak broadening."
          },
          {
            type:"formula",name:"Cubic Cell Density & Spacing",tex:"\\rho=\\frac{ZM}{N_Aa^3}, \\quad d_{hkl}=\\frac{a}{\\sqrt{h^2+k^2+l^2}}",tag:"Crystallography",formula:"\\rho=\\frac{ZM}{N_Aa^3}, \\quad d_{hkl}=\\frac{a}{\\sqrt{h^2+k^2+l^2}}",details:"Calculates theoretical bulk density and interplanar spacing from Miller indices in cubic lattices."
          },
          {
            type:"formula",name:"Adsorption Isotherms",tex:"\\theta=\\frac{KP}{1+KP}, \\quad \\frac{x}{m}=KP^{1/n}",tag:"Surface",formula:"\\theta=\\frac{KP}{1+KP}, \\quad \\frac{x}{m}=KP^{1/n}",details:"Langmuir and Freundlich isotherm models mapping fractional surface coverage against external gas pressure."
          },
          {
            type:"formula",name:"BET Isotherm",tex:"\\frac{P}{V(P_0-P)} = \\frac{1}{V_mC} + \\frac{C-1}{V_mC}\\frac{P}{P_0}",tag:"Surface",formula:"\\frac{P}{V(P_0-P)} = \\frac{1}{V_mC} + \\frac{C-1}{V_mC}\\frac{P}{P_0}",details:"The Brunauer-Emmett-Teller extension for modeling multi-layer physical gas adsorption."
          },
          {
            type:"formula",name:"Colloidal Stokes Law",tex:"F_d=6\\pi\\eta rv, \\quad v=\\frac{2r^2(\\rho_p-\\rho_f)g}{9\\eta}",tag:"Colloids",formula:"F_d=6\\pi\\eta rv, \\quad v=\\frac{2r^2(\\rho_p-\\rho_f)g}{9\\eta}",details:"Defines the viscous drag and terminal settling velocity of spherical colloidal particles in fluid."
          },
          {
            type:"formula",name:"Young & Young-Laplace",tex:"\\gamma_{SV}=\\gamma_{SL}+\\gamma_{LV}\\cos\\theta, \\quad \\Delta P=\\gamma\\left(\\frac{1}{R_1}+\\frac{1}{R_2}\\right)",tag:"Surface",formula:"\\gamma_{SV}=\\gamma_{SL}+\\gamma_{LV}\\cos\\theta, \\quad \\Delta P=\\gamma\\left(\\frac{1}{R_1}+\\frac{1}{R_2}\\right)",details:"Governs contact angles for wetting and capillary pressure drops across curved interfaces."
          }
        ]
      },
      {
        title: "Computational, Statistical & Network Dynamics",
        items: [
          {
            type:"formula",name:"Statistical Mechanics Ensembles",tex:"P_i=\\frac{e^{-E_i/(k_BT)}}{Z}, \\quad Z=\\sum_i e^{-\\beta E_i}",tag:"Stat Mech",formula:"P_i=\\frac{e^{-E_i/(k_BT)}}{Z}, \\quad Z=\\sum_i e^{-\\beta E_i}",details:"Boltzmann distributions mapping microscopic energy states to the master partition function."
          },
          {
            type:"formula",name:"Partition Function Thermo",tex:"A=-k_BT\\ln Z, \\quad U=-\\frac{\\partial\\ln Z}{\\partial\\beta}, \\quad S=k_B(\\ln Z+\\beta U)",tag:"Stat Mech",formula:"A=-k_BT\\ln Z, \\quad U=-\\frac{\\partial\\ln Z}{\\partial\\beta}, \\quad S=k_B(\\ln Z+\\beta U)",details:"Derives bulk macroscopic thermodynamic potentials directly from the statistical partition function."
          },
          {
            type:"formula",name:"Total Molecular Partition Function",tex:"q=q_{\\text{trans}}q_{\\text{rot}}q_{\\text{vib}}q_{\\text{elec}}",tag:"Stat Mech",formula:"q=q_{\\text{trans}}q_{\\text{rot}}q_{\\text{vib}}q_{\\text{elec}}",details:"Factorizes the overall partition function into independent degrees of freedom."
          },
          {
            type:"formula",name:"Density Functional Theory (DFT)",tex:"E=E[n], \\quad \\left[-\\frac{\\hbar^2}{2m}\\nabla^2+V_{\\text{eff}}\\right]\\phi_i=\\epsilon_i\\phi_i",tag:"Comp Chem",formula:"E=E[n], \\quad \\left[-\\frac{\\hbar^2}{2m}\\nabla^2+V_{\\text{eff}}(\\mathbf r)\\right]\\phi_i=\\epsilon_i\\phi_i",details:"The Hohenberg-Kohn framework and Kohn-Sham equations reducing many-body quantum problems to electron density functionals."
          },
          {
            type:"formula",name:"Molecular Mechanics Force Field",tex:"E_{\\text{tot}}=E_{\\text{bond}}+E_{\\text{ang}}+E_{\\text{dih}}+E_{\\text{nonbond}}",tag:"Comp Chem",formula:"E_{\\text{tot}}=E_{\\text{bond}}+E_{\\text{angle}}+E_{\\text{dihedral}}+E_{\\text{nonbonded}}",details:"Classical empirical approximations treating molecules as balls and springs to rapidly calculate conformational energies."
          },
          {
            type:"formula",name:"Lennard-Jones & Coulomb",tex:"V_{\\text{LJ}}=4\\epsilon\\left[\\left(\\frac{\\sigma}{r}\\right)^{12}-\\left(\\frac{\\sigma}{r}\\right)^6\\right], \\quad V_{\\text{Coulomb}}=\\frac{q_iq_j}{4\\pi\\epsilon_0r}",tag:"Comp Chem",formula:"V(r)=4\\epsilon\\left[\\left(\\frac{\\sigma}{r}\\right)^{12}-\\left(\\frac{\\sigma}{r}\\right)^6\\right], \\quad V(r)=\\frac{q_iq_j}{4\\pi\\epsilon_0r}",details:"The standard non-bonded potentials capturing van der Waals dispersion, Pauli repulsion, and electrostatic interactions."
          },
          {
            type:"formula",name:"Molecular Dynamics & Verlet",tex:"m_i\\frac{d^2r_i}{dt^2}=-\\nabla_iU, \\quad r(t+\\Delta t)=r(t)+v(t)\\Delta t+\\frac{1}{2}a(t)\\Delta t^2",tag:"Comp Chem",formula:"m_i\\frac{d^2r_i}{dt^2}=-\\nabla_iU, \\quad r(t+\\Delta t)=r(t)+v(t)\\Delta t+\\frac{1}{2}a(t)\\Delta t^2",details:"Integrates Newton's equations of motion over discrete time steps to simulate molecular trajectories."
          },
          {
            type:"formula",name:"Monte Carlo Metropolis",tex:"P_{\\text{acc}}=\\min[1, e^{-\\beta\\Delta E}]",tag:"Comp Chem",formula:"P_{\\text{acc}}=\\min\\left[1, e^{-\\beta\\Delta E}\\right]",details:"Stochastic acceptance probability for exploring chemical phase space via random thermal fluctuations."
          },
          {
            type:"formula",name:"Transport (Fick & Nernst-Planck)",tex:"J=-D\\nabla c, \\quad \\frac{\\partial c}{\\partial t}=D\\nabla^2c, \\quad D=\\mu k_BT",tag:"Transport",formula:"J=-D\\nabla c, \\quad \\frac{\\partial c}{\\partial t}=D\\nabla^2c, \\quad D=\\mu k_BT",details:"Fick's laws modeling mass diffusion gradients and the Einstein relation linking diffusivity to mobility."
          },
          {
            type:"formula",name:"Reaction-Diffusion & Networks",tex:"\\frac{\\partial c}{\\partial t}=D\\nabla^2c+R(c), \\quad \\frac{d\\mathbf x}{dt}=N\\mathbf v(\\mathbf x)",tag:"Dynamics",formula:"\\frac{\\partial c}{\\partial t}=D\\nabla^2c+R(c), \\quad \\frac{d\\mathbf x}{dt}=N\\mathbf v(\\mathbf x)",details:"Coupled differential equations governing complex spatiotemporal oscillating reactions and stoichiometric network flux."
          },
          {
            type:"formula",name:"Butler-Volmer & Tafel",tex:"i=i_0\\left[e^{\\alpha_a nF\\eta/RT}-e^{-\\alpha_c nF\\eta/RT}\\right], \\quad \\eta=a+b\\log i",tag:"Electrochem",formula:"i=i_0\\left[e^{\\alpha_a nF\\eta/(RT)}-e^{-\\alpha_c nF\\eta/(RT)}\\right], \\quad \\eta=a+b\\log i",details:"Advanced electrochemical kinetics mapping exact overpotential activation directly to measurable electrical currents."
          },
          {
            type:"formula",name:"Battery Coulomb Counting",tex:"SOC(t)=SOC_0+\\frac{1}{Q_{\\text{nom}}}\\int I(t)\\,dt",tag:"Batteries",formula:"SOC(t)=SOC_0+\\frac{1}{Q_{\\text{nom}}}\\int I(t)\\,dt",details:"Integrates instantaneous current loads to track the real-time state of charge in a battery cell."
          },
          {
            type:"formula",name:"Chemical Eng. Reactors (CSTR/PFR)",tex:"V_{\\text{CSTR}}=\\frac{F_{A0}X}{-r_A}, \\quad V_{\\text{PFR}}=F_{A0}\\int_0^X\\frac{dX}{-r_A}",tag:"Chem Eng",formula:"V=\\frac{F_{A0}X}{-r_A}, \\quad V=F_{A0}\\int_0^X\\frac{dX}{-r_A}",details:"Calculates the required physical volume for continuous stirred-tank and plug-flow chemical reactors to achieve target conversions."
          },
          {
            type:"formula",name:"Transport Dimensionless Numbers",tex:"Re=\\frac{\\rho vL}{\\mu}, \\quad Sc=\\frac{\\mu}{\\rho D}, \\quad Pe=Re\\,Sc",tag:"Chem Eng",formula:"Re=\\frac{\\rho vL}{\\mu}, \\quad Sc=\\frac{\\mu}{\\rho D}, \\quad Pe=Re\\,Sc",details:"Reynolds, Schmidt, and Peclet numbers characterizing the scaling regimes of fluid momentum and mass transfer."
          },
          {
            type:"formula",name:"Information Chemistry & QSAR",tex:"H=-\\sum_i p_i\\log p_i, \\quad T=\\frac{c}{a+b-c}",tag:"Info Chem",formula:"H=-\\sum_i p_i\\log p_i, \\quad T=\\frac{c}{a+b-c}",details:"Shannon entropy for data distributions and the Tanimoto similarity coefficient for comparing molecular fingerprints."
          },
          {
            type:"formula",name:"Nonequilibrium Thermodynamics",tex:"J_i=\\sum_jL_{ij}X_j, \\quad \\dot S_{\\text{prod}}=\\sum_iJ_iX_i \\ge 0",tag:"Nonequilibrium",formula:"J_i=\\sum_jL_{ij}X_j, \\quad \\dot S_{\\text{prod}}=\\sum_iJ_iX_i \\ge 0",details:"Linear irreversible transport flux phenomenological equations and the strictly positive entropy production rate."
          }
        ]
      }
    ]
  }
];

// ==========================================================
// 4. BIOLOGY DATA (BIO_DATA)
// ==========================================================
const BIO_DATA = [
  { id: "biology", title: "1. Biology & Population Dynamics", sections: [
    { title: "Genetics & Molecular", items: [
      {type:"formula",name:"Michaelis-Menten kinetics",tex:"v=\\frac{V_{\\max}[S]}{K_m+[S]}",tag:"General",formula:"v=\\frac{V_{\\max}[S]}{K_m+[S]}",details:"The foundational biochemistry curve showing that an enzyme's processing speed hits a hard maximum ceiling once all its active binding sites are saturated."},
      {type:"formula",name:"Hill Equation",tex:"\\theta = \\frac{[L]^n}{K_d + [L]^n}",tag:"Biochem",formula:"\\theta = [L]^n / (K_d + [L]^n)",details:"Models the cooperative binding of ligands to macromolecules (like oxygen to hemoglobin), predicting a sigmoidal curve instead of a hyperbolic one."},
      {type:"formula",name:"DNA molecular mass",tex:"M_{\\rm DNA}\\approx660N_{\\rm bp}\\ \\text{g/mol}",tag:"General",formula:"M_{\\rm DNA}\\approx660N_{\\rm bp}\\ \\text{g/mol}",details:"A standard laboratory rule of thumb utilized to estimate the raw macroscopic weight of a DNA strand based purely on counting its base pairs."},
      {type:"formula",name:"Chargaff's rules 1",tex:"A=T",tag:"General",formula:"A=T",details:"The vital clue to the double helix: proved that adenine and thymine ratios are universally matched across all DNA, indicating they chemically pair up."},
      {type:"formula",name:"Hardy-Weinberg allele frequencies",tex:"p+q=1",tag:"General",formula:"p+q=1",details:"The baseline population genetics rule stating that for a basic two-allele biological trait, the combined percentage of the dominant and recessive alleles must equal 100%. "},
      {type:"formula",name:"Hardy-Weinberg genotype frequencies",tex:"p^2+2pq+q^2=1",tag:"General",formula:"p^2+2pq+q^2=1",details:"Predicts the exact statistical distribution of genetic traits across a population assuming no evolutionary pressures like mutation or selection are occurring."},
      {type:"formula",name:"Recombination frequency",tex:"RF=\\frac{\\text{recombinant offspring}}{\\text{total offspring}}\\times100",tag:"General",formula:"RF=\\frac{\\text{recombinant offspring}}{\\text{total offspring}}\\times100",details:"Calculates genetic linkage. A lower percentage indicates that two distinct genes sit very closely together on the same physical chromosome."},
      {type:"formula",name:"Multiple Alleles",tex:"\\sum_i p_i=1",tag:"Genetics",formula:"\\sum_i p_i=1",details:"Extends Hardy-Weinberg principles to traits controlled by more than two alleles, ensuring all allele frequencies sum to 100%."},
      {type:"formula",name:"Haldane Mapping Function",tex:"d=-\\frac12\\ln(1-2r)",tag:"Genetics",formula:"d=-\\frac12\\ln(1-2r)",details:"Corrects recombination frequencies to account for multiple crossovers between distant genes on a chromosome."},
      {type:"formula",name:"Linkage Disequilibrium (D)",tex:"D=p_{AB}-p_Ap_B",tag:"Genetics",formula:"D=p_{AB}-p_Ap_B",details:"Measures the non-random association of alleles at two or more loci, identifying genetic linkage or evolutionary selection."},
      {type:"formula",name:"Squared Allele Correlation (r^2)",tex:"r^2=\\frac{D^2}{p_Ap_ap_Bp_b}",tag:"Genetics",formula:"r^2=D^2 / (p_A p_a p_B p_b)",details:"A standardized measure of linkage disequilibrium commonly used in GWAS to correlate genetic variants."},
      {type:"formula",name:"DNA Concentration",tex:"C=\\frac{m}{V}",tag:"Genetics",formula:"C=m/V",details:"Calculates the mass concentration of nucleic acids in a given solution volume."},
      {type:"formula",name:"Melting Temperature (Basic)",tex:"T_m\\approx2(A+T)+4(G+C)",tag:"Molecular",formula:"T_m = 2(A+T) + 4(G+C)",details:"Wallace rule to estimate oligonucleotide melting temperature based on hydrogen bond strength between base pairs."},
      {type:"formula",name:"Ideal PCR Amplification",tex:"N=N_0 2^n",tag:"Molecular",formula:"N=N_0 2^n",details:"Calculates the theoretical number of DNA copies generated after n cycles of Polymerase Chain Reaction."},
      {type:"formula",name:"qPCR Delta Ct",tex:"\\Delta C_t=C_{t,\\text{target}}-C_{t,\\text{reference}}",tag:"Molecular",formula:"\\Delta C_t=C_{t,target}-C_{t,reference}",details:"Normalizes the expression of a target gene against a baseline reference or housekeeping gene."},
      {type:"formula",name:"qPCR Fold Change",tex:"\\text{Fold change}=2^{-\\Delta\\Delta C_t}",tag:"Molecular",formula:"Fold = 2^{-\\Delta\\Delta C_t}",details:"Calculates the relative expression ratio of a target gene between an experimental sample and a control."}
    ]},
    { title: "Ecology & Epidemiology", items: [
      {type:"formula",name:"Exponential growth equation",tex:"N_t=N_0e^{rt}",tag:"General",formula:"N_t=N_0e^{rt}",details:"Models the terrifyingly rapid, unchecked explosion of biological populations (like bacteria) given limitless food and zero predators."},
      {type:"formula",name:"Logistic population growth rate",tex:"\\frac{dN}{dt}=rN\\left(1-\\frac NK\\right)",tag:"General",formula:"\\frac{dN}{dt}=rN\\left(1-\\frac NK\\right)",details:"The realistic model of population growth. The rate starts exponential, but aggressively drops to zero as the population hits the environment's hard carrying capacity limit (K)."},
      {type:"formula",name:"SIR model (Susceptible)",tex:"\\frac{dS}{dt}=-\\beta\\frac{SI}{N}",tag:"General",formula:"\\frac{dS}{dt}=-\\beta\\frac{SI}{N}",details:"The epidemiological equation detailing the exact speed at which healthy, susceptible people succumb to a virus based on transmission rates and infected contact."},
      {type:"formula",name:"Basic reproduction number",tex:"R_0=\\beta cD",tag:"General",formula:"R_0=\\beta cD",details:"The infamous R-naught. If it is greater than 1, a virus outbreak will inherently expand; if less than 1, the disease mathematically fizzles out."},
      {type:"formula",name:"Lotka-Volterra competition 1",tex:"\\frac{dN_1}{dt}=r_1N_1\\left(1-\\frac{N_1+\\alpha N_2}{K_1}\\right)",tag:"General",formula:"\\frac{dN_1}{dt}=r_1N_1\\left(1-\\frac{N_1+\\alpha N_2}{K_1}\\right)",details:"Simulates the bitter ecological warfare between two species fighting for the same resources, accounting for both environmental limits and competitor suppression."},
      {type:"formula",name:"Predator-prey equation 1",tex:"\\frac{dN}{dt}=rN-aNP",tag:"General",formula:"\\frac{dN}{dt}=rN-aNP",details:"Models the oscillating population cycles seen in nature: prey multiply naturally but are actively depleted in proportion to the number of roaming predators."},
      {type:"formula",name:"Doubling Time",tex:"t_d=\\frac{\\ln2}{r}",tag:"Ecology",formula:"t_d=\\ln(2)/r",details:"Calculates the precise time required for an exponentially growing population to double in size."},
      {type:"formula",name:"Gompertz Growth",tex:"\\frac{dN}{dt}=rN\\ln\\left(\\frac KN\\right)",tag:"Ecology",formula:"dN/dt = rN\\ln(K/N)",details:"An asymmetrical growth model where the population growth rate decays exponentially as it approaches carrying capacity, heavily utilized in tumor biology."},
      {type:"formula",name:"Richards Growth",tex:"\\frac{dN}{dt}=rN\\left[1-\\left(\\frac NK\\right)^\\nu\\right]",tag:"Ecology",formula:"dN/dt = rN(1-(N/K)^v)",details:"A flexible, generalized extension of the logistic growth curve that allows the inflection point of growth to shift."},
      {type:"formula",name:"Allee Effect",tex:"\\frac{dN}{dt}=rN\\left(1-\\frac NK\\right)\\left(\\frac NA-1\\right)",tag:"Ecology",formula:"dN/dt = rN(1-N/K)(N/A-1)",details:"Models biological populations that suffer negative growth rates if they drop below a critical minimum threshold (A), risking extinction."},
      {type:"formula",name:"Leslie Matrix",tex:"\\mathbf n_{t+1}=L\\mathbf n_t",tag:"Ecology",formula:"n_{t+1}=L n_t",details:"An age-structured population model predicting how varying birth and survival rates across age groups dictate future population distributions."},
      {type:"formula",name:"Species-Area Relationship",tex:"S=cA^z",tag:"Ecology",formula:"S=cA^z",details:"A fundamental biogeographical rule estimating how the number of species scales with the size of an observed habitat island."},
      {type:"formula",name:"Metapopulation Dynamics",tex:"\\frac{dp}{dt}=cp(1-p)-ep",tag:"Ecology",formula:"dp/dt = cp(1-p)-ep",details:"Models populations of populations. It tracks the fraction of occupied habitat patches as a balance between local colonizations and local extinctions."},
      {type:"formula",name:"SIS Model",tex:"\\frac{dS}{dt}=-\\beta\\frac{SI}{N}+\\gamma I",tag:"Epidemiology",formula:"dS/dt = -\\beta SI/N + \\gamma I",details:"Epidemiological model for diseases where recovery does not confer immunity, meaning individuals immediately become susceptible again."},
      {type:"formula",name:"SEIR Model (Exposed)",tex:"\\frac{dE}{dt}=\\beta\\frac{SI}{N}-\\sigma E",tag:"Epidemiology",formula:"dE/dt = \\beta SI/N - \\sigma E",details:"Expands the SIR model by introducing a latent incubation period where individuals carry the disease but cannot yet transmit it."},
      {type:"formula",name:"Effective Reproduction Number",tex:"R_t=R_0\\frac{S(t)}N",tag:"Epidemiology",formula:"R_t = R_0(S(t)/N)",details:"The real-time transmission rate of an ongoing epidemic, adjusting the baseline R0 as the susceptible population naturally shrinks over time."},
      {type:"formula",name:"Epidemic Final Size",tex:"-\\ln\\left(\\frac{S_\\infty}{S_0}\\right)=R_0\\left(1-\\frac{S_\\infty}{N}\\right)",tag:"Epidemiology",formula:"-\\ln(S_\\infty/S_0) = R_0(1-S_\\infty/N)",details:"Transcendental equation determining the total percentage of a population that will ultimately catch a virus before it burns out naturally."}
    ]}
  ]},
  { id: "biology_quantitative", title: "2. Biology — Quantitative Reference", sections: [
    { title: "Cell & Membrane Physics", items: [
      {type:"formula",name:"Fick First Law",tex:"J=-D\\nabla c",tag:"Transport",formula:"J=-D\\nabla c",details:"The universal law of diffusion proving that particles will naturally flow downhill along their concentration gradient in a desperate attempt to homogenize."},
      {type:"formula",name:"Fick Second Law",tex:"\\partial_tc=D\\nabla^2c",tag:"Transport",formula:"\\partial_tc=D\\nabla^2c",details:"A dynamic partial differential equation simulating exactly how the density of diffusing particles spreads, flows, and evolves across space over time."},
      {type:"formula",name:"Nernst Membrane Potential",tex:"E_{ion}=\\frac{RT}{zF}\\ln\\frac{[ion]_{out}}{[ion]_{in}}",tag:"Membrane Physiology",formula:"E_{ion}=\\frac{RT}{zF}\\ln\\frac{[ion]_{out}}{[ion]_{in}}",details:"The electrical equilibrium point. It calculates the exact microscopic voltage an ion gradient generates to counteract the force of chemical diffusion."},
      {type:"formula",name:"Nernst-Planck Flux",tex:"J=-D\\nabla c-\\frac{zFD}{RT}c\\nabla\\phi+c v",tag:"Transport",formula:"J=-D\\nabla c-\\frac{zFD}{RT}c\\nabla\\phi+c v",details:"The master equation for cellular ion channels. It tracks total particle movement by summing up gradient diffusion, electrical voltage pushing, and bulk fluid flow."},
      {type:"formula",name:"Membrane Flux",tex:"J=P(C_{\\rm out}-C_{\\rm in})",tag:"Transport",formula:"J=P(C_{out}-C_{in})",details:"Quantifies the net transport rate of molecules directly traversing a biological membrane, heavily dependent on the membrane's permeability."},
      {type:"formula",name:"Membrane Capacitance Charge",tex:"Q=CV",tag:"Membrane Physiology",formula:"Q=CV",details:"Relates the total electrical charge stored across the lipid bilayer directly to its capacitance and applied voltage."},
      {type:"formula",name:"Membrane Capacitance Current",tex:"I=C\\frac{dV}{dt}",tag:"Membrane Physiology",formula:"I=C(dV/dt)",details:"Measures how quickly the voltage changes across a cell membrane when an ionic current is actively charging or discharging it."},
      {type:"formula",name:"RC Time Constant",tex:"\\tau=RC",tag:"Membrane Physiology",formula:"\\tau=RC",details:"The fundamental metric determining how rapidly a neuron or cell membrane's voltage can respond to an influx of electrical current."},
      {type:"formula",name:"Mean-Square Displacement",tex:"\\langle r^2\\rangle=2dDt",tag:"Biophysics",formula:"<r^2>=2dDt",details:"The statistical spread of particles undergoing random Brownian motion, linking distance traveled to diffusion and time across 'd' dimensions."},
      {type:"formula",name:"Einstein Relation",tex:"D=\\mu k_BT",tag:"Biophysics",formula:"D=\\mu k_BT",details:"Links the microscopic mobility of a biological particle directly to its macroscopic diffusion coefficient via thermal energy."},
      {type:"formula",name:"Stokes-Einstein Equation",tex:"D=\\frac{k_BT}{6\\pi\\eta r}",tag:"Biophysics",formula:"D=k_BT/(6\\pi\\eta r)",details:"Calculates the diffusion rate of a spherical molecule, proving it slows down dramatically in highly viscous fluids like cytosol."},
      {type:"formula",name:"Reynolds Number",tex:"Re=\\frac{\\rho vL}{\\eta}",tag:"Biophysics",formula:"Re=\\rho vL/\\eta",details:"The dimensionless ratio of inertial to viscous forces, proving that microscopic organisms experience water like thick honey (low Re)."},
      {type:"formula",name:"Peclet Number",tex:"Pe=\\frac{vL}{D}",tag:"Biophysics",formula:"Pe=vL/D",details:"Determines whether cellular transport is dominated by bulk fluid flow (convection) or random molecular diffusion."},
      {type:"formula",name:"Damköhler Number",tex:"Da=\\frac{\\text{reaction rate}}{\\text{transport rate}}",tag:"Biophysics",formula:"Da=reaction/transport",details:"Compares the speed of a biochemical reaction to the speed at which reactants are physically delivered to the site."},
      {type:"formula",name:"Osmotic Pressure",tex:"\\Pi=iCRT",tag:"Biophysics",formula:"\\Pi=iCRT",details:"Calculates the intense physical pressure water exerts when rushing across a membrane to dilute a concentrated salt or sugar solution."},
      {type:"formula",name:"Surface Tension (Spherical)",tex:"\\Delta P=\\frac{2\\gamma}{R}",tag:"Biophysics",formula:"\\Delta P=2\\gamma/R",details:"Laplace's law illustrating how surface tension creates higher internal pressure inside tiny spherical biological structures like alveoli or vesicles."}
    ]},
    { title: "Population & Ecology", items: [
      {type:"formula",name:"Exponential Growth",tex:"\\frac{dN}{dt}=rN",tag:"Population",formula:"\\frac{dN}{dt}=rN",details:"The differential model mapping the sheer velocity of an unrestricted population explosion, where the growth rate scales simply against the current massive population."},
      {type:"formula",name:"Exponential Solution",tex:"N(t)=N_0e^{rt}",tag:"Population",formula:"N(t)=N_0e^{rt}",details:"Models the terrifyingly rapid, unchecked explosion of biological populations (like bacteria) given limitless food and zero predators."},
      {type:"formula",name:"Logistic Growth",tex:"\\frac{dN}{dt}=rN(1-N/K)",tag:"Population",formula:"\\frac{dN}{dt}=rN(1-N/K)",details:"The realistic model of population growth. The rate starts exponential, but aggressively drops to zero as the population hits the environment's hard carrying capacity limit (K)."},
      {type:"formula",name:"Lotka-Volterra Prey",tex:"\\frac{dx}{dt}=\\alpha x-\\beta xy",tag:"Ecology",formula:"\\frac{dx}{dt}=\\alpha x-\\beta xy",details:"Models natural prey population dynamics. They multiply exponentially via the alpha term but suffer deadly depletion proportional to encounters with predators."},
      {type:"formula",name:"Lotka-Volterra Predator",tex:"\\frac{dy}{dt}=\\delta xy-\\gamma y",tag:"Ecology",formula:"\\frac{dy}{dt}=\\delta xy-\\gamma y",details:"Models the predator side. Their numbers dwindle naturally due to death but spike upward proportionally to their successful hunting interactions with prey."},
      {type:"formula",name:"Reaction-Diffusion Model",tex:"\\frac{\\partial N}{\\partial t}=D\\nabla^2N+f(N)",tag:"Ecology",formula:"\\partial N/\\partial t = D\\nabla^2N + f(N)",details:"Combines physical spatial spread (diffusion) with local population growth kinetics to model advancing invasion waves or spatial patterns."}
    ]},
    { title: "Epidemiology", items: [
      {type:"formula",name:"SIR Infected",tex:"dI/dt=\\beta SI/N-\\gamma I",tag:"Epidemiology",formula:"dI/dt=\\beta SI/N-\\gamma I",details:"Tracks the terrifying peak curve of an active pandemic, calculating the total active infections as a delicate war between new sickness and steady recoveries."},
      {type:"formula",name:"SIR Recovered",tex:"dR/dt=\\gamma I",tag:"Epidemiology",formula:"dR/dt=\\gamma I",details:"Maps the rising immunity of a population, showing the constant rate at which infected people resolve their illness and become removed from the viral chain."},
      {type:"formula",name:"Basic Reproduction Number",tex:"R_0=\\beta/\\gamma",tag:"Epidemiology",formula:"R_0=\\beta/\\gamma",details:"The infamous R-naught. If it is greater than 1, a virus outbreak will inherently expand; if less than 1, the disease mathematically fizzles out."}
    ]},
    { title: "Biochemistry & Systems Biology", items: [
      {type:"formula",name:"Reaction Free Energy",tex:"\\Delta G=\\Delta G^\\circ+RT\\ln Q",tag:"Biochemistry",formula:"\\Delta G=\\Delta G^\\circ+RT\\ln Q",details:"Reveals if a cell's biochemical reaction will trigger spontaneously in the body by tweaking standard energies with current metabolic concentrations."},
      {type:"formula",name:"Equilibrium Free Energy",tex:"\\Delta G^\\circ=-RT\\ln K",tag:"Biochemistry",formula:"\\Delta G^\\circ=-RT\\ln K",details:"Demonstrates that the chemical equilibrium constant is utterly enslaved to the core thermodynamic stability of the specific molecules interacting."},
      {type:"formula",name:"First Law of Thermodynamics",tex:"\\Delta U=Q-W",tag:"Biochemistry",formula:"\\Delta U=Q-W",details:"The ultimate energy conservation rule applied to cells, showing internal energy changes based on heat absorbed minus metabolic work done."},
      {type:"formula",name:"Thermodynamic Entropy",tex:"\\Delta S=\\frac{Q_{\\rm rev}}T",tag:"Biochemistry",formula:"\\Delta S=Q_{rev}/T",details:"Quantifies the shift toward disorder in a biological system based on reversible heat transfer relative to absolute temperature."},
      {type:"formula",name:"Gibbs Free Energy Definition",tex:"G=H-TS",tag:"Biochemistry",formula:"G=H-TS",details:"The master thermodynamic equation uniting enthalpy (heat energy) and entropy (disorder) to dictate whether molecules can actually react."},
      {type:"formula",name:"Chemical Potential",tex:"\\mu_i=\\mu_i^\\circ+RT\\ln a_i",tag:"Biochemistry",formula:"\\mu_i=\\mu_i^\\circ+RT\\ln a_i",details:"Measures the capacity of a specific cellular molecule to perform work or drive diffusion based on its thermodynamic activity."},
      {type:"formula",name:"Electrochemical Nernst",tex:"E=E^\\circ-\\frac{RT}{nF}\\ln Q",tag:"Biochemistry",formula:"E=E^\\circ-(RT/nF)\\ln Q",details:"Links the electrical voltage generated by cellular redox reactions to the chemical concentrations of the reacting metabolites."},
      {type:"formula",name:"Redox Free Energy",tex:"\\Delta G=-nFE",tag:"Biochemistry",formula:"\\Delta G=-nFE",details:"Converts the electrical potential generated by electron transport chains directly into the thermodynamic energy available to synthesize ATP."},
      {type:"formula",name:"Catalytic Constant (kcat)",tex:"k_{\\rm cat}=\\frac{V_{\\max}}{[E]_T}",tag:"Enzyme Kinetics",formula:"k_{cat}=V_{max}/[E]_T",details:"The turnover number determining the maximum number of substrate molecules a single enzyme can process per second."},
      {type:"formula",name:"Lineweaver-Burk Plot",tex:"\\frac1v=\\frac{K_m}{V_{\\max}}\\frac1{[S]}+\\frac1{V_{\\max}}",tag:"Enzyme Kinetics",formula:"1/v = (K_m/V_{max})(1/[S]) + 1/V_{max}",details:"A double-reciprocal linearization of Michaelis-Menten, extensively used in labs to easily identify enzyme inhibition mechanisms."},
      {type:"formula",name:"Eadie-Hofstee Equation",tex:"v=V_{\\max}-K_m\\frac v{[S]}",tag:"Enzyme Kinetics",formula:"v=V_{max}-K_m(v/[S])",details:"Alternative linearization technique that minimizes high substrate concentration distortion errors found in Lineweaver-Burk."},
      {type:"formula",name:"Hanes-Woolf Plot",tex:"\\frac{[S]}v=\\frac{[S]}{V_{\\max}}+\\frac{K_m}{V_{\\max}}",tag:"Enzyme Kinetics",formula:"[S]/v = [S]/V_{max} + K_m/V_{max}",details:"The most statistically robust linear transformation of enzyme kinetic data, distributing variance evenly across substrate concentrations."},
      {type:"formula",name:"Competitive Inhibition",tex:"v=\\frac{V_{\\max}[S]}{\\alpha K_m+[S]}",tag:"Enzyme Kinetics",formula:"v=V_{max}[S] / (\\alpha K_m+[S])",details:"Models drugs that physically block an enzyme's active site, increasing the apparent Km without altering the maximum velocity."},
      {type:"formula",name:"Mass-Action Kinetics",tex:"v=k[A]^a[B]^b",tag:"Systems Biology",formula:"v=k[A]^a[B]^b",details:"The fundamental premise of dynamic network modeling: reaction speeds depend proportionally on the collision probability of reactants."},
      {type:"formula",name:"First-Order Reaction",tex:"A(t)=A_0e^{-kt}",tag:"Systems Biology",formula:"A(t)=A_0e^{-kt}",details:"Simulates the exponential decay of a metabolite, drug, or isotope that degrades solely based on its own concentration."},
      {type:"formula",name:"Biochemical Half-Life",tex:"t_{1/2}=\\frac{\\ln2}{k}",tag:"Systems Biology",formula:"t_{1/2}=\\ln(2)/k",details:"The universal time required for exactly 50% of a biological substance to degrade or be eliminated."},
      {type:"formula",name:"ODE Network Jacobian",tex:"J_{ij}=\\frac{\\partial f_i}{\\partial x_j}",tag:"Systems Biology",formula:"J_{ij}=\\partial f_i/\\partial x_j",details:"Evaluates network stability by measuring exactly how a minor perturbation in one cellular metabolite propagates across the entire biochemical web."},
      {type:"formula",name:"Stoichiometric Flux Balance",tex:"N\\mathbf v=0",tag:"Systems Biology",formula:"N v=0",details:"The backbone of genome-scale metabolic modeling. Assumes internal metabolites achieve steady state to predict optimal cell growth pathways."}
    ]}
  ]},
  { id: "adv_bio", title: "3. Neuroscience & Evolutionary Biology", sections: [
    { title: "Neuroscience", items: [
      {type:"formula",name:"Goldman-Hodgkin-Katz Equation",tex:"V_m=\\frac{RT}{F}\\ln\\left(\\frac{P_K[K^+]_{out}+P_{Na}[Na^+]_{out}+P_{Cl}[Cl^-]_{in}}{P_K[K^+]_{in}+P_{Na}[Na^+]_{in}+P_{Cl}[Cl^-]_{out}}\\right)",tag:"Neuroscience",formula:"V_m=\\frac{RT}{F}\\ln\\left(\\frac{P_K[K^+]_{out}+P_{Na}[Na^+]_{out}+P_{Cl}[Cl^-]_{in}}{P_K[K^+]_{in}+P_{Na}[Na^+]_{in}+P_{Cl}[Cl^-]_{out}}\\right)",details:"The definitive voltage equation for a living neuron, averaging the gradients of Potassium, Sodium, and Chlorine weighted strictly by their membrane permeabilities."},
      {type:"formula",name:"Hodgkin-Huxley Membrane Voltage",tex:"C_m\\frac{dV}{dt}=I_{\\rm ext}-I_{Na}-I_K-I_L",tag:"Neuroscience",formula:"C_m(dV/dt) = I_{ext}-I_{Na}-I_K-I_L",details:"The master equation of neurophysiology, treating the axon as an electrical circuit to compute precise action potential spikes."},
      {type:"formula",name:"Hodgkin-Huxley Sodium Current",tex:"I_{Na}=\\bar g_{Na}m^3h(V-E_{Na})",tag:"Neuroscience",formula:"I_{Na}=\\bar{g}_{Na}m^3h(V-E_{Na})",details:"Calculates the explosive inward rush of sodium ions that rapidly depolarizes the neuron, driven by activation (m) and inactivation (h) gates."},
      {type:"formula",name:"Hodgkin-Huxley Potassium Current",tex:"I_K=\\bar g_Kn^4(V_m-E_K)",tag:"Neuroscience",formula:"I_K=\\bar g_Kn^4(V_m-E_K)",details:"Models the exact flow of potassium ions surging out of a neuron during the falling phase of a nervous system action potential spike."},
      {type:"formula",name:"Hodgkin-Huxley Gating Variables",tex:"\\frac{dm}{dt}=\\alpha_m(1-m)-\\beta_m m",tag:"Neuroscience",formula:"dm/dt = \\alpha_m(1-m) - \\beta_m m",details:"The differential mechanism describing the voltage-dependent opening and closing probabilities of individual ion channel pores."},
      {type:"formula",name:"Cable Equation",tex:"\\lambda^2 \\frac{\\partial^2 V}{\\partial x^2} - \\tau \\frac{\\partial V}{\\partial t} - V = 0",tag:"Neuroscience",formula:"\\lambda^2 \\partial^2_x V - \\tau \\partial_t V - V = 0",details:"Models the decay of electrical voltage as it travels physically down the length of a neuronal axon without active regenerative firing."},
      {type:"formula",name:"Spike-Timing Dependent Plasticity (STDP)",tex:"\\Delta w=\\begin{cases}A_+e^{-\\Delta t/\\tau_+},&\\Delta t>0\\\\-A_-e^{\\Delta t/\\tau_-},&\\Delta t<0\\end{cases}",tag:"Neuroscience",formula:"\\Delta w = A e^{-|\\Delta t|/\\tau}",details:"The mathematical mechanism of biological learning, adjusting synaptic weights strictly based on the microsecond timing of presynaptic and postsynaptic firing."}
    ]},
    { title: "Evolutionary & Quantitative Genetics", items: [
      {type:"formula",name:"Fisher's Fundamental Theorem",tex:"\\Delta\\bar w=\\frac{V_A}{\\bar w}",tag:"Evolution",formula:"\\Delta\\bar w=\\frac{V_A}{\\bar w}",details:"A mathematical law of biology stating that the rate of evolutionary improvement in population fitness is exactly equal to its current genetic variance."},
      {type:"formula",name:"Wright-Fisher Genetic Drift (Var)",tex:"\\mathrm{Var}(p_{t+1})=\\frac{p_t(1-p_t)}{2N_e}",tag:"Evolution",formula:"\\mathrm{Var}(p_{t+1})=\\frac{p_t(1-p_t)}{2N_e}",details:"Simulates genetic drift. In small biological populations, trait percentages will fluctuate entirely randomly due to simple sampling errors in mating."},
      {type:"formula",name:"Breeder's Equation",tex:"R=h^2S",tag:"Quant Genetics",formula:"R=h^2S",details:"Predicts the evolutionary response (R) to artificial or natural selection based strictly on the selection differential and narrow-sense heritability."},
      {type:"formula",name:"Narrow-Sense Heritability",tex:"h^2=\\frac{V_A}{V_P}",tag:"Quant Genetics",formula:"h^2=V_A/V_P",details:"Quantifies the proportion of total physical trait variation inside a population that stems purely from additive, inheritable genetic effects."},
      {type:"formula",name:"Broad-Sense Heritability",tex:"H^2=\\frac{V_G}{V_P}",tag:"Quant Genetics",formula:"H^2=V_G/V_P",details:"Estimates the total influence of all genetic factors combined (including dominance and epistasis) over a given physical trait."},
      {type:"formula",name:"Phenotypic Variance Partitioning",tex:"V_P=V_G+V_E",tag:"Quant Genetics",formula:"V_P=V_G+V_E",details:"The fundamental equation breaking down an observed biological trait into independent genetic and environmental contributions."},
      {type:"formula",name:"Replicator Equation",tex:"\\dot x_i=x_i(f_i-\\bar f)",tag:"Evolution",formula:"dx_i/dt = x_i(f_i-\\bar{f})",details:"The core equation of evolutionary game theory, proving that strategies or alleles outperforming the population average will exponentially spread."},
      {type:"formula",name:"Price Equation",tex:"\\Delta\\bar z=\\frac{\\operatorname{Cov}(w,z)}{\\bar w}+\\frac{E(w\\Delta z)}{\\bar w}",tag:"Evolution",formula:"\\Delta z = Cov(w,z)/w + E(w\\Delta z)/w",details:"An abstract but universally true theorem describing how any heritable trait changes over time due to selection and transmission biases."},
      {type:"formula",name:"Selection Dynamics",tex:"\\frac{dp}{dt}=sp(1-p)",tag:"Evolution",formula:"dp/dt = sp(1-p)",details:"Tracks the rapid S-curve spread of a beneficial mutant allele through an environment, entirely determined by the selection coefficient (s)."},
      {type:"formula",name:"Jukes-Cantor Evolutionary Distance",tex:"d=-\\frac34\\ln\\left(1-\\frac43p\\right)",tag:"Phylogenetics",formula:"d=-3/4\\ln(1-4/3 p)",details:"Corrects molecular clock data to account for invisible, hidden genetic mutations (like A changing to C, then back to A) over deep time."}
    ]}
  ]},
  { id: "bio_math_stats", title: "4. Biostatistics, Algorithms & Math Methods", sections: [
    { title: "Basic Laboratory Math", items: [
      {type:"formula",name:"Percentage Change",tex:"\\%\\text{ change}=\\frac{x_2-x_1}{x_1}\\times100",tag:"Lab Math",formula:"% change = ((x_2-x_1)/x_1)*100",details:"Standard calculation assessing relative percentage shifts in biological measurements."},
      {type:"formula",name:"Dilution Equation",tex:"C_1V_1=C_2V_2",tag:"Lab Math",formula:"C_1V_1=C_2V_2",details:"The universal laboratory standard for preparing lower concentration solutions from highly concentrated biochemical stock."},
      {type:"formula",name:"Molarity",tex:"M=\\frac{n}{V}",tag:"Lab Math",formula:"M=n/V",details:"Defines the absolute molar concentration of solutes in a given biological fluid volume."},
      {type:"formula",name:"Mole Fraction",tex:"X_i=\\frac{n_i}{\\sum_jn_j}",tag:"Lab Math",formula:"X_i = n_i / \\sum n_j",details:"Calculates the specific ratio of one compound's moles against the total moles in a complex mixture."}
    ]},
    { title: "Biostatistical Distributions", items: [
      {type:"formula",name:"Sample Mean",tex:"\\bar{x}=\\frac1n\\sum_{i=1}^n x_i",tag:"Statistics",formula:"\\bar{x}=(\\sum x_i)/n",details:"The arithmetic average of biological experimental data points."},
      {type:"formula",name:"Sample Variance",tex:"s^2=\\frac{\\sum(x_i-\\bar{x})^2}{n-1}",tag:"Statistics",formula:"s^2 = \\sum(x_i-\\bar{x})^2 / (n-1)",details:"Quantifies the statistical dispersion and internal variation within biological datasets."},
      {type:"formula",name:"Standard Error of Mean",tex:"SE=\\frac{s}{\\sqrt n}",tag:"Statistics",formula:"SE=s/\\sqrt{n}",details:"Estimates the precision of the sample mean relative to the true population mean."},
      {type:"formula",name:"Bayes Theorem",tex:"P(A|B)=\\frac{P(B|A)P(A)}{P(B)}",tag:"Statistics",formula:"P(A|B) = P(B|A)P(A) / P(B)",details:"Crucial for diagnostic testing, updating the probability of disease given a positive test result based on prior prevalence rates."},
      {type:"formula",name:"Normal Distribution",tex:"f(x)=\\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}",tag:"Statistics",formula:"f(x)=(1/\\sigma\\sqrt{2\\pi})e^{-(x-\\mu)^2/(2\\sigma^2)}",details:"The ubiquitous bell curve characterizing continuous biological variables like height, blood pressure, and weight."},
      {type:"formula",name:"Poisson Distribution",tex:"P(X=k)=\\frac{\\lambda^ke^{-\\lambda}}{k!}",tag:"Statistics",formula:"P(X=k) = (\\lambda^k e^{-\\lambda})/k!",details:"Models the probability of rare random biological events, such as specific gene mutations occurring over a defined genomic sequence."},
      {type:"formula",name:"Binomial Distribution",tex:"P(X=k)={n\\choose k}p^k(1-p)^{n-k}",tag:"Statistics",formula:"P(X=k) = C(n,k) p^k (1-p)^{n-k}",details:"Computes exactly the probability of observing 'k' successful outcomes in 'n' independent binary biological trials (like offspring traits)."},
      {type:"formula",name:"Negative Binomial Distribution",tex:"P(X=k)=\\frac{\\Gamma(k+r)}{\\Gamma(r)k!}(1-p)^r p^k",tag:"Statistics",formula:"P(X=k) = (\\Gamma(k+r)/\\Gamma(r)k!)(1-p)^r p^k",details:"Highly utilized in single-cell RNA-seq to model overdispersed gene expression count data where variance far exceeds the mean."},
      {type:"formula",name:"Pearson Correlation",tex:"r=\\frac{\\sum(x_i-\\bar{x})(y_i-\\bar{y})}{\\sqrt{\\sum(x_i-\\bar{x})^2\\sum(y_i-\\bar{y})^2}}",tag:"Statistics",formula:"r = Cov(x,y) / (\\sigma_x \\sigma_y)",details:"Determines the linear association strength between two biological variables, moving from -1 (inverse) to 1 (perfect correlation)."}
    ]},
    { title: "Machine Learning & Bioinformatics", items: [
      {type:"formula",name:"Linear Regression",tex:"\\hat{\\beta}=(X^TX)^{-1}X^Ty",tag:"Data Science",formula:"\\beta = (X^T X)^{-1} X^T y",details:"The generalized matrix solution for predicting a continuous biological output from multiple input variables."},
      {type:"formula",name:"Logistic Regression",tex:"P(y=1|x)=\\frac1{1+e^{-(\\beta_0+\\beta^Tx)}}",tag:"Data Science",formula:"P(y=1|x) = 1/(1+e^{-(\\beta_0+\\beta^T x)})",details:"Predicts the probability of categorical biological outcomes, like whether a tumor is benign or malignant based on feature data."},
      {type:"formula",name:"Softmax Function",tex:"P(y=k|x)=\\frac{e^{z_k}}{\\sum_j e^{z_j}}",tag:"Data Science",formula:"P(y=k|x) = e^{z_k}/\\sum e^{z_j}",details:"Normalizes multi-class biological neural network outputs into a clean probability distribution spanning all possible classes."},
      {type:"formula",name:"Hidden Markov Model",tex:"P(X_{1:T},Z_{1:T})=P(Z_1)\\prod_{t=2}^T P(Z_t|Z_{t-1})\\prod_{t=1}^T P(X_t|Z_t)",tag:"Bioinformatics",formula:"HMM Joint Probability",details:"The foundational algorithmic math for gene finding and sequence alignment, tracking observed states emitting from hidden functional states."},
      {type:"formula",name:"Shannon Entropy",tex:"H(X)=-\\sum_i p_i\\log_2p_i",tag:"Bioinformatics",formula:"H(X) = -\\sum p_i \\log_2(p_i)",details:"Quantifies the intrinsic information content or 'uncertainty' embedded inside a DNA sequence or protein structure profile."},
      {type:"formula",name:"KL Divergence",tex:"D_{KL}(P||Q)=\\sum_iP_i\\ln\\frac{P_i}{Q_i}",tag:"Bioinformatics",formula:"D_KL = \\sum P_i \\ln(P_i/Q_i)",details:"Measures how a modified biological probability distribution fundamentally diverges from an expected reference distribution."},
      {type:"formula",name:"Dynamic Programming (Needleman-Wunsch)",tex:"F(i,j)=\\max(F_{match}, F_{gap1}, F_{gap2})",tag:"Bioinformatics",formula:"F(i,j) = \\max(..)",details:"The exact mathematical scoring grid method utilized to compute optimal global alignments between two DNA or protein sequences."},
      {type:"formula",name:"Hamming Distance",tex:"d_H(x,y)=\\sum_i\\mathbf1(x_i\\ne y_i)",tag:"Bioinformatics",formula:"d_H = \\sum 1(x_i \\neq y_i)",details:"Simple comparative metric counting the exact number of mismatched point mutations between two identical-length biological strings."}
    ]}
  ]},
  { id: "bio_engineering_med", title: "5. Medicine, Biomechanics & Systems", sections: [
    { title: "Biomechanics & Fluids", items: [
      {type:"formula",name:"Hooke's Law",tex:"F=-kx",tag:"Biomechanics",formula:"F=-kx",details:"Models the linear restorative force of elastic biological tissues, like tendons or titin proteins, when physically stretched."},
      {type:"formula",name:"Mechanical Stress",tex:"\\sigma=\\frac FA",tag:"Biomechanics",formula:"\\sigma = F/A",details:"Calculates the internal pressure experienced by bone or tissue subjected to a given force spread over a specific surface area."},
      {type:"formula",name:"Mechanical Strain",tex:"\\epsilon=\\frac{\\Delta L}{L}",tag:"Biomechanics",formula:"\\epsilon = \\Delta L / L",details:"Measures the relative deformation or stretching of a biological structure in response to applied stress."},
      {type:"formula",name:"Young's Modulus",tex:"E=\\frac{\\sigma}{\\epsilon}",tag:"Biomechanics",formula:"E = \\sigma / \\epsilon",details:"Defines the intrinsic physical stiffness of a biological material by comparing how much it stretches against the stress applied."},
      {type:"formula",name:"Poiseuille Fluid Flow",tex:"Q=\\frac{\\pi r^4\\Delta P}{8\\eta L}",tag:"Biomechanics",formula:"Q = \\pi r^4 \\Delta P / (8\\eta L)",details:"Demonstrates that blood flow is exquisitely sensitive to blood vessel radius; a small vasoconstriction massive increases vascular resistance."},
      {type:"formula",name:"Laplace Law (Spherical)",tex:"\\sigma=\\frac{Pr}{2t}",tag:"Biomechanics",formula:"\\sigma = Pr / 2t",details:"Calculates wall stress in hollow organs, showing that dilated hearts must work exponentially harder to generate the same blood pressure."},
      {type:"formula",name:"Kelvin-Voigt Viscoelasticity",tex:"\\sigma=E\\epsilon+\\eta\\frac{d\\epsilon}{dt}",tag:"Biomechanics",formula:"\\sigma = E\\epsilon + \\eta(d\\epsilon/dt)",details:"Models biological tissues like cartilage that act simultaneously like a solid elastic spring and a thick, viscous dashpot."},
      {type:"formula",name:"Maxwell Viscoelasticity",tex:"\\frac{d\\epsilon}{dt}=\\frac1E\\frac{d\\sigma}{dt}+\\frac{\\sigma}{\\eta}",tag:"Biomechanics",formula:"d\\epsilon/dt = (1/E)(d\\sigma/dt) + \\sigma/\\eta",details:"Models tissues demonstrating stress-relaxation, where they initially resist rapid pulling but slowly deform permanently over time."},
      {type:"formula",name:"Womersley Number",tex:"\\alpha=R\\sqrt{\\frac{\\omega\\rho}{\\mu}}",tag:"Biomechanics",formula:"\\alpha = R\\sqrt{\\omega\\rho/\\mu}",details:"Determines the fluid dynamics profile of pulsatile blood flow generated by a beating heart inside elastic arteries."}
    ]},
    { title: "Pharmacology & Medicine", items: [
      {type:"formula",name:"Pharmacokinetic 1-Compartment",tex:"C(t)=C_0e^{-kt}",tag:"Pharmacology",formula:"C(t) = C_0 e^{-kt}",details:"Models the simplest metabolic decay curve of an intravenously administered drug freely circulating in the human bloodstream."},
      {type:"formula",name:"Drug Clearance",tex:"CL=\\frac{\\text{rate of elimination}}{C}",tag:"Pharmacology",formula:"CL = Rate / C",details:"Calculates the absolute volume of blood plasma completely cleared of a drug per unit time by the liver and kidneys."},
      {type:"formula",name:"Volume of Distribution",tex:"V_d=\\frac{\\text{amount of drug}}{C}",tag:"Pharmacology",formula:"V_d = Amount / C",details:"A theoretical measure assessing whether a drug stays trapped in the bloodstream or deeply penetrates out into body tissues and fat."},
      {type:"formula",name:"IV Bolus Equation",tex:"C(t)=\\frac{D}{V_d}e^{-kt}",tag:"Pharmacology",formula:"C(t) = (D/V_d)e^{-kt}",details:"Combines volume of distribution and elimination rate to perfectly trace drug plasma concentration following a sudden injection."},
      {type:"formula",name:"Emax Pharmacodynamics",tex:"E=E_0+\\frac{E_{\\max}C}{EC_{50}+C}",tag:"Pharmacology",formula:"E = E_0 + (E_{max}C)/(EC_{50}+C)",details:"Models physiological drug response thresholds, showing diminishing returns as receptor binding sites inevitably become saturated."},
      {type:"formula",name:"Receptor Occupancy",tex:"\\theta=\\frac{[L]}{K_d+[L]}",tag:"Pharmacology",formula:"\\theta = [L]/(K_d+[L])",details:"Quantifies exactly what percentage of a cell's receptors are currently bound by circulating drug ligands."},
      {type:"formula",name:"Cardiac Output",tex:"CO=HR\\times SV",tag:"Physiology",formula:"CO = HR \\times SV",details:"Calculates the total blood volume pumped by the human heart per minute based on heart rate and stroke volume."},
      {type:"formula",name:"Mean Arterial Pressure",tex:"MAP\\approx DBP+\\frac13(SBP-DBP)",tag:"Physiology",formula:"MAP \\approx DBP + 1/3(SBP-DBP)",details:"Estimates the average perfusion pressure driving blood directly into major organs throughout a single cardiac cycle."},
      {type:"formula",name:"Total Oxygen Content",tex:"CaO_2=1.34HbS_aO_2+0.003P_aO_2",tag:"Physiology",formula:"CaO_2 = 1.34 Hb SaO_2 + 0.003 PaO_2",details:"Proves that dissolved oxygen is negligible and that hemoglobin is mathematically responsible for nearly all oxygen carried in blood."},
      {type:"formula",name:"Body Mass Index",tex:"BMI=\\frac{m}{h^2}",tag:"Physiology",formula:"BMI = m/h^2",details:"A coarse but ubiquitous public health metric scaling human mass against height squared."},
      {type:"formula",name:"Cox Proportional Hazards",tex:"h(t|x)=h_0(t)e^{\\beta^Tx}",tag:"Survival",formula:"h(t|x) = h_0(t)e^{\\beta^T x}",details:"A dominant biostatistical model predicting patient survival or death risk while simultaneously factoring in multiple patient variables."}
    ]},
    { title: "Advanced Dynamics & Structures", items: [
      {type:"formula",name:"RMSD (Protein Folding)",tex:"RMSD=\\sqrt{\\frac1N\\sum_{i=1}^{N}|\\mathbf r_i-\\mathbf r_i'|^2}",tag:"Structural",formula:"RMSD = \\sqrt{ \\sum (r_i - r'_i)^2 / N }",details:"Measures structural similarity by calculating the average physical distance between corresponding atoms in two superimposed protein shapes."},
      {type:"formula",name:"Radius of Gyration",tex:"R_g=\\sqrt{\\frac{\\sum_i m_i|\\mathbf r_i-\\mathbf r_{cm}|^2}{\\sum_i m_i}}",tag:"Structural",formula:"R_g = \\sqrt{ \\sum m_i(r_i - r_{cm})^2 / \\sum m_i }",details:"Quantifies the compactness of a protein fold, tracking how tightly mass is clustered around the center of mass."},
      {type:"formula",name:"Langevin Dynamics",tex:"m\\ddot x=-\\gamma\\dot x-\\nabla U(x)+\\xi(t)",tag:"Biophysics",formula:"ma = -\\gamma v - \\nabla U + \\xi(t)",details:"Simulates biomolecules trapped in viscous fluid experiencing both frictional drag and random thermal Brownian collisions."},
      {type:"formula",name:"Fokker-Planck Equation",tex:"\\frac{\\partial P}{\\partial t}=-\\nabla\\cdot(\\mathbf aP)+D\\nabla^2P",tag:"Stochastic Bio",formula:"\\partial P/\\partial t = -\\nabla(aP) + D\\nabla^2 P",details:"Maps the evolving probability distribution of biological variables subjected to both deterministic drift and random noise."},
      {type:"formula",name:"Birth-Death Stochastic Process",tex:"\\frac{dP_n}{dt}=\\lambda_{n-1}P_{n-1}+\\mu_{n+1}P_{n+1}-(\\lambda_n+\\mu_n)P_n",tag:"Stochastic Bio",formula:"dP_n/dt = Transition Fluxes",details:"Markov model rigorously tracking integer fluctuations in tiny populations (like RNA transcripts or rare cancer cells)."},
      {type:"formula",name:"Basic Viral Dynamics",tex:"\\frac{dV}{dt}=pI-cV",tag:"Virology",formula:"dV/dt = pI - cV",details:"Core within-host viral model detailing how quickly active viruses are produced by infected cells minus immune clearance rates."},
      {type:"formula",name:"Hill Regulation (Activation)",tex:"f(x)=\\frac{x^n}{K^n+x^n}",tag:"Synthetic Bio",formula:"f(x) = x^n/(K^n+x^n)",details:"Models cooperative gene transcription switches that turn on rapidly once an activator protein concentration hits a threshold."},
      {type:"formula",name:"Hill Regulation (Repression)",tex:"f(x)=\\frac{K^n}{K^n+x^n}",tag:"Synthetic Bio",formula:"f(x) = K^n/(K^n+x^n)",details:"Simulates genetic repression where binding of an inhibitor aggressively shuts down transcription of a target gene."},
      {type:"formula",name:"State-Space Control Theory",tex:"\\dot{\\mathbf x}=A\\mathbf x+B\\mathbf u",tag:"Systems Biology",formula:"dx/dt = Ax + Bu",details:"A mathematical framework for analyzing biological homeostasis and designing synthetic gene circuits with external inputs."},
      {type:"formula",name:"Allometric Scaling",tex:"Y=aM^b",tag:"Evolution",formula:"Y = a M^b",details:"The universal biological scaling law connecting physical traits like metabolic rate or lifespan to sheer body mass across species."},
      {type:"formula",name:"Kuramoto Oscillator Model",tex:"\\frac{d\\theta_i}{dt}=\\omega_i+\\frac K N\\sum_j\\sin(\\theta_j-\\theta_i)",tag:"Chronobiology",formula:"d\\theta_i/dt = \\omega_i + (K/N)\\sum \\sin(\\theta_j-\\theta_i)",details:"Explains how isolated biological rhythms, such as firing pacemaker cells or circadian clocks, spontaneously sync up into rhythmic harmony."}
    ]}
  ]}
];
// ==========================================================
// 5. COMBINED THEORY DATA 
// ==========================================================
const THEORY_DATA = [...PHY_DATA, ...MATH_DATA, ...CHEM_DATA, ...BIO_DATA];

// ==========================================================
// 6. HELPER HOOKS & UI COMPONENTS
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
// 7. MAIN APPLICATION VIEWS
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
// 8. MAIN APP SHELL
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