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
import {
    MAX_FRACTION,
    MAX_RANDOM_ODD,
    MAX_TRIANGLE_AREA,
    MIN_FRACTION,
    MIN_RANDOM_ODD,
    MIN_TRIANGLE_AREA
} from '../constants'
import LearningDialog from "./StartLearnDialog";

interface OwnProps {

}

interface StateProps {
    selection: fabric.Object
    observable: IObservable,
    randomOdd: number,
    minTriangleArea: number,
    fraction: number,
    isLearning: boolean
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
        randomOdd: state.randomOdd,
        isLearning: state.isLearning
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
                <CreateBSMDialog isLearning={props.isLearning} addBsmToCanvas={props.addBsmToCanvas}/>
                <Button
                    danger={true}
                    shape={'circle'}
                    onClick={() => props.removeSelected(props.selection)}
                    disabled={!props.selection || props.selection === props.observable.object || props.isLearning}
                    icon={<DeleteOutlined/>}
                    size={'large'}
                />
                <Slider
                    disabled={props.isLearning}
                    style={{width: '200px'}}
                    value={props.randomOdd}
                    onChange={props.setRandomOdd}
                    min={MIN_RANDOM_ODD}
                    max={MAX_RANDOM_ODD}
                />
                <Slider
                    disabled={props.isLearning}
                    style={{width: '200px'}}
                    value={props.fraction}
                    onChange={props.setFraction}
                    min={MIN_FRACTION}
                    max={MAX_FRACTION}
                    step={0.0001}
                />
                <Slider
                    disabled={props.isLearning}
                    style={{width: '200px'}}
                    value={props.minTriangleArea}
                    onChange={props.setMinTriangleArea}
                    min={MIN_TRIANGLE_AREA}
                    max={MAX_TRIANGLE_AREA}
                />
                <LearningDialog/>
            </Space>
        </Header>
    )
}

const CommandHeaderWithState = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(CommandHeader)

export default CommandHeaderWithState