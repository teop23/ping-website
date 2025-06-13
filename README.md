# PING Character Generator

A React-based character customization tool with a serverless API for generating PING character images.

## Features

- **Character Builder**: Interactive trait selection and customization
- **Trait Creator**: Advanced drawing tools for creating custom traits
- **Serverless API**: Cloudflare Pages Functions for on-demand image generation
- **Real-time Preview**: Instant character updates as you customize

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Cloudflare Pages Functions

The project includes a serverless API built with Cloudflare Pages Functions:

### Local Development

```bash
# Build the project first
npm run build

# Start Pages Functions development server
npm run pages:dev
```

### Deployment

```bash
# Deploy to Cloudflare Pages
npm run pages:deploy
```

### API Endpoints

- **Generate Character**: `/api?head=cap&face=cool-glasses&size=512`
- **List Traits**: `/api?list=traits`
- **Documentation**: `/api?docs=true`

### API Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `aura` | string | Character aura trait | none |
| `head` | string | Head accessory trait | none |
| `face` | string | Face accessory trait | none |
| `mouth` | string | Mouth accessory trait | none |
| `body` | string | Body trait | none |
| `right_hand` | string | Right hand item trait | none |
| `left_hand` | string | Left hand item trait | none |
| `accessory` | string | Additional accessory trait | none |
| `size` | number | Image size in pixels (64-2048) | 512 |
| `format` | string | Output format (png, jpg, jpeg, webp) | png |
| `quality` | number | Image quality (0.1-1) | 1 |
| `list` | string | Set to "traits" to get available traits | none |
| `docs` | string | Set to "true" to view documentation | none |

## Project Structure

```
├── functions/           # Cloudflare Pages Functions
│   ├── api.ts          # Main API endpoint
│   └── _middleware.ts  # CORS middleware
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   └── assets/         # Static assets and traits
├── public/             # Public assets
└── wrangler.toml       # Cloudflare configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Submit a pull request

## License

MIT License - see LICENSE file for details
