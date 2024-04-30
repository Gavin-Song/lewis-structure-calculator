const PERIODIC_TABLE_MAP = {};
for (let atom of window.periodic_table)
    PERIODIC_TABLE_MAP[atom.symbol] = atom;

const ATOM_SYMBOLS = Object.keys(PERIODIC_TABLE_MAP);
ATOM_SYMBOLS.sort((a, b) => b.length - a.length);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const chargeSelector = document.getElementById('charge-selection');
const moleculeData = document.getElementById('molecule-stats');
const errors = document.getElementById('errors');

const resizeObserver = new ResizeObserver(() => {
    canvas.width = Math.round(canvas.clientWidth);
    canvas.height = Math.round(canvas.clientHeight);
});
resizeObserver.observe(canvas);

class DrawnAtom {
    constructor(x, y, type, id) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.id = id;
        this.charge = 0;
        this.connectTo = new Set();
    }
}

window.graphState = {
    idToAtomMap: {},
    idToElectrons: {},
    totalValence: 0,
    moleculeCharge: 0,
    bonds: [], // [id1, id2]
    bondStrengthMap: {}, // "id1,id2": 1|2|3
    bondIdMap: {}
};

window.updateGraphState = () => {
    window.graphState.bonds = [];
    window.graphState.bondStrengthMap = {};
    window.graphState.bondIdMap = {};
    window.graphState.idToAtomMap = {};
    window.graphState.idToElectrons = {};
    window.graphState.totalValence = -graphState.moleculeCharge;

    let atomValence = {};

    function setBondStrength(atom, connection, strength) {
        graphState.bondStrengthMap[`${atom.id},${connection.id}`] = strength;
        graphState.bondStrengthMap[`${connection.id},${atom.id}`] = strength;
    }

    function getMaxElectronsForAtom(atom) {
        let maxElectronsForAtom = 8;
        if (atom.type === 'H') maxElectronsForAtom = 2; // H is weak
        if (PERIODIC_TABLE_MAP[atom.type].period >= 3) maxElectronsForAtom = 999;
        return maxElectronsForAtom;
    }

    let electronegativityMap = {};

    for (let atom of window.drawingState.atoms) {
        const valenceElectronsForAtom = PERIODIC_TABLE_MAP[atom.type].shells.at(-1);
        window.graphState.totalValence += valenceElectronsForAtom;
        if (!atomValence[atom.type]) {
            atomValence[atom.type] = {
                count: 0,
                perAtom: valenceElectronsForAtom,
                name: atom.type
            };
        }
        atomValence[atom.type].count++;
        electronegativityMap[atom.type] = PERIODIC_TABLE_MAP[atom.type].electronegativity_pauling;
        
        window.graphState.idToAtomMap[atom.id] = atom;
        for (let connection of atom.connectTo) {
            if (!graphState.bondIdMap[atom.id]) graphState.bondIdMap[atom.id] = [];
            if (!graphState.bondIdMap[connection.id]) graphState.bondIdMap[connection.id] = [];

            graphState.bondIdMap[atom.id].push(connection.id);
            graphState.bondIdMap[connection.id].push(atom.id);
            graphState.bonds.push([atom.id, connection.id].sort());
            setBondStrength(atom, connection, 1);
        }
    }

    document.getElementById('electronegativity').innerText = ([...Object.keys(electronegativityMap)]
        .sort((a, b) => electronegativityMap[a] - electronegativityMap[b])
        .join(' → ')) || 'N/A';
    document.getElementById('period3').innerText = ([...Object.keys(electronegativityMap)]
        .filter(x => PERIODIC_TABLE_MAP[x].period >= 3)
        .join(' → ')) || 'None';

    // Add electrons to non-central atoms
    const bond_electrons_used = 2 * window.graphState.bonds.length;
    let budget = graphState.totalValence - bond_electrons_used;
    let centralAtoms = [];

    for (let atom of window.drawingState.atoms) {
        if (budget === 0) break;
        if (graphState.bondIdMap[atom.id]?.length !== 1) {
            centralAtoms.push(atom);
            continue;
        }
        if (atom.type === 'H') continue; // Hydrogen can only have 2 :( (used by bond)

        const cut = Math.min(budget, 6); // Complete octet for atoms with degree = 1
        graphState.idToElectrons[atom.id] = cut;
        budget -= cut;
    }

    // Add electrons to central atoms, sorted by electronegativity
    centralAtoms.sort((b, a) => PERIODIC_TABLE_MAP[a.type].electronegativity_pauling - PERIODIC_TABLE_MAP[b.type].electronegativity_pauling);
    let fairSplitAmt = Math.floor(budget / centralAtoms.length);
    // Round to nearest multiple of 2
    if (fairSplitAmt % 2 == 1)
        fairSplitAmt++;

    for (let atom of centralAtoms) {
        if (budget === 0) break;
        if (atom.type === 'H') continue;

        const cut = Math.min(budget, fairSplitAmt, 8 - (graphState.bondIdMap[atom.id]?.length || 0) * 2); // Complete octet for atoms with degree = 1
        graphState.idToElectrons[atom.id] = cut;
        budget -= cut;
    }

    // Round robin remaining electrons
    let max = 0;
    while (budget > 0) {
        for (let atom of centralAtoms) {
            if (budget === 0) break;
            if (atom.type === 'H') continue;

            const cut = Math.min(2, budget);
            if ((graphState.bondIdMap[atom.id]?.length || 0) * 2 + (graphState.idToElectrons[atom.id] || 0) + cut > getMaxElectronsForAtom(atom))
                continue;

            graphState.idToElectrons[atom.id] += cut;
            budget -= cut;
        }
        max++;
        if (max > 8) break;
    }

    let excessElectrons = budget > 0;

    // Compute formal charges
    function computeFormalCharges() {
        for (let atom of window.drawingState.atoms) {
            let bondElectrons = 0;
            for (let neighborId of graphState.bondIdMap[atom.id] || [])
                bondElectrons += graphState.bondStrengthMap[`${atom.id},${neighborId}`];
            atom.charge = PERIODIC_TABLE_MAP[atom.type].shells.at(-1) - bondElectrons - (graphState.idToElectrons[atom.id] || 0);
        }
    }

    computeFormalCharges();

    function getElectronsInBonds(atom) {
        let arr = (graphState.bondIdMap[atom.id] || [])
            .map(a => graphState.bondStrengthMap[`${atom.id},${a}`] * 2);
        if (!arr.length) return 0;
        return arr.reduce((a, b) => a + b);
    }

    // Form double or triple bonds
    let recalcFormal = false;
    for (let atom of window.drawingState.atoms) {
        if (atom.type === 'H') continue;
        let charge1sign = atom.charge < 0 ? 1 : -1;
        for (let neighbor of atom.connectTo) {
            if (neighbor.type === 'H') continue;
            let charge2sign = neighbor.charge < 0 ? 1 : -1;

            // Resolve formal charge differences by making bonds
            if (charge1sign !== charge2sign && atom.charge && neighbor.charge) {
                let bondStrength = graphState.bondStrengthMap[`${atom.id},${neighbor.id}`];
                let amt = Math.min(Math.abs(atom.charge), Math.abs(neighbor.charge));
                amt = Math.min(3 - bondStrength, amt);

                let electrons1 = getElectronsInBonds(atom);
                let electrons2 = getElectronsInBonds(neighbor);

                amt = Math.min(
                    (getMaxElectronsForAtom(atom) - electrons1) / 2,
                    (getMaxElectronsForAtom(neighbor) - electrons2) / 2,
                    amt);

                if (amt > 0) {
                    atom.charge += charge1sign * amt;
                    neighbor.charge += charge2sign * amt;
                    setBondStrength(atom, neighbor, bondStrength + amt);

                    function freeElectronsNeededToMatchCharge(atom, charge) {
                        const valenceElectronsForAtom = PERIODIC_TABLE_MAP[atom.type].shells.at(-1);
                        const bondCount = getElectronsInBonds(atom) / 2;
                        // charge = valence - X - bonds => X = (-B - C + V)
                        return valenceElectronsForAtom - bondCount - charge;
                    }

                    graphState.idToElectrons[neighbor.id] = freeElectronsNeededToMatchCharge(neighbor, neighbor.charge);
                    graphState.idToElectrons[atom.id] = freeElectronsNeededToMatchCharge(atom, atom.charge);

                    recalcFormal = true;
                }
            }
        }
    }

    // Resolve incomplete octets
    const getElectronCount = atom => getElectronsInBonds(atom) + (graphState.idToElectrons[atom.id] || 0);

    for (let atom of window.drawingState.atoms) {
        if (atom.type === 'H') continue;

        let electrons1 = getElectronCount(atom);
        if (electrons1 < 8) {
            let sortedNeighbors = graphState.bondIdMap[atom.id].map(x => graphState.idToAtomMap[x]);
            sortedNeighbors.sort((b, a) => PERIODIC_TABLE_MAP[a.type].electronegativity_pauling - PERIODIC_TABLE_MAP[b.type].electronegativity_pauling);

            for (let neighbor of sortedNeighbors) {
                if (electrons1 >= 8) break;
                if (neighbor.type === 'H') continue;
                let electrons2 = getElectronCount(neighbor);
                if (electrons2 < 8) {
                    // Form as many bonds as we can
                    let amt = 8 - Math.min(electrons1, electrons2);
                    let bondStrength = graphState.bondStrengthMap[`${atom.id},${neighbor.id}`];
                    amt = Math.min(amt, 3 - bondStrength);

                    electrons1 = getElectronCount(atom);
                    setBondStrength(atom, neighbor, bondStrength + amt);
                    graphState.idToElectrons[neighbor.id] -= amt;
                    graphState.idToElectrons[atom.id] -= amt;

                    recalcFormal = true;
                }
            }
        }
    }

    if (recalcFormal) computeFormalCharges();
    recalcFormal = false;

    // Try to resolve atoms with too many electrons
    for (let atom of window.drawingState.atoms) {
        let electrons = getElectronsInBonds(atom) + (graphState.idToElectrons[atom.id] || 0);
        let maxElectronsForAtom = getMaxElectronsForAtom(atom);

        if (electrons > maxElectronsForAtom) {
            let sortedNeighbors = (graphState.bondIdMap[atom.id] || []).map(x => graphState.idToAtomMap[x]);
            sortedNeighbors.sort((b, a) => PERIODIC_TABLE_MAP[a.type].electronegativity_pauling - PERIODIC_TABLE_MAP[b.type].electronegativity_pauling);

            for (let neighbor of sortedNeighbors) {
                if (electrons <= maxElectronsForAtom) break;
                if (neighbor.type === 'H') continue;
    
                let electrons2 = getElectronCount(neighbor);
                let bondStrength = graphState.bondStrengthMap[`${atom.id},${neighbor.id}`];

                if (electrons2 === 8 && bondStrength > 1) {
                    setBondStrength(atom, neighbor, bondStrength - 1);
                    electrons -= 2;
                    graphState.idToElectrons[neighbor.id] += 2;
                }
            }
        }
    }

    // Sanity checks
    // ------------------
    let errorMsgs = [];

    if (excessElectrons)
        errorMsgs.push('There seem to be excess electrons');
    if (graphState.totalValence - bond_electrons_used < 0)
        errorMsgs.push('Too many bonds, not enough electrons');

    for (let atom of window.drawingState.atoms) {
        let electrons = getElectronsInBonds(atom) + (graphState.idToElectrons[atom.id] || 0);

        let maxElectronsForAtom = getMaxElectronsForAtom(atom);

        if (electrons > maxElectronsForAtom)
            errorMsgs.push(`Atom ${atom.type}: has ${electrons} electrons (max ${maxElectronsForAtom})!`);
    }

    // Check if fully connected
    if (drawingState.atoms.length) {
        let visited = new Set();
        let toVisit = [window.drawingState.atoms[0].id];

        while (toVisit.length) {
            let current = toVisit[0];
            toVisit = toVisit.slice(1);
            if (visited.has(current)) continue;
            visited.add(current);

            for (let conn of [...(graphState.bondIdMap[current] || [])])
                if (!visited.has(conn))
                    toVisit.push(conn);
        }

        if (visited.size !== drawingState.atoms.length)
            errorMsgs.push('Graph is not fully connected');
    }

    errors.innerHTML = errorMsgs.map(x => `<li>${x}</li>`).join('\n');
    

    // Display help
    // ---------------------
    moleculeData.innerHTML = `
    <table>
        <tr>
            <td>Molecule Charge</td>
            <td>${-graphState.moleculeCharge}</td>
        </tr>
        ${Object.keys(atomValence).map(k => `<tr><td>${atomValence[k].perAtom} x ${atomValence[k].count} ${atomValence[k].name}</td><td>${atomValence[k].count * atomValence[k].perAtom}</td></tr>`).join('\n')}
        
        <tr>
            <td>Bonds</td>
            <td>${-bond_electrons_used}</td>
        </tr>
        <tr style="background-color: #dcdcdc">
            <td></td>
            <td>${graphState.totalValence - bond_electrons_used}</td>
        </tr>
    </table>`;
    drawCanvas();
};

