// Carrega public/quadern.html + quadern.js dins el jsdom del test, exactament
// igual que ho fa app/_components/quadern-prototype.jsx en producció
// (innerHTML + <script> injectat), perquè els tests exerciten el fitxer real
// que s'envia als usuaris, no una còpia adaptada per testejar.
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import vm from "vm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");

// jsdom no implementa el context 2D de <canvas> (cal el paquet natiu "canvas")
// — el codi el fa servir per dibuixar el gràfic d'aranya. Un stub que no fa
// res és suficient per als tests: no verifiquem el dibuix, només la lògica.
function stubCanvasContext() {
  const ctx = new Proxy(
    { measureText: () => ({ width: 0 }) },
    { get: (target, prop) => (prop in target ? target[prop] : () => {}) }
  );
  window.HTMLCanvasElement.prototype.getContext = () => ctx;
}

export function carregarQuadern() {
  document.body.innerHTML = readFileSync(join(PUBLIC_DIR, "quadern.html"), "utf8");
  window.__QUADERN_SUPABASE__ = undefined;
  stubCanvasContext();
  const src = readFileSync(join(PUBLIC_DIR, "quadern.js"), "utf8");
  vm.createContext(window);
  vm.runInContext(src, window, { filename: "quadern.js" });
}
