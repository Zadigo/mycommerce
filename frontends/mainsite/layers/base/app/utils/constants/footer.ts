export interface FooterSection {
  name: string
  links: {
    name: string
    to: string
  }[]
}

export interface FooterLinks {
  sections: FooterSection[]
}

export const footerLinks: FooterLinks = {
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
