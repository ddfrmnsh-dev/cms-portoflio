import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const TinyEditor = ({
  onEditorInit,
  value = "",
  onChange,
  height = 500,
  licenseKey,
  plugins = [
    "advlist",
    "autolink",
    "lists",
    "link",
    "image",
    "charmap",
    "anchor",
    "searchreplace",
    "visualblocks",
    "code",
    "fullscreen",
    "insertdatetime",
    "media",
    "table",
    "preview",
    "help",
    "wordcount",
  ],
  toolbar = `undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help`,
}) => {
  const handleEditorChange = (content) => {
    if (onChange) {
      onChange(content); // Panggil `onChange` untuk sinkronisasi dengan Form
    }
  };
  const handleFilePicker = (cb, value, meta) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.addEventListener("change", (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const id = "blobid" + new Date().getTime();
        const blobCache = tinymce.activeEditor.editorUpload.blobCache;
        const base64 = reader.result.split(",")[1];
        const blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);
        cb(blobInfo.blobUri(), { title: file.name });
      });
      reader.readAsDataURL(file);
    });

    input.click();
  };

  return (
    <Editor
      onInit={(evt, editor) => onEditorInit?.(editor)}
      tinymceScriptSrc="/src/tinymce/tinymce.min.js"
      licenseKey={licenseKey}
      //   initialValue={value}
      value={value}
      init={{
        skin: "oxide-dark",
        content_css: "dark",
        height,
        menubar: true,
        plugins,
        toolbar,
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        powerpaste_autolink_urls: false,
        automatic_uploads: true,
        file_picker_types: "file image media",
        image_title: true,
        file_picker_callback: handleFilePicker,
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default TinyEditor;
