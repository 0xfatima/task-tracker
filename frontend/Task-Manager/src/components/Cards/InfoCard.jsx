import React from 'react'

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className='flex items-center gap-3 bg-white shadow-sm rounded-lg p-4'>
      {/* Colored dot */}
      <div className={`w-3 h-3 ${color} rounded-full`}></div>

      {/* Text block */}
      <div className='flex flex-col'>
        <span className='text-lg font-semibold text-black'>
          {value}
        </span>
        <span className='text-sm text-gray-500'>
          {label}
        </span>
      </div>
    </div>
  )
}

export default InfoCard
