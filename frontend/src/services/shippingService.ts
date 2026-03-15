import api from '../lib/api';

export interface TrackingUpdate {
    timestamp: string;
    status: string;
    location: string;
    description: string;
}

export interface TrackingResponse {
    success: boolean;
    tracking: {
        status: string;
        location: string;
        updates: TrackingUpdate[];
        estimatedDelivery?: string;
        mock?: boolean;
    };
}

const shippingService = {
    /**
     * Create shipment for an order
     */
    createShipment: (orderId: string, weight?: number, dimensions?: any): Promise<any> => {
        return api.post('/shipping/create', { orderId, weight, dimensions });
    },

    /**
     * Track a shipment by AWB number
     */
    trackShipment: (awbNumber: string): Promise<TrackingResponse> => {
        return api.get(`/shipping/track/${awbNumber}`);
    },

    /**
     * Track a shipment by Order number
     */
    trackByOrderId: (orderNumber: string): Promise<TrackingResponse> => {
        return api.get(`/shipping/track/${orderNumber}`);
    },

    /**
     * Calculate shipping rate
     */
    calculateRate: (destinationPincode: string, weight?: number, paymentMethod?: string): Promise<any> => {
        return api.post('/shipping/calculate-rate', { 
            destinationPincode, 
            weight, 
            paymentMethod 
        });
    },

    /**
     * Schedule pickup
     */
    schedulePickup: (pickupDate: string, orderIds: string[]): Promise<any> => {
        return api.post('/shipping/schedule-pickup', { pickupDate, orderIds });
    },

    /**
     * Cancel shipment
     */
    cancelShipment: (orderId: string): Promise<any> => {
        return api.post(`/shipping/cancel/${orderId}`);
    },

    /**
     * Generate shipping label
     */
    generateLabel: (orderId: string): Promise<any> => {
        return api.get(`/shipping/label/${orderId}`);
    },

    /**
     * Admin: Get all shipments
     */
    getAllShipments: (params: any = {}): Promise<any> => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.status) queryParams.append('status', params.status);
        
        return api.get(`/shipping/all?${queryParams.toString()}`);
    }
};

export default shippingService;
