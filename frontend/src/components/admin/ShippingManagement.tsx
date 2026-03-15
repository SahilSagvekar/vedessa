import { useState, useEffect } from 'react';
import { Truck, Package, Search, ExternalLink, FileText, XCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import shippingService from '@/services/shippingService';
import { useToast } from '@/hooks/use-toast';

const ShippingManagement = () => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const { toast } = useToast();

  useEffect(() => {
    fetchShipments();
  }, [pagination.page]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await shippingService.getAllShipments({
        page: pagination.page,
        limit: pagination.limit
      });
      setShipments(response.shipments);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
        pages: response.pagination.pages
      }));
    } catch (error) {
      console.error('Failed to fetch shipments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load shipments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelShipment = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this shipment?')) return;

    try {
      await shippingService.cancelShipment(orderId);
      toast({
        title: 'Shipment Cancelled',
        description: 'The shipment has been cancelled successfully.',
      });
      fetchShipments();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to cancel shipment',
        variant: 'destructive',
      });
    }
  };

  const handlePrintLabel = async (orderId: string) => {
    try {
      const response = await shippingService.generateLabel(orderId);
      if (response.label?.labelUrl) {
        window.open(response.label.labelUrl, '_blank');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to generate shipping label',
        variant: 'destructive',
      });
    }
  };

  const filteredShipments = shipments.filter(shipment => 
    shipment.awbNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (shipment.orderNumber || shipment.order_number)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Truck className="w-5 h-5 text-kama-olive" />
            Shipment Management
          </h2>
          <p className="text-sm text-muted-foreground">Manage Shiprocket (Multi-courier) shipments</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search AWB or Order..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-kama-olive" />
        </div>
      ) : filteredShipments.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No shipments found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 font-medium text-xs uppercase tracking-wider">AWB Number</th>
                <th className="p-4 font-medium text-xs uppercase tracking-wider">Order</th>
                <th className="p-4 font-medium text-xs uppercase tracking-wider">Recipient</th>
                <th className="p-4 font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 font-medium text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <div className="font-mono font-medium text-foreground">{shipment.awbNumber}</div>
                    {shipment.trackingUrl && (
                      <a 
                        href={shipment.trackingUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-kama-olive hover:underline flex items-center gap-1 mt-1"
                      >
                        Track Shipment <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-foreground">
                      #{shipment.orderNumber || shipment.order_number}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(shipment.createdAt || shipment.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-foreground">{shipment.user?.fullName || 'N/A'}</div>
                    <div className="text-xs text-muted-foreground">{shipment.user?.email}</div>
                  </td>
                  <td className="p-4">
                    <Badge className={`
                      ${shipment.shippingStatus === 'DELIVERED' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                        shipment.shippingStatus === 'CANCELLED' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                        shipment.shippingStatus === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                        'bg-amber-100 text-amber-700 hover:bg-amber-100'}
                      border-none text-[10px] py-0 h-5
                    `}>
                      {shipment.shippingStatus || 'CREATED'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs gap-1"
                        onClick={() => handlePrintLabel(shipment.id)}
                      >
                        <FileText className="w-3.5 h-3.5" /> Label
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs gap-1 text-destructive hover:text-destructive"
                        onClick={() => handleCancelShipment(shipment.id)}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancel
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Showing {filteredShipments.length} of {pagination.total} shipments
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={pagination.page === 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={pagination.page === pagination.pages}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingManagement;
