export const metadata = {
  title: "Política de privacidad — SeJus",
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
          width: 720,
          maxWidth: "100%",
          background: COLORS.surface,
          border: `1px solid ${COLORS.line}`,
          borderRadius: 20,
          padding: "32px 36px",
        }}
      >
        <div style={eyebrowStyle}>SeJus</div>
        <h1 style={titleStyle}>Política de privacidad</h1>
        <p style={metaStyle}>Versión 1.0 — Septiembre 2026</p>

        <h2 style={h2Style}>1. Quién es responsable de tus datos</h2>
        <p style={pStyle}>
          <b>Titular de la aplicación (SeJus):</b>
          <br />
          Nombre/Razón social: Marc Juvanteny i Serra
          <br />
          NIF/CIF: 43637074W
          <br />
          Domicilio: Les Tries 53, 17800 Catalunya, España
          <br />
          Email de contacto:{" "}
          <a href="mailto:suport@sejusedu.com" style={linkStyle}>
            suport@sejusedu.com
          </a>
        </p>
        <p style={pStyle}>
          A efectos de esta política, el titular de SeJus actúa como responsable del tratamiento de los datos del
          profesorado registrado en la plataforma.
        </p>
        <p style={pStyle}>
          En relación con los datos del alumnado introducidos por el profesorado, el centro educativo es el
          responsable del tratamiento y SeJus actúa como encargado del tratamiento por cuenta de dicho centro. Esta
          relación se formaliza mediante un contrato de encargado del tratamiento (véase apartado 9).
        </p>

        <h2 style={h2Style}>2. Qué datos recogemos y por qué</h2>
        <h3 style={h3Style}>2.1 Datos del profesorado (usuarios registrados)</h3>
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Dato</th>
                <th style={thStyle}>Finalidad</th>
                <th style={thStyle}>Base legal</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Nombre completo", "Personalizar la experiencia y figurar en los informes generados", "Ejecución del contrato (art. 6.1.b RGPD)"],
                ["Dirección de email", "Autenticación, comunicaciones del servicio y recuperación de contraseña", "Ejecución del contrato (art. 6.1.b RGPD)"],
                ["Contraseña", "Autenticación segura (nunca se almacena en texto plano)", "Ejecución del contrato (art. 6.1.b RGPD)"],
                ["Centro educativo", "Personalización y figura en los informes", "Ejecución del contrato (art. 6.1.b RGPD)"],
                ["Curso escolar", "Organización de los datos por año académico", "Ejecución del contrato (art. 6.1.b RGPD)"],
                ["Dirección IP (temporal)", "Protección anti-abuso y limitación de peticiones a la IA", "Interés legítimo (art. 6.1.f RGPD) — la IP no se almacena en base de datos"],
              ].map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} style={tdStyle}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={h3Style}>2.2 Datos del alumnado (introducidos por el profesorado)</h3>
        <p style={pStyle}>
          El profesorado introduce en la aplicación datos relativos a su alumnado. Estos datos son tratados por
          SeJus por cuenta del centro educativo, que es el responsable de su tratamiento. Los datos que se pueden
          introducir son:
        </p>
        <ul style={ulStyle}>
          <li>Nombre completo e iniciales del alumno o alumna</li>
          <li>Curso y grupo</li>
          <li>Notas numéricas por competencia y criterio de evaluación</li>
          <li>Comentarios de texto libre del profesorado sobre el alumno o alumna</li>
          <li>Fechas de actividades evaluadas</li>
        </ul>
        <p style={pStyle}>
          Base legal del tratamiento por parte del centro educativo: cumplimiento de obligación legal en materia
          educativa (art. 6.1.c RGPD, en relación con la normativa educativa vigente en Catalunya) y, en su caso,
          misión de interés público (art. 6.1.e RGPD).
        </p>
        <p style={pStyle}>
          <b>Datos de menores:</b> el alumnado de primaria son menores de edad. El profesorado introduce estos
          datos en el ejercicio de sus funciones docentes, amparado por la normativa educativa. SeJus no recoge
          datos directamente de los menores ni les permite crear cuentas.
        </p>

        <h2 style={h2Style}>3. Cuánto tiempo conservamos los datos</h2>
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Dato</th>
                <th style={thStyle}>Plazo de conservación</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Datos de cuenta del profesorado", "Mientras la cuenta esté activa + 3 años tras la baja"],
                [
                  "Datos del alumnado",
                  "Mientras el profesorado los mantenga activos. Los alumnos dados de baja se marcan como \"inactivos\" pero no se eliminan para preservar la integridad de los informes históricos",
                ],
                ["Dirección IP (temporal)", "No se almacena. Solo se usa en memoria del servidor para control de peticiones"],
              ].map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} style={tdStyle}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={h2Style}>4. Terceros que tratan datos (subencargados)</h2>
        <p style={pStyle}>SeJus utiliza los siguientes proveedores externos que pueden tener acceso a los datos:</p>

        <h3 style={h3Style}>4.1 Supabase</h3>
        <p style={pStyle}>
          Función: autenticación de usuarios y base de datos donde se almacenan todos los datos.
          <br />
          Datos que recibe: todos los datos del profesorado y del alumnado descritos en el apartado 2.
          <br />
          Dónde almacena los datos: West UE, Ireland.
          <br />
          Más información:{" "}
          <a href="https://supabase.com/privacy" target="_blank" rel="noopener" style={linkStyle}>
            supabase.com/privacy
          </a>
        </p>

        <h3 style={h3Style}>4.2 Anthropic (API de Claude)</h3>
        <p style={pStyle}>
          Función: generación de borradores de comentarios pedagógicos mediante inteligencia artificial.
          <br />
          Datos que recibe: exclusivamente datos de rendimiento académico (notas y comentarios del profesorado)
          vinculados a un identificador numérico interno. Nunca se envía el nombre del alumno ni ningún dato que
          permita identificarle directamente.
          <br />
          Uso para entrenamiento de modelos: Estados Unidos.
          <br />
          Más información:{" "}
          <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener" style={linkStyle}>
            anthropic.com/privacy
          </a>
        </p>

        <h3 style={h3Style}>4.3 Vercel</h3>
        <p style={pStyle}>
          Función: alojamiento y despliegue de la aplicación web.
          <br />
          Datos que recibe: puede procesar datos de tráfico web (IP, cabeceras HTTP) en tránsito.
          <br />
          Más información:{" "}
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener" style={linkStyle}>
            vercel.com/legal/privacy-policy
          </a>
        </p>

        <h3 style={h3Style}>4.4 Google Fonts</h3>
        <p style={pStyle}>
          Función: carga de tipografías para la interfaz de la aplicación.
          <br />
          Datos que recibe: la dirección IP del usuario se transmite a los servidores de Google al cargar las
          fuentes tipográficas.
          <br />
          Más información:{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" style={linkStyle}>
            policies.google.com/privacy
          </a>
        </p>

        <h3 style={h3Style}>4.5 Formspree</h3>
        <p style={pStyle}>
          Función: gestión del formulario de contacto de la página web (sejusedu.com).
          <br />
          Datos que recibe: nombre, email, centro educativo (opcional) y mensaje de las personas que rellenan el
          formulario de contacto.
          <br />
          Más información:{" "}
          <a href="https://formspree.io/legal/privacy-policy" target="_blank" rel="noopener" style={linkStyle}>
            formspree.io/legal/privacy-policy
          </a>
        </p>

        <h2 style={h2Style}>5. Seguridad</h2>
        <p style={pStyle}>SeJus aplica las siguientes medidas técnicas y organizativas para proteger tus datos:</p>
        <ul style={ulStyle}>
          <li>
            <b>Cifrado en tránsito:</b> toda la comunicación entre tu navegador y la aplicación se realiza mediante
            HTTPS con certificado SSL.
          </li>
          <li>
            <b>Cifrado de contraseñas:</b> las contraseñas nunca se almacenan en texto plano. La gestión de
            contraseñas la realiza Supabase Auth con estándares de seguridad actuales.
          </li>
          <li>
            <b>Control de acceso por filas (Row Level Security):</b> cada profesor solo puede acceder a sus propios
            datos. A nivel de base de datos, es técnicamente imposible que un usuario acceda a los datos de otro.
          </li>
          <li>
            <b>Cabeceras de seguridad:</b> la aplicación implementa cabeceras HTTP de seguridad (Content Security
            Policy, HSTS y otras).
          </li>
          <li>
            <b>Limitación de peticiones:</b> los endpoints sensibles (especialmente la generación de comentarios
            con IA) tienen limitación de peticiones por dirección IP para prevenir el abuso.
          </li>
        </ul>

        <h2 style={h2Style}>6. Tus derechos</h2>
        <p style={pStyle}>Como usuario registrado en SeJus, puedes ejercer los siguientes derechos sobre tus datos personales:</p>
        <ul style={ulStyle}>
          <li>
            <b>Acceso:</b> saber qué datos tenemos sobre ti.
          </li>
          <li>
            <b>Rectificación:</b> corregir datos incorrectos o incompletos.
          </li>
          <li>
            <b>Supresión:</b> solicitar la eliminación de tus datos cuando ya no sean necesarios.
          </li>
          <li>
            <b>Oposición:</b> oponerte a determinados tratamientos.
          </li>
          <li>
            <b>Limitación:</b> solicitar que limitemos el uso de tus datos en determinadas circunstancias.
          </li>
          <li>
            <b>Portabilidad:</b> recibir tus datos en un formato estructurado y de uso común.
          </li>
        </ul>
        <p style={pStyle}>
          Cómo ejercerlos: envía un email a{" "}
          <a href="mailto:suport@sejusedu.com" style={linkStyle}>
            suport@sejusedu.com
          </a>{" "}
          indicando el derecho que deseas ejercer y adjuntando una copia de tu documento de identidad. Respondemos
          en un plazo máximo de un mes desde la recepción de la solicitud.
        </p>
        <p style={pStyle}>
          Si consideras que el tratamiento de tus datos no es correcto, tienes derecho a presentar una reclamación
          ante la Agencia Española de Protección de Datos (AEPD):{" "}
          <a href="https://www.aepd.es" target="_blank" rel="noopener" style={linkStyle}>
            aepd.es
          </a>
        </p>

        <h2 style={h2Style}>7. Sesión y almacenamiento local</h2>
        <p style={pStyle}>
          SeJus utiliza el localStorage del navegador para almacenar el token de sesión de Supabase. Este mecanismo
          no utiliza cookies de terceros ni de seguimiento publicitario. Su única finalidad es mantener la sesión
          activa entre visitas.
        </p>

        <h2 style={h2Style}>8. Cambios en esta política</h2>
        <p style={pStyle}>
          Si modificamos esta política de privacidad, lo comunicaremos por email al profesorado registrado con al
          menos 15 días de antelación si los cambios son sustanciales. La versión actualizada siempre estará
          disponible en la aplicación.
        </p>

        <h2 style={h2Style}>9. Contrato de encargado del tratamiento</h2>
        <p style={pStyle}>
          Dado que SeJus trata datos del alumnado por cuenta de los centros educativos, la relación entre SeJus y
          cada centro debe formalizarse mediante un contrato de encargado del tratamiento (Data Processing
          Agreement o DPA), conforme al artículo 28 del RGPD.
        </p>
        <p style={pStyle}>
          Los centros educativos interesados pueden solicitar este contrato escribiendo a{" "}
          <a href="mailto:suport@sejusedu.com" style={linkStyle}>
            suport@sejusedu.com
          </a>
          .
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

const tableWrapStyle = {
  overflowX: "auto",
  marginBottom: 14,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 12.5,
};

const thStyle = {
  textAlign: "left",
  padding: "7px 9px",
  background: COLORS.paper,
  color: COLORS.ink2,
  fontWeight: 700,
  border: `1px solid ${COLORS.line}`,
  whiteSpace: "nowrap",
};

const tdStyle = {
  textAlign: "left",
  padding: "7px 9px",
  color: COLORS.ink2,
  border: `1px solid ${COLORS.line}`,
  verticalAlign: "top",
};

const backStyle = {
  display: "inline-block",
  marginTop: 28,
  fontSize: 13,
  fontWeight: 600,
  color: COLORS.clay,
  textDecoration: "none",
};
