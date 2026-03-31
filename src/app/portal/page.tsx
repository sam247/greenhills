import ProtectedRoute from "@/components/ProtectedRoute";
import Portal from "@/components/pages/Portal";

export default function PortalPage() {
  return (
    <ProtectedRoute>
      <Portal />
    </ProtectedRoute>
  );
}
