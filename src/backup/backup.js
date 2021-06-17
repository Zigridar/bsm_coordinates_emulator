import backup  from 'mongodb-backup'
import config from '../config'

/** @returns actual backup options */
const options = () =>  {
  /** current time */
  const now = new Date()
  /** backup name */
  const fileName = `backup ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`.replace(/\s|:|\./gi, '_')
  /** successful callback */
  const callback = () => {
    console.log(`Backup successfully created to file ${fileName}`)
  }

  return {
    uri: config.MONGO_URI,
    root: config.backupDir,
    tar: `${fileName}.tar`,
    callback
  }
}

/** do backup with options */
const doBackup = () => backup(options())
export default doBackup

/** manual backup */
if (process.env.manual)
  doBackup()