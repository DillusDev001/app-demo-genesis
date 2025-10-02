export interface DecodedToken {
    exp?: number; // Campo para la expiración del token
    [key: string]: any; // Otros campos del token
}

/**
 * Decodifica un JWT sin usar librerías.
 * @param token El token JWT (string).
 * @returns {DecodedToken | null} El contenido del token decodificado, o `null` si es inválido.
 */
export function decodeJWT(token: string): DecodedToken | null {
    try {
        const payloadBase64 = token.split('.')[1]; // Extraer la parte del payload
        const payload = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')); // Decodificar Base64URL
        return JSON.parse(payload); // Parsear a objeto
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
}

export function decodeJWTUsuario(token: string): DecodedToken | null {
    try {
        const payloadBase64 = token.split('.')[1]; // Extraer la parte del payload
        const payload = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')); // Decodificar Base64URL
        const decodedToken = JSON.parse(payload); // Parsear a objeto
        
        return decodedToken.Usuario || null;
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
}

/**
 * Verifica si un JWT ha expirado.
 * @param decodedToken El contenido del token decodificado.
 * @returns {boolean} `true` si el token ha expirado, `false` si es válido.
 */
export function isTokenExpired(decodedToken: DecodedToken): boolean {
    if (!decodedToken.exp) {
      console.warn('El token no contiene información de expiración.');
      return false; // Asumir que no ha expirado si no tiene campo `exp`
    }
  
    const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
    return decodedToken.exp < currentTime;
  }