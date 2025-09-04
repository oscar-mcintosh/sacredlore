<template>
  <div class="editor-wrapper">
    <!-- Editor Menu -->
    <div v-if="editor" class="editor-menu">
      <button
        class="menu-button"
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        <i class="ri-bold"></i>
      </button>

      <button
        class="menu-button"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        <i class="ri-italic"></i>
      </button>

      <button
        class="menu-button"
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
      >
        <i class="ri-strikethrough"></i>
      </button>

      <div class="menu-separator"></div>

      <button
        class="menu-button"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      >
        <i class="ri-h-1"></i>
      </button>

      <button
        class="menu-button"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      >
        <i class="ri-h-2"></i>
      </button>

      <div class="menu-separator"></div>

      <button
        class="menu-button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
      >
        <i class="ri-list-unordered"></i>
      </button>

      <button
        class="menu-button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
      >
        <i class="ri-list-ordered"></i>
      </button>

      <button
        class="menu-button"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
      >
        <i class="ri-double-quotes-l"></i>
      </button>

      <div class="menu-separator"></div>

      <button
        class="menu-button"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()"
      >
        <i class="ri-arrow-go-back-line"></i>
      </button>

      <button
        class="menu-button"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()"
      >
        <i class="ri-arrow-go-forward-line"></i>
      </button>
    </div>

    <!-- Editor Content -->
    <div class="editor-content tiptap">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<script setup>
import { useEditor } from '@tiptap/vue-3'
import { EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { onBeforeUnmount, unref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit],
  autofocus: true,
  onUpdate: () => {
    // Emit HTML content when editor updates
    if (editor.value) {
      const html = editor.value.getHTML();
      console.log('TiptapEditor: Content updated, emitting:', html);
      emit('update:modelValue', html);
    }
  }
})

// Watch for external changes to modelValue and update editor content
watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    console.log('TiptapEditor: External content change detected:', newValue);
    editor.value.commands.setContent(newValue, false);
  }
}, { immediate: true })

// Watch for editor changes and sync with form
watch(editor, (newEditor) => {
  if (newEditor) {
    console.log('TiptapEditor: Editor initialized, setting content:', props.modelValue);
    newEditor.commands.setContent(props.modelValue || '', false);
  }
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style>
.editor-wrapper {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.editor-menu {
  display: flex;
  flex-wrap: wrap;
  padding: 0.5rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--body-color);
}

.menu-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0.25rem;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s;
}

.menu-button:hover {
  background: var(--border-color);
}

.menu-button.is-active {
  color: var(--header-color);
  background: var(--border-color);
}

.menu-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.menu-separator {
  width: 1px;
  margin: 0 0.5rem;
  background: var(--border-color);
}

.editor-content {
  padding: 1rem;
  min-height: 200px;
}

.editor-content :deep(.ProseMirror) {
  /* outline: none; */
  min-height: 200px;
  cursor: text;
  caret-color: var(--text-color);
}

.editor-content :deep(.ProseMirror-focused) {
  outline: none;
}

.editor-content :deep(.ProseMirror) > *:first-child {
  margin-top: 0;
}

@keyframes ProseMirror-cursor-blink {
  to {
    visibility: hidden;
  }
}

.editor-content :deep(.ProseMirror-focused .ProseMirror-gapcursor:after) {
  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
}

.editor-content :deep(.ProseMirror p) {
  margin: 1em 0;
}

.editor-content :deep(.ProseMirror h1) {
  font-size: 2em;
  margin: 1em 0;
}

.editor-content :deep(.ProseMirror h2) {
  font-size: 1.5em;
  margin: 1em 0;
}

.editor-content :deep(.ProseMirror blockquote) {
  border-left: 3px solid var(--border-color);
  padding-left: 1em;
  margin: 1em 0;
}

.editor-content :deep(.ProseMirror ul),
.editor-content :deep(.ProseMirror ol) {
  padding-left: 1.5em;
  margin: 1em 0;
}
</style>
  
