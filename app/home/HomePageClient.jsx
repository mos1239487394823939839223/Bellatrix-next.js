'use client'
import Layout from '../../src/components/Layout'
import DynamicPageRenderer from '../../src/components/DynamicPageRenderer/index'

export default function HomePageClient() {
  return (
    <Layout>
      <DynamicPageRenderer />
    </Layout>
  )
}
