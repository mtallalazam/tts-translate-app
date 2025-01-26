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

// Play TTS
playButton.addEventListener("click", () => {
    const utterance = new SpeechSynthesisUtterance(textInput.value);
    const selectedVoice = voices[voiceSelect.value];
    if (selectedVoice) utterance.voice = selectedVoice;
    speechSynthesis.speak(utterance);
});
