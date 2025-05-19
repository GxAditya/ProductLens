
import AuthForm from '@/components/auth/AuthForm';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-md mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="heading-2 gradient-text mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to access your saved comparisons and preferences
            </p>
          </div>
          
          <AuthForm />
          
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-brand-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-brand-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LoginPage;
