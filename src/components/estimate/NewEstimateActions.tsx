
import React from "react";
import { Button } from "@/components/ui/button";
import { Send, Save, ArrowLeft } from "lucide-react";

interface NewEstimateActionsProps {
  onSaveDraft: () => void;
  onSubmitToCustomer: () => void;
  isSaving: boolean;
  disabled: boolean;
  onBack: () => void;
}

const NewEstimateActions: React.FC<NewEstimateActionsProps> = ({
  onSaveDraft,
  onSubmitToCustomer,
  isSaving,
  disabled,
  onBack,
}) => (
  <div className="flex justify-between pt-6 border-t">
    <Button
      variant="outline"
      onClick={onBack}
      className="flex items-center gap-2"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Estimates
    </Button>
    <div className="flex gap-3">
      <Button
        variant="outline"
        className="bg-white hover:bg-gray-50"
        onClick={onSaveDraft}
        disabled={disabled || isSaving}
      >
        <Save className="mr-2 h-4 w-4" />
        Save as Draft
      </Button>
      <Button
        className="bg-amber-600 hover:bg-amber-700 text-white"
        onClick={onSubmitToCustomer}
        disabled={disabled || isSaving}
      >
        <Send className="mr-2 h-4 w-4" />
        Submit to Customer
      </Button>
    </div>
  </div>
);

export default NewEstimateActions;

