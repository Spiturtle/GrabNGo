import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/auth/register'
import Login from './pages/auth/login'
import AdminDashboard from './pages/admin/dashboard/adminDashboard'
import AdminMenu from './pages/admin/menu/adminMenu'
import Dashboard from './pages/dashboard/dashboard'
import MealDetails from './pages/dashboard/mealDetails'
import CartPage from './pages/dashboard/cart'
import PickupInfoPage from './pages/dashboard/pickupInfo'
import OrderConfirmedPage from './pages/dashboard/orderConfirmed'
import MyOrders from './pages/dashboard/myOrders'
import MyOrderMealDetails from './pages/dashboard/myOrderMealDetails'
import Profile from './pages/profile/profile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Navigate to="/login" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/menu" element={<AdminMenu />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meal/:mealId" element={<MealDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/pickup-info" element={<PickupInfoPage />} />
        <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/orders/:orderId" element={<MyOrderMealDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
