import { useEffect, useState } from 'react';

import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket"
import { isValidAutomergeUrl, Repo, DocHandle} from "@automerge/automerge-repo"
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb"

import ReactQuill from "react-quill"
//import QuillDelta from "quill-delta"
import "react-quill/dist/quill.snow.css";


const network =  new BrowserWebSocketClientAdapter("ws://localhost:3030")
const storage = new IndexedDBStorageAdapter()
const repo = new Repo({
  network: [network],
  storage: storage
})



function Editor() {

  const rootDocUrl = `${document.location.hash.substr(1)}`
  let handle
  if (isValidAutomergeUrl(rootDocUrl)) {
    handle = repo.find(rootDocUrl)
  } else {
  handle = repo.create();
  handle.change(d => {
    d.title = "Doc"
    d.content = "";
  })
}
const docUrl = document.location.hash = handle.url

  let changeValue = (val) => {
    setEditorValue(val)
    if (handle.isReady()) {
    handle.change(d => {
      d.content = val;
    })

  }
  }

  let [editorValue, setEditorValue] = useState("")

  let fetchDoc = ()=>{
    handle.doc().then((d) => {
      setEditorValue(d.content);
    })
  }

  useEffect(() => {
    fetchDoc()
    setInterval(fetchDoc, 1000)
  }, [])

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
    <div className="App">
      <header className="App-header">
        <ReactQuill
          modules={modules}
          theme="snow"
          value={editorValue}
          onChange={changeValue}
        />
      </header>
    </div>
  );
}

export default Editor;
