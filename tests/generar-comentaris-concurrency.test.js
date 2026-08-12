import { describe, expect, it, vi, beforeEach } from "vitest";

// Abans, generar un informe disparava una crida a Claude PER ALUMNE alhora
// (fins a 80, el màxim de schema.js) — amb moltes classes grans generant
// informes a la vegada (p. ex. molts professors la mateixa setmana de
// notes), el pic de crides simultànies contra el compte d'Anthropic es
// disparava molt. Aquest test verifica que ara mai hi ha més de
// CONCURRENCIA_ALUMNES crides en marxa a la vegada dins d'una petició.

vi.mock("../app/lib/supabaseServer.js", () => ({
  getAuthedUser: vi.fn().mockResolvedValue({ id: "PROFESSOR_TEST" }),
}));

let enMarxa = 0;
let picMaxim = 0;
vi.mock("@anthropic-ai/sdk", () => ({
  default: class {
    messages = {
      create: vi.fn().mockImplementation(async () => {
        enMarxa++;
        picMaxim = Math.max(picMaxim, enMarxa);
        await new Promise((r) => setTimeout(r, 15));
        enMarxa--;
        return { content: [{ type: "text", text: "comentari de prova" }] };
      }),
    };
  },
}));

const { POST } = await import("../app/api/generar-comentaris/route.js");

function req(body) {
  return new Request("http://localhost/api/generar-comentaris", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "1.2.3.4" },
    body: JSON.stringify(body),
  });
}

describe("concurrència acotada de crides a Claude", () => {
  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = "test-key";
    enMarxa = 0;
    picMaxim = 0;
  });

  it("amb una classe de 25 alumnes, mai hi ha més de 8 crides simultànies", async () => {
    const alumnes = Array.from({ length: 25 }, (_, i) => ({
      numero: i + 1,
      assignatures: [],
    }));
    const res = await POST(req({ etapa: "trimestre", curs: "3rA", alumnes }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Object.keys(json.comentaris).length).toBe(25);
    expect(picMaxim).toBeLessThanOrEqual(8);
    expect(picMaxim).toBeGreaterThan(1); // segueix sent paral·lel, no seqüencial d'un en un
  });
});
