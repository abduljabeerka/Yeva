'use client';

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

export interface ElasticFrameProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
  borderColor?: string;
  glowColor?: string;
  veilColor?: string;
  borderWidth?: number;
  elasticity?: number;
  stiffness?: number;
  damping?: number;
  maxDisplacement?: number;
  pointerRadius?: number;
  glowIntensity?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

interface Point2D {
  x: number;
  y: number;
}

interface ControlPoint {
  x0: number; // Rest X
  y0: number; // Rest Y
  nx: number; // Outward unit normal X
  ny: number; // Outward unit normal Y
}

/**
 * Generates equidistant sample points and outward unit normals
 * along a rounded rectangle perimeter.
 */
function generateRoundedRectPoints(
  w: number,
  h: number,
  r: number,
  totalPoints: number = 64
): ControlPoint[] {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  const straightW = w - 2 * radius;
  const straightH = h - 2 * radius;
  const cornerArc = (Math.PI / 2) * radius;

  // 8 segments: Top, TR, Right, BR, Bottom, BL, Left, TL
  const segLengths = [
    straightW,
    cornerArc,
    straightH,
    cornerArc,
    straightW,
    cornerArc,
    straightH,
    cornerArc,
  ];

  const perimeter = segLengths.reduce((a, b) => a + b, 0);
  if (perimeter <= 0) return [];

  const step = perimeter / totalPoints;
  const points: ControlPoint[] = [];

  for (let i = 0; i < totalPoints; i++) {
    const s = i * step;

    // Determine which segment s falls into
    let accumulated = 0;
    let segIndex = 0;
    let distInSeg = 0;

    for (let j = 0; j < segLengths.length; j++) {
      if (s < accumulated + segLengths[j]) {
        segIndex = j;
        distInSeg = s - accumulated;
        break;
      }
      accumulated += segLengths[j];
    }

    let x = 0;
    let y = 0;
    let nx = 0;
    let ny = 0;

    switch (segIndex) {
      case 0: // Top straight edge (left to right)
        x = radius + distInSeg;
        y = 0;
        nx = 0;
        ny = -1;
        break;

      case 1: { // Top-Right corner (angle -PI/2 to 0)
        const angle = -Math.PI / 2 + (distInSeg / cornerArc) * (Math.PI / 2);
        const cx = w - radius;
        const cy = radius;
        x = cx + radius * Math.cos(angle);
        y = cy + radius * Math.sin(angle);
        nx = Math.cos(angle);
        ny = Math.sin(angle);
        break;
      }

      case 2: // Right straight edge (top to bottom)
        x = w;
        y = radius + distInSeg;
        nx = 1;
        ny = 0;
        break;

      case 3: { // Bottom-Right corner (angle 0 to PI/2)
        const angle = 0 + (distInSeg / cornerArc) * (Math.PI / 2);
        const cx = w - radius;
        const cy = h - radius;
        x = cx + radius * Math.cos(angle);
        y = cy + radius * Math.sin(angle);
        nx = Math.cos(angle);
        ny = Math.sin(angle);
        break;
      }

      case 4: // Bottom straight edge (right to left)
        x = w - radius - distInSeg;
        y = h;
        nx = 0;
        ny = 1;
        break;

      case 5: { // Bottom-Left corner (angle PI/2 to PI)
        const angle = Math.PI / 2 + (distInSeg / cornerArc) * (Math.PI / 2);
        const cx = radius;
        const cy = h - radius;
        x = cx + radius * Math.cos(angle);
        y = cy + radius * Math.sin(angle);
        nx = Math.cos(angle);
        ny = Math.sin(angle);
        break;
      }

      case 6: // Left straight edge (bottom to top)
        x = 0;
        y = h - radius - distInSeg;
        nx = -1;
        ny = 0;
        break;

      case 7: { // Top-Left corner (angle PI to 3*PI/2)
        const angle = Math.PI + (distInSeg / cornerArc) * (Math.PI / 2);
        const cx = radius;
        const cy = radius;
        x = cx + radius * Math.cos(angle);
        y = cy + radius * Math.sin(angle);
        nx = Math.cos(angle);
        ny = Math.sin(angle);
        break;
      }
    }

    points.push({ x0: x, y0: y, nx, ny });
  }

  return points;
}

