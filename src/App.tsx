import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { Dashboard } from "@/components/dashboard/Dashboard"
import { DentistManagement } from "@/components/dentists/DentistManagement"
import { DentistDetails } from "@/components/dentists/DentistDetails"
import { TechnicianManagement } from "@/components/technicians/TechnicianManagement"
import { NotFound } from "@/components/common/NotFound"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dentists" element={<DentistManagement />} />
          <Route path="/dentists/:id" element={<DentistDetails />} />
          <Route path="/technicians" element={<TechnicianManagement />} />
          <Route path="/vendors" element={<div className="text-white">Vendors Page (Coming Soon)</div>} />
          <Route path="/invoices" element={<div className="text-white">Invoices Page (Coming Soon)</div>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
