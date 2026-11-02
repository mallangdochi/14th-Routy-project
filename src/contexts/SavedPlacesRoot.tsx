import type { ReactNode } from "react";

import { useAuth } from "./AuthContext";
import { SavedPlacesProvider } from "./SavedPlacesContext";

type Props = {
  children: ReactNode;
};

export default function SavedPlacesRoot({ children }: Props) {
  const { user } = useAuth();

  return (
    <SavedPlacesProvider userId={user?.id ?? null}>
      {children}
    </SavedPlacesProvider>
  );
}
