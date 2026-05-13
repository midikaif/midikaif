/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Download, Sparkles } from 'lucide-react';

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vNoise;
  varying vec3 vWorldPosition;
  uniform float uTime;
  uniform float uSpeed;

  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){ 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;
    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vNormal = normalMatrix * normal;
    
    // Lower-frequency layered noise for ultra-smooth liquid structure
    float n1 = snoise(position * 0.5 + uTime * uSpeed * 0.15);
    float n2 = snoise(position * 1.0 - uTime * uSpeed * 0.1) * 0.4;
    float noise = n1 + n2;
    vNoise = noise;

    vec3 newPosition = position + normal * noise * 0.28;
    vec4 worldPosition = modelMatrix * vec4(newPosition, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    vec4 viewPosition = modelViewMatrix * vec4(newPosition, 1.0);
    vViewPosition = -viewPosition.xyz;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const fragmentShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vNoise;
  varying vec3 vWorldPosition;
  uniform float uTime;

  // High-performance liquid iridescence palette
  vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0, 0.10, 0.20); // Swirled purple/cyan shift
    return a + b * cos(6.28318 * (c * t + d + uTime * 0.05));
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    // Dynamic liquid flow based on noise and time
    float flow = vNoise * 0.5 + 0.5;
    float timeShift = uTime * 0.15;
    
    // Multi-layer swirly color mapping
    vec3 color1 = palette(flow + sin(timeShift));
    vec3 color2 = palette(flow * 1.5 - cos(timeShift * 0.8));
    
    // Glossy metallic Fresnel calculation
    float fresnel = pow(1.3 - dot(viewDir, normal), 3.0);
    
    // Fluid swirly patterns
    float pattern = sin(vNoise * 20.0 + uTime * 0.5) * 0.5 + 0.5;
    float swirl = cos(vNoise * 10.0 - uTime * 0.8) * 0.5 + 0.5;
    
    // Base liquid color interpolation
    vec3 baseCol = mix(color1, color2, pattern * swirl);
    
    // Iridescent edge effect (Thin Film Interference simulation)
    vec3 iridescence = palette(fresnel * 0.4 + uTime * 0.1);
    vec3 finalColor = mix(baseCol, iridescence, fresnel * 0.8);
    
    // Specular highlights for chrome-like surface
    vec3 reflectDir = reflect(-viewDir, normal);
    float spec = pow(max(0.0, dot(reflectDir, vec3(0.0, 1.0, 1.0))), 32.0);
    finalColor += spec * 0.4 * iridescence;
    
    // Depth shadowing for structural volume
    float depth = smoothstep(-0.8, 0.5, vNoise);
    finalColor *= (0.5 + 0.5 * depth);
    
    // Vibrant rim lighting
    finalColor += pow(fresnel, 2.5) * color1 * 0.6;

    // Smooth edge transparency for liquid surface tension
    float alpha = smoothstep(0.0, 0.25, dot(viewDir, normal));
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

function BackgroundBlob({ mouseVelocity }: { mouseVelocity: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSpeed: { value: 0.5 },
  }), []);

  useFrame((state) => {
    const { clock, mouse } = state;
    uniforms.uTime.value = clock.getElapsedTime();
    
    const targetSpeed = 0.4 + mouseVelocity.current * 6.0;
    uniforms.uSpeed.value = THREE.MathUtils.lerp(uniforms.uSpeed.value, targetSpeed, 0.05);

    meshRef.current.rotation.x += 0.002 * uniforms.uSpeed.value;
    meshRef.current.rotation.y += 0.003 * uniforms.uSpeed.value;

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouse.x * 0.5, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouse.y * 0.5, 0.05);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1.2, 96]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    </Float>
  );
}

