type FabricState = {
    bsmList: BSM[]
    canvasDim: [number, number]
    selection: fabric.Object
}

type FabricObjectAction = {
    type: string
    object?: BSM
    canvasDim?: [number, number]
    selection?: fabric.Object
}

type BSM = {
    object: fabric.Object
    setText: (text: string) => void
}