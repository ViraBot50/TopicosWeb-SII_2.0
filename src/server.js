import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';
import authRoutes from './routes/auth.routes.js';
import academicRoutes from './routes/academic.routes.js';

const { Pool } = pg;

const requiredVariables = [
  'FRONTEND_URL',
  'SII_BASE_URL',
  'SESSION_SECRET',
  'SESSION_ENCRYPTION_KEY',
  'DATABASE_URL'
];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(`Falta configurar ${variable} en .env`);
  }
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.set('trust proxy', 1);
}

// Conexión a PostgreSQL.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('error', (error) => {
  console.error('Error inesperado en PostgreSQL:', error.message);
});

// CORS.
app.use(cors({
  origin: new URL(process.env.FRONTEND_URL).origin,
  credentials: true
}));

app.use(express.json({ limit: '20kb' }));

// Almacenamiento de sesiones en PostgreSQL.
const PgSession = connectPgSimple(session);

const sessionStore = new PgSession({
  pool,
  tableName: 'user_sessions',
  createTableIfMissing: true,
  pruneSessionInterval: 15 * 60
});

sessionStore.on('error', (error) => {
  console.error('Error en sesiones:', error.message);
});

// Configuración de sesiones.
app.use(session({
  name: 'sii.sid',
  store: sessionStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
   httpOnly: true,
   secure: isProduction,
   sameSite: isProduction ? 'none' : 'lax',
   maxAge: 8 * 60 * 60 * 1000
}
}));

// Rutas.
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Backend del proyecto SII funcionando',
    estado: 'OK'
  });
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    res.json({
      servidor: 'OK',
      baseDeDatos: 'Conectada'
    });
  } catch (error) {
    console.error('Error comprobando PostgreSQL:', error.message);

    res.status(500).json({
      servidor: 'OK',
      baseDeDatos: 'Error de conexión'
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/academico', academicRoutes);

// Iniciar servidor.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});
