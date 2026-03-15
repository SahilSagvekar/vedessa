const axios = require('axios');

/**
 * Shiprocket Service for managing logistics
 * Documentation: https://apidocs.shiprocket.in/
 */

class ShiprocketService {
  constructor() {
    this.baseUrl = 'https://apiv2.shiprocket.in/v1/external';
    this.token = null;
    this.tokenExpiry = null;
    
    // Credentials from .env
    this.email = process.env.SHIPROCKET_EMAIL;
    this.password = process.env.SHIPROCKET_PASSWORD;
  }

  /**
   * Authenticate with Shiprocket and get JWT token
   */
  async authenticate() {
    // Return cached token if valid
    if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const response = await axios.post(`${this.baseUrl}/auth/login`, {
        email: this.email,
        password: this.password
      });

      this.token = response.data.token;
      // Token is valid for 10 days, we'll refresh every 9 days to be safe
      this.tokenExpiry = new Date();
      this.tokenExpiry.setDate(this.tokenExpiry.getDate() + 9);

      return this.token;
    } catch (error) {
      console.error('Shiprocket Auth Error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Shiprocket');
    }
  }

  /**
   * Get headers for API requests
   */
  async getHeaders() {
    const token = await this.authenticate();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Get serviceability and rates for a shipment
   */
  async getServiceability(pickupPincode, deliveryPincode, weight, cod = 0) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseUrl}/courier/serviceability/`, {
        headers,
        params: {
          pickup_postcode: pickupPincode,
          delivery_postcode: deliveryPincode,
          weight: weight,
          cod: cod,
        }
      });

      if (response.data && response.data.status === 200) {
        return response.data.data.available_courier_companies;
      }
      return [];
    } catch (error) {
      console.error('Shiprocket Serviceability Error:', error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Find the cheapest courier from available options
   */
  getCheapestCourier(couriers) {
    if (!couriers || couriers.length === 0) return null;
    
    return couriers.reduce((cheapest, current) => {
      return (current.rate < cheapest.rate) ? current : cheapest;
    });
  }

  /**
   * Create an adhoc order in Shiprocket
   */
  async createOrder(orderData) {
    try {
      const headers = await this.getHeaders();
      
      // Map internal order to Shiprocket format
      const shiprocketOrder = {
        order_id: orderData.orderNumber,
        order_date: new Date().toISOString().split('T')[0],
        pickup_location: process.env.SHIPROCKET_PICKUP_NAME || 'Primary',
        billing_customer_name: orderData.shippingAddress.name.split(' ')[0] || 'Customer',
        billing_last_name: orderData.shippingAddress.name.split(' ').slice(1).join(' ') || '',
        billing_address: orderData.shippingAddress.address,
        billing_city: orderData.shippingAddress.city,
        billing_pincode: orderData.shippingAddress.pincode,
        billing_state: orderData.shippingAddress.state,
        billing_country: 'India',
        billing_email: orderData.user?.email || 'customer@example.com',
        billing_phone: orderData.shippingAddress.phone,
        shipping_is_billing: true,
        order_items: orderData.items.map(item => ({
          name: item.productName,
          sku: item.sku || item.productId,
          units: item.quantity,
          selling_price: item.price
        })),
        payment_method: orderData.paymentMethod === 'COD' ? 'Postpaid' : 'Prepaid',
        sub_total: orderData.subtotal,
        length: orderData.length || 10,
        breadth: orderData.width || 10,
        height: orderData.height || 10,
        weight: orderData.weight || 0.5
      };

      const response = await axios.post(`${this.baseUrl}/orders/create/adhoc`, shiprocketOrder, { headers });
      return response.data;
    } catch (error) {
      console.error('Shiprocket Order Creation Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create order in Shiprocket');
    }
  }

  /**
   * Generate AWB for a shipment
   */
  async generateAWB(shipmentId, courierId = null) {
    try {
      const headers = await this.getHeaders();
      const payload = { shipment_id: shipmentId };
      if (courierId) payload.courier_id = courierId;

      const response = await axios.post(`${this.baseUrl}/courier/assign/awb`, payload, { headers });
      return response.data;
    } catch (error) {
      console.error('Shiprocket AWB Generation Error:', error.response?.data || error.message);
      throw new Error('Failed to generate AWB in Shiprocket');
    }
  }

  /**
   * Track shipment by AWB and normalize for frontend
   */
  async trackShipment(awbNumber) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseUrl}/courier/track/awb/${awbNumber}`, { headers });
      
      const trackingData = response.data.tracking_data;
      if (!trackingData || !trackingData.shipment_track || trackingData.shipment_track.length === 0) {
        return { success: false, message: 'No tracking data found' };
      }

      const track = trackingData.shipment_track[0];
      const activities = trackingData.shipment_track_activities || [];

      return {
        success: true,
        tracking: {
          status: track.current_status,
          location: track.current_location,
          expected_delivery_date: track.expected_delivery_date,
          updates: activities.map(activity => ({
            timestamp: activity.date,
            status: activity.status,
            location: activity.location,
            description: activity.activity
          }))
        }
      };
    } catch (error) {
      console.error('Shiprocket Tracking Error:', error.response?.data || error.message);
      return { success: false, message: 'Failed to track shipment' };
    }
  }
}

module.exports = new ShiprocketService();
