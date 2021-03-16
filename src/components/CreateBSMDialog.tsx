import React, {useState} from 'react'
import {Button, Form, InputNumber, Modal, Tooltip} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {fabric} from 'fabric'
import {ColorResult, SketchPicker} from 'react-color'


type CreateBSMDialogProps = {
    createBsm: (bsm: BSM) => void
    canCreate: () => boolean
    bsmList: BSM[]
}

type DialogStorage = {
    imei: number
    color: string
    point: IPoint
    r0: number
    rssi0: number
    outsideImei: number
}

const createBsm = (
    imei: number,
    color: string,
    point: IPoint,
    outsideImei: number,
    r0: number,
    rssi0: number
) => {
    const circleObject = new fabric.Circle({
        radius: 20,
        originX: 'center',
        originY: 'center',
        fill: color,
        stroke: '#6def0b',
        strokeWidth: 3
    })

    const shift = circleObject.width / 2

    const coordsTextObject = new fabric.Text('', {
        fontSize: 8,
        originX: 'center',
        originY: 'center',
        opacity: 0.2
    })

    const titleTextObject = new fabric.Text(`${imei}`, {
        fontSize: 23,
        originX: 'center',
        originY: 'center'
    })

    const group = new fabric.Group([circleObject, coordsTextObject, titleTextObject], {
        hasControls: false,
        left: point.x * 100 - shift,
        top: point.y * 100 - shift
    })

    const center = group.getCenterPoint()

    coordsTextObject.set({ text: `${(center.x / 100).toFixed(2)}, ${(center.y / 100).toFixed(2)}`})

    group.on('moving', () => {
        const point = group.getCenterPoint()
        const [x, y] = [point.x / 100, point.y / 100]
        titleTextObject.set({ opacity: 0.1 })
        coordsTextObject.set({text: `${x.toFixed(2)}, ${y.toFixed(2)}`, opacity: 1})
    })

    group.on('moved', () => {
        titleTextObject.set({ opacity: 1 })
        coordsTextObject.set({ opacity: 0.2 })
    })

    const newBsm: BSM = {
        rssi0,
        outsideImei,
        r0,
        imei,
        object: group,
        _staticCoords: group.getCenterPoint(),
        get staticCoords() {
            this._staticCoords = group.getCenterPoint()
            return this._staticCoords
        },
        setSelectable(selectable: boolean) {
            group.set({ selectable })
        },
        rssi: 0
    }

    return newBsm
}

const CreateBSMDialog: React.FC<CreateBSMDialogProps> = (props: CreateBSMDialogProps) => {

    const [isModalVisible, setModalVisible] = useState<boolean>(false)

    const [dialogStorage, setDialogStorage] = useState<DialogStorage>({
        imei: 1,
        color: '#dc0808',
        point: { x: 0, y: 0 },
        outsideImei: 0,
        r0: 1,
        rssi0: -63
    })

    const onCancel: () => void = () => setModalVisible(() => false)

    const onOk: () => void = () => {
        if (!props.bsmList.find((bsm: BSM) => bsm.imei === dialogStorage.imei && bsm.outsideImei === dialogStorage.outsideImei)) {
            setModalVisible(() => false)
            props.createBsm(createBsm(
                dialogStorage.imei,
                dialogStorage.color,
                dialogStorage.point,
                dialogStorage.outsideImei,
                dialogStorage.r0,
                dialogStorage.rssi0
            ))
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
            <Tooltip
                title={'Создать БСМ'}
            >
                <Button
                    disabled={!props.canCreate()}
                    shape={'circle'}
                    onClick={() => setModalVisible(() => true)}
                    icon={<PlusOutlined/>}
                    size={'large'}

                />
            </Tooltip>
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
                        label={'RSSI0'}
                    >
                        <InputNumber
                            value={dialogStorage.rssi0}
                            onChange={(rssi0: number) => setDialogStorage(prev => ({...prev, rssi0}))}
                        />
                    </Form.Item>
                    <Form.Item
                        label={'IMEI внешнего блока'}
                    >
                        <InputNumber
                            value={dialogStorage.outsideImei}
                            onChange={(outsideImei: number) => setDialogStorage(prev => ({...prev, outsideImei}))}
                        />
                    </Form.Item>
                    <Form.Item
                        label={'r0'}
                    >
                        <InputNumber
                            value={dialogStorage.r0}
                            onChange={(r0: number) => setDialogStorage(prev => ({...prev, r0}))}
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