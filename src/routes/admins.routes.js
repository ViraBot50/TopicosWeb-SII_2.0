import { Router } from 'express';

import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

import {
  listAdmins,
  registerAdmin,
  editAdmin,
  removeAdmin
} from '../controllers/admins.controller.js';

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

// Todas las rutas requieren autenticación y privilegios administrativos.
router.use(requireAuth, requireAdmin);

router.get('/', listAdmins);

router.post('/', verifyOrigin, registerAdmin);

router.patch('/:id', verifyOrigin, editAdmin);

router.delete('/:id', verifyOrigin, removeAdmin);

export default router;