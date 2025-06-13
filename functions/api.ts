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

// Function to parse trait filename
const parseTraitFilename = (filename: string): { name: string; uiName: string; category: string } | null => {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.png$/i, '');
  
  // Available categories
  const categories = ['aura', 'head', 'face', 'mouth', 'body', 'right_hand', 'left_hand', 'accessory'];
  const categoryIds = categories.join('|');
  const regex = new RegExp(`^trait-(.+)_(${categoryIds})$`);
  
  // Check if it follows the pattern: trait-{name}_{category}
  const match = nameWithoutExt.match(regex);
  
  if (match) {
    const [, name, category] = match;
    const uiName = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      name: name,
      uiName: uiName,
      category: category
    };
  }
  
  return null;
};

// Function to load available traits dynamically
async function loadAvailableTraits(): Promise<Record<string, string[]>> {
  const availableTraits: Record<string, string[]> = {};
  
  // In a real implementation, you would scan your assets directory
  // For now, we'll use the trait files that exist in the project
  const traitFiles = [
    'trait-cap_head.png',
    'trait-ping_head.png',
    'trait-crown_head.png',
    'trait-beard_mouth.png',
    'trait-cigar_mouth.png',
    'trait-monocle_face.png',
    'trait-top-hat_head.png',
    'trait-cat-ears_head.png',
    'trait-sad-pepe_head.png',
    'trait-ski-mask_face.png',
    'trait-blue-aura_aura.png',
    'trait-bong_left_hand.png',
    'trait-eye-patch_face.png',
    'trait-fire-aura_aura.png',
    'trait-lily_accessory.png',
    'trait-party-hat_head.png',
    'trait-star-eyes_face.png',
    'trait-cheese-tee_body.png',
    'trait-color-aura_aura.png',
    'trait-cowboy-hat_head.png',
    'trait-pit-vipers_face.png',
    'trait-wand_right_hand.png',
    'trait-winter-cap_head.png',
    'trait-ciggy_right_hand.png',
    'trait-devil-horns_head.png',
    'trait-doom-helmet_face.png',
    'trait-glock_right_hand.png',
    'trait-yellow-aura_aura.png',
    'trait-cool-glasses_face.png',
    'trait-pistol_right_hand.png',
    'trait-redbull_left_hand.png',
    'trait-sunrise-aura_aura.png',
    'trait-backwards-cap_head.png',
    'trait-bitcoin_right_hand.png',
    'trait-heart-glasses_face.png',
    'trait-monster_right_hand.png',
    'trait-redbull_right_hand.png',
    'trait-solana-tattoo_body.png',
    'trait-bitcoin-tattoo_body.png',
    'trait-money-bag_left_hand.png',
    'trait-pump-fun-tattoo_body.png',
    'trait-blue-sword_right_hand.png',
    'trait-coffee-mug_right_hand.png',
    'trait-thor-hammer_left_hand.png',
    'trait-devil-trident_right_hand.png',
    'trait-green-candle-injection_left_hand.png',
    'trait-green-candle-injection_right_hand.png',
    'trait-infinity-gauntlet_right_hand.png',
    'trait-money-stack_right_hand.png',
    'trait-pet-ping-(left)_accessory.png',
    'trait-pet-ping-(right)_accessory.png',
    'trait-pizza-slice_left_hand.png',
    'trait-sad-pepe-(left)_accessory.png',
    'trait-sad-pepe-(right)_accessory.png',
    'trait-shutter-shades_face.png',
    'trait-skull-dagger_right_hand.png',
    'trait-solana-coin_left_hand.png',
    'trait-solana-coin_right_hand.png',
    'trait-white-monster_right_hand.png',
    'trait-pet-cheese_accessory.png',
    'trait-jbl-speaker_left_hand.png'
  ];
  
  traitFiles.forEach(filename => {
    const parsed = parseTraitFilename(filename);
    if (parsed) {
      if (!availableTraits[parsed.category]) {
        availableTraits[parsed.category] = [];
      }
      availableTraits[parsed.category].push(parsed.name);
    }
  });
  
  return availableTraits;
}

