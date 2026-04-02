import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';
import { ProductProvider } from './context/ProductContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import App from './App';
import React from 'react';

class ErrorBoundary extends React.Component<any, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '2rem', background: '#000', height: '100vh', width: '100vw' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.message}</pre>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              <OrderProvider>
                <ThemeProvider>
                  <ErrorBoundary>
                    <App />
                  </ErrorBoundary>
                  <Toaster position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: 'var(--glass-bg)',
                        color: 'var(--foreground)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        boxShadow: 'var(--toast-shadow, 0 8px 32px rgba(0,0,0,0.5))',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)'
                      }
                    }} 
                  />
                </ThemeProvider>
              </OrderProvider>
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

