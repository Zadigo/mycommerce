<template>
  <div class="container" style="margin-top: 59px;">
    <div class="row">
      <div class="col-sm-12 col-md-6 offset-md-3">
        <article v-for="(item, i) in guideText" :id="item.id" :key="i" class="card mb-2">
          <div class="card-body">
            <h4 class="card-title">{{ item.title }}</h4>

            <!-- TODO: Create components -->
            <template v-for="(content, x) in item.text" :key="x">
              <template v-if="content.type === 'text'">
                <h5 v-if="content.title">{{ content.title }}</h5>
                <p v-if="typeof content.content === 'string'">{{ content.content }}</p>
              </template>

              <template v-else-if="content.type === 'points'">
                <h5 v-if="content.title">{{ content.title }}</h5>
                <template v-for="(value, y) in content.content" :key="y">
                  <ul v-if="typeof value === 'object'">
                    <li v-for="(text, z) in value" :key="z">
                      {{ text }}
                    </li>
                  </ul>
                  <p v-else>{{ value }}</p>
                </template>
              </template>
            </template>
          </div>
        </article>
      

        PUIS-JE RETOURNER N'IMPORTE QUEL ARTICLE ?
        Les produits à retourner doivent être en parfait état, conserver leurs étiquettes d'origine et ne pas avoir été utilisés. Le retour doit être effectué dans un délai maximum de 30 jours à compter de la confirmation d'expédition.

        Ne peuvent être ni échangés ni retournés :

        Les articles personnalisés
        Les sous-vêtements
        Les boucles d'oreilles
        Les accessoires pour les cheveux
        Les casquettes et les chapeaux.
        Articles imprimés sur demande
        Produits The Bershka Print Shop
        Attention, certains articles sont soumis à des conditions spécifiques :

        Maillots de bain : doivent être retournés avec la protection hygiénique intérieure
        Accessoires : doivent être retournés dans leur emballage d'origine complet et intact.
        Parfums et collection beauté : doivent être retournés dans leur emballage d'origine fermé.
        Lots : ils sont indivisibles et tous les articles doivent être retournés dans leur emballage d'origine.
        Les échanges doivent toujours être réalisés en magasin physique et sont soumis aux mêmes conditions que les produits à retourner.

        Puis-je éliminer un article de ma commande ?
        Vous pourrez éliminer les articles que vous ne souhaitez plus du panier à condition que vous n’ayez pas achevé tout le processus d’achat. Le cas échéant vous devrez annuler la commande.

        Puis-je annuler ma commande ?
        Oui, dans la section des « Commandes réalisées » de « Mon compte ».

        Bershka.com se réserve le droit de refuser les retours communiqués ou envoyés en dehors du délai établi, ou de vêtements qui ne sont pas dans l’état dans lequel ils ont été envoyés.

        Si vous ne souhaitez pas retourner les produits en utilisant l’une des deux options gratuites disponibles, vous supporterez le coût direct du renvoi des produits.

        Produits
        Faire ses achats sur bershka.com, c’est vraiment simple et ludique si vous suivez ces quelques étapes

        Est-ce que je recevrai le même produit qui apparaît sur la photo?
        Oui, sur Bershka.com nous faisons tout ce qui est en notre pouvoir pour montrer les caractéristiques des articles (couleur, textures…) aussi réellement que possible.

        Remettez-vous en stock les articles qui portent la mention « épuisée »?
        Si un article est en rupture de stock nous essayerons de le remettre le plus rapidement possible. En outre, si vous en faites la demande sur la page de l’article, nous vous enverrons un e-mail dès qu’il sera à nouveau disponible, dans la couleur et la taille que vous nous aurez indiqué. Si nous ne pouvions pas le remettre en stock, nous le retirerions du site Web.

        Avez-vous les mêmes articles que dans les magasins?
        Oui, il peut néanmoins arriver que le magasin soit en rupture de stock avant le site Web ou le contraire, c’est pourquoi chaque article dispose de l’option « Magasin le plus proche », où vous pourrez consulter la disponibilité de l’article dans le magasin de votre choix.

        Les prix de la boutiqeu online sont les mêmes que ceux des magasins BERSHKA?
        Le prix des produits sera celui indiqué sur notre site Internet. Si nous décelons une erreur dans le prix d'un produit que vous avez commandé, nous vous en informerons dans les plus brefs délais et vous proposerons soit de confirmer votre commande au prix correct, soit d'annuler celle-ci. Si nous ne parvenons pas à vous contacter, la commande sera considérée comme étant annulée et nous vous rembourserons l'intégralité des montants versés.
        Nous ne sommes pas tenus de vendre un produit à un prix inférieur incorrect (et ce même après vous avoir envoyé une confirmation d’envoi), si l'erreur est manifeste et sans ambiguïté et si vous êtes raisonnablement en mesure de l'identifier comme telle.

        Qu’incluent les prix?
        Tous les prix sont TTC mais les frais d’envoi ne sont pas inclus, ces derniers sont indiqués à part dans le panier. Nous vous rappelons que les frais d’envoi sont gratuits si votre commande est livrée dans l’un de nos magasins.

        Avec quelle fréquence la page est-elle mise à jour avec de nouveaux articles?
        Nous incorporons de nouveaux articles deux fois par semaine: le mercredi et le vendredi. Pour que vous les trouviez immédiatement, nous les indiquons comme « New » et nous les regroupons tous dans la section « Nouveautés de la semaine ».

        Quel genre d’articles présentez-vous dans le Lookbook mensuel?
        Le Lookbook a pour but de vous montrer plusieurs propositions pour que vous puissiez associer les articles qui seront disponibles en nouveauté le mois correspondant. De même, vous pourrez consulter les Lookbooks des mois précédents.

        Et dans la section « Collection »?
        Les articles de la campagne que nous avons tout au long de la saison en cours, avec des photos artistiques de grands professionnels.

        Qu’est-ce que les +hits?
        Il s’agit des produits les plus vendus de chaque section et de chaque catégorie de vente (manteaux, vestes...).

        Que dois-je faire si l’article livré est défectueux?
        Bershka.com ne vend que des articles en parfait état, c’est pourquoi si vous recevez un article défectueux contactez notre service clientèle.

        Et si l’article livré n’est pas le bon?
        Si d’aventure vous ne recevez pas l’article que vous aviez choisi, contactez notre service clientèle.

        Des erreurs et des fautes d’orthographe ou des oublis liés à la description du produit, le prix ou la disponibilité peuvent se glisser de forme exceptionnelle sur Bershka.com. Si tel est le cas, nous vous prions de nous excuser et nous nous réservons le droit de les corriger sans préavis, y compris après la réalisation de la commande.

        MOYENS DE PAIEMENT
        Maintenant payez vos commandes
        plus facilement

        Quel moyen de paiement puis-je utiliser pour réaliser mes achats?
        Vous pouvez payer par carte : Carte Bancaire, Visa, Visa Electron, Mastercard, American Express, PayPal et Carte cadeau. Nous n’acceptons pas de paiement en espèce, par chèques, ni de commandes par téléphone

        Visa MasterCard American Express Paypal Gift Card Carte Bancaire
        Paiement avec Apple Pay et Google Pay disponible uniquement via les applis.

        Quand prélevez-vous le montant de mes achats de mon compte bancaire?
        Une fois que la banque a autorisé le paiement, vous recevez un e-mail de confirmation de votre commande, mais l’argent n’est débité de votre compte qu’au moment où les articles quittent notre entrepôt vers la destination sollicitée.

        Ainsi, si pour une raison quelconque nous ne pouvions vous envoyer l’un des articles commandé, nous ne prélèverons pas son montant de votre compte bancaire.

        Quelles peuvent être les raisons du refus de ma carte de crédit?
        Votre carte peut être refusée pour les motifs suivants:

        La carte a expiré. Vérifier la date d’expiration pour écarter cette éventualité.
        Vous avez dépassé la limite de votre carte. Renseignez-vous auprès de votre banque pour savoir si vous avez dépassé la limite autorisée pour effectuer des achats.
        Assurez-vous d’avoir rempli correctement toutes les données relatives à votre carte.

        Si après toutes ces vérifications, vous ne pouvez toujours pas réaliser l’achat, contactez votre banque pour résoudre le problème.

        Puis-je obtenir une facture au nom de mon entreprise?
        Oui, il vous suffit de cocher l’option entreprise dans « Données personnelles » et de remplir les renseignements fiscaux demandés.

        Puis-je solliciter le Tax-Free?
        Non car le Tax-Free s’applique uniquement aux produits achetés dans les magasins et que l’on transporte soi-même.

        Les achats par carte bancaire sur bershka.com sont-ils sécurisés?
        Oui, les données de votre carte que vous introduisez sont traitées de forme cryptée, nous utilisons le protocole de chiffrage appelé Secure Socket Layer (SSL) pour protéger vos données ; vous pouvez d’ailleurs le vérifier en cliquant sur le cadenas qui s’affiche pendant le processus de paiement, sur la barre de votre navigateur.

        Pour les transactions avec la carte, nous vous demanderons le numéro du code de sécurité (CVV2) situé au dos de la carte, il vous faut donc opérer avec la carte en main et celui-ci n’est pas enregistré par notre site Web.

        Nous disposons en outre de système antifraude pour pouvoir détecter les utilisations frauduleuses ou illégales des cartes de crédit.

        bershka.com se réserve le droit de vous contacter pour vous demander plus d’informations en cas de problème relatif au paiement

        ENVOI
        Dans un magasin
        totalement gratuit

        2 - 4 jours ouvrés

        Standard à domicile
        avec des frais d’envoi de 4,95€

        indépendamment du nombre
        d’articles achetés.
        2 - 5 jours ouvrés

        Express à domicile
        
        avec des frais d’envoi de 9,95€

        quelque soit le nombre
        d’articles achetés
        2 - 3 jours ouvrés

        Point Relais Colis
        avec des frais d’envoi de 3,95€

        quelque soit le nombre
        d’articles achetés
        2 - 4 jours ouvrés

        Attention, selon l’origine des articles de ta commande, il est possible que certains modes d’expédition ne soient pas disponibles

        Lors des périodes de promotion ou de soldes, il est possible que certaines méthodes d'envoi ne soient pas disponibles.

        Où puis-je recevoir mon colis?
        Dans l'un de nos magasins physiques, chez vous* ou sur votre lieu de travail ou dans un point relais, jamais dans un bureau de poste.

        La livraison par Colissimo se fait en boîte aux lettres par votre facteur habituel. Si cela n'est pas possible, nous vous laisserons un avis de passage et votre colis sera déposé dans le point relais le plus proche (bureaux de postes, commerçants)

        La livraison peut-elle avoir lieu à l’étranger ?
        Non, le marché de livraison doit être le même que le marché où s’est réalisé l’achat.

        Quand recevrai-je ma commande ?
        Les délais de livraison varient selon le type d’envoi:

        Entre 2 et 4 jours ouvrés pour les envois dans nos magasins.
        Entre 2 et 5 jours ouvrés pour les envois standard.
        Entre 2 et 4 jours ouvrés pour les point Relais Colis.
        Et entre 2 et 3 jours ouvrés pour l’envoi express.
        Période de livraisons prolongée pendant les soldes

        Les envois á destination de l'outre-mer ne sont pas disponibles

        L’adresse d’envoi et l’adresse de facturation peuvent-elles être différentes ?
        Oui, vous pouvez indiquer dans le processus de paiement une adresse d’envoi différente à celle que vous avez introduit lors de votre enregistrement.

        Puis-je connaître l’état de ma commande ?
        Oui, dans la section « Mon compte ». De toute façon, nous vous avertirons par e-mail/SMS des changements d’états de votre commande.

        Si tu as réalisé tes achats en tant qu'invité et que tu souhaites connaître l'état de ta commande, clique ici

        Quel type de messages vais-je recevoir pour m’informer de l’état de ma commande ?
        E-mail de confirmation de votre commande, au moment où vous la passer.
        E-mail de confirmation de l’envoi, lorsque votre commande quitte notre entrepôt vers la destination choisie.

        En cas de livraison à domicile, vous recevrez un SMS de l’entreprise de transport pour vous indiquer le jour de livraison de la commande.

        En cas de livraison au magasin, nous vous enverrons un courriel et un SMS dès que le colis aura été livré dans le magasin choisi, pour que vous passiez le prendre.

        Si vous sélectionnez la livraison en point relais, un SMS contenant les instructions nécessaires vous sera envoyé lorsque votre colis sera disponible à l'adresse indiquée.

        Quel est l’état de ma commande?
        Dans la section « Mon compte » vous trouverez les états suivants :

        En cours : après réception de votre commande et pendant le traitement de l’information que vous nous avez fourni.
        Expédiée : lorsque les articles ont quitté notre entrepôt vers la destination sollicitée.
        En magasin : à compter du moment de la réception par le magasin, si tel est le mode d’envoi choisi.
        En livraison : lorsque la commande est sur le point d’être livrée par le transporteur.
        Livrée : état final qui indique que la commande a été livrée avec succès.

        Ou Annulée. L’annulation peut se produire pour les raisons suivantes :

        Un incident bancaire, ou une erreur dans l’adresse de livraison ou bien un problème de type frauduleux.
        Après trois tentatives de livraisons sans succès du transporteur à l’adresse d’envoi indiquée.
        Ou si le colis a été livré en magasin et qu’il n’a pas été réceptionné dans les 15 jours suivant la réception de l’e-mail et du SMS de confirmation.
        En cas d’annulation, nous remboursons le montant de la commande si le montant a déjà été débité sur la carte de crédit.

        Si j’ai choisi la livraison en magasin, à qui dois-je demander mon colis ?
        Vous pouvez réclamer votre colis à n’importe quel employé du magasin, sans faire la queue aux caisses. Montrez le numéro de commande et il sera à vous!

        Et si je suis absent au moment où le transporteur livre le colis?
        Après une première tentative de livraison, le transporteur laisse un avis de passage pour vous informer de la tentative de celle-ci. Vous pouvez également contacter l’entreprise de transport de votre côté, lorsque vous recevez l’avis de passage. À l’issue d’une autre tentative échouée, votre commande sera annulée et nous vous rembourserons le montant ce celle-ci.

        F.A.Q.
        Puis-je échanger un article acheté sur Bershka.com ?
        Oui, vous pouvez l’échanger contre le même article dans une couleur ou taille différente dans l’un de nos magasins Bershka.

        Si vous voulez l’échanger contre un autre vêtement d’une taille ou d’une couleur différente, vous devrez faire le retour de l’article souhaité et effectuer une nouvelle commande en ligne.

        Les vêtements doivent être en parfait état et vous devez joindre le ticket de l’achat correspondant.

        Vous pouvez télécharger les factures de vos achats en format PDF en allant sur « Mon Compte » et « Factures ». Elles ont la même valeur que les tickets d’achat.

        Pour des raisons d'hygiène, les collants, les chaussettes, les boucles d'oreilles, les serre-têtes et tout autre accessoire pour les cheveux (barrettes, élastiques, chouchous, etc.) ne pourront pas être rendus ni échangés.

        Puis-je échanger un article dans n’importe quel magasin Bershka.com ?
        Oui, s'il se trouve dans le même marché que celui dans lequel vous avez réalisé votre achat et si ce magasin dispose de la même section à laquelle appartient l'article que vous souhaitez échanger (femme, homme).

        Dans quel délai dois-je réaliser un échange ou retour ?
        Le délai est de 30 jours depuis la date d'achat qui apparait dans le mail de confirmation de la commande.

        Est-ce que je peux échanger des vêtements que j'ai achetés sur Bershka.com ?
        Vous pouvez changer la couleur ou la taille mais seulement dans nos boutiques.

        Si vous souhaitez échanger un vêtement contre un article différent, vous devez le renvoyer et effectuer une nouvelle commande en ligne.

        Il en va de même si vous souhaitez changer la taille ou la couleur de l'article depuis chez vous.

        Les vêtements doivent être en parfait état et vous devez joindre le ticket correspondant.

        N'oubliez pas que vous pouvez imprimer la facture dans la section « Mon compte » et que celle-ci a la même valeur que le ticket.

        Pour des raisons d'hygiène, il n'est pas possible d'échanger les collants, les chaussettes, les boucles d'oreilles, les serre-têtes et tout autre accessoire pour les cheveux (barrettes, élastiques, chouchous, etc.)

        Est-ce que je peux échanger l'article dans n'importe quel magasin ?
        Oui, à condition que le magasin soit situé dans le même marché que celui où vous avez réalisé l'achat et qu'il possède la section adéquate (femmes ou hommes).

        Quel est le délai pour échanger un article ?
        Vous disposez de 30 jours à partir de la date figurant dans l'e-mail de confirmation de votre commande.

        CONDITIONS D'ACHAT ET D'UTILISATION
        Conditions d'achat
        Tu peux consulter les termes et conditions d'achat ici

        Information générale
        Acheter sur bershka.com est un jeu d’enfant, facile et amusant:

        Choisissez la section Femmes Bershka, Hommes Bershka ou Femmes Bsk et le type de vêtement que vous souhaitez acheter (manteaux, robes, T-shirt…).
        Affichez tous les articles qui vous font envie. Si vous cherchez un article concret, vous pouvez trier votre recherche au moyen des onglets:
        Couleur
        Taille
        Prix
        Articles conseillés
        Ou si vous le préférez, vous pouvez utiliser le moteur de recherche situé en bas à droite de l’écran.

        Vous avez trouvé ce que vous cherchiez ?
        Cliquez sur la photo de l’article pour afficher toutes les caractéristiques de celui-ci, relatives à sa composition et lavage, référence, prix, couleurs et tailles disponibles, choisissez et ajoutez l’article à votre panier. Vous pouvez ensuite revenir à la boutique et poursuivre vos achats ou envoyer la commande.

        Vous avez bien tout ce qu’il vous faut dans votre p@nier?
        Cliquez sur envoyer la commande et enregistrez-vous!

        Vous êtes maintenant sur la page finale du processus d’achat, où vous devez choisir :
        Si vous souhaitez que nous livrions votre commande dans l’une de nos boutiques ou si vous préférez la recevoir par courrier normal ou express.
        Un mode de paiement parmi ceux que nous mettons à votre disposition : Visa, Visa Electron, MasterCard, American Express, PayPal ou Affinity.
        Et voilà !
        Cliquez sur envoyer la commande et vous recevrez un e-mail de confirmation de votre commande..

        Vous pourrez consulter l’état de votre commande, en temps réel dans la section « Mon compte », mais vous recevrez également un e-mail chaque fois que l’état de votre commande change.

        Que puis-je acheter sur Bershka.com ?
        Comme dans nos magasins, vous trouverez sur notre site Web les articles de nos trois sections:Bershka femme et Bershka homme : centrés sur la mode la plus actuelle et avant-gardiste, avec un grand choix de vêtements en jean, tenues de soirée, mode urbaine et toutes les dernières tend@nces.BSK femme : est une ligne plus jeune de la marque basées sur la diversion, la musique, les idoles, les personnages animés…Outre les vêtements, chaque section propose les accessoires et les chaussures qui s’associent le mieux à chaque style.En plus d’acheter, vous pouvez vous amuser en rejoignant notre communauté Bershka : nos évènements, notre musique… notre univers!!!!! Ne partez pas sans cliquer sur « B-Scene », « Vidéo »...

        Dois-je être enregistré/e pour pouvoir acheter ?
        Oui, et de cette façon vous aurez à votre disposition la section « Mon compte » où, entre autres avantages, vous pourrez consulter en temps réel l’état de vos commandes, les factures correspondantes (qui ont la même validité qu’un ticket) et vous n’aurez pas à remplir vos données à chaque achat.

        Comment puis-je récupérer mon mot de passe oublié ?
        Vous pouvez le récupérer dans « Mon compte » ou dans la section « Identifiez-vous » où vous trouverez l’option de solliciter l’envoi de votre mot de passe par e-mail.

        Une fois enregistré/e comment puis-je modifier mes données?
        Dans la section « Mon compte » dans « Données personnelles » vous pourrez accéder à vos données et les modifier.

        Quels navigateurs Internet dois-je utiliser pour accéder correctement au site Bershka ?
        Le site de Bershka est disponible avec Microsoft Internet Explorer 7 ou version supérieure, Mozilla Firefox 3.5 ou version supérieure, Google Chrome 6 et Safari 5 ou version supérieure.

        Vous pouvez installer les dernières versions de chaque navigateur par le biais des liens suivants :

        - Microsoft Internet Explorer

        - Mozilla Firefox

        - Google Chrome

        - Safari

        De quelle résolution d'écran ai-je besoin ?
        1024 de largeur x 768 de hauteur, ou résolutions supérieures.

        Puis-je acheter sur Bershka en ligne en toute sécurité ?
        Oui. En toute tranquillité. Nous nous efforçons systématiquement de disposer de moyens nous permettant de vous garantir la sécurité de vos achats et de vos coordonnées.

        GIFT CARD
        La meilleure solution pour trouver le cadeau parfait à la dernière minute. Valable en magasin ou sur le site web.

        Où puis-je acheter une carte cadeau ?
        Tu peux acheter et utiliser nos cartes cadeau dans n'importe quel magasin Bershka, ainsi que sur bershka.com.

        Pour utiliser une carte cadeau reçue par e-mail en magasin, imprime-la et la présente-la à la caisse au moment du paiement ou bien montre directement l'e-mail sur ton téléphone portable.

        Comment activer une Carte cadeau virtuelle achetée sur Bershka.com ?
        Au moment du paiement, que ce soit en magasin ou sur le site Web, nous te demanderons les quatre derniers chiffres de ton téléphone portable pour activer la Carte. Cette information est fournie par l'acheteur au cours du processus d'achat. Tu peux également l'activer dans la rubrique « Carte cadeau » - « Activer carte ».

        Puis-je retourner une carte cadeau achetée en ligne ?
        Tu peux la retourner dans un délai de 30 jours à partir de la date d'achat à condition qu'elle n'ait pas été utilisée. Dans ce cas, tu recevras le montant via le moyen de paiement utilisé pour l'achat.

        Si le retour est effectué sur Bershka.com, il ne sera pas nécessaire de nous envoyer la Carte physique. Nous l'annulerons automatiquement.

        Si tu as utilisé entièrement ta carte cadeau, conserve-la pour le retour éventuel d'un article acheté avec celle-ci.

        Si tu retournes un article acheté avec une carte cadeau, le remboursement sera effectué sur cette carte, si celle-ci existe encore et qu'elle n'est pas épuisée au moment du retour.

        Si tu ne disposes plus de la carte cadeau avec laquelle tu as effectué l'achat, tu recevras un Bon d'achat Bershka au moment du retour. Celui-ci fonctionnera de la même manière qu'une carte cadeau.

        Que dois-je savoir de plus sur ma carte cadeau ?
        Si ta carte ne fonctionne pas, il est possible que certaines des données insérées soient incorrectes. Vérifie d'avoir correctement rempli toutes les données nécessaires.

        Perte:
        La Carte cadeau est un document au porteur. Bershka ne remplacera pas la carte en cas de vol, de perte, d'égarement ou de détérioration.


        Solde:
        Le solde de la carte ne pourra en aucun cas être remboursé ou échangé contre de l'argent.

        Le solde sera uniquement augmenté dans le cas du retour d'un article payé avec la carte.

        Aucun achat possible avec une carte épuisée, car celle-ci sera refusée.

        Date de validité:
        Vérifie que ta carte ne dépasse pas sa période de validité car dans le cas contraire, tu ne pourras plus l'utiliser.

        ACHETER EN TANT QU'INVITÉ
        ACHETER EN TANT QU'INVITÉ
        Ce site internet vous permet également de réaliser vos achats en tant qu'invité. Avec ce mode d'achat, nous vous demanderons uniquement les informations indispensables pour pouvoir effectuer la commande. Une fois que vous avez terminé l'achat, nous vous proposerons de vous inscrire en tant qu'utilisateur ou de continuer en tant qu'utilisateur non inscrit.

        Si tu as réalisé tes achats en tant qu'invité et que tu souhaites connaître l'état de ta commande, clique ici

        Gift Receipt
        QU’EST-CE QU’UN TICKET CADEAU ?
        Un ticket cadeau est un ticket qui ne révèle pas le montant de l'achat, te permettant d'acheter des cadeaux à ceux que tu aimes. Tu peux en plus ajouter un message personnel.

        La personne qui reçoit un cadeau avec ce ticket peut l'échanger ou le retourner en magasin. Le montant total des articles retournés est remboursé sous forme d'avoir si le retour est effectué en magasin.

        Si tu n'as pas de magasin physique à proximité, contacte notre service client.
        COMMENT AJOUTER UN TICKET CADEAU À UNE COMMANDE ?
        Si tu souhaites ajouter un ticket cadeau à une commande, il te suffit de cocher la case « envoyer en cadeau » dans le panier. Cette option n'est pas disponible si ta commande contient une carte cadeau.

        COMBIEN DE TEMPS AI-JE POUR RETOURNER UNE COMMANDE ?
        Tu disposes d'un mois à compter de la date figurant sur le ticket cadeau pour retourner un article.

        COMMENT PAYER AVEC L'AVOIR QUE J'AI REÇU LORS D'UN RETOUR ?
        Pour payer avec un avoir, coche la case « Carte cadeau » en tant que mode de paiement pour la commande.

        COMMENT LE BÉNÉFICIAIRE PEUT-IL RETOURNER UNE COMMANDE AVEC UN TICKET CADEAU ?
        Le bénéficiaire peut retourner la commande dans n'importe quel magasin Bershka du pays où l'achat a été effectué.

        Si tu n'as pas de magasin à proximité, contacte notre service client.
        COMMENT LE BÉNÉFICIAIRE EST-IL REMBOURSÉ ?
        Si le retour est effectué en magasin, il recevra un avoir.
        Sous forme d'avoir que tu recevras lorsque tu retourneras l'article en magasin.
        PUIS-JE ÊTRE REMBOURSÉ PAR LE MODE DE PAIEMENT INITIAL ?
        Oui, pour cela, utilise la facture téléchargeable depuis ton compte Bershka.com au lieu d'utiliser le ticket cadeau.

        Ticket électronique
        Qu'est-ce que le ticket électronique ?
        C'est un système de facturation électronique qui élimine le ticket de caisse. À partir de maintenant, toutes les commandes passées à travers le site internet et l'APPLI vont intégrer ce nouveau système, sauf les commandes qui possèdent l'option Ticket cadeau et le contre-remboursement, qui continueront de recevoir le ticket imprimé.

        Où puis-je voir mon ticket de caisse ?
        Tu recevras chaque ticket en pièce jointe dans les e-mails que nous t'enverrons depuis bershka.com en référence à ta commande. De plus, ils seront enregistrés automatiquement dans la section « Mes commandes » de ton compte personnel.

        Comment puis-je retourner un article si je ne possède pas le ticket ?
        Pour les retours en magasin tu devras juste montrer sur l'écran de ton portable le ticket électronique que tu as reçu en pièce jointe de la Confirmation d'envoi avec l'article que tu souhaites retourner. Tu peux également accéder au ticket depuis la page web ou APPLI, il te suffit d'entrer dans « Mon compte » et ensuite entrer dans la section « Commandes ».

        Si tu souhaites retourner tes articles par DropOff, tu devras faire une demande de retour sur ton compte et emballer les articles que tu souhaites retourner. Rends-toi au point relais le plus proche et dépose le colis. Aucun ticket n'est à imprimer !

        Comment puis-je échanger les articles sans le ticket ?
        De même que pour les retours, tu devras juste montrer sur l'écran de ton portable le ticket électronique que tu as reçu en pièce jointe de la Confirmation d'envoi et l'article que tu souhaites échanger, c'est très simple !
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { guideText } from '~/data'
</script>
