const items = [
  { id: "item1", title: "Fiets", image: "https://picsum.photos/seed/fiets/300/200" },
  { id: "item2", title: "Laptop", image: "https://picsum.photos/seed/laptop/300/200" },
  { id: "item3", title: "Boormachine", image: "https://picsum.photos/seed/boor/300/200" },
  { id: "item4", title: "Smartphone", image: "https://picsum.photos/seed/telefoon/300/200" },
  { id: "item5", title: "Tuinset", image: "https://picsum.photos/seed/tuin/300/200" },
  { id: "item6", title: "Grasmaaier", image: "https://picsum.photos/seed/gras/300/200" },
  { id: "item7", title: "Camera", image: "https://picsum.photos/seed/camera/300/200" },
  { id: "item8", title: "Tablet", image: "https://picsum.photos/seed/tablet/300/200" },
  { id: "item9", title: "Printer", image: "https://picsum.photos/seed/printer/300/200" }
];

async function fetchBids() {
  const res = await fetch("/api/bids");
  return await res.json();
}

function createItemCard(item, highestBid) {
  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `
    <h3>${item.title}</h3>
    <img src="${item.image}" alt="${item.title}">
    <p>Huidig bod: €${highestBid ? highestBid.amount : "0.00"}</p>
    <input type="number" placeholder="Uw bod" id="bid-${item.id}">
    <input type="text" placeholder="Uw naam" id="name-${item.id}">
    <input type="email" placeholder="Uw e-mail" id="email-${item.id}">
    <button onclick="submitBid('${item.id}')">Bied mee</button>
    <p id="status-${item.id}"></p>
  `;
  return div;
}

async function renderItems() {
  const container = document.getElementById("items");
  container.innerHTML = "";
  const bids = await fetchBids();

  items.forEach(item => {
    const card = createItemCard(item, bids[item.id]);
    container.appendChild(card);
  });
}

async function submitBid(itemId) {
  const amount = parseFloat(document.getElementById(`bid-${itemId}`).value);
  const name = document.getElementById(`name-${itemId}`).value;
  const email = document.getElementById(`email-${itemId}`).value;

  const res = await fetch("/api/bid", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ itemId, amount, name, email })
  });

  const data = await res.json();

  if (res.ok) {
    alert("✅ Bod succesvol geplaatst!");
    // Velden leegmaken
    document.getElementById(`bid-${itemId}`).value = "";
    document.getElementById(`name-${itemId}`).value = "";
    document.getElementById(`email-${itemId}`).value = "";
  } else {
    alert("❌ Fout bij plaatsen bod: " + data.message);
  }

  document.getElementById(`status-${itemId}`).innerText = data.message;

  renderItems(); // update biedingen
}

renderItems(); // items direct laden bij opstart

// Je formulier event listener (indien je een formulier met id "mijnFormulier" hebt)
const mijnFormulier = document.getElementById("mijnFormulier");

if (mijnFormulier) {
  mijnFormulier.addEventListener("submit", async function (e) {
    e.preventDefault(); // voorkomt herladen

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Gegevens succesvol verstuurd!");
        this.reset(); // formulier leegmaken
      } else {
        alert("❌ Er ging iets mis bij het versturen van de gegevens.");
      }
    } catch (error) {
      alert("❌ Fout tijdens verzenden: " + error.message);
    }
  });
}
