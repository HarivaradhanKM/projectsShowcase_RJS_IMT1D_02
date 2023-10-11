import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstant = {
  initial: 'INITIAL',
  inprogress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProjectsShowcase extends Component {
  state = {apiStatus: apiStatusConstant.initial, category: categoriesList[0].id}

  componentDidMount() {
    this.fetchData()
  }

  formatData = data => {
    const formattedData = data.map(eachData => ({
      id: eachData.id,
      name: eachData.name,
      imageUrl: eachData.image_url,
    }))
    return formattedData
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-image"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
      />
      <h1 className="failure-page-heading">Oops! Something Went Wrong</h1>
      <p className="failure-page-description">
        We cannot seem to find the page you are looking for
      </p>
      <button className="retry-button" type="button" onClick={this.fetchData}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" height={50} width={50} color="#328af2" />
    </div>
  )

  fetchData = async () => {
    this.setState({apiStatus: apiStatusConstant.inprogress})
    const {category} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${category}`
    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = this.formatData(data.projects)
      this.setState({apiStatus: apiStatusConstant.success, data: formattedData})
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  onChangeInputOption = event => {
    this.setState({category: event.target.value}, this.fetchData)
  }

  renderSuccessView = () => {
    const {data} = this.state
    return (
      <ul className="project-items-container">
        {data.map(eachData => (
          <li key={eachData.id} className="project">
            <img
              src={eachData.imageUrl}
              alt={eachData.name}
              className="project-image"
            />
            <p className="project-name">{eachData.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderSearchInput = () => {
    const {category} = this.state
    return (
      <div className="select-input-container">
        <select
          className="select-input"
          value={category}
          onChange={this.onChangeInputOption}
        >
          {categoriesList.map(eachOption => (
            <option key={eachOption.id} value={eachOption.id}>
              {eachOption.displayText}
            </option>
          ))}
        </select>
      </div>
    )
  }

  renderProjectsShowcase = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderSuccessView()
      case apiStatusConstant.inprogress:
        return this.renderLoader()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <nav className="navbar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </nav>
        <div className="projects-container">
          <>
            {this.renderSearchInput()}
            {this.renderProjectsShowcase()}
          </>
        </div>
      </div>
    )
  }
}

export default ProjectsShowcase
