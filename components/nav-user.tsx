"use client"
import {
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { User, UserService } from "@/src/services/userServices"
import { Role } from "@/src/services/userServices"
import { Button } from "./ui/button"
import { useEffect, useState} from "react"
import { useRouter } from 'next/navigation';
export function NavUser() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null)
  const [role,setRole]=useState<string|undefined>()
  const userSerivce=new UserService()
  useEffect(() => {
    const fetchUser = async () => {
      const userService = new UserService()
      const userData = await userService.getCurrentUser()
      setUser(userData)
    }
    fetchUser()
  }, [])

  useEffect(()=>{
    setRole(user?.rola ? Role[user?.rola] : "not logged")
    //console.log(Role[user?.rola])
  },[user])
  //console.log("tt",user)
  function handleLogout(){
    userSerivce.logOut()
    setUser(null)
    //console.log("przed odswieżeniem")
    //router.push("/");
    window.location.reload()
  }
  const { isMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              aria-label="Open user menu"
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                {/* <AvatarImage src={role} alt={user?.imie} /> */}
                <AvatarFallback className="rounded-lg">{user?.login}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.login}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {role}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* <AvatarImage src={role} alt={user?.imie} /> */}
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.imie}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.nazwisko}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCircleIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              
              <Button onClick={()=>handleLogout()}><LogOutIcon />Log out</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
