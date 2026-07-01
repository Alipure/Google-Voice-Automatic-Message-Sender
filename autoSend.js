const delay = (ms) => new Promise(r => setTimeout(r, ms));

const cards = [...document.querySelectorAll("div.container.vnt[role='button']")];

const clickSendButton = () => {
  // Use the exact path to the send button ONLY
  const btn = document.querySelector(
    "#gvPageRoot > div:nth-child(2) > gv-app > gv-side-panel > mat-sidenav-container > mat-sidenav-content > div > div.content-container > gv-threads-view > div > div.thread-detail-container.ng-star-inserted > gv-thread-details > mat-drawer-container > mat-drawer-content > div.message-entry-container.ng-star-inserted > gv-message-entry > div > div > div.button-container > button"
  );
  
  if (btn) {
    console.log("Send button found!");
    console.log("Is disabled?", btn.disabled);
    
    if (!btn.disabled) {
      // Only use click() - no MouseEvent which might be triggering wrong button
      btn.click();
      console.log("Send button clicked!");
      
      // Visual feedback on the send button
      btn.style.outline = "3px solid green";
      btn.style.backgroundColor = "rgba(0, 255, 0, 0.5)";
      
      return true;
    } else {
      console.log("Send button is disabled");
      return false;
    }
  } else {
    console.log("Send button not found");
    return false;
  }
};

(async () => {
  for (const card of cards) {
    card.scrollIntoView({ block: "center" });
    card.click();

    await delay(800);

    const box = document.querySelector("textarea.message-input");
    if (box) {
      box.focus();
      
      const message = "Hi";
      box.value = message;
      box.dispatchEvent(new Event("input", { bubbles: true }));
      box.dispatchEvent(new Event("change", { bubbles: true }));
      
      console.log("Message typed, waiting for send button to enable...");
      
      // Wait and retry
      let sent = false;
      for (let i = 0; i < 10; i++) {
        await delay(500);
        sent = clickSendButton();
        if (sent) break;
      }
      
      if (!sent) {
        console.log("Could not send automatically. Waiting for manual send...");
        await new Promise(r => setTimeout(r, 3000));
      } else {
        console.log("Message sent successfully!");
        await delay(1000);
      }
    } else {
      console.log("Message input not found");
      await new Promise(r => setTimeout(r, 3000));
    }
  }
})();
