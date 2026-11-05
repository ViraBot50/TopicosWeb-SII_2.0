export async function getAdmins(pool) {
  const result = await pool.query(
    `SELECT id, email, active, created_at
     FROM public.admin_users
     ORDER BY created_at DESC`
  );

  return result.rows;
}

export async function getAdminById(pool, id) {
  const result = await pool.query(
    `SELECT id, email, active, created_at
     FROM public.admin_users
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

export async function createAdmin(pool, email) {
  const result = await pool.query(
    `INSERT INTO public.admin_users (email)
     VALUES ($1)
     RETURNING id, email, active, created_at`,
    [email]
  );

  return result.rows[0];
}

export async function updateAdmin(pool, id, fields) {
  const columns = {
    email: 'email',
    active: 'active'
  };

  const assignments = [];
  const values = [];

  for (const [key, value] of Object.entries(fields)) {
    if (columns[key]) {
      values.push(value);
      assignments.push(`${columns[key]} = $${values.length}`);
    }
  }

  if (assignments.length === 0) {
    return null;
  }

  values.push(id);

  const result = await pool.query(
    `UPDATE public.admin_users
     SET ${assignments.join(', ')}
     WHERE id = $${values.length}
     RETURNING id, email, active, created_at`,
    values
  );

  return result.rows[0] || null;
}

export async function deleteAdmin(pool, id) {
  const result = await pool.query(
    `DELETE FROM public.admin_users
     WHERE id = $1
     RETURNING id, email`,
    [id]
  );

  return result.rows[0] || null;
}
