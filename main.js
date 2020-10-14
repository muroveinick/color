import * as variables from "./_var.js";
let arrayData = [];
let arrayOfColors = [];
addSquereWPickedColor.cur = 0;

function uploadImage(a) {
  let img = document.querySelector("img");
  img.src = URL.createObjectURL(a[0]);
  img.onload = () => calculate(true);
}

function calculate(isFirstRender) {
  let canv = document.getElementById("canv");
  let img = document.querySelector("img");
  canv.width = img.width;
  canv.height = img.height;
  let qqq = canv.getContext("2d");
  qqq.drawImage(img, 0, 0, img.width, img.height);

  img.style.visibility = "hidden";

  if (isFirstRender) {
    data = qqq.getImageData(0, 0, canv.width, canv.height);
    getArrayOfColors(data.data);

    canv.addEventListener("mousemove", (e) => {
      showColor(e.offsetX, e.offsetY);
    });
    canv.addEventListener("click", (e) => {
      showColor(e.offsetX, e.offsetY, true);
    });
    document.getElementById("calculate").addEventListener("click", () => {
      redrawPixels(setDelta.color);
    });
  }
}

function showColor(x, y, isClicked) {
  document.getElementById("coord").innerHTML = `${x}  ${y}`;
  document.getElementById("rgba").innerHTML = arrayData[y * data.width + x];
  document.querySelector('[class="output2"]').style.backgroundColor = `rgb(${arrayData[y * data.width + x]})`;

  if (isClicked) {
    addSquereWPickedColor(x, y, true);
  }
}

function getArrayOfColors(array4) {
  for (let i = 8; i < array4.length - 4; i++) {
    if (i % 4 === 0) {
      arrayData.push(`${array4[i - 4]},${array4[i - 3]},${array4[i - 2]}`);
    }
  }
}

function addSquereWPickedColor(x, y, newPick) {
  let currcol;
  // console.log(addSquereWPickedColor.cur);
  if (addSquereWPickedColor.cur > 2) return;
  if (typeof arguments[0] == "string") {
    currcol = x;
  } else {
    currcol = arrayData[y * data.width + x];
  }
  document.querySelector('[class*="selectedColors"]').insertAdjacentHTML("beforeend", variables.colorObj);

  document.querySelector('[class*="selectedColors"]').classList.remove("hidden");
  document.getElementById("clear").addEventListener("click", () => clearSelectedColors());
  disableButtonById("clear", false);

  if (newPick) {
    let list = document.querySelectorAll('[class="output"]');
    // list[list.length - 1].addEventListener("click", () => {
    //   addRangeSq(currcol);
    // });
    return setDelta(currcol);
  }
  addSquereWPickedColor.cur++;
}
function setDelta(clr) {
  document.querySelector("#delta").classList.remove("hidden");
  disableButtonById("calculate", false);
  setDelta.color = clr;
}

function redrawPixels(color) {
  if (redrawPixels.redrawed) {
    redrawPixels.redrawed = false;
    calculate(false);
  }
  let percent = 0;
  let canvas = document.getElementById("canv");
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fd02bf";
  // let delta = document.querySelector("input#delta").value;
  // console.log(delta);
  let localInputColor = color.split(",");

  for (let i = 0; i < arrayData.length; i++) {
    let currColor = arrayData[i].split(",");
    if (
      ((+currColor[0] - +localInputColor[0]) ** 2 + (+currColor[1] - +localInputColor[1]) ** 2 + (+currColor[2] - +localInputColor[2]) ** 2) ** 0.5 <
      document.querySelector("input#delta").value
    ) {
      ctx.fillRect(i % data.width, i / data.width, 1, 1);
      percent++;
    }
  }
  document.getElementById("percent").innerHTML = ((percent / arrayData.length) * 100).toFixed(3);
  redrawPixels.redrawed = true;
  return arrayOfColors.push({
    color: `${color}`,
    percent: `${(percent / arrayData.length) * 100}`,
    name: "blank",
  });
}

function clearSelectedColors() {
  console.log("adas");
  document.querySelector('[class*="selectedColors"]').innerHTML = ``;

  disableButtonById("clear", true);
  disableButtonById("calculate", true);
  addSquereWPickedColor.cur = 0;
  document.querySelector("#delta").classList.add("hidden");
  document.querySelector('[class*="selectedColors"]').classList.add("hidden");
  return redrawPixels.redrawed ? (calculate(false), (redrawPixels.redrawed = false)) : null;
}

function disableButtonById(name, state) {
  document.getElementById(`${name}`).disabled = state;
}
