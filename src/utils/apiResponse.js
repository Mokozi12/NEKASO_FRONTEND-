
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
    return body.message
  }
  return body
}

export function unwrapList(res) {
  const body = unwrap(res)
  if (Array.isArray(body)) return body
  if (Array.isArray(body?.content)) return body.content
  if (Array.isArray(body?.data)) return body.data
  return []
}

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

export function listeOuVide(promesse) {
  return promesse
    .then((res) => unwrapList(res))
    .catch((e) => {
      if (e?.response?.status === 404) return []
      throw e
    })
}
