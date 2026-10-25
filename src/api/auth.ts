export async function loginWithEmail(
  email: string,
  password: string,
  remember: boolean,
): Promise<void> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      remember,
    }),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data !== null &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "로그인 요청에 실패했습니다.";

    throw new Error(message);
  }
}

export interface AuthUser {
  id: string;
  email?: string;
  username: string | null;
}
export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });

  if (response.status === 401) {
    return null;
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error("로그인 상태를 확인하지 못했습니다.");
  }

  if (data === null || typeof data !== "object" || !("user" in data)) {
    throw new Error("사용자 응답 형식이 올바르지 않습니다.");
  }

  const user = data.user;

  if (
    user === null ||
    typeof user !== "object" ||
    !("id" in user) ||
    typeof user.id !== "string"
  ) {
    throw new Error("사용자 응답 형식이 올바르지 않습니다.");
  }
  return {
    id: user.id,
    email:
      "email" in user && typeof user.email === "string"
        ? user.email
        : undefined,
    username:
      "username" in user && typeof user.username === "string"
        ? user.username
        : null,
  };
  // return {
  //   id: user.id,
  //   email:
  //     "email" in user && typeof user.email === "string"
  //       ? user.email
  //       : undefined,
  // };
}
export async function logout(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data !== null &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "로그아웃 요청에 실패했습니다.";

    throw new Error(message);
  }

  if (
    data === null ||
    typeof data !== "object" ||
    !("success" in data) ||
    data.success !== true
  ) {
    throw new Error("로그아웃 응답을 확인하지 못했습니다.");
  }
}
