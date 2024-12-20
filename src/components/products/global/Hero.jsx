import { Hero as BaseHero } from '@/components/Hero'

export function Hero({ page }) {
  return (
    <BaseHero
      page={page}
      title="Bakstag"
      primaryCta={{ title: 'Exchange', href: 'https://bakstag-frontend.vercel.app/' }}
      light2Off
      light3Off
    >
    </BaseHero>
  )
}
