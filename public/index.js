async function loadPokemonImages() {
  const $fronts = $(".front_face");
  const total = $fronts.length;
  const pairs = total / 2;
  const max_id = 1010;

  const ids = [];
  while (ids.length < pairs) {
    const randId = Math.floor(Math.random() * max_id) + 1;
    if (!ids.includes(randId)) {
      ids.push(randId);
    }
  }

  const spritePromises = ids.map(async id => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await res.json();
    return pokemon.sprites.other["official-artwork"].front_default;
  });
  const uniqueSprites = await Promise.all(spritePromises);

  const spritePool = [];
  for (let i = 0; i < uniqueSprites.length; i++) {
    spritePool.push(uniqueSprites[i]);
    spritePool.push(uniqueSprites[i]);
  }

  for (let i = spritePool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [spritePool[i], spritePool[j]] = [spritePool[j], spritePool[i]];
  }

  $fronts.each(function (i) {
    this.src = spritePool[i];
  });
}

async function setup() {
  const $fronts = $(".front_face");
  const total = $fronts.length;
  const pairs = total / 2;
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  let firstCard = undefined
  let secondCard = undefined
  let lockBoard = false;
  let powerUpActive = false;

  const tiles = { Easy: 20, Medium: 50, Hard: 80 };
  let timeLeft = tiles[mode];
  let pairsMatched = 0;
  let pairsLeft = pairs;
  $("#timer").text(timeLeft);
  $("#totalPairs").text(pairs);
  $("#pairsLeft").text(pairsLeft);

  let clicks = 0;
  const countClicks = () => {
    clicks++;
    $("#clicks").text(clicks);
  };

  function reset() {
    firstCard = undefined;
    secondCard = undefined;
    lockBoard = false;
  }

  const timerId = setInterval(() => {
    timeLeft--;
    $("#timer").text(timeLeft);
    if (timeLeft === 0) {
      clearInterval(timerId);
      window.location.href = "/lose";
    }
  }, 1000);

  function activatePowerUp() {
    powerUpActive = true;
    $("#timer").addClass("power-up-active");
    $("#powerUpIndicator").fadeIn(200);

    setTimeout(() => {
      powerUpActive = false;
      $("#powerUpIndicator").fadeOut(200);
      $("#timer").removeClass("power-up-active");
    }, 5000);
  }


  setInterval(() => {
    activatePowerUp();
  }, 20000);


  $(".card").on(("click"), function () {
    if (lockBoard || $(this).hasClass("flip")) {
      return;
    }

    $(this).toggleClass("flip");
    countClicks();

    if (!firstCard) {
      firstCard = $(this).find(".front_face")[0]
      lockBoard = false;
      return;
    }
    lockBoard = true;
    secondCard = $(this).find(".front_face")[0]

    console.log(firstCard, secondCard);
    if (
      firstCard.src
      ==
      secondCard.src
    ) {
      pairsMatched++;
      pairsLeft--;
      $("#pairsMatched").text(pairsMatched);
      $("#pairsLeft").text(pairsLeft);
      if (powerUpActive) {
        timeLeft += 5;
        $("#timer").text(timeLeft);
      }
      $(`#${firstCard.id}`).parent().off("click")
      $(`#${secondCard.id}`).parent().off("click")
      setTimeout(() => {
        if ($(".card").length === $(".card.flip").length) {
          clearInterval(timerId);
          window.location.href = "/win";
        }
      }, 3000)
      reset();
    } else {
      console.log("no match")
      setTimeout(() => {
        $(`#${firstCard.id}`).parent().toggleClass("flip")
        $(`#${secondCard.id}`).parent().toggleClass("flip")
        reset();
      }, 1000)
    }
  });
}

$(async () => {
  await loadPokemonImages();
  setup();
  const DARK_CLASS = "dark-mode";
  const $btn = $("#darkSwitch");
  const $icon = $btn.find("i");
  const $label = $btn.find("span");

  if (localStorage.getItem("darkMode") === "on") {
    $("body").addClass(DARK_CLASS);
    $icon.removeClass("bi-moon-stars").addClass("bi-sun");
    $label.text("Light mode");
  }

  $("body").addClass("visible");

  $btn.on("click", () => {
    $("body").toggleClass(DARK_CLASS);

    if ($("body").hasClass(DARK_CLASS)) {
      $icon.removeClass("bi-moon-stars").addClass("bi-sun");
      $label.text("Light mode");
      localStorage.setItem("darkMode", "on");
    } else {
      $icon.removeClass("bi-sun").addClass("bi-moon-stars");
      $label.text("Dark mode");
      localStorage.setItem("darkMode", "off");
    }
  });
});