# 状态管理

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
import { useTargeting } from "components/react-targeting";
```
