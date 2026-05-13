/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { SendIcon, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

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

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
    hour12: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Failed to connect to the server. Please try again.');
    }
  };

  return (
    <section 
      id="contact" 
      onMouseMove={onMouseMove}
      className="relative bg-[#0a0a0a] text-white overflow-hidden"
    >
      
      {/* BLOCK 1: Cinematic Header */}
      <div className="relative w-full min-h-[85vh] flex flex-col justify-between pt-32 pb-16 px-6 md:px-12 overflow-hidden">
        
        {/* WebGL Background - Focused on this block */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
            <BackgroundBlob mouseVelocity={mouseVelocity} />
          </Canvas>
        </div>
        {/* Background Haze & Image */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img 
            src="https://images.unsplash.com/photo-1510511459019-5dee667ff8df?auto=format&fit=crop&q=80" 
            alt="Moody Background" 
            className="w-full h-full object-cover grayscale opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-red-950/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
        </div>

        {/* Massive Typography */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 1.1 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-[14vw] font-black leading-none uppercase tracking-tighter text-white bg-[url('https://images.unsplash.com/photo-1510511459019-5dee667ff8df?auto=format&fit=crop&q=80')] bg-cover bg-center bg-clip-text text-transparent filter contrast-125 brightness-150 text-center select-none"
          >
            Get in touch
          </motion.h2>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif italic text-red-600 text-[6vw] mix-blend-normal mt-12 md:mt-16 z-20"
          >
            the
          </motion.span>
        </div>

        {/* Floating Info Elements */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          <div className="max-w-md space-y-4">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight uppercase">
              Let's create <span className="font-serif italic text-red-600 lowercase">the</span> dialogue
            </h3>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              My inbox is always open for new opportunities, freelance inquiries, and technical discussions. I specialize in systems that work when it matters.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-[10px] font-black tracking-[0.2em] uppercase">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-gray-500">General Inquiries</p>
                <p>mdkaif0153@gmail.com</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Location</p>
                <p>Noida, India</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-gray-500">Socials</p>
                <div className="flex gap-4">
                  <a href="https://www.linkedin.com/in/md-kaif-khan/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">LinkedIn</a>
                  <a href="https://github.com/midikaif" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">GitHub</a>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Status</p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Available for work
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK 2: Minimalist Form Area */}
      <div className="relative w-full py-24 px-6 md:px-16 lg:px-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 lg:gap-32">
          
          {/* Left Column: Direct Contact */}
          <div className="w-full lg:w-1/3 space-y-12">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Direct Message</h4>
              <a 
                href="mailto:mdkaif0153@gmail.com" 
                className="block text-3xl md:text-5xl font-bold tracking-tighter hover:text-red-600 transition-colors break-words leading-tight"
              >
                mdkaif0153@gmail.com
              </a>
            </div>

            <div className="flex justify-between items-end border-t border-gray-800 pt-8 text-[10px] font-black uppercase tracking-widest text-gray-600">
              <div className="space-y-1">
                <p>Standard Time</p>
                <p className="text-white">{currentTime} IST</p>
              </div>
              <p>Reliability First</p>
            </div>
          </div>

          {/* Right Column: The Form */}
          <div className="w-full lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-12 md:space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="group relative">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 group-focus-within:text-white transition-colors">First Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                    className="w-full bg-transparent border-b border-gray-800 py-4 text-xl font-light focus:border-red-600 outline-none transition-colors placeholder:text-gray-800"
                  />
                </div>
                <div className="group relative">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 group-focus-within:text-white transition-colors">Last Name</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                    className="w-full bg-transparent border-b border-gray-800 py-4 text-xl font-light focus:border-red-600 outline-none transition-colors placeholder:text-gray-800"
                  />
                </div>
              </div>

              <div className="group relative">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 group-focus-within:text-white transition-colors">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full bg-transparent border-b border-gray-800 py-4 text-xl font-light focus:border-red-600 outline-none transition-colors placeholder:text-gray-800"
                />
              </div>

              <div className="group relative">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 group-focus-within:text-white transition-colors">Tell me about your project</label>
                <textarea 
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="The details..."
                  className="w-full bg-transparent border-b border-gray-800 py-4 text-xl font-light focus:border-red-600 outline-none transition-colors resize-none placeholder:text-gray-800"
                />
              </div>

              <div className="flex flex-col gap-6">
                <AnimatePresence mode="wait">
                  {status === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 text-green-500 text-sm font-semibold"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Message sent successfully! I'll get back to you soon.
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 text-red-500 text-sm font-semibold"
                    >
                      <AlertCircle className="w-5 h-5" />
                      {errorMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button 
                  whileHover={{ x: 10 }}
                  disabled={status === 'loading'}
                  className="group flex items-center gap-4 text-base font-black uppercase tracking-[0.4em] hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0"
                  type="submit"
                >
                  {status === 'loading' ? (
                    <>
                      Sending...
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </>
                  ) : (
                    <>
                      Send Message
                      <SendIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="w-full py-12 px-6 md:px-12 flex justify-between items-center text-[10px] font-black tracking-widest text-gray-800 border-t border-white/5">
        <p>© 2025 MD KAIF KHAN</p>
        <p className="hidden md:block">ENGINEERING IMPACT THROUGH RELIABILITY</p>
        <p>AVAILABLE WORLDWIDE</p>
      </div>

    </section>
  );
}
