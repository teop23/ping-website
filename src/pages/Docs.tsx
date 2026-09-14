import { Check, Copy } from 'lucide-react';
import React, { useState } from 'react';

/** Whatever host the docs are read from is the host the examples should use. */
const ORIGIN = typeof window === 'undefined' ? '' : window.location.origin;

const TRAIT_PARAMS: Param[] = [
  { name: 'head', description: 'Hat, hair or anything on top' },
  { name: 'face', description: 'Glasses and expressions' },
  { name: 'body', description: 'Shirts, tattoos, chains' },
  { name: 'aura', description: 'Background' },
  { name: 'mouth', description: 'Cigar, beard, pipe' },
  { name: 'right_hand', description: 'Item in the right hand' },
  { name: 'left_hand', description: 'Item in the left hand' },
  { name: 'accessory', description: 'Something next to PING' },
];

interface Param {
  name: string;
  description: string;
}

interface Endpoint {
  path: string;
  title: string;
  description: string;
  params?: Param[];
  example: string;
  returns: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    path: '/traits-index.json',
    title: 'List traits',
    description: 'Every trait name, grouped by slot. Use these names as parameters below.',
    example: `${ORIGIN}/traits-index.json`,
    returns: `{
  "head": ["antlers", "backwards-cap", "beret", ...],
  "face": ["angry", "band-aid", "blushing", ...],
  "body": ["4chan-tee", "blank-tee", "cape", ...],
  ...
}`,
  },
  {
    path: '/api/image/custom.png',
    title: 'Character image',
    description: 'A PNG of PING wearing the traits you name. Every parameter is optional; leave one out and that slot stays empty.',
    params: TRAIT_PARAMS,
    example: `${ORIGIN}/api/image/custom.png?head=backwards-cap&face=pit-vipers`,
    returns: 'PNG',
  },
  {
    path: '/api/image/random.png',
    title: 'Random character',
    description: 'A PNG with random traits. Responses can be cached, so add a changing t to get a new one.',
    params: [{ name: 't', description: 'Any value, usually a timestamp' }],
    example: `${ORIGIN}/api/image/random.png?t=1700000000`,
    returns: 'PNG',
  },
  {
    path: '/api/og',
    title: 'Share page',
    description: 'An HTML page with Open Graph tags, so a link posted on X or Discord unfurls as the character. Takes the same parameters as the character image.',
    params: TRAIT_PARAMS,
    example: `${ORIGIN}/api/og?head=backwards-cap&face=pit-vipers`,
    returns: 'HTML',
  },
  {
    path: '/api/image/shirt.png',
    title: 'Custom shirt',
    description: 'PING wearing a shirt printed with any image.',
    params: [{ name: 'photo', description: 'Image URL. Required' }],
    example: `${ORIGIN}/api/image/shirt.png?photo=https://example.com/my-image.jpg`,
    returns: 'PNG',
  },
  {
    path: '/api/image/shirt_by_x.png',
    title: 'X avatar shirt',
    description: "PING wearing a shirt printed with an X account's profile picture.",
    params: [{ name: 'handle', description: 'X username, no @. Required' }],
    example: `${ORIGIN}/api/image/shirt_by_x.png?handle=elonmusk`,
    returns: 'PNG',
  },
  {
    path: '/api/og/ogx/[handle]',
    title: 'X avatar share page',
    description: 'The share page for the X avatar shirt. The handle goes in the path.',
    example: `${ORIGIN}/api/og/ogx/elonmusk`,
    returns: 'HTML',
  },
];

const JS_EXAMPLE = `const url = new URL('${ORIGIN}/api/image/custom.png');
url.searchParams.set('head', 'backwards-cap');
url.searchParams.set('face', 'pit-vipers');
url.searchParams.set('body', 'ping-tee');

const img = document.createElement('img');
img.src = url.toString();
document.body.appendChild(img);`;

const HTML_EXAMPLE = `<img src="${ORIGIN}/api/image/custom.png?head=crown&aura=fire-aura" alt="PING" />`;

