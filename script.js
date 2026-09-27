const formulaire = document.getElementById("formulaire");
const resultat = document.getElementById("resultat");
const message = document.getElementById("message");
const resume = document.getElementById("resume");
const scoreElement = document.getElementById("score-value");
const scoreSpace = document.getElementById("score-space");
const compteurMesures = document.getElementById("mesures-completees");
const champsMesures = formulaire.querySelectorAll("input[type='number']");
const canvasHistorique = document.getElementById("history-chart");
const historiqueVide = document.getElementById("history-empty");
const messageGraphique = document.getElementById("chart-fallback");
const boutonExport = document.getElementById("export-pdf");
const dateRapport = document.getElementById("report-date");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const themeColorMeta = document.getElementById("theme-color-meta");
const pageLoader = document.getElementById("page-loader");
const loaderTrack = pageLoader.querySelector("[role='progressbar']");
const loaderProgress = document.getElementById("loader-progress");
const loaderPercent = document.getElementById("loader-percent");
let graphiqueMesures = null;

try {
    localStorage.removeItem("homesense-history");
} catch (error) {
    // Le graphe fonctionne aussi si le navigateur bloque le stockage.
}

// La barre attend le chargement réel avant d’afficher 100 %.
let progressionChargement = 0;
let chargementTermine = false;
const minuterieChargement = window.setInterval(function() {
    progressionChargement = Math.min(progressionChargement + 2, 90);
    actualiserProgressionChargement(progressionChargement);
}, 70);
const delaiMaximum = window.setTimeout(terminerChargement, 12000);

function actualiserProgressionChargement(pourcentage) {
    loaderProgress.style.width = pourcentage + "%";
    loaderPercent.textContent = pourcentage + "%";
    loaderTrack.setAttribute("aria-valuenow", String(pourcentage));
}

function terminerChargement() {
    if (chargementTermine) return;
    chargementTermine = true;
    window.clearInterval(minuterieChargement);
    window.clearTimeout(delaiMaximum);
    actualiserProgressionChargement(100);
    window.setTimeout(function() {
        pageLoader.classList.add("is-hidden");
        pageLoader.setAttribute("aria-hidden", "true");
    }, 220);
}

if (document.readyState === "complete") {
    terminerChargement();
} else {
    window.addEventListener("load", terminerChargement, { once: true });
}

// Ces fonctions affichent les quatre indices du dernier diagnostic.
function couleurCSS(nom) {
    return getComputedStyle(document.documentElement).getPropertyValue(nom).trim();
}

function actualiserCouleursGraphique() {
    if (!graphiqueMesures) return;

    const couleurTexte = couleurCSS("--secondary-text");
    const couleurGrille = couleurCSS("--line");

    graphiqueMesures.options.color = couleurTexte;
    graphiqueMesures.options.scales.x.grid.color = couleurGrille;
    graphiqueMesures.options.scales.y.grid.color = couleurGrille;
    graphiqueMesures.options.plugins.tooltip.backgroundColor = couleurCSS("--panel");
    graphiqueMesures.update();
}

function actualiserGraphique(indices) {
    if (!graphiqueMesures) {
        messageGraphique.hidden = false;
        return;
    }

    messageGraphique.hidden = true;
    historiqueVide.hidden = Boolean(indices);

    if (!indices) return;

    graphiqueMesures.data.datasets[0].data = [
        indices.temperature,
        indices.humidite,
        indices.luminosite,
        indices.consommation
    ];
    graphiqueMesures.update();
}

