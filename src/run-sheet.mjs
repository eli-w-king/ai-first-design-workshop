const deckRequest = "Next, make a 40-card deck of UX laws and principles in my project at decks/ux-laws.txt, in a format Skola can import, and import it.";

export const GUIDED_MODULES = [
  {
    number: 1, id: 'module-1', title: 'Set up like me', time: '6:10 PM', end: '6:20 PM',
    model: "GPT-6.1 Terra, medium",
    action: "Paste the workshop settings into your user settings and restart once. Skip the restart if you did this at home or at the table. Open the Agents window, make or open a folder named Workshop in your home folder, and pick GPT-6.1 Terra. Keep approvals on. Dictate the prompt and approve each command. While it installs, open skola.cards in the browser, make a deck and try to add a card.",
    prompts: [
      { label: "Dictate or copy this prompt", text: "Fork github.com/h16nning/skola to my GitHub, or use my fork if it's already there. Clone it into Workshop/skola, make my fork the default for pull requests, turn off its cloud sync so everything stays on my laptop, install it, and start the dev server so I can try it. Don't run tests, lint or builds yet." },
    ],
    wow: 'You talk to your laptop, and it forks a real open-source app, installs it and runs it. Your copy is on your GitHub.',
    learn: 'Settings, the Agents window, dictation, approvals and the terminal.',
    fallback: "If you didn't get the kit at home, download it into your Workshop folder while it installs. Windows installs can take 5 minutes. Pair with a neighbor on their fork until yours is ready.",
    further: "Check that the folder is Workshop/skola and the default PR destination is your own fork. Don't sign in to Skola or turn sync on.",
  },
  {
    number: 2, id: 'module-2', title: 'The brief', time: '6:20 PM', end: '6:25 PM',
    model: "Read together, no model needed",
    action: "Eli reads the practice brief. Where did you get stuck trying to add a card? Now open your fork on GitHub.\n\n> **Don't skip this.** Without the Actions click, your fork can't publish at 6:59. An agent can't make this first click through the API.\n\n1. Open **Actions** and click **\"I understand my workflows, go ahead and enable them\"**. When it's done, the Actions tab lists your fork's workflows. If they're already listed, you're set.\n2. Under **Settings > Pages > Source**, choose **GitHub Actions**. Don't choose \"Deploy from a branch\": it shows a blank page.",
    prompts: [], kind: 'brief',
    wow: 'Every change tonight has a reason.',
    learn: "Working from a brief, your fork on GitHub.",
    fallback: "Read the brief here if your clone is still installing. You can set up Actions and Pages as soon as your fork exists.",
    further: 'Choose one acceptance check you will use later. Keep the exercise separate from real customer evidence.',
  },
  {
    number: 3, id: 'module-3', title: 'Fix it and prove it', time: '6:25 PM', end: '6:33 PM',
    model: "GPT-6.1 Terra, medium (GPT-6.2 Sol if it stalls)",
    action: "Switch to Autopilot and Allow all in your workshop fork. Send the fix first. While it works, use Add to Queue for the deck, not Steer. The deck belongs in the project at decks/ux-laws.txt.",
    prompts: [
      { label: "Fix and test", text: "New people can't create cards. Reproduce it in the browser, find the cause, fix it, and add a test so it stays fixed. Commit it on my workshop branch once the checks pass." },
      { label: "Add to Queue", text: deckRequest },
    ],
    wow: 'The agent opens the app, clicks through it like a person, finds the real bug, fixes it, and the test turns from red to green.',
    learn: 'Autopilot, Allow all, the built-in browser, and Add to Queue versus Steer.',
    fallback: "Module 4 still starts. If the queue stalls, open a fresh chat in your fork on GPT-6.1 Terra at low effort and use the same deck request.",
    further: 'Reload and study the newly saved card. Inspect the failing-before, passing-after test rather than relying on a summary.',
    tip: 'Queuing the deck here re-reads the whole bug fix and costs more. To save, start a fresh chat in your fork on GPT-6.1 Terra at low effort instead.',
  },
  {
    number: 4, id: 'module-4', title: '40 cards in a minute', time: '6:33 PM', end: '6:36 PM',
    model: "GPT-6.1 Terra, low",
    action: "Let the message you queued in Module 3 run. Open the deck in Skola and decks/ux-laws.txt in your project. You only need the prompt below if you start a fresh chat instead.",
    prompts: [
      { label: "Fresh chat only: GPT-6.1 Terra, low effort", text: deckRequest },
    ],
    wow: 'Forty accurate cards from one sentence, in a plain file you own.',
    learn: 'Queued work and files as inputs.',
    fallback: "In Skola, make a deck and choose Menu > Import Cards > From Plain Text. Open kit/decks/UX laws and principles.txt, keep the tab separator, then choose Import and Add Cards.",
    further: 'Check a few definitions and rewrite a card in your own words. Generated content still needs your judgment.',
    downloads: 'deck',
  },
  {
    number: 5, id: 'module-5', title: 'Redesign from a screenshot', time: '6:36 PM', end: '6:44 PM',
    model: "GPT-6.1 Terra, medium",
    action: "Take a screenshot of the study screen. Paste it into the same chat so its browser has your deck. Select the unsent image and choose Mark Up. Use arrows, circles, a note and crop. Draw an arrow from a piece to where it should go. Choose Done, then send the prompt.",
    prompts: [
      { label: "Send with your marked image", text: "Make it look like my markup. Keep it calm and readable. Make it the default, and commit it once the checks pass." },
    ],
    wow: 'Your scribble becomes a real redesign in code, live in the browser next to the chat.',
    learn: 'Image markup and the integrated browser.',
    fallback: "Use the chat that imported the deck, or mark up kit/screens/04 - Study back.png in a new chat.",
    further: 'Compare the live screen with your image, then test the interaction. This is manual visual feedback, not Computer Use.',
  },
  {
    number: 6, id: 'module-6', title: 'A feature and three directions', time: '6:44 PM', end: '6:59 PM',
    model: "Listen mode: GPT-6.2 Sol, medium. Today: GPT-6.1 Terra, medium, in each of three sessions. Synthesis: GPT-6.1 Terra, medium.",
    action: "Start Listen in Plan mode. Review the plan, then choose Implement Plan. Open a new session on Autopilot for Today. It may ask before starting the three sessions, even with your okay in the prompt. Confirm that they can start and keep everything local. While they work, use Send Later for 7:15 PM. Then use + > Files to attach kit/research/All six notes.md and send the research prompt.",
    prompts: [
      { label: "Plan Listen mode", text: "Add Listen mode: a button that reads the side of the card I'm looking at out loud, with a voice already on this device. Never read the side I'm trying to remember; after I reveal the answer, Listen can read it. Plan it first." },
      { label: "Today: new session on Autopilot", text: "Design a Today home that tells me what to study now. Make three really different directions, each in its own session, and a page to compare them. You have my okay to start the three sessions. Keep everything local." },
      { label: "Send Later at 7:15 PM", text: "Check my GitHub Pages deployment and give me the live link." },
      { label: "Attach All six notes.md", text: "These are fictional practice notes. What patterns do you see, and what should we build next?" },
    ],
    wow: 'Four agents work at once while you read research.',
    learn: 'Plan mode, parallel sessions, Send Later and synthesis.',
    fallback: "Listen and Today can finish independently. If time is short, keep Listen and skip the three directions. Ship what works at 6:59 with the no-direction prompt in Module 9.",
    further: "Try Listen before and after you reveal a card. It should read only the side you can see. Commit the working changes before shipping.",
    downloads: 'research',
  },
  {
    number: 9, id: 'module-9', title: 'Ship it', time: '6:59 PM', end: 'about 7:15 PM',
    model: "GPT-6.1 Terra, medium",
    action: "Open the comparison page and pick a Today direction. Replace <name> and <my name> below. Check the files that will go public and make sure the PR targets your own fork, not upstream.\n\nExpect about 15 minutes from send to live, so links go live around 7:15. While it builds, Eli shows Modules 7 and 8 from the reference run. At 7:15 your scheduled message checks the deployment and hands you the link.",
    prompts: [
      { label: "Ship your chosen direction", text: "Bring the <name> direction into my home screen, and make tonight's changes the default, with no flags. Then open a PR in my fork with tonight's app changes only (source, tests and the Today page; leave out videos, recordings and anything over 1 MB), merge it, and publish it to GitHub Pages. Keep Skola's license and credit, and add 'My fork of Skola, modified by <my name> on Nov 19, 2026. Not official Skola.' with a link to my repo. Give me both links." },
      { label: "If no Today direction is ready", text: "Make tonight's changes the default, with no flags. Then open a PR in my fork with tonight's app changes only (source, tests and the Today page; leave out videos, recordings and anything over 1 MB), merge it, and publish it to GitHub Pages. Keep Skola's license and credit, and add 'My fork of Skola, modified by <my name> on Nov 19, 2026. Not official Skola.' with a link to my repo. Give me both links." },
    ],
    wow: "A live link to your Skola 2.0 and a repo for your portfolio.",
    learn: "PRs in your own fork, GitHub Pages, licenses and credit.",
    fallback: "Module 9 never moves. Ship at 6:59 with what works. If no direction is ready, use the second prompt, then bring in your choice after the first deploy.\n\nIf it says your fork's workflows aren't enabled, open Actions in your fork on GitHub, click 'I understand my workflows, go ahead and enable them', then ask again. Don't use Skola's package deploy script as a workaround: it adds the original project's custom domain.",
    further: "A fresh browser starts with an empty Skola. Create a deck, then use Import Cards > From Plain Text to import kit/decks/UX laws and principles.txt and see your Today home. Try a card, then follow the source link back to your fork and check the license and credit.",
    downloads: 'publish',
  },
  {
    number: 7, id: 'module-7', title: 'Show it off', time: '7:15 PM', end: '7:17 PM', block: 'together',
    model: "GPT-6.1 Terra, medium",
    action: "Start a narrated tour of your live Skola 2.0. Let it run in the background while Module 8 starts. The recorder can't capture the app's own speech, so narrate what Listen does.",
    prompts: [
      { label: "Record the tour", text: "Record a 30-second narrated tour of my Skola 2.0 at my live link: adding a card, the new study screen, Listen and the Today home. You have my okay to install the recorder outside my project folder." },
    ],
    wow: "A narrated demo of your own 2.0, made on your laptop.",
    learn: 'Long work in the background.',
    fallback: "If Listen isn't done, record the redesign instead.",
    further: 'Play the exported file from start to finish and check the narration, readable text and actual result before sharing it.',
  },
  {
    number: 8, id: 'module-8', title: 'Let it use your app', time: '7:17 PM', end: 'about 7:30 PM', block: 'together',
    model: "GPT-6.2 Sol, medium",
    action: "Switch to **Interactive** mode and **Manual** permissions first. Install your Skola from your live link as an app and ask Computer Use to import the Spanish deck with the file picker.\n\n**Watch for the native panel.** The first time Computer Use asks to control your Skola app, click **Allow** for that app. It asks once per app, not in the chat. Autopilot cancels the request, so the task stalls.\n\nHeadphones or low volume: 16 laptops will talk at once.",
    prompts: [
      { label: "Use the installed app", text: "Open my Skola app, import the Spanish travel deck from Workshop/kit with the file picker, and play the first card with Listen mode." },
    ],
    wow: 'It drives a real desktop app, file picker included, and you hear the feature you just built.',
    learn: "Computer Use, and why it asks first.",
    fallback: "Use the UX deck without Listen. You can still watch Computer Use work the file picker.",
    further: 'Inspect the imported card and turn Computer Use off afterward if you no longer want access.',
    downloads: 'spanish',
  },
];

