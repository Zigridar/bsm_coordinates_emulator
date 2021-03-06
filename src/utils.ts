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

/** Координаты вектора на плоскости */
type Vector = [number, number]

/** Коэффициенты уравнения прямой */
type LineOdds = [number, number, number]

/** Вычисление вектора по двум точкам */
const directionVector: (point_1: Point, point_2: Point) => Vector = (point_1: fabric.Point, point_2: fabric.Point) => {
    return [point_2.x - point_1.x, point_2.y - point_1.y]
}

/** Вычисляет точку пресечения медиан треугольника */
const triangleCenter = (point_1: fabric.Point, point_2: fabric.Point, point_3: fabric.Point) => {
    return new fabric.Point((point_1.x + point_2.x + point_3.x) / 3, (point_1.y + point_2.y + point_3.y) / 3)
}

/** Вычисление коэффициентов прямой по направляющему вектору и точке этой прямой */
const lineEquationByPointAndVector: (point: Point, vector: Vector) => LineOdds = (point: fabric.Point, vector: Vector) => {
    const x0 = point.x
    const y0 = point.y

    const [ax, ay] = vector

    const a = ay
    const b = -ax
    const c = (ax * y0 - ay * x0)

    return [a, b, c]
}

/** Ближайшая точка к данной на прямой */
const nearestPointOnTheLine: (point: Point, line: LineOdds) => Point = (point: fabric.Point, line: LineOdds) => {
    const [a, b, c] = line

    const x0 = point.x
    const y0 = point.y

    const module = a ** 2 + b ** 2

    const x = (b * (b * x0 - a * y0) - a * c) / module
    const y = (a * (-b * x0 + a * y0) - b * c) / module

    return new fabric.Point(x, y)
}

/** Возвращает точку делящую точку в отношении fraction */
const pointByFraction: (point_1: Point, point_2: Point, fraction: number) => Point = (point_1: fabric.Point, point_2: fabric.Point, fraction: number) => {
    const x = (point_1.x + fraction * point_2.x) / (1 + fraction)
    const y = (point_1.y + fraction * point_2.y) / (1 + fraction)
    return new fabric.Point(x, y)
}

/** Вычисление площади треугольника по трем точкам */
const triangleArea: (point_1: Point, point_2: Point, point_3: Point) => number = (point_1: fabric.Point, point_2: fabric.Point, point_3: fabric.Point) => {
    const [x1, y1] = [point_1.x, point_1.y]
    const [x2, y2] = [point_2.x, point_2.y]
    const [x3, y3] = [point_3.x, point_3.y]

    const determinant = (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3)
    return Math.abs(determinant)
}

/** Тройка рандомных коэффициентов (по убыванию)  */
const sortedRandomOdds: (odd: number) => number[] = (odd: number) => {
    const sortedRandoms: number[] = _([Math.random(), Math.random(), Math.random()])
        .sort()
        .reverse()
        .map(rand => rand * odd)
        .value()
    return sortedRandoms
}

/** Точка по пересечению двух прямых */
const pointByIntersection: (line_1: LineOdds, line_2: LineOdds) => Point = (line_1: LineOdds, line_2: LineOdds) => {
    const [a1, b1, c1] = line_1
    const [a2, b2, c2] = line_2

    const determinant = (a1 * b2 - a2 * b1)

    const x = (c2 * b1 - c1 * b2) / determinant
    const y = (a2 * c1 - a1 * c2) / determinant
    return new fabric.Point(x, y)
}

