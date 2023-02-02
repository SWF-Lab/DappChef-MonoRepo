import { render, screen } from "@testing-library/react"
import renderer from "react-test-renderer"
import { Main } from "src/pages/Main/Main"

describe("Example Page", () => {
  it("should render correcty", () => {
    const component = renderer.create(<Main />)

    expect(component).toMatchSnapshot()
  })
  it("should be able to render Example text", () => {
    render(<Main />)

    expect(screen.getByText(/Main/i)).toBeInTheDocument()
  })
})
