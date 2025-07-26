const questions = [
  // Theme 1 – Vision for City Transport
  { text: "Cities should prioritize expanding highways and parking to reduce traffic congestion.", axis1: -1, axis2: -0.5 },
  { text: "Investment in high-quality public transit networks is essential for future urban mobility.", axis1: 1, axis2: -0.5 },
  { text: "Flexible, on-demand transport services should complement existing transit options.", axis1: 0, axis2: 1 },
  { text: "Preserving the existing street layout and avoiding radical redesigns is best for mobility.", axis1: -0.5, axis2: -1 },
  { text: "Urban transport planning must actively include cycling and pedestrian infrastructure development.", axis1: 1, axis2: 0 },

  // Theme 2 – Environmental & Sustainability
  { text: "Reducing vehicle emissions is urgent and justifies restricting car use in city centers.", axis1: 1, axis2: 0 },
  { text: "Technological advances in vehicle emissions reduction mean no need to limit private car use.", axis1: -1, axis2: 1 },
  { text: "Public transit should adopt clean energy solutions even if costs rise temporarily.", axis1: 1, axis2: 1 },
  { text: "The current transport system is sufficient; focusing on user behavior is more important than infrastructure changes.", axis1: 0, axis2: -1 },
  { text: "Cities should prioritize green spaces over new transport infrastructure, even if it reduces road capacity.", axis1: 0.5, axis2: 0 },

  // Theme 3 – Technology and Innovation
  { text: "Autonomous vehicles will significantly improve traffic flow and safety.", axis1: 0, axis2: 1 },
  { text: "Micromobility options (like e-scooters and bike shares) are key to solving first-/last-mile issues.", axis1: 1, axis2: 1 },
  { text: "Traditional bus and rail systems remain more reliable than emerging mobility technologies.", axis1: 1, axis2: -1 },
  { text: "Ride-sharing services increase congestion and should be limited.", axis1: -0.5, axis2: -0.5 },
  { text: "Smart city technologies managing traffic lights and flows should be widely implemented.", axis1: 0, axis2: 1 },

  // Theme 4 – Personal Mobility and Convenience
  { text: "Having personal access to a private vehicle is essential for daily convenience.", axis1: -1, axis2: 0 },
  { text: "Public transit should be convenient, frequent, and reliable enough to replace car trips.", axis1: 1, axis2: 0 },
  { text: "I am open to using emerging mobility options even if they are new or unfamiliar.", axis1: 0, axis2: 1 },
  { text: "Changes to familiar travel routines reduce convenience and should be minimized.", axis1: -0.5, axis2: -1 },
  { text: "Walking and cycling are enjoyable alternatives to motorized transport when practical.", axis1: 1, axis2: 0 },

  // Theme 5 – Equity, Access, and Affordability
  { text: "Public transit fares should be subsidized to ensure affordability for all residents.", axis1: 1, axis2: 0 },
  { text: "Investments should focus on improving private road infrastructure equally for all neighborhoods.", axis1: -1, axis2: -0.5 },
  { text: "New mobility technologies should be accessible and affordable, not just premium options.", axis1: 0.5, axis2: 1 },
  { text: "It’s acceptable for premium or luxury transport options to have higher prices.", axis1: -0.5, axis2: 0 },
  { text: "Mobility solutions must prioritize accessibility for people with disabilities and the elderly.", axis1: 1, axis2: 0 },

  // Theme 6 – Urban Lifestyle and Public Space
  { text: "Cities should expand pedestrian-only zones and reduce car access downtown.", axis1: 1, axis2: 0 },
  { text: "Streets should primarily accommodate cars to support commerce and delivery needs.", axis1: -1, axis2: -0.5 },
  { text: "Smart street designs balancing multiple uses and technologies improve urban life.", axis1: 0, axis2: 1 },
  { text: "Urban public spaces decline if too much space is given to non-traditional mobility modes.", axis1: -0.5, axis2: -1 },
  { text: "Cycling infrastructure improves the livability and attractiveness of neighborhoods.", axis1: 1, axis2: 0 }
];

const maxAxis1 = questions.reduce((sum, q) => sum + Math.abs(q.axis1 * 2), 0);
const maxAxis2 = questions.reduce((sum, q) => sum + Math.abs(q.axis2 * 2), 0);

const form = document.getElementById("surveyForm");
const resultsDiv = document.getElementById("results");
const interpretationEl = document.getElementById("interpretation");

function renderQuestions() {
  questions.forEach((q, index) => {
    const div = document.createElement("div");
    div.className = "question";
    div.innerHTML = `<p><strong>Q${index + 1}:</strong> ${q.text}</p>
      <div class="likert">
        ${[1,2,3,4,5].map(value => `
          <label>
            <input type="radio" name="q${index}" value="${value}" required> ${value}
          </label>
        `).join('')}
      </div>`;
    form.appendChild(div);
  });
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

function scoreSurvey() {
  let sum1 = 0, sum2 = 0;
  questions.forEach((q, index) => {
    const val = parseInt(document.querySelector(`input[name="q${index}"]:checked`).value);
    const adjusted = val - 3; // Center at 0
    sum1 += adjusted * q.axis1;
    sum2 += adjusted * q.axis2;
  });
  return {
    axis1: sum1 / maxAxis1,
    axis2: sum2 / maxAxis2
  };
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

  // Ensure all questions are answered
  const allAnswered = questions.every((_, i) => document.querySelector(`input[name="q${i}"]:checked`));
  if (!allAnswered) {
    alert("Please answer all questions before submitting.");
    return;
  }

  const scores = scoreSurvey();
  resultsDiv.style.display = "block";
  interpretationEl.innerHTML = getInterpretation(scores.axis1, scores.axis2);
  plotCompass(scores.axis1, scores.axis2);
});

renderQuestions();
