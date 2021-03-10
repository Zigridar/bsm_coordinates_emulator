import {Header} from 'antd/es/layout/layout'
import React from 'react'
import {connect} from 'react-redux'
import {fabric} from 'fabric'
import {Button, Slider, Space, Statistic, Switch, Tooltip} from 'antd'
import {Dispatch} from 'redux'
import {
    addObjectAction,
    changeSelectionAction,
    removeObjectAction,
    setFractionAction,
    setMinTriangleArea,
    setRandomOdd, toggleModeAction
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
import LoadJSONDataDialog from "./LoadJSONDataDialog";
import CreateObservableDialog from "./CreateObservableDialog";
import StatisticDialog from "./StatisticDialog";

interface OwnProps {

}

interface StateProps {
    selection: fabric.Object
    testObservable: IObservable
    randomOdd: number
    minTriangleArea: number
    fraction: number
    isLearning: boolean
    errors: [number, number, number]
    bsmList: BSM[]
    isTest: boolean
}

interface DispatchProps {
    addBsmToCanvas: (bsm: BSM) => void
    removeSelected: (object: fabric.Object) => void
    setRandomOdd: (randomOdd: number) => void
    setMinTriangleArea: (minArea: number) => void
    setFraction: (fraction: number) => void
    toggleMode: (isTest: boolean) => void
}

const mapStateToProps = (state: FabricState) => {
    const props: StateProps = {
        selection: state.selection,
        testObservable: state.testObservable,
        fraction: state.fraction,
        minTriangleArea: state.minTriangleArea,
        randomOdd: state.randomOdd,
        isLearning: state.isLearning,
        errors: state.errors,
        bsmList: state.bsmList,
        isTest: state.isTest
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
        },
        toggleMode: (isTest: boolean) => {
            dispatch(toggleModeAction(isTest))
        }
    }
    return props
}

type CommandHeaderProps = OwnProps & StateProps & DispatchProps

const CommandHeader: React.FC<CommandHeaderProps> = (props: CommandHeaderProps) => {

    const [dModule, dx, dy] = props.errors.map(error => error / 100)

    return(
        <Header>
            <Space size={'middle'}>
                <Switch
                    checked={props.isTest}
                    onChange={props.toggleMode}
                />
                <CreateObservableDialog/>
                <CreateBSMDialog canCreate={() => !props.isLearning && props.isTest} addBsmToCanvas={props.addBsmToCanvas} bsmList={props.bsmList}/>
                <Button
                    danger={true}
                    shape={'circle'}
                    onClick={() => props.removeSelected(props.selection)}
                    disabled={!props.selection || props.selection === props.testObservable.movableObject || props.isLearning}
                    icon={<DeleteOutlined/>}
                    size={'large'}
                />
                <Slider
                    disabled={props.isLearning}
                    style={{width: '50px'}}
                    value={props.randomOdd}
                    onChange={props.setRandomOdd}
                    min={MIN_RANDOM_ODD}
                    max={MAX_RANDOM_ODD}
                />
                <Slider
                    disabled={props.isLearning}
                    style={{width: '50px'}}
                    value={props.fraction}
                    onChange={props.setFraction}
                    min={MIN_FRACTION}
                    max={MAX_FRACTION}
                    step={0.0001}
                />
                <Slider
                    disabled={props.isLearning}
                    style={{width: '50px'}}
                    value={props.minTriangleArea}
                    onChange={props.setMinTriangleArea}
                    min={MIN_TRIANGLE_AREA}
                    max={MAX_TRIANGLE_AREA}
                />
                <LoadJSONDataDialog/>
                <StatisticDialog/>
                <LearningDialog/>
                <Tooltip
                    title='Расстояние промаха'
                >
                    <Statistic
                        value={dModule}
                        precision={2}
                        valueStyle={{ color: '#76ff00' }}
                        suffix="м"
                        prefix={<p>dl</p>}
                    />
                </Tooltip>
                <Tooltip
                    title='Среднеквадратическое отклонение по x'
                >
                    <Statistic
                        value={dx}
                        precision={2}
                        valueStyle={{ color: '#76ff00' }}
                        suffix="м"
                        prefix={<p>dx</p>}
                    />
                </Tooltip>
                <Tooltip
                    title='Среднеквадратическое отклонение по y'
                >
                    <Statistic
                        value={dy}
                        precision={2}
                        valueStyle={{ color: '#76ff00' }}
                        suffix="м"
                        prefix={<p>dy</p>}
                    />
                </Tooltip>
            </Space>
        </Header>
    )
}

const CommandHeaderWithState = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(CommandHeader)

export default CommandHeaderWithState