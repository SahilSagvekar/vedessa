import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, Loader2, ChevronRight, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import shippingService, { TrackingUpdate } from '@/services/shippingService';
import { motion } from 'framer-motion';

const TrackOrder = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [trackingData, setTrackingData] = useState<any>(null);
    const [searchParams] = useSearchParams();
    const { toast } = useToast();

    useEffect(() => {
        const awb = searchParams.get('awb');
        if (awb) {
            setTrackingNumber(awb);
            autoTrack(awb);
        }
    }, [searchParams]);

    const autoTrack = async (awb: string) => {
        try {
            setLoading(true);
            const response = await shippingService.trackShipment(awb.trim());
            if (response.success) {
                setTrackingData(response.tracking);
            }
        } catch (error: any) {
            toast({
                title: 'Tracking Error',
                description: 'No shipment found with this number.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTrack = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!trackingNumber.trim()) return;

        try {
            setLoading(true);
            const response = await shippingService.trackShipment(trackingNumber.trim());
            if (response.success) {
                setTrackingData(response.tracking);
            }
        } catch (error: any) {
            toast({
                title: 'Tracking Error',
                description: 'No shipment found with this number. Please check and try again.',
                variant: 'destructive',
            });
            setTrackingData(null);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIndex = (status: string) => {
        const statuses = ['Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];
        const index = statuses.findIndex(s => status.toLowerCase().includes(s.toLowerCase()));
        return index !== -1 ? index : 1;
    };

    const steps = [
        { title: 'Ordered', icon: Clock },
        { title: 'Picked Up', icon: Package },
        { title: 'In Transit', icon: Truck },
        { title: 'Delivered', icon: CheckCircle2 },
    ];

    return (
        <Layout>
            <div className="bg-kama-olive text-kama-cream py-16">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-display mb-4"
                    >
                        Track Your Order
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-kama-cream/80 max-w-xl mx-auto"
                    >
                        Enter your AWB number or Order ID to see real-time updates on your delivery.
                    </motion.p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 mb-20">
                <div className="max-w-4xl mx-auto">
                    {/* Tracking Search Card */}
                    <div className="bg-card border border-border rounded-xl shadow-xl p-6 md:p-8 mb-8 backdrop-blur-sm bg-card/95">
                        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    placeholder="Enter AWB Number (e.g., EKART123456789)"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    className="pl-10 h-12 bg-muted/50 border-border focus:ring-kama-olive"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading || !trackingNumber}
                                className="h-12 px-8 bg-kama-olive hover:bg-kama-olive-light text-kama-cream transition-all group"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        Track Now
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-kama-olive mb-4" />
                            <p className="text-muted-foreground animate-pulse">Fetching latest updates from Ekart...</p>
                        </div>
                    ) : trackingData ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            {/* Summary Card */}
                            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                                    <div>
                                        <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Current Status</p>
                                        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                                            <span className="w-3 h-3 bg-kama-orange rounded-full animate-ping"></span>
                                            {trackingData.status}
                                        </h2>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Expected Delivery</p>
                                        <p className="text-xl font-medium text-foreground">
                                            {trackingData.estimatedDelivery
                                                ? new Date(trackingData.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                                                : 'Updating soon...'}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress Visual */}
                                <div className="relative pt-10 pb-8">
                                    <div className="absolute top-[3.25rem] left-0 w-full h-1 bg-muted rounded-full"></div>
                                    <div
                                        className="absolute top-[3.25rem] left-0 h-1 bg-kama-olive rounded-full transition-all duration-1000"
                                        style={{ width: `${(getStatusIndex(trackingData.status) + 1) * 25}%` }}
                                    ></div>

                                    <div className="relative flex justify-between">
                                        {steps.map((step, idx) => {
                                            const isActive = idx <= getStatusIndex(trackingData.status);
                                            const Icon = step.icon;
                                            return (
                                                <div key={idx} className="flex flex-col items-center group">
                                                    <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-500
                            ${isActive ? 'bg-kama-olive text-kama-cream shadow-lg scale-110' : 'bg-muted text-muted-foreground'}
                          `}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <span className={`mt-3 text-xs md:text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                        {step.title}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Updates */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 bg-card border border-border rounded-xl p-6">
                                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-kama-olive" />
                                        Tracking History
                                    </h3>
                                    <div className="space-y-8 relative before:absolute before:left-[1.2rem] before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
                                        {trackingData.updates.map((update: TrackingUpdate, idx: number) => (
                                            <div key={idx} className="relative pl-10">
                                                <div className={`
                          absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-card bg-muted flex items-center justify-center z-10
                          ${idx === 0 ? 'bg-kama-olive text-kama-cream' : 'text-muted-foreground'}
                        `}>
                                                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-kama-cream' : 'bg-muted-foreground'}`}></div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                                    <div>
                                                        <p className={`font-semibold ${idx === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                            {update.status}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">{update.description}</p>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded whitespace-nowrap mt-1 sm:mt-0">
                                                        {new Date(update.timestamp).toLocaleString('en-IN', {
                                                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-kama-olive" />
                                            Last Location
                                        </h3>
                                        <p className="text-foreground font-medium">{trackingData.location}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Processed at regional hub</p>
                                    </div>

                                    <div className="bg-kama-olive/5 border border-kama-olive/10 rounded-xl p-6">
                                        <h3 className="text-sm font-semibold text-kama-olive uppercase tracking-wider mb-3">Need Help?</h3>
                                        <p className="text-sm text-foreground/80 mb-4">
                                            If you have questions about your delivery, our support team is here to help.
                                        </p>
                                        <Button variant="outline" className="w-full border-kama-olive text-kama-olive hover:bg-kama-olive hover:text-kama-cream">
                                            Contact Support
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-muted/30 border border-dashed border-border rounded-2xl py-20 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                                <Package className="w-10 h-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-medium text-foreground mb-2">No Tracking Information Yet</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto">
                                Enter your AWB number above to see the journey of your package.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default TrackOrder;
