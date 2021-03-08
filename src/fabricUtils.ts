import {fabric} from "fabric";
import {IEvent} from "fabric/fabric-impl";
import store from "./redux/store";
import {STATIST_POINT_COUNT} from "./constants";
import {calcAndDrawFantom, calcErrors, setBsmRssi} from "./utils";

const initFantomPoint: (color: string, imei: number) => fabric.Object = (color: string, imei: number) => {
    const pseudoPoint = new fabric.Circle({
        radius: 10,
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
        evented: false
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

            setBsmRssi(
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
        fakePoint: initFantomPoint('#ff00d5', -1),
        calculatedPoint: null,
        imei: imei
    }

    return observable
}

export const createObservable = (imei: number, fakePointColor: string, calcPointColor: string) => {
    const observable: IObservable = {
        imei,
        fakePoint: initFantomPoint(fakePointColor, imei),
        calculatedPoint: initFantomPoint(calcPointColor, imei),
        movableObject: null
    }

    return observable
}