const PYTHON_EXAMPLE = `import requests

params = {'head': 'cowboy-hat', 'face': 'cool-glasses', 'right_hand': 'pistol'}
image = requests.get('${ORIGIN}/api/image/custom.png', params=params)

with open('ping.png', 'wb') as f:
    f.write(image.content)`;

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      window.setTimeout(() => setDone(false), 1500);
    } catch {
      setDone(false);
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-md border border-hairline bg-panel px-2.5 py-1 text-micro text-ink-muted transition-colors duration-fast ease-out-quart hover:text-ink"
      aria-label={done ? 'Copied' : 'Copy example'}
    >
      {done ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      {done ? 'Copied' : 'Copy'}
    </button>
  );
};

const CodeBlock: React.FC<{ children: string; copyable?: boolean }> = ({ children, copyable }) => (
  <div className="relative">
    <pre className={`overflow-x-auto rounded-md border border-hairline bg-ground p-4 text-meta text-ink ${copyable ? 'pr-24' : ''}`}>
      <code>{children}</code>
    </pre>
    {copyable && <CopyButton text={children} />}
  </div>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h4 className="mb-2 text-meta font-semibold text-ink">{children}</h4>
);

const EndpointSection: React.FC<{ endpoint: Endpoint }> = ({ endpoint }) => (
  <section aria-labelledby={`api-${endpoint.path}`} className="border-t border-hairline py-10">
    <h2 id={`api-${endpoint.path}`} className="type-display text-h3 font-bold text-ink">
      {endpoint.title}
    </h2>
    <p className="mt-2 font-mono text-meta text-ink">
      <span className="text-ink-faint">GET</span> {endpoint.path}
    </p>
    <p className="type-prose mt-3 max-w-2xl text-ink-muted">{endpoint.description}</p>

    <div className="mt-6 space-y-6">
      {endpoint.params && (
        <div>
          <Label>Parameters</Label>
          <dl className="divide-y divide-hairline rounded-lg border border-hairline bg-raised">
            {endpoint.params.map((param) => (
              <div key={param.name} className="flex flex-col gap-1 px-4 py-2.5 sm:flex-row sm:gap-4">
                <dt className="w-32 shrink-0 font-mono text-meta text-ink">{param.name}</dt>
                <dd className="text-meta text-ink-muted">{param.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      <div>
        <Label>Example</Label>
        <CodeBlock copyable>{endpoint.example}</CodeBlock>
      </div>
      <div>
        <Label>Returns</Label>
        <CodeBlock>{endpoint.returns}</CodeBlock>
      </div>
    </div>
  </section>
);

const Docs: React.FC = () => (
  <main className="container max-w-5xl py-12">
    <h1 className="type-display text-h2 font-bold text-ink sm:text-h1">API</h1>
    <p className="type-prose mt-3 max-w-2xl text-lead text-ink-muted">
      Every character the builder makes is also a URL. No key, no signup. Paths below are relative to{' '}
      <code className="font-mono text-ink">{ORIGIN || 'this site'}</code>.
    </p>

    <div className="mt-10">
      {ENDPOINTS.map((endpoint) => (
        <EndpointSection key={endpoint.path} endpoint={endpoint} />
      ))}
    </div>

    <section aria-labelledby="api-examples" className="border-t border-hairline py-10">
      <h2 id="api-examples" className="type-display text-h3 font-bold text-ink">
        In code
      </h2>
      <div className="mt-6 space-y-6">
        <div>
          <Label>JavaScript</Label>
          <CodeBlock copyable>{JS_EXAMPLE}</CodeBlock>
        </div>
        <div>
          <Label>HTML</Label>
          <CodeBlock copyable>{HTML_EXAMPLE}</CodeBlock>
        </div>
        <div>
          <Label>Python</Label>
          <CodeBlock copyable>{PYTHON_EXAMPLE}</CodeBlock>
        </div>
      </div>
    </section>

    <section aria-labelledby="api-limits" className="border-t border-hairline py-10">
      <h2 id="api-limits" className="type-display text-h3 font-bold text-ink">
        Limits
      </h2>
      <p className="type-prose mt-3 max-w-2xl text-ink-muted">
        No hard rate limit. Images are cached, so the same request returns the same image fast. Hammer it and you get
        throttled.
      </p>
    </section>
  </main>
);

export default Docs;
