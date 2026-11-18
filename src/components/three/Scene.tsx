"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { sceneState, type Composition } from "@/lib/scene";

type Quality = "high" | "low";

const COMPOSITIONS: Record<Composition, { x: number; y: number; z: number; s: number }> = {
  right: { x: 2.35, y: 0.05, z: 0, s: 1 },
  "far-right": { x: 4.5, y: 0.1, z: -1.5, s: 0.82 },
  left: { x: -2.6, y: 0, z: -0.6, s: 0.82 },
  "far-left": { x: -4.5, y: 0.2, z: -1.5, s: 0.82 },
  center: { x: 0, y: -0.1, z: -1.5, s: 0.82 },
  back: { x: 0.6, y: 0.4, z: -13, s: 0.75 },
};

const damp = (dt: number, k: number) => 1 - Math.exp(-dt * k);

/** Deterministic PRNG so particle layout is pure and stable across renders. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* ───────────── GLSL: twinkling particle field ───────────── */
const particleVert = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uReveal;
  attribute float aScale;
  attribute float aPhase;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.12 + aPhase) * 0.15;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float tw = 0.65 + 0.35 * sin(uTime * 0.9 + aPhase * 6.2831);
    gl_PointSize = aScale * tw * uPixelRatio * (22.0 / -mv.z);
    vAlpha = tw * uReveal * smoothstep(40.0, 6.0, -mv.z);
  }
`;
const particleFrag = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vec3(0.62, 0.82, 1.0), a * a * vAlpha * 0.85);
  }
`;

