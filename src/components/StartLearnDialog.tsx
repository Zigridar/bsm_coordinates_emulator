import React, {useState} from 'react'
import {Button, Form, InputNumber, Modal, Progress, Space, Tooltip} from 'antd'
import {RiseOutlined} from "@ant-design/icons"
import LearnWorker from "../workers/LearnWorker"
import {LEARN_RESULT, PROGRESS, START_LEARNING} from "../workers/WorkerMessageTypes"
import {simplifyBSM} from "../utils"
import {connect} from "react-redux"
import {RootState} from "../redux/store"
import {changeFraction, changeLearningMode, changeMinArea, changeRandomOdd} from "../redux/ActionCreators";

interface OwnProps {

}

interface StateProps {
    isLearning: boolean
    isTesting: boolean
    vptCoords: VptCoords
    bsms: BSM[]
}

interface DispatchProps {
    changeRandomOdd: (randomOdd: number) => void
    changeMinArea: (minArea: number) => void
    changeFraction: (fraction: number) => void
    changeLearningMode: (isLearning: boolean) => void
}

type StartLearnDialogProps = OwnProps & StateProps & DispatchProps

const mapStateToProps = (state: RootState) => {
    const props: StateProps = {
        isLearning: state.random.isLearning,
        bsms: state.lps.bsmList,
        vptCoords: state.fabric.vptCoords,
        isTesting: state.test.isTesting
    }
    return props
}

const mapDispatchToProps: DispatchProps = {
    changeFraction: changeFraction,
    changeLearningMode: changeLearningMode,
    changeMinArea: changeMinArea,
    changeRandomOdd: changeRandomOdd

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
        props.changeLearningMode(true)

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
                    props.changeLearningMode(false)
                    /** Установить вычиселнные коэффициенты */
                    props.changeFraction(fraction)
                    props.changeRandomOdd(randomOdd)
                    props.changeMinArea(triangleArea)
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
                        disabled={props.isLearning || !props.isTesting}
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