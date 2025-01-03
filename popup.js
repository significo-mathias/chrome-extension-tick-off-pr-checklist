let isInProgress = false;

document.getElementById("check-all").addEventListener("click", () => {
  if (isInProgress) {
    return;
  }
  isInProgress = true;
  showLoadingAnimation();
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: checkAllCheckboxes,
      });
    }
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.done) {
      showDone();
      setTimeout(() => {
        isInProgress = false;
        showCta();
      }, 9999);
    }
  }
);

function showLoadingAnimation() {
  document.getElementById("btn-label").style.display = 'none';
  document.getElementById("btn-label-done").style.display = 'none';
  document.getElementById("loading-animation").style.display = 'block';
  document.getElementById("done-icon").style.display = 'none';
}

function showDone() {
  document.getElementById("btn-label").style.display = 'none';
  document.getElementById("btn-label-done").style.display = 'inline';
  document.getElementById("loading-animation").style.display = 'none';
  document.getElementById("done-icon").style.display = 'block';
}

function showCta() {
  document.getElementById("btn-label").style.display = 'inline';
  document.getElementById("btn-label-done").style.display = 'none';
  document.getElementById("loading-animation").style.display = 'none';
  document.getElementById("done-icon").style.display = 'none';
}

function checkAllCheckboxes() {
  const checkboxes = document.querySelectorAll('input.task-list-item-checkbox:not(:checked)');
  let numUnchecked = checkboxes.length;

  if (numUnchecked > 0 && !checkboxes[0].disabled) {
    checkboxes[0].click();
    numUnchecked--;
  }

  if (numUnchecked > 0) {
    window.setTimeout(checkAllCheckboxes, 10);
  } else {
    chrome.runtime.sendMessage({done: true});
  }
}