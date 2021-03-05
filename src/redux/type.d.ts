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
}

type FabricObjectAction = {
    type: string
    observable?: IObservable
    object?: BSM
    removedObject?: fabric.Object
    canvasDim?: [number, number]
    selection?: fabric.Object,
    numberValue?: number
}

type BSM = {
    geoZone: number
    object: IDeletableFabric
    rssi: number
    setRssi: (rssi: number) => void
    getCoords: () => fabric.Point
}

interface IObservable {
    object: fabric.Object
}

type IDeletableFabric = fabric.Object & {
    forDelete?: boolean
}