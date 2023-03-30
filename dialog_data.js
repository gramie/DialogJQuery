const responseData = [
    {
      id: 1,
      speaker: "computer",
      lines: [1, 2]
    },
    {
      id: 2,
      speaker: "user",
      lines: [3, 5]
    },
    {
      id: 3,
      speaker: "user",
      lines: [4]
    },
    {
      id: 4,
      speaker: "computer",
      lines: [6]
    }
  ];

const lineData = {
  1: {
    text: "Hello, may I help you?",
    audio_filename: "",
    translation: "Est-ce que je peux vous aider?",
    connections: [2]
  },
  2: {
    text: "Yes, what can I do for you?",
    audio_filename: "",
    translation: "Je peux vous aider a quelque chose?",
    connections: [3]
  },
  3: {
    text: "This is good.",
    audio_filename: "",
    translation: "C'est bon.",
    connections: []
  },
  4: {
    text: "I would like to open an account.",
    audio_filename: "",
    translation: "Je voudrais ouvrir une compte.",
    connections: [4]
  },
  5: {
    text: "I am somewhere here.",
    audio_filename: "",
    translation: "Je suis autre part.",
    connections: []
  },
  6: {
    text: "Here is the form to fill out.",
    audio_filename: "",
    translation: "Voici la form a remplir.",
    connections: []
  }
}        ;