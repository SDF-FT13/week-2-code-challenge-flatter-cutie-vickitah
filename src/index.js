document.addEventListener("DOMContentLoaded", () => {
    const characterBar = document.getElementById("character-bar");
    const characterInfo = document.getElementById("detailed-info");
    const characterName = document.getElementById("name");
    const characterImage = document.getElementById("image");
    const characterVotes = document.getElementById("vote-count");
    const votesForm = document.getElementById("votes-form");
    const votesInput = document.getElementById("votes");
    const resetButton = document.getElementById("reset-btn");
    const characterForm = document.getElementById("character-form");
    const newNameInput = document.getElementById("new-name");
    const newImageInput = document.getElementById("new-image");

    const BASE_URL = "http://localhost:3000/characters";
    let currentCharacter = null;

    // Fetch and display all characters
    function loadCharacters() {
        fetch(BASE_URL)
            .then(response => response.json())
            .then(characters => {
                characterBar.innerHTML = ""; // Clear previous entries
                characters.forEach(character => createCharacterSpan(character));
            })
            .catch(error => console.error("Error fetching characters:", error));
    }

    // Create character span in character bar
    function createCharacterSpan(character) {
        const span = document.createElement("span");
        span.textContent = character.name;
        span.style.cursor = "pointer";
        span.addEventListener("click", () => displayCharacterDetails(character));
        characterBar.appendChild(span);
    }

    // Display character details
    function displayCharacterDetails(character) {
        currentCharacter = character;
        characterName.textContent = character.name;
        characterImage.src = character.image;
        characterVotes.textContent = character.votes;
    }

    // Handle voting
    votesForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!currentCharacter) return;

        let addedVotes = parseInt(votesInput.value) || 0;
        currentCharacter.votes += addedVotes;
        characterVotes.textContent = currentCharacter.votes;

        // Update server
        fetch(`${BASE_URL}/${currentCharacter.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: currentCharacter.votes })
        })
        .catch(error => console.error("Error updating votes:", error));

        votesInput.value = "";
    });

    // Reset votes to zero
    resetButton.addEventListener("click", () => {
        if (!currentCharacter) return;
        currentCharacter.votes = 0;
        characterVotes.textContent = "0";

        // Update server
        fetch(`${BASE_URL}/${currentCharacter.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: 0 })
        })
        .catch(error => console.error("Error resetting votes:", error));
    });

    // Handle new character submission
    characterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newCharacter = {
            name: newNameInput.value,
            image: newImageInput.value,
            votes: 0
        };

        // Save to server
        fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCharacter)
        })
        .then(response => response.json())
        .then(character => {
            createCharacterSpan(character);
            displayCharacterDetails(character);
        })
        .catch(error => console.error("Error adding character:", error));

        characterForm.reset();
    });

    // Load characters on page load
    loadCharacters();
});
