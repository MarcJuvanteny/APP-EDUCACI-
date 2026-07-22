"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "../lib/supabaseClient";

const COLORS = {
  ink: "#262220",
  ink2: "#6E665E",
  ink3: "#A89F94",
  paper: "#F6F2EA",
  surface: "#FFFFFF",
  line: "#E4DCCE",
  clay: "#B5562F",
  clayHover: "#9C4423",
  clayLight: "#FBEAE0",
  moss: "#566B47",
};

export default function RecuperarContrasenyaPage() {
  const [supabase] = useState(() => createSupabaseClient());
  const [status, setStatus] = useState("waiting"); // waiting | ready | saving | done | error
  const [pass, setPass] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!supabase) {
      setStatus("no-config");
      return;
    }
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setStatus("ready");
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data && data.session) setStatus("ready");
    });
    const timeout = setTimeout(() => {
      setStatus((s) => (s === "waiting" ? "invalid" : s));
    }, 4000);
    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [supabase]);

  async function guardar() {
    setErrorMsg("");
    if (pass.trim().length < 6) {
      setErrorMsg("La contrasenya ha de tenir mínim 6 caràcters");
      return;
    }
    setStatus("saving");
    const { error } = await supabase.auth.updateUser({ password: pass.trim() });
    if (error) {
      setErrorMsg(error.message);
      setStatus("ready");
      return;
    }
    setStatus("done");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.paper,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "'Karla', sans-serif",
        color: COLORS.ink,
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Karla:wght@400;500;600;700&display=swap"
      />
      <div
        style={{
          width: 380,
          maxWidth: "100%",
          background: COLORS.surface,
          border: `1px solid ${COLORS.line}`,
          borderRadius: 20,
          padding: 28,
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: COLORS.clay,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          Recuperar accés
        </div>

        {status === "no-config" && (
          <>
            <h1 style={titleStyle}>Servei no disponible</h1>
            <p style={subStyle}>
              La base de dades no està configurada en aquest desplegament.
              Contacta amb el teu centre o torna-ho a provar més tard.
            </p>
          </>
        )}

        {status === "waiting" && (
          <>
            <h1 style={titleStyle}>Comprovant l&apos;enllaç…</h1>
            <p style={subStyle}>Un moment, si us plau.</p>
          </>
        )}

        {status === "invalid" && (
          <>
            <h1 style={titleStyle}>Enllaç no vàlid o caducat</h1>
            <p style={subStyle}>
              Aquest enllaç de recuperació ja no és vàlid — pot ser que hagi
              caducat o que ja s&apos;hagi fet servir. Torna a demanar-ne un
              de nou des de la pantalla d&apos;inici de sessió.
            </p>
            <a href="/inici" style={btnStyle}>
              Anar a l&apos;inici de sessió →
            </a>
          </>
        )}

        {(status === "ready" || status === "saving") && (
          <>
            <h1 style={titleStyle}>Crea una nova contrasenya</h1>
            <p style={subStyle}>Escriu la nova contrasenya per al teu compte.</p>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Contrasenya nova</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Mínim 6 caràcters"
                onKeyDown={(e) => e.key === "Enter" && guardar()}
                style={inputStyle}
              />
            </div>
            {errorMsg && (
              <div style={{ color: COLORS.clay, fontSize: 12.5, marginBottom: 10 }}>
                {errorMsg}
              </div>
            )}
            <button
              onClick={guardar}
              disabled={status === "saving"}
              style={{
                ...btnStyle,
                display: "block",
                width: "100%",
                border: "none",
                cursor: status === "saving" ? "default" : "pointer",
                opacity: status === "saving" ? 0.7 : 1,
              }}
            >
              {status === "saving" ? "Guardant…" : "Guardar i entrar →"}
            </button>
          </>
        )}

        {status === "done" && (
          <>
            <h1 style={titleStyle}>Contrasenya actualitzada ✓</h1>
            <p style={subStyle}>
              Ja pots entrar a l&apos;aplicació amb la teva nova contrasenya.
            </p>
            <a href="/inici" style={btnStyle}>
              Entrar a l&apos;aplicació →
            </a>
          </>
        )}
      </div>
    </div>
  );
}

const titleStyle = {
  fontFamily: "'Fraunces', serif",
  fontSize: 26,
  fontWeight: 500,
  lineHeight: 1.15,
  margin: "0 0 6px",
  color: COLORS.ink,
};

const subStyle = {
  fontSize: 13,
  color: COLORS.ink2,
  lineHeight: 1.6,
  margin: "0 0 18px",
};

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: COLORS.ink2,
  marginBottom: 4,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: `1px solid ${COLORS.line}`,
  borderRadius: 8,
  padding: "9px 11px",
  fontSize: 13,
  fontFamily: "'Karla', sans-serif",
  color: COLORS.ink,
  outline: "none",
};

const btnStyle = {
  display: "inline-block",
  textAlign: "center",
  background: COLORS.clay,
  color: "#fff",
  textDecoration: "none",
  borderRadius: 8,
  padding: "10px 14px",
  fontSize: 13,
  fontWeight: 600,
  fontFamily: "'Karla', sans-serif",
};
