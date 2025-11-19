// app/lab/page.tsx
'use client';
import { useState, useEffect } from 'react';
import PageShell from '@/components/PageShell';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import FormLayout from '@/components/FormLayout';

export default function LabPage() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSamples = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/samples');
      if (response.ok) {
        const data = await response.json();
        setSamples(data);
      } else {
        console.error('Failed to fetch samples with status:', response.status);
        setSamples([]); // Garante que samples é um array em caso de erro
      }
    } catch (error) {
      console.error('Failed to fetch samples:', error);
      setSamples([]); // Garante que samples é um array em caso de erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSamples();
  }, []);

  const handleAddSample = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSample = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/samples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSample),
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchSamples(); // Recarrega a lista
      } else {
        console.error('Failed to add sample');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const columns = [
    { label: 'ID Amostra', field: 'sample_code' },
    { label: 'Tipo', field: 'sample_type' },
    { label: 'Produto', field: 'product_id' },
    { label: 'Linha', field: 'line_id' },
    { label: 'Status', field: 'status' },
    { label: 'Data de Coleta', field: 'collected_at' },
  ];

  return (
    <PageShell>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Lista de Amostras
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Adicionar Amostra
        </button>
      </div>
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={samples}
          loading={loading}
          emptyMessage="Nenhuma amostra encontrada."
        />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Nova Amostra">
        <FormLayout onSubmit={handleAddSample}>
            <input name="sample_code" placeholder="ID da Amostra" required className="w-full p-2 border rounded"/>
            <input name="sample_type" placeholder="Tipo de Amostra" required className="w-full p-2 border rounded"/>
            <input name="product_id" placeholder="ID do Produto" required className="w-full p-2 border rounded"/>
            <input name="line_id" placeholder="ID da Linha" className="w-full p-2 border rounded"/>
            <input name="batch_no" placeholder="Lote" className="w-full p-2 border rounded"/>
            <input name="collected_at" type="datetime-local" required className="w-full p-2 border rounded"/>
            <button type="submit" className="w-full p-2 bg-green-500 text-white rounded-md">Salvar</button>
        </FormLayout>
      </Modal>
    </PageShell>
  );
}
