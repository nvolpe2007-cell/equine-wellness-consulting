import { createContext, useContext, useMemo, useState, useCallback } from "react";
import type { ReactNode } from "react";

type IntroVisibilityValue = {
  introActive: boolean;
  navRevealed: boolean;
  setIntroActive: (active: boolean) => void;
  setNavRevealed: (revealed: boolean) => void;
};

const IntroVisibilityContext = createContext<IntroVisibilityValue>({
  introActive: false,
  navRevealed: true,
  setIntroActive: () => {},
  setNavRevealed: () => {},
});

export function IntroVisibilityProvider({ children }: { children: ReactNode }) {
  const [introActive, setIntroActiveState] = useState(false);
  const [navRevealed, setNavRevealedState] = useState(true);

  const setIntroActive = useCallback((active: boolean) => {
    setIntroActiveState(active);
    if (!active) setNavRevealedState(true);
    else setNavRevealedState(false);
  }, []);

  const setNavRevealed = useCallback((revealed: boolean) => {
    setNavRevealedState(revealed);
  }, []);

  const value = useMemo(
    () => ({ introActive, navRevealed, setIntroActive, setNavRevealed }),
    [introActive, navRevealed, setIntroActive, setNavRevealed],
  );

  return (
    <IntroVisibilityContext.Provider value={value}>
      {children}
    </IntroVisibilityContext.Provider>
  );
}

export function useIntroVisibility() {
  return useContext(IntroVisibilityContext);
}
