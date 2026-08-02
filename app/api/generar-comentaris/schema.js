import { z } from "zod";

// Mides maximes generoses per a un professor real (una classe no supera els
// ~30 alumnes ni les competencies/activitats es compten per centenars) pero
// que acoten la mida del payload i evitin que una peticio malformada o
// abusiva dispari crides carissimes (i llargues) a l'API d'Anthropic.
const nota = z.number().min(0).max(10).nullable().optional();

const competenciaSchema = z.object({
  nom: z.string().min(1).max(200),
  mitjana: nota,
  comentarisActivitats: z.array(z.string().max(2000)).max(50).optional().default([]),
});

const trimestreSchema = z.object({
  trimestre: z.string().max(50).optional().default(""),
  mitjana: nota,
  comentariProfessor: z.string().max(5000).optional().default(""),
  competencies: z.array(competenciaSchema).max(30).optional().default([]),
});

const assignaturaSchema = z.object({
  nom: z.string().min(1).max(200),
  trimestres: z.array(trimestreSchema).min(1).max(3),
});

const alumneSchema = z.object({
  numero: z.number().int().min(1).max(999),
  global: nota,
  assignatures: z.array(assignaturaSchema).max(30),
});

const classeSchema = z
  .object({
    mitjana: nota,
    subjectes: z.array(z.object({ nom: z.string().max(200), mitjana: nota })).max(30),
    alumnesResum: z.array(z.object({ numero: z.number().int(), global: nota })).max(80),
  })
  .nullable()
  .optional();

export const generarComentarisSchema = z.object({
  etapa: z.enum(["trimestre", "curs"]),
  curs: z.string().max(100).optional().default(""),
  mode: z.enum(["curt", "llarg"]).optional().default("curt"),
  classe: classeSchema,
  alumnes: z.array(alumneSchema).min(1).max(80),
});
