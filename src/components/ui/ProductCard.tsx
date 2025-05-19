
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Product } from '@/utils/productApiService';

interface ProductCardProps {
  product: Product;
  showActions?: boolean;
  className?: string;
}

const ProductCard = ({ product, showActions = true, className }: ProductCardProps) => {
  return (
    <Card className={`card-hover overflow-hidden ${className || ''}`}>
      <div className="aspect-square w-full relative bg-muted">
        <img
          src={product.imageUrl || "https://placehold.co/300x300/e6f2ff/0284c7?text=Product"}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        {product.rating && (
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2 text-xs">{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-md text-brand-600">{product.price}</p>
          <Badge variant="outline" className="text-xs font-normal">
            {product.category}
          </Badge>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {product.features.slice(0, 2).map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to={`/compare?product1=${encodeURIComponent(product.name)}`}>
              Compare
            </Link>
          </Button>
          <Button asChild size="sm" className="flex-1">
            <Link to={`/product/${product.id}`}>
              Details
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;
