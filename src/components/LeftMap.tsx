import GeoZoneMapWithState from './GeoZoneMap'
import React from 'react'
import {connect} from 'react-redux'
import {IEvent} from 'fabric/fabric-impl'
import {hypotenuse, nonZeroCoords, vectorModule} from '../utils'
import {MAX_RSSI} from '../constants'
import {fabric} from 'fabric'
import {Dispatch} from 'redux'
import {changeSelectionAction} from '../redux/actionCreators'

interface OwnProps {
    cardPadding: number
}

interface StateProps {
    bsmList: BSM[]
    canvasDim: [number, number]
}

interface DispatchProps {
    changeSelection: (object: fabric.Object) => void
}

const mapStateToProps = (state: FabricState) => {
    const props: StateProps = {
        bsmList: state.bsmList,
        canvasDim: state.canvasDim
    }
    return props
}

const mapDispatchToProps = (dispatch: Dispatch<FabricObjectAction>) => {
    const props: DispatchProps = {
        changeSelection: (object: fabric.Object) => {
            dispatch(changeSelectionAction(object))
        }
    }
    return props
}

type LeftMapProps = OwnProps & StateProps & DispatchProps

//todo make it better
let globalBsmList: BSM[] = []
let globalCanvasDim: [number, number] = [0, 0]

const LeftMap: React.FC<LeftMapProps>= (props: LeftMapProps) => {

    //todo make it better
    globalBsmList = props.bsmList
    globalCanvasDim = props.canvasDim

    console.log(`render LeftMap, globalBsmList: ${globalBsmList.length}`)

    const canvasHandlers: Array<[string, (e: IEvent) => void]> = [
        [
            'mouse:move',
            (e: IEvent) => {
                globalBsmList.forEach((bsm: BSM) => {
                    const center = bsm.object.getCenterPoint()
                    const module = vectorModule(center, nonZeroCoords(e.pointer))
                    const hyp = hypotenuse(...globalCanvasDim)

                    const calc = MAX_RSSI * (1 - module / hyp)
                    const rssi = calc >= 0 ? calc : 0
                    bsm.setText(`${rssi.toFixed(2)}`)
                })
            }
        ],
        [
            'selection:cleared',
            (e: IEvent) => {
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

    return(<GeoZoneMapWithState bsmList={globalBsmList} canvasHandlers={canvasHandlers} cardPadding={props.cardPadding}/>)
}

const LeftMapWithState = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(LeftMap)

export default LeftMapWithState