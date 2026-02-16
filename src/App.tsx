import { Suspense, lazy } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { ProtectedRoute } from "@/components/common/ProtectedRoute"
import { useAuthStore } from "@/store/useAuthStore"
import { Toaster } from 'sonner'
import { Loader2 } from "lucide-react"

// Lazy load components
const Dashboard = lazy(() => import("@/components/dashboard/Dashboard").then(m => ({ default: m.Dashboard })))
const DentistManagement = lazy(() => import("@/components/dentists/DentistManagement").then(m => ({ default: m.DentistManagement })))
const DentistDetails = lazy(() => import("@/components/dentists/DentistDetails").then(m => ({ default: m.DentistDetails })))
const TechnicianManagement = lazy(() => import("@/components/technicians/TechnicianManagement").then(m => ({ default: m.TechnicianManagement })))
const NewTechnician = lazy(() => import("./components/technicians/NewTechnician"))
const VendorManagement = lazy(() => import("@/components/vendors/VendorManagement").then(m => ({ default: m.VendorManagement })))
const VendorDetails = lazy(() => import("@/components/vendors/VendorDetails").then(m => ({ default: m.VendorDetails })))
const InvoiceManagement = lazy(() => import("@/components/invoices/InvoiceManagement").then(m => ({ default: m.InvoiceManagement })))
const Login = lazy(() => import("@/components/auth/Login").then(m => ({ default: m.Login })))
const NotFound = lazy(() => import("@/components/common/NotFound").then(m => ({ default: m.NotFound })))

const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center bg-dark-bg/50">
    <Loader2 className="h-8 w-8 animate-spin text-accent-primary" />
  </div>
)

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
          />
          
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/dentists" element={<DentistManagement />} />
            <Route path="/dentists/:id" element={<DentistDetails />} />
            <Route path="/technicians" element={<TechnicianManagement />} />
            <Route path="/technicians/new" element={<NewTechnician />} />
            <Route path="/vendors" element={<VendorManagement />} />
            <Route path="/vendors/:id" element={<VendorDetails />} />
            <Route path="/invoices" element={<InvoiceManagement />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
