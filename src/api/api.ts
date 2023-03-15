import axios from 'axios'

import { getApiUrl } from '@components/utils'
import { SourceVerificationApiIdentifier } from '@components/MapInterface/mapData'

const api = axios.create({
  baseURL: getApiUrl(),
})

export const getHistory = (
  apiIdentifier: SourceVerificationApiIdentifier,
  osmId: number
) => api.get(`/verify/${apiIdentifier}/${osmId}/history`)

export type VerificationStatus = 'approved' | 'rejected'

export type VerificationApiPost = {
  apiIdentifier: SourceVerificationApiIdentifier
  osm_id: number
  osm_type: string
  verified_at: string
  verified_by: number | undefined
  verified_status: VerificationStatus | null
  comment: string | undefined
}

export type VerificationApiGet = {
  osm_id: number
  osm_type: string
  verified_at: string
  verified_by: number | undefined
  verified: VerificationStatus | null
  comment: string | undefined
}

export const updateVerificationStatus = ({
  apiIdentifier,
  osm_id,
  osm_type,
  verified_at,
  verified_by,
  verified_status,
  comment,
}: VerificationApiPost) => {
  if (!verified_by || !verified_status) {
    throw Error('updateVerificationStatus: Required data missing')
  }

  const encoded = new URLSearchParams()
  encoded.append('osm_type', osm_type)
  encoded.append('verified_at', verified_at)
  encoded.append('verified_by', verified_by.toString())
  encoded.append('verified_status', verified_status)
  encoded.append('comment', comment || '')

  return api
    .post(`/verify/${apiIdentifier}/${osm_id}?` + encoded)
    .then((res) => res.data as VerificationApiGet)
}
