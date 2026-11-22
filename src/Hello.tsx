import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Smoke-test composition: confirms the Remotion → FFmpeg pipeline renders.
export const Hello: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#0b0b0c", justifyContent: "center", alignItems: "center" }}>
      <div style={{ color: "#f2f0ea", fontFamily: "sans-serif", fontSize: 140, fontWeight: 700, opacity, transform: `translateY(${(1 - s) * 60}px)` }}>
        Video Studio
      </div>
    </AbsoluteFill>
  );
};
