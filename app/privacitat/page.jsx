export const metadata = {
  title: "Política de privacitat — SeJus",
};

const COLORS = {
  ink: "#262220",
  ink2: "#6E665E",
  ink3: "#A89F94",
  paper: "#F6F2EA",
  surface: "#FFFFFF",
  line: "#E4DCCE",
  clay: "#B5562F",
  honey: "#B98627",
  honeyLight: "#FBF1DE",
};

export default function PrivacitatPage() {
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
        <h1 style={titleStyle}>Política de privacitat</h1>
        <p style={metaStyle}>Última actualització: 5 d&apos;agost de 2026</p>

        <div style={noticeStyle}>
          Aquesta pàgina és una plantilla informativa sobre com tracta dades
          l&apos;aplicació. No substitueix l&apos;assessorament legal ni la
          informació de contacte pròpia del centre educatiu responsable del
          tractament, que ha de completar-la abans de publicar-la als seus
          usuaris finals.
        </div>

        <h2 style={h2Style}>1. Qui és responsable de les dades</h2>
        <p style={pStyle}>
          El professorat que introdueix dades a SeJus n&apos;és, normalment,
          l&apos;usuari, i el centre educatiu n&apos;és el responsable del
          tractament de les dades de l&apos;alumnat, d&apos;acord amb el
          Reglament (UE) 2016/679 (RGPD) i la Llei orgànica 3/2018 de
          protecció de dades personals.
        </p>

        <h2 style={h2Style}>2. Quines dades tractem</h2>
        <p style={pStyle}>
          <b>Del professorat:</b> nom i cognoms, correu electrònic i
          contrasenya (xifrada) per gestionar el compte i l&apos;accés.
          <br />
          <br />
          <b>De l&apos;alumnat, introduïdes pel professorat:</b> nom o
          inicials, curs, notes i valoracions per competència, i comentaris
          o observacions escrits lliurement.
        </p>

        <h2 style={h2Style}>3. Per a què fem servir aquestes dades</h2>
        <p style={pStyle}>
          Per gestionar l&apos;accés a l&apos;aplicació, desar l&apos;avaluació
          del curs i generar els informes trimestrals o de final de curs que
          el professorat comparteix amb les famílies. No fem servir aquestes
          dades amb finalitats publicitàries ni les venem a tercers.
        </p>

        <h2 style={h2Style}>4. Generació d&apos;informes amb intel·ligència artificial</h2>
        <p style={pStyle}>
          Quan el professorat sol·licita una proposta de text per a
          l&apos;informe, les notes i els comentaris introduïts
          s&apos;envien a un proveïdor extern d&apos;intel·ligència
          artificial (Anthropic) perquè en generi una redacció. Per reduir
          l&apos;exposició de dades personals, el nom de l&apos;alumne mai
          s&apos;envia a aquest servei — només un identificador numèric
          intern.
        </p>
        <p style={pStyle}>
          Ara bé, el <b>text lliure dels comentaris s&apos;envia tal qual
          l&apos;escriu el professorat</b>. Per això és important no
          incloure-hi dades personals que no calguin per a l&apos;avaluació
          (telèfons, adreces, dades de salut, etc.) — l&apos;aplicació mostra
          un avís en aquest sentit als camps de comentari.
        </p>

        <h2 style={h2Style}>5. On es guarden les dades</h2>
        <p style={pStyle}>
          Les dades es guarden en una base de dades gestionada per Supabase i
          l&apos;aplicació s&apos;allotja en infraestructura de tercers
          (proveïdor de hosting). Aquests proveïdors actuen com a
          encarregats del tractament i apliquen les seves pròpies mesures de
          seguretat.
        </p>

        <h2 style={h2Style}>6. Quant de temps es conserven</h2>
        <p style={pStyle}>
          Les dades es conserven mentre el compte estigui actiu i durant el
          temps necessari per complir les obligacions del centre educatiu en
          matèria de conservació d&apos;expedients acadèmics. El professorat
          pot sol·licitar l&apos;eliminació de dades concretes en qualsevol
          moment.
        </p>

        <h2 style={h2Style}>7. Els teus drets</h2>
        <p style={pStyle}>
          Pots exercir els drets d&apos;accés, rectificació, supressió,
          oposició, limitació i portabilitat de les dades contactant amb el
          responsable del tractament (el teu centre educatiu) o amb qui
          administri l&apos;aplicació al teu centre.
        </p>

        <h2 style={h2Style}>8. Contacte</h2>
        <p style={pStyle}>
          Per a qualsevol qüestió relacionada amb aquesta política, contacta
          amb el responsable de l&apos;aplicació a través del centre
          educatiu.
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
  margin: "0 0 16px",
};

const noticeStyle = {
  fontSize: 12.5,
  lineHeight: 1.5,
  color: COLORS.honey,
  background: COLORS.honeyLight,
  borderRadius: 10,
  padding: "10px 14px",
  marginBottom: 20,
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
