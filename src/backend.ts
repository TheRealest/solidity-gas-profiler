import * as _ from 'lodash';

import { CONTRACT_ADDRESS } from './config';
import { etherscan } from './etherscan';
import { sourceMapper } from './sourcemapper';
import { trace } from './trace';
import { GasCostByPc } from './types';

(async () => {
    //const address = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    const cacheOnly = false;
    const transactions = await etherscan.getTransactionsForAccountAsync(CONTRACT_ADDRESS);
    console.log(`Fetched ${transactions.length} transactions`);
    let gasCostByPc: GasCostByPc = {};
    for (const transaction of transactions) {
        console.log(`Processing https://etherscan.io/tx/${transaction.hash}`);
        const conciseTxTrace = await trace.getTransactionConciseTraceAsync(transaction.hash, cacheOnly);
        const txGasCostByPc = trace.getGasCostByPcFromConciseTxTrace(conciseTxTrace);
        gasCostByPc = trace.combineGasCostByPc(gasCostByPc, txGasCostByPc);
    }
    const gasCostByLine = sourceMapper.getGasCostByPcToGasCostByLine(gasCostByPc);
    console.log(gasCostByLine);
})();
