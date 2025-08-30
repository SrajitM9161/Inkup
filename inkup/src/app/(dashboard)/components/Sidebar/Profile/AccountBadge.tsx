"use client";

import React, { useState, useRef, useEffect } from "react";
import { CreditsBadge } from "./CreditsBadge";
import { LogoutButton } from "./LogoutButton";

export type AccountBadgeProps = {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  credits?: number;
  className?: string;
};

function formatPlan() {
  return "Free Plan";
}

export default function AccountBadge({
  name,
  company,
  email,
  phone,
  credits = 0,
  className,
}: AccountBadgeProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`relative inline-block text-left ${className ?? ""}`}
      ref={dropdownRef}
    >
      {/* Badge */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-900 p-3 text-zinc-100 cursor-pointer hover:bg-zinc-800 ring-1 ring-white/10 transition"
      >
        {/* Avatar */}
        <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 ring-1 ring-white/10 shadow-inner" />

        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-base text-white">
            {name} {company ? `(${company})` : null}
          </div>
          <div className="mt-0.5 text-xs text-zinc-400">{formatPlan()}</div>
        </div>

        <CreditsBadge credits={credits} />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-72 rounded-xl bg-zinc-900 p-5 shadow-2xl ring-1 ring-white/10 z-[9999] animate-in fade-in slide-in-from-top-2"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-zinc-700 pb-4">
            <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 ring-1 ring-white/10 shadow-inner" />
            <div>
              <div className="truncate font-semibold text-white text-sm">
                {name} {company ? `(${company})` : null}
              </div>
              <div className="mt-0.5 text-xs text-zinc-400">{formatPlan()}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              className="flex-1 rounded-lg bg-yellow-400/10 px-3 py-2 text-sm font-medium text-yellow-400 ring-1 ring-yellow-400/40 hover:bg-yellow-400/20 transition"
            >
              Upgrade Plan
            </button>
            <CreditsBadge credits={credits} small />
          </div>

          {/* Contact Info */}
          <div className="mt-5 space-y-2 text-sm text-zinc-300">
            {email && <div className="truncate">{email}</div>}
            {phone && <div>{phone}</div>}
          </div>

          {/* Logout */}
          <LogoutButton />
        </div>
      )}
    </div>
  );
}
