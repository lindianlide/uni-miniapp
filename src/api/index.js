import { request } from './request'
import { groupBy } from 'lodash'
import {
  getDayTimeStamp,
  getOrderStatus,
  getUserInfo,
  formatTime,
  sortBy,
  sortByChar
} from '@/utils/index'

// 先按sort1排序，sort1相同再按sort2排序
function myFishsort(a, b) {
  if (a.sort1 !== b.sort1) return parseFloat(a.sort1) < parseFloat(b.sort1) ? 1 : -1
  else if (a.sort2 !== b.sort2) return parseFloat(a.sort2) < parseFloat(b.sort2) ? -1 : 1
}

/**
 * @function 登录
 * @param {object} data.mobile
 * @param {object} data.password
 * @param {boolean} showLoading    展示loading
 * @param {boolean} hideToast      不展示错误提示
 * @param {boolean} needToken      验证token
 * @param {boolean} errorShow      错误提示
 */
export const postLoginIn = (data) => {
  return request('POST', '/miniprom/loginIn', data, {
    showLoading: true,
    hideToast: false,
    needToken: false,
    errorShow: false
  })
}

/**
 * @function 查询分类
 */
export const getCategoryList = () => {
  //处理搭贝返回的分类数据
  const params = {}
  return request(
    'POST',
    '/miniprom/getFormRecord?form_id=' + '18444f24676f444ab1c15a10d3f05538',
    params
  ).then((res) => {
    if (res.data) {
      const groupRes = groupBy(res.data, 'i8kxg30_maminput_gkr5')
      const firstCategory = Object.keys(groupRes)
      firstCategory.forEach((firstKey) => {
        // groupRes[firstKey].sort(
        //   (a, b) => a.i9yv3wu_digitalformat_74d7 - b.i9yv3wu_digitalformat_74d7
        // )
        groupRes[firstKey] = groupBy(groupRes[firstKey], 'io3uccc_maminput_fun6')
      })

      const group = []
      const sortDir = uni.getStorageSync('addressType') === 'gz' ? 'asc' : 'desc'
      Object.keys(groupRes)
        .sort(sortBy(sortDir))
        .forEach((firstKey) => {
          const firstNode = {
            name: firstKey,
            children: []
          }
          const firstValues = groupRes[firstKey]
          Object.keys(firstValues)
            .sort(sortBy('desc'))
            .forEach((secondKey) => {
              const secondChildren = firstValues[secondKey]
                .map((secItem) => {
                  return {
                    name: secItem.i84admc_maminput_uwg9,
                    key: secItem.ik6s1nd_maminput_x230,
                    sort: secItem.izdqvjj_digitalformat_8f25
                  }
                })
                .sort(sortByChar('asc', 'sort'))

              firstNode.children.push({
                name: secondKey,
                children: secondChildren
              })
            })
          group.push(firstNode)
        })

      return group
    } else {
      return []
    }
  })
}

/**
 * @function 查询所有报价
 */
export const getAllPriceList = () => {
  //uni.showLoading({ mask: true })
  const reqShFish = getShFishList()
  const reqGzFish = getGzFrishList()
  const reqShFrozen1 = getShFrozenList(1, 350)

  //const reqShMeat = getShMeatList()

  return Promise.all([reqShFish, reqGzFish, reqShFrozen1]).then((values) => {
    // uni.hideLoading()
    const listAll = [...values[0], ...values[1], ...values[2]].filter((item) => item.relative)
    const groupList = groupBy(listAll, 'relative')
    //todo 排序
    //console.log('values[2]', values[2])

    return groupList
  })
}

/**
 * @function 查询上海三文鱼报价
 */
export const getShFishList = () => {
  const params = {
    filter: {
      ixd16ij_mamselect_iyhw: ''
    }
  }
  return request(
    'POST',
    '/miniprom/getFormRecord?form_id=' + '876c0d7cfc1845d7bc738125ee1a249e',
    params
  ).then((res) => {
    const result = res.data
      .filter((item) => item.sys_create_time > getDayTimeStamp())
      .map((filterItem) => {
        return {
          name: filterItem.ion8nju_maminput_hi7k,
          size: filterItem.iamz55g_abouttable_flaw,
          price: filterItem.iq5wdlg_digitalformat_9vwa,
          origin: filterItem.ifqpdfn_abouttable_hldv, //产地
          date: filterItem.i93qz0a_maminput_7a63,
          relative: filterItem.iufvz60_maminput_00x0,
          supply: filterItem.iaxw72t_abouttable_s6ks, //供应商
          tag: filterItem.irgnxxx_mamcheckbox_cofw, //tag: ["靓"]
          left: filterItem.ixd16ij_mamselect_iyhw, //left: ["库存不足"],
          count: 0,
          sort1: filterItem.i93qz0a_maminput_7a63, //日期
          sort2: filterItem.i3ynqdj_maminput_peev, //厂号
          category: '上海仓',
          costPrice: filterItem.iuqrlct_digitalformat_3ygo //成本单价
        }
      })
    return result.sort(myFishsort)
  })
}

