'use client'

import dynamic from 'next/dynamic';

interface EditorPreviewProps {
  className: string
  data: string;
}

const EditorPreview = dynamic(() => import('@/components/ck-editor/editor-preview'), {
  ssr: false,
  loading: () => <p>Loading Preview...</p>
});


export default function EditorPreviewLoader({ className, data }: EditorPreviewProps) {
  return (
    <EditorPreview data={data} className={className} />
  )
}