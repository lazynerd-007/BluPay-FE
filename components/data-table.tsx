"use client"

import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const schema = z.object({
  id: z.number(),
  merchant: z.string(),
  date: z.string(),
  tid: z.string(),
  scheme: z.string(),
  amount: z.string(),
  status: z.string(),
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

// Create a React context for the currentTab
const TableContext = React.createContext<string>("");

// Add a checkbox column for row selection
const getSelectionColumn = (): ColumnDef<z.infer<typeof schema>> => {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
  }
}

// Update the getColumns function to handle different table types
const getColumns = (currentTab: string, tableType: string = "transaction"): ColumnDef<z.infer<typeof schema>>[] => {
  // Merchant status table columns
  if (tableType === "merchant") {
    return [
      {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
      },
      {
        accessorKey: "merchant",
        header: "Merchant",
        cell: ({ row }) => {
          return <div className="font-medium">{row.original.merchant}</div>
        },
        enableHiding: false,
      },
      {
        accessorKey: "date",
        header: "Date Registered",
        cell: ({ row }) => {
          const date = new Date(row.original.date);
          return <div>{date.toLocaleDateString()}</div>
        },
      },
      {
        accessorKey: "tid",
        header: "MID",
        cell: ({ row }) => <div>{row.original.tid}</div>,
      },
      {
        accessorKey: "scheme",
        header: "BDM",
        cell: ({ row }) => {
          // Generate BDM ID using the format: initials-number
          // For demo purposes, we'll create different IDs based on the scheme
          const scheme = row.original.scheme;
          let bdmId = "";
          
          // Generate different IDs based on the scheme
          switch(scheme) {
            case "Credit Card":
              bdmId = "JD-001"; // John Doe
              break;
            case "Debit Card":
              bdmId = "MS-002"; // Mary Smith
              break;
            case "PayPal":
              bdmId = "RJ-003"; // Robert Johnson
              break;
            case "Bank Transfer":
              bdmId = "AB-004"; // Alice Brown
              break;
            default:
              // Generate a random ID if scheme doesn't match
              const initials = scheme.split(' ').map(word => word[0]).join('').substring(0, 2);
              bdmId = `${initials}-${Math.floor(Math.random() * 900) + 100}`;
          }
          
          return (
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              {bdmId}
            </Badge>
          );
        },
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-right">Total Collections</div>,
        cell: ({ row }) => <div className="text-right font-medium">{row.original.amount}</div>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          
          // Determine status display based on current tab
          let displayStatus = status;
          let badgeVariant: "default" | "outline" | "secondary" | "destructive" = "default";
          
          if (currentTab === "active" || currentTab === "") {
            displayStatus = "Active";
            badgeVariant = "secondary";
          } else if (currentTab === "new") {
            displayStatus = "Active";
            badgeVariant = "secondary";
          } else if (currentTab === "inactive") {
            displayStatus = "Inactive";
            badgeVariant = "outline";
          } else if (currentTab === "suspended") {
            displayStatus = "Suspended";
            badgeVariant = "destructive";
          }
          
          return (
            <Badge 
              variant={badgeVariant}
              className="px-1.5"
            >
              {displayStatus === "Active" ? (
                <IconCircleCheckFilled className="size-3 mr-1" />
              ) : displayStatus === "Inactive" ? (
                <IconLoader className="size-3 mr-1" />
              ) : (
                <IconDotsVertical className="size-3 mr-1" />
              )}
              {displayStatus}
            </Badge>
          )
        },
      },
    ];
  }
  
  // For top-merchants tab
  if (currentTab === "top-merchants") {
    return [
      {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
      },
      {
        accessorKey: "merchant",
        header: "Merchant",
        cell: ({ row }) => {
          return <div className="font-medium">{row.original.merchant}</div>
        },
        enableHiding: false,
      },
      {
        accessorKey: "tid",
        header: "MID",
        cell: ({ row }) => <div>{row.original.tid}</div>,
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => <div className="text-right font-medium">{row.original.amount}</div>,
      },
    ];
  }
  
  // For top-products tab
  if (currentTab === "top-products") {
    return [
      {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
      },
      {
        accessorKey: "scheme",
        header: "Processor",
        cell: ({ row }) => (
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {row.original.scheme}
          </Badge>
        ),
      },
      {
        accessorKey: "tid",
        header: "Count",
        cell: ({ row }) => {
          // Generate a count based on ID for demo purposes
          const count = row.original.id * 5 + 10;
          return <div>{count}</div>;
        },
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-right">Volume</div>,
        cell: ({ row }) => <div className="text-right font-medium">{row.original.amount}</div>,
      },
    ];
  }
  
  // Default transaction table columns (recent tab)
  return [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
      accessorKey: "merchant",
      header: "Merchant",
      cell: ({ row }) => {
        return <div className="font-medium">{row.original.merchant}</div>
      },
      enableHiding: false,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        // Format date with time: May 23, 2024, 1:34:45 PM
        return <div>{date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
        }) + ', ' + date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true
        })}</div>
      },
    },
    {
      accessorKey: "tid",
      header: "TID",
      cell: ({ row }) => <div>{row.original.tid}</div>,
    },
    {
      accessorKey: "scheme",
      header: "Scheme",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.scheme}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => <div className="text-right font-medium">{row.original.amount}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        let badgeVariant: "default" | "outline" | "secondary" | "destructive" = "default";
        
        if (status === "Completed") {
          badgeVariant = "secondary";
        } else if (status === "Pending") {
          badgeVariant = "outline";
        } else if (status === "Failed") {
          badgeVariant = "destructive";
        }
        
        return (
          <Badge 
            variant={badgeVariant}
            className="px-1.5"
          >
            {status === "Completed" ? (
              <IconCircleCheckFilled className="size-3 mr-1" />
            ) : status === "Pending" ? (
              <IconLoader className="size-3 mr-1" />
            ) : (
              <IconDotsVertical className="size-3 mr-1" />
            )}
            {status}
          </Badge>
        )
      },
    },
  ];
};

