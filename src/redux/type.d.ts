type FabricState = {
    fantomPoint: fabric.Object
    observable: IObservable
    bsmList: BSM[]
    vptCoords: VptCoords
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
    selection?: fabric.Object,
    numberValue?: number,
    isLearning?: boolean,
    vptCoords?: VptCoords
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
    type: string
    bsms: IBSM[]
    steps: LearnSteps
    minX: number
    minY: number
    maxX: number
    maxY: number
}

type MessageFromLearnWorker = {
    type: string
    progress?: number
    result?: [number, number, number]
}

/** Общий интерфейс, описывающий координаты точки */
interface IPoint {
    x: number
    y: number
}

type LearnSteps = {
    fractionStep: number
    triangleAreaStep: number
    randomOddStep: number
    learnPointCount: number
}

type VptCoords = {
    tl: IPoint
    tr: IPoint
    bl: IPoint
    br: IPoint
}