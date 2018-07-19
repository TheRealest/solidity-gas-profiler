import { GasCostByLine, GasCostByPc } from './types';

export const sourceMapper = {
    getGasCostByPcToGasCostByLine(gasCostByPc: GasCostByPc): GasCostByLine {
        const gasCostByLine = {
            '0': 474,
            '18': 5310,
            '19': 10087,
            '20': 111580,
            '21': 52320,
            '28': 560,
            '34': 133,
            '35': 97247,
            '36': 77,
            '38': 1276,
            '41': 3732,
            '42': 672,
            '45': 180,
            '46': 192,
            '49': 1956,
            '50': 1260,
            '51': 226344,
            '59': 36,
            '61': 36,
            '63': 21420,
        };
        return gasCostByLine;
    },
};
