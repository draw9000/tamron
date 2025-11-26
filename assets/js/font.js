import { Pane } from "https://cdn.skypack.dev/tweakpane@4.0.4";

const config = {
  minWidth: 320,
  maxWidth: 1600,
  minSize: 18,
  maxSize: 24,
  minRatio: 1.2,
  maxRatio: 1.4,
  text: "",
  container: false,
  scale: 1,
  steps: 4,
  palt: true,
  letterSpacing: 0,
  lineHeight: 1.5,
  fontFamily: "Zen Kaku Gothic New",
  fontWeight: 400
};

const ctrl = new Pane({
  title: "Config",
  expanded: true
});

const width = ctrl.addFolder({ title: "Width (px)", expanded: false });
width.addBinding(config, "minWidth", {
  min: 0,
  max: 2000,
  step: 1,
  label: "Min"
});
width.addBinding(config, "maxWidth", {
  min: 0,
  max: 2000,
  step: 1,
  label: "Max"
});
const size = ctrl.addFolder({ title: "Size (px)", expanded: false });
size.addBinding(config, "minSize", { min: 10, max: 30, step: 1, label: "Min" });
size.addBinding(config, "maxSize", { min: 10, max: 30, step: 1, label: "Max" });
const ratio = ctrl.addFolder({ title: "Ratio (px)", expanded: false });
ratio.addBinding(config, "minRatio", {
  min: 1,
  max: 2,
  step: 0.01,
  label: "Min"
});
ratio.addBinding(config, "maxRatio", {
  min: 1,
  max: 2,
  step: 0.01,
  label: "Max"
});
ctrl.addBinding(config, "steps", { label: "Steps", min: 1, max: 10, step: 1 });
ctrl.addBinding(config, "text", { label: "文章" });
ctrl.addBinding(config, "fontFamily", { 
  label: "フォント", 
  options: {
    "Zen Kaku Gothic New": "Zen Kaku Gothic New",
    "Noto Sans JP": "Noto Sans JP", 
    "Noto Serif JP": "Noto Serif JP",
    "M PLUS 1p": "M PLUS 1p"
  }
});
ctrl.addBinding(config, "fontWeight", { 
  label: "太さ (font-weight)", 
  options: {
    "Light (300)": 300,
    "Regular (400)": 400,
    "Medium (500)": 500,
    "Bold (700)": 700
  }
});
ctrl.addBinding(config, "letterSpacing", { 
  label: "字間 (letter-spacing-em)", 
  min: 0.00, 
  max: 0.20, 
  step: 0.01 
});
ctrl.addBinding(config, "lineHeight", { 
  label: "行間 (line-height)", 
  min: 1.00, 
  max: 2.00, 
  step: 0.01 
});
ctrl.addBinding(config, "palt", { label: "文字詰 (palt)" });
ctrl.addBinding(config, "container", { label: "Container Units" });
ctrl.addBinding(config, "scale", {
  label: "Preview Scale",
  min: 0.1,
  max: 1,
  step: 0.01
});

const dl = document.querySelector("dl");

const generateMarkup = () => {
  let markup = "";

  for (let s = config.steps - 1; s > -1; s--)
    markup += `<dt>STEP ${s}</dt><dd class="fluid" style="--font-level: ${s};">${config.text}</dd>`;

  dl.innerHTML = markup;
};

const sync = () => {
  document.documentElement.style.setProperty("--font-size-min", config.minSize);
  document.documentElement.style.setProperty("--font-size-max", config.maxSize);
  document.documentElement.style.setProperty(
    "--font-ratio-min",
    config.minRatio
  );
  document.documentElement.style.setProperty(
    "--font-ratio-max",
    config.maxRatio
  );
  document.documentElement.style.setProperty(
    "--font-width-min",
    config.minWidth
  );
  document.documentElement.style.setProperty(
    "--font-width-max",
    config.maxWidth
  );
  document.documentElement.style.setProperty(
    "--font-palt",
    config.palt ? '"palt"' : 'normal'
  );
  document.documentElement.style.setProperty(
    "--letter-spacing",
    `${config.letterSpacing}em`
  );
  document.documentElement.style.setProperty(
    "--line-height",
    config.lineHeight
  );
  document.documentElement.style.setProperty(
    "--font-family",
    `"${config.fontFamily}", sans-serif`
  );
  document.documentElement.style.setProperty(
    "--font-weight",
    config.fontWeight
  );
  document.documentElement.dataset.container = config.container;
  document.documentElement.style.setProperty("--scale", config.scale);
  // Set the text for the dd values.
  generateMarkup();
};

ctrl.on("change", sync);
sync();

// const config = {
//   width: {
//     min: 320,
//     max: 1500,
//   },
//   size: {
//     min: 17,
//     max: 24,
//   },
//   ratio: {
//     min: 1.2,
//     max: 1.6,
//   },
// }

// const clamps = []

// for (let i = 0; i < 5; i++) {
//   const min = config.size.min * Math.pow(config.ratio.min, i)
//   const max = config.size.max * Math.pow(config.ratio.max, i)

//   const minRem = `${min / 16}rem`
//   const maxRem = `${max / 16}rem`

//   const vi = (max - min) / (config.width.max - config.width.min)

//   const residual = min / 16 - (vi * config.width.min) / 16
//   /**
//    * preferred is: min (px) - (max (px) - min(px) / max width - min width)
//    */
//   const clamp = `clamp(${minRem}, ${residual}rem + ${vi * 100}vi, ${maxRem})`
//   // document.documentElement.style.setProperty(`--step-${i}`, clamp)
//   clamps.push(clamp)
// }
