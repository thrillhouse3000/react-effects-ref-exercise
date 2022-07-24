import {useState, useEffect, useRef} from "react"
import axios from "axios"
import Card from "./Card";
const BASE_URL = 'http://deckofcardsapi.com/api/deck'

const Deck = () => {
    const [cardImg, setCardImg] = useState(null)
    const [deckId, setDeckId] = useState(null)
    const [timerOn, setTimerOn] = useState(false)
    const timerId = useRef()

    useEffect(() => {
        const newDeck = async () => {
            const res = await axios.get(`${BASE_URL}/new/shuffle`)
            setDeckId(res.data.deck_id)
        }
        newDeck()
    }, [])

    const drawCards = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/${deckId}/draw`)
            setCardImg(res.data.cards[0].image)
        } catch {
            setTimerOn(false)
            alert("Out of cards!")
        }
    }

    useEffect(() => {
        if(timerOn) {
            timerId.current = setInterval(() => {
                drawCards()
            }, 1000)
        }
        return () => {
            clearInterval(timerId.current)
            timerId.current = null
        }
    }, [timerOn])

    const stopDrawing = () => {
        setTimerOn(false)
        clearInterval(timerId.current)
    }
    
    return (
        <div>
            {timerOn ?
                <button onClick={stopDrawing}>Stop Drawing</button> : <button onClick={() => setTimerOn(true)}>Start Drawing</button>
            }
            <Card img={cardImg} />
        </div>
    )
};

export default Deck;