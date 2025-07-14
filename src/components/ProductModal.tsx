import React, { useState } from 'react';
import { X, ShoppingCart, CreditCard, Star, Heart, Share2, Truck, Shield, RotateCcw, Camera } from 'lucide-react';
import { TableData } from '../types';
import { useCart } from '../context/CartContext';
import PaymentForm from './PaymentForm';
import VirtualTryOn from './VirtualTryOn';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: TableData | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    return numPrice;
  };

  const price = formatPrice(product.price);
  const totalPrice = price * quantity;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onClose();
  };

  const handleBuyNow = (method: 'card' | 'upi') => {
    setPaymentMethod(method);
    setShowPayment(true);
  };

  const handleVirtualTryOn = () => {
    setShowVirtualTryOn(true);
  };

  const isOutOfStock = product.availability.toLowerCase().includes('out') || 
                      product.availability.toLowerCase().includes('unavailable');

  // Mock additional images for demo
  const productImages = [
    product.image,
    product.image, // In real app, these would be different angles
    product.image,
    product.image
  ];

  if (showPayment) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
      </div>
    );
  }

  if (showVirtualTryOn) {
    return (
      <VirtualTryOn
        isOpen={showVirtualTryOn}
        onClose={() => setShowVirtualTryOn(false)}
        product={product}
      />
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-purple-50">
          <h2 className="text-lg font-semibold text-purple-900">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)] overflow-y-auto">
          {/* Image Section */}
          <div className="lg:w-1/2 p-6">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={productImages[selectedImage]}
                  alt={product.description}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x500?text=Jewelry+Image';
                  }}
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="flex space-x-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                      selectedImage === index ? 'border-purple-600' : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.description} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=No+Image';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="lg:w-1/2 p-6 space-y-6">
            {/* Product Title and Rating */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.description}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.8) • 127 reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-purple-600">${price.toFixed(2)}</span>
                <span className="text-lg text-gray-500 line-through">${(price * 1.2).toFixed(2)}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                  17% OFF
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Inclusive of all taxes</p>
            </div>

            {/* Availability */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Availability:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                isOutOfStock 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {product.availability}
              </span>
            </div>

            {/* Product Features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Product Features</h3>
              <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-purple-600" />
                  Certified Authentic Jewelry
                </div>
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-purple-600" />
                  Free Shipping & Insurance
                </div>
                <div className="flex items-center">
                  <RotateCcw className="h-4 w-4 mr-2 text-purple-600" />
                  30-Day Return Policy
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100 transition-colors duration-200"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100 transition-colors duration-200"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Total Price */}
            {quantity > 1 && (
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Price:</span>
                  <span className="text-xl font-bold text-purple-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isOutOfStock ? (
                <>
                  <button
                    onClick={handleVirtualTryOn}
                    className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Virtual Try-On
                  </button>
                  
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleBuyNow('card')}
                      className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Buy with Card
                    </button>
                    
                    <button
                      onClick={() => handleBuyNow('upi')}
                      className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                    >
                      💳 Buy with UPI
                    </button>
                  </div>
                </>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>

            {/* Additional Actions */}
            <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-200">
              <button className="flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-200">
                <Heart className="h-4 w-4 mr-1" />
                Add to Wishlist
              </button>
              <button className="flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-200">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;