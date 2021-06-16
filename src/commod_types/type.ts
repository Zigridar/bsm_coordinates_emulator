export interface IBSM {
    imei: number
    rssi: number
    _staticCoords: IPoint
    staticCoords: IPoint
}

export type BSM = {
    setSelectable: (selectable: boolean) => void
    object: IDeletableFabric
    rssi0: number
    r0: number
    outsideImei: number
} & IBSM

export interface IObservable {
    imei: number
    movableObject: fabric.Object | null
    fakePoint: fabric.Object
    calculatedPoint: fabric.Object | null
}

export type IDeletableFabric = fabric.Object & {
    forDelete?: boolean
}

export type MessageFromMainThread = {
    type: string
    bsms: IBSM[]
    steps: LearnSteps
    minX: number
    minY: number
    maxX: number
    maxY: number
}

export type MessageFromLearnWorker = {
    type: string
    progress?: number
    result?: [number, number, number]
}

/** Общий интерфейс, описывающий координаты точки */
export interface IPoint {
    x: number
    y: number
}

export type LearnSteps = {
    fractionStep: number
    triangleAreaStep: number
    randomOddStep: number
    learnPointCount: number
}

export type VptCoords = {
    tl: IPoint
    tr: IPoint
    bl: IPoint
    br: IPoint
}

export type FullSu = {
    syncSign: boolean
    levelOfMotorActivity: number
    alarm: boolean
    temperature: number
    pressure: number
    accelerometerSignal: string
} & ReducedSu

export type ReducedSu = {
    id: number
    suReceivingTime: number
    iuList: IuData[]
}

export type IuData = {
    rssi: number
    nois: number
    id: number
}

export type LbsmData = {
    receivingTime: number
    receivingNois: number
    reducedSuList: ReducedSu[]
    receivingRssi: number
    fullSuList: FullSu[]
} | null

export type StatTableRow = {
    toggleValid: React.ReactNode
    deleteBtn: React.ReactNode
    index: number
    key: string
    imei: number
    calculated: string
    random: string
    real: React.ReactNode
}

export type RandomOddStorage = {
    randomOdd: number
    minArea: number
    fraction: number
}

export interface StatisticRow {
    isValid: boolean
    observableImei: number
    calcPoint: IPoint
    randomPoint: IPoint
    realPoint: IPoint
}

export interface IModelIBsm {
    object: any
    rssi0: number
    r0: number
    outsideImei: number
    imei: number
}

export interface IModelStatistic {
    isValid: boolean
    observableImei: number
    calcPoint: IPoint
    randomPoint: IPoint
    realPoint: IPoint
}