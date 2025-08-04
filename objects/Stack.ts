class Node {
  value: any;
  next: Node | null;

  constructor(value: any) {
    this.value = value;
    this.next = null;
  }
}

class Stack {
  top: Node | null;
  size: number;

  constructor() {
    this.top = null;
    this.size = 0;
  }

  push(value: any): void {
    const newNode = new Node(value);
    newNode.next = this.top;
    this.top = newNode
    this.size++;
  }

  pop() {
    if (this.isEmpty()) {
      console.log("Stack is empty, cannot pop.");
      return null;
    }

    const poppedNode = this.top?.value;
    this.top = this.top ? this.top.next : null;
    this.size--;
    return poppedNode;
  }

  peek() {
    return this.isEmpty() ? null : this.top?.value;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  getSize(): number {
    return this.size;
  }

  printStack(): void {
    let current = this.top;
    const values: any[] = [];
    while (current) {
      values.push(current.value);
      current = current.next;
    }
    console.log("Stack (top to bottom):", values.reverse());
  }
}

export default Stack;