function Particles({ count }: { count: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const pts = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const scale = new Float32Array(count);
    const phase = new Float32Array(count);
    const rand = mulberry32(7680);
    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.pow(rand(), 0.7) * 16;
      const th = rand() * Math.PI * 2;
      const ph = Math.acos(2 * rand() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph) * 0.6;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 4;
      scale[i] = 0.6 + rand() * 1.8;
      phase[i] = rand();
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    return g;
  }, [count]);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 }, uReveal: { value: 0 } }),
    [],
  );
  useFrame((state, dt) => {
    if (!mat.current || !pts.current) return;
    const u = mat.current.uniforms;
    u.uTime.value = sceneState.reducedMotion ? 0 : state.clock.elapsedTime;
    u.uPixelRatio.value = state.gl.getPixelRatio();
    u.uReveal.value += (Math.max(sceneState.dawn, 0.0) - u.uReveal.value) * damp(dt, 1.5);
    if (!sceneState.reducedMotion) pts.current.rotation.y += dt * 0.008;
    pts.current.rotation.x = sceneState.progress * 0.5;
  });
  return (
    <points ref={pts} geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        vertexShader={particleVert}
        fragmentShader={particleFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ───────────── GLSL: distant volumetric glow ───────────── */
const glowFrag = /* glsl */ `
  uniform float uIntensity;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 c = vUv - 0.5;
    float d = length(c * vec2(1.0, 1.6));
    float core = exp(-d * 9.0);
    float halo = exp(-d * 3.2) * 0.35;
    float streak = exp(-abs(c.y) * 60.0) * exp(-abs(c.x) * 2.5) * 0.35;
    vec3 col = mix(vec3(0.09, 0.36, 0.8), vec3(0.56, 0.8, 1.0), core);
    float a = (core + halo + streak) * uIntensity * (0.92 + 0.08 * sin(uTime * 0.7));
    gl_FragColor = vec4(col * a, a);
  }
`;
const glowVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

function DistantLight() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uIntensity: { value: 0 }, uTime: { value: 0 } }), []);
  useFrame((state, dt) => {
    if (!mat.current) return;
    const target = 0.25 + sceneState.dawn * 0.75 - sceneState.formation * 0.35;
    const u = mat.current.uniforms;
    u.uIntensity.value += (target - u.uIntensity.value) * damp(dt, 1.2);
    u.uTime.value = state.clock.elapsedTime;
  });
  return (
    <mesh position={[0, 0.2, -18]} scale={[34, 20, 1]}>
      <planeGeometry />
      <shaderMaterial
        ref={mat}
        vertexShader={glowVert}
        fragmentShader={glowFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ───────────── Sculpture ───────────── */
function Shard({ angle, tilt, radius, i }: { angle: number; tilt: number; radius: number; i: number }) {
  const ref = useRef<THREE.Group>(null);
  const box = useMemo(() => new THREE.BoxGeometry(1.35, 0.78, 0.02), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(box), [box]);
  useFrame((state) => {
    if (!ref.current) return;
    const f = easeOut(Math.min(1, Math.max(0, sceneState.formation * 1.4 - i * 0.06)));
    const t = sceneState.reducedMotion ? 0 : state.clock.elapsedTime;
    const a = angle + t * 0.05;
    const r = 0.4 + (radius - 0.4) * f;
    ref.current.position.set(Math.cos(a) * r, Math.sin(a * 1.3 + i) * 0.35 * f + tilt * 0.4, Math.sin(a) * r);
    ref.current.lookAt(0, ref.current.position.y * 0.3, 0);
    ref.current.rotateZ(tilt);
    ref.current.scale.setScalar(0.2 + 0.8 * f);
  });
  return (
    <group ref={ref}>
      <mesh geometry={box}>
        <meshPhysicalMaterial color="#1a2535" metalness={0.5} roughness={0.12} transparent opacity={0.32} clearcoat={1} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#8fcbff" transparent opacity={0.45} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

function Sculpture({ quality, mobile }: { quality: Quality; mobile: boolean }) {
  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const frame = useRef<THREE.LineSegments>(null);
  const formation = useRef(0);
  const target = useMemo(() => new THREE.Vector3(), []);

  const frameGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.85, 1)), []);
  const shards = useMemo(
    () => Array.from({ length: 6 }, (_, i) => ({ angle: (i / 6) * Math.PI * 2, tilt: ((i % 3) - 1) * 0.5, radius: 2.15 + (i % 2) * 0.45 })),
    [],
  );

  useFrame((state, dt) => {
    const g = root.current;
    if (!g || !spin.current || !rings.current) return;
    const rmo = sceneState.reducedMotion;
    formation.current += (sceneState.formation - formation.current) * damp(dt, rmo ? 30 : 1.6);
    const f = easeOut(formation.current);

    const c = COMPOSITIONS[sceneState.composition];
    const mx = mobile ? 0 : c.x;
    const mz = mobile ? c.z - 2.2 : c.z;
    const my = mobile ? c.y + 0.6 : c.y;
    target.set(mx, my, mz);
    g.position.lerp(target, damp(dt, rmo ? 30 : 1.8));
    const s = c.s * (mobile ? 0.78 : 1) * (0.15 + 0.85 * f);
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, s, damp(dt, rmo ? 30 : 2)));

    const t = state.clock.elapsedTime;
    if (!rmo) {
      spin.current.rotation.y += dt * 0.12;
      spin.current.rotation.x = Math.sin(t * 0.21) * 0.18;
    }
    // pointer parallax on the whole sculpture
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, sceneState.pointer.x * 0.35 + sceneState.progress * Math.PI * 1.2, damp(dt, 2));
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -sceneState.pointer.y * 0.18, damp(dt, 2));

    rings.current.children.forEach((ring, i) => {
      const k = 0.35 + 0.65 * easeOut(Math.min(1, Math.max(0, formation.current * 1.3 - i * 0.12)));
      ring.scale.setScalar(k);
      if (!rmo) ring.rotation.z += dt * (0.08 + i * 0.05) * (i % 2 ? -1 : 1);
    });

    // light pulse from interactions
    sceneState.pulse *= Math.exp(-dt * 2.2);
    const pulse = sceneState.pulse;
    if (coreMat.current) coreMat.current.emissiveIntensity = 1.6 + f * 1.2 + pulse * 6;
    if (light.current) light.current.intensity = (6 + pulse * 40) * f;
    if (core.current && !rmo) core.current.rotation.y -= dt * (0.4 + pulse * 3);
    if (frame.current) (frame.current.material as THREE.LineBasicMaterial).opacity = 0.1 + 0.16 * f + pulse * 0.2;
  });

  return (
    <group ref={root} position={[0, 0, -2]} scale={0.15}>
      <group ref={spin}>
        {/* faceted optical glass core */}
        <mesh>
          <icosahedronGeometry args={[1.2, 0]} />
          {quality === "high" ? (
            <MeshTransmissionMaterial
              backside
              samples={6}
              resolution={512}
              thickness={1.2}
              roughness={0.1}
              ior={1.42}
              chromaticAberration={0.05}
              anisotropicBlur={0.2}
              distortion={0.12}
              distortionScale={0.4}
              temporalDistortion={0.04}
              color="#d6e4f7"
              attenuationColor="#287bff"
              attenuationDistance={3}
            />
          ) : (
            <meshPhysicalMaterial color="#0b1220" metalness={0.85} roughness={0.14} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1.6} flatShading />
          )}
        </mesh>
        {/* luminous inner core */}
        <mesh ref={core} scale={0.36}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial ref={coreMat} color="#0d2a5c" emissive="#287bff" emissiveIntensity={2} roughness={0.3} metalness={0.2} />
        </mesh>
        <pointLight ref={light} color="#287bff" distance={7} decay={2} intensity={0} />
        {/* titanium geodesic frame */}
        <lineSegments ref={frame} geometry={frameGeo}>
          <lineBasicMaterial color="#c4ceda" transparent opacity={0.15} depthWrite={false} />
        </lineSegments>
      </group>

      {/* brushed titanium orbital rings */}
      <group ref={rings}>
        {[
          { r: 2.25, t: 0.018, rot: [1.2, 0.2, 0], blue: false },
          { r: 2.6, t: 0.01, rot: [0.3, 1.1, 0.4], blue: true },
          { r: 2.95, t: 0.026, rot: [1.75, -0.5, 0.2], blue: false },
        ].map((ring, i) => (
          <mesh key={i} rotation={ring.rot as [number, number, number]}>
            <torusGeometry args={[ring.r, ring.t, 16, 220]} />
            {ring.blue ? (
              <meshStandardMaterial color="#8fcbff" emissive="#287bff" emissiveIntensity={1.4} metalness={0.3} roughness={0.4} />
            ) : (
              <meshStandardMaterial color="#b9c3d1" metalness={1} roughness={0.26} />
            )}
          </mesh>
        ))}
      </group>

      {/* smoked glass shards */}
      {shards.map((s, i) => (
        <Shard key={i} i={i} {...s} />
      ))}
    </group>
  );
}

