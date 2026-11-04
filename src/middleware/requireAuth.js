import { decryptToken } from '../config/crypto.js';

export function requireAuth(req, res, next) {
  if (
    !req.session?.authenticated ||
    !req.session?.siiTokenEncrypted
  ) {
    return res.status(401).json({
      mensaje: 'Debes iniciar sesión para continuar.'
    });
  }

  try {
    // Disponible únicamente para el código del backend.
    req.siiToken = decryptToken(req.session.siiTokenEncrypted);
    next();
  } catch (error) {
    console.error('No se pudo recuperar el token:', error.message);

    req.session.destroy(() => {});

    return res.status(401).json({
      mensaje: 'La sesión no es válida. Inicia sesión nuevamente.'
    });
  }
}
