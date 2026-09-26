/** Extrai uma mensagem legível de qualquer erro lançado pela API. */
export function errorText(err: unknown): string {
  return err instanceof Error ? err.message : 'Algo deu errado. Tente novamente.'
}