function DraggableRow({ row, tableType = "transaction" }: { row: Row<z.infer<typeof schema>>, tableType?: string }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  data: initialData,
  currentTab = "",
  tableType = "transaction",
  enablePagination = false,
  enableRowSelection = false,
}: {
  data: z.infer<typeof schema>[]
  currentTab?: string
  tableType?: string
  enablePagination?: boolean
  enableRowSelection?: boolean
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  // Get columns with the current tab and table type
  let columns = React.useMemo(() => getColumns(currentTab, tableType), [currentTab, tableType])
  
  // Add selection column if row selection is enabled
  if (enableRowSelection) {
    const selectionColumn = getSelectionColumn();
    columns = [selectionColumn, ...columns];
  }

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      rowSelection,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    ...(enablePagination && { getPaginationRowModel: getPaginationRowModel() }),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="w-full flex-col justify-start">
      <div className="relative flex flex-col overflow-auto">
        <div className="overflow-hidden rounded-lg border w-full">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table className="w-full">
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} tableType={tableType} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </div>
      
      {enablePagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

function TableCellViewer({ item, tableType = "transaction" }: { item: z.infer<typeof schema>, tableType?: string }) {
  const isMobile = useIsMobile()

  // Generate BDM ID for merchant tables
  const getBdmId = (scheme: string) => {
    let bdmId = "";
    
    switch(scheme) {
      case "Credit Card":
        bdmId = "JD-001"; // John Doe
        break;
      case "Debit Card":
        bdmId = "MS-002"; // Mary Smith
        break;
      case "PayPal":
        bdmId = "RJ-003"; // Robert Johnson
        break;
      case "Bank Transfer":
        bdmId = "AB-004"; // Alice Brown
        break;
      default:
        const initials = scheme.split(' ').map(word => word[0]).join('').substring(0, 2);
        bdmId = `${initials}-${Math.floor(Math.random() * 900) + 100}`;
    }
    
    return bdmId;
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.merchant}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.merchant}</DrawerTitle>
          <DrawerDescription>
            {tableType === "merchant" 
              ? "Merchant details and collections" 
              : "Showing total transactions for the last 6 months"}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && tableType === "transaction" && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month{" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total transactions for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="merchant">Merchant</Label>
              <Input id="merchant" defaultValue={item.merchant} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="date">
                  {tableType === "merchant" ? "Date Registered" : "Date"}
                </Label>
                <Input id="date" defaultValue={item.date} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="tid">
                  {tableType === "merchant" ? "MID" : "TID"}
                </Label>
                <Input id="tid" defaultValue={item.tid} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="scheme">
                  {tableType === "merchant" ? "BDM" : "Scheme"}
                </Label>
                {tableType === "merchant" ? (
                  <Input id="scheme" defaultValue={getBdmId(item.scheme)} />
                ) : (
                  <Select defaultValue={item.scheme}>
                    <SelectTrigger id="scheme" className="w-full">
                      <SelectValue placeholder="Select a scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Debit Card">Debit Card</SelectItem>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="amount">
                  {tableType === "merchant" ? "Total Collections" : "Amount"}
                </Label>
                <Input id="amount" defaultValue={item.amount} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {tableType === "merchant" ? (
                      <>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
