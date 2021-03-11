interface IBSM {
    imei: number
    rssi: number
    _staticCoords: IPoint
    staticCoords: IPoint
}

type BSM = {
    setSelectable: (selectable: boolean) => void
    object: IDeletableFabric
    rssi0: number
    r0: number
    outsideImei: number
} & IBSM

interface IObservable {
    imei: number
    movableObject: fabric.Object | null
    fakePoint: fabric.Object
    calculatedPoint: fabric.Object | null
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

type FullSu = {
    syncSign: boolean
    levelOfMotorActivity: number
    alarm: boolean
    temperature: number
    pressure: number
    accelerometerSignal: string
} & ReducedSu

type ReducedSu = {
    id: number
    suReceivingTime: number
    iuList: IuData[]
}

type IuData = {
    rssi: number
    nois: number
    id: number
}

type LbsmData = {
    receivingTime: number
    receivingNois: number
    reducedSuList: ReducedSu[]
    receivingRssi: number
    fullSuList: FullSu[]
} | null

type StatisticRow = {
    observableImei: number
    calcPoint: IPoint
    randomPoint: IPoint
    realPoint: IPoint
}

type StatTableRow = {
    index: number
    key: string
    imei: number
    calculated: string
    random: string
    real: React.ReactNode
}

type SerializedObservable = {
    imei: number
    fakePoint: any
    calculatedPoint: any
}

type SerializedBSM = {
    object: any
    rssi0: number
    r0: number
    outsideImei: number
    imei: number
}

type RandomOddStorage = {
    randomOdd: number
    minArea: number
    fraction: number
}