import packageJson from '../../../package.json'
import ExtendJS from '../../js/helper/ExtendJS.js'
import ProjectCommon from './ProjectCommon.js'
import migrate128 from './migrate/migrate128.js'

export default {
  async migrateVersion (folder, settings) {
    let migration = false
    const currentVersion = settings?.version || packageJson.version
    for (const [version, func] of Object.entries(this.getMap())) {
      if (ExtendJS.versionCompare(currentVersion, version) < 0) {
        migration = true
        await func.migrate(folder)
      }
    }
    if (migration) this.saveVersion(folder, settings)
  },

  saveVersion (folder, settings) {
    settings.version = packageJson.version
    ProjectCommon.saveProjectSettings(folder, settings)
  },

  getMap () {
    return {
      '1.2.8': migrate128
    }
  }
}