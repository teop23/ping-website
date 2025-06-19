import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fabric } from 'fabric';
import { Upload, Download, RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { calculateCanvasSize, safeRenderAll } from '../utils/canvasUtils';
import pingIcon from '../assets/ping_transparent_icon.png';
import { TwitterIcon } from '../components/Navbar';

const WatermarkTool: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [uploadedImage, setUploadedImage] = useState<fabric.Image | null>(null);
  const [watermarkImage, setWatermarkImage] = useState<fabric.Image | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.8);
  const [isCopying, setIsCopying] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasSize = calculateCanvasSize(canvasRef.current?.parentElement);

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: canvasSize,
      height: canvasSize,
      backgroundColor: 'transparent',
      selection: true
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    if (!canvas) return;

    const handleResize = () => {
      const newSize = calculateCanvasSize(canvasRef.current?.parentElement);
      canvas.setDimensions({ width: newSize, height: newSize });
      
      // Rescale uploaded image to fit new canvas size
      if (uploadedImage) {
        scaleImageToFit(uploadedImage, newSize, newSize);
      }
      
      safeRenderAll(canvas);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvas, uploadedImage]);

  const scaleImageToFit = (img: fabric.Image, maxWidth: number, maxHeight: number) => {
    const imgWidth = img.getOriginalSize().width;
    const imgHeight = img.getOriginalSize().height;
    
    const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight) * 0.9; // 90% of canvas size
    
    img.set({
      scaleX: scale,
      scaleY: scale,
      left: maxWidth / 2,
      top: maxHeight / 2,
      originX: 'center',
      originY: 'center'
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check if canvas is ready, if not wait for it
    if (!canvas) {
      console.warn('Canvas not ready, retrying...');
      setTimeout(() => {
        if (canvas) {
          handleImageUpload(event);
        } else {
          console.error('Canvas still not ready after timeout');
        }
      }, 100);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgSrc = e.target?.result as string;
      
      fabric.Image.fromURL(imgSrc, (img) => {
        // Remove previous uploaded image if exists
        if (uploadedImage) {
          canvas.remove(uploadedImage);
        }

        // Scale image to fit canvas
        scaleImageToFit(img, canvas.width!, canvas.height!);
        
        img.set({
          selectable: false,
          evented: false,
          name: 'uploadedImage',
        });

        canvas.add(img);
        canvas.sendToBack(img);
        setUploadedImage(img);
        setIsImageUploaded(true);
        
        // Add watermark after image is uploaded
        addWatermark();
        
        safeRenderAll(canvas);
      });
    };
    
    reader.readAsDataURL(file);
    
    // Reset the input value so the same file can be uploaded again
    event.target.value = '';
  };

  const addWatermark = () => {
    if (!canvas) return;

    fabric.Image.fromURL(pingIcon, (img) => {
      // Remove previous watermark if exists
      if (watermarkImage) {
        canvas.remove(watermarkImage);
      }

      img.set({
        left: canvas.width! * 0.8, // Position in bottom right
        top: canvas.height! * 0.8,
        originX: 'center',
        originY: 'center',
        scaleX: 0.3,
        scaleY: 0.3,
        opacity: watermarkOpacity,
        selectable: true,
        evented: true,
        name: 'watermark',
        cornerStyle: 'circle',
        cornerColor: '#10B981',
        cornerSize: 8,
        transparentCorners: false,
        borderColor: '#10B981',
        hasRotatingPoint: true
      });

      canvas.add(img);
      canvas.bringToFront(img);
      setWatermarkImage(img);
      safeRenderAll(canvas);
    });
  };

  const updateWatermarkOpacity = (opacity: number) => {
    setWatermarkOpacity(opacity);
    if (watermarkImage) {
      watermarkImage.set({ opacity });
      safeRenderAll(canvas!);
    }
  };

  const resetWatermarkPosition = () => {
    if (watermarkImage && canvas) {
      watermarkImage.set({
        left: canvas.width! * 0.8,
        top: canvas.height! * 0.8,
        angle: 0,
        scaleX: 0.3,
        scaleY: 0.3
      });
      safeRenderAll(canvas);
    }
  };

  const downloadImage = () => {
    if (!canvas || !isImageUploaded) return;
    
    setIsLoading(true);
    try {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2,
        backgroundColor: 'transparent'
      });

      const link = document.createElement('a');
      link.download = 'ping-watermarked-image.png';
      link.href = dataURL;
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!canvas || !isImageUploaded) return;
    
    setIsCopying(true);
    setIsLoading(true);
    try {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2,
        backgroundColor: 'transparent'
      });

      // Convert data URL to blob
      const response = await fetch(dataURL);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      
      // Keep the animation visible longer to show success
      setTimeout(() => setIsCopying(false), 1500);
    } catch (err) {
      console.error('Failed to copy image: ', err);
      setIsCopying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareOnX = () => {
    setIsSharing(true);
    
    try {
      const tweetText = "Just created my custom $PING watermark!\nCreate your own at:\n";
      const hashtags = "PING,Solana,Crypto,Watermark";
      const url = "https://pingonsol.com/watermark";
      
      // Construct the Twitter share URL
      const twitterUrl = new URL('https://twitter.com/intent/tweet');
      twitterUrl.searchParams.set('text', tweetText);
      twitterUrl.searchParams.set('hashtags', hashtags);
      twitterUrl.searchParams.set('url', url);
      
      // Open Twitter in a new window
      window.open(twitterUrl.toString(), '_blank');
      
      // Reset sharing state after a delay
      setTimeout(() => setIsSharing(false), 2000);
    } catch (error) {
      console.error('Error sharing on X:', error);
      setIsSharing(false);
    }
  };

  const triggerFileUpload = () => {
    if (!canvas) {
      console.warn('Canvas not ready for upload');
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-grow bg-gradient-to-br from-gray-50 to-gray-100 w-full min-h-0 flex flex-col lg:flex-row">
      {/* Left Sidebar - Controls */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full lg:w-80 flex-shrink-0 p-4 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white/50 backdrop-blur-sm"
      >
        <Card className="h-full overflow-hidden flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <img src={pingIcon} alt="PING" className="w-5 h-5" />
              </div>
              Watermark Tool
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 flex-1 overflow-y-auto">
            {/* Upload Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Upload Image</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                onClick={triggerFileUpload}
                variant="outline"
                className="w-full"
                disabled={!canvas}
              >
                <Upload size={16} className="mr-2" />
                {!canvas ? 'Loading...' : 'Choose Image'}
              </Button>
              {!isImageUploaded && (
                <p className="text-xs text-muted-foreground">
                  Upload an image to add a PING watermark
                </p>
              )}
            </div>

            {/* Watermark Controls */}
            {isImageUploaded && (
              <>
                <div className="space-y-3 pt-4 border-t">
                  <h3 className="text-sm font-semibold">Watermark Settings</h3>
                  
                  {/* Opacity Control */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium">
                      Opacity: {Math.round(watermarkOpacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={watermarkOpacity}
                      onChange={(e) => updateWatermarkOpacity(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="text-sm font-semibold">Actions</h3>
                  
                  <Button
                    onClick={resetWatermarkPosition}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <RotateCcw size={14} className="mr-2" />
                    Reset Position
                  </Button>

                  <Button
                    onClick={downloadImage}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700"
                  >
                    <Download size={16} className="mr-2" />
                    Download Image
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleCopy}
                      disabled={isLoading}
                      variant="outline"
                      size="sm"
                      className={`transition-all duration-300 ${
                        isCopying 
                          ? 'bg-green-600 hover:bg-green-600 text-white border-green-600' 
                          : ''
                      }`}
                    >
                      <motion.div
                        animate={isCopying ? {
                          scale: [1, 1.2, 1]
                        } : {}}
                        transition={{ 
                          duration: 0.3, 
                          ease: "easeInOut"
                        }}
                      >
                        {isCopying ? <Check size={14} /> : <Copy size={14} />}
                      </motion.div>
                      <span className="ml-1">{isCopying ? 'Copied!' : 'Copy'}</span>
                    </Button>

                    <Button
                      onClick={handleShareOnX}
                      disabled={isLoading || isSharing}
                      variant="outline"
                      size="sm"
                    >
                      <TwitterIcon size={14} />
                      <span className="ml-1">{isSharing ? "Sharing..." : "Tweet"}</span>
                    </Button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="text-sm font-semibold">Instructions</h3>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Drag the PING logo to reposition</p>
                    <p>• Use corner handles to resize</p>
                    <p>• Rotate using the top handle</p>
                    <p>• Adjust opacity with slider</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Center - Canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex-1 flex flex-col min-w-0"
      >
        <div className="flex justify-center items-center flex-1 overflow-hidden min-h-0 w-full h-full p-4 lg:p-8">
          {!isImageUploaded ? (
            /* Upload prompt when no image */
            <div className="text-center space-y-6 p-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Upload className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Upload an Image
                </h3>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  Choose an image from your device to add a PING watermark
                </p>
              </div>
              <Button
                onClick={triggerFileUpload}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700"
                disabled={!canvas}
              >
                <Upload size={20} className="mr-2" />
                {!canvas ? 'Loading Canvas...' : 'Choose Image'}
              </Button>
            </div>
          ) : (
            /* Canvas when image is uploaded */
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="block shadow-2xl"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
              
              {/* Loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center rounded-lg">
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Processing...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default WatermarkTool;