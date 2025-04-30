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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUploadGallery from '@/components/estimate/FileUploadGallery';

const NewEstimate = () => {
  const navigate = useNavigate();
  const {
    selectedCustomer,
    items,
    notes,
    estimateDate,
    referenceNumber,
    jobNumber,
    jobDescription,
    showPreview,
    taxRate,
    isSaving,
    errorMessage,
    actionDisabledReason,
    subtotal,
    tax,
    total,
    allRequiredValid,
    estimateImages,
    setNotes,
    setEstimateDate,
    setReferenceNumber,
    setJobNumber,
    setJobDescription,
    setTaxRate,
    handleUpdateLineItem,
    handleDeleteLineItem,
    handleAddLineItem,
    handleCustomerSelect,
    handleAddNewCustomer,
    handleSaveDraft,
    handleSubmitToCustomer,
    handlePreview,
    handleAddEstimateImage,
    handleRemoveEstimateImage,
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

        <div className="space-y-6">
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
            jobNumber={jobNumber}
            jobDescription={jobDescription}
            onJobNumberChange={setJobNumber}
            onJobDescriptionChange={setJobDescription}
          />

          <Tabs defaultValue="items">
            <TabsList className="grid grid-cols-2 mb-4 w-full max-w-md">
              <TabsTrigger value="items">Line Items</TabsTrigger>
              <TabsTrigger value="attachments">Images</TabsTrigger>
            </TabsList>
            
            <TabsContent value="items" className="space-y-6">
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
            </TabsContent>
            
            <TabsContent value="attachments">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500 mb-4">
                    Add images of the project site, reference materials, or other relevant visuals.
                  </div>
                  
                  <FileUploadGallery 
                    files={estimateImages}
                    onAddFiles={handleAddEstimateImage}
                    onRemoveFile={handleRemoveEstimateImage}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

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
