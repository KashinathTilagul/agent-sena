import { useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { desktopBridge, windowChromeKind } from "../lib/desktop";

export function WindowChrome() {
  const { t } = useLingui();
  const desktop = desktopBridge();
  const kind = windowChromeKind(desktop);
  const [hovered, setHovered] = useState(false);

  if (kind === "darwin") {
    return <div className="app-drag h-3 w-[72px]" aria-hidden="true" />;
  }

  return (
    <div
      role="toolbar"
      aria-label={t`Window controls`}
      className="app-drag flex items-center gap-[8px] py-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        className="app-no-drag group relative flex h-[12px] w-[12px] items-center justify-center rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-sm transition-transform active:scale-95"
        aria-label={t`Close`}
        onClick={() => void desktop?.window.close()}
      >
        <span
          className={`text-[8px] font-bold text-[#4c0000] transition-opacity leading-none ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          ×
        </span>
      </button>
      <button
        type="button"
        className="app-no-drag group relative flex h-[12px] w-[12px] items-center justify-center rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-sm transition-transform active:scale-95"
        aria-label={t`Minimize`}
        onClick={() => void desktop?.window.minimize()}
      >
        <span
          className={`text-[9px] font-bold text-[#5c3c00] transition-opacity leading-none ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          –
        </span>
      </button>
      <button
        type="button"
        className="app-no-drag group relative flex h-[12px] w-[12px] items-center justify-center rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-sm transition-transform active:scale-95"
        aria-label={t`Fullscreen`}
        onClick={() => void desktop?.window.toggleMaximize()}
      >
        <span
          className={`text-[7px] font-bold text-[#004d11] transition-opacity leading-none ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          +
        </span>
      </button>
    </div>
  );
}
