import React, {useEffect, useRef, useState} from 'react'
import {fabric} from 'fabric'
import {Canvas, IEvent, ILineOptions} from 'fabric/fabric-impl'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import {changeCanvasDimAction, changeSelectionAction, setObservableAction} from '../redux/actionCreators'

interface OwnProps {
    cardPadding: number
}

interface StateProps {
    bsmList: BSM[],
    fantomPoint: fabric.Object
    observable: IObservable
}

interface DispatchProps {
    changeDim: (dim: [number, number]) => void
    changeSelection: (object: fabric.Object) => void
    setObservable: (object: IObservable) => void
}

const mapStateToProps = (state: FabricState) => {
    const props: StateProps = {
        bsmList: state.bsmList,
        fantomPoint: state.fantomPoint,
        observable: state.observable
    }

    return props
}

const mapDispatchToProps = (dispatch: Dispatch<FabricObjectAction>) => {
    const props: DispatchProps = {
        changeDim: (dim: [number, number]) => {
            dispatch(changeCanvasDimAction(dim))
        },
        changeSelection: (object: fabric.Object) => {
            dispatch(changeSelectionAction(object))
        },
        setObservable: (object: IObservable) => {
            dispatch(setObservableAction(object))
        }
    }

    return props
}

/** create canvas grid */
 const createGrid = (canvas: fabric.Canvas) => {
     const options = {
         distance: 50,
         width: canvas.width,
         height: canvas.height
     }

     const lineOptions: ILineOptions = {
        stroke: '#ebebeb',
        strokeWidth: 1,
        selectable: false,
        hasBorders: false,
        hasControls: false
     }

     const gridLen = options.width / options.distance

     for (let i = 0; i < gridLen; i++) {
         const distance = i * options.distance

         const horizontal = new fabric.Line([distance, 0, distance, options.width], lineOptions)
         const vertical = new fabric.Line([0, distance, options.width, distance], lineOptions)

         if(i % 2 === 0) {
             horizontal.set({stroke: '#cccccc'})
             vertical.set({stroke: '#cccccc'})
         }

         canvas.add(horizontal)
         canvas.add(vertical)
     }
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
            backgroundColor: '#fff',
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

        const canvasHandlers: Array<[string, (e: IEvent) => void]> = [
            [
                'selection:cleared',
                () => {
                    props.changeSelection(null)
                }
            ],
            [
                'selection:updated',
                (e: IEvent & {selected: fabric.Object[]}) => {
                    props.changeSelection(e.selected[0])
                }
            ],
            [
                'selection:created',
                (e: IEvent & {selected: fabric.Object[]}) => {
                    props.changeSelection(e.selected[0])
                }
            ]
        ]

        /** add additional handlers */
        canvasHandlers.forEach((item: [string, (e: IEvent) => void]) => {
            newCanvas.on(...item)
        })

        setCanvas(() => newCanvas)


        const initialDim = getDimensions()

        props.changeDim([initialDim.width, initialDim.height])

        setDimensions({
            ...initialDim
        })

        newCanvas.add(props.fantomPoint)
        props.fantomPoint.center()

        newCanvas.add(props.observable.object)
        props.observable.object.center()

        createGrid(newCanvas)

        return (() => window.removeEventListener('resize', handleResize))
    }, [])

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
            canvas.getObjects().forEach((item: IDeletableFabric) => {
                if (item.forDelete)
                    canvas.remove(item)
            })
            canvas.renderAll()
        }
    })

    return(<canvas ref={ref} id={CANVAS_ID}/>)
}

const GeoZoneMapWithState = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(GeoZoneMap)

export default GeoZoneMapWithState