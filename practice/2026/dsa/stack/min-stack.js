
// https://leetcode.com/problems/min-stack/description

var MinStack = function() {
    this.stack = [];
    this.min;
};

/** 
 * @param {number} value
 * @return {void}
 */
MinStack.prototype.push = function(value) {
    if (!this.stack.length) {
        this.stack.push(value);
        this.min = value
    }
    else {
        if (value <= this.min) {
            this.stack.push({value: value, pme: this.min});
            this.min = value
        }
        else {
            this.stack.push(value);
        }
    }
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
    const top = this.stack.pop();

    if (typeof top === 'object') {
        this.min = top.pme;
        return top.value;
    }
    else {
        return top;
    }
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
    const top = this.stack[this.stack.length - 1];

    if (typeof top === 'object') {
        return top.value;
    }
    else {
        return top;
    }
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
    return this.min;
};

/** 
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(value)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */