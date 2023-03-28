import request from '@/http/request'
import requestTesla from '@/http/requestTesla'
import requestrj from '@/http/requestRj'
import requestJa from '@/http/requestJa'

export function getYwym (params) {
  return request({
    url: '/v2/data-api/852',
    params
  })
}

export function getSingleBuildingData () {
  return requestTesla({
    url: '/dynamicdata/list/?data_type=静安区-运行管理平台-多用途单体建筑'
  })
}

// 户籍人口
export function getHujiPeople () {
  return request({
    url: '/v2/data-api/849',
    params: {
      limit: 1000,
      transform: '{messages:messages,agg:aggResults."simple.messageClass"[0]}'
    }
  })
}

// 人员统计
export function getPeopleStatistic (type) {
  return request({
    url: '/v2/data-api/423',
    params: {
      filter: `simple.messageType=population%26status=eq.1&args.population_syrklbhz=eq.${type}`
    }
  })
}

export function getHotlineData (params) {
  return request({
    url: '/v2/data-api/817',
    params
  })
}

// 案件分街镇统计
export function getCaseTownCount (district, type) {
  const url = '/v2/data-api/406'
  return request({
    url,
    params: {
      district: district,
      filter: `openTS=-604800&eventDiscoverType=eq.${type}`
    }
  })
}

// 获取神经元数据分类添加点位图层
export function getNeuronData (type) {
  return request({
    url: '/v2/data-api/397',
    params: {
      filter: `isSensor=eq.true&isVirtual=eq.false&exists=eq.true&PTscene=eq.${type}`
    }
  })
}

// 沿街商铺餐饮户
export function getShopList () {
  return requestTesla({
    url: '/dynamicdata/list/?data_type=静安区-运行管理平台-沿街商铺餐饮户'
  })
}

export function getEventList (openTs = 'today') {
  return requestrj({
    url: '/api/event/event_list/',
    params: {
      openTs: openTs
    }
  })
}

export function getOrgs () {
  return requestJa({
    url: '/erupt-api/life/org'
  })
}

export function getSubway () {
  return requestJa({
    url: '/united-ciimc-api/v1/generic-query',
    params: {
      table: 'appoint-area',
      index_type: 'active',
      token: '240e13b16eff42aeaec9bda8c5707f84',
      filter: 'is_delete=neq.1',
      limit: 1000,
      geo_type: 'shlocal'
    }
  })
}
