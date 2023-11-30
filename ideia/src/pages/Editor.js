import { useContext, useEffect, useState, useRef} from 'react';

import { useNavigate } from 'react-router-dom';

import { UserContext } from '../App';

import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket"
import { isValidAutomergeUrl, Repo} from "@automerge/automerge-repo"
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb"

import ReactQuill from "react-quill"
//import QuillDelta from "quill-delta"
import "react-quill/dist/quill.snow.css";


function Editor() {

  

  const blockUpdate = useRef(false)

  const context = useContext(UserContext)

  const nav = useNavigate()

  const network = useRef(null)
  const storage = useRef(null)
  const repo = useRef(null)
  const handle = useRef(null)

  useEffect(() => {
    network.current = new BrowserWebSocketClientAdapter("ws://localhost:3030")
    storage.current = new IndexedDBStorageAdapter()
    repo.current = new Repo({
      network: [network.current],
      storage: storage.current
    })

    const docId = `${document.location.hash.substr(1)}`

    const docUrl = `automerge:${docId}`
    if (isValidAutomergeUrl(docUrl) ) {
      handle.current = repo.current.find(docUrl)
    }
    else {
      nav("/")
    }

    if(!context.get() && !context.loading()){
      nav("/")
    }
    else if(handle.current){
      fetchDoc()
      setInterval(updateDoc, 1000)
    }
  }, [])

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

      <a href="/">voltar</a> <button type="button">Adicionar colaborador</button>
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
