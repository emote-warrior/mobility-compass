const questions = [
  // Theme 1 – Vision for City Transport
  { type: "statement", text: "Let’s start by considering how the city’s transport should evolve to meet future needs." },
  { type: "question", text: "Cities should prioritize expanding highways and parking to reduce traffic congestion.", axis1: -1, axis2: -0.5 },
  { type: "question", text: "Investment in high-quality public transit networks is essential for future urban mobility.", axis1: 1, axis2: -0.5 },
  { type: "question", text: "Flexible, on-demand transport services should complement existing transit options.", axis1: 0, axis2: 1 },
  { type: "question", text: "Preserving the existing street layout and avoiding radical redesigns is best for mobility.", axis1: -0.5, axis2: -1 },
  { type: "question", text: "Urban transport planning must actively include cycling and pedestrian infrastructure development.", axis1: 1, axis2: 0 },

  // Theme 2 – Environmental and Sustainability
  { type: "statement", text: "Here are some statements about the environment and how transport affects it." },
  { type: "question", text: "Reducing vehicle emissions is urgent and justifies restricting car use in city centers.", axis1: 1, axis2: 0 },
  { type: "question", text: "Technological advances in vehicle emissions reduction mean no need to limit private car use.", axis1: -1, axis2: 1 },
  { type: "question", text: "Public transit should adopt clean energy solutions even if costs rise temporarily.", axis1: 1, axis2: 1 },
  { type: "question", text: "The current transport system is sufficient; focusing on user behavior is more important than infrastructure changes.", axis1: 0, axis2: -1 },
  { type: "question", text: "Cities should prioritize green spaces over new transport infrastructure, even if it reduces road capacity.", axis1: 0.5, axis2: 0 },

  // Theme 3 – Technology and Innovation in Mobility
  { type: "statement", text: "Now, a few ideas about new technology and innovation in urban mobility." },
  { type: "question", text: "Autonomous vehicles will significantly improve traffic flow and safety.", axis1: 0, axis2: 1 },
  { type: "question", text: "Micromobility options (like e-scooters and bike shares) are key to solving first-/last-mile issues.", axis1: 1, axis2: 1 },
  { type: "question", text: "Traditional bus and rail systems remain more reliable than emerging mobility technologies.", axis1: 1, axis2: -1 },
  { type: "question", text: "Ride-sharing services increase congestion and should be limited.", axis1: -0.5, axis2: -0.5 },
  { type: "question", text: "Smart city technologies managing traffic lights and flows should be widely implemented.", axis1: 0, axis2: 1 },

  // Theme 4 – Personal Mobility and Convenience
  { type: "statement", text: "Next, please tell us your thoughts on your own travel preferences and experiences." },
  { type: "question", text: "Having personal access to a private vehicle is essential for daily convenience.", axis1: -1, axis2: 0 },
  { type: "question", text: "Public transit should be convenient, frequent, and reliable enough to replace car trips.", axis1: 1, axis2: 0 },
  { type: "question", text: "I am open to using emerging mobility options even if they are new or unfamiliar.", axis1: 0, axis2: 1 },
  { type: "question", text: "Changes to familiar travel routines reduce convenience and should be minimized.", axis1: -0.5, axis2: -1 },
  { type: "question", text: "Walking and cycling are enjoyable alternatives to motorized transport when practical.", axis1: 1, axis2: 0 },

  // Theme 5 – Equity, Access, and Affordability
  { type: "statement", text: "Let’s look at who should benefit from various mobility options in the city." },
  { type: "question", text: "Public transit fares should be subsidized to ensure affordability for all residents.", axis1: 1, axis2: 0 },
  { type: "question", text: "Investments should focus on improving private road infrastructure equally for all neighborhoods.", axis1: -1, axis2: -0.5 },
  { type: "question", text: "New mobility technologies should be accessible and affordable, not just premium options.", axis1: 0.5, axis2: 1 },
  { type: "question", text: "It’s acceptable for premium or luxury transport options to have higher prices.", axis1: -0.5, axis2: 0 },
  { type: "question", text: "Mobility solutions must prioritize accessibility for people with disabilities and the elderly.", axis1: 1, axis2: 0 },

  // Theme 6 – Urban Lifestyle and Public Space
  { type: "statement", text: "Finally, some propositions about how transport fits with life in the city." },
  { type: "question", text: "Cities should expand pedestrian-only zones and reduce car access downtown.", axis1: 1, axis2: 0 },
  { type: "question", text: "Streets should primarily accommodate cars to support commerce and delivery needs.", axis1: -1, axis2: -0.5 },
  { type: "question", text: "Smart street designs balancing multiple uses and technologies improve urban life.", axis1: 0, axis2: 1 },
  { type: "question", text: "Urban public spaces decline if too much space is given to non-traditional mobility modes.", axis1: -0.5, axis2: -1 },
  { type: "question", text: "Cycling infrastructure improves the livability and attractiveness of neighborhoods.", axis1: 1, axis2: 0 }
];

