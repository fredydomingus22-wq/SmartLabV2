// app/admin/parameters/ParameterForm.tsx
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the validation schema for the parameter form
const formSchema = z.object({
  name: z.string().min(3, "Parameter name must be at least 3 characters."),
  code: z.string().min(2, "Parameter code must be at least 2 characters."),
  type: z.enum(["physico_chemical", "micro", "sensory", "packaging"]),
  unit: z.string().optional(),
  description: z.string().optional(),
});

export type ParameterFormData = z.infer<typeof formSchema>;

interface ParameterFormProps {
  onSubmit: (data: ParameterFormData) => void;
  initialData?: ParameterFormData;
  isSubmitting?: boolean;
}

export function ParameterForm({ onSubmit, initialData, isSubmitting }: ParameterFormProps) {
  const form = useForm<ParameterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      code: "",
      type: "physico_chemical",
      unit: "",
      description: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parameter Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., pH" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parameter Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g., PH_01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parameter type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="physico_chemical">Physico-chemical</SelectItem>
                  <SelectItem value="micro">Microbiology</SelectItem>
                  <SelectItem value="sensory">Sensory</SelectItem>
                  <SelectItem value="packaging">Packaging</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <Input placeholder="e.g., ppm, °Brix" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Optional description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Parameter"}
        </Button>
      </form>
    </Form>
  );
}
