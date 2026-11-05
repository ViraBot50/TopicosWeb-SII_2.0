import {
  getAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin
} from '../services/admins.service.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPool(req) {
  return req.app.locals.pool;
}

function validUUID(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function sendError(res, status, message) {
  return res.status(status).json({
    success: false,
    message
  });
}

// GET /api/admins
export async function listAdmins(req, res) {
  try {
    const data = await getAdmins(getPool(req));

    return res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error listando administradores:', error.message);
    return sendError(res, 500, 'No fue posible consultar los administradores.');
  }
}

// POST /api/admins
export async function registerAdmin(req, res) {
  const email = req.body?.email;

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return sendError(res, 400, 'Debes proporcionar un correo válido.');
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const pool = getPool(req);

    const existing = await pool.query(
      `SELECT id FROM public.admin_users
       WHERE LOWER(email) = LOWER($1)`,
      [normalizedEmail]
    );

    if (existing.rows.length > 0) {
      return sendError(res, 409, 'Este correo ya está registrado como administrador.');
    }

    const data = await createAdmin(pool, normalizedEmail);

    return res.status(201).json({
      success: true,
      message: 'Administrador registrado correctamente.',
      data
    });
  } catch (error) {
    console.error('Error registrando administrador:', error.message);
    return sendError(res, 500, 'No fue posible registrar al administrador.');
  }
}

// PATCH /api/admins/:id
export async function editAdmin(req, res) {
  const { id } = req.params;
  const { email, active } = req.body ?? {};

  if (!validUUID(id)) {
    return sendError(res, 400, 'El identificador no es válido.');
  }

  const fields = {};

  if (email !== undefined) {
    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return sendError(res, 400, 'El correo no es válido.');
    }

    fields.email = email.trim().toLowerCase();
  }

  if (active !== undefined) {
    if (typeof active !== 'boolean') {
      return sendError(res, 400, 'El estado debe ser verdadero o falso.');
    }

    fields.active = active;
  }

  if (Object.keys(fields).length === 0) {
    return sendError(res, 400, 'Debes proporcionar un correo o un estado para modificar.');
  }

  try {
    const pool = getPool(req);
    const target = await getAdminById(pool, id);

    if (!target) {
      return sendError(res, 404, 'Administrador no encontrado.');
    }

    if (target.email.toLowerCase() === req.session.email.toLowerCase()) {
      return sendError(res, 403, 'No puedes modificar tu propio registro de administrador.');
    }

    if (fields.email) {
      const duplicate = await pool.query(
        `SELECT id FROM public.admin_users
         WHERE LOWER(email) = LOWER($1)
           AND id <> $2`,
        [fields.email, id]
      );

      if (duplicate.rows.length > 0) {
        return sendError(res, 409, 'El correo ya pertenece a otro administrador.');
      }
    }

    const data = await updateAdmin(pool, id, fields);

    if (!data) {
      return sendError(res, 404, 'No se pudo modificar el administrador.');
    }

    return res.json({
      success: true,
      message: 'Administrador actualizado correctamente.',
      data
    });
  } catch (error) {
    console.error('Error modificando administrador:', error.message);
    return sendError(res, 500, 'No fue posible modificar al administrador.');
  }
}

// DELETE /api/admins/:id
export async function removeAdmin(req, res) {
  const { id } = req.params;

  if (!validUUID(id)) {
    return sendError(res, 400, 'El identificador no es válido.');
  }

  try {
    const pool = getPool(req);
    const target = await getAdminById(pool, id);

    if (!target) {
      return sendError(res, 404, 'Administrador no encontrado.');
    }

    if (target.email.toLowerCase() === req.session.email.toLowerCase()) {
      return sendError(res, 403, 'No puedes eliminar tu propio registro de administrador.');
    }

    const data = await deleteAdmin(pool, id);

    if (!data) {
      return sendError(res, 404, 'No se pudo eliminar al administrador.');
    }

    return res.json({
      success: true,
      message: 'Administrador eliminado correctamente.',
      data
    });
  } catch (error) {
    console.error('Error eliminando administrador:', error.message);
    return sendError(res, 500, 'No fue posible eliminar al administrador.');
  }
}
