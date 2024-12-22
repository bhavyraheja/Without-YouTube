"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill stylesheet

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false }); // Import ReactQuill dynamically for Next.js

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <ReactQuill value={value} onChange={onChange} />
    </div>
  );
};

export default Editor;