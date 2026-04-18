"use client";

import { Character } from "@/types/character";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
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
}

export function UserPanelProvider({
  children,
  characters,
}: UserPanelProviderProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  const selectCharacterByName = useCallback(
    (name: string) => {
      const character = characters.find((c) => c.name === name) ?? null;
      setSelectedCharacter(character);
    },
    [characters]
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
