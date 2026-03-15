let chart;

// 折りたたみ
document.querySelector(".toggle-btn").addEventListener("click", () => {
  const btn = document.querySelector(".toggle-btn");
  const content = document.getElementById("toggle-content");

  btn.classList.toggle("active");

  if (content.style.maxHeight) {
    content.style.maxHeight = null;
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
  }
});

document.querySelector(".btn-primary").addEventListener("click", () => {
  const rate = Number(document.getElementById("rate").value) / 100;
  const tries = Number(document.getElementById("tries").value);

  if (!rate || !tries) {
    alert("排出率と回数を入力してください");
    return;
  }

  // 基本計算
  const hit = 1 - Math.pow(1 - rate, tries);
  const miss = Math.pow(1 - rate, tries);
  const expPulls = 1 / rate;
  const expCount = tries * rate;

  document.getElementById("prob-hit").textContent = (hit * 100).toFixed(2) + "%";
  document.getElementById("prob-miss").textContent = (miss * 100).toFixed(2) + "%";
  document.getElementById("exp-pulls").textContent = expPulls.toFixed(2) + " 回";
  document.getElementById("exp-count").textContent = expCount.toFixed(2) + " 体";

  // 組み合わせ
  function combination(n, k) {
    if (k > n) return 0;
    let result = 1;
    for (let i = 1; i <= k; i++) {
      result = result * (n - i + 1) / i;
    }
    return result;
  }

  function probKHits(n, p, k) {
    return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  }

  // 表更新
  const tableBody = document.getElementById("multi-results");
  tableBody.innerHTML = "";

  const rowHit = document.createElement("tr");
  rowHit.innerHTML = `<td>1体以上</td><td>${(hit * 100).toFixed(4)}%</td>`;
  tableBody.appendChild(rowHit);

  for (let k = 1; k <= 20; k++) {
    const prob = probKHits(tries, rate, k);
    const row = document.createElement("tr");
    row.innerHTML = `<td>${k}体</td><td>${(prob * 100).toFixed(4)}%</td>`;
    tableBody.appendChild(row);
  }

  // -----------------------------
  // 確率分布グラフ（回数 × 個数）
  // -----------------------------

  const labels = [];
  const data = [];

  for (let n = 1; n <= tries; n++) {
    labels.push(n);
    const expected = n * rate; // n回引いたときの期待個数
    data.push(expected.toFixed(4));
  }

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("chart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "期待される当たり個数",
        data: data,
        backgroundColor: "rgba(30,136,229,0.6)",
        borderColor: "#1e88e5",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { title: { text: "当たり個数", display: true }},
        x: { title: { text: "回数", display: true }}
      }
    }
  });
});