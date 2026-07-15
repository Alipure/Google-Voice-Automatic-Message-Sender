const delay = (ms) => new Promise(r => setTimeout(r, ms));

const getAllCards = () => {
  return [...document.querySelectorAll("div.container.vnt[role='button']")];
};

const messages = [
  "Hi",
  "Hello there",
  "Hey, how are you?",
  "Good to see you",
  "Nice to connect",
  "Greetings!"
];

const processedCards = new Set();

const clickSendButton = () => {
  const btn = document.querySelector(
    "#gvPageRoot > div:nth-child(2) > gv-app > gv-side-panel > mat-sidenav-container > mat-sidenav-content > div > div.content-container > gv-threads-view > div > div.thread-detail-container.ng-star-inserted > gv-thread-details > mat-drawer-container > mat-drawer-content > div.message-entry-container.ng-star-inserted > gv-message-entry > div > div > div.button-container > button"
  );
  
  if (btn) {
    if (!btn.disabled) {
      btn.click();
      btn.style.outline = "3px solid green";
      btn.style.backgroundColor = "rgba(0, 255, 0, 0.5)";
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const scrollToBottom = async () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  });
  await delay(1500);
};

const getUnprocessedCards = () => {
  const allCards = getAllCards();
  return allCards.filter(card => !processedCards.has(card));
};

(async () => {
  let totalProcessed = 0;
  let noNewCardsCount = 0;
  const maxNoNewCardsAttempts = 3;
  
  while (noNewCardsCount < maxNoNewCardsAttempts) {
    const unprocessedCards = getUnprocessedCards();
    
    if (unprocessedCards.length === 0) {
      await scrollToBottom();
      noNewCardsCount++;
      continue;
    }
    
    noNewCardsCount = 0;
    
    for (const card of unprocessedCards) {
      processedCards.add(card);
      
      const cardIndex = totalProcessed;
      const messageIndex = cardIndex % messages.length;
      const messageText = messages[messageIndex];
      
      card.scrollIntoView({ block: "center" });
      await delay(300);
      card.click();

      await delay(800);

      const box = document.querySelector("textarea.message-input");
      if (box) {
        box.focus();
        
        box.value = "";
        box.dispatchEvent(new Event("input", { bubbles: true }));
        box.dispatchEvent(new Event("change", { bubbles: true }));
        
        await delay(200);
        
        box.value = messageText;
        box.dispatchEvent(new Event("input", { bubbles: true }));
        box.dispatchEvent(new Event("change", { bubbles: true }));
        
        let sent = false;
        for (let i = 0; i < 10; i++) {
          await delay(500);
          sent = clickSendButton();
          if (sent) break;
        }
        
        if (!sent) {
          await delay(3000);
        } else {
          totalProcessed++;
          await delay(5000);
        }
      } else {
        await delay(3000);
      }
    }
    
    await scrollToBottom();
  }
})();
