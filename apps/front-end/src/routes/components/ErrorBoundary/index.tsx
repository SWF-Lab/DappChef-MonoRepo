import { Component, ReactElement } from "react"

interface Props {
  children: ReactElement
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: { children: ReactElement }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    const { hasError } = this.state
    const { children } = this.props
    if (hasError) {
      return <h1>Algo deu errado.</h1>
    }
    return children
  }
}