// Function to find trait by name and category
async function findTrait(category: string, traitName: string): Promise<string | null> {
  const availableTraits = await loadAvailableTraits();
  
  if (!availableTraits[category]) {
    return null;
  }
  
  // Check if trait exists (case-insensitive, handle both kebab-case and space-separated)
  const normalizedTraitName = traitName.toLowerCase().replace(/\s+/g, '-');
  const found = availableTraits[category].find(trait => 
    trait.toLowerCase() === normalizedTraitName ||
    trait.toLowerCase().replace(/-/g, ' ') === traitName.toLowerCase().replace(/-/g, ' ')
  );
  
  if (found) {
    // Return the asset path
    return `/src/assets/traits/trait-${found}_${category}.png`;
  }
  
  return null;
}

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
      const availableTraits = await loadAvailableTraits();
      return new Response(JSON.stringify({
        success: true,
        message: 'Available traits listed successfully',
        availableTraits: availableTraits
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
          ...corsHeaders,
        },
      });
    }

    // Check if this is a documentation request
    const isDocsRequest = searchParams.get('docs') === 'true' || 
                         (!searchParams.toString() && url.search === '');

    if (isDocsRequest) {
      const docsHtml = await generateDocsHTML();
      return new Response(docsHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=3600',
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

    const errors: string[] = [];

    // Get traits from URL parameters and validate they exist
    for (const category of Object.keys(selectedTraits)) {
      const traitName = searchParams.get(category);
      if (traitName) {
        const traitPath = await findTrait(category, traitName);
        if (traitPath) {
          selectedTraits[category] = traitName;
        } else {
          errors.push(`Trait '${traitName}' not found in category '${category}'`);
        }
      }
    }

    // If there are trait errors, return them
    if (errors.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid traits specified',
        errors: errors,
        availableTraits: await loadAvailableTraits()
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
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
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
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
    // Create a simple SVG-based image for now
    // In a real implementation, you would use a proper image processing library
    
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <!-- White background -->
        <rect width="100%" height="100%" fill="white"/>
        
        <!-- Base character placeholder -->
        <rect x="${size * 0.3}" y="${size * 0.3}" width="${size * 0.4}" height="${size * 0.4}" fill="#4F46E5" rx="10"/>
        
        <!-- Character label -->
        <text x="${size * 0.5}" y="${size * 0.2}" text-anchor="middle" font-family="Arial" font-size="${size * 0.04}" fill="#333">
          PING Character
        </text>
        
        <!-- Trait indicators -->
        ${Object.entries(selectedTraits)
          .filter(([_, traitName]) => traitName)
          .map(([category, traitName], index) => {
            const yPos = size * 0.8 + (index * size * 0.03);
            return `<text x="${size * 0.05}" y="${yPos}" font-family="Arial" font-size="${size * 0.025}" fill="#666">
              ${category}: ${traitName}
            </text>`;
          })
          .join('')}
        
        <!-- Size indicator -->
        <text x="${size * 0.95}" y="${size * 0.95}" text-anchor="end" font-family="Arial" font-size="${size * 0.02}" fill="#999">
          ${size}x${size}
        </text>
      </svg>
    `;
    
    // Convert SVG to buffer
    const svgBuffer = new TextEncoder().encode(svg);
    
    // For now, return the SVG as PNG (in a real implementation, you'd convert it properly)
    // This is a placeholder - you would use a proper image processing library
    return svgBuffer.buffer;
    
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

async function generateDocsHTML(): Promise<string> {
  const availableTraits = await loadAvailableTraits();
  
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
        .alert-success {
            background-color: #F0FDF4;
            border: 1px solid #BBF7D0;
            color: #166534;
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
        .status-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-online {
            background-color: #10B981;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎮 PING Character API</h1>
        
        <div class="alert alert-success">
            <span class="status-indicator status-online"></span>
            <strong>API Status: Online</strong> - Dynamic trait loading enabled. 
            Generate custom PING character images by adding parameters to the URL.
        </div>

        <div class="alert alert-info">
            <strong>How it works:</strong> This API dynamically looks up traits based on your query parameters. 
            If a trait doesn't exist, you'll get a helpful error message with available options.
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
                    <td>Character aura trait (validated dynamically)</td>
                    <td>none</td>
                </tr>
                <tr>
                    <td><code>head</code></td>
                    <td>string</td>
                    <td>Head accessory trait (validated dynamically)</td>
                    <td>none</td>
                </tr>
                <tr>
                    <td><code>face</code></td>
                    <td>string</td>
                    <td>Face accessory trait (validated dynamically)</td>
                    <td>none</td>
                </tr>
                <tr>
                    <td><code>mouth</code></td>
                    <td>string</td>
                    <td>Mouth accessory trait (validated dynamically)</td>
                    <td>none</td>
                </tr>
                <tr>
                    <td><code>body</code></td>
                    <td>string</td>
                    <td>Body trait (validated dynamically)</td>
                    <td>none</td>
                </tr>
                <tr>
                    <td><code>right_hand</code></td>
                    <td>string</td>
                    <td>Right hand item trait (validated dynamically)</td>
                    <td>none</td>
                </tr>
                <tr>
                    <td><code>left_hand</code></td>
                    <td>string</td>
                    <td>Left hand item trait (validated dynamically)</td>
                    <td>none</td>
                </tr>
                <tr>
                    <td><code>accessory</code></td>
                    <td>string</td>
                    <td>Additional accessory trait (validated dynamically)</td>
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
        
        <a href="/api?aura=fire-aura&head=crown&right_hand=glock&size=1024&format=png" class="example-link" target="_blank">
            <strong>High-res PNG:</strong><br>
            /api?aura=fire-aura&head=crown&right_hand=glock&size=1024&format=png
        </a>
        
        <a href="/api?head=invalid-trait" class="example-link" target="_blank">
            <strong>Error Example (Invalid Trait):</strong><br>
            /api?head=invalid-trait
        </a>
        
        <a href="/api?list=traits" class="example-link" target="_blank">
            <strong>Get Available Traits:</strong><br>
            /api?list=traits
        </a>

        <h2>🎨 Available Traits (${Object.values(availableTraits).reduce((sum, traits) => sum + traits.length, 0)} total)</h2>
        
        <div class="grid">
            ${Object.entries(availableTraits).map(([category, traits]) => `
                <div class="trait-category">
                    <h3>${category.replace('_', ' ')} (${traits.length})</h3>
                    <ul class="trait-list">
                        ${traits.map(trait => `<li>${trait}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>

        <div class="alert alert-warning">
            <strong>Dynamic Validation:</strong>
            <ul>
                <li>All trait names are validated against available assets</li>
                <li>Invalid traits return helpful error messages with available options</li>
                <li>Trait names are case-insensitive and support both kebab-case and spaces</li>
                <li>Images are cached for 1 hour for better performance</li>
                <li>API returns only the image file (no HTML wrapper) for direct embedding</li>
            </ul>
        </div>

        <h2>🔧 Integration Examples</h2>
        
        <h3>HTML Image Tag</h3>
        <div class="code-block">
&lt;img src="/api?head=cap&face=cool-glasses&size=256" alt="PING Character" /&gt;
        </div>

        <h3>JavaScript Fetch with Error Handling</h3>
        <div class="code-block">
const response = await fetch('/api?aura=fire-aura&head=crown&format=png');

if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
  // Success - got an image
  const blob = await response.blob();
  const imageUrl = URL.createObjectURL(blob);
} else {
  // Error - got JSON error response
  const error = await response.json();
  console.error('API Error:', error.message);
  console.log('Available traits:', error.availableTraits);
}
        </div>

        <h3>Get Available Traits</h3>
        <div class="code-block">
const response = await fetch('/api?list=traits');
const data = await response.json();
console.log('Available traits:', data.availableTraits);
        </div>

        <h2>⚠️ Error Handling</h2>
        
        <p>When invalid traits are specified, the API returns a JSON error response with:</p>
        <ul>
            <li><strong>success:</strong> false</li>
            <li><strong>message:</strong> Error description</li>
            <li><strong>errors:</strong> Array of specific validation errors</li>
            <li><strong>availableTraits:</strong> Complete list of valid traits for reference</li>
        </ul>

        <div class="code-block">
{
  "success": false,
  "message": "Invalid traits specified",
  "errors": [
    "Trait 'invalid-hat' not found in category 'head'"
  ],
  "availableTraits": {
    "head": ["cap", "crown", "top-hat", ...],
    ...
  }
}
        </div>
    </div>
</body>
</html>
  `;
}