const themeMedia = window.matchMedia("(prefers-color-scheme: light)");

const themePresets = {
  dark: {
    background: "#080808",
    idleGray: "#55555d",
    palette: [
      { type: "solid", value: "#22c55e" },
      { type: "solid", value: "#06b6d4" },
      { type: "solid", value: "#f97316" },
      { type: "solid", value: "#ef4444" },
      { type: "solid", value: "#facc15" },
      { type: "solid", value: "#ec4899" },
      { type: "solid", value: "#9ca3af" },
      { type: "solid", value: "#a78bfa" },
      { type: "solid", value: "#60a5fa" },
      { type: "solid", value: "#34d399" },
      { type: "gradient", stops: ["#6366f1", "#3b82f6"] },
      { type: "gradient", stops: ["#06b6d4", "#6366f1"] },
      { type: "gradient", stops: ["#22c55e", "#06b6d4"] },
      { type: "gradient", stops: ["#f97316", "#ef4444"] },
      { type: "gradient", stops: ["#8b5cf6", "#06b6d4"] },
      { type: "gradient", stops: ["#3b82f6", "#8b5cf6"] },
      { type: "gradient", stops: ["#34d399", "#3b82f6"] },
    ],
  },
  light: {
    background: "#ffffff",
    idleGray: "#b8b1a8",
    palette: [
      { type: "solid", value: "#22c55e" },
      { type: "solid", value: "#06b6d4" },
      { type: "solid", value: "#f97316" },
      { type: "solid", value: "#ef4444" },
      { type: "solid", value: "#ca8a04" },
      { type: "solid", value: "#ec4899" },
      { type: "solid", value: "#64748b" },
      { type: "solid", value: "#a78bfa" },
      { type: "solid", value: "#60a5fa" },
      { type: "solid", value: "#34d399" },
      { type: "gradient", stops: ["#6366f1", "#3b82f6"] },
      { type: "gradient", stops: ["#06b6d4", "#6366f1"] },
      { type: "gradient", stops: ["#22c55e", "#06b6d4"] },
      { type: "gradient", stops: ["#f97316", "#ef4444"] },
      { type: "gradient", stops: ["#8b5cf6", "#06b6d4"] },
      { type: "gradient", stops: ["#3b82f6", "#8b5cf6"] },
      { type: "gradient", stops: ["#34d399", "#3b82f6"] },
    ],
  },
};

const sharedConfig = {
  layout: {
    gap: 40,
    shapeSize: 0.38,
  },
  interaction: {
    radiusVmin: 30,
    activityDecay: 0.93,
  },
  animation: {
    speedIn: 0.5,
    speedOut: 0.6,
    restScale: 0.09,
    minHoverScale: 1,
    maxHoverScale: 3,
  },
  idleFlash: {
    resumeDelay: 2000,
    strength: 0.78,
    pauseMin: 520,
    pauseMax: 1400,
    burstMin: 1,
    burstMax: 3,
    durationMin: 760,
    durationMax: 1080,
    staggerMin: 140,
    staggerMax: 260,
  },
  shapes: {
    circles: true,
    pills: true,
    stars: true,
    starPointsMin: 4,
    starPointsMax: 10,
    starInnerRatioMin: 0.1,
    starInnerRatioMax: 0.5,
  },
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const random = (min, max) => Math.random() * (max - min) + min;
const randomInt = (min, max) => Math.floor(random(min, max + 1));
const pick = (list) => list[Math.floor(Math.random() * list.length)];

const clonePalette = (palette) =>
  palette.map((entry) =>
    entry.type === "gradient"
      ? { type: "gradient", stops: [...entry.stops] }
      : { ...entry }
  );

const getThemeColors = () => {
  const preset = themeMedia.matches ? themePresets.light : themePresets.dark;
  return {
    background: preset.background,
    idleGray: preset.idleGray,
    palette: clonePalette(preset.palette),
  };
};

const getAvailableTypes = (config) => {
  const types = [];
  if (config.shapes.circles) types.push("circle");
  if (config.shapes.pills) types.push("pill");
  if (config.shapes.stars) types.push("star", "star");
  return types.length ? types : ["circle"];
};

const parseColor = (value) => {
  if (value.startsWith("#")) {
    const hex = value.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
      };
    }

    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  const match = value.match(/\d+/g);
  if (!match || match.length < 3) {
    return { r: 255, g: 255, b: 255 };
  }

  return {
    r: Number(match[0]),
    g: Number(match[1]),
    b: Number(match[2]),
  };
};

