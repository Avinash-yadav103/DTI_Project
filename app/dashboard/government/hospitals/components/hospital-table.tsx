"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Define the hospital data type
type Hospital = {
  id: string
  name: string
  type: "City" | "Rural"
  state: string
  city: string
  beds: number
  doctors: number
  status: "Active" | "Inactive"
}

// Sample data
const data: Hospital[] = [
  {
    id: "H001",
    name: "City General Hospital",
    type: "City",
    state: "Maharashtra",
    city: "Mumbai",
    beds: 450,
    doctors: 120,
    status: "Active",
  },
  {
    id: "H002",
    name: "Rural Health Center",
    type: "Rural",
    state: "Karnataka",
    city: "Belgaum",
    beds: 120,
    doctors: 25,
    status: "Active",
  },
  {
    id: "H003",
    name: "Apollo Hospital",
    type: "City",
    state: "Tamil Nadu",
    city: "Chennai",
    beds: 380,
    doctors: 95,
    status: "Active",
  },
  {
    id: "H004",
    name: "AIIMS Delhi",
    type: "City",
    state: "Delhi",
    city: "New Delhi",
    beds: 750,
    doctors: 210,
    status: "Active",
  },
  {
    id: "H005",
    name: "Fortis Healthcare",
    type: "City",
    state: "Karnataka",
    city: "Bangalore",
    beds: 320,
    doctors: 85,
    status: "Active",
  },
  {
    id: "H006",
    name: "Rural Medical College",
    type: "Rural",
    state: "Maharashtra",
    city: "Pune",
    beds: 180,
    doctors: 40,
    status: "Active",
  },
  {
    id: "H007",
    name: "Max Super Specialty Hospital",
    type: "City",
    state: "Delhi",
    city: "New Delhi",
    beds: 420,
    doctors: 110,
    status: "Active",
  },
  {
    id: "H008",
    name: "Manipal Hospital",
    type: "City",
    state: "Karnataka",
    city: "Bangalore",
    beds: 350,
    doctors: 90,
    status: "Active",
  },
  {
    id: "H009",
    name: "Medanta - The Medicity",
    type: "City",
    state: "Haryana",
    city: "Gurugram",
    beds: 480,
    doctors: 130,
    status: "Active",
  },
  {
    id: "H010",
    name: "Primary Health Center",
    type: "Rural",
    state: "Uttar Pradesh",
    city: "Lucknow",
    beds: 80,
    doctors: 15,
    status: "Active",
  },
]

export function HospitalTable({ filter }: { filter?: string }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  // Define columns
  const columns: ColumnDef<Hospital>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Hospital Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string
        return (
          <Badge variant={type === "City" ? "default" : "secondary"} className="capitalize">
            {type}
          </Badge>
        )
      },
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => <div>{row.getValue("state")}</div>,
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => <div>{row.getValue("city")}</div>,
    },
    {
      accessorKey: "beds",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Beds
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center font-medium">{row.getValue("beds")}</div>,
    },
    {
      accessorKey: "doctors",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Doctors
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center font-medium">{row.getValue("doctors")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            variant={status === "Active" ? "default" : "destructive"}
            className={status === "Active" ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const hospital = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(hospital.id)}>
                Copy hospital ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View hospital details</DropdownMenuItem>
              <DropdownMenuItem>Edit hospital</DropdownMenuItem>
              <DropdownMenuItem>Suspend hospital</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Filter data based on the filter prop
  const filteredData = filter ? data.filter((hospital) => hospital.type.toLowerCase() === filter.toLowerCase()) : data

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter hospitals..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

