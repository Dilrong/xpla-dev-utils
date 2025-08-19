import { Coins, LCDClient } from '@xpla/xpla.js'

class Client {
  private lcd: LCDClient | null = null

  constructor() {
    this.lcd = new LCDClient({
      URL: 'https://cube-lcd.xpla.dev/',
      chainID: 'cube_47-5',
      gasPrices: { axpla: '850000000000' },
      gasAdjustment: '1.5',
    })
  }

  async getGasPrices(): Promise<Coins.Input> {
    const gasPrices = await (
      await fetch('https://cube-fcd.xpla.dev/v1/txs/gas_prices', {
        redirect: 'follow',
      })
    ).json()

    return gasPrices
  }

  public getLcd(): LCDClient | null {
    if (!this.lcd) {
      console.warn('LCDClient is not initialized yet')
    }
    return this.lcd
  }

  public getRpc() {
    // TODO: EVM RPC
  }

  public async getContractFromTxHash(txHash: string): Promise<string> {
    if (!this.lcd) {
      console.warn('LCDClient is not initialized yet')
      return ''
    }

    const txInfo = await this.lcd.tx.txInfo(txHash)
    if (!txInfo) {
      console.warn('TxInfo not Found')
      return ''
    }

    if ('code' in txInfo) {
      console.warn('Transaction failed:', txInfo)
      return ''
    }

    if (!txInfo.logs) {
      console.warn('TxInfo logs not Found')
      return ''
    }

    for (const log of txInfo.logs) {
      for (const event of log.events) {
        if (event.type === 'instantiate') {
          for (const attribute of event.attributes) {
            if (attribute.key === '_contract_address') {
              return attribute.value
            }
          }
        }
      }
    }

    return ''
  }
}

export default Client
