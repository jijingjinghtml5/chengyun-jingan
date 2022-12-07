import request from '@/http/request'
import request2 from '@res/http/request2'

// 20200223
export function getDisposeData3 () {
  return request({
    url: '/v2/data-api/186'
  })
}

export function getGridListData (streetId) {
  const url = '/v2/data-api/100'

  return request({
    url
  })
}

export function getVideoById (videoId) {
  return request({
    url: '/v2/screen-manage/find-video',
    params: {
      videoNo: videoId,
      limit: 1
    }
  })
}

export function getTouxiang (uuid) {
  return request2({
    url: '/screen-api/v2/image',
    params: {
      uuid: uuid
    }
  })
}

export function getPersonDetail (id) {
  if (!id) {
    return false
  }
  return request({
    url: '/v2/data-api/185',
    params: {
      filter: 'simple.primeID=eq.' + id
    }
  })
}
