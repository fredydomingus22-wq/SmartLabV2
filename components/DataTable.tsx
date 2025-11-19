// components/DataTable.tsx
import React from 'react';

interface DataTableProps {
  columns: {
    label: string;
    field: string;
  }[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'Nenhum registo encontrado',
}) => {
  if (loading) {
    return <div>Loading...</div>; // Skeleton loader pode ser adicionado aqui
  }

  if (data.length === 0) {
    return <div className="text-center py-8">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <table className="min-w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.field}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col.field} className="px-6 py-4 whitespace-nowrap">
                  {row[col.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
