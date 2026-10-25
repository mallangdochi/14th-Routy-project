import { createContext, useContext } from "react";
import type { SignupState } from "./RoutySignup";

export const SignupContext = createContext<SignupState | null>(null);

export function useSignup() {
  const context = useContext(SignupContext);

  if (!context) {
    throw new Error("RoutySignupProvider가 필요합니다.");
  }

  return context;
}
