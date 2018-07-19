import * as fs from 'fs-extra';
import 'isomorphic-fetch';
import * as _ from 'lodash';
import * as queryString from 'query-string';

import { GasCostByPc } from './types';

export interface ConciseTxTraceEntry {
    pc: number;
    gasCost: number;
}

export type ConciseTxTrace = ConciseTxTraceEntry[];

export const trace = {
    async getTransactionConciseTraceAsync(txHash: string, onlyCached: boolean): Promise<ConciseTxTrace> {
        const cachePath = `./consice_trace_cache/${txHash}.json`;
        const cached = await fs.pathExists(cachePath);
        const skipCache = true;
        if (cached && !skipCache) {
            console.log(`Cache hit: ${txHash} :)`);
            const conciseTxTrace = await fs.readJSON(cachePath);
            return conciseTxTrace;
        } else {
            if (onlyCached) {
                return [];
            }
            console.log(`Cache miss: ${txHash} :(`);
            const params = {
                method: 'debug_traceTransaction',
                jsonrpc: '2.0',
                id: 0,
                params: [txHash, { disableMemory: true, disableStack: true, disableStorage: true }],
            };
            const url = `http://node.web3api.com:8545`;
            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            const jsonResponse = await result.json();
            const txTrace = jsonResponse.result.structLogs;
            console.log(JSON.stringify(txTrace));
            const firstLevelTxTrace = _.filter(txTrace, traceEntry => traceEntry.depth === 1);
            const conciseTxTrace = _.map(firstLevelTxTrace, traceEntry => ({
                pc: traceEntry.pc,
                gasCost: traceEntry.gasCost,
            }));
            console.log(`Wwarmed up cache: ${txHash}!`);
            await fs.writeJSON(cachePath, conciseTxTrace);
            return conciseTxTrace;
        }
    },
    getGasCostByPcFromConciseTxTrace(conciseTxTrace: ConciseTxTrace): GasCostByPc {
        const txGasCostByPc: GasCostByPc = {};
        for (const conciseTxTraceEntry of conciseTxTrace) {
            if (_.isUndefined(txGasCostByPc[conciseTxTraceEntry.pc])) {
                txGasCostByPc[conciseTxTraceEntry.pc] = 0;
            }
            txGasCostByPc[conciseTxTraceEntry.pc] += conciseTxTraceEntry.gasCost;
        }
        return txGasCostByPc;
    },
    combineGasCostByPc(gasCostByPcLhs: GasCostByPc, gasCostByPcRhs: GasCostByPc): GasCostByPc {
        const gasCostByPc = _.assignWith(gasCostByPcLhs, gasCostByPcRhs, _.add) as GasCostByPc;
        return gasCostByPc;
    },
};
