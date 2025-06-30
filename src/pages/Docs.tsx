import { motion } from 'framer-motion';
import { Code, Globe, Image, Share2, Shirt, Users } from 'lucide-react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const Docs: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 w-full min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              API Documentation
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Generate custom PING characters and social media previews programmatically
          </p>
        </motion.div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Base URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock>https://pingonsol.com</CodeBlock>
              <p className="text-sm text-muted-foreground mt-2">
                All API endpoints are relative to this base URL. No authentication required.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Endpoints */}
        <div className="space-y-8">
          {/* Get Available Traits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <EndpointCard
              icon={<Users className="w-5 h-5" />}
              title="Get Available Traits"
              endpoint="GET /traits-index.json"
              description="Retrieve all available categories and traits for character customization."
              example="https://pingonsol.com/traits-index.json"
              responseExample={`{
  "head": ["cap", "backwards-cap", "cowboy-hat", "crown"],
  "face": ["pit-vipers", "cool-glasses", "heart-glasses"],
  "body": ["ping-tee", "dress", "blank-tee"],
  "aura": ["blue-aura", "fire-aura", "fart-aura"],
  "mouth": ["cigar", "joint", "beard"],
  "right_hand": ["wand", "pistol", "bitcoin"],
  "left_hand": ["beer", "mop", "handbag"],
  "accessory": ["nuke", "lily", "pet-apu"]
}`}
              onCopy={() => copyToClipboard('https://pingonsol.com/traits-index.json')}
            />
          </motion.div>

          {/* Generate Custom Character */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <EndpointCard
              icon={<Image className="w-5 h-5" />}
              title="Generate Custom Character"
              endpoint="GET /api/image/custom.png"
              description="Generate a custom PING character image with specified traits."
              parameters={[
                { name: "head", type: "string", description: "Head accessory trait (optional)" },
                { name: "face", type: "string", description: "Face accessory trait (optional)" },
                { name: "body", type: "string", description: "Body trait (optional)" },
                { name: "aura", type: "string", description: "Aura effect trait (optional)" },
                { name: "mouth", type: "string", description: "Mouth accessory trait (optional)" },
                { name: "right_hand", type: "string", description: "Right hand item trait (optional)" },
                { name: "left_hand", type: "string", description: "Left hand item trait (optional)" },
                { name: "accessory", type: "string", description: "Additional accessory trait (optional)" }
              ]}
              example="https://pingonsol.com/api/image/custom.png?head=backwards-cap&face=pit-vipers"
              responseExample="Returns a PNG image of the custom PING character"
              onCopy={() => copyToClipboard('https://pingonsol.com/api/image/custom.png?head=backwards-cap&face=pit-vipers')}
            />
          </motion.div>

          {/* Generate Social Media Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <EndpointCard
              icon={<Share2 className="w-5 h-5" />}
              title="Generate Social Media Preview"
              endpoint="GET /api/og"
              description="Generate a social media preview page for sharing custom PING characters on X (Twitter), Discord, etc."
              parameters={[
                { name: "head", type: "string", description: "Head accessory trait (optional)" },
                { name: "face", type: "string", description: "Face accessory trait (optional)" },
                { name: "body", type: "string", description: "Body trait (optional)" },
                { name: "aura", type: "string", description: "Aura effect trait (optional)" },
                { name: "mouth", type: "string", description: "Mouth accessory trait (optional)" },
                { name: "right_hand", type: "string", description: "Right hand item trait (optional)" },
                { name: "left_hand", type: "string", description: "Left hand item trait (optional)" },
                { name: "accessory", type: "string", description: "Additional accessory trait (optional)" }
              ]}
              example="https://pingonsol.com/api/og?head=backwards-cap&face=pit-vipers"
              responseExample="Returns an HTML page with Open Graph meta tags for social media preview"
              onCopy={() => copyToClipboard('https://pingonsol.com/api/og?head=backwards-cap&face=pit-vipers')}
            />
          </motion.div>

          {/* Generate Character with Custom Shirt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <EndpointCard
              icon={<Shirt className="w-5 h-5" />}
              title="Generate Character with Custom Shirt"
              endpoint="GET /api/image/shirt.png"
              description="Generate a PING character wearing a shirt with your custom image."
              parameters={[
                { name: "photo", type: "string", description: "URL of the image to use as shirt design (required)" }
              ]}
              example="https://pingonsol.com/api/image/shirt.png?photo=https://example.com/my-image.jpg"
              responseExample="Returns a PNG image of PING character wearing the custom shirt"
              onCopy={() => copyToClipboard('https://pingonsol.com/api/image/shirt.png?photo=https://example.com/my-image.jpg')}
            />
          </motion.div>

          {/* Generate Character with X User's Profile Picture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <EndpointCard
              icon={<Users className="w-5 h-5" />}
              title="Generate Character with X User's Profile Picture"
              endpoint="GET /api/image/shirt_by_x.png"
              description="Generate a PING character wearing a shirt with an X (Twitter) user's profile picture."
              parameters={[
                { name: "handle", type: "string", description: "X (Twitter) username without @ symbol (required)" }
              ]}
              example="https://pingonsol.com/api/image/shirt_by_x.png?handle=elonmusk"
              responseExample="Returns a PNG image of PING character wearing a shirt with the user's profile picture"
              onCopy={() => copyToClipboard('https://pingonsol.com/api/image/shirt_by_x.png?handle=elonmusk')}
            />
          </motion.div>

          {/* Generate Social Preview for X User */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <EndpointCard
              icon={<Share2 className="w-5 h-5" />}
              title="Generate Social Preview for X User"
              endpoint="GET /api/og/ogx/[handle]"
              description="Generate a social media preview page for sharing PING characters with X user's profile picture as shirt."
              parameters={[
                { name: "handle", type: "string", description: "X (Twitter) username without @ symbol (required, part of URL path)" }
              ]}
              example="https://pingonsol.com/api/og/ogx/elonmusk"
              responseExample="Returns an HTML page with Open Graph meta tags for social media preview"
              onCopy={() => copyToClipboard('https://pingonsol.com/api/og/ogx/elonmusk')}
            />
          </motion.div>
        </div>

        {/* Usage Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Usage Examples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">JavaScript/TypeScript</h4>
                <CodeBlock language="javascript">{`// Fetch available traits
const traits = await fetch('https://pingonsol.com/traits-index.json')
  .then(res => res.json());

// Generate custom character image URL
const characterUrl = new URL('https://pingonsol.com/api/image/custom.png');
characterUrl.searchParams.set('head', 'backwards-cap');
characterUrl.searchParams.set('face', 'pit-vipers');
characterUrl.searchParams.set('body', 'ping-tee');

// Use in an img tag
const img = document.createElement('img');
img.src = characterUrl.toString();
document.body.appendChild(img);`}</CodeBlock>
              </div>

              <div>
                <h4 className="font-semibold mb-2">HTML</h4>
                <CodeBlock language="html">{`<!-- Direct image embedding -->
<img src="https://pingonsol.com/api/image/custom.png?head=crown&aura=fire-aura" 
     alt="Custom PING Character" />

<!-- Social media sharing -->
<a href="https://pingonsol.com/api/og?head=crown&aura=fire-aura" 
   target="_blank">
  Share on Social Media
</a>`}</CodeBlock>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Python</h4>
                <CodeBlock language="python">{`import requests

# Get available traits
response = requests.get('https://pingonsol.com/traits-index.json')
traits = response.json()

# Generate character image
params = {
    'head': 'cowboy-hat',
    'face': 'cool-glasses',
    'right_hand': 'pistol'
}

image_url = 'https://pingonsol.com/api/image/custom.png'
image_response = requests.get(image_url, params=params)

# Save image
with open('my_ping_character.png', 'wb') as f:
    f.write(image_response.content)`}</CodeBlock>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Rate Limiting</h4>
                <p className="text-blue-800 text-sm">
                  Please be respectful with API usage. No strict rate limits are enforced, but excessive requests may be throttled.
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Caching</h4>
                <p className="text-green-800 text-sm">
                  Generated images are cached for performance. Identical requests will return cached results.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Image Format</h4>
                <p className="text-yellow-800 text-sm">
                  All character images are returned as PNG format with transparent backgrounds (where applicable).
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

// Helper Components
interface EndpointCardProps {
  icon: React.ReactNode;
  title: string;
  endpoint: string;
  description: string;
  parameters?: Array<{ name: string; type: string; description: string }>;
  example: string;
  responseExample: string;
  onCopy: () => void;
}

const EndpointCard: React.FC<EndpointCardProps> = ({
  icon,
  title,
  endpoint,
  description,
  parameters,
  example,
  responseExample,
  onCopy
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-mono rounded">
            {endpoint.split(' ')[0]}
          </span>
          <code className="text-sm text-muted-foreground font-mono">
            {endpoint.split(' ')[1]}
          </code>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        
        {parameters && (
          <div>
            <h4 className="font-semibold mb-2">Parameters</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Name</th>
                    <th className="text-left py-2 font-medium">Type</th>
                    <th className="text-left py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {parameters.map((param, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 font-mono text-blue-600">{param.name}</td>
                      <td className="py-2 text-muted-foreground">{param.type}</td>
                      <td className="py-2">{param.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold mb-2">Example Request</h4>
          <CodeBlock onCopy={onCopy}>{example}</CodeBlock>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Response</h4>
          <CodeBlock>{responseExample}</CodeBlock>
        </div>
      </CardContent>
    </Card>
  );
};

interface CodeBlockProps {
  children: string;
  language?: string;
  onCopy?: () => void;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, language, onCopy }) => {
  return (
    <div className="relative group">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code className={language ? `language-${language}` : ''}>{children}</code>
      </pre>
      {onCopy && (
        <button
          onClick={onCopy}
          className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="Copy to clipboard"
        >
          <Code size={14} />
        </button>
      )}
    </div>
  );
};

export default Docs;