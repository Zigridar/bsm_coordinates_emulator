import {Header} from 'antd/es/layout/layout'
import React, {useState} from 'react'
import {connect} from 'react-redux'
import {fabric} from 'fabric'
import {Button, Slider, Space} from 'antd'
import {Dispatch} from 'redux'
import LearnWorker from '../workers/LearnWorker'
import {
    addObjectAction,
    changeSelectionAction,
    removeObjectAction,
    setFractionAction,
    setLearningAction,
    setMinTriangleArea,
    setRandomOdd
} from '../redux/actionCreators'
import {DeleteOutlined, RiseOutlined} from '@ant-design/icons/lib'
import CreateBSMDialog from './CreateBSMDialog'
import {
    MAX_FRACTION,
    MAX_RANDOM_ODD,
    MAX_TRIANGLE_AREA,
    MIN_FRACTION,
    MIN_RANDOM_ODD,
    MIN_TRIANGLE_AREA
} from '../constants'
import {simplifyBSM} from '../utils'
import {LEARN_RESULT, PROGRESS, START_LEARNING} from "../workers/WorkerMessageTypes";

interface OwnProps {

}

interface StateProps {
    selection: fabric.Object
    observable: IObservable,
    randomOdd: number,
    minTriangleArea: number,
    fraction: number,
    bsms: BSM[],
    canvasDim: [number, number]
    hypotenuse: number,
    isLearning: boolean
}

interface DispatchProps {
    addBsmToCanvas: (bsm: BSM) => void
    removeSelected: (object: fabric.Object) => void
    setRandomOdd: (randomOdd: number) => void
    setMinTriangleArea: (minArea: number) => void
    setFraction: (fraction: number) => void
    setLearning: (isLearning: boolean) => void
}

const mapStateToProps = (state: FabricState) => {
    const props: StateProps = {
        selection: state.selection,
        observable: state.observable,
        fraction: state.fraction,
        minTriangleArea: state.minTriangleArea,
        randomOdd: state.randomOdd,
        bsms: state.bsmList,
        canvasDim: state.canvasDim,
        hypotenuse: state.hypotenuse,
        isLearning: state.isLearning
    }
    return props
}

const mapDispatchToProps = (dispatch: Dispatch<FabricObjectAction>) => {
    const props: DispatchProps = {
        addBsmToCanvas: (bsm: BSM) => {
            dispatch(addObjectAction(bsm))
        },
        removeSelected: (object: fabric.Object) => {
            dispatch(removeObjectAction(object))
            dispatch(changeSelectionAction(null))
        },
        setFraction: (fraction: number) => {
            dispatch(setFractionAction(fraction))
        },
        setRandomOdd: (randomOdd: number) => {
            dispatch(setRandomOdd(randomOdd))
        },
        setMinTriangleArea: (minArea: number) => {
            dispatch(setMinTriangleArea(minArea))
        },
        setLearning: ((isLearning: boolean) => {
            dispatch(setLearningAction(isLearning))
        })
    }
    return props
}

type CommandHeaderProps = OwnProps & StateProps & DispatchProps

const CommandHeader: React.FC<CommandHeaderProps> = (props: CommandHeaderProps) => {

    const [progressCounter, setProgress] = useState<number>(0)

    const onLearn = () => {
        props.setLearning(true)

        const learnWorker = new LearnWorker()

        const [width, height] = props.canvasDim

        //todo set manually
        const steps: LearnSteps = {
            learnPointCount: 1000,
            triangleAreaStep: 100,
            randomOddStep: 1000,
            fractionStep: 0.005
        }

        const message: MessageFromMainThread = {
            type: START_LEARNING,
            bsms: simplifyBSM(props.bsms),
            width: width,
            height: height,
            hypotenuse: props.hypotenuse,
            steps
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
                    break
            }
        }

        learnWorker.onerror = (e) => {
            console.log(e)
        }
    }

    return(
        <Header>
            <Space size={'middle'}>
                <CreateBSMDialog isLearning={props.isLearning} addBsmToCanvas={props.addBsmToCanvas}/>
                <Button
                    danger={true}
                    shape={'circle'}
                    onClick={() => props.removeSelected(props.selection)}
                    disabled={!props.selection || props.selection === props.observable.object || props.isLearning}
                    icon={<DeleteOutlined/>}
                    size={'large'}
                />
                <Slider
                    disabled={props.isLearning}
                    style={{width: '200px'}}
                    value={props.randomOdd}
                    onChange={props.setRandomOdd}
                    min={MIN_RANDOM_ODD}
                    max={MAX_RANDOM_ODD}
                />
                <Slider
                    disabled={props.isLearning}
                    style={{width: '200px'}}
                    value={props.fraction}
                    onChange={props.setFraction}
                    min={MIN_FRACTION}
                    max={MAX_FRACTION}
                    step={0.0001}
                />
                <Slider
                    disabled={props.isLearning}
                    style={{width: '200px'}}
                    value={props.minTriangleArea}
                    onChange={props.setMinTriangleArea}
                    min={MIN_TRIANGLE_AREA}
                    max={MAX_TRIANGLE_AREA}
                />
                <Button
                    disabled={props.isLearning}
                    shape={'circle'}
                    onClick={onLearn}
                    icon={!props.isLearning && <RiseOutlined />}
                    size={'large'}
                >
                    {props.isLearning && <p>{`${Math.ceil(progressCounter)} %`}</p>}
                </Button>
            </Space>
        </Header>
    )
}

const CommandHeaderWithState = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(CommandHeader)

export default CommandHeaderWithState