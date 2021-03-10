import React, {useState} from 'react'
import {Dispatch} from 'redux'
import {connect} from 'react-redux'
import {Button, InputNumber, Modal, Table, Tooltip} from 'antd'
import {BarChartOutlined} from '@ant-design/icons'
import {pointToString} from '../utils'
import {updateRealPointAction} from '../redux/actionCreators'


interface OwnProps {

}

interface StateProps {
    statData: StatisticRow[]
}

interface DispatchProps {
    updateRealPoint: (point: IPoint, index: number) => void
}

type DialogProps = OwnProps & StateProps & DispatchProps

const mapStateToProps = (state: FabricState) => {
    const props: StateProps = {
        statData: state.statisticData
    }

    return props
}

const mapDispatchToProps = (dispatch: Dispatch<FabricObjectAction>) => {
    const props: DispatchProps ={
        updateRealPoint: (point: IPoint, index: number) => {
            debugger
            dispatch(updateRealPointAction(point, index))
        }
    }

    return props
}

const columns = [
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
    updateRealPoint: (point: IPoint, index: number) => void
}

const EditRealPoint: React.FC<EditRealPointProps> = (props: EditRealPointProps) => {

    const onChangeX = (x: number) => {
        props.updateRealPoint({...props.point, x}, props.index)
    }

    const onChangeY = (y: number) => {
        props.updateRealPoint({...props.point, y}, props.index)
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

const StatDialog: React.FC<DialogProps> = (props: DialogProps) => {

    const [visible, setVisible] = useState<boolean>(false)

    const dataArr: StatTableRow[] = props.statData.map((data: StatisticRow, index: number) => {
        const rowData: StatTableRow = {
            key: `${index}`,
            imei: data.observableImei,
            calculated: pointToString(data.calcPoint),
            random: pointToString(data.randomPoint),
            real: <EditRealPoint point={data.realPoint} index={index} updateRealPoint={props.updateRealPoint}/>
        }

        return rowData
    })

    return(
        <>
            <Button
                size={"large"}
                shape={"circle"}
                onClick={() => setVisible(() => true)}
                icon={<BarChartOutlined />}
            />
            <Modal
                width={'800px'}
                title={'Statistic'}
                visible={visible}
                footer={null}
                onCancel={() => setVisible(() => false)}
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