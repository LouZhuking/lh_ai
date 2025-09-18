//  封装
// callback  fn
// useEffect  remove

import {
    useEffect,
    useRef
} from 'react';

export default function useInterval(callback, delay) {
    // 存储可改变对象，
    //     const savedCallback = useRef();
    //     用 useRef 保存回调，避免闭包捕获旧值。
    // useEffect 单独监听 callback，只更新引用，不重启定时器。
    // 另一个 useEffect 管理定时器，依赖 delay。
    // delay 变化时自动清除旧定时器，防止内存泄漏。
    // 支持传 null 暂停定时器，实现灵活控制。
    // 分离依赖，逻辑清晰，避免重复创建。
    // 封装良好，可复用，是处理副作用的优秀实践。

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback])

    // 添加定时器
    // 移除定时器
    useEffect(() => {
        if (delay === null) return
        const tick = () => savedCallback.current();
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay])
}