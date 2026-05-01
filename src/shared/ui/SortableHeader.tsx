import { TableCell, TableSortLabel } from '@mui/material'

type SortDirection = 'asc' | 'desc'

type SortableHeaderProps = {
  active: boolean
  direction: SortDirection
  label: string
  onClick: () => void
}

export function SortableHeader({ active, direction, label, onClick }: SortableHeaderProps) {
  return (
    <TableCell>
      <TableSortLabel active={active} direction={active ? direction : 'asc'} onClick={onClick}>
        {label}
      </TableSortLabel>
    </TableCell>
  )
}
