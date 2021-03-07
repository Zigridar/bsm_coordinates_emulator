import * as _ from 'lodash'
import {
    MAX_FRACTION,
    MAX_RANDOM_ODD,
    MAX_TRIANGLE_AREA,
    MIN_FRACTION,
    MIN_RANDOM_ODD,
    MIN_TRIANGLE_AREA
} from './constants'

export const vectorModule = (point1: IPoint, point2: IPoint) => {
    const dx = point1.x - point2.x
    const dy = point1.y - point2.y

    return calcHypotenuse(dx, dy)
}

export const calcHypotenuse = (width: number, height: number) => {
    return Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
}

export const nonZeroCoords = (point: IPoint) => {
    const x = point.x >= 0 ? point.x : 0
    const y = point.y >= 0 ? point.y : 0
    const absPoint: IPoint = { x, y }
    return absPoint
}

const setStrokeWidth = (object: fabric.Object, width: number) => {
    const _object = object as fabric.Group
    _object.getObjects()[0].set('strokeWidth', width)
}

export const collectMaxRssi = <T extends IBSM>(bsms: T[]) => {
    const maxBsms: T[] = _(bsms)
        .sortBy((bsm: T) => bsm.rssi)
        .takeRight(3)
        .reverse()
        .value()

    return maxBsms
}

export const setColorByMaxRssi: (bsms: BSM[], maxBsms: BSM[]) => void = (bsms: BSM[], maxBsms: BSM[]) => {
    bsms.forEach((bsm: BSM) => setStrokeWidth(bsm.object, 0))
    maxBsms.forEach((bsm: BSM) => {
        setStrokeWidth(bsm.object, 3)
    })
}

/** Координаты вектора на плоскости */
type Vector = [number, number]

/** Коэффициенты уравнения прямой */
type LineOdds = [number, number, number]

/** Вычисление вектора по двум точкам */
const directionVector: (point_1: IPoint, point_2: IPoint) => Vector = (point_1: IPoint, point_2: IPoint) => {
    return [point_2.x - point_1.x, point_2.y - point_1.y]
}

/** Вычисляет точку пресечения медиан треугольника */
const triangleCenter: (point_1: IPoint, point_2: IPoint, point_3: IPoint) => IPoint = (point_1: IPoint, point_2: IPoint, point_3: IPoint) => {
   return {
        x: (point_1.x + point_2.x + point_3.x) / 3,
        y: (point_1.y + point_2.y + point_3.y) / 3
    }
}

/** Вычисление коэффициентов прямой по направляющему вектору и точке этой прямой */
const lineEquationByPointAndVector: (point: IPoint, vector: Vector) => LineOdds = (point: IPoint, vector: Vector) => {
    const x0 = point.x
    const y0 = point.y

    const [ax, ay] = vector

    const a = ay
    const b = -ax
    const c = (ax * y0 - ay * x0)

    return [a, b, c]
}

/** Ближайшая точка к данной на прямой */
const nearestPointOnTheLine: (point: IPoint, line: LineOdds) => IPoint = (point: IPoint, line: LineOdds) => {
    const [a, b, c] = line

    const x0 = point.x
    const y0 = point.y

    const module = a ** 2 + b ** 2

    const x = (b * (b * x0 - a * y0) - a * c) / module
    const y = (a * (-b * x0 + a * y0) - b * c) / module

    return { x, y }
}

/** Возвращает точку делящую точку в отношении fraction */
const pointByFraction: (point_1: IPoint, point_2: IPoint, fraction: number) => IPoint = (point_1: IPoint, point_2: IPoint, fraction: number) => {
    const x = (point_1.x + fraction * point_2.x) / (1 + fraction)
    const y = (point_1.y + fraction * point_2.y) / (1 + fraction)
    return { x, y }
}

