
import React from 'react';
import PublicLayout from '../components/layouts/PublicLayout';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const ResetPasswordPage = () => {
  const { session } = useSupabaseAuth();

  return (
    <PublicLayout>
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-100 px-4 py-12">
        <div className="w-full max-w-md">
          {session ? (
            <ResetPasswordForm />
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-medium text-red-600 mb-4">Invalid or expired link</h2>
              <p className="text-gray-600">
                This password reset link is invalid or has expired. Please request a new password reset link.
              </p>
              <a 
                href="/auth"
                className="mt-4 inline-block px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
              >
                Back to login
              </a>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default ResetPasswordPage;
