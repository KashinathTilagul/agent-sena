import { Trans } from "@lingui/react/macro";
import { useNavigate } from "react-router-dom";
import { WindowChrome } from "./WindowChrome";

export function WelcomePage() {
  const navigate = useNavigate();
  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-[#08080b]">
      {/* Ambient background glows for macOS vibrancy */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-gradient-to-b from-[#FF9933]/10 via-[#0071E3]/5 to-transparent blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[350px] w-[600px] rounded-full bg-gradient-to-t from-[#138808]/10 to-transparent blur-[100px]" />

      <div className="app-drag relative z-10 flex items-center justify-between px-6 py-4 mac-toolbar">
        <WindowChrome />
        <div className="flex items-center gap-2 text-xs text-[#8E8E93]">
          <span className="h-2 w-2 rounded-full bg-[#30D158]" />
          <span>India Sovereign AI</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-16">
        {/* Apple Style Icon / Emblem */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#1E1E28] to-[#121218] border border-white/15 shadow-2xl shadow-black/80">
          <div className="flex items-center gap-2">
            <span className="h-8 w-3 rounded-full bg-[#FF9933] shadow-[0_0_12px_#FF993380]" />
            <span className="h-8 w-3 rounded-full bg-[#F5F5F7] shadow-[0_0_12px_#FFFFFF80]" />
            <span className="h-8 w-3 rounded-full bg-[#138808] shadow-[0_0_12px_#13880880]" />
          </div>
          <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#0071E3] text-[11px] font-bold text-white border-2 border-[#08080B] shadow-md">
            🇮🇳
          </span>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#F5F5F7]">
              Agent Sena
            </h1>
            <span className="rounded-full border border-[#FF9933]/30 bg-[#FF9933]/10 px-3 py-1 text-xs font-semibold text-[#FFA447]">
              एजेंट सेना
            </span>
          </div>
          <p className="mt-4 max-w-lg text-lg text-[#8E8E93] leading-relaxed">
            <Trans>
              Your sovereign Indian AI workforce. Autonomous agent squads built to handle real work
              across your desktop and web.
            </Trans>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/sign-up")}
            className="app-no-drag mac-pill-btn flex items-center gap-2.5 px-7 py-3 text-[15px] font-medium text-white bg-[#0071E3] hover:bg-[#0077ED] shadow-lg shadow-[#0071E3]/25 transition"
          >
            <span>Create Your Squad</span>
            <span>→</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/sign-in")}
            className="app-no-drag mac-pill-btn px-6 py-3 text-[15px] font-medium text-[#E2E2E8] hover:bg-white/10 transition"
          >
            <Trans>Sign in</Trans>
          </button>
        </div>

        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-[#636366]">
          <span className="flex items-center gap-1.5">
            <span className="text-[#30D158]">✓</span> Private & Local Docker Sandboxes
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#30D158]">✓</span> Indian Standards & Compliance
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#30D158]">✓</span> Multi-Model Intelligence
          </span>
        </div>
      </div>
    </div>
  );
}
