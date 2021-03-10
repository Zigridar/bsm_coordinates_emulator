import React, {useState} from 'react'
import {Button, Form, InputNumber, Modal, Progress, Space, Tooltip} from 'antd'
import {RiseOutlined} from "@ant-design/icons"
import LearnWorker from "../workers/LearnWorker"
import {LEARN_RESULT, PROGRESS, START_LEARNING} from "../workers/WorkerMessageTypes"
import {simplifyBSM} from "../utils"
import {connect} from "react-redux"
import {Dispatch} from "redux"
import {setFractionAction, setLearningAction, setMinTriangleArea, setRandomOdd} from "../redux/actionCreators"

interface OwnProps {

}

interface StateProps {
    isLearning: boolean
    isTest: boolean
    vptCoords: VptCoords
    bsms: BSM[]
}

interface DispatchProps {
    setRandomOdd: (randomOdd: number) => void
    setMinTriangleArea: (minArea: number) => void
    setFraction: (fraction: number) => void
    setLearning: (isLearning: boolean) => void
}

type StartLearnDialogProps = OwnProps & StateProps & DispatchProps

const mapStateToProps = (state: FabricState) => {
    const props: StateProps = {
        isLearning: state.isLearning,
        bsms: state.bsmList,
        vptCoords: state.vptCoords,
        isTest: state.isTest
    }

    return props
}

const mapDispatchToProps = (dispatch: Dispatch<FabricObjectAction>) => {
    const props: DispatchProps = {
        setFraction: (fraction: number) => {
            dispatch(setFractionAction(fraction))
        },
        setLearning: (isLearning: boolean) => {
            dispatch(setLearningAction(isLearning))
        },
        setMinTriangleArea: (area: number) => {
            dispatch(setMinTriangleArea(area))
        },
        setRandomOdd: (randomOdd: number) => {
            dispatch(setRandomOdd(randomOdd))
        }
    }

    return props
}

const StartLearnDialog: React.FC<StartLearnDialogProps> = (props: StartLearnDialogProps) => {

    const [isModalVisible, setModalVisible] = useState<boolean>(false)

    const [progress, setProgress] = useState<number>(0)

    const [learnParams, setLearnParams] = useState<LearnSteps>({
        learnPointCount: 1000,
        triangleAreaStep: 100,
        randomOddStep: 1000,
        fractionStep: 0.002
    })

    const onLearn = () => {
        props.setLearning(true)

        const learnWorker = new LearnWorker()

        const minX = props.vptCoords.tl.x
        const maxX = props.vptCoords.tr.x
        const minY = props.vptCoords.tl.y
        const maxY = props.vptCoords.bl.y

        const message: MessageFromMainThread = {
            maxX,
            maxY,
            minX,
            minY,
            type: START_LEARNING,
            bsms: simplifyBSM(props.bsms),
            steps: learnParams
        }

        learnWorker.postMessage(message)

        learnWorker.onmessage = (event: MessageEvent<MessageFromLearnWorker>) => {
            const { result, progress, type } = event.data

            switch (type) {
                case PROGRESS:
                    setProgress(() => progress * 100)
                    break
                case LEARN_RESULT:
                    const [fraction, randomOdd, triangleArea] = result
                    console.log(`learn result: fraction: ${fraction}, randomOdd: ${randomOdd}, triangleArea: ${triangleArea}`)
                    learnWorker.terminate()
                    props.setLearning(false)
                    /** Установить вычиселнные коэффициенты */
                    props.setFraction(fraction)
                    props.setRandomOdd(randomOdd)
                    props.setMinTriangleArea(triangleArea)
                    setProgress(() => 0)
                    break
            }
        }

        learnWorker.onerror = (e) => {
            console.log(e)
        }

        setModalVisible(() => false)
    }

    const onOpenDialog = () => setModalVisible(() => true)

    const onCancel = () => setModalVisible(() => false)

    return(
        <>
            <Space>
                <Tooltip
                    title={'Обучение'}
                >
                    <Button
                        disabled={props.isLearning || !props.isTest}
                        shape={'circle'}
                        onClick={onOpenDialog}
                        icon={<RiseOutlined/>}
                        size={'large'}
                    />
                </Tooltip>
                <Tooltip
                    title={`${progress}%`}
                >
                    <Progress
                        style={{width: '150px', display: props.isLearning ? 'inherit' : 'none'}}
                        percent={progress}
                        size="small"
                        status={"active"}
                        showInfo={false}
                    />
                </Tooltip>
            </Space>
            <Modal
                centered={true}
                title={'Learn'}
                onOk={onLearn}
                onCancel={onCancel}
                visible={isModalVisible}
            >
                <Form
                    layout={'horizontal'}
                    labelCol={{span: 15}}
                    wrapperCol={{span: 15}}
                >
                    <Form.Item
                        required={true}
                        label={'Кол-во точек'}
                    >
                        <InputNumber
                            value={learnParams.learnPointCount}
                            min={20}
                            onChange={(value: number) => setLearnParams(prev => ({...prev, learnPointCount: value}))}
                        />
                    </Form.Item>
                    <Form.Item
                        required={true}
                        label={'Шаг изменения площади треугольника'}
                    >
                        <InputNumber
                            value={learnParams.triangleAreaStep}
                            min={1}
                            onChange={(value: number) => setLearnParams(prev => ({...prev, triangleAreaStep: value}))}
                        />
                    </Form.Item>
                    <Form.Item
                        required={true}
                        label={'Шаг изменения коэффициентов при случайной величине'}
                    >
                        <InputNumber
                            value={learnParams.randomOddStep}
                            min={10}
                            onChange={(value: number) => setLearnParams(prev => ({...prev, randomOddStep: value}))}
                        />
                    </Form.Item>
                    <Form.Item
                        required={true}
                        label={'Шаг изменения отношения смещения к центру треугольника'}
                    >
                        <InputNumber
                            value={learnParams.fractionStep}
                            min={0.0001}
                            max={0.002}
                            onChange={(value: number) => setLearnParams(prev => ({...prev, fractionStep: value}))}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

const LearningDialog = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(StartLearnDialog)

export default LearningDialog