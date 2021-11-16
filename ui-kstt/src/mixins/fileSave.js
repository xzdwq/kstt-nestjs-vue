export default {
  methods: {
    onFileSave(data, name) {
      const blob = new Blob([data])

      if(typeof window.navigator.msSaveBlob !== 'undefined') window.navigator.msSaveBlob(blob, name)

      let URL = window.URL || window.webkitURL,
          downloadUrl = URL.createObjectURL(blob),
          a = document.createElement('a')

      a.href = downloadUrl
      a.target = '_blank'
      a.download = name
      document.body.appendChild(a)
      a.click()
      a.parentNode.removeChild(a)
    }
  }
}