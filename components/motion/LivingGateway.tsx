"use client";

import { useId, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { usePlaybackGate } from "@/lib/motion/usePlaybackGate";

export type LivingGatewayVariant = "haven" | "ydg" | "cta";

const MAIN_PATH =
  "M90 292C168 292 196 214 248 188C318 154 368 128 500 108C632 128 682 154 752 188C804 214 832 292 910 292";
const HAVEN_ARCH = "M78 318C210 118 360 62 500 58C640 62 790 118 922 318";
const BRANCH_A = "M248 188C330 248 430 268 500 108";
const BRANCH_B = "M752 188C680 248 560 274 500 108";
const RETURN_PATH = "M910 292C780 360 620 368 248 188";
const CTA_PATH = "M70 70C190 70 250 70 360 70C500 70 640 70 750 70C830 70 880 70 930 70";
const RIBBON_PERIMETER =
  "M36 398C70 250 140 54 500 22C860 54 930 250 964 398C790 418 210 418 36 398";
const RIBBON_GATEWAY = "M70 352C200 92 350 18 500 14C650 18 800 92 930 352";
const RIBBON_IMAGE = "M548 404C600 290 680 118 820 64C920 24 974 128 982 268C968 356 820 398 548 404";

const NODES = [
  { x: 90, y: 292 },
  { x: 248, y: 188 },
  { x: 368, y: 128 },
  { x: 500, y: 108 },
  { x: 632, y: 128 },
  { x: 752, y: 188 },
  { x: 910, y: 292 },
] as const;

const CTA_NODES = [
  { x: 70, y: 70 },
  { x: 210, y: 70 },
  { x: 350, y: 70 },
  { x: 500, y: 70 },
  { x: 650, y: 70 },
  { x: 790, y: 70 },
  { x: 930, y: 70 },
] as const;

export function LivingGateway({
  variant,
  className,
}: {
  variant: LivingGatewayVariant;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const paused = usePlaybackGate(ref);
  const compact = variant === "cta";
  const nodes = compact ? CTA_NODES : NODES;
  const mainPath = compact ? CTA_PATH : MAIN_PATH;

  return (
    <div
      ref={ref}
      className={cn("mh-gateway", `mh-gateway-${variant}`, paused && "is-paused", className)}
      aria-hidden="true"
      data-gateway={variant}
    >
      <svg
        className="mh-gateway-svg"
        viewBox={compact ? "0 0 1000 140" : "0 0 1000 420"}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
      >
        <defs>
          <linearGradient id={`${uid}-stroke`} x1="80" y1="80" x2="920" y2="340" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--mh-gateway-from)" />
            <stop offset="0.5" stopColor="var(--mh-gateway-mid)" />
            <stop offset="1" stopColor="var(--mh-gateway-to)" />
          </linearGradient>
          <linearGradient id={`${uid}-ribbon`} x1="40" y1="20" x2="960" y2="400" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--mh-gateway-ribbon-from)" />
            <stop offset="0.48" stopColor="var(--mh-gateway-ribbon-mid)" />
            <stop offset="1" stopColor="var(--mh-gateway-ribbon-to)" />
          </linearGradient>
          <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`${uid}-glow`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {!compact ? (
          <g className="mh-gateway-ribbons" filter={`url(#${uid}-soft)`}>
            <path className="mh-gateway-ribbon mh-gateway-ribbon-a" d={RIBBON_PERIMETER} stroke={`url(#${uid}-ribbon)`} />
            <path className="mh-gateway-ribbon mh-gateway-ribbon-b" d={RIBBON_GATEWAY} stroke={`url(#${uid}-ribbon)`} />
            <path className="mh-gateway-ribbon mh-gateway-ribbon-c" d={RIBBON_IMAGE} stroke={`url(#${uid}-ribbon)`} />
          </g>
        ) : null}

        {!compact ? <path className="mh-gateway-arch" d={HAVEN_ARCH} stroke={`url(#${uid}-stroke)`} /> : null}
        <path className="mh-gateway-main" d={mainPath} stroke={`url(#${uid}-stroke)`} />
        {!compact ? (
          <>
            <path className="mh-gateway-branch mh-gateway-branch-a" d={BRANCH_A} stroke={`url(#${uid}-stroke)`} />
            <path className="mh-gateway-branch mh-gateway-branch-b" d={BRANCH_B} stroke={`url(#${uid}-stroke)`} />
            <path className="mh-gateway-return" d={RETURN_PATH} stroke={`url(#${uid}-stroke)`} />
          </>
        ) : null}

        <circle className="mh-gateway-pulse mh-gateway-pulse-a" r={compact ? 2.4 : 4.2} />
        {!compact ? <circle className="mh-gateway-pulse mh-gateway-pulse-b" r="3.4" /> : null}
        {variant === "ydg" ? <circle className="mh-gateway-pulse mh-gateway-pulse-c" r="3.2" /> : null}

        <g filter={`url(#${uid}-glow)`}>
          {nodes.map((node, index) => (
            <circle
              key={`${node.x}-${node.y}`}
              className="mh-gateway-node"
              cx={node.x}
              cy={node.y}
              r={compact ? 4.2 : 7.2}
              style={{ "--node-i": index } as CSSProperties}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
