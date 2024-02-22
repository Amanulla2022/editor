import React, { useEffect, useState } from "react";
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  RichUtils,
  Modifier, // Add this import
} from "draft-js";
import "draft-js/dist/Draft.css";
import "./MyEditor.css";

// ... (other imports and code)

const MyEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    // Load content from local storage on component mount
    const savedContent = localStorage.getItem("editorContent");

    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      return EditorState.createWithContent(contentState);
    }

    return EditorState.createEmpty();
  });

  useEffect(() => {
    // Save content to local storage whenever editorState changes
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(rawContentState));
  }, [editorState]);

  const handleKeyCommand = (command, currentEditorState) => {
    // Custom handling of special commands
    let newEditorState = currentEditorState;
    if (command === "header") {
      setEditorState(
        RichUtils.toggleBlockType(currentEditorState, "header-one")
      );
    } else if (command === "bold") {
      setEditorState(RichUtils.toggleInlineStyle(currentEditorState, "BOLD"));
    } else if (command === "redLine") {
      setEditorState(
        RichUtils.toggleInlineStyle(currentEditorState, "RED_LINE")
      );
    } else if (command === "underline") {
      setEditorState(
        RichUtils.toggleInlineStyle(currentEditorState, "UNDERLINE")
      );
    }
    if (newEditorState !== currentEditorState) {
      setEditorState(newEditorState);
      return "handled";
    }
    return "not-handled";
  };

  const handleBeforeInput = (chars, currentEditorState) => {
    // Custom handling of special characters
    if (chars === "#") {
      setEditorState(handleKeyCommand("header", currentEditorState));
      return "handled";
    } else if (chars === "*") {
      setEditorState(handleKeyCommand("bold", currentEditorState));
      return "handled";
    }
    return "not-handled";
  };

  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const saveContent = () => {
    // Save content to local storage on button click
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(rawContentState));
  };

  return (
    <div className="editor-container">
      <div className="header">
        <h1 className="title">This is a simple editor</h1>
        <button onClick={saveContent}>Save</button>
      </div>
      <div className="Editor">
        <Editor
          editorState={editorState}
          onChange={onChange}
          handleKeyCommand={handleKeyCommand}
          handleBeforeInput={handleBeforeInput}
        />
      </div>
    </div>
  );
};

export default MyEditor;
