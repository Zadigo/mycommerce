import type { GuideText } from "~/types";

export const guideText: GuideText[] = [
    {
        id: "",
        title: "Comment retourner un article ?",
        text: [
            {
                id: '',
                title: '',
                type: "text",
                content: "Tu peux retourner un article de 3 façons : en magasin, en point relais  ou à domicile.Les retours en magasin sont toujours gratuits."
            },
            {
                id: "retour-magasin",
                title: "Retour en magasin",
                type : 'text',
                content: "Le moyen le plus simple est de retourner l'article dans l'un des magasins Bershka situés dans le pays où vous avez effectué votre achat, à condition que ce magasin propose le même rayon auquel appartient l'article (femme ou homme)"
            },
            {
                id: "",
                title: "Retour en point relais",
                type : 'points',
                content: [
                    "Si tu préfères, tu peux demander un retour en point relais depuis notre site, et déposer les articles dans l'un de nos points de dépôt. Consulte notre Politique sur les retours en point relais ici :",
                    [
                        "Si tu effectues ton premier retour en point relais dans les 15 premiers jours de la période de retour, les frais de retour seront GRATUITS",
                        "Si tu effectues ton premier retour en point relais une fois les 15 premiers jours de la période de retour passés, les frais de retour seront de 4,95 euros",
                        "Si tu souhaites retourner plusieurs articles d'une même commande dans un deuxième retour, les frais de retour seront de 4,95 euros"
                    ],
                    [
                        "Si tu effectues ton premier retour en point relais dans les 15 premiers jours de la période de retour, les frais de retour seront GRATUITS",
                        "Si tu effectues ton premier retour en point relais une fois les 15 premiers jours de la période de retour passés, les frais de retour seront de 4,95 euros",
                        "Si tu souhaites retourner plusieurs articles d'une même commande dans un deuxième retour, les frais de retour seront de 4,95 euros"
                    ],
                    " Les 4,95 euros de frais de retour en point relais seront automatiquement déduits du montant de ton remboursement.",
                    [
                        "Consultez les points relais les plus proches de chez vous en cliquant ici.",
                        "Si vous optez pour un retrait à domicile, le transporteur viendra retirer votre colis dans les 24 à 48 heures (jours ouvrables) après votre demande.",
                        "Si vous préférez, vous pouvez demander un retour en point relais sur notre site, et déposer les articles dans l'un de nos points de dépôt.",
                        "Consultez les points relais les plus proches de chez vous en cliquant ici."
                    ]
                ]
            },
            {
                id: "",
                title: "Retrait à domicile",
                type: "points",
                content: [
                    "Si vous optez pour un retrait à domicile, le transporteur viendra retirer votre colis dans les 24 à 48 heures (jours ouvrables) après votre demande.",
                    "Le retrait à domicile a un coût de 5,95€ par retour et sera déduit du montant remboursé.",
                    "Quelle que soit l’option que vous choisissez, vous trouverez toutes les étapes à suivre dans la rubrique « Mon compte » « Retours ». Les articles doivent être en parfait état.",
                    "Si vous avez passé votre commande en tant qu'invité, vous pourrez effectuer un retour en accédant au lien inclus dans l'e-mail de confirmation de livraison.",
                    "Dans le cas où vous souhaiteriez retourner des articles de plusieurs commandes, il est important que vous fassiez une demande de retour pour chacune d'entre elles, en fonction du nombre de colis que vous souhaitez retourner. Bershka n'est pas responsable des retours d'articles achetés dans différentes commandes et/ou retournés avec la demande de retrait d'un achat différent."
                ]
            }
        ]
    },
    {
        id: "",
        title: "Comment vais-je recevoir le montant des articles retournés ?",
        text: [
            {
                id: "",
                title: "",
                type: "text",
                content: "Après acceptation du retour, et avec le même mode de paiement que celui de l’achat."
            }
        ]
    },
    {
        id: "",
        title: "Quand recevrais-je le remboursement ?",
        text: [
            {
                id: "",
                title: "",
                type: "text",
                content: "Dès son acceptation vous recevrez un e - mail de confirmation vous indiquant que le montant vous sera versé dans les prochains jours.Le temps de remboursement sur une carte de crédit et / ou sur un compte Paypal dépend toujours de votre organisme bancaire",
            }
        ]
    },
    {
        id: "",
        title: "Que puis-je faire si le montant de mon remboursement est erroné ?",
        text: [
            {
                id: "",
                title: "",
                type: "text",
                content: "Contactez notre service clientèle et nous résoudrons le problème dans les plus brefs délais."
            }
        ]
    },
    {
        id: "",
        title: "Comme puis-je m’assurer que mes achats ont été réalisés avec succès ?",
        text: [
            {
                id: "",
                title: "",
                type: "text",
                content: "Une fois le processus d’achat achevé, vous recevrez un e - mail de confirmation ; si vous ne le recevez pas, contactez notre service clientèle"
            }
        ]
    }
]
