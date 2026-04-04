const BASE = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Segoe UI',Arial,sans-serif; background:#f8f5f0; color:#1a1a14; }
    .wrap  { max-width:580px; margin:40px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(26,60,46,0.08); }
    .top   { background:#1a3c2e; padding:32px 40px; text-align:center; }
    .logo  { color:#fff; font-size:26px; font-style:italic; letter-spacing:1px; }
    .sub   { color:rgba(255,255,255,0.6); font-size:11px; letter-spacing:3px; text-transform:uppercase; margin-top:4px; }
    .body  { padding:40px; }
    .otp   { background:#edf5ef; border:2px dashed #1a3c2e; border-radius:12px; text-align:center; padding:24px; margin:24px 0; }
    .otp-n { font-size:42px; font-weight:700; color:#1a3c2e; letter-spacing:8px; }
    .otp-l { color:#7a7060; font-size:12px; margin-top:6px; }
    .btn   { display:inline-block; background:#1a3c2e; color:#fff; padding:14px 32px; border-radius:6px; font-size:13px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; text-decoration:none; margin:20px 0; }
    .line  { height:1px; background:rgba(26,60,46,0.08); margin:24px 0; }
    .foot  { background:#f8f5f0; padding:20px 40px; text-align:center; font-size:11px; color:#a89880; }
    .tag   { display:inline-block; background:rgba(26,60,46,0.08); color:#1a3c2e; padding:3px 10px; border-radius:4px; font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase; }
    h2     { font-size:22px; color:#1a1a14; margin-bottom:8px; }
    p      { font-size:14px; line-height:1.7; color:#4a4a3a; margin-bottom:12px; }
    table  { width:100%; border-collapse:collapse; margin:16px 0; }
    td     { padding:10px 14px; border-bottom:1px solid rgba(26,60,46,0.07); font-size:13px; }
    td:first-child { color:#7a7060; width:40%; }
    td:last-child  { font-weight:600; color:#1a1a14; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <div class="logo">Electronic Store</div>
    </div>
    <div class="body">${content}</div>
    <div class="foot">
      © ${new Date().getFullYear()} Electronic Store · Made with ♥ in India<br/>
      If you didn't request this email, you can safely ignore it.
    </div>
  </div>
</body>
</html>`;

export const verifyEmailTpl = (name, otp) => BASE(`
  <h2>Verify your email ✉️</h2>
  <p>Hi <strong>${name}</strong>,</p>
  <p>Thank you for joining Electronic Store! Use the OTP below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
  <div class="otp">
    <div class="otp-n">${otp}</div>
    <div class="otp-l">Email Verification Code</div>
  </div>
  <p style="font-size:12px;color:#a89880;">Do not share this code with anyone.</p>
`);

export const forgotPasswordTpl = (name, otp) => BASE(`
  <h2>Reset your password 🔑</h2>
  <p>Hi <strong>${name}</strong>,</p>
  <p>We received a request to reset your Electronic Store password. Use the OTP below. It expires in <strong>10 minutes</strong>.</p>
  <div class="otp">
    <div class="otp-n">${otp}</div>
    <div class="otp-l">Password Reset Code</div>
  </div>
  <p style="font-size:12px;color:#a89880;">If you didn't request this, please ignore this email. Your password won't change.</p>
`);

export const orderConfirmUserTpl = (name, order) => BASE(`
  <h2>Order Confirmed! 🎉</h2>
  <p>Hi <strong>${name}</strong>, thank you for your order. We've received it and will process it shortly.</p>
  <div class="line"></div>
  <p><span class="tag">Order #${order._id.toString().slice(-8).toUpperCase()}</span></p>
  <table>
    ${order.orderItems.map(i => `<tr><td>${i.name}</td><td>×${i.quantity} — ₹${(i.price*i.quantity).toLocaleString('en-IN')}</td></tr>`).join('')}
    <tr><td><strong>Total</strong></td><td><strong>₹${order.totalAmount.toLocaleString('en-IN')}</strong></td></tr>
  </table>
  <div class="line"></div>
  <p><strong>Shipping to:</strong><br/>
  ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} — ${order.shippingAddress.pincode}<br/>
  📞 ${order.shippingAddress.phone}</p>
  <p>We'll notify you once your order is accepted and shipped. ✦</p>
`);

export const orderAlertAdminTpl = (order, user) => BASE(`
  <h2>New Order Received 📦</h2>
  <p>A new order has been placed on Electronic Store and needs your attention.</p>
  <div class="line"></div>
  <p><span class="tag">Order #${order._id.toString().slice(-8).toUpperCase()}</span></p>
  <table>
    <tr><td>Customer</td><td>${user.name} (${user.email})</td></tr>
    <tr><td>Amount</td><td><strong>₹${order.totalAmount.toLocaleString('en-IN')}</strong></td></tr>
    <tr><td>Payment</td><td>✅ Paid via Razorpay</td></tr>
    <tr><td>Items</td><td>${order.orderItems.length} item(s)</td></tr>
  </table>
  <div class="line"></div>
  <p><strong>Items ordered:</strong></p>
  <table>
    ${order.orderItems.map(i => `<tr><td>${i.name}</td><td>×${i.quantity} — ₹${(i.price*i.quantity).toLocaleString('en-IN')}</td></tr>`).join('')}
  </table>
  <div class="line"></div>
  <p><strong>Ship to:</strong><br/>
  ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} — ${order.shippingAddress.pincode}</p>
  <p>Please login to the admin panel to <strong>accept or reject</strong> this order.</p>
`);

export const orderStatusTpl = (name, order, status) => BASE(`
  <h2>Order ${status} ${status==='Accepted'?'✅':status==='Rejected'?'❌':status==='Shipped'?'🚚':status==='Delivered'?'🎁':'📦'}</h2>
  <p>Hi <strong>${name}</strong>,</p>
  <p>Your order <span class="tag">#${order._id.toString().slice(-8).toUpperCase()}</span> has been <strong>${status.toLowerCase()}</strong>.</p>
  ${status==='Rejected' && order.rejectionReason ? `<p><strong>Reason:</strong> ${order.rejectionReason}</p>` : ''}
  ${status==='Rejected' ? `<p>A full refund of <strong>₹${order.totalAmount.toLocaleString('en-IN')}</strong> has been initiated and will reflect in 5–7 business days.</p>` : ''}
  ${status==='Accepted' ? `<p>We're now preparing your order. You'll receive another update once it's shipped. 🚚</p>` : ''}
  ${status==='Shipped' ? `<p>Your order is on its way! Expect delivery in 3–5 business days. 📦</p>` : ''}
  ${status==='Delivered' ? `<p>Your order has been delivered! We hope you love it. 🎉</p>` : ''}
`);

export const welcomeEmailTpl = (name) => BASE(`
  <h2>Welcome to Electronic Store! 🎉</h2>
  <p>Hi <strong>${name}</strong>,</p>
  <p>Your account has been successfully created. Welcome to Electronic Store — your one-stop shop for premium electronics.</p>
  <div class="line"></div>
  <p><strong>What you can do now:</strong></p>
  <table>
    <tr><td>🛒</td><td>Browse and shop premium electronics</td></tr>
    <tr><td>❤️</td><td>Save favorites to your wishlist</td></tr>
    <tr><td>📦</td><td>Track your orders in real-time</td></tr>
    <tr><td>⭐</td><td>Review products you've purchased</td></tr>
  </table>
  <div class="line"></div>
  <p>Happy shopping! ✦</p>
`);

export const lowStockAlertTpl = (products) => BASE(`
  <h2>🚨 Low Stock Alert</h2>
  <p>The following product(s) are running low on stock and may need restocking:</p>
  <div class="line"></div>
  <table>
    <tr style="background:#f8f5f0;"><td><strong>Product</strong></td><td><strong>Stock</strong></td></tr>
    ${products.map(p => `<tr><td>${p.name} <span style="color:#a89880;">(${p.category})</span></td><td style="color:${p.stock <= 2 ? '#dc2626' : '#f59e0b'};font-weight:700;">${p.stock} left</td></tr>`).join('')}
  </table>
  <div class="line"></div>
  <p>Please restock these items from the admin dashboard to avoid stockouts.</p>
`);
