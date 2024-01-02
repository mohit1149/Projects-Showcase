import './index.css'

const ProjectListItem = props => {
  const {eachProject} = props
  const {imageUrl, name} = eachProject

  return (
    <li className="project-item-list">
      <img className="list-image" alt={name} src={imageUrl} />
      <p className="list-item-heading">{name}</p>
    </li>
  )
}

export default ProjectListItem
