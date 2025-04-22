
import { Loader2 } from 'lucide-react';

export const ContractLoadingState = () => {
  return (
    <div className="container mx-auto max-w-4xl py-20 flex justify-center items-center">
      <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
    </div>
  );
};
