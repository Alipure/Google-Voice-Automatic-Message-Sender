const delay = (ms) => new Promise(r => setTimeout(r, ms));

const cards = [...document.querySelectorAll("div.container.vnt[role='button']")];

const clickSendButton = () => {
  // Find the send button by looking for mat-icon with "send" text
  let btn = null;
  
  // Method 1: Find by the specific path with mat-icon
  const icon = document.querySelector(
    "#gvPageRoot gv-message-entry div.button-container button mat-icon"
  );
  
  if (icon && icon.textContent.trim() === 'send') {
    btn = icon.closest('button');
  }
  
  // Method 2: Find all mat-icons and check their text
  if (!btn) {
    const allIcons = document.querySelectorAll('mat-icon');
    for (const icon of allIcons) {
      if (icon.textContent.trim() === 'send') {
        btn = icon.closest('button');
        if (btn) break;
      }
    }
  }
  
  // Method 3: Look for the specific button by class or attribute
  if (!btn) {
    const buttons = document.querySelectorAll('gv-message-entry button');
    for (const button of buttons) {
      // Check if button contains a send icon
      const icon = button.querySelector('mat-icon');
      if (icon && icon.textContent.trim() === 'send') {
        btn = button;
        break;
      }
    }
  }
  
  // Method 4: Try the exact path from your HTML
  if (!btn) {
    btn = document.querySelector(
      "#gvPageRoot > div:nth-child(2) > gv-app > gv-side-panel > mat-sidenav-container > mat-sidenav-content > div > div.content-container > gv-threads-view > div > div.thread-detail-container.ng-star-inserted > gv-thread-details > mat-drawer-container > mat-drawer-content > div.message-entry-container.ng-star-inserted > gv-message-entry > div > div > div.button-container > button"
    );
  }
  
  if (btn) {
    // Check if the button is enabled
    if (!btn.disabled) {
      btn.click();
      console.log("Send button clicked!");
      
      // Visual feedback
      btn.style.outline = "3px solid red";
      btn.style.opacity = "0.8";
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
      box.value = "Hi";
      box.dispatchEvent(new Event("input", { bubbles: true }));
      
      // Wait for the send button to become enabled
      await delay(500);
      
      // Try to click the send button
      let sent = clickSendButton();
      
      // If not sent, try again after a short delay
      if (!sent) {
        console.log("Retrying...");
        await delay(300);
        sent = clickSendButton();
      }
      
      if (!sent) {
        console.log("Waiting for manual send...");
        await new Promise(r => setTimeout(r, 3000));
      } else {
        await delay(1000);
      }
    } else {
      console.log("Message input not found");
      await new Promise(r => setTimeout(r, 3000));
    }
  }
})();
