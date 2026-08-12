import { beforeEach, describe, expect, it } from "vitest";
import { carregarQuadern } from "./_load-quadern.js";

// Regressió del bug: supabase-js MAI rebutja la promesa per un error de
// consulta (RLS, columna inexistent...) — sempre la resol amb {error:{...}}.
// Un simple .catch() no el detecta i l'usuari es queda creient que s'ha
// guardat quan no és cert. dbEscriu() ha de detectar-ho sempre.
describe("dbEscriu", () => {
  beforeEach(() => {
    carregarQuadern();
  });

  it("resol a true quan la consulta no té error", async () => {
    const ok = await window.dbEscriu(Promise.resolve({ error: null, data: {} }), "Error de prova");
    expect(ok).toBe(true);
  });

  it("resol a false i mostra un toast quan supabase-js resol amb {error} (no rebutja)", async () => {
    // Missatge triat expressament perque NO coincideixi amb cap traducció
    // coneguda de traduirErrorSupabase() — aquest test verifica que dbEscriu
    // detecta {error} i el mostra, no com es tradueix el text (això té el
    // seu propi test a error-translation.test.js).
    const ok = await window.dbEscriu(
      Promise.resolve({ error: { message: "column foo does not exist" } }),
      "Error guardant el perfil"
    );
    expect(ok).toBe(false);
    const toasts = Array.from(document.querySelectorAll(".toast")).map((t) => t.textContent);
    expect(toasts.some((t) => t.includes("Error guardant el perfil") && t.includes("column foo does not exist"))).toBe(true);
  });

  it("resol a false i mostra un toast quan la promesa es rebutja (error de xarxa)", async () => {
    const ok = await window.dbEscriu(Promise.reject(new Error("network down")), "Error guardant");
    expect(ok).toBe(false);
    const toasts = Array.from(document.querySelectorAll(".toast")).map((t) => t.textContent);
    expect(toasts.some((t) => t.includes("network down"))).toBe(true);
  });
});
