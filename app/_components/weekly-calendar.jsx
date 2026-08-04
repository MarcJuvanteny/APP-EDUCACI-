"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import "../programacio/programacio-calendari.css";
import { createSupabaseClient } from "../lib/supabaseClient";

const DIES = ["Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres"];
const DIES_ABREUJATS = ["Dl", "Dm", "Dc", "Dj", "Dv"];
const MESOS = [
  "gener",
  "febrer",
  "març",
  "abril",
  "maig",
  "juny",
  "juliol",
  "agost",
  "setembre",
  "octubre",
  "novembre",
  "desembre",
];
// Franges de mitja hora, de 8:00 a 17:00.
function formatMin(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h + ":" + String(m).padStart(2, "0");
}
const HORES = Array.from({ length: (1020 - 480) / 30 }).map((_, idx) => {
  const min = 480 + idx * 30;
  return { label: formatMin(min), end: formatMin(min + 30), idx, min };
});
const COLORS = {
  clay: "#B5562F",
  moss: "#566B47",
  honey: "#B98627",
  sky: "#3C6B82",
  plum: "#6B4A6E",
  gray: "#8b8371",
};
// Variants pastel (mateixa paleta que quadern.css --*-l) per a les activitats creades.
const COLORS_LIGHT = {
  clay: "#FBEAE0",
  moss: "#EAEFE3",
  honey: "#FBF1DE",
  sky: "#E6EFF2",
  plum: "#F1E8F1",
  gray: "#EDE7DB",
};
const PALETA_CURSOS = ["clay", "moss", "honey", "sky", "plum"];
// Construeix el mapa curs->color a partir dels cursos que realment apareixen als
// events carregats (ordenats alfabeticament perque l'assignacio sigui estable
// entre recarregues), garantint que cada curs real te un color diferent mentre
// no n'hi hagi mes de 5 alhora — "General" sempre es gris, fora de la paleta.
function calcularCursColorMap(events) {
  const cursos = Array.from(
    new Set(events.map((ev) => ev.curs).filter((c) => c && c !== "General"))
  ).sort();
  const map = {};
  cursos.forEach((c, i) => {
    map[c] = PALETA_CURSOS[i % PALETA_CURSOS.length];
  });
  return map;
}
function corPerCurs(curs, cursColorMap) {
  if (!curs || curs === "General") return "gray";
  return (cursColorMap && cursColorMap[curs]) || "gray";
}
// Estil d'una targeta d'event: pastel per a activitats creades a Competències,
// blanc amb vora i lletres del color del curs per als esdeveniments manuals.
function estilEvent(ev, cursColorMap) {
  const key = corPerCurs(ev.curs, cursColorMap);
  const solid = COLORS[key];
  const light = COLORS_LIGHT[key];
  if (ev.creatPelProfessor) {
    return { background: "#fff", color: solid, border: "1.5px solid " + solid };
  }
  return { background: light, color: solid, border: "1px solid " + solid + "55" };
}

