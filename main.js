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

    canv.addEventListener("mousemove", (e) => showColor(e.offsetX, e.offsetY));
    canv.addEventListener("click", (e) => showColor(e.offsetX, e.offsetY, true));
    document.getElementById("calculate").addEventListener("click", () => redrawPixels(setDelta()));
    document.getElementById("clear").addEventListener("click", () => clearSelectedColors());
  }
}

function showColor(x, y, isClicked) {
  document.getElementById("coord").innerHTML = `${x}  ${y}`;
  document.getElementById("rgba").innerHTML = arrayData[y * data.width + x];
  document.querySelector('[class="output2"]').style.backgroundColor = `rgb(${arrayData[y * data.width + x]})`;

  if (isClicked) {
    addSquereWPickedColor(x, y);
  }
}

function getArrayOfColors(array4) {
  for (let i = 8; i < array4.length - 4; i++) {
    if (i % 4 === 0) {
      arrayData.push(`${array4[i - 4]},${array4[i - 3]},${array4[i - 2]}`);
    }
  }
}

function addSquereWPickedColor(x, y) {
  if (addSquereWPickedColor.cur > 2) return;

  currcol = arrayData[y * data.width + x];

  document.querySelector('[class*="selectedColors"]').insertAdjacentHTML("beforeend", colorObj());
  document.querySelector('[class*="selectedColors"]').classList.remove("hidden");

  disableButtonById("clear", false);

  addSquereWPickedColor.cur++;
  return setDelta(currcol);
}

function setDelta(clr) {
  document.querySelector("#delta").classList.remove("hidden");
  disableButtonById("calculate", false);

  setDelta.data = new colorData(document.querySelector("input#delta").value, clr, document.querySelector("input#phaseNameInput").value);
  return setDelta.data;
}

function redrawPixels(obj) {
  if (redrawPixels.redrawed) {
    redrawPixels.redrawed = false;
    calculate(false);
  }

  console.log(obj);

  let percent = 0;
  let canvas = document.getElementById("canv");
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fd02bf";

  for (let i = 0; i < arrayData.length; i++) {
    let currColor = arrayData[i].split(",");
    if (((+currColor[0] - +obj.colorArr[0]) ** 2 + (+currColor[1] - +obj.colorArr[1]) ** 2 + (+currColor[2] - +obj.colorArr[2]) ** 2) ** 0.5 < obj.delta) {
      ctx.fillRect(i % data.width, i / data.width, 1, 1);
      percent++;
    }
  }
  document.getElementById("percent").innerHTML = ((percent / arrayData.length) * 100).toFixed(3);
  redrawPixels.redrawed = true;
  return arrayOfColors.push({
    color: obj.color,
    percent: `${(percent / arrayData.length) * 100}`,
    name: obj.phaseName,
    delta: obj.delta,
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
