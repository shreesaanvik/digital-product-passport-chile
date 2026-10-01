"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppHeader } from "./AppHeader";
import { AnimatedCounter } from "./AnimatedCounter";
import { BottomNav } from "./BottomNav";
import { CLUSTERS } from "@/lib/data";
import { GovIdSync } from "./GovIdSync";
import type { MainNavTab } from "./NavMenuDrawer";
import { NavMenuDrawer } from "./NavMenuDrawer";
import { OrderCard } from "./OrderCard";
import { PassportPanel } from "./PassportPanel";
import { PayCategoryScreen } from "./PayCategoryScreen";
import { ReportsCategoryScreen } from "./ReportsCategoryScreen";
import { RfpCategoryScreen } from "./RfpCategoryScreen";

const IndiaMap = dynamic(
  () => import("./IndiaMap").then((m) => m.IndiaMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="relative w-full min-h-[260px] max-h-[320px] rounded-2xl bg-gradient-to-b from-slate-100 to-white shadow-neu border border-slate-200/80 flex items-center justify-center text-fm-muted text-sm"
        role="status"
        aria-live="polite"
      >
        Loading map…
      </div>
    ),
  },
);

const CLUSTER_SEARCH_ALIASES: Record<string, string> = {
  vns: "banarasi silk zari brocade handloom varanasi",
  kutch: "ajrakh block print gi tag kutch natural dye",
  kanchi: "kanchipuram kanjeevaram temple silk gi",
  jaipur: "bandhani tie dye gems jaipur rajasthan",
  murshidabad: "murshidabad silk bengal handloom",
};

type Cluster = (typeof CLUSTERS)[number];

function clusterHaystack(c: Cluster) {
  return `${c.name} ${c.craft} ${c.orderCode} ${c.id} ${CLUSTER_SEARCH_ALIASES[c.id] ?? ""}`.toLowerCase();
}

function filterClusters(query: string): Cluster[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...CLUSTERS];
  const terms = q.split(/\s+/).filter(Boolean);
  return CLUSTERS.filter((c) => {
    const haystack = clusterHaystack(c);
    return terms.every((term) => haystack.includes(term));
  });
}

