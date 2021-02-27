import React, {useEffect, useRef, useState} from 'react'
import {fabric} from 'fabric'
import {Canvas} from 'fabric/fabric-impl'

type GeoZoneMapProps = {
    cardPadding: number
}

const GeoZoneMap: React.FC<GeoZoneMapProps> = (props: GeoZoneMapProps) => {

    const [CANVAS_ID] = useState<string>(`geo_zone_${Date.now()}`)

    const [canvas, setCanvas] = useState<Canvas>(null)

    const ref = useRef(null)

    const getDimensions = () => {
        const parentCard = ref
            .current
            .parentElement
            .parentElement
            .parentElement

        return {
            width: parentCard.clientWidth - 2 * props.cardPadding,
            height: parentCard.clientHeight - 2 * props.cardPadding
        }
    }

    const [, setDimensions] = useState({ height: window.innerHeight, width: window.innerWidth })

    useEffect(() => {

        const handleResize = () => {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })
        }

        window.addEventListener('resize', handleResize)

        const canvasDim = getDimensions()

        //todo test
        setCanvas(() => new fabric.Canvas(CANVAS_ID, {
            backgroundColor: '#CCC',
            height: canvasDim.height,
            width: canvasDim.width
        }))

        return (() => window.removeEventListener('resize', handleResize))
    }, [])

    useEffect(() => {
        const dim = getDimensions()
        console.log(dim)
        if (canvas)
            canvas.setDimensions(dim)
    })

    return(<canvas ref={ref} id={CANVAS_ID}/>)
}

export default GeoZoneMap