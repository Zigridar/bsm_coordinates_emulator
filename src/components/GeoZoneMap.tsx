import React, {useEffect, useRef, useState} from 'react'
import {fabric} from 'fabric'
import {Canvas, IEvent} from 'fabric/fabric-impl'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import {changeCurrentCoordsAction} from '../redux/actionCreators'

/** own props interface */
interface OwnProps {
    cardPadding: number
    canvasHandlers?: Map<string, (event: IEvent) => void>
}

/** state prop interface */
interface StateProps {
    bsmList: fabric.Object[]
}

/** dispatch prop interface */
interface DispatchProps {
    changeCoordsHandler: (coords: [number, number] ,current: fabric.Object) => void
}

/** map state to props */
const mapStateToProps = (state: FabricState) => {
    const props: StateProps = {
        bsmList: state.bsmList
    }

    return props
}

/** map dispatch to props */
const mapDispatchToProps = (dispatch: Dispatch<FabricObjectAction>) => {
    const props: DispatchProps = {
        changeCoordsHandler: ((coords: [number, number], current: fabric.Object) => {
            dispatch(changeCurrentCoordsAction(coords, current))
        })
    }

    return props
}

/** compound component props type */
type GeoZoneMapProps = StateProps & DispatchProps & OwnProps

/** interactive canvas view */
const GeoZoneMap: React.FC<GeoZoneMapProps> = (props: GeoZoneMapProps) => {

    /** static canvas id */
    const [CANVAS_ID] = useState<string>(`geo_zone_${Date.now()}`)

    /** static canvas */
    const [canvas, setCanvas] = useState<Canvas>(null)

    const ref = useRef(null)

    /** returns dimensions of canvas element (addicted to parent element) */
    //todo make it better
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

    /** canvas dimensions */
    const [dimensions, setDimensions] = useState({ height: 0, width: 0 })

    /** create canvas (apply once) */
    useEffect(() => {

        const handleResize = () => {
            setDimensions({
                ...getDimensions()
            })
        }

        window.addEventListener('resize', handleResize)

        const canvasDim = getDimensions()

        const newCanvas = new fabric.Canvas(CANVAS_ID, {
            backgroundColor: '#CCC',
            height: canvasDim.height,
            width: canvasDim.width,
            stopContextMenu: true,
            selection: false
        })

        const snap = 0

        newCanvas.on('object:moving', (e: IEvent) => {
            const target = e.target

            const canvasDimensions = getDimensions()

            if (target.left < snap)
                target.left = 0

            if (target.top < snap)
                target.top = 0

            if (target.width + target.left > canvasDimensions.width - snap)
                target.left = canvasDimensions.width - target.width

            if (target.height + target.top > canvasDimensions.height - snap)
                target.top = canvasDimensions.height - target.height

        })

        //todo test
        setCanvas(() => newCanvas)

        //todo test
        setDimensions({
            ...getDimensions()
        })

        return (() => window.removeEventListener('resize', handleResize))
    }, [])

    /** refresh size **/
    useEffect(() => {
        if (canvas)
            canvas.setDimensions(getDimensions())
    }, [dimensions])

    /** update */
    useEffect(() => {
        if (canvas)
            canvas.add(...props.bsmList)
    })

    return(<canvas ref={ref} id={CANVAS_ID}/>)
}

/** connect component to redux state */
const GeoZoneMapWithState = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(GeoZoneMap)

export default GeoZoneMapWithState