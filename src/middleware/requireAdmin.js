export async function requireAdmin(req, res, next) {
  try {
    const email = req.session?.email;

    if (!email) {
      return res.status(401).json({
        success: false,
        message: 'Debes iniciar sesión.'
      });
    }

    const pool = req.app.locals.pool;

    const result = await pool.query(
      `SELECT id, email, active
       FROM public.admin_users
       WHERE LOWER(email) = LOWER($1)
         AND active = TRUE
       LIMIT 1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos de administrador.'
      });
    }

    req.adminUser = result.rows[0];

    next();
  } catch (error) {
    console.error('Error verificando administrador:', error.message);

    return res.status(500).json({
      success: false,
      message: 'No fue posible verificar los permisos de administrador.'
    });
  }
}