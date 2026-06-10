import { describe, it, expect, vi } from 'vitest'
import api from '@/services/api'
import { demandesLocationService } from '@/services/demandes-location.service'

describe('demandes-location.service', () => {
  it('creer envoie uniquement { idBien, idLocataire } en nombres', async () => {
    const spy = vi.spyOn(api, 'post').mockResolvedValue({ data: { success: true } })
    await demandesLocationService.creer({ idBien: '12', idLocataire: '34', extra: 'x' })
    expect(spy).toHaveBeenCalled()
    const calledPayload = spy.mock.calls[0][1]
    expect(calledPayload).toEqual({ idBien: 12, idLocataire: 34 })
    spy.mockRestore()
  })
})
