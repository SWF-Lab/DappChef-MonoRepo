import { Suspense } from "react"
import {
  Navigate,
  Route,
  Routes as RoutesReactRouterDom
} from "react-router-dom"
import {
  Main,
  GenericNotFound,
  ProblemsInterface,
  UserProfile,
  MemberInfo
} from "./paths"

export const Routes = () => {
  return (
    <Suspense fallback={<p>carregando</p>}>
      <RoutesReactRouterDom>
        <Route path="/" element={<Main />} />
        <Route path=":probNum" element={<ProblemsInterface />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/About" element={<MemberInfo />} />
        <Route path="*" element={<Navigate to="/404" />} />
        <Route path="/404" element={<GenericNotFound />} />
      </RoutesReactRouterDom>
    </Suspense>
  )
}
