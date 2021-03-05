import {Header} from 'antd/es/layout/layout'
import React from 'react'
import {connect} from 'react-redux'
import {fabric} from 'fabric'
import {Button, Slider, Space} from 'antd'
import {Dispatch} from 'redux'
import {
    addObjectAction,
    changeSelectionAction,
    removeObjectAction,
    setFractionAction,
    setMinTriangleArea,
    setRandomOdd
} from '../redux/actionCreators'
import {DeleteOutlined} from '@ant-design/icons/lib'
import CreateBSMDialog from './CreateBSMDialog'

interface OwnProps {

}

interface StateProps {
    selection: fabric.Object
    observable: IObservable,
    randomOdd: number,
    minTriangleArea: number,
    fraction: number
}

interface DispatchProps {
    addBsmToCanvas: (bsm: BSM) => void
    removeSelected: (object: fabric.Object) => void
    setRandomOdd: (randomOdd: number) => void
    setMinTriangleArea: (minArea: number) => void
    setFraction: (fraction: number) => void
}

const mapStateToProps = (state: FabricState) => {
    const props: StateProps = {
        selection: state.selection,
        observable: state.observable,
        fraction: state.fraction,
        minTriangleArea: state.minTriangleArea,
        randomOdd: state.randomOdd
    }
    return props
}

const mapDispatchToProps = (dispatch: Dispatch<FabricObjectAction>) => {
    const props: DispatchProps = {
        addBsmToCanvas: (bsm: BSM) => {
            dispatch(addObjectAction(bsm))
        },
        removeSelected: (object: fabric.Object) => {
            dispatch(removeObjectAction(object))
            dispatch(changeSelectionAction(null))
        },
        setFraction: (fraction: number) => {
            dispatch(setFractionAction(fraction))
        },
        setRandomOdd: (randomOdd: number) => {
            dispatch(setRandomOdd(randomOdd))
        },
        setMinTriangleArea: (minArea: number) => {
            dispatch(setMinTriangleArea(minArea))
        }
    }
    return props
}

type CommandHeaderProps = OwnProps & StateProps & DispatchProps

const CommandHeader: React.FC<CommandHeaderProps> = (props: CommandHeaderProps) => {

    return(
        <Header>
            <Space size={'middle'}>
                <CreateBSMDialog addBsmToCanvas={props.addBsmToCanvas}/>
                <Button
                    danger={true}
                    shape={'circle'}
                    onClick={() => props.removeSelected(props.selection)}
                    disabled={!props.selection || props.selection === props.observable.object}
                    icon={<DeleteOutlined/>}
                    size={"large"}
                />
                <Slider
                    style={{width: '200px'}}
                    value={props.randomOdd}
                    onChange={props.setRandomOdd}
                    min={10}
                    max={10000}
                />
                <Slider
                    style={{width: '200px'}}
                    value={props.fraction}
                    onChange={props.setFraction}
                    min={0.0001}
                    max={0.01}
                    step={0.0001}
                />
                <Slider
                    style={{width: '200px'}}
                    value={props.minTriangleArea}
                    onChange={props.setMinTriangleArea}
                    min={1}
                    max={10000}
                />
            </Space>
        </Header>
    )
}

const CommandHeaderWithState = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(CommandHeader)

export default CommandHeaderWithState