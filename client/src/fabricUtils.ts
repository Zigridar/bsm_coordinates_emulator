import {fabric} from 'fabric'
import {IEvent} from 'fabric/fabric-impl'
import {randomOddStorage, STATIST_POINT_COUNT} from './constants'
import {calcAndDrawFantom, calcErrors, getFromStorage, setFakeRssi} from './utils'
import store from './redux/store'
import {
    BSM,
    IModelIBsm, IModelObservable,
    IModelStatistic,
    IObservable,
    RandomOddStorage,
    StatisticRow
} from '../../src/commod_types/type';

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

    return new fabric.Group([pseudoPoint, imeiText], {
        selectable: false,
        hasControls: false,
        evented: false,
        left: 300,
        top: 300
    })
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

/** Восстановление fabric объектов из сериализованного JSON fabric */
export const parseFabricObjectFromSerialized: (stringObject: any) => Promise<fabric.Object> = (serializedFabricObject: any) => {
    return new Promise<fabric.Object>((resolve, reject) => {
        try {
            fabric.util.enlivenObjects([serializedFabricObject], (fabricObjects: fabric.Object[]) => {
                resolve(fabricObjects[0])
            }, 'fabric')
        }
        catch (e) {
            reject(e)
        }
    })
}

/** Сериализация (stringify) IObservable */
export const serializeObservable: (obs: IObservable) => IModelObservable = (obs: IObservable) => {
    const serializedObservable: IModelObservable = {
        imei: obs.imei,
        calculatedPoint: obs.calculatedPoint.toJSON(),
        fakePoint: obs.fakePoint.toJSON()
    }
    return serializedObservable
}

/** Сериализация BSM */
export const serializeBSM: (bsm: BSM) => IModelIBsm = (bsm: BSM) => {
    const serializedBSM: IModelIBsm = {
        imei: bsm.imei,
        outsideImei: bsm.outsideImei,
        rssi0: bsm.rssi0,
        r0: bsm.r0,
        object: bsm.object.toJSON()
    }
    return serializedBSM
}

/** Сериализация StatisticRow */
export const serializeStatistic: (statistic: StatisticRow) => IModelStatistic = (statistic: StatisticRow) => (statistic as IModelStatistic)

export const deserializeObservable: (observable: IModelObservable) => Promise<IObservable> = async (observable: IModelObservable) => {

    const fakePoint = await parseFabricObjectFromSerialized(observable.fakePoint)
    const calculatedPoint = await parseFabricObjectFromSerialized(observable.calculatedPoint)
    fakePoint.set({ selectable: false, evented: false })
    calculatedPoint.set({ selectable: false, evented: false })

    const obs: IObservable = {
        imei: observable.imei,
        fakePoint,
        calculatedPoint,
        movableObject: null
    }
    return obs
}

export const deserializeBSM: (serializedBSM: IModelIBsm) => Promise<BSM> = async (serializedBSM: IModelIBsm) => {

    const group = await parseFabricObjectFromSerialized(serializedBSM.object) as fabric.Group

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

export const deserializeStatistic: (statistic: IModelStatistic) => Promise<StatisticRow> = async (statistic: IModelStatistic) => {
    return statistic as StatisticRow
}

const parse = <S, D>(deserialize: (s: S) => Promise<D>) => async (collection: S[]) => {
    const deserializedCollection = collection.map(deserialize)
    return await Promise.all(deserializedCollection)
}

/** Возвращает промис с BSM[] */
export const parseBsms: (collection: IModelIBsm[]) => Promise<BSM[]> = parse(deserializeBSM)

/** Возвращает проим с IObservable[] */
export const parseObservable: (collection: IModelObservable[]) => Promise<IObservable[]> = parse(deserializeObservable)

/** Возвращает промис с StatisicRow[] */
export const parseStatistic: (collection: IModelStatistic[]) => Promise<StatisticRow[]> = parse(deserializeStatistic)

/** Возвращает сохраненные коэффициенты */
export const getRandomOddsFromStorage: () => RandomOddStorage = () => JSON.parse(getFromStorage(randomOddStorage)) as RandomOddStorage