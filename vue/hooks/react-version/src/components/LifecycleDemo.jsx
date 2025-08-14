import { Component } from 'react'
import Child from './Child'

class LifecycleDemo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      count: 0
    }
  }
  // 状态，生命周期
  // JSX

  doIncrement() {
    this.setState({
      count: this.state.count + 1
    })
  }

  componentDidMount() {
    console.log('组件挂载了');
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('组件更新了');
  }
  componentWillUnmount() {
    console.log('组件要卸载了');
  }
  componentDid

  render() {
    return (
      <>
        <h1>Lifecycle Demo</h1>
        <p>Count: {this.state.count}</p>
        <button onClick={this.doIncrement}>Increment</button>
        <Child title={"Hello"} />
      </>
    )
  }

}

export default LifecycleDemo