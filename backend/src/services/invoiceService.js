const PDFDocument = require('pdfkit');
const path = require('path');

const LOGO_PATH = path.join(__dirname, '../assets/vedessa-logo.png');

const BUSINESS = {
    name: process.env.BUSINESS_NAME || 'Vedessa',
    phone: process.env.BUSINESS_PHONE || '8097460676',
    email: process.env.BUSINESS_EMAIL || 'vedessa0203@gmail.com',
    gstin: process.env.BUSINESS_GSTIN || null // not registered — omit the line entirely if blank
};

const money = (value) => `Rs. ${parseFloat(value || 0).toFixed(2)}`;

/**
 * Generate an invoice PDF for an order and resolve with a Buffer.
 * @param {object} order  - Prisma order record, including `items`
 * @param {object} user   - { fullName, email } of the customer (may be null for guest orders)
 * @returns {Promise<Buffer>}
 */
function generateInvoicePdf(order, user) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const chunks = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

            // ---- Header: logo + business details ----
            try {
                doc.image(LOGO_PATH, doc.page.margins.left, doc.page.margins.top, { width: 60 });
            } catch (imgError) {
                console.error('Invoice logo failed to load:', imgError.message);
            }

            const headerTextX = doc.page.margins.left + 75;
            doc.font('Helvetica-Bold').fontSize(18).fillColor('#2d5016')
                .text(BUSINESS.name, headerTextX, doc.page.margins.top, { width: pageWidth - 75 });

            doc.font('Helvetica').fontSize(9).fillColor('#444')
                .text(`Phone: ${BUSINESS.phone}  |  Email: ${BUSINESS.email}`, headerTextX, doc.y + 2, { width: pageWidth - 75 });

            if (BUSINESS.gstin) {
                doc.text(`GSTIN: ${BUSINESS.gstin}`, headerTextX, doc.y, { width: pageWidth - 75 });
            }

            doc.moveDown(1.5);
            doc.strokeColor('#2d5016').lineWidth(1)
                .moveTo(doc.page.margins.left, doc.y)
                .lineTo(doc.page.width - doc.page.margins.right, doc.y)
                .stroke();
            doc.moveDown(1);

            // ---- Title + invoice meta ----
            doc.font('Helvetica-Bold').fontSize(16).fillColor('#111').text('INVOICE');
            doc.moveDown(0.5);

            const metaTop = doc.y;
            doc.font('Helvetica').fontSize(10).fillColor('#333');
            doc.text(`Invoice No: INV-${order.orderNumber}`, doc.page.margins.left, metaTop);
            doc.text(`Order No: ${order.orderNumber}`, doc.page.margins.left, doc.y);
            doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, doc.page.margins.left, doc.y);
            doc.text(`Payment Method: ${order.paymentMethod || 'N/A'}`, doc.page.margins.left, doc.y);

            // ---- Bill To ----
            const billToX = doc.page.width / 2;
            const address = order.shippingAddress || {};
            doc.font('Helvetica-Bold').fontSize(10).text('Bill To:', billToX, metaTop);
            doc.font('Helvetica').fontSize(10);
            doc.text(address.name || user?.fullName || 'Customer', billToX, doc.y);
            if (address.address) doc.text(address.address, billToX, doc.y, { width: pageWidth / 2 - 10 });
            if (address.city || address.state || address.pincode) {
                doc.text(`${address.city || ''}${address.city ? ', ' : ''}${address.state || ''} ${address.pincode || ''}`.trim(), billToX, doc.y);
            }
            if (address.phone) doc.text(`Phone: ${address.phone}`, billToX, doc.y);
            if (user?.email) doc.text(`Email: ${user.email}`, billToX, doc.y);

            doc.moveDown(2);

            // ---- Items table ----
            const tableTop = doc.y;
            const col = {
                item: doc.page.margins.left,
                qty: doc.page.margins.left + pageWidth * 0.55,
                price: doc.page.margins.left + pageWidth * 0.7,
                amount: doc.page.margins.left + pageWidth * 0.85
            };

            doc.font('Helvetica-Bold').fontSize(10).fillColor('#fff');
            doc.rect(doc.page.margins.left, tableTop, pageWidth, 20).fill('#2d5016');
            doc.fillColor('#fff')
                .text('Item', col.item + 5, tableTop + 6)
                .text('Qty', col.qty, tableTop + 6, { width: 40, align: 'right' })
                .text('Price', col.price, tableTop + 6, { width: 60, align: 'right' })
                .text('Amount', col.amount, tableTop + 6, { width: 70, align: 'right' });

            let rowY = tableTop + 20;
            doc.font('Helvetica').fontSize(9.5).fillColor('#222');

            (order.items || []).forEach((item, idx) => {
                const rowHeight = 22;
                if (idx % 2 === 1) {
                    doc.rect(doc.page.margins.left, rowY, pageWidth, rowHeight).fill('#f5f5f0');
                    doc.fillColor('#222');
                }
                const lineTotal = parseFloat(item.price) * item.quantity;
                doc.text(item.productName || 'Product', col.item + 5, rowY + 6, { width: col.qty - col.item - 10 });
                doc.text(String(item.quantity), col.qty, rowY + 6, { width: 40, align: 'right' });
                doc.text(money(item.price), col.price, rowY + 6, { width: 60, align: 'right' });
                doc.text(money(lineTotal), col.amount, rowY + 6, { width: 70, align: 'right' });
                rowY += rowHeight;
            });

            doc.y = rowY + 10;

            // ---- Totals ----
            const totalsX = doc.page.width - doc.page.margins.right - 200;
            const writeTotalLine = (label, value, bold = false) => {
                doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(bold ? 11 : 10);
                doc.text(label, totalsX, doc.y, { width: 120, align: 'left', continued: true });
                doc.text(value, { width: 80, align: 'right' });
            };

            writeTotalLine('Subtotal:', money(order.subtotal));
            if (parseFloat(order.discountAmount) > 0) {
                writeTotalLine('Discount:', `- ${money(order.discountAmount)}`);
            }
            writeTotalLine('Tax:', money(order.taxAmount));
            writeTotalLine('Shipping:', parseFloat(order.shippingCost) > 0 ? money(order.shippingCost) : 'Free');
            doc.moveDown(0.3);
            doc.strokeColor('#ccc').lineWidth(0.5)
                .moveTo(totalsX, doc.y)
                .lineTo(doc.page.width - doc.page.margins.right, doc.y)
                .stroke();
            doc.moveDown(0.3);
            doc.fillColor('#2d5016');
            writeTotalLine('Total:', money(order.totalAmount), true);
            doc.fillColor('#222');

            // ---- Footer ----
            doc.moveDown(3);
            doc.font('Helvetica').fontSize(9).fillColor('#666')
                .text('Thank you for shopping with Vedessa!', { align: 'center' });
            doc.text('This is a computer-generated invoice and does not require a signature.', { align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { generateInvoicePdf };