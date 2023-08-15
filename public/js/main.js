//// POST Y GET ////
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("survey-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const type = document.getElementById("dropdown").value;
    const description = document.getElementById("description").value;
    const evolution = document.querySelector(
      'input[name="evolution"]:checked'
    ).value;
    const weaknesses = document.querySelector(
      'input[name="weaknesses"]:checked'
    ).value;

    const data = {
      name,
      type,
      description,
      evolution,
      weaknesses,
    };

    try {
      const response = await fetch("http://127.0.0.1:3000/pokemons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log("Pokemon saved:", jsonResponse);
        fetchPokemonDataAndRenderCards();
      } else {
        console.log("Error saving Pokemon");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
//// POST Y GET ////

//// DELETE ////
function deleteCard(id) {
  fetch(`http://127.0.0.1:3000/pokemons/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Error deleting card');
    }
  })
  .then(() => {
    fetchPokemonDataAndRenderCards();
  })
  .catch(error => console.error('Error deleting card:', error));
}
//// DELETE ////

//// PUT ////
function updateCard(card, card_id) {
  fetch(`http://127.0.0.1:3000/pokemons/${card_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(card)
  })
    .then(response => response.json())
    .then(() => {
      fetchPokemonDataAndRenderCards();
    })
    .catch(error => console.error('Error updating card:', error));
}
//// PUT ////

//// CARD ////
function renderCards(data) {
  let cards = '';
  const pokemonList = document.getElementById("pokemonList");
  data.forEach(element => {
    const {name, type, description, evolution, weaknesses } = element;
    cards += `
    <li class="cards_list">
    <div class="card">
      <div class="description">
        <div class="info"><p>Name:</p><p>${name}</p></div>
        <div class="info"><p>Type:</p><p>${type}</p></div>
        <div class="info"><p>Description:</p><p>${description}</p></div>
        <div class="info"><p>Evolution:</p><p>${evolution}</p></div>
        <div class="info"><p>Weaknesses:</p><p>${weaknesses}</p></div>
      </div>
      <button class="btn_cards" type="button" onclick="openUpdateModal('${element._id}')">Update</button>
      <button class="btn_cards" type="button" onclick="deleteCard('${element._id}')">Delete</button>
    </div>
    </li>`;
  })
  pokemonList.innerHTML = cards;
}
fetchPokemonDataAndRenderCards();
//// CARD ////

//// QUE SE VEA LA CARD ////
async function fetchPokemonDataAndRenderCards() {
  try {
    const response = await fetch("http://127.0.0.1:3000/pokemons");
    if (response.ok) {
      const pokemons = await response.json();
      renderCards(pokemons);
    } else {
      console.log("Error fetching Pokemon data");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
//// QUE SE VEA LA CARD ////

////MODAL ////
function openUpdateModal(pokemonId) {
  selectedPokemonId = pokemonId;
  const modal = document.getElementById("updateModal");
  modal.style.display = "block";
}

function closeUpdateModal() {
  const modal = document.getElementById("updateModal");
  modal.style.display = "none";
}

document.getElementById("updateForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const updatedName = document.getElementById("updatedName").value;
  const updatedType = document.getElementById("updatedType").value;
  const updatedDescrip = document.getElementById("updatedDescrip").value;
  const updatedEv = document.getElementById("updatedEv").value;
  const updatedWeak = document.getElementById("updatedWeak").value;

  const updatedData = {
    name: updatedName,
    type: updatedType,
    description: updatedDescrip,
    evolution: updatedEv,
    weaknesses: updatedWeak,
  };

  try {
    const response = await fetch(`http://127.0.0.1:3000/pokemons/${selectedPokemonId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      console.log("Pokemon updated");
      fetchPokemonDataAndRenderCards();
      closeUpdateModal();
    } else {
      console.log("Error updating Pokemon");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
////MODAL ////