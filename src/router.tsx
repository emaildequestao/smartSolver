import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import PageComplaint from './pages/PageComplaint'
import PageGraphics from './pages/PageGraphics'
import ImportantComplaints from './pages/ImportantComplaints'
import Login from './pages/Login'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/" element={<Dashboard/>} />
      <Route path="/complaint/:id" element={<PageComplaint/>} />
      <Route path="/graphics" element={<PageGraphics/>} />
      <Route path="/importantcomplaints" element={<ImportantComplaints/>} />
    </Routes>
  )
}
