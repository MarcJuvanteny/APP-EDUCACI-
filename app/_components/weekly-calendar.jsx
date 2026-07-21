"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import "../programacio/programacio-calendari.css";
import { createSupabaseClient } from "../lib/supabaseClient";

const DIES = ["Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres"];
const MESOS = [
  "gener",
  "febrer",
  "marc",
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
const HORES = [
  { label: "8:00", end: "9:00", idx: 0, min: 480 },
  { label: "9:00", end: "10:00", idx: 1, min: 540 },
  { label: "10:00", end: "11:00", idx: 2, min: 600 },
  { label: "11:00", end: "12:00", idx: 3, min: 660 },
  { label: "12:00", end: "13:00", idx: 4, min: 720 },
  { label: "13:00", end: "14:00", idx: 5, min: 780 },
  { label: "14:00", end: "15:00", idx: 6, min: 840 },
  { label: "15:00", end: "16:00", idx: 7, min: 900 },
  { label: "16:00", end: "17:00", idx: 8, min: 960 },
];
const COLORS = {
  clay: "#B5562F",
  moss: "#566B47",
  honey: "#B98627",
  sky: "#3C6B82",
  plum: "#6B4A6E",
  gray: "#D6CCB9",
};

const EVENTS_INICIALS = [
  {
    id: 1,
    dia: 0,
    hora: 0,
    titol: "Comprensio Oral",
    curs: "3r A",
    tipus: "clay",
    nota: 'Activitat: conte "El Petit Princep". Preguntes orals.',
  },
  {
    id: 2,
    dia: 0,
    hora: 1,
    titol: "Expressio Escrita",
    curs: "4t B",
    tipus: "clay",
    nota: "Redaccio lliure. Minim 10 linies.",
  },
  {
    id: 3,
    dia: 0,
    hora: 2,
    titol: "Matematiques",
    curs: "3r B",
    tipus: "sky",
    nota: "P. 70-71. Fraccions.",
  },
  {
    id: 4,
    dia: 0,
    hora: 6,
    titol: "Reunio claustre",
    curs: "General",
    tipus: "honey",
    nota: "Sala de professors. Tema: avaluacio T2.",
  },
  {
    id: 5,
    dia: 1,
    hora: 0,
    titol: "Dictat setmana 12",
    curs: "4t A",
    tipus: "moss",
    nota: "Text preparat. Recordar portar el full.",
  },
  {
    id: 6,
    dia: 1,
    hora: 1,
    titol: "Lectura oral",
    curs: "3r A",
    tipus: "clay",
    nota: "Pagina 45. Torn de 3 alumnes.",
  },
  {
    id: 7,
    dia: 1,
    hora: 2,
    titol: "Educacio Literaria",
    curs: "5e A",
    tipus: "plum",
    nota: "Comentari poema Verdaguer.",
  },
  {
    id: 8,
    dia: 2,
    hora: 0,
    titol: "Expressio Oral",
    curs: "3r B",
    tipus: "clay",
    nota: 'Presentacio: "El meu animal preferit"',
  },
  {
    id: 9,
    dia: 2,
    hora: 1,
    titol: "Examen Catala T2",
    curs: "4t B",
    tipus: "moss",
    nota: "Recordar fotocopies! Pag. 66-80.",
  },
  {
    id: 10,
    dia: 2,
    hora: 3,
    titol: "Guardia pati",
    curs: "General",
    tipus: "gray",
    nota: "",
  },
  {
    id: 11,
    dia: 3,
    hora: 0,
    titol: "Comprensio Lectora",
    curs: "5e A",
    tipus: "clay",
    nota: 'Text "Viatge Inoblidable". P.149.',
  },
  {
    id: 12,
    dia: 3,
    hora: 1,
    titol: "Corregir redaccions",
    curs: "3r A",
    tipus: "honey",
    nota: "Fer retorn individual.",
  },
  {
    id: 13,
    dia: 3,
    hora: 2,
    titol: "Matematiques",
    curs: "4t A",
    tipus: "sky",
    nota: "Geometria plana.",
  },
  {
    id: 14,
    dia: 4,
    hora: 0,
    titol: "Poesia",
    curs: "3r B",
    tipus: "plum",
    nota: "Ultim dia per entregar poema.",
  },
  {
    id: 15,
    dia: 4,
    hora: 1,
    titol: "Dictat setmana 12",
    curs: "5e A",
    tipus: "moss",
    nota: "Idem 4t A del dimarts.",
  },
  {
    id: 16,
    dia: 4,
    hora: 6,
    titol: "Taller creativitat",
    curs: "4t B",
    tipus: "plum",
    nota: "",
  },
];

const CURSOS = ["3r A", "3r B", "4t A", "4t B", "5e A", "General"];

function rowToEvent(row) {
  return {
    id: row.id,
    dbId: row.id,
    dia: row.dia_setmana,
    hora: row.franja_hora,
    titol: row.titol,
    curs: row.curs_nom || "",
    tipus: row.tipus || "clay",
    nota: row.nota || "",
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

  const [nvTitol, setNvTitol] = useState("");
  const [nvDia, setNvDia] = useState(0);
  const [nvHora, setNvHora] = useState(0);
  const [nvCurs, setNvCurs] = useState("3r A");
  const [nvNota, setNvNota] = useState("");

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
      { nom: "Marc", m: 2, y: anyFi },
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

  const rowHeights = useMemo(() => {
    return HORES.map((h) => {
      const maxEvents = DIES.reduce((mx, _, di) => {
        const cnt = events.filter((ev) => ev.dia === di && ev.hora === h.idx).length;
        return Math.max(mx, cnt);
      }, 0);
      if (maxEvents < 3) return 58;
      return 58 + (maxEvents - 2) * 22;
    });
  }, [events]);

  const nowLineTop = useMemo(() => {
    if (offset !== 0) return null;
    const now = new Date(nowTick);
    const dow = now.getDay() === 0 ? 7 : now.getDay();
    if (dow < 1 || dow > 5) return null;

    const nowMin = now.getHours() * 60 + now.getMinutes();
    const first = HORES[0].min;
    const last = HORES[HORES.length - 1].min + 60;
    if (nowMin < first || nowMin > last) return null;

    const headerH = 52;
    const rowIdx = Math.max(0, Math.min(HORES.length - 1, Math.floor((nowMin - first) / 60)));
    const pct = ((nowMin - first) % 60) / 60;
    const pre = rowHeights.slice(0, rowIdx).reduce((acc, h) => acc + h, 0);
    const hAct = rowHeights[rowIdx] || 58;
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

  // Carrega els events reals des de Supabase (la sessio ja hi es, es comparteix
  // via localStorage amb la resta de l'app perque son la mateixa pagina web)
  useEffect(() => {
    if (!supabase) return;
    let cancelat = false;
    supabase.auth.getSession().then(({ data }) => {
      const uid = data && data.session && data.session.user && data.session.user.id;
      if (!uid || cancelat) return;
      setProfessorId(uid);
      supabase
        .from("cal_events")
        .select("*")
        .eq("professor_id", uid)
        .then(({ data: rows, error }) => {
          if (cancelat || error) return;
          if (rows) setEvents(rows.map(rowToEvent));
        });
    });
    return () => {
      cancelat = true;
    };
  }, [supabase]);

  const navS = useCallback((d) => setOffset((x) => x + d), []);
  const goAvui = useCallback(() => setOffset(0), []);

  const anarMes = useCallback(
    (mesIdx) => {
      const target = schoolData.mesos[mesIdx];
      if (!target) return;
      const primerDia = new Date(target.y, target.m, 1);
      const dilluns = startOfWeek(primerDia);
      const diff = Math.round((dilluns - base) / (7 * 86400000));
      setOffset(diff);
    },
    [schoolData, base]
  );

  const obrirNou = useCallback((dia = null, hora = null) => {
    setNvTitol("");
    setNvNota("");
    setNvCurs("3r A");
    if (dia !== null) setNvDia(dia);
    if (hora !== null) setNvHora(hora);
    setShowNou(true);
  }, []);

  const guardarEv = useCallback(() => {
    const titol = nvTitol.trim();
    if (!titol) {
      showToast("Escriu el titol");
      return;
    }
    const dia = parseInt(String(nvDia), 10);
    const hora = parseInt(String(nvHora), 10);
    const nota = nvNota.trim();
    if (supabase && professorId) {
      supabase
        .from("cal_events")
        .insert({
          professor_id: professorId,
          titol,
          dia_setmana: dia,
          franja_hora: hora,
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
          showToast('"' + titol + '" afegit al calendari');
        });
      return;
    }
    const nou = {
      id: nextId,
      dia,
      hora,
      titol,
      curs: nvCurs,
      tipus: "clay",
      creatPelProfessor: true,
      nota,
    };
    setEvents((prev) => [...prev, nou]);
    setNextId((x) => x + 1);
    setShowNou(false);
    showToast('"' + titol + '" afegit al calendari');
  }, [supabase, professorId, nextId, nvCurs, nvDia, nvHora, nvNota, nvTitol, showToast]);

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
          <div className="brand">A · Arrel</div>
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
                  <div className="dh-name">{DIES[di].substring(0, 2).toUpperCase()}</div>
                  <div className="dh-num">{d.getDate()}</div>
                </div>
              );
            })}

            {HORES.map((h) => (
              <div key={"row-" + h.idx} className="spg-row-contents">
                <div className="tc" style={{ height: rowHeights[h.idx] || 58 }}>
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
                      style={{ height: rowHeights[h.idx] || 58 }}
                      onClick={() => obrirNou(di2, h.idx)}
                    >
                      {evs.map((ev) => (
                        <div
                          key={ev.id}
                          className={"ev ev-" + ev.tipus + (ev.creatPelProfessor ? " ev-new" : "")}
                          onClick={(e) => {
                            e.stopPropagation();
                            obrirDet(ev);
                          }}
                        >
                          <div className="ev-nom">{ev.titol}</div>
                          <div className="ev-curs">{ev.curs}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {nowLineTop !== null ? (
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
            <div className="fg">
              <label className="flbl">Títol</label>
              <input className="inp" value={nvTitol} onChange={(e) => setNvTitol(e.target.value)} placeholder="Dictat, Examen, Reunió..." />
            </div>
            <div className="grid2 fg">
              <div>
                <label className="flbl">Dia</label>
                <select className="inp" value={nvDia} onChange={(e) => setNvDia(parseInt(e.target.value, 10))}>
                  <option value={0}>Dilluns</option>
                  <option value={1}>Dimarts</option>
                  <option value={2}>Dimecres</option>
                  <option value={3}>Dijous</option>
                  <option value={4}>Divendres</option>
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
              <label className="flbl">Nota (opcional)</label>
              <textarea className="inp" rows={2} value={nvNota} onChange={(e) => setNvNota(e.target.value)} placeholder="Pàgina del llibre, material, instruccions..." />
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
            <div className="det-bar" id="det-bar" style={{ background: COLORS[evSel.tipus] || COLORS.clay }} />
            <div className="det-curs" id="det-curs">
              {evSel.curs}
            </div>
            <div className="det-nom" id="det-nom">
              {evSel.titol}
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
