
import React from 'react';
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ContractorPasswordSection: React.FC = () => {
  const { toast } = useToast();
  
  const form = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = (data: PasswordFormValues) => {
    console.log("Password update:", data);
    
    // Check if passwords match
    if (data.newPassword !== data.confirmPassword) {
      form.setError('confirmPassword', { 
        type: 'manual', 
        message: 'Passwords do not match' 
      });
      return;
    }
    
    // If validation passes, show success message
    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully.",
    });
    
    // Reset form
    form.reset();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Change Password</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter current password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter new password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm new password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="bg-amber-500 hover:bg-amber-600"
            >
              Update Password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ContractorPasswordSection;
