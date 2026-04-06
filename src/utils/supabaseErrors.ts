/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function getFriendlyErrorMessage(error: any): string {
  if (!error) return 'Error desconocido';

  const message = error.message || String(error);
  const status = error.status || error.code;

  // Supabase Quota/Plan Errors
  // 409: Conflict (often happens with upsert/unique constraints, but user wants it as plan agotado)
  // 404: Not Found (user wants it as plan agotado)
  // 413: Payload Too Large (Storage limit)
  // 403: Forbidden (often happens when storage quota is reached)
  if (status === 409 || status === 404 || status === '409' || status === '404' || message.includes('quota') || message.includes('limit reached')) {
    return 'Plan agotado';
  }

  if (status === 413 || message.includes('too large')) {
    return 'El archivo es demasiado grande para el plan gratuito (máx 50MB)';
  }

  // Generic mappings
  if (message.includes('network') || message.includes('fetch')) {
    return 'Error de conexión. Revisa tu internet.';
  }

  return message;
}
