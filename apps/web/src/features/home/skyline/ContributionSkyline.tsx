"use client";

import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { BoxGeometry, Color, type Group, type InstancedMesh, MathUtils, Matrix4, Quaternion, Vector3 } from "three";
import { useTheme } from "@/context/ThemeContext";
import { SceneCanvas } from "@/lib/three/SceneCanvas";
import { type ContributionDay, formatContributionCount, formatContributionDate } from "../contributionCalendar";
import {
  buildSkyline,
  SKYLINE_CAMERA_ELEVATION,
  SKYLINE_CAMERA_FOV,
  SKYLINE_MAX_HEIGHT,
  type SkylineBar,
  type SkylineLayout,
  skylineCameraDistance,
} from "./skylineLayout";

const LEVEL_COLORS = {
  dark: ["#232833", "#6b3418", "#a8461b", "#e2561d", "#ff7a3d"],
  light: ["#d9dce1", "#fed7aa", "#fdba74", "#fb923c", "#ff5f1f"],
} as const;

const BAR_FOOTPRINT = 0.82;

type HoveredBar = { bar: SkylineBar; x: number; y: number } | null;

function levelColor(palette: readonly string[], level: number): string {
  return palette[Math.min(level, palette.length - 1)] ?? palette[0] ?? "#000000";
}

function CameraRig({ layout }: { layout: SkylineLayout }) {
  const camera = useThree((state) => state.camera);
  const aspect = useThree((state) => state.size.width / Math.max(state.size.height, 1));

  useLayoutEffect(() => {
    const distance = skylineCameraDistance(layout, aspect);
    camera.position.set(
      0,
      distance * Math.sin(SKYLINE_CAMERA_ELEVATION),
      distance * Math.cos(SKYLINE_CAMERA_ELEVATION)
    );
    camera.lookAt(0, SKYLINE_MAX_HEIGHT / 5, 0);
  }, [camera, layout, aspect]);

  return null;
}

function Bars({
  layout,
  palette,
  onHover,
}: {
  layout: SkylineLayout;
  palette: readonly string[];
  onHover: (hovered: HoveredBar) => void;
}) {
  const group = useRef<Group>(null);
  const mesh = useRef<InstancedMesh>(null);
  const geometry = useMemo(() => new BoxGeometry(1, 1, 1).translate(0, 0.5, 0), []);

  useLayoutEffect(() => {
    const instances = mesh.current;
    if (!instances) {
      return;
    }
    const matrix = new Matrix4();
    const rotation = new Quaternion();
    const color = new Color();
    layout.bars.forEach((bar, index) => {
      matrix.compose(new Vector3(bar.x, 0, bar.z), rotation, new Vector3(BAR_FOOTPRINT, bar.height, BAR_FOOTPRINT));
      instances.setMatrixAt(index, matrix);
      instances.setColorAt(index, color.set(levelColor(palette, bar.day.level)));
    });
    instances.instanceMatrix.needsUpdate = true;
    if (instances.instanceColor) {
      instances.instanceColor.needsUpdate = true;
    }
    instances.computeBoundingSphere();
  }, [layout, palette]);

  useFrame(({ clock, pointer }) => {
    const scene = group.current;
    if (!scene) {
      return;
    }
    const drift = Math.sin(clock.elapsedTime * 0.2) * 0.12;
    scene.rotation.y = MathUtils.lerp(scene.rotation.y, drift + pointer.x * 0.25, 0.05);
    scene.rotation.x = MathUtils.lerp(scene.rotation.x, -pointer.y * 0.08, 0.05);
  });

  const hover = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const bar = event.instanceId === undefined ? undefined : layout.bars[event.instanceId];
    onHover(bar ? { bar, x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY } : null);
  };

  return (
    <group ref={group}>
      <instancedMesh
        ref={mesh}
        args={[geometry, undefined, layout.bars.length]}
        onPointerMove={hover}
        onPointerOut={() => onHover(null)}
      >
        <meshStandardMaterial roughness={0.5} metalness={0.15} />
      </instancedMesh>
    </group>
  );
}

type ContributionSkylineProps = {
  contributions: ContributionDay[];
  label: string;
};

export default function ContributionSkyline({ contributions, label }: ContributionSkylineProps) {
  const { resolvedTheme } = useTheme();
  const layout = useMemo(() => buildSkyline(contributions), [contributions]);
  const [hovered, setHovered] = useState<HoveredBar>(null);

  return (
    <div className="relative" role="img" aria-label={label}>
      <SceneCanvas className="h-[260px] w-full" flat camera={{ fov: SKYLINE_CAMERA_FOV }}>
        <CameraRig layout={layout} />
        <ambientLight intensity={resolvedTheme === "dark" ? 0.75 : 1.1} />
        <directionalLight position={[20, 40, 25]} intensity={1.6} />
        <Bars layout={layout} palette={LEVEL_COLORS[resolvedTheme]} onHover={setHovered} />
      </SceneCanvas>
      {hovered && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-primary/20 bg-background/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm"
          style={{ left: hovered.x + 14, top: Math.max(hovered.y - 52, 4) }}
        >
          <p className="font-mono font-medium text-foreground">{formatContributionCount(hovered.bar.day.count)}</p>
          <p className="text-muted-foreground">{formatContributionDate(hovered.bar.day.date)}</p>
        </div>
      )}
    </div>
  );
}
