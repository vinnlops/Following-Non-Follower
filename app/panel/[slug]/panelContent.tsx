"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useData } from "@/context/DataContext";
import { ExternalLink, UserCircle2 } from "lucide-react";

export default function PanelContent() {
    const { slug } = useParams();
    const { zipData } = useData();
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        // ao mudar de rota (slug) resetamos para a primeira página
        setCurrentPage(0);
    }, [slug]);

    const labels: Record<string, string> = {
        "nao-me-seguem": "Não me seguem",
        seguidores: "Seguidores",
        seguindo: "Seguindo",
        "solicitacoes-enviadas": "Solicitações Enviadas",
        "amigos-proximos": "Amigos Próximos",
        bloqueados: "Bloqueados",
        "deixou-de-seguir": "Deixou de seguir",
        "sugestoes-removidas": "Sugestões Removidas",
    };

    // Helper: lê array a partir do zipData; aceita formas variadas (array direto, objeto com chave...)
    const readArray = (fileOrKey: string, key?: string) => {
        if (!zipData) return [];
        const file = zipData[fileOrKey];
        if (!file) return [];
        const raw = key ? file[key] : (Array.isArray(file) ? file : Object.values(file)[0]);
        return Array.isArray(raw) ? raw : [];
    };

    // Helper: coleta arquivos sequenciais com base no "base" (ex: 'followers' -> followers, followers_1, followers_2...)
    const collectSequencedFiles = (base: string) => {
        if (!zipData) return [];
        const regex = new RegExp(`^${base}(?:_(\\d+))?(?:\\.json)?$`, "i");
        return Object.keys(zipData)
            .map((k) => {
                const m = k.match(regex);
                if (!m) return null;
                const idx = m[1] ? parseInt(m[1], 10) : 0;
                return { key: k, idx };
            })
            .filter(Boolean)
            .sort((a: any, b: any) => a.idx - b.idx)
            .map((x: any) => x.key);
    };

    // Para casos onde não temos o padrão exato do nome do arquivo, tenta encontrar variações contendo o termo
    const collectFilesContaining = (term: string) => {
        if (!zipData) return [];
        const lowered = term.toLowerCase();
        const possible = Object.keys(zipData).filter((k) => k.toLowerCase().includes(lowered));
        const regex = new RegExp(`(.*?)(?:_(\\d+))?(?:\\.json)?$`, "i");
        return possible
            .map((k) => {
                const m = k.match(regex);
                const idx = m && m[2] ? parseInt(m[2], 10) : 0;
                return { key: k, idx };
            })
            .sort((a, b) => a.idx - b.idx)
            .map((x) => x.key);
    };

    // Calcula páginas (array de arrays) e items da página atual, além do total
    const { pageItems, pageCount, totalCount } = useMemo(() => {
        if (!zipData) return { pageItems: [], pageCount: 0, totalCount: 0 };

        // seguidores
        if (slug === "seguidores") {
            const followerKeys = collectSequencedFiles("followers");
            const keys = followerKeys.length ? followerKeys : collectFilesContaining("followers");
            const pages = keys.map((k) => readArray(k));
            const total = pages.reduce((s, p) => s + (p?.length || 0), 0);
            const items = pages[currentPage] || [];
            return { pageItems: items, pageCount: pages.length || 1, totalCount: total };
        }

        // seguindo
        if (slug === "seguindo") {
            const followingKeys = collectSequencedFiles("following");
            const keys = followingKeys.length ? followingKeys : collectFilesContaining("following");
            const pages = keys.map((k) => {
                const data = zipData[k];
                const raw = data?.relationships_following || (Array.isArray(data) ? data : Object.values(data || {})[0]);
                return Array.isArray(raw) ? raw : [];
            });
            const total = pages.reduce((s, p) => s + (p?.length || 0), 0);
            const items = pages[currentPage] || [];
            return { pageItems: items, pageCount: pages.length || 1, totalCount: total };
        }

        // nao-me-seguem
        if (slug === "nao-me-seguem") {
            const followerKeys = collectSequencedFiles("followers");
            const followerKeysResolved = followerKeys.length ? followerKeys : collectFilesContaining("followers");
            const allFollowersUsernames = new Set<string>();
            followerKeysResolved.forEach((f) => {
                readArray(f).forEach((item: any) => {
                    const name = item?.string_list_data?.[0]?.value || item?.title || "";
                    if (name) allFollowersUsernames.add(name);
                });
            });

            const followingKeys = collectSequencedFiles("following");
            const followingKeysResolved = followingKeys.length ? followingKeys : collectFilesContaining("following");
            const pages = followingKeysResolved.map((k) => {
                const raw = zipData[k];
                const arr = raw?.relationships_following || (Array.isArray(raw) ? raw : Object.values(raw || {})[0]);
                const list = Array.isArray(arr) ? arr : [];
                return list.filter((user: any) => {
                    const username = user?.string_list_data?.[0]?.value || user?.title || "";
                    return !allFollowersUsernames.has(username);
                });
            });

            if (pages.length === 0) {
                const fallback = zipData["following.json"] || zipData["following"];
                const arr = fallback?.relationships_following || (Array.isArray(fallback) ? fallback : Object.values(fallback || {})[0]);
                const list = Array.isArray(arr) ? arr : [];
                const filtered = list.filter((user: any) => {
                    const username = user?.string_list_data?.[0]?.value || user?.title || "";
                    return !allFollowersUsernames.has(username);
                });
                return { pageItems: filtered, pageCount: 1, totalCount: filtered.length };
            }

            const total = pages.reduce((s, p) => s + (p?.length || 0), 0);
            const items = pages[currentPage] || [];
            return { pageItems: items, pageCount: pages.length || 1, totalCount: total };
        }

        // sugestoes-removidas
        if (slug === "sugestoes-removidas") {
            let keys = collectSequencedFiles("removed_suggestions");
            if (keys.length === 0) keys = collectFilesContaining("removed_suggestions");
            if (keys.length === 0) keys = collectFilesContaining("removed");
            if (keys.length) {
                const pages = keys.map((k) => readArray(k));
                const total = pages.reduce((s, p) => s + (p?.length || 0), 0);
                return { pageItems: pages[currentPage] || [], pageCount: pages.length || 1, totalCount: total };
            }
            return { pageItems: [], pageCount: 0, totalCount: 0 };
        }

        // solicitacoes-enviadas
        if (slug === "solicitacoes-enviadas") {
            let keys = collectSequencedFiles("pending_follow_requests");
            if (keys.length === 0) keys = collectFilesContaining("pending_follow");
            if (keys.length) {
                const pages = keys.map((k) => {
                    const data = zipData[k];
                    const arr = data?.relationships_follow_requests_sent || (Array.isArray(data) ? data : Object.values(data || {})[0]);
                    return Array.isArray(arr) ? arr : [];
                });
                const total = pages.reduce((s, p) => s + (p?.length || 0), 0);
                return { pageItems: pages[currentPage] || [], pageCount: pages.length || 1, totalCount: total };
            }
            const data =
                zipData["pending_follow_requests.json"] ||
                zipData["pending_follow_requests"] ||
                Object.values(zipData).find((k) => /pending_follow/i.test(JSON.stringify(k || "")));
            const items = data?.relationships_follow_requests_sent || (Array.isArray(data) ? data : Object.values(data || {})[0]);
            const arrItems = Array.isArray(items) ? items : [];
            return { pageItems: arrItems, pageCount: 1, totalCount: arrItems.length };
        }

        // mapeamentos genéricos
        const fileMapping: Record<string, { base: string; key: string }> = {
            "pending_follows": { base: "pending_follow_requests", key: "relationships_follow_requests_sent" },
            cfs: { base: "close_friends", key: "relationships_close_friends" },
            blocked: { base: "blocked_profiles", key: "relationships_blocked_users" },
            recently_unfollow: { base: "recently_unfollowed_profiles", key: "relationships_unfollowed_users" },
        };

        const slugToMappingKey: Record<string, string> = {
            "amigos-proximos": "cfs",
            bloqueados: "blocked",
            "deixou-de-seguir": "recently_unfollow",
        };

        const mappingKey = slugToMappingKey[slug as string];
        if (mappingKey) {
            const config = fileMapping[mappingKey];
            if (config) {
                const keys = collectSequencedFiles(config.base).length
                    ? collectSequencedFiles(config.base)
                    : collectFilesContaining(config.base);
                if (keys.length) {
                    const pages = keys.map((k) => {
                        const data = zipData[k];
                        const arr = data?.[config.key] || (Array.isArray(data) ? data : Object.values(data || {})[0]);
                        return Array.isArray(arr) ? arr : [];
                    });
                    const total = pages.reduce((s, p) => s + (p?.length || 0), 0);
                    return { pageItems: pages[currentPage] || [], pageCount: pages.length || 1, totalCount: total };
                } else {
                    const data = zipData[config.base + ".json"] || zipData[config.base];
                    const arr = data?.[config.key] || (Array.isArray(data) ? data : Object.values(data || {})[0]);
                    const list = Array.isArray(arr) ? arr : [];
                    return { pageItems: list, pageCount: 1, totalCount: list.length };
                }
            }
        }

        return { pageItems: [], pageCount: 0, totalCount: 0 };
    }, [zipData, slug, currentPage]);

    if (!zipData || Object.keys(zipData).length === 0) return null;

    const headerLabel = slug ? labels[slug as string] || slug.toString().replace(/-/g, " ") : "";
    const badgeCount = typeof (pageItems as any) !== "undefined" ? (Array.isArray(pageItems) ? pageItems.length : 0) : 0;

    // classes minimalistas para botões (sem borda, arredondado discreto)
    const btnClass = "px-3 py-1 rounded-md text-sm transition-all inline-flex items-center gap-2";
    const btnDefault = `${btnClass} bg-transparent hover:bg-[#f3f5ff]`;
    const btnActive = `${btnClass} bg-[#3a5efc] text-white`;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8">
                <h2 className="text-3xl font-black text-[#131313] capitalize tracking-tight">
                    {headerLabel}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                    <span className="text-[#3a5efc] font-bold text-sm bg-[#3a5efc]/10 px-3 py-1 rounded-full">
                        {typeof (totalCount) !== "undefined" && totalCount > 0 ? `${totalCount} perfis` : `${badgeCount} perfis`}
                    </span>

                    {slug === "nao-me-seguem" && <span className="text-xs text-gray-400 font-medium">(Pessoas queão te seguem de volta)</span>}
                    {slug === "seguidores" && <span className="text-xs text-gray-400 font-medium">(Seus seguidores)</span>}
                    {slug === "seguindo" && <span className="text-xs text-gray-400 font-medium">(Pessoas que você segue)</span>}
                    {slug === "solicitacoes-enviadas" && <span className="text-xs text-gray-400 font-medium">(Pedidos para seguir pendentes)</span>}
                    {slug === "deixou-de-seguir" && <span className="text-xs text-gray-400 font-medium">(Pessoas que você deixou de seguir recentemente)</span>}
                    {slug === "sugestoes-removidas" && <span className="text-xs text-gray-400 font-medium">(Pessoas que você removeu das sugestões)</span>}
                    {slug === "amigos-proximos" && <span className="text-xs text-gray-400 font-medium">(Seus amigos próximos)</span>}
                    {slug === "bloqueados" && <span className="text-xs text-gray-400 font-medium">(Pessoas bloqueadas)</span>}
                </div>

                <p className="mt-3 text-xs text-red-400 font-medium">
                    * Algumas contas podem estar inativas, desativadas ou excluídas pelo Instagram e ainda assim aparecer nesta lista.
                </p>
            </header>

            <div className="grid gap-3">
                {(pageItems && (pageItems as any).length > 0) ? (
                    (pageItems as any).map((item: any, index: number) => {
                        const userData = item?.string_list_data?.[0];
                        const username = userData?.value || item?.title || "Usuário";

                        return (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-3xl flex items-center justify-between shadow-sm border border-white hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                        <UserCircle2 size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#131313] text-sm italic">@{username}</span>
                                        {userData?.timestamp && (
                                            <span className="text-[10px] text-gray-400 font-medium">Desde {new Date(userData.timestamp * 1000).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                </div>
                                <a
                                    href={userData?.href || `https://instagram.com/${username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 bg-transparent hover:bg-[#f3f5ff] text-[#131313] rounded-md transition-all inline-flex items-center"
                                >
                                    <ExternalLink size={16} />
                                </a>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">Tudo limpo! Ninguém encontrado aqui.</p>
                    </div>
                )}
            </div>

            {/* PAGINAÇÃO — agora embaixo da lista */}
            {(pageCount && pageCount > 1) && (
                <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                            className={btnDefault}
                            aria-label="Página anterior"
                        >
                            ← Anterior
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: pageCount }).map((_, i) => {
                                // limitar a renderização direta para evitar overflow: se muitas páginas, mostramos primeiros 5, último e próximo ao atual
                                if (pageCount > 12) {
                                    // lógica compacta:
                                    if (i < 3 || i >= pageCount - 3 || (i >= currentPage - 1 && i <= currentPage + 1)) {
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i)}
                                                className={currentPage === i ? btnActive : btnDefault}
                                                aria-current={currentPage === i ? "page" : undefined}
                                            >
                                                {i + 1}
                                            </button>
                                        );
                                    }
                                    if (i === 3 && currentPage > 4) {
                                        return <span key="ellipsis-start" className="px-2 text-sm text-gray-400">…</span>;
                                    }
                                    if (i === pageCount - 4 && currentPage < pageCount - 5) {
                                        return <span key="ellipsis-end" className="px-2 text-sm text-gray-400">…</span>;
                                    }
                                    return null;
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i)}
                                        className={currentPage === i ? btnActive : btnDefault}
                                        aria-current={currentPage === i ? "page" : undefined}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage((p) => Math.min((pageCount || 1) - 1, p + 1))}
                            className={btnDefault}
                            aria-label="Próxima página"
                        >
                            Próxima →
                        </button>
                    </div>

                    <div className="text-sm text-gray-500">
                        Página {currentPage + 1} de {pageCount} {totalCount ? `· ${totalCount} total` : ""}
                    </div>
                </div>
            )}
        </div>
    );
}
