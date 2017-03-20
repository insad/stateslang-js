import IParallelState from './interface/IParallelState';
import StateMachine from '../StateMachine';
import Retrier from './Retrier';
import Catcher from './Catcher';
import BaseState from './BaseState';

export default class ParallelState<Context> extends BaseState<Context> {

  Type: 'Parallel';

  /**
   * An array of objects that specify state machines to execute in parallel. Each such state machine
   * object must have fields named States and StartAt whose meanings are exactly like those in the
   * top level of a state machine. [Required]
   */
  Branches: StateMachine<Context>[];

  /**
   * Specifies where (in the input) to place the output of the branches. The input is then filtered
   * as prescribed by the OutputPath field (if present) before being used as the state's output.
   * (See Paths) [Optional]
   */
  ResultPath?: string;

  /**
   * An array of objects, called IRetriers that define a retry policy in case the state encounters
   * runtime errors. See Retrying After an Error. [Optional]
   */
  Retry?: Retrier[];

  /**
   * An array of objects, called ICatchers that define a fallback state which is executed in case
   * the state encounters runtime errors and its retry policy has been exhausted or is not defined.
   * See Fallback States. [Optional]
   */
  Catch?: Catcher[];

  constructor(state: IParallelState) {
    super();
    Object.assign(this, state);
  }

  execute(input: mixed): Promise<mixed> {
    return Promise.resolve(input);
  }

}