const mixColor = (from, to, amount) => {
  const t = clamp(amount, 0, 1);
  const start = parseColor(from);
  const end = parseColor(to);
  const r = Math.round(start.r + (end.r - start.r) * t);
  const g = Math.round(start.g + (end.g - start.g) * t);
  const b = Math.round(start.b + (end.b - start.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
};

const smoothstep = (value) => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

const perFrameRate = (seconds) => {
  if (seconds <= 0) {
    return 1;
  }
  return 1 - 0.05 ** (1 / (60 * seconds));
};

const drawCircle = (ctx, radius) => {
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
};

const drawPill = (ctx, size) => {
  const halfWidth = size * 0.48;
  const halfHeight = size;
  ctx.beginPath();
  ctx.roundRect(-halfWidth, -halfHeight, halfWidth * 2, halfHeight * 2, halfWidth);
  ctx.fill();
};

const drawStar = (ctx, outerRadius, points, innerRatio) => {
  ctx.beginPath();
  for (let index = 0; index < points * 2; index += 1) {
    const angle = (index * Math.PI) / points - Math.PI / 2;
    const radius = index % 2 === 0 ? outerRadius : outerRadius * innerRatio;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fill();
};

const drawShape = (ctx, shape) => {
  switch (shape.type) {
    case "circle":
      drawCircle(ctx, shape.size / 1.5);
      break;
    case "pill":
      drawPill(ctx, shape.size / 1.4);
      break;
    case "star":
      drawStar(ctx, shape.size, shape.points, shape.innerRatio);
      break;
  }
};

const makeFill = (ctx, idleGray, color, size, mixAmount) => {
  if (color.type === "solid") {
    return mixColor(idleGray, color.value, mixAmount);
  }

  const gradient = ctx.createRadialGradient(0, -size * 0.3, 0, 0, size * 0.3, size * 1.5);
  gradient.addColorStop(0, mixColor(idleGray, color.stops[0], mixAmount));
  gradient.addColorStop(1, mixColor(idleGray, color.stops[1], mixAmount));
  return gradient;
};

const randomStarShape = (config) => ({
  points: randomInt(config.shapes.starPointsMin, config.shapes.starPointsMax),
  innerRatio: random(config.shapes.starInnerRatioMin, config.shapes.starInnerRatioMax),
});

const createShape = ({ x, y, type, color, config }) => {
  const shape = {
    x,
    y,
    type,
    color,
    angle: random(0, Math.PI * 2),
    size: config.layout.gap * config.layout.shapeSize,
    scale: config.animation.restScale,
    maxScale: random(config.animation.minHoverScale, config.animation.maxHoverScale),
    hovered: false,
  };

  if (type === "star") {
    Object.assign(shape, randomStarShape(config));
  }

  return shape;
};

const toLocalRect = (rect, canvasRect) => ({
  left: rect.left - canvasRect.left,
  right: rect.right - canvasRect.left,
  top: rect.top - canvasRect.top,
  bottom: rect.bottom - canvasRect.top,
});

const expandRect = (rect, paddingX, paddingY) => ({
  left: rect.left - paddingX,
  right: rect.right + paddingX,
  top: rect.top - paddingY,
  bottom: rect.bottom + paddingY,
});

const getLineRects = (element) => {
  const range = document.createRange();
  range.selectNodeContents(element);
  const rects = Array.from(range.getClientRects()).filter(
    (rect) => rect.width && rect.height
  );

  if (typeof range.detach === "function") {
    range.detach();
  }

  if (!rects.length) {
    return [];
  }

  rects.sort((a, b) => a.top - b.top || a.left - b.left);

  const mergedRects = [];
  for (const rect of rects) {
    const lastRect = mergedRects[mergedRects.length - 1];
    if (
      lastRect &&
      Math.abs(rect.top - lastRect.top) < 2 &&
      Math.abs(rect.bottom - lastRect.bottom) < 2
    ) {
      lastRect.left = Math.min(lastRect.left, rect.left);
      lastRect.right = Math.max(lastRect.right, rect.right);
      lastRect.top = Math.min(lastRect.top, rect.top);
      lastRect.bottom = Math.max(lastRect.bottom, rect.bottom);
      continue;
    }

    mergedRects.push({
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
    });
  }

  return mergedRects;
};

const buildFullScreenShapes = ({
  sceneRoot,
  canvas,
  width,
  height,
  config,
  palette,
}) => {
  const gap = config.layout.gap;
  const availableTypes = getAvailableTypes(config);
  const canvasRect = canvas.getBoundingClientRect();
  const exclusionRects = [];

  for (const element of sceneRoot.querySelectorAll("[data-grid-exclude]")) {
    const isNavElement = element.closest(".site-nav") !== null;
    const paddingX = isNavElement ? 20 : 48;
    const paddingY = isNavElement ? 16 : 28;

    if (element.classList.contains("overlay-text") && !isNavElement) {
      const lineRects = getLineRects(element);
      exclusionRects.push(
        ...lineRects.map((rect) =>
          expandRect(toLocalRect(rect, canvasRect), paddingX, paddingY)
        )
      );
      continue;
    }

    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      continue;
    }

    exclusionRects.push(
      expandRect(toLocalRect(rect, canvasRect), paddingX, paddingY)
    );
  }

  const columns = Math.floor(width / gap);
  const rows = Math.floor(height / gap);
  const offsetX = (width - (columns - 1) * gap) / 2;
  const offsetY = (height - (rows - 1) * gap) / 2;
  const shapes = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = offsetX + column * gap;
      const y = offsetY + row * gap;

      if (
        exclusionRects.some(
          (rect) =>
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        )
      ) {
        continue;
      }

      shapes.push(
        createShape({
          x,
          y,
          type: pick(availableTypes),
          color: pick(palette),
          config,
        })
      );
    }
  }

  return shapes;
};

