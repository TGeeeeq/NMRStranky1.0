import fs from 'fs';
import path from 'path';

// Projection constants
const LON0 = 15.372, LON1 = 15.418, LAT0 = 49.778, LAT1 = 49.812;
const W = 1000;
const M_PER_DEG_LAT = 111132;
const M_PER_DEG_LON = 111320 * Math.cos((49.795 * Math.PI) / 180);
const H = Math.round(W * ((LAT1 - LAT0) * M_PER_DEG_LAT) / ((LON1 - LON0) * M_PER_DEG_LON));

function project(lat, lon) {
  const x = (lon - LON0) / (LON1 - LON0) * W;
  const y = (LAT1 - lat) / (LAT1 - LAT0) * H;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

// Haversine distance in meters
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Point-to-line distance for Douglas-Peucker
function pointToLineDistance(point, lineStart, lineEnd) {
  const [x0, y0] = point;
  const [x1, y1] = lineStart;
  const [x2, y2] = lineEnd;

  const num = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1);
  const den = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
  return den === 0 ? Math.hypot(x0 - x1, y0 - y1) : num / den;
}

// Douglas-Peucker simplification
function douglasPeucker(points, tolerance) {
  if (points.length < 3) return points;

  let maxDist = 0;
  let maxIdx = 0;

  const p1 = points[0];
  const p2 = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const dist = pointToLineDistance(points[i], p1, p2);
    if (dist > maxDist) {
      maxDist = dist;
      maxIdx = i;
    }
  }

  if (maxDist > tolerance) {
    const left = douglasPeucker(points.slice(0, maxIdx + 1), tolerance);
    const right = douglasPeucker(points.slice(maxIdx), tolerance);
    return left.slice(0, -1).concat(right);
  } else {
    return [p1, p2];
  }
}

// Main execution
const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node generate-louka-map.mjs <path-to-osm.json>');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// Index nodes
const nodes = new Map();
for (const el of data.elements) {
  if (el.type === 'node') {
    nodes.set(el.id, { lat: el.lat, lon: el.lon });
  }
}

// Categorize ways
const categories = {
  forests: [],
  waters: [],
  streams: [],
  rails: [],
  roads: [],
  lanes: [],
  trails: []
};

const waysByTag = {
  forests: [],
  waters: [],
  streams: [],
  rails: [],
  roads: [],
  lanes: [],
  trails: []
};

for (const way of data.elements) {
  if (way.type !== 'way' || !way.nodes) continue;

  const coords = way.nodes
    .map(id => nodes.get(id))
    .filter(Boolean);

  if (coords.length < 2) continue;

  const tags = way.tags || {};
  let category = null;
  let tolerance = 2.0;
  let isRoute = false;

  if (tags.landuse === 'forest' || tags.natural === 'wood') {
    category = 'forests';
  } else if (tags.natural === 'water' || tags.water === 'pond') {
    category = 'waters';
  } else if (tags.waterway === 'stream') {
    category = 'streams';
    tolerance = 1.0;
    isRoute = true;
  } else if (tags.railway === 'rail') {
    category = 'rails';
    tolerance = 1.0;
    isRoute = true;
  } else if (['secondary', 'tertiary'].includes(tags.highway)) {
    category = 'roads';
    isRoute = true;
  } else if (['residential', 'unclassified', 'service'].includes(tags.highway)) {
    category = 'lanes';
    isRoute = true;
  } else if (['track', 'path', 'footway'].includes(tags.highway)) {
    category = 'trails';
    isRoute = true;
  }

  if (category) {
    waysByTag[category].push({ way, coords });
  }
}

// Process each category with simplification
for (const [category, ways] of Object.entries(waysByTag)) {
  const isPolygon = ['forests', 'waters'].includes(category);
  const tolerance = ['streams', 'rails'].includes(category) ? 1.0 : 2.0;

  for (const { way, coords } of ways) {
    const projectedCoords = coords.map(c => project(c.lat, c.lon));
    let simplified = douglasPeucker(projectedCoords, tolerance);

    // Enforce minimum point counts
    if (isPolygon && simplified.length < 4) {
      simplified = projectedCoords;
    } else if (!isPolygon && simplified.length < 2) {
      simplified = projectedCoords;
    }

    categories[category].push(simplified);
  }
}