/** Вычисление площади треугольника по трем точкам */
const triangleArea: (point_1: IPoint, point_2: IPoint, point_3: IPoint) => number = (point_1: IPoint, point_2: IPoint, point_3:IPoint) => {
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
const pointByIntersection: (line_1: LineOdds, line_2: LineOdds) => IPoint = (line_1: LineOdds, line_2: LineOdds) => {
    const [a1, b1, c1] = line_1
    const [a2, b2, c2] = line_2

    const determinant = (a1 * b2 - a2 * b1)

    const x = (c2 * b1 - c1 * b2) / determinant
    const y = (a2 * c1 - a1 * c2) / determinant
    return { x, y }
}

const triplePointCase: (point_1: IPoint, point_2: IPoint, point_3: IPoint, l: Vector, k: Vector, m: Vector, odd: number, minTriangleArea: number, fraction: number) => (IPoint) = (
    point_1: IPoint,
    point_2: IPoint,
    point_3: IPoint,
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

        return triplePointCase(
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

const doublePointCase = (point_1: IPoint, point_2: IPoint) => {
    return pointByFraction(pointByFraction(point_1, point_2, 1), point_1, diapasonRandom(0.1, 4))
}

const singlePointCase = (point: IPoint) => {
    return point //todo calculate by geoZone
}

/** Рандомный расчет координат */
export const calcFakePosition: (bsms: IBSM[], odd: number, minTriangleArea: number, fraction: number) => IPoint = (
    bsms: IBSM[],
    odd: number,
    minTriangleArea: number,
    fraction: number
) => {

    switch (bsms.length) {
        /** Для случая трех БСМ */
        case 3:
            const [bsm_1_3, bsm_2_3, bsm_3_3] = bsms

            /** Точки каждой БСМ */
            const point_1: IPoint = bsm_1_3.staticCoords
            const point_2: IPoint = bsm_2_3.staticCoords
            const point_3: IPoint = bsm_3_3.staticCoords

            /** Направляющие векторы сторон образованного треугольника */
            const l = directionVector(point_2, point_3)
            const k = directionVector(point_1, point_3)
            const m = directionVector(point_1, point_2)

            return triplePointCase(
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
        case 2:
            const [bsm_1_2, bsm_2_2] = bsms
            return doublePointCase(bsm_1_2.staticCoords, bsm_2_2.staticCoords)
        case 1:
            const [bsm_1_1] = bsms
            return singlePointCase(bsm_1_1.staticCoords)
    }
}

export const setCoords = (object: fabric.Object, point: IPoint) => {
    const [x, y] = [point.x, point.y]
    object.left = x + object.width / 2
    object.top = y + object.height / 2
    object.bringToFront()
}

export const calcAndDrawFantom: (fantomObject: Object, bsms: BSM[], odd: number, minTriangleArea: number, fraction: number) => IPoint = (
    fantomObject: fabric.Object,
    bsms: BSM[],
    odd: number,
    minTriangleArea: number,
    fraction: number
) => {
    const maxBsms = collectMaxRssi(bsms)
    setColorByMaxRssi(bsms, maxBsms)
    const point = calcFakePosition(
        maxBsms,
        odd,
        minTriangleArea,
        fraction
    )
    setCoords(fantomObject, point)
    return point
}

export const calcErrors: (data: [IPoint, IPoint][]) => [number, number, number] = (data: [[IPoint, IPoint]]) => {
    const calculatetByEach  = data
        .map((item: [IPoint, IPoint]) => {
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

    const [distanceErrorSum, xErrorSum, yErrorSum] = calculatetByEach.length > 0? calculatetByEach.reduce((prev: [number, number, number], curr: [number, number, number]) => {
            const [distanceSum, errorSquareXSum, errorSquareYSum] = prev
            const [distance, errorSquareX, errorSquareY] = curr

            return [
                distanceSum + distance,
                errorSquareXSum + errorSquareX,
                errorSquareYSum + errorSquareY
            ]
        }) : [Infinity, Infinity, Infinity]

    return [
        distanceErrorSum / data.length,
        Math.sqrt(xErrorSum / data.length),
        Math.sqrt(yErrorSum / data.length)
    ]
}

/** рандом в диапазоне */
export const diapasonRandom = (min: number, max: number) => {
    const rand = min - 0.5 + Math.random() * (max - min + 1)
    return Math.round(rand)
}

export const setBsmRssi = (
    bsms: IBSM[],
    currentPoint: IPoint,
    hypotenuse: number
) => {
    bsms.forEach((bsm: IBSM) => {
        const bsmPoint: IPoint = bsm.staticCoords
        const module = vectorModule(bsmPoint, nonZeroCoords(currentPoint))
        const hyp = hypotenuse
        const relation = module > hyp ? 0 : (module / hyp)
        bsm.rssi = -relation * 50 - 50
    })
}

/** Вычисления прогресса обучения */
const calcProgress: (steps: LearnSteps, step: number) => [number, number, number] = (steps: LearnSteps, step: number) => {
    const fractionIters = Math.ceil((MAX_FRACTION - MIN_FRACTION) / steps.fractionStep)
    const randomOddIters = Math.ceil((MAX_RANDOM_ODD - MIN_RANDOM_ODD) / steps.randomOddStep)
    const areaIters = Math.ceil((MAX_TRIANGLE_AREA - MIN_TRIANGLE_AREA) / steps.triangleAreaStep)
    const all = (fractionIters * randomOddIters * areaIters * steps.learnPointCount)
   return [step / all, step, all]
}

/** Поиск оптимальных коэффициентов для случайных величин (для каждого расположения БСМ свои коэффициенты!!!) */
export const learn: (
    bsms: IBSM[],
    width: number,
    height: number,
    hypotenuse: number,
    learnSteps: LearnSteps,
    progressCallback: (progress: [number, number, number]) => void
) => [number, number, number] = (
    bsms: IBSM[],
    width: number,
    height: number,
    hypotenuse: number,
    learnSteps: LearnSteps,
    progressCallback: (progress: [number, number, number]) => void
) => {
    console.log('start learning')

    console.time('learn')

    /** Счетчик итерация для расчета прогресса */
    let iterCounter: number = 0

    /** Хранит результат ошибке в качестве ключа и параметры в значении */
    const resultMap: Map<number, [number, number, number]> = new Map<number, [number, number, number]>()

    /** Итерация по отношениям сдвига к центру */
    for (let fraction: number = MIN_FRACTION; fraction < MAX_FRACTION; fraction += learnSteps.fractionStep) {
        /** Итерция по коэффициентам рандома */
        for (let randomOdd: number = MIN_RANDOM_ODD; randomOdd < MAX_RANDOM_ODD; randomOdd += learnSteps.randomOddStep) {
            /** Итерация по площади треугольника */
            for (let triangleArea: number = MIN_TRIANGLE_AREA; triangleArea < MAX_TRIANGLE_AREA; triangleArea += learnSteps.triangleAreaStep) {

                /** Хранит результаты расчетов */
                const points: [IPoint, IPoint][] = []

                for (let i: number = 0; i < learnSteps.learnPointCount; i++) {
                    /** Создание координат точки */
                    const realX = diapasonRandom(0, height)
                    const realY = diapasonRandom(0, width)
                    const realPoint: IPoint = { x: realX, y: realY }
                    /** Установка RSSI в зависимости от realPoint*/
                    setBsmRssi(
                        bsms,
                        realPoint,
                        hypotenuse
                    )

                    /** 3 БСМ с максимальным RSSI */
                    const maxBsms = collectMaxRssi(bsms)
                    /** Вычисленная точка */
                    const point = calcFakePosition(
                        maxBsms,
                        randomOdd,
                        triangleArea,
                        fraction
                    )
                    /** Сохранить результат */
                    points.push([realPoint, point])

                    iterCounter++

                    progressCallback(calcProgress(learnSteps, iterCounter))
                }

                const [moduleError] = calcErrors(points)

                resultMap.set(moduleError, [fraction, randomOdd, triangleArea])
            }
        }
    }

    const arr: number[] = Array.from(resultMap.keys())

    const min: number = _.min(arr)

    const [fraction, randomOdd, triangleArea] = resultMap.get(min)

    console.log('learning is done')

    console.timeEnd('learn')

    return [fraction, randomOdd, triangleArea]
}

/** Упростить БСМ */
export const simplifyBSM: (bsms: BSM[]) => IBSM[] = (bsms: BSM[]) => {
    return bsms.map((bsm: BSM) => {
        const simpleBSM: IBSM = {
            rssi: bsm.rssi,
            _rssi: bsm._rssi,
            staticCoords: bsm.staticCoords,
            _staticCoords: bsm._staticCoords,
            geoZone: bsm.geoZone
        }
        return simpleBSM
    })
}