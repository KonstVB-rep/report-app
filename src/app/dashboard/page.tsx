'use client'
import useStoreUser from '@/entities/user/store/useStoreUser'
import React from 'react'

const Dashboard = () => {
  const { authUser } = useStoreUser();


  return (
    <div className='min-h-[calc(100svh-var(--header-height)-2px)] grid place-items-center'>
        <div className='grid gap-5'>
            <h1 className='text-2xl text-center'>Добро пожаловать, <span className='capitalize'>{authUser?.username.split(' ')[1]}!</span></h1>
            <p className='text-lg text-center'>Вы можете начать свою работу с боковой панели.</p>
        </div>
    </div>
  )
}

export default Dashboard