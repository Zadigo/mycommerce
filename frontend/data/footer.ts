import type { FooterLinks } from "~/types"

export const socialLinks = [
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


// export const footerLinks: FooterLinks = [
//     {
//         "section": "Aide",
//         "links": [
//             {
//                 "to": "/",
//                 "params": null,
//                 "name": "Acheter en ligne"
//             },
//             {
//                 "to": "/",
//                 "name": "Paiement"
//             },
//             {
//                 "to": "/",
//                 "params": null,
//                 "name": "Livraison"
//             },
//             {
//                 "to": "/guide#retour-magasin",
//                 "params": null,
//                 "name": "Retour"
//             },
//             {
//                 "to": "/guide",
//                 "params": null,
//                 "name": "Guide"
//             },
//             {
//                 "to": "/",
//                 "params": null,
//                 "name": "Achat en tant qu'invité"
//             },
//             {
//                 "to": "/",
//                 "params": null,
//                 "name": "Me désabonner"
//             }
//         ]
//     },
//     {
//         "section": "Collections",
//         "links": [
//             {
//                 "to": "/shop/collection/skirts",
//                 "params": "skirts",
//                 "name": "Robes"
//             },
//             {
//                 "to": "/shop/collection/tops",
//                 "params": "tops",
//                 "name": "Tops"
//             },
//             {
//                 "to": "/shop/collection/tops",
//                 "params": "tops",
//                 "name": "Chemises"
//             },
//             {
//                 "to": "/shop/collection/pants",
//                 "params": "pants",
//                 "name": "Pantalons"
//             }
//         ]
//     }
// ]
