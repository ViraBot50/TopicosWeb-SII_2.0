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

async function checkIsAdmin(req) {
  const result = await req.app.locals.pool.query(
    `SELECT EXISTS (
       SELECT 1
       FROM public.admin_users
       WHERE LOWER(email) = LOWER($1)
         AND active = TRUE
     ) AS is_admin`,
    [req.session.email]
  );

  return result.rows[0].is_admin;
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

    // Consultar si el usuario tiene permisos de administrador.
    let isAdmin = false;

    try {
      isAdmin = await checkIsAdmin(req);
    } catch (error) {
      console.error('Error consultando rol:', error.message);
    }

    // Responder con la información del usuario y su rol.
    return res.json({
      autenticado: true,
      mensaje: 'Inicio de sesión exitoso.',
      usuario: {
        email: req.session.email,
        administrador: isAdmin
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

router.get('/session', async (req, res) => {
  const autenticado = Boolean(
    req.session?.authenticated &&
    req.session?.siiTokenEncrypted
  );

  if (!autenticado) {
    return res.json({
      autenticado: false,
      usuario: null
    });
  }

  try {
    const isAdmin = await checkIsAdmin(req);

    return res.json({
      autenticado: true,
      usuario: {
        email: req.session.email,
        administrador: isAdmin
      }
    });
  } catch (error) {
    console.error('Error consultando rol:', error.message);

    return res.status(500).json({
      mensaje: 'No fue posible consultar los permisos del usuario.'
    });
  }
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
