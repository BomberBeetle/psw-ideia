import { useContext, useState } from "react"
import "../css/Login.css"

import {UserContext} from "../App"

export default function Login(){

  const cont = useContext(UserContext);

  const [failedLogin, setFailedLogin] = useState(false)
  const [emailText, setEmailText] = useState("")
  const [passwordText, setPasswordText] = useState("")

  const handleEmail = (e)=>setEmailText(e.target.value)
  const handlePassword = (e)=>setPasswordText(e.target.value)

  const tryLogin = () => {
    fetch("http://" + window.location.hostname + ":3030/login/", {
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
          cont.set({id: val.id})
          setFailedLogin(false)
          console.log(val.id)
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
        
      <button onClick={tryLogin} type="button">Login</button>
      <b>{failedLogin?"Email ou senha errados.":""}</b>
      <a href="/register">Registrar conta</a>
    </div>
  </form>
    )
}