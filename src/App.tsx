
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import ContractorDashboard from "./pages/ContractorDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import EstimateManagement from "./pages/EstimateManagement";
import ContractManagement from "./pages/ContractManagement";
import InvoiceManagement from "./pages/InvoiceManagement";
import ContractorProfile from "./pages/ContractorProfile";
import CustomerProfile from "./pages/CustomerProfile";
import NotFound from "./pages/NotFound";
import EstimatesList from "./pages/EstimatesList";
import ContractsList from "./pages/ContractsList";
import InvoicesList from "./pages/InvoicesList";
import NewEstimate from "./pages/NewEstimate";
import NewContract from "./pages/NewContract";
import NewInvoice from "./pages/NewInvoice";
import CustomersList from "./pages/CustomersList";
import NewCustomer from "./pages/NewCustomer";
import EditCustomer from "./pages/EditCustomer";
import AuthPage from "@/pages/AuthPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

// Import Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminManagementPage from "./pages/admin/AdminManagementPage";
import ContractorsManagementPage from "./pages/admin/ContractorsManagementPage";
import SystemSettingsPage from "./pages/admin/SystemSettingsPage";
import ActivityLogsPage from "./pages/admin/ActivityLogsPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import AdminDevSetup from "./pages/admin/AdminDevSetup"; // New import for admin development setup

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/logout" element={<Navigate to="/" />} />
          
          {/* Contractor Routes */}
          <Route path="/dashboard" element={<ContractorDashboard />} />
          <Route path="/profile" element={<ContractorProfile />} />
          <Route path="/customers" element={<CustomersList />} />
          <Route path="/customers/new" element={<NewCustomer />} />
          <Route path="/customers/edit/:id" element={<EditCustomer />} />
          <Route path="/estimates" element={<EstimatesList />} />
          <Route path="/estimates/new" element={<NewEstimate />} />
          <Route path="/estimates/:id" element={<EstimateManagement userType="contractor" />} />
          <Route path="/contracts" element={<ContractsList />} />
          <Route path="/contracts/new" element={<NewContract />} />
          <Route path="/contracts/:id" element={<ContractManagement userType="contractor" />} />
          <Route path="/invoices" element={<InvoicesList />} />
          <Route path="/invoices/new" element={<NewInvoice />} />
          <Route path="/invoices/:id" element={<InvoiceManagement userType="contractor" />} />
          
          {/* Customer Routes */}
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/profile" element={<CustomerProfile />} />
          <Route path="/customer/estimates/:id" element={<EstimateManagement userType="customer" />} />
          <Route path="/customer/contracts/:id" element={<ContractManagement userType="customer" />} />
          <Route path="/customer/invoices/:id" element={<InvoiceManagement userType="customer" />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/management" element={<AdminManagementPage />} />
          <Route path="/admin/contractors" element={<ContractorsManagementPage />} />
          <Route path="/admin/settings" element={<SystemSettingsPage />} />
          <Route path="/admin/activity" element={<ActivityLogsPage />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
          <Route path="/admin/dev-setup" element={<AdminDevSetup />} /> {/* New route for admin development setup */}
          
          {/* Catch-all route for not found pages */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
