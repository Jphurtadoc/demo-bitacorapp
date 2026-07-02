import { useEffect } from 'react';

type CloseHandler = () => void;

const stack: CloseHandler[] = [];
let listening = false;

function handleKeyDown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return;

  const top = stack[stack.length - 1];
  if (!top) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  top();
}

function ensureListening() {
  if (listening) return;
  window.addEventListener('keydown', handleKeyDown, true);
  listening = true;
}

function stopListeningIfEmpty() {
  if (stack.length === 0 && listening) {
    window.removeEventListener('keydown', handleKeyDown, true);
    listening = false;
  }
}

export function pushOverlayEscape(onClose: CloseHandler): () => void {
  ensureListening();
  stack.push(onClose);

  return () => {
    const index = stack.lastIndexOf(onClose);
    if (index !== -1) stack.splice(index, 1);
    stopListeningIfEmpty();
  };
}

export function useOverlayEscape(open: boolean, onClose: CloseHandler) {
  useEffect(() => {
    if (!open) return;
    return pushOverlayEscape(onClose);
  }, [open, onClose]);
}
