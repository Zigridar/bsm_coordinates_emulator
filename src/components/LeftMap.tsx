import GeoZoneMapWithState from './GeoZoneMap'
import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {IEvent} from 'fabric/fabric-impl'
import {nonZeroCoords, vectorModule} from '../utils'
import {MAX_RSSI} from '../constants'
import {fabric} from 'fabric'
import {Dispatch} from 'redux'
import {changeSelectionAction, setObservableAction} from '../redux/actionCreators'
import store from '../redux/store'

interface OwnProps {
    cardPadding: number
}

interface StateProps {

}

interface DispatchProps {
    changeSelection: (object: fabric.Object) => void
    setObservable: (object: IObservable) => void
}

const mapStateToProps = (state: FabricState) => {
    const props: StateProps = {

    }
    return props
}

const mapDispatchToProps = (dispatch: Dispatch<FabricObjectAction>) => {
    const props: DispatchProps = {
        changeSelection: (object: fabric.Object) => {
            dispatch(changeSelectionAction(object))
        },
        setObservable: (object: IObservable) => {
            dispatch(setObservableAction(object))
        }
    }
    return props
}

type LeftMapProps = OwnProps & StateProps & DispatchProps

const LeftMap: React.FC<LeftMapProps>= (props: LeftMapProps) => {

    const canvasHandlers: Array<[string, (e: IEvent) => void]> = [
        [
            'selection:cleared',
            () => {
                props.changeSelection(null)
            }
        ],
        [
            'selection:updated',
            (e: IEvent & {selected: fabric.Object[]}) => {
                props.changeSelection(e.selected[0])
            }
        ],
        [
            'selection:created',
            (e: IEvent & {selected: fabric.Object[]}) => {
                props.changeSelection(e.selected[0])
            }
        ]
    ]

    const observableObject = new fabric.Circle({
        radius: 20,
        fill: '#3416ff',
        hasControls: false,
        selectable: true,
        hasBorders: false
    })

    observableObject.on('moving', (e: IEvent) => {
        store.getState().bsmList.forEach((bsm: BSM) => {
            const center = bsm.object.getCenterPoint()
            const module = vectorModule(center, nonZeroCoords(e.pointer))
            const hyp = store.getState().hypotenuse
            const calc = MAX_RSSI * (1 - module / hyp)
            const rssi = calc >= 0 ? calc : 0
            bsm.setRssi(rssi)
        })
    })

    const newObservable: IObservable = {
        object: observableObject
    }

    useEffect(() => {
        props.setObservable(newObservable)
    }, [])

    return(<GeoZoneMapWithState canvasHandlers={canvasHandlers} cardPadding={props.cardPadding}/>)
}

const LeftMapWithState = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(LeftMap)

export default LeftMapWithState