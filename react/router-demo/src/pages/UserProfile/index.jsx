import {
  useEffect
} from 'react'
import {
  useParams
} from 'react-router-dom'
const UserProfile = () => {
  const { id } = useParams();
  useEffect(() => {
    console.log(window.location);
  }, [])

  return (
    <>
      <h1>User Profile {id}</h1>
    </>
  )
}

export default UserProfile;