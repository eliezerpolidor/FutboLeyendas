import React, { useState } from 'react';
import './home.css';
import { LEYENDAS_BASE } from '../data/leyendas';
import { GoogleGenAI } from '@google/genai';

function Home() {
  // 1. Estados para controlar el valor de cada slider de forma independiente
  const [goleador, setGoleador] = useState(85);
  const [titulos, setTitulos] = useState(70);
  const [disciplina, setDisciplina] = useState(50);
  const [presion, setPresion] = useState(60);

  const [seleccionados, setSeleccionados] = useState([]); // Guardará los IDs de los 2 elegidos
  const [verDuelo, setVerDuelo] = useState(false); // Alterna entre la Pantalla 1 y la Pantalla 2

  // --- ESTADOS PARA EL ANÁLISIS DINÁMICO DE LA IA ---
  const [veredictoIA, setVeredictoIA] = useState("");
  const [cargandoAnalisis, setCargandoAnalisis] = useState(false);

  // Lógica del ranking:
  // - Cada slider controla el "peso" de la stat.
  // - Para que el slider 100 de una stat la haga dominar (sin depender de las demás),
  //   normalizamos cada stat dividiéndola por su máximo dentro del dataset.
  // - Luego aplicamos ponderación por slider/100.
  const maxG = Math.max(...LEYENDAS_BASE.map((p) => p.stats.goleador));
  const maxT = Math.max(...LEYENDAS_BASE.map((p) => p.stats.titulos));
  const maxD = Math.max(...LEYENDAS_BASE.map((p) => p.stats.disciplina));
  const maxP = Math.max(...LEYENDAS_BASE.map((p) => p.stats.presion));

  const jugadoresOrdenados = [...LEYENDAS_BASE].sort((a, b) => {
    const wG = goleador / 100;
    const wT = titulos / 100;
    const wD = disciplina / 100;
    const wP = presion / 100;

    // Para evitar que atributos con pesos bajos aún afecten,
    // usamos ponderación por stat y luego normalizamos por el total de pesos activos.
    const pesoTotal = wG + wT + wD + wP;

    const scoreA =
      (wG * (a.stats.goleador / maxG) +
        wT * (a.stats.titulos / maxT) +
        wD * (a.stats.disciplina / maxD) +
        wP * (a.stats.presion / maxP)) /
      (pesoTotal || 1);

    const scoreB =
      (wG * (b.stats.goleador / maxG) +
        wT * (b.stats.titulos / maxT) +
        wD * (b.stats.disciplina / maxD) +
        wP * (b.stats.presion / maxP)) /
      (pesoTotal || 1);

    return scoreB - scoreA;
  });

  // --- MANEJADOR DE SELECCIÓN DE TARJETAS ---
  const handleSeleccionarJugador = (id) => {
    setSeleccionados((prev) => {
      if (prev.includes(id)) return prev.filter((player) => player !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  // Obtener los objetos completos de los contendientes seleccionados para la pantalla 2
  const contendiente1 = LEYENDAS_BASE.find(j => j.id === seleccionados[0]);
  const contendiente2 = LEYENDAS_BASE.find(j => j.id === seleccionados[1]);

  // --- FUNCIÓN PARA GENERAR EL ANÁLISIS EN TIEMPO REAL ---
  // --- FUNCIÓN PARA GENERAR EL ANÁLISIS EN TIEMPO REAL CON GEMINI REAL ---
  const manejarGenerarAnalisis = async () => {
    if (!contendiente1 || !contendiente2) {
      setVeredictoIA("⚠️ Selecciona 2 jugadores para poder generar el análisis.");
      return;
    }

    setCargandoAnalisis(true);
    setVeredictoIA("🧠 Gemini está analizando las trayectorias en el coliseo real...");

    try {
      // 1. Inicializamos el cliente usando la variable de entorno de Vite
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        setVeredictoIA(
          "❌ Falta `VITE_GEMINI_API_KEY` en tu .env (.env.local). " +
            "Reinicia el servidor luego de corregirlo."
        );
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      // 2. Creamos un prompt dinámico y estructurado enviándole todo el contexto deportivo
      const promptContexto = `
        Actúa como un experto e imparcial juez deportivo de fútbol histórico en un coliseo analítico.
        Debes dar un veredicto final y detallado para un duelo entre dos leyendas.
        
        Criterios de evaluación elegidos por el usuario (ponderación de importancia):
        - Poder Goleador: ${goleador}%
        - Títulos Mundiales: ${titulos}%
        - Juego Rápido y Disciplina: ${disciplina}%
        - Efectividad Bajo Presión: ${presion}%

        Contendiente 1:
        - Nombre: ${contendiente1.nombre}
        - Goles históricos: ${contendiente1.goles}
        - Copas/Títulos importantes: ${contendiente1.copas}

        Contendiente 2:
        - Nombre: ${contendiente2.nombre}
        - Goles históricos: ${contendiente2.goles}
        - Copas/Títulos importantes: ${contendiente2.copas}

        Analiza brevemente cómo influyen los porcentajes elegidos por el usuario en las estadísticas de cada jugador y emite un veredicto definitivo declarando un ganador o un empate técnico muy bien argumentado. Mantén una redacción épica, profesional y emocionante. Termina mencionando que el análisis fue procesado de forma exitosa por los modelos generativos de Gemini.
      `;

      // 3. Llamamos al modelo gemini-3-flash-preview
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ text: promptContexto }],
      });

      // 4. Guardamos la respuesta real en el estado (soporta distintos formatos según SDK)
      const text =
        response?.text ??
        response?.response?.text ??
        response?.candidates?.[0]?.content?.parts?.map((p) => p?.text).join('') ??
        "";

      if (!text) {
        setVeredictoIA(
          "⚠️ Se recibió respuesta pero no se pudo extraer el texto. Revisa la consola para más detalles."
        );
        console.log('Respuesta completa de Gemini:', response);
        return;
      }

      setVeredictoIA(text);

    } catch (error) {
      console.error("Error con Gemini API:", error);

      const message = error?.message ? String(error.message) : 'Error desconocido';
      const status = error?.status ? String(error.status) : '';

      // No mostrar la API key (por seguridad). Solo el detalle del error.
      setVeredictoIA(
        `❌ Error Gemini: ${message}${status ? ` (status: ${status})` : ''}. ` +
          "Verifica API key, permisos del modelo y conexión de red. Revisa consola (F12)."
      );
    } finally {
      setCargandoAnalisis(false);
    }
  };

  // --- RENDERING CONDICIONAL DE LAS PANTALLAS (PANTALLA 2 - COLISEO) ---
  if (verDuelo && contendiente1 && contendiente2) {
    return (
      <div className="screen-background">
        <div className="stadium-overlay" />
        
        {/* === SEGUNDA PANTALLA: DUELO DE LEYENDAS === */}
        <div className="duel-container">
          
          {/* Panel Flotante Izquierdo: Valores del Usuario */}
          <div className="user-criteria-badge">
            <div className="criteria-item"><span className="dot-g">🎯</span> <span className="val-g">{goleador}%</span> PODER GOLEADOR</div>
            <div className="criteria-item"><span className="dot-t">🏆</span> <span className="val-t">{titulos}%</span> TÍTULOS MUNDIALES</div>
            <div className="criteria-item"><span className="dot-d">🟨</span> <span className="val-d">{disciplina}%</span> JUEGA RÁPIDO / DISCIPLINA</div>
            <div className="criteria-item"><span className="dot-p">🎯</span> <span className="val-p">{presion}%</span> EFECTIVIDAD BAJO PRESIÓN</div>
          </div>

          <header className="duel-header">
            <h1 className="duel-main-title">DUELO DE LEYENDAS</h1>
            <h2 className="duel-sub-title">EL COLISEO DE LA IA | <span className="highlight-gemini">VERDICTO FINAL GEMINI</span></h2>
          </header>

          <div className="arena-row">
            {/* Contendiente 1 + Pedestal */}
            <div className="stage-wrapper">
              <div className="player-card duel-card" style={{ borderColor: contendiente1.color, boxShadow: `0 0 20px ${contendiente1.color}80` }}>
                <div className="card-top-row">
                  <div className="card-type-icon" style={{ color: contendiente1.color, borderColor: contendiente1.color }}>⚽</div>
                  <span className="card-position">PS</span>
                  <span className="card-rank">#1</span>
                </div>
                <div className="card-image-container">
                  <img src={contendiente1.image} alt={contendiente1.nombre} className="player-image" />
                </div>
                <div className="card-bottom-block">
                  <h4 className="player-name">{contendiente1.nombre}</h4>
                  <div className="card-stats-row">
                    <span className="stat-item">⚽ {contendiente1.goles}</span>
                    <span className="stat-item">🏆 {contendiente1.copas}</span>
                  </div>
                  {/* Bandera simulada con emoji o puedes usar un div con background */}
                  <div className="country-flag-box">
                    {contendiente1.nombre.includes('MESSI') || contendiente1.nombre.includes('MARADONA') ? '🇦🇷' : '🇧🇷'}
                  </div>
                </div>
              </div>
              <div className="pedestal-platform"></div>
            </div>

            {/* Logo Central VS Neón */}
            <div className="vs-neon-container">
              <span className="vs-green">V</span>
              <span className="vs-blue">S</span>
            </div>

            {/* Contendiente 2 + Pedestal */}
            <div className="stage-wrapper">
              <div className="player-card duel-card" style={{ borderColor: contendiente2.color, boxShadow: `0 0 20px ${contendiente2.color}80` }}>
                <div className="card-top-row">
                  <div className="card-type-icon" style={{ color: contendiente2.color, borderColor: contendiente2.color }}>⚽</div>
                  <span className="card-position">PS</span>
                  <span className="card-rank">#4</span>
                </div>
                <div className="card-image-container">
                  <img src={contendiente2.image} alt={contendiente2.nombre} className="player-image" />
                </div>
                <div className="card-bottom-block">
                  <h4 className="player-name">{contendiente2.nombre}</h4>
                  <div className="card-stats-row">
                    <span className="stat-item">⚽ {contendiente2.goles}</span>
                    <span className="stat-item">🏆 {contendiente2.copas}</span>
                  </div>
                  <div className="country-flag-box">
                    {contendiente2.nombre.includes('CRISTIANO') ? '🇵🇹' : '🇮🇹'}
                  </div>
                </div>
              </div>
              <div className="pedestal-platform"></div>
            </div>
          </div>

          {/* Botones de Acción */}
          {/* <div className="action-zone-arena">
            <button className="ai-generate-button-arena">
              <span className="brain-icon">🧠</span> GENERAR ANÁLISIS CON IA
            </button>
            <button className="back-olympo-btn" onClick={() => { setVerDuelo(false); setSeleccionados([]); }}>
              ⬅ Volver al Olimpo
            </button>
          </div> */}

          {/* Botones de Acción - Conexión Corregida */}
          <div className="action-zone-arena" style={{ position: 'relative', zIndex: 20, margin: '20px 0' }}>
            <button 
              className="ai-generate-button-arena" 
              onClick={() => manejarGenerarAnalisis()} // <--- Forzamos la ejecución aquí
              disabled={cargandoAnalisis}
              style={{ 
                opacity: cargandoAnalisis ? 0.7 : 1, 
                cursor: cargandoAnalisis ? 'wait' : 'pointer',
                pointerEvents: 'auto' // <--- Evita que capas invisibles bloqueen el clic
              }}
            >
              <span className="brain-icon">🧠</span> {cargandoAnalisis ? "PROCESANDO..." : "GENERAR ANÁLISIS CON IA"}
            </button>
            
            <button 
              className="back-olympo-btn" 
              onClick={() => { setVerDuelo(false); setSeleccionados([]); setVeredictoIA(""); }}
              style={{ pointerEvents: 'auto' }}
            >
              <span>⬅</span> Volver al Olimpo
            </button>
          </div> 

          {/* Caja del Veredicto Dinámico Conectado (REEMPLAZO REALIZADO) */}
          <div className="verdict-scroll-box">
            <h3 className="verdict-box-title">
              <span className="verdict-brain">🧠</span> VERDICTO DE LA INTELIGENCIA ARTIFICIAL <span className="verdict-brand">(GEMINI)</span>
            </h3>
            <div className="verdict-content-paragraph" style={{ fontStyle: !veredictoIA ? 'italic' : 'normal', color: !veredictoIA ? '#64748b' : '#cbd5e1' }}>
              {veredictoIA || "⚡ Presiona el botón 'GENERAR ANÁLISIS CON IA' superior para activar los modelos de lenguaje y calcular el veredicto final en base a tus sliders."}
            </div>
          </div>

        </div>
      </div>
    );
  }



  // === PANTALLA 1: TABLERO PRINCIPAL DEL OLIMPO ===
  return (
    <div className="screen-background">
      <div className="stadium-overlay" />

      <div className="main-container">
        
        {/* === COLUMNA IZQUIERDA: PANEL INTERACTIVO === */}
        <div className="left-column">
          <header className="header-container">
            <div className="logo-container">
              <div className="logo-circle">⚽</div>
              <div className="title-group">
                <h1 className="main-title">FútboLeyendas</h1>
                <h2 className="sub-title">EL OLIMPO DEL FÚTBOL</h2>
              </div>
            </div>
            <p className="header-details">EL TABLERO DEL OLIMPO | RANKING DINÁMICO | 10 LEYENDAS HISTÓRICAS</p>
          </header>

          <section className="control-panel">
            <h3 className="panel-title">¿QUÉ DEFINE A TU JUGADOR?</h3>
            
            {/* Slider 1: Poder Goleador */}
            <div className="slider-group">
              <div className="slider-label-row">
                <span className="slider-icon">⚽</span>
                <span className="slider-text">PODER GOLEADOR</span>
                <span style={{ color: '#4ade80', fontWeight: 700 }}>{goleador}%</span>
              </div>
              <div className="slider-track-wrapper">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={goleador} 
                  onChange={(e) => setGoleador(Number(e.target.value))}
                  className="interactive-slider"
                  style={{ '--accent-color': '#4ade80' }}
                />
              </div>
            </div>

            {/* Slider 2: Títulos Mundiales */}
            <div className="slider-group">
              <div className="slider-label-row">
                <span className="slider-icon">🏆</span>
                <span className="slider-text">TÍTULOS MUNDIALES</span>
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>{titulos}%</span>
              </div>
              <div className="slider-track-wrapper">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={titulos} 
                  onChange={(e) => setTitulos(Number(e.target.value))}
                  className="interactive-slider"
                  style={{ '--accent-color': '#fbbf24' }}
                />
              </div>
            </div>

            {/* Slider 3: Juega Rápido / Disciplina */}
            <div className="slider-group">
              <div className="slider-label-row">
                <span className="slider-icon">🟨</span>
                <span className="slider-text">JUEGA RÁPIDO / DISCIPLINA</span>
                <span style={{ color: '#eef2ff', fontWeight: 700 }}>{disciplina}%</span>
              </div>
              <div className="slider-track-wrapper">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={disciplina} 
                  onChange={(e) => setDisciplina(Number(e.target.value))}
                  className="interactive-slider"
                  style={{ '--accent-color': '#eef2ff' }}
                />
              </div>
            </div>

            {/* Slider 4: Efectividad bajo Presión */}
            <div className="slider-group">
              <div className="slider-label-row">
                <span className="slider-icon">🎯</span>
                <span className="slider-text">EFECTIVIDAD BAJO PRESIÓN</span>
                <span style={{ color: '#f87171', fontWeight: 700 }}>{presion}%</span>
              </div>
              <div className="slider-track-wrapper">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={presion} 
                  onChange={(e) => setPresion(Number(e.target.value))}
                  className="interactive-slider"
                  style={{ '--accent-color': '#f87171' }}
                />
              </div>
            </div>

            {/* NUEVO BOTÓN DINÁMICO CON TU PROPUESTA "DUELO ENTRE DOS" */}
           <button 
              className={`versus-button ${seleccionados.length === 2 ? 'active-ready' : ''}`}
              disabled={seleccionados.length !== 2}
              onClick={() => setVerDuelo(true)}
              style={{ cursor: seleccionados.length === 2 ? 'pointer' : 'not-allowed' }}
            >
              <span className="versus-icon">⚔</span>
              {seleccionados.length === 2 ? 'Duelo entre dos' : `Selecciona 2 jugadores (${seleccionados.length}/2)`}
            </button>
          </section>
        </div>

        {/* === COLUMNA DERECHA: GRILLA COMPORTÁNDOSE DINÁMICAMENTE === */}
        <section className="cards-grid">
          {jugadoresOrdenados.map((jugador, index) => (
            <div 
              key={jugador.id} 
              className={`player-card ${seleccionados.includes(jugador.id) ? 'selected-for-battle' : ''}`} 
              onClick={() => handleSeleccionarJugador(jugador.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSeleccionarJugador(jugador.id); }}
              style={{ 
                borderColor: jugador.color, 
                boxShadow: `0 0 15px ${jugador.color}80`,
                transition: 'all 0.4s ease-in-out' // Transición suave al cambiar puestos
              }}
            >
              <div className="card-top-row">
                <div className="card-type-icon" style={{ color: jugador.color, borderColor: jugador.color }}>⚽</div>
                <span className="card-position">PS</span>
                <span className="card-rank">#{index + 1}</span> {/* El puesto (#1, #2...) se asigna por su lugar real ordenado */}
              </div>
              
              <div className="card-image-container">
                {jugador.image ? (
                  <img src={jugador.image} alt={jugador.nombre} className="player-image" />
                ) : (
                  <div className="image-placeholder">SIN FOTO</div>
                )}
              </div>

              <div className="card-bottom-block">
                <h4 className="player-name">{jugador.nombre}</h4>
                <div className="card-stats-row">
                  <span className="stat-item">⚽ {jugador.goles}</span>
                  <span className="stat-item">🏆 {jugador.copas}</span>
                </div>
                {seleccionados.includes(jugador.id) && <span className="swords-badge">✓ SELECCIONADO</span>}

              </div>
            </div>
          ))}
        </section>

      </div>

      <footer className="footer-container">
        Powered by Passion
      </footer>
    </div>
  );
}

export default Home;