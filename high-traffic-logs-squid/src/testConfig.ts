import {assertNotNull} from '@subsquid/util-internal'

import {allLogFields, allBlockHeaderFields} from './allFields'
import {getRandomInt} from './utils'

const gateway = assertNotNull(process.env.SUBSQUID_NETWORK_GATEWAY)

export const ERC20_TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

const commonConfig = {
    batchHandler: async (ctx: any) => {
        let usdtTransfers = 0
        for (let block of ctx.blocks) {
            usdtTransfers += block.logs.length
        }
        ctx.log.info(`Got ${usdtTransfers} ERC20 transfers`)
    },
    includeAllBlocks: false,
    transactions: [],
    traces: [],
    stateDiffs: [],
    fields: {
        log: allLogFields,
        block: allBlockHeaderFields
    }
}

export const networksConfig = {
    eth: {
        datasetUrl: `${gateway}/network/ethereum-mainnet`,
        range: { from: 4_634_748 },
        logs: [{
            address: ['0x7EA2be2df7BA6E54B1A9C70676f668455E329d29'.toLowerCase()], // USDT
            topic0: [ERC20_TRANSFER_TOPIC]
        }],
        ...commonConfig
    },
    bsc: {
        datasetUrl: `${gateway}/network/binance-mainnet`,
        range: { from: getRandomInt(176_416, 25_000_000) },
        logs: [{
            address: ['0x55d398326f99059fF775485246999027B3197955'.toLowerCase()], // BUSD
            topic0: [ERC20_TRANSFER_TOPIC]
        }],
        ...commonConfig
    },
    base: {
        datasetUrl: `${gateway}/network/base-mainnet`,
        range: { from: 2_797_221 },
        logs: [{
            address: ['0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'.toLowerCase()], // USDC
            topic0: [ERC20_TRANSFER_TOPIC]
        }],
        ...commonConfig
    },
    moonbeam: {
        datasetUrl: `${gateway}/network/moonbeam-mainnet`,
        range: { from: 171_972 },
        logs: [{
            address: ['0x8f552a71EFE5eeFc207Bf75485b356A0b3f01eC9'.toLowerCase()], // USDC
            topic0: [ERC20_TRANSFER_TOPIC]
        }],
        ...commonConfig
    }
}
