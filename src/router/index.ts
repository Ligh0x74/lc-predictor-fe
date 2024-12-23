import { createRouter, createWebHistory } from 'vue-router'
import ContestInfo from '@/components/info/ContestInfo.vue'
import PredictInfo from '@/components/info/PredictInfo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/contest',
    },
    {
      path: '/contest/:_pageIndex?',
      component: ContestInfo,
      props: true,
    },
    {
      path: '/predict/:_contestName/:_pageIndex?',
      component: PredictInfo,
      props: true,
    },
  ],
})

export default router
