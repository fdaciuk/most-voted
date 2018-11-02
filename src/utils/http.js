import ajax from '@fdaciuk/ajax'

const http = {
  get (url) {
    return new Promise((resolve, reject) => {
      ajax({
        headers: {
          Accept: 'application/vnd.github.squirrel-girl-preview'
        }
      }).get(url)
        .then((data, xhr) => resolve({ data, xhr }))
        .catch((error, xhr) => reject({ error, xhr }))
    })
  }
}

export default http
