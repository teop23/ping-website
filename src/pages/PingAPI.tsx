import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import pingImage from '../assets/images/ping.png';
import { initializeTraits } from '../data/traits';
import { Trait } from '../types';
import { BASE_IMAGE_SCALE_MULTIPLIER } from '../utils/canvasUtils';

interface APIResponse {
  success: boolean;
  message?: string;
  imageUrl?: string;
  availableTraits?: Record<string, string[]>;
}

const PingAPI: React.FC = () => {
  const [searchParams] = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [response, setResponse] = useState<APIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [traits, setTraits] = useState<Trait[]>([]);
  const [showDocs, setShowDocs] = useState(false);

  // Check if this is a documentation request
  const isDocsRequest = searchParams.get('docs') === 'true' || 
                       (!searchParams.toString() && window.location.search === '');

  // Load available traits
  useEffect(() => {
    const loadTraits = async () => {
      try {
        const { traits: loadedTraits } = await initializeTraits();
        setTraits(loadedTraits);
      } catch (error) {
        console.error('Error loading traits:', error);
        setResponse({
          success: false,
          message: 'Failed to load available traits'
        });
        setIsLoading(false);
      }
    };
    
    loadTraits();
  }, []);

  // Generate character image based on URL parameters
  useEffect(() => {
    if (traits.length === 0) return;

    const generateImage = async () => {
      setIsLoading(true);

      try {
        // Check if this is a request for available traits
        if (searchParams.get('list') === 'traits') {
          const availableTraits: Record<string, string[]> = {};
          traits.forEach(trait => {
            if (!availableTraits[trait.category]) {
              availableTraits[trait.category] = [];
            }
            availableTraits[trait.category].push(trait.name);
          });

          setResponse({
            success: true,
            message: 'Available traits listed successfully',
            availableTraits
          });
          setIsLoading(false);
          return;
        }

        // If this is a docs request, don't generate image
        if (isDocsRequest) {
          setShowDocs(true);
          setIsLoading(false);
          return;
        }

        // Parse trait parameters from URL
        const selectedTraits: Record<string, Trait | null> = {
          aura: null,
          head: null,
          face: null,
          mouth: null,
          body: null,
          right_hand: null,
          left_hand: null,
          accessory: null
        };

        // Get traits from URL parameters
        for (const category of Object.keys(selectedTraits)) {
          const traitName = searchParams.get(category);
          if (traitName) {
            const trait = traits.find(t => 
              t.category === category && 
              (t.name === traitName || t.name.toLowerCase().replace(/-/g, ' ') === traitName.toLowerCase().replace(/-/g, ' '))
            );
            if (trait) {
              selectedTraits[category] = trait;
            }
          }
        }

        // Get optional parameters
        const format = searchParams.get('format') || 'png';
        const size = parseInt(searchParams.get('size') || '512');
        const quality = parseFloat(searchParams.get('quality') || '1');

        // Validate parameters
        if (!['png', 'jpg', 'jpeg', 'webp'].includes(format.toLowerCase())) {
          setResponse({
            success: false,
            message: 'Invalid format. Supported formats: png, jpg, jpeg, webp'
          });
          setIsLoading(false);
          return;
        }

        if (size < 64 || size > 2048) {
          setResponse({
            success: false,
            message: 'Invalid size. Size must be between 64 and 2048 pixels'
          });
          setIsLoading(false);
          return;
        }

        if (quality < 0.1 || quality > 1) {
          setResponse({
            success: false,
            message: 'Invalid quality. Quality must be between 0.1 and 1'
          });
          setIsLoading(false);
          return;
        }

        // Generate the image
        await renderCharacterImage(selectedTraits, size, format, quality);

      } catch (error) {
        console.error('Error generating image:', error);
        setResponse({
          success: false,
          message: 'Failed to generate character image'
        });
        setIsLoading(false);
      }
    };

    generateImage();
  }, [searchParams, traits, isDocsRequest]);

  const renderCharacterImage = async (
    selectedTraits: Record<string, Trait | null>,
    size: number,
    format: string,
    quality: number
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    // Clear canvas with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);

    try {
      // Load and draw base image
      const baseImg = await loadImage(pingImage);
      
      // Calculate scale to fit base image
      const scale = Math.min(canvas.width / baseImg.width, canvas.height / baseImg.height) * BASE_IMAGE_SCALE_MULTIPLIER;
      const scaledWidth = baseImg.width * scale;
      const scaledHeight = baseImg.height * scale;
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;

      // Draw base image
      ctx.drawImage(baseImg, x, y, scaledWidth, scaledHeight);

      // Draw traits in the correct order
      const traitOrder = ['aura', 'body', 'face', 'mouth', 'head', 'right_hand', 'left_hand', 'accessory'];
      
      for (const category of traitOrder) {
        const trait = selectedTraits[category];
        if (trait) {
          try {
            const traitImg = await loadImage(trait.imageSrc);
            
            // Scale trait image to match canvas dimensions
            ctx.drawImage(
              traitImg,
              0, 0, // Source position
              canvas.width, canvas.height // Destination size (full canvas)
            );
          } catch (error) {
            console.warn(`Failed to load trait image for ${trait.name}:`, error);
          }
        }
      }

      // Convert to data URL
      const mimeType = format.toLowerCase() === 'jpg' || format.toLowerCase() === 'jpeg' 
        ? 'image/jpeg' 
        : format.toLowerCase() === 'webp' 
        ? 'image/webp' 
        : 'image/png';

      const imageUrl = canvas.toDataURL(mimeType, quality);

      setResponse({
        success: true,
        message: 'Character image generated successfully',
        imageUrl
      });

    } catch (error) {
      console.error('Error rendering character:', error);
      setResponse({
        success: false,
        message: 'Failed to render character image'
      });
    }

    setIsLoading(false);
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // If this is an image generation request and we have a successful response with imageUrl
  if (!isDocsRequest && !isLoading && response?.success && response.imageUrl) {
    // Create a blob from the data URL and trigger download/display
    const dataUrl = response.imageUrl;
    const format = searchParams.get('format') || 'png';
    
    // Convert data URL to blob
    const byteCharacters = atob(dataUrl.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const mimeType = format.toLowerCase() === 'jpg' || format.toLowerCase() === 'jpeg' 
      ? 'image/jpeg' 
      : format.toLowerCase() === 'webp' 
      ? 'image/webp' 
      : 'image/png';
    
    const blob = new Blob([byteArray], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    
    // Redirect to the blob URL to display only the image
    window.location.href = blobUrl;
    
    return null;
  }

  // Show loading state for image generation
  if (!isDocsRequest && isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Generating PING character...</p>
        </div>
      </div>
    );
  }

  // Show error for image generation
  if (!isDocsRequest && response && !response.success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
            <p className="text-red-800 font-medium">✗ {response.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show documentation interface
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">PING Character API</h1>
          
          {response?.success && response.availableTraits ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">✓ {response.message}</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Available Traits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(response.availableTraits).map(([category, traitNames]) => (
                    <div key={category} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2 capitalize">
                        {category.replace('_', ' ')}
                      </h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {traitNames.map(name => (
                          <li key={name} className="font-mono">
                            {name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">
                  Welcome to the PING Character API! Generate custom character images by adding parameters to the URL.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-medium mb-2">Generate Character Image (Returns image only)</h3>
                    <code className="bg-gray-200 px-2 py-1 rounded text-xs block">
                      /api?aura=blue-aura&head=cap&face=cool-glasses&size=512&format=png
                    </code>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">List Available Traits (Returns JSON)</h3>
                    <code className="bg-gray-200 px-2 py-1 rounded text-xs block">
                      /api?list=traits
                    </code>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">View Documentation</h3>
                    <code className="bg-gray-200 px-2 py-1 rounded text-xs block">
                      /api?docs=true
                    </code>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Parameters</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li><strong>Trait Categories:</strong> aura, head, face, mouth, body, right_hand, left_hand, accessory</li>
                      <li><strong>size:</strong> Image size in pixels (64-2048, default: 512)</li>
                      <li><strong>format:</strong> Output format (png, jpg, jpeg, webp, default: png)</li>
                      <li><strong>quality:</strong> Image quality (0.1-1, default: 1)</li>
                      <li><strong>list:</strong> Set to "traits" to get available traits</li>
                      <li><strong>docs:</strong> Set to "true" to view this documentation</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Example URLs</h3>
                    <div className="space-y-2 font-mono text-xs">
                      <div className="bg-gray-200 p-2 rounded">
                        <a href="/api?head=cap&face=cool-glasses&body=cheese-tee" target="_blank" className="text-blue-600 hover:underline">
                          /api?head=cap&face=cool-glasses&body=cheese-tee
                        </a>
                      </div>
                      <div className="bg-gray-200 p-2 rounded">
                        <a href="/api?aura=fire-aura&head=crown&right_hand=glock&size=1024&format=jpg" target="_blank" className="text-blue-600 hover:underline">
                          /api?aura=fire-aura&head=crown&right_hand=glock&size=1024&format=jpg
                        </a>
                      </div>
                      <div className="bg-gray-200 p-2 rounded">
                        <a href="/api?list=traits" target="_blank" className="text-blue-600 hover:underline">
                          /api?list=traits
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <h3 className="font-medium text-yellow-800 mb-2">Important Notes</h3>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• Image generation URLs return only the image file (no HTML wrapper)</li>
                      <li>• Perfect for embedding in other applications or direct linking</li>
                      <li>• Use ?docs=true to view this documentation page</li>
                      <li>• Use ?list=traits to get available trait names in JSON format</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden canvas for image generation */}
      <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default PingAPI;