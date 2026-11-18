# Skola 2.0: practice brief

*Fictional practice brief for the AI-First Design Workshop. This is our exercise, not the Skola maintainer's roadmap.*

Our premise: people love how Skola looks, and they leave in the first week. That's a design exercise, not a measured retention rate.

## What gets in the way

I have five minutes before class. I fill in both sides and click **Add Card** on the live site, but my card isn't there when I come back. If I've already got a list of terms, typing them all again takes most of my five minutes. Skola already imports deck files. Let's start there.

Which deck should I open today? The home screen doesn't say. At the end, I get a percentage that can go over 100%, but I can't tell what I practiced. For the language learners in this brief, hearing the word is the top request. It's hard to practice saying something I've only seen in print.

## What we'll change in our fork

1. Fix the **Add Card** button. Write a test that fails before and passes after. Reload and study the card I just made.
2. Bring in a file of UX flashcards. Our target: from an empty app and a ready deck file to studying the first of 40 cards in under two minutes. I can still write a card in my own words.
3. Mark up a screenshot to redesign studying. Make it clear how far I've got and what I just finished. Add Listen mode: let me hear the visible word on demand without revealing the back. The card should still work in silence.
4. Try three directions for a Today home. Give each the same deck and due count. Pick the one that best answers, "What should I study today?"
5. Show the change in a 30-second narrated demo. Open a PR in my fork, publish to GitHub Pages, and open the live link in a fresh browser. Someone should be able to try my fork, find its source and see which part of this brief each change answers.

## What we'll leave alone

No accounts or sync. Cards stay in this browser. No AI card generation inside Skola: an agent can help prepare a deck file outside the app. Keep Skola's license and notices, and credit the original project.

[Original Skola and its design choices](https://github.com/h16nning/skola#readme) · [Discussion of the end-screen number](https://github.com/h16nning/skola/issues/249) · [Existing request for sound support](https://github.com/h16nning/skola/issues/52)
