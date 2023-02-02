import { lazy } from "react"

export const Main = lazy(() =>
  import("src/pages/Main/Main").then((module) => ({
    default: module.Main
  }))
)
export const ProblemsInterface = lazy(() =>
  import("src/pages/ProblemsInterface/ProblemsInterface").then((module) => ({
    default: module.ProblemsInterface
  }))
)
export const UserProfile = lazy(() =>
  import("src/pages/UserProfile/UserProfile").then((module) => ({
    default: module.UserProfile
  }))
)
export const GenericNotFound = lazy(() =>
  import("src/pages/GenericNotFound/GenericNotFound").then((module) => ({
    default: module.GenericNotFound
  }))
)
