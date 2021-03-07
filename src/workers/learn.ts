import {learn} from '../utils'
import {LEARN_RESULT, PROGRESS, START_LEARNING} from './WorkerMessageTypes'

const ctx: Worker = self as any

let progressCounter: number = 0

const progressCallback: (progress: [number, number, number]) => void = (progress: [number, number, number]) => {
    const [pr, step, all] = progress
    console.log(`worker progress: ${pr}, current: ${step}, all: ${all}`)

    if (Math.floor(pr * 100) > progressCounter) {
        progressCounter++
        const message: MessageFromLearnWorker = {
            type: PROGRESS,
            progress: pr
        }
        ctx.postMessage(message)
    }
}

ctx.onmessage = (event: MessageEvent<MessageFromMainThread>) => {
    const { bsms, minX, minY, maxX, maxY, steps, type } = event.data

    switch (type) {
        case START_LEARNING:
            console.log('start learning case')
            const result: [number, number, number] =
            learn(
                bsms,
                minX,
                minY,
                maxX,
                maxY,
                steps,
                progressCallback
            )
            const resultMessage: MessageFromLearnWorker = { result, type: LEARN_RESULT }
            ctx.postMessage(resultMessage)
            break
    }
}