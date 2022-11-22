import axios from 'axios'

import { getApiUrl } from '@components/utils'

const api = axios.create({
  baseURL: getApiUrl(),
})

export const getHistory = (osmType: string, osmId: number) =>
  api.get(`/verify/lit/${osmId}/history`)

export type VerificationApiPost = {
  type_name: string
  osm_id: number
  osm_type: string
  verified_at: string
  verified_by: number | undefined
  verified_status: string
}

export type VerificationApiGet = {
  osm_id: number
  osm_type: string
  verified_at: string
  verified_by: number | undefined
  verified: string | undefined
}

export const updateVerificationStatus = ({
  type_name,
  osm_id,
  osm_type,
  verified_at,
  verified_by,
  verified_status,
}: VerificationApiPost) => {
  const encoded = new URLSearchParams()
  encoded.append('osm_type', osm_type)
  encoded.append('verified_at', verified_at)
  verified_by && encoded.append('verified_by', verified_by.toString())
  encoded.append('verified_status', verified_status)

  return api
    .post(`/verify/${type_name}/${osm_id}?` + encoded)
    .then((res) => res.data)
}