const maxAxis1 = questions.filter(q => q.type === "question").reduce((sum, q) => sum + Math.abs(q.axis1 * 2), 0);
const maxAxis2 = questions.filter(q => q.type === "question").reduce((sum, q) => sum + Math.abs(q.axis2 * 2), 0);

const form = document.getElementById("surveyForm");
const resultsDiv = document.getElementById("results");
const interpretationEl = document.getElementById("interpretation");
const progressBar = document.getElementById("progress-bar");
const errorBox = document.getElementById("error-box");

function renderQuestions() {
  let questionIndex = 0;
  const scaleLabels = [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree"
  ];

  questions.forEach((item) => {
    const div = document.createElement("div");
    div.className = "question";

    if (item.type === "statement") {
      div.innerHTML = `<p style="font-style: italic; font-weight: bold; margin-top: 40px;">${item.text}</p>`;
    } else if (item.type === "question") {
      div.innerHTML = `<p><strong>Q${questionIndex + 1}:</strong> ${item.text}</p>
        <div class="likert">
          ${[1, 2, 3, 4, 5].map(value => `
            <label>
              <input type="radio" name="q${questionIndex}" value="${value}">
              ${scaleLabels[value - 1]}
            </label>
          `).join('')}
        </div>`;
      questionIndex++;
    }

    form.appendChild(div);
  });

  // Add change listener for progress tracking
  document.querySelectorAll('input[type="radio"]').forEach(input => {
    input.addEventListener('change', updateProgress);
  });
}

function updateProgress() {
  const totalQuestions = questions.filter(q => q.type === "question").length;
  let answered = 0;
  for (let i = 0; i < totalQuestions; i++) {
    if (document.querySelector(`input[name="q${i}"]:checked`)) {
      answered++;
    }
  }
  const percent = Math.round((answered / totalQuestions) * 100);
  progressBar.style.width = `${percent}%`;
  progressBar.innerText = `${percent}%`;
}

function scoreSurvey() {
  let sum1 = 0, sum2 = 0, qIndex = 0;
  questions.forEach((item) => {
    if (item.type === "question") {
      const val = parseInt(document.querySelector(`input[name="q${qIndex}"]:checked`).value);
      const adjusted = val - 3;
      sum1 += adjusted * item.axis1;
      sum2 += adjusted * item.axis2;
      qIndex++;
    }
  });
  return {
    axis1: sum1 / maxAxis1,
    axis2: sum2 / maxAxis2
  };
}

function getInterpretation(x, y) {
  const horizontal = x > 0 ? "Public/Active Transit-Oriented" : "Private Vehicle-Centric";
  const vertical = y > 0 ? "Innovation-Oriented" : "Tradition-Preferring";
  let quadrantLabel = "";
  if (x > 0 && y > 0) quadrantLabel = "Progressive Transit Supporter";
  else if (x < 0 && y > 0) quadrantLabel = "Tech-Savvy Car Advocate";
  else if (x > 0 && y < 0) quadrantLabel = "Traditional Transit Believer";
  else if (x < 0 && y < 0) quadrantLabel = "Conventional Car-Oriented Thinker";
  return `You lean toward <strong>${horizontal}</strong> and <strong>${vertical}</strong> mobility thinking.<br><br>Your quadrant: <strong>${quadrantLabel}</strong>`;
}

function plotCompass(x, y) {
  const ctx = document.getElementById('mobilityChart').getContext('2d');
  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Your Position',
        data: [{ x, y }],
        backgroundColor: 'blue'
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          min: -1, max: 1,
          title: {
            display: true,
            text: 'Private Vehicle <-> Public/Active Transit'
          },
          grid: { color: '#ddd' }
        },
        y: {
          min: -1, max: 1,
          title: {
            display: true,
            text: 'Tradition <-> Innovation'
          },
          grid: { color: '#ddd' }
        }
      }
    }
  });
}

document.getElementById("submitBtn").addEventListener("click", function(e) {
  e.preventDefault();
  errorBox.innerHTML = "";

  const totalQuestions = questions.filter(q => q.type === "question").length;
  for (let i = 0; i < totalQuestions; i++) {
    if (!document.querySelector(`input[name="q${i}"]:checked`)) {
      errorBox.innerHTML = "Please complete all questions before submitting.";
      return;
    }
  }

  const scores = scoreSurvey();
  resultsDiv.style.display = "block";
  interpretationEl.innerHTML = getInterpretation(scores.axis1, scores.axis2);
  plotCompass(scores.axis1, scores.axis2);
});

renderQuestions();
