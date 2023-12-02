import { useContext, useEffect, useState, useRef} from 'react';

import {useNavigate, useParams} from 'react-router-dom';

import Modal from 'react-modal'

import { UserContext } from '../App';

import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket"
import { isValidAutomergeUrl, Repo} from "@automerge/automerge-repo"
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb"

import ReactQuill from "react-quill"
//import QuillDelta from "quill-delta"
import "react-quill/dist/quill.snow.css";


Modal.setAppElement('#root')

function Editor() {

  const [modalIsOpen, setIsOpen] = useState(false)
  const [showModalButton, setShowModalButton] = useState(false)
  const [collabName, setCollabName] = useState("")
  const [modalError, setModalError] = useState("")

  let { ownerId } = useParams()

  const blockUpdate = useRef(false)

  const context = useContext(UserContext)

  const nav = useNavigate()

  const network = useRef(null)
  const storage = useRef(null)
  const repo = useRef(null)
  const handle = useRef(null)

  const docId = `${document.location.hash.substr(1)}`

  useEffect(() => {
    network.current = new BrowserWebSocketClientAdapter("ws://" + window.location.hostname + ":3030")
    storage.current = new IndexedDBStorageAdapter()
    repo.current = new Repo({
      network: [network.current],
      storage: storage.current
    })

    if(!context.get() && !context.loading()){
      nav("/")
      return
    }

    if(context.get()){
      fetch(`http://${window.location.hostname}:3030/doc/${docId}`, {
      headers: {
        'Accept': 'application/json',
        'Owner-Id': ownerId?ownerId:context.get().id,
        'User-Id': context.get().id
      }
    }).then((res)=>{
      if(res.status === 403){
        nav("/notAllowed")
      }
      else if (res.status !== 200){
        nav("/")
      }
      else{
        res.json().then((val)=>{
          if(val.owner === context.get().id){
            setShowModalButton(true);
          }
          const docUrl = `automerge:${val.automerge_id}`
          if (isValidAutomergeUrl(docUrl) ) {
            handle.current = repo.current.find(docUrl)
          }
          else {
            nav("/")
         }
    
         if(handle.current){
            fetchDoc()
           setInterval(updateDoc, 1000)
          }
        })
        
      }
    })}

    
  }, [context])

  let changeValue = (val) => {
    blockUpdate.current = true
    setEditorValue(val)
    if (handle.current.isReady()) {
      handle.current.change(d => {
        d.content = val;
      })
    }
    blockUpdate.current = false
  }

  let changeTitle = (e) => {
    blockUpdate.current = true
    setTitle(e.target.value)
    if (handle.current.isReady()) {
      handle.current.change(d => {
        d.title = e.target.value;
      })
    }
    blockUpdate.current = false
  }

  let changeCollabInput = (e) => {
    setCollabName(e.target.value)
  }

  let [editorValue, setEditorValue] = useState("")
  let [title, setTitle] = useState("")

  let fetchDoc = ()=>{
    handle.current.doc().then((d) => {
      setEditorValue(d.content);
      setTitle(d.title)
    })
  }

  let updateDoc = ()=>{
    if(!blockUpdate.current) fetchDoc();
  }

  let addCollab = ()=>{
    if(collabName){
      fetch("http://" + window.location.hostname + ":3030/add_collab", {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          docId: docId,
          userId: context.get().id,
          ownerId: (ownerId?ownerId:context.get().id),
          collabEmail: collabName
        })
      }).then((res)=>{
        if(res.status === 200){
          setIsOpen(false);
        }
        else if(res.status === 404){
          setModalError("Usuário não encontrado")
        }
      })
    }
  }

  let copyShareLink = ()=>{
    navigator.clipboard.writeText(`http://${window.location.hostname}:3000/edit/shared/${context.get().id}#${docId}`)
  }

  const modules = {
    toolbar: [
        [{ "font": [] }, { "size": ["small", false, "large", "huge"] }], // custom dropdown

        ["bold", "italic", "underline", "strike"],

        [{ "color": [] }, { "background": [] }],

        [{ "script": "sub" }, { "script": "super" }],

        [{ "header": 1 }, { "header": 2 }, "blockquote", "code-block"],

        [{ "list": "ordered" }, { "list": "bullet" }, { "indent": "-1" }, { "indent": "+1" }],

        [{ "direction": "rtl" }, { "align": [] }],

        ["link"],

        ["clean"]
    ]
}

  return (
    <div>
      <Modal 
        isOpen={modalIsOpen}
        onRequestClose={()=>{setIsOpen(false)}}
        contentLabel="add collab modal">
      <p onClick={()=>{setIsOpen(false)}}><i class="bi bi-x-circle-fill"></i></p>
      <input type="text" placeholder='Email do colaborador' value={collabName} onChange={changeCollabInput}/>
      <button type="button" onClick={addCollab}>Adicionar</button>
      <button type="button" onClick={copyShareLink}>Copiar link de compartilhamento</button>
      {modalError?(<p>{modalError}</p>):""}
      </Modal>
      {showModalButton?(<button type="button" onClick={()=>{setIsOpen(true)}}>Adicionar colaborador</button>):""}
      <input type="text" value={title} onChange={changeTitle}/>
        <ReactQuill
          modules={modules}
          theme="snow"
          value={editorValue}
          onChange={changeValue}
        />
    </div>
  );
}

export default Editor;
