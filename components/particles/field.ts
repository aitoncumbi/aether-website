import * as THREE from 'three';

/*
 * One cloud of soft white points that morphs between forms as you scroll.
 * Every section with `data-shape` is a stop: the form to show, and where to
 * frame it (`data-x`, fraction of half the view; `data-s`, scale). The first
 * NODES points are drawn large and bright: the vertices of each form.
 *
 *   0 black hole, data spiralling in   3 padlock      6 buckets and keys
 *   1 core with spokes to clients       4 orbits       7 timeline
 *   2 stack of blocks, a scan ring      5 bar chart    8 a cross of light
 */

type Vec = [number, number, number];
type Stop = { shape: number; x: number; s: number };
// A point, with an optional motion: 0 < w < 10 orbits about the y axis at that rate,
// w >= 10 is on the black hole's photon ring, turning at w - 10, and w < 0 spirals in
// toward the centre. Plain points stay put.
type Pt = Vec | [number, number, number, number];
type Form = { nodes: Pt[]; body: () => Pt };

const NODES = 96;
const TAU = Math.PI * 2;
const rand = Math.random;
const jit = (a: number) => (rand() - 0.5) * a;
const lerp3 = (a: Vec, b: Vec, t: number): Vec => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const pick = <T,>(xs: T[]) => xs[Math.floor(rand() * xs.length)];

/** The 12 edges of a box centred at c with half-sizes h. */
function boxEdges(c: Vec, h: Vec): [Vec, Vec][] {
  const corner = (i: number): Vec => [c[0] + (i & 1 ? h[0] : -h[0]), c[1] + (i & 2 ? h[1] : -h[1]), c[2] + (i & 4 ? h[2] : -h[2])];
  const edges: [Vec, Vec][] = [];
  for (let i = 0; i < 8; i++) for (const b of [1, 2, 4]) if (!(i & b)) edges.push([corner(i), corner(i | b)]);
  return edges;
}
const corners = (c: Vec, h: Vec): Vec[] =>
  Array.from({ length: 8 }, (_, i) => [c[0] + (i & 1 ? h[0] : -h[0]), c[1] + (i & 2 ? h[1] : -h[1]), c[2] + (i & 4 ? h[2] : -h[2])]);
function onEdges(edges: [Vec, Vec][], j = 0.012): Vec {
  const [a, b] = pick(edges);
  const p = lerp3(a, b, rand());
  return [p[0] + jit(j), p[1] + jit(j), p[2] + jit(j)];
}
const inBox = (c: Vec, h: Vec): Vec => [c[0] + jit(2 * h[0]), c[1] + jit(2 * h[1]), c[2] + jit(2 * h[2])];

/** A 3×3×3 lattice of nodes, and the lines between neighbours. */
function lattice(c: Vec, r: number) {
  const nodes: Vec[] = [];
  const lines: [Vec, Vec][] = [];
  for (let i = -1; i <= 1; i++)
    for (let j = -1; j <= 1; j++)
      for (let k = -1; k <= 1; k++) {
        const p: Vec = [c[0] + i * r, c[1] + j * r, c[2] + k * r];
        nodes.push(p);
        if (i < 1) lines.push([p, [p[0] + r, p[1], p[2]]]);
        if (j < 1) lines.push([p, [p[0], p[1] + r, p[2]]]);
        if (k < 1) lines.push([p, [p[0], p[1], p[2] + r]]);
      }
  return { nodes, lines };
}

