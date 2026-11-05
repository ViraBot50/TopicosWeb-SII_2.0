import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  VALID_CATEGORIES
} from '../services/announcements.service.js';

import { getAcademicData } from '../services/siiAcademic.service.js';

function getPool(req) {
  return req.app.locals.pool;
}

function sendError(res, status, message) {
  return res.status(status).json({
    success: false,
    message
  });
}

function validId(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function validateFields(fields) {
  if (
    fields.title !== undefined &&
    (
      typeof fields.title !== 'string' ||
      !fields.title.trim() ||
      fields.title.trim().length > 120
    )
  ) {
    return 'El título es obligatorio y debe tener máximo 120 caracteres.';
  }

  if (
    fields.content !== undefined &&
    (
      typeof fields.content !== 'string' ||
      !fields.content.trim() ||
      fields.content.trim().length > 5000
    )
  ) {
    return 'El contenido es obligatorio y debe tener máximo 5000 caracteres.';
  }

  if (
    fields.category !== undefined &&
    !VALID_CATEGORIES.includes(fields.category)
  ) {
    return 'La categoría seleccionada no es válida.';
  }

  return null;
}

// GET /api/avisos
export async function listAnnouncements(req, res) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const { category, search } = req.query;

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return sendError(res, 400, 'Los parámetros de paginación no son válidos.');
    }

    if (
      category !== undefined &&
      !VALID_CATEGORIES.includes(category)
    ) {
      return sendError(res, 400, 'La categoría no es válida.');
    }

    if (search !== undefined && typeof search !== 'string') {
      return sendError(res, 400, 'El término de búsqueda no es válido.');
    }

    const result = await getAnnouncements(getPool(req), {
      page,
      limit,
      category,
      search: search?.trim() || undefined
    });

    return res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('[AVISOS] Error consultando:', error.message);
    return sendError(res, 500, 'No fue posible consultar los avisos.');
  }
}

// GET /api/avisos/mis-avisos
export async function listMyAnnouncements(req, res) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return sendError(res, 400, 'Los parámetros de paginación no son válidos.');
    }

    const result = await getAnnouncements(getPool(req), {
      page,
      limit,
      authorEmail: req.session.email
    });

    return res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('[AVISOS] Error consultando publicaciones propias:', error.message);
    return sendError(res, 500, 'No fue posible consultar tus avisos.');
  }
}

// GET /api/avisos/:id
export async function getAnnouncement(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return sendError(res, 400, 'El identificador no es válido.');
    }

    const announcement = await getAnnouncementById(getPool(req), id);

    if (!announcement) {
      return sendError(res, 404, 'El aviso no existe.');
    }

    return res.json({
      success: true,
      data: announcement
    });
  } catch (error) {
    console.error('[AVISOS] Error consultando aviso:', error.message);
    return sendError(res, 500, 'No fue posible consultar el aviso.');
  }
}

// POST /api/avisos
export async function publishAnnouncement(req, res) {
  try {
    const { title, content, category = 'otros' } = req.body ?? {};

    const validationError = validateFields({
      title,
      content,
      category
    });

    if (validationError) {
      return sendError(res, 400, validationError);
    }

    if (!req.session.email) {
      return sendError(res, 401, 'No se pudo identificar al usuario.');
    }

    let authorName = req.session.email;
    let controlNumber = null;

    try {
      const profileResult = await getAcademicData(
        '/movil/estudiante',
        req.siiToken
      );

      if (profileResult.status === 401) {
        return sendError(
          res,
          401,
          'Tu sesión institucional expiró. Inicia sesión nuevamente.'
        );
      }

      if (
        profileResult.status === 200 &&
        typeof profileResult.data?.data?.persona === 'string'
      ) {
        authorName = profileResult.data.data.persona;
        controlNumber =
          profileResult.data.data.numero_control ?? null;
      }
    } catch (error) {
      console.warn(
        '[AVISOS] No fue posible obtener el perfil académico:',
        error.message
      );
    }

    const announcement = await createAnnouncement(getPool(req), {
      title: title.trim(),
      content: content.trim(),
      category,
      author_email: req.session.email,
      author_name: authorName,
      control_number: controlNumber
    });

    return res.status(201).json({
      success: true,
      message: 'Aviso publicado correctamente.',
      data: announcement
    });
  } catch (error) {
    console.error('[AVISOS] Error publicando:', error.message);
    return sendError(res, 500, 'No fue posible publicar el aviso.');
  }
}

// PATCH /api/avisos/:id
export async function editAnnouncement(req, res) {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body ?? {};

    if (!validId(id)) {
      return sendError(res, 400, 'El identificador no es válido.');
    }

    const fields = { title, content, category };

    for (const [key, value] of Object.entries(fields)) {
      if (value === undefined) {
        delete fields[key];
      }
    }

    const validationError = validateFields(fields);

    if (validationError) {
      return sendError(res, 400, validationError);
    }

    if (!Object.keys(fields).length) {
      return sendError(res, 400, 'Debes proporcionar al menos un campo para actualizar.');
    }

    if (fields.title !== undefined) {
      fields.title = fields.title.trim();
    }

    if (fields.content !== undefined) {
      fields.content = fields.content.trim();
    }

    const announcement = await updateAnnouncement(
      getPool(req),
      id,
      fields
    );

    if (!announcement) {
      return sendError(res, 404, 'El aviso no existe.');
    }

    return res.json({
      success: true,
      message: 'Aviso actualizado correctamente.',
      data: announcement
    });
  } catch (error) {
    console.error('[AVISOS] Error actualizando:', error.message);
    return sendError(res, 500, 'No fue posible actualizar el aviso.');
  }
}

// DELETE /api/avisos/:id
export async function removeAnnouncement(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return sendError(res, 400, 'El identificador no es válido.');
    }

    const deleted = await deleteAnnouncement(
      getPool(req),
      id
    );

    if (!deleted) {
      return sendError(res, 404, 'El aviso no existe.');
    }

    return res.json({
      success: true,
      message: 'Aviso eliminado correctamente.',
      data: {
        id: deleted.id
      }
    });
  } catch (error) {
    console.error('[AVISOS] Error eliminando:', error.message);
    return sendError(res, 500, 'No fue posible eliminar el aviso.');
  }
}
