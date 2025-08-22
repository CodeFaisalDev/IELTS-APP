"use client";

import React, { useEffect, useRef, useState } from "react";

// Custom upload adapter for handling images
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            // Convert file to base64 and resolve
            resolve({
              default: reader.result, // base64 data URL
            });
          };

          reader.onerror = () => {
            reject(new Error("Failed to read file"));
          };

          // Read file as data URL (base64)
          reader.readAsDataURL(file);
        })
    );
  }

  abort() {
    // Cleanup if needed
  }
}

// Plugin to integrate the upload adapter
function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

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
    return (
      <div className="p-4 bg-gray-100 rounded animate-pulse">
        Loading Editor...
      </div>
    );
  }

  const { CKEditor, ClassicEditor } = editorRef.current;

  const editorConfiguration = {
    extraPlugins: [MyCustomUploadAdapterPlugin],
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "bulletedList",
        "numberedList",
        "|",
        "outdent",
        "indent",
        "|",
        "imageUpload",
        "blockQuote",
        "insertTable",
        "mediaEmbed",
        "|",
        "undo",
        "redo",
        "|",
        "link",
        "alignment",
        "|",
        "fontSize",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "removeFormat",
      ],
      shouldNotGroupWhenFull: true,
    },
    language: "en",
    image: {
      toolbar: [
        "imageTextAlternative",
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "toggleImageCaption",
        "imageResize",
      ],
      resizeOptions: [
        {
          name: "imageResize:original",
          label: "Original",
          value: null,
        },
        {
          name: "imageResize:50",
          label: "50%",
          value: "50",
        },
        {
          name: "imageResize:75",
          label: "75%",
          value: "75",
        },
      ],
    },
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableCellProperties",
        "tableProperties",
      ],
    },
    // Increase the height of the editor
    height: "400px",
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <CKEditor
        editor={ClassicEditor}
        config={editorConfiguration}
        data={value || ""}
        onReady={(editor) => {
          // Set custom height
          editor.editing.view.change((writer) => {
            writer.setStyle(
              "min-height",
              "300px",
              editor.editing.view.document.getRoot()
            );
          });
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        onBlur={(event, editor) => {
          // Optional: Handle blur event
        }}
        onFocus={(event, editor) => {
          // Optional: Handle focus event
        }}
      />
    </div>
  );
}
