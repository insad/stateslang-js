import IWaitState from './interface/IWaitState'
import BaseState from './BaseState'
import { applyInputPath } from '../utils'
const debug = require('debug')('WaitState')

export default class WaitState<Context> extends BaseState<Context> {

  public Type: 'Wait'

  public Next?: string

  protected NextState?: BaseState<Context>

  public End?: boolean

  public Comment?: string

  public Resource: string

  public InputPath?: string

  public OutputPath?: string

  public Seconds?: number

  public Timestamp?: Timestamp

  public SecondsPath?: string

  public TimestampPath?: string

  constructor(name: string, state: IWaitState) {
    super(name)
    Object.assign(this, state)
  }

  private getTimeout(input: mixed) {
    if (this.Seconds) {
      return this.Seconds * 1000
    }
    if (this.Timestamp) {
      const waitTill = new Date(this.Timestamp)
      return waitTill.getTime() - Date.now()
    }
    if (this.SecondsPath) {
      return applyInputPath(input, this.SecondsPath) * 1000
    }
    if (this.TimestampPath) {
      const waitTillTimestamp = applyInputPath(input, this.TimestampPath)
      const waitTill = new Date(waitTillTimestamp)
      return waitTill.getTime() - Date.now()
    }
    throw new Error('Could not parse duration for wait state')
  }

  public async execute(input: mixed, context: Context): Promise<mixed> {
    const waittime = this.getTimeout(input)
    const that = this
    debug(`WaitState waiting for ${waittime} ms`)
    return new Promise<mixed>(
      (
        resolve: (value?: mixed | PromiseLike<mixed> | undefined) => void,
        reject: (reason?: mixed) => void,
      ) => {
        setTimeout(() => {
          try {
            return resolve(that.gotoNextState(input, context))
          } catch (e) {
            reject(e)
          }
        }, waittime)
      })
  }
}
