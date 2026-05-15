import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import PageComplaint from './pages/PageComplaint'
import PageGraphics from './pages/PageGraphics'
import ImportantComplaints from './pages/ImportantComplaints'
import Login from './pages/Login'
import CreateAccount from './pages/CreateAccount'
import Solved_Complaints from './pages/Solved_Complaints'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/create_account" element={<CreateAccount/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/complaint/:id" element={<PageComplaint/>} />
      <Route path="/graphics" element={<PageGraphics/>} />
      <Route path="/importantcomplaints" element={<ImportantComplaints/>} />
      <Route path="/solved_complaints" element={<Solved_Complaints/>} />
    </Routes>
  )
}
