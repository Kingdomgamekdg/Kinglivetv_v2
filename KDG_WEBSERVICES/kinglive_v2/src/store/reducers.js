import { CHANGE_USER, CHANGE_ADDRESS ,CHANGE_NOTI ,CHANGE_UNREAD_NOTI } from './actions'

const initialState = {}

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case CHANGE_USER: {
      return {
        ...state,
        user: action.payload,
      }
    }

    case CHANGE_ADDRESS: {
      return {
        ...state,
        address: action.payload,
      }
    }

    case CHANGE_NOTI: {
      return {
        ...state,
        noties: action.payload,
      }
    }
    case CHANGE_UNREAD_NOTI: {
      return {
        ...state,
        unread_noti: action.payload,
      }
    }

    default: {
      return state
    }
  }
}
