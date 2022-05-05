import Head from "next/head";
import Layout from "../../components/Layout";
import Choose from "../../components/management/Choose";

export default function Games(){
    return(
        <Layout>
            <Head><title>Management | Games</title></Head>
            <div style={{marginTop: "20px"}}>
                <Choose/>
                GAMES
            </div>
        </Layout>
    )
}