
// Re-export all types with explicit naming to avoid conflicts
export * from './paymentMethod';
export * from './invoice';
export * from './customer';
export * from './contract';

// Use export type for modules with conflicting type names
// estimate.ts and invoice.ts both define different LineItem types
export type { LineItem as EstimateLineItem } from './estimate';

// notification types - use explicit exports to avoid conflicts
export type { 
  Notification as AppNotification,
  NotificationPreferences as AppNotificationPreferences
} from './notification';

// license types - use explicit exports to avoid conflicts
export type {
  ContractorLicense as AppContractorLicense,
  LicenseFormData,
  getDaysUntilExpiry,
  getLicenseStatus
} from './license';

// Status export from shared component
export { type Status } from '@/components/shared/StatusBadge';

// Export database types without conflicts
export * from './database.d';
