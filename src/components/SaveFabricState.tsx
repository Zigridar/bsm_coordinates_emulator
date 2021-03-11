import React from 'react'
import {Button, Tooltip} from "antd"
import {SaveOutlined} from '@ant-design/icons'
import {connect} from 'react-redux'
import {RootState} from '../redux/store'
import {serializeBSM, serializeObservable} from '../fabricUtils'
import {saveToStorage} from '../utils'
import {bsmStorage, observableStorage, randomOddStorage} from '../constants'

interface OwnProps {

}

interface StateProps {
    observables: IObservable[]
    bsmList: BSM[]
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
        fraction: state.random.fraction
    }
    return props
}

const mapDispatchToProps: DispatchProps = {

}

type SaveBTNProps = OwnProps & StateProps & DispatchProps


const SaveBTN: React.FC<SaveBTNProps> = (props: SaveBTNProps) => {

    const onClick = () => {
        const serializedBSMs = props.bsmList.map(bsm => serializeBSM(bsm))
        const serializedObservables = props.observables.map(observable => serializeObservable(observable))
        saveToStorage(bsmStorage, JSON.stringify(serializedBSMs))
        saveToStorage(observableStorage, JSON.stringify(serializedObservables))

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