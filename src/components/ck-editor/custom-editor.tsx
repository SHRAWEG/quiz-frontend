'use client'

import { useState, useEffect, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  Autosave,
  Base64UploadAdapter,
  ClassicEditor,
  Code,
  CodeBlock,
  Essentials,
  HorizontalLine,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsertViaUrl,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  LinkImage,
  List,
  Paragraph,
  PlainTableOutput,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableToolbar,
  TextTransformation,
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

interface CustomEditorProps {
  value?: string;
  onChange: (data: string) => void;
}

export default function CustomEditor({ value, onChange }: CustomEditorProps) {
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  // useEffect(() => {
  //   // ⚠️ IMPORTANT: This import MUST be inside useEffect or another function.
  //   import('dompurify').then((DOMPurify) => {
  //     setSanitizedContent(DOMPurify.default.sanitize(value));
  //   });
  // }, [value]);

  const { editorConfig } = useMemo(() => {
    if (!isLayoutReady) {
      return {};
    }
    return {
      editorConfig: {
        toolbar: {
          items: [
            'undo',
            'redo',
            '|',
            'bold',
            'italic',
            'underline',
            'subscript',
            'superscript',
            'code',
            '|',
            'horizontalLine',
            'link',
            'insertTable',
            'codeBlock',
            '|',
            'bulletedList',
            'numberedList',
            'outdent',
            'indent'
          ],
          shouldNotGroupWhenFull: false
        },
        plugins: [
          Autosave,
          Base64UploadAdapter,
          Code,
          CodeBlock,
          Essentials,
          HorizontalLine,
          ImageBlock,
          ImageCaption,
          ImageInline,
          ImageInsertViaUrl,
          ImageStyle,
          ImageTextAlternative,
          ImageToolbar,
          ImageUpload,
          Indent,
          IndentBlock,
          LinkImage,
          List,
          Paragraph,
          PlainTableOutput,
          Subscript,
          Superscript,
          Table,
          TableCaption,
          TableToolbar,
          TextTransformation,
        ],
        image: {
          toolbar: ['toggleImageCaption', 'imageTextAlternative', '|', 'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText']
        },
        initialData: '',
        licenseKey: 'GPL',
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: 'https://',
          decorators: {
            toggleDownloadable: {
              mode: 'manual',
              label: 'Downloadable',
              attributes: {
                download: 'file'
              }
            }
          }
        },
        placeholder: 'Type or paste your questions here!',
        table: {
          contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
        },
      }
    };
  }, [isLayoutReady]);

  return (
    <div className='w-full'>
      {
        editorConfig &&
        <CKEditor
          editor={ClassicEditor}
          config={editorConfig as any}
          data={value}
          onChange={(event, editor) => onChange(editor.getData())}
        />
      }
    </div>
  );
}
