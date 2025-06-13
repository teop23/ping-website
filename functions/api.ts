export interface Env {
  // Define any environment variables you might need
}

interface TraitFile {
  id: string;
  name: string;
  uiName: string;
  category: string;
  imageSrc: string;
}

interface Trait {
  id: string;
  name: string;
  category: string;
  imageSrc: string;
}

// Available traits data - in a real implementation, this could come from a database or external API
const AVAILABLE_TRAITS: Record<string, string[]> = {
  aura: ['blue-aura', 'fire-aura', 'color-aura', 'yellow-aura', 'sunrise-aura'],
  head: ['cap', 'ping', 'crown', 'top-hat', 'cat-ears', 'sad-pepe', 'party-hat', 'cowboy-hat', 'winter-cap', 'devil-horns', 'backwards-cap'],
  face: ['monocle', 'ski-mask', 'eye-patch', 'star-eyes', 'pit-vipers', 'doom-helmet', 'cool-glasses', 'heart-glasses', 'shutter-shades'],
  mouth: ['beard', 'cigar'],
  body: ['cheese-tee', 'solana-tattoo', 'bitcoin-tattoo', 'pump-fun-tattoo'],
  right_hand: ['wand', 'ciggy', 'glock', 'pistol', 'monster', 'redbull', 'bitcoin', 'blue-sword', 'coffee-mug', 'devil-trident', 'green-candle-injection', 'infinity-gauntlet', 'money-stack', 'skull-dagger', 'solana-coin', 'white-monster'],
  left_hand: ['bong', 'redbull', 'money-bag', 'thor-hammer', 'green-candle-injection', 'pizza-slice', 'solana-coin'],
  accessory: ['lily', 'pet-ping-(left)', 'pet-ping-(right)', 'sad-pepe-(left)', 'sad-pepe-(right)', 'pet-cheese']
};

// Base64 encoded ping image (you would replace this with the actual base64 data)
const BASE_PING_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

