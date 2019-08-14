const date = new Date()
const currentTime = {
  year: date.getFullYear(),
  month: adjustTime(date.getMonth() + 1),
  date: adjustTime(date.getDate())
}

function adjustTime(time) {
  if (time.toString().length === 1) {
    return `0${time}`
  }
}

module.exports = {
  currentTime
}