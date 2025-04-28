import type { GuideText } from "~/types";

export const guideText: GuideText[] = [
    {
        id: "retourner-mon-article",
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
                    "Quelle que soit l'option que vous choisissez, vous trouverez toutes les étapes à suivre dans la rubrique « Mon compte » « Retours ». Les articles doivent être en parfait état.",
                    "Si vous avez passé votre commande en tant qu'invité, vous pourrez effectuer un retour en accédant au lien inclus dans l'e-mail de confirmation de livraison.",
                    "Dans le cas où vous souhaiteriez retourner des articles de plusieurs commandes, il est important que vous fassiez une demande de retour pour chacune d'entre elles, en fonction du nombre de colis que vous souhaitez retourner. Bershka n'est pas responsable des retours d'articles achetés dans différentes commandes et/ou retournés avec la demande de retrait d'un achat différent."
                ]
            }
        ]
    },
    {
        id: "recevoir-montant-articles-retournes",
        title: "Comment vais-je recevoir le montant des articles retournés ?",
        text: [
            {
                id: "",
                title: "",
                type: "text",
                content: "Après acceptation du retour, et avec le même mode de paiement que celui de l'achat."
            }
        ]
    },
    {
        id: "obtention-remboursement",
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
        id: "remboursement-errone",
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
        id: "achat",
        title: "Comment puis-je m'assurer que mes achats ont été réalisés avec succès ?",
        text: [
            {
                id: "",
                title: "",
                type: "text",
                content: "Une fois le processus d'achat achevé, vous recevrez un e - mail de confirmation ; si vous ne le recevez pas, contactez notre service clientèle"
            }
        ]
    },
    {
        id: "retour-articles",
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
        id: "enlever-article-commande",
        title: "Puis-je éliminer un article de ma commande ?",
        text: [
            {
                id: "",
                title: "",
                type: "text",
                content: "Vous pourrez éliminer les articles que vous ne souhaitez plus du panier à condition que vous n'ayez pas achevé tout le processus d'achat. Le cas échéant vous devrez annuler la commande."
            }
        ]
    },
    {
        id: "annulation-commande",
        title: "Puis-je annuler ma commande ?",
        text: [
            {
                id: "",
                title: "",
                type: "text",
                content: [
                    "Oui, dans la section des « Commandes réalisées » de « Mon compte ».",
                    "Bershka.com se réserve le droit de refuser les retours communiqués ou envoyés en dehors du délai établi, ou de vêtements qui ne sont pas dans l'état dans lequel ils ont été envoyés.",
                    "Si vous ne souhaitez pas retourner les produits en utilisant l'une des deux options gratuites disponibles, vous supporterez le coût direct du renvoi des produits."
                ]
            }
        ]
    },
    {
        id: "ticket-electronique",
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
    {
        id: "produits",
        title: "Produits",
        "text": [
            {
                id: "",
                title: "",
                type: "points",
                content: [
                    "Faire ses achats sur bershka.com, c'est vraiment simple et ludique si vous suivez ces quelques étapes",
                    
                    "Est-ce que je recevrai le même produit qui apparaît sur la photo?",
                    "Oui, sur Bershka.com nous faisons tout ce qui est en notre pouvoir pour montrer les caractéristiques des articles (couleur, textures…) aussi réellement que possible.",

                    "Remettez-vous en stock les articles qui portent la mention 'épuisée'?",
                    "Si un article est en rupture de stock nous essayerons de le remettre le plus rapidement possible. En outre, si vous en faites la demande sur la page de l'article, nous vous enverrons un e-mail dès qu'il sera à nouveau disponible, dans la couleur et la taille que vous nous aurez indiqué. Si nous ne pouvions pas le remettre en stock, nous le retirerions du site Web.",

                    "Avez-vous les mêmes articles que dans les magasins?",
                    "Oui, il peut néanmoins arriver que le magasin soit en rupture de stock avant le site Web ou le contraire, c'est pourquoi chaque article dispose de l'option « Magasin le plus proche », où vous pourrez consulter la disponibilité de l'article dans le magasin de votre choix.",

                    "Les prix de la boutiqeu online sont les mêmes que ceux des magasins BERSHKA?",
                    "Le prix des produits sera celui indiqué sur notre site Internet. Si nous décelons une erreur dans le prix d'un produit que vous avez commandé, nous vous en informerons dans les plus brefs délais et vous proposerons soit de confirmer votre commande au prix correct, soit d'annuler celle-ci. Si nous ne parvenons pas à vous contacter, la commande sera considérée comme étant annulée et nous vous rembourserons l'intégralité des montants versés.",
                    "Nous ne sommes pas tenus de vendre un produit à un prix inférieur incorrect (et ce même après vous avoir envoyé une confirmation d'envoi), si l'erreur est manifeste et sans ambiguïté et si vous êtes raisonnablement en mesure de l'identifier comme telle.",

                    "Qu'incluent les prix?",
                    "Tous les prix sont TTC mais les frais d'envoi ne sont pas inclus, ces derniers sont indiqués à part dans le panier. Nous vous rappelons que les frais d'envoi sont gratuits si votre commande est livrée dans l'un de nos magasins.",

                    "Avec quelle fréquence la page est-elle mise à jour avec de nouveaux articles?",
                    "Nous incorporons de nouveaux articles deux fois par semaine: le mercredi et le vendredi. Pour que vous les trouviez immédiatement, nous les indiquons comme « New » et nous les regroupons tous dans la section « Nouveautés de la semaine ».",

                    "Quel genre d'articles présentez-vous dans le Lookbook mensuel?",
                    "Le Lookbook a pour but de vous montrer plusieurs propositions pour que vous puissiez associer les articles qui seront disponibles en nouveauté le mois correspondant. De même, vous pourrez consulter les Lookbooks des mois précédents.",

                    "Et dans la section « Collection »?",
                    "Les articles de la campagne que nous avons tout au long de la saison en cours, avec des photos artistiques de grands professionnels.",

                    "Qu'est-ce que les +hits?",
                    "Il s'agit des produits les plus vendus de chaque section et de chaque catégorie de vente (manteaux, vestes...).",

                    "Que dois-je faire si l'article livré est défectueux?",
                    "Bershka.com ne vend que des articles en parfait état, c'est pourquoi si vous recevez un article défectueux contactez notre service clientèle.",

                    "Et si l'article livré n'est pas le bon?",
                    "Si d'aventure vous ne recevez pas l'article que vous aviez choisi, contactez notre service clientèle.",

                    "Des erreurs et des fautes d'orthographe ou des oublis liés à la description du produit, le prix ou la disponibilité peuvent se glisser de forme exceptionnelle sur Bershka.com. Si tel est le cas, nous vous prions de nous excuser et nous nous réservons le droit de les corriger sans préavis, y compris après la réalisation de la commande."
                ]
            }
        ]
    },
    {
        id: "moyens-paiements",
        title: "Moyens de paiements",
        text: [
            {
                id: "",
                title: "",
                type: "points",
                content: [
                    "Maintenant payez vos commandes plus facilement",

                    "Quel moyen de paiement puis-je utiliser pour réaliser mes achats?",
                    "Vous pouvez payer par carte : Carte Bancaire, Visa, Visa Electron, Mastercard, American Express, PayPal et Carte cadeau. Nous n'acceptons pas de paiement en espèce, par chèques, ni de commandes par téléphone",

                    "Visa MasterCard American Express Paypal Gift Card Carte Bancaire",
                    "Paiement avec Apple Pay et Google Pay disponible uniquement via les applis.",

                    "Quand prélevez-vous le montant de mes achats de mon compte bancaire?",
                    "Une fois que la banque a autorisé le paiement, vous recevez un e-mail de confirmation de votre commande, mais l'argent n'est débité de votre compte qu'au moment où les articles quittent notre entrepôt vers la destination sollicitée.",

                    "Ainsi, si pour une raison quelconque nous ne pouvions vous envoyer l'un des articles commandé, nous ne prélèverons pas son montant de votre compte bancaire.",

                    "Quelles peuvent être les raisons du refus de ma carte de crédit?",
                    "Votre carte peut être refusée pour les motifs suivants:",

                    "La carte a expiré. Vérifier la date d'expiration pour écarter cette éventualité.",
                    "Vous avez dépassé la limite de votre carte. Renseignez-vous auprès de votre banque pour savoir si vous avez dépassé la limite autorisée pour effectuer des achats.",
                    "Assurez-vous d'avoir rempli correctement toutes les données relatives à votre carte.",

                    "Si après toutes ces vérifications, vous ne pouvez toujours pas réaliser l'achat, contactez votre banque pour résoudre le problème.",

                    "Puis-je obtenir une facture au nom de mon entreprise?",
                    "Oui, il vous suffit de cocher l'option entreprise dans « Données personnelles » et de remplir les renseignements fiscaux demandés.",

                    "Puis-je solliciter le Tax-Free?",
                    "Non car le Tax-Free s'applique uniquement aux produits achetés dans les magasins et que l'on transporte soi-même.",

                    "Les achats par carte bancaire sur bershka.com sont-ils sécurisés?",
                    "Oui, les données de votre carte que vous introduisez sont traitées de forme cryptée, nous utilisons le protocole de chiffrage appelé Secure Socket Layer (SSL) pour protéger vos données ; vous pouvez d'ailleurs le vérifier en cliquant sur le cadenas qui s'affiche pendant le processus de paiement, sur la barre de votre navigateur.",

                    "Pour les transactions avec la carte, nous vous demanderons le numéro du code de sécurité (CVV2) situé au dos de la carte, il vous faut donc opérer avec la carte en main et celui-ci n'est pas enregistré par notre site Web.",

                    "Nous disposons en outre de système antifraude pour pouvoir détecter les utilisations frauduleuses ou illégales des cartes de crédit.",

                    "bershka.com se réserve le droit de vous contacter pour vous demander plus d'informations en cas de problème relatif au paiement",
                ]
            }
        ]
    },
    {
        id: "envoi",
        title: "Envoi",
        text: [
            {
                id: "",
                title: "",
                type: "points",
                content: [
                    "Dans un magasin",
                    [
                        "totalement gratuit",
                        "2 - 4 jours ouvrés"
                    ],


                    "Standard à domicile",
                    [
                        "avec des frais d'envoi de 4,95€"
                    ],
                    [
                        "indépendamment du nombre d'articles achetés.",
                        "2 - 5 jours ouvrés"

                    ],

                    "Express à domicile",
                    [
                        "avec des frais d'envoi de 9,95€",
                        "quelque soit le nombre d'articles achetés",
                        "2 - 3 jours ouvrés"
                    ],

                    "Attention, selon l'origine des articles de ta commande, il est possible que certains modes d'expédition ne soient pas disponibles",

                    "Lors des périodes de promotion ou de soldes, il est possible que certaines méthodes d'envoi ne soient pas disponibles.",

                    "Où puis-je recevoir mon colis?",
                    "Dans l'un de nos magasins physiques, chez vous* ou sur votre lieu de travail ou dans un point relais, jamais dans un bureau de poste.",

                    "La livraison par Colissimo se fait en boîte aux lettres par votre facteur habituel. Si cela n'est pas possible, nous vous laisserons un avis de passage et votre colis sera déposé dans le point relais le plus proche (bureaux de postes, commerçants)",

                    "La livraison peut-elle avoir lieu à l'étranger ?",
                    "Non, le marché de livraison doit être le même que le marché où s'est réalisé l'achat.",

                    "Quand recevrai-je ma commande ?",
                    "Les délais de livraison varient selon le type d'envoi:",

                    [
                        "Entre 2 et 4 jours ouvrés pour les envois dans nos magasins.",
                        "Entre 2 et 5 jours ouvrés pour les envois standard.",
                        "Entre 2 et 4 jours ouvrés pour les point Relais Colis.",
                        "Et entre 2 et 3 jours ouvrés pour l'envoi express.",
                        "Période de livraisons prolongée pendant les soldes"
                    ],

                    "Les envois á destination de l'outre-mer ne sont pas disponibles",

                    "L'adresse d'envoi et l'adresse de facturation peuvent-elles être différentes ?",
                    "Oui, vous pouvez indiquer dans le processus de paiement une adresse d'envoi différente à celle que vous avez introduit lors de votre enregistrement.",

                    "Puis-je connaître l'état de ma commande ?",
                    "Oui, dans la section « Mon compte ». De toute façon, nous vous avertirons par e-mail/SMS des changements d'états de votre commande.",

                    "Si tu as réalisé tes achats en tant qu'invité et que tu souhaites connaître l'état de ta commande, clique ici",

                    "Quel type de messages vais-je recevoir pour m'informer de l'état de ma commande ?",
                    "E-mail de confirmation de votre commande, au moment où vous la passer.",
                    "E-mail de confirmation de l'envoi, lorsque votre commande quitte notre entrepôt vers la destination choisie.",

                    "En cas de livraison à domicile, vous recevrez un SMS de l'entreprise de transport pour vous indiquer le jour de livraison de la commande.",

                    "En cas de livraison au magasin, nous vous enverrons un courriel et un SMS dès que le colis aura été livré dans le magasin choisi, pour que vous passiez le prendre.",

                    "Si vous sélectionnez la livraison en point relais, un SMS contenant les instructions nécessaires vous sera envoyé lorsque votre colis sera disponible à l'adresse indiquée.",

                    "Quel est l'état de ma commande?",
                    "Dans la section « Mon compte » vous trouverez les états suivants :",

                    [
                        "En cours : après réception de votre commande et pendant le traitement de l'information que vous nous avez fourni.",
                        "Expédiée : lorsque les articles ont quitté notre entrepôt vers la destination sollicitée.",
                        "En magasin : à compter du moment de la réception par le magasin, si tel est le mode d'envoi choisi.",
                        "En livraison : lorsque la commande est sur le point d'être livrée par le transporteur.",
                        "Livrée : état final qui indique que la commande a été livrée avec succès.",
                    ],

                    "Ou Annulée. L'annulation peut se produire pour les raisons suivantes :",

                    [
                        "Un incident bancaire, ou une erreur dans l'adresse de livraison ou bien un problème de type frauduleux.",
                        "Après trois tentatives de livraisons sans succès du transporteur à l'adresse d'envoi indiquée.",
                        "Ou si le colis a été livré en magasin et qu'il n'a pas été réceptionné dans les 15 jours suivant la réception de l'e-mail et du SMS de confirmation.",
                        "En cas d'annulation, nous remboursons le montant de la commande si le montant a déjà été débité sur la carte de crédit."
                    ],

                    "Si j'ai choisi la livraison en magasin, à qui dois-je demander mon colis ?",
                    "Vous pouvez réclamer votre colis à n'importe quel employé du magasin, sans faire la queue aux caisses. Montrez le numéro de commande et il sera à vous!",

                    "Et si je suis absent au moment où le transporteur livre le colis?",
                    "Après une première tentative de livraison, le transporteur laisse un avis de passage pour vous informer de la tentative de celle-ci. Vous pouvez également contacter l'entreprise de transport de votre côté, lorsque vous recevez l'avis de passage. À l'issue d'une autre tentative échouée, votre commande sera annulée et nous vous rembourserons le montant ce celle-ci."
                ]
            }
        ]
    },
    {
        id: "achat-anonyme",
        title: "Acheter en tant qu'invité",
        text: [
            {
                id: "",
                type: "text",
                content: [
                    "Ce site internet vous permet également de réaliser vos achats en tant qu'invité. Avec ce mode d'achat, nous vous demanderons uniquement les informations indispensables pour pouvoir effectuer la commande.Une fois que vous avez terminé l'achat, nous vous proposerons de vous inscrire en tant qu'utilisateur ou de continuer en tant qu'utilisateur non inscrit.",
                    "Si tu as réalisé tes achats en tant qu'invité et que tu souhaites connaître l'état de ta commande, clique ici"
                ]
            }
        ]
    }
]
