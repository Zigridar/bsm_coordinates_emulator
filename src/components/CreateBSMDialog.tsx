import React, {useState} from 'react'
import {Button, Form, InputNumber, Modal} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {fabric} from 'fabric'
import {ColorResult, SketchPicker} from 'react-color'


type CreateBSMDialogProps = {
    addBsmToCanvas: (bsm: BSM) => void
    isLearning: boolean
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
        _rssi: 0,
        geoZone: geoZone,
        object: group,
        _staticCoords: group.getCenterPoint(),
        get staticCoords() {
            this._staticCoords = group.getCenterPoint()
            return this._staticCoords
        },
        setSelectable(selectable: boolean) {
            group.set('selectable', selectable)
        },
        set rssi(value: number) {
            this._rssi = value
            textObject.set('text', `${value.toFixed(2)}`)
        },
        get rssi() {
            return this._rssi
        }
    }

    return newBsm
}

const CreateBSMDialog: React.FC<CreateBSMDialogProps> = (props: CreateBSMDialogProps) => {

    const [isModalVisible, setModalVisible] = useState<boolean>(false)

    const [dialogStorage, setDialogStorage] = useState<DialogStorage>({
        bsmCount: 3,
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
                disabled={props.isLearning}
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