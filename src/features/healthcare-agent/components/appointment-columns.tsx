import type { ColumnDef } from '@tanstack/react-table'
import type { Appointment } from '@/services/healthcare-agent-services/healthcare-agent-services'
import { CalendarDays, Stethoscope } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table'
import {
  PatientCell,
  RecordIdCode,
  StatusBadge,
  TimeCell,
  ViewButton,
  formatAppointmentSlot,
  getPatientName,
} from './healthcare-helpers'

export function getAppointmentColumns(
  onView: (record: Appointment) => void
): ColumnDef<Appointment>[] {
  return [
    {
      accessorKey: 'appointment_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Appointment' />
      ),
      cell: ({ row }) => <RecordIdCode value={row.original.appointment_id} />,
    },
    {
      id: 'patient',
      accessorFn: (row) => getPatientName(row.patient),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Patient' />
      ),
      cell: ({ row }) => (
        <PatientCell
          name={getPatientName(row.original.patient)}
          phone={row.original.patient?.phone}
        />
      ),
    },
    {
      id: 'provider',
      accessorFn: (row) => row.doctor?.doctor_name ?? '',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Provider' />
      ),
      cell: ({ row }) => (
        <div className='min-w-0'>
          <p className='truncate text-sm font-medium'>
            {row.original.doctor?.doctor_name || '—'}
          </p>
          {row.original.doctor?.specialty && (
            <p className='text-muted-foreground flex items-center gap-1 text-xs'>
              <Stethoscope className='h-3 w-3' />
              {row.original.doctor.specialty}
            </p>
          )}
        </div>
      ),
    },
    {
      id: 'slot',
      accessorFn: (row) => `${row.appointment_date} ${row.start_time}`,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Booked Slot' />
      ),
      cell: ({ row }) => (
        <span className='inline-flex items-center gap-1.5 rounded-md bg-teal-500/10 px-2 py-1 text-xs font-medium text-teal-700 ring-1 ring-teal-500/20 dark:text-teal-300'>
          <CalendarDays className='h-3 w-3' />
          {formatAppointmentSlot(
            row.original.appointment_date,
            row.original.start_time
          )}
        </span>
      ),
    },

    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Created On' />
      ),
      cell: ({ row }) => <TimeCell value={row.original.created_at} />,
    },
    {
      id: 'actions',
      enableSorting: false,
      header: () => <span className='sr-only'>Actions</span>,
      cell: ({ row }) => (
        <div className='flex justify-end'>
          <ViewButton onClick={() => onView(row.original)} />
        </div>
      ),
    },
  ]
}
