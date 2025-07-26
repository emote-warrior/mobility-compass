const questions = [
  // Theme 1 – Vision for City Transport
  { type: "statement", text: "Let’s start by considering how the city’s transport should evolve to meet future needs." },
  { type: "question", text: "Cities should prioritise expanding highways and parking to reduce traffic congestion.", axis1: -1, axis2: -0.5 },
  { type: "question", text: "Investment decisions should balance public transit and road infrastructure to match city needs.", axis1: 0.5, axis2: -0.5 },
  { type: "question", text: "Zoning that encourages higher density near transit hubs can reduce car dependence.", axis1: 0.5, axis2: 0.5 },
  { type: "question", text: "Preserving the existing street layout and avoiding radical redesigns is best for mobility.", axis1: -0.5, axis2: -1 },
  { type: "question", text: "Maintaining and improving road networks for private vehicles is vital for effective city transport.", axis1: -1, axis2: 0 },

  // Theme 2 – Environmental and Sustainability Considerations
  { type: "statement", text: "Here are some statements about the environment and how transport affects it." },
  { type: "question", text: "Reducing emissions is important, but restrictions on car use should consider impacts on personal mobility.", axis1: 0.5, axis2: 0 },
  { type: "question", text: "Technological advances can reduce car pollution without restricting vehicle access.", axis1: -1, axis2: 0.5 },
  { type: "question", text: "Public transit should adopt clean energy solutions even if costs rise temporarily.", axis1: 0.5, axis2: 1 },
  { type: "question", text: "The current transport system is sufficient; focusing on user behavior is more important than infrastructure changes.", axis1: 0, axis2: -1 },
  { type: "question", text: "Congestion pricing or low emission zones can help manage urban traffic but may affect some commuters disproportionately.", axis1: 0.5, axis2: 0 },

  // Theme 3 – Technology and Innovation in Mobility
  { type: "statement", text: "Now, a few ideas about new technology and innovation in urban mobility." },
  { type: "question", text: "Electric vehicles are an important part of future urban mobility, but should not encourage unrestricted car use.", axis1: -0.5, axis2: 0.5 },
  { type: "question", text: "Micromobility options like e-scooters and bike shares help with last-mile connections but cannot replace cars for all trips.", axis1: 0.5, axis2: 1 },
  { type: "question", text: "Traditional bus and rail systems remain more reliable than emerging mobility technologies.", axis1: 1, axis2: -1 },
  { type: "question", text: "Innovation should also focus on improving personal vehicle technologies rather than replacing cars completely.", axis1: -1, axis2: 1 },
  { type: "question", text: "Smart city technologies that manage traffic flows should be widely implemented.", axis1: 0, axis2: 1 },

  // Theme 4 – Personal Mobility and Convenience
  { type: "statement", text: "Next, please tell us your thoughts on your travel preferences and experiences." },
  { type: "question", text: "Having personal access to a private vehicle is essential for daily convenience.", axis1: -1, axis2: 0 },
  { type: "question", text: "Public transit should be convenient, frequent, and reliable enough to replace many car trips.", axis1: 0.5, axis2: 0 },
  { type: "question", text: "I am open to using emerging mobility options even if they are new or unfamiliar.", axis1: 0, axis2: 1 },
  { type: "question", text: "Changes to familiar travel routines reduce convenience and should be minimised.", axis1: -0.5, axis2: -1 },
  { type: "question", text: "Owning and using a car remains the most practical choice for many daily commuters.", axis1: -1, axis2: 0 },

  // Theme 5 – Equity, Access, and Affordability
  { type: "statement", text: "Let’s look at who should benefit from various mobility options in the city." },
  { type: "question", text: "Public transit fares should be subsidised to ensure affordability for all residents.", axis1: 0.5, axis2: 0 },
  { type: "question", text: "Investments should focus on improving private road infrastructure equally for all neighborhoods.", axis1: -1, axis2: -0.5 },
  { type: "question", text: "New mobility technologies should be accessible and affordable, not just premium options.", axis1: 0.5, axis2: 1 },
  { type: "question", text: "Improving road infrastructure is essential to ensure mobility equity across all neighborhoods.", axis1: -1, axis2: 0 },
  { type: "question", text: "Mobility solutions must prioritise accessibility for people with disabilities and the elderly.", axis1: 0.5, axis2: 0 },

  // Theme 6 – Urban Lifestyle and Public Space
  { type: "statement", text: "Finally, some propositions about how transport fits with life in the city." },
  { type: "question", text: "Cities should expand pedestrian-only zones and reduce car access downtown, while balancing delivery and emergency access.", axis1: 0.5, axis2: 0 },
  { type: "question", text: "Managing parking availability is essential to encourage use of public transit and reduce traffic.", axis1: 0.5, axis2: 0 },
  { type: "question", text: "Smart street designs balancing multiple uses and technologies improve urban life.", axis1: 0, axis2: 1 },
  { type: "question", text: "Street design should balance the needs of cars alongside other transport users to support city commerce.", axis1: -0.5, axis2: -0.5 },
  { type: "question", text: "Cycling infrastructure improves the livability and attractiveness of neighborhoods.", axis1: 0.5, axis2: 0 },
];

