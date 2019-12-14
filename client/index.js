import ReactDom from 'react-dom'
import App from '../src/App'

export default ReactDom.hydrate(App, document.getElementById('root'))