// 0: a black hole: a dark sphere outlined by its photon ring, a disk that orbits
// faster the closer it is, and streams of data spiralling in. The shader bends the
// light of everything behind the sphere around it (see `lens`).
function holeForm(): Form {
  const ring = (r: number, w: number, y = 0.02): Pt => {
    const a = rand() * TAU;
    return [Math.cos(a) * r, jit(y), Math.sin(a) * r, w];
  };
  const disk = () => {
    const r = 1.45 + rand() ** 2 * 3.2;
    return ring(r, 1.6 / r ** 1.5, 0.05 * r);
  };
  // The photon ring always faces the camera, so it only stores an angle and a radius
  // relative to the shadow's edge; the shader places it and turns it.
  const photon = (r: number): Pt => {
    const a = rand() * TAU;
    return [Math.cos(a) * r, Math.sin(a) * r, 0, 10.5];
  };
  // A stream point stores only its arm's angle; the shader moves it along the spiral.
  const stream = (): Pt => {
    const a = Math.floor(rand() * 2) * Math.PI + jit(0.1);
    return [Math.cos(a), jit(0.15), Math.sin(a), -1];
  };
  return {
    nodes: [
      ...Array.from({ length: 14 }, () => photon(1)),
      ...Array.from({ length: 42 }, disk),
      ...Array.from({ length: 40 }, stream),
    ],
    body() {
      const k = rand();
      if (k < 0.12) return photon(1 + jit(0.06));
      if (k < 0.22) return photon(1 + rand() ** 2 * 0.4); // a soft glow just outside it
      if (k < 0.68) return disk();
      return stream();
    },
  };
}

// 1: one core, with spokes out to a ring of clients.
function hubForm(): Form {
  const core = boxEdges([0, 0, 0], [0.6, 0.6, 0.6]);
  const lat = lattice([0, 0, 0], 0.3);
  const clients: Vec[] = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * TAU;
    return [Math.cos(a) * 3.2, Math.sin(a * 2) * 0.7, Math.sin(a) * 1.9];
  });
  const boxes = clients.flatMap((c) => boxEdges(c, [0.16, 0.16, 0.16]));
  return {
    nodes: [...lat.nodes, ...clients],
    body() {
      const k = rand();
      if (k < 0.2) return onEdges(core);
      if (k < 0.3) return onEdges(lat.lines, 0.006);
      if (k < 0.5) return onEdges(boxes, 0.008);
      const p = lerp3([0, 0, 0], pick(clients), rand());
      return [p[0] + jit(0.015), p[1] + jit(0.015), p[2] + jit(0.015)];
    },
  };
}

// 2: a stack of blocks, and a scan ring passing through one of them.
function stackForm(): Form {
  const h: Vec = [0.9, 0.3, 0.9];
  const blocks: Vec[] = [-0.6, 0.2, 1.0, 1.8].map((y) => [0, y, 0]);
  const edges = blocks.flatMap((c) => boxEdges(c, h));
  const ring = (a: number, r = 1.7): Vec => [Math.cos(a) * r, 1.0, Math.sin(a) * r];
  return {
    nodes: [...blocks.flatMap((c) => corners(c, h)), ...Array.from({ length: 24 }, (_, i) => ring((i / 24) * TAU))],
    body() {
      const k = rand();
      if (k < 0.4) return onEdges(edges);
      if (k < 0.75) return inBox(pick(blocks), h);
      const p = ring(rand() * TAU, k < 0.93 ? 1.7 : Math.sqrt(rand()) * 1.7); // the ring, then the plane inside it
      return [p[0] + jit(0.03), p[1] + jit(0.03), p[2] + jit(0.03)];
    },
  };
}

// 3: a padlock: a box of noise, a shackle over it and a keyhole on the front.
function lockForm(): Form {
  const c: Vec = [0, -0.5, 0];
  const h: Vec = [1.1, 0.85, 0.45];
  const box = boxEdges(c, h);
  const arc = (a: number): Vec => [Math.cos(a) * 0.7, 0.35 + Math.sin(a) * 0.9, 0];
  const hole = (a: number): Vec => [Math.cos(a) * 0.14, -0.3 + Math.sin(a) * 0.14, 0.46];
  return {
    nodes: [
      ...corners(c, h),
      ...Array.from({ length: 16 }, (_, i) => arc((i / 15) * Math.PI)),
      ...Array.from({ length: 8 }, (_, i) => hole((i / 8) * TAU)),
    ],
    body() {
      const k = rand();
      if (k < 0.35) return onEdges(box);
      if (k < 0.6) {
        const p = arc(rand() * Math.PI);
        return [p[0] + jit(0.12), p[1] + jit(0.06), p[2] + jit(0.12)];
      }
      if (k < 0.68) return rand() < 0.6 ? hole(rand() * TAU) : [jit(0.05), -0.3 - rand() * 0.4, 0.46];
      return inBox(c, [1.05, 0.8, 0.4]);
    },
  };
}

