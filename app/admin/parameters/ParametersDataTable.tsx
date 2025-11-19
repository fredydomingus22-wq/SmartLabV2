// app/admin/parameters/ParametersDataTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

// Define the shape of a parameter for the table
export type Parameter = {
  id: string;
  name: string;
  code: string;
  type: string | null;
  unit: string | null;
  description: string | null;
  created_at: string;
};

interface ParametersDataTableProps {
  data: Parameter[];
  onEdit: (parameter: Parameter) => void;
  onDelete: (parameterId: string) => void;
}

export function ParametersDataTable({ data, onEdit, onDelete }: ParametersDataTableProps) {

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length > 0 ? (
            data.map((parameter) => (
              <TableRow key={parameter.id}>
                <TableCell className="font-medium">{parameter.name}</TableCell>
                <TableCell>{parameter.code}</TableCell>
                <TableCell>{parameter.type}</TableCell>
                <TableCell>{parameter.unit}</TableCell>
                <TableCell>{new Date(parameter.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(parameter)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(parameter.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No parameters found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
