"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import {
  Menu,
  X,
  Users,
  UserMinus,
  UserCheck,
  ShieldAlert,
  Star,
  Clock,
  UserSearch,
  Ghost,
} from "lucide-react";

const menuItems = [
  { id: "nao-me-seguem", name: "Não me seguem", icon: Ghost },
  { id: "seguidores", name: "Seguidores", icon: Users },
  { id: "seguindo", name: "Seguindo", icon: UserCheck },
  { id: "solicitacoes-enviadas", name: "Solicitações Enviadas", icon: Clock },
  { id: "amigos-proximos", name: "Amigos Próximos", icon: Star },
  { id: "bloqueados", name: "Bloqueados", icon: ShieldAlert },
  { id: "deixou-de-seguir", name: "Deixou de seguir", icon: UserMinus },
  { id: "sugestoes-removidas", name: "Sugestões Removidas", icon: UserSearch },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { setZipData, setLoading } = useData();

  const handleLogout = () => {
    setZipData({});
    setLoading(false);
    setIsSidebarOpen(false);
    router.push("/");
  };

  const [firstItem, ...otherItems] = menuItems;

  return (
    <div className="min-h-screen bg-[#ebebeb] flex flex-col md:flex-row font-sans">
      <header className="md:hidden bg-white p-4 flex justify-between items-center sticky top-0 z-40 border-b border-gray-200">
        <h1 className="text-xl font-black text-[#3a5efc] tracking-tighter">FNF</h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-gray-100 rounded-lg text-[#131313]"
          aria-label="Abrir menu"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky md:top-0 md:left-0 md:h-screen inset-y-0 left-0 w-72 bg-white z-40 transform transition-transform duration-300 ease-in-out border-r border-gray-200 p-6 flex flex-col
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="hidden md:block mb-10">
          <h1 className="text-3xl font-black text-[#3a5efc] tracking-tighter text-center">FNF</h1>
        </div>

        <div className="md:hidden mb-4 flex items-center justify-between">
          <h1 className="text-xl font-black text-[#3a5efc]">FNF</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto pr-2">
          <div className="mb-3">
            {firstItem && (() => {
              const isActive = pathname === `/panel/${firstItem.id}`;
              const Icon = firstItem.icon;
              return (
                <Link
                  href={`/panel/${firstItem.id}`}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-2xl font-bold transition-all ${
                    isActive
                      ? "bg-[#3a5efc] text-white shadow-lg shadow-[#3a5efc]/20 scale-[1.02]"
                      : "text-gray-500 hover:bg-gray-100 hover:text-[#131313]"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm">{firstItem.name}</span>
                </Link>
              );
            })()}
          </div>

          <div className="border-t border-gray-200 my-4" />

          <div className="space-y-1">
            {otherItems.map((item) => {
              const isActive = pathname === `/panel/${item.id}`;
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={`/panel/${item.id}`}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-2xl font-bold transition-all ${
                    isActive
                      ? "bg-[#3a5efc] text-white shadow-lg shadow-[#3a5efc]/20 scale-[1.02]"
                      : "text-gray-500 hover:bg-gray-100 hover:text-[#131313]"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full text-left text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
          >
            ← Sair e Limpar Dados
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 w-full overflow-auto">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