// 4: clients on three orbits around a small core.
function orbitForm(): Form {
  const core = lattice([0, 0, 0], 0.25);
  const rings = [0, 1.05, 2.1].map((turn) => (a: number): Vec => {
    const [x, z] = [Math.cos(a) * 2.4, Math.sin(a) * 2.4];
    const [y, z2] = [z * Math.sin(1.1), z * Math.cos(1.1)];
    return [x * Math.cos(turn) - z2 * Math.sin(turn), y, x * Math.sin(turn) + z2 * Math.cos(turn)];
  });
  const clients = rings.flatMap((r, i) => [r(i + 0.6), r(i + 0.6 + Math.PI)]);
  return {
    nodes: [...core.nodes, ...clients],
    body() {
      const k = rand();
      if (k < 0.55) {
        const p = pick(rings)(rand() * TAU);
        return [p[0] + jit(0.02), p[1] + jit(0.02), p[2] + jit(0.02)];
      }
      if (k < 0.7) return inBox(pick(clients), [0.12, 0.12, 0.12]);
      if (k < 0.85) return onEdges(core.lines, 0.006);
      return [jit(12), jit(7), jit(6)];
    },
  };
}

// 5: a bar chart of dust on a gridded floor.
function barsForm(): Form {
  const y0 = -1.5;
  const bars = [0.5, 1.3, 0.9, 2.1, 3.0].map((t, i) => ({ c: [(i - 2) * 0.95, y0 + t / 2, 0] as Vec, h: [0.3, t / 2, 0.3] as Vec }));
  const edges = bars.flatMap((b) => boxEdges(b.c, b.h));
  return {
    nodes: bars.flatMap((b) => corners(b.c, b.h)),
    body() {
      const k = rand();
      if (k < 0.35) return onEdges(edges);
      if (k < 0.75) {
        const b = pick(bars);
        return inBox(b.c, b.h);
      }
      if (k < 0.92) return [jit(5.4), y0, (Math.round(rand() * 4) - 2) * 0.45 + jit(0.02)];
      return [-2.7 + jit(0.02), y0 + rand() * 3.4, jit(0.02)]; // the axis
    },
  };
}

// 6: three buckets: open cylinders, each with a key hanging beside it.
function bucketForm(): Form {
  const xs = [-1.9, 0, 1.9];
  const rim = (x: number, y: number, r: number, a: number): Vec => [x + Math.cos(a) * r, y, Math.sin(a) * r];
  // A bucket narrows toward its base.
  const wall = (x: number, t: number, a: number) => rim(x, 0.9 - t * 1.8, 0.75 - t * 0.2, a);
  const keys: Vec[] = xs.map((x) => [x + 0.95, 1.25, 0]);
  return {
    nodes: [...xs.flatMap((x) => Array.from({ length: 12 }, (_, i) => rim(x, 0.9, 0.75, (i / 12) * TAU))), ...keys],
    body() {
      const k = rand();
      const x = pick(xs);
      if (k < 0.4) return wall(x, rand() < 0.5 ? 0 : 1, rand() * TAU); // rim and base
      if (k < 0.75) return wall(x, rand(), Math.floor(rand() * 16) * (TAU / 16) + jit(0.02)); // staves
      if (k < 0.85) return inBox([x, 0.2, 0], [0.45, 0.6, 0.45]);
      // The key: a ring and a short blade.
      const c = pick(keys);
      const a = rand() * TAU;
      if (rand() < 0.5) return [c[0] + Math.cos(a) * 0.16, c[1] + Math.sin(a) * 0.16, jit(0.02)];
      return [c[0] + jit(0.02), c[1] - 0.16 - rand() * 0.5, jit(0.02)];
    },
  };
}

