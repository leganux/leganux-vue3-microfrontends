<script setup lang="ts">
import {
  ClassicEditor,
  AccessibilityHelp,
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  BlockToolbar,
  Bold,
  Code,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  FullPage,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  HtmlComment,
  HtmlEmbed,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Markdown,
  MediaEmbed,
  PageBreak,
  Paragraph,
  PasteFromMarkdownExperimental,
  PasteFromOffice,
  RemoveFormat,
  SelectAll,
  SimpleUploadAdapter,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Style,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
} from 'ckeditor5'

import translations from 'ckeditor5/translations/es.js'
import 'ckeditor5/ckeditor5.css'

import {
  ref,
  onMounted,
  defineProps,
  watch,
  defineEmits,

} from 'vue'

const props = defineProps({
  defaultTextStart: {type: String, required: false},
  modelValue: {
    type: String,
    required: false,
  },
})

const editor = ClassicEditor
const isLayoutReady = ref(false)
const config = ref(null)
const emit = defineEmits(['update:modelValue'])
const localContent = ref(props.modelValue || '<h2>Welcome</h2>')

onMounted(() => {
  config.value = {
    toolbar: {
      items: [
        'undo',
        'redo',
        '|',
        'sourceEditing',
        'findAndReplace',
        '|',
        'heading',
        'style',
        '|',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'subscript',
        'superscript',
        'code',
        'removeFormat',
        '|',
        'specialCharacters',
        'horizontalLine',
        'pageBreak',
        'link',
        'insertImage',
        'insertImageViaUrl',
        'mediaEmbed',
        'insertTable',
        'highlight',
        'blockQuote',
        'htmlEmbed',
        '|',
        'alignment',
        '|',
        'bulletedList',
        'numberedList',
        'todoList',
        'outdent',
        'indent',
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      AccessibilityHelp,
      Alignment,
      Autoformat,
      AutoImage,
      AutoLink,
      Autosave,
      BalloonToolbar,
      BlockQuote,
      BlockToolbar,
      Bold,
      Code,
      Essentials,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      FullPage,
      GeneralHtmlSupport,
      Heading,
      Highlight,
      HorizontalLine,
      HtmlComment,
      HtmlEmbed,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      Markdown,
      MediaEmbed,
      PageBreak,
      Paragraph,
      PasteFromMarkdownExperimental,
      PasteFromOffice,
      RemoveFormat,
      SelectAll,
      SimpleUploadAdapter,
      SourceEditing,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Style,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline,
      Undo,
    ],
    simpleUpload: {
      uploadUrl: 'https://example.com/upload', // Cambia esta URL a la del servidor que procesará la imagen
      headers: {
        Authorization: 'Bearer <tu-token-de-autenticación>', // Si necesitas autorización, añade el token
      },
    },
    balloonToolbar: [
      'bold',
      'italic',
      '|',
      'link',
      'insertImage',
      '|',
      'bulletedList',
      'numberedList',
    ],
    blockToolbar: [
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'bold',
      'italic',
      '|',
      'link',
      'insertImage',
      'insertTable',
      '|',
      'bulletedList',
      'numberedList',
      'outdent',
      'indent',
    ],
    fontFamily: {supportAllValues: true},
    fontSize: {
      options: [10, 12, 14, 'default', 18, 20, 22],
      supportAllValues: true,
    },
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph',
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1',
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2',
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3',
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4',
        },
        {
          model: 'heading5',
          view: 'h5',
          title: 'Heading 5',
          class: 'ck-heading_heading5',
        },
        {
          model: 'heading6',
          view: 'h6',
          title: 'Heading 6',
          class: 'ck-heading_heading6',
        },
      ],
    },
    htmlSupport: {
      allow: [{name: /^.*$/, styles: true, attributes: true, classes: true}],
    },
    image: {
      toolbar: [
        'toggleImageCaption',
        'imageTextAlternative',
        '|',
        'imageStyle:inline',
        'imageStyle:wrapText',
        'imageStyle:breakText',
        '|',
        'resizeImage',
      ],
    },
    initialData: props.defaultTextStart || 'Welcome',
    language: 'es',
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://',
      decorators: {
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {download: 'file'},
        },
      },
    },
    list: {properties: {styles: true, startIndex: true, reversed: true}},
    menuBar: {isVisible: true},
    placeholder: 'Type or paste your content here!',
    style: {
      definitions: [
        {name: 'Article category', element: 'h3', classes: ['category']},
        {name: 'Title', element: 'h2', classes: ['document-title']},
        {name: 'Subtitle', element: 'h3', classes: ['document-subtitle']},
        {name: 'Info box', element: 'p', classes: ['info-box']},
        {name: 'Side quote', element: 'blockquote', classes: ['side-quote']},
        {name: 'Marker', element: 'span', classes: ['marker']},
        {name: 'Spoiler', element: 'span', classes: ['spoiler']},
        {
          name: 'Code (dark)',
          element: 'pre',
          classes: ['fancy-code', 'fancy-code-dark'],
        },
        {
          name: 'Code (bright)',
          element: 'pre',
          classes: ['fancy-code', 'fancy-code-bright'],
        },
      ],
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableProperties',
        'tableCellProperties',
      ],
    },
    translations: [translations],
  }
  isLayoutReady.value = true
})

watch(localContent, newValue => {
  emit('update:modelValue', newValue)
})

watch(
  () => props.modelValue,
  newValue => {
    localContent.value = newValue || ''
  },
)
</script>

<template>
  <div>
    <div class="main-container">
      <div
        class="editor-container editor-container_classic-editor editor-container_include-style editor-container_include-block-toolbar"
        ref="editorContainerElement"
      >
        <div class="editor-container__editor">
          <div ref="editorElement">
            <ckeditor
              v-if="isLayoutReady"
              v-model="localContent"
              :editor="editor"
              :config="config"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>