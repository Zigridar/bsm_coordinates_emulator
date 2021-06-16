import React from 'react'
import {Button, Tooltip} from 'antd'
import {SaveOutlined} from '@ant-design/icons'
import {connect} from 'react-redux'
import {RootState} from '../redux/store'
import {serializeBSM, serializeObservable, serializeStatistic} from '../fabricUtils';
import {saveToStorage} from '../utils'
import {randomOddStorage, statisticStorage} from '../constants'
import {useHttp} from '../hooks/http.hook'
import {BSM, IObservable, RandomOddStorage, StatisticRow} from '../../../src/commod_types/type'

interface OwnProps {

}

interface StateProps {
    observables: IObservable[]
    bsmList: BSM[]
    statisticData: StatisticRow[]
    randomOdd: number
    minArea: number
    fraction: number
}

interface DispatchProps {

}

const mapStateToProps = (state: RootState) => {
    const props: StateProps = {
        observables: state.lps.observables,
        bsmList: state.lps.bsmList,
        randomOdd: state.random.randomOdd,
        minArea: state.random.minArea,
        fraction: state.random.fraction,
        statisticData: state.statistic.statisticData
    }
    return props
}

const mapDispatchToProps: DispatchProps = {

}

type SaveBTNProps = OwnProps & StateProps & DispatchProps


const SaveBTN: React.FC<SaveBTNProps> = (props: SaveBTNProps) => {

    const { request } = useHttp()

    const onClick = () => {
        const serializedBSMs = props.bsmList.map(serializeBSM)

        //todo make it better
        request('/bsm', 'POST', { bsm: serializedBSMs })

        const serializedObservables = props.observables.map(serializeObservable)
        //todo make it better
        request('/observable', 'POST', { observable: serializedObservables })

        const serializedStatistic = props.statisticData.map(serializeStatistic)
        console.log(serializedStatistic);
        //todo make it better
        request('/statistic', 'POST', { statistic:  serializedStatistic })

        const randomStorage: RandomOddStorage = {
            fraction: props.fraction,
            minArea: props.minArea,
            randomOdd: props.randomOdd
        }

        saveToStorage(randomOddStorage, JSON.stringify(randomStorage))
    }

    return(
        <Tooltip
            title={'Сохранить состояние'}
        >
            <Button
                shape={"circle"}
                size={"large"}
                onClick={onClick}
                icon={<SaveOutlined />}
            />
        </Tooltip>
    )
}

const SaveBtn = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(SaveBTN)

export default SaveBtn