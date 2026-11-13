export const downloadFaq = [
  {
    question: "The launcher will not open",
    answer:
      "On Windows, run launcher.exe from a folder you can write to, such as your Documents. On macOS, unzip MU.zip, move MU to Applications, then right-click it and choose Open the first time.",
  },
  {
    question: "Where does the launcher install the game?",
    answer:
      "On Windows, next to the launcher (or in your user folder when that folder is read-only). On macOS, in your user's Application Support folder. It checks the files on every start and downloads what is missing or changed.",
  },
  {
    question: "Can I use another MU client?",
    answer: "No. Start the game with the launcher from this page.",
  },
] as const;
