'use client'
import useStoreUser from '@/entities/user/store/useStoreUser'
import RedirectToPath from '@/shared/ui/Redirect/RedirectToPath';
import Starfield from '@/shared/ui/StarField';
import React from 'react'

const Dashboard = () => {
  const { authUser } = useStoreUser();

  if(!authUser) {
    return <RedirectToPath to="/login"/>
  }


  return (
    <div className='min-h-[calc(100svh-var(--header-height)-2px)] grid place-items-center relative overflow-hidden'>
      <Starfield
        starCount={1000}
        starColor={[255, 255, 255]}
        speedFactor={0.005}
        backgroundColor="black"
      />
        <div className='grid gap-5'>
            <h1 className='text-2xl text-center'>Добро пожаловать, <span className='capitalize'>{authUser?.username.split(' ')[1]}!</span></h1>
            <p className='text-lg text-center'>Вы можете начать свою работу с боковой панели.</p>
        </div>
    </div>
  )
}

export default Dashboard