import TreeContainer from './Base';
import TreeIterator from './Base/TreeIterator';
import { TreeNode } from './Base/TreeNode';
import { initContainer, IteratorType } from '@/container/ContainerBase';
import { throwIteratorAccessError } from '@/utils/throwError';

class OrderedSetIterator<K> extends TreeIterator<K, undefined> {
  get pointer() {
    if (this._node === this._header) {
      throwIteratorAccessError();
    }
    return this._node._key!;
  }
  copy() {
    return new OrderedSetIterator(this._node, this._header, this.iteratorType);
  }
  // @ts-ignore
  equals(iter: OrderedSetIterator<K>): boolean;
}

export type { OrderedSetIterator };

class OrderedSet<K> extends TreeContainer<K, undefined> {
  /**
   * @param container - The initialization container.
   * @param cmp - The compare function.
   * @param enableIndex - Whether to enable iterator indexing function.
   * @example
   * new OrderedSet();
   * new OrderedSet([0, 1, 2]);
   * new OrderedSet([0, 1, 2], (x, y) => x - y);
   * new OrderedSet([0, 1, 2], (x, y) => x - y, true);
   */
  constructor(
    container: initContainer<K> = [],
    cmp?: (x: K, y: K) => number,
    enableIndex?: boolean
  ) {
    super(cmp, enableIndex);
    const self = this;
    container.forEach(function (el) {
      self.insert(el);
    });
  }
  /**
   * @internal
   */
  private * _iterationFunc(
    curNode: TreeNode<K, undefined> | undefined
  ): Generator<K, void> {
    if (curNode === undefined) return;
    yield * this._iterationFunc(curNode._left);
    yield curNode._key!;
    yield * this._iterationFunc(curNode._right);
  }
  begin() {
    return new OrderedSetIterator(
      this._header._left || this._header,
      this._header
    );
  }
  end() {
    return new OrderedSetIterator(this._header, this._header);
  }
  rBegin() {
    return new OrderedSetIterator(
      this._header._right || this._header,
      this._header,
      IteratorType.REVERSE
    );
  }
  rEnd() {
    return new OrderedSetIterator(this._header, this._header, IteratorType.REVERSE);
  }
  front() {
    return this._header._left ? this._header._left._key : undefined;
  }
  back() {
    return this._header._right ? this._header._right._key : undefined;
  }
  /**
   * @description Insert element to set.
   * @param key - The key want to insert.
   * @param hint - You can give an iterator hint to improve insertion efficiency.
   * @return The size of container after setting.
   * @example
   * const st = new OrderedSet([2, 4, 5]);
   * const iter = st.begin();
   * st.insert(1);
   * st.insert(3, iter);  // give a hint will be faster.
   */
  insert(key: K, hint?: OrderedSetIterator<K>) {
    return this._set(key, undefined, hint);
  }
  find(element: K) {
    const curNode = this._findElementNode(this._root, element);
    return new OrderedSetIterator(curNode, this._header);
  }
  lowerBound(key: K) {
    const resNode = this._lowerBound(this._root, key);
    return new OrderedSetIterator(resNode, this._header);
  }
  upperBound(key: K) {
    const resNode = this._upperBound(this._root, key);
    return new OrderedSetIterator(resNode, this._header);
  }
  reverseLowerBound(key: K) {
    const resNode = this._reverseLowerBound(this._root, key);
    return new OrderedSetIterator(resNode, this._header);
  }
  reverseUpperBound(key: K) {
    const resNode = this._reverseUpperBound(this._root, key);
    return new OrderedSetIterator(resNode, this._header);
  }
  union(other: OrderedSet<K>) {
    const self = this;
    other.forEach(function (el) {
      self.insert(el);
    });
    return this._length;
  }
  [Symbol.iterator]() {
    return this._iterationFunc(this._root);
  }
  // @ts-ignore
  eraseElementByIterator(iter: OrderedSetIterator<K>): OrderedSetIterator<K>;
  // @ts-ignore
  forEach(callback: (element: K, index: number, tree: OrderedSet<K>) => void): void;
  // @ts-ignore
  getElementByPos(pos: number): K;
}

export default OrderedSet;
