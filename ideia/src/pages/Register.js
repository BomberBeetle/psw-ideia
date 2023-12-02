import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from 'react-router-dom';
import "../css/Login.css"

import {UserContext} from "../App"

export default function Register(){

  const cont = useRef(useContext(UserContext));

  const nav = useNavigate();

  useEffect(()=>{
    console.log("context: " + cont.current.get())
    if(!!cont.current.get()){
        nav("/")
    }
  }, [])

  const [failedLogin, setFailedLogin] = useState(false)
  const [emailText, setEmailText] = useState("")
  const [passwordText, setPasswordText] = useState("")

  const handleEmail = (e)=>setEmailText(e.target.value)
  const handlePassword = (e)=>setPasswordText(e.target.value)

  const tryLogin = () => {
    fetch("http://" + window.location.hostname + ":3030/register/", {
      method: "post", 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailText,
        password: passwordText
      })
    }).then((res)=>{
      if(res.status === 403){
        setFailedLogin(true);
      }
      else{
        res.json().then(val => {
          cont.current.set({id: val.id})
          setFailedLogin(false)
          console.log(val.id)
          nav("/")
        })
        
      }
    }).catch((err)=>
    {setFailedLogin(true)
      console.log(err)}
      )
  }

    return (
    <form>
    <div className="container">
      <label htmlFor="unome"><b>Email</b></label>
      <input type="text" value={emailText} onChange={handleEmail} placeholder="Email" required/>

      <label htmlFor="psw"><b>Senha</b></label>
      <input type="password" value={passwordText} onChange={handlePassword} placeholder="Senha"required/>
        
      <button onClick={tryLogin} type="button">Registrar</button>
      <b>{failedLogin?"Email já registrado.":""}</b>
    </div>
  </form>
    )
}