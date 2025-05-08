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
  designation: string | null
  projectAssignment: string | null
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
      className="p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full overflow-hidden">
          <img
            src={developer.avatarUrl || "/placeholder.svg"}
            alt={developer.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">{developer.name}</h3>
          <p className="text-sm text-muted-foreground">{developer.headline}</p>
        </div>
      </div>
      {developer.designation && (
        <div className="mt-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            {developer.designation}
          </Badge>
        </div>
      )}
      <div className="mt-2 flex flex-wrap gap-1">
        {developer.skills.slice(0, 2).map((skill, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {skill}
          </Badge>
        ))}
        {developer.skills.length > 2 && (
          <Badge variant="outline" className="text-xs">
            +{developer.skills.length - 2}
          </Badge>
        )}
      </div>
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
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-center">{column.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={setNodeRef} className="min-h-[300px] rounded-md p-2 bg-slate-50">
          <SortableContext items={column.developers.map((dev) => dev.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {column.developers.map((developer) => (
                <DeveloperCard key={developer.id} developer={developer} />
              ))}
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
      avatarUrl: "/placeholder.svg?height=40&width=40",
      skills: ["React", "TypeScript", "CSS"],
      designation: "Frontend Developer",
      projectAssignment: null,
    },
    {
      id: "dev-2",
      name: "Sarah Chen",
      headline: "Full Stack Developer",
      avatarUrl: "/placeholder.svg?height=40&width=40",
      skills: ["Node.js", "React", "MongoDB"],
      designation: "Full Stack Developer",
      projectAssignment: null,
    },
    {
      id: "dev-3",
      name: "Miguel Rodriguez",
      headline: "Backend Developer",
      avatarUrl: "/placeholder.svg?height=40&width=40",
      skills: ["Java", "Spring", "AWS"],
      designation: "Backend Developer",
      projectAssignment: null,
    },
    {
      id: "dev-4",
      name: "Priya Patel",
      headline: "Mobile Developer",
      avatarUrl: "/placeholder.svg?height=40&width=40",
      skills: ["Flutter", "Dart", "Firebase"],
      designation: "Mobile Developer",
      projectAssignment: null,
    },
    {
      id: "dev-5",
      name: "David Kim",
      headline: "DevOps Engineer",
      avatarUrl: "/placeholder.svg?height=40&width=40",
      skills: ["Docker", "Kubernetes", "CI/CD"],
      designation: "DevOps Engineer",
      projectAssignment: null,
    },
    {
      id: "dev-6",
      name: "Emma Wilson",
      headline: "UI/UX Designer",
      avatarUrl: "/placeholder.svg?height=40&width=40",
      skills: ["Figma", "React", "CSS"],
      designation: "UI/UX Designer",
      projectAssignment: null,
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
        distance: 8,
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

    // Handle dropping a developer from source to a column
    if (overId.startsWith("column")) {
      const sourceDev = sourceDevelopers.find((dev) => dev.id === devId)
      const targetColumn = columns.find((col) => col.id === overId)

      if (sourceDev && targetColumn) {
        // Update designation based on column
        const updatedDev = {
          ...sourceDev,
          designation: targetColumn.title,
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
            // Update designation based on new column
            const updatedDev = {
              ...devToMove,
              designation: targetColumn.title,
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

    setActiveDeveloper(null)
  }

  // Make the source container droppable
  const { setNodeRef: setSourceRef } = useDroppable({
    id: "source-container",
  })

  return (
    <main className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Developer Team Organization</h1>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="space-y-8">
          {/* Source container */}
          <div ref={setSourceRef}>
            <Card className="bg-slate-50">
              <CardHeader>
                <CardTitle>Available Developers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {sourceDevelopers.map((developer) => (
                    <DeveloperCard key={developer.id} developer={developer} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((column) => (
              <TaskContainer key={column.id} column={column} />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeDeveloper && (
            <Card className="w-[250px] p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <img
                    src={activeDeveloper.avatarUrl || "/placeholder.svg"}
                    alt={activeDeveloper.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{activeDeveloper.name}</h3>
                  <p className="text-sm text-muted-foreground">{activeDeveloper.headline}</p>
                </div>
              </div>
              {activeDeveloper.designation && (
                <div className="mt-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 inline-block">
                  {activeDeveloper.designation}
                </div>
              )}
            </Card>
          )}
        </DragOverlay>
      </DndContext>
    </main>
  )
}