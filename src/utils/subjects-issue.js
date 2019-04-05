const subjectsIssue = {
  url (path) {
    return `https://github.com/${path}`
  },
  commentsUrlApi (path) {
    return `${this.issueUrlApi(path)}/comments`
  },
  issueUrlApi (path) {
    return `https://api.github.com/repos/${path}`
  }
}

export default subjectsIssue
