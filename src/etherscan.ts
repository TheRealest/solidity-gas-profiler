import 'isomorphic-fetch';
import * as queryString from 'query-string';

import { ETHERSCAN_API_KEY } from './secrets';
import { Transaction } from './types';

export const etherscan = {
    async getTransactionsForAccountAsync(address: string): Promise<Transaction[]> {
        const startblock = 5102000;
        const params = {
            module: 'account',
            action: 'txlist',
            address,
            startblock,
            endblock: 100000000,
            apikey: ETHERSCAN_API_KEY,
        };
        const url = `http://api.etherscan.io/api?${queryString.stringify(params)}`;
        const result = await fetch(url);
        const jsonResponse = await result.json();
        const txs = jsonResponse.result;
        return txs;
    },
};
