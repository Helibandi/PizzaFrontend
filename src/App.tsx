import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './routes/Home/Home'
import Products from './routes/Products/Products'
import Account from './routes/Account/Account'
import Checkout from './routes/Checkout/Checkout'
import Orders from './routes/Orders/Orders'
//import Cart from './routes/Cart/Cart'
import Login from './routes/Login/Login'
import Register from './routes/Register/Register'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Header/Navbar'
import { CartProvider } from './context/CartContext'
import ProductDetail from './routes/ProductDetail/ProductDetail'
import { SetStateAction } from 'react'
import { User } from './utils/types'
import CartDisplay from './components/CartDisplay/CartDisplay';
import AdminDashboard from './routes/AdminDashboard/AdminDashboard'
import OrderConfirm from './routes/OrderConfirm/OrderConfirm'
import OrderDetails from './routes/OrderDetails/OrderDetails'
import ProtectedRoutes from './utils/ProtectedRoutes'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/products" element={<Products/>} />
            <Route path="/account" element={<Account/>} />
            <Route path="/cart" element={<CartDisplay/>} />
            <Route path="/checkout" element={<Checkout/>} />
            <Route path="/orders" element={<Orders/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register setUserData={function (value: SetStateAction<User | undefined>): void {
              throw new Error('Function not implemented.')
            } }/>} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout/>} />
            <Route path="/admin" element={<AdminDashboard/>} />
            <Route path="/order-confirmation" element={<OrderConfirm/>} />
            <Route path="/admin/orders/:id" element={<OrderDetails/>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
