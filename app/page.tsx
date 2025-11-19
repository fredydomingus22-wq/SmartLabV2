// app/page.tsx
import PageShell from '@/components/PageShell';

export default function HomePage() {
  return (
    <PageShell>
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Dashboard Geral
      </h1>
      <div className="mt-4">
        {/* Aqui entrarão os KPIs e gráficos do dashboard */}
        <p className="text-gray-600 dark:text-gray-400">
          Bem-vindo ao SMARTLIMS ENTERPRISE 4.0.
        </p>
      </div>
    </PageShell>
  );
}
