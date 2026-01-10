document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('financial-health-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Calculate Scores
            const formData = new FormData(form);

            // Prepare full data for saving
            const resultsData = {
                timestamp: new Date().toLocaleString(),
                visitor_name: formData.get('visitor_name'),
                visitor_age: formData.get('visitor_age'),
                responses: {}
            };

            // Collect all responses
            for (let [key, value] of formData.entries()) {
                if (key.startsWith('q')) {
                    if (resultsData.responses[key]) {
                        // Handle checkboxes (multiple values)
                        if (!Array.isArray(resultsData.responses[key])) {
                            resultsData.responses[key] = [resultsData.responses[key]];
                        }
                        resultsData.responses[key].push(value);
                    } else {
                        resultsData.responses[key] = value;
                    }
                }
            }

            // Pillar 1: Clarté financière (Q4, Q5, Q6)
            let p1Score = 0;
            p1Score += parseInt(getScore("q4")) || 0;
            p1Score += parseInt(getScore("q5")) || 0;
            p1Score += parseInt(getScore("q6")) || 0;

            // Pillar 2: Sécurité financière (Q7, Q8, Q9, Q11)
            let p2Score = 0;
            p2Score += parseInt(getScore("q7")) || 0;
            p2Score += parseInt(getScore("q8")) || 0;
            p2Score += parseInt(getScore("q9")) || 0;
            p2Score += parseInt(getScore("q11")) || 0;

            // Pillar 3: Charge mentale & relation à l’argent (Q12, Q13, Q14)
            let p3Score = 0;
            p3Score += parseInt(getScore("q12")) || 0;
            p3Score += parseInt(getScore("q13")) || 0;
            p3Score += parseInt(getScore("q14")) || 0;

            // Pillar 4: Motivation & engagement (Q15, Q16)
            let p4Score = 0;
            p4Score += parseInt(getScore("q16")) || 0;

            const totalScore = p1Score + p2Score + p3Score;

            // Add scores to data
            resultsData.scores = {
                total: totalScore,
                pillars: { p1: p1Score, p2: p2Score, p3: p3Score, p4: p4Score }
            };

            // 2. Save Results (Async)
            saveResultsToGoogleSheet(resultsData);

            // 3. Generate Result Content
            const resultHTML = generateResultHTML(totalScore, p1Score, p2Score, p3Score, p4Score);

            // 4. Display Results
            const contentSection = document.querySelector('.questionnaire-content .container');
            contentSection.innerHTML = resultHTML;

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    async function saveResultsToGoogleSheet(data) {
        // REPLACE THIS URL with your Google Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwoy_KCW1K45QK8op3lD8NDrF9G6GoWwe69BdcUi9VEbaAiEu1_TmvIMAxcWti0a7UWAg/exec';

        if (!scriptURL || scriptURL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE')) {
            console.log('Results collected but not sent: scriptURL not configured.', data);
            return;
        }

        try {
            // Using fetch with no-cors if needed, but standard should work with correct App Script setup
            await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors', // simpler for basic logging to Sheets
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            console.log('Results successfully sent');
        } catch (error) {
            console.error('Error saving results:', error);
        }
    }

    function getScore(name) {
        const input = document.querySelector(`input[name="${name}"]:checked`);
        return input ? input.dataset.score : 0;
    }

    function generateResultHTML(total, p1, p2, p3, p4) {
        // Global Interpretation
        let globalTitle, globalDesc, globalColor;
        if (total >= 22) {
            globalTitle = "Santé financière solide et saine";
            globalDesc = "Bravo ! Votre situation est globalement saine. Vous avez de bonnes bases, il ne reste plus qu'à optimiser pour aller plus loin.";
            globalColor = "#2a845e"; // Success
        } else if (total >= 12) {
            globalTitle = "Équilibre fragile";
            globalDesc = "Vous êtes sur la bonne voie, mais certains piliers méritent votre attention pour éviter que la situation ne devienne stressante. Un accompagnement ciblé pourrait vous aider à franchir un cap.";
            globalColor = "#D4A373"; // Warning/Orange
        } else {
            globalTitle = "Priorité à la sérénité";
            globalDesc = "Votre situation actuelle semble générer du stress ou manquer de clarté. C'est le moment idéal pour poser tout à plat et reprendre le contrôle, pas à pas. Ne restez pas seul(e) face à cela.";
            globalColor = "#e17055"; // Danger/Red
        }

        return `
            <div class="result-card fade-in-up">
                <h2 style="color: ${globalColor}">${globalTitle}</h2>
                <div class="score-circle" style="border-color: ${globalColor}">
                    <span class="score-number">${total}</span>
                    <span class="score-total">/ 30</span>
                </div>
                <p class="result-description">${globalDesc}</p>
                
                <div class="pillars-grid">
                    <div class="pillar-card">
                        <h3>Clarté Financière</h3>
                        <div class="progress-bar"><div class="fill" style="width: ${(p1 / 9) * 100}%"></div></div>
                        <p>${getPillarText(p1, 7, 4, "Situation claire", "Clarté partielle", "Manque de visibilité")}</p>
                    </div>
                    <div class="pillar-card">
                        <h3>Sécurité Financière</h3>
                        <div class="progress-bar"><div class="fill" style="width: ${(p2 / 12) * 100}%"></div></div>
                        <p>${getPillarText(p2, 9, 5, "Base sécurisante", "Sécurité fragile", "Insécurité financière")}</p>
                    </div>
                    <div class="pillar-card">
                        <h3>Charge Mentale</h3>
                        <div class="progress-bar"><div class="fill" style="width: ${(p3 / 9) * 100}%"></div></div>
                        <p>${getPillarText(p3, 7, 4, "Relation sereine", "Tensions ponctuelles", "Stress élevé")}</p>
                    </div>
                    <div class="pillar-card">
                        <h3>Motivation</h3>
                        <div class="progress-bar"><div class="fill" style="width: ${(p4 / 3) * 100}%"></div></div> <!-- Assuming max 3 for Q16? or raw? P4 logic vague, using scale-->
                        <p>${p4 >= 4 ? "Motivation présente" : "Priorité secondaire"}</p> 
                    </div>
                </div>

                <div class="cta-actions">
                    <p>Envie d'aller plus loin et d'en parler ?</p>
                    <a href="index.html#contact" class="btn btn-primary">Réserver mon appel découverte gratuit</a>
                </div>
            </div>
        `;
    }

    function getPillarText(score, highThresh, midThresh, highTxt, midTxt, lowTxt) {
        if (score >= highThresh) return `<strong>${highTxt}</strong>`;
        if (score >= midThresh) return `<strong>${midTxt}</strong>`;
        return `<strong>${lowTxt}</strong>`;
    }
});
