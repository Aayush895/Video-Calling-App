import { useParams } from 'react-router'

function Room() {
  const { id } = useParams()
  return <div>User joined the room with id: {id}</div>
}
export default Room
