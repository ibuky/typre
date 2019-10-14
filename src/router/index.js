import Vue from 'vue'
import Router from 'vue-router'
import 'bulma/css/bulma.css'

import Home from '@/components/Home'
import Type from '@/components/Type'
import Result from '@/components/Result'
import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Type',
      name: 'Type',
      component: Type
    },
    {
      path: '/Result',
      name: 'Result',
      component: Result
    },
    {
      path: '/Test',
      name: 'Test',
      component: Test
    }
  ]
})
