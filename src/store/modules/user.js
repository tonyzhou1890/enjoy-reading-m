import { logout, getInfo, loginScore } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router from '@/router'
import { AccountRoles } from '@/utils/setting'
import Vue from 'vue'

const state = {
  token: getToken(),
  userInfo: null,
  hasLoginScore: false
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, data) => {
    state.userInfo = data
  },
  SET_DATA: (state, data) => {
    state[data.key] = data.value
  }
}

const actions = {
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        console.log(response)

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { role } = data

        Object.keys(AccountRoles).map(key => {
          if (AccountRoles[key].value === role) {
            data.roleStr = key
          }
        })

        commit('SET_USER_INFO', data)

        // 获取用户信息后，获取登录奖励
        if (!state.hasLoginScore) {
          loginScore()
            .then(res => {
              Vue.$vux.text(res.data)
              commit('SET_DATA', {
                key: 'hasLoginScore',
                value: true
              })
            })
            .catch(e => {
              if (e.errorMsg.includes('今天已经')) {
                commit('SET_DATA', {
                  key: 'hasLoginScore',
                  value: true
                })
              }
              console.log(e)
            })
        }

        // 用户信息返回
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        window.location.href = '/'
        commit('SET_USER_INFO', null)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
