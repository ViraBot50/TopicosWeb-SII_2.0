import { Router } from 'express';
import { loginInstitutional } from '../services/siiAuth.service.js';
import { encryptToken } from '../config/crypto.js';

const router = Router();

const frontendOrigin = new URL(process.env.FRONTEND_URL).origin;
const isProduction = process.env.NODE_ENV === 'production';

// Protección básica contra solicitudes de otros orígenes.
function verifyOrigin(req, res, next) {
  const origin = req.get('origin');

  if (origin !== frontendOrigin) {
    return res.status(403).json({
      mensaje: 'Origen no autorizado.'
    });
  }

  next();
}

// POST /api/auth/login
router.post('/login', verifyOrigin, async (req, res) => {
  const { email, password } = req.body ?? {};

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      mensaje: 'Debes proporcionar correo y contraseña.'
    });
  }

  try {
    // Validar credenciales directamente contra el SII.
    const accessToken = await loginInstitutional(
      email.trim(),
      password
    );

    // Regenerar el identificador para evitar session fixation.
    await new Promise((resolve, reject) => {
      req.session.regenerate((error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    // Guardar únicamente el token cifrado en la sesión.
    req.session.authenticated = true;
    req.session.email = email.trim();
    req.session.siiTokenEncrypted = encryptToken(accessToken);
    req.session.authenticatedAt = new Date().toISOString();

    // Asegurar que la sesión quede guardada en PostgreSQL.
    await new Promise((resolve, reject) => {
      req.session.save((error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    return res.json({
      autenticado: true,
      mensaje: 'Inicio de sesión exitoso.',
      usuario: {
        email: req.session.email
      }
    });
    } catch (error) {
    console.error("[AUTH] Error:", error.message);
    console.error("[AUTH] Código:", error.status);

    return res.status(error.status || 500).json({
      mensaje: error.status
        ? error.message
        : 'Ocurrió un error al iniciar sesión.'
    });
  }
});

// GET /api/auth/session
router.get('/session', (req, res) => {
  res.json({
    autenticado: Boolean(
      req.session?.authenticated &&
      req.session?.siiTokenEncrypted
    ),
    usuario: req.session?.authenticated
      ? { email: req.session.email }
      : null
  });
});

// POST /api/auth/logout
router.post('/logout', verifyOrigin, (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Error cerrando sesión:', error.message);

      return res.status(500).json({
        mensaje: 'No fue posible cerrar la sesión.'
      });
    }

    res.clearCookie('sii.sid', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/'
    });

    return res.json({
      autenticado: false,
      mensaje: 'Sesión cerrada correctamente.'
    });
  });
});

export default router;
