import { fabric } from 'fabric';
import { motion } from 'framer-motion';
import { Check, Copy, Download, RotateCcw, Upload } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import pingIcon from '../assets/ping_transparent_icon.png';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { safeRenderAll } from '../utils/canvasUtils';
import { exportSize, fitToAspect, insetBy } from '../utils/canvasFit';

const WatermarkTool: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerBox, setContainerBox] = useState({ width: 0, height: 0 });
  const [imageAspect, setImageAspect] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [uploadedImage, setUploadedImage] = useState<fabric.Image | null>(null);
  const [watermarkImage, setWatermarkImage] = useState<fabric.Image | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [watermarkOpacity, setWatermarkOpacity] = useState(1);
  const [isCopying, setIsCopying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setContainerBox({ width, height });
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // The canvas takes the uploaded image's aspect ratio and is fitted inside
  // whatever space the container gives it. A fixed square canvas letterboxed
  // every non-square upload and baked the bars into the exported file.
  const canvasSize = useMemo(
    () => fitToAspect(insetBy(containerBox, 32), imageAspect),
    [containerBox, imageAspect]
  );

  // Canvas aspect matches the image aspect, so one scale factor fills it exactly.
  const fillCanvas = useCallback((img: fabric.Image, size: { width: number; height: number }) => {
    const { width: naturalWidth, height: naturalHeight } = img.getOriginalSize();
    const scale = Math.max(size.width / naturalWidth, size.height / naturalHeight);

    img.set({
      scaleX: scale,
      scaleY: scale,
      left: size.width / 2,
      top: size.height / 2,
      originX: 'center',
      originY: 'center',
    });
    img.setCoords();
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      // Transparent, so a PNG export carries no invented background.
      backgroundColor: undefined,
      selection: true,
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Resize in place rather than rebuilding, and carry the artwork with it.
  useEffect(() => {
    if (!canvas || canvasSize.width === 0) return;

    const previousWidth = canvas.getWidth();
    const previousHeight = canvas.getHeight();

    canvas.setDimensions({ width: canvasSize.width, height: canvasSize.height });

    if (uploadedImage) fillCanvas(uploadedImage, canvasSize);

    // Keep the watermark where the user put it, proportionally.
    if (watermarkImage && previousWidth > 0 && previousHeight > 0) {
      const scaleX = canvasSize.width / previousWidth;
      const scaleY = canvasSize.height / previousHeight;

      watermarkImage.set({
        left: (watermarkImage.left ?? 0) * scaleX,
        top: (watermarkImage.top ?? 0) * scaleY,
        scaleX: (watermarkImage.scaleX ?? 1) * scaleX,
        scaleY: (watermarkImage.scaleY ?? 1) * scaleY,
      });
      watermarkImage.setCoords();
    }

    safeRenderAll(canvas);
  }, [canvas, canvasSize, uploadedImage, watermarkImage, fillCanvas]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !canvas) return;

    const rejectFile = () =>
      setError(`Couldn't open "${file.name}". Choose a PNG, JPG, WebP or GIF image.`);

    // A non-image used to collapse the canvas to 0x0 and wipe the current image.
    if (!file.type.startsWith('image/')) {
      rejectFile();
      return;
    }

    const reader = new FileReader();
    reader.onerror = rejectFile;
    reader.onload = (e) => {
      const imgSrc = e.target?.result as string;

      fabric.Image.fromURL(imgSrc, (img) => {
        // Undecodable (e.g. HEIC in Chrome): fabric hands back an image with no
        // element. Keep whatever is already on the canvas.
        const { width: naturalWidth, height: naturalHeight } = img.getElement()
          ? img.getOriginalSize()
          : { width: 0, height: 0 };

        if (!naturalWidth || !naturalHeight) {
          rejectFile();
          return;
        }
        setError(null);

        if (uploadedImage) {
          canvas.remove(uploadedImage);
        }

        const aspect = naturalWidth / naturalHeight;
        setImageAspect(aspect);

        // Fill against the size the canvas is about to become, so the first
        // paint is already correct rather than briefly letterboxed.
        const nextSize = fitToAspect(insetBy(containerBox, 32), aspect);

        canvas.setDimensions(nextSize);
        fillCanvas(img, nextSize);

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

  // Export at the uploaded image's own resolution, not the on-screen canvas size.
  const exportDataURL = () => {
    if (!canvas || !uploadedImage) return null;

    const out = exportSize(uploadedImage.getOriginalSize());
    const multiplier = out.width / canvas.getWidth();

    // fabric truncates the scaled size, so crop a hair over the target to land on it.
    return canvas.toDataURL({
      format: 'png',
      multiplier,
      left: 0,
      top: 0,
      width: (out.width + 0.25) / multiplier,
      height: (out.height + 0.25) / multiplier,
    });
  };

  const downloadImage = () => {
    const dataURL = exportDataURL();
    if (!dataURL) return;

    const link = document.createElement('a');
    link.download = 'ping-watermarked-image.png';
    link.href = dataURL;
    link.click();
  };

  const handleCopy = async () => {
    if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) {
      setError("This browser can't copy images. Use Download Image instead.");
      return;
    }

    const dataURL = exportDataURL();
    if (!dataURL) return;

    setError(null);
    setIsLoading(true);
    try {
      // Hand over a promise so Safari still sees the click as the user gesture.
      const blob = fetch(dataURL).then((response) => response.blob());
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);

      // Only show "Copied!" once the clipboard actually has the image.
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 1500);
    } catch (err) {
      console.error('Failed to copy image: ', err);
      setError("Couldn't copy the image. Use Download Image instead.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-[calc(100vh-56px)] flex-grow bg-transparent w-full min-h-0 flex flex-col lg:flex-row">
      {/* Left Sidebar - Controls */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full lg:w-80 flex-shrink-0 p-4 border-b lg:border-b-0 lg:border-r border-hairline bg-raised/80 backdrop-blur-sm"
      >
        <Card className="h-full overflow-hidden flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lead">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <img src={pingIcon} alt="PING" className="w-5 h-5" />
              </div>
              Watermark Tool
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 flex-1 overflow-y-auto">
            {/* Upload Section */}
            <div className="space-y-2">
              <h3 className="text-meta font-semibold">Upload Image</h3>
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
              {error && (
                <p role="alert" className="text-micro text-destructive">
                  {error}
                </p>
              )}
              {!isImageUploaded && (
                <p className="text-micro text-muted-foreground">
                  Upload an image to add a PING watermark
                </p>
              )}
            </div>

            {/* Watermark Controls */}
            {isImageUploaded && (
              <>
                <div className="space-y-3 pt-4 border-t">
                  <h3 className="text-meta font-semibold">Watermark Settings</h3>

                  {/* Opacity Control */}
                  <div className="space-y-2">
                    <label className="text-micro font-medium">
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
                  <h3 className="text-meta font-semibold">Actions</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      onClick={handleCopy}
                      disabled={isLoading}
                      variant="outline"
                      size="sm"
                      className={`transition-all duration-300 ${isCopying
                        ? 'border-positive bg-positive text-ink-inverse hover:bg-positive'
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

                  </div>
                  <Button
                    onClick={downloadImage}
                    disabled={isLoading}
                    className="w-full bg-brand hover:bg-brand-hover"
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
                  <h3 className="text-meta font-semibold">Instructions</h3>
                  <div className="text-micro text-muted-foreground space-y-1">
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
            style={{ width: canvasSize.width, height: canvasSize.height }}
          >
            {/* The frame tracks the canvas, which tracks the image's aspect. */}
            <div className="relative size-full overflow-hidden rounded-md border border-hairline bg-artboard">
              <canvas
                ref={canvasRef}
                className="block w-full h-full"
              />

              {/* Overlay instructions when no image is uploaded */}
              {!isImageUploaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-panel/90 backdrop-blur-sm">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-16 h-16 mx-auto bg-brand rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-ink-inverse" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lead font-semibold text-ink">
                        Upload an Image
                      </h3>
                      <p className="max-w-xs text-meta text-ink-muted">
                        Choose an image from your device to add a PING watermark
                      </p>
                    </div>
                    <Button
                      onClick={triggerFileUpload}
                      className="bg-brand hover:bg-brand-hover"
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