import React, { useState } from 'react'
import { LuChevronDown } from 'react-icons/lu'
const SelectDropdown = ({options, value, placeholder, onChange }) => {

    const [isOpen, setIsOpen] = useState(false)

    const handleSelect=(option)=>{
        onChange(option);
        setIsOpen(false)
    }

  return (
    <div className='relative w-full'>
        <button onClick={()=>setIsOpen(!isOpen)}
            className='full text-sm text-black bg-white border border-gray-300 px-3 py-2 rounded-md flex items-center justify-between'
            >
            {value? options.find((opt)=>opt.value===value)?.label:placeholder}
            <span className='ml-2' >{isOpen?<LuChevronDown className='rotate-180'/>:<LuChevronDown/>}</span>

        </button>
        {/* dropdown menu */}

        {isOpen && (
            <div className='absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10'>
                {options.map((option)=>(
                    <div
                    key= {option.value}
                    onClick={()=>handleSelect(option.value)}
                    className='px-3 py-2 text-sm cursor-pointer hover:bg-gray-100'
                    >
                        {option.label}
                        </div>
                ))}
                </div>
        )}

    </div>
  )
}

export default SelectDropdown