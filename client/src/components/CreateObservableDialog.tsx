import React, {useState} from 'react'
import {connect} from 'react-redux'
import {Button, Form, InputNumber, Modal, Tooltip} from "antd"
import {PlusOutlined} from '@ant-design/icons'
import {SketchPicker} from "react-color"
import {createObservable} from "../fabricUtils"
import {RootState} from "../redux/store"
import {addObservable} from "../redux/ActionCreators"
import {IObservable} from "../../../src/commod_types/type";

interface OwnProps {

}

interface StateProps {
    observables: IObservable[]
}

interface DispatchProps {
    addObservable: (observable: IObservable) => void
}

const mapStateToProps = (state: RootState) => {
    const props: StateProps = {
        observables: state.lps.observables
    }
    return props
}

const mapDispatchToProps: DispatchProps = {
    addObservable
}

type CreateObservableDialogProps = OwnProps & StateProps & DispatchProps

interface DialogStore {
    imei: number
    color: string
}

const CreateObservable: React.FC<CreateObservableDialogProps> = (props: CreateObservableDialogProps) => {

    const [isModalVisible, setModalVisible] = useState<boolean>(false)

    const [dialogStorage, setDialogStorage] = useState<DialogStore>({
        color: '#ff0000',
        imei: 1
    })

    const onCancel = () => setModalVisible(() => false)

    const onOk = () => {
        if (props.observables.find(obs => obs.imei === dialogStorage.imei)) {
            Modal.error({
                title: 'Ошибка',
                content: `Объект с imei ${dialogStorage.imei} уже существует`
            })
        }
        else {
            const observable = createObservable(dialogStorage.imei, dialogStorage.color, dialogStorage.color)
            props.addObservable(observable)
            onCancel()
        }
    }

    return(
        <>
            <Tooltip
                title={'Создать объект наблюдения'}
            >
                <Button
                    shape={'circle'}
                    size={"large"}
                    onClick={() => setModalVisible(() => true)}
                    icon={<PlusOutlined/>}
                />
            </Tooltip>
            <Modal
                visible={isModalVisible}
                onOk={onOk}
                onCancel={onCancel}
            >
                <Form
                    layout={'horizontal'}
                    labelCol={{span: 5}}
                    wrapperCol={{span: 5}}
                >
                    <Form.Item
                        required={true}
                        label='IMEI'
                    >
                        <InputNumber
                            value={dialogStorage.imei}
                            min={1}
                            onChange={(value: number) => setDialogStorage(prev => ({...prev, imei: value}))}
                        />
                    </Form.Item>
                    <Form.Item
                        required={true}
                        label={'fake point color'}
                    >
                        <SketchPicker
                            color={dialogStorage.color}
                            onChange={color => setDialogStorage(prev => ({...prev, color: color.hex}))}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

const CreateObservableDialog = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(CreateObservable)

export default CreateObservableDialog