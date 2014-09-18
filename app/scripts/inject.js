// URL base for WolframAlpha queries.
var query = 'http://www.wolframalpha.com/input/?i=';

// Progress animation.
function showProgress() {
  clearDisplay();
  /*
   * show progress by clearing previous resutls
   * and then adding a spinning wheel
   */
  var progressDisplay = document.getElementById('progressDisplay');
  var progress = document.createElement('img');
  progress.src = '../images/computing.gif';
  progressDisplay.appendChild(progress);
}

// Execution entry point.
document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.prevSearch) document.getElementById('userQuery').value = localStorage.prevSearch;
    if (localStorage.prevResponseHTML) document.getElementById('wolframAlphaResponses').innerHTML = localStorage.prevResponseHTML;

    document.getElementById('userQuery').addEventListener('keypress',
      function () {
        if (event.keyCode == 13 /*enter*/) {
          event.preventDefault();
          queryURL = query + encodeURIComponent(document.getElementById('userQuery').value);
          var req = new XMLHttpRequest();
          req.addEventListener('loadstart', showProgress, false);
          req.open("GET", queryURL, true);

          req.onload = function (event) {
            if (req.readyState === 4 && req.status === 200) {
              clearDisplay();
              var wolframAlphaResponses = document.getElementById('wolframAlphaResponses');

              // Parse and display results from WolframAlpha.
              xml = new DOMParser().parseFromString(req.responseText, 'text/html');
              var pods = xml.getElementsByClassName('pod');

              for (var i = 0; i < pods.length; i++) {
                if (pods[i].className != 'pod ') {
                  continue;
                }
                var images = pods[i].getElementsByTagName('img');
                var title = pods[i].getElementsByTagName('h2')[0].innerText;
                var pod = document.createElement('li');
                pod.innerHTML = title + '<br>';

                for (var j = 0; j < images.length; j++) {
                  var child = document.createElement('img');
                  child.src = images[j].getAttribute('src');
                  pod.appendChild(child);
                }
                wolframAlphaResponses.appendChild(pod);
              }
              localStorage.prevResponseHTML = wolframAlphaResponses.innerHTML;
            }
          };
          req.send(null);
          localStorage.prevSearch = document.getElementById('userQuery').value;
        }
      });
});

/*
 * functions to clear the display for the next extension input
 * area log
 */

function clearDisplay() {
  rmNodes(document.getElementById('wolframAlphaResponses'));
  rmNodes(document.getElementById('progressDisplay'));
}

function rmNodes(parent) {
  while (parent.firstChild) parent.removeChild(parent.firstChild);
}
