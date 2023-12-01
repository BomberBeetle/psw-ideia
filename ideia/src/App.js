import { BrowserRouter, Routes, Route } from "react-router-dom";

import { createContext, useState, useLayoutEffect } from "react";

import localforage from "localforage"

import Index from "./pages/Index"
import Editor from "./pages/Editor"
import Register from "./pages/Register";
import NotAllowed from "./pages/NotAllowed";

export const UserContext = createContext()

function App(){

  const  [userLogin, setUserLogin] = useState(null)
  const [loading, setLoading] = useState(true)

  const setLogin = (val) => {
    setUserLogin(val)
    localforage.setItem('login', val)
  }

  const userStateWrapper = {
    get: ()=>userLogin,
    set: setLogin,
    loading: ()=>loading
  }

  useLayoutEffect(() =>{
    localforage.getItem('login').then((val)=> {
      setUserLogin(val)
      setLoading(false)
    }
    ).catch((err)=>{
      console.log("Localforage error, defaulting to null")
      setLoading(false)
    })
  }, [])
  

  return(
    <UserContext.Provider value={userStateWrapper}>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Index/>}/>
          <Route path="edit">
            <Route index element={<Editor />}/>
            <Route path="shared/:ownerId" element={<Editor />}/>
          </Route>
          <Route path="register" element={<Register />}/>
          <Route path="notAllowed" element={<NotAllowed />}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App