const buildDecorativeShapes = ({
  sceneRoot,
  width,
  height,
  config,
  palette,
}) => {
  const gap = config.layout.gap;
  const availableTypes = getAvailableTypes(config);
  const label = sceneRoot.querySelector(".decorative-dot-label__text");
  const rootRect = sceneRoot.getBoundingClientRect();
  const labelRect = label?.getBoundingClientRect();
  const labelWidth = labelRect?.width || 0;
  const labelLeft = labelRect ? labelRect.left - rootRect.left : 0;
  const labelGap = gap * 0.75;
  const horizontalInset = gap * 0.5;
  const verticalInset = Math.min(height * 0.18, gap * 1.1);
  const rows = 4;
  const rowStep = rows > 1 ? (height - verticalInset * 2) / (rows - 1) : 0;
  const lastRowY = verticalInset + rowStep * (rows - 1);
  const shapes = [];

  sceneRoot.style.setProperty("--label-top", `${Math.round(lastRowY)}px`);

  // Rows 1-3 span the full width. Row 4 leaves room for the label on the left.
  for (let row = 0; row < rows; row += 1) {
    const y = verticalInset + rowStep * row;
    const startX =
      row === rows - 1
        ? Math.max(horizontalInset, labelLeft + labelWidth + labelGap)
        : horizontalInset;

    for (let x = startX; x <= width - horizontalInset; x += gap) {
      shapes.push(
        createShape({
          x,
          y,
          type: pick(availableTypes),
          color: pick(palette),
          config,
        })
      );
    }
  }

  return shapes;
};