/**
 * @function 查询上海冻品报价
 */
export const getShFrozenList = (pageNo = 1, pageSize = 200) => {
  const params = {
    page: pageNo,
    page_size: pageSize,
    filter: {
      idewdc8_mamselect_gajg: ''
    }
  }
  return request(
    'POST',
    '/miniprom/getFormRecord?form_id=' + '3246bd3c011949009357dddec82ebfc6',
    params
  ).then((res) => {
    const result = res.data.map((filterItem) => {
      return {
        name: filterItem.i41e5ba_maminput_e6aa,
        size: filterItem.ihkdud1_maminput_lj55,
        price: filterItem.izfahdm_digitalformat_edxh,
        origin: filterItem.iy0zlwf_maminput_q528, //产地
        date: '',
        relative: filterItem.i9h503l_maminput_ukid,
        supply: filterItem.iyp0fb3_abouttable_3pdl, //供应商
        tag: filterItem.in9pclo_mamcheckbox_woga, //tag: ["靓"]
        count: 0,
        left: filterItem.idewdc8_mamselect_gajg, //库存情况
        sort1: filterItem.iisa4hf_digitalformat_j31v, //一级排序
        sort2: filterItem.iz680v0_digitalformat_nt0t, //二级排序
        category: '冻品仓',
        costPrice: filterItem.ixwev4e_digitalformat_iz4j //成本单价
      }
    })
    // 先按sort1排序，sort1相同再按sort2排序
    function mysortFrozen(a, b) {
      if (a.sort1 !== b.sort1) return a.sort1 < b.sort1 ? -1 : 1
      else if (a.sort2 !== b.sort2) return a.sort2 < b.sort2 ? -1 : 1
    }
    return result.sort(mysortFrozen)
  })
}

/**
 * @function 查询上海牛羊肉报价
 */
export const getShMeatList = () => {
  const params = { page: 1, page_size: 400 }
  return request(
    'POST',
    '/miniprom/getFormRecord?form_id=' + '4b3191657fdb42ecb12a7416e7a5fb32',
    params
  ).then((res) => {
    return res.data.map((filterItem) => {
      return {
        name: filterItem.i2h44pj_maminput_pr1h,
        size: filterItem.igvmsvr_maminput_gvoi,
        price: filterItem.ikb9zg6_digitalformat_qx4t,
        origin: filterItem.is4z81b_abouttable_7pqk, //产地
        date: '',
        relative: filterItem.ib7yh1p_maminput_hg98,
        supply: filterItem.iv203tn_abouttable_e0in, //供应商
        tag: filterItem.ii7rm8q_mamcheckbox_ode0, //tag: ["靓"]
        count: 0,
        left: filterItem.ijh99pd_mamselect_7wsy, //库存情况
        sort1: '', //一级排序
        sort2: '', //二级排序
        category: '牛羊肉',
        costPrice: filterItem.ij51jzu_digitalformat_gbyp //成本单价
      }
    })
  })
}

/**
 * @function 查询广州三文鱼报价
 */
export const getGzFrishList = () => {
  const params = {
    filter: {
      id5q9nc_mamradio_vqwq: ''
    }
  }
  return request(
    'POST',
    '/miniprom/getFormRecord?form_id=' + 'cacc1acd20df441ea520720ff75ccf94',
    params
  ).then((res) => {
    const result = res.data
      .filter((item) => item.sys_create_time > getDayTimeStamp())
      .map((filterItem) => {
        return {
          name: filterItem.ion8nju_maminput_hi7k,
          size: filterItem.iamz55g_abouttable_flaw,
          price: filterItem.ixb8m3b_digitalformat_q6kp,
          origin: filterItem.ifqpdfn_abouttable_hldv, //产地
          date: filterItem.iam1jzh_date_b5w5, //报价日期
          relative: filterItem.i75ca1p_maminput_axez,
          supply: filterItem.iaxw72t_abouttable_s6ks, //供应商
          tag: filterItem.ishdrj2_mamcheckbox_3pmu, //tag: ["靓"]
          count: 0,
          left: filterItem.id5q9nc_mamradio_vqwq, //库存情况
          sort1: filterItem.i93qz0a_maminput_7a63, //一级排序
          sort2: filterItem.ii97iyb_maminput_4tan, //二级排序
          category: '广州仓',
          costPrice: filterItem.iz7pni8_digitalformat_ehlp //成本单价
        }
      })

    return result.sort(myFishsort)
  })
}

