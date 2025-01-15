
// preluare date de la utilizator
function calculeaza() {
    const inputWorkers = parseInt(document.getElementById("inputWorkers").value);
    const inputProduction = document.getElementById("inputProduction").value.split(",").map(Number);
  
    // Validare date
    const errorMessage = document.getElementById("errorMessage");
    if (isNaN(inputWorkers) || inputWorkers <= 0) {
      errorMessage.textContent = "Introduceți un număr valid de muncitori!";
      return;
    }
    if (inputProduction.length !== inputWorkers || inputProduction.some(isNaN)) {
      errorMessage.textContent = "Numărul de valori introduse trebuie să corespundă cu numărul muncitorilor!";
      return;
    }
    errorMessage.textContent = "";
  
    const rezultate = [];
    let pmMax = 0, muncitorPmMax = 0;
    let pmgStartScadere = -1;
    const pmgValues = [];
    const pmValues = [];
  
    // Calculează valorile
    for (let i = 0; i < inputWorkers; i++) {
      const q = inputProduction[i];
      const pmg = i === 0 ? 0 : inputProduction[i] - inputProduction[i - 1];
      const pm = q / (i + 1);
  
      rezultate.push({ L: i + 1, Q: q, Pmg: pmg, Pm: pm.toFixed(2) });
      pmgValues.push(pmg);
      pmValues.push(pm);
  
      if (i > 0 && pmg < pmgValues[i - 1] && pmgStartScadere === -1) {
        pmgStartScadere = i + 1;
      }
      if (pm > pmMax) {
        pmMax = pm;
        muncitorPmMax = i + 1;
      }
    }
  
    // Afișează tabelul
    const tbody = document.querySelector("#resultsTable tbody");
    tbody.innerHTML = "";
    rezultate.forEach(r => {
      const row = `<tr>
        <td>${r.L}</td>
        <td>${r.Q}</td>
        <td>${r.Pmg}</td>
        <td>${r.Pm}</td>
      </tr>`;
      tbody.innerHTML += row;
    });
  
    // Afișează răspunsurile
    document.getElementById("answers").innerHTML = `
      <p><strong>Productivitatea marginală pentru muncitorul al 6-lea:</strong> ${rezultate[5]?.Pmg || "Nu există destule date!"}</p>
      <p><strong>Productivitatea marginală începe să scadă la muncitorul:</strong> ${pmgStartScadere !== -1 ? pmgStartScadere : "Nu există o scădere!"}</p>
      <p><strong>Productivitatea medie maximă se atinge la muncitorul:</strong> ${muncitorPmMax}</p>
    `;
  
    // Afișează graficul
    afiseazaGrafic(rezultate.map(r => r.L), pmgValues, pmValues);
  }
  
  function afiseazaGrafic(labels, pmgValues, pmValues) {
    const ctx = document.getElementById("productivityChart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Productivitatea Marginală (Pmg)",
            data: pmgValues,
            borderColor: "red",
            fill: false
          },
          {
            label: "Productivitatea Medie (Pm)",
            data: pmValues,
            borderColor: "blue",
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: "Număr Muncitori (L)" } },
          y: { title: { display: true, text: "Valoare Productivitate" } }
        }
      }
    });
  }
  