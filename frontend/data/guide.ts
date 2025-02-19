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
        title: "Comment puis-je m'assurer que mes achats ont été réalisés avec succès ?",
        text: [
            {
                id: "",
                title: "",
                type: "text",
                content: "Une fois le processus d’achat achevé, vous recevrez un e - mail de confirmation ; si vous ne le recevez pas, contactez notre service clientèle"
            }
        ]
    },
    {
        id: "",
        title: "Puis-je retourner n'importe quel article ?",
        text: [
            {
                id: "",
                title: "",
                type: "points",
                content: [
                    "Les produits à retourner doivent être en parfait état, conserver leurs étiquettes d'origine et ne pas avoir été utilisés. Le retour doit être effectué dans un délai maximum de 30 jours à compter de la confirmation d'expédition.",
                    "Ne peuvent être ni échangés ni retournés :",
                    [
                        "Les articles personnalisés",
                        "Les sous-vêtements",
                        "Les boucles d'oreilles",
                        "Les accessoires pour les cheveux",
                        "Les casquettes et les chapeaux.",
                        "Articles imprimés sur demande",
                        "Produits The Bershka Print Shop"
                    ],
                    "Attention, certains articles sont soumis à des conditions spécifiques :",
                    [
                        "Maillots de bain : doivent être retournés avec la protection hygiénique intérieure",
                        "Accessoires : doivent être retournés dans leur emballage d'origine complet et intact.",
                        "Parfums et collection beauté : doivent être retournés dans leur emballage d'origine fermé.",
                        "Lots : ils sont indivisibles et tous les articles doivent être retournés dans leur emballage d'origine.",
                        "Les échanges doivent toujours être réalisés en magasin physique et sont soumis aux mêmes conditions que les produits à retourner."
                    ]
                ]
            }
        ]
    },
    {
        id: "",
        title: "Puis-je éliminer un article de ma commande ?",
        text: [
            {
                id: "",
                title: "",
                type: "text",
                content: "Vous pourrez éliminer les articles que vous ne souhaitez plus du panier à condition que vous n’ayez pas achevé tout le processus d’achat. Le cas échéant vous devrez annuler la commande."
            }
        ]
    },
    {
        id: "",
        title: "Puis-je annuler ma commande ?",
        text: [
            {
                id: "",
                title: "",
                type: "text",
                content: [
                    "Oui, dans la section des « Commandes réalisées » de « Mon compte ».",
                    "Bershka.com se réserve le droit de refuser les retours communiqués ou envoyés en dehors du délai établi, ou de vêtements qui ne sont pas dans l’état dans lequel ils ont été envoyés.",
                    "Si vous ne souhaitez pas retourner les produits en utilisant l’une des deux options gratuites disponibles, vous supporterez le coût direct du renvoi des produits."
                ]
            }
        ]
    },
    {
        id: "",
        title: "Ticket électronique",
        text: [
            {
                id: "",
                title: "Qu'est-ce que le ticket électronique ?",
                type: "text",
                content: [
                    "C'est un système de facturation électronique qui élimine le ticket de caisse. À partir de maintenant, toutes les commandes passées à travers le site internet et l'APPLI vont intégrer ce nouveau système, sauf les commandes qui possèdent l'option Ticket cadeau et le contre-remboursement, qui continueront de recevoir le ticket imprimé."
                ]
            },
            {
                id: "",
                title: "Où puis-je voir mon ticket de caisse ?",
                type: "text",
                content: [
                    "Tu recevras chaque ticket en pièce jointe dans les e-mails que nous t'enverrons depuis bershka.com en référence à ta commande. De plus, ils seront enregistrés automatiquement dans la section « Mes commandes » de ton compte personnel.",                                        
                ]
            },
            {
                id: "",
                title: "Comment puis-je retourner un article si je ne possède pas le ticket ?",
                type: "text",
                content: [
                    "Pour les retours en magasin tu devras juste montrer sur l'écran de ton portable le ticket électronique que tu as reçu en pièce jointe de la Confirmation d'envoi avec l'article que tu souhaites retourner. Tu peux également accéder au ticket depuis la page web ou APPLI, il te suffit d'entrer dans « Mon compte » et ensuite entrer dans la section « Commandes ».",                    
                    "Si tu souhaites retourner tes articles par DropOff, tu devras faire une demande de retour sur ton compte et emballer les articles que tu souhaites retourner. Rends-toi au point relais le plus proche et dépose le colis. Aucun ticket n'est à imprimer !"
                ]
            },
            {
                id: "",
                title: "Comment puis-je échanger les articles sans le ticket ?",
                type: "text",
                content: [
                    "De même que pour les retours, tu devras juste montrer sur l'écran de ton portable le ticket électronique que tu as reçu en pièce jointe de la Confirmation d'envoi et l'article que tu souhaites échanger, c'est très simple !"
                ]
            }
        ]
    },
]
