import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { useUserAuth } from '../../hooks/useUserAuth'
import moment from 'moment'
import { addThousandsSeparator } from '../../utils/helper'
import InfoCard from '../../components/Cards/InfoCard'
import CustomPieChart from '../../components/Charts/CustomPieChart'
import CustomBarChart from '../../components/Charts/CustomBarChart'

// const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"]
const COLORS = ["#F59E0B", "#3B82F6", "#10B981"]


const Dashboard = () => {
    useUserAuth()

    const {user} = useContext(UserContext)
   const navigate = useNavigate();

   const [dashboardData, setDashboardData] = useState(null)
   const [pieChartData, setPieChartData] = useState([])
   const [barChartData, setBarChartData] = useState([])


   const prepareChartData = (data)=>{
    const taskDistribution = data.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels ||null;

const taskDistributionData =[
  {status: "Pending", count: taskDistribution?.Pending||0},
  {status: "In Progress", count: taskDistribution?.InProgress||0},
  {status: "Completed", count: taskDistribution?.Completed||0},
]

setPieChartData(taskDistributionData)


const PriorityLevelData =[
  {priority: "Low", count: taskPriorityLevels?.Low||0},
  {priority: "Medium", count: taskPriorityLevels?.Medium||0},
  {priority: "High", count: taskPriorityLevels?.High||0},
]

setBarChartData(PriorityLevelData)
   }
   const getDashboardData = async()=>{
    try{
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_USER_DASHBOARD_DATA
      );
      if(response.data){
        setDashboardData(response.data)
        prepareChartData(response.data?.charts || null)
      }
    }catch(error){
      console.error("error fetching users: ", error);
    }
   }

   useEffect(()=>{
    getDashboardData();

    return ()=>{};
   }, [])
  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className='card my-5'>
        <div>
          <div className='col-span-3'>
{user && (
  <h2 className='text-xl md:text-2xl'> Hello {user.name}!</h2>
)}            <p className='test-xs md:text-[13px] text-gray-400 mt-1.5'>
              {moment().format("dddd D MMM YYYY")}
            </p>
          </div>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5'>
          <InfoCard
          label="Total Tasks"
          value ={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.All||0
          )}

          color='bg-primary'
          />

          <InfoCard
          label="Pending Tasks"
          value ={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.Pending||0
          )}

          color='bg-[#F59E0B]'
          />
          <InfoCard
          label="In Progress Tasks"
          value ={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.InProgress||0
          )}

          color='bg-[#3B82F6]'
          />
          <InfoCard
          label="Completed Tasks"
          value ={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.Completed||0
          )}

          color='bg-[#10B981]'
          />

        </div>

          <div>
            <div className='card' style={{ height: 400 }}>
              <div className='flex items-center justify-between'>
                <h5 className='font-medium'>
                Task Distribution
                </h5>
              </div>

              <CustomPieChart
              data={pieChartData}
              colors ={COLORS} />

            </div>
          </div>

          {/* <div>
            <div className='card' style={{ height: 300 }}>
              <div className='flex items-center justify-between'>
                <h5 className='font-medium'>
                Task Priority Levels
                </h5>
              </div>

              <CustomBarChart
              data={barChartData}
              />

            </div>
          </div> */}

      </div>
</DashboardLayout>
  )
}

export default Dashboard