// app/nc/page.tsx
'use client';
import { useState, useEffect } from 'react';
import PageShell from '@/components/PageShell';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import FormLayout from '@/components/FormLayout';

export default function NCPage() {
  const [ncs, setNcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchNcs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/nc');
      if (response.ok) {
        const data = await response.json();
        setNcs(data);
      } else {
        setNcs([]);
      }
    } catch (error) {
      console.error('Failed to fetch non-conformities:', error);
      setNcs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNcs();
  }, []);

  const handleAddNc = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newNc = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/nc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNc),
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchNcs(); // Recarrega a lista
      } else {
        console.error('Failed to add non-conformity');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const columns = [
    { label: 'Código da NC', field: 'nc_code' },
    { label: 'Tipo', field: 'type' },
    { label: 'Status', field: 'status' },
    {
      label: 'Amostra',
      field: 'samples',
      render: (row: any) => row.samples?.sample_code || row.sample_id || 'N/A',
    },
    { label: 'Criado em', field: 'created_at' },
  ];

  return (
    <PageShell>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Lista de Não Conformidades
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Adicionar NC
        </button>
      </div>
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={ncs}
          loading={loading}
          emptyMessage="Nenhuma não conformidade encontrada."
        />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Nova Não Conformidade">
        <FormLayout onSubmit={handleAddNc}>
            <input name="nc_code" placeholder="Código da NC" required className="w-full p-2 border rounded"/>
            <select name="type" required className="w-full p-2 border rounded">
                <option value="minor">Minor</option>
                <option value="major">Major</option>
                <option value="critical">Critical</option>
            </select>
            <input name="sample_id" placeholder="ID da Amostra (Opcional)" className="w-full p-2 border rounded"/>
            <button type="submit" className="w-full p-2 bg-green-500 text-white rounded-md">Salvar</button>
        </FormLayout>
      </Modal>
    </PageShell>
  );
}
