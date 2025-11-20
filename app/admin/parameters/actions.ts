// app/admin/parameters/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ParameterFormData } from "./ParameterForm";

export async function getParameters() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_parameters');

  if (error) {
    console.error("Error fetching parameters:", error.message);
    throw new Error("Failed to fetch parameters.");
  }

  return data;
}

export async function createParameter(formData: ParameterFormData) {
  const supabase = createClient();

  const { error } = await supabase.rpc('create_parameter', {
    p_name: formData.name,
    p_code: formData.code,
    p_type: formData.type,
    p_unit: formData.unit,
    p_description: formData.description,
  });

  if (error) {
    console.error("Error creating parameter:", error.message);
    return { success: false, message: "Failed to create parameter." };
  }

  revalidatePath("/admin/parameters");
  return { success: true, message: "Parameter created successfully." };
}

export async function updateParameter(id: string, formData: ParameterFormData) {
  const supabase = createClient();

  const { error } = await supabase.rpc('update_parameter', {
    p_id: id,
    p_name: formData.name,
    p_code: formData.code,
    p_type: formData.type,
    p_unit: formData.unit,
    p_description: formData.description,
  });

  if (error) {
    console.error("Error updating parameter:", error.message);
    return { success: false, message: "Failed to update parameter." };
  }

  revalidatePath("/admin/parameters");
  return { success: true, message: "Parameter updated successfully." };
}

export async function deleteParameter(id: string) {
  const supabase = createClient();

  const { error } = await supabase.rpc('delete_parameter', { p_id: id });

  if (error) {
    console.error("Error deleting parameter:", error.message);
    return { success: false, message: "Failed to delete parameter." };
  }

  revalidatePath("/admin/parameters");
  return { success: true, message: "Parameter deleted successfully." };
}
