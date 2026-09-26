/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL da API, ex.: https://api.treifit.com.br (vazio = mesmo domínio / proxy do Vite). */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
