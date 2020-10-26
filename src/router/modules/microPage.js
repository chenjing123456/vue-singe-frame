import Layout from '@/layout'

const microPage = {
  path: '/microPage',
  component: Layout,
  meta: {
    title: '子应用',
    icon: 'permission'
  },
  children: [
    {
      path: '/microPage/iframe',
      component: () => import('@/views/microPage/iframe'),
      meta: {
        title: '子应用',
        icon: 'permission'
      }
    }
  ]
}

export default microPage
