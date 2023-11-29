import { useContext } from "react"
import { UserContext } from "../App"
import Login from "./Login"


function Index(){

    const context = useContext(UserContext)
    return context.get()?(
    <div>Hii. hi hi hi hi hihi ==</div>
    ):(
    <Login />
    )
}

export default Index