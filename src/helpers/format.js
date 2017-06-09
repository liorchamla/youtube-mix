import urlSlug from 'url-slug'
import md5 from 'md5'

exports.slugify = (str) => urlSlug(str)

exports.formatDuration = (durationString) => {
  const clear = durationString.replace('PT', '').replace('S', '')
  const timeStr = clear.split('M')
  const [minutes, seconds] = [Number(timeStr[0]) * 60, Number(timeStr[1])]
  return minutes + seconds
}

exports.formatTime = (seconds) => {
  var sec_num = parseInt(seconds, 10) // don't forget the second param
  var minutes = Math.floor(sec_num / 60)
  var secondes = sec_num - (minutes * 60)

  if (minutes < 10) { minutes = '0' + minutes }
  if (secondes < 10) { secondes = '0' + secondes }
  return minutes + ':' + secondes
}

exports.getTimeRate = (player) => {
  const timePromise = player.getCurrentTime() || 0
  const durationPromise = player.getDuration() || 0
  return Promise.all([timePromise, durationPromise]).then(([time, duration]) => {
  	return {rate: (time / duration) * 100, currentTime: time, duration}
  })
}

exports.getGravatar = (email, size = 200) => {
  return `https://www.gravatar.com/avatar/${md5(email)}?s=${size}`
}
