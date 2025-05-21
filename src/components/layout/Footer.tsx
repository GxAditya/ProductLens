import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto py-4 text-center text-sm text-muted-foreground">
        &copy; 2025 Item Discovery Hub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
