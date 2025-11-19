// app/haccp/page.tsx
'use client';
import { useState, useEffect } from 'react';
import PageShell from '@/components/PageShell';

export default function HaccpPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHaccpPlans = async () => {
      try {
        const response = await fetch('/api/haccp');
        if (response.ok) {
          const data = await response.json();
          setPlans(data);
        } else {
          setPlans([]);
        }
      } catch (error) {
        console.error('Failed to fetch HACCP plans:', error);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHaccpPlans();
  }, []);

  return (
    <PageShell>
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Mapa HACCP
      </h1>
      <div className="mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : plans.length === 0 ? (
          <p>Nenhum plano HACCP encontrado.</p>
        ) : (
          <div className="space-y-4">
            {plans.map((plan: any) => (
              <div key={plan.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h2 className="text-lg font-bold">Plano HACCP v{plan.version}</h2>
                <p className="text-sm text-gray-600">Status: {plan.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
