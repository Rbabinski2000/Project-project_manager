'use client'
import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
// import { useEffect, useState } from "react"
// import { Project } from "@/src/services/projectServices1"
// import { useRouter } from "next/navigation"
import { useProject } from "@/app/context/activePContext"
import Link from "next/link"
import { ThemeToggle } from "./themeToogle"
import { NavUser } from "./nav-user"
import { UserService } from "@/src/services/userServices"

// This is sample data.
const dataS = {
  navMain: [
    {
      title: "Manage Projects",
      url: "/",
      items: [
        {
          title: "Projects CRUD",
          url: "/manage",
        },
        {
          title: "Stories CRUD",
          url: "/stories",
        },
        {
          title: "Task CRUD",
          url: "/tasks",
        },
      ],
    },
    {
      title: "User",
      url: "/",
      items: [
        {
          title: "Login",
          url: "/login",
        }
      ],
    },
    
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

   const {activeProject,setActiveProject}=useProject();
   const userService=new UserService();
  // const router = useRouter(); // Import Next.js router
  
  // const [data,setData]=useState<[]|null>(null)

  // useEffect(() => {
  //     //setActiveProject(activeProjectServicegetActiveProject());
  //   }, []);
   
   
  
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">{activeProject?.nazwa}</span>
                  
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {dataS.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarFooter>
        <NavUser />
      </SidebarFooter>
        <ThemeToggle/>
      </SidebarContent>
      
      <SidebarRail />
    </Sidebar>
  )
}
