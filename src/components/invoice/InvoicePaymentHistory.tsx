
import React from 'react';
import { Status } from '../shared/StatusBadge';

interface Payment {
  id: number;
  date: string;
  amount: number;
  method: string;
  note: string;
}

interface InvoicePaymentHistoryProps {
  payments: Payment[];
  status: Status;
  balanceDue: number;
}

const InvoicePaymentHistory: React.FC<InvoicePaymentHistoryProps> = ({
  payments,
  status,
  balanceDue
}) => {
  return (
    <div className="px-6 document-section">
      <h2 className="text-sm font-semibold text-gray-500 mb-2">PAYMENT HISTORY</h2>
      {payments.length > 0 ? (
        <table className="line-items-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Method</th>
              <th>Description</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.date}</td>
                <td>{payment.method}</td>
                <td>{payment.note}</td>
                <td className="text-right">${payment.amount.toLocaleString()}</td>
              </tr>
            ))}
            {status === 'paid' && (
              <tr>
                <td>{new Date().toLocaleDateString()}</td>
                <td>Credit Card</td>
                <td>Final Payment</td>
                <td className="text-right">${balanceDue.toLocaleString()}</td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 italic">No payments recorded yet</p>
      )}
    </div>
  );
};

export default InvoicePaymentHistory;
