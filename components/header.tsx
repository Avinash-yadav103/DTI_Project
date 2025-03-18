"use client"
import { Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 font-semibold text-lg text-primary">
        <span>PM</span>
        <span>Patient Portfolio</span>
      </div>
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search medical records, appointments..."
          className="w-full rounded-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
        />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
        </Button>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="Alex Morgan" />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <div className="text-sm font-medium">Alex Morgan</div>
            <div className="text-xs text-muted-foreground">Patient</div>
          </div>
        </div>
      </div>
    </header>
  )
}

