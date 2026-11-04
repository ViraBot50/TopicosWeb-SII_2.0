import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { getAcademicData } from '../services/siiAcademic.service.js';

const router = Router();

const endpoints = {
  perfil: '/movil/estudiante',
  calificaciones: '/movil/estudiante/calificaciones',
  kardex: '/movil/estudiante/kardex',
  horarios: '/movil/estudiante/horarios'
};

// Todas las rutas académicas requieren autenticación.
router.use(requireAuth);

async function consultarSII(req, res, endpoint) {
  try {
    const result = await getAcademicData(endpoint, req.siiToken);

    // Si el SII rechaza el JWT, invalidamos nuestra sesión local.
    if (result.status === 401) {
      await new Promise((resolve) => {
        req.session.destroy(() => resolve());
      });

      res.clearCookie('sii.sid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });

      return res.status(401).json({
        mensaje: 'Tu sesión institucional expiró. Inicia sesión nuevamente.'
      });
    }

    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(error.status || 502).json({
      mensaje: error.message || 'Error consultando información académica.'
    });
  }
}

router.get('/perfil', (req, res) =>
  consultarSII(req, res, endpoints.perfil)
);

router.get('/calificaciones', (req, res) =>
  consultarSII(req, res, endpoints.calificaciones)
);

router.get('/kardex', (req, res) =>
  consultarSII(req, res, endpoints.kardex)
);

router.get('/horarios', (req, res) =>
  consultarSII(req, res, endpoints.horarios)
);

export default router;
