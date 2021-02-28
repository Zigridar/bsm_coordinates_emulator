import React, {useEffect, useRef, useState} from 'react'
import {fabric} from 'fabric'
import {Canvas, IEvent} from 'fabric/fabric-impl'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import {changeCanvasDimAction} from '../redux/actionCreators'

interface OwnProps {
    cardPadding: number
    observable?: IObservable
    canvasHandlers?: [string, (event: IEvent) => void][]
    bsmList: BSM[]
}

interface StateProps {
    observable: IObservable
}

interface DispatchProps {
    changeDim: (dim: [number, number]) => void
}

const mapStateToProps = (state: FabricState) => {
    const props: StateProps = {
        observable: state.observable
    }

    return props
}

const mapDispatchToProps = (dispatch: Dispatch<FabricObjectAction>) => {
    const props: DispatchProps = {
        changeDim: (dim: [number, number]) => {
            dispatch(changeCanvasDimAction(dim))
        }
    }

    return props
}

/** own props interface */
type GeoZoneMapProps = OwnProps & StateProps & DispatchProps

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


        const { canvasHandlers = [] } = props

        /** add additional handlers */
        canvasHandlers.forEach((item: [string, (e: IEvent) => void]) => {
            newCanvas.on(...item)
        })

        //todo test
        setCanvas(() => newCanvas)


        const initialDim = getDimensions()

        props.changeDim([initialDim.width, initialDim.height])

        //todo test
        setDimensions({
            ...initialDim
        })

        return (() => window.removeEventListener('resize', handleResize))
    }, [])

    useEffect(() => {
        if (props.observable) {
            canvas.add(props.observable.object)
            props.observable.object.center()
            canvas.renderAll()
            console.log('add obse')
        }
    }, [props.observable])

    /** refresh size **/
    useEffect(() => {
        if (canvas) {
            const dim = getDimensions()
            canvas.setDimensions(dim)
            props.changeDim([dim.width, dim.height])
        }
    }, [dimensions])

    /** update */
    useEffect(() => {
        if (canvas) {
            const newObjects = props.bsmList.map((item: BSM) => item.object)
            canvas.add(...newObjects)
            canvas.getObjects().forEach((item: fabric.Object) => {
                if ((item !== props.observable.object) && !newObjects.some(newItem => newItem === item))
                    canvas.remove(item)
            })
            canvas.renderAll()
        }
    })

    return(<canvas ref={ref} id={CANVAS_ID}/>)
}

const GeoZoneMapWithState = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(GeoZoneMap)

export default GeoZoneMapWithState