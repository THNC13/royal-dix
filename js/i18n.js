/* English / Spanish.
   The site is written in English. When the page is in Spanish, this file translates what is on screen
   (including text the other scripts add later) using the lists below. Names of people and teams are never changed.
   To add or fix a Spanish phrase, edit EXACT (whole phrases) or REP (patterns with numbers in them). */
(function () {
  "use strict";
  var KEY = "rd-lang", lang = "en";
  try {
    var m = /[?&]lang=(en|es)\b/.exec(location.search);
    if (m) { lang = m[1]; localStorage.setItem(KEY, lang); }
    else lang = localStorage.getItem(KEY) === "es" ? "es" : "en";
  } catch (e) { var m2 = /[?&]lang=(en|es)\b/.exec(location.search); if (m2) lang = m2[1]; }

  var I = (window.RDI = { lang: lang, es: lang === "es", locale: lang === "es" ? "es-ES" : "en-GB" });
  I.set = function (l) {
    try { localStorage.setItem(KEY, l); } catch (e) {}
    var u = location.href.replace(/([?&])lang=(en|es)&?/, "$1").replace(/[?&]$/, "");
    location.href = u;
  };
  if (lang !== "es") { I.t = function (s) { return s; }; return; }

  document.documentElement.setAttribute("lang", "es");

  // ---------- Whole phrases ----------
  var EXACT = {
    // top bar and page titles
    "Home": "Inicio", "Player Rankings": "Ranking de jugadores", "League Ranking": "Ranking de la liga", "League Table": "Clasificación",
    "Fixtures": "Calendario", "Our Team": "Nuestro equipo", "Memories": "Recuerdos", "Rules": "Reglas",
    "Royal Dix home": "Royal Dix, inicio", "Pages": "Páginas", "Switch language": "Cambiar idioma", "Live match": "Partido en directo",
    "Time to kick-off": "Tiempo para el comienzo",
    "Royal Dix · Econ Winter Pool League": "Royal Dix · Liga de Pool de Invierno Econ",
    "Player Rankings · Royal Dix": "Ranking de jugadores · Royal Dix", "League Ranking · Royal Dix": "Ranking de la liga · Royal Dix",
    "League Table · Royal Dix": "Clasificación · Royal Dix", "Fixtures · Royal Dix": "Calendario · Royal Dix", "Our Team · Royal Dix": "Nuestro equipo · Royal Dix",
    "Memories · Royal Dix": "Recuerdos · Royal Dix", "Rules · Royal Dix": "Reglas · Royal Dix",
    "Royal Dix fixtures, league table and player rankings for the Econ Winter Pool League 2026/27.": "Calendario, clasificación y ranking de jugadores del Royal Dix en la Liga de Pool de Invierno Econ 2026/27.",
    "Royal Dix player rankings: win percentage from singles, doubles and all frames.": "Ranking de jugadores del Royal Dix: porcentaje de victorias en individuales, dobles y todas las partidas.",
    "The league's official player ranking, shown once published.": "El ranking oficial de jugadores de la liga, cuando se publique.",
    "Econ Winter Pool League 2026/27 team table.": "Clasificación por equipos de la Liga de Pool de Invierno Econ 2026/27.",
    "Royal Dix fixtures and results for the Econ Winter Pool League 2026/27.": "Calendario y resultados del Royal Dix en la Liga de Pool de Invierno Econ 2026/27.",
    "The Royal Dix squad.": "La plantilla del Royal Dix.",
    "The Royal Dix photo album: add your pictures from our nights.": "El álbum de fotos del Royal Dix: añade tus fotos de nuestras noches.",
    "Quick-reference 8-ball rules for the Fuengirola Pool League, with a rule finder for use during a match.": "Reglas rápidas de bola 8 de la Liga de Pool de Fuengirola, con buscador de reglas para usar durante el partido.",

    // home
    "Royal Dix team badge: an eight ball under a crown, with crossed cues and flags": "Escudo del Royal Dix: una bola 8 bajo una corona, con tacos cruzados y banderas",
    "Pick a pocket above to see the stats": "Elige una tronera arriba para ver las estadísticas",
    "Tonight": "Esta noche", "Tomorrow": "Mañana", "home": "casa", "away": "fuera", "tbc": "por confirmar", "bye": "descanso", "break": "pausa",
    "Fixtures to be confirmed": "Calendario por confirmar", "More fixtures to be confirmed": "Más partidos por confirmar", "League break": "Parón de liga",

    // players
    "Player rankings": "Ranking de jugadores",
    "Ranked on win %, then frames won. Updated": "Ordenado por % de victorias y luego por partidas ganadas. Actualizado",
    "Which frames to count": "Qué partidas contar", "Singles": "Individuales", "Doubles": "Dobles", "All frames": "Todas las partidas",
    "Singles only. These frames decide the league's player ranking and top player.": "Solo individuales. Estas partidas deciden el ranking de jugadores de la liga y el mejor jugador.",
    "Doubles frames on their own. They don't count towards the league ranking.": "Solo las partidas de dobles. No cuentan para el ranking de la liga.",
    "Our own Royal Dix table: every singles and doubles frame together.": "La tabla propia del Royal Dix: todas las partidas de individuales y dobles juntas.",
    "No frames recorded for this view yet.": "Todavía no hay partidas registradas en esta vista.",
    "Pos": "Pos", "Player": "Jugador", "P": "PJ", "W": "PG", "L": "PP", "F": "PF", "A": "PC", "Gp": "PJ", "Win %": "% vict.", "Form": "Forma", "Pts": "Pts", "Team": "Equipo",
    "Frames played": "Partidas jugadas", "Frames won": "Partidas ganadas", "Frames lost": "Partidas perdidas", "Ranking games played": "Partidas de ranking jugadas", "Games won": "Partidas ganadas",
    "Matches played": "Partidos jugados", "Matches won": "Partidos ganados", "Matches lost": "Partidos perdidos", "Frames for": "Partidas a favor", "Frames against": "Partidas en contra", "Frame difference": "Diferencia de partidas",
    "Captain": "Capitán", "Won": "Ganada", "Lost": "Perdida",

    // league
    "League ranking": "Ranking de la liga", "League table": "Clasificación",
    "Not published yet. The league site shows no player ranking so far this season. It will appear here once the league publishes it.": "Aún no está publicado. La web de la liga no muestra ranking de jugadores esta temporada. Aparecerá aquí cuando la liga lo publique.",
    "The league's own player ranking, singles frames only.": "El ranking de jugadores de la propia liga, solo individuales.",

    // fixtures and team
    "Fixtures 26/27": "Calendario 26/27", "Thursday nights. Scores are league points out of 10.": "Los jueves por la noche. Las puntuaciones son puntos de liga sobre 10.",
    "Bye": "Descanso", "Break": "Pausa", "TBC": "Por confirmar", "Rest week": "Semana de descanso",
    "Christmas break: 17, 24 and 31 Dec": "Vacaciones de Navidad: 17, 24 y 31 dic",
    "Our team": "Nuestro equipo", "Everyone in the Royal Dix rack. Ball numbers follow the team sheet.": "Todo el Royal Dix en el triángulo. Los números de bola siguen la hoja del equipo.",
    "Yet to play": "Aún sin jugar",
    "Last updated": "Última actualización",

    // memories
    "Pictures from our nights. Anyone with the link can add one.": "Fotos de nuestras noches. Cualquiera con el enlace puede añadir una.",
    "Add photos": "Añadir fotos", "Tap to take one or pick from your gallery": "Toca para hacer una foto o elegir de tu galería",
    "Your name (optional)": "Tu nombre (opcional)", "Your name": "Tu nombre",
    "Caption (optional), e.g. Wobbly Dix night": "Pie de foto (opcional), p. ej. noche contra Wobbly Dix", "Caption": "Pie de foto",
    "No photos yet. Be the first to add one.": "Aún no hay fotos. Sé el primero en añadir una.",
    "The photo album isn't switched on yet. Check back soon.": "El álbum de fotos aún no está activado. Vuelve pronto.",
    "The photo album isn't switched on yet.": "El álbum de fotos aún no está activado.",
    "Couldn't load the album. Pull down to refresh.": "No se pudo cargar el álbum. Desliza hacia abajo para actualizar.",
    "Royal Dix photo": "Foto del Royal Dix", "Pick a photo to add.": "Elige una foto para añadir.",
    "Added! Looking good.": "¡Añadida! Qué buena pinta.", "Nothing was added.": "No se añadió nada.", "Upload failed.": "Error al subir la foto.",
    "That one didn't work. Try again.": "Esa no funcionó. Inténtalo de nuevo.",
    "Could not read the upload.": "No se pudo leer la foto.", "No photo found.": "No se encontró ninguna foto.", "That photo is too big.": "Esa foto es demasiado grande.",
    "Only JPG, PNG or WebP photos, please.": "Solo fotos JPG, PNG o WebP, por favor.", "The album is full.": "El álbum está lleno.",
    "Only the person who added this photo can delete it.": "Solo quien añadió esta foto puede borrarla.", "Wrong team code.": "Código de equipo incorrecto.", "Deleting isn't set up.": "El borrado no está configurado.",
    "Delete photo": "Borrar foto", "Delete (captain)": "Borrar (capitán)", "Tap again to delete this photo": "Toca otra vez para borrar esta foto",
    "Team code": "Código del equipo", "Delete": "Borrar", "Cancel": "Cancelar", "Close": "Cerrar", "Previous": "Anterior", "Next": "Siguiente",
    "Deleting…": "Borrando…", "That code isn't right. Try again.": "Ese código no es correcto. Inténtalo de nuevo.",
    "Deleting isn't switched on yet. Add the TEAM_CODE secret in Cloudflare first.": "Borrar aún no está activado. Primero añade el secreto TEAM_CODE en Cloudflare.",
    "Couldn't delete that photo.": "No se pudo borrar esa foto.", "No connection. Try again.": "Sin conexión. Inténtalo de nuevo.", "Type the team code first.": "Escribe primero el código del equipo.",

    // rules page
    "Quick-reference 8-ball rules for the league. Describe what happened and get the rule, or browse them all below. The referee's decision is final.": "Reglas rápidas de bola 8 para la liga. Cuenta lo que pasó y te damos la regla, o consulta todas más abajo. La decisión del árbitro es definitiva.",
    "What happened?": "¿Qué ha pasado?",
    "e.g. My cue ball was touching the black and I played it. Foul?": "p. ej. Mi bola blanca tocaba la negra y la jugué. ¿Falta?",
    "Example questions": "Preguntas de ejemplo",
    "Cue ball touching an opponent's ball": "Bola blanca tocando una bola del rival", "Potted the black on the break": "Metí la negra en el saque",
    "Can I pot the 8 and another ball?": "¿Puedo meter la 8 y otra bola a la vez?", "Played out of turn": "Jugué fuera de turno", "Nobody can make a legal shot": "Nadie puede hacer un tiro legal",
    "Ask your captain for the code": "Pide el código al capitán", "Ask the rules assistant": "Preguntar al asistente de reglas",
    "Matching rules appear as you type. The assistant gives a plain-English ruling from these rules.": "Las reglas relacionadas aparecen mientras escribes. El asistente da un dictamen claro basado en estas reglas.",
    "Matching rules": "Reglas relacionadas", "All the rules": "Todas las reglas", "Tap a heading to open it.": "Toca un título para abrirlo.",
    "Loading the rules…": "Cargando las reglas…",
    "These are short summaries written for use at the table. The full wording is on the league's own": "Son resúmenes cortos pensados para usar en la mesa. El texto completo está en la",
    "Rules page": "página de reglas", "page de reglas": "página de reglas",
    ", and if anything differs, the official rules and the referee win. AI answers can be wrong: if it matters, ask the referee.": " de la propia liga (en inglés). Si algo difiere, mandan las reglas oficiales y el árbitro. Las respuestas de la IA pueden fallar: si es importante, pregunta al árbitro.",
    "Describe what happened first, in a sentence.": "Primero describe lo que pasó, en una frase.", "Checking the rules…": "Consultando las reglas…",
    "AI answer based on the league rules. The referee's decision is final.": "Respuesta de IA basada en las reglas de la liga. La decisión del árbitro es definitiva.",
    "Enter the team code to use the assistant.": "Escribe el código del equipo para usar el asistente.",
    "The assistant isn't available right now. The matching rules below still work.": "El asistente no está disponible ahora mismo. Las reglas relacionadas de abajo siguen funcionando.",
    "Couldn't reach the assistant. The matching rules below still work.": "No se pudo contactar con el asistente. Las reglas relacionadas de abajo siguen funcionando.",
    "No matching rule found. Try the assistant, or ask the referee.": "No se encontró ninguna regla. Prueba con el asistente o pregunta al árbitro.",
    "Closest rules": "Reglas más parecidas",
    "The rules didn't load. Check your connection and refresh the page.": "Las reglas no se cargaron. Revisa tu conexión y actualiza la página.",
    "The rules assistant isn't switched on yet. Ask the site owner to switch it on.": "El asistente de reglas aún no está activado. Pide al dueño de la web que lo active.",
    "That team code isn't right. Ask your captain for it.": "Ese código de equipo no es correcto. Pídeselo al capitán.",
    "Describe what happened first.": "Primero describe lo que pasó.", "Couldn't load the rules file.": "No se pudo cargar el archivo de reglas.",
    "Couldn't reach the assistant. Try the matching rules below.": "No se pudo contactar con el asistente. Prueba con las reglas de abajo.",
    "The assistant couldn't answer just now. Try the matching rules below.": "El asistente no pudo responder ahora. Prueba con las reglas de abajo.",
    "The free assistant is busy or used up for today. Try the matching rules below.": "El asistente gratuito está ocupado o ha agotado su límite de hoy. Prueba con las reglas de abajo.",
    "No answer came back. Try rewording the question.": "No llegó ninguna respuesta. Prueba a reformular la pregunta.",

    // match-day pop-up, ticker, live panel
    "Today is match day": "Hoy es día de partido", "Match day": "Día de partido", "At home": "En casa", "Away": "Fuera",
    "Let’s go!": "¡Vamos!", "Let’s go": "Vamos", "Let’s get after it, lads.": "¡A por ello, chicos!", "Let’s go again, lads.": "¡A por otra, chicos!",
    "Big win needed": "Hace falta una gran victoria", "Get your eye in": "A afinar la vista", "This week": "Esta semana", "Match tomorrow": "Partido mañana",
    "Full time": "Final", "Full time · Win": "Final · Victoria", "Full time · Draw": "Final · Empate", "Great win": "Gran victoria", "We go again": "Seguimos", "A point each": "Un punto para cada uno",
    "Great win, guys! Brilliant work.": "¡Gran victoria, chicos! Trabajo brillante.",
    "We lost this one, but we go again. Chins up, Royal Dix.": "Esta la perdimos, pero seguimos. Arriba esa cabeza, Royal Dix.",
    "Honours even. We take the point and go again.": "Reparto de honores. Nos llevamos el punto y a por la siguiente.",
    "Kick-off": "Comienzo", "Live": "En directo", "Starting soon": "Empieza pronto", "Match under way": "Partido en marcha", "Starting now": "Empieza ya", "In play": "En juego",
    "Updates every few seconds": "Se actualiza cada pocos segundos"
  };

  // ---------- Patterns (applied in order, anywhere in the text) ----------
  var REP = [
    [/^We’re (\S+), lads\. Keep it going tonight!$/, "Somos $1, chicos. ¡Sigamos así esta noche!"],
    [/^We’re (\S+), lads\. We need a big win tonight!$/, "Somos $1, chicos. ¡Necesitamos una gran victoria esta noche!"],
    [/^We’re (\S+), lads\. A win today and we’ll be right up there!$/, "Somos $1, chicos. ¡Con una victoria hoy estaremos ahí arriba!"],
    [/^We’re (\S+), lads\. We need a big win!$/, "Somos $1, chicos. ¡Necesitamos una gran victoria!"],
    [/^We’re (\S+), lads\. Let’s keep it going!$/, "Somos $1, chicos. ¡Que siga la racha!"],
    [/^Royal Dix away at (.+)$/, "Royal Dix visita a $1"],
    [/^(.+) are (\S+) on (\d+) pts$/, "$1 es $2 con $3 pts"],
    [/^Next match · Week (\d+)$/, "Próximo partido · Semana $1"],
    [/^Next up · Week (\d+)$/, "A continuación · Semana $1"],
    [/^Season (.+)$/, "Temporada $1"],
    [/^(.+) in the table$/, "$1 en la clasificación"],
    [/^Then (.+)$/, "Luego $1"],
    [/ · in (\d+) days$/, " · en $1 días"],
    [/won (\d+), lost (\d+)/, function (m, w, l) { return w + (w === "1" ? " ganado, " : " ganados, ") + l + (l === "1" ? " perdido" : " perdidos"); }],
    [/(\d+) (pts?) ahead/, "$1 $2 por delante"], [/(\d+) (pts?) behind/, "$1 $2 por detrás"], [/level on points/, "igualados a puntos"],
    [/ in the league · /, " en la liga · "],
    [/^Wk (.+)$/, "Sem. $1"], [/^From /, "Desde "],
    [/^Singles (\d+)\/(\d+)$/, "Individuales $1/$2"], [/^Doubles (\d+)\/(\d+)$/, "Dobles $1/$2"],
    [/^Singles (\d+) in play$/, "Individual $1 en juego"], [/^Doubles (\d+) in play$/, "Dobles $1 en juego"],
    [/^Singles (\d+) (won|lost)$/, function (m, n, r) { return "Individual " + n + (r === "won" ? " ganado" : " perdido"); }],
    [/^Doubles (\d+) (won|lost)$/, function (m, n, r) { return "Dobles " + n + (r === "won" ? " ganado" : " perdido"); }],
    [/^Singles (\d+)$/, "Individual $1"], [/^Doubles (\d+)$/, "Dobles $1"],
    [/^Starts (\d{1,2}:\d{2})$/, "Empieza a las $1"],
    [/^Kick-off (\d{1,2}:\d{2}): (.+)$/, "Comienzo $1: $2"],
    [/^Live (.+ .+)$/, "En directo $1"], [/^Full time (.+)$/, "Final $1"],
    [/^(\d+) frames to (\d+) · (\d+) of (\d+) played · match point to the winner$/, "Partidas $1–$2 · $3 de $4 jugadas · el punto de partido es para el ganador"],
    [/ & /g, " y "],
    [/^Next match: /, "Próximo partido: "], [/\. Next match: /, ". Próximo partido: "],
    [/^Bye week \((.+)\)/, "Semana de descanso ($1)"],
    [/, at home to /, ", en casa contra "], [/, away at /, ", de visitante en "],
    [/^Open photo/, "Abrir foto"], [/^Added by /, "Añadida por "],
    [/^(\d+) photos added!$/, "¡$1 fotos añadidas!"], [/^Adding photo (\d+) of (\d+)…$/, "Añadiendo foto $1 de $2…"],
    [/^Checking the rules…$/, "Consultando las reglas…"],
    // league names and sentences with a date or week in them
    [/\. Includes Royal Dix v El Barquito from week 7\. The other week 7 results will follow/, ". Incluye el Royal Dix v El Barquito de la semana 7. El resto de resultados de la semana 7 se añadirán pronto"],
    [/\. Includes Smokeys Men v Royal Dix from week 6\. The other week 6 results will follow/, ". Incluye el Smokeys Men v Royal Dix de la semana 6. El resto de resultados de la semana 6 se añadirán pronto"],
    [/Econ Winter Pool League/g, "Liga de Pool de Invierno Econ"],
    [/, after week (\d+)/, ", tras la semana $1"],
    [/\. Points appear after the first results\./, ". Los puntos aparecerán tras los primeros resultados."],
    [/Every player in the league, singles frames only, worked out from the published results/, "Todos los jugadores de la liga, solo individuales, calculado a partir de los resultados publicados"],
    [/The league's own player ranking, singles frames only/, "El ranking de jugadores de la propia liga, solo individuales"],
    [/\. Ranked on win %, then frames won\./, ". Ordenado por % de victorias y luego por partidas ganadas."],
    [/ The league hasn't posted its own ranking yet\./, " La liga aún no ha publicado su propio ranking."]
  ];

  var cache = {};
  function t(s) {
    if (!s) return s;
    var m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s), core = m[2];
    if (!core || !/[A-Za-z]/.test(core)) return s;
    if (cache.hasOwnProperty(core)) return m[1] + cache[core] + m[3];
    var out = EXACT.hasOwnProperty(core) ? EXACT[core] : core;
    if (out === core) {
      for (var i = 0; i < REP.length; i++) out = out.replace(REP[i][0], REP[i][1]);
    }
    if (core.length < 200) cache[core] = out;
    return m[1] + out + m[3];
  }
  I.t = t;

  // ---------- Apply to the page ----------
  var ATTRS = ["placeholder", "aria-label", "title", "alt", "content"];
  function fixAttr(el) {
    if (el.nodeType !== 1) return;
    if (el.tagName === "META" && el.getAttribute("name") !== "description") return;
    ATTRS.forEach(function (a) {
      if (!el.hasAttribute(a)) return;
      if (a === "content" && el.tagName !== "META") return;
      var v = el.getAttribute(a), n = t(v);
      if (n !== v) el.setAttribute(a, n);
    });
  }
  function walk(node) {
    if (node.nodeType === 3) {
      var p = node.parentNode && node.parentNode.nodeName;
      if (p === "SCRIPT" || p === "STYLE" || p === "TEXTAREA") return;
      var n = t(node.nodeValue); if (n !== node.nodeValue) node.nodeValue = n;
      return;
    }
    if (node.nodeType !== 1 || node.nodeName === "SCRIPT" || node.nodeName === "STYLE") return;
    fixAttr(node);
    for (var c = node.firstChild; c; c = c.nextSibling) walk(c);
  }
  function title() { var n = t(document.title); if (n !== document.title) document.title = n; }
  new MutationObserver(function (list) {
    list.forEach(function (r) {
      if (r.type === "childList") r.addedNodes.forEach(walk);
      else if (r.type === "characterData") walk(r.target);
      else if (r.type === "attributes") fixAttr(r.target);
    });
    title();
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  document.addEventListener("DOMContentLoaded", function () { walk(document.documentElement); title(); });
})();