// 7: a timeline: three solid milestones, and a faint dashed one still to come.
function timelineForm(): Form {
  const h: Vec = [0.35, 0.35, 0.35];
  const y = 0.3;
  const done: Vec[] = [-2.7, -0.9, 0.9].map((x) => [x, y, 0]);
  const doneEdges = done.flatMap((c) => boxEdges(c, h));
  const next: Vec = [2.7, y, 0];
  return {
    nodes: [...done.flatMap((c) => corners(c, h)), ...corners(next, h)],
    body() {
      const k = rand();
      if (k < 0.3) {
        let x = -3.8 + rand() * 7.6;
        if (x > 1.25 && Math.floor(x * 5) % 2) x -= 0.2; // dashed after the last milestone
        return [x, y + jit(0.02), jit(0.02)];
      }
      if (k < 0.6) return onEdges(doneEdges);
      if (k < 0.9) return inBox(pick(done), h);
      return onEdges(boxEdges(next, h), 0.03);
    },
  };
}

// 8: a cross of light, like a flare through glass, inside a faint cube.
function flareForm(): Form {
  const cube = boxEdges([0, 0, 0], [1.1, 1.1, 1.1]);
  return {
    nodes: Array.from({ length: NODES }, (): Vec => [jit(0.15), jit(0.15), jit(0.15)]),
    body() {
      const k = rand();
      const r = Math.sign(rand() - 0.5) * rand() ** 2.2;
      if (k < 0.4) return [r * 13, jit(0.04), jit(0.04)];
      if (k < 0.62) return [jit(0.04), r * 4.5, jit(0.04)];
      if (k < 0.85) return onEdges(cube);
      const g = rand() ** 3 * 0.8;
      const a = rand() * TAU;
      return [Math.cos(a) * g, Math.sin(a) * g, jit(0.3)];
    },
  };
}

function sample(n: number, form: Form) {
  const out = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    const p = (i < NODES ? form.nodes[i % form.nodes.length] : form.body()) as number[];
    out.set([p[0], p[1], p[2], p[3] ?? 0], i * 4);
  }
  return out;
}

