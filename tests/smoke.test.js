import { describe, it, expect } from "vitest";
import { carregarQuadern } from "./_load-quadern.js";

describe("carrega quadern.js", () => {
  it("s'executa sense llançar i exposa les funcions globals", () => {
    carregarQuadern();
    expect(typeof window.comentariAlumne).toBe("function");
  });
});
