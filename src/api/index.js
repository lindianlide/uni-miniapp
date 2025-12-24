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
  if (a.relative !== b.relative) return a.relative < b.relative ? -1 : 1
  else if (a.sort1 !== b.sort1) return parseFloat(a.sort1) < parseFloat(b.sort1) ? 1 : -1
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
 * @function 查询下单客户
 */
export const getLoginUser = (data) => {
  // io1uk1w_mamswitch_m3s2: 1 //是否下单
  return request('POST', '/miniprom/loginIn', data, {
    showLoading: true,
    hideToast: false,
    needToken: false,
    errorShow: false
  })
}

const updateCategoryFormCache = (params={}) => {
  setTimeout(() => {
    return request(
      'POST',
      '/miniprom/updateFormCache?form_id=9d6ef4ae8b1f4050bee5f0a65d64ea0e&cache_key=' + 'category',
      params
    )
  }, 10000)
}
/**
 * @function 查询分类
 */
export const getCategoryList = () => {
  //处理搭贝返回的分类数据
  const params = {
    page: 1,
    page_size: 150,
  }
  return request(
    'POST',
    '/miniprom/getFormRecord?form_id=9d6ef4ae8b1f4050bee5f0a65d64ea0e&cache_key=' + 'category',
    params
  ).then((res) => {
    if (res.data) {
      updateCategoryFormCache(params)
      //二级排序
      const resSort = res.data.sort(sortByChar('asc', 'i7yhr1u_digitalformat_0drr'))
      //一级分类
      const groupRes = groupBy(resSort, 'ij6pwfy_maminput_2gwd')
      const firstCategory = Object.keys(groupRes)
      //sh,gz
      firstCategory.forEach((firstKey) => {
        //二级分类
        groupRes[firstKey] = groupBy(groupRes[firstKey], 'idk108p_maminput_bqs3')
      })
      const group = []
      const sortDir = uni.getStorageSync('addressType') === 'gz' ? 'asc' : 'desc'
      Object.keys(groupRes)
        .sort(sortBy(sortDir))
        .forEach((firstKey) => {
          //sh、gz
          const firstNode = {
            name: firstKey,
            children: []
          }
          //firstValues 二级分类
          const firstValues = groupRes[firstKey]
          Object.keys(firstValues)
            .forEach((secondKey) => {
              if(secondKey === 'undefined') return
              const secondChildren = firstValues[secondKey]
                .map((secItem) => {
                  return {
                    name: secItem.ix5zzk5_maminput_8ncg,//三级分类
                    key: secItem.ib2vg09_maminput_btak, //分类关联
                    sort: secItem.ix41poi_digitalformat_wgqu || 999 //三级分类排序
                  }
                })
                .sort(sortByChar('asc', 'sort'))

              firstNode.children.push({
                name: secondKey,
                fold: true,
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
export const getAllPriceList = (type) => {
  if(type === 'sh') {
    //uni.showLoading({ mask: true })
    const reqFishSh = getFishList('上海三文鱼')
    const reqFrozen = getFrozenList(1, 500)
    //const reqShMeat = getShMeatList()
    return Promise.all([reqFishSh,reqFrozen]).then((values) => {
      // uni.hideLoading()
      const listAll = [...values[0], ...values[1]]
      const groupList = groupBy(listAll, 'relative')
      return groupList
    })
  } else if(type === 'gz') {
     return getFishList('广州三文鱼').then((res) => {
      const groupList = groupBy(res, 'relative')
      return groupList
    })
  }
}

/**
 * @function 查询三文鱼报价
 */
export const getFishList = (type) => {
  const params = {
    page: 1,
    page_size: 150,
    filter: {
      //ibck4fg_mamselect_6mxf: '', //库存不足
      iu0wd65_mamselect_g450: type
    }
  }
  return request(
    'POST',
    '/miniprom/getFormRecord?form_id=22566adf16f8482f866e0700a70e9919',
    params
  ).then((res) => {
    const result = res.data
      //.filter((item) => item.sys_create_time > getDayTimeStamp())
      .map((filterItem) => {
        return {
          id: filterItem.id,
          name: filterItem.its2mkd_maminput_pd5s, //小程序报价表
          //size: filterItem.iamz55g_abouttable_flaw,
          price: filterItem.iu71q5n_digitalformat_n6c8,//售价 1
          //origin: filterItem.ifqpdfn_abouttable_hldv, //产地
          //date: filterItem.i93qz0a_maminput_7a63,
          relative: filterItem.iz0utpo_maminput_4ubm,//分类关联
          supply: filterItem.iltbqib_abouttable_inu9, //供应商 1
          //tag: filterItem.irgnxxx_mamcheckbox_cofw, //tag: ["靓"]
          left: filterItem.ibck4fg_mamselect_6mxf, //left: ["库存不足"],
          count: 0,
          sort1: filterItem.it1thu7_digitalformat_aa16,//一级排序 //老filterItem.i93qz0a_maminput_7a63, //日期
          sort2: filterItem.i355x4k_digitalformat_tzbm,//二级排序//老filterItem.i3ynqdj_maminput_peev, //厂号
          category: filterItem.iu0wd65_mamselect_g450,//'上海仓',
          type: 'fish',
          costPrice: filterItem.i3pt7hh_digitalformat_sgk1, //成本单价 1
          orderRelative:filterItem.ihslco8_maminput_b078,//下单关联 1
          productFx1:filterItem.i114ydh_maminput_esqo,//产品分析1
          productFx2:filterItem.izyn11v_maminput_6x4w,//产品分析2
          productFx3:filterItem.ibeqe8s_maminput_d1aj,//产品分析3
          productFx4:filterItem.irb4gzd_maminput_mr1m,//产品分析4
          productDes:filterItem.iwubvhu_maminput_sqa8,//产品说明
        }
      })
      .filter(item => item.relative && !item.left)
    return result.sort(myFishsort)
  })
}

/**
 * @function 更新缓存
 */
 const updateFrozenFormCache = (params) => {
  setTimeout(() => {
    return request(
      'POST',
      '/miniprom/updateFormCache?form_id=22566adf16f8482f866e0700a70e9919&cache_key=' + 'frozen',
      params
    )
  }, 3000)
}


/** 
 * @function 查询冻品报价
 */
export const getFrozenList = (pageNo = 1, pageSize = 200) => {
  const params = {
    page: pageNo,
    page_size: pageSize,
    filter: {
      //ibck4fg_mamselect_6mxf: '',//库存情况
      iu0wd65_mamselect_g450: '上海冻品仓'
    }
  }
  return request(
    'POST',
    '/miniprom/getFormRecord?form_id=22566adf16f8482f866e0700a70e9919&cache_key=' + 'frozen',
    params
  ).then((res) => {
    updateFrozenFormCache(params)

    const result = res.data.map((filterItem) => {
      return {
        id: filterItem.id,
        name: filterItem.its2mkd_maminput_pd5s,//小程序报价表
        //size: filterItem.ihkdud1_maminput_lj55,
        price: filterItem.iu71q5n_digitalformat_n6c8,//售价
        //origin: filterItem.iy0zlwf_maminput_q528, //产地
        //date: '',
        relative: filterItem.iz0utpo_maminput_4ubm,
        supply: filterItem.iltbqib_abouttable_inu9, //供应商
        //tag: filterItem.in9pclo_mamcheckbox_woga, //tag: ["靓"]
        count: 0,
        type: 'frozen',
        left: filterItem.ibck4fg_mamselect_6mxf,//idewdc8_mamselect_gajg, //库存情况
        sort1: filterItem.it1thu7_digitalformat_aa16, //一级排序
        sort2: filterItem.i355x4k_digitalformat_tzbm, //二级排序
        category: filterItem.iu0wd65_mamselect_g450,//'上海冻品仓',
        costPrice: filterItem.i3pt7hh_digitalformat_sgk1, //成本单价
        orderRelative:filterItem.ihslco8_maminput_b078,//下单关联 1
        productFx1:filterItem.i114ydh_maminput_esqo,//产品分析1
        productFx2:filterItem.izyn11v_maminput_6x4w,//产品分析2
        productFx3:filterItem.ibeqe8s_maminput_d1aj,//产品分析3
        productFx4:filterItem.irb4gzd_maminput_mr1m,//产品分析4
        productDes:filterItem.iwubvhu_maminput_sqa8,//产品说明
      }
    })
    .filter(item => item.relative && !item.left)
    // 先按sort1排序，sort1相同再按sort2排序
    function mysortFrozen(a, b) {
      if (a.relative !== b.relative) return a.relative < b.relative ? -1 : 1
      else if (a.sort1 !== b.sort1) return a.sort1 < b.sort1 ? -1 : 1
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
        id: filterItem.id,
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

export const postOrderAdd = (params) => {
  const data = {
    //record_id: '7281e3455c46426e8fe01128331457fb',
    iknaezh_abouttable_63je: params.userName,
    imb5rt8_maminput_thkc: params.userPhone,
    i81kjkm_maminput_7jcc: params.userAddress,
    itjsu5x_abouttable_he04: params.userShop,//分店
    iqylscj_maminput_kn30: params.remark, //下单备注
    igl6j4r_digitalformat_jaxn: params.count, //数量
    iher1qq_digitalformat_ccs1: params.price, //单价
    ii8m7a7_userhelp_8kub: uni.getStorageSync('owner'),
    ijrdhjj_mamselect_mbul: params.category, //发货仓
    ijuxm1o_maminput_klor: params.category[0], //发货仓字段
    im5rln3_mamselect_rdxk: ['件'], //todo 单位
    ib9g576_maminput_mu4f: params.id, //下单产品idtodo
    iqdrmjp_abouttable_btrj_ref_id: params.id, //产品id
    iqdrmjp_abouttable_btrj: params.name, //产品,todo
    i1utlm0_date_1d5k: getDayTimeStamp(),
    if38wbt_maminput_kqjd: params.orderRelative + '___' + params.count + '件',//会被搭贝覆盖
    // iuvh8zy_maminput_ogl5: params.name, //下单产品,todo
    // i3rxds2_maminput_5pb7: params.userName, //下单客户信息,todo
    // ilsf0gd_maminput_81r9: params.userAddress, //下单物流信息,todo
    iohkoc6_maminput_vlgy: uni.getStorageSync('userInfo').id, //客户id
    ieraw47_maminput_58gx: params.supply, //供应商
    isg3euh_mamswitch_kwhw: 1, //是否小程序下单
    iz7oy62_mamradio_a5f0: ['未审核'],
    //i2r31la_threelevel_zvag: params.userCity, //城市
    i2r31la_threelevel_zvag_province: getUserInfo().province,
    i2r31la_threelevel_zvag_city: getUserInfo().city,
    i2r31la_threelevel_zvag_town: getUserInfo().town,
    //iji7g3t_mamradio_w55v: ['未发货'], //发货状态todo
    //igbpy0k_digitalformat_2fti: params.costPrice //成本单价todo
    i30aeij_maminput_29f4: params.orderRelative, //下单关联 1
    iqalvik_maminput_plj2: params.productFx1, //产品分析1
    i97w1d6_maminput_4472: params.productFx2, //产品分析2
    in2b0v7_maminput_jwru: params.productFx3, //产品分析3
    i7pp4ry_maminput_ckl1: params.productFx4, //产品分析4
    ikfom8h_maminput_j0g0: params.productDes, //产品说明
    is9nywy_digitalformat_k294: params.costPrice, //成本单价
    idflnjw_digitalformat_qt19: params.price, //填充售价

  }
  return request(
    'POST',
    '/miniprom/recordCreate?form_id=' + '5ccf12cd306347e39359e35a9deb486d',
    data,
    {
      showLoading: true,
      hideToast: false,
      needToken: true,
      errorShow: true
    }
  )
}
//客户信息 new
export const getUserDetail = () => {
  return request(
    'GET',
    '/miniprom/getRecordDetail?form_id=' +
      'ac4975c1950646a880a0a9f297a511c5&record_id=' +
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
      mobile: res.data.iu4bpxu_maminput_jkig,
      addressMobile: res.data.i724tmj_maminput_76x4,
      address: res.data.ixyi1j4_maminput_dhot || res.data.i6t5xj1_maminput_2m4w,
      addressType: res.data.ixyi1j4_maminput_dhot ? 'gz' : 'sh',
      city: res.data.i6c09ko_threelevel_da10,
      owner: res.data.imw6zmq_userhelp_imz2, //责任人
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
    iu4bpxu_maminput_jkig: params.mobile //电话
  }
  if (share) {
    data.imw6zmq_userhelp_imz2 = share
  }
  return request(
    'POST',
    '/miniprom/recordUpdate?form_id=' + 'ac4975c1950646a880a0a9f297a511c5',
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

  return getPostOrderList()
  // const postOrderList = getPostOrderList()
  // const sureOrderList = getSureOrderList()
  // return Promise.all([postOrderList, sureOrderList]).then((values) => {
  //   values[0].forEach((item1) => {
  //     const orderIndex = values[1].findIndex((item2) => item2.orderId === item1.orderId)
  //     if (orderIndex === -1) {
  //       values[1].push(item1)
  //     }
  //   })
  //   return values[1]
  // })
}
/**
 * @function 查询提交订单
 */
export const getPostOrderList = () => {
  const params = {
    filter: {
      iohkoc6_maminput_vlgy: getUserInfo().id, //todo '7a358606f3b64b058a1c0d26a1adc72c'
      //ie11igd_date_hddv: getDayTimeStamp()
    }
  }
  return request(
    'POST',
    '/miniprom/getFormRecord?form_id=5ccf12cd306347e39359e35a9deb486d',
    params
  ).then((res) => {
    return res.data?.map((item) => {
      return {
        id: item.id,
        realPrice: item.ivjfnr6_digitalformat_4qck || 0, //实收金额
        unitPrice: item.iher1qq_digitalformat_ccs1 || '--', //单价
        md: item.iohc61p_digitalformat_8rly, //码单
        name: item.iqdrmjp_abouttable_btrj, //产品名称
        orderId: item.id, //订单id
        isFrom: 'isNotSure',
        orderStatus: item.iz7oy62_mamradio_a5f0 || [""], //订单信息反馈
        status: getOrderStatus(item.i01hba7_mamselect_dc3n),
        //isSure: item.ifqpdfn_abouttable_hldv, //是否排单？todo
        date: formatTime(item.i1utlm0_date_1d5k, 'yyyy-mm-dd'), //下单日期
        number: item.igl6j4r_digitalformat_jaxn || 1, //数量
        unit: item.im5rln3_mamselect_rdxk[0] || '件', //单位
        userShop: item.itjsu5x_abouttable_he04,//分店信息
      }
    })
  })
}
//查询未付款订单
export const getUnOrderList = () => {
  const params = {
    filter: {
      iw60vcm_maminput_4c8y: getUserInfo().id, //todo '7a358606f3b64b058a1c0d26a1adc72c'
      iyeyzxt_mamswitch_psfa: 0 //结清账单
    }
  }
  return request(
    'POST',
    '/miniprom/getFormRecord?form_id=a9e3a3baaf9a4d39b9384150a0929b0c',
    params
  ).then((res) => {
    return res.data?.map((item) => {
      return {
        id: item.id,
        unPrice: item.iudf1d8_digitalformat_yqdn || 0, //剩余贷款
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
    iklkxql_mamradio_plxy: [params.updateType],
    i9y6z6h_maminput_rk1b: params.orderRemark //备注

  }
  return request(
    'POST',
    '/miniprom/recordUpdate?form_id=' + '5ccf12cd306347e39359e35a9deb486d',
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

/**
 * @function 查询业务员信息
 */
export const getOwner = (name, type) => {
  const params = {
    filter: {
      i25c6n5_maminput_f4vd: name
    }
  }
  return request(
    'POST',
    '/miniprom/getFormRecord?form_id=' + '85edd9d8a0954cf3ae6c4ee552a18e0d',
    params
  ).then((res) => {
    const {i25c6n5_maminput_f4vd="佳妮", i9sw2nt_maminput_qw72="13232076543" } = (res.data && res.data[0]) || {}
    if(type == 'fail') {
      uni.showModal({
        title: '提示', // 模态框标题
        content: '登录失败，请联系业务员' + i25c6n5_maminput_f4vd + '，联系方式：' + i9sw2nt_maminput_qw72+'核对账号。', // 模态框内容
        showCancel: false, // 是否显示取消按钮，默认为true
        confirmText: '确定', // 确定按钮的文字
      })
    } else {
      uni.showModal({
        title: '提示', // 模态框标题
        content: '您为首次下单用户，请联系业务员' + i25c6n5_maminput_f4vd + '，联系方式：' + i9sw2nt_maminput_qw72+'维护信息。', // 模态框内容
        showCancel: false, // 是否显示取消按钮，默认为true
        confirmText: '确定', // 确定按钮的文字
      })
    }
    uni.removeStorageSync('token')
    // return res.data?.map((item) => {
    //   return {
    //     id: item.id,
    //     name: item.i25c6n5_maminput_f4vd, //业务员姓名
    //     phone:item.i9sw2nt_maminput_qw72//手机
    //   }
    // })
  })
}



/**
 * @function 查询客户分店
 */
export const getUserShopList = () => {
  const params = {
    filter: {
      irdz4bn_maminput_1xez: getUserInfo().id
    }
  }
  return request(
    'POST',
    '/miniprom/getFormRecord?form_id=' + '21090ef839e349e8b57f7bf69ab3136c',
    params
  ).then((res) => {
    return res.data?.map((item) => {
      return {
        id: item.id,
        shopName:item.io4fgl4_maminput_2dt4,
        name:item.i5z40q7_abouttable_9qtx,
        address:item.i6t5xj1_maminput_2m4w || item.ixyi1j4_maminput_dhot,
        mobile:item.i724tmj_maminput_76x4,
      }
    })
  })
}

//客户需求
export const postCustomerNeedAdd = (params) => {
  const data = {
    iyn56pj_maminput_h7sj: params.content,
    idt58x7_maminput_27pd: params.mobile
  }
  return request(
    'POST',
    '/miniprom/recordCreate?form_id=' + '26f320bdf0964efc8469ee679df6fbf1',
    data,
    {
      showLoading: true,
      hideToast: false,
      needToken: true,
      errorShow: true
    }
  )
}
//商务合作new
export const postBusinessCooperateAdd = (params) => {
  const data = {
    idat8b0_maminput_n8ys: params.content,
    iirj91t_maminput_n9gh: params.mobile
  }
  return request(
    'POST',
    '/miniprom/recordCreate?form_id=' + '8b9d7419e336493193b6ff909b22ea5f',
    data,
    {
      showLoading: true,
      hideToast: false,
      needToken: true,
      errorShow: true
    }
  )
}
//投诉建议new
export const postMySuggestionAdd = (params) => {
  const data = {
    i2vp1r3_maminput_e6kb: params.content,
    io1dir9_maminput_3npx: params.mobile
  }
  return request(
    'POST',
    '/miniprom/recordCreate?form_id=' + '8996606bc18d422e89d27b9a0c00766e',
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
