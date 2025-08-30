"use client";
import toast from "react-hot-toast";
import api from "../../../../api/api"; 

export function LogoutButton() {

  async function handleLogout() {
    try {
      const { data } = await api.post("/logout");

      toast.success(`Goodbye, ${data.data?.name} 👋`);
      window.location.href = data.redirect || "/";
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Logout failed ❌";
      toast.error(message);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-5 w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition"
    >
      Log out
    </button>
  );
}
