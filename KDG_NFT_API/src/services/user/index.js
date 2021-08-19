'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/Users')
const VideoService = require('../../services/video')
const ActivityService = require('../../services/activities')
const StreamService = require('../../services/stream')

const { IsEmpty } = require('../../utils/common-util')

class UsersService extends BaseService {
  async getPersonality ({ userId }) {
    const user = await this.findById(userId, 'kinglive')

    if (IsEmpty(user)) {
      return {}
    }

    const {
      kinglive = {}
    } = user

    const numberOfVideos = await VideoService.count({
      user: userId
    }) || 0

    const gifts = await ActivityService.count({
      to_user: userId,
      type: 3
    })

    const streamTime = await StreamService.calculateStreamTime({ userId })

    return {
      followed: kinglive.total_followed || 0,
      followers: kinglive.total_follower || 0,
      views: kinglive.total_view || 0,
      videos: numberOfVideos,
      live: streamTime?.length ? streamTime[0].total : 0,
      gifts
    }
  }
}

module.exports = new UsersService(Model)