window.drawingState = {};
window.drawingStateStack = [];
window.drawingStateStackIdx = 0;
window.uiState = {
    isMouseDown: false,
    mousePos: [0, 0],
    isShiftDown: false,
};

window.resetDrawingState = (update = true) => {
    window.drawingState = {
        atoms: [], // List of atoms
        selectedAtom: null,
        startDragLoc: [0, 0],
        idCounter: 0,
    };
    if (update)
        window.updateGraphState();
};
window.resetDrawingState();

window.pushDrawingState = () => {
    window.drawingStateStackIdx++;
    let copy = deepcopy({
        ...window.drawingState,
        atoms: window.drawingState.atoms.map(atom => ({
            ...atom,
            connectTo: [...atom.connectTo]
        }))
    });
    if (window.drawingStateStackIdx > window.drawingStateStack.length)
        window.drawingStateStack.push(copy);
    else
        window.drawingStateStack[window.drawingStateStackIdx - 1] = copy;
    window.drawingStateStack = window.drawingStateStack.slice(0, window.drawingStateStackIdx);
    window.updateGraphState();
};

window.switchToHistoryState = () => {
    let oldState = deepcopy(window.drawingState);
    window.drawingState = deepcopy(window.drawingStateStack[window.drawingStateStackIdx - 1]);
    window.drawingState.atoms = window.drawingState.atoms.map(atom => {
        let newSet = new Set(atom.connectTo);
        let ret = new DrawnAtom(atom.x, atom.y, atom.type, atom.id);
        ret.connectTo = newSet;
        ret.charge = atom.charge;
        return ret;
    });

    // Fix references
    let idMap = {};
    for (let atom of drawingState.atoms)
        idMap[atom.id] = atom;
    for (let atom of drawingState.atoms) {
        let newSet = new Set();
        for (let neighbor of atom.connectTo)
            newSet.add(idMap[neighbor.id]);
        atom.connectTo = newSet;
    }

    window.drawingState.startDragLoc = oldState.startDragLoc;
    window.updateGraphState();
}

