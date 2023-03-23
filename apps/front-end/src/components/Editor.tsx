import CodeMirror from "@uiw/react-codemirror"
import { solidity } from "@replit/codemirror-lang-solidity"
import { FC } from "react"
import { historyField } from '@codemirror/commands';

interface IProps {
  value: string
  onChange: (value: string) => void
}
const stateFields = { history: historyField };
export const Editor: FC<IProps> = ({ value, onChange }) => {
  const serializedState = localStorage.getItem('myEditorState');
  return (
    <>
      <CodeMirror
        initialState={
          serializedState
            ? {
              json: JSON.parse(serializedState || ''),
              fields: stateFields,
            }
            : undefined
        }
        value={value}
        theme="dark"
        height="70vh"
        width="100%"
        overflow-y="hidden"
        extensions={[solidity]}
        onChange={onChange}
        scrollbarStyle="overlay"
      />
    </>
  )
}
