import React, { PureComponent } from 'react';
import observer from './observer';

export default (id, defaultValue, update) => {
  if (id === void 0) {
    throw new Error('withTargeting: id is undefined ');
  }
  return TargetComponent => {
    class ProviderComponent extends PureComponent {
      removeSubscribe = void 0;

      setValue = void 0;

      constructor(props) {
        super(props);

        this.state = {
          value: observer.values[props.id] || defaultValue,
        };

        this.removeSubscribe = observer.subscribe(id, this.setNextValue);
        this.setValue = (...args) => {
          if (observer.triggers[props.id]) {
            observer.triggers[props.id](...args);
          }
        };
      }

      updateNextValue = params => {
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

      componentWillUnmount() {
        if (this.removeSubscribe) {
          this.removeSubscribe();
        }
        this.setValue = () => {};
      }

      render() {
        const { forwardedRef, ...rest } = this.props;
        const { value } = this.state;

        return <TargetComponent ref={forwardedRef} targetValue={value} setTargetValue={this.setValue} {...rest} />;
      }
    }
    return React.forwardRef((props, ref) => {
      return <ProviderComponent {...props} forwardedRef={ref} />;
    });
  };
};
