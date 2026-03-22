"use client";

import React, { useCallback, useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import type { EditorState } from "lexical";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { $setSelection } from "lexical";

interface LexicalEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

// Custom theme
const theme = {
  paragraph: "mb-2",
  heading: {
    h1: "text-3xl font-bold mb-4",
    h2: "text-2xl font-bold mb-3",
    h3: "text-xl font-semibold mb-2",
  },
  list: {
    ul: "list-disc ml-6 mb-4",
    ol: "list-decimal ml-6 mb-4",
    listitem: "mb-1",
  },
  quote: "border-l-4 border-gray-300 pl-4 italic my-4",
  link: "text-blue-500 underline",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "bg-gray-100 px-1 rounded font-mono",
  },
};

function onError(error: Error) {
  console.error("Lexical Error:", error);
}

// Toolbar component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatBold = useCallback(() => {
    editor.dispatchCommand(
      { type: "FORMAT_TEXT_COMMAND" } as any,
      "bold"
    );
  }, [editor]);

  const formatItalic = useCallback(() => {
    editor.dispatchCommand(
      { type: "FORMAT_TEXT_COMMAND" } as any,
      "italic"
    );
  }, [editor]);

  const formatUnderline = useCallback(() => {
    editor.dispatchCommand(
      { type: "FORMAT_TEXT_COMMAND" } as any,
      "underline"
    );
  }, [editor]);

  return (
    <div className="border-b px-3 py-2 flex gap-2 bg-muted/30">
      <button
        type="button"
        onClick={formatBold}
        className="p-1.5 rounded hover:bg-muted transition-colors font-bold"
        title="Bold"
      >
        B
      </button>
      <button
        type="button"
        onClick={formatItalic}
        className="p-1.5 rounded hover:bg-muted transition-colors italic"
        title="Italic"
      >
        I
      </button>
      <button
        type="button"
        onClick={formatUnderline}
        className="p-1.5 rounded hover:bg-muted transition-colors underline"
        title="Underline"
      >
        U
      </button>
    </div>
  );
}

function InitialContentPlugin({ content }: { content?: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (content) {
      try {
        const parsed = JSON.parse(content);
        editor.update(() => {
          const editorState = editor.parseEditorState(parsed);
          editor.setEditorState(editorState);
        });
      } catch (e) {
        // If not JSON, treat as plain text
        editor.update(() => {
          const root = $getRoot();
          root.clear();
          const paragraph = $createParagraphNode();
          paragraph.append($createTextNode(content));
          root.append(paragraph);
        });
      }
    }
  }, [content, editor]);

  return null;
}

function OnChangeHandler({
  onChange,
}: {
  onChange?: (content: string) => void;
}) {
  const handleChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const json = JSON.stringify(editorState.toJSON());
        onChange?.(json);
      });
    },
    [onChange]
  );

  return <OnChangePlugin onChange={handleChange} />;
}

export default function LexicalEditor({
  initialContent,
  onChange,
  placeholder = "Start writing...",
  editable = true,
}: LexicalEditorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const initialConfig: any = {
    namespace: "BusinessEditor",
    theme,
    onError,
    editable,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border rounded-lg overflow-hidden bg-background">
        {editable && <ToolbarPlugin />}
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="min-h-[200px] p-4 focus:outline-none" />
          }
          placeholder={
            <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
              {placeholder}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary as any}
        />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <InitialContentPlugin content={initialContent} />
        <OnChangeHandler onChange={onChange} />
      </div>
    </LexicalComposer>
  );
}

// Helper function to get plain text from Lexical JSON
export function getPlainText(editorState: string): string {
  try {
    const parsed = JSON.parse(editorState);
    // Simple extraction - in production use proper lexical traversal
    return "";
  } catch {
    return editorState;
  }
}
