import http from 'http';
import https from 'https';

export const config = {
  api: {
    // This physically stops Vercel from pre-parsing the body, 
    // ensuring multipart CV file uploads successfully pipe through intact.
    bodyParser: false, 
  },
};

export default function handler(req, res) {
  // Read the IP secretly from the Vercel Vault environment variables
  const BACKEND_URL = process.env.BACKEND_API_URL || process.env.VITE_API_URL;

  if (!BACKEND_URL) {
    res.status(500).json({ error: "Backend proxy URL not configured in Vercel settings." });
    return;
  }

  // Safely concatenate the URL. E.g., req.url might be `/api/jobs`
  const base = BACKEND_URL.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
  const cleanBase = base.endsWith('/api') ? base.slice(0, -4) : base; // prevent double /api
  
  const targetUrl = new URL(cleanBase + req.url);

  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
    path: targetUrl.pathname + targetUrl.search,
    method: req.method,
    headers: {
      ...req.headers,
      host: targetUrl.host, // Crucial: replace the host header
    },
  };

  // Perform the physical proxy routing
  const proxyReq = (targetUrl.protocol === 'https:' ? https : http).request(options, (proxyRes) => {
    res.status(proxyRes.statusCode);
    
    for (const [key, value] of Object.entries(proxyRes.headers)) {
      res.setHeader(key, value);
    }

    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy Error:', err);
    res.status(502).json({ error: 'Proxy failed to reach backend server.' });
  });

  // Stream the full frontend payload into the VPS backend seamlessly
  req.pipe(proxyReq);
}