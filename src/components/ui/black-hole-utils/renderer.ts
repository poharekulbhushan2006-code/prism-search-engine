import {
  clock,
  frameLoop,
  surface,
  type Gpu,
  type Surface,
} from 'vgpu';

import {
  createEffects,
  createTargets,
  destroyTargets,
  prewarm,
  renderChain,
  setBindings,
  type Orbit,
} from './pipeline';

export interface RendererOptions {
  canvas: HTMLCanvasElement;
}

export interface RenderSize {
  width: number;
  height: number;
  dpr: number;
}

export function createRenderer(options: RendererOptions) {
  let disposed = false;
  let gpu: Gpu | undefined;
  let canvasSurface: Surface | undefined;
  let effects: ReturnType<typeof createEffects> | undefined;
  let targets: ReturnType<typeof createTargets> | undefined;
  let input: ReturnType<typeof installOrbitInput> | undefined;
  let observer: ResizeObserver | undefined;
  let resizeFrame = 0;
  let pendingSize: RenderSize | undefined;
  let lastDpr = typeof window === 'undefined' ? 1 : window.devicePixelRatio;

  // Fallback state if WebGPU is unsupported
  let fallbackCleanup: (() => void) | undefined;

  const applyResize = () => {
    resizeFrame = 0;
    const size = pendingSize;
    pendingSize = undefined;
    if (disposed || !size || !gpu || !effects || !targets || !canvasSurface) return;

    try {
      const previousTargets = targets;
      const nextTargets = createTargets(gpu, [
        Math.max(1, Math.round(size.width * size.dpr)),
        Math.max(1, Math.round(size.height * size.dpr)),
      ]);

      try {
        setBindings(effects, nextTargets);
      } catch (error) {
        destroyTargets(nextTargets);
        throw error;
      }

      targets = nextTargets;
      destroyTargets(previousTargets);
    } catch (error) {
      fail(error);
    }
  };

  const resize = (size: RenderSize) => {
    if (disposed || size.width <= 0 || size.height <= 0) return;
    pendingSize = size;
    if (!resizeFrame) resizeFrame = requestAnimationFrame(applyResize);
  };

  const measure = () => {
    const rect = options.canvas.getBoundingClientRect();
    resize({
      width: rect.width,
      height: rect.height,
      dpr: Math.min(1.6, Math.max(1, window.devicePixelRatio || 1)),
    });
  };

  const onWindowResize = () => {
    if (window.devicePixelRatio === lastDpr) return;
    lastDpr = window.devicePixelRatio;
    measure();
  };

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    observer?.disconnect();
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', onWindowResize);
    }
    input?.dispose();
    gpu?.dispose();
    fallbackCleanup?.();
  };

  const initialize = async () => {
    // Check for native WebGPU support
    const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator && !!navigator.gpu;

    if (!hasWebGPU) {
      console.info('[BlackHole] WebGPU is not supported in this browser. Activating WebGL fallback.');
      fallbackCleanup = initWebGLFallback(options.canvas);
      return;
    }

    try {
      const { init } = await import('vgpu');
      if (disposed) return;

      const nextGpu = await init();
      if (disposed) {
        nextGpu.dispose();
        return;
      }

      gpu = nextGpu;
      canvasSurface = surface(gpu, options.canvas, { dpr: [1, 1.6] });
      targets = createTargets(gpu, canvasSurface.size);
      effects = createEffects(gpu, targets);
      setBindings(effects, targets);
      await prewarm(effects, targets, canvasSurface);
      if (disposed) return;

      input = installOrbitInput(options.canvas);
      observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
      observer?.observe(options.canvas);
      window.addEventListener('resize', onWindowResize);
      measure();

      const gpuClock = clock(gpu);
      frameLoop(gpu, (currentFrame) => {
        if (disposed || !effects || !targets || !canvasSurface || !input) return;
        effects.scene.set({
          params: { pointer: input.update(), time: gpuClock.time },
        });
        renderChain(currentFrame, effects, targets, canvasSurface);
      });
    } catch (err) {
      console.warn('[BlackHole] WebGPU initialization failed, switching to WebGL fallback:', err);
      if (!disposed) {
        fallbackCleanup = initWebGLFallback(options.canvas);
      }
    }
  };

  function fail(error: unknown): never {
    dispose();
    throw error;
  }

  const ready = initialize().catch((error: unknown) => {
    if (disposed) return;
    fail(error);
  });

  return { ready, resize, dispose };
}

