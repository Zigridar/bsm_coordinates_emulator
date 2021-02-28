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

const setColor = (object: fabric.Object, color: string) => {
    const _object = object as fabric.Group
    _object.getObjects()[0].set('fill', color)
}

//todo make it better (full shit)
export const setColorByMaxRssi= (bsms: BSM[], take: number = 3) => {
    bsms.forEach((bsm: BSM) => setColor(bsm.object, '#ff6620'))

    const sortedArr = _.sortBy<BSM>(bsms, [(bsm: BSM) => bsm.rssi])
    _.takeRight<BSM>(sortedArr, take)
        .forEach((bsm: BSM) => {
            setColor(bsm.object,  '#44ff24')
        })
    return bsms
}