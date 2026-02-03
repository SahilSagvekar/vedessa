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
     * Track a shipment by AWB number
     */
    trackShipment: (awbNumber: string): Promise<TrackingResponse> => {
        return api.get(`/shipping/track/${awbNumber}`);
    },

    /**
     * Track a shipment by Order number (if we have an internal mapping or API support)
     */
    trackByOrderId: (orderNumber: string): Promise<TrackingResponse> => {
        // For now, we'll assume the user enters the AWB in the same field, 
        // but we could add a specific backend route if needed.
        return api.get(`/shipping/track/${orderNumber}`);
    }
};

export default shippingService;
