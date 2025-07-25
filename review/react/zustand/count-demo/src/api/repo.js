import axios from './config'

export const getRepos = async (owner, repo) =>
  await axios.get(`/repos/${owner}/${repo}`)


export const getRepoList = async (owner) => 
  await axios.get(`/users/${owner}/repos`) 