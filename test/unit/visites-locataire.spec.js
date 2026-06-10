import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import api from '../../src/services/api'
import { visitesLocataireService } from '../../src/services/visites-locataire.service'

describe('visites-locataire.service', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('envoie uniquement { idBien, idLocataire } en nombres', async () => {
    const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ data: { ok: true } })

    const payload = { idBien: '12', idLocataire: '34', extra: 'ignore' }
    const res = await visitesLocataireService.demander(payload)

    expect(postSpy).toHaveBeenCalledTimes(1)
    expect(postSpy).toHaveBeenCalledWith('/visites/demander', { idBien: 12, idLocataire: 34 })
    expect(res).toEqual({ ok: true })
  })
})
