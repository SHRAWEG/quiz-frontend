'use client'

import dynamic from 'next/dynamic';

interface CustomEditorProps {
  value?: string;
  onChange: (data: string) => void;
}

// This function dynamically imports your EditorComponent
// and strictly disables Server Side Rendering (ssr: false)
const CustomEditor = dynamic(() => import('@/components/ck-editor/custom-editor'), {
  ssr: false,
  loading: () => <p>Loading Editor...</p>
});

export default function CustomEditorLoader({ value, onChange }: CustomEditorProps) {
  return (
    <div className="w-full">
      <CustomEditor value={value} onChange={onChange} />
    </div>
  );
}