/**
 * Converts an array of 2D points into a continuous, smooth quadratic Bezier SVG path
 */
function pointsToSvgPath(points: Point2D[]): string {
  const len = points.length;
  if (len < 3) return '';

  const mid = (p1: Point2D, p2: Point2D) => ({
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  });

  const firstMid = mid(points[len - 1], points[0]);
  let d = `M ${firstMid.x.toFixed(2)},${firstMid.y.toFixed(2)}`;

  for (let i = 0; i < len; i++) {
    const next = (i + 1) % len;
    const m = mid(points[i], points[next]);
    d += ` Q ${points[i].x.toFixed(2)},${points[i].y.toFixed(2)} ${m.x.toFixed(2)},${m.y.toFixed(2)}`;
  }

  return d + ' Z';
}

/**
 * Reversible path for building the translucent veil between rest and deformed shape
 */
function pointsToReversedSvgPath(points: Point2D[]): string {
  const len = points.length;
  if (len < 3) return '';

  const reversed = [...points].reverse();
  const mid = (p1: Point2D, p2: Point2D) => ({
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  });

  const firstMid = mid(reversed[len - 1], reversed[0]);
  let d = `M ${firstMid.x.toFixed(2)},${firstMid.y.toFixed(2)}`;

  for (let i = 0; i < len; i++) {
    const next = (i + 1) % len;
    const m = mid(reversed[i], reversed[next]);
    d += ` Q ${reversed[i].x.toFixed(2)},${reversed[i].y.toFixed(2)} ${m.x.toFixed(2)},${m.y.toFixed(2)}`;
  }

  return d + ' Z';
}

