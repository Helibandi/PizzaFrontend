export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  roles: string[];
}

export interface LoginResponse {
  token: string; 
  refreshToken: string;
  email: string;
  tokenExpiration: Date;
}


export interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  price: number;
  isAvailable: boolean;
  category: string;
}

export interface ProductCardProps {
  product: Product;
}


export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}



export interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  refreshToken: () => Promise<string>;
  getValidToken: () => Promise<string | null>;
  isRefreshing: boolean;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}


export interface Orders {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: string;
  product: Product
  quantity: number;
  price: number;
  totalPrice: number;
}


export interface AllOrders {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  fullUserName: string;
  userEmail: string;
  userId : string;
  orderItems: OrderItem[];
}

