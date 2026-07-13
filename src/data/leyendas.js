import imgMessi from '../assets/images/messi.jpg';
import imgMaradona from '../assets/images/maradona.jpg';
import imgPele from '../assets/images/pele.jpg';
import imgCristiano from '../assets/images/cristianoronaldo.jpg';
import imgBaggio from '../assets/images/baggio.jpg';
import imgZidane from '../assets/images/zidane.jpg';

// Nuevas incorporaciones
import imgCruyff from '../assets/images/cruyff.jpg';
import imgIniesta from '../assets/images/iniesta.jpg';
import imgXavi from '../assets/images/xavi.jpg';
import imgMuller from '../assets/images/muller.jpg';
import imgBeckham from '../assets/images/beckham.jpg';
import imgCharlton from '../assets/images/charlton.jpg';
import imgEusebio from '../assets/images/eusebio.jpg';
import imgHenry from '../assets/images/henry.jpg';
import imgPlatini from '../assets/images/platini.jpg';
import imgMbappe from '../assets/images/mbappe.jpg';
import imgModric from '../assets/images/modric.jpg';
import imgNeymar from '../assets/images/neymar.jpg';
import imgKroos from '../assets/images/kroos.jpg';
import imgHaaland from '../assets/images/haaland.jpg';

export const LEYENDAS_BASE = [
  // --- TUS 6 JUGADORES ORIGINALES CORREGIDOS ---
  { 
    id: 1, 
    nombre: 'MESSI', 
    goles: '840+', 
    copas: 1, 
    color: '#4ade80', 
    image: imgMessi, 
    bandera: '🇦🇷', 
    stats: { goleador: 98, titulos: 95, disciplina: 85, presion: 96 } 
  },
  { 
    id: 2, 
    nombre: 'MARADONA', 
    goles: '345', 
    copas: 1, 
    color: '#f87171', 
    image: imgMaradona, 
    bandera: '🇦🇷', 
    stats: { goleador: 85, titulos: 90, disciplina: 45, presion: 99 } 
  },
  { 
    id: 3, 
    nombre: 'PELÉ', 
    goles: '757', 
    copas: 3, 
    color: '#fbbf24', 
    image: imgPele, 
    bandera: '🇧🇷', 
    stats: { goleador: 97, titulos: 100, disciplina: 80, presion: 94 } 
  },
  { 
    id: 4, 
    nombre: 'CRISTIANO RONALDO', 
    goles: '890+', 
    copas: 0, 
    color: '#0066ff', 
    image: imgCristiano, 
    bandera: '🇵🇹', 
    stats: { goleador: 99, titulos: 65, disciplina: 90, presion: 97 } 
  },
  { 
    id: 5, 
    nombre: 'BAGGIO', 
    goles: '318', 
    copas: 0, 
    color: '#60a5fa', 
    image: imgBaggio, 
    bandera: '🇮🇹', 
    stats: { goleador: 82, titulos: 55, disciplina: 88, presion: 80 } 
  },
  { 
    id: 6, 
    nombre: 'ZIDANE', 
    goles: '156', 
    copas: 1, 
    color: '#a78bfa', 
    image: imgZidane, 
    bandera: '🇫🇷', 
    stats: { goleador: 78, titulos: 88, disciplina: 70, presion: 98 } 
  },

  // --- NUEVAS 9 LEYENDAS (ESPAÑA, ALEMANIA, INGLATERRA, FRANCIA, PORTUGAL, PAÍSES BAJOS) ---
  { 
    id: 7, 
    nombre: 'INIESTA', 
    goles: '102', 
    copas: 1, 
    color: '#f43f5e', 
    image: imgIniesta, 
    bandera: '🇪🇸', 
    stats: { goleador: 68, titulos: 96, disciplina: 98, presion: 99 } // Presión alta por el gol en la final
  },
  { 
    id: 8, 
    nombre: 'XAVI', 
    goles: '121', 
    copas: 1, 
    color: '#e11d48', 
    image: imgXavi, 
    bandera: '🇪🇸', 
    stats: { goleador: 70, titulos: 96, disciplina: 96, presion: 94 } 
  },
  { 
    id: 9, 
    nombre: 'GERD MÜLLER', 
    goles: '735', 
    copas: 1, 
    color: '#a8a29e', 
    image: imgMuller, 
    bandera: '🇩🇪', 
    stats: { goleador: 96, titulos: 88, disciplina: 82, presion: 92 } 
  },
  { 
    id: 10, 
    nombre: 'BECKHAM', 
    goles: '146', 
    copas: 0, 
    color: '#38bdf8', 
    image: imgBeckham, 
    bandera: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 
    stats: { goleador: 75, titulos: 50, disciplina: 84, presion: 88 } 
  },
  { 
    id: 11, 
    nombre: 'BOBBY CHARLTON', 
    goles: '309', 
    copas: 1, 
    color: '#0284c7', 
    image: imgCharlton, 
    bandera: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 
    stats: { goleador: 84, titulos: 85, disciplina: 95, presion: 90 } 
  },
  { 
    id: 12, 
    nombre: 'HENRY', 
    goles: '417', 
    copas: 1, 
    color: '#c084fc', 
    image: imgHenry, 
    bandera: '🇫🇷', 
    stats: { goleador: 90, titulos: 88, disciplina: 85, presion: 89 } 
  },
  { 
    id: 13, 
    nombre: 'PLATINI', 
    goles: '353', 
    copas: 0, 
    color: '#818cf8', 
    image: imgPlatini, 
    bandera: '🇫🇷', 
    stats: { goleador: 88, titulos: 60, disciplina: 78, presion: 91 } 
  },
  { 
    id: 14, 
    nombre: 'EUSÉBIO', 
    goles: '621', 
    copas: 0, 
    color: '#2563eb', 
    image: imgEusebio, 
    bandera: '🇵🇹', 
    stats: { goleador: 94, titulos: 55, disciplina: 80, presion: 93 } 
  },
  { 
    id: 15, 
    nombre: 'CRUYFF', 
    goles: '424', 
    copas: 0, 
    color: '#fb923c', 
    image: imgCruyff, 
    bandera: '🇳🇱', 
    stats: { goleador: 89, titulos: 65, disciplina: 85, presion: 95 } 
  },
  { 
    id: 16, 
    nombre: 'KYLIAN MBAPPÉ', 
    goles: '330+', 
    copas: 1, 
    color: '#a78bfa', 
    image: imgMbappe, 
    bandera: '🇫🇷', 
    stats: { goleador: 95, titulos: 92, disciplina: 80, presion: 98 } // Presión altísima por su hat-trick en la final de 2022
  },
  { 
    id: 17, 
    nombre: 'LUKA MODRIC', 
    goles: '120+', 
    copas: 0, 
    color: '#f43f5e', 
    image: imgModric, 
    bandera: '🇭🇷', 
    stats: { goleador: 74, titulos: 80, disciplina: 96, presion: 95 } // Balón de Oro en 2018 y subcampeón del mundo
  },
  { 
    id: 18, 
    nombre: 'NEYMAR JR', 
    goles: '430+', 
    copas: 0, 
    color: '#fbbf24', 
    image: imgNeymar, 
    bandera: '🇧🇷', 
    stats: { goleador: 91, titulos: 60, disciplina: 70, presion: 88 } // Máximo goleador histórico de la selección brasileña
  },
  { 
    id: 19, 
    nombre: 'TONI KROOS', 
    goles: '80+', 
    copas: 1, 
    color: '#a8a29e', 
    image: imgKroos, 
    bandera: '🇩🇪', 
    stats: { goleador: 72, titulos: 95, disciplina: 98, presion: 97 } // Campeón en 2014, precisión quirúrgica y alta disciplina
  },
  { 
    id: 20, 
    nombre: 'ERLING HAALAND', 
    goles: '260+', 
    copas: 0, 
    color: '#38bdf8', // Color celeste por el Manchester City
    image: imgHaaland, 
    bandera: '🇳🇴', 
    stats: { goleador: 97, titulos: 70, disciplina: 85, presion: 90 }
  }  
];