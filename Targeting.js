import { Component } from 'react';
import observer from './observer';

export default class extends Component {
  removeSubscribe = void 0;

  setValue = void 0;

  constructor(props) {
    super(props);

    if (typeof props.id !== 'string') {
      throw new Error(`<Targeting id="?" />: id not is string`);
    }

    if (typeof props.children !== 'function') {
      throw new Error('Targeting: children need is Function');
    }

    this.state = {
      value: observer.values[props.id] || props.defaultValue,
    };

    this.removeSubscribe = observer.subscribe(props.id, this.updateNextValue);

    this.setValue = (...args) => {
      if (observer.triggers[props.id]) {
        observer.triggers[props.id](...args);
      }
    };
  }

  updateNextValue = params => {
    const { update } = this.props;
    const { value } = this.state;

    if (typeof update === 'function') {
      update(this.setNextValue, value, params);
    } else {
      this.setNextValue(params);
    }
  };

  setNextValue = nextValue => {
    this.setState(() => {
      return {
        value: nextValue,
      };
    });
  };

  shouldComponentUpdate(nextProps) {
    // 如果key更新, 则更新新的subscribe
    if (nextProps.id !== this.props.id) {
      this.removeSubscribe();
      this.removeSubscribe = observer.subscribe(nextProps.id, this.updateNextValue);

      this.setValue = (...args) => {
        if (observer.triggers[nextProps.id]) {
          observer.triggers[nextProps.id](...args);
        }
      };
    }

    return true;
  }

  componentWillUnmount() {
    if (this.removeSubscribe) {
      this.removeSubscribe();
    }

    this.setValue = () => {};
  }

  render() {
    const { children, update } = this.props;
    const { value: payload } = this.state;

    return children(payload, this.setValue, update);
  }
}
