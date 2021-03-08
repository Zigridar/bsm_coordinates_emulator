import React, {ChangeEvent, useState} from 'react'
import {Button, Modal, Tooltip} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import {UploadOutlined} from '@ant-design/icons'
import {calcPointsByDataMap, parseLbsmData} from '../utils'
import {Dispatch} from 'redux'
import {connect} from 'react-redux'

interface OwnProps {

}

interface StateProps {
    bsmList: BSM[]
}

interface DispatchProps {

}

const mapStateToProps = (state: FabricState) => {
    const props: StateProps = {
        bsmList: state.bsmList
    }
    return props
}

const mapDispatchToProps = (dispatch: Dispatch<FabricObjectAction>) => {
    const props: DispatchProps = {

    }
    return props
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

            const dataMap: Map<number, ReducedSu> = new Map<number, ReducedSu>()

            parsedData.reducedSuList.forEach((reducedSu) => {
                dataMap.set(reducedSu.id, reducedSu)
            })

            parsedData.fullSuList.forEach((fullSu) => {
                dataMap.set(fullSu.id, fullSu)
            })

            const notFound = new Set<number>()

            dataMap.forEach(value => {

                value.iuList.forEach(iu => {
                    if (!props.bsmList.find(bsm => bsm.imei === iu.id)) {
                        notFound.add(iu.id)
                    }
                })
            })

            notFound.forEach(item => {
                Modal.error({
                    title: 'Ошибка',
                    content: `БСМ с imei: ${item} не найдена`
                })
            })

            if (notFound.size > 0)
                return onCancel()

            calcPointsByDataMap(dataMap)

            onCancel()
        }
        else {
            Modal.error({
                title: 'Ошибка парсинга',
                content: 'Не удается рпспознать JSON'
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