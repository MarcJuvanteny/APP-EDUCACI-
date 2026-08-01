// Rate limiting en memoria, per clau (normalment IP + nom de l'endpoint).
//
// Nomes val per a una unica instancia de servidor: es reinicia si el proces
// es reinicia i no es comparteix entre multiples instancies serverless en
// paral·lel. Es suficient per la mida d'aquest projecte (una app d'un sol
// centre/professorat). Si mai cal escalar a multiples instancies concurrents,
// caldria un magatzem compartit (p. ex. @upstash/ratelimit amb Redis) sense
// canviar la interficie de checkRateLimit().
const buckets = new Map();

// Evita que el Map creixi sense limit si hi ha moltes IPs diferents al llarg
// del temps — neteja entrades ja caducades quan el mapa es fa gran.
const MAX_BUCKETS = 5000;

export function checkRateLimit(key, { limit, windowMs }) {
  const now = Date.now();

  if (buckets.size > MAX_BUCKETS) {
    for (const [k, entry] of buckets) {
      if (now - entry.start > windowMs) buckets.delete(k);
    }
  }

  let entry = buckets.get(key);
  if (!entry || now - entry.start > windowMs) {
    entry = { start: now, count: 0 };
    buckets.set(key, entry);
  }
  entry.count += 1;

  return {
    allowed: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    resetAt: entry.start + windowMs,
  };
}

export function clientIp(req) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