export const postOrderAdd = (params) => {
  const data = {
    //record_id: '7281e3455c46426e8fe01128331457fb',
    i0lql71_abouttable_2ny5: params.userName,
    i7m8loi_maminput_8dhk: params.userPhone,
    ibmi15k_maminput_7q3y: params.userAddress,
    ikkpvb6_maminput_jhtk: params.remark, //下单备注
    i1dd6gm_digitalformat_ewd8: params.count, //数量
    isqjeo6_digitalformat_4mk9: params.price, //单价
    icc1co0_userhelp_3abl: uni.getStorageSync('owner'),
    iqwarxc_mamradio_u8rz: [params.category], //发货仓
    irigm4o_mamradio_umb1: '件', //todo 单位
    i8dpxd7_maminput_1i4e: params.name, //产品,
    ie11igd_date_hddv: getDayTimeStamp(),
    iuvh8zy_maminput_ogl5: params.name, //下单产品,
    i3rxds2_maminput_5pb7: params.userName, //下单客户信息,
    ilsf0gd_maminput_81r9: params.userAddress, //下单物流信息,
    ijckk15_maminput_2mcu: uni.getStorageSync('userInfo').id, //客户id
    ix9qdte_maminput_bjfb: params.supply, //供应商
    igbpy0k_digitalformat_2fti: params.costPrice //成本单价
  }
  return request(
    'POST',
    '/miniprom/recordCreate?form_id=' + '130b67a3a6fc4721bc7ce821c4e2f1ef',
    data,
    {
      showLoading: true,
      hideToast: false,
      needToken: true,
      errorShow: true
    }
  )
}

export const getUserDetail = () => {
  return request(
    'GET',
    '/miniprom/getRecordDetail?form_id=' +
      '22f8ee1371ee4830b0a5fee58cdf1224&record_id=' +
      getUserInfo().id,
    {
      showLoading: false,
      hideToast: false,
      needToken: true,
      errorShow: false
    }
  ).then((res) => {
    const data = {
      id: res.data.id,
      name: res.data.isfbz3t_maminput_2w53,
      mobile: res.data.i724tmj_maminput_76x4,
      address: res.data.ixyi1j4_maminput_dhot || res.data.i6t5xj1_maminput_2m4w,
      addressType: res.data.ixyi1j4_maminput_dhot ? 'gz' : 'sh'
    }
    return data
  })
}

export const postUserUpdate = (params) => {
  const share = uni.getStorageSync('share')
  const data = {
    record_id: getUserInfo().id,
    ixyi1j4_maminput_dhot: params.type === 'gz' ? params.address : '', //物流广州
    i6t5xj1_maminput_2m4w: params.type === 'sh' ? params.address : '', //物流上海
    isfbz3t_maminput_2w53: params.name, //名称
    i724tmj_maminput_76x4: params.mobile //电话
  }
  if (share) {
    data.imw6zmq_userhelp_imz2 = share
  }
  return request(
    'POST',
    '/miniprom/recordUpdate?form_id=' + '22f8ee1371ee4830b0a5fee58cdf1224',
    data,
    {
      showLoading: true,
      hideToast: false,
      needToken: true,
      errorShow: true
    }
  )
}

export const getOrderList = () => {
  const postOrderList = getPostOrderList()
  const sureOrderList = getSureOrderList()
  return Promise.all([postOrderList, sureOrderList]).then((values) => {
    values[0].forEach((item1) => {
      const orderIndex = values[1].findIndex((item2) => item2.orderId === item1.orderId)
      if (orderIndex === -1) {
        values[1].push(item1)
      }
    })
    return values[1]
  })
}
/**
 * @function 查询提交订单
 */
export const getPostOrderList = () => {
  const params = {
    filter: {
      ijckk15_maminput_2mcu: getUserInfo().id, //todo '7a358606f3b64b058a1c0d26a1adc72c'
      ie11igd_date_hddv: getDayTimeStamp()
    }
  }
  return request(
    'POST',
    '/miniprom/getFormRecord?form_id=' + '130b67a3a6fc4721bc7ce821c4e2f1ef',
    params
  ).then((res) => {
    return res.data?.map((item) => {
      return {
        id: item.id,
        realPrice: 0, //实收金额
        unitPrice: item.isqjeo6_digitalformat_4mk9 || '--', //单价
        md: '', //码单
        name: item.iuvh8zy_maminput_ogl5, //产品名称
        orderId: item.id, //订单id
        isFrom: 'isNotSure',
        status: getOrderStatus(item.i52puzi_mamselect_wi74),
        //isSure: item.ifqpdfn_abouttable_hldv, //是否排单？todo
        date: formatTime(item.ie11igd_date_hddv, 'yyyy-mm-dd') //下单日期
      }
    })
  })
}
/**
 * @function 确认订单取消
 */
