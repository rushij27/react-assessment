"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
            />
            <AvatarFallback>{`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div>
              <h3 className="font-medium">Name</h3>
              <p>{`${user.firstName} ${user.lastName}`}</p>
            </div>
            <div>
              <h3 className="font-medium">Email</h3>
              <p>{user.email}</p>
            </div>
            <div>
              <h3 className="font-medium">Account Created</h3>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
