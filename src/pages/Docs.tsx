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
      className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-micro text-ink-muted transition-colors duration-fast ease-out-quart hover:text-ink"
      aria-label={done ? 'Copied' : 'Copy example'}
    >
      {done ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      {done ? 'Copied' : 'Copy'}
    </button>
  );
};

/**
 * A small syntax palette (src/index.css --syntax-*), not --brand: brand is a
 * fill colour (1.04:1 on cream, see index.css), and a single accent repeated
 * for every string/value/key just reads as "everything is lime" rather than
 * as language. Each role below keeps its own hue everywhere it shows up -
 * keys/attrs/params share a colour, strings/values share another - so the
 * same kind of thing looks the same whether it's in a URL, JSON, or code.
 */
const SYNTAX_CLASS = {
  keyword: 'text-syntax-keyword',
  string: 'text-syntax-string',
  number: 'text-syntax-number',
  func: 'text-syntax-func',
  comment: 'text-ink-faint italic',
  punct: 'text-ink-faint',
} as const;

/** Runs a token regex with named capture groups over `source`, wrapping each
 *  match in a span classed by whichever group matched and leaving everything
 *  between matches as plain text. One tokenizer shape, reused per language. */
const tokenize = (source: string, pattern: RegExp, classes: Partial<Record<string, string>>) => {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source))) {
    if (match.index > last) nodes.push(source.slice(last, match.index));
    const group = Object.keys(match.groups ?? {}).find((name) => match!.groups![name] !== undefined);
    const cls = group ? classes[group] : undefined;
    nodes.push(
      cls ? (
        <span key={match.index} className={cls}>
          {match[0]}
        </span>
      ) : (
        match[0]
      ),
    );
    last = match.index + match[0].length;
  }
  nodes.push(source.slice(last));
  return nodes;
};

