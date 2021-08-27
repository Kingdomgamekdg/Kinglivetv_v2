'use strict'

const queueMQ = require('../lib/queue-mq')

class Queue {
  constructor (options) {
    this.options = options
    this.mqQueues = {}
  }

  createQueue (name, opts = {}) {
    if (!this.mqQueues[name]) {

      const _opts = Object.assign({ connection: this.options }, opts)

      this.mqQueues[name] = new queueMQ(name, _opts)
    }

    return this.mqQueues[name]
  }
}

module.exports = Queue
