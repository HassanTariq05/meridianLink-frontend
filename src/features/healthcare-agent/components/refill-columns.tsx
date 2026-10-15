import type { ColumnDef } from '@tanstack/react-table'
import type { RefillRecord } from '@/services/healthcare-agent-services/healthcare-agent-services'
import { DataTableColumnHeader } from '@/components/data-table'
import {
  PatientCell,
  PharmacyLabel,
  RecordIdCode,
  StatusBadge,
  TimeCell,
  ViewButton,
  getPatientName,
} from './healthcare-helpers'

export function getRefillColumns(
  onView: (record: RefillRecord) => void
): ColumnDef<RefillRecord>[] {
  return [
    {
      accessorKey: 'request_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Request' />
      ),
      cell: ({ row }) => <RecordIdCode value={row.original.request_id} />,
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
      accessorKey: 'pharmacy_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Pharmacy' />
      ),
      cell: ({ row }) => <PharmacyLabel name={row.original.pharmacy_name} />,
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
        <DataTableColumnHeader column={column} title='Submitted' />
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