const VERT = /* glsl */ `
attribute vec4 pA, pB; // xyz, and w: the motion
attribute vec3 rnd; // seed, size, tint
uniform float uT, uTime, uSize, uMoving, uLens, uRE;
varying float vAlpha, vNode, vTint;

// Where a point is now, and how visible: orbits turn, streams spiral in and fade at both ends.
vec4 flow(vec4 p) {
  if (p.w >= 10.0) return vec4(p.xyz, 1.0); // placed by lens()
  if (p.w > 0.0) {
    float a = uTime * p.w;
    return vec4(cos(a) * p.x - sin(a) * p.z, p.y, sin(a) * p.x + cos(a) * p.z, 1.0);
  }
  if (p.w < 0.0) {
    float f = fract(rnd.x * 7.0 + uTime * 0.07);
    float r = 1.05 + 6.0 * pow(1.0 - f, 0.7); // speeds up as it falls
    float a = atan(p.z, p.x) + f * 3.5;
    return vec4(cos(a) * r, p.y * (1.0 - f), sin(a) * r, smoothstep(0.0, 0.15, f) * smoothstep(1.0, 0.85, f));
  }
  return vec4(p.xyz, 1.0);
}

// The black hole sits at the model's origin; S is its shadow's radius on screen and
// E the Einstein radius, both as angles seen from the camera.
//
// Photon-ring points are drawn on a circle facing the camera just outside the shadow,
// so it reads as a sphere from any angle. It turns, and is brighter on the side
// coming toward you.
//
// A point behind the hole, at angle b from its centre, is seen at the thin-lens image
// (b + sqrt(b^2 + 4 E^2)) / 2: always outside E, so the shadow stays dark and the far
// side of the disk bends up over it. Some points show the fainter second image on
// the other side, kept in a thin band hugging the bottom of the shadow.
vec3 lens(vec3 v, float photon, vec4 pp, out float dim) {
  dim = 1.0;
  vec3 c = (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  float e = uRE / -c.z;
  float sh = 0.9 * e;

  if (photon > 0.0) {
    float a = atan(pp.y, pp.x) + uTime * (pp.w - 10.0);
    float r = length(pp.xy);
    vec3 ring = c + vec3(cos(a), sin(a), 0.0) * sh * -c.z * r;
    float k = photon * uLens;
    dim = mix(1.0, (0.45 + 0.55 * (0.5 + 0.5 * cos(a))) * pow(1.0 / r, 4.0), k);
    return mix(v, ring, k);
  }

  float behind = uLens * smoothstep(0.0, 0.6, c.z - v.z);
  if (behind <= 0.0) return v;
  vec2 u = v.xy / -v.z;
  vec2 uc = c.xy / -c.z;
  vec2 d = u - uc;
  float b = max(length(d), 1e-4);
  float root = sqrt(b * b + 4.0 * e * e);
  bool second = rnd.x < 0.22;
  float img = second ? -(sh + (e - abs(b - root) * 0.5) * 0.4) : (b + root) * 0.5;
  if (second) dim = mix(1.0, 0.75, behind);
  return vec3(mix(v.xy, (uc + d / b * img) * -v.z, behind), v.z);
}

void main() {
  // Each point leaves a little later than the last, and bursts outward on the way.
  float t = smoothstep(0.0, 1.0, clamp((uT - rnd.x * 0.35) / 0.65, 0.0, 1.0));
  vec4 q = mix(flow(pA), flow(pB), t);
  vec3 pos = q.xyz;
  vec3 dir = normalize(vec3(sin(rnd.x * 91.0), cos(rnd.x * 57.0), sin(rnd.x * 23.0)) + 1e-4);
  pos += dir * uMoving * sin(t * 3.14159) * (0.5 + rnd.x * 2.5);
  pos += 0.012 * vec3(sin(uTime * 0.9 + rnd.x * 40.0), cos(uTime * 0.7 + rnd.x * 31.0), sin(uTime * 0.8 + rnd.x * 17.0));

  vNode = step(5.0, rnd.y); // nodes are marked by their size
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float dim;
  float photon = mix(step(10.0, pA.w), step(10.0, pB.w), t);
  mv.xyz = lens(mv.xyz, photon, pA.w >= 10.0 ? pA : pB, dim);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * rnd.y / -mv.z;
  vTint = max(rnd.z, 0.8 * mix(step(pA.w, -0.5), step(pB.w, -0.5), t)); // data streams glow cool
  // Nodes breathe; dust fades with distance.
  vAlpha = smoothstep(28.0, 6.0, -mv.z) * (vNode > 0.5 ? 0.8 + 0.2 * sin(uTime * 2.0 + rnd.x * 30.0) : 0.55) * q.w * dim;
}`;

const FRAG = /* glsl */ `
varying float vAlpha, vNode, vTint;

void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  // Dust is a soft dot; a node is a hot core inside a wide halo.
  float a = vNode > 0.5 ? smoothstep(0.3, 0.05, d) + 0.5 * exp(-d * d * 9.0) : smoothstep(1.0, 0.2, d);
  if (a < 0.01) discard;
  vec3 c = mix(vec3(1.0), vec3(0.62, 0.95, 1.0), vTint); // white, with a few cool glints
  gl_FragColor = vec4(c, a * vAlpha);
}`;