const JS_TOKEN =
  /(?<comment>\/\/.*$)|(?<string>'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(?<keyword>\b(?:const|let|var|new|function|return|import|from|export|default|class|await|async|if|else|for|while|of|in|typeof|instanceof)\b)|(?<func>\b[a-zA-Z_$][\w$]*(?=\())|(?<number>\b\d+(?:\.\d+)?\b)/gm;
const highlightJs = (source: string) => tokenize(source, JS_TOKEN, SYNTAX_CLASS);

const PYTHON_TOKEN =
  /(?<comment>#(?!\d).*$)|(?<string>'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(?<keyword>\b(?:import|from|as|with|def|return|if|else|for|while|in|class|True|False|None)\b)|(?<func>\b[a-zA-Z_]\w*(?=\())|(?<number>\b\d+(?:\.\d+)?\b)/gm;
const highlightPython = (source: string) => tokenize(source, PYTHON_TOKEN, SYNTAX_CLASS);

const HTML_TOKEN = /(?<keyword><\/?[a-zA-Z][\w-]*|\/?>)|(?<func>\b[a-zA-Z-]+(?==))|(?<string>"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
const highlightHtml = (source: string) => tokenize(source, HTML_TOKEN, SYNTAX_CLASS);

/** Same idea for a URL: the origin and path read as plain text, `?`/`&`/`=`
 *  fade back, and the param name (func/attr colour) and the value you'd
 *  swap in (string colour) are the two things worth scanning for in a
 *  GET-by-URL API - coloured to match the same roles in JSON and HTML. */
const highlightUrl = (url: string) => {
  const [base, query] = url.split(/(?=\?)/, 2);
  if (!query) return <span className="text-ink">{base}</span>;
  const pairs = query.slice(1).split('&');
  return (
    <>
      <span className="text-ink">{base}</span>
      <span className={SYNTAX_CLASS.punct}>?</span>
      {pairs.map((pair, i) => {
        const [key, value] = pair.split('=');
        return (
          <React.Fragment key={key + i}>
            {i > 0 && <span className={SYNTAX_CLASS.punct}>&amp;</span>}
            <span className={`font-semibold ${SYNTAX_CLASS.func}`}>{key}</span>
            {value !== undefined && (
              <>
                <span className={SYNTAX_CLASS.punct}>=</span>
                <span className={SYNTAX_CLASS.string}>{value}</span>
              </>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

/** JSON's own grammar: quoted keys get the same colour as a URL param name
 *  or an HTML attribute (they're all "the name of a slot"), quoted values
 *  match string colour everywhere else, and punctuation fades back. */
const JSON_TOKEN = /("(?:[^"\\]|\\.)*"\s*:)|("(?:[^"\\]|\\.)*")|([[\]{},])/g;
const highlightJson = (source: string) => {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = JSON_TOKEN.exec(source))) {
    if (match.index > last) nodes.push(source.slice(last, match.index));
    const [full, key, value] = match;
    if (key) nodes.push(<span key={match.index} className={`font-semibold ${SYNTAX_CLASS.func}`}>{key}</span>);
    else if (value) nodes.push(<span key={match.index} className={SYNTAX_CLASS.string}>{value}</span>);
    else nodes.push(<span key={match.index} className={SYNTAX_CLASS.punct}>{full}</span>);
    last = match.index + full.length;
  }
  nodes.push(source.slice(last));
  return nodes;
};

const CodeBlock: React.FC<{
  children: string;
  copyable?: boolean;
  kind?: 'json' | 'url' | 'js' | 'python' | 'html' | 'plain';
}> = ({ children, copyable, kind = 'plain' }) => (
  <div className="overflow-hidden rounded-md border border-hairline bg-ground">
    {/* Its own row, not floated over the code: a long unbroken URL or line
        doesn't wrap, so a button pinned on top of the text just sits wherever
        the horizontal scroll happens to leave it - on top of real characters. */}
    {copyable && (
      <div className="flex justify-end border-b border-hairline px-2 py-1">
        <CopyButton text={children} />
      </div>
    )}
    {/* Wrap instead of scroll: a URL example is one long unbroken token with
        nowhere natural to break, and a horizontal scrollbar hides the tail
        end of it by default - break-all lets it wrap mid-string instead. */}
    <pre className="overflow-x-auto whitespace-pre-wrap break-all p-4 text-meta text-ink">
      <code>
        {kind === 'url' && highlightUrl(children)}
        {kind === 'js' && highlightJs(children)}
        {kind === 'python' && highlightPython(children)}
        {kind === 'html' && highlightHtml(children)}
        {kind === 'json' && highlightJson(children)}
        {kind === 'plain' && children}
      </code>
    </pre>
  </div>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h4 className="mb-2 text-meta font-semibold text-ink">{children}</h4>
);

/** GET is the only verb this API has, but a plain word next to a path reads as
 *  prose, not a route - a badge makes every endpoint scannable at a glance. */
const MethodBadge: React.FC = () => (
  <span className="inline-flex items-center rounded-md bg-brand-wash px-1.5 py-0.5 text-micro font-bold tracking-wide text-accent-ink">
    GET
  </span>
);

const slug = (path: string) => `api-${path.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '')}`;

/** A `[handle]`-style segment is filled in by the caller, not typed
 *  literally - the string colour (matches a URL/JSON value) says so at a
 *  glance instead of making someone read the prose to find out. */
const highlightPath = (path: string) =>
  path.split(/(\[[^\]]+\])/).map((chunk, i) =>
    chunk.startsWith('[') ? (
      <span key={i} className={SYNTAX_CLASS.string}>
        {chunk}
      </span>
    ) : (
      <React.Fragment key={i}>{chunk}</React.Fragment>
    ),
  );

const EndpointSection: React.FC<{ endpoint: Endpoint }> = ({ endpoint }) => (
  <section aria-labelledby={slug(endpoint.path)} className="scroll-mt-24 border-t border-hairline py-10">
    <h2 id={slug(endpoint.path)} className="type-display text-h3 font-bold text-ink">
      {endpoint.title}
    </h2>
    <p className="mt-2 flex flex-wrap items-center gap-2 font-mono text-meta text-ink">
      <MethodBadge />
      {highlightPath(endpoint.path)}
    </p>

    <p className="type-prose mt-3 max-w-2xl text-ink-muted">{endpoint.description}</p>

    <div className="mt-6 space-y-6">
      {endpoint.params && (
        <div>
          <Label>Parameters</Label>
          <dl className="divide-y divide-hairline rounded-lg border border-hairline bg-raised">
            {endpoint.params.map((param) => (
              <div key={param.name} className="flex flex-col gap-1.5 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4">
                <dt className="shrink-0 sm:w-36">
                  <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-meta text-ink">{param.name}</code>
                </dt>
                <dd className="text-meta text-ink-muted">{param.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      <div>
        <Label>Example</Label>
        <CodeBlock copyable kind="url">
          {endpoint.example}
        </CodeBlock>
      </div>
      <div>
        <Label>Returns</Label>
        <CodeBlock kind={endpoint.returns.startsWith('{') ? 'json' : 'plain'}>{endpoint.returns}</CodeBlock>
      </div>
    </div>
  </section>
);

/** Jump nav entries: one per endpoint plus the two hand-written sections
 *  below. Keeps the sidebar and the anchors it points at from drifting apart. */
const NAV_SECTIONS = [...ENDPOINTS.map((e) => ({ id: slug(e.path), label: e.title })), { id: 'api-examples', label: 'In code' }, { id: 'api-limits', label: 'Limits' }];

const DocsNav: React.FC = () => (
  <nav aria-label="API sections" className="sticky top-24 hidden max-h-[calc(100vh-7rem)] w-48 shrink-0 overflow-y-auto lg:block">
    <ul className="space-y-1 border-l border-hairline">
      {NAV_SECTIONS.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-meta text-ink-muted transition-colors duration-fast ease-out-quart hover:border-hairline hover:text-ink"
          >
            {s.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

const Docs: React.FC = () => (
  <main className="container max-w-5xl py-12">
    <h1 className="type-display text-h2 font-bold text-ink sm:text-h1">API</h1>
    <p className="type-prose mt-3 max-w-2xl text-lead text-ink-muted">
      Every character the builder makes is also a URL. No key, no signup. Paths below are relative to{' '}
      <code className="font-mono text-ink">{ORIGIN || 'this site'}</code>.
    </p>

    <div className="mt-10 flex items-start gap-12">
      <DocsNav />
      <div className="min-w-0 flex-1">
        {ENDPOINTS.map((endpoint) => (
          <EndpointSection key={endpoint.path} endpoint={endpoint} />
        ))}

        <section aria-labelledby="api-examples" className="scroll-mt-24 border-t border-hairline py-10">
          <h2 id="api-examples" className="type-display text-h3 font-bold text-ink">
            In code
          </h2>
          <div className="mt-6 space-y-6">
            <div>
              <Label>JavaScript</Label>
              <CodeBlock copyable kind="js">{JS_EXAMPLE}</CodeBlock>
            </div>
            <div>
              <Label>HTML</Label>
              <CodeBlock copyable kind="html">{HTML_EXAMPLE}</CodeBlock>
            </div>
            <div>
              <Label>Python</Label>
              <CodeBlock copyable kind="python">{PYTHON_EXAMPLE}</CodeBlock>
            </div>
          </div>
        </section>

        <section aria-labelledby="api-limits" className="scroll-mt-24 border-t border-hairline py-10">
          <h2 id="api-limits" className="type-display text-h3 font-bold text-ink">
            Limits
          </h2>
          <p className="type-prose mt-3 max-w-2xl text-ink-muted">
            No hard rate limit. Images are cached, so the same request returns the same image fast. Hammer it and you
            get throttled.
          </p>
        </section>
      </div>
    </div>
  </main>
);

export default Docs;
