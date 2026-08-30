import { Trans, useLingui } from "@lingui/react/macro";
import {
  OPENAI_COMPATIBLE_PROVIDER_ID,
  openAiCompatibleConnectReady,
  openAiCompatibleProbeSuccessMessage,
} from "@rakazo/contracts";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { localizedProviderHint } from "../lib/localized-provider-hint";
import type { ModelCatalogEntry } from "../lib/model-auth";
import { rpc } from "../lib/rpc";
import { useModelOAuthSignIn } from "../lib/use-model-oauth-signin";
import { AGENT_CATALOG, type AgentCatalogTemplate } from "../lib/agent-catalog";

export function OnboardingPage() {
  const { t } = useLingui();
  const navigate = useNavigate();
  const [step, setStep] = useState<"loading" | "model" | "bot">("loading");
  const [catalog, setCatalog] = useState<ModelCatalogEntry[]>([]);
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState("openrouter");
  const [modelId, setModelId] = useState("deepseek/deepseek-v4-flash-0731");
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [probeModels, setProbeModels] = useState<string[]>([]);
  const [probedBaseUrl, setProbedBaseUrl] = useState<string | null>(null);
  const [probing, setProbing] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [color, setColor] = useState<string | undefined>(undefined);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"catalog" | "custom">("catalog");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const probeRequestIdRef = useRef(0);

  const {
    oauth,
    pasteCode,
    setPasteCode,
    oauthPending,
    cancelOAuthAttempt,
    startSubscriptionSignIn,
    submitOAuthCode,
  } = useModelOAuthSignIn({
    onClearError: () => setError(null),
    onError: setError,
    onFinished: () => {
      setStep("bot");
    },
  });

  useEffect(() => {
    void Promise.all([rpc.me(), rpc.models.list().catch(() => [])])
      .then(([me, models]) => {
        setCatalog(models);
        const preferred =
          models.find(
            (entry) => entry.provider === me.defaultProvider && entry.id === me.defaultModel,
          ) ??
          models.find((entry) => entry.provider === me.defaultProvider) ??
          models[0];
        if (preferred) {
          setProvider(preferred.provider);
          setModelId(preferred.provider === OPENAI_COMPATIBLE_PROVIDER_ID ? "" : preferred.id);
        }
        setStep("model");
      })
      .catch(() => setStep("bot"));
    return () => {
      probeRequestIdRef.current += 1;
    };
  }, []);

  const providers = useMemo(() => {
    const seen = new Map<string, ModelCatalogEntry>();
    for (const entry of catalog) {
      if (!seen.has(entry.provider)) seen.set(entry.provider, entry);
    }
    return [...seen.values()];
  }, [catalog]);

  const filteredProviders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return providers;
    const matching = new Set(
      catalog
        .filter((entry) =>
          `${entry.provider} ${entry.providerName ?? ""} ${entry.label} ${entry.id} ${entry.billing} ${entry.oauthLabel ?? ""}`
            .toLowerCase()
            .includes(q),
        )
        .map((entry) => entry.provider),
    );
    return providers.filter((entry) => matching.has(entry.provider));
  }, [catalog, providers, query]);

  const modelsForProvider = useMemo(
    () => catalog.filter((entry) => entry.provider === provider),
    [catalog, provider],
  );

  const selected = modelsForProvider.find((entry) => entry.id === modelId) ?? modelsForProvider[0];
  const isOpenAiCompatible = provider === OPENAI_COMPATIBLE_PROVIDER_ID;
  const subscriptionSignIn = selected?.signIn !== undefined;
  const acceptsKey = selected?.auth !== "oauth";
  const signInLabel = selected?.oauthLabel ?? t`Sign in`;
  const openAiCompatibleReady = openAiCompatibleConnectReady({
    baseUrl,
    modelId,
    probedBaseUrl,
  });

  function resetOpenAiCompatibleProbe() {
    probeRequestIdRef.current += 1;
    setProbeModels([]);
    setProbedBaseUrl(null);
    setProbing(false);
  }

  function updateBaseUrl(nextBaseUrl: string) {
    setBaseUrl(nextBaseUrl);
    resetOpenAiCompatibleProbe();
    setError(null);
    setNotice(null);
  }

  function updateApiKey(nextApiKey: string) {
    setApiKey(nextApiKey);
    resetOpenAiCompatibleProbe();
  }

  async function probeServerModels() {
    const trimmedBaseUrl = baseUrl.trim();
    if (!trimmedBaseUrl) return;
    resetOpenAiCompatibleProbe();
    const requestId = probeRequestIdRef.current;
    setProbing(true);
    setError(null);
    setNotice(null);
    try {
      const result = await rpc.models.probeOpenAiCompatible({
        baseUrl: trimmedBaseUrl,
        apiKey: apiKey.trim() || undefined,
      });
      if (requestId !== probeRequestIdRef.current) return;
      setProbeModels(result.models);
      setProbedBaseUrl(trimmedBaseUrl);
      setModelId((current) => current.trim() || result.models[0] || "");
      setNotice(openAiCompatibleProbeSuccessMessage(result.models.length));
    } catch (err) {
      if (requestId !== probeRequestIdRef.current) return;
      setError(err instanceof Error ? err.message : t`Could not reach this model server`);
    } finally {
      if (requestId === probeRequestIdRef.current) setProbing(false);
    }
  }

  async function saveModel() {
    setError(null);
    try {
      if (isOpenAiCompatible) {
        await rpc.models.connect({
          provider,
          baseUrl: baseUrl.trim(),
          modelId: modelId.trim(),
          apiKey: apiKey.trim() || undefined,
          label: selected?.providerName ?? provider,
        });
      } else if (apiKey) {
        await rpc.models.connect({
          provider,
          apiKey,
          modelId,
          label: selected?.providerName ?? provider,
        });
      }
      setStep("bot");
    } catch (err) {
      setError(err instanceof Error ? err.message : t`Could not save model`);
    }
  }

  function beginSelectedSubscriptionSignIn() {
    void startSubscriptionSignIn({
      provider,
      modelId,
      label: selected?.providerName ?? provider,
    });
  }

  async function createBot() {
    setError(null);
    try {
      const bot = await rpc.bots.create({
        name: name.trim(),
        title,
        description,
        instructions: instructions.trim() || description,
        ...(color ? { color } : {}),
        notifyOnFinish: true,
      });
      // Onboarding continues conversationally in the thread: greeting, focus
      // choice, and Composio authorize cards.
      await rpc.onboarding.start({ botId: bot.id }).catch(() => undefined);
      navigate(`/app/${bot.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t`Could not create your bot`);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-[#0D0D0E] px-6">
      <div className="w-[560px]">
        {step === "loading" ? (
          <p className="text-[#85858A]">
            <Trans>Loading…</Trans>
          </p>
        ) : null}
        {step === "model" ? (
          <div>
            <h1 className="text-[32px] font-medium text-[#F1F1F2]">
              <Trans>Connect a model</Trans>
            </h1>
            <p className="mt-2 text-[#85858A]">
              <Trans>Choose a model to get started.</Trans>
            </p>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t`Search providers and models`}
              placeholder={t`Search providers and models`}
              className="mt-8 w-full rounded-[11px] border border-[#26262A] bg-transparent px-3.5 py-3 text-[#ECECEE]"
            />
            <div className="mt-3 max-h-48 overflow-y-auto rounded-[11px] border border-[#26262A]">
              {filteredProviders.map((entry) => (
                <button
                  key={entry.provider}
                  type="button"
                  onClick={() => {
                    cancelOAuthAttempt();
                    setProvider(entry.provider);
                    setModelId(
                      entry.provider === OPENAI_COMPATIBLE_PROVIDER_ID
                        ? ""
                        : (catalog.find((item) => item.provider === entry.provider)?.id ?? ""),
                    );
                    setBaseUrl("");
                    resetOpenAiCompatibleProbe();
                    setError(null);
                    setNotice(null);
                  }}
                  className={`flex w-full items-center justify-between border-b border-[#202023] px-3.5 py-2.5 text-left last:border-0 ${
                    entry.provider === provider ? "bg-[#1A1A1D]" : "hover:bg-[#161618]"
                  }`}
                >
                  <span className="text-[15px] text-[#ECECEE]">
                    {entry.providerName ?? entry.provider}
                  </span>
                  <span className="text-[12px] text-[#85858A]">{localizedProviderHint(entry)}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 block text-sm text-[#85858A]">
              {isOpenAiCompatible ? (
                <>
                  <label className="block">
                    <Trans>Server URL</Trans>
                    <input
                      value={baseUrl}
                      onChange={(e) => updateBaseUrl(e.target.value)}
                      aria-label={t`OpenAI-compatible server URL`}
                      placeholder="http://127.0.0.1:8000/v1"
                      autoComplete="off"
                      className="mt-2 w-full rounded-[11px] border border-[#26262A] bg-transparent px-3.5 py-3 text-[#ECECEE]"
                    />
                  </label>
                  <details className="mt-2 text-[13px] leading-[1.5] text-[#85858A]">
                    <summary className="w-fit cursor-pointer select-none">
                      <Trans>Setup help</Trans>
                    </summary>
                    <p className="mt-1">
                      {t`Paste the OpenAI-compatible address from your server. Rakazo adds /v1 if needed.`}
                    </p>
                  </details>
                  <div className="mt-3">
                    <button
                      type="button"
                      disabled={probing || !baseUrl.trim()}
                      onClick={() => void probeServerModels()}
                      className="rounded-[11px] border border-[#26262A] px-4 py-2 text-sm text-[#ECECEE] disabled:opacity-40"
                    >
                      {probing ? <Trans>Finding…</Trans> : <Trans>Find models</Trans>}
                    </button>
                  </div>
                  <div className="mt-4 block">
                    <span>
                      <Trans>Model</Trans>
                    </span>
                    {probeModels.length && probeModels.includes(modelId) ? (
                      <div className="relative mt-2">
                        <select
                          value={modelId}
                          onChange={(e) => setModelId(e.target.value)}
                          aria-label={t`Models from server`}
                          className="w-full appearance-none rounded-[11px] border border-[#26262A] bg-transparent py-3 pl-3.5 pr-11 text-[#ECECEE]"
                        >
                          {probeModels.map((id) => (
                            <option key={id} value={id}>
                              {id}
                            </option>
                          ))}
                          <option value="">
                            <Trans>Other model…</Trans>
                          </option>
                        </select>
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#85858A]"
                        >
                          <ChevronDown size={16} strokeWidth={1.8} />
                        </span>
                      </div>
                    ) : (
                      <input
                        value={modelId}
                        onChange={(e) => setModelId(e.target.value)}
                        aria-label={t`Model id`}
                        placeholder="exact-model-id"
                        className="mt-2 w-full rounded-[11px] border border-[#26262A] bg-transparent px-3.5 py-3 text-[#ECECEE]"
                      />
                    )}
                    {probeModels.length && !probeModels.includes(modelId) ? (
                      <button
                        type="button"
                        className="mt-2 text-[13px] text-[#85858A] underline"
                        onClick={() => setModelId(probeModels[0] ?? "")}
                      >
                        <Trans>Use a found model</Trans>
                      </button>
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  <span>
                    <Trans>Model</Trans>
                  </span>
                  <select
                    value={selected?.id ?? modelId}
                    onChange={(e) => {
                      cancelOAuthAttempt();
                      setModelId(e.target.value);
                    }}
                    aria-label={t`Model`}
                    className="mt-2 w-full rounded-[11px] border border-[#26262A] bg-transparent px-3.5 py-3 text-[#ECECEE]"
                  >
                    {modelsForProvider.map((entry) => (
                      <option key={`${entry.provider}:${entry.id}`} value={entry.id}>
                        {entry.label}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
            {!isOpenAiCompatible ? (
              <p className="mt-2 text-[13px] text-[#85858A]">{selected?.billing}</p>
            ) : null}
            {subscriptionSignIn ? (
              <div className="mt-4">
                {oauth ? (
                  <div className="rounded-[11px] border border-[#26262A] px-3.5 py-3">
                    {oauth.mode === "auth-url" ? (
                      <>
                        <p className="text-sm text-[#85858A]">
                          <Trans>
                            Finish signing in at{" "}
                            <a
                              href={oauth.verificationUri}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#ECECEE] underline"
                            >
                              {new URL(oauth.verificationUri).hostname}
                            </a>
                            . The final page may not load; paste its URL or code here.
                          </Trans>
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <input
                            value={pasteCode}
                            onChange={(e) => setPasteCode(e.target.value)}
                            aria-label={t`Authorization code or callback URL`}
                            autoComplete="off"
                            spellCheck={false}
                            placeholder="http://localhost:53692/callback?code=…"
                            className="w-full rounded-[11px] border border-[#26262A] bg-transparent px-3.5 py-2.5 text-[13px] text-[#ECECEE]"
                          />
                          <button
                            type="button"
                            disabled={!pasteCode.trim()}
                            onClick={() => void submitOAuthCode()}
                            className="rounded-[11px] bg-[#F1F1EF] px-4 py-2.5 text-[#17171A] disabled:opacity-40"
                          >
                            <Trans>Submit</Trans>
                          </button>
                        </div>
                        <p className="mt-2 text-sm text-[#85858A]">
                          <Trans>Waiting for sign-in…</Trans>
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-[#85858A]">
                          <Trans>
                            Enter this code at{" "}
                            <a
                              href={oauth.verificationUri}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#ECECEE] underline"
                            >
                              {oauth.verificationUri.replace(/^https:\/\//, "")}
                            </a>
                          </Trans>
                        </p>
                        <p className="mt-2 font-mono text-[22px] tracking-[0.2em] text-[#F1F1F2]">
                          {oauth.userCode}
                        </p>
                        <p className="mt-2 text-sm text-[#85858A]">
                          <Trans>Waiting for sign-in…</Trans>
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={oauthPending}
                    onClick={() => beginSelectedSubscriptionSignIn()}
                    className="rounded-[11px] bg-[#F1F1EF] px-5 py-2.5 text-[#17171A] disabled:opacity-40"
                  >
                    {oauthPending ? <Trans>Starting…</Trans> : signInLabel}
                  </button>
                )}
              </div>
            ) : null}
            {acceptsKey ? (
              isOpenAiCompatible ? (
                <details className="mt-4 text-sm text-[#85858A]">
                  <summary className="w-fit cursor-pointer select-none">
                    <Trans>API key</Trans>
                  </summary>
                  <input
                    aria-label={t`API key`}
                    value={apiKey}
                    onChange={(e) => updateApiKey(e.target.value)}
                    placeholder={t`Optional`}
                    type="password"
                    autoComplete="new-password"
                    className="mt-2 w-full rounded-[11px] border border-[#26262A] bg-transparent px-3.5 py-3 text-[#ECECEE]"
                  />
                </details>
              ) : (
                <label className="mt-4 block text-sm text-[#85858A]">
                  {subscriptionSignIn ? <Trans>Or paste an API key</Trans> : <Trans>API key</Trans>}
                  <input
                    value={apiKey}
                    onChange={(e) => updateApiKey(e.target.value)}
                    placeholder="sk-…"
                    type="password"
                    autoComplete="new-password"
                    className="mt-2 w-full rounded-[11px] border border-[#26262A] bg-transparent px-3.5 py-3 text-[#ECECEE]"
                  />
                </label>
              )
            ) : subscriptionSignIn ? null : (
              <p className="mt-4 text-sm text-[#85858A]">
                <Trans>
                  This provider cannot paste a key here. Skip if this deployment already has
                  credentials.
                </Trans>
              </p>
            )}
            {notice ? <p className="mt-3 text-sm text-[#4ECB71]">{notice}</p> : null}
            {error ? <p className="mt-3 text-sm text-[#E65707]">{error}</p> : null}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={oauthPending || (isOpenAiCompatible && !openAiCompatibleReady)}
                onClick={() => void saveModel()}
                className="rounded-[11px] bg-[#F1F1EF] px-5 py-2.5 text-[#17171A] disabled:opacity-40"
              >
                <Trans>Continue</Trans>
              </button>
              <button
                type="button"
                onClick={() => {
                  cancelOAuthAttempt();
                  setStep("bot");
                }}
                className="text-[#85858A]"
              >
                <Trans>Skip for now</Trans>
              </button>
            </div>
          </div>
        ) : null}
        {step === "bot" ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FF9933]/15 text-[#FFA447] border border-[#FF9933]/25">
                एजेंट सेना
              </span>
            </div>
            <h1 className="text-[32px] font-bold tracking-tight text-[#F5F5F7]">
              <Trans>Choose or Build Your First Agent</Trans>
            </h1>
            <p className="mt-1 text-sm text-[#8E8E93]">
              <Trans>Deploy a pre-tuned autonomous agent in 1 click, or design your own custom agent:</Trans>
            </p>

            {/* Segmented Control Tabs */}
            <div className="mt-4 mb-4 flex items-center p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
              <button
                type="button"
                onClick={() => setViewMode("catalog")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  viewMode === "catalog"
                    ? "bg-[#0071E3] text-white shadow-sm"
                    : "text-[#8E8E93] hover:text-white"
                }`}
              >
                ✨ Sena Catalog ({AGENT_CATALOG.length} Agents)
              </button>
              <button
                type="button"
                onClick={() => setViewMode("custom")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  viewMode === "custom"
                    ? "bg-[#0071E3] text-white shadow-sm"
                    : "text-[#8E8E93] hover:text-white"
                }`}
              >
                🛠️ Custom Builder
              </button>
            </div>

            {viewMode === "catalog" ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1 rk-scroll">
                  {AGENT_CATALOG.slice(0, 8).map((p) => {
                    const isSelected = selectedTemplateId === p.id || name === p.name;
                    return (
                      <div
                        key={p.id}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? "border-[#0071E3] bg-[#0071E3]/15 text-white"
                            : "border-white/10 bg-white/5 text-[#8E8E93] hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <div className="font-bold text-[13px] text-white flex items-center gap-1.5">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: p.color }}
                              />
                              <span>{p.name}</span>
                              {p.nameRegional ? (
                                <span className="text-[10px] text-[#FFA447] font-medium">
                                  ({p.nameRegional})
                                </span>
                              ) : null}
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-[#A8A8AD]">
                              {p.categoryLabel}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#A8A8AD] leading-tight mb-2 line-clamp-2">
                            {p.description}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                          <div className="flex gap-1">
                            {p.skills.slice(0, 2).map((s) => (
                              <span
                                key={s}
                                className="text-[9px] px-1 py-0.5 rounded bg-white/5 text-[#636366]"
                              >
                                #{s}
                              </span>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setName(p.name);
                              setTitle(p.title);
                              setDescription(p.description);
                              setInstructions(p.instructions);
                              setColor(p.color);
                              setSelectedTemplateId(p.id);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                              isSelected
                                ? "bg-[#0071E3] text-white"
                                : "bg-white/10 hover:bg-white/20 text-[#F5F5F7]"
                            }`}
                          >
                            {isSelected ? "Selected ✓" : "Select"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {name ? (
                  <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[#8E8E93]">Ready to deploy:</div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <span>{name}</span>
                        <span className="text-xs font-normal text-[#A8A8AD]">— {title}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => void createBot()}
                      className="mac-pill-btn bg-[#0071E3] hover:bg-[#0077ED] px-5 py-2 text-xs font-semibold text-white shadow-md transition"
                    >
                      <Trans>Deploy & Launch →</Trans>
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div>
                <label className="mt-2 block text-sm text-[#8E8E93]">
                  <Trans>Name</Trans>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t`Name this bot (e.g. Munimji, Code Reviewer)`}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#16161E] px-4 py-2.5 text-[#F5F5F7] outline-none focus:border-[#0071E3] transition text-sm"
                  />
                </label>
                <label className="mt-3 block text-sm text-[#8E8E93]">
                  <Trans>Title</Trans>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t`Role title (e.g. Tax & Invoicing Specialist)`}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#16161E] px-4 py-2.5 text-[#F5F5F7] outline-none focus:border-[#0071E3] transition text-sm"
                  />
                </label>
                <label className="mt-3 block text-sm text-[#8E8E93]">
                  <Trans>Description</Trans>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t`What this agent does and its focus areas`}
                    rows={2}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#16161E] px-4 py-2.5 text-[#F5F5F7] outline-none focus:border-[#0071E3] transition text-sm"
                  />
                </label>
                <label className="mt-3 block text-sm text-[#8E8E93]">
                  <Trans>Custom Instructions / System Prompt</Trans>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder={t`Define the agent's persona, reasoning rules, or formatting preferences...`}
                    rows={3}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#16161E] px-4 py-2.5 text-[#F5F5F7] outline-none focus:border-[#0071E3] transition text-xs font-mono"
                  />
                </label>
                <button
                  type="button"
                  disabled={!name.trim()}
                  onClick={() => void createBot()}
                  className="mt-5 mac-pill-btn bg-[#0071E3] hover:bg-[#0077ED] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40 shadow-lg shadow-[#0071E3]/25 transition"
                >
                  <Trans>Deploy Custom Agent →</Trans>
                </button>
              </div>
            )}

            {error ? <p className="mt-3 text-sm text-[#FF453A]">{error}</p> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