window.popDrawingState = () => {
    window.drawingStateStackIdx--;
    if (window.drawingStateStackIdx < 1) {
        window.resetDrawingState();
        window.drawingStateStackIdx = 0;
        return;
    }
    window.switchToHistoryState();
};


/**
 * Return nearest atom in drawingState in radius
 * @param {number} x
 * @param {number} y
 * @param {number} r Max radius
 * @return {DrawingAtom} nearest atom, or null if none exist
 */
function findNearestAtom(x, y, r) {
    let nearestAtom = null;
    let nearestDis = Number.POSITIVE_INFINITY;
    for (let atom of window.drawingState.atoms) {
        let cdis = distance(atom.x, atom.y, x, y);
        if (cdis <= r && cdis < nearestDis) {
            nearestAtom = atom;
            nearestDis = cdis;
        }
    }
    return nearestAtom;
}

/**
 * Remove given atom and all bonds
 * @param {DrawingAtom} atom 
 */
function removeAtom(atom) {
    window.drawingState.atoms = window.drawingState.atoms.filter(x => x.id !== atom.id);
    window.drawingState.selectedAtom = window.drawingState.selectedAtom === atom.id ? null : window.drawingState.selectedAtom;
    window.drawingState.atoms.forEach(a => {
        a.connectTo = new Set([...a.connectTo].filter(x => x.id !== atom.id));
    });
}

