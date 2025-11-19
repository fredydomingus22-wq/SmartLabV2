// app/specs/page.tsx
'use client';
import { useState, useEffect } from 'react';
import PageShell from '@/components/PageShell';
import DataTable from '@/components/DataTable';

export default function SpecsPage() {
  const [specs, setSpecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        const response = await fetch('/api/specs');
        const data = await response.json();
        setSpecs(data);
      } catch (error) {
        console.error('Failed to fetch specifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecs();
  }, []);

  const columns = [
    {
      label: 'Produto',
      field: 'products',
      render: (row: any) =>
        `${row.products?.name || 'N/A'} (${
          row.products?.product_code || row.product_id
        })`,
    },
    { label: 'Versão', field: 'version' },
    { label: 'Status', field: 'status' },
    { label: 'Criado em', field: 'created_at' },
  ];

  return (
    <PageShell>
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Lista de Especificações
      </h1>
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={specs}
          loading={loading}
          emptyMessage="Nenhuma especificação encontrada."
        />
      </div>
    </PageShell>
  );
}