function initialiserGraphique() {
    if (typeof Chart === "undefined") {
        historiqueVide.hidden = true;
        messageGraphique.hidden = false;
        return;
    }

    graphiqueMesures = new Chart(canvasHistorique, {
        type: "bar",
        data: {
            labels: ["Température", "Humidité", "Lumière", "Énergie"],
            datasets: [{
                label: "Indice de confort",
                data: [],
                backgroundColor: ["#4b795b", "#d57a60", "#b39143", "#4c9991"],
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            color: couleurCSS("--secondary-text"),
            plugins: {
                legend: { position: "top" },
                tooltip: { callbacks: { label: function(context) {
                    return context.dataset.label + " : " + context.formattedValue + "%";
                } } }
            },
            scales: {
                x: { grid: { color: couleurCSS("--line") } },
                y: {
                    min: 0,
                    max: 100,
                    grid: { color: couleurCSS("--line") },
                    ticks: { callback: function(valeur) { return valeur + "%"; } }
                }
            }
        }
    });

    actualiserGraphique(null);
}

// Calcule un indice simple de 0 à 100 pour chaque mesure.
function indiceConfort(temperature, humidite, luminosite, consommation) {
    let indiceTemperature = 100;
    if (temperature < 18) {
        indiceTemperature = 100 - (18 - temperature) * 12.5;
    } else if (temperature > 26) {
        indiceTemperature = 100 - (temperature - 26) * 12.5;
    }

    let indiceHumidite = 100;
    if (humidite > 60) {
        indiceHumidite = 100 - (humidite - 60) * 2.5;
    }

    const indiceLuminosite = Math.min(100, luminosite / 200 * 100);
    let indiceConsommation = 100;
    if (consommation > 500) {
        indiceConsommation = 100 - (consommation - 500) / 15;
    }

    return {
        temperature: Math.round(Math.max(0, indiceTemperature)),
        humidite: Math.round(Math.max(0, indiceHumidite)),
        luminosite: Math.round(indiceLuminosite),
        consommation: Math.round(Math.max(0, indiceConsommation))
    };
}

// Compare les mesures aux seuils et prépare les conseils à afficher.
function creerDiagnostics(temperature, humidite, luminosite, consommation) {
    const diagnostics = [];

    if (temperature < 18) {
        diagnostics.push({
            favorable: false,
            titre: "Température un peu fraîche.",
            conseil: "Pensez à réchauffer la pièce."
        });
    } else if (temperature > 26) {
        diagnostics.push({
            favorable: false,
            titre: "Température élevée.",
            conseil: "Aérez ou réduisez les sources de chaleur."
        });
    } else {
        diagnostics.push({
            favorable: true,
            titre: "Température dans la zone de confort.",
            conseil: "La température est bien équilibrée."
        });
    }

    if (humidite > 70) {
        diagnostics.push({
            favorable: false,
            titre: "Humidité élevée : restez vigilant.",
            conseil: "Aérez régulièrement pour limiter l’humidité."
        });
    } else {
        diagnostics.push({
            favorable: true,
            titre: "Humidité sous le seuil de vigilance.",
            conseil: "Le niveau mesuré est raisonnable."
        });
    }

    if (luminosite < 200) {
        diagnostics.push({
            favorable: false,
            titre: "Luminosité plutôt faible.",
            conseil: "Profitez davantage de la lumière naturelle."
        });
    } else {
        diagnostics.push({
            favorable: true,
            titre: "Luminosité suffisante.",
            conseil: "La pièce bénéficie d’un bon éclairage."
        });
    }

    if (consommation > 500) {
        diagnostics.push({
            favorable: false,
            titre: "Consommation à surveiller.",
            conseil: "Repérez les appareils énergivores en marche."
        });
    } else {
        diagnostics.push({
            favorable: true,
            titre: "Consommation maîtrisée.",
            conseil: "La puissance relevée reste modérée."
        });
    }

    return diagnostics;
}

function afficherDiagnostics(diagnostics) {
    message.textContent = "";

    for (const diagnostic of diagnostics) {
        const ligne = document.createElement("li");
        const icone = document.createElement("span");
        const texte = document.createElement("span");
        const titre = document.createElement("strong");

        icone.className = diagnostic.favorable ? "result-icon" : "result-icon warning";
        icone.setAttribute("aria-hidden", "true");
        icone.textContent = diagnostic.favorable ? "✓" : "!";
        titre.textContent = diagnostic.titre;
        texte.appendChild(titre);
        texte.appendChild(document.createElement("br"));
        texte.appendChild(document.createTextNode(diagnostic.conseil));
        ligne.appendChild(icone);
        ligne.appendChild(texte);
        message.appendChild(ligne);
    }
}

function animerScore(cible) {
    scoreElement.textContent = cible;
    scoreElement.classList.remove("score-value-pop");
    void scoreElement.offsetWidth;
    scoreElement.classList.add("score-value-pop");
}

// Applique le thème choisi à la page et au graphique.
function appliquerTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const modeSombre = theme === "dark";
    const libelle = modeSombre ? "Activer le mode clair" : "Activer le mode sombre";

    themeIcon.textContent = modeSombre ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", libelle);
    themeToggle.title = libelle;
    themeColorMeta.content = modeSombre ? "#18231e" : "#f4f5ef";
    actualiserCouleursGraphique();
}

let themeEnregistre = null;
try {
    themeEnregistre = localStorage.getItem("homesense-theme");
} catch (error) {
    // Le thème clair reste disponible si le navigateur bloque le stockage.
    themeEnregistre = null;
}
appliquerTheme(themeEnregistre === "dark" ? "dark" : "light");
initialiserGraphique();

themeToggle.addEventListener("click", function() {
    const nouveauTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    appliquerTheme(nouveauTheme);
    try {
        localStorage.setItem("homesense-theme", nouveauTheme);
    } catch (error) {
        // Le bouton continue de changer le thème jusqu’au prochain rechargement.
    }
});

function actualiserCompteur() {
    let nombreComplete = 0;

    for (const champ of champsMesures) {
        if (champ.value !== "" && champ.validity.valid) {
            nombreComplete++;
        }
    }

    compteurMesures.textContent = String(nombreComplete).padStart(2, "0");
}

champsMesures.forEach(function(champ) {
    champ.addEventListener("input", actualiserCompteur);
});

// Lance le diagnostic seulement lorsque les quatre champs sont valides.
formulaire.addEventListener("submit", function(event) {
    event.preventDefault();

    if (!formulaire.reportValidity()) return;

    const temperature = Number(document.getElementById("temp").value);
    const humidite = Number(document.getElementById("hum").value);
    const luminosite = Number(document.getElementById("lum").value);
    const consommation = Number(document.getElementById("conso").value);

    const mesures = creerDiagnostics(temperature, humidite, luminosite, consommation);
    let score = 0;
    for (const mesure of mesures) {
        if (mesure.favorable) score++;
    }

    let etat = "bad";
    let texteResume = "Plusieurs points méritent votre attention pour retrouver un meilleur équilibre.";

    if (score === 4) {
        etat = "good";
        texteResume = "Bel équilibre : votre pièce réunit de bonnes conditions de confort.";
    } else if (score >= 2) {
        etat = "medium";
        texteResume = "Quelques réglages simples peuvent encore améliorer le confort.";
    }

    resultat.classList.remove("good", "medium", "bad");
    resultat.classList.add(etat);
    animerScore(score);
    scoreSpace.style.width = (score / 4 * 100) + "%";
    resume.textContent = texteResume;
    afficherDiagnostics(mesures);

    document.getElementById("report-temp").textContent = temperature + " °C";
    document.getElementById("report-hum").textContent = humidite + " %";
    document.getElementById("report-lum").textContent = luminosite + " lux";
    document.getElementById("report-conso").textContent = consommation + " W";
    dateRapport.textContent = new Date().toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
    boutonExport.disabled = false;

    const indices = indiceConfort(temperature, humidite, luminosite, consommation);
    actualiserGraphique(indices);
});

document.getElementById("exemple").addEventListener("click", function() {
    document.getElementById("temp").value = 22;
    document.getElementById("hum").value = 50;
    document.getElementById("lum").value = 350;
    document.getElementById("conso").value = 320;
    actualiserCompteur();
    formulaire.requestSubmit();
});

boutonExport.addEventListener("click", function() {
    if (!boutonExport.disabled) window.print();
});
