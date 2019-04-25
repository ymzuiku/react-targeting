# 基于发布订阅的状态管理

## 下载 & 使用

懒得编译发布了, 进入项目

```sh
cd your-project/components
```

执行以下命令, 将会只保留组件代码

```sh
git clone --depth=1 https://github.com/ymzuiku/react-targeting.git && rm -rf react-targeting/.git react-targeting/.gitignore
```

直接引用

```js
import {
  Targeting,
  useTargeting,
  withTargeting
} from "components/react-targeting";
```

react-targeting 分别提供了三种模式的使用:

- Targeting 基于 renderProps 的模式
- useTargeting 基于 hooks 的模式
- withTargeting 基于 HOC 的模式

## 基于 React.Component 的使用

import { Targeting } from "components/react-targeting";

```js
function OtherComponent() {
    const [value, setValue] = useTargeting("唯一的key");

  return <div>other-component: {value.title}</div>;
}

export default class extends React.Component {
  render(){
    return (
      <Targeting defaultValue={title:'默认值'}>
        {(value, setValue)=>{
          <div>
            <OtherComponent />
            <div>{value.title}</div>
            <button onClick={()=> setValue({value:'更新全局状态'})}>更新</button>
          </div>
        }}
      </Targeting>
    );
  }
};
```

## 基于 hooks 的 使用

```js
import { useTargeting } from "components/react-targeting";

function OtherComponent() {
  const [value, setValue] = useTargeting("唯一的key");

  return <div>other-component: {value.title}</div>;
}

export default () => {
  const [value, setValue] = useTargeting("唯一的key", { title: "默认值" });

  React.Effect(() => {
    setTimeout(() => {
      setValue({ title: "同步更新了多个组件" });
    }, 1000);
  }, []);

  return (
    <div>
      <OtherComponent />
      <div>{value.title}</div>
    </div>
  );
};
```

## 异步更新数据

```js
import { useTargeting } from "components/react-targeting";

export default () => {
  const [value, setValue] = useTargeting(
    "唯一的key",
    { data: {} },
    (update, params) => {
      // Targeting 的第三个参数是在更新前进行捕获, 在做完行为之后, 再手动调用 update 进行更新, 这样可以处理异步或其他操作
      fetch("/api/...", { method: "GET", body: JSON.stringify(params) })
        .then(res => res.json())
        .then(data => {
          update(data);
        })
        .catch(error => {
          update(error);
        });
    }
  );

  React.useEffect(() => {
    setValue({ userName: "dog", password: "123456" });
  }, []);

  return (
    <div>
      <OtherComponent />
      <div>{JSON.stringify(value)}</div>
    </div>
  );
};
```
