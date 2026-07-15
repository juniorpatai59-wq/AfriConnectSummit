// AfriConnect Summit 2026 — main.js

document.addEventListener('DOMContentLoaded', () => {

//  ANNÉE DANS LE FOOTER
    const anneeEl = document.getElementById('annee');
    if (anneeEl) {
        anneeEl.textContent = new Date().getFullYear();
    }


//    MODE SOMBRE (AMOLED) — bascule + mémorisation
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const themeEnregistre = localStorage.getItem('africonnect-theme');
        if (themeEnregistre === 'dark') {
            document.body.classList.add('dark');
        }

        themeToggle.addEventListener('click', () => {
            const estSombre = document.body.classList.toggle('dark');
            localStorage.setItem('africonnect-theme', estSombre ? 'dark' : 'clair');
        });
    }


//  MENU BURGER (mobile)

    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        const fermerMenu = () => {
            menuToggle.classList.remove('actif');
            navLinks.classList.remove('ouvert');
            menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
        };

        menuToggle.addEventListener('click', () => {
            const seraOuvert = !navLinks.classList.contains('ouvert');
            menuToggle.classList.toggle('actif', seraOuvert);
            navLinks.classList.toggle('ouvert', seraOuvert);
            menuToggle.setAttribute('aria-label', seraOuvert ? 'Fermer le menu' : 'Ouvrir le menu');
        });

        /* Ferme le menu si on clique sur un lien (utile en navigation mobile) */
        navLinks.querySelectorAll('a').forEach((lien) => {
            lien.addEventListener('click', fermerMenu);
        });

        /* Ferme le menu si on repasse en desktop après redimensionnement */
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                fermerMenu();
            }
        });
    }


//  HEADER AU SCROLL + BOUTON RETOUR EN HAUT

    const header = document.querySelector('header');
    const boutonHaut = document.getElementById('retour-haut');

    if (boutonHaut) {
        boutonHaut.hidden = false; // le CSS masque déjà visuellement le bouton (opacité 0)
        boutonHaut.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    let scrollEnCours = false;

    const gererScroll = () => {
        const positionScroll = window.scrollY;

        if (header) {
            header.classList.toggle('scrolled', positionScroll > 80);
        }

        if (boutonHaut) {
            boutonHaut.classList.toggle('visible', positionScroll > 400);
        }

        scrollEnCours = false;
    };

    window.addEventListener('scroll', () => {
        if (!scrollEnCours) {
            window.requestAnimationFrame(gererScroll);
            scrollEnCours = true;
        }
    });

    gererScroll(); // état initial (utile si la page est rechargée en cours de scroll)


// COMPTE À REBOURS (accueil uniquement)

    const elJours = document.getElementById('jours');

    if (elJours) {
        const elHeures = document.getElementById('heures');
        const elMinutes = document.getElementById('minutes');
        const elSecondes = document.getElementById('secondes');

        /* Cérémonie d'ouverture : 5 octobre 2026, 09h00 (heure locale du visiteur) */
        const dateEvenement = new Date('2026-10-05T09:00:00');

        const formaterDeuxChiffres = (nombre) => String(nombre).padStart(2, '0');

        const mettreAJourCompteAReculons = () => {
            const maintenant = new Date();
            const difference = dateEvenement - maintenant;

            if (difference <= 0) {
                elJours.textContent = '00';
                elHeures.textContent = '00';
                elMinutes.textContent = '00';
                elSecondes.textContent = '00';
                clearInterval(intervalCompteAReculons);
                return;
            }

            const jours = Math.floor(difference / (1000 * 60 * 60 * 24));
            const heures = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / (1000 * 60)) % 60);
            const secondes = Math.floor((difference / 1000) % 60);

            elJours.textContent = formaterDeuxChiffres(jours);
            elHeures.textContent = formaterDeuxChiffres(heures);
            elMinutes.textContent = formaterDeuxChiffres(minutes);
            elSecondes.textContent = formaterDeuxChiffres(secondes);
        };

        mettreAJourCompteAReculons();
        const intervalCompteAReculons = setInterval(mettreAJourCompteAReculons, 1000);
    }


// COMPTEURS ANIMÉS (chiffres clés, accueil uniquement)

    const compteurs = document.querySelectorAll('.compteur');

    if (compteurs.length > 0) {
        const dureeAnimation = 1500; // ms

        const animerCompteur = (element) => {
            const valeurCible = parseInt(element.dataset.cible, 10);
            const debut = performance.now();

            const etapeAnimation = (tempsActuel) => {
                const progression = Math.min((tempsActuel - debut) / dureeAnimation, 1);
                element.textContent = Math.floor(progression * valeurCible);

                if (progression < 1) {
                    requestAnimationFrame(etapeAnimation);
                } else {
                    element.textContent = valeurCible;
                }
            };

            requestAnimationFrame(etapeAnimation);
        };

        const observateurCompteurs = new IntersectionObserver((entrees, observateur) => {
            entrees.forEach((entree) => {
                if (entree.isIntersecting) {
                    animerCompteur(entree.target);
                    observateur.unobserve(entree.target);
                }
            });
        }, { threshold: 0.5 });

        compteurs.forEach((compteur) => observateurCompteurs.observe(compteur));
    }


