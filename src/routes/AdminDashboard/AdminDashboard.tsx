import React, { use, useEffect, useState } from 'react';
import './AdminDashboard.css'; // We'll create this CSS file
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../utils/backend-conf';
import { AllOrders, Product } from '../../utils/types';
import { Orders } from '../../utils/types';
import { OrderItem } from '../../utils/types';


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<AllOrders[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


    useEffect(() => {
        const fetchOrders = async () => {
          try {
            setLoading(true);
            const accesstoken = localStorage.getItem('accessToken'); 
            
            const response = await fetch(`${BASE_URL}/api/Orders/all-orders`, { 
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${accesstoken}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (!response.ok) {
              if (response.status === 401) {
                throw new Error('Unauthorized - Please login again');
              }
              throw new Error('Failed to fetch orders');
            }
            
            const data = await response.json();
            setOrders(data);
          } catch (err) {
            console.error('Fetch error:', err);
          } finally {
            setLoading(false);
          }
        }
        fetchOrders();
      }, []);










      useEffect(() => {
        const fetchProducts = async () => {
          try {
            setLoading(true);
            const accesstoken = localStorage.getItem('accessToken'); 
            
            const response = await fetch(`${BASE_URL}/api/Products`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${accesstoken}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (!response.ok) {
              if (response.status === 401) {
                throw new Error('Unauthorized - Please login again');
              }
              throw new Error('Failed to fetch orders');
            }
            
            const data = await response.json();
            setProducts(data);
          } catch (err) {
            console.error('Fetch error:', err);
          } finally {
            setLoading(false);
          }
        }
        fetchProducts();
      }, []);









      const mappedOrders = orders.map(order => ({
        id: order.id,
        deliveryAddress: order.deliveryAddress,
        orderDate: order.orderDate,
        orderItems: order.orderItems.map(item => ({
          id: item.id,
          price: item.price,
          product: {
            category: item.product.category,
            description: item.product.description,
            id: item.product.id,
            imageUrl: item.product.imageUrl,
            isAvailable: item.product.isAvailable,
            name: item.product.name,
            price: item.product.price
          },
          productId: item.productId,
          quantity: item.quantity,
          totalPrice: item.totalPrice
        })),
        status: order.status,
        totalAmount: order.totalAmount
      }));








      const mappedProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        isAvailable: product.isAvailable,
        category: product.category
      }));



      const handleEditProduct = (product: Product) => {
        setCurrentProduct(product);
        setIsDialogOpen(true);
      };
      
      // This should replace your current handleSaveProduct
      const handleSaveProduct = async (product: Product) => {
        try {
          const accesstoken = localStorage.getItem('accessToken');
          
          // Determine if we're updating or creating
          const isUpdate = !!product.id;
          const url = isUpdate 
            ? `${BASE_URL}/api/Products/${product.id}`
            : `${BASE_URL}/api/Products`;
          
          const method = isUpdate ? 'PUT' : 'POST';
          
          const response = await fetch(url, {
            method,
            headers: {
              'Authorization': `Bearer ${accesstoken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
          });
          
          if (!response.ok) {
            throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} product`);
          }
          
          // Handle 204 No Content response for PUT requests
          if (response.status === 204 && isUpdate) {
            // Update local state with the data we sent
            setProducts(products.map(p => 
              p.id === product.id ? product : p
            ));
          } else {
            // For POST or PUT responses with content
            const data = await response.json();
            console.log('Product saved:', data);
            
            // Update local state
            if (isUpdate) {
              setProducts(products.map(p => p.id === product.id ? data : p));
            } else {
              setProducts([...products, data]);
            }
          }
          
          setIsDialogOpen(false);
        } catch (err) {
          console.error('Save error:', err);
        }
      };




  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsDialogOpen(true);
  };






  const toggleProductStatus = async (productId: number) => {

    const productToUpdate = products.find(product => parseInt(product.id) === productId);
    if (!productToUpdate) return;
    const newAvailability = !productToUpdate.isAvailable;
    setProducts(products.map(product =>
      parseInt(product.id) === productId
        ? { ...product, isAvailable: newAvailability }
        : product
    ));
  
    try {
    const accesstoken = localStorage.getItem('accessToken'); 
      const response = await fetch(`${BASE_URL}/api/Products/${productId}/availability`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accesstoken}`,
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          isAvailable: newAvailability,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Backend update failed');
      }
    } catch (error) {
      console.error('Hiba történt a frissítés során:', error);
    }
  };
  









  const updateOrderStatus = async (orderId: number, newStatus: Orders['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));

    try {
      const accesstoken = localStorage.getItem('accessToken'); 
        const response = await fetch(`${BASE_URL}/api/Orders/${orderId}/status`, {
          method: 'PATCH',
          headers: {
              'Authorization': `Bearer ${accesstoken}`,
              'Content-Type': 'application/json'
            },
          body: JSON.stringify({
            status: newStatus
          }),
        });
    
        if (!response.ok) {
          throw new Error('Backend update failed');
        }
      } catch (error) {
        console.error('Hiba történt a frissítés során:', error);
      }






  };













  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
      </header>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="products-section">
          <div className="section-header">
            <h2>Manage Products</h2>
            <button onClick={handleAddProduct} className="add-btn">
              Add Product
            </button>
          </div>
          
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mappedProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="product-img"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={product.isAvailable}
                          onChange={() => toggleProductStatus(parseInt(product.id))}
                        />
                        <span className="slider round"></span>
                      </label>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="orders-section">
          <h2>Manage Orders</h2>
          
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.fullUserName}</td>
                    <td>{order.orderDate}</td>
                    <td>{order.totalAmount.toFixed(0)}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(
                          order.id, 
                          e.target.value as Orders['status']
                        )}
                        className="status-select"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button 
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        className="view-btn"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isDialogOpen && (
        <ProductDialog
          product={currentProduct}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

// Product Dialog Component
const ProductDialog = ({ 
  product, 
  onClose, 
  onSave 
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}) => {
  const [formData, setFormData] = useState<Product>(product || {
    id: '',
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    isAvailable: true,
    category: ''
  });
  const [formError, setFormError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Handle checkbox separately
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.description || formData.price <= 0) {
      setFormError('Please fill in all required fields correctly');
      return;
    }

    try {
      await onSave(formData);
      // Clear form after successful save
      if (!product) {
        setFormData({
          id: '',
          name: '',
          description: '',
          price: 0,
          imageUrl: '',
          isAvailable: true,
          category: ''
        });
      }
      setFormError('');
    } catch (error) {
      console.error('Error saving product:', error);
      setFormError('Failed to save product. Please try again.');
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="product-dialog">
        <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="50"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Pizza">Pizza</option>
              <option value="Drink">Drink</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
              />
              Available
            </label>
          </div>
          
          {formError && <p className="error">{formError}</p>}
          
          <div className="dialog-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;

