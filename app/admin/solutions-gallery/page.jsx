'use client'
import ModernAdminLayout from "../../../src/components/Admin/ModernAdminLayout";
import SolutionsGalleryManager from "../../../src/components/Admin/SolutionsGalleryManager";

export default function SolutionsGalleryAdminPage() {
  return (
    <ModernAdminLayout>
      <div className="p-6">
        <SolutionsGalleryManager />
      </div>
    </ModernAdminLayout>
  );
}
