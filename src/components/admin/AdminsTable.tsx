
import React from 'react';
import { AdminProfile } from '@/types/admin';
import AdminRoleBadge from './AdminRoleBadge';
import AdminStatusIndicator from './AdminStatusIndicator';

interface AdminsTableProps {
  adminAccounts: AdminProfile[];
}

const AdminsTable: React.FC<AdminsTableProps> = ({ adminAccounts }) => {
  return (
    <div className="rounded-md border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {adminAccounts.map((admin) => (
            <tr key={admin.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {admin.first_name} {admin.last_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {admin.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <AdminRoleBadge role={admin.role} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <AdminStatusIndicator isActive={admin.is_active} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminsTable;
