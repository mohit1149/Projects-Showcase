import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectListItem from '../ProjectListItem'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectsShowcase extends Component {
  state = {
    activeOptionId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjectCategory()
  }

  getProjectCategory = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeOptionId} = this.state
    const response = await fetch(
      `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`,
    )
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeSelectedCategory = event => {
    this.setState({activeOptionId: event.target.value}, this.getProjectCategory)
  }

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.getProjectCategory}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProductsListView = () => {
    const {projectsList} = this.state

    return (
      <ul className="unOrder-list-of-projects">
        {projectsList.map(eachProject => (
          <ProjectListItem key={eachProject.id} eachProject={eachProject} />
        ))}
      </ul>
    )
  }

  renderAllProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeOptionId} = this.state
    return (
      <div className="project-showcase-bg-container">
        <nav className="navbar">
          <img
            className="project-showcase-logo"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          />
        </nav>
        <select
          className="selection-of-project"
          onChange={this.onChangeSelectedCategory}
          value={activeOptionId}
        >
          {categoriesList.map(eachCategory => (
            <option
              key={eachCategory.id}
              value={eachCategory.id}
              className="selected-item"
            >
              {eachCategory.displayText}
            </option>
          ))}
        </select>
        {this.renderAllProducts()}
      </div>
    )
  }
}

export default ProjectsShowcase
