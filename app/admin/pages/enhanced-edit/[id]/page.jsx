'use client'
import { use } from "react";
import EnhancedPageBuilder from '../../../../../src/components/Admin/EnhancedPageBuilder'

export default function EnhancedEditPage({ params }) {
  const { id } = use(params);
  return <EnhancedPageBuilder pageId={id} />
}
