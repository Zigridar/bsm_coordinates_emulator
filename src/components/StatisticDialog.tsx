import React, {useState} from 'react'
import {connect} from 'react-redux'
import {Button, Checkbox, Col, InputNumber, Modal, Row, Statistic, Table, Tooltip} from 'antd'
import {BarChartOutlined} from '@ant-design/icons'
import {calcErrors, pointToString} from '../utils'
import {RootState} from '../redux/store'
import {setValidRow, updateRealPoint} from '../redux/ActionCreators'
import {RealPointUpdate, SetValid} from '../redux/reducers/statistic.reducer'
import {CheckboxChangeEvent} from 'antd/lib/checkbox'


interface OwnProps {

}

interface StateProps {
    statData: StatisticRow[]
}

interface DispatchProps {
    updateRealPoint: (update: RealPointUpdate) => void
    setValidRow: (valid: SetValid) => void
}

type DialogProps = OwnProps & StateProps & DispatchProps

const mapStateToProps = (state: RootState) => {
    const props: StateProps = {
        statData: state.statistic.statisticData
    }
    return props
}

const mapDispatchToProps: DispatchProps = {
    updateRealPoint,
    setValidRow
}

const columns = [
    {
        title: '',
        dataIndex: 'index',
        key: 'index'
    },
    {
        title: 'isValid',
        dataIndex: 'toggleValid',
        key: 'toggleValid'
    },
    {
        title: 'IMEI',
        dataIndex: 'imei',
        key: 'imei'
    },
    {
        title: 'По RSSI',
        dataIndex: 'calculated',
        key: 'calculated'
    },
    {
        title: 'Random',
        dataIndex: 'random',
        key: 'random'
    },
    {
        title: 'Real',
        dataIndex: 'real',
        key: 'real'
    }
]

interface EditRealPointProps {
    point: IPoint
    index: number
    updateRealPoint: (update: RealPointUpdate) => void
}

const EditRealPoint: React.FC<EditRealPointProps> = (props: EditRealPointProps) => {

    const onChangeX = (x: number) => {
        props.updateRealPoint([{...props.point, x}, props.index])
    }

    const onChangeY = (y: number) => {
        props.updateRealPoint([{...props.point, y}, props.index])
    }

    return(
        <>
            <Tooltip
                title={'x'}
            >
                <InputNumber
                    onChange={onChangeX}
                    value={props.point.x}
                />
            </Tooltip>
            <Tooltip
                title={'y'}
            >
                <InputNumber
                    onChange={onChangeY}
                    value={props.point.y}
                />
            </Tooltip>
        </>
    )
}

interface InfoDialogProps {
    rssiErrors: number[]
    randomErrors: number[]
}

const InfoDialogContent: React.FC<InfoDialogProps> = (props: InfoDialogProps) => {
    return(
        <>
            <Row>
                <Col span={24}>
                    <p>Расчет по RSSI</p>
                </Col>
                <Col span={8}>
                    <Tooltip
                        title={'dl'}
                    >
                        <Statistic
                            value={props.rssiErrors[0]}
                            precision={2}
                            suffix="м"
                            prefix={<p>dl</p>}
                        />
                    </Tooltip>
                </Col>
                <Col span={8}>
                    <Tooltip
                        title={'dx'}
                    >
                        <Statistic
                            value={props.rssiErrors[1]}
                            precision={2}
                            suffix="м"
                            prefix={<p>dx</p>}
                        />
                    </Tooltip>
                </Col>
                <Col span={8}>
                    <Tooltip
                        title={'dy'}
                    >
                        <Statistic
                            value={props.rssiErrors[2]}
                            precision={2}
                            suffix="м"
                            prefix={<p>dy</p>}
                        />
                    </Tooltip>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <p>Случайная точка</p>
                </Col>
                <Col span={8}>
                    <Tooltip
                        title={'dl'}
                    >
                        <Statistic
                            value={props.randomErrors[0]}
                            precision={2}
                            suffix="м"
                            prefix={<p>dl</p>}
                        />
                    </Tooltip>
                </Col>
                <Col span={8}>
                    <Tooltip
                        title={'dx'}
                    >
                        <Statistic
                            value={props.randomErrors[1]}
                            precision={2}
                            suffix="м"
                            prefix={<p>dx</p>}
                        />
                    </Tooltip>
                </Col>
                <Col span={8}>
                    <Tooltip
                        title={'dy'}
                    >
                        <Statistic
                            value={props.randomErrors[2]}
                            precision={2}
                            suffix="м"
                            prefix={<p>dy</p>}
                        />
                    </Tooltip>
                </Col>
            </Row>
        </>
    )
}


interface SetValidCheckProps {
    index: number
    setValid: (valid: SetValid) => void
    valid: boolean
}

const SetValidRow: React.FC<SetValidCheckProps> = (props: SetValidCheckProps) => {
    return(
        <Checkbox
            checked={props.valid}
            onChange={(e: CheckboxChangeEvent) => {props.setValid([e.target.checked, props.index])}}
        />
    )
}

const StatDialog: React.FC<DialogProps> = (props: DialogProps) => {

    const [visible, setVisible] = useState<boolean>(false)

    const dataArr: StatTableRow[] = props.statData.map((data: StatisticRow, index: number) => {
        const rowData: StatTableRow = {
            toggleValid: <SetValidRow valid={data.isValid} index={index} setValid={props.setValidRow}/>,
            index: index + 1,
            key: `${index}`,
            imei: data.observableImei,
            calculated: pointToString(data.calcPoint),
            random: pointToString(data.randomPoint),
            real: <EditRealPoint point={data.realPoint} index={index} updateRealPoint={props.updateRealPoint}/>
        }

        return rowData
    })

    const showErrors = () => {
        const realAndCalc: [IPoint, IPoint][] = []
        const realAndRandom: [IPoint, IPoint][] = []

        props.statData.filter((statRow: StatisticRow) => statRow.isValid).forEach((statRow: StatisticRow) => {
            const { realPoint, calcPoint, randomPoint } = statRow
            const real = { x: realPoint.x * 100, y: realPoint.y * 100 }
            realAndCalc.push([real, calcPoint])
            realAndRandom.push([real, randomPoint])
        })

        const rssiErrors = calcErrors(realAndCalc).map(error => error / 100)
        const randomErrors = calcErrors(realAndRandom).map(error => error / 100)

        Modal.info({
            title: 'Погрешности',
            content: <InfoDialogContent randomErrors={randomErrors} rssiErrors={rssiErrors} />,
            width: '500px'
        })
    }

    return(
        <>
            <Tooltip
                title={'Статистика'}
            >
                <Button
                    size={"large"}
                    shape={"circle"}
                    onClick={() => setVisible(() => true)}
                    icon={<BarChartOutlined />}
                />
            </Tooltip>
            <Modal
                width={'800px'}
                title={'Statistic'}
                visible={visible}
                onCancel={() => setVisible(() => false)}
                onOk={showErrors}
                okButtonProps={{ disabled: props.statData.length === 0 }}
                okText={'Рассчитать погрешности'}
            >
                <Table
                    scroll={{y: 400}}
                    pagination={false}
                    columns={columns}
                    dataSource={dataArr}
                />
            </Modal>
        </>
    )
}

const StatisticDialog = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(StatDialog)

export default StatisticDialog