const EVENTS_INICIALS = [
  {
    id: 1,
    dia: 0,
    hora: 0,
    curs: "3r A",
    tipus: "clay",
    nota: 'Activitat: conte "El Petit Príncep". Preguntes orals.',
  },
  {
    id: 2,
    dia: 0,
    hora: 1,
    curs: "4t B",
    tipus: "clay",
    nota: "Redacció lliure. Mínim 10 línies.",
  },
  {
    id: 3,
    dia: 0,
    hora: 2,
    curs: "3r B",
    tipus: "sky",
    nota: "P. 70-71. Fraccions.",
  },
  {
    id: 4,
    dia: 0,
    hora: 6,
    curs: "General",
    tipus: "honey",
    nota: "Sala de professors. Tema: avaluació T2.",
  },
  {
    id: 5,
    dia: 1,
    hora: 0,
    curs: "4t A",
    tipus: "moss",
    nota: "Text preparat. Recordar portar el full.",
  },
  {
    id: 6,
    dia: 1,
    hora: 1,
    curs: "3r A",
    tipus: "clay",
    nota: "Pàgina 45. Torn de 3 alumnes.",
  },
  {
    id: 7,
    dia: 1,
    hora: 2,
    curs: "5e A",
    tipus: "plum",
    nota: "Comentari poema Verdaguer.",
  },
  {
    id: 8,
    dia: 2,
    hora: 0,
    curs: "3r B",
    tipus: "clay",
    nota: 'Presentació: "El meu animal preferit"',
  },
  {
    id: 9,
    dia: 2,
    hora: 1,
    curs: "4t B",
    tipus: "moss",
    nota: "Recordar fotocòpies! Pàg. 66-80.",
  },
  {
    id: 10,
    dia: 2,
    hora: 3,
    curs: "General",
    tipus: "gray",
    nota: "Guàrdia pati",
  },
  {
    id: 11,
    dia: 3,
    hora: 0,
    curs: "5e A",
    tipus: "clay",
    nota: 'Text "Viatge Inoblidable". P.149.',
  },
  {
    id: 12,
    dia: 3,
    hora: 1,
    curs: "3r A",
    tipus: "honey",
    nota: "Fer retorn individual.",
  },
  {
    id: 13,
    dia: 3,
    hora: 2,
    curs: "4t A",
    tipus: "sky",
    nota: "Geometria plana.",
  },
  {
    id: 14,
    dia: 4,
    hora: 0,
    curs: "3r B",
    tipus: "plum",
    nota: "Últim dia per entregar poema.",
  },
  {
    id: 15,
    dia: 4,
    hora: 1,
    curs: "5e A",
    tipus: "moss",
    nota: "Ídem 4t A del dimarts.",
  },
  {
    id: 16,
    dia: 4,
    hora: 6,
    curs: "4t B",
    tipus: "plum",
    nota: "Taller creativitat",
  },
];

const CURSOS = ["3r A", "3r B", "4t A", "4t B", "5e A", "General"];

function escHtmlPdf(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function truncarComentari(text, max) {
  const t = text || "";
  return t.length > max ? t.slice(0, max) + "..." : t;
}

function rowToEvent(row) {
  return {
    id: row.id,
    dbId: row.id,
    dia: row.dia_setmana,
    hora: row.franja_hora,
    curs: row.curs_nom || "",
    tipus: row.tipus || "clay",
    // Files antigues (abans que el formulari nomes tingues "nota") poden tenir
    // el text a "titol" i "nota" buida — si encara no s'ha executat el backfill
    // (supabase/backfill_legacy_data.sql), que no es vegi l'event en blanc.
    nota: row.nota || row.titol || "",
    data: row.data || null,
    creatPelProfessor: row.origen === "manual",
    origen: row.origen,
  };
}

function startOfWeek(date) {
  const d = new Date(date);
  const dow = d.getDay() === 0 ? 7 : d.getDay();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - dow + 1);
  return d;
}

function getWeekNum(d) {
  const jan1 = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
}

