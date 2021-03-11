import {fabric} from 'fabric'
import {IEvent} from 'fabric/fabric-impl'
import {bsmStorage, observableStorage, randomOddStorage, STATIST_POINT_COUNT} from './constants'
import {calcAndDrawFantom, calcErrors, getFromStorage, setFakeRssi} from './utils'
import store from "./redux/store"

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
        hasControls: false,
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
                store.getState().lps.bsmList,
                e.pointer
            )

            //todo сделать хорошо
            if (store.getState().lps.bsmList.length > 0) {
                const calculatedPoint = calcAndDrawFantom(
                    store.getState().test.testObservable.fakePoint,
                    store.getState().lps.bsmList,
                    store.getState().random.randomOdd,
                    store.getState().random.minArea,
                    store.getState().random.fraction
                )
                const pointArr = store.getState().statistic.statisticPoints
                if (pointArr.length < STATIST_POINT_COUNT)
                    pointArr.push([e.pointer, calculatedPoint])
                else {
                    store.getState().statistic.errors = calcErrors(pointArr)
                    store.getState().statistic.statisticPoints = []
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
        fakePoint: initFantomPoint(fakePointColor, imei, 'circle'),
        calculatedPoint: initFantomPoint(calcPointColor, imei, 'square'),
        movableObject: null
    }

    return observable
}

/** Восстановление fabric объектов из  строки */
export const parseFabricObjectFromString: (stringObject: any) => Promise<fabric.Object> = (stringObject: any) => {
    return new Promise<fabric.Object>((resolve, reject) => {
        try {
            fabric.util.enlivenObjects([stringObject], (fabricObjects: fabric.Object[]) => {
                resolve(fabricObjects[0])
            }, 'fabric')
        }
        catch (e) {
            reject(e)
        }
    })
}

/** Сериализация (stringify) IObservable */
export const serializeObservable: (obs: IObservable) => string = (obs: IObservable) => {
    const serializedObservable: SerializedObservable = {
        imei: obs.imei,
        calculatedPoint: obs.calculatedPoint.toJSON(),
        fakePoint: obs.fakePoint.toJSON()
    }
    return JSON.stringify(serializedObservable)
}

/** Сериализация (stringify) BSM */
export const serializeBSM: (bsm: BSM) => string = (bsm: BSM) => {
    const serializedBSM: SerializedBSM = {
        imei: bsm.imei,
        outsideImei: bsm.outsideImei,
        rssi0: bsm.rssi0,
        r0: bsm.r0,
        object: bsm.object.toJSON()
    }
    return JSON.stringify(serializedBSM)
}

export const deserializeObservable: (observableStr: string) => Promise<IObservable> = async (observableStr: string) => {
    const serializedObservable = JSON.parse(observableStr) as SerializedObservable

    const fakePoint = await parseFabricObjectFromString(serializedObservable.fakePoint)
    const calculatedPoint = await parseFabricObjectFromString(serializedObservable.calculatedPoint)
    fakePoint.set({ selectable: false, evented: false })
    calculatedPoint.set({ selectable: false, evented: false })

    const observable: IObservable = {
        imei: serializedObservable.imei,
        fakePoint,
        calculatedPoint,
        movableObject: null
    }

    return observable
}

export const deserializeBSM = async (bsmStr: string) => {
    const serializedBSM = JSON.parse(bsmStr) as SerializedBSM

    const group = await parseFabricObjectFromString(serializedBSM.object) as fabric.Group

    const [, coordsTextObject, titleTextObject] = group.getObjects()

    group.on('moving', () => {
        const point = group.getCenterPoint();
        const [x, y] = [point.x / 100, point.y / 100]
        titleTextObject.set({ opacity: 0.1 });
        (coordsTextObject as fabric.Text).set({text: `${x.toFixed(2)}, ${y.toFixed(2)}`, opacity: 1})
    })

    group.on('moved', () => {
        titleTextObject.set({ opacity: 1 })
        coordsTextObject.set({ opacity: 0.2 })
    })

    group.set({ hasControls: false })

    const bsm: BSM = {
        imei: serializedBSM.imei,
        outsideImei: serializedBSM.outsideImei,
        r0: serializedBSM.r0,
        rssi0: serializedBSM.rssi0,
        object: group,
        _staticCoords: { x: 0, y: 0 },
        rssi: 0,
        setSelectable(selectable: boolean) {
            group.set({ selectable })
        },
        get staticCoords() {
            this._staticCoords = group.getCenterPoint()
            return this._staticCoords
        }
    }

    return bsm
}

/** Возвращает промис с BSM[] (десериализованными из локального хранилища)  */
export const getBSMsFromStorage: () => Promise<BSM[]> = async () => {
    const storageValue = JSON.parse(getFromStorage(bsmStorage)) as string[]

    /** Если значение еще не задано вернуть пустой массив */
    if (!storageValue) return []

    const bsmPromises: Promise<BSM>[] = storageValue.map(bsmStr => deserializeBSM(bsmStr))
    return await Promise.all(bsmPromises)
}

/** Возвращает проим с IObservable[] (десериализованными из локального хранилища) */
export const getObservablesFromStorage: () => Promise<IObservable[]> = async () => {
    const storageValue = JSON.parse(getFromStorage(observableStorage)) as string[]

    /** Если значение еще не задано вернуть пустой массив */
    if (!storageValue) return []

    const observablePromises: Promise<IObservable>[] = storageValue.map(observableStr => deserializeObservable(observableStr))
    return await Promise.all(observablePromises)
}

/** Возвращает сохраненные коэффициенты */
export const getRandomOddsFromStorage: () => RandomOddStorage = () => JSON.parse(getFromStorage(randomOddStorage)) as RandomOddStorage