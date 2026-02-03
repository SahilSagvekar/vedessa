const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  // For development, you can use Gmail
  // For production, use services like SendGrid, AWS SES, or Mailgun

  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password, not regular password
      }
    });
  }

  // For other SMTP services
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

// Email templates
const emailTemplates = {
  passwordReset: (resetUrl, userName) => ({
    subject: 'Reset Your Password - Vedessa',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #2d5016; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>VEDESSA</h1>
            <p>Ayurveda</p>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <center>
              <a href="${resetUrl}" class="button">Reset Password</a>
            </center>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2d5016;">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            <p>Best regards,<br>The Vedessa Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Vedessa. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  orderConfirmation: (order, userName) => ({
    subject: `Order Confirmation #${order.orderNumber} - Vedessa`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .order-item { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .total { font-size: 18px; font-weight: bold; color: #2d5016; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Order Confirmed!</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Thank you for your order! We're getting it ready for shipment.</p>
            <h3>Order #${order.orderNumber}</h3>
            <p>Order Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
            
            <h3>Items Ordered:</h3>
            ${order.items.map(item => `
              <div class="order-item">
                <strong>${item.productName}</strong><br>
                Quantity: ${item.quantity} × ₹${item.price} = ₹${(item.quantity * parseFloat(item.price)).toFixed(2)}
              </div>
            `).join('')}
            
            <div class="total">
              Total: ₹${order.totalAmount}
            </div>
            
            <p style="margin-top: 30px;">We'll send you another email when your order ships.</p>
            <p>Track your order: <a href="${process.env.FRONTEND_URL}/orders/${order.id}">View Order Details</a></p>
            
            <p>Best regards,<br>The Vedessa Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Vedessa. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  vendorApproval: (vendorName, companyName) => ({
    subject: 'Your Vendor Account Has Been Approved! - Vedessa',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #2d5016; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .checklist { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
          </div>
          <div class="content">
            <h2>Your Vendor Account is Approved</h2>
            <p>Hi ${vendorName},</p>
            <p>Great news! Your vendor account for <strong>${companyName}</strong> has been approved. You can now start selling on Vedessa!</p>
            
            <center>
              <a href="${process.env.FRONTEND_URL}/vendor/dashboard" class="button">Go to Vendor Dashboard</a>
            </center>
            
            <div class="checklist">
              <h3>Next Steps:</h3>
              <ul>
                <li>✓ Add your first product</li>
                <li>✓ Set up your product categories</li>
                <li>✓ Configure your shipping preferences</li>
                <li>✓ Review our vendor guidelines</li>
              </ul>
            </div>
            
            <p>If you have any questions, our support team is here to help!</p>
            <p>Best regards,<br>The Vedessa Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Vedessa. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  vendorRejection: (vendorName, reason) => ({
    subject: 'Vendor Application Update - Vedessa',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Vendor Application Update</h1>
          </div>
          <div class="content">
            <p>Hi ${vendorName},</p>
            <p>Thank you for your interest in becoming a vendor on Vedessa.</p>
            <p>After careful review, we're unable to approve your vendor application at this time.</p>
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            <p>You're welcome to reapply in the future. If you have questions, please contact our support team.</p>
            <p>Best regards,<br>The Vedessa Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Vedessa. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  orderShipped: (order, trackingNumber) => ({
    subject: `Your Order Has Shipped! #${order.orderNumber} - Vedessa`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .tracking { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
          .button { display: inline-block; padding: 12px 30px; background: #2d5016; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Your Order is On Its Way!</h1>
          </div>
          <div class="content">
            <p>Great news! Your order has been shipped and is on its way to you.</p>
            <h3>Order #${order.orderNumber}</h3>
            
            ${trackingNumber ? `
              <div class="tracking">
                <p><strong>Tracking Number:</strong></p>
                <p style="font-size: 18px; color: #2d5016; font-weight: bold;">${trackingNumber}</p>
                <a href="${process.env.FRONTEND_URL}/orders/${order.id}" class="button">Track Your Order</a>
              </div>
            ` : ''}
            
            <p>Expected delivery: 5-7 business days</p>
            <p>If you have any questions about your order, feel free to contact us.</p>
            <p>Best regards,<br>The Vedessa Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Vedessa. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  collaborationRequest: (formData) => ({
    subject: `New Collaboration Request from ${formData.fullName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #059669; }
          .label { font-weight: bold; color: #059669; margin-top: 15px; display: block; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🤝 New Collaboration Request</h1>
          </div>
          <div class="content">
            <p>You have received a new collaboration inquiry from your website.</p>
            
            <div class="info-box">
              <span class="label">Full Name:</span>
              <p>${formData.fullName}</p>
              
              <span class="label">Email:</span>
              <p><a href="mailto:${formData.email}">${formData.email}</a></p>
              
              ${formData.phone ? `
                <span class="label">Phone:</span>
                <p><a href="tel:${formData.phone}">${formData.phone}</a></p>
              ` : ''}
              
              <span class="label">About Their Work:</span>
              <p style="white-space: pre-wrap;">${formData.message}</p>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              Submitted on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Vedessa. All rights reserved.</p>
            <p>This is an automated notification from your website.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  supportRequest: (formData) => ({
    subject: `Support Request from ${formData.fullName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #d97706; }
          .label { font-weight: bold; color: #d97706; margin-top: 15px; display: block; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎧 New Support Request</h1>
          </div>
          <div class="content">
            <p>You have received a new support request from your website.</p>
            
            <div class="info-box">
              <span class="label">Full Name:</span>
              <p>${formData.fullName}</p>
              
              <span class="label">Email:</span>
              <p><a href="mailto:${formData.email}">${formData.email}</a></p>
              
              ${formData.phone ? `
                <span class="label">Phone:</span>
                <p><a href="tel:${formData.phone}">${formData.phone}</a></p>
              ` : ''}
              
              <span class="label">Concern:</span>
              <p style="white-space: pre-wrap;">${formData.concern}</p>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              Submitted on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Vedessa. All rights reserved.</p>
            <p>This is an automated notification from your website.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    const transporter = createTransporter();
    const emailContent = template(data);

    const mailOptions = {
      from: `"Vedessa" <${process.env.EMAIL_USER || process.env.SMTP_USER}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Exported functions
module.exports = {
  sendPasswordResetEmail: async (email, resetToken, userName) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    return await sendEmail(email, emailTemplates.passwordReset, resetUrl, userName);
  },

  sendOrderConfirmationEmail: async (email, order, userName) => {
    return await sendEmail(email, emailTemplates.orderConfirmation, { order, userName });
  },

  sendVendorApprovalEmail: async (email, vendorName, companyName) => {
    return await sendEmail(email, emailTemplates.vendorApproval, { vendorName, companyName });
  },

  sendVendorRejectionEmail: async (email, vendorName, reason) => {
    return await sendEmail(email, emailTemplates.vendorRejection, { vendorName, reason });
  },

  sendOrderShippedEmail: async (email, order, trackingNumber) => {
    return await sendEmail(email, emailTemplates.orderShipped, { order, trackingNumber });
  },

  // Test email function
  sendTestEmail: async (email) => {
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"Vedessa" <${process.env.EMAIL_USER || process.env.SMTP_USER}>`,
        to: email,
        subject: 'Test Email - Vedessa',
        html: '<h1>Email Service is Working!</h1><p>Your email configuration is correct.</p>'
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  sendCollaborationEmail: async (formData) => {
    const adminEmail = process.env.ADMIN_EMAIL || 'vedessa0203@gmail.com';
    return await sendEmail(adminEmail, emailTemplates.collaborationRequest, formData);
  },

  sendSupportEmail: async (formData) => {
    const adminEmail = process.env.ADMIN_EMAIL || 'vedessa0203@gmail.com';
    return await sendEmail(adminEmail, emailTemplates.supportRequest, formData);
  }
};