// Main Component
export default function DigitalBusinessCard() {
  const mouseVelocity = useRef(0);
  const lastMousePos = useRef<[number, number]>([0, 0]);

  const onMouseMove = (e: React.MouseEvent) => {
    const currentPos: [number, number] = [e.clientX, e.clientY];
    const dist = Math.sqrt(
      Math.pow(currentPos[0] - lastMousePos.current[0], 2) + 
      Math.pow(currentPos[1] - lastMousePos.current[1], 2)
    );
    mouseVelocity.current = Math.min(dist / 100, 1.0);
    lastMousePos.current = currentPos;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      mouseVelocity.current = THREE.MathUtils.lerp(mouseVelocity.current, 0, 0.1);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleCardMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section 
      onMouseMove={onMouseMove}
      className="relative w-full h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
    >
      {/* WebGL Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
          <BackgroundBlob mouseVelocity={mouseVelocity} />
        </Canvas>
      </div>

      {/* Card Wrapper */}
      <div 
        className="relative z-10 flex items-center justify-center w-full h-full pointer-events-none"
        style={{ perspective: "2000px" }}
      >
        <motion.div
           onMouseMove={handleCardMouseMove}
           onMouseLeave={handleCardMouseLeave}
           whileHover="hover"
           initial="initial"
           variants={{
             initial: { 
               boxShadow: "0 30px 100px rgba(0,0,0,0.8)",
               scale: 1,
               borderColor: "rgba(255, 255, 255, 0.1)"
             },
             hover: { 
               boxShadow: "0 0 120px rgba(196,240,34,0.1), 0 40px 150px rgba(0,0,0,0.9)",
               scale: 1.02,
               borderColor: "rgba(255, 255, 255, 0.2)"
             }
           }}
           style={{
             rotateX,
             rotateY,
             transformStyle: "preserve-3d",
           }}
           className="w-[340px] md:w-[520px] h-[210px] md:h-[300px] rounded-[3rem] bg-white/5 backdrop-blur-3xl border p-10 flex flex-col justify-between pointer-events-auto relative overflow-hidden group select-none transition-all duration-500"
        >
          {/* Subtle Dynamic Shine */}
          <motion.div 
            style={{
              background: "radial-gradient(circle at center, rgba(255,255,255,0.15), transparent 70%)",
              x: useTransform(mouseXSpring, [-0.5, 0.5], ["-50%", "50%"]),
              y: useTransform(mouseYSpring, [-0.5, 0.5], ["-50%", "50%"]),
            }}
            className="absolute inset-0 pointer-events-none opacity-40" 
          />
          
          {/* Card Content Top */}
          <div className="relative z-10 flex justify-between items-start">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col items-end">
               <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 group-hover:text-white/40 transition-colors">
                 Signature Serial / 2025
               </div>
               <div className="w-12 h-[1px] bg-white/10 mt-2 group-hover:w-20 transition-all duration-700" />
            </div>
          </div>

          {/* Card Content Middle */}
          <div className="relative z-10 space-y-2">
            <motion.h1 
              className="text-3xl md:text-5xl font-bold tracking-tighter text-white"
              style={{ transform: "translateZ(80px)" }}
            >
              Md. Kaif Khan
            </motion.h1>
            <p 
              className="text-xs md:text-sm text-white/50 font-light tracking-[0.3em] uppercase"
              style={{ transform: "translateZ(50px)" }}
            >
              Full Stack & AI Developer
            </p>
          </div>

          {/* Card Content Bottom */}
          <div className="relative z-10 flex justify-between items-end">
            <div className="space-y-1.5" style={{ transform: "translateZ(30px)" }}>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Access Code</p>
              <p className="text-sm font-mono text-white/80 tracking-[0.25em]">+91 8932082250</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              style={{ transform: "translateZ(60px)" }}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 transition-all text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-2xl hover:border-white/30"
            >
              <Download className="w-4 h-4" />
              Resume
            </motion.button>
          </div>

          {/* Inner Corner Accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[60px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 blur-[60px] rounded-full" />
        </motion.div>
      </div>

      {/* Floating Vertical Label */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block opacity-10">
        <p className="text-[10px] font-black uppercase tracking-[1.5em] text-white rotate-90 origin-center whitespace-nowrap">
          Creative Engineer
        </p>
      </div>
    </section>
  );
}
