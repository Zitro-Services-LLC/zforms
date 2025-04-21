
// MAIN FORM PAGE AFTER REFACTOR

import React from 'react';
import AppLayout from '../components/layouts/AppLayout';
import EstimateFormHeader from '../components/estimate/EstimateFormHeader';
import EstimateDetailsSection from '../components/estimate/EstimateDetailsSection';
import EstimateItemsSection from '../components/estimate/EstimateItemsSection';
import EstimateNotesSection from '../components/estimate/EstimateNotesSection';
import EstimateTotals from '../components/estimate/EstimateTotals';
import EstimatePreviewDialog from '../components/estimate/EstimatePreviewDialog';
import NewEstimateActions from '../components/estimate/NewEstimateActions';
import { useNewEstimate } from '@/hooks/useNewEstimate';
import { useNavigate } from 'react-router-dom';

const NewEstimate = () => {
  const navigate = useNavigate();
  const {
    selectedCustomer,
    items,
    notes,
    estimateDate,
    referenceNumber,
    showPreview,
    taxRate,
    isSaving,
    errorMessage,
    actionDisabledReason,
    subtotal,
    tax,
    total,
    allRequiredValid,
    setNotes,
    setEstimateDate,
    setReferenceNumber,
    setTaxRate,
    handleUpdateLineItem,
    handleDeleteLineItem,
    handleAddLineItem,
    handleCustomerSelect,
    handleAddNewCustomer,
    handleSaveDraft,
    handleSubmitToCustomer,
    handlePreview,
    setShowPreview,
  } = useNewEstimate();

  return (
    <AppLayout userType="contractor">
      <div className="container mx-auto p-6">
        <EstimateFormHeader
          onPreview={handlePreview}
          onSave={handleSaveDraft}
          disableActions={!allRequiredValid || isSaving}
        />

        {/* Show feedback to user */}
        {((!allRequiredValid || isSaving) || errorMessage) && (
          <div className="mb-4">
            <div className={`border-l-4 px-4 py-2 rounded text-sm ${
              errorMessage 
                ? "bg-red-100 border-red-300 text-red-800" 
                : "bg-yellow-100 border-yellow-300 text-yellow-800"
            }`}>
              {isSaving
                ? "Saving, please wait..."
                : errorMessage || actionDisabledReason}
            </div>
          </div>
        )}

        <div className="space-y-6 bg-white shadow-sm rounded-lg p-6">
          <EstimateDetailsSection
            estimateDate={estimateDate}
            referenceNumber={referenceNumber}
            onDateChange={setEstimateDate}
            onReferenceChange={setReferenceNumber}
            onCustomerSelect={handleCustomerSelect}
            selectedCustomer={selectedCustomer}
            taxRate={taxRate}
            onTaxRateChange={setTaxRate}
            onAddNewCustomer={handleAddNewCustomer}
          />

          <EstimateItemsSection
            items={items}
            onUpdateItem={handleUpdateLineItem}
            onDeleteItem={handleDeleteLineItem}
            onAddItem={handleAddLineItem}
          />

          <EstimateNotesSection
            notes={notes}
            onNotesChange={setNotes}
          />

          <EstimateTotals 
            subtotal={subtotal}
            tax={tax}
            total={total}
            taxRate={taxRate}
          />

          <NewEstimateActions
            onSaveDraft={handleSaveDraft}
            onSubmitToCustomer={handleSubmitToCustomer}
            isSaving={isSaving}
            disabled={!allRequiredValid}
            onBack={() => navigate('/estimates')}
          />
        </div>
      </div>

      <EstimatePreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        estimateData={{
          id: referenceNumber || 'Draft',
          customer: selectedCustomer,
          items,
          subtotal,
          tax,
          total,
          notes,
        }}
      />
    </AppLayout>
  );
};

export default NewEstimate;

