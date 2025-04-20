
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ChangeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comments: string) => void;
  documentType: 'estimate' | 'contract' | 'invoice';
}

const ChangeRequestModal: React.FC<ChangeRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  documentType
}) => {
  const [comments, setComments] = React.useState('');

  const handleSubmit = () => {
    if (comments.trim()) {
      onSubmit(comments);
      setComments('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Changes</DialogTitle>
          <DialogDescription>
            Please provide details about the required changes to this {documentType}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={`What changes would you like to request for this ${documentType}?`}
            className="min-h-[120px]"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-amber-500 hover:bg-amber-600"
            onClick={handleSubmit}
            disabled={!comments.trim()}
          >
            Submit Comments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeRequestModal;