export function createField(canvas: HTMLCanvasElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = innerWidth < 768;
  const N = small ? 9000 : 22000;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.z = 10;

  const material = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: { uMoving: { value: 0 }, uLens: { value: 0 }, uRE: { value: 1 }, uT: { value: 0 }, uTime: { value: 0 }, uSize: { value: 1 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const g = new THREE.BufferGeometry();
  const forms = [holeForm, hubForm, stackForm, lockForm, orbitForm, barsForm, bucketForm, timelineForm, flareForm].map(
    (f) => new THREE.BufferAttribute(sample(N, f()), 4),
  );
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3)); // unused; the forms carry the positions
  const rnd = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) rnd.set([rand(), i < NODES ? 9 : 0.5 + rand() ** 2 * 1.5, rand() < 0.15 ? rand() : 0], i * 3);
  g.setAttribute('rnd', new THREE.BufferAttribute(rnd, 3));
  const form = new THREE.Points(g, material);
  form.frustumCulled = false;
  scene.add(form);

  const sections = [...document.querySelectorAll<HTMLElement>('[data-shape]')];
  const stops: Stop[] = sections.map((el) => ({
    shape: Number(el.dataset.shape),
    x: Number(el.dataset.x ?? 0),
    s: Number(el.dataset.s ?? 1),
  }));
  const counter = document.getElementById('section-counter');

  /** The stops either side of the viewport's middle, how far between them, and the nearer one's index. */
  function where(): [Stop, Stop, number, number] {
    const mid = innerHeight / 2;
    const cs = sections.map((el) => {
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2 - mid;
    });
    if (cs[0] >= 0) return [stops[0], stops[0], 0, 0];
    for (let i = 0; i < cs.length - 1; i++) {
      if (cs[i + 1] > 0) {
        const f = -cs[i] / (cs[i + 1] - cs[i]);
        return [stops[i], stops[i + 1], Math.min(1, Math.max(0, (f - 0.15) / 0.7)), f < 0.5 ? i : i + 1];
      }
    }
    const last = stops.length - 1;
    return [stops[last], stops[last], 0, last];
  }

  let halfW = 1;
  function resize() {
    const dpr = Math.min(devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    // Half the view's width, in world units at the form's depth.
    halfW = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * camera.aspect;
    material.uniforms.uSize.value = 26 * dpr * Math.min(1, innerHeight / 900);
  }
  resize();
  addEventListener('resize', resize);

  const mouse = { x: 0, y: 0 };
  const onMove = (e: PointerEvent) => {
    mouse.x = e.clientX / innerWidth - 0.5;
    mouse.y = e.clientY / innerHeight - 0.5;
  };
  addEventListener('pointermove', onMove);

  const ease = (t: number) => t * t * (3 - 2 * t);
  const pad = (n: number) => String(n).padStart(3, '0');
  const clock = new THREE.Clock();
  let raf = 0;
  let shown = -1;
  function frame() {
    raf = requestAnimationFrame(frame);
    const time = reduced ? 0 : clock.getElapsedTime();
    const [a, b, t, near] = where();
    const u = material.uniforms;
    // Only the two forms in play are bound; the rest wait on the CPU.
    if (g.getAttribute('pA') !== forms[a.shape]) g.setAttribute('pA', forms[a.shape]);
    if (g.getAttribute('pB') !== forms[b.shape]) g.setAttribute('pB', forms[b.shape]);
    u.uMoving.value = a.shape === b.shape ? 0 : 1;
    u.uT.value = t;
    u.uTime.value = time;
    if (counter && near !== shown) counter.textContent = `${pad((shown = near) + 1)} / ${pad(stops.length)}`;

    const e = ease(t);
    // On phones the form sits centred behind the text.
    form.position.x = small ? 0 : (a.x + (b.x - a.x) * e) * halfW;
    form.scale.setScalar((a.s + (b.s - a.s) * e) * (small ? 0.7 : 1));
    // Light bends only around the black hole (form 0).
    u.uLens.value = (a.shape === 0 ? 1 - e : 0) + (b.shape === 0 ? e : 0);
    u.uRE.value = 1.1 * form.scale.x;
    // A three-quarter view that sways a little and leans toward the pointer.
    form.rotation.y += (-0.55 + Math.sin(time * 0.15) * 0.25 + mouse.x * 0.4 - form.rotation.y) * 0.05;
    form.rotation.x += (0.22 + mouse.y * 0.25 - form.rotation.x) * 0.05;

    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.04;
    camera.position.y += (-mouse.y * 0.3 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  frame();

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener('resize', resize);
    removeEventListener('pointermove', onMove);
    g.dispose();
    material.dispose();
    renderer.dispose();
  };
}
