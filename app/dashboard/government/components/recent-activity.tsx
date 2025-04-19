import { Avatar, AvatarFallback, AvatarImage } from "@/component/ui/avatar"

export function RecentActivity() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9 mr-3">
          <AvatarImage src="/placeholder.svg" alt="Avatar" />
          <AvatarFallback>HS</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">New registration request</p>
          <p className="text-sm text-muted-foreground">Dr. Emily Wong from City General Hospital</p>
          <p className="text-xs text-muted-foreground">2 hours ago</p>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9 mr-3">
          <AvatarImage src="/placeholder.svg" alt="Avatar" />
          <AvatarFallback>RM</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">New hospital added</p>
          <p className="text-sm text-muted-foreground">Rural Medical College in Pune, Maharashtra</p>
          <p className="text-xs text-muted-foreground">1 day ago</p>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9 mr-3">
          <AvatarImage src="/placeholder.svg" alt="Avatar" />
          <AvatarFallback>SU</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">System update completed</p>
          <p className="text-sm text-muted-foreground">Blockchain infrastructure updated to version 2.4</p>
          <p className="text-xs text-muted-foreground">2 days ago</p>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9 mr-3">
          <AvatarImage src="/placeholder.svg" alt="Avatar" />
          <AvatarFallback>AH</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Apollo Hospital onboarded</p>
          <p className="text-sm text-muted-foreground">New branch in Hyderabad, Telangana</p>
          <p className="text-xs text-muted-foreground">3 days ago</p>
        </div>
      </div>
    </div>
  )
}

