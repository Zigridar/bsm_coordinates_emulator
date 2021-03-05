type FabricState = {
    fantomPoint: fabric.Object
    observable: IObservable
    bsmList: BSM[]
    canvasDim: [number, number]
    hypotenuse: number
    selection: fabric.Object
}

type FabricObjectAction = {
    type: string
    observable?: IObservable
    object?: BSM
    removedObject?: fabric.Object
    canvasDim?: [number, number]
    selection?: fabric.Object
}

type BSM = {
    geoZone: number
    object: fabric.Object
    rssi: number
    setRssi: (rssi: number) => void
    getCoords: () => fabric.Point
}

interface IObservable {
    object: fabric.Object
}