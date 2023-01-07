import { lazy } from "react"

export const Example = lazy(() =>
  import("src/pages/Example/Example").then((module) => ({
    default: module.Example
  }))
)
export const ProblemsInterface = lazy(() =>
  import("src/pages/ProblemsInterface/ProblemsInterface").then((module) => ({
    default: module.ProblemsInterface
  }))
)
export const GenericNotFound = lazy(() =>
  import("src/pages/GenericNotFound/GenericNotFound").then((module) => ({
    default: module.GenericNotFound
  }))
)
