import { ipcMain } from 'electron'
import EventMain from './EventMain.js'
import Import from '../import/Import.js'
import Auth from '../main/Auth.js'
import Figma from '../import/Figma.js'

export default {
  addEvents () {
    this.rendererAuthenticateDesechEvent()
    this.rendererFetchAuthDesechEvent()
    this.rendererLogoutDesechEvent()
    this.rendererPurchasePremiumEvent()
    this.rendererImportFigmaFileEvent()
    this.rendererFetchFigmaEvent()
  },

  rendererAuthenticateDesechEvent () {
    ipcMain.handle('rendererAuthenticateDesech', async (event, token) => {
      return await EventMain.handleEvent(Auth, 'authenticateDesech', token)
    })
  },

  rendererFetchAuthDesechEvent () {
    ipcMain.handle('rendererFetchAuthDesech', async (event, token) => {
      return await EventMain.handleEvent(Auth, 'fetchAuthDesech', token)
    })
  },

  rendererLogoutDesechEvent () {
    ipcMain.handle('rendererLogoutDesech', async (event) => {
      return await EventMain.handleEvent(Auth, 'logoutDesech')
    })
  },

  rendererPurchasePremiumEvent () {
    ipcMain.handle('rendererPurchasePremium', async (event) => {
      return await EventMain.handleEvent(Auth, 'purchasePremium')
    })
  },

  rendererImportFigmaFileEvent () {
    ipcMain.handle('rendererImportFigmaFile', async (event, file, token) => {
      return await EventMain.handleEvent(Import, 'importFile', {
        type: 'figma', file, token
      })
    })
  },

  rendererFetchFigmaEvent () {
    ipcMain.handle('rendererFetchFigma', async (event) => {
      return await EventMain.handleEvent(Figma, 'fetchToken')
    })
  }
}
