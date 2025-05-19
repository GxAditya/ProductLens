
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">ProductLens</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/compare" className="px-4 py-2 text-sm font-medium hover:text-brand-600 transition-colors">
            Compare
          </Link>
          <Link to="/finder" className="px-4 py-2 text-sm font-medium hover:text-brand-600 transition-colors">
            Find Products
          </Link>
          {/* Removed Updates link from navigation */}
          <Button variant="ghost" size="icon" className="ml-2">
            <Search className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Search</span>
          </Button>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden md:flex">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild className="hidden md:flex">
            <Link to="/login?signup=true">Sign Up</Link>
          </Button>
          
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="container md:hidden pb-4 animate-fade-in">
          <nav className="flex flex-col space-y-2">
            <Link 
              to="/compare" 
              className="px-2 py-2 text-sm font-medium hover:bg-accent rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Compare
            </Link>
            <Link 
              to="/finder" 
              className="px-2 py-2 text-sm font-medium hover:bg-accent rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Products
            </Link>
            <Link 
              to="/updates" 
              className="px-2 py-2 text-sm font-medium hover:bg-accent rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Updates
            </Link>
            <hr className="my-2" />
            <Link 
              to="/login" 
              className="px-2 py-2 text-sm font-medium hover:bg-accent rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link 
              to="/login?signup=true" 
              className="px-2 py-2 text-sm font-medium bg-primary text-white rounded-md text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