//  APPARITION AU SCROLL (.reveal — cartes de l'accueil)

    const elementsReveal = document.querySelectorAll('.reveal');

    if (elementsReveal.length > 0) {
        const observateurReveal = new IntersectionObserver((entrees, observateur) => {
            entrees.forEach((entree) => {
                if (entree.isIntersecting) {
                    entree.target.classList.add('visible');
                    observateur.unobserve(entree.target);
                }
            });
        }, { threshold: 0.15 });

        elementsReveal.forEach((element) => observateurReveal.observe(element));
    }


//  ONGLETS DU PROGRAMME (programme.html uniquement)

    const ongletsBoutons = document.querySelectorAll('.onglet-btn');

    if (ongletsBoutons.length > 0) {
        const panneauxJour = document.querySelectorAll('.jour-panel');

        ongletsBoutons.forEach((bouton) => {
            bouton.addEventListener('click', () => {
                const jourCible = bouton.dataset.jour;

                ongletsBoutons.forEach((b) => {
                    b.classList.remove('actif');
                    b.setAttribute('aria-selected', 'false');
                });
                bouton.classList.add('actif');
                bouton.setAttribute('aria-selected', 'true');

                panneauxJour.forEach((panneau) => {
                    panneau.hidden = panneau.id !== jourCible;
                });
            });
        });
    }


//  FILTRES DES INTERVENANTS (intervenants.html uniquement)

    const filtresBoutons = document.querySelectorAll('.filtre-btn');

    if (filtresBoutons.length > 0) {
        const cartesIntervenants = document.querySelectorAll('.carte-intervenant');

        filtresBoutons.forEach((bouton) => {
            bouton.addEventListener('click', () => {
                const filtreChoisi = bouton.dataset.filtre;

                filtresBoutons.forEach((b) => b.classList.remove('actif'));
                bouton.classList.add('actif');

                cartesIntervenants.forEach((carte) => {
                    const correspond = filtreChoisi === 'tous' || carte.dataset.categorie === filtreChoisi;
                    carte.classList.toggle('masquee', !correspond);
                });
            });
        });
    }


//  FORMULAIRE DE CONTACT (contact.html uniquement)

    const formulaireContact = document.querySelector('form[novalidate]');

    if (formulaireContact) {
        const messagesErreur = {
            nom: 'Merci d\u2019indiquer votre nom complet.',
            email: 'Merci d\u2019indiquer une adresse email valide.',
            telephone: 'Merci d\u2019indiquer un num\u00e9ro de t\u00e9l\u00e9phone valide.',
            participation: 'Merci de choisir un type de participation.',
            pays: 'Merci de choisir votre pays.',
            message: 'Votre message doit contenir au moins 20 caract\u00e8res.'
        };

        const trouverSpanErreur = (champ) => champ.closest('.champ')?.querySelector('.erreur');

        const validerChamp = (champ) => {
            const spanErreur = trouverSpanErreur(champ);
            if (!spanErreur) return true;

            if (!champ.checkValidity()) {
                spanErreur.textContent = messagesErreur[champ.name] || 'Ce champ est invalide.';
                return false;
            }

            spanErreur.textContent = '';
            return true;
        };

        const tousLesChamps = formulaireContact.querySelectorAll('input, select, textarea');

        /* Validation au fur et à mesure, quand l'utilisateur quitte un champ */
        tousLesChamps.forEach((champ) => {
            champ.addEventListener('blur', () => validerChamp(champ));
        });

        /* type="tel" ne valide aucun format côté navigateur : on ajoute
           un contrôle minimal via setCustomValidity (chiffres, espaces,
           +, -, parenthèses, 8 caractères significatifs minimum) */
        const champTelephone = formulaireContact.querySelector('#telephone');
        if (champTelephone) {
            const regexTelephone = /^[+]?[\d\s().-]{8,}$/;

            champTelephone.addEventListener('input', () => {
                const valeur = champTelephone.value.trim();
                const estValide = valeur === '' || regexTelephone.test(valeur);
                champTelephone.setCustomValidity(estValide ? '' : 'format-invalide');
            });
        }

        const messageSucces = formulaireContact.querySelector('.succes');

        formulaireContact.addEventListener('submit', (evenement) => {
            evenement.preventDefault();

            let formulaireValide = true;
            tousLesChamps.forEach((champ) => {
                if (!validerChamp(champ)) {
                    formulaireValide = false;
                }
            });

            if (!formulaireValide) {
                if (messageSucces) messageSucces.hidden = true;
                /* Amène le premier champ en erreur à l'écran */
                const premierChampInvalide = formulaireContact.querySelector(':invalid');
                premierChampInvalide?.focus();
                return;
            }

            /* Pas de backend ici : on simule l'envoi côté front */
            if (messageSucces) {
                messageSucces.hidden = false;
                setTimeout(() => {
                    messageSucces.hidden = true;
                }, 6000);
            }

            formulaireContact.reset();
        });
    }

});