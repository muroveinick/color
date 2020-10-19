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
    document.getElementById("calculate").addEventListener("click", () => redrawPixels(globalState.selectedRow));
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
    document.querySelector(".drag").style.top = -coorddata.yNew + coorddata.yDef + e.clientY + "px";
    document.querySelector(".drag").style.left = -coorddata.xNew + coorddata.xDef + e.clientX + "px";
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

  arrayOfColors.push(new colorData(arrayData[y * data.width + x], addSquereWPickedColor.cur));
  // document.querySelectorAll(".flex").forEach((i) => selectedColors.removeChild(i));
  // selectedColors.innerHTML = "";

  // arrayOfColors.forEach((i) => selectedColors.insertAdjacentHTML("beforeend", colorObj(i)));
  onDeleteRow();

  selectedColors.classList.remove("hidden");
  document.querySelector("#delta").classList.remove("hidden");
  document.querySelector("#phaseNameInput").classList.remove("hidden");

  disableButtonById("clear", false);
  disableButtonById("calculate", false);

  addSquereWPickedColor.cur++;
  // return onDeleteRow();
}

//TODO передавать нужны индекс
function redrawPixels(index) {
  if (redrawPixels.redrawed) {
    redrawPixels.redrawed = false;
    calculate(false);
  }

  console.log(globalState.selectedRow);
  let variable = arrayOfColors[index];
  variable.set(document.querySelector("input#delta").value, document.querySelector("input#phaseNameInput").value);
  console.log(globalState.selectedRow);
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
  selectedColors.children[index + 1].querySelector("#percent").innerHTML = ((count / arrayData.length) * 100).toFixed(3);
  selectedColors.children[index + 1].querySelector("#phaseName").innerHTML = variable.phaseName;
  redrawPixels.redrawed = true;
}

function clearSelectedColors() {
  disableButtonById("clear", true);
  disableButtonById("calculate", true);
  // addSquereWPickedColor.cur = 0;
  document.querySelector("#delta").classList.add("hidden");
  document.querySelector("#phaseNameInput").classList.add("hidden");
  document.querySelector(".drag").classList.add("hidden");

  return redrawPixels.redrawed ? (calculate(false), (redrawPixels.redrawed = false)) : null;
}

function disableButtonById(name, state) {
  document.getElementById(`${name}`).disabled = state;
}

function onDeleteRow() {
  HTMLCollection.prototype.forEach = Array.prototype.forEach;

  ///////перерисовываем выбранные точки
  selectedColors.innerHTML = "";
  arrayOfColors.forEach((i) => selectedColors.insertAdjacentHTML("beforeend", colorObj(i)));

  selectedColors.children.forEach((i, j) => {
    ///на кнопку x
    i.querySelector(".cancel").addEventListener("click", () => {
      arrayOfColors.splice(j, 1);
      selectedColors.removeChild(i);
      addSquereWPickedColor.cur--;
      if (addSquereWPickedColor.cur === 0) document.querySelector(".drag").classList.add("hidden");
      return onDeleteRow();
    });
    ///на сам ряд
    i.addEventListener("click", () => {
      selectedColors.children.forEach((k) => (k.classList.contains("selected") ? k.classList.remove("selected") : null));

      i.classList.toggle("selected");
      console.log(j);
      globalState.selectedRow = j;
    });
  });
}