/**
 * Is bond between two atoms currently being hovered, return distance
 * @param {DrawnAtom} atom 
 * @param {DrawnAtom} other 
 * @return {number} distance
 */
function bondHoverDis(atom, other) {
    const two_norm = distance(other.x, other.y, atom.x, atom.y);
    const dx = (ATOM_CLICK_DISTANCE_THRESHOLD + ATOM_SIZE) * (other.x - atom.x) / two_norm;
    const dy = (ATOM_CLICK_DISTANCE_THRESHOLD + ATOM_SIZE) * (other.y - atom.y) / two_norm;
    const d = pointLineDistance(window.uiState.mousePos[0], window.uiState.mousePos[1],
        atom.x + dx, atom.y + dy, other.x - dx, other.y - dy);
    return d;
}

/**
 * Remove currently hovered bonds... yeah
 * Does not update history API - do that yourself!
 */
function removeHoveredBond() {
    let nearest_atoms = null;
    let nearest_dis = Number.POSITIVE_INFINITY;

    for (let atom of window.drawingState.atoms) {
        for (let other of [...atom.connectTo]) {
            const dis = bondHoverDis(atom, other);
            const isHover = dis < ATOM_CLICK_DISTANCE_THRESHOLD;
            
            if (isHover && dis < nearest_dis) {
                nearest_dis = dis;
                nearest_atoms = [atom, other];
            }
        }
    }

    if (nearest_atoms !== null) {
        let atom = nearest_atoms[0];
        atom.connectTo = new Set([...atom.connectTo].filter(o => o.id !== nearest_atoms[1].id));
    }
}

