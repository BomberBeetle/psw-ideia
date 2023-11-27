import './App.css';

import {next as A} from '@automerge/automerge'
import { useState } from 'react';

import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket"
import { isValidAutomergeUrl, Repo, DocHandle} from "@automerge/automerge-repo"
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb"

import ReactQuill from "react-quill"
import QuillDelta from "quill-delta"
import "react-quill/dist/quill.snow.css";


const network =  new BrowserWebSocketClientAdapter("ws://localhost:3030")
const storage = new IndexedDBStorageAdapter()
const repo = new Repo({
  network: [network],
  storage: storage
})

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

function App() {

  let changeValue = (val) => {
    setEditorValue(val)
    console.log(handle.state)
    if (handle.isReady()) {
    handle.change(d => {
      d.content = val;
    })

  }
  }

  let [editorValue, setEditorValue] = useState("")

  const modules = {
    toolbar: [
        [{ "font": [] }, { "size": ["small", false, "large", "huge"] }], // custom dropdown

        ["bold", "italic", "underline", "strike"],

        [{ "color": [] }, { "background": [] }],

        [{ "script": "sub" }, { "script": "super" }],

        [{ "header": 1 }, { "header": 2 }, "blockquote", "code-block"],

        [{ "list": "ordered" }, { "list": "bullet" }, { "indent": "-1" }, { "indent": "+1" }],

        [{ "direction": "rtl" }, { "align": [] }],

        ["link", "image", "video", "formula"],

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

export default App;
