"use client";

import { type Character } from "@/lib/types/character";
import {
  CHARACTER_SELECTION_COOKIE,
  CHARACTER_SELECTION_MAX_AGE,
} from "@/constants/character-selection";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface UserPanelContextValue {
  characters: Character[];
  selectedCharacter: Character | null;
  setSelectedCharacter: (character: Character | null) => void;
  selectCharacterByName: (name: string) => void;
}

const UserPanelContext = createContext<UserPanelContextValue | null>(null);

interface UserPanelProviderProps {
  children: ReactNode;
  characters: Character[];
  initialSelectedName?: string;
}

export function UserPanelProvider({
  children,
  characters,
  initialSelectedName,
}: UserPanelProviderProps) {
  const [selectedName, setSelectedName] = useState<string | null>(
    initialSelectedName ?? null,
  );
  const selectedCharacter =
    characters.find((character) => character.name === selectedName) ??
    characters[0] ??
    null;
  const setSelectedCharacter = useCallback((character: Character | null) => {
    setSelectedName(character?.name ?? null);
    document.cookie = `${CHARACTER_SELECTION_COOKIE}=${encodeURIComponent(character?.name ?? "")}; Path=/user-panel; Max-Age=${character ? CHARACTER_SELECTION_MAX_AGE : 0}; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
  }, []);

  const selectCharacterByName = useCallback(
    (name: string) => {
      const character = characters.find((c) => c.name === name) ?? null;
      setSelectedCharacter(character);
    },
    [characters, setSelectedCharacter],
  );

  return (
    <UserPanelContext.Provider
      value={{
        characters,
        selectedCharacter,
        setSelectedCharacter,
        selectCharacterByName,
      }}
    >
      {children}
    </UserPanelContext.Provider>
  );
}

export function useUserPanel() {
  const context = useContext(UserPanelContext);
  if (!context) {
    throw new Error("useUserPanel must be used within a UserPanelProvider");
  }
  return context;
}
