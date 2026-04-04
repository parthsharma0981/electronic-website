import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { DEMO_ORDERS } from '../data/demoData';
import { Eye, ChevronRight, Package, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { OrderSkeleton } from '../components/Skeleton';

export function Orders() {
  const { orders: userOrders, loading } = useOrders();
  const { user } = useAuth();
  const allOrders = userOrders.length > 0 ? userOrders : DEMO_ORDERS;

  const handleDownloadInvoice = (order: any) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - Order #${order._id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; padding: 40px; margin: 0; background: #fff; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; }
            .brand { font-size: 24px; font-weight: 700; color: #111; margin: 0 0 5px; }
            .sub { color: #888; font-size: 12px; margin: 0; }
            .title { font-size: 32px; font-weight: 300; margin: 0; color: #666; text-transform: uppercase; letter-spacing: 2px; }
            .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .col { padding: 20px; background: #fafafa; border-radius: 8px; width: 45%; }
            .label { font-size: 10px; text-transform: uppercase; color: #888; font-weight: 700; letter-spacing: 1px; margin-bottom: 10px; display: block; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; padding: 12px; border-bottom: 2px solid #eee; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
            td { padding: 15px 12px; border-bottom: 1px solid #eee; font-size: 14px; }
            .total-row td { border-bottom: none; font-size: 18px; font-weight: 700; }
            .footer { text-align: center; color: #aaa; font-size: 12px; margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="brand">E-CORE ELECTRONICS</h1>
              <p class="sub">123 Tech Avenue, Silicon Valley, CA</p>
              <p class="sub">support@ecore.com | +1 (555) 123-4567</p>
            </div>
            <h1 class="title">Invoice</h1>
          </div>
          
          <div class="details">
            <div class="col">
              <span class="label">Billed To</span>
              <strong style="display:block;margin-bottom:5px;font-size:16px;">${user?.name || 'Customer'}</strong>
              <div style="font-size:13px;color:#555;">
                ${order.shippingAddress?.street || 'N/A'}<br/>
                ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.pincode || ''}<br/>
                📞 ${order.shippingAddress?.phone || 'N/A'}
              </div>
            </div>
            <div class="col">
              <span class="label">Invoice Details</span>
              <table style="margin:0;font-size:13px;width:auto;">
                <tr><td style="padding:4px 10px 4px 0;border:none;color:#888;">Order #</td><td style="padding:4px 0;border:none;font-weight:600;">${order._id}</td></tr>
                <tr><td style="padding:4px 10px 4px 0;border:none;color:#888;">Date</td><td style="padding:4px 0;border:none;font-weight:600;">${new Date(order.createdAt).toLocaleDateString()}</td></tr>
                <tr><td style="padding:4px 10px 4px 0;border:none;color:#888;">Status</td><td style="padding:4px 0;border:none;font-weight:600;text-transform:capitalize;">${order.status}</td></tr>
              </table>
            </div>
          </div>

          <table>
            <thead>
              <tr><th>Description</th><th>Qty</th><th>Unit Price</th><th style="text-align:right">Amount</th></tr>
            </thead>
            <tbody>
              ${order.orderItems.map((item: any) => `
                <tr>
                  <td>
                    <strong>${item.name}</strong>
                  </td>
                  <td>${item.quantity}</td>
                  <td>$${item.price}</td>
                  <td style="text-align:right">$${item.quantity * item.price}</td>
                </tr>
              `).join('')}
              <tr>
                <td colspan="4" style="border:none;padding:10px;"></td>
              </tr>
              <tr class="total-row">
                <td colspan="3" style="text-align:right">Total Amount:</td>
                <td style="text-align:right">$${order.totalAmount || order.totalPrice}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            Thank you for shopping with E-Core Electronics!
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };


  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 1.5rem 4rem', position: 'relative' }}>
      <div style={{ position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.04) 0%, transparent 70%)', top: '15%', right: '-10%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.75rem' }}>Order History</p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.75rem', fontFamily: '"Outfit", sans-serif' }}>
          My <span className="gradient-text">Orders</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>{allOrders.length} order{allOrders.length !== 1 ? 's' : ''}</p>

        {loading && userOrders.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[...Array(3)].map((_, i) => <OrderSkeleton key={`skel-${i}`} />)}
          </div>
        ) : allOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(var(--primary-rgb), 0.08)', border: '1px solid rgba(var(--primary-rgb), 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Package size={32} style={{ color: 'var(--primary)' }} />
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>No orders yet</p>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Start shopping to see your orders here.</p>
            <Link to="/products" className="btn-glow" style={{ padding: '1rem 2rem', borderRadius: '9999px', textDecoration: 'none' }}>Shop Now</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {allOrders.map((order: any, i: number) => (
              <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                style={{
                  borderRadius: '1.5rem', overflow: 'hidden',
                  background: 'var(--bg-card)', border: '1px solid rgba(var(--primary-rgb), 0.08)',
                  backdropFilter: 'blur(40px)', transition: 'border-color 0.3s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb), 0.2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb), 0.08)'}
              >
                <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(var(--primary-rgb), 0.06)' }}>
                  <div>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 0.25rem' }}>Order #{order._id}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <span style={{ padding: '0.35rem 0.8rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                    background: order.status === 'Delivered' ? 'rgba(34,197,94,0.1)' : order.status === 'Shipped' ? 'rgba(var(--primary-rgb), 0.1)' : order.status === 'Rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                    color: order.status === 'Delivered' ? '#34d399' : order.status === 'Shipped' ? 'var(--primary)' : order.status === 'Rejected' ? '#ef4444' : '#fbbf24',
                    border: `1px solid ${order.status === 'Delivered' ? 'rgba(34,197,94,0.2)' : order.status === 'Shipped' ? 'rgba(var(--primary-rgb), 0.2)' : order.status === 'Rejected' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
                  }}>{order.status}</span>
                </div>

                {order.orderItems.map((item: any) => (
                  <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(var(--primary-rgb), 0.04)' }}>
                    <img src={item.image} alt={item.name} style={{ width: 50, height: 50, borderRadius: '0.75rem', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, margin: 0, fontSize: '0.95rem' }}>{item.name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Qty: {item.quantity}</p>
                    </div>
                    <span style={{ fontWeight: 700 }}>${item.price}</span>
                  </div>
                ))}

                <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total: <span className="gradient-text">${order.totalPrice || order.totalAmount}</span></span>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={() => handleDownloadInvoice(order)} style={{ background: 'none', border: 'none', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='var(--foreground)'} onMouseLeave={e => e.currentTarget.style.color='#6b7280'}>
                      <Download size={14} /> Invoice
                    </button>
                    <Link to={`/track/${order._id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                      <Eye size={14} /> Track Order <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