export default function ElasticFrame({
  width = '100%',
  height = 'auto',
  borderRadius = 20,
  borderColor = 'rgba(23, 24, 61, 0.45)',
  glowColor = 'rgba(212, 163, 89, 0.45)',
  veilColor = 'rgba(212, 163, 89, 0.12)',
  borderWidth = 1.75,
  elasticity = 0.85,
  stiffness = 0.12,
  damping = 0.82,
  maxDisplacement = 28,
  pointerRadius = 95,
  glowIntensity = 0.7,
  className = '',
  style = {},
  children,
}: ElasticFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const filterId = useId().replace(/:/g, '');

  const [dimensions, setDimensions] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [deformedPathD, setDeformedPathD] = useState<string>('');
  const [veilPathD, setVeilPathD] = useState<string>('');
  const [activeGlow, setActiveGlow] = useState<number>(0);
  const [pointerLocal, setPointerLocal] = useState<{ x: number; y: number } | null>(null);

  // Physics simulation buffers
  const controlPointsRef = useRef<ControlPoint[]>([]);
  const restPointsRef = useRef<Point2D[]>([]);
  const currentDisplacementsRef = useRef<Float32Array>(new Float32Array(0));
  const velocitiesRef = useRef<Float32Array>(new Float32Array(0));
  const targetDisplacementsRef = useRef<Float32Array>(new Float32Array(0));

  const isPointerInsideRef = useRef(false);
  const pointerPosRef = useRef<{ x: number; y: number } | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const prefersReducedMotionRef = useRef(false);

  // Measure card dimensions on mount and resize
  useEffect(() => {
    if (typeof window !== 'undefined') {
      prefersReducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);

      if (w > 0 && h > 0 && (w !== dimensions.w || h !== dimensions.h)) {
        setDimensions({ w, h });

        const pts = generateRoundedRectPoints(w, h, borderRadius, 64);
        controlPointsRef.current = pts;
        restPointsRef.current = pts.map(p => ({ x: p.x0, y: p.y0 }));

        const len = pts.length;
        currentDisplacementsRef.current = new Float32Array(len);
        velocitiesRef.current = new Float32Array(len);
        targetDisplacementsRef.current = new Float32Array(len);

        const restPath = pointsToSvgPath(restPointsRef.current);
        setDeformedPathD(restPath);
        setVeilPathD('');
      }
    };

    updateSize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => updateSize());
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      if (resizeObserver) resizeObserver.disconnect();
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [borderRadius, dimensions.w, dimensions.h]);

  // Physics animation tick
  const stepPhysics = useCallback(() => {
    const pts = controlPointsRef.current;
    const len = pts.length;
    if (len === 0) return;

    const currentD = currentDisplacementsRef.current;
    const velocities = velocitiesRef.current;
    const targetD = targetDisplacementsRef.current;

    // Update target displacements based on pointer position
    const pointer = pointerPosRef.current;
    const isInside = isPointerInsideRef.current;

    if (pointer && isInside && !prefersReducedMotionRef.current) {
      const px = pointer.x;
      const py = pointer.y;

      for (let i = 0; i < len; i++) {
        const pt = pts[i];
        const dx = px - pt.x0;
        const dy = py - pt.y0;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Outward projection along normal
        const outwardProj = dx * pt.nx + dy * pt.ny;

        if (dist < pointerRadius && outwardProj > -18) {
          // Smooth bell falloff
          const sigma = pointerRadius * 0.44;
          const gaussian = Math.exp(-(dist * dist) / (2 * sigma * sigma));
          const directionFactor = Math.max(0, Math.min(1, (outwardProj + 18) / (pointerRadius * 0.75)));
          targetD[i] = maxDisplacement * elasticity * gaussian * directionFactor;
        } else {
          targetD[i] = 0;
        }
      }
    } else {
      // Recoil to zero when pointer leaves
      for (let i = 0; i < len; i++) {
        targetD[i] = 0;
      }
    }

    // Integrate spring physics
    let maxMovement = 0;
    const displacedPoints: Point2D[] = new Array(len);

    for (let i = 0; i < len; i++) {
      if (prefersReducedMotionRef.current) {
        currentD[i] = 0;
      } else {
        const force = (targetD[i] - currentD[i]) * stiffness;
        velocities[i] = (velocities[i] + force) * damping;
        currentD[i] += velocities[i];
      }

      const disp = currentD[i];
      maxMovement = Math.max(maxMovement, Math.abs(disp), Math.abs(velocities[i]));

      displacedPoints[i] = {
        x: pts[i].x0 + disp * pts[i].nx,
        y: pts[i].y0 + disp * pts[i].ny,
      };
    }

    // Update active glow intensity
    const normalizedMaxDisp = Math.min(1, maxMovement / (maxDisplacement * 0.7));
    setActiveGlow(normalizedMaxDisp);

    // Render paths
    const newPath = pointsToSvgPath(displacedPoints);
    setDeformedPathD(newPath);

    // If stretched outward noticeably, build the translucent veil
    if (normalizedMaxDisp > 0.08 && restPointsRef.current.length > 0) {
      const restRevPath = pointsToReversedSvgPath(restPointsRef.current);
      setVeilPathD(`${newPath} ${restRevPath}`);
    } else {
      setVeilPathD('');
    }

    // Continue loop if still moving or pointer is inside
    if (maxMovement > 0.04 || isInside) {
      animFrameIdRef.current = requestAnimationFrame(stepPhysics);
    } else {
      animFrameIdRef.current = null;
    }
  }, [damping, elasticity, maxDisplacement, pointerRadius, stiffness]);

  const wakeAnimation = useCallback(() => {
    if (!animFrameIdRef.current) {
      animFrameIdRef.current = requestAnimationFrame(stepPhysics);
    }
  }, [stepPhysics]);

  // Pointer event handlers
  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerInsideRef.current = true;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      pointerPosRef.current = pos;
      setPointerLocal(pos);
    }
    wakeAnimation();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      pointerPosRef.current = pos;
      setPointerLocal(pos);
    }
    wakeAnimation();
  };

  const handlePointerLeave = () => {
    isPointerInsideRef.current = false;
    pointerPosRef.current = null;
    setPointerLocal(null);
    wakeAnimation();
  };

  // Touch event support for tablet and mobile
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0 && containerRef.current) {
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const pos = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
      isPointerInsideRef.current = true;
      pointerPosRef.current = pos;
      setPointerLocal(pos);
      wakeAnimation();
    }
  };

  const handleTouchEnd = () => {
    isPointerInsideRef.current = false;
    pointerPosRef.current = null;
    setPointerLocal(null);
    wakeAnimation();
  };

  // Bounding box padding for SVG overlay so the elastic stretch has room to expand
  const pad = maxDisplacement + 16;
  const svgW = dimensions.w + pad * 2;
  const svgH = dimensions.h + pad * 2;

  return (
    <div
      ref={containerRef}
      className={`elastic-frame-wrapper ${className}`}
      style={{
        width,
        height,
        position: 'relative',
        borderRadius: `${borderRadius}px`,
        ...style,
      }}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Layer 1: Undistorted Central Card Content */}
      <div
        className="elastic-frame-content-layer"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: `${borderRadius}px`,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {children}
      </div>

      {/* Layer 2, 3, 4: Elastic SVG Border, Translucent Veil, and Ambient Glow */}
      {dimensions.w > 0 && dimensions.h > 0 && (
        <svg
          className="elastic-frame-svg-overlay"
          width={svgW}
          height={svgH}
          viewBox={`${-pad} ${-pad} ${svgW} ${svgH}`}
          style={{
            position: 'absolute',
            top: -pad,
            left: -pad,
            width: svgW,
            height: svgH,
            pointerEvents: 'none',
            zIndex: 4,
            overflow: 'visible',
          }}
          aria-hidden="true"
        >
          <defs>
            {/* Soft Ambient Glow Filter */}
            <filter id={`elastic-glow-${filterId}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Subtle Pointer Radial Highlight */}
            {pointerLocal && (
              <radialGradient
                id={`veil-gradient-${filterId}`}
                cx={pointerLocal.x}
                cy={pointerLocal.y}
                r={pointerRadius}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor={veilColor} stopOpacity={0.85 * glowIntensity} />
                <stop offset="50%" stopColor={glowColor} stopOpacity={0.4 * glowIntensity} />
                <stop offset="100%" stopColor={veilColor} stopOpacity={0} />
              </radialGradient>
            )}
          </defs>

          {/* Translucent Glowing Veil Between Original & Displaced Edge */}
          {veilPathD && (
            <path
              d={veilPathD}
              fill={`url(#veil-gradient-${filterId})`}
              fillRule="evenodd"
              className="elastic-frame-veil-mesh"
            />
          )}

          {/* Diffused Outer Luminous Glow */}
          {activeGlow > 0.05 && (
            <path
              d={deformedPathD}
              fill="none"
              stroke={glowColor}
              strokeWidth={borderWidth * 2.8}
              strokeOpacity={activeGlow * glowIntensity * 0.75}
              filter={`url(#elastic-glow-${filterId})`}
              className="elastic-frame-glow-stroke"
            />
          )}

          {/* Core Elastic Membrane Stroke */}
          <path
            d={deformedPathD}
            fill="none"
            stroke={borderColor}
            strokeWidth={borderWidth}
            className="elastic-frame-core-border"
          />

          {/* Localized Bright Highlight Near Pointer */}
          {pointerLocal && activeGlow > 0.1 && (
            <circle
              cx={pointerLocal.x}
              cy={pointerLocal.y}
              r={24}
              fill={glowColor}
              opacity={activeGlow * 0.15}
              filter={`url(#elastic-glow-${filterId})`}
            />
          )}
        </svg>
      )}
    </div>
  );
}