const findPoint: (point_1: Point, point_2: Point, point_3: Point, l: Vector, k: Vector, m: Vector, odd: number, minTriangleArea: number, fraction: number) => (Point) = (
    point_1: fabric.Point,
    point_2: fabric.Point,
    point_3: fabric.Point,
    l: Vector,
    k: Vector,
    m: Vector,
    odd: number,
    minTriangleArea: number,
    fraction: number
) => {
    /** Площадь треугольника */
    const area = triangleArea(point_1, point_2, point_3)
    /** Если площадь треугольника меньше чем минимальна, то выходим из рекурсии */
    if (area < minTriangleArea) {
        const rand = Math.ceil(Math.random() * 10)
        return rand < 3 ? point_1 : rand > 6 ? point_3 : point_2
    }
    else {

        /** Уравнения прямых, образующих треугольник */
        const L = lineEquationByPointAndVector(point_1, l) /** Противолежащая точка с минимальным RSSI */
        const K = lineEquationByPointAndVector(point_2, k) /** Противолежащая точка с максимальным RSSI */
        const M = lineEquationByPointAndVector(point_3, m) /** Противолежащая точка со средним RSSI */

        /** Центр треугольника */
        const centerPoint = triangleCenter(point_1, point_2, point_3)

        /** Ближайшие точки от центра до стороны треугольника */
        const nL = nearestPointOnTheLine(centerPoint, L)
        const nK = nearestPointOnTheLine(centerPoint, K)
        const nM = nearestPointOnTheLine(centerPoint, M)

        /** Рандомные коэффициенты */
        const [k1, k2, k3] = sortedRandomOdds(odd)

        /** Точки на отрезке до центра в отношении */
        const fractionPointL = pointByFraction(nL, centerPoint, fraction * k3)
        const fractionPointK = pointByFraction(nK, centerPoint, fraction * k1)
        const fractionPointM = pointByFraction(nM, centerPoint, fraction * k2)

        const LL = lineEquationByPointAndVector(fractionPointL, l)
        const KK = lineEquationByPointAndVector(fractionPointK, k)
        const MM = lineEquationByPointAndVector(fractionPointM, m)

        /** Вершины нового треугольника */
        const point_1_1 = pointByIntersection(MM, LL)
        const point_2_2 = pointByIntersection(LL, KK)
        const point_3_3 = pointByIntersection(MM, KK)

        return findPoint(
            point_1_1,
            point_2_2,
            point_3_3,
            l,
            k,
            m,
            odd,
            minTriangleArea,
            fraction
        )
    }
}

/** Рандомный расчет координат */
export const calcFakePosition: (bsms: BSM[], odd: number, minTriangleArea: number, fraction: number) => fabric.Point = (
    bsms: BSM[],
    odd: number,
    minTriangleArea: number,
    fraction: number
) => {
    const [bsm_1, bsm_2, bsm_3] = bsms

    /** Точки каждой БСМ */
    const point_1 = bsm_1.getCoords()
    const point_2 = bsm_2.getCoords()
    const point_3 = bsm_3.getCoords()

    /** Направляющие векторы сторон образованного треугольника */
    const l = directionVector(point_2, point_3)
    const k = directionVector(point_1, point_3)
    const m = directionVector(point_1, point_2)

    const point = findPoint(
        point_1,
        point_2,
        point_3,
        l,
        k,
        m,
        odd,
        minTriangleArea,
        fraction
    )
    return point
}

export const setCoords = (object: fabric.Object, point: fabric.Point) => {
    const [x, y] = [point.x, point.y]
    object.left = x + object.width / 2
    object.top = y + object.height / 2
    object.bringToFront()
}

export const calcAndDrawFantom: (fantomObject: Object, bsms: BSM[], odd: number, minTriangleArea: number, fraction: number) => fabric.Point = (
    fantomObject: fabric.Object,
    bsms: BSM[],
    odd: number,
    minTriangleArea: number,
    fraction: number
) => {
    const maxBsms = setColorByMaxRssi(bsms)
    const point = calcFakePosition(
        maxBsms,
        odd,
        minTriangleArea,
        fraction
    )
    setCoords(fantomObject, point)
    return point
}

export const calcErrors: (data: [Point, Point][]) => [number, number, number] = (data: [[fabric.Point, fabric.Point]]) => {
    const [distanceErrorSum, xErrorSum, yErrorSum] = data
        .map((item: [fabric.Point, fabric.Point]) => {
            const [real, calculated] = item
            /** distance between real and calculated points */
            const distance = vectorModule(real, calculated)

            const errorSquareX = (real.x - calculated.x) ** 2
            const errorSquareY = (real.y - calculated.y) ** 2

            return [
                distance,
                errorSquareX,
                errorSquareY
            ]
        })
        .reduce((prev: [number, number, number], curr: [number, number, number]) => {
            const [distanceSum, errorSquareXSum, errorSquareYSum] = prev
            const [distance, errorSquareX, errorSquareY] = curr

            return [
                distanceSum + distance,
                errorSquareXSum + errorSquareX,
                errorSquareYSum + errorSquareY
            ]
        })

    return [
        distanceErrorSum / data.length,
        Math.sqrt(xErrorSum / data.length),
        Math.sqrt(yErrorSum / data.length)
    ]
}