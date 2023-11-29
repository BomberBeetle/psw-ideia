import { useContext } from "react"
import { UserContext } from "../App"
import Login from "./Login"

import {useState, useEffect} from "react"


function Index(){

    const [docs, setDocs] = useState([])

    const context = useContext(UserContext)

    useEffect(()=>{

    if(context.get())
    fetch("http://localhost:3030/doc/all", { 
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    params: {
        id: context.get().id
    }
}).then((res)=>{
    res.json().then((val)=>{
        setDocs(val)
    }).catch((err)=>{
        console.log(err)
    })
})
    }, [context])

    
    return context.get()?(
    <div>
        <button type="button">+ Novo Documento</button>
        {docs.length}
        
    </div>
    ):(
    <Login />
    )
}

export default Index