function installOrbitInput(canvas: HTMLCanvasElement) {
  let yaw = 0;
  let pitch = 0.05;
  let targetYaw = 0;
  let targetPitch = 0.05;
  let activePointer: number | undefined;
  const previousTouchAction = canvas.style.touchAction;
  canvas.style.touchAction = 'none';

  const down = (event: PointerEvent) => {
    if (!event.isPrimary || activePointer !== undefined) return;
    activePointer = event.pointerId;
    canvas.setPointerCapture?.(event.pointerId);
  };

  const move = (event: PointerEvent) => {
    if (!event.isPrimary || (activePointer !== undefined && event.pointerId !== activePointer)) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width)),
    );
    const y = Math.max(
      0,
      Math.min(1, (event.clientY - rect.top) / Math.max(1, rect.height)),
    );
    targetYaw = (0.5 - x) * Math.PI * 1.4;
    targetPitch = Math.max(
      -Math.PI * 0.42,
      Math.min(Math.PI * 0.42, (y - 0.5) * Math.PI * 0.7),
    );
  };

  const end = (event: PointerEvent) => {
    if (event.pointerId !== activePointer) return;
    if (canvas.hasPointerCapture?.(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    activePointer = undefined;
  };

  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  return {
    update(): Orbit {
      yaw += (targetYaw - yaw) * 0.12;
      pitch += (targetPitch - pitch) * 0.12;
      return [yaw, pitch];
    },
    dispose() {
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', end);
      canvas.removeEventListener('pointercancel', end);
      if (activePointer !== undefined && canvas.hasPointerCapture?.(activePointer)) {
        canvas.releasePointerCapture(activePointer);
      }
      activePointer = undefined;
      canvas.style.touchAction = previousTouchAction;
    },
  };
}

// Seamless WebGL Fallback for environments without WebGPU
function initWebGLFallback(canvas: HTMLCanvasElement): () => void {
  const gl = canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
  if (!gl) return () => {};

  const vsSource = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fsSource = `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;

    #define PI 3.14159265359

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
      float r = length(uv);
      float a = atan(uv.y, uv.x);

      // Black hole event horizon & photon ring
      float horizon = 0.22;
      float photonRing = smoothstep(0.015, 0.0, abs(r - horizon * 1.35)) * 1.8;
      
      // Accretion disk distortion with relativistic doppler boost
      float diskInner = horizon * 1.25;
      float diskOuter = horizon * 3.8;
      float inDisk = smoothstep(diskInner, diskInner + 0.05, r) * (1.0 - smoothstep(diskOuter - 0.4, diskOuter, r));

      // Gravitational lensing swirl
      float swirl = a + (0.5 / (r + 0.08)) - u_time * 0.8;
      float turb = noise(vec2(r * 12.0 - u_time * 0.5, swirl * 4.0));
      float doppler = 1.0 - uv.x * 1.1; // approaching side brighter

      vec3 diskColor = mix(vec3(0.9, 0.25, 0.05), vec3(1.0, 0.85, 0.4), turb) * inDisk * doppler * 2.2;
      diskColor += vec3(0.4, 0.7, 1.0) * photonRing;

      // Glow & starfield
      float glow = exp(-r * 3.8) * 0.45;
      vec3 col = diskColor + vec3(0.8, 0.4, 0.15) * glow;

      // Starfield background
      if (r > horizon) {
        float star = step(0.996, hash(floor(gl_FragCoord.xy * 0.35)));
        col += vec3(star * 0.8);
      }

      // Event horizon core shadow
      col *= smoothstep(horizon, horizon + 0.012, r);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function createShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return () => {};

  const program = gl.createProgram();
  if (!program) return () => {};
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  const posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,  1, -1, -1,  1,
    -1,  1,  1, -1,  1,  1,
  ]), gl.STATIC_DRAW);

  const posAttr = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(posAttr);
  gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'u_resolution');
  const uTime = gl.getUniformLocation(program, 'u_time');
  const uMouse = gl.getUniformLocation(program, 'u_mouse');

  let animId = 0;
  let startTime = performance.now();
  let mouseX = 0;
  let mouseY = 0;

  const onMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width;
    mouseY = (e.clientY - rect.top) / rect.height;
  };
  canvas.addEventListener('mousemove', onMouseMove);

  function render() {
    if (!gl) return;
    const width = canvas.clientWidth || 300;
    const height = canvas.clientHeight || 150;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }

    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (performance.now() - startTime) * 0.001);
    gl.uniform2f(uMouse, mouseX, mouseY);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    animId = requestAnimationFrame(render);
  }

  animId = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(animId);
    canvas.removeEventListener('mousemove', onMouseMove);
    if (gl) {
      gl.deleteBuffer(posBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    }
  };
}
