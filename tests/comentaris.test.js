import { beforeEach, describe, expect, it } from "vitest";
import { carregarQuadern } from "./_load-quadern.js";

// Regressió del bug: el comentari general d'un alumne es guardava en un sol
// camp compartit per tot el curs, així que escriure'l a una assignatura el
// feia aparèixer també a les altres (veure conversa del 2026-08-04).
describe("comentari de l'alumne, per assignatura", () => {
  beforeEach(() => {
    carregarQuadern();
  });

  it("un comentari guardat a una assignatura no es veu a una altra", () => {
    const al = { nom: "Marc Roca Bosch", comentaris: {} };
    window.setComentariAlumne(al, "Català", "Ha millorat molt la lectura.");

    expect(window.comentariAlumne(al, "Català")).toBe("Ha millorat molt la lectura.");
    expect(window.comentariAlumne(al, "Anglès")).toBe("");
    expect(window.comentariAlumne(al, "Castellà")).toBe("");
  });

  it("cada assignatura es pot editar independentment", () => {
    const al = { nom: "Marc Roca Bosch", comentaris: {} };
    window.setComentariAlumne(al, "Català", "Comentari de català.");
    window.setComentariAlumne(al, "Anglès", "Comentari d'anglès.");

    expect(window.comentariAlumne(al, "Català")).toBe("Comentari de català.");
    expect(window.comentariAlumne(al, "Anglès")).toBe("Comentari d'anglès.");
  });

  it("un alumne sense comentaris previs retorna cadena buida, no error", () => {
    const al = { nom: "Nou Alumne" };
    expect(window.comentariAlumne(al, "Català")).toBe("");
  });
});
