import { useContext } from "react"
import { UserContext } from "../App"
import Login from "./Login"

import { useNavigate } from "react-router-dom"

import {useState, useEffect} from "react"


function Index(){

    const nav = useNavigate();

    const [docs, setDocs] = useState([])

    const context = useContext(UserContext)

    let createDoc = ()=>{
        fetch("http://" + window.location.hostname + ":3030/doc/create", {
            method: "post", 
             headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: context.get().id
            })
        }).then((res)=>{
            res.json().then((val)=>{
                console.log(val)
                nav(`/edit#${val.document_id}`)
            })
            }).catch((err)=>{console.log(err)
        })
    
    }
    
    let loadDocs = () => {
        fetch("http://" + window.location.hostname + ":3030/all_docs", { 
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Owner-Id':context.get().id
    },
    }).then((res)=>{
    res.json().then((val)=>{
        console.log(val)
        setDocs(val)
    }).catch((err)=>{
        console.log(err)
    })
})
    }

    useEffect(()=>{
    if(context.get()) loadDocs()
    }, [context])

    

    let deleteDoc = (index)=>{
        return () => {
            console.log("delete " + index)
            fetch('http://' + window.location.hostname + ':3030/doc/delete', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ownerId: context.get().id,
                    document_id: docs[index].document_id
                })
            }).then(()=>{
                loadDocs()
                console.log("reloading post delete")
        })
        }
    }

    return context.get()?(
    <div>
        <button type="button" onClick={createDoc}>+ Novo Documento</button>
        {docs.map((doc, index)=>(
            <a href={`/edit#${doc.document_id}`}>
            <div className="card">
            <div className="card-body">
              <h5 className="card-title">{doc.title?doc.title:"(sem título)"}</h5>
              <a href="#" onClick={deleteDoc(index)} className="btn btn-danger" style={{width: "200px"}}>Deletar</a>
            </div>
          </div>
          </a>
            ))}
        
    </div>
    ):(
    <Login />
    )
}

export default Index