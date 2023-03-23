import CodeMirror from "@uiw/react-codemirror"
import { solidity } from "@replit/codemirror-lang-solidity"
import { FC } from "react"

interface IProps {
  value: string
  onChange: (value: string) => void
}
export const Editor: FC<IProps> = ({ value, onChange }) => {
  return (
    <>
      <CodeMirror
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