/**
 * Classify central atom with VESPR theory
 * @param {DrawnAtom} atom Atom
 * @return {string} Shape of central atom thing
 */
function classifyVESPR(atom) {
    const freeElectrons = (graphState.idToElectrons[atom?.id] || 0) / 2;
    const bonds = graphState.bondIdMap[atom?.id]?.length || 0;
    const stericNumber = bonds + freeElectrons;

    if (freeElectrons === 0 && stericNumber === 2) return ['Linear (0 pairs CN = 2)', 'linear.png'];

    if (freeElectrons === 0 && stericNumber === 3) return ['Trigonal Planar', 'trigonal-planar.png'];
    if (freeElectrons === 1 && stericNumber === 3) return ['Angled (1 pair CN = 3)', 'angled.png'];
    if (freeElectrons === 2 && stericNumber === 3) return ['Linear (2 pairs CN = 3)', 'linear-2.png'];

    if (freeElectrons === 0 && stericNumber === 4) return ['Tetrahedral', 'tetrahedral.png'];
    if (freeElectrons === 1 && stericNumber === 4) return ['Trigonal pyramidal', 'trigonal-pyramidal.png'];
    if (freeElectrons === 2 && stericNumber === 4) return ['Angled (2 pairs CN = 4)', 'angled.png'];
    if (freeElectrons === 3 && stericNumber === 4) return ['Linear (3 pairs CN = 4)', 'linear-2.png'];

    if (freeElectrons === 0 && stericNumber === 5) return ['Trigonal bipyramidal', 'trigonal-bipyramidal.png'];
    if (freeElectrons === 1 && stericNumber === 5) return ['Seesaw (bisphenoidal)', 'seesaw.png'];
    if (freeElectrons === 2 && stericNumber === 5) return ['T-shaped', 't.png'];
    if (freeElectrons === 3 && stericNumber === 5) return ['Linear (3 pairs CN = 5)', 'linear.png'];

    if (freeElectrons === 0 && stericNumber === 6) return ['Octahedral', 'octahedral.png'];
    if (freeElectrons === 1 && stericNumber === 6) return ['Square pyramidal', 'square-pyramidal.png'];
    if (freeElectrons === 2 && stericNumber === 6) return ['Square planar', 'square-planar.png'];

    if (freeElectrons === 0 && stericNumber === 7) return ['Pentagonal bipyramidal', 'pentagonal-bipyramidal.png'];
    if (freeElectrons === 1 && stericNumber === 7) return ['Pentagonal pyramidal', 'pentagonal-pyramidal.png'];
    if (freeElectrons === 2 && stericNumber === 7) return ['Pentagonal planar', 'pentagonal-planar.png'];

    if (freeElectrons === 0 && stericNumber === 8) return ['Square antiprismatic', 'square-antiprismatic.png'];
    if (freeElectrons === 0 && stericNumber === 9) return ['Tricapped trigonal prismatic', 'tricapped.png'];

    return ['Unknown', 'sphere.png'];
}


document.addEventListener('keyup', e => {
    if (e.key === 'Shift') {
        window.uiState.isShiftDown = false;
        canvas.style.cursor = 'default';
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Shift') {
        window.uiState.isShiftDown = true;
        canvas.style.cursor = 'move';
    }

    if (e.key === 'z' && e.ctrlKey)
        window.popDrawingState();
    else if (e.key === 'y' && e.ctrlKey) {
        if (window.drawingStateStackIdx + 1 <= window.drawingStateStack.length) {
            window.drawingStateStackIdx++;
            window.switchToHistoryState();
        }
    }
    else if (e.key === 'Escape') {
        window.closeElementSelector();
        document.getElementById('algo-modal').style.display = 'none';
        window.drawingState.selectedAtom = null;
    }
});