export function HomeExperience() {
  const [clusterId, setClusterId] = useState<string | null>("vns");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const passportRef = useRef<HTMLElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [navTab, setNavTab] = useState<MainNavTab>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingPassportScroll = useRef(false);

  const searchMatches = useMemo(() => filterClusters(searchQuery), [searchQuery]);
  const searchActive = searchQuery.trim().length > 0;
  const matchedIds = searchActive ? searchMatches.map((c) => c.id) : null;

  const selectCluster = useCallback((id: string) => {
    setClusterId(id);
    setSearchOpen(false);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (searchRef.current?.contains(e.target as Node)) return;
      setSearchOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [searchOpen]);

  const selectTab = useCallback((tab: MainNavTab) => {
    setNavTab(tab);
  }, []);

  const scrollToPassport = useCallback(() => {
    if (navTab !== "home") {
      pendingPassportScroll.current = true;
      setNavTab("home");
      return;
    }
    passportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [navTab]);

  useEffect(() => {
    if (navTab !== "home" || !pendingPassportScroll.current) return;
    pendingPassportScroll.current = false;
    const t = window.setTimeout(() => {
      passportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [navTab]);

  const cluster = clusterId ? CLUSTERS.find((c) => c.id === clusterId) : null;

  return (
    <>
      <AppHeader menuOpen={menuOpen} onMenuClick={() => setMenuOpen((o) => !o)} />

      <NavMenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelectTab={(tab) => {
          setNavTab(tab);
          setMenuOpen(false);
        }}
        activeTab={navTab}
      />

      <main className="mx-auto max-w-lg px-4 pb-28 pt-2">
        {navTab === "home" && (
          <>
            <p className="text-center text-fm-muted text-sm mb-4 px-2">
              Big buttons, plain words. Your steward can help on a shared phone —
              no account needed for this tour.
            </p>

            <nav className="flex flex-wrap justify-center gap-2 mb-6" aria-label="Jump to section">
              {(
                [
                  ["#impact", "Impact"],
                  ["#verify", "ID check"],
                  ["pay", "Fair pay"],
                  ["#passport", "Passport"],
                ] as const
              ).map(([target, label]) =>
                target === "pay" ? (
                  <button
                    key="pay"
                    type="button"
                    onClick={() => selectTab("pay")}
                    className="min-h-[44px] inline-flex items-center rounded-full border-2 border-fm-blue/20 bg-white px-4 text-sm font-semibold text-fm-btn-text hover:bg-fm-surface"
                  >
                    {label}
                  </button>
                ) : (
                  <a
                    key={target}
                    href={target}
                    className="min-h-[44px] inline-flex items-center rounded-full border-2 border-fm-blue/20 bg-white px-4 text-sm font-semibold text-fm-btn-text hover:bg-fm-surface"
                  >
                    {label}
                  </a>
                ),
              )}
            </nav>

            <section id="impact" className="mb-8 scroll-mt-24">
              <h2 className="font-display text-lg font-semibold text-fm-blue uppercase tracking-wide mb-3">
                Active cultural clusters
              </h2>
              <IndiaMap
                selectedId={clusterId}
                onSelect={selectCluster}
                matchedIds={matchedIds}
              />
              {cluster && (
                <div
                  className="mt-4 rounded-2xl bg-white p-4 shadow-neu border border-slate-100"
                  role="region"
                  aria-live="polite"
                >
                  <p className="font-display text-xl font-semibold text-fm-ink">{cluster.name}</p>
                  <p className="text-fm-muted">{cluster.craft}</p>
                  <p className="mt-2 text-fm-ink">
                    <strong>{cluster.orders}</strong> active orders ·{" "}
                    <strong>{cluster.artisans}</strong> artisans
                  </p>
                </div>
              )}

              <div className="mt-6 rounded-2xl bg-white p-5 shadow-neu border border-fm-green/20">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-fm-green mb-2">
                  Impact metrics (demo)
                </h3>
                <p className="text-fm-muted text-sm mb-1">
                  Money kept with makers instead of lost to middle layers
                </p>
                <div className="font-display text-4xl sm:text-5xl font-bold text-fm-green tabular-nums">
                  <AnimatedCounter value={185420} />
                </div>
                <p className="text-fm-green text-sm font-medium mt-2">
                  ↑ Example uplift vs. traditional trade (illustrative)
                </p>
              </div>

              <div className="mt-6 relative" ref={searchRef}>
                <h3 className="font-display text-sm font-semibold text-fm-blue uppercase tracking-wide mb-3">
                  Start direct global sourcing
                </h3>
                <label htmlFor="cluster-search-home" className="sr-only">
                  Search heritage skill, cluster, or GI tag
                </label>
                <div className="relative">
                  <span
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fm-blue"
                    aria-hidden
                  >
                    ⌕
                  </span>
                  <input
                    id="cluster-search-home"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchOpen(true);
                    }}
                    onFocus={() => setSearchOpen(true)}
                    placeholder="Search by Heritage Skill, Cluster, or GI-Tag... e.g. Banarasi Silk"
                    className="w-full min-h-[52px] rounded-xl border-2 border-fm-blue/25 bg-white pl-11 pr-4 text-base text-fm-ink placeholder:text-fm-muted/80 shadow-neu focus:border-fm-blue focus:outline-none focus:ring-2 focus:ring-fm-blue/20"
                    role="combobox"
                    aria-expanded={searchOpen && searchActive}
                    aria-controls="cluster-search-results"
                    aria-autocomplete="list"
                    autoComplete="off"
                  />
                  {searchOpen && searchActive && (
                    <ul
                      id="cluster-search-results"
                      role="listbox"
                      className="absolute z-30 mt-2 w-full max-h-64 overflow-y-auto rounded-xl border border-fm-blue/20 bg-white py-1 shadow-lg"
                    >
                      {searchMatches.length === 0 ? (
                        <li className="px-4 py-3 text-sm text-fm-muted">
                          No clusters match &ldquo;{searchQuery.trim()}&rdquo;
                        </li>
                      ) : (
                        searchMatches.map((c) => (
                          <li key={c.id} role="option" aria-selected={clusterId === c.id}>
                            <button
                              type="button"
                              onClick={() => selectCluster(c.id)}
                              className={`w-full px-4 py-3 text-left transition-colors hover:bg-fm-btn-light ${
                                clusterId === c.id
                                  ? "bg-fm-btn-light border-l-4 border-fm-blue"
                                  : "border-l-4 border-transparent"
                              }`}
                            >
                              <span className="block font-display font-semibold text-fm-btn-text">
                                {c.name}
                              </span>
                              <span className="block text-sm text-fm-muted mt-0.5">
                                {c.craft} · {c.artisans} artisans · {c.orders} orders
                              </span>
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
                {searchActive && searchMatches.length > 0 && (
                  <p className="mt-2 text-xs text-fm-muted" aria-live="polite">
                    {searchMatches.length} cluster{searchMatches.length === 1 ? "" : "s"} highlighted on the map
                  </p>
                )}
              </div>

              <div className="mt-8 text-center flex flex-col items-center">
                <h3 className="font-display text-lg font-semibold text-fm-blue mb-3">
                  Your traceability
                </h3>
                <div className="flex flex-col items-center text-center w-full">
                  <OrderCard
                    onViewPassport={scrollToPassport}
                    orderCode={cluster?.orderCode ?? "FM-VNS-2026"}
                    locationLine={
                      cluster
                        ? `${cluster.name} · ${cluster.craft}`
                        : "Varanasi · Zari Brocade"
                    }
                  />
                </div>
              </div>
            </section>

            <section id="verify" className="mb-8 scroll-mt-24">
              <GovIdSync />
            </section>

            <section id="passport" ref={passportRef} className="mb-8 scroll-mt-24">
              <div className="mb-4 flex justify-center">
                <div className="rounded-2xl bg-white p-4 shadow-neu border border-slate-200 inline-block">
                  <div
                    className="w-40 h-40 bg-white border-4 border-fm-blue/20 rounded-lg flex items-center justify-center"
                    role="img"
                    aria-label="Demo QR code placeholder"
                  >
                    <span className="text-6xl text-fm-blue/30" aria-hidden>
                      ▣
                    </span>
                  </div>
                  <p className="text-center text-xs text-fm-muted mt-2">
                    Scan on a real label → opens this passport
                  </p>
                </div>
              </div>
              <PassportPanel
                heritageName={cluster?.name ?? "Varanasi"}
                heritageCraft={cluster?.craft ?? "Zari Brocade"}
              />
            </section>
          </>
        )}

        {navTab === "rfp" && (
          <div className="scroll-mt-24">
            <RfpCategoryScreen />
          </div>
        )}

        {navTab === "pay" && (
          <div id="money" className="scroll-mt-24">
            <PayCategoryScreen />
          </div>
        )}

        {navTab === "reports" && (
          <div id="reports" className="scroll-mt-24">
            <ReportsCategoryScreen />
          </div>
        )}
      </main>

      <BottomNav active={navTab} onChange={selectTab} />
    </>
  );
}
