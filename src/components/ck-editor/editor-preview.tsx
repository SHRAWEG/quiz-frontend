'use client'

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

// ⚠️ REMOVE THIS LINE:
// import DOMPurify from "isomorphic-dompurify"; 
// Instead, we will import it dynamically inside useEffect.

interface CkEditorpreviewProps {
  data: string;
  className?: string;
}

const EditorPreview = ({ data, className }: CkEditorpreviewProps) => {
  // State to hold the sanitized HTML once DOMPurify is loaded
  const [sanitizedHtml, setSanitizedHtml] = useState(data);

  useEffect(() => {
    // 1. Use dynamic import() which only executes when the browser runs this code.
    // We also switch to the standard 'dompurify' package, as the 'isomorphic' 
    // version is what aggressively loads 'jsdom'.
    import('dompurify').then((DOMPurifyModule) => {
      const DOMPurify = DOMPurifyModule.default;

      const cleanHtml = DOMPurify.sanitize(data, {
        ADD_TAGS: ["iframe"],
        ADD_ATTR: ["target"],
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|xxx|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      });

      setSanitizedHtml(cleanHtml);
    });
  }, [data]); // Re-sanitize whenever the 'data' prop changes

  return (
    <div className={cn(
      "ck-content",
      className
    )}>
      <div
        // Use the state variable for the sanitized content
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
      <style jsx global>

        {
          `
            /* 1. Fix the Font */
            .ck-content {
              font-family: var(--font-geist-sans);
              line-height: 1.6;
              color: #333;
            }

            /* 2. CRITICAL: Override Tailwind's default image behavior */
            .ck-content img {
              display: inline-block; 
              vertical-align: bottom; 
              margin: 0 4px; 
            }

            /* 3. Handle CKEditor specific "Inline Image" wrappers */
            .ck-content .image-inline {
              display: inline-flex;
              vertical-align: middle;
              margin: 0 4px;
            }

            /* 4. Handle "Block Images" */
            .ck-content figure.image {
              display: table; 
              margin: 1rem auto; 
              clear: both;
            }
            
            /* 5. Fix Table Borders */
            .ck-content table {
              border-collapse: collapse;
              width: 100%;
            }
            .ck-content td, .ck-content th {
              border: 1px solid #ddd;
              padding: 8px;
            }
          `
        }
      </style>
    </div>)
}

export default EditorPreview;