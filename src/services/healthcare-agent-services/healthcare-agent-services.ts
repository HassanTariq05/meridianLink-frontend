import { useApiClient } from '@/lib/axios'

export interface Patient {
  patient_id: string
  first_name: string
  last_name: string
  date_of_birth: string
  phone: string
  id: number
  createdAt: string
  updatedAt: string
}

export interface Doctor {
  doctor_id: string
  doctor_name: string
  specialty: string
  phone: string
  consultation_duration_minutes: number
  consultation_fee: number
  is_active: boolean
  id: number
  createdAt: string
  updatedAt: string
}

export interface Prescription {
  prescription_id: string
  patient_id: string
  medication_name: string
  strength: string
  prescribed_quantity: number
  pharmacy_name: string
  active: boolean
  id: number
  createdAt: string
  updatedAt: string
}

export interface Appointment {
  appointment_id: string
  call_sid: string
  patient_id: string
  doctor_id: string
  slot_id: string
  appointment_date: string
  start_time: string
  end_time: string
  reason_for_visit: string
  status: string
  created_at: string
  caller_confirmation: boolean
  id: number
  createdAt: string
  updatedAt: string
  patient: Patient | null
  doctor: Doctor | null
}

export interface RefillRecord {
  request_id: string
  call_sid: string
  patient_id: string
  prescription_id: string
  medication_name: string
  strength: string
  requested_quantity: number
  pharmacy_name: string
  status: string
  created_at: string
  caller_confirmation: boolean
  id: number
  createdAt: string
  updatedAt: string
  patient: Patient | null
  prescription: Prescription | null
}

export interface AppointmentsResponse {
  success: boolean
  count: number
  appointments: Appointment[]
}

export interface RefillsResponse {
  success: boolean
  count: number
  refills: RefillRecord[]
}

export interface MetricsResponse {
  success: boolean
  refills: {
    total: number
    by_status: Record<string, number>
    by_medication: Record<string, number>
    by_pharmacy: Record<string, number>
  }
  appointments: {
    total: number
    by_status: Record<string, number>
    by_doctor: Record<string, number>
  }
}

export const useHealthcareAgentService = () => {
  const apiClient = useApiClient()

  const getMetrics = async (): Promise<MetricsResponse> => {
    const { data } = await apiClient.get<MetricsResponse>(
      '/webhook/getAll/metrics',
      { withCredentials: false }
    )
    return data
  }

  const getAppointments = async (): Promise<AppointmentsResponse> => {
    const { data } = await apiClient.get<AppointmentsResponse>(
      '/webhook/getAll/appointments',
      { withCredentials: false }
    )
    return data
  }

  const getRefills = async (): Promise<RefillsResponse> => {
    const { data } = await apiClient.get<RefillsResponse>(
      '/webhook/getAll/refills',
      { withCredentials: false }
    )
    return data
  }

  return { getMetrics, getAppointments, getRefills }
}
