import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="container text-center mt-5">
      <h1>404</h1>
      <p className="lead">Sidan hittades inte.</p>
      <Link to="/" className="btn btn-primary">
        Gå tillbaka till startsidan
      </Link>
    </div>
  )
}

export default NotFoundPage