import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import TaskStatusTabs from '../../components/layouts/TaskStatusTabs'
const ManageTasks = () => {
  const [allTasks, setAllTasks] =  useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All")

  const navigate= useNavigate();

  const getAllTasks = async () => {
  try {
    const params = {};
    if (filterStatus !== "All") {
      params.status = filterStatus;
    }

    const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, { params });

    setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

    const statusSummary = response.data?.statusSummary || {};
    const statusArray = [
      { label: "All", count: statusSummary.all || 0 },
      { label: "Pending", count: statusSummary.pendingTasks || 0 },
      { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
      { label: "Completed", count: statusSummary.completedTasks || 0 },
    ];

    setTabs(statusArray);
  } catch (error) {
    console.error('Error fetching tasks', error);  // <-- fixed message
  }
};


  const handlClick =(taskData) =>{
    navigate(`/admin/create-task`, {state:{taskId:taskData._id}});
  };

  useEffect(()=>{
    getAllTasks(filterStatus);
    return ()=>{};
  },[filterStatus]);
   
  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className='my-5'>
        <div className='flex flex-col md:flex-row md:items-center justify-between'>
          <div className='flex items-center justify-between gap-3'>
            <h2 className='text-xl md:text-xl font-medium'>My Tasks</h2>
            
          </div>
          
        </div>

        {allTasks?.length > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
              />

            </div>
          )}
      </div>
    </DashboardLayout>
  )
}

export default ManageTasks