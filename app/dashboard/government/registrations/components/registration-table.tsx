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

import { Button } from "@/component/ui/button"
import { Checkbox } from "@/component/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/component/ui/dropdown-menu"
import { Input } from "@/component/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/component/ui/table"
import { Badge } from "@/component/ui/badge"

// Sample data
const data = [
  {
    id: "REQ001",
    hospitalName: "City General Hospital",
    type: "Government",
    state: "Maharashtra",
    city: "Mumbai",
    contactPerson: "Dr. Emily Wong",
    contactEmail: "emily.wong@citygeneral.org",
    submittedDate: "2023-04-01",
    status: "Pending",
  },
  {
    id: "REQ002",
    hospitalName: "Rural Health Center",
    type: "Government",
    state: "Karnataka",
    city: "Belgaum",
    contactPerson: "Dr. Rajesh Kumar",
    contactEmail: "rajesh.kumar@ruralhc.org",
    submittedDate: "2023-04-02",
    status: "Approved",
  },
  {
    id: "REQ003",
    hospitalName: "Apollo Hospital",
    type: "Private",
    state: "Tamil Nadu",
    city: "Chennai",
    contactPerson: "Dr. Priya Sharma",
    contactEmail: "priya.sharma@apollo.com",
    submittedDate: "2023-04-03",
    status: "Approved",
  },
  {
    id: "REQ004",
    hospitalName: "AIIMS Delhi",
    type: "Government",
    state: "Delhi",
    city: "New Delhi",
    contactPerson: "Dr. Vikram Singh",
    contactEmail: "vikram.singh@aiims.edu",
    submittedDate: "2023-04-05",
    status: "Approved",
  },
  {
    id: "REQ005",
    hospitalName: "Fortis Healthcare",
    type: "Private",
    state: "Karnataka",
    city: "Bangalore",
    contactPerson: "Dr. Ananya Reddy",
    contactEmail: "ananya.reddy@fortis.com",
    submittedDate: "2023-04-08",
    status: "Approved",
  },
  {
    id: "REQ006",
    hospitalName: "Rural Medical College",
    type: "Trust",
    state: "Maharashtra",
    city: "Pune",
    contactPerson: "Dr. Sanjay Patil",
    contactEmail: "sanjay.patil@rmc.edu",
    submittedDate: "2023-04-10",
    status: "Pending",
  },
  {
    id: "REQ007",
    hospitalName: "Max Super Specialty Hospital",
    type: "Private",
    state: "Delhi",
    city: "New Delhi",
    contactPerson: "Dr. Neha Gupta",
    contactEmail: "neha.gupta@maxhospital.com",
    submittedDate: "2023-04-12",
    status: "Pending",
  },
  {
    id: "REQ008",
    hospitalName: "Manipal Hospital",
    type: "Private",
    state: "Karnataka",
    city: "Bangalore",
    contactPerson: "Dr. Karthik Rao",
    contactEmail: "karthik.rao@manipal.com",
    submittedDate: "2023-04-15",
    status: "Approved",
  },
  {
    id: "REQ009",
    hospitalName: "Medanta - The Medicity",
    type: "Private",
    state: "Haryana",
    city: "Gurugram",
    contactPerson: "Dr. Arun Mehta",
    contactEmail: "arun.mehta@medanta.com",
    submittedDate: "2023-04-18",
    status: "Rejected",
  },
  {
    id: "REQ010",
    hospitalName: "Primary Health Center",
    type: "Government",
    state: "Uttar Pradesh",
    city: "Lucknow",
    contactPerson: "Dr. Rahul Verma",
    contactEmail: "rahul.verma@uphc.org",
    submittedDate: "2023-04-20",
    status: "Pending",
  },
]

const columns: ColumnDef<(typeof data)[0]>[] = [
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
    header: "Request ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "hospitalName",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Hospital Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("hospitalName")}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
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
    accessorKey: "contactPerson",
    header: "Contact Person",
    cell: ({ row }) => <div>{row.getValue("contactPerson")}</div>,
  },
  {
    accessorKey: "submittedDate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Submitted Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("submittedDate")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={status === "Approved" ? "outline" : status === "Pending" ? "secondary" : "destructive"}
          className={
            status === "Approved"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : status === "Pending"
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                : ""
          }
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
      const request = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(request.id)}>
              Copy request ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Approve request</DropdownMenuItem>
            <DropdownMenuItem>Reject request</DropdownMenuItem>
            <DropdownMenuItem>Request more information</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function RegistrationTable({ filter }: { filter?: string }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  // Filter data based on the filter prop
  const filteredData = filter ? data.filter((request) => request.status.toLowerCase() === filter.toLowerCase()) : data

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
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter hospitals..."
          value={(table.getColumn("hospitalName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("hospitalName")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

