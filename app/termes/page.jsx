export const metadata = {
  title: "Términos y condiciones — SeJus",
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
        <h1 style={titleStyle}>Términos y condiciones de uso</h1>
        <p style={metaStyle}>Versión 1.0 — Agosto 2026</p>

        <h2 style={h2Style}>1. Qué es SeJus y a quién va dirigido</h2>
        <p style={pStyle}>
          SeJus es una aplicación web de gestión educativa diseñada exclusivamente para profesorado de educación
          primaria. Su uso está restringido a profesionales de la educación mayores de edad.
        </p>
        <p style={pStyle}>
          Al crear una cuenta, aceptas estos términos y confirmas que eres un profesional de la educación mayor de
          edad.
        </p>

        <h2 style={h2Style}>2. Tu cuenta</h2>
        <p style={pStyle}>
          Eres responsable de mantener la confidencialidad de tus credenciales de acceso. Si detectas un uso no
          autorizado de tu cuenta, debes comunicárnoslo inmediatamente en{" "}
          <a href="mailto:suport@sejusedu.com" style={linkStyle}>
            suport@sejusedu.com
          </a>
          .
        </p>
        <p style={pStyle}>Cada cuenta es personal e intransferible. No puedes ceder tu cuenta a terceros.</p>

        <h2 style={h2Style}>3. Uso correcto de la aplicación</h2>
        <p style={pStyle}>Puedes usar SeJus para:</p>
        <ul style={ulStyle}>
          <li>Gestionar los datos académicos de tu alumnado en el ejercicio de tus funciones docentes</li>
          <li>Generar informes de evaluación</li>
          <li>Usar la función de IA para obtener borradores de comentarios pedagógicos</li>
        </ul>
        <p style={pStyle}>No puedes usar SeJus para:</p>
        <ul style={ulStyle}>
          <li>Introducir datos de personas que no sean tu alumnado actual</li>
          <li>Usar la aplicación con fines distintos a la gestión educativa</li>
          <li>Intentar acceder a datos de otros usuarios</li>
          <li>Realizar un uso abusivo de la función de IA</li>
        </ul>

        <h2 style={h2Style}>4. Datos del alumnado y responsabilidad</h2>
        <p style={pStyle}>
          Como profesorado, eres responsable de asegurarte de que tu centro educativo te autoriza a usar SeJus para
          tratar los datos de tu alumnado y de que dicho uso es conforme a la normativa de protección de datos
          aplicable.
        </p>
        <p style={pStyle}>
          SeJus trata los datos del alumnado siguiendo tus instrucciones, como encargado del tratamiento del centro
          educativo.
        </p>

        <h2 style={h2Style}>5. La función de inteligencia artificial</h2>
        <p style={pStyle}>
          SeJus ofrece una función opcional para generar borradores de comentarios pedagógicos mediante
          inteligencia artificial. Estos borradores son una sugerencia, no una evaluación definitiva. El
          profesorado es siempre el responsable del contenido final de los informes.
        </p>
        <p style={pStyle}>
          Para proteger la privacidad del alumnado, la IA nunca recibe el nombre del alumno o alumna, solo un
          identificador numérico.
        </p>
        <p style={pStyle}>
          El uso de esta función está limitado a 4 informes con IA por año escolar para garantizar un uso
          responsable.
        </p>

        <h2 style={h2Style}>5 bis. Responsabilidad sobre los comentarios de texto libre procesados por IA</h2>

        <h3 style={h3Style}>5 bis.1 Qué ocurre con los comentarios que introduces</h3>
        <p style={pStyle}>
          SeJus permite al profesorado introducir comentarios de texto libre sobre el alumnado (por asignatura, por
          actividad o como observación general). Cuando se usa la función de generación de comentarios con IA,
          estos textos se envían a la API de Anthropic para generar un borrador del informe pedagógico.
        </p>
        <p style={pStyle}>
          SeJus no aplica ningún filtrado automático sobre el contenido de los comentarios que el profesorado
          introduce antes de enviarlos a la IA. El texto se transmite tal como el profesorado lo escribe.
        </p>

        <h3 style={h3Style}>5 bis.2 Qué es tu responsabilidad</h3>
        <p style={pStyle}>
          El profesorado es el único responsable del contenido de los comentarios que introduce en la aplicación.
          En particular, el profesorado se compromete a:
        </p>
        <ul style={ulStyle}>
          <li>
            No introducir comentarios que contengan datos personales del alumnado innecesarios o excesivos para la
            finalidad educativa (por ejemplo, información médica, familiar o de cualquier otra índole que no sea
            relevante para la evaluación académica)
          </li>
          <li>No introducir comentarios vejatorios, discriminatorios, ofensivos o que vulneren la dignidad del alumnado</li>
          <li>No incluir en los comentarios datos de terceros ajenos al proceso educativo</li>
          <li>Asegurarse de que el contenido de los comentarios es adecuado, veraz y proporcionado a la finalidad de evaluación académica</li>
        </ul>

        <h3 style={h3Style}>5 bis.3 Qué ocurre con el borrador generado por la IA</h3>
        <p style={pStyle}>
          El texto generado por la IA es un borrador orientativo. El profesorado debe revisarlo, editarlo si es
          necesario y asumir la responsabilidad plena del contenido final antes de incluirlo en cualquier informe
          que se entregue a las familias o al centro educativo.
        </p>
        <p style={pStyle}>
          SeJus no se hace responsable del contenido del borrador generado por la IA ni de las consecuencias
          derivadas de su uso sin revisión previa por parte del profesorado.
        </p>

        <h3 style={h3Style}>5 bis.4 Limitación de responsabilidad de SeJus</h3>
        <p style={pStyle}>
          SeJus actúa como intermediario técnico entre el profesorado y el proveedor de IA (Anthropic). SeJus no
          revisa, modera ni valida el contenido de los comentarios introducidos por el profesorado ni los
          borradores generados por la IA.
        </p>
        <p style={pStyle}>En consecuencia, SeJus no será responsable de:</p>
        <ul style={ulStyle}>
          <li>Los daños o perjuicios derivados de comentarios introducidos por el profesorado que vulneren derechos de terceros</li>
          <li>El contenido del borrador generado por la IA que el profesorado decida incluir en un informe sin revisión previa</li>
          <li>El uso de los informes generados fuera del contexto educativo para el que están diseñados</li>
        </ul>

        <h2 style={h2Style}>6. Disponibilidad del servicio</h2>
        <p style={pStyle}>
          SeJus se ofrece &quot;tal como está&quot; en fase beta. Nos esforzamos por mantener el servicio
          disponible, pero no garantizamos una disponibilidad del 100%.
        </p>

        <h2 style={h2Style}>7. Precios</h2>
        <p style={pStyle}>Gratuito.</p>

        <h2 style={h2Style}>8. Cancelación de la cuenta</h2>
        <p style={pStyle}>
          Puedes cancelar tu cuenta en cualquier momento escribiendo a{" "}
          <a href="mailto:suport@sejusedu.com" style={linkStyle}>
            suport@sejusedu.com
          </a>
          . Tras la cancelación, tus datos se conservarán durante 3 años por razones legales y luego se eliminarán.
        </p>

        <h2 style={h2Style}>9. Modificaciones</h2>
        <p style={pStyle}>
          Podemos modificar estos términos notificándotelo por email con al menos 15 días de antelación. Si no
          estás de acuerdo con los nuevos términos, puedes cancelar tu cuenta antes de que entren en vigor.
        </p>

        <h2 style={h2Style}>10. Legislación aplicable</h2>
        <p style={pStyle}>
          Estos términos se rigen por la legislación española. Para cualquier controversia, las partes se someten a
          los juzgados y tribunales de Olot.
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

const h3Style = {
  fontSize: 13.5,
  fontWeight: 700,
  margin: "16px 0 6px",
  color: COLORS.ink,
};

const pStyle = {
  fontSize: 13.5,
  color: COLORS.ink2,
  lineHeight: 1.65,
  margin: "0 0 10px",
};

const ulStyle = {
  fontSize: 13.5,
  color: COLORS.ink2,
  lineHeight: 1.65,
  margin: "0 0 10px",
  paddingLeft: 20,
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
