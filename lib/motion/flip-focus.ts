export type FlipFocusIntent = "front" | "back";

export function isUsableFlipFocusTarget(
  element: HTMLElement | null,
): element is HTMLElement {
  return Boolean(element?.isConnected && !element.closest("[inert]"));
}

export function resolveOwnedFlipFocusTarget({
  intent,
  flipped,
  front,
  back,
}: {
  intent: FlipFocusIntent | null;
  flipped: boolean;
  front: HTMLElement | null;
  back: HTMLElement | null;
}): HTMLElement | null {
  if (!intent) {
    return null;
  }

  const target = intent === "back" && flipped ? back : intent === "front" && !flipped ? front : null;
  return isUsableFlipFocusTarget(target) ? target : null;
}

export function moveOwnedFlipFocus(element: HTMLElement | null): void {
  if (!isUsableFlipFocusTarget(element)) {
    return;
  }

  element.focus();
}
