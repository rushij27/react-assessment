"use client"

import { useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Types
export type Developer = {
  id: string
  name: string
  headline: string
  avatarUrl: string
  skills: string[]
  projectAssignment?: string
}

export type Column = {
  id: string
  title: string
  developers: Developer[]
}

// DeveloperCard Component 
function DeveloperCard({ developer }: { developer: Developer }) {
  // Make the card draggable
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: developer.id,
  })
  
  const style = {
    transform: CSS.Translate.toString(transform),
  }
  
  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow w-full h-[140px] flex flex-col"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={developer.avatarUrl || "/placeholder.svg"}
            alt={developer.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="overflow-hidden">
          <h3 className="font-semibold text-sm truncate">{developer.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{developer.headline}</p>
        </div>
      </div>
      {/* <div className="mt-2">
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs">
          {developer.designation}
        </Badge>
      </div> */}
      {developer.projectAssignment && (
        <div className="mt-2">
          <Badge variant="outline" className="text-xs bg-green-50 text-green-800 border-green-200">
            {developer.projectAssignment}
          </Badge>
        </div>
      )}
    </Card>
  )
}

// TaskContainer Component
function TaskContainer({ column }: { column: Column }) {
  // Make the column droppable
  const { setNodeRef } = useDroppable({
    id: column.id,
  })
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-center">{column.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div 
          ref={setNodeRef} 
          className="min-h-[300px] h-full rounded-md p-2 bg-slate-50 flex flex-col"
        >
          <SortableContext items={column.developers.map((dev) => dev.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 flex-grow">
              {column.developers.map((developer) => (
                <DeveloperCard key={developer.id} developer={developer} />
              ))}
              {column.developers.length === 0 && (
                <div className="h-full min-h-[150px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-md">
                  <p className="text-slate-400">Drop developers here</p>
                </div>
              )}
            </div>
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  )
}

// Main DeveloperBoard Component
export default function DeveloperBoard() {
  // Initial developers in the source container
  const [sourceDevelopers, setSourceDevelopers] = useState<Developer[]>([
    {
      id: "dev-1",
      name: "Alex Johnson",
      headline: "Frontend Developer",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      skills: ["React", "TypeScript", "CSS"],
      projectAssignment: undefined,
    },
    {
      id: "dev-2",
      name: "Sarah Chen",
      headline: "Full Stack Developer",
      avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      skills: ["Node.js", "React", "MongoDB"],
      projectAssignment: undefined,
    },
    {
      id: "dev-3",
      name: "Miguel Rodriguez",
      headline: "Backend Developer",
      avatarUrl: "https://randomuser.me/api/portraits/men/46.jpg",
      skills: ["Java", "Spring", "AWS"],
      projectAssignment: undefined,
    },
    {
      id: "dev-4",
      name: "Priya Patel",
      headline: "Mobile Developer",
      avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
      skills: ["Flutter", "Dart", "Firebase"],
      projectAssignment: undefined,
    },
    {
      id: "dev-5",
      name: "David Kim",
      headline: "DevOps Engineer",
      avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
      skills: ["Docker", "Kubernetes", "CI/CD"],
      projectAssignment: undefined,
    },
    {
      id: "dev-6",
      name: "Emma Wilson",
      headline: "UI/UX Designer",
      avatarUrl: "https://randomuser.me/api/portraits/women/24.jpg",
      skills: ["Figma", "React", "CSS"],
      projectAssignment: undefined,
    },
  ])

  // Project columns for developer assignment
  const [columns, setColumns] = useState<Column[]>([
    { id: "column-1", title: "Project 1", developers: [] },
    { id: "column-2", title: "Project 2", developers: [] },
    { id: "column-3", title: "Project 3", developers: [] },
  ])

  // Track the active developer being dragged
  const [activeDeveloper, setActiveDeveloper] = useState<Developer | null>(null)

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduced distance for easier drag activation
      },
    })
  )

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const devId = active.id as string

    // Find the developer in either source or columns
    let developer: Developer | undefined

    // Check source container first
    developer = sourceDevelopers.find((d) => d.id === devId)

    // If not in source, check columns
    if (!developer) {
      for (const column of columns) {
        developer = column.developers.find((d) => d.id === devId)
        if (developer) break
      }
    }

    if (developer) {
      setActiveDeveloper(developer)
    }
  }

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !active) {
      setActiveDeveloper(null)
      return
    }

    const devId = active.id as string
    const overId = over.id as string

    // Handle dropping a developer into a column
    if (overId.startsWith("column")) {
      const sourceDev = sourceDevelopers.find((dev) => dev.id === devId)
      const targetColumn = columns.find((col) => col.id === overId)

      if (sourceDev && targetColumn) {
        // Update project assignment based on column
        const updatedDev = {
          ...sourceDev,
          projectAssignment: targetColumn.title,
        }

        // Remove from source
        setSourceDevelopers((prev) => prev.filter((dev) => dev.id !== devId))

        // Add to column
        setColumns((prev) =>
          prev.map((col) => (col.id === overId ? { ...col, developers: [...col.developers, updatedDev] } : col))
        )
      } else {
        // Handle moving between columns
        let sourceColumnId: string | null = null
        let devToMove: Developer | null = null

        // Find which column has the developer
        columns.forEach((col) => {
          const dev = col.developers.find((d) => d.id === devId)
          if (dev) {
            sourceColumnId = col.id
            devToMove = dev
          }
        })

        if (sourceColumnId && devToMove && sourceColumnId !== overId) {
          const targetColumn = columns.find((col) => col.id === overId)

          if (targetColumn) {
            // Update project assignment based on new column
            const updatedDev = {
              ...devToMove,
              projectAssignment: targetColumn.title,
            }

            // Remove from source column
            setColumns((prev) =>
              prev.map((col) =>
                col.id === sourceColumnId ? { ...col, developers: col.developers.filter((d) => d.id !== devId) } : col
              )
            )

            // Add to target column
            setColumns((prev) =>
              prev.map((col) => (col.id === overId ? { ...col, developers: [...col.developers, updatedDev] } : col))
            )
          }
        }
      }
    } 
    // Handle dropping back to source container
    else if (overId === "source-container" || overId === "source-container-id") {
      // Find which column has the developer
      let sourceColumnId: string | null = null
      let devToMove: Developer | null = null

      columns.forEach((col) => {
        const dev = col.developers.find((d) => d.id === devId)
        if (dev) {
          sourceColumnId = col.id
          devToMove = dev
        }
      })

      if (sourceColumnId && devToMove) {
        // Update project assignment to null when moving back to source
        const updatedDev = {
          ...devToMove,
          projectAssignment: null,
        }

        // Remove from source column
        setColumns((prev) =>
          prev.map((col) =>
            col.id === sourceColumnId ? { ...col, developers: col.developers.filter((d) => d.id !== devId) } : col
          )
        )

        // Add back to source container
        setSourceDevelopers((prev) => [...prev, updatedDev])
      }
    }

    setActiveDeveloper(null)
  }

  // Make the source container droppable
  const { setNodeRef: setSourceRef } = useDroppable({
    id: "source-container-id",
  })

  return (
    <main className="w-full min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Project Team Assignment</h1>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="space-y-8 max-w-full mx-auto">
          {/* Source container */}
          <div ref={setSourceRef} className="w-full" id="source-container">
            <Card className="bg-slate-50 w-full">
              <CardHeader className="pb-2">
                <CardTitle>Developer Pool</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {sourceDevelopers.map((developer) => (
                    <DeveloperCard key={developer.id} developer={developer} />
                  ))}
                  {sourceDevelopers.length === 0 && (
                    <div className="col-span-full h-[140px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-md">
                      <p className="text-slate-400">Drop developers here to return to pool</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {columns.map((column) => (
              <TaskContainer key={column.id} column={column} />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeDeveloper && (
            <Card className="w-[250px] p-4 shadow-lg h-[140px]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={activeDeveloper.avatarUrl || "/placeholder.svg"}
                    alt={activeDeveloper.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-semibold text-sm truncate">{activeDeveloper.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{activeDeveloper.headline}</p>
                </div>
              </div>
              {/* <div className="mt-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 inline-block">
                {activeDeveloper.designation}
              </div> */}
              {activeDeveloper.projectAssignment && (
                <div className="mt-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 inline-block">
                  {activeDeveloper.projectAssignment}
                </div>
              )}
            </Card>
          )}
        </DragOverlay>
      </DndContext>
    </main>
  )
}