import { Router } from 'express';

import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

import {
  listAnnouncements,
  listMyAnnouncements,
  getAnnouncement,
  publishAnnouncement,
  editAnnouncement,
  removeAnnouncement
} from '../controllers/announcements.controller.js';

const router = Router();

const frontendOrigin = new URL(process.env.FRONTEND_URL).origin;

function verifyOrigin(req, res, next) {
  const origin = req.get('origin');

  if (origin !== frontendOrigin) {
    return res.status(403).json({
      success: false,
      message: 'Origen no autorizado.'
    });
  }

  next();
}

// Todas las rutas requieren sesión institucional.
router.use(requireAuth);

// Consultas: cualquier usuario autenticado.
router.get('/mis-avisos', listMyAnnouncements);
router.get('/', listAnnouncements);
router.get('/:id', getAnnouncement);

// Escritura: únicamente administradores.
router.post('/', verifyOrigin, requireAdmin, publishAnnouncement);
router.patch('/:id', verifyOrigin, requireAdmin, editAnnouncement);
router.delete('/:id', verifyOrigin, requireAdmin, removeAnnouncement);

export default router;