const BASE_IMAGE_SCALE_MULTIPLIER = 1.4;

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS request for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Check if this is a request for available traits
    if (searchParams.get('list') === 'traits') {
      return new Response(JSON.stringify({
        success: true,
        message: 'Available traits listed successfully',
        availableTraits: AVAILABLE_TRAITS
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // Check if this is a documentation request
    const isDocsRequest = searchParams.get('docs') === 'true' || 
                         (!searchParams.toString() && url.search === '');

    if (isDocsRequest) {
      const docsHtml = generateDocsHTML();
      return new Response(docsHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          ...corsHeaders,
        },
      });
    }

    // Parse trait parameters from URL
    const selectedTraits: Record<string, string | null> = {
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
      if (traitName && AVAILABLE_TRAITS[category]?.includes(traitName)) {
        selectedTraits[category] = traitName;
      }
    }

    // Get optional parameters
    const format = searchParams.get('format') || 'png';
    const size = parseInt(searchParams.get('size') || '512');
    const quality = parseFloat(searchParams.get('quality') || '1');

    // Validate parameters
    if (!['png', 'jpg', 'jpeg', 'webp'].includes(format.toLowerCase())) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid format. Supported formats: png, jpg, jpeg, webp'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    if (size < 64 || size > 2048) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid size. Size must be between 64 and 2048 pixels'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    if (quality < 0.1 || quality > 1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid quality. Quality must be between 0.1 and 1'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // Generate the character image
    const imageBuffer = await generateCharacterImage(selectedTraits, size, format, quality);

    if (!imageBuffer) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to generate character image'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // Determine content type
    const mimeType = format.toLowerCase() === 'jpg' || format.toLowerCase() === 'jpeg' 
      ? 'image/jpeg' 
      : format.toLowerCase() === 'webp' 
      ? 'image/webp' 
      : 'image/png';

    // Return the image directly
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('Error in API function:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
};

async function generateCharacterImage(
  selectedTraits: Record<string, string | null>,
  size: number,
  format: string,
  quality: number
): Promise<ArrayBuffer | null> {
  try {
    // In a real implementation, you would use a server-side canvas library
    // like node-canvas or similar to generate the image
    
    // For this example, we'll create a simple placeholder image
    // In production, you would:
    // 1. Load the base ping image
    // 2. Load each selected trait image
    // 3. Composite them together using canvas
    // 4. Return the final image buffer
    
    // This is a simplified example that returns a basic image
    // You would replace this with actual image generation logic
    
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Fill with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    
    // Draw base character (placeholder)
    ctx.fillStyle = '#4F46E5';
    ctx.fillRect(size * 0.3, size * 0.3, size * 0.4, size * 0.4);
    
    // Add trait indicators (placeholder)
    let yOffset = size * 0.1;
    for (const [category, traitName] of Object.entries(selectedTraits)) {
      if (traitName) {
        ctx.fillStyle = '#000';
        ctx.font = `${size * 0.03}px Arial`;
        ctx.fillText(`${category}: ${traitName}`, size * 0.05, yOffset);
        yOffset += size * 0.05;
      }
    }
    
    // Convert to buffer
    const mimeType = format.toLowerCase() === 'jpg' || format.toLowerCase() === 'jpeg' 
      ? 'image/jpeg' 
      : format.toLowerCase() === 'webp' 
      ? 'image/webp' 
      : 'image/png';
    
    return canvas.toBuffer(mimeType, { quality });
    
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

// Mock canvas implementation for the example
// In a real implementation, you would use node-canvas or similar
function createCanvas(width: number, height: number) {
  return {
    getContext: () => ({
      fillStyle: '',
      font: '',
      fillRect: () => {},
      fillText: () => {},
    }),
    toBuffer: (mimeType: string, options?: any) => {
      // Return a minimal PNG buffer as placeholder
      return new ArrayBuffer(100);
    }
  };
}

function generateDocsHTML(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PING Character API Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #4F46E5;
            border-bottom: 3px solid #4F46E5;
            padding-bottom: 10px;
        }
        h2 {
            color: #6366F1;
            margin-top: 30px;
        }
        .alert {
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .alert-info {
            background-color: #EBF8FF;
            border: 1px solid #BEE3F8;
            color: #2B6CB0;
        }
        .alert-warning {
            background-color: #FFFBEB;
            border: 1px solid #FED7AA;
            color: #C05621;
        }
        code {
            background-color: #F7FAFC;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 0.9em;
        }
        .code-block {
            background-color: #2D3748;
            color: #E2E8F0;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            margin: 10px 0;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .trait-category {
            background-color: #F7FAFC;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #E2E8F0;
        }
        .trait-category h3 {
            margin-top: 0;
            color: #4A5568;
            text-transform: capitalize;
        }
        .trait-list {
            list-style: none;
            padding: 0;
            margin: 10px 0 0 0;
        }
        .trait-list li {
            background-color: white;
            padding: 5px 10px;
            margin: 3px 0;
            border-radius: 3px;
            font-family: monospace;
            font-size: 0.9em;
            border: 1px solid #E2E8F0;
        }
        .example-link {
            display: block;
            background-color: #F7FAFC;
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            text-decoration: none;
            color: #4F46E5;
            border: 1px solid #E2E8F0;
            transition: background-color 0.2s;
        }
        .example-link:hover {
            background-color: #EDF2F7;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #E2E8F0;
        }
        th {
            background-color: #F7FAFC;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎮 PING Character API</h1>
        
        <div class="alert alert-info">
            <strong>Welcome!</strong> Generate custom PING character images by adding parameters to the URL. 
            This API returns images directly - perfect for embedding in applications or direct linking.
        </div>

        <h2>🚀 Quick Start</h2>
        
        <h3>Generate Character Image (Returns image only)</h3>
        <div class="code-block">
/api?aura=blue-aura&head=cap&face=cool-glasses&size=512&format=png
        </div>

        <h3>List Available Traits (Returns JSON)</h3>
        <div class="code-block">
/api?list=traits
        </div>

        <h3>View Documentation</h3>
        <div class="code-block">
/api?docs=true
        </div>

        <h2>📋 Parameters</h2>
        
        <table>
            <thead>
                <tr>
                    <th>Parameter</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Default</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>aura</code></td>
                    <td>string</td>
                    <td>Character aura trait</td>
                    <td>none</td>
                </tr>
                <tr>
                    <td><code>head</code></td>
                    <td>string</td>
                    <td>Head accessory trait</td>
                    <td>none</td>
                </tr>
                <tr>
                    <td><code>face</code></td>
                    <td>string</td>
                    <td>Face accessory trait</td>
                    <td>none</td>
                </tr>
                <tr>
                    <td><code>mouth</code></td>
                    <td>string</td>
                    <td>Mouth accessory trait</td>
                    <td>none</td>
                </tr>
                <tr>
                    <td><code>body</code></td>
                    <td>string</td>
                    <td>Body trait</td>
                    <td>none</td>
                </tr>
                <tr>
                    <td><code>right_hand</code></td>
                    <td>string</td>
                    <td>Right hand item trait</td>
                    <td>none</td>
                </tr>
                <tr>
                    <td><code>left_hand</code></td>
                    <td>string</td>
                    <td>Left hand item trait</td>
                    <td>none</td>
                </tr>
                <tr>
                    <td><code>accessory</code></td>
                    <td>string</td>
                    <td>Additional accessory trait</td>
                    <td>none</td>
                </tr>
                <tr>
                    <td><code>size</code></td>
                    <td>number</td>
                    <td>Image size in pixels (64-2048)</td>
                    <td>512</td>
                </tr>
                <tr>
                    <td><code>format</code></td>
                    <td>string</td>
                    <td>Output format (png, jpg, jpeg, webp)</td>
                    <td>png</td>
                </tr>
                <tr>
                    <td><code>quality</code></td>
                    <td>number</td>
                    <td>Image quality (0.1-1)</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td><code>list</code></td>
                    <td>string</td>
                    <td>Set to "traits" to get available traits</td>
                    <td>none</td>
                </tr>
                <tr>
                    <td><code>docs</code></td>
                    <td>string</td>
                    <td>Set to "true" to view documentation</td>
                    <td>none</td>
                </tr>
            </tbody>
        </table>

        <h2>🎯 Example URLs</h2>
        
        <a href="/api?head=cap&face=cool-glasses&body=cheese-tee" class="example-link" target="_blank">
            <strong>Basic Character:</strong><br>
            /api?head=cap&face=cool-glasses&body=cheese-tee
        </a>
        
        <a href="/api?aura=fire-aura&head=crown&right_hand=glock&size=1024&format=jpg" class="example-link" target="_blank">
            <strong>High-res JPEG:</strong><br>
            /api?aura=fire-aura&head=crown&right_hand=glock&size=1024&format=jpg
        </a>
        
        <a href="/api?list=traits" class="example-link" target="_blank">
            <strong>Get Available Traits:</strong><br>
            /api?list=traits
        </a>

        <h2>🎨 Available Traits</h2>
        
        <div class="grid">
            ${Object.entries(AVAILABLE_TRAITS).map(([category, traits]) => `
                <div class="trait-category">
                    <h3>${category.replace('_', ' ')}</h3>
                    <ul class="trait-list">
                        ${traits.map(trait => `<li>${trait}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>

        <div class="alert alert-warning">
            <strong>Important Notes:</strong>
            <ul>
                <li>Image generation URLs return only the image file (no HTML wrapper)</li>
                <li>Perfect for embedding in other applications or direct linking</li>
                <li>Images are cached for 1 hour for better performance</li>
                <li>Use <code>?docs=true</code> to view this documentation page</li>
                <li>Use <code>?list=traits</code> to get available trait names in JSON format</li>
            </ul>
        </div>

        <h2>🔧 Integration Examples</h2>
        
        <h3>HTML Image Tag</h3>
        <div class="code-block">
&lt;img src="/api?head=cap&face=cool-glasses&size=256" alt="PING Character" /&gt;
        </div>

        <h3>JavaScript Fetch</h3>
        <div class="code-block">
const response = await fetch('/api?aura=fire-aura&head=crown&format=png');
const blob = await response.blob();
const imageUrl = URL.createObjectURL(blob);
        </div>

        <h3>Get Available Traits</h3>
        <div class="code-block">
const response = await fetch('/api?list=traits');
const data = await response.json();
console.log(data.availableTraits);
        </div>
    </div>
</body>
</html>
  `;
}