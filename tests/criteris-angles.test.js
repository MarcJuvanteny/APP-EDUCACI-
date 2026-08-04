import { beforeEach, describe, expect, it } from "vitest";
import { carregarQuadern } from "./_load-quadern.js";

// Regressió: a Anglès el nom de la competència es manté en anglès, però els
// criteris d'avaluació i la rúbrica han de ser en català (2026-08-04).
describe("competències d'Anglès", () => {
  beforeEach(() => {
    carregarQuadern();
  });

  it("el nom de les competències es manté en anglès", () => {
    const noms = window.competenciesByArea.anglesLleng.map((c) => c.nom);
    expect(noms).toContain("Listening");
    expect(noms).toContain("Speaking");
    expect(noms).toContain("Reading");
  });

  it("els criteris i la rúbrica coincideixen amb els de Català (mateix currículum, en català, altra llengua)", () => {
    const catala = window.competenciesByArea.llengues.map((c) => c.criteris);
    const angles = window.competenciesByArea.anglesLleng.map((c) => c.criteris);
    expect(angles).toEqual(catala);
  });
});
