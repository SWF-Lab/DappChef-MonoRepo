import axios from "axios"
import { useCallback, useState } from "react"
import styled from "styled-components"
import { Editor } from "../../components/Editor"
const EditorContainer = styled.div`
  height: 100%;
  width: 100%;
`
const EditorTop = styled.div`
  height: 40px;
  width: 100%;
  background-color: black;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Button = styled.button`
  width: 100px;
  height: 30px;
  border-radius: 10px;
  background-color: rgba(231, 76, 60);
  font-size: 20px;
  margin-right: 10px;
  &:hover {
    background: rgba(231, 76, 60, 0.9);
  }
`
export const CodeEditor = ({ code }: { code: string }) => {
  const [value, setValue] = useState(code)
  const onChange = useCallback((value: string) => {
    setValue(value)
  }, [])

  const handleSubmit = useCallback(() => {
    axios.post("http://localhost:4000/compile", {
      code: value.replace(/\n/g, "\n").replace(/"/g, "'"),
      lecture: "Lecture1"
    })
  }, [value])

  return (
    <>
      <EditorTop>
        <div
          style={{
            marginLeft: "10px",
            display: "flex"
          }}
        ></div>
        <div>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </EditorTop>
      <EditorContainer>
        <Editor value={value} onChange={onChange} />
      </EditorContainer>
      {value}
    </>
  )
}
