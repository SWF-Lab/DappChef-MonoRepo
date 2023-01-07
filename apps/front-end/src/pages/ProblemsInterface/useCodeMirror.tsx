import { useEffect, useRef } from "react"

import { solidity } from "./codemirror-solidity"
import { basicSetup } from "codemirror"
import { EditorView, keymap } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { indentWithTab } from "@codemirror/commands"

// reference: https://codesandbox.io/s/codemirror6-t9ywwc?file=/src/index.js:540-544
// reference: https://github.com/replit/codemirror-lang-solidity/blob/main/dev/index.ts
export default function CodeMirror({
  value,
  onChange
}: {
  value: any
  onChange: any
}) {
  const editor = useRef<any>()
  const ref = useRef()

  useEffect(() => {
    editor.current = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          keymap.of([indentWithTab]),
          solidity,
          EditorView.updateListener.of(({ state }) => {
            onChange({ target: { value: state.doc.toString() } })
          })
        ]
      }),
      parent: ref.current
    })

    return () => {
      editor.current.destroy()
      editor.current = null
    }
  }, [])

  useEffect(() => {
    if (editor.current && editor.current.state.doc.toString() !== value) {
      editor.current.dispatch({
        changes: { from: 0, to: editor.current.state.doc.length, insert: "" }
      })
    }
  }, [value])

  return <div ref={ref as any} />
}
