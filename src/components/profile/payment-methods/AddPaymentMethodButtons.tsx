
import { Button } from "@/components/ui/button";
import { CreditCard, WalletCards } from "lucide-react";

interface AddPaymentMethodButtonsProps {
  onAddCreditCard: () => void;
  onAddBankAccount: () => void;
  disabled: boolean;
}

export const AddPaymentMethodButtons: React.FC<AddPaymentMethodButtonsProps> = ({
  onAddCreditCard,
  onAddBankAccount,
  disabled
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Button 
        variant="outline"
        onClick={onAddCreditCard}
        disabled={disabled}
        className="flex-1 min-w-[200px] sm:flex-none"
      >
        <CreditCard className="mr-2 h-4 w-4" />
        Add Credit Card
      </Button>
      
      <Button 
        variant="outline"
        onClick={onAddBankAccount}
        disabled={disabled}
        className="flex-1 min-w-[200px] sm:flex-none"
      >
        <WalletCards className="mr-2 h-4 w-4 text-[#8E9196]" />
        Add Bank Account
      </Button>
    </div>
  );
};
