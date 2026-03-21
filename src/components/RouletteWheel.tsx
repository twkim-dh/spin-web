"use client";

import { useRef, useEffect, useCallback, useState } from "react";

const COLORS = [
  "#FF6B6B", "#FFA06B", "#FFD93D", "#6BCB77",
  "#4ECDC4", "#45B7D1", "#6B8BFF", "#A06BFF",
  "#FF6BB5", "#FF8E53", "#29CDCF", "#8B6BFF",
];

interface RouletteWheelProps {
  items: string[];
  spinning: boolean;
  onResult: (result: string) => void;
  onSpinEnd: () => void;
}

export default function RouletteWheel({
  items,
  spinning,
  onResult,
  onSpinEnd,
}: RouletteWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const spinningRef = useRef(false);
  const animFrameRef = useRef<number>(0);
  const [canvasSize, setCanvasSize] = useState(320);

  const getColor = (index: number) => COLORS[index % COLORS.length];

  const drawWheel = useCallback(
    (ctx: CanvasRenderingContext2D, size: number, rotation: number) => {
      const center = size / 2;
      const radius = center - 12;
      const sliceAngle = (2 * Math.PI) / items.length;

      ctx.clearRect(0, 0, size, size);

      // Draw shadow
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 4;
      ctx.beginPath();
      ctx.arc(center, center, radius + 4, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.restore();

      // Draw slices
      items.forEach((item, i) => {
        const startAngle = rotation + i * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        // Slice fill
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = getColor(i);
        ctx.fill();

        // Slice border
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Text
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(startAngle + sliceAngle / 2);

        const textRadius = radius * 0.65;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.lineWidth = 3;

        // Dynamic font size based on number of items and canvas size
        const baseFontSize = size / 22;
        const maxLen = 6;
        const fontSize = item.length > maxLen
          ? baseFontSize * (maxLen / item.length)
          : baseFontSize;
        ctx.font = `bold ${Math.max(10, fontSize)}px 'Noto Sans KR', sans-serif`;

        ctx.strokeText(item, textRadius, 0);
        ctx.fillText(item, textRadius, 0);
        ctx.restore();
      });

      // Center circle
      ctx.beginPath();
      ctx.arc(center, center, radius * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = "#FFC107";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Outer ring
      ctx.beginPath();
      ctx.arc(center, center, radius + 4, 0, Math.PI * 2);
      ctx.strokeStyle = "#FFC107";
      ctx.lineWidth = 6;
      ctx.stroke();

      // Pointer (top center)
      const pointerSize = size * 0.05;
      ctx.beginPath();
      ctx.moveTo(center, 2);
      ctx.lineTo(center - pointerSize, -pointerSize * 0.5);
      ctx.lineTo(center + pointerSize, -pointerSize * 0.5);
      ctx.closePath();
      ctx.fillStyle = "#FF5252";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Larger pointer indicator
      ctx.beginPath();
      ctx.moveTo(center, 0);
      ctx.lineTo(center - pointerSize * 1.2, -pointerSize * 1.2);
      ctx.lineTo(center + pointerSize * 1.2, -pointerSize * 1.2);
      ctx.closePath();
      ctx.fillStyle = "#FF5252";
      ctx.fill();
    },
    [items]
  );

  // Handle resize
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 40, 360);
      setCanvasSize(maxWidth);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Draw static wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    ctx.scale(dpr, dpr);

    drawWheel(ctx, canvasSize, angleRef.current);
  }, [items, canvasSize, drawWheel]);

  // Spin animation
  useEffect(() => {
    if (!spinning || spinningRef.current) return;
    spinningRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    // Random total rotation: 5-10 full turns + random offset
    const totalRotation =
      Math.PI * 2 * (5 + Math.random() * 5) + Math.random() * Math.PI * 2;
    const duration = 3000 + Math.random() * 2000; // 3-5 seconds
    const startAngle = angleRef.current;
    const startTime = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      const currentAngle = startAngle + totalRotation * eased;
      angleRef.current = currentAngle;

      canvas.width = canvasSize * dpr;
      canvas.height = canvasSize * dpr;
      ctx.scale(dpr, dpr);
      drawWheel(ctx, canvasSize, currentAngle);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Determine result
        const sliceAngle = (2 * Math.PI) / items.length;
        // Normalize angle: pointer is at top (negative Y axis = -PI/2)
        // The angle at the pointer position
        const normalizedAngle =
          (((-currentAngle - Math.PI / 2) % (Math.PI * 2)) + Math.PI * 2) %
          (Math.PI * 2);
        const resultIndex = Math.floor(normalizedAngle / sliceAngle) % items.length;

        spinningRef.current = false;
        onResult(items[resultIndex]);
        onSpinEnd();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [spinning, items, canvasSize, drawWheel, onResult, onSpinEnd]);

  return (
    <div className="relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        style={{ width: canvasSize, height: canvasSize }}
        className="rounded-full"
      />
    </div>
  );
}
