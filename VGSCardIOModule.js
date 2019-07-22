import { NativeModules } from 'react-native'

const RNCardIOModule = NativeModules.CardIOModule

const sendData =  async (config, ccData) => {
  const headers = Object.assign(config.headers, {'VGS-Client': 'sourse=cardIO&medium=cardIO'})
  return new Promise( (resolve, reject) => {
    fetch(`${config.vaultUrl}${config.path}`, {
      method: config.method,
      headers: headers,
      body: JSON.stringify(ccData),
    })
    .then((response) => {
      return response.json()
    })
    .then((responseJson) => {
      resolve(JSON.parse(responseJson.data))
    })
  })
}

const VGSCardIOModule = {
  config: {
    cardIO: {},
    VGSConfig: {
      method: 'POST',
      headers: {},
    },
  }, 
  
  scanCard(config = {}) {
    this.config.cardIO = Object.assign(this.config.cardIO, config)
    return this
  },

  async redactCard(VGSConfig = {}) {
    this.config.VGSConfig = Object.assign(this.config.VGSConfig, VGSConfig)
    let cc;
    try {
      cc = await RNCardIOModule.scanCard(this.config.cardIO)
    } catch(e) {
      this._resetConfig();
    }
    
    const redactCC = await sendData(this.config.VGSConfig, cc)
    this._resetConfig();
    return redactCC
  },

  _resetConfig() {
    this.config.cardIO = {}
    this.config.VGSConfig = {}
  }
};


export default VGSCardIOModule
