import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { createContext, useState } from "react";

import Index from "./pages/Index"
import Editor from "./pages/Editor"

export const UserContext = createContext(null)

function App(){

  const  [userLogin, setUserLogin] = useState(null)

  const userStateWrapper = {
    get: ()=>userLogin,
    set: ()=>setUserLogin
  }

  return(
    <UserContext.Provider value={userStateWrapper}>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Index/>}/>
          <Route path="edit" element={<Editor />}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App