import {Header} from 'antd/es/layout/layout'
import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {fabric} from 'fabric'
import {Button, Slider, Space, Statistic, Switch, Tooltip} from 'antd'
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
import LearningDialog from './StartLearnDialog'
import LoadJSONDataDialog from './LoadJSONDataDialog'
import CreateObservableDialog from './CreateObservableDialog'
import StatisticDialog from './StatisticDialog'
import {RootState} from '../redux/store'
import {
    addBsm,
    addBsms,
    addObservables,
    addRandomOdds,
    changeFraction,
    changeMinArea,
    changeMode,
    changeRandomOdd,
    deleteBSM
} from '../redux/ActionCreators'
import SaveBtn from './SaveFabricState'
import {getBSMsFromStorage, getObservablesFromStorage, getRandomOddsFromStorage} from '../fabricUtils'
import BackgroundImageDialog from "./BackImgDialog";

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
    addBsm: (bsm: BSM) => void
    deleteBSM: (deletable: IDeletableFabric) => void
    changeRandomOdd: (randomOdd: number) => void
    changeMinArea: (minArea: number) => void
    changeFraction: (fraction: number) => void
    changeMode: (isTest: boolean) => void
    addBsms: (bsm: BSM[]) => void
    addObservables: (observables: IObservable[]) => void
    addRandomOdds: (rs: RandomOddStorage) => void
}

const mapStateToProps = (state: RootState) => {
    const props: StateProps = {
        selection: state.fabric.selection,
        testObservable: state.test.testObservable,
        fraction: state.random.fraction,
        minTriangleArea: state.random.minArea,
        randomOdd: state.random.randomOdd,
        isLearning: state.random.isLearning,
        errors: state.statistic.errors,
        bsmList: state.lps.bsmList,
        isTest: state.test.isTesting
    }
    return props
}

const mapDispatchToProps: DispatchProps = {
    addBsm,
    deleteBSM,
    changeFraction,
    changeRandomOdd,
    changeMinArea,
    changeMode,
    addBsms,
    addObservables,
    addRandomOdds
}

type CommandHeaderProps = OwnProps & StateProps & DispatchProps

const CommandHeader: React.FC<CommandHeaderProps> = (props: CommandHeaderProps) => {

    /** При первой инициализации добавить БСМ из локального хранилища */
    useEffect(() => {
        /** Восстановление БСМ */
        getBSMsFromStorage()
            .then(props.addBsms)

        /** Восстановление объектов наблюдения */
        getObservablesFromStorage()
            .then(props.addObservables)

        const rs = getRandomOddsFromStorage()
        if (rs)
            props.addRandomOdds(rs)
    }, [])

    const [dModule, dx, dy] = props.errors.map(error => error / 100)

    return(
        <Header>
            <Space size={'middle'}>
                <Switch
                    checked={props.isTest}
                    onChange={props.changeMode}
                />
                <CreateObservableDialog/>
                <CreateBSMDialog canCreate={() => !props.isLearning && props.isTest} addBsmToCanvas={props.addBsm} bsmList={props.bsmList}/>
                <Button
                    danger={true}
                    shape={'circle'}
                    onClick={() => props.deleteBSM(props.selection)}
                    disabled={!props.selection || props.selection === props.testObservable.movableObject || props.isLearning}
                    icon={<DeleteOutlined/>}
                    size={'large'}
                />
                <Slider
                    disabled={props.isLearning}
                    style={{width: '50px'}}
                    value={props.randomOdd}
                    onChange={props.changeRandomOdd}
                    min={MIN_RANDOM_ODD}
                    max={MAX_RANDOM_ODD}
                />
                <Slider
                    disabled={props.isLearning}
                    style={{width: '50px'}}
                    value={props.fraction}
                    onChange={props.changeFraction}
                    min={MIN_FRACTION}
                    max={MAX_FRACTION}
                    step={0.0001}
                />
                <Slider
                    disabled={props.isLearning}
                    style={{width: '50px'}}
                    value={props.minTriangleArea}
                    onChange={props.changeMinArea}
                    min={MIN_TRIANGLE_AREA}
                    max={MAX_TRIANGLE_AREA}
                />
                <LoadJSONDataDialog/>
                <StatisticDialog/>
                <SaveBtn/>
                <BackgroundImageDialog/>
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