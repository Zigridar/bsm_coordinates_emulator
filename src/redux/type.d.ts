type FabricState = {
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
    canvasDim?: [number, number]
    selection?: fabric.Object
}

type BSM = {
    object: fabric.Object
    setText: (text: string) => void
}

interface IObservable {
    object: fabric.Object
}