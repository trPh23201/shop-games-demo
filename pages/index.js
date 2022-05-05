import { useRouter } from "next/router"
import { useEffect } from "react";

export default function Root() {
  const Router = useRouter()

  useEffect(() => {
    Router.push(`/home/discover`)
  })

  return (
    <></>
  )
}