// Extract places
const places = [];
for (const el of data.elements) {
  if (el.type === 'node' && el.tags?.place && el.tags?.name) {
    places.push({
      name: el.tags.name,
      at: project(el.lat, el.lon)
    });
  }
}

// Fixed points
const POINTS = {
  parking:  { lat: 49.793880, lon: 15.397398 },
  vlkanec:  { lat: 49.804324, lon: 15.404644 },
  novaves:  { lat: 49.784031, lon: 15.403467 },
  louka:    { lat: 49.793204, lon: 15.391297 },
  loukaAlt: { lat: 49.797344, lon: 15.388594 },
};

// Build graph from all highway ways
const graph = new Map();
for (const way of data.elements) {
  if (way.type !== 'way' || !way.nodes) continue;
  const tags = way.tags || {};
  if (!tags.highway) continue;

  for (let i = 0; i < way.nodes.length; i++) {
    const nodeId = way.nodes[i];
    if (!graph.has(nodeId)) graph.set(nodeId, []);

    if (i > 0) {
      const prevId = way.nodes[i - 1];
      if (!graph.get(nodeId).includes(prevId)) {
        graph.get(nodeId).push(prevId);
      }
    }
    if (i < way.nodes.length - 1) {
      const nextId = way.nodes[i + 1];
      if (!graph.get(nodeId).includes(nextId)) {
        graph.get(nodeId).push(nextId);
      }
    }
  }
}

// Snap fixed points to nearest graph vertices
const snappedPoints = {};
for (const [name, { lat, lon }] of Object.entries(POINTS)) {
  let nearestId = null;
  let minDist = Infinity;

  for (const nodeId of graph.keys()) {
    const node = nodes.get(nodeId);
    const dist = haversine(lat, lon, node.lat, node.lon);
    if (dist < minDist) {
      minDist = dist;
      nearestId = nodeId;
    }
  }

  snappedPoints[name] = { nodeId: nearestId, snapDist: minDist };
}

// Dijkstra shortest path
function dijkstra(startId, targetId) {
  if (!startId || !targetId) return null;

  const dist = new Map();
  const prev = new Map();
  const visited = new Set();

  for (const nodeId of graph.keys()) {
    dist.set(nodeId, Infinity);
  }
  dist.set(startId, 0);

  while (visited.size < graph.size) {
    let minId = null;
    let minDist = Infinity;

    for (const nodeId of graph.keys()) {
      if (!visited.has(nodeId) && dist.get(nodeId) < minDist) {
        minId = nodeId;
        minDist = dist.get(nodeId);
      }
    }

    if (minId === null || minDist === Infinity) break;
    visited.add(minId);

    if (minId === targetId) break;

    for (const nextId of (graph.get(minId) || [])) {
      if (visited.has(nextId)) continue;

      const nextNode = nodes.get(nextId);
      const curr = nodes.get(minId);
      const edgeDist = haversine(curr.lat, curr.lon, nextNode.lat, nextNode.lon);
      const newDist = dist.get(minId) + edgeDist;

      if (newDist < dist.get(nextId)) {
        dist.set(nextId, newDist);
        prev.set(nextId, minId);
      }
    }
  }

  if (dist.get(targetId) === Infinity) return null;

  const path = [];
  let curr = targetId;
  while (curr !== undefined) {
    path.unshift(curr);
    curr = prev.get(curr);
  }

  return path;
}

// Compute routes
const routes = [];
const starts = ['parking', 'vlkanec', 'novaves'];
const targets = ['louka', 'loukaAlt'];
const routeInfo = [];

