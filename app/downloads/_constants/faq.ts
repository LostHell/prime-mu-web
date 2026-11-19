export const downloadFaq = [
  {
    question: "The launcher will not open",
    answer:
      "On Windows, run launcher.exe from a folder you can write to, such as your Documents. On macOS, unzip MU.zip and move MU to Applications. The first time, right-click (or Control-click) MU, choose Open, then Open again. If macOS still refuses (“cannot be opened” or “Apple could not verify…”), go to System Settings → Privacy & Security, scroll down to the message about MU, click Open Anyway and confirm.",
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
