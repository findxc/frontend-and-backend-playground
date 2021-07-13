class DomUtil {
  constructor(id) {
    this.element = document.getElementById(id)
  }
  onClick(callback) {
    this.element.addEventListener('click', callback)
    return this
  }
  get value() {
    return this.element.value
  }
}

function $(id) {
  return new DomUtil(id)
}
