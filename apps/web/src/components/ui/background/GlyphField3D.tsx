"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  type Group,
  MathUtils,
  NormalBlending,
} from "three";
import { useTheme } from "@/context/ThemeContext";
import { SceneCanvas } from "@/lib/three/SceneCanvas";

const GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
const ATLAS_COLUMNS = 8;
const ATLAS_CELL_PX = 64;
const GLYPH_COUNT = 420;
const FIELD = { width: 60, height: 40, near: 6, far: -36 };
const OPACITY = { dark: 0.55, light: 0.4 };

const vertexShader = /* glsl */ `
  attribute float glyph;
  attribute float speed;
  uniform float uTime;
  uniform float uSize;
  varying float vGlyph;
  varying float vFade;

  void main() {
    vec3 p = position;
    float depth = ${(FIELD.near - FIELD.far).toFixed(1)};
    p.z = ${FIELD.far.toFixed(1)} + mod(p.z - ${FIELD.far.toFixed(1)} + uTime * speed, depth);
    p.y = mod(p.y + ${(FIELD.height / 2).toFixed(1)} - uTime * speed * 0.35, ${FIELD.height.toFixed(1)}) - ${(FIELD.height / 2).toFixed(1)};
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float viewDistance = -mv.z;
    gl_PointSize = clamp(uSize * 14.0 / viewDistance, 6.0, 44.0);
    vGlyph = glyph;
    vFade = (1.0 - smoothstep(28.0, 46.0, viewDistance)) * smoothstep(1.0, 5.0, viewDistance);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vGlyph;
  varying float vFade;

  void main() {
    float columns = ${ATLAS_COLUMNS.toFixed(1)};
    vec2 cell = vec2(mod(vGlyph, columns), floor(vGlyph / columns));
    vec2 uv = vec2((cell.x + gl_PointCoord.x) / columns, 1.0 - (cell.y + gl_PointCoord.y) / columns);
    float alpha = texture2D(uAtlas, uv).a * uOpacity * vFade;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

function createAtlas(): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = ATLAS_COLUMNS * ATLAS_CELL_PX;
  canvas.height = ATLAS_COLUMNS * ATLAS_CELL_PX;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = "#ffffff";
    context.font = `${ATLAS_CELL_PX * 0.72}px monospace`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    [...GLYPHS].forEach((char, index) => {
      const x = (index % ATLAS_COLUMNS) * ATLAS_CELL_PX + ATLAS_CELL_PX / 2;
      const y = Math.floor(index / ATLAS_COLUMNS) * ATLAS_CELL_PX + ATLAS_CELL_PX / 2;
      context.fillText(char, x, y);
    });
  }
  return new CanvasTexture(canvas);
}

function createField(): BufferGeometry {
  const positions = new Float32Array(GLYPH_COUNT * 3);
  const glyphs = new Float32Array(GLYPH_COUNT);
  const speeds = new Float32Array(GLYPH_COUNT);
  for (let i = 0; i < GLYPH_COUNT; i++) {
    positions[i * 3] = MathUtils.randFloatSpread(FIELD.width);
    positions[i * 3 + 1] = MathUtils.randFloatSpread(FIELD.height);
    positions[i * 3 + 2] = MathUtils.randFloat(FIELD.far, FIELD.near);
    glyphs[i] = Math.floor(Math.random() * GLYPHS.length);
    speeds[i] = MathUtils.randFloat(0.6, 1.8);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("glyph", new BufferAttribute(glyphs, 1));
  geometry.setAttribute("speed", new BufferAttribute(speeds, 1));
  return geometry;
}

function readTerminalGreen(): Color {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--terminal-green").trim();
  return new Color(value || "#4ade80");
}

function Field({ theme }: { theme: "light" | "dark" }) {
  const group = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const geometry = useMemo(createField, []);
  const uniforms = useMemo(
    () => ({
      uAtlas: { value: createAtlas() },
      uColor: { value: new Color() },
      uOpacity: { value: OPACITY.dark },
      uSize: { value: 30 },
      uTime: { value: 0 },
    }),
    []
  );

  useEffect(() => {
    uniforms.uColor.value.copy(readTerminalGreen());
    uniforms.uOpacity.value = OPACITY[theme];
  }, [theme, uniforms]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      uniforms.uAtlas.value.dispose();
    },
    [geometry, uniforms]
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
    const scene = group.current;
    if (scene) {
      scene.rotation.y = MathUtils.lerp(scene.rotation.y, pointer.current.x * 0.06, 0.03);
      scene.rotation.x = MathUtils.lerp(scene.rotation.x, pointer.current.y * 0.04, 0.03);
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={theme === "dark" ? AdditiveBlending : NormalBlending}
        />
      </points>
    </group>
  );
}

export default function GlyphField3D() {
  const { resolvedTheme } = useTheme();

  return (
    <SceneCanvas
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      camera={{ position: [0, 0, 12], fov: 60 }}
    >
      <Field theme={resolvedTheme} />
    </SceneCanvas>
  );
}
