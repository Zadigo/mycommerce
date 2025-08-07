import { cva, type VariantProps } from 'class-variance-authority'

export { default as Footer } from './Footer.vue'
export { default as FooterContent } from './FooterContent.vue'
export { default as FooterSection } from './FooterSection.vue'
export { default as FooterSectionLink } from './FooterSectionLink.vue'
export { default as FooterSocials } from './FooterSocials.vue'

export const footerVariants = cva(
  'relative w-full md-5 md:mt-10 border-t-1 border-gray-50',
  {
    variants: {
      variant: {
        default: 'bg-blue-400 text-white',
        light: 'bg-gray-100',
        dark: 'bg-black'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export type FooterVariants = VariantProps<typeof footerVariants>
