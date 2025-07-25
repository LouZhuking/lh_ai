import {
  useReposStore
} from '../../store/repos'
import { useEffect } from 'react'

const RepoList = () => {
  const { repos, loading, fetchRepos, error } = useReposStore()
  useEffect(() => {
    fetchRepos()
  }, [])
  if (loading) return <p>loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h2>Repo List</h2>
      <ul>
        {
          repos.map(repo => (
            <li key={repo.id}>
              <a href={repo.html_url} target="_blank" rel="noreferrer">
                {repo.name}
              </a>
              <p>{repo.description || 'No description'}</p>
            </li>
          ))
        }
        {
          error && <li>{error}</li>
        }
      </ul>
    </div>
  )
}
export default RepoList