const HIDE_BTN = document.getElementById("hide");
var mode = null;

HIDE_BTN.addEventListener("click", () => {
    api.hide();
});

var slider = document.getElementById("slider");
slider.addEventListener ('input', () => {
  document.body.style.opacity = slider.value / 100;
  if (slider.value === 1) {
    document.body.style.backgroundColor = "#212327";
  } else {
    document.body.style.backgroundColor = "#212327" + Math.round(slider.value * 255 / 100).toString(16);
  }
})

addEventListener("resize", (event) => {
  document.getElementById("twitch-embed").firstChild.height = window.innerHeight - document.getElementById("menu").scrollHeight - 20;
  document.getElementById("twitch-player").firstChild.height = window.innerHeight - document.getElementById("menu").scrollHeight - 20;
  document.getElementById("kick-embed").height = window.innerHeight - document.getElementById("menu").scrollHeight - 20;
});

function twitchSearch() {
  channel = document.getElementById("search").value;
  if (channel === "") {
    return null;
  }
  exitAll();

  document.getElementById("mode").innerHTML = 'twitch';
  if (document.getElementById("mode-chat").innerHTML === "true") {
    document.getElementById("twitch-embed").style.display = "block";
  } else {
    document.getElementById("twitch-player").style.display = "block";
  }
  document.getElementById("twitch").style.filter = "none";

  link = document.getElementById("twitch-embed").firstChild.src;
  parts = link.split('&');
  parts[2] = "channel=" + channel;
  link = parts.join('&');
  document.getElementById("twitch-embed").firstChild.src = link;

  link = document.getElementById("twitch-player").firstChild.src;
  parts = link.split('&');
  parts[2] = "channel=" + channel;
  link = parts.join('&');
  document.getElementById("twitch-player").firstChild.src = link;
}

function kickSearch() {
  channel = document.getElementById("search").value;
  if (channel === "") {
    return null;
  }
  exitAll();

  document.getElementById("mode").innerHTML = 'kick';
  document.getElementById("kick-embed").style.display = "block";
  document.getElementById("kick").style.filter = "none";
  document.getElementById("kick-embed").height = window.innerHeight - document.getElementById("menu").scrollHeight - 20;

  document.getElementById("kick-embed").src = "https://player.kick.com/" + channel + "?autoplay=true&muted=false";
}

function exitTwitch() {
  document.getElementById("twitch-embed").style.display = "none";
  document.getElementById("twitch-player").style.display = "none";
  pauseTwitch();
}

function exitKick() {
  document.getElementById("kick-embed").style.display = "none";
  pauseKick();
}

function exitAll() {
  exitTwitch();
  exitKick();
  document.getElementById("twitch").removeAttribute("style");
  document.getElementById("kick").removeAttribute("style");
}