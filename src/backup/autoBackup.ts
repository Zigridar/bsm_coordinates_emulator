import cron from 'node-cron'
import doBackup from './backup'

/** run auto backup */
const runAutoBackup = () => {
  console.log('auto backup every hour started');
  cron.schedule('0 * * * *', doBackup)
}

export default runAutoBackup
