import { Coins, LCDClient } from '@xpla/xpla.js'

class Client {
  private lcd: LCDClient | null = null

  constructor() {
    this.initLcd()
  }

  private async initLcd() {
    try {
      await this.setLcd()
    } catch (error) {
      console.error('Failed to initialize LCDClient:', error)
    }
  }

  async setRpc() {
    // TODO: EVM RPC
  }

  async setLcd(): Promise<void> {
    const gasPrices = await this.getGasPrices()
    const gasPricesCoins = new Coins(gasPrices)

    const lcd = new LCDClient({
      URL: 'https://cube-lcd.xpla.dev/',
      chainID: 'cube_47-5',
      gasPrices: gasPricesCoins,
      gasAdjustment: '1.5',
    })

    this.lcd = lcd
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
}

export default Client
