import api from '../utils/api'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' //useHistory foi substitiodo na v.6  
import useFlashMessage from './useFlashMessage'

export default function useAuth() {
  const { setFlashMessage } = useFlashMessage()
  const [authenticated, setAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
      setAuthenticated(true)
    }
  },[])
  /* 
   const [loading, setLoading] = useState(true)
   
 
     setLoading(false)
   
 */

  async function register(user) {

    let msgText = 'Cadastro realizado com sucesso!'
    let msgType = 'success'

    try {
      const data = await api.post('/users/register', user).then((response) => {
        return response.data
      })
      await authUser(data)

    } catch (error) {

      msgText = error.response.data.message //erro?
      msgType = 'error'
    }

    setFlashMessage(msgText, msgType)
  }

  async function authUser(data) {

    setAuthenticated(true)
    localStorage.setItem('token', JSON.stringify(data.token))

    navigate('/')
  }

  async function login(user) {

    let msgText = 'Login realizado com sucesso!'
    let msgType = 'success'

    try {
      const data = await api.post('/users/login', user).then((response) =>{
        return response.data

      })
      await authUser(data)
      
    } catch (error) {
      msgText = error.response.data.message //erro?
      msgType = 'error'
    }
    setFlashMessage(msgText, msgType)
  }

  function logout() {
    const msgText = 'Logout realizado com sucesso!'
    const msgType = 'success'

    setAuthenticated(false)
    localStorage.removeItem('token')
    api.defaults.headers.Authorization = undefined
    navigate('/login')

    setFlashMessage(msgText, msgType)
  }

  return {  authenticated, register, logout,login, }

}