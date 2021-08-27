'use strict'

const { Queue, Worker } = require('bullmq')

const defaultQueueOptions = {
  prefix: 'queue'
}

const defaultJobOptions = {
  removeOnComplete: true,
  removeOnFail: true
}

module.exports = class QueueMQ {
  constructor (name, opts = {}) {
    this.name = name
    this.opts = Object.assign({}, defaultQueueOptions, opts)

    this.Queue = new Queue(name, this.opts)
  }

  addJob (name, data, opts = {}) {
    return this.Queue.add(name, data, { ...defaultJobOptions, ...opts })
  }

  addBulk (data = []) {
    return this.Queue.addBulk(data.map(o => {
      o.opts = { ...defaultJobOptions, ...o.opts }
      return o
    }))
  }

  runWorker (handler, opts = {}) {
    return new Worker(this.name, handler, { ...this.opts, ...opts })
  }
}
