import { useSyncExternalStore } from 'react';

const TEXT_INPUT = 'input:not([type=checkbox], [type=radio], [type=date], [type=file]), textarea';

// Клавиатура открыта, если в фокусе текстовое поле и видимая область заметно ниже экрана:
// так ловим и случай, когда клавиатуру спрятали кнопкой «назад», а фокус остался в поле.
const getSnapshot = () => {
  if (!window.matchMedia('(pointer: coarse)').matches) return false;
  const active = document.activeElement;
  if (!(active instanceof HTMLElement) || !active.matches(TEXT_INPUT)) return false;
  const height = window.visualViewport?.height ?? window.innerHeight;
  return height < window.screen.height * 0.75;
};

const subscribe = (onChange: () => void) => {
  document.addEventListener('focusin', onChange);
  document.addEventListener('focusout', onChange);
  window.visualViewport?.addEventListener('resize', onChange);
  return () => {
    document.removeEventListener('focusin', onChange);
    document.removeEventListener('focusout', onChange);
    window.visualViewport?.removeEventListener('resize', onChange);
  };
};

/** Экранная клавиатура на телефоне: пока она открыта, нижняя навигация уступает ей место. */
export const useKeyboardOpen = (): boolean => useSyncExternalStore(subscribe, getSnapshot);
