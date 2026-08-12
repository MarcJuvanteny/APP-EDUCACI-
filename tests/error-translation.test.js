import { beforeEach, describe, expect, it } from "vitest";
import { carregarQuadern } from "./_load-quadern.js";

// Els errors de Supabase/Postgres arriben en anglès i molt tècnics ("JWT
// expired", "duplicate key value violates unique constraint"...) — cap
// professor els entén. traduirErrorSupabase() els tradueix als casos més
// habituals i deixa la resta tal qual (millor un error "estrany" visible
// que amagar-lo darrere una traducció genèrica enganyosa).
describe("traduirErrorSupabase", () => {
  beforeEach(() => {
    carregarQuadern();
  });

  it("tradueix els casos habituals a català clar", () => {
    expect(window.traduirErrorSupabase("Invalid login credentials")).toBe("Correu o contrasenya incorrectes");
    expect(window.traduirErrorSupabase("JWT expired")).toMatch(/sessió ha caducat/i);
    expect(window.traduirErrorSupabase("Failed to fetch")).toMatch(/connectar/i);
    expect(window.traduirErrorSupabase('duplicate key value violates unique constraint "alumnes_pkey"')).toMatch(
      /ja existeix/i
    );
    expect(window.traduirErrorSupabase("new row violates row-level security policy")).toMatch(/no tens permís/i);
  });

  it("deixa tal qual un error no reconegut, en lloc d'amagar-lo", () => {
    const desconegut = "some totally unexpected postgres error XYZ123";
    expect(window.traduirErrorSupabase(desconegut)).toBe(desconegut);
  });

  it("no peta si li passen buit/null", () => {
    expect(window.traduirErrorSupabase("")).toBe("Error desconegut");
    expect(window.traduirErrorSupabase(null)).toBe("Error desconegut");
  });
});
