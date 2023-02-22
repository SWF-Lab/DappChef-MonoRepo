import CodeMirror from "@uiw/react-codemirror"
import { solidity } from "@replit/codemirror-lang-solidity"
import { FC } from "react"

interface IProps {
  value: string
  onChange: (value: string) => void
}

export const Editor: FC<IProps> = ({ value, onChange }) => {
  const scrollbarStyle = {
    width: "8px", // Style the vertical scrollbar
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    transition: "background-color 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "#ff0000"
    }
  }

  const scrollbarThumbStyle = {
    backgroundColor: "#c1c1c1", // Style the thumb
    borderRadius: "4px"
  }

  const scrollbarThumbHoverStyle = {
    backgroundColor: "#a1a1a1" // Style the thumb on hover
  }

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
