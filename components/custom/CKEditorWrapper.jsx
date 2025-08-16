"use client";

import React, { useEffect, useRef, useState } from "react";

export default function CKEditorWrapper({ value, onChange }) {
  const editorRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const { CKEditor } = require("@ckeditor/ckeditor5-react");
    const ClassicEditor = require("@ckeditor/ckeditor5-build-classic");

    editorRef.current = {
      CKEditor,
      ClassicEditor,
    };

    setLoaded(true);
  }, []);

  if (!loaded || !editorRef.current) {
    return <div>Loading Editor...</div>;
  }

  const { CKEditor, ClassicEditor } = editorRef.current;

  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
}
