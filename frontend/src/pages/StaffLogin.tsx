import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/components/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const emailSchema = z.string().email('Please enter a valid email address');

/**
 * Email + password login for staff (ADMIN and VENDOR accounts).
 * Customers sign in with Google or mobile OTP on /auth.
 */
const StaffLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { signIn, user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const goHome = (role?: string) => {
    if (role === 'ADMIN') navigate('/admin');
    else if (role === 'VENDOR') navigate('/vendor/dashboard');
    else navigate('/');
  };

  useEffect(() => {
    if (!loading && isAuthenticated) goHome(user?.role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, loading, user?.role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const next: { email?: string; password?: string } = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) next.email = emailResult.error.errors[0].message;
    if (!password) next.password = 'Password is required';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setIsSubmitting(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: 'Login Failed',
          description: error.message || 'Invalid email or password. Please try again.',
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Welcome back!', description: 'You have successfully logged in.' });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-primary tracking-wider">VEDESSA</h1>
            <p className="text-xs tracking-[0.3em] text-primary/80 mt-1">AYURVEDA</p>
          </div>

          <h2 className="text-2xl font-serif text-primary text-center mb-1">Staff Login</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">For admins and vendors</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border-primary/20 focus:border-primary"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-primary">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="border-primary/20 focus:border-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/60 hover:text-primary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Login
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Want to sell on Vedessa?{' '}
              <Link to="/vendor/register" className="text-primary hover:underline font-medium">
                Register as a vendor
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Shopping?{' '}
              <Link to="/auth" className="text-primary hover:underline font-medium">
                Sign in with Google or mobile
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
