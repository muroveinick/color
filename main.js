const canvas = document.getElementById("canv");
HTMLCollection.prototype.forEach = Array.prototype.forEach;
_mouse_pressed = false;


function uploadImage(a) {
  let img = document.querySelector("img");
  img.src = URL.createObjectURL(a[0]);
  img.onload = () => calculate(true);
  document.querySelector('label[for="file"]').classList.add("hidden");
}

function calculate(isFirstRender) {
  let img = document.querySelector("img");
  canvas.width = img.width;
  canvas.height = img.height;
  let context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(img, 0, 0, img.width, img.height);

  img.style.visibility = "hidden";

  if (isFirstRender) {
    const image_data = context.getImageData(0, 0, canvas.width, canvas.height);
    getArrayOfColors(image_data.data);

    canvas.addEventListener("mousemove", (e) => showColor(e.offsetX, e.offsetY, image_data.width));
    canvas.addEventListener("mousedown", (e) => _mouse_pressed = true);
    canvas.addEventListener("mouseup", (e) => {
      _mouse_pressed = false

      const index = arrayOfColors.findIndex(el => el.selected);
      if (index !== -1) {
        const check = document.querySelector(`#lasso${index}`);
        if (check.checked) return
      }

      addSquereWPickedColor(e.offsetX, e.offsetY, image_data.width);
    });

    dragndrop(drag);
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
    elem.style.top = -coorddata.yNew + coorddata.yDef + e.clientY + "px";
    elem.style.left = -coorddata.xNew + coorddata.xDef + e.clientX + "px";
  }
  function closedrag() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function showColor(x, y, width) {
  document.getElementById("coord").innerHTML = `${x}  ${y} ${_mouse_pressed}`;
  document.getElementById("rgba").innerHTML = arrayData[y * width + x];
  document.querySelector('[class="output2"]').style.backgroundColor = `rgb(${arrayData[y * width + x]})`;

  if (_mouse_pressed)
    addLassoPixels()
}

function getArrayOfColors(array4) {
  for (let i = 8; i < array4.length - 4; i++) {
    if (i % 4 === 0) {
      arrayData.push(`${array4[i - 4]},${array4[i - 3]},${array4[i - 2]}`);
    }
  }
}

function addSquereWPickedColor(x, y, width) {
  arrayOfColors.push(new colorData(arrayData[y * width + x], arrayOfColors.length));
  redrawModal();
}

function redrawPixels() {
  if (redrawPixels.redrawed) {
    redrawPixels.redrawed = false;
    calculate(false);
  }

  const index = arrayOfColors.findIndex((el) => el.selected);
  if (index === -1) return;

  const currElem = arrayOfColors[index];
  const count = markInPurple(currElem);

  currElem.percent = ((count / arrayData.length) * 100).toFixed(2);

  // document.querySelector("#sum").innerHTML = `Всего пикселей ${arrayData.length}, current px ${(c = arrayOfColors.reduce((acc, i) => {
  //   acc += i.percent;
  //   return acc;
  // }, 0))} current % ${((c / arrayData.length) * 100).toFixed(1)}`;

  redrawPixels.redrawed = true;
  redrawModal();
}

drawAll = () => arrayOfColors.forEach(colorElem => markInPurple(colorElem));

markInPurple = (colorElem) => {
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fd02bf";


  if (!colorElem.pixelIndexes.length)
    for (let i = 0; i < arrayData.length; i++) {
      let currColor = arrayData[i].split(",");
      if (((+currColor[0] - +colorElem.colorArr[0]) ** 2 + (+currColor[1] - +colorElem.colorArr[1]) ** 2 + (+currColor[2] - +colorElem.colorArr[2]) ** 2) ** 0.5 < colorElem.delta) {
        ctx.fillRect(i % data.width, i / data.width, 1, 1);
        colorElem.pixelIndexes.add(i)
      }
    }

  else
    [...colorElem.pixelIndexes].forEach(index => {
      ctx.fillRect(index % data.width, index / data.width, 1, 1);
    })

  return colorElem.pixelIndexes.size
}

function disableButtonById(name, state) {
  document.getElementById(`${name}`).disabled = state;
}

function redrawModal() {
  ///////перерисовываем выбранные точки
  selectedColors.innerHTML = "";

  arrayOfColors.forEach((el, index) => {
    el.selected = false;
    const tmp = colorObj(el, index);
    selectedColors.insertAdjacentHTML("beforeend", tmp);
  });

  if (arrayOfColors.length) drag.classList.remove("hidden");

  selectedColors.children.forEach((i, j) => {
    ///на кнопку x
    i.querySelector(".cancel").addEventListener("click", () => {
      let res = confirm("удалить?");
      if (res) {
        arrayOfColors.splice(j, 1);
        selectedColors.removeChild(i);
        if (arrayOfColors.length === 0) drag.classList.add("hidden");
        redrawModal();
      }
    });

    ///на сам ряд
    i.addEventListener("click", () => {
      selectedColors.children.forEach(k => k.classList.remove("selected"));

      i.classList.toggle("selected");
      arrayOfColors.forEach((elem, index) => elem.selected = index === j ? true : false)
    });
  });
}


function addLassoPixels() {
  const index = arrayOfColors.findIndex((el) => el.selected);
  if (index === -1) return;

  // console.log(`lasso${index}`);
  // console.log(document.querySelector(`#lasso${index}`).checked);
}