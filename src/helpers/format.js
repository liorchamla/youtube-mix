import urlSlug from 'url-slug'
import md5 from 'md5'

exports.slugify = (str) => urlSlug(str)

exports.formatDuration = (durationString) => {
  const clear = durationString.replace('PT', '').replace('S', '')
  const timeStr = clear.split('M')
  const [minutes, seconds] = [Number(timeStr[0]) * 60, Number(timeStr[1])]
  return minutes + seconds
}

exports.getTimeRate = (player) => {
  const timePromise = player.getCurrentTime() || 0
  const durationPromise = player.getDuration() || 0
  return Promise.all([timePromise, durationPromise]).then(([time, duration]) => (time / duration) * 100)
}

exports.getGravatar = (email, size = 200) => {
	return `https://www.gravatar.com/avatar/${md5(email)}?s=${size}`
}