import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/components/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type Step = 'choose' | 'otp' | 'name';

const RESEND_SECONDS = 30;
const RECAPTCHA_ID = 'recaptcha-container';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
  </svg>
);

const Auth = () => {
  const [step, setStep] = useState<Step>('choose');
  const [mobile, setMobile] = useState(''); // 10 digits, +91 is added on send
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<'google' | 'otp' | 'verify' | 'name' | null>(null);
  const [resendIn, setResendIn] = useState(0);

  const { signInWithGoogle, sendOtp, verifyOtp, updateProfile, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  // True from the moment a sign-in starts until we navigate ourselves, so the
  // "already logged in" redirect below can't race the name step.
  const handlingLogin = useRef(false);

  // Already logged in -> home
  useEffect(() => {
    if (!loading && isAuthenticated && !handlingLogin.current) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  // Resend countdown
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const afterSignIn = (needsName: boolean) => {
    if (needsName) {
      setStep('name');
    } else {
      handlingLogin.current = false;
      toast({ title: 'Welcome to Vedessa!', description: 'You are now signed in.' });
      navigate('/');
    }
  };

  const handleGoogle = async () => {
    setError('');
    setBusy('google');
    handlingLogin.current = true;
    const { error: err, needsName } = await signInWithGoogle();
    setBusy(null);
    if (err) {
      handlingLogin.current = false;
      setError(err.message);
      return;
    }
    afterSignIn(needsName);
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setBusy('otp');
    const { error: err } = await sendOtp(`+91${mobile}`, RECAPTCHA_ID);
    setBusy(null);
    if (err) {
      setError(err.message);
      return;
    }
    setOtp('');
    setResendIn(RESEND_SECONDS);
    setStep('otp');
  };

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    setBusy('verify');
    handlingLogin.current = true;
    const { error: err, needsName } = await verifyOtp(otp);
    setBusy(null);
    if (err) {
      handlingLogin.current = false;
      setError(err.message);
      setOtp('');
      return;
    }
    afterSignIn(needsName);
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const name = fullName.trim();
    if (!name) {
      setError('Please tell us your name.');
      return;
    }
    setBusy('name');
    const { error: err } = await updateProfile({ fullName: name });
    setBusy(null);
    if (err) {
      setError(err.message || 'Could not save your name. Please try again.');
      return;
    }
    handlingLogin.current = false;
    toast({ title: `Welcome, ${name.split(' ')[0]}!`, description: 'You are now signed in.' });
    navigate('/');
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
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-primary tracking-wider">VEDESSA</h1>
            <p className="text-xs tracking-[0.3em] text-primary/80 mt-1">AYURVEDA</p>
          </div>

          {step === 'choose' && (
            <>
              <h2 className="text-2xl font-serif text-primary text-center mb-1">Welcome</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Sign in or create an account in seconds.
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogle}
                disabled={busy !== null}
                className="w-full py-6 border-primary/30 text-primary hover:bg-primary/5"
              >
                {busy === 'google' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <GoogleIcon />}
                <span className="ml-2">Continue with Google</span>
              </Button>

              <div className="flex items-center gap-3 my-6">
                <div className="h-px flex-1 bg-primary/15" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-primary/15" />
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-primary">Mobile number</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-primary/20 bg-muted text-sm text-primary">
                      +91
                    </span>
                    <Input
                      id="mobile"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile number"
                      className="rounded-l-none border-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={busy !== null}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
                >
                  {busy === 'otp' && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Send OTP
                </Button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-serif text-primary mb-1">Enter OTP</h2>
                <p className="text-sm text-muted-foreground">
                  We sent a 6-digit code to +91 {mobile}.{' '}
                  <button
                    type="button"
                    onClick={() => { setStep('choose'); setError(''); setOtp(''); }}
                    className="text-primary hover:underline"
                  >
                    Change
                  </button>
                </p>
              </div>

              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp} onComplete={() => handleVerify()}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                type="submit"
                disabled={busy !== null || otp.length !== 6}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
              >
                {busy === 'verify' && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Verify &amp; Continue
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {resendIn > 0 ? (
                  <>Resend OTP in {resendIn}s</>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={busy !== null}
                    className="text-primary hover:underline font-medium"
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            </form>
          )}

          {step === 'name' && (
            <form onSubmit={handleSaveName} className="space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-serif text-primary mb-1">One last thing</h2>
                <p className="text-sm text-muted-foreground">What should we call you?</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-primary">Full name</Label>
                <Input
                  id="fullName"
                  type="text"
                  autoFocus
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="border-primary/20 focus:border-primary"
                />
              </div>
              <Button
                type="submit"
                disabled={busy !== null}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
              >
                {busy === 'name' && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Continue
              </Button>
            </form>
          )}

          {error && (
            <p role="alert" className="mt-4 text-sm text-destructive text-center">{error}</p>
          )}

          {/* Invisible reCAPTCHA host for Firebase phone auth */}
          <div id={RECAPTCHA_ID} />

          {step !== 'name' && (
            <p className="mt-6 text-xs text-muted-foreground text-center leading-snug">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="text-primary underline" target="_blank">Terms &amp; Conditions</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-primary underline" target="_blank">Privacy Policy</Link>.
            </p>
          )}

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
