"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type UnfoldStep = {
  label: string;
  description: string;
};

type UnfoldExplorerProps = {
  steps: readonly UnfoldStep[];
  compact?: boolean;
};

export function UnfoldExplorer({ steps, compact = false }: UnfoldExplorerProps) {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedStep = steps[selected];

  if (!selectedStep) {
    return null;
  }

  const panelId = "unfold-detail-panel";

  const moveTo = (index: number) => {
    const next = (index + steps.length) % steps.length;
    setSelected(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        moveTo(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        moveTo(index - 1);
        break;
      case "Home":
        event.preventDefault();
        moveTo(0);
        break;
      case "End":
        event.preventDefault();
        moveTo(steps.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={cn("ydg-unfold-explorer", compact && "ydg-unfold-explorer-compact")}>
      <p className="ydg-unfold-kicker">UNFOLD</p>
      <div role="tablist" aria-label="UNFOLD stages" className="ydg-unfold-tabs">
        {steps.map((step, index) => {
          const tabId = `unfold-tab-${step.label.toLowerCase()}`;
          const isSelected = index === selected;
          return (
            <button
              key={step.label}
              id={tabId}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              className={cn("ydg-unfold-tab", isSelected && "is-selected")}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span className="ydg-ustep-n" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>
      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`unfold-tab-${selectedStep.label.toLowerCase()}`}
        className="ydg-unfold-panel"
      >
        <h3 className="ydg-h3">{selectedStep.label}</h3>
        <p>{selectedStep.description}</p>
        <p className="ydg-fine">
          Participants may pause, repeat, change direction or leave. Selecting a stage does not start a journey or
          imply a guaranteed sequence.
        </p>
      </div>
    </div>
  );
}
