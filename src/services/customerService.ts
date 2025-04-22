
import { supabase } from "@/integrations/supabase/client";
import type { Customer } from "@/types/customer";

/**
 * Get all customers for the current authenticated user
 */
export async function getCustomers(userId: string | undefined) {
  if (!userId) return [];
  console.log("Getting customers for user:", userId);
  
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
  
  console.log("Fetched customers count:", data?.length || 0);
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
  // Ensure customerData has all required fields before proceeding
  if (!customerData.first_name || !customerData.last_name || !customerData.email || !customerData.user_id) {
    throw new Error('Required customer fields missing');
  }
  
  console.log("Creating customer with data:", customerData);
  console.log("Authentication status check:", await supabase.auth.getSession());
  
  const { data, error } = await supabase
    .from('customers')
    .insert({
      first_name: customerData.first_name,
      last_name: customerData.last_name,
      email: customerData.email,
      phone: customerData.phone,
      billing_address: customerData.billing_address,
      property_address: customerData.property_address,
      same_as_billing: customerData.same_as_billing,
      user_id: customerData.user_id
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating customer:', error);
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }
  
  console.log('Customer created successfully:', data);
  return data as Customer;
}

/**
 * Update an existing customer
 */
export async function updateCustomer(customerId: string, customerData: Partial<Customer>) {
  console.log(`Updating customer with ID ${customerId} with data:`, customerData);
  
  // Ensure property_address is set correctly based on same_as_billing
  if (customerData.same_as_billing && customerData.billing_address) {
    customerData.property_address = customerData.billing_address;
    console.log("Setting property_address equal to billing_address:", customerData.billing_address);
  }
  
  const { data, error } = await supabase
    .from('customers')
    .update(customerData)
    .eq('id', customerId)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating customer with ID ${customerId}:`, error);
    console.error('Update error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }
  
  console.log(`Customer with ID ${customerId} updated successfully:`, data);
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
