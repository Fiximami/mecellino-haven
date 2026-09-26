"use client";

import type { ReactNode } from "react";
import { FlipCard, FlipCardGroup } from "@/components/motion/FlipCard";

export type TrackRevealItem = {
  id: string;
  stage: string;
  title: string;
  chip: ReactNode;
  summary: string;
  description: ReactNode;
};

export function TrackRevealList({ tracks }: { tracks: readonly TrackRevealItem[] }) {
  return (
    <FlipCardGroup className="ydg-track-reveals">
      {tracks.map((track) => (
        <FlipCard
          key={track.id}
          id={track.id}
          title={track.title}
          className="ydg-track-reveal ydg-pathcard"
          controlClassName="ydg-track-reveal-control"
          front={
            <>
              <span className="ydg-trackrow-age">{track.stage}</span>
              <span className="ydg-track-reveal-title">
                <span className="ydg-h3">{track.title}</span>
                {track.chip}
              </span>
              <p className="text-[15px] leading-relaxed text-[var(--ink-2)]">{track.summary}</p>
            </>
          }
          back={
            <>
              <span className="ydg-trackrow-age">{track.stage}</span>
              <h3 className="ydg-h3">{track.title}</h3>
              <div className="text-[15px] leading-relaxed text-[var(--ink-2)]">{track.description}</div>
            </>
          }
        />
      ))}
    </FlipCardGroup>
  );
}
