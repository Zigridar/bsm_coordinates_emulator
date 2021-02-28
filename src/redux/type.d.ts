type FabricState = {
    bsmList: fabric.Object[]
    currentCoords: [number, number]
}
type FabricObjectAction = {
    type: string
    object: fabric.Object
}