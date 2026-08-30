import { useState, useMemo } from "react";
import {
  AGENT_CATALOG,
  AGENT_CATEGORIES,
  type AgentCategory,
  type AgentCatalogTemplate,
} from "../lib/agent-catalog";
import { WindowChrome } from "../pages/WindowChrome";
import {
  Search,
  Plus,
  Check,
  Sparkles,
  Zap,
  Bot,
  Layers,
  ArrowRight,
  X,
  Sliders,
} from "lucide-react";

interface AgentStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (template: AgentCatalogTemplate) => Promise<void>;
  onOpenCustomBuilder: () => void;
}

export function AgentStoreModal({
  isOpen,
  onClose,
  onDeploy,
  onOpenCustomBuilder,
}: AgentStoreModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<AgentCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deployingId, setDeployingId] = useState<string | null>(null);
  const [deployedIds, setDeployedIds] = useState<Set<string>>(new Set());

  const filteredAgents = useMemo(() => {
    return AGENT_CATALOG.filter((agent) => {
      const matchesCategory =
        selectedCategory === "all" || agent.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        agent.name.toLowerCase().includes(q) ||
        (agent.nameRegional && agent.nameRegional.toLowerCase().includes(q)) ||
        agent.title.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.skills.some((s) => s.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  async function handleDeploy(agent: AgentCatalogTemplate) {
    if (deployingId) return;
    setDeployingId(agent.id);
    try {
      await onDeploy(agent);
      setDeployedIds((prev) => new Set([...prev, agent.id]));
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      console.error("Failed to deploy agent", err);
    } finally {
      setDeployingId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* macOS Styled Window Frame */}
      <div className="relative flex flex-col w-full max-w-5xl h-[88vh] max-h-[850px] rounded-2xl mac-window overflow-hidden border border-white/15 shadow-2xl bg-[#0D0D12]">
        {/* Window Chrome & Header */}
        <div className="app-drag flex items-center justify-between px-6 py-4 mac-toolbar border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <WindowChrome />
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FF9933] shadow-[0_0_8px_#FF9933]" />
              <span className="font-bold text-[16px] text-white tracking-tight">
                Agent Sena Catalog
              </span>
              <span className="text-[11px] font-semibold text-[#FFA447] bg-[#FF9933]/15 px-2 py-0.5 rounded-full border border-[#FF9933]/25">
                सेना स्टोर
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCustomBuilder();
              }}
              className="app-no-drag mac-pill-btn flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#F5F5F7] bg-white/10 hover:bg-white/15 transition"
            >
              <Sliders size={13} className="text-[#0071E3]" />
              <span>Custom Agent Builder</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="app-no-drag h-7 w-7 rounded-full flex items-center justify-center text-[#8E8E93] hover:text-white hover:bg-white/10 transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="px-6 py-3.5 border-b border-white/10 bg-[#121218] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Category Filter Pills */}
          <div className="rk-scroll flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {AGENT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? "bg-[#0071E3] text-white shadow-sm font-semibold"
                    : "bg-white/5 text-[#8E8E93] hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills, roles…"
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-white/10 bg-[#1A1A22] text-[#F5F5F7] placeholder:text-[#636366] outline-none focus:border-[#0071E3] transition"
            />
          </div>
        </div>

        {/* Agent Cards Grid */}
        <div className="rk-scroll flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => {
            const isDeploying = deployingId === agent.id;
            const isDeployed = deployedIds.has(agent.id);

            return (
              <div
                key={agent.id}
                className="mac-card p-5 flex flex-col justify-between border border-white/10 hover:border-white/20 transition-all duration-150 relative group bg-[#161620]/75"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm shrink-0"
                        style={{ backgroundColor: agent.color }}
                      >
                        {agent.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-white text-[15px] leading-tight">
                          <span>{agent.name}</span>
                          {agent.nameRegional ? (
                            <span className="text-[11px] font-medium text-[#FFA447]">
                              ({agent.nameRegional})
                            </span>
                          ) : null}
                        </div>
                        <div className="text-xs text-[#8E8E93] truncate max-w-[170px] mt-0.5">
                          {agent.title}
                        </div>
                      </div>
                    </div>

                    {agent.badge ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#A8A8AD]">
                        {agent.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-[#636366]">
                        {agent.categoryLabel}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#A8A8AD] leading-relaxed line-clamp-3 mb-3">
                    {agent.description}
                  </p>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {agent.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-[#8E8E93] border border-white/5"
                      >
                        #{skill}
                      </span>
                    ))}
                    {agent.skills.length > 3 ? (
                      <span className="text-[10px] text-[#636366] self-center">
                        +{agent.skills.length - 3}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-[#636366]">
                    Ready to deploy
                  </span>
                  <button
                    type="button"
                    disabled={isDeploying || isDeployed}
                    onClick={() => void handleDeploy(agent)}
                    className={`mac-pill-btn flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold transition ${
                      isDeployed
                        ? "bg-[#30D158]/20 text-[#30D158] border-[#30D158]/40"
                        : "bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-sm"
                    }`}
                  >
                    {isDeploying ? (
                      <>
                        <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Enlisting…</span>
                      </>
                    ) : isDeployed ? (
                      <>
                        <Check size={13} />
                        <span>Enlisted</span>
                      </>
                    ) : (
                      <>
                        <Plus size={13} />
                        <span>Deploy Agent</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-[#121218] flex items-center justify-between text-xs text-[#8E8E93] shrink-0">
          <div>
            Showing <strong className="text-white">{filteredAgents.length}</strong> agents with pre-tuned system prompts & skills
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCustomBuilder();
            }}
            className="text-[#0071E3] hover:underline font-medium flex items-center gap-1"
          >
            <span>Don't see what you need? Build a custom agent</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
