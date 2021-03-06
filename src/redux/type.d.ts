type FabricState = {
    fantomPoint: fabric.Object
    observable: IObservable
    bsmList: BSM[]
    canvasDim: [number, number]
    hypotenuse: number
    selection: IDeletableFabric
    randomOdd: number
    minTriangleArea: number
    fraction: number
    isLearning: boolean
}

type FabricObjectAction = {
    type: string
    observable?: IObservable
    object?: BSM
    removedObject?: fabric.Object
    canvasDim?: [number, number]
    selection?: fabric.Object,
    numberValue?: number,
    isLearning?: boolean
}

interface IBSM {
    _rssi: number
    geoZone: number
    rssi: number
    _staticCoords: IPoint
    staticCoords: IPoint
}

type BSM = {
    setSelectable: (selectable: boolean) => void
    object: IDeletableFabric
} & IBSM

interface IObservable {
    object: fabric.Object
}

type IDeletableFabric = fabric.Object & {
    forDelete?: boolean
}

type MessageFromMainThread = {
    bsms: IBSM[]
    width: number
    height: number
    hypotenuse: number
}

type MessageFromLearnWorker = {
    result: [number, number, number]
}

/** Общий интерфейс, описывающий координаты точки */
interface IPoint {
    x: number
    y: number
}