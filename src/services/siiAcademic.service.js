import 'dotenv/config';

const baseUrl = process.env.SII_BASE_URL.replace(/\/+$/, '');

const apiUrl = baseUrl.endsWith('/api')
  ? baseUrl
  : `${baseUrl}/api`;

export async function getAcademicData(endpoint, token) {
  try {
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      signal: AbortSignal.timeout(15000)
    });

    const data = await response.json().catch(() => null);

    return {
      status: response.status,
      data
    };
  } catch (error) {
    console.error('Error consultando el SII:', error.message);

    throw Object.assign(
      new Error(
        error.name === 'TimeoutError'
          ? 'El SII tardó demasiado en responder.'
          : 'No fue posible comunicarse con el SII.'
      ),
      { status: error.name === 'TimeoutError' ? 504 : 502 }
    );
  }
}
