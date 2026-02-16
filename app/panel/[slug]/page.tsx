// app/panel/[slug]/page.tsx
import PanelContent from "./panelContent";

// 1. Definimos os slugs para o Build Estático
export function generateStaticParams() {
  const slugs = [
    "nao-me-seguem",
    "seguidores",
    "seguindo",
    "solicitacoes-enviadas",
    "amigos-proximos",
    "bloqueados",
    "deixou-de-seguir",
    "sugestoes-removidas",
  ];

  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// 2. A página principal apenas renderiza o conteúdo de cliente
export default function Page() {
  return <PanelContent />;
}