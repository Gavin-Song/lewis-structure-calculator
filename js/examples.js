const exampleSelector = document.getElementById('examples');

class ExampleAtom {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}

const E_SIZE = 100;

const examples = [
    {
        name: 'CH2O [Formaldehyde]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'C'),
            new ExampleAtom(3 * E_SIZE, 4 * E_SIZE, 'H'),
            new ExampleAtom(4 * E_SIZE, 3 * E_SIZE, 'H'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'O')
        ],
        bonds: [[0, 1], [0, 2], [0, 3]]
    },
    {
        name: 'NO3- [Nitrate]',
        moleculeCharge: -1,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'N'),
            new ExampleAtom(3 * E_SIZE, 4 * E_SIZE, 'O'),
            new ExampleAtom(4 * E_SIZE, 3 * E_SIZE, 'O'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'O')
        ],
        bonds: [[0, 1], [0, 2], [0, 3]]
    },
    {
        name: 'SO3 [Sulfur trioxide]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'S'),
            new ExampleAtom(3 * E_SIZE, 4 * E_SIZE, 'O'),
            new ExampleAtom(4 * E_SIZE, 3 * E_SIZE, 'O'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'O')
        ],
        bonds: [[0, 1], [0, 2], [0, 3]]
    },
    {
        name: 'ClO3- [Chlorine trioxide]',
        moleculeCharge: -1,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'Cl'),
            new ExampleAtom(3 * E_SIZE, 4 * E_SIZE, 'O'),
            new ExampleAtom(4 * E_SIZE, 3 * E_SIZE, 'O'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'O')
        ],
        bonds: [[0, 1], [0, 2], [0, 3]]
    },
    {
        name: 'NH4+ [Ammonium]',
        moleculeCharge: 1,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'N'),
            new ExampleAtom(3 * E_SIZE, 4 * E_SIZE, 'H'),
            new ExampleAtom(4 * E_SIZE, 3 * E_SIZE, 'H'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'H'),
            new ExampleAtom(4 * E_SIZE, 5 * E_SIZE, 'H')
        ],
        bonds: [[0, 1], [0, 2], [0, 3], [0, 4]]
    },
    {
        name: 'CH4 [Methane]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'C'),
            new ExampleAtom(3 * E_SIZE, 4 * E_SIZE, 'H'),
            new ExampleAtom(4 * E_SIZE, 3 * E_SIZE, 'H'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'H'),
            new ExampleAtom(4 * E_SIZE, 5 * E_SIZE, 'H')
        ],
        bonds: [[0, 1], [0, 2], [0, 3], [0, 4]]
    },
    {
        name: 'PO4^3- [Phosphate ion]',
        moleculeCharge: -3,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'P'),
            new ExampleAtom(3 * E_SIZE, 4 * E_SIZE, 'O'),
            new ExampleAtom(4 * E_SIZE, 3 * E_SIZE, 'O'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'O'),
            new ExampleAtom(4 * E_SIZE, 5 * E_SIZE, 'O')
        ],
        bonds: [[0, 1], [0, 2], [0, 3], [0, 4]]
    },
    {

        name: 'CH2Cl2 [Dichloromethane]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'C'),
            new ExampleAtom(3 * E_SIZE, 4 * E_SIZE, 'H'),
            new ExampleAtom(4 * E_SIZE, 3 * E_SIZE, 'Cl'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'H'),
            new ExampleAtom(4 * E_SIZE, 5 * E_SIZE, 'Cl')
        ],
        bonds: [[0, 1], [0, 2], [0, 3], [0, 4]]
    },
    {
        name: 'SO4^2- [Sulfate Ion]',
        moleculeCharge: -2,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'S'),
            new ExampleAtom(3 * E_SIZE, 4 * E_SIZE, 'O'),
            new ExampleAtom(4 * E_SIZE, 3 * E_SIZE, 'O'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'O'),
            new ExampleAtom(4 * E_SIZE, 5 * E_SIZE, 'O')
        ],
        bonds: [[0, 1], [0, 2], [0, 3], [0, 4]]
    },
    {
        name: 'XeF4 [Xenon tetrafluoride]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'Xe'),
            new ExampleAtom(3 * E_SIZE, 4 * E_SIZE, 'F'),
            new ExampleAtom(4 * E_SIZE, 3 * E_SIZE, 'F'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'F'),
            new ExampleAtom(4 * E_SIZE, 5 * E_SIZE, 'F')
        ],
        bonds: [[0, 1], [0, 2], [0, 3], [0, 4]]
    },
    {
        name: 'SF4 [Sulfur tetrafluoride]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'S'),
            new ExampleAtom(3 * E_SIZE, 4 * E_SIZE, 'F'),
            new ExampleAtom(4 * E_SIZE, 3 * E_SIZE, 'F'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'F'),
            new ExampleAtom(4 * E_SIZE, 5 * E_SIZE, 'F')
        ],
        bonds: [[0, 1], [0, 2], [0, 3], [0, 4]]
    },
    {
        name: 'NH3 [Ammonia]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'N'),
            new ExampleAtom(3 * E_SIZE, 4.5 * E_SIZE, 'H'),
            new ExampleAtom(4 * E_SIZE, 3 * E_SIZE, 'H'),
            new ExampleAtom(5 * E_SIZE, 4.5 * E_SIZE, 'H')
        ],
        bonds: [[0, 1], [0, 2], [0, 3]]
    },
    {
        name: 'H3O+ [Hydronium]',
        moleculeCharge: 1,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'O'),
            new ExampleAtom(3 * E_SIZE, 4.5 * E_SIZE, 'H'),
            new ExampleAtom(4 * E_SIZE, 3 * E_SIZE, 'H'),
            new ExampleAtom(5 * E_SIZE, 4.5 * E_SIZE, 'H')
        ],
        bonds: [[0, 1], [0, 2], [0, 3]]
    },
    {
        name: 'BrF3 [Bromine trifluoride]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'Br'),
            new ExampleAtom(3 * E_SIZE, 4.5 * E_SIZE, 'F'),
            new ExampleAtom(4 * E_SIZE, 3 * E_SIZE, 'F'),
            new ExampleAtom(5 * E_SIZE, 4.5 * E_SIZE, 'F')
        ],
        bonds: [[0, 1], [0, 2], [0, 3]]
    },
    {
        name: 'H2O [Water]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'O'),
            new ExampleAtom(3 * E_SIZE, 4.5 * E_SIZE, 'H'),
            new ExampleAtom(5 * E_SIZE, 4.5 * E_SIZE, 'H')
        ],
        bonds: [[0, 1], [0, 2]]
    },
    {
        name: 'KrF2 [Krypton difluoride]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'Kr'),
            new ExampleAtom(3 * E_SIZE, 4.5 * E_SIZE, 'F'),
            new ExampleAtom(5 * E_SIZE, 4.5 * E_SIZE, 'F')
        ],
        bonds: [[0, 1], [0, 2]]
    },
    {
        name: 'H2O2 [Hydrogen peroxide]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'O'),
            new ExampleAtom(3 * E_SIZE, 4.5 * E_SIZE, 'H'),
            new ExampleAtom(5 * E_SIZE, 4.5 * E_SIZE, 'O'),
            new ExampleAtom(6 * E_SIZE, 4 * E_SIZE, 'H')
        ],
        bonds: [[0, 1], [0, 2], [2,3]]
    },
    {
        name: 'SO2 [Sulfur dioxide]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'S'),
            new ExampleAtom(3 * E_SIZE, 4.5 * E_SIZE, 'O'),
            new ExampleAtom(5 * E_SIZE, 4.5 * E_SIZE, 'O')
        ],
        bonds: [[0, 1], [0, 2]]
    },
    {
        name: 'O3 [Ozone]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'O'),
            new ExampleAtom(3 * E_SIZE, 4.5 * E_SIZE, 'O'),
            new ExampleAtom(5 * E_SIZE, 4.5 * E_SIZE, 'O')
        ],
        bonds: [[0, 1], [0, 2]]
    },
    {
        name: 'NO2- [Nitrogen dioxide]',
        moleculeCharge: -1,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'N'),
            new ExampleAtom(3 * E_SIZE, 4.5 * E_SIZE, 'O'),
            new ExampleAtom(5 * E_SIZE, 4.5 * E_SIZE, 'O')
        ],
        bonds: [[0, 1], [0, 2]]
    },
    {
        name: 'CO [Carbon monoxide]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'C'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'O'),
        ],
        bonds: [[0, 1]]
    },
    {
        name: 'HF [Hydrofluoric acid]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'H'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'F'),
        ],
        bonds: [[0, 1]]
    },
    {
        name: 'HCN [Hydrogen cyanide]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'H'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'C'),
            new ExampleAtom(6 * E_SIZE, 4 * E_SIZE, 'N'),
        ],
        bonds: [[0, 1], [1, 2]]
    },
    {
        name: 'CN- [Cyano radical]',
        moleculeCharge: -1,
        atoms: [
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'C'),
            new ExampleAtom(6 * E_SIZE, 4 * E_SIZE, 'N'),
        ],
        bonds: [[0, 1]]
    },
    {
        name: 'NO [Nitric oxide]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'O'),
            new ExampleAtom(6 * E_SIZE, 4 * E_SIZE, 'N'),
        ],
        bonds: [[0, 1]]
    },
    {
        name: 'N2 [Nitrogen gas]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'N'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'N'),
        ],
        bonds: [[0, 1]]
    },
    {
        name: 'O2 [Oxygen gas]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'O'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'O'),
        ],
        bonds: [[0, 1]]
    },
    {
        name: 'CO2 [Carbon dioxide]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'O'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'C'),
            new ExampleAtom(6 * E_SIZE, 4 * E_SIZE, 'O'),
        ],
        bonds: [[0, 1], [1, 2]]
    },
    {
        name: 'SCN- [Thiocyanate]',
        moleculeCharge: -1,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'S'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'C'),
            new ExampleAtom(6 * E_SIZE, 4 * E_SIZE, 'N'),
        ],
        bonds: [[0, 1], [1, 2]]
    },
    {
        name: 'BeH2 [Beryllium hydride]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'H'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'Be'),
            new ExampleAtom(6 * E_SIZE, 4 * E_SIZE, 'H'),
        ],
        bonds: [[0, 1], [1, 2]]
    },
    {
        name: 'CNO- [Cyanate Ion]',
        moleculeCharge: -1,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'C'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'N'),
            new ExampleAtom(6 * E_SIZE, 4 * E_SIZE, 'O'),
        ],
        bonds: [[0, 1], [1, 2]]
    },
    {
        name: 'CS2 [Carbon disulfide]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'S'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'C'),
            new ExampleAtom(6 * E_SIZE, 4 * E_SIZE, 'S'),
        ],
        bonds: [[0, 1], [1, 2]]
    },
    {
        name: 'SeF2^2- [Selenium difluoride]',
        moleculeCharge: -2,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'F'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'Se'),
            new ExampleAtom(6 * E_SIZE, 4 * E_SIZE, 'F'),
        ],
        bonds: [[0, 1], [1, 2]]
    },
    {
        name: 'C2H2 [Ethyne (acetylene)]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'H'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'C'),
            new ExampleAtom(6 * E_SIZE, 4 * E_SIZE, 'C'),
            new ExampleAtom(7 * E_SIZE, 4 * E_SIZE, 'H'),
        ],
        bonds: [[0, 1], [1, 2], [2, 3]]
    },
    {
        name: 'CH3OCH3 [dimethyl ether]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'C'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'O'),
            new ExampleAtom(6 * E_SIZE, 4 * E_SIZE, 'C'),

            new ExampleAtom(4 * E_SIZE, 3 * E_SIZE, 'H'),
            new ExampleAtom(4 * E_SIZE, 5 * E_SIZE, 'H'),
            new ExampleAtom(3 * E_SIZE, 4 * E_SIZE, 'H'),

            new ExampleAtom(6 * E_SIZE, 3 * E_SIZE, 'H'),
            new ExampleAtom(6 * E_SIZE, 5 * E_SIZE, 'H'),
            new ExampleAtom(7 * E_SIZE, 4 * E_SIZE, 'H'),
        ],
        bonds: [[0, 1], [1, 2], [3, 0], [4, 0], [5, 0], [6, 2], [7, 2], [8, 2]]
    },
    {
        name: 'CH3OH [Methanol]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'C'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'O'),
            new ExampleAtom(6 * E_SIZE, 4 * E_SIZE, 'H'),

            new ExampleAtom(4 * E_SIZE, 3 * E_SIZE, 'H'),
            new ExampleAtom(4 * E_SIZE, 5 * E_SIZE, 'H'),
            new ExampleAtom(3 * E_SIZE, 4 * E_SIZE, 'H'),
        ],
        bonds: [[0, 1], [1, 2], [3, 0], [4, 0], [5, 0]]
    },
    {
        name: 'HCONH2 [Formamide]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'C'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'N'),
            new ExampleAtom(3 * E_SIZE, 4 * E_SIZE, 'H'),
            new ExampleAtom(4 * E_SIZE, 3 * E_SIZE, 'O'),
    
            new ExampleAtom(5.5 * E_SIZE, 3 * E_SIZE, 'H'),
            new ExampleAtom(5.5 * E_SIZE, 5 * E_SIZE, 'H'),
        ],
        bonds: [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5]]
    },
    {
        name: 'C3OH6 [Acetone]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'C'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'C'),
            new ExampleAtom(6 * E_SIZE, 4 * E_SIZE, 'C'),

            new ExampleAtom(4 * E_SIZE, 3 * E_SIZE, 'H'),
            new ExampleAtom(4 * E_SIZE, 5 * E_SIZE, 'H'),
            new ExampleAtom(3 * E_SIZE, 4 * E_SIZE, 'H'),

            new ExampleAtom(6 * E_SIZE, 3 * E_SIZE, 'H'),
            new ExampleAtom(6 * E_SIZE, 5 * E_SIZE, 'H'),
            new ExampleAtom(7 * E_SIZE, 4 * E_SIZE, 'H'),

            new ExampleAtom(5 * E_SIZE, 3 * E_SIZE, 'O'),
        ],
        bonds: [[0, 1], [1, 2], [3, 0], [4, 0], [5, 0], [6, 2], [7, 2], [8, 2], [1, 9]]
    },
    {
        name: 'C2H4 [Ethene (ethylene)]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(4 * E_SIZE, 4 * E_SIZE, 'C'),
            new ExampleAtom(5 * E_SIZE, 4 * E_SIZE, 'C'),

            new ExampleAtom(3.5 * E_SIZE, 3 * E_SIZE, 'H'),
            new ExampleAtom(3.5 * E_SIZE, 5 * E_SIZE, 'H'),
            new ExampleAtom(5.5 * E_SIZE, 3 * E_SIZE, 'H'),
            new ExampleAtom(5.5 * E_SIZE, 5 * E_SIZE, 'H'),
        ],
        bonds: [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5]]
    },

    {
        name: 'C5H6 [Cyclopentane]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 2.5 * 0), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 2.5 * 0), 'C'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 2.5 * 1), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 2.5 * 1), 'C'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 2.5 * 2), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 2.5 * 2), 'C'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 2.5 * 3), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 2.5 * 3), 'C'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 2.5 * 4), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 2.5 * 4), 'C'),

            new ExampleAtom(5 * E_SIZE + 2 * E_SIZE * Math.cos(Math.PI / 2.5 * 0), 5 * E_SIZE + 2 * E_SIZE * Math.sin(Math.PI / 2.5 * 0), 'H'),
            new ExampleAtom(5 * E_SIZE + 2 * E_SIZE * Math.cos(Math.PI / 2.5 * 1), 5 * E_SIZE + 2 * E_SIZE * Math.sin(Math.PI / 2.5 * 1), 'H'),
            new ExampleAtom(5 * E_SIZE + 2 * E_SIZE * Math.cos(Math.PI / 2.5 * 2), 5 * E_SIZE + 2 * E_SIZE * Math.sin(Math.PI / 2.5 * 2), 'H'),
            new ExampleAtom(5 * E_SIZE + 2 * E_SIZE * Math.cos(Math.PI / 2.5 * 3), 5 * E_SIZE + 2 * E_SIZE * Math.sin(Math.PI / 2.5 * 3), 'H'),
            new ExampleAtom(5 * E_SIZE + 2 * E_SIZE * Math.cos(Math.PI / 2.5 * 4), 5 * E_SIZE + 2 * E_SIZE * Math.sin(Math.PI / 2.5 * 4), 'H'),
            new ExampleAtom(4.5 * E_SIZE, 6.5 * E_SIZE, 'H'),
        ],
        bonds: [[0, 1], [1,2],[2,3],[3,4],[4,0],[0,5],[1,6],[2,7],[3,8],[4,9],[1,10]]
    },
    {
        name: 'PCl5 [Phosphorus pentachloride]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(5 * E_SIZE, 5 * E_SIZE, 'P'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 2.5 * 0), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 2.5 * 0), 'Cl'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 2.5 * 1), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 2.5 * 1), 'Cl'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 2.5 * 2), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 2.5 * 2), 'Cl'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 2.5 * 3), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 2.5 * 3), 'Cl'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 2.5 * 4), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 2.5 * 4), 'Cl'),
        ],
        bonds: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5]]
    },
    {
        name: 'IF5 [Iodine pentafluoride]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(5 * E_SIZE, 5 * E_SIZE, 'I'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 2.5 * 0), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 2.5 * 0), 'F'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 2.5 * 1), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 2.5 * 1), 'F'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 2.5 * 2), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 2.5 * 2), 'F'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 2.5 * 3), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 2.5 * 3), 'F'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 2.5 * 4), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 2.5 * 4), 'F'),
        ],
        bonds: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5]]
    },
    {
        name: 'SeF6 [Selenium hexafluoride]',
        moleculeCharge: 0,
        atoms: [
            new ExampleAtom(5 * E_SIZE, 5 * E_SIZE, 'Se'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 3 * 0), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 3 * 0), 'F'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 3 * 1), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 3 * 1), 'F'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 3 * 2), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 3 * 2), 'F'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 3 * 3), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 3 * 3), 'F'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 3 * 4), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 3 * 4), 'F'),
            new ExampleAtom(5 * E_SIZE + E_SIZE * Math.cos(Math.PI / 3 * 5), 5 * E_SIZE + E_SIZE * Math.sin(Math.PI / 3 * 5), 'F'),
        ],
        bonds: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6]]
    },
];
examples.sort((a, b) => a.name.localeCompare(b.name));

window.switchExample = idx => {
    let example = examples[idx];

    window.resetDrawingState(false);
    let id = 0;
    let idMap = {};

    for (let atom of example.atoms) {
        drawingState.atoms.push(new DrawnAtom(atom.x, atom.y, atom.type, id));
        idMap[id] = drawingState.atoms.at(-1);
        id++;
    }
    for (let bond of example.bonds) {
        let [id1, id2] = bond;
        if (id1 > id2) [id1, id2] = [id2, id1];
        idMap[id1].connectTo.add(idMap[id2]);
    }
    window.setMoleculeCharge(example.moleculeCharge, false);
    window.drawingState.idCounter = id + 1;
    window.pushDrawingState();
};

exampleSelector.addEventListener('change', e => switchExample(+exampleSelector.value));

exampleSelector.innerHTML = examples.map((e, i) => `<option value="${i}">${e.name}</option>`).join('\n');