export const FREE_MODULES = [
  {
    id: 'cloud', title: 'Cloud', model: 'GPT-6.2 Sol, medium',
    text: "Pick the top next step from your fictional research. Delegate just that task to Copilot in the cloud on your fork and ask it to open a PR there. Review it before merging.",
    notes: [
      'Cloud model calls use the same monthly Copilot AI credits as your laptop. Compute is separate: standard Actions runner minutes are free on a public fork. A cloud sandbox uses your included compute and can cost extra, including storage for a stopped session.',
      'Check your compute budget before starting. If you want to stay local, ask for a plan instead.',
    ],
    target: 'cloud-and-overnight',
  },
  {
    number: 10, title: 'Keep my taste current', model: 'GPT-6.1 Terra, medium',
    text: 'Open Templates from Plugins, then Keep my taste current. In the dialog, choose GPT-6.1 Terra at medium effort, keep the trigger Manual, then Run now. Review the first taste draft before adopting it; a weekly schedule is a separate choice.',
    target: 'make-skills-yours',
  },
  {
    number: 11, title: 'Make it a habit', model: 'GPT-6 Luna, low',
    text: 'Make up to ten new cards each morning from what you are learning. Skip ideas already in the deck.',
    steps: [
      'Make the automation from chat.',
      'Open it under Automations, set GPT-6 Luna at low effort and Save before the first Run now.',
    ],
    notes: [
      "An automation made from chat does not keep the chat's model. Otherwise it runs on the account default, which can cost more.",
      'Use a tab-separated .txt: one card per line, front, Tab, back, with no header and no quotes. Import it with Import Cards > From Plain Text.',
      'A quoted CSV imports 0 cards there and still says "Success". Check the card count.',
      'Set the trigger back to Manual after the workshop so no scheduled runs keep using credits.',
    ],
    target: 'daily-cards',
  },
  {
    number: 12, title: 'Go deeper on a direction', model: 'GPT-6.1 Terra, medium (workshop default)',
    text: 'Choose a Today direction, merge it only within your own fork, then polish the real screen from a fresh markup.',
    target: 'parallel-sessions',
  },
  {
    number: 13, title: 'Overnight, take-home', model: 'GPT-6.1 Terra, medium',
    text: 'Plan variations from the fictional research findings, with scope, costs, checkpoints and a stop rule. Do not start unattended work until you approve the plan.',
    target: 'cloud-and-overnight',
  },
];
