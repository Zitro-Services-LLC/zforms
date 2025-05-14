
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface InvoiceNotesSectionProps {
  notes: string;
  setNotes: (notes: string) => void;
}

const InvoiceNotesSection: React.FC<InvoiceNotesSectionProps> = ({
  notes,
  setNotes
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Notes</h2>
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea 
          id="notes" 
          placeholder="Enter any additional notes or payment terms..."
          className="min-h-[100px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </div>
  );
};

export default InvoiceNotesSection;
