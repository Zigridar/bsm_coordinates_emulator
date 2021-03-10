import {fabric} from "fabric";
import {IEvent} from "fabric/fabric-impl";
import store from "./redux/store";
import {STATIST_POINT_COUNT} from "./constants";
import {calcAndDrawFantom, calcErrors, setFakeRssi} from "./utils";

type FantomShape = 'circle' | 'square'

const initFantomPoint: (color: string, imei: number, shape: FantomShape) => fabric.Object = (color: string, imei: number, shape: FantomShape = 'circle') => {
    const pseudoPoint = shape === 'circle' ?
    new fabric.Circle({
        radius: 10,
        fill: color,
        originY: 'center',
        originX: 'center'
    }) :
    new fabric.Rect({
        width: 20,
        height: 20,
        fill: color,
        originY: 'center',
        originX: 'center'
    })

    const imeiText = new fabric.Text(`${imei}`, {
        fontSize: 15,
        originY: 'center',
        originX: 'center'
    })

    const group = new fabric.Group([pseudoPoint, imeiText], {
        selectable: false,
        evented: false,
        left: 300,
        top: 300
    })

    return group
}

export const initTestObservable = (imei: number) => {

    const observableObject = new fabric.Circle({
            radius: 20,
            fill: '#3416ff',
            hasControls: false,
            selectable: true,
            hasBorders: false
        })

        observableObject.on('moving', (e: IEvent) => {

            setFakeRssi(
                store.getState().bsmList,
                e.pointer
            )

            if (store.getState().bsmList.length > 0) {
                const calculatedPoint = calcAndDrawFantom(
                    store.getState().testObservable.fakePoint,
                    store.getState().bsmList,
                    store.getState().randomOdd,
                    store.getState().minTriangleArea,
                    store.getState().fraction
                )
                const pointArr = store.getState().statisticPoints
                if (pointArr.length < STATIST_POINT_COUNT)
                    pointArr.push([e.pointer, calculatedPoint])
                else {
                    store.getState().errors = calcErrors(pointArr)
                    store.getState().statisticPoints = []
                }
            }
            else
                console.log('Нет БСМ')
        })

    const observable: IObservable = {
        movableObject: observableObject,
        fakePoint: initFantomPoint('#ff00d5', -1, "circle"),
        calculatedPoint: null,
        imei: imei
    }

    return observable
}

export const createObservable = (imei: number, fakePointColor: string, calcPointColor: string) => {
    const observable: IObservable = {
        imei,
        fakePoint: initFantomPoint(fakePointColor, imei, "circle"),
        calculatedPoint: initFantomPoint(calcPointColor, imei, "square"),
        movableObject: null
    }

    return observable
}