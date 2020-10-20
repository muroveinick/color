let arrayData = [];
let arrayOfColors = [];
const selectedColors = document.querySelector('[class*="selectedColors"]');
const drag = document.querySelector(".drag");

let colorObj = (obj) => `<div class="flex"> 
                            <div class="output" style="background-color: rgb(${obj.color})"></div>
                            <label>Цвета, %: </label>
                            <span id="percent">${obj.percent.toFixed(3)}</span>
                            <label>Название: </label>
                            <span id="phaseName" style="min-width: 20px">${obj.phaseName}</span>
                            <label>Разброс: </label>
                            <span id="phaseName" style="min-width: 20px">${obj.delta}</span>
                           <!-- <button class="ok">OK</button> -->
                            <button class="cancel">X</button>
                          </div>`;
colorData = class {
  constructor(color, id) {
    this.id = id;
    this.color = color;
    this.colorArr = color.split(",");
  }
  percent = 0;
  delta = 0;
  phaseName = "";
  set(delta, phaseName) {
    this.delta = delta;
    this.phaseName = phaseName;
  }
};
let globalState = {
  selectedRow: 0,
  rowCount: 0,
};
