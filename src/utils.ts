import {Point} from "fabric/fabric-impl";
import {fabric} from "fabric";

export const vectorModule = (point1: Point, point2: Point) => {
    const dx = point1.x - point2.x
    const dy = point1.y - point2.y

    return hypotenuse(dx, dy)
}

export const hypotenuse = (width: number, height: number) => {
    return Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
}

export const nonZeroCoords = (point: Point) => {
    const x = point.x >= 0 ? point.x : 0
    const y = point.y >= 0 ? point.y : 0
    return new fabric.Point(x, y)
}