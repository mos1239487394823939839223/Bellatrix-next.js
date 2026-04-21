'use client'
import Layout from '../../src/components/Layout'
import DynamicPageRenderer from '../../src/components/DynamicPageRenderer/index'

export default function HomePageClient({ initialCategories = [], initialData = null }) {
  return (
    <Layout initialCategories={initialCategories}>
      <DynamicPageRenderer slug="home" initialData={initialData} />
    </Layout>
  )
}
