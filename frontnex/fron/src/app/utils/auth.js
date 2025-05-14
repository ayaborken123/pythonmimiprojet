// utils/auth.js
export function isAuthenticated() {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("access_token");
  }
  return false;
}

export function logout() {
  const token = localStorage.getItem("access_token");
  if (token) {
    fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch((err) => console.error(err));
  }
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_id");
  window.location.href = "/";
}
