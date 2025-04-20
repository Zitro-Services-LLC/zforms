
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface EstimateNotesSectionProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const EstimateNotesSection: React.FC<EstimateNotesSectionProps> = ({
  notes,
  onNotesChange,
}) => {
  return (
    <div className="border-b pb-6">
      <h2 className="text-lg font-semibold mb-4">Notes</h2>
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea 
          id="notes" 
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Enter any additional notes or terms..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};

export default EstimateNotesSection;
