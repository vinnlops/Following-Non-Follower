"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, ShieldCheck, Download, Info } from 'lucide-react';

export default function Ajuda() {
    const etapas = [
        {
            titulo: "Perfil",
            descricao: "No seu perfil do Instagram, clique no icone para acessar 'Configurações e atividades'.",
            imagem: "/help/2.jpg",
        },
        {
            titulo: "Configurações e atividade",
            descricao: "Nas configurações, selecione a opção 'Central de Contas'.",
            imagem: "/help/2.jpg",
        },
        {
            titulo: "Suas informações e permissões",
            descricao: "Após acessar o 'Central de contas', procure pela opção 'Suas informações e permissões'.",
            imagem: "/help/3.jpg",
        },
        {
            titulo: "Exportar suas informações",
            descricao: "Selecione a opção 'Exportar suas informações'.",
            imagem: "/help/4.jpg",
        },
        {
            titulo: "Criar exportação",
            descricao: "Nesta aba, é possivel visualizar suas ultimas exportações dentro de quatro dias. Para criar sua primeira exportação, clique em 'Criar exportação'",
            imagem: "/help/5.jpg",
        },
        {
            titulo: "Exportar para dispositivo",
            descricao: "Clique em 'Exportar para dispositivo'",
            imagem: "/help/6.jpg",
        },
        {
            titulo: "Notificar",
            descricao: "Na primeira opção, você pode escolher algum email vinculado a conta para receber o link de download do arquivo. Se nao reconhecer o email ou nao ter acesso a ele, vincule outro nas configurações da conta.",
            imagem: "/help/7.jpg",
        },
        {
            titulo: "Personalizar informações",
            descricao: "Para sua total segurança, selecione apenas a opção 'Seguidores e Seguindo'. Isso garante que apenas os nomes de usuário sejam analisados. Nosso sistema processa tudo localmente no seu navegador, não compartilhe o arquivo com outras pessoas caso queira ter privacidade na sua atividade de seguidores.",
            imagem: "/help/8.jpg",
        },
        {
            titulo: "Seguidores e Seguindo",
            descricao: "Limpe todos os dados da exportação e mantenha apenas 'Seguidores e Seguindo' selecionado. Isso garante segurança nos dados e reduz o tamanho do arquivo final.",
            imagem: "/help/10.jpg",
        },
        {
            titulo: "Intervalo de datas",
            descricao: "Por aqui, é possivel filtrar a data de atividade desejada.",
            imagem: "/help/11.jpg",
        },
        {
            titulo: "Intervalo de datas",
            descricao: "Vamos selecionar 'Desde o ínicio' para receber dados desde a criação da conta.",
            imagem: "/help/12.jpg",
        },
        {
            titulo: "Formato JSON",
            descricao: "Selecione o formato JSON. Essa etapa é 'Crucial' para o sistema conseguir ler os dados do arquivo.",
            imagem: "/help/13.jpg",
        },
        {
            titulo: "Iniciar exportação",
            descricao: "Por fim, inicie o processo de exportação.",
            imagem: "/help/15.jpg",
        },
        {
            titulo: "Baixar arquivo",
            descricao: "Assim que a exportação for concluída, você receberá um email informando. Acesse este mesmo painel para instalar arquivo.",
            imagem: "/help/16.jpg",
        },
    ];

    return (
        <div className="min-h-screen bg-[#ebebeb] text-[#131313] flex flex-col font-sans relative pb-20">

            {/* BOTÃO VOLTAR FLUTUANTE (MOBILE & DESKTOP) */}
            <Link
                href="/"
                className="fixed bottom-6 left-6 z-50 bg-[#3a5efc] text-white p-4 rounded-full shadow-2xl hover:bg-[#2a4edc] transition-all active:scale-90 flex items-center justify-center border-4 border-white"
            >
                <ArrowLeft size={24} />
            </Link>

            <nav className="p-6 flex items-center bg-white/50 backdrop-blur-md sticky top-0 z-10">
                <Link href="/" className="mr-4 text-[#3a5efc] hover:opacity-70 transition-opacity">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-xl font-black tracking-tighter text-[#3a5efc]">TUTORIAL DE AJUDA</h1>
            </nav>

            <main className="flex-1 flex flex-col px-6 pt-8 max-w-2xl mx-auto w-full">

                {/* CABEÇALHO */}
                <div className="space-y-4 text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-2">
                        <HelpCircle size={32} className="text-[#3a5efc]" />
                    </div>
                    <h2 className="text-3xl font-extrabold leading-tight tracking-tight">
                        Como exportar seus dados do <span className="text-[#3a5efc]">Instagram</span>
                    </h2>
                    <div className="bg-white/60 p-4 rounded-2xl border border-white flex gap-3 text-left">
                        <ShieldCheck className="text-green-600 shrink-0" size={20} />
                        <p className="text-sm text-gray-600 leading-snug">
                            Este processo utiliza apenas a ferramenta oficial de exportação do <strong>Instagram</strong>. É 100% seguro e você não precisa fornecer sua senha para nós.
                        </p>
                    </div>

                    <div className="mt-16 p-6 bg-[#3a5efc]/5 rounded-[2rem] border border-[#3a5efc]/10 text-center">
                        <Info size={24} className="mx-auto text-[#3a5efc] mb-3" />
                        <h4 className="font-bold mb-1">Importante</h4>
                        <p className="text-xs text-gray-500">
                            O Instagram pode levar de alguns minutos a algumas horas para gerar o arquivo.
                            Assim que receber o link no seu e-mail, volte para 'Exportar suas informações' para instalar arquivo e carregue-o na pagina inicial!
                        </p>
                    </div>
                </div>

                {/* ETAPAS */}
                <div className="space-y-12 p-5">
                    {etapas.map((etapa, index) => (
                        <div key={index} className="flex flex-col space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="bg-[#3a5efc] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                    {index + 1}
                                </span>
                                <h3 className="font-bold text-lg">{etapa.titulo}</h3>
                            </div>

                            <div className="bg-white p-3 rounded-[2rem] shadow-md border border-white overflow-hidden">
                                {/* Container que se ajusta à imagem */}
                                <div className="w-full flex items-center justify-center rounded-[1.5rem] mb-4 overflow-hidden bg-gray-50 border border-gray-100">
                                    <img
                                        src={etapa.imagem}
                                        alt={etapa.titulo}
                                        className="w-full h-auto block" // h-auto garante que a altura siga a proporção original
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://placehold.co/600x400/f3f4f6/3a5efc?text=Captura+de+Tela";
                                        }}
                                    />
                                </div>
                                <p className="px-3 pb-3 text-gray-600 text-sm leading-relaxed">
                                    {etapa.descricao}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link href="/" className="text-[#3a5efc] font-bold text-sm hover:underline">
                        Voltar para o Início
                    </Link>
                </div>
            </main>
        </div>
    );
}