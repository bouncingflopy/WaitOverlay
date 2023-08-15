const youtubesearchapi = require("youtube-search-api");

const HIDE_BTN = document.getElementById("hide");
var mode = null;

HIDE_BTN.addEventListener("click", () => {
    api.hide();
});

var slider = document.getElementById("slider");
slider.addEventListener ('input', () => {
  document.body.style.opacity = slider.value / 100;
  if (slider.value === 1) {
    document.body.style.backgroundColor = "#1a4b39";
  } else {
    document.body.style.backgroundColor = "#1a4b39" + Math.round(slider.value * 255 / 100).toString(16);
  }
})

addEventListener("resize", (event) => {
  document.getElementById("twitch-embed").firstChild.height = window.innerHeight - document.getElementById("menu").scrollHeight - 20;
  document.getElementById("youtube-iframe").height = window.innerHeight - document.getElementById("menu").scrollHeight - 20;
});

function twitchSearch() {
  channel = document.getElementById("search").value;
  if (channel === "") {
    return null;
  }
  exitAll();

  document.getElementById("mode").innerHTML = 'twitch';
  document.getElementById("twitch-embed").style.display = "block";

  link = document.getElementById("twitch-embed").firstChild.src;
  parts = link.split('&');
  parts[2] = "channel=" + channel;
  link = parts.join('&');
  document.getElementById("twitch-embed").firstChild.src = link;
}

function youtubeLoadVideo(video) {
  link = "https://www.youtube.com/embed/" + video + "?enablejsapi=1&autoplay=1";
  document.getElementById("youtube-iframe").src = link;
  document.getElementById("youtube-iframe").height = window.innerHeight - document.getElementById("menu").scrollHeight - 20;
  
  document.getElementById("youtube-search").style.display = "none";
  document.getElementById("youtube-iframe").style.display = "block";
}

function youtubeSearch() {
  video = document.getElementById("search").value;
  if (video === "") {
    return null;
  }
  exitAll();

  document.getElementById("mode").innerHTML = 'youtube';
  document.getElementById("youtube-embed").style.display = "block";
  document.getElementById("youtube-search").style.display = "block";

  search();
}

function exitTwitch() {
  document.getElementById("twitch-embed").style.display = "none";
  pauseTwitch();
}

function exitYoutube() {
  document.getElementById("youtube-embed").style.display = "none";
  document.getElementById("youtube-iframe").style.display = "none";
  document.getElementById("youtube-search").style.display = "none";
  pauseYoutube();
}

function exitAll() {
  exitTwitch();
  exitYoutube();
}