function CameraRig() {
  useFrame((state, dt) => {
    const cam = state.camera;
    const p = sceneState.pointer;
    const k = sceneState.reducedMotion ? 0 : 1;
    cam.position.x += (p.x * 0.45 * k - cam.position.x) * damp(dt, 1.4);
    cam.position.y += (p.y * 0.28 * k - cam.position.y) * damp(dt, 1.4);
    // slow push-in as the sculpture forms
    const z = 9.6 - sceneState.formation * 1.1;
    cam.position.z += (z - cam.position.z) * damp(dt, 1);
    cam.lookAt(0, 0, -1);
  });
  return null;
}

export default function Scene({ quality: initialQuality, mobile }: { quality: Quality; mobile: boolean }) {
  // Adaptive quality: if the device cannot hold frame rate, drop the transmission glass and resolution.
  const [quality, setQuality] = useState<Quality>(initialQuality);
  const [dpr, setDpr] = useState(mobile ? 1.5 : 1.75);
  return (
    <Canvas
      className="!fixed inset-0 !h-[100lvh] !w-screen"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      dpr={[1, dpr]}
      camera={{ fov: 32, position: [0, 0, 9.6], near: 0.1, far: 80 }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      aria-hidden
      data-testid="webgl-canvas"
    >
      <PerformanceMonitor
        flipflops={2}
        onDecline={() => {
          setQuality("low");
          setDpr(1);
        }}
      />
      <color attach="background" args={["#030406"]} />
      <fog attach="fog" args={["#030406", 12, 34]} />
      <ambientLight intensity={0.12} />
      <directionalLight position={[-4, 5, 3]} intensity={0.8} color="#edf2f8" />
      <spotLight position={[6, 2, -4]} angle={0.5} penumbra={1} intensity={30} color="#287bff" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.6} color="#ffffff" position={[0, 5, -2]} rotation-x={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#edf2f8" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[2, 7, 1]} />
        <Lightformer form="rect" intensity={5} color="#287bff" position={[5, 0, 0]} rotation-y={-Math.PI / 2} scale={[3, 8, 1]} />
        <Lightformer form="ring" intensity={1.6} color="#8fcbff" position={[0, 0, -7]} scale={4} />
      </Environment>
      <DistantLight />
      <Particles count={mobile ? 500 : 1800} />
      <Sculpture quality={quality} mobile={mobile} />
      <CameraRig />
    </Canvas>
  );
}