const form = document.getElementById("surveyForm");
const resultsDiv = document.getElementById("results");
const interpretationEl = document.getElementById("interpretation");
const progressBar = document.getElementById("progress-bar");
const errorBox = document.getElementById("error-box");

const maxAxis1 = questions.filter(q => q.type === "question").reduce((sum, q) => sum + Math.abs(q.axis1 * 2), 0);
const maxAxis2 = questions.filter(q => q.type === "question").reduce((sum, q) => sum + Math.abs(q.axis2 * 2), 0);

// Global variable to track chart instance
let chartInstance = null;

function renderQuestions() {
  let questionIndex = 0;
  const scaleLabels = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

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

  const submitDiv = document.createElement("div");
  submitDiv.style.textAlign = "center";
  submitDiv.style.marginTop = "40px";
  submitDiv.innerHTML = `<button type="submit" id="submitBtn">See My Result</button>`;
  form.appendChild(submitDiv);

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
  let quadrantDescription = "";

  if (x >= 0 && y >= 0) {
    quadrantDescription = "You are supportive of public transit and open to new tech — showing enthusiasm for modern, sustainable mobility.";
  } else if (x < 0 && y >= 0) {
    quadrantDescription = "You prefer private vehicle use but embrace new mobility tech and innovation.";
  } else if (x < 0 && y < 0) {
    quadrantDescription = "You favor cars and traditional transport solutions, and are skeptical about change and innovation.";
  } else if (x >= 0 && y < 0) {
    quadrantDescription = "You favor public or active transit modes, but with traditional approaches and some caution toward new technologies.";
  }

  return `
    <strong>Your Mobility Profile</strong><br>
    ${quadrantDescription}<br><br>
    Transit Orientation Score: ${x.toFixed(2)}<br>
    Innovation Orientation Score: ${y.toFixed(2)}<br><br>

    <hr style="margin: 30px 0;">

    <p><strong>X-Axis:</strong> Private Vehicle-Oriented &lt;&gt; Public/Active Transit-Oriented</p>
    <p>This axis reflects your general preference for how urban mobility should be prioritised:</p>
    <ul>
      <li><strong>Negative end:</strong> A preference for private vehicles, emphasising personal car use, supporting road infrastructure like highways and parking, and valuing individual convenience and freedom of choice in transportation.</li>
      <li><strong>Positive end:</strong> A preference for public and active transit modes, including buses, trains, cycling, and walking, prioritising shared, environmentally friendly, and equitable transport options.</li>
    </ul>

    <p><strong>Y-Axis:</strong> Status Quo-Oriented &lt;&gt; Innovation Oriented</p>
    <p>This axis captures your attitude toward change and new solutions in urban mobility:</p>
    <ul>
      <li><strong>Negative end:</strong> A Status Quo orientation, favoring established, familiar transportation systems and approaches, cautious about rapid or radical changes, and preferring tried-and-true methods over experimentation.</li>
      <li><strong>Positive end:</strong> Innovation and Technology Optimism, welcoming new mobility technologies, support for smart city solutions, and a belief that innovation can solve urban transport challenges.</li>
    </ul>

    <p><strong>How to understand your position:</strong></p>
    <p>Your position on this chart shows how your views balance between these priorities:</p>
    <p>For example, being in the <strong>top-right quadrant</strong> reflects a preference for public/active transit combined with excitement about new technology.</p>
    <p>The <strong>bottom-left quadrant</strong> suggests a stronger preference for private vehicles with a cautious approach toward change.</p>
  `;
}

function plotCompass(x, y) {
  const ctx = document.getElementById('mobilityChart').getContext('2d');

  // Destroy previous chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Create new chart and save reference
  chartInstance = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Your Position',
          data: [{ x, y }],
          backgroundColor: 'blue',
          pointRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          min: -1, max: 1,
          title: {
            display: true,
            text: 'Private Vehicle ←→ Public/Active Transit',
            font: {
              size: 14
            }
          },
          ticks: { stepSize: 0.5 },
          grid: {
            color: '#999',
            lineWidth: ctx => (ctx.tick.value === 0 ? 2 : 1)
          }
        },
        y: {
          min: -1, max: 1,
          title: {
            display: true,
            text: 'Status-Quo ←→ Innovation',
            font: {
              size: 14
            }
          },
          ticks: { stepSize: 0.5 },
          grid: {
            color: '#999',
            lineWidth: ctx => (ctx.tick.value === 0 ? 2 : 1)
          }
        }
      }
    }
  });
}

document.addEventListener("submit", function (e) {
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

// Sticky progress bar
window.addEventListener("scroll", function () {
  const progress = document.getElementById("progress-container");
  const formTop = document.getElementById("surveyForm").offsetTop;
  if (window.scrollY >= formTop) {
    progress.classList.add("sticky");
  } else {
    progress.classList.remove("sticky");
  }
});

renderQuestions();
