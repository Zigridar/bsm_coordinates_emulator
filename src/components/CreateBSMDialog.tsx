import React, {useState} from 'react'
import {Button, Form, InputNumber, Modal} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {fabric} from 'fabric'
import {ColorResult, SketchPicker} from 'react-color'


type CreateBSMDialogProps = {
    addBsmToCanvas: (bsm: BSM) => void
}

type DialogStorage = {
    bsmCount: number
    geoZone: number
    color: string
}

const createBsm: (geoZone: number, color: string) => BSM = (geoZone: number, color: string) => {
    const circleObject = new fabric.Circle({
        radius: 20,
        originX: 'center',
        originY: 'center',
        fill: color,
        stroke: '#6def0b',
        strokeWidth: 3,
    })

    const textObject = new fabric.Text('', {
        fontSize: 10,
        originX: 'center',
        originY: 'center'
    })

    const group = new fabric.Group([circleObject, textObject], {
        hasControls: false,
        left: 0,
        top: 0
    })

    const newBsm: BSM = {
        geoZone: geoZone,
        object: group,
        rssi: 0,
        setRssi (rssi: number) {
            this.rssi = rssi
            textObject.set('text', `${rssi.toFixed(2)}`)
        }
    }

    return newBsm
}

const CreateBSMDialog: React.FC<CreateBSMDialogProps> = (props: CreateBSMDialogProps) => {

    const [isModalVisible, setModalVisible] = useState<boolean>(false)

    const [dialogStorage, setDialogStorage] = useState<DialogStorage>({
        bsmCount: 5,
        geoZone: 1,
        color: '#dc0808'
    })

    const onCancel: () => void = () => setModalVisible(() => false)

    const onOk: (geoZone: number, count: number) => void = () => {
        setModalVisible(() => false)

        for (let i: number = 0; i < dialogStorage.bsmCount; i++) {
            props.addBsmToCanvas(createBsm(dialogStorage.geoZone, dialogStorage.color))
        }
    }

    const changeColorHandler = (color: ColorResult) => {
        setDialogStorage(prev => ({
            ...prev,
            color: color.hex
        }))
    }

    return(
        <>
            <Button
                shape={'circle'}
                onClick={() => setModalVisible(() => true)}
                icon={<PlusOutlined/>}
                size={'large'}

            />
            <Modal
                centered={true}
                title={'Create bsm'}
                onOk={() => onOk(dialogStorage.geoZone, dialogStorage.bsmCount)}
                onCancel={onCancel}
                visible={isModalVisible}
            >
                <Form

                    layout={'horizontal'}
                    labelCol={{span: 5}}
                    wrapperCol={{span: 5}}
                >
                    <Form.Item
                        required={true}
                        label={'geo zone'}
                    >
                        <InputNumber
                            value={dialogStorage.geoZone}
                            min={1}
                            max={5}
                            onChange={(value: number) => setDialogStorage(prev => ({...prev, geoZone: value}))}
                        />
                    </Form.Item>
                    <Form.Item
                        required={true}
                        label={'count'}
                    >
                        <InputNumber
                            value={dialogStorage.bsmCount}
                            min={1}
                            max={5}
                            onChange={(value: number) => setDialogStorage(prev => ({...prev, bsmCount: value}))}
                        />
                    </Form.Item>
                    <Form.Item
                        required={true}
                        label={'color'}
                    >
                        <SketchPicker
                            color={dialogStorage.color}
                            onChange={changeColorHandler}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default CreateBSMDialog