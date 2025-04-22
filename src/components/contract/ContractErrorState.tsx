
export const ContractErrorState = () => {
  return (
    <div className="container mx-auto max-w-4xl py-20">
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Error Loading Contract</h2>
        <p>Unable to load contract details. Please try again later.</p>
      </div>
    </div>
  );
};
