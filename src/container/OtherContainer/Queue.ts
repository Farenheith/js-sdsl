import { Base, initContainer } from '@/container/ContainerBase';
import Deque from '@/container/SequentialContainer/Deque';

class Queue<T> extends Base {
  /**
   * @internal
   */
  private _queue: Deque<T>;
  constructor(container: initContainer<T> = []) {
    super();
    this._queue = new Deque(container);
    this._length = this._queue.size();
  }
  clear() {
    this._queue.clear();
    this._length = 0;
  }
  /**
   * @description Inserts element to queue's end.
   * @param element - The element you want to push to the front.
   * @returns The container length after pushing.
   */
  push(element: T) {
    this._queue.pushBack(element);
    this._length += 1;
    return this._length;
  }
  /**
   * @description Removes the first element.
   * @returns The element you popped.
   */
  pop() {
    if (this._length === 0) return;
    this._length -= 1;
    return this._queue.popFront();
  }
  /**
   * @description Access the first element.
   * @returns The first element.
   */
  front() {
    return this._queue.front();
  }
}

export default Queue;
