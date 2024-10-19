import { documentationSection } from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const global = {
  name: 'Bakstag',
  headline: 'P2P DEX',
  description: 'Omnichain OTC Market.',
  path: '',
  isFallbackProduct: true,
  icon: <Logo />,
  github: 'https://github.com/bakstag-finance',
  className: 'accent-sky',
  heroes: [{ path: '/', component: Hero }],
  sections: [
    {
      ...documentationSection(''),
      navigation: [
        {
          title: 'Overview',
          links: [
            { title: 'Introduction', href: '/' },
            { title: 'Getting started', href: '/getting-started' },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Offer',
              href: '/offer',
            },
            {
              title: 'Create Offer',
              href: '/create-offer',
            },
            {
              title: 'Accept Offer',
              href: '/accept-offer',
            },
            {
              title: 'Cancel Offer',
              href: '/accept-offer',
            },
          ],
        },
        {
          title: 'Technical Reference',
          links: [
            {
              title: 'Core Settings',
              href: '/settings',
            },
            {
              title: 'Token Precision',
              href: '/token-precision',
            },
            {
              title: 'Protocol Fee',
              href: '/fee',
            },
            {
              title: 'Transaction Pricing',
              href: '/tx-pricing',
            },
            {
              title: 'Transaction Time',
              href: '/tx-time',
            },
            {
              title: 'Limitations',
              href: '/limitations',
            },
            {
              title: 'Supported Chains',
              href: '/deployed-contracts',
            },
          ],
        },
        {
          title: 'Next steps',
          links: [
            { title: 'Next steps', href: '/next-steps' },
          ],
        },
        {
          title: 'Community',
          links: [
            { title: 'Contact Us', href: '/contact' },
          ],
        },
      ],
    },
  ],
}