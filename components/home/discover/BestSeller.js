import { Carousel } from "react-bootstrap"
import Image from "next/image"
import style from "../../../styles/BestSeller.module.css"

export default function BestSeller({games}) {
    return (
        <Carousel className={style.carousel} interval={1500}>
            <Carousel.Item>
                <Image src={games[0]?.image} width={650} height={400} alt={games[0]?.name} className={style.image} />
            </Carousel.Item>
            <Carousel.Item>
                <Image src={games[1]?.image} width={650} height={400} alt={games[1]?.name} className={style.image} />
            </Carousel.Item>
            <Carousel.Item>
                <Image src={games[2]?.image} width={650} height={400} alt={games[2]?.name} className={style.image} />
            </Carousel.Item>
        </Carousel>
    )
}