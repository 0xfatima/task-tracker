import { LuLayoutDashboard, LuClipboardCheck, LuSquarePlus, LuLogOut } from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";

export const SIDE_MENU_DATA= [
    {
        id:"01",
        label:"Dashboard",
        icon:LuLayoutDashboard,
        path:'/dashboard',
    },
    {
        id:"02",
        label:"Edit Tasks",
        icon:FaRegEdit,
        path:'/edit/tasks',
    },
    {
        id:"03",
        label:"Create Tasks",
        icon:LuSquarePlus,
        path:'/create-task',
    },
    {
        id:"04",
        label:"Check Tasks",
        icon:LuClipboardCheck,
        path:'/update/tasks',
    },
    {
        id:"05",
        label:"Logout",
        icon:LuLogOut,
        path:'logout',
    },
    
]





export const PRIORITY_DATA=[
    {label:"Low", value:'Low'},
    {label:"Medium", value:'Medium'},
    {label:"High", value:'High'}, 
]

export const STATUS_DATA=[
    {label:"Pending", value:'Pending'},
    {label:"In Progress", value:'In Progress'},
    {label:"Completed", value:'Completed'}, 
]