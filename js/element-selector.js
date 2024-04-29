const tableContainer = document.getElementById('periodic-table');

for (let i = 0; i < window.periodic_table.length; i++) {
    const el = window.periodic_table[i];
    const btn = document.createElement('button');
    const periodicTableButtonWidth = 36;

    btn.style.position = 'absolute';
    btn.style.left = (el.xpos * periodicTableButtonWidth) + 'px';
    btn.style.top = (el.ypos * periodicTableButtonWidth) + 'px';
    btn.style.width = periodicTableButtonWidth + 'px';
    btn.style.height = periodicTableButtonWidth + 'px';
    btn.style.fontSize = '11px';
    btn.classList.add('el-btn');
    btn.title = el.name;
    btn.innerText = el.symbol;
    btn.onclick = () => { window.updateSelectedElement(el.symbol); };

    tableContainer.appendChild(btn);
}

const elButtons = [...document.getElementsByClassName('el-btn')];

window.openElementSelector = () => { tableContainer.style.display = 'block'; }
window.closeElementSelector = () => { tableContainer.style.display = 'none'; }
window.updateSelectedElement = el => {
    document.getElementById('selected-element').innerText = el;

    for (let elBtn of elButtons) {
        if (elBtn.innerText === el)
            elBtn.classList.add('selected');
        else
            elBtn.classList.remove('selected');
    }

    window.closeElementSelector();
    window.selectedElement = el;
};
window.selectedElement = 'H';

const chargeButtons = [...document.getElementsByClassName('charge-btn')];

window.setMoleculeCharge = (charge, update = true) => {
    window.graphState.moleculeCharge = charge;

    for (let cBtn of chargeButtons) {
        if (cBtn.innerText.includes((charge < 0 ? '-' : (charge > 0 ? '+' : '')) + Math.abs(charge)))
            cBtn.classList.add('selected');
        else
            cBtn.classList.remove('selected');
    }
    if (update)
        window.updateGraphState();
};

setTimeout(() => {
    window.setMoleculeCharge(0);
    window.updateSelectedElement('H');
}, 10);
