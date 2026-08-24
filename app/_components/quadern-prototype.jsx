"use client";

import { useEffect, useRef } from "react";
import { createSupabaseClient } from "../lib/supabaseClient";

const ROUTE_MAP = {
  home: "/inici",
  competencies: "/competencies",
  nova: "/nova-activitat",
  config: "/configuracio",
};

// Versió dels fitxers estàtics del "quadern" — puja aquest número cada cop
// que es desplegui un canvi a public/quadern.{html,css,js}. Així el navegador
// pot fer servir la seva caché normal (cada usuari no torna a descarregar
// aquests fitxers sencers a cada pantalla, important amb molts usuaris a la
// vegada) i només demana la versió nova quan aquest número canvia — en lloc
// de desactivar la caché sempre amb "cache: no-store".
const QUADERN_ASSET_VERSION = "2026-08-18.2";

export default function QuadernPrototype({ initialScreen }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    let injectedStyle = null;
    let injectedScript = null;

    async function loadPrototype() {
      const [htmlRes, cssRes, jsRes] = await Promise.all([
        fetch(`/quadern.html?v=${QUADERN_ASSET_VERSION}`),
        fetch(`/quadern.css?v=${QUADERN_ASSET_VERSION}`),
        fetch(`/quadern.js?v=${QUADERN_ASSET_VERSION}`),
      ]);

      const [html, css, js] = await Promise.all([
        htmlRes.text(),
        cssRes.text(),
        jsRes.text(),
      ]);

      if (!mounted || !containerRef.current) return;

      window.__QUADERN_INITIAL_SCREEN__ = initialScreen;
      window.__QUADERN_ROUTE_MODE__ = true;
      window.__QUADERN_ROUTE_MAP__ = ROUTE_MAP;
      window.__QUADERN_ASSET_VERSION__ = QUADERN_ASSET_VERSION;
      window.__QUADERN_SUPABASE__ = createSupabaseClient();
      // Nomes true en "npm run dev" / build de desenvolupament — mai en el
      // desplegament de producció — perquè el límit d'informes IA no molesti
      // durant les proves pero es respecti sempre pels usuaris reals.
      window.__QUADERN_DEV_MODE__ = process.env.NODE_ENV !== "production";

      const hasFonts = document.querySelector(
        'link[data-quadern-fonts="1"]'
      );
      if (!hasFonts) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
          "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Karla:wght@400;500;600;700&display=swap";
        link.setAttribute("data-quadern-fonts", "1");
        document.head.appendChild(link);
      }

      injectedStyle = document.createElement("style");
      injectedStyle.setAttribute("data-quadern-style", "1");
      injectedStyle.textContent = css;
      document.head.appendChild(injectedStyle);

      containerRef.current.innerHTML = html;

      injectedScript = document.createElement("script");
      injectedScript.setAttribute("data-quadern-script", "1");
      injectedScript.textContent = js;
      containerRef.current.appendChild(injectedScript);
    }

    loadPrototype();

    return () => {
      mounted = false;
      delete window.__QUADERN_INITIAL_SCREEN__;
      delete window.__QUADERN_ROUTE_MODE__;
      delete window.__QUADERN_ROUTE_MAP__;
      delete window.__QUADERN_ASSET_VERSION__;
      delete window.__QUADERN_SUPABASE__;
      delete window.__QUADERN_DEV_MODE__;
      if (injectedScript && injectedScript.parentNode) {
        injectedScript.parentNode.removeChild(injectedScript);
      }
      if (injectedStyle && injectedStyle.parentNode) {
        injectedStyle.parentNode.removeChild(injectedStyle);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [initialScreen]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    />
  );
}