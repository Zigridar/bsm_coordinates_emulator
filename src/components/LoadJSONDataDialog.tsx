import React, {ChangeEvent, useState} from 'react'
import {Button, Modal, Tooltip} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import {UploadOutlined} from '@ant-design/icons'
import {calcPointsByDataMap, parseLbsmData} from '../utils'
import {connect} from 'react-redux'
import {RootState} from "../redux/store"
import {addStatRows} from '../redux/ActionCreators'

interface OwnProps {

}

interface StateProps {
    bsmList: BSM[]
    observables: IObservable[]
    odd: number
    area: number
    fraction: number
}

interface DispatchProps {
    addStatRows: (statRows: StatisticRow[]) => void
}

const mapStateToProps = (state: RootState) => {
    const props: StateProps = {
        bsmList: state.lps.bsmList,
        observables: state.lps.observables,
        odd: state.random.randomOdd,
        area: state.random.minArea,
        fraction: state.random.fraction
    }
    return props
}

const mapDispatchToProps: DispatchProps = {
        addStatRows
}

type LoadJSONDataDialogProps = OwnProps & StateProps & DispatchProps

const LoadJSONDataDialog: React.FC<LoadJSONDataDialogProps> = (props: LoadJSONDataDialogProps) => {

    const [isModalVisible, setModalVisible] = useState<boolean>(false)

    const [text, setText] = useState<string>('')

    const onCancel = () => {
        setModalVisible(() => false)
    }

    const onOk = () => {
        const parsedData = parseLbsmData(text)
        if (parsedData) {

            const dataMap: Map<[number, number], ReducedSu> = new Map<[number, number], ReducedSu>()

            parsedData.reducedSuList.forEach((reducedSu) => {
                dataMap.set([reducedSu.suReceivingTime, reducedSu.id], reducedSu)
            })

            parsedData.fullSuList.forEach((fullSu) => {
                dataMap.set([fullSu.suReceivingTime, fullSu.id], fullSu)
            })

            const notFoundBsms = new Set<number>()

            const notFoundObservables = new Set<number>()
            dataMap.forEach(value => {

                if (!props.observables.find(obs => obs.imei === value.id))
                    notFoundObservables.add(value.id)

                value.iuList.forEach(iu => {
                    if (!props.bsmList.find(bsm => bsm.imei === iu.id)) {
                        notFoundBsms.add(iu.id)
                    }
                })
            })

            notFoundBsms.forEach(item => {
                Modal.error({
                    title: 'Ошибка',
                    content: `БСМ с imei: ${item} не найдена`
                })
            })

            notFoundObservables.forEach(item => {
                Modal.error({
                    title: 'Ошибка',
                    content: `Объект наблюдения с imei: ${item} не найден`
                })
            })

            if (notFoundBsms.size > 0 || notFoundObservables.size > 0)
                return onCancel()

            const statisticRows = calcPointsByDataMap(
                dataMap,
                props.bsmList,
                props.odd,
                props.area,
                props.fraction
            )

            props.addStatRows(statisticRows)

            onCancel()
        }
        else {
            Modal.error({
                title: 'Ошибка парсинга',
                content: 'Не удается распознать JSON'
            })
        }
    }

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(() => e.target.value)
    }

    return (
        <>
            <Tooltip
                title={'Загрузить JSON'}
            >
                <Button
                    size={'large'}
                    shape={'circle'}
                    onClick={() => setModalVisible(() => true)}
                    icon={<UploadOutlined />}
                />
            </Tooltip>
            <Modal
                title={'JSON load'}
                visible={isModalVisible}
                onOk={onOk}
                onCancel={onCancel}
            >
                <TextArea
                    rows={5}
                    value={text}
                    onChange={onChange}
                />
            </Modal>
        </>
    )
}

const LoadJSONDialog = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(LoadJSONDataDialog)

export default LoadJSONDialog