import React, { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { PRIORITY_DATA } from '../../utils/data'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import {useLocation, useNavigate} from 'react-router-dom'
import moment from "moment"
import {LuTrash2} from "react-icons/lu"
import SelectDropdown from '../../components/Inputs/SelectDropdown'
import TodoListInput from '../../components/Inputs/TodoListInput'

const CreateTasks = () => {

  const location = useLocation();
  const {taskId} = location.state || {}
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title:"",
    description:"",
    priority:"Low",
    dueDate:null,
    assignedTo:[],
    todoChecklist:[],
    attachments:[],
  });

  const [currentTask, setCurrentTask] = useState(null);

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false)

  const handleValueChange=(key, value)=>{
    setTaskData((prevData)=>(
      {...prevData, [key]:value}
    ))
  }

  const clearData=()=>{
    //reset form

    setTaskData({
    title:"",
    description:"",
    priority:"Low",
    dueDate:null,
    assignedTo:[],
    todoChecklist:[],
    attachments:[],
    })
  }


  //create Task
  const createTask = async ()=>{}

    //update Task
  const updateTask = async ()=>{}

  const handleSubmit = async ()=>{}

  //get task info by id
  const getTaskDetailsByID = async()=>{}

  const deleteTask = ()=>{}


  return (
    <DashboardLayout activeMenu="Create Task">
      <div className='mt-5'>
        <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
          <div className='form-card col-span-3'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl md:text-xl font-medium'>
                {taskId?"Update Task":"Create Task"}
              </h2>

              {taskId && <button className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer' onClick={()=>setOpenDeleteAlert(true)}>
                <LuTrash2 className='text-base'/> Delete
                </button>}
            </div>

            <div>
              <label htmlFor="" className='text-xs font-medium text-slate-600' >Task Title</label>
              <input type="text" placeholder='Create App ui' value ={taskData.title} className='form-input'
              onChange={({target})=>handleValueChange("title", target.value)}
              />
            </div>

            <div className='mt-3'>
              <label htmlFor="" className='text-xs font-medium text-slate-600'>
                Description
              </label>

              <textarea placeholder='Describe task' className='form-input'
              rows={4}
              value={taskData.description}
              onChange={({target})=>
                handleValueChange("description", target.value)
              }
              ></textarea>
            </div>

            <div className='grid grid-cols-12 gap-4 mt-2'>
              <div className='col-span-6 md:col-span-4'>
                <label htmlFor="" className='text-xs font-medium text-slate-600'>Priority</label>
                <SelectDropdown
                options ={PRIORITY_DATA}
                value = {taskData.priority}
                onChange ={(value)=>handleValueChange("priority", value)}
                placeholder ="Select Priority"/>

              </div>

                <div className='col-span-6 md:col-span-4'>
    <label htmlFor="" className='text-xs font-medium text-slate-600'>Due Date</label>
    <input
      value={taskData.dueDate}
      onChange={(e) => handleValueChange("dueDate", e.target.value)}
      type="date"
      className="w-full border border-slate-300 rounded-md mt-1  z-10 px-2 py-1"
      placeholder="Create UI"
    />
  </div>

</div>

<div className='mt-3'>
  <label htmlFor="" className='text-xs font-medium text-slate-600'>
    TODO CHECKLIST
  </label>

  <TodoListInput
  todoList = {taskData?.todoChecklist}
  setTodoList ={(value)=>handleValueChange("todoChecklist", value)}/>
  
</div>
          </div>
        </div>
      </div>

    </DashboardLayout>
  )
}

export default CreateTasks