/// <reference types="vite/client" />
/// <reference types="jquery" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Declare modules
declare module 'bootstrap/dist/js/bootstrap.bundle.min.js'
declare module 'jquery/dist/jquery.min.js'
declare module 'fomantic-ui/dist/semantic.min.js'

// Extend Window interface
declare global {
  interface Window {
    bootstrap: any
    jQuery: JQueryStatic
    $: JQueryStatic
  }
}

// Extend ImportMeta
interface ImportMetaEnv {
  readonly VITE_UI_FRAMEWORK: 'bootstrap' | 'fomantic'
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