export const postOrderListUpdate = (params) => {
  const data = {
    record_id: params.id,
    i52puzi_mamselect_wi74: ['取消确认中']
  }
  return request(
    'POST',
    '/miniprom/recordUpdate?form_id=' + '130b67a3a6fc4721bc7ce821c4e2f1ef',
    data
  )
}
/**
 * @function 回款订单取消
 */
export const postSureOrderListUpdate = (params) => {
  const data = {
    record_id: params.id,
    idrjwci_mamselect_58dq: ['取消确认中']
  }
  return request(
    'POST',
    '/miniprom/recordUpdate?form_id=' + 'd9cfa60efc5e4d4cbe7108104945ca2d',
    data,
    {
      showLoading: true,
      hideToast: false,
      needToken: true,
      errorShow: true
    }
  )
}
/**
 * @function 查询回款订单
 */
export const getSureOrderList = () => {
  const params = {
    filter: {
      iagc0d3_maminput_wejv: getUserInfo().id //todo '7a358606f3b64b058a1c0d26a1adc72c'
    }
  }
  return request(
    'POST',
    '/miniprom/getFormRecord?form_id=' + 'd9cfa60efc5e4d4cbe7108104945ca2d',
    params
  ).then((res) => {
    return res.data?.map((item) => {
      return {
        id: item.id,
        realPrice: item.iqi7h16_digitalformat_7z7u || 0, //实收金额
        unitPrice: item.ir98rl2_digitalformat_u6ob || '--', //单价
        md: item.il83isl_digitalformat_2eby, //码单
        name: item.iur37sg_maminput_ffnd, //产品名称
        isSure: item.ifqpdfn_abouttable_hldv, //是否排单？todo
        orderId: item.isjdoq0_maminput_ps7d, //订单id
        isFrom: 'isSure',
        status: getOrderStatus(item.idrjwci_mamselect_58dq),
        paymentDate: item.idxaopz_date_4228, //付款日期
        date: formatTime(item.imblw7e_date_rj6r, 'yyyy-mm-dd') //下单日期
      }
    })
  })
}

export const postCustomerNeedAdd = (params) => {
  const data = {
    if2dcrh_maminput_77i1: params.content,
    i5x5rfg_maminput_55d8: params.mobile
  }
  return request(
    'POST',
    '/miniprom/recordCreate?form_id=' + 'b68defe6cdce44b0b50f8eef1e43267c',
    data,
    {
      showLoading: true,
      hideToast: false,
      needToken: true,
      errorShow: true
    }
  )
}

export const postBusinessCooperateAdd = (params) => {
  const data = {
    if2dcrh_maminput_77i1: params.content,
    i5x5rfg_maminput_55d8: params.mobile
  }
  return request(
    'POST',
    '/miniprom/recordCreate?form_id=' + 'a334fc82509848e2bc993b906d49c077',
    data,
    {
      showLoading: true,
      hideToast: false,
      needToken: true,
      errorShow: true
    }
  )
}

export const postMySuggestionAdd = (params) => {
  const data = {
    if2dcrh_maminput_77i1: params.content,
    i5x5rfg_maminput_55d8: params.mobile
  }
  return request(
    'POST',
    '/miniprom/recordCreate?form_id=' + '4af8e88dee974adbaa52e6359fd5ee91',
    data,
    {
      showLoading: true,
      hideToast: false,
      needToken: true,
      errorShow: true
    }
  )
}

/**
 * @function 查询订单列表
 * @param {number} data.page   默认 1
 * @param {number} data.page_size 默认 10
 */
export const query_orderList = (data) => {
  return request('GET', '/miniprom/getList', data)
}

/**
 * @function 订单详情
 * @param {number} data.id
 */
export const query_orderDetail = ({ id }) => {
  return request('GET', '/miniprom/getRecord', { id })
}

export const getApps = () => {
  return request('GET', '/miniprom/getApps', {})
}
export const getForm = (params) => {
  return request('GET', '/miniprom/getForm', params)
}

/**
 * @function 修改订单
 * @param {number} data.id
 * @param {number} data.freight  运费
 * @param {number} data.weight_note  码单
 */
export const edit_order = (data) => {
  return request('POST', '/miniprom/updateRecord', data)
}
