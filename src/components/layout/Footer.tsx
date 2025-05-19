
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-white">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">ProductLens</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Making informed product decisions easier with powerful comparisons and up-to-date information.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-3 text-sm">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/compare" className="text-muted-foreground hover:text-foreground transition-colors">
                    Compare Products
                  </Link>
                </li>
                <li>
                  <Link to="/finder" className="text-muted-foreground hover:text-foreground transition-colors">
                    Product Finder
                  </Link>
                </li>
                <li>
                  <Link to="/updates" className="text-muted-foreground hover:text-foreground transition-colors">
                    Product Updates
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 text-sm">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3 text-sm">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest product updates and tips.
            </p>
            <div className="flex gap-2">
              <Button size="icon" variant="outline">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button size="icon" variant="outline">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button size="icon" variant="outline">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ProductLens. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
