// Astro Server Actions for Service Packages (Basic operations)
// Re-exports from servicePackagesAdmin for backward compatibility
import { servicePackagesAdmin } from './servicePackagesAdmin';

export const adminServicePackages = {
  // Get all packages
  getAll: servicePackagesAdmin.getAll,

  // Update a package
  update: servicePackagesAdmin.update,

  // Get active packages by type
  getActiveByType: servicePackagesAdmin.getActiveByType,
};
