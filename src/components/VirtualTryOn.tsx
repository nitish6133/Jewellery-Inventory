import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, RotateCw, ZoomIn, ZoomOut, X, RefreshCw } from 'lucide-react';
import { TableData } from '../types';

interface VirtualTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  product: TableData | null;
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ isOpen, onClose, product }) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 50, y: 30 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, Math.min(100, ((e.clientX - dragStart.x) / 400) * 100)),
          y: Math.max(0, Math.min(100, ((e.clientY - dragStart.y) / 400) * 100)),
        });
      }
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetPosition = () => {
    setPosition({ x: 50, y: 30 });
    setScale(1);
    setRotation(0);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas && userImage) {
      const link = document.createElement('a');
      link.download = `virtual-tryon-${product?.description || 'product'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Don't render unless open and product is valid
  if (!isOpen || !product || !product.image || !product.description) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Camera className="h-8 w-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">Virtual Try-On</h2>
                <p className="text-purple-100 mt-1">See how "{product.description}" looks on you!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-700 rounded-lg transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
          {/* Main Try-On Area */}
          <div className="lg:w-2/3 p-6 bg-gray-50">
            {!userImage ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Camera className="h-16 w-16 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Your Photo</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Upload a clear photo of yourself to see how this beautiful jewelry piece will look on you.
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center mx-auto"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Choose Photo
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full relative">
                <div
                  className="relative w-full h-full bg-white rounded-lg overflow-hidden shadow-inner"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {/* User Image */}
                  <img src={userImage} alt="User" className="w-full h-full object-cover" />

                  {/* Jewelry Overlay */}
                  <div
                    className="absolute cursor-move"
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                      transition: isDragging ? 'none' : 'transform 0.2s ease',
                    }}
                    onMouseDown={handleMouseDown}
                  >
                    <img
                      src={product.image}
                      alt={product.description}
                      className="w-24 h-24 object-contain drop-shadow-lg"
                      style={{
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96x96?text=Jewelry';
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls Panel */}
          <div className="lg:w-1/3 p-6 bg-white border-l border-gray-200 overflow-auto">
            <div className="space-y-6">
              {/* Product Info */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Selected Product</h4>
                <div className="flex items-center space-x-3">
                  <img
                    src={product.image}
                    alt={product.description}
                    className="w-12 h-12 rounded-lg object-cover border border-purple-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48?text=Jewelry';
                    }}
                  />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{product.description}</p>
                    <p className="text-purple-600 font-semibold">{product.price}</p>
                  </div>
                </div>
              </div>

              {!userImage && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">📸 Getting Started</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>1. Upload a clear, well-lit photo of yourself</p>
                    <p>2. Position the jewelry on your photo</p>
                    <p>3. Adjust size and angle for a perfect fit</p>
                  </div>
                </div>
              )}

              {userImage && (
                <div className="space-y-6">
                  <h4 className="font-semibold text-gray-900">🔍 Adjust Position & Size</h4>

                  {/* Size Control */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </button>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <button
                        onClick={() => setScale(Math.min(2, scale + 0.1))}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Rotation Control */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rotation</label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setRotation(rotation - 15)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                      >
                        <RotateCw className="h-4 w-4 transform rotate-180" />
                      </button>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="15"
                        value={rotation}
                        onChange={(e) => setRotation(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <button
                        onClick={() => setRotation(rotation + 15)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                      >
                        <RotateCw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={resetPosition}
                      className="w-full bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg font-medium text-gray-700 flex items-center justify-center"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset Position
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-purple-100 hover:bg-purple-200 py-2 px-4 rounded-lg font-medium text-purple-700 flex items-center justify-center"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Change Photo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;
