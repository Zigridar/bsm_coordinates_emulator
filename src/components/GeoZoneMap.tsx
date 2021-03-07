import React, {useEffect, useRef, useState} from 'react'
import {fabric} from 'fabric'
import {Canvas, IEvent, ILineOptions} from 'fabric/fabric-impl'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import {changeSelectionAction, setObservableAction, setVPTAction} from '../redux/actionCreators'

interface OwnProps {
    cardPadding: number
}

interface StateProps {
    bsmList: BSM[],
    fantomPoint: fabric.Object
    observable: IObservable
}

interface DispatchProps {
    changeSelection: (object: fabric.Object) => void
    setObservable: (object: IObservable) => void
    setVPT: (vpt: VptCoords) => void
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
        changeSelection: (object: fabric.Object) => {
            dispatch(changeSelectionAction(object))
        },
        setObservable: (object: IObservable) => {
            dispatch(setObservableAction(object))
        },
        setVPT: (vpt: VptCoords) => {
            dispatch(setVPTAction(vpt))
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
        stroke: '#7a7a7a',
        strokeWidth: 1,
        selectable: false,
        hasBorders: false,
        hasControls: false
     }

     const shift = 5000

     const gridLen = (options.width + shift)/ options.distance

     for (let i: number = -150; i < gridLen; i++) {
         const distance = i * options.distance


         const horizontal = new fabric.Line([distance, -shift, distance, (options.width + shift)], lineOptions)
         const vertical = new fabric.Line([-shift, distance, (options.width + shift), distance], lineOptions)

         if(i % 2 === 0) {
             horizontal.set({stroke: '#000000'})
             vertical.set({stroke: '#000000'})
         }

         if (distance === 0) {
             horizontal.set({strokeWidth: 3, stroke: '#ff0000'})
             vertical.set({strokeWidth: 3, stroke: '#ff0000'})
         }

         canvas.add(horizontal)
         canvas.add(vertical)
     }

     for (let i: number = -50; i < 50; i++) {
         const horizontalNumberText = new fabric.Text(`${i}`, {
             fontSize: 15,
             selectable: false,
             hasBorders: false,
             hasControls: false,
             top: 0,
             left: i * 100
         })

         const verticalNumberText = new fabric.Text(`${i}`, {
             fontSize: 15,
             selectable: false,
             hasBorders: false,
             hasControls: false,
             top: i * 100,
             left: 0
         })

         canvas.add(horizontalNumberText)
         canvas.add(verticalNumberText)
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
            backgroundColor: '#eed1d1',
            height: canvasDim.height,
            width: canvasDim.width,
            stopContextMenu: true,
            selection: false
        })

        newCanvas.on('object:moving', (e: IEvent) => {
            const target = e.target

            const { tl, br } = newCanvas.vptCoords

            const leftBorder = tl.x
            const topBorder = tl.y
            const rightBorder = br.x
            const bottomBorder = br.y

            if (target.left < leftBorder)
                target.left = leftBorder

            if (target.top < topBorder)
                target.top = topBorder

            if (target.width + target.left > rightBorder)
                target.left = rightBorder - target.width

            if (target.height + target.top > bottomBorder)
                target.top = bottomBorder - target.height

        })

        newCanvas.on('mouse:wheel', (event: IEvent & {e: WheelEvent}) => {

            const e = event.e
            let delta = e.deltaY
            let zoom = newCanvas.getZoom()
            zoom *= 0.999 ** delta

            if (zoom > 10) zoom = 10
            if (zoom < 0.1) zoom = 0.1

            const point = new fabric.Point(e.offsetX, e.offsetY)

            newCanvas.zoomToPoint(point, zoom)

            e.preventDefault()
            e.stopPropagation()

            props.setVPT(newCanvas.vptCoords)
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
            props.setVPT(canvas.vptCoords)
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