import {learn} from '../utils'

const ctx: Worker = self as any

ctx.onmessage = (event: MessageEvent<MessageFromMainThread>) => {
    const { bsms, width, height, hypotenuse } = event.data
    const result: [number, number, number] = learn(bsms, width, height, hypotenuse)
    const resultMessage: MessageFromLearnWorker = { result }
    ctx.postMessage(resultMessage)
}