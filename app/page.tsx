"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Upload, ArrowRight, ShieldCheck, Users, Loader2, Instagram } from 'lucide-react';
import JSZip from 'jszip';
import { useData } from '@/context/DataContext';

export default function Home() {
  const { setZipData, setLoading, loading } = useData();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const zip = await JSZip.loadAsync(file);
      const extractedData: Record<string, any> = {};

      const targetFolder = "connections/followers_and_following/";

      const promises: Promise<void>[] = [];

      zip.forEach((relativePath, fileEntry) => {
        if (relativePath.startsWith(targetFolder) && relativePath.endsWith('.json')) {
          const fileName = relativePath.replace(targetFolder, '');

          const promise = fileEntry.async("string").then((content) => {
            try {
              extractedData[fileName] = JSON.parse(content);
            } catch (e) {
              console.error(`Erro ao processar JSON: ${fileName}`);
            }
          });

          promises.push(promise);
        }
      });

      await Promise.all(promises);

      if (Object.keys(extractedData).length === 0) {
        alert("Nenhum dado do Instagram encontrado. Verifique se carregou o arquivo ZIP correto.");
        setLoading(false);
        return;
      }

      setZipData(extractedData);
      router.push('/panel/nao-me-seguem');

    } catch (error) {
      console.error("Erro ao ler ZIP:", error);
      alert("Erro ao processar o arquivo ZIP.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ebebeb] text-[#131313] flex flex-col font-sans relative">

      {loading && (
        <div className="fixed inset-0 z-50 bg-[#ebebeb]/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-[#3a5efc] animate-spin mb-4" />
            <h3 className="text-xl font-bold mb-2">Processando ZIP</h3>
            <p className="text-gray-500 text-sm max-w-[200px]">
              Organizando seus seguidores e seguindo. Isso leva apenas alguns segundos...
            </p>
          </div>
        </div>
      )}

      <nav className="p-6 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-2xl font-black tracking-tighter text-[#3a5efc]">FNF</h1>
        <Link
          href="/ajuda"
          className="text-sm font-medium hover:text-[#3a5efc] transition-colors"
        >
          Como exportar?
        </Link>
      </nav>

      <main className="flex-1 flex flex-col px-6 pt-12 pb-20 max-w-md mx-auto w-full">

        <div className="space-y-6 text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4">
            <Users size={32} className="text-[#3a5efc]" />
          </div>

          <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight">
            Descubra quem não te <span className="text-[#3a5efc]">segue de volta.</span>
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed">
            Analise seus dados do Instagram de forma privada, rápida e sem precisar fazer login com sua senha.
          </p>
        </div>

        <Link
          href="https://instagram.com/vinn_lopes"
          target="_blank"
          className="mb-6 flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-[2rem] border border-white shadow-lg shadow-gray-200/50 transition-all active:scale-[0.98] group"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[2px]">
                <div className="w-full h-full rounded-full bg-white p-[2px]">
                  <img 
                    src="/perfil.jpg"
                    alt="Perfil"
                    className="w-full h-full rounded-full object-cover bg-gray-100"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white rounded-full p-1 border-2 border-white shadow-sm">
                <Instagram size={10} strokeWidth={3} />
              </div>
            </div>

            <div className="text-left">
              <p className="text-xs font-bold text-gray-400 leading-none mb-1 uppercase tracking-tight">Desenvolvedor</p>
              <h4 className="text-base font-black text-[#131313]">@vinn_lopes</h4>
              <p className="text-[11px] text-gray-500">Visite o perfil</p>
            </div>
          </div>

          <div className="bg-[#f0f2ff] text-[#3a5efc] px-4 py-2 rounded-xl text-xs font-bold group-hover:bg-[#3a5efc] group-hover:text-white transition-colors">
            Seguir
          </div>
        </Link>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-[#3a5efc]/10 rounded-full flex items-center justify-center text-[#3a5efc]">
            <Upload size={28} />
          </div>

          <div>
            <h3 className="font-bold text-xl mb-2">Pronto para começar?</h3>
            <p className="text-sm text-gray-500">
              Selecione o arquivo .zip exportado do seu Instagram.
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".zip"
            className="hidden"
          />

          <button
            disabled={loading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-[#3a5efc] hover:bg-[#2a4edc] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#3a5efc]/30 disabled:opacity-50"
          >
            {loading ? "Processando..." : "Carregar Arquivo ZIP"}
            {!loading && <ArrowRight size={20} />}
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4">
          <div className="flex items-start gap-4 p-4 bg-white/40 rounded-2xl">
            <ShieldCheck className="text-green-600 shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-sm">Privacidade Total</h4>
              <p className="text-xs text-gray-500">O processamento é feito 100% no seu navegador. Seus dados nunca são enviados para um servidor.</p>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-10 text-center">
          <Link href="/ajuda" className="group text-sm font-semibold text-[#3a5efc] inline-flex items-center gap-1">
            Não tem o arquivo? Veja o tutorial
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}