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
    document.getElementById("calculate").addEventListener("click", () => redrawPixels(0));
    document.getElementById("clear").addEventListener("click", () => clearSelectedColors());
    dragndrop(document.querySelector('[class*="dragheader"]'));
  }
}
function dragndrop(elem) {
  let coorddata = {
    xDef: 0,
    yDef: 0,
    xNew: 0,
    yNew: 0,
  };
  elem.onmousedown = function mousedown(e) {
    coorddata.xDef = elem.getBoundingClientRect().x;
    coorddata.yDef = elem.getBoundingClientRect().y;
    coorddata.xNew = e.clientX;
    coorddata.yNew = e.clientY;
    document.onmousemove = mousemove;
    document.onmouseup = closedrag;
  };
  function mousemove(e) {
    e.preventDefault();
    selectedColors.style.top = -coorddata.yNew + coorddata.yDef + e.clientY + "px";
    selectedColors.style.left = -coorddata.xNew + coorddata.xDef + e.clientX + "px";
  }
  function closedrag() {
    document.onmouseup = null;
    document.onmousemove = null;
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

  obj = new colorData(currcol, addSquereWPickedColor.cur);

  selectedColors.insertAdjacentHTML("beforeend", colorObj());
  onDeleteRow(addSquereWPickedColor.cur);

  selectedColors.classList.remove("hidden");
  document.querySelector("#delta").classList.remove("hidden");
  document.querySelector("#phaseNameInput").classList.remove("hidden");

  disableButtonById("clear", false);
  disableButtonById("calculate", false);

  addSquereWPickedColor.cur++;
  return arrayOfColors.push(obj);
}
//TODO передавать нужны индекс
function redrawPixels(i) {
  if (redrawPixels.redrawed) {
    redrawPixels.redrawed = false;
    calculate(false);
  }
  let variable = arrayOfColors[i];

  variable.set(document.querySelector("input#delta").value, document.querySelector("input#phaseNameInput").value);

  let count = 0;
  let canvas = document.getElementById("canv");
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fd02bf";

  for (let i = 0; i < arrayData.length; i++) {
    let currColor = arrayData[i].split(",");
    if (((+currColor[0] - +variable.colorArr[0]) ** 2 + (+currColor[1] - +variable.colorArr[1]) ** 2 + (+currColor[2] - +variable.colorArr[2]) ** 2) ** 0.5 < variable.delta) {
      ctx.fillRect(i % data.width, i / data.width, 1, 1);
      count++;
    }
  }
  variable.percent = (count / arrayData.length) * 100;
  document.getElementById("percent").innerHTML = ((count / arrayData.length) * 100).toFixed(3);
  redrawPixels.redrawed = true;
}

function clearSelectedColors() {
  document.querySelectorAll(".flex").forEach((i) => selectedColors.removeChild(i));

  disableButtonById("clear", true);
  disableButtonById("calculate", true);
  // addSquereWPickedColor.cur = 0;
  document.querySelector("#delta").classList.add("hidden");
  document.querySelector("#phaseNameInput").classList.add("hidden");
  selectedColors.classList.add("hidden");

  return redrawPixels.redrawed ? (calculate(false), (redrawPixels.redrawed = false)) : null;
}

function disableButtonById(name, state) {
  document.getElementById(`${name}`).disabled = state;
}

function onDeleteRow(index) {
  selectedColors.lastChild.querySelector(".cancel").addEventListener("click", () => {
    console.log(addSquereWPickedColor.cur);
    arrayOfColors.splice(index, 1);
    selectedColors.removeChild(selectedColors.lastChild);
    addSquereWPickedColor.cur--;
    if (addSquereWPickedColor.cur === 0) selectedColors.classList.add("hidden");
  });

  selectedColors.lastChild.addEventListener("click", () => {
    // this.classList.add("fde");
    // console.log(index);
    selectedColors.children[index + 1].classList.toggle("selected");
    // globalState.selectedRow = index + 1;
  });
}
