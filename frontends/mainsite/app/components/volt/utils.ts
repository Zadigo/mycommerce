import { twMerge } from 'tailwind-merge'
import { mergeProps } from 'vue'

export const ptViewMerge = (globalPTProps = {} as Record<string, string>, selfPTProps = {} as Record<string, string>, datasets: Record<string, string>) => {
  const { class: globalClass, ...globalRest } = globalPTProps
  const { class: selfClass, ...selfRest } = selfPTProps

  return mergeProps({ class: twMerge(globalClass, selfClass) }, globalRest, selfRest, datasets)
}