for (const start of starts) {
  for (const target of targets) {
    const startSnap = snappedPoints[start];
    const targetSnap = snappedPoints[target];

    if (!startSnap.nodeId || !targetSnap.nodeId) {
      console.error(`Warning: Could not snap ${start} or ${target}`);
      continue;
    }

    const path = dijkstra(startSnap.nodeId, targetSnap.nodeId);
    if (!path) {
      console.error(`Warning: No route from ${start} to ${target}`);
      continue;
    }

    // Convert path to lat/lon
    const coords = path.map(id => nodes.get(id));

    // Prepend exact start point, append exact target point
    const fullCoords = [
      POINTS[start],
      ...coords,
      POINTS[target]
    ];

    // Project
    const projected = fullCoords.map(c => project(c.lat, c.lon));

    // Simplify with tolerance 1.0
    const simplified = douglasPeucker(projected, 1.0);

    // Compute km over full coord list
    let totalDist = 0;
    for (let i = 0; i < fullCoords.length - 1; i++) {
      const c1 = fullCoords[i];
      const c2 = fullCoords[i + 1];
      totalDist += haversine(c1.lat, c1.lon, c2.lat, c2.lon);
    }
    const km = Math.round(totalDist / 1000 * 10) / 10;

    routes.push({
      from: start,
      to: target,
      km,
      points: simplified
    });

    routeInfo.push({
      from: start,
      to: target,
      km,
      points: simplified.length,
      startNodeId: startSnap.nodeId,
      targetNodeId: targetSnap.nodeId,
      startSnapDist: startSnap.snapDist,
      targetSnapDist: targetSnap.snapDist
    });
  }
}

// Generate TypeScript output
const startPointsArray = [
  { id: 'parking', label: 'Parkoviště', at: project(POINTS.parking.lat, POINTS.parking.lon) },
  { id: 'vlkanec', label: 'Vlkaneč — vlak', at: project(POINTS.vlkanec.lat, POINTS.vlkanec.lon) },
  { id: 'novaves', label: 'Nová Ves u Leštiny — vlak', at: project(POINTS.novaves.lat, POINTS.novaves.lon) },
];

const targetsArray = [
  { id: 'louka', at: project(POINTS.louka.lat, POINTS.louka.lon) },
  { id: 'loukaAlt', at: project(POINTS.loukaAlt.lat, POINTS.loukaAlt.lon) },
];

const tsContent = `// VYGENEROVÁNO skriptem web/scripts/generate-louka-map.mjs — needitovat ručně.
// Zdroj: OpenStreetMap (ODbL), výřez okolí Louky u Nové Vsi u Leštiny.

export type XY = [number, number];
export type StartId = "parking" | "vlkanec" | "novaves";
export type TargetId = "louka" | "loukaAlt";

export const VIEW = { width: 1000, height: ${H} } as const;

export const forests: XY[][] = ${JSON.stringify(categories.forests)};
export const waters: XY[][] = ${JSON.stringify(categories.waters)};
export const streams: XY[][] = ${JSON.stringify(categories.streams)};
export const rails: XY[][] = ${JSON.stringify(categories.rails)};
export const roads: XY[][] = ${JSON.stringify(categories.roads)};
export const lanes: XY[][] = ${JSON.stringify(categories.lanes)};
export const trails: XY[][] = ${JSON.stringify(categories.trails)};

export const places: { name: string; at: XY }[] = ${JSON.stringify(places)};

export const startPoints: { id: StartId; label: string; at: XY }[] = ${JSON.stringify(startPointsArray)};

export const targets: { id: TargetId; at: XY }[] = ${JSON.stringify(targetsArray)};

export const routes: { from: StartId; to: TargetId; km: number; points: XY[] }[] = ${JSON.stringify(routes)};
`;

// Create output directory
const outDir = '/home/user/NMRStranky1.0/web/components/louka-map';
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'map-data.ts'), tsContent);

const fileSize = fs.statSync(path.join(outDir, 'map-data.ts')).size;

// Print summary
console.log(`\n=== Louka Map Data Generation ===`);
console.log(`Height: ${H}`);
console.log(`\nCategory counts:`);
console.log(`  forests: ${categories.forests.length}`);
console.log(`  waters: ${categories.waters.length}`);
console.log(`  streams: ${categories.streams.length}`);
console.log(`  rails: ${categories.rails.length}`);
console.log(`  roads: ${categories.roads.length}`);
console.log(`  lanes: ${categories.lanes.length}`);
console.log(`  trails: ${categories.trails.length}`);
console.log(`\nRoutes (${routes.length}/6):`);
for (const info of routeInfo) {
  console.log(`  ${info.from}→${info.to}: ${info.km}km, ${info.points} points (snap: node ${info.startNodeId} at ${info.startSnapDist.toFixed(1)}m, node ${info.targetNodeId} at ${info.targetSnapDist.toFixed(1)}m)`);
}
console.log(`\nOutput file: ${path.join(outDir, 'map-data.ts')}`);
console.log(`File size: ${fileSize} bytes`);
