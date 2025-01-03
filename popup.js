document.getElementById("check-all").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: checkAllCheckboxes,
      });
    }
  });
});

function checkAllCheckboxes() {
  const checkboxes = document.querySelectorAll('input.task-list-item-checkbox:not(:checked)');
  let numUnchecked = checkboxes.length;

  if (numUnchecked > 0 && !checkboxes[0].disabled) {
    checkboxes[0].click();
    numUnchecked--;
  }

  if (numUnchecked > 0) {
    window.setTimeout(checkAllCheckboxes, 10);
  }
}