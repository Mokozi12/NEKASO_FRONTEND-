/*
  Normalisation des réponses du backend NEKASO.

  Le backend enveloppe ses réponses de façon HÉTÉROGÈNE selon le contrôleur :
    1) Enveloppe « auth »      : { success, message: <charge utile>, status, timestamp }
    2) Page « maison »         : { data: [...], totalElements, totalPages, currentPage, pageSize, isFirst, isLast }
    3) Page Spring Data        : { content: [...], number, size, totalElements, totalPages, ... }
    4) Charge utile brute      : objet ou tableau directement

  Ces helpers ramènent tout ça à une forme exploitable côté front.
*/

/** Retire l'enveloppe « auth » { success, message, status, timestamp } si présente. */
export function unwrap(res) {
  const body = res?.data ?? res
  if (
    body &&
    typeof body === 'object' &&
    'success' in body &&
    'message' in body &&
    'status' in body &&
    'timestamp' in body
  ) {
    // La charge utile réelle est dans `message` (et non `data`).
    return body.message
  }
  return body
}

/** Extrait le tableau d'éléments quelle que soit la forme de pagination. */
export function unwrapList(res) {
  const body = unwrap(res)
  if (Array.isArray(body)) return body
  if (Array.isArray(body?.content)) return body.content // Page Spring Data
  if (Array.isArray(body?.data)) return body.data // Page « maison »
  return []
}

/** Extrait les métadonnées de pagination (normalisées). */
export function pageMeta(res) {
  const body = unwrap(res)
  const liste = unwrapList(res)
  return {
    items: liste,
    page: body?.number ?? body?.currentPage ?? 0,
    size: body?.size ?? body?.pageSize ?? liste.length,
    totalElements: body?.totalElements ?? liste.length,
    totalPages: body?.totalPages ?? 1,
    isFirst: body?.first ?? body?.isFirst ?? true,
    isLast: body?.last ?? body?.isLast ?? true,
  }
}

/**
 * Beaucoup d'endpoints « mes_demandes » renvoient un 404 + message
 * « Aucune demande trouvée » quand la liste est vide. On traite ce cas
 * comme une liste vide plutôt que comme une erreur.
 */
export function listeOuVide(promesse) {
  return promesse
    .then((res) => unwrapList(res))
    .catch((e) => {
      if (e?.response?.status === 404) return []
      throw e
    })
}
