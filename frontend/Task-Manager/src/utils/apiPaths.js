export const BASE_URL = "http://localhost:8000"

//utils/apipaths.js

export const API_PATHS={
    AUTH:{
        REGISTER:"api/auth/register", 
        LOGIN: "api/auth/login",
        GET_PROFILE: "api/auth/profile",
    },


    TASKS:{
        GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",
        GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data",
        GET_ALL_TASKS: "/api/tasks",
        GET_TASK_BY_ID:(taskId)=>`/api/tasks/${taskId}`,
        CREATE_TASK: "/api/tasks",
        UPDATE_TASK:(taskId)=>`/api/tasks/${taskId}`,
        DELETE_TASK:(taskId)=>`/api/tasks/${taskId}`,
        UPDATE_TASK_STATUS:(taskId)=>`/api/tasks/${taskId}/status`,
        UPDATE_TODO_CHECKLIST:(taskId)=>`/api/tasks/${taskId}/todo`,
    },

    IMAGE:{
        UPLOAD_IMAGE:"api/auth/upload-image"
    }

}