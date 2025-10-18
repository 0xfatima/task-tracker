import React from 'react'
import { useState, useEffect } from 'react'
import UI_IMG from '../../assets/images/auth-img.jpg'
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa'; // For Font Awesome icons

const AuthLayout = ({children}) => {
const [quote, setQuote] =useState(
  {
    text:"It is our choices, Harry, that show what we truly are, far more than our abilities.",
    author:"J.K Rowling"
    }
  )

  function getQuotes (){
    fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://api.quotify.top/random'))
  .then(response => response.json())
  .then(data => {
    const quoteData = JSON.parse(data.contents);
    const q = Array.isArray(quoteData) ? quoteData[0] : quoteData;
    console.log(`"${q.text}" - ${q.author}`);
    setQuote({ text: q.text, author: q.author });
  })
  .catch(error => console.error('Error:', error));

  }

 useEffect(()=>{
getQuotes()
 }, [])

  return (
    <div className='flex'>
        <div className='w-screen h-screen md:w-[50vw] px-12 pt-8 pb-12'>
            <h2 className='text-2xl font-bold text-[#000B58] '>
                Task Manager
            </h2>
                {children}
        </div>

        <div className="hidden md:flex flex-col w-[50vw] h-screen items-center text-[#000B58] gap-5 justify-center bg-blue-50 bg-[url('/bg-img.png')] bg-cover bg-no-repeat bg-center overflow-hidden p-12">
        <p className="text-4xl font-bold "><FaQuoteLeft size ={20} color='#7A7A73'/>
  { quote.text.split(" ").map((word, idx) => (
    <span key={idx} style={{ color: word.length > 7 ? "#FF9D00" : "#134686 ", "opacity":"0.8" }}>
      {word}{" "}
    </span>
  ))}
  <FaQuoteRight size ={20} color='#7A7A73'/>
</p>
  
        <p className='text-2xl opacity-70 font-bold text-[#000B58]'>~{quote.author}~</p>     
        </div>
    </div>
  )
}

export default AuthLayout