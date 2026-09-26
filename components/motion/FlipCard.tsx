"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  moveOwnedFlipFocus,
  resolveOwnedFlipFocusTarget,
  type FlipFocusIntent,
} from "@/lib/motion/flip-focus";
import { cn } from "@/lib/utils";

type FlipGroupValue = {
  openId: string | null;
  toggle: (id: string) => void;
};

const FlipGroupContext = createContext<FlipGroupValue | null>(null);

export function FlipCardGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  return (
    <FlipGroupContext.Provider value={{ openId, toggle }}>
      <div className={className}>{children}</div>
    </FlipGroupContext.Provider>
  );
}

type FlipCardProps = {
  id?: string;
  title: string;
  front: ReactNode;
  back: ReactNode;
  className?: string;
  controlClassName?: string;
  revealLabel?: string;
  returnLabel?: string;
};

export function FlipCard({
  id,
  title,
  front,
  back,
  className,
  controlClassName,
  revealLabel = "View details",
  returnLabel = "Back",
}: FlipCardProps) {
  const reactId = useId().replace(/:/g, "");
  const cardId = id ?? `flip-${reactId}`;
  const panelId = `${cardId}-details`;
  const controlId = `${cardId}-reveal`;
  const group = useContext(FlipGroupContext);
  const [localOpen, setLocalOpen] = useState(false);
  const flipped = group ? group.openId === cardId : localOpen;
  const frontTriggerRef = useRef<HTMLButtonElement>(null);
  const backTriggerRef = useRef<HTMLButtonElement>(null);
  const focusIntentRef = useRef<FlipFocusIntent | null>(null);

  const onToggle = () => {
    if (group) {
      group.toggle(cardId);
      return;
    }
    setLocalOpen((open) => !open);
  };

  const onOwnedToggle = (intent: FlipFocusIntent) => {
    focusIntentRef.current = intent;
    onToggle();
  };

  useLayoutEffect(() => {
    const intent = focusIntentRef.current;
    if (!intent) {
      return;
    }

    const target = resolveOwnedFlipFocusTarget({
      intent,
      flipped,
      front: frontTriggerRef.current,
      back: backTriggerRef.current,
    });
    focusIntentRef.current = null;
    moveOwnedFlipFocus(target);
  }, [flipped]);

  return (
    <article
      className={cn("mh-flip mh-reveal-item", flipped && "is-flipped", className)}
      data-flip-card={cardId}
    >
      <div className="mh-flip-inner">
        <div className="mh-flip-face mh-flip-front" aria-hidden={flipped} inert={flipped}>
          {front}
          <button
            ref={frontTriggerRef}
            id={controlId}
            type="button"
            className={cn("mh-flip-control", controlClassName)}
            aria-expanded={flipped}
            aria-controls={panelId}
            aria-label={`${revealLabel}: ${title}`}
            onClick={() => onOwnedToggle("back")}
          >
            {revealLabel}
          </button>
        </div>
        <div
          id={panelId}
          className="mh-flip-face mh-flip-back"
          aria-hidden={!flipped}
          inert={!flipped}
        >
          {back}
          <button
            ref={backTriggerRef}
            type="button"
            className="mh-flip-control"
            onClick={() => onOwnedToggle("front")}
          >
            {returnLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
