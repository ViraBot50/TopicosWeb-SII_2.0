export const VALID_CATEGORIES = [
  'academico',
  'eventos',
  'general',
  'servicios',
  'otros'
];

export async function getAnnouncements(pool, {
  page = 1,
  limit = 10,
  category,
  search,
  authorEmail
} = {}) {
  const conditions = [];
  const values = [];

  if (category) {
    values.push(category);
    conditions.push(`category = $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    conditions.push(
      `(title ILIKE $${values.length} OR content ILIKE $${values.length})`
    );
  }

  if (authorEmail) {
    values.push(authorEmail);
    conditions.push(`LOWER(author_email) = LOWER($${values.length})`);
  }

  const where = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM public.announcements
     ${where}`,
    values
  );

  const total = countResult.rows[0].total;
  const offset = (page - 1) * limit;

  const dataResult = await pool.query(
    `SELECT *
     FROM public.announcements
     ${where}
     ORDER BY created_at DESC
     LIMIT $${values.length + 1}
     OFFSET $${values.length + 2}`,
    [...values, limit, offset]
  );

  return {
    data: dataResult.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getAnnouncementById(pool, id) {
  const result = await pool.query(
    `SELECT *
     FROM public.announcements
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

export async function createAnnouncement(pool, announcement) {
  const {
    title,
    content,
    category,
    author_email,
    author_name,
    control_number
  } = announcement;

  const result = await pool.query(
    `INSERT INTO public.announcements (
       title,
       content,
       category,
       author_email,
       author_name,
       control_number
     )
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      title,
      content,
      category,
      author_email,
      author_name,
      control_number
    ]
  );

  return result.rows[0];
}

export async function updateAnnouncement(pool, id, fields) {
  const columns = {
    title: 'title',
    content: 'content',
    category: 'category'
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
    `UPDATE public.announcements
     SET ${assignments.join(', ')}
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  return result.rows[0] || null;
}

export async function deleteAnnouncement(pool, id) {
  const result = await pool.query(
    `DELETE FROM public.announcements
     WHERE id = $1
     RETURNING id`,
    [id]
  );

  return result.rows[0] || null;
}
