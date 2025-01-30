const voiceSelect = document.querySelector("#voiceSelect");
const playButton = document.querySelector("#playButton");
const languagesSelect = document.querySelector("#languageSelect");
const textInput = document.querySelector("textarea");

// Array of supported languages with their ISO code
const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "zh-CN", name: "Chinese (Simplified)" },
];

// Populate language select box
languages.forEach(({code, name}) => {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = name;
    languagesSelect.appendChild(option);
})

// Load available voices
let voices = [];
function loadVoices() {
    voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = voices
        .map((voice, index) => {
            return `<option value="${index}">${voice.name} (${voice.lang})</option>`;
        })
        .join("");
}

// Trigger loading voices when they become available
speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

// Translate text with serverless function
async function translateText(text, targetLang) {
    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                target: targetLang
            }),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        return data.data.translation[0].translatedText;
    } catch (error) {
        console.error('Error in Translate Text api: ', error);

        alert('Failed to translate text');

        return text;
    }
}

// TTS
function playText(text, voiceIndex) {
    const utterance = new SpeechSynthesisUtterance(text);
    if (voices[voiceIndex]) {
        utterance.voice = voices[voiceIndex];
    }
    speechSynthesis.speak(utterance);
}

// Play TTS
playButton.addEventListener("click", () => {
    const utterance = new SpeechSynthesisUtterance(textInput.value);
    const selectedVoice = voices[voiceSelect.value];
    if (selectedVoice) utterance.voice = selectedVoice;
    speechSynthesis.speak(utterance);
});
