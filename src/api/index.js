import { request } from './request'
import { groupBy } from 'lodash'
import { getDayTimeStamp } from '@/utils'

import pinyin from 'js-pinyin'
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
  pinyin.setOptions({ checkPolyphone: false, charCase: 0 })
  console.log(pinyin.getCamelChars('管理员')) //GLY
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
        groupRes[firstKey] = groupBy(groupRes[firstKey], 'io3uccc_maminput_fun6')
      })
      const sortBy = (props) => {
        return function (a, b) {
          if (props) {
            //return a[props].localeCompare(b[props])
            if (pinyin.getCamelChars(a[props]) < pinyin.getCamelChars(b[props])) {
              return -1
            } else if (pinyin.getCamelChars(a[props]) > pinyin.getCamelChars(b[props])) {
              return 1
            } else {
              return 0
            }
          } else {
            //return a.localeCompare(b)
            if (pinyin.getCamelChars(a) < pinyin.getCamelChars(b)) {
              return -1
            } else if (pinyin.getCamelChars(a) > pinyin.getCamelChars(b)) {
              return 1
            } else {
              return 0
            }
          }
        }
      }

      const group = []
      Object.keys(groupRes)
        .sort(sortBy())
        .reverse()
        .forEach((firstKey) => {
          const firstNode = {
            name: firstKey,
            children: []
          }
          const firstValues = groupRes[firstKey]
          Object.keys(firstValues)
            .sort(sortBy())
            .forEach((secondKey) => {
              const secondChildren = firstValues[secondKey]
                .map((secItem) => {
                  return {
                    name: secItem.i84admc_maminput_uwg9,
                    key: secItem.ik6s1nd_maminput_x230
                  }
                })
                .sort(sortBy('name'))

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
  const reqShFish = getShFishList()
  const reqShFrozen = getShFrozenList()
  const reqShMeat = getShMeatList()
  const reqGzFish = getGzFrishList()

  return Promise.all([reqShFish, reqShFrozen, reqShMeat, reqGzFish]).then((values) => {
    const listAll = [...values[0], ...values[1], ...values[2], ...values[3]].filter(
      (item) => item.relative
    )
    const groupList = groupBy(listAll, 'relative')
    //todo 排序
    console.log('getAllPriceList', groupList)

    return groupList
  })
}

/**
 * @function 查询上海三文鱼报价
 */
export const getShFishList = () => {
  const params = {
    // filter: {
    //   i7ulg9v_date_kfqi: getDayTimeStamp()
    // }
  }
  return request(
    'POST',
    '/miniprom/getFormRecord?form_id=' + '876c0d7cfc1845d7bc738125ee1a249e',
    params
  ).then((res) => {
    return res.data
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
          sort2: filterItem.i3ynqdj_maminput_peev //厂号
        }
      })
  })
}

/**
 * @function 查询上海冻品报价
 */
export const getShFrozenList = () => {
  const params = {}
  return request(
    'POST',
    '/miniprom/getFormRecord?form_id=' + '3246bd3c011949009357dddec82ebfc6',
    params
  ).then((res) => {
    return res.data.map((filterItem) => {
      return {
        name: filterItem.iojuqta_maminput_cg14,
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
        sort2: filterItem.iz680v0_digitalformat_nt0t //二级排序
      }
    })
  })
}

/**
 * @function 查询上海牛羊肉报价
 */
export const getShMeatList = () => {
  const params = {}
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
        sort2: '' //二级排序
      }
    })
  })
}

/**
 * @function 查询广州三文鱼报价
 */
export const getGzFrishList = () => {
  const params = {}
  return request(
    'POST',
    '/miniprom/getFormRecord?form_id=' + 'cacc1acd20df441ea520720ff75ccf94',
    params
  ).then((res) => {
    return res.data.map((filterItem) => {
      return {
        name: filterItem.ion8nju_maminput_hi7k,
        size: filterItem.iamz55g_abouttable_flaw,
        price: filterItem.ixb8m3b_digitalformat_q6kp,
        origin: filterItem.ifqpdfn_abouttable_hldv, //产地
        date: '',
        relative: filterItem.i75ca1p_maminput_axez,
        supply: filterItem.iaxw72t_abouttable_s6ks, //供应商
        tag: filterItem.ishdrj2_mamcheckbox_3pmu, //tag: ["靓"]
        count: 0,
        left: filterItem.id5q9nc_mamradio_vqwq, //库存情况
        sort1: filterItem.i93qz0a_maminput_7a63, //一级排序
        sort2: filterItem.ii97iyb_maminput_4tan //二级排序
      }
    })
  })
}

export const postOrderAdd = (params) => {
  const data = {
    record_id: '7281e3455c46426e8fe01128331457fb',
    i0lql71_abouttable_2ny5: params.userName,
    i7m8loi_maminput_8dhk: params.userPhone,
    ibmi15k_maminput_7q3y: params.userAddress,
    ikkpvb6_maminput_jhtk: params.remark, //下单备注
    i1dd6gm_digitalformat_ewd8: params.count, //数量
    isqjeo6_digitalformat_4mk9: params.price, //单价
    icc1co0_userhelp_3abl: [uni.getStorageSync('owner')],
    // icc1co0_userhelp_3abl_id: '34bb016e316d4466828de1acf1b827a2',
    // icc1co0_userhelp_3abl_name: '黄宁',
    iqwarxc_mamradio_u8rz: ['冻品仓'], //todo 发货仓
    irigm4o_mamradio_umb1: '件', //todo 单位
    iuvh8zy_maminput_ogl5: params.name, //下单产品,
    i3rxds2_maminput_5pb7: params.userName, //下单客户信息,
    ilsf0gd_maminput_81r9: params.userAddress, //下单物流信息,
    ijckk15_maminput_2mcu: uni.getStorageSync('userInfo').id //客户id
  }
  return request(
    'POST',
    '/miniprom/recordUpdate?form_id=' + '130b67a3a6fc4721bc7ce821c4e2f1ef',
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
