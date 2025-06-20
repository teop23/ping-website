import { fabric } from 'fabric';
import { motion } from 'framer-motion';
import { Check, Copy, Download, RotateCcw, Upload } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import pingIcon from '../assets/ping_transparent_icon.png';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { calculateCanvasSize, safeRenderAll } from '../utils/canvasUtils';

const WatermarkTool: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [uploadedImage, setUploadedImage] = useState<fabric.Image | null>(null);
  const [watermarkImage, setWatermarkImage] = useState<fabric.Image | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [watermarkOpacity, setWatermarkOpacity] = useState(1);
  const [isCopying, setIsCopying] = useState(false);
  //const [isSharing, setIsSharing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const size = Math.floor(Math.min(width, height) * 0.8); 
      setContainerSize(size);
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current ) return;
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: containerSize,
      height: containerSize,
      backgroundColor: '#f8f9fa',
      selection: true
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, [containerSize]);

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

    const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight) * 1; // 90% of canvas size

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
    if (!file || !canvas) return;

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
        left: canvas.width! * 0.5, // Position in bottom right
        top: canvas.height! * 0.5,
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

  // const resetWatermarkPosition = () => {
  //   if (watermarkImage && canvas) {
  //     watermarkImage.set({
  //       left: canvas.width! * 0.5,
  //       top: canvas.height! * 0.5,
  //       angle: 0,
  //       scaleX: 0.3,
  //       scaleY: 0.3
  //     });
  //     safeRenderAll(canvas);
  //   }
  // };

  const downloadImage = () => {
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });

    const link = document.createElement('a');
    link.download = 'ping-watermarked-image.png';
    link.href = dataURL;
    link.click();
  };

  // const handleShareOnX = () => {
  //   setIsSharing(true);
  //   try {
  //     const tweetText = "Just created my custom $PING watermark!\nCreate your own at:\n";
  //     const hashtags = "PING,Solana,Crypto,Watermark";
  //     const url = "https://pingonsol.com/watermark";

  //     // Construct the Twitter share URL
  //     const twitterUrl = new URL('https://twitter.com/intent/tweet');
  //     twitterUrl.searchParams.set('text', tweetText);
  //     twitterUrl.searchParams.set('hashtags', hashtags);
  //     twitterUrl.searchParams.set('url', url);

  //     // Open Twitter in a new window
  //     window.open(twitterUrl.toString(), '_blank');

  //     // Reset sharing state after a delay
  //     setTimeout(() => setIsSharing(false), 500);
  //   } catch (error) {
  //     console.error('Error sharing on X:', error);
  //     setIsSharing(false);
  //   }
  // };

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

  const triggerFileUpload = () => {
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
              >
                <Upload size={16} className="mr-2" />
                Choose Image
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
                      min="0"
                      max="1"
                      step="0.01"
                      value={watermarkOpacity}
                      onChange={(e) => updateWatermarkOpacity(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="text-sm font-semibold">Actions</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      onClick={handleCopy}
                      disabled={isLoading}
                      variant="outline"
                      size="sm"
                      className={`transition-all duration-300 ${isCopying
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

                    {/* <Button
                      onClick={handleShareOnX}
                      disabled={isLoading || isSharing}
                      variant="outline"
                      size="sm"
                    >
                      <TwitterIcon size={14} />
                      <span className="ml-1">{isSharing ? "Sharing..." : "Tweet"}</span>
                    </Button> */}
                  </div>
                  <Button
                    onClick={downloadImage}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700"
                  >
                    <Download size={16} className="mr-2" />
                    Download Image
                  </Button>
                  <Button
                    onClick={addWatermark}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <RotateCcw size={14} className="mr-2" />
                    Reset Position
                  </Button>
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
        <div
          className="flex justify-center items-center flex-1 overflow-hidden min-h-0 w-full h-full p-4 lg:p-8"
          ref={containerRef}
        >
          <div
            className="relative"
            style={{ width: containerSize, height: containerSize }}
          >
            {/* Canvas Container */}
            <div className="relative size-full bg-white rounded-lg shadow-xl border-2 border-gray-200 overflow-hidden flex flex-row justify-center">
              <canvas
                ref={canvasRef}
                className="block w-full h-full"
              />

              {/* Overlay instructions when no image is uploaded */}
              {!isImageUploaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/90 backdrop-blur-sm">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Upload an Image
                      </h3>
                      <p className="text-sm text-gray-600 max-w-xs">
                        Choose an image from your device to add a PING watermark
                      </p>
                    </div>
                    <Button
                      onClick={triggerFileUpload}
                      className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700"
                    >
                      <Upload size={16} className="mr-2" />
                      Choose Image
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WatermarkTool;