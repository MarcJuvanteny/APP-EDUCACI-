export const metadata = {
  title: "Termes i condicions — SeJus",
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

export default function TermesPage() {
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
        <h1 style={titleStyle}>Termes i condicions d&apos;ús</h1>
        <p style={metaStyle}>Última actualització: 5 d&apos;agost de 2026</p>

        <p style={pStyle}>
          Aquests termes regulen l&apos;ús de SeJus, una aplicació pensada
          perquè el professorat pugui registrar avaluacions, competències i
          comentaris de l&apos;alumnat i generar-ne informes trimestrals o de
          final de curs. En crear un compte i utilitzar l&apos;aplicació,
          n&apos;acceptes les condicions descrites aquí.
        </p>

        <h2 style={h2Style}>1. Qui pot fer servir SeJus</h2>
        <p style={pStyle}>
          L&apos;aplicació està destinada a professionals de l&apos;educació
          que introdueixen dades de l&apos;alumnat en l&apos;exercici de la
          seva tasca docent. Ets responsable de garantir que tens legitimació
          per tractar les dades dels alumnes que introdueixis (per exemple,
          perquè el teu centre educatiu n&apos;és el responsable del
          tractament) i de mantenir la confidencialitat de les credencials
          del teu compte.
        </p>

        <h2 style={h2Style}>2. Contingut introduït pel professorat</h2>
        <p style={pStyle}>
          Ets responsable del contingut que introdueixis a l&apos;aplicació
          (notes, competències, comentaris i observacions). Als camps de
          comentari lliure, evita incloure-hi dades personals que no siguin
          estrictament necessàries per a l&apos;avaluació (per exemple,
          dades de salut, adreces o telèfons), ja que aquest text es fa
          servir per generar l&apos;informe final i pot ser processat per
          tercers proveïdors, tal com s&apos;explica a la{" "}
          <a href="/privacitat" style={linkStyle}>
            Política de privacitat
          </a>
          .
        </p>

        <h2 style={h2Style}>3. Generació d&apos;informes amb IA</h2>
        <p style={pStyle}>
          SeJus pot fer servir un model d&apos;intel·ligència artificial per
          redactar una proposta de text per als informes, a partir de les
          notes i comentaris introduïts. Aquest text és sempre una proposta:
          és responsabilitat del professorat revisar-lo i validar-lo abans
          de lliurar-lo a les famílies.
        </p>

        <h2 style={h2Style}>4. Disponibilitat del servei</h2>
        <p style={pStyle}>
          Fem el possible perquè l&apos;aplicació estigui disponible i
          funcioni correctament, però no podem garantir un servei
          ininterromput ni lliure d&apos;errors. Recomanem exportar o
          desar còpies dels informes generats un cop finalitzats.
        </p>

        <h2 style={h2Style}>5. Modificacions</h2>
        <p style={pStyle}>
          Aquests termes es poden actualitzar per reflectir canvis a
          l&apos;aplicació o requisits legals. Si hi ha canvis rellevants,
          s&apos;indicarà la data d&apos;actualització en aquesta mateixa
          pàgina.
        </p>

        <h2 style={h2Style}>6. Contacte</h2>
        <p style={pStyle}>
          Per a qualsevol dubte sobre aquests termes, pots contactar amb el
          responsable de l&apos;aplicació a través del centre educatiu.
        </p>

        <a href="/" style={backStyle}>
          ← Tornar a l&apos;inici
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

const linkStyle = {
  color: COLORS.clay,
  fontWeight: 600,
  textDecoration: "none",
};

const backStyle = {
  display: "inline-block",
  marginTop: 28,
  fontSize: 13,
  fontWeight: 600,
  color: COLORS.clay,
  textDecoration: "none",
};