canvas.addEventListener('mousemove', e => {
    window.uiState.mousePos = [e.clientX, e.clientY];

    // Drag atom
    if (window.drawingState.selectedAtom && window.uiState.isShiftDown && window.uiState.isMouseDown) {
        window.drawingState.selectedAtom.x = e.clientX;
        window.drawingState.selectedAtom.y = e.clientY;
        window.updateGraphState();
    } else {
        drawCanvas();
    }
});

canvas.addEventListener('mousedown', e => {
    window.drawingState.selectedAtom = findNearestAtom(e.clientX, e.clientY, ATOM_CLICK_DISTANCE_THRESHOLD);
    window.drawingState.startDragLoc = [e.clientX, e.clientY];
    window.uiState.isMouseDown = true;

    if (!window.uiState.isShiftDown && window.drawingState.selectedAtom && window.selectedElement.startsWith('charge:')) {
        const val = window.selectedElement.split('charge:')[1];
        window.drawingState.selectedAtom.charge = +val;
        window.drawingState.selectedAtom = null;
        window.pushDrawingState();
    }
});

canvas.addEventListener('mouseup', e => {
    window.uiState.isMouseDown = false;
    const wasDragging = distance(...window.drawingState.startDragLoc, ...[e.clientX, e.clientY]) > DRAG_THRESHOLD;

    if (wasDragging && window.uiState.isShiftDown)
        window.drawingState.selectedAtom = null;

    if (e.button === 0) { // Left click
        if (wasDragging) {
            if (!window.drawingState.selectedAtom) return; // No selected atom, was dragging

            let endAtom = findNearestAtom(e.clientX, e.clientY, ATOM_CLICK_DISTANCE_THRESHOLD);
            if (!endAtom) {
                window.drawingState.selectedAtom = null; 
                return;
            }

            // Connect selectedAtom and endAtom
            // By convention, lower id atom connects to higher id atom
            let startAtom = window.drawingState.selectedAtom;
            if (endAtom.id === startAtom.id)
                return;
            if (startAtom.id > endAtom.id)
                [startAtom, endAtom] = [endAtom, startAtom];

            // Actually find cuz undo/redo breaks it this entire thing is a pile of hacks
            startAtom = window.drawingState.atoms.filter(atom => atom.id === startAtom.id)[0];
            endAtom = window.drawingState.atoms.filter(atom => atom.id === endAtom.id)[0];

            startAtom.connectTo.add(endAtom);
            window.drawingState.selectedAtom = null;
            window.pushDrawingState();

            return;
        }
        // Add new atom
        else if (!window.selectedElement.includes(':')) {
            window.drawingState.atoms.push(new DrawnAtom(e.clientX, e.clientY, window.selectedElement, window.drawingState.idCounter++));
            window.pushDrawingState();
        }
    } else if (e.button === 2) { // Right click
        window.drawingState.selectedAtom = null;

        if (wasDragging) return;
        let endAtom = findNearestAtom(e.clientX, e.clientY, ATOM_CLICK_DISTANCE_THRESHOLD);
        if (endAtom)
            removeAtom(endAtom);
        else
            removeHoveredBond();
        
        window.pushDrawingState();
    }
});


