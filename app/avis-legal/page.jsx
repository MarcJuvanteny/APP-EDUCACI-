export const metadata = {
  title: "Aviso legal — SeJus",
};

const COLORS = {
  ink: "#262220",
  ink2: "#6E665E",
  ink3: "#A89F94",
  paper: "#F6F2EA",
  surface: "#FFFFFF",
  line: "#E4DCCE",
  clay: "#B5562F",
};

export default function AvisLegalPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.paper,
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
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
          width: 680,
          maxWidth: "100%",
          background: COLORS.surface,
          border: `1px solid ${COLORS.line}`,
          borderRadius: 20,
          padding: "32px 36px",
        }}
      >
        <div style={eyebrowStyle}>SeJus</div>
        <h1 style={titleStyle}>Aviso legal</h1>
        <p style={metaStyle}>Conforme a la Ley 34/2002, de Servicios de la Sociedad de la Información (LSSI-CE)</p>

        <h2 style={h2Style}>Titular del sitio web y la aplicación</h2>
        <p style={pStyle}>
          <b>Nombre/Razón social:</b> Marc Juvanteny i Serra
          <br />
          <b>NIF/CIF:</b> 43637074W
          <br />
          <b>Domicilio:</b> Les Tries 53, 17800, Catalunya, España
          <br />
          <b>Email:</b> suport@sejusedu.com
        </p>

        <h2 style={h2Style}>Actividad</h2>
        <p style={pStyle}>
          SeJus es una aplicación web de gestión educativa dirigida al profesorado de educación primaria.
        </p>

        <h2 style={h2Style}>Propiedad intelectual</h2>
        <p style={pStyle}>
          El código fuente, el diseño, los textos y los elementos gráficos de SeJus son propiedad del titular o
          están licenciados por terceros. Queda prohibida su reproducción total o parcial sin autorización expresa.
        </p>

        <h2 style={h2Style}>Responsabilidad</h2>
        <p style={pStyle}>
          SeJus no se hace responsable del uso que el profesorado haga de la aplicación ni del contenido de los
          comentarios e informes que genere. El titular de la app no responde de los daños derivados del uso
          incorrecto de la plataforma.
        </p>

        <h2 style={h2Style}>Legislación aplicable</h2>
        <p style={pStyle}>
          Las presentes condiciones se rigen por la legislación española y catalana. Para cualquier controversia,
          las partes se someten a los juzgados y tribunales de Olot, renunciando a cualquier otro fuero.
        </p>

        <a href="/" style={backStyle}>
          ← Volver al inicio
        </a>
      </div>
    </div>
  );
}

const eyebrowStyle = {
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: COLORS.clay,
  fontWeight: 600,
  marginBottom: 8,
};

const titleStyle = {
  fontFamily: "'Fraunces', serif",
  fontSize: 28,
  fontWeight: 500,
  lineHeight: 1.15,
  margin: "0 0 4px",
  color: COLORS.ink,
};

const metaStyle = {
  fontSize: 12,
  color: COLORS.ink3,
  margin: "0 0 20px",
};

const h2Style = {
  fontFamily: "'Fraunces', serif",
  fontSize: 17,
  fontWeight: 500,
  margin: "22px 0 8px",
  color: COLORS.ink,
};

const pStyle = {
  fontSize: 13.5,
  color: COLORS.ink2,
  lineHeight: 1.65,
  margin: 0,
};

const backStyle = {
  display: "inline-block",
  marginTop: 28,
  fontSize: 13,
  fontWeight: 600,
  color: COLORS.clay,
  textDecoration: "none",
};
