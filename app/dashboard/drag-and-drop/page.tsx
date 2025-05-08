"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample user data
const initialUsers = [
  {
    id: "user-1",
    name: "John Doe",
    designation: "Frontend Developer",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    designation: "UX Designer",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=random",
  },
  {
    id: "user-3",
    name: "Robert Johnson",
    designation: "Backend Developer",
    avatar: "https://ui-avatars.com/api/?name=Robert+Johnson&background=random",
  },
  {
    id: "user-4",
    name: "Emily Davis",
    designation: "Project Manager",
    avatar: "https://ui-avatars.com/api/?name=Emily+Davis&background=random",
  },
  {
    id: "user-5",
    name: "Michael Wilson",
    designation: "DevOps Engineer",
    avatar: "https://ui-avatars.com/api/?name=Michael+Wilson&background=random",
  },
]

// Initial column data
const initialColumns = {
  "top-row": {
    id: "top-row",
    title: "Available Users",
    userIds: ["user-1", "user-2", "user-3", "user-4", "user-5"],
  },
  "project-1": {
    id: "project-1",
    title: "Project 1",
    userIds: [],
  },
  "project-2": {
    id: "project-2",
    title: "Project 2",
    userIds: [],
  },
  "project-3": {
    id: "project-3",
    title: "Project 3",
    userIds: [],
  },
}

// Column order
const initialColumnOrder = ["top-row", "project-1", "project-2", "project-3"]

export default function DragAndDropPage() {
  const [users] = useState(initialUsers)
  const [columns, setColumns] = useState(initialColumns)
  const [columnOrder] = useState(initialColumnOrder)

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    // If there's no destination or if the item was dropped back to its original position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Get source and destination columns
    const sourceColumn = columns[source.droppableId]
    const destinationColumn = columns[destination.droppableId]

    // If moving within the same column
    if (sourceColumn.id === destinationColumn.id) {
      const newUserIds = Array.from(sourceColumn.userIds)
      newUserIds.splice(source.index, 1)
      newUserIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...sourceColumn,
        userIds: newUserIds,
      }

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      })
      return
    }

    // Moving from one column to another
    const sourceUserIds = Array.from(sourceColumn.userIds)
    sourceUserIds.splice(source.index, 1)
    const newSourceColumn = {
      ...sourceColumn,
      userIds: sourceUserIds,
    }

    const destinationUserIds = Array.from(destinationColumn.userIds)
    destinationUserIds.splice(destination.index, 0, draggableId)
    const newDestinationColumn = {
      ...destinationColumn,
      userIds: destinationUserIds,
    }

    setColumns({
      ...columns,
      [newSourceColumn.id]: newSourceColumn,
      [newDestinationColumn.id]: newDestinationColumn,
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Drag and Drop Board</h1>
      <p className="text-muted-foreground">Drag user cards from the top row into project columns below</p>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="space-y-6">
          {/* Top row with user cards */}
          {columnOrder.map((columnId) => {
            const column = columns[columnId]
            const columnUsers = column.userIds.map((userId) => users.find((user) => user.id === userId))

            return (
              <div key={column.id} className="space-y-4">
                <h2 className="text-xl font-semibold">{column.title}</h2>
                <Droppable droppableId={column.id} direction="horizontal">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2 lg:grid-cols-3 ${
                        column.id === "top-row" ? "bg-muted/50" : "bg-card"
                      }`}
                      style={{ minHeight: "120px" }}
                    >
                      {columnUsers.map(
                        (user, index) =>
                          user && (
                            <Draggable key={user.id} draggableId={user.id} index={index}>
                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  <Card className="h-full">
                                    <CardHeader className="p-4">
                                      <CardTitle className="text-sm">{user.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex items-center space-x-4 p-4 pt-0">
                                      <Avatar>
                                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="text-xs text-muted-foreground">{user.designation}</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ),
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>
    </div>
  )
}
