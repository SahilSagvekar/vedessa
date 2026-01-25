# 📧 Email Service Setup Guide

## Overview
This guide will help you set up email functionality for your Vedessa e-commerce platform.

---

## 🎯 What Emails Will Be Sent?

1. **Password Reset** - When users forget their password
2. **Order Confirmation** - When customers place an order
3. **Vendor Approval** - When admin approves a vendor
4. **Vendor Rejection** - When admin rejects a vendor
5. **Order Shipped** - When order is marked as shipped

---

## 📋 Prerequisites

You need to install nodemailer:
```bash
cd d:\vedessa\backend
npm install nodemailer
```

---

## 🔧 Configuration Options

### **Option 1: Gmail (Easiest for Development)**

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click "Security" → "2-Step Verification"
3. Follow the steps to enable it

#### Step 2: Create App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Name it "Vedessa"
4. Click "Generate"
5. **Copy the 16-character password** (you'll need this)

#### Step 3: Update Backend .env
Add these lines to `d:\vedessa\backend\.env`:

```env
# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173
```

**Example:**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=vedessa.shop@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
FRONTEND_URL=http://localhost:5173
```

---

### **Option 2: Other SMTP Services (Production)**

For production, use professional email services:

#### **SendGrid** (Recommended)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
FRONTEND_URL=https://vedessa.in
```

#### **AWS SES**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-aws-access-key
SMTP_PASSWORD=your-aws-secret-key
FRONTEND_URL=https://vedessa.in
```

#### **Mailgun**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASSWORD=your-mailgun-password
FRONTEND_URL=https://vedessa.in
```

---

## 🧪 Testing the Email Service

### Test Email Endpoint

I'll create a test endpoint for you. Add this to test if emails work:

**File:** `backend/src/routes/auth.routes.js`

Add this route:
```javascript
router.post('/test-email', async (req, res) => {
  const { email } = req.body;
  const emailService = require('../services/emailService');
  
  const result = await emailService.sendTestEmail(email);
  
  if (result.success) {
    res.json({ success: true, message: 'Test email sent!' });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});
```

### Test Using Postman or curl:
```bash
curl -X POST http://localhost:5000/api/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com"}'
```

---

## 📧 Email Templates Included

All emails have beautiful HTML templates with:
- ✅ Vedessa branding (green gradient header)
- ✅ Responsive design
- ✅ Professional styling
- ✅ Clear call-to-action buttons
- ✅ Footer with copyright

### Templates:
1. **Password Reset** - Green button with reset link
2. **Order Confirmation** - Order details with items list
3. **Vendor Approval** - Congratulations message with dashboard link
4. **Vendor Rejection** - Polite rejection with reason
5. **Order Shipped** - Tracking number and delivery info

---

## 🔐 Security Best Practices

### For Gmail:
- ✅ Use App Passwords, NOT your regular password
- ✅ Never commit .env file to Git
- ✅ Keep 2FA enabled

### For Production:
- ✅ Use dedicated email service (SendGrid/SES)
- ✅ Set up SPF, DKIM, DMARC records
- ✅ Use environment variables
- ✅ Monitor email sending limits
- ✅ Handle bounces and complaints

---

## 📊 Email Sending Limits

### Gmail:
- **Free:** 500 emails/day
- **Google Workspace:** 2,000 emails/day

### SendGrid:
- **Free:** 100 emails/day
- **Paid:** Starts at $15/month for 40,000 emails

### AWS SES:
- **Free Tier:** 62,000 emails/month (if sending from EC2)
- **Paid:** $0.10 per 1,000 emails

---

## 🚨 Troubleshooting

### Error: "Invalid login"
**Solution:** Make sure you're using an App Password, not your regular Gmail password.

### Error: "Connection timeout"
**Solution:** Check your firewall/antivirus. Port 587 must be open.

### Error: "self signed certificate"
**Solution:** Add this to your transporter config:
```javascript
tls: {
  rejectUnauthorized: false
}
```

### Emails going to spam
**Solution:** 
- Set up SPF record for your domain
- Use a verified sender email
- Don't send too many emails at once
- Use professional email service for production

---

## 📝 Next Steps After Setup

1. ✅ Install nodemailer
2. ✅ Configure .env file
3. ✅ Test email sending
4. ✅ Implement password reset backend (I'll do this next)
5. ✅ Test password reset flow
6. ✅ Add email notifications to order flow
7. ✅ Add email notifications to vendor approval

---

## 🎨 Customizing Email Templates

To customize the email templates, edit:
`backend/src/services/emailService.js`

Look for the `emailTemplates` object. Each template has:
- `subject` - Email subject line
- `html` - HTML content

You can change:
- Colors (currently green: #2d5016)
- Logo/branding
- Text content
- Button styles
- Footer text

---

## 💡 Pro Tips

1. **Development:** Use Gmail with App Password
2. **Production:** Use SendGrid or AWS SES
3. **Testing:** Use https://mailtrap.io for testing without sending real emails
4. **Monitoring:** Log all email sends for debugging
5. **Fallback:** Have a backup email service configured

---

## 📞 Need Help?

Common issues and solutions:

**Q: Can I use my regular Gmail password?**  
A: No, you MUST use an App Password if 2FA is enabled.

**Q: How do I know if email was sent?**  
A: Check the console logs. Successful sends show "Email sent successfully"

**Q: Can I send attachments?**  
A: Yes, nodemailer supports attachments. Add to mailOptions:
```javascript
attachments: [{
  filename: 'invoice.pdf',
  path: '/path/to/invoice.pdf'
}]
```

**Q: How do I track if emails are opened?**  
A: Use SendGrid or Mailgun - they provide tracking pixels and analytics.

---

**Ready to set up? Follow Option 1 (Gmail) for quick testing!**

Last Updated: January 21, 2026
