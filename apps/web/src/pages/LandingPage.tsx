import { Trans } from "@lingui/react/macro";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WindowChrome } from "./WindowChrome";
import {
  ExternalLink,
  FileSpreadsheet,
  Globe,
  Laptop,
  Layers,
  Scale,
  Shield,
  Sparkles,
  TrendingUp,
  Terminal,
} from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"munimji" | "vakil" | "teji" | "chanakya" | "dev">("munimji");

  const squad = [
    {
      id: "munimji" as const,
      name: "Munimji",
      nameHindi: "मुनीमजी",
      role: "GST & Accounts Specialist",
      color: "#FF9933",
      avatarBg: "from-[#FF9933]/20 to-[#FF9933]/5",
      avatarBorder: "border-[#FF9933]/30",
      description: "Automates Indian Goods & Services Tax (GST), e-invoicing, TDS schedules, and ledger reconciliation.",
      icon: FileSpreadsheet,
      samplePrompt: "Reconcile GSTR-2B with my purchase invoices and highlight unmatched input tax credits (ITC).",
      sampleResponse: "Found 14 matching entries (₹1,42,800 ITC) and 2 mismatched invoices from vendor ABC Tech (₹18,400 pending). Generated reconciliation summary report.",
    },
    {
      id: "vakil" as const,
      name: "Vakil",
      nameHindi: "वकील",
      role: "Legal & DPDP Compliance",
      color: "#F59E0B",
      avatarBg: "from-[#F59E0B]/20 to-[#F59E0B]/5",
      avatarBorder: "border-[#F59E0B]/30",
      description: "Indian Contract Act, Companies Act 2013, employment NDAs, and Digital Personal Data Protection (DPDP) Act 2023 compliance.",
      icon: Scale,
      samplePrompt: "Review our vendor agreement to verify compliance with Section 43A and the new DPDP Act 2023.",
      sampleResponse: "Drafted data principal consent clauses and audit trail retention schedules conforming to DPDP 2023 rules.",
    },
    {
      id: "teji" as const,
      name: "Teji",
      nameHindi: "तेजी",
      role: "NSE / BSE Market Analyst",
      color: "#30D158",
      avatarBg: "from-[#30D158]/20 to-[#30D158]/5",
      avatarBorder: "border-[#30D158]/30",
      description: "Real-time analysis of Nifty 50, BankNifty, corporate earnings, SEBI circulars, and Indian macro-economic data.",
      icon: TrendingUp,
      samplePrompt: "Summarize today's FII/DII net flows and analyze sector rotation in IT and Banking.",
      sampleResponse: "FIIs bought net ₹1,240 Cr; DIIs purchased ₹890 Cr. Heavy call buildup at 24,500 Nifty strike with banking outperforming.",
    },
    {
      id: "chanakya" as const,
      name: "Chanakya",
      nameHindi: "चाणक्य",
      role: "Strategy & Intelligence",
      color: "#AF52DE",
      avatarBg: "from-[#AF52DE]/20 to-[#AF52DE]/5",
      avatarBorder: "border-[#AF52DE]/30",
      description: "Deep business strategy, competitive Indian market intelligence, negotiation frameworks, and growth planning.",
      icon: Layers,
      samplePrompt: "Design an India expansion go-to-market strategy for tier-2/3 cities targeting vernacular users.",
      sampleResponse: "Prepared a 3-phase rollout: WhatsApp-first commerce, UPI auto-pay integration, and vernacular voice onboarding.",
    },
    {
      id: "dev" as const,
      name: "Dev",
      nameHindi: "देव",
      role: "UPI & Fullstack Engineer",
      color: "#0071E3",
      avatarBg: "from-[#0071E3]/20 to-[#0071E3]/5",
      avatarBorder: "border-[#0071E3]/30",
      description: "Builds and tests code inside local Docker sandboxes with native Razorpay, Cashfree, UPI QR, and Aadhaar/DigiLocker APIs.",
      icon: Terminal,
      samplePrompt: "Write a serverless webhook handler to verify Razorpay signature and update database order status.",
      sampleResponse: "Generated HMAC-SHA256 signature verification middleware and idempotency key handlers with unit tests.",
    },
  ];

  const currentBot = squad.find((b) => b.id === activeTab) ?? squad[0]!;

  return (
    <div className="min-h-screen bg-[#08080B] text-[#F5F5F7] selection:bg-[#FF9933]/30 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-[#FF9933]/15 via-[#0071E3]/8 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-[800px] right-[-150px] w-[600px] h-[500px] bg-[#138808]/10 rounded-full blur-[160px]" />
        <div className="absolute top-[1600px] left-[-150px] w-[600px] h-[500px] bg-[#0071E3]/10 rounded-full blur-[160px]" />
      </div>

      {/* macOS Translucent Top Navigation Bar */}
      <header className="sticky top-0 z-50 mac-toolbar px-6 py-3 border-b border-white/10 backdrop-blur-xl bg-[#101015]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <WindowChrome />
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#1E1E28] to-[#121218] border border-white/20 shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="h-3.5 w-1 rounded-full bg-[#FF9933]" />
                  <span className="h-3.5 w-1 rounded-full bg-white" />
                  <span className="h-3.5 w-1 rounded-full bg-[#138808]" />
                </div>
              </div>
              <span className="font-semibold text-[17px] tracking-tight text-[#F5F5F7]">
                Agent Sena
              </span>
              <span className="text-[11px] font-medium text-[#FFA447] bg-[#FF9933]/10 px-2 py-0.5 rounded-full border border-[#FF9933]/25">
                एजेंट सेना
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-[13px] text-[#8E8E93]">
            <a href="#squad" className="hover:text-white transition">Squad (सेना)</a>
            <a href="#features" className="hover:text-white transition">Apple Mac Experience</a>
            <a href="#security" className="hover:text-white transition">Data Sovereignty</a>
            <a
              href="https://github.com/KashinathTilagul/agent-sena"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition"
            >
              <span>GitHub</span>
              <ExternalLink size={12} />
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/sign-in")}
              className="hidden sm:block text-[13px] text-[#A8A8AD] hover:text-white px-3 py-1.5 transition"
            >
              <Trans>Sign in</Trans>
            </button>
            <button
              type="button"
              onClick={() => navigate("/app")}
              className="mac-pill-btn px-4 py-1.5 text-[13px] font-medium text-white bg-[#0071E3] hover:bg-[#0077ED] shadow-sm transition"
            >
              Open App →
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto text-center">
        {/* Tricolor Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-[#E2E2E8] shadow-inner mb-6">
          <span className="flex h-2 w-2 rounded-full bg-[#FF9933] shadow-[0_0_8px_#FF9933]" />
          <span>India's Sovereign AI Agent Workforce</span>
          <span className="text-[#8E8E93]">·</span>
          <span className="text-[#34D399]">100% Private on Docker</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[#F5F5F7] max-w-4xl mx-auto leading-[1.08]">
          Your Sovereign Indian <br />
          <span className="sena-gradient-text">AI Agent Squad.</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-[#8E8E93] max-w-2xl mx-auto leading-relaxed">
          Meet <strong>Munimji</strong>, <strong>Vakil</strong>, <strong>Teji</strong>, <strong>Chanakya</strong>, and <strong>Dev</strong>. Persistent, autonomous teammates running isolated on your Mac or server with their own terminal, browser, and memory.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/sign-up")}
            className="w-full sm:w-auto mac-pill-btn flex items-center justify-center gap-2.5 px-8 py-3.5 text-[15px] font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] shadow-xl shadow-[#0071E3]/25 transition"
          >
            <Sparkles size={16} />
            <span>Deploy Your Squad (निःशुल्क)</span>
          </button>
          <a
            href="https://github.com/KashinathTilagul/agent-sena"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto mac-pill-btn flex items-center justify-center gap-2 px-6 py-3.5 text-[15px] font-medium text-[#ECECEE] hover:bg-white/10 transition"
          >
            <Laptop size={16} />
            <span>View GitHub Repository</span>
          </a>
        </div>

        {/* MacBook Pro Device Mockup */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          {/* MacBook Outer Display Frame */}
          <div className="rounded-t-[28px] border-4 border-[#2A2A32] bg-[#111116] p-3 pt-4 shadow-2xl shadow-black">
            {/* Display Bezel */}
            <div className="rounded-t-[18px] border border-white/10 bg-[#0A0A0E] overflow-hidden">
              {/* Screen Top Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#16161D] border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                  <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                  <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
                  <span className="ml-2 font-medium text-[#A8A8AD]">Agent Sena — Desktop Workspace</span>
                </div>
                <div className="flex items-center gap-3 text-[#636366]">
                  <span className="text-[#30D158] flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#30D158] animate-pulse" />
                    Docker: Running
                  </span>
                  <span>IST 20:45</span>
                </div>
              </div>

              {/* Screen Mockup Content */}
              <div className="grid grid-cols-12 h-[420px] bg-[#0D0D12] text-left">
                {/* Mockup Sidebar */}
                <div className="col-span-4 border-r border-white/5 bg-[#0F0F16] p-3 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#636366] px-2 mb-2">
                      Active Squad (सक्रिय एजेंट)
                    </div>
                    <div className="space-y-1">
                      {squad.map((bot) => (
                        <div
                          key={bot.id}
                          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs transition cursor-pointer ${
                            bot.id === activeTab ? "bg-white/10 text-white font-medium shadow-sm" : "text-[#8E8E93] hover:bg-white/5"
                          }`}
                          onClick={() => setActiveTab(bot.id)}
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: bot.color }}
                          />
                          <span className="font-medium text-white">{bot.name}</span>
                          <span className="text-[10px] text-[#8E8E93] ml-auto">
                            {bot.nameHindi}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-[11px] text-[#A8A8AD]">
                    <div className="text-white font-medium mb-0.5">🇮🇳 Bharat Cloud Sandbox</div>
                    <div className="text-[#636366]">Local isolated computer on loopback</div>
                  </div>
                </div>

                {/* Mockup Main Chat / Computer View */}
                <div className="col-span-8 p-5 flex flex-col justify-between bg-[#0B0B0F]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm"
                          style={{ backgroundColor: currentBot.color }}
                        >
                          {currentBot.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {currentBot.name} ({currentBot.nameHindi})
                          </div>
                          <div className="text-[11px] text-[#8E8E93]">{currentBot.role}</div>
                        </div>
                      </div>
                      <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#138808]/15 text-[#34D399] border border-[#138808]/25">
                        Active in Docker
                      </span>
                    </div>

                    {/* Chat Bubble User */}
                    <div className="flex justify-end">
                      <div className="max-w-md rounded-2xl rounded-tr-sm bg-[#0071E3] px-4 py-2.5 text-xs text-white shadow-sm">
                        {currentBot.samplePrompt}
                      </div>
                    </div>

                    {/* Chat Bubble Bot */}
                    <div className="flex justify-start items-start gap-2">
                      <div
                        className="h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-1"
                        style={{ backgroundColor: currentBot.color }}
                      >
                        {currentBot.name[0]}
                      </div>
                      <div className="max-w-md rounded-2xl rounded-tl-sm bg-[#1A1A22] border border-white/10 px-4 py-2.5 text-xs text-[#E2E2E8] shadow-sm leading-relaxed">
                        {currentBot.sampleResponse}
                      </div>
                    </div>
                  </div>

                  {/* Mockup Input Box */}
                  <div className="rounded-xl border border-white/10 bg-[#16161E] px-3.5 py-2.5 flex items-center justify-between text-xs text-[#636366]">
                    <span>Ask {currentBot.name} to execute task in computer...</span>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-[#A8A8AD]">
                      Return ↵
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MacBook Lower Base (Keyboard Deck & Notch) */}
          <div className="relative mx-auto h-4 w-[104%] -left-[2%] rounded-b-xl bg-gradient-to-b from-[#2E2E36] to-[#1C1C22] shadow-xl border-t border-white/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-24 rounded-b-md bg-[#16161B]" />
          </div>
        </div>
      </section>

      {/* Squad Showcase Grid Section */}
      <section id="squad" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-[#FF9933] font-semibold mb-2">
            Meet The Squad · सेना से मिलें
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F5F7]">
            Short, memorable agents built for everyday work.
          </h3>
          <p className="mt-3 text-sm text-[#8E8E93]">
            No complex prompts needed. Each agent has its own persistent memory, specialized system prompts, and tool authorizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {squad.map((bot) => {
            const Icon = bot.icon;
            return (
              <div
                key={bot.id}
                className="mac-card p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                onClick={() => setActiveTab(bot.id)}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center border shadow-inner ${bot.avatarBorder} bg-gradient-to-br ${bot.avatarBg}`}
                    >
                      <Icon size={22} style={{ color: bot.color }} />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#A8A8AD]">
                      {bot.nameHindi}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span>{bot.name}</span>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bot.color }} />
                  </h4>
                  <div className="text-xs font-medium text-[#FF9933] mt-0.5">{bot.role}</div>

                  <p className="mt-3 text-xs leading-relaxed text-[#8E8E93]">
                    {bot.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[#636366]">Local Docker sandbox</span>
                  <span className="font-medium text-[#0071E3] flex items-center gap-1 group-hover:translate-x-0.5 transition">
                    Start Chat →
                  </span>
                </div>
              </div>
            );
          })}

          {/* Create Custom Bot Card */}
          <div
            onClick={() => navigate("/app")}
            className="mac-card p-6 border-dashed border-white/15 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#FF9933]/50 transition group"
          >
            <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-white text-xl mb-3 group-hover:scale-110 transition">
              +
            </div>
            <h4 className="text-lg font-bold text-white">Create Custom Sena Agent</h4>
            <p className="mt-1 text-xs text-[#8E8E93] max-w-[220px]">
              Deploy specialized bots for your specific company workflows or regional language tasks.
            </p>
          </div>
        </div>
      </section>

      {/* Apple Mac Experience & Features Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="mac-card p-6">
            <div className="h-10 w-10 rounded-xl bg-[#0071E3]/15 text-[#0071E3] flex items-center justify-center mb-4">
              <Laptop size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Native macOS & Web App</h3>
            <p className="text-xs text-[#8E8E93] leading-relaxed">
              Designed to feel like Apple hardware. Polished window chrome, SF Pro typography, frosted glassmorphism, and seamless keyboard shortcuts.
            </p>
          </div>

          <div className="mac-card p-6">
            <div className="h-10 w-10 rounded-xl bg-[#FF9933]/15 text-[#FF9933] flex items-center justify-center mb-4">
              <Shield size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Indian Data Sovereignty</h3>
            <p className="text-xs text-[#8E8E93] leading-relaxed">
              Your data stays on your machine. Isolated local Docker computers ensure complete compliance with India's DPDP Act 2023 without vendor lock-in.
            </p>
          </div>

          <div className="mac-card p-6">
            <div className="h-10 w-10 rounded-xl bg-[#30D158]/15 text-[#30D158] flex items-center justify-center mb-4">
              <Globe size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Composio & 100+ App Tools</h3>
            <p className="text-xs text-[#8E8E93] leading-relaxed">
              Equip your squad with real hands. Connect Google Drive, Gmail, Slack, GitHub, Notion, and Indian fintech APIs with 1-click OAuth.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <div className="mac-window rounded-3xl p-10 sm:p-14 relative overflow-hidden">
          <div className="sena-tiranga-bar absolute top-0 left-0 right-0" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to lead your AI Agent Sena?
          </h2>
          <p className="mt-3 text-sm text-[#8E8E93] max-w-lg mx-auto">
            Run the entire squad locally with Docker on your Mac. No hosted cloud vendors required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/sign-up")}
              className="mac-pill-btn px-8 py-3 text-sm font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] shadow-lg shadow-[#0071E3]/20 transition"
            >
              Get Started Free (शुरू करें)
            </button>
            <button
              type="button"
              onClick={() => navigate("/app")}
              className="mac-pill-btn px-6 py-3 text-sm font-medium text-[#ECECEE] hover:bg-white/10 transition"
            >
              Open Web App
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#636366]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">Agent Sena (एजेंट सेना)</span>
          <span>·</span>
          <span>Made for India & the World 🇮🇳</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/KashinathTilagul/agent-sena"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
          >
            GitHub: KashinathTilagul/agent-sena
          </a>
          <span>Apache 2.0 License</span>
        </div>
      </footer>
    </div>
  );
}