export default function WeeklyCalendar() {
  const [supabase] = useState(() => createSupabaseClient());
  const [professorId, setProfessorId] = useState(null);
  const [offset, setOffset] = useState(0);
  const [events, setEvents] = useState(EVENTS_INICIALS);
  const [nextId, setNextId] = useState(100);
  const [evSel, setEvSel] = useState(null);
  const [showNou, setShowNou] = useState(false);
  const [showDet, setShowDet] = useState(false);
  const [toast, setToast] = useState("");
  const [nowTick, setNowTick] = useState(Date.now());
  // La posicio de la linia de "ara" depen de l'hora exacta del navegador i
  // sempre sera diferent entre el render del servidor i el primer render del
  // client (encara que sigui per pocs mil·lisegons) — es renderitza nomes
  // despres de muntar per evitar el mismatch d'hidratacio de React.
  const [muntat, setMuntat] = useState(false);
  useEffect(() => { setMuntat(true); }, []);

  const [nvDia, setNvDia] = useState(0);
  const [nvHora, setNvHora] = useState(0);
  const [nvCurs, setNvCurs] = useState("3r A");
  const [nvNota, setNvNota] = useState("");
  // false = nomes aquesta data concreta (per defecte — es el que s'espera en
  // clicar un dia amb data visible a la graella). true = es repeteix cada
  // setmana (horari fix), com abans.
  const [nvRepetir, setNvRepetir] = useState(false);

  const avui = useMemo(() => new Date(), [nowTick]);
  const base = useMemo(() => startOfWeek(avui), [avui]);

  const iniciSetmana = useMemo(() => {
    const b = new Date(base);
    b.setDate(b.getDate() + offset * 7);
    return b;
  }, [base, offset]);

  const fiSetmana = useMemo(() => {
    const f = new Date(iniciSetmana);
    f.setDate(f.getDate() + 4);
    return f;
  }, [iniciSetmana]);

  const diesSetmana = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => {
      const d = new Date(iniciSetmana);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [iniciSetmana]);

  const weekLabel = useMemo(() => {
    return "Setmana " + getWeekNum(iniciSetmana);
  }, [iniciSetmana]);

  const weekSub = useMemo(() => {
    let txt = iniciSetmana.getDate().toString();
    if (iniciSetmana.getMonth() !== fiSetmana.getMonth()) {
      txt += " " + MESOS[iniciSetmana.getMonth()];
    }
    txt +=
      " – " +
      fiSetmana.getDate() +
      " de " +
      MESOS[fiSetmana.getMonth()] +
      " " +
      fiSetmana.getFullYear();
    return txt;
  }, [iniciSetmana, fiSetmana]);

  const schoolData = useMemo(() => {
    const ara = new Date(nowTick);
    const anyInici = ara.getMonth() >= 8 ? ara.getFullYear() : ara.getFullYear() - 1;
    const anyFi = anyInici + 1;
    const mesos = [
      { nom: "Setembre", m: 8, y: anyInici },
      { nom: "Octubre", m: 9, y: anyInici },
      { nom: "Novembre", m: 10, y: anyInici },
      { nom: "Desembre", m: 11, y: anyInici },
      { nom: "Gener", m: 0, y: anyFi },
      { nom: "Febrer", m: 1, y: anyFi },
      { nom: "Març", m: 2, y: anyFi },
      { nom: "Abril", m: 3, y: anyFi },
      { nom: "Maig", m: 4, y: anyFi },
      { nom: "Juny", m: 5, y: anyFi },
      { nom: "Juliol", m: 6, y: anyFi },
      { nom: "Agost", m: 7, y: anyFi },
    ];
    return { anyInici, anyFi, mesos };
  }, [nowTick]);

  const mesActiuIdx = useMemo(() => {
    const m = iniciSetmana.getMonth();
    const y = iniciSetmana.getFullYear();
    return schoolData.mesos.findIndex((x) => x.m === m && x.y === y);
  }, [iniciSetmana, schoolData]);

  const cursColorMap = useMemo(() => calcularCursColorMap(events), [events]);

  // Dates (yyyy-mm-dd) de la setmana que s'esta veient ara mateix — cal per
  // saber, franja a franja, si de veritat no hi ha res per a AQUESTA setmana
  // (un event amb data concreta d'una altra setmana no ha de comptar aqui).
  const diesSetmanaIso = useMemo(() => {
    return diesSetmana.map(
      (d) =>
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0")
    );
  }, [diesSetmana]);

  const rowHeights = useMemo(() => {
    return HORES.map((h) => {
      const maxEvents = DIES.reduce((mx, _, di) => {
        const cnt = events.filter(
          (ev) => ev.dia === di && ev.hora === h.idx && (!ev.data || ev.data === diesSetmanaIso[di])
        ).length;
        return Math.max(mx, cnt);
      }, 0);
      if (maxEvents === 0) return 24;
      if (maxEvents < 2) return 38;
      return 38 + (maxEvents - 1) * 20;
    });
  }, [events, diesSetmanaIso]);

  const nowLineTop = useMemo(() => {
    if (offset !== 0) return null;
    const now = new Date(nowTick);
    const dow = now.getDay() === 0 ? 7 : now.getDay();
    if (dow < 1 || dow > 5) return null;

    const nowMin = now.getHours() * 60 + now.getMinutes();
    const first = HORES[0].min;
    const last = HORES[HORES.length - 1].min + 30;
    if (nowMin < first || nowMin > last) return null;

    const headerH = 52;
    const rowIdx = Math.max(0, Math.min(HORES.length - 1, Math.floor((nowMin - first) / 30)));
    const pct = ((nowMin - first) % 30) / 30;
    const pre = rowHeights.slice(0, rowIdx).reduce((acc, h) => acc + h, 0);
    const hAct = rowHeights[rowIdx] || 38;
    return headerH + pre + pct * hAct;
  }, [offset, nowTick, rowHeights]);

  const showToast = useCallback((msg) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const i = setInterval(() => setNowTick(Date.now()), 60000);
    return () => clearInterval(i);
  }, []);

  const carregarEvents = useCallback(() => {
    if (!supabase) return;
    return supabase.auth.getSession().then(({ data }) => {
      const uid = data && data.session && data.session.user && data.session.user.id;
      if (!uid) return;
      setProfessorId(uid);
      return supabase
        .from("cal_events")
        .select("*")
        .eq("professor_id", uid)
        .then(({ data: rows, error }) => {
          if (error) return;
          if (rows) setEvents(rows.map(rowToEvent));
        });
    });
  }, [supabase]);

  // Carrega els events reals des de Supabase (la sessio ja hi es, es comparteix
  // via localStorage amb la resta de l'app perque son la mateixa pagina web)
  useEffect(() => {
    carregarEvents();
  }, [carregarEvents]);

  // Aquest component viu en un iframe independent de l'app classica
  // (public/quadern.js) — quan aquella crea una activitat nova (un "mon" JS
  // separat), avisa amb postMessage perque tornem a carregar els events en
  // lloc de quedar-nos amb la foto fixa que vam carregar en muntar-nos.
  useEffect(() => {
    function onMessage(e) {
      if (e.data && e.data.type === "arrel:refresc-cal-events") carregarEvents();
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [carregarEvents]);

  const navS = useCallback((d) => setOffset((x) => x + d), []);
  const goAvui = useCallback(() => setOffset(0), []);

  const anarMes = useCallback(
    (mesIdx) => {
      const target = schoolData.mesos[mesIdx];
      if (!target) return;
      const primerDia = new Date(target.y, target.m, 1);
      const dilluns = startOfWeek(primerDia);
      // Si el dia 1 no cau en dilluns, el dilluns d'aquesta setmana pot ser
      // encara del mes anterior — saltem a la setmana seguent perque la
      // setmana mostrada (i el mes ressaltat a la barra lateral) coincideixi
      // sempre amb el mes que s'ha clicat.
      if (dilluns.getMonth() !== target.m || dilluns.getFullYear() !== target.y) {
        dilluns.setDate(dilluns.getDate() + 7);
      }
      const diff = Math.round((dilluns - base) / (7 * 86400000));
      setOffset(diff);
    },
    [schoolData, base]
  );

  const obrirNou = useCallback((dia = null, hora = null) => {
    setNvNota("");
    setNvCurs("3r A");
    setNvRepetir(false);
    if (dia !== null) setNvDia(dia);
    if (hora !== null) setNvHora(hora);
    setShowNou(true);
  }, []);

  const guardarEv = useCallback(() => {
    const nota = nvNota.trim();
    if (!nota) {
      showToast("Escriu un comentari");
      return;
    }
    const dia = parseInt(String(nvDia), 10);
    const hora = parseInt(String(nvHora), 10);
    // Data concreta del dia triat dins la setmana que s'esta veient ara mateix
    // — null nomes si l'event s'ha de repetir cada setmana (horari fix).
    const diaData = diesSetmana[dia];
    const dataISO = nvRepetir
      ? null
      : diaData.getFullYear() +
        "-" +
        String(diaData.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(diaData.getDate()).padStart(2, "0");
    const existents = events.filter(
      (e) => e.dia === dia && e.hora === hora && (!e.data || e.data === dataISO)
    ).length;
    if (existents >= 2) {
      showToast("Aquesta franja horària ja té 2 activitats/esdeveniments — tria una altra hora");
      return;
    }
    if (supabase && professorId) {
      supabase
        .from("cal_events")
        .insert({
          professor_id: professorId,
          dia_setmana: dia,
          franja_hora: hora,
          data: dataISO,
          curs_nom: nvCurs,
          tipus: "clay",
          origen: "manual",
          nota,
        })
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) {
            showToast("Error desant l'event");
            return;
          }
          setEvents((prev) => [...prev, rowToEvent(data)]);
          setShowNou(false);
          showToast("Event afegit al calendari");
        });
      return;
    }
    const nou = {
      id: nextId,
      dia,
      hora,
      data: dataISO,
      curs: nvCurs,
      tipus: "clay",
      creatPelProfessor: true,
      nota,
    };
    setEvents((prev) => [...prev, nou]);
    setNextId((x) => x + 1);
    setShowNou(false);
    showToast("Event afegit al calendari");
  }, [supabase, professorId, nextId, nvCurs, nvDia, nvHora, nvNota, nvRepetir, showToast, events, diesSetmana]);

  const obrirDet = useCallback((ev) => {
    setEvSel(ev);
    setShowDet(true);
  }, []);

  const eliminarEv = useCallback(() => {
    if (!evSel) return;
    if (supabase && evSel.dbId) {
      supabase
        .from("cal_events")
        .delete()
        .eq("id", evSel.dbId)
        .then(({ error }) => {
          if (error) {
            showToast("Error eliminant l'event");
            return;
          }
          setEvents((prev) => prev.filter((e) => e.id !== evSel.id));
          setEvSel(null);
          setShowDet(false);
          showToast("Event eliminat");
        });
      return;
    }
    setEvents((prev) => prev.filter((e) => e.id !== evSel.id));
    setEvSel(null);
    setShowDet(false);
    showToast("Event eliminat");
  }, [evSel, showToast, supabase]);

  const exportarPdf = useCallback(() => {
    const dies2Iso = diesSetmana.map(
      (d) =>
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0")
    );
    let files = "";
    HORES.forEach((h) => {
      let cel·les = "";
      DIES.forEach((_, di) => {
        const evs = events.filter(
          (ev) => ev.dia === di && ev.hora === h.idx && (!ev.data || ev.data === dies2Iso[di])
        );
        if (!evs.length) {
          cel·les += "<td></td>";
          return;
        }
        cel·les +=
          "<td>" +
          evs
            .map(
              (ev) =>
                '<div class="pev"><b>' +
                escHtmlPdf(ev.nota) +
                "</b>" +
                (ev.curs ? '<span class="pev-curs">' + escHtmlPdf(ev.curs) + "</span>" : "") +
                "</div>"
            )
            .join("") +
          "</td>";
      });
      files += "<tr><td class=\"th-hora\">" + h.label + "</td>" + cel·les + "</tr>";
    });

    const capçaleres = diesSetmana
      .map((d, di) => "<th>" + DIES[di] + "<br><span class=\"th-num\">" + d.getDate() + "</span></th>")
      .join("");

    const cont =
      "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>Programació — " +
      escHtmlPdf(weekLabel) +
      "</title><style>" +
      "body{font-family:Arial,sans-serif;padding:20px;color:#222;}" +
      "h1{font-size:17px;margin-bottom:2px;}" +
      ".meta{color:#666;font-size:12px;margin-bottom:14px;}" +
      "table{width:100%;border-collapse:collapse;table-layout:fixed;}" +
      "th,td{border:1px solid #ddd;padding:4px 6px;vertical-align:top;font-size:10px;}" +
      "th{background:#f0ece4;font-size:10.5px;text-align:center;}" +
      ".th-num{color:#888;font-weight:400;}" +
      ".th-hora{white-space:nowrap;font-weight:700;background:#fafafa;width:52px;font-size:9.5px;}" +
      ".pev{margin-bottom:4px;}" +
      ".pev-curs{color:#B5562F;font-size:9px;margin-left:4px;}" +
      ".pev-nota{color:#666;font-size:9px;}" +
      ".edit-hint{background:#FBEAE0;color:#B5562F;font-size:10.5px;padding:6px 10px;border-radius:8px;margin-bottom:12px;}" +
      "@media print{body{padding:8px;}.edit-hint{display:none;}}" +
      "</style></head><body>" +
      "<div class=\"edit-hint\">🖨️ <button onclick=\"window.print()\" style=\"margin-left:4px;border:none;background:#B5562F;color:#fff;border-radius:6px;padding:4px 10px;font-size:10.5px;cursor:pointer;\">🖨️ Imprimir / Desar com a PDF</button> Aquest avís no sortirà al PDF.</div>" +
      "<h1>Programació setmanal</h1>" +
      "<div class=\"meta\">" +
      escHtmlPdf(weekLabel) +
      " · " +
      escHtmlPdf(weekSub) +
      "</div>" +
      "<table><thead><tr><th></th>" +
      capçaleres +
      "</tr></thead><tbody>" +
      files +
      "</tbody></table>" +
      "</body></html>";

    const blob = new Blob([cont], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }, [diesSetmana, events, weekLabel, weekSub]);

  return (
    <div className="spg-root">
      <div id="sidebar" className="spg-sidebar">
        <div id="sidebar-any-title" className="spg-sidebar-title">
          {schoolData.anyInici} - {schoolData.anyFi}
        </div>
        <div id="sidebar-mesos">
          {schoolData.mesos.map((m, i) => (
            <div
              key={m.nom + m.y}
              className={"sidebar-mes" + (i === mesActiuIdx ? " actiu" : "")}
              onClick={() => anarMes(i)}
              title={m.nom + " " + m.y}
            >
              <span className="sidebar-mes-nom">{m.nom}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="spg-main">
        <div className="top">
          <div className="brand">S · SeJus</div>
          <button className="nav-btn" onClick={() => navS(-1)}>
            ←
          </button>
          <button className="nav-btn" onClick={() => navS(1)}>
            →
          </button>
          <button className="today-btn" onClick={goAvui}>
            Avui
          </button>
          <div className="week-info">
            <div className="week-label" id="wlabel">
              {weekLabel}
            </div>
            <div className="week-sub" id="wsub">
              {weekSub}
            </div>
          </div>
          <button className="add-btn" onClick={() => obrirNou()}>
            + Nou esdeveniment
          </button>
          <button className="today-btn" onClick={exportarPdf}>
            🖨️ Exportar PDF
          </button>
        </div>

        <div className="cal-wrap" id="cal-wrap">
          <div className="cal-grid" id="cal-grid">
            <div className="dh dh-time" />
            {diesSetmana.map((d, di) => {
              const esAvui =
                offset === 0 &&
                d.getDate() === avui.getDate() &&
                d.getMonth() === avui.getMonth() &&
                d.getFullYear() === avui.getFullYear();
              return (
                <div className={"dh" + (esAvui ? " dh-today" : "")} key={"dh" + di}>
                  <div className="dh-name">{DIES_ABREUJATS[di].toUpperCase()}</div>
                  <div className="dh-num">{d.getDate()}</div>
                </div>
              );
            })}

            {HORES.map((h) => (
              <div key={"row-" + h.idx} className="spg-row-contents">
                <div className="tc" style={{ height: rowHeights[h.idx] || 38 }}>
                  {h.label}
                </div>
                {DIES.map((_, di2) => {
                  const d2 = diesSetmana[di2];
                  const esAvui2 =
                    offset === 0 &&
                    d2.getDate() === avui.getDate() &&
                    d2.getMonth() === avui.getMonth() &&
                    d2.getFullYear() === avui.getFullYear();
                  const d2Iso =
                    d2.getFullYear() +
                    "-" +
                    String(d2.getMonth() + 1).padStart(2, "0") +
                    "-" +
                    String(d2.getDate()).padStart(2, "0");
                  // Els events sense "data" son horari fix (es repeteixen cada setmana);
                  // els que en tenen (activitats creades a Competencies) nomes surten el dia exacte.
                  const evs = events.filter(
                    (ev) => ev.dia === di2 && ev.hora === h.idx && (!ev.data || ev.data === d2Iso)
                  );
                  return (
                    <div
                      key={"cc-" + h.idx + "-" + di2}
                      className={"cc" + (esAvui2 ? " today" : "")}
                      style={{ height: rowHeights[h.idx] || 38 }}
                      onClick={() => obrirNou(di2, h.idx)}
                    >
                      {evs.map((ev) => (
                        <div
                          key={ev.id}
                          className="ev"
                          style={estilEvent(ev, cursColorMap)}
                          onClick={(e) => {
                            e.stopPropagation();
                            obrirDet(ev);
                          }}
                        >
                          <div className="ev-nom">{truncarComentari(ev.nota, 40)}</div>
                          <div className="ev-curs">{ev.curs}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {muntat && nowLineTop !== null ? (
            <div className="now-line" style={{ top: nowLineTop }}>
              <div className="now-dot" />
            </div>
          ) : null}
        </div>
      </div>

      {showNou ? (
        <div className="overlay" id="pop-nou" onClick={(e) => e.target === e.currentTarget && setShowNou(false)}>
          <div className="popup">
            <div className="popup-title">Nou event</div>
            <div className="grid2 fg">
              <div>
                <label className="flbl">Dia</label>
                <select className="inp" value={nvDia} onChange={(e) => setNvDia(parseInt(e.target.value, 10))}>
                  {DIES.map((nom, i) => (
                    <option key={i} value={i}>
                      {nom} {diesSetmana[i].getDate()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flbl">Hora</label>
                <select className="inp" value={nvHora} onChange={(e) => setNvHora(parseInt(e.target.value, 10))}>
                  {HORES.map((h) => (
                    <option key={h.idx} value={h.idx}>
                      {h.label} - {h.end}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="fg">
              <label className="flbl">Curs</label>
              <div className="chip-group" id="curs-chips">
                {CURSOS.map((c) => (
                  <button key={c} className={"chip" + (nvCurs === c ? " on" : "")} onClick={() => setNvCurs(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="fg">
              <label className="flbl">Comentari</label>
              <textarea className="inp" rows={2} value={nvNota} onChange={(e) => setNvNota(e.target.value)} placeholder="Dictat, examen, pàgina del llibre, instruccions..." />
            </div>
            <div className="fg">
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={nvRepetir}
                  onChange={(e) => setNvRepetir(e.target.checked)}
                />
                Repetir cada setmana (si no, nomes surt el {DIES[nvDia]} {diesSetmana[nvDia].getDate()})
              </label>
            </div>
            <div className="spg-actions">
              <button className="btn btn-clay spg-grow" onClick={guardarEv}>
                Guardar
              </button>
              <button className="btn btn-ghost" onClick={() => setShowNou(false)}>
                Cancel·lar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showDet && evSel ? (
        <div className="overlay" id="pop-det" onClick={(e) => e.target === e.currentTarget && setShowDet(false)}>
          <div className="popup">
            <div className="det-bar" id="det-bar" style={{ background: COLORS[corPerCurs(evSel.curs, cursColorMap)] }} />
            <div className="det-curs" id="det-curs">
              {evSel.curs}
            </div>
            <div className="det-nom" id="det-nom">
              {evSel.nota}
            </div>
            <div className="spg-actions">
              <button className="btn" onClick={eliminarEv}>
                Eliminar
              </button>
              <button className="btn btn-ghost" onClick={() => setShowDet(false)}>
                Tancar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  );
}
