'use strict'

class BaseService {
  constructor (model) {
    this.model = model
  }

  /**
   * Check existence
   * @param conditions
   * @returns {Promise<any>}
   */
  isExist (conditions) {
    return new Promise(resolve => {
      this.count(conditions).then(count => {
        resolve(count > 0)
      }).catch(() => {
        resolve(true)
      })
    })
  }

  hasField (field) {
    return !!this.model.schema.obj[field]
  }

  hasUserId () {
    return this.hasField('userId')
  }

  /**
   * Save one or more documents
   * @param docs
   * @returns {docs}
   */
  create (docs) {
    return this.model.create(docs)
  }

  /**
   * Get list documents with pagination
   * @param conditions
   * @param options
   * @returns {{page, limit, total, pages, docs}|*}
   */
  async getList (conditions, options = {}) {
      let result

      if (options.limit === 0) {
        let projection

        if (options.select) {
          projection = options.select
        }

        const docs = await this.find(conditions, projection)
        result = {
          docs,
          limit: 0,
          page: 1,
          total: docs.length,
          pages: 1
        }
      } else {
        const defaultOptions = {
          lean: true,
          leanWithId: true
        }
        result = await this.model.paginate(conditions, Object.assign({}, defaultOptions, options))
      }

      return {
        docs: result.docs,
        limit: result.limit,
        page: result.page,
        totalDocs: result.total,
        totalPages: result.pages,
        total: result.total,
        pages: result.pages
      }
  }

  /**
   * Get list documents
   * @param conditions
   * @param projection
   * @param options
   */
  find (conditions, projection, options) {
    return this.model.find(conditions, projection, Object.assign({
      lean: true
    }, options))
  }

  /**
   * Find the first document that match conditions
   * @param conditions
   * @param projection
   * @param options
   * @returns {Query|*}
   */
  findOne (conditions, projection, options) {
    return this.model.findOne(conditions, projection, Object.assign({
      lean: true
    }, options))
  }

  /**
   * Find the document by id
   * @param id
   * @param projection
   * @param options
   * @returns {Query}
   */
  findById (id, projection, options) {
    return this.model.findById(id, projection, Object.assign({
      lean: true
    }, options))
  }

  /**
   * Update all of the documents that match conditions
   * @param conditions
   * @param doc
   * @param options
   * @returns {*|Query}
   */
  updateMany (conditions, doc, options) {
    return this.model.updateMany(conditions, doc, Object.assign({
      new: true,
      lean: true
    }, options))
  }

  /**
   * Update the first document that match conditions
   * @param conditions
   * @param update
   * @param options
   * @returns {Query|*}
   */
  updateOne (conditions, update = {}, options) {
    update.updatedAt = Date.now()
    return this.model.findOneAndUpdate(conditions, update, Object.assign({
      new: true,
      lean: true
    }, options))
  }

  /**
   * Update the document by id
   * @param id
   * @param update
   * @param options
   * @returns {Query}
   */
  updateById (id, update = {}, options) {
    update.updatedAt = Date.now()
    return this.model.findByIdAndUpdate(id, update, Object.assign({
      new: true,
      lean: true
    }, options))
  }

  /**
   * Delete all of the documents that match conditions
   * @param conditions
   * @returns {*|Query}
   */
  deleteMany (conditions) {
    return this.model.deleteMany(conditions)
  }

  /**
   * Delete the first document that match conditions
   * @param conditions
   * @returns {*|Query}
   */
  deleteOne (conditions) {
    return this.model.deleteOne(conditions)
  }

  /**
   * Delete document by id
   * @param id
   * @returns {*|Query}
   */
  deleteById (id) {
    return this.model.deleteOne({
      _id: id
    })
  }

  disableById (id, userId) {
    const conditions = {
      _id: id,
      userId: userId
    }
    const updates = {
      status: 'DELETED',
      updatedAt: Date.now()
    }
    return this.updateOne(conditions, updates)
  }

  /**
   * Performs aggregations on the models collection
   * @param pipeline
   * @returns {*|Aggregate|Promise}
   */
  aggregate (pipeline) {
    return this.model.aggregate(pipeline).allowDiskUse(true)
  }

  /**
   * Sends multiple insertOne, updateOne, updateMany, replaceOne,
   deleteOne, and/or deleteMany operations
   * @param ops
   * @param options
   * @returns {*|Promise}
   */
  bulkWrite (ops, options) {
    return this.model.bulkWrite(ops, options)
  }

  /**
   * Counts number of matching documents in a database collection
   * @param conditions
   */
  count (conditions) {
    return this.model.countDocuments(conditions)
  }

  /**
   * Creates a Query for a distinct operation
   * @param field
   * @param conditions
   * @returns {*|Query}
   */
  distinct (field, conditions) {
    return this.model.distinct(field, conditions)
  }

  modelName () {
    return this.model.modelName
  }
}

module.exports = BaseService
