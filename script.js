/* =========================
   BACKEND URL
   ========================= */

const API_URL =
    "http://10.5.14.229:8001/analyze";


/* =========================
   GET HTML ELEMENTS
   ========================= */

const problemText =
    document.getElementById("problemText");

const characterCount =
    document.getElementById("characterCount");

const analyzeButton =
    document.getElementById("analyzeButton");

const loading =
    document.getElementById("loading");

const results =
    document.getElementById("results");

const errorMessage =
    document.getElementById("errorMessage");


/* =========================
   CHARACTER COUNTER
   ========================= */

problemText.addEventListener(
    "input",
    function () {

        const count =
            problemText.value.length;

        characterCount.innerText =
            `${count} characters`;

    }
);


/* =========================
   ANALYZE FUNCTION
   ========================= */

async function analyzeRequirement() {

    const text =
        problemText.value.trim();


    if (!text) {

        showError(
            "Please enter a problem statement first."
        );

        return;

    }


    /* UI state */

    analyzeButton.disabled = true;

    loading.classList.remove("hidden");

    results.classList.add("hidden");

    errorMessage.classList.add("hidden");


    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        text: text
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Server returned an error."
            );

        }


        const data =
            await response.json();


        if (data.error) {

            throw new Error(
                data.error
            );

        }


        displayResults(data);

    }


    catch (error) {

        console.error(error);

        showError(
            "Could not connect to the backend. Make sure the backend is running."
        );

    }


    finally {

        analyzeButton.disabled = false;

        loading.classList.add("hidden");

    }

}


/* =========================
   DISPLAY RESULTS
   ========================= */

function displayResults(data) {


    document.getElementById(
        "scoreValue"
    ).innerText =
        data.readiness_score ?? 0;


    renderList(
        "explicitRequirements",
        data.explicit_requirements
    );


    renderList(
        "hiddenRequirements",
        data.hidden_requirements
    );


    renderList(
        "edgeCases",
        data.edge_cases
    );


    renderList(
        "securityConcerns",
        data.security_concerns
    );


    renderList(
        "suggestedFeatures",
        data.suggested_features
    );


    document.getElementById(
        "overallAnalysis"
    ).innerText =
        data.overall_analysis ||
        "No analysis available.";


    results.classList.remove(
        "hidden"
    );


    results.scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================
   CREATE LIST ITEMS
   ========================= */

function renderList(
    elementId,
    items
) {

    const element =
        document.getElementById(elementId);


    element.innerHTML = "";


    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        const li =
            document.createElement("li");

        li.innerText =
            "Nothing identified.";

        element.appendChild(li);

        return;

    }


    items.forEach(item => {

        const li =
            document.createElement("li");

        li.innerText =
            item;

        element.appendChild(li);

    });

}


/* =========================
   ERROR
   ========================= */

function showError(message) {

    errorMessage.innerText =
        message;

    errorMessage.classList.remove(
        "hidden"
    );

}


/* =========================
   SAMPLE PROBLEM STATEMENTS
   ========================= */

function loadSample(type) {

    const samples = {

        education:
            "Build a platform that helps students find personalized learning resources based on their subjects, academic performance and learning goals.",

        healthcare:
            "Build a healthcare platform where patients can book appointments, manage medical records and receive reminders from healthcare providers.",

        cyber:
            "Build a cybersecurity system that monitors network activity and identifies suspicious behavior in real time."

    };


    problemText.value =
        samples[type] || "";


    problemText.dispatchEvent(
        new Event("input")
    );

}