
import React from 'react'
import { CreateBotForm } from './Forms/CreateBotForm'
import { CreateUserChatForm } from './Forms/CreateUserChatForm'

const AdminPanel = () => {

  return (
    <div>
    <CreateBotForm />
    <CreateUserChatForm/>
    </div>
  )
}

export default AdminPanel