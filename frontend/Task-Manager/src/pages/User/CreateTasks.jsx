import React, { useEffect, useState } from 'react'
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
import Modal from '../../components/layouts/Modals'
import DeleteAlert from '../../components/layouts/DeleteAlert'

const CreateTasks = () => {

  const [llmLoading, setLLMLoading] = useState(false)
  const [llmResponse, setLLMResponse] = useState([])
  const [llmError, setLLMError] = useState("")
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
 
  });

  const [currentTask, setCurrentTask] = useState();

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
    dueDate:"",
    assignedTo:"",
    todoChecklist:[],
   
    })
  }


  //create Task
const createTask = async () => {
  setLoading(true)

  try {
    const todolist = taskData.todoChecklist?.map((item) => ({
      text: item,
      completed: false
    }));

    const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
      ...taskData,
      dueDate: new Date(taskData.dueDate).toISOString(),
      todoChecklist: todolist
    });

    toast.success("Task created successfully");
    clearData();

    // Reset AI suggestions
    setLLMResponse([]);
    setLLMError("");
  } catch (error) {
    console.error("error creating task", error)
  } finally {
    setLoading(false)
  }
}


    //update Task
  const updateTask = async ()=>{
    setLoading(true)
    try{
      const todolist = taskData.todoChecklist?.map((item)=>{
        const prevTodoChecklist = currentTask?.todoChecklist||[]
        const matchedTask = prevTodoChecklist.find((task)=>task.text== item)

        return{
          text:item,
          completed:matchedTask? matchedTask.completed:false,
        };
      });
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(taskId),
        {
          ...taskData,
          dueDate: new Date(taskData.dueDate).toISOString(),
          todoChecklist:todolist,
        }
      );
      toast.success("Task Updated Successfully");
    }catch(error){
      console.error("Error creating task:", error);
      setLoading(false);
    }finally{
      setLoading(false)
    }
  }

  const handleSubmit = async ()=>{

    setError(null)

    //input validation

    if(!taskData.title.trim()){
      setError("Title is required.")
      return
    }
    if(!taskData.description.trim()){
      setError("Description is required.")
      return
    }
    if(!taskData.dueDate){
      setError("Due date is required.")
      return
    }
    if(!taskData.title.trim()){
      setError("Descriptionis required.")
      return
    }
    if(taskData.todoChecklist?.length===0){
      setError("Add atleast one todo task.")
      return
    }

    if(taskId){
      updateTask()
      return
    }

    createTask();
  }

  //get task info by id
  const getTaskDetailsByID = async()=>{
      try{
        const response = await axiosInstance.get(
          API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
        );
        if(response.data){
          const taskInfo = response.data;
          setCurrentTask(taskInfo);
          setTaskData((prevState)=>({
            title:taskInfo.title,
            description:taskInfo.description,
            priority:taskInfo.priority,
            dueDate:taskInfo.dueDate?moment(taskInfo.dueDate).format("YYYY-MM-DD"):null,
            todoChecklist:
            taskInfo?.todoChecklist?.map((item)=>item?.text)||[]

          }))
        }
      }catch(error){
        console.error("Error fetching users", error )
      }
  }

  const deleteTask = async ()=>{
    try{
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

      setOpenDeleteAlert(false);
      toast.success("details deleted successfully")
      navigate("/admin/tasks")
    }catch(error){
      console.error(
        "Error deleting expense",
        error.reponse?.data?.message|| error.message
      );
    }
  }

useEffect(()=>{
  if(taskId){
    getTaskDetailsByID(taskId)
  }

  return ()=>{}
},[taskId])



const handleLLMResponse = async ()=>{
  if(!taskData.description){
    toast.error("please enter description first")
  }
  try{
    setLLMLoading(true)
    setLLMError("")
    setLLMResponse("")

    const response = await axiosInstance.post(API_PATHS.TASKS.GET_LLM_RESPONSE,{
      description: taskData.description
  })
  console.log("resposne from llm",response);
  
  if(response.data.subtasks && Array.isArray(response.data.subtasks)){
    setLLMResponse(response.data.subtasks)
    toast.success("AI suggestions generated")
  }else{
    setLLMError("no response")
  }
  }catch(error){
    console.error("Error fetching AI response:",error)
    setLLMError("failed to fetch")
  }finally{
    setLLMLoading(false)
  }
  
}


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
                <button onClick={handleLLMResponse} className='text-sm font-medium text-white bg-blue-500 p-2 cursor-pointer rounded-sm mt-1 hover:bg-blue-400'>{llmLoading?'generating...':'Use AI suggestions'}</button>
{llmError && <p className="text-red-500 text-sm mt-2">{llmError}</p>}

{llmResponse && llmResponse.length > 0 && (
  <div className="mt-3">
    <h4 className="font-semibold mb-2 text-sm text-slate-700">AI Suggested Subtasks:</h4>
    <ul className="list-disc pl-5 text-sm text-slate-600">
      {llmResponse.map((task, index) => (
        <li key={index}>{task}</li>
      ))}
    </ul>
  </div>
)}
  
</div>

{error && (
<p className='text-xs font-medium text-red-500 mt-5'>
  {error}
</p>

)}

<div className='flex justify-end mt-7'>
<button
className='add-btn'
onClick={handleSubmit}
disabled={loading}

>

  {taskId?"UPDATE TASK": "CREATE TASK"}
</button>
</div>
          </div>
        </div>
      </div>

<Modal
isOpen={openDeleteAlert}
onClose={()=>setOpenDeleteAlert(false)}
title="Delete Task">
  <DeleteAlert
  content="Are you sure you want to delete this task?"
  onDelete={()=>deleteTask()}/>
</Modal>
    </DashboardLayout>
  )
}

export default CreateTasks