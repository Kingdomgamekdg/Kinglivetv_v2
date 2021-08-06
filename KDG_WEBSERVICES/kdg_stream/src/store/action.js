export const CHANGE_UPLOAD_STATUS = 'CHANGE_UPLOAD_STATUS';

export function actChangeUploadStatus(uploadStatus) {
  return {
    type: CHANGE_UPLOAD_STATUS,
    payload: { uploadStatus },
  };
}

export const CHANGE_UNREAD_NOTI = 'CHANGE_UNREAD_NOTI';

export function actChangeUnreadNoti(unreadNoti) {
  return {
    type: CHANGE_UNREAD_NOTI,
    payload: { unreadNoti },
  };
}

export const CHANGE_VIDEO_EDITING = 'CHANGE_VIDEO_EDITING';

export function actChangeVideoEditing(videoEditting) {
  return {
    type: CHANGE_VIDEO_EDITING,
    payload: { videoEditting },
  };
}

export const CHANGE_VIDEO_DELETING = 'CHANGE_VIDEO_DELETING';

export function actChangeVideoDeleting(videoDeleting) {
  return {
    type: CHANGE_VIDEO_DELETING,
    payload: { videoDeleting },
  };
}