function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center';
    ctx.lineWidth = 3;

    if (window.drawingState.selectedAtom) {
        ctx.strokeStyle = '#3e5c8c';
        line(ctx, window.drawingState.selectedAtom.x, window.drawingState.selectedAtom.y,
            window.uiState.mousePos[0], window.uiState.mousePos[1]);
    }

    let hoveredAtom = null;
    for (let atom of window.drawingState.atoms) {
        let dis = distance(atom.x, atom.y, window.uiState.mousePos[0], window.uiState.mousePos[1]);
        if (dis < ATOM_CLICK_DISTANCE_THRESHOLD) {
            hoveredAtom = atom;
            break;
        }
    }

    const classify = hoveredAtom ? classifyVESPR(hoveredAtom) : [];
    document.getElementById('VESPR').innerText = hoveredAtom ? classify[0] : 'Hover an atom';
    document.getElementById('VSPER-img').src = hoveredAtom ? 'img/vsper/' + classify[1] : 'img/vsper/sphere.png';

    // Render connections first
    for (let atom of window.drawingState.atoms) {
        for (let other of [...atom.connectTo]) {
            const isHover = bondHoverDis(atom, other) < ATOM_CLICK_DISTANCE_THRESHOLD;
            const isAdjacentHover = (atom.id === hoveredAtom?.id || other.id === hoveredAtom?.id) &&
                (graphState.bondIdMap[hoveredAtom?.id] || []).length > 1;
            const bondStrength = graphState.bondStrengthMap[`${atom.id},${other.id}`];

            ctx.strokeStyle = isHover ? '#69c3ff' : isAdjacentHover ? '#eb7434' : '#333';
            if (!bondStrength || bondStrength === 1 || bondStrength === 3)
                line(ctx, atom.x, atom.y, other.x, other.y);
            if (bondStrength > 1) {
                let dis = distance(atom.x, atom.y, other.x, other.y);
                let offset = 6;
                let dx = -(atom.x - other.x) / dis * offset;
                let dy = (atom.y - other.y) / dis * offset;

                line(ctx, atom.x - dy, atom.y - dx, other.x - dy, other.y - dx);
                line(ctx, atom.x + dy, atom.y + dx, other.x + dy, other.y + dx);
            }
        }
    }

    ctx.lineWidth = 1;

    for (let atom of window.drawingState.atoms) {
        let isHover = atom.id === hoveredAtom?.id;
        let isAdjacentHover = (graphState.bondIdMap[hoveredAtom?.id] || []).includes(atom.id) &&
            (graphState.bondIdMap[hoveredAtom?.id] || []).length > 1;
        let isFirst = atom.id === window.drawingState.selectedAtom?.id;

        ctx.fillStyle = isHover ? '#dbebff' : isAdjacentHover ? '#ffcdb3' : 'white';
        ctx.strokeStyle = isHover ? '#1a5196' : isAdjacentHover ? '#eb7434' : 'black';
        ctx.lineWidth = isAdjacentHover ? 3 : 1;
        if (isFirst) ctx.fillStyle = '#d1e3ff';
        circle(ctx, atom.x, atom.y, ATOM_SIZE);

        ctx.fillStyle = isHover ? '#12294d' : 'black';
        if (isFirst) ctx.fillStyle = '#2d5696';

        if (window.graphState.idToElectrons[atom.id]) {
            ctx.fillStyle = isHover ? '#12294d' : '#666';
            if (isFirst) ctx.fillStyle = '#2d5696';

            const SMALL_ANGLE = 15 * Math.PI / 180;
            const RIGHT_ANGLE = Math.PI / 2;
            const ELECTRON_ANGLES = [
                -SMALL_ANGLE, SMALL_ANGLE,
                Math.PI - SMALL_ANGLE, Math.PI + SMALL_ANGLE,
                RIGHT_ANGLE - SMALL_ANGLE, RIGHT_ANGLE + SMALL_ANGLE,
                -RIGHT_ANGLE - SMALL_ANGLE, -RIGHT_ANGLE + SMALL_ANGLE,
            ];
            for (let i = 0; i < Math.min(window.graphState.idToElectrons[atom.id] || 0, ELECTRON_ANGLES.length); i++) {
                const angle = ELECTRON_ANGLES[i];
                circle(ctx, atom.x + ATOM_SIZE * Math.cos(angle), atom.y + ATOM_SIZE * Math.sin(angle), ELECTRON_SIZE);
            }
        }

        ctx.fillStyle = isHover ? '#12294d' : 'black';
        ctx.font = `bold ${FONT_SIZE}px "Times New Roman"`;
        ctx.fillText(atom.type, atom.x, atom.y + FONT_SIZE / 3);

        if (atom.charge) {
            ctx.font = `normal ${FONT_SIZE / 2}px "Times New Roman"`;
            let acharge = Math.abs(atom.charge);
            if (acharge < 1) acharge = acharge.toFixed(1);

            ctx.fillStyle = atom.charge < 0 ? 'blue' : 'red';
            ctx.fillText(atom.charge < 0 ? `${acharge}-` : `${acharge}+`, atom.x, atom.y - FONT_SIZE / 2);
        }
    }
}

let lastDrawTime = 0;
const TARGET_FPS = 1;

function drawCanvasLoop() {
    if (Date.now() - lastDrawTime > 1000 / TARGET_FPS) {
        drawCanvas();
        lastDrawTime = Date.now();
    }
    requestAnimationFrame(drawCanvasLoop);
}

drawCanvasLoop();