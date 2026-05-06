import React from 'react'
import { BsRobot } from 'react-icons/bs'

const Footer = () => {
  return (
    <div className='bg-[#f3f3f3] flex justify-center px-4 pb-10 py-4 pt-10'>
      <div className='w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 py-8 px-3 text-center'>
        <div className='flex justify-center items-center gap-3 mb-3'>
           <div className='bg-black text-white p-2 rounded-lg'>
               <BsRobot  size={16}/>
           </div>
           <h2 className='font-semibold'>Interview-AI</h2>
        </div>
        <p className='text-sm text-gray-500 max-w-xl mx-auto'>
            AI powered Interview prepration platform. Get ready for your next interview with our AI-powered mock interview platform. Practice with real interview questions, receive instant feedback, and boost your confidence. Start preparing today and ace your next interview!
         </p>
      </div>
    </div>
  )
}

export default Footer
