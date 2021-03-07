import React, {useState} from 'react'
import {Button, Form, InputNumber, Modal} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {fabric} from 'fabric'
import {ColorResult, SketchPicker} from 'react-color'


type CreateBSMDialogProps = {
    addBsmToCanvas: (bsm: BSM) => void
    isLearning: boolean
    bsmList: BSM[]
}

type DialogStorage = {
    imei: number
    color: string
    point: IPoint
}

const createBsm: (imei: number, color: string, point: IPoint) => BSM = (imei: number, color: string, point: IPoint) => {
    const circleObject = new fabric.Circle({
        radius: 20,
        originX: 'center',
        originY: 'center',
        fill: color,
        stroke: '#6def0b',
        strokeWidth: 3
    })

    const textObject = new fabric.Text('', {
        fontSize: 8,
        originX: 'center',
        originY: 'center'
    })

    const group = new fabric.Group([circleObject, textObject], {
        hasControls: false,
        left: point.x * 100 - 21.5,
        top: point.y * 100 - 21.5
    })

    const center = group.getCenterPoint()

    textObject.set({ text: `${(center.x / 100).toFixed(2)}, ${(center.y / 100).toFixed(2)}`})

    group.on('moving', () => {
        const point = group.getCenterPoint()
        const [x, y] = [point.x / 100, point.y / 100]
        textObject.set({text: `${x.toFixed(2)}, ${y.toFixed(2)}`})
    })

    const newBsm: BSM = {
        rssi0: 50,
        r0: 1,
        _rssi: 0,
        imei: imei,
        object: group,
        _staticCoords: group.getCenterPoint(),
        get staticCoords() {
            this._staticCoords = group.getCenterPoint()
            return this._staticCoords
        },
        setSelectable(selectable: boolean) {
            group.set({ selectable })
        },
        set rssi(value: number) {
            this._rssi = value
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
        imei: 1,
        color: '#dc0808',
        point: { x: 0, y: 0 }
    })

    const onCancel: () => void = () => setModalVisible(() => false)

    const onOk: () => void = () => {
        if (!props.bsmList.find((bsm: BSM) => bsm.imei === dialogStorage.imei)) {
            setModalVisible(() => false)
            props.addBsmToCanvas(createBsm(dialogStorage.imei, dialogStorage.color, dialogStorage.point))
        }
        else {
            Modal.error({
                title: 'Ошибка',
                content: `БСМ с imei ${dialogStorage.imei} уже существует`,
            })
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
                onOk={onOk}
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
                        label='IMEI'
                    >
                        <InputNumber
                            value={dialogStorage.imei}
                            min={1}
                            onChange={(value: number) => setDialogStorage(prev => ({...prev, imei: value}))}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Координаты'
                    >
                        <InputNumber
                            value={dialogStorage.point.x}
                            onChange={(x: number) => setDialogStorage(prev => ({...prev, point: {...prev.point, x}}))}
                        />
                        <InputNumber
                            value={dialogStorage.point.y}
                            onChange={(y: number) => setDialogStorage(prev => ({...prev, point: {...prev.point, y}}))}
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