const mountGridSurface = ({
  sceneRoot,
  surface,
  canvas,
  fallback,
  buildShapes,
}) => {
  const context = canvas.getContext("2d");
  if (!context) {
    canvas.remove();
    fallback.style.display = "grid";
    return;
  }

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    shapes: [],
    pointer: null,
    activity: 0,
    raf: 0,
    theme: getThemeColors(),
    idleFlash: {
      entries: [],
      nextAt: 0,
      lastHoverAt: 0,
    },
  };

  const scheduleNextIdleFlash = (now) => {
    state.idleFlash.entries = [];
    state.idleFlash.nextAt =
      now + random(sharedConfig.idleFlash.pauseMin, sharedConfig.idleFlash.pauseMax);
  };

  const startIdleFlash = (now) => {
    if (!state.shapes.length) {
      return;
    }

    const burstCount = Math.min(
      randomInt(sharedConfig.idleFlash.burstMin, sharedConfig.idleFlash.burstMax),
      state.shapes.length
    );
    const chosen = new Set();
    const entries = [];
    const baseDuration = random(
      sharedConfig.idleFlash.durationMin,
      sharedConfig.idleFlash.durationMax
    );
    let accumulatedDelay = 0;

    while (chosen.size < burstCount) {
      chosen.add(randomInt(0, state.shapes.length - 1));
    }

    for (const index of chosen) {
      entries.push({
        index,
        startTime: now + accumulatedDelay,
        duration: baseDuration + random(-90, 120),
      });
      accumulatedDelay += random(
        sharedConfig.idleFlash.staggerMin,
        sharedConfig.idleFlash.staggerMax
      );
    }

    state.idleFlash.entries = entries;
  };

  const resize = () => {
    const rect = surface.getBoundingClientRect();
    state.width = Math.round(rect.width);
    state.height = Math.round(rect.height);
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(state.width * state.dpr);
    canvas.height = Math.round(state.height * state.dpr);
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(state.dpr, state.dpr);

    state.shapes = buildShapes({
      sceneRoot,
      surface,
      canvas,
      width: state.width,
      height: state.height,
      config: sharedConfig,
      palette: state.theme.palette,
    });
  };

  const applyTheme = () => {
    state.theme = getThemeColors();
    resize();
    state.idleFlash.lastHoverAt = performance.now();
    scheduleNextIdleFlash(state.idleFlash.lastHoverAt);
  };

  const setPointer = (event) => {
    const rect = canvas.getBoundingClientRect();
    state.pointer = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    state.activity = 1;
  };

  const clearPointer = () => {
    state.pointer = null;
  };

  const render = () => {
    const now = performance.now();
    const hoverRadius =
      (sharedConfig.interaction.radiusVmin / 100) *
      Math.min(state.width, state.height);

    context.clearRect(0, 0, state.width, state.height);
    context.fillStyle = state.theme.background;
    context.fillRect(0, 0, state.width, state.height);

    state.activity *= sharedConfig.interaction.activityDecay;

    const hadIdleEntries = state.idleFlash.entries.length > 0;
    state.idleFlash.entries = state.idleFlash.entries.filter(
      (entry) => now < entry.startTime + entry.duration
    );

    let anyRealHoverActive = false;

    for (let index = 0; index < state.shapes.length; index += 1) {
      const shape = state.shapes[index];
      let hoverActivity = 0;

      if (state.pointer && state.activity > 0.001) {
        const dx = shape.x - state.pointer.x;
        const dy = shape.y - state.pointer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        hoverActivity =
          smoothstep(1 - distance / hoverRadius) * state.activity;

        if (hoverActivity > 0.05) {
          anyRealHoverActive = true;
        }

        if (hoverActivity > 0.05 && !shape.hovered) {
          shape.hovered = true;
          shape.maxScale = random(
            sharedConfig.animation.minHoverScale,
            sharedConfig.animation.maxHoverScale
          );
          shape.angle = random(0, Math.PI * 2);
          if (shape.type === "star") {
            Object.assign(shape, randomStarShape(sharedConfig));
          }
        } else if (hoverActivity <= 0.05) {
          shape.hovered = false;
        }
      } else {
        shape.hovered = false;
      }

      let idleFlashAmount = 0;
      for (const entry of state.idleFlash.entries) {
        if (entry.index !== index || now < entry.startTime) {
          continue;
        }

        const t = clamp((now - entry.startTime) / entry.duration, 0, 1);
        idleFlashAmount = Math.max(
          idleFlashAmount,
          Math.sin(Math.PI * t) * sharedConfig.idleFlash.strength
        );
      }

      const hoverTarget =
        sharedConfig.animation.restScale +
        hoverActivity * (shape.maxScale - sharedConfig.animation.restScale);
      const idleTarget =
        sharedConfig.animation.restScale +
        idleFlashAmount * (shape.maxScale - sharedConfig.animation.restScale);
      const targetScale = Math.max(hoverTarget, idleTarget);
      const lerpRate =
        targetScale > shape.scale
          ? perFrameRate(sharedConfig.animation.speedIn)
          : perFrameRate(sharedConfig.animation.speedOut);

      shape.scale += (targetScale - shape.scale) * lerpRate;

      if (shape.scale < sharedConfig.animation.restScale * 0.15) {
        continue;
      }

      const interactiveMix = clamp(hoverActivity * 1.8, 0, 1);
      const idleMix = clamp(idleFlashAmount * 1.1, 0, 1);
      const colorMix = Math.max(interactiveMix, idleMix);

      context.save();
      context.translate(shape.x, shape.y);
      context.rotate(shape.angle);
      context.scale(shape.scale, shape.scale);
      context.fillStyle = makeFill(
        context,
        state.theme.idleGray,
        shape.color,
        shape.size,
        colorMix
      );
      drawShape(context, shape);
      context.restore();
    }

    if (anyRealHoverActive) {
      state.idleFlash.lastHoverAt = now;
      scheduleNextIdleFlash(now);
    } else if (
      now - state.idleFlash.lastHoverAt >= sharedConfig.idleFlash.resumeDelay
    ) {
      if (hadIdleEntries && state.idleFlash.entries.length === 0) {
        scheduleNextIdleFlash(now);
      } else if (
        state.idleFlash.entries.length === 0 &&
        now >= state.idleFlash.nextAt
      ) {
        startIdleFlash(now);
      }
    }

    state.raf = requestAnimationFrame(render);
  };

  resize();
  state.idleFlash.lastHoverAt = performance.now();
  scheduleNextIdleFlash(state.idleFlash.lastHoverAt);
  state.raf = requestAnimationFrame(render);

  window.addEventListener("resize", resize);
  canvas.addEventListener("pointermove", setPointer);
  canvas.addEventListener("pointerenter", setPointer);
  canvas.addEventListener("pointerleave", clearPointer);

  if (typeof themeMedia.addEventListener === "function") {
    themeMedia.addEventListener("change", applyTheme);
  } else if (typeof themeMedia.addListener === "function") {
    themeMedia.addListener(applyTheme);
  }
};

const syncHeroHeight = () => {
  document.documentElement.style.setProperty("--hero-height", `${window.innerHeight}px`);
};

syncHeroHeight();
window.addEventListener("resize", syncHeroHeight);

const hero = document.querySelector(".hero");
const heroStage = hero?.querySelector(".hero-stage");
const heroCanvas = document.getElementById("grid");
const heroFallback = heroStage?.querySelector(".fallback");

if (hero && heroStage && heroCanvas && heroFallback) {
  mountGridSurface({
    sceneRoot: hero,
    surface: heroStage,
    canvas: heroCanvas,
    fallback: heroFallback,
    buildShapes: buildFullScreenShapes,
  });
}

const decorative = document.querySelector("[data-dot-label]");
const decorativeCanvas = decorative?.querySelector(".decorative-dot-label__canvas");
const decorativeFallback = decorative?.querySelector(".decorative-dot-label__fallback");

if (decorative && decorativeCanvas && decorativeFallback) {
  mountGridSurface({
    sceneRoot: decorative,
    surface: decorative,
    canvas: decorativeCanvas,
    fallback: decorativeFallback,
    buildShapes: buildDecorativeShapes,
  });
}
