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
  
  let logout = ()=>{
    userStateWrapper.set(null)
}

  return(
    <UserContext.Provider value={userStateWrapper}>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
  			<div className="container">
    				<a className="navbar-brand" href="/"><i className="bi bi-lightbulb-fill" style={{color: "orange"}}></i> IDEIA</a>
            {userStateWrapper.get()?<div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                   <button className="nav-link" type="button" onClick={logout}>Logout</button>
                </li>
              </ul>
            </div>:""}
       </div>
    </nav> 
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