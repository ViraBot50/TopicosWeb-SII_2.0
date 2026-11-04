import 'dotenv/config';

export async function loginInstitutional(email, password) {
  const baseUrl = process.env.SII_BASE_URL.replace(/\/+$/, '');

  const loginUrl = baseUrl.endsWith('/api')
    ? `${baseUrl}/login`
    : `${baseUrl}/api/login`;

  let response;

  try {
    response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(15000)
    });
  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw Object.assign(
        new Error('El SII tardó demasiado en responder.'),
        { status: 504 }
      );
    }

    throw Object.assign(
      new Error('No fue posible comunicarse con el SII.'),
      { status: 502 }
    );
  }

  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    throw Object.assign(
      new Error('Correo o contraseña incorrectos.'),
      { status: 401 }
    );
  }

  if (!response.ok) {
    throw Object.assign(
      new Error('El servicio del SII respondió con un error.'),
      { status: 502 }
    );
  }

  // Estructura real de respuesta del SII.
  const token = data?.message?.login?.token;

  if (typeof token !== 'string' || !token.trim()) {
    throw Object.assign(
      new Error('La respuesta del SII no contiene un token válido.'),
      { status: 502 }
    );
  }

  return token.trim();
}
