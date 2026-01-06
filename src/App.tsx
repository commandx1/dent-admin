import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { Dashboard } from "@/components/dashboard/Dashboard"
import { DentistManagement, DentistDetails } from "@/components/dentists"
import { TechnicianManagement } from "@/components/technicians/TechnicianManagement"
import { VendorManagement } from "@/components/vendors/VendorManagement"
import { VendorDetails } from "@/components/vendors/VendorDetails"
import { InvoiceManagement } from "@/components/invoices/InvoiceManagement"
import { NotFound } from "@/components/common/NotFound"
import { Login } from "@/components/auth/Login"
import { ProtectedRoute } from "@/components/common/ProtectedRoute"
import { useAuthStore } from "@/store/useAuthStore"
import NewTechnician from './components/technicians/NewTechnician'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

export default App
