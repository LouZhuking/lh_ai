import {
  useParams,
  useNavigate,
  Link
} from 'react-router-dom'
import {
  useEffect
} from 'react'
import {
  useRepos
} from '@/hooks/useRepos'

const RepoList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // hooks
  const { repos, loading, error } = useRepos(id);

  useEffect(() => {
    if (!id.trim()) {
      navigate('/');
      return;
    }

  }, []);

  if (loading) return (<>Loading...</>)
  if (error) return (<>Error: {error}</>)


  return (
    <>
      <h2>Repositories for {id}</h2>
      {
        repos.map((repo) => (
          <Link key={repo.id} to={`/users/${id}/repos/${repo.name}`}>
            {repo.name}
            <br />
          </Link>
        ))
      }
    </>
  )
}

export default RepoList     