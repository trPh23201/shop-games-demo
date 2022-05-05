import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import style from "../styles/404.module.css";

export default function NotFound() {
    const router = useRouter()
    const [count, setCount] = useState(5)

    useEffect(() => {
        const time = setInterval(() => {
            count <= 0 ? router.push('/') : setCount(count - 1)
        }, 1000)
        return () => clearInterval(time)
    }, [router, count])

    return (
        <>
            <Head>
                <title>404</title>
            </Head>
            <div className={style.layout}>
                <h1>404 page not found</h1>
                <h3>Redirecting to home page in {count} second{count >1 && 's'}</h3>
                <span onClick={() => router.back()} className={style.click}>Or click here to go to previous page</span>
            </div>
        </>
    )
}