import {Point} from 'fabric/fabric-impl'
import {fabric} from 'fabric'
import * as _ from 'lodash'

export const vectorModule = (point1: Point, point2: Point) => {
    const dx = point1.x - point2.x
    const dy = point1.y - point2.y

    return calcHypotenuse(dx, dy)
}

export const calcHypotenuse = (width: number, height: number) => {
    return Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
}

export const nonZeroCoords = (point: Point) => {
    const x = point.x >= 0 ? point.x : 0
    const y = point.y >= 0 ? point.y : 0
    return new fabric.Point(x, y)
}

const setStrokeWidth = (object: fabric.Object, width: number) => {
    const _object = object as fabric.Group
    _object.getObjects()[0].set('strokeWidth', width)
}

export const setColorByMaxRssi: (bsms: BSM[]) => BSM[] = (bsms: BSM[]) => {
    bsms.forEach((bsm: BSM) => setStrokeWidth(bsm.object, 0))

    const result: BSM[] = []

    _(bsms)
        .sortBy([(bsm: BSM) => bsm.rssi])
        .takeRight(3)
        .reverse()
        .forEach((bsm: BSM) => {
            setStrokeWidth(bsm.object, 3)
            result.push(bsm)
        })

    return result
}

//todo
const RSSI0 = -50

export const tripleCasePoint: (bsms: BSM[]) => [number, number] = (bsms: BSM[]) => {
    const [bsm1, bsm2, bsm3] = bsms
    const point1 = bsm1.object.getCenterPoint()
    const point2 = bsm2.object.getCenterPoint()
    const point3 = bsm3.object.getCenterPoint()

    const r1 = 10 ** ((RSSI0 - bsm1.rssi) / 20)
    const r2 = 10 ** ((RSSI0 - bsm2.rssi) / 20)
    const r3 = 10 ** ((RSSI0 - bsm3.rssi) / 20)

    const M1 = (point2.x - point1.x)
    const M2 = (point3.x - point1.x)

    const N1 = (point2.y - point1.y)
    const N2 = (point3.y - point1.y)

    const L1 = 0.5 * (r1 ** 2 - r2 ** 2 - point1.x ** 2 - point1.y ** 2 + point2.x ** 2 + point2.y ** 2)
    const L2 = 0.5 * (r1 ** 2 - r3 ** 2 - point1.x ** 2 - point1.y ** 2 + point3.x ** 2 + point3.y ** 2)

    const dD = M1 * N2 - M2 * N1

    const x = (L1 * N2 - L2 * N1) / dD
    const y = (M1 * L2 - M2 * L1) / dD

    return [x, y]
}

//todo
export const doubleCasePoint: (bsms: BSM[]) => [number, number] = (bsms: BSM[]) => {
    return [10, 10]
}

//todo
export const singleCasePoint: (bsms: BSM[]) => [number, number] = (bsms: BSM[]) => {
    return [10, 10]
}

export const calcFantomPosition: (bsms: BSM[]) => ([number, number]) = (bsms: BSM[]) => {
    switch (bsms.length) {
        case 1:
            return singleCasePoint(bsms)
        case 2:
            return doubleCasePoint(bsms)
        case 3:
            return tripleCasePoint(bsms)
        default:
            throw new Error('BSMs is empty')
    }
}

export const setCoords = (object: fabric.Object, coords: [number, number]) => {
    const [x, y] = coords
    object.left = x + object.width / 2
    object.top = y + object.height / 2
    object.bringToFront()
}

export const calcAndDrawFantom = (fantomObject: fabric.Object, bsms: BSM[]) => {
    const maxBsms = setColorByMaxRssi(bsms)
    const coords = calcFantomPosition(maxBsms)
    setCoords(fantomObject, coords)
}