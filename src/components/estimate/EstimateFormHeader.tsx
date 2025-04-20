
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, Save } from 'lucide-react';

interface EstimateFormHeaderProps {
  onPreview: () => void;
  onSave: () => void;
  disableActions?: boolean;
}

const EstimateFormHeader: React.FC<EstimateFormHeaderProps> = ({ onPreview, onSave, disableActions }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">New Estimate</h1>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate('/estimates')}>
          Cancel
        </Button>
        <Button variant="outline" onClick={onPreview} disabled={disableActions}>
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <Button onClick={onSave} disabled={disableActions}>
          <Save className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
      </div>
    </div>
  );
};

export default EstimateFormHeader;

