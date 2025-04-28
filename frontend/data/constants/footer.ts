export const socialPlatforms = [
  'Facebook',
  'Twitter',
  'Instagram',
  'YouTube',
  'Snapchat',
  'WhatsApp'
] as const

export type DefaultSocialPlatforms = (typeof socialPlatforms)[number] | (string & {})

export interface DefaultSocialLinks {
  name: DefaultSocialPlatforms,
  url: string
  icon: string
}

export const socialLinks: DefaultSocialLinks[] = [
  {
    name: "Facebook",
    url: "#",
    icon: "facebook-f"
  },
  {
    name: "Facebook",
    url: "#",
    icon: "instagram"
  },
  {
    name: "Facebook",
    url: "#",
    icon: "twitter"
  }
]

export interface FooterSection {
  name: string
  links: {
    name: string
    to: string
  }[]
}

export interface FooterLinks {
  socials: {
    name: string
    url: string
    icon: string | null
  }[],
  sections: FooterSection[]
}

export const footerLinks: FooterLinks = {
  socials: socialLinks,
  sections: [
    {
      name: 'Aide',
      links: [
        {
          "to": "/",
          "name": "Acheter en ligne"
        },
        {
          "to": "/guide#payment",
          "name": "Paiement"
        },
        {
          "to": "/guide#delivery",
          "name": "Livraison"
        },
        {
          "to": "/guide#retour-magasin",
          "name": "Retour"
        },
        {
          "to": "/guide",
          "name": "Guide"
        },
        {
          "to": "/guide#invitee",
          "name": "Achat en tant qu'invité"
        },
        {
          "to": "/guide#unsubscribe",
          "name": "Me désabonner"
        },
        {
          "to": "/complete-size-guide",
          "name": "Guide des tailles"
        }
      ]
    },
    {
      "name": "Collections",
      "links": [
        {
          "to": "/shop/collection/skirts",
          "name": "Robes"
        },
        {
          "to": "/shop/collection/tops",
          "name": "Tops"
        },
        {
          "to": "/shop/collection/shirts",
          "name": "Chemises"
        },
        {
          "to": "/shop/collection/pants",
          "name": "Pantalons"
        },
        {
          "to": "/shop/collection/novelties",
          "name": "Nouveautés"
        },
        {
          "to": "/shop/collection/sales",
          "name": "Soldes"
        }
      ]
    },
    {
      name: 'Informations légales',
      links: [
        {
          name: 'Offres promotionnelles',
          to: '/'
        },
        {
          name: 'Mentions légales',
          to: '/mentions-legales'
        },
        {
          name: 'Conditions générales',
          to: '/conditions-generales'
        },
        {
          name: 'Charte de confidentialité',
          to: '/confidentialite'
        }
      ]
    }
  ]
}
