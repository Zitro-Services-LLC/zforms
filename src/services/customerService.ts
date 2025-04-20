
import { supabase } from "@/integrations/supabase/client";
import type { Customer } from "@/types/customer";

/**
 * Get all customers for the current authenticated user
 */
export async function getCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*');
  
  if (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
  
  return data as Customer[];
}

/**
 * Get a specific customer by ID
 */
export async function getCustomerById(customerId: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .single();
  
  if (error) {
    console.error(`Error fetching customer with ID ${customerId}:`, error);
    throw error;
  }
  
  return data as Customer;
}

/**
 * Create a new customer
 */
export async function createCustomer(customerData: Omit<Customer, 'id'>) {
  const { data, error } = await supabase
    .from('customers')
    .insert(customerData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
  
  return data as Customer;
}

/**
 * Update an existing customer
 */
export async function updateCustomer(customerId: string, customerData: Partial<Customer>) {
  const { data, error } = await supabase
    .from('customers')
    .update(customerData)
    .eq('id', customerId)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating customer with ID ${customerId}:`, error);
    throw error;
  }
  
  return data as Customer;
}

/**
 * Delete a customer
 */
export async function deleteCustomer(customerId: string) {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', customerId);
  
  if (error) {
    console.error(`Error deleting customer with ID ${customerId}:`, error);
    throw error;
  }
  
  return true;
}
